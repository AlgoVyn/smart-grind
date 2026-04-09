## String - Palindrome Check (Two Pointers / Reverse): Core Concepts

What are the fundamental concepts behind palindrome checking algorithms?

<!-- front -->

---

### Problem Definition

Determine if a string reads the same forwards and backwards (ignoring case and non-alphanumeric characters in typical interview variants).

**Examples:**
```
Input:  "A man, a plan, a canal: Panama"
Output: true (reads: amanaplanacanalpanama)

Input:  "race a car"
Output: false (reads: raceacar ≠ racaecar)

Input:  "Was it a car or a cat I saw"
Output: true
```

---

### Key Insight: Symmetry Property

The **"aha!" moment**: A palindrome has a line of symmetry at its center. Characters at symmetric positions from the center must be equal.

```
Visualization of symmetry:

  r   a   c   e   c   a   r
  │       │       │       │
  0       2       3       6
  └───────┘       └───────┘
   pair 0          pair 3
      │               │
      └───────┬───────┘
           center

Position mapping: char[i] must equal char[n-1-i]
```

---

### Two Pointers Convergence

Place one pointer at the start and one at the end. Moving them towards each other while comparing characters verifies the palindrome property.

```
Step-by-step convergence:

"racecar" (n=7)

Step 0: r...r  ✓ match, move inward
          ↑   ↑
         left right

Step 1: .a.a.  ✓ match, move inward
           ↑ ↑

Step 2: ..c..  ✓ center reached (left == right)
            ↑
           
Result: True - all pairs matched
```

---

### Character Filtering

Real-world palindrome problems require preprocessing:
- **Convert to lowercase**: Ensures case-insensitive comparison
- **Remove non-alphanumeric**: Handles punctuation and spaces

```
Input:  "A man, a plan, a canal: Panama"
        ↓ lowercase
        "a man, a plan, a canal: panama"
        ↓ remove non-alphanumeric
        "amanaplanacanalpanama"
        ↓ check palindrome
        ✓ reads same forwards/backwards
```

---

### Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Two Pointers** | O(n) | O(1) | **Optimal** - interviews |
| **Reverse & Compare** | O(n) | O(n) | Simple code, not space-constrained |
| **Valid Palindrome II** | O(n) | O(1) | When one deletion allowed |

Where n = length of string.

---

### When to Use This Pattern

- **Basic palindrome validation**: Word or phrase checking
- **Valid palindrome problems**: With alphanumeric filtering
- **Almost palindrome**: Remove at most one character variant
- **String preprocessing**: Step in complex string algorithms
- **Linked list palindrome**: Adapt with fast/slow pointers

---

### Common Pitfalls

| Pitfall | Why It Happens | Solution |
|---------|----------------|----------|
| **Not handling case** | "Racecar" vs "racecaR" | Always `.lower()` or `.toLowerCase()` |
| **Forgetting edge cases** | Empty string is palindrome | Return `True` for empty/single char |
| **Infinite loops** | Pointers not advancing | Always move both pointers after compare |
| **Off-by-one errors** | Wrong loop condition | Use `left < right` not `left <= right` |
| **Non-alphanumeric handling** | Punctuation breaks check | Skip with inner while loops |
| **Integer overflow** | Reversing large number | Convert to string first |

<!-- back -->
