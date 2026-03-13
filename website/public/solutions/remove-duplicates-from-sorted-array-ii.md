# Remove Duplicates From Sorted Array II

## LeetCode Link

[Remove Duplicates from Sorted Array II - LeetCode](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/)

---

## Problem Description

Given an integer array `nums` sorted in non-decreasing order, remove some duplicates in-place such that each unique element appears at most twice. The relative order of the elements should be kept the same.

Since it is impossible to change the length of the array in some languages, you must instead have the result be placed in the first part of the array `nums`. More formally, if there are `k` elements after removing the duplicates, then the first `k` elements of `nums` should hold the final result. It does not matter what you leave beyond the first `k` elements.

Return `k` after placing the final result in the first `k` slots of `nums`.

Do not allocate extra space for another array. You must do this by modifying the input array in-place with O(1) extra memory.

---

## Examples

### Example 1

**Input:**
```python
nums = [1,1,1,2,2,3]
```

**Output:**
```python
5, nums = [1,1,2,2,3,_]
```

**Explanation:**
Your function should return `k = 5`, with the first five elements of `nums` being `1, 1, 2, 2` and `3` respectively. It does not matter what you leave beyond the returned `k` (hence they are underscores).

### Example 2

**Input:**
```python
nums = [0,0,1,1,1,1,2,3,3]
```

**Output:**
```python
7, nums = [0,0,1,1,2,3,3,_,_]
```

**Explanation:**
Your function should return `k = 7`, with the first seven elements of `nums` being `0, 0, 1, 1, 2, 3` and `3` respectively. It does not matter what you leave beyond the returned `k`.

---

## Constraints

- `1 <= nums.length <= 3 * 10^4`
- `-10^4 <= nums[i] <= 10^4`
- `nums` is sorted in non-decreasing order.

---

## Pattern: Two Pointer (In-place Modification)

This problem uses **Two Pointers** - one for reading, one for writing. Allow max 2 duplicates by comparing with element at write-2.

---

## Intuition

The key insight is allowing up to two occurrences of each element while maintaining relative order.

### Key Observations

1. **First Two Elements**: First two elements can always stay (no need to check).

2. **Comparison Point**: Compare current element with element at position `write - 2`:
   - If different: safe to include (at most 2 duplicates)
   - If same: already have 2 duplicates, skip

3. **Write Pointer**: Starts at 2 (indices 0,1 are always valid).

4. **In-Place**: Overwrite elements in the array, don't create new array.

### Algorithm Overview

1. Handle edge cases (array length ≤ 2)
2. Initialize write pointer at 2
3. Iterate through array from index 2
4. If element differs from nums[write-2], write it
5. Return write pointer

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two Pointers (Optimal)** - Standard solution
2. **Counter-Based** - Alternative approach

---

## Approach 1: Two Pointers (Optimal)

### Algorithm Steps

1. If length ≤ 2, return length
2. Initialize write = 2
3. For i from 2 to n-1:
   - If nums[i] != nums[write - 2], write nums[i], increment write
