# Sliding Window - Monotonic Queue for Max/Min

## Problem Description

The Monotonic Queue pattern efficiently finds the maximum or minimum element in each sliding window in **O(n)** time using a deque (double-ended queue). This is optimal compared to the O(n×k) brute force approach.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - each element pushed and popped at most once |
| Space Complexity | O(k) - deque stores at most k elements |
| Input | Array of elements and window size k |
| Output | Array of max/min values for each window position |
| Approach | Monotonic deque maintaining order for constant access |

### When to Use

- Finding maximum/minimum in each sliding window
- Problems requiring tracking extrema in dynamic ranges
- Stream processing with fixed buffer sizes
- Problems where you need next greater/smaller elements
- Range minimum/maximum queries in arrays

## Intuition

The key insight is **maintaining order** within the deque to enable constant-time access to extrema.

The "aha!" moments:

1. **Monotonic property**: Elements in deque are always sorted (decreasing for max)
2. **Front holds the max**: The front of deque is always the window maximum
3. **Out-of-window removal**: Remove indices that left the window from the front
4. **Worse elements removal**: Remove smaller elements from back when adding new
5. **Each element processed once**: Push and pop at most once each

## Solution Approaches

### Approach 1: Monotonic Decreasing Queue (Maximum) ✅ Recommended

#### Algorithm

1. Initialize an empty deque to store indices
2. For each element in the array:
   - Remove indices outside the current window from the front
   - Remove indices of smaller elements from the back
   - Add current index to the back
   - Once window is full (i >= k-1), front is the maximum

#### Implementation

````carousel
```python
from collections import deque

def max_in_sliding_window(arr: list[int], k: int) -> list[int]:
    """
    Find maximum in each sliding window of size k.
    LeetCode 239 - Sliding Window Maximum
    Time: O(n), Space: O(k)
    """
    if not arr or k <= 0 or k > len(arr):
        return []
    
    result = []
    dq = deque()  # Stores indices, values in decreasing order
    
    for i in range(len(arr)):
        # Remove indices outside the window
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Remove indices of elements smaller than current
        while dq and arr[dq[-1]] < arr[i]:
            dq.pop()
        
        dq.append(i)
        
        # Add to result once we have k elements
        if i >= k - 1:
            result.append(arr[dq[0]])
    
    return result
```
<!-- slide -->
```cpp
#include <vector>
#include <deque>

std::vector<int> maxInWindow(const std::vector<int>& arr, int k) {
    // Find maximum in each sliding window of size k.
    // Time: O(n), Space: O(k)
    if (arr.empty() || k <= 0 || k > arr.size()) return {};
    
    std::vector<int> result;
    std::deque<int> dq;  // Stores indices, decreasing values
    
    for (int i = 0; i < arr.size(); i++) {
        // Remove indices outside window
        while (!dq.empty() && dq.front() <= i - k)
            dq.pop_front();
        
        // Remove smaller elements
        while (!dq.empty() && arr[dq.back()] < arr[i])
            dq.pop_back();
        
        dq.push_back(i);
        
        if (i >= k - 1)
            result.push_back(arr[dq.front()]);
    }
    
    return result;
}
```
<!-- slide -->
```java
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.ArrayList;
import java.util.List;

public List<Integer> maxInWindow(int[] arr, int k) {
    // Find maximum in each sliding window of size k.
    // Time: O(n), Space: O(k)
    List<Integer> result = new ArrayList<>();
    if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) return result;
    
    Deque<Integer> dq = new ArrayDeque<>();  // Stores indices
    
    for (int i = 0; i < arr.length; i++) {
        // Remove indices outside window
        while (!dq.isEmpty() && dq.peekFirst() <= i - k)
            dq.pollFirst();
        
        // Remove smaller elements
        while (!dq.isEmpty() && arr[dq.peekLast()] < arr[i])
            dq.pollLast();
        
        dq.addLast(i);
        
        if (i >= k - 1)
            result.add(arr[dq.peekFirst()]);
    }
    
    return result;
}
```
<!-- slide -->
```javascript
function maxInWindow(arr, k) {
    // Find maximum in each sliding window of size k.
    // Time: O(n), Space: O(k)
    if (!arr || arr.length === 0 || k <= 0 || k > arr.length) return [];
    
    const result = [];
    const dq = [];  // Stores indices, decreasing values
    
    for (let i = 0; i < arr.length; i++) {
        // Remove indices outside window
        while (dq.length > 0 && dq[0] <= i - k)
            dq.shift();
        
        // Remove smaller elements
        while (dq.length > 0 && arr[dq[dq.length - 1]] < arr[i])
            dq.pop();
        
        dq.push(i);
        
        if (i >= k - 1)
            result.push(arr[dq[0]]);
    }
    
    return result;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - each element pushed and popped at most once |
| Space | O(k) - deque stores at most k elements |

### Approach 2: Monotonic Increasing Queue (Minimum)

For minimum, use `>` instead of `<` to maintain increasing order.

#### Implementation

````carousel
```python
def min_in_sliding_window(arr: list[int], k: int) -> list[int]:
    """
    Find minimum in each sliding window of size k.
    Time: O(n), Space: O(k)
    """
    if not arr or k <= 0 or k > len(arr):
        return []
    
    result = []
    dq = deque()  # Stores indices, values in increasing order
    
    for i in range(len(arr)):
        # Remove indices outside the window
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Remove indices of elements larger than current
        while dq and arr[dq[-1]] > arr[i]:
            dq.pop()
        
        dq.append(i)
        
        if i >= k - 1:
            result.append(arr[dq[0]])
    
    return result
