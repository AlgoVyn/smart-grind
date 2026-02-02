# Bitwise XOR - Finding Single/Missing Number

## Problem Description

The **Bitwise XOR pattern** is a powerful technique for finding single elements or missing numbers in arrays. This pattern leverages the unique mathematical properties of the XOR operation to solve problems efficiently without using extra space.

### What This Pattern Solves

This pattern can be applied to solve various problems:

1. **Single Number**: Find one element that appears once while all others appear twice
2. **Missing Number**: Find the missing number in a sequence from 0 to n
3. **Duplicate + Missing**: Find both a duplicated number and a missing number
4. **Two Single Numbers**: Find two elements that appear once while all others appear twice
5. **Element Appearing Thrice**: Find one element appearing once while others appear three times

### Why XOR is Perfect for These Problems

The XOR operation has four critical properties that make it ideal:

| Property | Formula | Description |
|----------|---------|-------------|
| **Identity** | `a ^ 0 = a` | Any number XORed with 0 is itself |
| **Self-Inverse** | `a ^ a = 0` | Any number XORed with itself is 0 |
| **Commutative** | `a ^ b = b ^ a` | Order doesn't matter |
| **Associative** | `(a ^ b) ^ c = a ^ (b ^ c)` | Grouping doesn't matter |

---

## Detailed Intuition

### The Cancellation Effect

Imagine XOR as a mathematical "annihilation" process:

```
Array: [4, 1, 2, 1, 2]
        ↓
Pair:   4  (1,1)  (2,2)
        ↓     ↓       ↓
XOR:    4 ^ 0 ^ 0 = 4
```

When identical numbers meet, they cancel each other out:
- **1 ^ 1 = 0** (pair annihilates)
- **2 ^ 2 = 0** (pair annihilates)
- **4 ^ 0 ^ 0 = 4** (only the single element remains)

### The Missing Number Insight

For a sequence from 0 to n with one missing:

```
Expected:  0 ^ 1 ^ 2 ^ 3 = 0  (all numbers cancel)
Actual:    0 ^ 1 ^ 3 = 2      (missing 2)
Missing = Expected ^ Actual = 0 ^ 2 = 2
```

### Visual Example: Single Number

For `nums = [4, 1, 2, 1, 2]`:

```
Step 1: result = 0
Step 2: result = 0 ^ 4 = 4
Step 3: result = 4 ^ 1 = 5
Step 4: result = 5 ^ 2 = 7
Step 5: result = 7 ^ 1 = 6
Step 6: result = 6 ^ 2 = 4 ✓
```

Using algebraic grouping:
```
4 ^ 1 ^ 2 ^ 1 ^ 2
= 4 ^ (1 ^ 1) ^ (2 ^ 2)  [Group pairs]
= 4 ^ 0 ^ 0              [Each pair becomes 0]
= 4                      [Only the single element remains]
```

---

## Solution Approaches

### Approach 1: Single Number (Optimal) ✅

Finding one element that appears once while all others appear twice.

````carousel
```python
from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        """
        Find the single number in an array where every other number appears twice.
        
        Args:
            nums: List of integers where exactly one element appears once
            
        Returns:
            The single element that appears only once
        """
        result = 0  # Start with 0 (identity element for XOR)
        
        # XOR each number in the array
        for num in nums:
            result ^= num
        
        return result
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int singleNumber(vector<int>& nums) {
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
import java.util.List;

class Solution {
    public int singleNumber(int[] nums) {
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
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
    let result = 0;
    
    for (let i = 0; i < nums.length; i++) {
        result ^= nums[i];
    }
    
    return result;
};
```
````

---

### Approach 2: Missing Number

Finding the missing number in a sequence from 0 to n.

````carousel
```python
from typing import List

class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        """
        Find the missing number in range [0, n].
        
        Args:
            nums: List of n distinct numbers from 0 to n, missing one number
            
        Returns:
            The missing number
        """
        n = len(nums)
        xor_arr = 0
        xor_range = 0
        
        # XOR all elements in the array
        for num in nums:
            xor_arr ^= num
        
        # XOR all numbers from 0 to n
        for i in range(n + 1):
            xor_range ^= i
        
        return xor_arr ^ xor_range
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int missingNumber(vector<int>& nums) {
        int n = nums.size();
        int xor_arr = 0;
        int xor_range = 0;
        
        // XOR all elements in the array
        for (int num : nums) {
            xor_arr ^= num;
        }
        
        // XOR all numbers from 0 to n
        for (int i = 0; i <= n; i++) {
            xor_range ^= i;
        }
        
        return xor_arr ^ xor_range;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int missingNumber(int[] nums) {
        int n = nums.length;
        int xor_arr = 0;
        int xor_range = 0;
        
        // XOR all elements in the array
        for (int num : nums) {
            xor_arr ^= num;
        }
        
        // XOR all numbers from 0 to n
        for (int i = 0; i <= n; i++) {
            xor_range ^= i;
        }
        
        return xor_arr ^ xor_range;
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
    let xor_arr = 0;
    let xor_range = 0;
    
    // XOR all elements in the array
    for (let num of nums) {
        xor_arr ^= num;
    }
    
    // XOR all numbers from 0 to n
    for (let i = 0; i <= nums.length; i++) {
        xor_range ^= i;
    }
    
    return xor_arr ^ xor_range;
};
```
````

