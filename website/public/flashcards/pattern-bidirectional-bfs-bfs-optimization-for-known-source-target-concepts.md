## Graph - Bidirectional BFS: Core Concepts

What are the fundamental principles of bidirectional BFS?

<!-- front -->

---

### Core Concept

**Meeting in the Middle**: Two searches expanding from opposite ends will intersect much faster than one search traversing the entire path.

**Key insight**: Searching from both directions simultaneously reduces the search space from O(b^d) to O(b^(d/2)), an exponential improvement.

---

### The "Aha!" Moments

```
Standard BFS: O(b^d)
                S
               /|\
              / | \
             /  |  \
            /   |   \
           T----+----T

Bidirectional: O(b^(d/2)) + O(b^(d/2)) = O(b^(d/2))
                S
               /|\
              / | \
             /  X  \    <- Meet at X
            /   |   \
           T----+----T
```

1. **Two waves expand**: Source wave → ← Target wave
2. **Meet at middle**: Intersection found much faster
3. **Always expand smaller**: Balances the search
4. **Early termination**: Stop immediately at intersection

---

### When to Use

| Scenario | Use Bidirectional? | Example |
|----------|-------------------|---------|
| Known source AND target | **Yes** | Word Ladder |
| Shortest path needed | **Yes** | Minimum Genetic Mutation |
| Unweighted graph | **Yes** | Open the Lock |
| Only source known | No | Social network degrees |
| Path existence only | No | Use DFS |

---

### Complexity Comparison

| Approach | Time | Space | Search Space |
|----------|------|-------|--------------|
| **Bidirectional BFS** | O(b^(d/2)) | O(b^(d/2)) | Much smaller |
| **Standard BFS** | O(b^d) | O(b^d) | Full tree |
| **Improvement** | Exponential | Exponential | b^(d/2) vs b^d |

Where:
- **b** = branching factor (neighbors per node)
- **d** = shortest path distance

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| Word Transformation | Change one letter at a time | hit → cog |
| Genetic Mutation | DNA/mutation sequences | AAAA → CCCC |
| Lock Puzzle | Dial/lock puzzles | 0000 → 1234 |
| Game State | Chess/puzzle solving | Start → Goal |
| String Edit | Transformation sequences | Edit operations |

<!-- back -->
