# Backtracking - Word Search / Path Finding in Grid

## Overview

The Backtracking - Word Search / Path Finding in Grid pattern is used to explore paths in a 2D grid to find if a specific sequence (like a word) exists or to perform pathfinding with constraints. It employs depth-first search (DFS) with backtracking to traverse adjacent cells, marking visited positions to avoid cycles and restoring state upon backtracking. This pattern is ideal for grid-based problems requiring exhaustive path exploration.

Use this pattern for problems involving finding paths, words, or sequences in grids, such as maze solving or word searches. The benefits include systematic exploration of all possible paths, efficient pruning when characters don't match, and the ability to handle directional constraints and visited tracking.

## Key Concepts

- **Grid Traversal**: Start from each cell and explore four directions (up, down, left, right).
- **Visited Tracking**: Temporarily mark cells as visited to prevent revisiting and cycles.
- **Character Matching**: Check if the current cell matches the next character in the sequence.
- **Backtracking**: Restore the cell's original value after exploring all paths from it.
- **Base Cases**: Return true if the entire sequence is found; return false if out of bounds or mismatch.

## Template

```python
def exist(board, word):
    def backtrack(i, j, index):
        # Base case: if we've matched the entire word
        if index == len(word):
            return True
        
        # Boundary and mismatch checks
        if (i < 0 or i >= len(board) or j < 0 or j >= len(board[0]) or 
            board[i][j] != word[index]):
            return False
        
        # Mark the cell as visited
        temp = board[i][j]
        board[i][j] = '#'  # Use a sentinel value
        
        # Explore all four directions
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        for di, dj in directions:
            if backtrack(i + di, j + dj, index + 1):
                return True
        
        # Backtrack: restore the cell
        board[i][j] = temp
        return False
    
    # Start from each cell in the grid
    for i in range(len(board)):
        for j in range(len(board[0])):
            if backtrack(i, j, 0):
                return True
    return False
```

## Example Problems

1. **Word Search (LeetCode 79)**: Determine if a given word exists in a 2D grid of letters, where adjacent cells are horizontally or vertically neighboring.
2. **Word Search II (LeetCode 212)**: Find all words from a given list that can be formed in the grid.
3. **Number of Islands (LeetCode 200)**: Count the number of connected components (islands) in a grid, using similar DFS traversal.

## Time and Space Complexity

- **Time Complexity**: O(m * n * 4^L), where m and n are grid dimensions and L is the word length, as each cell can start a search exploring up to 4^L paths.
- **Space Complexity**: O(L) for the recursion stack, plus O(m * n) in the worst case for visited tracking if modifying the grid.

## Common Pitfalls

- **Infinite loops**: Failing to mark cells as visited leads to revisiting the same cells; always use a visited mechanism.
- **Not restoring state**: Modifying the grid in place requires restoring the original value after backtracking.
- **Boundary checks**: Ensure i, j are within bounds before accessing board[i][j].
- **Character case sensitivity**: Words and grid may have case differences; handle accordingly.
- **Large grids**: For large grids or long words, the exponential time can cause timeouts; optimize with pruning or tries for multiple words.