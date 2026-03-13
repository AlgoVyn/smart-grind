# Maximum Employees To Be Invited To A Meeting

## Problem Description

A company is organizing a meeting and has a list of `n` employees waiting to be invited. They have arranged for a large circular table capable of seating any number of employees. The employees are numbered from `0` to `n - 1`.

Each employee has a favorite person, and they will attend the meeting only if they can sit next to their favorite person at the table. The favorite person of an employee is not themselves.

Given a 0-indexed integer array `favorite`, where `favorite[i]` denotes the favorite person of the `i-th` employee, return the maximum number of employees that can be invited to the meeting.

**Link to problem:** [Maximum Employees To Be Invited To A Meeting - LeetCode 2136](https://leetcode.com/problems/maximum-employees-to-be-invited-to-a-meeting/)

## Constraints
- `n == favorite.length`
- `2 <= n <= 10^5`
- `0 <= favorite[i] <= n - 1`
- `favorite[i] != i`

---

## Pattern: Graph Cycle Detection with Chain Analysis

This problem is a classic example of the **Functional Graph** pattern with cycle detection. Each employee points to their favorite person, forming a directed graph where each node has exactly one outgoing edge.

### Core Concept

The fundamental structure is a **functional graph** (each node has outdegree 1):
- **Cycles**: Groups of employees who form a cycle (each likes the next)
- **Chains**: Trees of employees leading into cycles
- **Seating constraint**: In a cycle of size k, at most k employees can sit if all are mutually connected

---

## Examples

### Example

**Input:**
```
favorite = [2,2,1,2]
```

**Output:**
```
3
```

**Explanation:**
- Employee 0's favorite is 2
- Employee 1's favorite is 2
- Employee 2's favorite is 1
- Employee 3's favorite is 2

The optimal seating: 0, 1, 2 can be invited. Employee 2 sits between 0 and 1 (both favorites), but employee 3 cannot find a spot.

### Example 2

**Input:**
```
favorite = [1,2,0]
```

**Output:**
```
3
```

**Explanation:**
- This forms a cycle: 0→1→2→0 (all three like each other in a chain)
- All employees can be invited in a cycle of 3

### Example 3

**Input:**
```
favorite = [3,0,1,4,1]
```

**Output:**
```
4
```

**Explanation:**
- Employee 4's favorite is 1
- Employee 1's favorite is 0
- Employee 0's favorite is 3
- Employee 3's favorite is 4 → cycle of 2 (3↔4)
- Employee 2's favorite is 1 → chain leading to cycle

The optimal seating invites employees 0, 1, 3, 4 (4 employees).

---

## Intuition

The key insights for this problem:

1. **Two types of structures**:
   - **Cycles**: Employees in a cycle can only invite the cycle size
   - **Cycles with branches**: Employees in cycles + those in chains leading to them

2. **Seating rules**:
   - In a cycle, each person needs their favorite on one side
   - For cycle size > 2: only the cycle members can be seated
   - For cycle size = 2: chain members can be added on both sides

3. **Maximum calculation**:
   - Maximum = max(max_cycle_size, sum(cycle_size + chain_lengths) for 2-cycles)

### Why This Works

- For cycles of size > 2: No room for external employees because each person already uses both neighbors for the cycle
- For cycles of size 2: Both employees in the cycle have one "free" side each, allowing chains to attach

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DFS Cycle Detection** - Optimal O(n) time, O(n) space
2. **Topological Sort** - Alternative O(n) approach

---

## Approach 1: DFS Cycle Detection (Optimal)

This approach uses DFS to find all cycles and calculate the maximum invitation count.

### Algorithm Steps

1. **Find all cycles**:
   - Use visited array to track processing state
   - When we encounter a node being processed, we've found a cycle
   - Record all nodes in the cycle

2. **Calculate chains**:
   - For nodes not in cycles, find their distance to the cycle
   - Track maximum chain length for each cycle node

3. **Calculate maximum**:
   - For cycles > 2: maximum is cycle size
   - For cycles = 2: maximum is cycle size + sum of chain lengths

### Why It Works

The algorithm correctly identifies:
- All cycles in the functional graph
- The longest chains leading into each cycle
- The optimal seating arrangement based on cycle size

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maximumInvitations(self, favorite: List[int]) -> int:
        """
        Find maximum number of employees that can be invited.
        
        Args:
            favorite: Array where favorite[i] is employee i's favorite
            
        Returns:
            Maximum number of employees that can be invited
        """
        n = len(favorite)
        visited = [0] * n  # 0=unvisited, 1=visiting, 2=processed
        
        cycles = []  # Store all cycles found
        
        def dfs(node: int, path: List[int]) -> None:
            """DFS to find cycles in the graph."""
            visited[node] = 1  # Mark as visiting
            path.append(node)
            
            next_node = favorite[node]
            
            if visited[next_node] == 0:
                dfs(next_node, path)
            elif visited[next_node] == 1:
                # Found a cycle - extract it
                cycle_start = path.index(next_node)
                cycle = path[cycle_start:]
                cycles.append(cycle)
            
            visited[node] = 2  # Mark as processed
            path.pop()
        
        # Find all cycles
        for i in range(n):
            if visited[i] == 0:
                dfs(i, [])
        
        # Calculate maximum chain length for each node in cycles
        max_chain = {}  # node -> max chain length ending at this node
        
        for cycle in cycles:
            for node in cycle:
                # Find chain starting from this node
                chain_length = 0
                current = favorite[node]
                visited_chain = set(cycle)
                
                while current not in visited_chain:
                    chain_length += 1
                    current = favorite[current]
                
                max_chain[node] = chain_length
        
        # Calculate answer
        max_invite = 0
        
        for cycle in cycles:
            if len(cycle) > 2:
                # Only cycle members can be invited
                max_invite = max(max_invite, len(cycle))
            else:
                # For 2-cycles, add chain lengths
                total = len(cycle) + sum(max_chain.get(node, 0) for node in cycle)
                max_invite = max(max_invite, total)
        
        return max_invite
```

<!-- slide -->
```cpp
class Solution {
public:
    int maximumInvitations(vector<int>& favorite) {
        int n = favorite.size();
        vector<int> visited(n, 0);
        vector<vector<int>> cycles;
        vector<int> path;
        
        function<void(int)> dfs = [&](int node) {
            visited[node] = 1;
            path.push_back(node);
            
            int next = favorite[node];
            if (visited[next] == 0) {
                dfs(next);
            } else if (visited[next] == 1) {
                // Found cycle
                auto it = find(path.begin(), path.end(), next);
                vector<int> cycle(it - path.begin(), path.end());
                cycles.push_back(cycle);
            }
            
            visited[node] = 2;
            path.pop_back();
        };
        
        for (int i = 0; i < n; i++) {
            if (visited[i] == 0) dfs(i);
        }
        
        // Calculate chains
        unordered_map<int, int> maxChain;
        
        for (auto& cycle : cycles) {
            for (int node : cycle) {
                int chainLength = 0;
                int current = favorite[node];
                unordered_set<int> cycleSet(cycle.begin(), cycle.end());
                
                while (cycleSet.find(current) == cycleSet.end()) {
                    chainLength++;
                    current = favorite[current];
                }
                
                maxChain[node] = chainLength;
            }
        }
        
        int maxInvite = 0;
        
        for (auto& cycle : cycles) {
            if (cycle.size() > 2) {
                maxInvite = max(maxInvite, (int)cycle.size());
            } else {
                int total = cycle.size();
                for (int node : cycle) {
                    total += maxChain[node];
                }
                maxInvite = max(maxInvite, total);
            }
        }
        
        return maxInvite;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maximumInvitations(int[] favorite) {
        int n = favorite.length;
        int[] visited = new int[n];
        List<List<Integer>> cycles = new ArrayList<>();
        
        dfs(0, visited, favorite, cycles, new ArrayList<>());
        
        // Calculate max chains and answer
        int maxInvite = 0;
        
        for (List<Integer> cycle : cycles) {
            if (cycle.size() > 2) {
                maxInvite = Math.max(maxInvite, cycle.size());
            } else {
                int total = cycle.size();
                for (int node : cycle) {
                    total += getChainLength(node, cycle, favorite);
                }
                maxInvite = Math.max(maxInvite, total);
            }
        }
        
        return maxInvite;
    }
    
    private void dfs(int node, int[] visited, int[] favorite, 
                     List<List<Integer>> cycles, List<Integer> path) {
        visited[node] = 1;
        path.add(node);
        
        int next = favorite[node];
        
        if (visited[next] == 0) {
            dfs(next, visited, favorite, cycles, path);
        } else if (visited[next] == 1) {
            int idx = path.indexOf(next);
            List<Integer> cycle = new ArrayList<>(path.subList(idx, path.size()));
            cycles.add(cycle);
        }
        
        visited[node] = 2;
        path.remove(path.size() - 1);
    }
    
    private int getChainLength(int node, List<Integer> cycle, int[] favorite) {
        Set<Integer> cycleSet = new HashSet<>(cycle);
        int length = 0;
        int current = favorite[node];
        
        while (!cycleSet.contains(current)) {
            length++;
            current = favorite[current];
        }
        
        return length;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find maximum number of employees that can be invited.
 * 
 * @param {number[]} favorite - Array where favorite[i] is employee i's favorite
 * @return {number} - Maximum number of employees that can be invited
 */
var maximumInvitations = function(favorite) {
    const n = favorite.length;
    const visited = new Array(n).fill(0);
    const cycles = [];
    
    const dfs = (node, path) => {
        visited[node] = 1;
        path.push(node);
        
        const next = favorite[node];
        
        if (visited[next] === 0) {
            dfs(next, path);
        } else if (visited[next] === 1) {
            const idx = path.indexOf(next);
            const cycle = path.slice(idx);
            cycles.push(cycle);
        }
        
        visited[node] = 2;
        path.pop();
    };
    
    for (let i = 0; i < n; i++) {
        if (visited[i] === 0) {
            dfs(i, []);
        }
    }
    
    // Calculate chains
    const getChainLength = (node, cycleSet) => {
        let length = 0;
        let current = favorite[node];
        
        while (!cycleSet.has(current)) {
            length++;
            current = favorite[current];
        }
        
        return length;
    };
    
    let maxInvite = 0;
    
    for (const cycle of cycles) {
        if (cycle.length > 2) {
            maxInvite = Math.max(maxInvite, cycle.length);
        } else {
            const cycleSet = new Set(cycle);
            let total = cycle.length;
            for (const node of cycle) {
                total += getChainLength(node, cycleSet);
            }
            maxInvite = Math.max(maxInvite, total);
        }
    }
    
    return maxInvite;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node visited constant number of times |
| **Space** | O(n) - Visited array, cycles storage, recursion stack |

---

## Approach 2: Simplified Version

A cleaner implementation focusing on the key insight.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maximumInvitations(self, favorite: List[int]) -> int:
        n = len(favorite)
        visited = [False] * n
        in_cycle = [False] * n
        cycles = []
        
        # Find all cycles
        for i in range(n):
            if not visited[i]:
                path = []
                curr = i
                while not visited[curr]:
                    visited[curr] = True
                    path.append(curr)
                    curr = favorite[curr]
                
                if curr in path:
                    idx = path.index(curr)
                    cycle = path[idx:]
                    cycles.append(cycle)
                    for node in cycle:
                        in_cycle[node] = True
        
        # Calculate chains for each cycle node
        chain_sum = {node: 0 for cycle in cycles for node in cycle}
        
        for i in range(n):
            if not in_cycle[i]:
                # Trace back to find cycle node
                path = []
                curr = i
                while not in_cycle[curr]:
                    path.append(curr)
                    curr = favorite[curr]
                
                # Count nodes in path
                for j, node in enumerate(path):
                    chain_sum[curr] = max(chain_sum[curr], len(path) - j)
        
        result = 0
        
        for cycle in cycles:
            if len(cycle) == 2:
                result = max(result, 2 + chain_sum[cycle[0]] + chain_sum[cycle[1]])
            else:
                result = max(result, len(cycle))
        
        return result
```
````

---

## Comparison of Approaches

| Aspect | DFS Cycle Detection | Simplified Version |
|--------|--------------------|--------------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | More verbose | Cleaner |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes |

---

## Why This Solution Works

The solution works because of the seating constraints:

1. **Cycles > 2**: Each employee needs their favorite on one side, but since the cycle is longer than 2, every spot is taken by another cycle member. No room for external employees.

2. **Cycles = 2**: Each employee in the 2-cycle has one side taken by the other cycle member, leaving the other side free for chains to attach.

3. **Chains**: Employees not in cycles must eventually reach a cycle. Their chain length determines how many can be invited along with the cycle.

---

## Related Problems

Based on similar themes (graph cycles, functional graphs):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Find the Town Judge | [Link](https://leetcode.com/problems/find-the-town-judge/) | Similar directed graph |
| Clone Graph | [Link](https://leetcode.com/problems/clone-graph/) | Graph traversal |
| Course Schedule | [Link](https://leetcode.com/problems/course-schedule/) | Cycle detection in directed graph |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Critical Connections in a Network | [Link](https://leetcode.com/problems/critical-connections-in-a-network/) | Finding bridges |
| Longest Cycle in a Graph | [Link](https://leetcode.com/problems/longest-cycle-in-a-graph/) | Similar cycle finding |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Cycle Detection

- [NeetCode - Maximum Employees to be Invited](https://www.youtube.com/watch?v=SuJyGk1kG5E) - Clear explanation
- [Graph Cycle Detection](https://www.youtube.com/watch?v=qH0bgiMuj9U) - Related concepts
- [LeetCode Official Solution](https://www.youtube.com/watch?v=3Q_o3J3qGiY) - Official explanation

---

## Follow-up Questions

### Q1: What if employees could have multiple favorites?

**Answer:** This would fundamentally change the problem. It would become a more complex optimization problem, possibly NP-hard.

---

### Q2: How would you modify for a line (non-circular) table?

**Answer:** For a line, each employee needs their favorite on at least one side. The problem becomes different - we might need to find the longest path.

---

### Q3: What if favorites could be mutual (like A→B and B→A)?

**Answer:** Mutual favorites form 2-cycles, which are already handled specially in this problem.

---

### Q4: How would you handle this in a distributed system?

**Answer:** Each machine could process a portion of the graph, then communicate cycle information to find global cycles.

---

### Q5: What edge cases should be tested?

**Answer:**
- All employees in one large cycle
- All employees in separate 2-cycles with chains
- No cycles (but impossible - functional graph always has cycles)
- Only 2-cycles (mutual favorites)

---

## Common Pitfalls

### 1. Incorrect Cycle Detection
**Issue**: Not properly tracking visited states (0=unvisited, 1=visiting, 2=done).

**Solution**: Use three states to correctly identify back-edges to currently processing nodes.

### 2. Chain Calculation
**Issue**: Not correctly calculating chain lengths for each cycle node.

**Solution**: For each chain node, trace back to find which cycle node it connects to, and calculate distance.

### 3. 2-Cycle Special Case
**Issue**: Treating 2-cycles the same as larger cycles.

**Solution**: Remember that 2-cycles allow chain attachments, while larger cycles don't.

### 4. Memory Usage
**Issue**: Using too much memory for path tracking.

**Solution**: Use iterative approaches or limit recursion depth.

### 5. Index vs Value
**Issue**: Confusing node indices with their favorite values.

**Solution**: favorite[i] gives the index of employee i's favorite, not a value.

---

## Summary

The **Maximum Employees To Be Invited To A Meeting** problem demonstrates cycle detection in functional graphs:

- **DFS approach**: Find cycles and chains, then calculate maximum
- **Key insight**: 2-cycles allow chain attachments, larger cycles don't
- **Time**: O(n) - Each node visited constant times

The key insight is recognizing that the seating constraint creates two distinct cases:
1. Cycles > 2: Only cycle members can sit
2. Cycles = 2: Cycle members + attached chains can sit

This problem is an excellent example of how graph theory concepts translate to practical algorithmic solutions.

### Pattern Summary

This problem exemplifies the **Functional Graph Cycle Detection** pattern, which is characterized by:
- Each node has exactly one outgoing edge
- Graph decomposes into cycles with trees attached
- Cycle size determines optimal solution
- DFS or topological sort for detection

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/maximum-employees-to-be-invited-to-a-meeting/discuss/) - Community solutions
- [Functional Graph - Wikipedia](https://en.wikipedia.org/wiki/Functional_graph) - Graph theory background
- [Cycle Detection - GeeksforGeeks](https://www.geeksforgeeks.org/detect-cycle-in-a-graph/) - Detection algorithms
