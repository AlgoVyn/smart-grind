# Remove Duplicates from Sorted Array

## Problem Statement

Given a sorted array `nums` in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be preserved.

Return the new length of the array after removing duplicates.

**Link to problem:** [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-100 <= nums[i] <= 100`
- `nums` is sorted in non-decreasing order

**Note:**
- Do not allocate extra space for another array; modify the array in-place with O(1) extra memory.
- The input array is modified in-place, and the first `k` elements of `nums` (where `k` is the new length) should contain the unique elements in sorted order.
- The function returns `k`, the new length of the array.

---

## Examples

### Example 1

**Input:**
```
nums = [1,1,2]
```

**Output:**
```
2
```

**Explanation:** Your function should return `k = 2`, with the first two elements of `nums` being `[1, 2]` respectively. The actual array `nums` after modification should look like `[1, 2, ...]` where the remaining elements can be anything.

---

### Example 2

**Input:**
```
nums = [0,0,1,1,1,2,2,3,3,4]
```

**Output:**
```
5
```

**Explanation:** Your function should return `k = 5`, with the first five elements of `nums` being `[0, 1, 2, 3, 4]` respectively. The actual array `nums` after modification should look like `[0, 1, 2, 3, 4, ...]` where the remaining elements can be anything.

---

### Example 3

**Input:**
```
nums = [1,1,1,1,1]
```

**Output:**
```
1
```

**Explanation:** All elements are duplicates. The function returns `1`, with the first element being `[1]`.

---

### Example 4

**Input:**
```
nums = [1,2,3,4,5]
```

**Output:**
```
5
```

**Explanation:** No duplicates present. The function returns `5`, and the array remains unchanged.

---

## Intuition

The key insight is that since the array is already sorted, all duplicate elements will be adjacent to each other. This means we can use a two-pointer approach (or more precisely, a pointer to track the position where the next unique element should be placed) to solve this problem efficiently in a single pass.

### Approach 1: Two Pointers (Fast and Slow)

The most common and optimal solution uses two pointers:
- **Slow pointer (`write_ptr`)**: Points to the position where the next unique element should be placed
- **Fast pointer (`read_ptr`)**: Iterates through the array to find unique elements

**Algorithm:**
1. If the array is empty, return 0
2. Initialize `write_ptr = 0` (first position is always unique)
3. Iterate through the array with `read_ptr` starting from 1
4. When `nums[read_ptr]` is different from `nums[write_ptr]`, it's a new unique element
5. Increment `write_ptr` and place the new element at that position
6. Return `write_ptr + 1` (the count of unique elements)

### Approach 2: Single Pass with Direct Placement

A slightly more direct approach where we simply skip duplicates and overwrite positions as we find unique elements.

### Approach 3: Using Set (Not In-Place)

A straightforward approach using a hash set to track unique elements, then placing them back. This doesn't meet the O(1) extra space requirement but is easy to understand.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Two Pointers (Fast and Slow)** - Optimal O(n) time, O(1) space
2. **Single Pass with Direct Placement** - O(n) time, O(1) space
3. **Using Set** - O(n) time, O(n) space (not in-place)

---

## Approach 1: Two Pointers (Fast and Slow)

This is the optimal approach that uses two pointers to solve the problem in a single pass with constant space.

#### Algorithm Steps

1. If the array is empty, return 0 immediately
2. Initialize `write_ptr = 0` (position for next unique element)
3. Iterate through the array with `read_ptr` starting from 1
4. When `nums[read_ptr] != nums[write_ptr]`, it's a new unique element
5. Increment `write_ptr` and assign `nums[write_ptr] = nums[read_ptr]`
6. Continue until `read_ptr` reaches the end
7. Return `write_ptr + 1` as the new length

#### Code Implementation

````carousel
```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        """
        Remove duplicates from a sorted array in-place.
        
        Args:
            nums: List of integers sorted in non-decreasing order
            
        Returns:
            The length of the array after removing duplicates
        """
        # Edge case: empty array
        if not nums:
            return 0
        
        # write_ptr points to the position for next unique element
        write_ptr = 0
        
        # read_ptr scans through the array
        for read_ptr in range(1, len(nums)):
            # If current element is different from last unique element
            if nums[read_ptr] != nums[write_ptr]:
                # Move write_ptr forward and place the new unique element
                write_ptr += 1
                nums[write_ptr] = nums[read_ptr]
        
        # Return the count of unique elements (write_ptr + 1)
        return write_ptr + 1
```

<!-- slide -->
```cpp
class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        /**
         * Remove duplicates from a sorted array in-place.
         * 
         * Args:
         *     nums: Vector of integers sorted in non-decreasing order
         * 
         * Returns:
         *     The length of the array after removing duplicates
         */
        // Edge case: empty array
        if (nums.empty()) {
            return 0;
        }
        
        // write_ptr points to the position for next unique element
        int write_ptr = 0;
        
        // read_ptr scans through the array
        for (int read_ptr = 1; read_ptr < nums.size(); read_ptr++) {
            // If current element is different from last unique element
            if (nums[read_ptr] != nums[write_ptr]) {
                // Move write_ptr forward and place the new unique element
                write_ptr++;
                nums[write_ptr] = nums[read_ptr];
            }
        }
        
        // Return the count of unique elements (write_ptr + 1)
        return write_ptr + 1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int removeDuplicates(int[] nums) {
        /**
         * Remove duplicates from a sorted array in-place.
         * 
         * Args:
         *     nums: Array of integers sorted in non-decreasing order
         * 
         * Returns:
         *     The length of the array after removing duplicates
         */
        // Edge case: empty array
        if (nums.length == 0) {
            return 0;
        }
        
        // write_ptr points to the position for next unique element
        int write_ptr = 0;
        
        // read_ptr scans through the array
        for (int read_ptr = 1; read_ptr < nums.length; read_ptr++) {
            // If current element is different from last unique element
            if (nums[read_ptr] != nums[write_ptr]) {
                // Move write_ptr forward and place the new unique element
                write_ptr++;
                nums[write_ptr] = nums[read_ptr];
            }
        }
        
        // Return the count of unique elements (write_ptr + 1)
        return write_ptr + 1;
    }
}
```

<!-- slide -->
```javascript
/**
 * Remove duplicates from a sorted array in-place.
 * 
 * @param {number[]} nums - Array of numbers sorted in non-decreasing order
 * @return {number} - The length of the array after removing duplicates
 */
