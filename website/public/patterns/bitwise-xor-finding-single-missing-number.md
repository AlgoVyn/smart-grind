# Bitwise XOR - Finding Single/Missing Number

## Overview

The Bitwise XOR pattern for finding a single or missing number leverages the properties of the XOR operation to efficiently identify elements that appear an odd number of times in a collection. This pattern is particularly useful in problems where you need to find a unique element in an array where all other elements appear in pairs (even counts), or to detect missing numbers in a sequence.

The XOR operation is **associative**, **commutative**, and has the key property that any number XORed with itself results in 0, while XORing with 0 leaves the number unchanged. This makes it ideal for canceling out duplicate values, leaving only the unique or missing element.

### Why This Pattern is Powerful

| Benefit | Description |
|---------|-------------|
| **O(n) Time** | Single pass through the array |
| **O(1) Space** | Only a few variables needed |
| **No Modifications** | Original array remains unchanged |
| **Simple Logic** | Easy to understand and implement |
| **Universal** | Works with positive, negative, and zero values |

---

## Key Concepts

### Understanding XOR Operations

The **XOR (Exclusive OR)** operation is a bitwise operation that returns 1 for bits that differ between two operands:

| A | B | A ^ B |
|---|---|-------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

### Critical XOR Properties

1. **Identity Property**: `a ^ 0 = a`
   - Any number XORed with 0 remains unchanged

2. **Self-Inverse Property**: `a ^ a = 0`
   - Any number XORed with itself equals 0

3. **Commutative Property**: `a ^ b = b ^ a`
   - The order of XOR operations doesn't matter

4. **Associative Property**: `(a ^ b) ^ c = a ^ (b ^ c)`
   - Grouping of XOR operations doesn't matter

### The "Aha!" Moment

When we XOR all numbers in an array together:
- Every pair of identical numbers (`a ^ a`) becomes 0
- All the zeros from the pairs XOR together (`0 ^ 0 ^ 0 = 0`)
- Only the single number remains (`single ^ 0 = single`)

### Cancellation Effect

For finding a **single element** (all others appear twice):
```
4 ^ 1 ^ 2 ^ 1 ^ 2
= 4 ^ (1 ^ 1) ^ (2 ^ 2)  [Group pairs]
= 4 ^ 0 ^ 0              [Each pair becomes 0]
= 4                      [Only the single element remains]
```

For finding a **missing number** in range [0, n]:
```
Given: nums = [0, 1, 3] (missing 2)
XOR of nums: 0 ^ 1 ^ 3 = 2
XOR of range [0, 3]: 0 ^ 1 ^ 2 ^ 3 = 0
Missing = (XOR of nums) ^ (XOR of range) = 2 ^ 0 = 2
```

---

## Intuition

The intuition behind using XOR for these problems stems from its **self-canceling property**. When identical numbers are XORed together, they annihilate each other, leaving only the unmatched element.

### For Single Element Problems

Imagine pairing up all elements in the array:
- Each pair of identical numbers cancels out (becomes 0)
- All the resulting zeros cancel out with each other
- The single unpaired element remains

This is analogous to how **inverses cancel each other** in mathematics (like +5 and -5 summing to 0).

### For Missing Number Problems

For a sequence from 0 to n with one missing:
- XOR all numbers in the given array
- XOR all expected numbers in the full range
- The missing number is the XOR of these two results
- Numbers present in both cancel out, leaving only the missing one

### Visual Representation

```
Array: [4, 1, 2, 1, 2]
        ↓
Pair:   4  (1,1)  (2,2)
        ↓     ↓       ↓
XOR:    4 ^ 0 ^ 0 = 4
```

---

## Solution Approaches

### Approach 1: Single Number Using XOR (Optimal) ✅ Recommended

This is the optimal solution for finding a single element where all others appear exactly twice.

#### Algorithm

1. Initialize a result variable to 0
2. XOR each number in the array with the result
3. Return the result (the single element)

#### Implementation

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

#### Step-by-Step Example

For `nums = [4, 1, 2, 1, 2]`:

| Step | Operation | Result |
|------|-----------|--------|
| 1 | result = 0 | 0 |
| 2 | result = 0 ^ 4 | 4 |
| 3 | result = 4 ^ 1 | 5 |
| 4 | result = 5 ^ 2 | 7 |
| 5 | result = 7 ^ 1 | 6 |
| 6 | result = 6 ^ 2 | 4 ✓ |

