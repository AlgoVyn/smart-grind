## Title: Segment Tree - Core Concepts

What is a Segment Tree and when should it be used?

<!-- front -->

---

### Definition
A binary tree data structure for efficient range queries and point updates on an array. Transforms O(n) range queries to O(log n) tree traversals.

| Operation | Without ST | With ST |
|-----------|------------|---------|
| **Range Query** | O(n) | O(log n) |
| **Point Update** | O(1) | O(log n) |
| **Range Update** | O(n) | O(log n) with lazy |

---

### Tree Structure

| Node Type | Represents | Children |
|-----------|------------|----------|
| **Root** | Entire array [0, n-1] | Left: [0, mid], Right: [mid+1, n-1] |
| **Internal** | Subarray [l, r] | Left: [l, mid], Right: [mid+1, r] |
| **Leaf** | Single element [i, i] | None |

### Array Representation
```
For node at index i:
    Left child: 2*i + 1
    Right child: 2*i + 2
    Parent: (i - 1) // 2

Tree size: 4*n (safe upper bound)
```

---

### Associative Operations

Segment trees work with any associative operation:

| Operation | Identity | Combine Function |
|-----------|----------|------------------|
| **Sum** | 0 | a + b |
| **Min** | ∞ | min(a, b) |
| **Max** | -∞ | max(a, b) |
| **GCD** | 0 | gcd(a, b) |
| **XOR** | 0 | a ^ b |

---

### Lazy Propagation

Optimization for range updates:

| Aspect | Without Lazy | With Lazy |
|--------|--------------|-----------|
| Point Update | O(log n) | O(log n) |
| Range Update | O(n) | O(log n) |
| Space | O(n) | O(2n) |

**Key Idea:** Postpone updates to children until necessary.

```python
# Store pending updates
lazy[node] += value  # Mark for children
# Apply to node immediately
tree[node] += (end - start + 1) * value
```

<!-- back -->
