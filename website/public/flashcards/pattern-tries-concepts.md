## Trie: Core Concepts

What is a Trie and what are its fundamental properties?

<!-- front -->

---

### Definition

A **Trie (Prefix Tree)** is a tree-like data structure where each node represents a character, and paths from root to nodes represent strings or prefixes.

**Key characteristic**: Common prefixes are shared among words, saving space and enabling efficient prefix operations.

---

### Trie Structure Visualization

```
Inserting: "cat", "car", "card", "dog"

        root
       /    \
      c      d
     /        \
    a          o
   / \          \
  t   r*         g*
       \
        d*

* marks end of word

Search "car": Follow c→a→r, found end marker ✓
Search "care": Follow c→a→r, no 'e' child ✗
Prefix "ca": Follow c→a, node exists ✓
```

---

### Node Components

| Component | Type | Purpose |
|-----------|------|---------|
| **children** | Array[26] or HashMap | Links to child nodes for each possible character |
| **is_end_of_word** | Boolean | Marks if this node completes a valid word |

---

### Why Tries? (vs HashMap)

| Operation | HashMap | Trie |
|-----------|---------|------|
| Exact search | O(1) average | O(m) |
| Prefix search | O(n) - scan all keys | O(m) |
| Autocomplete | O(n) | O(m + k) |
| Space (shared prefixes) | O(n × m) | Less when prefixes shared |

**Key insight**: Tries excel at prefix operations that HashMaps cannot do efficiently.

---

### Core Operations

| Operation | Description | Time |
|-----------|-------------|------|
| **Insert** | Add word by creating path from root | O(m) |
| **Search** | Check if word exists | O(m) |
| **StartsWith** | Check if any word has prefix | O(m) |
| **GetAllWords** | DFS from root to collect words | O(n × m) |
| **GetWordsWithPrefix** | DFS from prefix node | O(k × m) |

Where m = word length, n = total words, k = matching words

---

### When to Use Tries

- **Autocomplete systems**: Type-ahead search suggestions
- **Spell checking**: Dictionary implementations
- **Word search in grids**: Efficiently checking multiple words
- **IP routing**: Longest prefix matching
- **DNA sequence analysis**: Bioinformatics applications
- **Any prefix-based queries**: Finding all words starting with X

---

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Forgetting end-of-word flag | Always mark when inserting complete word |
| Case sensitivity | Convert to consistent case before operations |
| Confusing search with startsWith | Search requires end-of-word check; prefix does not |
| Not handling empty string | Decide if "" is a valid word in your use case |
| Memory leaks in C++ | Implement destructor to delete nodes |

<!-- back -->
