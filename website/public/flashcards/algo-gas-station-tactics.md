## Gas Station: Tactics & Applications

What tactical patterns help solve Gas Station variants?

<!-- front -->

---

### Tactic 1: Proving Greedy Correctness

```python
def explain_greedy_correctness(gas, cost):
    """
    Why the greedy O(n) solution works:
    
    Key Lemma: If we can't reach station j from i,
    then no station in [i, j-1] can reach j.
    
    Proof: Let tank_k = cumulative gas from i to k.
    If tank_j < 0, then for any start s in [i, j-1]:
    tank'_j = tank'_s + (tank_j - tank_s)
    Since tank_s >= 0 (we reached s from i) and tank_j < 0,
    tank'_j < tank'_s, making it harder to reach.
    
    Therefore, we can safely skip all stations [i, j-1]
    and start fresh from j.
    """
    pass
```

---

### Tactic 2: Prefix Sum with Segment Tree

```python
def find_valid_starts_range_query(gas, cost):
    """
    Use segment tree for range minimum queries
    """
    from segment_tree import SegmentTree
    
    n = len(gas)
    net = [g - c for g, c in zip(gas, cost)]
    
    # Build prefix sums on doubled array
    prefix = [0]
    for x in net * 2:
        prefix.append(prefix[-1] + x)
    
    # Segment tree for range minimum
    st = SegmentTree(prefix)
    
    valid = []
    for start in range(n):
        min_in_range = st.query(start, start + n)
        if min_in_range >= prefix[start]:
            valid.append(start)
    
    return valid
```

---

### Tactic 3: Sliding Window Minimum

```python
def find_valid_starts_sliding_window(gas, cost):
    """
    O(n) sliding window to find all valid starts
    """
    from collections import deque
    
    n = len(gas)
    net = [g - c for g, c in zip(gas, cost)]
    
    # Prefix sums on doubled array
    prefix = [0]
    for x in net * 2:
        prefix.append(prefix[-1] + x)
    
    # Monotonic deque for window minimums
    dq = deque()
    valid = []
    
    for i in range(2 * n + 1):
        # Add new element
        while dq and prefix[dq[-1]] >= prefix[i]:
            dq.pop()
        dq.append(i)
        
        # Remove out of window
        if dq[0] <= i - n:
            dq.popleft()
        
        # Check valid starts
        if i >= n:
            start = i - n
            min_in_window = prefix[dq[0]]
            if min_in_window >= prefix[start]:
                valid.append(start)
    
    return valid
```

---

### Tactic 4: Two-Pointer for Minimum Window

```python
def smallest_subarray_with_enough_gas(gas, cost, min_total):
    """
    Find smallest window [l, r] where sum(gas) - sum(cost) >= min_total
    """
    n = len(gas)
    net = [g - c for g, c in zip(gas, cost)]
    
    # Double for circular handling
    doubled = net * 2
    
    left = 0
    current_sum = 0
    min_length = float('inf')
    best_window = None
    
    for right in range(2 * n):
        current_sum += doubled[right]
        
        while current_sum >= min_total and left <= right:
            if right - left + 1 < min_length:
                min_length = right - left + 1
                best_window = (left % n, right % n)
            
            current_sum -= doubled[left]
            left += 1
    
    return best_window, min_length
```

---

### Tactic 5: Monotonic Queue for Online Queries

```python
class GasStationSolver:
    """
    Online queries: given new gas/cost arrays, answer quickly
    """
    def __init__(self):
        self.cache = {}
    
    def preprocess(self, gas, cost):
        """Preprocess for fast queries"""
        n = len(gas)
        net = tuple(g - c for g, c in zip(gas, cost))
        
        key = (tuple(gas), tuple(cost))
        
        # Find all valid starts
        valid = []
        start = 0
        tank = 0
        for i in range(n):
            tank += net[i]
            if tank < 0:
                start = i + 1
                tank = 0
        
        # Verify
        if sum(net) >= 0:
            self.cache[key] = start if start < n else -1
        else:
            self.cache[key] = -1
    
    def query(self, gas, cost):
        key = (tuple(gas), tuple(cost))
        if key not in self.cache:
            self.preprocess(gas, cost)
        return self.cache[key]
```

<!-- back -->
