# Sequence Reconstruction

## Problem Description

Given an integer array `nums` of length `n` that contains all unique integers from `1` to `n`, and an array of sequences `sequences`, determine if the given sequences uniquely reconstruct the original sequence `nums`.

The reconstruction is unique if there is exactly one topological order of `nums` that is consistent with all the given sequences.

**Link to problem:** [Sequence Reconstruction - LeetCode 444](https://leetcode.com/problems/sequence-reconstruction/)

## Constraints
- `1 <= nums.length <= 1000`
- `1 <= sequences.length <= 5000`
- All elements in `sequences` are between `1` and `nums.length`

---

## Pattern: Topological Sort (Kahn's Algorithm)

This problem uses **Topological Sort** to check if sequences uniquely reconstruct the original array.

### Core Concept

- **Build Graph**: Create directed edges from seq[i] to seq[i+1]
- **Indegree**: Count predecessors for each node
- **Uniqueness Check**: Only one node should have indegree 0 at each step

---

## Examples

### Example

**Input:** nums = [1,2,3], sequences = [[1,2],[1,3]]

**Output:** true

### Example 2

**Input:** nums = [1,2,3], sequences = [[1,2],[1,3],[2,3]]

**Output:** true

### Example 3

**Input:** nums = [1,2,3], sequences = [[1,2],[2,1]]

**Output:** false

---

## Multiple Approaches with Code

## Approach 1: Kahn's Algorithm (BFS Topological Sort) ⭐

This is the most common approach using BFS-based topological sort to check for unique reconstruction.

#### Algorithm

1. **Build Graph and Indegree**: Create a directed graph from sequences and calculate indegree for each node.
2. **Initialize Queue**: Add all nodes with indegree 0 to the queue.
3. **Process Queue**: 
   - If queue has more than one node, return false (multiple valid orders)
   - Process the single node, reduce indegree of neighbors
   - Add neighbors with indegree 0 to queue
4. **Verify**: Check if all nodes were processed (no cycles).

#### Code Implementation

````carousel
```python
from collections import defaultdict, deque

def sequenceReconstruction(nums, sequences):
    # Build graph and indegree
    graph = defaultdict(list)
    indegree = {num: 0 for num in nums}
    
    for seq in sequences:
        for i in range(len(seq) - 1):
            graph[seq[i]].append(seq[i + 1])
            indegree[seq[i + 1]] += 1
    
    # Queue for nodes with indegree 0
    queue = deque([num for num in nums if indegree[num] == 0])
    result = []
    
    while queue:
        # If more than one node with indegree 0, not unique
        if len(queue) > 1:
            return False
        
        curr = queue.popleft()
        result.append(curr)
        
        for nei in graph[curr]:
            indegree[nei] -= 1
            if indegree[nei] == 0:
                queue.append(nei)
    
    # Check if all nodes are included
    return len(result) == len(nums)
```

<!-- slide -->
```cpp
class Solution {
public:
    bool sequenceReconstruction(vector<int> nums, vector<vector<int>>& sequences) {
        unordered_map<int, vector<int>> graph;
        unordered_map<int, int> indegree;
        
        for (int num : nums) indegree[num] = 0;
        
        for (const auto& seq : sequences) {
            for (int i = 0; i < seq.size() - 1; i++) {
                graph[seq[i]].push_back(seq[i + 1]);
                indegree[seq[i + 1]]++;
            }
        }
        
        queue<int> q;
        for (int num : nums) {
            if (indegree[num] == 0) q.push(num);
        }
        
        vector<int> result;
        while (!q.empty()) {
            if (q.size() > 1) return false;
            int curr = q.front(); q.pop();
            result.push_back(curr);
            for (int nei : graph[curr]) {
                if (--indegree[nei] == 0) q.push(nei);
            }
        }
        
        return result.size() == nums.size();
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean sequenceReconstruction(int[] nums, int[][] sequences) {
        Map<Integer, List<Integer>> graph = new HashMap<>();
        Map<Integer, Integer> indegree = new HashMap<>();
        
        for (int num : nums) {
            graph.put(num, new ArrayList<>());
            indegree.put(num, 0);
        }
        
        for (int[] seq : sequences) {
            for (int i = 0; i < seq.length - 1; i++) {
                graph.get(seq[i]).add(seq[i + 1]);
                indegree.put(seq[i + 1], indegree.get(seq[i + 1]) + 1);
            }
        }
        
        Queue<Integer> q = new LinkedList<>();
        for (int num : nums) {
            if (indegree.get(num) == 0) q.offer(num);
        }
        
        List<Integer> result = new ArrayList<>();
        while (!q.isEmpty()) {
            if (q.size() > 1) return false;
            int curr = q.poll();
            result.add(curr);
            for (int nei : graph.get(curr)) {
                indegree.put(nei, indegree.get(nei) - 1);
                if (indegree.get(nei) == 0) q.offer(nei);
            }
        }
        
        return result.size() == nums.length;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number[][]} sequences
 * @return {boolean}
 */
var sequenceReconstruction = function(nums, sequences) {
    const graph = new Map();
    const indegree = new Map();
    
    for (const num of nums) {
        graph.set(num, []);
        indegree.set(num, 0);
    }
    
    for (const seq of sequences) {
        for (let i = 0; i < seq.length - 1; i++) {
            graph.get(seq[i]).push(seq[i + 1]);
            indegree.set(seq[i + 1], indegree.get(seq[i + 1]) + 1);
        }
    }
    
    const q = [];
    for (const num of nums) {
        if (indegree.get(num) === 0) q.push(num);
    }
    
    const result = [];
    while (q.length) {
        if (q.length > 1) return false;
        const curr = q.shift();
        result.push(curr);
        
        for (const nei of graph.get(curr)) {
            indegree.set(nei, indegree.get(nei) - 1);
            if (indegree.get(nei) === 0) q.push(nei);
        }
    }
    
    return result.length === nums.length;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V + E) |
| **Space** | O(V + E) |

---

## Approach 2: Graph Validation with Direct Checking

This alternative approach directly validates the uniqueness by checking the graph structure without full topological sorting.

#### Algorithm

1. **Build Graph**: Create adjacency list from sequences.
2. **Check Indegree**: Calculate indegree for each node.
3. **Validate Uniqueness**: Ensure exactly one node has indegree 0 at each step.
4. **Verify All Nodes**: Ensure all nodes are reachable (no cycles).

#### Code Implementation

````carousel
```python
from collections import defaultdict, deque

def sequenceReconstruction(nums, sequences):
    # Build graph and indegree
    graph = defaultdict(set)
    indegree = {num: 0 for num in nums}
    
    for seq in sequences:
        for i in range(len(seq) - 1):
            if seq[i + 1] not in graph[seq[i]]:
                graph[seq[i]].add(seq[i + 1])
                indegree[seq[i + 1]] += 1
    
    # Use BFS with uniqueness check
    queue = deque([num for num in nums if indegree[num] == 0])
    count = 0
    
    while queue:
        if len(queue) > 1:
            return False  # Not unique
        
        curr = queue.popleft()
        count += 1
        
        for neighbor in graph[curr]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    return count == len(nums)
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <queue>
using namespace std;

class Solution {
public:
    bool sequenceReconstruction(vector<int> nums, vector<vector<int>>& sequences) {
        unordered_map<int, unordered_set<int>> graph;
        unordered_map<int, int> indegree;
        
        for (int num : nums) {
            indegree[num] = 0;
        }
        
        for (const auto& seq : sequences) {
            for (size_t i = 0; i + 1 < seq.size(); i++) {
                if (graph[seq[i]].insert(seq[i + 1]).second) {
                    indegree[seq[i + 1]]++;
                }
            }
        }
        
        queue<int> q;
        for (int num : nums) {
            if (indegree[num] == 0) {
                q.push(num);
            }
        }
        
        int count = 0;
        while (!q.empty()) {
            if (q.size() > 1) return false;
            int curr = q.front(); q.pop();
            count++;
            
            for (int neighbor : graph[curr]) {
                if (--indegree[neighbor] == 0) {
                    q.push(neighbor);
                }
            }
        }
        
        return count == nums.size();
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public boolean sequenceReconstruction(int[] nums, int[][] sequences) {
        Map<Integer, Set<Integer>> graph = new HashMap<>();
        Map<Integer, Integer> indegree = new HashMap<>();
        
        for (int num : nums) {
            graph.put(num, new HashSet<>());
            indegree.put(num, 0);
        }
        
        for (int[] seq : sequences) {
            for (int i = 0; i + 1 < seq.length; i++) {
                if (graph.get(seq[i]).add(seq[i + 1])) {
                    indegree.put(seq[i + 1], indegree.get(seq[i + 1]) + 1);
                }
            }
        }
        
        Queue<Integer> q = new LinkedList<>();
        for (int num : nums) {
            if (indegree.get(num) == 0) {
                q.offer(num);
            }
        }
        
        int count = 0;
        while (!q.isEmpty()) {
            if (q.size() > 1) return false;
            int curr = q.poll();
            count++;
            
            for (int neighbor : graph.get(curr)) {
                int newIndegree = indegree.get(neighbor) - 1;
                indegree.put(neighbor, newIndegree);
                if (newIndegree == 0) {
                    q.offer(neighbor);
                }
            }
        }
        
        return count == nums.length;
    }
}
```

<!-- slide -->
```javascript
var sequenceReconstruction = function(nums, sequences) {
    const graph = new Map();
    const indegree = new Map();
    
    for (const num of nums) {
        graph.set(num, new Set());
        indegree.set(num, 0);
    }
    
    for (const seq of sequences) {
        for (let i = 0; i + 1 < seq.length; i++) {
            if (graph.get(seq[i]).add(seq[i + 1])) {
                indegree.set(seq[i + 1], indegree.get(seq[i + 1]) + 1);
            }
        }
    }
    
    const q = [];
    for (const num of nums) {
        if (indegree.get(num) === 0) {
            q.push(num);
        }
    }
    
    let count = 0;
    while (q.length) {
        if (q.length > 1) return false;
        const curr = q.shift();
        count++;
        
        for (const neighbor of graph.get(curr)) {
            const newIndegree = indegree.get(neighbor) - 1;
            indegree.set(neighbor, newIndegree);
            if (newIndegree === 0) {
                q.push(neighbor);
            }
        }
    }
    
    return count === nums.length;
};
```
``"

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V + E) |
| **Space** | O(V + E) |

---

## Comparison of Approaches

| Aspect | Kahn's Algorithm | Graph Validation |
|--------|------------------|-------------------|
| **Time Complexity** | O(V + E) | O(V + E) |
| **Space Complexity** | O(V + E) | O(V + E) |
| **Implementation** | Standard BFS | Similar with set |
| **Uniqueness Check** | Queue size > 1 | Queue size > 1 |

---

## Intuition

The key insight behind the topological sort approach for Sequence Reconstruction is understanding **uniqueness in ordering**:

1. **Graph as Order Constraints**: Each sequence in the input defines a partial ordering between elements. For example, sequence `[1, 2, 3]` tells us that `1 < 2 < 3` in the original array.

2. **Uniqueness Check**: A unique reconstruction exists only when there is **exactly one valid topological ordering**. If at any point during topological sort we have multiple nodes with indegree 0, it means there are multiple possible orderings - the reconstruction is not unique.

3. **Why Kahn's Algorithm**: By processing nodes with indegree 0 one at a time and checking if more than one node becomes available simultaneously, we can determine if the topological order is unique.

4. **Key Observation**: If the graph is a DAG and there is exactly one node with indegree 0 at each step, then there is exactly one valid topological order - which means we can uniquely reconstruct the sequence.

---

## Related Problems

### Same Pattern (Topological Sort)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Sequence Reconstruction | [Link](https://leetcode.com/problems/sequence-reconstruction/) | Medium | This problem |
| Course Schedule | [Link](https://leetcode.com/problems/course-schedule/) | Medium | Detect cycle in DAG |
| Course Schedule II | [Link](https://leetcode.com/problems/course-schedule-ii/) | Medium | Find valid ordering |
| Alien Dictionary | [Link](https://leetcode.com/problems/verifying-an-alien-dictionary/) | Hard | Unique ordering from rules |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Minimum Height Trees | [Link](https://leetcode.com/problems/minimum-height-trees/) | Medium | Topological sort |
| Find Order | [Link](https://leetcode.com/problems/find-eventual-safe-states/) | Medium | Topological sort |
| Reconstruct Itinerary | [Link](https://leetcode.com/problems/reconstruct-itinerary/) | Hard | Eulerian path |

---

## Video Tutorial Links

### Topological Sort for Sequence Reconstruction

1. **[Sequence Reconstruction - NeetCode](https://www.youtube.com/watch?v=n4Kfr1NEmbw)** - Clear explanation with visual examples of the uniqueness check
2. **[LeetCode 444 - Sequence Reconstruction](https://www.youtube.com/watch?v=3A_BhFbhZ1A)** - Detailed walkthrough of the approach
3. **[Topological Sort Pattern](https://www.youtube.com/watch?v=6MGhKf4D0dE)** - General topological sort patterns for similar problems

### Related Concepts

- **[Kahn's Algorithm Explained](https://www.youtube.com/watch?v=YG1FxOd-3vQ)** - BFS topological sort
- **[Graph Uniqueness Problems](https://www.youtube.com/watch?v=3A_BhFbhZ1A)** - Understanding when graphs have unique solutions

---

## Follow-up Questions

### Q1: How would you modify the solution to return the actual reconstructed sequence?

**Answer:** Instead of returning a boolean, maintain a result array during the topological sort. Append each node to the result as you process it. If the uniqueness check passes (only one node with indegree 0 at each step), return the result array.

---

### Q2: What if the sequences can contain duplicate elements?

**Answer:** This problem assumes all elements are unique (permutation of 1 to n). If duplicates were allowed, you'd need to track counts and ensure consistency across all sequences. The uniqueness check would become more complex.

---

### Q3: How would you handle the case where some numbers from 1 to n don't appear in any sequence?

**Answer:** If a number doesn't appear in any sequence, it has no constraints and can be placed anywhere. The problem typically ensures all numbers appear in at least one sequence. If not, you'd need to add isolated nodes to the graph and ensure they're accounted for in the result.

---

### Q4: Can this problem be solved using DFS-based topological sort?

**Answer:** Yes, but it's more complex for uniqueness checking. You would need to track the finish order of all nodes and ensure that there's only one valid ordering. The BFS approach (Kahn's algorithm) is more straightforward for checking uniqueness.

---

### Q5: How would you verify if a given sequence is valid given the original sequences?

**Answer:** Build the same graph and indegree array. Then traverse the proposed sequence, checking that each element has all its predecessors already been seen (indegree becomes 0 at the correct time). This is essentially running a modified version of the algorithm.

---

### Q6: What is the difference between this problem and checking if a graph has a Hamiltonian path?

**Answer:** A Hamiltonian path visits every node exactly once. This problem only requires a valid topological order, not necessarily visiting each node exactly once. However, if we have exactly n nodes and a valid topological order, it implicitly defines a Hamiltonian path in the DAG.

---

## Common Pitfalls

### 1. Not Checking All Nodes Are Visited
**Issue**: Returning true after the queue is empty without verifying all nodes were included.

**Solution**: Add a final check: `return len(result) == len(nums)`. This ensures all nodes were processed and there are no cycles.

### 2. Incorrect Graph Construction
**Issue**: Not adding edges for consecutive pairs in each sequence correctly.

**Solution**: For each sequence, iterate from `i = 0` to `len(seq) - 2` and add edge from `seq[i]` to `seq[i+1]`. Don't forget to initialize the graph for all nodes in `nums`.

### 3. Not Handling All Numbers in nums
**Issue**: Only processing numbers that appear in sequences, missing isolated nodes.

**Solution**: Always initialize the indegree dictionary with all numbers from `nums` set to 0, even if they don't appear in any sequence.

### 4. Off-by-One in Queue Size Check
**Issue**: Checking queue length at the wrong time or not at all.

**Solution**: Check `if len(queue) > 1` at the beginning of each while iteration, before processing any node. This ensures uniqueness at each step.

### 5. Modifying Indegree During Iteration
**Issue**: Not properly updating neighbors' indegree when processing a node.

**Solution**: For each neighbor of the current node, decrement its indegree. Only add it to the queue when its indegree becomes 0.

---

## Summary

The **Sequence Reconstruction** problem demonstrates **Topological Sort Uniqueness**:
- Build directed graph from sequences
- Check for unique topological order
- O(V + E) time complexity
