# Median Of Two Sorted Arrays

## Problem Description

Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the **median** of the two sorted arrays.

The overall run time complexity should be `O(log (m+n))`.

The **median** is the middle value in a sorted list. If the list has an even number of elements, the median is the average of the two middle values.

### Example 1

**Input:** `nums1 = [1,3]`, `nums2 = [2]`

**Output:** `2.00000`

**Explanation:** Merged array = `[1,2,3]` and median is `2`.

### Example 2

**Input:** `nums1 = [1,2]`, `nums2 = [3,4]`

**Output:** `2.50000`

**Explanation:** Merged array = `[1,2,3,4]` and median is `(2 + 3) / 2 = 2.5`.

### Example 3

**Input:** `nums1 = [1,3,5,7]`, `nums2 = [2,4,6,8]`

**Output:** `4.50000`

**Explanation:** Merged array = `[1,2,3,4,5,6,7,8]` and median is `(4 + 5) / 2 = 4.5`.

### Constraints

- `nums1.length == m`
- `nums2.length == n`
- `0 <= m <= 1000`
- `0 <= n <= 1000`
- `1 <= m + n <= 2000`
- `-10^6 <= nums1[i], nums2[i] <= 10^6`

---

## Intuition

The median of a sorted array divides it into two equal parts. For two sorted arrays, the goal is to find a partition that divides both arrays such that:

1. **All elements on the left are ≤ all elements on the right**
2. **The number of elements on the left equals or is one more than on the right** (for odd totals)

This allows us to find the median without merging the entire arrays, achieving logarithmic time complexity.

### Key Insight

Instead of merging both arrays (which takes O(m+n) time), we can use **binary search** to find the correct partition point. The key observation is:

- If we find a partition point `i` in `nums1` and `j` in `nums2` such that:
  - `nums1[i-1] ≤ nums2[j]` (last element on left from nums1 ≤ first element on right from nums2)
  - `nums2[j-1] ≤ nums1[i]` (last element on left from nums2 ≤ first element on right from nums1)

Then we can directly compute the median without merging!

---

## Approach 1: Binary Search (Optimal - Iterative)

This is the most efficient approach with O(log(min(m,n))) time complexity.

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
        half = (total + 1) // 2
        
        left, right = 0, m
        
        while left <= right:
            i = (left + right) // 2  # partition in nums1
            j = half - i  # partition in nums2
            
            # Get boundary values, using infinity for out-of-bounds
            nums1_left = nums1[i-1] if i > 0 else float('-inf')
            nums1_right = nums1[i] if i < m else float('inf')
            nums2_left = nums2[j-1] if j > 0 else float('-inf')
            nums2_right = nums2[j] if j < n else float('inf')
            
            # Check if we found the correct partition
            if nums1_left <= nums2_right and nums2_left <= nums1_right:
                if total % 2 == 1:
                    return max(nums1_left, nums2_left)
                else:
                    return (max(nums1_left, nums2_left) + min(nums1_right, nums2_right)) / 2
            elif nums1_left > nums2_right:
                right = i - 1  # Need to move left in nums1
            else:
                left = i + 1  # Need to move right in nums1
        
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

### Explanation

1. **Ensure `nums1` is the smaller array** for efficiency in binary search
2. **Binary search on `nums1`:** Find the correct partition `i` such that the left partition has `(m+n+1)/2` elements
3. **Calculate partition for `nums2`:** `j = half - i`
4. **Check partition validity:** `nums1[i-1] <= nums2[j]` and `nums2[j-1] <= nums1[i]`
5. **Calculate median:**
   - For odd total: median is `max` of left elements
   - For even total: median is `average` of `max` left and `min` right
6. **Adjust search:** If `nums1[i-1] > nums2[j]`, search left; else, search right

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity** | O(log(min(m,n))) - binary search on the smaller array |
| **Space Complexity** | O(1) - using only a few variables |

### Why This Works: Deep Dive

The key insight behind this binary search solution is treating the problem as finding a **partition point** rather than explicitly merging arrays.

**The Median Property:**
For any sorted array of length L, the median position is at index L/2 (0-indexed). The median splits the array into two equal halves where:
- All elements in the left half ≤ all elements in the right half

