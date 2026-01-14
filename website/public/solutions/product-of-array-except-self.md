# Product Of Array Except Self

## Problem Description

Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.

The product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.
You must write an algorithm that runs in **O(n) time** and **without using the division operation**.

### Example 1

**Input:** `nums = [1,2,3,4]`  
**Output:** `[24,12,8,6]`  
**Explanation:**
- `answer[0] = 2 × 3 × 4 = 24`
- `answer[1] = 1 × 3 × 4 = 12`
- `answer[2] = 1 × 2 × 4 = 8`
- `answer[3] = 1 × 2 × 3 = 6`

### Example 2

**Input:** `nums = [-1,1,0,-3,3]`  
**Output:** `[0,0,9,0,0]`  
**Explanation:**
- `answer[0] = 1 × 0 × (-3) × 3 = 0`
- `answer[1] = (-1) × 0 × (-3) × 3 = 0`
- `answer[2] = (-1) × 1 × (-3) × 3 = 9`
- `answer[3] = (-1) × 1 × 0 × 3 = 0`
- `answer[4] = (-1) × 1 × 0 × (-3) = 0`

### Constraints

- `2 <= nums.length <= 10^5`
- `-30 <= nums[i] <= 30`
- The input is generated such that `answer[i]` is guaranteed to fit in a 32-bit integer.

### Follow up

Can you solve the problem in O(1) extra space complexity? (The output array does not count as extra space for space complexity analysis.)

---

## Intuition

The problem asks for the product of all elements except the current one. A naive approach would be to compute the total product and then divide by each element. However, this has two issues:

1. **Division is not allowed** per the problem constraints
2. **Zero handling**: If any element is zero, division would cause division by zero errors

The key insight is that the product of all elements except `nums[i]` can be computed as:
```
product[i] = (product of all elements to the left of i) × (product of all elements to the right of i)
```

This allows us to solve the problem without division by using prefix and suffix products.

---

## Approaches

### Approach 1: Prefix and Suffix Products (Optimal)

**Idea:** Use two passes to compute prefix products from left and suffix products from right. The result for each position is the product of its prefix and suffix.

**Steps:**
1. Initialize result array with 1s
2. Calculate prefix products from left to right, storing in result
3. Calculate suffix products from right to left, multiplying with existing result values
4. Return the result array

**Python Implementation:**
```python
from typing import List

class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        res = [1] * n
        
        # Calculate prefix products
        left = 1
        for i in range(n):
            res[i] = left
            left *= nums[i]
        
        # Calculate suffix products and multiply with prefix
        right = 1
        for i in range(n - 1, -1, -1):
            res[i] *= right
            right *= nums[i]
        
        return res
```

---

### Approach 2: Using Extra Arrays (Not Optimal)

**Idea:** Use two separate arrays to store prefix and suffix products, then multiply them together.

**Steps:**
1. Create prefix array where `prefix[i]` = product of all elements from 0 to i-1
2. Create suffix array where `suffix[i]` = product of all elements from i+1 to n-1
3. Result[i] = prefix[i] × suffix[i]

**Python Implementation:**
```python
from typing import List

class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        prefix = [1] * n
        suffix = [1] * n
        result = [1] * n
        
        # Calculate prefix products
        for i in range(1, n):
            prefix[i] = prefix[i - 1] * nums[i - 1]
        
        # Calculate suffix products
        for i in range(n - 2, -1, -1):
            suffix[i] = suffix[i + 1] * nums[i + 1]
        
        # Combine prefix and suffix
        for i in range(n):
            result[i] = prefix[i] * suffix[i]
        
        return result
```

**Complexity Analysis:**
- Time Complexity: O(n)
- Space Complexity: O(n) extra (two extra arrays)

This approach uses more space than necessary and is not optimal.

---

### Approach 3: Division Approach (Not Allowed, But Educational)

**Idea:** Calculate total product and divide by each element.

**Python Implementation:**
```python
from typing import List

class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        total_product = 1
        zero_count = nums.count(0)
        n = len(nums)
        result = [0] * n
        
        if zero_count > 1:
            # More than one zero, all products are zero
            return result
        
        # Calculate product of non-zero elements
        for num in nums:
            if num != 0:
                total_product *= num
        
        if zero_count == 1:
            # Only one zero, find the non-zero element
            for i, num in enumerate(nums):
                if num == 0:
                    result[i] = total_product
                else:
                    result[i] = 0
        else:
            # No zeros, normal division
            for i, num in enumerate(nums):
                result[i] = total_product // num
        
        return result
```

