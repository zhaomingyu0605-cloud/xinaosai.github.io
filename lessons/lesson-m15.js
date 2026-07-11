// 模块15：贪心·分治·递推
lessonsRaw['m15'] = {
  title: '贪心·分治·递推',
  icon: '🧩',
  data: [
    { type:'objective', items:[
      '理解贪心策略的"局部最优→全局最优"思想，能举出经典例子',
      '掌握分治思想的"分解→解决→合并"三步法',
      '掌握递推思想，能用递推式解决常见问题',
      '清楚贪心与动态规划（DP）的核心区别',
    ]},
    { type:'section', title:'1️⃣ 贪心策略（Greedy Algorithm）' },
    { type:'para', content:'贪心算法是一种"短视"的算法——每一步都做出当前看来最优的选择（局部最优），希望通过一系列局部最优的选择最终得到全局最优解。贪心算法的特点是不回溯、不撤销，做过的决定不会反悔。' },
    { type:'warning', content:'贪心并不保证一定能得到全局最优解！只有问题具有"贪心选择性质"和"最优子结构"时，贪心才是正确的。这需要严格证明。' },

    { type:'sub', title:'贪心的两个关键性质' },
    { type:'bullet', items:[
      '贪心选择性质（Greedy Choice Property）：每一步的局部最优选择最终能导向全局最优解',
      '最优子结构（Optimal Substructure）：一个问题的最优解包含其子问题的最优解',
      '只有同时满足这两个性质的问题才能用贪心算法得到正确解',
    ]},

    { type:'sub', title:'实例一：活动安排问题' },
    { type:'para', content:'问题：有 n 个活动，每个活动有开始时间 s[i] 和结束时间 f[i]（s[i] < f[i]），同一时间只能参加一个活动，求最多能参加多少个活动。' },
    { type:'para', content:'贪心策略：按结束时间从早到晚排序，每次选结束时间最早且不与已选活动冲突的活动。' },
    { type:'code', title:'活动安排（贪心）', content:'struct Activity { int s, f; };\nbool cmp(Activity a, Activity b) { return a.f < b.f; }\n\nint maxActivities(vector<Activity>& acts) {\n  sort(acts.begin(), acts.end(), cmp); // 按结束时间排序\n  int cnt = 1, lastEnd = acts[0].f;\n  for (int i = 1; i < acts.size(); i++) {\n    if (acts[i].s >= lastEnd) { // 不冲突\n      cnt++;\n      lastEnd = acts[i].f;\n    }\n  }\n  return cnt;\n}' },
    { type:'para', content:'为什么贪心正确？结束时间越早，留给后面的活动的时间就越多——这就是"选最早结束的"的直觉。用数学归纳法可以严格证明。' },
    { type:'tip', content:'活动安排是贪心的经典入门题。变体：如果每个活动有收益，求最大收益就不是贪心了，需要 DP（类似加权区间调度）。' },

    { type:'sub', title:'实例二：找零问题' },
    { type:'para', content:'问题：给定面额为 1、5、10、20、50、100 的人民币，用最少的张数凑出指定金额 n。' },
    { type:'para', content:'贪心策略：每次都选面值最大且不超过剩余金额的硬币。' },
    { type:'code', title:'找零问题（贪心）', content:'int coins[] = {100, 50, 20, 10, 5, 1};\nint cnt = 0;\nfor (int i = 0; i < 6; i++) {\n  cnt += n / coins[i];\n  n %= coins[i];\n}\ncout << "最少需要" << cnt << "张";' },
    { type:'para', content:'为什么贪心正确？因为以上面额满足"倍数关系"（如 20 是 10 的两倍），大面额一定比若干小面额的总和更大。但注意：如果面额为 {1, 3, 4}，凑 6 时贪心会选 4+1+1（3张），而最优解是 3+3（2张）——此时贪心失效！' },
    { type:'warning', content:'找零问题不一定能用贪心！关键在于面额是否存在倍数关系。如果面额特殊（如1、3、4），需要用 DP（完全背包）。' },

    { type:'section', title:'2️⃣ 分治算法（Divide and Conquer）' },
    { type:'para', content:'分治是一种"大事化小，小事化了"的思想——将一个大问题分解为若干个规模较小的相同子问题，递归求解子问题，然后将子问题的解合并得到原问题的解。' },

    { type:'sub', title:'分治三步法' },
    { type:'bullet', items:[
      '分解（Divide）：将原问题分解为若干个规模较小、相互独立且与原问题形式相同的子问题',
      '解决（Conquer）：递归求解各子问题。如果子问题规模足够小，直接求解（递归基）',
      '合并（Combine）：将各个子问题的解合并得到原问题的解',
    ]},
    { type:'code', title:'分治通用框架', content:'Result divideConquer(Problem p) {\n  if (p is small enough) {\n    return solveDirectly(p); // 直接求解\n  }\n  // 1. 分解\n  auto subProblems = divide(p);\n  // 2. 解决\n  Result r1 = divideConquer(subProblems[0]);\n  Result r2 = divideConquer(subProblems[1]);\n  // ... 更多子问题\n  // 3. 合并\n  return combine(r1, r2, ...);\n}' },

    { type:'sub', title:'分治举例一：归并排序' },
    { type:'para', content:'归并排序是分治的典型应用：' },
    { type:'bullet', items:[
      '分解：将数组从中间分成两半',
      '解决：递归对左右两半分别排序（当只剩一个元素时天然有序）',
      '合并：将两个有序子数组合并成一个有序数组（双指针法）',
    ]},
    { type:'table', headers:['步骤','操作','复杂度'], rows:[
      ['分解','将数组从中间分成两半','O(1)'],
      ['解决','递归对左右两半排序（规模减半）','2T(n/2)'],
      ['合并','双指针合并两个有序数组','O(n)'],
    ]},
    { type:'para', content:'递推式：T(n) = 2T(n/2) + O(n) → 解得 O(n log n)。' },

    { type:'sub', title:'分治举例二：快速排序' },
    { type:'para', content:'快速排序也是分治思想：' },
    { type:'bullet', items:[
      '分解：选 pivot，将数组划分为"≤pivot"和"≥pivot"两部分（partition操作）',
      '解决：递归对左右两部分分别排序',
      '合并：无需合并！因为经过 partition 后，整个数组天然有序',
    ]},
    { type:'table', headers:['步骤','操作','复杂度'], rows:[
      ['分解','partition 划分数组','O(n)'],
      ['解决','递归排序左右两部分','2T(n/2)（平均）'],
      ['合并','无需合并（就地排序）','O(1)'],
    ]},
    { type:'tip', content:'归并和快排的对比：归并排序的难点在"合并"阶段，快速排序的难点在"分解"（partition）阶段。归并是稳定的，快排不是。' },

    { type:'sub', title:'分治的其他经典应用' },
    { type:'bullet', items:[
      '最大子段和：分治求跨过中点的最大子段和（左半最大后缀+右半最大前缀）',
      '最近点对问题：按 x 排序后分治，跨左右两边的点在"条带"内枚举',
      '大整数乘法：Karatsuba 算法，将大整数分成高位和低位',
      '快速幂：a^n = a^(n/2) × a^(n/2)，将指数规模减半',
    ]},
    { type:'code', title:'分治示例：快速幂', content:'int fastPow(int a, int n) {\n  if (n == 0) return 1;\n  int half = fastPow(a, n/2);\n  if (n % 2 == 0) return half * half;     // n 为偶数\n  else return half * half * a;             // n 为奇数\n}' },

    { type:'section', title:'3️⃣ 递推思想（Recurrence / DP的基础）' },
    { type:'para', content:'递推（Recurrence）是一种通过对问题进行"分步归纳"来求解的技术。核心是先确定状态和状态转移方程（递推式），然后按顺序从已知状态逐步推导出未知状态。递推是动态规划（DP）的基础。' },

    { type:'sub', title:'递推三要素' },
    { type:'bullet', items:[
      '状态定义：用一个或多个维度描述问题在某个阶段的局面',
      '边界条件：最小的子问题的解（递推的起点）',
      '递推关系（状态转移方程）：当前状态与前面状态之间的关系式',
    ]},

    { type:'sub', title:'实例一：兔子数列（斐波那契数列）' },
    { type:'para', content:'问题：一对兔子从出生后第3个月起每个月都生一对兔子，假设兔子不死，问第 n 个月有多少对兔子？' },
    { type:'para', content:'递推分析：' },
    { type:'bullet', items:[
      '定义 f[n] 表示第 n 个月的兔子对数',
      '边界：f[1] = 1, f[2] = 1（前两个月只有初始的一对）',
      '递推式：f[n] = f[n-1] + f[n-2]（本月的兔子 = 上个月的兔子 + 本月新生的兔子；本月新生 = 两个月前的兔子对数）',
    ]},
    { type:'code', title:'斐波那契数列（递推）', content:'int fib(int n) {\n  if (n <= 2) return 1;\n  int a = 1, b = 1, c;\n  for (int i = 3; i <= n; i++) {\n    c = a + b;  // f[i] = f[i-1] + f[i-2]\n    a = b;\n    b = c;\n  }\n  return b;\n}' },
    { type:'tip', content:'斐波那契数列也可以递归实现：return fib(n-1)+fib(n-2)，但这样有很多重复计算（指数级！）。递推（迭代）是 O(n)，比递归快得多。这也体现了"递推"vs"递归"的重要区别。' },

    { type:'sub', title:'实例二：走楼梯（爬楼梯）' },
    { type:'para', content:'问题：有一个 n 级台阶的楼梯，每次可以跨 1 级或 2 级，问有多少种不同的方式走完？' },
    { type:'para', content:'递推分析：' },
    { type:'bullet', items:[
      '定义 f[n] 为走到第 n 级台阶的方法数',
      '边界：f[0] = 1（起点，不踩也算一种），f[1] = 1（只有 1 种走法：1步）',
      '递推式：f[n] = f[n-1] + f[n-2]（走到第 n 级可以从 n-1 级跨 1 步，或从 n-2 级跨 2 步）',
      '这其实就是斐波那契数列偏移一位！f[2]=2, f[3]=3, f[4]=5……',
    ]},
    { type:'code', title:'爬楼梯（递推）', content:'int climbStairs(int n) {\n  if (n <= 1) return 1;\n  int a = 1, b = 1; // f[0]=1, f[1]=1\n  for (int i = 2; i <= n; i++) {\n    int c = a + b;\n    a = b;\n    b = c;\n  }\n  return b;\n}' },
    { type:'warning', content:'注意：有的题目中 f[1] = 1, f[2] = 2（f[0] = 1 也可以但需要理解）。不同题目的边界定义不同，一定要先明确！' },

    { type:'sub', title:'递推的常见类型' },
    { type:'table', headers:['类型','递推式','举例'], rows:[
      ['一阶线性','f[n] = f[n-1] + c','等差数列求和'],
      ['二阶线性','f[n] = f[n-1] + f[n-2]','斐波那契、爬楼梯'],
      ['乘法递推','f[n] = n × f[n-1]','n!（阶乘）'],
      ['组合递推','C(n,k) = C(n-1,k) + C(n-1,k-1)','杨辉三角、组合数'],
      ['卡特兰数','C[n] = ΣC[i]×C[n-1-i]','括号序列、二叉树计数'],
    ]},

    { type:'section', title:'4️⃣ 贪心与动态规划（DP）的区别' },
    { type:'para', content:'贪心和 DP 都是求解最优化问题的常用方法，但它们的思路有很大区别。这是信息学竞赛中非常重要的概念辨析。' },

    { type:'table', headers:['维度','贪心（Greedy）','动态规划（DP）'], rows:[
      ['决策方式','每一步选当前最优（短视）','通盘考虑所有可能，选全局最优'],
      ['决策依据','贪心选择性质+最优子结构','最优子结构+重叠子问题'],
      ['回溯','❌ 从不反悔','✅ 通过状态转移考虑所有选择'],
      ['证明要求','需要严格证明贪心正确','递推式正确即可，不需要猜'],
      ['效率','通常 O(n) 或 O(n log n)，很快','通常 O(n²) 或更高，依赖状态数'],
      ['适用性','窄——仅特定问题可用','广——适用于大量优化问题'],
      ['典型例子','活动安排、哈夫曼编码、Prim/Kruskal','背包、LIS、LCS、编辑距离'],
    ]},

    { type:'sub', title:'用找零加深理解' },
    { type:'para', content:'考虑面额 {1, 3, 4} 凑 6 元：' },
    { type:'bullet', items:[
      '贪心：选 4（剩余 2）→ 选 1（剩余 1）→ 选 1 → 共 3 张（4+1+1）',
      '最优：3+3 → 共 2 张',
      '贪心失败的原因：选 4 虽然单步最优，但导致后面的"烂摊子"无法用最优方式弥补',
      'DP 的做法：dp[i] = min(dp[i-1]+1, dp[i-3]+1, dp[i-4]+1)，考虑所有可能的最后一枚硬币',
    ]},
    { type:'code', title:'DP 解法（完全背包）', content:'int coinChange(vector<int>& coins, int amount) {\n  vector<int> dp(amount+1, INF);\n  dp[0] = 0;\n  for (int i = 1; i <= amount; i++) {\n    for (int coin : coins) {\n      if (i >= coin) dp[i] = min(dp[i], dp[i-coin] + 1);\n    }\n  }\n  return dp[amount] == INF ? -1 : dp[amount];\n}' },

    { type:'sub', title:'判断能否用贪心的口诀' },
    { type:'para', content:'当解题时，可以用以下问题帮助判断是否能用贪心：' },
    { type:'bullet', items:[
      '"如果我这次选了当前最优的，以后会不会后悔？"——会后悔就别用贪心',
      '"当前选择会不会影响未来可选的方案？"——会就别用贪心',
      '"这个问题的局部最优组合起来就是全局最优吗？"——是就能用贪心',
      '如果不能确定，写 DP 更安全（虽然慢一点，但正确）',
    ]},

    { type:'section', title:'5️⃣ 三种思想对比总结' },
    { type:'table', headers:['思想','核心','方向','关键操作','思想本质'], rows:[
      ['贪心','局部最优→全局最优','从前往后','选当前最优','"我全都要"但每次只拿最香的'],
      ['分治','大问题→小问题','从上到下','分解→解决→合并','"分而治之"各个击破'],
      ['递推','小状态→大状态','从下到上','确定边界+递推式','"以已知推未知"'],
    ]},
    { type:'para', content:'这三种思想并不互斥。例如：归并排序既是分治（分解大数组），也是递推的另一种形式（递归递推可以互相转换）。而递推是 DP 的基础，DP 又是"带决策的递推"。' },
    { type:'tip', content:'学习顺序建议：递推 → 贪心 → 分治 → DP。递推是所有基础中的基础，递推理解透了再学 DP 会轻松很多。' },

    { type:'section', title:'📌 CSP-J/S 常考题型' },
    { type:'quiz', items:[
      { q:'以下哪种情况说明贪心算法可能不适用？', options:['问题有最优子结构','问题没有贪心选择性质','子问题相互独立','问题能分解'], answer:1, explain:'没有贪心选择性质时，贪心不能保证得到全局最优解。' },
      { q:'分治算法的三个步骤中，归并排序最核心（最复杂）的一步是？', options:['分解','解决','合并','排序'], answer:2, explain:'归并排序的分解很简单（取中间），难点在合并两个有序数组。' },
      { q:'走楼梯问题（每次1步或2步），走到第5级台阶有多少种方法？', options:['5','6','7','8'], answer:3, explain:'f[1]=1, f[2]=2, f[3]=3, f[4]=5, f[5]=8。这是斐波那契数列。' },
      { q:'以下哪个不是分治算法的应用？', options:['归并排序','快速排序','冒泡排序','快速幂'], answer:2, explain:'冒泡排序是暴力比较，不属于分治。' },
      { q:'面额 {1,5,10,20,50,100} 的找零问题中，为什么贪心是正确的？', options:['面额有倍数关系','面额很少','面额很多','因为硬币是圆的'], answer:0, explain:'大面额是小面额的整数倍，所以用大面额一定不比用小面额差。' },
      { q:'贪心与 DP 最核心的区别是什么？', options:['贪心更快','贪心从不反悔自己的决策','DP 不用递推式','贪心需要DP的基础'], answer:1, explain:'贪心每步选局部最优且不反悔；DP 通过状态转移比较所有可能的决策。' },
      { q:'斐波那契数列 f[n] = f[n-1] + f[n-2] 属于哪种递推？', options:['一阶线性','二阶线性','乘法递推','组合递推'], answer:1 },
      { q:'在活动安排问题中，按什么排序可以使贪心策略正确？', options:['开始时间','活动时长','结束时间','活动编号'], answer:2, explain:'按结束时间从早到晚排序，每次选最早结束且不冲突的。' },
    ]},
  ]
};
