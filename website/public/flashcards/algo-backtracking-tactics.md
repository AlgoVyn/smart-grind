## Backtracking: Tactics & Tricks

What are the essential optimization tactics for making backtracking algorithms efficient?

<!-- front -->

---

### Tactic 1: Constraint Ordering

**Most Constrained Variable First (MCV)**

```python
def select_unassigned_variable(assignment, csp):
    """Choose variable with fewest remaining values"""
    unassigned = [v for v in csp.variables if v not in assignment]
    return min(unassigned, 
               key=lambda v: len(csp.remaining_values(v, assignment)))

# In N-Queens: try columns with fewest valid positions
# In Sudoku: try cells with fewest valid numbers
```

**Least Constraining Value**
```python
def order_values(var, assignment, csp):
    """Try values that remove fewest options for neighbors"""
    return sorted(csp.domain[var], 
                  key=lambda val: csp.count_conflicts(var, val, assignment))
```

---

### Tactic 2: Forward Checking

Prune domains early when choices are made:

```python
def backtrack_with_forward_checking(assignment, domains):
    if is_complete(assignment):
        return assignment
    
    var = select_variable(assignment, domains)
    
    for value in domains[var]:
        # Save current domains for restoration
        saved_domains = copy.deepcopy(domains)
        
        assignment[var] = value
        
        # Remove inconsistent values from neighbors
        if forward_check(var, value, domains):
            result = backtrack(assignment, domains)
            if result:
                return result
        
        del assignment[var]
        domains = saved_domains  # Restore
    
    return None
```

---

### Tactic 3: Symmetry Breaking

Eliminate equivalent solutions:

| Problem | Symmetry | Breaking Technique |
|---------|----------|-------------------|
| **N-Queens** | Column permutations | Fix first queen in column 0 |
| **Permutations** | None needed | Already unique |
| **Graph coloring** | Color permutations | Fix first node to color 0 |
| **Sudoku** | Row/col swaps | Pre-filled cells break symmetry |

```python
# N-Queens: only try column 0 for first row
# Reduces search by factor of n
```

---

### Tactic 4: Bitmask Optimization

For small n (≤20), use bit operations for speed:

```python
def n_queens_bitmask(n):
    count = 0
    
    def backtrack(cols, diagonals1, diagonals2):
        # Bitmask: 1 = occupied, 0 = available
        nonlocal count
        if cols == (1 << n) - 1:  # All columns filled
            count += 1
            return
        
        # Available positions
        available = ((1 << n) - 1) & ~(cols | diagonals1 | diagonals2)
        
        while available:
            pos = available & -available  # Lowest set bit
            available -= pos
            backtrack(cols | pos,
                     (diagonals1 | pos) << 1,
                     (diagonals2 | pos) >> 1)
    
    backtrack(0, 0, 0)
    return count

# 10-100x faster than array-based for n ≤ 16
```

---

### Tactic 5: Iterative Deepening

For finding any solution quickly:

```python
def iddfs(initial_state, max_depth=20):
    """Iterative Deepening DFS - for backtracking"""
    for depth_limit in range(1, max_depth + 1):
        result = depth_limited_search(initial_state, depth_limit)
        if result is not None:
            return result
    return None

def depth_limited_search(state, limit):
    if is_goal(state):
        return state
    if limit == 0:
        return None
    for next_state in successors(state):
        result = depth_limited_search(next_state, limit - 1)
        if result:
            return result
    return None
```

<!-- back -->
