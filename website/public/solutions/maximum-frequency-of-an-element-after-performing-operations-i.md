# Maximum Frequency Of An Element After Performing Operations I

## Problem Description

You are given an integer array `nums` and two integers `k` and `numOperations`. You must perform an operation `numOperations` times on `nums`, where in each operation you:

1. Select an index `i` that was not selected in any previous operations
2. Add an integer in the range `[-k, k]` to `nums[i]`

Return the maximum possible frequency of any element in `nums` after performing the operations.

---

## Examples

### Example 1

**Input:** `nums = [1,4,5]`, `k = 1`, `numOperations = 2`

**Output:** `2`

**Explanation:**

We can achieve a maximum frequency of two by:
- Adding `0` to `nums[1]`. `nums` becomes `[1, 4, 5]`
- Adding `-1` to `nums[2]`. `nums` becomes `[1, 4, 4]`

### Example 2

**Input:** `nums = [5,11,20,20]`, `k = 5`, `numOperations = 1`

**Output:** `2`

**Explanation:**

We can achieve a maximum frequency of two by:
- Adding `0` to `nums[1]`

---

## Constraints

- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^5`
- `0 <= k <= 10^5`
- `0 <= numOperations <= nums.length`

---

## Pattern: Sorting with Binary Search

This problem uses **sorting** combined with **binary search** to efficiently find elements within a range. After sorting, we can use binary search (`bisect_left` and `bisect_right`) to find the boundaries `[num-k, num+k]` that can be transformed to match each target number.

---

## Intuition

The key insight for this problem is understanding what elements can be transformed to match a target value:

### Key Observations

1. **Transformable Range**: An element `x` can be transformed to match target `num` if `num - k ≤ x ≤ num + k`

2. **Operations Limit**: Each element needs one operation to change. So we can transform at most `numOperations` elements.

3. **Base Frequency**: Elements already equal to `num` don't need operations - they're the "base" count.

4. **Available for Transformation**: Elements in the range but not equal to `num` can be changed with operations.

### Why Sorting Helps

After sorting:
- Elements that can transform to `num` form a contiguous range
- We can use binary search to find the boundaries quickly
- We can efficiently count elements in any range

### Algorithm Overview

1. Sort the array
2. For each unique target value `num`:
   - Find range `[num - k, num + k]` using binary search
   - Count elements in range
   - Subtract base frequency (elements already equal to num)
   - Add min(operations available, adjustable elements)
3. Return maximum found

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Sorting + Binary Search** - Optimal solution
2. **Sliding Window** - Alternative approach

---

## Approach 1: Sorting + Binary Search (Optimal)

### Algorithm Steps

1. Sort the input array
2. Count frequency of each element using Counter
3. For each unique target number:
   - Use binary search to find elements in range [num-k, num+k]
   - Calculate: base frequency + min(operations, adjustable elements)
   - Track maximum

### Why It Works

- Sorting enables binary search for range queries
- Elements in [num-k, num+k] can all be transformed to num
- We subtract the base because those are already equal
- We can only use numOperations operations

### Code Implementation

````carousel
```python
from typing import List
import bisect
from collections import Counter

