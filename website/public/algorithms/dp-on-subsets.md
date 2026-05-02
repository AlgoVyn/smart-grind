# DP on Subsets (Bitmask DP)

## Category
Dynamic Programming - State Space Optimization

## Description

DP on Subsets (also known as Bitmask DP) is a dynamic programming technique where the state is represented as a subset of a base set, typically using bitmasks for efficient storage and manipulation. This approach is particularly powerful for solving combinatorial optimization problems where the solution involves selecting or arranging elements from a small set (usually n ≤ 20).

The key insight is that a subset can be efficiently represented as a bitmask, where each bit indicates whether a corresponding element is included. This allows O(1) subset operations and O(2ⁿ) state space, making it feasible to solve problems that would otherwise be computationally intractable. Common applications include the Traveling Salesman Problem, assignment problems, and set covering problems.

---

## Concepts

DP on Subsets relies on several fundamental concepts that enable efficient state representation and transitions.

### 1. Bitmask Representation

Subsets are represented as integers where each bit corresponds to an element:

| Bit Position | Meaning | Example (n=5) |
|--------------|---------|---------------|
| **0** | Element 0 included | 00001 = {0} |
| **1** | Element 1 included | 00010 = {1} |
| **i** | Element i included | 1<<i represents element i |
| **All bits** | Full set | 11111 = {0,1,2,3,4} |

### 2. Bit Manipulation Operations

Essential operations for subset manipulation:

| Operation | Code | Description |
|-----------|------|-------------|
| **Check if i in set** | `mask & (1<<i)` | Returns non-zero if element i included |
| **Add element i** | `mask | (1<<i)` | Set bit i to 1 |
| **Remove element i** | `mask & ~(1<<i)` | Set bit i to 0 |
| **Toggle element i** | `mask ^ (1<<i)` | Flip bit i |
| **Count elements** | `bin(mask).count('1')` | Population count |

### 3. Subset Iteration

Iterate through all subsets or submasks:

```python
# All subsets of n elements
for mask in range(1 << n):
    # Process subset 'mask'

# All submasks of a given mask
sub = mask
while sub:
    # Process submask 'sub'
    sub = (sub - 1) & mask
```

### 4. State Space Complexity

Understanding the exponential state space:

| n | 2ⁿ States | Typical Runtime |
|---|-----------|-----------------|
| **10** | 1,024 | Very fast |
| **15** | 32,768 | Fast |
| **20** | 1,048,576 | Moderate |
| **22** | 4,194,304 | Slow |
| **25** | 33,554,432 | Very slow |

---

## Frameworks

Structured approaches for implementing DP on Subsets.

### Framework 1: Standard Subset DP

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD SUBSET DP FRAMEWORK                                │
├─────────────────────────────────────────────────────────────┤
│  dp[mask] = optimal value for subset represented by mask   │
│                                                             │
│  1. Initialize:                                              │
│     dp[0] = base_value (empty set)                         │
│     dp[other] = infinity / negative infinity               │
│                                                             │
│  2. For each mask from 0 to (1<<n)-1:                       │
│     a. If dp[mask] is invalid, skip                        │
│                                                             │
│     b. For each element i not in mask:                      │
│        new_mask = mask | (1<<i)                            │
│        dp[new_mask] = optimize(dp[new_mask],                 │
│                               transition(dp[mask], i))     │
│                                                             │
│  3. Answer is dp[(1<<n)-1] (full set) or max over all masks │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Most subset DP problems (assignment, TSP variations).

### Framework 2: Subset DP with Precomputation

