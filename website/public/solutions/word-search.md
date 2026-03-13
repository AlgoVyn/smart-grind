# Word Search

## Problem Description

Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.

## Examples

**Example 1:**

**Input:**
```
board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
```

**Output:**
```
true
```

**Example 2:**

**Input:**
```
board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
```

**Output:**
```
true
```

**Example 3:**

**Input:**
```
board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"
```

**Output:**
```
false
```

## Constraints

- `m == board.length`
- `n = board[i].length`
- `1 <= m, n <= 6`
- `1 <= word.length <= 15`
- `board` and `word` consists of only lowercase and uppercase English letters.

### Follow up

Could you use search pruning to make your solution faster with a larger board?

---

## Pattern:

This problem follows the **Depth-First Search (DFS) with Backtracking** pattern on grids.

### Core Concept

- **DFS Exploration**: Explore all possible paths from each starting cell
- **Backtracking**: Restore cell state after exploring each path
- **State Tracking**: Mark cells as visited during traversal

### When to Use This Pattern

This pattern is applicable when:
1. Finding paths in a grid/matrix
2. Problems requiring exploration of all possibilities
3. Word search and maze solving problems

### Related Patterns

| Pattern | Description |
|---------|-------------|
| BFS | Alternative for shortest path |
| Backtracking | State restoration |
| Trie | For multiple word search |

---

## Intuition

This problem is about finding a path in a 2D grid that spells out a given word. The key challenge is that we cannot reuse cells, which requires careful tracking.

### Key Insights

1. **Depth-First Search (DFS)**: We explore each cell and try to match the word character by character, moving to adjacent cells.

2. **Backtracking**: After exploring a path, we need to "unvisit" cells so they can be used in other paths.

3. **Starting Points**: We must try starting from every cell that matches the first letter of the word.

4. **Early Termination**: If the current path length equals the word length, we've found the word.

5. **Pruning**: If the current character doesn't match, we can immediately backtrack.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **DFS with Backtracking** - Standard O(m×n×4^L) solution
2. **DFS with Visited Set** - Using explicit visited tracking
3. **Optimized DFS with Early Pruning** - With letter frequency check

---

## Approach 1: DFS with Backtracking (Standard)

This is the most common and efficient approach for this problem.

### Algorithm Steps

1. Iterate through each cell in the board.
2. If the cell's letter matches the first character of the word, start DFS.
3. In the DFS function:
   - Base cases: if we've matched all characters, return true.
   - Check boundaries and if cell matches current character.
   - Temporarily mark the cell as visited (use a placeholder like '#').
   - Recursively explore all four directions (up, down, left, right).
   - Backtrack by restoring the original character.
4. Return false if no path is found.

### Why It Works

DFS explores all possible paths from each starting point. By marking cells as visited during the path exploration and backtracking (restoring them after), we ensure each cell is used at most once per path.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        """
        Find if word exists in board using DFS with backtracking.
        
        Args:
            board: 2D grid of characters
            word: Target word to find
            
        Returns:
            True if word exists, False otherwise
        """
        if not board or not board[0]:
            return False
        
        m, n = len(board), len(board[0])
        
        def dfs(i: int, j: int, k: int) -> bool:
            """
            DFS function to explore from cell (i, j) for word[k:].
            
            Args:
                i: Row index
                j: Column index  
                k: Index of next character to match in word
                
            Returns:
                True if word can be formed from this cell
            """
            # Base case: all characters matched
            if k == len(word):
                return True
            
            # Check boundaries and character match
            if i < 0 or i >= m or j < 0 or j >= n:
                return False
            if board[i][j] != word[k]:
                return False
            
            # Mark as visited by temporarily changing the character
            temp = board[i][j]
            board[i][j] = '#'
            
            # Explore all four directions
            found = (dfs(i + 1, j, k + 1) or
                     dfs(i - 1, j, k + 1) or
                     dfs(i, j + 1, k + 1) or
                     dfs(i, j - 1, k + 1))
            
            # Backtrack: restore the original character
            board[i][j] = temp
            
            return found
        
        # Try starting from each cell that matches the first character
        for i in range(m):
            for j in range(n):
                if board[i][j] == word[0]:
                    if dfs(i, j, 0):
                        return True
        
        return False
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
using namespace std;

