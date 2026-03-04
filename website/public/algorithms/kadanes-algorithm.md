# Kadane's Algorithm

## Category
Arrays & Strings

## Description

Kadane's Algorithm finds the **maximum sum of a contiguous subarray** (also known as the Maximum Subarray Problem) in O(n) time. This is a classic dynamic programming problem with an elegant greedy optimization that works by iterating through the array once, tracking the maximum sum ending at each position and the global maximum seen so far.

---

## When to Use

Use Kadane's Algorithm when you need to solve problems involving:

- **Maximum/Minimum Subarray Problems**: Finding the contiguous subarray with the largest/smallest sum
- **Maximum Product Subarray**: Finding the contiguous subarray with the largest product (variation)
- **Best Time to Buy and Sell Stock**: Finding maximum profit with single transaction
- **Circular Array Problems**: Maximum sum in a circular array
- **Subarray with At Least K Elements**: Finding maximum average of any contiguous subarray

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|-----------------|------------------|----------|
| **Brute Force** | O(n³) or O(n²) | O(1) | Small arrays only |
| **Divide and Conquer** | O(n log n) | O(log n) | Academic purposes |
| **Kadane's Algorithm** | **O(n)** | **O(1)** | **Optimal for single pass** |
| **Prefix Sum + Min Prefix** | O(n) | O(n) | When needing subarray indices |

### When to Choose Kadane's vs Other Approaches

- **Choose Kadane's Algorithm** when:
  - You need the maximum sum of a contiguous subarray
  - You want optimal O(n) time with O(1) space
  - You're solving variations like maximum product or circular array

- **Choose Prefix Sum** when:
  - You need to answer multiple range sum queries
  - You need to find subarrays with specific sum values
  - The array is dynamic (supports updates)

- **Choose Divide and Conquer** when:
  - You're asked about the approach in interviews
  - You need to find both minimum and maximum subarrays simultaneously

---

## Algorithm Explanation

### Core Concept

The key insight behind Kadane's Algorithm is that **any optimal subarray will never include a prefix with a negative sum**. If a prefix has a negative sum, removing it would give us a larger (or equal) sum.

This can be formalized as:
- Let `max_current` = maximum sum of subarray ending at index `i`
- Let `max_global` = maximum sum of any subarray seen so far
- Transition: `max_current = max(nums[i], max_current + nums[i])`
- Update: `max_global = max(max_global, max_current)`

### How It Works

#### Single Pass Process:

1. **Initialize**: Start with `max_current = max_global = nums[0]`
2. **Iterate** through the array from index 1 to n-1
3. **At each position i**:
   - Either extend the previous subarray (add nums[i] to max_current)
   - Or start a new subarray at position i (use nums[i] alone)
   - Take the maximum of these two choices
4. **Update global maximum** if current subarray sum is better
5. **Return** the global maximum

### Visual Representation

For array `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`:

```
Index:    0    1    2    3    4    5    6    7    8
Value:   -2    1   -3    4   -1    2    1   -5    4

max_current: -2    1   -2    4    3    5    6    1    4
max_global:  -2    1    1    4    4    5    6    6    6
                          ↑         ↑         ↑
                        start=3  start=3   start=3
                                  end=6     end=6

Maximum subarray: [4, -1, 2, 1] = 6 (indices 3-6)
```

### Why Greedy Works

The greedy choice (starting fresh when the prefix sum becomes negative) is optimal because:
- If `max_current + nums[i] < nums[i]`, then `max_current < 0`
- Any subarray containing this negative prefix would be smaller than starting fresh
- Therefore, discarding the negative prefix never loses us the optimal solution

### Limitations

- **Only works for contiguous subarrays**: Cannot handle non-contiguous subarrays
- **Requires at least one element**: Empty array handling needs special care
- **Not suitable for minimization directly**: Needs modification (negate array or use different approach)
- **Single pass constraint**: Cannot easily find the actual subarray indices in some variations

---

## Step-by-Step Approach

### Finding Maximum Subarray Sum

