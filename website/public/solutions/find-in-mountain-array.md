# Find In Mountain Array

## Problem Description

(This problem is an interactive problem.)
You may recall that an array arr is a mountain array if and only if:

- arr.length >= 3
- There exists some i with 0 < i < arr.length - 1 such that:
  - arr[0] < arr[1] < ... < arr[i - 1] < arr[i]
  - arr[i] > arr[i + 1] > ... > arr[arr.length - 1]

Given a mountain array mountainArr, return the minimum index such that mountainArr.get(index) == target. If such an index does not exist, return -1.
You cannot access the mountain array directly. You may only access the array using a MountainArray interface:

- MountainArray.get(k) returns the element of the array at index k (0-indexed).
- MountainArray.length() returns the length of the array.

Submissions making more than 100 calls to MountainArray.get will be judged Wrong Answer. Also, any solutions that attempt to circumvent the judge will result in disqualification.

---

## Constraints

- 3 <= mountainArr.length() <= 104
- 0 <= target <= 109
- 0 <= mountainArr.get(index) <= 109

---

## Examples

### Example 1

**Input:**
```
mountainArr = [1,2,3,4,5,3,1], target = 3
```

**Output:**
```
2
```

**Explanation:**
3 exists in the array, at index=2 and index=5. Return the minimum index, which is 2.

---

## Example 2

**Input:**
```
mountainArr = [0,1,2,4,2,1], target = 3
```

**Output:**
```
-1
```

**Explanation:**
3 does not exist in the array, so we return -1.

---

## Intuition

The key insight for solving this problem is understanding the structure of a mountain array:

1. **Mountain Array Structure**: A mountain array has three distinct regions:
   - Strictly increasing (left of peak)
   - Peak element (maximum)
   - Strictly decreasing (right of peak)

2. **Search Strategy**: Since both the increasing and decreasing parts are sorted, we can use binary search on each region:
   - First find the peak index
   - Then search the increasing region
   - If not found, search the decreasing region

3. **Why Binary Search Works**: The monotonic nature of each region (strictly increasing or strictly decreasing) guarantees that binary search will find the target efficiently.

---

## Pattern: Binary Search on Mountain Array

This problem demonstrates the **Binary Search on Mountain Array** pattern, which involves finding a peak element and then performing binary search on both the increasing and decreasing portions of the array.

### Core Concept

The key insight is that a mountain array has three distinct regions:
1. **Strictly increasing region** (left of peak)
2. **Peak element** (maximum)
3. **Strictly decreasing region** (right of peak)

By finding the peak first using binary search, we can then search for the target in both regions.

---

## Multiple Approaches with Code

We'll cover two main approaches:

1. **Binary Search with Peak Finding** - Optimal O(log N) time
2. **Linear Scan with Early Termination** - O(N) time (not optimal but works)

---

## Approach 1: Binary Search with Peak Finding (Optimal)

This is the most efficient approach with O(log N) time complexity. We first find the peak using binary search, then search in the increasing and decreasing portions.

### Algorithm Steps

1. **Find the peak index** using binary search:
   - Compare mid element with mid+1
   - If arr[mid] < arr[mid+1], peak is on the right
   - Otherwise, peak is at mid or to the left
   
2. **Binary search in increasing region**:
   - Search from 0 to peak
   - Standard binary search for ascending array
   
3. **Binary search in decreasing region**:
   - Search from peak to n-1
   - Modified binary search for descending array

### Why It Works

The mountain array's structure guarantees that searching the increasing region first will find the minimum index where target exists, as required by the problem.

### Code Implementation

````carousel
```python
# """
# This is MountainArray's API interface.
# You should not implement it, or speculate about its implementation
# """
# class MountainArray:
#     def get(self, index: int) -> int:
#     def length(self) -> int:

class Solution:
    def findInMountainArray(self, target: int, mountain_arr: 'MountainArray') -> int:
        n = mountain_arr.length()
        
        # Find the peak index using binary search
        l, r = 0, n - 1
        while l < r:
            m = (l + r) // 2
            if mountain_arr.get(m) < mountain_arr.get(m + 1):
                l = m + 1
            else:
                r = m
        peak = l
        
        # Binary search in increasing part
        def bin_search(left, right, is_increasing):
            while left <= right:
                m = (left + right) // 2
                val = mountain_arr.get(m)
                if val == target:
                    return m
                if is_increasing:
                    if val < target:
                        left = m + 1
                    else:
                        right = m - 1
                else:
                    if val > target:
                        left = m + 1
                    else:
                        right = m - 1
            return -1
        
        # Search left (increasing) part first
        result = bin_search(0, peak, True)
        if result != -1:
            return result
        
        # Search right (decreasing) part
        return bin_search(peak, n - 1, False)
```