class Solution {
private:
    int m, n;
    string word;
    
    bool dfs(vector<vector<char>>& board, int i, int j, int k) {
        // Base case: all characters matched
        if (k == word.length()) {
            return true;
        }
        
        // Check boundaries and character match
        if (i < 0 || i >= m || j < 0 || j >= n) {
            return false;
        }
        if (board[i][j] != word[k]) {
            return false;
        }
        
        // Mark as visited
        char temp = board[i][j];
        board[i][j] = '#';
        
        // Explore all four directions
        bool found = dfs(board, i + 1, j, k + 1) ||
                     dfs(board, i - 1, j, k + 1) ||
                     dfs(board, i, j + 1, k + 1) ||
                     dfs(board, i, j - 1, k + 1);
        
        // Backtrack
        board[i][j] = temp;
        
        return found;
    }
    
public:
    bool exist(vector<vector<char>>& board, string word) {
        if (board.empty() || board[0].empty()) {
            return false;
        }
        
        this->word = word;
        m = board.size();
        n = board[0].size();
        
        // Try starting from each cell
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == word[0]) {
                    if (dfs(board, i, j, 0)) {
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
    private int m, n;
    private String word;
    
    private boolean dfs(char[][] board, int i, int j, int k) {
        // Base case: all characters matched
        if (k == word.length()) {
            return true;
        }
        
        // Check boundaries and character match
        if (i < 0 || i >= m || j < 0 || j >= n) {
            return false;
        }
        if (board[i][j] != word.charAt(k)) {
            return false;
        }
        
        // Mark as visited
        char temp = board[i][j];
        board[i][j] = '#';
        
        // Explore all four directions
        boolean found = dfs(board, i + 1, j, k + 1) ||
                        dfs(board, i - 1, j, k + 1) ||
                        dfs(board, i, j + 1, k + 1) ||
                        dfs(board, i, j - 1, k + 1);
        
        // Backtrack
        board[i][j] = temp;
        
        return found;
    }
    
    public boolean exist(char[][] board, String word) {
        if (board == null || board.length == 0) {
            return false;
        }
        
        this.word = word;
        m = board.length;
        n = board[0].length;
        
        // Try starting from each cell
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == word.charAt(0)) {
                    if (dfs(board, i, j, 0)) {
                        return true;
                    }
                }
            }
        }
        
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
    if (!board || board.length === 0) {
        return false;
    }
    
    const m = board.length;
    const n = board[0].length;
    
    const dfs = (i, j, k) => {
        // Base case: all characters matched
        if (k === word.length) {
            return true;
        }
        
        // Check boundaries and character match
        if (i < 0 || i >= m || j < 0 || j >= n) {
            return false;
        }
        if (board[i][j] !== word[k]) {
            return false;
        }
        
        // Mark as visited
        const temp = board[i][j];
        board[i][j] = '#';
        
        // Explore all four directions
        const found = dfs(i + 1, j, k + 1) ||
                      dfs(i - 1, j, k + 1) ||
                      dfs(i, j + 1, k + 1) ||
                      dfs(i, j - 1, k + 1);
        
        // Backtrack
        board[i][j] = temp;
        
        return found;
    };
    