**Extending to Two Arrays:**
When we have two sorted arrays, we need to find a partition in each array such that:
1. The total number of elements on the left equals the total on the right (or differs by 1)
2. All elements in the left partition ≤ all elements in the right partition

**The Magic of Partitioning:**
If we denote:
- `i` = number of elements taken from `nums1` for the left partition
- `j` = number of elements taken from `nums2` for the left partition

Then we need: `i + j = (m + n + 1) // 2` (for odd totals) or the floor of half for even.

The conditions for a valid partition are:
- `nums1[i-1] ≤ nums2[j]` - last element of left partition from nums1 ≤ first element of right partition from nums2
- `nums2[j-1] ≤ nums1[i]` - last element of left partition from nums2 ≤ first element of right partition from nums1

If both conditions are true, we've found the correct partition and can compute the median directly.

### Step-by-Step Example

Let's walk through `nums1 = [1, 3]` and `nums2 = [2, 4]`:

**Step 1: Ensure nums1 is smaller (already true)**
```
nums1 = [1, 3]    # m = 2
nums2 = [2, 4]    # n = 2
```

**Step 2: Initialize binary search**
```
left = 0, right = 2
half = (2 + 2 + 1) // 2 = 2
```

**Step 3: First iteration**
```
i = (0 + 2) // 2 = 1
j = 2 - 1 = 1

nums1_left  = nums1[0] = 1
nums1_right = nums1[1] = 3
nums2_left  = nums2[0] = 2
nums2_right = nums2[1] = 4

Check: nums1_left (1) ≤ nums2_right (4)? ✓
Check: nums2_left (2) ≤ nums1_right (3)? ✓

Valid partition found! Total is even, so median = (max left + min right) / 2
max(left) = max(1, 2) = 2
min(right) = min(3, 4) = 3
median = (2 + 3) / 2 = 2.5
```

### Partition Logic Visualization

```
nums1 = [1, 3, 5, 7]
nums2 = [2, 4, 6, 8]

After finding partition i=2, j=3:

nums1:  [1, 3 | 5, 7]
             ↑    ↑
           i-1   i

nums2:  [2, 4, 6 | 8]
                  ↑    ↑
                j-1   j

Left partition:  [1, 3, 2, 4, 6]
Right partition: [5, 7, 8]

All left ≤ All right ✓
Count: left = 5, right = 3 (for odd total of 8)
```

### Why We Swap Arrays

We swap arrays to ensure `nums1` is the smaller one. This is crucial for efficiency:

1. **Binary Search Range:** We binary search on `nums1`, so the search range is `[0, m]`. If we searched on the larger array, we'd have more iterations.

2. **Proof:**
   - Without swap: O(log(max(m,n)))
   - With swap: O(log(min(m,n)))
   
   Since log(min(m,n)) ≤ log(max(m,n)), this optimization is always beneficial.

3. **Edge Case Handling:** When one array is much smaller than the other, swapping ensures we don't have empty partitions on one side during binary search.

### Boundary Conditions and Edge Cases

**Case 1: Empty array in partition**
```python
nums1_left = nums1[i-1] if i > 0 else float('-inf')
```
When `i = 0`, there's no element to the left of the partition in `nums1`. We use `-∞` to ensure the condition `nums1_left ≤ nums2_right` always passes.

**Case 2: Entire array in left partition**
```python
nums1_right = nums1[i] if i < m else float('inf')
```
When `i = m`, there's no element to the right of the partition in `nums1`. We use `+∞` to ensure the condition `nums2_left ≤ nums1_right` always passes.

**Case 3: Odd vs Even total**
- **Odd total:** Median is the maximum of all left elements (the last element of the combined left partition)
- **Even total:** Median is the average of max(left) and min(right)

### Common Pitfalls

**1. Off-by-one errors in partition calculation**
```python
# Correct: half includes the middle element for odd totals
half = (total + 1) // 2

# Wrong: Would give wrong partition for odd totals
half = total // 2
```

**2. Incorrect boundary values**
Using `None` or `float('inf')` incorrectly can cause comparison failures. Always use:
- `-float('inf')` for non-existent left boundary
- `+float('inf')` for non-existent right boundary

**3. Not swapping arrays when nums1 is larger**
This causes the binary search to run on the wrong array, increasing time complexity.

