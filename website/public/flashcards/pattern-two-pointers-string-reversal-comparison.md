## Two Pointers - String Reversal: Comparison

When should you use two-pointer reversal versus built-in methods?

<!-- front -->

---

### Two Pointer vs Built-in Reverse

| Aspect | Two Pointer | Built-in (s[::-1]) |
|--------|-------------|-------------------|
| **Time** | O(n) | O(n) |
| **Space** | O(n) for char array | O(n) for new string |
| **In-place** | Yes (for mutable) | No |
| **Code length** | Longer | Shorter |
| **Interview** | Demonstrates skill | Acceptable if not in-place required |

**Winner**: Two-pointer for interviews when asked for in-place or algorithm implementation

---

### When to Use Two-Pointer Reversal

**Use when:**
- In-place modification required
- Interview demonstrating algorithm knowledge
- Rotating arrays (three-reverse pattern)
- Selective reversal (vowels only, etc.)
- Building understanding of two-pointer technique

**Use built-in when:**
- Production code (cleaner, tested)
- Not space constrained
- Quick scripting
- Readability is priority

---

### Comparison with Other Reversal Methods

| Method | Space | Time | Best For |
|--------|-------|------|----------|
| **Two Pointer** | O(1)* | O(n) | In-place, interviews |
| **Built-in slice** | O(n) | O(n) | Pythonic code |
| **Reverse iterator** | O(1) | O(n) | Iteration only |
| **Recursion** | O(n) | O(n) | Educational |
| **Stack** | O(n) | O(n) | LIFO operations |

*For mutable strings; O(n) for Python due to char array

---

### Decision Tree

```
Need to reverse string/array?
├── Yes → In-place required?
│   ├── Yes → TWO POINTER
│   └── No → Interview setting?
│       ├── Yes → TWO POINTER (demonstrates skill)
│       └── No → Built-in (cleaner code)
└── No → Different operation
```

---

### Key Trade-offs

| Consideration | Two Pointer Wins | Built-in Wins |
|-------------|-----------------|---------------|
| Interview demonstration | ✓ | - |
| In-place capability | ✓ | - |
| Production code clarity | - | ✓ |
| Code brevity | - | ✓ |
| Algorithm understanding | ✓ | - |

<!-- back -->
