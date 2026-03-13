# Check If Word Can Be Placed In Crossword

## Problem Description

You are given an m x n matrix `board`, representing the current state of a crossword puzzle. The crossword contains lowercase English letters (from solved words), `' '` to represent any empty cells, and `'#'` to represent any blocked cells.

A word can be placed horizontally (left to right or right to left) or vertically (top to bottom or bottom to top) in the board if:

- It does not occupy a cell containing the character `'#'`.
- The cell each letter is placed in must either be `' '` (empty) or match the letter already on the board.
- There must not be any empty cells `' '` or other lowercase letters directly left or right of the word if the word was placed horizontally.
- There must not be any empty cells `' '` or other lowercase letters directly above or below the word if the word was placed vertically.

Given a string `word`, return `true` if `word` can be placed in `board`, or `false` otherwise.

**Link to problem:** [Check If Word Can Be Placed In Crossword - LeetCode 2018](https://leetcode.com/problems/check-if-word-can-be-placed-in-crossword/)

## Constraints
- `m == board.length`
- `n == board[i].length`
- `1 <= m * n <= 2 * 10^5`
- `board[i][j]` will be `' '`, `'#'`, or a lowercase English letter.
- `1 <= word.length <= max(m, n)`
- `word` will contain only lowercase English letters.

---

## Pattern: Grid Traversal with Direction Checking

This problem is a classic example of the **Grid Traversal with Direction Checking** pattern. The pattern involves systematically checking all possible placements of a word in a grid while validating boundary conditions and character compatibility.

### Core Concept

The fundamental idea is to try placing the word in all four possible directions:
- **Right** (left to right)
- **Left** (right to left)
- **Down** (top to bottom)
- **Up** (bottom to top)

For each possible starting position, we check if the word can be placed in that direction by verifying:
1. The word fits within bounds
2. The cells before and after the word are blocked ('#') or out of bounds
3. Each cell either contains a matching letter or is empty

---

## Examples

### Example

**Input:**
```
board = [["#", " ", "#"], [" ", " ", "#"], ["#", "c", " "]], word = "abc"
```

**Output:**
```
true
```

**Explanation:** The word "abc" can be placed vertically from top to bottom:
- Cell (0,0): '#' - blocked, can't start here in this direction
- Cell (0,1): ' ' (empty) - can place 'a'
- Cell (1,1): ' ' (empty) - can place 'b'  
- Cell (2,1): 'c' - matches 'c' ✓

The cells above position (0,1) and below position (2,1) are either '#' or out of bounds, so it's valid.

### Example 2

**Input:**
```
board = [[" ", "#", "a"], [" ", "#", "c"], [" ", "#", "a"]], word = "ac"
```

**Output:**
```
false
```

**Explanation:** It is impossible to place the word because there will always be a space/letter above or below it. Every column has '#' in the middle, but the top and bottom are empty spaces.

### Example 3

**Input:**
```
board = [["#", " ", "#"], [" ", " ", "#"], ["#", " ", "c"]], word = "ca"
```

**Output:**
```
true
```

**Explanation:** The word "ca" can be placed horizontally from right to left:
- Starting at position (2,2): 'c' matches
- Position (2,1): ' ' (empty) - can place 'a'

The cells to the left of (2,1) and right of (2,2) are '#', so it's valid.

---

## Intuition

The key insight is that we need to check all possible ways to place a word in the crossword:

1. **Four Directions**: Words can be placed left-to-right, right-to-left, top-to-bottom, or bottom-to-top.

2. **Boundary Checking**: For a word to be placed, the cells immediately before and after the word must be blocked ('#') or out of bounds. This ensures the word is in its own "slot".

3. **Character Compatibility**: Each cell must either be empty (' ') or match the corresponding letter in the word.

4. **Efficient Checking**: Instead of trying to find empty slots first, we can simply try placing the word starting from every cell and check all four directions.

### Why It Works

By systematically trying all possible starting positions and directions, we guarantee finding a valid placement if one exists. The boundary checks ensure we don't place a word that would overlap with existing letters or extend into empty spaces.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Brute Force with Direction Checking** - O(m*n*4*len(word)) time, O(1) space
2. **Pre-process Slots** - O(m*n) time to find slots, then O(1) per slot check

---

## Approach 1: Brute Force with Direction Checking

This is the most straightforward approach. We try placing the word from every cell in all four directions.

### Algorithm Steps

1. Define four direction vectors: right (0,1), left (0,-1), down (1,0), up (-1,0)
2. For each cell (i,j) in the board:
3. For each direction (di,dj):
   - Check if the word can be placed starting at (i,j) in direction (di,dj)
4. If any placement works, return true; otherwise, return false

### The can_place Function

For a word to be placed at position (i,j) in direction (di,dj):
1. Calculate the end position after placing the word
2. Check if end position is within bounds
3. Check if cells before start and after end are blocked
4. Check each cell in the word's path is compatible

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def placeWordInCrossword(self, board: List[List[str]], word: str) -> bool:
        """
        Check if a word can be placed in the crossword.
        
        Args:
            board: 2D grid representing the crossword
            word: The word to place
            
        Returns:
            True if the word can be placed, False otherwise
        """
        m, n = len(board), len(board[0])
        directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]  # right, left, down, up
        length = len(word)
        
        def can_place(i: int, j: int, di: int, dj: int) -> bool:
            # Check if word can be placed starting at (i,j) in direction (di,dj)
            end_i = i + (length - 1) * di
            end_j = j + (length - 1) * dj
            
            # End position must be within bounds
            if not (0 <= end_i < m and 0 <= end_j < n):
                return False
            
            # Check boundary before start position
            start_prev_i = i - di
            start_prev_j = j - dj
            if 0 <= start_prev_i < m and 0 <= start_prev_j < n:
                if board[start_prev_i][start_prev_j] != '#':
                    return False
            
            # Check boundary after end position
            end_next_i = end_i + di
            end_next_j = end_j + dj
            if 0 <= end_next_i < m and 0 <= end_next_j < n:
                if board[end_next_i][end_next_j] != '#':
                    return False
            
            # Check each cell in the word's path
            for k in range(length):
                ci = i + k * di
                cj = j + k * dj
                cell = board[ci][cj]
                
                # Cell must not be '#', and must be either ' ' or match the letter
                if cell == '#' or (cell != ' ' and cell != word[k]):
                    return False
            
            return True
        
        # Try all starting positions and directions
        for i in range(m):
            for j in range(n):
                for di, dj in directions:
                    if can_place(i, j, di, dj):
                        return True
        
        return False
