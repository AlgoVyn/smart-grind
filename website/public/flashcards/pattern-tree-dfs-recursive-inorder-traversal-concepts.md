## Tree DFS - Recursive Inorder Traversal: Core Concepts

What are the fundamental concepts behind inorder traversal?

<!-- front -->

---

### The Core Insight

**Left → Root → Right: The "Middle-Visit" Order**

Inorder traversal visits nodes in a specific sequence: traverse the entire left subtree first, then visit the root node, then traverse the entire right subtree. For Binary Search Trees (BST), this naturally produces values in **sorted ascending order**.

```
        4                    Inorder: 1, 2, 3, 4, 5, 6
       / \
      2   5
     / \   \
    1   3   6
```

**Traversal Steps:**
1. Go left to 2, then left to 1
2. Visit 1 (leaf), back to 2
3. Visit 2, go right to 3
4. Visit 3, back to 4
5. Visit 4, go right to 5
6. Visit 5, go right to 6
7. Visit 6 → Result: [1, 2, 3, 4, 5, 6]

---

### The "Aha!" Moments

| Moment | Insight | Why It Matters |
|--------|---------|----------------|
| **BST Property** | Inorder on BST = sorted output | Enables validation, search, kth smallest |
| **Recursive Structure** | Each subtree follows same pattern | Natural fit for recursion |
| **Base Case** | Null nodes terminate recursion | Essential for tree boundaries |
| **Left Priority** | Always explore left first | Defines the inorder characteristic |
| **Visit Timing** | Root is visited BETWEEN subtrees | Middle position in output |

---

### Inorder vs Other Traversals

```
        A
       / \
      B   C
     / \ / \
    D  E F  G

Preorder (Root → Left → Right):  A, B, D, E, C, F, G
Inorder (Left → Root → Right):   D, B, E, A, F, C, G
Postorder (Left → Right → Root): D, E, B, F, G, C, A
```

| Traversal | Visit Order | Best For |
|-----------|-------------|----------|
| **Preorder** | Root first | Copying tree, prefix expressions |
| **Inorder** | Root middle | BST validation, sorted output |
| **Postorder** | Root last | Deleting tree, postfix expressions |

---

### Why Inorder Works for BSTs

**Binary Search Tree Property:** Left < Root < Right

When you traverse Left → Root → Right on a BST:
- All left subtree values < root value
- Root value < all right subtree values
- Result: Ascending sorted order

```
BST:        5
          /   \
         3     8
        / \   / \
       1   4 6   9

Inorder: 1, 3, 4, 5, 6, 8, 9 (sorted!)
```

---

### Time/Space Complexity Breakdown

| Aspect | Value | Explanation |
|--------|-------|-------------|
| **Time** | O(n) | Visit each of n nodes exactly once |
| **Space** | O(h) | Recursion stack equals tree height |
| **Best Case** | O(log n) space | Balanced tree (h = log n) |
| **Worst Case** | O(n) space | Skewed tree (h = n) |

---

### Expression Trees Context

Inorder traversal of expression trees produces **infix notation**:

```
Expression Tree:        +
                       / \
                      *   4
                     / \
                    2   3

Inorder: 2 * 3 + 4  (needs parentheses: (2 * 3) + 4)
```

<!-- back -->
