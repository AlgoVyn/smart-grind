# Word Ladder II

## Problem Description

A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that:

- Every adjacent pair of words differs by a single letter.
- Every `si` for `1 <= i <= k` is in `wordList`. Note that `beginWord` does not need to be in `wordList`.
- `sk == endWord`

Given two words, `beginWord` and `endWord`, and a dictionary `wordList`, return all the shortest transformation sequences from `beginWord` to `endWord`, or an empty list if no such sequence exists. Each sequence should be returned as a list of the words `[beginWord, s1, s2, ..., sk]`.

**LeetCode Link:** [Word Ladder II](https://leetcode.com/problems/word-ladder-ii/)

---

## Examples

**Example 1:**

Input:
```python
beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
```

Output:
```python
[["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]
```

Explanation: There are 2 shortest transformation sequences:
- `"hit" -> "hot" -> "dot" -> "dog" -> "cog"`
- `"hit" -> "hot" -> "lot" -> "log" -> "cog"`

**Example 2:**

Input:
```python
beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
```

Output:
```python
[]
```

Explanation: The endWord `"cog"` is not in `wordList`, therefore there is no valid transformation sequence.

---

## Constraints

- `1 <= beginWord.length <= 5`
- `endWord.length == beginWord.length`
- `1 <= wordList.length <= 500`
- `wordList[i].length == beginWord.length`
- `beginWord`, `endWord`, and `wordList[i]` consist of lowercase English letters.
- `beginWord != endWord`
- All the words in `wordList` are unique.
- The sum of all shortest transformation sequences does not exceed `10^5`.

---

## Pattern: BFS + Backtracking (Graph Traversal with Path Reconstruction)

This problem uses a **two-phase approach**: first, BFS finds all shortest paths from beginWord to endWord while tracking parent relationships. Then, backtracking reconstructs all paths from endWord back to beginWord using the parent map.

### Core Concept

- **BFS**: Level-order traversal finds shortest paths in unweighted graph
- **Parent Map**: Track all predecessors for each word
- **Path Reconstruction**: Use backtracking/DFS to build all paths
- **Level Processing**: Process one level at a time to ensure shortest paths

---

## Intuition

The key insight for this problem is understanding the two-phase approach:

1. **Phase 1 - BFS to find shortest distance**:
   - Treat each word as a node in a graph
   - Edge exists between words that differ by exactly one letter
   - BFS finds all words at minimum distance from beginWord
   - Track parents to enable path reconstruction

2. **Why BFS + Parent Tracking?**:
   - BFS naturally finds shortest paths in unweighted graphs
   - We need ALL shortest paths, not just one
   - Parent map stores all possible predecessors at each level

3. **Level-wise processing is critical**:
   - Process all words at current level before moving to next
   - This ensures we find shortest paths
   - Words found in current level can have multiple parents

4. **Path reconstruction**:
   - Start from endWord
   - Follow parent links back to beginWord
   - Build paths in reverse, then reverse them

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **BFS + Backtracking** - Standard approach
2. **Bidirectional BFS** - Optimized for large dictionaries

---

## Approach 1: BFS + Backtracking (Standard)

### Algorithm Steps

1. **Setup**:
   - Create a set from wordList for O(1) lookup
   - Initialize queue with beginWord
   - Initialize visited set and parent map
   - Track if endWord is found

2. **BFS Phase**:
   - While queue is not empty and endWord not found:
     - Process current level (all words at this distance)
     - For each word, generate all possible neighbors (change one letter)
     - For each valid neighbor not in global visited:
       - Add to current level set
       - Record parent
       - If neighbor is endWord, mark as found
       - If neighbor was found in current level, add parent (multiple paths)
     - Add current level to visited
     - Add current level to queue

3. **Path Reconstruction Phase**:
   - If endWord was found, use DFS/backtracking:
     - Start from endWord
     - Recursively build paths to beginWord
     - Reverse each path before adding to result

### Why It Works

BFS explores the graph level by level, guaranteeing we find all words at minimum distance from beginWord. The parent map captures all ways to reach each word at the shortest distance. Backtracking then reconstructs all possible shortest paths.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def findLadders(self, beginWord: str, endWord: str, wordList: List[str]) -> List[List[str]]:
        wordSet = set(wordList)
        if endWord not in wordSet:
            return []
        
        # BFS initialization
        queue = deque([beginWord])
        visited = set([beginWord])
        parent = defaultdict(list)
        found = False
        
        while queue and not found:
            level_size = len(queue)
            current_level = set()
            
            for _ in range(level_size):
                word = queue.popleft()
                
                # Generate all possible one-letter transformations
                for i in range(len(word)):
                    for c in 'abcdefghijklmnopqrstuvwxyz':
                        if c == word[i]:
                            continue
                        new_word = word[:i] + c + word[i+1:]
                        
                        if new_word in wordSet:
                            if new_word not in visited:
                                # First time found at this level
                                current_level.add(new_word)
                                parent[new_word].append(word)
                                if new_word == endWord:
                                    found = True
                            elif new_word in current_level:
                                # Found multiple times at this level (multiple paths)
                                parent[new_word].append(word)
            
            # Update visited with all words found at this level
            visited.update(current_level)
            queue.extend(current_level)
        
        # Build all paths using backtracking
        def build_paths(word, path):
            if word == beginWord:
                result.append(path[::-1])
                return
            for p in parent[word]:
                build_paths(p, path + [word])
        
        result = []
        if found:
            build_paths(endWord, [endWord])
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_set>
#include <unordered_map>
#include <queue>
using namespace std;

class Solution {
public:
    vector<vector<string>> findLadders(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> wordSet(wordList.begin(), wordList.end());
        if (wordSet.find(endWord) == wordSet.end()) {
            return {};
        }
        
        queue<string> q;
        q.push(beginWord);
        
        unordered_set<string> visited;
        visited.insert(beginWord);
        
        unordered_map<string, vector<string>> parent;
        bool found = false;
        
        while (!q.empty() && !found) {
            int levelSize = q.size();
            unordered_set<string> currentLevel;
            
            for (int i = 0; i < levelSize; i++) {
                string word = q.front();
                q.pop();
                
                for (int j = 0; j < word.length(); j++) {
                    string newWord = word;
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == word[j]) continue;
                        newWord[j] = c;
                        
                        if (wordSet.find(newWord) != wordSet.end()) {
                            if (visited.find(newWord) == visited.end()) {
                                currentLevel.insert(newWord);
                                parent[newWord].push_back(word);
                                if (newWord == endWord) {
                                    found = true;
                                }
                            } else if (currentLevel.find(newWord) != currentLevel.end()) {
                                parent[newWord].push_back(word);
                            }
                        }
                    }
                }
            }
            
            for (const string& w : currentLevel) {
                visited.insert(w);
                q.push(w);
            }
        }
        
        // Build paths
        vector<vector<string>> result;
        if (!found) return result;
        
        vector<string> path;
        function<void(const string&)> build = [&](const string& word) {
            if (word == beginWord) {
                path.push_back(beginWord);
                result.push_back(path);
                path.pop_back();
                return;
            }
            for (const string& p : parent[word]) {
                path.push_back(word);
                build(p);
                path.pop_back();
            }
        };
        
        path.push_back(endWord);
        build(endWord);
        
        // Reverse each path
        for (auto& p : result) {
            reverse(p.begin(), p.end());
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<String>> findLadders(String beginWord, String endWord, List<String> wordList) {
        Set<String> wordSet = new HashSet<>(wordList);
        if (!wordSet.contains(endWord)) {
            return new ArrayList<>();
        }
        
        Queue<String> queue = new LinkedList<>();
        queue.add(beginWord);
        
        Set<String> visited = new HashSet<>();
        visited.add(beginWord);
        
        Map<String, List<String>> parent = new HashMap<>();
        boolean[] found = {false};
        
        while (!queue.isEmpty() && !found[0]) {
            int levelSize = queue.size();
            Set<String> currentLevel = new HashSet<>();
            
            for (int i = 0; i < levelSize; i++) {
                String word = queue.poll();
                
                char[] chars = word.toCharArray();
                for (int j = 0; j < chars.length; j++) {
                    char original = chars[j];
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == original) continue;
                        chars[j] = c;
                        String newWord = new String(chars);
                        
                        if (wordSet.contains(newWord)) {
                            if (!visited.contains(newWord)) {
                                currentLevel.add(newWord);
                                parent.computeIfAbsent(newWord, k -> new ArrayList<>()).add(word);
                                if (newWord.equals(endWord)) {
                                    found[0] = true;
                                }
                            } else if (currentLevel.contains(newWord)) {
                                parent.computeIfAbsent(newWord, k -> new ArrayList<>()).add(word);
                            }
                        }
                    }
                    chars[j] = original;
                }
            }
            
            visited.addAll(currentLevel);
            queue.addAll(currentLevel);
        }
        
        // Build paths
        List<List<String>> result = new ArrayList<>();
        if (!found[0]) return result;
        
        LinkedList<String> path = new LinkedList<>();
        path.add(endWord);
        
        buildPaths(endWord, beginWord, parent, path, result);
        
        return result;
    }
    
    private void buildPaths(String word, String beginWord, Map<String, List<String>> parent, 
                          LinkedList<String> path, List<List<String>> result) {
        if (word.equals(beginWord)) {
            List<String> temp = new ArrayList<>(path);
            Collections.reverse(temp);
            result.add(temp);
            return;
        }
        
        for (String p : parent.getOrDefault(word, new ArrayList<>())) {
            path.addFirst(p);
            buildPaths(p, beginWord, parent, path, result);
            path.removeFirst();
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {string[][]}
 */
var findLadders = function(beginWord, endWord, wordList) {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) return [];
    
    const queue = [beginWord];
    const visited = new Set([beginWord]);
    const parent = new Map();
    let found = false;
    
    while (queue.length > 0 && !found) {
        const levelSize = queue.length;
        const currentLevel = new Set();
        
        for (let i = 0; i < levelSize; i++) {
            const word = queue.shift();
            
            for (let j = 0; j < word.length; j++) {
                for (let c = 97; c <= 122; c++) {
                    const char = String.fromCharCode(c);
                    if (char === word[j]) continue;
                    
                    const newWord = word.slice(0, j) + char + word.slice(j + 1);
                    
                    if (wordSet.has(newWord)) {
                        if (!visited.has(newWord)) {
                            currentLevel.add(newWord);
                            if (!parent.has(newWord)) {
                                parent.set(newWord, []);
                            }
                            parent.get(newWord).push(word);
                            if (newWord === endWord) {
                                found = true;
                            }
                        } else if (currentLevel.has(newWord)) {
                            parent.get(newWord).push(word);
                        }
                    }
                }
            }
        }
        
        currentLevel.forEach(w => {
            visited.add(w);
            queue.push(w);
        });
    }
    
    // Build paths
    if (!found) return [];
    
    const result = [];
    const path = [endWord];
    
    function build(word) {
        if (word === beginWord) {
            result.push([...path].reverse());
            return;
        }
        
        const parents = parent.get(word) || [];
        for (const p of parents) {
            path.push(p);
            build(p);
            path.pop();
        }
    }
    
    build(endWord);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × 26 × l) where n is wordList size, l is word length |
| **Space** | O(n × l) for queue, visited, and parent map |

---

## Approach 2: Bidirectional BFS (Optimized)

### Algorithm Steps

1. Start BFS from both beginWord and endWord simultaneously
2. When levels meet, use parent maps to reconstruct paths
3. This reduces the search space significantly

### Why It Works

Bidirectional BFS reduces the search space from O(b^d) to O(b^(d/2)) where b is branching factor and d is depth.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def findLadders(self, beginWord: str, endWord: str, wordList: List[str]) -> List[List[str]]:
        wordSet = set(wordList)
        if endWord not in wordSet:
            return []
        
        forward = {beginWord}
        backward = {endWord}
        visited = set([beginWord, endWord])
        parent = defaultdict(list)
        direction = True  # True = forward, False = backward
        
        while forward and backward:
            if len(forward) > len(backward):
                forward, backward = backward, forward
                direction = not direction
            
            next_level = set()
            found = False
            
            for word in forward:
                for i in range(len(word)):
                    for c in 'abcdefghijklmnopqrstuvwxyz':
                        if c == word[i]:
                            continue
                        new_word = word[:i] + c + word[i+1:]
                        
                        if new_word in backward:
                            found = True
                            if direction:
                                parent[new_word].append(word)
                            else:
                                parent[word].append(new_word)
                        
                        if new_word in wordSet and new_word not in visited:
                            next_level.add(new_word)
                            if direction:
                                parent[new_word].append(word)
                            else:
                                parent[word].append(new_word)
            
            visited.update(next_level)
            forward = next_level
            
            if found:
                return self._build_paths(beginWord, endWord, parent)
        
        return []
    
    def _build_paths(self, beginWord, endWord, parent):
        result = []
        path = [endWord]
        
        def build(word):
            if word == beginWord:
                result.append(path[::-1][:])
                return
            for p in parent.get(word, []):
                path.append(p)
                build(p)
                path.pop()
        
        build(endWord)
        return result
```

<!-- slide -->
```cpp
// Bidirectional BFS implementation
class Solution {
public:
    vector<vector<string>> findLadders(string beginWord, string endWord, vector<string>& wordList) {
        // Implementation similar to above but bidirectional
        // ... (omitted for brevity - similar pattern)
    }
};
```

<!-- slide -->
```java
// Bidirectional BFS implementation
class Solution {
    public List<List<String>> findLadders(String beginWord, String endWord, List<String> wordList) {
        // Implementation similar to above but bidirectional
        // ... (omitted for brevity - similar pattern)
    }
}
```

<!-- slide -->
```javascript
// Bidirectional BFS implementation
var findLadders = function(beginWord, endWord, wordList) {
    // Implementation similar to above but bidirectional
    // ... (omitted for brevity - similar pattern)
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(b^(d/2)) - significantly reduced |
| **Space** | O(b^(d/2)) |

---

## Comparison of Approaches

| Aspect | BFS + Backtracking | Bidirectional BFS |
|--------|-------------------|-------------------|
| **Time Complexity** | O(n × 26 × l) | O(b^(d/2)) |
| **Space Complexity** | O(n × l) | O(b^(d/2)) |
| **Implementation** | Simple | Complex |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Medium | Hard |

**Best Approach:** Use Approach 1 (BFS + Backtracking) for clarity; bidirectional BFS for optimization.

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Word Ladder | [Link](https://leetcode.com/problems/word-ladder/) | Find shortest transformation |
| Word Break | [Link](https://leetcode.com/problems/word-break/) | String segmentation |
| Evaluate Division | [Link](https://leetcode.com/problems/evaluate-division/) | Graph path finding |

---

## Video Tutorial Links

1. **[NeetCode - Word Ladder II](https://www.youtube.com/watch?v=EXAMPLE)** - Clear explanation
2. **[BFS Graph Traversal](https://www.youtube.com/watch?v=EXAMPLE)** - Understanding BFS

---

## Follow-up Questions

### Q1: How would you modify to find all paths (not just shortest)?

**Answer:** Remove the level-wise processing and visited check, allowing exploration of all paths. This becomes exponential in complexity.

---

### Q2: Can you use A* search instead of BFS?

**Answer:** Yes, use heuristic based on number of differing letters to endWord. This can be faster but doesn't guarantee shortest paths without proper heuristic.

---

### Q3: How would you handle very large word lists?

**Answer:** Use bidirectional BFS to reduce search space, or build an intermediate graph (word ladder graph) beforehand.

---

## Common Pitfalls

### 1. Not Processing Level-by-Level
**Issue**: Mixing levels causes longer paths to be found first.

**Solution**: Process all words at current distance before moving to next level.

### 2. Not Tracking Multiple Parents
**Issue**: Missing some shortest paths because only one parent is tracked.

**Solution**: When a word is found in current level from multiple parents, record all parents.

### 3. Premature Termination
**Issue**: Stopping BFS too early when endWord is found.

**Solution**: Continue processing current level after finding endWord to capture all parents.

### 4. Memory Issues
**Issue**: Storing too many paths in result.

**Solution**: Build paths lazily or use generators.

---

## Summary

The **Word Ladder II** problem demonstrates:
- **BFS for shortest paths**: Level-order traversal in unweighted graph
- **Parent tracking**: Recording all predecessors for path reconstruction
- **Two-phase approach**: Find distances, then reconstruct paths
- **Path reconstruction**: Using backtracking/DFS

Key takeaways:
1. Process BFS level by level to ensure shortest paths
2. Track all parents for words found at same level
3. Use backtracking to reconstruct all paths from endWord
4. Bidirectional BFS can optimize for large dictionaries

This problem is essential for understanding graph traversal with path reconstruction.

---

### Pattern Summary

This problem exemplifies the **BFS + Backtracking** pattern, characterized by:
- Using BFS to find shortest distances in unweighted graphs
- Tracking parent/predecessor relationships
- Reconstructing paths using backtracking/DFS
- Level-wise processing for optimal results

For more details on this pattern, see the **[Graph Traversal Pattern](/patterns/graph-traversal)**.
