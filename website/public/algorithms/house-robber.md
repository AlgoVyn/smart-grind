# House Robber

## Category
Dynamic Programming

## Description

The House Robber is a classic dynamic programming problem where you need to find the maximum amount of money you can rob from a linear arrangement of houses without robbing two adjacent houses. Each house contains a certain amount of money, and if you rob one house, you cannot rob its immediate neighbor.

The key insight is that at each house, you have two choices: skip the current house (keeping the previous maximum), or rob the current house (adding its value to the maximum from two houses back). This creates a Fibonacci-like recurrence relation that demonstrates optimal substructure and can be solved with O(1) space optimization.

---

## Concepts

The House Robber technique is built on several fundamental concepts that make it powerful for solving linear sequence optimization problems.

### 1. Adjacency Constraint

The core constraint prevents selecting consecutive elements:

| Choice | Current House | Previous House | Two Houses Back |
|--------|---------------|----------------|-----------------|
| **Skip** | Not selected | Can be selected | Can be selected |
| **Rob** | Selected | Cannot be selected | Can be selected |

### 2. State Dependency

The optimal solution at each position depends only on two previous states:

```
dp[i] depends on:
- dp[i-1]: Maximum if we skip current house
- dp[i-2] + nums[i]: Maximum if we rob current house
```

This is why space can be optimized from O(n) to O(1).

### 3. Optimal Substructure

The global optimum can be built from local optima:

| Property | Description |
|----------|-------------|
| Base case | dp[0] = nums[0] |
| Second base | dp[1] = max(nums[0], nums[1]) |
| Recurrence | dp[i] = max(dp[i-1], dp[i-2] + nums[i]) |

### 4. Decision Framework

At each house, the decision follows this logic:

```
If we rob house i:
    We cannot rob house i-1
    Total = money[i] + max money from houses 0 to i-2

If we skip house i:
    We can take max money from houses 0 to i-1

Choose the maximum of these two options.
```

---

## Frameworks

Structured approaches for solving House Robber problems.

### Framework 1: Space-Optimized Template

```
┌─────────────────────────────────────────────────────┐
│  SPACE-OPTIMIZED FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Handle edge cases:                               │
│     - Empty array: return 0                         │
│     - Single house: return nums[0]                  │
│                                                      │
│  2. Initialize two variables:                        │
│     prev2 = 0          (dp[i-2])                   │
│     prev1 = nums[0]    (dp[i-1])                   │
│                                                      │
│  3. Iterate from house 1 to n-1:                    │
│     current = max(prev1, prev2 + nums[i])           │
│     prev2 = prev1                                   │
│     prev1 = current                                 │
│                                                      │
│  4. Return prev1                                     │
└─────────────────────────────────────────────────────┘
```

**When to use**: When only the maximum value is needed (not which houses).

### Framework 2: Full DP Array Template

