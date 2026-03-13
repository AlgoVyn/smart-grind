# Jump Game

## Problem Description

You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.

**Link to problem:** [Jump Game - LeetCode 55](https://leetcode.com/problems/jump-game/)

---

## Examples

### Example

| Input | Output |
|-------|--------|
| `nums = [2,3,1,1,4]` | `true` |

**Explanation:** Jump 1 step from index 0 to 1, then 3 steps to the last index.

### Example 2

| Input | Output |
|-------|--------|
| `nums = [3,2,1,0,4]` | `false` |

**Explanation:** You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.

---

## Constraints

- `1 <= nums.length <= 10^4`
- `0 <= nums[i] <= 10^5`

---

## Pattern: Greedy - Maximum Reach

This problem demonstrates the **Greedy** pattern, where we track the farthest position we can reach. The key insight is that we don't need to know the exact path - just whether we can reach the end.

### Core Concept

1. Track the farthest index reachable at any point
2. If the farthest reach is >= last index, we can win
3. If current index exceeds farthest reach, we're stuck

---

## Intuition

### Why Greedy Works

- At each position, we know the maximum jump length
- We can always choose a smaller jump if needed
- The question is: can we reach the end, not which jumps to take

### Visual Example

```
nums = [2,3,1,1,4]

Index 0: Can reach 0+2=2 (indices 0,1,2)
Index 1: Can reach 1+3=4 (indices 0,1,2,3,4) ✓
Index 2: Can reach 2+1=3
Index 3: Can reach 3+1=4
Index 4: Can reach 4+4=8

Farthest reachable = 4 >= last index 4 → True
```

---

## Multiple Approaches with Code

## Approach 1: Greedy - Track Maximum Reach (Optimal)

This is the standard O(n) solution using greedy approach.

````carousel
```python
from typing import List

class Solution:
    def canJump(self, nums: List[int]) -> bool:
        """
        Check if can reach end using greedy approach.
        
        Args:
            nums: Array where nums[i] is max jump from position i
            
        Returns:
            True if can reach last index
        """
        farthest = 0  # Maximum index reachable
        n = len(nums)
        
        for i in range(n):
            # If current index is beyond farthest, we're stuck
            if i > farthest:
                return False
            
            # Update farthest reach
            farthest = max(farthest, i + nums[i])
            
            # Early exit if we can reach the end
            if farthest >= n - 1:
                return True
        
        return farthest >= n - 1
```
<!-- slide -->
```cpp
class Solution {
public:
    bool canJump(vector<int>& nums) {
        int farthest = 0;  // Maximum index reachable
        int n = nums.size();
        
        for (int i = 0; i < n; i++) {
            // If current index is beyond farthest, we're stuck
            if (i > farthest) {
                return false;
            }
            
            // Update farthest reach
            farthest = max(farthest, i + nums[i]);
            
            // Early exit if we can reach the end
            if (farthest >= n - 1) {
                return true;
            }
        }
        
        return farthest >= n - 1;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean canJump(int[] nums) {
        int farthest = 0;  // Maximum index reachable
        int n = nums.length;
        
        for (int i = 0; i < n; i++) {
            // If current index is beyond farthest, we're stuck
            if (i > farthest) {
                return false;
            }
            
            // Update farthest reach
            farthest = Math.max(farthest, i + nums[i]);
            
            // Early exit if we can reach the end
            if (farthest >= n - 1) {
                return true;
            }
        }
        
        return farthest >= n - 1;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    let farthest = 0;  // Maximum index reachable
    const n = nums.length;
    
    for (let i = 0; i < n; i++) {
        // If current index is beyond farthest, we're stuck
        if (i > farthest) {
            return false;
        }
        
        // Update farthest reach
        farthest = Math.max(farthest, i + nums[i]);
        
        // Early exit if we can reach the end
        if (farthest >= n - 1) {
            return true;
        }
    }
    
    return farthest >= n - 1;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n) - single pass through array |
| **Space** | O(1) - only tracking one variable |

---

## Approach 2: Backward Greedy

Start from the last position and work backwards.

````carousel
```python
from typing import List

class Solution:
    def canJump_backward(self, nums: List[int]) -> bool:
        """
        Check using backward greedy approach.
        """
        n = len(nums)
        last_pos = n - 1  # Target position
        
        # Work backwards
        for i in range(n - 2, -1, -1):
            # If we can reach last_pos from i, update last_pos
            if i + nums[i] >= last_pos:
                last_pos = i
        
        # If we can reach position 0, we can win
        return last_pos == 0
```
<!-- slide -->
```cpp
class Solution {
public:
    bool canJump(vector<int>& nums) {
        int n = nums.size();
        int last_pos = n - 1;  // Target position
        
        // Work backwards
        for (int i = n - 2; i >= 0; i--) {
            // If we can reach last_pos from i, update last_pos
            if (i + nums[i] >= last_pos) {
                last_pos = i;
            }
        }
        
        // If we can reach position 0, we can win
        return last_pos == 0;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean canJump(int[] nums) {
        int n = nums.length;
        int last_pos = n - 1;  // Target position
        
        // Work backwards
        for (int i = n - 2; i >= 0; i--) {
            // If we can reach last_pos from i, update last_pos
            if (i + nums[i] >= last_pos) {
                last_pos = i;
            }
        }
        
        // If we can reach position 0, we can win
        return last_pos == 0;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    const n = nums.length;
    let last_pos = n - 1;  // Target position
    
    // Work backwards
    for (let i = n - 2; i >= 0; i--) {
        // If we can reach last_pos from i, update last_pos
        if (i + nums[i] >= last_pos) {
            last_pos = i;
        }
    }
    
    // If we can reach position 0, we can win
    return last_pos === 0;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n) - single pass backwards |
| **Space** | O(1) |

---

## Approach 3: BFS/DFS (Less Efficient)

Treat as a graph traversal problem.

````carousel
```python
from typing import List

class Solution:
    def canJump_bfs(self, nums: List[int]) -> bool:
        """
        Check using BFS approach.
        """
        n = len(nums)
        visited = set()
        queue = [0]
        
        while queue:
            i = queue.pop(0)
            
            if i == n - 1:
                return True
            
            if i in visited:
                continue
            visited.add(i)
            
            # Add all reachable positions
            for j in range(i + 1, min(i + nums[i] + 1, n)):
                if j not in visited:
                    queue.append(j)
        
        return False
```
<!-- slide -->
```cpp
class Solution {
public:
    bool canJump(vector<int>& nums) {
        int n = nums.size();
        vector<bool> visited(n, false);
        queue<int> q;
        q.push(0);
        
        while (!q.empty()) {
            int i = q.front();
            q.pop();
            
            if (i == n - 1) return true;
            if (visited[i]) continue;
            visited[i] = true;
            
            // Add all reachable positions
            for (int j = i + 1; j < min(i + nums[i] + 1, n); j++) {
                if (!visited[j]) q.push(j);
            }
        }
        
        return false;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean canJump(int[] nums) {
        int n = nums.length;
        boolean[] visited = new boolean[n];
        Queue<Integer> queue = new LinkedList<>();
        queue.add(0);
        
        while (!queue.isEmpty()) {
            int i = queue.poll();
            
            if (i == n - 1) return true;
            if (visited[i]) continue;
            visited[i] = true;
            
            // Add all reachable positions
            for (int j = i + 1; j < Math.min(i + nums[i] + 1, n); j++) {
                if (!visited[j]) queue.add(j);
            }
        }
        
        return false;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    const n = nums.length;
    const visited = new Set();
    const queue = [0];
    
    while (queue.length > 0) {
        const i = queue.shift();
        
        if (i === n - 1) return true;
        if (visited.has(i)) continue;
        visited.add(i);
        
        // Add all reachable positions
        for (let j = i + 1; j < Math.min(i + nums[i] + 1, n); j++) {
            if (!visited.has(j)) queue.push(j);
        }
    }
    
    return false;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n²) in worst case |
| **Space** | O(n) |

---

## Comparison of Approaches

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| **Greedy (Forward)** | O(n) | O(1) | Best, most common |
| **Greedy (Backward)** | O(n) | O(1) | Alternative |
| **BFS/DFS** | O(n²) | O(n) | Overkill for this problem |

**Best Approach:** Greedy - Track Maximum Reach (Approach 1) is optimal.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very commonly asked in technical interviews
- **Companies**: Google, Meta, Amazon, Apple, Microsoft
- **Difficulty**: Medium (but often classified as Easy)
- **Concepts**: Greedy, array traversal

### Key Insights

1. We don't need the exact path, just whether we can reach
2. Track the farthest position reachable at any point
3. If we can reach farther, we can always choose shorter jumps

---

## Related Problems

### Same Pattern (Greedy Array)

| Problem | LeetCode Link | Difficulty |
|---------|---------------|-------------|
| Jump Game II | [Link](https://leetcode.com/problems/jump-game-ii/) | Medium |
| Candy | [Link](https://leetcode.com/problems/candy/) | Hard |
| Gas Station | [Link](https://leetcode.com/problems/gas-station/) | Medium |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Maximum Subarray | [Link](https://leetcode.com/problems/maximum-subarray/) | Medium | Greedy |
| Best Time to Buy/Sell Stock | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | Easy | Greedy |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Jump Game](https://www.youtube.com/watch?v=Zb4eZPqq9b0)** - Clear explanation
2. **[LeetCode Official Solution](https://www.youtube.com/watch?v=Zb4eZPqq9b0)** - Official walkthrough

### Additional Resources

- **[Greedy Algorithms - GeeksforGeeks](https://www.geeksforgeeks.org/greedy-algorithms/)** - Greedy guide

---

## Follow-up Questions

### Q1: How would you find the minimum number of jumps to reach the end?

**Answer:** This is Jump Game II. Use a similar greedy approach but track: current end (of current jump) and farthest (of next possible jump).

---

### Q2: What if some elements are zero?

**Answer:** The greedy approach handles this naturally. If we reach a zero and can't go further (i < farthest), we return false.

---

### Q3: Can you solve it without tracking farthest?

**Answer:** The backward greedy approach works by tracking the minimum position that can reach the end.

---

### Q4: What if you need the actual path?

**Answer:** You would need DP or backtracking to reconstruct the path, not just check reachability.

---

### Q5: What edge cases should be tested?

**Answer:**
- Single element (always true)
- All ones (always true)
- Zero at end
- Zero in middle
- First element is zero

---

## Common Pitfalls

### 1. Not Updating Farthest Before Check
**Issue:** Checking before updating.

**Solution:** Update farthest first, then check if stuck.

### 2. Wrong Early Return
**Issue:** Returning early incorrectly.

**Solution:** Make sure to check if `farthest >= n - 1` after the loop too.

### 3. Not Considering Current Index
**Issue:** Only considering jump length, not current position.

**Solution:** Use `i + nums[i]` to get actual reach.

---

## Summary

The **Jump Game** problem demonstrates:

- **Greedy Approach**: Track maximum reachable position
- **Single Pass**: O(n) solution
- **Early Exit**: Can determine result before processing all elements

Key takeaways:
1. Track farthest position reachable
2. If current index > farthest, we're stuck
3. If farthest >= last index, we can win
4. O(n) time, O(1) space

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/jump-game/discuss/)
- [Pattern: Greedy](/patterns/greedy)
