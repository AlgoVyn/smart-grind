## String - Palindrome Check: Core Concepts

What are the fundamental principles for checking if a string is a palindrome?

<!-- front -->

---

### Core Concept

Use **two pointers converging from both ends** to compare characters, or reverse and compare, to verify if a string reads the same forwards and backwards.

**Key insight**: A palindrome's first half mirrors the second half. We only need to check up to the middle.

---

### The Pattern

```
Check if "A man, a plan, a canal: Panama" is palindrome:

After cleaning (lowercase, alphanumeric only):
"amanaplanacanalpanama"

Two pointer approach:
  left                    right
    ↓                      ↓
    a m a n a p l a n a c a n a l p a n a m a
    ↑                                     ↑
    a == a ✓
    
    left++                 right--
      ↓                    ↓
      m == m ✓
      
Continue until pointers meet or cross...
All match! ✓ Palindrome
```

---

### Comparison of Approaches

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Two pointers** | O(n) | O(1) | In-place, efficient |
| Reverse & compare | O(n) | O(n) | Simple implementation |
| Recursive | O(n) | O(n) | Educational, not practical |

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Valid Palindrome** | Basic check | Valid Palindrome |
| **Longest Palindrome** | Longest substring | Longest Palindromic Substring |
| **Palindrome Partition** | Min cuts | Palindrome Partitioning |
| **Valid Palindrome II** | Remove one char | Valid Palindrome II |
| **Count Palindromes** | Count substrings | Count Palindromic Substrings |

---

### Complexity

| Approach | Time | Space |
|----------|------|-------|
| Two pointers | O(n) | O(1) |
| Reverse string | O(n) | O(n) |
| Recursive | O(n) | O(n) stack |

<!-- back -->
