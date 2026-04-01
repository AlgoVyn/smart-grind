## Title: Trie - Core Concepts

What is a Trie and when should it be used?

<!-- front -->

---

### Definition
A tree data structure (Prefix Tree) used for efficient string operations. Provides O(m) time for insertion, searching, and prefix operations, where m is the length of the key.

| Aspect | Details |
|--------|---------|
| **Insert** | O(m) |
| **Search** | O(m) |
| **Prefix Search** | O(m) |
| **Space** | O(ALPHABET_SIZE × m × n) |

---

### Node Structure

Each node in a Trie represents a character or prefix and contains:

| Component | Type | Description |
|-----------|------|-------------|
| **children** | Map/Dict | Edges to child nodes (char -> node) |
| **is_end** | Boolean | Marks if this node completes a word |
| **word** | String | Stores complete word (optional, for retrieval) |

---

### Prefix Sharing

Tries share common prefixes to save space:

```
Words: "apple", "app", "application"

        root
         |
         a
         |
         p
         |
         p
       / | \
      l  e   l
      |      |
      e      i
      |      |
     (end)   c
             |
             a
             |
             t
             |
            (end)
```

The prefix "app" is stored only once for all three words.

---

### Search Types

| Search Type | Description | Time |
|-------------|-------------|------|
| **Exact Match** | Find complete word | O(m) |
| **Prefix Search** | Check if prefix exists | O(m) |
| **Autocomplete** | Find all words with prefix | O(m + k) |

---

### When to Use

- **Autocomplete Systems:** Suggest words based on a prefix
- **Spell Checkers:** Check if a word exists in a dictionary
- **IP Routing:** Look up routing prefixes in network tables
- **Word Games:** Like Boggle, finding all words in a grid
- **Phone Directory:** Search contacts by name prefix

<!-- back -->
