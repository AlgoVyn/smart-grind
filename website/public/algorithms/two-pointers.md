# Two Pointers

## Category
Arrays & Strings

## Description
Use two pointers to traverse arrays efficiently, often from both ends or with different speeds.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- arrays & strings related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation

The Two Pointers technique uses two pointers to traverse a data structure, typically arrays or strings. It's highly efficient for sorted arrays, reducing time complexity from O(n^2) to O(n).

### Types of Two Pointers:

1. **Opposite Direction (Converging)**:
   - One pointer at start, one at end
   - Move toward each other
   - Common for: pair sum, removing duplicates

2. **Same Direction (Sliding Window)**:
   - Both pointers start at beginning
   - One moves faster (lead pointer)
   - Common for: subarray problems

### Key Insights:
- Works best on sorted arrays
- Eliminates need for nested loops
- Reduces space complexity often to O(1)

---

## Algorithm Steps

### For Two Sum (Sorted Array):
1. Initialize left pointer at start, right pointer at end
2. Calculate current sum = arr[left] + arr[right]
3. If sum equals target: found the pair
4. If sum < target: need larger sum, move left pointer right
5. If sum > target: need smaller sum, move right pointer left
6. Continue until pointers meet

### For Removing Duplicates:
1. Use slow pointer to track position of last unique element
2. Fast pointer iterates through array
3. When fast pointer finds different element, copy to slow+1

---

## Implementation

```python
def two_sum(nums: list, target: int) -> list:
    """
    Find two numbers in sorted array that add up to target.
    Returns indices of the two numbers (1-indexed).
    
    Args:
        nums: Sorted array of integers
        target: Target sum
        
    Returns:
        List with indices of the two numbers (1-indexed)
        
    Time: O(n)
    Space: O(1)
    """
    left = 0
    right = len(nums) - 1
    
    while left < right:
        current_sum = nums[left] + nums[right]
        
        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1  # Need larger sum
        else:
            right -= 1  # Need smaller sum
    
    return []  # No solution found


def two_sum_all_pairs(nums: list, target: int) -> list:
    """
    Find all unique pairs that sum to target.
    
    Time: O(n)
    Space: O(1) excluding output
    """
    left = 0
    right = len(nums) - 1
    result = []
    
    while left < right:
        current_sum = nums[left] + nums[right]
        
        if current_sum == target:
            result.append([nums[left], nums[right]])
            left += 1
            right -= 1
            # Skip duplicates
            while left < right and nums[left] == nums[left - 1]:
                left += 1
            while left < right and nums[right] == nums[right + 1]:
                right -= 1
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return result


def remove_duplicates(nums: list) -> int:
    """
    Remove duplicates in-place from sorted array.
    Returns the length of array with unique elements.
    
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0
    
    slow = 0  # Position of last unique element
    
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    
    return slow + 1


def container_with_most_water(heights: list) -> int:
    """
    Find container that holds most water.
    
    Time: O(n)
    Space: O(1)
    """
    left = 0
    right = len(heights) - 1
    max_area = 0
    
    while left < right:
        # Calculate area
        width = right - left
        height = min(heights[left], heights[right])
        area = width * height
        max_area = max(max_area, area)
        
        # Move the shorter line
        if heights[left] < heights[right]:
            left += 1
        else:
            right -= 1
    
    return max_area


# Example usage
if __name__ == "__main__":
    # Two Sum
    nums = [2, 7, 11, 15]
    target = 9
    print(f"Two Sum: {two_sum(nums, target)}")  # [1, 2]
    
    # All pairs
    nums2 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    print(f"All pairs with sum 10: {two_sum_all_pairs(nums2, 10)}")
    
    # Remove duplicates
    nums3 = [1, 1, 2, 2, 2, 3, 4, 4, 5]
    length = remove_duplicates(nums3)
    print(f"Unique elements: {nums3[:length]}")
    
    # Container with most water
    heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]
    print(f"Max water container: {container_with_most_water(heights)}")

```javascript
function twoPointers() {
    // Two Pointers implementation
    // Time: O(n)
    // Space: O(1)
}
```

---

## Example

**Input:**
```python
nums = [2, 7, 11, 15]
target = 9
```

**Output:**
```
Two Sum: [1, 2]
```

**Step-by-step:**
| Step | Left (idx, val) | Right (idx, val) | Sum | Action |
|------|-----------------|------------------|-----|--------|
| 1 | (0, 2) | (3, 15) | 17 | Sum > target, move right |
| 2 | (0, 2) | (2, 11) | 13 | Sum > target, move right |
| 3 | (0, 2) | (1, 7) | 9 | Sum == target, return [1,2] |

**All pairs example:**
```python
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]
# Pairs that sum to 10:
print(two_sum_all_pairs(nums, 10))
# Output: [[1, 9], [2, 8], [3, 7], [4, 6]]
```

**Container with Most Water:**
```python
heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]
# Max area = min(8,7) * 7 = 49
print(container_with_most_water(heights))
# Output: 49
```

**Visualization:**
```
        |               |  
        |       |       |  |
        |   |   |   |   |||
    |   ||  |   || ||||  |
    |   ||  |   || ||||  |
    ----------------------------
    1   8   6   2   4   8   7
    L                           R
    Width = 6, Height = min(8,7) = 7
    Area = 42
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
