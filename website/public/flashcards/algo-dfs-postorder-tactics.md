## DFS Postorder: Tactics & Tricks

What are the essential tactics for postorder traversal problems?

<!-- front -->

---

### Tactic 1: Return Multiple Values

```python
def subtree_computation(root):
    """
    Return multiple values from subtrees
    """
    def helper(node):
        if not node:
            return (0, 0, True)  # sum, count, is_valid
        
        left_sum, left_count, left_valid = helper(node.left)
        right_sum, right_count, right_valid = helper(node.right)
        
        total_sum = left_sum + right_sum + node.val
        total_count = left_count + right_count + 1
        is_valid = left_valid and right_valid and some_condition
        
        return (total_sum, total_count, is_valid)
    
    return helper(root)
```

---

### Tactic 2: Global/Nonlocal for Additional State

```python
def tree_problem_with_global_state(root):
    """
    Use nonlocal/global for values that don't fit return
    """
    result = [0]  # or some other container
    
    def dfs(node):
        if not node:
            return base_value
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # Update global result based on local computation
        result[0] = max(result[0], left + right + node.val)
        
        # Return value for parent
        return max(left, right) + node.val
    
    dfs(root)
    return result[0]
```

---

### Tactic 3: Early Termination

```python
def postorder_with_early_exit(root):
    """
    Stop traversal once condition met
    """
    found = [False]
    
    def dfs(node):
        if not node or found[0]:
            return
        
        dfs(node.left)
        
        if found[0]:
            return
        
        dfs(node.right)
        
        if found[0]:
            return
        
        # Check condition at this node
        if some_condition(node):
            found[0] = True
    
    dfs(root)
    return found[0]
```

---

### Tactic 4: Iterative Postorder Patterns

```python
def postorder_patterns(root):
    """
    Three main iterative approaches
    """
    # Pattern 1: Two stacks (easier, O(n) space)
    def two_stacks():
        s1, s2 = [root], []
        while s1:
            n = s1.pop()
            s2.append(n)
            if n.left: s1.append(n.left)
            if n.right: s1.append(n.right)
        return reversed(s2)
    
    # Pattern 2: One stack with visited flag (O(h) space)
    def one_stack():
        stack, result = [(root, False)], []
        while stack:
            node, visited = stack.pop()
            if visited:
                result.append(node.val)
            else:
                stack.append((node, True))
                if node.right: stack.append((node.right, False))
                if node.left: stack.append((node.left, False))
        return result
    
    # Pattern 3: Reverse of modified preorder (O(h) space)
    def reverse_preorder():
        # Root-Right-Left, then reverse
        stack, result = [root], []
        while stack:
            n = stack.pop()
            result.append(n.val)
            if n.left: stack.append(n.left)
            if n.right: stack.append(n.right)
        return reversed(result)
```

---

### Tactic 5: Bottom-Up with Caching

```python
def postorder_with_memoization(root):
    """
    Cache results for repeated subtree queries
    """
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def compute(node_id):
        node = get_node_by_id(node_id)  # Assuming unique IDs
        if not node:
            return 0
        
        left = compute(node.left.id if node.left else None)
        right = compute(node.right.id if node.right else None)
        
        return combine(left, right, node.val)
    
    return compute(root.id)
```

<!-- back -->
