#!/usr/bin/env python3
"""信奥赛C++ 宣传视频 - 纯 Pillow + imageio"""
import os
from PIL import Image, ImageDraw, ImageFont
import imageio
import numpy as np

OUT = os.path.join(os.path.dirname(__file__), "..", "assets")
os.makedirs(OUT, exist_ok=True)

# 配色
C_BG       = (13, 17, 23)
C_CARD     = (22, 27, 34)
C_ACCENT   = (255, 123, 114)
C_ACCENT2  = (88, 166, 255)
C_WHITE    = (240, 246, 252)
C_GRAY     = (139, 148, 158)
W, H       = 1920, 1080
FONT_PATH  = "/System/Library/Fonts/STHeiti Medium.ttc"

def f(sz):
    return ImageFont.truetype(FONT_PATH, sz)

def draw_bg(d):
    for y in range(H):
        r = int(13 + 9 * y / H)
        g = int(17 + 10 * y / H)
        b = int(23 + 11 * y / H)
        d.line((0, y, W, y), fill=(r, g, b))

def draw_card(d, x, y, w, h, title, desc):
    d.rounded_rectangle([x, y, x+w, y+h], radius=16, fill=C_CARD)
    d.text((x+28, y+22), title, fill=C_WHITE, font=f(30))
    d.text((x+28, y+68), desc, fill=C_GRAY, font=f(22))

