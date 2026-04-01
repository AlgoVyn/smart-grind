## Combination Sum: Tactics & Tricks

What are the essential tactics for solving combination sum problems efficiently?

<!-- front -->

---

### Tactic 1: Sort and Prune

```python
def backtrack_optimized(start, target, path):
    # Sort candidates first
    candidates.sort()
    
    for i in range(start, len(candidates)):
        num = candidates[i]
        
        # Early termination: rest are larger
        if num > target:
            break  # Not continue!
        
        path.append(num)
        backtrack(i, target - num, path)  # or i+1 for once-only
        path.pop()
```

**Why:** Sorting enables early termination and duplicate detection.

---

### Tactic 2: Handle Duplicates in Input

```python
def backtrack_with_duplicates(start, target, path):
    for i in range(start, len(candidates)):
        # Skip duplicates at same recursion level
        if i > start and candidates[i] == candidates[i-1]:
            continue
        
        if candidates[i] > target:
            break
        
        path.append(candidates[i])
        backtrack(i + 1, target - candidates[i], path)
        path.pop()
```

**Key:** `i > start` ensures we only skip duplicates at the same tree level, not across different branches.

---

### Tactic 3: DP vs Backtracking Decision

```python
def choose_approach(nums, target, need_all_solutions):
    if need_all_solutions:
        # Must use backtracking to enumerate
        return backtrack_all_solutions(nums, target)
    else:
        # Can use DP for count or boolean
        return dp_count(nums, target)
```

| Requirement | Use |
|-------------|-----|
| All combinations | Backtracking |
| Count only | DP |
| Minimum elements | DP with path tracking |
| Existence only | DP (boolean) |

---

### Tactic 4: State Space Pruning

```python
def pruned_backtrack(start, target, path, current_sum):
    # Pruning 1: sum already exceeded
    if current_sum > target:
        return
    
    # Pruning 2: even using all remaining smallest can't reach
    min_remaining = candidates[start] if start < len(candidates) else 0
    if current_sum + min_remaining > target:
        return
    
    # Pruning 3: using all current can't exceed target
    max_possible = current_sum + sum(candidates[start:])
    if max_possible < target:
        return
    
    # ... rest of backtracking
```

---

### Tactic 5: Iterative BFS for Shortest

```python
from collections import deque

def shortest_combination_sum(candidates, target):
    """BFS finds shortest combination (fewest elements)"""
    queue = deque([(0, [])])  # (current_sum, path)
    visited = {0}
    
    while queue:
        cur_sum, path = queue.popleft()
        
        for num in candidates:
            new_sum = cur_sum + num
            if new_sum == target:
                return path + [num]
            if new_sum < target and new_sum not in visited:
                visited.add(new_sum)
                queue.append((new_sum, path + [num]))
    
    return None
```

**Use BFS when:** You need the shortest (fewest elements) combination.

<!-- back -->
