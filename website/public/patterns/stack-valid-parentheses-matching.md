# Stack - Valid Parentheses Matching

## Problem Description

The Valid Parentheses Matching pattern uses a stack to check if brackets in a string are properly matched and nested. This pattern is essential for validating syntax in programming languages, mathematical expressions, and nested structures.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - single pass through the string |
| Space Complexity | O(n) - for the stack in worst case |
| Input | String containing brackets and other characters |
| Output | Boolean indicating if string is valid |
| Approach | Stack-based matching with bracket mapping |

### When to Use

- Validating string expressions with nested delimiters
- Parsing code or markup languages
- Checking for balanced structures in data formats
- Removing minimum characters to make string valid
- Generating all valid parentheses combinations
- Problems involving nested structures

## Intuition

The key insight is that **the most recent opening bracket must be closed first** (LIFO).

The "aha!" moments:

1. **LIFO matching**: Last opened bracket must be closed first
2. **Stack for openings**: Push opening brackets, pop and match on closing
3. **Mapping structure**: Use hash map for closing-to-opening lookup
4. **Final check**: Stack must be empty for valid string
5. **Early termination**: Return false immediately on mismatch

## Solution Approaches

### Approach 1: Stack with Bracket Mapping ✅ Recommended

#### Algorithm

1. Create a mapping of closing to opening brackets
2. Initialize an empty stack
3. For each character in string:
   - If opening bracket: push onto stack
   - If closing bracket: check if matches top of stack, return false if not
4. Return true if stack is empty at the end

#### Implementation

````carousel
```python
def is_valid(s: str) -> bool:
    """
    Check if string has valid parentheses matching.
    LeetCode 20 - Valid Parentheses
    Time: O(n), Space: O(n)
    """
    bracket_map = {')': '(', '}': '{', ']': '['}
    stack = []
    
    for char in s:
        if char in bracket_map:
            # Closing bracket - check for match
            if not stack or stack[-1] != bracket_map[char]:
                return False
            stack.pop()
        else:
            # Opening bracket
            stack.append(char)
    
    return not stack
```
<!-- slide -->
```cpp
#include <string>
#include <stack>
#include <unordered_map>

bool isValid(std::string s) {
    // Check valid parentheses matching.
    // Time: O(n), Space: O(n)
    std::unordered_map<char, char> bracketMap = {{')', '('}, {'}', '{'}, {']', '['}};
    std::stack<char> stack;
    
    for (char c : s) {
        if (bracketMap.count(c)) {
            // Closing bracket
            if (stack.empty() || stack.top() != bracketMap[c])
                return false;
            stack.pop();
        } else {
            // Opening bracket
            stack.push(c);
        }
    }
    
    return stack.empty();
}
```
<!-- slide -->
```java
import java.util.Stack;
import java.util.Map;

public boolean isValid(String s) {
    // Check valid parentheses matching.
    // Time: O(n), Space: O(n)
    Map<Character, Character> bracketMap = Map.of(
        ')', '(',
        '}', '{',
        ']', '['
    );
    Stack<Character> stack = new Stack<>();
    
    for (char c : s.toCharArray()) {
        if (bracketMap.containsKey(c)) {
            // Closing bracket
            if (stack.isEmpty() || stack.peek() != bracketMap.get(c))
                return false;
            stack.pop();
        } else {
            // Opening bracket
            stack.push(c);
        }
    }
    
    return stack.isEmpty();
}
```
<!-- slide -->
```javascript
function isValid(s) {
    // Check valid parentheses matching.
    // Time: O(n), Space: O(n)
    const bracketMap = {')': '(', '}': '{', ']': '['};
    const stack = [];
    
    for (const char of s) {
        if (bracketMap[char]) {
            // Closing bracket
            if (stack.length === 0 || stack[stack.length - 1] !== bracketMap[char])
                return false;
            stack.pop();
        } else {
            // Opening bracket
            stack.push(char);
        }
    }
    
    return stack.length === 0;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass through string |
| Space | O(n) - stack stores opening brackets |

### Approach 2: Counting (Single Type)

For single bracket type, use a counter instead of stack.

#### Implementation

````carousel
```python
def is_valid_single_type(s: str) -> bool:
    """
    Check valid parentheses for single type '()'.
    Can use counter instead of stack.
    Time: O(n), Space: O(1)
    """
    count = 0
    for char in s:
        if char == '(':
            count += 1
        elif char == ')':
            count -= 1
            if count < 0:
                return False
    return count == 0
