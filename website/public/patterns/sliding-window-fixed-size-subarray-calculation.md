# Sliding Window - Fixed Size (Subarray Calculation)

## Problem Statement

The Sliding Window - Fixed Size pattern is used for problems that require performing calculations on subarrays of a constant size `k`. This pattern is particularly effective for scenarios where you need to compute metrics like sums, averages, maximums, or minimums over every possible subarray of length `k` in an array. Instead of using a brute-force approach that would result in O(n×k) time complexity, this pattern achieves O(n) time by maintaining a running calculation as the window slides through the array.

Common problem variations include:

- **Maximum Sum Subarray of Size K**: Find the maximum sum of any contiguous subarray of size `k`
- **Average of Subarrays of Size K**: Calculate the average of every subarray of size `k`
- **Maximum/Minimum in Each Window**: Find the maximum or minimum element in each sliding window
- **Count of Subarrays with XOR**: Count subarrays with a specific XOR value

---

### Input Format

- `arr`: An array of integers (or other comparable elements)
- `k`: The fixed window size (positive integer)

### Output Format

Depends on the specific problem:
- For sum problems: Maximum sum value
- For average problems: Maximum average value
- For max/min problems: Array of maximum/minimum values for each window
- For XOR problems: Count of subarrays meeting the condition

### Constraints

- `1 ≤ len(arr) ≤ 10^5` (typical upper bound)
- `1 ≤ k ≤ len(arr)`
- `−10^9 ≤ arr[i] ≤ 10^9` (consider negative numbers)
- Time complexity target: O(n)
- Space complexity target: O(1) or O(k)

---

## Examples

### Example 1: Maximum Sum Subarray of Size K

**Input:**
```
arr = [2, 1, 5, 1, 3, 2], k = 3
```

**Output:**
```
9
```

**Explanation:**
- Window [2, 1, 5] = 8
- Window [1, 5, 1] = 7
- Window [5, 1, 3] = 9 ← Maximum
- Window [1, 3, 2] = 6

---

### Example 2: Average of Subarrays of Size K

**Input:**
```
arr = [1, 3, 2, 6, 5], k = 2
```

**Output:**
```
[2.0, 2.5, 4.0, 5.5]
```

**Explanation:**
- Window [1, 3] = 4/2 = 2.0
- Window [3, 2] = 5/2 = 2.5
- Window [2, 6] = 8/2 = 4.0
- Window [6, 5] = 11/2 = 5.5

---

### Example 3: Maximum in Each Window

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

### Example 4: Edge Cases

**Input:**
```
arr = [5], k = 1
```

**Output:**
```
5
```

**Explanation:** Single element, window size 1 - the element itself is the answer.

---

## Intuition

The key insight behind the fixed-size sliding window pattern is **incremental computation**. When moving from one window to the next, most elements remain the same - only one element leaves the window and one new element enters. This means we can update our calculation in constant time rather than recomputing everything from scratch.

### Why It Works

Consider computing sums for windows of size `k`:

**Naive Approach (O(n×k)):**
```python
for i in range(n - k + 1):
    current_sum = sum(arr[i:i+k])  # O(k) each time
    max_sum = max(max_sum, current_sum)
```

**Sliding Window Approach (O(n)):**
```python
# Initialize first window
current_sum = sum(arr[:k])

# Slide window: subtract element leaving, add element entering
for i in range(k, n):
    current_sum += arr[i] - arr[i-k]  # O(1)
```

The difference is dramatic: instead of recalculating the sum of `k` elements each time, we simply adjust by two values.

### Key Observations

1. **Window Overlap**: Adjacent windows of size `k` share `k-1` elements
2. **Constant Update**: The relationship between consecutive windows is always: `window[i+1] = window[i] - arr[i] + arr[i+k]`
3. **State Maintenance**: We only need to track the current window's calculation, not the entire window contents

---

## Multiple Approaches with Code

