# Reverse Words in a String

## Problem Description

Given an input string `s`, reverse the order of the words.

A word is defined as a sequence of non-space characters. The words in `s` will be separated by at least one space.

Return a string of the words in reverse order concatenated by a single space.

Note that `s` may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words. Do not include any extra spaces.

### Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `s = "the sky is blue"` | `"blue is sky the"` |

**Example 2:**

| Input | Output |
|-------|--------|
| `s = "  hello world  "` | `"world hello"` |

**Explanation:** Your reversed string should not contain leading or trailing spaces.

**Example 3:**

| Input | Output |
|-------|--------|
| `s = "a good   example"` | `"example good a"` |

**Explanation:** You need to reduce multiple spaces between two words to a single space in the reversed string.

### Constraints

- `1 <= s.length <= 10^4`
- `s` contains English letters (upper-case and lower-case), digits, and spaces ' '.
- There is at least one word in `s`.

**Follow-up:** If the string data type is mutable in your language, can you solve it in-place with O(1) extra space?

## Solution

```python
class Solution:
    def reverseWords(self, s: str) -> str:
        words = s.split()
        words.reverse()
        return ' '.join(words)
```

## Explanation

Split the string into words, reverse the list, and join back. This is simple and O(n) time.

### Time Complexity

- O(n), where n is the length of the string.

### Space Complexity

- O(n), for storing the words.
