#!/usr/bin/env python3
"""
信奥赛C++ 宣传视频 - 动态版
带交叉淡入淡出过渡、文字动画、合成背景音乐
"""
import os, math, struct
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio
import imageio_ffmpeg

OUT = os.path.join(os.path.dirname(__file__), "..", "assets")
os.makedirs(OUT, exist_ok=True)

# ── 配置 ──
FPS = 24                      # 24fps 让动画更流畅
SEC_PER_SLIDE = 4             # 每页停留秒数
SEC_TRANSITION = 0.8          # 过渡时长
W, H = 1920, 1088             # 1088 确保宏块对齐
SAMPLE_RATE = 44100           # 音频采样率

# ── 配色 ──
C_BG      = (13, 17, 23)
C_CARD    = (22, 27, 34)
C_ACCENT  = (255, 123, 114)
C_ACCENT2 = (88, 166, 255)
C_GOLD    = (255, 215, 0)
C_WHITE   = (240, 246, 252)
C_GRAY    = (139, 148, 158)
C_GREEN   = (46, 160, 67)

FONT_PATH = "/System/Library/Fonts/STHeiti Medium.ttc"

def font(sz):
    return ImageFont.truetype(FONT_PATH, sz)

# ═══════════════════════════════════════
#  BG MUSIC GENERATOR
# ═══════════════════════════════════════

def gen_sine(freq, duration, sr=SAMPLE_RATE, amp=0.3):
    """生成正弦波"""
    t = np.linspace(0, duration, int(sr * duration), False)
    return amp * np.sin(2 * np.pi * freq * t)

def gen_envelope(n, attack=0.05, decay=0.1, release=0.2):
    """ADSR 包络"""
    env = np.ones(n)
    a = int(n * attack)
    d = int(n * decay)
    r = int(n * release)
    env[:a] = np.linspace(0, 1, a)
    env[a:a+d] = np.linspace(1, 0.7, d)
    env[-r:] = np.linspace(0.7, 0, r)
    return env

def gen_note(freq, duration, amp=0.25):
    """单一音符带包络"""
    sr = SAMPLE_RATE
    n = int(sr * duration)
    t = np.linspace(0, duration, n, False)
    # 主音 + 泛音
    sig = amp * np.sin(2 * np.pi * freq * t)
    sig += 0.3 * amp * np.sin(2 * np.pi * freq * 2 * t)  # 泛音
    sig += 0.1 * amp * np.sin(2 * np.pi * freq * 3 * t)
    sig *= gen_envelope(n, 0.05, 0.1, 0.3)
    return sig

