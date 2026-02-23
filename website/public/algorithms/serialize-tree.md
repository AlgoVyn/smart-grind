# Serialize Tree

## Category
Trees & BSTs

## Description
Convert a binary tree to a string and deserialize back.

## Algorithm Explanation
Tree serialization is the process of converting a binary tree into a string representation that can be easily stored or transmitted, and then reconstructed (deserialized) back into the original tree structure.

**Preorder Traversal Approach:**
1. **Serialization (encode):**
   - Perform preorder traversal (root, left, right)
   - For each node, output its value
   - Use a special marker (like 'None' or '#') for null children
   - This creates a unique string representation

2. **Deserialization (decode):**
   - Parse the string using the same preorder approach
   - When we see a value, create a node
   - When we see the null marker, return None
   - Recursively build left and right subtrees

**Why Preorder?**
- Preorder uniquely identifies a tree when combined with null markers
- Root comes first, making it easy to reconstruct
- Single pass for both encoding and decoding

**Alternative approaches:**
- Level order (BFS): Uses queue, includes null markers for children
- JSON/XML: More readable but less space-efficient

---

## When to Use
Use this algorithm when you need to solve problems involving:
- trees & bsts related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Implementation

```python
class TreeNode:
    """Definition for a binary tree node."""
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Codec:
    """
    Serialize and deserialize a binary tree using preorder traversal.
    """
    
    def serialize(self, root):
        """
        Encodes a binary tree to a single string.
        
        Args:
            root: TreeNode root of the binary tree
        
        Returns:
            String representation of the tree
        
        Time: O(n)
        Space: O(n)
        """
        def preorder(node):
            if node is None:
                return 'null'
            
            # Root, then left, then right
            str(node.val) + ',' + preorder(node.left) + ',' + preorder(node.right)
        
        return preorder(root)
    
    def deserialize(self, data):
        """
        Decodes the encoded data to a binary tree.
        
        Args:
            data: String representation of the tree
        
        Returns:
            TreeNode root of the reconstructed tree
        
        Time: O(n)
        Space: O(n)
        """
        def preorder_build(values):
            val = next(values)
            
            if val == 'null':
                return None
            
            node = TreeNode(int(val))
            node.left = preorder_build(values)
            node.right = preorder_build(values)
            
            return node
        
        # Convert string to iterator
        values = iter(data.split(','))
        return preorder_build(values)


# Alternative: Using list as buffer (more Pythonic)
class CodecList:
    def serialize(self, root):
        """Serialize using preorder with list."""
        def encode(node, buf):
            if node is None:
                buf.append('null')
            else:
                buf.append(str(node.val))
                encode(node.left, buf)
                encode(node.right, buf)
        
        buf = []
        encode(root, buf)
        return ','.join(buf)
    
    def deserialize(self, data):
        """Deserialize using preorder with index."""
        def decode(values):
            val = next(values)
            if val == 'null':
                return None
            node = TreeNode(int(val))
            node.left = decode(values)
            node.right = decode(values)
            return node
        
        return decode(iter(data.split(',')))
```

```javascript
function serialize(root) {
    function preorder(node) {
        if (node === null) return 'null';
        return node.val + ',' + preorder(node.left) + ',' + preorder(node.right);
    }
    return preorder(root);
}

function deserialize(data) {
    const values = data.split(',');
    let index = 0;
    
    function preorderBuild() {
        const val = values[index++];
        if (val === 'null') return null;
        
        const node = { val: parseInt(val), left: null, right: null };
        node.left = preorderBuild();
        node.right = preorderBuild();
        
        return node;
    }
    
    return preorderBuild();
}
```

---

## Example

**Input - Serialize:**
```
    1
   / \
  2   3
     / \
    4   5
```

**Output:**
```
"1,2,null,null,3,4,null,null,5,null,null"
```

**Explanation:**
- Preorder traversal: 1 → 2 → null → null → 3 → 4 → null → null → 5 → null → null
- This uniquely represents the tree structure

**Input - Deserialize:**
```
"1,2,null,null,3,4,null,null,5,null,null"
```

**Output:**
```
Tree structure:
    1
   / \
  2   3
     / \
    4   5
```

**Input - Single Node:**
```
"1,null,null"
```

**Output:**
```
Tree with single node: 1
```

**Input - Empty Tree:**
```
"null"
```

**Output:**
```
None (empty tree)
```

---

## Time Complexity
**O(n)**

---

## Space Complexity
**O(n)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
