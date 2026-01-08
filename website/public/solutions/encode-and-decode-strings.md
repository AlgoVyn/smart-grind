# Encode And Decode Strings

## Problem Description
[Link to problem](https://leetcode.com/problems/encode-and-decode-strings/)

## Solution

```python
# Python solution
from typing import List

class Solution:
    def encode(self, strs: List[str]) -> str:
        encoded = ""
        for s in strs:
            encoded += str(len(s)) + "#" + s
        return encoded

    def decode(self, s: str) -> List[str]:
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
For encoding, we prefix each string with its length followed by a '#' delimiter, then concatenate all.

For decoding, we iterate through the string, find the '#' to get the length, then extract the substring of that length.

This ensures correct parsing even if strings contain special characters.

Time complexity: O(n) where n is the total length of all strings.
Space complexity: O(n) for the encoded string.
