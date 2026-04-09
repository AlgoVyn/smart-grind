## Linked List - Merging Two Sorted Lists: Forms

What are the different variations of merging two sorted lists?

<!-- front -->

---

### Form 1: Standard Merge (Ascending)

```python
def merge_two_lists(l1, l2):
    """Standard merge of two sorted lists in ascending order."""
    dummy = ListNode(0)
    current = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    
    current.next = l1 if l1 else l2
    return dummy.next
```

---

### Form 2: Merge Without Modifying Inputs

```python
def merge_without_modification(l1, l2):
    """Create new nodes, don't rewire original lists."""
    dummy = ListNode(0)
    current = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            current.next = ListNode(l1.val)  # New node!
            l1 = l1.next
        else:
            current.next = ListNode(l2.val)  # New node!
            l2 = l2.next
        current = current.next
    
    # Copy remainder
    remaining = l1 if l1 else l2
    while remaining:
        current.next = ListNode(remaining.val)
        current = current.next
        remaining = remaining.next
    
    return dummy.next
```

---

### Form 3: Merge with Duplicates Removed

```python
def merge_without_duplicates(l1, l2):
    """Merge and remove duplicate values."""
    dummy = ListNode(0)
    current = dummy
    
    while l1 and l2:
        # Pick smaller
        if l1.val <= l2.val:
            next_val = l1.val
            l1 = l1.next
        else:
            next_val = l2.val
            l2 = l2.next
        
        # Skip duplicates
        if current.val != next_val:
            current.next = ListNode(next_val)
            current = current.next
    
    # Handle remainder with duplicate removal
    remaining = l1 if l1 else l2
    while remaining:
        if current.val != remaining.val:
            current.next = ListNode(remaining.val)
            current = current.next
        remaining = remaining.next
    
    return dummy.next
```

---

### Form 4: Merge k Sorted Lists

```python
from heapq import heappush, heappop

def merge_k_lists(lists):
    """Merge k sorted lists using min-heap."""
    dummy = ListNode(0)
    current = dummy
    heap = []
    
    for i, node in enumerate(lists):
        if node:
            heappush(heap, (node.val, i, node))
    
    while heap:
        val, i, node = heappop(heap)
        current.next = node
        current = current.next
        if node.next:
            heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next
```

---

### Form 5: Merge Interleaved (Alternating)

```python
def merge_interleaved(l1, l2):
    """Interleave nodes from both lists alternately."""
    dummy = ListNode(0)
    current = dummy
    use_l1 = True
    
    while l1 and l2:
        if use_l1:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
        use_l1 = not use_l1
    
    # Append remainder of whichever list has nodes left
    current.next = l1 if l1 else l2
    return dummy.next
```

---

### Form 6: Merge Sorted Arrays (Same Pattern)

```python
def merge_sorted_arrays(arr1, arr2):
    """Same logic applied to arrays."""
    result = []
    i = j = 0
    
    while i < len(arr1) and j < len(arr2):
        if arr1[i] <= arr2[j]:
            result.append(arr1[i])
            i += 1
        else:
            result.append(arr2[j])
            j += 1
    
    # Extend with remaining elements
    result.extend(arr1[i:])
    result.extend(arr2[j:])
    return result
```

---

### Form Comparison

| Form | Input | Output | Special Handling |
|------|-------|--------|------------------|
| Standard | 2 sorted lists | Merged sorted list | Pointer rewiring |
| No modification | 2 sorted lists | New merged list | Create new nodes |
| No duplicates | 2 sorted lists | Merged, unique values | Skip duplicates |
| k lists | k sorted lists | Merged sorted list | Min-heap or divide-conquer |
| Interleaved | 2 lists | Alternating nodes | Toggle flag |
| Arrays | 2 sorted arrays | Merged sorted array | Index-based |

---

### Related Problems

| Problem | LeetCode # | Difficulty | Form Applied |
|---------|------------|------------|--------------|
| Merge Two Sorted Lists | 21 | Easy | Standard |
| Merge k Sorted Lists | 23 | Hard | k-way merge |
| Sort List | 148 | Medium | Merge sort |
| Intersection of Two Linked Lists | 160 | Easy | Related traversal |
| Add Two Numbers | 2 | Medium | Related manipulation |

<!-- back -->
