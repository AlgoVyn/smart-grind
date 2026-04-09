## Two Pointers - Expanding From Center (Palindromes): Comparison

When should you use different approaches for palindrome problems?

<!-- front -->

---

### Approach Comparison: Three Methods

| Aspect | Expand Around Center | Dynamic Programming | Manacher's Algorithm |
|--------|---------------------|-------------------|---------------------|
| **Time** | O(n²) | O(n²) | O(n) |
| **Space** | O(1) | O(n²) | O(n) |
| **Implementation** | Simple | Moderate | Complex |
| **Interview Use** | ✅ Preferred | ⚠️ Sometimes | ❌ Rarely needed |
| **Production** | Good | Memory heavy | Best for large inputs |
| **Debugging** | Easy | Moderate | Hard |
| **Pattern Extension** | Easy | Moderate | Hard |

**Recommendation**: Use Expand Around Center for interviews. Manacher's only if explicitly asked for O(n).

---

### Expand Around Center vs Dynamic Programming

| Feature | Expand Around Center | Dynamic Programming |
|---------|---------------------|---------------------|
| **Core Idea** | Symmetry from center | Build from smaller subproblems |
| **Table needed** | No | Yes: dp[i][j] = is palindrome |
| **Recurrence** | None (direct expansion) | dp[i][j] = (s[i]==s[j]) && dp[i+1][j-1] |
| **Single chars** | Implicitly handled | Base case: dp[i][i] = True |
| **Two chars** | Expansion stops naturally | Base case: dp[i][i+1] = (s[i]==s[i+1]) |
| **Space efficiency** | ✅ O(1) | ❌ O(n²) |
| **Intuition** | Direct palindrome property | Substructure building |

**Winner**: Expand Around Center for most cases (better space, simpler code).

---

### When to Use What

```
Problem constraints?
├── Interview setting (most common)
│   └── Expand Around Center
│   └── Time: O(n²), Space: O(1)
│   └── Easy to explain, write, debug
│
├── Need path/reconstruction details
│   └── Dynamic Programming
│   └── Full table enables substring queries
│   └── Can answer: "is s[i:j] a palindrome?"
│
├── Guaranteed O(n) required
│   └── Manacher's Algorithm
│   └── Transform: "abc" → "#a#b#c#"
│   └── Use radius array and mirror property
│   └── Rarely needed in interviews
│
└── Multiple palindrome queries on same string
    └── Precompute with DP
    └── Build is_pal[i][j] table once
    └── O(n²) preprocess, O(1) per query
```

---

### Decision Matrix

| Situation | Approach | Space | Why |
|-----------|----------|-------|----- |
| Standard interview | Expand around center | O(1) | Clean, optimal for interviews |
| Memory not constrained | Dynamic Programming | O(n²) | Easier for some to understand |
| Large n (millions) | Manacher's | O(n) | Only true O(n) solution |
| Multiple substring queries | Precompute DP table | O(n²) | Fast O(1) lookups after |
| Learning/Teaching | Start with DP | O(n²) | Builds intuition |
| Production (simple) | Expand around center | O(1) | Maintainable |
| Production (performance) | Manacher's | O(n) | Maximum efficiency |

---

### Common Pitfalls by Approach

| Pitfall | Expand Center | Dynamic Programming | Manacher's |
|---------|---------------|---------------------|------------|
| Missing even centers | ❌ Common bug | N/A (handles all) | N/A (transform handles) |
| Off-by-one in slice | ❌ `s[left:right]` vs `s[left+1:right]` | Rare | Rare |
| Forgetting both cases | ❌ Check odd AND even | N/A | N/A |
| DP table fill order | N/A | ❌ Must fill by length | N/A |
| String transformation | N/A | N/A | ❌ Easy to mess up |
| Mirror calculation | N/A | N/A | ❌ `mirror = 2*center - i` |
| Boundary checks | ⚠️ Important | Less critical | Important |

---

### Complexity Deep Dive

| Approach | Why This Complexity? | Worst Case |
|----------|---------------------|------------|
| **Expand Center O(n²)** | n centers × up to n expansions | All same chars: "aaaaa" |
| **DP O(n²)** | Fill n×n table, each cell O(1) | Always O(n²) |
| **Manacher's O(n)** | Each char expanded constant times | Always O(n) with smart caching |

**Key insight**: Expand center is "amortized" O(n²). In practice, average expansion is small.

<!-- back -->
