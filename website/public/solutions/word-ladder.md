# Word Ladder

## Problem Description

[LeetCode Link](https://leetcode.com/problems/word-ladder/)

A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that:

- Every adjacent pair of words differs by a single letter.
- Every `si` for `1 <= i <= k` is in `wordList`. Note that `beginWord` does not need to be in `wordList`.
- `sk == endWord`

Given two words, `beginWord` and `endWord`, and a dictionary `wordList`, return the number of words in the shortest transformation sequence from `beginWord` to `endWord`, or `0` if no such sequence exists.

This is **LeetCode Problem #127** and is classified as a Hard difficulty problem.

---

## Examples

### Example 1

**Input:**
```python
beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
```

**Output:**
```python
5
```

**Explanation:** One shortest transformation sequence is `"hit" -> "hot" -> "dot" -> "dog" -> "cog"`, which is 5 words long.

### Example 2

**Input:**
```python
beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
```

**Output:**
```python
0
```

**Explanation:** The endWord `"cog"` is not in `wordList`, therefore there is no valid transformation sequence.

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= beginWord.length <= 10` | Word length |
| `endWord.length == beginWord.length` | Same length |
| `1 <= wordList.length <= 5000` | Dictionary size |
| `wordList[i].length == beginWord.length` | Same length |
| `beginWord`, `endWord`, `wordList[i]` are lowercase | English letters |
| `beginWord != endWord` | Different words |
| All words unique | No duplicates |

---

## Pattern: BFS - Shortest Path

This problem follows the **BFS - Shortest Path** pattern.

### Core Concept

- **Word Graph**: Each word connects to words one letter apart
- **BFS**: Find shortest transformation sequence
- **Level Order**: Process by transformation steps

### When to Use This Pattern

This pattern is applicable when:
1. Word ladder problems
2. Shortest transformation
3. BFS shortest path

---

## Intuition

The key insight for this problem is treating each word as a node in a graph, where an edge exists between two words if they differ by exactly one letter.

### Key Observations

1. **Graph Construction**: We don't need to pre-build the entire graph. Instead, we generate neighbors on-the-fly by changing each letter.

2. **BFS Guarantees Shortest Path**: Breadth-First Search explores level by level, so the first time we reach `endWord`, we've found the shortest path.

3. **Set for O(1) Lookups**: Using a set for the word list allows O(1) membership checks.

4. **Bidirectional Optimization**: We can use bidirectional BFS to search from both ends, reducing search space.

### Algorithm Overview

1. Convert wordList to a set for O(1) lookups
2. If endWord not in wordList, return 0
3. Use BFS with a queue storing (word, level)
4. For each word, generate all possible one-letter variations
5. If new word is in set and not visited, add to queue
6. Return level when endWord is found

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **BFS (Breadth-First Search)** - Standard approach
2. **Bidirectional BFS** - Optimized approach

---

## Approach 1: BFS (Standard)

### Why It Works

BFS explores the graph level by level. Each level represents one transformation step. Since we process levels in order, the first time we reach the endWord, we've found the shortest path.

### Code Implementation

````carousel
```python
from typing import List, Set
from collections import deque

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        """
        Find shortest transformation sequence using BFS.
        
        Time Complexity: O(N * L * 26)
        Space Complexity: O(N)
        """
        # Convert to set for O(1) lookups
        wordSet: Set[str] = set(wordList)
        if endWord not in wordSet:
            return 0
        
        # BFS initialization
        queue = deque([(beginWord, 1)])
        visited = {beginWord}
        
        while queue:
            word, level = queue.popleft()
            
            # Check if reached endWord
            if word == endWord:
                return level
            
            # Generate all possible transformations
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    if c == word[i]:
                        continue
                    
                    newWord = word[:i] + c + word[i+1:]
                    
                    if newWord in wordSet and newWord not in visited:
                        visited.add(newWord)
                        queue.append((newWord, level + 1))
        
        return 0
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_set>
#include <queue>
using namespace std;

class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> wordSet(wordList.begin(), wordList.end());
        if (wordSet.find(endWord) == wordSet.end())
            return 0;
        
        queue<pair<string, int>> q;
        q.push({beginWord, 1});
        unordered_set<string> visited;
        visited.insert(beginWord);
        
        while (!q.empty()) {
            auto [word, level] = q.front();
            q.pop();
            
            if (word == endWord)
                return level;
            
            for (int i = 0; i < word.length(); i++) {
                char original = word[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    if (c == original) continue;
                    
                    word[i] = c;
                    string newWord = word;
                    
                    if (wordSet.find(newWord) != wordSet.end() && 
                        visited.find(newWord) == visited.end()) {
                        visited.insert(newWord);
                        q.push({newWord, level + 1});
                    }
                }
                word[i] = original;
            }
        }
        
        return 0;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> wordSet = new HashSet<>(wordList);
        if (!wordSet.contains(endWord))
            return 0;
        
        Queue<String[]> q = new LinkedList<>();
        q.add(new String[]{beginWord, "1"});
        Set<String> visited = new HashSet<>();
        visited.add(beginWord);
        
        while (!q.isEmpty()) {
            String[] curr = q.poll();
            String word = curr[0];
            int level = Integer.parseInt(curr[1]);
            
            if (word.equals(endWord))
                return level;
            
            char[] chars = word.toCharArray();
            for (int i = 0; i < chars.length; i++) {
                char original = chars[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    if (c == original) continue;
                    
                    chars[i] = c;
                    String newWord = new String(chars);
                    
                    if (wordSet.contains(newWord) && !visited.contains(newWord)) {
                        visited.add(newWord);
                        q.add(new String[]{newWord, String.valueOf(level + 1)});
                    }
                }
                chars[i] = original;
            }
        }
        
        return 0;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
var ladderLength = function(beginWord, endWord, wordList) {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) return 0;
    
    const queue = [[beginWord, 1]];
    const visited = new Set([beginWord]);
    
    while (queue.length > 0) {
        const [word, level] = queue.shift();
        
        if (word === endWord) return level;
        
        const chars = word.split('');
        for (let i = 0; i < chars.length; i++) {
            const original = chars[i];
            for (let c = 'a'.charCodeAt(0); c <= 'z'.charCodeAt(0); c++) {
                if (c === original.charCodeAt(0)) continue;
                
                chars[i] = String.fromCharCode(c);
                const newWord = chars.join('');
                
                if (wordSet.has(newWord) && !visited.has(newWord)) {
                    visited.add(newWord);
                    queue.push([newWord, level + 1]);
                }
            }
            chars[i] = original;
        }
    }
    
    return 0;
};
```
````

---

## Approach 2: Bidirectional BFS

### Why It Works

Bidirectional BFS searches from both the start and end simultaneously. This reduces the search space significantly because the two searches meet in the middle. The total work is O(b^(d/2)) instead of O(b^d) where b is branching factor and d is depth.

### Code Implementation

````carousel
```python
from typing import List, Set
from collections import deque

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        """
        Find shortest transformation using bidirectional BFS.
        
        Time Complexity: O(N * L * 26 / 2) ≈ O(N * L * 26)
        Space Complexity: O(N)
        """
        wordSet: Set[str] = set(wordList)
        if endWord not in wordSet:
            return 0
        
        # Two queues for bidirectional search
        beginSet = {beginWord}
        endSet = {endWord}
        visited = set()
        level = 1
        
        while beginSet and endSet:
            # Always expand the smaller set
            if len(beginSet) > len(endSet):
                beginSet, endSet = endSet, beginSet
            
            # Next level of transformations
            nextSet = set()
            
            for word in beginSet:
                # Generate all possible transformations
                for i in range(len(word)):
                    for c in 'abcdefghijklmnopqrstuvwxyz':
                        if c == word[i]:
                            continue
                        
                        newWord = word[:i] + c + word[i+1:]
                        
                        # Check if reached from other side
                        if newWord in endSet:
                            return level + 1
                        
                        if newWord in wordSet and newWord not in visited:
                            visited.add(newWord)
                            nextSet.add(newWord)
            
            beginSet = nextSet
            level += 1
        
        return 0
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_set>
using namespace std;

