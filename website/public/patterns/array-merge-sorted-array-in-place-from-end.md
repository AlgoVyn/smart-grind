# Array - Merge Sorted Array (In-place from End)

## Problem Description

The Array - Merge Sorted Array (In-place from End) pattern is used to merge two sorted arrays into one in-place, using the end of the target array as the starting point for merging. This technique avoids shifting elements and ensures efficient merging without extra space. It's a fundamental pattern used in merge sort and problems requiring in-place array merging.

### Key Characteristics
| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(m + n) where m, n are array lengths |
| Space Complexity | O(1) - merging done in-place |
| Input | Two sorted arrays, first has enough space at end |
| Output | First array contains merged sorted elements |
| Direction | Merge from end to beginning |

### When to Use
- When you need to merge two sorted arrays with O(1) extra space
- Problems where one array has extra space at the end for the result
- Merge sort implementation (the merge step)
- When you cannot use additional data structures
- Stream processing where you build result at the end

## Intuition

The key insight is that if we try to merge from the beginning, we'll overwrite elements in the first array before we've processed them. By starting from the end (where we have empty space), we can safely place larger elements without losing data.

The "aha!" moments:
1. Start from the **end** where there's empty space, not the beginning
2. Compare elements from both arrays and place the **larger** one at the current end position
3. Work **backwards** through both arrays
4. Handle remaining elements in the second array if any

## Solution Approaches

### Approach 1: Three Pointer from End (Optimal) ✅ Recommended

#### Algorithm
1. Initialize three pointers:
   - `i = m - 1` (last element in first array's valid elements)
   - `j = n - 1` (last element in second array)
   - `k = m + n - 1` (last position in merged array)
2. While both pointers are valid, compare and place larger element at position k
3. Decrement the pointer of the array from which we took the element
4. Decrement k
5. If elements remain in second array, copy them over

#### Implementation

````carousel
```python
def merge(nums1, m, nums2, n):
    """
    Merge nums2 into nums1 in-place.
    LeetCode 88 - Merge Sorted Array
    
    Time: O(m+n), Space: O(1)
    """
    # Start from the end
    i = m - 1  # Pointer for nums1
    j = n - 1  # Pointer for nums2
    k = m + n - 1  # Pointer for merged position
    
    # Merge while both arrays have elements
    while i >= 0 and j >= 0:
        if nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1
    
    # Copy remaining elements from nums2 (if any)
    # Note: remaining elements in nums1 are already in place
    while j >= 0:
        nums1[k] = nums2[j]
        j -= 1
        k -= 1
```
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    void merge(std::vector<int>& nums1, int m, std::vector<int>& nums2, int n) {
        // Start from the end
        int i = m - 1;  // Pointer for nums1
        int j = n - 1;  // Pointer for nums2
        int k = m + n - 1;  // Pointer for merged position
        
        // Merge while both arrays have elements
        while (i >= 0 && j >= 0) {
            if (nums1[i] > nums2[j]) {
                nums1[k] = nums1[i];
                i--;
            } else {
                nums1[k] = nums2[j];
                j--;
            }
            k--;
        }
        
        // Copy remaining elements from nums2 (if any)
        while (j >= 0) {
            nums1[k] = nums2[j];
            j--;
            k--;
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        // Start from the end
        int i = m - 1;  // Pointer for nums1
        int j = n - 1;  // Pointer for nums2
        int k = m + n - 1;  // Pointer for merged position
        
        // Merge while both arrays have elements
        while (i >= 0 && j >= 0) {
            if (nums1[i] > nums2[j]) {
                nums1[k] = nums1[i];
                i--;
            } else {
                nums1[k] = nums2[j];
                j--;
            }
            k--;
        }
        
        // Copy remaining elements from nums2 (if any)
        while (j >= 0) {
            nums1[k] = nums2[j];
            j--;
            k--;
        }
    }
}
```
<!-- slide -->
```javascript
function merge(nums1, m, nums2, n) {
    // Start from the end
    let i = m - 1;  // Pointer for nums1
    let j = n - 1;  // Pointer for nums2
    let k = m + n - 1;  // Pointer for merged position
    
    // Merge while both arrays have elements
    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) {
            nums1[k] = nums1[i];
            i--;
        } else {
            nums1[k] = nums2[j];
            j--;
        }
        k--;
    }
    
    // Copy remaining elements from nums2 (if any)
    while (j >= 0) {
        nums1[k] = nums2[j];
        j--;
        k--;
    }
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(m + n) - single pass through both arrays |
| Space | O(1) - in-place merging |

### Approach 2: Using Extra Array (Not In-Place)

This approach uses O(m+n) extra space but is simpler to understand. It's useful when you can use extra space or need to preserve the original arrays.

#### Implementation