We'll cover three approaches for fixed-size sliding window problems:

1. **Basic Sliding Window** - Direct sum/max calculation with window sliding
2. **Monotonic Queue Optimization** - For max/min in each window (O(n))
3. **Prefix Sum Method** - Useful for sum-based queries

---

### Approach 1: Basic Sliding Window

This is the fundamental approach for sum and average calculations. We maintain a running sum and update it as the window slides.

#### Algorithm Steps

1. Handle edge cases (empty array, invalid k)
2. Compute the initial window sum (first k elements)
3. Slide the window from index `k` to `n-1`:
   - Subtract the element leaving the window
   - Add the new element entering the window
   - Update the result (max, min, or store for each window)

#### Code Implementation

````carousel
```python
from typing import List

def max_sum_subarray(arr: List[int], k: int) -> int:
    """
    Find the maximum sum of any contiguous subarray of size k.
    Time: O(n), Space: O(1)
    """
    if not arr or k <= 0 or k > len(arr):
        return 0
    
    # Initialize first window sum
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide the window
    for i in range(k, len(arr)):
        # Update: remove element at i-k, add element at i
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum


def averages_of_subarrays(arr: List[int], k: int) -> List[float]:
    """
    Calculate the average of every subarray of size k.
    Time: O(n), Space: O(n-k+1) for output
    """
    if not arr or k <= 0 or k > len(arr):
        return []
    
    window_sum = sum(arr[:k])
    result = [window_sum / k]
    
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        result.append(window_sum / k)
    
    return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>

class SlidingWindow {
public:
    // Find maximum sum of any subarray of size k
    static long long maxSumSubarray(const std::vector<int>& arr, int k) {
        if (arr.empty() || k <= 0 || k > arr.size()) {
            return 0;
        }
        
        long long window_sum = 0;
        for (int i = 0; i < k; i++) {
            window_sum += arr[i];
        }
        
        long long max_sum = window_sum;
        
        for (int i = k; i < arr.size(); i++) {
            window_sum += arr[i] - arr[i - k];
            max_sum = std::max(max_sum, window_sum);
        }
        
        return max_sum;
    }
    
    // Calculate averages of all subarrays of size k
    static std::vector<double> averagesOfSubarrays(const std::vector<int>& arr, int k) {
        if (arr.empty() || k <= 0 || k > arr.size()) {
            return {};
        }
        
        std::vector<double> result;
        long long window_sum = 0;
        
        for (int i = 0; i < k; i++) {
            window_sum += arr[i];
        }
        result.push_back(static_cast<double>(window_sum) / k);
        
        for (int i = k; i < arr.size(); i++) {
            window_sum += arr[i] - arr[i - k];
            result.push_back(static_cast<double>(window_sum) / k);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

public class SlidingWindow {
    
    // Find maximum sum of any subarray of size k
    public static long maxSumSubarray(int[] arr, int k) {
        if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) {
            return 0;
        }
        
        long windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        
        long maxSum = windowSum;
        
        for (int i = k; i < arr.length; i++) {
            windowSum += arr[i] - arr[i - k];
            maxSum = Math.max(maxSum, windowSum);
        }
        
        return maxSum;
    }
    
    // Calculate averages of all subarrays of size k
    public static List<Double> averagesOfSubarrays(int[] arr, int k) {
        if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) {
            return new ArrayList<>();
        }
        
        List<Double> result = new ArrayList<>();
        long windowSum = 0;
        
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        result.add((double) windowSum / k);
        
        for (int i = k; i < arr.length; i++) {
            windowSum += arr[i] - arr[i - k];
            result.add((double) windowSum / k);
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
class SlidingWindow {
    
    // Find maximum sum of any subarray of size k
    static maxSumSubarray(arr, k) {
        if (!arr || arr.length === 0 || k <= 0 || k > arr.length) {
            return 0;
        }
        
        let windowSum = 0;
        for (let i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        
        let maxSum = windowSum;
        
        for (let i = k; i < arr.length; i++) {
            windowSum += arr[i] - arr[i - k];
            maxSum = Math.max(maxSum, windowSum);
        }
        
        return maxSum;
    }
    
    // Calculate averages of all subarrays of size k
    static averagesOfSubarrays(arr, k) {
        if (!arr || arr.length === 0 || k <= 0 || k > arr.length) {
            return [];
        }
        
        const result = [];
        let windowSum = 0;
        
        for (let i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        result.push(windowSum / k);
        
        for (let i = k; i < arr.length; i++) {
            windowSum += arr[i] - arr[i - k];
            result.push(windowSum / k);
        }
        
        return result;
    }
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the array |
| **Space** | O(1) - Constant extra space (excluding output) |

---

### Approach 2: Monotonic Queue for Maximum/Minimum in Each Window

When we need to find the maximum or minimum in each sliding window, a monotonic queue (deque) gives us O(n) time instead of O(n×k).

#### Algorithm Steps

1. Use a deque to store indices of elements in decreasing order (for max) or increasing order (for min)
2. For each element in the array:
   - Remove indices that are out of the current window from the front
   - Remove indices of elements smaller/larger than the current element from the back
   - Add the current element's index to the back
   - The front of the deque is always the max/min of the current window

#### Code Implementation

````carousel
```python
from collections import deque
from typing import List

