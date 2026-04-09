## Two Pointers - String Comparison with Backspaces: Core Concepts

What are the fundamental concepts behind comparing strings with backspace characters?

<!-- front -->

---

### The Core Insight

**Backward Processing Advantage**: Backspaces delete characters to their LEFT, making right-to-left iteration the natural and efficient direction.

```
String: "ab#c"
Forward:  a → b → # (deletes b) → c  = "ac"
                    ↑
               processes deletion after seeing char

Backward: c (valid) → # (mark skip) → b (skipped) → a (valid)
         ↑                              ↑
    valid char first              already marked for skip
```

**Why it works**: When going backward, we encounter the backspace BEFORE the character it deletes (in forward order), allowing us to count skips before encountering characters that need skipping.

---

### Skip Counter Mechanism

The skip counter tracks how many characters to skip due to backspaces:

```
String: "a##b#c#d"
Index:   0  1  2  3  4  5  6  7
Char:    a  #  #  b  #  c  #  d

Processing from right (index 7):
- 'd': valid, counter=0 → return 7
- '#': counter=1 → continue
- 'c': counter>0, counter=0 → skip, continue
- '#': counter=1 → continue
- 'b': counter>0, counter=0 → skip, continue
- '#': counter=1 → continue
- '#': counter=2 → continue
- 'a': counter>0, counter=1 → skip, counter still >0
- end: return -1 (exhausted)

Valid chars from right: [d] → empty after 'a' is skipped
```

---

### Problem Variants

| Variant | Modification | Handling |
|---------|--------------|----------|
| **Standard `#`** | Single backspace char | `char == '#'` |
| **Multiple backspaces** | Consecutive `#` | Counter increments multiple times |
| **Leading backspaces** | `#` at start | No effect (nothing to delete) |
| **Empty strings** | All chars deleted | Both return -1, strings equal |
| **Different backspace chars** | `<` or `←` | Change condition in skip check |

---

### Natural Termination Conditions

```
Both valid indices:
s = "ab#c"  →  valid chars: [c, a]
t = "ad#c"  →  valid chars: [c, a]
              ↓
         c == c ✓
         a == a ✓
         both -1 → return True

One exhausted early:
s = "ab#c"  →  valid chars: [c, a]
t = "abc"   →  valid chars: [c, b, a]
              ↓
         c == c ✓
         a != b ✗ → return False
```

**Key termination check**: `i < 0 && j < 0` means both exhausted (equal), mismatch in exhaustion state means unequal.

---

### Why Not Forward Processing?

Forward processing requires building intermediate results:

```
Forward approach (O(n) space):
"ab#c"  →  build: ['a'] → ['a','b'] → ['a'] → ['a','c'] = "ac"
Requires stack or list to handle deletions

Backward approach (O(1) space):
"ab#c"  →  from right: c (valid) → # (skip next) → skip b → a (valid)
Just need a counter, no storage needed
```

**Space complexity tradeoff**: Forward = O(n) space (build strings), Backward = O(1) space (pointers only).

---

### Complexity Analysis

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n + m) | Each character visited at most once per string |
| **Space** | O(1) | Only pointers and counter, no extra storage |
| **Comparisons** | O(min(n, m)) | Stop early on mismatch |
| **Pointer moves** | O(n + m) | Each index decremented exactly once |

<!-- back -->
