# Jump Game VI

## Problem Description

You are given a 0-indexed integer array `nums` and an integer `k`. You are initially standing at index `0`. In one move, you can jump at most `k` steps forward without going outside the boundaries of the array. That is, you can jump from index `i` to any index in the range `[i + 1, min(n - 1, i + k)]` inclusive.

You want to reach the last index of the array (index `n - 1`). Your score is the sum of all `nums[j]` for each index `j` you visited in the array. Return the maximum score you can get.

## Examples

### Example 1

**Output:** `7`

**Explanation:** You can choose your jumps forming the subsequence `[1,-1,4,3]`. The sum is `7`.

### Example 2

**Input:** `nums = [10,-5,-2,4,0,3], k = 3`

**Output:** `17`

**Explanation:** You can choose your jumps forming the subsequence `[10,4,3]`. The sum is `17`.

### Example 3

**Input:** `nums = [1,-5,-20,4,-1,3,-6,-3], k = 2`

**Output:** `0`

---

## Constraints

- `1 <= nums.length, k <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

---

## Pattern: Dynamic Programming with Sliding Window Maximum

This problem is a classic example of the **Dynamic Programming with Sliding Window Maximum** pattern. The pattern involves using a deque to maintain the maximum value in a sliding window while computing dynamic programming values.

### Core Concept

The fundamental idea is:
- **Dynamic Programming**: Each position's maximum score depends on the maximum score from the previous k positions
- **Sliding Window**: We need to find the maximum dp value within a sliding window of size k
- **Deque Optimization**: Use a monotonic deque to efficiently maintain the maximum in O(1) time

---

## Intuition

The key insight is that to find the maximum score at position `i`, we need to consider all possible previous positions we could have jumped from (within k steps). The maximum score at `i` is `nums[i] + max(dp[j])` where `j` is in the range `[i-k, i-1]`.

Instead of computing this maximum naively (O(k) per step), we use a deque to maintain indices in decreasing order of their dp values. This allows O(1) access to the maximum while keeping the overall time at O(n).

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Deque-based DP (Optimal)** - O(n) time, O(k) space
2. **Segment Tree** - O(n log k) time, O(n) space

---

## Approach 1: Deque-based Dynamic Programming (Optimal)

This is the most efficient approach with O(n) time complexity. We use a monotonic deque to maintain the maximum dp value in the sliding window.

### Algorithm Steps

1. Initialize dp array and deque
2. For each index i from 1 to n-1:
   - Remove indices from deque front that are outside the window (index < i - k)
   - Calculate dp[i] = nums[i] + dp[deque[0]]
   - Remove indices from deque back that have dp value <= current dp[i]
   - Add current index to deque
3. Return dp[n-1]

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def maxResult(self, nums: List[int], k: int) -> int:
        """
        Find the maximum score to reach the last index.
        
        Args:
            nums: Array of integers representing scores at each position
            k: Maximum jump length
            
        Returns:
            Maximum score to reach the last index
        """
        n = len(nums)
        dp = [0] * n
        dp[0] = nums[0]
        dq = deque([0])  # Store indices in decreasing order of dp values
        
        for i in range(1, n):
            # Remove indices that are out of the sliding window
            while dq and dq[0] < i - k:
                dq.popleft()
            
            # Current maximum score to reach index i
            dp[i] = nums[i] + dp[dq[0]]
            
            # Maintain decreasing order of dp values in the deque
            while dq and dp[dq[-1]] <= dp[i]:
                dq.pop()
            
            dq.append(i)
        
        return dp[-1]
```