```
┌─────────────────────────────────────────────────────┐
│  FULL DP ARRAY FRAMEWORK                            │
├─────────────────────────────────────────────────────┤
│  1. Create dp array of size n                      │
│  2. dp[0] = nums[0]                                 │
│  3. dp[1] = max(nums[0], nums[1])                   │
│  4. For i from 2 to n-1:                           │
│     dp[i] = max(dp[i-1], dp[i-2] + nums[i])        │
│  5. Return dp[n-1]                                   │
│                                                      │
│  Benefit: Can reconstruct which houses were robbed   │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you need to know which houses were selected.

### Framework 3: Circular Houses Template (House Robber II)

```
┌─────────────────────────────────────────────────────┐
│  CIRCULAR HOUSES FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Handle edge cases (empty, single house)        │
│                                                      │
│  2. Houses 0 and n-1 are adjacent (circular)         │
│     Case 1: Rob house 0 → Can't rob house n-1       │
│              Solve for houses [0, n-2]              │
│     Case 2: Don't rob house 0 → Can rob house n-1   │
│              Solve for houses [1, n-1]              │
│                                                      │
│  3. Return max(Case 1, Case 2)                       │
└─────────────────────────────────────────────────────┘
```

**When to use**: When houses are arranged in a circle (first and last adjacent).

---

## Forms

Different manifestations of the House Robber pattern.

### Form 1: Linear Arrangement (Classic)

Houses arranged in a straight line with no wrap-around.

| Houses | Values | Optimal Selection | Total |
|--------|--------|-------------------|-------|
| [1,2,3,1] | [1,2,3,1] | 0 and 2 | 4 |
| [2,7,9,3,1] | [2,7,9,3,1] | 0, 2, 4 | 12 |
| [5] | [5] | 0 | 5 |

### Form 2: Circular Arrangement (House Robber II)

First and last houses are adjacent (circular street).

```
Solution strategy:
- Case A: Rob first house, don't rob last → solve for [0, n-2]
- Case B: Don't rob first, can rob last → solve for [1, n-1]
- Answer = max(Case A, Case B)
```

### Form 3: Binary Tree Arrangement (House Robber III)

Houses form a binary tree structure.

```
At each node, return two values:
- (rob_this, not_rob_this)
- rob_this = node.val + left.not_rob + right.not_rob
- not_rob_this = max(left) + max(right)
```

### Form 4: Delete and Earn Variation

Transform values into House Robber format.

```
Example: [2,2,3,3,3,4]
- Total value of 2s: 4 (indices 0,1)
- Total value of 3s: 9 (indices 2,3,4)
- Total value of 4s: 4 (index 5)
- New array: [0,0,4,9,4]
- Apply House Robber: Can't take 2 and 3 together
```

### Form 5: Maximum Non-Adjacent Sum

Generic version for any array (not just houses/money).

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Pattern Recognition from Other Problems

Recognize House Robber patterns in disguise:

```python
def is_house_robber_variant(problem_description):
    """Check if problem maps to House Robber pattern."""
    indicators = [
        "cannot select adjacent",
        "non-consecutive elements",
        "skip one between selections",
        "maximum sum without adjacent"
    ]
    return any(indicator in problem_description.lower() 
               for indicator in indicators)

# Examples:
# - "Maximum sum of non-adjacent elements" → House Robber
# - "Delete and Earn" → House Robber after transformation
# - "Paint House" → Similar DP structure
```

### Tactic 2: Reconstruction Without Full Array

Track decisions with a separate array:

```python
def rob_with_reconstruction(nums):
    """Return max value and which houses were robbed."""
    if not nums:
        return 0, []
    
    n = len(nums)
    if n == 1:
        return nums[0], [0]
    
    # dp[i] = max money up to house i
    dp = [0] * n
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    
    # Track which houses we robbed
    robbed = [False] * n
    robbed[0] = nums[0] >= nums[1]
    robbed[1] = nums[1] > nums[0]
    
    for i in range(2, n):
        skip = dp[i-1]
        take = dp[i-2] + nums[i]
        
        if take > skip:
            dp[i] = take
            robbed[i] = True
        else:
            dp[i] = skip
            robbed[i] = False
    
    # Backtrack to find selected houses
    selected = []
    i = n - 1
    while i >= 0:
        if robbed[i]:
            selected.append(i)
            i -= 2  # Skip previous (can't rob adjacent)
        else:
            i -= 1
    
    return dp[n-1], selected[::-1]
```

### Tactic 3: Circular Array Handling

General approach for circular constraints:

```python
def rob_circular(nums):
    """Template for circular House Robber."""
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    def rob_linear(houses):
        """Standard House Robber on linear array."""
        prev2, prev1 = 0, houses[0]
        for i in range(1, len(houses)):
            curr = max(prev1, prev2 + houses[i])
            prev2, prev1 = prev1, curr
        return prev1
    
    # Case 1: Exclude last house
    case1 = rob_linear(nums[:-1])
    # Case 2: Exclude first house  
    case2 = rob_linear(nums[1:])
    
    return max(case1, case2)
```

### Tactic 4: Tree DP Pattern (House Robber III)

DFS approach for tree-structured problems:

```python
def rob_tree(root):
    """
    Returns (rob_this_node, not_rob_this_node).
    rob_this = can't rob children
    not_rob_this = can choose to rob or not rob children
    """
    def dfs(node):
        if not node:
            return (0, 0)  # (rob, not_rob)
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # Rob this node: can't rob children
        rob_this = node.val + left[1] + right[1]
        
        # Don't rob this node: take best of children choices
        not_rob_this = max(left) + max(right)
        
        return (rob_this, not_rob_this)
    
    return max(dfs(root))
```

### Tactic 5: Variable Window Optimization

For problems with variable "skips":

```python
def rob_with_k_gap(nums, k):
    """
    Maximum sum with at least k elements between selections.
    k=1 is standard House Robber.
    """
    if not nums:
        return 0
    
    n = len(nums)
    dp = [0] * (n + 1)
    
    for i in range(n):
        # Either skip current, or take current + best from i-k-1
        take = nums[i] + (dp[i - k] if i - k >= 0 else 0)
        skip = dp[i]
        dp[i + 1] = max(dp[i + 1], max(take, skip))
    
    return dp[n]
