# Word Search II

## Problem Description

Given an `m x n` board of characters and a list of strings `words`, return all words on the board.

Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.

**Link to problem:** [Word Search II - LeetCode 212](https://leetcode.com/problems/word-search-ii/)

---

## Examples

### Example

**Input:**
```
board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]
```

**Output:**
```
["eat","oath"]
```

**Explanation:**
- "oath" can be formed by: o→a→t→h (row 0 to row 1 to row 0)
- "eat" can be formed by: e→a→t

### Example 2

**Input:**
```
board = [["a","b"],["c","d"]], words = ["abcb"]
```

**Output:**
```
[]
```

**Explanation:**
- "abcb" cannot be formed because 'b' would need to be reused

---

## Constraints

- `m == board.length`
- `n == board[i].length`
- `1 <= m, n <= 12`
- `board[i][j]` is a lowercase English letter.
- `1 <= words.length <= 3 * 10^4`
- `1 <= words[i].length <= 10`
- `words[i]` consists of lowercase English letters.
- All the strings of `words` are unique.

---

## Pattern: Trie + Backtracking (DFS)

This problem is a classic example of the **Trie + Backtracking** pattern. The key insight is to use a Trie to efficiently prune invalid search paths.

### Core Concept

The fundamental idea is:
1. **Build Trie First**: Insert all words into a Trie for efficient prefix matching
2. **DFS from Each Cell**: For each cell in the board, perform DFS using Trie as a guide
3. **Prune Early**: If current path doesn't match any Trie prefix, stop exploring
4. **Mark Visited**: Use backtracking to mark and unmark cells during DFS

---

## Intuition

The key insight is that naive DFS for each word would be O(m × n × words × path_length), which is too slow. Instead:

1. **Why Trie?**: When exploring the board, we can quickly check if the current path can lead to any valid word by checking the Trie. If no word in our dictionary starts with the current path, we can stop exploring.

2. **Why Backtracking?**: Each cell can only be used once in a word, so we need to mark cells as visited during DFS and unmark them (backtrack) when returning.

3. **Key Optimization**: Instead of checking each word separately, we build one Trie and use it to guide all searches simultaneously.

### Visual Example

For board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]:

```
Step 1: Build Trie with words:
- "oath" -> o→a→t→h
- "pea"   -> p→e→a  
- "eat"   -> e→a→t
- "rain"  -> r→a→i→n

Step 2: DFS from (0,0) = 'o':
- Path "o" → Trie has 'o' child → continue
- Path "oa" → Trie has 'a' child → continue
- Path "oat" → Trie has 't' child → continue
- Path "oath" → Trie marks end → add to result

Step 3: Backtrack and explore other paths
```

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Trie + DFS (Optimal)** - O(m × n × 4^L) time where L is max word length, uses Trie for pruning
2. **HashSet + DFS** - O(m × n × words × L) time, less efficient but simpler

---

## Approach 1: Trie + DFS (Optimal)

This is the optimal approach using Trie to prune invalid paths.

### Algorithm Steps

1. Build a Trie from all words in the dictionary
2. For each cell in the board:
   - Start DFS if the cell's character exists in Trie root
3. In DFS:
   - If current Trie node marks end of word, add to result
   - Mark current cell as visited ('#')
   - Explore 4 directions (up, down, left, right)
   - Backtrack: restore original character
4. Return result list

### Why It Works

The Trie provides O(1) prefix checking. When exploring a path:
- If the current path doesn't match any Trie prefix, stop immediately
- This prevents exploring exponentially many invalid paths
- The moment we find a complete word, we add it to result but continue (words can share prefixes)

### Code Implementation

