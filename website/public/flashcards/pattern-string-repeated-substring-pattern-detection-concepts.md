## String - Repeated Substring Pattern Detection: Core Concepts

What are the fundamental concepts behind detecting repeated substring patterns?

<!-- front -->

---

### The Core Insight

**If a string `s` can be formed by repeating a substring, then `s` must appear in `(s + s)[1:-1]`**

Why? If `s = t + t + ... + t` (k times), then:
- `s + s = t + t + ... + t + t + t + ... + t` (2k times)
- Removing first and last characters creates overlapping instances
- The original `s` appears starting at position `len(t)` within this overlap

```
Example: s = "abab" (t = "ab", k = 2)

s + s = "abab" + "abab" = "abababab"
         ↑↑↑↑
         original s appears here at position 2

(s + s)[1:-1] = "bababa"
                  ↑↑↑↑
                  s = "abab" found!
```

---

### The "Aha!" Moments

| Moment | Insight | Why It Matters |
|--------|---------|----------------|
| **Concatenation overlap** | s+s creates overlapping pattern instances | Enables elegant O(n) solution |
| **Remove first/last** | `[1:-1]` prevents matching at boundaries | Without this, every string would match itself |
| **KMP failure function** | LPS reveals periodicity | `n % (n - lps) == 0` detects patterns |
| **Length divisibility** | Pattern length must divide n | `n % pattern_len == 0` is required |
| **Proper prefix-suffix** | LPS can't equal n | Must be "proper" (strictly less than n) |

---

### Visual Walkthrough: Concatenation Trick

```
String: s = "abcabc" (pattern = "abc", repeats 2 times)

Step 1: Concatenate
  s + s = "abcabc" + "abcabc" = "abcabcabcabc"

Step 2: Remove first and last character
  (s + s)[1:-1] = "bcabcabcab"
                      ↑↑↑↑↑↑
                      "abcabc" found here!

Step 3: Check containment
  "abcabc" in "bcabcabcab"? YES → Return True
```

For a non-repeating string:
```
String: s = "abcd"

s + s = "abcdabcd"
(s + s)[1:-1] = "bcdabc"
"abcd" in "bcdabc"? NO → Return False
```

---

### Understanding KMP Failure Function

The **Longest Proper Prefix which is also Suffix (LPS)** reveals string periodicity:

```
String: "abcabc"

Prefix function values:
Index:  0  1  2  3  4  5
Char:   a  b  c  a  b  c
LPS:    0  0  0  1  2  3

At index 5: LPS = 3 means "abc" is both prefix and suffix
Pattern length = n - lps = 6 - 3 = 3 ("abc")
Check: 6 % 3 == 0 ✓ → Repeated pattern exists!
```

**Why `n % (n - lps) == 0` works:**
- `n - lps` = length of smallest repeating unit
- If this divides n evenly, the string is composed of complete repetitions
- `lps > 0` ensures there is actually a prefix-suffix match

---

### Why These Work

**Concatenation Trick:**
1. If s = t * k (t repeated k times), then s+s = t * 2k
2. Removing boundaries ensures we look for s in the "middle"
3. The overlap region contains the original pattern

**KMP Approach:**
1. LPS finds the longest border (prefix = suffix)
2. In a periodic string, borders reveal the period
3. The period length = n - lps
4. Pattern exists if period length divides n

---

### When to Apply This Pattern

| Scenario | Example |
|----------|---------|
| String periodicity analysis | DNA sequence repeats "ATATAT" |
| Data compression detection | File has repeating byte patterns |
| Pattern validation | Serial numbers follow repeating format |
| Rhythmic analysis | Music pattern detection |
| Interview problems | LeetCode 459, string manipulation questions |

---

### Time/Space Complexity

| Approach | Time | Space | Explanation |
|----------|------|-------|-------------|
| **Concatenation** | O(n) | O(n) | Built-in string search is optimized |
| **KMP** | O(n) | O(n) | Single pass + prefix array |
| **Brute Force** | O(n²) | O(n) | Try all divisors, build strings |

<!-- back -->
