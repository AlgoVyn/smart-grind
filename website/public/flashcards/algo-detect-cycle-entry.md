## Detect Cycle in Linked List

**Question:** How do you find the entry point of a cycle in a linked list?

<!-- front -->

---

## Answer: Floyd's Tortoise and Hare

### Solution
```python
def detectCycle(head):
    if not head or not head.next:
        return None
    
    # Phase 1: Find intersection
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    
    # No cycle
    if not fast or not fast.next:
        return None
    
    # Phase 2: Find cycle entry
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

### Visual: Two-Phase Detection
```
List: 1 → 2 → 3 → 4 → 5 ↑
           ↑___________|

Phase 1: Find intersection
- slow moves 1 step, fast moves 2 steps
- They meet at node 3

Phase 2: Move both 1 step from head and meeting point
- Both meet at node 2 (cycle entry)

Return: Node 2
```

### ⚠️ Tricky Parts

#### 1. Why Floyd's Algorithm Works
```
Let:
- d = distance from head to cycle entry
- c = cycle length
- x = distance from entry to meeting point

Meeting in phase 1:
- slow: d + x
- fast: d + x + n*c (n >= 1)

Since fast = 2*slow:
2(d + x) = d + x + n*c
d + x = n*c
d = n*c - x

From meeting point to entry: c - x
Moving slow from meeting point:
- Position: x from entry
- Need: d from entry
- d = n*c - x = (n-1)*c + (c-x)

So after d steps from meeting, we reach entry!
```

#### 2. Why Start Both from Head in Phase 2
```python
# Both move 1 step
# After d steps from head → entry
# After d steps from meeting → entry
# Because d = n*c - x
```

#### 3. Handling Edge Cases
```python
# Empty list
if not head:
    return None

# Single node pointing to itself
# head.next == head → cycle
# Correctly detected

# No cycle
# fast or fast.next becomes None → returns None
```

### Alternative: Hash Set
```python
def detectCycleHash(head):
    seen = set()
    current = head
    
    while current:
        if current in seen:
            return current
        seen.add(current)
        current = current.next
    
    return None
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Floyd's | O(n) | O(1) |
| Hash Set | O(n) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not checking fast.next | Check both fast and fast.next |
| Wrong phase 2 start | Start both from head |
| Infinite loop | Ensure fast moves 2, slow moves 1 |

<!-- back -->
