## Title: Segment Tree - Frameworks

What are the structured approaches for implementing and using segment trees?

<!-- front -->

---

### Framework 1: Build Template

```
┌─────────────────────────────────────────────────────┐
│  SEGMENT TREE BUILD FRAMEWORK                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  function build(node, start, end, arr):             │
│      If start == end:                                │
│          tree[node] = arr[start]  # Leaf            │
│          return                                      │
│                                                      │
│      mid = (start + end) // 2                        │
│      left = 2*node + 1                               │
│      right = 2*node + 2                              │
│                                                      │
│      build(left, start, mid, arr)                   │
│      build(right, mid+1, end, arr)                   │
│                                                      │
│      tree[node] = combine(tree[left], tree[right])   │
│                                                      │
│  Complexity: O(n) time, O(n) space                   │
└─────────────────────────────────────────────────────┘
```

---

### Framework 2: Query Template

```
┌─────────────────────────────────────────────────────┐
│  SEGMENT TREE QUERY FRAMEWORK                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  function query(node, start, end, left, right):      │
│      # Case 1: No overlap                          │
│      If right < start OR left > end:               │
│          return identity_value                       │
│                                                      │
│      # Case 2: Complete overlap                      │
│      If left <= start AND end <= right:            │
│          return tree[node]                           │
│                                                      │
│      # Case 3: Partial overlap                     │
│      mid = (start + end) // 2                        │
│      left_val = query(2*node+1, start, mid,          │
│                       left, right)                   │
│      right_val = query(2*node+2, mid+1, end,         │
│                        left, right)                  │
│                                                      │
│      return combine(left_val, right_val)             │
│                                                      │
│  Complexity: O(log n) time                         │
└─────────────────────────────────────────────────────┘
```

---

### Framework 3: Update Template

```
┌─────────────────────────────────────────────────────┐
│  SEGMENT TREE UPDATE FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  function update(node, start, end, idx, value):     │
│      If start == end:                                │
│          tree[node] = value  # Leaf update          │
│          return                                      │
│                                                      │
│      mid = (start + end) // 2                        │
│                                                      │
│      If idx <= mid:                                  │
│          update(2*node+1, start, mid, idx, value)    │
│      Else:                                           │
│          update(2*node+2, mid+1, end, idx, value)    │
│                                                      │
│      # Recombine from children                       │
│      tree[node] = combine(tree[2*node+1],            │
│                          tree[2*node+2])             │
│                                                      │
│  Complexity: O(log n) time                          │
└─────────────────────────────────────────────────────┘
```

---

### Framework 4: Lazy Propagation Template

```
┌─────────────────────────────────────────────────────┐
│  LAZY PROPAGATION FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│                                                      │
│  function range_update(node, start, end, l, r, val):│
│      # Apply pending lazy value                      │
│      propagate(node, start, end)                     │
│                                                      │
│      # No overlap                                    │
│      If r < start OR l > end:                        │
│          return                                      │
│                                                      │
│      # Complete overlap                              │
│      If l <= start AND end <= r:                     │
│          tree[node] += (end-start+1) * val          │
│          If start != end:                            │
│              lazy[2*node+1] += val                   │
│              lazy[2*node+2] += val                   │
│          return                                      │
│                                                      │
│      # Partial overlap - recurse                     │
│      mid = (start + end) // 2                        │
│      range_update(2*node+1, start, mid, l, r, val)   │
│      range_update(2*node+2, mid+1, end, l, r, val)   │
│                                                      │
│      tree[node] = combine(tree[2*node+1],            │
│                          tree[2*node+2])             │
└─────────────────────────────────────────────────────┘
```

<!-- back -->
