# Single-Threaded CPU

## Problem Description

You are given `n` tasks labeled from `0` to `n - 1` represented by a 2D integer array `tasks`, where `tasks[i] = [enqueueTimei, processingTimei]` means that the i-th task will be available to process at `enqueueTimei` and will take `processingTimei` to finish processing.

You have a single-threaded CPU that can process at most one task at a time:
- If idle and no tasks available, CPU remains idle
- If idle and tasks available, choose shortest processing time (tie: smallest index)
- Once started, CPU processes task without stopping
- CPU can finish and start new task instantly

Return the order in which the CPU will process the tasks.

**Link to problem:** [Single-Threaded CPU - LeetCode 1834](https://leetcode.com/problems/single-threaded-cpu/)

## Constraints
- `tasks.length == n`
- `1 <= n <= 10^5`
- `1 <= enqueueTimei, processingTimei <= 10^9`

---

## Pattern: Priority Queue (Heap) Simulation

This problem uses a **Priority Queue** to simulate CPU task scheduling.

### Core Concept

- **Sort by enqueue time**: Process tasks in arrival order
- **Min-heap for available tasks**: Always pick shortest processing time
- **Simulation**: Track current time and process tasks

---

## Intuition

The key insight is simulating the CPU scheduling algorithm:

1. **Sort tasks by enqueue time**: Tasks become available at different times, so we need to process them in order of availability.

2. **Use a min-heap for available tasks**: At any given time, we need to pick the task with the shortest processing time from all available tasks.

3. **Track current time**: The CPU time advances as we process tasks. When the CPU is idle and no tasks are available, we jump forward to the next task's enqueue time.

4. **Tie-breaking**: When two tasks have the same processing time, we pick the one with the smaller original index.

---

## Examples

### Example

**Input:** tasks = [[1,2],[2,4],[3,2],[4,1]]

**Output:** [0,2,3,1]

### Example 2

**Input:** tasks = [[7,10],[7,12],[7,5],[7,4],[7,2]]

**Output:** [4,3,2,0,1]

---

## Multiple Approaches with Code

## Approach 1: Priority Queue (Optimal) ⭐

This is the optimal solution using a min-heap to always pick the shortest available task.

#### Algorithm

1. Sort tasks by enqueue time
2. Use a min-heap to track available tasks
3. Process tasks in order of shortest processing time

#### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def getOrder(self, tasks: List[List[int]]) -> List[int]:
        n = len(tasks)
        
        # Sort tasks by enqueue time, keep original indices
        tasks = sorted([(t[0], t[1], i) for i, t in enumerate(tasks)])
        
        result = []
        i = 0  # Task index
        time = 0
        heap = []
        
        while len(result) < n:
            # Add all available tasks to heap
            while i < n and tasks[i][0] <= time:
                # (processing_time, original_index)
                heapq.heappush(heap, (tasks[i][1], tasks[i][2]))
                i += 1
            
            if heap:
                proc, idx = heapq.heappop(heap)
                result.append(idx)
                time += proc
            else:
                # Jump to next task's enqueue time
                if i < n:
                    time = tasks[i][0]
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> getOrder(vector<vector<int>>& tasks) {
        int n = tasks.size();
        
        // Sort by enqueue time
        vector<int> idx(n);
        iota(idx.begin(), idx.end(), 0);
        sort(idx.begin(), idx.end(), [&](int a, int b) {
            return tasks[a][0] < tasks[b][0];
        });
        
        vector<int> result;
        long long time = 0;
        int i = 0;
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
        
        while (result.size() < n) {
            while (i < n && tasks[idx[i]][0] <= time) {
                pq.push({tasks[idx[i]][1], idx[i]});
                i++;
            }
            
            if (!pq.empty()) {
                auto [proc, id] = pq.top(); pq.pop();
                result.push_back(id);
                time += proc;
            } else if (i < n) {
                time = tasks[idx[i]][0];
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] getOrder(int[][] tasks) {
        int n = tasks.length;
        
        // Sort by enqueue time
        Integer[] idx = new Integer[n];
        for (int i = 0; i < n; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> Integer.compare(tasks[a][0], tasks[b][0]));
        
        int[] result = new int[n];
        long time = 0;
        int i = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> {
            if (a[0] != b[0]) return Integer.compare(a[0], b[0]);
            return Integer.compare(a[1], b[1]);
        });
        
        int r = 0;
        while (r < n) {
            while (i < n && tasks[idx[i]][0] <= time) {
                pq.offer(new int[]{tasks[idx[i]][1], idx[i]});
                i++;
            }
            
            if (!pq.isEmpty()) {
                int[] cur = pq.poll();
                result[r++] = cur[1];
                time += cur[0];
            } else if (i < n) {
                time = tasks[idx[i]][0];
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} tasks
 * @return {number[]}
 */
var getOrder = function(tasks) {
    const n = tasks.length;
    
    // Sort by enqueue time
    const idx = Array.from({length: n}, (_, i) => i);
    idx.sort((a, b) => tasks[a][0] - tasks[b][0]);
    
    const result = [];
    let time = 0;
    let i = 0;
    const heap = [];
    
    while (result.length < n) {
        while (i < n && tasks[idx[i]][0] <= time) {
            heap.push([tasks[idx[i]][1], idx[i]]);
            heap.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
            i++;
        }
        
        if (heap.length > 0) {
            const [proc, id] = heap.shift();
            result.push(id);
            time += proc;
        } else if (i < n) {
            time = tasks[idx[i]][0];
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - sorting + heap operations |
| **Space** | O(n) - heap and result storage |

---

## Approach 2: Sorting + Array Simulation

A simpler but less efficient approach using sorting and array operations.

#### Algorithm

1. Sort tasks by enqueue time initially
2. Scan through tasks linearly, always finding the minimum available task
3. Use array operations instead of heap

#### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def getOrder(self, tasks: List[List[int]]) -> List[int]:
        n = len(tasks)
        
        # Add original index and sort by enqueue time
        tasks_with_idx = [(t[0], t[1], i) for i, t in enumerate(tasks)]
        tasks_with_idx.sort(key=lambda x: x[0])
        
        result = []
        current_time = 0
        processed = 0
        
        while processed < n:
            # Find available tasks at current time
            available = []
            for i in range(processed, n):
                if tasks_with_idx[i][0] <= current_time:
                    available.append((tasks_with_idx[i][1], tasks_with_idx[i][2]))
                else:
                    break
            
            if available:
                # Sort by processing time, then by index
                available.sort()
                proc_time, idx = available[0]
                result.append(idx)
                current_time += proc_time
                processed += 1
            else:
                # Jump to next task time
                if processed < n:
                    current_time = tasks_with_idx[processed][0]
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<int> getOrder(vector<vector<int>>& tasks) {
        int n = tasks.size();
        
        // Create indexed tasks and sort
        vector<tuple<int,int,int>> indexed;
        for (int i = 0; i < n; i++) {
            indexed.emplace_back(tasks[i][0], tasks[i][1], i);
        }
        sort(indexed.begin(), indexed.end());
        
        vector<int> result;
        long long time = 0;
        int processed = 0;
        
        while (processed < n) {
            int bestProc = INT_MAX, bestIdx = -1;
            
            // Find minimum available
            for (int i = processed; i < n; i++) {
                auto [et, pt, idx] = indexed[i];
                if (et <= time) {
                    if (pt < bestProc || (pt == bestProc && idx < bestIdx)) {
                        bestProc = pt;
                        bestIdx = idx;
                    }
                } else {
                    break;
                }
            }
            
            if (bestIdx != -1) {
                result.push_back(bestIdx);
                time += bestProc;
                processed++;
            } else {
                time = get<0>(indexed[processed]);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[] getOrder(int[][] tasks) {
        int n = tasks.length;
        
        // Create indexed tasks
        int[][] indexed = new int[n][3];
        for (int i = 0; i < n; i++) {
            indexed[i][0] = tasks[i][0];
            indexed[i][1] = tasks[i][1];
            indexed[i][2] = i;
        }
        Arrays.sort(indexed, Comparator.comparingInt(a -> a[0]));
        
        int[] result = new int[n];
        long time = 0;
        int processed = 0;
        
        for (int r = 0; r < n; r++) {
            int bestProc = Integer.MAX_VALUE;
            int bestIdx = -1;
            
            for (int i = processed; i < n; i++) {
                if (indexed[i][0] <= time) {
                    if (indexed[i][1] < bestProc || 
                        (indexed[i][1] == bestProc && indexed[i][2] < bestIdx)) {
                        bestProc = indexed[i][1];
                        bestIdx = indexed[i][2];
                    }
                } else {
                    break;
                }
            }
            
            if (bestIdx != -1) {
                result[r] = bestIdx;
                time += bestProc;
                processed++;
            } else {
                time = indexed[processed][0];
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
var getOrder = function(tasks) {
    const n = tasks.length;
    
    // Create indexed tasks and sort
    const indexed = tasks.map((t, i) => [t[0], t[1], i]);
    indexed.sort((a, b) => a[0] - b[0]);
    
    const result = [];
    let time = 0;
    let processed = 0;
    
    while (processed < n) {
        let bestProc = Infinity, bestIdx = -1;
        
        for (let i = processed; i < n; i++) {
            if (indexed[i][0] <= time) {
                if (indexed[i][1] < bestProc || 
                    (indexed[i][1] === bestProc && indexed[i][2] < bestIdx)) {
                    bestProc = indexed[i][1];
                    bestIdx = indexed[i][2];
                }
            } else {
                break;
            }
        }
        
        if (bestIdx !== -1) {
            result.push(bestIdx);
            time += bestProc;
            processed++;
        } else {
            time = indexed[processed][0];
        }
    }
    
    return result;
};
```
``"

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - linear scan for each task |
| **Space** | O(n) - result storage |

---

## Summary

The **Single-Threaded CPU** problem demonstrates **Priority Queue Simulation**:
- Sort tasks by enqueue time
- Use min-heap for processing order
- Simulate CPU execution
- O(n log n) time complexity

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Task Scheduler | [Link](https://leetcode.com/problems/task-scheduler/) | Similar scheduling |
| Shortest Job First | [Link](https://en.wikipedia.org/wiki/Shortest_Job_Next) | OS scheduling concept |
| Single Threaded CPU (Hard) | [Link](https://leetcode.com/problems/single-threaded-cpu/) | This problem |

---

## Video Tutorial Links

- [NeetCode - Single Threaded CPU](https://www.youtube.com/watch?v=SuJyGk1kG5E) - Clear explanation
- [CPU Scheduling](https://www.youtube.com/watch?v=qH0bgiMuj9U) - OS concepts
- [LeetCode Official](https://www.youtube.com/watch?v=3Q_o3J3qGiY) - Official solution

---

## Follow-up Questions

### Q1: What if tasks had priorities?

**Answer:** Add priority to the heap comparison. Tasks with higher priority would be processed first.

### Q2: How would you calculate total wait time?

**Answer:** Track (start_time - arrival_time) for each task. Sum all wait times.

### Q3: What if processing time could change dynamically?

**Answer:** Use a different data structure that supports priority updates, like a balanced BST.

### Q4: How would you simulate multiple CPUs?

**Answer:** Use multiple parallel processors, each with their own task queue. Distribute based on availability.

---

## Common Pitfalls

### 1. Task Sorting
**Issue**: Not sorting tasks by enqueue time correctly.

**Solution**: Sort tasks by enqueue time first, then process in order while adding available tasks to the heap.

### 2. Heap Comparison
**Issue**: Not handling tie-breaking correctly (smallest index when processing times are equal).

**Solution**: Include both processing time and original index in the heap tuple: (processing_time, original_index).

### 3. Idle Time Handling
**Issue**: Not handling CPU idle time when no tasks are available.

**Solution**: When heap is empty but tasks remain, jump time forward to the next task's enqueue time.

### 4. Time Type
**Issue**: Using int for time when it can exceed 2^31-1.

**Solution**: Use long (Python int is unlimited, but be careful in other languages).

### 5. Task Availability Check
**Issue**: Using < instead of <= when checking if task is available.

**Solution**: Use <= to include tasks that arrive at the current time.
