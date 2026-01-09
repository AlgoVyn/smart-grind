# Remove Invalid Parentheses

## Problem Description
Given a string s that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid.
Return a list of unique strings that are valid with the minimum number of removals. You may return the answer in any order.
 
Example 1:

Input: s = "()())()"
Output: ["(())()","()()()"]

Example 2:

Input: s = "(a)())()"
Output: ["(a())()","(a)()()"]

Example 3:

Input: s = ")("
Output: [""]

 
Constraints:

1 <= s.length <= 25
s consists of lowercase English letters and parentheses '(' and ')'.
There will be at most 20 parentheses in s.
## Solution

```python
from collections import deque
from typing import List

class Solution:
    def removeInvalidParentheses(self, s: str) -> List[str]:
        def is_valid(string):
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
                continue  # no need to remove more
            
            for i in range(len(current)):
                if current[i] not in '()':
                    continue
                new_str = current[:i] + current[i+1:]
                if new_str not in visited:
                    visited.add(new_str)
                    queue.append(new_str)
        
        return result
```

## Explanation

This problem requires removing the minimum number of invalid parentheses to make the string valid, returning all unique valid strings.

### Approach

We use BFS to explore all possible strings by removing one parenthesis at a time. We start with the original string and generate new strings by removing one parenthesis. We use a queue for BFS and a set to avoid processing the same string multiple times. Once we find valid strings at the current level (minimum removals), we collect them and stop exploring further levels.

### Step-by-Step Explanation

1. **Validity Check**: Define a helper function to check if a string has valid parentheses using a counter.

2. **BFS Setup**: Initialize a queue with the original string, a set for visited strings, and a list for results.

3. **BFS Traversal**:
   - Dequeue a string.
   - If it's valid, add to result and set a flag.
   - If flag is set, skip generating new strings.
   - Otherwise, for each position with a parenthesis, generate a new string by removing it, and enqueue if not visited.

4. **Return Results**: Return the list of valid strings with minimum removals.

### Time Complexity

- O(2^n) in the worst case, where n is the length of the string, but constrained by n <= 25 and at most 20 parentheses, making it feasible.

### Space Complexity

- O(2^n) for the queue and visited set in the worst case.
