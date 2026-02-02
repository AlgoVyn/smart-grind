# Single Number

## Problem Description

Given a non-empty array of integers `nums`, every element appears exactly twice except for one element that appears exactly once. Find and return the single element that appears only once.

This is **LeetCode Problem #136** and is classified as an Easy difficulty problem. It is one of the most fundamental problems for understanding bitwise operations and is frequently asked in technical interviews at companies like Google, Amazon, Meta, and Apple.

### Detailed Problem Statement

You are given an integer array `nums` where:
- Every element appears **exactly twice** in the array, except for one element
- The element that appears only once can be anywhere in the array
- You need to find and return that unique element
- The algorithm must run in **O(n)** time complexity
- The algorithm must use **O(1)** extra space (constant space)

### Key Constraints

| Constraint | Description | Importance |
|------------|-------------|------------|
| `1 <= nums.length <= 3 * 10^4` | Array size | Limits input size, ensures algorithm must be efficient |
| `-3 * 10^4 <= nums[i] <= 3 * 10^4` | Element range | Small range, but doesn't help much for solution |
| Exactly one element appears once | Problem guarantee | Critical for the XOR solution to work |
| All others appear exactly twice | Problem guarantee | Critical for the XOR solution to work |

---

## Examples

### Example 1:
```
Input: nums = [2, 2, 1]
Output: 1
Explanation: The number 1 appears only once, while 2 appears twice.
```

### Example 2:
```
Input: nums = [4, 1, 2, 1, 2]
Output: 4
Explanation: The number 4 appears only once, while 1 and 2 each appear twice.
```

### Example 3:
```
Input: nums = [1]
Output: 1
Explanation: When there's only one element, it must be the answer.
```

### Example 4:
```
Input: nums = [-1, -1, 2]
Output: 2
Explanation: Works with negative numbers as well. The XOR approach handles negatives correctly.
```

### Example 5:
```
Input: nums = [0, 0, 1, 2, 2, 3, 3, 4, 4]
Output: 1
Explanation: Works with multiple pairs of numbers. The unique element can be in any position.
```

---

## Intuition

The key insight behind solving this problem efficiently lies in understanding the properties of the **bitwise XOR operation**:

### XOR Properties

1. **Identity Property**: `a ^ 0 = a`
   - Any number XORed with 0 remains unchanged

2. **Self-Inverse Property**: `a ^ a = 0`
   - Any number XORed with itself equals 0

3. **Commutative Property**: `a ^ b = b ^ a`
   - The order of XOR operations doesn't matter

4. **Associative Property**: `(a ^ b) ^ c = a ^ (b ^ c)`
   - Grouping of XOR operations doesn't matter

### The "Aha!" Moment

When we XOR all numbers in the array together:
- Every pair of identical numbers (a ^ a) becomes 0
- All the zeros from the pairs XOR together (0 ^ 0 ^ 0 = 0)
- Only the single number remains (single ^ 0 = single)

This is why XOR is the perfect tool for this problem!

---

## Solution Approaches

### Approach 1: Bitwise XOR (Optimal) ✅ Recommended

This is the optimal solution that achieves both O(n) time and O(1) space complexity.

#### Algorithm

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

#### How It Works (Step-by-Step Example)

For `nums = [4, 1, 2, 1, 2]`:

```
Step 1: result = 0
Step 2: result = 0 ^ 4 = 4
Step 3: result = 4 ^ 1 = 5
Step 4: result = 5 ^ 2 = 7
Step 5: result = 7 ^ 1 = 6
Step 6: result = 6 ^ 2 = 4 ✓
```

Using the algebraic approach:
```
4 ^ 1 ^ 2 ^ 1 ^ 2
= 4 ^ (1 ^ 1) ^ (2 ^ 2)  [Group pairs]
= 4 ^ 0 ^ 0              [Each pair becomes 0]
= 4                      [Only the single element remains]
```

---

### Approach 2: Hash Set (O(n) Time, O(n) Space)

This is a simpler approach using a hash set to track seen numbers.