---

### Approach 3: Find Both Duplicate and Missing

Finding both a duplicated number and a missing number simultaneously.

````carousel
```python
from typing import List

class Solution:
    def findErrorNums(self, nums: List[int]) -> List[int]:
        """
        Find the duplicate and missing numbers in the array.
        
        Args:
            nums: List containing n numbers where one is duplicated and one is missing
            
        Returns:
            List containing [duplicate, missing]
        """
        xor_all = 0
        
        # XOR all array elements
        for num in nums:
            xor_all ^= num
        
        # XOR all numbers from 1 to n
        n = len(nums)
        for i in range(1, n + 1):
            xor_all ^= i
        
        # Find the rightmost set bit (differentiating bit)
        diff_bit = xor_all & -xor_all
        
        dup = 0
        miss = 0
        
        # Partition and XOR based on the differentiating bit
        for num in nums:
            if num & diff_bit:
                dup ^= num
        
        for i in range(1, n + 1):
            if i & diff_bit:
                dup ^= i
            else:
                miss ^= i
        
        # Verify which is which
        for num in nums:
            if num == dup:
                return [dup, miss]
        return [miss, dup]
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> findErrorNums(vector<int>& nums) {
        int xor_all = 0;
        int n = nums.size();
        
        for (int num : nums) {
            xor_all ^= num;
        }
        
        for (int i = 1; i <= n; i++) {
            xor_all ^= i;
        }
        
        int diff_bit = xor_all & -xor_all;
        
        int dup = 0, miss = 0;
        
        for (int num : nums) {
            if (num & diff_bit) {
                dup ^= num;
            }
        }
        
        for (int i = 1; i <= n; i++) {
            if (i & diff_bit) {
                dup ^= i;
            } else {
                miss ^= i;
            }
        }
        
        for (int num : nums) {
            if (num == dup) {
                return {dup, miss};
            }
        }
        return {miss, dup};
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] findErrorNums(int[] nums) {
        int xor_all = 0;
        int n = nums.length;
        
        for (int num : nums) {
            xor_all ^= num;
        }
        
        for (int i = 1; i <= n; i++) {
            xor_all ^= i;
        }
        
        int diff_bit = xor_all & -xor_all;
        
        int dup = 0, miss = 0;
        
        for (int num : nums) {
            if ((num & diff_bit) != 0) {
                dup ^= num;
            }
        }
        
        for (int i = 1; i <= n; i++) {
            if ((i & diff_bit) != 0) {
                dup ^= i;
            } else {
                miss ^= i;
            }
        }
        
        for (int num : nums) {
            if (num == dup) {
                return new int[]{dup, miss};
            }
        }
        return new int[]{miss, dup};
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findErrorNums = function(nums) {
    let xor_all = 0;
    const n = nums.length;
    
    for (let num of nums) {
        xor_all ^= num;
    }
    
    for (let i = 1; i <= n; i++) {
        xor_all ^= i;
    }
    
    const diff_bit = xor_all & -xor_all;
    
    let dup = 0, miss = 0;
    
    for (let num of nums) {
        if (num & diff_bit) {
            dup ^= num;
        }
    }
    
    for (let i = 1; i <= n; i++) {
        if (i & diff_bit) {
            dup ^= i;
        } else {
            miss ^= i;
        }
    }
    
    for (let num of nums) {
        if (num === dup) {
            return [dup, miss];
        }
    }
    return [miss, dup];
};
```
````

---

### Approach 4: Two Single Numbers (Single Number III)

Finding two elements that appear once while all others appear twice.