```

---

## Python Templates

### Template 1: Space-Optimized Linear

```python
def rob_linear(nums: list[int]) -> int:
    """
    Template 1: Space-optimized House Robber (O(1) space).
    Time: O(n), Space: O(1)
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    # Only need previous two values
    prev2 = 0           # dp[i-2]
    prev1 = nums[0]     # dp[i-1]
    
    for i in range(1, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = current
    
    return prev1
```

### Template 2: With Path Reconstruction

```python
def rob_with_path(nums: list[int]):
    """
    Template 2: Return max value and selected house indices.
    Time: O(n), Space: O(n)
    """
    if not nums:
        return 0, []
    
    n = len(nums)
    if n == 1:
        return nums[0], [0]
    
    # Full DP array for reconstruction
    dp = [0] * n
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    
    for i in range(2, n):
        dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    
    # Backtrack to find which houses were robbed
    selected = []
    i = n - 1
    while i >= 0:
        if i == 0:
            # At first house, check if we robbed it
            if (n == 1) or (dp[i] > 0 and (n == 1 or dp[i] != nums[1] if n > 1 else True)):
                selected.append(i)
            break
        
        # If dp[i] != dp[i-1], we must have robbed house i
        if dp[i] != dp[i-1]:
            selected.append(i)
            i -= 2  # Skip previous house (adjacent constraint)
        else:
            i -= 1
    
    return dp[n-1], selected[::-1]
```

### Template 3: Circular Houses (House Robber II)

```python
def rob_circular(nums: list[int]) -> int:
    """
    Template 3: Houses arranged in a circle.
    First and last houses are adjacent.
    Time: O(n), Space: O(1)
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    def rob_linear(houses):
        """Helper: Standard linear House Robber."""
        prev2, prev1 = 0, houses[0]
        for i in range(1, len(houses)):
            curr = max(prev1, prev2 + houses[i])
            prev2, prev1 = prev1, curr
        return prev1
    
    # Case 1: Exclude last house
    case1 = rob_linear(nums[:-1])
    # Case 2: Exclude first house
    case2 = rob_linear(nums[1:])
    
    return max(case1, case2)
```

### Template 4: Recursive with Memoization

```python
from functools import lru_cache

def rob_memoization(nums: list[int]) -> int:
    """
    Template 4: Top-down DP with memoization.
    Time: O(n), Space: O(n)
    """
    @lru_cache(maxsize=None)
    def dfs(i):
        """Max money from houses i to end."""
        if i >= len(nums):
            return 0
        if i == len(nums) - 1:
            return nums[i]
        
        # Skip current or rob current
        skip = dfs(i + 1)
        take = nums[i] + dfs(i + 2)
        
        return max(skip, take)
    
    return dfs(0)
```

### Template 5: Binary Tree Houses (House Robber III)

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def rob_tree(root: TreeNode) -> int:
    """
    Template 5: Houses arranged in binary tree.
    Returns max amount without robbing adjacent (parent-child).
    Time: O(n), Space: O(h) where h = tree height
    """
    def dfs(node):
        """
        Returns (rob_this, not_rob_this).
        rob_this: max if we rob current node
        not_rob_this: max if we don't rob current node
        """
        if not node:
            return (0, 0)
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # Rob this node: cannot rob children
        rob_this = node.val + left[1] + right[1]
        
        # Don't rob this node: take max of each child's options
        not_rob_this = max(left) + max(right)
        
        return (rob_this, not_rob_this)
    
    return max(dfs(root))
```

### Template 6: Delete and Earn Transformation

```python
def delete_and_earn(nums: list[int]) -> int:
    """
    Template 6: Transform to House Robber format.
    Taking num[i] means you can't take num[i]-1 or num[i]+1.
    Time: O(n + k) where k = max value in nums
    """
    if not nums:
        return 0
    
    # Find max value to size our array
    max_val = max(nums)
    
    # points[i] = total points earned by taking all i's
    points = [0] * (max_val + 1)
    for num in nums:
        points[num] += num
    
    # Now it's exactly House Robber on points array
    prev2, prev1 = 0, points[0]
    for i in range(1, len(points)):
        curr = max(prev1, prev2 + points[i])
        prev2, prev1 = prev1, curr
    
    return prev1
```

