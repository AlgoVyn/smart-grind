## Binary Search - Median/Kth Across Two Sorted Arrays: Tactics

What are the advanced techniques for finding median and kth element across two sorted arrays?

<!-- front -->

---

### Tactic 1: Adapting for Kth Element

**Problem**: Find kth smallest element (not just median)

**Solution**: Change `half` to `k`

```python
def find_kth_element(nums1, nums2, k):
    """
    Find kth smallest element (1-indexed).
    Time: O(log min(m,n)), Space: O(1)
    """
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    # Binary search range for partition in nums1
    low = max(0, k - len(nums2))   # At least (k-n) from nums1
    high = min(k, len(nums1))      # At most k from nums1
    
    while low <= high:
        i = (low + high) // 2   # From nums1
        j = k - i               # From nums2
        
        left1 = nums1[i-1] if i > 0 else float('-inf')
        right1 = nums1[i] if i < len(nums1) else float('inf')
        left2 = nums2[j-1] if j > 0 else float('-inf')
        right2 = nums2[j] if j < len(nums2) else float('inf')
        
        if left1 <= right2 and left2 <= right1:
            return max(left1, left2)  # kth element
        elif left1 > right2:
            high = i - 1
        else:
            low = i + 1
```

**Key difference**: `half` becomes `k`, binary search range is `[max(0,k-n), min(k,m)]`

---

### Tactic 2: Finding Kth Largest Element

**Convert kth largest to kth smallest:**

```python
def find_kth_largest(nums1, nums2, k):
    """
    kth largest = (m+n-k+1)th smallest
    """
    m, n = len(nums1), len(nums2)
    return find_kth_element(nums1, nums2, m + n - k + 1)
```

**Example**: Find 2nd largest in arrays with 5+6=11 elements
- 2nd largest = (11-2+1) = 10th smallest

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Not swapping arrays** | Binary search on larger array | `if len(nums1) > len(nums2): swap` |
| **Integer division error** | Wrong median for even | Use `/ 2.0` not `// 2` |
| **Boundary infinity** | Using actual min/max values | Use `-inf/+inf` or `MIN/MAX_VALUE` |
| **k is 1-indexed** | Using 0-indexed k | k=1 means first element, not k=0 |
| **Off-by-one in half** | `(m+n)//2` vs `(m+n+1)//2` | Use `+1` for correct odd handling |
| **Wrong binary search range** | `low=0, high=m` for kth | Use `max(0,k-n)` to `min(k,m)` |

---

### Tactic 4: Extension to K Sorted Arrays

**Problem**: Find median/kth across k sorted arrays

**Approaches:**

1. **Min-Heap** (k-way merge): O((m+n) log k) time
2. **Divide and Conquer**: Pair up arrays, find median of pairs, recurse
3. **Binary Search on Answer**: Check how many elements ≤ mid across all arrays

```python
# Binary search on value approach
def kth_in_k_sorted_arrays(arrays, k):
    """
    Find kth element in k sorted arrays.
    Time: O(log(range) * k * log(max_len))
    """
    def count_less_equal(target):
        """Count elements <= target across all arrays."""
        count = 0
        for arr in arrays:
            # Binary search in each array
            count += bisect.bisect_right(arr, target)
        return count
    
    low, high = min(arr[0] for arr in arrays), max(arr[-1] for arr in arrays)
    
    while low < high:
        mid = low + (high - low) // 2
        if count_less_equal(mid) < k:
            low = mid + 1
        else:
            high = mid
    
    return low
```

---

### Tactic 5: Handling Edge Cases

```python
# Empty array
def median_with_empty(nums1, nums2):
    """Handle when one array is empty."""
    if not nums1:
        return median_single_array(nums2)
    if not nums2:
        return median_single_array(nums1)
    return find_median_sorted_arrays(nums1, nums2)

# Single element arrays
def median_single_elements(nums1, nums2):
    """nums1=[a], nums2=[b] - median is (a+b)/2."""
    # Algorithm handles this naturally with partition logic
    pass

# All elements equal
def median_all_equal(nums1, nums2):
    """All elements are the same value."""
    # Returns that value as median - algorithm works correctly
    pass
```

---

### Tactic 6: Quick Validation Checklist

Before submitting solution, verify:

- [ ] Swapped to ensure `len(nums1) <= len(nums2)`
- [ ] Used `-inf/+inf` for boundary comparisons
- [ ] Correctly calculated `half = (m+n+1)//2`
- [ ] Odd total: return `max(left1, left2)`
- [ ] Even total: return `(max(left) + min(right)) / 2.0`
- [ ] Tested with empty arrays
- [ ] Tested with single-element arrays
- [ ] Tested with one array much larger than other

<!-- back -->
