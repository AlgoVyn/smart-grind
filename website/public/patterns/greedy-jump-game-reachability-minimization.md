# Greedy - Jump Game Reachability/Minimization

## Overview

The Greedy - Jump Game Reachability/Minimization pattern is employed in problems where you need to determine if it's possible to reach the end of an array or to find the minimum number of jumps required to do so. Each element in the array represents the maximum jump length from that position. This pattern uses a greedy approach by always trying to reach as far as possible in each step, which leads to optimal solutions for these types of problems.

When to use this pattern:
- When dealing with arrays where each element indicates a jump range
- For problems requiring reachability checks or minimum jump calculations
- In scenarios involving position-based movement with constraints

Benefits:
- Provides efficient O(n) time solutions compared to exponential alternatives
- Simplifies complex jump scenarios into linear traversals
- Guarantees optimal results for minimum jump problems due to the greedy choice property

## Key Concepts

- **Farthest Reach**: Track the maximum index reachable from the current position
- **Current End**: The end of the current jump range; when reached, update the jump count
- **Greedy Choice**: At each step, extend the farthest reachable index as much as possible
- **Reachability Check**: If the farthest reach ever goes beyond or equal to the last index, it's reachable

## Template

```python
def can_jump(nums):
    """
    Template for checking if you can reach the last index.
    
    Args:
    nums (List[int]): Array where nums[i] is the maximum jump length from index i
    
    Returns:
    bool: True if you can reach the last index, False otherwise
    """
    farthest = 0
    for i in range(len(nums)):
        # If current index is beyond farthest reachable, can't proceed
        if i > farthest:
            return False
        
        # Update farthest reachable index
        farthest = max(farthest, i + nums[i])
        
        # If farthest reaches or exceeds last index, can reach
        if farthest >= len(nums) - 1:
            return True
    
    return False

def jump(nums):
    """
    Template for finding minimum jumps to reach the last index.
    
    Args:
    nums (List[int]): Array where nums[i] is the maximum jump length from index i
    
    Returns:
    int: Minimum number of jumps required
    """
    if len(nums) <= 1:
        return 0
    
    jumps = 0
    current_end = 0
    farthest = 0
    
    for i in range(len(nums) - 1):  # Don't need to check last index
        # Update farthest reachable
        farthest = max(farthest, i + nums[i])
        
        # If reached the end of current jump range
        if i == current_end:
            jumps += 1
            current_end = farthest
            
            # If current_end reaches last index, done
            if current_end >= len(nums) - 1:
                break
    
    return jumps
```

## Example Problems

1. **Jump Game (LeetCode 55)**: Given an array of non-negative integers, determine if you can reach the last index starting from the first index.

2. **Jump Game II (LeetCode 45)**: Given an array of non-negative integers, find the minimum number of jumps required to reach the last index.

3. **Can Jump (LeetCode 55)**: Same as Jump Game, focused on reachability determination.

## Time and Space Complexity

- **Time Complexity**: O(n) where n is the length of the array, as we perform a single pass through the array.
- **Space Complexity**: O(1), using only a few variables to track farthest reach and current positions.

## Common Pitfalls

- **Off-by-One Errors**: Be careful with loop bounds, especially when checking the last index.
- **Early Termination**: In reachability checks, return False as soon as you can't proceed, but continue updating farthest in minimization.
- **Edge Cases**: Handle arrays of length 1 (0 jumps), arrays where first element is 0, and cases where jumps exceed array bounds.
- **Confusing Reachability and Minimization**: Use different logic for checking possibility vs. counting minimum jumps.
- **Not Updating Farthest Correctly**: Always update farthest with max(farthest, i + nums[i]) inside the loop.