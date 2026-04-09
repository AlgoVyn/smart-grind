## Backtracking - Parentheses Generation: Core Concepts

What are the fundamental principles of valid parentheses generation?

<!-- front -->

---

### Core Concept

**Build valid strings by maintaining balance: never add more closing than opening parentheses, and stop when we've used all n pairs.**

**Decision Tree for n=2:**
```
        ""
       /   \
      "("   X (can't start with ')')
     /   \
   "(("  "()"
   /  \    /  \
"(()" X  "()(" X
  |        |
"(())"   "()()"
```

---

### The Pattern

```
Two constraints ensure validity:
1. Can add '(' if count < n
2. Can add ')' only if close < open

This guarantees:
- Never more ')' than '(' at any point
- Exactly n pairs when done
- All combinations are valid
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Generate parentheses | Valid combinations | LeetCode 22 |
| Catalan number problems | Count valid structures | Trees, paths |
| Balanced expressions | Valid syntax | Code generation |

---

### Complexity

| Aspect | Value | Notes |
|--------|-------|-------|
| Count | Catalan(n) | 1, 2, 5, 14, 42... |
| Time | O(4^n / √n) | Asymptotic for Catalan |
| Space | O(n) | Recursion depth |

**Catalan numbers:** C(n) = (2n)! / ((n+1)! × n!)

<!-- back -->