4. Return write

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        """
        Remove duplicates allowing at most 2 occurrences.
        
        Args:
            nums: Sorted array with duplicates
            
        Returns:
            Length of array after removing duplicates
        """
        if len(nums) <= 2:
            return len(nums))
        
        write = 2  # First two elements are always valid
        for i in range(2, len(nums)):
            # Only write if current differs from element 2 positions back
            if nums[i] != nums[write - 2]:
                nums[write] = nums[i]
                write += 1
        
        return write
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        int n = nums.size();
        if (n <= 2) return n;
        
        int write = 2;
        for (int i = 2; i < n; i++) {
            if (nums[i] != nums[write - 2]) {
                nums[write++] = nums[i];
            }
        }
        
        return write;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int removeDuplicates(int[] nums) {
        int n = nums.length;
        if (n <= 2) return n;
        
        int write = 2;
        for (int i = 2; i < n; i++) {
            if (nums[i] != nums[write - 2]) {
                nums[write++] = nums[i];
            }
        }
        
        return write;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
    const n = nums.length;
    if (n <= 2) return n;
    
    let write = 2;
    for (let i = 2; i < n; i++) {
        if (nums[i] !== nums[write - 2]) {
            nums[write++] = nums[i];
        }
    }
    
    return write;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through array |
| **Space** | O(1) - In-place modification |

---

## Approach 2: Counter-Based

### Algorithm Steps

1. Use a counter to track frequency of current element
2. Only write if frequency ≤ 2

### Code Implementation

````carousel
```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        if len(nums) <= 2:
            return len(nums)
        
        write = 1
        count = 1
        
        for i in range(1, len(nums)):
            if nums[i] == nums[i-1]:
                count += 1
            else:
                count = 1
            
            if count <= 2:
                nums[write] = nums[i]
                write += 1
        
        return write
```

<!-- slide -->
```cpp
class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        int n = nums.size();
        if (n <= 2) return n;
        
        int write = 1, count = 1;
        for (int i = 1; i < n; i++) {
            if (nums[i] == nums[i-1]) count++;
            else count = 1;
            
            if (count <= 2) {
                nums[write++] = nums[i];
            }
        }
        return write;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int removeDuplicates(int[] nums) {
        int n = nums.length;
        if (n <= 2) return n;
        
        int write = 1, count = 1;
        for (int i = 1; i < n; i++) {
            if (nums[i] == nums[i-1]) count++;
            else count = 1;
            
            if (count <= 2) {
                nums[write++] = nums[i];
            }
        }
        return write;
    }
}
```

<!-- slide -->
```javascript
var removeDuplicates = function(nums) {
    const n = nums.length;
    if (n <= 2) return n;
    
    let write = 1, count = 1;
    for (let i = 1; i < n; i++) {
        if (nums[i] === nums[i-1]) count++;
        else count = 1;
        
        if (count <= 2) {
            nums[write++] = nums[i];
        }
    }
    return write;
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

| Aspect | Two Pointers | Counter-Based |
|--------|--------------|---------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Simple | Simple |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Use Approach 1 (Two Pointers) as it's more straightforward.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in interviews
- **Companies**: Google, Meta, Amazon
- **Difficulty**: Medium
- **Concepts Tested**: Two Pointers, In-Place Modification

### Learning Outcomes

1. **Two Pointers**: Master in-place array modification
2. **Edge Cases**: Handle arrays with length ≤ 2
3. **Comparison Logic**: Understanding the write-2 comparison

---

## Related Problems

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Remove Duplicates I | [Link](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) | At most once |
| Remove Element | [Link](https://leetcode.com/problems/remove-element/) | In-place removal |
| Find Duplicates | [Link](https://leetcode.com/problems/find-all-duplicates-in-an-array/) | Finding duplicates |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Remove Duplicates II](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Clear explanation

---

## Follow-up Questions

### Q1: How would you modify to allow k duplicates?

**Answer:** Change comparison from `nums[write - 2]` to `nums[write - k]`.

---

### Q2: Can you do this without modifying the original array?

**Answer:** Yes, create a new array, but the problem requires in-place modification.

---

### Q3: What if array is not sorted?

**Answer:** You'd need to sort first or use a hash-based approach.

---

## Common Pitfalls

### 1. Comparison Index
**Issue**: Check nums[i] != nums[write - 2], not nums[i] != nums[write - 1].

**Solution**: Always compare with element 2 positions back.

### 2. Write Pointer Start
**Issue**: Start at 2 (first two elements can always stay).

**Solution**: Initialize write = 2.

### 3. Edge Cases
**Issue**: Arrays with length <= 2 return as-is.

**Solution**: Handle these cases first.

---

## Summary

The **Remove Duplicates from Sorted Array II** problem demonstrates **Two Pointers** for in-place array modification.

Key takeaways:
1. Allow at most 2 duplicates
2. Compare with element at write-2 position
3. First two elements always valid
4. O(n) time, O(1) space

This problem extends the classic "remove duplicates" problem to allow multiple occurrences.

### Pattern Summary

This problem exemplifies the **Two Pointers** pattern:
- Read and write pointers
- In-place modification
- Single pass

---

## Additional Resources

- [LeetCode Problem 80](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/) - Official problem page
- [Two Pointers - GeeksforGeeks](https://www.geeksforgeeks.org/two-pointer-technique/) - Detailed explanation
