## Title: Word Search Grid - Core Concepts

What is the Word Search Grid problem and when should DFS/Backtracking be applied?

<!-- front -->

---

### Problem Definition

**Word Search:** Given 2D grid of characters and a word, determine if the word exists in the grid by searching adjacent cells (horizontally/vertically neighboring, not diagonally). Cannot reuse the same cell.

| Variation | Constraint |
|-----------|------------|
| **Standard** | 4-directional, no reuse |
| **With diagonal** | 8-directional |
| **Multiple words** | Find all words from dictionary |
| **Snake** | Can turn but not cross |

---

### Key Characteristics

| Property | Description |
|----------|-------------|
| **State space** | O(m×n×4^L) where L = word length |
| **Pruning** | Early termination on mismatch |
| **Visited tracking** | Mark cells during DFS |
| **Backtracking** | Unmark after exploring branch |
| **Optimization** | Check word[0] frequency, board pruning |

---

### DFS State Definition

```
State: (row, col, index) - current position and character to match

Transition:
  From (r, c, i), try all 4 directions (dr, dc):
    nr = r + dr, nc = c + dc
    If in bounds and not visited and board[nr][nc] == word[i]:
      Mark visited, recurse with (nr, nc, i+1)
      Unmark visited

Base cases:
  i == len(word): return True (all matched)
  No valid neighbor: return False (dead end)
```

---

### Complexity Analysis

| Case | Time | Space |
|------|------|-------|
| **Worst case** | O(m×n×4^L) | O(L) recursion |
| **With pruning** | Much better in practice | O(L) |
| **Trie optimization** | O(m×n×4^max_word_len) | O(T) for Trie |

**Where m,n = grid dimensions, L = word length, T = total chars in all words**

---

### Classic Applications

| Problem | Grid Search Use |
|---------|-----------------|
| **Word Search I/II** | Find if word exists / all words |
| **Crossword validation** | Check word placement |
| **Boggle** | Find all valid words |
| **Snake game** | Path finding with constraints |
| **Maze with word** | Navigate and spell |

---

### Key Implementation Details

```python
# Directions: Up, Down, Left, Right
directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

# In-place visited marking (space efficient)
board[r][c] = '#'  # Mark as visited
# ... recurse ...
board[r][c] = word[i]  # Restore

# Pre-check: word[0] should exist enough times
from collections import Counter
board_count = Counter(''.join(board))
word_count = Counter(word)
if any(word_count[c] > board_count[c] for c in word_count):
    return False
```

<!-- back -->