#### Algorithm

1. Create an empty hash set
2. Iterate through each number in the array
3. If the number is not in the set, add it
4. If the number is already in the set, remove it (it's a duplicate)
5. The remaining element in the set is the answer

#### Why This Works

- First occurrence: Number added to set
- Second occurrence: Number removed from set
- Only the single number stays in the set

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        seen = set()
        
        for num in nums:
            if num in seen:
                seen.remove(num)  # Remove when seen second time
            else:
                seen.add(num)     # Add when seen first time
        
        # Only one element remains in the set
        return seen.pop()
```
<!-- slide -->
```cpp
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
    int singleNumber(vector<int>& nums) {
        unordered_set<int> seen;
        
        for (int num : nums) {
            if (seen.count(num)) {
                seen.erase(num);  // Remove when seen second time
            } else {
                seen.insert(num); // Add when seen first time
            }
        }
        
        return *seen.begin();  // Only one element remains
    }
};
```
<!-- slide -->
```java
import java.util.HashSet;
import java.util.Set;
import java.util.Iterator;

class Solution {
    public int singleNumber(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        
        for (int num : nums) {
            if (seen.contains(num)) {
                seen.remove(num);  // Remove when seen second time
            } else {
                seen.add(num);     // Add when seen first time
            }
        }
        
        // Only one element remains in the set
        Iterator<Integer> it = seen.iterator();
        return it.next();
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
    const seen = new Set();
    
    for (const num of nums) {
        if (seen.has(num)) {
            seen.delete(num);  // Remove when seen second time
        } else {
            seen.add(num);     // Add when seen first time
        }
    }
    
    // Only one element remains in the set
    return seen.values().next().value;
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(n) - Each element is processed once |
| **Space** | O(n) - Hash set stores up to n/2 + 1 elements |

---

### Approach 3: Mathematical Formula (Sum Approach)

This approach uses basic arithmetic to find the single element.

#### Algorithm

The formula for finding the single element is:
```
Single = (Sum of all unique elements × 2) - Sum of all elements
```

However, since we don't know which elements are unique without preprocessing, we use:
```
Single = 2 × (Sum of set) - Sum of array
```

#### Step-by-Step Example

For `nums = [4, 1, 2, 1, 2]`:
```
unique_sum = {1, 2, 4} = 1 + 2 + 4 = 7
total_sum = 4 + 1 + 2 + 1 + 2 = 10

Single = 2 × 7 - 10 = 14 - 10 = 4 ✓
```

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        # Sum of unique elements (using set)
        unique_sum = sum(set(nums))
        
        # Total sum of all elements
        total_sum = sum(nums)
        
        # Single = 2 × unique_sum - total_sum
        # Because: 2 × unique_sum = sum of pairs + 2 × single
        # And: total_sum = sum of pairs + single
        return 2 * unique_sum - total_sum
```
<!-- slide -->
```cpp
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
    int singleNumber(vector<int>& nums) {
        unordered_set<int> uniqueSet;
        long long unique_sum = 0;
        long long total_sum = 0;
        
        for (int num : nums) {
            total_sum += num;
            if (uniqueSet.find(num) == uniqueSet.end()) {
                unique_sum += num;
                uniqueSet.insert(num);
            }
        }
        
        return 2 * unique_sum - total_sum;
    }
};
```
<!-- slide -->
```java
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int singleNumber(int[] nums) {
        Set<Integer> uniqueSet = new HashSet<>();
        long unique_sum = 0;
        long total_sum = 0;
        
        for (int num : nums) {
            total_sum += num;
            if (uniqueSet.add(num)) {
                unique_sum += num;
            }
        }
        
        return (int)(2 * unique_sum - total_sum);
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
    const uniqueSet = new Set();
    let unique_sum = 0;
    let total_sum = 0;
    
    for (const num of nums) {
        total_sum += num;
        if (!uniqueSet.has(num)) {
            unique_sum += num;
            uniqueSet.add(num);
        }
    }
    
    return 2 * unique_sum - total_sum;
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(n) - Set creation and summation are both O(n) |
| **Space** | O(n) - Set stores up to n/2 + 1 unique elements |

---

### Approach 4: Sorting (O(n log n) Time, O(1) Space)

A straightforward approach that sorts the array and finds the single element.

#### Algorithm

1. Sort the array
2. Traverse through adjacent pairs
3. Find the pair where elements don't match
4. Return the unmatched element

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        nums.sort()
        
        # Check first element
        if len(nums) == 1 or nums[0] != nums[1]:
            return nums[0]
        
        # Check pairs
        for i in range(1, len(nums) - 1, 2):
            if nums[i] != nums[i + 1]:
                return nums[i]
        
        # Last element is the answer (if not checked yet)
        return nums[-1]
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int singleNumber(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        
        // Check first element
        if (nums.size() == 1 || nums[0] != nums[1]) {
            return nums[0];
        }
        
        // Check pairs
        for (size_t i = 1; i + 1 < nums.size(); i += 2) {
            if (nums[i] != nums[i + 1]) {
                return nums[i];
            }
        }
        
        // Last element is the answer
        return nums.back();
    }
};
```
<!-- slide -->
```java
import java.util.Arrays;

class Solution {
    public int singleNumber(int[] nums) {
        Arrays.sort(nums);
        
        // Check first element
        if (nums.length == 1 || nums[0] != nums[1]) {
            return nums[0];
        }
        
        // Check pairs
        for (int i = 1; i + 1 < nums.length; i += 2) {
            if (nums[i] != nums[i + 1]) {
                return nums[i];
            }
        }
        
        // Last element is the answer
        return nums[nums.length - 1];
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
    nums.sort((a, b) => a - b);
    
    // Check first element
    if (nums.length === 1 || nums[0] !== nums[1]) {
        return nums[0];
    }
    
    // Check pairs
    for (let i = 1; i + 1 < nums.length; i += 2) {
        if (nums[i] !== nums[i + 1]) {
            return nums[i];
        }
    }
    
    // Last element is the answer
    return nums[nums.length - 1];
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(n log n) - Dominated by sorting |
| **Space** | O(1) - Sorting can be done in-place |

---

## Complexity Analysis

### Comparison of All Approaches

| Approach | Time Complexity | Space Complexity | Status |
|----------|-----------------|------------------|--------|
| **Bitwise XOR** | O(n) | O(1) | ✅ **Optimal** |
| **Hash Set** | O(n) | O(n) | ❌ Not optimal |
| **Mathematical** | O(n) | O(n) | ❌ Not optimal |
| **Sorting** | O(n log n) | O(1) | ❌ Not optimal |

### Deep Dive: XOR Approach Complexity

**Time Complexity: O(n)**
- We iterate through the array exactly once
- Each XOR operation is O(1)
- Total: n × O(1) = O(n)

**Space Complexity: O(1)**
- Only one variable (`result`) is used
- Regardless of input size, memory usage is constant
- No data structures that grow with input

### Why XOR is Optimal

1. **Perfect Fit**: The problem guarantees exactly one single element and all others appear twice
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
   The algorithm correctly handles this case.

2. **Negative Numbers**
   ```
   nums = [-1, -1, 2] → Output: 2
   ```
   XOR works correctly with negative numbers (two's complement representation).

3. **Zero in the Array**
   ```
   nums = [0, 1, 1] → Output: 0
   ```
   Remember: `0 ^ 0 = 0` and `0 ^ x = x`.

4. **Large Numbers**
   ```
   nums = [30000, -30000, 30000] → Output: -30000
   ```
   Works with numbers at the boundary of the constraint range.

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

3. **Not handling negative numbers properly**
   - The XOR approach handles negatives correctly in Python
   - In languages like C++/Java, ensure proper handling of signed integers

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Frequently asked in technical interviews
- **Companies**: Google, Amazon, Meta, Apple, Microsoft, Bloomberg
- **Difficulty**: Easy, but tests fundamental understanding of bitwise operations
- **Variations**: Leads to Single Number II and Single Number III

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
| [Single Number II](https://leetcode.com/problems/single-number-ii/) | 137 | Medium | Elements appear 3 times except one |
| [Single Number III](https://leetcode.com/problems/single-number-iii/) | 260 | Medium | Two elements appear once, others twice |
| [Missing Number](https://leetcode.com/problems/missing-number/) | 268 | Easy | Find missing number from 0 to n |
| [Find the Difference](https://leetcode.com/problems/find-the-difference/) | 389 | Easy | Find added character in string |
| [Set Mismatch](https://leetcode.com/problems/set-mismatch/) | 645 | Easy | Find duplicate and missing number |

### Similar Concepts

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Find Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/) | 287 | Medium | Floyd's cycle detection |
| [Single Element in Sorted Array](https://leetcode.com/problems/single-element-in-a-sorted-array/) | 540 | Medium | Binary search solution |
| [Majority Element](https://leetcode.com/problems/majority-element/) | 169 | Easy | Boyer-Moore voting algorithm |
| [Counting Bits](https://leetcode.com/problems/counting-bits/) | 338 | Easy | Bit manipulation patterns |

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
   - See "Single Number II" problem (bit manipulation approach)

5. **How would you handle the case where two elements appear once?**
   - See "Single Number III" problem (two-pass XOR approach)

6. **Can you solve this without using any extra variables?**
   - No, you need at least one variable to store the running XOR result

### Advanced Level

7. **How would you prove that XOR is the only operation that works?**
   - Need an operation that is: commutative, associative, has identity, and self-inverses
   - XOR and XNOR are the only binary operations with these properties

8. **How does this relate to finding a cycle in a linked list?**
   - The XOR approach can be viewed as finding the "start" of a pattern repetition, much like how Floyd's Tortoise and Hare algorithm finds the start of a cycle in a linked list
   - **Key Analogy**: In linked list cycle detection, two pointers move at different speeds. When they meet inside a cycle, we find the cycle's entry point by resetting one pointer to the start
   - **Pattern Recognition**: Both problems involve identifying where a repeating pattern deviates or breaks
   - **XOR as "Cycle Detection" for Numbers**:
     - Imagine each number in the array "points to" its duplicate (like a linked list node pointing to next)
     - Pairs form cycles: a → a → a (self-loop back to itself)
     - The single element is the "entry point" that doesn't connect back to anything
     - XOR effectively "finds" this unique entry point by canceling out all the cycles (pairs)
   - **Mathematical Connection**:
     - In cycle detection: `distance from head to cycle = distance from meeting point to cycle`
     - In Single Number: XOR of all elements = XOR of all pairs (which cancel) + single element
     - Both use the property that "same things cancel out" (pairs in XOR, cycle in linked list)
   - **Memoryless Navigation**: Both algorithms work in O(1) space by using clever navigation (two pointers for cycle detection, XOR accumulation for single number)
   - **Real-world Parallel**: Just as cycle detection helps find memory leaks or infinite loops in programs, finding the single number helps identify anomalies in data streams where duplicates are expected

9. **How would you extend this to find K single elements in an array where all others appear M times?**
   - Generalize the bit counting approach from Single Number II

### Practical Implementation Questions

10. **What if you need to preserve the original array?**
    - The XOR approach doesn't modify the original array

11. **How would you test this solution?**
    - Test cases: single element, multiple pairs, negatives, zeros, large numbers

12. **What are the real-world applications of this pattern?**
    - Error detection/correction, cryptography, data deduplication

---

## Summary

The **Single Number** problem is a classic example of using bitwise operations for an elegant O(n) time, O(1) space solution. The key insights are:

1. **XOR Properties**: `a ^ a = 0` and `a ^ 0 = a` make XOR perfect for canceling pairs
2. **Single Pass**: One iteration through the array is sufficient
3. **Constant Space**: Only one variable needed regardless of input size
4. **Universal Application**: Works with positive, negative, and zero values

---

## LeetCode Link

[Single Number - LeetCode](https://leetcode.com/problems/single-number/)