---

## When to Use

Use the House Robber algorithm when you need to solve problems involving:

- **Linear Sequence Selection**: Problems where you need to select elements from a sequence without selecting adjacent ones
- **Optimization with Constraints**: Maximize/minimize values while avoiding conflicts between adjacent selections
- **Dependency Resolution**: When current decision depends on the previous two states

### Comparison with Alternatives

| Approach | Time | Space | Best Use Case |
|----------|------|-------|---------------|
| **DP (Bottom-up)** | O(n) | O(n) | When you need to reconstruct the solution |
| **DP (Space-optimized)** | O(n) | O(1) | When only the maximum value is needed |
| **Recursion + Memoization** | O(n) | O(n) | When recursion is more intuitive |
| **Greedy** | O(n) | O(1) | Only works for specific variants |

### When to Choose House Robber DP

- **Choose House Robber DP** when:
  - Adjacent elements cannot be selected together
  - You need the global optimal solution
  - The problem has overlapping subproblems

- **Consider Alternative Approaches** when:
  - All houses have equal value (greedy might work)
  - Circular houses (needs slight modification)
  - Multiple visits allowed (different variant)

---

## Algorithm Explanation

### Core Concept

The House Robber problem demonstrates the power of **dynamic programming** through **optimal substructure** and **overlapping subproblems**. The key insight is that the decision at each house only depends on two previous states.

### The Recurrence Relation

At each house `i`, you have two choices:

1. **Don't rob house `i`**: Your maximum money is the same as `dp[i-1]`
2. **Rob house `i`**: You take `nums[i]` plus the maximum from `dp[i-2]`

```
dp[i] = max(dp[i-1], dp[i-2] + nums[i])
```

### Visual Representation

For houses = [2, 7, 9, 3, 1]:

```
Index:     0    1    2    3    4
Value:     2    7    9    3    1

DP Table:
dp[0] = 2                    (rob house 0)
dp[1] = max(2, 7) = 7        (rob house 1)
dp[2] = max(7, 2+9) = 11     (rob houses 0, 2)
dp[3] = max(11, 7+3) = 11    (rob houses 0, 2)
dp[4] = max(11, 11+1) = 12   (rob houses 0, 2, 4)

Answer: 12 (houses 0, 2, 4: 2 + 9 + 1 = 12)
```

### Why Space Optimization Works

Since `dp[i]` only depends on `dp[i-1]` and `dp[i-2]`, we only need to keep track of:
- `prev1` (representing `dp[i-1]`)
- `prev2` (representing `dp[i-2]`)

This reduces space from O(n) to O(1).

### How It Works

#### Linear Arrangement:
1. Initialize with first house value
2. For each subsequent house, decide: skip or rob
3. Skip: keep previous max
4. Rob: add current to max from two houses back
5. Take the better option

#### Circular Arrangement:
1. Break the circle by excluding either first or last
2. Solve two linear subproblems
3. Return the maximum of both

### Limitations

- **Only works for discrete selection**: Cannot handle fractional houses
- **Assumes non-negative values**: Negative money breaks the logic
- **Linear or tree structure**: Other graph structures need different approaches

---

## Practice Problems

### Problem 1: House Robber (Linear)

