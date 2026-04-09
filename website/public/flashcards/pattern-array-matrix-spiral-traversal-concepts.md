## Array/Matrix - Spiral Traversal: Core Concepts

What are the fundamental principles of spiral matrix traversal?

<!-- front -->

---

### Core Concept

**Use four boundaries (top, bottom, left, right) that shrink inward as you traverse each layer of the matrix.**

The key insight: Process the outer layer first, then shrink the boundaries and process the next inner layer.

**Visual boundary shrinkage:**
```
Initial:          After 1st iteration:
┌──────────┐      ·──────────·
│ ░░░░░░░░ │      · ░░░░░░ ·
│ ░      ░ │  →   · ░    ░ ·
│ ░      ░ │      · ░░░░░░ ·
│ ░░░░░░░░ │      ·──────────·
└──────────┘      

Top ↓    Bottom ↑    Left →    Right ←
```

---

### The Pattern

```
Direction order: Right → Down → Left → Up

For each direction:
1. Traverse current boundary
2. Shrink the corresponding boundary
3. Check if still valid before next direction

Example 3x3:
[1, 2, 3]    →  →  →
[8, 9, 4]    ↑  ●  ↓
[7, 6, 5]    ←  ←  ↓
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Spiral order | List elements | LeetCode 54 |
| Generate spiral | Create matrix | LeetCode 59 |
| Layer processing | Process by rings | Image manipulation |
| Boundary traversal | Edge-first processing | Game board analysis |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(m × n) | Each element visited once |
| Space | O(1) | Excluding output array |
| Works on | Any m × n | Square or rectangular |

---

### Why Check Boundaries?

```
For rectangular matrices or final layer:
After top++ and right--, we might have:
- top > bottom (no rows left for left traverse)
- left > right (no columns left for up traverse)

Example (single row): [1, 2, 3]
After traversing right: top = 1, bottom = 0
Now top > bottom, skip left and up traversals!

Always check: if top <= bottom, if left <= right
```

<!-- back -->
