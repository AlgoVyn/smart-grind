# Backtracking - Word Search Path Finding in Grid

## Problem Description

The **Word Search / Path Finding in Grid** pattern is used to explore paths in a 2D grid to find if a specific sequence (like a word) exists or to perform pathfinding with constraints. It employs depth-first search (DFS) with backtracking to traverse adjacent cells, marking visited positions to avoid cycles and restoring state upon backtracking.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Input** | 2D grid of characters, target word/path to find |
| **Output** | Boolean (path exists) or path coordinates |
| **Key Insight** | DFS with backtracking and visited marking |
| **Time Complexity** | O(m × n × 4^L) where m,n are grid dimensions, L is word length |
| **Space Complexity** | O(L) for recursion stack |

### When to Use

- **Grid-based word search**: Finding words in a 2D grid of characters
- **Path existence problems**: Determining if a valid path exists with constraints
- **Maze solving**: Finding routes through mazes with obstacles
- **Pattern matching in grids**: Matching sequences in two-dimensional arrays
- **Constraint satisfaction on grids**: Problems requiring specific path properties

---

## Intuition

### Core Insight

The key insight behind this pattern is that **grid exploration requires systematic traversal with state restoration**:

1. **Grid traversal is inherently recursive** - from any cell, you can move to adjacent cells
2. **Visited tracking prevents cycles** - without marking visited cells, you'd loop infinitely
3. **Backtracking restores state** - when a path fails, restore the grid to try alternative routes
4. **Early termination optimizes** - stop exploring when characters don't match

### The "Aha!" Moments

1. **Why mark visited cells?** In a grid, you can return to previous cells through different paths. Marking prevents revisiting the same cell in the current path.

2. **Why restore the cell after exploring?** Each path attempt must be independent. If path A→B→C fails, cell B should be available for path A→B→D.

3. **Why start from every cell?** The word might start anywhere in the grid, not just at position (0,0).

### Grid Exploration Visualization

Consider finding "ABF" in this grid:
```
A B C
D E F
G H I
```

**Path exploration:**
1. Start at (0,0) = 'A' → match 'A'
2. Move right to (0,1) = 'B' → match 'B'
3. From 'B', try: left (visited), right 'C', down 'E'
4. From 'B'→'E'→... fails, backtrack to 'B'
5. Try 'B'→... actually need 'F', not adjacent
6. From 'A', try down to 'D' → fail
7. Start from other cells...
8. Eventually find A→B→?... need path to F

---

## Solution Approaches

### Approach 1: Standard DFS with Backtracking ⭐

The fundamental approach using DFS with in-place grid marking for visited tracking.

#### Algorithm

1. **Iterate through each cell** in the grid as potential starting point
2. **Define DFS function** that takes current position and word index
3. **Base cases**:
   - If index equals word length → word found, return True
   - If out of bounds or cell doesn't match → return False
4. **Mark current cell** as visited (modify in-place or use visited set)
5. **Explore all 4 directions** recursively
6. **Restore cell** (backtrack) after exploration
7. **Return result** from any successful direction

#### Implementation

````carousel
```python
def exist(board, word):
    """
    Check if word exists in the grid using DFS with backtracking.
    
    Args:
        board: 2D list of characters
        word: string to search for
        
    Returns:
        bool: True if word exists in grid
    """
    if not board or not board[0]:
        return False
    
    rows, cols = len(board), len(board[0])
    
    def backtrack(r, c, index):
        # Base case: found the entire word
        if index == len(word):
            return True
        
        # Check bounds and character match
        if (r < 0 or r >= rows or c < 0 or c >= cols or 
            board[r][c] != word[index]):
            return False
        
        # Mark as visited
        temp = board[r][c]
        board[r][c] = '#'  # Use sentinel value
        
        # Explore all 4 directions
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        for dr, dc in directions:
            if backtrack(r + dr, c + dc, index + 1):
                return True
        
        # Backtrack: restore the cell
        board[r][c] = temp
        return False
    
    # Try starting from each cell
    for i in range(rows):
        for j in range(cols):
            if backtrack(i, j, 0):
                return True
    
    return False
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    bool exist(vector<vector<char>>& board, string word) {
        if (board.empty() || board[0].empty()) return false;
        
        rows = board.size();
        cols = board[0].size();
        this->word = word;
        this->board = board;
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (backtrack(i, j, 0)) {
                    return true;
                }
            }
        }
        return false;
    }
    
private:
    int rows, cols;
    string word;
    vector<vector<char>> board;
    vector<pair<int, int>> directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    
    bool backtrack(int r, int c, int index) {
        if (index == word.size()) return true;
        
        if (r < 0 || r >= rows || c < 0 || c >= cols || 
            board[r][c] != word[index]) {
            return false;
        }
        
        char temp = board[r][c];
        board[r][c] = '#';
        
        for (auto& [dr, dc] : directions) {
            if (backtrack(r + dr, c + dc, index + 1)) {
                return true;
            }
        }
        
        board[r][c] = temp;
        return false;
    }
};
```

