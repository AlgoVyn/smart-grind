# Dutch National Flag

## Category
Arrays & Strings

## Description
Sort an array containing only three distinct elements (0s, 1s, and 2s) in a single pass.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- arrays & strings related operations
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

## How It Works
The Dutch National Flag algorithm (3-way partition) sorts an array containing only three distinct values (0, 1, 2) in a **single pass**. This algorithm was proposed by Edsger Dijkstra.

**Key Concept:** Use three pointers to partition the array into four sections:
- [0, low-1]: all zeros
- [low, mid-1]: all ones
- [mid, high]: unknown/unprocessed
- [high+1, n-1]: all twos

**Why it works:**
- Each element is processed at most once
- Elements equal to mid are skipped (already in correct partition)
- Elements less than mid go to left section
- Elements greater than mid go to right section

**Algorithm:**
1. Initialize: low = 0, mid = 0, high = n - 1
2. While mid <= high:
   - If nums[mid] == 0: swap nums[low], nums[mid]; low++; mid++
   - If nums[mid] == 1: mid++
   - If nums[mid] == 2: swap nums[mid], nums[high]; high--

---

## Implementation

```python
def sort_colors(nums):
    """
    Dutch National Flag - 3-way partition
    Time: O(n)
    Space: O(1)
    
    Sorts array with only 0s, 1s, and 2s in one pass.
    
    Args:
        nums: List containing only 0, 1, 2
    
    Returns:
        Sorted array (modified in place)
    """
    low, mid = 0, 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            # Move 0 to the left section
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            # 1 is in correct position, move forward
            mid += 1
        else:  # nums[mid] == 2
            # Move 2 to the right section
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            # Don't increment mid here, need to check swapped element
    
    return nums


# Example usage
if __name__ == "__main__":
    # Test case 1
    nums = [2, 0, 2, 1, 1, 0]
    result = sort_colors(nums.copy())
    print(f"Input: [2, 0, 2, 1, 1, 0]")
    print(f"Output: {result}")  # [0, 0, 1, 1, 2, 2]
    
    # Test case 2
    nums = [2, 1, 2, 1, 0, 2, 1]
    result = sort_colors(nums.copy())
    print(f"\nInput: [2, 1, 2, 1, 0, 2, 1]")
    print(f"Output: {result}")  # [0, 1, 1, 1, 2, 2, 2]
```

```javascript
function dutchNationalFlag() {
    // Dutch National Flag implementation
    // Time: O(n)
    // Space: O(1)
}
```

---

## Example

**Input:**
```
[2, 0, 2, 1, 1, 0]
```

**Output:**
```
Input: [2, 0, 2, 1, 1, 0]
Output: [0, 0, 1, 1, 2, 2]

Input: [2, 1, 2, 1, 0, 2, 1]
Output: [0, 1, 1, 1, 2, 2, 2]
```

**Explanation:**
Using three pointers (low, mid, high):
- [0, low): all 0s
- [low, mid): all 1s  
- [mid, high]: unprocessed
- (high, n]: all 2s

Processing 2 at mid→swaps with high, doesn't increment mid.
Processing 0 at mid→swaps with low, both increment.

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
