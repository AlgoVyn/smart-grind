# String - Repeated Substring Pattern Detection

## Overview

Check if a string can be constructed by repeating a substring. Use this pattern for detecting periodic strings. Benefits: Efficient way to identify repeating patterns.

## Key Concepts

- Check if string is concatenation of its prefix repeated.

## Template

```python
def repeated_substring_pattern(s: str) -> bool:
    n = len(s)
    for i in range(1, n // 2 + 1):
        if n % i == 0:
            substring = s[:i]
            if substring * (n // i) == s:
                return True
    return False
```

## Example Problems

- **Repeated Substring Pattern**: Check if string has repeated substring.
- **Count Binary Substrings**: Count substrings with equal 0s and 1s.
- **String Compression**: Compress string by counting repeats.

## Time and Space Complexity

- O(n^2) worst case, O(n) space.

## Common Pitfalls

- Not checking divisibility of length.
- Edge cases like single character or prime length strings.