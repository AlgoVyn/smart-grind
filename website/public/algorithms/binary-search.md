# Binary Search

## Category
Arrays & Strings

## Description
Search in sorted arrays by repeatedly dividing the search interval in half.

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
Binary Search is a divide-and-conquer algorithm that efficiently searches for a target value within a **sorted array** by repeatedly dividing the search interval in half.

**Key Concept:** At each step, compare the middle element of the current search range with the target value:
- If they are equal, the search is successful
- If the target is smaller, search the left half
- If the target is larger, search the right half

**Why it works:** Because the array is sorted, we can eliminate half of the remaining elements with each comparison. This leads to O(log n) time complexity.

**Iterative Approach:**
1. Set `left = 0` and `right = len(arr) - 1`
2. While `left <= right`:
   - Calculate `mid = left + (right - left) // 2` (avoids overflow)
   - If `arr[mid] == target`, return `mid`
   - If `arr[mid] < target`, set `left = mid + 1`
   - Otherwise, set `right = mid - 1`
3. Return -1 if target not found

**Recursive Approach:**
- Base case: if `left > right`, return -1
- Recursively search left or right half based on comparison

---

## Implementation

```python
def binary_search_iterative(arr, target):
    """
    Binary Search - Iterative implementation
    Time: O(log n)
    Space: O(1)
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2  # Prevents integer overflow
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Target not found


def binary_search_recursive(arr, target, left=None, right=None):
    """
    Binary Search - Recursive implementation
    Time: O(log n)
    Space: O(log n) for recursion stack
    """
    if left is None:
        left = 0
    if right is None:
        right = len(arr) - 1
    
    if left > right:
        return -1  # Base case: target not found
    
    mid = left + (right - left) // 2
    
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)


# Example usage
if __name__ == "__main__":
    arr = [1, 3, 5, 7, 9, 11, 13, 15]
    target = 7
    result = binary_search_iterative(arr, target)
    print(f"Iterative: Index of {target} is {result}")  # Output: 3
    
    result = binary_search_recursive(arr, target)
    print(f"Recursive: Index of {target} is {result}")  # Output: 3
    
    # Test with target not in array
    result = binary_search_iterative(arr, 6)
    print(f"Not found: {result}")  # Output: -1
```

```javascript
function binarySearch() {
    // Binary Search implementation
    // Time: O(log n)
    // Space: O(1)
}
```

---

## Example

**Input:**
```
arr = [1, 3, 5, 7, 9, 11, 13, 15]
target = 7
```

**Output:**
```
Iterative: Index of 7 is 3
Recursive: Index of 7 is 3
Not found: -1
```

---

## Time Complexity
**O(log n)**

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
