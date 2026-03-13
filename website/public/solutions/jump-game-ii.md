# Jump Game II

## Problem Description

You are given a 0-indexed array of integers `nums` of length `n`. You are initially positioned at index `0`. Each element `nums[i]` represents the maximum length of a forward jump from index `i`. In other words, if you are at index `i`, you can jump to any index `i + j` where:

- `0 <= j <= nums[i]`
- `i + j < n`

Return the minimum number of jumps to reach index `n - 1`. The test cases are generated such that you can reach index `n - 1`.

**LeetCode Link:** [LeetCode 45 - Jump Game II](https://leetcode.com/problems/jump-game-ii/)

---

## Examples

### Example 1

**Input:** `nums = [2,3,1,1,4]`

**Output:** `2`

**Explanation:** The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index.

### Example 2

**Input:** `nums = [2,3,0,1,4]`

**Output:** `2`

---

## Constraints

- `1 <= nums.length <= 10^4`
- `0 <= nums[i] <= 1000`
- It's guaranteed that you can reach `nums[n - 1]`.

---

## Pattern: Greedy

This problem follows the **Greedy** pattern for minimum jumps.

### Core Concept

- **Track Range**: Within current jump, how far can we go
- **BFS-like**: Count minimum number of jumps
- **Two Pointers**: Current end and farthest

### When to Use This Pattern

This pattern is applicable when:
1. Minimum number of jumps to reach end
2. BFS-like without building graph
3. Interval jumping problems

---

## Intuition

The key insight is that we need to make the minimum number of jumps to reach the end. A greedy approach works optimally here because:

1. **Always jump as far as possible**: When we're at the end of our current jump's range, we must make a jump to continue.
2. **Local optimal = Global optimal**: Making the farthest possible jump at each step leads to the minimum total jumps.
3. **Single pass**: We can track the farthest position reachable within the current jump without needing to try all possible jump combinations.

### Key Observations

1. If we're at index `i`, we can reach any index from `i` to `i + nums[i]`.
2. We maintain two pointers: `current_end` (end of current jump's range) and `farthest` (furthest position reachable from any position in current range).
3. When we reach `current_end`, we must make a jump, and we increment our jump count.
4. We update `current_end` to `farthest` after each jump.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Greedy Approach (Optimal)** - O(n) time, O(1) space
2. **Dynamic Programming** - O(n²) time (for understanding)

---

## Approach 1: Greedy (Optimal)

### Why It Works

The greedy algorithm works because at each position, we track how far we can potentially go with the next jump. When we've exhausted our current jump's range, we must make a jump, and we choose the position that gives us the maximum range for subsequent jumps.

### Algorithm Steps

1. Initialize `jumps = 0`, `current_end = 0`, `farthest = 0`
2. Iterate through the array up to the second-to-last index
3. At each position, update `farthest = max(farthest, i + nums[i])`
4. When we reach `current_end`, increment `jumps` and update `current_end = farthest`
5. Return `jumps`

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def jump(self, nums: List[int]) -> int:
        """
        Find minimum number of jumps to reach end using greedy approach.
        
        Args:
            nums: List of non-negative integers representing jump lengths
            
        Returns:
            Minimum number of jumps to reach last index
        """
        n = len(nums)
        if n == 1:
            return 0
        
        jumps = 0
        current_end = 0
        farthest = 0
        
        for i in range(n - 1):
            # Update farthest reachable position
            farthest = max(farthest, i + nums[i])
            
            # When we reach current end, we must make a jump
            if i == current_end:
                jumps += 1
                current_end = farthest
                
                # Early exit if we can reach the end
                if current_end >= n - 1:
                    break
        
        return jumps
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int jump(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return 0;
        
        int jumps = 0;
        int currentEnd = 0;
        int farthest = 0;
        
        for (int i = 0; i < n - 1; i++) {
            farthest = max(farthest, i + nums[i]);
            
            if (i == currentEnd) {
                jumps++;
                currentEnd = farthest;
                
                if (currentEnd >= n - 1) break;
            }
        }
        
        return jumps;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int jump(int[] nums) {
        int n = nums.length;
        if (n == 1) return 0;
        
        int jumps = 0;
        int currentEnd = 0;
        int farthest = 0;
        
        for (int i = 0; i < n - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);
            
            if (i == currentEnd) {
                jumps++;
                currentEnd = farthest;
                
                if (currentEnd >= n - 1) break;
            }
        }
        
        return jumps;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function(nums) {
    const n = nums.length;
    if (n === 1) return 0;
    
    let jumps = 0;
    let currentEnd = 0;
    let farthest = 0;
    
    for (let i = 0; i < n - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        
        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;
            
            if (currentEnd >= n - 1) break;
        }
    }
    
    return jumps;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the array |
| **Space** | O(1) - Only constant extra space |

---

## Approach 2: Dynamic Programming (For Understanding)

### Why It Works

We can build a solution by computing the minimum jumps to reach each position. For each position, we check all previous positions and find the minimum jumps needed to reach it, then add a jump from that position if it can reach the current position.

### Algorithm Steps

1. Create `dp` array where `dp[i]` = minimum jumps to reach index `i`
2. Initialize `dp[0] = 0`
3. For each position `i`, check all positions `j < i`
4. If `j + nums[j] >= i`, we can reach `i` from `j`
5. Update `dp[i] = min(dp[j] + 1)` for all valid `j`

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def jump_dp(self, nums: List[int]) -> int:
        """
        Find minimum jumps using dynamic programming.
        Time: O(n²) - For understanding only.
        """
        n = len(nums)
        if n == 1:
            return 0
        
        dp = [float('inf')] * n
        dp[0] = 0
        
        for i in range(1, n):
            for j in range(i):
                if j + nums[j] >= i:
                    dp[i] = min(dp[i], dp[j] + 1)
        
        return dp[n - 1]
```

<!-- slide -->
```cpp
class Solution {
public:
    int jump(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return 0;
        
        vector<int> dp(n, INT_MAX);
        dp[0] = 0;
        
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (j + nums[j] >= i) {
                    dp[i] = min(dp[i], dp[j] + 1);
                }
            }
        }
        
        return dp[n - 1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int jump(int[] nums) {
        int n = nums.length;
        if (n == 1) return 0;
        
        int[] dp = new int[n];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (j + nums[j] >= i) {
                    dp[i] = Math.min(dp[i], dp[j] + 1);
                }
            }
        }
        
        return dp[n - 1];
    }
}
```

<!-- slide -->
```javascript
var jump = function(nums) {
    const n = nums.length;
    if (n === 1) return 0;
    
    const dp = new Array(n).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (j + nums[j] >= i) {
                dp[i] = Math.min(dp[i], dp[j] + 1);
            }
        }
    }
    
    return dp[n - 1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Two nested loops |
| **Space** | O(n) - DP array |

---

## Comparison of Approaches

| Aspect | Greedy | Dynamic Programming |
|--------|--------|-------------------|
| **Time Complexity** | O(n) | O(n²) |
| **Space Complexity** | O(1) | O(n) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No |

**Best Approach:** Greedy is optimal and recommended for interviews.

---

## Related Problems

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Jump Game | [Link](https://leetcode.com/problems/jump-game/) | Check if reachable |
| Jump Game III | [Link](https://leetcode.com/problems/jump-game-iii/) | BFS approach |
| Jump Game IV | [Link](https://leetcode.com/problems/jump-game-iv/) | BFS optimization |
| Minimum Number of Jumps | [Link](https://www.geeksforgeeks.org/minimum-number-of-jumps-to-reach-end-of-array/) | Similar problem |

### Pattern Reference

For more detailed explanations of the Greedy pattern, see:
- **[Greedy Pattern](/patterns/greedy)**

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Jump Game II](https://www.youtube.com/watch?v=dJ7sWi3E3RQ)** - Clear explanation with visual examples
2. **[Jump Game II - LeetCode 45](https://www.youtube.com/watch?v=py3M23-1I0A)** - Detailed walkthrough
3. **[Greedy Algorithm Explained](https://www.youtube.com/watch?v=0NT5I-Izv3A)** - Understanding greedy approach

---

## Follow-up Questions

### Q1: Can you solve this without tracking `farthest` separately?

**Answer:** Yes, you can use a different greedy variant where you track the current jump's range directly. However, the standard approach with `current_end` and `farthest` is clearer and more commonly used.

---

### Q2: What if some elements in the array are 0?

**Answer:** The greedy algorithm still works correctly. If you encounter a position where `i == current_end` and `farthest` doesn't advance (i.e., all remaining positions have 0 jumps), you'd be stuck. However, the problem guarantees that the array is solvable (you can always reach the end).

---

### Q3: How would you modify to return the actual path of jumps?

**Answer:** You would need to track which position you jumped from at each step. Store the parent/previous index for each position where you made a jump, then backtrack from the end to reconstruct the path.

---

### Q4: What's the difference between Jump Game I and II?

**Answer:** Jump Game I asks whether you can reach the end (boolean), while Jump Game II asks for the minimum number of jumps. Both use similar greedy approaches.

---

### Q5: Can this be solved using BFS?

**Answer:** Yes, you can model this as a BFS problem where each position is a node and edges connect positions that can be reached with one jump. However, greedy is more efficient (O(n) vs O(n²) for BFS in worst case).

---

## Summary

The **Jump Game II** problem demonstrates the **Greedy** pattern for finding minimum jumps in an array.

### Key Takeaways

1. **Greedy Works**: At each step, jump to the position that gives maximum reach for the next jump
2. **Two Pointers**: Track `current_end` (end of current jump's range) and `farthest` (max reachable)
3. **Single Pass**: O(n) time complexity with O(1) space
4. **Local to Global**: Making locally optimal choices leads to global optimum

### Pattern Summary

This problem exemplifies the **Greedy** pattern, characterized by:
- Making locally optimal decisions
- Single pass through data
- O(n) time complexity
- Applicable to interval/range problems

For more details on this pattern, see the **[Greedy Pattern](/patterns/greedy)**.

---

## Common Pitfalls

### 1. Not Tracking Current Jump
**Issue:** Not knowing when to increment jumps.

**Solution:** Increment when current end is reached.

### 2. Wrong Position Tracking
**Issue:** Using wrong index for farthest.

**Solution:** Track farthest within current jump: max(curr_farthest, i + nums[i]).

### 3. Edge Cases
**Issue:** Not handling unreachable cases.

**Solution:** The problem guarantees reachability, but you could return -1 if needed.

### 4. Early Exit Missing
**Issue:** Not breaking when current_end >= n - 1.

**Solution:** Add early exit to avoid unnecessary iterations.

