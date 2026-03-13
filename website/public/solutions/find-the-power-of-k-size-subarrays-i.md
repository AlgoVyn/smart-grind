# Find The Power Of K Size Subarrays I

## Problem Description

## Pattern: Sliding Window

This problem demonstrates the **Sliding Window** pattern for finding subarrays with specific properties.

You are given an array of integers nums of length n and a positive integer k.
The power of an array is defined as:
- Its maximum element if all of its elements are consecutive and sorted in ascending order.
- -1 otherwise.
You need to find the power of all subarrays of nums of size k.
Return an integer array results of size n - k + 1, where results[i] is the power of nums[i..(i + k - 1)].

## Examples

**Example 1:**

**Input:** nums = [1,2,3,4,3,2,5], k = 3

**Output:** [3,4,-1,-1,-1]

**Explanation:**
There are 5 subarrays of nums of size 3:
- [1, 2, 3] with the maximum element 3.
- [2, 3, 4] with the maximum element 4.
- [3, 4, 3] whose elements are not consecutive.
- [4, 3, 2] whose elements are not sorted.
- [3, 2, 5] whose elements are not consecutive.

**Example 2:**

**Input:** nums = [2,2,2,2,2], k = 4

**Output:** [-1,-1]

**Example 3:**

**Input:** nums = [3,2,3,2,3,2], k = 2

**Output:** [-1,3,-1,3,-1]

## Constraints

- 1 <= n == nums.length <= 500
- 1 <= nums[i] <= 10^5
- 1 <= k <= n

---

## Intuition

The key insight is straightforward:

1. **Consecutive ascending check**: For each window of size k, check if each element is exactly one more than the previous
2. **Power calculation**: If consecutive and ascending, the power is the maximum element (last element in ascending order)
3. **Otherwise**: Power is -1

### Why This Works:

A subarray is "consecutive and ascending" if:
- `nums[i+1] = nums[i] + 1` for all consecutive pairs in the window
- This means elements form a sequence like: x, x+1, x+2, ..., x+k-1

---

## Solution Approaches

## Approach 1: Brute Force (Simple)

Check each window individually by comparing consecutive elements.

````carousel
```python
from typing import List

class Solution:
    def resultsArray(self, nums: List[int], k: int) -> List[int]:
        res = []
        for i in range(len(nums) - k + 1):
            sub = nums[i:i + k]
            if all(sub[j] + 1 == sub[j + 1] for j in range(k - 1)):
                res.append(max(sub))
            else:
                res.append(-1)
        return res
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> resultsArray(vector<int>& nums, int k) {
        vector<int> res;
        int n = nums.size();
        
        for (int i = 0; i <= n - k; i++) {
            bool isConsecutive = true;
            for (int j = i; j < i + k - 1; j++) {
                if (nums[j] + 1 != nums[j + 1]) {
                    isConsecutive = false;
                    break;
                }
            }
            
            if (isConsecutive) {
                res.push_back(nums[i + k - 1]);  // Last element is max in ascending
            } else {
                res.push_back(-1);
            }
        }
        
        return res;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] resultsArray(int[] nums, int k) {
        int n = nums.length;
        int[] res = new int[n - k + 1];
        
        for (int i = 0; i <= n - k; i++) {
            boolean isConsecutive = true;
            for (int j = i; j < i + k - 1; j++) {
                if (nums[j] + 1 != nums[j + 1]) {
                    isConsecutive = false;
                    break;
                }
            }
            
            if (isConsecutive) {
                res[i] = nums[i + k - 1];  // Last element is max in ascending
            } else {
                res[i] = -1;
            }
        }
        
        return res;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var resultsArray = function(nums, k) {
    const res = [];
    const n = nums.length;
    
    for (let i = 0; i <= n - k; i++) {
        let isConsecutive = true;
        for (let j = i; j < i + k - 1; j++) {
            if (nums[j] + 1 !== nums[j + 1]) {
                isConsecutive = false;
                break;
            }
        }
        
        if (isConsecutive) {
            res.push(nums[i + k - 1]);  // Last element is max in ascending
        } else {
            res.push(-1);
        }
    }
    
    return res;
};
```
````

## Approach 2: Optimized with Early Termination

A slightly optimized version that can break early when condition fails.

