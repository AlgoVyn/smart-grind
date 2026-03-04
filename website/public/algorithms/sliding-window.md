# Sliding Window

## Category
Arrays & Strings

## Description

The Sliding Window technique is used to perform operations on a specific window size of an array or string. It's particularly efficient for problems requiring **O(n)** time complexity instead of **O(n×k)** for nested loops. The technique maintains a "window" that slides through the data structure, adding new elements to one end and removing old elements from the other as it moves.

This pattern is fundamental in competitive programming and technical interviews for solving a wide range of array and string problems efficiently.

---

## When to Use

Use the Sliding Window algorithm when you need to solve problems involving:

- **Subarray/Substring Problems**: Finding patterns, maximums, minimums, or sums within contiguous elements
- **Efficient Traversal**: When you need to process all elements but want to avoid redundant computations
- **Two-Pointer Scenarios**: When you need to maintain a range/interval that expands or contracts
- **String Matching**: Finding anagrams, substrings, or patterns in strings

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|----------------|-------------------|---------------|
| **Sliding Window** | O(n) | O(k) or O(1) | Fixed/variable size windows, O(n) traversal |
| **Brute Force** | O(n×k) | O(1) | Small inputs, simple problems |
| **Prefix Sum + Window** | O(n) | O(n) | When you need random access to sums |
| **Two Pointers** | O(n) | O(1) | Sorted arrays, when direction changes |

### When to Choose Sliding Window vs Other Approaches

- **Choose Sliding Window** when:
  - You're processing consecutive elements (subarrays/substrings)
  - Window size is given or can be determined
  - You need O(n) instead of O(n×k) complexity
  - Problem involves max/min/sum within each window

- **Choose Two Pointers** when:
  - Arrays are sorted
  - You need to find pairs/subsets that satisfy conditions
  - Direction can change based on conditions

- **Choose Brute Force** when:
  - Input size is very small
  - Problem is simple and complexity doesn't matter

---

## Algorithm Explanation

### Core Concept

The key insight behind Sliding Window is that instead of recalculating results from scratch for each window position, we can **update the result incrementally** by:
1. **Removing** the leftmost element that just left the window
2. **Adding** the new element that just entered the window

This transforms O(n×k) operations into O(n) by reusing computations.

### How It Works

#### Fixed Window Size:
1. Initialize window with first k elements
2. Process the current window (calculate sum, find max/min, etc.)
3. Slide the window one step at a time:
   - Subtract the element leaving the window
   - Add the new element entering the window
4. Repeat until all elements are processed

#### Variable Window Size:
1. Expand the window by moving the right pointer
2. Shrink the window from the left when conditions are met
3. Track the best result during expansion/shrinking
4. Continue until the right pointer reaches the end

### Visual Representation

For array `[1, 3, -1, -3, 5, 3, 6, 7]` with window size k=3:

```
Window slides through array:
Index:  0   1   2   3   4   5   6   7
Array: [1,  3, -1, -3,  5,  3,  6,  7]

Window [0-2]: [1,  3, -1] → max = 3
   ↓ slide
Window [1-3]: [3, -1, -3] → max = 3
   ↓ slide
Window [2-4]: [-1, -3, 5] → max = 5
   ↓ slide
Window [3-5]: [-3, 5,  3] → max = 5
   ↓ slide
Window [4-6]: [5,  3,  6] → max = 6
   ↓ slide
Window [5-7]: [3,  6,  7] → max = 7
```

### Why It Works

- **No redundant calculations**: Each element is added and removed at most once
- **Linear time**: Each element is processed O(1) times
- **Optimal for stream processing**: Works great for data streams or large files

### Limitations

- **Only works for contiguous elements**: Cannot skip elements within the window
- **Window size constraints**: Some problems require specific window sizes
- **State-dependent problems**: Some variations require careful state management

---

## Algorithm Steps

### Fixed Window Size - Maximum Sum

1. **Initialize**: Calculate sum of first k elements (first window)
2. **Record**: Store this sum as maximum
3. **Slide**: For each remaining position i from k to n-1:
   - Subtract `nums[i - k]` (element leaving window)
   - Add `nums[i]` (element entering window)
   - Update maximum if current sum is larger
4. **Return**: Maximum sum found

### Fixed Window - Maximum/Minimum (Using Deque)

1. **Initialize**: Create an empty deque to store indices
2. **Iterate**: Process each element:
   - Remove indices from front that are outside current window
   - Remove indices from back that have smaller (for max) / larger (for min) values
   - Add current index to back
   - Once i >= k-1, the front of deque is the answer for this window
3. **Return**: All window maximums/minimums

### Variable Window Size - Longest Substring

1. **Initialize**: Two pointers (left=0, right=0), hashmap for character counts
2. **Expand**: Move right pointer, add character to window
3. **Shrink**: While window violates condition, move left pointer
4. **Update**: Track best result when condition is valid
5. **Repeat**: Until right reaches end

---

## Implementation

### Template Code (Fixed Window - Maximum Sum)

