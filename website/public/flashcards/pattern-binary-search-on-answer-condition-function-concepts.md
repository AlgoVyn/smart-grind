## Binary Search on Answer: Core Concepts

What are the fundamental principles of binary search on answer with condition function?

<!-- front -->

---

### Core Concept: Monotonicity

The **monotonicity property** is the key insight:

```
Minimization: If X is feasible, then all Y >= X are also feasible
              [False, False, ..., False, True, True, True, ...]
                                    ^
                                    boundary

Maximization: If X is feasible, then all Y <= X are also feasible
              [True, True, True, ..., True, False, False, ...]
                                  ^
                                  boundary
```

**Key insight**: There exists a clear boundary between feasible and infeasible values.

---

### The Pattern Explained

```
Problem: Find minimum ship capacity to deliver packages within D days.

Packages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], D = 5

Can we ship with capacity = 10?
  Day 1: 1+2+3+4 = 10
  Day 2: 5
  Day 3: 6
  Day 4: 7
  Day 5: 8+9+10 = 27 > 10  → FALSE (not feasible)

Can we ship with capacity = 15?
  Day 1: 1+2+3+4+5 = 15
  Day 2: 6+7+8 = 21 > 15? No, 6+7 = 13
  Day 3: 8+9 = 17 > 15? No, 8
  ... need more days → FALSE (not feasible)

Can we ship with capacity = 55?
  Day 1: 1+2+3+4+5+6+7+8+9+10 = 55
  Days 2-5: empty → TRUE (feasible)

Binary search finds the smallest feasible capacity.
```

---

### Condition Function Design

The condition function encapsulates the problem constraints:

```python
def condition(mid):
    """
    Returns True if 'mid' is a feasible answer.
    Must be O(n) or better for efficiency.
    """
    # Track some state (count, sum, etc.)
    # Iterate through input
    # Check if constraints are satisfied
    return is_feasible
```

**Common Condition Patterns:**

| Problem Type | Condition Logic | Check |
|--------------|-----------------|-------|
| Capacity/Days | Count days needed for capacity C | `days <= D` |
| Eating Speed | Hours needed at speed K | `hours <= H` |
| Split Array | Number of subarrays with max sum <= mid | `count <= m` |
| Aggressive Cows | Can place C cows with min distance D? | Boolean |

---

### Complexity Analysis

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(log(S) × check_time) | S = search space range |
| Space | O(1) | Iterative binary search |
| Check Time | Usually O(n) | Linear scan through input |
| Example | O(n log(sum)) | Split Array Largest Sum |

**Recurrence:**
```
T(n) = T(n/2) + O(n)  →  O(n log S) by Master Theorem
```

---

### "Aha!" Moments

1. **Monotonicity is key**: If condition(X) holds, it holds for all larger (or smaller) values
2. **Boundary exists**: There's a clear split point between feasible/infeasible
3. **Condition function**: Encapsulate the feasibility check separately
4. **Search space bounds**: `low` = max element, `high` = sum for subarray problems
5. **Min vs Max**: Use different midpoint calculations to avoid infinite loops

<!-- back -->
