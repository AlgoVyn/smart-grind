# House Robber

## Category
Dynamic Programming

## Description
The House Robber is a classic dynamic programming problem where you need to find the maximum amount of money you can rob from a linear arrangement of houses without robbing two adjacent houses. Each house contains a certain amount of money, and if you rob one house, you cannot rob its immediate neighbor.

The key insight is that at each house, you have two choices:
1. **Skip the current house**: The maximum amount is the same as what you could get from houses up to the previous house.
2. **Rob the current house**: The maximum amount is the current house's value plus the maximum amount from houses up to two houses back.

This leads to the recurrence: `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`

We can optimize space to O(1) by only keeping track of the previous two states.

---

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
def rob(nums: list[int]) -> int:
    """
    Calculate the maximum amount that can be robbed without robbing adjacent houses.
    
    Args:
        nums: List of non-negative integers representing money in each house
        
    Returns:
        Maximum amount that can be robbed
        
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0
    
    if len(nums) == 1:
        return nums[0]
    
    # Space-optimized DP - only need previous two values
    prev2 = 0  # Represents dp[i-2]
    prev1 = nums[0]  # Represents dp[i-1]
    
    for i in range(1, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = current
    
    return prev1


# Example usage
if __name__ == "__main__":
    # Test case 1
    houses = [1, 2, 3, 1]
    result = rob(houses)
    print(f"Maximum robbery from {houses}: {result}")  # Output: 4
    # Explanation: Rob house 0 (1) + house 2 (3) = 4
    
    # Test case 2
    houses = [2, 7, 9, 3, 1]
    result = rob(houses)
    print(f"Maximum robbery from {houses}: {result}")  # Output: 12
    # Explanation: Rob house 0 (2) + house 2 (9) + house 4 (1) = 12
    
    # Test case 3 - edge case with single house
    houses = [5]
    result = rob(houses)
    print(f"Maximum robbery from {houses}: {result}")  # Output: 5
    
    # Test case 4 - all zeros
    houses = [0, 0, 0]
    result = rob(houses)
    print(f"Maximum robbery from {houses}: {result}")  # Output: 0
```

```javascript
function houseRobber() {
    // House Robber implementation
    // Time: O(n)
    // Space: O(1)
}
```

---

## Example

**Input:**
```
houses = [1, 2, 3, 1]
```

**Output:**
```
Maximum robbery: 4
Explanation: Rob house at index 0 (value 1) + house at index 2 (value 3) = 4
```

**Input:**
```
houses = [2, 7, 9, 3, 1]
```

**Output:**
```
Maximum robbery: 12
Explanation: Rob house at index 0 (2) + index 2 (9) + index 4 (1) = 12
```

---

## Time Complexity
**O(n)**

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