```
┌─────────────────────────────────────────────────────────────┐
│  PRECOMPUTED SUBSET DP FRAMEWORK                            │
├─────────────────────────────────────────────────────────────┤
│  When transition cost depends on subset properties:        │
│                                                             │
│  1. Precompute subset properties:                           │
│     subset_sum[mask] = sum of elements in mask             │
│     subset_valid[mask] = whether mask forms valid group    │
│                                                             │
│  2. DP with precomputed values:                             │
│     For each mask:                                          │
│        sub = mask                                           │
│        while sub:                                           │
│           if subset_valid[sub]:                            │
│              dp[mask] = min(dp[mask],                       │
│                            dp[mask ^ sub] + cost[sub])      │
│           sub = (sub - 1) & mask                           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Partition problems, set covering with costs.

### Framework 3: DP on Subsets Decision Tree

```
┌─────────────────────────────────────────────────────────────┐
│  CHOOSING DP ON SUBSETS                                      │
├─────────────────────────────────────────────────────────────┤
│  Use DP on Subsets when:                                     │
│    ✓ n ≤ 20 (state space manageable)                        │
│    ✓ Problem involves selecting/assigning from set           │
│    ✓ Need optimal selection with constraints                 │
│    ✓ Brute force O(n!) or O(2ⁿ × n!) too slow              │
│                                                             │
│  Alternative approaches:                                     │
│    - n > 20: Consider meet-in-middle (2^(n/2))             │
│    - Special structure: Greedy or other optimization        │
│    - Approximation needed: Heuristics or randomization      │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Deciding whether DP on subsets is appropriate.

---

## Forms

Different manifestations of the DP on subsets pattern.

### Form 1: Assignment Problem (TSP-style)

Assign each element to exactly one "slot" or position.

| Aspect | Details |
|--------|---------|
| **State** | dp[mask] = min cost to assign elements in mask |
| **Transition** | Add one unassigned element |
| **Time** | O(n × 2ⁿ) |
| **Example** | TSP, worker-job assignment |

### Form 2: Partition Problem

Divide set into groups with constraints.

```python
# Precompute which subsets are valid groups
can_form_group = [False] * (1 << n)
for mask in range(1 << n):
    can_form_group[mask] = check_valid(mask)

# DP: dp[mask] = min groups to cover mask
dp = [float('inf')] * (1 << n)
dp[0] = 0

for mask in range(1 << n):
    sub = mask
    while sub:
        if can_form_group[sub]:
            dp[mask] = min(dp[mask], dp[mask ^ sub] + 1)
        sub = (sub - 1) & mask
```

### Form 3: Subset Sum / Knapsack on Subsets

Select subset with specific properties.

| Variant | State Definition |
|---------|-----------------|
| **Exact sum** | dp[mask] = sum of elements in mask |
| **Target sum** | Check if any mask has sum = target |
| **Closest sum** | dp[mask] = sum, track closest to target |

### Form 4: Bitmask with Additional State

When bitmask alone is insufficient:

```python
# dp[mask][k] = optimal value for subset 'mask' with parameter k
# Example: TSP with current position
dp = [[inf] * n for _ in range(1 << n)]
# dp[mask][i] = min cost to visit 'mask' ending at city i
```

### Form 5: Inclusion-Exclusion DP

Counting problems using bitmask inclusion-exclusion:

| Pattern | Use Case |
|---------|----------|
| **Count supersets** | How many sets contain each subset |
| **Count subsets** | How many sets are contained in each subset |
| **Möbius transform** | Advanced counting on subsets |

---

## Tactics

Specific techniques and optimizations for DP on subsets.

### Tactic 1: Precompute Subset Sums

Efficient sum calculation for all subsets:

```python
def precompute_subset_sums(arr):
    """Precompute sum for all subsets."""
    n = len(arr)
    subset_sum = [0] * (1 << n)
    
    for mask in range(1 << n):
        # Find least significant set bit
        if mask:
            lsb = mask & -mask
            bit = (lsb.bit_length() - 1)
            prev = mask ^ lsb
            subset_sum[mask] = subset_sum[prev] + arr[bit]
    
    return subset_sum
```

### Tactic 2: SOS DP (Sum Over Subsets)

Compute values for all supersets efficiently:

```python
def sos_dp(n, values):
    """
    Sum Over Subsets DP.
    f[mask] = sum of values[submask] for all submask ⊆ mask.
    """
    f = values[:]
    
    for i in range(n):
        for mask in range(1 << n):
            if mask & (1 << i):
                f[mask] += f[mask ^ (1 << i)]
    
    return f
```

### Tactic 3: Iterating Submasks Efficiently

Iterate through all submasks of a mask:

```python
def iterate_submasks(mask):
    """Iterate all non-empty submasks."""
    sub = mask
    while sub:
        # Process submask 'sub'
        yield sub
        sub = (sub - 1) & mask

# Alternative: iterate proper submasks only
sub = mask
while sub:
    sub = (sub - 1) & mask
    if sub != mask:
        # Process proper submask
        pass
```

### Tactic 4: TSP-style DP with Position

Traveling Salesman Problem pattern:

```python
def tsp_dp(dist):
    """
    TSP using DP on subsets.
    dist[i][j] = distance from city i to city j.
    """
    n = len(dist)
    INF = float('inf')
    
    # dp[mask][i] = min cost to visit cities in mask, ending at i
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0  # Start at city 0
    
    for mask in range(1 << n):
        for last in range(n):
            if not (mask & (1 << last)):
                continue
            if dp[mask][last] == INF:
                continue
            
            # Try to go to next city
            for nxt in range(n):
                if mask & (1 << nxt):
                    continue
                new_mask = mask | (1 << nxt)
                dp[new_mask][nxt] = min(dp[new_mask][nxt],
                                        dp[mask][last] + dist[last][nxt])
    
    # Return to start
    ans = INF
    for last in range(1, n):
        ans = min(ans, dp[(1 << n) - 1][last] + dist[last][0])
    
    return ans
```

### Tactic 5: Meet-in-the-Middle for Larger n

When n > 20, split the set:

```python
def meet_in_middle(arr, target):
    """
    Find subset with sum closest to target.
    n can be up to 40 (split into two 20s).
    """
    n = len(arr)
    mid = n // 2
    
    # Generate all subset sums for left half
    left_sums = []
    for mask in range(1 << mid):
        s = sum(arr[i] for i in range(mid) if mask & (1 << i))
        left_sums.append(s)
    left_sums.sort()
    
    # Generate all subset sums for right half and search
    best = float('inf')
    for mask in range(1 << (n - mid)):
        s = sum(arr[mid + i] for i in range(n - mid) if mask & (1 << i))
        # Find best complement in left_sums
        complement = target - s
        # Binary search for closest to complement
        import bisect
        idx = bisect.bisect_left(left_sums, complement)
        if idx < len(left_sums):
            best = min(best, abs(target - s - left_sums[idx]))
        if idx > 0:
            best = min(best, abs(target - s - left_sums[idx - 1]))
    
    return best
```

---

## Python Templates

### Template 1: Basic Subset DP Framework

```python
def subset_dp(n, transition_fn):
    """
    General subset DP framework.
    
    Args:
        n: Number of elements
        transition_fn: Function(mask, i) giving cost to add element i to mask
    
    Returns:
        dp array where dp[mask] is optimal value for subset mask
    """
    INF = float('inf')
    dp = [INF] * (1 << n)
    dp[0] = 0  # Base case: empty set
    
    for mask in range(1 << n):
        if dp[mask] == INF:
            continue
        
        # Try adding each element not in mask
        for i in range(n):
            if not (mask & (1 << i)):
                new_mask = mask | (1 << i)
                cost = transition_fn(mask, i)
                dp[new_mask] = min(dp[new_mask], dp[mask] + cost)
    
    return dp
```

### Template 2: Assignment Problem (Hungarian Alternative)

