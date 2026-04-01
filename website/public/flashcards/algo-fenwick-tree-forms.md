## Fenwick Tree: Forms & Variations

What are the different forms and specialized Fenwick Tree implementations?

<!-- front -->

---

### Standard Form (Range Query, Point Update)

```python
# Most common: query prefix sums, update single element
ft = FenwickTree(n)

ft.update(i, delta)      # a[i] += delta
ft.query(i)              # sum(a[1..i])
ft.range_query(l, r)     # sum(a[l..r])
```

Use case: Dynamic frequency counting, running sums.

---

### Range Update, Point Query Form

```python
class FenwickRangeUpdate:
    """
    Support: add value to range [l..r]
    Query: value at point i
    """
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 2)
    
    def _add(self, idx, val):
        while idx <= self.n:
            self.tree[idx] += val
            idx += idx & -idx
    
    def range_add(self, l, r, val):
        """Add val to all elements in [l, r]"""
        self._add(l, val)
        self._add(r + 1, -val)
    
    def point_query(self, idx):
        """Get value at index idx"""
        result = 0
        while idx > 0:
            result += self.tree[idx]
            idx -= idx & -idx
        return result
```

**Idea:** Difference array - range add becomes two point updates.

---

### Range Update, Range Query Form

```python
class FenwickRangeBoth:
    """
    Support range add and range sum query
    Requires two Fenwick trees
    """
    def __init__(self, n):
        self.n = n
        self.B1 = [0] * (n + 2)  # For linear term
        self.B2 = [0] * (n + 2)  # For constant term
    
    def _add(self, tree, idx, val):
        while idx <= self.n:
            tree[idx] += val
            idx += idx & -idx
    
    def _query(self, tree, idx):
        result = 0
        while idx > 0:
            result += tree[idx]
            idx -= idx & -idx
        return result
    
    def range_add(self, l, r, val):
        """Add val to range [l, r]"""
        self._add(self.B1, l, val)
        self._add(self.B1, r + 1, -val)
        self._add(self.B2, l, val * (l - 1))
        self._add(self.B2, r + 1, -val * r)
    
    def prefix_sum(self, idx):
        """Sum of [1..idx]"""
        return (self._query(self.B1, idx) * idx 
                - self._query(self.B2, idx))
    
    def range_sum(self, l, r):
        return self.prefix_sum(r) - self.prefix_sum(l - 1)
```

---

### Inversion Counting Form

```python
def count_inversions(arr):
    """
    Count inversions using Fenwick tree
    Inversion: i < j but a[i] > a[j]
    """
    # Coordinate compression
    sorted_unique = sorted(set(arr))
    compress = {v: i + 1 for i, v in enumerate(sorted_unique)}
    
    n = len(sorted_unique)
    ft = FenwickTree(n)
    inversions = 0
    
    # Process from right to left
    for num in reversed(arr):
        idx = compress[num]
        # Count elements smaller than current (already seen)
        inversions += ft.query(idx - 1)
        ft.update(idx, 1)
    
    return inversions
```

---

### Multiplicative Fenwick Form

```python
class FenwickMultiplicative:
    """
    For products instead of sums
    Use logarithms or direct multiplication with modular inverse
    """
    def __init__(self, n, mod):
        self.n = n
        self.mod = mod
        self.tree = [1] * (n + 1)
    
    def update(self, idx, val):
        """Multiply position idx by val"""
        while idx <= self.n:
            self.tree[idx] = (self.tree[idx] * val) % self.mod
            idx += idx & -idx
    
    def query(self, idx):
        """Product of [1..idx]"""
        result = 1
        while idx > 0:
            result = (result * self.tree[idx]) % self.mod
            idx -= idx & -idx
        return result
    
    def range_product(self, l, r):
        """Product [l..r] = prefix[r] / prefix[l-1]"""
        numerator = self.query(r)
        denominator = self.query(l - 1)
        # Need modular inverse for division
        return (numerator * pow(denominator, -1, self.mod)) % self.mod
```

<!-- back -->
