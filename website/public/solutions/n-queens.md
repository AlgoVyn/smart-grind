# N-Queens

## Problem Description
[Link to problem](https://leetcode.com/problems/n-queens/)

The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.
Given an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.
Each solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.
 
Example 1:


Input: n = 4
Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
Explanation: There exist two distinct solutions to the 4-queens puzzle as shown above

Example 2:

Input: n = 1
Output: [["Q"]]

 
Constraints:

1 <= n <= 9


## Solution

```python
class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        def is_safe(board, row, col):
            for i in range(row):
                if board[i] == col or abs(board[i] - col) == row - i:
                    return False
            return True
        
        def backtrack(board, row):
            if row == n:
                result.append(['.'*i + 'Q' + '.'*(n-i-1) for i in board])
                return
            for col in range(n):
                if is_safe(board, row, col):
                    board.append(col)
                    backtrack(board, row + 1)
                    board.pop()
        
        result = []
        backtrack([], 0)
        return result
```

## Explanation
The N-Queens problem is solved using backtracking, where we try to place queens on the board one row at a time, ensuring no two queens threaten each other.

Step-by-step approach:
1. Initialize an empty board representation as a list where each index represents a row and the value represents the column where the queen is placed.
2. Use a recursive backtracking function that takes the current board state and the current row to place a queen.
3. For each column in the current row, check if it's safe to place a queen there using the `is_safe` function.
4. The `is_safe` function checks if any previously placed queen is in the same column or on the same diagonal.
5. If safe, place the queen (append column to board), recurse to the next row, then backtrack by removing the queen (pop).
6. When all rows are filled (row == n), convert the board to the required string format and add to result.

Time Complexity: O(N!) in the worst case due to trying all permutations, but significantly less with pruning as invalid placements are avoided early.
Space Complexity: O(N) for the board list and recursion stack.
