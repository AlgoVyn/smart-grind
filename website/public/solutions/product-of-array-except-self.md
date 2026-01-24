# Product of Array Except Self

## Problem Description

Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.

The product of any prefix or suffix of `nums` is guaranteed to fit in a **32-bit** integer.

You must write an algorithm that runs in **O(n)** time and **without using division**.

This is a classic problem that tests your ability to:
1. Optimize space complexity
2. Use prefix/suffix product technique
3. Handle edge cases with zeros
4. Think in terms of product decomposition

---

## Examples

**Example 1:**
```python
Input: nums = [1,2,3,4]
Output: [24,12,8,6]
Explanation:
- For index 0: 2*3*4 = 24
- For index 1: 1*3*4 = 12
- For index 2: 1*2*4 = 8
- For index 3: 1*2*3 = 6
```

**Example 2:**
```python
Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]
Explanation:
- For index 0: 1*0*-3*3 = 0
- For index 1: -1*0*-3*3 = 0
- For index 2: -1*1*-3*3 = 9
- For index 3: -1*1*0*3 = 0
- For index 4: -1*1*0*-3 = 0
```

**Example 3:**
```python
Input: nums = [2,3]
Output: [3,2]
Explanation:
- For index 0: 3 = 3
- For index 1: 2 = 2
```

**Example 4:**
```python
Input: nums = [0,0]
Output: [0,0]
Explanation:
- Both elements are zero, so all products are zero
```

---

## Constraints

- `2 <= nums.length <= 10^5`
- `-30 <= nums[i] <= 30`
- The product of all possible prefix products of `nums` is guaranteed to fit in a **32-bit** integer
- **Do not use division** in your solution

---

## Intuition

The key insight to solve this problem efficiently is to **decompose the product into prefix and suffix components**:

For each position `i`, the product of all elements except `nums[i]` can be expressed as:

```
product[i] = (product of all elements to the LEFT of i) × (product of all elements to the RIGHT of i)
```

This means we can precompute:
1. **Prefix products**: The product of all elements before each index
2. **Suffix products**: The product of all elements after each index

By multiplying these two values for each index, we get the desired result without using division.

---

## Approach 1: Brute Force with Division (Not Allowed) ⛔

### Algorithm
This approach is included only to show why it doesn't work for this problem:
1. Calculate the total product of all elements
2. Divide total product by each element to get the result

**Note**: This approach fails when there are zeros in the array, and the problem explicitly states not to use division.

### Code

#### Python
```python
# This approach is NOT valid for this problem!
def product_except_self_bruteforce(nums):
    total_product = 1
    for num in nums:
        total_product *= num
    
    result = []
    for num in nums:
        if num == 0:
            result.append(0)  # Incorrect - this doesn't work for multiple zeros
        else:
            result.append(total_product // num)
    
    return result
```

### Time Complexity
**O(n)** - One pass to calculate total, one pass to divide

### Space Complexity
**O(1)** - Only using a few variables

### Why This Approach Fails
1. **Division not allowed** by problem constraints
2. **Zeros cause issues** - division by zero, and multiple zeros give wrong results
3. **Integer overflow** possible with large products

---

## Approach 2: Prefix and Suffix Arrays (O(n) time, O(n) space)

### Algorithm
1. Create an array `prefix` where `prefix[i]` is the product of all elements from index 0 to i-1
2. Create an array `suffix` where `suffix[i]` is the product of all elements from index i+1 to n-1
3. The result for index `i` is `prefix[i] × suffix[i]`

### Code

