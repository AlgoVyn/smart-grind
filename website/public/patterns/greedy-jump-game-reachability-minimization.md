# Greedy - Jump Game Reachability/Minimization

## Problem Description

The Jump Game pattern is employed in problems where you need to determine if it's possible to reach the end of an array or find the minimum number of jumps required. Each element represents the maximum jump length from that position. This pattern uses a greedy approach by always trying to reach as far as possible in each step.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) for both reachability and minimization |
| Space Complexity | O(1) - only a few variables |
| Input | Array of non-negative integers (max jump lengths) |
| Output | Boolean (can reach) or int (minimum jumps) |
| Approach | Greedy with farthest reach tracking |

### When to Use

- Arrays where each element indicates a jump range
- Reachability checks from start to end
- Minimum jump calculation problems
- Position-based movement with constraints
- Range expansion and coverage problems

## Intuition

The key insight is to track the farthest position reachable at any point and greedily extend it as we traverse.

The "aha!" moments:

1. **Farthest reach**: Track the maximum index reachable from current position
2. **Current boundary**: The end of the current "jump range"
3. **Greedy extension**: Always extend farthest reach as much as possible
4. **Jump counting**: Increment jump count when we reach current boundary
5. **Early termination**: If farthest >= last index, we can reach

## Solution Approaches

### Approach 1: Jump Game - Can Reach ✅ Recommended

#### Algorithm