````carousel
```python
from typing import List

class Solution:
    def resultsArray(self, nums: List[int], k: int) -> List[int]:
        n = len(nums)
        res = []
        
        for i in range(n - k + 1):
            # Check if the window is consecutive and ascending
            is_valid = True
            max_val = nums[i]
            
            for j in range(i, i + k - 1):
                if nums[j] + 1 != nums[j + 1]:
                    is_valid = False
                    break
                max_val = nums[j + 1]  # Update max as we go
            
            res.append(max_val if is_valid else -1)
        
        return res
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> resultsArray(vector<int>& nums, int k) {
        int n = nums.size();
        vector<int> res;
        
        for (int i = 0; i <= n - k; i++) {
            bool isValid = true;
            int maxVal = nums[i];
            
            for (int j = i; j < i + k - 1; j++) {
                if (nums[j] + 1 != nums[j + 1]) {
                    isValid = false;
                    break;
                }
                maxVal = nums[j + 1];
            }
            
            res.push_back(isValid ? maxVal : -1);
        }
        
        return res;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] resultsArray(int[] nums, int k) {
        int n = nums.length;
        int[] res = new int[n - k + 1];
        
        for (int i = 0; i <= n - k; i++) {
            boolean isValid = true;
            int maxVal = nums[i];
            
            for (int j = i; j < i + k - 1; j++) {
                if (nums[j] + 1 != nums[j + 1]) {
                    isValid = false;
                    break;
                }
                maxVal = nums[j + 1];
            }
            
            res[i] = isValid ? maxVal : -1;
        }
        
        return res;
    }
}
```
<!-- slide -->
```javascript
var resultsArray = function(nums, k) {
    const n = nums.length;
    const res = [];
    
    for (let i = 0; i <= n - k; i++) {
        let isValid = true;
        let maxVal = nums[i];
        
        for (let j = i; j < i + k - 1; j++) {
            if (nums[j] + 1 !== nums[j + 1]) {
                isValid = false;
                break;
            }
            maxVal = nums[j + 1];
        }
        
        res.push(isValid ? maxVal : -1);
    }
    
    return res;
};
```
````

## Approach 3: Using zip and all() (Pythonic)

A more Pythonic approach using built-in functions.