````carousel
```python
from typing import List

class Solution:
    def productExceptSelf_prefix_suffix(self, nums: List[int]) -> List[int]:
        n = len(nums)
        prefix = [1] * n
        suffix = [1] * n
        result = [1] * n
        
        # Build prefix array
        for i in range(1, n):
            prefix[i] = prefix[i - 1] * nums[i - 1]
        
        # Build suffix array
        for i in range(n - 2, -1, -1):
            suffix[i] = suffix[i + 1] * nums[i + 1]
        
        # Multiply prefix and suffix
        for i in range(n):
            result[i] = prefix[i] * suffix[i]
        
        return result
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> prefix(n, 1);
        vector<int> suffix(n, 1);
        vector<int> result(n, 1);
        
        // Build prefix array
        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i - 1] * nums[i - 1];
        }
        
        // Build suffix array
        for (int i = n - 2; i >= 0; i--) {
            suffix[i] = suffix[i + 1] * nums[i + 1];
        }
        
        // Multiply prefix and suffix
        for (int i = 0; i < n; i++) {
            result[i] = prefix[i] * suffix[i];
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] prefix = new int[n];
        int[] suffix = new int[n];
        int[] result = new int[n];
        
        // Build prefix array
        prefix[0] = 1;
        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i - 1] * nums[i - 1];
        }
        
        // Build suffix array
        suffix[n - 1] = 1;
        for (int i = n - 2; i >= 0; i--) {
            suffix[i] = suffix[i + 1] * nums[i + 1];
        }
        
        // Multiply prefix and suffix
        for (int i = 0; i < n; i++) {
            result[i] = prefix[i] * suffix[i];
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function(nums) {
    const n = nums.length;
    const prefix = new Array(n).fill(1);
    const suffix = new Array(n).fill(1);
    const result = new Array(n).fill(1);
    
    // Build prefix array
    for (let i = 1; i < n; i++) {
        prefix[i] = prefix[i - 1] * nums[i - 1];
    }
    
    // Build suffix array
    for (let i = n - 2; i >= 0; i--) {
        suffix[i] = suffix[i + 1] * nums[i + 1];
    }
    
    // Multiply prefix and suffix
    for (let i = 0; i < n; i++) {
        result[i] = prefix[i] * suffix[i];
    }
    
    return result;
};
```
````

### Time Complexity
**O(n)** - Three passes through the array

### Space Complexity
**O(n)** - Two additional arrays for prefix and suffix products

---

## Approach 3: Optimal (O(n) time, O(1) space) ⭐

### Algorithm
This is the optimal solution that meets the problem's requirements:
1. Use the output array to store prefix products first
2. Then traverse from right to left, multiplying suffix products with the existing prefix values

### Code

````carousel
```python
from typing import List

class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        result = [1] * n
        
        # Calculate prefix products and store in result
        prefix = 1
        for i in range(n):
            result[i] = prefix
            prefix *= nums[i]
        
        # Multiply with suffix products
        suffix = 1
        for i in range(n - 1, -1, -1):
            result[i] *= suffix
            suffix *= nums[i]
        
        return result
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n, 1);
        
        // Calculate prefix products
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            result[i] = prefix;
            prefix *= nums[i];
        }
        
        // Multiply with suffix products
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= suffix;
            suffix *= nums[i];
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Arrays.fill(result, 1);
        
        // Calculate prefix products
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            result[i] = prefix;
            prefix *= nums[i];
        }
        
        // Multiply with suffix products
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= suffix;
            suffix *= nums[i];
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function(nums) {
    const n = nums.length;
    const result = new Array(n).fill(1);
    
    // Calculate prefix products
    let prefix = 1;
    for (let i = 0; i < n; i++) {
        result[i] = prefix;
        prefix *= nums[i];
    }
    
    // Multiply with suffix products
    let suffix = 1;
    for (let i = n - 1; i >= 0; i--) {
        result[i] *= suffix;
        suffix *= nums[i];
    }
    
    return result;
};
```
````

### Time Complexity
**O(n)** - Two passes through the array

