## String - Repeated Substring Pattern Detection: Comparison

How do different approaches compare for detecting repeated substring patterns?

<!-- front -->

---

### Approach Comparison Table

| Approach | Time | Space | Pros | Cons | Best For |
|----------|------|-------|------|------|----------|
| **Concatenation Trick** | O(n) | O(n) | Elegant, concise, 1 line | Creates 2n string | Interviews, quick solutions |
| **KMP Failure Function** | O(n) | O(n) | Educational, finds smallest unit | More code to write | Understanding, extra info needed |
| **Brute Force (Divisors)** | O(n²) | O(n) | Simple, intuitive | Slow for large n | Small strings, learning |
| **Brute Force (O(1) space)** | O(n²) | O(1) | No extra allocation | Many comparisons | Memory-constrained environments |
| **Rolling Hash** | O(n) | O(n) | Fast comparisons | Collision risk, complex | Advanced implementations |

---

### When to Use Which Approach

```
String Length & Requirements → Approach Selection

n < 100 (small strings):
  ├─ Learning → Brute Force (easy to understand)
  └─ Quick check → Concatenation trick

n = 100 to 10,000 (medium):
  ├─ Interview → Concatenation trick (most elegant)
  └─ Need pattern info → KMP (gives smallest unit)

n > 10,000 (large strings):
  ├─ Standard → Concatenation trick
  ├─ Memory constrained → O(1) space brute force
  └─ Pattern analysis → KMP

Need additional information?
  ├─ Just boolean → Concatenation
  ├─ Smallest unit length → KMP
  ├─ Number of repetitions → KMP
  └─ All valid patterns → Brute force with divisors
```

---

### Code Comparison: Concatenation vs KMP vs Brute Force

```python
# CONCATENATION TRICK: Most elegant
# Time: O(n), Space: O(n)
def repeated_pattern_concat(s: str) -> bool:
    return len(s) > 1 and s in (s + s)[1:-1]

# KMP FAILURE FUNCTION: Most informative
# Time: O(n), Space: O(n)
def repeated_pattern_kmp(s: str) -> bool:
    n = len(s)
    if n <= 1:
        return False
    
    prefix = [0] * n
    for i in range(1, n):
        j = prefix[i - 1]
        while j > 0 and s[i] != s[j]:
            j = prefix[j - 1]
        if s[i] == s[j]:
            j += 1
        prefix[i] = j
    
    lps = prefix[-1]
    return lps > 0 and n % (n - lps) == 0

# BRUTE FORCE: Most intuitive
# Time: O(n²), Space: O(n)
def repeated_pattern_brute(s: str) -> bool:
    n = len(s)
    for i in range(1, n // 2 + 1):
        if n % i == 0:
            if s[:i] * (n // i) == s:
                return True
    return False
```

---

### Correctness Proof: Why Concatenation Works

```
Theorem: String s has a repeated substring pattern iff s appears in (s+s)[1:-1].

Proof (⇒): If s has repeated pattern, then s appears in (s+s)[1:-1]
  1. Assume s = t * k for some substring t and k ≥ 2
  2. Then s + s = t * 2k (t repeated 2k times)
  3. (s + s)[1:-1] removes first char of first t and last char of last t
  4. The remaining string contains: suffix of first t + t * (2k-2) + prefix of last t
  5. Since 2k-2 ≥ 2 (because k ≥ 2), there's at least 2 complete t's in middle
  6. Therefore s = t * k appears starting at position len(t) - 1

Proof (⇐): If s appears in (s+s)[1:-1], then s has repeated pattern
  1. If s appears in (s+s)[1:-1], it starts at some position p where 1 ≤ p ≤ len(s)-1
  2. This means s[0:n] = (s+s)[p:p+n] where n = len(s)
  3. For this to hold, s must align with itself offset by p
  4. Therefore s[i] = s[i+p] for all valid i
  5. This periodicity implies s is composed of repeats of s[0:p]
  6. Since p < n, s[0:p] is a proper substring that repeats to form s

Therefore, the condition is both necessary and sufficient.
```

---

### Performance Benchmarks (Theoretical)

```
Input: s = "abc" * 10000 (30000 characters)

Concatenation Trick:
  - Create s+s: O(n) to allocate 60000 chars
  - Slice [1:-1]: O(1) in Python (view)
  - in operator: O(n) optimized C implementation
  - Total: ~2n operations, fast in practice

KMP:
  - Build prefix array: O(n) single pass
  - Array access: O(1)
  - No string creation
  - Total: ~n operations, consistent performance

Brute Force:
  - Try n/2 = 15000 divisors
  - Each check builds string of 30000 chars: O(n)
  - Total: O(n²) = ~450 million operations
  - Significantly slower!

Winner: Concatenation or KMP (both O(n))
Loser: Brute Force for large n
```

---

### Language-Specific Considerations

| Language | Concatenation | KMP | Notes |
|----------|---------------|-----|-------|
| **Python** | `s in (s+s)[1:-1]` | List for prefix | Concatenation is most Pythonic |
| **Java** | `ss.substring(1, 2*n-1).contains(s)` | `int[] prefix` | `contains()` uses optimized search |
| **C++** | `ss.substr(1, 2*n-2).find(s)` | `vector<int>` | `find()` may use efficient algorithms |
| **JavaScript** | `(s+s).slice(1, -1).includes(s)` | `Array` | Modern engines optimize `includes()` |

---

### Comparison: Information vs Simplicity

```python
# CONCATENATION: Just the answer
has_pattern = s in (s + s)[1:-1]  # True/False only

# KMP: Answer + details
prefix = compute_prefix(s)
lps = prefix[-1]
if lps > 0 and n % (n - lps) == 0:
    has_pattern = True
    smallest_unit = s[:n - lps]      # Extra info!
    num_repeats = n // (n - lps)     # Extra info!
else:
    has_pattern = False

# Trade-off: ~10 lines vs 1 line, but more information
```

---

### Decision Matrix

| Requirement | Best Approach | Why |
|-------------|---------------|-----|
| Interview coding | Concatenation | 1 line, memorable |
| Need smallest unit | KMP | Directly gives pattern length |
| Memory constraint | O(1) brute | No allocation |
| Teaching/learning | KMP → Concatenation | Build intuition |
| Production code | Either O(n) | Both reliable |
| Very large strings | KMP | More predictable |

<!-- back -->
