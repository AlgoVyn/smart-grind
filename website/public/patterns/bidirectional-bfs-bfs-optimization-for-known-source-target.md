# Graph - Bidirectional BFS (BFS optimization for known source & target)

## Problem Description

The Bidirectional BFS pattern is used to find the shortest path between a known source and target in an unweighted graph more efficiently than standard BFS. By expanding from both the source and target simultaneously, it reduces the search space significantly from O(b^d) to O(b^(d/2)), where b is the branching factor and d is the shortest path length.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(b^(d/2)) where b is branching factor, d is path length |
| Space Complexity | O(b^(d/2)) for storing visited nodes from both directions |
| Input | Unweighted graph, known source and target nodes |
| Output | Shortest path or distance between source and target |
| Approach | Simultaneous BFS from both source and target |

### When to Use

- Finding shortest path between known source and target in unweighted graphs
- Word ladder / transformation sequence problems
- Problems requiring path reconstruction between two endpoints
- Scenarios where standard BFS would explore too many nodes
- Gene mutation / string transformation problems
- Game state transformation with known start and end states

## Intuition

The key insight is that searching from both ends simultaneously dramatically reduces the search space because the two searches meet in the middle.

The "aha!" moments:

1. **Meeting in the middle**: Two searches expanding from opposite ends will intersect much faster than one search traversing the entire path
2. **Expanding smaller frontier**: Always expand the side with fewer nodes to maintain balance
3. **Intersection detection**: When a node is visited by both frontiers, the shortest path is found
4. **Path reconstruction**: Track parents from both sides to reconstruct the complete path
5. **Early termination**: Stop as soon as intersection is found, no need to explore all nodes

## Solution Approaches

### Approach 1: Standard Bidirectional BFS ✅ Recommended

#### Algorithm

1. Initialize two frontiers (sets): one from source, one from target
2. Initialize two parent maps for path reconstruction
3. While both frontiers are not empty:
   - Expand the smaller frontier for efficiency
   - For each node in current frontier, explore all neighbors
   - If neighbor is in other frontier, path found - reconstruct and return
   - Otherwise, add neighbor to next level and record parent
4. If no intersection found, return None (no path exists)

#### Implementation

