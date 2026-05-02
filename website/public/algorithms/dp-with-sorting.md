# DP with Sorting

## Category
Dynamic Programming & Greedy Hybrid

## Description

DP with Sorting is a powerful technique that combines the benefits of sorting with dynamic programming to solve optimization problems more efficiently. By first establishing a meaningful order among elements, we can simplify the state transitions and reduce the problem complexity. This approach is particularly effective for interval scheduling, chain problems, and scenarios where the relative order of elements significantly impacts the optimal solution.

The key insight is that sorting eliminates certain possibilities from consideration, allowing us to make greedy choices about which elements to include while using dynamic programming to handle the remaining combinatorial complexity. This hybrid approach often transforms O(n²) or O(2ⁿ) problems into O(n log n) or O(n²) tractable solutions.

---

## Concepts

DP with Sorting relies on several fundamental concepts that enable its efficiency.

### 1. Ordering Principle

Sorting establishes a processing order that simplifies decisions:

| Sort Key | Effect | Common Use |
|----------|--------|------------|
| **End time** | Earlier ending intervals leave more room | Interval scheduling |
| **Start time** | Later starting intervals have fewer predecessors | Chain problems |
| **Length** | Shorter intervals fit more easily | Packing problems |
| **One dimension** | Establish partial order | 2D problems (Russian Doll) |

### 2. Greedy + DP Hybrid

Combining greedy choice with DP for remaining decisions:

```
1. Sort by some criteria (greedy choice)
2. Apply DP on the sorted sequence
3. State transition only considers relevant previous elements
```

### 3. Binary Search for Compatibility

After sorting, use binary search to find valid predecessors:

| Operation | Before Sorting | After Sorting |
|-----------|---------------|---------------|
| Find compatible | O(n) scan | O(log n) binary search |
| Transition | O(n) candidates | O(log n) or O(1) candidates |

### 4. Longest Increasing Subsequence (LIS) Pattern

Many problems reduce to LIS after sorting:

| Problem | Sort By | Then Find |
|---------|---------|-----------|
| Russian Doll | Width asc, Height desc | LIS on height |
| Longest Chain | End time | LIS on start time |
| Maximum Length of Pair Chain | End time | Greedy / DP |

---

## Frameworks

Structured approaches for implementing DP with Sorting.

### Framework 1: Sort by One Dimension, DP on Another

```
┌─────────────────────────────────────────────────────────────┐
│  SORT + DP FRAMEWORK                                         │
├─────────────────────────────────────────────────────────────┤
│  For 2D objects like envelopes (width, height):             │
│                                                             │
│  1. Sort by first dimension ascending:                       │
│     - If equal first dimension, sort second descending     │
│     - This prevents selecting same-width envelopes         │
│                                                             │
│  2. Apply DP/LIS on second dimension:                       │
│     - dp[i] = longest chain ending at element i             │
│     - Binary search for predecessor: O(log n)               │
│                                                             │
│  3. Answer is max(dp) or length of LIS                      │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Russian Doll Envelopes, 2D chain problems.

### Framework 2: Weighted Interval Scheduling

```
┌─────────────────────────────────────────────────────────────┐
│  WEIGHTED INTERVAL SCHEDULING FRAMEWORK                      │
├─────────────────────────────────────────────────────────────┤
│  Maximize profit from non-overlapping intervals:           │
│                                                             │
│  1. Sort intervals by end time                               │
│                                                             │
│  2. For each interval i, find p[i]:                         │
│     - Rightmost interval that ends before i starts         │
│     - Use binary search: O(log n)                          │
│                                                             │
│  3. DP:                                                      │
│     dp[i] = max profit using first i intervals              │
│     dp[i] = max(dp[i-1], profit[i] + dp[p[i]])             │
│                                                             │
│  4. Answer: dp[n]                                           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Job scheduling with profits, weighted interval selection.

### Framework 3: Sort + Predecessor Chain

