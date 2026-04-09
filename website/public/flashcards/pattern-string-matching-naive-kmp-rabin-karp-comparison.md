## String Matching (Naive / KMP / Rabin-Karp): Comparison

When should you use Naive, KMP, or Rabin-Karp for string matching?

<!-- front -->

---

### Algorithm Comparison Summary

| Aspect | Naive | KMP | Rabin-Karp |
|--------|-------|-----|------------|
| **Time Complexity** | O(n × m) | O(n + m) | O(n + m) avg, O(n × m) worst |
| **Space Complexity** | O(1) | O(m) | O(1) |
| **Preprocessing** | None | O(m) for LPS | None |
| **Hash Collisions** | N/A | No | Yes (possible) |
| **Multiple Patterns** | Poor | Good | Excellent |
| **Implementation** | Simple | Moderate | Moderate |
| **Best For** | Small strings | Large texts | Multiple patterns |

---

### When to Use Each Algorithm

**Naive - Use when:**
- Pattern and text are small (length < 1000)
- When simplicity is preferred over performance
- One-time searches where preprocessing overhead isn't justified
- Quick implementation needed (interviews, prototypes)

```python
# Perfect for: Small inputs, quick checks
if len(text) < 1000 and len(pattern) < 100:
    return naive_string_match(text, pattern)  # Simple & sufficient
```

**KMP - Use when:**
- Large texts and patterns
- Guaranteed O(n + m) performance is required
- Pattern is searched repeatedly in different texts
- Worst-case guarantees matter (real-time systems)

```python
# Perfect for: Large documents, guaranteed performance
if len(text) > 10000 or len(pattern) > 1000:
    return kmp_string_match(text, pattern)  # Optimal O(n+m)
```

**Rabin-Karp - Use when:**
- Multiple pattern matching needed
- Simple hashing is acceptable
- Pattern length is fixed and relatively short
- Average-case performance is sufficient

```python
# Perfect for: Multiple patterns, fingerprinting
patterns = ["abc", "def", "ghi"]
hashes = [hash_pattern(p) for p in patterns]
# Single scan finds all patterns
```

---

### Performance by Input Size

| Text Length | Pattern Length | Naive | KMP | Rabin-Karp |
|-------------|----------------|-------|-----|------------|
| 100 | 10 | Excellent | Good | Good |
| 1000 | 100 | Good | Excellent | Good |
| 10000 | 1000 | Poor | Excellent | Excellent |
| 100000 | 100 | Poor | Excellent | Excellent |
| 1000000 | 10 | Poor | Excellent | Excellent |

---

### Multiple Pattern Matching Comparison

**Scenario**: Find 100 different patterns in a 1MB text

| Approach | Time | Space | Implementation |
|----------|------|-------|----------------|
| Naive × 100 | O(100 × n × m) | O(1) | Very simple |
| KMP × 100 | O(100 × (n + m)) | O(100 × m) | Moderate |
| Rabin-Karp | O(n + 100 × m) | O(100) | Moderate |
| Aho-Corasick | O(n + total_pattern_length) | O(total_pattern_length) | Complex |

**Winner for multiple patterns**: Rabin-Karp or Aho-Corasick

---

### Hash Collision Impact (Rabin-Karp)

```
Scenario: Hash collision occurs

Text window hash: 12345
Pattern hash: 12345
But: text_window != pattern

Result: False positive!

Mitigation:
1. Character-by-character verification when hashes match
2. Double hashing (two different hash functions)
3. Larger prime modulus (reduces collision probability)
```

| Prime Size | Collision Probability | Recommendation |
|------------|----------------------|----------------|
| 101 | ~1% | Testing only |
| 10^9+7 | ~10^-9 | Good for most cases |
| 10^18+3 | ~10^-18 | Cryptographic level |
| Double hash | ~10^-18 | Maximum safety |

---

### Memory Usage Analysis

| Algorithm | Memory Components | Approximate Bytes |
|-----------|------------------|-------------------|
| Naive | Variables only | O(1) ~ 32 bytes |
| KMP | LPS array | O(m) ~ 4m bytes |
| Rabin-Karp | Hash variables | O(1) ~ 32 bytes |

**Example for pattern length 1000:**
- Naive: ~32 bytes
- KMP: ~4000 bytes (LPS array)
- Rabin-Karp: ~32 bytes

---

### Interview Selection Guide

| Situation | Recommendation | Rationale |
|-----------|----------------|-----------|
| 15-minute coding | Naive | Fast to write, easy to explain |
| 30-minute with follow-ups | KMP | Shows algorithmic depth |
| Multiple pattern question | Rabin-Karp | Natural extension |
| "Optimize this" follow-up | KMP → Aho-Corasick | Progressive improvement |
| Real-time constraints | KMP | Worst-case guarantee |
| Big data / distributed | Rabin-Karp | Parallelizable hashing |

---

### Key Trade-offs by Situation

| Situation | Best Choice | Why |
|-----------|-------------|-----|
| Small inputs (< 1000 chars) | Naive | Overhead not worth it |
| Large text, single pattern | KMP | Optimal O(n+m), guaranteed |
| Multiple patterns | Rabin-Karp | Efficient batch processing |
| Very long pattern | KMP | Better than naive, hash not needed |
| DNA sequences | KMP or Rabin-Karp | Small alphabet, repetitive |
| Unicode text | KMP | Hash base selection harder |
| Security/cryptography | KMP | No collision concerns |
| Stream processing | KMP | No backtracking needed |

<!-- back -->
