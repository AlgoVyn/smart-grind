# Permutations

## Category
Backtracking

## Description
Generate all permutations of elements.

---

## Algorithm Explanation
The Permutations problem asks to generate all possible arrangements of elements in a collection. This is a classic backtracking problem where we explore all possible orderings.

### Key Concepts:
- **Backtracking**: Build permutations incrementally, undoing choices to explore other paths
- **Swapping**: Swap elements in-place to generate permutations without extra space
- **Pruning**: Skip already-used elements using a visited array or by swapping

### How It Works:
1. Start with the first position
2. Try each element from current position to end
3. Swap the chosen element into position
4. Recursively generate permutations for remaining positions
5. Backtrack: swap back to original position
6. Base case: when all positions are filled, add permutation to result

### Time Complexity:
O(n! * n) - There are n! permutations, and it takes O(n) time to copy each one.

## When to Use
Use this algorithm when you need to solve problems involving:
- backtracking related operations
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

def permute(nums: List[int]) -> List[List[int]]:
    """
    Generate all permutations of an array using backtracking.
    
    Args:
        nums: List of distinct integers
    
    Returns:
        List of all possible permutations
    """
    result = []
    n = len(nums)
    
    def backtrack(start: int):
        # Base case: all positions filled
        if start == n:
            result.append(nums[:])  # Make a copy
            return
        
        # Try each element from start to end
        for i in range(start, n):
            # Swap element into position
            nums[start], nums[i] = nums[i], nums[start]
            # Recurse for remaining positions
            backtrack(start + 1)
            # Backtrack: restore original order
            nums[start], nums[i] = nums[i], nums[start]
    
    backtrack(0)
    return result


def permute_with_used(nums: List[int]) -> List[List[int]]:
    """
    Alternative implementation using a used array.
    """
    result = []
    n = len(nums)
    used = [False] * n
    current = []
    
    def backtrack():
        if len(current) == n:
            result.append(current[:])
            return
        
        for i in range(n):
            if not used[i]:
                used[i] = True
                current.append(nums[i])
                backtrack()
                current.pop()
                used[i] = False
    
    backtrack()
    return result


# Example usage
if __name__ == "__main__":
    nums = [1, 2, 3]
    result = permute(nums)
    print(f"Input: {nums}")
    print(f"Number of permutations: {len(result)}")
    for p in result:
        print(p)
```

```javascript
function permutations() {
    // Permutations implementation
    // Time: O(n! * n)
    // Space: O(n)
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
Input: [1, 2, 3]
Number of permutations: 6
[1, 2, 3]
[1, 3, 2]
[2, 1, 3]
[2, 3, 1]
[3, 2, 1]
[3, 1, 2]
```

**Explanation:**
- For [1,2,3], we have 3! = 6 permutations
- The algorithm uses backtracking: choose element, recurse, backtrack
- Each element gets placed in each position exactly 2! = 2 times

---

## Time Complexity
**O(n! * n)**

---

## Space Complexity
**O(n)**

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
