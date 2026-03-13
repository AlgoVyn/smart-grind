# Total Hamming Distance

## Problem Description

The Hamming distance between two integers is the number of positions at which the corresponding bits are different.

Given an integer array `nums`, return the sum of Hamming distances between all the pairs of the integers in `nums`.

**Link to problem:** [Total Hamming Distance - LeetCode 477](https://leetcode.com/problems/total-hamming-distance/)

**Example 1:**

Input: `nums = [4,14,2]`
Output: `6`

Explanation: In binary representation, the `4` is `0100`, `14` is `1110`, and `2` is `0010` (just showing the four bits relevant in this case).

The answer will be:
`HammingDistance(4, 14) + HammingDistance(4, 2) + HammingDistance(14, 2) = 2 + 2 + 2 = 6`.

**Example 2:**

Input: `nums = [4,14,4]`
Output: `4`

---

## Constraints

- `1 <= nums.length <= 10^4`
- `0 <= nums[i] <= 10^9`
- The answer for the given input will fit in a 32-bit integer.

---

## Pattern: Bit Manipulation - Population Count

This problem demonstrates how to compute pairwise Hamming distance efficiently by analyzing each bit position independently rather than computing distances for all pairs directly.

### Core Concept

The key insight is that for each bit position:
- Count how many numbers have that bit set (ones)
- Count how many numbers have that bit unset (zeros)
- The contribution to total Hamming distance is: `ones * zeros`

This works because for any pair of numbers, if one has bit 1 and the other has bit 0 at a position, the Hamming distance includes 1 for that position.

---

## Examples

### Example

**Input:**
```
nums = [4, 14, 2]
```

**Binary representation:**
- 4 = 0100
- 14 = 1110
- 2 = 0010

**Bit-by-bit analysis:**
- Bit 0 (LSB): 0 + 0 + 0 = 0 ones, 3 zeros → contribution = 0
- Bit 1: 0 + 1 + 1 = 2 ones, 1 zero → contribution = 2 * 1 = 2
- Bit 2: 1 + 1 + 0 = 2 ones, 1 zero → contribution = 2 * 1 = 2
- Bit 3: 0 + 1 + 0 = 1 one, 2 zeros → contribution = 1 * 2 = 2

**Total:** 0 + 2 + 2 + 2 = 6

### Example 2

**Input:**
```
nums = [4, 14, 4]
```

**Binary representation:**
- 4 = 0100
- 14 = 1110
- 4 = 0100

**Bit-by-bit analysis:**
- Bit 0: 0 + 0 + 0 = 0 ones, 3 zeros → 0
- Bit 1: 0 + 1 + 0 = 1 one, 2 zeros → 2
- Bit 2: 1 + 1 + 1 = 3 ones, 0 zeros → 0
- Bit 3: 0 + 1 + 0 = 1 one, 2 zeros → 2

**Total:** 0 + 2 + 0 + 2 = 4

---

## Intuition

The key insight is to avoid O(n²) pairwise comparisons by using a mathematical optimization:

1. **Instead of comparing all pairs**, analyze each bit position independently
2. **For each bit position**, the number of differing pairs = (count of 1s) × (count of 0s)
3. **Sum across all bit positions** to get total Hamming distance

### Why This Works

For any two numbers at a specific bit position, there are only two possibilities:
- Both have the same bit → Hamming distance contribution is 0
- Different bits → Hamming distance contribution is 1

For n numbers at one bit position:
- If k numbers have bit 1, then (n-k) have bit 0
- Number of pairs with different bits = k × (n-k)

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Bit-by-Bit Counting (Optimal)** - O(32*n) time, O(1) space
2. **Brute Force** - O(n²) time, O(1) space
3. **Using Built-in Population Count** - O(n) time, O(1) space

---

## Approach 1: Bit-by-Bit Counting (Optimal)

This is the most efficient approach with O(32*n) time complexity.

### Algorithm Steps

1. For each bit position from 0 to 31:
   - Count how many numbers have that bit set (count of 1s)
   - Calculate count of 0s as (n - count of 1s)
   - Add contribution: ones * zeros to total
2. Return the total

### Why It Works

By processing each bit independently:
- Each pair contributes to exactly one bit position where they differ
- The mathematical product ones * zeros correctly counts all pairs with different bits
- Summing across all 32 bit positions gives the total Hamming distance

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def totalHammingDistance(self, nums: List[int]) -> int:
        """
        Calculate total Hamming distance using bit-by-bit counting.
        
        Args:
            nums: List of integers
            
        Returns:
            Total Hamming distance between all pairs
        """
        total = 0
        n = len(nums)
        
        # Check each of the 32 bits
        for i in range(32):
            count = 0
            for num in nums:
                # Check if the i-th bit is set
                if num & (1 << i):
                    count += 1
            
            # Pairs with different bits at position i
            # = (count of 1s) * (count of 0s)
            total += count * (n - count)
        
        return total
```

<!-- slide -->
```cpp
class Solution {
public:
    /**
     * Calculate total Hamming distance using bit-by-bit counting.
     *
     * @param nums: Vector of integers
     * @return: Total Hamming distance between all pairs
     */
    int totalHammingDistance(vector<int>& nums) {
        int total = 0;
        int n = nums.size();
        
        // Check each of the 32 bits
        for (int i = 0; i < 32; i++) {
            int count = 0;
            for (int num : nums) {
                // Check if the i-th bit is set
                if (num & (1 << i)) {
                    count++;
                }
            }
            
            // Pairs with different bits at position i
            // = (count of 1s) * (count of 0s)
            total += count * (n - count);
        }
        
        return total;
    }
};
```

<!-- slide -->
```java
class Solution {
    /**
     * Calculate total Hamming distance using bit-by-bit counting.
     *
     * @param nums: Array of integers
     * @return: Total Hamming distance between all pairs
     */
    public int totalHammingDistance(int[] nums) {
        int total = 0;
        int n = nums.length;
        
        // Check each of the 32 bits
        for (int i = 0; i < 32; i++) {
            int count = 0;
            for (int num : nums) {
                // Check if the i-th bit is set
                if ((num & (1 << i)) != 0) {
                    count++;
                }
            }
            
            // Pairs with different bits at position i
            // = (count of 1s) * (count of 0s)
            total += count * (n - count);
        }
        
        return total;
    }
}
```

<!-- slide -->
```javascript
/**
 * Calculate total Hamming distance using bit-by-bit counting.
 * 
 * @param {number[]} nums - Array of integers
 * @return {number} - Total Hamming distance between all pairs
 */
var totalHammingDistance = function(nums) {
    let total = 0;
    const n = nums.length;
    
    // Check each of the 32 bits
    for (let i = 0; i < 32; i++) {
        let count = 0;
        for (const num of nums) {
            // Check if the i-th bit is set
            if (num & (1 << i)) {
                count++;
            }
        }
        
        // Pairs with different bits at position i
        // = (count of 1s) * (count of 0s)
        total += count * (n - count);
    }
    
    return total;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(32 * n) = O(n) - 32 is constant |
| **Space** | O(1) - Only a few integer variables |

---

## Approach 2: Brute Force

This is the straightforward O(n²) approach for comparison.

### Algorithm Steps

1. Initialize total to 0
2. For each pair (i, j) where i < j:
   - Calculate Hamming distance between nums[i] and nums[j]
   - Add to total
3. Return total

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def totalHammingDistance_brute(self, nums: List[int]) -> int:
        """
        Calculate total Hamming distance using brute force.
        """
        total = 0
        n = len(nums)
        
        for i in range(n):
            for j in range(i + 1, n):
                # Calculate Hamming distance
                xor = nums[i] ^ nums[j]
                # Count set bits in xor
                total += bin(xor).count('1')
        
        return total
```

<!-- slide -->
```cpp
class Solution {
public:
    int totalHammingDistance(vector<int>& nums) {
        int total = 0;
        int n = nums.size();
        
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                // Calculate Hamming distance
                int xor_val = nums[i] ^ nums[j];
                // Count set bits
                total += __builtin_popcount(xor_val);
            }
        }
        
        return total;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int totalHammingDistance(int[] nums) {
        int total = 0;
        int n = nums.length;
        
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                // Calculate Hamming distance
                int xor_val = nums[i] ^ nums[j];
                // Count set bits
                total += Integer.bitCount(xor_val);
            }
        }
        
        return total;
    }
}
```

<!-- slide -->
```javascript
var totalHammingDistance = function(nums) {
    let total = 0;
    const n = nums.length;
    
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            // Calculate Hamming distance
            const xor = nums[i] ^ nums[j];
            // Count set bits
            total += xor.toString(2).split('1').length - 1;
        }
    }
    
    return total;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - All pairs compared |
