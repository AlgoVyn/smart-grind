## Permutations: Core Concepts

What are the fundamental principles of generating and working with permutations?

<!-- front -->

---

### Core Concept

A permutation is an arrangement of all elements of a set in a specific order.

For n distinct elements, there are **n!** (n factorial) permutations.

---

### Mathematical Properties

| Property | Formula | Example (n=3) |
|----------|---------|---------------|
| Count | n! | 3! = 6 |
| Next permutation | Lexicographic successor | 123 → 132 |
| Rank of permutation | Lehmer code | 213 is rank 3 |
| Unrank | Construct from rank | rank 4 → 231 |

---

### Lexicographic Ordering

Permutations in dictionary order:

```
123 < 132 < 213 < 231 < 312 < 321

Pattern to find next:
1. Find rightmost ascent: position i where a[i] < a[i+1]
2. Find smallest element to the right of i that's > a[i]
3. Swap them
4. Reverse everything to the right of i
```

---

### Visual: Next Permutation

```
Current: 1  4  3  2
              ↑
         rightmost ascent at index 0 (1 < 4)

Step 1: Find rightmost ascent → index 0 (value 1)

Step 2: Find smallest > 1 to the right → value 2 at index 3

Step 3: Swap → 2  4  3  1

Step 4: Reverse after index 0 → 2  1  3  4

Result: 2134 is next permutation
```

---

### Cycle Decomposition

Every permutation can be written as disjoint cycles.

```
Permutation p: [2, 0, 3, 1]  (0→2, 1→0, 2→3, 3→1)

Cycles: (0 2 3 1) - one 4-cycle

Another: [1, 0, 3, 2]
Cycles: (0 1)(2 3) - two 2-cycles
```

**Sign of permutation**: (-1)^(n - number of cycles)

<!-- back -->
