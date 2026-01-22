# Simplify Path

## Problem Description

Given a string `path`, which is an absolute path (starting with a slash '/') to a file or directory in a Unix-style file system, simplify it to its canonical form.

In Unix-style file systems:
- The path starts from the root directory represented by '/'
- Directories and files are separated by '/'
- '.' represents the current directory (no operation)
- '..' represents the parent directory (go up one level)
- Multiple consecutive slashes are treated as a single slash
- Any sequence that doesn't start with '.' or contain only '.' represents a valid directory or file name

Your task is to process the path and return the simplified canonical absolute path.

---

## Examples

### Example 1

**Input:**
```python
path = "/home/"
```

**Output:**
```python
"/home"
```

**Explanation:**
- The path starts at root "/"
- "home" is a valid directory name
- Trailing slash is ignored
- No "." or ".." to process

### Example 2

**Input:**
```python
path = "/../"
```

**Output:**
```python
"/"
```

**Explanation:**
- Starting at root "/"
- ".." attempts to go up from root
- Since we're already at root, we stay at root
- Result is just the root directory

### Example 3

**Input:**
```python
path = "/a/./b/../../c/"
```

**Output:**
```python
"/c"
```

**Explanation:**
- "/a" → push "a" to stack
- "/a/." → "a" (current directory, no change)
- "/a/./b" → push "b" to stack
- "/a/./b/.." → pop "b" (go up one level)
- "/a/./b/../.." → pop "a" (go up one level)
- "/a/./b/../../c" → push "c" to stack
- Final result: "/c"

### Example 4

**Input:**
```python
path = "/home//foo/"
```

**Output:**
```python
"/home/foo"
```

**Explanation:**
- Multiple consecutive slashes are treated as a single slash
- "home" and "foo" are valid directory names
- No "." or ".." operations needed

### Example 5

**Input:**
```python
path = "/a//b////c/d//././/.."
```

**Output:**
```python
"/a/b/c"
```

**Explanation:**
- "/a" → push "a"
- "/a//b" → push "b"
- "/a//b////c" → push "c"
- "/a//b////c/d" → push "d"
- "/a//b////c/d//./" → no change
- "/a//b////c/d//././" → no change
- "/a//b////c/d//././/.." → pop "d"
- Result: "/a/b/c"

### Example 6

**Input:**
```python
path = "/..."
```

**Output:**
```python
"/..."
```

**Explanation:**
- "..." is a valid directory name (it starts with '.' but is not exactly ".")
- The dots must be followed by at least one non-dot character to be special
- Since "..." doesn't exactly equal "." or "..", it's treated as a valid name

---

## Constraints

- `1 <= path.length <= 3000`
- `path` consists of English letters (a-z, A-Z), digits (0-9), period '.', slash '/', and underscore '_'
- `path` is a valid absolute Unix path (starts with '/')
- The path may contain '.' and '..' as special directory references
- The resulting path must always start with '/'

---

## Intuition

The problem can be visualized as **navigating a directory tree**:

1. **Root Navigation**: The path is absolute, starting from root "/"
2. **Component Processing**: Each component between slashes represents:
   - A directory operation ("." or "..")
   - A directory/file name (anything else)
3. **State Tracking**: We need to track our current position in the directory hierarchy
4. **Stack Behavior**: 
   - Entering a directory = push onto stack
   - Going up = pop from stack
   - Current directory = no operation

### Key Insight: Stack is Perfect for This Problem

The **stack** data structure is ideal because:
- **LIFO Property**: Last entered directory is the first to be exited (matches ".." behavior)
- **Efficient Operations**: O(1) push and pop operations
- **Order Preservation**: Maintains the correct directory hierarchy order
- **Natural Backtracking**: Easy to undo operations with ".."

### Why Not Other Data Structures?

