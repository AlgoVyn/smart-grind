## Linked List Intersection Detection: Forms & Variations

What are the different forms and variations of linked list cycle and intersection problems?

<!-- front -->

---

### Form 1: Standard Cycle Detection

```python
def has_cycle(head: ListNode) -> bool:
    """
    Basic: Return True if cycle exists.
    LeetCode 141: Linked List Cycle
    """
    if not head or not head.next:
        return False
    
    slow = head
    fast = head.next
    
    while fast and fast.next:
        if slow == fast:
            return True
        slow = slow.next
        fast = fast.next.next
    
    return False
```

**Output**: Boolean (True/False)

---

### Form 2: Find Cycle Start Node

```python
def detect_cycle(head: ListNode) -> ListNode:
    """
    Return the node where cycle begins.
    LeetCode 142: Linked List Cycle II
    """
    if not head or not head.next:
        return None
    
    # Phase 1: Find meeting point
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None
    
    # Phase 2: Find start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

**Output**: ListNode (cycle start) or None

---

### Form 3: Two List Intersection

```python
def get_intersection_node(headA: ListNode, headB: ListNode) -> ListNode:
    """
    Find intersection of two linked lists.
    LeetCode 160: Intersection of Two Linked Lists
    """
    if not headA or not headB:
        return None
    
    p1, p2 = headA, headB
    
    while p1 != p2:
        p1 = p1.next if p1 else headB
        p2 = p2.next if p2 else headA
    
    return p1
```

**Output**: ListNode (intersection) or None

---

### Form 4: Array-as-Linked-List (Duplicate Detection)

```python
def find_duplicate(nums: list) -> int:
    """
    Treat array as linked list where nums[i] is next index.
    LeetCode 287: Find the Duplicate Number
    """
    # Phase 1: Meeting point
    slow = nums[0]
    fast = nums[nums[0]]
    
    while slow != fast:
        slow = nums[slow]
        fast = nums[nums[fast]]
    
    # Phase 2: Cycle start (duplicate)
    slow = 0
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow
```

**Input**: Array with values as indices | **Output**: Integer (duplicate)

---

### Form 5: Happy Number (Cycle in Transformations)

```python
def is_happy(n: int) -> bool:
    """
    Number transformation cycle detection.
    LeetCode 202: Happy Number
    """
    def get_next(num):
        total = 0
        while num > 0:
            d = num % 10
            total += d * d
            num //= 10
        return total
    
    slow, fast = n, get_next(n)
    
    while fast != 1 and slow != fast:
        slow = get_next(slow)
        fast = get_next(get_next(fast))
    
    return fast == 1
```

**Input**: Integer | **Output**: Boolean (happy or not)

---

### Form 6: Fast/Slow for Middle Finding

```python
def middle_node(head: ListNode) -> ListNode:
    """
    Find middle using fast/slow.
    When fast reaches end, slow is at middle.
    LeetCode 876: Middle of the Linked List
    """
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow
```

**Output**: Middle node (second middle if even length)

---

### Form 7: Fast/Slow with Fixed Gap

```python
def remove_nth_from_end(head: ListNode, n: int) -> ListNode:
    """
    Fast leads by n+1, when fast reaches end, slow is before target.
    LeetCode 19: Remove Nth Node From End of List
    """
    dummy = ListNode(0, head)
    slow = fast = dummy
    
    for _ in range(n + 1):
        fast = fast.next
    
    while fast:
        slow = slow.next
        fast = fast.next
    
    slow.next = slow.next.next
    return dummy.next
```

---

### Form 8: Cycle Length Calculation

```python
def cycle_length(head: ListNode) -> int:
    """
    Find the length of the cycle.
    Extension of standard Floyd's.
    """
    # Find meeting point
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return 0
    
    # Count cycle
    length = 1
    fast = fast.next
    while fast != slow:
        fast = fast.next
        length += 1
    
    return length
```

---

### Summary: Forms & Their Use Cases

| Form | Problem | Output | Key Variation |
|------|---------|--------|---------------|
| **Cycle Detection** | Has cycle? | Boolean | Basic Floyd's |
| **Cycle Start** | Where cycle begins? | ListNode | Phase 2 reset |
| **Two List Intersection** | Where lists merge? | ListNode | Switch heads |
| **Array Cycle** | Find duplicate | Integer | Value-as-pointer |
| **Happy Number** | Cycle in digits? | Boolean | Computed next |
| **Middle Node** | Center of list? | ListNode | Fast to end |
| **Nth from End** | Position from tail? | ListNode | Fixed gap |
| **Cycle Length** | How long is cycle? | Integer | Count from meet |

<!-- back -->
