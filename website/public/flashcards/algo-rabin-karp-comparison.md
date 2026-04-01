## Rabin-Karp: Comparison

How do different string matching algorithms compare?

<!-- front -->

---

### Rabin-Karp vs Alternatives

| Algorithm | Preprocessing | Matching | Space | Multiple Patterns |
|-----------|--------------|----------|-------|-------------------|
| Naive | None | O(n×m) | O(1) | O(k×n×m) |
| Rabin-Karp | O(m) | O(n+m)* | O(1) | O(n+m) |
| KMP | O(m) | O(n) | O(m) | O(k×(n+m)) |
| Boyer-Moore | O(m+|Σ|) | O(n/m) best | O(|Σ|) | Hard |
| Aho-Corasick | O(m×k) | O(n) | O(m×k) | O(n+m) |

*Average case; worst O(n×m) with verification

---

### When to Use Each

| Scenario | Best Algorithm | Why |
|----------|---------------|-----|
| Single pattern, guaranteed | KMP | O(n+m) deterministic |
| Multiple patterns | Aho-Corasick or RK | Efficient batch processing |
| Large alphabet | Boyer-Moore | Good skip heuristic |
| Plagiarism detection | Rabin-Karp | Fingerprinting windows |
| Short patterns | Naive | Low overhead |

---

### Rolling Hash Alternatives

| Hash Type | Update | Collision | Use Case |
|-----------|--------|-----------|----------|
| Polynomial | O(1) | Moderate | Standard RK |
| Cyclic (CRC) | O(1) | Low | Checksums |
| Cryptographic | Slow | Negligible | Security |

---

### Performance Characteristics

```
Pattern length vs Algorithm:

m < 5:      Naive (low overhead)
m < 20:     KMP (guaranteed linear)
m < 100:    Rabin-Karp (fast average)
m > 100:    Boyer-Moore (good skips)

Text length vs Algorithm:

n < 1000:   Any algorithm works
n < 10^6:   KMP or RK
n > 10^6:   Boyer-Moore or optimized RK
```

---

### Rabin-Karp Specializations

| Variant | Modification | Use Case |
|---------|--------------|----------|
| Double hash | Two mods | High reliability |
| 2D | Nested rolling | Image processing |
| Multiple | Batch hashing | Plagiarism detection |
| Fingerprint | Store all hashes | Document similarity |

**Recommendation**: Use single hash for competitive programming (with verification), double hash for production.

<!-- back -->
