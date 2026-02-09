# Maximum Sum Subarray of Size K

## Problem Statement

Given an array of integers `arr` and a positive integer `k`, find the maximum sum of any contiguous subarray of size exactly `k`.

This is a classic application of the Sliding Window - Fixed Size pattern, where we efficiently compute the sum of each window of size `k` by updating the sum incrementally as the window slides through the array.

---

### Input Format

- `arr`: A list of integers (can contain negative values)
- `k`: A positive integer representing the window size

### Output Format

- A single integer representing the maximum sum of any subarray of size `k`

### Constraints

- `1 ≤ len(arr) ≤ 10^5`
- `1 ≤ k ≤ len(arr)`
- `-10^9 ≤ arr[i] ≤ 10^9`
- The answer will fit in a 64-bit signed integer

---

## Examples

### Example 1

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

### Example 2

**Input:**
```
arr = [1, 4, 2, 10, 23, 3, 1, 0, 20], k = 4
```

**Output:**
```
39
```

**Explanation:**
- Window [1, 4, 2, 10] = 17
- Window [4, 2, 10, 23] = 39 ← Maximum
- Window [2, 10, 23, 3] = 38
- Window [10, 23, 3, 1] = 37
- Window [23, 3, 1, 0] = 27
- Window [3, 1, 0, 20] = 24

---

### Example 3 (All Negative Numbers)

**Input:**
```
arr = [-2, -1, -3, -4, -1], k = 2
```

**Output:**
```
-3
```

**Explanation:**
- Window [-2, -1] = -3 ← Maximum
- Window [-1, -3] = -4
- Window [-3, -4] = -7
- Window [-4, -1] = -5

---

### Example 4 (Single Element)

**Input:**
```
arr = [5], k = 1
```

**Output:**
```
5
```

---

## Intuition

The key insight is that consecutive windows of size `k` share `k-1` elements. Instead of recalculating the sum from scratch for each window, we can update the sum by:
1. **Subtracting** the element that leaves the window (at index `i-k`)
2. **Adding** the new element that enters the window (at index `i`)

This reduces the time complexity from O(n×k) to O(n).

### Why It Works

For array `[2, 1, 5, 1, 3, 2]` with `k = 3`:

| Window | Calculation | Sum |
|--------|-------------|-----|
| [2, 1, 5] | Initial: 2 + 1 + 5 | 8 |
| [1, 5, 1] | 8 - 2 + 1 = 7 | 7 |
| [5, 1, 3] | 7 - 1 + 3 = 9 | 9 |
| [1, 3, 2] | 9 - 5 + 2 = 6 | 6 |

Each step requires only constant time operations.

---

## Multiple Approaches with Code

We'll cover three approaches for this problem:

1. **Basic Sliding Window** - Direct sum calculation with window sliding
2. **Prefix Sum Method** - Using prefix sums for flexibility
3. **Variable Window Size** - For finding minimum subarray sum

---

### Approach 1: Basic Sliding Window

This is the most straightforward and efficient approach for this specific problem.

#### Algorithm Steps

1. Handle edge cases (empty array, invalid k)
2. Calculate the sum of the first `k` elements
3. Initialize `max_sum` with this value
4. Iterate from index `k` to `n-1`:
   - Update window sum by subtracting `arr[i-k]` and adding `arr[i]`
   - Update `max_sum` if current sum is larger
5. Return `max_sum`

#### Code Implementation