1. **Handle edge cases**: Return 0 or appropriate value for empty array
2. **Initialize**: Set `max_current = max_global = nums[0]`
3. **Iterate** through the array from index 1
4. **At each element**:
   - `max_current = max(nums[i], max_current + nums[i])`
   - `max_global = max(max_global, max_current)`
5. **Return** `max_global`

### Finding the Actual Subarray (with indices)

1. **Handle edge cases**: Return (0, -1, -1) for empty array
2. **Initialize**: 
   - `max_current = max_global = nums[0]`
   - `start = end = 0`
   - `temp_start = 0`
3. **Iterate** through the array from index 1
4. **At each element**:
   - If `nums[i] > max_current + nums[i]`:
     - Start new subarray: `max_current = nums[i]`, `temp_start = i`
   - Else:
     - Extend current: `max_current = max_current + nums[i]`
   - If `max_current > max_global`:
     - Update: `max_global = max_current`, `start = temp_start`, `end = i`
5. **Return** `(max_global, start, end)`

---

## Implementation

### Template Code (Maximum Subarray Sum)

````carousel
```python
def max_subarray(nums: list[int]) -> tuple:
    """
    Find the contiguous subarray with the largest sum.
    
    Args:
        nums: List of integers (can include negative numbers)
        
    Returns:
        Tuple of (max_sum, start_index, end_index)
        
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0, -1, -1
    
    # Initialize variables
    max_current = max_global = nums[0]
    start = end = 0
    temp_start = 0
    
    for i in range(1, len(nums)):
        # Either extend previous subarray or start new one
        if nums[i] > max_current + nums[i]:
            max_current = nums[i]
            temp_start = i
        else:
            max_current = max_current + nums[i]
        
        # Update global maximum if current is better
        if max_current > max_global:
            max_global = max_current
            start = temp_start
            end = i
    
    return max_global, start, end


def max_subarray_kadane(nums: list[int]) -> int:
    """
    Simpler version that returns only the maximum sum.
    
    Args:
        nums: List of integers
        
    Returns:
        Maximum sum of contiguous subarray
        
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0
    
    max_current = max_global = nums[0]
    
    for i in range(1, len(nums)):
        max_current = max(nums[i], max_current + nums[i])
        max_global = max(max_global, max_current)
    
    return max_global


# Example usage
if __name__ == "__main__":
    # Test case 1
    nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
    max_sum, start, end = max_subarray(nums)
    print(f"Array: {nums}")
    print(f"Maximum subarray sum: {max_sum}")
    print(f"Subarray: {nums[start:end+1]}")  # Output: [4, -1, 2, 1]
    
    # Test case 2
    nums = [1]
    print(f"\nArray: {nums}")
    print(f"Maximum subarray sum: {max_subarray_kadane(nums)}")  # Output: 1
    
    # Test case 3 - all negative
    nums = [-1, -2, -3, -4]
    print(f"\nArray: {nums}")
    print(f"Maximum subarray sum: {max_subarray_kadane(nums)}")  # Output: -1
    
    # Test case 4
    nums = [5, 4, -1, 7, 8]
    print(f"\nArray: {nums}")
    print(f"Maximum subarray sum: {max_subarray_kadane(nums)}")  # Output: 23
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/**
 * Kadane's Algorithm - Maximum Subarray Sum
 * 
 * Time: O(n)
 * Space: O(1)
 */

// Returns only the maximum sum
int maxSubarraySum(const vector<int>& nums) {
    if (nums.empty()) return 0;
    
    int maxCurrent = nums[0];
    int maxGlobal = nums[0];
    
    for (size_t i = 1; i < nums.size(); i++) {
        maxCurrent = max(nums[i], maxCurrent + nums[i]);
        maxGlobal = max(maxGlobal, maxCurrent);
    }
    
    return maxGlobal;
}

// Returns tuple: (max_sum, start_index, end_index)
tuple<int, int, int> maxSubarray(const vector<int>& nums) {
    if (nums.empty()) return {0, -1, -1};
    
    int maxCurrent = nums[0];
    int maxGlobal = nums[0];
    int start = 0, end = 0;
    int tempStart = 0;
    
    for (size_t i = 1; i < nums.size(); i++) {
        // Either start new or extend previous
        if (nums[i] > maxCurrent + nums[i]) {
            maxCurrent = nums[i];
            tempStart = i;
        } else {
            maxCurrent = maxCurrent + nums[i];
        }
        
        // Update global maximum
        if (maxCurrent > maxGlobal) {
            maxGlobal = maxCurrent;
            start = tempStart;
            end = i;
        }
    }
    
    return {maxGlobal, start, end};
}

int main() {
    // Test case 1
    vector<int> nums1 = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    auto [sum1, start1, end1] = maxSubarray(nums1);
    cout << "Array: [-2, 1, -3, 4, -1, 2, 1, -5, 4]" << endl;
    cout << "Maximum subarray sum: " << sum1 << endl;
    cout << "Subarray: [";
    for (int i = start1; i <= end1; i++) {
        cout << nums1[i] << (i < end1 ? ", " : "");
    }
    cout << "]" << endl << endl;
    
    // Test case 2
    vector<int> nums2 = {5, 4, -1, 7, 8};
    cout << "Maximum subarray sum: " << maxSubarraySum(nums2) << endl;  // Output: 23
    
    // Test case 3 - all negative
    vector<int> nums3 = {-1, -2, -3, -4};
    cout << "Maximum subarray sum: " << maxSubarraySum(nums3) << endl;  // Output: -1
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * Kadane's Algorithm - Maximum Subarray Sum
 * 
 * Time: O(n)
 * Space: O(1)
 */
public class KadaneAlgorithm {
    
    /**
     * Returns the maximum sum of a contiguous subarray.
     */
    public static int maxSubarraySum(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        
        int maxCurrent = nums[0];
        int maxGlobal = nums[0];
        
        for (int i = 1; i < nums.length; i++) {
            maxCurrent = Math.max(nums[i], maxCurrent + nums[i]);
            maxGlobal = Math.max(maxGlobal, maxCurrent);
        }
        
        return maxGlobal;
    }
    
    /**
     * Returns int[] with {maxSum, startIndex, endIndex}
     */
    public static int[] maxSubarray(int[] nums) {
        if (nums == null || nums.length == 0) {
            return new int[]{0, -1, -1};
        }
        
        int maxCurrent = nums[0];
        int maxGlobal = nums[0];
        int start = 0, end = 0;
        int tempStart = 0;
        
        for (int i = 1; i < nums.length; i++) {
            // Either start new subarray or extend previous
            if (nums[i] > maxCurrent + nums[i]) {
                maxCurrent = nums[i];
                tempStart = i;
            } else {
                maxCurrent = maxCurrent + nums[i];
            }
            
            // Update global maximum
            if (maxCurrent > maxGlobal) {
                maxGlobal = maxCurrent;
                start = tempStart;
                end = i;
            }
        }
        
        return new int[]{maxGlobal, start, end};
    }
    
    public static void main(String[] args) {
        // Test case 1
        int[] nums1 = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        int[] result1 = maxSubarray(nums1);
        System.out.println("Array: [-2, 1, -3, 4, -1, 2, 1, -5, 4]");
        System.out.println("Maximum subarray sum: " + result1[0]);
        System.out.print("Subarray: [");
        for (int i = result1[1]; i <= result1[2]; i++) {
            System.out.print(nums1[i] + (i < result1[2] ? ", " : ""));
        }
        System.out.println("]");  // Output: [4, -1, 2, 1]
        
        // Test case 2
        int[] nums2 = {5, 4, -1, 7, 8};
        System.out.println("\nMaximum subarray sum: " + maxSubarraySum(nums2));  // Output: 23
        
        // Test case 3 - all negative
        int[] nums3 = {-1, -2, -3, -4};
        System.out.println("Maximum subarray sum: " + maxSubarraySum(nums3));  // Output: -1
    }
}
```

