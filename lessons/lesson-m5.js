// 模块05：网络与Internet
lessonsRaw['m5'] = {
  title: '网络与Internet',
  icon: '🌐',
  data: [
    { type:'objective', items:[
      '理解 OSI 七层模型和 TCP/IP 四层模型的结构及各层功能',
      '掌握 IP 地址的分类、IPv4/IPv6 的区别、子网掩码的作用',
      '理解 HTTP/HTTPS 协议的工作原理和 DNS 域名解析过程',
      '了解常见网络协议（TCP/UDP/ICMP/FTP/SMTP/POP3/IMAP）的特点和用途',
    ]},
    
    { type:'section', title:'1️⃣ 网络模型概述' },
    { type:'para', content:'网络通信非常复杂——从应用程序发出数据，到数据被编码、封装、路由、传输、接收、解析，涉及很多不同层次的工作。为了让不同厂商的设备能够互相通信，人们设计了分层模型，每一层只负责特定功能。' },
    { type:'tip', content:'分层的核心思想：每一层只关心自己这一层的"邻居"，下层为上层提供服务，下层细节对上层透明。就像寄信——你只需写好信贴上邮票（应用层），邮局负责运输（传输层/网络层），不需要你自己去铺光纤。' },
    
    { type:'section', title:'2️⃣ OSI 七层模型' },
    { type:'para', content:'OSI（Open Systems Interconnection，开放系统互连）模型是国际标准化组织（ISO）在1984年提出的网络通信理论模型，共分七层。' },
    { type:'para', content:'从底层到顶层依次是：' },
    { type:'table', headers:['层级','名称','功能','常见协议/设备'], rows:[
      ['7','应用层（Application）','为用户提供网络应用服务','HTTP、FTP、SMTP、DNS'],
      ['6','表示层（Presentation）','数据格式转换、加密解密、压缩解压','SSL/TLS、JPEG、GIF'],
      ['5','会话层（Session）','建立/管理/终止会话（连接）','NetBIOS、RPC'],
      ['4','传输层（Transport）','端到端通信、可靠传输、流量控制','TCP、UDP'],
      ['3','网络层（Network）','路由选择、IP寻址、分组转发','IP、ICMP、路由器'],
      ['2','数据链路层（Data Link）','帧封装、错误检测、MAC寻址','以太网、交换机、MAC地址'],
      ['1','物理层（Physical）','传输原始比特流（电压、光脉冲）','网线、光纤、集线器、中继器'],
    ]},
    { type:'warning', content:'记忆口诀："物链网传会表应"——物理层→数据链路层→网络层→传输层→会话层→表示层→应用层。也可以用："All People Seem To Need Data Processing"（从下到上）。' },
    { type:'para', content:'发送数据时，从上层向下层传递，每层加上自己的头部信息（封装，Encapsulation）。接收时，从下到上逐层去掉头部（解封装，Decapsulation）。' },
    
    { type:'section', title:'3️⃣ TCP/IP 四层模型（实际使用的模型）' },
    { type:'para', content:'虽然 OSI 七层模型是理论标准，但实际互联网采用的是 TCP/IP 模型（也叫 Internet 协议簇），它将七层合并为四层。' },
    { type:'table', headers:['TCP/IP层','对应OSI层','功能','协议举例'], rows:[
      ['应用层','5/6/7（会表应）','提供网络应用服务','HTTP、HTTPS、FTP、SMTP、DNS、SSH'],
      ['传输层','4（传输层）','端到端数据传输','TCP、UDP'],
      ['网际层','3（网络层）','IP寻址和路由','IP、ICMP、ARP'],
      ['网络接口层','1/2（物理+数据链路）','硬件传输和帧处理','以太网、Wi-Fi、PPP'],
    ]},
    { type:'tip', content:'考试中，OSI 模型问"第几层做什么"是经典题型。但实际开发中提到更多是 TCP/IP 模型的四层。记住：TCP/IP 的应用层 = OSI 的应用层+表示层+会话层。' },
    
    { type:'section', title:'4️⃣ IP 地址' },
    
    { type:'sub', title:'4.1 IPv4 地址' },
    { type:'para', content:'IPv4 地址是互联网上每台设备的"门牌号"，由 32 位二进制数组成（4 个字节）。为了便于记忆，通常写成"点分十进制"形式，如：' },
    { type:'code', title:'IPv4 示例', content:'二进制：11000000 10101000 00000001 00000001\n点分十进制：192.168.1.1' },
    
    { type:'sub', title:'4.2 IP 地址分类（ABC类）' },
    { type:'para', content:'传统的 IPv4 地址按前几位分为 A、B、C、D、E 五类。A/B/C 三类为主类（用于分配主机），D 类用于组播，E 类保留。' },
    { type:'table', headers:['类别','前几位','地址范围','默认子网掩码','网络数/每个网络主机数'], rows:[
      ['A类','0开头','1.0.0.0 ~ 126.255.255.255','255.0.0.0（/8）','128个网络 / 约1600万主机'],
      ['B类','10开头','128.0.0.0 ~ 191.255.255.255','255.255.0.0（/16）','16384个网络 / 约6.5万主机'],
      ['C类','110开头','192.0.0.0 ~ 223.255.255.255','255.255.255.0（/24）','约200万个网络 / 254台主机'],
      ['D类','1110开头','224.0.0.0 ~ 239.255.255.255','组播地址','—'],
      ['E类','1111开头','240.0.0.0 ~ 255.255.255.255','保留地址','—'],
    ]},
    { type:'tip', content:'快速判断：看一眼第一个数字在哪个范围。1-126 是 A类，128-191 是 B类，192-223 是 C类。注意 127.x.x.x 是回环地址（localhost），不属于 A 类。' },
    
    { type:'sub', title:'4.3 特殊地址' },
    { type:'bullet', items:[
      '127.0.0.1 — 回环地址（Loopback），指向本机自己',
      '0.0.0.0 — 通配地址，表示所有IP或未知地址',
      '255.255.255.255 — 广播地址（有限广播）',
      '10.x.x.x、172.16~31.x.x、192.168.x.x — 私有地址（内网专用，不可在公网路由）',
    ]},
    
    { type:'sub', title:'4.4 子网掩码（Subnet Mask）' },
    { type:'para', content:'子网掩码用来区分 IP 地址中的"网络号"和"主机号"。它是一个 32 位二进制数，左边全是 1，右边全是 0。' },
    { type:'para', content:'网络号 = IP地址 ∩ 子网掩码（按位与运算）。主机号 = IP地址 ∩ 子网掩码取反。' },
    { type:'code', title:'计算网络号', content:'IP地址：192.168.1.130\n子网掩码：255.255.255.0\n\n二进制：\n  IP：    11000000.10101000.00000001.10000010\n  掩码： 11111111.11111111.11111111.00000000\n  AND：  11000000.10101000.00000001.00000000  = 192.168.1.0\n\n网络号：192.168.1.0  主机号：0.0.0.130' },
    { type:'tip', content:'CIDR（无类别域间路由）记法：IP地址后面加 /N，"N"表示前 N 位是网络号。如 192.168.1.0/24 表示子网掩码有 24 个 1（即 255.255.255.0）。' },
    
    { type:'sub', title:'4.5 IPv6' },
    { type:'para', content:'IPv4 地址只有约 43 亿个，已经不够用了。IPv6 应运而生：' },
    { type:'bullet', items:[
      '地址长度 128 位（16 字节），总数约 3.4×10³⁸ 个——地球上每粒沙子都能分配一个地址',
      '写成 8 组 16 位十六进制数，如：2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      '每组的开头 0 可以省略，连续的全 0 组可以用 :: 替代一次',
    ]},
    { type:'table', headers:['特性','IPv4','IPv6'], rows:[
      ['地址长度','32位','128位'],
      ['表示法','点分十进制','冒号分隔十六进制'],
      ['地址数量','约43亿','约3.4×10³⁸'],
      ['配置','多为DHCP','支持无状态自动配置（SLAAC）'],
      ['安全性','可选IPSec（很少用）','原生支持IPSec'],
      ['NAT','广泛使用（因为地址不够）','基本不需要NAT'],
    ]},
    
    { type:'section', title:'5️⃣ 应用层协议' },
    
    { type:'sub', title:'5.1 HTTP / HTTPS' },
    { type:'para', content:'HTTP（超文本传输协议）是 Web 的基石。浏览器访问网站时，就是用 HTTP 协议向服务器请求网页资源。' },
    { type:'bullet', items:[
      '默认端口：HTTP = 80，HTTPS = 443',
      '请求方法：GET（获取资源）、POST（提交数据）、PUT（更新）、DELETE（删除）等',
      '状态码：200（成功）、301（永久重定向）、404（未找到）、500（服务器错误）',
      'HTTPS = HTTP + SSL/TLS 加密——数据在传输过程中被加密，防止窃听和篡改',
    ]},
    { type:'warning', content:'常考题：HTTPS 的 S 代表 Secure（安全），通过在 HTTP 下方加一层 SSL/TLS 加密实现。证书由 CA（Certificate Authority，证书颁发机构）签发。' },
    
    { type:'sub', title:'5.2 DNS（域名系统）' },
    { type:'para', content:'人们记 IP 地址（如 142.250.80.46）很困难，而记域名（如 www.google.com）更容易。DNS 的作用就是把域名解析为 IP 地址。' },
    { type:'code', title:'DNS 解析过程', content:'1. 你在浏览器输入 www.example.com\n2. 浏览器先查本地 DNS 缓存\n3. 没找到 → 问本地 DNS 服务器（通常是你的路由器或 ISP）\n4. 本地 DNS 从根服务器开始逐级查询：\n   a. 问根DNS：.com 的域名服务器在哪？\n   b. 问.com的DNS：example.com 的域名服务器在哪？\n   c. 问example.com的DNS：www.example.com 的IP是？\n5. 得到IP地址，返回给浏览器，浏览器发起HTTP请求' },
    { type:'tip', content:'默认端口：DNS 服务使用 UDP 53 端口（也有 TCP 53 用于大查询）。' },
    
    { type:'section', title:'6️⃣ 传输层与网际层协议' },
    
    { type:'sub', title:'6.1 TCP（传输控制协议）' },
    { type:'para', content:'TCP 是面向连接的、可靠的传输层协议。它就像打电话——必须先建立连接，然后才能传输数据，对方确认收到，挂断时断开连接。' },
    { type:'bullet', items:[
      '面向连接：通信前先通过"三次握手"建立连接',
      '可靠传输：数据包确认、超时重传、序号机制保证数据完整有序到达',
      '流量控制：根据接收方能处理的速度调整发送速度',
      '拥塞控制：网络拥堵时自动降低发送速度',
      '默认端口：21（FTP）、22（SSH）、80（HTTP）、443（HTTPS）、25（SMTP）',
    ]},
    { type:'code', title:'TCP 三次握手', content:'Client → Server: SYN（请求建立连接）\nServer → Client: SYN-ACK（同意连接）\nClient → Server: ACK（确认收到同意）\n\n三次握手后，TCP 连接建立，开始数据通信。\n\n断开连接需要"四次挥手"——双方各说一次再见并得到确认。' },
    
    { type:'sub', title:'6.2 UDP（用户数据报协议）' },
    { type:'para', content:'UDP 是无连接的、不可靠的传输层协议。它就像寄明信片——写好投递，不管对方是否收到。' },
    { type:'bullet', items:[
      '无连接：不需要握手，直接发送数据',
      '不可靠：不保证送达，不保证顺序，没有重传机制',
      '低开销：头部只有 8 字节（TCP 头部 20 字节）',
      '速度快：适合对实时性要求高、可以容忍少量丢包的应用',
      '默认端口：53（DNS查询）、67/68（DHCP）、123（NTP）、443（QUIC/HTTP3）',
    ]},
    { type:'table', headers:['特性','TCP','UDP'], rows:[
      ['连接方式','面向连接（三次握手）','无连接'],
      ['可靠性','可靠（确认+重传）','不可靠（尽最大努力）'],
      ['数据顺序','保证有序到达','不保证顺序'],
      ['速度','较慢','较快'],
      ['头部大小','20字节','8字节'],
      ['典型应用','网页(HTTP)、邮件(SMTP)、文件(FTP)','视频直播、DNS查询、在线游戏'],

    ]},
    
    { type:'sub', title:'6.3 ICMP（互联网控制报文协议）' },
    { type:'para', content:'ICMP 用于在 IP 网络中传递错误报告和诊断信息。最常用的两个工具——ping 和 traceroute——都是基于 ICMP。' },
    { type:'bullet', items:[
      'ping：向目标发送 ICMP Echo Request，收到 Echo Reply，计算往返时间（RTT），判断目标是否可达',
      'traceroute：通过设置 TTL（存活时间）值的逐跳递增，追踪数据包经过的每个路由器',
    ]},
    
    { type:'sub', title:'6.4 FTP（文件传输协议）' },
    { type:'para', content:'FTP 用于在网络上上传和下载文件。默认使用 20 端口（数据连接）和 21 端口（控制连接）。' },
    { type:'bullet', items:[
      '主动模式（PORT）：服务器主动连接客户端的端口',
      '被动模式（PASV）：客户端主动连接服务器（更常用，因为客户端通常有防火墙）',
      '⚠️ 不安全：用户名、密码和数据都是明文传输。建议使用 SFTP（SSH File Transfer Protocol）或 FTPS（FTP over SSL）',
    ]},
    
    { type:'sub', title:'6.5 电子邮件协议' },
    { type:'para', content:'发送邮件和接收邮件使用不同的协议：' },
    { type:'table', headers:['协议','全称','端口','用途','特点'], rows:[
      ['SMTP','Simple Mail Transfer Protocol','25（传统）或 587（提交）','发送邮件','仅负责发送和中转'],
      ['POP3','Post Office Protocol v3','110（明文）或 995（SSL）','接收邮件','下载到本地后通常删除服务器副本'],
      ['IMAP','Internet Message Access Protocol','143（明文）或 993（SSL）','接收邮件','邮件保留在服务器，多设备同步'],
    ]},
    { type:'tip', content:'简单记：SMTP 发信（Send Mail），POP3 取信（取完服务器删除），IMAP 同步（服务器始终保留）。APP端（手机）用 IMAP 更方便。' },
    
    { type:'section', title:'7️⃣ 一些重要概念' },
    
    { type:'sub', title:'7.1 端口号' },
    { type:'para', content:'端口号（Port）是传输层用来区分不同应用程序的逻辑标识，范围 0~65535：' },
    { type:'bullet', items:[
      '0~1023：知名端口（Well-Known Ports），需要管理员权限，如 HTTP(80)、HTTPS(443)',
      '1024~49151：注册端口（Registered Ports），如 MySQL(3306)、RDP(3389)',
      '49152~65535：动态/私有端口（Dynamic/Private Ports），客户端临时使用',
    ]},
    
    { type:'sub', title:'7.2 NAT（网络地址转换）' },
    { type:'para', content:'由于 IPv4 地址不够用，大多数家庭和企业使用私有 IP 地址（如 192.168.x.x），通过路由器（NAT 设备）共享一个公网 IP 上网。NAT 将内部的私有地址转换成公网地址。' },
    
    { type:'sub', title:'7.3 DHCP（动态主机配置协议）' },
    { type:'para', content:'当你把设备连上 Wi-Fi 时，DHCP 自动为你分配 IP 地址、子网掩码、默认网关、DNS 服务器等信息。不需要手动设置！' },
    
    { type:'section', title:'📌 CSP-J/S 常考题型' },
    { type:'quiz', items:[
      { q:'OSI 七层模型中，路由器工作在？', options:['物理层','数据链路层','网络层','传输层'], answer:2, explain:'路由器根据IP地址转发数据包，工作在网络层（第3层）。交换机工作在数据链路层（第2层）。' },
      { q:'TCP 协议位于 OSI 模型的哪一层？', options:['应用层','表示层','传输层','网络层'], answer:2, explain:'TCP（传输控制协议）和UDP都位于传输层（第4层）。' },
      { q:'以下哪个不是合法的 IPv4 地址？', options:['192.168.1.1','10.0.0.255','256.1.2.3','172.16.0.1'], answer:2, explain:'IPv4的每个字节范围是0~255，256超出了合法范围。' },
      { q:'以下哪个协议用于将域名解析为 IP 地址？', options:['HTTP','DNS','FTP','DHCP'], answer:1, explain:'DNS（域名系统）负责域名到IP地址的映射。' },
      { q:'TCP 建立连接时使用的"三次"过程叫什么？', options:['三次握手','三次挥手','三次确认','三次同步'], answer:0, explain:'建立连接用三次握手（SYN→SYN-ACK→ACK），断开用四次挥手。' },
      { q:'以下哪个协议是面向连接、可靠的？', options:['UDP','IP','TCP','ICMP'], answer:2, explain:'TCP是面向连接、可靠的传输层协议。UDP是无连接、不可靠的。' },
      { q:'HTTPS 默认端口是？', options:['80','443','8080','8443'], answer:1, explain:'HTTP=80，HTTPS=443。8080常作为Web开发调试端口。' },
      { q:'以下哪个是私有 IP 地址？', options:['8.8.8.8','114.114.114.114','192.168.1.1','1.1.1.1'], answer:2, explain:'192.168.x.x 是私有地址范围。其他都是公网DNS服务商地址。' },
    ]},
  ]
};
