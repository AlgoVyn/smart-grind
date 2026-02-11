# Reverse Words in a String

## Problem Statement

Given an input string `s`, reverse the order of the words. A word is defined as a sequence of non-space characters. The input string may contain leading or trailing spaces, and there may be multiple spaces between words. The output string should have a single space between each word and no leading or trailing spaces.

**Link to problem:** [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string/)

**Constraints:**
- `1 <= s.length <= 10^4`
- `s` consists of English letters (both uppercase and lowercase), digits, and spaces `' '`
- `s` may contain leading or trailing spaces, or multiple consecutive spaces

**Note:**
- You must solve this **in-place** if you use mutable data structures
- The returned string should have words separated by a single space
- No leading or trailing spaces in the output

---

## Examples

### Example 1

**Input:**
```
s = "the sky is blue"
```

**Output:**
```
"blue is sky the"
```

**Explanation:** The words are reversed while maintaining their individual order within each word.

---

### Example 2

**Input:**
```
s = "  hello world  "
```

**Output:**
```
"world hello"
```

**Explanation:** Leading and trailing spaces are removed, and multiple spaces between words are reduced to a single space.

---

### Example 3

**Input:**
```
s = "a good   example"
```

**Output:**
```
"example good a"
```

**Explanation:** The spaces are normalized, and the words are reversed in order.

---

### Example 4

**Input:**
```
s = "Bob Loves Alice"
```

**Output:**
```
"Alice Loves Bob"
```

---

### Example 5

**Input:**
```
s = "Alice"
```

**Output:**
```
"Alice"
```

**Explanation:** A single word remains unchanged when reversed.

---

## Intuition

The problem requires reversing the order of words in a string while also handling extra spaces. There are several intuitive approaches:

### Approach 1: Built-in Split and Join (Most Straightforward)

The simplest approach uses the programming language's built-in string manipulation functions to split the string into words, reverse the list, and join them back with single spaces.

### Approach 2: Two-pointer In-place Reversal

A more algorithmic approach that:
1. Removes extra spaces by shifting characters
2. Reverses the entire string
3. Reverses each individual word back to correct orientation

### Approach 3: Stack-based Approach

Uses a stack (or similar data structure) to collect words and then reverses the order by popping them off.

### Approach 4: Manual Word Extraction

Manually parses the string character by character, extracting words and building the result in reverse order.

---

## Multiple Approaches with Code

We'll cover four approaches:

1. **Built-in Split and Join** - Simple and readable
2. **Two-pointer In-place Reversal** - O(1) extra space
3. **Stack-based Approach** - Clear word boundary handling
4. **Manual Word Extraction** - Full control over the process

---

## Approach 1: Built-in Split and Join

This is the most straightforward approach using language built-ins. It leverages the fact that most languages provide string splitting and joining functionality.

#### Algorithm Steps

1. Split the input string by spaces to get a list of words
2. Filter out any empty strings (caused by multiple/consecutive spaces)
3. Reverse the list of words
4. Join the reversed list with single spaces
5. Return the result

#### Code Implementation

````carousel
```python
class Solution:
    def reverseWords(self, s: str) -> str:
        """
        Reverse the order of words in a string.
        
        Args:
            s: Input string containing words separated by spaces
            
        Returns:
            String with words in reverse order, properly spaced
        """
        # Split by spaces, filter empty strings, reverse, and join
        words = s.split()
        reversed_words = words[::-1]
        return ' '.join(reversed_words)
```

