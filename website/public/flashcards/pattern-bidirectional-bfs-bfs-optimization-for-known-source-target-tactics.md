## Graph - Bidirectional BFS: Tactics

What are the advanced techniques for bidirectional BFS?

<!-- front -->

---

### Tactic 1: Always Expand Smaller Frontier

```python
# Critical optimization: expand the smaller set
if len(frontiers[0]) > len(frontiers[1]):
    frontiers.reverse()  # Swap
    parents.reverse()    # Swap parent maps too
```

**Why**: Prevents one frontier from exploding while the other stays small. Maintains balance for optimal O(b^(d/2)) complexity.

---

### Tactic 2: Remove Visited Nodes Immediately

```python
# For word ladder - remove from wordSet when visited
if next_word in wordSet:
    wordSet.remove(next_word)  # Prevent revisiting
    next_level.add(next_word)
```

**Why**: Prevents TLE (Time Limit Exceeded) by ensuring each word is processed once.

---

### Tactic 3: Path Reconstruction

```python
def reconstruct_path(meet_node, parents_start, parents_end):
    """Build path from start to end through meeting point."""
    # Build path from start to meet_node
    path_start = []
    current = meet_node
    while current:
        path_start.append(current)
        current = parents_start[current]
    path_start.reverse()
    
    # Build path from meet_node to end
    path_end = []
    current = parents_end[meet_node]
    while current:
        path_end.append(current)
        current = parents_end[current]
    
    return path_start + path_end
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Not expanding smaller first | Uneven search, worse performance | Always check `len()` and swap |
| Forgetting start == end | Misses trivial case | Handle at beginning |
| Not removing visited | Infinite loops, TLE | Remove from set immediately |
| Wrong path reconstruction | Missing or duplicate nodes | Reverse one side correctly |
| Missing intersection check | Wrong distance count | Check when generating neighbors |

---

### Tactic 5: Neighbor Generation Pattern

```python
def get_neighbors(word):
    """Generate all one-letter variations."""
    neighbors = []
    for i in range(len(word)):
        for c in 'abcdefghijklmnopqrstuvwxyz':
            next_word = word[:i] + c + word[i+1:]
            if next_word != word:
                neighbors.append(next_word)
    return neighbors
```

**Apply to**:
- Word Ladder: One letter change
- Genetic Mutation: One base change (ACGT)
- Lock Puzzle: One dial turn

---

### Tactic 6: Multi-Threading/Parallel

```python
# Concept: Each frontier can run on separate threads
# Thread 1: Expand from source
# Thread 2: Expand from target
# Shared: Intersection detection
```

**Note**: The two searches are independent until intersection - naturally parallelizable.

<!-- back -->
