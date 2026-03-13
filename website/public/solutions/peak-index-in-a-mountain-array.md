# Peak Index in a Mountain Array

## Problem Description

You are given an integer mountain array `arr` of length `n` where the values increase to a peak element and then decrease.
Return the index of the peak element.
Your task to solve it in O(log(n)) time complexity.

**Link to problem:** [Peak Index in a Mountain Array - LeetCode 852](https://leetcode.com/problems/peak-index-in-a-mountain-array/)

## Constraints
- `3 <= arr.length <= 10^5`
- `0 <= arr[i] <= 10^6`
- `arr` is guaranteed to be a mountain array

---

## Pattern: Binary Search - Mountain Array

This problem is a classic example of the **Binary Search** pattern applied to finding the peak in a unimodal array (increasing then decreasing).

### Core Concept

The fundamental idea is:
- **Unimodal**: Array increases then decreases
- **Binary Search**: Use binary search to find the peak in O(log n)
- **Comparison**: Compare arr[mid] with arr[mid+1] to determine search direction

---

## Examples

### Example

**Input:**
```
arr = [0,1,0]
```

**Output:**
```
1
```

**Explanation:** arr[1] = 1 is the peak.

### Example 2

**Input:**
```
arr = [0,2,1,0]
```

**Output:**
```
1
```

**Explanation:** arr[1] = 2 is the peak.

### Example 3

**Input:**
```
arr = [0,10,5,2]
```

**Output:**
```
1
```

**Explanation:** arr[1] = 10 is the peak.

---

## Intuition

The key insight is that we're looking for the transition point where the array stops increasing and starts decreasing:

1. **Increasing Part**: arr[mid] < arr[mid + 1] means we're on the upward slope
2. **Decreasing Part**: arr[mid] > arr[mid + 1] means we're on the downward slope
3. **Peak**: When neither condition is true (though this won't happen in valid binary search)

### Why Binary Search?

- **Ordered Search Space**: The array is sorted (increasing then decreasing)
- **O(log n)**: Binary search gives logarithmic time complexity
- **Single Pass**: Each comparison halves the search space

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Binary Search** - O(log n) time, O(1) space - Optimal
2. **Linear Scan** - O(n) time, O(1) space
3. **Modified Binary Search** - Alternative implementation

---

## Approach 1: Binary Search (Optimal)

This is the optimal approach using binary search.

### Algorithm Steps

1. Initialize left = 0, right = len(arr) - 1
2. While left < right:
   - Find mid = (left + right) // 2
   - If arr[mid] < arr[mid + 1], peak is to the right (move left)
   - Otherwise, peak is at mid or to the left (move right)
3. Return left (or right, they're equal at the peak)

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def peakIndexInMountainArray(self, arr: List[int]) -> int:
        """
        Find peak index using binary search.
        
        Args:
            arr: Mountain array
            
        Returns:
            Index of the peak element
        """
        left, right = 0, len(arr) - 1
        
        while left < right:
            mid = (left + right) // 2
            if arr[mid] < arr[mid + 1]:
                # Still going up, peak is to the right
                left = mid + 1
            else:
                # Going down or at peak, peak is at mid or left
                right = mid
        
        return left
```

<!-- slide -->
```cpp
class Solution {
public:
    int peakIndexInMountainArray(vector<int>& arr) {
        /**
         * Find peak index using binary search.
         * 
         * Args:
         *     arr: Mountain array
         * 
         * Returns:
         *     Index of the peak element
         */
        int left = 0;
        int right = arr.size() - 1;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] < arr[mid + 1]) {
                // Still going up, peak is to the right
                left = mid + 1;
            } else {
                // Going down or at peak, peak is at mid or left
                right = mid;
            }
        }
        
        return left;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int peakIndexInMountainArray(int[] arr) {
        /**
         * Find peak index using binary search.
         * 
         * Args:
         *     arr: Mountain array
         * 
         * Returns:
         *     Index of the peak element
         */
        int left = 0;
        int right = arr.length - 1;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] < arr[mid + 1]) {
                // Still going up, peak is to the right
                left = mid + 1;
            } else {
                // Going down or at peak, peak is at mid or left
                right = mid;
            }
        }
        
        return left;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find peak index using binary search.
 * 
 * @param {number[]} arr - Mountain array
 * @return {number} - Index of the peak element
 */