def draw_badge(d, x, y, text):
    ff = f(26)
    bw = d.textlength(text, ff) + 28
    d.rounded_rectangle([x, y, x+bw, y+42], radius=21, fill=C_ACCENT)
    d.text((x+bw//2, y+21), text, fill=C_WHITE, font=ff, anchor="mm")

def draw_code(d, x, y, lines, w=860):
    ff = f(22)
    lh = 36; pad = 22
    bh = len(lines) * lh + 2 * pad
    d.rounded_rectangle([x, y, x+w, y+bh], radius=12, fill=(13,17,23))
    for dx, col in [(14,'#ff5f56'),(36,'#ffbd2e'),(58,'#27c93f')]:
        d.ellipse([x+dx, y+12, x+dx+10, y+22], fill=col)
    for i, l in enumerate(lines):
        d.text((x+pad, y+pad+i*lh), l, fill=(205,214,244), font=ff)

def draw_stat(d, x, y, num, label):
    d.text((x, y), str(num), fill=C_ACCENT, font=f(54), anchor="mt")
    d.text((x, y+56), label, fill=C_GRAY, font=f(22), anchor="mt")

def draw_cta(d, x, y, text):
    d.rounded_rectangle([x-180, y-30, x+180, y+30], radius=30, fill=C_ACCENT)
    d.text((x, y), text, fill=C_WHITE, font=f(32), anchor="mm")

def draw_watermark(d):
    d.text((W//2, H-30), "xinaosai.github.io", fill=(60,70,90), font=f(22), anchor="mb")

# ── 每页渲染函数列表 ──
# 参数 (d) => 绘制该页内容

def slide_1(d):
    draw_badge(d, W//2-100, 80, "🆓 完全免费 · 开源")
    d.text((W//2, 150), "信奥赛 C++ 学习站", fill=C_WHITE, font=f(60), anchor="mt")
    d.text((W//2, 215), "从零到金牌选手 · 系统掌握 C++ 与算法竞赛知识", fill=C_GRAY, font=f(28), anchor="mt")
    draw_stat(d, W//2-240, 400, "21+", "知识点")
    draw_stat(d, W//2, 400, "8", "练习题")
    draw_stat(d, W//2+240, 400, "5", "代码模板")

def slide_2(d):
    draw_badge(d, W//2-90, 80, "📖 循序渐进")
    d.text((W//2, 150), "三阶段学习路线", fill=C_WHITE, font=f(58), anchor="mt")
    d.text((W//2, 215), "从入门到竞赛金牌，每一步都为你规划好", fill=C_GRAY, font=f(26), anchor="mt")
    draw_card(d, 150, 340, 480, 130, "🌱 第一阶段·入门", "环境搭建 · 变量/循环 · 数组/字符串")
    draw_card(d, 720, 340, 480, 130, "⚡ 第二阶段·进阶", "函数递归 · 指针 · STL · 文件读写")
    draw_card(d, 1290, 340, 480, 130, "🔥 第三阶段·竞赛", "DFS/BFS · DP · 图论 · 数论")

def slide_3(d):
    draw_badge(d, W//2-80, 80, "💻 C++ 基础")
    d.text((W//2, 150), "核心语法全掌握", fill=C_WHITE, font=f(58), anchor="mt")
    d.text((W//2, 215), "变量、输入输出优化、STL 容器——信奥赛必备", fill=C_GRAY, font=f(26), anchor="mt")
    draw_code(d, 530, 330, [
        '  ios::sync_with_stdio(false);',
        '  cin.tie(nullptr);              // 快速 I/O',
        '  vector<int> v = {1, 2, 3};',
        '  sort(v.begin(), v.end());      // 排序',
        '  map<string,int> mp;',
        '  mp["key"] = 42;                // 键值对',
        '  set<int> st;  st.insert(5);    // 集合',
    ])

def slide_4(d):
    draw_badge(d, W//2-60, 80, "🧠 算法")
    d.text((W//2, 150), "信奥赛高频考点", fill=C_WHITE, font=f(58), anchor="mt")
    d.text((W//2, 215), "动态规划 · 搜索 · 图论 · 数论，一网打尽", fill=C_GRAY, font=f(26), anchor="mt")
    draw_code(d, 530, 330, [
        '  // 01背包 DP',
        '  for (int i = 1; i <= n; i++)',
        '    for (int j = m; j >= w[i]; j--)',
        '      dp[j] = max(dp[j], dp[j-w[i]] + v[i]);',
        '  // Dijkstra 最短路',
        '  priority_queue<PII, vector<PII>, greater<PII>> pq;',
        '  // 快速幂 O(log n)',
        '  long long qpow(long long a, long long b, long long p) {',
    ])

def slide_5(d):
    draw_badge(d, W//2-70, 80, "⚙️ 在线工具")
    d.text((W//2, 150), "在线 C++ 编译器", fill=C_WHITE, font=f(58), anchor="mt")
    d.text((W//2, 215), "无需安装 · 一键运行 · 内置模板", fill=C_GRAY, font=f(26), anchor="mt")
    draw_card(d, 200, 380, 460, 130, "📦 排序模板", "快速排序 · 去重 · lower_bound")
    draw_card(d, 730, 380, 460, 130, "🎯 DP 模板", "LIS · 01背包 · 完全背包")
    draw_card(d, 1260, 380, 460, 130, "🔗 图模板", "邻接表 · BFS · Dijkstra")

def slide_6(d):
    draw_badge(d, W//2-50, 80, "📝 刷题")
    d.text((W//2, 150), "刷题练习 + 自动判分", fill=C_WHITE, font=f(58), anchor="mt")
    d.text((W//2, 215), "选择题即时反馈，每道题都有详细解析", fill=C_GRAY, font=f(26), anchor="mt")
    draw_card(d, 200, 370, 460, 120, "📊 答题统计", "实时查看正确率")
    draw_card(d, 730, 370, 460, 120, "🔄 反复练习", "无限重置，温故知新")
    draw_card(d, 1260, 370, 460, 120, "💾 本地保存", "进度不会丢失")

def slide_7(d):
    draw_badge(d, W//2-50, 80, "📊 进度")
    d.text((W//2, 150), "学习进度一目了然", fill=C_WHITE, font=f(58), anchor="mt")
    d.text((W//2, 215), "环形进度条 · 已完成知识点 · 成就感满满", fill=C_GRAY, font=f(26), anchor="mt")
    draw_stat(d, W//2-240, 420, "21", "总知识点")
    draw_stat(d, W//2, 420, "0%", "当前完成度")
    draw_stat(d, W//2+240, 420, "✓", "已标记章节")

def slide_8(d):
    draw_badge(d, W//2-70, 80, "🚀 现在就访问")
    d.text((W//2, 160), "开始你的信奥赛之路", fill=C_WHITE, font=f(60), anchor="mt")
    d.text((W//2, 230), "完全免费 · 无需注册 · 随时随地学习", fill=C_GRAY, font=f(28), anchor="mt")
    draw_cta(d, W//2, 520, "xinaosai.github.io")
    d.text((W//2, 620), "觉得有用？请帮忙一键三连 ❤️", fill=C_GRAY, font=f(24), anchor="mt")

SLIDES = [slide_1, slide_2, slide_3, slide_4, slide_5, slide_6, slide_7, slide_8]

# ── Render ──
FPS = 10
SEC_PER = 5
FRAMES = FPS * SEC_PER
out = os.path.join(OUT, "xinaosai_promo.mp4")

print(f"🎬 生成视频: {out}")
print(f"   共 {len(SLIDES)} 页，总时长 {len(SLIDES)*SEC_PER}s")

with imageio.get_writer(out, fps=FPS, codec="libx264", quality=8) as writer:
    for si, render_fn in enumerate(SLIDES):
        print(f"   第 {si+1}/{len(SLIDES)} 页...")
        img = Image.new("RGB", (W, H))
        d = ImageDraw.Draw(img)
        draw_bg(d)
        render_fn(d)
        draw_watermark(d)
        for _ in range(FRAMES):
            writer.append_data(np.array(img))

sz = os.path.getsize(out)
print(f"✅ 完成!  文件: {sz/1024/1024:.1f} MB")
