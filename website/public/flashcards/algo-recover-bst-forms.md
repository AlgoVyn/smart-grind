## Recover BST: Forms & Variations

What are the different forms and variations of BST recovery problems?

<!-- front -->

---

### Form 1: Two Nodes Swapped (Standard)

```python
# Standard case: exactly two nodes swapped
# Solution: Find two violations in inorder, swap values

# Example:
# Original inorder: [1, 2, 3, 4, 5, 6, 7]
# Swapped:         [1, 2, 6, 4, 5, 3, 7]
#                    ↑ first  ↑ second

recover_tree(root)  # Swaps values of first and second
```

---

### Form 2: Two Adjacent Nodes Swapped

```python
# Adjacent swap produces only one violation
# [1, 2, 4, 3, 5, 6, 7]
#        ↑
#    4 > 3 (only one violation)

# Same algorithm works:
# - first violation: prev=4, curr=3 → first=4, second=3
# - No second violation, but second already set

# Algorithm handles this naturally
```

---

### Form 3: K Nodes Swapped (Multiple Violations)

```python
def recover_tree_k_swapped(root, k):
    """
    Recover BST when k nodes are randomly shuffled.
    More complex - need to collect all nodes and sort.
    """
    # Collect all nodes
    nodes = []
    def collect(node):
        if not node:
            return
        collect(node.left)
        nodes.append(node)
        collect(node.right)
    
    collect(root)
    
    # Sort node values
    values = sorted(n.val for n in nodes)
    
    # Assign correct values back in inorder
    def assign(node, iterator):
        if not node:
            return
        assign(node.left, iterator)
        node.val = next(iterator)
        assign(node.right, iterator)
    
    assign(root, iter(values))
```

---

### Form 4: Validate BST (Check Only)

```python
def is_valid_bst(root):
    """
    Check if tree is valid BST.
    Related problem: detect if recovery needed.
    """
    prev = None
    valid = True
    
    def inorder(node):
        nonlocal prev, valid
        if not node or not valid:
            return
        
        inorder(node.left)
        
        if prev and prev.val >= node.val:
            valid = False
        prev = node
        
        inorder(node.right)
    
    inorder(root)
    return valid
```

---

### Form 5: Recover with Additional Constraint

```python
def recover_tree_constrained(root, constraint):
    """
    Recover BST where swapped nodes have a constraint.
    E.g., one node is known, or nodes are in specific subtrees.
    """
    # Modified search based on constraint
    
    if constraint == "root_involved":
        # One of swapped nodes is root
        # Check root and its children specially
        pass
    
    elif constraint == "known_node":
        # One swapped node is known
        # Find the other by searching
        pass
    
    # Otherwise use standard algorithm
    return recover_tree(root)
```

<!-- back -->
