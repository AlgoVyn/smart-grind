## Subtree of Another Tree

**Question:** Check if tree t is subtree of tree s?

<!-- front -->

---

## Answer: Traverse and Match

### Solution
```python
def isSubtree(s, t):
    if not t:
        return True
    if not s:
        return False
    
    # Check current, or left, or right
    if isSame(s, t):
        return True
    
    return isSubtree(s.left, t) or isSubtree(s.right, t)

def isSame(s, t):
    if not s and not t:
        return True
    if not s or not t:
        return False
    
    return (s.val == t.val and 
            isSame(s.left, t.left) and 
            isSame(s.right, t.right))
```

### Visual: Subtree Matching
```
Tree S:               Tree T:
    3                   4
   / \                 /
  4   5               1
 / \
1   2

T is subtree of S (starting at node 4)
```

### ⚠️ Tricky Parts

#### 1. Why Check Both Trees Empty?
```python
# isSame:
# Both null → same
# One null → different
# Both have values → compare recursively
```

#### 2. Order of Checks
```python
# First check current match
# Then check left subtree
# Then check right subtree

# If any is True → t is subtree of s
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Naive | O(n × m) | O(h) |

n = nodes in s, m = nodes in t, h = height

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not checking both null | Handle isSame correctly |
| Only checking one path | Check all three conditions |
| Not recursing properly | Use OR for left/right |

<!-- back -->