````carousel
```python
from typing import List, Set

class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.word = ""

class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        """
        Find all words that can be formed in the board.
        
        Args:
            board: 2D array of characters
            words: List of words to search for
            
        Returns:
            List of found words
        """
        # Step 1: Build Trie
        root = TrieNode()
        for word in words:
            node = root
            for char in word:
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
            node.is_end = True
            node.word = word
        
        result = []
        rows, cols = len(board), len(board[0])
        
        # Step 2: DFS from each cell
        def dfs(row: int, col: int, node: TrieNode):
            char = board[row][col]
            
            # Check if current path leads to any word
            if char not in node.children:
                return
            
            next_node = node.children[char]
            
            # If this is end of a word, add to result
            if next_node.is_end:
                result.append(next_node.word)
                next_node.is_end = False  # Avoid duplicates
            
            # Mark as visited
            board[row][col] = '#'
            
            # Explore 4 directions
            directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
            for dr, dc in directions:
                new_row, new_col = row + dr, col + dc
                if 0 <= new_row < rows and 0 <= new_col < cols:
                    dfs(new_row, new_col, next_node)
            
            # Backtrack
            board[row][col] = char
        
        # Start DFS from each cell
        for i in range(rows):
            for j in range(cols):
                if board[i][j] in root.children:
                    dfs(i, j, root)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_set>
using namespace std;

struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool is_end = false;
    string word = "";
};

class Solution {
private:
    TrieNode* root;
    vector<string> result;
    int rows, cols;
    
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->is_end = true;
        node->word = word;
    }
    
    void dfs(vector<vector<char>>& board, int row, int col, TrieNode* node) {
        char c = board[row][col];
        
        if (node->children.find(c) == node->children.end()) {
            return;
        }
        
        TrieNode* nextNode = node->children[c];
        
        if (nextNode->is_end) {
            result.push_back(nextNode->word);
            nextNode->is_end = false;  // Avoid duplicates
        }
        
        board[row][col] = '#';  // Mark visited
        
        vector<pair<int, int>> dirs = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
        for (auto [dr, dc] : dirs) {
            int nr = row + dr, nc = col + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                dfs(board, nr, nc, nextNode);
            }
        }
        
        board[row][col] = c;  // Backtrack
    }
    
public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        if (board.empty() || board[0].empty()) return {};
        
        root = new TrieNode();
        for (string word : words) {
            insert(word);
        }
        
        rows = board.size();
        cols = board[0].size();
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (root->children.find(board[i][j]) != root->children.end()) {
                    dfs(board, i, j, root);
                }
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    private class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean isEnd = false;
        String word = "";
    }
    
    private TrieNode root;
    private List<String> result;
    private int rows, cols;
    
    private void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node.children.putIfAbsent(c, new TrieNode());
            node = node.children.get(c);
        }
        node.isEnd = true;
        node.word = word;
    }
    
    private void dfs(char[][] board, int row, int col, TrieNode node) {
        char c = board[row][col];
        
        if (!node.children.containsKey(c)) {
            return;
        }
        
        TrieNode nextNode = node.children.get(c);
        
        if (nextNode.isEnd) {
            result.add(nextNode.word);
            nextNode.isEnd = false;  // Avoid duplicates
        }
        
        board[row][col] = '#';  // Mark visited
        
        int[][] dirs = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
        for (int[] dir : dirs) {
            int nr = row + dir[0];
            int nc = col + dir[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                dfs(board, nr, nc, nextNode);
            }
        }
        
        board[row][col] = c;  // Backtrack
    }
    
    public List<String> findWords(char[][] board, String[] words) {
        if (board.length == 0 || board[0].length == 0) return new ArrayList<>();
        
        root = new TrieNode();
        for (String word : words) {
            insert(word);
        }
        
        result = new ArrayList<>();
        rows = board.length;
        cols = board[0].length;
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (root.children.containsKey(board[i][j])) {
                    dfs(board, i, j, root);
                }
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEnd = false;
        this.word = '';
    }
}

class Solution {
    /**
     * @param {character[][]} board
     * @param {string[]} words
     * @return {string[]}
     */
    findWords(board, words) {
        if (!board.length || !board[0].length) return [];
        
        // Build Trie
        this.root = new TrieNode();
        for (const word of words) {
            let node = this.root;
            for (const char of word) {
                if (!node.children.has(char)) {
                    node.children.set(char, new TrieNode());
                }
                node = node.children.get(char);
            }
            node.isEnd = true;
            node.word = word;
        }
        
        this.result = [];
        this.rows = board.length;
        this.cols = board[0].length;
        
        // DFS from each cell
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.root.children.has(board[i][j])) {
                    this.dfs(board, i, j, this.root);
                }
            }
        }
        
        return this.result;
    }
    
    dfs(board, row, col, node) {
        const char = board[row][col];
        
        if (!node.children.has(char)) {
            return;
        }
        
        const nextNode = node.children.get(char);
        
        if (nextNode.isEnd) {
            this.result.push(nextNode.word);
            nextNode.isEnd = false;  // Avoid duplicates
        }
        
        board[row][col] = '#';  // Mark visited
        
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (const [dr, dc] of dirs) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                this.dfs(board, nr, nc, nextNode);
            }
        }
        
        board[row][col] = char;  // Backtrack
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n × 4^L) in worst case, but Trie prunes significantly |
| **Space** | O(W × L) for Trie + O(m × n) for recursion stack |

---

## Approach 2: HashSet + DFS (Alternative)

This approach is simpler but less efficient. It checks each word individually.

### Algorithm Steps

1. Put all words in a HashSet for O(1) lookup
2. For each cell, start DFS
3. In DFS, build the current path string
4. If path is in HashSet, add to result
5. Continue exploring until path length exceeds max word length

### Code Implementation

````carousel
```python
class Solution:
    def findWords_set(self, board: List[List[str]], words: List[str]) -> List[str]:
        """Less efficient approach using HashSet."""
        word_set = set(words)
        result = set()
        rows, cols = len(board), len(board[0])
        
        def dfs(row: int, col: int, path: str):
            if len(path) > 10:  # Max word length constraint
                return
            
            if path in word_set:
                result.add(path)
            
            if row < 0 or row >= rows or col < 0 or col >= cols:
                return
            
            temp = board[row][col]
            board[row][col] = '#'
            
            for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                dfs(row + dr, col + dc, path + temp)
            
            board[row][col] = temp
        
        for i in range(rows):
            for j in range(cols):
                dfs(i, j, "")
        
        return list(result)
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n × words × L) - much slower |
| **Space** | O(words) for HashSet |