def max_in_sliding_window(arr: List[int], k: int) -> List[int]:
    """
    Find maximum in each sliding window of size k.
    Time: O(n), Space: O(k)
    """
    if not arr or k <= 0 or k > len(arr):
        return []
    
    result = []
    dq = deque()  # Stores indices, values in decreasing order
    
    for i in range(len(arr)):
        # Remove indices outside the current window
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Remove indices of elements smaller than current
        while dq and arr[dq[-1]] < arr[i]:
            dq.pop()
        
        # Add current element index
        dq.append(i)
        
        # Add to result once we have processed k elements
        if i >= k - 1:
            result.append(arr[dq[0]])
    
    return result


def min_in_sliding_window(arr: List[int], k: int) -> List[int]:
    """
    Find minimum in each sliding window of size k.
    Time: O(n), Space: O(k)
    """
    if not arr or k <= 0 or k > len(arr):
        return []
    
    result = []
    dq = deque()  # Stores indices, values in increasing order
    
    for i in range(len(arr)):
        # Remove indices outside the current window
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Remove indices of elements larger than current
        while dq and arr[dq[-1]] > arr[i]:
            dq.pop()
        
        # Add current element index
        dq.append(i)
        
        # Add to result once we have processed k elements
        if i >= k - 1:
            result.append(arr[dq[0]])
    
    return result
```

<!-- slide -->
```cpp
#include <vector>
#include <deque>
#include <algorithm>

class SlidingWindowMaxMin {
public:
    // Maximum in each sliding window
    static std::vector<int> maxInWindow(const std::vector<int>& arr, int k) {
        if (arr.empty() || k <= 0 || k > arr.size()) {
            return {};
        }
        
        std::vector<int> result;
        std::deque<int> dq;  // Stores indices, decreasing values
        
        for (int i = 0; i < arr.size(); i++) {
            // Remove indices outside window
            while (!dq.empty() && dq.front() <= i - k) {
                dq.pop_front();
            }
            
            // Remove smaller elements
            while (!dq.empty() && arr[dq.back()] < arr[i]) {
                dq.pop_back();
            }
            
            dq.push_back(i);
            
            if (i >= k - 1) {
                result.push_back(arr[dq.front()]);
            }
        }
        
        return result;
    }
    