<!-- slide -->
```javascript
/**
 * Kadane's Algorithm - Maximum Subarray Sum
 * 
 * Time: O(n)
 * Space: O(1)
 */

/**
 * Returns the maximum sum of a contiguous subarray.
 * @param {number[]} nums - Array of integers
 * @returns {number} Maximum subarray sum
 */
function maxSubarraySum(nums) {
    if (!nums || nums.length === 0) {
        return 0;
    }
    
    let maxCurrent = nums[0];
    let maxGlobal = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        maxCurrent = Math.max(nums[i], maxCurrent + nums[i]);
        maxGlobal = Math.max(maxGlobal, maxCurrent);
    }
    
    return maxGlobal;
}

/**
 * Returns object with maxSum, startIndex, and endIndex.
 * @param {number[]} nums - Array of integers
 * @returns {Object} { maxSum, startIndex, endIndex }
 */
function maxSubarray(nums) {
    if (!nums || nums.length === 0) {
        return { maxSum: 0, startIndex: -1, endIndex: -1 };
    }
    
    let maxCurrent = nums[0];
    let maxGlobal = nums[0];
    let start = 0, end = 0;
    let tempStart = 0;
    
    for (let i = 1; i < nums.length; i++) {
        // Either start new subarray or extend previous
        if (nums[i] > maxCurrent + nums[i]) {
            maxCurrent = nums[i];
            tempStart = i;
        } else {
            maxCurrent = maxCurrent + nums[i];
        }
        
        // Update global maximum
        if (maxCurrent > maxGlobal) {
            maxGlobal = maxCurrent;
            start = tempStart;
            end = i;
        }
    }
    
    return { maxSum: maxGlobal, startIndex: start, endIndex: end };
}

// Example usage
const nums1 = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
const result1 = maxSubarray(nums1);
console.log(`Array: [${nums1.join(', ')}]`);
console.log(`Maximum subarray sum: ${result1.maxSum}`);
console.log(`Subarray: [${nums1.slice(result1.startIndex, result1.endIndex + 1).join(', ')}]`);

const nums2 = [5, 4, -1, 7, 8];
console.log(`\nMaximum subarray sum: ${maxSubarraySum(nums2)}`);  // Output: 23

const nums3 = [-1, -2, -3, -4];
console.log(`Maximum subarray sum: ${maxSubarraySum(nums3)}`);  // Output: -1
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Single Pass** | O(n) | One iteration through the array |
| **Per Element** | O(1) | Constant time operations at each step |
| **Total** | O(n) | Linear time - optimal for this problem |

### Detailed Breakdown

- **Single iteration**: We traverse the array exactly once, making constant-time operations at each step
- **No nested loops**: Unlike brute force O(n²) or O(n³), Kadane's uses only a single loop
- **Optimal**: Cannot be improved upon since we must look at each element at least once

---

## Space Complexity Analysis

| Version | Space Complexity | Description |
|---------|-----------------|-------------|
| **Basic version** | O(1) | Only uses a few scalar variables |
| **With indices tracking** | O(1) | Same variables, just more of them |
| **With subarray return** | O(k) | Need to copy k elements of the subarray |

### Space Breakdown

- **Variables needed**: `maxCurrent`, `maxGlobal`, loop index `i`
- **For indices**: Additional `start`, `end`, `tempStart` variables
- **No auxiliary data structures**: Unlike dynamic programming solutions that use arrays

---

## Common Variations

### 1. Maximum Product Subarray

Instead of sum, find the maximum product. Need to track both maximum and minimum (since negative × negative = positive).

````carousel
```python
def max_product_subarray(nums: list[int]) -> int:
    """
    Find the contiguous subarray with the largest product.
    
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0
    
    max_prod = min_prod = result = nums[0]
    
    for i in range(1, len(nums)):
        # When nums[i] is negative, swapping max and min
        if nums[i] < 0:
            max_prod, min_prod = min_prod, max_prod
        
        max_prod = max(nums[i], max_prod * nums[i])
        min_prod = min(nums[i], min_prod * nums[i])
        result = max(result, max_prod)
    
    return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

int maxProductSubarray(const vector<int>& nums) {
    if (nums.empty()) return 0;
    
    int maxProd = nums[0];
    int minProd = nums[0];
    int result = nums[0];
    
    for (size_t i = 1; i < nums.size(); i++) {
        if (nums[i] < 0) {
            swap(maxProd, minProd);
        }
        
        maxProd = max(nums[i], maxProd * nums[i]);
        minProd = min(nums[i], minProd * nums[i]);
        result = max(result, maxProd);
    }
    
    return result;
}
```

<!-- slide -->
```java
public int maxProductSubarray(int[] nums) {
    if (nums == null || nums.length == 0) {
        return 0;
    }
    
    int maxProd = nums[0];
    int minProd = nums[0];
    int result = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] < 0) {
            int temp = maxProd;
            maxProd = minProd;
            minProd = temp;
        }
        
        maxProd = Math.max(nums[i], maxProd * nums[i]);
        minProd = Math.min(nums[i], minProd * nums[i]);
        result = Math.max(result, maxProd);
    }
    
    return result;
}
```

<!-- slide -->
```javascript
function maxProductSubarray(nums) {
    if (!nums || nums.length === 0) {
        return 0;
    }
    
    let maxProd = nums[0];
    let minProd = nums[0];
    let result = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] < 0) {
            [maxProd, minProd] = [minProd, maxProd];
        }
        
        maxProd = Math.max(nums[i], maxProd * nums[i]);
        minProd = Math.min(nums[i], minProd * nums[i]);
        result = Math.max(result, maxProd);
    }
    
    return result;
}
```
````

### 2. Maximum Sum Circular Subarray

Find the maximum sum in a circular array (subarray can wrap around the end).

````carousel
```python
def max_circular_sum(nums: list[int]) -> int:
    """
    Find maximum sum in circular array.
    
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0
    
    # Kadane's for normal maximum subarray
    max_normal = nums[0]
    max_current = nums[0]
    for i in range(1, len(nums)):
        max_current = max(nums[i], max_current + nums[i])
        max_normal = max(max_normal, max_current)
    
    # If all numbers are negative, return normal max
    if max_normal < 0:
        return max_normal
    
    # Find minimum subarray (invert the array)
    min_normal = nums[0]
    min_current = nums[0]
    total = nums[0]
    for i in range(1, len(nums)):
        min_current = min(nums[i], min_current + nums[i])
        min_normal = min(min_normal, min_current)
        total += nums[i]
    
    # Maximum circular = total - minimum subarray
    return max(max_normal, total - min_normal)
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