```
<!-- slide -->
```cpp
std::vector<int> minInWindow(const std::vector<int>& arr, int k) {
    // Find minimum in each sliding window of size k.
    if (arr.empty() || k <= 0 || k > arr.size()) return {};
    
    std::vector<int> result;
    std::deque<int> dq;  // Stores indices, increasing values
    
    for (int i = 0; i < arr.size(); i++) {
        while (!dq.empty() && dq.front() <= i - k)
            dq.pop_front();
        
        while (!dq.empty() && arr[dq.back()] > arr[i])
            dq.pop_back();
        
        dq.push_back(i);
        
        if (i >= k - 1)
            result.push_back(arr[dq.front()]);
    }
    
    return result;
}
```
<!-- slide -->
```java
public List<Integer> minInWindow(int[] arr, int k) {
    // Find minimum in each sliding window of size k.
    List<Integer> result = new ArrayList<>();
    if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) return result;
    
    Deque<Integer> dq = new ArrayDeque<>();
    
    for (int i = 0; i < arr.length; i++) {
        while (!dq.isEmpty() && dq.peekFirst() <= i - k)
            dq.pollFirst();
        
        while (!dq.isEmpty() && arr[dq.peekLast()] > arr[i])
            dq.pollLast();
        
        dq.addLast(i);
        
        if (i >= k - 1)
            result.add(arr[dq.peekFirst()]);
    }
    
    return result;
}
```
<!-- slide -->
```javascript
function minInWindow(arr, k) {
    // Find minimum in each sliding window of size k.
    if (!arr || arr.length === 0 || k <= 0 || k > arr.length) return [];
    
    const result = [];
    const dq = [];  // Stores indices, increasing values
    
    for (let i = 0; i < arr.length; i++) {
        while (dq.length > 0 && dq[0] <= i - k)
            dq.shift();
        
        while (dq.length > 0 && arr[dq[dq.length - 1]] > arr[i])
            dq.pop();
        
        dq.push(i);
        
        if (i >= k - 1)
            result.push(arr[dq[0]]);
    }
    
    return result;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(k) |

## Complexity Analysis

| Approach | Time | Space | Use Case |
|----------|------|-------|----------|
| Monotonic Decreasing | O(n) | O(k) | Maximum in each window |
| Monotonic Increasing | O(n) | O(k) | Minimum in each window |
| Combined Max-Min | O(n) | O(k) | Both in single pass |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) | 239 | Hard | Max in each window |
| [Sliding Window Median](https://leetcode.com/problems/sliding-window-median/) | 480 | Hard | Median in each window |
| [Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum/) | 1425 | Medium | DP + monotonic deque |
| [Shortest Subarray with Sum at Least K](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/) | 862 | Hard | Prefix sum + monotonic deque |
| [Jump Game VI](https://leetcode.com/problems/jump-game-vi/) | 1696 | Medium | DP + sliding window max |

## Video Tutorial Links

1. **[NeetCode - Sliding Window Maximum](https://www.youtube.com/watch?v=49d50a_jp10)** - Comprehensive deque explanation
2. **[Take U Forward - Sliding Window Maximum](https://www.youtube.com/watch?v=DfljaUwG2i8)** - Detailed walkthrough
3. **[WilliamFiset - Monotonic Queue](https://www.youtube.com/watch?v=MC_ZPiXyqHs)** - Algorithmic explanation
4. **[Sliding Window Median](https://www.youtube.com/watch?v=Cs3s1R7WOMM)** - Advanced median calculation
5. **[Constrained Subsequence Sum](https://www.youtube.com/watch?v=o2L4jSa6j9k)** - Deque application

## Summary

### Key Takeaways

- **Monotonic deque** maintains elements in sorted order (by index)
- **Front is always optimal**: Contains max/min of current window
- **Remove out-of-window first**: Always check `dq[0] <= i - k`
- **Remove worse elements**: Pop from back while current is better
- **Use `<` vs `<=`**: Choose based on duplicate handling needs

### Common Pitfalls

1. Not removing out-of-window elements before adding new ones
2. Using `<=` vs `<` incorrectly for duplicates
3. Storing values instead of indices (can't check window bounds)
4. Off-by-one in window check: use `i - k` not `i - k + 1`
5. Not starting to record results until `i >= k - 1`

### Follow-up Questions

1. **What's the difference from a priority queue?**
   - Deque gives O(1) for both ends; priority queue is O(log n)

2. **How do you handle variable-size windows?**
   - Use two pointers and adjust window based on conditions

3. **Can you get both max and min in one pass?**
   - Yes, maintain two deques simultaneously

4. **What if elements are streaming?**
   - Use circular buffer with timestamps for eviction

5. **How does this compare to segment trees?**
   - Deque: O(1) per window, O(k) space; Segment tree: O(log n) query, O(n) space

## Pattern Source

[Monotonic Queue Pattern](patterns/sliding-window-monotonic-queue-for-max-min.md)
