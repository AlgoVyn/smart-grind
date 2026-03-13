# Encode and Decode Strings

## Problem Description

> Design an algorithm to encode a list of strings into a single string and decode it back to the original list.

Design an algorithm to encode and decode a list of strings into and out of a single string. The encoded string is to be stored and transferred, then decoded back to the original list of strings.

**LeetCode Link:** [Encode and Decode Strings - LeetCode 271](https://leetcode.com/problems/encode-and-decode-strings/)

---

## Examples

### Example 1

**Input:**
```python
["Hello", "World"]
```

**Output:**
```python
["Hello", "World"]
```

**Explanation:**
```
encode() returns "5#Hello5#World"
decode() returns ["Hello", "World"]
```

### Example 2

**Input:**
```python
["", ""]
```

**Output:**
```python
["", ""]
```

**Explanation:**
```
encode() returns "0##0#"
decode() returns ["", ""]
```

### Example 3

**Input:**
```python
["Hello#World", "Test#123"]
```

**Output:**
```python
["Hello#World", "Test#123"]
```

**Explanation:**
```
encode() returns "11#Hello#World9#Test#123"
decode() returns ["Hello#World", "Test#123"]
```

---

## Constraints

- `1 <= strs.length <= 2000`
- `0 <= strs[i].length <= 10^5`
- `strs[i]` contains any possible characters out of 256 valid ASCII characters

---

## Pattern: Length-Prefixed String Encoding

This problem uses a **length-prefixed encoding** scheme where each string is encoded as `[length]#` + `string`. The length serves as a delimiter that allows unambiguous parsing, even if strings contain special characters like `#`.

---

## Intuition

The core challenge is encoding and decoding strings when the strings themselves may contain any character, including delimiters. We need a scheme that allows unambiguous parsing.

### Key Observations

1. **Delimiter Collision Problem**: If we simply use a delimiter like `#` to separate strings, we can't handle strings that contain `#` in them.

2. **Length Prefix Solution**: By prefixing each string with its length followed by a delimiter, we always know exactly how many characters to read for each string.

3. **Unambiguous Parsing**: The length tells us exactly where each string ends, making parsing trivial regardless of string content.

4. **Empty String Handling**: An empty string is encoded as `0#` followed by nothing.

### Algorithm Overview

**Encoding:**
1. For each string in the list
2. Convert the string length to a number
3. Concatenate: length + "#" + string
4. Return the combined encoded string

**Decoding:**
1. Iterate through the encoded string
2. Find the `#` delimiter to get the length
3. Extract exactly that many characters
4. Add to result list and continue

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Length-Prefixed Encoding** - Standard solution using length + delimiter
2. **Unicode Escape Encoding** - Alternative using Unicode escape sequences
3. **Chunked Encoding** - For very long strings

---

## Approach 1: Length-Prefixed Encoding (Optimal)

### Algorithm Steps

1. **For encode()**:
   - For each string, get its length
   - Convert length to string and add delimiter `#`
   - Concatenate length + delimiter + string
   
2. **For decode()**:
   - Initialize index at start
   - Find next `#` to get length
   - Extract substring of that length
   - Repeat until end of string

### Why It Works

The length prefix ensures unambiguous parsing. No matter what characters are in the string, we always know exactly how many characters to read because we read the length first.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def encode(self, strs: List[str]) -> str:
        """
        Encode a list of strings into a single string.
        
        Each string is prefixed with its length followed by a '#' delimiter.
        
        Time Complexity: O(n) where n is total length of all strings
        Space Complexity: O(n) for the encoded string
        
        Args:
            strs: List of strings to encode
            
        Returns:
            Encoded string
        """
        encoded = ""
        for s in strs:
            encoded += str(len(s)) + "#" + s
        return encoded

    def decode(self, s: str) -> List[str]:
        """
        Decode the encoded string back to the original list of strings.
        
        Time Complexity: O(n) where n is length of encoded string
        Space Complexity: O(n) for the result list
        
        Args:
            s: Encoded string
            
        Returns:
            List of decoded strings
        """
        result = []
        i = 0
        
        while i < len(s):
            # Find the delimiter to get the length
            j = i
            while s[j] != '#':
                j += 1
            
            # Extract length
            length = int(s[i:j])
            
            # Move past the delimiter
            i = j + 1
            
            # Extract the string of given length
            word = s[i:i + length]
            result.append(word)
            
            # Move to next position
            i += length
        
        return result
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    /**
     * @brief Encode a list of strings into a single string
     * @param strs List of strings to encode
     * @return Encoded string
     */
    string encode(vector<string>& strs) {
        string encoded = "";
        for (const string& s : strs) {
            encoded += to_string(s.length()) + "#" + s;
        }
        return encoded;
    }
    
    /**
     * @brief Decode the encoded string back to the original list
     * @param s Encoded string
     * @return List of decoded strings
     */
    vector<string> decode(string s) {
        vector<string> result;
        size_t i = 0;
        
        while (i < s.length()) {
            // Find the delimiter to get the length
            size_t j = i;
            while (s[j] != '#') {
                j++;
            }
            
            // Extract length
            int length = stoi(s.substr(i, j - i));
            
            // Move past the delimiter
            i = j + 1;
            
            // Extract the string of given length
            string word = s.substr(i, length);
            result.push_back(word);
            
            // Move to next position
            i += length;
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

public class Solution {
    /**
     * Encode a list of strings into a single string
     * @param strs List of strings to encode
     * @return Encoded string
     */
    public String encode(List<String> strs) {
        StringBuilder encoded = new StringBuilder();
        for (String s : strs) {
            encoded.append(s.length()).append("#").append(s);
        }
        return encoded.toString();
    }
    
    /**
     * Decode the encoded string back to the original list
     * @param s Encoded string
     * @return List of decoded strings
     */
    public List<String> decode(String s) {
        List<String> result = new ArrayList<>();
        int i = 0;
        
        while (i < s.length()) {
            // Find the delimiter to get the length
            int j = i;
            while (s.charAt(j) != '#') {
                j++;
            }
            
            // Extract length
            int length = Integer.parseInt(s.substring(i, j));
            
            // Move past the delimiter
            i = j + 1;
            
            // Extract the string of given length
            String word = s.substring(i, i + length);
            result.add(word);
            
            // Move to next position
            i += length;
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Encodes a list of strings to a single string.
 * @param {string[]} strs
 * @return {string}
 */
var encode = function(strs) {
    let encoded = "";
    for (const s of strs) {
        encoded += s.length + "#" + s;
    }
    return encoded;
};

/**
 * Decodes a single string to a list of strings.
 * @param {string} s
 * @return {string[]}
 */
var decode = function(s) {
    const result = [];
    let i = 0;
    
    while (i < s.length) {
        // Find the delimiter to get the length
        let j = i;
        while (s[j] !== '#') {
            j++;
        }
        
        // Extract length
        const length = parseInt(s.substring(i, j));
        
        // Move past the delimiter
        i = j + 1;
        
        // Extract the string of given length
        const word = s.substring(i, i + length);
        result.push(word);
        
        // Move to next position
        i += length;
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) where n is the total length of all strings |
| **Space** | O(n) for the encoded string and result |

---

## Approach 2: Unicode Escape Encoding

### Algorithm Steps

1. **For encode()**:
   - For each character, convert to Unicode escape sequence
   - Use a special marker to indicate the start of Unicode sequences
   - Concatenate all escaped strings

2. **For decode()**:
   - Parse the special marker to identify Unicode sequences
   - Convert Unicode sequences back to characters
   - Split into original strings

### Why It Works

By escaping all characters to Unicode, we eliminate the possibility of delimiter collision entirely. Any character can be represented as `\uXXXX`.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def encode(self, strs: List[str]) -> str:
        encoded = ""
        for s in strs:
            # Escape each character to Unicode
            escaped = "".join(f"\\u{ord(c):04x}" for c in s)
            encoded += str(len(escaped)) + "#" + escaped + "|" 
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
            
            # Extract escaped string
            escaped = s[i:i + length]
            # Convert back to regular string
            word = bytes(escaped, 'utf-8').decode('unicode_escape')
            result.append(word)
            
            i += length + 1  # Skip the '|' delimiter
        
        return result
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <sstream>
using namespace std;

class Solution {
public:
    string encode(vector<string>& strs) {
        string encoded = "";
        for (const string& s : strs) {
            string escaped = "";
            for (char c : s) {
                char buffer[10];
                sprintf(buffer, "\\u%04x", (unsigned char)c);
                escaped += buffer;
            }
            encoded += to_string(escaped.length()) + "#" + escaped + "|";
        }
        return encoded;
    }
    
    vector<string> decode(string s) {
        vector<string> result;
        size_t i = 0;
        
        while (i < s.length()) {
            size_t j = i;
            while (s[j] != '#') j++;
            int length = stoi(s.substr(i, j - i));
            i = j + 1;
            
            string escaped = s.substr(i, length);
            // Decode Unicode escapes
            string word = "";
            for (size_t k = 0; k < escaped.length(); k++) {
                if (escaped.substr(k, 2) == "\\u") {
                    int code = stoi(escaped.substr(k + 2, 4), nullptr, 16);
                    word += (char)code;
                    k += 5;
                } else {
                    word += escaped[k];
                }
            }
            result.push_back(word);
            i += length + 1;
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

public class Solution {
    public String encode(List<String> strs) {
        StringBuilder encoded = new StringBuilder();
        for (String s : strs) {
            StringBuilder escaped = new StringBuilder();
            for (char c : s.toCharArray()) {
                escaped.append(String.format("\\u%04x", (int)c));
            }
            encoded.append(escaped.length()).append("#").append(escaped).append("|");
        }
        return encoded.toString();
    }
    
    public List<String> decode(String s) {
        List<String> result = new ArrayList<>();
        int i = 0;
        
        while (i < s.length()) {
            int j = i;
            while (s.charAt(j) != '#') j++;
            int length = Integer.parseInt(s.substring(i, j));
            i = j + 1;
            
            String escaped = s.substring(i, i + length);
            StringBuilder word = new StringBuilder();
            for (int k = 0; k < escaped.length(); k++) {
                if (escaped.substring(k, k + 2).equals("\\u")) {
                    int code = Integer.parseInt(escaped.substring(k + 2, k + 6), 16);
                    word.append((char)code);
                    k += 5;
                } else {
                    word.append(escaped.charAt(k));
                }
            }
            result.add(word.toString());
            i += length + 1;
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
var encode = function(strs) {
    let encoded = "";
    for (const s of strs) {
        let escaped = "";
        for (let i = 0; i < s.length; i++) {
            const code = s.charCodeAt(i);
            escaped += "\\u" + code.toString(16).padStart(4, "0");
        }
        encoded += escaped.length + "#" + escaped + "|";
    }
    return encoded;
};

var decode = function(s) {
    const result = [];
    let i = 0;
    
    while (i < s.length) {
        let j = i;
        while (s[j] !== '#') j++;
        const length = parseInt(s.substring(i, j));
        i = j + 1;
        
        const escaped = s.substring(i, i + length);
        let word = "";
        for (let k = 0; k < escaped.length; k++) {
            if (escaped.substring(k, k + 2) === "\\u") {
                const code = parseInt(escaped.substring(k + 2, k + 6), 16);
                word += String.fromCharCode(code);
                k += 5;
            } else {
                word += escaped[k];
            }
        }
        result.push(word);
        i += length + 1;
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) where n is the total length of all strings |
| **Space** | O(n) for the encoded string |

---

## Approach 3: Chunked Encoding (For Very Long Strings)

### Algorithm Steps

1. **For encode()**:
   - Split long strings into manageable chunks
   - Mark chunks with special indicators
   - Combine all chunks with length prefixes

2. **For decode()**:
   - Reassemble chunks based on chunk markers
   - Reconstruct original strings

### Why It Works

This approach handles very long strings that might cause issues with very large length prefixes.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    CHUNK_SIZE = 1000  # Maximum characters per chunk
    
    def encode(self, strs: List[str]) -> str:
        encoded = ""
        for s in strs:
            # Split into chunks if needed
            for i in range(0, len(s), self.CHUNK_SIZE):
                chunk = s[i:i + self.CHUNK_SIZE]
                encoded += str(len(chunk)) + "#" + chunk
            # Mark end of string
            encoded += "0#"
        return encoded

    def decode(self, s: str) -> List[str]:
        result = []
        i = 0
        
        while i < len(s):
            word = ""
            while True:
                j = i
                while s[j] != '#':
                    j += 1
                length = int(s[i:j])
                i = j + 1
                
                if length == 0:  # End of current string
                    break
                    
                chunk = s[i:i + length]
                word += chunk
                i += length
            
            result.append(word)
        
        return result
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
using namespace std;

class Solution {
    const int CHUNK_SIZE = 1000;
    
public:
    string encode(vector<string>& strs) {
        string encoded = "";
        for (const string& s : strs) {
            for (size_t i = 0; i < s.length(); i += CHUNK_SIZE) {
                string chunk = s.substr(i, CHUNK_SIZE);
                encoded += to_string(chunk.length()) + "#" + chunk;
            }
            encoded += "0#";
        }
        return encoded;
    }
    
    vector<string> decode(string s) {
        vector<string> result;
        size_t i = 0;
        
        while (i < s.length()) {
            string word = "";
            while (true) {
                size_t j = i;
                while (s[j] != '#') j++;
                int length = stoi(s.substr(i, j - i));
                i = j + 1;
                
                if (length == 0) break;
                
                word += s.substr(i, length);
                i += length;
            }
            result.push_back(word);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

public class Solution {
    private static final int CHUNK_SIZE = 1000;
    
    public String encode(List<String> strs) {
        StringBuilder encoded = new StringBuilder();
        for (String s : strs) {
            for (int i = 0; i < s.length(); i += CHUNK_SIZE) {
                int end = Math.min(i + CHUNK_SIZE, s.length());
                String chunk = s.substring(i, end);
                encoded.append(chunk.length()).append("#").append(chunk);
            }
            encoded.append("0#");
        }
        return encoded.toString();
    }
    
    public List<String> decode(String s) {
        List<String> result = new ArrayList<>();
        int i = 0;
        
        while (i < s.length()) {
            StringBuilder word = new StringBuilder();
            while (true) {
                int j = i;
                while (s.charAt(j) != '#') j++;
                int length = Integer.parseInt(s.substring(i, j));
                i = j + 1;
                
                if (length == 0) break;
                
                word.append(s.substring(i, i + length));
                i += length;
            }
            result.add(word.toString());
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
const CHUNK_SIZE = 1000;

var encode = function(strs) {
    let encoded = "";
    for (const s of strs) {
        for (let i = 0; i < s.length; i += CHUNK_SIZE) {
            const chunk = s.substring(i, i + CHUNK_SIZE);
            encoded += chunk.length + "#" + chunk;
        }
        encoded += "0#";
    }
    return encoded;
};

var decode = function(s) {
    const result = [];
    let i = 0;
    
    while (i < s.length) {
        let word = "";
        while (true) {
            let j = i;
            while (s[j] !== '#') j++;
            const length = parseInt(s.substring(i, j));
            i = j + 1;
            
            if (length === 0) break;
            
            word += s.substring(i, i + length);
            i += length;
        }
        result.push(word);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) where n is the total length of all strings |
| **Space** | O(n) for the encoded string |

---

## Comparison of Approaches

| Aspect | Length-Prefixed | Unicode Escape | Chunked Encoding |
|--------|-----------------|----------------|-------------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Efficiency** | Best | Medium | Good |
| **Handles Special Chars** | Yes | Yes | Yes |
| **Implementation** | Simple | Complex | Moderate |
| **LeetCode Optimal** | ✅ | ❌ | ❌ |

**Best Approach:** Use Approach 1 (Length-Prefixed Encoding) for the optimal solution. It's simple, efficient, and handles all cases.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Meta, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: String Manipulation, Data Serialization, Edge Case Handling

### Learning Outcomes

1. **String Serialization**: Understanding how to serialize complex data structures
2. **Delimiter Handling**: Learning to handle ambiguous delimiters
3. **Edge Cases**: Managing empty strings and special characters
4. **Protocol Design**: Designing encoding schemes for data transmission

---

## Related Problems

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Serialize and Deserialize Binary Tree | [Link](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) | Tree serialization |
| Serialize and Deserialize BST | [Link](https://leetcode.com/problems/serialize-and-deserialize-bst/) | BST serialization |
| Design Compressed String Iterator | [Link](https://leetcode.com/problems/design-compressed-string-iterator/) | String decoding |

### Pattern Reference

For more detailed explanations of string encoding patterns, see:
- **[String Manipulation Patterns](/patterns/string)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Encode and Decode Strings](https://www.youtube.com/watch?v=BG4R1EJPhS4)** - Clear explanation with visual examples
2. **[Encode and Decode Strings - LeetCode 271](https://www.youtube.com/watch?v=dhF6Bj搓4)** - Detailed walkthrough

### Related Concepts

- **[String Serialization Basics](https://www.youtube.com/watch?v=GYpRlX_r_gM)** - Understanding serialization
- **[Length-Prefixed Protocols](https://www.youtube.com/watch?v=hVNpb5aMl5I)** - Network protocol basics

---

## Follow-up Questions

### Q1: How would you handle Unicode characters beyond ASCII?

**Answer:** The length-prefixed approach works naturally with Unicode since we're dealing with character counts, not byte counts. However, for byte-level encoding, you'd need to consider UTF-8 encoding where characters may use variable number of bytes.

---

### Q2: What if you needed to handle binary data (not just text)?

**Answer:** For binary data:
- Use base64 encoding to convert binary to text-friendly characters
- Then apply the length-prefixed encoding
- Base64 expands data by approximately 33%

---

### Q3: How would you add compression to reduce the encoded size?

**Answer:** To add compression:
- Apply gzip or similar compression before encoding
- The compression should happen on the entire concatenated string
- Add a compression header to indicate compression was used
- Note: For very short strings, compression may actually increase size

---

### Q4: Can you design a streaming decoder that doesn't require loading the entire string into memory?

**Answer:** For streaming:
- Process character by character from an input stream
- Buffer until you find a complete length prefix
- Then read that many characters
- This is useful for very large encoded strings

---

### Q5: How would you handle version compatibility in your encoding scheme?

**Answer:** For versioning:
- Add a version number at the start of the encoded string
- Different versions can have different encoding rules
- The decoder can check the version and apply appropriate decoding logic

---

## Common Pitfalls

### 1. Delimiter Collision
**Issue**: Using just a delimiter (like `#`) can fail if the string contains that character.

**Solution**: The length prefix solves this - we always know exactly how many characters to read.

### 2. Wrong Parsing Order
**Issue**: In decode, make sure to advance the index correctly after reading the length and the string.

**Solution**: Use two pointers - one for finding the delimiter, one for extracting the string.

### 3. Empty String Handling
**Issue**: Empty strings should be encoded as `0#` followed by nothing.

**Solution**: Ensure the decoder correctly handles length 0 - don't try to extract any characters.

### 4. Integer Overflow
**Issue**: For very long strings, ensure your integer parsing can handle large length values.

**Solution**: Use appropriate data types that can hold large integer values.

---

## Summary

The **Encode and Decode Strings** problem demonstrates key concepts in data serialization:

- **Length-Prefixed Encoding**: Using length as a delimiter to avoid ambiguity
- **O(1) Character Lookup**: Efficient string slicing for extraction
- **Edge Case Handling**: Managing empty strings and special characters

Key takeaways:
1. Use length-prefixed encoding to handle any character
2. Parse length first, then extract exact number of characters
3. Use a simple delimiter (`#`) that won't appear in length digits
4. O(n) time and space complexity for both encode and decode

This problem is essential for understanding data serialization, which is fundamental in network communication and data storage.

### Pattern Summary

This problem exemplifies the **String Encoding** pattern, characterized by:
- Converting complex data structures to transferable strings
- Using delimiters or length prefixes for unambiguous parsing
- Handling edge cases with special characters

For more details on this pattern and its variations, see the **[String Manipulation Patterns](/patterns/string)**.

---

## Additional Resources

- [LeetCode Problem 271](https://leetcode.com/problems/encode-and-decode-strings/) - Official problem page
- [Unicode Escape Sequences](https://en.wikipedia.org/wiki/Escape_sequence) - Character encoding
- [Base64 Encoding](https://en.wikipedia.org/wiki/Base64) - Binary-to-text encoding
- [Pattern: String Manipulation](/patterns/string) - Comprehensive pattern guide
