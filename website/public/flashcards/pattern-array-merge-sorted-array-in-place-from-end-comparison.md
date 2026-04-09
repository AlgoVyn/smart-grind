## Array - Merge Sorted Array (In-place from End): Comparison

How do different approaches for merging sorted arrays compare?

<!-- front -->

---

### Approach Comparison: Time & Space

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| **Three Pointer (End)** | O(m+n) | O(1) | **Recommended** - in-place required |
| **Extra Array** | O(m+n) | O(m+n) | When space not constrained |
| **Built-in Sort** | O((m+n)log(m+n)) | O(1) or O(m+n) | Quick solution, interviews |
| **Merge from Start** | O((m+n)²) | O(1) | ❌ Never - shifts needed |

---

### In-Place (Three Pointer) vs Extra Array

**Three Pointer from End (O(1) space):**
```python
def merge_inplace(nums1, m, nums2, n):
    i, j, k = m - 1, n - 1, m + n - 1
    while i >= 0 and j >= 0:
        nums1[k] = nums1[i] if nums1[i] > nums2[j] else nums2[j]
        i, j = (i-1, j) if nums1[i] > nums2[j] else (i, j-1)
        k -= 1
    while j >= 0:
        nums1[k], j, k = nums2[j], j-1, k-1
```
- ✓ O(1) extra space
- ✓ No additional allocations
- ✗ Slightly more complex pointer management

**Extra Array (O(m+n) space):**
```python
def merge_extra_space(nums1, m, nums2, n):
    result = []
    i = j = 0
    while i < m and j < n:
        result.append(nums1[i] if nums1[i] <= nums2[j] else nums2[j])
        i, j = (i+1, j) if nums1[i] <= nums2[j] else (i, j+1)
    result.extend(nums1[i:m])
    result.extend(nums2[j:n])
    nums1[:m+n] = result
```
- ✓ Simpler logic, easier to understand
- ✓ Can preserve original arrays
- ✗ O(m+n) extra space
- ✗ Memory allocation overhead

---

### Comparison: Forward vs Backward Merge

| Aspect | Forward (Start) | Backward (End) |
|--------|-----------------|----------------|
| **Overwrites?** | ❌ Overwrites unmerged elements | ✓ Uses empty space |
| **Shifting needed?** | Yes - O(n) per insertion | No - direct placement |
| **Time complexity** | O((m+n)²) | O(m+n) |
| **Space complexity** | O(1) | O(1) |
| **Use case** | Never practical | Standard approach |

---

### Decision Matrix

| Situation | Approach | Space | Why |
|-----------|----------|-------|----- |
| Standard problem | Three pointer from end | O(1) | Optimal, clean |
| Can use extra space | Extra array | O(m+n) | Simpler code |
| Quick interview answer | Built-in sort | O(1)* | Fast to write |
| Must preserve inputs | Extra array | O(m+n) | Non-destructive |
| Very large arrays | Three pointer | O(1) | Memory efficient |
| Merge k sorted arrays | Heap or pairwise | O(k) or O(1) | Generalization |

---

### Related Algorithm Comparison

| Algorithm | Input | Time | Space | Use Case |
|-----------|-------|------|-------|----------|
| **This pattern** | 2 sorted arrays | O(m+n) | O(1) | In-place array merge |
| Merge two sorted lists | 2 sorted linked lists | O(m+n) | O(1) | Linked list merge |
| k-way merge (heap) | k sorted arrays | O(N log k) | O(k) | k > 2 arrays |
| k-way merge (pairwise) | k sorted arrays | O(N log k) | O(log k) | Recursive merge |
| Merge sort | Unsorted array | O(n log n) | O(n) or O(1) | Full sorting |

**Note:** Two-way merge is the building block for all multi-way merges and merge sort.

---

### Common Pitfalls by Approach

| Pitfall | Three Pointer | Extra Array |
|---------|---------------|-------------|
| Overwriting data | Avoided by design | Not applicable |
| Wrong pointer init | Common (k=m-1 or n-1) | Off-by-one in indices |
| Remainder handling | Forgetting j loop | Forgetting one array |
| Edge cases (empty) | Check m=0, n=0 | Empty result handling |
| Return wrong array | N/A (in-place) | Forgetting copy back |

<!-- back -->