<!-- slide -->
```cpp
#include <vector>
#include <deque>
using namespace std;

class Solution {
public:
    /**
     * Find the maximum score to reach the last index.
     */
    int maxResult(vector<int>& nums, int k) {
        int n = nums.size();
        vector<int> dp(n, 0);
        dp[0] = nums[0];
        deque<int> dq;  // Store indices in decreasing order of dp values
        dq.push_back(0);
        
        for (int i = 1; i < n; i++) {
            // Remove indices that are out of the sliding window
            while (!dq.empty() && dq.front() < i - k) {
                dq.pop_front();
            }
            
            // Current maximum score to reach index i
            dp[i] = nums[i] + dp[dq.front()];
            
            // Maintain decreasing order of dp values in the deque
            while (!dq.empty() && dp[dq.back()] <= dp[i]) {
                dq.pop_back();
            }
            
            dq.push_back(i);
        }
        
        return dp[n - 1];
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int maxResult(int[] nums, int k) {
        int n = nums.length;
        int[] dp = new int[n];
        dp[0] = nums[0];
        
        // Deque stores indices in decreasing order of dp values
        Deque<Integer> dq = new LinkedList<>();
        dq.offer(0);
        
        for (int i = 1; i < n; i++) {
            // Remove indices that are out of the sliding window
            while (!dq.isEmpty() && dq.peekFirst() < i - k) {
                dq.pollFirst();
            }
            
            // Current maximum score to reach index i
            dp[i] = nums[i] + dp[dq.peekFirst()];
            
            // Maintain decreasing order of dp values in the deque
            while (!dq.isEmpty() && dp[dq.peekLast()] <= dp[i]) {
                dq.pollLast();
            }
            
            dq.offerLast(i);
        }
        
        return dp[n - 1];
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the maximum score to reach the last index.
 * 
 * @param {number[]} nums - Array of integers representing scores at each position
 * @param {number} k - Maximum jump length
 * @return {number} - Maximum score to reach the last index
 */
var maxResult = function(nums, k) {
    const n = nums.length;
    const dp = new Array(n).fill(0);
    dp[0] = nums[0];
    
    // Deque stores indices in decreasing order of dp values
    const dq = [0];
    
    for (let i = 1; i < n; i++) {
        // Remove indices that are out of the sliding window
        while (dq.length > 0 && dq[0] < i - k) {
            dq.shift();
        }
        
        // Current maximum score to reach index i
        dp[i] = nums[i] + dp[dq[0]];
        
        // Maintain decreasing order of dp values in the deque
        while (dq.length > 0 && dp[dq[dq.length - 1]] <= dp[i]) {
            dq.pop();
        }
        
        dq.push(i);
    }
    
    return dp[n - 1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each index is added and removed from deque at most once |
| **Space** | O(k) - Deque stores at most k indices, dp array is O(n) |

---

## Approach 2: Segment Tree

This approach uses a segment tree to maintain the maximum dp value in any range. While less efficient than the deque approach, it demonstrates an alternative data structure solution.

### Algorithm Steps

1. Build a segment tree that supports range maximum queries and point updates
2. For each index i, query the maximum dp value in range [max(0, i-k), i-1]
3. Calculate dp[i] = nums[i] + max_query_result
4. Update the segment tree with dp[i]
5. Return dp[n-1]

### Code Implementation

````carousel
```python
class SegmentTree:
    def __init__(self, n):
        self.n = n
        self.size = 1
        while self.size < n:
            self.size *= 2
        self.tree = [float('-inf')] * (2 * self.size)
    
    def update(self, idx, val):
        pos = idx + self.size
        self.tree[pos] = val
        pos //= 2
        while pos:
            self.tree[pos] = max(self.tree[2*pos], self.tree[2*pos+1])
            pos //= 2
    
    def query(self, left, right):
        if left > right:
            return float('-inf')
        left += self.size
        right += self.size
        result = float('-inf')
        while left <= right:
            if left % 2 == 1:
                result = max(result, self.tree[left])
                left += 1
            if right % 2 == 0:
                result = max(result, self.tree[right])
                right -= 1
            left //= 2
            right //= 2
        return result

class Solution:
    def maxResult(self, nums: List[int], k: int) -> int:
        n = len(nums)
        dp = [0] * n
        dp[0] = nums[0]
        
        seg = SegmentTree(n)
        seg.update(0, dp[0])
        
        for i in range(1, n):
            left = max(0, i - k)
            max_prev = seg.query(left, i - 1)
            dp[i] = nums[i] + max_prev
            seg.update(i, dp[i])
        
        return dp[-1]
