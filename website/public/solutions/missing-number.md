# Missing Number

## Problem Description

Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.

---

## Examples

### Example

**Input:**
```python
nums = [3, 0, 1]
```

**Output:**
```python
2
```

**Explanation:**
`n = 3` since there are 3 numbers, so all numbers are in the range `[0, 3]`. `2` is the missing number in the range since it does not appear in `nums`.

### Example 2

**Input:**
```python
nums = [0, 1]
```

**Output:**
```python
2
```

**Explanation:**
`n = 2` since there are 2 numbers, so all numbers are in the range `[0, 2]`. `2` is the missing number in the range since it does not appear in `nums`.

### Example 3

**Input:**
```python
nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]
```

**Output:**
```python
8
```

**Explanation:**
`n = 9` since there are 9 numbers, so all numbers are in the range `[0, 9]`. `8` is the missing number in the range since it does not appear in `nums`.

---

## Constraints

- `n == nums.length`
- `1 <= n <= 10^4`
- `0 <= nums[i] <= n`
- All the numbers of `nums` are unique

**Follow-up:** Could you implement a solution using only O(1) extra space complexity and O(n) runtime complexity?

---

## LeetCode Link

[LeetCode Problem 268: Missing Number](https://leetcode.com/problems/missing-number/)

---

## Pattern: Bit Manipulation (XOR)

This problem follows the **Bit Manipulation** pattern using XOR operations.

### Core Concept

- **XOR Properties**: `a ^ a = 0` and `a ^ 0 = a`
- **Pair Cancellation**: Numbers appearing twice cancel to 0
- **Commutative**: Order doesn't matter

### When to Use This Pattern

This pattern is applicable when:
1. Finding missing number in sequence
2. Problems requiring O(1) extra space
3. Situations where sum might overflow

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Sum Formula | n*(n+1)/2 - sum(nums) |
| Marking | Negate values at index |

---

## Intuition

The key insight is leveraging the mathematical properties of XOR or sum to find the missing number:

> If we XOR all numbers from 0 to n with all elements in the array, all present numbers cancel out, leaving only the missing number.

### Key Observations

1. **XOR Properties**: `a ^ a = 0` and `a ^ 0 = a`. XOR is also commutative and associative.

2. **Pair Cancellation**: Every number that appears in both the range [0,n] and the array will be XORed twice, canceling to 0.

3. **Single Missing**: The missing number appears only once in the XOR chain, so it remains as the result.

4. **Alternative: Sum Formula**: The sum of 0 to n is `n*(n+1)/2`. Subtract the sum of array elements to find the missing number.

### Why XOR Works

XORing all numbers from 0 to n with all array elements:
- Each present number appears twice → cancels to 0
- Missing number appears once → remains as result
- Since XOR is commutative and associative, order doesn't matter

---

## Multiple Approaches with Code

We'll cover two approaches:
1. **XOR Approach** - Optimal O(1) space
2. **Sum Approach** - Alternative solution

---

## Approach 1: XOR Approach (Optimal)

### Algorithm Steps

1. Initialize XOR result to 0
2. XOR all numbers from 0 to n (inclusive)
3. XOR all elements in the array
4. The result is the missing number

### Why It Works

The XOR approach leverages the cancellation property. Since each number from 0 to n appears exactly once in the range and (except for the missing) once in the array, they all cancel out.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        """
        Find the missing number using XOR operation.
        
        XOR properties:
        - a ^ a = 0
        - a ^ 0 = a
        - XOR is commutative and associative
        
        Args:
            nums: List of distinct integers from 0 to n
            
        Returns:
            The missing number in the range [0, n]
        """
        n = len(nums)
        xor_result = 0
        
        # XOR all numbers from 0 to n
        for i in range(n + 1):
            xor_result ^= i
        
        # XOR with all elements in the array
        for num in nums:
            xor_result ^= num
        
        return xor_result
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int missingNumber(vector<int>& nums) {
        int n = nums.size();
        int xor_result = 0;
        
        // XOR all numbers from 0 to n
        for (int i = 0; i <= n; i++) {
            xor_result ^= i;
        }
        
        // XOR with all elements in the array
        for (int num : nums) {
            xor_result ^= num;
        }
        
        return xor_result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int missingNumber(int[] nums) {
        int n = nums.length;
        int xor_result = 0;
        
        // XOR all numbers from 0 to n
        for (int i = 0; i <= n; i++) {
            xor_result ^= i;
        }
        
        // XOR with all elements in the array
        for (int num : nums) {
            xor_result ^= num;
        }
        
        return xor_result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var missingNumber = function(nums) {
    const n = nums.length;
    let xorResult = 0;
    
    // XOR all numbers from 0 to n
    for (let i = 0; i <= n; i++) {
        xorResult ^= i;
    }
    
    // XOR with all elements in the array
    for (const num of nums) {
        xorResult ^= num;
    }
    
    return xorResult;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through array and range |
| **Space** | O(1) - Only a few variables |

---

## Approach 2: Sum Approach

### Algorithm Steps

1. Calculate expected sum: n*(n+1)/2
2. Calculate actual sum of array elements
3. Return expected - actual

### Why It Works

The mathematical approach is straightforward: the sum of all numbers from 0 to n is known. The difference between expected and actual sum is the missing number.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        """
        Find the missing number using sum formula.
        """
        n = len(nums)
        expected_sum = n * (n + 1) // 2
        actual_sum = sum(nums)
        return expected_sum - actual_sum
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int missingNumber(vector<int>& nums) {
        int n = nums.size();
        int expected_sum = n * (n + 1) / 2;
        int actual_sum = 0;
        for (int num : nums) {
            actual_sum += num;
        }
        return expected_sum - actual_sum;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int missingNumber(int[] nums) {
        int n = nums.length;
        int expectedSum = n * (n + 1) / 2;
        int actualSum = 0;
        for (int num : nums) {
            actualSum += num;
        }
        return expectedSum - actualSum;
    }
}
```

<!-- slide -->
```javascript
var missingNumber = function(nums) {
    const n = nums.length;
    const expectedSum = n * (n + 1) / 2;
    const actualSum = nums.reduce((a, b) => a + b, 0);
    return expectedSum - actualSum;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Sum calculation |
| **Space** | O(1) - Constant space |

---

## Comparison of Approaches

| Aspect | XOR Approach | Sum Approach |
|--------|--------------|--------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(1) |
| **Overflow Risk** | No | Yes (for large n) |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** XOR is generally preferred as it avoids potential integer overflow.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Apple, Microsoft, Google
- **Difficulty**: Easy
- **Concepts Tested**: Bit Manipulation, Mathematical Reasoning, Arrays

### Learning Outcomes

1. **Bit Manipulation**: Master XOR operations
2. **Mathematical Thinking**: Use mathematical properties for efficiency
3. **Space Optimization**: Achieve O(1) space

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Find the Difference | [Link](https://leetcode.com/problems/find-the-difference/) | Similar XOR problem |
| Single Number | [Link](https://leetcode.com/problems/single-number/) | XOR for finding single element |
| Kth Missing Positive Number | [Link](https://leetcode.com/problems/kth-missing-positive-number/) | Finding missing in sorted array |

### Pattern Reference

For more detailed explanations of the Bit Manipulation pattern, see:
- **[Bit Manipulation Pattern](/patterns/bitwise-xor-finding-single-missing-number)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode - Missing Number](https://www.youtube.com/watch?v=jCj6h8l2c2I)** - Clear explanation with visual examples
2. **[Missing Number - LeetCode 268](https://www.youtube.com/watch?v=jCj8h8l2c2I)** - Detailed walkthrough
3. **[XOR Bit Manipulation Explained](https://www.youtube.com/watch?v=1W5fjAYJhNs)** - Understanding XOR operations

---

## Follow-up Questions

### Q1: How would you handle the case where multiple numbers are missing?

**Answer:** You would need a different approach. One option is to use a boolean array to mark presence, or use sum and XOR variations.

---

### Q2: What if the array is not guaranteed to contain distinct numbers?

**Answer:** The XOR approach would still work (duplicates would still cancel), but the problem states distinct numbers.

---

### Q3: Can you find the missing number in O(n) time and O(1) space without using XOR or sum?

**Answer:** You could use marking by negating values at the index equal to each number, then find the index that's not negated.

---

### Q4: How does this problem change if numbers are from 1 to n instead of 0 to n?

**Answer:** Adjust the range to 1 to n, so expected sum becomes n*(n+1)/2 instead of (n-1)*n/2.

---

## Common Pitfalls

### 1. Using Wrong Range for XOR
**Issue**: XORing only 0 to n-1 instead of 0 to n.

**Solution**: The range is [0, n], so XOR from 0 to n (inclusive).

### 2. Not Handling Empty Array
**Issue**: When n=1, array has one element but missing could be 0 or 1.

**Solution**: Algorithm handles this correctly if range is 0 to n.

### 3. Integer Overflow with Sum Approach
**Issue**: Using sum formula with large n can cause overflow.

**Solution**: Use XOR approach or use long type for sum.

### 4. Not Initializing XOR Correctly
**Issue**: Starting with wrong initial value.

**Solution**: Start with 0, since `x ^ 0 = x`.

---

## Summary

The **Missing Number** problem demonstrates the **Bit Manipulation** pattern using XOR operations. The key insight is leveraging XOR properties to find the missing number without extra space.

### Key Takeaways

1. **XOR Properties**: `a ^ a = 0`, `a ^ 0 = a`, XOR is commutative and associative
2. **Pair Cancellation**: All numbers that appear twice cancel out to 0
3. **Single Missing**: The missing number appears once and remains as the result
4. **Alternative Approach**: Can also use sum formula: n*(n+1)/2 - sum(nums)

### Pattern Summary

This problem exemplifies the **Bit Manipulation - XOR** pattern, characterized by:
- Using bitwise operations to solve mathematical problems
- Leveraging mathematical properties (XOR cancellation) for efficiency
- Achieving O(1) space complexity with O(n) time

For more details on this pattern, see the **[Bit Manipulation](/patterns/bitwise-xor-finding-single-missing-number)**.

---

## Additional Resources

- [LeetCode Problem 268](https://leetcode.com/problems/missing-number/) - Official problem page
- [XOR - GeeksforGeeks](https://www.geeksforgeeks.org/bitwise-operators-in-java/) - Detailed XOR explanation
- [Pattern: Bit Manipulation](/patterns/bitwise-xor-finding-single-missing-number) - Comprehensive pattern guide
