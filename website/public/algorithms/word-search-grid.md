# Word Search Grid

## Category
Backtracking

## Description

The **Word Search Grid** algorithm solves the problem of finding whether a word exists in a 2D grid of characters. The word can be constructed from letters of sequentially adjacent cells, where "adjacent" cells are those horizontally or vertically neighboring. The same letter cell may not be used more than once in a single word.

This classic backtracking problem demonstrates the power of Depth-First Search (DFS) combined with careful state management to explore all possible paths through a grid.

---

## When to Use

Use the Word Search algorithm when you need to solve problems involving:

- **Grid Path Finding**: Finding specific sequences in 2D character grids
- **Pattern Matching in 2D**: Searching for words or patterns in matrices
- **Backtracking Exploration**: Problems requiring exhaustive search with constraints
- **Board Games**: Word-based puzzles like Boggle, Scrabble variants
- **Constraint Satisfaction**: Problems with "no revisit" constraints

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|----------------|------------------|----------|
| **DFS Backtracking** | O(M × N × 4^L) | O(L) | Single word search, grid traversal |
| **DFS + Trie** | O(M × N × 4^L) | O(L + K) | Multiple words, dictionary-based |
| **BFS** | O(M × N × 4^L) | O(M × N) | Shortest path, level-order exploration |
| **Dynamic Programming** | O(M × N × L) | O(M × N × L) | Count paths, not existence |

### When to Choose Which Approach

- **Choose DFS Backtracking** when:
  - Searching for a single word
  - Need to find existence (not count paths)
  - Memory is limited
  
- **Choose DFS + Trie** when:
  - Searching for multiple words simultaneously
  - Have a dictionary of words to find
  - Need to find all matching words (like Word Search II)

- **Choose BFS** when:
  - Need shortest path to construct word
  - Want level-by-level exploration
  - Not concerned with path reconstruction

---

## Algorithm Explanation

### Core Concept

The Word Search algorithm uses **Depth-First Search with Backtracking** to explore all possible paths through the grid:

1. **Start from every cell**: The word could begin anywhere in the grid
2. **DFS Exploration**: From each starting position, recursively explore all 4 directions
3. **State Management**: Mark cells as visited to prevent reuse, then unmark (backtrack) when returning
4. **Early Termination**: Stop as soon as the word is found

### How It Works

#### Search Phase:
- Iterate through each cell in the grid as a potential starting point
- For each cell matching the first character of the word, begin DFS

#### DFS Phase:
At each step with current position `(r, c)` and word index `i`:
1. **Base Case**: If `i == len(word)`, all characters matched → return True
2. **Boundary Check**: Ensure `(r, c)` is within grid bounds
3. **Character Match**: Check if `grid[r][c] == word[i]`
4. **Mark Visited**: Temporarily modify cell to prevent revisiting
5. **Explore Neighbors**: Recursively check all 4 adjacent cells with `i + 1`
6. **Backtrack**: Restore original cell value
7. **Return Result**: True if any neighbor path succeeds

### Visual Representation

For grid `[['A','B','C'],['S','F','C'],['A','D','E']]` and word "ABCCED":

```
Step 1: Start at A(0,0) - matches 'A'
    A → B → C
    S   F   C
    A   D   E

Step 2: From B(0,1) - matches 'B'
    A → B → C
    S   F   C
    A   D   E

Step 3: From C(0,2) - matches 'C'
    A → B → C
    S   F   C
    A   D   E

Step 4: From C(1,2) - matches 'C'
    A → B → C
    S   F ↓ C
    A   D   E

Step 5: From E(2,2) - matches 'E'
    A → B → C
    S   F   C
    A   D ← E

Step 6: From D(2,1) - matches 'D'
    A → B → C
    S   F   C
    A → D ← E

Word found! Path: A→B→C→C→E→D
```

### Key Optimizations

1. **In-place marking**: Instead of a separate visited set, temporarily change the cell to a sentinel value (e.g., `None` or `'#'`)
2. **Early termination**: If the first character doesn't match, skip immediately
3. **Word length check**: If word is longer than total cells, return False immediately
4. **Pruning**: Count character frequencies to eliminate impossible searches early

---

## Algorithm Steps

### Searching for a Single Word