**4. Integer division vs float division**
```python
# For Python 3, use true division for median
return (max(left) + min(right)) / 2  # Correct
# return (max(left) + min(right)) // 2  # Wrong - integer division
```

**5. Forgetting to handle empty arrays**
The algorithm naturally handles empty arrays due to boundary conditions, but edge cases like `nums1 = []` and `nums2 = [1]` work correctly because `i = 0` and `j = 1`, giving `nums1_left = -inf`, `nums1_right = inf`, `nums2_left = 1`, `nums2_right = inf`.

### Time Complexity Derivation

The binary search runs on the smaller array of size `min(m, n)`:

1. **Initial search space:** `[0, m]` where `m = min(len(nums1), len(nums2))`
2. **Each iteration:** Reduces search space by half
3. **Number of iterations:** `⌈log₂(m + 1)⌉` ≈ `O(log m)`

Since `m = min(m, n)`, the time complexity is `O(log(min(m, n)))`.

---

## Approach 2: Binary Search (Recursive)

The recursive binary search approach follows the same logic as the iterative version but uses recursion instead of a loop.

### Python Solution

````carousel
```python
from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        
        m, n = len(nums1), len(nums2)
        total = m + n
        
        return self._find_median(nums1, nums2, 0, m, total)
    
    def _find_median(self, nums1: List[int], nums2: List[int], left: int, right: int, total: int) -> float:
        if left > right:
            raise ValueError("Input arrays are not sorted")
            
        i = (left + right) // 2
        j = (total + 1) // 2 - i
        
        nums1_left = nums1[i-1] if i > 0 else float('-inf')
        nums1_right = nums1[i] if i < len(nums1) else float('inf')
        nums2_left = nums2[j-1] if j > 0 else float('-inf')
        nums2_right = nums2[j] if j < len(nums2) else float('inf')
        
        if nums1_left <= nums2_right and nums2_left <= nums1_right:
            if total % 2 == 1:
                return max(nums1_left, nums2_left)
            else:
                return (max(nums1_left, nums2_left) + min(nums1_right, nums2_right)) / 2
        elif nums1_left > nums2_right:
            return self._find_median(nums1, nums2, left, i - 1, total)
        else:
            return self._find_median(nums1, nums2, i + 1, right, total)
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
private:
    double findMedianHelper(const vector<int>& nums1, const vector<int>& nums2, 
                            int left, int right, int total) {
        if (left > right) {
            throw invalid_argument("Input arrays are not sorted");
        }
        
        int i = (left + right) / 2;
        int j = (total + 1) / 2 - i;
        
        int nums1_left = (i > 0) ? nums1[i-1] : INT_MIN;
        int nums1_right = (i < nums1.size()) ? nums1[i] : INT_MAX;
        int nums2_left = (j > 0) ? nums2[j-1] : INT_MIN;
        int nums2_right = (j < nums2.size()) ? nums2[j] : INT_MAX;
        
        if (nums1_left <= nums2_right && nums2_left <= nums1_right) {
            if (total % 2 == 1) {
                return max(nums1_left, nums2_left);
            } else {
                return (max(nums1_left, nums2_left) + min(nums1_right, nums2_right)) / 2.0;
            }
        } else if (nums1_left > nums2_right) {
            return findMedianHelper(nums1, nums2, left, i - 1, total);
        } else {
            return findMedianHelper(nums1, nums2, i + 1, right, total);
        }
    }
    
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        if (nums1.size() > nums2.size()) {
            nums1.swap(nums2);
        }
        
        int total = nums1.size() + nums2.size();
        return findMedianHelper(nums1, nums2, 0, nums1.size(), total);
    }
};
```
<!-- slide -->
```java
class Solution {
    private double findMedianHelper(int[] nums1, int[] nums2, int left, int right, int total) {
        if (left > right) {
            throw new IllegalArgumentException("Input arrays are not sorted");
        }
        
        int i = (left + right) / 2;
        int j = (total + 1) / 2 - i;
        
        int nums1_left = (i > 0) ? nums1[i-1] : Integer.MIN_VALUE;
        int nums1_right = (i < nums1.length) ? nums1[i] : Integer.MAX_VALUE;
        int nums2_left = (j > 0) ? nums2[j-1] : Integer.MIN_VALUE;
        int nums2_right = (j < nums2.length) ? nums2[j] : Integer.MAX_VALUE;
        
        if (nums1_left <= nums2_right && nums2_left <= nums1_right) {
            if (total % 2 == 1) {
                return Math.max(nums1_left, nums2_left);
            } else {
                return (Math.max(nums1_left, nums2_left) + Math.min(nums1_right, nums2_right)) / 2.0;
            }
        } else if (nums1_left > nums2_right) {
            return findMedianHelper(nums1, nums2, left, i - 1, total);
        } else {
            return findMedianHelper(nums1, nums2, i + 1, right, total);
        }
    }
    
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) {
            int[] temp = nums1;
            nums1 = nums2;
            nums2 = temp;
        }
        
        int total = nums1.length + nums2.length;
        return findMedianHelper(nums1, nums2, 0, nums1.length, total);
    }
}
```
<!-- slide -->
```javascript
var findMedianSortedArrays = function(nums1, nums2) {
    if (nums1.length > nums2.length) {
        [nums1, nums2] = [nums2, nums1];
    }
    
    const total = nums1.length + nums2.length;
    
    return findMedianHelper(nums1, nums2, 0, nums1.length, total);
};

function findMedianHelper(nums1, nums2, left, right, total) {
    if (left > right) {
        throw new Error("Input arrays are not sorted");
    }
    
    const i = Math.floor((left + right) / 2);
    const j = Math.floor((total + 1) / 2) - i;
    
    const nums1_left = (i > 0) ? nums1[i - 1] : -Infinity;
    const nums1_right = (i < nums1.length) ? nums1[i] : Infinity;
    const nums2_left = (j > 0) ? nums2[j - 1] : -Infinity;
    const nums2_right = (j < nums2.length) ? nums2[j] : Infinity;
    
    if (nums1_left <= nums2_right && nums2_left <= nums1_right) {
        if (total % 2 === 1) {
            return Math.max(nums1_left, nums2_left);
        } else {
            return (Math.max(nums1_left, nums2_left) + Math.min(nums1_right, nums2_right)) / 2;
        }
    } else if (nums1_left > nums2_right) {
        return findMedianHelper(nums1, nums2, left, i - 1, total);
    } else {
        return findMedianHelper(nums1, nums2, i + 1, right, total);
    }
}
```
````

