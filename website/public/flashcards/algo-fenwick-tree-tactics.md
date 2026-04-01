## Fenwick Tree: Tactics & Applications

What tactical patterns leverage Fenwick Tree for problem solving?

<!-- front -->

---

### Tactic 1: Coordinate Compression

**Pattern:** Values are large/sparse, but relative ordering matters.

```python
def coordinate_compression(arr):
    """
    Map values to [1..n] while preserving order
    """
    sorted_unique = sorted(set(arr))
    return {v: i + 1 for i, v in enumerate(sorted_unique)}

# Application: Count smaller elements to the right
class Solution:
    def countSmaller(self, nums):
        if not nums:
            return []
        
        # Compress coordinates
        comp = coordinate_compression(nums)
        ft = FenwickTree(len(comp))
        result = []
        
        for num in reversed(nums):
            idx = comp[num]
            # Count elements already inserted that are smaller
            result.append(ft.query(idx - 1))
            ft.update(idx, 1)
        
        return list(reversed(result))
```

---

### Tactic 2: Inversion Count Variations

```python
def count_inversions_k(arr, k):
    """
    Count pairs (i,j) where i < j and |a[i] - a[j]| <= k
    """
    from sortedcontainers import SortedList
    
    sl = SortedList()
    count = 0
    
    for num in arr:
        # Count elements in range [num-k, num+k]
        left = sl.bisect_left(num - k)
        right = sl.bisect_right(num + k)
        count += right - left
        sl.add(num)
    
    return count

# Using Fenwick for range counting
def count_pairs_with_fenwick(arr, k):
    """Count pairs with value difference <= k using BIT"""
    # Compress: both values and value+k
    all_vals = []
    for x in arr:
        all_vals.extend([x, x + k])
    
    comp = coordinate_compression(all_vals)
    ft = FenwickTree(len(comp))
    count = 0
    
    for x in arr:
        # Count elements in [x-k, x+k] already seen
        left_idx = comp.get(x - k, 1)
        right_idx = comp[x + k]
        count += ft.range_query(left_idx, right_idx)
        ft.update(comp[x], 1)
    
    return count
```

---

### Tactic 3: Offline Query Processing

**Pattern:** Answer queries about array state at different times.

```python
def offline_range_queries(arr, queries):
    """
    Queries: [type, l, r, val]
    type 0: what is sum in [l,r]?
    type 1: add val to position l
    """
    # Sort queries by time, process updates first
    results = []
    ft = FenwickTree(len(arr))
    
    # Build initial
    for i, v in enumerate(arr, 1):
        ft.update(i, v)
    
    for q in queries:
        if q[0] == 0:  # Query
            _, l, r = q
            results.append(ft.range_query(l, r))
        else:  # Update
            _, pos, val = q
            ft.update(pos, val)
    
    return results
```

---

### Tactic 4: Frequency-Based Selection

```python
class OrderStatisticTree:
    """
    Find kth smallest/largest element dynamically
    """
    def __init__(self, max_val):
        self.ft = FenwickTree(max_val)
        self.max_val = max_val
    
    def insert(self, val):
        self.ft.update(val, 1)
    
    def delete(self, val):
        self.ft.update(val, -1)
    
    def find_kth(self, k):
        """Find kth smallest (1-indexed)"""
        idx = 0
        bitmask = 1 << (self.max_val.bit_length() - 1)
        
        while bitmask:
            t = idx + bitmask
            if t <= self.max_val and self.ft.tree[t] < k:
                k -= self.ft.tree[t]
                idx = t
            bitmask >>= 1
        
        return idx + 1
    
    def count_less(self, val):
        """Count elements < val"""
        return self.ft.query(val - 1)
    
    def count_greater(self, val):
        """Count elements > val"""
        total = self.ft.query(self.max_val)
        return total - self.ft.query(val)
```

---

### Tactic 5: Range Maximum/Minimum (Limited)

```python
class FenwickMax:
    """
    Fenwick for range maximum queries
    NOTE: Only works for point updates that increase values
    """
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)
    
    def update(self, idx, val):
        """Set position idx to max(current, val)"""
        while idx <= self.n:
            self.tree[idx] = max(self.tree[idx], val)
            idx += idx & -idx
    
    def query(self, idx):
        """Maximum in [1..idx]"""
        result = 0
        while idx > 0:
            result = max(result, self.tree[idx])
            idx -= idx & -idx
        return result
```

**Limitation:** Cannot handle arbitrary updates. Use segment tree for general case.

<!-- back -->
