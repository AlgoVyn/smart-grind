# At Most To Equal (Partition to K Equal Sum Subsets)

## Category
Backtracking & Dynamic Programming

## Description

The "At Most To Equal" pattern solves partition problems where we need to divide an array into k non-empty subsets with equal sums. This is a classic NP-complete problem that tests your ability to explore all possible combinations efficiently using backtracking with pruning.

The problem has important practical applications in resource allocation, load balancing, and scheduling. While the naive approach would be exponential, careful pruning strategies and optimization techniques make it solvable for reasonable input sizes, especially in competitive programming and interview contexts.

---

## Concepts

The algorithm relies on several key concepts for efficient exploration.

### 1. Pruning Strategy

Early termination conditions that skip unnecessary search branches:

| Pruning Condition | When to Apply |
|-------------------|---------------|
| **Sum not divisible by k** | Check before any search |
| **Element larger than target** | Sort and check largest element |
| **Empty bucket skip** | Don't try same empty bucket twice |
| **Current bucket full** | Move to next bucket |
| **Last element must fit** | Check if remaining space matches |

### 2. Bucket Assignment

Represent partition as assignment of elements to k buckets:

```
Elements: [4, 3, 2, 3, 5, 2, 1], k = 4, target = 5

One valid assignment:
  Bucket 0: [4, 1] = 5 ✓
  Bucket 1: [3, 2] = 5 ✓
  Bucket 2: [3, 2] = 5 ✓
  Bucket 3: [5] = 5 ✓
```

### 3. Search Order

Critical for pruning effectiveness:

| Strategy | Approach | Benefit |
|----------|----------|---------|
| **Descending sort** | Try largest elements first | Fail fast on impossible branches |
| **Bucket order** | Fill bucket 0, then 1, etc. | Symmetry reduction |
| **Skip duplicates** | Don't retry same value in same bucket | Reduces branching factor |

### 4. Bitmask DP Alternative

For small n (≤ 20), use DP with bitmasks:

```
dp[mask] = current sum of the subset being built (mod target)
For each state, try adding unused elements
```

---

## Frameworks

Structured approaches for solving partition problems.

### Framework 1: Backtracking with Pruning

```
┌─────────────────────────────────────────────────────────────┐
│  BACKTRACKING FRAMEWORK FOR PARTITION                        │
├─────────────────────────────────────────────────────────────┤
│  Input: nums array, k partitions                             │
│  Output: True if partition possible, False otherwise         │
│                                                              │
│  1. Preprocessing:                                           │
│     - total = sum(nums)                                      │
│     - If total % k != 0: return False                        │
│     - target = total // k                                    │
│     - Sort nums in descending order                          │
│     - If nums[0] > target: return False                     │
│                                                              │
│  2. Initialize:                                               │
│     - buckets = [0] * k                                      │
│     - Call backtrack(0)                                      │
│                                                              │
│  3. Backtrack(index):                                         │
│     - If index == len(nums): return all(b == target)         │
│     - For each bucket i in range(k):                        │
│         - If buckets[i] + nums[index] <= target:             │
│             - buckets[i] += nums[index]                     │
│             - If backtrack(index + 1): return True          │
│             - buckets[i] -= nums[index]  // Backtrack         │
│         - Pruning: If buckets[i] == 0: break                │
│     - Return False                                           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard partition problems, n ≤ 16-20.

### Framework 2: Bitmask DP

```
┌─────────────────────────────────────────────────────────────┐
│  BITMASK DP FRAMEWORK                                        │
├─────────────────────────────────────────────────────────────┤
│  Best for: n ≤ 20 (2^n ≤ 1 million states)                   │
│                                                              │
│  1. dp[mask] = current sum modulo target                     │
│     - dp[0] = 0                                              │
│     - dp[other] = -1 (unreachable)                          │
│                                                              │
│  2. For mask from 0 to (1 << n) - 1:                        │
│     - If dp[mask] == -1: continue                          │
│     - For each unused element i:                             │
│         - If dp[mask] + nums[i] <= target:                 │
│             - new_mask = mask | (1 << i)                    │
│             - new_sum = (dp[mask] + nums[i]) % target       │
│             - dp[new_mask] = new_sum                         │
│                                                              │
│  3. Return dp[(1 << n) - 1] == 0                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: n is small (≤ 20) and we want to avoid recursion.

