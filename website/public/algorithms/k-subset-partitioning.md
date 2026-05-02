# K-Subset Partitioning

## Category
Backtracking

## Description

K-Subset Partitioning is an algorithmic pattern for dividing a set of numbers into k subsets such that each subset has the same sum. This is a classic NP-complete problem that requires backtracking with sophisticated pruning techniques to solve efficiently for small to moderate input sizes.

The problem appears frequently in competitive programming and real-world scenarios like workload balancing, resource allocation, and game design. While no polynomial-time solution exists (unless P=NP), clever backtracking with pruning can solve instances with n ≤ 20-30 elements efficiently. The key insight is that by sorting the array in descending order and using constraint propagation, we can dramatically reduce the search space.

---

## Concepts

K-subset partitioning relies on several fundamental concepts to make the search tractable.

### 1. The Partition Problem

Mathematical foundation of equal-sum partitioning:

| Concept | Description |
|---------|-------------|
| **Total Sum** | Sum of all elements must be divisible by k |
| **Target** | Each subset must sum to total_sum / k |
| **NP-Complete** | No known polynomial-time algorithm |
| **Backtracking** | Systematic search with pruning is standard approach |

### 2. Search Space Reduction

Techniques to minimize the exponential search:

| Technique | How It Helps | Impact |
|-----------|--------------|--------|
| **Sort Descending** | Try large numbers first | Reduces branching early |
| **Skip Empty Buckets** | Don't try placing in multiple empty buckets | Reduces symmetry |
| **Early Termination** | Stop if any bucket exceeds target | Prunes invalid branches |
| **Pre-checks** | Verify divisibility, max element ≤ target | Quick rejection |

### 3. Backtracking Structure

The recursive decision process:

```
For each element (sorted descending):
    Try placing in bucket 0, 1, ..., k-1
    If fits (bucket_sum + element ≤ target):
        Place it
        Recurse to next element
        If solution found, return True
        Remove it (backtrack)
    
    Pruning: If bucket is empty, skip trying other empty buckets
            (all empty buckets are equivalent)
```

### 4. Complexity Analysis

Understanding the computational limits:

| n (elements) | k (subsets) | Approximate Complexity | Feasibility |
|--------------|-------------|------------------------|-------------|
| ≤ 16 | 2-4 | O(k^n) but pruned well | Easy |
| ≤ 20 | 2-4 | Still tractable | Moderate |
| ≤ 25 | 2-4 | Requires good pruning | Hard |
| > 30 | any | Often infeasible | Use DP/approximation |

---

## Frameworks

Structured approaches for solving k-partition problems.

### Framework 1: Standard Backtracking with Pruning

```
┌─────────────────────────────────────────────────────────────┐
│  K-PARTITION BACKTRACKING FRAMEWORK                           │
├─────────────────────────────────────────────────────────────┤
│  1. Preprocessing:                                            │
│     - Calculate total sum                                       │
│     - Check total % k == 0, return False if not              │
│     - target = total // k                                      │
│     - Sort array in descending order                          │
│     - Check max element ≤ target, return False if exceeds    │
│                                                                │
│  2. Initialize:                                               │
│     - buckets = [0] * k (current sum in each bucket)         │
│                                                                │
│  3. Backtrack(index):                                         │
│     - If index == n: return all(b == target for b in buckets)│
│     - For each bucket i:                                      │
│         - If buckets[i] + nums[index] ≤ target:            │
│             - buckets[i] += nums[index]                       │
│             - If backtrack(index + 1): return True           │
│             - buckets[i] -= nums[index] (backtrack)            │
│         - Pruning: If buckets[i] == 0: break                 │
│     - Return False                                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard k-partition existence check.

### Framework 2: DP with Bitmask (Small n)

```
┌─────────────────────────────────────────────────────────────┐
│  DP WITH BITMASK FRAMEWORK (n ≤ 20)                         │
├─────────────────────────────────────────────────────────────┤
│  1. dp[mask] = current sum of subset being built % target    │
│                                                                │
│  2. Initialize: dp[0] = 0, rest = -1                         │
│                                                                │
│  3. For each mask:                                            │
│     - If dp[mask] == -1: skip                                 │
│     - For each element i not in mask:                        │
│         - new_mask = mask | (1 << i)                         │
│         - new_sum = dp[mask] + nums[i]                       │
│         - If new_sum ≤ target:                               │
│             - dp[new_mask] = new_sum % target                │
│                                                                │
│  4. Return dp[(1<<n) - 1] == 0                                │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Small n (≤ 20), need existence check without reconstruction.

