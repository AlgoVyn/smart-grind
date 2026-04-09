## String - Repeated Substring Pattern Detection: Framework

What is the complete code template for detecting repeated substring patterns?

<!-- front -->

---

### Framework: Pattern Detection Decision Tree

```
┌─────────────────────────────────────────────────────────────────────┐
│  REPEATED SUBSTRING PATTERN DETECTION - TEMPLATE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Key Question: Can string s be formed by repeating a substring?       │
│                                                                      │
│  THREE APPROACHES:                                                   │
│                                                                      │
│  1. CONCATENATION TRICK (Most Elegant)                              │
│     - Check: s in (s + s)[1:-1]                                      │
│     - Time: O(n), Space: O(n)                                        │
│     - Best for: Quick interviews, elegant solutions                  │
│                                                                      │
│  2. KMP FAILURE FUNCTION (Optimal & Educational)                      │
│     - Compute prefix function array                                  │
│     - Check: lps > 0 and n % (n - lps) == 0                        │
│     - Time: O(n), Space: O(n)                                        │
│     - Best for: Understanding periodicity, finding smallest unit     │
│                                                                      │
│  3. BRUTE FORCE (Simple but Slow)                                    │
│     - Try all divisors of n from 1 to n/2                           │
│     - Check: substring * (n/i) == s                                 │
│     - Time: O(n²), Space: O(n)                                       │
│     - Best for: Small strings, learning the concept                  │
│                                                                      │
│  Edge Case: len(s) <= 1 → Always False (no pattern possible)         │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Implementation Templates

```python
# CONCATENATION TRICK - Most Elegant
def repeated_substring_pattern(s: str) -> bool:
    """
    Check if string has repeated substring pattern.
    Time: O(n), Space: O(n)
    """
    if len(s) <= 1:
        return False
    
    # Key insight: s must appear in (s+s)[1:-1] if it has repeated pattern
    return s in (s + s)[1:-1]

# KMP FAILURE FUNCTION - Optimal & Educational
def repeated_substring_pattern_kmp(s: str) -> bool:
    """
    Check repeated pattern using KMP failure function.
    Time: O(n), Space: O(n)
    """
    n = len(s)
    if n <= 1:
        return False
    
    # Compute prefix function (failure function)
    prefix = [0] * n
    for i in range(1, n):
        j = prefix[i - 1]
        while j > 0 and s[i] != s[j]:
            j = prefix[j - 1]
        if s[i] == s[j]:
            j += 1
        prefix[i] = j
    
    # Check if repeated pattern exists
    lps = prefix[-1]  # longest proper prefix which is also suffix
    return lps > 0 and n % (n - lps) == 0

# BRUTE FORCE - Simple but O(n²)
def repeated_substring_pattern_brute(s: str) -> bool:
    """
    Check repeated pattern using brute force.
    Time: O(n²), Space: O(n)
    """
    n = len(s)
    
    for i in range(1, n // 2 + 1):
        if n % i == 0:  # i must divide n evenly
            substring = s[:i]
            if substring * (n // i) == s:
                return True
    
    return False
```

---

### Key Framework Elements

| Element | Purpose | Condition |
|---------|---------|-----------|
| `len(s) <= 1` | Edge case check | Always False - single char can't repeat |
| Concatenation check | Elegant one-liner | `s in (s + s)[1:-1]` |
| KMP prefix function | Reveals periodicity | `prefix[i]` = length of longest proper prefix-suffix for `s[0:i+1]` |
| Length divisibility | Pattern length must divide n | `n % (n - lps) == 0` |
| Pattern length | From KMP: `n - lps` | Smallest repeating unit length |

---

### When to Apply This Pattern

| Scenario | Example |
|----------|---------|
| Pattern validation | Checking if data follows repeating structure |
| Compression detection | Identifying compressible repeating sequences |
| DNA/protein analysis | Detecting repeating genetic patterns |
| Data validation | Verifying formatted data patterns |
| String periodicity | Finding cycles in sequences |
| Interview problems | LeetCode 459: Repeated Substring Pattern |

---

### Framework Selection Guide

```
Problem Requirements → Approach Selection

Need smallest repeating unit?
  ├─ Yes → KMP Failure Function (gives pattern length = n - lps)
  └─ No → Just need boolean?
      ├─ Interview setting → Concatenation trick (most elegant)
      └─ Learning/understanding → KMP (educational value)

String length constraints?
  ├─ n < 1000 → Any approach works
  └─ n > 10⁵ → Avoid brute force, use concatenation or KMP

Multiple languages needed?
  ├─ All languages support concatenation trick
  └─ KMP needs careful implementation in typed languages
```

<!-- back -->