````carousel
```python
from typing import List

class Solution:
    def resultsArray(self, nums: List[int], k: int) -> List[int]:
        res = []
        
        for i in range(len(nums) - k + 1):
            window = nums[i:i + k]
            # Check consecutive: each element equals previous + 1
            is_consecutive = all(
                window[j] + 1 == window[j + 1] 
                for j in range(k - 1)
            )
            # If consecutive, power is the max (last element)
            res.append(window[-1] if is_consecutive else -1)
        
        return res
```
<!-- slide -->
```cpp
// Same as Approach 1 - using standard C++ features
class Solution {
public:
    vector<int> resultsArray(vector<int>& nums, int k) {
        vector<int> res;
        int n = nums.size();
        
        for (int i = 0; i <= n - k; i++) {
            bool isConsecutive = true;
            for (int j = i; j < i + k - 1; j++) {
                if (nums[j] + 1 != nums[j + 1]) {
                    isConsecutive = false;
                    break;
                }
            }
            
            res.push_back(isConsecutive ? nums[i + k - 1] : -1);
        }
        
        return res;
    }
};
```
<!-- slide -->
```java
// Same as Approach 1 - using standard Java features
class Solution {
    public int[] resultsArray(int[] nums, int k) {
        int n = nums.length;
        int[] res = new int[n - k + 1];
        
        for (int i = 0; i <= n - k; i++) {
            boolean isConsecutive = true;
            for (int j = i; j < i + k - 1; j++) {
                if (nums[j] + 1 != nums[j + 1]) {
                    isConsecutive = false;
                    break;
                }
            }
            
            res[i] = isConsecutive ? nums[i + k - 1] : -1;
        }
        
        return res;
    }
}
```
<!-- slide -->
```javascript
var resultsArray = function(nums, k) {
    const res = [];
    
    for (let i = 0; i <= nums.length - k; i++) {
        const window = nums.slice(i, i + k);
        // Check consecutive: each element equals previous + 1
        const isConsecutive = window.slice(0, -1).every(
            (val, idx) => val + 1 === window[idx + 1]
        );
        // If consecutive, power is the max (last element)
        res.push(isConsecutive ? window[k - 1] : -1);
    }
    
    return res;
};
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Description |
|----------|-----------------|------------------|-------------|
| **Brute Force** | O(n × k) | O(1) | Simple implementation |
| **Optimized** | O(n × k) | O(1) | Slightly fewer operations |
| **Pythonic** | O(n × k) | O(1) | Clean but same complexity |

### Why O(n × k):

- We have n - k + 1 windows
- For each window, we check k - 1 consecutive pairs
- Total: (n - k + 1) × (k - 1) ≈ O(n × k)

---

## Edge Cases and Common Pitfalls

### Edge Cases to Consider

1. **k = 1**: Single element window is always "consecutive" (vacuously true)
2. **k = n**: Entire array is one window
3. **All consecutive**: All outputs are the last element of each window
4. **None consecutive**: All outputs are -1

### Common Mistakes

1. **Forgetting k = 1 case**: Should return the element itself
2. **Off-by-one in loop**: Use `range(len(nums) - k + 1)` not `range(len(nums) - k)`
3. **Wrong max**: In ascending sequence, max is always the last element
4. **Not checking ascending**: Only checking consecutive, not ascending order

---

## Why This Pattern is Important

### Interview Relevance

- **Frequency**: Occasionally asked in interviews
- **Companies**: Amazon, Meta
- **Difficulty**: Easy to Medium
- **Concepts tested**: Array sliding, consecutive checks

### Learning Outcomes

1. **Window-based thinking**: Processing subarrays of fixed size
2. **Consecutive checks**: Understanding consecutive number sequences
3. **Edge cases**: Handling boundary conditions

---

## Related Problems

### Same Pattern (Window-based)

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Maximum Average Subarray](https://leetcode.com/problems/maximum-average-subarray-i/) | 643 | Easy | Fixed-size window |
| [Maximum Number of Vowels](https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/) | 1456 | Medium | Sliding window |
| [Longest Subarray of 1s](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/) | 1493 | Medium | Sliding window |

### Similar Array Problems

| Problem | LeetCode # | Difficulty | Related Technique |
|---------|------------|------------|-------------------|
| [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) | 217 | Easy | Array scanning |
| [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) | 53 | Medium | Sliding window |
| [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) | 239 | Hard | Deque-based window |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[Find Power of K Size Subarrays - NeetCode](https://www.youtube.com/watch?v=QfR5bEplGjA)**
   - Explanation of the problem
   - Visual examples

2. **[Sliding Window Pattern](https://www.youtube.com/watch?v=o5M2wCLQeSQ)**
   - Understanding sliding window technique
   - Common variations

3. **[LeetCode Easy Problems](https://www.youtube.com/watch?v=0F-QQfqX6cM)**
   - Array problem patterns
   - Interview preparation

---

## Follow-up Questions

### Basic Level

1. **What is the time and space complexity?**
   - Time: O(n × k), Space: O(1) extra

2. **What happens when k = 1?**
   - Each window has one element, which is trivially consecutive; return nums[i]

3. **What if the array has duplicate values?**
   - Duplicates break the consecutive sequence (need +1 difference)

### Intermediate Level

4. **How would you optimize to O(n) using a deque?**
   - Track consecutive length in current window, slide and update

5. **How would you handle descending consecutive sequences?**
   - Modify condition to check nums[j] - 1 == nums[j + 1]

### Advanced Level

6. **What if k could vary per query?**
   - Preprocess with segment tree for O(log n) queries

7. **How would you extend to find maximum consecutive subsequence?**
   - Track start and length of each consecutive run

---

## Common Pitfalls

### 1. Forgetting k = 1 Case
**Issue**: Single element window is always "consecutive" (vacuously true).

**Solution**: Handle k = 1 explicitly - should return the element itself.

### 2. Off-by-One in Loop Range
**Issue**: Using wrong range for iteration causing missed windows.

**Solution**: Use `range(len(nums) - k + 1)` not `range(len(nums) - k)`.

### 3. Wrong Maximum Value
**Issue**: Computing max incorrectly for ascending sequences.

**Solution**: In ascending sequence, max is always the last element.

### 4. Not Checking Ascending Order
**Issue**: Only checking consecutive, not that it's ascending.

**Solution**: The problem requires ascending consecutive, so check `nums[j] + 1 == nums[j + 1]`.

### 5. Not Handling Empty Result
**Issue**: Assuming there will always be valid windows.

**Solution**: Handle case where no valid windows exist - all outputs should be -1.

---

## Summary

The **Find Power of K Size Subarrays** problem is a straightforward sliding window problem. Key insights:

1. **Consecutive check**: Each element must be exactly 1 more than previous
2. **Window size**: Fixed k determines each subarray
3. **Power value**: Maximum (last element) if valid, else -1

This problem helps practice:
- Array windowing techniques
- Consecutive number sequence validation
- Basic array manipulation

---

## LeetCode Problems for Practice

- [Find The Power Of K Size Subarrays I](https://leetcode.com/problems/find-the-power-of-k-size-subarrays-i/)
- [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/)
- [Maximum Number of Vowels](https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/)
- [Longest Subarray of 1s](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/)
- [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)