    // Try starting from each cell
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] === word[0]) {
                if (dfs(i, j, 0)) {
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
| **Time** | O(m × n × 4^L) where L = word length. In worst case, explore 4^L paths from each cell. |
| **Space** | O(L) for recursion stack - maximum depth equals word length |

---

## Approach 2: DFS with Visited Set

This approach uses an explicit visited set instead of modifying the board.

### Algorithm Steps

1. Use a separate visited boolean matrix.
2. Same DFS logic, but check/update the visited set instead of modifying board.
3. Backtrack by marking the cell as unvisited.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        if not board or not board[0]:
            return False
        
        m, n = len(board), len(board[0])
        visited = [[False] * n for _ in range(m)]
        
        def dfs(i: int, j: int, k: int) -> bool:
            if k == len(word):
                return True
            
            if i < 0 or i >= m or j < 0 or j >= n:
                return False
            if visited[i][j] or board[i][j] != word[k]:
                return False
            
            visited[i][j] = True
            
            found = (dfs(i + 1, j, k + 1) or
                     dfs(i - 1, j, k + 1) or
                     dfs(i, j + 1, k + 1) or
                     dfs(i, j - 1, k + 1))
            
            visited[i][j] = False
            
            return found
        
        for i in range(m):
            for j in range(n):
                if board[i][j] == word[0]:
                    if dfs(i, j, 0):
                        return True
        
        return False
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
using namespace std;

class Solution {
private:
    int m, n;
    string word;
    
    bool dfs(vector<vector<char>>& board, vector<vector<bool>>& visited, 
             int i, int j, int k) {
        if (k == word.length()) return true;
        
        if (i < 0 || i >= m || j < 0 || j >= n) return false;
        if (visited[i][j] || board[i][j] != word[k]) return false;
        
        visited[i][j] = true;
        
        bool found = dfs(board, visited, i + 1, j, k + 1) ||
                     dfs(board, visited, i - 1, j, k + 1) ||
                     dfs(board, visited, i, j + 1, k + 1) ||
                     dfs(board, visited, i, j - 1, k + 1);
        
        visited[i][j] = false;
        
        return found;
    }
    
public:
    bool exist(vector<vector<char>>& board, string word) {
        if (board.empty() || board[0].empty()) return false;
        
        this->word = word;
        m = board.size();
        n = board[0].size();
        vector<vector<bool>> visited(m, vector<bool>(n, false));
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == word[0]) {
                    if (dfs(board, visited, i, j, 0)) return true;
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
    private int m, n;
    private String word;
    
    private boolean dfs(char[][] board, boolean[][] visited, int i, int j, int k) {
        if (k == word.length()) return true;
        
        if (i < 0 || i >= m || j < 0 || j >= n) return false;
        if (visited[i][j] || board[i][j] != word.charAt(k)) return false;
        
        visited[i][j] = true;
        
        boolean found = dfs(board, visited, i + 1, j, k + 1) ||
                        dfs(board, visited, i - 1, j, k + 1) ||
                        dfs(board, visited, i, j + 1, k + 1) ||
                        dfs(board, visited, i, j - 1, k + 1);
        
        visited[i][j] = false;
        
        return found;
    }
    
    public boolean exist(char[][] board, String word) {
        if (board == null || board.length == 0) return false;
        
        this.word = word;
        m = board.length;
        n = board[0].length;
        boolean[][] visited = new boolean[m][n];
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == word.charAt(0)) {
                    if (dfs(board, visited, i, j, 0)) return true;
                }
            }
        }
        
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
    
    const m = board.length;
    const n = board[0].length;
    const visited = Array.from({ length: m }, () => Array(n).fill(false));
    
    const dfs = (i, j, k) => {
        if (k === word.length) return true;
        
        if (i < 0 || i >= m || j < 0 || j >= n) return false;
        if (visited[i][j] || board[i][j] !== word[k]) return false;
        
        visited[i][j] = true;
        
        const found = dfs(i + 1, j, k + 1) ||
                      dfs(i - 1, j, k + 1) ||
                      dfs(i, j + 1, k + 1) ||
                      dfs(i, j - 1, k + 1);
        
        visited[i][j] = false;
        
        return found;
    };
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] === word[0]) {
                if (dfs(i, j, 0)) return true;
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
| **Time** | O(m × n × 4^L) |
| **Space** | O(m × n) for visited + O(L) for recursion |

---

## Approach 3: Optimized DFS with Pruning

This approach adds pruning optimizations for better performance on larger boards.

### Algorithm Steps

1. Count letter frequencies in the word.
2. Count letter frequencies in the board.
3. If any letter in the word appears more times in the word than in the board, return false immediately.
4. Then proceed with standard DFS.

### Code Implementation

````carousel
```python
from typing import List
from collections import Counter

class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        if not board or not board[0]:
            return False
        
        m, n = len(board), len(board[0])
        
        # Pruning: check letter frequency
        word_count = Counter(word)
        board_count = Counter()
        
        for row in board:
            for char in row:
                board_count[char] += 1
        
        for char, count in word_count.items():
            if board_count[char] < count:
                return False
        
        def dfs(i: int, j: int, k: int) -> bool:
            if k == len(word):
                return True
            
            if i < 0 or i >= m or j < 0 or j >= n:
                return False
            if board[i][j] != word[k]:
                return False
            
            temp = board[i][j]
            board[i][j] = '#'
            
            found = (dfs(i + 1, j, k + 1) or
                     dfs(i - 1, j, k + 1) or
                     dfs(i, j + 1, k + 1) or
                     dfs(i, j - 1, k + 1))
            
            board[i][j] = temp
            
            return found
        
        for i in range(m):
            for j in range(n):
                if board[i][j] == word[0]:
                    if dfs(i, j, 0):
                        return True
        
        return False
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_map>
using namespace std;

class Solution {
private:
    int m, n;
    string word;
    
    bool dfs(vector<vector<char>>& board, int i, int j, int k) {
        if (k == word.length()) return true;
        
        if (i < 0 || i >= m || j < 0 || j >= n) return false;
        if (board[i][j] != word[k]) return false;
        
        char temp = board[i][j];
        board[i][j] = '#';
        
        bool found = dfs(board, i + 1, j, k + 1) ||
                     dfs(board, i - 1, j, k + 1) ||
                     dfs(board, i, j + 1, k + 1) ||
                     dfs(board, i, j - 1, k + 1);
        
        board[i][j] = temp;
        
        return found;
    }
    
public:
    bool exist(vector<vector<char>>& board, string word) {
        if (board.empty() || board[0].empty()) return false;
        
        this->word = word;
        m = board.size();
        n = board[0].size();
        
        // Pruning: check letter frequency
        unordered_map<char, int> wordCount, boardCount;
        for (char c : word) wordCount[c]++;
        for (const auto& row : board) {
            for (char c : row) boardCount[c]++;
        }
        for (const auto& pair : wordCount) {
            if (boardCount[pair.first] < pair.second) return false;
        }
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == word[0]) {
                    if (dfs(board, i, j, 0)) return true;
                }
            }
        }
        
        return false;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    private int m, n;
    private String word;
    
    private boolean dfs(char[][] board, int i, int j, int k) {
        if (k == word.length()) return true;
        
        if (i < 0 || i >= m || j < 0 || j >= n) return false;
        if (board[i][j] != word.charAt(k)) return false;
        
        char temp = board[i][j];
        board[i][j] = '#';
        
        boolean found = dfs(board, i + 1, j, k + 1) ||
                        dfs(board, i - 1, j, k + 1) ||
                        dfs(board, i, j + 1, k + 1) ||
                        dfs(board, i, j - 1, k + 1);
        
        board[i][j] = temp;
        
        return found;
    }
    
    public boolean exist(char[][] board, String word) {
        if (board == null || board.length == 0) return false;
        
        this.word = word;
        m = board.length;
        n = board[0].length;
        
        // Pruning: check letter frequency
        Map<Character, Integer> wordCount = new HashMap<>();
        Map<Character, Integer> boardCount = new HashMap<>();
        
        for (char c : word.toCharArray()) {
            wordCount.put(c, wordCount.getOrDefault(c, 0) + 1);
        }
        
        for (char[] row : board) {
            for (char c : row) {
                boardCount.put(c, boardCount.getOrDefault(c, 0) + 1);
            }
        }
        
        for (char c : wordCount.keySet()) {
            if (boardCount.getOrDefault(c, 0) < wordCount.get(c)) {
                return false;
            }
        }
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == word.charAt(0)) {
                    if (dfs(board, i, j, 0)) return true;
                }
            }
        }
        
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
    
    const m = board.length;
    const n = board[0].length;
    
    // Pruning: check letter frequency
    const wordCount = {};
    const boardCount = {};
    
    for (const char of word) {
        wordCount[char] = (wordCount[char] || 0) + 1;
    }
    for (const row of board) {
        for (const char of row) {
            boardCount[char] = (boardCount[char] || 0) + 1;
        }
    }
    for (const char in wordCount) {
        if ((boardCount[char] || 0) < wordCount[char]) {
            return false;
        }
    }
    
    const dfs = (i, j, k) => {
        if (k === word.length) return true;
        
        if (i < 0 || i >= m || j < 0 || j >= n) return false;
        if (board[i][j] !== word[k]) return false;
        
        const temp = board[i][j];
        board[i][j] = '#';
        
        const found = dfs(i + 1, j, k + 1) ||
                      dfs(i - 1, j, k + 1) ||
                      dfs(i, j + 1, k + 1) ||
                      dfs(i, j - 1, k + 1);
        
        board[i][j] = temp;
        
        return found;
    };
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] === word[0]) {
                if (dfs(i, j, 0)) return true;
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
| **Time** | O(m × n × 4^L) with early termination for impossible cases |
| **Space** | O(L) for recursion stack |

---

## Comparison of Approaches

| Aspect | Backtracking | Visited Set | Optimized + Pruning |
|--------|--------------|-------------|---------------------|
| **Time Complexity** | O(m×n×4^L) | O(m×n×4^L) | O(m×n×4^L) + pruning |
| **Space Complexity** | O(1)* | O(m×n) + O(L) | O(1)* + pruning |
| **Modifies Input** | Yes (temp) | No | Yes (temp) |
| **Pruning** | None | None | Yes |

*Note: The backtracking approach modifies the board temporarily but restores it, so it's effectively O(1) extra space.

---

## Why This Problem is Important

### Interview Relevance
- **Frequency**: Very frequently asked in technical interviews
- **Companies**: Google, Amazon, Meta, Apple, Microsoft
- **Difficulty**: Medium to Hard
- **Concepts**: DFS, backtracking, graph traversal

### Key Learnings
1. **DFS on grids**: Understanding how to traverse 2D structures
2. **Backtracking**: Proper state restoration after exploration
3. **Pruning**: Early termination to improve performance
4. **Boundary checking**: Avoiding index out of bounds errors

---

## Related Problems

### Same Pattern (Grid DFS)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Word Search | [Link](https://leetcode.com/problems/word-search/) | Medium | This problem |
| Word Search II | [Link](https://leetcode.com/problems/word-search-ii/) | Hard | Find all words in board |
| Number of Islands | [Link](https://leetcode.com/problems/number-of-islands/) | Medium | Count connected components |
| Flood Fill | [Link](https://leetcode.com/problems/flood-fill/) | Easy | DFS image fill |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Surrounded Regions | [Link](https://leetcode.com/problems/surrounded-regions/) | Medium | BFS/DFS |
| Max Area of Island | [Link](https://leetcode.com/problems/max-area-of-island/) | Medium | DFS counting |
| Pacific Atlantic Water | [Link](https://leetcode.com/problems/pacific-atlantic-water-flow/) | Medium | Multi-source DFS |

---

## Video Tutorial Links

### DFS and Backtracking

1. **[Word Search - NeetCode](https://www.youtube.com/watch?v=asfR9sR3zSs)** - Clear explanation with visual examples
2. **[LeetCode 79 - Word Search](https://www.youtube.com/watch?v=4CJbtcNltvw)** - Detailed walkthrough
3. **[Backtracking Pattern](https://www.youtube.com/watch?v=1nYbFqgXjBk)** - Understanding backtracking

### Related Concepts

- **[DFS on Grid](https://www.youtube.com/watch?v=V1vP5xcyX3Q)** - Grid traversal
- **[Graph Traversal](https://www.youtube.com/watch?v=8fItF8f3y_k)** - BFS vs DFS

---

## Follow-up Questions

### Q1: How would you modify to find all words from a list in the board?

**Answer:** Build a Trie from the word list and modify DFS to traverse the Trie. This is the Word Search II problem.

---

### Q2: What if diagonal movements are also allowed?

**Answer:** Add four more DFS calls for diagonal directions: (i+1, j+1), (i+1, j-1), (i-1, j+1), (i-1, j-1).

---

### Q3: How would you handle multiple occurrences of the same starting letter?

**Answer:** The current solution already tries all cells with matching first character. The optimization is to return true as soon as one valid path is found.

---

### Q4: Can you use BFS instead of DFS?

**Answer:** BFS can work but is less natural for this problem because we'd need to track paths rather than just existence. DFS is more straightforward.

---

### Q5: How would you optimize for very large boards?

**Answer:** Use the pruning optimization (Approach 3) to quickly reject impossible cases. Also consider using a Trie for the word when searching for multiple words.

---

### Q6: What is the maximum recursion depth?

**Answer:** The recursion depth equals the word length. Since word length ≤ 15 (per constraints), recursion depth is safe.

---

### Q7: What edge cases should you test?

**Answer:**
- Empty board → return false
- Empty word → return true (trivially exists)
- Word longer than total cells → return false
- Word with letter not in board → return false
- Single cell board matching single letter word
- Multiple paths possible
- Word that can't be formed (blocked by visited cells)

---

### Q8: How does this relate to finding paths in a maze?

**Answer:** This is essentially a maze path-finding problem where walls are visited cells. The same DFS/backtracking pattern applies.

---

### Q9: Can you use iterative DFS instead of recursive?

**Answer:** Yes, use an explicit stack. However, recursive DFS is cleaner and more intuitive for this problem.

---

### Q10: How would you modify to allow reusing cells after forming one word when searching multiple words?

**Answer:** After successfully finding a word, don't backtrack (keep cells marked as visited). This allows cells to be used once per "session" of finding all words.

---

## Common Pitfalls

### 1. Forgetting to Restore Cells
**Issue**: Cells remain marked as visited after returning false.

**Solution**: Always backtrack (restore the original character) after DFS exploration.

### 2. Wrong Base Case Order
**Issue**: Checking boundaries after checking character match can cause errors.

**Solution**: Check boundaries first, then check character match.

### 3. Not Trying All Starting Points
**Issue**: Only trying from the first matching cell.

**Solution**: Iterate through all cells and start DFS from each cell matching the first character.

### 4. Modifying Board Without Copy
**Issue**: In-place modification affecting other searches.

**Solution:** The backtracking approach restores cells, so this isn't an issue. If using a visited set, you won't modify the board at all.

---

## Summary

The **Word Search** problem demonstrates classic **DFS with backtracking**:

- **DFS exploration**: Try all possible paths from each starting point
- **Backtracking**: Restore state after exploring each path
- **Early termination**: Return true as soon as word is found
- **Pruning**: Use letter frequency to reject impossible cases

Key insights:
1. Each cell can be used at most once per path
2. Marking cells as visited and restoring is crucial
3. Try all starting positions that match the first letter
4. Use pruning for better performance on larger inputs

This pattern extends to:
- Word Search II (multiple words)
- Number of Islands
- Flood Fill
- Any grid path-finding problem
