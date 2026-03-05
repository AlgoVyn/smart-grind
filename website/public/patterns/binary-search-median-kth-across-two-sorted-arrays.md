# Binary Search - Median / Kth across Two Sorted Arrays

## Problem Description

The Binary Search - Median / Kth across Two Sorted Arrays pattern is used to find the median or the kth smallest element across two sorted arrays without fully merging them. This advanced binary search technique achieves **O(log min(m,n))** time complexity by partitioning one array and finding the correct split point.

This pattern is particularly useful for:
- Finding the median in statistics when dealing with two sorted datasets
- Selecting kth elements in merged datasets without fully merging
- Solving problems that require order statistics across multiple sorted sources

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(log min(m,n)) - Binary search on smaller array |
| Space Complexity | O(1) - Constant extra space |
| Input | Two sorted arrays of integers |
| Output | Median value or kth smallest element |
| Approach | Virtual partitioning with binary search |

### When to Use

- Finding median of two sorted arrays without merging
- Finding kth smallest element across multiple sorted sources
- Problems requiring order statistics on combined datasets
- When merging would be too expensive (large arrays)
- Distributed computing scenarios with sorted partitions

## Intuition

The key insight is to **avoid merging the arrays** entirely. Instead, we find a "virtual partition" that splits both arrays such that all elements in the left partition are ≤ all elements in the right partition.

The "aha!" moments:
1. **Virtual Partition**: Divide one array at a point, the other partition is determined mathematically
2. **Balance Condition**: Left partition should have (m+n+1)/2 elements for median
3. **Binary Search on Smaller Array**: Always binary search on the smaller array for efficiency
4. **Boundary Values**: Use -∞ and +∞ to handle edge cases at array boundaries
5. **Correct Partition**: `max(left) ≤ min(right)` ensures correct partition

## Solution Approaches

### Approach 1: Binary Search for Median (Optimal) ✅ Recommended

