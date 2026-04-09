## Heap - K-way Merge: Forms

What are the different variations of k-way merge?

<!-- front -->

---

### Form 1: Standard K-way Merge

```python
def merge_k_sorted(lists):
    """Standard k-way merge."""
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
    
    result = []
    while heap:
        val, i, j = heapq.heappop(heap)
        result.append(val)
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j+1], i, j+1))
    
    return result
```

---

### Form 2: Merge K Linked Lists

```python
def merge_k_lists(lists):
    """Merge K linked lists."""
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    
    dummy = ListNode(0)
    curr = dummy
    
    while heap:
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next
```

---

### Form 3: Divide and Conquer

```python
def merge_k_divide_conquer(lists):
    """Merge using divide and conquer."""
    if not lists:
        return []
    if len(lists) == 1:
        return lists[0]
    
    mid = len(lists) // 2
    left = merge_k_divide_conquer(lists[:mid])
    right = merge_k_divide_conquer(lists[mid:])
    
    return merge_two(left, right)

def merge_two(l1, l2):
    """Merge two sorted lists."""
    result = []
    i = j = 0
    while i < len(l1) and j < len(l2):
        if l1[i] <= l2[j]:
            result.append(l1[i])
            i += 1
        else:
            result.append(l2[j])
            j += 1
    result.extend(l1[i:])
    result.extend(l2[j:])
    return result
```

---

### Form Comparison

| Form | Space | Time | Use Case |
|------|-------|------|----------|
| Heap | O(K) | O(N log K) | Standard |
| Linked | O(K) | O(N log K) | Linked lists |
| D&C | O(log K) | O(N log K) | No heap |

<!-- back -->
