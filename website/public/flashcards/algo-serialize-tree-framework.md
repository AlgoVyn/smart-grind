## Title: Serialize Tree - Frameworks

What are the structured approaches for serializing and deserializing trees?

<!-- front -->

---

### Framework 1: Preorder Serialization Template

```
┌─────────────────────────────────────────────────────┐
│  PREORDER SERIALIZATION FRAMEWORK                    │
├─────────────────────────────────────────────────────┤
│  Data: Tree with n nodes                             │
│  Output: String with node values and null markers    │
│                                                      │
│  Serialization:                                      │
│  1. If node is null: append NULL_MARKER              │
│  2. Else:                                            │
│     a. Append node value                             │
│     b. Recursively serialize left subtree            │
│     c. Recursively serialize right subtree           │
│  3. Join with DELIMITER                              │
│                                                      │
│  Deserialization:                                    │
│  1. Split string into values array                   │
│  2. Use index pointer (or iterator)                │
│  3. Read next value:                                 │
│     a. If NULL_MARKER: return None                  │
│     b. Else: create node with value                  │
│  4. Recursively build left subtree                   │
│  5. Recursively build right subtree                  │
│  6. Return root node                                  │
│                                                      │
│  Complexity: O(n) time, O(n) space                 │
└─────────────────────────────────────────────────────┘
```

**When to use:** General binary trees, recursive solutions preferred.

---

### Framework 2: Level Order (BFS) Serialization Template

```
┌─────────────────────────────────────────────────────┐
│  LEVEL ORDER SERIALIZATION FRAMEWORK                 │
├─────────────────────────────────────────────────────┤
│  Data: Tree with n nodes                             │
│  Output: String with level-by-level values           │
│                                                      │
│  Serialization:                                      │
│  1. Initialize queue with root                       │
│  2. While queue not empty:                           │
│     a. Dequeue node                                  │
│     b. If node is null: append NULL_MARKER          │
│     c. Else:                                         │
│        - Append node value                           │
│        - Enqueue left child (even if null)          │
│        - Enqueue right child (even if null)         │
│  3. Join with DELIMITER, trim trailing nulls         │
│                                                      │
│  Deserialization:                                    │
│  1. Split string into values array                   │
│  2. Create root from first value                     │
│  3. Initialize queue with root                       │
│  4. For each node in queue:                          │
│     a. Read next two values (left, right)           │
│     b. If not null: create child, enqueue           │
│     c. Attach children to current node              │
│  5. Return root                                      │
│                                                      │
│  Complexity: O(n) time, O(w) space (w = max width)   │
└─────────────────────────────────────────────────────┘
```

**When to use:** Complete trees, iterative solutions, level-order needed.

---

### Framework 3: BST-Specific Serialization Template

```
┌─────────────────────────────────────────────────────┐
│  BST SERIALIZATION FRAMEWORK (No Null Markers)     │
├─────────────────────────────────────────────────────┤
│  Advantage: BST property allows compact encoding     │
│                                                      │
│  Serialization (Preorder):                           │
│  1. If node is null: return                          │
│  2. Append node value                                  │
│  3. Recursively serialize left (values < node)       │
│  4. Recursively serialize right (values > node)      │
│                                                      │
│  Deserialization:                                    │
│  1. Read next value, create root                     │
│  2. Use BST property to determine boundaries:        │
│     - Left subtree: values < root.val                │
│     - Right subtree: values > root.val               │
│  3. Recursively build left and right                 │
│                                                      │
│  Alternative: Use inorder + preorder together          │
│                                                      │
│  Complexity: O(n) time, O(n) space                   │
└─────────────────────────────────────────────────────┘
```

**When to use:** Binary Search Trees only.

<!-- back -->
