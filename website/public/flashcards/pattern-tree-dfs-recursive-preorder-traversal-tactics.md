# Flashcards: Tree DFS Recursive Preorder Traversal - Tactics

What is the first defensive check in preorder traversal?

<!-- front -->

Always handle null/empty root at entry:

```python
if not root:
    return []  # or appropriate default
```

This prevents errors on empty trees and handles edge cases gracefully.

---

### Card 2: Result Collection: What are common patterns for collecting results in recursive preorder?

1. **Closure/Nonlocal**: Define result outside helper function
   ```python
   result = []
   def dfs(node): ...
   ```

2. **Class Member**: Store in instance variable
   ```python
   self.result = []
   ```

3. **Return values**: Less common for preorder
   ```python
   return [node.val] + dfs(left) + dfs(right)
   ```

---

### Card 3: Modifying During Traversal: How do you safely modify node values during preorder traversal?

Modify **before** appending to result if you want modified value:

```python
def preorder_modify(node):
    if not node:
        return
    node.val *= 2      # Modify first
    result.append(node.val)  # Then collect
    dfs(node.left)
    dfs(node.right)
```

---

### Card 4: Passing Additional State: How do you pass additional state (like depth or accumulated sum) in preorder DFS?

Add parameters to the helper function:

```python
def dfs(node, depth, current_sum):
    if not node:
        return
    # Use depth or current_sum here
    dfs(node.left, depth + 1, current_sum + node.val)
    dfs(node.right, depth + 1, current_sum + node.val)
```

---

### Card 5: Early Termination: How can you implement early termination in preorder traversal?

Use a flag or return value to stop recursion:

```python
found = False

def dfs(node):
    nonlocal found
    if not node or found:
        return
    if node.val == target:
        found = True
        return
    dfs(node.left)
    dfs(node.right)
```

<!-- back -->
