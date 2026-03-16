## Valid Palindrome

**Question:** Is string palindrome (alphanumeric only)?

<!-- front -->

---

## Answer: Two Pointers

### Solution
```python
def isPalindrome(s):
    left, right = 0, len(s) - 1
    
    while left < right:
        # Skip non-alphanumeric
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        # Compare (case insensitive)
        if s[left].lower() != s[right].lower():
            return False
        
        left += 1
        right -= 1
    
    return True
```

### Visual: Two Pointers
```
s = "A man, a plan, a canal: Panama"

Step 1: left='A', right='a' → equal ✓
Step 2: left=' ', right=' ' → skip ✓
Step 3: left='m', right='m' → equal ✓
...
Continue until left >= right

All match → Return True
```

### ⚠️ Tricky Parts

#### 1. Skipping Non-Alphanumeric
```python
# Must skip both sides independently
# Because non-alphanumeric positions differ

while left < right and not s[left].isalnum():
    left += 1

while left < right and not s[right].isalnum():
    right -= 1
```

#### 2. Case Insensitive
```python
# Use .lower() or .upper() on both
if s[left].lower() != s[right].lower():
    return False
```

#### 3. Alternative: Clean String
```python
def isPalindromeClean(s):
    # Build cleaned string
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    
    # Check palindrome
    return cleaned == cleaned[::-1]
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Two Pointers | O(n) | O(1) |
| Clean + Reverse | O(n) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not skipping | Use while to skip non-alnum |
| Case sensitive | Use .lower() on both |
| Not checking bounds | while left < right |

<!-- back -->