````carousel
```python
from collections import deque

def bidirectional_bfs(graph, start, end):
    """
    Find shortest path between start and end using bidirectional BFS.
    Time: O(b^(d/2)), Space: O(b^(d/2))
    """
    if start == end:
        return [start]
    
    # Frontiers: set of nodes visited from start and end
    frontiers = [set([start]), set([end])]
    # Parents: maps node to parent for path reconstruction
    parents = [{start: None}, {end: None}]
    
    while frontiers[0] and frontiers[1]:
        # Always expand the smaller frontier for efficiency
        if len(frontiers[0]) > len(frontiers[1]):
            frontiers.reverse()
            parents.reverse()
        
        next_level = set()
        
        for node in frontiers[0]:
            for neighbor in graph.get(node, []):
                if neighbor in frontiers[1]:  # Found intersection
                    # Reconstruct path
                    path1 = []
                    current = node
                    while current:
                        path1.append(current)
                        current = parents[0][current]
                    path1.reverse()
                    
                    path2 = []
                    current = neighbor
                    while current:
                        path2.append(current)
                        current = parents[1][current]
                    return path1 + path2
                
                if neighbor not in parents[0]:
                    parents[0][neighbor] = node
                    next_level.add(neighbor)
        
        frontiers[0] = next_level
    
    return None  # No path exists


def bidirectional_bfs_word_ladder(beginWord, endWord, wordList):
    """
    Word Ladder using bidirectional BFS.
    LeetCode 127 - Word Ladder
    """
    wordSet = set(wordList)
    if endWord not in wordSet:
        return 0
    
    frontiers = [set([beginWord]), set([endWord])]
    distance = 1
    
    while frontiers[0] and frontiers[1]:
        # Expand smaller frontier
        if len(frontiers[0]) > len(frontiers[1]):
            frontiers.reverse()
        
        next_level = set()
        
        for word in frontiers[0]:
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    next_word = word[:i] + c + word[i+1:]
                    if next_word in frontiers[1]:
                        return distance + 1
                    if next_word in wordSet:
                        wordSet.remove(next_word)
                        next_level.add(next_word)
        
        frontiers[0] = next_level
        distance += 1
    
    return 0
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
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> wordSet(wordList.begin(), wordList.end());
        if (!wordSet.count(endWord)) return 0;
        
        unordered_set<string> beginSet{beginWord};
        unordered_set<string> endSet{endWord};
        int distance = 1;
        
        while (!beginSet.empty() && !endSet.empty()) {
            // Expand smaller set
            if (beginSet.size() > endSet.size()) {
                swap(beginSet, endSet);
            }
            
            unordered_set<string> nextSet;
            
            for (const string& word : beginSet) {
                for (int i = 0; i < word.size(); i++) {
                    string nextWord = word;
                    for (char c = 'a'; c <= 'z'; c++) {
                        nextWord[i] = c;
                        if (endSet.count(nextWord)) {
                            return distance + 1;
                        }
                        if (wordSet.count(nextWord)) {
                            wordSet.erase(nextWord);
                            nextSet.insert(nextWord);
                        }
                    }
                }
            }
            
            beginSet = nextSet;
            distance++;
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
        if (!wordSet.contains(endWord)) return 0;
        
        Set<String> beginSet = new HashSet<>();
        Set<String> endSet = new HashSet<>();
        beginSet.add(beginWord);
        endSet.add(endWord);
        int distance = 1;
        
        while (!beginSet.isEmpty() && !endSet.isEmpty()) {
            // Expand smaller set
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
                        chars[i] = c;
                        String nextWord = new String(chars);
                        if (endSet.contains(nextWord)) {
                            return distance + 1;
                        }
                        if (wordSet.contains(nextWord)) {
                            wordSet.remove(nextWord);
                            nextSet.add(nextWord);
                        }
                    }
                    chars[i] = original;
                }
            }
            
            beginSet = nextSet;
            distance++;
        }
        
        return 0;
    }
}
```
<!-- slide -->
```javascript
/**
 * Word Ladder using bidirectional BFS
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
function ladderLength(beginWord, endWord, wordList) {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) return 0;
    
    let beginSet = new Set([beginWord]);
    let endSet = new Set([endWord]);
    let distance = 1;
    
    while (beginSet.size > 0 && endSet.size > 0) {
        // Expand smaller set
        if (beginSet.size > endSet.size) {
            [beginSet, endSet] = [endSet, beginSet];
        }
        
        const nextSet = new Set();
        
        for (const word of beginSet) {
            for (let i = 0; i < word.length; i++) {
                for (let c = 97; c <= 122; c++) { // 'a' to 'z'
                    const nextWord = word.slice(0, i) + 
                                     String.fromCharCode(c) + 
                                     word.slice(i + 1);
                    
                    if (endSet.has(nextWord)) {
                        return distance + 1;
                    }
                    if (wordSet.has(nextWord)) {
                        wordSet.delete(nextWord);
                        nextSet.add(nextWord);
                    }
                }
            }
        }
        
        beginSet = nextSet;
        distance++;
    }
    
    return 0;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(b^(d/2)) - Exponential in half the path depth |
| Space | O(b^(d/2)) - Store nodes from both frontiers |

### Approach 2: Bidirectional BFS with Path Reconstruction

For problems requiring the actual path, not just distance.

#### Implementation

````carousel
```python
from collections import deque

def bidirectional_bfs_with_path(graph, start, end):
    """
    Returns the shortest path from start to end.
    """
    if start == end:
        return [start]
    
    # Two queues for BFS
    queue1 = deque([start])
    queue2 = deque([end])
    
    # Two visited maps with path tracking
    visited1 = {start: [start]}
    visited2 = {end: [end]}
    
    while queue1 and queue2:
        # Expand from side 1
        if len(queue1) <= len(queue2):
            path = expand_frontier(queue1, visited1, visited2, graph)
        else:
            path = expand_frontier(queue2, visited2, visited1, graph)
        
        if path:
            return path
    
    return []

