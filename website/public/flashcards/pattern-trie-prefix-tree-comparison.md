## Trie - Prefix Tree: Comparison

When should you use different Trie implementations and how do they compare to alternatives?

<!-- front -->

---

### Array vs HashMap Implementation

| Aspect | Array [26] | HashMap {} |
|--------|------------|------------|
| **Access time** | O(1) - direct index | O(1) avg - hash lookup |
| **Space per node** | O(26) = 26 pointers always | O(k) = actual children only |
| **Character set** | Fixed (lowercase 'a'-'z') | Any characters, flexible |
| **Memory usage** | Higher for sparse tries | Lower for sparse tries |
| **Code simplicity** | Simpler | Slightly more complex |
| **Cache efficiency** | Better (contiguous array) | Worse (pointer chasing) |

---

### When to Use Each

**Array-Based Trie - Use when:**
- Character set is small and fixed (26 lowercase letters)
- Performance is critical (direct indexing is fastest)
- Trie will be dense (many shared prefixes)
- Working with standard English words

**HashMap-Based Trie - Use when:**
- Character set is large or unknown (Unicode, DNA, mixed case)
- Space efficiency matters (sparse tries)
- Need dynamic character support
- Memory is constrained

---

### Space Complexity Analysis

**Array Trie:**
```
Space = O(n × m × 26)  # Each node has 26 slots
```
- Wasteful when trie is sparse
- Predictable per-node memory
- Cache-friendly

**HashMap Trie:**
```
Space = O(n × m)  # Only store existing children
```
- Efficient for sparse tries
- Better for large alphabets
- Less memory overhead

---

### Trie vs Alternatives

| Data Structure | Search | Prefix Query | Space | Best For |
|----------------|--------|--------------|-------|----------|
| **HashMap** | O(1) avg | O(n) scan all keys | O(n×m) | Exact match only |
| **BST** | O(m log n) | O(m + k) | O(n×m) | Ordered words |
| **Trie (Array)** | O(m) | O(m) | O(n×m×26) | Fast prefix ops |
| **Trie (HashMap)** | O(m) | O(m) | O(n×m) | Flexible chars |

**Winner**: Trie for prefix operations, HashMap for simple existence checks.

---

### Compressed Trie (Radix Tree / Patricia Trie)

Merge single-child chains for space optimization:

```
Standard Trie:         Compressed Trie:
    a                      app
    |                     /   \
    p                   le*   ly*
    |
    p
   / \
  l   l
  |   |
  e*  y*
```

**Compression**: Combine chains of single-child nodes.

| Aspect | Standard | Compressed |
|--------|----------|------------|
| Nodes | More | Fewer |
| Insert | Simple | Complex |
| Memory | Higher | Lower |
| Traversal | Per char | Per segment |

---

### Binary Trie (for Numbers/XOR)

For bitwise problems like Maximum XOR:

```
Insert 5 (101), 2 (010), 7 (111):

         root
        /    \
       0      1
      /          \
     1            0
    /                \
   0                  1
  (2)               /   \
                   0     1
                  (5)   (7)
```

- 2 children per node: 0 and 1
- 32 levels for integers
- Enables O(32) = O(1) XOR maximization

<!-- back -->
