# String - Palindrome Check (Two Pointers / Reverse)

## Overview

A palindrome is a string that reads the same forwards and backwards. This pattern checks if a given string is a palindrome using two main approaches: **two pointers** or **reversing the string**.

This is a fundamental pattern in string manipulation and appears frequently in technical interviews at companies like Google, Amazon, Meta, and Apple.

## Key Concepts

- **Two Pointers**: Initialize pointers at start and end, move towards center comparing characters
- **Reverse Method**: Reverse the string and compare with original
- **Case Insensitivity**: Convert to lowercase for comparison
- **Character Filtering**: Skip non-alphanumeric characters when required

## Problem Variations

### Variation 1: Basic Palindrome Check
```
Check if a string is a palindrome exactly as given.

Example: "racecar" → true, "hello" → false
```

### Variation 2: Valid Palindrome (LeetCode #125)
```
Check if a string is a palindrome after:
- Converting to lowercase
- Removing all non-alphanumeric characters

Example: "A man, a plan, a canal: Panama" → true
```

### Variation 3: Valid Palindrome II (LeetCode #680)
```
Check if a string can become a palindrome by removing
at most one character.

Example: "abca" → true (remove 'b' or 'c')
```

---

## Solution Approaches

### Approach 1: Two Pointers (Optimal) ✅ Recommended

This is the optimal solution that achieves O(n) time complexity with O(1) space by comparing characters from both ends.

#### Algorithm

1. Initialize two pointers at the start and end of the string
2. Move the left pointer right until it finds a valid character
3. Move the right pointer left until it finds a valid character
4. Compare the characters (case-insensitive if needed)
5. Return `false` if they don't match
6. Continue until pointers meet or cross

#### Implementation

````carousel
```python
# Two Pointers Approach
def is_palindrome_two_pointers(s: str) -> bool:
    """
    Check if string is palindrome using two pointers.
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    left, right = 0, len(s) - 1
    
    while left < right:
        # Skip non-alphanumeric if needed
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
<!-- slide -->
```cpp
// Two Pointers Approach (C++)
#include <cctype>
#include <string>

