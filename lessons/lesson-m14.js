// 模块14：搜索与回溯
lessonsRaw['m14'] = {
  title: '搜索与回溯',
  icon: '🔎',
  data: [
    { type:'objective', items:[
      '理解深度优先搜索（DFS）的递归实现和栈思想',
      '理解广度优先搜索（BFS）的队列实现和分层思想',
      '掌握回溯法的"尝试-撤销"框架和剪枝优化技巧',
      '能通过经典例题（全排列、N皇后、迷宫）应用搜索算法',
    ]},
    { type:'section', title:'1️⃣ 搜索算法概览' },
    { type:'para', content:'搜索（Search）是信息学竞赛中最基础也最重要的算法之一。它的核心思想是"穷举"——遍历所有可能的解空间，找到满足条件的解。搜索算法通常分为 DFS（深度优先）和 BFS（广度优先）两大类，在实际问题中往往与回溯法结合使用。' },

    { type:'section', title:'2️⃣ 深度优先搜索（DFS）' },
    { type:'para', content:'DFS（Depth First Search，深度优先搜索）的核心思想是：从起点出发，沿着一条路径尽可能深地探索，直到走到死路（无法继续）才回退到上一个岔路口，换另一条路继续。这种"走到底，走不了就回头"的策略就是深度优先。' },
    
    { type:'sub', title:'DFS 的基本原理' },
    { type:'bullet', items:[
      '通常用递归实现（天然支持"深入"和"回溯"）',
      '也可以用栈模拟（手动压栈和弹栈）',
      '沿一条路径走到尽头再回溯（Backtrack）',
      '遍历过程可以看作一棵"搜索树"的深度优先遍历',
    ]},
    { type:'code', title:'DFS 通用框架（递归）', content:'// DFS 递归通用模板\nvoid dfs(当前状态) {\n  if (当前状态是目标) {\n    记录/处理答案;\n    return;\n  }\n  标记当前状态已访问;\n  for (每个可能的下一步状态) {\n    if (下一步状态合法且未访问) {\n      dfs(下一步状态);\n    }\n  }\n  取消标记当前状态; // 回溯（如果需要重新搜索其他路径）\n}' },
    { type:'tip', content:'DFS 天然使用系统栈（递归调用栈）。当递归深度很深时（如 10⁵ 层）可能导致栈溢出，这时可以考虑用栈模拟或改用迭代加深。' },
    
    { type:'sub', title:'DFS 的栈实现' },
    { type:'code', title:'DFS 栈实现模板', content:'void dfs(int start, int n) {\n  stack<int> st;\n  bool visited[N] = {false};\n  st.push(start);\n  visited[start] = true;\n  while (!st.empty()) {\n    int cur = st.top(); st.pop();\n    // 处理当前节点 cur\n    for (int nxt : 邻接表[cur]) {\n      if (!visited[nxt]) {\n        visited[nxt] = true;\n        st.push(nxt);\n      }\n    }\n  }\n}' },
    { type:'warning', content:'注意：用栈模拟 DFS 时，压栈顺序不同可能导致遍历顺序与递归版不一致。如果想保持与递归一致，应该逆序压入邻居。' },

    { type:'section', title:'3️⃣ 广度优先搜索（BFS）' },
    { type:'para', content:'BFS（Breadth First Search，广度优先搜索）的核心思想是：从起点出发，先探索所有距离为 1 的节点，再探索所有距离为 2 的节点……一层一层向外扩展。就像水波一样向外扩散。' },
    { type:'bullet', items:[
      '用队列（queue）实现，先进先出（FIFO）',
      '按"层"遍历，首次到达的就是最短路径（边权相等时）',
      '需要 visited 数组防止重复访问',
      '适合求解最短路径、最少步数等问题',
    ]},
    { type:'code', title:'BFS 通用模板', content:'void bfs(int start) {\n  queue<int> q;\n  bool visited[N] = {false};\n  int dist[N] = {0}; // 记录距离（层数）\n  q.push(start);\n  visited[start] = true;\n  dist[start] = 0;\n  while (!q.empty()) {\n    int cur = q.front(); q.pop();\n    // 处理当前节点 cur\n    for (int nxt : 邻接表[cur]) {\n      if (!visited[nxt]) {\n        visited[nxt] = true;\n        dist[nxt] = dist[cur] + 1;\n        q.push(nxt);\n      }\n    }\n  }\n}' },
    { type:'tip', content:'BFS 求最短路径的前提是所有边的权值相等（或都为1）。如果边权不同，需要用 Dijkstra 算法。' },

    { type:'sub', title:'DFS vs BFS 对比' },
    { type:'table', headers:['维度','DFS','BFS'], rows:[
      ['数据结构','栈（递归/手动）','队列'],
      ['空间复杂度','O(深度) — 与路径长度有关','O(宽度) — 与分支因子有关'],
      ['最短路径','不一定（首次找到的不一定最短）','一定（首次到达就是最短）'],
      ['适用场景','连通性、路径存在性、回溯、拓扑排序','最短路径、最少步数、分层遍历'],
      ['实现难度','递归直观，但注意栈溢出','队列直观，无栈溢出风险'],
    ]},

    { type:'section', title:'4️⃣ 回溯法（Backtracking）' },
    { type:'para', content:'回溯法是一种通过"尝试所有可能"来解决问题的算法。它本质上就是一种 DFS，但在搜索过程中如果发现当前路径不可能得到解（或不可能得到更优解），就"回溯"——撤销当前选择，尝试其他分支。' },
    
    { type:'sub', title:'回溯法的核心思想' },
    { type:'para', content:'回溯法的思想可以概括为三个字："试·判·退"——尝试一个选择，判断是否可行，如果不行就退回。' },
    { type:'bullet', items:[
      '选择（Choice）：在当前状态下做出一个决策',
      '约束（Constraint）：判断当前决策是否符合条件',
      '目标（Goal）：检查是否已得到完整解',
      '回溯（Backtrack）：撤销当前决策，回到上一个状态继续尝试',
    ]},
    { type:'code', title:'回溯法通用框架（三要素）', content:'void backtrack(当前状态) {\n  if (满足目标条件) {\n    记录解;\n    return;\n  }\n  for (每个可选决策) {\n    if (决策合法) {\n      做出决策（标记/加入等）;   // 尝试\n      backtrack(新状态);          // 递归\n      撤销决策（取消标记/弹出等）; // 回溯\n    }\n  }\n}' },

    { type:'section', title:'5️⃣ 剪枝优化（Pruning）' },
    { type:'para', content:'剪枝是在搜索过程中，提前排除那些不可能产生有效解的分支，从而减少搜索空间、提高效率。好的剪枝能让指数级搜索变得可行。' },
    { type:'bullet', items:[
      '可行性剪枝：当前路径已经不满足约束条件，直接剪掉',
      '最优性剪枝：当前路径已经不可能得到比已知最优解更好的结果（常见于求最优解问题）',
      '对称性剪枝：利用问题的对称性减少重复搜索',
      '搜索顺序优化：先搜分支少的方向，可以更快剪枝（如先放约束最多的位置）',
      '记忆化：记录已经搜索过的状态，避免重复搜索',
    ]},
    { type:'code', title:'剪枝示例（最优性剪枝）', content:'int bestAns = INF;\nvoid dfs(int cur, int cost) {\n  if (cost >= bestAns) return; // 最优性剪枝：已经不可能更优了\n  if (cur == n) {\n    bestAns = min(bestAns, cost);\n    return;\n  }\n  for (int nxt : 邻接表[cur]) {\n    dfs(nxt, cost + w[cur][nxt]);\n  }\n}' },
    { type:'tip', content:'剪枝是回溯法的灵魂！不做剪枝的回溯就是无脑穷举，往往会超时。CSP-J/S 中考察回溯法时，常常需要合理的剪枝才能通过全部测试点。' },

    { type:'section', title:'6️⃣ 经典例题一：全排列' },
    { type:'para', content:'问题：给定 n，输出 1~n 的所有排列（n! 种）。' },
    { type:'code', title:'全排列（回溯法）', content:'int n, ans[N];\nbool used[N];\n\nvoid dfs(int pos) {\n  if (pos == n) {             // 目标：已填满 n 个位置\n    for (int i = 0; i < n; i++) cout << ans[i] << " ";\n    cout << endl;\n    return;\n  }\n  for (int i = 1; i <= n; i++) {\n    if (!used[i]) {\n      used[i] = true;          // 做出选择\n      ans[pos] = i;\n      dfs(pos + 1);            // 填下一个位置\n      used[i] = false;         // 撤销选择（回溯）\n    }\n  }\n}' },
    { type:'para', content:'搜索过程分析：搜索树第一层有 n 个分支（选哪个数放第一位），第二层每个分支有 n-1 个分支……总共 n! 个叶子节点。C++ 也提供了内置函数 next_permutation 可以直接生成全排列。' },

    { type:'section', title:'7️⃣ 经典例题二：N 皇后问题' },
    { type:'para', content:'问题：在 N×N 的棋盘上放置 N 个皇后，使得任意两个皇后不在同一行、同一列或同一对角线上。' },
    { type:'code', title:'N 皇后（回溯+剪枝）', content:'int n, cnt = 0;\nint col[20];      // col[row] = 皇后所在的列\nbool usedCol[20]; // 列是否已占用\nbool diag1[40];   // 主对角线 row - col + n（转成非负下标）\nbool diag2[40];   // 副对角线 row + col\n\nvoid dfs(int row) {\n  if (row == n) { cnt++; return; } // 找到一个解\n  for (int c = 0; c < n; c++) {\n    int d1 = row - c + n;  // 主对角线\n    int d2 = row + c;      // 副对角线\n    if (!usedCol[c] && !diag1[d1] && !diag2[d2]) {\n      usedCol[c] = diag1[d1] = diag2[d2] = true;\n      col[row] = c;\n      dfs(row + 1);\n      usedCol[c] = diag1[d1] = diag2[d2] = false;\n    }\n  }\n}' },
    { type:'para', content:'关键技巧：' },
    { type:'bullet', items:[
      '按行搜索（每行只放一个皇后），天然避免同行冲突',
      '列冲突：usedCol 数组记录已占用的列',
      '主对角线冲突（左上-右下）：同一对角线的 row - col 为定值，加 n 转成非负索引',
      '副对角线冲突（右上-左下）：同一对角线的 row + col 为定值',
      '用这三个数组将每次检查冲突降为 O(1)，而不是 O(N) 遍历',
    ]},
    { type:'tip', content:'N 皇后复杂度：解空间为 N^N（每行有 N 个选择），但通过剪枝（受攻击位置不选）大幅减少。N=8 时有 92 个解。' },
    { type:'warning', content:'N 皇后是 CSP-J/S 高频考题！注意三个关键数组的索引设计：主对角线用 row-col+n，副对角线用 row+col。' },

    { type:'section', title:'8️⃣ 经典例题三：迷宫问题' },
    { type:'para', content:'问题：给定一个 N×M 的迷宫（0 表示可走，1 表示障碍），求从起点到终点的最短路径或路径数量。' },
    { type:'sub', title:'DFS 求路径条数' },
    { type:'code', title:'迷宫路径计数（DFS+回溯）', content:'int maze[N][M];\nbool vis[N][M];\nint sx, sy, ex, ey; // 起点和终点\nint dir[4][2] = {{1,0},{-1,0},{0,1},{0,-1}}; // 四个方向\nint ans = 0;\n\nvoid dfs(int x, int y) {\n  if (x == ex && y == ey) { ans++; return; }\n  for (int i = 0; i < 4; i++) {\n    int nx = x + dir[i][0];\n    int ny = y + dir[i][1];\n    if (nx>=0 && nx<N && ny>=0 && ny<M\n        && maze[nx][ny]==0 && !vis[nx][ny]) {\n      vis[nx][ny] = true;\n      dfs(nx, ny);\n      vis[nx][ny] = false;\n    }\n  }\n}' },

    { type:'sub', title:'BFS 求最短路径' },
    { type:'code', title:'迷宫最短路径（BFS）', content:'int bfs(int sx, int sy, int ex, int ey) {\n  queue<tuple<int,int,int>> q; // (x, y, distance)\n  bool vis[N][M] = {false};\n  int dir[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};\n  q.push({sx, sy, 0});\n  vis[sx][sy] = true;\n  while (!q.empty()) {\n    auto [x, y, d] = q.front(); q.pop();\n    if (x == ex && y == ey) return d; // 首次到达即最短\n    for (int i = 0; i < 4; i++) {\n      int nx = x + dir[i][0];\n      int ny = y + dir[i][1];\n      if (nx>=0 && nx<N && ny>=0 && ny<M\n          && maze[nx][ny]==0 && !vis[nx][ny]) {\n        vis[nx][ny] = true;\n        q.push({nx, ny, d+1});\n      }\n    }\n  }\n  return -1; // 不可达\n}' },
    { type:'para', content:'对比分析：' },
    { type:'bullet', items:[
      'DFS 求路径数：用回溯框架，每次到达终点计数 +1。需要 visited 标记/取消标记。',
      'BFS 求最短路径：按层扩展，首次到达终点即为最短路径，用 visited 标记（不取消）。',
      '注意：DFS 中的 visited 需要回溯（取消标记），否则会漏掉其他路径；BFS 中的 visited 不需要回溯。',
    ]},
    { type:'tip', content:'迷宫问题的方向数组技巧：int dir[4][2] = {{0,1},{0,-1},{1,0},{-1,0}} 分别代表 右、左、下、上，用循环遍历四种方向，避免写四个 if。' },

    { type:'section', title:'9️⃣ 搜索优化技巧汇总' },
    { type:'table', headers:['技巧','说明','适用场景'], rows:[
      ['剪枝','提前排除不可能的解','回溯法通用'],
      ['记忆化搜索','记录已计算状态避免重复','DP化DFS'],
      ['迭代加深（IDDFS）','限制DFS深度，逐步增加','状态空间大但解浅'],
      ['双向BFS','起点和终点同时BFS','起点和终点都明确'],
      ['启发式搜索（A*）','用估价函数引导搜索方向','路径规划'],
      ['状态压缩','用位运算表示状态','状态空间可枚举'],
    ]},

    { type:'section', title:'📌 CSP-J/S 常考题型' },
    { type:'quiz', items:[
      { q:'以下哪种数据结构最适合实现 BFS？', options:['栈','队列','堆','优先队列'], answer:1, explain:'BFS 用队列（FIFO）实现按层遍历。' },
      { q:'在一个有 n 个节点的图上做 DFS，其时间复杂度（使用邻接表）是？', options:['O(n)','O(n²)','O(n+e)','O(n log n)'], answer:2, explain:'DFS/BFS 遍历图的时间复杂度都是 O(n+e)，n 为节点数，e 为边数。' },
      { q:'N 皇后问题中，用什么方法检测主对角线冲突？', options:['使用 row+col','使用 row-col','使用 row*col','使用 row/col'], answer:1, explain:'主对角线用 row-col（加偏移转非负），副对角线用 row+col。' },
      { q:'在迷宫中求从起点到终点的最短路径，最适合的搜索算法是？', options:['DFS','BFS','二分查找','冒泡排序'], answer:1, explain:'BFS 按层扩展，首次到达终点即为最短路径。' },
      { q:'回溯法中，以下哪个不属于常见的剪枝策略？', options:['可行性剪枝','最优性剪枝','时间复杂度剪枝','对称性剪枝'], answer:2 },
      { q:'用 DFS+回溯求解全排列问题（n=8），搜索树的叶子节点数量是？', options:['8','64','40320','5040'], answer:2, explain:'全排列的叶子节点数为 n!，8! = 40320。' },
    ]},
  ]
};
