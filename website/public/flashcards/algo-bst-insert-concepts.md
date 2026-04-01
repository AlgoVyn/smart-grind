## BST Insert: Core Concepts

What is BST insertion, how does it maintain the BST invariant, and what are its performance characteristics?

<!-- front -->

---

### Fundamental Definition

Binary Search Tree (BST) insertion adds a new node while maintaining the **BST property**:  
For every node, all left descendants are smaller, all right descendants are larger.

```
Insert 5 into:
      8              8
     / \            / \
    3   10    →    3   10
   / \            / \
  1   6          1   6
                     /
                    5
```

---

### BST Properties

| Property | Description |
|----------|-------------|
| **Left subtree** | All keys < node.key |
| **Right subtree** | All keys > node.key |
| **No duplicates** | Or handle via count/left convention |
| **Inorder traversal** | Yields sorted sequence |

---

### Insertion Process

1. Start at root
2. Compare key with current node
3. If smaller, go left; if larger, go right
4. Repeat until reaching empty child (null/None)
5. Create new node at that position

**No rebalancing in basic BST** → can degrade to linked list

---

### Complexity Analysis

| Case | Height | Insert Time | Space |
|------|--------|-------------|-------|
| **Best** | O(log n) | O(log n) | O(1) extra |
| **Average** | O(log n) | O(log n) | O(1) extra |
| **Worst** | O(n) | O(n) | O(n) stack |

**Worst case:** Inserting sorted data → skewed tree

---

### When to Use

| ✅ Use BST Insert | ❌ Don't Use |
|-------------------|--------------|
| Dynamic ordered data | Data already sorted (degrades) |
| Need inorder traversal | Frequent deletions (complex) |
| Range queries expected | Guaranteed O(log n) required |
| Self-balancing variant available | Simple array suffices |

<!-- back -->