#### Algorithm
1. Ensure `nums1` is the smaller array (swap if needed)
2. Calculate `half = (m + n + 1) // 2` (elements in left partition)
3. Binary search on `nums1`:
   - Partition `nums1` at `i`, then `j = half - i` for `nums2`
   - Get boundary values (use -∞/+∞ for out-of-bounds)
   - Check if `nums1_left ≤ nums2_right` and `nums2_left ≤ nums1_right`
   - If valid: calculate median based on odd/even total
   - If not: adjust binary search range

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        """
        Find median of two sorted arrays using binary search.
        LeetCode 4 - Median of Two Sorted Arrays
        
        Time: O(log min(m,n)), Space: O(1)
        """
        # Ensure nums1 is the smaller array for efficiency
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        
        m, n = len(nums1), len(nums2)
        total = m + n
        half = (total + 1) // 2  # Elements in left partition
        
        left, right = 0, m
        
        while left <= right:
            i = (left + right) // 2  # Partition in nums1
            j = half - i  # Partition in nums2 (determined mathematically)
            
            # Get boundary values, using ±∞ for out-of-bounds
            nums1_left = nums1[i-1] if i > 0 else float('-inf')
            nums1_right = nums1[i] if i < m else float('inf')
            nums2_left = nums2[j-1] if j > 0 else float('-inf')
            nums2_right = nums2[j] if j < n else float('inf')
            
            # Check if we found the correct partition
            if nums1_left <= nums2_right and nums2_left <= nums1_right:
                # Valid partition found
                if total % 2 == 1:
                    return max(nums1_left, nums2_left)  # Odd: max of left
                else:
                    return (max(nums1_left, nums2_left) + min(nums1_right, nums2_right)) / 2
            elif nums1_left > nums2_right:
                right = i - 1  # Move left in nums1
            else:
                left = i + 1  # Move right in nums1
        
        raise ValueError("Input arrays are not sorted")
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        // Ensure nums1 is the smaller array
        if (nums1.size() > nums2.size()) {
            nums1.swap(nums2);
        }
        
        int m = nums1.size();
        int n = nums2.size();
        int total = m + n;
        int half = (total + 1) / 2;
        
        int left = 0, right = m;
        
        while (left <= right) {
            int i = (left + right) / 2;
            int j = half - i;
            
            int nums1_left = (i > 0) ? nums1[i-1] : INT_MIN;
            int nums1_right = (i < m) ? nums1[i] : INT_MAX;
            int nums2_left = (j > 0) ? nums2[j-1] : INT_MIN;
            int nums2_right = (j < n) ? nums2[j] : INT_MAX;
            
            if (nums1_left <= nums2_right && nums2_left <= nums1_right) {
                if (total % 2 == 1) {
                    return max(nums1_left, nums2_left);
                } else {
                    return (max(nums1_left, nums2_left) + min(nums1_right, nums2_right)) / 2.0;
                }
            } else if (nums1_left > nums2_right) {
                right = i - 1;
            } else {
                left = i + 1;
            }
        }
        
        throw invalid_argument("Input arrays are not sorted");
    }
};
```
<!-- slide -->
```java
class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Ensure nums1 is the smaller array
        if (nums1.length > nums2.length) {
            int[] temp = nums1;
            nums1 = nums2;
            nums2 = temp;
        }
        
        int m = nums1.length;
        int n = nums2.length;
        int total = m + n;
        int half = (total + 1) / 2;
        
        int left = 0, right = m;
        
        while (left <= right) {
            int i = (left + right) / 2;
            int j = half - i;
            
            int nums1_left = (i > 0) ? nums1[i-1] : Integer.MIN_VALUE;
            int nums1_right = (i < m) ? nums1[i] : Integer.MAX_VALUE;
            int nums2_left = (j > 0) ? nums2[j-1] : Integer.MIN_VALUE;
            int nums2_right = (j < n) ? nums2[j] : Integer.MAX_VALUE;
            
            if (nums1_left <= nums2_right && nums2_left <= nums1_right) {
                if (total % 2 == 1) {
                    return Math.max(nums1_left, nums2_left);
                } else {
                    return (Math.max(nums1_left, nums2_left) + Math.min(nums1_right, nums2_right)) / 2.0;
                }
            } else if (nums1_left > nums2_right) {
                right = i - 1;
            } else {
                left = i + 1;
            }
        }
        
        throw new IllegalArgumentException("Input arrays are not sorted");
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    // Ensure nums1 is the smaller array
    if (nums1.length > nums2.length) {
        [nums1, nums2] = [nums2, nums1];
    }
    
    const m = nums1.length;
    const n = nums2.length;
    const total = m + n;
    const half = Math.floor((total + 1) / 2);
    
    let left = 0, right = m;
    
    while (left <= right) {
        const i = Math.floor((left + right) / 2);
        const j = half - i;
        
        const nums1_left = (i > 0) ? nums1[i - 1] : -Infinity;
        const nums1_right = (i < m) ? nums1[i] : Infinity;
        const nums2_left = (j > 0) ? nums2[j - 1] : -Infinity;
        const nums2_right = (j < n) ? nums2[j] : Infinity;
        
        if (nums1_left <= nums2_right && nums2_left <= nums1_right) {
            if (total % 2 === 1) {
                return Math.max(nums1_left, nums2_left);
            } else {
                return (Math.max(nums1_left, nums2_left) + Math.min(nums1_right, nums2_right)) / 2;
            }
        } else if (nums1_left > nums2_right) {
            right = i - 1;
        } else {
            left = i + 1;
        }
    }
    
    throw new Error("Input arrays are not sorted");
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(log min(m,n)) - Binary search on smaller array |
| Space | O(1) - Constant extra space |

### Approach 2: Binary Search for Kth Element

#### Algorithm
1. Ensure `nums1` is the smaller array
2. Binary search on partition points
3. Adjust partition to ensure exactly k-1 elements on the left
4. Return `max(left partition values)`

#### Implementation