var removeDuplicates = function(nums) {
    // Edge case: empty array
    if (nums.length === 0) {
        return 0;
    }
    
    // write_ptr points to the position for next unique element
    let write_ptr = 0;
    
    // read_ptr scans through the array
    for (let read_ptr = 1; read_ptr < nums.length; read_ptr++) {
        // If current element is different from last unique element
        if (nums[read_ptr] !== nums[write_ptr]) {
            // Move write_ptr forward and place the new unique element
            write_ptr++;
            nums[write_ptr] = nums[read_ptr];
        }
    }
    
    // Return the count of unique elements (write_ptr + 1)
    return write_ptr + 1;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the array where n is the length |
| **Space** | O(1) - Only two integer pointers used |

---

## Approach 2: Single Pass with Direct Placement

This approach is essentially the same as the two-pointer approach but emphasizes direct element placement without maintaining the distinction between "read" and "write" operations.

#### Algorithm Steps

1. If the array has 0 or 1 elements, return its length (no duplicates possible)
2. Initialize a unique counter `unique_count = 1` (first element is always unique)
3. Iterate from index 1 to end
4. For each element, check if it's different from the previous unique element
5. If different, increment `unique_count` and place the element at position `unique_count - 1`
6. Return `unique_count`

#### Code Implementation

````carousel
```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        """
        Remove duplicates from a sorted array in-place.
        
        Args:
            nums: List of integers sorted in non-decreasing order
            
        Returns:
            The length of the array after removing duplicates
        """
        n = len(nums)
        
        # Edge cases: 0 or 1 elements (no duplicates possible)
        if n <= 1:
            return n
        
        # Start with first element as unique
        unique_count = 1
        
        # Check each element starting from index 1
        for i in range(1, n):
            # If current element is different from last unique element
            if nums[i] != nums[unique_count - 1]:
                # Place the new unique element
                unique_count += 1
                nums[unique_count - 1] = nums[i]
        
        return unique_count
```

<!-- slide -->
```cpp
class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        int n = nums.size();
        
        // Edge cases: 0 or 1 elements (no duplicates possible)
        if (n <= 1) {
            return n;
        }
        
        // Start with first element as unique
        int unique_count = 1;
        
        // Check each element starting from index 1
        for (int i = 1; i < n; i++) {
            // If current element is different from last unique element
            if (nums[i] != nums[unique_count - 1]) {
                // Place the new unique element
                unique_count++;
                nums[unique_count - 1] = nums[i];
            }
        }
        
        return unique_count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int removeDuplicates(int[] nums) {
        int n = nums.length;
        
        // Edge cases: 0 or 1 elements (no duplicates possible)
        if (n <= 1) {
            return n;
        }
        
        // Start with first element as unique
        int unique_count = 1;
        
        // Check each element starting from index 1
        for (int i = 1; i < n; i++) {
            // If current element is different from last unique element
            if (nums[i] != nums[unique_count - 1]) {
                // Place the new unique element
                unique_count++;
                nums[unique_count - 1] = nums[i];
            }
        }
        
        return unique_count;
    }
}
```

<!-- slide -->
```javascript
/**
 * Remove duplicates from a sorted array in-place.
 * 
 * @param {number[]} nums - Array of numbers sorted in non-decreasing order
 * @return {number} - The length of the array after removing duplicates
 */
var removeDuplicates = function(nums) {
    const n = nums.length;
    
    // Edge cases: 0 or 1 elements (no duplicates possible)
    if (n <= 1) {
        return n;
    }
    
    // Start with first element as unique
    let unique_count = 1;
    
    // Check each element starting from index 1
    for (let i = 1; i < n; i++) {
        // If current element is different from last unique element
        if (nums[i] !== nums[unique_count - 1]) {
            // Place the new unique element
            unique_count++;
            nums[unique_count - 1] = nums[i];
        }
    }
    
    return unique_count;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the array |
| **Space** | O(1) - Only constant extra space used |

---

## Approach 3: Using Set (Not In-Place)

This approach uses a hash set to track unique elements and then places them back in the array. While this doesn't meet the O(1) extra space requirement, it provides a simple and intuitive solution.

#### Algorithm Steps

1. Create an empty set to store unique elements
2. Iterate through the array and add each element to the set
3. Place the unique elements back into the array starting from index 0
4. Return the size of the set (number of unique elements)

**Note:** This approach does not satisfy the O(1) extra space requirement since the set uses O(k) space where k is the number of unique elements.

#### Code Implementation

````carousel
```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        """
        Remove duplicates from a sorted array using a set.
        Note: This does not meet the O(1) extra space requirement.
        
        Args:
            nums: List of integers sorted in non-decreasing order
            
        Returns:
            The length of the array after removing duplicates
        """
        # Use a set to track unique elements
        unique_set = set()
        
        # Add all elements to the set (removes duplicates)
        for num in nums:
            unique_set.add(num)
        
        # Place unique elements back into the array
        index = 0
        for num in unique_set:
            nums[index] = num
            index += 1
        
        # Return the number of unique elements
        return len(unique_set)
```

<!-- slide -->
```cpp
class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        /**
         * Remove duplicates from a sorted array using a set.
         * Note: This does not meet the O(1) extra space requirement.
         * 
         * Args:
         *     nums: Vector of integers sorted in non-decreasing order
         * 
         * Returns:
         *     The length of the array after removing duplicates
         */
        // Use an unordered_set to track unique elements
        unordered_set<int> unique_set(nums.begin(), nums.end());
        
        // Place unique elements back into the array
        int index = 0;
        for (int num : unique_set) {
            nums[index] = num;
            index++;
        }
        
        // Return the number of unique elements
        return unique_set.size();
    }
};
```

<!-- slide -->
```java
class Solution {
    public int removeDuplicates(int[] nums) {
        /**
         * Remove duplicates from a sorted array using a set.
         * Note: This does not meet the O(1) extra space requirement.
         * 
         * Args:
         *     nums: Array of integers sorted in non-decreasing order
         * 
         * Returns:
         *     The length of the array after removing duplicates
         */
        // Use a HashSet to track unique elements
        Set<Integer> uniqueSet = new HashSet<>();
        
        // Add all elements to the set (removes duplicates)
        for (int num : nums) {
            uniqueSet.add(num);
        }
        
        // Place unique elements back into the array
        int index = 0;
        for (int num : uniqueSet) {
            nums[index] = num;
            index++;
        }
        
        // Return the number of unique elements
        return uniqueSet.size();
    }
}
```

<!-- slide -->
```javascript
/**
 * Remove duplicates from a sorted array using a set.
 * Note: This does not meet the O(1) extra space requirement.
 * 
 * @param {number[]} nums - Array of numbers sorted in non-decreasing order
 * @return {number} - The length of the array after removing duplicates
 */
