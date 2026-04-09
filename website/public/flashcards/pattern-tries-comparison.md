## Trie: Comparison

When should you use Array-based vs HashMap-based Tries?

<!-- front -->

---

### Array vs HashMap Implementation

| Aspect | Array [26] | HashMap {} |
|--------|------------|------------|
| **Access time** | O(1) - direct index | O(1) average - hash lookup |
| **Space per node** | O(26) always | O(k) where k = actual children |
| **Character set** | Fixed (e.g., lowercase 'a'-'z') | Any characters, flexible |
| **Memory overhead** | Higher for sparse tries | Lower for sparse tries |
| **Code complexity** | Simpler | Slightly more complex |
| **Cache efficiency** | Better (contiguous) | Worse (pointer chasing) |

---

### When to Use Each

**Array Implementation - Use when:**
- Character set is small and fixed (26 lowercase letters)
- Speed is critical (direct indexing is faster)
- Many nodes will have multiple children (dense trie)
- Working with standard English words

**HashMap Implementation - Use when:**
- Character set is large or unknown (Unicode, DNA bases, etc.)
- Space efficiency matters (sparse tries)
- Need to support any character dynamically
- Memory is constrained

---

### Space Complexity Analysis

**Array Trie:**
```
Space = O(n × m × 26)  # Each node has 26 slots
```
- Wasteful when trie is sparse (few shared prefixes)
- Predictable memory usage per node

**HashMap Trie:**
```
Space = O(n × m)  # Only store actual children
```
- Efficient for sparse tries
- Less overhead when prefix sharing is minimal
- Better for large alphabets

---

### Trie vs HashMap vs BST

| Data Structure | Search | Prefix | Space | Use Case |
|----------------|--------|--------|-------|----------|
| **HashMap** | O(1) avg | O(n) scan | O(n×m) | Exact match only |
| **BST** | O(m log n) | O(m + k) | O(n×m) | Ordered traversal |
| **Trie (Array)** | O(m) | O(m) | O(n×m×26) | Fast prefix ops |
| **Trie (HashMap)** | O(m) | O(m) | O(n×m) | Flexible chars |

**Winner**: Trie for prefix operations, HashMap for exact match only.

---

### Compressed Trie (Radix Tree)

For even more space savings when chains exist:

```
Normal Trie:              Radix Tree:
    a                       app
    |                       /   \
    p                      le*  lica*
    |
    p
   / \
  l   l
  |   |
  e*  i
      |
      c
      |
      a*

"apple" and "application" share "app"
```

**Compression**: Merge chains of single-child nodes into single edge with string label.

| Aspect | Standard Trie | Radix Tree |
|--------|---------------|------------|
| Space | More nodes | Fewer nodes |
| Insert | Simpler | More complex |
| Traversal | Per char | Per segment |

---

### Binary Trie (for numbers/XOR problems)

For bitwise operations (Maximum XOR, etc.):

```
Insert 5 (101), 2 (010), 7 (111):

           root
          /    \
         0      1
        /        \
       1          0
      /              \
     0                1
    (2)              / \
                    0   1
                   (5) (7)
```

- Each level represents a bit position
- 2 children per node (0 and 1)
- Used for maximum XOR, number prefix problems

<!-- back -->
