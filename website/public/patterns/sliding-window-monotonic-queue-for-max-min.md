# Sliding Window - Monotonic Queue for Max/Min

## Overview

The Monotonic Queue pattern for sliding windows efficiently finds the maximum or minimum element in each sliding window in **O(n)** time complexity. This is achieved using a deque (double-ended queue) that maintains elements in monotonic order, allowing constant-time access to the current window's max/min.

This pattern is essential for solving problems that require tracking extreme values in a dynamic window where elements enter and exit continuously.

---

## Problem Statement

Given an array `arr` of length `n` and a window size `k`, find the maximum (or minimum) element in each contiguous subarray of size `k` as the window slides from left to right.

### Input Format

- `arr`: An array of integers (or comparable elements)
- `k`: The fixed window size (positive integer)

### Output Format

An array of length `n-k+1` containing the maximum (or minimum) value for each window position.

### Constraints

- `1 ≤ len(arr) ≤ 10^5` (typical upper bound)
- `1 ≤ k ≤ len(arr)`
- `−10^9 ≤ arr[i] ≤ 10^9` (consider negative numbers)
- Time complexity target: **O(n)**
- Space complexity target: **O(k)** or **O(1)** extra

---

## Examples

### Example 1: Maximum in Sliding Window

**Input:**
```
arr = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
```

**Output:**
```
[3, 3, 5, 5, 6, 7]
```

**Explanation:**
- Window [1, 3, -1] → max = 3
- Window [3, -1, -3] → max = 3
- Window [-1, -3, 5] → max = 5
- Window [-3, 5, 3] → max = 5
- Window [5, 3, 6] → max = 6
- Window [3, 6, 7] → max = 7

---

### Example 2: Minimum in Sliding Window

**Input:**
```
arr = [2, 1, 5, 0, 4, 3], k = 3
```

**Output:**
```
[1, 0, 0, 0, 3]
```

**Explanation:**
- Window [2, 1, 5] → min = 1
- Window [1, 5, 0] → min = 0
- Window [5, 0, 4] → min = 0
- Window [0, 4, 3] → min = 0
- Window [4, 3] → min = 3 (not enough elements for full window)

---

### Example 3: Edge Cases

**Single Element:**
```
arr = [5], k = 1
```
Output: `[5]`

**All Same Elements:**
```
arr = [7, 7, 7, 7], k = 2
```
Output: `[7, 7, 7]`

**Decreasing Order:**
```
arr = [9, 8, 7, 6, 5], k = 3
```
Output: `[9, 8, 7]`

---

## Intuition

The key insight behind the monotonic queue pattern is **maintaining order** within the sliding window to enable constant-time access to extrema.

### Why It Works

Consider finding the maximum in each window of size `k`:

**Naive Approach (O(n×k)):**
```python
for i in range(n - k + 1):
    max_val = max(arr[i:i+k])  # O(k) each time
```

**Monotonic Queue Approach (O(n)):**
- The deque maintains indices in **decreasing order** of their values
- The front of the deque is always the maximum of the current window
- Each element is pushed and popped at most once

### Key Observations

1. **Monotonic Property**: Elements in the deque are always in decreasing (for max) or increasing (for min) order
2. **Out-of-Window Removal**: Indices outside the current window are removed from the front
3. **Worse Elements Removal**: Elements that are smaller (for max) or larger (for min) than the current element are removed from the back
4. **Front Always Optimal**: The front of the deque contains the index of the maximum/minimum

---

## Multiple Approaches with Code

We'll cover three main approaches for finding max/min in sliding windows:

1. **Monotonic Decreasing Queue** - For maximum in each window
2. **Monotonic Increasing Queue** - For minimum in each window
3. **Combined Max-Min Solution** - For problems requiring both

---

### Approach 1: Monotonic Decreasing Queue (Maximum)

This approach maintains a deque where elements are stored in decreasing order. The front always contains the maximum.

#### Algorithm Steps

1. Initialize an empty deque to store indices
2. Iterate through each element in the array:
   - Remove indices from the front that are outside the current window
   - Remove indices from the back where the corresponding element is smaller than the current element
   - Add the current element's index to the back
   - Once we've processed at least k elements, the front of the deque is the maximum

#### Code Implementation

````carousel
```python
from collections import deque
from typing import List

class SlidingWindowMax:
    """
    Find maximum in each sliding window using monotonic decreasing deque.
    Time: O(n), Space: O(k)
    """
    
    @staticmethod
    def max_in_window(arr: List[int], k: int) -> List[int]:
        """
        Returns maximum value in each sliding window of size k.
        
        Args:
            arr: Input array of integers
            k: Window size
            
        Returns:
            List of maximum values for each window
        """
        if not arr or k <= 0 or k > len(arr):
            return []
        
        dq = deque()  # Stores indices, values in decreasing order
        result = []
        
        for i in range(len(arr)):
            # Remove indices that are outside the current window
            while dq and dq[0] <= i - k:
                dq.popleft()
            
            # Remove indices of elements smaller than current
            # This maintains decreasing order
            while dq and arr[dq[-1]] < arr[i]:
                dq.pop()
            
            # Add current element index
            dq.append(i)
            
            # Once we have processed k elements, record the max
            if i >= k - 1:
                result.append(arr[dq[0]])
        
        return result
    
    @staticmethod
    def max_in_window_with_indices(arr: List[int], k: int) -> List[tuple]:
        """
        Returns maximum values along with their indices.
        
        Args:
            arr: Input array of integers
            k: Window size
            
        Returns:
            List of (max_value, index) tuples for each window
        """
        if not arr or k <= 0 or k > len(arr):
            return []
        
        dq = deque()
        result = []
        
        for i in range(len(arr)):
            while dq and dq[0] <= i - k:
                dq.popleft()
            
            while dq and arr[dq[-1]] < arr[i]:
                dq.pop()
            
            dq.append(i)
            
            if i >= k - 1:
                result.append((arr[dq[0]], dq[0]))
        
        return result


# Convenience function
def max_in_sliding_window(arr: List[int], k: int) -> List[int]:
    """Find maximum in each sliding window of size k."""
    return SlidingWindowMax.max_in_window(arr, k)
```

