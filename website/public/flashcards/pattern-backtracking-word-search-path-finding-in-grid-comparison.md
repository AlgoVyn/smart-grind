## Backtracking - Word Search Path Finding in Grid: Comparison

When should you use in-place marking vs separate visited set?

<!-- front -->

---

### In-place Grid Marking vs Separate Visited Set

| Aspect | In-place Marking | Separate Visited Set |
|--------|------------------|---------------------|
| **Space** | O(1) extra | O(L) for visited set |
| **Time** | Same O(m × n × 4^L) | Same O(m × n × 4^L) |
| **Grid Modification** | Modifies original | Preserves original |
| **Restore Complexity** | Simple (save/restore char) | Set add/remove operations |
| **Thread Safety** | Not thread-safe | Thread-safe |
| **Parallel DFS** | Harder (need copy) | Easier (pass set) |
| **Use Case** | Single-threaded, disposable grid | Grid must remain unchanged |

**Winner:** In-place for general use, Visited Set when grid preservation is required

---

### When to Use Each Approach

**In-place Grid Marking:**
- Standard interview setting
- Grid can be modified
- Memory constrained environment
- Need clean, simple code
- No requirement to preserve grid state

**Separate Visited Set:**
- Grid must remain unchanged (multiple searches)
- Need to visualize/debug grid during search
- Threading/concurrency concerns
- Grid is shared data structure
- Multiple DFS paths running in parallel

---

### Approach Comparison with Code

```python
# IN-PLACE: Modify board directly
def exist_inplace(board, word):
    temp = board[r][c]      # Save
    board[r][c] = '#'       # Mark
    # ... explore ...
    board[r][c] = temp      # Restore

# VISITED SET: Separate tracking
def exist_visited_set(board, word):
    visited.add((r, c))     # Mark
    # ... explore ...
    visited.remove((r, c))  # Unmark
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| **Interview/Standard** | In-place | Cleaner code, less overhead |
| **Grid Persistence** | Visited Set | Original grid unchanged |
| **Memory Critical** | In-place | No extra data structures |
| **Concurrent Access** | Visited Set | No shared state mutation |
| **Multiple Searches** | Visited Set | Reuse same grid |
| **Parallel DFS** | Visited Set | Each thread has own set |
| **Debugging** | Visited Set | Can inspect grid anytime |

---

### Complexity Comparison

```
┌────────────────────────────────────────────────────────────┐
│  COMPLEXITY BREAKDOWN                                       │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  IN-PLACE MARKING                                           │
│  ├── Space: O(L) recursion stack only                        │
│  ├── Time: O(m × n × 4^L)                                   │
│  └── Restore: O(1) per cell (char assignment)               │
│                                                              │
│  VISITED SET                                                │
│  ├── Space: O(L) recursion + O(L) hash set                │
│  ├── Time: O(m × n × 4^L)                                   │
│  └── Restore: O(1) avg (hash set add/remove)               │
│                                                              │
│  BITMASK (small grids)                                      │
│  ├── Space: O(L) recursion + O(1) integer                  │
│  ├── Time: O(m × n × 4^L)                                   │
│  └── Restore: O(1) (integer copy)                          │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

---

### Decision Tree

```
                    Need to preserve grid?
                           │
            ┌──────────────┴──────────────┐
           YES                            NO
            │                               │
    Use VISITED SET               Memory constrained?
            │                               │
                            ┌──────────────┴──────────────┐
                           YES                            NO
                            │                               │
                    Grid small (≤64 cells)?          Use IN-PLACE
                            │
                ┌───────────┴───────────┐
               YES                       NO
                │                       │
        Use BITMASK              Use IN-PLACE
```

<!-- back -->
