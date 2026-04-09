## Design - General/Specific: Tactics

What are the essential implementation tactics for design problems?

<!-- front -->

---

### Tactic 1: Dummy Head/Tail Pattern

```python
# Use sentinel nodes to eliminate edge cases
self.head = ListNode()  # Dummy head
self.tail = ListNode()  # Dummy tail
self.head.next = self.tail
self.tail.prev = self.head

# Benefits:
# - No null checks for empty list
# - No special case for first/last insertion
# - Uniform remove/add logic
```

---

### Tactic 2: Map + Linked List Helpers

```python
def _remove(self, node):
    """Unlink node from current position"""
    prev, nxt = node.prev, node.next
    prev.next = nxt
    nxt.prev = prev

def _add_to_head(self, node):
    """Insert right after dummy head"""
    node.prev = self.head
    node.next = self.head.next
    self.head.next.prev = node
    self.head.next = node

def _move_to_head(self, node):
    """Mark as recently used"""
    self._remove(node)
    self._add_to_head(node)
```

---

### Tactic 3: Auxiliary Stack Pattern (Min Stack)

```python
# Two stacks: main + min tracking
self.stack = []      # Regular stack
self.min_stack = []  # Monotonic decreasing

def push(self, val):
    self.stack.append(val)
    # Push to min_stack if new minimum
    if not self.min_stack or val <= self.min_stack[-1]:
        self.min_stack.append(val)

def pop(self):
    val = self.stack.pop()
    # Remove from min_stack if it was the min
    if val == self.min_stack[-1]:
        self.min_stack.pop()
```

---

### Tactic 4: Language-Specific Shortcuts

| Language | Built-in | Use Case |
|----------|----------|----------|
| Python | `OrderedDict` | LRU without manual DLL |
| Python | `collections.deque` | Double-ended queue |
| Java | `LinkedHashMap` | LRU with accessOrder=true |
| JS | `Map` | Maintains insertion order |

---

### Tactic 5: Invariant Maintenance Checklist

```
After EVERY operation:
□ HashMap size == Linked List size
□ All HashMap keys point to valid nodes
□ Linked List order matches expected logic
□ Dummy head/tail connections intact
□ Capacity constraints respected
```

<!-- back -->