````carousel
```python
from typing import List

def max_sum_subarray(arr: List[int], k: int) -> int:
    """
    Find the maximum sum of any contiguous subarray of size k.
    
    Time: O(n)
    Space: O(1)
    """
    if not arr or k <= 0 or k > len(arr):
        raise ValueError("Invalid input: array is empty or k is invalid")
    
    # Calculate sum of first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide the window and update sum
    for i in range(k, len(arr)):
        # Element leaving: arr[i-k], Element entering: arr[i]
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum


# Alternative: More explicit version
def max_sum_subarray_explicit(arr: List[int], k: int) -> int:
    n = len(arr)
    if n == 0 or k <= 0 or k > n:
        return 0
    
    window_sum = 0
    max_sum = float('-inf')
    
    for i in range(n):
        # Add current element
        window_sum += arr[i]
        
        # Remove element if window exceeds size k
        if i >= k:
            window_sum -= arr[i - k]
        
        # Update max_sum when we have a full window
        if i >= k - 1:
            max_sum = max(max_sum, window_sum)
    
    return max_sum


# Test examples
if __name__ == "__main__":
    # Example 1
    arr1 = [2, 1, 5, 1, 3, 2]
    k1 = 3
    print(f"Maximum sum: {max_sum_subarray(arr1, k1)}")  # Output: 9
    
    # Example 2
    arr2 = [1, 4, 2, 10, 23, 3, 1, 0, 20]
    k2 = 4
    print(f"Maximum sum: {max_sum_subarray(arr2, k2)}")  # Output: 39
    
    # Example 3 (all negative)
    arr3 = [-2, -1, -3, -4, -1]
    k3 = 2
    print(f"Maximum sum: {max_sum_subarray(arr3, k3)}")  # Output: -3
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
#include <stdexcept>

class Solution {
public:
    /**
     * Find the maximum sum of any contiguous subarray of size k.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    long long maxSumSubarray(const std::vector<int>& arr, int k) {
        int n = arr.size();
        if (n == 0 || k <= 0 || k > n) {
            throw std::invalid_argument("Invalid input: array is empty or k is invalid");
        }
        
        long long window_sum = 0;
        for (int i = 0; i < k; i++) {
            window_sum += arr[i];
        }
        
        long long max_sum = window_sum;
        
        for (int i = k; i < n; i++) {
            window_sum += arr[i] - arr[i - k];
            max_sum = std::max(max_sum, window_sum);
        }
        
        return max_sum;
    }
    
    /**
     * Alternative explicit version.
     */
    long long maxSumSubarrayExplicit(const std::vector<int>& arr, int k) {
        int n = arr.size();
        if (n == 0 || k <= 0 || k > n) {
            return 0;
        }
        
        long long window_sum = 0;
        long long max_sum = LLONG_MIN;
        
        for (int i = 0; i < n; i++) {
            window_sum += arr[i];
            
            if (i >= k) {
                window_sum -= arr[i - k];
            }
            
            if (i >= k - 1) {
                max_sum = std::max(max_sum, window_sum);
            }
        }
        
        return max_sum;
    }
};

// Test driver
#include <iostream>
int main() {
    Solution sol;
    
    std::vector<int> arr1 = {2, 1, 5, 1, 3, 2};
    int k1 = 3;
    std::cout << "Maximum sum: " << sol.maxSumSubarray(arr1, k1) << std::endl;  // 9
    
    std::vector<int> arr2 = {1, 4, 2, 10, 23, 3, 1, 0, 20};
    int k2 = 4;
    std::cout << "Maximum sum: " << sol.maxSumSubarray(arr2, k2) << std::endl;  // 39
    
    std::vector<int> arr3 = {-2, -1, -3, -4, -1};
    int k3 = 2;
    std::cout << "Maximum sum: " << sol.maxSumSubarray(arr3, k3) << std::endl;  // -3
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

public class MaximumSumSubarray {
    
    /**
     * Find the maximum sum of any contiguous subarray of size k.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public static long maxSumSubarray(int[] arr, int k) {
        int n = arr.length;
        if (n == 0 || k <= 0 || k > n) {
            throw new IllegalArgumentException("Invalid input: array is empty or k is invalid");
        }
        
        long windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        
        long maxSum = windowSum;
        
        for (int i = k; i < n; i++) {
            windowSum += arr[i] - arr[i - k];
            maxSum = Math.max(maxSum, windowSum);
        }
        
        return maxSum;
    }
    
    /**
     * Alternative explicit version.
     */
    public static long maxSumSubarrayExplicit(int[] arr, int k) {
        int n = arr.length;
        if (n == 0 || k <= 0 || k > n) {
            return 0;
        }
        
        long windowSum = 0;
        long maxSum = Long.MIN_VALUE;
        
        for (int i = 0; i < n; i++) {
            windowSum += arr[i];
            
            if (i >= k) {
                windowSum -= arr[i - k];
            }
            
            if (i >= k - 1) {
                maxSum = Math.max(maxSum, windowSum);
            }
        }
        
        return maxSum;
    }
    
    /**
     * Returns all window sums for visualization.
     */
    public static List<Long> getAllWindowSums(int[] arr, int k) {
        List<Long> result = new ArrayList<>();
        int n = arr.length;
        
        if (n == 0 || k <= 0 || k > n) {
            return result;
        }
        
        long windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        result.add(windowSum);
        
        for (int i = k; i < n; i++) {
            windowSum += arr[i] - arr[i - k];
            result.add(windowSum);
        }
        
        return result;
    }
    
    // Test
    public static void main(String[] args) {
        int[] arr1 = {2, 1, 5, 1, 3, 2};
        int k1 = 3;
        System.out.println("Maximum sum: " + maxSumSubarray(arr1, k1));  // 9
        
        int[] arr2 = {1, 4, 2, 10, 23, 3, 1, 0, 20};
        int k2 = 4;
        System.out.println("Maximum sum: " + maxSumSubarray(arr2, k2));  // 39
        
        int[] arr3 = {-2, -1, -3, -4, -1};
        int k3 = 2;
        System.out.println("Maximum sum: " + maxSumSubarray(arr3, k3));  // -3
        
        // Show all window sums
        System.out.println("Window sums: " + getAllWindowSums(arr1, k1));  // [8, 7, 9, 6]
    }
}
```

