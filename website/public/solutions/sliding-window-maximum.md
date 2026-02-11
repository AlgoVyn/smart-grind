# Sliding Window Maximum

## Problem Statement

Given an integer array `nums` and an integer `k`, return the maximum value in each sliding window of size `k` as the window slides from left to right across the array.

**Link to problem:** [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)

**Constraints:**
- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`
- `1 <= k <= nums.length`

**Note:**
- You must find the maximum for each contiguous window of size k
- The window slides one position at a time
- The output array will have length `n - k + 1` where n is the length of nums
- O(n) solution is required for optimal performance with large inputs

---

## Examples

### Example 1

**Input:**
```
nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
```

**Output:**
```
[3, 3, 5, 5, 6, 7]
```

**Explanation:** The sliding window maximums are:
- Window [1, 3, -1] → max = 3
- Window [3, -1, -3] → max = 3
- Window [-1, -3, 5] → max = 5
- Window [-3, 5, 3] → max = 5
- Window [5, 3, 6] → max = 6
- Window [3, 6, 7] → max = 7

---

### Example 2

**Input:**
```
nums = [1], k = 1
```

**Output:**
```
[1]
```

**Explanation:** Only one window of size 1, maximum is 1.

---

### Example 3

**Input:**
```
nums = [9, 8, 7, 6, 5, 4], k = 3
```

**Output:**
```
[9, 8, 7, 6]
```

**Explanation:** Array is in decreasing order, so each window's maximum is the leftmost element.

---

### Example 4

**Input:**
```
nums = [1, 2, 3, 4, 5, 6, 7], k = 3
```

**Output:**
```
[3, 4, 5, 6, 7]
```

**Explanation:** Array is in increasing order, so each window's maximum is the rightmost element.

---

### Example 5

**Input:**
```
nums = [4, -1, 2, 1], k = 2
```

**Output:**
```
[4, 2, 2]
```

**Explanation:**
- Window [4, -1] → max = 4
- Window [-1, 2] → max = 2
- Window [2, 1] → max = 2

---

### Example 6

**Input:**
```
nums = [1, -1], k = 1
```

**Output:**
```
[1, -1]
```

**Explanation:** Each window has size 1, so maximum is the element itself.

---

## Intuition

The Sliding Window Maximum problem requires finding the maximum value in each contiguous subarray of fixed size `k` as the window moves through the array. The naive approach would be to examine each window and find its maximum by scanning all `k` elements, resulting in O(n*k) time complexity.

### Core Insight

The key observation is that we need a data structure that can:
1. **Efficiently track the maximum** in the current window
2. **Quickly remove elements** that slide out of the window
3. **Quickly add new elements** as the window slides

This suggests using a **deque** (double-ended queue) that maintains elements in decreasing order. The front of the deque always contains the maximum of the current window.

### Key Observations

1. **Monotonic Decreasing Order**: Maintain elements in the deque in decreasing order so the front is always the maximum.

2. **Out-of-Window Removal**: Before processing a new element, remove elements from the back that are smaller (they can never be maximums).

3. **Stale Element Removal**: Remove elements from the front if their index is outside the current window.

4. **Window Start**: The first maximum appears when we have processed k elements (at index k-1).

---

## Multiple Approaches with Code

We'll cover three main approaches:

1. **Brute Force** - Simple but O(n*k) time
2. **Monotonic Deque** - Optimal O(n) time
3. **Max Heap** - O(n log k) time

---

## Approach 1: Brute Force

This approach examines each window of size k and finds the maximum by scanning all elements in the window.

#### Algorithm Steps

1. If array length equals k, return the single maximum
2. For each starting position `i` from `0` to `n - k`:
   - Initialize `max_val` to the first element of the window
   - Scan through all `k` elements in the window
   - Track the maximum value
   - Add the maximum to the result list
3. Return the result list

#### Code Implementation

````carousel
```python
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        """
        Find maximum in each sliding window using brute force.
        
        Args:
            nums: List of integers
            k: Window size
            
        Returns:
            List of maximum values for each window
        """
        if not nums or k == 0:
            return []
        
        n = len(nums)
        result = []
        
        # Process each window
        for i in range(n - k + 1):
            current_max = nums[i]
            
            # Find maximum in current window
            for j in range(i, i + k):
                if nums[j] > current_max:
                    current_max = nums[j]
            
            result.append(current_max)
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        /**
         * Find maximum in each sliding window using brute force.
         * 
         * Args:
         *     nums: List of integers
         *     k: Window size
         * 
         * Returns:
         *     Vector of maximum values for each window
         */
        if (nums.empty() || k == 0) {
            return {};
        }
        
        int n = nums.size();
        vector<int> result;
        
        // Process each window
        for (int i = 0; i <= n - k; i++) {
            int current_max = nums[i];
            
            // Find maximum in current window
            for (int j = i; j < i + k; j++) {
                if (nums[j] > current_max) {
                    current_max = nums[j];
                }
            }
            
            result.push_back(current_max);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        /**
         * Find maximum in each sliding window using brute force.
         * 
         * Args:
         *     nums: Array of integers
         *     k: Window size
         * 
         * Returns:
         *     Array of maximum values for each window
         */
        if (nums == null || nums.length == 0 || k == 0) {
            return new int[0];
        }
        
        int n = nums.length;
        int[] result = new int[n - k + 1];
        
        // Process each window
        for (int i = 0; i <= n - k; i++) {
            int current_max = nums[i];
            
            // Find maximum in current window
            for (int j = i; j < i + k; j++) {
                if (nums[j] > current_max) {
                    current_max = nums[j];
                }
            }
            
            result[i] = current_max;
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find maximum in each sliding window using brute force.
 * 
 * @param {number[]} nums - Array of integers
 * @param {number} k - Window size
 * @return {number[]} - Array of maximum values for each window
 */
var maxSlidingWindow = function(nums, k) {
    if (!nums || nums.length === 0 || k === 0) {
        return [];
    }
    
    const n = nums.length;
    const result = [];
    
    // Process each window
    for (let i = 0; i <= n - k; i++) {
        let current_max = nums[i];
        
        // Find maximum in current window
        for (let j = i; j < i + k; j++) {
            if (nums[j] > current_max) {
                current_max = nums[j];
            }
        }
        
        result.push(current_max);
    }
    
    return result;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n*k) - Each of n-k+1 windows scans k elements |
| **Space** | O(1) - Only using constant extra space |

---

## Approach 2: Monotonic Deque (Optimal)

This approach uses a deque to maintain elements in decreasing order. The front of the deque always contains the maximum of the current window.

#### Algorithm Steps

1. Create an empty deque to store indices (not values)
2. Iterate through each element in the array with index `i`:
   - **Remove smaller elements**: While deque is not empty and `nums[deque.back] <= nums[i]`, remove from back
   - **Remove out-of-window elements**: While deque is not empty and `deque.front <= i - k`, remove from front
   - **Add current index**: Push `i` to the back of deque
   - **Record maximum**: If `i >= k - 1`, add `nums[deque.front]` to result
3. Return result

#### Code Implementation

````carousel
```python
from collections import deque
from typing import List

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        """
        Find maximum in each sliding window using a monotonic deque.
        
        Args:
            nums: List of integers
            k: Window size
            
        Returns:
            List of maximum values for each window
        """
        if not nums or k == 0:
            return []
        
        # Deque stores indices in decreasing order of values
        dq = deque()
        result = []
        
        for i, num in enumerate(nums):
            # Remove indices of elements smaller than current
            while dq and nums[dq[-1]] <= num:
                dq.pop()
            
            # Remove indices that are out of current window
            while dq and dq[0] <= i - k:
                dq.popleft()
            
            # Add current index
            dq.append(i)
            
            # Start recording results when we have k elements
            if i >= k - 1:
                result.append(nums[dq[0]])
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        /**
         * Find maximum in each sliding window using a monotonic deque.
         * 
         * Args:
         *     nums: List of integers
         *     k: Window size
         * 
         * Returns:
         *     Vector of maximum values for each window
         */
        if (nums.empty() || k == 0) {
            return {};
        }
        
        deque<int> dq;  // Store indices
        vector<int> result;
        
        for (int i = 0; i < nums.size(); i++) {
            // Remove indices of elements smaller than current
            while (!dq.empty() && nums[dq.back()] <= nums[i]) {
                dq.pop_back();
            }
            
            // Remove indices that are out of current window
            while (!dq.empty() && dq.front() <= i - k) {
                dq.pop_front();
            }
            
            // Add current index
            dq.push_back(i);
            
            // Start recording results when we have k elements
            if (i >= k - 1) {
                result.push_back(nums[dq.front()]);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.Deque;
import java.util.ArrayDeque;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        /**
         * Find maximum in each sliding window using a monotonic deque.
         * 
         * Args:
         *     nums: Array of integers
         *     k: Window size
         * 
         * Returns:
         *     Array of maximum values for each window
         */
        if (nums == null || nums.length == 0 || k == 0) {
            return new int[0];
        }
        
        Deque<Integer> dq = new ArrayDeque<>();  // Store indices
        int[] result = new int[nums.length - k + 1];
        int resultIndex = 0;
        
        for (int i = 0; i < nums.length; i++) {
            // Remove indices of elements smaller than current
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) {
                dq.pollLast();
            }
            
            // Remove indices that are out of current window
            while (!dq.isEmpty() && dq.peekFirst() <= i - k) {
                dq.pollFirst();
            }
            
            // Add current index
            dq.offerLast(i);
            
            // Start recording results when we have k elements
            if (i >= k - 1) {
                result[resultIndex++] = nums[dq.peekFirst()];
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find maximum in each sliding window using a monotonic deque.
 * 
 * @param {number[]} nums - Array of integers
 * @param {number} k - Window size
 * @return {number[]} - Array of maximum values for each window
 */
var maxSlidingWindow = function(nums, k) {
    if (!nums || nums.length === 0 || k === 0) {
        return [];
    }
    
    const dq = [];  // Store indices
    const result = [];
    
    for (let i = 0; i < nums.length; i++) {
        // Remove indices of elements smaller than current
        while (dq.length > 0 && nums[dq[dq.length - 1]] <= nums[i]) {
            dq.pop();
        }
        
        // Remove indices that are out of current window
        while (dq.length > 0 && dq[0] <= i - k) {
            dq.shift();
        }
        
        // Add current index
        dq.push(i);
        
        // Start recording results when we have k elements
        if (i >= k - 1) {
            result.push(nums[dq[0]]);
        }
    }
    
    return result;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is added and removed at most once |
| **Space** | O(k) - Deque stores at most k elements |

---

## Approach 3: Max Heap (Priority Queue)

This approach uses a max heap to track the maximum element in each window. We need to handle stale elements that have left the window.

#### Algorithm Steps

1. Create a max heap (priority queue) that stores pairs of (value, index)
2. Iterate through each element:
   - Add (value, index) to the heap
   - Remove elements from heap top if their index is outside the current window
   - Record the heap top (maximum) once we have k elements
3. Return result

#### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        """
        Find maximum in each sliding window using a max heap.
        
        Args:
            nums: List of integers
            k: Window size
            
        Returns:
            List of maximum values for each window
        """
        if not nums or k == 0:
            return []
        
        # Python has min-heap, so we negate values for max-heap
        # Store tuples of (-value, index) for max heap behavior
        max_heap = []
        result = []
        
        for i, num in enumerate(nums):
            # Add current element to heap (negate for max heap)
            heapq.heappush(max_heap, (-num, i))
            
            # Remove elements outside current window
            while max_heap and max_heap[0][1] <= i - k:
                heapq.heappop(max_heap)
            
            # Start recording results when we have k elements
            if i >= k - 1:
                result.append(-max_heap[0][0])
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        /**
         * Find maximum in each sliding window using a max heap.
         * 
         * Args:
         *     nums: List of integers
         *     k: Window size
         * 
         * Returns:
         *     Vector of maximum values for each window
         */
        if (nums.empty() || k == 0) {
            return {};
        }
        
        // Max heap using custom comparator
        priority_queue<pair<int, int>> max_heap;
        vector<int> result;
        
        for (int i = 0; i < nums.size(); i++) {
            // Add current element to heap
            max_heap.push({nums[i], i});
            
            // Remove elements outside current window
            while (!max_heap.empty() && max_heap.top().second <= i - k) {
                max_heap.pop();
            }
            
            // Start recording results when we have k elements
            if (i >= k - 1) {
                result.push_back(max_heap.top().first);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.PriorityQueue;
import java.util.Comparator;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        /**
         * Find maximum in each sliding window using a max heap.
         * 
         * Args:
         *     nums: Array of integers
         *     k: Window size
         * 
         * Returns:
         *     Array of maximum values for each window
         */
        if (nums == null || nums.length == 0 || k == 0) {
            return new int[0];
        }
        
        // Max heap using Comparator
        PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
            new Comparator<int[]>() {
                @Override
                public int compare(int[] a, int[] b) {
                    return Integer.compare(b[0], a[0]);  // Descending order
                }
            }
        );
        
        int[] result = new int[nums.length - k + 1];
        int resultIndex = 0;
        
        for (int i = 0; i < nums.length; i++) {
            // Add current element to heap
            maxHeap.offer(new int[] {nums[i], i});
            
            // Remove elements outside current window
            while (!maxHeap.isEmpty() && maxHeap.peek()[1] <= i - k) {
                maxHeap.poll();
            }
            
            // Start recording results when we have k elements
            if (i >= k - 1) {
                result[resultIndex++] = maxHeap.peek()[0];
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find maximum in each sliding window using a max heap.
 * 
 * @param {number[]} nums - Array of integers
 * @param {number} k - Window size
 * @return {number[]} - Array of maximum values for each window
 */
var maxSlidingWindow = function(nums, k) {
    if (!nums || nums.length === 0 || k === 0) {
        return [];
    }
    
    // Max heap using custom comparator
    const maxHeap = new MaxHeap((a, b) => a.value - b.value);
    const result = [];
    
    for (let i = 0; i < nums.length; i++) {
        // Add current element to heap
        maxHeap.insert({ value: nums[i], index: i });
        
        // Remove elements outside current window
        while (maxHeap.peek() && maxHeap.peek().index <= i - k) {
            maxHeap.extract();
        }
        
        // Start recording results when we have k elements
        if (i >= k - 1) {
            result.push(maxHeap.peek().value);
        }
    }
    
    return result;
};

// Simple Max Heap implementation for JavaScript
class MaxHeap {
    constructor(comparator) {
        this.heap = [];
        this.comparator = comparator;
    }
    
    insert(value) {
        this.heap.push(value);
        this.bubbleUp(this.heap.length - 1);
    }
    
    peek() {
        return this.heap[0] || null;
    }
    
    extract() {
        if (this.heap.length === 0) return null;
        const max = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.bubbleDown(0);
        }
        return max;
    }
    
    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.comparator(this.heap[parentIndex], this.heap[index]) >= 0) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }
    
    bubbleDown(index) {
        const length = this.heap.length;
        while (true) {
            let leftChild = 2 * index + 1;
            let rightChild = 2 * index + 2;
            let swapIndex = null;
            
            if (leftChild < length && this.comparator(this.heap[leftChild], this.heap[index]) > 0) {
                swapIndex = leftChild;
            }
            if (rightChild < length && this.comparator(this.heap[rightChild], this.heap[index]) > 0) {
                if (swapIndex === null || this.comparator(this.heap[rightChild], this.heap[swapIndex]) > 0) {
                    swapIndex = rightChild;
                }
            }
            if (swapIndex === null) break;
            [this.heap[index], this.heap[swapIndex]] = [this.heap[swapIndex], this.heap[index]];
            index = swapIndex;
        }
    }
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log k) - Each element is pushed and popped at most once |
| **Space** | O(k) - Heap stores at most k elements |

---

## Comparison of Approaches

| Aspect | Brute Force | Monotonic Deque | Max Heap |
|--------|-------------|-----------------|----------|
| **Time Complexity** | O(n*k) | O(n) | O(n log k) |
| **Space Complexity** | O(1) | O(k) | O(k) |
| **Implementation** | Very Simple | Moderate | Moderate |
| **Code Readability** | High | Medium | Medium |
| **Scalability** | Poor for large k | Excellent | Good |
| **Best For** | Learning, small k | Production, all cases | Large k with heap available |

---

## Why Monotonic Deque Approach is Preferred

The monotonic deque approach is the optimal solution because:

1. **Linear Time**: Achieves O(n) time complexity, making it suitable for large inputs
2. **Optimal Performance**: Each element is processed at most twice (once when added, once when removed)
3. **Memory Efficient**: Only stores at most k elements in the deque
4. **Interview Favorite**: Demonstrates understanding of deque operations and sliding window techniques
5. **No Extra Dependencies**: Uses only basic deque operations

---

## Related Problems

Based on similar themes (sliding window, deque, monotonic queue):

- **[Minimum of All Subarrays of Size K](https://www.geeksforgeeks.org/problems/minimum-of-all-subarrays-of-size-k/1)** - Find minimum instead of maximum
- **[Sliding Window Median](https://leetcode.com/problems/sliding-window-median/)** - Find median in sliding window
- **[Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums/)** - Sum of minimums of all subarrays
- **[Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)** - Find days until warmer temperature
- **[Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)** - Find next greater element
- **[Jump Game VI](https://leetcode.com/problems/jump-game-vi/)** - Maximum sum with sliding window DP
- **[Maximum of Minimum for Every Window Size](https://www.geeksforgeeks.org/problems/maximum-of-minimum-for-every-window-size/1)** - Find minimums and their positions

---

## Pattern Documentation

For a comprehensive guide on the **Monotonic Queue** pattern, including detailed explanations, multiple approaches, and templates in Python, C++, Java, and JavaScript, see:

- **[Monotonic Queue Pattern](../patterns/sliding-window-monotonic-queue-for-max-min.md)** - Complete pattern documentation

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining the problem and solutions:

- [Sliding Window Maximum - LeetCode 239 - Complete Explanation](https://www.youtube.com/watch?v=DfljaUwGsb8) - Comprehensive explanation with monotonic deque
- [Monotonic Queue Pattern](https://www.youtube.com/watch?v=mG8kB3zC7dM) - Detailed monotonic queue tutorial
- [Sliding Window Maximum Solution](https://www.youtube.com/watch?v=Ci39TXc8x4s) - Step-by-step deque implementation
- [Max Heap Approach](https://www.youtube.com/watch?v=1_2O3q6g2iA) - Priority queue solution
- [Sliding Window Problems Overview](https://www.youtube.com/watch?v=MK-NZN4d9yI) - Collection of sliding window techniques

---

## Followup Questions

### Q1: How would you modify the solution to find the minimum instead of maximum?

**Answer:** Change the comparison from `<=` to `>=` when removing elements from the deque. This creates a monotonic increasing deque where the front always contains the minimum. Alternatively, negate all values and use the same maximum algorithm.

---

### Q2: What if the window size k is 1?

**Answer:** The solution naturally handles this case. Each window contains only one element, so the maximum is the element itself. The result will be a copy of the input array.

---

### Q3: How would you handle k equals the array length?

**Answer:** When k equals the array length, there's only one window containing all elements. The solution will return an array with one element: the maximum of the entire array.

---

### Q4: Can this problem be solved using a segment tree?

**Answer:** Yes, a segment tree can be used to query the maximum in any range in O(log n) time. Building the tree takes O(n), and each of the n-k+1 queries takes O(log n), resulting in O(n log n) total time. This is less efficient than the monotonic deque approach.

---

### Q5: How would you find both maximum and minimum in each window simultaneously?

**Answer:** You can maintain two deques simultaneously: one monotonic decreasing (for maximum) and one monotonic increasing (for minimum). Both deques are updated in parallel as the window slides, giving you both values in O(n) time.

---

### Q6: What happens with duplicate values in the array?

**Answer:** The solution uses `<=` when removing smaller elements from the back of the deque. This ensures that when duplicate maximum values exist, we keep the leftmost one (which stays in the window longer), ensuring correct behavior.

---

### Q7: How would you modify the solution to return the index of the maximum instead of the value?

**Answer:** Simply return `dq[0]` (the index) instead of `nums[dq[0]]` (the value) when recording results. The deque already stores indices, so this change is straightforward.

---

### Q8: What's the difference between using `<` vs `<=` when removing elements?

**Answer:** Using `<=` removes all elements smaller than or equal to the current element. Using `<` keeps one occurrence of equal elements. For correctness with duplicates, `<=` is preferred to avoid issues when equal elements slide out of the window.

---

### Q9: How would you test this solution?

**Answer:** Test with various cases:
1. Normal case: `[1,3,-1,-3,5,3,6,7], k=3` → `[3,3,5,5,6,7]`
2. Single element: `[1], k=1` → `[1]`
3. Decreasing array: `[9,8,7,6,5,4], k=3` → `[9,8,7,6]`
4. Increasing array: `[1,2,3,4,5,6,7], k=3` → `[3,4,5,6,7]`
5. All equal: `[5,5,5,5], k=2` → `[5,5,5]`
6. Mixed with negatives: `[4,-1,2,1], k=2` → `[4,2,2]`
7. All negatives: `[-2,-1,-3,-4], k=3` → `[-1,-3,-4]`

---

### Q10: Can you implement this with a balanced BST?

**Answer:** Yes, you can use a balanced BST (like TreeMap in Java or SortedDict in Python) to maintain the current window elements. Each insertion and deletion takes O(log k), and finding the maximum takes O(1) (if tracking the largest key) or O(log k) (if searching). Total complexity is O(n log k).

---

### Q11: How does the monotonic deque maintain its properties?

**Answer:** The deque maintains elements in decreasing order through two operations:
1. **Push**: Before adding a new element, remove all elements from the back that are smaller (they can never be maximums in future windows)
2. **Pop front**: Remove elements whose indices are outside the current window (they're no longer valid)
These operations ensure the front is always the maximum of the current window.

---

### Q12: What if we need to find the k-th largest element in each window?

**Answer:** This is a harder problem requiring order statistic trees or specialized data structures like Fenwick trees with coordinate compression. The monotonic deque approach won't work directly. Solutions typically involve maintaining multiple deques or using segment trees.

---

## Summary

The Sliding Window Maximum problem is a classic example of the monotonic queue pattern. Several approaches exist, each with different trade-offs:

**Key Takeaways:**
- Monotonic deque provides optimal O(n) time complexity
- Brute force is O(n*k), suitable only for small windows
- Max heap provides O(n log k) as a good alternative
- The deque maintains elements in decreasing order for O(1) maximum access
- Each element is added and removed at most once in the optimal solution
- The pattern extends to minimums, medians, and other aggregate functions
- Understanding this problem is crucial for solving similar sliding window challenges

This problem demonstrates the power of thoughtful data structure design and is frequently asked in technical interviews at major tech companies.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/sliding-window-maximum/discuss/) - Community solutions and explanations
- [Monotonic Queue Fundamentals](https://www.geeksforgeeks.org/monotonic-queue/) - Monotonic queue concepts
- [Deque Data Structure](https://docs.python.org/3/library/collections.html#collections.deque) - Python deque documentation
- [C++ deque](https://en.cppreference.com/w/cpp/container/deque) - C++ deque reference
- [Java ArrayDeque](https://docs.oracle.com/javase/8/docs/api/java/util/ArrayDeque.html) - Java ArrayDeque API
- [Priority Queue in Java](https://docs.oracle.com/javase/8/docs/api/java/util/PriorityQueue.html) - Java PriorityQueue documentation