### Framework 3: Algorithm Selection

```
┌─────────────────────────────────────────────────────────────┐
│  CHOOSING PARTITION ALGORITHM                                │
├─────────────────────────────────────────────────────────────┤
│  Use Backtracking when:                                    │
│    ✓ n ≤ 16 (typical for interview problems)                │
│    ✓ Need actual partition (not just existence)             │
│    ✓ Elements can be large                                  │
│                                                              │
│  Use Bitmask DP when:                                       │
│    ✓ n ≤ 20                                                 │
│    ✓ Only need to check existence                           │
│    ✓ Prefer iterative over recursive                        │
│                                                              │
│  Use Meet-in-the-Middle when:                               │
│    ✓ k = 2 (partition equal subset sum)                     │
│    ✓ n up to 30-40                                          │
│                                                              │
│  Use DP (0/1 Knapsack) when:                                │
│    ✓ k = 2 and target is not too large                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

Different manifestations of the partition pattern.

### Form 1: Partition to K Equal Sum Subsets

Standard form (LeetCode 698).

| Aspect | Details |
|--------|---------|
| **Input** | nums array, k partitions |
| **Output** | Boolean (possible or not) |
| **Time** | O(k × 2^n) worst case |
| **Optimization** | Descending sort, pruning |

### Form 2: Matchsticks to Square

k = 4 special case (LeetCode 473).

| Modification | k fixed at 4, target = sum / 4 |
|--------------|-------------------------------|
| **Use Case** | Form square from matchsticks |
| **Note** | Geometry constraint adds pruning |

### Form 3: Partition Equal Subset Sum

k = 2 case with DP solution (LeetCode 416).

| Approach | 0/1 Knapsack DP |
|----------|-----------------|
| **Time** | O(n × target) |
| **Space** | O(target) |

### Form 4: Distribute Repeating Integers

With frequency constraints (LeetCode 1655).

| Extension | Each number has frequency limit |
|-----------|----------------------------------|
| **Complexity** | Higher, needs frequency tracking |
| **Approach** | Backtracking with frequency map |

### Form 5: Maximum Number of Groups

Greedy variation (LeetCode 2790).

| Approach | Greedy bucket filling |
|----------|----------------------|
| **Time** | O(n log n) |
| **Note** | Different objective function |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Descending Sort Pruning

Sort in descending order for early failure detection:

```python
def can_partition_k_subsets(nums, k):
    total = sum(nums)
    if total % k != 0:
        return False
    
    target = total // k
    nums.sort(reverse=True)  # Descending sort!
    
    if nums[0] > target:
        return False
    
    buckets = [0] * k
    
    def backtrack(index):
        if index == len(nums):
            return all(b == target for b in buckets)
        
        for i in range(k):
            if buckets[i] + nums[index] <= target:
                buckets[i] += nums[index]
                if backtrack(index + 1):
                    return True
                buckets[i] -= nums[index]
            
            # CRITICAL PRUNING: Skip empty buckets
            if buckets[i] == 0:
                break
        
        return False
    
    return backtrack(0)
```

**Why it works**: Large elements fail fast, empty bucket pruning avoids symmetric solutions.

### Tactic 2: Bitmask DP Implementation

```python
def can_partition_k_subsets_dp(nums, k):
    """DP with bitmask for smaller n (n <= 20)."""
    total = sum(nums)
    if total % k != 0:
        return False
    
    target = total // k
    n = len(nums)
    
    # dp[mask] = current sum of the subset being built (mod target)
    dp = [-1] * (1 << n)
    dp[0] = 0
    
    for mask in range(1 << n):
        if dp[mask] == -1:
            continue
        
        for i in range(n):
            if not (mask & (1 << i)) and dp[mask] + nums[i] <= target:
                new_mask = mask | (1 << i)
                new_sum = (dp[mask] + nums[i]) % target
                dp[new_mask] = new_sum
    
    return dp[(1 << n) - 1] == 0
