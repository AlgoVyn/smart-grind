## Fenwick Tree: Comparison with Alternatives

How does Fenwick Tree compare to Segment Tree and other data structures?

<!-- front -->

---

### Fenwick vs Segment Tree: Sum Queries

| Feature | Fenwick Tree | Segment Tree |
|---------|--------------|--------------|
| **Code size** | ~20 lines | ~50-80 lines |
| **Point update** | O(log n) | O(log n) |
| **Range query** | O(log n) | O(log n) |
| **Range update** | Complex (2 trees) | Natural (lazy) |
| **Min/Max query** | Not suitable | ✓ Supported |
| **Space** | n | 4n |

```python
# Fenwick: concise
def query(i):
    s = 0
    while i > 0:
        s += tree[i]
        i -= i & -i
    return s

# Segment tree: more verbose
def query(node, l, r, ql, qr):
    if ql <= l and r <= qr:
        return tree[node]
    mid = (l + r) // 2
    if qr <= mid:
        return query(node*2, l, mid, ql, qr)
    elif ql > mid:
        return query(node*2+1, mid+1, r, ql, qr)
    return query(node*2, l, mid, ql, qr) + query(node*2+1, mid+1, r, ql, qr)
```

---

### When to Choose Each

| Problem Type | Best Choice | Why |
|--------------|-------------|-----|
| **Simple sum + point update** | Fenwick | Less code, faster |
| **Min/Max queries** | Segment Tree | Fenwick doesn't support well |
| **Range updates** | Segment Tree | Lazy propagation natural |
| **2D queries** | Either | Both work, Fenwick simpler |
| **Code golf/interviews** | Fenwick | Easier to remember |
| **Competition speed** | Fenwick | Less typing |

---

### Fenwick vs Prefix Array

| Scenario | Prefix Array | Fenwick |
|----------|--------------|---------|
| **Build** | O(n) | O(n) |
| **Static query** | O(1) ✓ | O(log n) |
| **Point update** | O(n) rebuild | O(log n) ✓ |
| **Space** | n | n |

```python
# Static array: prefix wins
prefix = [0] * (n + 1)
for i in range(n):
    prefix[i+1] = prefix[i] + arr[i]
# Query: O(1)
sum_l_r = prefix[r+1] - prefix[l]

# Dynamic: Fenwick wins
ft = FenwickTree(n)
# Query: O(log n), Update: O(log n)
```

**Rule:** Static → prefix array. Dynamic updates → Fenwick.

---

### Fenwick vs Binary Search Tree

| Feature | Fenwick | Balanced BST |
|---------|---------|--------------|
| **Order maintenance** | Fixed range | Dynamic |
| **K-th element** | O(log n) | O(log n) |
| **Range count** | O(log n) | O(log n) |
| **Arbitrary deletion** | Complex | Natural |
| **Arbitrary values** | Needs compression | Natural |

```python
# Fenwick for order stats (with compression)
class FenwickOrder:
    def find_median(self):
        total = self.ft.query(self.n)
        return self.find_kth((total + 1) // 2)

# BST alternative
from sortedcontainers import SortedList
sl = SortedList()
sl.add(x)
median = sl[len(sl) // 2]
```

**Trade-off:** Fenwick faster for known range, BST more flexible.

<!-- back -->
