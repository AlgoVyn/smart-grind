## Binary Search - Two Sorted Arrays: Tactics

What are the advanced techniques for k-th element search?

<!-- front -->

---

### Tactic 1: Handling Edge Cases

| Case | Handling |
|------|----------|
| One array empty | Return k-th from other array |
| k = 1 | Return min of first elements |
| k = total | Return max of last elements |
| All elements in A < B | Return B[k - len(A) - 1] |
| i = 0 | All k elements from B |
| i = len(A) | All elements from A used |

```python
# Check in code
if not A:
    return B[k - 1]
if not B:
    return A[k - 1]
```

---

### Tactic 2: Alternative: Merge Until K

**For small k, linear might be better**:

```python
def find_kth_merge(A, B, k):
    """O(k) approach, good when k is small."""
    i = j = 0
    
    while k > 1:
        if i < len(A) and (j >= len(B) or A[i] <= B[j]):
            i += 1
        else:
            j += 1
        k -= 1
    
    if i < len(A) and (j >= len(B) or A[i] <= B[j]):
        return A[i]
    return B[j]
```

**Trade-off**: O(k) vs O(log(min(m,n))) - use when k is very small

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Wrong partition indices** | Off-by-one in k | k-th means k elements before |
| **Not swapping arrays** | Binary search on larger | Always search on smaller |
| **Inf/-inf handling** | Edge case errors | Use float('inf')/-inf |
| **Integer overflow** | Large indices | Python handles, but be careful |
| **Even median calculation** | Integer division | Use proper formula |

---

### Tactic 4: Extension: Three or More Arrays

```python
def find_kth_multiple(arrays, k):
    """Find k-th from multiple sorted arrays using heap."""
    import heapq
    
    # Min heap: (value, array_index, element_index)
    heap = []
    for i, arr in enumerate(arrays):
        if arr:
            heapq.heappush(heap, (arr[0], i, 0))
    
    count = 0
    while heap:
        val, arr_idx, elem_idx = heapq.heappop(heap)
        count += 1
        
        if count == k:
            return val
        
        # Add next element from same array
        if elem_idx + 1 < len(arrays[arr_idx]):
            next_val = arrays[arr_idx][elem_idx + 1]
            heapq.heappush(heap, (next_val, arr_idx, elem_idx + 1))
    
    return -1
```

**Complexity**: O(k log m) where m is number of arrays

---

### Tactic 5: Lower Bound in Two Arrays

```python
def count_less_equal(A, B, x):
    """Count elements <= x in both arrays."""
    # Binary search in each array
    import bisect
    return bisect.bisect_right(A, x) + bisect.bisect_right(B, x)
```

**Use for**: Finding how many elements are less than or equal to a given value

<!-- back -->
