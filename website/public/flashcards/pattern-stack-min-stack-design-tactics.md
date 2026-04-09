## Stack - Min Stack Design: Tactics

What are the key implementation tactics and edge cases for Min Stack?

<!-- front -->

---

### Tactic 1: Correct Minimum Calculation

**Rule**: Always use `min(val, current_min)` when pushing.

```python
# WRONG - doesn't preserve historical minimum
current_min = val  # Just stores current value!

# WRONG - compares with value, not stored min
current_min = min(val, self.stack[-1][0])  # Compares with top value!

# CORRECT - compares with stored minimum
current_min = min(val, self.stack[-1][1])  # Compares with stored min
```

---

### Tactic 2: Handle Duplicates with <=

**Critical**: Use `<=` for min stack push condition, not `<`.

```python
# CORRECT - handles duplicates
if not self.min_stack or val <= self.min_stack[-1]:
    self.min_stack.append(val)

# Why? When we pop a duplicate:
# Stack: [5, 3, 3]  MinStack: [5, 3, 3]
# After pop():       MinStack: [5, 3]  ← still correct!

# WRONG - misses duplicates
if not self.min_stack or val < self.min_stack[-1]:  # < not <=
    self.min_stack.append(val)

# Problem: Stack: [5, 3, 3]  MinStack: [5, 3]
# After pop():              MinStack: [5]  ← wrong! should be [5, 3]
```

---

### Tactic 3: Pair Indexing

**Remember which index is which in the tuple.**

```python
# Convention: (value, minimum)
self.stack.append((val, current_min))

# Accessing:
top_val = self.stack[-1][0]   # First element: value
get_min = self.stack[-1][1]   # Second element: minimum
```

---

### Tactic 4: Empty Stack Handling

**First element is special** - it's always its own minimum.

```python
current_min = min(val, self.stack[-1][1]) if self.stack else val

# Or more explicit:
if self.stack:
    current_min = min(val, self.stack[-1][1])
else:
    current_min = val  # First element
```

---

### Tactic 5: Choosing the Right Approach

| Scenario | Best Approach | Why |
|----------|--------------|-----|
| General purpose | Pair storage | Simpler, one data structure |
| Mostly decreasing | Two stacks | Saves space (fewer min entries) |
| Mostly increasing | Pair storage | Same space, cleaner code |
| Thread-safe needed | Pair storage | Easier to lock one structure |

---

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Using `<` instead of `<=` | Always use `<=` for min stack push |
| Comparing with top value | Compare with `stack[-1][1]` not `[0]` |
| Not handling empty stack | Check `if self.stack` for first element |
| Wrong return value | `top()` returns `[0]`, `getMin()` returns `[1]` |

<!-- back -->