### Framework 3: Finding All Partitions

```
┌─────────────────────────────────────────────────────────────┐
│  FIND ALL K-PARTITIONS FRAMEWORK                              │
├─────────────────────────────────────────────────────────────┤
│  Similar to standard framework, but:                         │
│                                                                │
│  1. Instead of returning True/False, collect all solutions   │
│                                                                │
│  2. Maintain current_partition = [[] for _ in range(k)]     │
│                                                                │
│  3. When index == n and valid:                               │
│     - Append deep copy of current_partition to results       │
│                                                                │
│  4. Continue searching (don't return immediately)            │
│                                                                │
│  Note: Number of solutions can be exponential!               │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Need to enumerate all valid partitions (warning: can be huge!).

---

## Forms

Different manifestations of the k-partition pattern.

### Form 1: Existence Check (Decision)

Determine if partition is possible.

| Aspect | Details |
|--------|---------|
| **Return** | Boolean (True/False) |
| **Use Case** | Quick feasibility check |
| **Optimization** | Return immediately on first success |

### Form 2: Partition Reconstruction

Return the actual partition.

| Aspect | Details |
|--------|---------|
| **Return** | List of k lists (the partition) or None |
| **Use Case** | Need to know how to partition |
| **Complexity** | Same as existence, just track choices |

### Form 3: Minimum K

Find the minimum k for which partition is possible.

| Approach | Try k from 1 to n, return first feasible |
|----------|----------------------------------------|
| **Lower Bound** | max(1, ceil(total / max_element)) |
| **Use Case** | Optimal resource allocation |

### Form 4: Constrained Partition

Additional constraints on partition.

| Constraint | Modification |
|------------|--------------|
| **Max per bucket** | Check len(bucket) < max_per_bucket |
| **Min per bucket** | Ensure each bucket gets minimum elements |
| **Specific elements together** | Pre-assign those elements |

### Form 5: Matchsticks to Square (k=4 special case)

Classic LeetCode problem.

| Aspect | Details |
|--------|---------|
| **k** | 4 (forming a square) |
| **Target** | Perimeter / 4 |
| **Note** | Each side must equal target |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Pruning by Skipping Empty Buckets

Critical optimization to reduce symmetry:

```python
def can_partition_k_subsets(nums, k):
    """
    Check if array can be partitioned into k subsets with equal sum.
    Time: O(k * 2^n) worst case, Space: O(n)
    """
    total = sum(nums)
    
    # Quick checks
    if k == 1:
        return True
    if total % k != 0:
        return False
    
    target = total // k
    n = len(nums)
    
    # Sort descending for better pruning
    nums.sort(reverse=True)
    
    if nums[0] > target:
        return False
    
    # k buckets
    buckets = [0] * k
    
    def backtrack(index):
        if index == n:
            # Check if all buckets have target sum
            return all(b == target for b in buckets)
        
        # Try placing nums[index] in each bucket
        for i in range(k):
            if buckets[i] + nums[index] <= target:
                buckets[i] += nums[index]
                
                if backtrack(index + 1):
                    return True
                
                buckets[i] -= nums[index]
            
            # PRUNING: if bucket is empty, no need to try other empty buckets
            # (all empty buckets are equivalent)
            if buckets[i] == 0:
                break
        
        return False
    
    return backtrack(0)
```

### Tactic 2: DP with Bitmask for Small n

Dynamic programming for n ≤ 20:

```python
def can_partition_k_subsets_dp(nums, k):
    """
    DP with bitmask for n <= 20.
    Time: O(2^n * n), Space: O(2^n)
    """
    total = sum(nums)
    if total % k != 0:
        return False
    
    target = total // k
    n = len(nums)
    
    # dp[mask] = current sum of subset being built modulo target
    dp = [-1] * (1 << n)
    dp[0] = 0
    
    for mask in range(1 << n):
        if dp[mask] == -1:
            continue
        
        for i in range(n):
            if not (mask & (1 << i)):
                next_mask = mask | (1 << i)
                next_sum = dp[mask] + nums[i]
                
                if next_sum <= target:
                    dp[next_mask] = next_sum % target
    
    return dp[(1 << n) - 1] == 0
