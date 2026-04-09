## Binary Search - On Answer: Tactics

What are the advanced techniques for binary search on answer?

<!-- front -->

---

### Tactic 1: Floating Point Binary Search

**Problem**: Answer requires precision (e.g., sqrt, distance)

```python
def sqrt_binary_search(x, precision=1e-6):
    """Find square root using binary search."""
    if x < 2:
        return x
    
    left, right = 1, x
    
    while right - left > precision:
        mid = left + (right - left) / 2
        
        if mid * mid < x:
            left = mid
        else:
            right = mid
    
    return left

def minimize_max_distance(stations, k):
    """Float binary search with iteration count."""
    left, right = 0, stations[-1] - stations[0]
    
    for _ in range(50):  # 50 iterations for double precision
        mid = (left + right) / 2
        
        needed = 0
        for i in range(1, len(stations)):
            needed += (stations[i] - stations[i - 1]) / mid
        
        if needed <= k:
            right = mid
        else:
            left = mid
    
    return left
```

---

### Tactic 2: Counting Patterns for Check Function

**Pattern 1**: Count needed resources

```python
def check_resources_needed(limit):
    """Generic pattern: count how many resources needed."""
    count = 0
    current = 0
    
    for item in items:
        if current + item <= limit:
            current += item
        else:
            count += 1
            current = item
    
    return count <= available_resources
```

**Pattern 2**: Count valid items

```python
def check_count_valid(limit):
    """Count items satisfying condition."""
    count = 0
    for item in items:
        if satisfies_condition(item, limit):
            count += 1
    return count >= required
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Wrong initial bounds** | Search space incorrect | Calculate min/max possible |
| **Infinite loop** | Not converging | Use `left < right` or iteration count |
| **Off-by-one in check** | Counting errors | Test check function independently |
| **Precision issues** | Float comparison | Use epsilon or iteration count |
| **Integer overflow** | Large sums | Use Python's arbitrary precision or long |

---

### Tactic 4: Lower Bound vs Upper Bound Check

**Minimize maximum** (upper bound check):
```python
if can_achieve(mid):
    right = mid  # Try to minimize
else:
    left = mid + 1  # Need more
```

**Maximize minimum**:
```python
if can_achieve(mid):
    left = mid + 1  # Try to maximize
else:
    right = mid - 1  # Need less
```

---

### Tactic 5: Time-Space Trade-offs in Check Function

**Faster check with preprocessing**:
```python
# Preprocess prefix sums for O(1) range sum
prefix = [0] * (n + 1)
for i in range(n):
    prefix[i + 1] = prefix[i] + arr[i]

def range_sum(i, j):
    return prefix[j + 1] - prefix[i]

def check(mid):
    # O(1) range checks instead of O(k) summing
    for i in range(n - k + 1):
        if range_sum(i, i + k - 1) <= mid:
            return True
    return False
```

<!-- back -->
