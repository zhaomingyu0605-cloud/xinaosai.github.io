// 模块13：排序与查找
lessonsRaw['m13'] = {
  title: '排序与查找',
  icon: '🔍',
  data: [
    { type:'objective', items:[
      '掌握冒泡排序、选择排序、插入排序的原理与实现',
      '理解归并排序、快速排序、堆排序、计数排序的算法思想',
      '掌握排序算法的稳定性概念，能判断各排序是否稳定',
      '掌握二分查找及其 lower_bound / upper_bound 写法',
    ]},
    { type:'section', title:'1️⃣ 排序基础概念' },
    { type:'para', content:'排序（Sorting）是将一组无序数据按某种规则（通常是升序或降序）重新排列的过程。排序是信息学竞赛最基础的算法之一，也是各种算法的基石。' },
    { type:'para', content:'排序算法可以从多个维度评价：时间复杂度（最好/最坏/平均）、空间复杂度（是否为原地排序）、稳定性（相等元素排序后相对顺序是否不变）。' },

    { type:'section', title:'2️⃣ O(n²) 排序——基础三兄弟' },

    { type:'sub', title:'冒泡排序（Bubble Sort）' },
    { type:'para', content:'核心思想：从前往后遍历数组，依次比较相邻两个元素，如果前面比后面大则交换。每轮遍历会把当前未排序部分的最大值"冒泡"到末尾。' },
    { type:'code', title:'冒泡排序实现', content:'void bubbleSort(int a[], int n) {\n  for (int i = 0; i < n-1; i++) {\n    bool swapped = false;\n    for (int j = 0; j < n-1-i; j++) {\n      if (a[j] > a[j+1]) {\n        swap(a[j], a[j+1]);\n        swapped = true;\n      }\n    }\n    if (!swapped) break; // 优化：没有交换说明已经有序\n  }\n}' },
    { type:'table', headers:['指标','值'], rows:[
      ['时间复杂度（平均）','O(n²)'],
      ['时间复杂度（最好）','O(n) — 已有序，优化后一轮结束'],
      ['时间复杂度（最坏）','O(n²) — 完全逆序'],
      ['空间复杂度','O(1) — 原地排序'],
      ['稳定性','✅ 稳定（相等时不交换）'],
    ]},
    { type:'para', content:'过程描述：第一轮从 a[0] 遍历到 a[n-2]，相邻比较交换，最大值到 a[n-1]；第二轮从 a[0] 到 a[n-3]……每轮确定一个最大值的位置。共 n-1 轮。' },

    { type:'sub', title:'选择排序（Selection Sort）' },
    { type:'para', content:'核心思想：每轮在未排序部分中找到最小值，将其放到已排序部分的末尾（即与未排序部分第一个元素交换）。' },
    { type:'code', title:'选择排序实现', content:'void selectionSort(int a[], int n) {\n  for (int i = 0; i < n-1; i++) {\n    int minIdx = i;\n    for (int j = i+1; j < n; j++) {\n      if (a[j] < a[minIdx]) minIdx = j;\n    }\n    if (minIdx != i) swap(a[i], a[minIdx]);\n  }\n}' },
    { type:'table', headers:['指标','值'], rows:[
      ['时间复杂度（平均）','O(n²)'],
      ['时间复杂度（最好）','O(n²) — 不论有序与否都要找最小值'],
      ['时间复杂度（最坏）','O(n²)'],
      ['空间复杂度','O(1) — 原地排序'],
      ['稳定性','❌ 不稳定（交换可能打乱相等元素的顺序）'],
    ]},
    { type:'para', content:'过程描述：第一轮从 a[0]~a[n-1] 找最小值与 a[0] 交换；第二轮从 a[1]~a[n-1] 找最小值与 a[1] 交换……共 n-1 轮。每轮确定一个最小值的位置。' },
    { type:'warning', content:'选择排序的交换次数最少（最多 n-1 次），但比较次数固定为 n(n-1)/2。当交换代价很大时可以考虑。' },

    { type:'sub', title:'插入排序（Insertion Sort）' },
    { type:'para', content:'核心思想：将数组看作"已排序 + 未排序"两部分，每次从未排序部分取出第一个元素，插入到已排序部分的正确位置（类似打牌时整理手牌）。' },
    { type:'code', title:'插入排序实现', content:'void insertionSort(int a[], int n) {\n  for (int i = 1; i < n; i++) {\n    int key = a[i];\n    int j = i - 1;\n    while (j >= 0 && a[j] > key) {\n      a[j+1] = a[j];\n      j--;\n    }\n    a[j+1] = key;\n  }\n}' },
    { type:'table', headers:['指标','值'], rows:[
      ['时间复杂度（平均）','O(n²)'],
      ['时间复杂度（最好）','O(n) — 已有序，只需遍历一遍'],
      ['时间复杂度（最坏）','O(n²) — 完全逆序'],
      ['空间复杂度','O(1) — 原地排序'],
      ['稳定性','✅ 稳定（相等时插在后面，不往前越）'],
    ]},
    { type:'tip', content:'插入排序在数据基本有序的情况下效率极高（接近 O(n)），且稳定、原地，常作为高级排序算法的"小数组优化"。' },
    { type:'warning', content:'CSP 常考区别：冒泡=相邻交换，选择=选最小交换，插入=插到正确位置。三种排序中，插入排序在"基本有序"时最快。' },

    { type:'section', title:'3️⃣ O(n log n) 排序——进阶三剑客' },

    { type:'sub', title:'归并排序（Merge Sort）' },
    { type:'para', content:'核心思想：分治策略——将数组不断二分，直到每个子数组只有一个元素（天然有序），然后两两合并成有序数组。' },
    { type:'para', content:'过程描述：' },
    { type:'bullet', items:[
      '分解：将数组从中间分成左右两半，递归对左右两半分别排序',
      '合并：将两个有序子数组合并成一个有序数组（双指针法，依次取较小者）',
      '归并排序是分治思想的经典应用，每次合并需要 O(n) 时间，共 log n 层，总时间 O(n log n)',
    ]},
    { type:'code', title:'归并排序实现（合并部分）', content:'void merge(int a[], int l, int m, int r) {\n  vector<int> tmp(r - l + 1);\n  int i = l, j = m+1, k = 0;\n  while (i <= m && j <= r)\n    tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];\n  while (i <= m) tmp[k++] = a[i++];\n  while (j <= r) tmp[k++] = a[j++];\n  for (int p = 0; p < k; p++) a[l+p] = tmp[p];\n}\n\nvoid mergeSort(int a[], int l, int r) {\n  if (l >= r) return;\n  int m = (l + r) / 2;\n  mergeSort(a, l, m);\n  mergeSort(a, m+1, r);\n  merge(a, l, m, r);\n}' },
    { type:'table', headers:['指标','值'], rows:[
      ['时间复杂度（全部情况）','O(n log n) — 始终二分'],
      ['空间复杂度','O(n) — 需要临时数组存合并结果'],
      ['稳定性','✅ 稳定（合并时左优先，相等时左先入）'],
    ]},
    { type:'warning', content:'归并排序需要 O(n) 额外空间，但它是稳定的 O(n log n) 排序。在需要稳定排序且内存充足的场景下很常用。' },

    { type:'sub', title:'快速排序（Quick Sort）' },
    { type:'para', content:'核心思想：分治策略——选择一个"基准"（pivot），将数组分成两部分，左边都 ≤ 基准，右边都 ≥ 基准，然后递归排序左右两部分。' },
    { type:'para', content:'过程描述：' },
    { type:'bullet', items:[
      '选择基准：通常选最左、最右、中间或随机元素',
      '划分（partition）：用双指针把比 pivot 小的元素移到左边，大的移到右边',
      '递归：对左右两部分分别进行快速排序',
      '快速排序的"快"体现在大部分情况下划分很均衡，常数小',
    ]},
    { type:'code', title:'快速排序实现（Lomuto划分）', content:'int partition(int a[], int l, int r) {\n  int pivot = a[r]; // 选最右为基准\n  int i = l;\n  for (int j = l; j < r; j++) {\n    if (a[j] <= pivot) swap(a[i++], a[j]);\n  }\n  swap(a[i], a[r]);\n  return i;\n}\n\nvoid quickSort(int a[], int l, int r) {\n  if (l >= r) return;\n  int p = partition(a, l, r);\n  quickSort(a, l, p-1);\n  quickSort(a, p+1, r);\n}' },
    { type:'table', headers:['指标','值'], rows:[
      ['时间复杂度（平均）','O(n log n)'],
      ['时间复杂度（最好）','O(n log n) — 每次划分均匀'],
      ['时间复杂度（最坏）','O(n²) — 数组已有序且每次选最左/右为 pivot'],
      ['空间复杂度','O(log n) ~ O(n) — 递归栈空间'],
      ['稳定性','❌ 不稳定（partition 交换可能打乱相等元素的顺序）'],
    ]},
    { type:'tip', content:'快速排序的 worst-case O(n²) 可以通过"三数取中"（median-of-three）或随机选 pivot 来避免。C++ STL 的 sort() 就是快速排序+插入排序混合实现。' },

    { type:'sub', title:'堆排序（Heap Sort）' },
    { type:'para', content:'核心思想：利用堆（完全二叉树）的数据结构。先将数组构建成大根堆（最大堆），然后反复将堆顶（最大值）与末尾交换，堆大小减1，再调整堆。' },
    { type:'para', content:'过程描述：' },
    { type:'bullet', items:[
      '建堆：从最后一个非叶子节点开始，从下往上进行下沉（sift-down）调整，时间复杂度 O(n)',
      '排序：重复 n-1 次——将堆顶与堆末尾交换，堆大小减1，然后对堆顶做下沉调整 O(log n)',
      '总时间复杂度 O(n log n)，原地排序（无需额外空间）',
    ]},
    { type:'code', title:'堆排序实现', content:'void siftDown(int a[], int n, int i) {\n  while (true) {\n    int largest = i;\n    int l = 2*i+1, r = 2*i+2;\n    if (l < n && a[l] > a[largest]) largest = l;\n    if (r < n && a[r] > a[largest]) largest = r;\n    if (largest == i) break;\n    swap(a[i], a[largest]);\n    i = largest;\n  }\n}\n\nvoid heapSort(int a[], int n) {\n  // 建堆\n  for (int i = n/2-1; i >= 0; i--) siftDown(a, n, i);\n  // 排序\n  for (int i = n-1; i > 0; i--) {\n    swap(a[0], a[i]);\n    siftDown(a, i, 0);\n  }\n}' },
    { type:'table', headers:['指标','值'], rows:[
      ['时间复杂度（全部情况）','O(n log n) — 建堆 O(n)，每轮调整 O(log n)'],
      ['空间复杂度','O(1) — 原地排序'],
      ['稳定性','❌ 不稳定（堆顶交换可能打乱相等元素的顺序）'],
    ]},
    { type:'tip', content:'堆排序优势：最坏情况也是 O(n log n)，且不需要额外空间。但常数大，实际比快速排序慢，且不稳定。' },

    { type:'section', title:'4️⃣ O(n + k) 排序——计数排序' },

    { type:'sub', title:'计数排序（Counting Sort）' },
    { type:'para', content:'核心思想：不通过比较，而是通过计数。统计每个值出现的次数，然后根据计数直接确定每个元素在输出数组中的位置。' },
    { type:'para', content:'过程描述：' },
    { type:'bullet', items:[
      '找出待排序数组的最大值 maxVal，创建大小为 maxVal+1 的计数数组 count',
      '遍历原始数组，统计每个值出现的次数（count[a[i]]++）',
      '对 count 数组做前缀和：count[i] += count[i-1]，此时 count[i] 表示 ≤i 的元素个数',
      '从后往前遍历原始数组（保证稳定性），根据 count 确定位置，放入输出数组',
    ]},
    { type:'code', title:'计数排序实现', content:'void countingSort(int a[], int n) {\n  if (n <= 1) return;\n  int maxVal = *max_element(a, a+n);\n  vector<int> count(maxVal+1, 0), output(n);\n  for (int i = 0; i < n; i++) count[a[i]]++;\n  for (int i = 1; i <= maxVal; i++) count[i] += count[i-1];\n  for (int i = n-1; i >= 0; i--) {\n    output[--count[a[i]]] = a[i];\n  }\n  for (int i = 0; i < n; i++) a[i] = output[i];\n}' },
    { type:'table', headers:['指标','值'], rows:[
      ['时间复杂度','O(n + k) — k 为数据范围（最大值）'],
      ['空间复杂度','O(n + k) — 计数数组 + 输出数组'],
      ['稳定性','✅ 稳定（从后往前遍历保证了稳定性）'],
    ]},
    { type:'warning', content:'计数排序只适用于非负整数且数据范围不大的情况。如果数据范围很大（如 10⁹），计数数组会太大，不适用。' },

    { type:'section', title:'5️⃣ 排序算法稳定性' },
    { type:'para', content:'稳定性（Stability）指的是：如果两个元素相等，排序后它们的相对顺序是否保持不变。保持不变的称为"稳定排序"，否则是"不稳定排序"。' },
    { type:'table', headers:['排序算法','稳定性','原因'], rows:[
      ['冒泡排序','✅ 稳定','遇到相等元素不交换，相对顺序不变'],
      ['选择排序','❌ 不稳定','交换可能把前面的相等元素换到后面'],
      ['插入排序','✅ 稳定','相等时插在后面，不往前越'],
      ['归并排序','✅ 稳定','合并时左数组优先取'],
      ['快速排序','❌ 不稳定','partition 交换打乱相对顺序'],
      ['堆排序','❌ 不稳定','堆顶与末尾大跨度交换'],
      ['计数排序','✅ 稳定','从后往前遍历+前缀和保证'],
    ]},
    { type:'tip', content:'记忆口诀："冒插归计"是稳定的，"选快堆"不稳定。注意"选"=选择排序，"快"=快速排序，"堆"=堆排序。' },

    { type:'section', title:'6️⃣ 二分查找（Binary Search）' },
    { type:'para', content:'二分查找是在有序数组中快速查找某个值（或某个边界）的算法，每次将搜索范围缩小一半，时间复杂度 O(log n)。' },
    { type:'sub', title:'标准二分查找' },
    { type:'code', title:'标准二分查找', content:'int binarySearch(int a[], int n, int target) {\n  int l = 0, r = n - 1;\n  while (l <= r) {\n    int mid = l + (r - l) / 2; // 防溢出\n    if (a[mid] == target) return mid;\n    else if (a[mid] < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  return -1; // 未找到\n}' },
    { type:'para', content:'注意：mid = (l+r)/2 有整数溢出风险，推荐 mid = l + (r-l)/2。' },

    { type:'sub', title:'lower_bound — 第一个 ≥ target 的位置' },
    { type:'para', content:'在有序数组中找到第一个大于等于 target 的元素位置（即插入 target 后数组依然有序的最左位置）。若所有元素都小于 target，返回 n（越界位置）。' },
    { type:'code', title:'lower_bound 实现', content:'int lowerBound(int a[], int n, int target) {\n  int l = 0, r = n; // 注意 r = n，因为结果可能为 n\n  while (l < r) {\n    int mid = l + (r - l) / 2;\n    if (a[mid] >= target) r = mid;   // 左区间收缩\n    else l = mid + 1;\n  }\n  return l;\n}' },

    { type:'sub', title:'upper_bound — 第一个 > target 的位置' },
    { type:'para', content:'在有序数组中找到第一个大于 target 的元素位置。若所有元素都 ≤ target，返回 n。' },
    { type:'code', title:'upper_bound 实现', content:'int upperBound(int a[], int n, int target) {\n  int l = 0, r = n;\n  while (l < r) {\n    int mid = l + (r - l) / 2;\n    if (a[mid] > target) r = mid;\n    else l = mid + 1;\n  }\n  return l;\n}' },
    { type:'tip', content:'lower_bound 和 upper_bound 的差就是 target 在数组中的出现次数：cnt = upperBound - lowerBound。C++ STL 中直接提供了 std::lower_bound 和 std::upper_bound。' },

    { type:'section', title:'7️⃣ 排序算法对比总结' },
    { type:'table', headers:['排序','平均时间','最坏时间','空间','稳定'], rows:[
      ['冒泡排序','O(n²)','O(n²)','O(1)','✅'],
      ['选择排序','O(n²)','O(n²)','O(1)','❌'],
      ['插入排序','O(n²)','O(n²)','O(1)','✅'],
      ['归并排序','O(n log n)','O(n log n)','O(n)','✅'],
      ['快速排序','O(n log n)','O(n²)','O(log n)','❌'],
      ['堆排序','O(n log n)','O(n log n)','O(1)','❌'],
      ['计数排序','O(n+k)','O(n+k)','O(n+k)','✅'],
    ]},
    { type:'tip', content:'C++ 竞赛中常用排序：sort() 用快速排序+插入排序，stable_sort() 用归并排序（稳定）。如果对结构体排序需要保持顺序，记得用 stable_sort。' },

    { type:'section', title:'📌 CSP-J/S 常考题型' },
    { type:'quiz', items:[
      { q:'以下哪个排序算法是稳定的？', options:['快速排序','堆排序','归并排序','选择排序'], answer:2, explain:'归并排序合并时左优先，保持相等元素的相对顺序。' },
      { q:'冒泡排序经过优化（检测是否已排序），最好情况的时间复杂度是？', options:['O(1)','O(n)','O(n log n)','O(n²)'], answer:1, explain:'最好情况数组已经有序，一轮遍历发现无交换就退出，只需 O(n)。' },
      { q:'在已有序的数组上使用快速排序（每次选最右元素为pivot），时间复杂度是？', options:['O(log n)','O(n)','O(n log n)','O(n²)'], answer:3, explain:'每次划分极度不均衡，退化为 O(n²)。' },
      { q:'二分查找的时间复杂度是？', options:['O(1)','O(log n)','O(n)','O(n log n)'], answer:1 },
      { q:'在有序数组 [1,3,5,5,5,7,9] 中，lower_bound(5) 的返回结果是？', options:['2','3','4','5'], answer:0, explain:'第一个 ≥5 的位置是下标 2（值为5）。' },
      { q:'以下哪个排序的最坏时间复杂度不是 O(n²)？', options:['冒泡排序','快速排序','归并排序','选择排序'], answer:2, explain:'归并排序始终是 O(n log n)。' },
      { q:'为什么计数排序的适用范围有限？', options:['仅支持整数','需要大量内存给计数数组','不支持负数','以上都是'], answer:3, explain:'只支持整数，数据范围大时计数数组过大，负数需要加偏移。' },
      { q:'lower_bound 和 upper_bound 的差值表示什么？', options:['最大值','最小值','目标值的唯一位置','目标值的出现次数'], answer:3 },
    ]},
  ]
};
