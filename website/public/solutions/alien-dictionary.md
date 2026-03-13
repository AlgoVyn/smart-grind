# Alien Dictionary

## Problem Description

There is a new alien language that uses the English alphabet. However, the order of the letters is unknown.

You are given a list of strings `words` from the alien dictionary. The strings in `words` are sorted lexicographically according to the alien language. Return a string representing the unique ordering of characters that is consistent with the given list of words. If there are multiple valid orderings, return any one. If no valid ordering exists, return an empty string.

**Note:** This is LeetCode Problem 269. You can find the original problem [here](https://leetcode.com/problems/alien-dictionary/).

---

## Examples

### Example

**Input:**
```python
words = ["wrt", "wrf", "er", "ett", "rftt"]
```

**Output:**
```python
"wertf"
```

**Explanation:**
- From "wrt" and "wrf", we know 't' comes before 'f'
- From "wrf" and "er", we know 'w' comes before 'e'
- From "er" and "ett", we know 'r' comes before 't'
- From "ett" and "rftt", we know 'e' comes before 'r'

So the valid ordering is "wertf".

### Example 2

**Input:**
```python
words = ["z", "x"]
```

**Output:**
```python
"zx"
```

**Explanation:** Since only two characters, 'z' comes before 'x'.

### Example 3

**Input:**
```python
words = ["z", "x", "z"]
```

**Output:**
```python
""
```

**Explanation:** Invalid because "z" cannot come before "x" in position 0 and then "x" before "z" in position 1.

### Example 4

**Input:**
```python
words = ["abc", "ab"]
```

**Output:**
```python
""
```

**Explanation:** Invalid because "ab" is a prefix of "abc", but appears after it.

---

## Constraints

- `1 <= words.length <= 100`
- `1 <= words[i].length <= 100`
- `words[i]` consists of lowercase English letters

---

## Pattern: Topological Sort (Graph)

This problem is a classic example of **Topological Sorting** using **Kahn's Algorithm**. The key insight is to treat each character as a node in a directed graph and find the order using BFS-based topological sort.

### Core Concept

- **Graph Building**: Create directed edges based on first differing character between consecutive words
- **Kahn's Algorithm**: BFS-based topological sort using indegree
- **Cycle Detection**: Check if all nodes are processed to detect cycles
- **Queue Processing**: Process nodes with indegree 0

---

## Intuition

The key insight for this problem is understanding how to derive character ordering from lexicographically sorted words.

### Key Observations

1. **First Difference Matters**: The order between two words is determined by the first character where they differ. If word1 comes before word2 in the list, then word1's character comes before word2's character in the alien alphabet.

2. **Prefix Case**: If one word is a prefix of another and appears after it, it's invalid (e.g., "ab" after "abc").

3. **Graph Representation**: Each unique character is a node. The ordering constraint creates directed edges between characters.

4. **Topological Sort**: The valid ordering is a topological ordering of the graph. We use Kahn's algorithm (BFS) to find this ordering.

### Algorithm Overview

1. **Build Graph**: Compare consecutive words to find ordering constraints and create directed edges
2. **Calculate Indegree**: Count incoming edges for each character
3. **Kahn's Algorithm**: Use queue to process characters with indegree 0
4. **Detect Cycles**: If not all characters are processed, there's a cycle (invalid)
5. **Return Order**: Join the processed characters

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Kahn's Algorithm (BFS)** - Optimal and most common
2. **DFS-based Topological Sort** - Alternative approach

---

## Approach 1: Kahn's Algorithm (BFS) - Optimal

### Algorithm Steps

1. Initialize graph (adjacency list) and indegree dictionary with all unique characters
2. Compare consecutive words to build the graph:
   - Find first differing character between word[i] and word[i+1]
   - Add directed edge from word[i][j] to word[i+1][j]
   - Increment indegree of the second character
   - Handle prefix case (if word1 is prefix of word2 and longer, return "")
3. Initialize queue with characters having indegree 0
4. Process queue:
   - Dequeue character, add to result
   - For each neighbor, decrement indegree
   - If neighbor's indegree becomes 0, enqueue it
5. If result length equals number of unique characters, return result; otherwise return ""

### Why It Works

Kahn's algorithm works because:
- Characters with indegree 0 have no prerequisites and can come first
- By processing these and removing their edges, we progressively reveal more characters that can be ordered
- If we can process all characters, there's a valid topological order
- If some characters remain unprocessed, there's a cycle (no valid order)

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def alienOrder(self, words: List[str]) -> str:
        """
        Find the alien dictionary order using Kahn's Algorithm (BFS).
        
        Args:
            words: List of words sorted in alien dictionary order
            
        Returns:
            Valid alien dictionary order or empty string if invalid
        """
        if not words:
            return ""
            
        # Step 1: Initialize graph and indegree
        graph = defaultdict(list)
        indegree = {c: 0 for word in words for c in word}
        
        # Step 2: Build graph by comparing consecutive words
        for i in range(len(words) - 1):
            w1, w2 = words[i], words[i + 1]
            min_len = min(len(w1), len(w2))
            
            for j in range(min_len):
                if w1[j] != w2[j]:
                    # w1[j] comes before w2[j]
                    graph[w1[j]].append(w2[j])
                    indegree[w2[j]] += 1
                    break
            else:
                # w1 is prefix of w2 - check if invalid (w1 longer)
                if len(w1) > len(w2):
                    return ""
        
        # Step 3: Kahn's algorithm - BFS
        queue = deque([c for c in indegree if indegree[c] == 0])
        order = []
        
        while queue:
            curr = queue.popleft()
            order.append(curr)
            
            # Process all neighbors
            for nei in graph[curr]:
                indegree[nei] -= 1
                if indegree[nei] == 0:
                    queue.append(nei)
        
        # Step 4: Check for cycle
        if len(order) != len(indegree):
            return ""
        
        return "".join(order)
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <queue>
using namespace std;

class Solution {
public:
    string alienOrder(vector<string>& words) {
        if (words.empty()) return "";
        
        // Step 1: Initialize graph and indegree
        unordered_map<char, vector<char>> graph;
        unordered_map<char, int> indegree;
        
        // Initialize all characters
        for (const string& word : words) {
            for (char c : word) {
                if (graph.find(c) == graph.end()) {
                    graph[c] = {};
                    indegree[c] = 0;
                }
            }
        }
        
        // Step 2: Build graph
        for (int i = 0; i < words.size() - 1; i++) {
            const string& w1 = words[i];
            const string& w2 = words[i + 1];
            int minLen = min(w1.length(), w2.length());
            
            for (int j = 0; j < minLen; j++) {
                if (w1[j] != w2[j]) {
                    graph[w1[j]].push_back(w2[j]);
                    indegree[w2[j]]++;
                    break;
                }
            }
            
            // Check prefix case
            if (minLen == w2.length() && w1.length() > w2.length()) {
                return "";
            }
        }
        
        // Step 3: Kahn's algorithm
        queue<char> q;
        for (auto& [c, degree] : indegree) {
            if (degree == 0) q.push(c);
        }
        
        string order;
        while (!q.empty()) {
            char curr = q.front();
            q.pop();
            order += curr;
            
            for (char nei : graph[curr]) {
                indegree[nei]--;
                if (indegree[nei] == 0) {
                    q.push(nei);
                }
            }
        }
        
        // Step 4: Check for cycle
        return order.length() == indegree.size() ? order : "";
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public String alienOrder(String[] words) {
        if (words == null || words.length == 0) return "";
        
        // Step 1: Initialize graph and indegree
        Map<Character, List<Character>> graph = new HashMap<>();
        Map<Character, Integer> indegree = new HashMap<>();
        
        // Initialize all characters
        for (String word : words) {
            for (char c : word.toCharArray()) {
                graph.putIfAbsent(c, new ArrayList<>());
                indegree.putIfAbsent(c, 0);
            }
        }
        
        // Step 2: Build graph
        for (int i = 0; i < words.length - 1; i++) {
            String w1 = words[i];
            String w2 = words[i + 1];
            int minLen = Math.min(w1.length(), w2.length());
            
            for (int j = 0; j < minLen; j++) {
                if (w1.charAt(j) != w2.charAt(j)) {
                    graph.get(w1.charAt(j)).add(w2.charAt(j));
                    indegree.put(w2.charAt(j), indegree.get(w2.charAt(j)) + 1);
                    break;
                }
            }
            
            // Check prefix case
            if (minLen == w2.length() && w1.length() > w2.length()) {
                return "";
            }
        }
        
        // Step 3: Kahn's algorithm
        Queue<Character> queue = new LinkedList<>();
        for (Map.Entry<Character, Integer> entry : indegree.entrySet()) {
            if (entry.getValue() == 0) {
                queue.offer(entry.getKey());
            }
        }
        
        StringBuilder order = new StringBuilder();
        while (!queue.isEmpty()) {
            char curr = queue.poll();
            order.append(curr);
            
            for (char nei : graph.get(curr)) {
                indegree.put(nei, indegree.get(nei) - 1);
                if (indegree.get(nei) == 0) {
                    queue.offer(nei);
                }
            }
        }
        
        // Step 4: Check for cycle
        return order.length() == indegree.size() ? order.toString() : "";
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string[]} words
 * @return {string}
 */
var alienOrder = function(words) {
    if (!words || words.length === 0) return "";
    
    // Step 1: Initialize graph and indegree
    const graph = new Map();
    const indegree = new Map();
    
    // Initialize all characters
    for (const word of words) {
        for (const c of word) {
            if (!graph.has(c)) {
                graph.set(c, []);
                indegree.set(c, 0);
            }
        }
    }
    
    // Step 2: Build graph
    for (let i = 0; i < words.length - 1; i++) {
        const w1 = words[i];
        const w2 = words[i + 1];
        const minLen = Math.min(w1.length, w2.length);
        
        for (let j = 0; j < minLen; j++) {
            if (w1[j] !== w2[j]) {
                graph.get(w1[j]).push(w2[j]);
                indegree.set(w2[j], indegree.get(w2[j]) + 1);
                break;
            }
        }
        
        // Check prefix case
        if (minLen === w2.length && w1.length > w2.length) {
            return "";
        }
    }
    
    // Step 3: Kahn's algorithm
    const queue = [];
    for (const [c, degree] of indegree) {
        if (degree === 0) queue.push(c);
    }
    
    let order = "";
    while (queue.length > 0) {
        const curr = queue.shift();
        order += curr;
        
        for (const nei of graph.get(curr)) {
            indegree.set(nei, indegree.get(nei) - 1);
            if (indegree.get(nei) === 0) {
                queue.push(nei);
            }
        }
    }
    
    // Step 4: Check for cycle
    return order.length === indegree.size ? order : "";
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N) - where N is total characters, each processed once |
| **Space** | O(V) - where V is unique characters (max 26 for English alphabet) |

---

## Approach 2: DFS-based Topological Sort

### Algorithm Steps

1. Build graph and visited set (three states: unvisited, visiting, visited)
2. DFS from each unvisited character
3. Add character to result after visiting all its dependencies
4. Detect cycles by checking for back edges
5. Reverse the result for correct order

### Why It Works

DFS-based topological sort works because:
- We visit all dependencies before adding a character to result
- If we encounter a character that's currently being visited, there's a cycle
- Reversing the result gives the correct topological order

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def alienOrder(self, words: List[str]) -> str:
        """DFS-based topological sort approach."""
        if not words:
            return ""
        
        # Build graph
        graph = defaultdict(list)
        indegree = {c: 0 for word in words for c in word}
        
        for i in range(len(words) - 1):
            w1, w2 = words[i], words[i + 1]
            min_len = min(len(w1), len(w2))
            
            for j in range(min_len):
                if w1[j] != w2[j]:
                    graph[w1[j]].append(w2[j])
                    indegree[w2[j]] += 1
                    break
            else:
                if len(w1) > len(w2):
                    return ""
        
        # DFS with cycle detection
        visited = {}  # 0: unvisited, 1: visiting, 2: visited
        result = []
        
        def dfs(char):
            if char in visited:
                return visited[char] == 2
            
            visited[char] = 1  # Mark as visiting
            
            for nei in graph[char]:
                if not dfs(nei):
                    return False
            
            visited[char] = 2  # Mark as visited
            result.append(char)
            return True
        
        # Try DFS from each character
        for char in indegree:
            if char not in visited:
                if not dfs(char):
                    return ""
        
        return "".join(reversed(result))
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_map>
using namespace std;

class Solution {
public:
    string alienOrder(vector<string>& words) {
        if (words.empty()) return "";
        
        // Build graph
        unordered_map<char, vector<char>> graph;
        unordered_map<char, int> indegree;
        
        for (const string& word : words) {
            for (char c : word) {
                if (graph.find(c) == graph.end()) {
                    graph[c] = {};
                    indegree[c] = 0;
                }
            }
        }
        
        for (int i = 0; i < words.size() - 1; i++) {
            const string& w1 = words[i];
            const string& w2 = words[i + 1];
            int minLen = min(w1.length(), w2.length());
            
            for (int j = 0; j < minLen; j++) {
                if (w1[j] != w2[j]) {
                    graph[w1[j]].push_back(w2[j]);
                    indegree[w2[j]]++;
                    break;
                }
            }
            
            if (minLen == w2.length() && w1.length() > w2.length()) {
                return "";
            }
        }
        
        // DFS
        unordered_map<char, int> visited;  // 0: unvisited, 1: visiting, 2: visited
        string result;
        
        function<bool(char)> dfs = [&](char c) -> bool {
            if (visited.count(c)) {
                return visited[c] == 2;
            }
            
            visited[c] = 1;
            
            for (char nei : graph[c]) {
                if (!dfs(nei)) return false;
            }
            
            visited[c] = 2;
            result += c;
            return true;
        };
        
        for (auto& [c, _] : indegree) {
            if (!visited.count(c)) {
                if (!dfs(c)) return "";
            }
        }
        
        reverse(result.begin(), result.end());
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    private Map<Character, List<Character>> graph = new HashMap<>();
    private Map<Character, Integer> visited = new HashMap<>();
    private StringBuilder result = new StringBuilder();
    
    public String alienOrder(String[] words) {
        if (words == null || words.length == 0) return "";
        
        // Build graph
        Map<Character, Integer> indegree = new HashMap<>();
        for (String word : words) {
            for (char c : word.toCharArray()) {
                graph.putIfAbsent(c, new ArrayList<>());
                indegree.putIfAbsent(c, 0);
            }
        }
        
        for (int i = 0; i < words.length - 1; i++) {
            String w1 = words[i];
            String w2 = words[i + 1];
            int minLen = Math.min(w1.length(), w2.length());
            
            for (int j = 0; j < minLen; j++) {
                if (w1.charAt(j) != w2.charAt(j)) {
                    graph.get(w1.charAt(j)).add(w2.charAt(j));
                    indegree.put(w2.charAt(j), indegree.get(w2.charAt(j)) + 1);
                    break;
                }
            }
            
            if (minLen == w2.length() && w1.length() > w2.length()) {
                return "";
            }
        }
        
        // DFS
        for (char c : indegree.keySet()) {
            if (!visited.containsKey(c)) {
                if (!dfs(c)) return "";
            }
        }
        
        return result.reverse().toString();
    }
    
    private boolean dfs(char c) {
        if (visited.containsKey(c)) {
            return visited.get(c) == 2;
        }
        
        visited.put(c, 1);
        
        for (char nei : graph.get(c)) {
            if (!dfs(nei)) return false;
        }
        
        visited.put(c, 2);
        result.append(c);
        return true;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string[]} words
 * @return {string}
 */
var alienOrder = function(words) {
    if (!words || words.length === 0) return "";
    
    // Build graph
    const graph = new Map();
    const indegree = new Map();
    
    for (const word of words) {
        for (const c of word) {
            if (!graph.has(c)) {
                graph.set(c, []);
                indegree.set(c, 0);
            }
        }
    }
    
    for (let i = 0; i < words.length - 1; i++) {
        const w1 = words[i];
        const w2 = words[i + 1];
        const minLen = Math.min(w1.length, w2.length);
        
        for (let j = 0; j < minLen; j++) {
            if (w1[j] !== w2[j]) {
                graph.get(w1[j]).push(w2[j]);
                indegree.set(w2[j], indegree.get(w2[j]) + 1);
                break;
            }
        }
        
        if (minLen === w2.length && w1.length > w2.length) {
            return "";
        }
    }
    
    // DFS
    const visited = new Map();  // 0: unvisited, 1: visiting, 2: visited
    let result = "";
    
    function dfs(c) {
        if (visited.has(c)) {
            return visited.get(c) === 2;
        }
        
        visited.set(c, 1);
        
        for (const nei of graph.get(c)) {
            if (!dfs(nei)) return false;
        }
        
        visited.set(c, 2);
        result += c;
        return true;
    }
    
    for (const c of indegree.keys()) {
        if (!visited.has(c)) {
            if (!dfs(c)) return "";
        }
    }
    
    return result.split("").reverse().join("");
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N) - where N is total characters |
| **Space** | O(V) - for recursion stack and visited set |

---

## Comparison of Approaches

| Aspect | Kahn's Algorithm (BFS) | DFS Topological Sort |
|--------|-------------------------|---------------------|
| **Time Complexity** | O(N) | O(N) |
| **Space Complexity** | O(V) | O(V) |
| **Implementation** | Iterative | Recursive |
| **Cycle Detection** | Check processed count | Visited state tracking |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Medium | Medium |

**Best Approach:** Use Kahn's Algorithm (BFS) as it's more intuitive and easier to debug. The DFS approach is useful when you need to detect cycles during traversal.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Facebook, Amazon, Microsoft
- **Difficulty**: Hard
- **Concepts Tested**: Graph Theory, Topological Sort, BFS, DFS, Cycle Detection

### Learning Outcomes

1. **Topological Sort Mastery**: Learn Kahn's algorithm and DFS-based approaches
2. **Graph Building**: Create graphs from constraints
3. **Cycle Detection**: Detect invalid inputs using graph properties
4. **Problem Solving**: Convert real-world ordering problems to graph problems

---

## Related Problems

Based on similar themes (graph, topological sort, ordering):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Course Schedule | [Link](https://leetcode.com/problems/course-schedule/) | Determine if all courses can be completed |
| Course Schedule II | [Link](https://leetcode.com/problems/course-schedule-ii/) | Find valid course ordering |
| Sequence Reconstruction | [Link](https://leetcode.com/problems/sequence-reconstruction/) | Check if sequence can be reconstructed |
| Minimum Height Trees | [Link](https://leetcode.com/problems/minimum-height-trees/) | Find centers of tree |
| Find Order | [Link](https://leetcode.com/problems/find-order/) | Alien dictionary with extra info |

### Pattern Reference

For more detailed explanations of the Topological Sort pattern, see:
- **[Topological Sort](/patterns/topological-sort)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Alien Dictionary](https://www.youtube.com/watch?v=2gt5JriocQU)** - Clear explanation with visual examples
2. **[Alien Dictionary - LeetCode 269](https://www.youtube.com/watch?v=zwq3cqMv5Xg)** - Detailed walkthrough
3. **[Topological Sort Tutorial](https://www.youtube.com/watch?v=ddTC4ZovHTk)** - Understanding topological sort

### Related Concepts

- **[Kahn's Algorithm](https://www.youtube.com/watch?v=JSjFfG6SlyU)** - BFS topological sort
- **[DFS Graph Traversal](https://www.youtube.com/watch?v=Pc6k25M3KBU)** - DFS fundamentals

---

## Follow-up Questions

### Q1: How would you handle more than 26 characters?

**Answer:** Use a larger character set or Unicode. The algorithm remains the same - just the space complexity changes. You might use a hash map instead of array for indegree.

### Q2: How would you return all valid orderings?

**Answer:** Use backtracking instead of Kahn's algorithm. At each step, try all characters with indegree 0 and recursively build orderings.

### Q3: What if words can have duplicates?

**Answer:** The algorithm already handles duplicates since we use sets to track unique characters. Duplicates don't create additional constraints.

### Q4: How would you optimize for early termination?

**Answer:** Return early if a cycle is detected during processing. In Kahn's algorithm, you can check after each removal if the remaining unprocessed characters form a cycle.

### Q5: Can you solve without building explicit graph?

**Answer:** It's challenging because you need to track the ordering constraints somehow. The graph approach is the most natural and efficient.

---

## Common Pitfalls

### 1. Not Handling Prefix Case
**Issue:** Not checking when one word is prefix of another.

**Solution:** If first word is longer than second and is a prefix, return empty string (invalid).

### 2. Not Initializing All Characters
**Issue:** Missing characters that don't appear in ordering.

**Solution:** Initialize indegree dict with all unique characters from all words.

### 3. Breaking Too Early
**Issue:** Breaking after first differing character incorrectly.

**Solution:** Use else clause on for loop to properly handle prefix check. Only add edge when you find first difference.

### 4. Not Detecting Cycles
**Issue:** Returning order without checking for cycles.

**Solution:** Check if order length equals number of unique characters. If not, there's a cycle.

### 5. Wrong Result Order
**Issue:** Returning result in wrong order.

**Solution:** Kahn's algorithm produces result in correct order. For DFS, reverse the result since we add after exploring all dependencies.

---

## Summary

The **Alien Dictionary** problem demonstrates the **Topological Sort** pattern:

- **Graph building**: Create directed edges based on first differing character between consecutive words
- **Kahn's algorithm**: BFS-based topological sort using indegree
- **Cycle detection**: Check if all nodes are processed
- **Time complexity**: O(N) - processing each character once

Key takeaways:
1. Compare consecutive words to find ordering constraints
2. Build directed graph of character dependencies
3. Use BFS (Kahn's) or DFS for topological sort
4. Detect cycles by checking if all characters are processed
5. Handle prefix case properly

This pattern extends to:
- Course Schedule problems
- Dependency resolution
- Build system ordering
- Task scheduling

---

## Additional Resources

- [LeetCode Problem 269](https://leetcode.com/problems/alien-dictionary/) - Official problem page
- [Topological Sort - GeeksforGeeks](https://www.geeksforgeeks.org/topological-sorting/) - Detailed topological sort explanation
- [Kahn's Algorithm](https://www.geeksforgeeks.org/kahns-algorithm-topological-sorting/) - BFS topological sort
- [Pattern: Topological Sort](/patterns/topological-sort) - Comprehensive pattern guide