```
┌─────────────────────────────────────────────────────────────┐
│  SORT + PREDECESSOR DP FRAMEWORK                            │
├─────────────────────────────────────────────────────────────┤
│  For problems with predecessor relationships:               │
│                                                             │
│  1. Sort elements by relevant criteria (length, time, etc.) │
│                                                             │
│  2. dp[i] = longest chain ending at element i               │
│                                                             │
│  3. Transition:                                             │
│     dp[i] = 1 + max(dp[j]) for all j < i where            │
│              element[j] can precede element[i]             │
│                                                             │
│  4. Optimize with:                                          │
│     - Binary search if property is monotonic               │
│     - Segment tree / Fenwick for range max queries         │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: String chains, scheduling with precedence.

---

## Forms

Different manifestations of the DP with Sorting pattern.

### Form 1: Sort by One, LIS on Another

Classic Russian Doll pattern.

| Step | Action | Complexity |
|------|--------|------------|
| **Sort** | By width asc, height desc | O(n log n) |
| **LIS** | On height dimension | O(n log n) |
| **Total** | | O(n log n) |

### Form 2: Weighted Interval Scheduling

Maximum profit non-overlapping intervals.

| Variant | Approach | Complexity |
|---------|----------|------------|
| **Unweighted** | Greedy (earliest finish) | O(n log n) |
| **Weighted** | DP + binary search | O(n log n) |
| **With deadlines** | DP with priority queue | O(n log n) |

### Form 3: Chain Building with Constraints

Build longest chain with predecessor relationships.

```python
# Example: Longest String Chain
# A word is predecessor of another if adding one char

words.sort(key=len)  # Sort by length
dp = {}  # word -> longest chain ending at word

for word in words:
    dp[word] = 1
    for i in range(len(word)):
        pred = word[:i] + word[i+1:]
        if pred in dp:
            dp[word] = max(dp[word], dp[pred] + 1)
```

### Form 4: Multi-Dimensional Sorting

Sort by multiple criteria:

```python
# Sort by age asc, then score desc
people.sort(key=lambda x: (x.age, -x.score))

# Then apply DP on score dimension
```

### Form 5: Sort + Segment Tree DP

When transitions need range queries:

```python
# Sort by x coordinate
points.sort(key=lambda p: p.x)

# DP with segment tree for range max query
# dp[i] = max value chain ending at point i
# Query: max dp[j] where j.x < i.x and j.y in valid range
```

---

## Tactics

Specific techniques and optimizations for DP with Sorting.

### Tactic 1: Binary Search LIS (Patience Sorting)

O(n log n) LIS algorithm:

```python
def length_of_lis(nums):
    """O(n log n) LIS using binary search."""
    tails = []  # tails[i] = smallest tail of LIS with length i+1
    
    for num in nums:
        # Find first tail >= num
        left, right = 0, len(tails)
        while left < right:
            mid = (left + right) // 2
            if tails[mid] < num:
                left = mid + 1
            else:
                right = mid
        
        if left == len(tails):
            tails.append(num)
        else:
            tails[left] = num
    
    return len(tails)
```

### Tactic 2: Russian Doll Envelopes Strategy

Sort and find LIS:

```python
def max_envelopes(envelopes):
    """
    Russian Doll Envelopes.
    Sort by width asc, height desc, then LIS on height.
    """
    if not envelopes:
        return 0
    
    # Sort: width ascending, height descending
    envelopes.sort(key=lambda x: (x[0], -x[1]))
    
    # LIS on heights
    heights = [e[1] for e in envelopes]
    return length_of_lis(heights)
```

**Why height descending?** Prevents selecting multiple envelopes with same width.

### Tactic 3: Weighted Job Scheduling

DP with binary search for p[i]:

```python
def job_scheduling(start, end, profit):
    """Maximum profit from non-overlapping jobs."""
    n = len(start)
    jobs = sorted(zip(start, end, profit), key=lambda x: x[1])
    
    # dp[i] = max profit using first i jobs
    dp = [0] * (n + 1)
    
    for i in range(1, n + 1):
        s, e, p = jobs[i-1]
        
        # Find rightmost job with end <= s
        lo, hi = 0, i - 1
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if jobs[mid][1] <= s:
                lo = mid
            else:
                hi = mid - 1
        
        last_compatible = lo if jobs[lo][1] <= s else 0
        
        # Take or skip
        dp[i] = max(dp[i-1], p + dp[last_compatible])
    
    return dp[n]