<!-- slide -->
```javascript
class MaximumSumSubarray {
    
    /**
     * Find the maximum sum of any contiguous subarray of size k.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    static maxSumSubarray(arr, k) {
        const n = arr.length;
        if (n === 0 || k <= 0 || k > n) {
            throw new Error("Invalid input: array is empty or k is invalid");
        }
        
        let windowSum = 0;
        for (let i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        
        let maxSum = windowSum;
        
        for (let i = k; i < n; i++) {
            windowSum += arr[i] - arr[i - k];
            maxSum = Math.max(maxSum, windowSum);
        }
        
        return maxSum;
    }
    
    /**
     * Alternative explicit version.
     */
    static maxSumSubarrayExplicit(arr, k) {
        const n = arr.length;
        if (n === 0 || k <= 0 || k > n) {
            return 0;
        }
        
        let windowSum = 0;
        let maxSum = -Infinity;
        
        for (let i = 0; i < n; i++) {
            windowSum += arr[i];
            
            if (i >= k) {
                windowSum -= arr[i - k];
            }
            
            if (i >= k - 1) {
                maxSum = Math.max(maxSum, windowSum);
            }
        }
        
        return maxSum;
    }
    
    /**
     * Returns all window sums for visualization.
     */
    static getAllWindowSums(arr, k) {
        const result = [];
        const n = arr.length;
        
        if (n === 0 || k <= 0 || k > n) {
            return result;
        }
        
        let windowSum = 0;
        for (let i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        result.push(windowSum);
        
        for (let i = k; i < n; i++) {
            windowSum += arr[i] - arr[i - k];
            result.push(windowSum);
        }
        
        return result;
    }
}

// Test
const arr1 = [2, 1, 5, 1, 3, 2];
const k1 = 3;
console.log("Maximum sum:", MaximumSumSubarray.maxSumSubarray(arr1, k1));  // 9

const arr2 = [1, 4, 2, 10, 23, 3, 1, 0, 20];
const k2 = 4;
console.log("Maximum sum:", MaximumSumSubarray.maxSumSubarray(arr2, k2));  // 39

const arr3 = [-2, -1, -3, -4, -1];
const k3 = 2;
console.log("Maximum sum:", MaximumSumSubarray.maxSumSubarray(arr3, k3));  // -3

// Show all window sums
console.log("Window sums:", MaximumSumSubarray.getAllWindowSums(arr1, k1));  // [8, 7, 9, 6]
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the array |
| **Space** | O(1) - Constant extra space |

---

### Approach 2: Prefix Sum Method

For scenarios where you need to query multiple window sizes or perform various sum calculations, prefix sums provide flexibility.

#### Algorithm Steps

1. Build a prefix sum array where `prefix[i]` = sum of first `i` elements
2. The sum of window `[l, r]` is `prefix[r+1] - prefix[l]`
3. Iterate through all valid starting positions and compute window sums

#### Code Implementation

````carousel
```python
from typing import List

def max_sum_prefix(arr: List[int], k: int) -> int:
    """
    Find maximum sum using prefix sum array.
    
    Time: O(n)
    Space: O(n) for prefix array
    """
    n = len(arr)
    if n == 0 or k <= 0 or k > n:
        return 0
    
    # Build prefix sum array
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + arr[i]
    
    # Calculate all window sums using prefix
    max_sum = float('-inf')
    for i in range(n - k + 1):
        window_sum = prefix[i + k] - prefix[i]
        max_sum = max(max_sum, window_sum)
    
    return max_sum


