# Sliding Window - Fixed Size (Subarray Calculation)

## Problem Description

The Fixed Size Sliding Window pattern performs calculations on subarrays of a constant size `k`. Instead of using brute-force O(n×k), this pattern achieves O(n) time by maintaining a running calculation as the window slides through the array.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - single pass through the array |
| Space Complexity | O(1) or O(k) depending on the problem |
| Input | Array of elements and fixed window size k |
| Output | Calculation result (max, sum, averages, etc.) |
| Approach | Incremental update when sliding the window |

### When to Use

- Computing sums, averages over fixed-size windows
- Finding maximum/minimum sum subarray of size k
- Problems requiring metrics on every contiguous subarray of size k
- Stream processing with fixed buffer sizes
- Any problem where adjacent windows share most elements

## Intuition

The key insight is **incremental computation**. Adjacent windows of size k share k-1 elements, so we update by removing the element leaving and adding the element entering.

The "aha!" moments:

1. **Window overlap**: Adjacent windows share k-1 elements
2. **Constant update**: `window[i+1] = window[i] - arr[i] + arr[i+k]`
3. **State maintenance**: Only track current window's calculation
4. **First window initialization**: Compute initial k elements separately
5. **Slide until end**: Process from index k to n-1

## Solution Approaches

### Approach 1: Basic Sliding Window (Sum/Max) ✅ Recommended

#### Algorithm

1. Handle edge cases (empty array, invalid k)
2. Compute the initial window sum (first k elements)
3. Slide the window from index k to n-1:
   - Subtract the element leaving the window: `arr[i-k]`
   - Add the new element entering: `arr[i]`
   - Update the result (max, sum, etc.)

#### Implementation