````carousel
```python
from typing import List

def find_kth_element(nums1: List[int], nums2: List[int], k: int) -> int:
    """
    Finds the kth smallest element in two sorted arrays.
    
    Time: O(log min(m,n)), Space: O(1)
    """
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    if k > len(nums1) + len(nums2) or k < 1:
        raise ValueError("Invalid k")
    
    # Binary search range
    low, high = max(0, k - len(nums2)), min(k, len(nums1))
    
    while low <= high:
        i = (low + high) // 2  # Elements taken from nums1
        j = k - i  # Elements taken from nums2
        
        # Boundary values
        a_left = nums1[i-1] if i > 0 else float('-inf')
        a_right = nums1[i] if i < len(nums1) else float('inf')
        b_left = nums2[j-1] if j > 0 else float('-inf')
        b_right = nums2[j] if j < len(nums2) else float('inf')
        
        if a_left <= b_right and b_left <= a_right:
            return max(a_left, b_left)
        elif a_left > b_right:
            high = i - 1
        else:
            low = i + 1
    
    raise ValueError("Arrays not sorted or invalid k")
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

int find_kth_element(const vector<int>& nums1, const vector<int>& nums2, int k) {
    if (nums1.size() > nums2.size()) {
        return find_kth_element(nums2, nums1, k);
    }
    
    if (k > nums1.size() + nums2.size() || k < 1) {
        throw invalid_argument("Invalid k");
    }
    
    int low = max(0, k - (int)nums2.size());
    int high = min(k, (int)nums1.size());
    
    while (low <= high) {
        int i = (low + high) / 2;
        int j = k - i;
        
        int a_left = (i > 0) ? nums1[i-1] : INT_MIN;
        int a_right = (i < nums1.size()) ? nums1[i] : INT_MAX;
        int b_left = (j > 0) ? nums2[j-1] : INT_MIN;
        int b_right = (j < nums2.size()) ? nums2[j] : INT_MAX;
        
        if (a_left <= b_right && b_left <= a_right) {
            return max(a_left, b_left);
        } else if (a_left > b_right) {
            high = i - 1;
        } else {
            low = i + 1;
        }
    }
    
    throw invalid_argument("Arrays not sorted or invalid k");
}
```
<!-- slide -->
```java
public class KthElementFinder {
    public static int findKthElement(int[] nums1, int[] nums2, int k) {
        if (nums1.length > nums2.length) {
            return findKthElement(nums2, nums1, k);
        }
        
        if (k > nums1.length + nums2.length || k < 1) {
            throw new IllegalArgumentException("Invalid k");
        }
        
        int low = Math.max(0, k - nums2.length);
        int high = Math.min(k, nums1.length);
        
        while (low <= high) {
            int i = (low + high) / 2;
            int j = k - i;
            
            int a_left = (i > 0) ? nums1[i-1] : Integer.MIN_VALUE;
            int a_right = (i < nums1.length) ? nums1[i] : Integer.MAX_VALUE;
            int b_left = (j > 0) ? nums2[j-1] : Integer.MIN_VALUE;
            int b_right = (j < nums2.length) ? nums2[j] : Integer.MAX_VALUE;
            
            if (a_left <= b_right && b_left <= a_right) {
                return Math.max(a_left, b_left);
            } else if (a_left > b_right) {
                high = i - 1;
            } else {
                low = i + 1;
            }
        }
        
        throw new IllegalArgumentException("Arrays not sorted or invalid k");
    }
}
```
<!-- slide -->
```javascript
function findKthElement(nums1, nums2, k) {
    if (nums1.length > nums2.length) {
        return findKthElement(nums2, nums1, k);
    }
    
    if (k > nums1.length + nums2.length || k < 1) {
        throw new Error("Invalid k");
    }
    
    let low = Math.max(0, k - nums2.length);
    let high = Math.min(k, nums1.length);
    
    while (low <= high) {
        const i = Math.floor((low + high) / 2);
        const j = k - i;
        
        const a_left = (i > 0) ? nums1[i - 1] : -Infinity;
        const a_right = (i < nums1.length) ? nums1[i] : Infinity;
        const b_left = (j > 0) ? nums2[j - 1] : -Infinity;
        const b_right = (j < nums2.length) ? nums2[j] : Infinity;
        
        if (a_left <= b_right && b_left <= a_right) {
            return Math.max(a_left, b_left);
        } else if (a_left > b_right) {
            high = i - 1;
        } else {
            low = i + 1;
        }
    }
    
    throw new Error("Arrays not sorted or invalid k");
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(log min(m,n)) - Binary search on smaller array |
| Space | O(1) - Constant extra space |

### Approach 3: Two Pointers Without Full Merge

#### Algorithm
1. Use two pointers to traverse both arrays
2. Track values at mid positions without storing merged array
3. Return median based on odd/even total length

#### Implementation

````carousel
```python
from typing import List

