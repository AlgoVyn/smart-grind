# Two Pointers - In-place Array Modification

## Overview

The **Two Pointers - In-place Array Modification** pattern is a powerful technique used for solving problems that require modifying arrays without using extra space. This pattern employs two pointers moving through the array at different speeds or directions to efficiently rearrange, remove, or reorganize elements directly in the original array.

This pattern is particularly valuable when:
- You need to remove specific elements from an array
- You must partition an array based on certain conditions
- You want to rearrange elements in-place without additional data structures
- Space complexity must be O(1) as per problem constraints

## Core Concept

The fundamental idea behind this pattern is the use of two pointers:
- **Read Pointer (or Fast Pointer)**: Traverses the array, reading each element
- **Write Pointer (or Slow Pointer)**: Tracks the position where the next valid element should be placed

By maintaining these two pointers, we can process elements in a single pass while building the desired result directly in the original array.

## When to Use This Pattern

Use the Two Pointers - In-place Array Modification pattern when:
- Problem requires O(1) extra space
- Array needs to be modified without creating a new array
- Elements need to be removed based on a condition
- Elements need to be rearranged while preserving order
- You're working with sorted arrays where duplicates are adjacent
- The problem specifies returning the new length after modification

## Intuition

The key insight driving this pattern is simple yet powerful:

1. **Single Pass Efficiency**: Instead of making multiple passes through the array or using auxiliary data structures, we can accomplish the task in one pass.

2. **Overwrite vs. Swap**: We overwrite positions in the array with valid elements, effectively "removing" unwanted elements by shifting valid ones forward.

3. **Condition-Based Placement**: The write pointer only advances when the current element meets the criteria, ensuring only valid elements are retained.

4. **Order Preservation**: By scanning left-to-right and placing elements in order, we maintain the relative order of valid elements (unless swapping is involved).

---

## Approach 1: Fast and Slow Pointers (Standard)

The most common and intuitive approach uses two pointers moving in the same direction. The fast pointer scans all elements while the slow pointer tracks where to write valid elements.

### Algorithm Steps

1. Initialize the write pointer to 0 (or 1, depending on edge cases)
2. Iterate through the array with the read pointer
3. For each element, check if it meets the inclusion criteria
4. If valid, place it at the write pointer position and increment the write pointer
5. Continue until the end of the array
6. Return the write pointer value (new length)

### Code Implementation

````carousel
```python
def two_pointers_inplace(nums, condition):
    """
    Two Pointers - In-place Array Modification template.
    
    Args:
        nums: List of elements to modify in-place
        condition: Function that returns True if element should be kept
        
    Returns:
        The new length of the modified array
    """
    write = 0  # Write pointer for valid elements
    
    for read in range(len(nums)):  # Read pointer scans array
        if condition(nums[read]):
            nums[write] = nums[read]  # Place valid element
            write += 1  # Move write pointer
    
    return write  # New length of array
```

<!-- slide -->
```cpp
/**
 * Two Pointers - In-place Array Modification template.
 * 
 * @param nums Vector of elements to modify in-place
 * @param condition Function that returns true if element should be kept
 * @return The new length of the modified array
 */
template<typename Func>
int two_pointers_inplace(vector<int>& nums, Func condition) {
    int write = 0;  // Write pointer for valid elements
    
    for (int read = 0; read < nums.size(); read++) {  // Read pointer scans array
        if (condition(nums[read])) {
            nums[write] = nums[read];  // Place valid element
            write++;  // Move write pointer
        }
    }
    
    return write;  // New length of array
}
```

<!-- slide -->
```java
/**
 * Two Pointers - In-place Array Modification template.
 * 
 * @param nums Array of elements to modify in-place
 * @param condition Function that returns true if element should be kept
 * @return The new length of the modified array
 */
public static int twoPointersInplace(int[] nums, IntPredicate condition) {
    int write = 0;  // Write pointer for valid elements
    
    for (int read = 0; read < nums.length; read++) {  // Read pointer scans array
        if (condition.test(nums[read])) {
            nums[write] = nums[read];  // Place valid element
            write++;  // Move write pointer
        }
    }
    
    return write;  // New length of array
}
```

