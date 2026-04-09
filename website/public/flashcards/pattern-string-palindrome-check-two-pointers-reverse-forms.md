## String - Palindrome Check (Two Pointers / Reverse): Problem Forms

What are the common variations and problem forms for palindrome checking?

<!-- front -->

---

### Form 1: Valid Palindrome (LeetCode 125)

**Problem**: Check if string is palindrome, considering only alphanumeric characters and ignoring cases.

```python
# Input: "A man, a plan, a canal: Panama"
# Output: true
# Explanation: "amanaplanacanalpanama" is palindrome

# Input: "race a car"
# Output: false
# Explanation: "raceacar" is not palindrome

def is_palindrome(s):
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

**LeetCode**: 125 - Valid Palindrome

---

### Form 2: Palindrome Number (LeetCode 9)

**Problem**: Check if integer is palindrome without converting to string.

```python
# Input: 121
# Output: true

# Input: -121
# Output: false (negative not palindrome)

# Input: 10
# Output: false (reads "01")

def is_palindrome_number(x):
    if x < 0:
        return False
    if x < 10:
        return True
    
    # Reverse half to avoid overflow
    reversed_half = 0
    while x > reversed_half:
        reversed_half = reversed_half * 10 + x % 10
        x //= 10
    
    # Even length: x == reversed_half
    # Odd length: x == reversed_half // 10 (middle digit ignored)
    return x == reversed_half or x == reversed_half // 10
```

**Alternative (convert to string - less optimal but acceptable):**
```python
def is_palindrome_number_str(x):
    if x < 0:
        return False
    s = str(x)
    return s == s[::-1]
```

**LeetCode**: 9 - Palindrome Number

---

### Form 3: Valid Palindrome II (LeetCode 680)

**Problem**: Check if string can be palindrome after deleting at most one character.

```python
# Input: "aba"
# Output: true (already palindrome)

# Input: "abca"
# Output: true (delete 'c' or 'b' → "aba" or "aca")

# Input: "abc"
# Output: false (need to delete 2+ characters)

def valid_palindrome_ii(s):
    def is_palindrome_range(left, right):
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True
    
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            # Try removing left or right character
            return (is_palindrome_range(left + 1, right) or
                   is_palindrome_range(left, right - 1))
        left += 1
        right -= 1
    
    return True
```

**LeetCode**: 680 - Valid Palindrome II

---

### Form 4: Palindrome Linked List (LeetCode 234)

**Problem**: Check if singly linked list is palindrome in O(n) time and O(1) space.

```python
# Input: 1 -> 2 -> 2 -> 1
# Output: true

# Input: 1 -> 2
# Output: false

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def is_palindrome_ll(head):
    if not head or not head.next:
        return True
    
    # 1. Find middle using fast/slow pointers
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # 2. Reverse second half
    second_half = reverse(slow.next)
    
    # 3. Compare
    first_half = head
    result = True
    while result and second_half:
        if first_half.val != second_half.val:
            result = False
        first_half = first_half.next
        second_half = second_half.next
    
    # 4. Restore
    slow.next = reverse(slow.next)
    return result

def reverse(head):
    prev, current = None, head
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    return prev
```

**LeetCode**: 234 - Palindrome Linked List

---

### Form 5: Longest Palindromic Substring (LeetCode 5)

**Problem**: Find the longest palindromic substring in a string.

```python
# Input: "babad"
# Output: "bab" (or "aba")

# Input: "cbbd"
# Output: "bb"

def longest_palindrome(s):
    if not s:
        return ""
    
    start = end = 0
    
    for i in range(len(s)):
        # Odd length palindrome (center at i)
        len1 = expand_around_center(s, i, i)
        # Even length palindrome (center between i and i+1)
        len2 = expand_around_center(s, i, i + 1)
        
        max_len = max(len1, len2)
        if max_len > end - start:
            start = i - (max_len - 1) // 2
            end = i + max_len // 2
    
    return s[start:end+1]

def expand_around_center(s, left, right):
    """Expand while characters match."""
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return right - left - 1
```

**LeetCode**: 5 - Longest Palindromic Substring

---

### Form 6: Shortest Palindrome (LeetCode 214)

**Problem**: Add characters in front of string to make it palindrome.

```python
# Input: "aacecaaa"
# Output: "aaacecaaa" (add "aa" at front)

# Input: "abcd"
# Output: "dcbabcd" (add "dcb" at front)

def shortest_palindrome(s):
    # Find longest palindromic prefix
    # Use KMP or rolling hash for efficiency
    # Then reverse suffix and add to front
    
    rev_s = s[::-1]
    # Find where original string matches reversed suffix
    for i in range(len(s)):
        if s.startswith(rev_s[i:]):
            return rev_s[:i] + s
    return ""  # Never reached

# O(n²) naive - can be optimized with KMP to O(n)
```

**LeetCode**: 214 - Shortest Palindrome

---

### Form Variations Summary

| Form | Key Modification | Technique |
|------|------------------|-----------|
| **Valid Palindrome** | Filter non-alphanumeric | Two pointers with skip |
| **Palindrome Number** | No string conversion | Reverse half mathematically |
| **Valid Palindrome II** | Allow one deletion | Two pointers + range check |
| **Palindrome Linked List** | No array access | Find middle + reverse half |
| **Longest Palindromic Substring** | Find max length | Expand from center |
| **Shortest Palindrome** | Add chars to front | Find longest palindromic prefix |
| **Count Palindromic Substrings** | Count all palindromes | Expand from all centers |

---

### Related Problem Forms

| Problem | LeetCode | Difficulty |
|---------|----------|------------|
| Valid Palindrome | 125 | Easy |
| Palindrome Number | 9 | Easy |
| Valid Palindrome II | 680 | Easy |
| Palindrome Linked List | 234 | Easy |
| Longest Palindromic Substring | 5 | Medium |
| Shortest Palindrome | 214 | Hard |
| Palindromic Substrings | 647 | Medium |
| Longest Palindromic Subsequence | 516 | Medium |
| Find Palindrome With Fixed Length | 2217 | Medium |

<!-- back -->
