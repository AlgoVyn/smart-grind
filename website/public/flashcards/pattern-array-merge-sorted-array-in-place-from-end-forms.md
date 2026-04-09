## Array - Merge Sorted Array (In-place from End): Forms

What are the different variations and forms of the merge sorted array pattern?

<!-- front -->

---

### Form 1: Standard Merge (LeetCode 88)

```python
def merge_standard(nums1, m, nums2, n):
    """Classic merge sorted array (LeetCode 88)."""
    i, j, k = m - 1, n - 1, m + n - 1
    
    while i >= 0 and j >= 0:
        if nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1
    
    while j >= 0:
        nums1[k] = nums2[j]
        j -= 1
        k -= 1
```

---

### Form 2: Merge with Gap Method (Shell Sort Style)

```python
def merge_gap_method(nums1, m, nums2, n):
    """Merge using gap method - alternative O(1) space approach."""
    # Copy nums2 to end of nums1 first
    for i in range(n):
        nums1[m + i] = nums2[i]
    
    # Use gap method (like shell sort)
    gap = m + n
    while gap > 0:
        gap = gap // 2 if gap // 2 > 0 else 0
        if gap == 0:
            break
        
        for i in range(gap, m + n):
            temp = nums1[i]
            j = i
            while j >= gap and nums1[j - gap] > temp:
                nums1[j] = nums1[j - gap]
                j -= gap
            nums1[j] = temp
```

---

### Form 3: Merge to New Array (Non In-Place)

```python
def merge_to_new(nums1, m, nums2, n):
    """Merge creating new array - preserves inputs."""
    result = [0] * (m + n)
    i = j = k = 0
    
    while i < m and j < n:
        if nums1[i] <= nums2[j]:
            result[k] = nums1[i]
            i += 1
        else:
            result[k] = nums2[j]
            j += 1
        k += 1
    
    while i < m:
        result[k] = nums1[i]
        i += 1
        k += 1
    
    while j < n:
        result[k] = nums2[j]
        j += 1
        k += 1
    
    return result
```

---

### Form 4: Linked List Version

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_lists(l1, l2):
    """Merge two sorted linked lists (LeetCode 21)."""
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

### Form 5: Recursive Version

```python
def merge_recursive(nums1, m, nums2, n, k=None):
    """Recursive merge (not recommended for large inputs)."""
    if k is None:
        k = m + n - 1
    
    # Base cases
    if n == 0:
        return
    if m == 0:
        nums1[:n] = nums2[:n]
        return
    
    # Recursive case
    if nums1[m - 1] > nums2[n - 1]:
        nums1[k] = nums1[m - 1]
        merge_recursive(nums1, m - 1, nums2, n, k - 1)
    else:
        nums1[k] = nums2[n - 1]
        merge_recursive(nums1, m, nums2, n - 1, k - 1)
```

---

### Form Comparison

| Form | Space | Preserves Inputs | Use Case |
|------|-------|------------------|----------|
| Standard (three pointer) | O(1) | No | In-place merge |
| Gap method | O(1) | No | Alternative in-place |
| New array | O(m+n) | Yes | Input preservation |
| Linked list | O(1) | No | Linked list problems |
| Recursive | O(m+n) stack | No | Educational only |

---

### Form Selection Guide

```
Problem Requirements → Form Selection

In-place required?
  ├─ Yes → Standard three pointer (Form 1)
  └─ No → Can use extra space?
      ├─ Yes → New array (Form 3) for clarity
      └─ No constraint → Standard for practice

Input type?
  ├─ Arrays → Standard three pointer
  └─ Linked Lists → Linked list version (Form 4)

Must preserve inputs?
  ├─ Yes → New array version
  └─ No → Standard three pointer
```

<!-- back -->
