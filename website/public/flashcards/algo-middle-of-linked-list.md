## Middle of Linked List

**Question:** How do you find the middle node using slow and fast pointers?

<!-- front -->

---

## Finding Middle Node

### The Two-Pointer Technique
```python
def middle_node(head):
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow
```

### How It Works
```
For odd length (5 nodes): 1→2→3→4→5
                         ↑        ↑
                        slow    fast (stops at node 5)
                        Returns node 3 ✓

For even length (4 nodes): 1→2→3→4
                           ↑     ↑
                          slow  fast (fast.next is None)
                          Returns node 3 (second middle)
```

### Variations

**Return first middle (for even):**
```python
while fast.next and fast.next.next:
    slow = slow.next
    fast = fast.next.next
```

### 💡 Key Insight
- **Odd length:** fast reaches last node → slow at middle
- **Even length:** fast reaches None → slow at second middle

### Time: O(n), Space: O(1)

<!-- back -->
