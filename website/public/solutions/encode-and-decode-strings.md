# Encode and Decode Strings

## Problem Description

> Design an algorithm to encode a list of strings into a single string and decode it back to the original list.

## Solution

```python
from typing import List

class Solution:
    def encode(self, strs: List[str]) -> str:
        """
        Encode a list of strings into a single string.

        Each string is prefixed with its length followed by a '#' delimiter.
        """
        encoded = ""
        for s in strs:
            encoded += str(len(s)) + "#" + s
        return encoded

    def decode(self, s: str) -> List[str]:
        """
        Decode the encoded string back to the original list of strings.
        """
        result = []
        i = 0
        while i < len(s):
            j = i
            while s[j] != '#':
                j += 1
            length = int(s[i:j])
            i = j + 1
            word = s[i:i + length]
            result.append(word)
            i += length
        return result
```

## Explanation

### Encoding Strategy
We prefix each string with its length followed by a `#` delimiter, then concatenate all encoded strings together. This ensures we can correctly parse the boundaries between strings.

### Decoding Strategy
We iterate through the encoded string, find the `#` delimiter to determine the length of the next string, then extract the substring of that exact length.

This approach ensures correct parsing even if strings contain special characters.

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | **O(n)** |
| Space | **O(n)** |

- **Time**: O(n) where n is the total length of all strings
- **Space**: O(n) for the encoded string