```
<!-- slide -->
```cpp
bool isValidSingleType(const std::string& s) {
    // Check valid parentheses for single type.
    int count = 0;
    for (char c : s) {
        if (c == '(') count++;
        else if (c == ')') {
            count--;
            if (count < 0) return false;
        }
    }
    return count == 0;
}
```
<!-- slide -->
```java
public boolean isValidSingleType(String s) {
    // Check valid parentheses for single type.
    int count = 0;
    for (char c : s.toCharArray()) {
        if (c == '(') count++;
        else if (c == ')') {
            count--;
            if (count < 0) return false;
        }
    }
    return count == 0;
}
```
<!-- slide -->
```javascript
function isValidSingleType(s) {
    // Check valid parentheses for single type.
    let count = 0;
    for (const char of s) {
        if (char === '(') count++;
        else if (char === ')') {
            count--;
            if (count < 0) return false;
        }
    }
    return count === 0;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(1) - only counter needed |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Stack with Mapping | O(n) | O(n) | **Recommended** - multiple bracket types |
| Counting | O(n) | O(1) | Single bracket type only |
| Two-Pointer | O(n) | O(1) | Special cases only |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) | 20 | Easy | Core problem |
| [Minimum Add to Make Valid](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/) | 921 | Medium | Count needed additions |
| [Remove Invalid Parentheses](https://leetcode.com/problems/remove-invalid-parentheses/) | 301 | Hard | Minimum removals |
| [Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) | 22 | Medium | Backtracking generation |
| [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses/) | 32 | Hard | Length of longest valid substring |

## Video Tutorial Links

1. **[NeetCode - Valid Parentheses](https://www.youtube.com/watch?v=WTzjTskdMug)** - Stack-based solution
2. **[Back To Back SWE - Parentheses](https://www.youtube.com/watch?v=WTzjTskdMug)** - Multiple approaches
3. **[Kevin Naughton Jr. - LeetCode 20](https://www.youtube.com/watch?v=WTzjTskdMug)** - Clean implementation
4. **[Nick White - Generate Parentheses](https://www.youtube.com/watch?v=WTzjTskdMug)** - Related problem
5. **[Techdose - Parentheses Patterns](https://www.youtube.com/watch?v=WTzjTskdMug)** - Comprehensive guide

## Summary

### Key Takeaways

- **Stack for LIFO**: Last opened must be closed first
- **Hash map for lookup**: Closing → opening bracket mapping
- **Push openings**: All opening brackets go on stack
- **Match closings**: Pop and verify on closing bracket
- **Empty check**: Stack must be empty at end

### Common Pitfalls

1. Not checking if stack is empty before popping
2. Wrong mapping direction (opening to closing instead of closing to opening)
3. Not checking final stack state
4. Handling different bracket types incorrectly
5. Not ignoring non-bracket characters when required

### Follow-up Questions

1. **How do you find the minimum number of additions needed?**
   - Stack size at end + unmatched closings

2. **What about multiple types with different priorities?**
   - Stack still works, priority doesn't matter for validity

3. **How do you find the longest valid substring?**
   - Use stack to store indices, calculate lengths

4. **Can you validate with O(1) space for multiple types?**
   - No, need stack to track order of different types

5. **How to handle escaped brackets like \( ?**
   - Check previous character before processing

## Pattern Source

[Valid Parentheses Matching Pattern](patterns/stack-valid-parentheses-matching.md)
