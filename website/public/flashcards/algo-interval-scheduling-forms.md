## Interval Scheduling: Forms & Variations

What are the different forms and variations of interval scheduling?

<!-- front -->

---

### Maximum Cardinality Form

```python
def max_intervals_greedy(intervals):
    """
    Standard: maximum number of non-overlapping intervals
    Greedy by earliest finish time
    """
    intervals.sort(key=lambda x: x[1])
    
    selected = []
    last_end = float('-inf')
    
    for start, end in intervals:
        if start >= last_end:
            selected.append((start, end))
            last_end = end
    
    return selected

# Alternative greedy strategies (suboptimal)
def greedy_by_earliest_start(intervals):
    """Suboptimal - counterexample exists"""
    intervals.sort()
    # Fails on: [(1, 10), (2, 3), (4, 5)]
    pass

def greedy_by_shortest_duration(intervals):
    """Suboptimal - counterexample exists"""
    intervals.sort(key=lambda x: x[1] - x[0])
    # Fails on: [(1, 4), (3, 5), (4, 7)]
    pass
```

---

### Weighted Interval Form

```python
def weighted_interval_dp(intervals):
    """
    Weighted: maximize total weight of selected intervals
    """
    # Sort by finish time
    intervals.sort(key=lambda x: x[2])  # by end time
    n = len(intervals)
    
    # dp[i] = max weight using intervals[0..i]
    dp = [0] * n
    
    for i in range(n):
        start, end, weight = intervals[i]
        
        # Find last non-conflicting
        j = i - 1
        while j >= 0 and intervals[j][2] > start:
            j -= 1
        
        include = weight + (dp[j] if j >= 0 else 0)
        exclude = dp[i-1] if i > 0 else 0
        
        dp[i] = max(include, exclude)
    
    return dp[-1]

# Optimized with binary search
def weighted_interval_optimized(intervals):
    # Precompute prev[i] = index of last interval ending before intervals[i].start
    # O(n log n) instead of O(n^2)
    pass
```

---

### Minimum Interval Removal Form

```python
def min_removals_to_non_overlapping(intervals):
    """
    Minimum intervals to remove so remaining don't overlap
    = n - max_intervals
    """
    return len(intervals) - len(max_intervals_greedy(intervals))

def min_removals_overlap_constraint(intervals, k):
    """
    Remove minimum so each point covered by at most k intervals
    """
    # Event-based sweep line
    events = []
    for start, end in intervals:
        events.append((start, 1))
        events.append((end, -1))
    
    events.sort()
    
    current = 0
    removals = 0
    
    for time, delta in events:
        current += delta
        if current > k:
            removals += current - k
            current = k
    
    return removals
```

---

### Circular Interval Form

```python
def circular_interval_scheduling(intervals, circumference):
    """
    Intervals on a circle
    Cut at some point, solve linear, check wrap-around
    """
    # Convert to linear by doubling
    doubled = intervals + [(s + circumference, e + circumference) 
                            for s, e in intervals]
    
    # For each original interval as "first selected"
    max_count = 0
    
    for i, (first_start, first_end) in enumerate(intervals):
        # Solve for intervals in [first_end, first_start + circumference)
        linear_intervals = [(s, e) for s, e in doubled
                           if first_end <= s < first_start + circumference]
        
        count = 1 + len(max_intervals_greedy(linear_intervals))
        max_count = max(max_count, count)
    
    return max_count
```

---

### Interval Graph Coloring Form

```python
def interval_graph_coloring(intervals):
    """
    Interval partitioning = graph coloring of interval graph
    Chromatic number = max depth (maximum overlapping intervals)
    """
    # Equivalent to min_classrooms_needed
    return min_classrooms_needed(intervals)

def is_interval_graph(graph):
    """
    Check if graph is an interval graph
    (can be represented as intersection of intervals)
    """
    # Use characterization: chordal + AT-free
    # Or try to construct interval representation
    pass
```

<!-- back -->