````carousel
```python
from collections import deque
from typing import List, Optional

def max_sliding_window(nums: List[int], k: int) -> List[int]:
    """
    Find the maximum value in each sliding window of size k.
    
    Args:
        nums: Input array
        k: Window size
        
    Returns:
        List of maximum values for each window
        
    Time: O(n)
    Space: O(k) for deque storage
    """
    if not nums or k == 0:
        return []
    
    if k == 1:
        return nums[:]
    
    # Deque stores indices, maintains decreasing order of values
    # Front always contains the index of maximum element
    deque_ = []
    result = []
    
    for i, num in enumerate(nums):
        # Remove indices that are out of the current window
        while deque_ and deque_[0] < i - k + 1:
            deque_.pop(0)
        
        # Remove indices whose values are less than current element
        # They can never be the maximum in any window containing current
        while deque_ and nums[deque_[-1]] < num:
            deque_.pop()
        
        # Add current index
        deque_.append(i)
        
        # Once we have processed at least k elements, record the max
        if i >= k - 1:
            result.append(nums[deque_[0]])
    
    return result


def min_sliding_window(nums: List[int], k: int) -> List[int]:
    """
    Find the minimum value in each sliding window of size k.
    
    Time: O(n)
    Space: O(k) for deque storage
    """
    if not nums or k == 0:
        return []
    
    if k == 1:
        return nums[:]
    
    deque_ = []
    result = []
    
    for i, num in enumerate(nums):
        # Remove indices outside current window
        while deque_ and deque_[0] < i - k + 1:
            deque_.pop(0)
        
        # Remove indices with values greater than current
        # They can never be the minimum in any window containing current
        while deque_ and nums[deque_[-1]] > num:
            deque_.pop()
        
        deque_.append(i)
        
        if i >= k - 1:
            result.append(nums[deque_[0]])
    
    return result


def max_sum_subarray(nums: List[int], k: int) -> int:
    """
    Find maximum sum of any contiguous subarray of size k.
    
    Time: O(n)
    Space: O(1)
    """
    if not nums or len(nums) < k:
        return 0
    
    # Calculate sum of first window
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    # Slide the window: subtract element leaving, add element entering
    for i in range(k, len(nums)):
        window_sum = window_sum - nums[i - k] + nums[i]
        max_sum = max(max_sum, window_sum)
    
    return max_sum


def min_sum_subarray(nums: List[int], k: int) -> int:
    """
    Find minimum sum of any contiguous subarray of size k.
    
    Time: O(n)
    Space: O(1)
    """
    if not nums or len(nums) < k:
        return 0
    
    window_sum = sum(nums[:k])
    min_sum = window_sum
    
    for i in range(k, len(nums)):
        window_sum = window_sum - nums[i - k] + nums[i]
        min_sum = min(min_sum, window_sum)
    
    return min_sum


def average_of_subarray(nums: List[int], k: int) -> List[float]:
    """
    Find moving average of all windows of size k.
    
    Time: O(n)
    Space: O(1) excluding output
    """
    if not nums or k == 0:
        return []
    
    window_sum = sum(nums[:k])
    result = [window_sum / k]
    
    for i in range(k, len(nums)):
        window_sum = window_sum - nums[i - k] + nums[i]
        result.append(window_sum / k)
    
    return result


# Example usage and demonstration
if __name__ == "__main__":
    nums = [1, 3, -1, -3, 5, 3, 6, 7]
    k = 3
    
    print(f"Array: {nums}")
    print(f"Window size: {k}")
    print()
    
    print(f"Max sliding window: {max_sliding_window(nums, k)}")
    print(f"Min sliding window: {min_sliding_window(nums, k)}")
    print(f"Max sum subarray of size {k}: {max_sum_subarray(nums, k)}")
    print(f"Min sum subarray of size {k}: {min_sum_subarray(nums, k)}")
    print(f"Average of each window: {average_of_subarray(nums, k)}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <deque>
#include <algorithm>
#include <climits>
using namespace std;

/**
 * Sliding Window implementations for various use cases.
 * 
 * Time Complexities:
 *     - max_sliding_window: O(n)
 *     - min_sliding_window: O(n)
 *     - max_sum_subarray: O(n)
 * 
 * Space Complexities:
 *     - max/min sliding window: O(k)
 *     - max/min sum subarray: O(1)
 */

/**
 * Find maximum value in each sliding window of size k.
 * Uses monotonic decreasing deque.
 * 
 * Time: O(n)
 * Space: O(k)
 */
vector<int> maxSlidingWindow(const vector<int>& nums, int k) {
    if (nums.empty() || k == 0) return {};
    if (k == 1) return nums;
    
    deque<int> deque_;  // Stores indices
    vector<int> result;
    
    for (int i = 0; i < nums.size(); i++) {
        // Remove indices outside current window
        while (!deque_.empty() && deque_.front() < i - k + 1) {
            deque_.pop_front();
        }
        
        // Remove indices with smaller values (they can't be max)
        while (!deque_.empty() && nums[deque_.back()] < nums[i]) {
            deque_.pop_back();
        }
        
        // Add current index
        deque_.push_back(i);
        
        // Record maximum once we have a full window
        if (i >= k - 1) {
            result.push_back(nums[deque_.front()]);
        }
    }
    
    return result;
}

/**
 * Find minimum value in each sliding window of size k.
 * Uses monotonic increasing deque.
 * 
 * Time: O(n)
 * Space: O(k)
 */
vector<int> minSlidingWindow(const vector<int>& nums, int k) {
    if (nums.empty() || k == 0) return {};
    if (k == 1) return nums;
    
    deque<int> deque_;
    vector<int> result;
    
    for (int i = 0; i < nums.size(); i++) {
        // Remove indices outside current window
        while (!deque_.empty() && deque_.front() < i - k + 1) {
            deque_.pop_front();
        }
        
        // Remove indices with larger values (they can't be min)
        while (!deque_.empty() && nums[deque_.back()] > nums[i]) {
            deque_.pop_back();
        }
        
        deque_.push_back(i);
        
        if (i >= k - 1) {
            result.push_back(nums[deque_.front()]);
        }
    }
    
    return result;
}

/**
 * Find maximum sum of any contiguous subarray of size k.
 * 
 * Time: O(n)
 * Space: O(1)
 */
int maxSumSubarray(const vector<int>& nums, int k) {
    if (nums.empty() || nums.size() < k) return 0;
    
    // Calculate sum of first window
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    
    int maxSum = windowSum;
    
    // Slide the window
    for (int i = k; i < nums.size(); i++) {
        windowSum = windowSum - nums[i - k] + nums[i];
        maxSum = max(maxSum, windowSum);
    }
    
    return maxSum;
}

/**
 * Find minimum sum of any contiguous subarray of size k.
 * 
 * Time: O(n)
 * Space: O(1)
 */
int minSumSubarray(const vector<int>& nums, int k) {
    if (nums.empty() || nums.size() < k) return 0;
    
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    
    int minSum = windowSum;
    
    for (int i = k; i < nums.size(); i++) {
        windowSum = windowSum - nums[i - k] + nums[i];
        minSum = min(minSum, windowSum);
    }
    
    return minSum;
}

/**
 * Calculate moving average of all windows of size k.
 * 
 * Time: O(n)
 * Space: O(1) excluding output
 */
vector<double> averageOfSubarray(const vector<int>& nums, int k) {
    if (nums.empty() || k == 0) return {};
    
    double windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    
    vector<double> result;
    result.push_back(windowSum / k);
    
    for (int i = k; i < nums.size(); i++) {
        windowSum = windowSum - nums[i - k] + nums[i];
        result.push_back(windowSum / k);
    }
    
    return result;
}


int main() {
    vector<int> nums = {1, 3, -1, -3, 5, 3, 6, 7};
    int k = 3;
    
    cout << "Array: ";
    for (int x : nums) cout << x << " ";
    cout << endl;
    cout << "Window size: " << k << endl << endl;
    
    cout << "Max sliding window: ";
    for (int x : maxSlidingWindow(nums, k)) cout << x << " ";
    cout << endl;
    
    cout << "Min sliding window: ";
    for (int x : minSlidingWindow(nums, k)) cout << x << " ";
    cout << endl;
    
    cout << "Max sum subarray of size " << k << ": " << maxSumSubarray(nums, k) << endl;
    cout << "Min sum subarray of size " << k << ": " << minSumSubarray(nums, k) << endl;
    
    cout << "Average of each window: ";
    for (double x : averageOfSubarray(nums, k)) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Sliding Window implementations for various use cases.
 * 
 * Time Complexities:
 *     - maxSlidingWindow: O(n)
 *     - minSlidingWindow: O(n)
 *     - maxSumSubarray: O(n)
 * 
 * Space Complexities:
 *     - max/min sliding window: O(k)
 *     - max/min sum subarray: O(1)
 */
public class SlidingWindow {
    
    /**
     * Find maximum value in each sliding window of size k.
     * Uses monotonic decreasing deque.
     * 
     * Time: O(n)
     * Space: O(k)
     */
    public static List<Integer> maxSlidingWindow(int[] nums, int k) {
        if (nums == null || nums.length == 0 || k == 0) {
            return new ArrayList<>();
        }
        
        if (k == 1) {
            List<Integer> result = new ArrayList<>();
            for (int num : nums) result.add(num);
            return result;
        }
        
        Deque<Integer> deque = new ArrayDeque<>();
        List<Integer> result = new ArrayList<>();
        
        for (int i = 0; i < nums.length; i++) {
            // Remove indices outside current window
            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
                deque.pollFirst();
            }
            
            // Remove indices with smaller values (they can't be max)
            while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
                deque.pollLast();
            }
            
            // Add current index
            deque.addLast(i);
            
            // Record maximum once we have a full window
            if (i >= k - 1) {
                result.add(nums[deque.peekFirst()]);
            }
        }
        
        return result;
    }
    
    /**
     * Find minimum value in each sliding window of size k.
     * Uses monotonic increasing deque.
     * 
     * Time: O(n)
     * Space: O(k)
     */
    public static List<Integer> minSlidingWindow(int[] nums, int k) {
        if (nums == null || nums.length == 0 || k == 0) {
            return new ArrayList<>();
        }
        
        if (k == 1) {
            List<Integer> result = new ArrayList<>();
            for (int num : nums) result.add(num);
            return result;
        }
        
        Deque<Integer> deque = new ArrayDeque<>();
        List<Integer> result = new ArrayList<>();
        
        for (int i = 0; i < nums.length; i++) {
            // Remove indices outside current window
            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
                deque.pollFirst();
            }
            
            // Remove indices with larger values (they can't be min)
            while (!deque.isEmpty() && nums[deque.peekLast()] > nums[i]) {
                deque.pollLast();
            }
            
            deque.addLast(i);
            
            if (i >= k - 1) {
                result.add(nums[deque.peekFirst()]);
            }
        }
        
        return result;
    }
    
    /**
     * Find maximum sum of any contiguous subarray of size k.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public static int maxSumSubarray(int[] nums, int k) {
        if (nums == null || nums.length < k) {
            return 0;
        }
        
        // Calculate sum of first window
        int windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += nums[i];
        }
        
        int maxSum = windowSum;
        
        // Slide the window
        for (int i = k; i < nums.length; i++) {
            windowSum = windowSum - nums[i - k] + nums[i];
            maxSum = Math.max(maxSum, windowSum);
        }
        
        return maxSum;
    }
    
    /**
     * Find minimum sum of any contiguous subarray of size k.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public static int minSumSubarray(int[] nums, int k) {
        if (nums == null || nums.length < k) {
            return 0;
        }
        
        int windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += nums[i];
        }
        
        int minSum = windowSum;
        
        for (int i = k; i < nums.length; i++) {
            windowSum = windowSum - nums[i - k] + nums[i];
            minSum = Math.min(minSum, windowSum);
        }
        
        return minSum;
    }
    
    /**
     * Calculate moving average of all windows of size k.
     * 
     * Time: O(n)
     * Space: O(1) excluding output
     */
    public static double[] averageOfSubarray(int[] nums, int k) {
        if (nums == null || nums.length == 0 || k == 0) {
            return new double[0];
        }
        
        double windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += nums[i];
        }
        
        double[] result = new double[nums.length - k + 1];
        result[0] = windowSum / k;
        
        for (int i = k; i < nums.length; i++) {
            windowSum = windowSum - nums[i - k] + nums[i];
            result[i - k + 1] = windowSum / k;
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        int[] nums = {1, 3, -1, -3, 5, 3, 6, 7};
        int k = 3;
        
        System.out.print("Array: ");
        System.out.println(Arrays.toString(nums));
        System.out.println("Window size: " + k);
        System.out.println();
        
        System.out.print("Max sliding window: ");
        System.out.println(maxSlidingWindow(nums, k));
        
        System.out.print("Min sliding window: ");
        System.out.println(minSlidingWindow(nums, k));
        
        System.out.println("Max sum subarray of size " + k + ": " + maxSumSubarray(nums, k));
        System.out.println("Min sum subarray of size " + k + ": " + minSumSubarray(nums, k));
        
        System.out.print("Average of each window: ");
        System.out.println(Arrays.toString(averageOfSubarray(nums, k)));
    }
}
```

