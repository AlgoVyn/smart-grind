## Two Pointers - Converging: Comparison

When should you use Converging Two Pointers versus other approaches?

<!-- front -->

---

### Converging vs Hash Map for Two Sum

| Aspect | Converging Pointers | Hash Map |
|--------|---------------------|----------|
| **Time** | O(n log n) with sort | O(n) |
| **Space** | O(1) | O(n) |
| **Input requirement** | Sorted | Any order |
| **Returns indices** | Need tracking | Natural |
| **Multiple pairs** | Natural | Requires modification |

**Winner depends on**:
- Space constraints → Converging
- Need original indices → Hash Map
- Already sorted → Converging

```python
# Hash Map approach
def two_sum_hash(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target - num], i]
        seen[num] = i
```

---

### Converging vs Binary Search

| Aspect | Converging | Binary Search |
|--------|-----------|---------------|
| **Use case** | Find pairs | Find single element |
| **Time** | O(n) | O(log n) |
| **For pairs** | Natural | Needs nested loop |
| **Space** | O(1) | O(1) |

**For Two Sum**: Converging is O(n) vs Binary Search's O(n log n)

---

### When to Use Converging Two Pointers

**Use when:**
- Array is sorted
- Finding pairs/triplets with sum conditions
- Container/water trapping problems
- Palindrome validation
- Pair with difference constraints

**Don't use when:**
- Array is unsorted and you need original indices
- Single element search (use binary search)
- Subarray problems (use sliding window)
- Need all combinations (use backtracking)

---

### Comparison with Other Two Pointer Patterns

| Pattern | Input | Movement | Best For |
|---------|-------|----------|----------|
| **Converging** | Sorted array | Ends toward center | Pair sum, container |
| **Fast & Slow** | Linked list | Same direction, diff speed | Cycles, middle |
| **Fixed Gap** | Any | Same direction, fixed dist | Nth from end |
| **Expanding** | String | Center outward | Palindromes |
| **In-place** | Array | Various | Partition, modify |

---

### Decision Tree

```
Problem involves finding pairs?
├── Yes → Is the array sorted?
│   ├── Yes → CONVERGING POINTERS
│   └── No → Is space limited?
│       ├── Yes → Sort then CONVERGING
│       └── No → HASH MAP
└── No → Single element search?
    ├── Yes → BINARY SEARCH
    └── No → Other pattern needed
```

---

### Key Trade-offs

| Scenario | Converging Advantage | Alternative Advantage |
|----------|---------------------|----------------------|
| Sorted + O(1) space | Perfect fit | - |
| Unsorted + need indices | Requires sort | Hash map natural |
| Very large array | Memory efficient | Hash may exceed memory |
| Multiple solutions | Easy to find all | Hash needs special handling |

<!-- back -->
