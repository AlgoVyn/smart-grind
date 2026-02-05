# Binary Search - Median / Kth across Two Sorted Arrays

## Overview

This advanced binary search pattern is used to find the median or the kth smallest element across two sorted arrays. It leverages binary search to partition one array and find the correct split point, ensuring elements on the left are smaller than those on the right across both arrays. This approach achieves **O(log min(n,m))** time complexity, making it highly efficient for large arrays.

This pattern is particularly useful for:
- Finding the median in statistics when dealing with two sorted datasets
- Selecting kth elements in merged datasets without fully merging
- Solving problems that require order statistics across multiple sorted sources

## Problem Definition

Given two sorted arrays `nums1` and `nums2`, find:
1. **Median of Two Sorted Arrays**: The middle value of the combined sorted arrays
2. **Kth Smallest Element**: The kth smallest element in the combined sorted arrays

### Example: Median

**Input:** `nums1 = [1,3]`, `nums2 = [2]`
**Output:** `2.0`

**Input:** `nums1 = [1,2]`, `nums2 = [3,4]`
**Output:** `2.5`

### Example: Kth Element

**Input:** `nums1 = [2,3,6]`, `nums2 = [1,4,5,7,8]`, `k = 4`
**Output:** `5` (the 4th smallest element in [1,2,3,4,5,6,7,8])

---

## Intuition

The key insight is to **avoid merging the arrays** entirely. Instead, we find a "virtual partition" that splits both arrays such that:

1. **All elements in the left partition are ≤ all elements in the right partition**
2. **The total number of elements on the left equals (or is one more than) the right** (for median calculation)

### The Partition Concept

Imagine we could merge the two arrays into one sorted array. The median would be at position `(m+n+1)/2`. Instead of actually merging:

```
nums1 = [1, 3, 5, 7]
nums2 = [2, 4, 6, 8]

Virtual Partition (i=2, j=3):
nums1:  [1, 3 | 5, 7]
              ↑    ↑
            i-1   i

nums2:  [2, 4, 6 | 8]
                  ↑    ↑
                j-1   j

Left partition:  [1, 3, 2, 4, 6]  (5 elements)
Right partition: [5, 7, 8]       (3 elements)

All left ≤ All right ✓
```

### Why Binary Search Works

- We binary search on the **smaller array** to find the partition point
- Once we find the correct partition in one array, the partition in the other is determined mathematically
- We only need O(log min(m,n)) iterations

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Partitioning** | Divide one array at a point and find the corresponding partition in the second array |
| **Balance Condition** | Ensure all elements in the left partitions are ≤ all elements in the right partitions |
| **Median Calculation** | For median, the partition should balance the total elements (left has (m+n+1)/2 elements) |
| **Kth Element** | Adjust the partition to ensure exactly k-1 elements are on the left |
| **Boundary Values** | Use -∞ and +∞ to handle edge cases where partitions are at array boundaries |

---

## Approach 1: Binary Search for Median (Optimal)

This is the most efficient approach with **O(log min(m,n))** time complexity.

### Python Solution

````carousel
```python
from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
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
                    return (max(nums1_left, nums2_left) + min(nums1_right, nums2_right)) / 2  # Even: avg
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

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity** | O(log min(m,n)) |
| **Space Complexity** | O(1) |

---

## Approach 2: Binary Search for Kth Element

This approach finds the kth smallest element across two sorted arrays in **O(log min(m,n))** time.

### Python Solution

````carousel
```python
from typing import List

