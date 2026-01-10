# String Compression

## Problem Description

Given an array of characters `chars`, compress it using the following algorithm:

1. Begin with an empty string `s`. For each group of consecutive repeating characters in `chars`:
   - If the group's length is 1, append the character to `s`.
   - Otherwise, append the character followed by the group's length.

2. The compressed string `s` should not be returned separately, but instead, be stored in the input character array `chars`. Note that group lengths that are 10 or longer will be split into multiple characters in `chars`.

3. After you are done modifying the input array, return the new length of the array.

**Constraint**: You must write an algorithm that uses only constant extra space.

**Note**: The characters in the array beyond the returned length do not matter and should be ignored.

### Example 1:

**Input:**
```python
chars = ["a","a","b","b","c","c","c"]
```

**Output:**
```python
Return 6, and the first 6 characters of the input array should be: ["a","2","b","2","c","3"]
```

**Explanation:**
The groups are "aa", "bb", and "ccc". This compresses to "a2b2c3".

### Example 2:

**Input:**
```python
chars = ["a"]
```

**Output:**
```python
Return 1, and the first character of the input array should be: ["a"]
```

**Explanation:**
The only group is "a", which remains uncompressed since it's a single character.

### Example 3:

**Input:**
```python
chars = ["a","b","b","b","b","b","b","b","b","b","b","b","b"]
```

**Output:**
```python
Return 4, and the first 4 characters of the input array should be: ["a","b","1","2"]
```

**Explanation:**
The groups are "a" and "bbbbbbbbbbbb". This compresses to "ab12".

### Constraints:

- `1 <= chars.length <= 2000`
- `chars[i]` is a lowercase English letter, uppercase English letter, digit, or symbol.

---

## Solution

```python
from typing import List

class Solution:
    def compress(self, chars: List[str]) -> int:
        write = 0  # Pointer for writing compressed characters
        i = 0      # Pointer for reading original characters
        
        while i < len(chars):
            char = chars[i]
            count = 0
            
            # Count consecutive occurrences of the current character
            while i < len(chars) and chars[i] == char:
                i += 1
                count += 1
            
            # Write the character to the array
            chars[write] = char
            write += 1
            
            # If count > 1, write each digit of the count
            if count > 1:
                for digit in str(count):
                    chars[write] = digit
                    write += 1
        
        return write
```

---

## Explanation

### Approach

The solution uses a two-pointer technique to compress the array in-place:

1. **Two Pointers**: Use `i` for reading through the original array and `write` for writing the compressed result.
2. **Consecutive Counting**: For each character, count how many times it appears consecutively.
3. **In-Place Writing**: Write the character and its count (if > 1) directly into the original array.
4. **Constant Space**: The algorithm uses only a constant amount of extra space (O(1)) by reusing the input array.

### Step-by-Step Explanation

1. **Initialization**:
   - `write = 0`: Tracks the position to write the next compressed character.
   - `i = 0`: Tracks the current position in the original array.

2. **Reading and Counting**:
   - For each character at position `i`, count how many consecutive occurrences exist.
   - Move the `i` pointer forward until a different character is encountered.

3. **Writing Compressed Data**:
   - Write the character to the array at the `write` position.
   - If the count is greater than 1, write each digit of the count as separate characters.
   - Increment the `write` pointer accordingly.

4. **Return Result**:
   - The `write` pointer now represents the length of the compressed array.

### Time Complexity

- **O(n)**: The algorithm processes each character exactly once, where `n` is the length of the input array.

### Space Complexity

- **O(1)**: The algorithm modifies the input array in-place and uses only a constant amount of additional space for pointers and counters.
