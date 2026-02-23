# Word Search

## Category
Backtracking

## Description
Find word in 2D grid by moving adjacent cells.

---

## Algorithm Explanation
Word Search is a classic backtracking problem where we need to find if a word exists in a 2D grid of characters. We can move to adjacent cells (up, down, left, right) and cannot use a cell more than once in the same path.

### Key Concepts:
- **Backtracking**: Explore all possible paths, undoing choices when stuck
- **DFS**: Depth-first search through the grid
- **Boundary Checks**: Ensure we don't go out of bounds
- **Visited Tracking**: Mark cells as visited during traversal

### How It Works:
1. Start from each cell in the grid
2. For each starting position, perform DFS
3. At each step:
   - Check if current position is valid (in bounds, not visited, matches character)
   - Mark current cell as visited
   - Recurse to all 4 neighbors
   - Backtrack: unmark current cell
4. Return True if word is found, False otherwise

### Optimization:
- Early termination if first letter doesn't match
- Use in-place modification (mark with special character) instead of visited set

### Time Complexity:
O(M * N * 4^L) where M*N is grid size and L is word length.

## When to Use
Use this algorithm when you need to solve problems involving:
- backtracking related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Implementation

```python
from typing import List

def exist(board: List[List[str]], word: str) -> bool:
    """
    Find if word exists in the grid using DFS backtracking.
    
    Args:
        board: 2D grid of characters
        word: Word to search for
    
    Returns:
        True if word exists in grid
    """
    if not board or not board[0] or not word:
        return False
    
    rows, cols = len(board), len(board[0])
    
    def dfs(r: int, c: int, index: int) -> bool:
        # Base case: all characters matched
        if index == len(word):
            return True
        
        # Boundary and character check
        if (r < 0 or r >= rows or c < 0 or c >= 
            board[r][c] != word[index]):
            return False
        
        # Mark as visited (temporarily change to None)
        temp = board[r][c]
        board[r][c] = None
        
        # Explore all 4 directions
        found = (dfs(r + 1, c, index + 1) or
                 dfs(r - 1, c, index + 1) or
                 dfs(r, c + 1, index + 1) or
                 dfs(r, c - 1, index + 1))
        
        # Backtrack: restore the character
        board[r][c] = temp
        
        return found
    
    # Try starting from each cell
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0]:
                if dfs(r, c, 0):
                    return True
    
    return False


def exist_all_words(board: List[List[str]], words: List[str]) -> List[str]:
    """
    Find all words from list that exist in the grid.
    Uses Trie for optimization when searching multiple words.
    """
    found = []
    for word in words:
        if exist(board, word):
            found.append(word)
    return found


# Example usage
if __name__ == "__main__":
    board = [
        ['A', 'B', 'C', 'E'],
        ['S', 'F', 'C', 'S'],
        ['A', 'D', 'E', 'E']
    ]
    
    word1 = "ABCCED"
    word2 = "SEE"
    word3 = "ABCB"
    word4 = "ASF"
    
    print(f"Board: {board}")
    print(f"Search '{word1}': {exist(board, word1)}")  # True
    print(f"Search '{word2}': {exist(board, word2)}")  # True
    print(f"Search '{word3}': {exist(board, word3)}")  # False (can't reuse B)
    print(f"Search '{word4}': {exist(board, word4)}")  # True
```

```javascript
function wordSearchGrid() {
    // Word Search implementation
    // Time: O(m * n * 4^L)
    // Space: O(L)
}
```

---

## Example

**Input:**
```
board = [
    ['A', 'B', 'C', 'E'],
    ['S', 'F', 'C', 'S'],
    ['A', 'D', 'E', 'E']
]
word = "ABCCED"
```

**Output:**
```
Board: [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']]
Search 'ABCCED': True
Search 'SEE': True
Search 'ABCB': False
Search 'ASF': True
```

**Explanation:**
- Path for "ABCCED": A(0,0) → B(0,1) → C(0,2) → C(1,2) → E(2,2) → D(2,1)
- Path for "SEE": S(1,0) → E(1,1) → E(1,2)
- "ABCB" fails because we'd need to reuse B (can't revisit cells)
- "ASF": A(0,0) → S(1,0) → F(1,1)

---

## Time Complexity
**O(m * n * 4^L)**

---

## Space Complexity
**O(L)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
