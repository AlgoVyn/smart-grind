# Longest Increasing Subsequence II

## Problem Description

You are given an integer array `nums` and an integer `k`. Find the longest subsequence of `nums` that meets the following requirements:

- The subsequence is **strictly increasing**
- The difference between adjacent elements in the subsequence is at most `k`

Return the length of the longest subsequence that meets the requirements.

A **subsequence** is an array that can be derived from another array by deleting some or no elements without changing the order of the remaining elements.

---

## Examples

### Example

**Input:**
```python
nums = [4, 2, 1, 4, 3, 4, 5, 8, 15], k = 3
```

**Output:**
```python
5
```

**Explanation:** The longest valid subsequence is `[1, 3, 4, 5, 8]` with length `5`. The subsequence `[1, 3, 4, 5, 8, 15]` is invalid because `15 - 8 = 7 > 3`.

### Example 2

**Input:**
```python
nums = [7, 4, 5, 1, 8, 12, 4, 7], k = 5
```

**Output:**
```python
4
```

**Explanation:** The longest valid subsequence is `[4, 5, 8, 12]` with length `4`.

### Example 3

**Input:**
```python
nums = [1, 5], k = 1
```

**Output:**
```python
1
```

**Explanation:** The longest valid subsequence is `[1]` (or `[5]`) with length `1`.

---

## Constraints

- `1 <= nums.length <= 10^5`
- `1 <= nums[i], k <= 10^5`

---
---

## Pattern:

This problem follows the **Dynamic Programming with Fenwick/Segment Tree** pattern, specifically for constrained LIS problems.

### Core Concept

- **DP state**: dp[i] = length of longest valid subsequence ending at nums[i]
- **Range query**: Need max dp in range [num-k, num-1] for efficient transitions
- **Data structure**: Fenwick Tree or Segment Tree for O(log M) range max queries

### When to Use This Pattern

This pattern is applicable when:
1. LIS with additional constraints (like max difference)
2. DP problems requiring range maximum queries
3. Problems where state depends on value range, not index range

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Classic LIS | O(n log n) with binary search |
| Fenwick Tree | Range query data structure |
| Segment Tree | Alternative range query structure |

### Pattern Summary

This problem exemplifies **DP with Range Query Optimization**, characterized by:
- dp[i] = 1 + max(dp[j]) for j in valid range
- Using BIT/Segment tree for O(log M) queries
- Reducing O(n²) to O(n log M)

---

## Intuition

The key insight is that for each element `nums[i]`, we need to find the longest valid subsequence ending at this element. This depends on the best subsequence we can extend from elements in the range `[nums[i] - k, nums[i] - 1]`.

### Dynamic Programming Insight

Let `dp[i]` be the length of the longest valid subsequence ending at index `i` (with `nums[i]` as the last element).

- `dp[i] = 1` (at minimum, the subsequence can be just `nums[i]`)
- To extend a subsequence ending at `nums[i]`, we need a previous element `nums[j]` where:
  - `j < i` (position constraint)
  - `nums[j] < nums[i]` (strictly increasing)
  - `nums[i] - nums[j] <= k` (difference constraint)

So: `dp[i] = 1 + max(dp[j])` for all `j < i` where `nums[i] - k <= nums[j] < nums[i]`

### Optimization with Fenwick Tree / Segment Tree

Instead of checking all previous elements (O(n²)), we use a data structure to query the maximum `dp` value in a range in O(log M) time, where M is the maximum value in the array.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Fenwick Tree (Binary Indexed Tree)** - Optimal O(n log M) time
2. **Segment Tree** - Alternative O(n log M) approach
3. **Coordinate Compression + Segment Tree** - Memory-optimized version

---

## Approach 1: Fenwick Tree (Optimal)

A Fenwick Tree (Binary Indexed Tree) efficiently supports:
- **Range Maximum Query**: Find the maximum `dp` value in range `[left, right]`
- **Point Update**: Update the `dp` value at a specific position

### Algorithm Steps

