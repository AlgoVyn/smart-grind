## Linked List Addition of Numbers: Tactics

What are the tactical strategies and edge cases to handle when adding linked list numbers?

<!-- front -->

---

### Tactic 1: Unequal Length Handling

**Treat missing nodes as having value 0.**

```python
# Both lists may have different lengths
val1 = l1.val if l1 else 0  # Null check before access
val2 = l2.val if l2 else 0

# Advance only if node exists
if l1:
    l1 = l1.next
if l2:
    l2 = l2.next
```

**Why it matters:** Lists like `9→9→9` and `1` require processing all 3 digits.

---

### Tactic 2: Final Carry Handling

**Don't forget to add a new node if carry remains after processing both lists.**

```python
# WRONG: stops too early
while l1 or l2:  # ❌ Misses final carry

# CORRECT: includes carry in loop condition
while l1 or l2 or carry:  # ✅ Handles all cases
```

**Example:** `5 + 5 = 10` needs an extra node for the carry.

---

### Tactic 3: Integer Division by Language

| Language | Integer Division | Modulo |
|----------|------------------|--------|
| Python | `total // 10` | `total % 10` |
| C++ | `total / 10` | `total % 10` |
| Java | `total / 10` | `total % 10` |
| JavaScript | `Math.floor(total / 10)` | `total % 10` |

**Pitfall:** Using `/` in Python gives float; use `//` for integer division.

---

### Tactic 4: Avoid Modifying Input Lists

**Always create new nodes for the result.**

```python
# WRONG: modifies input
l1.val = (l1.val + l2.val + carry) % 10  # ❌ Mutates input

# CORRECT: creates new result
result.next = ListNode((val1 + val2 + carry) % 10)  # ✅ Fresh node
```

---

### Tactic 5: Stack Technique for Forward Order

When digits are stored **forward** (MSB at head), use stacks to reverse processing.

```python
# Push all values onto stacks
while l1:
    stack1.append(l1.val)
    l1 = l1.next

# Process from LSB (stack pop)
while stack1 or stack2 or carry:
    val1 = stack1.pop() if stack1 else 0
    # ... same addition logic
    # Prepend to result: new_node.next = result
```

**Alternative:** Reverse lists first, then add, then reverse result.

---

### Common Pitfalls Checklist

| Pitfall | Solution |
|---------|----------|
| ❌ Forgetting final carry | `while l1 or l2 or carry` |
| ❌ Null pointer on unequal lists | Null check: `l1.val if l1 else 0` |
| ❌ Modifying input lists | Create new nodes for result |
| ❌ Wrong division operator | Use `//` in Python, `/` in C++/Java |
| ❌ Not handling empty lists | Dummy node handles this automatically |

<!-- back -->
