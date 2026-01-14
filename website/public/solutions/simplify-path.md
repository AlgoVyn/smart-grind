# Simplify Path

## Problem Statement

Given a string `path`, which is an absolute path (starting with a slash '/') to a file or directory in a Unix-style file system, simplify it by resolving:

1. **"."**: Current directory (do nothing)
2. **".."**: Go up one level (pop from stack if not empty)
3. **"name"**: Valid directory/filename (push to stack)

Return the canonical simplified path in string format.

**Constraints:**
- `1 <= path.length <= 3000`
- `path` consists of English letters, digits, period '.', slash '/', and underscore '_'
- `path` is a valid absolute Unix path

---

## Examples

### Example 1:
```python
Input: path = "/home/"
Output: "/home"

Explanation: 
- Starts at root, "home" is a directory
- No extra processing needed
```

### Example 2:
```python
Input: path = "/../"
Output: "/"

Explanation:
- Go up from root (already at root, so stay)
- Result is root
```

### Example 3:
```python
Input: path = "/a/./b/../../c/"
Output: "/c"

Explanation:
- /a -> push "a"
- /a/. -> "a" (current dir, no change)
- /a/./b -> push "b"
- /a/./b/.. -> pop "b"
- /a/./b/../.. -> pop "a"
- /a/./b/../../c -> push "c"
```

### Example 4:
```python
Input: path = "/home//foo/"
Output: "/home/foo"

Explanation:
- Multiple consecutive slashes treated as single slash
- "foo" is a valid directory
```

### Example 5:
```python
Input: path = "/a/./b/../../c/"
Output: "/c"
```

### Example 6:
```python
Input: path = "/a//b////c/d//././/.."
Output: "/a/b/c"
```

---

## Intuition

The problem can be visualized as **navigating a directory tree**:

- The path is an absolute path starting from root "/"
- Each component between slashes represents a directory or operation
- We need to track our current position in the directory structure
- ".." means go up one level (pop from stack)
- "." means stay (ignore)
- Any other name means enter that directory (push to stack)
- Multiple slashes can be ignored

A **stack** is the perfect data structure because:
- Last pushed directory is the first to be popped (like ".." going up)
- LIFO (Last In, First Out) matches directory traversal behavior

---

## Approach 1: Stack-Based Solution (Recommended)

### Algorithm
1. Split the path by '/' to get components
2. Use a stack to track directory names
3. For each component:
   - If empty or ".", skip (consecutive slashes or current dir)
   - If "..", pop from stack if not empty (go up one level)
   - Otherwise, push the component (enter directory)
4. Join stack elements with '/' and prepend root '/'

### Python Implementation
```python
def simplifyPath(path: str) -> str:
    stack = []
    
    for component in path.split('/'):
        if component == '' or component == '.':
            continue  # Skip empty and current directory
        elif component == '..':
            if stack:
                stack.pop()  # Go up one level
        else:
            stack.append(component)  # Enter directory
    
    return '/' + '/'.join(stack)
```

---

## Approach 2: String Parsing with Manual Split

### Algorithm
Instead of using `split()`, we can manually parse the string character by character:
1. Use two pointers to extract components
2. Process each component similarly to stack approach
3. Build the result directly from stack

### Python Implementation
```python
def simplifyPath(path: str) -> str:
    stack = []
    i = 0
    n = len(path)
    
    while i < n:
        # Skip multiple slashes
        while i < n and path[i] == '/':
            i += 1
        if i >= n:
            break
            
        # Find next slash or end
        j = i
        while j < n and path[j] != '/':
            j += 1
            
        component = path[i:j]
        i = j  # Move to next position
        
        if component == '.':
            continue
        elif component == '..':
            if stack:
                stack.pop()
        else:
            stack.append(component)
    
    return '/' + '/'.join(stack)
```

---

## Approach 3: Using List as Stack (Alternative Python)

```python
def simplifyPath(path: str) -> str -> str:
    components = [c for c in path.split('/') if c]
    stack = []
    
    for comp in components:
        if comp == '..':
            stack.pop() if stack else None
        elif comp != '.':
            stack.append(comp)
    
    return '/' + '/'.join(stack) or '/'
```

---

## Time and Space Complexity Analysis

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Stack-Based (split) | **O(n)** | **O(n)** | n = length of path string |
| Manual parsing | O(n) | O(n) | No split overhead |
| List as stack | O(n) | O(n) | Slightly more concise |

### Detailed Breakdown:
- **Time Complexity**: O(n)
  - Splitting/parsing the string: O(n)
  - Each component processed once: O(n)
  - Stack push/pop operations: O(1) each
  
- **Space Complexity**: O(n)
  - Stack stores at most O(n) components in worst case
  - Split string creates O(n) substrings

### Edge Cases:
1. **Empty path**: Returns "/" (though constraint says min length 1)
2. **Multiple slashes**: Handled by skipping empty components
3. **Leading/trailing slashes**: Handled by split and result construction
4. **Only ".." and "/"**: Returns "/"
5. **Deeply nested paths**: Stack handles arbitrary depth

---

## Related Problems

1. **[Backspace String Compare](/solutions/backspace-string-compare)** - Similar ".." concept with different processing
2. **[Decode String](/solutions/decode-string)** - Stack-based parsing
3. **[Crawler Log Folder](/solutions/crawler-log-folder)** - Very similar problem (same concept)
4. **[File Path Simplification](/solutions/crawler-log-folder)** - Identical logic

---

## Video Tutorial Links

1. **NeetCode - Simplify Path (LeetCode 71)**
   - YouTube: https://www.youtube.com/watch?v=qM3wW5GAW6c
   - Duration: ~8 minutes
   - Clear stack-based explanation with examples

2. **Fraz - Simplify Absolute Path**
   - YouTube: https://www.youtube.com/watch?v=1Zhu7NrtGqw
   - Duration: ~10 minutes
   - Detailed walkthrough with multiple examples

3. **Abdul Bari - Path Simplification**
   - YouTube: https://www.youtube.com/watch?v=2OdK-H7T9uI
   - Algorithm explanation

4. **Eric Programming - LeetCode 71**
   - YouTube: https://www.youtube.com/watch?v=2J2c_2og2jA
   - Python solution explanation

---

## Summary

The Simplify Path problem is a classic stack-based problem that tests your understanding of:
- **Stack data structure** for LIFO operations
- **String parsing** techniques
- **Edge case handling** (empty components, root case)

**Key takeaways:**
1. Use a stack to track directory hierarchy
2. Skip empty strings and "."
3. Pop from stack for ".."
4. Push valid directory names
5. Join result with "/" and ensure root prefix

The stack-based approach is optimal with **O(n) time and O(n) space complexity**, making it efficient for all valid inputs.

