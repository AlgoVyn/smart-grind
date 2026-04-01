## DFS Postorder: Core Concepts

What is postorder tree traversal and when is it essential?

<!-- front -->

---

### Definition

**Postorder traversal:** Left subtree → Right subtree → Root

```
    4
   / \
  2   6
 / \  / \
1  3 5  7

Postorder: 1, 3, 2, 5, 7, 6, 4
```

---

### Key Properties

| Property | Postorder |
|----------|-----------|
| **Children first** | Both subtrees processed before parent |
| **Deletion order** | Safe for tree deletion (children before parent) |
| **Bottom-up** | Natural for subtree computations |
| **Expression eval** | Postfix (RPN) notation |

---

### When to Use

| Use Case | Why Postorder |
|----------|---------------|
| **Tree deletion** | Delete children before parent |
| **Tree height/depth** | Need children's heights first |
| **Diameter of tree** | Max path through any node |
| **Balanced check** | Compare left/right heights |
| **Expression evaluation** | Postfix notation |
| **Directory size** | Sum file sizes bottom-up |
| **Subtree properties** | Aggregate from children |

---

### Bottom-Up Computation Pattern

```python
def bottom_up_pattern(node):
    if not node:
        return base_case
    
    left_result = bottom_up_pattern(node.left)
    right_result = bottom_up_pattern(node.right)
    
    # Combine children's results
    return combine(left_result, right_result, node.val)
```

---

### Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(n) - visit each node once |
| **Space (recursive)** | O(h) - recursion stack |
| **Space (iterative)** | O(h) - explicit stack |
| **Space (Morris-like)** | Not straightforward for postorder |

<!-- back -->
