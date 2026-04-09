## Backtracking - Word Search: Comparison

When should you use different approaches?

<!-- front -->

---

### DFS vs Trie-based

| Aspect | DFS (Single) | Trie (Multiple) |
|--------|--------------|-----------------|
| **Words** | One at a time | Many at once |
| **Time** | O(m×n×4^L) | O(m×n×4^L + total_chars) |
| **Preprocessing** | None | Build Trie |
| **Use case** | Single word | Word list |

**Winner**: Trie for multiple words, simple DFS for single

---

### When to Use Each

**Simple DFS:**
- Single word search
- Clean implementation
- Interview standard

**Trie-based:**
- Multiple words
- Word Boggle
- Optimize for many queries

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Single word | Simple DFS | Direct |
| Multiple words | Trie | Shared prefix optimization |
| Repeated queries | Preprocess board | Optimize further |

<!-- back -->
