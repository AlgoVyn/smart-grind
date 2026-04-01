## Title: KMP Framework

What is the standard framework for applying KMP string matching?

<!-- front -->

---

### Two-Phase Framework
```
PHASE 1: Preprocessing (Pattern Analysis)
  Input: pattern P of length m
  Output: prefix array π[0..m-1]
  Time: O(m)
  
  for i = 1 to m-1:
    j = π[i-1]
    while j > 0 and P[i] != P[j]:
      j = π[j-1]
    if P[i] == P[j]: j++
    π[i] = j

PHASE 2: Matching (Text Scan)
  Input: text T, pattern P, prefix π
  Output: all match positions
  Time: O(n)
  
  j = 0
  for i = 0 to n-1:
    while j > 0 and T[i] != P[j]:
      j = π[j-1]
    if T[i] == P[j]: j++
    if j == m: report match at i-m+1
               j = π[j-1]  // continue
```

---

### State Machine View
```
States: 0, 1, 2, ..., m (current match length)
Transition: on char c, move to longest prefix of P
           that matches suffix of (current_match + c)

π[j] = fallback state when mismatch at state j+1
```

### Key Properties
| Property | Value |
|----------|-------|
| Time | O(n + m) |
| Space | O(m) for prefix function |
| Comparisons | At most 2n |
| Online | Yes (stream text) |

<!-- back -->