def two_pointers_median(nums1: List[int], nums2: List[int]) -> float:
    """
    Find median using two pointers without full merge.
    Time: O(m+n), Space: O(1)
    """
    m, n = len(nums1), len(nums2)
    total = m + n
    mid1 = total // 2
    mid2 = mid1 - 1 if total % 2 == 0 else -1
    
    i = j = count = 0
    val1 = val2 = 0
    
    while i < m and j < n and count <= mid1:
        if nums1[i] < nums2[j]:
            if count == mid1: val1 = nums1[i]
            if count == mid2: val2 = nums1[i]
            i += 1
        else:
            if count == mid1: val1 = nums2[j]
            if count == mid2: val2 = nums2[j]
            j += 1
        count += 1
    
    while i < m and count <= mid1:
        if count == mid1: val1 = nums1[i]
        if count == mid2: val2 = nums1[i]
        i += 1
        count += 1
    
    while j < n and count <= mid1:
        if count == mid1: val1 = nums2[j]
        if count == mid2: val2 = nums2[j]
        j += 1
        count += 1
    
    return val1 if total % 2 == 1 else (val1 + val2) / 2
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

double two_pointers_median(vector<int>& nums1, vector<int>& nums2) {
    int m = nums1.size(), n = nums2.size();
    int total = m + n;
    int mid1 = total / 2;
    int mid2 = (total % 2 == 0) ? mid1 - 1 : -1;
    
    int i = 0, j = 0, count = 0;
    int val1 = 0, val2 = 0;
    
    while (i < m && j < n && count <= mid1) {
        if (nums1[i] < nums2[j]) {
            if (count == mid1) val1 = nums1[i];
            if (count == mid2) val2 = nums1[i];
            i++;
        } else {
            if (count == mid1) val1 = nums2[j];
            if (count == mid2) val2 = nums2[j];
            j++;
        }
        count++;
    }
    
    while (i < m && count <= mid1) {
        if (count == mid1) val1 = nums1[i];
        if (count == mid2) val2 = nums1[i];
        i++;
        count++;
    }
    
    while (j < n && count <= mid1) {
        if (count == mid1) val1 = nums2[j];
        if (count == mid2) val2 = nums2[j];
        j++;
        count++;
    }
    
    return (total % 2 == 1) ? val1 : (val1 + val2) / 2.0;
}
```
<!-- slide -->
```java
class Solution {
    public double twoPointersMedian(int[] nums1, int[] nums2) {
        int m = nums1.length, n = nums2.length;
        int total = m + n;
        int mid1 = total / 2;
        int mid2 = (total % 2 == 0) ? mid1 - 1 : -1;
        
        int i = 0, j = 0, count = 0;
        int val1 = 0, val2 = 0;
        
        while (i < m && j < n && count <= mid1) {
            if (nums1[i] < nums2[j]) {
                if (count == mid1) val1 = nums1[i];
                if (count == mid2) val2 = nums1[i];
                i++;
            } else {
                if (count == mid1) val1 = nums2[j];
                if (count == mid2) val2 = nums2[j];
                j++;
            }
            count++;
        }
        
        while (i < m && count <= mid1) {
            if (count == mid1) val1 = nums1[i];
            if (count == mid2) val2 = nums1[i];
            i++;
            count++;
        }
        
        while (j < n && count <= mid1) {
            if (count == mid1) val1 = nums2[j];
            if (count == mid2) val2 = nums2[j];
            j++;
            count++;
        }
        
        return (total % 2 == 1) ? val1 : (val1 + val2) / 2.0;
    }
}
```
<!-- slide -->
```javascript
function twoPointersMedian(nums1, nums2) {
    const m = nums1.length, n = nums2.length;
    const total = m + n;
    const mid1 = Math.floor(total / 2);
    const mid2 = (total % 2 === 0) ? mid1 - 1 : -1;
    
    let i = 0, j = 0, count = 0;
    let val1 = 0, val2 = 0;
    
    while (i < m && j < n && count <= mid1) {
        if (nums1[i] < nums2[j]) {
            if (count === mid1) val1 = nums1[i];
            if (count === mid2) val2 = nums1[i];
            i++;
        } else {
            if (count === mid1) val1 = nums2[j];
            if (count === mid2) val2 = nums2[j];
            j++;
        }
        count++;
    }
    
    while (i < m && count <= mid1) {
        if (count === mid1) val1 = nums1[i];
        if (count === mid2) val2 = nums1[i];
        i++;
        count++;
    }
    
    while (j < n && count <= mid1) {
        if (count === mid1) val1 = nums2[j];
        if (count === mid2) val2 = nums2[j];
        j++;
        count++;
    }
    
    return (total % 2 === 1) ? val1 : (val1 + val2) / 2;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(m + n) - Linear scan through arrays |
| Space | O(1) - No extra space for merging |

## Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| **Binary Search (Median)** | O(log min(m,n)) | O(1) | **Optimal** - Recommended |
| **Binary Search (Kth)** | O(log min(m,n)) | O(1) | **Optimal** for kth element |
| **Two Pointers** | O(m + n) | O(1) | Simple but linear time |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) | 4 | Hard | Find median of two sorted arrays |
| [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) | 378 | Medium | Find kth smallest in 2D sorted matrix |
| [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) | 295 | Hard | Median of a dynamic data stream |
| [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) | 230 | Medium | Find kth smallest in BST |
| [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) | 215 | Medium | Find kth largest using heap/quickselect |
| [Find K Pairs with Smallest Sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) | 373 | Medium | Find k pairs with smallest sums |
| [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) | 23 | Hard | Merge k sorted linked lists |