```

### Tactic 4: Longest Chain of Pairs

Greedy works for unweighted:

```python
def find_longest_chain(pairs):
    """
    Longest chain where pairs[i][0] > pairs[j][1].
    Greedy: sort by end, always pick earliest ending.
    """
    pairs.sort(key=lambda x: x[1])
    
    count = 1
    last_end = pairs[0][1]
    
    for i in range(1, len(pairs)):
        if pairs[i][0] > last_end:  # Strictly greater
            count += 1
            last_end = pairs[i][1]
    
    return count
```

### Tactic 5: Best Team With No Conflicts

Sort and LIS with age constraint:

```python
def best_team_score(scores, ages):
    """
    Select team with maximum score where if age[i] <= age[j],
    then score[i] <= score[j] (no conflicts).
    """
    n = len(scores)
    players = sorted(zip(ages, scores))  # Sort by age
    
    # DP: dp[i] = max score of valid team ending with player i
    dp = [0] * n
    
    for i in range(n):
        dp[i] = players[i][1]  # At least the player themselves
        for j in range(i):
            if players[j][1] <= players[i][1]:  # No conflict
                dp[i] = max(dp[i], dp[j] + players[i][1])
    
    return max(dp)
```

---

## Python Templates

### Template 1: Sort + LIS Pattern

```python
def sort_plus_lis(items, primary_key, secondary_key=None, descending=False):
    """
    General template for sort by one dimension, LIS on another.
    
    Args:
        items: List of objects with multiple dimensions
        primary_key: Function to extract primary sort dimension
        secondary_key: Function to extract LIS dimension
        descending: If True, secondary sort is descending
    
    Returns:
        Length of longest valid chain
    """
    if not items:
        return 0
    
    # Sort by primary, then secondary (descending if specified)
    if secondary_key and descending:
        items.sort(key=lambda x: (primary_key(x), -secondary_key(x)))
    else:
        items.sort(key=primary_key)
    
    # Extract dimension for LIS
    if secondary_key:
        seq = [secondary_key(x) for x in items]
    else:
        seq = [primary_key(x) for x in items]
    
    return length_of_lis(seq)

def length_of_lis(nums):
    """O(n log n) LIS."""
    tails = []
    for num in nums:
        left, right = 0, len(tails)
        while left < right:
            mid = (left + right) // 2
            if tails[mid] < num:
                left = mid + 1
            else:
                right = mid
        if left == len(tails):
            tails.append(num)
        else:
            tails[left] = num
    return len(tails)
```

### Template 2: Weighted Interval Scheduling

```python
def weighted_interval_scheduling(intervals):
    """
    Maximum weight subset of non-overlapping intervals.
    
    Args:
        intervals: List of (start, end, weight) tuples
    
    Returns:
        Maximum total weight
    
    Time: O(n log n)
    """
    if not intervals:
        return 0
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    n = len(intervals)
    
    # dp[i] = max weight using first i intervals
    dp = [0] * (n + 1)
    
    for i in range(1, n + 1):
        start, end, weight = intervals[i-1]
        
        # Find last compatible interval using binary search
        lo, hi = 0, i - 1
        last = 0
        while lo <= hi:
            mid = (lo + hi + 1) // 2
            if intervals[mid][1] <= start:
                last = mid + 1
                lo = mid + 1
            else:
                hi = mid - 1
        
        # Choose max of: skip current, or take current + best up to last
        dp[i] = max(dp[i-1], weight + dp[last])
    
    return dp[n]
```

### Template 3: Russian Doll Envelopes

```python
def max_envelopes(envelopes):
    """
    Maximum number of envelopes that can be Russian-dolled.
    LeetCode 354.
    
    Time: O(n log n), Space: O(n)
    """
    if not envelopes:
        return 0
    
    # Sort by width ascending, height descending
    # Descending height prevents taking multiple with same width
    envelopes.sort(key=lambda x: (x[0], -x[1]))
    
    # Find LIS on heights
    heights = [e[1] for e in envelopes]
    
    # O(n log n) LIS
    tails = []
    for h in heights:
        left, right = 0, len(tails)
        while left < right:
            mid = (left + right) // 2
            if tails[mid] < h:
                left = mid + 1
            else:
                right = mid
        if left == len(tails):
            tails.append(h)
        else:
            tails[left] = h
    
    return len(tails)
