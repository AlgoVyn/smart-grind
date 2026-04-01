## Title: Rotate Array - Tactics

What are specific techniques and optimizations for array rotation?

<!-- front -->

---

### Tactic 1: Efficient Reversal Implementation

```python
def rotate_optimized(nums, k):
    """In-place rotation with minimal operations."""
    n = len(nums)
    if n <= 1:
        return
    
    k = k % n
    if k == 0:
        return
    
    # Single reversal function
    def reverse(start, end):
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
    
    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)
```

**Key Points:**
- Handle edge cases early
- Each element swapped at most twice
- Cache-friendly sequential access

---

### Tactic 2: GCD-Based Juggling for Left Rotation

```python
import math

def rotate_left_juggling(arr, k):
    """Rotate left using juggling algorithm."""
    n = len(arr)
    if n == 0:
        return
    
    k = k % n
    if k == 0:
        return
    
    gcd_val = math.gcd(k, n)
    
    for i in range(gcd_val):
        temp = arr[i]
        j = i
        
        while True:
            next_idx = (j + k) % n
            if next_idx == i:
                break
            arr[j] = arr[next_idx]
            j = next_idx
        
        arr[j] = temp
```

---

### Tactic 3: Using Built-in Operations

```python
def rotate_pythonic(nums, k):
    """Pythonic approach (not in-place)."""
    n = len(nums)
    k = k % n
    return nums[-k:] + nums[:-k] if k != 0 else nums[:]

# In-place using slice assignment
def rotate_slice(nums, k):
    """Using Python slice assignment."""
    n = len(nums)
    k = k % n
    nums[:] = nums[-k:] + nums[:-k]
```

---

### Tactic 4: Linked List Rotation Strategy

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def rotate_linked_list(head, k):
    """Rotate linked list by k places."""
    if not head or not head.next or k == 0:
        return head
    
    # Find length and tail
    length = 1
    tail = head
    while tail.next:
        tail = tail.next
        length += 1
    
    # Make circular
    tail.next = head
    
    # Find new tail
    k = k % length
    if k == 0:
        tail.next = None
        return head
    
    steps_to_new_tail = length - k - 1
    new_tail = head
    for _ in range(steps_to_new_tail):
        new_tail = new_tail.next
    
    new_head = new_tail.next
    new_tail.next = None
    return new_head
```

---

### Tactic 5: Performance Comparison

| Approach | Time | Space | Cache Efficiency | Code Complexity |
|----------|------|-------|------------------|-----------------|
| **Reversal** | O(n) | O(1) | Excellent | Simple |
| **Cyclic** | O(n) | O(1) | Poor (jumping) | Moderate |
| **Slice** | O(n) | O(n) | Good | Very Simple |
| **GCD** | O(n) | O(1) | Moderate | Complex |

**Recommendation:** Use reversal method for interviews and production code.

<!-- back -->