    // Minimum in each sliding window
    static std::vector<int> minInWindow(const std::vector<int>& arr, int k) {
        if (arr.empty() || k <= 0 || k > arr.size()) {
            return {};
        }
        
        std::vector<int> result;
        std::deque<int> dq;  // Stores indices, increasing values
        
        for (int i = 0; i < arr.size(); i++) {
            // Remove indices outside window
            while (!dq.empty() && dq.front() <= i - k) {
                dq.pop_front();
            }
            
            // Remove larger elements
            while (!dq.empty() && arr[dq.back()] > arr[i]) {
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

public class SlidingWindowMaxMin {
    
    // Maximum in each sliding window
    public static List<Integer> maxInWindow(int[] arr, int k) {
        if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) {
            return new ArrayList<>();
        }
        
        List<Integer> result = new ArrayList<>();
        Deque<Integer> dq = new ArrayDeque<>();  // Stores indices, decreasing values
        
        for (int i = 0; i < arr.length; i++) {
            // Remove indices outside window
            while (!dq.isEmpty() && dq.peekFirst() <= i - k) {
                dq.pollFirst();
            }
            
            // Remove smaller elements
            while (!dq.isEmpty() && arr[dq.peekLast()] < arr[i]) {
                dq.pollLast();
            }
            
            dq.addLast(i);
            
            if (i >= k - 1) {
                result.add(arr[dq.peekFirst()]);
            }
        }
        
        return result;
    }
    
    // Minimum in each sliding window
    public static List<Integer> minInWindow(int[] arr, int k) {
        if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) {
            return new ArrayList<>();
        }
        
        List<Integer> result = new ArrayList<>();
        Deque<Integer> dq = new ArrayDeque<>();  // Stores indices, increasing values
        
        for (int i = 0; i < arr.length; i++) {
            // Remove indices outside window
            while (!dq.isEmpty() && dq.peekFirst() <= i - k) {
                dq.pollFirst();
            }
            
            // Remove larger elements
            while (!dq.isEmpty() && arr[dq.peekLast()] > arr[i]) {
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
class SlidingWindowMaxMin {
    
    // Maximum in each sliding window
    static maxInWindow(arr, k) {
        if (!arr || arr.length === 0 || k <= 0 || k > arr.length) {
            return [];
        }
        
        const result = [];
        const dq = [];  // Stores indices, decreasing values
        
        for (let i = 0; i < arr.length; i++) {
            // Remove indices outside window
            while (dq.length > 0 && dq[0] <= i - k) {
                dq.shift();
            }
            
            // Remove smaller elements
            while (dq.length > 0 && arr[dq[dq.length - 1]] < arr[i]) {
                dq.pop();
            }
            
            dq.push(i);
            
            if (i >= k - 1) {
                result.push(arr[dq[0]]);
            }
        }
        
        return result;
    }
    
    // Minimum in each sliding window
    static minInWindow(arr, k) {
        if (!arr || arr.length === 0 || k <= 0 || k > arr.length) {
            return [];
        }
        
        const result = [];
        const dq = [];  // Stores indices, increasing values
        
        for (let i = 0; i < arr.length; i++) {
            // Remove indices outside window
            while (dq.length > 0 && dq[0] <= i - k) {
                dq.shift();
            }
            
            // Remove larger elements
            while (dq.length > 0 && arr[dq[dq.length - 1]] > arr[i]) {
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
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is pushed and popped at most once |
| **Space** | O(k) - The deque stores at most k elements |

---

### Approach 3: Prefix Sum Method

For multiple queries or when we need to compute various window properties, prefix sums provide a flexible solution.

#### Algorithm Steps

1. Build a prefix sum array where `prefix[i]` = sum of first `i` elements
2. The sum of window `[l, r]` is `prefix[r+1] - prefix[l]`
3. Use prefix sums to answer queries in O(1) time

#### Code Implementation

````carousel
```python
from typing import List

def prefix_sum_array(arr: List[int]) -> List[int]:
    """
    Build prefix sum array.
    prefix[i] = sum of arr[0:i] (arr[0] to arr[i-1])
    """
    prefix = [0] * (len(arr) + 1)
    for i in range(1, len(arr) + 1):
        prefix[i] = prefix[i - 1] + arr[i - 1]
    return prefix


def window_sum_prefix(prefix: List[int], left: int, right: int) -> int:
    """
    Get sum of window [left, right] using prefix sums.
    """
    return prefix[right + 1] - prefix[left]


def max_sum_using_prefix(arr: List[int], k: int) -> int:
    """
    Find maximum sum subarray of size k using prefix sums.
    """
    if not arr or k <= 0 or k > len(arr):
        return 0
    
    prefix = prefix_sum_array(arr)
    max_sum = float('-inf')
    
    for i in range(len(arr) - k + 1):
        window_sum = window_sum_prefix(prefix, i, i + k - 1)
        max_sum = max(max_sum, window_sum)
    
    return max_sum


# Example: Count subarrays with given sum using prefix sum + hashmap
def count_subarrays_with_sum(arr: List[int], target: int) -> int:
    """
    Count subarrays with sum equal to target using prefix sums and hashmap.
    Time: O(n), Space: O(n)
    """
    from collections import defaultdict
    
    prefix_counts = defaultdict(int)
    prefix_counts[0] = 1  # Empty prefix
    
    prefix = 0
    count = 0
    
    for num in arr:
        prefix += num
        # If prefix - target exists, all those subarrays end here
        count += prefix_counts[prefix - target]
        prefix_counts[prefix] += 1
    
    return count
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <climits>

class PrefixSum {
public:
    // Build prefix sum array
    static std::vector<long long> buildPrefix(const std::vector<int>& arr) {
        std::vector<long long> prefix(arr.size() + 1, 0);
        for (size_t i = 1; i <= arr.size(); i++) {
            prefix[i] = prefix[i - 1] + arr[i - 1];
        }
        return prefix;
    }
    
    // Get sum of window [l, r] using prefix sums
    static long long windowSum(const std::vector<long long>& prefix, int l, int r) {
        return prefix[r + 1] - prefix[l];
    }
    
    // Find maximum sum subarray of size k using prefix sums
    static long long maxSumUsingPrefix(const std::vector<int>& arr, int k) {
        if (arr.empty() || k <= 0 || k > arr.size()) {
            return 0;
        }
        
        auto prefix = buildPrefix(arr);
        long long max_sum = LLONG_MIN;
        
        for (size_t i = 0; i <= arr.size() - k; i++) {
            long long window_sum = windowSum(prefix, i, i + k - 1);
            max_sum = std::max(max_sum, window_sum);
        }
        
        return max_sum;
    }
    
    // Count subarrays with sum equal to target
    static int countSubarraysWithSum(const std::vector<int>& arr, int target) {
        std::unordered_map<long long, int> prefix_counts;
        prefix_counts[0] = 1;
        
        long long prefix = 0;
        int count = 0;
        
        for (int num : arr) {
            prefix += num;
            auto it = prefix_counts.find(prefix - target);
            if (it != prefix_counts.end()) {
                count += it->second;
            }
            prefix_counts[prefix]++;
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
import java.util.HashMap;
import java.util.Map;

public class PrefixSum {
    
    // Build prefix sum array
    public static long[] buildPrefix(int[] arr) {
        long[] prefix = new long[arr.length + 1];
        for (int i = 1; i <= arr.length; i++) {
            prefix[i] = prefix[i - 1] + arr[i - 1];
        }
        return prefix;
    }
    
    // Get sum of window [l, r] using prefix sums
    public static long windowSum(long[] prefix, int l, int r) {
        return prefix[r + 1] - prefix[l];
    }
    
    // Find maximum sum subarray of size k using prefix sums
    public static long maxSumUsingPrefix(int[] arr, int k) {
        if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) {
            return 0;
        }
        
        long[] prefix = buildPrefix(arr);
        long max_sum = Long.MIN_VALUE;
        
        for (int i = 0; i <= arr.length - k; i++) {
            long window_sum = windowSum(prefix, i, i + k - 1);
            max_sum = Math.max(max_sum, window_sum);
        }
        
        return max_sum;
    }
    
    // Count subarrays with sum equal to target
    public static int countSubarraysWithSum(int[] arr, int target) {
        Map<Long, Integer> prefix_counts = new HashMap<>();
        prefix_counts.put(0L, 1);
        
        long prefix = 0;
        int count = 0;
        
        for (int num : arr) {
            prefix += num;
            count += prefix_counts.getOrDefault(prefix - target, 0);
            prefix_counts.put(prefix, prefix_counts.getOrDefault(prefix, 0) + 1);
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
class PrefixSum {
    
    // Build prefix sum array
    static buildPrefix(arr) {
        const prefix = new Array(arr.length + 1).fill(0);
        for (let i = 1; i <= arr.length; i++) {
            prefix[i] = prefix[i - 1] + arr[i - 1];
        }
        return prefix;
    }
    
    // Get sum of window [l, r] using prefix sums
    static windowSum(prefix, l, r) {
        return prefix[r + 1] - prefix[l];
    }
    
    // Find maximum sum subarray of size k using prefix sums
    static maxSumUsingPrefix(arr, k) {
        if (!arr || arr.length === 0 || k <= 0 || k > arr.length) {
            return 0;
        }
        
        const prefix = PrefixSum.buildPrefix(arr);
        let max_sum = -Infinity;
        
        for (let i = 0; i <= arr.length - k; i++) {
            const window_sum = PrefixSum.windowSum(prefix, i, i + k - 1);
            max_sum = Math.max(max_sum, window_sum);
        }
        
        return max_sum;
    }
    
    // Count subarrays with sum equal to target
    static countSubarraysWithSum(arr, target) {
        const prefix_counts = new Map();
        prefix_counts.set(0, 1);
        
        let prefix = 0;
        let count = 0;
        
        for (const num of arr) {
            prefix += num;
            count += prefix_counts.get(prefix - target) || 0;
            prefix_counts.set(prefix, (prefix_counts.get(prefix) || 0) + 1);
        }
        
        return count;
    }
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) for building prefix, O(1) per query |
| **Space** | O(n) for prefix array |

---

### Comparison of Approaches

| Aspect | Basic Sliding Window | Monotonic Queue | Prefix Sum |
|--------|---------------------|-----------------|------------|
| **Use Case** | Sum/Average calculations | Max/Min in each window | Multiple queries |
| **Time Complexity** | O(n) | O(n) | O(n) build, O(1) query |
| **Space Complexity** | O(1) | O(k) | O(n) |
| **Implementation** | Simple | Moderate | Simple |
| **Flexibility** | Low | Medium | High |
| **Best For** | One-pass calculations | Stream processing | Range queries |

---

## General Code Templates

### Template 1: Maximum Sum Subarray of Size K

````carousel
```python
def max_sum_subarray(arr, k):
    """
    Find maximum sum of any contiguous subarray of size k.
    """
    if not arr or k <= 0 or k > len(arr):
        return 0
    
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum
```

<!-- slide -->
```cpp
long long maxSumSubarray(const vector<int>& arr, int k) {
    if (arr.empty() || k <= 0 || k > arr.size()) return 0;
    
    long long window_sum = accumulate(arr.begin(), arr.begin() + k, 0LL);
    long long max_sum = window_sum;
    
    for (int i = k; i < arr.size(); i++) {
        window_sum += arr[i] - arr[i - k];
        max_sum = max(max_sum, window_sum);
    }
    
    return max_sum;
}
```

<!-- slide -->
```java
public long maxSumSubarray(int[] arr, int k) {
    if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) return 0;
    
    long windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    long maxSum = windowSum;
    
    for (int i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}
```

<!-- slide -->
```javascript
function maxSumSubarray(arr, k) {
    if (!arr || arr.length === 0 || k <= 0 || k > arr.length) return 0;
    
    let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
    let maxSum = windowSum;
    
    for (let i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}
```
````

### Template 2: Maximum in Each Sliding Window

````carousel
```python
from collections import deque

def max_in_window(arr, k):
    """
    Find maximum in each sliding window of size k.
    """
    if not arr or k <= 0 or k > len(arr):
        return []
    
    dq = deque()  # Stores indices
    result = []
    
    for i in range(len(arr)):
        # Remove out-of-window elements
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
public List<Integer> maxInWindow(int[] arr, int k) {
    if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) 
        return new ArrayList<>();
    
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
    if (!arr || arr.length === 0 || k <= 0 || k > arr.length) return [];
    
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

---

## Related Problems

### LeetCode Problems

| Problem | Difficulty | Description |
|---------|------------|-------------|
| **[LeetCode 643: Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/)** | Easy | Find maximum average of any subarray of size k |
| **[LeetCode 1052: Grumpy Bookstore Owner](https://leetcode.com/problems/grumpy-bookstore-owner/)** | Medium | Sliding window with condition |
| **[LeetCode 1053: Previous Permutation With One Swap](https://leetcode.com/problems/previous-permutation-with-one-swap/)** | Medium | Array manipulation with swap |
| **[LeetCode 1493: Longest Subarray of 1's After Deleting One Element](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/)** | Medium | Sliding window with deletion |
| **[LeetCode 1456: Maximum Number of Vowels in a Substring of Given Length](https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/)** | Medium | Count vowels in fixed-size windows |
| **[LeetCode 1838: Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element/)** | Medium | Sliding window with frequency |
| **[LeetCode 1876: Substrings of Length Three with Distinct Characters](https://leetcode.com/problems/substrings-of-length-three-with-distinct-characters/)** | Easy | Fixed-size substring with condition |
| **[LeetCode 1984: Minimum Difference Between Largest and Smallest Value in Three Moves](https://leetcode.com/problems/minimum-difference-between-largest-and-smallest-value-in-three-moves/)** | Medium | Sliding window with sorting |
| **[LeetCode 239: Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)** | Hard | Maximum in each sliding window (deque required) |
| **[LeetCode 480: Sliding Window Median](https://leetcode.com/problems/sliding-window-median/)** | Hard | Median in each sliding window |

### Related Patterns

- **[Sliding Window Variable Size](sliding-window-variable-size-condition-based.md)** - When window size changes based on conditions
- **[Sliding Window Monotonic Queue](sliding-window-monotonic-queue-for-max-min.md)** - Advanced max/min techniques
- **[Two Pointers](two-pointers-converging-sorted-array-target-sum.md)** - Related technique for array problems

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining sliding window concepts:

### Fundamentals

- [Sliding Window Technique - Introduction (NeetCode)](https://www.youtube.com/watch?v=MK-NZ4hV-gM) - Clear introduction to the pattern
- [Fixed Size Sliding Window (Take U Forward)](https://www.youtube.com/watch?v=弥补内容不足) - Detailed walkthrough
- [Maximum Average Subarray - LeetCode 643 (NeetCode)](https://www.youtube.com/watch?v=N7P51M_4q8U) - Example problem solution

### Advanced Topics

- [Sliding Window Maximum - LeetCode 239 (NeetCode)](https://www.youtube.com/watch?v=49d50a_jp10) - Monotonic deque explained
- [Sliding Window Problems - Complete Playlist (Take U Forward)](https://www.youtube.com/playlist?list=PLzjZaW71k84Q9A1X6DdGDGD8tmOKVMbdM) - Comprehensive playlist
- [Sliding Window Technique - GeeksforGeeks](https://www.youtube.com/watch?v=9ZtrkcYaLDQ) - GfG explanation

### Practice

- [14 Sliding Window Problems (NeetCode)](https://www.youtube.com/watch?v=弥补内容不足) - Practice problems
- [LeetCode Sliding Window Pattern (Grind75)](https://www.youtube.com/playlist?list=PL6W8B3bX1l8l6w2X) - Top problems

---

## Follow-up Questions

### Q1: How do you handle negative numbers in sliding window problems?

**Answer:** The sliding window technique works seamlessly with negative numbers. For sum-based problems, the algorithm doesn't change - we still subtract the element leaving and add the new element. However, for maximum sum problems, the initial `max_sum` should be set to the first window sum rather than 0 to handle cases where all elements are negative.

---

### Q2: What if you need to find the minimum sum instead of maximum?

**Answer:** Simply replace `max()` with `min()` in the algorithm:

```python
min_sum = window_sum
for i in range(k, len(arr)):
    window_sum += arr[i] - arr[i - k]
    min_sum = min(min_sum, window_sum)
```

---

### Q3: How would you count subarrays with sum divisible by k?

**Answer:** Use prefix sums with modulo arithmetic. Track the count of each remainder `prefix[i] % k`. The number of subarrays with sum % k == 0 is the sum of combinations of counts.

---

### Q4: How do you find subarrays with XOR equal to a target value?

**Answer:** Use a hashmap to store prefix XOR values and their counts:
```python
prefix_xor = 0
count = 0
xor_map = {0: 1}  # prefix XOR 0 appears once

for num in arr:
    prefix_xor ^= num
    count += xor_map.get(prefix_xor ^ target, 0)
    xor_map[prefix_xor] = xor_map.get(prefix_xor, 0) + 1
```

---

### Q5: What modifications are needed for circular arrays?

**Answer:** For circular arrays, you can either:
1. Concatenate the array with itself and take windows of size k (if k < n)
2. Use modulo arithmetic to wrap around indices
3. Handle the wrap-around case separately

---

### Q6: How do you handle duplicate maximum values in sliding windows?

**Answer:** The monotonic deque approach handles duplicates correctly. When comparing `arr[dq[-1]] < arr[i]`, use `<=` to maintain only one copy of equal values, or `<` to keep all. The choice depends on whether you need to track multiple indices for equal values.

---

### Q7: What if k = 1 or k = n (edge cases)?

**Answer:**
- **k = 1**: Each window is a single element, so the result is just the array itself (or max/min is each element)
- **k = n**: Only one window exists, which is the entire array

Both cases are handled automatically by the standard algorithm.

---

### Q8: How would you implement a "at most k distinct characters" sliding window?

**Answer:** This is a variable-size window problem. Use two pointers with a frequency counter:
- Expand right pointer, update frequency
- When distinct count > k, shrink left pointer until distinct count <= k
- Track the maximum window size during the process

---

### Q9: How do you handle large numbers to prevent integer overflow?

**Answer:**
- In Python: No issue (arbitrary precision)
- In Java: Use `long` instead of `int`
- In C++: Use `long long` or check before addition
- In JavaScript: Use `BigInt` for very large numbers

---

### Q10: What's the difference between sliding window and two pointers?

**Answer:** Sliding window specifically refers to maintaining a contiguous window of a specific size (or range), while two pointers is a more general technique using two indices that can move independently. Sliding window is typically used for fixed-size ranges, while two pointers is used for various patterns like finding pairs, palindrome detection, etc.

---

### Q11: How would you modify the algorithm for 2D sliding windows?

**Answer:** For 2D matrices, you can:
1. Use prefix sums to compute any rectangular sum in O(1)
2. Apply the sliding window concept along one dimension first
3. Then apply along the second dimension

---

### Q12: How do you handle async/streaming data with sliding windows?

**Answer:** For streaming data:
- Use a circular buffer to store the current window
- Maintain running statistics (sum, max, min)
- When new data arrives: update sum, add new element, remove oldest element if window is full
- For max/min in streaming, use a monotonic queue with eviction based on timestamps
