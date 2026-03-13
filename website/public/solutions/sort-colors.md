# Sort Colors

## Problem Description

Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.

We will use the integers `0`, `1`, and `2` to represent the color red, white, and blue, respectively.

You must solve this problem without using the library's sort function.

**Link to problem:** [Sort Colors - LeetCode 75](https://leetcode.com/problems/sort-colors/)

## Examples

**Example 1:**
```
Input: nums = [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]
```

**Example 2:**
```
Input: nums = [2,0,1]
Output: [0,1,2]
```

## Constraints

- `n == nums.length`
- `1 <= n <= 300`
- `nums[i]` is either `0`, `1`, or `2`.

---

## Pattern: Three-Pointer (Dutch National Flag)

This problem is a classic example of the **Dutch National Flag** algorithm, proposed by Edsger Dijkstra. The pattern uses three pointers to partition an array into three sections in a single pass.

### Core Concept

The fundamental idea is to use **three pointers** to divide the array into four regions:
- **[0, low)**: All zeros (red)
- **[low, mid)**: All ones (white)
- **[mid, high]**: Unsorted/unprocessed elements
- **(high, n-1]**: All twos (blue)

---

## Examples

### Example

**Input:**
```
nums = [2,0,2,1,1,0]
```

**Output:**
```
[0,0,1,1,2,2]
```

**Explanation:**
- Initially: low=0, mid=0, high=5
- Process each element, moving mid forward
- After processing: [0,0,1,1,2,2]

### Example 2

**Input:**
```
nums = [2,0,1]
```

**Output:**
```
[0,1,2]
```

**Explanation:**
- The array is sorted to have all 0s first, then 1s, then 2s

---

## Intuition

The key insight is that we need to sort an array with only three distinct values. Instead of using a full sorting algorithm, we can use a partitioning approach:

1. **Three-way partitioning**: Divide the array into three sections in one pass
2. **Single pass**: Process each element exactly once
3. **In-place**: No extra space required

### Why Three Pointers?

- **low**: Boundary for zeros (all elements before low are zeros)
- **mid**: Current element being processed
- **high**: Boundary for twos (all elements after high are twos)

This approach ensures O(n) time with O(1) space, which is optimal for this problem.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Dutch National Flag (Optimal)** - O(n) time, O(1) space
2. **Two-pass Counting** - O(n) time, O(1) space
3. **Simple Swap with Single Pointer** - O(n²) time, O(1) space

---

## Approach 1: Dutch National Flag (Optimal)

This is the classic Dijkstra algorithm that solves the problem in a single pass.

### Algorithm Steps

1. Initialize three pointers:
   - `low = 0` (boundary for zeros)
   - `mid = 0` (current element)
   - `high = len(nums) - 1` (boundary for twos)

2. While `mid <= high`:
   - If `nums[mid] == 0`: swap `nums[low]` and `nums[mid]`, increment both `low` and `mid`
   - If `nums[mid] == 1`: just increment `mid`
   - If `nums[mid] == 2`: swap `nums[mid]` and `nums[high]`, decrement `high`

3. The array is now sorted with 0s, then 1s, then 2s

### Why It Works

The algorithm maintains three invariants:
- All elements before `low` are zeros
- All elements between `low` and `mid-1` are ones
- All elements after `high` are twos
- Elements between `mid` and `high` are unprocessed

By processing each element once and moving pointers appropriately, we achieve sorting in a single pass.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def sortColors(self, nums: List[int]) -> None:
        """
        Sort colors using Dutch National Flag algorithm.
        
        Args:
            nums: List of 0s (red), 1s (white), and 2s (blue)
            
        Returns:
            None - sorts in-place
        """
        if not nums:
            return
            
        low = 0
        mid = 0
        high = len(nums) - 1
        
        while mid <= high:
            if nums[mid] == 0:
                # Swap nums[low] and nums[mid]
                nums[low], nums[mid] = nums[mid], nums[low]
                low += 1
                mid += 1
            elif nums[mid] == 1:
                # Already in correct position
                mid += 1
            else:  # nums[mid] == 2
                # Swap nums[mid] and nums[high]
                nums[mid], nums[high] = nums[high], nums[mid]
                high -= 1
                # Don't increment mid here because the element swapped 
                # from high needs to be processed
```

<!-- slide -->
```cpp
class Solution {
public:
    /**
     * Sort colors using Dutch National Flag algorithm.
     *
     * @param nums: Vector of 0s (red), 1s (white), and 2s (blue)
     */
    void sortColors(vector<int>& nums) {
        if (nums.empty()) {
            return;
        }
        
        int low = 0;
        int mid = 0;
        int high = nums.size() - 1;
        
        while (mid <= high) {
            if (nums[mid] == 0) {
                // Swap nums[low] and nums[mid]
                swap(nums[low], nums[mid]);
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                // Already in correct position
                mid++;
            } else { // nums[mid] == 2
                // Swap nums[mid] and nums[high]
                swap(nums[mid], nums[high]);
                high--;
                // Don't increment mid here
            }
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    /**
     * Sort colors using Dutch National Flag algorithm.
     *
     * @param nums: Array of 0s (red), 1s (white), and 2s (blue)
     */
    public void sortColors(int[] nums) {
        if (nums == null || nums.length == 0) {
            return;
        }
        
        int low = 0;
        int mid = 0;
        int high = nums.length - 1;
        
        while (mid <= high) {
            if (nums[mid] == 0) {
                // Swap nums[low] and nums[mid]
                int temp = nums[low];
                nums[low] = nums[mid];
                nums[mid] = temp;
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                // Already in correct position
                mid++;
            } else { // nums[mid] == 2
                // Swap nums[mid] and nums[high]
                int temp = nums[mid];
                nums[mid] = nums[high];
                nums[high] = temp;
                high--;
                // Don't increment mid here
            }
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Sort colors using Dutch National Flag algorithm.
 * 
 * @param {number[]} nums - Array of 0s (red), 1s (white), and 2s (blue)
 */
var sortColors = function(nums) {
    if (!nums || nums.length === 0) {
        return;
    }
    
    let low = 0;
    let mid = 0;
    let high = nums.length - 1;
    
    while (mid <= high) {
        if (nums[mid] === 0) {
            // Swap nums[low] and nums[mid]
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++;
            mid++;
        } else if (nums[mid] === 1) {
            // Already in correct position
            mid++;
        } else { // nums[mid] === 2
            // Swap nums[mid] and nums[high]
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
            // Don't increment mid here
        }
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is processed at most once |
| **Space** | O(1) - Only three pointers used |

---

## Approach 2: Two-Pass Counting

This approach counts the number of each color first, then rewrites the array.

### Algorithm Steps

1. Count the number of 0s, 1s, and 2s in the array
2. Rewrite the array by placing the counted number of each color

### Why It Works

Since we know there are only three colors, counting them first and then rewriting is straightforward. This is a classic trade-off: extra pass for simplicity.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def sortColors_counting(self, nums: List[int]) -> None:
        """
        Sort colors using two-pass counting.
        """
        if not nums:
            return
            
        # Count occurrences of each color
        count = [0, 0, 0]
        for num in nums:
            count[num] += 1
        
        # Rewrite the array
        idx = 0
        for color in range(3):
            for _ in range(count[color]):
                nums[idx] = color
                idx += 1
```

<!-- slide -->
```cpp
class Solution {
public:
    void sortColors(vector<int>& nums) {
        if (nums.empty()) return;
        
        // Count occurrences of each color
        vector<int> count(3, 0);
        for (int num : nums) {
            count[num]++;
        }
        
        // Rewrite the array
        int idx = 0;
        for (int color = 0; color < 3; color++) {
            for (int i = 0; i < count[color]; i++) {
                nums[idx++] = color;
            }
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    public void sortColors(int[] nums) {
        if (nums == null || nums.length == 0) return;
        
        // Count occurrences of each color
        int[] count = new int[3];
        for (int num : nums) {
            count[num]++;
        }
        
        // Rewrite the array
        int idx = 0;
        for (int color = 0; color < 3; color++) {
            for (int i = 0; i < count[color]; i++) {
                nums[idx++] = color;
            }
        }
    }
}
```

<!-- slide -->
```javascript
var sortColors = function(nums) {
    if (!nums || nums.length === 0) return;
    
    // Count occurrences of each color
    const count = [0, 0, 0];
    for (const num of nums) {
        count[num]++;
    }
    
    // Rewrite the array
    let idx = 0;
    for (let color = 0; color < 3; color++) {
        for (let i = 0; i < count[color]; i++) {
            nums[idx++] = color;
        }
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Two passes through the array |
| **Space** | O(1) - Only three counters used |

---

## Approach 3: Simple Swap with Single Pointer

A simpler but less efficient approach using repeated swaps.

### Algorithm Steps

1. For each position from 0 to n-1:
   - If current element is 0, swap it with the first non-zero element
   - This is essentially bubble sort specialized for 3 colors

### Why It Works

This is a simplified version that works but is not optimal. It's included for educational purposes to show why the Dutch National Flag is better.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def sortColors_simple(self, nums: List[int]) -> None:
        """
        Simple approach - not optimal.
        """
        if not nums:
            return
            
        n = len(nums)
        # Place all 0s at the beginning
        for i in range(n):
            if nums[i] == 0:
                # Find a non-zero to swap with
                for j in range(i + 1, n):
                    if nums[j] != 0:
                        nums[i], nums[j] = nums[j], nums[i]
                        break
        
        # Place all 1s after 0s
        for i in range(n):
            if nums[i] == 1:
                for j in range(i + 1, n):
                    if nums[j] != 1:
                        nums[i], nums[j] = nums[j], nums[i]
                        break
```

<!-- slide -->
```cpp
class Solution {
public:
    void sortColors(vector<int>& nums) {
        if (nums.empty()) return;
        
        int n = nums.size();
        
        // Place all 0s at the beginning
        for (int i = 0; i < n; i++) {
            if (nums[i] == 0) {
                for (int j = i + 1; j < n; j++) {
                    if (nums[j] != 0) {
                        swap(nums[i], nums[j]);
                        break;
                    }
                }
            }
        }
        
        // Place all 1s after 0s
        for (int i = 0; i < n; i++) {
            if (nums[i] == 1) {
                for (int j = i + 1; j < n; j++) {
                    if (nums[j] != 1) {
                        swap(nums[i], nums[j]);
                        break;
                    }
                }
            }
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    public void sortColors(int[] nums) {
        if (nums == null || nums.length == 0) return;
        
        int n = nums.length;
        
        // Place all 0s at the beginning
        for (int i = 0; i < n; i++) {
            if (nums[i] == 0) {
                for (int j = i + 1; j < n; j++) {
                    if (nums[j] != 0) {
                        int temp = nums[i];
                        nums[i] = nums[j];
                        nums[j] = temp;
                        break;
                    }
                }
            }
        }
        
        // Place all 1s after 0s
        for (int i = 0; i < n; i++) {
            if (nums[i] == 1) {
                for (int j = i + 1; j < n; j++) {
                    if (nums[j] != 1) {
                        int temp = nums[i];
                        nums[i] = nums[j];
                        nums[j] = temp;
                        break;
                    }
                }
            }
        }
    }
}
```

<!-- slide -->
```javascript
var sortColors = function(nums) {
    if (!nums || nums.length === 0) return;
    
    const n = nums.length;
    
    // Place all 0s at the beginning
    for (let i = 0; i < n; i++) {
        if (nums[i] === 0) {
            for (let j = i + 1; j < n; j++) {
                if (nums[j] !== 0) {
                    [nums[i], nums[j]] = [nums[j], nums[i]];
                    break;
                }
            }
        }
    }
    
    // Place all 1s after 0s
    for (let i = 0; i < n; i++) {
        if (nums[i] === 1) {
            for (let j = i + 1; j < n; j++) {
                if (nums[j] !== 1) {
                    [nums[i], nums[j]] = [nums[j], nums[i]];
                    break;
                }
            }
        }
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Nested loops |
| **Space** | O(1) - No extra space |

---

## Comparison of Approaches

| Aspect | Dutch National Flag | Two-Pass Counting | Simple Swap |
|--------|---------------------|-------------------|-------------|
| **Time Complexity** | O(n) | O(n) | O(n²) |
| **Space Complexity** | O(1) | O(1) | O(1) |
| **Implementation** | Moderate | Simple | Simple |
| **Passes** | 1 | 2 | Multiple |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |

**Best Approach:** Dutch National Flag algorithm (Approach 1) is the optimal solution with O(n) time and O(1) space.

---

## Why Dutch National Flag is Optimal

The Dutch National Flag algorithm is optimal because:

1. **Single Pass**: Processes each element exactly once
2. **In-Place**: No extra array needed
3. **Optimal Time**: O(n) is the best possible for comparison-based sorting
4. **Elegant**: Three pointers elegantly maintain invariants
5. **Generalizable**: Can be extended to more than 3 colors

The key insight is that by using three pointers, we can partition the array in a single pass, avoiding the need for multiple passes or additional data structures.

---

## Related Problems

Based on similar themes (sorting, partitioning, three-way division):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Move Zeroes | [Link](https://leetcode.com/problems/move-zeroes/) | Similar two-pointer partition |
| Remove Element | [Link](https://leetcode.com/problems/remove-element/) | In-place element removal |
| First Unique Number | [Link](https://leetcode.com/problems/first-unique-number/) | Stream data structure |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Sort Array by Parity | [Link](https://leetcode.com/problems/sort-array-by-parity/) | Two-way partition |
| Partition Labels | [Link](https://leetcode.com/problems/partition-labels/) | Partition based on characters |
| Wiggle Sort | [Link](https://leetcode.com/problems/wiggle-sort/) | Alternating sorted order |

### Pattern Reference

For more detailed explanations of partitioning patterns, see:
- **[Three-Pointer Pattern](/patterns/three-pointer)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Dutch National Flag Algorithm

- [NeetCode - Sort Colors](https://www.youtube.com/watch?v=4xbWSRZHqac) - Clear explanation with visual examples
- [Back to Back SWE - Sort Colors](https://www.youtube.com/watch?v=4pYfDbaEju8) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=ypn0a0nC7PA) - Official problem solution
- [Dutch National Flag Explained](https://www.youtube.com/watch?v=7KFKRidxp9M) - Historical context and algorithm

### Related Concepts

- [Three Pointer Technique](https://www.youtube.com/watch?v=YXce4WGQ8Xw) - Understanding three pointers
- [Partitioning Arrays](https://www.youtube.com/watch?v=nG2Vht5B9b4) - Array partitioning techniques

---

## Follow-up Questions

### Q1: Can you solve it without the Dutch National Flag algorithm?

**Answer:** Yes! The two-pass counting approach first counts the occurrences of each color (0, 1, 2), then rewrites the array. This is O(n) time and O(1) space but requires two passes.

---

### Q2: How would you extend this to sort k colors?

**Answer:** You can generalize the Dutch National Flag algorithm to k colors using k-1 pointers. The general approach is to maintain k-1 boundaries, creating k sections. Each element is compared and swapped into its correct section. This is known as the "rainbow sort" problem.

---

### Q3: What if the input array is extremely large and doesn't fit in memory?

**Answer:** For external sorting (data too large for memory), you'd need to use a different approach:
- Count occurrences using a hash map in a first pass
- Write sorted chunks to disk
- Merge sorted chunks

The in-place swapping approaches won't work for out-of-memory scenarios.

---

### Q4: How would you handle more than three colors efficiently?

**Answer:** For k colors, you can use a generalization of the Dutch National Flag:
- Maintain k pointers (boundaries between colors)
- Iterate through the array once
- At each step, compare the current element to the boundaries and swap accordingly
- This is O(n*k) time but O(k) space for the pointers

Alternatively, use counting sort which is O(n+k) time.

---

### Q5: What edge cases should be tested?

**Answer:**
- Empty array
- Single element array
- All same color (all 0s, all 1s, or all 2s)
- Two colors only (e.g., only 0s and 2s)
- Already sorted array
- Reverse sorted array
- Array with alternating colors

---

### Q6: Why don't we increment mid after swapping with high (when nums[mid] == 2)?

**Answer:** When we swap nums[mid] with nums[high], the element from nums[high] (which was a 2) goes to nums[mid]. We decrement high to exclude it from the unsorted region. However, the new nums[mid] (formerly nums[high]) hasn't been processed yet, so we shouldn't increment mid. We need to process this new element in the next iteration.

---

### Q7: Can this algorithm be used for stable sorting?

**Answer:** The basic Dutch National Flag algorithm is not stable by default. For a stable version, you'd need a different approach, as the swaps can change the relative order of equal elements. If stability is required, consider using a counting-based approach.

---

### Q8: How would you modify to sort in descending order?

**Answer:** Simply swap the handling of 0 and 2:
- 2s go to the beginning (low section)
- 0s go to the end (high section)
- 1s stay in the middle

Or reverse the final array after sorting in ascending order.

---

## Common Pitfalls

### 1. Forgetting to Increment Mid After Zero Swap
**Issue**: After swapping with low, forgetting to increment both pointers.

**Solution**: Always increment both low and mid after swapping a zero.

### 2. Not Decrementing High After Two Swap
**Issue**: After swapping a 2, the new element at mid hasn't been processed.

**Solution**: Only decrement high after swapping a 2, don't increment mid.

### 3. Using Wrong Loop Condition
**Issue**: Using mid < high instead of mid <= high.

**Solution**: Use <= to ensure the last element is processed.

### 4. Not Handling Empty Array
**Issue**: Not checking for empty or null input.

**Solution**: Add early return for empty arrays.

### 5. Confusing Pointers
**Issue**: Mixing up low, mid, and high pointers during implementation.

**Solution**: Clearly comment the purpose of each pointer in the code.

---

## Summary

The **Sort Colors** problem demonstrates the elegant **Dutch National Flag algorithm**:

- **Dutch National Flag**: Optimal O(n) time, O(1) space solution
- **Three pointers**: low, mid, high divide array into sections
- **Single pass**: Each element processed exactly once
- **In-place**: No extra array needed

The key insight is that with only three distinct values, we can partition the array in a single pass using three pointers. This is much more efficient than general sorting algorithms.

This problem is an excellent demonstration of how understanding problem constraints can lead to optimal solutions.

### Pattern Summary

This problem exemplifies the **Three-Pointer** pattern, which is characterized by:
- Using multiple pointers to divide array into sections
- Processing elements in a single pass
- Achieving O(1) space complexity
- Handling limited number of distinct values

For more details on this pattern and its variations, see the **[Three-Pointer Pattern](/patterns/three-pointer)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/sort-colors/discuss/) - Community solutions and explanations
- [Dutch National Flag - Wikipedia](https://en.wikipedia.org/wiki/Dutch_national_flag_problem) - Original algorithm by Dijkstra
- [Three Pointer Technique - GeeksforGeeks](https://www.geeksforgeeks.org/sort-an-array-of-0s-1s-and-2s/) - Detailed explanation
- [Pattern: Three-Pointer](/patterns/three-pointer) - Comprehensive pattern guide
