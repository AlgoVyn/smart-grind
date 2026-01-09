# Valid Palindrome

## Problem Description

A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.

### Examples

**Example 1:**

**Input:**
```python
s = "A man, a plan, a canal: Panama"
```

**Output:**
```python
true
```

**Explanation:** `"amanaplanacanalpanama"` is a palindrome.

**Example 2:**

**Input:**
```python
s = "race a car"
```

**Output:**
```python
false
```

**Explanation:** `"raceacar"` is not a palindrome.

**Example 3:**

**Input:**
```python
s = " "
```

**Output:**
```python
true
```

**Explanation:** `s` is an empty string `""` after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.

### Constraints

- `1 <= s.length <= 2 * 10^5`
- `s` consists only of printable ASCII characters.

## Solution

```python
class Solution:
    def isPalindrome(self, s: str) -> bool:
        cleaned = ''.join(c.lower() for c in s if c.isalnum())
        return cleaned == cleaned[::-1]
```

## Explanation

This problem requires checking if a string is a palindrome after cleaning it by removing non-alphanumeric characters and converting to lowercase.

### Approach

Clean the string to keep only alphanumeric characters in lowercase, then check if it equals its reverse.

### Step-by-Step Explanation

1. **Clean String**: Use list comprehension to filter alphanumeric and lowercase.

2. **Check Palindrome**: Compare cleaned with its reverse.

### Time Complexity

- **O(n)**, where `n` is the length of `s`.

### Space Complexity

- **O(n)**, for the cleaned string.
