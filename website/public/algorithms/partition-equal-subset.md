# Partition Equal Subset

## Category
Dynamic Programming

## Description
Check if array can be partitioned into two subsets with equal sum.

---

## Algorithm Explanation
The Partition Equal Subset Sum problem asks whether an array can be partitioned into two subsets with equal sum. This is equivalent to finding a subset with sum equal to half of the total sum.

### Key Concepts:
- **Subset Sum DP**: Use dynamic programming to find if a subset with a given sum exists
- **Target Sum**: If total sum is odd, partition is impossible. Otherwise, target is sum/2
- **Space Optimization**: Use a bitset or 1D DP array for O(sum) space

### How It Works:
1. Calculate total sum of array
2. If sum is odd, return False (cannot partition into equal halves)
3. Create DP set/array to track reachable sums
4. For each element, update which sums are achievable
5. Check if target sum (sum/2) is reachable

### Why It Works:
If we can find a subset with sum = total/2, the remaining elements automatically sum to total/2 as well.

## When to Use
Use this algorithm when you need to solve problems involving:
- dynamic programming related operations
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
from typing import List

def can_partition(nums: List[int]) -> bool:
    """
    Check if array can be partitioned into two subsets with equal sum.
    
    Args:
        nums: List of positive integers
    
    Returns:
        True if array can be partitioned into two equal-sum subsets
    """
    total = sum(nums)
    
    # If total is odd, cannot partition into equal halves
    if total % 2 != 0:
        return False
    
    target = total // 2
    n = len(nums)
    
    # dp[i] = True if sum i is achievable
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        # Iterate backwards to avoid using same element twice
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
        
        # Early exit if target is reached
        if dp[target]:
            return True
    
    return dp[target]


def can_partition_set(nums: List[int]) -> bool:
    """
    Alternative implementation using set for space efficiency.
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    reachable = {0}
    
    for num in nums:
        reachable = reachable | {s + num for s in reachable if s + num <= target}
        if target in reachable:
            return True
    
    return target in reachable


# Example usage
if __name__ == "__main__":
    nums1 = [1, 5, 11, 5]
    print(f"Array: {nums1}")
    print(f"Can partition: {can_partition(nums1)}")  # True
    
    nums2 = [1, 2, 3, 5]
    print(f"\nArray: {nums2}")
    print(f"Can partition: {can_partition(nums2)}")  # False
    
    nums3 = [1, 2, 5]
    print(f"\nArray: {nums3}")
    print(f"Can partition: {can_partition(nums3)}")  # False
```

```javascript
function partitionEqualSubset() {
    // Partition Equal Subset implementation
    // Time: O(n * sum)
    // Space: O(sum)
}
```

---

## Example

**Input:**
```
nums = [1, 5, 11, 5]
```

**Output:**
```
Array: [1, 5, 11, 5]
Can partition: True
```

**Explanation:**
- Total sum = 22, target = 11
- Subset [1, 5, 5] sums to 11
- Remaining [11] also sums to 11
- Can partition into [1, 5, 5] and [11]

**Another Example:**
```
nums = [1, 2, 3, 5]
```

**Output:**
```
Can partition: False
```

Total sum = 11 (odd), cannot partition equally.

---

## Time Complexity
**O(n * sum)**

---

## Space Complexity
**O(sum)**

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
