## String - Palindrome Check (Two Pointers / Reverse): Comparison

When should you use Two Pointers vs Reverse & Compare vs other approaches?

<!-- front -->

---

### Two Pointers vs Reverse & Compare

| Aspect | Two Pointers | Reverse & Compare |
|--------|--------------|-------------------|
| **Code complexity** | Moderate | Simplest |
| **Time complexity** | O(n) | O(n) |
| **Space complexity** | **O(1)** ✓ | O(n) |
| **Interviews** | **Preferred** | Acceptable if space not constrained |
| **In-place check** | ✓ Yes | ✗ Creates copy |
| **Preprocessing needed** | Built-in (skip non-alnum) | Explicit filter step |
| **Early termination** | ✓ Can stop on first mismatch | ✗ Must process entire string |
| **Readability** | Good | **Best** |

**Winner:** Two Pointers for interviews (optimal space), Reverse & Compare for simplicity

---

### Comparison by Character Filtering

**Two Pointers (in-place filtering):**
```python
def is_palindrome_tp(s):
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if left < right:
            if s[left].lower() != s[right].lower():
                return False
            left += 1
            right -= 1
    return True
```
- Time: O(n) - single pass with pointer movement
- Space: O(1) - only two pointers

**Reverse & Compare (explicit filtering):**
```python
def is_palindrome_rev(s):
    filtered = ''.join(c.lower() for c in s if c.isalnum())
    return filtered == filtered[::-1]
```
- Time: O(n) - filter + reverse + compare
- Space: O(n) - filtered string + reversed string

---

### Valid Palindrome II Comparison

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Two Pointers + Helper** | O(n) | O(1) | **Standard solution** |
| **Brute Force (try all deletions)** | O(n²) | O(1) | Never use |
| **DP (LCS approach)** | O(n²) | O(n²) | Overkill for this problem |

**Recommended approach - Two Pointers with Range Check:**
```python
def valid_palindrome_ii(s):
    def is_pal_range(l, r):
        while l < r:
            if s[l] != s[r]:
                return False
            l += 1
            r -= 1
        return True
    
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return (is_pal_range(left + 1, right) or
                   is_pal_range(left, right - 1))
        left += 1
        right -= 1
    return True
```

---

### Palindrome Check: Data Structure Variations

| Data Structure | Best Approach | Time | Space |
|----------------|---------------|------|-------|
| **String/Array** | Two Pointers | O(n) | O(1) |
| **Linked List** | Find mid + Reverse half | O(n) | O(1) |
| **Stack** | Pop and compare | O(n) | O(n) |
| **Deque** | Pop from both ends | O(n) | O(n) |
| **Number** | Reverse half (no overflow) | O(log n) | O(1) |

**Linked List Palindrome:**
```python
def is_palindrome_ll(head):
    # Find middle with fast/slow
    # Reverse second half
    # Compare and restore
    # O(n) time, O(1) space
```

**Number Palindrome (no string conversion):**
```python
def is_palindrome_num(x):
    if x < 0: return False
    if x < 10: return True
    
    # Reverse half to avoid overflow
    reversed_half = 0
    while x > reversed_half:
        reversed_half = reversed_half * 10 + x % 10
        x //= 10
    
    # Even: x == reversed_half, Odd: x == reversed_half // 10
    return x == reversed_half or x == reversed_half // 10
```

---

### Key Trade-offs by Situation

| Situation | Best Choice | Why |
|-----------|-------------|-----|
| **Standard interview** | Two Pointers | Optimal space, demonstrates skill |
| **Quick implementation** | Reverse & Compare | Fastest to write, least bugs |
| **Almost palindrome (one deletion)** | Two Pointers + Range Check | Clean O(n) solution |
| **Linked list** | Find mid + Reverse | O(1) space adaptation |
| **Very large string, limited memory** | Two Pointers | Minimal extra space |
| **Stream/pipeline processing** | Deque/Stack | Natural fit for data structures |
| **Number (no string conversion)** | Reverse half | Avoids overflow, pure math |
| **Longest palindromic substring** | Expand from center | O(n²) optimal for this problem |
| **All palindromic substrings** | Expand from center | Generate all centers |

---

### Interview Decision Tree

```
Palindrome problem?
│
├─→ String/array input?
│   ├─→ Need optimal space? → Two Pointers
│   └─→ Space not constrained? → Reverse & Compare (simpler)
│
├─→ Can delete one char? (Valid Palindrome II)
│   └─→ Two Pointers + Range Check
│
├─→ Linked list input?
│   └─→ Find middle + Reverse half
│
├─→ Number input?
│   └─→ Reverse half mathematically
│
└─→ Find longest palindromic substring?
    └─→ Expand from center
```

<!-- back -->