```

### Tactic 3: Find All Possible Partitions

Enumerate all valid partitions:

```python
def find_all_k_partitions(nums, k):
    """
    Find all ways to partition into k equal-sum subsets.
    Warning: Can be exponential!
    """
    total = sum(nums)
    if total % k != 0:
        return []
    
    target = total // k
    nums.sort(reverse=True)
    n = len(nums)
    
    result = []
    current_partition = [[] for _ in range(k)]
    
    def backtrack(index):
        if index == n:
            # Verify all have target sum
            if all(sum(bucket) == target for bucket in current_partition):
                result.append([bucket[:] for bucket in current_partition])
            return
        
        # Try each bucket
        for i in range(k):
            if sum(current_partition[i]) + nums[index] <= target:
                current_partition[i].append(nums[index])
                backtrack(index + 1)
                current_partition[i].pop()
            
            if sum(current_partition[i]) == 0:
                break
    
    backtrack(0)
    return result
```

### Tactic 4: Minimum K Equal Sum Partition

Find optimal k:

```python
def min_k_equal_sum_partition(nums):
    """
    Find minimum k such that partition into k equal-sum subsets is possible.
    """
    total = sum(nums)
    max_num = max(nums)
    
    # k must divide total and k >= ceil(total / max_num)
    min_k = max(1, (total + max_num - 1) // max_num)
    
    for k in range(min_k, len(nums) + 1):
        if total % k == 0 and can_partition_k_subsets(nums[:], k):
            return k
    
    return len(nums)  # Each element in its own subset
```

### Tactic 5: Partition with Constraints

Additional constraints on items per bucket:

```python
def can_partition_with_constraints(nums, k, max_per_bucket):
    """
    Partition with constraint on items per bucket.
    """
    total = sum(nums)
    if total % k != 0:
        return False
    
    target = total // k
    nums.sort(reverse=True)
    
    buckets = [[] for _ in range(k)]
    
    def backtrack(index):
        if index == len(nums):
            return all(len(b) <= max_per_bucket and sum(b) == target for b in buckets)
        
        for i in range(k):
            if len(buckets[i]) < max_per_bucket and sum(buckets[i]) + nums[index] <= target:
                buckets[i].append(nums[index])
                if backtrack(index + 1):
                    return True
                buckets[i].pop()
            
            if len(buckets[i]) == 0:
                break
        
        return False
    
    return backtrack(0)
```

---

## Python Templates

### Template 1: Basic K-Partition Existence Check

```python
def can_partition_k_subsets(nums: list[int], k: int) -> bool:
    """
    Check if array can be partitioned into k subsets with equal sum.
    
    Args:
        nums: List of positive integers
        k: Number of subsets to partition into
    
    Returns:
        True if possible, False otherwise
        
    Time: O(k * 2^n) worst case, heavily pruned in practice
    Space: O(n) for recursion stack
    """
    total = sum(nums)
    
    # Quick rejection checks
    if k == 1:
        return True
    if total % k != 0:
        return False
    
    target = total // k
    nums.sort(reverse=True)  # Sort descending for better pruning
    
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

### Template 2: K-Partition with Reconstruction

```python
def partition_k_subsets(nums: list[int], k: int) -> list[list[int]] | None:
    """
    Partition array into k subsets with equal sum.
    Returns the partition if possible, None otherwise.
    """
    total = sum(nums)
    
    if k == 1:
        return [nums[:]]
    if total % k != 0:
        return None
    
    target = total // k
    nums.sort(reverse=True)
    
    if nums[0] > target:
        return None
    
    n = len(nums)
    result = [[] for _ in range(k)]
    
    def backtrack(index: int) -> bool:
        if index == n:
            return True
        
        for i in range(k):
            if sum(result[i]) + nums[index] <= target:
                result[i].append(nums[index])
                if backtrack(index + 1):
                    return True
                result[i].pop()
            
            if sum(result[i]) == 0:
                break
        
        return False
    
    if backtrack(0):
        return result
    return None
```

### Template 3: Matchsticks to Square (K=4)

```python
def makesquare(matchsticks: list[int]) -> bool:
    """
    LeetCode 473: Matchsticks to Square.
    Determine if matchsticks can form a square.
    
    Args:
        matchsticks: List of matchstick lengths
    
    Returns:
        True if can form square, False otherwise
    """
    total = sum(matchsticks)
    
    # Square requires 4 equal sides
    if total % 4 != 0:
        return False
    
    side = total // 4
    matchsticks.sort(reverse=True)
    
    if matchsticks[0] > side:
        return False
    
    # 4 sides of the square
    sides = [0] * 4
    
    def backtrack(index: int) -> bool:
        if index == len(matchsticks):
            return all(s == side for s in sides)
        
        for i in range(4):
            if sides[i] + matchsticks[index] <= side:
                sides[i] += matchsticks[index]
                if backtrack(index + 1):
                    return True
                sides[i] -= matchsticks[index]
            
            if sides[i] == 0:
                break
        
        return False
    
    return backtrack(0)
```

### Template 4: Bitmask DP for K-Partition

```python
def can_partition_k_subsets_bitmask(nums: list[int], k: int) -> bool:
    """
    K-partition using bitmask DP.
    Efficient for n <= 20.
    
    Time: O(2^n * n)
    Space: O(2^n)
    """
    total = sum(nums)
    if total % k != 0:
        return False
    
    target = total // k
    n = len(nums)
    
    # dp[mask] = current sum of subset being built % target
    dp = [-1] * (1 << n)
    dp[0] = 0
    
    for mask in range(1 << n):
        if dp[mask] == -1:
            continue
        
        for i in range(n):
            if not (mask & (1 << i)):
                next_mask = mask | (1 << i)
                next_sum = dp[mask] + nums[i]
                
                if next_sum <= target:
                    dp[next_mask] = next_sum % target
    
    # All elements used and perfectly partitioned
    return dp[(1 << n) - 1] == 0
```

### Template 5: Fair Distribution of Cookies (Minimize Max Sum)

```python
def distribute_cookies(cookies: list[int], k: int) -> int:
    """
    LeetCode 2305: Fair Distribution of Cookies.
    Distribute cookies to k children minimizing the maximum sum.
    
    Args:
        cookies: List of cookie bags (each bag has some cookies)
        k: Number of children
    
    Returns:
        Minimum possible unfairness (minimized max sum)
    """
    n = len(cookies)
    children = [0] * k
    result = float('inf')
    
    def backtrack(index: int):
        nonlocal result
        
        if index == n:
            result = min(result, max(children))
            return
        
        # Pruning: if current max already >= best, skip
        if max(children) >= result:
            return
        
        for i in range(k):
            children[i] += cookies[index]
            backtrack(index + 1)
            children[i] -= cookies[index]
            
            # Pruning: if child i got 0, no need to try other 0s
            if children[i] == 0:
                break
    
    backtrack(0)
    return result
```

### Template 6: Advanced K-Partition with Multiple Pruning Strategies

```python
def can_partition_k_subsets_advanced(nums: list[int], k: int) -> bool:
    """
    K-partition with multiple pruning strategies for better performance.
    """
    total = sum(nums)
    
    if k == 1:
        return True
    if total % k != 0:
        return False
    
    target = total // k
    
    # Strategy 1: Sort descending
    nums.sort(reverse=True)
    
    # Strategy 2: Quick rejection if largest > target
    if nums[0] > target:
        return False
    
    # Strategy 3: Count frequency and handle duplicates efficiently
    from collections import Counter
    freq = Counter(nums)
    unique_nums = sorted(freq.keys(), reverse=True)
    
    buckets = [0] * k
    
    def backtrack(index: int) -> bool:
        if index == len(unique_nums):
            return all(b == target for b in buckets)
        
        num = unique_nums[index]
        count = freq[num]
        
        # Try placing all occurrences of this number
        def place_occurrence(occurrence: int, start_bucket: int) -> bool:
            if occurrence == count:
                return backtrack(index + 1)
            
            for i in range(start_bucket, k):
                if buckets[i] + num <= target:
                    buckets[i] += num
                    if place_occurrence(occurrence + 1, i):
                        return True
                    buckets[i] -= num
                    
                    # Pruning: if bucket becomes empty, skip duplicates
                    if buckets[i] == 0:
                        break
            
            return False
        
        return place_occurrence(0, 0)
    
    return backtrack(0)
```

---

## When to Use

Use K-Subset Partitioning when you need to solve problems involving:

- **Equal Division**: Dividing resources into k equal groups
- **Workload Balancing**: Distributing tasks equally among workers
- **Geometric Constructions**: Matchsticks to square, forming shapes
- **Constraint Satisfaction**: Exact cover problems
- **Resource Allocation**: Fair distribution problems

### Comparison with Alternatives

| Approach | Time | Space | Best For | Limitations |
|----------|------|-------|----------|-------------|
| **Backtracking** | O(k * 2^n) | O(n) | General case, n ≤ 20-25 | Exponential |
| **Bitmask DP** | O(2^n * n) | O(2^n) | n ≤ 20 | Space intensive |
| **ILP Solver** | Varies | Varies | Exact solution, larger n | External dependency |
| **Greedy** | O(n log n) | O(1) | Approximation only | Not exact |

### When to Choose Each Approach

- **Choose Backtracking** when:
  - n is small to moderate (≤ 25)
  - Need exact solution
  - Want to reconstruct the actual partition
  - Can apply effective pruning

- **Choose Bitmask DP** when:
  - n ≤ 20
  - Only need existence check
  - Prefer iterative solution

- **Choose ILP** when:
  - n is larger (30-50)
  - Have access to optimization solvers
  - Need exact solution

- **Choose Greedy** when:
  - Approximation is acceptable
  - Very large n
  - Real-time requirements

---

## Algorithm Explanation

### Core Concept

K-Subset Partitioning determines if a set of numbers can be divided into k groups with equal sums. This is an NP-complete problem, meaning no known polynomial-time algorithm exists. The standard approach is backtracking with pruning—systematically trying assignments while eliminating impossible branches early.

### How It Works

#### Step 1: Preprocessing

```python
total = sum(nums)
if total % k != 0: return False  # Can't divide equally
target = total // k  # Each subset must sum to this
nums.sort(reverse=True)  # Try large numbers first
```

#### Step 2: Recursive Backtracking

For each element, try placing it in each bucket:
```python
def backtrack(index):
    if index == len(nums):  # All elements placed
        return all buckets have target sum
    
    for each bucket:
        if bucket_sum + nums[index] <= target:
            place element in bucket
            if backtrack(index + 1): return True
            remove element (backtrack)
        
        if bucket is empty: break  # Skip duplicate empty buckets
    
    return False
```

#### Step 3: Pruning Strategies

1. **Empty bucket pruning**: Don't try placing in multiple empty buckets (they're equivalent)
2. **Early termination**: Stop if current sum exceeds target
3. **Sorting**: Place large elements first to fail fast