int maxCircularSum(const vector<int>& nums) {
    if (nums.empty()) return 0;
    
    int maxNormal = nums[0], maxCurrent = nums[0];
    int minNormal = nums[0], minCurrent = nums[0];
    int total = nums[0];
    
    for (size_t i = 1; i < nums.size(); i++) {
        maxCurrent = max(nums[i], maxCurrent + nums[i]);
        maxNormal = max(maxNormal, maxCurrent);
        
        minCurrent = min(nums[i], minCurrent + nums[i]);
        minNormal = min(minNormal, minCurrent);
        
        total += nums[i];
    }
    
    if (maxNormal < 0) return maxNormal;
    
    return max(maxNormal, total - minNormal);
}
```

<!-- slide -->
```java
public int maxCircularSum(int[] nums) {
    if (nums == null || nums.length == 0) {
        return 0;
    }
    
    int maxNormal = nums[0], maxCurrent = nums[0];
    int minNormal = nums[0], minCurrent = nums[0];
    int total = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        maxCurrent = Math.max(nums[i], maxCurrent + nums[i]);
        maxNormal = Math.max(maxNormal, maxCurrent);
        
        minCurrent = Math.min(nums[i], minCurrent + nums[i]);
        minNormal = Math.min(minNormal, minCurrent);
        
        total += nums[i];
    }
    
    if (maxNormal < 0) return maxNormal;
    
    return Math.max(maxNormal, total - minNormal);
}
```

<!-- slide -->
```javascript
function maxCircularSum(nums) {
    if (!nums || nums.length === 0) {
        return 0;
    }
    
    let maxNormal = nums[0], maxCurrent = nums[0];
    let minNormal = nums[0], minCurrent = nums[0];
    let total = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        maxCurrent = Math.max(nums[i], maxCurrent + nums[i]);
        maxNormal = Math.max(maxNormal, maxCurrent);
        
        minCurrent = Math.min(nums[i], minCurrent + nums[i]);
        minNormal = Math.min(minNormal, minCurrent);
        
        total += nums[i];
    }
    
    if (maxNormal < 0) return maxNormal;
    
    return Math.max(maxNormal, total - minNormal);
}
```
````

### 3. Maximum Average Subarray

Find subarray with maximum average (length >= k).

````carousel
```python
def max_average(nums: list[int], k: int) -> float:
    """
    Find maximum average of any contiguous subarray of length k.
    
    Time: O(n)
    Space: O(1)
    """
    # Calculate sum of first k elements
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    # Slide the window
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum / k
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

