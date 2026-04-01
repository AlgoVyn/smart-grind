## Fenwick Tree: Frameworks

What are the standard implementations for Fenwick Tree operations?

<!-- front -->

---

### Basic Framework

```python
class FenwickTree:
    def __init__(self, size):
        self.n = size
        self.tree = [0] * (size + 1)  # 1-indexed
    
    def _lowbit(self, x):
        """Extract lowest set bit"""
        return x & (-x)
    
    def update(self, index, delta):
        """
        Add delta to element at index (1-indexed)
        Time: O(log n)
        """
        while index <= self.n:
            self.tree[index] += delta
            index += self._lowbit(index)
    
    def query(self, index):
        """
        Get prefix sum [1..index]
        Time: O(log n)
        """
        result = 0
        while index > 0:
            result += self.tree[index]
            index -= self._lowbit(index)
        return result
    
    def range_query(self, left, right):
        """Sum from left to right (inclusive)"""
        return self.query(right) - self.query(left - 1)
```

---

### Build Framework

```python
class FenwickTree:
    def __init__(self, arr):
        """
        Build from array (0-indexed input)
        """
        self.n = len(arr)
        self.tree = [0] * (self.n + 1)
        
        # O(n) build using prefix sums
        for i in range(self.n):
            self.tree[i + 1] += arr[i]
            parent = i + 1 + self._lowbit(i + 1)
            if parent <= self.n:
                self.tree[parent] += self.tree[i + 1]
    
    # Alternative: O(n log n) build
    def build_simple(self, arr):
        self.n = len(arr)
        self.tree = [0] * (self.n + 1)
        for i, val in enumerate(arr, 1):
            self.update(i, val)  # O(n log n)
```

---

### Point Query Framework (Frequencies)

```python
class FenwickFreq:
    """
    Fenwick tree for frequency array
    Supports: add count, get prefix count, find kth element
    """
    def __init__(self, max_val):
        self.n = max_val
        self.tree = [0] * (max_val + 1)
    
    def add(self, index, count=1):
        """Add count occurrences of index"""
        self.update(index, count)
    
    def count_leq(self, index):
        """Count of elements <= index"""
        return self.query(index)
    
    def find_kth(self, k):
        """
        Find smallest index with prefix sum >= k
        Time: O(log n)
        """
        idx = 0
        bitmask = 1 << (self.n.bit_length() - 1)
        
        while bitmask:
            t = idx + bitmask
            if t <= self.n and self.tree[t] < k:
                k -= self.tree[t]
                idx = t
            bitmask >>= 1
        
        return idx + 1
```

---

### 2D Fenwick Tree Framework

```python
class FenwickTree2D:
    """
    2D Fenwick for matrix operations
    """
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.tree = [[0] * (cols + 1) for _ in range(rows + 1)]
    
    def update(self, r, c, delta):
        """Point update at (r, c)"""
        i = r
        while i <= self.rows:
            j = c
            while j <= self.cols:
                self.tree[i][j] += delta
                j += j & -j
            i += i & -i
    
    def query(self, r, c):
        """Prefix sum rectangle [1..r][1..c]"""
        result = 0
        i = r
        while i > 0:
            j = c
            while j > 0:
                result += self.tree[i][j]
                j -= j & -j
            i -= i & -i
        return result
    
    def range_query(self, r1, c1, r2, c2):
        """Sum of rectangle [r1..r2][c1..c2]"""
        return (self.query(r2, c2) - self.query(r1 - 1, c2) 
                - self.query(r2, c1 - 1) + self.query(r1 - 1, c1 - 1))
```

<!-- back -->