<!-- slide -->
```javascript
/**
 * Sliding Window implementations for various use cases.
 * 
 * Time Complexities:
 *     - maxSlidingWindow: O(n)
 *     - minSlidingWindow: O(n)
 *     - maxSumSubarray: O(n)
 * 
 * Space Complexities:
 *     - max/min sliding window: O(k)
 *     - max/min sum subarray: O(1)
 */

/**
 * Find maximum value in each sliding window of size k.
 * Uses monotonic decreasing deque.
 * @param {number[]} nums - Input array
 * @param {number} k - Window size
 * @returns {number[]} Array of maximum values for each window
 * 
 * Time: O(n)
 * Space: O(k)
 */
function maxSlidingWindow(nums, k) {
    if (!nums || nums.length === 0 || k === 0) return [];
    if (k === 1) return [...nums];
    
    const deque = [];  // Stores indices
    const result = [];
    
    for (let i = 0; i < nums.length; i++) {
        // Remove indices outside current window
        while (deque.length > 0 && deque[0] < i - k + 1) {
            deque.shift();
        }
        
        // Remove indices with smaller values (they can't be max)
        while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
            deque.pop();
        }
        
        // Add current index
        deque.push(i);
        
        // Record maximum once we have a full window
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    
    return result;
}

/**
 * Find minimum value in each sliding window of size k.
 * Uses monotonic increasing deque.
 * @param {number[]} nums - Input array
 * @param {number} k - Window size
 * @returns {number[]} Array of minimum values for each window
 * 
 * Time: O(n)
 * Space: O(k)
 */
function minSlidingWindow(nums, k) {
    if (!nums || nums.length === 0 || k === 0) return [];
    if (k === 1) return [...nums];
    
    const deque = [];
    const result = [];
    
    for (let i = 0; i < nums.length; i++) {
        // Remove indices outside current window
        while (deque.length > 0 && deque[0] < i - k + 1) {
            deque.shift();
        }
        
        // Remove indices with larger values (they can't be min)
        while (deque.length > 0 && nums[deque[deque.length - 1]] > nums[i]) {
            deque.pop();
        }
        
        deque.push(i);
        
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    
    return result;
}

/**
 * Find maximum sum of any contiguous subarray of size k.
 * @param {number[]} nums - Input array
 * @param {number} k - Window size
 * @returns {number} Maximum sum of any subarray of size k
 * 
 * Time: O(n)
 * Space: O(1)
 */
function maxSumSubarray(nums, k) {
    if (!nums || nums.length < k) return 0;
    
    // Calculate sum of first window
    let windowSum = nums.slice(0, k).reduce((a, b) => a + b, 0);
    let maxSum = windowSum;
    
    // Slide the window
    for (let i = k; i < nums.length; i++) {
        windowSum = windowSum - nums[i - k] + nums[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}

/**
 * Find minimum sum of any contiguous subarray of size k.
 * @param {number[]} nums - Input array
 * @param {number} k - Window size
 * @returns {number} Minimum sum of any subarray of size k
 * 
 * Time: O(n)
 * Space: O(1)
 */
function minSumSubarray(nums, k) {
    if (!nums || nums.length < k) return 0;
    
    let windowSum = nums.slice(0, k).reduce((a, b) => a + b, 0);
    let minSum = windowSum;
    
    for (let i = k; i < nums.length; i++) {
        windowSum = windowSum - nums[i - k] + nums[i];
        minSum = Math.min(minSum, windowSum);
    }
    
    return minSum;
}

/**
 * Calculate moving average of all windows of size k.
 * @param {number[]} nums - Input array
 * @param {number} k - Window size
 * @returns {number[]} Array of moving averages
 * 
 * Time: O(n)
 * Space: O(1) excluding output
 */
function averageOfSubarray(nums, k) {
    if (!nums || nums.length === 0 || k === 0) return [];
    
    let windowSum = nums.slice(0, k).reduce((a, b) => a + b, 0);
    const result = [windowSum / k];
    
    for (let i = k; i < nums.length; i++) {
        windowSum = windowSum - nums[i - k] + nums[i];
        result.push(windowSum / k);
    }
    
    return result;
}


// Example usage and demonstration
const nums = [1, 3, -1, -3, 5, 3, 6, 7];
const k = 3;

console.log(`Array: [${nums.join(', ')}]`);
console.log(`Window size: ${k}`);
console.log();

console.log(`Max sliding window: [${maxSlidingWindow(nums, k).join(', ')}]`);
console.log(`Min sliding window: [${minSlidingWindow(nums, k).join(', ')}]`);
console.log(`Max sum subarray of size ${k}: ${maxSumSubarray(nums, k)}`);
console.log(`Min sum subarray of size ${k}: ${minSumSubarray(nums, k)}`);
console.log(`Average of each window: [${averageOfSubarray(nums, k).join(', ')}]`);
```
````