<!-- slide -->
```cpp
class Solution {
public:
    string reverseWords(string s) {
        /**
         * Reverse the order of words in a string.
         * 
         * Args:
         *     s: Input string containing words separated by spaces
         * 
         * Returns:
         *     String with words in reverse order, properly spaced
         */
        // Use stringstream to extract words
        stringstream ss(s);
        string word;
        vector<string> words;
        
        // Extract all words
        while (ss >> word) {
            words.push_back(word);
        }
        
        // Build result in reverse order
        string result;
        for (int i = words.size() - 1; i >= 0; i--) {
            result += words[i];
            if (i > 0) {
                result += " ";
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String reverseWords(String s) {
        /**
         * Reverse the order of words in a string.
         * 
         * Args:
         *     s: Input string containing words separated by spaces
         * 
         * Returns:
         *     String with words in reverse order, properly spaced
         */
        // Split by spaces, filter empty strings, reverse, and join
        String[] words = s.trim().split("\\s+");
        StringBuilder result = new StringBuilder();
        
        // Build result in reverse order
        for (int i = words.length - 1; i >= 0; i--) {
            result.append(words[i]);
            if (i > 0) {
                result.append(" ");
            }
        }
        
        return result.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * Reverse the order of words in a string.
 * 
 * @param {string} s - Input string containing words separated by spaces
 * @return {string} - String with words in reverse order, properly spaced
 */
var reverseWords = function(s) {
    // Split by spaces, filter empty strings, reverse, and join
    const words = s.split(/\s+/).filter(word => word !== '');
    return words.reverse().join(' ');
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass to split, O(n) to reverse and join |
| **Space** | O(n) - Need to store all words in an array/list |

---

## Approach 2: Two-pointer In-place Reversal

This approach mimics how you would reverse words manually. It's more space-efficient as it works directly on the character array.

#### Algorithm Steps

1. Convert string to character array for in-place manipulation
2. Remove extra spaces by shifting characters to the front
3. Reverse the entire character array
4. Reverse each individual word to restore proper word orientation
5. Convert back to string and return

#### Code Implementation

````carousel
```python
class Solution:
    def reverseWords(self, s: str) -> str:
        """
        Reverse the order of words in a string using in-place reversal.
        
        Args:
            s: Input string containing words separated by spaces
            
        Returns:
            String with words in reverse order, properly spaced
        """
        # Convert to list of characters for in-place manipulation
        chars = list(s)
        
        # Helper function to reverse a portion of the array
        def reverse_range(arr, left, right):
            while left < right:
                arr[left], arr[right] = arr[right], arr[left]
                left += 1
                right -= 1
        
        # Step 1: Remove extra spaces
        n = len(chars)
        write = 0  # Position to write next character
        
        i = 0
        while i < n:
            # Skip leading spaces
            while i < n and chars[i] == ' ':
                i += 1
            
            if i >= n:
                break
            
            # Found the start of a word
            if write > 0:
                chars[write] = ' '
                write += 1
            
            # Copy the word
            while i < n and chars[i] != ' ':
                chars[write] = chars[i]
                write += 1
                i += 1
        
        # Resize to remove trailing garbage
        chars = chars[:write]
        
        # Step 2: Reverse entire string
        reverse_range(chars, 0, len(chars) - 1)
        
        # Step 3: Reverse each word
        start = 0
        for end in range(len(chars) + 1):
            if end == len(chars) or chars[end] == ' ':
                reverse_range(chars, start, end - 1)
                start = end + 1
        
        return ''.join(chars)
