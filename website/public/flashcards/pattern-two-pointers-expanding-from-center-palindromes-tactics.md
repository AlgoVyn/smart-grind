## Two Pointers - Expanding From Center (Palindromes): Tactics

What are specific techniques for expanding from center palindrome problems?

<!-- front -->

---

### Tactic 1: Handling Both Center Types

Always check both odd and even centers. Missing even centers causes failures on inputs like "abba":

```python
def find_all_palindromes(s):
    """Tactic: Check both odd and even centers."""
    result = []
    
    for i in range(len(s)):
        # Odd length: single character center
        left, right = i, i
        while left >= 0 and right < len(s) and s[left] == s[right]:
            result.append(s[left:right+1])
            left -= 1
            right += 1
        
        # Even length: center between characters
        left, right = i, i + 1
        while left >= 0 and right < len(s) and s[left] == s[right]:
            result.append(s[left:right+1])
            left -= 1
            right += 1
    
    return result
```

---

### Tactic 2: Return Length vs Substring

Two ways to implement expand: return length (faster) or substring (simpler):

```python
# Option A: Return substring (easier to understand)
def expand_substring(s, left, right):
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return s[left + 1:right]  # Correct for overshoot

# Option B: Return length (avoid string creation)
def expand_length(s, left, right):
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return right - left - 1  # Length of palindrome

# Use length to calculate indices
def get_indices_from_length(center, length):
    start = center - (length - 1) // 2
    end = center + length // 2
    return start, end
```

---

### Tactic 3: Counting Palindromes

Each successful expansion = one palindromic substring:

```python
def count_palindromic_substrings(s):
    """Tactic: Count each valid expansion."""
    count = 0
    
    for i in range(len(s)):
        # Odd: each expansion gives a palindrome
        left, right = i, i
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1  # s[left:right+1] is palindrome
            left -= 1
            right += 1
        
        # Even: each expansion gives a palindrome
        left, right = i, i + 1
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
    
    return count

# Example: "aaa"
# Odd: 3 single + 2 double + 1 triple = 6
# Even: 2 ("aa" at 0-1, "aa" at 1-2)
# Total: 6 palindromic substrings
```

---

### Tactic 4: Valid Palindrome with One Deletion

Combine converging pointers with expansion logic:

```python
def valid_palindrome_with_deletion(s):
    """Tactic: Try both skip options on mismatch."""
    
    def is_palindrome_range(left, right):
        """Check if s[left:right+1] is palindrome."""
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True
    
    left, right = 0, len(s) - 1
    
    while left < right:
        if s[left] != s[right]:
            # Tactic: try skipping left OR skipping right
            return (is_palindrome_range(left + 1, right) or 
                    is_palindrome_range(left, right - 1))
        left += 1
        right -= 1
    
    return True  # Already a palindrome
```

---

### Tactic 5: Precompute Palindromes for Partitioning

Use expansion to build palindrome table for backtracking:

```python
def palindrome_partition(s):
    """Tactic: Precompute all palindromes, then backtrack."""
    n = len(s)
    
    # Step 1: Build palindrome table using expansion logic
    is_pal = [[False] * n for _ in range(n)]
    
    for i in range(n):
        # Odd
        left, right = i, i
        while left >= 0 and right < n and s[left] == s[right]:
            is_pal[left][right] = True
            left -= 1
            right += 1
        
        # Even
        left, right = i, i + 1
        while left >= 0 and right < n and s[left] == s[right]:
            is_pal[left][right] = True
            left -= 1
            right += 1
    
    # Step 2: Backtrack using precomputed table
    result = []
    current = []
    
    def backtrack(start):
        if start >= n:
            result.append(current[:])
            return
        
        for end in range(start, n):
            if is_pal[start][end]:
                current.append(s[start:end+1])
                backtrack(end + 1)
                current.pop()
    
    backtrack(0)
    return result
```

---

### Tactic 6: String Transformation (Manacher's Prep)

Transform to handle odd/even uniformly (for advanced optimization):

```python
def transform_string(s):
    """Tactic: Add separators for uniform handling."""
    # "abc" → "#a#b#c#"
    # This converts even to odd centers
    return '#' + '#'.join(s) + '#'

# Example: "abba" → "#a#b#b#a#"
# Original even center (between 'bb') → now at position 4 ('#')
# All centers are now single character (odd length in transformed)
```

---

### Tactic Comparison

| Tactic | Use When | Benefit |
|--------|----------|---------|
| Both centers | Every palindrome problem | Ensures correctness |
| Return length | Performance critical | Avoids string allocation |
| Counting | Count substrings | Natural fit with expansion |
| Skip on mismatch | One deletion allowed | Elegant two-pointer combo |
| Precompute | Partition problems | Enables efficient backtracking |
| Transform | Implementing Manacher's | Uniform handling |

<!-- back -->