---

### Variable Window - Longest Substring (Template Code)

````carousel
```python
from collections import defaultdict
from typing import Dict, Set, Tuple

def length_of_longest_substring(s: str) -> int:
    """
    Find length of longest substring without repeating characters.
    
    Time: O(n) where n = len(s)
    Space: O(min(m, n)) where m = size of character set
    """
    char_index: Dict[str, int] = {}
    max_length = 0
    left = 0
    
    for right, char in enumerate(s):
        # If char is in window, move left pointer past previous occurrence
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        
        # Update char's latest index
        char_index[char] = right
        
        # Update maximum length
        max_length = max(max_length, right - left + 1)
    
    return max_length


def count_anagrams(s: str, pattern: str) -> int:
    """
    Count number of anagram occurrences of pattern in string s.
    
    Time: O(n + m) where n = len(s), m = len(pattern)
    Space: O(m)
    """
    if len(pattern) > len(s):
        return 0
    
    pattern_count = defaultdict(int)
    window_count = defaultdict(int)
    
    # Count frequencies in pattern
    for char in pattern:
        pattern_count[char] += 1
    
    # Count frequencies in first window
    for i in range(len(pattern)):
        window_count[s[i]] += 1
    
    # Count matches
    matches = 1 if window_count == pattern_count else 0
    
    # Slide window
    for i in range(len(pattern), len(s)):
        # Add new character
        window_count[s[i]] += 1
        # Remove old character
        left_char = s[i - len(pattern)]
        window_count[left_char] -= 1
        if window_count[left_char] == 0:
            del window_count[left_char]
        
        # Check if anagram
        if window_count == pattern_count:
            matches += 1
    
    return matches


def min_subarray_length(target: int, nums: list) -> int:
    """
    Find minimal length of contiguous subarray with sum >= target.
    
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0
    
    left = 0
    current_sum = 0
    min_length = float('inf')
    
    for right in range(len(nums)):
        current_sum += nums[right]
        
        while current_sum >= target:
            min_length = min(min_length, right - left + 1)
            current_sum -= nums[left]
            left += 1
    
    return min_length if min_length != float('inf') else 0


def longest_substring_with_k_distinct(s: str, k: int) -> str:
    """
    Find longest substring with at most k distinct characters.
    
    Time: O(n)
    Space: O(k)
    """
    if k == 0 or not s:
        return ""
    
    char_count = defaultdict(int)
    left = 0
    max_length = 0
    result_start = 0
    
    for right, char in enumerate(s):
        char_count[char] += 1
        
        # Shrink window if we have more than k distinct chars
        while len(char_count) > k:
            char_count[s[left]] -= 1
            if char_count[s[left]] == 0:
                del char_count[s[left]]
            left += 1
        
        # Update longest substring
        if right - left + 1 > max_length:
            max_length = right - left + 1
            result_start = left
    
    return s[result_start:result_start + max_length]


# Example usage
if __name__ == "__main__":
    # Longest substring without repeating
    s = "abcabcbb"
    print(f"String: {s}")
    print(f"Longest substring length: {length_of_longest_substring(s)}")
    
    # Anagram count
    s = "cbaebabacb"
    p = "abc"
    print(f"\nString: {s}, Pattern: {p}")
    print(f"Anagram count: {count_anagrams(s, p)}")
    
    # Minimum subarray length
    target = 7
    nums = [2, 3, 1, 2, 4, 3]
    print(f"\nTarget: {target}, Array: {nums}")
    print(f"Minimum subarray length: {min_subarray_length(target, nums)}")
    
    # Longest substring with k distinct
    s = "eceba"
    k = 2
    print(f"\nString: {s}, k = {k}")
    print(f"Longest substring: {longest_substring_with_k_distinct(s, k)}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

/**
 * Variable Sliding Window implementations.
 * 
 * Time Complexities: O(n)
 * Space Complexities: O(min(m, n)) or O(k)
 */

/**
 * Find length of longest substring without repeating characters.
 * 
 * Time: O(n)
 * Space: O(min(m, n)) where m = character set size
 */
int lengthOfLongestSubstring(const string& s) {
    if (s.empty()) return 0;
    
    unordered_map<char, int> charIndex;
    int maxLength = 0;
    int left = 0;
    
    for (int right = 0; right < s.length(); right++) {
        // If char is in window, move left pointer past previous occurrence
        if (charIndex.find(s[right]) != charIndex.end() && 
            charIndex[s[right]] >= left) {
            left = charIndex[s[right]] + 1;
        }
        
        // Update char's latest index
        charIndex[s[right]] = right;
        
        // Update maximum length
        maxLength = max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

/**
 * Count number of anagram occurrences of pattern in string s.
 * 
 * Time: O(n + m)
 * Space: O(m)
 */
int countAnagrams(const string& s, const string& pattern) {
    if (pattern.length() > s.length()) return 0;
    
    unordered_map<char, int> patternCount, windowCount;
    
    // Count frequencies in pattern
    for (char c : pattern) {
        patternCount[c]++;
    }
    
    // Count frequencies in first window
    for (int i = 0; i < pattern.length(); i++) {
        windowCount[s[i]]++;
    }
    
    int matches = (windowCount == patternCount) ? 1 : 0;
    
    // Slide window
    for (int i = pattern.length(); i < s.length(); i++) {
        // Add new character
        windowCount[s[i]]++;
        // Remove old character
        char leftChar = s[i - pattern.length()];
        windowCount[leftChar]--;
        if (windowCount[leftChar] == 0) {
            windowCount.erase(leftChar);
        }
        
        // Check if anagram
        if (windowCount == patternCount) {
            matches++;
        }
    }
    
    return matches;
}

/**
 * Find minimal length of contiguous subarray with sum >= target.
 * 
 * Time: O(n)
 * Space: O(1)
 */
int minSubarrayLength(int target, const vector<int>& nums) {
    if (nums.empty()) return 0;
    
    int left = 0;
    int currentSum = 0;
    int minLength = INT_MAX;
    
    for (int right = 0; right < nums.size(); right++) {
        currentSum += nums[right];
        
        while (currentSum >= target) {
            minLength = min(minLength, right - left + 1);
            currentSum -= nums[left];
            left++;
        }
    }
    
    return minLength == INT_MAX ? 0 : minLength;
}

/**
 * Find longest substring with at most k distinct characters.
 * 
 * Time: O(n)
 * Space: O(k)
 */
string longestSubstringWithKDistinct(const string& s, int k) {
    if (k == 0 || s.empty()) return "";
    
    unordered_map<char, int> charCount;
    int left = 0;
    int maxLength = 0;
    int resultStart = 0;
    
    for (int right = 0; right < s.length(); right++) {
        charCount[s[right]]++;
        
        // Shrink window if we have more than k distinct chars
        while (charCount.size() > k) {
            charCount[s[left]]--;
            if (charCount[s[left]] == 0) {
                charCount.erase(s[left]);
            }
            left++;
        }
        
        // Update longest substring
        if (right - left + 1 > maxLength) {
            maxLength = right - left + 1;
            resultStart = left;
        }
    }
    
    return s.substr(resultStart, maxLength);
}


int main() {
    // Longest substring without repeating
    string s = "abcabcbb";
    cout << "String: " << s << endl;
    cout << "Longest substring length: " << lengthOfLongestSubstring(s) << endl;
    
    // Anagram count
    s = "cbaebabacb";
    string p = "abc";
    cout << "\nString: " << s << ", Pattern: " << p << endl;
    cout << "Anagram count: " << countAnagrams(s, p) << endl;
    
    // Minimum subarray length
    int target = 7;
    vector<int> nums = {2, 3, 1, 2, 4, 3};
    cout << "\nTarget: " << target << ", Array: [";
    for (int x : nums) cout << x << " ";
    cout << "]" << endl;
    cout << "Minimum subarray length: " << minSubarrayLength(target, nums) << endl;
    
    // Longest substring with k distinct
    s = "eceba";
    int k = 2;
    cout << "\nString: " << s << ", k = " << k << endl;
    cout << "Longest substring: " << longestSubstringWithKDistinct(s, k) << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Variable Sliding Window implementations.
 */
public class VariableSlidingWindow {
    
    /**
     * Find length of longest substring without repeating characters.
     * 
     * Time: O(n)
     * Space: O(min(m, n))
     */
    public static int lengthOfLongestSubstring(String s) {
        if (s == null || s.isEmpty()) return 0;
        
        Map<Character, Integer> charIndex = new HashMap<>();
        int maxLength = 0;
        int left = 0;
        
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            
            if (charIndex.containsKey(c) && charIndex.get(c) >= left) {
                left = charIndex.get(c) + 1;
            }
            
            charIndex.put(c, right);
            maxLength = Math.max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
    
    /**
     * Count number of anagram occurrences of pattern in string s.
     * 
     * Time: O(n + m)
     * Space: O(m)
     */
    public static int countAnagrams(String s, String pattern) {
        if (pattern.length() > s.length()) return 0;
        
        Map<Character, Integer> patternCount = new HashMap<>();
        Map<Character, Integer> windowCount = new HashMap<>();
        
        for (char c : pattern.toCharArray()) {
            patternCount.put(c, patternCount.getOrDefault(c, 0) + 1);
        }
        
        for (int i = 0; i < pattern.length(); i++) {
            char c = s.charAt(i);
            windowCount.put(c, windowCount.getOrDefault(c, 0) + 1);
        }
        
        int matches = windowCount.equals(patternCount) ? 1 : 0;
        
        for (int i = pattern.length(); i < s.length(); i++) {
            // Add new character
            char newChar = s.charAt(i);
            windowCount.put(newChar, windowCount.getOrDefault(newChar, 0) + 1);
            
            // Remove old character
            char oldChar = s.charAt(i - pattern.length());
            int count = windowCount.get(oldChar);
            if (count == 1) {
                windowCount.remove(oldChar);
            } else {
                windowCount.put(oldChar, count - 1);
            }
            
            if (windowCount.equals(patternCount)) {
                matches++;
            }
        }
        
        return matches;
    }
    
    /**
     * Find minimal length of contiguous subarray with sum >= target.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public static int minSubarrayLength(int target, int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        
        int left = 0;
        int currentSum = 0;
        int minLength = Integer.MAX_VALUE;
        
        for (int right = 0; right < nums.length; right++) {
            currentSum += nums[right];
            
            while (currentSum >= target) {
                minLength = Math.min(minLength, right - left + 1);
                currentSum -= nums[left];
                left++;
            }
        }
        
        return minLength == Integer.MAX_VALUE ? 0 : minLength;
    }
    
    /**
     * Find longest substring with at most k distinct characters.
     * 
     * Time: O(n)
     * Space: O(k)
     */
    public static String longestSubstringWithKDistinct(String s, int k) {
        if (s == null || k == 0 || s.isEmpty()) return "";
        
        Map<Character, Integer> charCount = new HashMap<>();
        int left = 0;
        int maxLength = 0;
        int resultStart = 0;
        
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            charCount.put(c, charCount.getOrDefault(c, 0) + 1);
            
            while (charCount.size() > k) {
                char leftChar = s.charAt(left);
                int count = charCount.get(leftChar);
                if (count == 1) {
                    charCount.remove(leftChar);
                } else {
                    charCount.put(leftChar, count - 1);
                }
                left++;
            }
            
            if (right - left + 1 > maxLength) {
                maxLength = right - left + 1;
                resultStart = left;
            }
        }
        
        return s.substring(resultStart, resultStart + maxLength);
    }
    
    public static void main(String[] args) {
        // Longest substring without repeating
        String s = "abcabcbb";
        System.out.println("String: " + s);
        System.out.println("Longest substring length: " + lengthOfLongestSubstring(s));
        
        // Anagram count
        s = "cbaebabacb";
        String p = "abc";
        System.out.println("\nString: " + s + ", Pattern: " + p);
        System.out.println("Anagram count: " + countAnagrams(s, p));
        
        // Minimum subarray length
        int target = 7;
        int[] nums = {2, 3, 1, 2, 4, 3};
        System.out.println("\nTarget: " + target + ", Array: " + Arrays.toString(nums));
        System.out.println("Minimum subarray length: " + minSubarrayLength(target, nums));
        
        // Longest substring with k distinct
        s = "eceba";
        k = 2;
        System.out.println("\nString: " + s + ", k = " + k);
        System.out.println("Longest substring: " + longestSubstringWithKDistinct(s, k));
    }
}
```

