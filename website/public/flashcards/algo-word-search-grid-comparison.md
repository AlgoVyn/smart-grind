## Title: Word Search Grid - Comparison Guide

How does Word Search DFS compare to other pathfinding algorithms?

<!-- front -->

---

### Pathfinding Algorithm Comparison

| Algorithm | Completeness | Optimality | Time | Space | Use Case |
|-----------|--------------|------------|------|-------|----------|
| **DFS** | Complete | No | O(b^d) | O(d) | Find any path |
| **BFS** | Complete | Yes (shortest) | O(b^d) | O(b^d) | Shortest path |
| **IDDFS** | Complete | No | O(b^d) | O(d) | Memory constrained |
| **A*** | Complete | Yes* | O(b^d) | O(b^d) | Heuristic available |
| **Backtracking** | Complete | No | O(b^d) | O(d) | Constraint satisfaction |

**b = branching factor (4 for grid), d = depth (word length)**

---

### Word Search vs Maze Solving

| Aspect | Word Search | Maze Solving |
|--------|-------------|--------------|
| **Goal** | Match sequence of chars | Reach destination |
| **Constraint** | Fixed path (word) | Any path that reaches end |
| **Visited** | Can revisit after backtrack | Permanent (no cycles) |
| **Heuristic** | Character matching | Distance to goal |
| **Branching** | 4 (grid neighbors) | 4 or variable |

```python
# Word Search: fixed sequence to follow
if board[nr][nc] == word[idx+1]:
    dfs(nr, nc, idx+1)

# Maze: any unvisited neighbor
if not visited[nr][nc] and maze[nr][nc] == 0:
    dfs(nr, nc)
```

---

### Single Word vs Multiple Words

| Approach | Single Word | Multiple Words |
|----------|-------------|----------------|
| **Brute force** | O(mn × 4^L) | O(mn × W × 4^L) |
| **Per-word DFS** | Standard | Repeat for each word |
| **Trie-based** | Not needed | O(mn × 4^L + TW) |
| **Pruning** | Early exit on find | Remove found words from Trie |

**T = total chars in all words, W = number of words, L = max word length**

```python
# Naive: DFS per word (slow for many words)
for word in words:
    if exist(board, word):  # Full DFS each time
        result.append(word)

# Optimized: Build Trie, single DFS
root = build_trie(words)
for r in range(m):
    for c in range(n):
        dfs(r, c, root)  # Collects all words in one pass
```

---

### Grid Search vs String Matching

| Problem | Grid Search | String Matching |
|---------|-------------|-----------------|
| **Pattern** | 2D path | 1D substring |
| **Movement** | 4-directional | Sequential |
| **Reuse** | No cell reuse | Overlapping allowed |
| **Algorithm** | DFS/Backtracking | KMP, Rabin-Karp, etc. |
| **Time** | O(mn × 4^L) | O(n + m) |

```python
# String matching (KMP): linear time
def kmp_search(text, pattern):
    # O(n + m) with preprocessing
    pass

# Grid search: exponential in word length
def grid_search(board, word):
    # O(mn × 4^L) worst case
    pass
```

---

### Data Structure Trade-offs

| Structure | Build | Query | Space | Best For |
|-----------|-------|-------|-------|----------|
| **Hash Set** | O(T) | O(1) | O(T) | Single word check |
| **Trie** | O(T) | O(L) | O(T) | Prefix sharing, multiple words |
| **Suffix Tree** | O(T) | O(L) | O(T) | Substring queries |
| **DAWG** | O(T) | O(L) | O(T) | Minimal automaton |

**T = total characters, L = query length**

```python
# For Word Search II with 1000+ words:
# Trie: Share common prefixes (e.g., "cat", "car", "card")
# Space saved when words share prefixes
```

<!-- back -->