<!-- slide -->
```cpp
/**
 * // This is the MountainArray's API interface.
 * // You should not implement it, or speculate about its implementation
 * class MountainArray {
 * public:
 *     int get(int index);
 *     int length();
 * };
 */

class Solution {
public:
    int findInMountainArray(int target, MountainArray &mountainArr) {
        int n = mountainArr.length();
        
        // Find the peak index using binary search
        int l = 0, r = n - 1;
        while (l < r) {
            int m = (l + r) / 2;
            if (mountainArr.get(m) < mountainArr.get(m + 1)) {
                l = m + 1;
            } else {
                r = m;
            }
        }
        int peak = l;
        
        // Binary search in increasing part
        auto binSearch = [&](int left, int right, bool isIncreasing) -> int {
            while (left <= right) {
                int m = (left + right) / 2;
                int val = mountainArr.get(m);
                if (val == target) return m;
                if (isIncreasing) {
                    if (val < target) left = m + 1;
                    else right = m - 1;
                } else {
                    if (val > target) left = m + 1;
                    else right = m - 1;
                }
            }
            return -1;
        };
        
        // Search left (increasing) part first
        int result = binSearch(0, peak, true);
        if (result != -1) return result;
        
        // Search right (decreasing) part
        return binSearch(peak, n - 1, false);
    }
};
```

<!-- slide -->
```java
/**
 * // This is the MountainArray's API interface.
 * // You should not implement it, or speculate about its implementation
 * class MountainArray {
 *     public int get(int index);
 *     public int length();
 * }
 */

class Solution {
    public int findInMountainArray(int target, MountainArray mountainArr) {
        int n = mountainArr.length();
        
        // Find the peak index using binary search
        int l = 0, r = n - 1;
        while (l < r) {
            int m = (l + r) / 2;
            if (mountainArr.get(m) < mountainArr.get(m + 1)) {
                l = m + 1;
            } else {
                r = m;
            }
        }
        int peak = l;
        
        // Search left (increasing) part first
        int result = binarySearch(0, peak, target, mountainArr, true);
        if (result != -1) return result;
        
        // Search right (decreasing) part
        return binarySearch(peak, n - 1, target, mountainArr, false);
    }
    
    private int binarySearch(int left, int right, int target, 
                           MountainArray mountainArr, boolean isIncreasing) {
        while (left <= right) {
            int m = (left + right) / 2;
            int val = mountainArr.get(m);
            
            if (val == target) return m;
            
            if (isIncreasing) {
                if (val < target) left = m + 1;
                else right = m - 1;
            } else {
                if (val > target) left = m + 1;
                else right = m - 1;
            }
        }
        return -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * // This is the MountainArray's API interface.
 * // You should not implement it, or speculate about its implementation
 * class MountainArray {
 *     get(index) {}
 *     length() {}
 * }
 */

var findInMountainArray = function(target, mountainArr) {
    const n = mountainArr.length();
    
    // Find the peak index using binary search
    let l = 0, r = n - 1;
    while (l < r) {
        const m = Math.floor((l + r) / 2);
        if (mountainArr.get(m) < mountainArr.get(m + 1)) {
            l = m + 1;
        } else {
            r = m;
        }
    }
    const peak = l;
    
    // Binary search helper function
    const binarySearch = (left, right, isIncreasing) => {
        while (left <= right) {
            const m = Math.floor((left + right) / 2);
            const val = mountainArr.get(m);
            
            if (val === target) return m;
            
            if (isIncreasing) {
                if (val < target) left = m + 1;
                else right = m - 1;
            } else {
                if (val > target) left = m + 1;
                else right = m - 1;
            }
        }
        return -1;
    };
    
    // Search left (increasing) part first
    const result = binarySearch(0, peak, true);
    if (result !== -1) return result;
    
    // Search right (decreasing) part
    return binarySearch(peak, n - 1, false);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log N) - Peak finding + two binary searches |
| **Space** | O(1) - Only uses a constant number of variables |

---

## Approach 2: Linear Scan with Early Termination

A simpler but less efficient approach that scans the array sequentially.

### Algorithm Steps

1. **Find peak** by scanning until arr[i] > arr[i+1]
2. **Search increasing region** from start to peak
3. **Search decreasing region** from peak to end

### Why It Works

The linear scan finds the peak and then searches both regions, guaranteeing the correct answer.

### Code Implementation

````carousel
```python
class Solution:
    def findInMountainArray_linear(self, target: int, mountain_arr: 'MountainArray') -> int:
        n = mountain_arr.length()
        
        # Find the peak
        peak = 0
        for i in range(n - 1):
            if mountain_arr.get(i) > mountain_arr.get(i + 1):
                peak = i
                break
        
        # Search in increasing part
        for i in range(peak + 1):
            val = mountain_arr.get(i)
            if val == target:
                return i
            if val > target:
                break
        
        # Search in decreasing part
        for i in range(peak, n):
            val = mountain_arr.get(i)
            if val == target:
                return i
            if val < target:
                break
        
        return -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int findInMountainArray(int target, MountainArray &mountainArr) {
        int n = mountainArr.length();
        
        // Find the peak
        int peak = 0;
        for (int i = 0; i < n - 1; i++) {
            if (mountainArr.get(i) > mountainArr.get(i + 1)) {
                peak = i;
                break;
            }
        }
        
        // Search in increasing part
        for (int i = 0; i <= peak; i++) {
            int val = mountainArr.get(i);
            if (val == target) return i;
            if (val > target) break;
        }
        
        // Search in decreasing part
        for (int i = peak; i < n; i++) {
            int val = mountainArr.get(i);
            if (val == target) return i;
            if (val < target) break;
        }
        
        return -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int findInMountainArray(int target, MountainArray mountainArr) {
        int n = mountainArr.length();
        
        // Find the peak
        int peak = 0;
        for (int i = 0; i < n - 1; i++) {
            if (mountainArr.get(i) > mountainArr.get(i + 1)) {
                peak = i;
                break;
            }
        }
        
        // Search in increasing part
        for (int i = 0; i <= peak; i++) {
            int val = mountainArr.get(i);
            if (val == target) return i;
            if (val > target) break;
        }
        
        // Search in decreasing part
        for (int i = peak; i < n; i++) {
            int val = mountainArr.get(i);
            if (val == target) return i;
            if (val < target) break;
        }
        
        return -1;
    }
}
```

<!-- slide -->
```javascript
var findInMountainArray = function(target, mountainArr) {
    const n = mountainArr.length();
    
    // Find the peak
    let peak = 0;
    for (let i = 0; i < n - 1; i++) {
        if (mountainArr.get(i) > mountainArr.get(i + 1)) {
            peak = i;
            break;
        }
    }
    
    // Search in increasing part
    for (let i = 0; i <= peak; i++) {
        const val = mountainArr.get(i);
        if (val === target) return i;
        if (val > target) break;
    }
    
    // Search in decreasing part
    for (let i = peak; i < n; i++) {
        const val = mountainArr.get(i);
        if (val === target) return i;
        if (val < target) break;
    }
    
    return -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N) - Linear scan to find peak and search |
