# Find Kth Smallest Pair Distance

## Problem Description

The distance of a pair of integers a and b is defined as the absolute difference between a and b.

Given an integer array nums and an integer k, return the kth smallest distance among all the pairs nums[i] and nums[j] where i < j.

**Link to problem:** [Find Kth Smallest Pair Distance - LeetCode 719](https://leetcode.com/problems/find-kth-smallest-pair-distance/)

---

## Pattern: Binary Search + Two Pointers

This problem demonstrates the **Binary Search on Answer** pattern combined with the **Two Pointers** technique. We binary search on the distance value and use two pointers to count pairs.

### Core Concept

The fundamental idea is:
- Sort the array first
- Binary search on possible distances (0 to max - min)
- For each candidate distance, count how many pairs have distance ≤ candidate using two pointers
- Find the smallest distance where count ≥ k

---

## Examples

### Example

**Input:**
```
nums = [1,3,1], k = 1
```

**Output:**
```
0
```

**Explanation:** All pairs:
- (0,1): |1-3| = 2
- (0,2): |1-1| = 0
- (1,2): |3-1| = 2

Sorted distances: [0, 2, 2]
k=1 → smallest distance is 0

### Example 2

**Input:**
```
nums = [1,1,1], k = 2
```

**Output:**
```
0
```

**Explanation:** All pairs have distance 0, so the 2nd smallest is also 0.

### Example 3

**Input:**
```
nums = [1,6,1], k = 3
```

**Output:**
```
5
```

**Explanation:**
- Pairs: (0,1):5, (0,2):0, (1,2):5
- Sorted: [0, 5, 5]
- k=3 → 3rd smallest is 5

---

## Constraints

- `2 <= nums.length <= 10^4`
- `0 <= nums[i] <= 10^6`
- `1 <= k <= n * (n - 1) / 2`

---

## Intuition

The key insight is that we can binary search on the answer:
- The minimum possible distance is 0
- The maximum possible distance is max(nums) - min(nums)
- For a given distance d, we can efficiently count pairs with distance ≤ d using two pointers
- This count is monotonic: if distance d works, any larger distance also works

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Binary Search + Two Pointers** - O(n log D) time, O(1) space (Optimal)
2. **Sort All Pairs** - O(n² log n) time (Not practical for large n)

---

## Approach 1: Binary Search + Two Pointers (Optimal)

### Algorithm Steps

1. Sort the array in ascending order
2. Set low = 0, high = nums[n-1] - nums[0]
3. While low < high:
   - mid = (low + high) / 2
   - Count pairs with distance ≤ mid using two pointers
   - If count ≥ k: high = mid
   - Else: low = mid + 1
4. Return low

### Why It Works

The count function uses two pointers: for each left pointer i, we move right pointer j until nums[j] - nums[i] ≤ mid. The number of valid pairs for this i is j - i - 1. This gives O(n) counting.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def smallestDistancePair(self, nums: List[int], k: int) -> int:
        """
        Find the kth smallest pair distance.
        
        Args:
            nums: Array of integers
            k: The kth smallest distance to find
            
        Returns:
            The kth smallest distance
        """
        nums.sort()
        n = len(nums)
        
        def count_pairs(mid: int) -> int:
            """Count pairs with distance <= mid using two pointers."""
            count = 0
            left = 0
            for right in range(n):
                while nums[right] - nums[left] > mid:
                    left += 1
                count += right - left
            return count
        
        low, high = 0, nums[-1] - nums[0]
        
        while low < high:
            mid = (low + high) // 2
            if count_pairs(mid) >= k:
                high = mid
            else:
                low = mid + 1
        
        return low
```

<!-- slide -->
```cpp
class Solution {
public:
    int smallestDistancePair(vector<int>& nums, int k) {
        /**
         * Find the kth smallest pair distance.
         * 
         * Args:
         *     nums: Array of integers
         *     k: The kth smallest distance to find
         * 
         * Returns:
         *     The kth smallest distance
         */
        sort(nums.begin(), nums.end());
        int n = nums.size();
        
        auto countPairs = [&](int mid) -> int {
            int count = 0;
            int left = 0;
            for (int right = 0; right < n; right++) {
                while (nums[right] - nums[left] > mid) {
                    left++;
                }
                count += right - left;
            }
            return count;
        };
        
        int low = 0;
        int high = nums.back() - nums.front();
        
        while (low < high) {
            int mid = (low + high) / 2;
            if (countPairs(mid) >= k) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        
        return low;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int smallestDistancePair(int[] nums, int k) {
        /**
         * Find the kth smallest pair distance.
         * 
         * Args:
         *     nums: Array of integers
         *     k: The kth smallest distance to find
         * 
         * Returns:
         *     The kth smallest distance
         */
        Arrays.sort(nums);
        int n = nums.length;
        
        int low = 0;
        int high = nums[n - 1] - nums[0];
        
        while (low < high) {
            int mid = (low + high) / 2;
            if (countPairs(nums, mid) >= k) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        
        return low;
    }
    
    private int countPairs(int[] nums, int mid) {
        int count = 0;
        int left = 0;
        for (int right = 0; right < nums.length; right++) {
            while (nums[right] - nums[left] > mid) {
                left++;
            }
            count += right - left;
        }
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the kth smallest pair distance.
 * 
 * @param {number[]} nums - Array of integers
 * @param {number} k - The kth smallest distance to find
 * @return {number} - The kth smallest distance
 */
var smallestDistancePair = function(nums, numsSize, k) {
    nums.sort((a, b) => a - b);
    const n = numsSize;
    
    const countPairs = (mid) => {
        let count = 0;
        let left = 0;
        for (let right = 0; right < n; right++) {
            while (nums[right] - nums[left] > mid) {
                left++;
            }
            count += right - left;
        }
        return count;
    };
    
    let low = 0;
    let high = nums[n - 1] - nums[0];
    
    while ( {
        const midlow < high) = Math.floor((low + high) / 2);
        if (countPairs(mid) >= k) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    
    return low;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log D) - n for counting, log D for binary search (D = max-min) |
| **Space** | O(1) - Only pointers used |

---

## Approach 2: Sort All Pairs (Not Recommended)

### Algorithm Steps

1. Generate all pairs and calculate their distances
2. Sort all distances
3. Return the k-1th element

### Why It Works

This is a brute force approach that works conceptually but is not practical for n > 1000 due to O(n²) pairs.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def smallestDistancePair_brute(self, nums: List[int], k: int) -> int:
        """
        Brute force approach - not recommended for large n.
        """
        distances = []
        n = len(nums)
        for i in range(n):
            for j in range(i + 1, n):
                distances.append(abs(nums[i] - nums[j]))
        distances.sort()
        return distances[k - 1]
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n² log n) - Generate and sort n² pairs |
| **Space** | O(n²) - Store all pair distances |

---

## Comparison of Approaches

| Aspect | Binary Search + Two Pointers | Sort All Pairs |
|--------|------------------------------|----------------|
| **Time** | O(n log D) | O(n² log n) |
| **Space** | O(1) | O(n²) |
| **Practical** | Yes | No (n > 1000) |
| **LeetCode Optimal** | ✅ Yes | ❌ No |

**Best Approach:** Binary search with two pointers is the optimal solution.

---

## Related Problems

Based on similar themes (binary search on answer, two pointers):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Kth Smallest Element in a Sorted Matrix | [Link](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) | Similar binary search |
| Find K Pairs with Smallest Sums | [Link](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) | K smallest pairs |
| Minimum Distance Between BST Nodes | [Link](https://leetcode.com/problems/minimum-distance-between-bst-nodes/) | BST pair distance |
| Array Nesting | [Link](https://leetcode.com/problems/array-nesting/) | Pair counting |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Binary Search on Answer

- [NeetCode - Kth Smallest Pair Distance](https://www.youtube.com/watch?v=4OQ6GnqauaI) - Clear explanation with visual examples
- [Binary Search on Distance](https://www.youtube.com/watch?v=T7hLyG0D2iU) - Detailed walkthrough
- [Two Pointers Technique](https://www.youtube.com/watch?v=8jP8CCrj8cI) - Understanding two pointers

---

## Follow-up Questions

### Q1: Why do we sort the array first?

**Answer:** Sorting enables the two-pointer technique. Once sorted, for a fixed left pointer, as we increase the right pointer, the distance only increases. This allows us to efficiently count pairs with distance ≤ mid in O(n) time.

---

### Q2: How does the two-pointer counting work?

**Answer:** For each left pointer i, we move right pointer j forward until the distance exceeds mid. All indices from i to j-1 form valid pairs with i. We add (j - i) to the count and move to the next left pointer. Since both pointers only move forward, total time is O(n).

---

### Q3: Why is binary search valid here?

**Answer:** The predicate "count of pairs with distance ≤ d is at least k" is monotonic: if it's true for distance d, it's also true for any distance > d. This monotonicity enables binary search.

---

### Q4: What is the range of possible distances?

**Answer:** The minimum is 0 (if there are duplicate elements), and the maximum is nums[n-1] - nums[0] (difference between max and min elements).

---

### Q5: How would you handle very large k values?

**Answer:** The algorithm handles all valid k values (1 to n*(n-1)/2). The binary search will find the exact kth smallest distance regardless of k's magnitude.

---

### Q6: Can we solve this without binary search?

**Answer:** We could use a min-heap approach similar to merging k sorted arrays, but that would be O(k log n) which is worse than O(n log D) when k is large.

---

### Q7: What edge cases should be tested?

**Answer:**
- All elements are the same (answer is 0)
- Array has only 2 elements (answer is the distance between them)
- k is the maximum possible (n*(n-1)/2)
- Elements are in descending order (sorting handles this)

---

### Q8: How would you modify for "kth largest" instead?

**Answer:** Instead of finding smallest distance where count ≥ k, find largest distance where count ≤ total_pairs - k + 1. Or equivalently, use the same binary search but change the condition.

---

## Common Pitfalls

### 1. Counting Logic Error
**Issue:** Incorrect pair counting formula.

**Solution:** Remember: for each left, count = j - i (where j is first index with distance > mid).

### 2. Off-by-One in Binary Search
**Issue:** Incorrect boundary conditions.

**Solution:** Use while low < high, and adjust accordingly based on whether count >= k.

### 3. Integer Overflow
**Issue:** For large numbers in Python it's handled automatically, but in C++/Java be careful with multiplication.

**Solution:** Use long long in C++/Java for intermediate calculations.

---

## Summary

The **Find Kth Smallest Pair Distance** problem demonstrates:

- **Binary Search on Answer**: Searching for the smallest distance that satisfies a condition
- **Two Pointers**: Efficient pair counting in sorted array
- **Time Complexity**: O(n log D) where D is the range of distances
- **Space Complexity**: O(1)

This problem is an excellent example of combining two classic techniques (binary search and two pointers) to solve a seemingly complex problem efficiently.

For more details on this pattern, see the **[Binary Search on Answer](/algorithms/binary-search/binary-search-on-answer)**.