### Space Complexity
**O(1)** - Only using constant extra space (output array doesn't count)

---

## Approach 4: Handling Zeros (Edge Case Optimization)

### Algorithm
When there are zeros in the array, we need special handling:
1. Count the number of zeros in the array
2. If more than one zero exists, all products will be zero
3. If exactly one zero exists, only the position at zero will have a non-zero product
4. Otherwise, use the standard approach

### Code

````carousel
```python
from typing import List

class Solution:
    def productExceptSelf_with_zeros(self, nums: List[int]) -> List[int]:
        n = len(nums)
        zero_count = nums.count(0)
        result = [0] * n
        
        if zero_count > 1:
            # More than one zero, all products are zero
            return result
        
        if zero_count == 1:
            # Exactly one zero - calculate product of non-zero elements
            product = 1
            for num in nums:
                if num != 0:
                    product *= num
            
            for i in range(n):
                if nums[i] == 0:
                    result[i] = product
                else:
                    result[i] = 0
        else:
            # No zeros - use standard approach
            prefix = 1
            for i in range(n):
                result[i] = prefix
                prefix *= nums[i]
            
            suffix = 1
            for i in range(n - 1, -1, -1):
                result[i] *= suffix
                suffix *= nums[i]
        
        return result
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n, 0);
        int zeroCount = 0;
        
        for (int num : nums) {
            if (num == 0) zeroCount++;
        }
        
        if (zeroCount > 1) {
            return result;  // All zeros
        }
        
        if (zeroCount == 1) {
            long long product = 1;
            for (int num : nums) {
                if (num != 0) product *= num;
            }
            for (int i = 0; i < n; i++) {
                if (nums[i] == 0) {
                    result[i] = product;
                }
            }
        } else {
            // No zeros - use optimal approach
            long long prefix = 1;
            for (int i = 0; i < n; i++) {
                result[i] = prefix;
                prefix *= nums[i];
            }
            
            long long suffix = 1;
            for (int i = n - 1; i >= 0; i--) {
                result[i] *= suffix;
                suffix *= nums[i];
            }
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Arrays.fill(result, 0);
        
        int zeroCount = 0;
        for (int num : nums) {
            if (num == 0) zeroCount++;
        }
        
        if (zeroCount > 1) {
            return result;  // All zeros
        }
        
        if (zeroCount == 1) {
            long product = 1;
            for (int num : nums) {
                if (num != 0) product *= num;
            }
            for (int i = 0; i < n; i++) {
                if (nums[i] == 0) {
                    result[i] = (int) product;
                }
            }
        } else {
            // No zeros - use optimal approach
            long prefix = 1;
            for (int i = 0; i < n; i++) {
                result[i] = (int) prefix;
                prefix *= nums[i];
            }
            
            long suffix = 1;
            for (int i = n - 1; i >= 0; i--) {
                result[i] *= suffix;
                suffix *= nums[i];
            }
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function(nums) {
    const n = nums.length;
    const result = new Array(n).fill(0);
    const zeroCount = nums.filter(x => x === 0).length;
    
    if (zeroCount > 1) {
        return result;  // All zeros
    }
    
    if (zeroCount === 1) {
        let product = 1;
        for (let num of nums) {
            if (num !== 0) product *= num;
        }
        for (let i = 0; i < n; i++) {
            if (nums[i] === 0) {
                result[i] = product;
            }
        }
    } else {
        // No zeros - use optimal approach
        let prefix = 1;
        for (let i = 0; i < n; i++) {
            result[i] = prefix;
            prefix *= nums[i];
        }
        
        let suffix = 1;
        for (let i = n - 1; i >= 0; i--) {
            result[i] *= suffix;
            suffix *= nums[i];
        }
    }
    
    return result;
};
```
````

### Time Complexity
**O(n)** - Still linear time

### Space Complexity
**O(1)** - Constant extra space

---

## Step-by-Step Example

Let's trace through `nums = [1, 2, 3, 4]`:

**Step 1: Initialize result array**
```
result = [1, 1, 1, 1]
```

**Step 2: Calculate prefix products**
```
i = 0: result[0] = 1, prefix = 1 * 1 = 1
i = 1: result[1] = 1, prefix = 1 * 2 = 2
i = 2: result[2] = 2, prefix = 2 * 3 = 6
i = 3: result[3] = 6, prefix = 6 * 4 = 24
result = [1, 1, 2, 6]
```

**Step 3: Calculate suffix products and multiply**
```
i = 3: result[3] = 6 * 1 = 6, suffix = 1 * 4 = 4
i = 2: result[2] = 2 * 4 = 8, suffix = 4 * 3 = 12
i = 1: result[1] = 1 * 12 = 12, suffix = 12 * 2 = 24
i = 0: result[0] = 1 * 24 = 24, suffix = 24 * 1 = 24
result = [24, 12, 8, 6]
```

**Result: [24, 12, 8, 6]** ✓

---

## Example with Zero

Let's trace through `nums = [-1, 1, 0, -3, 3]`:

**Step 1: Calculate prefix products**
```
result = [1, -1, -1, 0, 0]
prefix = 0 (after full pass)
```

**Step 2: Calculate suffix products and multiply**
```
i = 4: result[4] = 0 * 1 = 0, suffix = 3
i = 3: result[3] = 0 * 3 = 0, suffix = 0
i = 2: result[2] = -1 * 0 = 0, suffix = 0
i = 1: result[1] = -1 * 0 = 0, suffix = 0
i = 0: result[0] = 1 * 0 = 0, suffix = 0
```

Wait, let me recalculate:

**Step 1: Calculate prefix products**
```
i = 0: result[0] = 1, prefix = 1 * -1 = -1
i = 1: result[1] = -1, prefix = -1 * 1 = -1
i = 2: result[2] = -1, prefix = -1 * 0 = 0
i = 3: result[3] = 0, prefix = 0 * -3 = 0
i = 4: result[4] = 0, prefix = 0 * 3 = 0
result = [1, -1, -1, 0, 0]
```

**Step 2: Calculate suffix products and multiply**
```
suffix = 1
i = 4: result[4] = 0 * 1 = 0, suffix = 1 * 3 = 3
i = 3: result[3] = 0 * 3 = 0, suffix = 3 * -3 = -9
i = 2: result[2] = -1 * -9 = 9, suffix = -9 * 0 = 0
i = 1: result[1] = -1 * 0 = 0, suffix = 0 * 1 = 0
i = 0: result[0] = 1 * 0 = 0, suffix = 0 * -1 = 0
```

**Result: [0, 0, 9, 0, 0]** ✓

---

## Time Complexity Comparison

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Brute Force (Division) | O(n) | O(1) | **Not allowed** - fails with zeros |
| Prefix/Suffix Arrays | O(n) | O(n) | Works but uses extra space |
| **Optimal (Recommended)** | O(n) | O(1) | **Best** - meets all constraints |
| Zero Handling | O(n) | O(1) | Explicit zero handling |

---

## Key Optimizations

1. **In-place computation**: Use the output array to store intermediate results
2. **Two-pass technique**: One left-to-right for prefixes, one right-to-left for suffixes
3. **Constant space**: Only use two extra variables (prefix and suffix)
4. **No division**: Avoids issues with zeros and integer overflow

---

## Related Problems

1. **[3Sum](3sum.md)** - Find all unique triplets that sum to zero
2. **[Subarray Product Less Than K](subarray-product-less-than-k.md)** - Count subarrays with product less than k
3. **[Maximum Product Subarray](maximum-product-subarray.md)** - Find contiguous subarray with largest product
4. **[Product of Array Except Self II](product-except-self-ii.md)** - Variant with additional constraints
5. **[Prefix Sum Pattern](binary-search-on-sorted-array-list.md)** - Related prefix/suffix techniques

---

## Video Tutorials

- [NeetCode - Product of Array Except Self](https://www.youtube.com/watch?v=bU9mB8Q7zq0)
- [Back to Back SWE - Product Except Self](https://www.youtube.com/watch?v=GYjHTqZ7J6I)
- [LeetCode Official Solution](https://www.youtube.com/watch?v=GYjHTqZ7J6I)
- [Eric Programming - O(n) Solution Explanation](https://www.youtube.com/watch?v=t1I91iaK5w4)

---

## Follow-up Questions

1. **How would you modify the solution to handle 64-bit integers?**
   - Use `long long` in C++, `long` in Java, `BigInt` in JavaScript
   - Python integers are unbounded, so no change needed

2. **What if the array contains very large numbers causing overflow?**
   - Use modular arithmetic if modulo is allowed
   - Use arbitrary precision libraries
   - Python handles this natively

3. **How would you parallelize this computation?**
   - Prefix products are inherently sequential (dependency)
   - Suffix products could be computed in parallel
   - Not practical for this problem due to dependencies

4. **What if you need the product modulo a given number?**
   - Apply modulo at each multiplication step
   - Be careful with negative numbers

5. **How would you handle an empty array?**
   - Return empty array for edge case
   - Add validation at the start

6. **What if you need to support dynamic array updates?**
   - Use segment tree or Fenwick tree
   - Each update would be O(log n)
   - Query would be O(log n)

7. **How would you verify your solution with unit tests?**
   - Test with normal cases
   - Test with single zero, multiple zeros
   - Test with negative numbers
   - Test with all ones
   - Test with large arrays

---

## Common Mistakes to Avoid

1. **Forgetting to reset suffix variable** when traversing from right to left
2. **Off-by-one errors** in loop ranges
3. **Not handling zeros correctly** in the zero-optimized approach
4. **Integer overflow** when using 32-bit integers with large products
5. **Modifying the input array** when you should use extra space
6. **Using division** which is explicitly not allowed

---

## References

- [LeetCode 238 - Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)
- Prefix/Suffix Product Technique: Common pattern for array product problems
- Space Optimization: Reducing auxiliary space complexity