1. Initialize farthest = 0
2. Iterate through array:
   - If current index > farthest, return False (can't proceed)
   - Update farthest = max(farthest, i + nums[i])
   - If farthest >= last index, return True
3. Return True (if loop completes)

#### Implementation

````carousel
```python
def can_jump(nums: list[int]) -> bool:
    """
    Check if you can reach the last index.
    LeetCode 55 - Jump Game
    Time: O(n), Space: O(1)
    """
    farthest = 0
    n = len(nums)
    
    for i in range(n):
        # If current index is beyond farthest reachable, can't proceed
        if i > farthest:
            return False
        
        # Update farthest reachable index
        farthest = max(farthest, i + nums[i])
        
        # If farthest reaches or exceeds last index, can reach
        if farthest >= n - 1:
            return True
    
    return True


def can_jump_concise(nums):
    """
    Concise version without early termination check.
    """
    farthest = 0
    for i, jump in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + jump)
    return True
```
<!-- slide -->
```cpp
class Solution {
public:
    bool canJump(vector<int>& nums) {
        int farthest = 0;
        int n = nums.size();
        
        for (int i = 0; i < n; i++) {
            if (i > farthest) return false;
            farthest = max(farthest, i + nums[i]);
            if (farthest >= n - 1) return true;
        }
        
        return true;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean canJump(int[] nums) {
        int farthest = 0;
        int n = nums.length;
        
        for (int i = 0; i < n; i++) {
            if (i > farthest) return false;
            farthest = Math.max(farthest, i + nums[i]);
            if (farthest >= n - 1) return true;
        }
        
        return true;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
function canJump(nums) {
    let farthest = 0;
    const n = nums.length;
    
    for (let i = 0; i < n; i++) {
        if (i > farthest) return false;
        farthest = Math.max(farthest, i + nums[i]);
        if (farthest >= n - 1) return true;
    }
    
    return true;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - Single pass through array |
| Space | O(1) - Only farthest variable |

### Approach 2: Jump Game II - Minimum Jumps ✅ Recommended

#### Algorithm

1. If array length <= 1, return 0
2. Initialize jumps = 0, current_end = 0, farthest = 0
3. Iterate from 0 to n-2 (don't need to jump from last position):
   - Update farthest = max(farthest, i + nums[i])
   - If i == current_end (reached end of current jump range):
     - Increment jumps
     - Set current_end = farthest
4. Return jumps

#### Implementation

````carousel
```python
def jump(nums: list[int]) -> int:
    """
    Find minimum jumps to reach the last index.
    LeetCode 45 - Jump Game II
    Time: O(n), Space: O(1)
    """
    n = len(nums)
    if n <= 1:
        return 0
    
    jumps = 0
    current_end = 0  # End of current jump range
    farthest = 0     # Farthest we can reach
    
    for i in range(n - 1):  # Don't need to jump from last index
        # Update farthest reachable from current position
        farthest = max(farthest, i + nums[i])
        
        # If we've reached the end of current jump range
        if i == current_end:
            jumps += 1
            current_end = farthest
            
            # If we can already reach the end
            if current_end >= n - 1:
                break
    
    return jumps


def jump_alternative(nums):
    """
    Alternative implementation with clearer logic.
    """
    n = len(nums)
    if n <= 1:
        return 0
    
    jumps = 0
    current_end = 0
    farthest = 0
    
    for i in range(n):
        farthest = max(farthest, i + nums[i])
        
        # If we can reach the end
        if farthest >= n - 1:
            return jumps + 1
        
        # Need to make another jump
        if i == current_end:
            jumps += 1
            current_end = farthest
    
    return jumps
```
<!-- slide -->
```cpp
class Solution {
public:
    int jump(vector<int>& nums) {
        int n = nums.size();
        if (n <= 1) return 0;
        
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
        if (n <= 1) return 0;
        
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
function jump(nums) {
    const n = nums.length;
    if (n <= 1) return 0;
    
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
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - Single pass through array |
| Space | O(1) - Only three variables |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Can Reach | O(n) | O(1) | **Recommended** - Simple reachability check |
| Minimum Jumps | O(n) | O(1) | **Recommended** - Optimal greedy solution |
| DP (Can Reach) | O(n²) | O(n) | For understanding only |
| BFS | O(n²) | O(n) | When path reconstruction needed |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Jump Game](https://leetcode.com/problems/jump-game/) | 55 | Medium | Can reach end |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii/) | 45 | Medium | Minimum jumps |
| [Jump Game III](https://leetcode.com/problems/jump-game-iii/) | 1306 | Medium | With index constraints |
| [Jump Game VII](https://leetcode.com/problems/jump-game-vii/) | 1871 | Medium | With sliding window |
| [Video Stitching](https://leetcode.com/problems/video-stitching/) | 1024 | Medium | Interval coverage |
| [Minimum Number of Taps](https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden/) | 1326 | Hard | Similar to Jump Game II |

## Video Tutorial Links

1. **[NeetCode - Jump Game](https://www.youtube.com/watch?v=Yan0cv2cLy8)** - Greedy approach
2. **[NeetCode - Jump Game II](https://www.youtube.com/watch?v=dJ7sWiOoK7g)** - Minimum jumps
3. **[Kevin Naughton Jr. - Jump Game](https://www.youtube.com/watch?v=muDPTDrpS28)** - Detailed explanation
4. **[Nick White - Jump Game](https://www.youtube.com/watch?v=muDPTDrpS28)** - Step by step

## Summary

### Key Takeaways

- **Farthest reach**: Key metric for greedy decision
- **Current boundary**: Track end of current jump range
- **Greedy choice**: Extend as far as possible at each step
- **Jump counting**: Increment when reaching current boundary
- **O(n) optimal**: Greedy is optimal; no need for DP

### Common Pitfalls

- Off-by-one: Loop bounds for minimum jumps (don't need to jump from last)
- Confusing reachability vs minimization logic
- Not updating farthest correctly: use max(farthest, i + nums[i])
- Forgetting early termination when farthest >= n-1
- Using DP when greedy is sufficient
- Not handling edge case of single element array

### Follow-up Questions

1. **Why is greedy optimal for minimum jumps?**
   - At each boundary, we've already explored all possibilities within current range

2. **How to reconstruct the actual jump path?**
   - Track choices and backtrack from end

3. **What if we need to minimize something else?**
   - DP might be needed if objective is different

4. **Can we do it with BFS?**
   - Yes, but O(n²) time; greedy is more efficient

## Pattern Source

[Greedy - Jump Game Reachability/Minimization](patterns/greedy-jump-game-reachability-minimization.md)