````carousel
```python
from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> List[int]:
        """
        Find two elements that appear once while all others appear twice.
        
        Args:
            nums: List of integers where exactly two elements appear once
            
        Returns:
            List containing the two single elements
        """
        # Step 1: XOR all elements to get x ^ y
        xor_all = 0
        for num in nums:
            xor_all ^= num
        
        # Step 2: Find rightmost set bit
        diff_bit = xor_all & -xor_all
        
        # Step 3: Partition and XOR separately
        x = 0
        y = 0
        for num in nums:
            if num & diff_bit:
                x ^= num
            else:
                y ^= num
        
        return [x, y]
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> singleNumber(vector<int>& nums) {
        int xor_all = 0;
        for (int num : nums) {
            xor_all ^= num;
        }
        
        int diff_bit = xor_all & -xor_all;
        
        int x = 0, y = 0;
        for (int num : nums) {
            if (num & diff_bit) {
                x ^= num;
            } else {
                y ^= num;
            }
        }
        
        return {x, y};
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] singleNumber(int[] nums) {
        int xor_all = 0;
        for (int num : nums) {
            xor_all ^= num;
        }
        
        int diff_bit = xor_all & -xor_all;
        
        int x = 0, y = 0;
        for (int num : nums) {
            if ((num & diff_bit) != 0) {
                x ^= num;
            } else {
                y ^= num;
            }
        }
        
        return new int[]{x, y};
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var singleNumber = function(nums) {
    let xor_all = 0;
    for (let num of nums) {
        xor_all ^= num;
    }
    
    const diff_bit = xor_all & -xor_all;
    
    let x = 0, y = 0;
    for (let num of nums) {
        if (num & diff_bit) {
            x ^= num;
        } else {
            y ^= num;
        }
    }
    
    return [x, y];
};
```
````

---

### Approach 5: Element Appearing Thrice (Single Number II)

Finding one element that appears once while all others appear three times.

````carousel
```python
from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        """
        Find the element that appears once while all others appear three times.
        
        Args:
            nums: List of integers where every element appears three times except one
            
        Returns:
            The single element
        """
        ones = 0  # Bits that have appeared once
        twos = 0  # Bits that have appeared twice
        
        for num in nums:
            twos |= ones & num
            ones ^= num
            common_mask = ~(ones & twos)
            ones &= common_mask
            twos &= common_mask
        
        return ones
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int ones = 0, twos = 0;
        
        for (int num : nums) {
            twos |= ones & num;
            ones ^= num;
            int common_mask = ~(ones & twos);
            ones &= common_mask;
            twos &= common_mask;
        }
        
        return ones;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int singleNumber(int[] nums) {
        int ones = 0, twos = 0;
        
        for (int num : nums) {
            twos |= ones & num;
            ones ^= num;
            int common_mask = ~(ones & twos);
            ones &= common_mask;
            twos &= common_mask;
        }
        
        return ones;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
    let ones = 0, twos = 0;
    
    for (let num of nums) {
        twos |= ones & num;
        ones ^= num;
        const common_mask = ~(ones & twos);
        ones &= common_mask;
        twos &= common_mask;
    }
    
    return ones;
};
```
````

---

## Complexity Analysis

### Comparison of All Approaches

| Approach | Time Complexity | Space Complexity | Best For |
|----------|-----------------|------------------|----------|
| **Single Number (XOR)** | O(n) | O(1) | One element appears once |
| **Missing Number** | O(n) | O(1) | One number missing from range |
| **Duplicate + Missing** | O(n) | O(1) | One duplicate, one missing |
| **Two Single Numbers** | O(n) | O(1) | Two elements appear once |
| **Element Appearing Thrice** | O(n) | O(1) | One element once, others thrice |

### Why XOR is Optimal

1. **Perfect Fit**: Problems guarantee the frequency pattern
2. **Single Pass**: One iteration through the array
3. **Constant Space**: No additional data structures
4. **No Modifications**: Original array remains unchanged
5. **Simple Logic**: Easy to understand and implement correctly

---

## Edge Cases and Common Pitfalls

### Edge Cases to Consider

1. **Single Element Array**
   ```
   nums = [1] → Output: 1
   ```

2. **Negative Numbers**
   ```
   nums = [-1, -1, 2] → Output: 2
   ```

3. **Zero in the Array**
   ```
   nums = [0, 1, 1] → Output: 0
   ```

4. **Large Numbers**
   ```
   nums = [30000, -30000, 30000] → Output: -30000
   ```

### Common Mistakes to Avoid

1. **Using + instead of ^**
   ```python
   # Wrong!
   result = 0
   for num in nums:
       result + num  # This doesn't work!
   ```

2. **Forgetting the identity element**
   ```python
   # Wrong!
   result = nums[0]  # This doesn't work for [1, 2, 3, 2, 1]!
   ```

3. **Incorrect range for missing number**
   - Ensure the range matches the problem constraints exactly

---

## Why This Pattern is Important

### Interview Relevance

- **Frequency**: Frequently asked in technical interviews
- **Companies**: Google, Amazon, Meta, Apple, Microsoft, Bloomberg
- **Difficulty**: Ranges from Easy to Medium
- **Variations**: Multiple related problems build on this concept

### Learning Outcomes