<!-- slide -->
```cpp
#include <vector>
#include <deque>
#include <algorithm>

class SlidingWindowMax {
public:
    /**
     * Find maximum in each sliding window using monotonic decreasing deque.
     * Time: O(n), Space: O(k)
     */
    static std::vector<int> maxInWindow(const std::vector<int>& arr, int k) {
        if (arr.empty() || k <= 0 || k > arr.size()) {
            return {};
        }
        
        std::vector<int> result;
        std::deque<int> dq;  // Stores indices, values in decreasing order
        
        for (int i = 0; i < arr.size(); i++) {
            // Remove indices that are outside the current window
            while (!dq.empty() && dq.front() <= i - k) {
                dq.pop_front();
            }
            
            // Remove indices of elements smaller than current
            while (!dq.empty() && arr[dq.back()] < arr[i]) {
                dq.pop_back();
            }
            
            dq.push_back(i);
            
            // Once we have processed k elements, record the max
            if (i >= k - 1) {
                result.push_back(arr[dq.front()]);
            }
        }
        
        return result;
    }
    
    /**
     * Returns maximum values along with their indices.
     */
    static std::vector<std::pair<int, int>> maxInWindowWithIndices(
        const std::vector<int>& arr, int k) {
        if (arr.empty() || k <= 0 || k > arr.size()) {
            return {};
        }
        
        std::vector<std::pair<int, int>> result;
        std::deque<int> dq;
        
        for (int i = 0; i < arr.size(); i++) {
            while (!dq.empty() && dq.front() <= i - k) {
                dq.pop_front();
            }
            
            while (!dq.empty() && arr[dq.back()] < arr[i]) {
                dq.pop_back();
            }
            
            dq.push_back(i);
            
            if (i >= k - 1) {
                result.emplace_back(arr[dq.front()], dq.front());
            }
        }
        
        return result;
    }
    
    /**
     * Handles duplicates by using <= comparison.
     * Keeps only the most recent index for equal values.
     */
    static std::vector<int> maxInWindowWithDuplicates(
        const std::vector<int>& arr, int k) {
        if (arr.empty() || k <= 0 || k > arr.size()) {
            return {};
        }
        
        std::vector<int> result;
        std::deque<int> dq;
        
        for (int i = 0; i < arr.size(); i++) {
            while (!dq.empty() && dq.front() <= i - k) {
                dq.pop_front();
            }
            
            // Use <= to handle duplicates - keeps only one occurrence
            while (!dq.empty() && arr[dq.back()] <= arr[i]) {
                dq.pop_back();
            }
            
            dq.push_back(i);
            
            if (i >= k - 1) {
                result.push_back(arr[dq.front()]);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.ArrayList;
import java.util.List;

public class SlidingWindowMax {
    
    /**
     * Find maximum in each sliding window using monotonic decreasing deque.
     * Time: O(n), Space: O(k)
     */
    public static List<Integer> maxInWindow(int[] arr, int k) {
        if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) {
            return new ArrayList<>();
        }
        
        List<Integer> result = new ArrayList<>();
        Deque<Integer> dq = new ArrayDeque<>();  // Stores indices, decreasing values
        
        for (int i = 0; i < arr.length; i++) {
            // Remove indices that are outside the current window
            while (!dq.isEmpty() && dq.peekFirst() <= i - k) {
                dq.pollFirst();
            }
            
            // Remove indices of elements smaller than current
            while (!dq.isEmpty() && arr[dq.peekLast()] < arr[i]) {
                dq.pollLast();
            }
            
            dq.addLast(i);
            
            // Once we have processed k elements, record the max
            if (i >= k - 1) {
                result.add(arr[dq.peekFirst()]);
            }
        }
        
        return result;
    }
    
    /**
     * Returns maximum values along with their indices.
     */
    public static List<int[]> maxInWindowWithIndices(int[] arr, int k) {
        if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) {
            return new ArrayList<>();
        }
        
        List<int[]> result = new ArrayList<>();
        Deque<Integer> dq = new ArrayDeque<>();
        
        for (int i = 0; i < arr.length; i++) {
            while (!dq.isEmpty() && dq.peekFirst() <= i - k) {
                dq.pollFirst();
            }
            
            while (!dq.isEmpty() && arr[dq.peekLast()] < arr[i]) {
                dq.pollLast();
            }
            
            dq.addLast(i);
            
            if (i >= k - 1) {
                result.add(new int[]{arr[dq.peekFirst()], dq.peekFirst()});
            }
        }
        
        return result;
    }
    
    /**
     * Handles duplicates by using <= comparison.
     */
    public static List<Integer> maxInWindowWithDuplicates(int[] arr, int k) {
        if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) {
            return new ArrayList<>();
        }
        
        List<Integer> result = new ArrayList<>();
        Deque<Integer> dq = new ArrayDeque<>();
        
        for (int i = 0; i < arr.length; i++) {
            while (!dq.isEmpty() && dq.peekFirst() <= i - k) {
                dq.pollFirst();
            }
            
            while (!dq.isEmpty() && arr[dq.peekLast()] <= arr[i]) {
                dq.pollLast();
            }
            
            dq.addLast(i);
            
            if (i >= k - 1) {
                result.add(arr[dq.peekFirst()]);
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
class SlidingWindowMax {
    
    /**
     * Find maximum in each sliding window using monotonic decreasing deque.
     * Time: O(n), Space: O(k)
     */
    static maxInWindow(arr, k) {
        if (!arr || arr.length === 0 || k <= 0 || k > arr.length) {
            return [];
        }
        
        const result = [];
        const dq = [];  // Stores indices, values in decreasing order
        
        for (let i = 0; i < arr.length; i++) {
            // Remove indices that are outside the current window
            while (dq.length > 0 && dq[0] <= i - k) {
                dq.shift();
            }
            
            // Remove indices of elements smaller than current
            while (dq.length > 0 && arr[dq[dq.length - 1]] < arr[i]) {
                dq.pop();
            }
            
            dq.push(i);
            
            // Once we have processed k elements, record the max
            if (i >= k - 1) {
                result.push(arr[dq[0]]);
            }
        }
        
        return result;
    }
    
    /**
     * Returns maximum values along with their indices.
     */
    static maxInWindowWithIndices(arr, k) {
        if (!arr || arr.length === 0 || k <= 0 || k > arr.length) {
            return [];
        }
        
        const result = [];
        const dq = [];
        
        for (let i = 0; i < arr.length; i++) {
            while (dq.length > 0 && dq[0] <= i - k) {
                dq.shift();
            }
            
            while (dq.length > 0 && arr[dq[dq.length - 1]] < arr[i]) {
                dq.pop();
            }
            
            dq.push(i);
            
            if (i >= k - 1) {
                result.push([arr[dq[0]], dq[0]]);
            }
        }
        
        return result;
    }
    
    /**
     * Handles duplicates by using <= comparison.
     */
    static maxInWindowWithDuplicates(arr, k) {
        if (!arr || arr.length === 0 || k <= 0 || k > arr.length) {
            return [];
        }
        
        const result = [];
        const dq = [];
        
        for (let i = 0; i < arr.length; i++) {
            while (dq.length > 0 && dq[0] <= i - k) {
                dq.shift();
            }
            
            while (dq.length > 0 && arr[dq[dq.length - 1]] <= arr[i]) {
                dq.pop();
            }
            
            dq.push(i);
            
            if (i >= k - 1) {
                result.push(arr[dq[0]]);
            }
        }
        
        return result;
    }
}

// Convenience functions
function maxInSlidingWindow(arr, k) {
    return SlidingWindowMax.maxInWindow(arr, k);
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is pushed and popped at most once |
| **Space** | O(k) - The deque stores at most k elements |

---

### Approach 2: Monotonic Increasing Queue (Minimum)

This approach maintains a deque where elements are stored in increasing order. The front always contains the minimum.

#### Algorithm Steps

1. Initialize an empty deque to store indices
2. Iterate through each element in the array:
   - Remove indices from the front that are outside the current window
   - Remove indices from the back where the corresponding element is larger than the current element
   - Add the current element's index to the back
   - Once we've processed at least k elements, the front of the deque is the minimum

#### Code Implementation

````carousel
```python
from collections import deque
from typing import List