<!-- slide -->
```java
class Solution {
    private char[][] board;
    private String word;
    private int rows, cols;
    private int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    
    public boolean exist(char[][] board, String word) {
        if (board == null || board.length == 0) return false;
        
        this.board = board;
        this.word = word;
        this.rows = board.length;
        this.cols = board[0].length;
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (backtrack(i, j, 0)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    private boolean backtrack(int r, int c, int index) {
        if (index == word.length()) return true;
        
        if (r < 0 || r >= rows || c < 0 || c >= cols || 
            board[r][c] != word.charAt(index)) {
            return false;
        }
        
        char temp = board[r][c];
        board[r][c] = '#';
        
        for (int[] dir : directions) {
            if (backtrack(r + dir[0], c + dir[1], index + 1)) {
                return true;
            }
        }
        
        board[r][c] = temp;
        return false;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function(board, word) {
    if (!board || board.length === 0) return false;
    
    const rows = board.length;
    const cols = board[0].length;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    function backtrack(r, c, index) {
        if (index === word.length) return true;
        
        if (r < 0 || r >= rows || c < 0 || c >= cols || 
            board[r][c] !== word[index]) {
            return false;
        }
        
        const temp = board[r][c];
        board[r][c] = '#';
        
        for (const [dr, dc] of directions) {
            if (backtrack(r + dr, c + dc, index + 1)) {
                return true;
            }
        }
        
        board[r][c] = temp;
        return false;
    }
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (backtrack(i, j, 0)) {
                return true;
            }
        }
    }
    return false;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n × 4^L) where m,n are grid dimensions, L is word length |
| **Space** | O(L) for recursion stack depth |

---

### Approach 2: DFS with Visited Set

Alternative approach using a separate visited set instead of modifying the grid in-place. Better when grid cannot be modified.

#### Algorithm

1. Use a `Set` or 2D boolean array to track visited cells
2. Pass visited set through recursive calls (or use backtracking on the set)
3. Same DFS logic but check visited set before exploring

#### Implementation

````carousel
```python
def exist_with_visited(board, word):
    """
    Check if word exists using a separate visited set.
    Useful when board cannot be modified.
    """
    if not board or not board[0]:
        return False
    
    rows, cols = len(board), len(board[0])
    
    def backtrack(r, c, index, visited):
        if index == len(word):
            return True
        
        if (r < 0 or r >= rows or c < 0 or c >= cols or 
            (r, c) in visited or board[r][c] != word[index]):
            return False
        
        visited.add((r, c))
        
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        for dr, dc in directions:
            if backtrack(r + dr, c + dc, index + 1, visited):
                return True
        
        visited.remove((r, c))  # Backtrack
        return False
    
    for i in range(rows):
        for j in range(cols):
            if backtrack(i, j, 0, set()):
                return True
    
    return False
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_set>
using namespace std;

class SolutionVisited {
public:
    bool exist(vector<vector<char>>& board, string word) {
        if (board.empty() || board[0].empty()) return false;
        
        rows = board.size();
        cols = board[0].size();
        this->board = board;
        this->word = word;
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                unordered_set<string> visited;
                if (backtrack(i, j, 0, visited)) {
                    return true;
                }
            }
        }
        return false;
    }
    