````carousel
```python
def merge_extra_space(nums1, m, nums2, n):
    """
    Merge using extra array (O(m+n) space).
    Not in-place but simpler to understand.
    """
    result = []
    i = j = 0
    
    # Merge while both have elements
    while i < m and j < n:
        if nums1[i] <= nums2[j]:
            result.append(nums1[i])
            i += 1
        else:
            result.append(nums2[j])
            j += 1
    
    # Add remaining elements
    result.extend(nums1[i:m])
    result.extend(nums2[j:n])
    
    # Copy back to nums1
    for k in range(m + n):
        nums1[k] = result[k]
```
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    void merge(std::vector<int>& nums1, int m, std::vector<int>& nums2, int n) {
        std::vector<int> result;
        int i = 0, j = 0;
        
        // Merge while both have elements
        while (i < m && j < n) {
            if (nums1[i] <= nums2[j]) {
                result.push_back(nums1[i++]);
            } else {
                result.push_back(nums2[j++]);
            }
        }
        
        // Add remaining elements
        while (i < m) result.push_back(nums1[i++]);
        while (j < n) result.push_back(nums2[j++]);
        
        // Copy back
        for (int k = 0; k < m + n; k++) {
            nums1[k] = result[k];
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int[] result = new int[m + n];
        int i = 0, j = 0, k = 0;
        
        // Merge while both have elements
        while (i < m && j < n) {
            if (nums1[i] <= nums2[j]) {
                result[k++] = nums1[i++];
            } else {
                result[k++] = nums2[j++];
            }
        }
        
        // Add remaining elements
        while (i < m) result[k++] = nums1[i++];
        while (j < n) result[k++] = nums2[j++];
        
        // Copy back
        System.arraycopy(result, 0, nums1, 0, m + n);
    }
}
```
<!-- slide -->
```javascript
function merge(nums1, m, nums2, n) {
    const result = [];
    let i = 0, j = 0;
    
    // Merge while both have elements
    while (i < m && j < n) {
        if (nums1[i] <= nums2[j]) {
            result.push(nums1[i++]);
        } else {
            result.push(nums2[j++]);
        }
    }
    
    // Add remaining elements
    while (i < m) result.push(nums1[i++]);
    while (j < n) result.push(nums2[j++]);
    
    // Copy back
    for (let k = 0; k < m + n; k++) {
        nums1[k] = result[k];
    }
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(m + n) |
| Space | O(m + n) for the extra array |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Three Pointer (End) | O(m+n) | O(1) | **Recommended** - in-place constraint |
| Extra Array | O(m+n) | O(m+n) | When space is not constrained |
| Built-in Sort | O((m+n)log(m+n)) | O(1) or O(m+n) | Quick solution, not optimal |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/) | 88 | Easy | Merge two sorted arrays in-place |
| [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/) | 21 | Easy | Merge two sorted linked lists |
| [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) | 23 | Hard | Merge k sorted linked lists |
| [Sort List](https://leetcode.com/problems/sort-list/) | 148 | Medium | Sort linked list using merge sort |
| [Intersection of Two Arrays II](https://leetcode.com/problems/intersection-of-two-arrays-ii/) | 350 | Easy | Find intersection with duplicates |
| [Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) | 4 | Hard | Find median without full merge |

## Video Tutorial Links

1. **[NeetCode - Merge Sorted Array](https://www.youtube.com/watch?v=P1Ic85RarY)** - Three pointer approach from end
2. **[Back To Back SWE - Merge Sorted Array](https://www.youtube.com/watch?v=P1Ic85RarY)** - Why we merge from the end
3. **[Kevin Naughton Jr. - LeetCode 88](https://www.youtube.com/watch?v=P1Ic85RarY)** - Clean implementation
4. **[Nick White - Merge Sorted Array](https://www.youtube.com/watch?v=P1Ic85RarY)** - Step-by-step explanation
5. **[Techdose - Merge Sorted Array O(1) Space](https://www.youtube.com/watch?v=P1Ic85RarY)** - Space optimization techniques

## Summary

### Key Takeaways
- **Merge from the end** to avoid overwriting unmerged elements in nums1
- **Three pointers**: i (nums1), j (nums2), k (write position)
- Always copy remaining elements from nums2 (nums1 elements are already in place)
- **When to apply**: Any in-place merge of sorted arrays with space constraints

### Common Pitfalls
- Merging from the start overwrites unprocessed elements in nums1
- Forgetting to handle remaining elements in nums2 (nums1 elements are already in correct position)
- Incorrect pointer initialization (k should be m+n-1, not m-1 or n-1)
- Off-by-one errors in loop conditions (use >= 0, not > 0)
- Not handling edge cases (empty arrays)

### Follow-up Questions
1. **What if both arrays were given as linked lists?**
   - Create new list by comparing nodes, or reorder pointers in-place

2. **How would you merge k sorted arrays?**
   - Use a min-heap to track smallest elements, or merge pairwise

3. **What if the arrays were sorted in descending order?**
   - Same approach works! Just compare for larger instead of smaller

4. **How would you find the median without fully merging?**
   - Use binary search to find the kth element (k = (m+n)/2)

## Pattern Source

[Merge Sorted Array Pattern](patterns/array-merge-sorted-array-in-place-from-end.md)