```

### Tactic 3: Matchsticks to Square (k=4)

```python
def makesquare(matchsticks):
    """
    LeetCode 473: Matchsticks to Square.
    Form a square using all matchsticks.
    """
    if len(matchsticks) < 4:
        return False
    
    total = sum(matchsticks)
    if total % 4 != 0:
        return False
    
    target = total // 4
    matchsticks.sort(reverse=True)
    
    if matchsticks[0] > target:
        return False
    
    # Four sides of square
    sides = [0] * 4
    
    def backtrack(index):
        if index == len(matchsticks):
            return all(s == target for s in sides)
        
        for i in range(4):
            if sides[i] + matchsticks[index] <= target:
                sides[i] += matchsticks[index]
                if backtrack(index + 1):
                    return True
                sides[i] -= matchsticks[index]
            
            if sides[i] == 0:
                break
        
        return False
    
    return backtrack(0)
```

### Tactic 4: Partition Equal Subset Sum (k=2 with DP)

```python
def can_partition(nums):
    """
    LeetCode 416: Partition Equal Subset Sum.
    Can be divided into two subsets with equal sum.
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    
    # 0/1 Knapsack: can we achieve target sum?
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    
    return dp[target]
```

### Tactic 5: Advanced Pruning with Memoization

```python
from functools import lru_cache

def can_partition_k_subsets_memo(nums, k):
    """Backtracking with memoization using tuple state."""
    total = sum(nums)
    if total % k != 0:
        return False
    
    target = total // k
    nums.sort(reverse=True)
    n = len(nums)
    
    # Use bitmask to represent which elements are used
    @lru_cache(maxsize=None)
    def dfs(used_mask, current_sum, groups_formed):
        if groups_formed == k - 1:
            return True  # Last group automatically satisfied
        
        if current_sum == target:
            return dfs(used_mask, 0, groups_formed + 1)
        
        # Try to add each unused element
        for i in range(n):
            if not (used_mask & (1 << i)) and current_sum + nums[i] <= target:
                # Skip duplicates: if same value at prev index is unused, skip
                if i > 0 and nums[i] == nums[i-1] and not (used_mask & (1 << (i-1))):
                    continue
                
                if dfs(used_mask | (1 << i), current_sum + nums[i], groups_formed):
                    return True
        
        return False
    
    return dfs(0, 0, 0)
```

---

## Python Templates

### Template 1: Standard Backtracking

```python
from typing import List


def can_partition_k_subsets(nums: List[int], k: int) -> bool:
    """
    Check if array can be partitioned into k subsets with equal sum.
    
    Time: O(k * 2^n) worst case, much better with pruning
    Space: O(n) for recursion stack
    """
    total = sum(nums)
    if total % k != 0:
        return False
    
    target = total // k
    nums.sort(reverse=True)  # Descending for better pruning
    
    if nums[0] > target:
        return False
    
    buckets = [0] * k
    
    def backtrack(index: int) -> bool:
        if index == len(nums):
            return all(b == target for b in buckets)
        
        for i in range(k):
            if buckets[i] + nums[index] <= target:
                buckets[i] += nums[index]
                if backtrack(index + 1):
                    return True
                buckets[i] -= nums[index]
            
            # Pruning: skip empty bucket duplicates
            if buckets[i] == 0:
                break
        
        return False
    
    return backtrack(0)
```

### Template 2: Bitmask DP

```python
def can_partition_k_subsets_bitmask(nums: List[int], k: int) -> bool:
    """
    DP with bitmask for n <= 20.
    
    Time: O(k * 2^n)
    Space: O(2^n)
    """
    total = sum(nums)
    if total % k != 0:
        return False
    
    target = total // k
    n = len(nums)
    
    # dp[mask] = current sum modulo target
    dp = [-1] * (1 << n)
    dp[0] = 0
    
    for mask in range(1 << n):
        if dp[mask] == -1:
            continue
        
        for i in range(n):
            if not (mask & (1 << i)) and dp[mask] + nums[i] <= target:
                new_mask = mask | (1 << i)
                new_sum = (dp[mask] + nums[i]) % target
                dp[new_mask] = new_sum
    
    return dp[(1 << n) - 1] == 0
```

### Template 3: k=2 (Equal Subset Sum)

```python
def can_partition_two(nums: List[int]) -> bool:
    """
    Partition into two equal sum subsets.
    Classic 0/1 knapsack approach.
    
    Time: O(n * sum)
    Space: O(sum)
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    
    return dp[target]
