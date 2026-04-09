## DP - Fibonacci Style: Core Concepts

What are the fundamental principles of Fibonacci-style DP?

<!-- front -->

---

### Core Concept

**State depends only on previous k states, so we can use O(1) space by keeping only the last k values.**

**Fibonacci Example:**
```
F(n) = F(n-1) + F(n-2)

Don't need array of all values:
- Just need last two
- Shift and update
```

**General Pattern:**
```
If state depends on:
- 1 previous: keep 1 variable
- 2 previous: keep 2 variables  
- k previous: keep k variables

Space: O(k) instead of O(n)
```

---

### The Pattern

```
Common transitions:
- F(n) = F(n-1) + F(n-2)  (Fibonacci)
- F(n) = F(n-1) + F(n-2) + ... + F(n-k)  (k steps)
- F(n) = max(F(n-1), F(n-2) + value)  (House robber)
```

---

### Common Applications

| Problem Type | Transition | Example |
|--------------|------------|---------|
| Fibonacci | F(n-1) + F(n-2) | LeetCode 509 |
| Climbing stairs | F(n-1) + F(n-2) | LeetCode 70 |
| House robber | max(F(n-1), F(n-2)+val) | LeetCode 198 |
| Decode ways | F(n-1) + F(n-2) | LeetCode 91 |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Single pass |
| Space | O(1) | Constant variables |
| With array | O(n) space | If need all states |

<!-- back -->