---

## Comparison of Approaches

| Aspect | Trie + DFS | HashSet + DFS |
|--------|------------|---------------|
| **Time Complexity** | O(m × n × 4^L) | O(m × n × W × L) |
| **Space Complexity** | O(W × L) | O(W) |
| **Pruning** | ✅ Yes | ❌ No |
| **LeetCode Optimal** | ✅ Yes | ❌ No |

**Best Approach:** Trie + DFS is optimal and should be used.

---

## Why Trie + DFS Works

1. **Prefix Pruning**: As we traverse, if current path doesn't match any Trie prefix, we stop immediately
2. **Early Termination**: We don't explore paths that can't lead to valid words
3. **Shared Prefixes**: Words with common prefixes share Trie nodes, saving computation
4. **Complete Coverage**: We explore all possible paths that could form valid words

---

## Related Problems

### Same Pattern (Trie + DFS)

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Word Search | [Link](https://leetcode.com/problems/word-search/) | Single word search |
| Replace Words | [Link](https://leetcode.com/problems/replace-words/) | Trie-based word replacement |
| Design Add and Search Words | [Link](https://leetcode.com/problems/design-add-and-search-words-data-structure/) | Trie with wildcard |

### Similar Concepts

| Problem | LeetCode Link | Technique |
|---------|---------------|-----------|
| Maximum XOR of Two Numbers | [Link](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/) | Binary Trie |
| Map Sum Pairs | [Link](https://leetcode.com/problems/map-sum-pairs/) | Trie with prefix sum |
| Longest Word in Dictionary | [Link](https://leetcode.com/problems/longest-word-in-dictionary/) | Trie building |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Word Search II](https://www.youtube.com/watch?v=asbcE9c2cT4)** - Clear explanation with visual examples
2. **[Word Search II - Back to Back SWE](https://www.youtube.com/watch?v=UlyU7zS1rZw)** - Detailed walkthrough
3. **[LeetCode Official Solution](https://www.youtube.com/watch?v=Uu8J5t4X3qM)** - Official explanation

### Additional Resources

- **[Trie Data Structure](https://www.youtube.com/watch?v=7XmS8M2pGdw)** - Trie fundamentals
- **[DFS Backtracking](https://www.youtube.com/watch?v=njR3T6Zl2BM)** - Backtracking techniques

---

## Follow-up Questions

### Q1: Why do we mark the node as no longer being the end of a word after adding it to result?

**Answer:** This prevents duplicate entries in the result. Since we continue exploring from this node (to find longer words that have this word as prefix), we don't want to add the same word again.

---

### Q2: How would you modify the solution to handle uppercase letters?

**Answer:** The solution naturally handles any characters since we use the character directly as a key in the Trie. No modification needed, just ensure the board and words use the same character set.

---

### Q3: Can you find all words that can be formed more than once?

**Answer:** Remove the line `nextNode.isEnd = false` after adding to result. This will cause the same word to be added multiple times if it can be formed in multiple ways.

---

### Q4: How would you handle the case where words can share cells?

**Answer:** This is not allowed per the problem constraints ("The same letter cell may not be used more than once in a word"). If allowed, you would remove the visited marking and let paths diverge.

---

### Q5: What if the board is very large but words list is small?

**Answer:** The Trie approach is still optimal. The key is that Trie pruning reduces the search space regardless of board size.

---

### Q6: How would you return words sorted by their length?

**Answer:** After getting the result list, simply sort it: `result.sort(key=lambda x: len(x))` or `Collections.sort(result, Comparator.comparingInt(String::length))`.

---

### Q7: What edge cases should be tested?

**Answer:**
- Empty board or words list → return []
- Single cell board
- Words that cannot be formed
- Words that share prefixes (e.g., "app", "apple", "apply")
- Maximum size board (12x12) with many words

---

## Common Pitfalls

### 1. Not Backtracking
**Issue:** Forgetting to restore the board cell after DFS, causing incorrect results.

**Solution:** Always restore the character after exploring all 4 directions: `board[row][col] = char`

### 2. Not Checking Trie Prefix
**Issue:** Not checking if current path exists in Trie before continuing DFS.

**Solution:** Add early termination: `if char not in node.children: return`

### 3. Missing Duplicate Handling
**Issue:** Adding the same word multiple times if it can be formed in multiple ways.

**Solution:** After adding word to result, mark it as no longer end: `nextNode.isEnd = false`

### 4. Stack Overflow for Large Boards
**Issue:** Deep recursion for long words on large boards.

**Solution:** Consider iterative DFS with explicit stack, or limit word length in constraints.

### 5. Wrong Direction Handling
**Issue:** Missing boundary checks or using wrong neighbor indices.

**Solution:** Always check `0 <= new_row < rows and 0 <= new_col < cols` before recursion.

---

## Summary

The **Word Search II** problem demonstrates the powerful combination of **Trie + DFS (Backtracking)**:

- **Trie for Pruning**: Efficiently guides the search by checking if current path can lead to any valid word
- **DFS for Exploration**: Systematically explores all possible paths from each cell
- **Backtracking**: Marks cells as visited and restores them after exploration
- **Time Optimization**: Trie pruning makes this much faster than checking each word separately

Key takeaways:
1. Build Trie from all words first
2. Use Trie to guide DFS and prune invalid paths
3. Always backtrack by restoring board cells
4. Mark words as visited after adding to avoid duplicates

This problem is essential for understanding how data structures can optimize search algorithms.

### Pattern Summary

This problem exemplifies the **Trie + Backtracking** pattern, characterized by:
- Using Trie for efficient prefix matching
- DFS for exhaustive path exploration
- Backtracking for state restoration
- Pruning to reduce search space

For more details on this pattern, see the **[Trie (Prefix Tree) Pattern](/patterns/trie-prefix-tree)**.
