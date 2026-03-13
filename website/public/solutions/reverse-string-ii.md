# Reverse String II

## Problem Description

Given a string `s` and an integer `k`, reverse the first `k` characters for every `2k` characters counting from the start of the string.

If there are fewer than `k` characters left, reverse all of them. If there are less than `2k` but greater than or equal to `k` characters, then reverse the first `k` characters and leave the rest as original.

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `s = "abcdefg"`<br>`k = 2` | `"bacdfeg"` |

**Explanation:**
- First 2k = 4 characters: "abcd"
- Reverse first k = 2 characters: "ab" → "ba"
- Remaining: "cd" (stay as is)
- Result: "ba" + "cd" + "efg" = "bacdfeg"

**Example 2:**

| Input | Output |
|-------|--------|
| `s = "abcd"`<br>`k = 2` | `"bacd"` |

**Explanation:**
- String has only 4 characters (less than 2k = 4)
- Reverse first k = 2 characters: "ab" → "ba"
- Remaining: "cd"
- Result: "ba" + "cd" = "bacd"

## Constraints

- `1 <= s.length <= 10^4`
- `s` consists of only lowercase English letters.
- `1 <= k <= 10^4`

---

## Pattern: Modified String Reversal

This problem demonstrates the **Modified String Reversal** pattern, which involves reversing substrings at regular intervals.

### Core Concept

The key idea is to:
1. Process the string in chunks of size 2k
2. For each chunk, reverse the first k characters
3. Leave the remaining k characters in their original order
4. Handle edge cases for strings shorter than k or between k and 2k

---

## Intuition

The key insight for this problem is understanding the repeating pattern in the string reversal. We process the string in fixed-size chunks and reverse only part of each chunk.

### Key Observations

1. **Pattern of 2k**: The string is processed in groups of 2k characters. Within each group, we reverse the first k characters and leave the next k characters unchanged.

2. **Boundary Handling**: The main challenge is handling edge cases:
   - If fewer than k characters remain: reverse all
   - If between k and 2k characters remain: reverse first k, leave rest

3. **Two-Pointer Reversal**: Within each chunk, two pointers (one at start, one at end) can efficiently reverse the substring.

4. **In-Place Modification**: By converting to a character array, we can modify the string in place without extra memory for new strings.

### Why Process in Chunks?

The pattern of reversing every 2k characters creates a specific rhythm:
- For s = "abcdefg", k = 2:
- Chunk 1 (0-3): "abcd" → reverse first 2 → "ba cd" → "bacd"
- Chunk 2 (4-6): "efg" → fewer than k, reverse all → "gf" + "e" → Wait, actually: reverse first 2 → "fe" + "g" = "feg"
- Final: "bacdfeg"

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Two-Pointer Approach** - Optimal O(n) time, O(n) space
2. **Direct Index Manipulation** - O(n) time, O(n) space
3. **Character Array with Custom Reversal** - O(n) time, O(n) space

---

## Approach 1: Two-Pointer Approach (Optimal)

This is a straightforward and efficient approach that uses two pointers to process each chunk.

### Algorithm Steps

1. Convert string to character array for mutability
2. Iterate through the string with step size of 2k
3. For each chunk, use two pointers to reverse the first k characters
4. Continue until all chunks are processed

### Why It Works

The two-pointer technique efficiently reverses substrings in-place by swapping characters from the beginning and end moving towards the center.

### Code Implementation

````carousel
```python
class Solution:
    def reverseStr(self, s: str, k: int) -> str:
        """
        Reverse string in chunks of 2k characters.
        
        Args:
            s: Input string
            k: Chunk size for reversal
            
        Returns:
            Modified string with first k chars reversed per 2k chunk
        """
        # Convert to list for mutability
        s_list = list(s)
        n = len(s_list)
        
        # Process in chunks of 2k
        for start in range(0, n, 2 * k):
            # Set left and right pointers for reversal
            left = start
            # Minimum of (start + k - 1) and (n - 1)
            right = min(start + k - 1, n - 1)
            
            # Reverse the first k characters
            while left < right:
                s_list[left], s_list[right] = s_list[right], s_list[left]
                left += 1
                right -= 1
        
        return ''.join(s_list)
```