var removeDuplicates = function(nums) {
    // Use a Set to track unique elements
    const uniqueSet = new Set();
    
    // Add all elements to the set (removes duplicates)
    for (let i = 0; i < nums.length; i++) {
        uniqueSet.add(nums[i]);
    }
    
    // Place unique elements back into the array
    let index = 0;
    for (const num of uniqueSet) {
        nums[index] = num;
        index++;
    }
    
    // Return the number of unique elements
    return uniqueSet.size;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass to add to set, single pass to place back |
| **Space** | O(n) - Set stores up to n unique elements |

---

## Comparison of Approaches

| Aspect | Two Pointers | Single Pass | Using Set |
|--------|--------------|-------------|-----------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(1) | O(n) |
| **In-Place** | ✅ Yes | ✅ Yes | ❌ No |
| **Implementation** | Simple | Simple | Simple |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ❌ No |
| **Preserves Order** | ✅ Yes | ✅ Yes | ❌ No* |
| **Stable Sort** | ✅ Yes | ✅ Yes | ❌ No |

*Note: The set approach does not preserve the original order of elements because sets don't maintain insertion order in all implementations.

---

## Why Two Pointers is Optimal for This Problem

The two-pointer approach with fast and slow pointers is the optimal solution because:

1. **Single Pass:** Visits each element at most once, achieving O(n) time complexity
2. **Constant Space:** Only two integer pointers used, achieving O(1) space complexity
3. **In-Place Modification:** Modifies the original array without allocating additional storage
4. **Order Preservation:** Maintains the relative order of unique elements (stable)
5. **Industry Standard:** Widely accepted and used solution for this problem
6. **Minimal Operations:** Each element is compared and potentially moved only once

The key insight is that in a sorted array, duplicates are always adjacent. This allows us to efficiently identify unique elements by simply comparing adjacent elements.

---

## Related Problems

Based on similar themes (array manipulation, in-place modification, two-pointer technique):

- **[Remove Element](https://leetcode.com/problems/remove-element/)** - Remove elements equal to a given value in-place
- **[Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)** - Find range of target values
- **[Search Insert Position](https://leetcode.com/problems/search-insert-position/)** - Find insertion position in sorted array
- **[Two Sum II - Input array is sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)** - Two pointers for two sum
- **[Remove Duplicates from Sorted Array II](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/)** - Allow up to two duplicates
- **[Move Zeroes](https://leetcode.com/problems/move-zeroes/)** - Move all zeros to the end in-place
- **[Squares of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array/)** - Square elements and sort

---

## Pattern Documentation

For a comprehensive guide on the **In-Place Array Modification** pattern using two-pointer technique, including detailed explanations, multiple approaches, and templates in Python, C++, Java, and JavaScript, see:

- **[In-Place Array Modification Pattern](../patterns/two-pointers-in-place-array-modification.md)** - Complete pattern documentation

---

## Complete Two Pointers - In-place Array Modification Guide

### Overview

The **Two Pointers - In-place Array Modification** pattern is a powerful technique used for solving problems that require modifying arrays without using extra space. This pattern employs two pointers moving through the array at different speeds or directions to efficiently rearrange, remove, or reorganize elements directly in the original array.

### Core Concept

The fundamental idea behind this pattern is the use of two pointers:
- **Read Pointer (or Fast Pointer)**: Traverses the array, reading each element
- **Write Pointer (or Slow Pointer)**: Tracks the position where the next valid element should be placed

### Key Approaches

#### Approach 1: Fast and Slow Pointers (Standard)

The most common and intuitive approach uses two pointers moving in the same direction.

`````carousel
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
            nums[write] = nums[read];  # Place valid element
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
`````

#### Approach 2: Two Pointers with Swap (Partitioning)

When order preservation is not required, swapping provides an efficient alternative.

`````carousel
```python
def two_pointers_swap(nums, condition):
    """
    Two Pointers with swapping for partitioning.
    Useful when order doesn't need to be preserved.
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        while left <= right and condition(nums[left]):
            left += 1
        while left <= right and not condition(nums[right]):
            right -= 1
        if left < right:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1
    
    return left  # Partition point
```

<!-- slide -->
```cpp
template<typename Func>
int twoPointersSwap(vector<int>& nums, Func condition) {
    int left = 0, right = nums.size() - 1;
    
    while (left <= right) {
        while (left <= right && condition(nums[left])) left++;
        while (left <= right && !condition(nums[right])) right--;
        if (left < right) {
            swap(nums[left], nums[right]);
            left++;
            right--;
        }
    }
    
    return left;
}
```

<!-- slide -->
```java
public static int twoPointersSwap(int[] nums, IntPredicate condition) {
    int left = 0, right = nums.length - 1;
    
    while (left <= right) {
        while (left <= right && condition.test(nums[left])) left++;
        while (left <= right && !condition.test(nums[right])) right--;
        if (left < right) {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            left++;
            right--;
        }
    }
    
    return left;
}
```

<!-- slide -->
```javascript
function twoPointersSwap(nums, condition) {
    let left = 0, right = nums.length - 1;
    
    while (left <= right) {
        while (left <= right && condition(nums[left])) left++;
        while (left <= right && !condition(nums[right])) right--;
        if (left < right) {
            [nums[left], nums[right]] = [nums[right], nums[left]];
            left++;
            right--;
        }
    }
    
    return left;
}
```
`````

#### Approach 3: Three Pointers (Dutch National Flag)

For three-way partitioning problems like Sort Colors.

`````carousel
```python
def dutch_national_flag(nums):
    """
    Three pointers for Dutch National Flag problem.
    Partitions array into three groups: 0s, 1s, and 2s.
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
`````

### Comparison of Approaches

| Approach | Time | Space | Preserves Order | Use Case |
|----------|------|-------|-----------------|----------|
| **Fast/Slow Pointers** | O(n) | O(1) | ✅ Yes | Removing elements with order preservation |
| **Two Pointers with Swap** | O(n) | O(1) | ❌ No | Partitioning when order doesn't matter |
| **Three Pointers (Dutch)** | O(n) | O(1) | ❌ No | Three-way partitioning (colors) |
| **Replace with Last** | O(n) | O(1) | ❌ No | When order doesn't matter, minimize writes |

### Related LeetCode Problems

**Easy:**
- [Remove Element](https://leetcode.com/problems/remove-element/) - Remove all instances of a value in-place
- [Move Zeroes](https://leetcode.com/problems/move-zeroes/) - Move all zeros to the end
- [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) - Remove duplicates

**Medium:**
- [Remove Duplicates from Sorted Array II](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/) - Allow up to 2 duplicates
- [Sort Colors](https://leetcode.com/problems/sort-colors/) - Dutch National Flag problem
- [Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/) - Merge two sorted arrays in-place

**Hard:**
- [First Missing Positive](https://leetcode.com/problems/first-missing-positive/) - O(n) in-place solution
- [Wiggle Sort II](https://leetcode.com/problems/wiggle-sort-ii/) - In-place wiggle sort

### Video Tutorials

- [Two Pointers Technique - GeeksforGeeks](https://www.youtube.com/watch?v=4QlTnbI7V_c)
- [Remove Duplicates from Sorted Array - NeetCode](https://www.youtube.com/watch?v=DEJJeMBuP68)
- [Move Zeroes - Two Pointers Approach](https://www.youtube.com/watch?v=SaPk6muXHGk)
- [Sort Colors (Dutch National Flag)](https://www.youtube.com/watch?v=uvBexoU2N-s)

### Common Pitfalls

1. **Pointer Confusion**: Clearly separate read and write pointer responsibilities
2. **Off-by-One Errors**: Be careful with pointer initialization (0 vs 1)
3. **Order Preservation**: Use overwrite vs. swap based on requirements
4. **Return Values**: Return new length k, not the modified array
5. **Edge Cases**: Handle empty arrays and all-matching elements

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining the problem and solutions:

- [Remove Duplicates from Sorted Array - LeetCode 26](https://www.youtube.com/watch?v=DEJJeMBuP68) - Detailed explanation by NeetCode
- [Remove Duplicates from Sorted Array - Two Pointers](https://www.youtube.com/watch?v=5EaG4f9w6Bw) - Clear walkthrough with examples
- [LeetCode 26 - Remove Duplicates from Sorted Array](https://www.youtube.com/watch?v=XMJ-1hfnYcQ) - Multiple approaches explained
- [In-Place Array Operations](https://www.youtube.com/watch?v=Q6nY5d4c5Hs) - Comprehensive array manipulation tutorial

---

## Followup Questions

### Q1: Why do we start the slow pointer at index 0 instead of 1?

**Answer:** The first element is always unique by definition (there's nothing before it to compare with). Starting at index 0 allows us to use it as a reference point for comparing subsequent elements. When we find a new unique element, we overwrite the position after the current slow pointer.

---

### Q2: What happens if the array is empty?

**Answer:** If the array is empty, we return 0 immediately since there are no elements to process. This is handled in the first line of the algorithm with an edge case check.

---

### Q3: How would you modify this to allow up to k duplicates?

**Answer:** For the "Remove Duplicates from Sorted Array II" problem (LeetCode 80), you would modify the condition to check if `nums[i] != nums[slow - k + 1]` instead of `nums[i] != nums[slow]`. This allows each element to appear up to k times before being considered a duplicate.

---

### Q4: Can this approach handle negative numbers?

**Answer:** Yes, absolutely. The algorithm only compares values for equality, so it works regardless of whether the numbers are positive, negative, or zero. The constraints mention `-100 <= nums[i] <= 100` for a reason.

---

### Q5: Why does the function return k (the new length) instead of modifying the array size?

**Answer:** In most programming languages, arrays have fixed sizes and cannot be dynamically resized. The function returns the count of unique elements `k`, and the caller is expected to use only the first `k` elements of the array. The remaining elements can be anything since they are considered "garbage" by the caller.

---

### Q6: How would you verify that your solution works correctly?

**Answer:** You can verify by:
1. Checking that the returned value `k` equals the number of unique elements
2. Verifying that `nums[0:k]` contains only unique elements in sorted order
3. Ensuring that the relative order of unique elements is preserved
4. Testing edge cases: empty array, single element, all duplicates, no duplicates

---

### Q7: What's the difference between this problem and the "Remove Duplicates from Sorted Array II"?

**Answer:** The original problem (LeetCode 26) removes ALL duplicates, keeping only one occurrence of each unique element. The follow-up problem (LeetCode 80) allows up to two occurrences of each element. The solution for LeetCode 80 is similar but checks against the element `k` positions back instead of just the last unique element.

---

### Q8: How would you count the frequency of each element while removing duplicates?

**Answer:** You could maintain a frequency counter as you traverse. When you encounter a new element (different from the previous), start counting from 1. When you encounter a duplicate, increment the counter. You would then decide whether to keep the element based on your frequency threshold.

---

### Q9: Can this algorithm be parallelized?

**Answer:** Not easily, because the decision of whether to keep an element depends on the previous unique element, which may have been determined earlier in the traversal. The inherently sequential nature of the algorithm makes parallelization challenging.

---

### Q10: How would you modify this to work with a doubly linked list instead of an array?

**Answer:** For a doubly linked list, you would traverse from the head and compare each node with the previous unique node. When you find a new unique node, you would update the `next` pointer of the last unique node to skip duplicates. Since linked lists support dynamic insertion, you don't need to overwrite values like in arrays.

---

## Summary

The "Remove Duplicates from Sorted Array" problem demonstrates the power of the two-pointer technique for in-place array modifications. This approach solves the problem optimally with O(n) time and O(1) space complexity.

**Key Takeaways:**
- Two pointers (read and write) can solve this problem in a single pass
- The array is already sorted, so duplicates are always adjacent
- The first element is always unique by definition
- We overwrite duplicate positions with new unique elements
- The function returns the count of unique elements, not the modified array
- Edge cases (empty array, single element) should be handled first
- Multiple approaches exist with different trade-offs (time vs. space)

Understanding this problem builds a strong foundation for tackling more complex array manipulation problems and mastering the two-pointer pattern.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/remove-duplicates-from-sorted-array/discuss/) - Community solutions and explanations
- [Two Pointer Technique](https://www.geeksforgeeks.org/two-pointers-technique/) - Detailed explanation
- [Array Data Structure](https://www.geeksforgeeks.org/array-data-structure/) - Understanding arrays
- [In-Place Algorithms](https://en.wikipedia.org/wiki/In-place_algorithm) - Learn about in-place algorithm design
