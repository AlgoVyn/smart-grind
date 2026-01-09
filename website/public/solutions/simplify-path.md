# Simplify Path

## Problem Description

Given an absolute path for a Unix-style file system, simplify it to its canonical path.

In Unix-style file systems:

- A single period `.` represents the current directory
- A double period `..` represents the parent directory
- Multiple consecutive slashes (`//`, `///`) are treated as a single slash
- Any sequence of periods not matching the rules above is a valid directory name

### Rules for Canonical Path

1. The path must start with a single slash `/`
2. Directories must be separated by exactly one slash
3. The path must not end with a slash (except for root directory)
4. No `.` or `..` directories that affect navigation

---

## Examples

**Example 1:**
```
Input: path = "/home/"
Output: "/home"
```
The trailing slash should be removed.

**Example 2:**
```
Input: path = "/home//foo/"
Output: "/home/foo"
```
Multiple consecutive slashes are replaced by a single one.

**Example 3:**
```
Input: path = "/home/user/Documents/../Pictures"
Output: "/home/user/Pictures"
```
Double period `..` navigates up one directory level.

**Example 4:**
```
Input: path = "/../"
Output: "/"
```
Cannot navigate up from the root directory.

**Example 5:**
```
Input: path = "/.../a/../b/c/../d/./"
Output: "/.../b/d"
```
`...` is a valid directory name (not `..`).

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= path.length <= 3000` | Path length |
| `path consists of` | Letters, digits, `.`, `/`, `_` |
| | Valid absolute Unix path |

---

## Solution

```python
def simplifyPath(path: str) -> str:
    parts = path.split('/')
    stack = []
    for part in parts:
        if part == '' or part == '.':
            continue
        elif part == '..':
            if stack:
                stack.pop()
        else:
            stack.append(part)
    return '/' + '/'.join(stack)
```

---

## Explanation

The algorithm uses a stack to process directory components:

1. **Split the path** by `/` to get individual components
2. **Process each component**:
   - Skip empty strings and `.` (current directory)
   - If `..`, pop from stack if not empty (go up one level)
   - Otherwise, push the valid directory name to stack
3. **Build the result** by joining stack elements with `/` and prepending `/`

This handles all edge cases while maintaining O(n) time complexity.

### Time Complexity

- **O(n)** — Each character is processed once

### Space Complexity

- **O(n)** — Stack stores at most n directory names

---

## Related Problems

- [File Path Simplification](https://leetcode.com/problems/simplify-path/)