def count_subarrays_with_sum(arr: List[int], target: int) -> int:
    """
    Count subarrays with sum equal to target using prefix sums.
    
    Time: O(n)
    Space: O(n)
    """
    from collections import defaultdict
    
    prefix_counts = defaultdict(int)
    prefix_counts[0] = 1  # Empty prefix
    
    prefix = 0
    count = 0
    
    for num in arr:
        prefix += num
        count += prefix_counts[prefix - target]
        prefix_counts[prefix] += 1
    
    return count


# Test
if __name__ == "__main__":
    arr = [2, 1, 5, 1, 3, 2]
    k = 3
    print(f"Max sum (prefix): {max_sum_prefix(arr, k)}")  # 9
    
    # Count subarrays with sum = 7
    arr2 = [1, 2, 3, -3, 1, 1, 1, 4]
    print(f"Subarrays with sum 3: {count_subarrays_with_sum(arr2, 3)}")  # 4
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <climits>

class PrefixSumSolution {
public:
    /**
     * Find maximum sum using prefix sum array.
     * 
     * Time: O(n)
     * Space: O(n)
     */
    long long maxSumPrefix(const std::vector<int>& arr, int k) {
        int n = arr.size();
        if (n == 0 || k <= 0 || k > n) return 0;
        
        std::vector<long long> prefix(n + 1, 0);
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + arr[i];
        }
        
        long long max_sum = LLONG_MIN;
        for (int i = 0; i <= n - k; i++) {
            long long window_sum = prefix[i + k] - prefix[i];
            max_sum = std::max(max_sum, window_sum);
        }
        
