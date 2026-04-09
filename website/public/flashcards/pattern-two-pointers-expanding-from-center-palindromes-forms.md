## Two Pointers - Expanding From Center (Palindromes): Forms

What are the different variations of expanding from center pattern?

<!-- front -->

---

### Form 1: Longest Palindromic Substring

Find the longest palindromic substring in a string.

```python
def longest_palindrome(s):
    """Return longest palindromic substring."""
    if not s:
        return ""
    
    start, end = 0, 0
    
    for i in range(len(s)):
        # Check both odd and even
        len1 = expand_length(s, i, i)      # Odd
        len2 = expand_length(s, i, i + 1)  # Even
        max_len = max(len1, len2)
        
        if max_len > end - start:
            start = i - (max_len - 1) // 2
            end = i + max_len // 2
    
    return s[start:end + 1]

def expand_length(s, left, right):
    """Return length of palindrome from center."""
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return right - left - 1
```

**LeetCode**: 5. Longest Palindromic Substring

---

### Form 2: Count Palindromic Substrings

Count all palindromic substrings (every valid expansion = one substring).

```python
def count_palindromic_substrings(s):
    """Count all palindromic substrings."""
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

**LeetCode**: 647. Palindromic Substrings

---

### Form 3: Valid Palindrome II

Check if string can be palindrome after deleting at most one character.

```python
def valid_palindrome_ii(s):
    """Check palindrome with at most one deletion."""
    
    def check(left, right):
        """Verify palindrome in range."""
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True
    
    left, right = 0, len(s) - 1
    
    while left < right:
        if s[left] != s[right]:
            # Try skip left or skip right
            return check(left + 1, right) or check(left, right - 1)
        left += 1
        right -= 1
    
    return True  # Already palindrome
```

**LeetCode**: 680. Valid Palindrome II

---

### Form 4: Palindrome Partitioning

Partition string so every substring is a palindrome (uses expansion for precomputation).

```python
def palindrome_partition(s):
    """Return all possible palindrome partitions."""
    n = len(s)
    
    # Step 1: Precompute palindromes using expansion
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
    
    # Step 2: Backtrack to find all partitions
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

**LeetCode**: 131. Palindrome Partitioning

---

### Form 5: Longest Palindromic Subsequence

Note: This is NOT contiguous - uses standard DP, not expansion. Listed for contrast.

```python
def longest_palindromic_subsequence(s):
    """Longest palindromic subsequence (not substring)."""
    n = len(s)
    # dp[i][j] = longest palindromic subsequence in s[i:j+1]
    dp = [[0] * n for _ in range(n)]
    
    for i in range(n):
        dp[i][i] = 1  # Single char
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            if s[i] == s[j]:
                dp[i][j] = 2 + dp[i + 1][j - 1]
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
    
    return dp[0][n - 1]
```

**Key difference**: Subsequence (not necessarily contiguous) requires DP, not expansion.

**LeetCode**: 516. Longest Palindromic Subsequence

---

### Form Comparison

| Form | Contiguous? | Uses Expansion? | Output | Complexity |
|------|-------------|-----------------|--------|------------|
| Longest Substring | ✅ Yes | ✅ Yes | Substring | O(n²) |
| Count Substrings | ✅ Yes | ✅ Yes | Number | O(n²) |
| Valid Palindrome II | ✅ Yes | ⚠️ Hybrid | Boolean | O(n) |
| Partition | ✅ Yes | ✅ Precompute | All partitions | O(n × 2^n) |
| Longest Subsequence | ❌ No | ❌ No | Length | O(n²) |

**Note**: Expanding from center only works for contiguous substrings (substrings), not subsequences.

<!-- back -->