class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> wordSet(wordList.begin(), wordList.end());
        if (wordSet.find(endWord) == wordSet.end())
            return 0;
        
        unordered_set<string> beginSet, endSet, visited;
        beginSet.insert(beginWord);
        endSet.insert(endWord);
        
        int level = 1;
        
        while (!beginSet.empty() && !endSet.empty()) {
            // Always expand smaller set
            if (beginSet.size() > endSet.size())
                swap(beginSet, endSet);
            
            unordered_set<string> nextSet;
            
            for (const string& word : beginSet) {
                string temp = word;
                for (int i = 0; i < word.length(); i++) {
                    char original = temp[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == original) continue;
                        
                        temp[i] = c;
                        
                        if (endSet.find(temp) != endSet.end())
                            return level + 1;
                        
                        if (wordSet.find(temp) != wordSet.end() && 
                            visited.find(temp) == visited.end()) {
                            visited.insert(temp);
                            nextSet.insert(temp);
                        }
                    }
                    temp[i] = original;
                }
            }
            
            beginSet = nextSet;
            level++;
        }
        
        return 0;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> wordSet = new HashSet<>(wordList);
        if (!wordSet.contains(endWord))
            return 0;
        
        Set<String> beginSet = new HashSet<>(), endSet = new HashSet<>();
        Set<String> visited = new HashSet<>();
        beginSet.add(beginWord);
        endSet.add(endWord);
        
        int level = 1;
        
        while (!beginSet.isEmpty() && !endSet.isEmpty()) {
            // Always expand smaller set
            if (beginSet.size() > endSet.size()) {
                Set<String> temp = beginSet;
                beginSet = endSet;
                endSet = temp;
            }
            
            Set<String> nextSet = new HashSet<>();
            
            for (String word : beginSet) {
                char[] chars = word.toCharArray();
                for (int i = 0; i < chars.length; i++) {
                    char original = chars[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == original) continue;
                        
                        chars[i] = c;
                        String newWord = new String(chars);
                        
                        if (endSet.contains(newWord))
                            return level + 1;
                        
                        if (wordSet.contains(newWord) && !visited.contains(newWord)) {
                            visited.add(newWord);
                            nextSet.add(newWord);
                        }
                    }
                    chars[i] = original;
                }
            }
            
            beginSet = nextSet;
            level++;
        }
        
        return 0;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
