## String Matching (Naive / KMP / Rabin-Karp): Core Concepts

What are the fundamental concepts behind efficient string matching algorithms?

<!-- front -->

---

### The Core Insights

**1. Naive Approach Limitation**

The naive algorithm checks each position independently, wasting comparisons when partial matches fail.

```
Text:    ABABDABACDABABCABAB
Pattern: ABABCABAB

Naive approach:
ABABDABACDABABCABAB
ABABCABAB          (match at i=0, mismatch at j=4)
 ABABCABAB         (restart from i=1)
  ABABCABAB        (mismatch at j=0)
   ...

Wastes comparisons - doesn't learn from previous mismatches!
```

**2. KMP's LPS Array Insight**

When a mismatch occurs, we already know some characters matched. The LPS array tells us the longest proper prefix that is also a suffix - so we know exactly how much of the pattern still matches.

```
Text:    ABABDABACDABABCABAB
Pattern: ABABCABAB

Partial match: "ABAB" matches at position i
Mismatch at next char

LPS tells us: "AB" (the suffix) is also the prefix!
So we can shift to align:
ABABDABACDABABCABAB
    ABABCABAB     (align known match "AB")
```

---

### The "Aha!" Moments

| Moment | Insight | Why It Matters |
|--------|---------|----------------|
| **LPS avoids restart** | Don't compare what we already know matches | Saves O(m) per mismatch |
| **Text never backtracks** | i only increases, never decreases | Guaranteed O(n) scan |
| **Pattern pre-knowledge** | Preprocess pattern once, use many times | Amortized efficiency |
| **Proper prefix/suffix** | LPS excludes full string itself | Correct alignment calculation |
| **Fall back chain** | `length = lps[length-1]` handles multiple failures | Builds LPS in O(m) |

---

### LPS Array Deep Dive

**Definition**: `lps[i]` = length of the **longest proper prefix** of `pattern[0..i]` that is also a **suffix** of `pattern[0..i]`.

**"Proper"** means the prefix cannot be the entire string itself.

```
Pattern: "AAAA"

Index 0: "A"       → lps[0] = 0 (no proper prefix)
Index 1: "AA"      → lps[1] = 1 ("A" is prefix AND suffix)
Index 2: "AAA"     → lps[2] = 2 ("AA" is prefix AND suffix)
Index 3: "AAAA"    → lps[3] = 3 ("AAA" is prefix AND suffix)

Result: lps = [0, 1, 2, 3]
```

```
Pattern: "ABABAC"

Index 0: "A"       → lps[0] = 0
Index 1: "AB"      → lps[1] = 0
Index 2: "ABA"     → lps[2] = 1 ("A")
Index 3: "ABAB"    → lps[3] = 2 ("AB")
Index 4: "ABABA"   → lps[4] = 3 ("ABA")
Index 5: "ABABAC"  → lps[5] = 0 (no match)

Result: lps = [0, 0, 1, 2, 3, 0]
```

---

### Rabin-Karp Rolling Hash Concept

Instead of character-by-character comparison, compute a hash for the pattern and rolling hashes for text windows.

**Rolling Hash Formula**:
```
H(s[i..i+m-1]) = (s[i] * base^(m-1) + s[i+1] * base^(m-2) + ... + s[i+m-1]) % prime
```

**Key Insight**: Update hash in O(1) when sliding window:
```
Remove left char:  subtract s[i] * base^(m-1)
Shift remaining:   multiply by base
Add right char:    add s[i+m]
Modulo:            % prime
```

```
Pattern hash: H("ABC")
Window 1:     H("ABD") in text
Window 2:     H("BDA") computed from H("ABD") in O(1)

If hash matches → verify character by character (collision check)
```

---

### Why KMP Text Never Backtracks

```
Text:  ABABABC
Pattern: ABABC

At position i=4, j=4:
- Text: 'A', Pattern: 'C' → mismatch!
- But we matched "ABAB" so far
- lps[3] = 2 ("AB" is longest prefix-suffix)
- j becomes 2, i stays 4
- Compare text[4]='A' with pattern[2]='A' → match!

i never decreased! We just adjusted j using what we already know.
```

---

### Time/Space Complexity Breakdown

| Algorithm | Preprocess | Search | Total Time | Space |
|-----------|------------|--------|------------|-------|
| **Naive** | None | O(n × m) | O(n × m) | O(1) |
| **KMP** | O(m) for LPS | O(n) | O(n + m) | O(m) |
| **Rabin-Karp** | O(m) for hash | O(n) avg | O(n + m) avg | O(1) |

**Why KMP is O(n + m)**:
- Each character in text is compared at most twice (once as `text[i]`, once potentially after j reset)
- LPS computation visits each pattern char at most twice
- No backtracking means linear scan

<!-- back -->
