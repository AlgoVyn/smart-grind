# Single-Threaded CPU

## Problem Description

You are given `n` tasks labeled from `0` to `n - 1` represented by a 2D integer array `tasks`, where `tasks[i] = [enqueueTimei, processingTimei]` means that the `i-th` task will be available to process at `enqueueTimei` and will take `processingTimei` to finish processing.

You have a single-threaded CPU that can process at most one task at a time and will act in the following way:

- If the CPU is idle and there are no available tasks to process, the CPU remains idle.
- If the CPU is idle and there are available tasks, the CPU will choose the one with the shortest processing time. If multiple tasks have the same shortest processing time, it will choose the task with the smallest index.
- Once a task is started, the CPU will process the entire task without stopping.
- The CPU can finish a task then start a new one instantly.

Return the order in which the CPU will process the tasks.

### Examples

**Example 1:**
```python
Input: tasks = [[1,2],[2,4],[3,2],[4,1]]
Output: [0,2,3,1]
```

**Example 2:**
```python
Input: tasks = [[7,10],[7,12],[7,5],[7,4],[7,2]]
Output: [4,3,2,0,1]
```

### Constraints

- `tasks.length == n`
- `1 <= n <= 10^5`
- `1 <= enqueueTimei, processingTimei <= 10^9`

---

## Solution

```python
import heapq
from typing import List

class Solution:
    def getOrder(self, tasks: List[List[int]]) -> List[int]:
        n = len(tasks)
        tasks = sorted([(t[0], t[1], i) for i, t in enumerate(tasks)])
        result = []
        i = 0
        time = 0
        heap = []
        
        while len(result) < n:
            # Add all available tasks
            while i < n and tasks[i][0] <= time:
                heapq.heappush(heap, (tasks[i][1], tasks[i][2]))
                i += 1
            
            if heap:
                proc, idx = heapq.heappop(heap)
                result.append(idx)
                time += proc
            else:
                # Jump to next task time
                if i < n:
                    time = tasks[i][0]
        
        return result
```

---

## Explanation

### Approach

1. **Sort Tasks**: Sort tasks by their enqueue time, keeping track of their original indices.
2. **Min-Heap**: Use a min-heap to prioritize tasks with the shortest processing time (and smallest index in case of ties).
3. **Simulation**: Simulate the CPU processing by:
   - Adding all available tasks to the heap when the current time reaches their enqueue time.
   - Processing the task with the shortest processing time from the heap.
   - If no tasks are available, jump to the next task's enqueue time.

### Time Complexity

- **O(n log n)** for sorting the tasks and heap operations.

### Space Complexity

- **O(n)** for storing the heap and sorted list.
