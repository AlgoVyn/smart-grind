## Title: KMP Comparison

How does KMP compare to other string matching algorithms?

<!-- front -->

---

### Algorithm Comparison
| Algorithm | Preprocess | Search | Space | Notes |
|-----------|-----------|--------|-------|-------|
| Naive | None | O(nm) | O(1) | Worst case bad |
| Rabin-Karp | O(m) | O(n+m)* | O(1) | *expected, hash collisions |
| KMP | O(m) | O(n+m) | O(m) | Guaranteed linear |
| Boyer-Moore | O(m+σ) | O(n/m) best | O(σ) | Sublinear often |
| Aho-Corasick | O(m) total | O(n+occ) | O(m) | Multiple patterns |
| Suffix Array | O(n log n) | O(m log n) | O(n) | Preprocess text |
| Suffix Automaton | O(n) | O(m) | O(n) | Preprocess text |

---

### Trade-offs
| Factor | KMP | Boyer-Moore |
|--------|-----|-------------|
| Preprocessing | Simpler | More complex |
| Best case | O(n) | O(n/m) |
| Worst case | O(n) | O(nm) |
| Alphabets | Any | Large σ better |
| Pattern length | Any | Long patterns win |

### When to Use
```
Short patterns / binary:  KMP
Long patterns / ASCII:    Boyer-Moore
Multiple patterns:        Aho-Corasick
Many queries, same text:  Suffix structures
DNA / bioinformatics:     Specialized (e.g., bit-parallel)
```

<!-- back -->
