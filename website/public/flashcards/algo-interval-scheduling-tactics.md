## Interval Scheduling: Tactics & Applications

What tactical patterns help solve interval scheduling variants?

<!-- front -->

---

### Tactic 1: Sweep Line/Event-Based Processing

```python
def sweep_line_interval_problems(intervals):
    """
    Sweep line technique for various interval problems
    """
    # Create events
    events = []
    for i, (start, end) in enumerate(intervals):
        events.append((start, 'start', i))
        events.append((end, 'end', i))
    
    # Sort: process starts before ends at same point
    events.sort(key=lambda x: (x[0], 0 if x[1] == 'start' else 1))
    
    active = set()
    max_concurrent = 0
    
    for time, typ, idx in events:
        if typ == 'start':
            active.add(idx)
            max_concurrent = max(max_concurrent, len(active))
        else:
            active.remove(idx)
    
    return max_concurrent

# Applications:
# - Maximum overlap at any point
# - Union length of intervals
# - Detect gaps between intervals
```

---

### Tactic 2: Discretization for Integer Intervals

```python
def discretized_interval_dp(intervals, max_coord):
    """
    When coordinates are bounded integers, use array DP
    """
    # coordinate compression or direct array
    dp = [0] * (max_coord + 2)
    
    # Sort intervals by end
    intervals_by_end = [[] for _ in range(max_coord + 1)]
    for start, end, weight in intervals:
        intervals_by_end[end].append((start, weight))
    
    for end in range(1, max_coord + 1):
        dp[end] = dp[end - 1]  # Don't take any interval ending here
        
        for start, weight in intervals_by_end[end]:
            dp[end] = max(dp[end], dp[start] + weight)
    
    return dp[max_coord]
```

---

### Tactic 3: Binary Search for Previous Interval

```python
def weighted_interval_fast(intervals):
    """
    O(n log n) weighted interval using binary search
    """
    n = len(intervals)
    
    # Sort by end time
    intervals.sort(key=lambda x: x[2])
    ends = [x[2] for x in intervals]
    
    # Precompute p[i]: rightmost interval ending before intervals[i] starts
    p = [0] * n
    for i in range(n):
        start = intervals[i][0]
        # Binary search for largest j with ends[j] <= start
        lo, hi = 0, i
        while lo < hi:
            mid = (lo + hi) // 2
            if ends[mid] <= start:
                lo = mid + 1
            else:
                hi = mid
        p[i] = lo - 1
    
    # DP with binary search lookup
    dp = [0] * n
    for i in range(n):
        weight = intervals[i][3] if len(intervals[i]) > 3 else 1
        take = weight + (dp[p[i]] if p[i] >= 0 else 0)
        skip = dp[i-1] if i > 0 else 0
        dp[i] = max(take, skip)
    
    return dp[-1]
```

---

### Tactic 4: Segment Tree Optimization

```python
class SegmentTree:
    def __init__(self, size):
        self.n = size
        self.tree = [0] * (4 * size)
    
    def update(self, idx, val, node=1, l=0, r=None):
        if r is None:
            r = self.n
        
        if l == r:
            self.tree[node] = max(self.tree[node], val)
            return
        
        mid = (l + r) // 2
        if idx <= mid:
            self.update(idx, val, 2*node, l, mid)
        else:
            self.update(idx, val, 2*node+1, mid+1, r)
        
        self.tree[node] = max(self.tree[2*node], self.tree[2*node+1])
    
    def query(self, ql, qr, node=1, l=0, r=None):
        if r is None:
            r = self.n
        
        if ql > r or qr < l:
            return 0
        if ql <= l and r <= qr:
            return self.tree[node]
        
        mid = (l + r) // 2
        return max(self.query(ql, qr, 2*node, l, mid),
                   self.query(ql, qr, 2*node+1, mid+1, r))

def weighted_interval_segtree(intervals):
    """
    For problems with query: max dp[j] where intervals[j].end <= current.start
    """
    # Coordinate compression
    all_coords = sorted(set([x[0] for x in intervals] + [x[1] for x in intervals]))
    compress = {v: i for i, v in enumerate(all_coords)}
    
    st = SegmentTree(len(all_coords))
    
    intervals.sort(key=lambda x: x[1])  # By end
    
    for start, end, weight in intervals:
        # Query max dp for intervals ending before start
        comp_start = compress[start]
        best_prev = st.query(0, comp_start - 1)
        
        dp = best_prev + weight
        
        # Update at end position
        comp_end = compress[end]
        st.update(comp_end, dp)
    
    return st.query(0, len(all_coords) - 1)
```

---

### Tactic 5: Longest Chain of Intervals

```python
def longest_interval_chain(intervals):
    """
    Longest chain where each interval starts after previous ends
    Equivalent to maximum intervals (same problem)
    """
    return len(max_intervals_greedy(intervals))

def longest_chain_with_extension(intervals):
    """
    Can extend intervals: (s,e) can connect to any (s',e') where s' >= s
    """
    # Sort by start time
    intervals.sort()
    
    # DP: dp[i] = longest chain ending at interval i
    n = len(intervals)
    dp = [1] * n
    
    for i in range(1, n):
        for j in range(i):
            if intervals[j][1] <= intervals[i][0]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)
```

<!-- back -->
