# Array - Product Except Self (Prefix/Suffix Products)

## Problem Description

The Array - Product Except Self pattern is used to calculate the product of all elements in an array except the element at the current index, without using division. This is done efficiently using prefix and suffix product arrays or optimized in-place approaches. It's a fundamental pattern for array transformation problems and appears frequently in interviews.

### Key Characteristics
| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - two passes through array |
| Space Complexity | O(1) excluding output, O(n) for output |
| Input | Array of integers (may contain zeros) |
| Output | Array where each element is product of all others |
| Constraint | Cannot use division operation |

### When to Use
- When you need to compute products of all other elements for each position
- Problems with O(1) extra space constraint (excluding output)
- When the array may contain zeros (division would fail)
- Array transformation problems requiring left-to-right and right-to-left passes
- Problems involving cumulative products from both directions

## Intuition

The key insight is that the product of all elements except `nums[i]` can be decomposed into:
- **Product of all elements to the left** of `i` (prefix product)
- **Product of all elements to the right** of `i` (suffix product)

The "aha!" moments:
1. `result[i] = (product of elements before i) × (product of elements after i)`
2. We can compute prefix products in one left-to-right pass
3. We can compute suffix products and combine in one right-to-left pass
4. We can do this **in-place** using the output array for prefix, then multiplying with suffix on the fly

## Solution Approaches

### Approach 1: Prefix and Suffix Arrays (Two Arrays) ✅ Easy to Understand

#### Algorithm
1. Create prefix array where `prefix[i]` = product of all elements before index i
2. Create suffix array where `suffix[i]` = product of all elements after index i
3. Result at each index is `prefix[i] × suffix[i]`

#### Implementation

````carousel
```python
def product_except_self(nums):
    """
    Calculate product of array except self using prefix and suffix arrays.
    
    Time: O(n), Space: O(n) for prefix and suffix arrays
    """
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
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    std::vector<int> productExceptSelf(std::vector<int>& nums) {
        int n = nums.size();
        std::vector<int> prefix(n, 1);
        std::vector<int> suffix(n, 1);
        std::vector<int> result(n);
        
        // Calculate prefix products
        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i - 1] * nums[i - 1];
        }
        
        // Calculate suffix products
        for (int i = n - 2; i >= 0; i--) {
            suffix[i] = suffix[i + 1] * nums[i + 1];
        }
        
        // Combine prefix and suffix
        for (int i = 0; i < n; i++) {
            result[i] = prefix[i] * suffix[i];
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] prefix = new int[n];
        int[] suffix = new int[n];
        int[] result = new int[n];
        
        Arrays.fill(prefix, 1);
        Arrays.fill(suffix, 1);
        
        // Calculate prefix products
        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i - 1] * nums[i - 1];
        }
        
        // Calculate suffix products
        for (int i = n - 2; i >= 0; i--) {
            suffix[i] = suffix[i + 1] * nums[i + 1];
        }
        
        // Combine prefix and suffix
        for (int i = 0; i < n; i++) {
            result[i] = prefix[i] * suffix[i];
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
function productExceptSelf(nums) {
    const n = nums.length;
    const prefix = new Array(n).fill(1);
    const suffix = new Array(n).fill(1);
    const result = new Array(n);
    
    // Calculate prefix products
    for (let i = 1; i < n; i++) {
        prefix[i] = prefix[i - 1] * nums[i - 1];
    }
    
    // Calculate suffix products
    for (let i = n - 2; i >= 0; i--) {
        suffix[i] = suffix[i + 1] * nums[i + 1];
    }
    
    // Combine prefix and suffix
    for (let i = 0; i < n; i++) {
        result[i] = prefix[i] * suffix[i];
    }
    
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n) - three passes through array |
| Space | O(n) for prefix and suffix arrays |

### Approach 2: O(1) Space - Prefix in Output, Suffix on the Fly (Optimal) ✅ Recommended

#### Algorithm
1. Use output array to store prefix products in first pass (left to right)
2. In second pass (right to left), maintain a running suffix product
3. Multiply each prefix in output array with the running suffix product

#### Implementation

````carousel
```python
def product_except_self(nums):
    """
    Calculate product of array except self with O(1) extra space.
    LeetCode 238 - Product of Array Except Self
    
    Time: O(n), Space: O(1) excluding output
    """
    n = len(nums)
    result = [1] * n
    
    # First pass: calculate prefix products and store in result
    prefix = 1
    for i in range(n):
        result[i] = prefix
        prefix *= nums[i]
    
    # Second pass: calculate suffix products and multiply with prefix
    suffix = 1
    for i in range(n - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]
    
    return result
