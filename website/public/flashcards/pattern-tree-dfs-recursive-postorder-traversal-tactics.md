## Tree DFS - Recursive Postorder Traversal: Tactics

What are the advanced techniques and variations for postorder traversal?

<!-- front -->

---

### Tactic 1: Return Values from DFS (Bottom-Up)

Instead of using a shared result list, return computed values from recursive calls:

```python
def tree_height(root):
    """Return height using postorder bottom-up approach."""
    if not root:
        return 0
    
    left_height = tree_height(root.left)    # Get left height
    right_height = tree_height(root.right)  # Get right height
    
    return max(left_height, right_height) + 1  # Combine

def diameter_of_binary_tree(root):
    """Find longest path using postorder."""
    self.max_diameter = 0
    
    def dfs(node):
        if not node:
            return 0
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # Update diameter (path through this node)
        self.max_diameter = max(self.max_diameter, left + right)
        
        return max(left, right) + 1
    
    dfs(root)
    return self.max_diameter
```

**Key insight**: Postorder naturally supports "return values from children" pattern.

---

### Tactic 2: Iterative Postorder (Single Stack)

Avoid recursion stack limits with explicit stack:

```python
def postorder_iterative(root):
    """O(h) space, avoids recursion limit."""
    if not root:
        return []
    
    result = []
    stack = []
    current = root
    last_visited = None
    
    while stack or current:
        if current:
            stack.append(current)
            current = current.left
        else:
            peek = stack[-1]
            # Right exists and not visited yet?
            if peek.right and last_visited != peek.right:
                current = peek.right
            else:
                result.append(peek.val)
                last_visited = stack.pop()
    
    return result
```

---

### Tactic 3: Two-Stack Iterative (Simpler)

Easier to understand but O(n) space:

```python
def postorder_two_stacks(root):
    """Uses two stacks for cleaner logic."""
    if not root:
        return []
    
    stack1 = [root]
    stack2 = []
    
    while stack1:
        node = stack1.pop()
        stack2.append(node)
        
        # Push left first so right is processed first
        if node.left:
            stack1.append(node.left)
        if node.right:
            stack1.append(node.right)
    
    # Pop from stack2 to get postorder
    return [node.val for node in reversed(stack2)]
```

---

### Tactic 4: Delete Tree (Postorder Application)

Delete children before parent:

```python
def delete_tree(root):
    """Delete tree using postorder - children first."""
    if not root:
        return
    
    delete_tree(root.left)   # Delete left subtree
    delete_tree(root.right)  # Delete right subtree
    
    # Now safe to delete current node
    del root
```

---

### Tactic 5: Expression Tree Evaluation

Postorder produces postfix notation for easy stack evaluation:

```python
def evaluate_expression(root):
    """
    Evaluate expression tree.
    Postorder gives: operand operand operator
    """
    if not root:
        return 0
    
    # Leaf node = operand
    if not root.left and not root.right:
        return root.val
    
    # Internal node = operator
    left_val = evaluate_expression(root.left)
    right_val = evaluate_expression(root.right)
    
    if root.val == '+':
        return left_val + right_val
    elif root.val == '-':
        return left_val - right_val
    elif root.val == '*':
        return left_val * right_val
    elif root.val == '/':
        return left_val / right_val
```

---

### Tactic 6: Common Pitfalls & Fixes

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Wrong order** | Processing root before children | Remember: Left → Right → Root |
| **Recursion depth** | Stack overflow on deep trees | Use iterative approach |
| **Forgetting base case** | Infinite recursion | Always check `if not node: return` |
| **Missing children** | Null pointer errors | Check `node.left/right` before accessing |
| **Global result** | Result not accessible | Use nonlocal/self or return values |
| **Modifying while traversing** | Unexpected behavior | Clone or use postorder for deletions |

---

### Tactic 7: Morris Postorder (O(1) Space)

Threaded binary tree for constant space:

```python
def postorder_morris(root):
    """O(1) space using threaded tree."""
    result = []
    dummy = TreeNode(0)
    dummy.left = root
    current = dummy
    
    while current:
        if not current.left:
            current = current.right
        else:
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                predecessor.right = current
                current = current.left
            else:
                predecessor.right = None
                # Add nodes from current.left to predecessor in reverse
                self._add_path(result, current.left, predecessor)
                current = current.right
    
    return result

def _add_path(self, result, from_node, to_node):
    """Helper to add path in reverse order."""
    count = 0
    node = from_node
    while node != to_node:
        result.append(node.val)
        node = node.right
        count += 1
    result.append(to_node.val)
    
    # Reverse the section we just added
    result[-count-1:] = reversed(result[-count-1:])
```

<!-- back -->
