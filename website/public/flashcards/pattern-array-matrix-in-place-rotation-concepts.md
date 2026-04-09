## Array/Matrix - In-place Rotation: Core Concepts

What are the fundamental principles of in-place matrix rotation?

<!-- front -->

---

### Core Concept

**Any 90-degree matrix rotation can be decomposed into two simple operations: transpose + reverse**

The key insight: Instead of rotating element by element (complex coordinate math), break it into two simpler operations that are easy to implement.

**Visual breakdown:**
```
Original    Transpose    Reverse Rows    Result
[1 2 3]     [1 4 7]      [7 4 1]       [7 4 1]
[4 5 6]  →  [2 5 8]  →   [8 5 2]   =   [8 5 2]
[7 8 9]     [3 6 9]      [9 6 3]       [9 6 3]
                       
90° clockwise rotation achieved!
```

---

### The Pattern

```
For 90° clockwise:
1. Transpose: matrix[i][j] ↔ matrix[j][i]
   - First row becomes first column
   
2. Reverse each row:
   - First column moves to right side
```

---

### Common Applications

| Problem Type | Rotation | Example |
|--------------|----------|---------|
| Image rotation | 90° CW/CCW | Rotate Image (LeetCode 48) |
| Pattern matching | 180° | Compare rotated patterns |
| Game boards | 90°/270° | Tetris, puzzle games |
| Matrix transformation | Any | Mathematical operations |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n²) | Visit each element once |
| Space | O(1) | In-place, only swaps |
| Works on | Square matrices | n × n only |

---

### Alternative: Layer-by-Layer Rotation

For understanding, you can also rotate by layers (like an onion):
```
Rotate outer layer elements in groups of 4:
top → right → bottom → left → top

Then move to inner layers
```
This uses the same O(1) space but transpose+reverse is cleaner to implement.

<!-- back -->