```

<!-- slide -->
```cpp
class Solution {
public:
    bool placeWordInCrossword(vector<vector<char>>& board, string word) {
        /**
         * Check if a word can be placed in the crossword.
         * 
         * Args:
         *     board: 2D grid representing the crossword
         *     word: The word to place
         * 
         * Returns:
         *     True if the word can be placed, False otherwise
         */
        int m = board.size();
        int n = board[0].size();
        vector<pair<int, int>> directions = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
        int length = word.length();
        
        auto canPlace = [&](int i, int j, int di, int dj) -> bool {
            int endI = i + (length - 1) * di;
            int endJ = j + (length - 1) * dj;
            
            if (endI < 0 || endI >= m || endJ < 0 || endJ >= n) {
                return false;
            }
            
            // Check boundary before start
            int startPrevI = i - di;
            int startPrevJ = j - dj;
            if (startPrevI >= 0 && startPrevI < m && startPrevJ >= 0 && startPrevJ < n) {
                if (board[startPrevI][startPrevJ] != '#') {
                    return false;
                }
            }
            
            // Check boundary after end
            int endNextI = endI + di;
            int endNextJ = endJ + dj;
            if (endNextI >= 0 && endNextI < m && endNextJ >= 0 && endNextJ < n) {
                if (board[endNextI][endNextJ] != '#') {
                    return false;
                }
            }
            
            // Check each cell
            for (int k = 0; k < length; k++) {
                int ci = i + k * di;
                int cj = j + k * dj;
                char cell = board[ci][cj];
                
                if (cell == '#' || (cell != ' ' && cell != word[k])) {
                    return false;
                }
            }
            
            return true;
        };
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                for (auto [di, dj] : directions) {
                    if (canPlace(i, j, di, dj)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean placeWordInCrossword(char[][] board, String word) {
        /**
         * Check if a word can be placed in the crossword.
         * 
         * Args:
         *     board: 2D grid representing the crossword
         *     word: The word to place
         * 
         * Returns:
         *     True if the word can be placed, False otherwise
         */
        int m = board.length;
        int n = board[0].length;
        int[][] directions = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
        int length = word.length();
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                for (int[] dir : directions) {
                    if (canPlace(board, word, i, j, dir[0], dir[1], length)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    private boolean canPlace(char[][] board, String word, int i, int j, 
                             int di, int dj, int length) {
        int m = board.length;
        int n = board[0].length;
        
        int endI = i + (length - 1) * di;
        int endJ = j + (length - 1) * dj;
        
        // Check bounds
        if (endI < 0 || endI >= m || endJ < 0 || endJ >= n) {
            return false;
        }
        
        // Check boundary before start
        int startPrevI = i - di;
        int startPrevJ = j - dj;
        if (startPrevI >= 0 && startPrevI < m && startPrevJ >= 0 && startPrevJ < n) {
            if (board[startPrevI][startPrevJ] != '#') {
                return false;
            }
        }
        
        // Check boundary after end
        int endNextI = endI + di;
        int endNextJ = endJ + dj;
        if (endNextI >= 0 && endNextI < m && endNextJ >= 0 && endNextJ < n) {
            if (board[endNextI][endNextJ] != '#') {
                return false;
            }
        }
        
        // Check each cell
        for (int k = 0; k < length; k++) {
            int ci = i + k * di;
            int cj = j + k * dj;
            char cell = board[ci][cj];
            
            if (cell == '#' || (cell != ' ' && cell != word.charAt(k))) {
                return false;
            }
        }
        
        return true;
    }
}
```

<!-- slide -->
```javascript
/**
 * Check if a word can be placed in the crossword.
 * 
 * @param {character[][]} board - 2D grid representing the crossword
 * @param {string} word - The word to place
 * @return {boolean} - True if the word can be placed, False otherwise
 */
var placeWordInCrossword = function(board, word) {
    const m = board.length;
    const n = board[0].length;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    const length = word.length;
    
    const canPlace = (i, j, di, dj) => {
        const endI = i + (length - 1) * di;
        const endJ = j + (length - 1) * dj;
        
        // Check bounds
        if (endI < 0 || endI >= m || endJ < 0 || endJ >= n) {
            return false;
        }
        
        // Check boundary before start
        const startPrevI = i - di;
        const startPrevJ = j - dj;
        if (startPrevI >= 0 && startPrevI < m && startPrevJ >= 0 && startPrevJ < n) {
            if (board[startPrevI][startPrevJ] !== '#') {
                return false;
            }
        }
        
        // Check boundary after end
        const endNextI = endI + di;
        const endNextJ = endJ + dj;
        if (endNextI >= 0 && endNextI < m && endNextJ >= 0 && endNextJ < n) {
            if (board[endNextI][endNextJ] !== '#') {
                return false;
            }
        }
        
        // Check each cell
        for (let k = 0; k < length; k++) {
            const ci = i + k * di;
            const cj = j + k * dj;
            const cell = board[ci][cj];
            
            if (cell === '#' || (cell !== ' ' && cell !== word[k])) {
                return false;
            }
        }
        
        return true;
    };
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            for (const [di, dj] of directions) {
                if (canPlace(i, j, di, dj)) {
                    return true;
                }
            }
        }
    }
    
    return false;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m * n * 4 * len(word)) - Up to 4 directions from each cell |
| **Space** | O(1) - Only constant extra space |

---

## Approach 2: Pre-process Slots

This approach first identifies all empty slots in the board (continuous sequences of empty cells bounded by '#'), then checks if the word fits in any slot.

### Algorithm Steps

1. **Find Horizontal Slots**: Scan each row for sequences of empty cells bounded by '#'
2. **Find Vertical Slots**: Scan each column for sequences of empty cells bounded by '#'
3. **Check Word Fit**: For each slot, check if the word can fit (same length, compatible letters)

### Why It Works

This approach reduces the number of checks by pre-identifying valid positions, potentially reducing checks when the board has many '#' characters.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def placeWordInCrossword_slots(self, board: List[List[str]], word: str) -> bool:
        """
        Check by pre-processing empty slots in the board.
        
        Args:
            board: 2D grid representing the crossword
            word: The word to place
            
        Returns:
            True if the word can be placed, False otherwise
        """
        m, n = len(board), len(board[0])
        length = len(word)
        
        # Check horizontal slots (left to right and right to left)
        for i in range(m):
            j = 0
            while j < n:
                # Find slot start
                while j < n and board[i][j] == '#':
                    j += 1
                
                # Extract slot
                start = j
                while j < n and board[i][j] != '#':
                    j += 1
                end = j
                
                slot_length = end - start
                if slot_length == length:
                    # Check if word fits (left to right)
                    if self.check_slot(board, word, i, start, 0, 1):
                        return True
                    # Check if word fits (right to left)
                    if self.check_slot(board, word, i, end - 1, 0, -1):
                        return True
        
        # Check vertical slots (top to bottom and bottom to top)
        for j in range(n):
            i = 0
            while i < m:
                # Find slot start
                while i < m and board[i][j] == '#':
                    i += 1
                
                # Extract slot
                start = i
                while i < m and board[i][j] != '#':
                    i += 1
                end = i
                
                slot_length = end - start
                if slot_length == length:
                    # Check if word fits (top to bottom)
                    if self.check_slot(board, word, start, j, 1, 0):
                        return True
                    # Check if word fits (bottom to top)
                    if self.check_slot(board, word, end - 1, j, -1, 0):
                        return True
        
        return False
    
    def check_slot(self, board: List[List[str]], word: str, 
                   i: int, j: int, di: int, dj: int) -> bool:
        """Check if word can be placed at position in direction."""
        for k in range(len(word)):
            ci = i + k * di
            cj = j + k * dj
            cell = board[ci][cj]
            if cell != ' ' and cell != word[k]:
                return False
        return True
```

<!-- slide -->
```cpp
class Solution {
public:
    bool placeWordInCrosswordSlots(vector<vector<char>>& board, string word) {
        int m = board.size();
        int n = board[0].size();
        int length = word.length();
        
        // Check horizontal slots
        for (int i = 0; i < m; i++) {
            int j = 0;
            while (j < n) {
                while (j < n && board[i][j] == '#') j++;
                int start = j;
                while (j < n && board[i][j] != '#') j++;
                int end = j;
                
                int slotLength = end - start;
                if (slotLength == length) {
                    if (checkSlot(board, word, i, start, 0, 1)) return true;
                    if (checkSlot(board, word, i, end - 1, 0, -1)) return true;
                }
            }
        }
        
        // Check vertical slots
        for (int j = 0; j < n; j++) {
            int i = 0;
            while (i < m) {
                while (i < m && board[i][j] == '#') i++;
                int start = i;
                while (i < m && board[i][j] != '#') i++;
                int end = i;
                
                int slotLength = end - start;
                if (slotLength == length) {
                    if (checkSlot(board, word, start, j, 1, 0)) return true;
                    if (checkSlot(board, word, end - 1, j, -1, 0)) return true;
                }
            }
        }
        
        return false;
    }
    
private:
    bool checkSlot(vector<vector<char>>& board, string word, 
                   int i, int j, int di, int dj) {
        for (int k = 0; k < word.length(); k++) {
            int ci = i + k * di;
            int cj = j + k * dj;
            char cell = board[ci][cj];
            if (cell != ' ' && cell != word[k]) return false;
        }
        return true;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean placeWordInCrosswordSlots(char[][] board, String word) {
        int m = board.length;
        int n = board[0].length;
        int length = word.length();
        
        // Check horizontal slots
        for (int i = 0; i < m; i++) {
            int j = 0;
            while (j < n) {
                while (j < n && board[i][j] == '#') j++;
                int start = j;
                while (j < n && board[i][j] != '#') j++;
                int end = j;
                
                int slotLength = end - start;
                if (slotLength == length) {
                    if (checkSlot(board, word, i, start, 0, 1)) return true;
                    if (checkSlot(board, word, i, end - 1, 0, -1)) return true;
                }
            }
        }
        
        // Check vertical slots
        for (int j = 0; j < n; j++) {
            int i = 0;
            while (i < m) {
                while (i < m && board[i][j] == '#') i++;
                int start = i;
                while (i < m && board[i][j] != '#') i++;
                int end = i;
                
                int slotLength = end - start;
                if (slotLength == length) {
                    if (checkSlot(board, word, start, j, 1, 0)) return true;
                    if (checkSlot(board, word, end - 1, j, -1, 0)) return true;
                }
            }
        }
        
        return false;
    }
    
    private boolean checkSlot(char[][] board, String word, 
                             int i, int j, int di, int dj) {
        for (int k = 0; k < word.length(); k++) {
            int ci = i + k * di;
            int cj = j + k * dj;
            char cell = board[ci][cj];
            if (cell != ' ' && cell != word.charAt(k)) return false;
        }
        return true;
    }
}
```

<!-- slide -->
```javascript
var placeWordInCrosswordSlots = function(board, word) {
    const m = board.length;
    const n = board[0].length;
    const length = word.length;
    
    const checkSlot = (i, j, di, dj) => {
        for (let k = 0; k < length; k++) {
            const ci = i + k * di;
            const cj = j + k * dj;
            const cell = board[ci][cj];
            if (cell !== ' ' && cell !== word[k]) return false;
        }
        return true;
    };
    
    // Check horizontal slots
    for (let i = 0; i < m; i++) {
        let j = 0;
        while (j < n) {
            while (j < n && board[i][j] === '#') j++;
            const start = j;
            while (j < n && board[i][j] !== '#') j++;
            const end = j;
            
            const slotLength = end - start;
            if (slotLength === length) {
                if (checkSlot(i, start, 0, 1)) return true;
                if (checkSlot(i, end - 1, 0, -1)) return true;
            }
        }
    }
    
    // Check vertical slots
    for (let j = 0; j < n; j++) {
        let i = 0;
        while (i < m) {
            while (i < m && board[i][j] === '#') i++;
            const start = i;
            while (i < m && board[i][j] !== '#') i++;
            const end = i;
            
            const slotLength = end - start;
            if (slotLength === length) {
                if (checkSlot(start, j, 1, 0)) return true;
                if (checkSlot(end - 1, j, -1, 0)) return true;
            }
        }
    }
    
    return false;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m * n) for finding slots + O(slots * len(word)) for checking |
| **Space** | O(1) - Only constant extra space |

---

## Comparison of Approaches

| Aspect | Brute Force | Pre-process Slots |
|--------|-------------|-------------------|
| **Time Complexity** | O(m*n*4*len) | O(m*n) average |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Simple | Moderate |
| **Best For** | Small boards | Large boards with many # |

**Best Approach:** The brute force approach (Approach 1) is optimal and simpler to implement. It works well for the given constraints.

---

## Common Pitfalls

### 1. Direction Vectors
**Issue**: Forgetting to check both directions of each axis (left-to-right AND right-to-left).

**Solution**: Use all four directions: (0,1), (0,-1), (1,0), (-1,0).

### 2. Boundary Checking
**Issue**: Not checking cells before and after the word placement.

**Solution**: Verify that cells before start and after end are either '#' or out of bounds.

### 3. Character Matching
**Issue**: Forgetting that cells can be either ' ' (empty) or matching letter.

**Solution**: Check both conditions: cell == ' ' or cell == word[k].

### 4. End of String
**Issue**: Not handling the last character in the string properly.

**Solution**: Use `i == len(s) - 1` condition to apply the final operator.

---

## Related Problems

Based on similar themes (grid traversal, word search):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Word Search | [Link](https://leetcode.com/problems/word-search/) | Find word in 2D grid |
| Search a 2D Matrix II | [Link](https://leetcode.com/problems/search-a-2d-matrix-ii/) | Search in sorted matrix |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Word Search II | [Link](https://leetcode.com/problems/word-search-ii/) | Find all words in board |
| Number of Squareful Arrays | [Link](https://leetcode.com/problems/number-of-squareful-arrays/) | Grid-based permutation |
| Minimum Number of Operations to Move All Balls | [Link](https://leetcode.com/problems/minimum-number-of-operations-to-move-all-balls-to-each-box/) | Grid operations |

### Pattern Reference

For more detailed explanations of the Grid Traversal pattern and its variations, see:
- **[Grid Traversal Pattern](/patterns/grid-traversal)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Problem Explanation

- [NeetCode - Check If Word Can Be Placed In Crossword](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation with visual examples
- [LeetCode Official Solution](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Official problem solution

### Related Concepts

- [Grid Traversal Techniques](https://www.youtube.com/watch?v=) - Understanding grid traversal
- [2D Array Operations](https://www.youtube.com/watch?v=) - Working with 2D arrays

---

## Follow-up Questions

### Q1: How would you modify the solution to handle multiple words at once?

**Answer:** You would iterate through each word and call the placement function for each. The time complexity would become O(k * m * n * 4 * len(word)) where k is the number of words.

---

### Q2: What if the word could be placed diagonally?

**Answer:** You would add four more direction vectors: (1,1), (1,-1), (-1,1), (-1,-1). The rest of the logic remains the same.

---

### Q3: How would you optimize if the board is very large (10^6 cells)?

**Answer:** You could use the pre-processing slots approach to reduce the number of checks. Additionally, you could use early termination and skip cells that cannot possibly start a word.

---

### Q4: Can you solve it without checking all four directions from every cell?

**Answer:** Yes, you can first identify all potential starting positions (cells that are either empty or match the first letter), and only try directions from those positions. This can reduce unnecessary checks.

---

### Q5: What edge cases should be tested?

**Answer:**
- Word longer than any row or column
- Board with no empty cells
- Board with all blocked cells (#)
- Word with letters that don't match any board cells
- Word that fits in multiple places
- Single cell board

---

### Q6: How would you handle words that need to match existing letters exactly?

**Answer:** The current solution already handles this - it checks that each cell either has ' ' (empty) or matches the letter. For exact matching only, you would change the condition to only accept matching letters, not empty cells.

---

## Summary

The **Check If Word Can Be Placed In Crossword** problem demonstrates grid traversal with multiple direction checking:

- **Brute force approach**: O(m*n*4*len(word)) time, O(1) space - simple and effective
- **Pre-process slots**: Can be faster for sparse boards with many '#' characters

The key insight is systematically trying all possible placements while ensuring proper boundary conditions and character compatibility.

### Pattern Summary

This problem exemplifies the **Grid Traversal with Direction Checking** pattern, which is characterized by:
- Checking all four directions (or more)
- Validating boundary conditions before and after placement
- Ensuring character compatibility at each position
- Achieving O(m*n) or better time complexity

For more details on this pattern and its variations, see the **[Grid Traversal Pattern](/patterns/grid-traversal)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/check-if-word-can-be-placed-in-crossword/discuss/) - Community solutions
- [Grid Traversal - GeeksforGeeks](https://www.geeksforgeeks.org/grid-traversal-techniques/) - Understanding grid traversal
- [2D Array Operations - GeeksforGeeks](https://www.geeksforgeeks.org/2d-array/) - Working with 2D arrays