```python
def min_cost_assignment(cost):
    """
    Assignment problem: n workers, n jobs.
    cost[i][j] = cost of assigning worker i to job j.
    Each worker gets exactly one job.
    
    Time: O(n * 2^n)
    Space: O(2^n)
    """
    n = len(cost)
    INF = float('inf')
    dp = [INF] * (1 << n)
    dp[0] = 0
    
    for mask in range(1 << n):
        # Count assigned workers
        worker = bin(mask).count('1')
        if worker >= n:
            continue
        
        # Try assigning 'worker' to each unassigned job
        for job in range(n):
            if not (mask & (1 << job)):
                new_mask = mask | (1 << job)
                dp[new_mask] = min(dp[new_mask], dp[mask] + cost[worker][job])
    
    return dp[(1 << n) - 1]
```

### Template 3: Partition into K Subsets

```python
def can_partition_k_subsets(nums, k):
    """
    Check if nums can be partitioned into k subsets with equal sum.
    
    Time: O(3^n) with optimization, or O(n * 2^n)
    Space: O(2^n)
    """
    total = sum(nums)
    if total % k != 0:
        return False
    target = total // k
    n = len(nums)
    
    # Precompute sum for each subset
    subset_sum = [0] * (1 << n)
    for mask in range(1 << n):
        for i in range(n):
            if mask & (1 << i):
                subset_sum[mask] += nums[i]
    
    # dp[mask] = current sum of subset modulo target
    # -1 means invalid state
    dp = [-1] * (1 << n)
    dp[0] = 0
    
    for mask in range(1 << n):
        if dp[mask] == -1:
            continue
        for i in range(n):
            if not (mask & (1 << i)):
                new_mask = mask | (1 << i)
                new_sum = dp[mask] + nums[i]
                if new_sum <= target:
                    dp[new_mask] = new_sum % target
    
    return dp[(1 << n) - 1] == 0
```

### Template 4: Minimum Work Sessions to Finish Tasks

```python
def min_sessions(tasks, session_time):
    """
    Partition tasks into minimum sessions where sum in each session <= session_time.
    LeetCode 1986.
    
    Time: O(3^n) or O(n * 2^n)
    Space: O(2^n)
    """
    n = len(tasks)
    
    # Precompute which subsets fit in one session
    can_fit = [False] * (1 << n)
    for mask in range(1 << n):
        total = sum(tasks[i] for i in range(n) if mask & (1 << i))
        can_fit[mask] = (total <= session_time)
    
    INF = n + 1
    dp = [INF] * (1 << n)
    dp[0] = 0
    
    for mask in range(1 << n):
        if dp[mask] == INF:
            continue
        
        # Try all subsets of remaining tasks
        remaining = ((1 << n) - 1) ^ mask
        sub = remaining
        
        while sub:
            if can_fit[sub]:
                new_mask = mask | sub
                dp[new_mask] = min(dp[new_mask], dp[mask] + 1)
            sub = (sub - 1) & remaining
    
    return dp[(1 << n) - 1]
```

### Template 5: TSP (Traveling Salesman Problem)

```python
def traveling_salesman(dist):
    """
    TSP: Find shortest Hamiltonian cycle.
    
    Args:
        dist: n x n distance matrix
    
    Returns:
        Minimum tour length
    
    Time: O(n² * 2^n)
    Space: O(n * 2^n)
    """
    n = len(dist)
    INF = float('inf')
    
    # dp[mask][i] = min cost to visit cities in mask, ending at city i
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0  # Start at city 0
    
    for mask in range(1 << n):
        for last in range(n):
            if not (mask & (1 << last)):
                continue
            if dp[mask][last] == INF:
                continue
            
            for nxt in range(n):
                if mask & (1 << nxt):
                    continue
                new_mask = mask | (1 << nxt)
                new_cost = dp[mask][last] + dist[last][nxt]
                if new_cost < dp[new_mask][nxt]:
                    dp[new_mask][nxt] = new_cost
    
    # Return to start
    ans = INF
    full_mask = (1 << n) - 1
    for last in range(1, n):
        ans = min(ans, dp[full_mask][last] + dist[last][0])
    
    return ans if ans < INF else -1
```

### Template 6: Maximum Compatibility Score (Assignment)

