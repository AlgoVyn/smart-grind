## Merge Sorted Lists: Forms & Variations

What are the different forms and variations of merge sorted lists problems?

<!-- front -->

---

### Form 1: Standard Two-List Merge

**Pattern**: Given two sorted lists, return merged sorted list.

```python
# Input: [1,2,4], [1,3,4]
# Output: [1,1,2,3,4,4]

def standard_merge(l1, l2):
    dummy = ListNode(0)
    tail = dummy
    
    while l1 and l2:
        if l1.val < l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
    
    tail.next = l1 or l2
    return dummy.next
```

---

### Form 2: Merge K Sorted Lists

**Pattern**: Given array of k sorted lists, merge into one.

| Approach | Time | Space | Best When |
|----------|------|-------|-----------|
| Heap | O(N log k) | O(k) | General case |
| Divide & Conquer | O(N log k) | O(log k) | Memory constrained |
| Sequential | O(N * k) | O(1) | k is very small |

```python
def merge_k_lists_divide_conquer(lists):
    """Divide and conquer: merge pairs"""
    if not lists:
        return None
    
    def merge_range(lists, left, right):
        if left == right:
            return lists[left]
        if left + 1 == right:
            return merge_two_lists(lists[left], lists[right])
        
        mid = (left + right) // 2
        left_merged = merge_range(lists, left, mid)
        right_merged = merge_range(lists, mid + 1, right)
        return merge_two_lists(left_merged, right_merged)
    
    return merge_range(lists, 0, len(lists) - 1)
```

---

### Form 3: Merge Sorted Arrays (In-Place)

**Pattern**: Given nums1 with enough space at end, merge nums2 into nums1 in-place.

```python
def merge_in_place(nums1, m, nums2, n):
    """Merge nums2 into nums1, where nums1 has size m+n"""
    # Start from the end to avoid overwriting
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

### Form 4: Merge Intervals (Extension)

**Pattern**: Given list of intervals, merge overlapping ones.

```python
def merge_intervals(intervals):
    """Merge overlapping intervals"""
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        last = merged[-1]
        if current[0] <= last[1]:  # Overlap
            last[1] = max(last[1], current[1])
        else:
            merged.append(current)
    
    return merged
```

---

### Form 5: Alternating Merge (Zipper)

**Pattern**: Interleave nodes from two lists alternately.

```python
def zipper_merge(l1, l2):
    """Merge by alternating: l1[0], l2[0], l1[1], l2[1], ..."""
    dummy = ListNode(0)
    tail = dummy
    toggle = True
    
    while l1 or l2:
        if toggle and l1:
            tail.next = l1
            l1 = l1.next
        elif l2:
            tail.next = l2
            l2 = l2.next
        toggle = not toggle
        tail = tail.next
    
    tail.next = None
    return dummy.next
```

<!-- back -->
