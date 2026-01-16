# Reverse Words in a String

## Problem Description

Given an input string `s`, reverse the order of the words.

A word is defined as a sequence of non-space characters. The words in `s` will be separated by at least one space.

Return a string of the words in reverse order concatenated by a single space.

**Note:** `s` may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words and should not include any extra spaces.

---

## Examples

**Example 1:**

**Input:**
```python
s = "the sky is blue"
```

**Output:**
```python
"blue is sky the"
```

---

**Example 2:**

**Input:**
```python
s = "  hello world  "
```

**Output:**
```python
"world hello"
```

**Explanation:** The reversed string should not contain leading or trailing spaces.

---

**Example 3:**

**Input:**
```python
s = "a good   example"
```

**Output:**
```python
"example good a"
```

**Explanation:** Multiple spaces between two words should be reduced to a single space in the reversed string.

---

## Constraints

- `1 <= s.length <= 10^4`
- `s` contains English letters (upper-case and lower-case), digits, and spaces `' '`.
- There is at least one word in `s`.

---

## Follow-up

If the string data type is mutable in your language, can you solve it in-place with O(1) extra space?

---

## Intuition

The core idea is to:
1. Extract all words from the string (ignoring extra spaces)
2. Reverse the order of these words
3. Join them back with single spaces

The challenge is handling:
- Leading and trailing spaces
- Multiple consecutive spaces between words
- Preserving the order of characters within each word

---

## Approach 1: Built-in Split (Simplest)

Python's `split()` method without arguments automatically handles:
- Leading and trailing spaces
- Multiple consecutive spaces (treated as one separator)

This is the most straightforward and Pythonic approach.

```python
class Solution:
    def reverseWords(self, s: str) -> str:
        # split() without argument splits on whitespace and removes empty strings
        words = s.split()
        # Reverse the list of words
        words.reverse()
        # Join with single space
        return ' '.join(words)
```

---

## Approach 2: Manual Word Extraction

For languages without built-in split or to understand the underlying logic:

```python
class Solution:
    def reverseWords(self, s: str) -> str:
        words = []
        word = []
        
        for char in s:
            if char != ' ':
                word.append(char)
            else:
                if word:
                    words.append(''.join(word))
                    word = []
        
        # Don't forget the last word
        if word:
            words.append(''.join(word))
        
        # Reverse and join
        words.reverse()
        return ' '.join(words)
```

---

## Approach 3: Two-Pointer In-Place (O(1) Space)

For the follow-up question, if strings are mutable (like in C++), we can do it in-place:

```python
class Solution:
    def reverseWords(self, s: list) -> None:
        """In-place reversal for mutable string (list of chars)"""
        
        def reverse_subarray(arr, left, right):
            while left < right:
                arr[left], arr[right] = arr[right], arr[left]
                left += 1
                right -= 1
        
        n = len(s)
        
        # Step 1: Reverse entire array
        reverse_subarray(s, 0, n - 1)
        
        # Step 2: Reverse each word
        start = 0
        for end in range(n + 1):
            if end == n or s[end] == ' ':
                reverse_subarray(s, start, end - 1)
                start = end + 1
        
        # Step 3: Remove extra spaces (two-pointer technique)
        slow = 0
        for fast in range(n):
            if s[fast] != ' ' or (fast > 0 and s[fast - 1] != ' '):
                s[slow] = s[fast]
                slow += 1
        
        # Trim to actual length
        return ''.join(s[:slow])
```

---

## Approach 4: Using Stack (Alternative Perspective)

```python
class Solution:
    def reverseWords(self, s: str) -> str:
        stack = []
        word = []
        
        for char in s:
            if char != ' ':
                word.append(char)
            elif word:
                stack.append(''.join(word))
                word = []
        
        if word:
            stack.append(''.join(word))
        
        # Pop from stack to get reverse order
        return ' '.join(reversed(stack))
```

---

## Approach 5: One-Pass with List Construction

```python
class Solution:
    def reverseWords(self, s: str) -> str:
        result = []
        i = len(s) - 1
        
        while i >= 0:
            # Skip spaces
            while i >= 0 and s[i] == ' ':
                i -= 1
            
            if i < 0:
                break
            
            # Find end of word (we're scanning backwards)
            j = i
            
            # Find start of word
            while i >= 0 and s[i] != ' ':
                i -= 1
            
            # Add word to result
            result.append(s[i + 1:j + 1])
        
        return ' '.join(result)
```

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Built-in Split | O(n) | O(n) | Simplest, most Pythonic |
| Manual Extraction | O(n) | O(n) | No built-ins needed |
| Two-Pointer In-Place | O(n) | O(1) | Best for follow-up |
| Stack | O(n) | O(n) | Alternative perspective |
| One-Pass | O(n) | O(n) | Single pass, backward scan |

**Overall:** All approaches achieve O(n) time complexity where n is the length of the string. The main difference is space complexity and readability.

---

## Related Problems

1. **[Reverse Words in a String II](https://leetcode.com/problems/reverse-words-in-a-string-ii/)** - In-place version requiring O(1) extra space
2. **[Backspace String Compare](https://leetcode.com/problems/backspace-string-compare/)** - Similar string processing with special characters
3. **[Restore The String From Alphabet Index Invariant Counterpart](https://leetcode.com/problems/restore-the-string-from-alphabet-index-invariant-counterpart/)** - String manipulation with space handling
4. **[Trim a Binary Search Tree](https://leetcode.com/problems/trim-a-binary-search-tree/)** - Tree-based word boundary trimming
5. **[Most Common Word](https://leetcode.com/problems/most-common-word/)** - String parsing and word counting

---

## Video Tutorial Links

1. [NeetCode - Reverse Words in a String](https://www.youtube.com/watch?v=8QdUYgnz-6c)
2. [Back to Back SWE - Reverse Words in a String](https://www.youtube.com/watch?v=SXmGkqAQ7tU)
3. [Fraz's Solution Explanation](https://www.youtube.com/watch?v=MnY5jpGvkYQ)

---

## Follow-up Questions to Practice

1. **Easy:** Can you implement this without using `split()` or any built-in string methods?
2. **Medium:** How would you handle Unicode spaces or other whitespace characters (tabs, newlines)?
3. **Medium:** Can you reverse the words in-place using O(1) extra space if the string is mutable?
4. **Hard:** How would you modify the solution to reverse the characters within each word as well as the word order? (e.g., "the sky is blue" → "eulb si yks eht")
5. **Hard:** Given multiple strings, how would you reverse words across all strings simultaneously?