```

### Template 4: Longest String Chain

```python
def longest_str_chain(words):
    """
    Longest chain where each word is predecessor of next.
    LeetCode 1048.
    
    Time: O(n * L²) where L = max word length
    Space: O(n)
    """
    # Sort by length
    words.sort(key=len)
    
    dp = {}  # word -> longest chain ending at word
    max_chain = 1
    
    for word in words:
        dp[word] = 1
        
        # Try removing each character to find predecessor
        for i in range(len(word)):
            pred = word[:i] + word[i+1:]
            if pred in dp:
                dp[word] = max(dp[word], dp[pred] + 1)
        
        max_chain = max(max_chain, dp[word])
    
    return max_chain
```

### Template 5: Best Team With No Conflicts

```python
def best_team_score(scores, ages):
    """
    Maximum score team with no conflicts.
    LeetCode 1626.
    
    Time: O(n²), Space: O(n)
    Can be optimized to O(n log n) with coordinate compression + segment tree.
    """
    n = len(scores)
    players = sorted(zip(ages, scores))  # Sort by age
    
    # dp[i] = max score of valid team ending with player i
    dp = [0] * n
    
    for i in range(n):
        age_i, score_i = players[i]
        dp[i] = score_i
        
        for j in range(i):
            age_j, score_j = players[j]
            # No conflict if younger player has lower or equal score
            if score_j <= score_i:
                dp[i] = max(dp[i], dp[j] + score_i)
    
    return max(dp)
```

### Template 6: Maximum Length of Pair Chain

```python
def find_longest_chain(pairs):
    """
    Longest chain where pairs[i][0] > pairs[j][1].
    LeetCode 646.
    
    Time: O(n log n), Space: O(1)
    """
    # Sort by end time (greedy works for unweighted)
    pairs.sort(key=lambda x: x[1])
    
    count = 0
    last_end = float('-inf')
    
    for start, end in pairs:
        if start > last_end:  # Strictly greater
            count += 1
            last_end = end
    
    return count
```

---

## When to Use

Use DP with Sorting when you need to solve problems involving:

- **Interval Scheduling**: Selecting non-overlapping intervals
- **Chain Building**: Finding longest chains with predecessor constraints
- **2D Optimization**: Problems with two dimensions (one sorted, one DP)
- **Enveloping/Nesting**: Russian doll type problems
- **Weighted Selection**: Maximum profit/value with ordering constraints

### Comparison with Alternatives

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **DP + Sorting** | O(n log n) to O(n²) | O(n) | Interval, chain problems |
| **Pure Greedy** | O(n log n) | O(1) | Unweighted intervals |
| **Pure DP** | O(n²) to O(2ⁿ) | O(n) to O(2ⁿ) | No natural ordering |
| **Segment Tree** | O(n log n) | O(n) | Range query optimization |

### When to Choose DP with Sorting vs Other Approaches

- **Choose DP + Sorting** when:
  - Problem has natural ordering that simplifies the solution
  - Greedy alone doesn't work (weighted/profit involved)
  - 2D objects need to be nested/chained
  - Need O(n log n) or O(n²) instead of exponential

- **Choose Pure Greedy** when:
  - Problem is unweighted interval scheduling
  - Earliest finish time gives optimal solution

- **Choose Pure DP** when:
  - No natural ordering exists
  - Need to consider all subsets/permutations

---

## Algorithm Explanation

### Core Concept

DP with Sorting combines the greedy principle of making locally optimal ordering choices with the power of dynamic programming to handle remaining complexity. By sorting first, we reduce the problem space and simplify state transitions.

**Key Terminology**:
- **Sorting dimension**: Primary criteria for ordering
- **DP dimension**: Secondary criteria for optimization
- **LIS**: Longest Increasing Subsequence pattern
- **Compatibility**: Whether two elements can be in same solution

### How It Works

#### Step 1: Sort

```python
# Establish ordering that simplifies the problem
items.sort(key=sort_criteria)
```

#### Step 2: Define DP State

```python
# dp[i] = optimal value for subproblem considering first i items
dp = [0] * (n + 1)
```

#### Step 3: Transition with Binary Search

```python
for i in range(1, n + 1):
    # Find last compatible item using binary search
    j = binary_search_for_last_compatible(i)
    
    # Transition: skip or take item i
    dp[i] = max(dp[i-1], value[i] + dp[j])