```python
def max_compatibility_score(students, mentors):
    """
    Assign students to mentors to maximize total compatibility.
    LeetCode 1947.
    
    Time: O(n * 2^n)
    Space: O(2^n)
    """
    n = len(students)
    
    # Precompute compatibility scores
    score = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            score[i][j] = sum(a == b for a, b in zip(students[i], mentors[j]))
    
    dp = [-1] * (1 << n)
    dp[0] = 0
    
    for mask in range(1 << n):
        if dp[mask] == -1:
            continue
        student = bin(mask).count('1')
        if student >= n:
            continue
        
        for mentor in range(n):
            if not (mask & (1 << mentor)):
                new_mask = mask | (1 << mentor)
                dp[new_mask] = max(dp[new_mask], dp[mask] + score[student][mentor])
    
    return dp[(1 << n) - 1]
```

---

## When to Use

Use DP on Subsets when you need to solve problems involving:

- **Assignment Problems**: Matching n workers to n jobs
- **Partition Problems**: Divide set into k groups with constraints
- **TSP Variations**: Traveling salesman and Hamiltonian paths
- **Set Covering**: Minimum sets to cover all elements
- **Permutation Optimization**: Find optimal ordering/permutation
- **Small n (< 20)**: State space fits in memory

### Comparison with Alternatives

| Approach | Time Complexity | Best For | Limitations |
|----------|----------------|----------|-------------|
| **DP on Subsets** | O(n × 2ⁿ) | n ≤ 20, optimal solutions | Exponential space |
| **Brute Force** | O(n!) | n ≤ 10 | Too slow for n > 10 |
| **Meet-in-Middle** | O(2^(n/2)) | n ≤ 40 | More complex |
| **Greedy** | O(n log n) | Approximation, n large | Not always optimal |
| **Hungarian** | O(n³) | Assignment only | n ≤ 500 typically |

### When to Choose DP on Subsets vs Other Approaches

- **Choose DP on Subsets** when:
  - n ≤ 20 (or up to 22 with optimization)
  - Need exact optimal solution
  - Problem involves selection/permutation
  - State space is natural fit for subsets

- **Choose Meet-in-Middle** when:
  - n up to 40
  - Can split problem into two independent halves
  - Subset sum or similar problems

- **Choose Greedy/Heuristics** when:
  - n is large (> 30)
  - Approximation is acceptable
  - Real-time solution needed

---

## Algorithm Explanation

### Core Concept

DP on Subsets solves problems by considering all possible subsets of a base set, where each subset represents a partial solution. The key insight is that the optimal solution for a subset can be built from optimal solutions for smaller subsets.

**Key Terminology**:
- **Bitmask**: Integer representing a subset
- **State**: dp[mask] stores optimal value for subset
- **Transition**: Adding an element to extend a subset
- **Base Case**: dp[0] = value for empty set

### How It Works

#### Step 1: State Representation

```python
# n elements, each subset is a bitmask
dp = [infinity] * (1 << n)  # 2^n states
dp[0] = 0  # Empty set has cost 0
```

#### Step 2: State Transition

```python
# For each subset
for mask in range(1 << n):
    # For each element not in subset
    for i in range(n):
        if not (mask & (1 << i)):
            new_mask = mask | (1 << i)
            # Update new subset using current subset + element i
            dp[new_mask] = min(dp[new_mask], dp[mask] + cost(i))
```

#### Step 3: Answer Extraction

```python
# Answer is often the full set
answer = dp[(1 << n) - 1]
```

### Visual Walkthrough

**Example**: 3 workers, 3 jobs assignment problem

```
States: 2³ = 8 possible assignments

mask 000 (0): No jobs assigned, cost = 0
mask 001 (1): Job 0 assigned to worker 0
mask 010 (2): Job 1 assigned to worker 0
mask 011 (3): Jobs 0,1 assigned
...
mask 111 (7): All jobs assigned

Transition example (mask 001 → mask 011):
- Current: Job 0 assigned to worker 0
- Add: Assign job 1 to worker 1
- New state: mask 011
- Cost: cost[0][0] + cost[1][1]
```