<!-- slide -->
```javascript
/**
 * Variable Sliding Window implementations.
 */

/**
 * Find length of longest substring without repeating characters.
 * @param {string} s - Input string
 * @returns {number} Length of longest substring without repeating chars
 * 
 * Time: O(n)
 * Space: O(min(m, n)) where m = character set size
 */
function lengthOfLongestSubstring(s) {
    if (!s) return 0;
    
    const charIndex = new Map();
    let maxLength = 0;
    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        
        if (charIndex.has(char) && charIndex.get(char) >= left) {
            left = charIndex.get(char) + 1;
        }
        
        charIndex.set(char, right);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

/**
 * Count number of anagram occurrences of pattern in string s.
 * @param {string} s - Input string
 * @param {string} pattern - Pattern to find anagrams of
 * @returns {number} Count of anagram occurrences
 * 
 * Time: O(n + m)
 * Space: O(m)
 */
function countAnagrams(s, pattern) {
    if (pattern.length > s.length) return 0;
    
    const patternCount = new Map();
    const windowCount = new Map();
    
    // Count frequencies in pattern
    for (const char of pattern) {
        patternCount.set(char, (patternCount.get(char) || 0) + 1);
    }
    
    // Count frequencies in first window
    for (let i = 0; i < pattern.length; i++) {
        windowCount.set(s[i], (windowCount.get(s[i]) || 0) + 1);
    }
    
    let matches = mapsEqual(windowCount, patternCount) ? 1 : 0;
    
    // Slide window
    for (let i = pattern.length; i < s.length; i++) {
        // Add new character
        windowCount.set(s[i], (windowCount.get(s[i]) || 0) + 1);
        
        // Remove old character
        const oldChar = s[i - pattern.length];
        const oldCount = windowCount.get(oldChar);
        if (oldCount === 1) {
            windowCount.delete(oldChar);
        } else {
            windowCount.set(oldChar, oldCount - 1);
        }
        
        if (mapsEqual(windowCount, patternCount)) {
            matches++;
        }
    }
    
    return matches;
}

function mapsEqual(map1, map2) {
    if (map1.size !== map2.size) return false;
    for (const [key, value] of map1) {
        if (map2.get(key) !== value) return false;
    }
    return true;
}

/**
 * Find minimal length of contiguous subarray with sum >= target.
 * @param {number} target - Target sum
 * @param {number[]} nums - Input array
 * @returns {number} Minimum length of subarray with sum >= target
 * 
 * Time: O(n)
 * Space: O(1)
 */
function minSubarrayLength(target, nums) {
    if (!nums || nums.length === 0) return 0;
    
    let left = 0;
    let currentSum = 0;
    let minLength = Infinity;
    
    for (let right = 0; right < nums.length; right++) {
        currentSum += nums[right];
        
        while (currentSum >= target) {
            minLength = Math.min(minLength, right - left + 1);
            currentSum -= nums[left];
            left++;
        }
    }
    
    return minLength === Infinity ? 0 : minLength;
}

/**
 * Find longest substring with at most k distinct characters.
 * @param {string} s - Input string
 * @param {number} k - Maximum number of distinct characters
 * @returns {string} Longest substring with at most k distinct characters
 * 
 * Time: O(n)
 * Space: O(k)
 */
function longestSubstringWithKDistinct(s, k) {
    if (!s || k === 0) return "";
    
    const charCount = new Map();
    let left = 0;
    let maxLength = 0;
    let resultStart = 0;
    
    for (let right = 0; right < s.length; right++) {
        charCount.set(s[right], (charCount.get(s[right]) || 0) + 1);
        
        while (charCount.size > k) {
            const leftChar = s[left];
            const count = charCount.get(leftChar);
            if (count === 1) {
                charCount.delete(leftChar);
            } else {
                charCount.set(leftChar, count - 1);
            }
            left++;
        }
        
        if (right - left + 1 > maxLength) {
            maxLength = right - left + 1;
            resultStart = left;
        }
    }
    
    return s.substring(resultStart, resultStart + maxLength);
}


// Example usage
console.log("Longest substring without repeating 'abcabcbb':", 
    lengthOfLongestSubstring("abcabcbb"));

console.log("Anagram count in 'cbaebabacb' for 'abc':", 
    countAnagrams("cbaebabacb", "abc"));

console.log("Minimum subarray length for target 7 in [2,3,1,2,4,3]:", 
    minSubarrayLength(7, [2, 3, 1, 2, 4, 3]));

console.log("Longest substring with 2 distinct in 'eceba':", 
    longestSubstringWithKDistinct("eceba", 2));
```
````