var peakIndexInMountainArray = function(arr) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] < arr[mid + 1]) {
            // Still going up, peak is to the right
            left = mid + 1;
        } else {
            // Going down or at peak, peak is at mid or left
            right = mid;
        }
    }
    
    return left;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) - Each iteration halves the search space |
| **Space** | O(1) - Only pointer variables used |

---

## Approach 2: Linear Scan

Simple O(n) approach for understanding.

### Algorithm Steps

1. Iterate through array from index 1 to n-2
2. Find the first index where arr[i] > arr[i+1]
3. Return that index

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def peakIndexInMountainArray_linear(self, arr: List[int]) -> int:
        """
        Find peak using linear scan.
        """
        for i in range(1, len(arr) - 1):
            if arr[i] > arr[i + 1]:
                return i
        return -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int peakIndexInMountainArray(vector<int>& arr) {
        for (int i = 1; i < arr.size() - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                return i;
            }
        }
        return -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int peakIndexInMountainArray(int[] arr) {
        for (int i = 1; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                return i;
            }
        }
        return -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find peak using linear scan.
 * 
 * @param {number[]} arr - Mountain array
 * @return {number} - Index of the peak element
 */
var peakIndexInMountainArray = function(arr) {
    for (let i = 1; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            return i;
        }
    }
    return -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - May need to scan entire increasing part |
| **Space** | O(1) |

---

## Approach 3: Modified Binary Search (Alternative)

Another variant of binary search that explicitly checks for peak.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def peakIndexInMountainArray_alt(self, arr: List[int]) -> int:
        """
        Alternative binary search implementation.
        """
        left, right = 0, len(arr) - 1
        
        while left + 1 < right:
            mid = (left + right) // 2
            if arr[mid] > arr[mid - 1] and arr[mid] > arr[mid + 1]:
                return mid
            elif arr[mid] > arr[mid - 1]:
                left = mid
            else:
                right = mid
        
        return left if arr[left] > arr[right] else right
```

<!-- slide -->
```cpp
class Solution {
public:
    int peakIndexInMountainArray(vector<int>& arr) {
        int left = 0;
        int right = arr.size() - 1;
        
        while (left + 1 < right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] > arr[mid - 1] && arr[mid] > arr[mid + 1]) {
                return mid;
            } else if (arr[mid] > arr[mid - 1]) {
                left = mid;
            } else {
                right = mid;
            }
        }
        
        return arr[left] > arr[right] ? left : right;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int peakIndexInMountainArray(int[] arr) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left + 1 < right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] > arr[mid - 1] && arr[mid] > arr[mid + 1]) {
                return mid;
            } else if (arr[mid] > arr[mid - 1]) {
                left = mid;
            } else {
                right = mid;
            }
        }
        
        return arr[left] > arr[right] ? left : right;
    }
}
```

<!-- slide -->
```javascript
/**
 * Alternative binary search implementation.
 * 
 * @param {number[]} arr - Mountain array
 * @return {number} - Index of the peak element
 */
var peakIndexInMountainArray = function(arr) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left + 1 < right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] > arr[mid - 1] && arr[mid] > arr[mid + 1]) {
            return mid;
        } else if (arr[mid] > arr[mid - 1]) {
            left = mid;
        } else {
            right = mid;
        }
    }
    
    return arr[left] > arr[right] ? left : right;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Binary Search | Linear Scan | Modified BS |
|--------|---------------|-------------|-------------|
| **Time Complexity** | O(log n) | O(n) | O(log n) |
| **Space Complexity** | O(1) | O(1) | O(1) |
| **Implementation** | Simple | Simple | Moderate |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ✅ Yes |
| **Best For** | Production | Learning | Alternative |

**Best Approach:** Binary search (Approach 1) is optimal and recommended.

---

## Why Binary Search Works

Binary search works because:
1. The array is strictly increasing then strictly decreasing
2. There's exactly one peak (mountain array property)
3. Comparing arr[mid] with arr[mid+1] tells us which side has the peak
4. Each iteration halves the search space

