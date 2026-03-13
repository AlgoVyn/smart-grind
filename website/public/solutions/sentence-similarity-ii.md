# Sentence Similarity II

## Problem Description

Given two sentences `sentence1` and `sentence2` (each is an array of strings), and a list of word pairs `similarPairs`, where similarity is transitive, determine if the two sentences are similar.

Two sentences are similar if:
1. They have the same length.
2. For each corresponding pair of words at the same position, the words are either identical or similar (directly or through transitivity).

For example, if "great" is similar to "fine", and "fine" is similar to "good", then "great" is similar to "good" through transitivity.

**Link to problem:** [Sentence Similarity II - LeetCode 737](https://leetcode.com/problems/sentence-similarity-ii/)

## Examples

**Example 1:**
- Input: `sentence1 = ["great","acting","skills"], sentence2 = ["fine","drama","talent"], similarPairs = [["great","fine"],["acting","drama"],["skills","talent"]]`
- Output: `true`

**Explanation:**
- "great" = "great" (identical)
- "acting" similar to "drama" (direct pair)
- "skills" similar to "talent" (direct pair)
- All corresponding words match, so sentences are similar

**Example 2:**
- Input: `sentence1 = ["I","love","leetcode"], sentence2 = ["I","love","programming"], similarPairs = [["I","programming"]]`
- Output: `false`

**Explanation:**
- "I" = "I" (identical)
- "love" = "love" (identical)
- "leetcode" vs "programming" - not similar (only "I" is similar to "programming", not "leetcode")

**Example 3 (Transitivity):**
- Input: `sentence1 = ["great"], sentence2 = ["good"], similarPairs = [["great","fine"],["fine","good"]]`
- Output: `true`

**Explanation:** "great" → "fine" → "good" (transitive chain)

## Constraints

- `1 <= sentence1.length, sentence2.length <= 100`
- `0 <= similarPairs.length <= 5000`
- All words consist of lowercase English letters
- `1 <= each word length <= 20`

---

## Pattern: Union-Find (Disjoint Set Union)

This problem is a classic example of the **Union-Find (Disjoint Set Union)** pattern. The pattern is used to track connected components and efficiently answer connectivity queries.

### Core Concept

The fundamental idea is to use Union-Find to group similar words together:
- **Union Operation**: Merge two words into the same set when they are similar
- **Find Operation**: Determine if two words belong to the same set (are similar)
- **Path Compression**: Optimize find by making each node point directly to the root
- **Union by Rank**: Optimize union by always attaching smaller tree under larger tree

---

## Intuition

The key insight for this problem is understanding transitive similarity:

1. **Similarity is Transitive**: If A is similar to B, and B is similar to C, then A is similar to C
2. **Graph Representation**: Each word is a node, similar pairs are edges
3. **Connected Components**: All words in the same connected component are similar
4. **Union-Find Solution**: Use Union-Find to group similar words, then check if corresponding words are in the same group

### Why Union-Find?

- **Efficient Queries**: Find operation is nearly O(1) with path compression
- **Transitivity Handling**: Naturally handles transitive relationships
- **Scalability**: Works well with up to 5000 similar pairs

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Union-Find (Optimal)** - O(P × α(W)) time, O(W) space
2. **Graph with DFS/BFS** - O(P + W) time, O(W + E) space

---

## Approach 1: Union-Find (Optimal)

This is the optimal approach using Union-Find to group similar words together.

### Algorithm Steps

1. **Length Check**: If sentences have different lengths, return `false`
2. **Initialize Union-Find**: Create parent dictionary for all unique words
3. **Union Similar Pairs**: For each pair (a, b), union a and b
4. **Check Similarity**: For each position i, check if sentence1[i] and sentence2[i] are in the same set
5. **Return Result**: `true` if all corresponding words are similar

### Why It Works

Union-Find naturally handles transitive similarity because:
- After unioning all similar pairs, all words in the same set are connected
- Two words are similar if they share the same root (representative)
- Path compression ensures efficient lookups

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def areSentencesSimilarTwo(self, sentence1: List[str], sentence2: List[str], similarPairs: List[List[str]]) -> bool:
        """
        Determine if two sentences are similar using Union-Find.
        
        Args:
            sentence1: First sentence as list of words
            sentence2: Second sentence as list of words
            similarPairs: List of [word1, word2] pairs indicating similarity
            
        Returns:
            True if sentences are similar, False otherwise
        """
        # Step 1: Length check
        if len(sentence1) != len(sentence2):
            return False
        
        # Step 2: Initialize Union-Find
        parent = {}
        
        def find(x):
            """Find the root of x with path compression."""
            if x not in parent:
                parent[x] = x
            if parent[x] != x:
                parent[x] = find(parent[x])  # Path compression
            return parent[x]
        
        def union(x, y):
            """Union two sets."""
            px, py = find(x), find(y)
            if px != py:
                parent[px] = py
        
        # Step 3: Union all similar pairs
        for a, b in similarPairs:
            union(a, b)
        
        # Step 4: Check each corresponding word
        for w1, w2 in zip(sentence1, sentence2):
            if w1 == w2:
                continue  # Identical words are always similar
            if find(w1) != find(w2):
                return False
        
        return True
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_map>
using namespace std;

class Solution {
public:
    bool areSentencesSimilarTwo(vector<string>& sentence1, 
                               vector<string>& sentence2, 
                               vector<vector<string>>& similarPairs) {
        /**
         * Determine if two sentences are similar using Union-Find.
         * 
         * @param sentence1: First sentence as list of words
         * @param sentence2: Second sentence as list of words
         * @param similarPairs: List of [word1, word2] pairs indicating similarity
         * @return: True if sentences are similar, False otherwise
         */
        // Step 1: Length check
        if (sentence1.size() != sentence2.size()) {
            return false;
        }
        
        // Step 2: Initialize Union-Find
        unordered_map<string, string> parent;
        
        function<string(string)> find = [&](string x) -> string {
            if (parent.find(x) == parent.end()) {
                parent[x] = x;
            }
            if (parent[x] != x) {
                parent[x] = find(parent[x]);  // Path compression
            }
            return parent[x];
        };
        
        auto unionSets = [&](string x, string y) {
            string px = find(x);
            string py = find(y);
            if (px != py) {
                parent[px] = py;
            }
        };
        
        // Step 3: Union all similar pairs
        for (const auto& pair : similarPairs) {
            unionSets(pair[0], pair[1]);
        }
        
        // Step 4: Check each corresponding word
        for (size_t i = 0; i < sentence1.size(); i++) {
            const string& w1 = sentence1[i];
            const string& w2 = sentence2[i];
            if (w1 == w2) continue;
            if (find(w1) != find(w2)) {
                return false;
            }
        }
        
        return true;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public boolean areSentencesSimilarTwo(String[] sentence1, 
                                         String[] sentence2, 
                                         List<List<String>> similarPairs) {
        /**
         * Determine if two sentences are similar using Union-Find.
         * 
         * @param sentence1: First sentence as array of words
         * @param sentence2: Second sentence as array of words
         * @param similarPairs: List of [word1, word2] pairs indicating similarity
         * @return: True if sentences are similar, False otherwise
         */
        // Step 1: Length check
        if (sentence1.length != sentence2.length) {
            return false;
        }
        
        // Step 2: Initialize Union-Find
        Map<String, String> parent = new HashMap<>();
        
        String find(String x) {
            if (!parent.containsKey(x)) {
                parent.put(x, x);
            }
            if (!parent.get(x).equals(x)) {
                parent.put(x, find(parent.get(x)));  // Path compression
            }
            return parent.get(x);
        }
        
        void union(String x, String y) {
            String px = find(x);
            String py = find(y);
            if (!px.equals(py)) {
                parent.put(px, py);
            }
        }
        
        // Step 3: Union all similar pairs
        for (List<String> pair : similarPairs) {
            union(pair.get(0), pair.get(1));
        }
        
        // Step 4: Check each corresponding word
        for (int i = 0; i < sentence1.length; i++) {
            String w1 = sentence1[i];
            String w2 = sentence2[i];
            if (w1.equals(w2)) continue;
            if (!find(w1).equals(find(w2))) {
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
 * Determine if two sentences are similar using Union-Find.
 * 
 * @param {string[]} sentence1 - First sentence as array of words
 * @param {string[]} sentence2 - Second sentence as array of words
 * @param {string[][]} similarPairs - List of [word1, word2] pairs indicating similarity
 * @return {boolean} - True if sentences are similar, False otherwise
 */
var areSentencesSimilarTwo = function(sentence1, sentence2, similarPairs) {
    // Step 1: Length check
    if (sentence1.length !== sentence2.length) {
        return false;
    }
    
    // Step 2: Initialize Union-Find
    const parent = new Map();
    
    const find = (x) => {
        if (!parent.has(x)) {
            parent.set(x, x);
        }
        if (parent.get(x) !== x) {
            parent.set(x, find(parent.get(x)));  // Path compression
        }
        return parent.get(x);
    };
    
    const union = (x, y) => {
        const px = find(x);
        const py = find(y);
        if (px !== py) {
            parent.set(px, py);
        }
    };
    
    // Step 3: Union all similar pairs
    for (const [a, b] of similarPairs) {
        union(a, b);
    }
    
    // Step 4: Check each corresponding word
    for (let i = 0; i < sentence1.length; i++) {
        const w1 = sentence1[i];
        const w2 = sentence2[i];
        if (w1 === w2) continue;
        if (find(w1) !== find(w2)) {
            return false;
        }
    }
    
    return true;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(P × α(W) + N) where P = number of pairs, W = unique words, N = sentence length |
| **Space** | O(W) for parent dictionary |

---

## Approach 2: Graph with DFS/BFS

This approach builds an adjacency list graph and uses BFS/DFS to check similarity between words.

### Algorithm Steps

1. **Length Check**: If sentences have different lengths, return `false`
2. **Build Graph**: Create adjacency list from similar pairs (bidirectional)
3. **Check Each Pair**: For each position, check if words are connected using BFS/DFS
4. **Return Result**: `true` if all corresponding words are connected

### Why It Works

Building a graph and performing BFS/DFS naturally handles transitive relationships by exploring all connected nodes.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def areSentencesSimilarTwo_dfs(self, sentence1: List[str], sentence2: List[str], similarPairs: List[List[str]]) -> bool:
        """
        Determine if two sentences are similar using DFS on graph.
        """
        if len(sentence1) != len(sentence2):
            return False
        
        # Build graph (bidirectional)
        graph = defaultdict(set)
        for a, b in similarPairs:
            graph[a].add(b)
            graph[b].add(a)
        
        def dfs(start, target, visited):
            """DFS to check if start and target are connected."""
            if start == target:
                return True
            visited.add(start)
            for neighbor in graph[start]:
                if neighbor not in visited:
                    if dfs(neighbor, target, visited):
                        return True
            return False
        
        # Check each corresponding word
        for w1, w2 in zip(sentence1, sentence2):
            if w1 == w2:
                continue
            if w1 not in graph or w2 not in graph:
                return False
            if not dfs(w1, w2, set()):
                return False
        
        return True
```

<!-- slide -->
```cpp
class Solution {
public:
    bool areSentencesSimilarTwo(vector<string>& sentence1, 
                               vector<string>& sentence2, 
                               vector<vector<string>>& similarPairs) {
        if (sentence1.size() != sentence2.size()) return false;
        
        // Build graph
        unordered_map<string, unordered_set<string>> graph;
        for (const auto& pair : similarPairs) {
            graph[pair[0]].insert(pair[1]);
            graph[pair[1]].insert(pair[0]);
        }
        
        for (size_t i = 0; i < sentence1.size(); i++) {
            if (sentence1[i] == sentence2[i]) continue;
            if (!isConnected(graph, sentence1[i], sentence2[i])) {
                return false;
            }
        }
        return true;
    }
    
private:
    bool isConnected(unordered_map<string, unordered_set<string>>& graph,
                     string& start, string& target) {
        if (graph.find(start) == graph.end() || 
            graph.find(target) == graph.end()) {
            return false;
        }
        
        unordered_set<string> visited;
        queue<string> q;
        q.push(start);
        visited.insert(start);
        
        while (!q.empty()) {
            string curr = q.front();
            q.pop();
            if (curr == target) return true;
            
            for (const string& neighbor : graph[curr]) {
                if (visited.find(neighbor) == visited.end()) {
                    visited.insert(neighbor);
                    q.push(neighbor);
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
    public boolean areSentencesSimilarTwo(String[] sentence1, 
                                         String[] sentence2, 
                                         List<List<String>> similarPairs) {
        if (sentence1.length != sentence2.length) return false;
        
        // Build graph
        Map<String, Set<String>> graph = new HashMap<>();
        for (List<String> pair : similarPairs) {
            graph.computeIfAbsent(pair.get(0), k -> new HashSet<>()).add(pair.get(1));
            graph.computeIfAbsent(pair.get(1), k -> new HashSet<>()).add(pair.get(0));
        }
        
        for (int i = 0; i < sentence1.length; i++) {
            if (sentence1[i].equals(sentence2[i])) continue;
            if (!isConnected(graph, sentence1[i], sentence2[i])) {
                return false;
            }
        }
        return true;
    }
    
    private boolean isConnected(Map<String, Set<String>> graph, 
                                String start, String target) {
        if (!graph.containsKey(start) || !graph.containsKey(target)) {
            return false;
        }
        
        Set<String> visited = new HashSet<>();
        Queue<String> q = new LinkedList<>();
        q.add(start);
        visited.add(start);
        
        while (!q.isEmpty()) {
            String curr = q.poll();
            if (curr.equals(target)) return true;
            
            for (String neighbor : graph.get(curr)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    q.add(neighbor);
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
 * Determine if two sentences are similar using BFS on graph.
 * 
 * @param {string[]} sentence1 - First sentence as array of words
 * @param {string[]} sentence2 - Second sentence as array of words
 * @param {string[][]} similarPairs - List of similar word pairs
 * @return {boolean} - True if sentences are similar, False otherwise
 */
var areSentencesSimilarTwo = function(sentence1, sentence2, similarPairs) {
    if (sentence1.length !== sentence2.length) return false;
    
    // Build graph
    const graph = new Map();
    for (const [a, b] of similarPairs) {
        if (!graph.has(a)) graph.set(a, new Set());
        if (!graph.has(b)) graph.set(b, new Set());
        graph.get(a).add(b);
        graph.get(b).add(a);
    }
    
    const isConnected = (start, target) => {
        if (!graph.has(start) || !graph.has(target)) return false;
        
        const visited = new Set();
        const queue = [start];
        visited.add(start);
        
        while (queue.length > 0) {
            const curr = queue.shift();
            if (curr === target) return true;
            
            for (const neighbor of graph.get(curr)) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        return false;
    };
    
    for (let i = 0; i < sentence1.length; i++) {
        if (sentence1[i] === sentence2[i]) continue;
        if (!isConnected(sentence1[i], sentence2[i])) return false;
    }
    return true;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(P × (V + E)) in worst case for all word pairs |
| **Space** | O(V + E) for graph storage |

---

## Comparison of Approaches

| Aspect | Union-Find | Graph BFS/DFS |
|--------|-----------|---------------|
| **Time Complexity** | O(P × α(W) + N) | O(P × (V + E)) |
| **Space Complexity** | O(W) | O(V + E) |
| **Query Time** | O(α(W)) ~ O(1) | O(V + E) |
| **Implementation** | Moderate | Simple |
| **Best For** | Multiple queries | Single query |

**Best Approach:** Union-Find is optimal for this problem due to its near-constant query time and efficient handling of transitive relationships.

---

## Why Union-Find is Optimal for This Problem

The Union-Find approach is optimal because:

1. **Transitivity Handling**: Naturally handles transitive similarity through connected components
2. **Efficient Queries**: Near O(1) query time with path compression and union by rank
3. **Scalability**: Works well with up to 5000 similar pairs
4. **Simplicity**: Straightforward implementation

The key insight is that similarity forms equivalence classes (connected components), and Union-Find efficiently maintains these classes.

---

## Related Problems

Based on similar themes (Union-Find, graph connectivity, transitive relationships):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Provinces | [Link](https://leetcode.com/problems/number-of-provinces/) | Count connected components in graph |
| Friend Circles | [Link](https://leetcode.com/problems/friend-circles/) | Find friend groups using Union-Find |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Graph Valid Tree | [Link](https://leetcode.com/problems/graph-valid-tree/) | Check if graph forms valid tree |
| Redundant Connection | [Link](https://leetcode.com/problems/redundant-connection/) | Find edge that creates cycle |
| Sentence Similarity | [Link](https://leetcode.com/problems/sentence-similarity/) | Non-transitive similarity check |
| Satisfiability of Equality Equations | [Link](https://leetcode.com/problems/satisfiability-of-equality-equations/) | Union-Find with equations |

### Pattern Reference

For more detailed explanations of the Union-Find pattern and its variations, see:
- **[Graph - Union Find (DSU) Pattern](/patterns/graph-union-find-disjoint-set-union-dsu)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Union-Find Technique

- [NeetCode - Sentence Similarity II](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - Clear explanation with visual examples
- [Union-Find Data Structure](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Complete Union-Find tutorial
- [Disjoint Set Union Explained](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Detailed explanation

### Graph Approaches

- [BFS for Word Ladder](https://www.youtube.com/watch?v=qZ19 postX1vQ) - Similar word transformation problem
- [DFS for Connectivity](https://www.youtube.com/watch?v=qZ19 postX1vQ) - Graph connectivity with DFS

---

## Follow-up Questions

### Q1: What is the time complexity with path compression and union by rank?

**Answer:** With both optimizations, the time complexity is O(P × α(W) + N), where α(W) is the inverse Ackermann function, which is practically constant (less than 5 for all realistic inputs).

---

### Q2: How would you handle case sensitivity?

**Answer:** Convert all words to lowercase (or uppercase) before processing. This ensures that "Great" and "great" are treated as the same word.

---

### Q3: What if we need to handle non-transitive similarity only?

**Answer:** This is the problem "Sentence Similarity" (LeetCode 734). Instead of Union-Find, use a HashSet to store only direct similar pairs and check if each word pair exists in the set.

---

### Q4: How would you optimize for memory with very large datasets?

**Answer:** Use union by rank to keep trees balanced, and implement path compression properly. Consider using integer IDs instead of strings to reduce memory overhead.

---

### Q5: What edge cases should be tested?

**Answer:**
- Empty similar pairs
- Identical sentences
- Sentences of different lengths
- Words not in similar pairs
- Circular similarity (A→B→A)
- Self-similarity (A→A)
- Large number of pairs

---

### Q6: How would you find the similarity chain between two words?

**Answer:** Use BFS to find the shortest path between two words in the graph. Store parent pointers during BFS to reconstruct the path.

---

### Q7: Can this be solved without Union-Find using only hash maps?

**Answer:** Yes, you could use a hash map where each word maps to its "representative" and manually implement find with path compression. However, Union-Find provides a cleaner implementation.

---

## Common Pitfalls

### 1. Not Initializing Words Not in Similar Pairs
**Issue:** Words that appear only in sentences but not in similarPairs are not in parent dictionary.

**Solution:** The find function initializes words on-the-fly when first accessed.

### 2. Forgetting Bidirectional Edges
**Issue:** Graph should be bidirectional since similarity is symmetric.

**Solution:** Add both directions when building graph: graph[a].add(b) and graph[b].add(a).

### 3. Not Checking Length First
**Issue:** Different length sentences can never be similar.

**Solution:** Always check sentence lengths first before processing.

### 4. Path Compression Implementation
**Issue:** Incorrect path compression leads to poor performance.

**Solution:** Make sure to update parent[x] = find(parent[x]) recursively.

---

## Summary

The **Sentence Similarity II** problem demonstrates the power of Union-Find for handling transitive relationships:

- **Union-Find approach**: Efficiently groups similar words into connected components
- **Graph approach**: BFS/DFS for connectivity checking
- **Time complexity**: O(P × α(W) + N)
- **Space complexity**: O(W)

The key insight is that transitive similarity forms equivalence classes, which Union-Find efficiently maintains and queries. This problem is an excellent demonstration of when Union-Find is the appropriate data structure.

### Pattern Summary

This problem exemplifies the **Union-Find (Disjoint Set Union)** pattern, which is characterized by:
- Tracking connected components
- Efficient union and find operations
- Near O(1) query time with optimizations
- Handling transitive relationships

For more details on this pattern and its variations, see the **[Graph - Union Find Pattern](/patterns/graph-union-find-disjoint-set-union-dsu)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/sentence-similarity-ii/discuss/) - Community solutions
- [Union-Find - GeeksforGeeks](https://www.geeksforgeeks.org/disjoint-set-data-structures/) - Detailed explanation
- [Graph Theory - Wikipedia](https://en.wikipedia.org/wiki/Graph_theory) - Learn about graphs
- [Pattern: Graph Union Find](/patterns/graph-union-find-disjoint-set-union-dsu) - Comprehensive pattern guide