```

<!-- slide -->
```cpp
class SegmentTree {
    int n;
    vector<int> tree;
public:
    SegmentTree(int n) : n(n) {
        tree.resize(4 * n, INT_MIN);
    }
    
    void update(int idx, int val) {
        update(1, 0, n - 1, idx, val);
    }
    
    void update(int node, int l, int r, int idx, int val) {
        if (l == r) {
            tree[node] = val;
            return;
        }
        int mid = (l + r) / 2;
        if (idx <= mid) update(node * 2, l, mid, idx, val);
        else update(node * 2 + 1, mid + 1, r, idx, val);
        tree[node] = max(tree[node * 2], tree[node * 2 + 1]);
    }
    
    int query(int left, int right) {
        return query(1, 0, n - 1, left, right);
    }
    
    int query(int node, int l, int r, int left, int right) {
        if (left > right) return INT_MIN;
        if (left == l && right == r) return tree[node];
        int mid = (l + r) / 2;
        return max(query(node * 2, l, mid, left, min(mid, right)),
                   query(node * 2 + 1, mid + 1, r, max(left, mid + 1), right));
    }
};

class Solution {
public:
    int maxResult(vector<int>& nums, int k) {
        int n = nums.size();
        vector<int> dp(n, 0);
        dp[0] = nums[0];
        
        SegmentTree seg(n);
        seg.update(0, dp[0]);
        
        for (int i = 1; i < n; i++) {
            int left = max(0, i - k);
            int maxPrev = seg.query(left, i - 1);
            dp[i] = nums[i] + maxPrev;
            seg.update(i, dp[i]);
        }
        
        return dp[n - 1];
    }
};
```

<!-- slide -->
```java
class SegmentTree {
    int n;
    int[] tree;
    
    SegmentTree(int n) {
        this.n = n;
        tree = new int[4 * n];
        Arrays.fill(tree, Integer.MIN_VALUE);
    }
    
    void update(int idx, int val) {
        update(1, 0, n - 1, idx, val);
    }
    
    void update(int node, int l, int r, int idx, int val) {
        if (l == r) {
            tree[node] = val;
            return;
        }
        int mid = (l + r) / 2;
        if (idx <= mid) update(node * 2, l, mid, idx, val);
        else update(node * 2 + 1, mid + 1, r, idx, val);
        tree[node] = Math.max(tree[node * 2], tree[node * 2 + 1]);
    }
    
    int query(int left, int right) {
        return query(1, 0, n - 1, left, right);
    }
    
    int query(int node, int l, int r, int left, int right) {
        if (left > right) return Integer.MIN_VALUE;
        if (left == l && right == r) return tree[node];
        int mid = (l + r) / 2;
        return Math.max(query(node * 2, l, mid, left, Math.min(mid, right)),
                        query(node * 2 + 1, mid + 1, r, Math.max(left, mid + 1), right));
    }
}

class Solution {
    public int maxResult(int[] nums, int k) {
        int n = nums.length;
        int[] dp = new int[n];
        dp[0] = nums[0];
        
        SegmentTree seg = new SegmentTree(n);
        seg.update(0, dp[0]);
        
        for (int i = 1; i < n; i++) {
            int left = Math.max(0, i - k);
            int maxPrev = seg.query(left, i - 1);
            dp[i] = nums[i] + maxPrev;
            seg.update(i, dp[i]);
        }
        
        return dp[n - 1];
    }
}
```

<!-- slide -->
```javascript
class SegmentTree {
    constructor(n) {
        this.n = n;
        this.tree = new Array(4 * n).fill(-Infinity);
    }
    
    update(idx, val) {
        this.updateHelper(1, 0, this.n - 1, idx, val);
    }
    
