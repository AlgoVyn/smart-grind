## Two Pointers - String Reversal: Core Concepts

What are the fundamental principles of string reversal using two pointers?

<!-- front -->

---

### Core Concept

Use **two pointers converging from opposite ends** to swap characters until they meet in the middle.

**Key insight**: Swapping symmetric positions reverses the string in-place with minimal operations.

---

### The Pattern

```
Reverse: "hello"

Step 0: h e l l o
        ↑       ↑
       left   right

Step 1: o e l l h  (swap h and o)
          ↑   ↑

Step 2: o l e l h  (swap e and l)
            ↑
         left=right (done!)

Result: "olleh"
```

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| Reverse String | In-place reversal | Reverse String |
| Reverse Words | Reverse then each word | Reverse Words |
| Rotate Array | Cyclic rotation | Rotate Array |
| Palindrome Check | Compare from ends | Valid Palindrome |
| Reverse Vowels | Only swap vowels | Reverse Vowels |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | n/2 swaps |
| Space | O(1) | In-place swaps |

<!-- back -->