def expand_frontier(queue, visited_self, visited_other, graph):
    """Expand one level and check for intersection."""
    for _ in range(len(queue)):
        node = queue.popleft()
        current_path = visited_self[node]
        
        for neighbor in graph.get(node, []):
            if neighbor in visited_other:
                # Found intersection - combine paths
                other_path = visited_other[neighbor]
                return current_path + other_path[::-1][1:]
            
            if neighbor not in visited_self:
                visited_self[neighbor] = current_path + [neighbor]
                queue.append(neighbor)
    
    return None
```
<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <queue>
using namespace std;

class BidirectionalBFS {
public:
    vector<string> findPath(unordered_map<string, vector<string>>& graph, 
                            string start, string end) {
        if (start == end) return {start};
        
        queue<string> q1{{start}}, q2{{end}};
        unordered_map<string, vector<string>> path1{{start, {start}}};
        unordered_map<string, vector<string>> path2{{end, {end}}};
        
        while (!q1.empty() && !q2.empty()) {
            vector<string> result;
            if (q1.size() <= q2.size()) {
                result = expand(q1, path1, path2, graph);
            } else {
                result = expand(q2, path2, path1, graph);
            }
            if (!result.empty()) return result;
        }
        return {};
    }

private:
    vector<string> expand(queue<string>& q, 
                          unordered_map<string, vector<string>>& pathSelf,
                          unordered_map<string, vector<string>>& pathOther,
                          unordered_map<string, vector<string>>& graph) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            string node = q.front(); q.pop();
            
            for (const string& neighbor : graph[node]) {
                if (pathOther.count(neighbor)) {
                    // Found intersection
                    vector<string> result = pathSelf[node];
                    vector<string> other = pathOther[neighbor];
                    reverse(other.begin(), other.end());
                    result.insert(result.end(), other.begin() + 1, other.end());
                    return result;
                }
                
                if (!pathSelf.count(neighbor)) {
                    pathSelf[neighbor] = pathSelf[node];
                    pathSelf[neighbor].push_back(neighbor);
                    q.push(neighbor);
                }
            }
        }
        return {};
    }
};
```
<!-- slide -->
```java
import java.util.*;

class BidirectionalBFS {
    public List<String> findPath(Map<String, List<String>> graph, 
                                  String start, String end) {
        if (start.equals(end)) return Arrays.asList(start);
        
        Queue<String> q1 = new LinkedList<>();
        Queue<String> q2 = new LinkedList<>();
        q1.offer(start);
        q2.offer(end);
        
        Map<String, List<String>> path1 = new HashMap<>();
        Map<String, List<String>> path2 = new HashMap<>();
        path1.put(start, new ArrayList<>(Arrays.asList(start)));
        path2.put(end, new ArrayList<>(Arrays.asList(end)));
        
        while (!q1.isEmpty() && !q2.isEmpty()) {
            List<String> result;
            if (q1.size() <= q2.size()) {
                result = expand(q1, path1, path2, graph);
            } else {
                result = expand(q2, path2, path1, graph);
            }
            if (!result.isEmpty()) return result;
        }
        return new ArrayList<>();
    }
    
    private List<String> expand(Queue<String> q,
                                 Map<String, List<String>> pathSelf,
                                 Map<String, List<String>> pathOther,
                                 Map<String, List<String>> graph) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            String node = q.poll();
            
            for (String neighbor : graph.getOrDefault(node, new ArrayList<>())) {
                if (pathOther.containsKey(neighbor)) {
                    // Found intersection
                    List<String> result = new ArrayList<>(pathSelf.get(node));
                    List<String> other = new ArrayList<>(pathOther.get(neighbor));
                    Collections.reverse(other);
                    result.addAll(other.subList(1, other.size()));
                    return result;
                }
                
                if (!pathSelf.containsKey(neighbor)) {
                    List<String> newPath = new ArrayList<>(pathSelf.get(node));
                    newPath.add(neighbor);
                    pathSelf.put(neighbor, newPath);
                    q.offer(neighbor);
                }
            }
        }
        return new ArrayList<>();
    }
}
```
<!-- slide -->
```javascript
/**
 * Bidirectional BFS with path reconstruction
 */
function findPath(graph, start, end) {
    if (start === end) return [start];
    
    const q1 = [start], q2 = [end];
    const path1 = {[start]: [start]};
    const path2 = {[end]: [end]};
    
    function expand(queue, pathSelf, pathOther) {
        const size = queue.length;
        for (let i = 0; i < size; i++) {
            const node = queue.shift();
            
            for (const neighbor of graph[node] || []) {
                if (pathOther[neighbor]) {
                    // Found intersection
                    const result = [...pathSelf[node]];
                    const other = [...pathOther[neighbor]].reverse();
                    return [...result, ...other.slice(1)];
                }
                
                if (!pathSelf[neighbor]) {
                    pathSelf[neighbor] = [...pathSelf[node], neighbor];
                    queue.push(neighbor);
                }
            }
        }
        return null;
    }
    
    while (q1.length > 0 && q2.length > 0) {
        let result;
        if (q1.length <= q2.length) {
            result = expand(q1, path1, path2);
        } else {
            result = expand(q2, path2, path1);
        }
        if (result) return result;
    }
    return [];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(b^(d/2)) - Still exponential, but with path tracking overhead |
| Space | O(b^(d/2) * d) - Store paths for each node |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Standard Bidirectional BFS | O(b^(d/2)) | O(b^(d/2)) | **Recommended** - Finding distance |
| With Path Reconstruction | O(b^(d/2) * d) | O(b^(d/2) * d) | When path is needed |
| Standard BFS | O(b^d) | O(b^d) | Single source, multiple targets |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Word Ladder](https://leetcode.com/problems/word-ladder/) | 127 | Hard | Shortest transformation sequence |
| [Minimum Genetic Mutation](https://leetcode.com/problems/minimum-genetic-mutation/) | 433 | Medium | Similar to word ladder |
| [Open the Lock](https://leetcode.com/problems/open-the-lock/) | 752 | Medium | 4-digit wheel lock puzzle |
| [Remove Invalid Parentheses](https://leetcode.com/problems/remove-invalid-parentheses/) | 301 | Hard | Find valid parentheses |
| [Word Ladder II](https://leetcode.com/problems/word-ladder-ii/) | 126 | Hard | All shortest transformation sequences |

## Video Tutorial Links

1. **[NeetCode - Word Ladder](https://www.youtube.com/watch?v=hVhOeaONg1Y)** - Bidirectional BFS explanation
2. **[Back To Back SWE - Bidirectional BFS](https://www.youtube.com/watch?v=5S49rB3e7iM)** - Algorithm walkthrough
3. **[Kevin Naughton Jr. - Word Ladder](https://www.youtube.com/watch?v=M9cVl4d36vU)** - Python implementation
4. **[Tushar Roy - Bidirectional Search](https://www.youtube.com/watch?v=5S49rB3e7iM)** - Visual explanation
5. **[Nick White - Word Ladder](https://www.youtube.com/watch?v=6xWPOyZBSjY)** - Step-by-step trace

## Summary

### Key Takeaways

- **Always expand smaller frontier**: This maintains balance and optimizes performance
- **Intersection check**: Stop immediately when frontiers meet
- **Word ladder pattern**: Generate all possible next states and check membership
- **Much faster than BFS**: Exponential improvement in search space
- **Only for known target**: Requires knowing both start and end points

### Common Pitfalls

- Not expanding the smaller frontier first (reduces efficiency)
- Forgetting to check for intersection when adding neighbors
- Incorrect path reconstruction (failing to reverse paths correctly)
- Not handling start == end case (misses trivial solution)
- Using regular BFS when bidirectional is applicable
- Not removing visited nodes from word set (causes TLE)

### Follow-up Questions

1. **How would you modify this for weighted graphs?**
   - Use bidirectional Dijkstra's algorithm with consistent tie-breaking

2. **What if there are multiple shortest paths?**
   - Track all parents at each intersection point, use DFS to collect all paths

3. **How to handle disconnected graphs?**
   - Return appropriate indicator (0, -1, or empty list) when no path exists

4. **Can this be parallelized?**
   - Yes, each frontier expansion can run on separate threads

## Pattern Source

[Bidirectional BFS Pattern](patterns/bidirectional-bfs-bfs-optimization-for-known-source-target.md)
