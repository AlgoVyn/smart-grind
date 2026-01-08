# Sequence Reconstruction

## Problem Description
[Link to problem](https://leetcode.com/problems/sequence-reconstruction/)

## Solution

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

## Explanation
This problem requires determining if the given sequences uniquely reconstruct the original sequence `nums`. It uses topological sorting with BFS to check for uniqueness.

### Step-by-Step Approach:
1. **Build the Graph and Indegree Map:**
   - Create a graph where each number points to the numbers that follow it in the sequences.
   - Use an indegree map to count how many predecessors each number has.
   - Iterate through each sequence, adding edges from seq[i] to seq[i+1] and incrementing indegree for seq[i+1].

2. **Perform Topological Sort with BFS:**
   - Initialize a queue with all numbers that have indegree 0 (no predecessors).
   - While the queue is not empty:
     - If there is more than one number with indegree 0, return False (not unique).
     - Dequeue the current number and add it to the result.
     - For each neighbor, decrement its indegree. If it reaches 0, add to queue.

3. **Verify Completeness:**
   - After processing, check if the result length equals the length of `nums`. If yes, the reconstruction is unique; otherwise, False.

### Time Complexity:
- O(V + E), where V is the number of elements in `nums`, and E is the total number of edges from all sequences, as building the graph and BFS take linear time.

### Space Complexity:
- O(V + E), for the graph, indegree map, and queue.
