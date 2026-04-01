## Backtracking: Algorithm Framework

What is the standard backtracking template, and how do you implement pruning efficiently?

<!-- front -->

---

### Core Template

```python
def backtrack(state, choices, result):
    """
    state: current partial solution
    choices: available options for next decision
    result: accumulator for solutions
    """
    if is_complete(state):
        result.append(state.copy())
        return
    
    for choice in choices:
        if is_valid(state, choice):
            # Make choice
            state.append(choice)
            
            # Recurse with updated state
            new_choices = get_choices(state, choices, choice)
            backtrack(state, new_choices, result)
            
            # Undo choice (backtrack)
            state.pop()
```

---

### State Management Pattern

| Operation | Purpose | Implementation |
|-----------|---------|----------------|
| **Choose** | Add to current state | `state.append(choice)` |
| **Explore** | Recurse on extended state | `backtrack(state, ...)` |
| **Unchoose** | Remove to restore state | `state.pop()` |

**Critical:** State must be restored exactly before returning

---

### Pruning Strategies

```python
def backtrack_with_pruning(state, choices, result):
    if not is_promising(state):  # ⬅️ Early termination
        return  # Prune this branch
    
    if is_complete(state):
        result.append(state.copy())
        return
    
    for choice in choices:
        if is_valid(state, choice):
            state.append(choice)
            backtrack(state, remaining_choices(), result)
            state.pop()

def is_promising(state):
    # Return False if current partial solution
    # can never lead to valid complete solution
    pass
```

---

### Iterative Implementation

```python
def backtrack_iterative(initial_state, choices):
    stack = [(initial_state, choices, 0)]  # (state, choices, next_idx)
    result = []
    
    while stack:
        state, choices, idx = stack[-1]
        
        if is_complete(state):
            result.append(state.copy())
            stack.pop()
            continue
        
        if idx >= len(choices):
            stack.pop()  # Backtrack
            continue
        
        choice = choices[idx]
        stack[-1] = (state, choices, idx + 1)  # Update index
        
        if is_valid(state, choice):
            state.append(choice)
            new_choices = get_remaining(choices, choice)
            stack.append((state, new_choices, 0))
    
    return result
```

---

### Common State Representations

| Problem | State Structure | Choices |
|---------|-----------------|---------|
| **N-Queens** | `board[row] = col` | Available columns |
| **Permutations** | `used[]` boolean array | Unused elements |
| **Subsets** | Current subset | Elements from index onward |
| **Sudoku** | Grid with 0 for empty | 1-9 for empty cells |
| **Graph coloring** | `color[node]` | Valid colors for node |

<!-- back -->
