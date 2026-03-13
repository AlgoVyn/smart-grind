# The Number of the Smallest Unoccupied Chair

## Problem Description

There is a party where n friends numbered from 0 to n - 1 are attending. There is an infinite number of chairs numbered from 0 to infinity.

When a friend arrives, they sit on the unoccupied chair with the smallest number.

When a friend leaves, their chair becomes unoccupied. If another friend arrives at that same moment, they can sit in that chair.

Given times array where times[i] = [arrival_i, leaving_i], and targetFriend, return the chair number that targetFriend will sit on.

**Link to problem:** [The Number of the Smallest Unoccupied Chair - LeetCode 1942](https://leetcode.com/problems/the-number-of-the-smallest-unoccupied-chair/)

## Constraints
- `n == times.length`
- `2 <= n <= 10^4`
- `1 <= arrival_i < leaving_i <= 10^5`
- All arrival times are distinct

---

## Pattern: Priority Queue (Two Heaps)

## Intuition

The key insight for this problem is to simulate the chair assignment process efficiently. At any point in time:
1. We need to know which chairs are currently available (the smallest available chair number)
2. We need to know when each occupied chair will become available (the leaving time)

**Key Observations:**

1. **Two Priority Queues**: We need two data structures:
   - A min-heap for available chairs (to always get the smallest chair number)
   - A min-heap for leaving events (to know which chairs become free next)

2. **Process Arrivals in Order**: Sort friends by arrival time and process them one by one.

3. **Free Chairs Before Assignment**: Before assigning a chair to a new arrival, free all chairs whose leaving time is <= current arrival time.

4. **Immediate Reassignment**: If a friend leaves at time T and another arrives at time T, the leaving friend frees the chair first, then the arriving friend can take it (since we use <= comparison).

### Algorithm Overview

1. Sort events by arrival time
2. Initialize available chairs heap with 0 to n-1
3. Initialize leaving events heap (empty)
4. For each arrival:
   - Free chairs: while leaving[0].time <= arrival, pop and add chair to available
   - Assign smallest available chair
   - If this is target friend, return chair number
   - Push (leaving_time, chair) to leaving heap

This problem uses two priority queues to track available chairs and leaving events.

### Core Concept

- **Available chairs heap**: Min-heap of available chair numbers
- **Leaving events heap**: Min-heap of (leaving_time, chair)
- **Process arrivals in order**: Free chairs, assign smallest

---

## Examples

### Example

**Input:** times = [[1,4],[2,3],[4,6]], targetFriend = 1

**Output:** 1

---

## Multiple Approaches with Code

## Approach 1: Two Heaps (Optimal) ⭐

This is the optimal solution using two priority queues.

#### Algorithm

1. Sort events by arrival time
2. Use min-heap for available chairs
3. Use min-heap for leaving events
4. Process arrivals, freeing chairs and assigning smallest available

---

## Approach 2: Array Simulation

A simpler but less efficient approach using arrays.

---

## Comparison of Approaches

| Aspect | Two Heaps | Array Simulation |
|--------|-----------|------------------|
| **Time** | O(n log n) | O(n²) |
| **Space** | O(n) | O(n) |

---

````carousel
```python
import heapq
from typing import List

class Solution:
    def smallestChair(self, times: List[List[int]], targetFriend: int) -> int:
        n = len(times)
        
        # Add friend index to times
        for i in range(n):
            times[i].append(i)
        
        # Sort by arrival time
        times.sort()
        
        # Min-heap for available chairs
        available = list(range(n))
        heapq.heapify(available)
        
        # Min-heap for leaving times: (leaving_time, chair)
        leaving = []
        
        for arrival, leave, friend in times:
            # Free chairs that are now available
            while leaving and leaving[0][0] <= arrival:
                _, chair = heapq.heappop(leaving)
                heapq.heappush(available, chair)
            
            # Assign the smallest available chair
            chair = heapq.heappop(available)
            if friend == targetFriend:
                return chair
            
            # Schedule leaving
            heapq.heappush(leaving, (leave, chair))
        
        return -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int smallestChair(vector<vector<int>>& times, int targetFriend) {
        int n = times.size();
        
        // Add index to times and sort
        vector<int> idx(n);
        iota(idx.begin(), idx.end(), 0);
        sort(idx.begin(), idx.end(), [&](int a, int b) {
            return times[a][0] < times[b][0];
        });
        
        // Available chairs
        priority_queue<int, vector<int>, greater<int>> available;
        for (int i = 0; i < n; i++) available.push(i);
        
        // Leaving events: (time, chair)
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> leaving;
        
        for (int i = 0; i < n; i++) {
            int arrival = times[idx[i]][0];
            int leave = times[idx[i]][1];
            int friend = idx[i];
            
            // Free chairs
            while (!leaving.empty() && leaving.top().first <= arrival) {
                available.push(leaving.top().second);
                leaving.pop();
            }
            
            int chair = available.top(); available.pop();
            if (friend == targetFriend) return chair;
            
            leaving.push({leave, chair});
        }
        
        return -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int smallestChair(int[][] times, int targetFriend) {
        int n = times.length;
        
        // Sort by arrival time
        Integer[] idx = new Integer[n];
        for (int i = 0; i < n; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> Integer.compare(times[a][0], times[b][0]));
        
        // Available chairs
        PriorityQueue<Integer> available = new PriorityQueue<>();
        for (int i = 0; i < n; i++) available.offer(i);
        
        // Leaving events
        PriorityQueue<int[]> leaving = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        
        for (int i = 0; i < n; i++) {
            int arrival = times[idx[i]][0];
            int leave = times[idx[i]][1];
            int friend = idx[i];
            
            while (!leaving.isEmpty() && leaving.peek()[0] <= arrival) {
                available.offer(leaving.poll()[1]);
            }
            
            int chair = available.poll();
            if (friend == targetFriend) return chair;
            
            leaving.offer(new int[]{leave, chair});
        }
        
        return -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} times
 * @param {number} targetFriend
 * @return {number}
 */
var smallestChair = function(times, targetFriend) {
    const n = times.length;
    
    // Sort by arrival time, keep original index
    const indexed = times.map((t, i) => [...t, i]);
    indexed.sort((a, b) => a[0] - b[0]);
    
    // Available chairs
    const available = Array.from({length: n}, (_, i) => i);
    
    // Leaving events: [time, chair]
    const leaving = [];
    
    for (const [arrival, leave, friend] of indexed) {
        // Free chairs
        while (leaving.length && leaving[0][0] <= arrival) {
            available.push(heapq.heappop(leaving)[1]);
        }
        
        available.sort((a, b) => a - b);
        const chair = available.shift();
        
        if (friend === targetFriend) return chair;
        
        heapq.heappush(leaving, [leave, chair]);
    }
    
    return -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - sorting + heap operations |
| **Space** | O(n) - heaps |

---

## Summary

The **Smallest Unoccupied Chair** problem demonstrates **Two Priority Queues**:
- One heap for available chairs
- One heap for leaving events
- O(n log n) time complexity

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Task Scheduler | [Link](https://leetcode.com/problems/task-scheduler/) | CPU scheduling |
| Meeting Rooms II | [Link](https://leetcode.com/problems/meeting-rooms-ii/) | Room scheduling |
| Minimum Number of Swaps to Make the String Balanced | [Link](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced/) | Similar greedy |

---

## Video Tutorial Links

- [NeetCode - Smallest Unoccupied Chair](https://www.youtube.com/watch?v=SuJyGk1kG5E) - Clear explanation
- [Heap Simulation Explained](https://www.youtube.com/watch?v=qH0bgiMuj9U) - Detailed walkthrough
- [LeetCode Official](https://www.youtube.com/watch?v=3Q_o3J3qGiY) - Official solution

---

## Follow-up Questions

### Q1: What if friends can arrive at the exact same time?

**Answer:** The problem states all arrival times are distinct, so this isn't an issue.

### Q2: How would you track all chairs ever used?

**Answer:** Keep a set of all assigned chairs. The maximum chair number gives total chairs needed.

### Q3: What if chairs had costs and we wanted minimum total cost?

**Answer:** Use a priority queue ordered by cost instead of chair number.

---

## Common Pitfalls

### 1. Heap Initialization
**Issue**: Not initializing available chairs correctly.

**Solution**: Start with chairs 0 to n-1 in the available heap, since at most n friends need chairs at any time.

### 2. Chair Release Timing
**Issue**: Not releasing chairs at the right time.

**Solution**: Release chairs when leaving time <= current arrival time, not just <.

### 3. Index Tracking
**Issue**: Losing track of original friend indices after sorting.

**Solution**: Include the original friend index in the sorted array or use a separate mapping.

### 4. Empty Heap Handling
**Issue**: Not handling case when no chairs are available.

**Solution**: The algorithm naturally handles this - if available is empty, the next chair number (n + number of processed friends) will be used.

### 5. Time Overflow
**Issue**: Using int instead of long for time values.

**Solution**: The constraints have times up to 10^5, which fits in int, but be careful with larger inputs.
