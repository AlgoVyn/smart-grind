# Single Element in a Sorted Array

## Problem Description

You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once.

Return the single element that appears only once.

Your solution must run in O(log n) time and O(1) space.

**Link to problem:** [Single Element in a Sorted Array - LeetCode 540](https://leetcode.com/problems/single-element-in-a-sorted-array/)

## Constraints
- `1 <= nums.length <= 10^5`
- `0 <= nums[i] <= 10^5`

---

## Pattern: Binary Search

This problem demonstrates the **Binary Search** pattern with a twist. The key is using binary search with parity checking.

### Core Concept

- **Sorted Nature**: Elements appear in pairs
- **Parity Check**: Pairs start at even indices before single element
- **Binary Search**: Find the transition point

---

## Examples

### Example

**Input:** nums = [1,1,2,3,3,4,4,8,8]

**Output:** 2

### Example 2

**Input:** nums = [3,3,7,7,10,11,11]

**Output:** 10

---

## Intuition

The key insight is that in a paired sorted array:

1. **Pairs Pattern**: Pairs are at (even, odd) indices before the single element
2. **After Single**: Pattern flips to (odd, even) after single element
3. **Binary Search**: Use this pattern to find single element

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Binary Search (Optimal)** - O(log n) time, O(1) space
2. **XOR Approach** - O(n) time, O(1) space

---

## Approach 1: Binary Search (Optimal)

This is the most efficient approach.

### Algorithm Steps

1. Set left = 0, right = n - 1
2. While left < right:
   - Calculate mid = (left + right) / 2
   - Make mid even (to start of pair)
   - Check if nums[mid] == nums[mid + 1]
   - If equal: single is to the right
   - If not equal: single is to the left
3. Return nums[left]

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def singleNonDuplicate(self, nums: List[int]) -> int:
        """
        Find single element using binary search.
        
        Args:
            nums: Sorted array with pairs and single element
            
        Returns:
            The single element
        """
        left, right = 0, len(nums) - 1
        
        while left < right:
            mid = (left + right) // 2
            
            # Ensure mid is even
            if mid % 2 == 1:
                mid -= 1
            
            # Check if pair starts at mid
            if nums[mid] == nums[mid + 1]:
                # Single element is to the right
                left = mid + 2
            else:
                # Single element is to the left (or at mid)
                right = mid
        
        return nums[left]
```

<!-- slide -->
```cpp
class Solution {
public:
    int singleNonDuplicate(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;
        
        while (left < right) {
            int mid = (left + right) / 2;
            
            // Ensure mid is even
            if (mid % 2 == 1) mid--;
            
            if (nums[mid] == nums[mid + 1]) {
                left = mid + 2;
            } else {
                right = mid;
            }
        }
        
        return nums[left];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int singleNonDuplicate(int[] nums) {
        int left = 0, right = nums.length - 1;
        
        while (left < right) {
            int mid = (left + right) / 2;
            
            // Ensure mid is even
            if (mid % 2 == 1) mid--;
            
            if (nums[mid] == nums[mid + 1]) {
                left = mid + 2;
            } else {
                right = mid;
            }
        }
        
        return nums[left];
    }
}
```

<!-- slide -->
```javascript
var singleNonDuplicate = function(nums) {
    let left = 0, right = nums.length - 1;
    
    while (left < right) {
        let mid = Math.floor((left + right) / 2);
        
        // Ensure mid is even
        if (mid % 2 === 1) mid--;
        
        if (nums[mid] === nums[mid + 1]) {
            left = mid + 2;
        } else {
            right = mid;
        }
    }
    
    return nums[left];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) |
| **Space** | O(1) |

---

## Approach 2: XOR Approach

XOR all elements to find the single one.

### Code Implementation

````carousel
```python
class Solution:
    def singleNonDuplicate_xor(self, nums: List[int]) -> int:
        """
        Find single element using XOR.
        """
        result = 0
        for num in nums:
            result ^= num
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    int singleNonDuplicateXOR(vector<int>& nums) {
        int result = 0;
        for (int num : nums) {
            result ^= num;
        }
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int singleNonDuplicateXOR(int[] nums) {
        int result = 0;
        for (int num : nums) {
            result ^= num;
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
var singleNonDuplicate = function(nums) {
    let result = 0;
    for (const num of nums) {
        result ^= num;
    }
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Binary Search | XOR |
|--------|---------------|-----|
| **Time Complexity** | O(log n) | O(n) |
| **Space Complexity** | O(1) | O(1) |
| **Follows Constraints** | ✅ Yes | ❌ No |

Binary search is required to meet O(log n) constraint.

---

## Related Problems

### Similar Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Single Number | [Link](https://leetcode.com/problems/single-number/) | No sorted constraint |
| Find the Duplicate Number | [Link](https://leetcode.com/problems/find-the-duplicate-number/) | Similar binary search |
| Missing Number | [Link](https://leetcode.com/problems/missing-number/) | XOR approach |

---

## Video Tutorial Links

### Binary Search Technique

- [NeetCode - Single Element in Sorted Array](https://www.youtube.com/watch?v=7C_f7fD2p14) - Clear explanation
- [Binary Search for Single Element](https://www.youtube.com/watch?v=OVZbT9jQwI0) - Detailed walkthrough

---

## Follow-up Questions

### Q1: Why do we need to ensure mid is even?

**Answer:** Because pairs are at indices (0,1), (2,3), etc. By making mid even, we can easily check if nums[mid] == nums[mid+1]. After the single element, the parity flips.

---

### Q2: What if array has no pairs?

**Answer:** Problem guarantees pairs except for one single element.

---

### Q3: Can you use recursion?

**Answer:** Yes, but iterative is better to avoid stack overflow.

---

### Q4: How to handle edge cases?

**Answer:** Single element at start, middle, or end. All handled by binary search.

---

## Common Pitfalls

### 1. Mid Parity
**Issue**: Not making mid even before checking.

**Solution**: Use `mid = mid - 1` when mid is odd to ensure it's the first element of a pair.

### 2. Index Out of Bounds
**Issue**: Accessing mid+1 when mid is at end.

**Solution**: The loop condition left < right ensures mid is never the last element when checking.

### 3. Left vs Right Update
**Issue**: Wrong update direction in binary search.

**Solution**: When nums[mid] != nums[mid+1], single is at mid or left. Use right = mid.

### 4. Integer Division
**Issue**: Using wrong division in Python 2 vs 3.

**Solution**: Use // for integer division in Python.

### 5. Return Value
**Issue**: Returning wrong index/value.

**Solution**: At loop exit, left == right, which is the index of single element.

---

## Summary

The **Single Element in a Sorted Array** problem demonstrates **Binary Search**:
- O(log n) time with binary search
- O(1) space
- Uses parity-based narrowing

For more details, see the **[Binary Search Pattern](/patterns/binary-search)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/single-element-in-a-sorted-array/discuss/)
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/)