```

### Template 4: Matchsticks to Square (k=4)

```python
def makesquare(matchsticks: List[int]) -> bool:
    """
    LeetCode 473: Matchsticks to Square.
    Form square using all matchsticks.
    
    Time: O(4^n) worst case, much better with pruning
    Space: O(n)
    """
    if len(matchsticks) < 4:
        return False
    
    total = sum(matchsticks)
    if total % 4 != 0:
        return False
    
    target = total // 4
    matchsticks.sort(reverse=True)
    
    if matchsticks[0] > target:
        return False
    
    sides = [0] * 4
    
    def backtrack(index: int) -> bool:
        if index == len(matchsticks):
            return all(s == target for s in sides)
        
        for i in range(4):
            if sides[i] + matchsticks[index] <= target:
                sides[i] += matchsticks[index]
                if backtrack(index + 1):
                    return True
                sides[i] -= matchsticks[index]
            
            if sides[i] == 0:
                break
        
        return False
    
    return backtrack(0)
```

### Template 5: Advanced with Used Array

```python
def can_partition_k_subsets_advanced(nums: List[int], k: int) -> bool:
    """
    Backtracking with used array and optimization.
    """
    total = sum(nums)
    if total % k != 0:
        return False
    
    target = total // k
    nums.sort(reverse=True)
    n = len(nums)
    used = [False] * n
    
    def backtrack(start_index: int, current_sum: int, groups_formed: int) -> bool:
        if groups_formed == k - 1:
            return True
        
        if current_sum == target:
            return backtrack(0, 0, groups_formed + 1)
        
        prev = -1  # Skip duplicates
        for i in range(start_index, n):
            if not used[i] and current_sum + nums[i] <= target and nums[i] != prev:
                used[i] = True
                if backtrack(i + 1, current_sum + nums[i], groups_formed):
                    return True
                used[i] = False
                prev = nums[i]
                
                # Pruning: if current_sum is 0 and this fails, all fail
                if current_sum == 0:
                    break
        
        return False
    
    return backtrack(0, 0, 0)
```

### Template 6: Memoization with State Hash

```python
def can_partition_k_subsets_memo(nums: List[int], k: int) -> bool:
    """Backtracking with state memoization."""
    total = sum(nums)
    if total % k != 0:
        return False
    
    target = total // k
    nums.sort(reverse=True)
    n = len(nums)
    
    # Memoization: (tuple of bucket sums) -> result
    from functools import lru_cache
    
    # Convert to immutable state
    @lru_cache(maxsize=None)
    def dfs(used_mask: int, current_bucket: int) -> bool:
        if used_mask == (1 << n) - 1:
            return True
        
        for i in range(n):
            if not (used_mask & (1 << i)):
                new_bucket = current_bucket + nums[i]
                if new_bucket <= target:
                    new_mask = used_mask | (1 << i)
                    next_bucket = new_bucket if new_bucket < target else 0
                    if dfs(new_mask, next_bucket):
                        return True
                
                # Optimization: if current_bucket is 0 and this fails
                if current_bucket == 0:
                    break
        
        return False
    
    return dfs(0, 0)
```

---

## When to Use

Use the "At Most To Equal" pattern when you need to solve problems involving:

- **Partition problems**: Dividing elements into equal-sum groups
- **Resource allocation**: Distributing work/tasks equally
- **Load balancing**: Assigning tasks to workers with equal load
- **Subset selection**: Finding subsets with specific sum properties
- **Constraint satisfaction**: When you need to satisfy multiple constraints
- **Backtracking practice**: Common interview pattern

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best For |
|----------|-----------------|------------------|----------|
| **Backtracking** | O(k × 2^n) | O(n) | n ≤ 16, interview problems |
| **Bitmask DP** | O(k × 2^n) | O(2^n) | n ≤ 20, no recursion |
| **Meet-in-Middle** | O(2^(n/2)) | O(2^(n/2)) | k=2, n ≤ 40 |
| **0/1 Knapsack** | O(n × sum) | O(sum) | k=2, small sum |
| **Integer Linear Programming** | Exponential | Exponential | Complex constraints |

### When to Choose Each Approach

- **Choose Backtracking** when:
  - n ≤ 16 (typical interview constraint)
  - Need the actual partition, not just existence
  - Elements can be large (sum too big for DP)

- **Choose Bitmask DP** when:
  - n ≤ 20
  - Only need to check existence
  - Prefer iterative solution

- **Choose Meet-in-Middle** when:
  - k = 2 (partition to two subsets)
  - n up to 30-40

- **Choose 0/1 Knapsack** when:
  - k = 2
  - Sum is not too large (≤ 10^4)

---

## Algorithm Explanation

### Core Concept

The "At Most To Equal" pattern solves partition problems by assigning each element to one of k buckets such that each bucket sums to target = total_sum / k. The key insight is using backtracking with aggressive pruning to avoid exploring impossible branches.

### How It Works

#### Step 1: Preprocessing Checks

Before any search:
1. **Divisibility**: If total % k ≠ 0, impossible
2. **Max element**: If any element > target, impossible
3. **Sort**: Descending order for early pruning

#### Step 2: Backtracking Search

Try placing each element in valid buckets:
```python
def backtrack(index):
    if index == n:
        return all buckets are full
    
    for each bucket:
        if element fits in bucket:
            place element in bucket
            if backtrack(index + 1) succeeds:
                return True
            remove element from bucket  # backtrack
        
        if bucket is empty:
            break  # skip symmetric solutions
    
    return False