The key insight is that arr[mid] < arr[mid+1] means we're on the rising slope, so the peak must be to the right.

---

## Related Problems

Based on similar themes (binary search, mountain array):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Find Peak Element | [Link](https://leetcode.com/problems/find-peak-element/) | General peak finding |
| Binary Search | [Link](https://leetcode.com/problems/binary-search/) | Basic binary search |
| Search Insert Position | [Link](https://leetcode.com/problems/search-insert-position/) | Binary search variant |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Find in Mountain Array | [Link](https://leetcode.com/problems/find-in-mountain-array/) | Search in mountain array |
| Peak Index in Mountain Array II | [Link](https://leetcode.com/problems/peak-index-in-mountain-array-ii/) | 2D version |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum Number of Non-Overlapping Subarrays With Sum Equals Target | [Link](https://leetcode.com/problems/maximum-number-of-non-overlapping-subarrays-with-sum-equals-target/) | Advanced binary search |

### Pattern Reference

For more detailed explanations of the Binary Search pattern, see:
- **[Binary Search - Finding Transition Point](/patterns/binary-search-transition)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Binary Search Concepts

- [NeetCode - Peak Index in Mountain Array](https://www.youtube.com/watch?v=LeLq7rHr7H4) - Clear explanation
- [Binary Search Fundamentals](https://www.youtube.com/watch?v=Moq1riqJCGo) - Understanding binary search
- [LeetCode Official Solution](https://www.youtube.com/watch?v=Bf2vB4fy9LE) - Official solution

---

## Follow-up Questions

### Q1: Can you find both peaks in an array that goes up, down, up, down?

**Answer:** That would require finding all local maxima, which can't be done efficiently in one pass. You'd need to scan for all positions where arr[i] > arr[i-1] and arr[i] > arr[i+1].

---

### Q2: What if the array has multiple equal elements at the peak?

**Answer:** The problem guarantees a "mountain array" which by definition has strictly increasing then strictly decreasing values, so this won't happen.

---

### Q3: How would you adapt this to find the minimum in a rotated sorted array?

**Answer:** Similar concept - compare mid with right to determine which half has the minimum. The logic is reversed (looking for smallest instead of largest).

---

### Q4: What edge cases should be tested?

**Answer:**
- Peak at beginning (arr = [2,1,0])
- Peak at end (arr = [0,1,2])
- Two elements (invalid per constraints)
- Large array (test O(log n) efficiency)

---

### Q5: Why do we use arr[mid] < arr[mid + 1] instead of comparing with neighbors?

**Answer:** It's more efficient - we only need one comparison to determine direction, and the mountain property guarantees the other neighbor is correctly ordered.

---

## Common Pitfalls

### 1. Infinite Loop
**Issue**: Not moving pointers correctly causing infinite loop.

**Solution**: Ensure left = mid + 1 or right = mid, not just mid.

### 2. Index Out of Bounds
**Issue**: Accessing arr[mid + 1] when mid is at the end.

**Solution**: The loop condition left < right ensures mid < right, so mid + 1 is safe.

### 3. Returning Wrong Index
**Issue**: Returning mid instead of left/right.

**Solution**: At loop termination, left == right, so either works.

---

## Summary

The **Peak Index in a Mountain Array** problem demonstrates binary search on a unimodal array:

- **Binary Search**: Optimal with O(log n) time and O(1) space
- **Linear Scan**: Simple but O(n) time
- **Modified BS**: Alternative implementation

The key insight is comparing arr[mid] with arr[mid+1] to determine which half contains the peak.

This problem is an excellent introduction to binary search on special array types.

### Pattern Summary

This problem exemplifies the **Binary Search - Transition Point** pattern, which is characterized by:
- Searching in a sorted (or partially sorted) array
- Using comparison to determine search direction
- Achieving O(log n) time complexity

For more details on this pattern, see the **[Binary Search - Finding Transition Point](/patterns/binary-search-transition)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/peak-index-in-a-mountain-array/discuss/) - Community solutions
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Detailed explanation
- [Mountain Array - Wikipedia](https://en.wikipedia.org/wiki/Unimodal_function) - Mathematical background