---

## Example

**Input:**
```python
nums = [1, 3, -1, -3, 5, 3, 6, 7]
k = 3
```

**Output:**
```
Array: [1, 3, -1, -3, 5, 3, 6, 7]
Window size: 3
Max sliding window: [3, 3, 5, 5, 6, 7]
Min sliding window: [-1, -3, -3, -3, 3, 3]
Max sum subarray of size 3: 16
```

**Step-by-step for maximum:**
| Window | Elements | Max |
|--------|----------|-----|
| [0,2] | [1, 3, -1] | 3 |
| [1,3] | [3, -1, -3] | 3 |
| [2,4] | [-1, -3, 5] | 5 |
| [3,5] | [-3, 5, 3] | 5 |
| [4,6] | [5, 3, 6] | 6 |
| [5,7] | [3, 6, 7] | 7 |

**Explanation:**
- We maintain a monotonic decreasing deque
- For each new element, we remove smaller elements from the back (they can never be max)
- We remove elements from front that are outside the window
- The front of the deque always contains the index of the maximum element in current window

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Fixed Window - Sum** | O(n) | Each element added/removed once |
| **Fixed Window - Max/Min (Deque)** | O(n) | Each element pushed/popped once |
| **Variable Window - Longest Substring** | O(n) | Each character processed twice max |
| **Variable Window - Anagram Count** | O(n + m) | n = string length, m = pattern length |
| **Variable Window - Min Subarray** | O(n) | Each element enters/leaves once |