<!-- slide -->
```javascript
/**
 * Two Pointers - In-place Array Modification template.
 * 
 * @param {number[]} nums - Array of elements to modify in-place
 * @param {Function} condition - Function that returns true if element should be kept
 * @return {number} - The new length of the modified array
 */
function twoPointersInplace(nums, condition) {
    let write = 0;  // Write pointer for valid elements
    
    for (let read = 0; read < nums.length; read++) {  // Read pointer scans array
        if (condition(nums[read])) {
            nums[write] = nums[read];  // Place valid element
            write++;  // Move write pointer
        }
    }
    
    return write;  // New length of array
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the array |
| **Space** | O(1) - Only two integer pointers used |

---

## Approach 2: Two Pointers with Swap (Partitioning)

This approach is useful when order preservation is not required, or when we want to group elements (like in the Dutch National Flag problem). Instead of overwriting, we swap elements to their correct positions.

### Algorithm Steps

1. Initialize left pointer at 0 and right pointer at n-1
2. While left <= right:
   - If left element meets criteria, increment left
   - If right element doesn't meet criteria, decrement right
   - If left element doesn't meet criteria and right does, swap them
3. Return the partition point or modified array

### Code Implementation

````carousel
```python
def two_pointers_swap(nums, condition):
    """
    Two Pointers with swapping for partitioning.
    Useful when order doesn't need to be preserved.
    
    Args:
        nums: List of elements to modify in-place
        condition: Function that returns True if element should be in left partition
        
    Returns:
        The partition point (index after last valid element)
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        # Skip valid elements on the left
        while left <= right and condition(nums[left]):
            left += 1
        
        # Skip invalid elements on the right
        while left <= right and not condition(nums[right]):
            right -= 1
        
        # Swap if pointers haven't crossed
        if left < right:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1
    
    return left  # Partition point
```

<!-- slide -->
```cpp
/**
 * Two Pointers with swapping for partitioning.
 * Useful when order doesn't need to be preserved.
 * 
 * @param nums Vector of elements to modify in-place
 * @param condition Function that returns true if element should be in left partition
 * @return The partition point (index after last valid element)
 */
template<typename Func>
int twoPointersSwap(vector<int>& nums, Func condition) {
    int left = 0;
    int right = nums.size() - 1;
    
    while (left <= right) {
        // Skip valid elements on the left
        while (left <= right && condition(nums[left])) {
            left++;
        }
        
        // Skip invalid elements on the right
        while (left <= right && !condition(nums[right])) {
            right--;
        }
        
        // Swap if pointers haven't crossed
        if (left < right) {
            swap(nums[left], nums[right]);
            left++;
            right--;
        }
    }
    
    return left;  // Partition point
}
```

<!-- slide -->
```java
/**
 * Two Pointers with swapping for partitioning.
 * Useful when order doesn't need to be preserved.
 * 
 * @param nums Array of elements to modify in-place
 * @param condition Function that returns true if element should be in left partition
 * @return The partition point (index after last valid element)
 */
public static int twoPointersSwap(int[] nums, IntPredicate condition) {
    int left = 0;
    int right = nums.length - 1;
    
    while (left <= right) {
        // Skip valid elements on the left
        while (left <= right && condition.test(nums[left])) {
            left++;
        }
        
        // Skip invalid elements on the right
        while (left <= right && !condition.test(nums[right])) {
            right--;
        }
        
        // Swap if pointers haven't crossed
        if (left < right) {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            left++;
            right--;
        }
    }
    
    return left;  // Partition point
}
```

<!-- slide -->
```javascript
/**
 * Two Pointers with swapping for partitioning.
 * Useful when order doesn't need to be preserved.
 * 
 * @param {number[]} nums - Array of elements to modify in-place
 * @param {Function} condition - Function that returns true if element should be in left partition
 * @return {number} - The partition point (index after last valid element)
 */
function twoPointersSwap(nums, condition) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        // Skip valid elements on the left
        while (left <= right && condition(nums[left])) {
            left++;
        }
        
        // Skip invalid elements on the right
        while (left <= right && !condition(nums[right])) {
            right--;
        }
        
        // Swap if pointers haven't crossed
        if (left < right) {
            [nums[left], nums[right]] = [nums[right], nums[left]];
            left++;
            right--;
        }
    }
    
    return left;  // Partition point
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is visited at most once |
| **Space** | O(1) - Only two pointers used |

---

## Approach 3: Three Pointers (Dutch National Flag)

For problems requiring three-way partitioning (like sorting colors with three distinct values), three pointers provide an elegant solution.

### Algorithm Steps

1. Initialize three pointers: low (0), mid (0), high (n-1)
2. While mid <= high:
   - If nums[mid] is 0, swap with low and increment both
   - If nums[mid] is 1, just increment mid
   - If nums[mid] is 2, swap with high and decrement high
3. Continue until mid crosses high

### Code Implementation

````carousel
```python
def dutch_national_flag(nums):
    """
    Three pointers for Dutch National Flag problem.
    Partitions array into three groups: 0s, 1s, and 2s.
    
    Args:
        nums: List of 0s, 1s, and 2s to sort in-place
        
    Returns:
        The modified array (sorted in-place)
    """
    low, mid = 0, 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
    
    return nums
```

<!-- slide -->
```cpp
/**
 * Three pointers for Dutch National Flag problem.
 * Partitions array into three groups: 0s, 1s, and 2s.
 * 
 * @param nums Vector of 0s, 1s, and 2s to sort in-place
 * @return The modified array (sorted in-place)
 */
vector<int>& dutchNationalFlag(vector<int>& nums) {
    int low = 0, mid = 0;
    int high = nums.size() - 1;
    
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low], nums[mid]);
            low++;
            mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {  // nums[mid] == 2
            swap(nums[mid], nums[high]);
            high--;
        }
    }
    
    return nums;
}
```

<!-- slide -->
```java
/**
 * Three pointers for Dutch National Flag problem.
 * Partitions array into three groups: 0s, 1s, and 2s.
 * 
 * @param nums Array of 0s, 1s, and 2s to sort in-place
 * @return The modified array (sorted in-place)
 */
public static int[] dutchNationalFlag(int[] nums) {
    int low = 0, mid = 0;
    int high = nums.length - 1;
    
    while (mid <= high) {
        if (nums[mid] == 0) {
            int temp = nums[low];
            nums[low] = nums[mid];
            nums[mid] = temp;
            low++;
            mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {  // nums[mid] == 2
            int temp = nums[mid];
            nums[mid] = nums[high];
            nums[high] = temp;
            high--;
        }
    }
    
    return nums;
}
```

<!-- slide -->
```javascript
/**
 * Three pointers for Dutch National Flag problem.
 * Partitions array into three groups: 0s, 1s, and 2s.
 * 
 * @param {number[]} nums - Array of 0s, 1s, and 2s to sort in-place
 * @return {number[]} - The modified array (sorted in-place)
 */
function dutchNationalFlag(nums) {
    let low = 0, mid = 0;
    let high = nums.length - 1;
    
    while (mid <= high) {
        if (nums[mid] === 0) {
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++;
            mid++;
        } else if (nums[mid] === 1) {
            mid++;
        } else {  // nums[mid] === 2
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
        }
    }
    
    return nums;
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the array |
| **Space** | O(1) - Only three pointers used |

---

## Approach 4: Replace and Count (Remove Element Variants)

When you need to replace elements with a sentinel value or track replacements while removing.

### Algorithm Steps

1. Initialize replacement count to 0
2. Iterate through the array
3. For each element, if it matches the target, increment count (or mark it)
4. For each element, if it's valid, place it in the correct position considering replacements
5. Return the new length

### Code Implementation

````carousel
```python
def remove_element_replace(nums, val):
    """
    Remove element by replacing with last element (O(1) writes but doesn't preserve order).
    
    Args:
        nums: List of elements
        val: Value to remove
        
    Returns:
        The new length of the array
    """
    n = len(nums)
    if n == 0:
        return 0
    
    write = 0  # Pointer for writing valid elements
    
    while write < n:
        if nums[write] == val:
            # Replace with last element
            nums[write] = nums[n - 1]
            n -= 1  # Reduce effective length
        else:
            write += 1
    
    return n
```

<!-- slide -->
```cpp
/**
 * Remove element by replacing with last element (O(1) writes but doesn't preserve order).
 * 
 * @param nums Vector of elements
 * @param val Value to remove
 * @return The new length of the array
 */
int removeElementReplace(vector<int>& nums, int val) {
    int n = nums.size();
    if (n == 0) return 0;
    
    int write = 0;  // Pointer for writing valid elements
    
    while (write < n) {
        if (nums[write] == val) {
            // Replace with last element
            nums[write] = nums[n - 1];
            n--;  // Reduce effective length
        } else {
            write++;
        }
    }
    
    return n;
}
```

<!-- slide -->
```java
/**
 * Remove element by replacing with last element (O(1) writes but doesn't preserve order).
 * 
 * @param nums Array of elements
 * @param val Value to remove
 * @return The new length of the array
 */
public int removeElementReplace(int[] nums, int val) {
    int n = nums.length;
    if (n == 0) return 0;
    
    int write = 0;  // Pointer for writing valid elements
    
    while (write < n) {
        if (nums[write] == val) {
            // Replace with last element
            nums[write] = nums[n - 1];
            n--;  // Reduce effective length
        } else {
            write++;
        }
    }
    
    return n;
}
```

<!-- slide -->
```javascript
/**
 * Remove element by replacing with last element (O(1) writes but doesn't preserve order).
 * 
 * @param {number[]} nums - Array of elements
 * @param {number} val - Value to remove
 * @return {number} - The new length of the array
 */
function removeElementReplace(nums, val) {
    let n = nums.length;
    if (n === 0) return 0;
    
    let write = 0;  // Pointer for writing valid elements
    
    while (write < n) {
        if (nums[write] === val) {
            // Replace with last element
            nums[write] = nums[n - 1];
            n--;  // Reduce effective length
        } else {
            write++;
        }
    }
    
    return n;
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is visited at most once |
| **Space** | O(1) - Only constant extra space used |

---

## Comparison of Approaches

| Approach | Time | Space | Preserves Order | Use Case |
|----------|------|-------|-----------------|----------|
| **Fast/Slow Pointers** | O(n) | O(1) | ✅ Yes | Removing elements with order preservation |
| **Two Pointers with Swap** | O(n) | O(1) | ❌ No | Partitioning when order doesn't matter |
| **Three Pointers (Dutch)** | O(n) | O(1) | ❌ No | Three-way partitioning (colors) |
| **Replace with Last** | O(n) | O(1) | ❌ No | When order doesn't matter, minimize writes |

---

## Related Problems

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Remove Element | [Link](https://leetcode.com/problems/remove-element/) | Remove all instances of a value in-place |
| Move Zeroes | [Link](https://leetcode.com/problems/move-zeroes/) | Move all zeros to the end |
| Remove Duplicates from Sorted Array | [Link](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) | Remove duplicates keeping one occurrence |
| Check if One String Swap Can Make Strings Equal | [Link](https://leetcode.com/problems/check-if-one-string-swap-can-make-strings-equal/) | In-place character swap analysis |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Remove Duplicates from Sorted Array II | [Link](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/) | Allow up to 2 duplicates |
| Sort Colors (Dutch National Flag) | [Link](https://leetcode.com/problems/sort-colors/) | Sort 0s, 1s, and 2s |
| Merge Sorted Array | [Link](https://leetcode.com/problems/merge-sorted-array/) | Merge two sorted arrays in-place |
| Longest Repeating Character Replacement | [Link](https://leetcode.com/problems/longest-repeating-character-replacement/) | Sliding window with in-place updates |
| Set Matrix Zeroes | [Link](https://leetcode.com/problems/set-matrix-zeroes/) | Mark zeros using O(1) space |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| First Missing Positive | [Link](https://leetcode.com/problems/first-missing-positive/) | O(n) in-place with constant space |
| Find the Duplicate Number | [Link](https://leetcode.com/problems/find-the-duplicate-number/) | Find duplicate without modifying |
| Wiggle Sort II | [Link](https://leetcode.com/problems/wiggle-sort-ii/) | In-place wiggle sort |

---

## Video Tutorial Links

### Two Pointers Pattern

- [Two Pointers Technique - GeeksforGeeks](https://www.youtube.com/watch?v=4QlTnbI7V_c) - Comprehensive explanation
- [Remove Duplicates from Sorted Array - NeetCode](https://www.youtube.com/watch?v=DEJJeMBuP68) - Clear walkthrough
- [Move Zeroes - Two Pointers Approach](https://www.youtube.com/watch?v=SaPk6muXHGk) - Step-by-step solution
- [Sort Colors (Dutch National Flag)](https://www.youtube.com/watch?v=uvBexoU2N-s) - Three-way partitioning explained

### In-place Array Modifications

- [In-Place Algorithms - Overview](https://www.youtube.com/watch?v=Q6nY5d4c5Hs) - Deep dive into in-place operations
- [Remove Element - Multiple Approaches](https://www.youtube.com/watch?v=3BdnCFcNpjI) - Comparing different strategies
- [Merge Sorted Array - In-Place](https://www.youtube.com/watch?v=0Bgo3tX8pT8) - Backward two-pointer technique

---

## Common Pitfalls

### 1. Pointer Confusion
**Issue**: Mixing up read and write pointers or letting them interfere with each other.

**Solution**: Clearly label and separate pointer responsibilities. The read pointer always scans forward, while the write pointer tracks the position for valid elements.

### 2. Off-by-One Errors
**Issue**: Incorrect initialization of pointers (0 vs 1) causing boundary issues.

**Solution**: Start write pointer at 0 for empty array case handling. When array has at least one element, decide whether to start write at 0 or 1 based on algorithm.

### 3. Order Preservation
**Issue**: Breaking relative order of elements when it should be maintained.

**Solution**: Use the overwrite approach instead of swapping when order matters. Only swap when order is explicitly not required.

### 4. Return Value Confusion
**Issue**: Returning the modified array instead of the new length.

**Solution**: Remember that most in-place problems return the new length k, not the modified array. The caller uses only the first k elements.

### 5. Edge Cases
**Issue**: Not handling empty arrays, single-element arrays, or all-matching elements.

**Solution**: Add explicit edge case checks at the beginning of the algorithm.

---

## Pattern Variations

### Variation 1: k-Duplicates Allowed
When duplicates are allowed up to k times, modify the condition to check against `nums[write - k + 1]`.

### Variation 2: Multiple Conditions
For multiple conditions, use additional pointers (like in Dutch National Flag) or nested checks.

### Variation 3: Circular Arrays
For circular arrays, use modulo arithmetic with pointers or rotate the array first.

### Variation 4: Stability Requirements
When stability is required with swapping, use temporary storage instead of direct swaps.

---

## Summary

The **Two Pointers - In-place Array Modification** pattern is essential for solving array problems with O(1) space constraints. Key takeaways:

1. **Core Technique**: Use two pointers (read and write) to modify arrays in-place
2. **Order Matters**: Choose overwrite vs. swap based on order preservation requirements
3. **Single Pass**: Most variations achieve O(n) time complexity
4. **Return New Length**: Most problems return k, the count of valid elements
5. **Flexibility**: Can be extended to three pointers for three-way partitioning
6. **Practice**: Master this pattern with problems like Remove Duplicates, Move Zeroes, and Sort Colors

This pattern forms the foundation for many advanced array manipulation techniques and is frequently tested in technical interviews.

---

## Additional Resources

- [LeetCode - Two Pointers](https://leetcode.com/tag/two-pointers/) - Practice problems
- [GeeksforGeeks - Two Pointers](https://www.geeksforgeeks.org/two-pointers-technique/) - Theory and examples
- [Wikipedia - In-place Algorithm](https://en.wikipedia.org/wiki/In-place_algorithm) - Algorithm design principles
- [LeetCode Discuss](https://leetcode.com/discuss/) - Community solutions and insights
