## String - Palindrome Check: Framework

What is the complete code template for palindrome checking?

<!-- front -->

---

### Framework 1: Two Pointer Palindrome Check

```
┌─────────────────────────────────────────────────────┐
│  PALINDROME CHECK - TWO POINTER TEMPLATE               │
├─────────────────────────────────────────────────────┤
│  1. Initialize left = 0, right = n - 1              │
│  2. While left < right:                             │
│     a. Skip non-alphanumeric from left                │
│        While left < right and not isalnum(s[left]):  │
│            left += 1                                 │
│     b. Skip non-alphanumeric from right               │
│        While left < right and not isalnum(s[right]):│
│            right -= 1                                  │
│     c. If lowercase(s[left]) != lowercase(s[right]): │
│        - Return False                                 │
│     d. left += 1, right -= 1                          │
│  3. Return True                                       │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Valid Palindrome

```python
def is_palindrome(s):
    """Check if s is palindrome (alphanumeric only, case-insensitive)."""
    left, right = 0, len(s) - 1
    
    while left < right:
        # Skip non-alphanumeric
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        # Compare (case-insensitive)
        if s[left].lower() != s[right].lower():
            return False
        
        left += 1
        right -= 1
    
    return True
```

---

### Implementation: Valid Palindrome II (Remove One)

```python
def valid_palindrome_ii(s):
    """Check if palindrome with at most one character deletion."""
    
    def check(left, right):
        """Helper to check substring is palindrome."""
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True
    
    left, right = 0, len(s) - 1
    
    while left < right:
        if s[left] != s[right]:
            # Try removing left or right
            return check(left + 1, right) or check(left, right - 1)
        left += 1
        right -= 1
    
    return True
```

---

### Implementation: Simple String Reverse

```python
def is_palindrome_simple(s):
    """Simple version using string reverse."""
    # Filter alphanumeric and lowercase
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]
```

---

### Key Pattern Elements

| Element | Purpose | Handling |
|---------|---------|----------|
| Skip non-alnum | Ignore punctuation/space | While loop advance |
| Lowercase compare | Case-insensitive | `.lower()` |
| Valid Palindrome II | One deletion allowed | Recursive check both options |

<!-- back -->