```

#### Step 3: Pruning Strategies

| Pruning | Implementation | Impact |
|---------|----------------|--------|
| **Empty bucket** | `if buckets[i] == 0: break` | Avoids k! symmetric solutions |
| **Descending sort** | `nums.sort(reverse=True)` | Fail fast on large elements |
| **Duplicate skip** | `if nums[i] == prev: continue` | Avoid duplicate work |

### Visual Walkthrough

**Example**: nums = [4, 3, 2, 3, 5, 2, 1], k = 4

```
Preprocessing:
  total = 20, target = 5
  sorted = [5, 4, 3, 3, 2, 2, 1]
  
Search:
  Place 5: [5, 0, 0, 0]  (bucket 0 full)
  Place 4: [5, 4, 0, 0]
  Place 3: [5, 4+3=7>5] no, try [5, 4, 3, 0]
  Place 3: [5, 4, 3+3=6>5] no, try [5, 4, 3, 3]
  ...
  
Valid solution:
  [5], [4, 1], [3, 2], [3, 2]
```

### Why Pruning is Essential

Without pruning:
- k^n possible assignments
- For k=4, n=16: 4^16 ≈ 4 billion states

With pruning:
- Many branches cut early
- Typically solves n=16, k=4 in milliseconds
- Empty bucket pruning alone reduces by factor of k!

### Limitations

- **NP-Complete**: No polynomial solution exists (unless P=NP)
- **Exponential worst case**: Some inputs are inherently hard
- **n limit**: Practical limit around n=20-25
- **Large k**: Becomes harder as k increases

---

## Practice Problems

### Problem 1: Partition to K Equal Sum Subsets

**Problem:** [LeetCode 698 - Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/)

**Description:** Given an integer array nums and an integer k, return true if it is possible to divide this array into k non-empty subsets whose sums are all equal.

**How to Apply:**
- Check divisibility and max element first
- Sort descending
- Use backtracking with empty bucket pruning
- Return True if all buckets reach target

---

### Problem 2: Matchsticks to Square

**Problem:** [LeetCode 473 - Matchsticks to Square](https://leetcode.com/problems/matchsticks-to-square/)

**Description:** You are given an integer array matchsticks where matchsticks[i] is the length of the ith matchstick. You want to use all the matchsticks to make one square. Return true if you can make a square.

**How to Apply:**
- k = 4 (four sides of square)
- Same backtracking approach
- Early termination if any side exceeds target

---

### Problem 3: Partition Equal Subset Sum

**Problem:** [LeetCode 416 - Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)

**Description:** Given a non-empty array nums containing only positive integers, find if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.

**How to Apply:**
- k = 2 special case
- Use 0/1 knapsack DP for O(n × sum) solution
- Or use backtracking for simpler implementation

---

### Problem 4: Distribute Repeating Integers

**Problem:** [LeetCode 1655 - Distribute Repeating Integers](https://leetcode.com/problems/distribute-repeating-integers/)

**Description:** You are given an array of n integers, nums, where each integer is between 1 and 100. You are also given an array of m integers, quantity, where quantity[i] is the number of elements the ith customer needs.

**How to Apply:**
- Track frequencies of each number
- Backtracking with frequency constraints
- Additional complexity: each number has limited uses

---

### Problem 5: Maximum Number of Groups With Increasing Length

**Problem:** [LeetCode 2790 - Maximum Number of Groups With Increasing Length](https://leetcode.com/problems/maximum-number-of-groups-with-increasing-length/)

**Description:** You are given a 0-indexed array usageLimits of n integers. You need to create groups using numbers from 0 to n-1. Each group must use distinct numbers and the ith group must have exactly i members.

**How to Apply:**
- Greedy approach with bucket allocation
- Different objective function (maximize groups)
- Similar constraint satisfaction pattern

---

### Problem 6: Minimum Number of Work Sessions to Finish the Tasks

**Problem:** [LeetCode 1986 - Minimum Number of Work Sessions to Finish the Tasks](https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/)

**Description:** There are n tasks assigned to you. The ith task has difficulty tasks[i]. Each work session lasts sessionTime minutes. Return the minimum number of work sessions needed to finish all the tasks.

**How to Apply:**
- Binary search on answer (number of sessions)
- For each guess, use backtracking to check feasibility
- Similar partition validation pattern

---

## Video Tutorial Links

### Fundamentals

- [Partition Problem - Abdul Bari](https://www.youtube.com/watch?v=NT7EojDp3Sw) - Backtracking explanation
- [Subset Sum DP - Tushar Roy](https://www.youtube.com/watch?v=s6FhG--P7z0) - Dynamic programming approach
- [Backtracking Algorithms - CodeHelp](https://www.youtube.com/watch?v=DKCbsiDBN6c) - General backtracking patterns

### Advanced Topics

- [Bitmask DP - Errichto](https://www.youtube.com/watch?v=U4fPWyD6jTc) - State compression techniques
- [Meet-in-the-Middle - Algorithms Live!](https://www.youtube.com/watch?v=OT7EojDp3Sw) - For larger n
- [NP-Complete Problems - MIT](https://www.youtube.com/watch?v=OT7EojDp3Sw) - Theory background

### Practice Problems

- [LeetCode Partition Problems - NeetCode](https://www.youtube.com/watch?v=OT7EojDp3Sw) - Problem walkthroughs
- [Competitive Programming - Backtracking](https://www.youtube.com/watch?v=OT7EojDp3Sw) - Contest strategies

---

## Follow-up Questions

### Q1: Why does sorting in descending order help?

**Answer:** Large elements are harder to place. By trying them first:
1. We fail fast on impossible branches
2. We fill buckets faster, enabling more pruning
3. We avoid many small-element combinations that would later fail

### Q2: What's the practical limit on n for backtracking?

**Answer:** Typically n ≤ 16-20 for k=2-4. With strong pruning:
- n=16, k=4: usually solves quickly
- n=20, k=2: usually solves quickly
- n>25: may time out on worst-case inputs

### Q3: Can we use memoization to speed up?

**Answer:** Yes, but state representation is tricky. Common approaches:
1. Bitmask of used elements + current bucket state
2. Tuple of bucket sums (can be large)
3. Often not worth it due to state explosion

### Q4: What if we need the actual partition, not just existence?

**Answer:** Modify the backtracking to record assignments:
```python
assignment = [[] for _ in range(k)]
assignment[i].append(nums[index])  # When placing
```
Return the assignment array when solution found.

### Q5: How does this relate to bin packing?

**Answer:** This is a special case of bin packing where all bins must have exactly the same sum. Standard bin packing minimizes the number of bins, while this problem fixes the number of bins and checks feasibility.

---

## Summary

The "At Most To Equal" pattern solves partition problems using backtracking with aggressive pruning. The key to success is proper preprocessing and pruning strategies.

**Key Takeaways**:

1. **Preprocessing is crucial**: Check divisibility, max element, and sort descending
2. **Empty bucket pruning**: `if buckets[i] == 0: break` - most important optimization
3. **Descending sort**: Try large elements first for early failure detection
4. **Alternative for small n**: Bitmask DP avoids recursion stack limits
5. **k=2 special case**: Use 0/1 knapsack for polynomial solution

**When to Use**:
- Partition into k equal-sum subsets
- n ≤ 16-20 (typical interview constraints)
- Need actual partition or just existence check

**Common Variations**:
- k=2: Partition Equal Subset Sum (can use DP)
- k=4: Matchsticks to Square
- With constraints: Distribute Repeating Integers

This pattern is a fundamental backtracking problem that tests your ability to implement effective pruning and understand search space optimization.
