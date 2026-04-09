## Linked List - In-place Reversal: Comparison

When should you use different approaches for linked list reversal problems?

<!-- front -->

---

### Iterative vs Recursive Reversal

| Aspect | Iterative (Recommended) | Recursive |
|--------|------------------------|-----------|
| **Space** | O(1) - 3 pointers | O(n) - call stack |
| **Time** | O(n) | O(n) |
| **Code clarity** | Slightly more verbose | Elegant, mathematical |
| **Stack overflow risk** | ✅ None | ❌ Risk for long lists |
| **Interview preference** | ✅ Preferred | Use if asked |
| **Base case handling** | Explicit initialization | Implicit in recursion |

**Rule of thumb:** Use iterative unless interviewer specifically asks for recursive solution.

---

### Full Reversal vs Sublist Reversal

| Aspect | Full Reversal | Sublist Reversal |
|--------|---------------|------------------|
| **Scope** | Entire list | Positions left to right |
| **Dummy node** | Optional | ✅ Required |
| **Implementation** | Simple 3-pointer loop | Move-to-front technique |
| **Time** | O(n) | O(n) |
| **Space** | O(1) | O(1) |
| **Edge cases** | Empty/single node | left=1, left=right |

```python
# Full reversal - straightforward
def reverse_full(head):
    prev, current = None, head
    while current:
        next_node = current.next
        current.next = prev
        prev, current = current, next_node
    return prev

# Sublist reversal - needs dummy
def reverse_sublist(head, left, right):
    dummy = ListNode(0, head)  # REQUIRED
    prev_left = dummy
    for _ in range(left - 1):
        prev_left = prev_left.next
    
    current = prev_left.next
    for _ in range(right - left):
        next_node = current.next
        current.next = next_node.next
        next_node.next = prev_left.next
        prev_left.next = next_node
    
    return dummy.next
```

---

### Three Reversal Techniques Compared

| Technique | Use Case | Implementation | Key Insight |
|-----------|----------|----------------|-------------|
| **Standard 3-pointer** | Full list reversal | Flip `next` to `prev` | Save `next` before overwrite |
| **Move-to-front** | Sublist reversal | Move nodes after anchor | Dummy node essential |
| **Recursive rewire** | When recursion required | `head.next.next = head` | Disconnect with `head.next = null` |

---

### Space Complexity Comparison

| Method | Space | When to Use |
|--------|-------|-------------|
| Iterative 3-pointer | O(1) | ✅ **Always preferred** |
| Recursive | O(n) | Only when explicitly asked |
| Stack-based (explicit) | O(n) | Never for in-place problems |
| Array copy + reverse | O(n) | ❌ Defeats the purpose |

**Interview tip:** If problem asks for "in-place" or "without extra space", iterative is the only correct answer.

---

### When to Use What Pattern

```
Problem description?
├── "Reverse a linked list" (entire)
│   └── Standard 3-pointer iterative
│   └── Time: O(n), Space: O(1)
│
├── "Reverse between position X and Y"
│   └── Dummy node + move-to-front
│   └── Time: O(n), Space: O(1)
│
├── "Reverse every k nodes"
│   └── Reverse k nodes, connect groups
│   └── Time: O(n), Space: O(1)
│
├── "Check if palindrome"
│   └── Find middle → reverse second half → compare
│   └── Time: O(n), Space: O(1)
│
├── "Reorder list" or "rearrange"
│   └── Find middle → reverse second half → merge alternately
│   └── Time: O(n), Space: O(1)
│
└── "Swap nodes in pairs"
    └── Iterative pairwise exchange
    └── Time: O(n), Space: O(1)
```

---

### Decision Matrix

| Situation | Approach | Space | Why |
|-----------|----------|-------|----- |
| Standard interview | Iterative 3-pointer | O(1) | Clean, optimal, no surprises |
| "Do it recursively" asked | Recursive rewire | O(n) | Show you can do both |
| Sublist specified | Dummy + move-to-front | O(1) | Handles position edge cases |
| k-group reversal | Iterative with group tracking | O(1) | Connect reversed segments |
| Palindrome check | Find middle + reverse + compare | O(1) | No extra data structures |
| Long list (10^5+ nodes) | Iterative only | O(1) | Avoid stack overflow |

---

### Common Pitfalls Comparison

| Pitfall | Iterative | Recursive | Sublist |
|---------|-----------|-----------|---------|
| **Losing list** | ❌ Save `next` first | N/A | ❌ Save before extraction |
| **Wrong return** | ❌ Return `current` (null) | Return `new_head` from recursion | Return `dummy.next` |
| **Stack overflow** | ✅ None | ❌ Long lists fail | ✅ None |
| **Position errors** | N/A | N/A | ❌ Off-by-one in loops |
| **Cycle creation** | ❌ If `next` not saved | ❌ If `head.next` not set to null | ❌ If links crossed |

---

### Iterative vs Recursive: Code Comparison

```python
# ITERATIVE - O(1) space
def reverse_iterative(head):
    prev = None
    current = head
    while current:
        next_node = current.next   # Save
        current.next = prev        # Flip
        prev = current             # Advance
        current = next_node        # Advance
    return prev

# RECURSIVE - O(n) space
def reverse_recursive(head):
    # Base case
    if not head or not head.next:
        return head
    
    # Reverse rest first
    new_head = reverse_recursive(head.next)
    
    # Rewire current node
    head.next.next = head        # Next points back
    head.next = None             # Disconnect forward
    
    return new_head
```

**Key difference:** Iterative tracks state with variables; recursive uses call stack to remember nodes.

<!-- back -->
