// 模块08：数组与字符串
lessonsRaw['m8'] = {
  title: '数组与字符串',
  icon: '📚',
  data: [
    { type:'objective', items:[
      '掌握一维数组的声明、初始化和基本操作',
      '理解二维数组的内存存储方式与遍历方法',
      '掌握字符数组（char[]）及其与字符串的关系',
      '熟悉 string 类的常用方法',
      '掌握 strlen、strcmp、strcpy、substr、find、getline 等函数用法',
    ]},
    { type:'section', title:'1️⃣ 一维数组' },
    { type:'para', content:'数组是相同类型元素的集合，在内存中连续存储。通过下标（索引）访问元素，下标从 0 开始。' },
    { type:'code', title:'一维数组声明与初始化', content:'#include <iostream>\nusing namespace std;\n\nint main() {\n    // 声明方式\n    int a[5];             // 定义长度为5的int数组，但未初始化\n    int b[5] = {1,2,3,4,5};  // 完全初始化\n    int c[] = {10,20,30};     // 根据初始值自动推断长度（3）\n    int d[5] = {0};           // 全部初始化为0\n    int e[100005];            // ⚠️ 100005 个 int 约 400KB\n                              // 大数组放全局（静态区），否则栈溢出！\n    \n    // 访问与修改\n    a[0] = 100;\n    a[1] = 200;\n    cout << a[0] << " " << a[1] << endl;  // 100 200\n    \n    // 遍历数组\n    for (int i = 0; i < 5; i++) {\n        cout << b[i] << " ";  // 1 2 3 4 5\n    }\n    cout << endl;\n    \n    return 0;\n}' },
    { type:'warning', content:'数组下标越界是最常见的错误！C++ 不会做越界检查。int a[5]; a[5] = 100; 编译不会报错，但会覆盖相邻内存，产生未定义行为（可能是崩溃，可能是奇怪的结果）。' },
    { type:'tip', content:'信奥赛技巧：数组容量通常比题目上限多开 5~10 个，例如 n ≤ 100000 时声明 int a[100010]; 避免边界错误。' },

    { type:'section', title:'2️⃣ 二维数组' },
    { type:'para', content:'二维数组本质上是"数组的数组"——每个元素是一维数组。常用于表示矩阵、表格、棋盘等二维结构。' },
    { type:'code', title:'二维数组声明与初始化', content:'// 声明一个 3 行 4 列的矩阵\nint a[3][4];\n\n// 初始化\nint b[3][4] = {\n    {1, 2, 3, 4},\n    {5, 6, 7, 8},\n    {9, 10, 11, 12}\n};\n\n// 访问：行下标、列下标（均从0开始）\ncout << b[0][0] << endl;  // 第一行第一列：1\ncout << b[2][3] << endl;  // 第三行第四列：12' },

    { type:'sub', title:'二维数组的内存存储' },
    { type:'para', content:'C++ 中二维数组按"行优先"（Row-major Order）方式在内存中连续存储。int a[3][4] 的元素在内存中的排列顺序是：' },
    { type:'para', content:'a[0][0] → a[0][1] → a[0][2] → a[0][3] → a[1][0] → a[1][1] → a[1][2] → a[1][3] → a[2][0] → a[2][1] → a[2][2] → a[2][3]' },
    { type:'code', title:'二维数组的遍历', content:'// 标准遍历：外层行、内层列\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 4; j++) {\n        cout << b[i][j] << "\\t";\n    }\n    cout << endl;\n}\n\n// 按内存顺序遍历（不推荐，可读性差）\nint* p = &b[0][0];\nfor (int i = 0; i < 12; i++) {\n    cout << p[i] << " ";  // 连续输出所有元素\n}' },
    { type:'tip', content:'C++ 的二维数组可以看作是"一维数组的数组"：int a[3][4] 中 a[0]、a[1]、a[2] 各自是一个 int[4] 的一维数组。为了提高缓存命中率，建议按行优先遍历（外层行、内层列）。' },

    { type:'section', title:'3️⃣ 字符数组（char[]）与字符串' },
    { type:'para', content:'C 风格字符串用字符数组表示，以空字符 \'\\0\'（ASCII 码 0）结尾。\'\\0\' 标记字符串的结束位置。' },
    { type:'code', title:'字符数组示例', content:'char s1[] = "Hello";        // 自动添加 \\0，实际长度6！\nchar s2[10] = "World";       // 留出给 \\0 的位置\nchar s3[] = {\'H\',\'e\',\'l\',\'l\',\'o\',\'\\0\'}; // 手动加 \\0\n\ncout << s1 << endl;   // 输出 Hello\ncout << strlen(s1);    // 5（不含 \\0）\ncout << sizeof(s1);    // 6（含 \\0）\n\n// 修改字符\ns2[0] = \'w\';\ncout << s2 << endl;   // world' },
    { type:'warning', content:'字符数组操作要点：1）c 风格字符串必须有 \'\\0\' 结尾，否则 strlen 等函数会越界读取直到遇到内存中的 0！2）字符数组拷贝不能用 =，只能用 strcpy。3）初始化时预留一个字节给 \'\\0\'。' },

    { type:'section', title:'4️⃣ string 类' },
    { type:'para', content:'C++ 的 string 类（需要 #include <string>）是对 C 风格字符串的封装，使用更安全方便。它自动管理内存，支持动态扩展。' },
    { type:'code', title:'string 基本用法', content:'#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s1 = "Hello";\n    string s2("World");  // 构造\n    string s3;            // 空字符串\n    \n    // 基本操作\n    s3 = s1 + " " + s2;  // 拼接：Hello World\n    s3 += "!";            // Hello World!\n    \n    cout << s3 << endl;           // Hello World!\n    cout << s3.length() << endl;  // 13\n    cout << s3.size() << endl;    // 13（与 length 相同）\n    \n    // 下标访问\n    cout << s3[0] << endl;        // H\n    cout << s3[6] << endl;        // W\n    \n    // 修改\n    s3[0] = \'h\';\n    cout << s3 << endl;           // hello World!\n    \n    // 比较（字典序）\n    string a = "apple", b = "banana";\n    if (a < b) cout << "apple < banana" << endl;\n    \n    // 读入字符串（遇到空格/换行停止）\n    string name;\n    cin >> name;  // 输入 "Alice Bob" → name = "Alice"\n    \n    return 0;\n}' },
    { type:'tip', content:'string 的 [] 下标访问不检查越界，越界是未定义行为。如果需要安全访问，使用 .at(i)，越界时会抛出异常。推荐用 [] 但确保下标合法。' },

    { type:'section', title:'5️⃣ 常用字符串函数' },
    { type:'table', headers:['函数/方法','用途','示例'], rows:[
      ['strlen(s)','返回 C 字符串长度（不含 \\0）','strlen("Hello") → 5'],
      ['strcmp(s1, s2)','比较两个 C 字符串（字典序）','相等返回 0，s1<s2 返回负数，s1>s2 返回正数'],
      ['strcpy(dest, src)','拷贝 C 字符串','目标数组必须足够大'],
      ['strcat(dest, src)','拼接 C 字符串到目标末尾','目标数组必须足够大'],
      ['s.length() / s.size()','返回 string 长度','s = "ABC" → 3'],
      ['s.empty()','判断 string 是否为空','s = "" → true'],
      ['s.substr(pos, len)','截取子串','"Hello".substr(1,3) → "ell"'],
      ['s.find(str)','查找子串，返回第一个出现位置','"Hello".find("ll") → 2'],
      ['s.find(str, pos)','从 pos 开始查找子串','"aaaa".find("aa",2) → 2'],
      ['s.erase(pos, len)','删除从 pos 开始的 len 个字符','"Hello".erase(1,2) → "Hlo"'],
      ['s.insert(pos, str)','在 pos 位置插入子串','"Heo".insert(2,"ll") → "Hello"'],
      ['s.replace(pos, len, str)','替换子串','"Hello".replace(1,3,"XXX") → "HXXXo"'],
      ['getline(cin, s)','读入一整行（含空格）','输入 "Hello World" → s = "Hello World"'],
    ]},
    { type:'code', title:'字符串函数综合示例', content:'#include <iostream>\n#include <string>\n#include <cstring>  // C 风格字符串函数\nusing namespace std;\n\nint main() {\n    // C 风格字符串函数\n    char cs1[20] = "Hello";\n    char cs2[20];\n    strcpy(cs2, cs1);          // cs2 = "Hello"\n    cout << strlen(cs1) << endl; // 5\n    cout << strcmp(cs1, "World") << endl; // 负数 (H < W)\n    \n    // string 类型函数\n    string s = "Hello, World!";\n    \n    // substr — 截取子串\n    string sub = s.substr(7, 5);   // 从索引7开始取5个字符\n    cout << sub << endl;          // World\n    \n    // find — 查找\n    int pos = s.find("World");\n    cout << pos << endl;           // 7（位置从0开始）\n    \n    pos = s.find("xyz");\n    if (pos == string::npos) {     // npos 表示"未找到"\n        cout << "未找到" << endl;   // 会输出\n    }\n    \n    // getline — 读整行（含空格）\n    string line;\n    cout << "请输入一行：";\n    getline(cin, line);           // 读至换行符\n    cout << "你输入了：" << line << endl;\n    \n    // 注意：如果之前用过 cin >>，需要用 cin.ignore() 吃掉换行符\n    // 否则 getline 会读到空行\n    \n    return 0;\n}' },
    { type:'warning', content:'cin >> s 遇到空格/换行就停止，getline(cin, line) 读一整行（包括空格）。两者混用时注意缓冲区问题——cin >> 后往往残留换行符，getline 会直接读到空行。解决方案：cin.ignore() 丢弃换行符。' },
    { type:'tip', content:'C++ 竞赛中推荐优先使用 string 而非 char[]。string 更安全、更方便、支持动态长度。仅在特定性能敏感场景（如大量字符串操作）考虑 char[]。' },

    { type:'section', title:'6️⃣ 数组综合应用示例' },
    { type:'code', title:'数组与字符串综合：统计单词频率', content:'#include <iostream>\n#include <string>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string text = "the quick brown fox jumps over the lazy dog the fox";\n    string words[100];  // 假设不超过100个单词\n    int count[100] = {0};\n    int total = 0;\n    \n    // 使用 stringstream 按空格分割\n    stringstream ss(text);\n    string word;\n    while (ss >> word) {\n        // 查找是否已存在\n        bool found = false;\n        for (int i = 0; i < total; i++) {\n            if (words[i] == word) {\n                count[i]++;\n                found = true;\n                break;\n            }\n        }\n        if (!found) {\n            words[total] = word;\n            count[total] = 1;\n            total++;\n        }\n    }\n    \n    // 输出结果\n    for (int i = 0; i < total; i++) {\n        cout << words[i] << ": " << count[i] << endl;\n    }\n    \n    return 0;\n}' },

    { type:'section', title:'📌 CSP-J/S 常考题型' },
    { type:'quiz', items:[
      { q:'声明 char s[] = "ABC"; 则 sizeof(s) 的值是？', options:['3','4','6','1'], answer:1, explain:'"ABC" 实际包含 A、B、C、\\0 四个字符，所以 sizeof = 4。strlen(s) = 3。' },
      { q:'以下关于 string 的操作，错误的是？', options:['s += "abc"','s.length()','s = s + s','s = s - "abc"'], answer:3, explain:'string 支持 += 拼接和 + 拼接，但不支持 -（减法）运算符。' },
      { q:'二维数组 int a[3][4] 在内存中存放的最后一个元素是？', options:['a[3][4]','a[2][3]','a[4][3]','a[3][3]'], answer:1, explain:'下标从0开始，3行4列的范围是 a[0][0] ~ a[2][3]，最后一个元素是 a[2][3]。' },
      { q:'以下哪个函数用于查找子串在 string 中的位置？', options:['substr','find','search','locate'], answer:1, explain:'find 返回子串首次出现的索引，substr 用于截取子串。' },
      { q:'二维数组在 C++ 中的存储方式是？', options:['列优先','行优先','随机存储','哈希存储'], answer:1, explain:'C++ 采用行优先（Row-major Order），即先存完第一行所有元素，再存第二行。' },
    ]},
  ]
};
