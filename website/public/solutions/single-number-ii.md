# Single Number II

## Problem Description

Given an integer array where every element appears exactly three times except for one element that appears exactly once, find the single element.

### Requirements

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

---

## Examples

**Example 1:**
```
Input: nums = [2,2,3,2]
Output: 3
```

**Example 2:**
```
Input: nums = [0,1,0,1,0,1,99]
Output: 99
```

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= nums.length <= 3 * 10^4` | Array length |
| `-2^31 <= nums[i] <= 2^31 - 1` | Element value |

---

## Pattern:

This problem follows the **Bit Manipulation - K-Times Appearance** pattern, where we need to find elements that appear a different number of times than others using bit-level operations.

### Core Concept

- Track bit appearances across all numbers using **modulo arithmetic**
- For elements appearing K times: use modulo K to isolate the remaining count
- Each bit position is independent - process 32 bits (for 32-bit integers)

### When to Use This Pattern

This pattern is applicable when:
1. Finding elements with different occurrence frequency
2. Problems requiring O(1) space solution
3. Bit-level manipulation challenges
4. State machine design for tracking cycles

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Hash Map | Simple but O(n) space |
| XOR (for pairs) | Works when elements appear twice |
| Sorting | O(n log n) time, O(1) space (not in-place) |

---

## Intuition

This problem extends the Single Number problem where elements appear twice. Now each element appears three times except one.

### Why Simple XOR Doesn't Work

In Single Number (where elements appear twice), XOR works because:
- `a ^ a = 0` (pairs cancel out)
- `a ^ 0 = a` (single element remains)

With elements appearing three times, XOR leaves us with the single element three times XORed:
- `a ^ a ^ a = a` (not 0!)

### The Key Insight: Bit Counting

For each bit position (0-31), count how many numbers have that bit set:
- If the count % 3 == 1, the single number has this bit set to 1
- If the count % 3 == 0, the single number has this bit set to 0

This works because:
- Each appearing-three-times element contributes exactly 3 to the count (multiples of 3)
- Only the single element contributes the remainder (0 or 1)

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Bit Counting (Optimal)** - O(32n) time, O(1) space
2. **State Machine (Advanced)** - O(n) time, O(1) space
3. **Hash Map (Simple)** - O(n) time, O(n) space

---

## Approach 1: Bit Counting (Optimal)

This approach counts the number of set bits at each position across all numbers.

### Algorithm Steps

1. For each bit position from 0 to 31:
   - Count how many numbers have that bit set
   - If count % 3 == 1, set this bit in the result
2. Handle negative numbers by converting the result back to signed representation

### Why It Works

Each bit in the single number is independent. By counting the set bits at each position:
- Elements appearing 3 times contribute 3, 6, 9... to the count (always divisible by 3)
- The single element contributes either 0 or 1
- Taking count % 3 reveals the single element's bit

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        """
        Find the single number where every other element appears three times.
        
        Args:
            nums: List of integers where each element appears 3 times except one
            
        Returns:
            The single element that appears only once
        """
        result = 0
        
        # Process each bit position (0 to 31 for 32-bit integers)
        for i in range(32):
            count = 0
            # Count how many numbers have bit i set
            for num in nums:
                if num & (1 << i):
                    count += 1
            
            # If count mod 3 is 1, the single number has this bit set
            if count % 3 == 1:
                result |= (1 << i)
        
        # Handle negative numbers (two's complement representation)
        # If the sign bit (bit 31) is set, convert to negative
        if result >= 2**31:
            result -= 2**32
        
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
        
        // Process each bit position (0 to 31)
        for (int i = 0; i < 32; i++) {
            int count = 0;
            // Count how many numbers have bit i set
            for (int num : nums) {
                if (num & (1 << i)) {
                    count++;
                }
            }
            
            // If count mod 3 is 1, set this bit in result
            if (count % 3 == 1) {
                result |= (1 << i);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int singleNumber(int[] nums) {
        int result = 0;
        
        // Process each bit position (0 to 31)
        for (int i = 0; i < 32; i++) {
            int count = 0;
            // Count how many numbers have bit i set
            for (int num : nums) {
                if ((num & (1 << i)) != 0) {
                    count++;
                }
            }
            
            // If count mod 3 is 1, set this bit in result
            if (count % 3 == 1) {
                result |= (1 << i);
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
 * @return {number}
 */
var singleNumber = function(nums) {
    let result = 0;
    
    // Process each bit position (0 to 31)
    for (let i = 0; i < 32; i++) {
        let count = 0;
        // Count how many numbers have bit i set
        for (let num of nums) {
            if (num & (1 << i)) {
                count++;
            }
        }
        
        // If count mod 3 is 1, set this bit in result
        if (count % 3 === 1) {
            result |= (1 << i);
        }
    }
    
    // Handle negative numbers
    if (result >= Math.pow(2, 31)) {
        result -= Math.pow(2, 32);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(32 × n) = O(n) - 32 bits times n elements |
| **Space** | O(1) - only result and count variables |

---

## Approach 2: State Machine (Advanced)

This is an elegant O(n) O(1) solution using a finite state machine with two variables.

### Algorithm Steps

We track two variables: `ones` and `twos`:
- `ones`: Bits that have appeared once
- `twos`: Bits that have appeared twice

For each number:
1. `twos |= ones & num` - bits that appeared twice
2. `ones ^= num` - toggle bits appeared once
3. `common_mask = ~(ones & twos)` - bits appeared three times
4. Clear bits that appeared three times from both

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        """
        Find the single number using state machine approach.
        
        Args:
            nums: List of integers where each element appears 3 times except one
            
        Returns:
            The single element that appears only once
        """
        ones = 0   # Bits that have appeared once
        twos = 0   # Bits that have appeared twice
        
        for num in nums:
            # Update twos first (before modifying ones)
            twos |= ones & num
            # Update ones
            ones ^= num
            # Clear bits that have appeared three times
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
        int ones = 0;   // Bits that have appeared once
        int twos = 0;   // Bits that have appeared twice
        
        for (int num : nums) {
            // Update twos first
            twos |= ones & num;
            // Update ones
            ones ^= num;
            // Clear bits that have appeared three times
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
        int ones = 0;   // Bits that have appeared once
        int twos = 0;   // Bits that have appeared twice
        
        for (int num : nums) {
            // Update twos first
            twos |= ones & num;
            // Update ones
            ones ^= num;
            // Clear bits that have appeared three times
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
    let ones = 0;   // Bits that have appeared once
    let twos = 0;   // Bits that have appeared twice
    
    for (let num of nums) {
        // Update twos first
        twos |= ones & num;
        // Update ones
        ones ^= num;
        // Clear bits that have appeared three times
        const common_mask = ~(ones & twos);
        ones &= common_mask;
        twos &= common_mask;
    }
    
    return ones;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass through array |
| **Space** | O(1) - only two variables |

---

## Approach 3: Hash Map (Simple)

A simple approach using a hash map to count occurrences.

### Code Implementation

````carousel
```python
from typing import List
from collections import Counter

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        """
        Find the single number using hash map.
        
        Args:
            nums: List of integers where each element appears 3 times except one
            
        Returns:
            The single element that appears only once
        """
        count = Counter(nums)
        
        for num, cnt in count.items():
            if cnt == 1:
                return num
        
        return -1  # Should never reach here
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int singleNumber(vector<int>& nums) {
        unordered_map<int, int> count;
        
        for (int num : nums) {
            count[num]++;
        }
        
        for (const auto& pair : count) {
            if (pair.second == 1) {
                return pair.first;
            }
        }
        
        return -1;  // Should never reach here
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int singleNumber(int[] nums) {
        Map<Integer, Integer> count = new HashMap<>();
        
        for (int num : nums) {
            count.put(num, count.getOrDefault(num, 0) + 1);
        }
        
        for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
            if (entry.getValue() == 1) {
                return entry.getKey();
            }
        }
        
        return -1;  // Should never reach here
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
    const count = {};
    
    for (const num of nums) {
        count[num] = (count[num] || 0) + 1;
    }
    
    for (const [num, cnt] of Object.entries(count)) {
        if (cnt === 1) {
            return parseInt(num);
        }
    }
    
    return -1;  // Should never reach here
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass + hash lookup |
| **Space** | O(n) - hash map storing up to n/3 + 1 elements |

---

## Comparison of Approaches

| Aspect | Bit Counting | State Machine | Hash Map |
|--------|-------------|---------------|----------|
| **Time Complexity** | O(32n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(1) | O(n) |
| **Implementation** | Simple | Elegant/Complex | Very Simple |
| **Practical Speed** | Fast | Very Fast | Moderate |
| **Best For** | Interviews/General | Performance | Quick solution |

---

## Why This Problem is Important

### Interview Relevance
- **Frequency**: Very frequently asked in technical interviews
- **Companies**: Google, Amazon, Meta, Apple, Microsoft
- **Difficulty**: Medium
- **Concepts**: Bit manipulation, state machines, mathematical reasoning

### Key Learnings
1. **Bit-level thinking**: Understanding how to work with individual bits
2. **State machines**: Using finite states to track patterns
3. **Mathematical reasoning**: How modulo helps isolate the single element
4. **Handling edge cases**: Negative numbers in two's complement

---

## Related Problems

### Same Pattern (Bit Manipulation)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Single Number II | [Link](https://leetcode.com/problems/single-number-ii/) | Medium | This problem |
| Single Number | [Link](https://leetcode.com/problems/single-number/) | Easy | Elements appear twice |
| Single Number III | [Link](https://leetcode.com/problems/single-number-iii/) | Medium | Two elements appear once |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Missing Number | [Link](https://leetcode.com/problems/missing-number/) | Easy | XOR pattern |
| Bitwise XOR | [Link](https://leetcode.com/problems/bitwise-xor-of-all-pairings/) | Easy | XOR properties |
| Count Bits | [Link](https://leetcode.com/problems/counting-bits/) | Easy | Bit counting |

---

## Video Tutorial Links

### Bit Manipulation Techniques

1. **[Single Number II - NeetCode](https://www.youtube.com/watch?v=Ve7J4D5Xh1U)** - Clear explanation with visual examples
2. **[LeetCode 137 - Single Number II](https://www.youtube.com/watch?v=yl0xuQKm6ao)** - Detailed walkthrough
3. **[State Machine Approach Explained](https://www.youtube.com/watch?v=1H6zCf7fyqo)** - Advanced technique

### Related Concepts

- **[Bit Manipulation Basics](https://www.youtube.com/watch?v=NLK-E5wdLx0)** - Foundation concepts
- **[XOR Properties](https://www.youtube.com/watch?v=8fItF8f3y_k)** - Understanding XOR

---

## Follow-up Questions

### Q1: What if elements appear K times (K > 1) instead of 3?

**Answer:** For K times, you can generalize the bit counting approach:
- Use K-1 state variables for the state machine approach
- For bit counting, use count % K instead of count % 3

---

### Q2: How does the state machine handle negative numbers?

**Answer:** The state machine naturally handles negative numbers because it works on individual bits. The two's complement representation works correctly with bitwise operations.

---

### Q3: Can you solve this using only one variable?

**Answer:** Yes! There's an advanced one-liner using the expression: `(ones ^ num) & ~twos` for updating ones. However, you still need to track twos as well.

---

### Q4: What makes this problem harder than Single Number I?

**Answer:** In Single Number I (elements appear twice), XOR elegantly cancels out pairs. With elements appearing three times, XOR doesn't work because a ^ a ^ a = a. We need more sophisticated bit manipulation.

---

### Q5: How would you extend this to find two elements appearing once?

**Answer:** This would be a combination of Single Number II and Single Number III. Use XOR to find the difference, then use the rightmost set bit to separate the two elements.

---

### Q6: Why do we process 32 bits specifically?

**Answer:** We're assuming 32-bit signed integers (the constraint). For Python, we handle the sign bit separately. In Java and C++, int is 32 bits.

---

### Q7: What if the array has only one element?

**Answer:** The algorithm handles this correctly - the single element would have count = 1 for all bits, so it would be reconstructed correctly.

---

### Q8: How would you verify correctness?

**Answer:**
- Test with known examples: [2,2,3,2] → 3
- Test with negative numbers: [-2,-2,-2,-5] → -5
- Test edge case: single element array
- Compare with hash map approach for verification

---

### Q9: What is the mathematical basis for bit counting?

**Answer:** Each bit position is independent. For any bit:
- Sum of bits from tripling elements = 3 × (count of ones)
- Single element's bit = (total count) % 3
This works because modulo arithmetic reveals the remainder.

---

### Q10: How does Python's unlimited precision affect the solution?

**Answer:** Python integers have unlimited precision. We need to explicitly handle the 32-bit signed range for negative numbers. After processing all 32 bits, if result >= 2^31, we subtract 2^32 to get the negative value.

---

## Common Pitfalls

### 1. Not Handling Negative Numbers
**Issue**: Returning a large positive number instead of negative.

**Solution**: After constructing the result, check if the sign bit is set and convert to negative using two's complement rules.

### 2. Loop Order in State Machine
**Issue**: Updating twos after ones loses information.

**Solution**: Always update twos first, then ones. The order matters because twos depends on the previous state of ones.

### 3. Integer Overflow in Bit Shifting
**Issue**: Shifting 1 << 31 in Java/C++ causes overflow.

**Solution**: Use 1L in Java or cast to long before shifting. For 32-bit, shift by i where i < 32.

### 4. Wrong Modulo Operation
**Issue**: Using count / 3 instead of count % 3.

**Solution**: Use modulo (remainder) to get the single element's bit, not division.

---

## Summary

The **Single Number II** problem demonstrates advanced **bit manipulation** techniques:

- **Bit counting**: Count set bits at each position, use modulo 3
- **State machine**: Track bit appearances using two variables
- **O(1) space**: Both optimal approaches use constant space

This pattern extends to:
- Any K-appearing problem (not just 3)
- Finding multiple single elements
- Generalizing bit-level pattern recognition

Understanding these techniques is crucial for:
- Technical interviews at top companies
- Low-level programming and systems
- Optimization problems
