# Spiral Matrix IV

## Problem Description

You are given two integers `m` and `n`, which represent the dimensions of a matrix.
You are also given the head of a linked list of integers.
Generate an `m x n` matrix that contains the integers in the linked list presented in spiral order (clockwise), starting from the top-left of the matrix. If there are remaining empty spaces, fill them with `-1`.
Return the generated matrix.

### Examples

**Example 1:**
```python
Input: m = 3, n = 5, head = [3,0,2,6,8,1,7,9,4,2,5,5,0]
Output: [[3,0,2,6,8],[5,0,-1,-1,1],[5,2,4,9,7]]
```

**Example 2:**
```python
Input: m = 1, n = 4, head = [0,1,2]
Output: [[0,1,2,-1]]
```

### Constraints

- `1 <= m, n <= 10^5`
- `1 <= m * n <= 10^5`
- The number of nodes in the list is in the range `[1, m * n]`.
- `0 <= Node.val <= 1000`

---

## Solution

```python
from typing import List, Optional

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def spiralMatrix(self, m: int, n: int, head: Optional[ListNode]) -> List[List[int]]:
        matrix = [[-1] * n for _ in range(m)]
        if not head:
            return matrix
        
        curr = head
        top, bottom = 0, m - 1
        left, right = 0, n - 1
        
        while top <= bottom and left <= right and curr:
            # Fill top row
            for j in range(left, right + 1):
                if curr:
                    matrix[top][j] = curr.val
                    curr = curr.next
            top += 1
            
            # Fill right column
            for i in range(top, bottom + 1):
                if curr:
                    matrix[i][right] = curr.val
                    curr = curr.next
            right -= 1
            
            # Fill bottom row
            if top <= bottom:
                for j in range(right, left - 1, -1):
                    if curr:
                        matrix[bottom][j] = curr.val
                        curr = curr.next
                bottom -= 1
            
            # Fill left column
            if left <= right:
                for i in range(bottom, top - 1, -1):
                    if curr:
                        matrix[i][left] = curr.val
                        curr = curr.next
                left += 1
        
        return matrix
```

---

## Explanation

This problem requires generating an `m x n` matrix filled in spiral order with values from a linked list, using `-1` for unfilled cells.

### Step-by-Step Approach:

1. **Initialize Matrix**: Create an `m x n` matrix filled with `-1`.

2. **Boundaries**: Use four boundaries: `top`, `bottom`, `left`, `right`, starting at `0`, `m-1`, `0`, `n-1`.

3. **Spiral Traversal**:
   - While `top <= bottom` and `left <= right` and there are nodes left:
     - Fill the top row from left to right, then increment top.
     - Fill the right column from top to bottom, then decrement right.
     - If `top <= bottom`, fill the bottom row from right to left, then decrement bottom.
     - If `left <= right`, fill the left column from bottom to top, then increment left.

4. **Assign Values**: For each cell in the spiral order, if the linked list has a node, assign its value and move to next; otherwise, leave as `-1`.

5. **Return Matrix**: The matrix is now filled as required.

### Time Complexity:

- **O(m * n)**, as we visit each cell at most once.

### Space Complexity:

- **O(m * n)** for the matrix.
