## Title: Trie - Forms

What are the different manifestations of the Trie pattern?

<!-- front -->

---

### Form 1: Standard Trie (Hash-based Children)

Uses dictionary/map for children - memory efficient for sparse alphabets.

| Aspect | Implementation | When to Use |
|--------|---------------|-------------|
| **Children** | `Dict[char, TrieNode]` | Large/unpredictable alphabets |
| **Space** | O(total chars in all words) | Memory-constrained |
| **Access** | O(1) average per char | Dynamic alphabets |

---

### Form 2: Array-based Trie (Fixed Alphabet)

Uses fixed-size array for children - faster for small alphabets.

| Aspect | Implementation | When to Use |
|--------|---------------|-------------|
| **Children** | `TrieNode[26]` or `TrieNode[128]` | Known small alphabet |
| **Space** | O(26 × nodes) | 26 lowercase letters |
| **Access** | O(1) guaranteed | ASCII characters |

---

### Form 3: Compressed Trie (Radix/Patricia)

Compresses single-child chains to save space:

```
Before:  a -> p -> p -> l -> e
After:   "apple" -> (end)
```

| Aspect | Benefit | Trade-off |
|--------|---------|-----------|
| **Space** | Reduced by 30-50% | More complex insertion |
| **Traversal** | Faster for long shared prefixes | Slower deletion |

---

### Form 4: Ternary Search Tree (TST)

Hybrid structure with 3 pointers per node:

```
Node contains:
- char: single character
- left: chars less than current
- mid: chars equal to current (continue word)
- right: chars greater than current
```

| Aspect | Benefit | Trade-off |
|--------|---------|-----------|
| **Space** | O(nodes) not O(nodes × alphabet) | O(m) time vs O(m) for standard |
| **Search** | Similar to binary search tree | Slightly slower |

---

### Form 5: Bitwise Trie

For numeric data (XOR problems, bit manipulation):

```
Children: [0, 1] representing bit values
Height: 31 (for 32-bit integers)
Use: Find max XOR, find closest number
```

<!-- back -->