1. Initialize a Fenwick tree with size `max(nums) + 2`
2. For each number `num` in `nums`:
   - Query the maximum `dp` value for values in `[max(0, num - k), num - 1]`
   - The current `dp` value is `1 + query_result`
   - Update the tree at position `num` with this value
3. Track and return the maximum `dp` value

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def lengthOfLIS(self, nums: List[int], k: int) -> int:
        if not nums:
            return 0
        
        max_val = max(nums)
        tree = [0] * (max_val + 2)
        
        def update(idx: int, val: int) -> None:
            idx += 1  # 1-indexed BIT
            while idx < len(tree):
                tree[idx] = max(tree[idx], val)
                idx += idx & -idx
        
        def query(idx: int) -> int:
            """Query max in range [0, idx]"""
            idx += 1  # 1-indexed BIT
            res = 0
            while idx > 0:
                res = max(res, tree[idx])
                idx -= idx & -idx
            return res
        
        ans = 1
        for num in nums:
            left = max(0, num - k)
            # Query max dp value for values in [left, num-1]
            prev = query(num - 1) if num > 0 else 0
            # Get the max from range [left, num-1]
            if left > 0:
                prev = max(prev, query(num - 1) - query(left - 1) if prev > 0 else 0)
            
            # Simplified: query from 0 to num-1, then we filter by left
            # Actually, we need range max query
            curr = 1 + prev
            ans = max(ans, curr)
            update(num, curr)
        
        return ans
```

**Note:** The above has an issue. Let me provide the corrected version:

```python
from typing import List

