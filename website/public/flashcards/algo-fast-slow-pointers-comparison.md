## Fast-Slow Pointers: Comparison with Alternatives

How do fast-slow pointers compare to other approaches for cycle/middle detection?

<!-- front -->

---

### Cycle Detection: Hash Set vs Fast-Slow

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| **Hash Set** | O(n) | O(n) | Simple, stores nodes | Extra space |
| **Fast-Slow** | O(n) | O(1) | No extra space | Slightly complex |

```python
# Hash set approach
def has_cycle_hash(head):
    visited = set()
    while head:
        if head in visited:
            return True
        visited.add(head)
        head = head.next
    return False

# Fast-slow approach (preferred for space)
def has_cycle_fastslow(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```

**Winner:** Fast-slow for interviews (O(1) space advantage).

---

### Middle Finding: Count-Then-Access vs Fast-Slow

| Approach | Time | Space | Passes |
|----------|------|-------|--------|
| **Two-pass** | O(n) | O(1) | 2 (count, then traverse) |
| **Fast-slow** | O(n) | O(1) | 1 |

```python
# Two-pass
def middle_two_pass(head):
    count = 0
    curr = head
    while curr:
        count += 1
        curr = curr.next
    
    curr = head
    for _ in range(count // 2):
        curr = curr.next
    return curr

# Single pass with fast-slow
def middle_one_pass(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow
```

---

### When to Use Each Pattern

| Problem Type | Best Approach | Why |
|--------------|-------------|-----|
| **Cycle detection** | Fast-slow | O(1) space |
| **Middle element** | Fast-slow | Single pass |
| **kth from end** | Leading pointer | Natural fit |
| **Remove nth** | Two-pass or leading | Flexibility |
| **List length** | Single traversal | Simplest |

---

### Fast-Slow vs Recursion for Linked Lists

| Aspect | Fast-Slow | Recursion |
|--------|-----------|-----------|
| **Space** | O(1) | O(n) - call stack |
| **Reverse list** | Yes (iterative) | Yes (implicit stack) |
| **Palindrome** | Yes (reverse half) | Yes (stack property) |
| **Code clarity** | Iterative, explicit | Clean, but stack risk |

```python
# Recursive palindrome
def is_palindrome_recursive(head):
    self.front = head
    
    def check(node):
        if not node:
            return True
        if not check(node.next):
            return False
        is_equal = self.front.val == node.val
        self.front = self.front.next
        return is_equal
    
    return check(head)
```

**Trade-off:** Recursion cleaner but risks stack overflow. Fast-slow preferred for production.

<!-- back -->
