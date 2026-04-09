# Flashcards: Tree DFS Recursive Preorder Traversal - Forms

## Card 1: N-ary Tree Adaptation
---
front:
How do you adapt preorder traversal for N-ary trees (trees with any number of children)?
back:
Replace left/right with iteration over all children:

```python
def nary_preorder(root):
    if not root:
        return []
    result = [root.val]          # Visit root
    for child in root.children:  # Traverse all children
        result.extend(nary_preorder(child))
    return result
```

Pattern: Visit node, then recursively visit each child.

---

## Card 2: Collecting at Specific Depth
---
front:
How do you collect values only at a specific depth/level using preorder?
back:
Pass depth as a parameter and check before collecting:

```python
def collect_at_depth(root, target_depth):
    result = []
    
    def dfs(node, current_depth):
        if not node:
            return
        if current_depth == target_depth:
            result.append(node.val)
            return  # No need to go deeper
        dfs(node.left, current_depth + 1)
        dfs(node.right, current_depth + 1)
    
    dfs(root, 0)
    return result
```

---

## Card 3: Path Recording Variation
---
front:
How do you record the full path from root to each node in preorder?
back:
Maintain a path list and copy it at leaves:

```python
def find_paths(root):
    paths = []
    
    def dfs(node, current_path):
        if not node:
            return
        current_path.append(node.val)
        if not node.left and not node.right:  # Leaf
            paths.append(list(current_path))
        dfs(node.left, current_path)
        dfs(node.right, current_path)
        current_path.pop()  # Backtrack
    
    dfs(root, [])
    return paths
```

---

## Card 4: Conditional Traversal
---
front:
How do you skip certain subtrees based on a condition in preorder?
back:
Add condition before recursive calls:

```python
def conditional_preorder(root):
    result = []
    
    def dfs(node):
        if not node:
            return
        result.append(node.val)
        # Only traverse left if condition met
        if node.left and node.left.val > 0:
            dfs(node.left)
        # Always traverse right
        dfs(node.right)
    
    dfs(root)
    return result
```

---

## Card 5: Bottom-Up Result Construction
---
front:
How can you use return values instead of shared state in preorder?
back:
Return constructed lists from recursive calls:

```python
def preorder_return(root):
    if not root:
        return []
    
    result = [root.val]                        # Root
    result += preorder_return(root.left)       # Left subtree
    result += preorder_return(root.right)      # Right subtree
    
    return result
```

Note: Less efficient (O(n²) due to list concatenation) but demonstrates pure functional approach.

---
