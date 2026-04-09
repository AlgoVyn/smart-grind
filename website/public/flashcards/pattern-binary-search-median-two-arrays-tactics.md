## Binary Search - Median of Two Arrays: Tactics

What are the advanced techniques for median of two arrays?

<!-- front -->

---

### Tactic 1: Find Kth Element

```python
def find_kth(nums1, nums2, k):
    """Find kth smallest element in two sorted arrays."""
    # Ensure nums1 is smaller
    if len(nums1) > len(nums2):
        return find_kth(nums2, nums1, k)
    
    if not nums1:
        return nums2[k - 1]
    if k == 1:
        return min(nums1[0], nums2[0])
    
    i = min(k // 2, len(nums1))
    j = min(k // 2, len(nums2))
    
    if nums1[i - 1] < nums2[j - 1]:
        return find_kth(nums1[i:], nums2, k - i)
    else:
        return find_kth(nums1, nums2[j:], k - j)
```

---

### Tactic 2: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Wrong half calculation | Wrong partition | (m+n+1)//2 |
| Not checking bounds | Index error | Use -inf/+inf |
| Wrong comparison | Infinite loop | Check both conditions |
| Integer overflow | Wrong result | Use // for division |

---

### Tactic 3: Merge Approach (Fallback)

```python
def find_median_merge(nums1, nums2):
    """Merge approach for understanding (O(m+n))."""
    merged = []
    i = j = 0
    
    while i < len(nums1) and j < len(nums2):
        if nums1[i] < nums2[j]:
            merged.append(nums1[i])
            i += 1
        else:
            merged.append(nums2[j])
            j += 1
    
    merged.extend(nums1[i:])
    merged.extend(nums2[j:])
    
    n = len(merged)
    if n % 2 == 1:
        return merged[n // 2]
    return (merged[n // 2 - 1] + merged[n // 2]) / 2
```

<!-- back -->
