export const CATEGORIES = [
  {
    id: 'arrays', name: 'Arrays', icon: '▦', color: '#3b82f6',
    problems: [
      { id: 1, name: 'Set Matrix Zeroes', diff: 'medium', tags: ['matrix'], viz: 'setMatrixZeroes' },
      { id: 2, name: 'Pascal\'s Triangle', diff: 'easy', tags: ['dp'], viz: 'pascalsTriangle' },
      { id: 3, name: 'Next Permutation', diff: 'medium', tags: ['two-pointer'], viz: 'nextPermutation' },
      { id: 4, name: 'Kadane\'s Algorithm', diff: 'medium', tags: ['dp'], viz: 'kadane' },
      { id: 5, name: 'Sort an array of 0s, 1s, 2s', diff: 'medium', tags: ['two-pointer'], viz: 'dutchFlag' },
      { id: 6, name: 'Stock Buy and Sell', diff: 'easy', tags: ['greedy'], viz: 'stockBuySell' },
      { id: 7, name: 'Rotate Matrix', diff: 'medium', tags: ['matrix'], viz: 'rotateMatrix' },
      { id: 8, name: 'Merge Overlapping Intervals', diff: 'medium', tags: ['sorting'], viz: 'mergeIntervals' },
      { id: 9, name: 'Merge Two Sorted Arrays', diff: 'medium', tags: ['two-pointer'], viz: 'mergeSortedArr' },
      { id: 10, name: 'Find Duplicate in Array', diff: 'medium', tags: ['binary-search'], viz: 'findDuplicate' },
      { id: 11, name: 'Repeat and Missing Number', diff: 'hard', tags: ['math'], viz: 'repeatMissing' },
      { id: 12, name: 'Count Inversions', diff: 'hard', tags: ['merge-sort'], viz: 'countInversions' },
      { id: 13, name: 'Search a 2D Matrix', diff: 'medium', tags: ['binary-search'], viz: 'search2DMatrix' },
    ]
  },
  {
    id: 'binsearch', name: 'Binary Search', icon: '⟨⟩', color: '#10b981',
    problems: [
      { id: 14, name: 'Binary Search', diff: 'easy', tags: ['binary-search'], viz: 'binarySearch' },
      { id: 15, name: 'Floor/Ceil in Sorted Array', diff: 'easy', tags: ['binary-search'], viz: 'floorCeil' },
      { id: 16, name: 'Find Nth Root of a Number', diff: 'medium', tags: ['binary-search'], viz: 'nthRoot' },
      { id: 17, name: 'Find Peak Element', diff: 'medium', tags: ['binary-search'], viz: 'peakElement' },
      { id: 18, name: 'Search in Rotated Sorted Array', diff: 'medium', tags: ['binary-search'], viz: 'rotatedSearch' },
    ]
  },
  {
    id: 'strings', name: 'Strings', icon: '"…"', color: '#f59e0b',
    problems: [
      { id: 19, name: 'Reverse Words in String', diff: 'medium', tags: ['string', 'two-pointer'], viz: 'reverseWords' },
      { id: 20, name: 'Longest Palindrome in String', diff: 'medium', tags: ['dp', 'two-pointer'], viz: 'longestPalin' },
      { id: 21, name: 'Roman to Integer', diff: 'easy', tags: ['string'], viz: 'romanToInt' },
      { id: 22, name: 'Implement ATOI/STRSTR', diff: 'medium', tags: ['string'], viz: 'atoi' },
      { id: 23, name: 'Longest Common Prefix', diff: 'easy', tags: ['string'], viz: 'longestPrefix' },
    ]
  },
  {
    id: 'linkedlist', name: 'Linked Lists', icon: '⊙—⊙', color: '#ec4899',
    problems: [
      { id: 24, name: 'Reverse a Linked List', diff: 'easy', tags: ['linked-list'], viz: 'reverseLL' },
      { id: 25, name: 'Find Middle of Linked List', diff: 'easy', tags: ['slow-fast'], viz: 'middleLL' },
      { id: 26, name: 'Merge Two Sorted Lists', diff: 'easy', tags: ['linked-list'], viz: 'mergeSortedLL' },
      { id: 27, name: 'Remove Nth Node From End', diff: 'medium', tags: ['two-pointer'], viz: 'removeNthLL' },
      { id: 28, name: 'Delete Middle of Linked List', diff: 'medium', tags: ['slow-fast'], viz: 'deleteMiddleLL' },
      { id: 29, name: 'Sort Linked List', diff: 'medium', tags: ['merge-sort'], viz: 'sortLL' },
      { id: 30, name: 'Odd Even Linked List', diff: 'medium', tags: ['linked-list'], viz: 'oddEvenLL' },
      { id: 31, name: 'Detect Cycle in Linked List', diff: 'medium', tags: ['slow-fast'], viz: 'detectCycle' },
    ]
  },
  {
    id: 'recursion', name: 'Recursion & Backtracking', icon: '↺', color: '#a78bfa',
    problems: [
      { id: 32, name: 'Subset Sum', diff: 'medium', tags: ['backtracking'], viz: 'subsetSum' },
      { id: 33, name: 'Subset Sum II (Unique)', diff: 'medium', tags: ['backtracking'], viz: 'subsetSumII' },
      { id: 34, name: 'Combination Sum', diff: 'medium', tags: ['backtracking'], viz: 'combinationSum' },
      { id: 35, name: 'Permutations of Array', diff: 'medium', tags: ['backtracking'], viz: 'permutations' },
    ]
  },
  {
    id: 'trees', name: 'Binary Trees', icon: '⌥', color: '#06b6d4',
    problems: [
      { id: 36, name: 'Inorder Traversal', diff: 'easy', tags: ['tree', 'dfs'], viz: 'inorder' },
      { id: 37, name: 'Preorder Traversal', diff: 'easy', tags: ['tree', 'dfs'], viz: 'preorder' },
      { id: 38, name: 'Postorder Traversal', diff: 'easy', tags: ['tree', 'dfs'], viz: 'postorder' },
      { id: 39, name: 'Level Order Traversal', diff: 'medium', tags: ['tree', 'bfs'], viz: 'levelOrder' },
      { id: 40, name: 'Height of Binary Tree', diff: 'easy', tags: ['tree', 'dfs'], viz: 'treeHeight' },
      { id: 41, name: 'Diameter of Binary Tree', diff: 'easy', tags: ['tree', 'dfs'], viz: 'treeDiameter' },
      { id: 42, name: 'Check if Tree is Balanced', diff: 'medium', tags: ['tree'], viz: 'isBalanced' },
      { id: 43, name: 'LCA of Binary Tree', diff: 'medium', tags: ['tree'], viz: 'lcaTree' },
      { id: 44, name: 'Zigzag Level Order', diff: 'medium', tags: ['tree', 'bfs'], viz: 'zigzagOrder' },
      { id: 45, name: 'Boundary Traversal', diff: 'medium', tags: ['tree'], viz: 'boundaryTraversal' },
      { id: 46, name: 'Maximum Path Sum', diff: 'hard', tags: ['tree', 'dp'], viz: 'maxPathSum' },
    ]
  },
  {
    id: 'bst', name: 'Binary Search Tree', icon: '⊤', color: '#84cc16',
    problems: [
      { id: 47, name: 'Search in BST', diff: 'easy', tags: ['bst'], viz: 'searchBST' },
      { id: 48, name: 'Convert Sorted Array to BST', diff: 'easy', tags: ['bst'], viz: 'sortedArrToBST' },
      { id: 49, name: 'Validate BST', diff: 'medium', tags: ['bst'], viz: 'validateBST' },
      { id: 50, name: 'LCA of BST', diff: 'medium', tags: ['bst'], viz: 'lcaBST' },
      { id: 51, name: 'Kth Smallest in BST', diff: 'medium', tags: ['bst'], viz: 'kthSmallestBST' },
    ]
  },
  {
    id: 'graphs', name: 'Graphs', icon: '◈', color: '#f97316',
    problems: [
      { id: 52, name: 'BFS of Graph', diff: 'easy', tags: ['graph', 'bfs'], viz: 'graphBFS' },
      { id: 53, name: 'DFS of Graph', diff: 'easy', tags: ['graph', 'dfs'], viz: 'graphDFS' },
      { id: 54, name: 'Detect Cycle (Undirected)', diff: 'medium', tags: ['graph', 'bfs'], viz: 'detectCycleGraph' },
      { id: 55, name: 'Detect Cycle (Directed)', diff: 'medium', tags: ['graph', 'dfs'], viz: 'detectCycleDirected' },
      { id: 56, name: 'Topological Sort (DFS)', diff: 'medium', tags: ['graph', 'dfs'], viz: 'topoSortDFS' },
      { id: 57, name: 'Topological Sort (BFS/Kahn)', diff: 'medium', tags: ['graph', 'bfs'], viz: 'topoSortBFS' },
      { id: 58, name: 'Number of Islands', diff: 'medium', tags: ['graph', 'dfs'], viz: 'numIslands' },
    ]
  },
  {
    id: 'dp', name: 'Dynamic Programming', icon: '▤', color: '#8b5cf6',
    problems: [
      { id: 59, name: 'Longest Common Subsequence', diff: 'medium', tags: ['dp'], viz: 'lcs' },
      { id: 60, name: 'Longest Increasing Subsequence', diff: 'medium', tags: ['dp'], viz: 'lisDP' },
      { id: 61, name: 'Edit Distance', diff: 'hard', tags: ['dp'], viz: 'editDistance' },
      { id: 62, name: 'Maximum Sum Rectangle', diff: 'hard', tags: ['dp'], viz: 'maxSumRect' },
      { id: 63, name: '0-1 Knapsack', diff: 'medium', tags: ['dp'], viz: 'knapsack01' },
      { id: 64, name: 'Coin Change', diff: 'medium', tags: ['dp'], viz: 'coinChange' },
      { id: 65, name: 'Subset Sum Problem', diff: 'medium', tags: ['dp'], viz: 'subsetSumDP' },
      { id: 66, name: 'Max Product Subarray', diff: 'medium', tags: ['dp'], viz: 'maxProduct' },
      { id: 67, name: 'Rod Cutting Problem', diff: 'medium', tags: ['dp'], viz: 'rodCutting' },
      { id: 68, name: 'Egg Drop Problem', diff: 'hard', tags: ['dp'], viz: 'eggDrop' },
    ]
  },
  {
    id: 'stackqueue', name: 'Stack & Queue', icon: '⊞', color: '#14b8a6',
    problems: [
      { id: 69, name: 'Implement Stack using Queue', diff: 'easy', tags: ['stack', 'queue'], viz: 'stackUsingQueue' },
      { id: 70, name: 'Implement Queue using Stack', diff: 'easy', tags: ['stack', 'queue'], viz: 'queueUsingStack' },
      { id: 71, name: 'Valid Parentheses', diff: 'easy', tags: ['stack'], viz: 'validParens' },
      { id: 72, name: 'Next Greater Element', diff: 'medium', tags: ['stack', 'monotonic'], viz: 'nextGreater' },
      { id: 73, name: 'Largest Rectangle in Histogram', diff: 'hard', tags: ['stack'], viz: 'largestRect' },
      { id: 74, name: 'Sliding Window Maximum', diff: 'hard', tags: ['deque'], viz: 'slidingWindowMax' },
    ]
  },
  {
    id: 'greedy', name: 'Greedy', icon: '★', color: '#f43f5e',
    problems: [
      { id: 75, name: 'N Meetings in One Room', diff: 'easy', tags: ['greedy'], viz: 'nMeetings' },
      { id: 76, name: 'Minimum Platforms Required', diff: 'medium', tags: ['greedy', 'sorting'], viz: 'minPlatforms' },
      { id: 77, name: 'Job Sequencing Problem', diff: 'medium', tags: ['greedy'], viz: 'jobSequencing' },
      { id: 78, name: 'Fractional Knapsack', diff: 'medium', tags: ['greedy'], viz: 'fractionalKnapsack' },
      { id: 79, name: 'Huffman Coding', diff: 'medium', tags: ['greedy', 'heap'], viz: 'huffmanCoding' },
    ]
  }
];