### Why DP on Subsets Works

1. **Optimal Substructure**: Optimal solution contains optimal subsolutions
2. **Overlapping Subproblems**: Many paths lead to same subset
3. **Complete Search**: Considers all valid assignments/selections
4. **Efficient State**: Bitmask gives O(1) subset operations

### Limitations

- **Exponential Space**: O(2ⁿ) memory required
- **n ≤ 20 Constraint**: Larger n becomes infeasible
- **State Design**: Requires careful thought to represent problem as subsets
- **Transition Complexity**: O(n) per state can make O(n × 2ⁿ) slow for n=20

---

## Practice Problems

### Problem 1: Minimum Number of Work Sessions to Finish the Tasks

**Problem:** [LeetCode 1986 - Minimum Number of Work Sessions to Finish the Tasks](https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/)

**Description:** Given tasks with durations and sessionTime, partition tasks into minimum sessions where sum in each session ≤ sessionTime.

**How to Apply DP on Subsets:**
- Precompute which subsets fit in one session
- dp[mask] = min sessions to complete tasks in mask
- Try all submasks as next session

---

### Problem 2: Partition to K Equal Sum Subsets

**Problem:** [LeetCode 698 - Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/)

**Description:** Given array, determine if it can be partitioned into k subsets with equal sum.

**How to Apply DP on Subsets:**
- dp[mask] = current sum modulo target for subset mask
- Try adding each element to extend valid subsets
- Check if full set can be evenly divided

---

### Problem 3: Matchsticks to Square

