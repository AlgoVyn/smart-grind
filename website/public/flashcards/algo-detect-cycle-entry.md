## Detect Cycle Entry Point (Floyd's Tortoise & Hare)

**Question:** How do you find the node where a cycle begins in a linked list?

<!-- front -->

---

## Answer: Floyd's Cycle Detection Algorithm

### Two-Phase Approach
1. **Detect cycle:** Use slow and fast pointers
2. **Find entry:** Reset one pointer to head, move both one step at a time

### Solution
```python
def detect_cycle(head):
    if not head or not head.next:
        return None
    
    # Phase 1: Detect cycle
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    
    # No cycle found
    if not fast or not fast.next:
        return None
    
    # Phase 2: Find cycle entry
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

### Visual
```
List: 1 → 2 → 3 → 4 → 5 → 6
              ↑         ↓
              └─────────┘
              
Step 1: Detect - they meet at node 6
Step 2: Reset slow to head, move both
        1→2→3→4→5→6→3→4...
        They meet at node 3 (cycle entry!)
```

### Why It Works
- Distance from head to cycle entry = x
- Distance from entry to meeting point = y
- Distance around cycle = z
- Slow travels: x + y
- Fast travels: x + y + k*z (for some k)
- Since fast = 2*slow: x + y = k*z
- Therefore: x = (k-1)*z + (z-y) = distance from meeting to entry
- Resetting slow to head ensures meeting at entry

### Complexity
- **Time:** O(n)
- **Space:** O(1)

<!-- back -->