def find_kth_element(nums1: List[int], nums2: List[int], k: int) -> int:
    """
    Finds the kth smallest element in two sorted arrays.
    
    Args:
        nums1: First sorted list
        nums2: Second sorted list
        k: The kth position (1-based)
    
    Returns:
        The kth smallest element
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

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity** | O(log min(m,n)) |
| **Space Complexity** | O(1) |

---

## Approach 3: Brute Force Merge (Educational)

This approach merges both arrays and then finds the median. Simple but not optimal for large arrays.

### Python Solution

````carousel
```python
from typing import List

def merge_and_find_median(nums1: List[int], nums2: List[int]) -> float:
    """
    Merge two sorted arrays and find the median.
    Time: O(m+n), Space: O(m+n)
    """
    merged = []
    i = j = 0
    m, n = len(nums1), len(nums2)
    
    # Merge
    while i < m and j < n:
        if nums1[i] < nums2[j]:
            merged.append(nums1[i])
            i += 1
        else:
            merged.append(nums2[j])
            j += 1
    
    while i < m:
        merged.append(nums1[i])
        i += 1
    
    while j < n:
        merged.append(nums2[j])
        j += 1
    
    # Find median
    total = m + n
    if total % 2 == 1:
        return merged[total // 2]
    else:
        return (merged[total // 2 - 1] + merged[total // 2]) / 2
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

double merge_and_find_median(vector<int>& nums1, vector<int>& nums2) {
    vector<int> merged;
    merged.reserve(nums1.size() + nums2.size());
    
    int i = 0, j = 0;
    
    // Merge
    while (i < nums1.size() && j < nums2.size()) {
        if (nums1[i] < nums2[j]) {
            merged.push_back(nums1[i++]);
        } else {
            merged.push_back(nums2[j++]);
        }
    }
    
    while (i < nums1.size()) merged.push_back(nums1[i++]);
    while (j < nums2.size()) merged.push_back(nums2[j++]);
    
    // Find median
    int total = merged.size();
    if (total % 2 == 1) {
        return merged[total / 2];
    } else {
        return (merged[total / 2 - 1] + merged[total / 2]) / 2.0;
    }
}
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public double mergeAndFindMedian(int[] nums1, int[] nums2) {
        List<Integer> merged = new ArrayList<>();
        int i = 0, j = 0;
        
        // Merge
        while (i < nums1.length && j < nums2.length) {
            if (nums1[i] < nums2[j]) {
                merged.add(nums1[i++]);
            } else {
                merged.add(nums2[j++]);
            }
        }
        
        while (i < nums1.length) merged.add(nums1[i++]);
        while (j < nums2.length) merged.add(nums2[j++]);
        
        // Find median
        int total = merged.size();
        if (total % 2 == 1) {
            return merged.get(total / 2);
        } else {
            return (merged.get(total / 2 - 1) + merged.get(total / 2)) / 2.0;
        }
    }
}
```
<!-- slide -->
```javascript
function mergeAndFindMedian(nums1, nums2) {
    const merged = [];
    let i = 0, j = 0;
    
    // Merge
    while (i < nums1.length && j < nums2.length) {
        if (nums1[i] < nums2[j]) {
            merged.push(nums1[i++]);
        } else {
            merged.push(nums2[j++]);
        }
    }
    
    while (i < nums1.length) merged.push(nums1[i++]);
    while (j < nums2.length) merged.push(nums2[j++]);
    
    // Find median
    const total = merged.length;
    if (total % 2 === 1) {
        return merged[Math.floor(total / 2)];
    } else {
        return (merged[total / 2 - 1] + merged[total / 2]) / 2;
    }
}
```
````

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity** | O(m + n) |
| **Space Complexity** | O(m + n) |

---

## Approach 4: Two Pointers Without Full Merge

This optimized approach finds the middle elements without storing the entire merged array.

### Python Solution

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

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity** | O(m + n) |
| **Space Complexity** | O(1) |

---

## Complexity Comparison

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| **Binary Search (Median)** | O(log min(m,n)) | O(1) | Optimal for median |
| **Binary Search (Kth)** | O(log min(m,n)) | O(1) | Optimal for kth element |
| **Brute Force Merge** | O(m + n) | O(m + n) | Simple but uses extra space |
| **Two Pointers** | O(m + n) | O(1) | No extra space, but still linear |

---

## Common Pitfalls

1. **Not swapping arrays**: Always binary search on the smaller array for O(log min(m,n)) complexity

2. **Incorrect partition calculation**: 
   ```python
   # Correct: half includes the middle for odd totals
   half = (total + 1) // 2
   
   # Wrong: Would give wrong partition for odd totals
   half = total // 2
   ```

3. **Boundary value errors**: Use -∞ and +∞ correctly for edge cases
   - When partition is at start (i=0): use -∞ for left boundary
   - When partition is at end (i=m): use +∞ for right boundary

4. **Off-by-one in kth element**: Remember k is 1-based, not 0-based

5. **Integer vs float division**: Use `/2` not `//2` for median calculation

---

## Related Problems

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| **Median of Two Sorted Arrays** | [4. Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) | Hard | Find median of two sorted arrays |
| **Kth Smallest Element in a Sorted Matrix** | [378. Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) | Medium | Find kth smallest in 2D sorted matrix |
| **Find Median from Data Stream** | [295. Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) | Hard | Median of a dynamic data stream |
| **Kth Smallest Element in a BST** | [230. Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) | Medium | Find kth smallest in BST |
| **Kth Largest Element in an Array** | [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Medium | Find kth largest using heap/quickselect |
| **Find K Pairs with Smallest Sums** | [373. Find K Pairs with Smallest Sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) | Medium | Find k pairs with smallest sums |
| **Merge k Sorted Lists** | [23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) | Hard | Merge k sorted linked lists |
| **Smallest Range Covering Elements from k Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/) | Hard | Find smallest range covering all lists |

---

## Video Tutorials

1. **[LeetCode Median of Two Sorted Arrays - Binary Search Approach](https://www.youtube.com/watch?v=q6IEA26hvXc)** - Comprehensive walkthrough
2. **[Median of Two Sorted Arrays Explained](https://www.youtube.com/watch?v=LPFhl65R7ww)** - Clear explanation
3. **[Binary Search Solution for Median](https://www.youtube.com/watch?v=ScCg9v921ns)** - Step-by-step solution
4. **[Kth Element in Two Sorted Arrays](https://www.youtube.com/watch?v=nvK2j7KBvF4)** - Kth element approach

---

## Summary

The Binary Search approach for finding median/kth elements across two sorted arrays is an elegant solution that:

1. **Avoids merging** by using binary search on the smaller array
2. **Achieves O(log min(m,n))** time complexity - optimal for this problem
3. **Uses O(1)** extra space
4. **Handles edge cases** through boundary values

Key takeaways:
- Always binary search on the smaller array
- Use boundary values (-∞, +∞) for edge cases
- The partition must satisfy: all left elements ≤ all right elements
- For median (odd): return max of left elements
- For median (even): return average of max(left) and min(right)