- **Queue**: Wrong order - would process first directory first, but ".." should remove most recent
- **Array**: Stack operations are already O(1) at the end
- **Linked List**: Overhead without benefits for this use case
- **Tree**: Would need to build the entire tree first, which is inefficient

---

## Approach 1: Stack-Based Solution with Split ⭐

### Algorithm

This is the most common and recommended approach:

1. **Split the path** by '/' to get individual components
2. **Filter out empty strings** (from consecutive slashes)
3. **Process each component**:
   - Skip if component is "." (current directory)
   - If component is "..", pop from stack if not empty
   - Otherwise, push the component to stack
4. **Build the result** by joining stack elements with '/' and prepending '/'

### Why This Works

The stack naturally tracks the directory hierarchy:
- When we see a valid directory name, we push it (we've entered that directory)
- When we see "..", we pop (we've gone up one level)
- The remaining directories in the stack represent the simplified path

````carousel
<!-- slide -->
```python
class Solution:
    def simplifyPath(self, path: str) -> str:
        """
        Simplify the given absolute path.
        
        Args:
            path: A string representing an absolute Unix path
            
        Returns:
            The canonical simplified path string
        """
        stack = []
        
        # Split path by '/' and process each component
        for component in path.split('/'):
            # Skip empty strings (from consecutive slashes) and current directory
            if component == '' or component == '.':
                continue
            # Go up one level if possible
            elif component == '..':
                if stack:
                    stack.pop()
            # Valid directory name, add to stack
            else:
                stack.append(component)
        
        # Build the result path
        return '/' + '/'.join(stack)
```

<!-- slide -->
```cpp
class Solution {
public:
    string simplifyPath(string path) {
        vector<string> stack;
        stringstream ss(path);
        string component;
        
        // Use stringstream to split by '/'
        while (getline(ss, component, '/')) {
            // Skip empty strings and current directory
            if (component.empty() || component == ".") {
                continue;
            }
            // Go up one level if possible
            else if (component == "..") {
                if (!stack.empty()) {
                    stack.pop_back();
                }
            }
            // Valid directory name
            else {
                stack.push_back(component);
            }
        }
        
        // Build result path
        string result;
        for (const string& dir : stack) {
            result += "/" + dir;
        }
        
        return result.empty() ? "/" : result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String simplifyPath(String path) {
        Deque<String> stack = new ArrayDeque<>();
        String[] components = path.split("/");
        
        for (String component : components) {
            // Skip empty strings and current directory
            if (component.isEmpty() || component.equals(".")) {
                continue;
            }
            // Go up one level if possible
            else if (component.equals("..")) {
                if (!stack.isEmpty()) {
                    stack.pollLast();
                }
            }
            // Valid directory name
            else {
                stack.offerLast(component);
            }
        }
        
        // Build result path
        StringBuilder result = new StringBuilder();
        for (String dir : stack) {
            result.append("/").append(dir);
        }
        
        return result.length() == 0 ? "/" : result.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} path
 * @return {string}
 */
var simplifyPath = function(path) {
    const stack = [];
    
    // Split by '/' and process each component
    const components = path.split('/');
    
    for (const component of components) {
        // Skip empty strings and current directory
        if (component === '' || component === '.') {
            continue;
        }
        // Go up one level if possible
        else if (component === '..') {
            if (stack.length > 0) {
                stack.pop();
            }
        }
        // Valid directory name
        else {
            stack.push(component);
        }
    }
    
    // Build the result path
    return '/' + stack.join('/');
};
```
````

---

## Approach 2: Manual String Parsing

### Algorithm

Instead of using built-in split, we manually parse the string:

1. **Skip leading slashes** and multiple consecutive slashes
2. **Extract the next component** by finding the next slash or end of string
3. **Process the component** the same way as Approach 1
4. **Repeat** until end of string
5. **Build the result** from the stack

### Why Manual Parsing?

- Avoids creating many substring objects
- More control over parsing logic
- Demonstrates understanding of string manipulation
- Slightly better performance for very long paths

````carousel
<!-- slide -->
```python
class Solution:
    def simplifyPath(self, path: str) -> str:
        """
        Simplify path using manual string parsing.
        
        Args:
            path: A string representing an absolute Unix path
            
        Returns:
            The canonical simplified path string
        """
        stack = []
        i = 0
        n = len(path)
        
        while i < n:
            # Skip multiple consecutive slashes
            while i < n and path[i] == '/':
                i += 1
            if i >= n:
                break
            
            # Find the next slash or end of string
            j = i
            while j < n and path[j] != '/':
                j += 1
            
            # Extract component
            component = path[i:j]
            i = j  # Move to next position
            
            # Process component
            if component == '.':
                continue  # Current directory
            elif component == '..':
                if stack:
                    stack.pop()  # Go up one level
            else:
                stack.append(component)  # Valid directory name
        
        # Build result
        return '/' + '/'.join(stack)
```

<!-- slide -->
```cpp
class Solution {
public:
    string simplifyPath(string path) {
        vector<string> stack;
        int n = path.length();
        int i = 0;
        
        while (i < n) {
            // Skip multiple consecutive slashes
            while (i < n && path[i] == '/') {
                i++;
            }
            if (i >= n) break;
            
            // Find next slash or end
            int j = i;
            while (j < n && path[j] != '/') {
                j++;
            }
            
            string component = path.substr(i, j - i);
            i = j;
            
            // Process component
            if (component == ".") {
                continue;
            } else if (component == "..") {
                if (!stack.empty()) {
                    stack.pop_back();
                }
            } else {
                stack.push_back(component);
            }
        }
        
        // Build result
        string result;
        for (const string& dir : stack) {
            result += "/" + dir;
        }
        
        return result.empty() ? "/" : result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String simplifyPath(String path) {
        Deque<String> stack = new ArrayDeque<>();
        int n = path.length();
        int i = 0;
        
        while (i < n) {
            // Skip multiple consecutive slashes
            while (i < n && path.charAt(i) == '/') {
                i++;
            }
            if (i >= n) break;
            
            // Find next slash or end
            int j = i;
            while (j < n && path.charAt(j) != '/') {
                j++;
            }
            
            String component = path.substring(i, j);
            i = j;
            
            // Process component
            if (component.equals(".")) {
                continue;
            } else if (component.equals("..")) {
                if (!stack.isEmpty()) {
                    stack.pollLast();
                }
            } else {
                stack.offerLast(component);
            }
        }
        
        // Build result
        StringBuilder result = new StringBuilder();
        for (String dir : stack) {
            result.append("/").append(dir);
        }
        
        return result.length() == 0 ? "/" : result.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} path
 * @return {string}
 */
var simplifyPath = function(path) {
    const stack = [];
    const n = path.length;
    let i = 0;
    
    while (i < n) {
        // Skip multiple consecutive slashes
        while (i < n && path[i] === '/') {
            i++;
        }
        if (i >= n) break;
        
        // Find next slash or end
        let j = i;
        while (j < n && path[j] !== '/') {
            j++;
        }
        
        const component = path.substring(i, j);
        i = j;
        
        // Process component
        if (component === '.') {
            continue;
        } else if (component === '..') {
            if (stack.length > 0) {
                stack.pop();
            }
        } else {
            stack.push(component);
        }
    }
    
    // Build result
    return '/' + stack.join('/');
};
```
````

---

## Approach 3: List Comprehension with One-Liner Style

### Algorithm

A more Pythonic approach using list comprehensions:

1. **Filter components** using list comprehension
2. **Process with stack logic** in a single expression
3. **Build result** with proper handling

````carousel
<!-- slide -->
```python
class Solution:
    def simplifyPath(self, path: str) -> str:
        """
        Simplify path using list comprehension.
        
        Args:
            path: A string representing an absolute Unix path
            
        Returns:
            The canonical simplified path string
        """
        # Filter out empty strings and '.' components
        components = [c for c in path.split('/') if c and c != '.']
        
        stack = []
        for comp in components:
            if comp == '..':
                if stack:
                    stack.pop()
            else:
                stack.append(comp)
        
        return '/' + '/'.join(stack) if stack else '/'
```

<!-- slide -->
```cpp
class Solution {
public:
    string simplifyPath(string path) {
        vector<string> stack;
        stringstream ss(path);
        string component;
        vector<string> validComponents;
        
        // Filter valid components
        while (getline(ss, component, '/')) {
            if (!component.empty() && component != ".") {
                validComponents.push_back(component);
            }
        }
        
        // Process components
        for (const string& comp : validComponents) {
            if (comp == "..") {
                if (!stack.empty()) {
                    stack.pop_back();
                }
            } else {
                stack.push_back(comp);
            }
        }
        
        // Build result
        string result;
        for (const string& dir : stack) {
            result += "/" + dir;
        }
        
        return result.empty() ? "/" : result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String simplifyPath(String path) {
        // Filter and process in one stream
        List<String> components = Arrays.stream(path.split("/"))
            .filter(c -> !c.isEmpty() && !c.equals("."))
            .toList();
        
        Deque<String> stack = new ArrayDeque<>();
        
        for (String comp : components) {
            if (comp.equals("..")) {
                if (!stack.isEmpty()) {
                    stack.pollLast();
                }
            } else {
                stack.offerLast(comp);
            }
        }
        
        // Build result
        StringBuilder result = new StringBuilder();
        for (String dir : stack) {
            result.append("/").append(dir);
        }
        
        return result.length() == 0 ? "/" : result.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} path
 * @return {string}
 */
var simplifyPath = function(path) {
    // Filter and process components
    const stack = path.split('/')
        .filter(component => component !== '' && component !== '.')
        .reduce((stack, component) => {
            if (component === '..') {
                stack.pop();
            } else {
                stack.push(component);
            }
            return stack;
        }, []);
    
    return '/' + stack.join('/');
};
```
````

---

## Time and Space Complexity Analysis

### Overall Complexity

| Metric | Approach 1 (split) | Approach 2 (manual) | Approach 3 (comprehension) |
|--------|-------------------|---------------------|---------------------------|
| **Time Complexity** | **O(n)** | **O(n)** | **O(n)** |
| **Space Complexity** | **O(n)** | **O(n)** | **O(n)** |

### Detailed Breakdown

#### Approach 1: Stack-Based with Split
- **Time**: O(n)
  - `split('/')` creates O(n) substrings: O(n)
  - Iterating through components: O(n)
  - Stack operations (push/pop): O(1) each, O(n) total
- **Space**: O(n)
  - Split creates O(n) substrings
  - Stack stores at most O(n) components

#### Approach 2: Manual String Parsing
- **Time**: O(n)
  - Single pass through string: O(n)
  - Substring extraction: O(k) where k is component length, total O(n)
- **Space**: O(n)
  - Stack stores at most O(n) components
  - No intermediate substring storage

#### Approach 3: List Comprehension
- **Time**: O(n)
  - Same as Approach 1 with slight overhead from filtering
- **Space**: O(n)
  - Same as Approach 1

### Edge Cases Handled

| Edge Case | Input | Output | Handling |
|-----------|-------|--------|----------|
| Empty stack | "/../" | "/" | Return "/" if stack empty |
| Multiple slashes | "/home//foo/" | "/home/foo" | Skip empty components |
| Only ".." | "/../../" | "/" | Stack remains empty |
| Deep nesting | "/a/b/c/d/e/f" | "/a/b/c/d/e/f" | All pushed to stack |
| Valid names with dots | "/..." | "/..." | "..." != "." or ".." |

---

## Step-by-Step Example

Let's trace through the algorithm with path = "/a//b/../../c/"

### Initial State
```
path: "/a//b/../../c/"
stack: []
```

### Step 1: Process "a"
```
component: "a"
- Not ".", not ".."
- Push "a" to stack
stack: ["a"]
```

### Step 2: Process "" (empty, from //)
```
component: ""
- Skip empty string
stack: ["a"]
```

### Step 3: Process "b"
```
component: "b"
- Not ".", not ".."
- Push "b" to stack
stack: ["a", "b"]
```

### Step 4: Process ".."
```
component: ".."
- Pop "b" from stack
stack: ["a"]
```

### Step 5: Process ".."
```
component: ".."
- Pop "a" from stack
stack: []
```

### Step 6: Process "c"
```
component: "c"
- Not ".", not ".."
- Push "c" to stack
stack: ["c"]
```

### Final Result
```
Join stack with '/': "c"
Prepend '/': "/c"
```

---

## Key Optimizations

1. **Single Pass Processing**: Each character is processed at most once
2. **Early Termination**: Skip empty components immediately
3. **Stack Efficiency**: O(1) push and pop operations
4. **No String Concatenation in Loop**: Build result at the end

### Memory Optimization Tips

1. **Reuse Arrays**: If processing multiple paths, reuse the stack array
2. **In-Place Modification**: Modify the input string if allowed
3. **Character Array**: Work with char arrays for better performance in C++

---

## Comparison with Similar Problems

| Problem | Similarity | Key Difference |
|---------|------------|----------------|
| Backspace String Compare | Uses stack to skip elements | Processes from right-to-left, uses '#' instead of '/' |
| Crawler Log Folder | Nearly identical logic | Only uses "." and ".." operations |
| Decode String | Stack-based parsing | Handles nested brackets and repetition |
| Valid Parentheses | Stack-based validation | Different matching rules |

---

## Related Problems

1. **[Backspace String Compare](https://leetcode.com/problems/backspace-string-compare/)** - Similar "skip previous" concept with different input format
2. **[Crawler Log Folder](https://leetcode.com/problems/crawler-log-folder/)** - Very similar problem with identical logic
3. **[Decode String](https://leetcode.com/problems/decode-string/)** - Stack-based string parsing with nested patterns
4. **[File Path Simplification](https://leetcode.com/problems/crawler-log-folder/)** - Alternative perspective on the same problem
5. **[Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii/)** - Stack-based expression evaluation
6. **[Design a Text Editor](https://leetcode.com/problems/design-a-text-editor/)** - Stack operations for text manipulation

---

## Video Tutorials

1. **NeetCode - Simplify Path (LeetCode 71)**
   - [YouTube Link](https://www.youtube.com/watch?v=qM3wW5GAW6c)
   - Clear stack-based explanation with visual examples
   - Duration: ~8 minutes
   - Recommended for beginners

2. **Fraz - Simplify Absolute Path**
   - [YouTube Link](https://www.youtube.com/watch?v=1Zhu7NrtGqw)
   - Detailed walkthrough with multiple examples
   - Duration: ~10 minutes
   - Good for understanding edge cases

3. **LeetCode Official Solution**
   - [YouTube Link](https://www.youtube.com/watch?v=QVNuT7iXk2c)
   - Official explanation from LeetCode
   - Comprehensive coverage of all approaches

4. **Abdul Bari - Path Simplification**
   - [YouTube Link](https://www.youtube.com/watch?v=2OdK-H7T9uI)
   - Algorithm explanation from expert
   - Good theoretical foundation

5. **Eric Programming - LeetCode 71**
   - [YouTube Link](https://www.youtube.com/watch?v=2J2c_2og2jA)
   - Python solution walkthrough
   - Clean and concise explanation

---

## Follow-up Questions

### Conceptual Questions

1. **Why is a stack (LIFO) the right data structure for this problem?**
   - A stack is perfect because directory navigation follows LIFO behavior: when you navigate up with "..", you go back to the most recently visited directory. The last directory you entered is the first one you exit, which is exactly how a stack operates.

2. **What would happen if we used a queue instead of a stack?**
   - Using a queue would produce incorrect results. For example, with path "/a/b/..", a queue would process "a", then "b", then ".." would try to remove "a" (the front), but should actually remove "b" (the most recent). The result would be "/b" instead of "/a".

3. **How does the algorithm handle paths with only special characters?**
   - Empty strings from consecutive slashes are filtered out. "." components are skipped. ".." components at root are ignored since the stack is empty. The algorithm always returns "/" as the canonical form for paths that navigate back to root.

4. **What makes "..." a valid directory name but "." is not?**
   - The problem specifies that "." and ".." are the special directory references. Any other string, even if it starts with dots, is treated as a valid directory name. Since "..." is exactly three dots and not exactly "." or "..", it's considered a valid directory name.

### Extension Questions

5. **How would you modify the solution to support relative paths?**
   - For relative paths, you would need to start from the current working directory. You could split the current directory path and append the relative path components, then apply the same simplification logic.

6. **How would you handle symbolic links in path simplification?**
   - Symbolic links would require building a graph of directory relationships and performing cycle detection. This significantly increases complexity as you need to resolve each symbolic link while avoiding infinite loops.

7. **How would you support file permissions in the path?**
   - File permissions would need to be tracked separately. Each directory component could store a permission bitmask. When simplifying, you would preserve the permissions of the final resolved path.

8. **What if we wanted to count the number of directories in the simplified path?**
   - The count is simply `stack.length()` (or `stack.size()` in Java/C++). After simplification, the stack contains exactly the directories in the canonical path.

### Performance Questions

9. **Can we achieve O(1) space complexity?**
   - No, in the worst case (a valid path like "/a/b/c/d/e/f/g/h"), we need to store all directory names. The minimum space required is Ω(n) for the output path itself.

10. **Which approach is most efficient in practice?**
    - Approach 1 (using split) is most common and usually fastest due to optimized string operations in modern languages. Approach 2 (manual parsing) avoids creating intermediate strings but is more complex. Approach 3 (comprehension) is most Pythonic but has similar complexity to Approach 1.

### Edge Case Questions

11. **What if the path contains Unicode characters?**
    - The algorithm works with Unicode if the language's string operations handle it correctly. The splitting and comparison operations should work as long as the language uses Unicode-aware string handling.

12. **How would you handle extremely long paths (e.g., >10,000 components)?**
    - The algorithm is O(n) so it scales linearly. The main concern would be stack overflow in languages with limited stack size. Using a heap-allocated stack (like vector in C++ or ArrayList in Java) avoids this issue.

13. **What if the path ends with multiple ".." like "/a/b/c/../../../"?**
    - The algorithm processes each component sequentially. For "/a/b/c/../../../":
    - Push "a", "b", "c"
    - Pop for each ".." (3 times)
    - Result: "/" (stack becomes empty after popping "a")

---

## Common Mistakes to Avoid

1. **Forgetting to handle empty strings** from consecutive slashes
2. **Not checking if stack is empty** before popping for ".."
3. **Forgetting to prepend '/'** to the final result
4. **Treating "..." as ".." instead of a valid directory name**
5. **Not handling the case where stack is empty** (should return "/")
6. **Using the wrong split method** that doesn't handle consecutive delimiters
7. **Modifying the stack while iterating** incorrectly

---

## References

- [LeetCode 71 - Simplify Path](https://leetcode.com/problems/simplify-path/)
- [Unix Path Documentation](https://www.gnu.org/software/bash/manual/html_node/Pathname-Resolution.html)
- [Stack Data Structure - Wikipedia](https://en.wikipedia.org/wiki/Stack_(abstract_data_type))
- [ GeeksforGeeks - Simplify Unix Path](https://www.geeksforgeeks.org/simplify-directory-path-unix-format/)

