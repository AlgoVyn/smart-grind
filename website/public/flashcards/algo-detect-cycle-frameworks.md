## Detect Cycle: Algorithm Framework

What are the complete implementations for cycle detection algorithms?

<!-- front -->

---

### Floyd's Algorithm (Linked List)

```python
class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

def detect_cycle_floyd(head):
    """
    Returns node where cycle begins, or None
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
        return None  # No cycle
    
    # Phase 2: Find cycle entry
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow  # Cycle entry point
```

---

### Hash Set Approach

```python
def detect_cycle_hash(head):
    """
    Simpler but O(n) space
    """
    visited = set()
    current = head
    
    while current:
        if current in visited:
            return current
        visited.add(current)
        current = current.next
    
    return None
```

---

### Functional Graph (Array-based)

```python
def find_cycle_in_array(arr):
    """
    Array where arr[i] is "next" index
    Find if cycle exists from index 0
    """
    n = len(arr)
    
    def get_next(i):
        # Handle both positive and negative steps
        return (i + arr[i]) % n
    
    slow = fast = 0
    
    # Find meeting point
    while True:
        slow = get_next(slow)
        fast = get_next(get_next(fast))
        
        if slow == fast:
            break
        if slow == 0 and fast == 0:  # No cycle
            return None
    
    # Find cycle length and entry
    cycle_length = 1
    fast = get_next(slow)
    while fast != slow:
        fast = get_next(fast)
        cycle_length += 1
    
    # Find entry point
    slow = 0
    while slow != fast:
        slow = get_next(slow)
        fast = get_next(fast)
    
    return {
        'entry': slow,
        'length': cycle_length,
        'mu': 0  # Distance from start to entry (calculate if needed)
    }
```

---

### Brent's Algorithm

```python
def brent_algorithm(f, x0):
    """
    Find cycle parameters (mu, lambda) for function f
    """
    # power = 2^i, lam = candidate cycle length
    power = lam = 1
    tortoise = x0
    hare = f(x0)
    
    # Find lambda (cycle length)
    while tortoise != hare:
        if power == lam:
            tortoise = hare
            power *= 2
            lam = 0
        hare = f(hare)
        lam += 1
    
    # Find mu (start of cycle)
    mu = 0
    tortoise = hare = x0
    for _ in range(lam):
        hare = f(hare)
    
    while tortoise != hare:
        tortoise = f(tortoise)
        hare = f(hare)
        mu += 1
    
    return mu, lam
```

---

### Cycle Length and All Cycle Nodes

```python
def get_cycle_info(head):
    """
    Returns: (has_cycle, entry, length, all_nodes)
    """
    entry = detect_cycle_floyd(head)
    
    if not entry:
        return False, None, 0, []
    
    # Count cycle length
    length = 1
    current = entry.next
    nodes = [entry]
    
    while current != entry:
        nodes.append(current)
        current = current.next
        length += 1
    
    return True, entry, length, nodes
```

<!-- back -->
