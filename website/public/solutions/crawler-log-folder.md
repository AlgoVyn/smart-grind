# Crawler Log Folder

## Problem Description

The Leetcode file system keeps a log each time some user performs a change folder operation.

The operations are described below:

- `"../"` : Move to the parent folder of the current folder. (If you are already in the main folder, remain in the same folder).
- `"./"` : Remain in the same folder.
- `"x/"` : Move to the child folder named x (This folder is guaranteed to always exist).

You are given a list of strings logs where logs[i] is the operation performed by the user at the ith step.

The file system starts in the main folder, then the operations in logs are performed.

Return the minimum number of operations needed to go back to the main folder after the change folder operations.

**LeetCode Link:** [Crawler Log Folder - LeetCode](https://leetcode.com/problems/crawler-log-folder/)

---

## Examples

**Example 1:**

**Input:**
```python
logs = ["d1/","d2/","../","d21/","./"]
```

**Output:**
```python
2
```

**Explanation:** Use this change folder operation "../" 2 times and go back to the main folder.

**Example 2:**

**Input:**
```python
logs = ["d1/","d2/","./","d3/","../","d31/"]
```

**Output:**
```python
3
```

**Example 3:**

**Input:**
```python
logs = ["d1/","../","../","../"]
```

**Output:**
```python
0
```

---

## Constraints

- `1 <= logs.length <= 10^3`
- `2 <= logs[i].length <= 10`
- `logs[i]` contains lowercase English letters, digits, '.', and '/'.
- `logs[i]` follows the format described in the statement.
- Folder names consist of lowercase English letters and digits.

---

## Pattern: Stack Simulation

This problem follows the **Stack Simulation** pattern for path/directory tracking.

### Core Concept

- **Depth Tracking**: Maintain a counter for current directory depth
- **Operation Processing**: Handle three operations: "../" (parent), "./" (current), "x/" (child)
- **Boundary Handling**: Don't go above root directory (depth >= 0)

### When to Use This Pattern

This pattern is applicable when:
1. Simulating directory navigation or file system operations
2. Problems involving stack-like behavior with boundaries
3. Tracking hierarchical relationships with depth levels

---

## Intuition

The key insight for this problem is that we don't actually need to track the full path - we only need to know the **current depth** in the directory tree. This simplifies the problem significantly.

### Key Observations

1. **Only Depth Matters**: To return to the main folder, we only need to count how many levels deep we are. The actual folder names are irrelevant.

2. **Three Operations**:
   - `"../"` moves up one level (decrement depth, but not below 0)
   - `"./"` stays at the same level (no change)
   - `"x/"` moves down one level (increment depth)

3. **Boundary Condition**: The main folder is the root, so we can never go above depth 0.

4. **Optimal Solution**: The minimum operations to return is simply the final depth value.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Depth Counter (Optimal)** - Simple and efficient
2. **Stack-Based Approach** - Alternative implementation for understanding

---

## Approach 1: Depth Counter (Optimal)

### Algorithm Steps

1. Initialize a depth counter to 0
2. Iterate through each log entry:
   - If log is "../" and depth > 0, decrement depth
   - If log is "./", do nothing
   - Otherwise (folder name), increment depth
3. Return the final depth value

### Why It Works

The depth counter approach works because:
- Each "../" reduces our distance from root by 1
- Each folder name increases our distance from root by 1
- The "./" operation explicitly tells us to stay in place
- We cannot go above the root, so we check depth > 0 before decrementing

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minOperations(self, logs: List[str]) -> int:
        """
        Calculate minimum operations to return to main folder.
        
        Args:
            logs: List of folder operations
            
        Returns:
            Number of operations needed to return to main folder
        """
        depth = 0
        
        for log in logs:
            if log == "../":
                # Go to parent directory if not already at root
                if depth > 0:
                    depth -= 1
            elif log == "./":
                # Stay in current directory - do nothing
                pass
            else:
                # Go into subdirectory
                depth += 1
        
        return depth
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    int minOperations(vector<string>& logs) {
        int depth = 0;
        
        for (const string& log : logs) {
            if (log == "../") {
                // Go to parent directory if not already at root
                if (depth > 0) {
                    depth--;
                }
            } else if (log == "./") {
                // Stay in current directory - do nothing
                continue;
            } else {
                // Go into subdirectory
                depth++;
            }
        }
        
        return depth;
    }
};
```

<!-- slide -->
```java
import java.util.List;