    updateHelper(node, l, r, idx, val) {
        if (l === r) {
            this.tree[node] = val;
            return;
        }
        const mid = Math.floor((l + r) / 2);
        if (idx <= mid) this.updateHelper(node * 2, l, mid, idx, val);
        else this.updateHelper(node * 2 + 1, mid + 1, r, idx, val);
        this.tree[node] = Math.max(this.tree[node * 2], this.tree[node * 2 + 1]);
    }
    
    query(left, right) {
        return this.queryHelper(1, 0, this.n - 1, left, right);
    }
    
    queryHelper(node, l, r, left, right) {
        if (left > right) return -Infinity;
        if (left === l && right === r) return this.tree[node];
        const mid = Math.floor((l + r) / 2);
        return Math.max(
            this.queryHelper(node * 2, l, mid, left, Math.min(mid, right)),
            this.queryHelper(node * 2 + 1, mid + 1, r, Math.max(left, mid + 1), right)
        );
    }
}

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maxResult = function(nums, k) {
    const n = nums.length;
    const dp = new Array(n).fill(0);
    dp[0] = nums[0];
    
    const seg = new SegmentTree(n);
    seg.update(0, dp[0]);
    
    for (let i = 1; i < n; i++) {
        const left = Math.max(0, i - k);
        const maxPrev = seg.query(left, i - 1);
        dp[i] = nums[i] + maxPrev;
        seg.update(i, dp[i]);
    }
    
    return dp[n - 1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log k) - Each query and update is O(log n) |
| **Space** | O(n) - Segment tree requires 4n space |

---

## Comparison of Approaches

| Aspect | Deque-based DP | Segment Tree |
|--------|---------------|--------------|
| **Time Complexity** | O(n) | O(n log k) |
| **Space Complexity** | O(k) | O(n) |
| **Implementation** | Moderate | Complex |
| **LeetCode Optimal** | ✅ Yes | ❌ No |
| **Best For** | Large k values | Flexible range queries |

**Best Approach:** The deque-based approach (Approach 1) is optimal with O(n) time and O(k) space complexity, making it the preferred solution.

---

## Why Deque is Optimal for This Problem

The deque approach with monotonic decreasing order is optimal because:

1. **Single Pass**: Each element is processed exactly once
2. **Efficient Maximum**: Maintains O(1) maximum retrieval in sliding window
3. **Memory Efficient**: Only stores at most k indices in the deque
4. **No Redundant Comparisons**: Removes elements that will never be the maximum
5. **Industry Standard**: Widely used for sliding window maximum problems

The key insight is that we only need to keep track of potential maximum values. When a new value comes in, any smaller values that came before it are never going to be the maximum in any future window, so they're removed from the deque.

---

## Related Problems

Based on similar themes (dynamic programming, sliding window, deque optimization):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Jump Game II | [Link](https://leetcode.com/problems/jump-game-ii/) | Minimum jumps to reach end |
| Jump Game | [Link](https://leetcode.com/problems/jump-game/) | Can we reach the end? |
| Sliding Window Maximum | [Link](https://leetcode.com/problems/sliding-window-maximum/) | Maximum in each window |
| Maximum Number of Ways to Form a Target | [Link](https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary/) | DP with constraints |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Cost to Reach Destination in Time | [Link](https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/) | DP with time constraints |
| Maximum Number of Tasks You Can Assign | [Link](https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign/) | Binary search with deque |

### Pattern Reference

For more detailed explanations of the Dynamic Programming with Sliding Window pattern and its variations, see:
- **[Dynamic Programming with Sliding Window Pattern](/patterns/dynamic-programming-sliding-window)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Deque-based Approach

- [NeetCode - Jump Game VI](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Clear explanation with visual examples
- [Jump Game VI - LeetCode Solution](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough
- [Dynamic Programming with Deque](https://www.youtube.com/watch?v=8jP8CCrj8cI) - Understanding the technique

### Sliding Window Concepts

- [Sliding Window Maximum - Theory](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Complete guide
- [Monotonic Deque Explained](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - In-depth explanation

---

## Follow-up Questions

### Q1: Can you solve it with O(n log n) time using a priority queue?

**Answer:** Yes! You can use a max-heap (priority queue) to always get the maximum dp value. However, you need to handle stale elements by checking if they're still within the window before using them. This gives O(n log n) time complexity.

---

### Q2: What is the difference between using a deque vs segment tree?

**Answer:**
- **Deque**: O(n) time, O(k) space - more efficient but only works for sliding window maximum
- **Segment Tree**: O(n log k) time, O(n) space - more versatile for different range queries

---

### Q3: How would you modify the solution to minimize jumps instead of maximizing score?

**Answer:** Change the dp formulation to store minimum jumps instead of maximum score. The recurrence becomes: dp[i] = 1 + min(dp[j]) for j in [i-k, i-1]. Use a min-heap or monotonic increasing deque.

---

### Q4: What if k equals n (can jump to any position)?

**Answer:** When k >= n, you can jump directly from any position to any later position. The solution simplifies to finding the maximum suffix sum, which can be computed in O(n) by tracking the maximum dp value seen so far.

---

### Q5: How would you track the actual path, not just the maximum score?

**Answer:** Maintain a parent array that stores the previous index that gave the maximum dp value. Backtrack from the last index to reconstruct the path.

---

### Q6: What edge cases should be tested?

**Answer:**
- Single element array
- All positive numbers
- All negative numbers
- k = 1 (can only move one step)
- k >= n (can jump anywhere)
- Mixed positive and negative numbers

---

### Q7: How would you handle very large k values (k > n)?

**Answer:** Clamp the window size to min(k, i) since we can't look back beyond index 0. The deque logic handles this naturally since we only remove indices when dq[0] < i - k.

---

## Common Pitfalls

### 1. Window Boundary
**Issue**: Not properly handling the window boundaries when k > i.

**Solution**: Use max(0, i-k) as the left boundary for the window.

### 2. Deque Order
**Issue**: Not maintaining the deque in decreasing order of dp values.

**Solution**: While dp[dq.back()] <= dp[i], pop from back before adding current index.

### 3. Negative Values
**Issue**: Assuming maximum will always be positive.

**Solution**: Initialize dp[0] = nums[0] and handle negative values correctly in the deque.

### 4. Index Management
**Issue**: Incorrectly managing deque indices.

**Solution**: Always check if dq[0] < i - k before using the front element.

---

## Summary

The **Jump Game VI** problem demonstrates the power of combining dynamic programming with efficient data structures:

- **Deque-based approach**: Optimal with O(n) time and O(k) space
- **Segment Tree approach**: Alternative with O(n log k) time and O(n) space
- **Key insight**: Use monotonic deque to maintain maximum in sliding window

The optimal solution uses a monotonic decreasing deque to efficiently track the maximum dp value in the sliding window. Each element is added and removed at most once, giving O(n) total time complexity.

This problem is an excellent demonstration of how understanding the problem constraints and leveraging the right data structure can lead to an optimal solution.

### Pattern Summary

This problem exemplifies the **Dynamic Programming with Sliding Window Maximum** pattern, which is characterized by:
- Using dynamic programming to compute optimal substructure
- Maintaining a sliding window of valid previous states
- Using a monotonic deque for O(1) maximum retrieval
- Achieving O(n) time complexity with O(k) space

For more details on this pattern and its variations, see the **[Dynamic Programming with Sliding Window Pattern](/patterns/dynamic-programming-sliding-window)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/jump-game-vi/discuss/) - Community solutions and explanations
- [Sliding Window Maximum - GeeksforGeeks](https://www.geeksforgeeks.org/sliding-window-maximum/) - Detailed explanation
- [Monotonic Queue - CP Algorithms](https://cp-algorithms.com/data_structures/stack_queue_modification.html) - Understanding monotonic queues
- [Dynamic Programming - Topcoder Tutorial](https://www.topcoder.com/thrive/articles/Dynamic%20Programming%20-%20From%20Novice%20to%20Advanced) - DP fundamentals
