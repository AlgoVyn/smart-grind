## Stack - Simulation / Backtracking Helper: Core Concepts

What are the fundamental principles of stack-based backtracking simulation?

<!-- front -->

---

### Core Concept

**The call stack can be simulated explicitly**, giving complete control over:
- What's stored (custom state)
- When to backtrack (explicit pop)
- Memory usage (bounded by explicit stack)
- Pause/resume capability (stop and continue later)

---

### The "Aha!" Moments

**1. Stack stores complete state**
Each element contains ALL information needed to continue from that point.

```python
# State includes node AND accumulated value
stack = [(node, current_sum, depth)]
```

**2. Explicit backtracking**
Pop = return from recursive call. No magic, just stack operations.

```python
node = stack.pop()  # Equivalent to returning from recursion
```

**3. No recursion overhead**
Avoid function call overhead and system stack limits.

**4. Custom state**
Store exactly what's needed, nothing more:
- Just the node? For simple traversal
- Node + accumulated values? For path problems
- Node + path history? For reconstruction

**5. Pause and resume**
Can stop mid-traversal and continue later (not possible with pure recursion).

---

### Key Differences: Recursive vs Iterative

| Aspect | Recursive DFS | Iterative Stack |
|--------|---------------|-----------------|
| **Stack management** | Automatic (call stack) | Explicit (you control it) |
| **State storage** | Local variables | Must be packed into stack element |
| **Backtracking** | Automatic on return | Manual via pop |
| **Stack overflow** | Risk on deep trees | Controlled (heap allocated) |
| **Debugging** | Stack trace available | Manual state inspection |
| **Pause/Resume** | Not possible | Possible |

---

### When to Use Stack Simulation

**Use when:**
- Recursion depth limits are a concern (very deep trees)
- Stack overflow risk in production code
- Need explicit control over state
- Want to pause/resume traversal
- Language has limited recursion depth

**Use recursion when:**
- Code clarity matters most
- Tree depth is bounded and shallow
- Quick interview solution needed
- Problem naturally fits recursion (e.g., tree definitions)

---

### Traversal Order Control

**Push order determines visit order (LIFO):**

```python
# Pre-order (root, left, right)
stack.append(right)  # Processed second
stack.append(left)   # Processed first

# If you want post-order iteratively:
# Option 1: Two stacks
# Option 2: Track visited flag
```

---

### Complexity

| Aspect | Time | Space |
|--------|------|-------|
| Tree traversal | O(n) | O(h) - h = height |
| Graph traversal | O(V + E) | O(V) |
| Backtracking | O(b^d) | O(d) - d = depth |

**Space advantage over recursion:** Heap-allocated stack can grow larger than system call stack.

<!-- back -->
