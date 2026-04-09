## String - Anagram Check: Core Concepts

What are the fundamental principles for checking if two strings are anagrams?

<!-- front -->

---

### Core Concept

Use **character frequency counting or sorting** to verify that two strings contain exactly the same characters with the same frequencies.

**Key insight**: Anagrams have identical character counts - sorting both strings should yield the same result, or frequency maps should be equal.

---

### The Pattern

```
Check if "listen" and "silent" are anagrams:

Method 1: Frequency Count
  "listen": l=1, i=1, s=1, t=1, e=1, n=1
  "silent": s=1, i=1, l=1, e=1, n=1, t=1
  
  Maps are equal! ✓

Method 2: Sorting
  "listen" sorted: "eilnst"
  "silent" sorted: "eilnst"
  
  Equal! ✓

Method 3: Single Array (optimized)
  For "listen": increment counts
  For "silent": decrement counts
  All counts should be 0
```

---

### Comparison of Approaches

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Frequency Map** | O(n) | O(k) | Unicode, general use |
| **Array (26 chars)** | O(n) | O(1) | Lowercase English |
| **Sorting** | O(n log n) | O(1) or O(n) | Simple, no extra space |

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Valid Anagram** | Check if anagram | Valid Anagram |
| **Group Anagrams** | Group by anagram | Group Anagrams |
| **Find Anagram** | Find in string | Find All Anagrams |
| **Check Permutation** | Is one a permutation | Check Permutation |

---

### Complexity

| Approach | Time | Space |
|----------|------|-------|
| Frequency array | O(n) | O(1) (fixed 26) |
| Hash map | O(n) | O(k) (unique chars) |
| Sorting | O(n log n) | O(n) or O(1) |

<!-- back -->
