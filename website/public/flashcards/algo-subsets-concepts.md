## Title: Subsets (Backtracking) - Core Concepts

What is the subsets (power set) generation problem?

<!-- front -->

---

### Definition
Generating all possible subsets (power set) of a given set. For n elements, there are exactly 2^n subsets because each element presents a binary choice: include or exclude.

| Aspect | Details |
|--------|---------|
| **Output Size** | 2^n subsets |
| **Time** | O(n × 2^n) - optimal since output is this size |
| **Space** | O(n) auxiliary for backtracking |
| **Practical Limit** | n ≤ 20 for storing all subsets |

---

### Power Set Cardinality

| n | 2^n | Subset Count | Practical? |
|---|-----|--------------|------------|
| 3 | 8 | 8 | Yes |
| 5 | 32 | 32 | Yes |
| 10 | 1,024 | 1,024 | Yes |
| 15 | 32,768 | 32,768 | Yes |
| 20 | 1,048,576 | ~1 million | Maybe |
| 25 | 33,554,432 | ~33 million | No |

---

### Three Main Approaches

| Approach | Mechanism | Space | Intuition |
|----------|-----------|-------|-----------|
| **Backtracking** | Include/exclude recursively | O(n) | Decision tree |
| **Bit Manipulation** | Iterate all bitmasks | O(n × 2^n) | Binary enumeration |
| **Iterative** | Build subsets incrementally | O(n × 2^n) | Cascade building |

---

### Decision Tree Structure

```
For [1, 2, 3]:

                    []
               /         \
          [1]                []
        /    \             /    \
    [1,2]    [1]        [2]     []
    /   \      \         / \      \
[1,2,3][1,2][1,3][1][2,3][2][3] []

Each leaf is a subset. Internal nodes are also valid subsets.
```

<!-- back -->
