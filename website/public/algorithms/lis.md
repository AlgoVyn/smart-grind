# Longest Increasing Subsequence

## Category
Dynamic Programming

## Description
The Longest Increasing Subsequence (LIS) problem finds the length of the longest subsequence where all elements are in strictly increasing order. The key insight is using binary search to achieve O(n log n) time complexity.

The algorithm maintains a sorted list (using binary search) of the smallest possible tail values for increasing subsequences of different lengths:
- For each element, find its position in the tails array using binary search
- If it's larger than all elements, append it (we found a longer LIS)
- Otherwise, replace the first element that's >= it (improving the smallest tail for that length)

This works because:
- The tails array always stays sorted
- Each position in tails represents the smallest tail for an increasing subsequence of that length
- Binary search gives O(log n) for each element lookup

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
import bisect

def length_of_lis(nums: list[int]) -> int:
    """
    Find the length of the longest increasing subsequence.
    Uses binary search optimization for O(n log n) time.
    
    Args:
        nums: List of integers
        
    Returns:
        Length of the longest increasing subsequence
        
    Time: O(n log n)
    Space: O(n)
    """
    if not nums:
        return 0
    
    # tails[i] = smallest tail for increasing subsequence of length i+1
    tails = []
    
    for num in nums:
        # Find position to insert/replace using binary search
        pos = bisect.bisect_left(tails, num)
        
        if pos == len(tails):
            # num is larger than all elements, extend the sequence
            tails.append(num)
        else:
            # Replace to maintain smallest possible tail
            tails[pos] = num
    
    return len(tails)


def lis_with_binary_search(nums: list[int]) -> tuple:
    """
    Find LIS length and one actual LIS sequence.
    
    Args:
        nums: List of integers
        
    Returns:
        Tuple of (length, lis_sequence)
        
    Time: O(n log n)
    Space: O(n)
    """
    if not nums:
        return 0, []
    
    # For tracking the actual sequence
    # tails[i] = smallest tail for LIS of length i+1
    # but also stores the actual sequence
    tails = []
    # Track the predecessor index for reconstruction
    prev = [-1] * len(nums)
    # Track which position each element occupies in tails
    indices = []
    
    for i, num in enumerate(nums):
        pos = bisect.bisect_left(tails, num)
        
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
        
        indices.append(pos)
        
        if pos > 0:
            # Find the previous element
            for j in range(i - 1, -1, -1):
                if indices[j] == pos - 1 and nums[j] < num:
                    prev[i] = j
                    break
    
    # Reconstruct the LIS
    lis_length = len(tails)
    lis = []
    # Find the last element
    for i in range(len(nums) - 1, -1, -1):
        if indices[i] == lis_length - 1:
            curr = i
            break
    
    while curr != -1:
        lis.append(nums[curr])
        curr = prev[curr]
    
    return lis_length, list(reversed(lis))


# Example usage
if __name__ == "__main__":
    # Test case 1
    nums = [10, 9, 2, 5, 3, 7, 101, 18]
    length = length_of_lis(nums)
    print(f"Array: {nums}")
    print(f"LIS Length: {length}")  # Output: 4
    # Possible LIS: [2, 3, 7, 101] or [2, 5, 7, 101] or [2, 3, 7, 18]
    
    # Test case 2
    nums = [0, 1, 0, 3, 2, 3]
    length = length_of_lis(nums)
    print(f"\nArray: {nums}")
    print(f"LIS Length: {length}")  # Output: 4
    # LIS: [0, 1, 2, 3]
    
    # Test case 3
    nums = [7, 7, 7, 7, 7, 7, 7]
    length = length_of_lis(nums)
    print(f"\nArray: {nums}")
    print(f"LIS Length: {length}")  # Output: 1 (strictly increasing)
    
    # Test case 4 - Get actual sequence
    nums = [10, 9, 2, 5, 3, 7, 101, 18]
    length, sequence = lis_with_binary_search(nums)
    print(f"\nArray: {nums}")
    print(f"LIS Length: {length}, LIS: {sequence}")
```

```javascript
function lis() {
    // Longest Increasing Subsequence implementation
    // Time: O(n log n)
    // Space: O(n)
}
```

---

## Example

**Input:**
```
nums = [10, 9, 2, 5, 3, 7, 101, 18]
```

**Output:**
```
LIS Length: 4
One possible LIS: [2, 3, 7, 18]
```

**Input:**
```
nums = [0, 1, 0, 3, 2, 3]
```

**Output:**
```
LIS Length: 4
LIS: [0, 1, 2, 3]
```

---

## Time Complexity
**O(n log n)**

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
