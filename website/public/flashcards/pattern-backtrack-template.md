## Backtracking Template

**Question:** What are the 3 key components in the recursive function?

<!-- front -->

---

## Backtracking Pattern

### The 3 Key Components

1. **Base Case** - Check if solution is found or invalid
2. **Explore** - Try each valid choice
3. **Backtrack** - Undo choice before returning

### Template
```python
def backtrack(path, choices, result):
    # 1. Base Case
    if is_solution(path):
        result.append(path[:])  # Make a copy!
        return
    
    if is_invalid(path):
        return
    
    # 2. Explore
    for choice in choices:
        if is_valid(choice, path):
            # Make choice
            path.append(choice)
            
            # Recurse
            backtrack(path, next_choices, result)
            
            # 3. Backtrack (undo choice)
            path.pop()
```

### 💡 Critical Points
- Always make a **copy** of path when adding to result: `path[:]`
- Always **undo changes** before returning (backtrack)
- Prune invalid paths early for efficiency

### Common Use Cases
- Permutations/Combinations
- N-Queens
- Subset generation
- Word search

<!-- back -->
