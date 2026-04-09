## Stack - Valid Parentheses: Comparison

When should you use different approaches for parentheses problems?

<!-- front -->

---

### Stack vs Counter (Single Type)

| Aspect | Stack (Multiple Types) | Counter (Single Type) |
|--------|------------------------|----------------------|
| **Space** | O(n) | O(1) |
| **Time** | O(n) | O(n) |
| **Bracket types** | Multiple: (), {}, [] | Single: () only |
| **Use case** | General solution | Single type optimization |
| **Order tracking** | ✅ Full order | ✅ Implicit via count |
| **Code complexity** | Requires hash map | Simple counter |

**Rule of thumb:** Use counter only when guaranteed single bracket type.

---

### Stack Storage: Brackets vs Indices

| Aspect | Store Brackets | Store Indices |
|--------|----------------|---------------|
| **Space** | O(n) for brackets | O(n) for indices |
| **Basic validation** | ✅ Works | Works |
| **Remove invalid** | ❌ Hard | ✅ Track positions |
| **Longest valid** | ❌ Can't compute | ✅ Calculate lengths |
| **Min additions** | ✅ Works | ✅ Works |

**Decision:** Store indices when you need to reference positions in the original string.

---

### Iterative vs Recursive

| Aspect | Iterative (Stack) | Recursive |
|--------|-------------------|-----------|
| **Stack space** | O(n) explicit | O(n) call stack |
| **Base case** | Empty string | Empty string |
| **Natural fit** | ✅ Yes | Less common |
| **Risk** | None | Stack overflow |
| **Readability** | Standard | Can be confusing |

**Winner:** Iterative for all parentheses problems.

---

### Approach Decision Tree

```
Problem type?
├── Single bracket type only?
│   └── Use counter (O(1) space)
│       └── Return count >= 0 and count == 0
│
├── Need to remove invalid brackets?
│   └── Use stack with indices
│       └── Track unmatched, filter result
│
├── Find longest valid substring?
│   └── Use stack with indices + base marker
│       └── Calculate lengths from indices
│
├── Generate all valid combinations?
│   └── Use backtracking
│       └── Track opens/closes left
│
└── Basic validation only?
    └── Use standard stack with bracket map
        └── O(n) time, O(n) space
```

---

### Complexity Comparison

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Standard stack | O(n) | O(n) | Multiple bracket types |
| Counter | O(n) | O(1) | Single type validation |
| Stack + indices | O(n) | O(n) | Removal, longest substring |
| Two-pointer | O(n) | O(1)* | Special cases only |

*Two-pointer only works for specific problem variants with constraints.

---

### Common Pitfalls Comparison

| Pitfall | Counter Only | Standard Stack | Stack + Indices |
|---------|--------------|----------------|-----------------|
| Wrong order check | ❌ Fails | ✅ Works | ✅ Works |
| Empty stack pop | N/A | Must check | Must check |
| Final stack state | Check count==0 | Check empty | Check empty |
| Mixed bracket types | Can't handle | ✅ Works | ✅ Works |
| Non-bracket chars | May fail | Handle explicitly | Handle explicitly |

---

### When to Use What

| Situation | Approach | Space | Why |
|-----------|----------|-------|-----|
| LeetCode 20 (basic) | Standard stack | O(n) | Clean, general |
| Single type guaranteed | Counter | O(1) | Optimal space |
| LeetCode 921 (min add) | Stack or counter | O(n) or O(1) | Track unmatched |
| LeetCode 301 (remove) | Stack + indices | O(n) | Track positions |
| LeetCode 32 (longest) | Stack + indices | O(n) | Length calculation |
| LeetCode 22 (generate) | Backtracking | O(n) recursion | Build combinations |

<!-- back -->