**Problem:** [LeetCode 473 - Matchsticks to Square](https://leetcode.com/problems/matchsticks-to-square/)

**Description:** Given matchstick lengths, determine if they can form a square.

**How to Apply DP on Subsets:**
- Target: 4 sides with equal sum
- dp[mask] = number of complete sides formed by matchsticks in mask
- Or use partition approach similar to k-subsets

---

### Problem 4: Maximum Compatibility Score Sum

**Problem:** [LeetCode 1947 - Maximum Compatibility Score Sum](https://leetcode.com/problems/maximum-compatibility-score-sum/)

**Description:** Assign students to mentors to maximize total compatibility score.

**How to Apply DP on Subsets:**
- Classic assignment problem
- dp[mask] = max score with mentors in mask assigned
- student = number of bits set in mask
- Try assigning 'student' to each available mentor

---

### Problem 5: Minimum Cost to Connect Two Groups of Points

**Problem:** [LeetCode 1595 - Minimum Cost to Connect Two Groups of Points](https://leetcode.com/problems/minimum-cost-to-connect-two-groups-of-points/)

**Description:** Connect n points in group 1 to m points in group 2 with minimum cost, where each point must have at least one connection.

**How to Apply DP on Subsets:**
- dp[i][mask] = min cost to connect first i points in group 1
- mask represents which points in group 2 are already connected
- Transition: connect point i to one or more points in group 2

---

### Problem 6: Shortest Path Visiting All Nodes

**Problem:** [LeetCode 847 - Shortest Path Visiting All Nodes](https://leetcode.com/problems/shortest-path-visiting-all-nodes/)

**Description:** Find shortest path in graph that visits all nodes.

**How to Apply DP on Subsets:**
- dp[mask][i] = shortest path visiting nodes in mask, ending at i
- BFS-like transitions to neighbors
- Similar to TSP but on arbitrary graph

---

## Video Tutorial Links

### Fundamentals

- [Bitmask DP Introduction - Algorithms Live](https://www.youtube.com/watch?v=U4h8wJNY-rQ) - Comprehensive overview
- [Subset DP - Tushar Roy](https://www.youtube.com/watch?v=ZqAb62lZMPc) - Visual explanations
- [Bit Manipulation for DP - William Lin](https://www.youtube.com/watch?v=U4h8wJNY-rQ) - CP perspective

### Problem Solving

- [TSP DP Solution](https://www.youtube.com/watch?v=ZqAb62lZMPc) - Traveling salesman explained
- [Assignment Problem - DP Approach](https://www.youtube.com/watch?v=ZqAb62lZMPc) - Bitmask method
- [LeetCode 1986 Solution](https://www.youtube.com/watch?v=ZqAb62lZMPc) - Work sessions problem

### Advanced Topics

- [Meet-in-the-Middle](https://www.youtube.com/watch?v=ZqAb62lZMPc) - For larger n
- [SOS DP - Sum Over Subsets](https://www.youtube.com/watch?v=ZqAb62lZMPc) - Advanced bitmask technique
- [Inclusion-Exclusion Principle](https://www.youtube.com/watch?v=ZqAb62lZMPc) - With bitmasks

---

## Follow-up Questions

### Q1: What is the maximum n for which DP on subsets is feasible?

**Answer:**
- **n ≤ 20**: Standard O(n × 2ⁿ) approaches work well
- **n ≤ 22-24**: With optimizations (space efficient, bit operations)
- **n ≤ 40**: Use meet-in-the-middle technique
- **n > 40**: Consider approximation algorithms or problem-specific optimizations
- **Memory**: 2²⁰ ≈ 1M states, 2²⁵ ≈ 33M states (memory intensive)

---

### Q2: How does DP on subsets compare to the Hungarian algorithm for assignment problems?

**Answer:**
- **DP on Subsets**: O(n × 2ⁿ), works for n ≤ 20, easier to implement
- **Hungarian**: O(n³), works for n ≤ 500, more complex implementation
- **Choice**: Use DP on subsets for small n where code simplicity matters; use Hungarian for larger n
- **Generalization**: DP on subsets can handle more complex constraints (e.g., multiple assignments)

---

### Q3: What are some space optimization techniques for subset DP?

**Answer:**
- **Rolling array**: If transition only depends on previous state, use two rows
- **Bitset**: Pack multiple boolean states into integers
- **Sparse representation**: Only store reachable states (using dictionary)
- **In-place**: Update mask in increasing order when adding elements
- **Meet-in-middle**: Reduces both time and space for some problems

---

### Q4: How do you handle DP on subsets when there are additional constraints?

**Answer:**
- **Extra dimension**: dp[mask][k] where k represents constraint value
- **Multiple masks**: dp[mask1][mask2] for partitioning problems
- **State pruning**: Skip invalid states early in transition
- **Precomputation**: Check constraint validity before DP loop
- **Constraint encoding**: Include constraint in mask if bounded

---

### Q5: When should you use meet-in-the-middle instead of standard subset DP?

**Answer:**
- **n between 20-40**: Standard O(2ⁿ) too slow, meet-in-middle O(2^(n/2)) feasible
- **Problem structure**: Can split problem into two independent subproblems
- **Sum/subset problems**: Classic application (subset sum, knapsack)
- **Memory trade-off**: Often needs more memory but much faster
- **Implementation**: More complex but necessary for medium-sized n

---

## Summary

DP on Subsets (Bitmask DP) is a powerful technique for solving combinatorial optimization problems with small n (n ≤ 20). Key takeaways:

1. **State Representation**: Bitmask efficiently represents subsets
2. **Transitions**: Add one element at a time, O(n) per state
3. **Complexity**: O(n × 2ⁿ) time, O(2ⁿ) space
4. **Applications**: Assignment, TSP, partition, set cover
5. **Limitations**: Exponential - only for small n

**When to Use**:
- Problem involves selecting/assigning from small set
- Need exact optimal solution
- n ≤ 20 (or up to 40 with meet-in-middle)
- State naturally fits subset representation

**Implementation Tips**:
- Precompute subset sums/properties when possible
- Use bit operations for efficiency
- Consider SOS DP for sum-over-subset queries
- For n > 20, explore meet-in-the-middle

This technique is essential for competitive programming and appears frequently in hard problems involving permutations and selections.