**Note:** This approach uses division which is not allowed per the problem constraints. It's shown for educational purposes only.

**Complexity Analysis:**
- Time Complexity: O(n)
- Space Complexity: O(1) extra

---

## Complexity Analysis Summary

| Approach | Time Complexity | Space Complexity | Division Used |
|----------|-----------------|------------------|---------------|
| Prefix & Suffix (Optimal) | O(n) | O(1) | No |
| Extra Arrays | O(n) | O(n) | No |
| Division (Not Allowed) | O(n) | O(1) | Yes |

---

## Step-by-Step Walkthrough

For `nums = [1,2,3,4]`:

### Step 1: Initialize
```
res = [1, 1, 1, 1]
```

### Step 2: Prefix Pass
```
i=0: res[0] = 1, left = 1 * 1 = 1
i=1: res[1] = 1, left = 1 * 2 = 2
i=2: res[2] = 2, left = 2 * 3 = 6
i=3: res[3] = 6, left = 6 * 4 = 24
res = [1, 1, 2, 6]
```

### Step 3: Suffix Pass
```
i=3: res[3] = 6 * 1 = 6, right = 1 * 4 = 4
i=2: res[2] = 2 * 4 = 8, right = 4 * 3 = 12
i=1: res[1] = 1 * 12 = 12, right = 12 * 2 = 24
i=0: res[0] = 1 * 24 = 24, right = 24 * 1 = 24
res = [24, 12, 8, 6]
```

### Step 4: Return Result
```
Output: [24, 12, 8, 6]
```

---

## Related Problems

1. **[238. Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)** - The original problem
2. **[268. Missing Number](https://leetcode.com/problems/missing-number/)** - Uses similar XOR or product-sum approach
3. **[41. First Missing Positive](https://leetcode.com/problems/first-missing-positive/)** - Array indexing and marking technique
4. **[442. Find All Duplicates in an Array](https://leetcode.com/problems/find-all-duplicates-in-an-array/)** - In-place array marking
5. **[287. Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)** - O(1) space approach
6. **[448. Find All Numbers Disappeared in an Array](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/)** - Similar in-place technique

---

## Video Tutorials

1. **[NeetCode - Product of Array Except Self](https://www.youtube.com/watch?v=1L3b1TbXlTs)** - Clear explanation with animations
2. **[Back to Back SWE - Product of Array Except Self](https://www.youtube.com/watch?v=Gnp59GrQml0)** - Detailed walkthrough
3. **[Abdul Bari - Product of Array Except Self](https://www.youtube.com/watch?v=1L3b1TbXlTs)** - Algorithm explanation
4. **[LeetCode Official Solution](https://www.youtube.com/watch?v=0D7E2bwGibs)** - Official approach

---

## Key Takeaways

1. **Prefix-Suffix Trick**: The key insight is that the product except self = prefix × suffix
2. **O(1) Space**: We can achieve O(1) extra space by reusing the output array
3. **No Division**: This approach works even with zeros in the array
4. **Two Passes**: We need two passes (left-to-right and right-to-left)
5. **Edge Cases**: Handles arrays with zeros naturally without special cases

---

## Follow Up Questions

**Q: How would you handle if the array contains very large numbers that might cause overflow?**  
A: The problem states that the product fits in a 32-bit integer. In practice, you could use long/big integers or modulo arithmetic depending on requirements.

**Q: Can this be done with a single pass?**  
A: No, because you need both prefix and suffix information, which requires two passes (or a clever data structure).

**Q: How would you modify this for a circular array?**  
A: For a circular array, you'd need to compute the total product once and handle wrap-around cases, but this would require additional space or multiple passes.

---

## References

- [LeetCode 238 - Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)
- [GeeksforGeeks - Product of an array except self](https://www.geeksforgeeks.org/product-array-except-self/)
- [InterviewBit - Product of array except self](https://www.interviewbit.com/problems/product-of-array-except-self/)

