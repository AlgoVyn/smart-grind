## Bitwise DP - Counting Bits Optimization: Comparison

When should you use different approaches for counting bits?

<!-- front -->

---

### DP Recurrence Comparison

| Approach | Formula | Intuition | Cache Friendliness |
|----------|---------|-----------|-------------------|
| **LSB-based (i >> 1)** | `dp[i] = dp[i >> 1] + (i & 1)` | Remove LSB | ✅ Sequential access |
| **Brian Kernighan's** | `dp[i] = dp[i & (i-1)] + 1` | Clear lowest 1 | Random access |
| **Lowest Set Bit** | `dp[i] = dp[i - (i & -i)] + 1` | Subtract lowest power | Random access |
| **MSB-based** | `dp[i] = dp[i - msb] + 1` | Remove highest power | ✅ Sequential-ish |

**Winner:** LSB-based (i >> 1) - Simplest and most cache-friendly.

---

### DP vs Built-in Functions

| Aspect | DP Solution | Built-in (bit_count) |
|--------|-------------|---------------------|
| **Time** | O(n) | O(n) |
| **Space** | O(n) | O(n) for result |
| **Code length** | 4-5 lines | 1 line |
| **Interview value** | ✅ Shows understanding | Shows language knowledge |
| **Real-world use** | Educational | Production |
| **Portability** | All languages | Language-specific |
| **Flexibility** | ✅ Can modify recurrence | Black box |

**Interview recommendation:** Write DP solution, mention built-in as alternative.

---

### Single Number vs Range Counting

| Scenario | Approach | Time | Space |
|----------|----------|------|-------|
| **Single number** | Brian Kernighan's | O(k), k = set bits | O(1) |
| **Single number** | Built-in | O(1) hardware | O(1) |
| **Range 0..n** | DP (any variant) | O(n) | O(n) |
| **Multiple queries** | Precompute DP once | O(n) once | O(n) |
| **Very large n** | Mathematical | O(log n) | O(1) |

**Decision rule:**
```
One number? → Use built-in or Kernighan's
Range 0..n? → Use DP
Multiple ranges? → Precompute max needed once
```

---

### Language-Specific Built-in Comparison

| Language | Function | Notes |
|----------|----------|-------|
| **Python** | `int.bit_count()` | Python 3.10+, POPCNT instruction |
| **C/C++** | `__builtin_popcount()` | GCC/Clang intrinsic |
| **C/C++** | `__builtin_popcountll()` | 64-bit version |
| **Java** | `Integer.bitCount()` | Standard library |
| **Java** | `Long.bitCount()` | 64-bit version |
| **JavaScript** | No native | Use `toString(2).split('1').length - 1` |

**Performance:** Built-ins use hardware POPCNT when available - fastest for single numbers.

---

### Iterative DP vs Memoization Recursion

| Aspect | Iterative DP (Bottom-Up) | Memoization (Top-Down) |
|--------|--------------------------|------------------------|
| **Stack space** | O(1) | O(n) recursion |
| **Overhead** | None | Function call overhead |
| **Natural fit** | ✅ Yes (linear sequence) | Overkill |
| **State pruning** | Computes all | Can skip some |
| **Code clarity** | Simple loop | Unnecessary complexity |

**Verdict:** Always use iterative for this pattern.

---

### Space Optimized vs Full Array

| Aspect | Full Array | Space Optimized |
|--------|------------|-----------------|
| **Space** | O(n) | Not applicable |
| **Need all values?** | ✅ Yes | Not possible |
| **Return type** | List | Can't return single number's count |
| **Debugging** | ✅ Can inspect all | Limited |

**Note:** Space optimization to O(1) is NOT possible here - the output itself requires O(n) space.

---

### When Each Approach Shines

```
Problem requirement?
├── Single number popcount
│   ├── Interview context → Write Brian Kernighan's
│   └── Production code → Use built-in
│
├── Range 0..n (LeetCode 338)
│   ├── Interview → DP with i >> 1 (shows understanding)
│   └── Quick solution → Built-in list comprehension
│
├── Very frequent queries
│   └── Lookup table with 8-bit chunks
│
└── Sum of Hamming weights
    ├── Small n → Accumulate during DP
    └── Large n → Mathematical formula
```

---

### Performance Comparison Table

| Method | Time | Space | Best For |
|--------|------|-------|----------|
| DP (i >> 1) | O(n) | O(n) | ✅ General case - Recommended |
| DP (i & i-1) | O(n) | O(n) | Brian Kernighan fans |
| DP (MSB) | O(n) | O(n) | Learning binary structure |
| Built-in | O(n) | O(n) | Production, golf code |
| Lookup table | O(n) | O(256) + O(n) | Frequent queries |
| Math formula | O(log n) | O(1) | Very large n, sum only |

<!-- back -->