def generate_bg_music(total_seconds):
    """生成背景音乐（低音pad + 简单旋律 + 节拍）"""
    sr = SAMPLE_RATE
    total_samples = int(sr * total_seconds)
    track = np.zeros(total_samples)
    beat = np.zeros(total_samples)
    bass = np.zeros(total_samples)

    BPM = 100
    beat_interval = 60 / BPM  # 每拍秒数

    # ── 和弦进行（C大调） ──
    chords = [
        (261.63, 329.63, 392.00),  # C E G
        (220.00, 277.18, 329.63),  # A D F
        (196.00, 246.94, 293.66),  # G B D
        (174.61, 220.00, 261.63),  # F A C
    ]

    # ── 旋律音符 ──
    melody = [
        (523.25, 0.5), (587.33, 0.25), (659.25, 0.25),
        (783.99, 0.5), (659.25, 0.25), (587.33, 0.25),
        (523.25, 0.5), (493.88, 0.25), (440.00, 0.25),
        (392.00, 1.0), (440.00, 0.5), (493.88, 0.5),
    ]

    # ── 叠加pad ──
    for ci, (f1, f2, f3) in enumerate(chords):
        dur = beat_interval * 8  # 每个和弦8拍
        start_s = ci * dur
        if start_s >= total_seconds:
            break
        n = int(sr * min(dur, total_seconds - start_s))
        pad = np.zeros(n)
        t = np.linspace(0, min(dur, total_seconds - start_s), n, False)
        pad += 0.08 * np.sin(2 * np.pi * f1 * t)
        pad += 0.08 * np.sin(2 * np.pi * f2 * t)
        pad += 0.08 * np.sin(2 * np.pi * f3 * t)
        # 淡入淡出
        fade = min(int(n * 0.15), 2000)
        pad[:fade] *= np.linspace(0, 1, fade)
        pad[-fade:] *= np.linspace(1, 0, fade)
        s = int(start_s * sr)
        e = min(s + n, total_samples)
        bass[s:e] += pad[:e-s]

    # ── 节拍 ──
    for i in range(int(total_seconds / beat_interval) + 1):
        s = int(i * beat_interval * sr)
        if s >= total_samples: break
        n = int(sr * 0.08)
        e = min(s + n, total_samples)
        # Kick drum
        kick = np.sin(2 * np.pi * 60 * np.linspace(0, 0.08, e-s)) * np.exp(-np.linspace(0, 15, e-s))
        beat[s:e] += 0.4 * kick[:e-s]
        # Hi-hat on off-beats
        if i % 2 == 1:
            hh_n = int(sr * 0.03)
            hh_e = min(s + hh_n, total_samples)
            hh = np.random.randn(hh_e - s) * 0.12
            beat[s:hh_e] += hh[:hh_e-s]

    # ── 旋律 ──
    mel_pos = 0
    for freq, dur in melody * 4:  # 重复4次
        if mel_pos >= total_seconds:
            break
        n = int(sr * min(dur, total_seconds - mel_pos))
        s = int(mel_pos * sr)
        e = min(s + n, total_samples)
        note = gen_note(freq, min(dur, total_seconds - mel_pos))
        track[s:e] += 0.15 * note[:e-s]
        mel_pos += dur

    # ── 混合 ──
    final = bass + beat * 0.5 + track
    # 标准化
    mx = np.max(np.abs(final))
    if mx > 0:
        final = final / mx * 0.7
    return final

# ═══════════════════════════════════════
#  DRAWING HELPERS
# ═══════════════════════════════════════

def draw_bg(d):
    """渐变背景"""
    for y in range(H):
        r = int(13 + 9 * y / H)
        g = int(17 + 10 * y / H)
        b = int(23 + 11 * y / H)
        d.line((0, y, W, y), fill=(r, g, b))

def draw_grid(d, offset=0):
    """微妙的网格背景"""
    for x in range(0, W, 80):
        alpha = int(15 + 5 * math.sin(offset + x / 100))
        d.line([(x, 0), (x, H)], fill=(255, 255, 255, alpha))
    for y in range(0, H, 80):
        alpha = int(15 + 5 * math.sin(offset + y / 100))
        d.line([(0, y), (W, y)], fill=(255, 255, 255, alpha))

def draw_card(d, x, y, w, h, title, desc, accent=C_ACCENT):
    """卡片，带左边框高亮"""
    d.rounded_rectangle([x, y, x+w, y+h], radius=16, fill=C_CARD)
    d.rounded_rectangle([x, y, x+6, y+h], radius=3, fill=accent)  # 左侧条
    d.text((x+28, y+22), title, fill=C_WHITE, font=font(28))
    d.text((x+28, y+66), desc, fill=C_GRAY, font=font(20))

