## Huffman Encoding: Core Concepts

What is Huffman coding and how does it achieve optimal prefix-free compression?

<!-- front -->

---

### Fundamental Definition

**Huffman coding** creates optimal prefix-free codes minimizing expected code length for given symbol frequencies.

| Aspect | Value |
|--------|-------|
| **Time** | O(n log n) |
| **Space** | O(n) |
| **Optimality** | Minimizes Σ(frequency × code_length) |
| **Property** | Prefix-free (no code is prefix of another) |

---

### Key Insight: Greedy Merge

```
Frequencies: a:5, b:9, c:12, d:13, e:16, f:45

Step 1: Merge a(5) + b(9) = 14
Heap: c:12, d:13, 14, e:16, f:45

Step 2: Merge c(12) + d(13) = 25
Heap: 14, e:16, 25, f:45

Step 3: Merge 14 + e(16) = 30
Heap: 25, 30, f:45

Step 4: Merge 25 + 30 = 55
Heap: 45, 55

Step 5: Merge 45 + 55 = 100

Tree:       100
          /     \
        45(f)   55
               /   \
             25    30
            / \    /  \
          12  13  14  16
          c   d  / \   e
                5   9
                a   b
```

---

### Prefix-Free Property

**Why Huffman codes are prefix-free:**
- Codes are paths from root to leaves
- No leaf is ancestor of another leaf
- Therefore no code can be prefix of another

**Benefit:** Unambiguous decoding without delimiters.

---

### Optimality Proof

**Key observations:**
1. Most frequent symbols get shortest codes (greedy property)
2. Two least frequent symbols have same-length codes differing only in last bit
3. Subproblem: merge two least frequent, recurse

**Result:** No other prefix-free code has smaller expected length.

<!-- back -->
