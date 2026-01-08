# Valid Palindrome Ii

## Problem Description
[Link to problem](https://leetcode.com/problems/valid-palindrome-ii/)

Given a string s, return true if the s can be palindrome after deleting at most one character from it.
 
Example 1:

Input: s = "aba"
Output: true

Example 2:

Input: s = "abca"
Output: true
Explanation: You could delete the character 'c'.

Example 3:

Input: s = "abc"
Output: false

 
Constraints:

1 <= s.length <= 105
s consists of lowercase English letters.


## Solution

```python
def validPalindrome(s):
    def is_palindrome(left, right):
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True
    
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return is_palindrome(left + 1, right) or is_palindrome(left, right - 1)
        left += 1
        right -= 1
    return True
```

## Explanation
This problem checks if a string can become a palindrome by deleting at most one character using two pointers.

### Step-by-Step Approach:
1. **Two Pointers:**
   - Start from both ends.

2. **Check Mismatch:**
   - If mismatch, check if skipping left or right makes palindrome.

3. **Helper Function:**
   - is_palindrome checks substring from left to right.

4. **Return:**
   - True if already palindrome or one skip works.

### Time Complexity:
- O(n), as each character is checked at most twice.

### Space Complexity:
- O(1), excluding recursion stack (depth 1).
