## Merge Sorted Lists: Framework

What are the complete implementations for merging sorted lists (arrays and linked lists)?

<!-- front -->

---

### Two Sorted Arrays

```python
def merge_sorted_arrays(arr1, arr2):
    """Merge two sorted arrays into new sorted array"""
    result = []
    i = j = 0
    
    while i < len(arr1) and j < len(arr2):
        if arr1[i] <= arr2[j]:
            result.append(arr1[i])
            i += 1
        else:
            result.append(arr2[j])
            j += 1
    
    # Append remaining elements
    result.extend(arr1[i:])
    result.extend(arr2[j:])
    
    return result
```

---

### Two Sorted Linked Lists (Iterative)

```python
def merge_two_lists(l1, l2):
    """Merge two sorted linked lists, return new head"""
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
    
    # Attach remaining list
    current.next = l1 if l1 else l2
    
    return dummy.next
```

---

### Two Sorted Linked Lists (Recursive)

```python
def merge_two_lists_recursive(l1, l2):
    """Recursive merge with cleaner logic"""
    if not l1:
        return l2
    if not l2:
        return l1
    
    if l1.val <= l2.val:
        l1.next = merge_two_lists_recursive(l1.next, l2)
        return l1
    else:
        l2.next = merge_two_lists_recursive(l1, l2.next)
        return l2
```

---

### K-Way Merge (Using Heap)

```python
import heapq

def merge_k_lists(lists):
    """Merge k sorted linked lists using min-heap"""
    dummy = ListNode(0)
    current = dummy
    
    # Heap: (value, list_index, node)
    # list_index ensures stable sorting for equal values
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    
    while heap:
        val, i, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next
```

---

### Merge Sort Helper (Divide & Conquer)

```python
def merge_sort(head):
    """Complete merge sort for linked list"""
    if not head or not head.next:
        return head
    
    # Find middle using slow/fast pointers
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # Split into two halves
    mid = slow.next
    slow.next = None
    
    # Recursively sort and merge
    left = merge_sort(head)
    right = merge_sort(mid)
    
    return merge_two_lists(left, right)
```

<!-- back -->