**Problem:** [LeetCode 198 - House Robber](https://leetcode.com/problems/house-robber/)

**Description:** You are a professional robber planning to rob houses along a street. Each house has a certain amount of money, and you cannot rob two adjacent houses. Find the maximum amount you can rob.

**How to Apply the Technique:**
- Use the standard House Robber DP formula: `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`
- Optimize space to O(1) by tracking only the previous two values
- Time: O(n), Space: O(1)

---

### Problem 2: House Robber II (Circular)

**Problem:** [LeetCode 213 - House Robber II](https://leetcode.com/problems/house-robber-ii/)

**Description:** The houses are now arranged in a circle, meaning house 0 and house n-1 are adjacent. You cannot rob both of them.

**How to Apply the Technique:**
- Break the circle by considering two cases: rob first house or rob last house
- Apply standard House Robber to both linear arrays
- Return the maximum of both results

---

### Problem 3: House Robber III (Binary Tree)

**Problem:** [LeetCode 337 - House Robber III](https://leetcode.com/problems/house-robber-iii/)

**Description:** The houses form a binary tree. You cannot rob two houses that are directly connected (parent-child relationship).

**How to Apply the Technique:**
- Use DFS to traverse the tree
- At each node, return two values: (rob this house, don't rob this house)
- Recursively combine child results

---

### Problem 4: Delete and Earn

**Problem:** [LeetCode 740 - Delete and Earn](https://leetcode.com/problems/delete-and-earn/)

**Description:** Given an array of integers, you can gain points equal to the value of each number. When you take number x, you must delete all occurrences of x-1 and x+1.

**How to Apply the Technique:**
- Transform the problem into House Robber format
- Create a new array where index i represents the total value of all occurrences of i
- Apply the same DP approach

---

### Problem 5: Paint House

**Problem:** [LeetCode 256 - Paint House](https://leetcode.com/problems/paint-house/)

**Description:** Paint houses with minimum cost such that no two adjacent houses have the same color.

**How to Apply the Technique:**
- Similar DP structure: at each house, choose the minimum cost that doesn't conflict with previous choice
- Track minimum costs for each color option
- State tracks which color was chosen for previous house

---

## Video Tutorial Links

### Fundamentals

- [House Robber - Dynamic Programming (Take U Forward)](https://www.youtube.com/watch?v=grxZ2HgubBM) - Comprehensive introduction to House Robber
- [House Robber Explanation (NeetCode)](https://www.youtube.com/watch?v=r0-cH5D2f9Q) - Clear explanation with examples

### Variations

- [House Robber II (Circular)](https://www.youtube.com/watch?v=2xSTw2HlZYY) - Handling circular houses
- [House Robber III (Tree)](https://www.youtube.com/watch?v=nHRQ8C3s6pI) - Binary tree version

### Related Problems

- [Delete and Earn](https://www.youtube.com/watch?v=7FC9Hbgoeq4) - House Robber variant
- [Paint House](https://www.youtube.com/watch?v=-L6g8G3i24U) - Related DP problem

---

## Follow-up Questions

### Q1: Why does the greedy approach not work for House Robber?

**Answer:** Greedy (always picking the largest house) fails because:
- Picking a large house might prevent robbing two adjacent smaller houses
- Example: [10, 1, 1, 10] - Greedy picks 10 (index 0), then can't pick 10 (index 3), total = 10
- Optimal: pick both 1's plus last 10 = 12

The DP approach considers all possibilities and guarantees the optimal solution.

### Q2: Can House Robber be solved with recursion?

**Answer:** Yes, using memoization (top-down DP):
```python
def rob(nums):
    memo = {}
    def dfs(i):
        if i >= len(nums):
            return 0
        if i in memo:
            return memo[i]
        memo[i] = max(dfs(i+1), dfs(i+2) + nums[i])
        return memo[i]
    return dfs(0)
```
Time: O(n), Space: O(n) for recursion stack + memo

### Q3: How do you reconstruct which houses were robbed?

**Answer:** Use the standard DP array (not space-optimized), then backtrack:
1. Start from the last house
2. If `dp[i] != dp[i-1]`, we robbed house i (go to i-2)
3. Otherwise, we skipped house i (go to i-1)

### Q4: What if house values can be negative?

**Answer:** The problem typically assumes non-negative values. With negative values:
- If all values are negative, you'd want to rob no houses (return 0)
- The recurrence still works but needs careful initialization
- Consider returning 0 as the minimum (don't rob any)

### Q5: How does House Robber relate to other DP problems?

**Answer:** House Robber is the foundation for many DP problems:
- **Climbing Stairs**: Same recurrence, different interpretation
- **Maximum Subarray**: Similar optimal substructure
- **Coin Change**: Similar but different constraint structure

The key concept (deciding whether to include current element based on previous states) appears in many problems.

---

## Summary

The House Robber problem is a fundamental dynamic programming problem that demonstrates:

- **Optimal Substructure**: The solution to the whole problem depends on solutions to subproblems
- **Overlapping Subproblems**: The same subproblems are solved multiple times
- **Space Optimization**: Only need to track previous two states

Key takeaways:

- **Core Formula**: `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`
- **Time Complexity**: O(n) - single pass through the array
- **Space Complexity**: O(1) with optimization
- **Variations**: Circular (II), Tree (III), Delete and Earn all use similar logic

When to use:
- ✅ Linear sequence selection without adjacent elements
- ✅ Problems with "take it or leave it" decisions
- ✅ Foundation for more complex DP problems
- ❌ When elements can be revisited (different problem)

This problem is essential for understanding dynamic programming and is frequently asked in technical interviews.
