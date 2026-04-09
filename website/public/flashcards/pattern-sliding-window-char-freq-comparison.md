## Sliding Window - Character Frequency: Comparison

When should you use character frequency matching versus other string comparison approaches?

<!-- front -->

---

### Frequency Map vs Sorting

| Aspect | Frequency Map | Sorting |
|--------|---------------|---------|
| **Time** | O(n) | O(n log n) |
| **Space** | O(k) | O(n) or O(1) |
| **Implementation** | More code | Simpler |
| **Sliding window** | Natural | Requires resort |
| **Multiple patterns** | Reuse counter | Re-sort each time |

**Winner**: Frequency map for sliding window, sorting for one-off comparison

```python
# Sorting approach (simpler but slower for sliding)
def is_anagram_sort(s, t):
    return sorted(s) == sorted(t)
```

---

### When to Use Character Frequency Matching

**Use when:**
- Checking anagram/permutation relationship
- Sliding window over strings
- Multiple comparison targets
- Case-insensitive matching
- Character order doesn't matter

**Don't use when:**
- Order matters (use string equality)
- Single one-off comparison (sorting might be simpler)
- Very large alphabet with sparse usage (use hash sets)

---

### Comparison with Other String Patterns

| Pattern | Time | Space | Best For |
|---------|------|-------|----------|
| **Frequency Map** | O(n) | O(k) | Anagrams, permutations |
| **Sorting** | O(n log n) | O(n) | One-off comparison |
| **Rolling Hash** | O(n) | O(1) | Pattern matching |
| **KMP** | O(n + m) | O(m) | Single pattern search |
| **Trie** | O(n × m) | O(n × m) | Multiple patterns |

---

### Decision Tree

```
String comparison problem?
├── Yes → Order matters?
│   ├── Yes → DIRECT COMPARISON
│   └── No → Multiple windows?
│       ├── Yes → FREQUENCY MAP + SLIDING
│       └── No → Single check?
│           ├── Yes → SORTING (simpler)
│           └── No → FREQUENCY MAP
└── No → Different pattern
```

---

### Key Trade-offs

| Consideration | Frequency Map Wins | Sorting Wins |
|-------------|-------------------|--------------|
| Sliding window efficiency | ✓ | - |
| Implementation simplicity | - | ✓ |
| Multiple patterns | ✓ | - |
| One-off check | - | ✓ |
| Large alphabet | - | ✓ |

<!-- back -->
