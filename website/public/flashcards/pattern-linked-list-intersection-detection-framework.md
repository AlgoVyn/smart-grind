## Linked List Intersection Detection: Framework

What is the complete code template for solving linked list cycle detection and intersection problems?

<!-- front -->

---

### Framework: Floyd's Cycle Detection (Tortoise and Hare)

```
┌─────────────────────────────────────────────────────────────────┐
│  CYCLE DETECTION - TEMPLATE                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Phase 1: Detect if cycle exists                                │
│  ─────────────────────────────────────                          │
│  slow = head                                                    │
│  fast = head (or head.next)                                     │
│                                                                 │
│  while fast and fast.next:                                      │
│      slow = slow.next        # 1 step                           │
│      fast = fast.next.next   # 2 steps                          │
│      if slow == fast:                                           │
│          return True  # Cycle detected                            │
│                                                                 │
│  return False  # fast reached null                                │
│                                                                 │
│  Phase 2: Find cycle start (if needed)                          │
│  ─────────────────────────────────────                          │
│  slow = head                                                    │
│  while slow != fast:                                            │
│      slow = slow.next                                           │
│      fast = fast.next                                           │
│  return slow  # Cycle start node                                │
│                                                                 │
│  Key Math: distance(head→start) = distance(meet→start)         │
└─────────────────────────────────────────────────────────────────┘
```

---

### Framework: Two Linked List Intersection

```
┌─────────────────────────────────────────────────────────────────┐
│  LIST INTERSECTION - TEMPLATE                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  p1, p2 = headA, headB                                          │
│                                                                 │
│  while p1 != p2:                                                │
│      p1 = p1.next if p1 else headB                              │
│      p2 = p2.next if p2 else headA                              │
│                                                                 │
│  return p1  # Intersection node or None                           │
│                                                                 │
│  Intuition: Both pointers traverse A+B total distance           │
│  After switch, they align at intersection (if any)              │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Floyd's Cycle Detection

```python
def has_cycle(head: ListNode) -> bool:
    """
    Detect if linked list has a cycle using Floyd's algorithm.
    Time: O(n), Space: O(1)
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


def detect_cycle_start(head: ListNode) -> ListNode:
    """
    Find the node where the cycle begins.
    Returns None if no cycle.
    """
    if not head or not head.next:
        return None
    
    # Phase 1: Detect cycle
    slow = fast = head
    has_cycle = False
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            has_cycle = True
            break
    
    if not has_cycle:
        return None
    
    # Phase 2: Find cycle start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

---

### Implementation: Two List Intersection

```python
def get_intersection_node(headA: ListNode, headB: ListNode) -> ListNode:
    """
    Find intersection node of two linked lists.
    Time: O(n+m), Space: O(1)
    """
    if not headA or not headB:
        return None
    
    p1, p2 = headA, headB
    
    while p1 != p2:
        p1 = p1.next if p1 else headB
        p2 = p2.next if p2 else headA
    
    return p1  # Returns intersection node or None


def get_intersection_node_with_length(headA, headB):
    """
    Alternative: Calculate lengths first.
    """
    def get_length(head):
        length = 0
        while head:
            length += 1
            head = head.next
        return length
    
    lenA, lenB = get_length(headA), get_length(headB)
    
    # Advance the longer list
    while lenA > lenB:
        headA = headA.next
        lenA -= 1
    while lenB > lenA:
        headB = headB.next
        lenB -= 1
    
    # Compare nodes
    while headA != headB:
        headA = headA.next
        headB = headB.next
    
    return headA
```

---

### Key Framework Elements

| Element | Purpose | Example |
|---------|---------|---------|
| `slow` | Moves 1 step at a time | `slow = slow.next` |
| `fast` | Moves 2 steps at a time | `fast = fast.next.next` |
| `while fast and fast.next` | Loop condition | Prevents null pointer errors |
| `slow == fast` | Meeting check | Detects cycle presence |
| Reset `slow = head` | Phase 2 setup | For finding cycle start |
| `p1 = p1.next if p1 else headB` | List switch | For two-list intersection |

<!-- back -->
