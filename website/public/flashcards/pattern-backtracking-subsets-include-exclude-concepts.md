## Backtracking - Subsets Include/Exclude: Core Concepts

What are the fundamental principles of the include/exclude backtracking pattern?

<!-- front -->

---

### Core Concept

Use **binary decision making at each element to systematically explore all subset combinations**, creating a decision tree where each path represents one subset.

**Key insight**: Every element has exactly 2 choices - it either belongs to the current subset or it doesn't. For n elements, this yields exactly 2^n subsets.

---

### The Decision Tree

```
Generating subsets for [1, 2]:

              Level 0 (Element 1)
              /                \
         Exclude 1            Include 1
          /    \              /        \
    Level 1   Exclude 2   Include 2   Exclude 2   Include 2
    (Elem 2)     |           |            |          |
              Result []    [2]         [1]      [1,2]
              
Total subsets: 2^2 = 4
```

---

### The Include/Exclude Pattern

| Decision | Action | Effect |
|----------|--------|--------|
| **Exclude** | Skip element, recurse | Subset without current element |
| **Include** | Add element, recurse, remove | Subset with current element |

**Critical rule**: The order of exclude/include doesn't matter, but backtracking (pop) is required after the include branch.

---

### Why 2^n Subsets?

| n | Subsets | Pattern |
|---|---------|---------|
| 0 | 1 | {∅} |
| 1 | 2 | {}, {a} |
| 2 | 4 | {}, {a}, {b}, {a,b} |
| 3 | 8 | Each adds element to all previous |
| n | 2^n | Each element doubles the count |

**Mathematical basis**: Each element creates a binary fork → 2 × 2 × ... × 2 = 2^n

---

### Complexity Analysis

| Aspect | Complexity | Explanation |
|--------|-----------|-------------|
| **Time** | O(2^n × n) | 2^n subsets, O(n) to copy each |
| **Space** | O(n) | Recursion stack depth |
| **Total storage** | O(n × 2^n) | All subsets combined |

---

### Common Applications

| Problem Type | Description | Modification |
|--------------|-------------|--------------|
| **Power Set** | All subsets | Standard template |
| **Subset Sum** | Subsets matching target | Add sum parameter + pruning |
| **Size K** | Subsets of exactly k | Track size, return early |
| **With Duplicates** | Input has duplicates | Sort + skip duplicates |
| **Partition** | Split into equal sums | Track two running sums |

<!-- back -->