### Visual Walkthrough

**Example**: nums = [4, 3, 2, 3, 5, 2, 1], k = 4
```
total = 20, target = 5
Sorted: [5, 4, 3, 3, 2, 2, 1]

Try placing 5:
  Bucket 0: [5] (sum=5) ✓
  
Try placing 4:
  Bucket 0: sum=5, can't add
  Bucket 1: [4] (sum=4)
  
Try placing 3:
  Bucket 0: sum=5, can't add
  Bucket 1: sum=4, can add → [4,3] = 7 > 5, can't
  Bucket 2: [3] (sum=3)
  
Continue...

Final solution: [5], [4,1], [3,2], [3,2]
```

### Why Pruning Works

- **Symmetry reduction**: Empty buckets are interchangeable
- **Early cutoff**: Large elements first means quick failure detection
- **Constraint propagation**: Once a bucket is full, it can't accept more

### Limitations

- **Exponential worst case**: O(k^n) without pruning
- **Size limit**: Practical limit around n = 20-30
- **No polynomial solution**: NP-complete means no efficient exact algorithm known

---

## Practice Problems

### Problem 1: Partition to K Equal Sum Subsets

**Problem:** [LeetCode 698 - Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/)

**Description:** Given an array of integers and integer k, determine if the array can be partitioned into k subsets with equal sum.

