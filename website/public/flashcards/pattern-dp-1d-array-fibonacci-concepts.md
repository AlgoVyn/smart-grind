## DP - 1D Array Fibonacci: Core Concepts

What are the fundamental concepts behind Fibonacci-style dynamic programming?

<!-- front -->

---

### Core Principle

**Fibonacci-style DP** solves problems where each state depends only on **a fixed number of previous states** in a linear sequence.

```
State Transition Pattern:
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  dp[0]  │───→│  dp[1]  │───→│  dp[2]  │───→│  dp[3]  │───→ ...
│  (base) │    │  (base) │    │=dp[0]+  │    │=dp[1]+  │
│         │    │         │    │  dp[1]  │    │  dp[2]  │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

---

### Mathematical Structure

**Classic Fibonacci:**
```
F(n) = F(n-1) + F(n-2)

Base cases:
- F(0) = 0
- F(1) = 1

Sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21...
```

**Generalized Pattern:**
```
dp[i] = f(dp[i-1], dp[i-2], ..., dp[i-k])

Where k = number of dependencies (lookback window)
```

---

### Why Not Recursion?

**Naive Recursion (Exponential):**
```
           fib(5)
          /      \
      fib(4)    fib(3)
      /    \     /    \
   fib(3) fib(2) fib(2) fib(1)
   /  \    ...    ...
fib(2) fib(1)

Same subproblems computed multiple times!
Time: O(2^n)
```

**DP Solution (Linear):**
```
fib(0) → fib(1) → fib(2) → fib(3) → fib(4) → fib(5)
  ↓        ↓         ↓         ↓         ↓         ↓
  0        1         1         2         3         5

Each computed once, stored for reuse
Time: O(n), Space: O(1)
```

---

### Space Optimization Insight

**Key Insight:** When computing `dp[i]`, we only need the **last k values**, not the entire array.

```
For Fibonacci (k=2):
┌─────────────────────────────────────────────────────┐
│  i=2: current = prev1 + prev2 = 1 + 0 = 1          │
│       prev2, prev1 = 0, 1 → 1, 1                    │
│                                                     │
│  i=3: current = prev1 + prev2 = 1 + 1 = 2          │
│       prev2, prev1 = 1, 1 → 1, 2                    │
│                                                     │
│  i=4: current = prev1 + prev2 = 2 + 1 = 3          │
│       prev2, prev1 = 1, 2 → 2, 3                    │
└─────────────────────────────────────────────────────┘

Result: prev1 = F(n) ✓
```

---

### Problem Identification

**Signal Words:**
| Phrase | Pattern |
|--------|---------|
| "Number of ways to..." | Counting DP |
| "Maximum value at step n" | Optimization DP |
| "Cannot pick adjacent" | dp[i] = max(skip, take) |
| "Depends on previous" | Linear dependency |
| "Build up to n" | Iterative DP |

**Characteristics:**
1. Linear progression (step 0 → step 1 → step 2...)
2. Fixed dependency window (k previous states)
3. Overlapping subproblems
4. Optimal substructure

---

### Time & Space Complexity

| Approach | Time | Space | Use Case |
|----------|------|-------|----------|
| Naive Recursion | O(2^n) | O(n) stack | Never use |
| Memoization (top-down) | O(n) | O(n) | When natural to think recursively |
| Tabulation (bottom-up) | O(n) | O(n) | Standard approach |
| Space Optimized | O(n) | O(1) | **Preferred** - when only final value needed |
| Matrix Exponentiation | O(log n) | O(1) | Very large n (Fibonacci only) |

---

### Related Mathematical Concepts

**Binet's Formula (Closed Form):**
```
F(n) = (φ^n - ψ^n) / √5

Where:
- φ = (1 + √5) / 2 ≈ 1.618 (golden ratio)
- ψ = (1 - √5) / 2 ≈ -0.618
```

Limitation: Floating point precision for large n.

<!-- back -->