def draw_badge(d, x, y, text, color=C_ACCENT):
    ff = font(24)
    bw = int(d.textlength(text, ff)) + 28
    d.rounded_rectangle([x, y, x+bw, y+40], radius=20, fill=color)
    d.text((x+bw//2, y+20), text, fill=C_WHITE, font=ff, anchor="mm")

def draw_code(d, x, y, lines, w=860, highlight=-1):
    ff = font(21)
    lh = 34
    pad = 22
    bh = len(lines) * lh + 2 * pad
    d.rounded_rectangle([x, y, x+w, y+bh], radius=12, fill=(13,17,23))
    for dx, col in [(14,'#ff5f56'),(36,'#ffbd2e'),(58,'#27c93f')]:
        d.ellipse([x+dx, y+12, x+dx+10, y+22], fill=col)
    for i, line in enumerate(lines):
        fy = y + pad + i * lh
        if i == highlight:
            d.rounded_rectangle([x+10, fy-2, x+w-10, fy+lh], radius=4, fill=(255,255,255,10))
            d.text((x+pad, fy), line, fill=C_GOLD, font=ff)
        else:
            d.text((x+pad, fy), line, fill=(205,214,244), font=ff)

def draw_cta(d, x, y, text):
    """发光按钮"""
    d.rounded_rectangle([x-190, y-32, x+190, y+32], radius=32, fill=C_ACCENT)
    # 发光
    for r in range(3):
        alpha = 20 - r * 6
        d.rounded_rectangle([x-190-r, y-32-r, x+190+r, y+32+r],
                           radius=32+r, outline=(*C_ACCENT, alpha), width=2)
    d.text((x, y), text, fill=C_WHITE, font=font(32), anchor="mm")

def draw_progress_ring(d, cx, cy, r, pct, color=C_ACCENT):
    """环形进度条"""
    import math
    # 背景圆
    d.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(48,54,61), width=8)
    # 进度弧
    if pct > 0:
        angles = 360 * pct / 100
        # 用弧线模拟
        steps = max(int(angles), 10)
        for i in range(steps):
            a1 = math.radians(-90 + angles * i / steps)
            a2 = math.radians(-90 + angles * (i+1) / steps)
            x1 = cx + (r-4) * math.cos(a1)
            y1 = cy + (r-4) * math.sin(a1)
            x2 = cx + (r-4) * math.cos(a2)
            y2 = cy + (r-4) * math.sin(a2)
            d.line([x1, y1, x2, y2], fill=color, width=8)

# ═══════════════════════════════════════
#  SLIDE RENDERERS (with animation support)
# ═══════════════════════════════════════

def render_slide(fn_num, progress):
    """
    渲染一页的某一帧
    progress: 0~1 在当前页的进度（用于动画）
    """
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    draw_bg(d)
    draw_grid(d, progress * 6.28)

    # 淡入动画
    fade = min(1, progress * 3)  # 前1/3时间淡入
    alpha = int(255 * fade)

    if fn_num == 0:  # 封面
        # 大标题从下方弹入
        title_y = int(150 - max(0, 1 - progress * 2) * 60)
        draw_badge(d, W//2-100, 80, "🆓 完全免费 · 开源")
        d.text((W//2, title_y), "信奥赛 C++ 学习站", fill=C_WHITE, font=font(68), anchor="mt")
        d.text((W//2, 220), "从零到金牌选手 · 系统掌握 C++ 与算法竞赛知识",
               fill=C_GRAY, font=font(26), anchor="mt")

        # 统计数字（自下而上弹入）
        for i, (n, l) in enumerate([("21+", "知识点"), ("8", "练习题"), ("5", "代码模板")]):
            dy = int(max(0, 1 - progress * 2.5) * 40 * (i + 1))
            d.text((W//2-240 + i*240, 400 - dy), n, fill=C_ACCENT, font=font(56), anchor="mt")
            d.text((W//2-240 + i*240, 460 - dy), l, fill=C_GRAY, font=font(22), anchor="mt")

    elif fn_num == 1:  # 三阶段路线
        draw_badge(d, W//2-90, 80, "📖 循序渐进")
        d.text((W//2, 150), "三阶段学习路线", fill=C_WHITE, font=font(58), anchor="mt")
        d.text((W//2, 215), "从入门到竞赛金牌，每一步都为你规划好",
               fill=C_GRAY, font=font(24), anchor="mt")

        colors = [C_GREEN, C_ACCENT2, C_GOLD]
        for i, (title, desc) in enumerate([
            ("🌱 第一阶段·入门", "环境搭建 · 变量/循环 · 数组/字符串"),
            ("⚡ 第二阶段·进阶", "函数递归 · 指针 · STL · 文件读写"),
            ("🔥 第三阶段·竞赛", "DFS/BFS · DP · 图论 · 数论"),
        ]):
            delay = i * 0.2
            card_prog = max(0, min(1, (progress - delay) * 3))
            x = 150 + i * 570
            y = int(320 + max(0, 1 - card_prog) * 80)
            w = 480
            d.rounded_rectangle([x, y, x+w, y+130], radius=16, fill=C_CARD)
            d.rounded_rectangle([x, y, x+6, y+130], radius=3, fill=colors[i])
            d.text((x+28, y+24), title, fill=C_WHITE, font=font(28))
            d.text((x+28, y+72), desc, fill=C_GRAY, font=font(20))

    elif fn_num == 2:  # C++ 基础
        draw_badge(d, W//2-80, 80, "💻 C++ 基础")
        d.text((W//2, 150), "核心语法全掌握", fill=C_WHITE, font=font(58), anchor="mt")
        d.text((W//2, 215), "变量、输入输出优化、STL 容器——信奥赛必备",
               fill=C_GRAY, font=font(24), anchor="mt")

        # 代码高亮动画
        hl = int(progress * 6) % 6
        draw_code(d, 530, 320, [
            '  ios::sync_with_stdio(false);',
            '  cin.tie(nullptr);              // 快速 I/O',
            '  vector<int> v = {1, 2, 3};',
            '  sort(v.begin(), v.end());      // 排序',
            '  map<string,int> mp;',
            '  mp["key"] = 42;                // 键值对',
        ], highlight=hl)

    elif fn_num == 3:  # 算法
        draw_badge(d, W//2-60, 80, "🧠 算法")
        d.text((W//2, 150), "信奥赛高频考点", fill=C_WHITE, font=font(58), anchor="mt")
        d.text((W//2, 215), "动态规划 · 搜索 · 图论 · 数论，一网打尽",
               fill=C_GRAY, font=font(24), anchor="mt")

        hl = int(progress * 5) % 5
        draw_code(d, 530, 320, [
            '  // 01背包 DP',
            '  for (int i = 1; i <= n; i++)',
            '    for (int j = m; j >= w[i]; j--)',
            '      dp[j] = max(dp[j], dp[j-w[i]] + v[i]);',
            '  // Dijkstra 最短路',
        ], highlight=hl)

    elif fn_num == 4:  # 在线编译器
        draw_badge(d, W//2-70, 80, "⚙️ 在线工具")
        d.text((W//2, 150), "在线 C++ 编译器", fill=C_WHITE, font=font(58), anchor="mt")
        d.text((W//2, 215), "无需安装 · 一键运行 · 内置模板",
               fill=C_GRAY, font=font(24), anchor="mt")

        # 模拟代码编辑器
        d.rounded_rectangle([300, 340, 1620, 680], radius=12, fill=(13,17,23))
        # 顶部工具栏
        d.rounded_rectangle([300, 340, 1620, 375], radius=0, fill=(30,35,45))
        d.rounded_rectangle([300, 340, 1620, 375], radius=0, fill=(30,35,45))
        for dx, col in [(315,'#ff5f56'),(335,'#ffbd2e'),(355,'#27c93f')]:
            d.ellipse([dx, 350, dx+10, 360], fill=col)
        d.text((380, 349), "main.cpp  —  点击运行", fill=C_GRAY, font=font(16))

        code_lines = [
            '#include <bits/stdc++.h>',
            'using namespace std;',
            'int main() {',
            '    vector<int> a = {3, 1, 4, 1, 5};',
            '    sort(a.begin(), a.end());',
            '    for (int x : a) cout << x << " ";',
            '    return 0;',
            '}',
        ]
        cf = font(20)
        for i, line in enumerate(code_lines[:7]):  # 显示7行
            d.text((320, 390 + i * 32), line, fill=(205,214,244), font=cf)

        # 运行按钮脉冲动画
        btn_pulse = 0.5 + 0.5 * math.sin(progress * 8)
        btn_r = int(16 + btn_pulse * 3)
        d.rounded_rectangle([W//2-60, 710, W//2+60, 740], radius=btn_r, fill=C_GREEN)
        d.text((W//2, 725), "▶ 运行", fill=C_WHITE, font=font(20), anchor="mm")

    elif fn_num == 5:  # 刷题
        draw_badge(d, W//2-50, 80, "📝 刷题")
        d.text((W//2, 150), "刷题练习 + 自动判分", fill=C_WHITE, font=font(58), anchor="mt")
        d.text((W//2, 215), "选择题即时反馈，每道题都有详细解析",
               fill=C_GRAY, font=font(24), anchor="mt")

        # 模拟一道选择题
        d.rounded_rectangle([260, 330, 1660, 780], radius=16, fill=C_CARD)
        d.text((300, 360), "Q: int 类型能表示的最大值大约是多少？", fill=C_WHITE, font=font(26))

        options = ["A. 2³¹-1 ≈ 21亿", "B. 2³²-1 ≈ 43亿", "C. 2¹⁶-1 ≈ 6.5万", "D. 2⁶⁴-1"]
        for i, opt in enumerate(options):
            y = 420 + i * 60
            # 选中效果
            if i == 0:
                d.rounded_rectangle([300, y, 1620, y+48], radius=10, fill=(46,160,67,40))
                d.rounded_rectangle([300, y, 1620, y+48], radius=10, outline=C_GREEN, width=2)
                d.text((320, y+24), "✅ " + opt, fill=C_GREEN, font=font(22), anchor="lm")
            else:
                d.rounded_rectangle([300, y, 1620, y+48], radius=10, fill=(48,54,61))
                d.text((320, y+24), opt, fill=C_GRAY, font=font(22), anchor="lm")

        # 结果提示
        d.rounded_rectangle([300, 720, 1620, 760], radius=10, fill=(46,160,67,30))
        d.text((320, 740), "✅ 正确！int 占 32 位，最高位为符号位", fill=C_GREEN, font=font(20), anchor="lm")

    elif fn_num == 6:  # 进度追踪
        draw_badge(d, W//2-50, 80, "📊 进度")
        d.text((W//2, 150), "学习进度一目了然", fill=C_WHITE, font=font(58), anchor="mt")
        d.text((W//2, 215), "环形进度条 · 已完成知识点 · 成就感满满",
               fill=C_GRAY, font=font(24), anchor="mt")

        # 环形进度动画
        ring_pct = min(100, progress * 200)
        draw_progress_ring(d, W//2, 430, 100, ring_pct, C_ACCENT)
        d.text((W//2, 430), f"{int(ring_pct)}%", fill=C_WHITE, font=font(34), anchor="mm")

        # 已完成标签
        labels = ["环境搭建", "变量与类型", "条件判断", "循环语句",
                  "数组与字符串", "函数与递归"]
        visible = int(ring_pct / 100 * len(labels))
        for i, label in enumerate(labels):
            x = 300 + i * 230
            y = 560
            if i < visible:
                d.rounded_rectangle([x, y, x+210, y+36], radius=18, fill=C_ACCENT)
                d.text((x+105, y+18), f"✅ {label}", fill=C_WHITE, font=font(16), anchor="mm")
            else:
                d.rounded_rectangle([x, y, x+210, y+36], radius=18, fill=(48,54,61))
                d.text((x+105, y+18), f"○ {label}", fill=C_GRAY, font=font(16), anchor="mm")

    elif fn_num == 7:  # 结尾
        draw_badge(d, W//2-70, 80, "🚀 现在就访问")
        # 大标题缩放动画
        scale = 1.0 + 0.03 * math.sin(progress * 4)
        d.text((W//2, 170), "开始你的信奥赛之路", fill=C_WHITE, font=font(64), anchor="mt")
        d.text((W//2, 240), "完全免费 · 无需注册 · 随时随地学习",
               fill=C_GRAY, font=font(26), anchor="mt")

        # 网址闪烁
        blink = 0.7 + 0.3 * math.sin(progress * 6)
        r = int(C_ACCENT[0] * blink)
        g = int(C_ACCENT[1] * blink)
        b = int(C_ACCENT[2] * blink)
        d.rounded_rectangle([W//2-230, 440, W//2+230, 510], radius=35, fill=(r, g, b))

        # 发光效果
        for glow_r in range(8, 0, -1):
            a = 8 - glow_r
            d.rounded_rectangle([W//2-230-glow_r, 440-glow_r, W//2+230+glow_r, 510+glow_r],
                              radius=35+glow_r, outline=(*C_ACCENT, a), width=1)

        d.text((W//2, 475), "xinaosai.github.io", fill=C_WHITE, font=font(34), anchor="mm")

        # 底部文字
        d.text((W//2, 600), "觉得有用？请帮忙一键三连 ❤️", fill=C_GRAY, font=font(24), anchor="mt")

        # 闪烁的三连提示
        if int(progress * 4) % 2 == 0:
            d.text((W//2, 660), "⭐ 收藏 · 👍 点赞 · 🔄 转发", fill=C_GOLD, font=font(20), anchor="mt")

    # 水印
    d.text((W//2, H-25), "xinaosai.github.io", fill=(60,70,90), font=font(18), anchor="mb")
    return img

def blend_frames(img1, img2, t):
    """线性混合两张图（alpha blend）"""
    a1 = np.array(img1, dtype=np.float32)
    a2 = np.array(img2, dtype=np.float32)
    blended = (1 - t) * a1 + t * a2
    return Image.fromarray(blended.astype(np.uint8))

# ═══════════════════════════════════════
#  RENDER
# ═══════════════════════════════════════

NUM_SLIDES = 8
frames_per_slide = FPS * SEC_PER_SLIDE
frames_transition = int(FPS * SEC_TRANSITION)
total_frames = NUM_SLIDES * frames_per_slide + (NUM_SLIDES - 1) * frames_transition
total_seconds = total_frames / FPS

print(f"🎬 生成动态视频: {total_frames} 帧 = {total_seconds:.1f}s @ {FPS}fps")
print(f"   先渲染所有帧...")

all_frames = []

for si in range(NUM_SLIDES):
    print(f"   第 {si+1}/{NUM_SLIDES} 页...", end=" ", flush=True)
    for fi in range(frames_per_slide):
        progress = fi / frames_per_slide
        frame = render_slide(si, progress)
        all_frames.append(frame)
    print(f"✓")

    # 过渡帧
    if si < NUM_SLIDES - 1:
        print(f"   过渡 {si+1}→{si+2}...", end=" ", flush=True)
        next_start = render_slide(si + 1, 0)
        for ti in range(frames_transition):
            t = (ti + 1) / (frames_transition + 1)
            frame = blend_frames(all_frames[-1], next_start, t)
            all_frames.append(frame)
        print(f"✓")

print(f"\n🎵 生成背景音乐...")
music = generate_bg_music(total_seconds + 0.5)

# 写入视频
video_path = os.path.join(OUT, "xinaosai_promo.mp4")
print(f"💾 写入视频+音频: {video_path}")

# 先用 imageio 写无音频视频
temp_video = os.path.join(os.path.dirname(__file__), "_temp_nosound.mp4")
with imageio.get_writer(temp_video, fps=FPS, codec="libx264",
                        quality=8, pixelformat="yuv420p") as writer:
    for frame in all_frames:
        writer.append_data(np.array(frame))

# 用 ffmpeg 合并音频
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

# 写 wav
wav_path = os.path.join(os.path.dirname(__file__), "_temp_audio.wav")
music_int16 = (music * 32767).astype(np.int16)
with open(wav_path, "wb") as f:
    import wave
    with wave.open(f, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(music_int16.tobytes())

print(f"   合并音频...")
cmd = [
    ffmpeg, "-y",
    "-i", temp_video,
    "-i", wav_path,
    "-c:v", "libx264",
    "-preset", "fast",
    "-crf", "20",
    "-c:a", "aac",
    "-shortest",
    video_path
]
import subprocess
subprocess.run(cmd, capture_output=True)

# 清理临时文件
os.remove(temp_video)
os.remove(wav_path)

sz = os.path.getsize(video_path)
print(f"✅ 完成!  文件: {video_path} ({sz/1024/1024:.1f} MB)")
print(f"   时长: {total_seconds:.1f}s")
