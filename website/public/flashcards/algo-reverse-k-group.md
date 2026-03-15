## Reverse K-Group

**Question:** Compare time and space complexity of recursive vs iterative approaches.

<!-- front -->

---

## Reverse K-Group Complexity

### Comparison Table
| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| **Recursive** | O(n) | O(n/k) | Stack space for each group |
| **Iterative** | O(n) | O(1) | Pointer manipulation only |

### 💡 The Trick
Recursive approach uses **O(n/k)** stack space (one frame per group of k nodes).

### Iterative Approach Steps
```python
def reverse_k_group(head, k):
    dummy = ListNode(0)
    dummy.next = head
    prev_tail = dummy
    
    while True:
        # Check if k nodes exist
        curr = prev_tail
        for _ in range(k):
            curr = curr.next
            if not curr:
                return dummy.next
        
        # Reverse k nodes
        new_group_start = prev_tail.next
        next_group = curr.next
        
        # Reverse logic here...
        
        # Connect groups
        prev_tail.next = curr
        prev_tail = new_group_start
```

### ✅ Recommendation
Use **iterative** for O(1) space complexity.

<!-- back -->
