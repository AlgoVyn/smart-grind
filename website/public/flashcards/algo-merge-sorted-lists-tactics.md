## Merge Sorted Lists: Tactics & Techniques

What are the tactical patterns and problem-solving techniques for merging sorted lists?

<!-- front -->

---

### Tactic 1: Dummy Head Pattern

**Why**: Eliminates edge cases for empty lists, simplifies pointer management.

```python
def merge_with_dummy(l1, l2):
    dummy = ListNode(0)  # Dummy head
    tail = dummy
    
    # No special handling needed for empty lists
    while l1 and l2:
        # ... merge logic
        pass
    
    tail.next = l1 if l1 else l2
    return dummy.next  # Real head is dummy.next
```

---

### Tactic 2: In-Place Merge (Backwards)

**When**: Merging into first array which has extra capacity at end.

**Key Insight**: Fill from end to avoid overwriting unprocessed elements.

```python
def merge_backwards(nums1, m, nums2, n):
    """Fill from the end to preserve unmerged elements"""
    i, j, write = m - 1, n - 1, m + n - 1
    
    while j >= 0:  # While nums2 has elements
        if i >= 0 and nums1[i] > nums2[j]:
            nums1[write] = nums1[i]
            i -= 1
        else:
            nums1[write] = nums2[j]
            j -= 1
        write -= 1
```

---

### Tactic 3: Recursion for Clean Logic

**When**: Clean code matters more than stack space; lists are short.

```python
def merge_recursive(l1, l2):
    # Base cases handle emptiness cleanly
    if not l1:
        return l2
    if not l2:
        return l1
    
    # Pick smaller and recursively merge rest
    if l1.val < l2.val:
        l1.next = merge_recursive(l1.next, l2)
        return l1
    else:
        l2.next = merge_recursive(l1, l2.next)
        return l2
```

---

### Tactic 4: Min-Heap for K-Way

**Pattern**: When merging more than 2 lists, use heap for O(log k) extraction.

```python
import heapq

def k_way_merge(lists):
    dummy = ListNode(0)
    tail = dummy
    
    # Priority queue: store (value, list_id, node)
    # list_id breaks ties for equal values
    pq = [(lst.val, i, lst) for i, lst in enumerate(lists) if lst]
    heapq.heapify(pq)
    
    while pq:
        val, i, node = heapq.heappop(pq)
        tail.next = node
        tail = tail.next
        
        if node.next:
            heapq.heappush(pq, (node.next.val, i, node.next))
    
    return dummy.next
```

---

### Tactic 5: Divide and Conquer Optimization

**When**: K is large but memory is limited.

```python
def merge_k_lists_dc(lists):
    """Pairwise merging reduces memory overhead"""
    if not lists:
        return None
    
    interval = 1
    while interval < len(lists):
        for i in range(0, len(lists) - interval, interval * 2):
            lists[i] = merge_two_lists(lists[i], lists[i + interval])
        interval *= 2
    
    return lists[0]
```

**Complexity**: O(N log k) time, O(1) extra space (iterative).

<!-- back -->
