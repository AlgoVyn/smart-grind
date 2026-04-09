## Array - Merge Sorted In-Place: Tactics

What are the advanced techniques for merging sorted arrays?

<!-- front -->

---

### Tactic 1: Merge to New Array

```python
def merge_to_new(nums1, m, nums2, n):
    """Merge into new array when in-place not required."""
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

### Tactic 2: Merge Sort Merge Step

```python
def merge_sort_merge(arr, left, mid, right):
    """Standard merge sort merge step."""
    left_arr = arr[left:mid+1]
    right_arr = arr[mid+1:right+1]
    
    i = j = 0
    k = left
    
    while i < len(left_arr) and j < len(right_arr):
        if left_arr[i] <= right_arr[j]:
            arr[k] = left_arr[i]
            i += 1
        else:
            arr[k] = right_arr[j]
            j += 1
        k += 1
    
    while i < len(left_arr):
        arr[k] = left_arr[i]
        i += 1
        k += 1
    
    while j < len(right_arr):
        arr[k] = right_arr[j]
        j += 1
        k += 1
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Starting from front | Overwrite | Start from end |
| Not handling remaining | Missing elements | Copy remaining from second array |
| Wrong pointer update | Infinite loop | Decrement after placing |
| Off-by-one indices | Wrong result | Check `>= 0` not `> 0` |

<!-- back --
