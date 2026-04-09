## Array - Merge Sorted In-Place: Forms

What are the different variations of merging sorted arrays?

<!-- front -->

---

### Form 1: In-Place from End

```python
def merge_inplace(nums1, m, nums2, n):
    """Merge nums2 into nums1 in-place."""
    i, j, k = m - 1, n - 1, m + n - 1
    
    while j >= 0:
        if i >= 0 and nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1
```

---

### Form 2: To New Array

```python
def merge_new(nums1, m, nums2, n):
    """Merge into new array."""
    result = []
    i = j = 0
    
    while i < m and j < n:
        if nums1[i] <= nums2[j]:
            result.append(nums1[i])
            i += 1
        else:
            result.append(nums2[j])
            j += 1
    
    result.extend(nums1[i:m])
    result.extend(nums2[j:n])
    return result
```

---

### Form 3: Generic Merge (Any Two Arrays)

```python
def merge_generic(arr1, arr2):
    """Merge any two sorted arrays."""
    result = []
    i = j = 0
    
    while i < len(arr1) and j < len(arr2):
        if arr1[i] <= arr2[j]:
            result.append(arr1[i])
            i += 1
        else:
            result.append(arr2[j])
            j += 1
    
    result.extend(arr1[i:])
    result.extend(arr2[j:])
    return result
```

---

### Form Comparison

| Form | Space | Preserves Input | Use Case |
|------|-------|-----------------|----------|
| In-place | O(1) | No (modifies nums1) | Space constrained |
| New array | O(m+n) | Yes | Need original |
| Generic | O(m+n) | Yes | Any two arrays |

<!-- back -->