```

<!-- slide -->
```cpp
class Solution {
public:
    string reverseWords(string s) {
        /**
         * Reverse the order of words in a string using in-place reversal.
         * 
         * Args:
         *     s: Input string containing words separated by spaces
         * 
         * Returns:
         *     String with words in reverse order, properly spaced
         */
        auto reverseRange = [](vector<char>& arr, int left, int right) {
            while (left < right) {
                swap(arr[left], arr[right]);
                left++;
                right--;
            }
        };
        
        // Convert to vector for in-place manipulation
        vector<char> chars(s.begin(), s.end());
        
        // Step 1: Remove extra spaces
        int n = chars.size();
        int write = 0;
        
        for (int i = 0; i < n; i++) {
            // Skip leading spaces
            if (chars[i] == ' ' && (i == 0 || chars[i-1] == ' ')) {
                continue;
            }
            
            if (write > 0 && chars[i] != ' ') {
                chars[write++] = ' ';
            }
            
            if (chars[i] != ' ') {
                chars[write++] = chars[i];
            }
        }
        
        // Resize
        chars.resize(write);
        
        // Step 2: Reverse entire string
        reverseRange(chars, 0, chars.size() - 1);
        
        // Step 3: Reverse each word
        int start = 0;
        for (int end = 0; end <= chars.size(); end++) {
            if (end == chars.size() || chars[end] == ' ') {
                reverseRange(chars, start, end - 1);
                start = end + 1;
            }
        }
        
        // Convert back to string
        return string(chars.begin(), chars.end());
    }
};
```

<!-- slide -->
```java
class Solution {
    private void reverse(char[] arr, int left, int right) {
        while (left < right) {
            char temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }
    
    public String reverseWords(String s) {
        /**
         * Reverse the order of words in a string using in-place reversal.
         * 
         * Args:
         *     s: Input string containing words separated by spaces
         * 
         * Returns:
         *     String with words in reverse order, properly spaced
         */
        if (s == null || s.isEmpty()) {
            return s;
        }
        
        char[] chars = s.toCharArray();
        int n = chars.length;
        
        // Step 1: Remove extra spaces
        int write = 0;
        
        for (int i = 0; i < n; i++) {
            // Skip leading spaces
            if (chars[i] == ' ' && (i == 0 || chars[i-1] == ' ')) {
                continue;
            }
            
            if (write > 0 && chars[i] != ' ') {
                chars[write++] = ' ';
            }
            
            if (chars[i] != ' ') {
                chars[write++] = chars[i];
            }
        }
        
        // Resize to remove trailing garbage
        chars = Arrays.copyOf(chars, write);
        
        // Step 2: Reverse entire string
        reverse(chars, 0, chars.length - 1);
        
        // Step 3: Reverse each word
        int start = 0;
        for (int end = 0; end <= chars.length; end++) {
            if (end == chars.length || chars[end] == ' ') {
                reverse(chars, start, end - 1);
                start = end + 1;
            }
        }
        
        return new String(chars);
    }
}
```

<!-- slide -->
```javascript
/**
 * Reverse the order of words in a string using in-place reversal.
 * 
 * @param {string} s - Input string containing words separated by spaces
 * @return {string} - String with words in reverse order, properly spaced
 */
var reverseWords = function(s) {
    // Helper function to reverse a portion of the array
    const reverse = (arr, left, right) => {
        while (left < right) {
            [arr[left], arr[right]] = [arr[right], arr[left]];
            left++;
            right--;
        }
    };
    
    // Convert to array for in-place manipulation
    const chars = s.split('');
    
    // Step 1: Remove extra spaces
    let write = 0;
    
    for (let i = 0; i < chars.length; i++) {
        // Skip leading spaces
        if (chars[i] === ' ' && (i === 0 || chars[i-1] === ' ')) {
            continue;
        }
        
        if (write > 0 && chars[i] !== ' ') {
            chars[write++] = ' ';
        }
        
        if (chars[i] !== ' ') {
            chars[write++] = chars[i];
        }
    }
    
    // Resize
    chars.length = write;
    
    // Step 2: Reverse entire string
    reverse(chars, 0, chars.length - 1);
    
    // Step 3: Reverse each word
    let start = 0;
    for (let end = 0; end <= chars.length; end++) {
        if (end === chars.length || chars[end] === ' ') {
            reverse(chars, start, end - 1);
            start = end + 1;
        }
    }
    
    return chars.join('');
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each character is visited a constant number of times |
| **Space** | O(n) - Need character array for in-place manipulation |

---

## Approach 3: Stack-based Approach

This approach uses a stack data structure to collect words and then pops them off to create the reversed result. It's intuitive and clearly demonstrates word boundary handling.

#### Algorithm Steps

1. Parse the string character by character
2. Build up characters of the current word
3. When a space is encountered after a word, push the word onto the stack
4. After parsing all characters, pop words from the stack and join them with spaces

#### Code Implementation

````carousel
```python
class Solution:
    def reverseWords(self, s: str) -> str:
        """
        Reverse the order of words in a string using a stack.
        
        Args:
            s: Input string containing words separated by spaces
            
        Returns:
            String with words in reverse order, properly spaced
        """
        stack = []
        word = []
        n = len(s)
        
        i = 0
        while i < n:
            # Skip all spaces
            if s[i] == ' ':
                # If we have a word built up, push it to stack
                if word:
                    stack.append(''.join(word))
                    word = []
            else:
                # Build the current word
                word.append(s[i])
            i += 1
        
        # Don't forget the last word
        if word:
            stack.append(''.join(word))
        
        # Pop from stack to reverse order
        result = []
        while stack:
            result.append(stack.pop())
        
        return ' '.join(result)
```

<!-- slide -->
```cpp
class Solution {
public:
    string reverseWords(string s) {
        /**
         * Reverse the order of words in a string using a stack.
         * 
         * Args:
         *     s: Input string containing words separated by spaces
         * 
         * Returns:
         *     String with words in reverse order, properly spaced
         */
        stack<string> st;
        string word;
        
        for (char c : s) {
            if (c == ' ') {
                if (!word.empty()) {
                    st.push(word);
                    word.clear();
                }
            } else {
                word += c;
            }
        }
        
        // Don't forget the last word
        if (!word.empty()) {
            st.push(word);
        }
        
        // Build result from stack
        string result;
        while (!st.empty()) {
            result += st.top();
            st.pop();
            if (!st.empty()) {
                result += " ";
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String reverseWords(String s) {
        /**
         * Reverse the order of words in a string using a stack.
         * 
         * Args:
         *     s: Input string containing words separated by spaces
         * 
         * Returns:
         *     String with words in reverse order, properly spaced
         */
        Deque<String> stack = new ArrayDeque<>();
        StringBuilder word = new StringBuilder();
        
        for (char c : s.toCharArray()) {
            if (c == ' ') {
                if (word.length() > 0) {
                    stack.offerLast(word.toString());
                    word.setLength(0);
                }
            } else {
                word.append(c);
            }
        }
        
        // Don't forget the last word
        if (word.length() > 0) {
            stack.offerLast(word.toString());
        }
        
        // Build result from stack
        StringBuilder result = new StringBuilder();
        while (!stack.isEmpty()) {
            result.append(stack.pollLast());
            if (!stack.isEmpty()) {
                result.append(" ");
            }
        }
        
        return result.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * Reverse the order of words in a string using a stack.
 * 
 * @param {string} s - Input string containing words separated by spaces
 * @return {string} - String with words in reverse order, properly spaced
 */
var reverseWords = function(s) {
    const stack = [];
    let word = '';
    
    for (const char of s) {
        if (char === ' ') {
            if (word) {
                stack.push(word);
                word = '';
            }
        } else {
            word += char;
        }
    }
    
    // Don't forget the last word
    if (word) {
        stack.push(word);
    }
    
    // Build result from stack (popping reverses the order)
    const result = [];
    while (stack.length > 0) {
        result.push(stack.pop());
    }
    
    return result.join(' ');
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each character is processed exactly once |
| **Space** | O(n) - Stack stores all words in the string |

---

## Approach 4: Manual Word Extraction

This approach gives full control over the parsing process. It extracts words from the end of the string and builds the result directly.

#### Algorithm Steps

1. Start from the end of the string
2. Skip trailing spaces
3. Extract a word by moving backwards
4. Add the word to the result builder
5. Skip the spaces before the next word
6. Repeat until the beginning is reached

#### Code Implementation

````carousel
```python
class Solution:
    def reverseWords(self, s: str) -> str:
        """
        Reverse the order of words in a string by extracting from the end.
        
        Args:
            s: Input string containing words separated by spaces
            
        Returns:
            String with words in reverse order, properly spaced
        """
        n = len(s)
        result = []
        i = n - 1
        
        while i >= 0:
            # Skip trailing spaces
            while i >= 0 and s[i] == ' ':
                i -= 1
            
            if i < 0:
                break
            
            # Find the end of current word (moving backwards)
            end = i
            
            # Extract the word by moving backwards
            while i >= 0 and s[i] != ' ':
                i -= 1
            
            # Add the word to result
            word = s[i+1:end+1]
            result.append(word)
        
        return ' '.join(result)
```

<!-- slide -->
```cpp
class Solution {
public:
    string reverseWords(string s) {
        /**
         * Reverse the order of words in a string by extracting from the end.
         * 
         * Args:
         *     s: Input string containing words separated by spaces
         * 
         * Returns:
         *     String with words in reverse order, properly spaced
         */
        string result;
        int n = s.size();
        int i = n - 1;
        
        while (i >= 0) {
            // Skip trailing spaces
            while (i >= 0 && s[i] == ' ') {
                i--;
            }
            
            if (i < 0) {
                break;
            }
            
            // Find the end of current word
            int end = i;
            
            // Extract the word by moving backwards
            while (i >= 0 && s[i] != ' ') {
                i--;
            }
            
            // Add the word to result
            if (!result.empty()) {
                result += " ";
            }
            result += s.substr(i + 1, end - i);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String reverseWords(String s) {
        /**
         * Reverse the order of words in a string by extracting from the end.
         * 
         * Args:
         *     s: Input string containing words separated by spaces
         * 
         * Returns:
         *     String with words in reverse order, properly spaced
         */
        StringBuilder result = new StringBuilder();
        int n = s.length();
        int i = n - 1;
        
        while (i >= 0) {
            // Skip trailing spaces
            while (i >= 0 && s.charAt(i) == ' ') {
                i--;
            }
            
            if (i < 0) {
                break;
            }
            
            // Find the end of current word
            int end = i;
            
            // Extract the word by moving backwards
            while (i >= 0 && s.charAt(i) != ' ') {
                i--;
            }
            
            // Add the word to result
            if (result.length() > 0) {
                result.append(" ");
            }
            result.append(s.substring(i + 1, end + 1));
        }
        
        return result.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * Reverse the order of words in a string by extracting from the end.
 * 
 * @param {string} s - Input string containing words separated by spaces
 * @return {string} - String with words in reverse order, properly spaced
 */
var reverseWords = function(s) {
    const result = [];
    let i = s.length - 1;
    
    while (i >= 0) {
        // Skip trailing spaces
        while (i >= 0 && s[i] === ' ') {
            i--;
        }
        
        if (i < 0) {
            break;
        }
        
        // Find the end of current word
        const end = i;
        
        // Extract the word by moving backwards
        while (i >= 0 && s[i] !== ' ') {
            i--;
        }
        
        // Add the word to result
        result.push(s.substring(i + 1, end + 1));
    }
    
    return result.join(' ');
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each character is visited exactly once |
| **Space** | O(n) - Need to store the result words |

---

## Comparison of Approaches

| Aspect | Built-in Split/Join | Two-pointer Reversal | Stack-based | Manual Extraction |
|--------|-------------------|----------------------|-------------|-------------------|
| **Time Complexity** | O(n) | O(n) | O(n) | O(n) |
| **Space Complexity** | O(n) | O(n) | O(n) | O(n) |
| **Implementation** | Very Simple | Medium | Simple | Medium |
| **Code Readability** | High | Medium | High | Medium |
| **In-place Possible** | No* | Yes | No | No |
| **Edge Cases** | Handled well | Requires care | Handled well | Handled well |
| **Best For** | Quick solutions | Learning/Interview | Clarity | Understanding parsing |

*Note: While languages like Python strings are immutable, we can simulate in-place behavior with the two-pointer approach using character arrays.

---

## Why Built-in Split and Join is Often Preferred

The built-in approach is generally preferred because:

1. **Simplicity**: Leverages well-tested language built-ins
2. **Readability**: Code clearly expresses the intent
3. **Maintainability**: Easier to understand and modify
4. **Performance**: Built-ins are typically highly optimized
5. **Less Error-prone**: Fewer opportunities for off-by-one errors

However, understanding all approaches is valuable for:
- Interview scenarios where in-place solutions are requested
- Learning how string manipulation works under the hood
- Performance optimization in constrained environments

---

## Related Problems

Based on similar themes (string manipulation, word processing):

- **[Reverse String](https://leetcode.com/problems/reverse-string/)** - Reverse a character array
- **[Reverse Words in a String II](https://leetcode.com/problems/reverse-words-in-a-string-ii/)** - In-place solution with O(1) extra space
- **[Reverse String II](https://leetcode.com/problems/reverse-string-ii/)** - Reverse characters in chunks
- **[Backspace String Compare](https://leetcode.com/problems/backspace-string-compare/)** - String processing with special characters
- **[Most Common Word](https://leetcode.com/problems/most-common-word/)** - Word frequency analysis
- **[Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)** - String cleaning and processing
- **[Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/)** - String array processing

---

## Pattern Documentation

For a comprehensive guide on the **String Word Processing** pattern, including detailed explanations, multiple approaches, and templates in Python, C++, Java, and JavaScript, see:

- **[String Word Processing Pattern](../patterns/string-word-processing.md)** - Complete pattern documentation

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining the problem and solutions:

- [Reverse Words in a String - LeetCode 151](https://www.youtube.com/watch?v=ReU7Gf8a6n4) - Comprehensive explanation by NeetCode
- [Reverse Words in a String - Two Pointers Approach](https://www.youtube.com/watch?v=3plMbsxLkGI) - In-depth algorithm walkthrough
- [LeetCode 151 - Reverse Words in a String](https://www.youtube.com/watch?v=MnYBSD2rQaI) - Multiple approaches explained
- [String Manipulation Patterns](https://www.youtube.com/watch?v=1AJ4ldc2bBk) - General string processing techniques

---

## Followup Questions

### Q1: How would you reverse words in-place if the string is stored as a mutable array?

**Answer:** Convert the string to a character array, remove extra spaces, reverse the entire array, then reverse each individual word. This achieves O(1) additional space complexity (ignoring the array storage).

---

### Q2: What edge cases should you consider when solving this problem?

**Answer:** Key edge cases include:
- Empty string
- String with only spaces
- String with a single word
- String with leading/trailing spaces
- String with multiple consecutive spaces between words
- String with tabs or other whitespace characters (if applicable)

---

### Q3: How would you modify the solution to handle multiple types of whitespace (tabs, newlines)?

**Answer:** Use a more comprehensive whitespace check. Instead of just checking for `' '`, use `Character.isWhitespace()` in Java, `str.isspace()` in Python, or regex patterns like `\\s+` for splitting. Adjust the space removal logic accordingly.

---

### Q4: What's the difference between this problem and "Reverse Words in a String II"?

**Answer:** The main difference is the space complexity requirement. "Reverse Words in a String" allows O(n) extra space, while "Reverse Words in a String II" requires O(1) extra space. The latter forces an in-place solution using character array manipulation.

---

### Q5: How would you verify your solution works correctly?

**Answer:** Test with various cases:
1. Normal case: `"the sky is blue"` → `"blue is sky the"`
2. Leading/trailing spaces: `"  hello world  "` → `"world hello"`
3. Multiple spaces: `"a good   example"` → `"example good a"`
4. Single word: `"Alice"` → `"Alice"`
5. Empty or space-only: `""` → `""` or `" "` → `""`

---

### Q6: Can this algorithm be parallelized?

**Answer:** The word reversal itself is inherently sequential because each word's position depends on all other words. However, within a word, individual character reversals could theoretically be parallelized, but the overhead would likely exceed any benefit for typical string lengths.

---

### Q7: How would you count the number of words while reversing them?

**Answer:** You can maintain a counter during word extraction. For the split-based approach, simply use `len(words)` after splitting. For manual approaches, increment the counter each time you extract a complete word.

---

### Q8: What if you need to preserve the original string?

**Answer:** If the original string must be preserved:
- Use the built-in split approach which creates new strings anyway
- Make a copy of the character array before in-place manipulation
- Store the original string separately before processing

---

### Q9: How would you handle Unicode or multibyte characters?

**Answer:** In Python 3, strings are Unicode by default, and `split()` handles multibyte characters correctly. In C++/Java/JavaScript, ensure you're using proper Unicode-aware string functions and not assuming single-byte characters. Consider using UTF-8 encoding awareness if working with international text.

---

### Q10: What's the most space-efficient way to solve this problem?

**Answer:** The two-pointer approach using a character array is most space-efficient when considering additional data structures:
- Time: O(n)
- Space: O(n) for the character array (required for in-place operations in most languages)
- Additional space: O(1) for pointers/indices

---

## Summary

The "Reverse Words in a String" problem demonstrates important string manipulation techniques and word boundary handling. Several approaches exist, each with different trade-offs:

**Key Takeaways:**
- Built-in split and join provides the simplest and most readable solution
- Two-pointer reversal demonstrates algorithmic thinking and in-place manipulation
- Stack-based approach clearly separates concerns of word extraction and ordering
- Manual extraction gives full control over the parsing process
- All approaches achieve O(n) time complexity
- Edge cases (empty strings, multiple spaces) require careful handling
- Understanding multiple approaches prepares you for different interview constraints

This problem builds a strong foundation for more complex string processing challenges and prepares you for variations like in-place requirements or Unicode handling.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/reverse-words-in-a-string/discuss/) - Community solutions and explanations
- [String Manipulation in Python](https://docs.python.org/3/library/stdtypes.html#string-methods) - Python string documentation
- [C++ String Processing](https://en.cppreference.com/w/cpp/string) - C++ string reference
- [Java String Documentation](https://docs.oracle.com/javase/8/docs/api/java/lang/String.html) - Java String API
- [JavaScript String Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) - JS String reference