1. **Validate input**: Check for empty grid or empty word
2. **Iterate start positions**: For each cell in the grid
3. **Check first character**: Skip if it doesn't match word[0]
4. **Execute DFS**: Call recursive helper with position and index 0
5. **Return result**: True if any starting position yields a match

### DFS Helper Function

1. **Check completion**: If index equals word length, return True
2. **Validate position**: Check bounds and character match
3. **Mark visited**: Save current character, set cell to sentinel
4. **Explore directions**: For each of 4 neighbors (up, down, left, right)
   - Recursively call DFS with neighbor position and index + 1
   - If recursive call returns True, propagate True up
5. **Backtrack**: Restore original character to cell
6. **Return False**: No valid path found from this position

---

## Implementation

### Template Code (Word Search with Backtracking)

````carousel
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
    
    Time Complexity: O(M * N * 4^L) where M,N = grid dimensions, L = word length
    Space Complexity: O(L) for recursion stack
    """
    if not board or not board[0] or not word:
        return False
    
    rows, cols = len(board), len(board[0])
    
    def dfs(r: int, c: int, index: int) -> bool:
        # Base case: all characters matched
        if index == len(word):
            return True
        
        # Boundary and character check
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            board[r][c] != word[index]):
            return False
        
        # Mark as visited (temporarily change to None)
        temp = board[r][c]
        board[r][c] = None
        
        # Explore all 4 directions
        found = (dfs(r + 1, c, index + 1) or  # Down
                 dfs(r - 1, c, index + 1) or  # Up
                 dfs(r, c + 1, index + 1) or  # Right
                 dfs(r, c - 1, index + 1))    # Left
        
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


def exist_with_pruning(board: List[List[str]], word: str) -> bool:
    """
    Optimized version with frequency pruning.
    """
    if not board or not board[0] or not word:
        return False
    
    rows, cols = len(board), len(board[0])
    
    # Pruning: count characters
    from collections import Counter
    board_count = Counter()
    for row in board:
        board_count.update(row)
    
    word_count = Counter(word)
    for char, count in word_count.items():
        if board_count[char] < count:
            return False
    
    # Try starting from each matching cell
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0]:
                if dfs_optimized(board, word, r, c, 0):
                    return True
    return False


def dfs_optimized(board, word, r, c, index):
    """Helper for optimized version."""
    if index == len(word):
        return True
    
    if (r < 0 or r >= len(board) or c < 0 or c >= len(board[0]) or
        board[r][c] != word[index]):
        return False
    
    temp = board[r][c]
    board[r][c] = '#'
    
    found = (dfs_optimized(board, word, r+1, c, index+1) or
             dfs_optimized(board, word, r-1, c, index+1) or
             dfs_optimized(board, word, r, c+1, index+1) or
             dfs_optimized(board, word, r, c-1, index+1))
    
    board[r][c] = temp
    return found


# Example usage
if __name__ == "__main__":
    board = [
        ['A', 'B', 'C', 'E'],
        ['S', 'F', 'C', 'S'],
        ['A', 'D', 'E', 'E']
    ]
    
    test_cases = ["ABCCED", "SEE", "ABCB", "ASF"]
    
    print("Grid:")
    for row in board:
        print(row)
    print()
    
    for word in test_cases:
        result = exist(board, word)
        print(f"Word '{word}': {result}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

/**
 * Word Search using DFS with backtracking.
 * 
 * Time Complexity: O(M * N * 4^L)
 * Space Complexity: O(L) for recursion stack
 */
class WordSearch {
public:
    bool exist(vector<vector<char>>& board, string word) {
        if (board.empty() || board[0].empty() || word.empty()) {
            return false;
        }
        
        rows = board.size();
        cols = board[0].size();
        
        // Try starting from each cell
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (board[r][c] == word[0]) {
                    if (dfs(board, word, r, c, 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

private:
    int rows, cols;
    // Direction vectors: down, up, right, left
    const int dr[4] = {1, -1, 0, 0};
    const int dc[4] = {0, 0, 1, -1};
    
    bool dfs(vector<vector<char>>& board, const string& word, 
             int r, int c, int index) {
        // Base case: all characters matched
        if (index == word.length()) {
            return true;
        }
        
        // Boundary and character check
        if (r < 0 || r >= rows || c < 0 || c >= cols ||
            board[r][c] != word[index]) {
            return false;
        }
        
        // Mark as visited
        char temp = board[r][c];
        board[r][c] = '#';
        
        // Explore all 4 directions
        bool found = false;
        for (int i = 0; i < 4; i++) {
            if (dfs(board, word, r + dr[i], c + dc[i], index + 1)) {
                found = true;
                break;
            }
        }
        
        // Backtrack
        board[r][c] = temp;
        
        return found;
    }
};

// Alternative: Using lambda (C++11 and later)
class WordSearchLambda {
public:
    bool exist(vector<vector<char>>& board, string word) {
        if (board.empty() || board[0].empty() || word.empty()) {
            return false;
        }
        
        int rows = board.size();
        int cols = board[0].size();
        
        function<bool(int, int, int)> dfs = [&](int r, int c, int index) -> bool {
            if (index == word.length()) return true;
            if (r < 0 || r >= rows || c < 0 || c >= cols || 
                board[r][c] != word[index]) return false;
            
            char temp = board[r][c];
            board[r][c] = '#';
            
            bool found = dfs(r + 1, c, index + 1) ||
                        dfs(r - 1, c, index + 1) ||
                        dfs(r, c + 1, index + 1) ||
                        dfs(r, c - 1, index + 1);
            
            board[r][c] = temp;
            return found;
        };
        
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (board[r][c] == word[0] && dfs(r, c, 0)) {
                    return true;
                }
            }
        }
        return false;
    }
};


int main() {
    vector<vector<char>> board = {
        {'A', 'B', 'C', 'E'},
        {'S', 'F', 'C', 'S'},
        {'A', 'D', 'E', 'E'}
    };
    
    vector<string> testCases = {"ABCCED", "SEE", "ABCB", "ASF"};
    
    WordSearch solution;
    
    cout << "Grid:" << endl;
    for (const auto& row : board) {
        for (char c : row) {
            cout << c << " ";
        }
        cout << endl;
    }
    cout << endl;
    
    for (const string& word : testCases) {
        cout << "Word '" << word << "': " 
             << (solution.exist(board, word) ? "true" : "false") << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * Word Search using DFS with backtracking.
 * 
 * Time Complexity: O(M * N * 4^L)
 * Space Complexity: O(L) for recursion stack
 */
public class WordSearch {
    
    public boolean exist(char[][] board, String word) {
        if (board == null || board.length == 0 || word == null || word.isEmpty()) {
            return false;
        }
        
        int rows = board.length;
        int cols = board[0].length;
        
        // Try starting from each cell
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (board[r][c] == word.charAt(0)) {
                    if (dfs(board, word, r, c, 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    private boolean dfs(char[][] board, String word, int r, int c, int index) {
        // Base case: all characters matched
        if (index == word.length()) {
            return true;
        }
        
        // Boundary and character check
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length ||
            board[r][c] != word.charAt(index)) {
            return false;
        }
        
        // Mark as visited
        char temp = board[r][c];
        board[r][c] = '#';
        
        // Explore all 4 directions
        boolean found = dfs(board, word, r + 1, c, index + 1) ||  // Down
                       dfs(board, word, r - 1, c, index + 1) ||  // Up
                       dfs(board, word, r, c + 1, index + 1) ||  // Right
                       dfs(board, word, r, c - 1, index + 1);    // Left
        
        // Backtrack
        board[r][c] = temp;
        
        return found;
    }
    
    // Optimized version with pruning
    public boolean existOptimized(char[][] board, String word) {
        if (board == null || board.length == 0 || word == null || word.isEmpty()) {
            return false;
        }
        
        int rows = board.length;
        int cols = board[0].length;
        
        // Frequency pruning
        int[] boardCount = new int[128];
        int[] wordCount = new int[128];
        
        for (char[] row : board) {
            for (char c : row) {
                boardCount[c]++;
            }
        }
        
        for (char c : word.toCharArray()) {
            wordCount[c]++;
            if (wordCount[c] > boardCount[c]) {
                return false;
            }
        }
        
        // Try each starting position
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (board[r][c] == word.charAt(0)) {
                    if (dfs(board, word, r, c, 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    public static void main(String[] args) {
        char[][] board = {
            {'A', 'B', 'C', 'E'},
            {'S', 'F', 'C', 'S'},
            {'A', 'D', 'E', 'E'}
        };
        
        String[] testCases = {"ABCCED", "SEE", "ABCB", "ASF"};
        
        WordSearch solution = new WordSearch();
        
        System.out.println("Grid:");
        for (char[] row : board) {
            for (char c : row) {
                System.out.print(c + " ");
            }
            System.out.println();
        }
        System.out.println();
        
        for (String word : testCases) {
            System.out.println("Word '" + word + "': " + solution.exist(board, word));
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Word Search using DFS with backtracking.
 * 
 * Time Complexity: O(M * N * 4^L)
 * Space Complexity: O(L) for recursion stack
 */
function exist(board, word) {
    if (!board || !board.length || !board[0].length || !word) {
        return false;
    }
    
    const rows = board.length;
    const cols = board[0].length;
    
    /**
     * DFS helper function
     * @param {number} r - Current row
     * @param {number} c - Current column
     * @param {number} index - Current index in word
     * @returns {boolean} - True if word found
     */
    function dfs(r, c, index) {
        // Base case: all characters matched
        if (index === word.length) {
            return true;
        }
        
        // Boundary and character check
        if (r < 0 || r >= rows || c < 0 || c >= cols ||
            board[r][c] !== word[index]) {
            return false;
        }
        
        // Mark as visited
        const temp = board[r][c];
        board[r][c] = '#';
        
        // Explore all 4 directions
        const found = dfs(r + 1, c, index + 1) ||  // Down
                     dfs(r - 1, c, index + 1) ||  // Up
                     dfs(r, c + 1, index + 1) ||  // Right
                     dfs(r, c - 1, index + 1);    // Left
        
        // Backtrack
        board[r][c] = temp;
        
        return found;
    }
    
    // Try starting from each cell
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === word[0]) {
                if (dfs(r, c, 0)) {
                    return true;
                }
            }
        }
    }
    
    return false;
}


// Optimized version with frequency pruning
function existOptimized(board, word) {
    if (!board || !board.length || !board[0].length || !word) {
        return false;
    }
    
    const rows = board.length;
    const cols = board[0].length;
    
    // Frequency pruning
    const boardCount = {};
    const wordCount = {};
    
    for (const row of board) {
        for (const char of row) {
            boardCount[char] = (boardCount[char] || 0) + 1;
        }
    }
    
    for (const char of word) {
        wordCount[char] = (wordCount[char] || 0) + 1;
        if ((wordCount[char] || 0) > (boardCount[char] || 0)) {
            return false;
        }
    }
    
    function dfs(r, c, index) {
        if (index === word.length) return true;
        if (r < 0 || r >= rows || c < 0 || c >= cols ||
            board[r][c] !== word[index]) return false;
        
        const temp = board[r][c];
        board[r][c] = '#';
        
        const found = dfs(r + 1, c, index + 1) ||
                     dfs(r - 1, c, index + 1) ||
                     dfs(r, c + 1, index + 1) ||
                     dfs(r, c - 1, index + 1);
        
        board[r][c] = temp;
        return found;
    }
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === word[0] && dfs(r, c, 0)) {
                return true;
            }
        }
    }
    return false;
}


// Example usage
const board = [
    ['A', 'B', 'C', 'E'],
    ['S', 'F', 'C', 'S'],
    ['A', 'D', 'E', 'E']
];

const testCases = ["ABCCED", "SEE", "ABCB", "ASF"];

console.log("Grid:");
board.forEach(row => console.log(row.join(' ')));
console.log();

testCases.forEach(word => {
    console.log(`Word '${word}': ${exist(board, word)}`);
});

// Test with board copy (since we modify in-place)
function testExist(board, word) {
    const boardCopy = board.map(row => [...row]);
    return exist(boardCopy, word);
}
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Worst Case Search** | O(M × N × 4^L) | M,N = grid dimensions, L = word length |
| **Best Case** | O(1) | First character not found in grid |
| **Average Case** | O(M × N × 4^L) | Typical backtracking complexity |
| **Early Termination** | O(k) | Found at k-th starting position |

### Detailed Breakdown

- **Outer loop**: Iterate through all M × N cells → O(M × N)
- **DFS from each cell**: 
  - At each position, explore 4 directions
  - Maximum depth = word length L
  - Worst case: 4 branches at each level → 4^L possibilities
- **Total**: O(M × N × 4^L)

### Practical Considerations

- The 4^L factor is worst-case; backtracking prunes many paths early
- For short words (L ≤ 10), runs efficiently
- For long words, frequency pruning helps eliminate impossible cases

---

## Space Complexity Analysis

| Component | Space Complexity | Description |
|-----------|-----------------|-------------|
| **Recursion Stack** | O(L) | Maximum depth = word length |
| **Grid Modification** | O(1) | In-place marking, no extra visited set |
| **Total** | O(L) | Dominated by recursion stack |

### Space Optimization Notes

- In-place marking avoids O(M × N) visited array
- Iterative DFS with explicit stack uses O(L) space but more complex
- For very long words, consider iterative approach to avoid stack overflow

---

## Common Variations

### 1. Word Search II (Multiple Words)

When searching for multiple words, use a Trie to avoid redundant searches:

````carousel
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None  # Store complete word at end node

class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        # Build Trie
        root = TrieNode()
        for word in words:
            node = root
            for char in word:
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
            node.word = word
        
        result = []
        rows, cols = len(board), len(board[0])
        
        def dfs(r, c, node):
            char = board[r][c]
            if char not in node.children:
                return
            
            next_node = node.children[char]
            if next_node.word:
                result.append(next_node.word)
                next_node.word = None  # Avoid duplicates
            
            board[r][c] = '#'  # Mark visited
            
            for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                    dfs(nr, nc, next_node)
            
            board[r][c] = char  # Backtrack
            
            # Optimization: Remove leaf nodes
            if not next_node.children:
                del node.children[char]
        
        for r in range(rows):
            for c in range(cols):
                dfs(r, c, root)
        
        return result
```
````

### 2. Diagonal Movement Allowed

If diagonal moves are permitted, expand to 8 directions:

````carousel
```python
def exist_with_diagonal(board, word):
    """Word search allowing diagonal movement."""
    if not board or not board[0] or not word:
        return False
    
    rows, cols = len(board), len(board[0])
    
    # 8 directions: down, up, right, left, and 4 diagonals
    directions = [
        (1, 0), (-1, 0), (0, 1), (0, -1),   # Cardinal
        (1, 1), (1, -1), (-1, 1), (-1, -1)  # Diagonal
    ]
    
    def dfs(r, c, index):
        if index == len(word):
            return True
        if r < 0 or r >= rows or c < 0 or c >= cols or \
           board[r][c] != word[index]:
            return False
        
        temp = board[r][c]
        board[r][c] = '#'
        
        found = False
        for dr, dc in directions:
            if dfs(r + dr, c + dc, index + 1):
                found = True
                break
        
        board[r][c] = temp
        return found
    
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0] and dfs(r, c, 0):
                return True
    return False
```
````

### 3. Count All Paths

Instead of returning early, count all possible ways to form the word:

````carousel
```python
def count_paths(board, word):
    """Count all distinct paths that form the word."""
    if not board or not board[0] or not word:
        return 0
    
    rows, cols = len(board), len(board[0])
    count = 0
    
    def dfs(r, c, index):
        nonlocal count
        
        if index == len(word):
            count += 1
            return
        
        if r < 0 or r >= rows or c < 0 or c >= cols or \
           board[r][c] != word[index]:
            return
        
        temp = board[r][c]
        board[r][c] = '#'
        
        dfs(r + 1, c, index + 1)
        dfs(r - 1, c, index + 1)
        dfs(r, c + 1, index + 1)
        dfs(r, c - 1, index + 1)
        
        board[r][c] = temp
    
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0]:
                dfs(r, c, 0)
    
    return count
```
````

### 4. Word Search with Wildcards

Support wildcard characters (e.g., '.') that match any character:

````carousel
```python
def exist_with_wildcard(board, word):
    """Word search where '.' in word matches any character."""
    if not board or not board[0] or not word:
        return False
    
    rows, cols = len(board), len(board[0])
    
    def matches(board_char, word_char):
        return word_char == '.' or board_char == word_char
    
    def dfs(r, c, index):
        if index == len(word):
            return True
        if r < 0 or r >= rows or c < 0 or c >= cols or \
           not matches(board[r][c], word[index]):
            return False
        
        temp = board[r][c]
        board[r][c] = '#'
        
        found = (dfs(r + 1, c, index + 1) or
                dfs(r - 1, c, index + 1) or
                dfs(r, c + 1, index + 1) or
                dfs(r, c - 1, index + 1))
        
        board[r][c] = temp
        return found
    
    for r in range(rows):
        for c in range(cols):
            if matches(board[r][c], word[0]) and dfs(r, c, 0):
                return True
    return False
```
````

---

## Practice Problems

### Problem 1: Word Search

**Problem:** [LeetCode 79 - Word Search](https://leetcode.com/problems/word-search/)

**Description:** Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.

**How to Apply:** Direct application of DFS backtracking. Start from each cell, explore 4 directions, backtrack when stuck.

**Key Insights:**
- Use in-place marking to avoid O(mn) extra space
- Early termination on first match found
- Character frequency check for pruning

---

### Problem 2: Word Search II

**Problem:** [LeetCode 212 - Word Search II](https://leetcode.com/problems/word-search-ii/)

**Description:** Given an `m x n` `board` of characters and a list of strings `words`, return all words on the board.

**How to Apply:** Combine Word Search with Trie data structure:
- Build Trie from word list for O(L) lookup
- DFS from each cell, traversing Trie simultaneously
- Remove found words from Trie to avoid duplicates

**Key Insights:**
- Trie enables early termination when no prefix matches
- Backtracking prunes Trie branches that lead nowhere
- More efficient than running single word search for each word

---

### Problem 3: Unique Paths III

**Problem:** [LeetCode 980 - Unique Paths III](https://leetcode.com/problems/unique-paths-iii/)

**Description:** On a 2-dimensional `grid`, there are 4 types of squares: starting square, ending square, empty squares, and obstacles. Return the number of 4-directional walks from the starting square to the ending square, that walk over every non-obstacle square exactly once.

**How to Apply:** Similar backtracking approach:
- DFS from starting position
- Track visited cells
- Count paths that visit all empty squares
- Backtrack after each exploration

**Key Insights:**
- Must visit ALL empty squares, not just find any path
- Backtracking essential to explore all possibilities
- Grid size small enough for exponential solution

---

### Problem 4: Flood Fill

**Problem:** [LeetCode 733 - Flood Fill](https://leetcode.com/problems/flood-fill/)

**Description:** An image is represented by an `m x n` integer grid `image`. You are given three integers `sr`, `sc`, and `color`. Perform a flood fill starting from pixel `(sr, sc)` and return the modified image.

**How to Apply:** Simplified DFS without backtracking:
- Start from given position
- Recursively fill connected same-color region
- No need to backtrack since we're modifying permanently

**Key Insights:**
- Similar grid traversal pattern
- No backtracking needed (permanent fill)
- BFS also works well for this problem

---

### Problem 5: Number of Islands

**Problem:** [LeetCode 200 - Number of Islands](https://leetcode.com/problems/number-islands/)

**Description:** Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.

**How to Apply:** DFS/BFS for connected components:
- Iterate through grid
- When land found, DFS to mark entire island
- Count each DFS initiation as one island

**Key Insights:**
- Connected component detection
- Similar grid marking pattern
- Can use BFS or Union-Find as alternatives

---

## Video Tutorial Links

### Fundamentals

- [Word Search - Backtracking Algorithm (NeetCode)](https://www.youtube.com/watch?v=pfiQ_PS1g8E) - Clear explanation with visualization
- [Word Search II - Trie + Backtracking (NeetCode)](https://www.youtube.com/watch?v=asbcE9mZz_U) - Advanced technique for multiple words
- [Backtracking Introduction ( Abdul Bari)](https://www.youtube.com/watch?v=DKCbsiDBN6c) - General backtracking concepts

### Grid Search Patterns

- [Flood Fill Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=aehEcTEPtCs) - Grid traversal fundamentals
- [Number of Islands - DFS/BFS (Back To Back SWE)](https://www.youtube.com/watch?v=__98uLdkwVw) - Connected components in grids
- [Matrix DFS Pattern (Tech With Tim)](https://www.youtube.com/watch?v=KiCBXu4P-2Y) - Common grid patterns

### Advanced Topics

- [Word Search - Optimizations (Nick White)](https://www.youtube.com/watch?v=vYYNp0JrdvY) - Pruning techniques
- [Trie Data Structure (HackerRank)](https://www.youtube.com/watch?v=AXjmTQ8LEoI) - Essential for Word Search II
- [Backtracking Time Complexity Analysis](https://www.youtube.com/watch?v=Zq4upTEaIyo) - Understanding 4^L factor

---

## Follow-up Questions

### Q1: Can we optimize the O(M × N × 4^L) time complexity?

**Answer:** The worst-case time complexity cannot be improved asymptotically because we may need to explore all paths. However, practical optimizations include:

- **Frequency pruning**: Check if board has enough of each character before searching
- **Starting from rarest character**: Begin DFS from cells matching the least frequent character in the word
- **Early termination**: Return immediately when word is found
- **Trie optimization** (for multiple words): Share prefix exploration across words

These don't change Big-O but significantly improve average-case performance.

---

### Q2: Why use in-place marking instead of a visited set?

**Answer:** In-place marking has several advantages:

1. **Space efficiency**: O(1) extra space vs O(L) or O(M × N) for a set
2. **Cache friendly**: No hash lookups, direct array access
3. **Simpler code**: No need to pass around a separate data structure

Trade-offs:
- Modifies input (usually acceptable)
- Requires restoring original value (backtracking)
- Works because input characters are from limited set (usually uppercase letters)

---

### Q3: Can we use BFS instead of DFS for Word Search?

**Answer:** Yes, but DFS is preferred because:

**DFS advantages:**
- Natural for path finding (go deep first)
- Space efficient: O(L) vs O(M × N) for BFS
- Easier to implement with backtracking
- Early termination when word found

**BFS advantages:**
- Finds shortest path (if multiple paths exist)
- Better for very wide grids with short words
- No recursion stack overflow risk

For standard Word Search, DFS is the standard approach due to lower space complexity.

---

### Q4: How do we handle the case where the word can be longer than the grid?

**Answer:** Add an early check:

```python
if len(word) > rows * cols:
    return False
```

Additionally:
- If word length exceeds path constraints (e.g., > M × N), impossible
- Frequency pruning catches most impossible cases
- Consider word structure: if it has repeating patterns, may need revisiting (which isn't allowed)

---

### Q5: What if the grid is extremely large but the word is short?

**Answer:** For large grids with short words (L ≤ 5):

1. **Index by first character**: Pre-process grid into a map of character → list of positions
2. **Start from matching cells only**: Skip cells that don't match word[0]
3. **Parallel search**: Search from multiple starting positions in parallel
4. **Early exit**: Most short words will be found quickly

Time becomes closer to O(K × 4^L) where K = occurrences of word[0], rather than O(M × N × 4^L).

---

## Summary

The **Word Search Grid** algorithm demonstrates the power of **Depth-First Search with Backtracking** for exploring constrained paths in 2D grids. Key takeaways:

### Core Concepts
- **DFS Backtracking**: Systematically explore all paths, undoing choices when they don't lead to solution
- **In-place Marking**: Use the grid itself for visited tracking to save space
- **Early Termination**: Stop as soon as the word is found

### Time & Space Complexity
- **Time**: O(M × N × 4^L) worst case, but pruning helps in practice
- **Space**: O(L) for recursion stack only

### When to Use
- ✅ Finding words/patterns in 2D character grids
- ✅ Path existence problems with "no revisit" constraints
- ✅ Backtracking practice and understanding
- ❌ When grid is extremely large and word is very long (consider alternatives)
- ❌ When you need to count paths (requires different approach)

### Common Variations
- **Word Search II**: Use Trie for multiple words
- **Diagonal allowed**: Expand to 8 directions
- **Count paths**: Remove early termination
- **Wildcards**: Match any character

This algorithm is a fundamental pattern for grid-based problems and serves as excellent practice for understanding backtracking, recursion, and state management.

---

## Related Algorithms

- [N-Queens](../patterns/backtracking-n-queens.md) - Classic backtracking problem
- [Combination Sum](./combination-sum.md) - Backtracking with combinations
- [Number of Islands](./number-of-islands.md) - Connected components in grids
- [Flood Fill](./flood-fill.md) - Grid traversal without backtracking
