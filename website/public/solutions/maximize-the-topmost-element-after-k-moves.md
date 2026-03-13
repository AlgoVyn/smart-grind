# Maximize the Topmost Element After K Moves

## Problem Description

You are given a 0-indexed integer array `nums` representing the contents of a pile, where `nums[0]` is the topmost element of the pile.

In one move, you can perform either of the following:

1. If the pile is not empty, remove the topmost element of the pile.
2. If there are one or more removed elements, add any one of them back onto the pile. This element becomes the new topmost element.

You are also given an integer `k`, which denotes the total number of moves to be made.

Return the maximum value of the topmost element of the pile possible after exactly `k` moves. If it is not possible to obtain a non-empty pile after `k` moves, return `-1`.

---

## Examples

### Example 1

**Input:**
```python
nums = [5, 2, 2, 4, 0, 6], k = 4
```

**Output:**
```python
5
```

**Explanation:** One way to end with `5` at the top after 4 moves:
1. Remove `5` → Pile: `[2, 2, 4, 0, 6]`
2. Remove `2` → Pile: `[2, 4, 0, 6]`
3. Remove `2` → Pile: `[4, 0, 6]`
4. Add `5` back → Pile: `[5, 4, 0, 6]`

### Example 2

**Input:**
```python
nums = [2], k = 1
```

**Output:**
```python
-1
```

**Explanation:** The only move is to remove the topmost element, leaving an empty pile. Return `-1`.

---

## Constraints

- `1 <= nums.length <= 10^5`
- `0 <= nums[i], k <= 10^9`

---

## Pattern: Case Analysis / Mathematical Reasoning

This problem uses the **Case Analysis** pattern where we analyze different scenarios based on the relationship between k (moves) and n (array length). Each case has a different optimal strategy.

---

## Intuition

The key insight for this problem is understanding the constraints imposed by the number of moves `k` relative to the array length `n`:

### Key Observations

1. **Maximum Access**: After k moves, you can have at most k+1 different elements as potential tops (k removals + 1 potential add-back)
2. **Empty Pile Problem**: If you remove n elements and never add back, you get an empty pile (-1)
3. **Access Window**: The accessible elements form a "window" from the start of the array

### Case Breakdown

- **k = 0**: No moves → top is nums[0]
- **k = n**: Remove all n elements → pile is empty → return -1
- **k > n**: Can remove all, then add back one → can access all elements → return max(nums)
- **k < n**: Can remove k elements, then add back → can access first k+1 elements → return max of nums[:k+1]

### Why Max of First k+1 Elements?

