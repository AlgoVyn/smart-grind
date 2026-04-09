## Two Pointers - Expanding from Center: Forms

What are the different variations of the expanding from center pattern?

<!-- front -->

---

### Form 1: Longest Palindromic Substring

```python
def longest_palindrome(s):
    if not s:
        return ""
    
    start, end = 0, 0
    
    for i in range(len(s)):
        # Check both odd and even
        len1 = expand_around_center(s, i, i)      # Odd
        len2 = expand_around_center(s, i, i + 1)  # Even
        max_len = max(len1, len2)
        
        if max_len > end - start:
            # Calculate start from center and length
            start = i - (max_len - 1) // 2
            end = i + max_len // 2
    
    return s[start:end + 1]

def expand_around_center(s, left, right):
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return right - left - 1  # Length of palindrome
```

---

### Form 2: Count Palindromic Substrings

```python
def count_palindromes(s):
    count = 0
    
    for i in range(len(s)):
        # Odd length palindromes
        left, right = i, i
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
        
        # Even length palindromes
        left, right = i, i + 1
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
    
    return count
```

---

### Form 3: Palindrome Partitioning

```python
def partition(s):
    """Partition s into all possible palindrome partitions."""
    result = []
    current = []
    
    def is_palindrome(left, right):
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True
    
    def backtrack(start):
        if start >= len(s):
            result.append(current[:])
            return
        
        for end in range(start, len(s)):
            if is_palindrome(start, end):
                current.append(s[start:end + 1])
                backtrack(end + 1)
                current.pop()
    
    backtrack(0)
    return result
```

---

### Form 4: Valid Palindrome II

```python
def valid_palindrome(s):
    """Check if s can be palindrome after deleting at most 1 char."""
    
    def check(left, right):
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True
    
    left, right = 0, len(s) - 1
    
    while left < right:
        if s[left] != s[right]:
            # Try skipping left or right
            return check(left + 1, right) or check(left, right - 1)
        left += 1
        right -= 1
    
    return True
```

---

### Form Comparison

| Form | Centers | Output | Complexity |
|------|---------|--------|------------|
| Longest | All | Substring | O(n²) |
| Count | All | Number | O(n²) |
| Partition | Recursive | All partitions | O(n × 2^n) |
| Valid II | Converging + expansion | Boolean | O(n) |

<!-- back -->