class SlidingWindowMin {
    """
    Find minimum in each sliding window using monotonic increasing deque.
    Time: O(n), Space: O(k)
    """
    
    @staticmethod
    def min_in_window(arr: List[int], k: int) -> List[int]:
        """
        Returns minimum value in each sliding window of size k.
        
        Args:
            arr: Input array of integers
            k: Window size
            
        Returns:
            List of minimum values for each window
        """
        if not arr or k <= 0 or k > len(arr):
            return []
        
        dq = deque()  # Stores indices, values in increasing order
        result = []
        
        for i in range(len(arr)):
            # Remove indices that are outside the current window
            while dq and dq[0] <= i - k:
                dq.popleft()
            
            # Remove indices of elements larger than current
            # This maintains increasing order
            while dq and arr[dq[-1]] > arr[i]:
                dq.pop()
            
            # Add current element index
            dq.append(i)
            
            # Once we have processed k elements, record the min
            if i >= k - 1:
                result.append(arr[dq[0]])
        
        return result
    
    @staticmethod
    def min_in_window_with_indices(arr: List[int], k: int) -> List[tuple]:
        """
        Returns minimum values along with their indices.
        """
        if not arr or k <= 0 or k > len(arr):
            return []
        
        dq = deque()
        result = []
        
        for i in range(len(arr)):
            while dq and dq[0] <= i - k:
                dq.popleft()
            
            while dq and arr[dq[-1]] > arr[i]:
                dq.pop()
            
            dq.append(i)
            
            if i >= k - 1:
                result.append((arr[dq[0]], dq[0]))
        
        return result


# Convenience function
def min_in_sliding_window(arr: List[int], k: int) -> List[int]:
    """Find minimum in each sliding window of size k."""
    return SlidingWindowMin.min_in_window(arr, k)
```

<!-- slide -->
```cpp
#include <vector>
#include <deque>
#include <algorithm>

class SlidingWindowMin {
public:
    /**
     * Find minimum in each sliding window using monotonic increasing deque.
     * Time: O(n), Space: O(k)
     */
    static std::vector<int> minInWindow(const std::vector<int>& arr, int k) {
        if (arr.empty() || k <= 0 || k > arr.size()) {
            return {};
        }
        
        std::vector<int> result;
        std::deque<int> dq;  // Stores indices, values in increasing order
        
        for (int i = 0; i < arr.size(); i++) {
            // Remove indices that are outside the current window
            while (!dq.empty() && dq.front() <= i - k) {
                dq.pop_front();
            }
            
            // Remove indices of elements larger than current
            while (!dq.empty() && arr[dq.back()] > arr[i]) {
                dq.pop_back();
            }
            
            dq.push_back(i);
            
            // Once we have processed k elements, record the min
            if (i >= k - 1) {
                result.push_back(arr[dq.front()]);
            }
        }
        
        return result;
    }
    
    /**
     * Returns minimum values along with their indices.
     */
    static std::vector<std::pair<int, int>> minInWindowWithIndices(
        const std::vector<int>& arr, int k) {
        if (arr.empty() || k <= 0 || k > arr.size()) {
            return {};
        }
        
        std::vector<std::pair<int, int>> result;
        std::deque<int> dq;
        
        for (int i = 0; i < arr.size(); i++) {
            while (!dq.empty() && dq.front() <= i - k) {
                dq.pop_front();
            }
            
            while (!dq.empty() && arr[dq.back()] > arr[i]) {
                dq.pop_back();
            }
            
            dq.push_back(i);
            
            if (i >= k - 1) {
                result.emplace_back(arr[dq.front()], dq.front());
            }
        }
        
        return result;
    }
    