**How to Apply:**
- Classic k-partition problem
- Use backtracking with all pruning strategies
- Sort descending, skip empty buckets

---

### Problem 2: Matchsticks to Square

**Problem:** [LeetCode 473 - Matchsticks to Square](https://leetcode.com/problems/matchsticks-to-square/)

**Description:** Given matchstick lengths, determine if they can form a square (k=4 special case).

**How to Apply:**
- Set k = 4
- Target = sum / 4
- Each side must equal target

---

### Problem 3: Fair Distribution of Cookies

**Problem:** [LeetCode 2305 - Fair Distribution of Cookies](https://leetcode.com/problems/fair-distribution-of-cookies/)

**Description:** Distribute cookies to k children to minimize the maximum sum any child gets.

**How to Apply:**
- Backtracking with minimization objective
- Pruning when current max >= best found
- Similar structure to k-partition

---

### Problem 4: The Number of Good Subsets

**Problem:** [LeetCode 1994 - The Number of Good Subsets](https://leetcode.com/problems/the-number-of-good-subsets/)

**Description:** Count valid partitions with prime number constraints.

**How to Apply:**
- Advanced k-partition with additional constraints
- Use prime factorization for constraints

---

### Problem 5: Tallest Billboard

**Problem:** [LeetCode 956 - Tallest Billboard](https://leetcode.com/problems/tallest-billboard/)

**Description:** Partition rods into two groups with equal total height.

**How to Apply:**
- k=2 special case with maximization
- Use DP instead of backtracking for this variant

---

## Video Tutorial Links

### Fundamentals

- [Backtracking Algorithms - Abdul Bari](https://www.youtube.com/watch?v=DKCbsiDBpMk) - Backtracking concepts
- [Partition Problems - NeetCode](https://www.youtube.com/watch?v=3yH7K3aWvkM) - Problem walkthrough

### Advanced Topics

- [NP-Complete Problems - MIT](https://www.youtube.com/watch?v=MOeNvl3q2cQ) - Complexity theory
- [Constraint Satisfaction - Stanford](https://www.youtube.com/watch?v=4Oe2zN6T9tM) - CSP techniques

---

## Follow-up Questions

### Q1: Why is k-partition NP-complete?

**Answer:** We can reduce the Partition problem (known NP-complete, k=2) to k-partition. The Partition problem asks if a set can be split into two equal-sum subsets. This is a special case of k-partition where k=2. Since a special case is NP-complete, the general problem is also NP-complete.

---

### Q2: How does the "skip empty buckets" pruning work?

**Answer:** If we place an element in an empty bucket and the placement doesn't lead to a solution, there's no point trying other empty buckets—they're all equivalent at that moment. This reduces the branching factor significantly, especially early in the search when many buckets are empty.

---

### Q3: Can we use dynamic programming for larger n?

**Answer:** Standard DP with O(2^n) state works for n ≤ 20-25. For larger n, pseudo-polynomial DP exists if numbers are small (similar to knapsack). For very large n with arbitrary values, no efficient exact algorithm exists (unless P=NP).

---

### Q4: What's the difference between k-partition and bin packing?

**Answer:** K-partition requires equal sum in each subset. Bin packing tries to fit items into bins of fixed capacity, minimizing the number of bins. They're related but different problems. K-partition is about equality, bin packing is about capacity constraints.

---

### Q5: How do I handle duplicate numbers?

**Answer:** Duplicates can actually help pruning—if placing a duplicate in a bucket fails, other duplicates will likely fail too. Sorting groups duplicates together, making the "skip empty bucket" pruning more effective. Some implementations process all occurrences of a number together for better efficiency.

---

## Summary

K-Subset Partitioning is a classic NP-complete problem solved using backtracking with aggressive pruning. The key takeaways are:

1. **NP-Complete**: No polynomial-time solution known, backtracking is standard
2. **Sort Descending**: Place large elements first for better pruning
3. **Skip Empty Buckets**: Critical symmetry-breaking optimization
4. **Pre-checks**: Quick rejection for impossible cases
5. **Size Limits**: Practical for n ≤ 20-30, use DP for n ≤ 20

**When to Use:**
- Workload/resource balancing problems
- Geometric constructions (matchsticks to square)
- Small to moderate input sizes (n ≤ 25)
- When exact solution is required

**Key Optimization:**
```python
# The magical pruning that makes it feasible
if buckets[i] == 0:
    break  # Skip trying other empty buckets
```

This pattern demonstrates how clever pruning can make exponential algorithms practical for competitive programming and real-world applications.
