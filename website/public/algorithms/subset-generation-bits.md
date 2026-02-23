# Subset Generation with Bits

## Category
Bit Manipulation

## Description
Generate all subsets using bit manipulation.

## Algorithm Explanation
Subset generation using bit manipulation is an elegant technique that leverages the relationship between binary numbers and subsets. For a set of n elements, there are 2^n possible subsets.

**Key Insight:**
- Each subset can be represented by an n-bit binary number
- The i-th bit being 1 means the i-th element is included in the subset
- Bit 0 (0000...) represents empty set, bit (2^n - 1) represents the full set

**Algorithm:**
1. **Count subsets**: There are 2^n subsets for n elements (from 0 to 2^n - 1)
2. **Generate each subset**: For each number from 0 to 2^n - 1:
   - Convert the number to binary representation
   - For each bit position, check if it's 1
   - If bit is 1, include the corresponding element
3. **Build subsets**: Create a list of elements where bits are 1

**Why bit manipulation works:**
- Binary numbers naturally enumerate all possible combinations
- Each unique number represents a unique subset
- Fast and memory-efficient compared to recursive approaches

**Time Complexity Analysis:**
- O(2^n × n): We generate 2^n subsets, and for each we check n bits

---

## When to Use
Use this algorithm when you need to solve problems involving:
- bit manipulation related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Implementation

```python
def subsets_bit(nums):
    """
    Generate all subsets using bit manipulation.
    
    Args:
        nums: List of distinct elements
    
    Returns:
        List of all possible subsets
    
    Time: O(2^n * n)
    Space: O(1) excluding output
    """
    n = len(nums)
    result = []
    
    # There are 2^n subsets (from 0 to 2^n - 1)
    for mask in range(1 << n):
        subset = []
        for i in range(n):
            # Check if i-th bit is set in mask
            if mask & (1 << i):
                subset.append(nums[i])
        result.append(subset)
    
    return result


# Alternative: Recursive bit manipulation
def subsets_bit_recursive(nums):
    """Recursive version with bit manipulation."""
    n = len(nums)
    result = []
    
    def backtrack(i, current):
        if i == n:
            result.append(current[:])
            return
        
        # Don't include nums[i]
        backtrack(i + 1, current)
        
        # Include nums[i]
        current.append(nums[i])
        backtrack(i + 1, current)
        current.pop()
    
    backtrack(0, [])
    return result


# Get subsets of specific size
def subsets_of_size(nums, k):
    """Generate subsets of exactly size k."""
    n = len(nums)
    result = []
    
    for mask in range(1 << n):
        # Count bits - only include if exactly k bits are set
        if bin(mask).count('1') == k:
            subset = []
            for i in range(n):
                if mask & (1 << i):
                    subset.append(nums[i])
            result.append(subset)
    
    return result


# Using built-in for bit counting (Python 3.8+)
def subsets_bit_fast(nums):
    """Optimized using bit_count()."""
    n = len(nums)
    result = []
    
    for mask in range(1 << n):
        subset = []
        # Use bit iteration instead of checking all n bits
        bit = mask
        idx = 0
        while bit:
            if bit & 1:
                subset.append(nums[idx])
            bit >>= 1
            idx += 1
        result.append(subset)
    
    return result
```

```javascript
function subsetsBit(nums) {
    const n = nums.length;
    const result = [];
    
    for (let mask = 0; mask < (1 << n); mask++) {
        const subset = [];
        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                subset.push(nums[i]);
            }
        }
        result.push(subset);
    }
    
    return result;
}
```

---

## Example

**Input:**
```
nums = [1, 2, 3]
```

**Output:**
```
[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
```

**Explanation:**
- n = 3, so 2^3 = 8 subsets
- mask 0 (000): [] - no bits set
- mask 1 (001): [1] - only first bit set
- mask 2 (010): [2] - only second bit set
- mask 3 (011): [1, 2] - first and second bits set
- mask 4 (100): [3] - only third bit set
- mask 5 (101): [1, 3]
- mask 6 (110): [2, 3]
- mask 7 (111): [1, 2, 3]

**Input:**
```
nums = [1]
```

**Output:**
```
[[], [1]]
```

**Input:**
```
nums = []
```

**Output:**
```
[[]]
```

**Input - Subsets of size 2:**
```
nums = [1, 2, 3, 4]
k = 2
```

**Output:**
```
[[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]
```

---

## Time Complexity
**O(2^n * n)**

---

## Space Complexity
**O(1)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
