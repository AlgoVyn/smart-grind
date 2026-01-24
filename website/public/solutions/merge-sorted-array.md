# Merge Sorted Array

## Problem Description

You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.

Merge `nums1` and `nums2` into a single sorted array in non-decreasing order.

The final sorted array should not be returned by the function, but instead be stored inside the array `nums1`.

To accommodate this:
- `nums1` has a capacity of `m + n` elements
- The first `m` elements should be the elements to merge
- The last `n` elements are initialized to zeros and should be ignored

This is one of the classic array manipulation problems that tests your understanding of:
1. In-place modification constraints
2. Two-pointer technique
3. Edge case handling
4. Time/space optimization

---

## Examples

**Example 1:**
```python
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
Explanation: 
- The first 3 elements of nums1 are [1,2,3]
- nums2 contains [2,5,6]
- After merging: [1,2,2,3,5,6]
```

**Example 2:**
```python
Input: nums1 = [1], m = 1, nums2 = [], n = 0
Output: [1]
Explanation: nums2 is empty, so nums1 remains unchanged
```

**Example 3:**
```python
Input: nums1 = [0], m = 0, nums2 = [1], n = 1
Output: [1]
Explanation: nums1 has no elements, all elements come from nums2
```

**Example 4:**
```python
Input: nums1 = [4,5,6,0,0,0], m = 3, nums2 = [1,2,3], n = 3
Output: [1,2,3,4,5,6]
Explanation: All elements from nums2 are smaller than those in nums1
```

**Example 5:**
```python
Input: nums1 = [2,0], m = 1, nums2 = [1], n = 1
Output: [1,2]
Explanation: nums2 element is smaller, so it goes first
```

---

## Constraints

- `0 <= m, n <= 200`
- `-10^9 <= nums1[i], nums2[i] <= 10^9`
- `nums1.length == m + n`
- `nums2.length == n`
- `nums1` and `nums2` are sorted in non-decreasing order

---

## Intuition

The key insight to solve this problem efficiently is to **merge from the end** of the array:

1. **Why merge from the end?** - If we try to merge from the beginning, we'd overwrite unmerged elements in `nums1`. The last `n` elements of `nums1` are zeros (placeholder), so they're safe to use.

2. **Three pointers strategy**:
   - `i`: Points to the last valid element in `nums1` (at index `m-1`)
   - `j`: Points to the last element in `nums2` (at index `n-1`)
   - `k`: Points to the last position in `nums1` (at index `m+n-1`)

3. **Compare and place** - Compare elements at `i` and `j`, place the larger one at `k`, and move the respective pointer left.

4. **Handle remaining elements** - If `nums2` still has elements, copy them all; if `nums1` has remaining elements, they're already in place.

---

## Approach 1: Three Pointers (Optimal) ⭐

### Algorithm
1. Initialize three pointers:
   - `i` = `m - 1` (last valid element in nums1)
   - `j` = `n - 1` (last element in nums2)
   - `k` = `m + n - 1` (last position in nums1)
2. While both `i >= 0` and `j >= 0`:
   - If `nums1[i] > nums2[j]`: place `nums1[i]` at `k`, decrement `i`
   - Else: place `nums2[j]` at `k`, decrement `j`
   - Decrement `k` in both cases
3. If any elements remain in `nums2`, copy them to `nums1`

### Code

````carousel
```python
from typing import List

class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        i, j, k = m - 1, n - 1, m + n - 1
        
        while j >= 0:
            if i >= 0 and nums1[i] > nums2[j]:
                nums1[k] = nums1[i]
                i -= 1
            else:
                nums1[k] = nums2[j]
                j -= 1
            k -= 1
```
<!-- slide -->
```cpp
class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        int i = m - 1;
        int j = n - 1;
        int k = m + n - 1;
        
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) {
                nums1[k] = nums1[i];
                i--;
            } else {
                nums1[k] = nums2[j];
                j--;
            }
            k--;
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1;
        int j = n - 1;
        int k = m + n - 1;
        
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) {
                nums1[k] = nums1[i];
                i--;
            } else {
                nums1[k] = nums2[j];
                j--;
            }
            k--;
        }
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
    let i = m - 1;
    let j = n - 1;
    let k = m + n - 1;
    
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) {
            nums1[k] = nums1[i];
            i--;
        } else {
            nums1[k] = nums2[j];
            j--;
        }
        k--;
    }
};
```
````