````carousel
```python
def max_sum_subarray(arr: list[int], k: int) -> int:
    """
    Find maximum sum of any contiguous subarray of size k.
    Time: O(n), Space: O(1)
    """
    if not arr or k <= 0 or k > len(arr):
        return 0
    
    # Initialize first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide the window
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum


def averages_of_subarrays(arr: list[int], k: int) -> list[float]:
    """
    Calculate average of every subarray of size k.
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

long long maxSumSubarray(const std::vector<int>& arr, int k) {
    // Find maximum sum of any subarray of size k.
    // Time: O(n), Space: O(1)
    if (arr.empty() || k <= 0 || k > arr.size()) return 0;
    
    long long windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    
    long long maxSum = windowSum;
    for (int i = k; i < arr.size(); i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = std::max(maxSum, windowSum);
    }
    
    return maxSum;
}

std::vector<double> averagesOfSubarrays(const std::vector<int>& arr, int k) {
    // Calculate average of every subarray of size k.
    if (arr.empty() || k <= 0 || k > arr.size()) return {};
    
    std::vector<double> result;
    long long windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    result.push_back(static_cast<double>(windowSum) / k);
    
    for (int i = k; i < arr.size(); i++) {
        windowSum += arr[i] - arr[i - k];
        result.push_back(static_cast<double>(windowSum) / k);
    }
    
    return result;
}
```
<!-- slide -->
```java
public long maxSumSubarray(int[] arr, int k) {
    // Find maximum sum of any subarray of size k.
    // Time: O(n), Space: O(1)
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

public List<Double> averagesOfSubarrays(int[] arr, int k) {
    // Calculate average of every subarray of size k.
    List<Double> result = new ArrayList<>();
    if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) return result;
    
    long windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    result.add((double) windowSum / k);
    
    for (int i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        result.add((double) windowSum / k);
    }
    
    return result;
}
```
<!-- slide -->
```javascript
function maxSumSubarray(arr, k) {
    // Find maximum sum of any subarray of size k.
    // Time: O(n), Space: O(1)
    if (!arr || arr.length === 0 || k <= 0 || k > arr.length) return 0;
    
    let windowSum = 0;
    for (let i = 0; i < k; i++) windowSum += arr[i];
    
    let maxSum = windowSum;
    for (let i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}

function averagesOfSubarrays(arr, k) {
    // Calculate average of every subarray of size k.
    if (!arr || arr.length === 0 || k <= 0 || k > arr.length) return [];
    
    const result = [];
    let windowSum = 0;
    for (let i = 0; i < k; i++) windowSum += arr[i];
    result.push(windowSum / k);
    
    for (let i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        result.push(windowSum / k);
    }
    
    return result;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass through the array |
| Space | O(1) - constant extra space (excluding output) |

### Approach 2: Prefix Sum Method

Use prefix sums for O(1) range sum queries after O(n) preprocessing.

#### Implementation

````carousel
```python
def max_sum_prefix(arr: list[int], k: int) -> int:
    """
    Find max sum subarray of size k using prefix sums.
    Time: O(n), Space: O(n)
    """
    if not arr or k <= 0 or k > len(arr):
        return 0
    
    # Build prefix sum array
    prefix = [0] * (len(arr) + 1)
    for i in range(len(arr)):
        prefix[i + 1] = prefix[i] + arr[i]
    
    max_sum = float('-inf')
    for i in range(k, len(arr) + 1):
        window_sum = prefix[i] - prefix[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum
```
<!-- slide -->
```cpp
long long maxSumPrefix(const std::vector<int>& arr, int k) {
    // Find max sum subarray using prefix sums.
    if (arr.empty() || k <= 0 || k > arr.size()) return 0;
    
    std::vector<long long> prefix(arr.size() + 1, 0);
    for (size_t i = 0; i < arr.size(); i++)
        prefix[i + 1] = prefix[i] + arr[i];
    
    long long maxSum = LLONG_MIN;
    for (size_t i = k; i <= arr.size(); i++) {
        long long windowSum = prefix[i] - prefix[i - k];
        maxSum = std::max(maxSum, windowSum);
    }
    
    return maxSum;
}
```
<!-- slide -->
```java
public long maxSumPrefix(int[] arr, int k) {
    // Find max sum subarray using prefix sums.
    if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) return 0;
    
    long[] prefix = new long[arr.length + 1];
    for (int i = 0; i < arr.length; i++)
        prefix[i + 1] = prefix[i] + arr[i];
    
    long maxSum = Long.MIN_VALUE;
    for (int i = k; i <= arr.length; i++) {
        long windowSum = prefix[i] - prefix[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}
```
<!-- slide -->
```javascript
function maxSumPrefix(arr, k) {
    // Find max sum subarray using prefix sums.
    if (!arr || arr.length === 0 || k <= 0 || k > arr.length) return 0;
    
    const prefix = new Array(arr.length + 1).fill(0);
    for (let i = 0; i < arr.length; i++)
        prefix[i + 1] = prefix[i] + arr[i];
    
    let maxSum = -Infinity;
    for (let i = k; i <= arr.length; i++) {
        const windowSum = prefix[i] - prefix[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - O(n) to build prefix, O(n) to query |
| Space | O(n) - for prefix array |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Basic Sliding Window | O(n) | O(1) | **Recommended** - most problems |
| Prefix Sum | O(n) | O(n) | Multiple range queries |
| Monotonic Queue | O(n) | O(k) | Max/Min in each window |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/) | 643 | Easy | Max average of subarray size k |
| [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) | 239 | Hard | Max in each sliding window |
| [Maximum Number of Vowels](https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/) | 1456 | Medium | Vowel count in fixed windows |
| [Grumpy Bookstore Owner](https://leetcode.com/problems/grumpy-bookstore-owner/) | 1052 | Medium | Sliding window with condition |
| [Substrings of Size Three](https://leetcode.com/problems/substrings-of-length-three-with-distinct-characters/) | 1876 | Easy | Fixed-size substring checks |

## Video Tutorial Links

1. **[NeetCode - Sliding Window](https://www.youtube.com/watch?v=MK-NZ4hV-gM)** - Introduction to the pattern
2. **[Maximum Average Subarray](https://www.youtube.com/watch?v=N7P51M_4q8U)** - Example problem solution
3. **[Sliding Window Maximum](https://www.youtube.com/watch?v=49d50a_jp10)** - Monotonic deque technique
4. **[Take U Forward - Sliding Window](https://www.youtube.com/watch?v=9ZtrkcYaLDQ)** - Comprehensive playlist
5. **[Grind75 Sliding Window](https://www.youtube.com/playlist?list=PLzjZaW71k84Q9A1X6DdGDGD8tmOKVMbdM)** - Practice problems

## Summary

### Key Takeaways

- **Window update formula**: `new_sum = old_sum - outgoing + incoming`
- **First window**: Compute separately, then slide from index k
- **Negative numbers**: Works seamlessly, just set `max_sum` to first window
- **Monotonic queue**: Use deque for max/min in each window (O(n))
- **Prefix sums**: Good for multiple arbitrary range queries

### Common Pitfalls

1. Not initializing `max_sum` with the first window's sum
2. Using `max()` with 0 when all numbers can be negative
3. Off-by-one errors in loop bounds (start at k, not k+1)
4. Forgetting to handle edge cases (k > n, empty array)
5. Confusing window size with number of windows

### Follow-up Questions

1. **How do you handle variable-size windows?**
   - Use two pointers with a condition to expand/shrink

2. **What if you need the minimum sum instead?**
   - Replace `max()` with `min()`

3. **How do you find subarrays with sum equal to k?**
   - Use hashmap with prefix sums

4. **Can you do this with O(1) space for streaming data?**
   - Yes, maintain running sum and circular buffer

5. **What's the difference from two pointers?**
   - Sliding window maintains a contiguous range

## Pattern Source

[Fixed Size Sliding Window Pattern](patterns/sliding-window-fixed-size-subarray-calculation.md)
