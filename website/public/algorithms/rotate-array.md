# Rotate Array In-Place

## Category
Arrays & Strings

## Description
Rotate array elements without using extra space using reversal technique.

## Algorithm Explanation
The Rotate Array problem requires rotating an array to the right by k positions. The reversal method is an elegant O(n) time, O(1) space solution that works by reversing parts of the array.

**The Reversal Algorithm:**
1. **Handle edge case**: If k is greater than array length, use k = k % n
2. **Reverse the entire array**: This puts elements in reverse order
3. **Reverse first k elements**: This correctly positions the first k elements (which were at the end)
4. **Reverse remaining n-k elements**: This positions the rest of the array correctly

**Why this works:**
- After full reversal: [n-k, n-k+1, ..., n-1, 0, 1, ..., n-k-1]
- After reversing first k: [0, 1, ..., n-k-1, n-k, n-k+1, ..., n-1]

**Example with array = [1,2,3,4,5,6,7], k = 3:**
- Original: [1, 2, 3, 4, 5, 6, 7]
- Reverse all: [7, 6, 5, 4, 3, 2, 1]
- Reverse first 3: [5, 6, 7, 4, 3, 2, 1]
- Reverse last 4: [5, 6, 7, 1, 2, 3, 4] ✓

**Edge cases:**
- k = 0: no rotation needed
- k % n = 0: full rotation returns original array
- Empty array or single element

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

## Implementation

```python
def rotate(nums, k):
    """
    Rotate array to the right by k positions using reversal.
    
    Args:
        nums: List of integers to rotate
        k: Number of positions to rotate right
    
    Modifies nums in-place.
    
    Time: O(n)
    Space: O(1)
    """
    n = len(nums)
    if n == 0:
        return
    
    k = k % n  # Handle k > n
    if k == 0:
        return
    
    def reverse(start, end):
        """Reverse elements in nums from start to end (inclusive)."""
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
    
    # Step 1: Reverse the entire array
    reverse(0, n - 1)
    
    # Step 2: Reverse first k elements
    reverse(0, k - 1)
    
    # Step 3: Reverse remaining n-k elements
    reverse(k, n - 1)

# Alternative: Cyclic replacements approach
def rotate_cyclic(nums, k):
    """Rotate using cyclic replacements."""
    n = len(nums)
    if n == 0:
        return
    
    k = k % n
    if k == 0:
        return
    
    count = 0
    start = 0
    
    while count < n:
        current = start
        prev = nums[start]
        
        while True:
            next_idx = (current + k) % n
            temp = nums[next_idx]
            nums[next_idx] = prev
            prev = temp
            current = next_idx
            count += 1
            
            if current == start:
                break
        
        start += 1
```

```javascript
function rotate(nums, k) {
    const n = nums.length;
    if (n === 0) return;
    
    k = k % n;
    if (k === 0) return;
    
    function reverse(start, end) {
        while (start < end) {
            [nums[start], nums[end]] = [nums[end], nums[start]];
            start++;
            end--;
        }
    }
    
    reverse(0, n - 1);
    reverse(0, k - 1);
    reverse(k, n - 1);
}
```

---

## Example

**Input:**
```
nums = [1, 2, 3, 4, 5, 6, 7]
k = 3
```

**Output:**
```
nums = [5, 6, 7, 1, 2, 3, 4]
```

**Explanation:**
- Reverse entire array: [7, 6, 5, 4, 3, 2, 1]
- Reverse first 3: [5, 6, 7, 4, 3, 2, 1]
- Reverse last 4: [5, 6, 7, 1, 2, 3, 4]

**Input:**
```
nums = [-1, -100, 3, 99]
k = 2
```

**Output:**
```
nums = [3, 99, -1, -100]
```

**Explanation:**
- Reverse: [99, 3, -100, -1]
- Reverse first 2: [3, 99, -100, -1]
- Reverse last 2: [3, 99, -1, -100]

**Input:**
```
nums = [1, 2]
k = 3
```

**Output:**
```
nums = [2, 1]
```

**Explanation:** k = 3 % 2 = 1, so rotate by 1 position.

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