| **Space** | O(1) - Only uses constant space |

---

## Comparison of Approaches

| Aspect | Binary Search | Linear Scan |
|--------|--------------|-------------|
| **Time Complexity** | O(log N) | O(N) |
| **Space Complexity** | O(1) | O(1) |
| **API Calls** | ~3 log N | Up to N |
| **Optimal** | ✅ Yes | ❌ No |

**Best Approach:** The binary search approach is optimal for this problem, with O(log N) time complexity and minimal API calls.

---

## Why Binary Search is Optimal for This Problem

The binary search approach is optimal because:

1. **Efficient API Usage**: Minimizes calls to MountainArray.get(), staying well under the 100-call limit
2. **Logarithmic Time**: O(log N) complexity is the best possible for searching in a sorted-like structure
3. **Deterministic**: Guaranteed to find the minimum index where target exists
4. **Elegant**: Leverages the mountain array's ordered structure

---

## Related Problems

Based on similar themes (binary search on sorted arrays, peak finding):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Peak Index in a Mountain Array | [Link](https://leetcode.com/problems/peak-index-in-a-mountain-array/) | Find peak in mountain array |
| Binary Search | [Link](https://leetcode.com/problems/binary-search/) | Standard binary search |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Search in Rotated Sorted Array | [Link](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Search in rotated array |
| Search in Rotated Sorted Array II | [Link](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/) | Search with duplicates |
| Find Minimum in Rotated Sorted Array | [Link](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | Find minimum in rotated array |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Search in Rotated Sorted Array IV | [Link](https://leetcode.com/problems/search-in-rotated-sorted-array-iv/) | Hard version with more constraints |

### Pattern Reference

For more detailed explanations of the Binary Search pattern and its variations, see:
- **[Binary Search - Find First and Last Occurrence](/patterns/binary-search-find-first-last-occurrence)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Binary Search on Mountain Array

- [NeetCode - Find in Mountain Array](https://www.youtube.com/watch?v=bseDtPy4_Wc) - Clear explanation with visual examples
- [Find Peak Element - LeetCode](https://www.youtube.com/watch?v=cfmSgeeN95s) - Related problem explanation
- [Binary Search Masterclass](https://www.youtube.com/watch?v=MoqVYbVv0IU) - Complete binary search guide

### Related Problems

- [Search in Rotated Sorted Array](https://www.youtube.com/watch?v=6bG4U7N2G4g) - Similar binary search problem
- [Peak Finding Algorithms](https://www.youtube.com/watch?v=z3XKd7O6p8A) - Understanding peak finding

---

## Follow-up Questions

### Q1: What if the mountain array has duplicate peak elements?

**Answer:** The standard binary search approach assumes a strictly increasing then strictly decreasing array. For arrays with duplicate peaks, you'd need to first find all peak indices and then search each region. The time complexity would increase to handle the duplicates.

---

### Q2: How would you modify the solution to find the target at the maximum index instead of minimum?

**Answer:** Simply reverse the search order - search the decreasing region first instead of the increasing region. This would return the last occurrence of the target.

---

### Q3: What is the minimum number of MountainArray.get() calls needed?

**Answer:** For a mountain array of size N, the optimal solution makes approximately 2*log2(N) calls - roughly log(N) for peak finding and log(N) for binary searching the appropriate region.

---

### Q4: How would you handle an array that is not a valid mountain array?

**Answer:** The problem guarantees a valid mountain array. If validation were needed, you could first check that arr[0] < arr[1] < ... < arr[peak] and arr[peak] > arr[peak+1] > ... > arr[n-1]. This would add O(N) time.

---

### Q5: What if target is greater than the peak element?

**Answer:** Since target is greater than the maximum element in the array, it cannot exist in a mountain array. The algorithm will search both regions and return -1.

---

### Q6: How would you extend this to find all occurrences of the target?

**Answer:** After finding the first occurrence, continue binary searching in both directions to find all indices. This would require modifying the binary search to continue searching instead of returning immediately.

---

### Q7: What edge cases should be tested?

**Answer:**
- Target at peak element
- Target at the beginning (index 0)
- Target at the end (last index)
- Target not in array
- Target appears in both increasing and decreasing regions
- Target equals peak - 1
- Single element array (though constraint says >= 3)

---

### Q8: How would you solve this if you could access the array directly?

**Answer:** If direct access were allowed, you could use the same approach but without worrying about API call limits. You could also pre-fetch all elements into a regular array and perform operations on it.

---

### Q9: What is the maximum number of API calls in the optimal solution?

**Answer:** For N elements, peak finding takes at most ⌈log₂(N)⌉ calls, and each binary search takes at most ⌈log₂(N)⌉ calls. So maximum is approximately 2*⌈log₂(N)⌉ + 1 calls, well under the 100 limit for N ≤ 10⁴.

---

### Q10: How does this problem relate to real-world applications?

**Answer:** This problem models scenarios like finding optimal prices in markets that rise then fall, searching in rotated sorted data, or finding peak values in sensor data that increases then decreases.

---

## Common Pitfalls

### 1. Not Searching in Both Regions
**Issue**: Only searching one region may miss the target.

**Solution**: Always search both increasing and decreasing regions to find the minimum index.

### 2. Exceeding API Call Limit
**Issue**: Making too many calls to MountainArray.get().

**Solution**: Use binary search which guarantees O(log N) calls.

### 3. Incorrect Binary Search Direction
**Issue**: Using the wrong comparison for decreasing region.

**Solution**: Remember: in decreasing region, larger values are to the left.

### 4. Off-by-One Errors
**Issue**: Incorrect peak index or search boundaries.

**Solution**: Carefully define boundaries for both regions.

### 5. Not Returning Minimum Index
**Issue**: Returning any index instead of minimum.

**Solution**: Always search increasing region first since it contains smaller indices.

---

## Summary

The **Find in Mountain Array** problem demonstrates the power of binary search on structured arrays:

- **Binary search approach**: Optimal with O(log N) time and minimal API calls
- **Linear scan approach**: Simple but O(N) time and more API calls

The key insight is that a mountain array can be split into two sorted regions, allowing binary search to be applied to each region. The optimal solution finds the peak first, then searches both regions to find the minimum index.

This problem is an excellent demonstration of how understanding data structure properties can lead to efficient algorithms.

### Pattern Summary

This problem exemplifies the **Binary Search on Mountain Array** pattern, which is characterized by:
- Finding the peak element first
- Searching in both increasing and decreasing regions
- Achieving O(log N) time complexity
- Minimizing API calls in constrained environments

For more details on this pattern and its variations, see the **[Binary Search - Find First and Last Occurrence Pattern](/patterns/binary-search-find-first-last-occurrence)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/find-in-mountain-array/discuss/) - Community solutions and explanations
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Detailed explanation
- [Peak Finding Algorithms](https://www.geeksforgeeks.org/find-a-peak-in-a-mountain-array/) - Understanding peak finding
- [Mountain Array - Wikipedia](https://en.wikipedia.org/wiki/Mountain_array) - Learn about mountain arrays
- [Pattern: Binary Search - Find First and Last Occurrence](/patterns/binary-search-find-first-last-occurrence) - Comprehensive pattern guide
