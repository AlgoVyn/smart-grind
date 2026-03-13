# Decode String

## Problem Description

Given an encoded string, return its decoded string.

The encoding rule is: `k[encoded_string]`, where the encoded_string inside the square brackets is being repeated exactly `k` times. Note that `k` is guaranteed to be a positive integer.

You may assume that the input string is always valid; there are no extra white spaces, square brackets are well-formed, etc. Furthermore, you may assume that the original data does not contain any digits and that digits are only for those repeat numbers, `k`. For example, there will not be input like `3a` or `2[4]`.

The test cases are generated so that the length of the output will never exceed 10^5.

**Link to problem:** [Decode String - LeetCode 394](https://leetcode.com/problems/decode-string/)

## Constraints

- `1 <= s.length <= 30`
- `s` consists of lowercase English letters, digits, and square brackets '[]'.
- `s` is guaranteed to be a valid input.
- All the integers in `s` are in the range `[1, 300]`.

---

## Pattern: Stack-Based String Decoding

This problem is a classic example of the **Stack-Based String Decoding** pattern. The pattern handles nested encoded strings by using a stack to track context (previous string and repeat count) when entering a nested level.

### Core Concept

The fundamental idea is to use a stack to handle nesting:
- **When we see a digit**: Build the multi-digit number
- **When we see '['**: Push current string and number to stack, start fresh for inner string
- **When we see ']'**: Pop the previous context and repeat the current string
- **When we see a letter**: Append to current string

This mimics how a parser processes nested structures.

---

## Examples

### Example

**Input:**
```
s = "3[a]2[bc]"
```

**Output:**
```
"aaabcbc"
```

**Explanation:**
- "3[a]" means "aaa"
- "2[bc]" means "bcbc"
- Combined: "aaabcbc"

### Example 2

**Input:**
```
s = "3[a2[c]]"
```

**Output:**
```
"accaccacc"
```

**Explanation:**
- Inner: "2[c]" means "cc"
- Outer: "3[a...cc...]" means "a" + "cc" + "a" + "cc" + "a" + "cc" = "accaccacc"
- Nested levels: c appears 6 times, a appears 3 times

### Example 3

**Input:**
```
s = "2[abc]3[cd]ef"
```

**Output:**
```
"abcabccdcdcdef"
```

**Explanation:**
- "2[abc]" → "abcabc"
- "3[cd]" → "cdcdcd"
- "ef" → "ef"
- Combined: "abcabccdcdcdef"

---

## Intuition

The key insight is understanding how nested encoding works:

1. **Multi-digit Numbers**: Numbers can have multiple digits (e.g., "12[a]")

2. **Nested Brackets**: Brackets can be nested deeply, requiring us to remember the outer context

3. **Stack Usage**: The stack saves our place when entering a new bracket level and restores it when exiting

### Why It Works

Consider "3[a2[c]]":
- Start: curr_str = "", curr_num = 0
- See '3': curr_num = 3
- See '[': push (curr_str="", 3) to stack, reset
- See 'a': curr_str = "a"
- See '2': curr_num = 2
- See '[': push (curr_str="a", 2), reset
- See 'c': curr_str = "c"
- See ']': pop (prev_str="a", 2), curr_str = "a" + "c" * 2 = "acc"
- See ']': pop (prev_str="", 3), curr_str = "" + "acc" * 3 = "accaccacc"

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Stack-Based (Optimal)** - O(n) time, O(n) space
2. **Recursive Approach** - O(n) time, O(n) space
3. **Two Stack Approach** - O(n) time, O(n) space (separate stacks for strings and numbers)

---

## Approach 1: Stack-Based Processing (Optimal)

This is the most common and efficient approach. We use a single stack to store the previous string and repeat count.

### Algorithm Steps

1. Initialize: empty stack, current string = "", current number = 0
2. For each character in the string:
   - If digit: build multi-digit number
   - If '[': push (current string, number) to stack, reset for inner
   - If ']': pop (previous string, repeat count), combine and append
   - If letter: append to current string
3. Return current string

### Why It Works

The stack maintains the context for each nesting level:
- When entering '[', we save the outer state
- When exiting ']', we restore and combine with the inner result

### Code Implementation

````carousel
```python
class Solution:
    def decodeString(self, s: str) -> str:
        """
        Decode an encoded string with nested repetition.
        
        Args:
            s: Encoded string with k[string] format
            
        Returns:
            Decoded string
        """
        stack = []
        curr_str = ""
        curr_num = 0
        
        for c in s:
            if c.isdigit():
                # Build multi-digit number
                curr_num = curr_num * 10 + int(c)
            elif c == '[':
                # Push current state to stack
                stack.append((curr_str, curr_num))
                # Reset for inner string
                curr_str = ""
                curr_num = 0
            elif c == ']':
                # Pop previous state
                prev_str, num = stack.pop()
                # Repeat current string and combine with previous
                curr_str = prev_str + curr_str * num
            else:
                # Regular character, append to current string
                curr_str += c
        
        return curr_str
```

<!-- slide -->
```cpp
class Solution {
public:
    string decodeString(string s) {
        /**
         * Decode an encoded string with nested repetition.
         * 
         * Args:
         *     s: Encoded string with k[string] format
         * 
         * Returns:
         *     Decoded string
         */
        stack<pair<string, int>> st;
        string currStr = "";
        int currNum = 0;
        
        for (char c : s) {
            if (isdigit(c)) {
                // Build multi-digit number
                currNum = currNum * 10 + (c - '0');
            } else if (c == '[') {
                // Push current state to stack
                st.push({currStr, currNum});
                // Reset for inner string
                currStr = "";
                currNum = 0;
            } else if (c == ']') {
                // Pop previous state
                auto [prevStr, num] = st.top();
                st.pop();
                // Repeat current string and combine
                for (int i = 0; i < num; i++) {
                    prevStr += currStr;
                }
                currStr = prevStr;
            } else {
                // Regular character
                currStr += c;
            }
        }
        
        return currStr;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String decodeString(String s) {
        /**
         * Decode an encoded string with nested repetition.
         * 
         * Args:
         *     s: Encoded string with k[string] format
         * 
         * Returns:
         *     Decoded string
         */
        Stack<Pair<String, Integer>> stack = new Stack<>();
        StringBuilder currStr = new StringBuilder();
        int currNum = 0;
        
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) {
                // Build multi-digit number
                currNum = currNum * 10 + (c - '0');
            } else if (c == '[') {
                // Push current state to stack
                stack.push(new Pair<>(currStr.toString(), currNum));
                // Reset for inner string
                currStr = new StringBuilder();
                currNum = 0;
            } else if (c == ']') {
                // Pop previous state
                Pair<String, Integer> prev = stack.pop();
                StringBuilder temp = new StringBuilder(prev.getKey());
                for (int i = 0; i < prev.getValue(); i++) {
                    temp.append(currStr);
                }
                currStr = temp;
            } else {
                // Regular character
                currStr.append(c);
            }
        }
        
        return currStr.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * Decode an encoded string with nested repetition.
 * 
 * @param {string} s - Encoded string with k[string] format
 * @return {string} - Decoded string
 */
var decodeString = function(s) {
    const stack = [];
    let currStr = '';
    let currNum = 0;
    
    for (const c of s) {
        if (!isNaN(c) && c !== ' ') {
            // Build multi-digit number
            currNum = currNum * 10 + parseInt(c);
        } else if (c === '[') {
            // Push current state to stack
            stack.push([currStr, currNum]);
            // Reset for inner string
            currStr = '';
            currNum = 0;
        } else if (c === ']') {
            // Pop previous state
            const [prevStr, num] = stack.pop();
            // Repeat current string and combine
            currStr = prevStr + currStr.repeat(num);
        } else {
            // Regular character
            currStr += c;
        }
    }
    
    return currStr;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each character is processed once |
| **Space** | O(n) - Stack stores nested contexts |

---

## Approach 2: Recursive Approach

This approach uses recursion to handle the nested structure naturally, similar to how a parser would work.

### Algorithm Steps

1. Define a recursive function that processes from the current position
2. The function returns (decoded_string, new_position)
3. When seeing '[', recursively decode the inner string
4. When seeing ']', return the decoded string and position

### Code Implementation

````carousel
```python
class Solution:
    def decodeString_recursive(self, s: str) -> str:
        """
        Decode using recursive approach.
        
        Args:
            s: Encoded string
            
        Returns:
            Decoded string
        """
        def parse(index: int) -> tuple:
            result = ""
            num = 0
            
            while index < len(s):
                char = s[index]
                
                if char.isdigit():
                    num = num * 10 + int(char)
                elif char == '[':
                    # Recursively parse inner
                    inner, index = parse(index + 1)
                    result += inner * num
                    num = 0
                elif char == ']':
                    return result, index
                else:
                    result += char
                
                index += 1
            
            return result, index
        
        result, _ = parse(0)
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    string decodeStringRecursive(string s) {
        int pos = 0;
        return parse(s, pos);
    }
    
private:
    string parse(const string& s, int& pos) {
        string result = "";
        int num = 0;
        
        while (pos < s.length()) {
            char c = s[pos];
            
            if (isdigit(c)) {
                num = num * 10 + (c - '0');
            } else if (c == '[') {
                pos++;
                string inner = parse(s, pos);
                for (int i = 0; i < num; i++) {
                    result += inner;
                }
                num = 0;
            } else if (c == ']') {
                return result;
            } else {
                result += c;
            }
            pos++;
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String decodeStringRecursive(String s) {
        return parse(s, new int[]{0});
    }
    
    private String parse(String s, int[] pos) {
        StringBuilder result = new StringBuilder();
        int num = 0;
        
        while (pos[0] < s.length()) {
            char c = s.charAt(pos[0]]);
            
            if (Character.isDigit(c)) {
                num = num * 10 + (c - '0');
            } else if (c == '[') {
                pos[0]++;
                String inner = parse(s, pos);
                for (int i = 0; i < num; i++) {
                    result.append(inner);
                }
                num = 0;
            } else if (c == ']') {
                return result.toString();
            } else {
                result.append(c);
            }
            pos[0]++;
        }
        
        return result.toString();
    }
}
```

<!-- slide -->
```javascript
var decodeStringRecursive = function(s) {
    let pos = 0;
    
    function parse() {
        let result = '';
        let num = 0;
        
        while (pos < s.length) {
            const c = s[pos];
            
            if (!isNaN(c)) {
                num = num * 10 + parseInt(c);
            } else if (c === '[') {
                pos++;
                const inner = parse();
                result += inner.repeat(num);
                num = 0;
            } else if (c === ']') {
                return result;
            } else {
                result += c;
            }
            pos++;
        }
        
        return result;
    }
    
    return parse();
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each character is processed once |
| **Space** | O(n) - Recursion stack for nesting depth |

---

## Approach 3: Two Stack Approach

This approach uses separate stacks for strings and numbers, making the logic slightly clearer.

### Algorithm Steps

1. Use one stack for strings and one for numbers
2. When '[', push current string and number to respective stacks
3. When ']', pop and combine
4. Track current string and number throughout

### Code Implementation

````carousel
```python
class Solution:
    def decodeString_two_stacks(self, s: str) -> str:
        """
        Decode using two stacks (strings and numbers).
        
        Args:
            s: Encoded string
            
        Returns:
            Decoded string
        """
        str_stack = []
        num_stack = []
        curr_str = ""
        curr_num = 0
        
        for c in s:
            if c.isdigit():
                curr_num = curr_num * 10 + int(c)
            elif c == '[':
                str_stack.append(curr_str)
                num_stack.append(curr_num)
                curr_str = ""
                curr_num = 0
            elif c == ']':
                prev_str = str_stack.pop()
                repeat = num_stack.pop()
                curr_str = prev_str + curr_str * repeat
            else:
                curr_str += c
        
        return curr_str
```

<!-- slide -->
```cpp
class Solution {
public:
    string decodeStringTwoStacks(string s) {
        stack<string> strStack;
        stack<int> numStack;
        string currStr = "";
        int currNum = 0;
        
        for (char c : s) {
            if (isdigit(c)) {
                currNum = currNum * 10 + (c - '0');
            } else if (c == '[') {
                strStack.push(currStr);
                numStack.push(currNum);
                currStr = "";
                currNum = 0;
            } else if (c == ']') {
                string prevStr = strStack.top();
                strStack.pop();
                int repeat = numStack.top();
                numStack.pop();
                for (int i = 0; i < repeat; i++) {
                    prevStr += currStr;
                }
                currStr = prevStr;
            } else {
                currStr += c;
            }
        }
        
        return currStr;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String decodeStringTwoStacks(String s) {
        Stack<String> strStack = new Stack<>();
        Stack<Integer> numStack = new Stack<>();
        StringBuilder currStr = new StringBuilder();
        int currNum = 0;
        
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) {
                currNum = currNum * 10 + (c - '0');
            } else if (c == '[') {
                strStack.push(currStr.toString());
                numStack.push(currNum);
                currStr = new StringBuilder();
                currNum = 0;
            } else if (c == ']') {
                String prevStr = strStack.pop();
                int repeat = numStack.pop();
                StringBuilder temp = new StringBuilder(prevStr);
                for (int i = 0; i < repeat; i++) {
                    temp.append(currStr);
                }
                currStr = temp;
            } else {
                currStr.append(c);
            }
        }
        
        return currStr.toString();
    }
}
```

<!-- slide -->
```javascript
var decodeStringTwoStacks = function(s) {
    const strStack = [];
    const numStack = [];
    let currStr = '';
    let currNum = 0;
    
    for (const c of s) {
        if (!isNaN(c) && c !== ' ') {
            currNum = currNum * 10 + parseInt(c);
        } else if (c === '[') {
            strStack.push(currStr);
            numStack.push(currNum);
            currStr = '';
            currNum = 0;
        } else if (c === ']') {
            const prevStr = strStack.pop();
            const repeat = numStack.pop();
            currStr = prevStr + currStr.repeat(repeat);
        } else {
            currStr += c;
        }
    }
    
    return currStr;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each character is processed once |
| **Space** | O(n) - Two stacks store nested contexts |

---

## Comparison of Approaches

| Aspect | Stack-Based | Recursive | Two Stacks |
|--------|-------------|-----------|------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(n) | O(n) | O(n) |
| **Implementation** | Simple | Moderate | Simple |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Best For** | Iterative | Nested depth | Clarity |

**Best Approach:** Approach 1 (Stack-Based) is optimal and commonly used. It's iterative, easy to understand, and handles nesting naturally.

---

## Why Stack-Based Works

The stack-based approach works because:

1. **Nested Context**: Each '[' creates a new nested context that needs to be remembered
2. **LIFO Order**: Stack naturally handles the nested structure - innermost ']' matches outermost '['
3. **State Preservation**: We save both the string and number when entering a bracket
4. **Single Pass**: Each character is processed exactly once

---

## Common Pitfalls

### 1. Multi-digit Numbers
**Issue**: Numbers can have multiple digits (e.g., "12[a]").

**Solution**: Build the number by multiplying by 10 and adding the digit.

### 2. Not Resetting After '['
**Issue**: Forgetting to reset curr_str and curr_num after pushing to stack.

**Solution**: Always reset after encountering '[' to start fresh for inner string.

### 3. Wrong Order When Popping
**Issue**: Popping in wrong order or not unpacking correctly.

**Solution**: Ensure you pop and use values in correct order: (previous_string, repeat_count).

### 4. String Concatenation Performance
**Issue**: Using string += in Python can be O(n²) for large strings.

**Solution**: For very large outputs, consider using StringBuilder/list and join at the end.

---

## Related Problems

Based on similar themes (string decoding, stack-based processing):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Integer to English Words | [Link](https://leetcode.com/problems/integer-to-english-words/) | Recursive number parsing |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Basic Calculator II | [Link](https://leetcode.com/problems/basic-calculator-ii/) | Stack-based expression evaluation |
| Encode String with K | [Link](https://leetcode.com/problems/encode-string-with-kth-shortest/) | Reverse operation |
| Number of Atoms | [Link](https://leetcode.com/problems/number-of-atoms/) | Chemical formula parsing |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Basic Calculator III | [Link](https://leetcode.com/problems/basic-calculator-iii/) | Full calculator with parentheses |

### Pattern Reference

For more detailed explanations of the Stack-Based String Decoding pattern, see:
- **[Stack-Based String Processing Pattern](/patterns/stack-string-processing)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Stack-Based Solution

- [NeetCode - Decode String](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation with visual examples
- [Back to Back SWE - Decode String](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Official problem solution

### Related Concepts

- [Stack Operations](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Understanding stack operations
- [Recursive Parsing](https://www.youtube.com/watch?v=8hQPLSSjkMY) - How recursive parsing works

---

## Follow-up Questions

### Q1: How would you modify the solution to handle uppercase letters?

**Answer:** The current solution already handles all characters including uppercase. Just add a condition for uppercase letters similar to lowercase letters in the else clause.

---

### Q2: What if there are multiple numbers before '[' like "12a3[b]"?

**Answer:** The solution handles this naturally - it builds a multi-digit number (12), then sees '[', pushes state, processes "a3[b]" which becomes "abbb", and finally repeats 12 times: "abbb" * 12.

---

### Q3: How would you handle very deep nesting (e.g., 1000 levels)?

**Answer:** The stack-based approach will handle it, but you might hit recursion limit with recursive approach. Consider using an iterative approach and increase stack size if needed. The space complexity remains O(n).

---

### Q4: Can you solve it without using a stack?

**Answer:** Yes, using recursion as shown in Approach 2. The recursion depth equals the maximum nesting level.

---

### Q5: What is the maximum output length?

**Answer:** The problem states output length ≤ 10^5. The number can be up to 300, and inner strings can be large.

---

### Q6: How would you optimize for memory usage?

**Answer:**
- Use array/list instead of string concatenation
- For very large strings, process in chunks
- Use StringBuilder where available
- Consider lazy evaluation for streaming output

---

### Q7: What edge cases should be tested?

**Answer:**
- Empty encoded string (but problem guarantees at least length 1)
- No brackets at all (just letters)
- Multiple nested brackets
- Large repeat numbers (up to 300)
- Consecutive brackets "2[3[a]]"

---

## Summary

The **Decode String** problem demonstrates stack-based string processing:

- **Stack-based approach**: O(n) time, O(n) space - optimal
- **Recursive approach**: O(n) time, O(n) space - natural for nesting
- **Two stacks**: Same complexity, slightly clearer logic

The key insight is using a stack to maintain context for each nesting level, saving the previous string and repeat count when entering a bracket level and restoring when exiting.

This problem is an excellent demonstration of how stacks handle nested structures, a fundamental concept in parsing and string processing.

### Pattern Summary

This problem exemplifies the **Stack-Based String Decoding** pattern, which is characterized by:
- Using stack to maintain nested context
- Handling multi-digit numbers
- Processing '[' to save state, ']' to restore
- Single pass through input
- Achieving O(n) time complexity

For more details on this pattern and its variations, see the **[Stack-Based String Processing Pattern](/patterns/stack-string-processing)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/decode-string/discuss/) - Community solutions
- [Stack Operations - GeeksforGeeks](https://www.geeksforgeeks.org/stack-data-structure/) - Understanding stacks
- [String Parsing - Wikipedia](https://en.wikipedia.org/wiki/Parsing) - Parsing fundamentals
- [Pattern: Stack-Based String Processing](/patterns/stack-string-processing) - Comprehensive guide
