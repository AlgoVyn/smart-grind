## Greedy - Sorting Based: Forms

What are the different forms and variations of sorting-based greedy problems?

<!-- front -->

---

### Problem Classification

| Form | Key Pattern | Example Problems | Complexity |
|------|-------------|------------------|------------|
| **Form 1: Sequential Matching** | Two sorted arrays, sequential pointers | Assign Cookies | O(n log n) |
| **Form 2: Extreme Pairing** | Pair lightest with heaviest | Boats to Save People | O(n log n) |
| **Form 3: Custom Sort Key** | Sort by computed difference/ratio | Two City Scheduling | O(n log n) |
| **Form 4: Optimal Grouping** | Group elements optimally | Array Partition, Min Cost Connect Sticks | O(n log n) |
| **Form 5: Triangle/Geometric** | Sort for geometric constraints | Largest Perimeter Triangle | O(n log n) |

---

### Form 1: Sequential Matching (Assign Cookies)

Match elements from two sorted arrays sequentially:

```python
def sequential_matching(greed, cookies):
    """
    LeetCode 455: Assign Cookies
    Match smallest sufficient cookie to each child.
    """
    greed.sort()
    cookies.sort()
    
    child = cookie = 0
    
    while child < len(greed) and cookie < len(cookies):
        if cookies[cookie] >= greed[child]:
            child += 1  # Satisfied
        cookie += 1
    
    return child

# Variations:
# - Workers and jobs (ability >= difficulty)
# - Hand of straights (consecutive sequences)
```

---

### Form 2: Extreme Pairing (Boats to Save People)

Pair lightest with heaviest when constraint allows:

```python
def extreme_pairing(people, limit):
    """
    LeetCode 881: Boats to Save People
    Pair heaviest with lightest if sum <= limit.
    """
    people.sort()
    left, right = 0, len(people) - 1
    boats = 0
    
    while left <= right:
        if people[left] + people[right] <= limit:
            left += 1
        right -= 1
        boats += 1
    
    return boats

# Variations:
# - Two Sum (sorted)
# - Container With Most Water (maximize area)
# - 3Sum Closest
```

---

### Form 3: Custom Sort Key (Two City Scheduling)

Sort by computed advantage/difference:

```python
def custom_sort_scheduling(costs):
    """
    LeetCode 1029: Two City Scheduling
    Sort by (costA - costB), send first half to A.
    """
    # Key insight: difference reveals which city is better
    costs.sort(key=lambda x: x[0] - x[1])
    
    n = len(costs) // 2
    return sum(costs[i][0] for i in range(n)) + \
           sum(costs[i][1] for i in range(n, 2*n))

# Variations:
# - Meeting rooms (sort by end time)
# - Erase overlapping intervals (sort by end)
# - Reconstruct queue by height
```

---

### Form 4: Optimal Grouping (Array Partition, Connect Sticks)

Group elements to minimize/maximize some cost:

```python
def array_partition(nums):
    """
    LeetCode 561: Array Partition I
    Pair to minimize sum of mins.
    """
    nums.sort()
    return sum(nums[i] for i in range(0, len(nums), 2))
    # Pairs: (0,1), (2,3), (4,5)...
    # Sum of first element in each pair

def min_cost_connect_sticks(sticks):
    """
    LeetCode 1167: Minimum Cost to Connect Sticks
    Always combine two smallest (Huffman-like).
    Note: Uses heap, not pure sorting.
    """
    import heapq
    heapq.heapify(sticks)
    cost = 0
    
    while len(sticks) > 1:
        a, b = heapq.heappop(sticks), heapq.heappop(sticks)
        combined = a + b
        cost += combined
        heapq.heappush(sticks, combined)
    
    return cost
```

---

### Form 5: Triangle/Geometric Constraints

Sort for geometric validity:

```python
def largest_perimeter_triangle(nums):
    """
    LeetCode 976: Largest Perimeter Triangle
    Triangle inequality: a + b > c (where c is largest)
    """
    nums.sort(reverse=True)  # Descending
    
    for i in range(len(nums) - 2):
        if nums[i] < nums[i+1] + nums[i+2]:
            return nums[i] + nums[i+1] + nums[i+2]
    
    return 0

# Key insight: After sorting descending, only need to check
# if largest side < sum of other two for consecutive triplets
```

---

### Decision Flowchart

```
Read problem statement
│
├─ Two separate arrays/resources to match?
│   ├─ Sequential matching possible?
│   │   └─→ Use: Sort both, two pointers sequential (Form 1)
│   └─ Need custom pairing strategy?
│       └─→ Use: Sort by custom key (Form 3)
│
├─ Single array, need to pair elements?
│   ├─ Constraint on sum of pair?
│   │   └─→ Use: Sort, pair extremes (Form 2)
│   ├─ Grouping by fixed size?
│   │   └─→ Use: Sort, group consecutive (Form 4)
│   └─ Geometric constraint?
│       └─→ Use: Sort descending, check consecutive (Form 5)
│
└─ Optimization with computed value/ratio?
    └─→ Use: Custom sort key (Form 3)
```

---

### Quick Reference: Related LeetCode Problems

| Problem | Form | Key Insight |
|---------|------|-------------|
| 455 - Assign Cookies | Form 1 | Sequential matching |
| 881 - Boats to Save People | Form 2 | Pair extremes |
| 1029 - Two City Scheduling | Form 3 | Sort by advantage |
| 561 - Array Partition I | Form 4 | Group consecutive |
| 976 - Largest Perimeter Triangle | Form 5 | Triangle inequality |
| 1167 - Connect Sticks | Form 4 | Huffman coding pattern |
| 452 - Min Arrows to Burst Balloons | Form 3 | Sort by end point |
| 435 - Non-overlapping Intervals | Form 3 | Sort by end, greedy remove |

<!-- back -->
