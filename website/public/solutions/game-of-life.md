# Game Of Life

## Problem Description
According to Wikipedia's article: "The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970."
The board is made up of an m x n grid of cells, where each cell has an initial state: live (represented by a 1) or dead (represented by a 0). Each cell interacts with its eight neighbors (horizontal, vertical, diagonal) using the following four rules (taken from the above Wikipedia article):

Any live cell with fewer than two live neighbors dies as if caused by under-population.
Any live cell with two or three live neighbors lives on to the next generation.
Any live cell with more than three live neighbors dies, as if by over-population.
Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

The next state of the board is determined by applying the above rules simultaneously to every cell in the current state of the m x n grid board. In this process, births and deaths occur simultaneously.
Given the current state of the board, update the board to reflect its next state.
Note that you do not need to return anything.
 
Example 1:
Input: board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]
Output: [[0,0,0],[1,0,1],[0,1,1],[0,1,0]]

Example 2:
Input: board = [[1,1],[1,0]]
Output: [[1,1],[1,1]]

 
Constraints:

m == board.length
n == board[i].length
1 <= m, n <= 25
board[i][j] is 0 or 1.

 
Follow up:

Could you solve it in-place? Remember that the board needs to be updated simultaneously: You cannot update some cells first and then use their updated values to update other cells.
In this question, we represent the board using a 2D array. In principle, the board is infinite, which would cause problems when the active area encroaches upon the border of the array (i.e., live cells reach the border). How would you address these problems?
## Solution

```python
from typing import List

class Solution:
    def gameOfLife(self, board: List[List[int]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        """
        m, n = len(board), len(board[0])
        def count_live(i, j):
            count = 0
            for di in [-1,0,1]:
                for dj in [-1,0,1]:
                    if di == 0 and dj == 0: continue
                    ni, nj = i + di, j + dj
                    if 0 <= ni < m and 0 <= nj < n and (board[ni][nj] == 1 or board[ni][nj] == 2):
                        count += 1
            return count
        for i in range(m):
            for j in range(n):
                live = count_live(i, j)
                if board[i][j] == 1:
                    if live < 2 or live > 3:
                        board[i][j] = 2
                else:
                    if live == 3:
                        board[i][j] = 3
        for i in range(m):
            for j in range(n):
                if board[i][j] == 2:
                    board[i][j] = 0
                elif board[i][j] == 3:
                    board[i][j] = 1
```

## Explanation
This problem requires updating the board in-place according to the Game of Life rules, where all cells are updated simultaneously based on their current state.

To achieve this without extra space, we use intermediate states: 2 to represent a live cell (1) that will die in the next state, and 3 to represent a dead cell (0) that will become live.

First, we define a helper function to count the number of live neighbors for a cell at position (i, j). A neighbor is live if its value is 1 (or 3, but since we start with 0/1, initially only 1).

We iterate through all cells. For each cell (i, j):

- Count live neighbors.

- If the cell is live (board[i][j] == 1):

  - If live neighbors < 2 or > 3, set board[i][j] = 2 (will die).

  - Else, keep as 1.

- If the cell is dead (board[i][j] == 0):

  - If live neighbors == 3, set board[i][j] = 3 (will live).

After processing all cells, we iterate again to update the states:

- If board[i][j] == 2, set to 0.

- If board[i][j] == 3, set to 1.

This ensures all updates are based on the original state.

Time complexity: O(m * n), where m and n are the dimensions of the board, as we make two passes over the board.

Space complexity: O(1), excluding the input board, since we modify in-place.