var ladderLength = function(beginWord, endWord, wordList) {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) return 0;
    
    let beginSet = new Set([beginWord]);
    const endSet = new Set([endWord]);
    const visited = new Set();
    
    let level = 1;
    
    while (beginSet.size > 0 && endSet.size > 0) {
        // Always expand smaller set
        if (beginSet.size > endSet.size) {
            [beginSet, endSet] = [endSet, beginSet];
        }
        
        const nextSet = new Set();
        
        for (const word of beginSet) {
            const chars = word.split('');
            for (let i = 0; i < chars.length; i++) {
                const original = chars[i];
                for (let c = 'a'.charCodeAt(0); c <= 'z'.charCodeAt(0); c++) {
                    if (c === original.charCodeAt(0)) continue;
                    
                    chars[i] = String.fromCharCode(c);
                    const newWord = chars.join('');
                    
                    if (endSet.has(newWord)) return level + 1;
                    
                    if (wordSet.has(newWord) && !visited.has(newWord)) {
                        visited.add(newWord);
                        nextSet.add(newWord);
                    }
                }
                chars[i] = original;
            }
        }
        
        beginSet = nextSet;
        level++;
    }
    
    return 0;
};
```
````

### Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| BFS | O(N * L * 26) | O(N) | Standard |
| Bidirectional BFS | O(N * L * 26 / 2) | O(N) | Optimized |

---

## Common Pitfalls

1. **Not Building Adjacency**: Not generating all valid next words. Solution: Change each letter, check if in wordList.

2. **Wrong End Check**: Checking at wrong time. Solution: Check if current word equals endWord.

3. **Performance**: Too many word comparisons. Solution: Use Set for O(1) lookups, precompute neighbors.

4. **Not Adding beginWord**: Forgetting that beginWord may not be in wordList but should still be processed.

5. **Visited Set**: Not marking words as visited can cause infinite loops or redundant processing.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Google, Facebook, Microsoft
- **Difficulty**: Hard
- **Concepts Tested**: BFS, Graph traversal, String manipulation

### Learning Outcomes

1. **BFS Mastery**: Understand level-order traversal
2. **Graph Building**: Learn to build graphs dynamically
3. **Optimization**: Bidirectional search technique
4. **String Manipulation**: Efficient neighbor generation

---

## Related Problems

### Same Pattern (BFS)
| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Word Ladder II](/solutions/word-ladder-ii.md) | 126 | Hard | Find all shortest paths |
| [Minimum Genetic Mutation](/solutions/minimum-genetic-mutation.md) | 433 | Medium | Gene mutation |

### Similar Concepts
| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Open the Lock](/solutions/open-the-lock.md) | 752 | Medium | Lock combination |

---

## Video Tutorial Links

1. **[Word Ladder - NeetCode](https://www.youtube.com/watch?v=)** - Clear explanation
2. **[Bidirectional BFS Explained](https://www.youtube.com/watch?v=)** - Optimization technique

---

## Follow-up Questions

### Q1: How would you return the actual transformation sequence?

**Answer:** Maintain a parent map to reconstruct the path, similar to standard BFS path reconstruction.

### Q2: What if you need all shortest paths?

**Answer:** Use Word Ladder II approach - maintain all parents at each level.

### Q3: How would you handle large dictionaries efficiently?

**Answer:** Precompute intermediate states (e.g., "*ot" -> ["hot", "dot", "lot"]) to avoid generating all 26*L neighbors.

---

## Summary

The **Word Ladder** problem demonstrates classic BFS for finding shortest paths in an implicit graph:

- **Graph Construction**: Build graph dynamically by changing one letter
- **BFS**: Guarantees shortest path in unweighted graph
- **Optimization**: Bidirectional BFS reduces search space
- **Set Operations**: O(1) lookups for efficient processing

Key takeaways:
1. Treat each word as a node in an implicit graph
2. BFS finds shortest transformation sequence
3. Use bidirectional BFS for optimization
4. Generate neighbors on-the-fly instead of building entire graph

This problem is essential for understanding BFS on implicit graphs and optimization techniques.
