# Cyclic Sort

## Category
Arrays & Strings

## Description
Sort numbers in a given range by placing each element at its correct index.

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
Cyclic Sort is an **in-place sorting algorithm** that works optimally for arrays containing numbers in a **specific range** (typically 1 to n or 0 to n-1). It places each element at its correct index by cycling through the array.

**Key Concept:** Each element value tells us where it should be placed.

**Why it works:**
- If we have n unique values in range [1, n], element `i` should be at index `i-1`
- We can swap elements into their correct positions
- After placing an element correctly, we move to the next position

**Algorithm:**
1. Start at index 0
2. Calculate the correct index: `correct_idx = arr[i] - 1`
3. If `arr[i] != arr[correct_idx]`, swap them
4. If already in correct place, move to next index
5. Continue until we've processed all elements

**Properties:**
- Time: O(n) - each element is moved at most once
- Space: O(1) - in-place sorting
- Works only when values are within [1, n] range

---

## Implementation

```python
def cyclic_sort(nums):
    """
    Cyclic Sort - sort array with values in range [1, n]
    Time: O(n)
    Space: O(1)
    
    Args:
        nums: List of integers with values in range [1, len(nums)]
    
    Returns:
        Sorted array (modified in place)
    """
    i = 0
    while i < len(nums):
        # Calculate correct index (value - 1 because 0-indexed)
        correct_idx = nums[i] - 1
        
        # Swap if element is not at correct position
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    return nums


# Example usage
if __name__ == "__main__":
    # Test case 1
    nums = [3, 1, 5, 4, 2]
    result = cyclic_sort(nums.copy())
    print(f"Input: [3, 1, 5, 4, 2]")
    print(f"Output: {result}")  # [1, 2, 3, 4, 5]
    
    # Test case 2
    nums = [2, 6, 4, 3, 1, 5]
    result = cyclic_sort(nums.copy())
    print(f"\nInput: [2, 6, 4, 3, 1, 5]")
    print(f"Output: {result}")  # [1, 2, 3, 4, 5, 6]
```

```javascript
function cyclicSort() {
    // Cyclic Sort implementation
    // Time: O(n)
    // Space: O(1)
}
```

---

## Example

**Input:**
```
[3, 1, 5, 4, 2]
```

**Output:**
```
Input: [3, 1, 5, 4, 2]
Output: [1, 2, 3, 4, 5]

Input: [2, 6, 4, 3, 1, 5]
Output: [1, 2, 3, 4, 5, 6]
```

**Explanation:**
- 3 should be at index 2 → swap with 5 → [5, 1, 3, 4, 2]
- 5 should be at index 4 → swap with 2 → [2, 1, 3, 4, 5]
- 2 should be at index 1 → swap with 1 → [1, 2, 3, 4, 5]
- Remaining elements already in correct positions

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