### Time Complexity
**O(m + n)** - Each element is processed exactly once

### Space Complexity
**O(1)** - In-place modification, only using constant extra space for pointers

---

## Approach 2: Brute Force (Merging to Temporary Array)

### Algorithm
1. Copy the first `m` elements from `nums1` to a temporary array
2. Use two pointers to merge elements from `nums1` (temp) and `nums2` back into `nums1`
3. This approach doesn't work for in-place requirement but is useful for understanding

### Code

````carousel
```python
from typing import List

class Solution:
    def merge_bruteforce(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        """
        Not truly in-place - uses temporary storage for understanding.
        """
        temp = nums1[:m].copy()
        i, j, k = 0, 0, 0
        
        while i < m and j < n:
            if temp[i] <= nums2[j]:
                nums1[k] = temp[i]
                i += 1
            else:
                nums1[k] = nums2[j]
                j += 1
            k += 1
        
        # Copy remaining elements from temp
        while i < m:
            nums1[k] = temp[i]
            i += 1
            k += 1
        
        # Copy remaining elements from nums2 (if any)
        while j < n:
            nums1[k] = nums2[j]
            j += 1
            k += 1
```
<!-- slide -->
```cpp
class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        vector<int> temp(nums1.begin(), nums1.begin() + m);
        int i = 0, j = 0, k = 0;
        
        while (i < m && j < n) {
            if (temp[i] <= nums2[j]) {
                nums1[k++] = temp[i++];
            } else {
                nums1[k++] = nums2[j++];
            }
        }
        
        while (i < m) {
            nums1[k++] = temp[i++];
        }
        
        while (j < n) {
            nums1[k++] = nums2[j++];
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int[] temp = new int[m];
        System.arraycopy(nums1, 0, temp, 0, m);
        
        int i = 0, j = 0, k = 0;
        
        while (i < m && j < n) {
            if (temp[i] <= nums2[j]) {
                nums1[k++] = temp[i++];
            } else {
                nums1[k++] = nums2[j++];
            }
        }
        
        while (i < m) {
            nums1[k++] = temp[i++];
        }
        
        while (j < n) {
            nums1[k++] = nums2[j++];
        }
    }
}
```
<!-- slide -->
```javascript
var merge = function(nums1, m, nums2, n) {
    const temp = nums1.slice(0, m);
    let i = 0, j = 0, k = 0;
    
    while (i < m && j < n) {
        if (temp[i] <= nums2[j]) {
            nums1[k++] = temp[i++];
        } else {
            nums1[k++] = nums2[j++];
        }
    }
    
    while (i < m) {
        nums1[k++] = temp[i++];
    }
    
    while (j < n) {
        nums1[k++] = nums2[j++];
    }
};
```
````

### Time Complexity
**O(m + n)** - Each element is processed exactly once

### Space Complexity
**O(m)** - Requires temporary array to store elements from nums1

---

## Approach 3: Using Built-in Functions (Python only)

### Algorithm
1. Slice the first `m` elements from nums1
2. Concatenate with nums2
3. Sort the result
4. Copy back to nums1

### Code

```python
from typing import List

class Solution:
    def merge_builtin(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        """
        Simple approach using built-in functions.
        Note: This violates the in-place spirit but is concise.
        """
        nums1[:] = sorted(nums1[:m] + nums2)
```

### Time Complexity
**O((m+n) log (m+n))** - Sorting dominates

### Space Complexity
**O(m + n)** - Creates temporary merged array

---

## Step-by-Step Example

Let's trace through `nums1 = [1,3,5,0,0,0], m = 3, nums2 = [2,4,6], n = 3`:

**Step 1: Initialize pointers**
```
nums1 = [1, 3, 5, 0, 0, 0]
                 ^    ^    ^
                 i    j    k

i = 2 (value = 5)
j = 2 (value = 6)
k = 5 (position to place)
```

**Step 2: Compare nums1[i] and nums2[j]**
```
5 < 6, so place 6 at k
nums1 = [1, 3, 5, 0, 0, 6]
                 ^    ^  ^
                 i    j  k (now 4)

j = 1 (value = 4)
k = 4
```