```

### Visual Walkthrough

**Russian Doll Envelopes Example**:
```
Envelopes: [(5,4), (6,4), (6,7), (2,3)]

Step 1: Sort by width asc, height desc
  [(2,3), (5,4), (6,7), (6,4)]
  Note: (6,7) comes before (6,4) because height desc

Step 2: Extract heights
  heights = [3, 4, 7, 4]

Step 3: Find LIS on heights
  i=0: tails = [3]
  i=1: tails = [3, 4]  (4 > 3)
  i=2: tails = [3, 4, 7]  (7 > 4)
  i=3: tails = [3, 4, 4]  (4 replaces 7? No, 4 < 7, so replace 7)
  
  Wait, let me recheck:
  i=3, h=4: find first tail >= 4 → index 1 (value 4)
  tails = [3, 4, 7] → replace tails[1] with 4? No, tails[1] is already 4
  
  Actually: tails = [3, 4, 7], h=4
  binary search: tails[0]=3 < 4, tails[1]=4 >= 4
  left = 1, so replace tails[1] = 4 (no change)
  tails = [3, 4, 7]

Answer: len(tails) = 3
Valid chain: (2,3) → (5,4) → (6,7)
```

### Why DP with Sorting Works

1. **Ordering Reduces Choices**: After sorting, only previous elements are candidates
2. **Binary Search Optimization**: Finding compatible elements in O(log n)
3. **Greedy + DP Best of Both**: Greedy gives structure, DP gives optimality
4. **Pattern Recognition**: Many problems reduce to LIS after sorting

### Limitations

- **Sorting Overhead**: O(n log n) may be significant for small n
- **Dimension Limit**: Works best with 2-3 dimensions
- **No Cycles**: Requires acyclic dependency structure
- **Not Always Applicable**: Some problems have no natural ordering

---

## Practice Problems

### Problem 1: Russian Doll Envelopes

**Problem:** [LeetCode 354 - Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/)

**Description:** Given envelopes with (width, height), find maximum number that can be Russian-dolled (one fits in another).

**How to Apply DP with Sorting:**
- Sort by width asc, height desc
- Find LIS on height dimension
- O(n log n) solution

---

### Problem 2: Maximum Profit in Job Scheduling

**Problem:** [LeetCode 1235 - Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling/)

**Description:** Given jobs with start, end, profit, find maximum profit from non-overlapping jobs.

**How to Apply DP with Sorting:**
- Sort by end time
- Binary search to find last compatible job
- dp[i] = max(dp[i-1], profit[i] + dp[last_compatible])

---

### Problem 3: Longest String Chain

**Problem:** [LeetCode 1048 - Longest String Chain](https://leetcode.com/problems/longest-string-chain/)

**Description:** Given words, find longest chain where each word is predecessor of next (predecessor = word with one char removed).

**How to Apply DP with Sorting:**
- Sort by length
- For each word, try removing each char to find predecessor
- dp[word] = max chain ending at word

---

### Problem 4: Best Team With No Conflicts

**Problem:** [LeetCode 1626 - Best Team With No Conflicts](https://leetcode.com/problems/best-team-with-no-conflicts/)

**Description:** Select players with no conflicts (younger player can't have strictly more score).

**How to Apply DP with Sorting:**
- Sort by age
- LIS-style DP on scores
- O(n²) or O(n log n) with optimization

---

### Problem 5: Maximum Length of Pair Chain

**Problem:** [LeetCode 646 - Maximum Length of Pair Chain](https://leetcode.com/problems/maximum-length-of-pair-chain/)

**Description:** Find longest chain of pairs where second < first of next.

**How to Apply DP with Sorting:**
- Sort by end time
- Greedy works: always pick earliest ending
- O(n log n)

---

### Problem 6: Non-overlapping Intervals

**Problem:** [LeetCode 435 - Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)

**Description**: Find minimum intervals to remove so rest are non-overlapping.

**How to Apply DP with Sorting:**
- Equivalent to finding maximum non-overlapping set
- Sort by end time
- Greedy or DP solution

---

## Video Tutorial Links

### Fundamentals

- [DP with Sorting - NeetCode](https://www.youtube.com/watch?v=3f4MNeoV1E8) - Pattern explanation
- [Russian Doll Envelopes Solution](https://www.youtube.com/watch?v=q6zi8Ms1C3s) - Classic problem
- [LIS and Variations - Tushar Roy](https://www.youtube.com/watch?v=CE2b_-XfVDM) - Core concept

### Problem Solving

- [Weighted Interval Scheduling](https://www.youtube.com/watch?v=3f4MNeoV1E8) - DP approach
- [Longest Chain Problems](https://www.youtube.com/watch?v=3f4MNeoV1E8) - Greedy vs DP
- [Job Scheduling Problems](https://www.youtube.com/watch?v=3f4MNeoV1E8) - Comprehensive coverage

### Advanced Techniques

- [Coordinate Compression + DP](https://www.youtube.com/watch?v=3f4MNeoV1E8) - For large ranges
- [Segment Tree Optimization](https://www.youtube.com/watch?v=3f4MNeoV1E8) - Faster transitions
- [2D DP with Sorting](https://www.youtube.com/watch?v=3f4MNeoV1E8) - Multi-dimensional

---

## Follow-up Questions

### Q1: Why do we sort height in descending order for Russian Doll Envelopes?

**Answer:**
- Same width envelopes cannot be nested
- Sorting height descending ensures we don't pick multiple same-width envelopes
- With width ascending and height descending, LIS on height naturally respects width constraint
- If sorted ascending on both, we might incorrectly include same-width envelopes

---

### Q2: When does greedy work vs needing DP for interval scheduling?

**Answer:**
- **Greedy works**: Unweighted problems (earliest finish time is optimal)
- **DP needed**: Weighted problems (profit maximization)
- **Key difference**: Greedy makes local optimal choice, DP considers all possibilities
- **Test**: If different intervals have different values, likely need DP

---

### Q3: Can all DP with sorting problems be solved with segment trees?

**Answer:**
- **Often yes**: When transition is max over range, segment tree can optimize
- **Russian Doll**: LIS can use segment tree on compressed coordinates
- **Trade-off**: Segment tree adds O(log n) but allows more complex queries
- **When to use**: When simple binary search isn't enough

---

### Q4: What's the time complexity difference between O(n²) and O(n log n) DP with sorting?

**Answer:**
- **O(n²)**: Check all previous elements for transition
- **O(n log n)**: Use binary search or segment tree for transition
- **Practical difference**: n=10⁵ → O(n²) too slow, O(n log n) acceptable
- **When O(n²) is OK**: n ≤ 10⁴ or when simpler code preferred

---

### Q5: How do you handle DP with sorting when there are multiple constraints?

**Answer:**
- **Primary sort**: Establish main ordering
- **Secondary dimension**: Use for DP state
- **Additional constraints**: May need multi-dimensional DP or segment tree
- **Example**: (age, score) → sort by age, DP on score with segment tree for efficiency

---

## Summary

DP with Sorting is a powerful hybrid technique that combines greedy ordering with dynamic programming. Key takeaways:

1. **Sort First**: Establish ordering to simplify transitions
2. **LIS Pattern**: Many problems reduce to LIS after sorting
3. **Binary Search**: O(log n) for finding compatible elements
4. **Two Dimensions**: Sort by one, DP on another
5. **Complexity**: Often O(n log n) vs O(n²) naive

**When to Use**:
- Interval scheduling with weights
- Chain/nesting problems
- 2D optimization (Russian Doll pattern)
- Problems with natural ordering that simplifies DP

**Common Patterns**:
- Sort by end time + DP for weighted intervals
- Sort by width + LIS on height for nesting
- Sort by length + predecessor DP for chains

This technique frequently appears in competitive programming and technical interviews at major tech companies.
