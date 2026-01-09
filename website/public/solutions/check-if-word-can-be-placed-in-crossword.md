# Check If Word Can Be Placed In Crossword

## Problem Description
You are given an m x n matrix board, representing the current state of a crossword puzzle. The crossword contains lowercase English letters (from solved words), ' ' to represent any empty cells, and '#' to represent any blocked cells.
A word can be placed horizontally (left to right or right to left) or vertically (top to bottom or bottom to top) in the board if:

- It does not occupy a cell containing the character '#'.
- The cell each letter is placed in must either be ' ' (empty) or match the letter already on the board.
- There must not be any empty cells ' ' or other lowercase letters directly left or right of the word if the word was placed horizontally.
- There must not be any empty cells ' ' or other lowercase letters directly above or below the word if the word was placed vertically.

Given a string word, return true if word can be placed in board, or false otherwise.

## Examples

**Example 1:**

**Input:**
```
board = [["#", " ", "#"], [" ", " ", "#"], ["#", "c", " "]], word = "abc"
```

**Output:**
```
true
```

**Explanation:** The word "abc" can be placed as shown above (top to bottom).

**Example 2:**

**Input:**
```
board = [[" ", "#", "a"], [" ", "#", "c"], [" ", "#", "a"]], word = "ac"
```

**Output:**
```
false
```

**Explanation:** It is impossible to place the word because there will always be a space/letter above or below it.

**Example 3:**

**Input:**
```
board = [["#", " ", "#"], [" ", " ", "#"], ["#", " ", "c"]], word = "ca"
```

**Output:**
```
true
```

**Explanation:** The word "ca" can be placed as shown above (right to left).

## Constraints

- `m == board.length`
- `n == board[i].length`
- `1 <= m * n <= 2 * 10^5`
- `board[i][j]` will be ' ', '#', or a lowercase English letter.
- `1 <= word.length <= max(m, n)`
- `word` will contain only lowercase English letters.

## Solution

```python
from typing import List

class Solution:
    def placeWordInCrossword(self, board: List[List[str]], word: str) -> bool:
        m, n = len(board), len(board[0])
        directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]  # right, left, down, up
        
        def can_place(i, j, di, dj):
            # Check if word can be placed starting at (i,j) in direction (di,dj)
            length = len(word)
            end_i = i + (length - 1) * di
            end_j = j + (length - 1) * dj
            if not (0 <= end_i < m and 0 <= end_j < n):
                return False
            
            # Check boundaries before start and after end
            start_prev_i = i - di
            start_prev_j = j - dj
            if 0 <= start_prev_i < m and 0 <= start_prev_j < n and board[start_prev_i][start_prev_j] != '#':
                return False
            end_next_i = end_i + di
            end_next_j = end_j + dj
            if 0 <= end_next_i < m and 0 <= end_next_j < n and board[end_next_i][end_next_j] != '#':
                return False
            
            # Check each cell
            for k in range(length):
                ci = i + k * di
                cj = j + k * dj
                cell = board[ci][cj]
                if cell == '#' or (cell != ' ' and cell != word[k]):
                    return False
            return True
        
        for i in range(m):
            for j in range(n):
                for di, dj in directions:
                    if can_place(i, j, di, dj):
                        return True
        return False
```

## Explanation
To check if a word can be placed in the crossword board, we need to try placing it in all four directions (right, left, down, up) from every possible starting cell.

For each starting position (i, j) and each direction (di, dj), we define a helper function can_place that checks:
1. If the end position is within bounds.
2. If the cells immediately before the start and after the end are blocked ('#') or out of bounds (to ensure the word is properly bounded).
3. For each letter in the word, the corresponding cell is not '#' and either empty (' ') or matches the letter.

If any placement succeeds, return true; otherwise, false.

## Time Complexity
**O(m * n * 4 * len(word))**, as we check up to 4 directions per cell, and for each, iterate through the word length. Since len(word) <= max(m, n) and m*n <= 2e5, it's efficient.

## Space Complexity
**O(1)**, excluding the input.
