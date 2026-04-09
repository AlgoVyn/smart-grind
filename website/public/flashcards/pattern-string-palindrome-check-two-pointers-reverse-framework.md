## String - Palindrome Check (Two Pointers / Reverse): Framework

What is the complete code template for checking if a string is a palindrome using two pointers?

<!-- front -->

---

### Framework: Two Pointers Converging from Ends

```
┌─────────────────────────────────────────────────────────────────────┐
│  PALINDROME CHECK - TWO POINTERS TEMPLATE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Key Insight: Compare characters from both ends moving inward        │
│                                                                      │
│  1. Initialize two pointers:                                          │
│     - left = 0 (start of string)                                     │
│     - right = len(s) - 1 (end of string)                             │
│                                                                      │
│  2. While left < right:                                              │
│     - Skip non-alphanumeric characters at left (left++)            │
│     - Skip non-alphanumeric characters at right (right--)          │
│     - Compare characters at left and right (case-insensitive)      │
│     - If mismatch: return False                                      │
│     - Move pointers: left++, right--                               │
│                                                                      │
│  3. Return True if all comparisons matched                          │
│                                                                      │
│  4. Edge cases:                                                     │
│     - Empty string: return True                                      │
│     - Single character: return True                                  │
│     - All non-alphanumeric: return True                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Implementation Template

```python
def is_palindrome_two_pointers(s: str) -> bool:
    """
    Check if string is palindrome using two pointers.
    Time: O(n), Space: O(1)
    """
    left, right = 0, len(s) - 1
    
    while left < right:
        # Skip non-alphanumeric characters
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        # Compare characters (case-insensitive)
        if left < right:
            if s[left].lower() != s[right].lower():
                return False
            left += 1
            right -= 1
    
    return True
```

---

### Key Framework Elements

| Element | Purpose | Initial Value |
|---------|---------|---------------|
| `left` | Pointer from start | `0` |
| `right` | Pointer from end | `len(s) - 1` |
| Loop condition | Process while pointers haven't crossed | `left < right` |
| Skip condition | Ignore non-alphanumeric | `not s[left].isalnum()` |
| Comparison | Check equality case-insensitive | `s[left].lower() == s[right].lower()` |
| Pointer movement | Move towards center | `left++`, `right--` |

---

### Python, Java, C++, JavaScript Comparison

```python
# Python - clean with isalnum() and lower()
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

```java
// Java - use Character.isLetterOrDigit() and Character.toLowerCase()
public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
        if (left < right) {
            if (Character.toLowerCase(s.charAt(left)) != 
                Character.toLowerCase(s.charAt(right)))
                return false;
            left++;
            right--;
        }
    }
    return true;
}
```

```cpp
// C++ - use std::isalnum() and std::tolower()
bool isPalindrome(const std::string& s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        while (left < right && !std::isalnum(s[left])) left++;
        while (left < right && !std::isalnum(s[right])) right--;
        if (left < right) {
            if (std::tolower(s[left]) != std::tolower(s[right]))
                return false;
            left++;
            right--;
        }
    }
    return true;
}
```

```javascript
// JavaScript - use regex for alphanumeric check
function isPalindrome(s) {
    let left = 0, right = s.length - 1;
    while (left < right) {
        while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;
        while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;
        if (left < right) {
            if (s[left].toLowerCase() !== s[right].toLowerCase())
                return false;
            left++;
            right--;
        }
    }
    return true;
}
```

<!-- back -->
