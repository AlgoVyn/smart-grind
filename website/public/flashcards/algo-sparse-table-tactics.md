## Title: Sparse Table - Tactics

What are specific techniques and optimizations for Sparse Tables?

<!-- front -->

---

### Tactic 1: Precomputed Logarithms

Precompute `log2[i]` for all i from 1 to n for O(1) query time.

```python
# Precompute logarithms
self.log = [0] * (n + 1)
for i in range(2, n + 1):
    self.log[i] = self.log[i // 2] + 1

# Usage in query
k = self.log[length]  # floor(log2(length))
```

---

### Tactic 2: Finding Second Minimum

```python
def query_second_min(self, arr, left, right):
    """Find second minimum in range [left, right]."""
    min_val = self.query(left, right)
    
    # Scan range for second minimum
    # (excluding the minimum value)
    second_min = float('inf')
    for i in range(left, right + 1):
        if arr[i] != min_val and arr[i] < second_min:
            second_min = arr[i]
    
    return second_min if second_min != float('inf') else -1
```

**Alternative:** Use two sparse tables tracking top 2 values.

---

### Tactic 3: Range GCD for Coprimality Check

```python
def range_is_coprime(self, left, right):
    """Check if all numbers in range are pairwise coprime."""
    range_gcd = self.query(left, right)
    return range_gcd == 1
```

---

### Tactic 4: Query Implementation

```python
def query(self, left: int, right: int):
    """Query func(arr[left..right])."""
    if left > right:
        raise ValueError(f"Invalid range [{left}, {right}]")
    
    length = right - left + 1
    k = self.log[length]
    
    return self.func(
        self.table[k][left],
        self.table[k][right - (1 << k) + 1]
    )
```

---

### Tactic 5: Comparison with Segment Tree

| Aspect | Sparse Table | Segment Tree |
|--------|--------------|--------------|
| **Query time** | O(1) | O(log n) |
| **Update time** | Requires rebuild | O(log n) |
| **Space** | O(n log n) | O(n) |
| **Build time** | O(n log n) | O(n) |
| **Use case** | Static data, many queries | Dynamic data |

**Key Insight:** Use Sparse Table for static arrays with many queries; Segment Tree for dynamic data.

<!-- back -->
