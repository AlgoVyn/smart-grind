## Trie - Prefix Tree: Core Concepts

What are the fundamental principles of the Trie (Prefix Tree) data structure?

<!-- front -->

---

### Core Concept

Use **a tree where each node represents a character**, with paths from root to node spelling out prefixes/words for efficient string storage and retrieval.

**Key insight**: Common prefixes share nodes, enabling O(m) lookup where m is string length (independent of number of words).

---

### The Pattern

```
Insert: "cat", "car", "card", "dog"

          root
         /    \
        c      d
       /        \
      a          o
     / \          \
    t   r          g
         \
          d

Structure:
  - Each edge labeled with character
  - Node marked with is_end_word flag
  - Path from root to node = prefix

Search "car":
  root→c→a→r (exists, is_word=True) ✓
  
Search "cap":
  root→c→a→p (p child doesn't exist) ✗
  
Prefix search "ca":
  root→c→a (node exists, has children) ✓
```

---

### Node Structure

| Component | Purpose |
|-----------|---------|
| **children** | Map char → child node |
| **is_end** | True if node completes a word |
| **count** | (Optional) Prefix frequency |

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Autocomplete** | Suggest completions | Typeahead |
| **Spell Check** | Word validation | Dictionary |
| **IP Routing** | Longest prefix match | Router tables |
| **Word Search II** | Find words in board | Word Search II |
| **Prefix Count** | Words with prefix | Count Prefixes |
| **Auto-suggest** | Search suggestions | Search engine |

---

### Complexity

| Operation | Time | Space |
|-----------|------|-------|
| **Insert** | O(m) | O(m × alphabet) |
| **Search** | O(m) | O(1) |
| **Prefix check** | O(m) | O(1) |
| **Delete** | O(m) | O(1) |

**m = length of word/string**

<!-- back -->