private:
    int rows, cols;
    string word;
    vector<vector<char>> board;
    vector<pair<int, int>> directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    
    string key(int r, int c) {
        return to_string(r) + "," + to_string(c);
    }
    
    bool backtrack(int r, int c, int index, unordered_set<string>& visited) {
        if (index == word.size()) return true;
        
        string k = key(r, c);
        if (r < 0 || r >= rows || c < 0 || c >= cols || 
            visited.count(k) || board[r][c] != word[index]) {
            return false;
        }
        
        visited.insert(k);
        
        for (auto& [dr, dc] : directions) {
            if (backtrack(r + dr, c + dc, index + 1, visited)) {
                return true;
            }
        }
        
        visited.erase(k);
        return false;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class SolutionVisited {
    private char[][] board;
    private String word;
    private int rows, cols;
    private int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    
    public boolean exist(char[][] board, String word) {
        if (board == null || board.length == 0) return false;
        
        this.board = board;
        this.word = word;
        this.rows = board.length;
        this.cols = board[0].length;
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                Set<String> visited = new HashSet<>();
                if (backtrack(i, j, 0, visited)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    private String key(int r, int c) {
        return r + "," + c;
    }
    
    private boolean backtrack(int r, int c, int index, Set<String> visited) {
        if (index == word.length()) return true;
        
        String k = key(r, c);
        if (r < 0 || r >= rows || c < 0 || c >= cols || 
            visited.contains(k) || board[r][c] != word.charAt(index)) {
            return false;
        }
        
        visited.add(k);
        
        for (int[] dir : directions) {
            if (backtrack(r + dir[0], c + dir[1], index + 1, visited)) {
                return true;
            }
        }
        
        visited.remove(k);
        return false;
    }
}
```

<!-- slide -->
```javascript
var existWithVisited = function(board, word) {
    if (!board || board.length === 0) return false;
    
    const rows = board.length;
    const cols = board[0].length;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    function backtrack(r, c, index, visited) {
        if (index === word.length) return true;
        
        const key = `${r},${c}`;
        if (r < 0 || r >= rows || c < 0 || c >= cols || 
            visited.has(key) || board[r][c] !== word[index]) {
            return false;
        }
        
        visited.add(key);
        
        for (const [dr, dc] of directions) {
            if (backtrack(r + dr, c + dc, index + 1, visited)) {
                return true;
            }
        }
        
        visited.delete(key);
        return false;
    }
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (backtrack(i, j, 0, new Set())) {
                return true;
            }
        }
    }
    return false;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n × 4^L) - same as standard approach |
| **Space** | O(L) for recursion + O(L) for visited set |

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| **Standard DFS (In-place)** | O(m × n × 4^L) | O(L) | **General use** - when grid can be modified |
| **DFS with Visited Set** | O(m × n × 4^L) | O(L) | When grid must remain unchanged |

**Where:**
- `m`, `n` = grid dimensions (rows × cols)
- `L` = length of the word being searched
- 4^L represents exploring 4 directions at each of L steps

**Time Breakdown:**
- Try starting from each cell: O(m × n)
- For each start, explore up to 4 directions at each character: O(4^L)
- Character comparison is O(1)
- Total: O(m × n × 4^L)

---

## Related Problems

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Flood Fill | [Link](https://leetcode.com/problems/flood-fill/) | Simple grid DFS without backtracking |
| Island Perimeter | [Link](https://leetcode.com/problems/island-perimeter/) | Count perimeter of islands |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Word Search** | [Link](https://leetcode.com/problems/word-search/) | Classic word search in grid |
| **Path with Maximum Gold** | [Link](https://leetcode.com/problems/path-with-maximum-gold/) | Find max gold collecting path |
| **Unique Paths III** | [Link](https://leetcode.com/problems/unique-paths-iii/) | Count paths visiting all empty cells |
| **Robot Room Cleaner** | [Link](https://leetcode.com/problems/robot-room-cleaner/) | Clean all cells with backtracking |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Word Search II** | [Link](https://leetcode.com/problems/word-search-ii/) | Find multiple words using Trie + DFS |

---

## Video Tutorial Links

1. [NeetCode - Word Search](https://www.youtube.com/watch?v=pfiQ_PS1g8E) - Comprehensive backtracking explanation
2. [Backtracking Algorithms - Abdul Bari](https://www.youtube.com/watch?v=DKCbsiDBN6c) - General backtracking concepts
3. [Word Search - Backtracking](https://www.youtube.com/watch?v=asBCeb4iC3c) - Step-by-step walkthrough
4. [Grid DFS Pattern - Coding Interview](https://www.youtube.com/watch?v=ErKP8_Ard3Q) - Grid traversal fundamentals

---

## Summary

### Key Takeaways

1. **Backtracking requires state restoration** - Always restore the grid/visited set after exploring a path
2. **Mark visited during exploration** - Prevent cycles by marking cells as visited when entering
3. **Start from every cell** - The target word/path can begin anywhere in the grid
4. **Early termination saves time** - Return immediately when the word is found
5. **Four directions are standard** - Up, down, left, right (no diagonals unless specified)

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Not restoring grid state** | Always set `board[r][c] = temp` after exploration |
| **Missing boundary checks** | Check `r < 0 \|\| r >= rows` etc. before accessing |
| **Not checking character match** | Verify `board[r][c] == word[index]` before recursing |
| **Infinite recursion** | Mark visited before exploring, unmark after |
| **Forgetting to check all starts** | Loop through all cells as potential starting points |

### Follow-up Questions

**Q1: How would you optimize for finding multiple words in the same grid?**

Use a **Trie (Prefix Tree)** to store all target words. During DFS, prune branches where the current prefix doesn't match any word in the trie. See [Word Search II](https://leetcode.com/problems/word-search-ii/).

**Q2: Can you solve this iteratively instead of recursively?**

Yes, using an explicit stack, but recursion is more natural for backtracking. The iterative approach requires manually managing the state stack.

**Q3: How do you handle grids with obstacles?**

Add an additional check for obstacle cells - treat them like out-of-bounds or mismatched characters.

**Q4: What's the time complexity improvement with Trie optimization?**

With Trie, you can prune paths early when no word has the current prefix. Worst case remains O(m × n × 4^L), but average case improves significantly.

---

## Pattern Source

For more backtracking pattern implementations, see:
- **[Backtracking - Combination Sum](/patterns/backtracking-combination-sum)**
- **[Backtracking - Permutations](/patterns/backtracking-permutations)**
- **[Backtracking - N-Queens](/patterns/backtracking-n-queens-constraint-satisfaction)**
- **[Backtracking - Subsets](/patterns/backtracking-subsets-include-exclude)**

---

## Additional Resources

- [LeetCode Word Search](https://leetcode.com/problems/word-search/)
- [GeeksforGeeks Word Search](https://www.geeksforgeeks.org/word-search/)
- [Backtracking Algorithms Guide](https://www.geeksforgeeks.org/backtracking-algorithms/)