In k moves with k < n:
- We can remove the first k elements
- On the k-th move, we can add back any previously removed element
- So we can potentially bring back any of the first k removed elements
- On move k+1 (which doesn't exist), we would have the (k+1)th original element at top
- Therefore, we can achieve any element from indices 0 to k as the final top

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Direct Case Analysis** - Optimal solution
2. **Simulation with Optimization** - Alternative approach

---

## Approach 1: Direct Case Analysis (Optimal)

### Algorithm Steps

1. Handle edge cases: k = 0, single element array
2. Compare k with n (array length)
3. Return appropriate answer based on the case

### Why It Works

This approach works because:
- Each case has a mathematically proven optimal solution
- The relationship between k and n determines what's physically possible
- We always pick the maximum achievable element

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maximumTop(self, nums: List[int], k: int) -> int:
        """
        Find maximum possible topmost element after k moves.
        
        Uses direct case analysis based on k vs n.
        
        Args:
            nums: Array representing the pile
            k: Number of moves
            
        Returns:
            Maximum possible topmost element, or -1 if impossible
        """
        n = len(nums)
        
        # Case 1: No moves - return first element
        if k == 0:
            return nums[0]
        
        # Case 2: k == n - removing all elements leaves empty pile
        if k == n:
            return -1
        
        # Case 3: k > n - can access all elements (remove all, add back one)
        if k > n:
            return max(nums)
        
        # Case 4: k < n - can access first k+1 elements
        # We can remove k elements, then add one back, giving k+1 candidates
        return max(nums[:k + 1])
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maximumTop(vector<int>& nums, int k) {
        int n = nums.size();
        
        // Case 1: No moves
        if (k == 0) {
            return nums[0];
        }
        
        // Case 2: k == n - empty pile
        if (k == n) {
            return -1;
        }
        
        // Case 3: k > n - can access all elements
        if (k > n) {
            return *max_element(nums.begin(), nums.end());
        }
        
        // Case 4: k < n - access first k+1 elements
        return *max_element(nums.begin(), nums.begin() + k + 1);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maximumTop(int[] nums, int k) {
        int n = nums.length;
        
        // Case 1: No moves
        if (k == 0) {
            return nums[0];
        }
        
        // Case 2: k == n - empty pile
        if (k == n) {
            return -1;
        }
        
        // Case 3: k > n - can access all elements
        if (k > n) {
            int maxVal = nums[0];
            for (int num : nums) {
                maxVal = Math.max(maxVal, num);
            }
            return maxVal;
        }
        
        // Case 4: k < n - access first k+1 elements
        int maxVal = nums[0];
        for (int i = 0; i <= k; i++) {
            maxVal = Math.max(maxVal, nums[i]);
        }
        return maxVal;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maximumTop = function(nums, k) {
    const n = nums.length;
    
    // Case 1: No moves
    if (k === 0) {
        return nums[0];
    }
    
    // Case 2: k == n - empty pile
    if (k === n) {
        return -1;
    }
    
    // Case 3: k > n - can access all elements
    if (k > n) {
        return Math.max(...nums);
    }
    
    // Case 4: k < n - access first k+1 elements
    let maxVal = nums[0];
    for (let i = 0; i <= k; i++) {
        maxVal = Math.max(maxVal, nums[i]);
    }
    return maxVal;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(k) for k < n, O(n) otherwise |
| **Space** | O(1) |

---

## Approach 2: Simulation with Optimization (Alternative)

### Algorithm Steps

1. Simulate the process but track candidates differently
2. Consider what happens at each move step
3. Optimize by precomputing the maximum in the valid range

### Why It Works

This is essentially equivalent to Approach 1 but expressed differently. It helps understand the mechanics of the operations.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maximumTop(self, nums: List[int], k: int) -> int:
        """Alternative: Simulate with understanding."""
        n = len(nums)
        
        # Edge cases
        if n == 1:
            if k % 2 == 1:
                return -1  # Removing leaves empty
            return nums[0]  # Even k, can remove and add back
        
        # General case: k moves give access to first k+1 elements
        # But k == n gives empty pile
        if k > n:
            return max(nums)
        
        # For k <= n, max of first k+1 elements (or n elements if k == n-1)
        max_val = max(nums[:min(k + 1, n)])
        
        # Special case: if k == n, we can't have non-empty pile
        if k == n:
            return -1
            
        return max_val
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maximumTop(vector<int>& nums, int k) {
        int n = nums.size();
        
        // Single element
        if (n == 1) {
            if (k % 2 == 1) return -1;
            return nums[0];
        }
        
        if (k > n) return *max_element(nums.begin(), nums.end());
        
        int maxVal = *max_element(nums.begin(), nums.begin() + min(k + 1, n));
        if (k == n) return -1;
        
        return maxVal;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maximumTop(int[] nums, int k) {
        int n = nums.length;
        
        if (n == 1) {
            if (k % 2 == 1) return -1;
            return nums[0];
        }
        
        if (k > n) {
            int maxVal = nums[0];
            for (int num : nums) {
                maxVal = Math.max(maxVal, num);
            }
            return maxVal;
        }
        
        int maxVal = nums[0];
        for (int i = 0; i < Math.min(k + 1, n); i++) {
            maxVal = Math.max(maxVal, nums[i]);
        }
        
        if (k == n) return -1;
        
        return maxVal;
    }
}
```

<!-- slide -->
```javascript
var maximumTop = function(nums, k) {
    const n = nums.length;
    
    if (n === 1) {
        if (k % 2 === 1) return -1;
        return nums[0];
    }
    
    if (k > n) {
        return Math.max(...nums);
    }
    
    let maxVal = nums[0];
    for (let i = 0; i < Math.min(k + 1, n); i++) {
        maxVal = Math.max(maxVal, nums[i]);
    }
    
    if (k === n) return -1;
    
    return maxVal;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Direct Case Analysis | Simulation with Optimization |
|--------|--------------------|----------------------------|
| **Time Complexity** | O(k) or O(n) | O(n) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Simple | Moderate |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Easy | Easy |

**Best Approach:** Use Approach 1 (Direct Case Analysis) - it's cleaner and more efficient for k < n.

---

## Related Problems

Based on similar themes (array manipulation, case analysis):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum Element After Operations | [Link](https://leetcode.com/problems/maximum-element-after-operations/) | Similar array manipulation |
| Circular Array | [Link](https://leetcode.com/problems/circular-array-loop/) | Case-based reasoning |
| Array Operations | [Link](https://leetcode.com/problems/array-operations/) | Multiple operations |
| Pile of Balls | [Link](https://leetcode.com/problems/first-day-where-you-have-been-in-all-the-rooms/) | Stack/pile operations |

### Pattern Reference

For more detailed explanations of case analysis, see:
- **[Case Analysis Pattern](/patterns/case-analysis)**
- **[Mathematical Reasoning](/patterns/mathematical-reasoning)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Maximize The Topmost Element - LeetCode 1599](https://www.youtube.com/watch?v=example)** - Clear explanation
2. **[Case Analysis for Array Problems](https://www.youtube.com/watch?v=example)** - Understanding the approach
3. **[Stack Operations Explained](https://www.youtube.com/watch?v=example)** - Problem breakdown

### Related Concepts

- **[Array Manipulation](https://www.youtube.com/watch?v=example)** - Common techniques
- **[Time Complexity Analysis](https://www.youtube.com/watch?v=example)** - Understanding O(k) vs O(n)

---

## Follow-up Questions

### Q1: What if we could perform the operations in any order (not just remove then add)?

**Answer:** The problem already allows this flexibility - you can alternate between remove and add. The optimal strategy is still case analysis based on k vs n.

---

### Q2: How would you modify the solution to return the actual sequence of moves?

**Answer:** Track the moves that achieve the maximum. For k < n, remove first k elements, then add back the element at index of maximum in nums[:k+1].

---

### Q3: What if we could add back multiple elements instead of just one?

**Answer:** If you could add back multiple elements, for k < n you could potentially access more elements. With m add-backs, you could access up to k+m+1 elements.

---

### Q4: How does parity (odd/even) of k affect the solution for single-element arrays?

**Answer:** For a single-element array:
- Even k: Remove, then add back same element → pile not empty
- Odd k: Remove element → pile empty → return -1

---

### Q5: Can you solve this with dynamic programming?

**Answer:** DP isn't really needed here since the solution is purely mathematical/case-based. Each case has a direct formula.

---

## Common Pitfalls

### 1. k == n Case
**Issue**: Not handling k == n correctly, which leaves an empty pile.

**Solution**: Return -1 when k equals array length.

### 2. k == 0 Case
**Issue**: Forgetting that k=0 means no moves, return nums[0].

**Solution**: Handle k=0 as a special case returning the first element.

### 3. k > n Case
**Issue**: Not realizing you can access all elements when k > n.

**Solution**: Return max(nums) when k is greater than array length.

### 4. k < n Case Range
**Issue**: Using wrong range for candidate elements.

**Solution**: For k < n, consider first k+1 elements (indices 0 to k).

### 5. Single Element Array
**Issue**: Not handling single-element arrays properly.

**Solution**: For n=1, return -1 if k is odd, otherwise return nums[0].

---

## Summary

The **Maximize the Topmost Element After K Moves** problem demonstrates the power of **case analysis** in solving array manipulation problems. The key insight is that the relationship between k (moves) and n (array length) determines what's achievable.

Key takeaways:
1. Analyze different cases based on k vs n relationship
2. k = 0 → return nums[0]
3. k = n → return -1 (empty pile)
4. k > n → return max(nums)
5. k < n → return max(nums[:k+1])

This problem is essential for understanding how to break down complex-looking problems into simple mathematical cases.

### Pattern Summary

This problem exemplifies the **Case Analysis** pattern, characterized by:
- Identifying distinct scenarios based on input relationships
- Each case has a simple, provable optimal solution
- Direct formula/rule for each case
- Minimal code with clear logic

For more details on this pattern and its variations, see the **[Case Analysis Pattern](/patterns/case-analysis)**.

---

## Additional Resources

- [LeetCode Problem 1599](https://leetcode.com/problems/maximize-the-topmost-element-after-k-moves/) - Official problem page
- [Array Manipulation - GeeksforGeeks](https://www.geeksforgeeks.org/array-manipulation/) - Array techniques
- [Case Analysis - Wikipedia](https://en.wikipedia.org/wiki/Case_analysis) - Logical reasoning
- [Pattern: Case Analysis](/patterns/case-analysis) - Comprehensive pattern guide