```
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    std::vector<int> productExceptSelf(std::vector<int>& nums) {
        int n = nums.size();
        std::vector<int> result(n);
        
        // First pass: calculate prefix products
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            result[i] = prefix;
            prefix *= nums[i];
        }
        
        // Second pass: calculate suffix and multiply with prefix
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
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        
        // First pass: calculate prefix products
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            result[i] = prefix;
            prefix *= nums[i];
        }
        
        // Second pass: calculate suffix and multiply with prefix
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
function productExceptSelf(nums) {
    const n = nums.length;
    const result = new Array(n);
    
    // First pass: calculate prefix products
    let prefix = 1;
    for (let i = 0; i < n; i++) {
        result[i] = prefix;
        prefix *= nums[i];
    }
    
    // Second pass: calculate suffix and multiply with prefix
    let suffix = 1;
    for (let i = n - 1; i >= 0; i--) {
        result[i] *= suffix;
        suffix *= nums[i];
    }
    
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n) - two passes through array |
| Space | O(1) auxiliary, O(n) for output |

### Approach 3: With Division (Not Recommended)

This approach calculates the total product and divides by each element. It fails if there are zeros in the array.

#### Implementation

````carousel
```python
def product_except_self_division(nums):
    """
    Calculate using division - NOT RECOMMENDED.
    Fails if array contains zeros.
    
    Time: O(n), Space: O(1)
    """
    total_product = 1
    zero_count = 0
    
    for num in nums:
        if num == 0:
            zero_count += 1
        else:
            total_product *= num
    
    if zero_count > 1:
        return [0] * len(nums)
    
    result = []
    for num in nums:
        if zero_count == 1:
            result.append(total_product if num == 0 else 0)
        else:
            result.append(total_product // num)
    
    return result
```
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    std::vector<int> productExceptSelf(std::vector<int>& nums) {
        long long totalProduct = 1;
        int zeroCount = 0;
        
        for (int num : nums) {
            if (num == 0) zeroCount++;
            else totalProduct *= num;
        }
        
        std::vector<int> result(nums.size());
        for (int i = 0; i < nums.size(); i++) {
            if (zeroCount > 1) result[i] = 0;
            else if (zeroCount == 1) {
                result[i] = (nums[i] == 0) ? totalProduct : 0;
            } else {
                result[i] = totalProduct / nums[i];
            }
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        long totalProduct = 1;
        int zeroCount = 0;
        
        for (int num : nums) {
            if (num == 0) zeroCount++;
            else totalProduct *= num;
        }
        
        int[] result = new int[nums.length];
        for (int i = 0; i < nums.length; i++) {
            if (zeroCount > 1) result[i] = 0;
            else if (zeroCount == 1) {
                result[i] = (nums[i] == 0) ? (int)totalProduct : 0;
            } else {
                result[i] = (int)(totalProduct / nums[i]);
            }
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
function productExceptSelf(nums) {
    let totalProduct = 1;
    let zeroCount = 0;
    
    for (const num of nums) {
        if (num === 0) zeroCount++;
        else totalProduct *= num;
    }
    
    return nums.map(num => {
        if (zeroCount > 1) return 0;
        if (zeroCount === 1) return num === 0 ? totalProduct : 0;
        return totalProduct / num;
    });
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(1) excluding output |
| Limitation | Fails with integer overflow, not allowed by problem constraints |

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Prefix + Suffix Arrays | O(n) | O(n) | Easy to understand, good for learning |
| O(1) Space (Optimal) | O(n) | O(1) aux | **Recommended** - meets constraints |
| With Division | O(n) | O(1) | Not allowed by problem, handles zeros poorly |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) | 238 | Medium | Classic problem, O(1) space required |
| [Minimum Index Sum of Two Lists](https://leetcode.com/problems/minimum-index-sum-of-two-lists/) | 599 | Easy | Find common interest with least index sum |
| [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) | 42 | Hard | Uses left/right max arrays (similar concept) |
| [Container With Most Water](https://leetcode.com/problems/container-with-most-water/) | 11 | Medium | Two-pointer approach |
| [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/) | 152 | Medium | Track max/min products ending at each index |
| [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k/) | 713 | Medium | Sliding window with products |
| [Construct Product Matrix](https://leetcode.com/problems/construct-product-matrix/) | 2906 | Medium | 2D version of product except self |

## Video Tutorial Links

1. **[NeetCode - Product of Array Except Self](https://www.youtube.com/watch?v=bNvIQI2wAjk)** - O(1) space approach
2. **[Back To Back SWE - Product Except Self](https://www.youtube.com/watch?v=bNvIQI2wAjk)** - Prefix/suffix explanation
3. **[Kevin Naughton Jr. - LeetCode 238](https://www.youtube.com/watch?v=bNvIQI2wAjk)** - Clean implementation
4. **[Nick White - Product of Array Except Self](https://www.youtube.com/watch?v=bNvIQI2wAjk)** - Multiple approaches
5. **[Tech With Tim - Prefix/Suffix Products](https://www.youtube.com/watch?v=bNvIQI2wAjk)** - Pattern explanation

## Summary

### Key Takeaways
- **result[i] = (product of elements before i) × (product of elements after i)**
- **O(1) space approach**: Store prefix products in output, multiply with suffix on-the-fly in reverse pass
- **Cannot use division** - especially problematic with zeros
- **When to apply**: Any problem requiring products from both left and right directions

### Common Pitfalls
- Using division (often explicitly prohibited, fails with zeros)
- Not handling the O(1) space constraint correctly
- Off-by-one errors in prefix/suffix calculations
- Integer overflow (especially in languages without big integers)
- Not initializing prefix/suffix variables to 1

### Follow-up Questions
1. **Can you solve this with only one pass?**
   - No, you need information from both sides of each index

2. **What if you need to return the result modulo 10^9+7?**
   - Apply modulo at each multiplication step to prevent overflow

3. **How would you handle this for a 2D matrix?**
   - Compute row-wise prefix/suffix, then column-wise, or use inclusion-exclusion

4. **What if the array can be modified?**
   - Could use the array itself for storage (log values, more complex)

## Pattern Source

[Product Except Self Pattern](patterns/array-product-except-self-prefix-suffix-products.md)
