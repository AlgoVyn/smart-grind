# Remove Invalid Parentheses

## Problem Description

Given a string `s` that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid.

Return a list of unique strings that are valid with the minimum number of removals. You may return the answer in any order.

## Examples

### Example

**Input:**
```python
s = "()())()"
```

**Output:**
```python
["(())()","()()()"]
```

### Example 2

**Input:**
```python
s = "(a)())()"
```

**Output:**
```python
["(a())()","(a)()()"]
```

### Example 3

**Input:**
```python
s = ")("
```

**Output:**
```python
[""]
```

## Constraints

- `1 <= s.length <= 25`
- `s` consists of lowercase English letters and parentheses `'('` and `')'`.
- There will be at most 20 parentheses in `s`.

---

## Intuition

This problem is a classic example of the **BFS with Level-order Traversal** pattern. The pattern involves exploring all possibilities by removing one element at a time and using BFS to ensure minimum removals.

### Core Concept

The fundamental idea is:
- **BFS Exploration**: Try removing one parenthesis at a time, level by level
- **Validity Check**: Only keep strings that become valid
- **Early Termination**: Stop when we find valid strings at current level

---

## Pattern: BFS with Level-order Traversal

The key insight is:
1. Try removing parentheses one by one (level 1), then two at a time (level 2), etc.
2. The first level where we find valid strings gives us the minimum removals
3. Use a visited set to avoid processing duplicate strings

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **BFS (Optimal)** - O(n * C(n,k)) where k is min removals
2. **DFS with Backtracking** - Exponential time but more memory efficient

---

## Approach 1: BFS (Optimal)

This is the standard approach ensuring minimum removals.

### Algorithm Steps

1. Check if input is already valid
2. Initialize queue with input string
3. Process current level - try removing each parenthesis
4. If valid string found, add to result and stop
5. Otherwise, add all new strings to queue for next level

### Code Implementation

````carousel
```python
from collections import deque
from typing import List

class Solution:
    def removeInvalidParentheses(self, s: str) -> List[str]:
        """
        Remove minimum invalid parentheses using BFS.
        
        Args:
            s: Input string with parentheses and letters
            
        Returns: List of valid strings with minimum removals
        """
        def is_valid(string: str) -> bool:
            """Check if parentheses are balanced."""
            count = 0
            for c in string:
                if c == '(':
                    count += 1
                elif c == ')':
                    count -= 1
                    if count < 0:
                        return False
            return count == 0
        
        result = []
        visited = set()
        queue = deque([s])
        visited.add(s)
        found = False
        
        while queue:
            current = queue.popleft()
            
            if is_valid(current):
                result.append(current)
                found = True
            
            if found:
                continue
            
            # Generate all possibilities by removing one parenthesis
            for i in range(len(current)):
                if current[i] not in '()':
                    continue
                new_str = current[:i] + current[i+1:]
                if new_str not in visited:
                    visited.add(new_str)
                    queue.append(new_str)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_set>
#include <queue>
using namespace std;

class Solution {
public:
    vector<string> removeInvalidParentheses(string s) {
        auto isValid = [&](const string& str) -> bool {
            int count = 0;
            for (char c : str) {
                if (c == '(') count++;
                else if (c == ')') {
                    if (--count < 0) return false;
                }
            }
            return count == 0;
        };
        
        vector<string> result;
        unordered_set<string> visited;
        queue<string> q;
        q.push(s);
        visited.insert(s);
        bool found = false;
        
        while (!q.empty()) {
            string current = q.front();
            q.pop();
            
            if (isValid(current)) {
                result.push_back(current);
                found = true;
            }
            
            if (found) continue;
            
            for (int i = 0; i < current.size(); i++) {
                if (current[i] != '(' && current[i] != ')') continue;
                string newStr = current.substr(0, i) + current.substr(i + 1);
                if (visited.find(newStr) == visited.end()) {
                    visited.insert(newStr);
                    q.push(newStr);
                }
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<String> removeInvalidParentheses(String s) {
        List<String> result = new ArrayList<>();
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        
        queue.offer(s);
        visited.add(s);
        boolean found = false;
        
        while (!queue.isEmpty()) {
            String current = queue.poll();
            
            if (isValid(current)) {
                result.add(current);
                found = true;
            }
            
            if (found) continue;
            
            for (int i = 0; i < current.length(); i++) {
                if (current.charAt(i) != '(' && current.charAt(i) != ')') continue;
                String newStr = current.substring(0, i) + current.substring(i + 1);
                if (!visited.contains(newStr)) {
                    visited.add(newStr);
                    queue.offer(newStr);
                }
            }
        }
        
        return result;
    }
    
    private boolean isValid(String str) {
        int count = 0;
        for (char c : str.toCharArray()) {
            if (c == '(') count++;
            else if (c == ')') {
                if (--count < 0) return false;
            }
        }
        return count == 0;
    }
}
```

