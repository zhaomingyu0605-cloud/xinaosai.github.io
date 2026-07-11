// 模块09：函数与递归
lessonsRaw['m9'] = {
  title: '函数与递归',
  icon: '🔄',
  data: [
    { type:'objective', items:[
      '理解值传递与引用传递的区别及使用场景',
      '掌握递归的三要素：终止条件、递归调用、递推关系',
      '理解递归调用过程中栈的工作机制',
      '了解尾递归的概念与优化',
      '能够编写阶乘、斐波那契、汉诺塔等经典递归程序',
    ]},
    { type:'section', title:'1️⃣ 值传递与引用传递' },
    { type:'para', content:'C++ 中函数参数的传递方式有两种：值传递和引用传递。理解它们的区别对于写出正确的程序至关重要。' },

    { type:'sub', title:'值传递（Pass by Value）' },
    { type:'para', content:'值传递将实参的值拷贝一份给形参。函数内部对形参的修改不会影响实参。' },
    { type:'code', title:'值传递示例', content:'#include <iostream>\nusing namespace std;\n\nvoid swapByValue(int a, int b) {\n    int temp = a;\n    a = b;\n    b = temp;\n    cout << "函数内：a=" << a << ", b=" << b << endl;  // 交换了\n}\n\nint main() {\n    int x = 5, y = 10;\n    swapByValue(x, y);\n    cout << "函数外：x=" << x << ", y=" << y << endl;  // 没变！x=5, y=10\n    return 0;\n}' },
    { type:'warning', content:'值传递"交换"是初学者最常见的陷阱！函数内部确实交换了，但那是副本的交换——原始变量纹丝不动。如果要修改原始变量，必须用引用或指针。' },

    { type:'sub', title:'引用传递（Pass by Reference）' },
    { type:'para', content:'引用传递通过声明参数类型为 &（引用），将实参的别名传递给函数。函数操作形参等价于操作实参本身。' },
    { type:'code', title:'引用传递示例', content:'#include <iostream>\nusing namespace std;\n\nvoid swapByRef(int &a, int &b) {  // ⚠️ 加了 &\n    int temp = a;\n    a = b;\n    b = temp;\n}\n\nint main() {\n    int x = 5, y = 10;\n    swapByRef(x, y);\n    cout << "x=" << x << ", y=" << y << endl;  // x=10, y=5 ✅ 成功交换\n    return 0;\n}' },
    { type:'tip', content:'引用传递的两大用途：1）函数需要修改实参（如交换、累加）。2）传递大对象（如 string、vector）时避免拷贝开销，用 const & 保证不修改：void func(const string &s);' },

    { type:'sub', title:'值传递 vs 引用传递对比' },
    { type:'table', headers:['对比项','值传递','引用传递'], rows:[
      ['形参是否影响实参','不影响','直接影响'],
      ['内存开销','拷贝整个值（大对象耗内存）','传递地址（固定开销）'],
      ['适用场景','小数据类型、不需要修改原始值','需要修改原始值或避免拷贝大对象'],
      ['语法标记','无','在类型后加 &'],
      ['const 保护','天然安全（改的是副本）','const & 保护：void f(const int &a)'],
    ]},

    { type:'section', title:'2️⃣ 递归的概念' },
    { type:'para', content:'递归（Recursion）是一种函数调用自身的编程技巧。一个递归函数把一个大问题分解为一个或多个与原问题相似的子问题，直到子问题简单到可以直接求解（达到终止条件）。' },
    { type:'para', content:'简单说：递归就是"自己调用自己"——但每次调用时问题的规模在缩小。' },

    { type:'section', title:'3️⃣ 递归三要素' },
    { type:'para', content:'写好一个递归函数，必须满足以下三个要素：' },
    { type:'bullet', items:[
      '要素一：终止条件（Base Case）—— 递归必须在某些输入下不再调用自身，直接返回结果。没有终止条件 = 无限递归（会导致栈溢出 Stack Overflow）。',
      '要素二：递归调用（Recursive Call）—— 函数在解决大问题时，调用自身来处理规模更小的子问题。',
      '要素三：递推关系（Recurrence Relation）—— 大问题的解与小问题的解之间的关系。例如 f(n) = n × f(n-1) 就是阶乘的递推关系。',
    ]},
    { type:'tip', content:'递归三要素记忆口诀："有个底、调自身、找关系"。写递归时先想好终止条件，再构建递推关系，最后写出递归调用。' },

    { type:'section', title:'4️⃣ 递归与栈' },
    { type:'para', content:'每一次递归调用时，系统在内存的"栈区"为当前调用分配一块空间（栈帧 Stack Frame），用于存储局部变量、参数和返回地址。当递归调用返回时，栈帧被弹出（销毁）。' },
    { type:'bullet', items:[
      '每一层递归调用都会创建一个新的栈帧',
      '当前层执行完就销毁栈帧，返回到上一层调用处继续执行',
      '递归深度过大（如几万层）会导致栈溢出（Stack Overflow）',
      '在信奥赛中，递归深度一般不建议超过 10⁵ 层（Java/C++ 默认栈大小约 8MB）',
    ]},
    { type:'code', title:'递归调用栈示意图（以阶乘为例）', content:'int fact(int n) {\n    if (n == 1) return 1;        // 终止条件\n    return n * fact(n - 1);      // 递归调用\n}\n\n调用 fact(4) 时的栈变化：\n→ 调用 fact(4): 栈底 = [fact(4) , n=4]\n→ 调用 fact(3): 栈底 = [fact(4), fact(3), n=3]\n→ 调用 fact(2): 栈底 = [fact(4), fact(3), fact(2), n=2]\n→ 调用 fact(1): 栈底 = [fact(4), fact(3), fact(2), fact(1), n=1] ← 触底\n→ fact(1) 返回 1\n→ fact(2) 拿回 1，计算 2*1=2，返回 2，弹出\n→ fact(3) 拿回 2，计算 3*2=6，返回 6，弹出\n→ fact(4) 拿回 6，计算 4*6=24，返回 24，弹出 ✅' },
    { type:'warning', content:'递归深度问题：fact(100000) 会导致栈溢出！如果递归深度可能很大，考虑用迭代（循环）替代递归，或用"尾递归"优化（虽然C++编译器不一定优化尾递归）。' },

    { type:'section', title:'5️⃣ 尾递归（Tail Recursion）' },
    { type:'para', content:'尾递归是指在递归函数的最后一步（仅且必须是最后一步）执行递归调用，并且调用完成后不需要再做任何额外操作。' },
    { type:'code', title:'普通递归 vs 尾递归', content:'// 普通递归 — 返回后还要做乘法\nint fact(int n) {\n    if (n == 0) return 1;\n    return n * fact(n - 1);  // 最后一步不是纯递归调用，还要乘以 n\n}\n\n// 尾递归 — 返回的就是递归调用的结果，不需额外操作\nint factTail(int n, int acc) {\n    if (n == 0) return acc;  // acc 累积结果\n    return factTail(n - 1, n * acc);  // ✅ 最后一步只有递归调用\n}\n\n// 尾递归的调用方式\ncout << factTail(4, 1) << endl;  // 24' },
    { type:'para', content:'尾递归的特点：1）递归调用是函数执行的最后一个动作。2）理论上可以被编译器优化为循环（尾调用优化 TCO），将 O(n) 栈空间降到 O(1)。3）C++ 标准不强制要求编译器做尾调用优化，但部分编译器（如 GCC -O2）会做。' },
    { type:'tip', content:'在竞赛中不要依赖尾递归优化！不同编译器/优化级别行为不同。如果需要深度递归，直接用循环（迭代）实现最稳妥。' },

    { type:'section', title:'6️⃣ 经典递归例子' },

    { type:'sub', title:'例1：阶乘（Factorial）' },
    { type:'para', content:'n! = n × (n-1) × ... × 2 × 1，其中 0! = 1。' },
    { type:'code', title:'阶乘递归实现', content:'#include <iostream>\nusing namespace std;\n\n// 递推关系：fact(n) = n * fact(n-1)\n// 终止条件：n == 0 时返回 1\nint fact(int n) {\n    if (n == 0) return 1;       // ✅ 终止条件\n    return n * fact(n - 1);     // ✅ 递归调用 + 递推关系\n}\n\nint main() {\n    cout << fact(5) << endl;     // 120\n    cout << fact(10) << endl;    // 3628800\n    return 0;\n}\n\n// 记忆要点：\n// fact(3) = 3 * fact(2)\n//        = 3 * (2 * fact(1))\n//        = 3 * (2 * (1 * fact(0)))\n//        = 3 * (2 * (1 * 1))\n//        = 3 * 2 * 1 = 6 ✅' },

    { type:'sub', title:'例2：斐波那契数列（Fibonacci）' },
    { type:'para', content:'斐波那契数列：F₀ = 0，F₁ = 1，Fₙ = Fₙ₋₁ + Fₙ₋₂（n ≥ 2）。' },
    { type:'code', title:'斐波那契递归实现（⚠️ 低效版本）', content:'// 递推关系：fib(n) = fib(n-1) + fib(n-2)\n// 终止条件：n==0 返回 0，n==1 返回 1\nint fib(int n) {\n    if (n == 0) return 0;       // 终止条件1\n    if (n == 1) return 1;       // 终止条件2\n    return fib(n - 1) + fib(n - 2);  // 递推关系\n}\n\n// ⚠️ 问题：大量重复计算！调 fib(5) 时，\n// fib(3) 被算了 2 次，fib(2) 被算了 3 次！\n// 时间复杂度 O(2ⁿ) — n=50 就跑到天荒地老' },
    { type:'code', title:'斐波那契优化版（记忆化递归 + 迭代）', content:'// 解法1：记忆化递归（自顶向下 + 缓存）\nconst int MAXN = 100;\nlong long memo[MAXN];\n\nlong long fibMemo(int n) {\n    if (n == 0) return 0;\n    if (n == 1) return 1;\n    if (memo[n] != 0) return memo[n];  // 算过直接取\n    memo[n] = fibMemo(n - 1) + fibMemo(n - 2);\n    return memo[n];\n}\n\n// 解法2：迭代（推荐！高效且不占栈空间）\nlong long fibIter(int n) {\n    if (n == 0) return 0;\n    if (n == 1) return 1;\n    long long a = 0, b = 1, c;\n    for (int i = 2; i <= n; i++) {\n        c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}\n\nint main() {\n    cout << fibMemo(50) << endl;   // 12586269025\n    cout << fibIter(50) << endl;   // 12586269025\n    return 0;\n}' },
    { type:'warning', content:'纯递归计算 Fibonacci(50) 在普通机器上可能要跑几分钟！因为时间复杂度 O(2ⁿ)。竞赛中 n 稍大就必须用迭代或记忆化。' },

    { type:'sub', title:'例3：汉诺塔（Tower of Hanoi）' },
    { type:'para', content:'汉诺塔问题是递归的经典案例：有三根柱子 A、B、C，A 上有 n 个大小不同的圆盘（大盘在下小盘在上），要把所有圆盘移到 C 上，每次只能移动一个盘子，且大盘不能压在小盘上。' },
    { type:'bullet', items:[
      '递推关系：把 n 个盘子从 A 移到 C → ①把 n-1 个盘子从 A 移到 B（借助 C）②把第 n 个盘子从 A 移到 C ③把 n-1 个盘子从 B 移到 C（借助 A）',
      '终止条件：n == 1 时直接移动',
      '最少移动次数：2ⁿ - 1',
    ]},
    { type:'code', title:'汉诺塔递归实现', content:'#include <iostream>\nusing namespace std;\n\n// 将 n 个盘子从 from 移动到 to，借助 aux（辅助柱）\nvoid hanoi(int n, char from, char to, char aux) {\n    if (n == 1) {                                // ✅ 终止条件\n        cout << "移动盘子 1 从 " << from << " 到 " << to << endl;\n        return;\n    }\n    // 步骤1：将 n-1 个盘子从 from 移到 aux（借助 to）\n    hanoi(n - 1, from, aux, to);\n    \n    // 步骤2：将第 n 个盘子从 from 移到 to\n    cout << "移动盘子 " << n << " 从 " << from << " 到 " << to << endl;\n    \n    // 步骤3：将 n-1 个盘子从 aux 移到 to（借助 from）\n    hanoi(n - 1, aux, to, from);\n}\n\nint main() {\n    hanoi(3, \'A\', \'C\', \'B\');\n    // 输出：\n    // 移动盘子 1 从 A 到 C\n    // 移动盘子 2 从 A 到 B\n    // 移动盘子 1 从 C 到 B\n    // 移动盘子 3 从 A 到 C\n    // 移动盘子 1 从 B 到 A\n    // 移动盘子 2 从 B 到 C\n    // 移动盘子 1 从 A 到 C\n    return 0;\n}\n\n// 总移动次数：2^n - 1\n// n=3 → 2³-1 = 7 次（如上）' },

    { type:'section', title:'7️⃣ 递归的应用场景' },
    { type:'para', content:'递归在竞赛和软件开发中有广泛的应用：' },
    { type:'bullet', items:[
      '树/图的遍历：DFS（深度优先搜索）天然用递归实现',
      '分治算法：快速排序、归并排序、二分查找',
      '回溯法：八皇后、数独、全排列、子集生成',
      '数学问题：组合数 C(n,k)、幂运算（快速幂）',
    ]},
    { type:'code', title:'递归思维：DFS 遍历目录（实际应用）', content:'// 伪代码 — 展示递归在文件系统中的实际应用\nvoid listFiles(string path) {\n    // 终止条件：如果是文件，直接输出\n    if (isFile(path)) {\n        cout << path << endl;\n        return;\n    }\n    // 递归处理：遍历子目录中的每个文件/目录\n    for (string child : getChildren(path)) {\n        listFiles(path + "/" + child);  // 递归调用\n    }\n}\n\n// 这与树的前序遍历一模一样！' },
    { type:'tip', content:'递归思维的核心是"信任"——你只需要相信递归函数能正确处理子问题，不需要在脑中展开整个调用栈。写递归时：①确定终止条件 ②确定递推关系 ③假设子问题已解决，组合得到大问题的解。' },

    { type:'section', title:'8️⃣ 递归 vs 迭代对比' },
    { type:'table', headers:['对比项','递归','迭代（循环）'], rows:[
      ['代码可读性','更接近数学定义，简洁清晰','有时较冗长'],
      ['栈空间','每层递归都要开栈帧，深度大时溢出','O(1) 空间，无溢出风险'],
      ['性能','函数调用有开销，重复计算可能低效','通常更快'],
      ['适用场景','树、图、分治、回溯','线性问题、已知循环次数'],
      ['尾递归','优化后可与迭代媲美','本身就是O(1)空间'],
    ]},

    { type:'section', title:'📌 CSP-J/S 常考题型' },
    { type:'quiz', items:[
      { q:'以下哪个是递归函数必须的要素？', options:['全局变量','终止条件','循环结构','指针操作'], answer:1, explain:'没有终止条件的递归会无限调用，最终栈溢出。' },
      { q:'关于值传递和引用传递，正确的是？', options:['值传递的形参修改会影响实参','引用传递不会修改实参','引用传递在参数类型后加 &','值传递更节省内存'], answer:2, explain:'引用传递加 & 号；值传递不影响实参；引用传递会影响实参；值传递会拷贝，大对象更耗内存。' },
      { q:'汉诺塔 4 个盘子最少需要移动多少次？', options:['7','15','8','16'], answer:1, explain:'2⁴ - 1 = 16 - 1 = 15 次。' },
      { q:'以下关于递归与栈的说法，错误的是？', options:['递归调用会占用栈空间','递归深度过大可能导致栈溢出','尾递归一定不会栈溢出','每次递归调用都会创建新的栈帧'], answer:2, explain:'尾递归理论上可优化为O(1)空间，但C++不保证编译器一定做尾调用优化，所以尾递归仍可能栈溢出。' },
      { q:'斐波那契数列 F(40) 用纯递归（不加记忆化）的时间复杂度大约是？', options:['O(n)','O(n²)','O(2ⁿ)','O(log n)'], answer:2, explain:'纯递归的斐波那契会重复计算大量子问题，时间复杂度 O(2ⁿ)，n=40 时已很慢。' },
    ]},
  ]
};