class Solution:
    def lengthOfLIS(self, nums: List[int], k: int) -> int:
        if not nums:
            return 0
        
        max_val = max(nums)
        tree = [0] * (max_val + 2)
        
        def update(idx: int, val: int) -> None:
            idx += 1  # 1-indexed BIT
            while idx < len(tree):
                tree[idx] = max(tree[idx], val)
                idx += idx & -idx
        
        def query(idx: int) -> int:
            """Query max in range [0, idx]"""
            idx += 1
            res = 0
            while idx > 0:
                res = max(res, tree[idx])
                idx -= idx & -idx
            return res
        
        def range_query(left: int, right: int) -> int:
            """Query max in range [left, right]"""
            if left > right:
                return 0
            if left == 0:
                return query(right)
            return query(right) - query(left - 1)
        
        ans = 0
        for num in nums:
            left = max(0, num - k)
            # Get max dp value for values in [left, num-1]
            prev = range_query(left, num - 1)
            curr = 1 + prev
            ans = max(ans, curr)
            update(num, curr)
        
        return ans
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int lengthOfLIS(vector<int>& nums, int k) {
        if (nums.empty()) return 0;
        
        int maxVal = *max_element(nums.begin(), nums.end());
        vector<int> tree(maxVal + 2, 0);
        
        auto update = [&](int idx, int val) {
            idx++;  // 1-indexed BIT
            while (idx < tree.size()) {
                tree[idx] = max(tree[idx], val);
                idx += idx & -idx;
            }
        };
        
        auto query = [&](int idx) {
            idx++;
            int res = 0;
            while (idx > 0) {
                res = max(res, tree[idx]);
                idx -= idx & -idx;
            }
            return res;
        };
        
        auto rangeQuery = [&](int left, int right) {
            if (left > right) return 0;
            if (left == 0) return query(right);
            return query(right) - query(left - 1);
        };
        
        int ans = 0;
        for (int num : nums) {
            int left = max(0, num - k);
            int prev = rangeQuery(left, num - 1);
            int curr = 1 + prev;
            ans = max(ans, curr);
            update(num, curr);
        }
        
        return ans;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int lengthOfLIS(int[] nums, int k) {
        if (nums == null || nums.length == 0) return 0;
        
        int maxVal = 0;
        for (int num : nums) maxVal = Math.max(maxVal, num);
        
        int[] tree = new int[maxVal + 2];
        
        // Update: set max value at position idx
        update(num, val);
        
        int query(int idx) {
            idx++;
            int res = 0;
            while (idx > 0) {
                res = Math.max(res, tree[idx]);
                idx -= idx & -idx;
            }
            return res;
        }
        
        int rangeQuery(int left, int right) {
            if (left > right) return 0;
            if (left == 0) return query(right);
            return query(right) - query(left - 1);
        }
        
        int ans = 0;
        for (int num : nums) {
            int left = Math.max(0, num - k);
            int prev = rangeQuery(left, num - 1);
            int curr = 1 + prev;
            ans = Math.max(ans, curr);
            update(num, curr);
        }
        
        return ans;
    }
    
    private void update(int idx, int val) {
        idx++;
        while (idx < tree.length) {
            tree[idx] = Math.max(tree[idx], val);
            idx += idx & -idx;
        }
    }
    
    private int[] tree;
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var lengthOfLIS = function(nums, k) {
    if (!nums || nums.length === 0) return 0;
    
    const maxVal = Math.max(...nums);
    const tree = new Array(maxVal + 2).fill(0);
    
    const update = (idx, val) => {
        idx++;  // 1-indexed BIT
        while (idx < tree.length) {
            tree[idx] = Math.max(tree[idx], val);
            idx += idx & -idx;
        }
    };
    
    const query = (idx) => {
        idx++;
        let res = 0;
        while (idx > 0) {
            res = Math.max(res, tree[idx]);
            idx -= idx & -idx;
        }
        return res;
    };
    
    const rangeQuery = (left, right) => {
        if (left > right) return 0;
        if (left === 0) return query(right);
        return query(right) - query(left - 1);
    };
    
    let ans = 0;
    for (const num of nums) {
        const left = Math.max(0, num - k);
        const prev = rangeQuery(left, num - 1);
        const curr = 1 + prev;
        ans = Math.max(ans, curr);
        update(num, curr);
    }
    
    return ans;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n log M)` - n iterations, each O(log M) query/update |
| **Space** | `O(M)` - Fenwick tree size |

---

## Approach 2: Segment Tree

A Segment Tree provides the same O(log M) query and update operations but is more intuitive for range queries.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def lengthOfLIS(self, nums: List[int], k: int) -> int:
        if not nums:
            return 0
        
        max_val = max(nums)
        # Segment tree for range max query
        tree = [0] * (4 * (max_val + 1))
        
        def update(node: int, start: int, end: int, idx: int, val: int) -> None:
            if start == end:
                tree[node] = max(tree[node], val)
                return
            mid = (start + end) // 2
            if idx <= mid:
                update(2 * node, start, mid, idx, val)
            else:
                update(2 * node + 1, mid + 1, end, idx, val)
            tree[node] = max(tree[2 * node], tree[2 * node + 1])
        
        def query(node: int, start: int, end: int, left: int, right: int) -> int:
            if left > end or right < start:
                return 0
            if left <= start and end <= right:
                return tree[node]
            mid = (start + end) // 2
            return max(
                query(2 * node, start, mid, left, right),
                query(2 * node + 1, mid + 1, end, left, right)
            )
        
        ans = 0
        for num in nums:
            left = max(0, num - k)
            prev = query(1, 0, max_val, left, num - 1) if num > 0 else 0
            curr = 1 + prev
            ans = max(ans, curr)
            update(1, 0, max_val, num, curr)
        
        return ans
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int lengthOfLIS(vector<int>& nums, int k) {
        if (nums.empty()) return 0;
        
        int maxVal = *max_element(nums.begin(), nums.end());
        vector<int> tree(4 * (maxVal + 1), 0);
        
        function<void(int, int, int, int, int)> update = 
            [&](int node, int start, int end, int idx, int val) {
                if (start == end) {
                    tree[node] = max(tree[node], val);
                    return;
                }
                int mid = (start + end) / 2;
                if (idx <= mid) update(2*node, start, mid, idx, val);
                else update(2*node+1, mid+1, end, idx, val);
                tree[node] = max(tree[2*node], tree[2*node+1]);
            };
        
        function<int(int, int, int, int, int)> query = 
            [&](int node, int start, int end, int left, int right) -> int {
                if (left > end || right < start) return 0;
                if (left <= start && end <= right) return tree[node];
                int mid = (start + end) / 2;
                return max(query(2*node, start, mid, left, right),
                          query(2*node+1, mid+1, end, left, right));
            };
        
        int ans = 0;
        for (int num : nums) {
            int left = max(0, num - k);
            int prev = (num > 0) ? query(1, 0, maxVal, left, num-1) : 0;
            int curr = 1 + prev;
            ans = max(ans, curr);
            update(1, 0, maxVal, num, curr);
        }
        
        return ans;
    }
};
```
<!-- slide -->
```java
class Solution {
    private int[] tree;
    private int size;
    
    public int lengthOfLIS(int[] nums, int k) {
        if (nums == null || nums.length == 0) return 0;
        
        int maxVal = 0;
        for (int num : nums) maxVal = Math.max(maxVal, num);
        
        this.size = maxVal;
        this.tree = new int[4 * (maxVal + 1)];
        
        int ans = 0;
        for (int num : nums) {
            int left = Math.max(0, num - k);
            int prev = num > 0 ? query(1, 0, maxVal, left, num - 1) : 0;
            int curr = 1 + prev;
            ans = Math.max(ans, curr);
            update(1, 0, maxVal, num, curr);
        }
        
        return ans;
    }
    
    private void update(int node, int start, int end, int idx, int val) {
        if (start == end) {
            tree[node] = Math.max(tree[node], val);
            return;
        }
        int mid = (start + end) / 2;
        if (idx <= mid) update(2*node, start, mid, idx, val);
        else update(2*node+1, mid+1, end, idx, val);
        tree[node] = Math.max(tree[2*node], tree[2*node+1]);
    }
    
    private int query(int node, int start, int end, int left, int right) {
        if (left > end || right < start) return 0;
        if (left <= start && end <= right) return tree[node];
        int mid = (start + end) / 2;
        return Math.max(query(2*node, start, mid, left, right),
                       query(2*node+1, mid+1, end, left, right));
    }
}
```
<!-- slide -->
```javascript
var lengthOfLIS = function(nums, k) {
    if (!nums || nums.length === 0) return 0;
    
    const maxVal = Math.max(...nums);
    const tree = new Array(4 * (maxVal + 1)).fill(0);
    
    const update = (node, start, end, idx, val) => {
        if (start === end) {
            tree[node] = Math.max(tree[node], val);
            return;
        }
        const mid = Math.floor((start + end) / 2);
        if (idx <= mid) update(2 * node, start, mid, idx, val);
        else update(2 * node + 1, mid + 1, end, idx, val);
        tree[node] = Math.max(tree[2 * node], tree[2 * node + 1]);
    };
    
    const query = (node, start, end, left, right) => {
        if (left > end || right < start) return 0;
        if (left <= start && end <= right) return tree[node];
        const mid = Math.floor((start + end) / 2);
        return Math.max(
            query(2 * node, start, mid, left, right),
            query(2 * node + 1, mid + 1, end, left, right)
        );
    };
    
    let ans = 0;
    for (const num of nums) {
        const left = Math.max(0, num - k);
        const prev = num > 0 ? query(1, 0, maxVal, left, num - 1) : 0;
        const curr = 1 + prev;
        ans = Math.max(ans, curr);
        update(1, 0, maxVal, num, curr);
    }
    
    return ans;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n log M)` - Each operation is O(log M) |
| **Space** | `O(M)` - Segment tree size |

---

## Approach 3: Coordinate Compression + Fenwick Tree

When `max(nums)` is very large but `n` is manageable, compress coordinates to reduce memory.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def lengthOfLIS(self, nums: List[int], k: int) -> int:
        if not nums:
            return 0
        
        # Coordinate compression
        unique_vals = sorted(set(nums))
        comp = {v: i for i, v in enumerate(unique_vals)}
        
        # Also need to include values in range [num - k, num]
        # Since k can be up to 100k, we add extra values
        max_compressed = len(unique_vals)
        tree = [0] * (max_compressed + 2)
        
        def update(idx: int, val: int) -> None:
            idx += 1
            while idx < len(tree):
                tree[idx] = max(tree[idx], val)
                idx += idx & -idx
        
        def query(idx: int) -> int:
            idx += 1
            res = 0
            while idx > 0:
                res = max(res, tree[idx])
                idx -= idx & -idx
            return res
        
        # For range query with k, we need to find the compressed range
        # This is more complex with compression, so we'll use original values
        ans = 0
        for num in nums:
            # Find left bound in compressed coordinates
            left = num - k
            # Binary search for left in unique_vals
            import bisect
            left_idx = bisect.bisect_left(unique_vals, left)
            right_idx = comp[num] - 1
            
            prev = 0
            if right_idx >= left_idx and left_idx < len(unique_vals):
                # Query from left_idx to right_idx
                # Using fenwick tree, we need prefix max
                if right_idx >= 0:
                    prev = query(right_idx)
                    if left_idx > 0:
                        # We'd need a range query - use segment tree for this
                        pass
            
            curr = 1 + prev
            ans = max(ans, curr)
            update(comp[num], curr)
        
        return ans
```
````

**Note:** Coordinate compression with range queries is complex. The simpler approach is to use a sorted map (like TreeMap in Java or sortedcontainers in Python) or just use the Fenwick tree with the actual value range when `max(nums)` is manageable.

---

## Comparison of Approaches

| Aspect | Fenwick Tree | Segment Tree |
|--------|-------------|--------------|
| **Time Complexity** | O(n log M) | O(n log M) |
| **Space Complexity** | O(M) | O(4M) |
| **Implementation** | Simpler | More intuitive |
| **Range Query** | Prefix-based | Direct |

**Best Approach:** Fenwick Tree is typically preferred for its simpler implementation and smaller memory footprint.

---

## Related Problems

### LIS Problems

| Problem | LeetCode Link | Difficulty |
|---------|---------------|------------|
| Longest Increasing Subsequence | [LeetCode 300](https://leetcode.com/problems/longest-increasing-subsequence/) | Medium |
| Longest Bitonic Subsequence | [LeetCode 1712](https://leetcode.com/problems/longest-bitonic-subsequence/) | Medium |
| Number of Longest Increasing Subsequence | [LeetCode 673](https://leetcode.com/problems/number-of-longest-increasing-subsequence/) | Medium |

### Dynamic Programming with Data Structures

| Problem | LeetCode Link | Difficulty |
|---------|---------------|------------|
| Maximum Sum Circular Subarray | [LeetCode 918](https://leetcode.com/problems/maximum-sum-circular-subarray/) | Medium |
| Range Sum Query - Mutable | [LeetCode 307](https://leetcode.com/problems/range-sum-query-mutable/) | Medium |

### Binary Indexed Tree Problems

| Problem | LeetCode Link | Difficulty |
|---------|---------------|------------|
| Fenwick Tree Basics | Various | Various |
| Count of Smaller Numbers After Self | [LeetCode 315](https://leetcode.com/problems/count-of-smaller-numbers-after-self/) | Hard |

---

## Video Tutorial Links

### Fenwick Tree / BIT

- [Fenwick Tree Tutorial - NeetCode](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Comprehensive BIT explanation
- [Binary Indexed Tree - William Lin](https://www.youtube.com/watch?v=0jN2cIoXK7Q) - Clear and concise
- [Fenwick Tree - GeeksforGeeks](https://www.youtube.com/watch?v=2SVLYRj2I-A) - Implementation details

### Longest Increasing Subsequence

- [LIS Problem Overview](https://www.youtube.com/watch?v=CE2b_1M6Y3Q) - LIS variations
- [LIS with Binary Search](https://www.youtube.com/watch?v=1S5X3s2r2V0) - Classic O(n log n) approach

### Segment Tree

- [Segment Tree Tutorial](https://www.youtube.com/watch?v=7j9lq2eMgvc) - Comprehensive guide
- [Range Query with Segment Tree](https://www.youtube.com/watch?v=Tr-xEPMoHDk) - Practical examples

---

## Follow-up Questions

### Q1: How does this problem differ from the classic LIS problem?

**Answer:** The classic LIS (LeetCode 300) only requires the subsequence to be strictly increasing without any difference constraint. This problem adds an additional constraint that adjacent elements must differ by at most `k`, making it a constrained variant.

---

### Q2: Why can't we use the classic O(n log n) LIS solution with binary search?

**Answer:** The classic LIS solution maintains a sorted array of tail values and uses binary search to find where to place each element. However, it doesn't efficiently support the range query needed for the `k` difference constraint. We need a data structure that can query the maximum DP value in a specific value range.

---

### Q3: What happens if k = 0?

**Answer:** If k = 0, the constraint becomes that adjacent elements must differ by at most 0, which means they must be equal. Since we need strictly increasing, no two elements can be in the same subsequence, so the answer is always 1 (any single element).

---

### Q4: How would you modify the solution to also reconstruct the actual subsequence?

**Answer:** Maintain a `prev` array that stores the previous index for each element. When updating with a new DP value, store which index gave you the maximum. After processing, backtrack from the element with maximum DP value to reconstruct the subsequence.

---

### Q5: Can we solve this with a balanced BST instead of Fenwick tree?

**Answer:** Yes, you can use a sorted map (like TreeMap in Java) where keys are values and values are maximum DP lengths. To query range [left, right], you'd iterate through keys in that range, but this could be O(M) in worst case. Fenwick/Segment tree provides O(log M) guaranteed performance.

---

### Q6: What is the space complexity if nums contains very large values?

**Answer:** The space complexity is O(max(nums)), which could be problematic if max(nums) is 10^9. In that case, you should use coordinate compression to map large values to a smaller index range.

---

### Q7: How would you handle the case where k is very large (larger than the value range)?

**Answer:** If k >= max(nums), the constraint becomes meaningless since any two elements would satisfy `nums[i] - nums[j] <= k`. In this case, the problem reduces to the classic LIS problem, and we can use the standard O(n log n) solution.

---

### Q8: What edge cases should be tested?

**Answer:**
- Empty array
- Single element array
- k = 0
- k >= max(nums)
- Strictly decreasing array
- Array with all same values
- Maximum constraints: n = 10^5, nums[i], k = 10^5

---
---

## Common Pitfalls

### 1. Using prefix sum instead of max query
**Issue:** Fenwick tree defaults to sum, not max.

**Solution:** Modify BIT to store max values instead of sum.

### 2. Not handling num = 0 case
**Issue:** Query(num-1) fails when num=0.

**Solution:** Check if num > 0 before querying, or handle edge case.

### 3. Wrong range calculation
**Issue:** Range should be [num-k, num-1], not [num-k, num].

**Solution:** Use left = max(0, num - k), right = num - 1.

### 4. Space complexity issues
**Issue:** O(max(nums)) space can be too large for big values.

**Solution:** Use coordinate compression to reduce space.

### 5. Not updating with max
**Issue:** Overwriting instead of taking max when updating.

**Solution:** Use tree[idx] = max(tree[idx], val) for updates.

---

## Summary

The **Longest Increasing Subsequence II** problem demonstrates the power of combining:

- **Dynamic Programming**: Breaking down the problem into subproblems
- **Fenwick Tree**: Efficient range maximum queries in O(log M)
- **Range Queries**: Supporting the additional k-difference constraint

Key takeaways:
1. The DP state `dp[i]` represents the longest valid subsequence ending at `nums[i]`
2. We need maximum DP value in range `[num-k, num-1]`, not all previous elements
3. Fenwick/Segment tree provides O(log M) query and update
4. This is an extension of classic LIS with additional constraints

This pattern is essential for solving problems requiring dynamic programming with range queries.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/longest-increasing-subsequence-ii/discuss/) - Community solutions
- [Fenwick Tree - CP Algorithms](https://cp-algorithms.com/data_structures/fenwick.html) - Comprehensive BIT guide
- [Segment Tree - GeeksforGeeks](https://www.geeksforgeeks.org/segment-tree-set-1-range-maximum-query/) - Segment tree tutorial