### Detailed Breakdown

- **Fixed Window Sum**: O(n) - one pass through array, O(1) per slide
- **Fixed Window Max/Min**: O(n) - each element pushed and popped at most once from deque
- **Longest Substring**: O(n) - each character processed at most twice (once by right, once by left)
- **Anagram Count**: O(n + m) - hashmap operations are O(1) average

---

## Space Complexity Analysis

| Data Structure | Space Complexity | Description |
|----------------|-----------------|-------------|
| **Deque for Max/Min** | O(k) | Stores at most k indices |
| **Hashmap for Anagrams** | O(m) | m = size of pattern/character set |
| **Hashmap for Longest Substring** | O(min(m, n)) | m = character set size |
| **Sum-based Window** | O(1) | Only stores current sum |

### Space Optimization Tips

1. **Use arrays instead of hashmaps** when character set is small (e.g., ASCII)
2. **Reuse data structures** when possible
3. **Consider in-place operations** where applicable

---

## Common Variations

### 1. Fixed Window Size

The window size `k` remains constant throughout:

````carousel
```python
# Maximum sum of any k consecutive elements
def max_sum_fixed_window(nums: list, k: int) -> int:
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    for i in range(k, len(nums)):
        window_sum = window_sum - nums[i - k] + nums[i]
        max_sum = max(max_sum, window_sum)
    
    return max_sum

# Average of all k-sized windows
def average_fixed_window(nums: list, k: int) -> list:
    window_sum = sum(nums[:k])
    result = [window_sum / k]
    
    for i in range(k, len(nums)):
        window_sum = window_sum - nums[i - k] + nums[i]
        result.append(window_sum / k)
    
    return result
```
````

### 2. Variable Window Size

The window expands/shrinks based on conditions:

````carousel
```python
# Longest subarray with sum less than target
def longest_subarray_less_than_target(nums: list, target: int) -> int:
    left = 0
    current_sum = 0
    max_length = 0
    
    for right in range(len(nums)):
        current_sum += nums[right]
        
        while current_sum >= target:
            current_sum -= nums[left]
            left += 1
        
        max_length = max(max_length, right - left + 1)
    
    return max_length

# Minimum window substring
def min_window_substring(s: str, t: str) -> str:
    from collections import Counter
    
    if not s or not t:
        return ""
    
    target_count = Counter(t)
    window_count = {}
    have = 0
    need = len(target_count)
    result = ""
    result_length = float('inf')
    left = 0
    
    for right in range(len(s)):
        char = s[right]
        window_count[char] = window_count.get(char, 0) + 1
        
        if char in target_count and window_count[char] == target_count[char]:
            have += 1
        
        while have == need:
            # Update result
            if right - left + 1 < result_length:
                result_length = right - left + 1
                result = s[left:right + 1]
            
            # Try to shrink window
            left_char = s[left]
            window_count[left_char] -= 1
            if left_char in target_count and window_count[left_char] < target_count[left_char]:
                have -= 1
            left += 1
    
    return result
```
````

### 3. Circular Window

Window wraps around the array:

````carousel
```python
# Maximum sum of k consecutive elements in circular array
def max_circular_sum(nums: list, k: int) -> int:
    if len(nums) < k:
        return 0
    
    # Case 1: Non-wrapping - same as regular
    max_normal = max_sum_subarray(nums, k)
    
    # Case 2: Wrapping - total sum - min subarray of size n-k
    total_sum = sum(nums)
    # For circular, we take elements from end and start
    # Equivalent to finding min subarray of size n-k
    min_subarray_sum = min_sum_subarray(nums, len(nums) - k) if len(nums) > k else 0
    
    max_wrap = total_sum - min_subarray_sum
    
    return max(max_normal, max_wrap)
```
````

### 4. Two Pointer (Special Case)

When left and right pointers move independently:

````carousel
```python
# Partition array into k subarrays with minimum largest sum
def split_array_largest_sum(nums: list, k: int) -> int:
    # Find valid range for binary search
    lo = max(nums)
    hi = sum(nums)
    
    while lo < hi:
        mid = (lo + hi) // 2
        if can_split(nums, k, mid):
            hi = mid
        else:
            lo = mid + 1
    
    return lo

def can_split(nums: list, k: int, max_sum: int) -> bool:
    current_sum = 0
    splits = 1
    
    for num in nums:
        current_sum += num
        if current_sum > max_sum:
            splits += 1
            current_sum = num
            if splits > k:
                return False
    
    return True
```
````