---

### Approach 2: Missing Number Using XOR

This approach finds the missing number in a sequence from 0 to n.

#### Algorithm

1. Initialize `xor_all` to 0
2. XOR all numbers in the given array
3. XOR all expected numbers from 0 to n
4. Return the XOR of both results (the missing number)

#### Implementation

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

#### Step-by-Step Example

For `nums = [0, 1, 3]` (missing 2):

```
XOR of array: 0 ^ 1 ^ 3 = 2
XOR of range [0, 3]: 0 ^ 1 ^ 2 ^ 3 = 0
Missing: 2 ^ 0 = 2 ✓
```

---

### Approach 3: Find Both Duplicate and Missing Number

This advanced approach finds both a duplicated number and a missing number simultaneously.

#### Algorithm

1. XOR all array elements and all numbers from 0 to n
2. The result is `duplicate ^ missing`
3. Find the rightmost set bit (least significant bit that differs)
4. Partition numbers into two groups based on this bit
5. XOR each group separately to find both numbers

#### Implementation

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
            else:
                # This catches the original duplicate position
                pass
        
        # Check the actual numbers in range [1, n]
        for i in range(1, n + 1):
            if i & diff_bit:
                dup ^= i
            else:
                miss ^= i
        
        # Verify which is which (duplicate appears twice, missing doesn't)
        # If dup is in nums, it's the duplicate; otherwise it's the missing
        if dup in nums:
            return [dup, miss]
        else:
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
        
        // XOR all array elements
        for (int num : nums) {
            xor_all ^= num;
        }
        
        // XOR all numbers from 1 to n
        for (int i = 1; i <= n; i++) {
            xor_all ^= i;
        }
        
        // Find the rightmost set bit
        int diff_bit = xor_all & -xor_all;
        
        int dup = 0;
        int miss = 0;
        
        // Partition and XOR
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
        
        // Verify and return
        vector<int> result = {0, 0};
        for (int num : nums) {
            if (num == dup) {
                result[0] = dup;
                result[1] = miss;
                return result;
            }
        }
        result[0] = miss;
        result[1] = dup;
        return result;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] findErrorNums(int[] nums) {
        int xor_all = 0;
        int n = nums.length;
        
        // XOR all array elements
        for (int num : nums) {
            xor_all ^= num;
        }
        
        // XOR all numbers from 1 to n
        for (int i = 1; i <= n; i++) {
            xor_all ^= i;
        }
        
        // Find the rightmost set bit
        int diff_bit = xor_all & -xor_all;
        
        int dup = 0;
        int miss = 0;
        
        // Partition and XOR
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
        
        // Verify and return
        int[] result = new int[2];
        for (int num : nums) {
            if (num == dup) {
                result[0] = dup;
                result[1] = miss;
                return result;
            }
        }
        result[0] = miss;
        result[1] = dup;
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
var findErrorNums = function(nums) {
    let xor_all = 0;
    const n = nums.length;
    
    // XOR all array elements
    for (let num of nums) {
        xor_all ^= num;
    }
    
    // XOR all numbers from 1 to n
    for (let i = 1; i <= n; i++) {
        xor_all ^= i;
    }
    
    // Find the rightmost set bit
    const diff_bit = xor_all & -xor_all;
    
    let dup = 0;
    let miss = 0;
    
    // Partition and XOR
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
    
    // Verify and return
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

#### Algorithm

1. XOR all elements to get `x ^ y` (where x and y are the single elements)
2. Find a bit that differs between x and y (rightmost set bit)
3. Partition the array into two groups based on this bit
4. XOR each group separately to find x and y

#### Implementation

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
        
        # Step 2: Find rightmost set bit (differentiating bit)
        # This bit is set in either x or y, but not both
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
        // Step 1: XOR all elements to get x ^ y
        int xor_all = 0;
        for (int num : nums) {
            xor_all ^= num;
        }
        
        // Step 2: Find rightmost set bit
        int diff_bit = xor_all & -xor_all;
        
        // Step 3: Partition and XOR separately
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
        // Step 1: XOR all elements to get x ^ y
        int xor_all = 0;
        for (int num : nums) {
            xor_all ^= num;
        }
        
        // Step 2: Find rightmost set bit
        int diff_bit = xor_all & -xor_all;
        
        // Step 3: Partition and XOR separately
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
    // Step 1: XOR all elements to get x ^ y
    let xor_all = 0;
    for (let num of nums) {
        xor_all ^= num;
    }
    
    // Step 2: Find rightmost set bit
    const diff_bit = xor_all & -xor_all;
    
    // Step 3: Partition and XOR separately
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

#### Algorithm

This requires bit manipulation at the bit level rather than simple XOR:

1. Track count of set bits at each position (modulo 3)
2. The bits that don't divide by 3 form the single number

#### Implementation

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
        # Using the bit manipulation approach
        ones = 0  # Bits that have appeared once
        twos = 0  # Bits that have appeared twice
        
        for num in nums:
            # When a bit is in 'ones' and we see it again, move it to 'twos'
            twos |= ones & num
            
            # When a bit is in 'twos' and we see it again, clear it (appeared 3 times)
            ones ^= num
            
            # Clear bits that appeared 3 times
            # This uses De Morgan's law: ~(a & b) = ~a | ~b
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
        int ones = 0;  // Bits that have appeared once
        int twos = 0;  // Bits that have appeared twice
        
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
        int ones = 0;  // Bits that have appeared once
        int twos = 0;  // Bits that have appeared twice
        
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
    let ones = 0;  // Bits that have appeared once
    let twos = 0;  // Bits that have appeared twice
    
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

## Time and Space Complexity

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|-----------------|------------------|----------|
| Single Number (XOR) | O(n) | O(1) | One element appears once |
| Missing Number | O(n) | O(1) | One number missing from range |
| Duplicate + Missing | O(n) | O(1) | One duplicate, one missing |
| Two Single Numbers | O(n) | O(1) | Two elements appear once |
| Element Appearing Thrice | O(n) | O(1) | One element appears once, others thrice |

---

## Common Pitfalls

### 1. Incorrect Assumptions on Frequency
Ensure that all elements except the target appear an even number of times (or the expected frequency for the problem). If frequencies vary unpredictably, additional logic may be needed.

### 2. Edge Cases
- **Empty arrays**: Handle appropriately (though problem guarantees non-empty)
- **Single element**: `[1] → Output: 1`
- **Zero in the array**: Remember `0 ^ 0 = 0` and `0 ^ x = x`
- **Negative numbers**: XOR works correctly with two's complement representation

### 3. Integer Overflow
In languages with fixed integer sizes (C++, Java), be cautious with very large numbers. Python handles arbitrary precision, but be aware of this in other languages.

### 4. Range Specification
When finding missing numbers, accurately define the expected range to avoid incorrect results from extraneous XOR operations.

### 5. Using + Instead of ^
```python
# Wrong!
result = 0
for num in nums:
    result + num  # This doesn't work! Addition doesn't have self-canceling property
```

### 6. Forgetting the Identity Element
```python
# Wrong!
result = nums[0]  # This doesn't work for [1, 2, 3, 2, 1]!
# Should start with result = 0
```

---

## Example Problems

### Fundamental Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Single Number](https://leetcode.com/problems/single-number/) | 136 | Easy | Find element appearing once (others twice) |
| [Missing Number](https://leetcode.com/problems/missing-number/) | 268 | Easy | Find missing number from 0 to n |
| [Single Number III](https://leetcode.com/problems/single-number-iii/) | 260 | Medium | Find two elements appearing once |
| [Set Mismatch](https://leetcode.com/problems/set-mismatch/) | 645 | Easy | Find duplicate and missing number |

### Advanced Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Single Number II](https://leetcode.com/problems/single-number-ii/) | 137 | Medium | Find element appearing once (others thrice) |
| [Single Number III](https://leetcode.com/problems/single-number-iii/) | 260 | Medium | Two elements appear once, others twice |
| [Find the Difference](https://leetcode.com/problems/find-the-difference/) | 389 | Easy | Find added character in string |
| [Complement of Base 10 Number](https://leetcode.com/problems/complement-of-base-10-number/) | 1009 | Easy | Find complement using bit manipulation |

---

## Related Problems

### Same Pattern (XOR-based)

| Problem | LeetCode # | Difficulty | Application |
|---------|------------|------------|-------------|
| [Single Number](https://leetcode.com/problems/single-number/) | 136 | Easy | Basic XOR cancellation |
| [Missing Number](https://leetcode.com/problems/missing-number/) | 268 | Easy | XOR with expected range |
| [Single Number II](https://leetcode.com/problems/single-number-ii/) | 137 | Medium | Bit counting approach |
| [Single Number III](https://leetcode.com/problems/single-number-iii/) | 260 | Medium | Two-pass XOR with bit masking |
| [Find the Difference](https://leetcode.com/problems/find-the-difference/) | 389 | Easy | String XOR using char codes |
| [Set Mismatch](https://leetcode.com/problems/set-mismatch/) | 645 | Easy | XOR for duplicate and missing |

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
   - Part of popular NeetCode playlist

2. **[Single Number - William Lin](https://www.youtube.com/watch?v=0jN2cIoXK7Q)**
   - Clean and concise explanation
   - Multiple approaches covered
   - Great for interview preparation

3. **[Bitwise XOR Explanation - CodeBroke](https://www.youtube.com/watch?v=6h7Glr1D9fI)**
   - Deep dive into XOR properties
   - Visual demonstrations
   - Beginner-friendly

4. **[LeetCode Official Solution](https://www.youtube.com/watch?v=1L2OiLDbJ6E)**
   - Official solution walkthrough
   - Best practices and edge cases

5. **[Blind 75 - Single Number](https://www.youtube.com/watch?v=uB4a-9aS1c4)**
   - Part of the famous Blind 75 list
   - Interview-focused approach

### Additional Resources

- **[XOR Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#XOR)** - Theoretical background
- **[Bitwise Operations - GeeksforGeeks](https://www.geeksforgeeks.org/bitwise-operators-in-c-cpp/)** - Language-specific examples
- **[LeetCode Discuss](https://leetcode.com/problems/single-number/discuss/)** - Community solutions and tips

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

6. **Can you solve this without using any extra variables?**
   - No, you need at least one variable to store the running XOR result

### Advanced Level

7. **How would you prove that XOR is the only operation that works?**
   - Need an operation that is: commutative, associative, has identity, and self-inverses
   - XOR and XNOR are the only binary operations with these properties

8. **How does this relate to finding a cycle in a linked list?**
   - The XOR approach can be viewed as finding the "start" of a pattern repetition
   - Both problems involve identifying where a repeating pattern deviates
   - XOR effectively "finds" the unique entry point by canceling out all pairs

9. **How would you extend this to find K single elements where all others appear M times?**
   - Generalize the bit counting approach from Single Number II
   - Track bit counts modulo M

### Practical Implementation Questions

10. **What if you need to preserve the original array?**
    - The XOR approach doesn't modify the original array

11. **How would you test this solution?**
    - Test cases: single element, multiple pairs, negatives, zeros, large numbers

12. **What are the real-world applications of this pattern?**
    - Error detection/correction, cryptography, data deduplication, checksum validation

---

## Summary

The **Bitwise XOR pattern** for finding single/missing numbers is a powerful technique that leverages the mathematical properties of XOR operations. The key insights are:

1. **XOR Properties**: `a ^ a = 0` and `a ^ 0 = a` make XOR perfect for canceling pairs
2. **Single Pass**: One iteration through the array is sufficient
3. **Constant Space**: Only one variable needed regardless of input size
4. **Universal Application**: Works with positive, negative, and zero values
5. **Versatility**: Can be extended to find missing numbers, duplicates, multiple uniques, and more

This pattern is essential for solving a variety of LeetCode problems and is frequently asked in technical interviews at top companies like Google, Amazon, Meta, and Apple.

---

## LeetCode Problems for Practice

- [Single Number](https://leetcode.com/problems/single-number/)
- [Missing Number](https://leetcode.com/problems/missing-number/)
- [Single Number II](https://leetcode.com/problems/single-number-ii/)
- [Single Number III](https://leetcode.com/problems/single-number-iii/)
- [Set Mismatch](https://leetcode.com/problems/set-mismatch/)
- [Find the Difference](https://leetcode.com/problems/find-the-difference/)

## Pattern Source

[Bitwise XOR - Finding Single/Missing Number](patterns/bitwise-xor-finding-single-missing-number.md)