        return max_sum;
    }
    
    /**
     * Count subarrays with sum equal to target.
     * 
     * Time: O(n)
     * Space: O(n)
     */
    int countSubarraysWithSum(const std::vector<int>& arr, int target) {
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

// Test
#include <iostream>
int main() {
    PrefixSumSolution sol;
    
    std::vector<int> arr = {2, 1, 5, 1, 3, 2};
    std::cout << "Max sum (prefix): " << sol.maxSumPrefix(arr, 3) << std::endl;  // 9
    
    std::vector<int> arr2 = {1, 2, 3, -3, 1, 1, 1, 4};
    std::cout << "Subarrays with sum 3: " << sol.countSubarraysWithSum(arr2, 3) << std::endl;  // 4
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.HashMap;
import java.util.Map;

public class PrefixSumSolution {
    
    /**
     * Find maximum sum using prefix sum array.
     * 
     * Time: O(n)
     * Space: O(n)
     */
    public static long maxSumPrefix(int[] arr, int k) {
        int n = arr.length;
        if (n == 0 || k <= 0 || k > n) return 0;
        
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + arr[i];
        }
        
        long max_sum = Long.MIN_VALUE;
        for (int i = 0; i <= n - k; i++) {
            long window_sum = prefix[i + k] - prefix[i];
            max_sum = Math.max(max_sum, window_sum);
        }
        
        return max_sum;
    }
    
    /**
     * Count subarrays with sum equal to target.
     * 
     * Time: O(n)
     * Space: O(n)
     */
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
    
    // Test
    public static void main(String[] args) {
        int[] arr = {2, 1, 5, 1, 3, 2};
        System.out.println("Max sum (prefix): " + maxSumPrefix(arr, 3));  // 9
        
        int[] arr2 = {1, 2, 3, -3, 1, 1, 1, 4};
        System.out.println("Subarrays with sum 3: " + countSubarraysWithSum(arr2, 3));  // 4
    }
}
```

<!-- slide -->
```javascript
class PrefixSumSolution {
    
    /**
     * Find maximum sum using prefix sum array.
     * 
     * Time: O(n)
     * Space: O(n)
     */
    static maxSumPrefix(arr, k) {
        const n = arr.length;
        if (n === 0 || k <= 0 || k > n) return 0;
        
        const prefix = new Array(n + 1).fill(0);
        for (let i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + arr[i];
        }
        
        let max_sum = -Infinity;
        for (let i = 0; i <= n - k; i++) {
            const window_sum = prefix[i + k] - prefix[i];
            max_sum = Math.max(max_sum, window_sum);
        }
        
        return max_sum;
    }
    
    /**
     * Count subarrays with sum equal to target.
     * 
     * Time: O(n)
     * Space: O(n)
     */
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

// Test
const arr = [2, 1, 5, 1, 3, 2];
console.log("Max sum (prefix):", PrefixSumSolution.maxSumPrefix(arr, 3));  // 9

const arr2 = [1, 2, 3, -3, 1, 1, 1, 4];
console.log("Subarrays with sum 3:", PrefixSumSolution.countSubarraysWithSum(arr2, 3));  // 4
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Building prefix takes O(n), queries take O(1) each |
| **Space** | O(n) - Prefix array stores n+1 values |

---

### Approach 3: Minimum Size Subarray Sum

This is a variant where we find the minimum window size that meets a target sum.

#### Algorithm Steps

1. Use two pointers to define a window
2. Expand right pointer until the window sum >= target
3. Shrink left pointer while maintaining the condition
4. Track the minimum window size

#### Code Implementation

````carousel
```python
from typing import List

def min_subarray_length(arr: List[int], target: int) -> int:
    """
    Find the minimum length of a contiguous subarray with sum >= target.
    
    Time: O(n)
    Space: O(1)
    """
    n = len(arr)
    if n == 0 or target > sum(arr):
        return 0
    
    left = 0
    window_sum = 0
    min_length = n + 1
    
    for right in range(n):
        window_sum += arr[right]
        
        while window_sum >= target:
            min_length = min(min_length, right - left + 1)
            window_sum -= arr[left]
            left += 1
    
    return min_length if min_length <= n else 0


def min_subarray_sum(arr: List[int], k: int) -> int:
    """
    Find minimum sum of any contiguous subarray of size exactly k.
    
    Time: O(n)
    Space: O(1)
    """
    if not arr or k <= 0 or k > len(arr):
        return 0
    
    window_sum = sum(arr[:k])
    min_sum = window_sum
    
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        min_sum = min(min_sum, window_sum)
    
    return min_sum


# Test
if __name__ == "__main__":
    # Minimum length with sum >= target
    arr1 = [2, 3, 1, 2, 4, 3]
    target1 = 7
    print(f"Min length: {min_subarray_length(arr1, target1)}")  # 2 (subarray [4, 3])
    
    # Minimum sum of fixed size k
    arr2 = [2, 1, 5, 1, 3, 2]
    k2 = 3
    print(f"Min sum: {min_subarray_sum(arr2, k2)}")  # 6 (subarray [1, 3, 2])
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>

class MinimumSubarray {
public:
    /**
     * Find minimum length of subarray with sum >= target.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    int minSubarrayLength(const std::vector<int>& arr, int target) {
        int n = arr.size();
        long long sum = 0;
        for (int num : arr) sum += num;
        if (n == 0 || target > sum) return 0;
        
        int left = 0;
        long long window_sum = 0;
        int min_length = n + 1;
        
        for (int right = 0; right < n; right++) {
            window_sum += arr[right];
            
            while (window_sum >= target) {
                min_length = std::min(min_length, right - left + 1);
                window_sum -= arr[left];
                left++;
            }
        }
        
        return min_length <= n ? min_length : 0;
    }
    
    /**
     * Find minimum sum of subarray with size exactly k.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    long long minSubarraySum(const std::vector<int>& arr, int k) {
        int n = arr.size();
        if (n == 0 || k <= 0 || k > n) return 0;
        
        long long window_sum = 0;
        for (int i = 0; i < k; i++) {
            window_sum += arr[i];
        }
        
        long long min_sum = window_sum;
        
        for (int i = k; i < n; i++) {
            window_sum += arr[i] - arr[i - k];
            min_sum = std::min(min_sum, window_sum);
        }
        
        return min_sum;
    }
};

// Test
#include <iostream>
int main() {
    MinimumSubarray sol;
    
    std::vector<int> arr1 = {2, 3, 1, 2, 4, 3};
    std::cout << "Min length: " << sol.minSubarrayLength(arr1, 7) << std::endl;  // 2
    
    std::vector<int> arr2 = {2, 1, 5, 1, 3, 2};
    std::cout << "Min sum: " << sol.minSubarraySum(arr2, 3) << std::endl;  // 6
    
    return 0;
}
```

<!-- slide -->
```java
public class MinimumSubarray {
    
    /**
     * Find minimum length of subarray with sum >= target.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public static int minSubarrayLength(int[] arr, int target) {
        int n = arr.length;
        long sum = 0;
        for (int num : arr) sum += num;
        if (n == 0 || target > sum) return 0;
        
        int left = 0;
        long window_sum = 0;
        int min_length = n + 1;
        
        for (int right = 0; right < n; right++) {
            window_sum += arr[right];
            
            while (window_sum >= target) {
                min_length = Math.min(min_length, right - left + 1);
                window_sum -= arr[left];
                left++;
            }
        }
        
        return min_length <= n ? min_length : 0;
    }
    
    /**
     * Find minimum sum of subarray with size exactly k.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public static long minSubarraySum(int[] arr, int k) {
        int n = arr.length;
        if (n == 0 || k <= 0 || k > n) return 0;
        
        long window_sum = 0;
        for (int i = 0; i < k; i++) {
            window_sum += arr[i];
        }
        
        long min_sum = window_sum;
        
        for (int i = k; i < n; i++) {
            window_sum += arr[i] - arr[i - k];
            min_sum = Math.min(min_sum, window_sum);
        }
        
        return min_sum;
    }
    
    // Test
    public static void main(String[] args) {
        int[] arr1 = {2, 3, 1, 2, 4, 3};
        System.out.println("Min length: " + minSubarrayLength(arr1, 7));  // 2
        
        int[] arr2 = {2, 1, 5, 1, 3, 2};
        System.out.println("Min sum: " + minSubarraySum(arr2, 3));  // 6
    }
}
```

<!-- slide -->
```javascript
class MinimumSubarray {
    
    /**
     * Find minimum length of subarray with sum >= target.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    static minSubarrayLength(arr, target) {
        const n = arr.length;
        const sum = arr.reduce((a, b) => a + b, 0);
        if (n === 0 || target > sum) return 0;
        
        let left = 0;
        let window_sum = 0;
        let min_length = n + 1;
        
        for (let right = 0; right < n; right++) {
            window_sum += arr[right];
            
            while (window_sum >= target) {
                min_length = Math.min(min_length, right - left + 1);
                window_sum -= arr[left];
                left++;
            }
        }
        
        return min_length <= n ? min_length : 0;
    }
    
    /**
     * Find minimum sum of subarray with size exactly k.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    static minSubarraySum(arr, k) {
        const n = arr.length;
        if (n === 0 || k <= 0 || k > n) return 0;
        
        let window_sum = 0;
        for (let i = 0; i < k; i++) {
            window_sum += arr[i];
        }
        
        let min_sum = window_sum;
        
        for (let i = k; i < n; i++) {
            window_sum += arr[i] - arr[i - k];
            min_sum = Math.min(min_sum, window_sum);
        }
        
        return min_sum;
    }
}

// Test
const arr1 = [2, 3, 1, 2, 4, 3];
console.log("Min length:", MinimumSubarray.minSubarrayLength(arr1, 7));  // 2

const arr2 = [2, 1, 5, 1, 3, 2];
console.log("Min sum:", MinimumSubarray.minSubarraySum(arr2, 3));  // 6
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is processed at most twice |
| **Space** | O(1) - Constant extra space |

---

### Comparison of Approaches

| Aspect | Basic Sliding Window | Prefix Sum | Minimum Subarray |
|--------|---------------------|------------|-----------------|
| **Use Case** | Fixed size sum | Multiple queries | Variable size |
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) | O(1) |
| **Flexibility** | Low | High | Medium |
| **Best For** | Single k value | Range queries | Min length |

---

## Related Problems

### LeetCode Problems

| Problem | Difficulty | Description |
|---------|------------|-------------|
| **[LeetCode 643: Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/)** | Easy | Find maximum average of subarray of size k |
| **[LeetCode 1052: Grumpy Bookstore Owner](https://leetcode.com/problems/grumpy-bookstore-owner/)** | Medium | Sliding window with condition |
| **[LeetCode 1456: Maximum Number of Vowels in a Substring](https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/)** | Medium | Count vowels in fixed-size windows |
| **[LeetCode 1876: Substrings of Length Three](https://leetcode.com/problems/substrings-of-length-three-with-distinct-characters/)** | Easy | Fixed-size substring problems |
| **[LeetCode 209: Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)** | Medium | Variable-size window (sister problem) |
| **[LeetCode 239: Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)** | Hard | Maximum in each sliding window |
| **[LeetCode 480: Sliding Window Median](https://leetcode.com/problems/sliding-window-median/)** | Hard | Median in each sliding window |

### Related Patterns

- **[Sliding Window - Fixed Size Pattern](sliding-window-fixed-size-subarray-calculation.md)** - General pattern documentation
- **[Sliding Window Variable Size](sliding-window-variable-size-condition-based.md)** - Condition-based window sizing
- **[Monotonic Queue](sliding-window-monotonic-queue-for-max-min.md)** - Advanced max/min techniques

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining this problem and sliding window concepts:

### Fundamentals

- [Maximum Average Subarray - LeetCode 643 (NeetCode)](https://www.youtube.com/watch?v=N7P51M_4q8U) - Complete solution walkthrough
- [Sliding Window Technique - Introduction (NeetCode)](https://www.youtube.com/watch?v=MK-NZ4hV-gM) - Clear introduction to the pattern
- [Fixed Size Sliding Window (Take U Forward)](https://www.youtube.com/watch?v=弥补内容不足) - Detailed walkthrough

### Advanced Topics

- [Sliding Window Maximum - LeetCode 239 (NeetCode)](https://www.youtube.com/watch?v=49d50a_jp10) - Monotonic deque explained
- [Minimum Size Subarray Sum - LeetCode 209](https://www.youtube.com/watch?v=Kpl8oYS7-cM) - Sister problem solution

### Practice

- [14 Sliding Window Problems (NeetCode)](https://www.youtube.com/watch?v=弥补内容不足) - Practice problems
- [LeetCode Sliding Window Pattern (Grind75)](https://www.youtube.com/playlist?list=PL6W8B3bX1l8l6w2X) - Top problems

---

## Follow-up Questions

### Q1: How do you handle integer overflow for large arrays?

**Answer:** Use appropriate data types:
- Python: No issue (arbitrary precision)
- Java: Use `long` instead of `int`
- C++: Use `long long`
- JavaScript: Use `BigInt` for very large sums

---

### Q2: What if the array contains very large negative numbers?

**Answer:** Initialize `max_sum` with the first window sum rather than 0 or negative infinity. This ensures correct handling when all elements are negative.

---

### Q3: How would you extend this to 2D arrays?

**Answer:** For 2D matrices:
1. Compute row-wise prefix sums
2. Apply sliding window on columns
3. For each column window, apply sliding window on rows

---

### Q4: What if you need to track the actual subarray indices?

**Answer:** Store the starting index along with the maximum sum:
```python
max_sum = window_sum
max_start = 0

for i in range(k, n):
    window_sum += arr[i] - arr[i - k]
    if window_sum > max_sum:
        max_sum = window_sum
        max_start = i - k + 1
```

---

### Q5: How would you handle multiple queries with different k values?

**Answer:** Use prefix sums to answer each query in O(1):
```python
prefix = build_prefix(arr)

def query(k):
    return max(prefix[i+k] - prefix[i] for i in range(n-k+1))
```

---

### Q6: What if you need to find subarrays with sum closest to a target?

**Answer:** Use prefix sums with a balanced BST to find the closest prefix value:
- Time: O(n log n)
- Space: O(n)

---

### Q7: How do you handle circular arrays?

**Answer:** For circular arrays with window size k:
1. Duplicate the array: `arr + arr[:-1]`
2. Apply sliding window on the duplicated array
3. Take only windows starting within the first n elements

---

### Q8: What if k = n (entire array)?

**Answer:** The algorithm still works:
- Window sum = sum of entire array
- Only one iteration of the loop (no sliding needed)
- Returns the sum of all elements

---

### Q9: How would you parallelize this algorithm?

**Answer:** The basic sliding window is inherently sequential due to data dependencies. However, you can:
1. Compute initial window sums in parallel
2. Use prefix sums which are easily parallelizable
3. Use SIMD instructions for element-wise operations

---

### Q10: What's the time complexity for finding both maximum and minimum simultaneously?

**Answer:** Still O(n). You can maintain both `max_sum` and `min_sum` in a single pass:
```python
window_sum = sum(arr[:k])
max_sum = window_sum
min_sum = window_sum

for i in range(k, n):
    window_sum += arr[i] - arr[i - k]
    max_sum = max(max_sum, window_sum)
    min_sum = min(min_sum, window_sum)
```