bool isPalindrome(const std::string& s) {
    int left = 0, right = s.length() - 1;
    
    while (left < right) {
        while (left < right && !std::isalnum(s[left])) left++;
        while (left < right && !std::isalnum(s[right])) right--;
        
        if (left < right) {
            if (std::tolower(s[left]) != std::tolower(s[right])) {
                return false;
            }
            left++;
            right--;
        }
    }
    
    return true;
}
```
<!-- slide -->
```java
// Two Pointers Approach (Java)
public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    
    while (left < right) {
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
        
        if (left < right) {
            if (Character.toLowerCase(s.charAt(left)) != 
                Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
    }
    
    return true;
}
```
<!-- slide -->
```javascript
// Two Pointers Approach (JavaScript)
function isPalindrome(s) {
    let left = 0, right = s.length - 1;
    
    while (left < right) {
        while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;
        while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;
        
        if (left < right) {
            if (s[left].toLowerCase() !== s[right].toLowerCase()) {
                return false;
            }
            left++;
            right--;
        }
    }
    
    return true;
}
```
````

#### Step-by-Step Example

```
s = "A man, a plan, a canal: Panama"

Initial: left=0, right=39

Iteration 1:
  s[0] = 'A' (valid), s[39] = 'a' (valid)
  Compare: 'a' == 'a' ✓
  left=1, right=38

Iteration 2:
  s[1] = ' ' (skip), s[38] = 'm' (valid)
  s[3] = 'a' (valid), s[37] = 'n' (valid)
  Compare: 'a' == 'n' ✗? → Continue tracing...

The algorithm correctly skips non-alphanumeric and compares only valid chars!
```

---

### Approach 2: Reverse and Compare

This approach reverses the string and compares it with the original. It's simpler but may use O(n) space.

#### Algorithm

1. Filter the string if needed (remove non-alphanumeric, convert to lowercase)
2. Reverse the filtered string
3. Compare the original filtered string with the reversed version

#### Implementation

````carousel
```python
# Reverse Approach (Python)
def is_palindrome_reverse(s: str) -> bool:
    """
    Check if string is palindrome by reversing.
    
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    filtered = ''.join(c.lower() for c in s if c.isalnum())
    return filtered == filtered[::-1]
```
<!-- slide -->
```cpp
// Reverse Approach (C++)
#include <algorithm>
#include <cctype>
#include <string>

bool isPalindrome(const std::string& s) {
    std::string filtered;
    for (char c : s) {
        if (std::isalnum(c)) {
            filtered += std::tolower(c);
        }
    }
    
    std::string reversed = filtered;
    std::reverse(reversed.begin(), reversed.end());
    
    return filtered == reversed;
}
```
<!-- slide -->
```java
// Reverse Approach (Java)
public boolean isPalindrome(String s) {
    StringBuilder filtered = new StringBuilder();
    for (char c : s.toCharArray()) {
        if (Character.isLetterOrDigit(c)) {
            filtered.append(Character.toLowerCase(c));
        }
    }
    
    StringBuilder reversed = new StringBuilder(filtered).reverse();
    return filtered.toString().equals(reversed.toString());
}
```
<!-- slide -->
```javascript
// Reverse Approach (JavaScript)
function isPalindrome(s) {
    const filtered = s
        .toLowerCase()
        .split('')
        .filter(c => /[a-z0-9]/.test(c))
        .join('');
    
    const reversed = filtered.split('').reverse().join('');
    return filtered === reversed;
}
```
````

---

### Approach 3: Recursive Approach

This approach uses recursion to check if the string is a palindrome. It's educational but less efficient.

#### Implementation

````carousel
```python
# Recursive Approach (Python)
def is_palindrome_recursive(s: str) -> bool:
    """
    Check if string is palindrome using recursion.
    
    Time Complexity: O(n)
    Space Complexity: O(n) - recursion stack
    """
    def helper(left: int, right: int) -> bool:
        if left >= right:
            return True
        if not s[left].isalnum():
            return helper(left + 1, right)
        if not s[right].isalnum():
            return helper(left, right - 1)
        if s[left].lower() != s[right].lower():
            return False
        return helper(left + 1, right - 1)
    
    return helper(0, len(s) - 1)
```
<!-- slide -->
```cpp
// Recursive Approach (C++)
#include <cctype>
#include <string>

class Solution {
private:
    bool helper(const std::string& s, int left, int right) {
        if (left >= right) return true;
        
        while (left < right && !std::isalnum(s[left])) left++;
        while (left < right && !std::isalnum(s[right])) right--;
        
        if (left < right) {
            if (std::tolower(s[left]) != std::tolower(s[right])) {
                return false;
            }
            return helper(s, left + 1, right - 1);
        }
        return true;
    }
    
public:
    bool isPalindrome(const std::string& s) {
        return helper(s, 0, s.length() - 1);
    }
};
```
<!-- slide -->
```java
// Recursive Approach (Java)
class Solution {
    private boolean helper(String s, int left, int right) {
        if (left >= right) return true;
        
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
        
        if (left < right) {
            if (Character.toLowerCase(s.charAt(left)) != 
                Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            return helper(s, left + 1, right - 1);
        }
        return true;
    }
    
    public boolean isPalindrome(String s) {
        return helper(s, 0, s.length() - 1);
    }
}
```
<!-- slide -->
```javascript
// Recursive Approach (JavaScript)
function isPalindrome(s, left = 0, right = s.length - 1) {
    if (left >= right) return true;
    
    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;
    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;
    
    if (left < right) {
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }
        return isPalindrome(s, left + 1, right - 1);
    }
    return true;
}
```
````

---

### Approach 4: Stack-Based Approach

This approach uses a stack to store characters and then compares them. Useful when you need to access characters in reverse order.

#### Implementation

````carousel
```python
# Stack Approach (Python)
def is_palindrome_stack(s: str) -> bool:
    """
    Check if string is palindrome using a stack.
    
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    filtered = ''.join(c.lower() for c in s if c.isalnum())
    stack = list(filtered)
    
    while stack:
        if stack.pop(0) != stack[-1]:
            return False
    return True
```
<!-- slide -->
```cpp
// Stack Approach (C++)
#include <stack>
#include <string>

bool isPalindrome(const std::string& s) {
    std::stack<char> charStack;
    std::string filtered;
    
    for (char c : s) {
        if (std::isalnum(c)) {
            filtered += std::tolower(c);
        }
    }
    
    for (char c : filtered) {
        charStack.push(c);
    }
    
    for (char c : filtered) {
        if (c != charStack.top()) return false;
        charStack.pop();
    }
    
    return true;
}
```
<!-- slide -->
```java
// Stack Approach (Java)
import java.util.Stack;

public boolean isPalindrome(String s) {
    Stack<Character> stack = new Stack<>();
    StringBuilder filtered = new StringBuilder();
    
    for (char c : s.toCharArray()) {
        if (Character.isLetterOrDigit(c)) {
            char lower = Character.toLowerCase(c);
            filtered.append(lower);
            stack.push(lower);
        }
    }
    
    for (char c : filtered.toString().toCharArray()) {
        if (c != stack.pop()) return false;
    }
    
    return true;
}
```
<!-- slide -->
```javascript
// Stack Approach (JavaScript)
function isPalindrome(s) {
    const stack = [];
    const filtered = s
        .toLowerCase()
        .split('')
        .filter(c => /[a-z0-9]/.test(c));
    
    for (const c of filtered) {
        stack.push(c);
    }
    
    for (const c of filtered) {
        if (c !== stack.pop()) return false;
    }
    
    return true;
}
```
````

---

## Time and Space Complexity

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|-----------------|------------------|---------------|
| **Two Pointers** | O(n) | O(1) | ✅ **General case** - Recommended |
| **Reverse & Compare** | O(n) | O(n) | When reverse is useful |
| **Recursive** | O(n) | O(n) | Educational purposes |
| **Stack-Based** | O(n) | O(n) | When stack operations are needed |

---

## Common Pitfalls

1. **Forgetting case sensitivity**
   - Always convert to lowercase before comparison

2. **Not handling non-alphanumeric characters**
   - Skip or filter characters as needed

3. **Infinite loops with pointers**
   - Always move pointers in inner loops

4. **Not handling empty strings**
   - Empty string is always a palindrome

5. **Not handling single character**
   - Single character is always a palindrome

---

## Template Summary

### Quick Reference Template

```python
def is_palindrome(s: str) -> bool:
    """Template for palindrome check."""
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

## Example Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) | 125 | Easy | Check if string is palindrome (ignoring non-alphanumeric) |
| [Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii/) | 680 | Easy | Check if string can be palindrome by removing one char |
| [Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/) | 234 | Easy | Check if linked list is palindrome |
| [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/) | 5 | Medium | Find longest palindromic substring |
| [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/) | 647 | Medium | Count all palindromic substrings |

---

## Related Patterns

- **[Two Pointers - Expanding from Center](/patterns/two-pointers-expanding-from-center-palindromes.md)** - For finding all palindromic substrings
- **[Two Pointers - String Reversal](/patterns/two-pointers-string-reversal.md)** - For string reversal problems
- **[Stack - Simulation/Backtracking](/patterns/stack-simulation-backtracking-helper.md)** - For problems requiring reverse access

---

## Video Tutorial Links

1. **[Valid Palindrome - NeetCode](https://www.youtube.com/watch?v=jj_1q64YUOw)** - Visual explanation
2. **[Valid Palindrome - William Lin](https://www.youtube.com/watch?v=ReA4u5T_7Ao)** - Clean explanation
3. **[LeetCode Official Solution](https://www.youtube.com/watch?v=oJ4_2OaYJ8I)** - Official walkthrough

---

## Follow-up Questions

### Basic Level

1. **What is the time and space complexity of the two-pointer approach?**
   - Time: O(n), Space: O(1)

2. **Why do we use two pointers instead of one?**
   - Two pointers allow us to compare from both ends simultaneously

3. **When should we filter characters vs. skip them?**
   - Filter: When preprocessing is needed; Skip: When on-the-fly comparison is preferred

### Intermediate Level

4. **How would you modify the solution for Valid Palindrome II?**
   - Allow one mismatch and continue checking

5. **What's the difference between filtering first and filtering during comparison?**
   - Filtering first: O(n) space; Filtering during: O(1) space

### Advanced Level

6. **How would you find all palindromic substrings?**
   - Use expanding from center technique

7. **How would you check for palindromes in O(1) extra space for very large strings?**
   - Use two pointers with memory-mapped file access

---

## Summary

The **String - Palindrome Check** pattern is essential for understanding string manipulation and the two-pointer technique. Key takeaways:

1. **Two Pointers** is the optimal approach (O(n) time, O(1) space)
2. **On-the-fly filtering** saves memory compared to preprocessing
3. **Case insensitivity** and **non-alphanumeric handling** are common requirements
4. The pattern extends to many related problems in string manipulation
