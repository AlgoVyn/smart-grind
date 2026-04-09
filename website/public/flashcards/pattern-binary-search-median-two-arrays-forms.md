## Binary Search - Median of Two Arrays: Forms

What are the different variations of median of two arrays?

<!-- front -->

---

### Form 1: Binary Search (Optimal)

```python
def find_median(nums1, nums2):
    """O(log(min(m,n))) solution."""
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    m, n = len(nums1), len(nums2)
    left, right = 0, m
    half = (m + n + 1) // 2
    
    while left <= right:
        i = (left + right) // 2
        j = half - i
        
        left1 = float('-inf') if i == 0 else nums1[i-1]
        right1 = float('inf') if i == m else nums1[i]
        left2 = float('-inf') if j == 0 else nums2[j-1]
        right2 = float('inf') if j == n else nums2[j]
        
        if left1 <= right2 and left2 <= right1:
            if (m + n) % 2 == 1:
                return max(left1, left2)
            return (max(left1, left2) + min(right1, right2)) / 2
        elif left1 > right2:
            right = i - 1
        else:
            left = i + 1
```

---

### Form 2: Merge Approach

```python
def find_median_merge(nums1, nums2):
    """O(m+n) merge approach."""
    merged = sorted(nums1 + nums2)
    n = len(merged)
    if n % 2 == 1:
        return merged[n // 2]
    return (merged[n // 2 - 1] + merged[n // 2]) / 2
```

---

### Form 3: Kth Element

```python
def find_kth(nums1, nums2, k):
    """Find kth smallest element."""
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
    return find_kth(nums1, nums2[j:], k - j)
```

---

### Form Comparison

| Form | Time | Space | Use Case |
|------|------|-------|----------|
| Binary search | O(log(min)) | O(1) | Interview optimal |
| Merge | O(m+n) | O(m+n) | Simple implementation |
| Kth element | O(log(k)) | O(log(k)) stack | General kth |

<!-- back -->
