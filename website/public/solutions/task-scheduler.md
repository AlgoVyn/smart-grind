# Task Scheduler

## Problem Description

You are given an array of CPU tasks, each labeled with a letter from A to Z, and a number `n`. Each CPU interval can be idle or allow the completion of one task. Tasks can be completed in any order, but there's a constraint: there has to be a gap of at least `n` intervals between two tasks with the same label.

Return the minimum number of CPU intervals required to complete all tasks.

**LeetCode Link:** [Task Scheduler - LeetCode 621](https://leetcode.com/problems/task-scheduler/)

---

## Examples

### Example 1

**Input:**
```python
tasks = ["A","A","A","B","B","B"], n = 2
```

**Output:**
```python
8
```

**Explanation:** A possible sequence is: `A -> B -> idle -> A -> B -> idle -> A -> B`.

### Example 2

**Input:**
```python
tasks = ["A","C","A","B","D","B"], n = 1
```

**Output:**
```python
6
```

**Explanation:** A possible sequence is: `A -> B -> C -> D -> A -> B`.

### Example 3

**Input:**
```python
tasks = ["A","A","A","B","B","B"], n = 3
```

**Output:**
```python
10
```

**Explanation:** A possible sequence is: `A -> B -> idle -> idle -> A -> B -> idle -> idle -> A -> B`.

---

## Constraints

- `1 <= tasks.length <= 10^4`
- `tasks[i]` is an uppercase English letter.
- `0 <= n <= 100`

---

## Pattern: Mathematical Formula (Greedy)

This problem uses a **mathematical formula** derived from the observation that the task with the highest frequency determines the minimum intervals needed. The formula `(max_freq - 1) * (n + 1) + max_count` calculates the minimum intervals accounting for cooling periods between repeated tasks.

---

## Intuition

The key insight for this problem is understanding how the most frequent task dictates the schedule.

### Key Observations

1. **Most Frequent Task Dictates Schedule**: The task with the highest frequency creates "slots" that other tasks must fill.

2. **The Formula**: `(max_freq - 1) * (n + 1) + max_count`
   - `max_freq - 1`: Number of complete cycles needed before the last occurrence
   - `n + 1`: Each cycle has n cooling slots + 1 task slot
   - `max_count`: Number of tasks that have maximum frequency (they fill the last cycle together)

3. **Two Scenarios**:
   - If `n` is large, we need idle time between tasks
   - If `n` is small (or tasks are diverse), we can complete without idle

4. **Why It Works**: The most frequent task creates the longest "chain". Other tasks must fill the gaps between these frequent tasks.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Mathematical Formula (Optimal)** - O(n) time
2. **Priority Queue / Greedy** - Alternative approach

---

## Approach 1: Mathematical Formula (Optimal)

### Algorithm Steps

1. **Count frequencies**: Use Counter to count each task's frequency
2. **Find max frequency**: Get the highest frequency
3. **Count max frequency tasks**: Count how many tasks have this max frequency
4. **Apply formula**: Calculate `(max_freq - 1) * (n + 1) + max_count`
5. **Take maximum**: Return max(calculated, total_tasks)

### Code Implementation

````carousel
```python
from typing import List
import collections

class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        """
        Find minimum intervals needed to complete all tasks with cooling period n.
        
        Args:
            tasks: List of task labels
            n: Cooling period
            
        Returns:
            Minimum number of intervals
        """
        if not tasks:
            return 0
        
        # Count frequency of each task
        freq = collections.Counter(tasks)
        max_freq = max(freq.values())
        
        # Count how many tasks have the maximum frequency
        max_count = sum(1 for count in freq.values() if count == max_freq)
        
        # The formula: (max_freq - 1) * (n + 1) + max_count
        # This accounts for the gaps and the last set of tasks
        part_length = (max_freq - 1) * (n + 1) + max_count
        
        return max(part_length, len(tasks))
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        if (tasks.empty()) return 0;
        
        // Count frequency
        unordered_map<char, int> freq;
        for (char t : tasks) {
            freq[t]++;
        }
        
        // Find max frequency
        int maxFreq = 0;
        for (auto& p : freq) {
            maxFreq = max(maxFreq, p.second);
        }
        
        // Count tasks with max frequency
        int maxCount = 0;
        for (auto& p : freq) {
            if (p.second == maxFreq) maxCount++;
        }
        
        // Formula
        int partLength = (maxFreq - 1) * (n + 1) + maxCount;
        
        return max(partLength, (int)tasks.size());
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int leastInterval(char[] tasks, int n) {
        if (tasks == null || tasks.length == 0) return 0;
        
        // Count frequency
        Map<Character, Integer> freq = new HashMap<>();
        for (char t : tasks) {
            freq.put(t, freq.getOrDefault(t, 0) + 1);
        }
        
        // Find max frequency
        int maxFreq = 0;
        for (int count : freq.values()) {
            maxFreq = Math.max(maxFreq, count);
        }
        
        // Count tasks with max frequency
        int maxCount = 0;
        for (int count : freq.values()) {
            if (count == maxFreq) maxCount++;
        }
        
        // Formula
        int partLength = (maxFreq - 1) * (n + 1) + maxCount;
        
        return Math.max(partLength, tasks.length);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {character[]} tasks
 * @param {number} n
 * @return {number}
 */
var leastInterval = function(tasks, n) {
    if (!tasks || tasks.length === 0) return 0;
    
    // Count frequency
    const freq = {};
    for (const t of tasks) {
        freq[t] = (freq[t] || 0) + 1;
    }
    
    // Find max frequency
    const maxFreq = Math.max(...Object.values(freq));
    
    // Count tasks with max frequency
    let maxCount = 0;
    for (const count of Object.values(freq)) {
        if (count === maxFreq) maxCount++;
    }
    
    // Formula
    const partLength = (maxFreq - 1) * (n + 1) + maxCount;
    
    return Math.max(partLength, tasks.length);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N) where N is number of tasks |
| **Space** | O(1) - only 26 possible task types |

---

## Approach 2: Priority Queue / Greedy

### Algorithm Steps

1. Use max heap to always pick the most frequent available task
2. Use a queue to track when tasks become available again
3. Process until all tasks are done

### Why It Works

This approach simulates the actual scheduling process, always picking the most frequent available task.

### Code Implementation

````carousel
```python
from typing import List
import collections
import heapq

class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        if not tasks:
            return 0
        
        # Count frequencies
        freq = collections.Counter(tasks)
        
        # Max heap (negative for max heap behavior)
        max_heap = [-count for count in freq.values()]
        heapq.heapify(max_heap)
        
        # Time counter
        time = 0
        
        # Queue of (negative_count, available_time)
        queue = []
        
        while max_heap or queue:
            time += 1
            
            # If there's a task available in heap
            if max_heap:
                count = heapq.heappop(max_heap) + 1  # Restore positive count
                if count < 0:
                    queue.append((count, time + n))
            
            # If queue front is available, add back to heap
            if queue and queue[0][1] <= time:
                task = heapq.heappop(queue)
                heapq.heappush(max_heap, task[0])
        
        return time
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <queue>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        if (tasks.empty()) return 0;
        
        // Count frequency
        unordered_map<char, int> freq;
        for (char t : tasks) freq[t]++;
        
        // Max heap
        priority_queue<int> pq;
        for (auto& p : freq) pq.push(p.second);
        
        int time = 0;
        queue<pair<int, int>> q; // (count, available_time)
        
        while (!pq.empty() || !q.empty()) {
            time++;
            
            if (!pq.empty()) {
                int count = pq.top() - 1;
                pq.pop();
                if (count > 0) {
                    q.push({count, time + n});
                }
            }
            
            if (!q.empty() && q.front().second <= time) {
                pq.push(q.front().first);
                q.pop();
            }
        }
        
        return time;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int leastInterval(char[] tasks, int n) {
        if (tasks == null || tasks.length == 0) return 0;
        
        // Count frequency
        Map<Character, Integer> freq = new HashMap<>();
        for (char t : tasks) {
            freq.put(t, freq.getOrDefault(t, 0) + 1);
        }
        
        // Max heap
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        pq.addAll(freq.values());
        
        int time = 0;
        Queue<int[]> q = new LinkedList<>(); // (count, available_time)
        
        while (!pq.isEmpty() || !q.isEmpty()) {
            time++;
            
            if (!pq.isEmpty()) {
                int count = pq.poll() - 1;
                if (count > 0) {
                    q.offer(new int[]{count, time + n});
                }
            }
            
            if (!q.isEmpty() && q.peek()[1] <= time) {
                pq.offer(q.poll()[0]);
            }
        }
        
        return time;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {character[]} tasks
 * @param {number} n
 * @return {number}
 */
var leastInterval = function(tasks, n) {
    if (!tasks || tasks.length === 0) return 0;
    
    // Count frequency
    const freq = {};
    for (const t of tasks) {
        freq[t] = (freq[t] || 0) + 1;
    }
    
    // Max heap
    const pq = Object.values(freq).sort((a, b) => b - a);
    
    let time = 0;
    const queue = [];
    
    while (pq.length > 0 || queue.length > 0) {
        time++;
        
        if (pq.length > 0) {
            const count = pq.shift() - 1;
            if (count > 0) {
                queue.push([count, time + n]);
            }
        }
        
        if (queue.length > 0 && queue[0][1] <= time) {
            pq.push(queue.shift()[0]);
            pq.sort((a, b) => b - a);
        }
    }
    
    return time;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N log K) where K is unique tasks |
| **Space** | O(K) |

---

## Comparison of Approaches

| Aspect | Formula | Priority Queue |
|--------|---------|-----------------|
| **Time Complexity** | O(N) | O(N log K) |
| **Space Complexity** | O(1) | O(K) |
| **Implementation** | Simple | Complex |
| **Recommended** | ✅ | For understanding |

**Best Approach:** Use Approach 1 (Formula) for optimal O(N) solution.

---

## Common Pitfalls

### 1. Formula Understanding
**Issue**: Not understanding the formula components.

**Solution**: Remember: `(max_freq - 1) * (n + 1) + max_count` accounts for cycles and final tasks.

### 2. Taking Maximum
**Issue**: Not taking max with total tasks.

**Solution**: Return `max(formula_result, len(tasks))` to handle small n cases.

### 3. max_count
**Issue**: Using max_freq instead of count of tasks with max_freq.

**Solution**: Count how many tasks have the maximum frequency.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very commonly asked in technical interviews
- **Companies**: Amazon, Microsoft, Facebook
- **Difficulty**: Medium/Hard
- **Concepts Tested**: Greedy, Mathematics, Priority Queue

### Learning Outcomes

1. **Mathematical Thinking**: Derive formulas from problem patterns
2. **Greedy Strategy**: Understand how frequency affects scheduling
3. **Edge Cases**: Handle various n values correctly

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Reorganize String | [Link](https://leetcode.com/problems/reorganize-string/) | Similar frequency-based scheduling |
| Task Scheduler II | [Link](https://leetcode.com/problems/task-scheduler-ii/) | Extension of this problem |
| Number of Tasks | [Link](https://leetcode.com/problems/count-sorted-vowels-strings/) | String arrangements |

---

## Video Tutorial Links

1. **[NeetCode - Task Scheduler](https://www.youtube.com/watch?v=s8pfrxwgw9s)** - Clear explanation
2. **[Task Scheduler Formula](https://www.youtube.com/watch?v=2gB1n-1ux38)** - Mathematical derivation

---

## Follow-up Questions

### Q1: How would you modify to return the actual schedule?

**Answer**: Use the priority queue approach and track the actual task sequence.

### Q2: What if tasks have different cooling requirements?

**Answer**: Would need a more complex scheduling algorithm, possibly using priority queue with multiple cooling times.

### Q3: How would you handle tasks with priorities?

**Answer**: Modify the priority queue to consider both frequency and priority.

---

## Summary

The **Task Scheduler** problem demonstrates how mathematical formulas can solve scheduling problems efficiently.

Key takeaways:
1. The most frequent task dictates the schedule
2. Formula: `(max_freq - 1) * (n + 1) + max_count`
3. Always take max with total tasks to handle small n
4. Time complexity is O(N)
5. The problem tests mathematical derivation and greedy thinking

This problem is essential for understanding how to derive optimal solutions from problem patterns.