<!-- slide -->
```cpp
class Solution {
public:
    string reverseStr(string s, int k) {
        int n = s.length();
        
        // Process in chunks of 2k
        for (int start = 0; start < n; start += 2 * k) {
            // Set left and right pointers for reversal
            int left = start;
            // Minimum of (start + k - 1) and (n - 1)
            int right = min(start + k - 1, n - 1);
            
            // Reverse the first k characters
            while (left < right) {
                swap(s[left], s[right]);
                left++;
                right--;
            }
        }
        
        return s;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String reverseStr(String s, int k) {
        char[] arr = s.toCharArray();
        int n = arr.length;
        
        // Process in chunks of 2k
        for (int start = 0; start < n; start += 2 * k) {
            // Set left and right pointers for reversal
            int left = start;
            // Minimum of (start + k - 1) and (n - 1)
            int right = Math.min(start + k - 1, n - 1);
            
            // Reverse the first k characters
            while (left < right) {
                char temp = arr[left];
                arr[left] = arr[right];
                arr[right] = temp;
                left++;
                right--;
            }
        }
        
        return new String(arr);
    }
}
```

<!-- slide -->
```javascript
/**
 * Reverse string in chunks of 2k characters.
 * 
 * @param {string} s - Input string
 * @param {number} k - Chunk size for reversal
 * @return {string} - Modified string
 */
var reverseStr = function(s, k) {
    // Convert to array for mutability
    const arr = s.split('');
    const n = arr.length;
    
    // Process in chunks of 2k
    for (let start = 0; start < n; start += 2 * k) {
        // Set left and right pointers for reversal
        let left = start;
        // Minimum of (start + k - 1) and (n - 1)
        let right = Math.min(start + k - 1, n - 1);
        
        // Reverse the first k characters
        while (left < right) {
            [arr[left], arr[right]] = [arr[right], arr[left]];
            left++;
            right--;
        }
    }
    
    return arr.join('');
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each character is visited at most once |
| **Space** | O(n) - Character array for mutability |

---

## Approach 2: Direct Index Manipulation

This approach directly manipulates indices without explicit two-pointer helper.

### Algorithm Steps

1. Convert string to character array
2. Iterate through string with step 2k
3. Use direct index manipulation to reverse portions

### Why It Works

Same principle as two-pointer but using direct index calculation.

### Code Implementation

````carousel
```python
class Solution:
    def reverseStr_direct(self, s: str, k: int) -> str:
        """Reverse using direct index manipulation."""
        s_list = list(s)
        n = len(s_list)
        
        for i in range(0, n, 2 * k):
            # Determine the end of the reversal segment
            end = min(i + k, n)
            
            # Reverse from i to end-1
            for j in range(i, (i + end) // 2):
                s_list[j], s_list[end - 1 - (j - i)] = \
                    s_list[end - 1 - (j - i)], s_list[j]
        
        return ''.join(s_list)
```

<!-- slide -->
```cpp
class Solution {
public:
    string reverseStr(string s, int k) {
        int n = s.size();
        
        for (int i = 0; i < n; i += 2 * k) {
            // Determine the end of the reversal segment
            int end = min(i + k, n);
            
            // Reverse from i to end-1
            for (int j = i; j < (i + end) / 2; j++) {
                swap(s[j], s[end - 1 - (j - i)]);
            }
        }
        
        return s;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String reverseStr(String s, int k) {
        char[] arr = s.toCharArray();
        int n = arr.length;
        
        for (int i = 0; i < n; i += 2 * k) {
            // Determine the end of the reversal segment
            int end = Math.min(i + k, n);
            
            // Reverse from i to end-1
            for (int j = i; j < (i + end) / 2; j++) {
                char temp = arr[j];
                arr[j] = arr[end - 1 - (j - i)];
                arr[end - 1 - (j - i)] = temp;
            }
        }
        
        return new String(arr);
    }
}
```

<!-- slide -->
```javascript
var reverseStr = function(s, k) {
    const arr = s.split('');
    const n = arr.length;
    
    for (let i = 0; i < n; i += 2 * k) {
        // Determine the end of the reversal segment
        const end = Math.min(i + k, n);
        
        // Reverse from i to end-1
        for (let j = i; j < Math.floor((i + end) / 2); j++) {
            const temp = arr[j];
            arr[j] = arr[end - 1 - (j - i)];
            arr[end - 1 - (j - i)] = temp;
        }
    }
    
    return arr.join('');
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each character visited at most once |
| **Space** | O(n) - Character array |

---

## Approach 3: Using Built-in Reverse Functions

This approach leverages built-in reversal functions for cleaner code.

### Algorithm Steps

1. Convert string to list
2. Use built-in reverse on slices
3. Join back to string

### Why It Works

Built-in functions are optimized and handle edge cases well.

### Code Implementation

````carousel
```python
class Solution:
    def reverseStr_builtin(self, s: str, k: int) -> str:
        """Reverse using Python's built-in reversed function."""
        s_list = list(s)
        n = len(s_list)
        
        for i in range(0, n, 2 * k):
            # Determine the end of reversal
            end = min(i + k, n)
            # Reverse this portion in-place using slicing
            s_list[i:end] = reversed(s_list[i:end])
        
        return ''.join(s_list)
```

<!-- slide -->
```cpp
class Solution {
public:
    string reverseStr(string s, int k) {
        int n = s.size();
        
        for (int i = 0; i < n; i += 2 * k) {
            // Use std::reverse
            int end = min(i + k, n);
            reverse(s.begin() + i, s.begin() + end);
        }
        
        return s;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String reverseStr(String s, int k) {
        char[] arr = s.toCharArray();
        int n = arr.length;
        
        for (int i = 0; i < n; i += 2 * k) {
            int end = Math.min(i + k, n);
            // Reverse manually in Java
            int left = i, right = end - 1;
            while (left < right) {
                char temp = arr[left];
                arr[left] = arr[right];
                arr[right] = temp;
                left++;
                right--;
            }
        }
        
        return new String(arr);
    }
}
```

<!-- slide -->
```javascript
var reverseStr = function(s, k) {
    const arr = s.split('');
    const n = arr.length;
    
    for (let i = 0; i < n; i += 2 * k) {
        const end = Math.min(i + k, n);
        // Reverse using slice and reverse
        const reversed = arr.slice(i, end).reverse();
        arr.splice(i, end - i, ...reversed);
    }
    
    return arr.join('');
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each character visited at most once |
| **Space** | O(n) - Character array |

---

## Comparison of Approaches

| Aspect | Two-Pointer | Direct Index | Built-in |
|--------|-------------|--------------|----------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(n) | O(n) | O(n) |
| **Readability** | Good | Moderate | Best |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes |

**Best Approach:** Any approach works as they all achieve O(n) time. The two-pointer approach is more explicit and easier to understand.

---

## Why This Problem is Important

This problem demonstrates:

1. **String Manipulation**: Working with mutable strings efficiently
2. **Pattern Recognition**: Identifying repeating patterns in data
3. **Boundary Handling**: Properly handling edge cases
4. **In-place Operations**: Reversing without extra memory

---

## Related Problems

Based on similar themes (string manipulation, reversal patterns):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Reverse String | [Link](https://leetcode.com/problems/reverse-string/) | Basic string reversal |
| Reverse Words in a String III | [Link](https://leetcode.com/problems/reverse-words-in-a-string-iii/) | Reverse words |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Reverse String II | This problem | Current problem |
| Reverse Words in a String | [Link](https://leetcode.com/problems/reverse-words-in-a-string/) | Complex word reversal |

### Pattern Reference

For more detailed explanations of string manipulation patterns, see:
- **[Two Pointers - String Reversal](/patterns/two-pointers-string-reversal)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### String Reversal Techniques

- [NeetCode - Reverse String II](https://www.youtube.com/watch?v=HF2mT7i8YvY) - Clear explanation with examples
- [Reverse String II - Explanation](https://www.youtube.com/watch?v=v0sBpqrGGps) - Detailed walkthrough
- [String Manipulation Guide](https://www.youtube.com/watch?v=y3mB5f87p9Q) - Complete string guide

### Related Problems

- [Reverse String](https://www.youtube.com/watch?v=6qQouqT0tZQ) - Basic reversal
- [Two Pointers Technique](https://www.youtube.com/watch?v=p--CQXwg8w8) - Understanding two pointers

---

## Follow-up Questions

### Q1: What is the time and space complexity of the solution?

**Answer:** The time complexity is O(n) because each character is visited at most once. The space complexity is O(n) because we need to convert the string to a mutable character array.

---

### Q2: Can you solve it in O(1) extra space?

**Answer:** In languages like Python and Java where strings are immutable, we need O(n) space. However, in C++ the string can be modified in-place, achieving O(1) extra space.

---

### Q3: How would you handle a very large value of k?

**Answer:** The algorithm naturally handles large k because `min(start + k - 1, n - 1)` ensures we don't go beyond the string bounds. If k >= n, the entire string gets reversed.

---

### Q4: What if k is 0?

**Answer:** According to constraints, k >= 1, so this case won't occur. If it did, no reversal would happen.

---

### Q5: How would you modify the solution to reverse the last k characters if they exist instead of the first?

**Answer:** You would modify the iteration to process from the end, or use a different pattern for the last incomplete chunk.

---

### Q6: What edge cases should be tested?

**Answer:**
- k = 1 (no effective reversal)
- k >= n (reverse entire string)
- n exactly equals k (reverse entire string)
- n exactly equals 2k (reverse first k, keep second k)
- Single character string
- Empty string (though constraint says n >= 1)

---

### Q7: How does this relate to real-world applications?

**Answer:** This pattern is useful in:
- Data encryption/decryption scenarios
- Text formatting applications
- Displaying data in specific orders

---

### Q8: What if you needed to reverse every kth character instead of the first k?

**Answer:** You would modify the inner loop to skip characters or use a different step size in the outer loop.

---

### Q9: How would you extend this to work with Unicode characters?

**Answer:** The solution works with Unicode because it operates on characters (code points) rather than bytes. However, you might need to handle grapheme clusters for complex Unicode.

---

### Q10: What is the difference between this and the standard reverse string problem?

**Answer:** The standard reverse string reverses the entire string. This problem reverses only portions at regular intervals (every 2k characters).

---

## Common Pitfalls

### 1. Off-by-One Errors
**Issue**: Incorrect boundary calculations when k > remaining characters.

**Solution**: Use `min(start + k, n)` to ensure we don't exceed string bounds.

### 2. String Immutability
**Issue**: Trying to modify string directly in Python/Java.

**Solution**: Convert to list/array first.

### 3. Forgetting to Convert Back
**Issue**: Returning the list instead of string.

**Solution**: Join the character array back to string.

### 4. Incorrect Step Size
**Issue**: Using k instead of 2k as the step.

**Solution**: Remember the pattern is 2k characters per iteration.

### 5. Not Handling Last Chunk
**Issue**: Assuming every chunk has exactly k characters.

**Solution**: Use min() to handle remaining characters properly.

---

## Summary

The **Reverse String II** problem demonstrates efficient string manipulation:

- **Two-pointer approach**: Explicit and easy to understand
- **Direct index approach**: More mathematical
- **Built-in approach**: Cleanest code

The key insight is processing the string in chunks of 2k and reversing only the first k characters in each chunk.

This problem is excellent for understanding string manipulation and boundary condition handling.

### Pattern Summary

This problem exemplifies the **Modified String Reversal** pattern, which is characterized by:
- Processing strings in fixed-size chunks
- Reversing portions while leaving others intact
- Handling edge cases for incomplete chunks
- Achieving O(n) time complexity

For more details on string manipulation patterns, see the **[Two Pointers - String Reversal Pattern](/patterns/two-pointers-string-reversal)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/reverse-string-ii/discuss/) - Community solutions
- [String Manipulation - GeeksforGeeks](https://www.geeksforgeeks.org/string-manipulation-in-programming/) - String operations
- [Two Pointers Technique](https://www.geeksforgeeks.org/two-pointer-technique/) - Understanding two pointers
- [Pattern: Two Pointers - String Reversal](/patterns/two-pointers-string-reversal) - Comprehensive pattern guide