### Explanation

The recursive binary search approach follows the same logic as the iterative version but uses recursion instead of a loop:

1. **Recursive function call** instead of a while loop
2. **Base case check** for left > right
3. **Recursive calls** to adjust the search space

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity** | O(log(min(m,n))) - same as iterative approach |
| **Space Complexity** | O(log(min(m,n))) - due to recursion stack depth |

---

## Approach 3: Merge and Find Median (Brute Force)

This approach merges both arrays and then finds the median. Simple but not optimal for large arrays.

### Python Solution

````carousel
```python
from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        merged = []
        i = j = 0
        m, n = len(nums1), len(nums2)
        
        # Merge the two sorted arrays
        while i < m and j < n:
            if nums1[i] < nums2[j]:
                merged.append(nums1[i])
                i += 1
            else:
                merged.append(nums2[j])
                j += 1
        
        # Add remaining elements
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
            mid1 = merged[total // 2 - 1]
            mid2 = merged[total // 2]
            return (mid1 + mid2) / 2
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        vector<int> merged;
        merged.reserve(nums1.size() + nums2.size());
        
        int i = 0, j = 0;
        int m = nums1.size(), n = nums2.size();
        
        // Merge the two sorted arrays
        while (i < m && j < n) {
            if (nums1[i] < nums2[j]) {
                merged.push_back(nums1[i]);
                i++;
            } else {
                merged.push_back(nums2[j]);
                j++;
            }
        }
        
        // Add remaining elements
        while (i < m) {
            merged.push_back(nums1[i]);
            i++;
        }
        
        while (j < n) {
            merged.push_back(nums2[j]);
            j++;
        }
        
        // Find median
        int total = m + n;
        if (total % 2 == 1) {
            return merged[total / 2];
        } else {
            double mid1 = merged[total / 2 - 1];
            double mid2 = merged[total / 2];
            return (mid1 + mid2) / 2;
        }
    }
};
```
<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        List<Integer> merged = new ArrayList<>();
        
        int i = 0, j = 0;
        int m = nums1.length, n = nums2.length;
        
        // Merge the two sorted arrays
        while (i < m && j < n) {
            if (nums1[i] < nums2[j]) {
                merged.add(nums1[i]);
                i++;
            } else {
                merged.add(nums2[j]);
                j++;
            }
        }
        
        // Add remaining elements
        while (i < m) {
            merged.add(nums1[i]);
            i++;
        }
        
        while (j < n) {
            merged.add(nums2[j]);
            j++;
        }
        
        // Find median
        int total = m + n;
        if (total % 2 == 1) {
            return merged.get(total / 2);
        } else {
            double mid1 = merged.get(total / 2 - 1);
            double mid2 = merged.get(total / 2);
            return (mid1 + mid2) / 2;
        }
    }
}
```
<!-- slide -->
```javascript
var findMedianSortedArrays = function(nums1, nums2) {
    const merged = [];
    let i = 0, j = 0;
    const m = nums1.length, n = nums2.length;
    
    // Merge the two sorted arrays
    while (i < m && j < n) {
        if (nums1[i] < nums2[j]) {
            merged.push(nums1[i]);
            i++;
        } else {
            merged.push(nums2[j]);
            j++;
        }
    }
    
    // Add remaining elements
    while (i < m) {
        merged.push(nums1[i]);
        i++;
    }
    
    while (j < n) {
        merged.push(nums2[j]);
        j++;
    }
    
    // Find median
    const total = m + n;
    if (total % 2 === 1) {
        return merged[Math.floor(total / 2)];
    } else {
        const mid1 = merged[total / 2 - 1];
        const mid2 = merged[total / 2];
        return (mid1 + mid2) / 2;
    }
};
```
````

### Explanation

1. **Merge the two sorted arrays** using the standard two-pointer technique
2. **Find the median** in the merged array:
   - For odd length: middle element
   - For even length: average of the two middle elements

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity** | O(m + n) - merging both arrays |
| **Space Complexity** | O(m + n) - storing the merged array |

---

## Approach 4: Two Pointers Without Merging (Optimized Brute Force)

This approach finds the middle elements without storing the entire merged array.

### Python Solution

````carousel
```python
from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        m, n = len(nums1), len(nums2)
        total = m + n
        mid1 = total // 2
        mid2 = mid1 - 1 if total % 2 == 0 else -1
        
        i = j = count = 0
        val1 = val2 = 0
        
        while i < m and j < n and count <= mid1:
            if nums1[i] < nums2[j]:
                if count == mid1:
                    val1 = nums1[i]
                if count == mid2:
                    val2 = nums1[i]
                i += 1
            else:
                if count == mid1:
                    val1 = nums2[j]
                if count == mid2:
                    val2 = nums2[j]
                j += 1
            count += 1
        
        while i < m and count <= mid1:
            if count == mid1:
                val1 = nums1[i]
            if count == mid2:
                val2 = nums1[i]
            i += 1
            count += 1
        
        while j < n and count <= mid1:
            if count == mid1:
                val1 = nums2[j]
            if count == mid2:
                val2 = nums2[j]
            j += 1
            count += 1
        
        return val1 if total % 2 == 1 else (val1 + val2) / 2
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
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
};
```
<!-- slide -->
```java
class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
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
var findMedianSortedArrays = function(nums1, nums2) {
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
};
```
````

### Explanation

1. **Find the required positions** without merging the entire arrays
2. **Track the middle elements** using two pointers
3. **Stop early** once we've found the necessary elements

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity** | O(m + n), but stops early once middle elements are found |
| **Space Complexity** | O(1) - using only a few variables |

---

## Related Problems

| Problem | Difficulty | Description |
|---------|------------|-------------|
| **[Median of Two Sorted Arrays](/solutions/median-of-two-sorted-arrays.md)** | Hard | Find median of two sorted arrays (this problem) |
| **[Find Median from Data Stream](/solutions/find-median-from-data-stream.md)** | Hard | Median of a dynamic data stream |
| **[Kth Smallest Element in a Sorted Matrix](/solutions/kth-smallest-element-in-a-sorted-matrix.md)** | Medium | Kth smallest in a 2D sorted matrix |
| **[Merge K Sorted Lists](/solutions/merge-k-sorted-lists.md)** | Hard | Merging multiple sorted lists |
| **[Find K Pairs with Smallest Sums](/solutions/find-k-pairs-with-smallest-sums.md)** | Medium | Finding pairs from two sorted arrays |
| **[Kth Smallest Element in a BST](/solutions/kth-smallest-element-in-a-bst.md)** | Medium | Kth smallest in a binary search tree |

### LeetCode Related Problems

1. **[4. Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/)** - Hard
2. **[295. Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/)** - Hard
3. **[378. Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)** - Medium
4. **[230. Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)** - Medium
5. **[215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)** - Medium
6. **[373. Find K Pairs with Smallest Sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/)** - Medium
7. **[23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)** - Hard

---

## Followup Questions

### 1. How would you handle the case where one of the arrays is empty?

If one array is empty, the median is simply the median of the non-empty array. We can check if either array length is 0 and return the median of the other array directly. For example, if `nums1 = []` and `nums2 = [1, 2, 3]`, the median is `2`.

### 2. What if the arrays contain duplicate elements?

Duplicates are handled naturally by the binary search approach since the partitioning logic works the same way. We still check if left elements are ≤ right elements regardless of duplicates. The algorithm correctly identifies the partition where all left elements are ≤ all right elements.

### 3. How to generalize this approach to find the kth smallest element in two sorted arrays?

Instead of partitioning for the median position, we partition to find the position where there are exactly k-1 elements on the left side of the partition. This is a common extension of the median finding problem. We can use a similar binary search approach to find the kth element in O(log(min(m,n))) time.

### 4. What if the arrays are very large and can't fit into memory?

For very large arrays, we can use external sorting or modified binary search that reads only the necessary elements from disk. However, this complicates the implementation significantly. Alternatively, we can use a streaming approach where we only track the middle elements without loading the entire arrays into memory.

### 5. How would you handle the case where the arrays are sorted in descending order?

We can either reverse the arrays first (O(m+n) time) or modify the binary search conditions to work with descending order. The latter approach is more efficient as it avoids the extra memory and time for reversal. We would swap the comparison operators to `>=` instead of `<=`.

### 6. Can this approach be extended to find multiple medians (e.g., for streaming data)?

For streaming data where medians need to be found at multiple points, we can use a two-heap approach (min-heap for the upper half and max-heap for the lower half). This allows O(log n) insertion and O(1) median retrieval.

### 7. How would you modify the algorithm for weighted median where elements have different weights?

For weighted median, we need to track cumulative weights instead of element counts. The partition would be based on the total weight reaching half of the sum of all weights, rather than half the number of elements.

---

## Video Tutorials

1. **[LeetCode Median of Two Sorted Arrays - Binary Search Approach](https://www.youtube.com/watch?v=q6IEA26hvXc)** - Comprehensive walkthrough
2. **[Median of Two Sorted Arrays Explained](https://www.youtube.com/watch?v=LPFhl65R7ww)** - Clear explanation
3. **[Binary Search Solution for Median of Two Sorted Arrays](https://www.youtube.com/watch?v=ScCg9v921ns)** - Step-by-step solution

---

## Complexity Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Description |
|----------|-----------------|------------------|-------------|
| **Binary Search (Iterative)** | O(log(min(m,n))) | O(1) | Most efficient, optimal for large arrays |
| **Binary Search (Recursive)** | O(log(min(m,n))) | O(log(min(m,n))) | Same logic as iterative, uses recursion stack |
| **Merge and Find** | O(m + n) | O(m + n) | Simple to implement, uses extra space |
| **Two Pointers Without Merging** | O(m + n) | O(1) | Optimized brute force, no extra space |

---

## Summary

The **Median of Two Sorted Arrays** problem is a classic algorithmic challenge that tests understanding of binary search and partitioning. The optimal solution uses binary search to find the correct partition point without merging the arrays, achieving O(log(min(m,n))) time complexity.

Key takeaways:
- Always ensure binary search is performed on the smaller array
- Use boundary values (-∞ and +∞) to handle edge cases
- The partition must satisfy: all left elements ≤ all right elements
- For odd total: median is max of left elements
- For even total: median is average of max left and min right

The binary search approach is elegant because it:
1. Avoids the O(m+n) merge operation
2. Achieves the optimal O(log(min(m,n))) time complexity
3. Uses only O(1) extra space
4. Naturally handles edge cases like empty arrays and unequal lengths