<!-- slide -->
```javascript
/**
 * Remove minimum invalid parentheses using BFS.
 * 
 * @param {string} s - Input string with parentheses and letters
 * @return {string[]} - List of valid strings with minimum removals
 */
var removeInvalidParentheses = function(s) {
    const isValid = (str) => {
        let count = 0;
        for (const c of str) {
            if (c === '(') count++;
            else if (c === ')') {
                if (--count < 0) return false;
            }
        }
        return count === 0;
    };
    
    const result = [];
    const visited = new Set();
    const queue = [s];
    visited.add(s);
    let found = false;
    
    while (queue.length > 0) {
        const current = queue.shift();
        
        if (isValid(current)) {
            result.push(current);
            found = true;
        }
        
        if (found) continue;
        
        for (let i = 0; i < current.length; i++) {
            if (current[i] !== '(' && current[i] !== ')') continue;
            const newStr = current.slice(0, i) + current.slice(i + 1);
            if (!visited.has(newStr)) {
                visited.add(newStr);
                queue.push(newStr);
            }
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * C(n,k)) - n chars, C combinations at level k |
| **Space** | O(C(n,k)) - All possible strings |

---

## Approach 2: DFS with Backtracking

This approach uses DFS to explore all possibilities with pruning.

### Algorithm Steps

1. Count minimum '(' and ')' to remove
2. Use DFS to try removing parentheses
3. Prune invalid branches early
4. Collect all valid results

### Code Implementation

````carousel
```python
class Solution:
    def removeInvalidParentheses_dfs(self, s: str) -> List[str]:
        """
        DFS approach with pruning.
        """
        def count_needed(s):
            """Count minimum '(' and ')' to remove."""
            l = r = 0
            for c in s:
                if c == '(':
                    l += 1
                elif c == ')':
                    if l > 0:
                        l -= 1
                    else:
                        r += 1
            return l, r
        
        def dfs(start, l, r, path):
            """DFS with pruning."""
            if l == 0 and r == 0:
                if is_valid(path):
                    result.add(path)
                return
            
            for i in range(start, len(s)):
                c = s[i]
                if c not in '()':
                    continue
                if r > 0 and c == ')':
                    dfs(i + 1, l, r - 1, path + s[start:i] + s[i+1:])
                elif l > 0 and c == '(':
                    dfs(i + 1, l - 1, r, path + s[start:i] + s[i+1:])
                # Skip duplicate characters
                if c == s[i-1] and i > start:
                    continue
        
        result = set()
        l, r = count_needed(s)
        dfs(0, l, r, "")
        return list(result)
```

<!-- slide -->
```cpp
class Solution {
    // Similar DFS implementation
};
```

<!-- slide -->
```java
class Solution {
    // Similar DFS implementation
}
```

<!-- slide -->
```javascript
var removeInvalidParentheses = function(s) {
    // Similar DFS implementation
};
```
````

---

## Related Problems

| Problem | LeetCode Link |
|---------|---------------|
| Valid Parentheses | [Link](https://leetcode.com/problems/valid-parentheses/) |
| Minimum Add to Make Valid | [Link](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/) |
| Minimum Insertions | [Link](https://leetcode.com/problems/minimum-insertions-to-balance-a-parentheses-string/) |

---

## Video Tutorial Links

- [NeetCode - Remove Invalid Parentheses](https://www.youtube.com/watch?v=0lGNeO7xW7k)
- [BFS Solution](https://www.youtube.com/watch?v=8Q1nQkVGYQ8)

---

## Follow-up Questions

### Q1: How to handle only one type of parenthesis?

**Answer:** Simplified to removing either all '(' or all ')' as needed.

### Q2: What if there are other bracket types?

**Answer:** Extend validity check and removal logic for all bracket types.

---

## Common Pitfalls

### 1. Not Handling Already Valid Strings
If the input string is already valid, the algorithm should return it immediately without processing. Check validity before entering BFS loop.

### 2. Missing visited Set
Without tracking visited strings, you can process the same string multiple times, leading to infinite loops or redundant work.

### 3. Not Stopping After Finding Valid Strings
Once you find valid strings at a level, you must stop exploring that level. Otherwise, you'll find strings with more removals than necessary.

### 4. Duplicate Removal of Same Parenthesis
When generating new strings, skipping duplicate parentheses at the same position helps avoid redundant combinations (e.g., "()()" - removing first '(' vs second '(' gives same result).

### 5. Wrong Level Termination
The key is to only process one level after finding valid strings. Continue to collect all valid strings at that level, but don't go deeper.

---

## Summary

The BFS approach guarantees finding all valid strings with minimum removals by exploring level by level.