class Solution {
    public int minOperations(List<String> logs) {
        int depth = 0;
        
        for (String log : logs) {
            if ("../".equals(log)) {
                // Go to parent directory if not already at root
                if (depth > 0) {
                    depth--;
                }
            } else if ("./".equals(log)) {
                // Stay in current directory - do nothing
                continue;
            } else {
                // Go into subdirectory
                depth++;
            }
        }
        
        return depth;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string[]} logs
 * @return {number}
 */
var minOperations = function(logs) {
    let depth = 0;
    
    for (const log of logs) {
        if (log === "../") {
            // Go to parent directory if not already at root
            if (depth > 0) {
                depth--;
            }
        } else if (log === "./") {
            // Stay in current directory - do nothing
            continue;
        } else {
            // Go into subdirectory
            depth++;
        }
    }
    
    return depth;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) where n is the number of log operations |
| **Space** | O(1) as we use only a counter variable |

---

## Approach 2: Stack-Based Approach

### Algorithm Steps

1. Create an empty stack
2. Iterate through each log entry:
   - If log is "../" and stack is not empty, pop from stack
   - If log is "./", do nothing
   - Otherwise (folder name), push to stack
3. Return the stack size

### Why It Works

This approach explicitly simulates the folder hierarchy using a stack:
- Each folder name is pushed onto the stack
- "../" pops from the stack to go up one level
- The stack size represents our current depth

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minOperations(self, logs: List[str]) -> int:
        """
        Calculate minimum operations using stack simulation.
        """
        stack = []
        
        for log in logs:
            if log == "../":
                if stack:
                    stack.pop()
            elif log == "./":
                pass  # Stay in current directory
            else:
                stack.append(log)
        
        return len(stack)
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    int minOperations(vector<string>& logs) {
        vector<string> stack;
        
        for (const string& log : logs) {
            if (log == "../") {
                if (!stack.empty()) {
                    stack.pop_back();
                }
            } else if (log == "./") {
                // Stay in current directory
            } else {
                stack.push_back(log);
            }
        }
        
        return stack.size();
    }
};
```

<!-- slide -->
```java
import java.util.List;
import java.util.Stack;

class Solution {
    public int minOperations(List<String> logs) {
        Stack<String> stack = new Stack<>();
        
        for (String log : logs) {
            if ("../".equals(log)) {
                if (!stack.isEmpty()) {
                    stack.pop();
                }
            } else if ("./".equals(log)) {
                // Stay in current directory
            } else {
                stack.push(log);
            }
        }
        
        return stack.size();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string[]} logs
 * @return {number}
 */
var minOperations = function(logs) {
    const stack = [];
    
    for (const log of logs) {
        if (log === "../") {
            if (stack.length > 0) {
                stack.pop();
            }
        } else if (log === "./") {
            // Stay in current directory
        } else {
            stack.push(log);
        }
    }
    
    return stack.length;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) where n is the number of log operations |
| **Space** | O(n) in worst case for the stack |

---

## Comparison of Approaches

| Aspect | Depth Counter | Stack-Based |
|--------|--------------|-------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) |
| **Implementation** | Simple | Moderate |
| **Readability** | Very High | High |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Use Approach 1 (Depth Counter) for the optimal solution. It's simpler and uses O(1) space.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in easy difficulty interviews
- **Companies**: Amazon, Microsoft
- **Difficulty**: Easy
- **Concepts Tested**: Stack simulation, depth tracking, boundary handling