double maxAverage(const vector<int>& nums, int k) {
    long long windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    
    long long maxSum = windowSum;
    
    for (size_t i = k; i < nums.size(); i++) {
        windowSum += nums[i] - nums[i - k];
        maxSum = max(maxSum, windowSum);
    }
    
    return static_cast<double>(maxSum) / k;
}
```

<!-- slide -->
```java
public double maxAverage(int[] nums, int k) {
    long windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    
    long maxSum = windowSum;
    
    for (int i = k; i < nums.length; i++) {
        windowSum += nums[i] - nums[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return (double) maxSum / k;
}
```

<!-- slide -->
```javascript
function maxAverage(nums, k) {
    let windowSum = 0;
    for (let i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    
    let maxSum = windowSum;
    
    for (let i = k; i < nums.length; i++) {
        windowSum += nums[i] - nums[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum / k;
}
```
````

### 4. Longest Subarray with Maximum Sum

Find the longest subarray with the maximum possible sum.

````carousel
```python
def longest_max_sum_subarray(nums: list[int]) -> tuple:
    """
    Find the longest subarray with maximum sum.
    
    Returns: (max_sum, length, start_index, end_index)
    """
    if not nums:
        return 0, 0, -1, -1
    
    max_sum = nums[0]
    max_len = 1
    max_start = max_end = 0
    
    current_sum = nums[0]
    current_len = 1
    current_start = 0
    
    for i in range(1, len(nums)):
        # Choose: extend or restart
        if nums[i] > current_sum + nums[i]:
            current_sum = nums[i]
            current_len = 1
            current_start = i
        else:
            current_sum += nums[i]
            current_len += 1
        
        # Update max if better or same but longer
        if current_sum > max_sum:
            max_sum = current_sum
            max_len = current_len
            max_start = current_start
            max_end = i
        elif current_sum == max_sum and current_len > max_len:
            max_len = current_len
            max_start = current_start
            max_end = i
    
    return max_sum, max_len, max_start, max_end
```

<!-- slide -->
```cpp
#include <vector>
#include <tuple>
using namespace std;

tuple<int, int, int, int> longestMaxSumSubarray(const vector<int>& nums) {
    if (nums.empty()) return {0, 0, -1, -1};
    
    int maxSum = nums[0], maxLen = 1, maxStart = 0, maxEnd = 0;
    int currentSum = nums[0], currentLen = 1, currentStart = 0;
    
    for (size_t i = 1; i < nums.size(); i++) {
        if (nums[i] > currentSum + nums[i]) {
            currentSum = nums[i];
            currentLen = 1;
            currentStart = i;
        } else {
            currentSum += nums[i];
            currentLen++;
        }
        
        if (currentSum > maxSum) {
            maxSum = currentSum;
            maxLen = currentLen;
            maxStart = currentStart;
            maxEnd = i;
        } else if (currentSum == maxSum && currentLen > maxLen) {
            maxLen = currentLen;
            maxStart = currentStart;
            maxEnd = i;
        }
    }
    
    return {maxSum, maxLen, maxStart, maxEnd};
}
```

<!-- slide -->
```java
public int[] longestMaxSumSubarray(int[] nums) {
    if (nums == null || nums.length == 0) {
        return new int[]{0, 0, -1, -1};
    }
    
    int maxSum = nums[0], maxLen = 1, maxStart = 0, maxEnd = 0;
    int currentSum = nums[0], currentLen = 1, currentStart = 0;
    
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] > currentSum + nums[i]) {
            currentSum = nums[i];
            currentLen = 1;
            currentStart = i;
        } else {
            currentSum += nums[i];
            currentLen++;
        }
        
        if (currentSum > maxSum) {
            maxSum = currentSum;
            maxLen = currentLen;
            maxStart = currentStart;
            maxEnd = i;
        } else if (currentSum == maxSum && currentLen > maxLen) {
            maxLen = currentLen;
            maxStart = currentStart;
            maxEnd = i;
        }
    }
    
    return new int[]{maxSum, maxLen, maxStart, maxEnd};
}
```

<!-- slide -->
```javascript
function longestMaxSumSubarray(nums) {
    if (!nums || nums.length === 0) {
        return { maxSum: 0, maxLen: 0, maxStart: -1, maxEnd: -1 };
    }
    
    let maxSum = nums[0], maxLen = 1, maxStart = 0, maxEnd = 0;
    let currentSum = nums[0], currentLen = 1, currentStart = 0;
    
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] > currentSum + nums[i]) {
            currentSum = nums[i];
            currentLen = 1;
            currentStart = i;
        } else {
            currentSum += nums[i];
            currentLen++;
        }
        
        if (currentSum > maxSum) {
            maxSum = currentSum;
            maxLen = currentLen;
            maxStart = currentStart;
            maxEnd = i;
        } else if (currentSum === maxSum && currentLen > maxLen) {
            maxLen = currentLen;
            maxStart = currentStart;
            maxEnd = i;
        }
    }
    
    return { maxSum, maxLen, maxStart, maxEnd };
}
```
````

---

## Practice Problems

### Problem 1: Maximum Subarray

**Problem:** [LeetCode 53 - Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)

**Description:** Given an integer array `nums`, find the subarray with the largest sum and return its sum.

**How to Apply Kadane's Algorithm:**
- This is the classic application of Kadane's algorithm
- The greedy approach: at each position, decide whether to extend or start fresh
- Track `maxCurrent` and `maxGlobal` throughout the iteration

---

### Problem 2: Maximum Product Subarray

**Problem:** [LeetCode 152 - Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/)

**Description:** Given an integer array `nums`, find the subarray with the largest product and return that product.

**How to Apply Kadane's Variation:**
- Need to track both maximum AND minimum at each step
- When encountering a negative number, max and min swap roles
- Reason: negative × negative = positive can become the new maximum

---

### Problem 3: Maximum Sum Circular Subarray

**Problem:** [LeetCode 918 - Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray/)

**Description:** Given a circular integer array `nums`, return the maximum possible sum of a non-empty subarray of `nums`.

**How to Apply Kadane's Variation:**
- Two cases: maximum subarray is normal (doesn't wrap) OR wraps around
- Use Kadane's for normal case
- For wrapped case: `total_sum - minimum_subarray`
- Answer = max(normal_max, total_sum - normal_min), unless all numbers are negative

---

### Problem 4: Best Time to Buy and Sell Stock

**Problem:** [LeetCode 121 - Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)

**Description:** Given an array `prices` where `prices[i]` is the price of a stock on day `i`, find the maximum profit you can achieve.

**How to Apply Kadane's Algorithm:**
- Transform to finding maximum difference where buy comes before sell
- Equivalent to: max(prices[j] - prices[i]) where j > i
- Can be solved by tracking minimum price seen so far and maximum profit
- Similar greedy approach: at each day, best profit = max(current profit, price - min price so far)

---

### Problem 5: Maximum Average Subarray I

**Problem:** [LeetCode 643 - Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/)

**Description:** Given an integer array `nums` and an integer `k`, find the subarray of length `k` with the maximum average.

**How to Apply Kadane's Algorithm:**
- Fixed sliding window of size k
- Use Kadane's approach to find maximum sum of any k-length window
- Result = max_sum / k

---

## Video Tutorial Links

### Fundamentals

- [Kadane's Algorithm - Maximum Subarray (Take U Forward)](https://www.youtube.com/watch?v=2F4r0N2u4vU) - Comprehensive introduction
- [Kadane's Algorithm Explained (NeetCode)](https://www.youtube.com/watch?v=2W2y2X8X7Qw) - Detailed explanation with examples
- [Maximum Subarray Problem (WilliamFiset)](https://www.youtube.com/watch?v=zb72gK9jGNY) - Visual explanation

### Variations

- [Maximum Product Subarray (NeetCode)](https://www.youtube.com/watch?v=xuoQq4f3-Js) - Handling negative numbers
- [Circular Maximum Subarray](https://www.youtube.com/watch?v=v0dJ4x4Y4cM) - Wrapping around edge case
- [Best Time to Buy and Sell Stock](https://www.youtube.com/watch?v=1mx0t6IlNWY) - Stock profit problem

---

## Follow-up Questions

### Q1: Why does Kadane's Algorithm work? What is the mathematical proof?

**Answer:** The proof relies on the following observation:
- Let `S[i]` be the maximum sum subarray ending at index `i`
- If `S[i-1] < 0`, then any subarray ending at `i` that includes elements up to `i-1` will have a smaller sum than just `[nums[i]]`
- Therefore, the optimal subarray ending at `i` either:
  1. Is just `[nums[i]]` (starting fresh), or
  2. Extends the optimal subarray ending at `i-1` (if `S[i-1] >= 0`)
- This gives us the recurrence: `S[i] = max(nums[i], S[i-1] + nums[i])`
- By induction, this produces the global maximum.

### Q2: How do you handle an empty array or all negative numbers?

**Answer:**
- **Empty array**: Return 0 or appropriate sentinel value
- **All negative**: Return the largest (least negative) single element, not 0
- This is because Kadane's correctly handles this case: `max(nums[i], maxCurrent + nums[i])` will always pick the single element when all numbers are negative

### Q3: Can Kadane's Algorithm be modified to find the minimum subarray sum?

**Answer:** Yes! Simply negate the array first, find maximum subarray, then negate back:
- `min_sum = -max_subarray([-x for x in nums])`
- Alternatively, just change `max` to `min` in the recurrence

### Q4: How would you modify Kadane's to find the subarray with maximum sum AND minimum length?

**Answer:**
- Track both sum and length at each step
- When finding a new maximum sum, update the indices
- When finding an equal sum but with shorter length, also update
- The greedy approach still works because we're making optimal local decisions

### Q5: What is the difference between Kadane's and the divide-and-conquer approach?

**Answer:**
- **Kadane's**: O(n) time, O(1) space - single pass, greedy
- **Divide and Conquer**: O(n log n) time - divide array in half, combine results
- Divide and conquer can find both min and max subarrays simultaneously
- In practice, Kadane's is preferred for this specific problem

---

## Summary

Kadane's Algorithm is the **optimal solution** for finding the maximum sum of a contiguous subarray. Key takeaways:

- **Single pass O(n)**: Much faster than brute force O(n²) or O(n³)
- **O(1) space**: Only needs a few variables
- **Greedy choice**: At each step, either extend or start fresh - this local optimal leads to global optimal
- **Versatile**: Can be adapted for variations (product, circular, etc.)

When to use:
- ✅ Finding maximum contiguous subarray sum
- ✅ Maximum product subarray (with tracking min and max)
- ✅ Circular array maximum (with inversion trick)
- ✅ Fixed window maximum average
- ❌ Non-contiguous subarrays (use different approach)
- ❌ Subarrays with constraints beyond sum (need DP)

This algorithm is a fundamental technique in competitive programming and technical interviews, often serving as a building block for more complex dynamic programming problems.

---

## Related Algorithms

- [Sliding Window](./sliding-window-fixed-size-subarray-calculation.md) - Similar linear pass techniques
- [Dynamic Programming](./dp-1d-array-kadane-s-algorithm-for-max-min-subarray.md) - DP formulation of the problem
- [Prefix Sum](./prefix-sum.md) - For range sum queries
- [Binary Lifting](./binary-lifting.md) - Advanced queries on arrays
