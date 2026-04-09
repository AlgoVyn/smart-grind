## Two Pointers - Expanding from Center: Comparison

When should you use expanding from center versus other palindrome approaches?

<!-- front -->

---

### Expanding from Center vs Dynamic Programming

| Aspect | Expanding Center | DP |
|--------|------------------|-----|
| **Time** | O(n²) | O(n²) |
| **Space** | O(1) | O(n²) |
| **Implementation** | Simpler | More complex |
| **Subproblems reused** | No | Yes |
| **Longest substring** | Natural | Possible |
| **Longest subsequence** | No | Natural |

**Winner**: Expanding center for substring problems (space efficient)

---

### When to Use Expanding from Center

**Use when:**
- Finding palindromic substrings (contiguous)
- Counting palindromic substrings
- O(1) space requirement
- Medium-sized strings (< 10^4)

**Don't use when:**
- Longest palindromic subsequence (non-contiguous)
- Very long strings requiring O(n) (use Manacher's)
- Need to answer many range queries (use DP)

---

### Comparison with Other String Patterns

| Pattern | Space | Time | Best For |
|---------|-------|------|----------|
| **Expanding Center** | O(1) | O(n²) | Substring palindromes |
| **Manacher's** | O(n) | O(n) | Large string palindromes |
| **DP** | O(n²) | O(n²) | Subsequence, many queries |
| **Rolling Hash** | O(n) | O(n) | Multiple pattern checks |
| **KMP/Z-Algorithm** | O(n) | O(n) | Pattern matching |

---

### Decision Tree

```
Palindrome problem?
├── Yes → Need substring or subsequence?
│   ├── Substring (contiguous)
│   │   ├── String length > 10^4? → MANACHER'S
│   │   └── Smaller string → EXPANDING CENTER
│   └── Subsequence (not contiguous)
│       └── DYNAMIC PROGRAMMING
└── No → Different pattern
```

---

### Key Trade-offs

| Consideration | Expanding Center Wins | DP Wins |
|-------------|-----------------------|---------|
| Space efficiency | ✓ | - |
| Implementation simplicity | ✓ | - |
| Multiple query answering | - | ✓ |
| Subsequence problems | - | ✓ |
| Range queries | - | ✓ |

<!-- back -->
