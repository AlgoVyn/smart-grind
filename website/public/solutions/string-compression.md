# String Compression

## LeetCode Link

[LeetCode Problem 443: String Compression](https://leetcode.com/problems/string-compression/)

## Pattern:

Two Pointers (Read-Write)

This problem uses the **two-pointer technique** where one pointer reads through the original array and another pointer writes the compressed result in-place. The write pointer tracks where the next compressed character should go.

## Common Pitfalls

- **Converting count to string**: Use `str(count)` to convert the integer count to characters for writing.
- **Single character handling**: Only write the count if it's greater than 1 (single characters remain as-is).
- **Write pointer position**: The write pointer position after compression is the new length of the array.
- **In-place modification**: The algorithm modifies the input array directly, requiring only O(1) extra space.

---

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

## Constraints

- `1 <= chars.length <= 2000`
- `chars[i]` is a lowercase English letter, uppercase English letter, digit, or symbol.

---

## Examples

### Example 1

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

### Example 2

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

### Example 3

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

---

## Intuition

The key insight for this problem is using the two-pointer technique to modify the array in-place without using extra space.

### Key Observations

1. **In-Place Modification**: We need to compress the array directly without creating a new array. The result must be stored in the input array.

2. **Read and Write Separately**: We need two pointers - one to read through the original array (read pointer) and one to write the compressed result (write pointer).

3. **Grouping Consecutive Characters**: We iterate through the array, counting consecutive occurrences of each character.

4. **Writing Strategy**: 
   - Always write the character
   - Only write the count if it's greater than 1
   - Write each digit of the count as a separate character

### Why It Works

The two-pointer approach works because:
- The write pointer always points to the next available position
- Since we're only writing (not reading) at the write position, we never overwrite unread data
- The write pointer always stays ahead of the read pointer
- After processing, the write pointer position equals the compressed length

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two-Pointer (Optimal)** - O(n) time, O(1) space
2. **Grouping with List** - Using extra space

---

## Approach 1: Two-Pointer (Optimal)

### Code Implementation

````carousel
```python
class Solution:
    def compress(self, chars) -> int:
        write = 0  # write pointer
        read = 0   # read pointer
        
        while read < len(chars):
            char = chars[read]
            count = 0
            
            # Count consecutive duplicates
            while read < len(chars) and chars[read] == char:
                read += 1
                count += 1
            
            # Write character
            chars[write] = char
            write += 1
            
            # Write count if > 1
            if count > 1:
                for digit in str(count):
                    chars[write] = digit
                    write += 1
        
        return write
```

<!-- slide -->
```cpp
class Solution {
public:
    int compress(vector<char>& chars) {
        int write = 0;
        int read = 0;
        
        while (read < chars.size()) {
            char c = chars[read];
            int count = 0;
            
            while (read < chars.size() && chars[read] == c) {
                read++;
                count++;
            }
            
            chars[write++] = c;
            
            if (count > 1) {
                string s = to_string(count);
                for (char d : s) {
                    chars[write++] = d;
                }
            }
        }
        
        return write;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int compress(char[] chars) {
        int write = 0;
        int read = 0;
        
        while (read < chars.length) {
            char c = chars[read];
            int count = 0;
            
            while (read < chars.length && chars[read] == c) {
                read++;
                count++;
            }
            
            chars[write++] = c;
            
            if (count > 1) {
                String s = Integer.toString(count);
                for (char d : s.toCharArray()) {
                    chars[write++] = d;
                }
            }
        }
        
        return write;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {character[]} chars
 * @return {number}
 */
var compress = function(chars) {
    let write = 0;
    let read = 0;
    
    while (read < chars.length) {
        const c = chars[read];
        let count = 0;
        
        while (read < chars.length && chars[read] === c) {
            read++;
            count++;
        }
        
        chars[write++] = c;
        
        if (count > 1) {
            const s = count.toString();
            for (const d of s) {
                chars[write++] = d;
            }
        }
    }
    
    return write;
};
```
````

---

## Approach 2: List-based

### Code Implementation

````carousel
```python
class Solution:
    def compress(self, chars) -> int:
        result = []
        i = 0
        
        while i < len(chars):
            char = chars[i]
            count = 0
            
            while i < len(chars) and chars[i] == char:
                i += 1
                count += 1
            
            result.append(char)
            if count > 1:
                result.extend(list(str(count)))
        
        # Copy back to chars array
        for i, c in enumerate(result):
            chars[i] = c
        
        return len(result)
```

<!-- slide -->
```cpp
class Solution {
public:
    int compress(vector<char>& chars) {
        vector<char> result;
        int i = 0;
        
        while (i < chars.size()) {
            char c = chars[i];
            int count = 0;
            
            while (i < chars.size() && chars[i] == c) {
                i++;
                count++;
            }
            
            result.push_back(c);
            if (count > 1) {
                string s = to_string(count);
                result.insert(result.end(), s.begin(), s.end());
            }
        }
        
        for (int i = 0; i < result.size(); i++) {
            chars[i] = result[i];
        }
        
        return result.size();
    }
};
```

<!-- slide -->
```java
class Solution {
    public int compress(char[] chars) {
        List<Character> result = new ArrayList<>();
        int i = 0;
        
        while (i < chars.length) {
            char c = chars[i];
            int count = 0;
            
            while (i < chars.length && chars[i] == c) {
                i++;
                count++;
            }
            
            result.add(c);
            if (count > 1) {
                String s = Integer.toString(count);
                for (char d : s.toCharArray()) {
                    result.add(d);
                }
            }
        }
        
        for (int j = 0; j < result.size(); j++) {
            chars[j] = result.get(j);
        }
        
        return result.size();
    }
}
```

<!-- slide -->
```javascript
var compress = function(chars) {
    const result = [];
    let i = 0;
    
    while (i < chars.length) {
        const c = chars[i];
        let count = 0;
        
        while (i < chars.length && chars[i] === c) {
            i++;
            count++;
        }
        
        result.push(c);
        if (count > 1) {
            result.push(...count.toString().split(''));
        }
    }
    
    for (let j = 0; j < result.length; j++) {
        chars[j] = result[j];
    }
    
    return result.length;
};
```
````

### Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Two-Pointer | O(n) | O(1) |
| List-based | O(n) | O(n) |

---

## Related Problems

| Problem | LeetCode | Description |
|---------|----------|-------------|
| [RLE Iterator](/solutions/rle-iterator.md) | 900 | RLE |
| [Decode String](/solutions/decode-string.md) | 394 | Decode RLE |

---

## Video Tutorial Links

1. **[String Compression - NeetCode](https://www.youtube.com/watch?v=XXXXX)**

---

## Follow-up Questions

### Q1: How does two-pointer work?
**Answer:** Use read pointer to scan, write pointer to modify in-place.

---

## Summary

---

## Solution (Original)

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

## Approach

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