class Solution:
    def maxFrequency(self, nums: List[int], k: int, numOperations: int) -> int:
        """
        Find maximum frequency after operations.
        
        Uses sorting and binary search.
        
        Args:
            nums: Input array
            k: Range parameter for transformation
            numOperations: Number of operations allowed
            
        Returns:
            Maximum possible frequency
        """
        # Step 1: Sort the array
        nums.sort()
        
        # Step 2: Count frequencies
        freq = Counter(nums)
        max_freq = 0

        # Step 3: For each unique number as target
        for num in freq:
            # Find left boundary (first element >= num - k)
            left = bisect.bisect_left(nums, num - k)
            # Find right boundary (last element <= num + k)
            right = bisect.bisect_right(nums, num + k) - 1
            
            # Total elements in range
            total = right - left + 1
            
            # Base frequency (elements already equal to num)
            base = freq[num]
            
            # Elements that need operations
            adjustable = total - base
            
            # Achievable frequency
            current = base + min(numOperations, adjustable)
            max_freq = max(max_freq, current)

        return max_freq
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int maxFrequency(vector<int>& nums, int k, int numOperations) {
        // Step 1: Sort
        sort(nums.begin(), nums.end());
        
        // Step 2: Count frequencies
        unordered_map<int, int> freq;
        for (int num : nums) {
            freq[num]++;
        }
        
        int maxFreq = 0;
        int n = nums.size();
        
        // Step 3: For each unique number
        for (auto& [num, count] : freq) {
            // Find left boundary
            int left = lower_bound(nums.begin(), nums.end(), num - k) - nums.begin();
            // Find right boundary
            int right = upper_bound(nums.begin(), nums.end(), num + k) - nums.begin() - 1;
            
            // Total in range
            int total = right - left + 1;
            
            // Adjustable elements
            int adjustable = total - count;
            
            // Current frequency
            int current = count + min(numOperations, adjustable);
            maxFreq = max(maxFreq, current);
        }
        
        return maxFreq;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int maxFrequency(int[] nums, int k, int numOperations) {
        // Step 1: Sort
        Arrays.sort(nums);
        
        // Step 2: Count frequencies
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }
        
        int maxFreq = 0;
        int n = nums.length;
        
        // Step 3: For each unique number
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            int num = entry.getKey();
            int base = entry.getValue();
            
            // Find left boundary
            int left = lowerBound(nums, num - k);
            // Find right boundary
            int right = upperBound(nums, num + k) - 1;
            
            // Total in range
            int total = right - left + 1;
            
            // Adjustable elements
            int adjustable = total - base;
            
            // Current frequency
            int current = base + Math.min(numOperations, adjustable);
            maxFreq = Math.max(maxFreq, current);
        }
        
        return maxFreq;
    }
    
    private int lowerBound(int[] arr, int target) {
        int lo = 0, hi = arr.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
    
    private int upperBound(int[] arr, int target) {
        int lo = 0, hi = arr.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] <= target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @param {number} numOperations
 * @return {number}
 */
var maxFrequency = function(nums, k, numOperations) {
    // Step 1: Sort
    nums.sort((a, b) => a - b);
    
    // Step 2: Count frequencies
    const freq = new Map();
    for (const num of nums) {
        freq.set(num, (freq.get(num) || 0) + 1);
    }
    
    let maxFreq = 0;
    
    // Helper functions for binary search
    const lowerBound = (target) => {
        let lo = 0, hi = nums.length;
        while (lo < hi) {
            const mid = Math.floor((lo + hi) / 2);
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    };
    
    const upperBound = (target) => {
        let lo = 0, hi = nums.length;
        while (lo < hi) {
            const mid = Math.floor((lo + hi) / 2);
            if (nums[mid] <= target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    };
    
    // Step 3: For each unique number
    for (const [num, base] of freq) {
        const left = lowerBound(num - k);
        const right = upperBound(num + k) - 1;
        
        const total = right - left + 1;
        const adjustable = total - base;
        
        const current = base + Math.min(numOperations, adjustable);
        maxFreq = Math.max(maxFreq, current);
    }
    
    return maxFreq;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) — Sorting dominates |
| **Space** | O(n) for frequency counter |

---

## Approach 2: Sliding Window (Alternative)

### Algorithm Steps

1. Sort the array
2. Use sliding window to find longest subarray where difference <= 2*k
3. Calculate how many operations needed and available
4. Track maximum

### Why It Works

This approach finds elements that can all be made equal in one window, then calculates operations needed vs available.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxFrequency(self, nums: List[int], k: int, numOperations: int) -> int:
        """Alternative: Sliding window approach."""
        nums.sort()
        n = len(nums)
        
        # Edge cases
        if numOperations == 0:
            # Count max frequency without operations
            freq = {}
            for num in nums:
                freq[num] = freq.get(num, 0) + 1
            return max(freq.values()) if freq else 0
        
        max_freq = 0
        left = 0
        
        for right in range(n):
            # Window: nums[left:right+1] should be transformable
            while nums[right] - nums[left] > 2 * k:
                left += 1
            
            window_size = right - left + 1
            base = 1  # At least nums[right] itself
            ops_needed = window_size - base
            ops_available = numOperations
            
            if ops_needed <= ops_available:
                max_freq = max(max_freq, window_size)
        
        return max_freq
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxFrequency(vector<int>& nums, int k, int numOperations) {
        sort(nums.begin(), nums.end());
        
        int n = nums.size();
        int maxFreq = 0;
        int left = 0;
        
        for (int right = 0; right < n; right++) {
            while (nums[right] - nums[left] > 2 * k) {
                left++;
            }
            
            int windowSize = right - left + 1;
            int opsNeeded = windowSize - 1;
            
            if (opsNeeded <= numOperations) {
                maxFreq = max(maxFreq, windowSize);
            }
        }
        
        return maxFreq;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxFrequency(int[] nums, int k, int numOperations) {
        Arrays.sort(nums);
        
        int n = nums.length;
        int maxFreq = 0;
        int left = 0;
        
        for (int right = 0; right < n; right++) {
            while (nums[right] - nums[left] > 2 * k) {
                left++;
            }
            
            int windowSize = right - left + 1;
            int opsNeeded = windowSize - 1;
            
            if (opsNeeded <= numOperations) {
                maxFreq = Math.max(maxFreq, windowSize);
            }
        }
        
        return maxFreq;
    }
}
```

<!-- slide -->
```javascript
var maxFrequency = function(nums, k, numOperations) {
    nums.sort((a, b) => a - b);
    
    let maxFreq = 0;
    let left = 0;
    
    for (let right = 0; right < nums.length; right++) {
        while (nums[right] - nums[left] > 2 * k) {
            left++;
        }
        
        const windowSize = right - left + 1;
        const opsNeeded = windowSize - 1;
        
        if (opsNeeded <= numOperations) {
            maxFreq = Math.max(maxFreq, windowSize);
        }
    }
    
    return maxFreq;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) — Sorting dominates |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Binary Search | Sliding Window |
|--------|---------------|----------------|
| **Time Complexity** | O(n log n) | O(n log n) |
| **Space Complexity** | O(n) | O(1) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Medium | Easy |

**Best Approach:** Both work well. Sliding window is more space-efficient.

---

## Related Problems

Based on similar themes (sorting, binary search, range queries):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum Beauty | [Link](https://leetcode.com/problems/maximum-beauty-of-an-array-after-applying-operation/) | Similar range concept |
| Longest Nice Subarray | [Link](https://leetcode.com/problems/longest-nice-subarray/) | Sliding window |
| Min Operations to Make Array Equal | [Link](https://leetcode.com/problems/minimum-operations-to-make-equal-elements/) | Transformation |
| Smallest Range I | [Link](https://leetcode.com/problems/smallest-range-i/) | Range adjustment |

### Pattern Reference

For more detailed explanations, see:
- **[Binary Search Pattern](/patterns/binary-search)**
- **[Sliding Window Pattern](/patterns/sliding-window)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Maximum Frequency - LeetCode 1838](https://www.youtube.com/watch?v=example)** - Clear explanation
2. **[Binary Search Tutorial](https://www.youtube.com/watch?v=example)** - Understanding bisect
3. **[Sliding Window Technique](https://www.youtube.com/watch?v=example)** - Window approach

### Related Concepts

- **[Sorting for Range Queries](https://www.youtube.com/watch?v=example)** - Why sorting helps
- **[Array Transformation](https://www.youtube.com/watch?v=example)** - Operation mechanics

---

## Follow-up Questions

### Q1: How would you find which elements to transform to achieve maximum frequency?

**Answer:** Track the indices when updating max frequency. You can also track the target value and which indices are in the valid range.

---

### Q2: What if each operation could change an element multiple times?

**Answer:** This changes the problem significantly. Multiple changes per element would allow more flexibility but requires a different approach.

---

### Q3: How would you handle the case where k is very large (larger than array range)?

**Answer:** If k is large enough to transform any element to any other, then the answer is min(n, numOperations + max base frequency).

---

### Q4: Can this be solved without sorting?

**Answer:** Without sorting, you'd need to consider all pairs which is O(n²). Sorting enables O(n log n) solution.

---

### Q5: What if numOperations could be reused (same element changed multiple times)?

**Answer:** If operations can be reused on the same element, the problem becomes easier - you could potentially make all elements equal if you have enough total operations.

---

## Common Pitfalls

### 1. Wrong Range Formula
**Issue**: Using `[num, num + k]` instead of `[num - k, num + k]`.

**Solution**: Remember elements can be decreased by k too, so range is symmetric.

### 2. Confusing Operations vs Elements
**Issue**: Using numOperations as count of elements, not operations.

**Solution**: Each element needs one operation to change. If we have 3 operations, we can change 3 elements.

### 3. Not Subtracting Base Frequency
**Issue**: Counting all elements in range as needing operations.

**Solution**: Subtract freq[num] since those are already equal.

### 4. Off-by-one in Binary Search
**Issue**: Incorrect boundary indices.

**Solution**: bisect_right returns insertion point, subtract 1 for actual index.

### 5. Empty Result
**Issue**: Not handling edge cases like numOperations = 0.

**Solution**: Handle zero operations separately - just return max base frequency.

---

## Summary

The **Maximum Frequency of an Element After Performing Operations I** problem demonstrates the power of **sorting combined with binary search** for range-based queries. The key insight is that elements transformable to a target value form a contiguous range after sorting.

Key takeaways:
1. After sorting, transformable elements form a contiguous range
2. Use binary search to find range boundaries quickly
3. Calculate: base + min(operations, adjustable)
4. Consider both increasing and decreasing (range [num-k, num+k])
5. O(n log n) solution

This problem is essential for understanding how sorting transforms range queries into efficient lookups.

### Pattern Summary

This problem exemplifies the **Sorting + Binary Search** pattern, characterized by:
- Sorting to enable contiguous property
- Binary search for efficient range queries
- Frequency counting for base values
- O(n log n) overall complexity

For more details on this pattern and its variations, see the **[Binary Search Pattern](/patterns/binary-search)**.

---

## Additional Resources

- [LeetCode Problem 1838](https://leetcode.com/problems/maximum-frequency-of-an-element-after-performing-operations-i/) - Official problem page
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Detailed explanation
- [Sorting Techniques](https://www.geeksforgeeks.org/sorting-algorithms/) - Algorithm review
- [Pattern: Binary Search](/patterns/binary-search) - Comprehensive pattern guide