**Step 3: Compare 5 and 4**
```
5 > 4, so place 5 at k
nums1 = [1, 3, 5, 0, 5, 6]
              ^    ^  ^
              i    j  k (now 3)

i = 1 (value = 3)
k = 3
```

**Step 4: Compare 3 and 4**
```
3 < 4, so place 4 at k
nums1 = [1, 3, 5, 4, 5, 6]
              ^  ^  ^
              i  j  k (now 2)

j = 0 (value = 2)
k = 2
```

**Step 5: Compare 3 and 2**
```
3 > 2, so place 3 at k
nums1 = [1, 3, 5, 4, 5, 6]
           ^  ^  ^
           i  j  k (now 1)

i = 0 (value = 1)
k = 1
```

**Step 6: Compare 1 and 2**
```
1 < 2, so place 2 at k
nums1 = [1, 3, 5, 4, 5, 6]
           ^  ^
           i  j
           k = 0

j = -1 (exhausted)
```

**Step 7: Copy remaining elements from nums2**
```
j is now -1, but nums2 still has [1] at index 0
Place 1 at k=0
nums1 = [1, 2, 3, 4, 5, 6] ✓
```

---

## Key Optimizations

1. **Merge from end** - Avoids overwriting unmerged elements
2. **Single pass** - Each element is processed exactly once
3. **Early termination** - Loop ends when nums2 is exhausted (nums1 elements are already in place)

---

## Time Complexity Comparison

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Three Pointers (Optimal) | O(m + n) | O(1) | **Best** - in-place, optimal |
| Brute Force (Temp Array) | O(m + n) | O(m) | Easy to understand, not truly in-place |
| Built-in Functions | O((m+n) log (m+n)) | O(m + n) | Concise but inefficient |

---

## Related Problems

1. **[Merge Two Sorted Lists](linked-list-merging-two-sorted-lists.md)** - Merge two sorted linked lists
2. **[K-way Merge](heap-k-way-merge.md)** - Merge k sorted arrays using a heap
3. **[Find Median of Two Sorted Arrays](binary-search-median-kth-across-two-sorted-arrays.md)** - Find median of two sorted arrays
4. **[Array Merge Sorted Pattern](array-merge-sorted-array-in-place-from-end.md)** - General pattern for merging sorted arrays
5. **[Squares of a Sorted Array](two-pointers-converging-sorted-array-target-sum.md)** - Similar two-pointer pattern

---

## Video Tutorials

- [NeetCode - Merge Sorted Array](https://www.youtube.com/watch?v=0lW8wX1EBq8)
- [Back to Back SWE - Merge Sorted Array](https://www.youtube.com/watch?v=2g80sJpXPfw)
- [LeetCode Official Solution](https://www.youtube.com/watch?v=2g80sJpXPfw)
- [Abdul Bari - Merge Sort Algorithm](https://www.youtube.com/watch?v=jlHkDBcCbzY)

---

## Follow-up Questions

1. **What if the arrays are in descending order instead of ascending?**
   - Simply reverse the comparison: `nums1[i] < nums2[j]` instead of `>`

2. **How would you merge more than two sorted arrays?**
   - Use a min-heap (priority queue) to always get the smallest element from available arrays

3. **What if nums1 doesn't have enough trailing zeros?**
   - You would need to create a new array or use a different approach entirely

4. **How do you handle duplicates in the merge?**
   - The algorithm naturally handles duplicates - equal elements can be placed in either order

5. **What if you need to merge in-place without extra space for very large arrays?**
   - The three-pointer approach already uses O(1) extra space

6. **How would you modify this for linked lists instead of arrays?**
   - You can merge from the end of linked lists, but it requires knowing the previous nodes

7. **Can you parallelize this merge operation?**
   - For large arrays, you could divide and conquer, but the dependencies make it challenging

---

## Common Mistakes to Avoid

1. **Merging from the beginning** - Causes overwriting of unmerged elements
2. **Off-by-one errors** - Ensure pointers start at correct positions (m-1, n-1, m+n-1)
3. **Forgetting to copy remaining elements** - If nums2 has elements left after nums1 is exhausted
4. **Incorrect loop condition** - Use `while j >= 0` to ensure all nums2 elements are processed
5. **Not handling empty arrays** - m or n could be 0

---

## References

- [LeetCode 88 - Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)
- Three Pointer Technique: Efficient in-place merging
- In-place Algorithm: Modifying data without additional data structures

