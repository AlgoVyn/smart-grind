## Two Pointers - Fixed Separation (Nth Node from End): Comparison

How does the fixed separation pattern compare to alternative approaches?

<!-- front -->

---

### Approach Comparison

| Approach | Time | Space | Passes | Best For |
|----------|------|-------|--------|----------|
| **Fixed Separation** | O(L) | O(1) | 1 | Single-pass, space-constrained |
| **Two-Pass (Length)** | O(L) | O(1) | 2 | Clarity, avoiding pointer complexity |
| **Stack/Array Storage** | O(L) | O(L) | 1 | Multiple queries, random access |
| **Recursion** | O(L) | O(L) | 1 | Functional style, backtracking needs |

L = length of linked list

---

### Fixed Separation vs Length Calculation

**Fixed Separation (Single Pass):**
```python
def find_nth_single_pass(head, n):
    fast = slow = head
    for _ in range(n):
        fast = fast.next
    while fast:
        fast = fast.next
        slow = slow.next
    return slow
```
- **Pros:** One pass, elegant, O(1) space
- **Cons:** Tricky off-by-one, harder to debug

**Length Calculation (Two Pass):**
```python
def find_nth_two_pass(head, n):
    length = 0
    curr = head
    while curr:
        length += 1
        curr = curr.next
    curr = head
    for _ in range(length - n):
        curr = curr.next
    return curr
```
- **Pros:** Clear logic, easy to understand, same complexity class
- **Cons:** Two traversals, slightly more code

---

### When to Choose Each Approach

| Scenario | Recommended Approach | Why |
|----------|---------------------|-----|
| Interview/clean code | Two-pass | Easier to explain and verify |
| Production/performance | Fixed separation | Single pass, slightly faster |
| Space is critical | Either | Both O(1) space |
| Multiple nth queries | Stack/Array | O(L) space, O(1) per query |
| Need recursion practice | Recursion | Good for understanding backtracking |

---

### Stack/Array Approach

```python
def find_nth_with_stack(head, n):
    stack = []
    curr = head
    while curr:
        stack.append(curr)
        curr = curr.next
    # Pop n-1 times
    for _ in range(n - 1):
        stack.pop()
    return stack.pop()
```

**Best for:**
- Multiple queries on same list
- Need to access various positions from end
- When O(L) space is acceptable

---

### Recursive Approach

```python
def find_nth_recursive(head, n):
    def helper(node):
        if not node:
            return 0, None
        count, result = helper(node.next)
        count += 1
        if count == n:
            return count, node
        return count, result
    
    _, result = helper(head)
    return result
```

**Best for:**
- Understanding recursion depth
- Problems requiring backtracking
- Not recommended for production (stack overflow risk)

---

### Summary Decision Tree

```
Finding nth from end:
├─ Is space limited to O(1)?
│  ├─ YES → Prefer clarity?
│  │  ├─ YES → Two-pass (length calc)
│  │  └─ NO → Fixed separation (single pass)
│  └─ NO → Multiple queries?
│     ├─ YES → Stack/Array storage
│     └─ NO → Two-pass for simplicity
└─ Learning recursion?
   └─ YES → Recursive approach (educational)
```

<!-- back -->