    /**
     * Handles duplicates by using >= comparison.
     */
    static std::vector<int> minInWindowWithDuplicates(
        const std::vector<int>& arr, int k) {
        if (arr.empty() || k <= 0 || k > arr.size()) {
            return {};
        }
        
        std::vector<int> result;
        std::deque<int> dq;
        
        for (int i = 0; i < arr.size(); i++) {
            while (!dq.empty() && dq.front() <= i - k) {
                dq.pop_front();
            }
            
            while (!dq.empty() && arr[dq.back()] >= arr[i]) {
                dq.pop_back();
            }
            
            dq.push_back(i);
            
            if (i >= k - 1) {
                result.push_back(arr[dq.front()]);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.ArrayList;
import java.util.List;

public class SlidingWindowMin {
    
    /**
     * Find minimum in each sliding window using monotonic increasing deque.
     * Time: O(n), Space: O(k)
     */
    public static List<Integer> minInWindow(int[] arr, int k) {
        if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) {
            return new ArrayList<>();
        }
        
        List<Integer> result = new ArrayList<>();
        Deque<Integer> dq = new ArrayDeque<>();  // Stores indices, increasing values
        
        for (int i = 0; i < arr.length; i++) {
            // Remove indices that are outside the current window
            while (!dq.isEmpty() && dq.peekFirst() <= i - k) {
                dq.pollFirst();
            }
            
            // Remove indices of elements larger than current
            while (!dq.isEmpty() && arr[dq.peekLast()] > arr[i]) {
                dq.pollLast();
            }
            
            dq.addLast(i);
            
            // Once we have processed k elements, record the min
            if (i >= k - 1) {
                result.add(arr[dq.peekFirst()]);
            }
        }
        
        return result;
    }
    
    /**
     * Returns minimum values along with their indices.
     */
    public static List<int[]> minInWindowWithIndices(int[] arr, int k) {
        if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) {
            return new ArrayList<>();
        }
        
        List<int[]> result = new ArrayList<>();
        Deque<Integer> dq = new ArrayDeque<>();
        
        for (int i = 0; i < arr.length; i++) {
            while (!dq.isEmpty() && dq.peekFirst() <= i - k) {
                dq.pollFirst();
            }
            
            while (!dq.isEmpty() && arr[dq.peekLast()] > arr[i]) {
                dq.pollLast();
            }
            
            dq.addLast(i);
            
            if (i >= k - 1) {
                result.add(new int[]{arr[dq.peekFirst()], dq.peekFirst()});
            }
        }
        
        return result;
    }
    
    /**
     * Handles duplicates by using >= comparison.
     */
    public static List<Integer> minInWindowWithDuplicates(int[] arr, int k) {
        if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) {
            return new ArrayList<>();
        }
        
        List<Integer> result = new ArrayList<>();
        Deque<Integer> dq = new ArrayDeque<>();
        
        for (int i = 0; i < arr.length; i++) {
            while (!dq.isEmpty() && dq.peekFirst() <= i - k) {
                dq.pollFirst();
            }
            
            while (!dq.isEmpty() && arr[dq.peekLast()] >= arr[i]) {
                dq.pollLast();
            }
            
            dq.addLast(i);
            
            if (i >= k - 1) {
                result.add(arr[dq.peekFirst()]);
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
class SlidingWindowMin {
    
    /**
     * Find minimum in each sliding window using monotonic increasing deque.
     * Time: O(n), Space: O(k)
     */
    static minInWindow(arr, k) {
        if (!arr || arr.length === 0 || k <= 0 || k > arr.length) {
            return [];
        }
        
        const result = [];
        const dq = [];  // Stores indices, values in increasing order
        
        for (let i = 0; i < arr.length; i++) {
            // Remove indices that are outside the current window
            while (dq.length > 0 && dq[0] <= i - k) {
                dq.shift();
            }
            
            // Remove indices of elements larger than current
            while (dq.length > 0 && arr[dq[dq.length - 1]] > arr[i]) {
                dq.pop();
            }
            
            dq.push(i);
            
            // Once we have processed k elements, record the min
            if (i >= k - 1) {
                result.push(arr[dq[0]]);
            }
        }
        
        return result;
    }
    
    /**
     * Returns minimum values along with their indices.
     */
    static minInWindowWithIndices(arr, k) {
        if (!arr || arr.length === 0 || k <= 0 || k > arr.length) {
            return [];
        }
        
        const result = [];
        const dq = [];
        
        for (let i = 0; i < arr.length; i++) {
            while (dq.length > 0 && dq[0] <= i - k) {
                dq.shift();
            }
            
            while (dq.length > 0 && arr[dq[dq.length - 1]] > arr[i]) {
                dq.pop();
            }
            
            dq.push(i);
            
            if (i >= k - 1) {
                result.push([arr[dq[0]], dq[0]]);
            }
        }
        
        return result;
    }
    
    /**
     * Handles duplicates by using >= comparison.
     */
    static minInWindowWithDuplicates(arr, k) {
        if (!arr || arr.length === 0 || k <= 0 || k > arr.length) {
            return [];
        }
        
        const result = [];
        const dq = [];
        
        for (let i = 0; i < arr.length; i++) {
            while (dq.length > 0 && dq[0] <= i - k) {
                dq.shift();
            }
            
            while (dq.length > 0 && arr[dq[dq.length - 1]] >= arr[i]) {
                dq.pop();
            }
            
            dq.push(i);
            
            if (i >= k - 1) {
                result.push(arr[dq[0]]);
            }
        }
        
        return result;
    }
}

// Convenience functions
function minInSlidingWindow(arr, k) {
    return SlidingWindowMin.minInWindow(arr, k);
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is pushed and popped at most once |
| **Space** | O(k) - The deque stores at most k elements |

---

### Approach 3: Combined Max-Min in Single Pass

For problems requiring both maximum and minimum in each window, we can maintain both deques simultaneously.

#### Code Implementation

````carousel
```python
from collections import deque
from typing import List, Tuple

class SlidingWindowMaxMin {
    """
    Find both maximum and minimum in each sliding window in a single pass.
    Time: O(n), Space: O(k)
    """
    
    @staticmethod
    def max_and_min(arr: List[int], k: int) -> Tuple[List[int], List[int]]:
        """
        Returns both maximum and minimum values for each sliding window.
        
        Args:
            arr: Input array of integers
            k: Window size
            
        Returns:
            Tuple of (max_list, min_list)
        """
        if not arr or k <= 0 or k > len(arr):
            return [], []
        
        max_dq = deque()  # For maximums (decreasing order)
        min_dq = deque()  # For minimums (increasing order)
        max_result = []
        min_result = []
        
        for i in range(len(arr)):
            # Handle max deque
            while max_dq and max_dq[0] <= i - k:
                max_dq.popleft()
            while max_dq and arr[max_dq[-1]] < arr[i]:
                max_dq.pop()
            max_dq.append(i)
            
            # Handle min deque
            while min_dq and min_dq[0] <= i - k:
                min_dq.popleft()
            while min_dq and arr[min_dq[-1]] > arr[i]:
                min_dq.pop()
            min_dq.append(i)
            
            # Record results once we have k elements
            if i >= k - 1:
                max_result.append(arr[max_dq[0]])
                min_result.append(arr[min_dq[0]])
        
        return max_result, min_result
    
    @staticmethod
    def max_min_range(arr: List[int], k: int) -> List[int]:
        """
        Returns the difference (range) between max and min for each window.
        Useful for problems asking for max - min in each window.
        """
        if not arr or k <= 0 or k > len(arr):
            return []
        
        max_dq = deque()
        min_dq = deque()
        result = []
        
        for i in range(len(arr)):
            # Handle max deque
            while max_dq and max_dq[0] <= i - k:
                max_dq.popleft()
            while max_dq and arr[max_dq[-1]] < arr[i]:
                max_dq.pop()
            max_dq.append(i)
            
            # Handle min deque
            while min_dq and min_dq[0] <= i - k:
                min_dq.popleft()
            while min_dq and arr[min_dq[-1]] > arr[i]:
                min_dq.pop()
            min_dq.append(i)
            
            if i >= k - 1:
                result.append(arr[max_dq[0]] - arr[min_dq[0]])
        
        return result


def max_and_min_in_window(arr: List[int], k: int) -> Tuple[List[int], List[int]]:
    """Convenience function to get both max and min."""
    return SlidingWindowMaxMin.max_and_min(arr, k)
```

<!-- slide -->
```cpp
#include <vector>
#include <deque>
#include <utility>

class SlidingWindowMaxMin {
public:
    /**
     * Find both maximum and minimum in each sliding window in a single pass.
     * Time: O(n), Space: O(k)
     */
    static std::pair<std::vector<int>, std::vector<int>> maxAndMin(
        const std::vector<int>& arr, int k) {
        if (arr.empty() || k <= 0 || k > arr.size()) {
            return {{}, {}};
        }
        
        std::deque<int> max_dq;  // For maximums (decreasing order)
        std::deque<int> min_dq;  // For minimums (increasing order)
        std::vector<int> max_result;
        std::vector<int> min_result;
        
        for (int i = 0; i < arr.size(); i++) {
            // Handle max deque
            while (!max_dq.empty() && max_dq.front() <= i - k) {
                max_dq.pop_front();
            }
            while (!max_dq.empty() && arr[max_dq.back()] < arr[i]) {
                max_dq.pop_back();
            }
            max_dq.push_back(i);
            
            // Handle min deque
            while (!min_dq.empty() && min_dq.front() <= i - k) {
                min_dq.pop_front();
            }
            while (!min_dq.empty() && arr[min_dq.back()] > arr[i]) {
                min_dq.pop_back();
            }
            min_dq.push_back(i);
            
            // Record results once we have k elements
            if (i >= k - 1) {
                max_result.push_back(arr[max_dq.front()]);
                min_result.push_back(arr[min_dq.front()]);
            }
        }
        
        return {max_result, min_result};
    }
    
    /**
     * Returns the difference (range) between max and min for each window.
     */
    static std::vector<int> maxMinRange(const std::vector<int>& arr, int k) {
        if (arr.empty() || k <= 0 || k > arr.size()) {
            return {};
        }
        
        std::deque<int> max_dq;
        std::deque<int> min_dq;
        std::vector<int> result;
        
        for (int i = 0; i < arr.size(); i++) {
            while (!max_dq.empty() && max_dq.front() <= i - k) {
                max_dq.pop_front();
            }
            while (!max_dq.empty() && arr[max_dq.back()] < arr[i]) {
                max_dq.pop_back();
            }
            max_dq.push_back(i);
            
            while (!min_dq.empty() && min_dq.front() <= i - k) {
                min_dq.pop_front();
            }
            while (!min_dq.empty() && arr[min_dq.back()] > arr[i]) {
                min_dq.pop_back();
            }
            min_dq.push_back(i);
            
            if (i >= k - 1) {
                result.push_back(arr[max_dq.front()] - arr[min_dq.front()]);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.ArrayList;
import java.util.List;

public class SlidingWindowMaxMin {
    
    /**
     * Find both maximum and minimum in each sliding window in a single pass.
     * Time: O(n), Space: O(k)
     */
    public static List<int[]> maxAndMin(int[] arr, int k) {
        if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) {
            return new ArrayList<>();
        }
        
        Deque<Integer> maxDq = new ArrayDeque<>();  // For maximums (decreasing)
        Deque<Integer> minDq = new ArrayDeque<>();  // For minimums (increasing)
        List<int[]> result = new ArrayList<>();
        
        for (int i = 0; i < arr.length; i++) {
            // Handle max deque
            while (!maxDq.isEmpty() && maxDq.peekFirst() <= i - k) {
                maxDq.pollFirst();
            }
            while (!maxDq.isEmpty() && arr[maxDq.peekLast()] < arr[i]) {
                maxDq.pollLast();
            }
            maxDq.addLast(i);
            
            // Handle min deque
            while (!minDq.isEmpty() && minDq.peekFirst() <= i - k) {
                minDq.pollFirst();
            }
            while (!minDq.isEmpty() && arr[minDq.peekLast()] > arr[i]) {
                minDq.pollLast();
            }
            minDq.addLast(i);
            
            // Record results once we have k elements
            if (i >= k - 1) {
                result.add(new int[]{arr[maxDq.peekFirst()], arr[minDq.peekFirst()]});
            }
        }
        
        return result;
    }
    
    /**
     * Returns the difference (range) between max and min for each window.
     */
    public static List<Integer> maxMinRange(int[] arr, int k) {
        if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) {
            return new ArrayList<>();
        }
        
        Deque<Integer> maxDq = new ArrayDeque<>();
        Deque<Integer> minDq = new ArrayDeque<>();
        List<Integer> result = new ArrayList<>();
        
        for (int i = 0; i < arr.length; i++) {
            while (!maxDq.isEmpty() && maxDq.peekFirst() <= i - k) {
                maxDq.pollFirst();
            }
            while (!maxDq.isEmpty() && arr[maxDq.peekLast()] < arr[i]) {
                maxDq.pollLast();
            }
            maxDq.addLast(i);
            
            while (!minDq.isEmpty() && minDq.peekFirst() <= i - k) {
                minDq.pollFirst();
            }
            while (!minDq.isEmpty() && arr[minDq.peekLast()] > arr[i]) {
                minDq.pollLast();
            }
            minDq.addLast(i);
            
            if (i >= k - 1) {
                result.add(arr[maxDq.peekFirst()] - arr[minDq.peekFirst()]);
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
class SlidingWindowMaxMin {
    
    /**
     * Find both maximum and minimum in each sliding window in a single pass.
     * Time: O(n), Space: O(k)
     */
    static maxAndMin(arr, k) {
        if (!arr || arr.length === 0 || k <= 0 || k > arr.length) {
            return [];
        }
        
        const maxDq = [];  // For maximums (decreasing order)
        const minDq = [];  // For minimums (increasing order)
        const result = [];
        
        for (let i = 0; i < arr.length; i++) {
            // Handle max deque
            while (maxDq.length > 0 && maxDq[0] <= i - k) {
                maxDq.shift();
            }
            while (maxDq.length > 0 && arr[maxDq[maxDq.length - 1]] < arr[i]) {
                maxDq.pop();
            }
            maxDq.push(i);
            
            // Handle min deque
            while (minDq.length > 0 && minDq[0] <= i - k) {
                minDq.shift();
            }
            while (minDq.length > 0 && arr[minDq[minDq.length - 1]] > arr[i]) {
                minDq.pop();
            }
            minDq.push(i);
            
            // Record results once we have k elements
            if (i >= k - 1) {
                result.push([arr[maxDq[0]], arr[minDq[0]]]);
            }
        }
        
        return result;
    }
    
    /**
     * Returns the difference (range) between max and min for each window.
     */
    static maxMinRange(arr, k) {
        if (!arr || arr.length === 0 || k <= 0 || k > arr.length) {
            return [];
        }
        
        const maxDq = [];
        const minDq = [];
        const result = [];
        
        for (let i = 0; i < arr.length; i++) {
            while (maxDq.length > 0 && maxDq[0] <= i - k) {
                maxDq.shift();
            }
            while (maxDq.length > 0 && arr[maxDq[maxDq.length - 1]] < arr[i]) {
                maxDq.pop();
            }
            maxDq.push(i);
            
            while (minDq.length > 0 && minDq[0] <= i - k) {
                minDq.shift();
            }
            while (minDq.length > 0 && arr[minDq[minDq.length - 1]] > arr[i]) {
                minDq.pop();
            }
            minDq.push(i);
            
            if (i >= k - 1) {
                result.push(arr[maxDq[0]] - arr[minDq[0]]);
            }
        }
        
        return result;
    }
}

// Convenience functions
function maxAndMinInWindow(arr, k) {
    return SlidingWindowMaxMin.maxAndMin(arr, k);
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is processed once for each deque |
| **Space** | O(k) - Each deque stores at most k elements |

---

## Comparison of Approaches

| Aspect | Max Only | Min Only | Combined |
|--------|----------|----------|----------|
| **Use Case** | Need maximum | Need minimum | Need both |
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(k) | O(k) | O(k) |
| **Implementation** | Simple | Simple | Moderate |
| **Deques Needed** | 1 | 1 | 2 |

---

## General Code Templates

### Template 1: Maximum in Sliding Window

````carousel
```python
from collections import deque
from typing import List

def max_in_window(arr: List[int], k: int) -> List[int]:
    """Find maximum in each sliding window of size k."""
    if not arr or k <= 0 or k > len(arr):
        return []
    
    dq = deque()  # Stores indices in decreasing order
    result = []
    
    for i in range(len(arr)):
        # Remove out-of-window indices
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Remove smaller elements
        while dq and arr[dq[-1]] < arr[i]:
            dq.pop()
        
        dq.append(i)
        
        if i >= k - 1:
            result.append(arr[dq[0]])
    
    return result
```

<!-- slide -->
```cpp
#include <vector>
#include <deque>
using namespace std;

vector<int> maxInWindow(const vector<int>& arr, int k) {
    if (arr.empty() || k <= 0 || k > arr.size()) return {};
    
    deque<int> dq;
    vector<int> result;
    
    for (int i = 0; i < arr.size(); i++) {
        while (!dq.empty() && dq.front() <= i - k)
            dq.pop_front();
        
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
import java.util.*;

public List<Integer> maxInWindow(int[] arr, int k) {
    if (arr == null || arr.length == 0) return new ArrayList<>();
    
    Deque<Integer> dq = new ArrayDeque<>();
    List<Integer> result = new ArrayList<>();
    
    for (int i = 0; i < arr.length; i++) {
        while (!dq.isEmpty() && dq.peekFirst() <= i - k)
            dq.pollFirst();
        
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
    if (!arr || arr.length === 0) return [];
    
    const dq = [];
    const result = [];
    
    for (let i = 0; i < arr.length; i++) {
        while (dq.length > 0 && dq[0] <= i - k)
            dq.shift();
        
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

### Template 2: Minimum in Sliding Window

````carousel
```python
from collections import deque
from typing import List

def min_in_window(arr: List[int], k: int) -> List[int]:
    """Find minimum in each sliding window of size k."""
    if not arr or k <= 0 or k > len(arr):
        return []
    
    dq = deque()  # Stores indices in increasing order
    result = []
    
    for i in range(len(arr)):
        # Remove out-of-window indices
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Remove larger elements
        while dq and arr[dq[-1]] > arr[i]:
            dq.pop()
        
        dq.append(i)
        
        if i >= k - 1:
            result.append(arr[dq[0]])
    
    return result
```

<!-- slide -->
```cpp
#include <vector>
#include <deque>
using namespace std;

vector<int> minInWindow(const vector<int>& arr, int k) {
    if (arr.empty() || k <= 0 || k > arr.size()) return {};
    
    deque<int> dq;
    vector<int> result;
    
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
import java.util.*;

public List<Integer> minInWindow(int[] arr, int k) {
    if (arr == null || arr.length == 0) return new ArrayList<>();
    
    Deque<Integer> dq = new ArrayDeque<>();
    List<Integer> result = new ArrayList<>();
    
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
    if (!arr || arr.length === 0) return [];
    
    const dq = [];
    const result = [];
    
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

---

## Related Problems

### LeetCode Problems

| Problem | Difficulty | Description |
|---------|------------|-------------|
| **[239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)** | Hard | Maximum in each sliding window (deque required) |
| **[480. Sliding Window Median](https://leetcode.com/problems/sliding-window-median/)** | Hard | Median in each sliding window |
| **[1696. Minimum Number of Removals to Make Mountain Array](https://leetcode.com/problems/minimum-number-of-removals-to-make-mountain-array/)** | Medium | Uses sliding window max |
| **[1425. Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum/)** | Medium | Uses deque for optimization |
| **[1697. Checking Existence of Edge Length Limited Paths](https://leetcode.com/problems/checking-existence-of-edge-length-limited-paths/)** | Hard | Uses sorting + sliding window |
| **[995. Minimum Number of K Consecutive Bit Flips](https://leetcode.com/problems/minimum-number-of-k-consecutive-bit-flips/)** | Hard | Uses deque for range updates |
| **[2100. Find Good Days to Rob the Bank](https://leetcode.com/problems/find-good-days-to-rob-the-bank/)** | Medium | Uses sliding window logic |
| **[2281. Sum of Total Strength of Wizards](https://leetcode.com/problems/sum-of-total-strength-of-wizards/)** | Hard | Uses monotonic stack + prefix sums |

### Related Patterns

- **[Fixed Size Sliding Window](sliding-window-fixed-size-subarray-calculation.md)** - Basic sliding window concepts
- **[Variable Size Sliding Window](sliding-window-variable-size-condition-based.md)** - Dynamic window size
- **[Monotonic Stack](stack-monotonic-stack.md)** - Related data structure pattern
- **[Two Pointers](two-pointers-converging-sorted-array-target-sum.md)** - Related array traversal technique

---

## Video Tutorial Links

### Fundamentals

- [Sliding Window Maximum - LeetCode 239 (NeetCode)](https://www.youtube.com/watch?v=49d50a_jp10) - Comprehensive explanation of monotonic deque
- [Sliding Window Maximum (Take U Forward)](https://www.youtube.com/watch?v=DfljaUwG2i8) - Detailed walkthrough with examples
- [Monotonic Queue Pattern (WilliamFiset)](https://www.youtube.com/watch?v=MC_ZPiXyqHs) - In-depth algorithmic explanation

### Advanced Topics

- [Sliding Window Median - LeetCode 480](https://www.youtube.com/watch?v=Cs3s1R7WOMM) - Advanced median calculation
- [Constrained Subsequence Sum - LeetCode 1425](https://www.youtube.com/watch?v=o2L4jSa6j9k) - Deque application
- [Complete Sliding Window Playlist (Take U Forward)](https://www.youtube.com/playlist?list=PLzjZaW71k84Q9A1X6DdGDGD8tmOKVMbdM) - Comprehensive practice

### Practice

- [14 Sliding Window Problems (NeetCode)](https://www.youtube.com/watch?v=MK-NZ4hV-gM) - Practice problems
- [Top Sliding Window Problems (Grind75)](https://www.youtube.com/playlist?list=PL6W8B3bX1l8l6w2X) - Top problems ranked by importance

---

## Follow-up Questions

### Q1: What's the difference between using `<` vs `<=` when removing elements?

**Answer:** 
- Use `<` to keep duplicate values in the deque (useful when you need to track all indices)
- Use `<=` to remove duplicates and keep only the most recent index (saves space)
- For maximum: `<` keeps older duplicates, `<=` keeps newer duplicates
- For minimum: `>` keeps older duplicates, `>=` keeps newer duplicates

---

### Q2: How do you handle a sliding window with variable size?

**Answer:** For variable-size windows:
1. Track the left pointer separately
2. Expand right pointer and update condition
3. Shrink left pointer when condition is violated
4. Use deques to track max/min within the current variable window

```python
def max_in_variable_window(arr, condition):
    max_dq = deque()
    result = []
    left = 0
    
    for right in range(len(arr)):
        # Add new element
        while max_dq and arr[max_dq[-1]] < arr[right]:
            max_dq.pop()
        max_dq.append(right)
        
        # Shrink window until condition is met
        while left <= right and not condition(left, right):
            if max_dq[0] == left:
                max_dq.popleft()
            left += 1
        
        # Record max for valid window
        if condition(left, right):
            result.append(arr[max_dq[0]])
```

---

### Q3: How would you find the k-th smallest/largest element in a sliding window?

**Answer:** For k-th smallest/largest, you can:
1. Use two deques to track k elements (like quickselect partition)
2. Use a balanced BST/TreeSet (O(log k) per operation)
3. Use two heaps (min-heap for smaller elements, max-heap for larger)

```python
from collections import deque
import heapq

def kth_largest_in_window(arr, k, window_size):
    # Use two heaps approach
    small = []  # max-heap (negative values)
    large = []  # min-heap
    
    for i in range(len(arr)):
        # Add new element
        if not small or -arr[i] <= small[0]:
            heapq.heappush(small, -arr[i])
        else:
            heapq.heappush(large, arr[i])
        
        # Remove element out of window
        # (need additional tracking for removal)
        
        # Rebalance to maintain k elements in small
        # Return -small[0] as k-th largest
```

---

### Q4: How do you handle negative numbers?

**Answer:** The monotonic deque algorithm works identically with negative numbers. The comparisons (`<`, `>`, `<=`, `>=`) handle negative values correctly. However, be careful with:
- Initial values: Don't initialize max with 0 if array can be all negative
- Overflow: In languages like C++/Java, be careful with integer overflow when computing differences

---

### Q5: What's the space complexity and can it be optimized?

**Answer:** 
- **Space Complexity**: O(k) for the deque
- **Can it be O(1)?** No, because we need to store indices to know which elements are in the current window
- **Optimization Tips**:
  - Store values instead of indices if you don't need original positions (but then you can't remove out-of-window elements)
  - Use circular buffer for very large k
  - For streaming data, use circular buffer with timestamp tracking

---

### Q6: How do you implement this for streaming data?

**Answer:** For streaming data where you don't know the total size:

```python
from collections import deque

class StreamingMax:
    def __init__(self, k):
        self.k = k
        self.dq = deque()
        self.values = deque()  # Circular buffer for values
    
    def add(self, value):
        # Add to our tracking
        while self.dq and self.dq[-1][1] < value:
            self.dq.pop()
        self.dq.append((len(self.values), value))
        self.values.append(value)
        
        # Remove if window is exceeded
        if len(self.values) > self.k:
            oldest_idx, oldest_val = self.values.popleft()
            if self.dq and self.dq[0][0] == oldest_idx:
                self.dq.popleft()
    
    def get_max(self):
        return self.dq[0][1] if self.dq else None
```

---

### Q7: How do you handle circular arrays?

**Answer:** For circular arrays:
1. Concatenate the array with itself (arr + arr)
2. Apply the standard algorithm on the concatenated array
3. Only consider windows starting within the original array bounds

```python
def max_in_circular_window(arr, k):
    if k > len(arr):
        return []
    
    extended = arr + arr
    dq = deque()
    result = []
    
    for i in range(2 * len(arr)):
        # Remove out-of-window elements (considering only valid windows)
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        while dq and extended[dq[-1]] < extended[i]:
            dq.pop()
        
        dq.append(i)
        
        # Only record for windows starting in original array
        if i >= k - 1 and i < len(arr) + k - 1:
            result.append(extended[dq[0]])
    
    return result
```

---

### Q8: How do you debug monotonic queue issues?

**Answer:** Debugging tips:
1. **Print the deque state** at each iteration showing indices and values
2. **Trace removal conditions**: Verify which condition triggers removal
3. **Check boundary cases**: k=1, k=n, all same values
4. **Use visual debugging**: Draw the array and show deque contents

```python
def max_in_window_debug(arr, k):
    dq = deque()
    for i in range(len(arr)):
        print(f"Processing arr[{i}] = {arr[i]}")
        print(f"  Before: dq indices = {list(dq)}")
        
        while dq and dq[0] <= i - k:
            print(f"  Removing out-of-window: index {dq[0]}")
            dq.popleft()
        
        count = 0
        while dq and arr[dq[-1]] < arr[i]:
            count += 1
            print(f"  Removing smaller element: index {dq[-1]}, value {arr[dq[-1]]}")
            dq.pop()
        
        dq.append(i)
        print(f"  After: dq indices = {list(dq)}, max = {arr[dq[0]] if dq else None}")
```

---

### Q9: How does this compare to segment trees?

**Answer:** 

| Aspect | Monotonic Queue | Segment Tree |
|--------|-----------------|--------------|
| **Query Time** | O(1) per window | O(log n) per query |
| **Build Time** | O(n) | O(n) |
| **Update** | Automatic (sliding) | O(log n) per update |
| **Space** | O(k) | O(n) |
| **Flexibility** | Fixed window sliding | Arbitrary queries |
| **Best For** | Sequential sliding windows | Random access queries |

Use monotonic queue when the window slides sequentially (most common case). Use segment tree when you need arbitrary range queries or point updates.

---

### Q10: What if the array is extremely large (billions of elements)?

**Answer:** For extremely large datasets:
1. **Streaming approach**: Process data in chunks
2. **External memory**: Use disk-based deques
3. **Distributed processing**: Split across machines with overlap
4. **Sampling**: For approximate answers, use reservoir sampling

```python
class ExternalMaxWindow {
    // For distributed systems
    // Process partitions independently, then merge results
    // Requires handling window boundaries between partitions
}
```

---

### Q11: How do you count the number of subarrays where max - min <= K?

**Answer:** This is a classic problem using two deques:

```python
from collections import deque

def count_subarrays_max_min_diff(arr, k):
    """
    Count subarrays where max - min <= k
    """
    max_dq = deque()
    min_dq = deque()
    count = 0
    left = 0
    
    for right in range(len(arr)):
        # Add right element
        while max_dq and arr[max_dq[-1]] < arr[right]:
            max_dq.pop()
        max_dq.append(right)
        
        while min_dq and arr[min_dq[-1]] > arr[right]:
            min_dq.pop()
        min_dq.append(right)
        
        # Shrink left until condition is satisfied
        while left <= right and arr[max_dq[0]] - arr[min_dq[0]] > k:
            if max_dq[0] == left:
                max_dq.popleft()
            if min_dq[0] == left:
                min_dq.popleft()
            left += 1
        
        # All subarrays ending at right and starting at [left, right] are valid
        count += right - left + 1
    
    return count
```

---

### Q12: What are common pitfalls and how to avoid them?

**Answer:** Common pitfalls:

1. **Off-by-one errors in window boundaries**
   - Use `i - k` (not `i - k + 1`) when checking out-of-window
   - Remember to start recording at `i >= k - 1`

2. **Not handling empty arrays**
   - Always check for empty input first

3. **Wrong comparison operators**
   - Use `<` for max (removes smaller), `>` for min (removes larger)
   - Decide on strict vs non-strict for duplicates

4. **Not removing out-of-window elements first**
   - Always check window boundary before removing smaller/larger elements
   - Order matters: remove out-of-window first

5. **Using value instead of index in deque**
   - Store indices, not values, to track window position
