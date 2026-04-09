## String - Palindrome Check (Two Pointers / Reverse): Tactics

What are practical tactics for solving palindrome checking problems?

<!-- front -->

---

### Tactic 1: Trace Through with a Small Example

**Manually simulate the algorithm to verify understanding:**

```
Input: s = "A man, a plan, a canal: Panama"

Step-by-step execution:

left=0 (A), right=29 (a)
  'A'.lower() == 'a'.lower() → True ✓
  left=1, right=28

left=1 ( ), right=28 (m)  
  Skip space at left → left=2 (m)
  'm' == 'm' → True ✓
  left=3, right=27

left=3 (a), right=27 (n)
  'a' != 'n'... wait, let's check
  
Actually right=27 is 'n' from "Panama"
String: "A man, a plan, a canal: Panama"
Index:   0123456789...
         ↑         ↑
         A         a (case insensitive match!)

Continue this trace until left >= right...
Final result: True ✓
```

---

### Tactic 2: Debug with Pointer State Visualization

**Print pointer positions during execution:**

```python
def is_palindrome_debug(s):
    left, right = 0, len(s) - 1
    
    while left < right:
        print(f"\n--- Iteration ---")
        print(f"left={left} ('{s[left]}'), right={right} ('{s[right]}')")
        
        # Skip non-alphanumeric
        while left < right and not s[left].isalnum():
            print(f"  Skip left: s[{left}]='{s[left]}' (non-alnum)")
            left += 1
        
        while left < right and not s[right].isalnum():
            print(f"  Skip right: s[{right}]='{s[right]}' (non-alnum)")
            right -= 1
        
        if left < right:
            l_char, r_char = s[left].lower(), s[right].lower()
            print(f"  Compare: '{l_char}' vs '{r_char}'")
            if l_char != r_char:
                print(f"  MISMATCH! Return False")
                return False
            print(f"  Match! left→{left+1}, right→{right-1}")
            left += 1
            right -= 1
    
    print(f"\nleft ({left}) >= right ({right}), Return True")
    return True
```

---

### Tactic 3: Handle Edge Cases First

**Always check these before the main algorithm:**

```python
def is_palindrome_robust(s):
    """Production-ready with all edge cases."""
    # Edge case 1: None or empty string
    if not s:
        return True  # Empty string is palindrome
    
    # Edge case 2: Single character
    if len(s) == 1:
        return True
    
    # Edge case 3: All non-alphanumeric
    if not any(c.isalnum() for c in s):
        return True  # Effectively empty
    
    # Edge case 4: Already clean palindrome (optimization)
    # Skip if string is all same character
    
    # Main algorithm...
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

---

### Tactic 4: Reverse & Compare for Quick Testing

**Use this simpler approach to verify your two-pointer solution:**

```python
def is_palindrome_reverse(s):
    """O(n) space but simple and correct."""
    filtered = ''.join(c.lower() for c in s if c.isalnum())
    return filtered == filtered[::-1]

def test_palindrome():
    """Test two-pointer against reverse approach."""
    test_cases = [
        "A man, a plan, a canal: Panama",
        "race a car",
        "Was it a car or a cat I saw",
        "No 'x' in Nixon",
        "",
        "a",
        "aa",
        "ab",
        "!!!",
    ]
    
    for s in test_cases:
        tp_result = is_palindrome_two_pointers(s)
        rev_result = is_palindrome_reverse(s)
        status = "✓" if tp_result == rev_result else "✗ MISMATCH"
        print(f"{status} '{s[:30]}...' → {tp_result}")
        assert tp_result == rev_result
```

---

### Tactic 5: Valid Palindrome II (One Deletion Allowed)

**When the problem allows removing at most one character:**

```python
def valid_palindrome_ii(s: str) -> bool:
    """Check if s can be palindrome by removing at most one char."""
    def is_palindrome_range(left: int, right: int) -> bool:
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
            # Try removing left or right character
            return (is_palindrome_range(left + 1, right) or
                   is_palindrome_range(left, right - 1))
        left += 1
        right -= 1
    
    return True

# Example: "abca" → remove 'b' or 'c' → "aca" or "aba" → True
#          "abc" → need to remove 2 chars → False
```

**Key insight**: When mismatch found, try both options (skip left or skip right).

---

### Tactic 6: Adapt for Linked List Palindrome

**For linked lists, use fast/slow pointers to find middle, reverse second half:**

```python
def is_palindrome_linked_list(head):
    """Check if linked list is palindrome. O(n) time, O(1) space."""
    if not head or not head.next:
        return True
    
    # 1. Find middle using fast/slow pointers
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # 2. Reverse second half
    second_half = reverse(slow.next)
    
    # 3. Compare first half with reversed second half
    first_half = head
    result = True
    while result and second_half:
        if first_half.val != second_half.val:
            result = False
        first_half = first_half.next
        second_half = second_half.next
    
    # 4. Restore list (reverse back)
    slow.next = reverse(slow.next)
    
    return result

def reverse(head):
    prev = None
    current = head
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    return prev
```

---

### Tactic 7: Expand from Center (Longest Palindromic Substring)

**When finding the longest palindromic substring, expand from each center:**

```python
def longest_palindromic_substring(s):
    """Find longest palindrome substring using expand from center."""
    if not s:
        return ""
    
    start = end = 0
    
    for i in range(len(s)):
        # Odd length (center at i)
        len1 = expand_around_center(s, i, i)
        # Even length (center between i and i+1)
        len2 = expand_around_center(s, i, i + 1)
        
        max_len = max(len1, len2)
        if max_len > end - start:
            start = i - (max_len - 1) // 2
            end = i + max_len // 2
    
    return s[start:end+1]

def expand_around_center(s, left, right):
    """Expand while palindrome property holds."""
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return right - left - 1  # Length of palindrome
```

<!-- back -->
