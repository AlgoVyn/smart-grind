# Longest Mountain in Array

## Problem Description

You may recall that an array `arr` is a **mountain array** if and only if:

- `arr.length >= 3`
- There exists some index `i` (0-indexed) with `0 < i < arr.length - 1` such that:
  - `arr[0] < arr[1] < ... < arr[i - 1] < arr[i]`
  - `arr[i] > arr[i + 1] > ... < arr[arr.length - 1]`

Given an integer array `arr`, return the length of the longest subarray which is a mountain. Return `0` if there is no mountain subarray.

**Link to problem:** [Longest Mountain in Array - LeetCode 845](https://leetcode.com/problems/longest-mountain-in-array/)

## Constraints
- `1 <= arr.length <= 10^4`
- `0 <= arr[i] <= 10^4`

---

## Pattern: Two Pointers - Mountain Detection

This problem uses the **Two Pointers** pattern to detect mountains in an array. The key is to find valid peaks that have both an ascending and descending slope.

### Core Concept

A valid mountain has three parts:
1. **Ascending slope** - Strictly increasing sequence ending at a peak
2. **Peak** - The highest point where both neighbors are smaller
3. **Descending slope** - Strictly decreasing sequence after the peak

We need to find peaks that have both ascending and descending parts.

---

## Examples

### Example

**Input:**
```
arr = [2,1,4,7,3,2,5]
```

**Output:**
```
5
```

**Explanation:** The largest mountain is `[1,4,7,3,2]` which has length 5.
- Ascending: 1 → 4 → 7
- Peak: 7
- Descending: 7 → 3 → 2

### Example 2

**Input:**
```
arr = [2,2,2]
```

**Output:**
```
0
```

**Explanation:** There is no mountain because there's no peak (all elements are equal).

### Example 3

**Input:**
```
arr = [0,1,2,3,4,5,6,7,8,9]
```

**Output:**
```
0
```

**Explanation:** This is a strictly increasing array with no descending slope.

### Example 4

**Input:**
```
arr = [9,8,7,6,5,4,3,2,1,0]
```

**Output:**
```
0
```

**Explanation:** This is a strictly decreasing array with no ascending slope.

---

## Intuition

The key insight is:

1. **Find Peaks**: A valid peak `i` must satisfy `arr[i-1] < arr[i] > arr[i+1]`
2. **Expand Both Sides**: From each peak, expand left while ascending and right while descending
3. **Calculate Length**: The mountain length is the distance between the leftmost and rightmost points

### Why Two Pointers Works

By using two pointers (left and right) that expand from the peak:
- Each element is visited at most twice (once going up, once going down)
- We only process valid peaks, avoiding false positives
- The time complexity becomes O(n) as each element is visited at most twice

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Peak Detection with Expansion (Optimal)** - O(n) time, O(1) space
2. **Two-Pass with Arrays** - O(n) time, O(n) space
3. **One Pass State Machine** - O(n) time, O(1) space

---

## Approach 1: Peak Detection with Expansion (Optimal)

This is the standard solution that iterates through potential peaks and expands both directions.

### Algorithm Steps

1. If array length < 3, return 0
2. Initialize max_len = 0
3. Iterate through each index i from 1 to n-2 (potential peaks):
   - Check if arr[i-1] < arr[i] > arr[i+1] (valid peak)
   - If valid, expand left while arr[left-1] < arr[left]
   - Expand right while arr[right] > arr[right+1]
   - Update max_len with the mountain length
4. Return max_len

### Why It Works

By checking for valid peaks first, we ensure we only process positions that could be mountains. The expansion process correctly identifies the full extent of each mountain.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def longestMountain(self, arr: List[int]) -> int:
        """
        Find the length of the longest mountain in the array.
        
        Args:
            arr: Input array of integers
            
        Returns:
            Length of the longest mountain, or 0 if none exists
        """
        n = len(arr)
        if n < 3:
            return 0
        
        max_len = 0
        
        # Iterate through potential peaks (can't be first or last element)
        for i in range(1, n - 1):
            # Check if this is a valid peak
            if arr[i - 1] < arr[i] > arr[i + 1]:
                # Expand left
                left = i
                while left > 0 and arr[left - 1] < arr[left]:
                    left -= 1
                
                # Expand right
                right = i
                while right < n - 1 and arr[right] > arr[right + 1]:
                    right += 1
                
                # Update maximum length
                max_len = max(max_len, right - left + 1)
        
        return max_len
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>

class Solution {
public:
    /**
     * Find the length of the longest mountain in the array.
     * 
     * @param arr Input array of integers
     * @return Length of the longest mountain, or 0 if none exists
     */
    int longestMountain(vector<int> arr) {
        int n = arr.size();
        if (n < 3) return 0;
        
        int maxLen = 0;
        
        // Iterate through potential peaks
        for (int i = 1; i < n - 1; i++) {
            // Check if this is a valid peak
            if (arr[i - 1] < arr[i] && arr[i] > arr[i + 1]) {
                // Expand left
                int left = i;
                while (left > 0 && arr[left - 1] < arr[left]) {
                    left--;
                }
                
                // Expand right
                int right = i;
                while (right < n - 1 && arr[right] > arr[right + 1]) {
                    right++;
                }
                
                // Update maximum length
                maxLen = max(maxLen, right - left + 1);
            }
        }
        
        return maxLen;
    }
};
```

<!-- slide -->
```java
class Solution {
    /**
     * Find the length of the longest mountain in the array.
     * 
     * @param arr Input array of integers
     * @return Length of the longest mountain, or 0 if none exists
     */
    public int longestMountain(int[] arr) {
        int n = arr.length;
        if (n < 3) return 0;
        
        int maxLen = 0;
        
        // Iterate through potential peaks
        for (int i = 1; i < n - 1; i++) {
            // Check if this is a valid peak
            if (arr[i - 1] < arr[i] && arr[i] > arr[i + 1]) {
                // Expand left
                int left = i;
                while (left > 0 && arr[left - 1] < arr[left]) {
                    left--;
                }
                
                // Expand right
                int right = i;
                while (right < n - 1 && arr[right] > arr[right + 1]) {
                    right++;
                }
                
                // Update maximum length
                maxLen = Math.max(maxLen, right - left + 1);
            }
        }
        
        return maxLen;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the length of the longest mountain in the array.
 * 
 * @param {number[]} arr - Input array of integers
 * @return {number} - Length of the longest mountain, or 0 if none exists
 */
var longestMountain = function(arr) {
    const n = arr.length;
    if (n < 3) return 0;
    
    let maxLen = 0;
    
    // Iterate through potential peaks
    for (let i = 1; i < n - 1; i++) {
        // Check if this is a valid peak
        if (arr[i - 1] < arr[i] && arr[i] > arr[i + 1]) {
            // Expand left
            let left = i;
            while (left > 0 && arr[left - 1] < arr[left]) {
                left--;
            }
            
            // Expand right
            let right = i;
            while (right < n - 1 && arr[right] > arr[right + 1]) {
                right++;
            }
            
            // Update maximum length
            maxLen = Math.max(maxLen, right - left + 1);
        }
    }
    
    return maxLen;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is visited at most twice |
| **Space** | O(1) - Only uses constant extra space |

---

## Approach 2: Two-Pass with Arrays

This approach precomputes the climbing and descending lengths for each position.

### Algorithm Steps

1. Create two arrays: up[] and down[]
2. Pass 1: Calculate up[i] - length of ascending slope ending at i
3. Pass 2: Calculate down[i] - length of descending slope starting at i
4. For each position i, if up[i] > 0 and down[i] > 0, mountain length = up[i] + down[i] + 1

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def longestMountain_twopass(self, arr: List[int]) -> int:
        """
        Find longest mountain using two passes.
        """
        n = len(arr)
        if n < 3:
            return 0
        
        up = [0] * n
        down = [0] * n
        
        # Pass 1: Calculate ascending lengths
        for i in range(1, n):
            if arr[i - 1] < arr[i]:
                up[i] = up[i - 1] + 1
        
        # Pass 2: Calculate descending lengths
        for i in range(n - 2, -1, -1):
            if arr[i] > arr[i + 1]:
                down[i] = down[i + 1] + 1
        
        # Find maximum mountain length
        max_len = 0
        for i in range(1, n - 1):
            if up[i] > 0 and down[i] > 0:
                max_len = max(max_len, up[i] + down[i] + 1)
        
        return max_len
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>

class Solution {
public:
    int longestMountain(vector<int> arr) {
        int n = arr.size();
        if (n < 3) return 0;
        
        vector<int> up(n, 0), down(n, 0);
        
        // Pass 1: Calculate ascending lengths
        for (int i = 1; i < n; i++) {
            if (arr[i - 1] < arr[i]) {
                up[i] = up[i - 1] + 1;
            }
        }
        
        // Pass 2: Calculate descending lengths
        for (int i = n - 2; i >= 0; i--) {
            if (arr[i] > arr[i + 1]) {
                down[i] = down[i + 1] + 1;
            }
        }
        
        // Find maximum mountain length
        int maxLen = 0;
        for (int i = 1; i < n - 1; i++) {
            if (up[i] > 0 && down[i] > 0) {
                maxLen = max(maxLen, up[i] + down[i] + 1);
            }
        }
        
        return maxLen;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int longestMountain(int[] arr) {
        int n = arr.length;
        if (n < 3) return 0;
        
        int[] up = new int[n];
        int[] down = new int[n];
        
        // Pass 1: Calculate ascending lengths
        for (int i = 1; i < n; i++) {
            if (arr[i - 1] < arr[i]) {
                up[i] = up[i - 1] + 1;
            }
        }
        
        // Pass 2: Calculate descending lengths
        for (int i = n - 2; i >= 0; i--) {
            if (arr[i] > arr[i + 1]) {
                down[i] = down[i + 1] + 1;
            }
        }
        
        // Find maximum mountain length
        int maxLen = 0;
        for (int i = 1; i < n - 1; i++) {
            if (up[i] > 0 && down[i] > 0) {
                maxLen = Math.max(maxLen, up[i] + down[i] + 1);
            }
        }
        
        return maxLen;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find longest mountain using two passes.
 * 
 * @param {number[]} arr - Input array
 * @return {number} - Length of longest mountain
 */
var longestMountain = function(arr) {
    const n = arr.length;
    if (n < 3) return 0;
    
    const up = new Array(n).fill(0);
    const down = new Array(n).fill(0);
    
    // Pass 1: Calculate ascending lengths
    for (let i = 1; i < n; i++) {
        if (arr[i - 1] < arr[i]) {
            up[i] = up[i - 1] + 1;
        }
    }
    
    // Pass 2: Calculate descending lengths
    for (let i = n - 2; i >= 0; i--) {
        if (arr[i] > arr[i + 1]) {
            down[i] = down[i + 1] + 1;
        }
    }
    
    // Find maximum mountain length
    let maxLen = 0;
    for (let i = 1; i < n - 1; i++) {
        if (up[i] > 0 && down[i] > 0) {
            maxLen = Math.max(maxLen, up[i] + down[i] + 1);
        }
    }
    
    return maxLen;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Two passes through the array |
| **Space** | O(n) - Two additional arrays |

---

## Approach 3: One Pass State Machine

This approach uses a state machine to track the current phase (flat, ascending, descending).

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def longestMountain_onestate(self, arr: List[int]) -> int:
        """
        Find longest mountain using one pass with state machine.
        """
        n = len(arr)
        if n < 3:
            return 0
        
        max_len = 0
        i = 1  # Start from index 1
        
        while i < n - 1:
            # Check if i is a peak
            if arr[i - 1] < arr[i] > arr[i + 1]:
                # Expand left
                left = i - 1
                while left > 0 and arr[left - 1] < arr[left]:
                    left -= 1
                
                # Expand right
                right = i + 1
                while right < n - 1 and arr[right] > arr[right + 1]:
                    right += 1
                
                max_len = max(max_len, right - left + 1)
                i = right + 1  # Skip to end of this mountain
            else:
                i += 1
        
        return max_len
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>

class Solution {
public:
    int longestMountain(vector<int> arr) {
        int n = arr.size();
        if (n < 3) return 0;
        
        int maxLen = 0;
        int i = 1;
        
        while (i < n - 1) {
            // Check if i is a peak
            if (arr[i - 1] < arr[i] && arr[i] > arr[i + 1]) {
                // Expand left
                int left = i - 1;
                while (left > 0 && arr[left - 1] < arr[left]) {
                    left--;
                }
                
                // Expand right
                int right = i + 1;
                while (right < n - 1 && arr[right] > arr[right + 1]) {
                    right++;
                }
                
                maxLen = max(maxLen, right - left + 1);
                i = right + 1;  // Skip to end of this mountain
            } else {
                i++;
            }
        }
        
        return maxLen;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int longestMountain(int[] arr) {
        int n = arr.length;
        if (n < 3) return 0;
        
        int maxLen = 0;
        int i = 1;
        
        while (i < n - 1) {
            // Check if i is a peak
            if (arr[i - 1] < arr[i] && arr[i] > arr[i + 1]) {
                // Expand left
                int left = i - 1;
                while (left > 0 && arr[left - 1] < arr[left]) {
                    left--;
                }
                
                // Expand right
                int right = i + 1;
                while (right < n - 1 && arr[right] > arr[right + 1]) {
                    right++;
                }
                
                maxLen = Math.max(maxLen, right - left + 1);
                i = right + 1;  // Skip to end of this mountain
            } else {
                i++;
            }
        }
        
        return maxLen;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find longest mountain using one pass with state machine.
 * 
 * @param {number[]} arr - Input array
 * @return {number} - Length of longest mountain
 */
var longestMountain = function(arr) {
    const n = arr.length;
    if (n < 3) return 0;
    
    let maxLen = 0;
    let i = 1;
    
    while (i < n - 1) {
        // Check if i is a peak
        if (arr[i - 1] < arr[i] && arr[i] > arr[i + 1]) {
            // Expand left
            let left = i - 1;
            while (left > 0 && arr[left - 1] < arr[left]) {
                left--;
            }
            
            // Expand right
            let right = i + 1;
            while (right < n - 1 && arr[right] > arr[right + 1]) {
                right++;
            }
            
            maxLen = Math.max(maxLen, right - left + 1);
            i = right + 1;  // Skip to end of this mountain
        } else {
            i++;
        }
    }
    
    return maxLen;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass, skips processed mountains |
| **Space** | O(1) - Only uses constant space |

---

## Comparison of Approaches

| Aspect | Peak Detection | Two-Pass Arrays | One Pass |
|--------|----------------|-----------------|-----------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) | O(1) |
| **Implementation** | Simple | Clear logic | Skips mountains |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ✅ Yes |

**Best Approach:** Approach 1 (Peak Detection) is the most straightforward and optimal.

---

## Related Problems

Based on similar themes (array scanning, peak detection):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Peak Index in a Mountain Array | [Link](https://leetcode.com/problems/peak-index-in-a-mountain-array/) | Find peak in mountain array |
| Valid Mountain Array | [Link](https://leetcode.com/problems/valid-mountain-array/) | Check if valid mountain |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Longest Peak | [Link](https://leetcode.com/problems/longest-mountain-in-array/) | This problem |
| Find the Celebrity | [Link](https://leetcode.com/problems/find-the-celebrity/) | Similar peak-like detection |

### Pattern Reference

For more detailed explanations of array scanning patterns, see:
- **[Two Pointers - Converging Array](/patterns/two-pointers-converging-sorted-array-target-sum)**
- **[Binary Search - Mountain Array](/patterns/binary-search-find-min-max-in-rotated-sorted-array)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Peak Detection

- [NeetCode - Longest Mountain in Array](https://www.youtube.com/watch?v=NfnGt7E6g-0) - Clear explanation with visual examples
- [Longest Mountain - Back to Back SWE](https://www.youtube.com/watch?v=NfnGt7E6g-0) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=NfnGt7E6g-0) - Official problem solution

### Related Concepts

- [Two Pointers Technique](https://www.youtube.com/watch?v=NfnGt7E6g-0) - Understanding two pointers
- [Array Scanning Patterns](https://www.youtube.com/watch?v=NfnGt7E6g-0) - Array manipulation techniques

---

## Follow-up Questions

### Q1: Can you solve it using only one pass?

**Answer:** Yes! Approach 3 (One Pass State Machine) achieves this. After processing a mountain, we skip to the end of that mountain rather than checking each element individually.

---

### Q2: Can you solve it in O(1) space?

**Answer:** Yes! Both Approach 1 and Approach 3 use only O(1) extra space. Approach 2 uses O(n) space for the auxiliary arrays.

---

### Q3: How would you find all mountains in the array?

**Answer:** Instead of tracking only the maximum, collect all mountains by storing their lengths in a list whenever a valid mountain is found.

---

### Q4: What if the array has multiple peaks (e.g., 0 1 2 1 2 1 0)?

**Answer:** The algorithm correctly handles this. Each peak (index 2 and index 4) would be processed separately, finding the mountains [0,1,2,1,0] and [2,1,0].

---

### Q5: How do you distinguish between a peak and a plateau?

**Answer:** The current solution treats plateaus as invalid peaks because we require strict inequality: arr[i-1] < arr[i] > arr[i+1]. For plateaus, you'd need to find the highest point first.

---

### Q6: What is the minimum length of a valid mountain?

**Answer:** A valid mountain must have at least 3 elements (1 for ascending, 1 for peak, 1 for descending).

---

### Q7: How would you modify to find the longest consecutive sequence instead of a mountain?

**Answer:** You'd remove the descending slope requirement and just look for the longest strictly increasing or decreasing sequence.

---

### Q8: What edge cases should be tested?

**Answer:**
- Array of length < 3 (should return 0)
- No mountains (flat or monotonic arrays)
- Multiple peaks
- Single peak
- Mountains of different sizes
- Adjacent peaks

---

## Common Pitfalls

### 1. Not Checking Array Length
**Issue:** Forgetting to handle arrays with less than 3 elements.

**Solution:** Return 0 immediately if n < 3.

### 2. Off-by-One Errors
**Issue:** Starting or ending iteration at wrong indices.

**Solution:** Iterate from index 1 to n-2 (valid peak positions).

### 3. Non-Strict Inequalities
**Issue:** Using <= instead of < for ascending/descending checks.

**Solution:** Mountains require strict inequalities (no equal adjacent elements).

### 4. Not Skipping Processed Elements
**Issue:** Processing the same mountain multiple times in multi-peak arrays.

**Solution:** After processing a mountain, skip to its end.

### 5. Wrong Peak Detection
**Issue:** Not checking both neighbors for a valid peak.

**Solution:** Always verify arr[i-1] < arr[i] > arr[i+1].

---

## Summary

The **Longest Mountain in Array** problem demonstrates array scanning and peak detection:

- **Optimal Solution**: O(n) time with O(1) space
- **Key Insight**: Find valid peaks and expand both directions
- **Three Parts**: Ascending slope, peak, descending slope

The key insight is that mountains require both an ascending and descending slope. By finding valid peaks and expanding, we can identify the full extent of each mountain.

### Pattern Summary

This problem exemplifies the **Two Pointers - Mountain Detection** pattern, which is characterized by:
- Finding valid peaks with neighbors on both sides
- Expanding from peaks to find full mountains
- O(n) time with O(1) space

For more details on this pattern and its variations, see:
- **[Two Pointers - Converging Array](/patterns/two-pointers-converging-sorted-array-target-sum)**

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/longest-mountain-in-array/discuss/) - Community solutions
- [Two Pointers - GeeksforGeeks](https://www.geeksforgeeks.org/two-pointers-technique/) - Understanding two pointers
- [Array Scanning - GeeksforGeeks](https://www.geeksforgeeks.org/array-data-structure/) - Array manipulation
- [Pattern: Two Pointers - Converging](/patterns/two-pointers-converging-sorted-array-target-sum) - Related pattern guide