### Learning Outcomes

1. **Stack Thinking**: Learn to think in terms of stack-like operations
2. **Boundary Handling**: Understand how to handle edge cases at boundaries
3. **Optimization**: Realize when we don't need full data structure (depth counter vs stack)

---

## Related Problems

Based on similar themes (stack simulation, path tracking):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Simplify Path | [Link](https://leetcode.com/problems/simplify-path/) | Similar path simplification |
| Longest Absolute File Path | [Link](https://leetcode.com/problems/longest-absolute-file-path/) | File path depth tracking |
| Backspace String Compare | [Link](https://leetcode.com/problems/backspace-string-compare/) | Stack-based string processing |

### Pattern Reference

For more detailed explanations of the Stack Simulation pattern, see:
- **[Stack Pattern](/patterns/stack)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Crawler Log Folder - NeetCode](https://www.youtube.com/watch?v=7C9xDyM8n8E)** - Clear explanation with examples
2. **[LeetCode 1598 - Crawler Log Folder](https://www.youtube.com/watch?v=iqjTA2J5z7U)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you modify the solution to track the actual path instead of just depth?

**Answer:** Use an actual stack data structure to store folder names. Each time we encounter a folder name, push it onto the stack. When we see "../", pop from the stack. The stack will contain the full path.

---

### Q2: What if we needed to handle the case where folder names can repeat?

**Answer:** The current solution already handles repeated folder names correctly - each occurrence is treated as entering a new subdirectory regardless of whether the name was seen before. The depth counter approach doesn't care about folder names, only the number of operations.

---

### Q3: How would you handle additional operations like "~" for home directory?

**Answer:** Add another condition to check for "~" and reset depth to 0 (or handle as going to a special root level). You'd need to modify both the input validation and the processing logic.

---

### Q4: Can this problem be solved without any extra space?

**Answer:** Yes! The depth counter approach already uses O(1) space. We don't need to store any folder names or maintain a stack - we only need to track the current depth level.

---

## Common Pitfalls

### 1. Not Handling Root Boundary
**Issue**: Allowing depth to go negative when going above root directory.

**Solution**: Always check `if depth > 0` before decrementing.

### 2. Ignoring "./" Operation
**Issue**: Treating "./" as a child directory.

**Solution**: Skip "./" as it means "stay in current directory".

### 3. Trailing Slash Handling
**Issue**: Not accounting for the "/" in folder names.

**Solution**: The problem guarantees format, just compare entire string.

### 4. String Comparison Errors
**Issue**: Using `==` for string comparison in some languages.

**Solution**: Use proper string comparison methods (`.equals()` in Java, `===` in JavaScript).

---

## Summary

The **Crawler Log Folder** problem is a simple but important exercise in stack simulation and depth tracking:

Key takeaways:
1. We only need to track depth, not the actual folder names
2. The three operations ("../", "./", "x/") have simple, predictable effects on depth
3. Always handle the boundary condition at the root directory
4. The answer is simply the final depth value

This problem demonstrates how sometimes the simplest solution (depth counter) is the best - we don't need complex data structures when a single integer can solve the problem.

### Pattern Summary

This problem exemplifies the **Stack Simulation** pattern, characterized by:
- Tracking hierarchical depth levels
- Handling push/pop operations
- Managing boundary conditions
- Converting real-world operations to simple state changes

For more details on this pattern and its variations, see the **[Stack Pattern](/patterns/stack)**.

---

## Additional Resources

- [LeetCode Problem 1598](https://leetcode.com/problems/crawler-log-folder/) - Official problem page
- [Stack - GeeksforGeeks](https://www.geeksforgeeks.org/stack-data-structure/) - Detailed stack explanation
- [Pattern: Stack](/patterns/stack) - Comprehensive pattern guide
