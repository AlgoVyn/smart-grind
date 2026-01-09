# Word Search

## Problem Description

Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.

### Examples

**Example 1:**

**Input:**
```python
board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
```

**Output:**
```python
true
```

**Example 2:**

**Input:**
```python
board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
```

**Output:**
```python
true
```

**Example 3:**

**Input:**
```python
board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"
```

**Output:**
```python
false
```

### Constraints

- `m == board.length`
- `n = board[i].length`
- `1 <= m, n <= 6`
- `1 <= word.length <= 15`
- `board` and `word` consists of only lowercase and uppercase English letters.

### Follow up

Could you use search pruning to make your solution faster with a larger board?

---

## Solution

```python
class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        if not board or not board[0]:
            return False
        
        m, n = len(board), len(board[0])
        
        def dfs(i, j, k):
            if k == len(word):
                return True
            if i < 0 or i >= m or j < 0 or j >= n or board[i][j] != word[k]:
                return False
            
            # Mark as visited
            temp = board[i][j]
            board[i][j] = '#'
            
            # Explore neighbors
            found = (dfs(i+1, j, k+1) or
                     dfs(i-1, j, k+1) or
                     dfs(i, j+1, k+1) or
                     dfs(i, j-1, k+1))
            
            # Backtrack
            board[i][j] = temp
            return found
        
        for i in range(m):
            for j in range(n):
                if dfs(i, j, 0):
                    return True
        
        return False
```

---

## Explanation

This problem requires finding if a word exists in a grid of characters, where the word can be formed by adjacent cells (horizontally or vertically) without reusing the same cell.

### Step-by-Step Approach

1. **Edge Cases**: If the board is empty or has no columns, return false immediately.

2. **DFS Function**: Define a helper function `dfs(i, j, k)` that checks if the word can be formed starting from position `(i, j)` at index `k` of the word.
   - If `k` equals the length of the word, we've found the word, return true.
   - If the current position is out of bounds or the character doesn't match `word[k]`, return false.
   - Temporarily mark the cell as visited by changing it to `'#'` to avoid reusing.
   - Recursively check all four directions (up, down, left, right) for the next character.
   - Backtrack by restoring the original character.

3. **Iterate Through Grid**: Loop through each cell in the grid and start DFS from there if the first character matches.

4. **Return Result**: If any DFS returns true, the word exists; otherwise, false.

### Time Complexity

- **O(m * n * 4^L)**, where `m` and `n` are grid dimensions, `L` is word length. This happens when the word is long and many paths are explored.

### Space Complexity

- **O(L)** for the recursion stack, as the depth is at most the word length.
- The board is modified in place, so no extra space for the grid.