1. **Understanding XOR**: Learn the powerful properties of bitwise XOR
2. **Space Optimization**: See how to solve problems in O(1) space
3. **Pattern Recognition**: Identify when to use bit manipulation
4. **Mathematical Thinking**: Use algebraic properties for efficient solutions

---

## Related Problems

### Same Pattern (XOR-based)

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Single Number](https://leetcode.com/problems/single-number/) | 136 | Easy | Elements appear twice except one |
| [Missing Number](https://leetcode.com/problems/missing-number/) | 268 | Easy | Find missing number from 0 to n |
| [Single Number II](https://leetcode.com/problems/single-number-ii/) | 137 | Medium | Elements appear 3 times except one |
| [Single Number III](https://leetcode.com/problems/single-number-iii/) | 260 | Medium | Two elements appear once, others twice |
| [Set Mismatch](https://leetcode.com/problems/set-mismatch/) | 645 | Easy | Find duplicate and missing number |
| [Find the Difference](https://leetcode.com/problems/find-the-difference/) | 389 | Easy | Find added character in string |

### Similar Concepts

| Problem | LeetCode # | Difficulty | Related Technique |
|---------|------------|------------|-------------------|
| [Find Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/) | 287 | Medium | Floyd's cycle detection |
| [Single Element in Sorted Array](https://leetcode.com/problems/single-element-in-a-sorted-array/) | 540 | Medium | Binary search |
| [Majority Element](https://leetcode.com/problems/majority-element/) | 169 | Easy | Boyer-Moore voting |
| [Counting Bits](https://leetcode.com/problems/counting-bits/) | 338 | Easy | Bit manipulation |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[Single Number - NeetCode](https://www.youtube.com/watch?v=qMPX1AOa83k)**
   - Excellent visual explanation of XOR properties
   - Step-by-step walkthrough

2. **[Single Number - William Lin](https://www.youtube.com/watch?v=0jN2cIoXK7Q)**
   - Clean and concise explanation
   - Multiple approaches covered

3. **[Bitwise XOR Explanation - CodeBroke](https://www.youtube.com/watch?v=6h7Glr1D9fI)**
   - Deep dive into XOR properties
   - Visual demonstrations

4. **[LeetCode Official Solution](https://www.youtube.com/watch?v=1L2OiLDbJ6E)**
   - Official solution walkthrough

5. **[Blind 75 - Single Number](https://www.youtube.com/watch?v=uB4a-9aS1c4)**
   - Interview-focused approach

### Additional Resources

- **[XOR Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#XOR)** - Theoretical background
- **[Bitwise Operations - GeeksforGeeks](https://www.geeksforgeeks.org/bitwise-operators-in-c-cpp/)** - Language-specific examples

---

## Follow-up Questions

### Basic Level

1. **What is the time and space complexity of the XOR approach?**
   - Time: O(n), Space: O(1)

2. **Why can't we use addition/subtraction instead of XOR?**
   - Addition doesn't have the self-canceling property like XOR
   - `a + a = 2a`, not 0

3. **What happens if the array has no single element?**
   - The problem guarantees exactly one single element

### Intermediate Level

4. **How would you modify the solution if each element appeared 3 times instead of 2?**
   - Use bit counting approach (see Single Number II)

5. **How would you handle the case where two elements appear once?**
   - Use two-pass XOR with bit masking (see Single Number III)

### Advanced Level

6. **How would you prove that XOR is the only operation that works?**
   - Need an operation that is: commutative, associative, has identity, and self-inverses
   - XOR and XNOR are the only binary operations with these properties

7. **How does this relate to finding a cycle in a linked list?**
   - Both problems involve identifying where a repeating pattern deviates
   - XOR cancels pairs like cycle detection finds cycle entry points

---

## Summary

The **Bitwise XOR pattern** is a fundamental technique in algorithmic problem-solving. Key takeaways:

1. **XOR Properties**: `a ^ a = 0` and `a ^ 0 = a` make XOR perfect for canceling pairs
2. **Single Pass**: One iteration through the array is sufficient
3. **Constant Space**: Only one variable needed regardless of input size
4. **Universal Application**: Works with positive, negative, and zero values
5. **Versatility**: Extends to missing numbers, duplicates, multiple uniques, and more

This pattern is essential for interview preparation and demonstrates the power of bit manipulation.

---

## LeetCode Problems for Practice

- [Single Number](https://leetcode.com/problems/single-number/)
- [Missing Number](https://leetcode.com/problems/missing-number/)
- [Single Number II](https://leetcode.com/problems/single-number-ii/)
- [Single Number III](https://leetcode.com/problems/single-number-iii/)
- [Set Mismatch](https://leetcode.com/problems/set-mismatch/)
- [Find the Difference](https://leetcode.com/problems/find-the-difference/)