| **Space** | O(1) - Only a few variables |

---

## Approach 3: Using Built-in Population Count

This approach uses built-in bit counting functions for cleaner code.

### Algorithm Steps

1. Use language built-in functions to count bits efficiently
2. Same logic as Approach 1 but with optimized bit counting

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def totalHammingDistance_builtin(self, nums: List[int]) -> int:
        """
        Calculate using built-in bit counting.
        """
        total = 0
        n = len(nums)
        
        for i in range(32):
            bit_count = sum((num >> i) & 1 for num in nums)
            total += bit_count * (n - bit_count)
        
        return total
```

<!-- slide -->
```cpp
class Solution {
public:
    int totalHammingDistance(vector<int>& nums) {
        int total = 0;
        int n = nums.size();
        
        for (int i = 0; i < 32; i++) {
            int bitCount = 0;
            for (int num : nums) {
                if (num & (1 << i)) {
                    bitCount++;
                }
            }
            total += bitCount * (n - bitCount);
        }
        
        return total;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int totalHammingDistance(int[] nums) {
        int total = 0;
        int n = nums.length;
        
        for (int i = 0; i < 32; i++) {
            int bitCount = 0;
            for (int num : nums) {
                if ((num & (1 << i)) != 0) {
                    bitCount++;
                }
            }
            total += bitCount * (n - bitCount);
        }
        
        return total;
    }
}
```

<!-- slide -->
```javascript
var totalHammingDistance = function(nums) {
    let total = 0;
    const n = nums.length;
    
    for (let i = 0; i < 32; i++) {
        let bitCount = 0;
        for (const num of nums) {
            if ((num >> i) & 1) {
                bitCount++;
            }
        }
        total += bitCount * (n - bitCount);
    }
    
    return total;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each bit counted once |
| **Space** | O(1) - Constant extra space |

---

## Comparison of Approaches

| Aspect | Bit-by-Bit | Brute Force | Built-in Popcount |
|--------|------------|-------------|-------------------|
| **Time Complexity** | O(n) | O(n²) | O(n) |
| **Space Complexity** | O(1) | O(1) | O(1) |
| **Implementation** | Moderate | Simple | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ✅ Yes |

**Best Approach:** Bit-by-bit counting (Approach 1) is optimal with O(n) time complexity.

---

## Why Bit-by-Bit is Optimal

The bit-by-bit approach is optimal because:

1. **Mathematical Insight**: ones * zeros correctly counts differing pairs
2. **Constant Time per Bit**: Only 32 bits to process (for 32-bit integers)
3. **No Redundant Work**: Avoids computing XOR for each pair
4. **Efficient**: Reduces O(n²) to O(n)
5. **Scalable**: Works well for large n (up to 10⁴)

The key insight is that instead of comparing all pairs, we analyze each bit position independently and use the mathematical product to count differing pairs.

---

## Related Problems

Based on similar themes (bit manipulation, Hamming distance):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of 1 Bits | [Link](https://leetcode.com/problems/number-of-1-bits/) | Count set bits |
| Hamming Distance | [Link](https://leetcode.com/problems/hamming-distance/) | Single pair distance |
| Reverse Bits | [Link](https://leetcode.com/problems/reverse-bits/) | Bit reversal |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Total Hamming Distance | [Link](https://leetcode.com/problems/total-hamming-distance/) | This problem! |
| Sum of XOR of All Pairs | [Link](https://leetcode.com/problems/sum-of-xor-of-all-pairs/) | Similar bit analysis |
| Minimum XOR Sum | [Link](https://leetcode.com/problems/minimum-xor-sum-of-two-arrays/) | XOR-based optimization |

### Pattern Reference

For more detailed explanations of bit manipulation patterns, see:
- **[Bit Manipulation Patterns](/patterns/bit-manipulation)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Bit Manipulation Techniques

- [NeetCode - Total Hamming Distance](https://www.youtube.com/watch?v=0J8YjfXmX6Q) - Clear explanation
- [Total Hamming Distance Explanation](https://www.youtube.com/watch?v=Q1akenqBo7E) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=3kO8r3rB4Jw) - Official solution
- [Bit Manipulation Tricks](https://www.youtube.com/watch?v=NLKQEOlMBBk) - Understanding bit operations

### Related Concepts

- [XOR Operations](https://www.youtube.com/watch?v=5Kathrm92bQ) - XOR explained
- [Population Count](https://www.youtube.com/watch?v=-8mt3owricE) - Counting set bits

---

## Follow-up Questions

### Q1: How would you handle numbers larger than 32 bits?

**Answer:** Extend the loop from 32 to the appropriate number of bits (e.g., 64 for 64-bit numbers). In Python, you can use `num.bit_length()` to find the actual number of bits needed.

---

### Q2: Can you solve this using divide and conquer?

**Answer:** Yes! You can use a recursive approach that divides the array into halves, computes distances within each half, then combines results. This can be parallelized but is more complex.

---

### Q3: How would you modify for minimum XOR sum instead of total?

**Answer:** Minimum XOR sum requires a different approach - typically sorting the array first and then finding minimum XOR pairs. The bit analysis would be different since we're looking for minimum, not sum.

---

### Q4: What if you need the actual pairs with maximum distance?

**Answer:** You would need to track not just the count but also which numbers contribute to the maximum. This would require storing the actual pairs, changing the space complexity.

---

### Q5: How would you handle this in a streaming context?

**Answer:** For streaming data where you can't store all numbers, you can maintain running counts for each bit position. At the end, compute the sum. This requires O(32) space for counters.

---

### Q6: Can you parallelize this computation?

**Answer:** Yes! Each bit position is independent, so you can process different bits in parallel. In practice, the O(n) approach is already fast enough, but for very large datasets, parallel processing could help.

---

### Q7: What's the maximum possible answer for n numbers?

**Answer:** The maximum occurs when half the numbers have all bits set and half have all bits unset. For n numbers and 32 bits, the maximum is approximately n²/2 * 32.

---

### Q8: How would you verify correctness?

**Answer:** Compare against brute force for small arrays to verify. The mathematical property (ones * zeros) can also be proven by counting all pairs where bits differ.

---

## Common Pitfalls

### 1. Forgetting 32-bit Limit
**Issue**: Not considering that Python integers can be arbitrarily large.

**Solution**: Since nums[i] <= 10^9, 30 bits are enough, but we use 32 for safety.

### 2. Integer Overflow
**Issue**: Using smaller integer types that overflow.

**Solution:** Use 64-bit integers or language-specific big integers. The problem states answer fits in 32-bit, but intermediate calculations can be larger.

### 3. Wrong Bit Position
**Issue**: Using wrong bit position in shift operation.

**Solution:** Remember that (1 << i) shifts 1 by i positions.

### 4. Not Using XOR
**Issue:** Computing Hamming distance without XOR.

**Solution:** XOR reveals exactly which bits differ. Counting set bits in XOR gives Hamming distance.

### 5. Off-by-One in Loops
**Issue:** Using wrong range for bit positions.

**Solution:** Use range(32) to check all 32 bits.

---

## Summary

The **Total Hamming Distance** problem demonstrates powerful **bit manipulation** techniques:

- **Bit-by-bit counting**: Optimal O(n) solution
- **Mathematical insight**: ones * zeros counts differing pairs
- **32 constant**: Makes the solution practically linear
- **No pairwise comparison**: Avoids O(n²) brute force

The key insight is that by analyzing each bit position independently and using the mathematical product of ones and zeros, we can compute the total Hamming distance without comparing all pairs explicitly.

This problem is an excellent demonstration of how understanding bit-level operations and mathematical optimization can transform an O(n²) problem into O(n).

### Pattern Summary

This problem exemplifies the **Bit Manipulation** pattern, which is characterized by:
- Analyzing individual bit positions
- Using XOR to find differences
- Counting set bits (population count)
- Mathematical optimization

For more details on this pattern and its variations, see the **[Bit Manipulation Patterns](/patterns/bit-manipulation)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/total-hamming-distance/discuss/) - Community solutions
- [Hamming Distance - Wikipedia](https://en.wikipedia.org/wiki/Hamming_distance) - Theoretical background
- [Bit Manipulation - GeeksforGeeks](https://www.geeksforgeeks.org/bit-manipulation/) - Comprehensive guide
- [Pattern: Bit Manipulation](/patterns/bit-manipulation) - Detailed pattern guide