---

## Practice Problems

### Problem 1: Maximum Sliding Window

**Problem:** [LeetCode 239 - Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)

**Description:** You are given an array of integers `nums`, and there is a sliding window of size `k` which moves from the very left to the very right. You can only see the `k` numbers in the window. Return the max sliding window as an array.

**How to Apply Sliding Window:**
- Use a monotonic decreasing deque to maintain potential maximums
- Remove elements from front that are outside the window
- Remove elements from back that are smaller than current (they can never be max)
- Front of deque is always the maximum for current window

---

### Problem 2: Longest Substring Without Repeating Characters

**Problem:** [LeetCode 3 - Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

**Description:** Given a string `s`, find the length of the longest substring without repeating characters.

**How to Apply Sliding Window:**
- Use a hashmap to track last seen index of each character
- Expand right pointer, contract left pointer when duplicate found
- Track maximum window size during iteration
- Time: O(n), Space: O(min(m, n))

---

### Problem 3: Minimum Size Subarray Sum

**Problem:** [LeetCode 209 - Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)

**Description:** Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a contiguous subarray whose sum is at least `target`.

**How to Apply Sliding Window:**
- Expand window by adding elements until sum >= target
- Shrink window from left to find minimum length
- Track minimum length found
- Time: O(n), Space: O(1)

---

### Problem 4: Find All Anagrams in a String

**Problem:** [LeetCode 438 - Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/)

**Description:** Given two strings `s` and `p`, return an array of all the start indices of `p`'s anagrams in `s`.

**How to Apply Sliding Window:**
- Use fixed-size window equal to pattern length
- Maintain frequency counts for both pattern and window
- Compare counts to identify anagrams
- Slide window one character at a time
- Time: O(n + m), Space: O(m)

---

### Problem 5: Maximum Average Subarray

**Problem:** [LeetCode 643 - Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/)

**Description:** You are given an integer array `nums` consisting of `n` elements, and an integer `k`. Find a contiguous subarray whose length is `k` and has the maximum average value.

**How to Apply Sliding Window:**
- Calculate initial sum of first k elements
- Slide window by subtracting element leaving and adding element entering
- Track maximum sum (or average)
- Time: O(n), Space: O(1)

---

## Video Tutorial Links

### Fundamentals

- [Sliding Window Pattern - Introduction (Take U Forward)](https://www.youtube.com/watch?v=9trI0mriUyI) - Comprehensive introduction to sliding windows
- [Sliding Window Technique (WilliamFiset)](https://www.youtube.com/watch?v=M1Fy86AuwBs) - Detailed explanation with visualizations
- [Fixed Size Sliding Window (NeetCode)](https://www.youtube.com/watch?v=Tkpp2C3v3gU) - Practical implementation guide

### Advanced Topics

- [Variable Size Sliding Window](https://www.youtube.com/watch?v=Kkmv2e30HWs) - Expanding and shrinking windows
- [Monotonic Deque for Sliding Window](https://www.youtube.com/watch?v=5uyJb2j3G7U) - Efficient max/min queries
- [Sliding Window Maximum - LeetCode 239](https://www.youtube.com/watch?v=2kmB6M3BzsQ) - Complete problem solution

### Problem-Specific

- [Longest Substring Without Repeating - LeetCode 3](https://www.youtube.com/watch?v=4wg3Q9bU5xg) - Hashmap + sliding window
- [Minimum Window Substring - LeetCode 76](https://www.youtube.com/watch?v=e1FZ8x5h7jU) - Classic sliding window problem
- [Sliding Window Median - LeetCode 480](https://www.youtube.com/watch?v=eyLE9PZyXo0) - Advanced sliding window with data structures

---

## Follow-up Questions

### Q1: What is the difference between sliding window and two pointers?

**Answer:** Sliding Window is a specialized form of two pointers where:
- Both pointers define a **contiguous window** that moves together
- Window size can be fixed or variable
- Common operations: add to one end, remove from other

Two Pointers is more general:
- Pointers can move independently
- Not necessarily defining a contiguous range
- Can move in different directions based on conditions

### Q2: When should I use a deque for sliding window problems?

**Answer:** Use a deque when you need to efficiently find:
- **Maximum/Minimum** in each window
- Elements that satisfy monotonic properties

The deque maintains indices in decreasing/increasing order, allowing O(1) access to the optimal element while each element is pushed/popped at most once (O(n) total).

### Q3: Can sliding window handle negative numbers?

**Answer:** Yes, with some considerations:
- **For sum-based problems**: Works exactly the same, handles negatives correctly
- **For max/min with deque**: Still works - the monotonic property holds regardless of sign
- **For two-pointer variable window**: May need adjustment depending on conditions

### Q4: What if the window size is not given?

**Answer:** Use **variable window** approach:
- Expand right pointer continuously
- Shrink left pointer when condition is violated
- Track best result during expansion/shrinking
- Examples: longest substring without repeating, minimum subarray with sum >= target

### Q5: How do you handle edge cases in sliding window?

**Answer:** Common edge cases to consider:
- **Empty array/string**: Return empty result or 0
- **Window size = 0**: Return empty result
- **Window size > array length**: Return result for single window or empty
- **Single element window**: Often a base case to handle separately
- **All same/different elements**: Verify algorithm handles duplicates correctly

---

## Summary

The Sliding Window technique is a powerful algorithmic pattern for solving array and string problems efficiently. Key takeaways:

- **Efficient traversal**: Reduces O(n×k) to O(n) by reusing computations
- **Two main types**: Fixed window size and variable window size
- **Key data structures**: Deque for max/min, hashmap for character tracking
- **Linear time**: Each element is processed at most twice

When to use:
- ✅ Subarray/Substring problems with contiguous elements
- ✅ Finding max/min/sum within sliding windows
- ✅ Pattern matching (anagrams, substrings)
- ✅ When you need O(n) instead of O(n×k) complexity
- ❌ When elements are not contiguous
- ❌ When window boundaries are unpredictable

This technique is essential for competitive programming and technical interviews, appearing frequently in problems from major tech companies.

---

## Related Algorithms

- [Prefix Sum](./prefix-sum.md) - For range sum queries
- [Kadane's Algorithm](./kadanes-algorithm.md) - Maximum subarray (similar concept)
- [Monotonic Queue](./sliding-window-monotonic-queue-for-max-min.md) - Advanced sliding window for max/min
- [Two Pointers](./two-pointers.md) - Related technique for array traversal
