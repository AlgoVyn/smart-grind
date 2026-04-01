## Reverse Linked List: Comparison

How do different linked list reversal approaches compare?

<!-- front -->

---

### Iterative vs Recursive

| Aspect | Iterative | Recursive |
|--------|-----------|-----------|
| Space | O(1) | O(n) stack |
| Time | O(n) | O(n) |
| Code | More verbose | Elegant |
| Large lists | Safe | Stack overflow risk |
| Intuitive | Less | More (divide & conquer) |

---

### When to Use Each Approach

| Scenario | Recommended | Why |
|----------|-------------|-----|
| Production code | Iterative | No stack risk |
| Interview clarity | Recursive | Cleaner code |
| Memory constrained | Iterative | O(1) space |
| Small lists | Either | Both fine |
| Need original | Copy first | Or use stack |

---

### Variation Complexity

| Variation | Time | Space | Key Technique |
|-----------|------|-------|---------------|
| Full reverse | O(n) | O(1) | Three pointers |
| Reverse [m,n] | O(n) | O(1) | Position tracking |
| K-group reverse | O(n) | O(1) | Multiple passes |
| Alternate k | O(n) | O(1) | Toggle flag |
| Palindrome check | O(n) | O(1)* | Reverse half |

*Can be O(1) if not restoring, O(n) if restoring

---

### Common Interview Patterns

| Pattern | Problem | Solution Approach |
|---------|---------|-------------------|
| Basic reverse | Reverse linked list | Three pointer iteration |
| Partial reverse | Reverse II | Dummy + position tracking |
| Pattern merge | Reorder list | Find middle + reverse + merge |
| Grouping | Reverse k-group | Count + multiple reverses |
| Two pointer | Palindrome | Reverse + compare |

---

### Error Prevention

| Common Bug | Prevention |
|------------|------------|
| Lose rest of list | Always save `next` first |
| Infinite loop | Ensure `curr` advances |
| Return wrong head | Track `prev` as new head |
| Cycle | Set `head.next = None` after |
| Null pointer | Check `head` and `head.next` |

```python
# Defensive template
def reverse_safe(head):
    if not head or not head.next:
        return head
    
    prev, curr = None, head
    while curr:
        nxt = curr.next  # 1. Save
        curr.next = prev # 2. Reverse
        prev = curr      # 3. Advance prev
        curr = nxt       # 4. Advance curr
    
    return prev
```

<!-- back -->
