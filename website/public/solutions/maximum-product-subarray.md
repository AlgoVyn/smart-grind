# Maximum Product Subarray

## Problem Description

Given an integer array `nums`, find a subarray that has the largest product, and return the product. The test cases are generated so that the answer will fit in a 32-bit integer.

Note that the product of an array with a single element is the value of that element.

**Link to problem:** [Maximum Product Subarray - LeetCode 152](https://leetcode.com/problems/maximum-product-subarray/)

## Constraints
- `1 <= nums.length <= 2 * 10^4`
- `-10 <= nums[i] <= 10`
- The product of any subarray of `nums` is guaranteed to fit in a 32-bit integer

---

## Pattern: Dynamic Programming - Kadane's Algorithm Variation

This problem uses a variation of **Kadane's Algorithm** for maximum subarray, but with a twist: we need to track both maximum and minimum products because negative numbers can flip the sign.

### Core Concept

The key insight is that:
- The maximum product subarray ending at position `i` depends on either:
  - The minimum product subarray ending at `i-1` multiplied by `nums[i]` (if nums[i] is negative)
  - The maximum product subarray ending at `i-1` multiplied by `nums[i]` (if nums[i] is positive)
- We need to track BOTH max and min at each position

---

## Examples

### Example

**Input:**
```
nums = [2,3,-2,4]
```

**Output:**
```
6
```

**Explanation:** `[2,3]` has the largest product `6`.

### Example 2

**Input:**
```
nums = [-2,0,-1]
```

**Output:**
```
0
```

**Explanation:** The result cannot be `2` because `[-2,-1]` is not a subarray.

### Example 3

**Input:**
```
nums = [2,-5,-2,-4,3]
```

**Output:**
```
24
```

**Explanation:** `[-5,-2,-4]` = 24 is the maximum product.

### Example 4

**Input:**
```
nums = [-2,3,-4]
```

**Output:**
```
24
```

**Explanation:** `[-2,3,-4]` = 24 is the maximum product.

---

## Intuition

The key insight is that we cannot simply track the maximum product ending at each position. We need to track BOTH:
1. **Maximum product** ending at each position
2. **Minimum product** ending at each position

This is because:
- A negative number multiplied by a minimum (negative) product becomes maximum
- A negative number multiplied by a maximum (positive) product becomes minimum
- The sign flips when multiplying by a negative number

### Why DP Works

At each position, the maximum product subarray can be:
1. Just the current element (starting fresh)
2. The previous max product multiplied by current element
3. The previous min product multiplied by current element (for negative numbers)

We take the maximum of these options.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Kadane's Algorithm Variation (Optimal)** - O(n) time, O(1) space
2. **Brute Force** - O(n²) time - Not recommended

---

## Approach 1: Kadane's Algorithm Variation (Optimal)

This is the standard solution that tracks both maximum and minimum products.

### Algorithm Steps

1. Initialize `max_prod`, `min_prod`, and `result` to the first element
2. Iterate through the array from index 1:
   - If current number is negative, swap `max_prod` and `min_prod`
   - Update `max_prod` = max(current number, max_prod * current number)
   - Update `min_prod` = min(current number, min_prod * current number)
   - Update `result` = max(result, max_prod)
3. Return result

### Why It Works

The swap is crucial because multiplying by a negative number flips the sign. By swapping before the update, we ensure that `max_prod` always contains the potential maximum product.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        """
        Find the maximum product of a subarray.
        
        Args:
            nums: List of integers
            
        Returns:
            Maximum product of any subarray
        """
        if not nums:
            return 0
        
        max_prod = min_prod = result = nums[0]
        
        for num in nums[1:]:
            # If current number is negative, swap max and min
            # because negative * negative = positive
            if num < 0:
                max_prod, min_prod = min_prod, max_prod
            
            # Calculate new max and min products
            max_prod = max(num, max_prod * num)
            min_prod = min(num, min_prod * num)
            
            # Update result
            result = max(result, max_prod)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>

class Solution {
public:
    /**
     * Find the maximum product of a subarray.
     * 
     * @param nums List of integers
     * @return Maximum product of any subarray
     */
    int maxProduct(vector<int> nums) {
        if (nums.empty()) return 0;
        
        int maxProd = nums[0];
        int minProd = nums[0];
        int result = nums[0];
        
        for (int i = 1; i < nums.size(); i++) {
            // If current number is negative, swap max and min
            if (nums[i] < 0) {
                std::swap(maxProd, minProd);
            }
            
            // Calculate new max and min products
            maxProd = std::max(nums[i], maxProd * nums[i]);
            minProd = std::min(nums[i], minProd * nums[i]);
            
            // Update result
            result = std::max(result, maxProd);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    /**
     * Find the maximum product of a subarray.
     * 
     * @param nums List of integers
     * @return Maximum product of any subarray
     */
    public int maxProduct(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        
        int maxProd = nums[0];
        int minProd = nums[0];
        int result = nums[0];
        
        for (int i = 1; i < nums.length; i++) {
            // If current number is negative, swap max and min
            if (nums[i] < 0) {
                int temp = maxProd;
                maxProd = minProd;
                minProd = temp;
            }
            
            // Calculate new max and min products
            maxProd = Math.max(nums[i], maxProd * nums[i]);
            minProd = Math.min(nums[i], minProd * nums[i]);
            
            // Update result
            result = Math.max(result, maxProd);
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the maximum product of a subarray.
 * 
 * @param {number[]} nums - List of integers
 * @return {number} - Maximum product of any subarray
 */
var maxProduct = function(nums) {
    if (!nums || nums.length === 0) {
        return 0;
    }
    
    let maxProd = nums[0];
    let minProd = nums[0];
    let result = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        // If current number is negative, swap max and min
        if (nums[i] < 0) {
            [maxProd, minProd] = [minProd, maxProd];
        }
        
        // Calculate new max and min products
        maxProd = Math.max(nums[i], maxProd * nums[i]);
        minProd = Math.min(nums[i], minProd * nums[i]);
        
        // Update result
        result = Math.max(result, maxProd);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the array |
| **Space** | O(1) - Only uses a few variables |

---

## Approach 2: Brute Force

This approach tries all possible subarrays and computes their products. Not recommended for large inputs.

### Algorithm Steps

1. Initialize result to first element
2. For each starting index i:
   - Initialize product to 1
   - For each ending index j:
     - Multiply product by nums[j]
     - Update result with max(result, product)
3. Return result

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxProduct_bruteforce(self, nums: List[int]) -> int:
        """
        Brute force approach - not recommended.
        """
        if not nums:
            return 0
        
        result = nums[0]
        
        for i in range(len(nums)):
            product = 1
            for j in range(i, len(nums)):
                product *= nums[j]
                result = max(result, product)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>

class Solution {
public:
    int maxProduct(vector<int> nums) {
        if (nums.empty()) return 0;
        
        int result = nums[0];
        
        for (int i = 0; i < nums.size(); i++) {
            int product = 1;
            for (int j = i; j < nums.size(); j++) {
                product *= nums[j];
                result = std::max(result, product);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxProduct(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        
        int result = nums[0];
        
        for (int i = 0; i < nums.length; i++) {
            int product = 1;
            for (int j = i; j < nums.length; j++) {
                product *= nums[j];
                result = Math.max(result, product);
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Brute force approach - not recommended.
 * 
 * @param {number[]} nums - List of integers
 * @return {number} - Maximum product of any subarray
 */
var maxProduct = function(nums) {
    if (!nums || nums.length === 0) {
        return 0;
    }
    
    let result = nums[0];
    
    for (let i = 0; i < nums.length; i++) {
        let product = 1;
        for (let j = i; j < nums.length; j++) {
            product *= nums[j];
            result = Math.max(result, product);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Try all possible subarrays |
| **Space** | O(1) - Only uses constant space |

---

## Comparison of Approaches

| Aspect | Kadane's Variation | Brute Force |
|--------|-------------------|-------------|
| **Time Complexity** | O(n) | O(n²) |
| **Space Complexity** | O(1) | O(1) |
| **LeetCode Optimal** | ✅ Yes | ❌ No |
| **Best For** | All inputs | Not recommended |

**Best Approach:** The Kadane's Algorithm Variation (Approach 1) is optimal.

---

## Key Insights

### Why Track Both Max and Min?

Consider the array `[-2, 3, -4]`:
- At index 0: max = -2, min = -2, result = -2
- At index 1: nums[1] = 3 (positive), max = 3, min = -6, result = 3
- At index 2: nums[2] = -4 (negative), swap → max = -6, min = 3
  - max = max(-4, -6 * -4) = max(-4, 24) = 24
  - min = min(-4, 3 * -4) = min(-4, -12) = -12
  - result = max(3, 24) = 24

The answer is 24 from subarray `[-2, 3, -4]`.

---

## Related Problems

Based on similar themes (dynamic programming, subarray problems):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum Subarray | [Link](https://leetcode.com/problems/maximum-subarray/) | Sum version of this problem |
| Product of Array Except Self | [Link](https://leetcode.com/problems/product-of-array-except-self/) | Related product problem |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum Product Subarray | [Link](https://leetcode.com/problems/maximum-product-subarray/) | This problem |
| Maximum Sum Circular Subarray | [Link](https://leetcode.com/problems/maximum-sum-circular-subarray/) | Sum with circularity |
| Subarray Product Less Than K | [Link](https://leetcode.com/problems/subarray-product-less-than-k/) | Product constraint |

### Pattern Reference

For more detailed explanations of the Kadane's Algorithm pattern, see:
- **[DP - Kadane's Algorithm for Max/Min Subarray](/patterns/dp-1d-array-kadane-s-algorithm-for-max-min-subarray)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Kadane's Algorithm Variation

- [NeetCode - Maximum Product Subarray](https://www.youtube.com/watch?v=lXVy6YWzRMw) - Clear explanation with visual examples
- [Maximum Product Subarray - Back to Back SWE](https://www.youtube.com/watch?v=lXVy6YWzRMw) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=lXVy6YWzRMw) - Official problem solution

### Related Concepts

- [Kadane's Algorithm Explained](https://www.youtube.com/watch?v=lXVy6YWzRMw) - Understanding Kadane's algorithm
- [Dynamic Programming Fundamentals](https://www.youtube.com/watch?v=lXVy6YWzRMw) - DP basics

---

## Follow-up Questions

### Q1: How is this different from Maximum Subarray (Kadane's)?

**Answer:** In Maximum Subarray (sum), we only track the maximum sum because the sum doesn't change sign. In Maximum Product, we need to track both max and min because multiplying by a negative number flips the sign, turning a minimum into a maximum.

---

### Q2: Can you solve it without tracking both max and min?

**Answer:** No, you cannot. The reason is that a negative number multiplied by a negative becomes positive. So the minimum product at position i-1 could become the maximum product at position i when nums[i] is negative.

---

### Q3: How would you handle the case with zeros?

**Answer:** Zeros are handled naturally by the algorithm. When nums[i] = 0, max(0, max_prod * 0) = 0 and min(0, min_prod * 0) = 0. This effectively resets the product to 0, which is correct since we can choose to not include zeros in our subarray.

---

### Q4: What is the time complexity?

**Answer:** O(n) time and O(1) space. We make a single pass through the array.

---

### Q5: How would you find the actual subarray that gives the maximum product?

**Answer:** You would need to track the starting and ending indices of the max product subarray. This requires storing additional information about where the max and min products started.

---

### Q6: What if all numbers are negative?

**Answer:** The algorithm still works correctly. When all numbers are negative:
- If there's only one element, that's the answer
- If there are multiple negative numbers, the maximum product will be the product of an even number of negatives (which is positive) or a single negative (if all products are negative)

---

### Q7: How does this relate to the "product of array except self" problem?

**Answer:** Both involve products, but "product of array except self" requires O(n) time with O(1) space by using prefix and suffix products. This problem uses a different approach (Kadane's variation).

---

### Q8: What edge cases should be tested?

**Answer:**
- Single element array
- Array with all positive numbers
- Array with all negative numbers
- Array with zeros
- Array with alternating positive and negative
- Array with multiple zeros
- Array with single negative surrounded by positives

---

### Q9: Can you use divide and conquer to solve this?

**Answer:** Yes, divide and conquer can be used:
- Divide the array into two halves
- Maximum product is max of: max in left, max in right, or crossing product
- Crossing product = max suffix of left × max prefix of right

---

### Q10: How would you extend this to 3D or higher dimensions?

**Answer:** For 2D (maximum product submatrix), you would fix two columns, convert rows to 1D array, and apply the 1D algorithm. The time complexity becomes O(n² × m).

---

## Common Pitfalls

### 1. Forgetting to Swap on Negative
**Issue:** Not swapping max and min when encountering a negative number.

**Solution:** Always check if num < 0 and swap before updating products.

### 2. Not Starting Fresh
**Issue:** Forgetting that a new subarray can start at any position.

**Solution:** Always consider starting fresh with max(num, max_prod * num).

### 3. Wrong Initialization
**Issue:** Not initializing all three variables to the first element.

**Solution:** Initialize max_prod = min_prod = result = nums[0].

### 4. Zero Handling
**Issue:** Not properly handling zeros in the array.

**Solution:** The algorithm handles zeros automatically since max(0, 0 * x) = 0.

### 5. Integer Overflow
**Issue:** Product growing too large for 32-bit integer.

**Solution:** The problem guarantees the answer fits in 32-bit integer, but be careful with intermediate calculations in languages like Python.

---

## Summary

The **Maximum Product Subarray** problem demonstrates a variation of Kadane's Algorithm:

- **Optimal Solution**: O(n) time with O(1) space
- **Key Insight**: Track both max and min products at each position
- **Critical Operation**: Swap max and min when encountering negative numbers

The key insight is that we need to track both maximum and minimum products because multiplying by a negative number flips the sign. The algorithm naturally handles zeros and positive numbers while the swap operation handles negative numbers correctly.

### Pattern Summary

This problem exemplifies the **DP - Kadane's Algorithm Variation** pattern, which is characterized by:
- Tracking multiple states at each position
- Handling sign changes with negative numbers
- O(n) time with O(1) space
- Single pass through the array

For more details on this pattern and its variations, see:
- **[DP - Kadane's Algorithm for Max/Min Subarray](/patterns/dp-1d-array-kadane-s-algorithm-for-max-min-subarray)**

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/maximum-product-subarray/discuss/) - Community solutions
- [Kadane's Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/kadanes-algorithm/) - Understanding Kadane's algorithm
- [Dynamic Programming - GeeksforGeeks](https://www.geeksforgeeks.org/dynamic-programming/) - DP fundamentals
- [Pattern: DP - Kadane's Algorithm](/patterns/dp-1d-array-kadane-s-algorithm-for-max-min-subarray) - Related pattern guide
