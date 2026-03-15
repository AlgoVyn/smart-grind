## Fast & Slow Pointers

**Question:** When should you use the Fast & Slow pointers pattern?

<!-- front -->

---

## Answer: Detect Cycles & Find Middle

### Use Cases
1. **Detect cycle in linked list**
2. **Find middle of linked list**
3. **Happy number detection**
4. **Find duplicate number**

### Detect Cycle
```python
def hasCycle(head):
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            return True
    
    return False
```

### Find Middle
```python
def middleNode(head):
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow
```

### Why It Works
- **Cycle detection:** Fast moves 2x speed, will eventually meet slow
- **Middle finding:** When fast reaches end, slow is at middle

### Visual
```
Linked List: 1 → 2 → 3 → 4 → 5 → 6
                     ↑
                   middle (for 6 nodes, returns node 4)

Slow: 1→2→3→4
Fast: 1→3→5→None (at end, slow at middle)
```

### Complexity
| Operation | Time | Space |
|-----------|------|-------|
| Detect Cycle | O(n) | O(1) |
| Find Middle | O(n) | O(1) |

### Key Insight
Two pointers at different speeds solve specific problems elegantly.

<!-- back -->
