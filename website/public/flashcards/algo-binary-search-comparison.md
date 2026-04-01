## Binary Search: Comparison Guide

How does binary search compare to other search and optimization algorithms?

<!-- front -->

---

### Search Algorithm Comparison

| Algorithm | Data Structure | Time | Space | Requirements |
|-----------|-----------------|------|-------|--------------|
| **Linear Search** | Array/Linked List | O(n) | O(1) | None |
| **Binary Search** | Sorted Array | O(log n) | O(1) | Sorted, random access |
| **Hash Table** | Hash Map | O(1) avg | O(n) | Hash function |
| **Interpolation Search** | Sorted Array | O(log log n) avg | O(1) | Uniform distribution |
| **Exponential Search** | Sorted Array | O(log i) | O(1) | Target near start |
| **Jump Search** | Sorted Array | O(√n) | O(1) | Block size = √n |
| **Fibonacci Search** | Sorted Array | O(log n) | O(1) | Divide by golden ratio |

---

### When to Use Each Search

| Scenario | Best Algorithm |
|----------|----------------|
| Unsorted data, single search | Linear search |
| Unsorted data, many searches | Hash table (preprocess) |
| Sorted array, few searches | Binary search |
| Sorted array, many searches | Preprocess to hash table |
| Linked list | Linear search |
| String matching | KMP, Boyer-Moore, Rabin-Karp |
| Database index | B-tree, B+ tree |

---

### Binary Search vs Linear Search

| Aspect | Binary Search | Linear Search |
|--------|---------------|---------------|
| **Prerequisite** | Sorted array | None |
| **Time** | O(log n) | O(n) |
| **Best case** | O(1) (middle element) | O(1) (first element) |
| **Worst case** | O(log n) | O(n) |
| **Preprocessing** | Sorting: O(n log n) | None |
| **Break-even** | Binary wins after ~log n searches |

---

### Binary Search Variants Comparison

| Variant | Time | Use Case |
|---------|------|----------|
| **Standard** | O(log n) | Finding element |
| **Lower bound** | O(log n) | Insertion point, predecessor |
| **Upper bound** | O(log n) | Successor, counting duplicates |
| **Exponential** | O(log i) | Unbounded/unbounded search |
| **Ternary** | O(log₃ n) | Convex function optimization |
| **Golden section** | O(log n) | Convex optimization, fewer evals |

**Note:** Ternary search has same complexity class but larger constant.

---

### Search on Answer vs Other Optimization

| Method | When Applicable | Time |
|--------|-----------------|------|
| **Search on answer** | Decision problem verifiable in P | O(log(range) × verify) |
| **Greedy** | Greedy choice property | O(n) or O(n log n) |
| **DP** | Optimal substructure | Varies |
| **Convex hull trick** | Linear functions, monotonic queries | O(n) or O(log n) |
| **Parametric search** | Parallel comparison possible | O(verify × log n) |

**Binary search on answer + greedy verification** is a common competitive programming pattern.

<!-- back -->