## Video Tutorial Links

1. **[LeetCode Median of Two Sorted Arrays](https://www.youtube.com/watch?v=q6IEA26hvXc)** - Comprehensive walkthrough
2. **[Median of Two Sorted Arrays Explained](https://www.youtube.com/watch?v=LPFhl65R7ww)** - Clear explanation
3. **[Binary Search Solution for Median](https://www.youtube.com/watch?v=ScCg9v921ns)** - Step-by-step solution
4. **[Kth Element in Two Sorted Arrays](https://www.youtube.com/watch?v=nvK2j7KBvF4)** - Kth element approach

## Summary

### Key Takeaways
- **Avoid merging** by using binary search on the smaller array
- **Achieves O(log min(m,n))** time complexity - optimal for this problem
- **Uses O(1)** extra space with boundary values (-∞, +∞)
- **Partition must satisfy**: all left elements ≤ all right elements
- **For median (odd)**: return max of left elements
- **For median (even)**: return average of max(left) and min(right)

### Common Pitfalls
- **Not swapping arrays**: Always binary search on the smaller array
- **Incorrect partition calculation**: Use `half = (total + 1) // 2`
- **Boundary value errors**: Use -∞ and +∞ correctly for edge cases
- **Off-by-one in kth element**: Remember k is 1-based, not 0-based
- **Integer vs float division**: Use `/2` not `//2` for median calculation

### Follow-up Questions
1. **How would you find the kth largest element?**
   - Answer: Find (m+n-k+1)th smallest element

2. **What if you have k sorted arrays instead of 2?**
   - Answer: Use a min-heap or divide-and-conquer approach

3. **How would you handle duplicate elements?**
   - Answer: Same approach works fine with duplicates

4. **Can you find the median without binary search?**
   - Answer: Yes, using two pointers O(m+n) or merging O(m+n)

## Pattern Source

[Median/Kth Across Two Sorted Arrays Pattern](patterns/binary-search-median-kth-across-two-sorted-arrays.md)
