## Greedy - Sorting Based: Tactics

What are specific techniques for sorting-based greedy problems?

<!-- front -->

---

### Tactic 1: Two Arrays - Sequential Matching

For problems with two separate arrays (greed factors and resources):

```python
def match_sequential(arr1, arr2, condition):
    """
    Generic template for matching elements from two sorted arrays.
    """
    arr1.sort()
    arr2.sort()
    
    i = j = matches = 0
    
    while i < len(arr1) and j < len(arr2):
        if condition(arr2[j], arr1[i]):  # Can arr2[j] satisfy arr1[i]?
            matches += 1
            i += 1  # Move both - match found
        j += 1      # Always advance resource pointer
    
    return matches

# Example: Assign Cookies
# condition = lambda cookie, greed: cookie >= greed
```

---

### Tactic 2: Pairing Extremes (Two Pointers from Ends)

For pairing heaviest with lightest to optimize some constraint:

```python
def pair_extremes(arr, limit_constraint):
    """
    Pair elements from opposite ends when sum/constraint allows.
    """
    arr.sort()
    left, right = 0, len(arr) - 1
    groups = 0
    
    while left <= right:
        if limit_constraint(arr[left], arr[right]):
            left += 1  # Can pair them
        right -= 1     # Right always included
        groups += 1
    
    return groups

# Example: Boats to Save People
# limit_constraint = lambda light, heavy: light + heavy <= limit
```

---

### Tactic 3: Sort by Custom Key

When natural ordering isn't optimal, define custom sort key:

```python
def two_city_scheduling(costs):
    """
    LeetCode 1029: Two City Scheduling
    Sort by the "advantage" of sending to city A vs city B.
    """
    # Sort by difference (costA - costB)
    # Most negative = much cheaper to send to A
    costs.sort(key=lambda x: x[0] - x[1])
    
    n = len(costs) // 2
    total = 0
    
    # First n go to city A (cheapest for A)
    for i in range(n):
        total += costs[i][0]
    
    # Last n go to city B (cheapest for B)
    for i in range(n, 2 * n):
        total += costs[i][1]
    
    return total
```

---

### Tactic 4: Counting Sort Optimization

When value range is small, avoid O(n log n) sort:

```python
def assign_cookies_counting_sort(greed, cookies):
    """
    O(n + max_val) when max value is small.
    """
    max_val = max(max(greed, default=0), max(cookies, default=0))
    
    # Count frequencies
    greed_count = [0] * (max_val + 1)
    cookie_count = [0] * (max_val + 1)
    
    for g in greed:
        greed_count[g] += 1
    for c in cookies:
        cookie_count[c] += 1
    
    # Greedy assignment using frequency arrays
    children = 0
    cookie_idx = 0
    
    for g in range(max_val + 1):
        while greed_count[g] > 0:
            # Find smallest cookie >= g
            while cookie_idx <= max_val and cookie_count[cookie_idx] == 0:
                cookie_idx += 1
            
            if cookie_idx > max_val:  # No cookie large enough
                return children
            
            if cookie_idx >= g:
                greed_count[g] -= 1
                cookie_count[cookie_idx] -= 1
                children += 1
            else:
                cookie_idx += 1
    
    return children
```

---

### Tactic 5: Handling Edge Cases

| Edge Case | Solution |
|-----------|----------|
| Empty input | Return 0 before sorting |
| Single element | Handle separately (trivial solution) |
| Cannot modify input | Create sorted copy: `sorted(arr)` |
| Duplicate values | Sorting handles naturally; use stable sort if order matters |
| Large values | Consider counting sort if range limited |

```python
def safe_sorting_greedy(arr):
    """Template with edge case handling."""
    if not arr:
        return 0
    
    if len(arr) == 1:
        return handle_single(arr[0])
    
    # Don't modify original if required
    sorted_arr = sorted(arr)
    
    # Proceed with greedy logic
    return greedy_algorithm(sorted_arr)
```

---

### Tactic 6: Common Pitfalls to Avoid

| Pitfall | Wrong | Correct |
|---------|-------|---------|
| Wrong sort order | Descending when ascending needed | Check problem requirements |
| Pointer condition | `while left < right` vs `left <= right` | Boats needs `<=` (single person boat) |
| Off-by-one | `range(n)` includes n, `range(n-1)` doesn't | Check last element handling |
| Forgetting to sort both | Only sort one array when two needed | Sort all relevant arrays |
| Comparison operator | `<` vs `<=` | Verify boundary conditions |

<!-- back -->
