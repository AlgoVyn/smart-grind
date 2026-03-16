## Path Sum

**Question:** Does path from root to leaf equal target sum?

<!-- front -->

---

## Answer: Recursive DFS

### Solution
```python
def hasPathSum(root, targetSum):
    if not root:
        return False
    
    # Leaf node check
    if not root.left and not root.right:
        return root.val == targetSum
    
    # Recurse with reduced sum
    remaining = targetSum - root.val
    
    return (hasPathSum(root.left, remaining) or
            hasPathSum(root.right, remaining))
```

### Visual: Path Sum
```
        5
       / \
      4   8
     /   / \
   11   13  4
  / \       \
 7   2       1

Target Sum = 22

Path: 5→4→11→2 = 22 ✓
```

### ⚠️ Tricky Parts

#### 1. When to Check?
```python
# Only check at LEAF nodes
# Not at every node

# If leaf and sum matches → True
# If not leaf → continue checking
```

#### 2. Subtract on the Way
```python
# targetSum - root.val at each step
# When reach leaf, check if remaining equals node value
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| DFS | O(n) | O(h) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Check at every node | Only check at leaf |
| Not subtracting | Reduce target at each step |
| Wrong base case | Handle empty tree |

<!-- back -->
