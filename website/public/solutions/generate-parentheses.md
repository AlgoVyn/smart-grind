# Generate Parentheses

## Problem Description

Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

## Examples

**Example 1:**

- **Input:** `n = 3`
- **Output:** `["((()))","(()())","(())()","()(())","()()()"]`

**Example 2:**

- **Input:** `n = 1`
- **Output:** `["()"]`

## Constraints

- `1 <= n <= 8`

---


## Pattern:

This problem follows the **Backtracking - Valid Parenthesis** pattern.

### Core Concept

- **Balance Tracking**: Track open and close counts
- **Valid Only**: Only add valid parentheses
- **Pruning**: Stop when invalid

### When to Use This Pattern

This pattern is applicable when:
1. Generating valid parentheses
2. Balance checking problems
3. Constrained string generation

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Valid Parentheses | Validation |
| Stack | Balance tracking |

---


## Intuition

The key insight is understanding the rules for building valid parentheses:
1. We can add an opening parenthesis `(` if we haven't used all n pairs yet
2. We can add a closing parenthesis `)` if it won't make the string invalid (i.e., we have more opening than closing so far)

This is a classic backtracking problem where we build the solution incrementally and backtrack when we reach an invalid state.

The number of valid parentheses combinations is the nth Catalan number: C(2n, n) / (n+1), which grows exponentially.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Backtracking (Optimal)** - O(4^n / sqrt(n)) time, O(n) space
2. **Dynamic Programming** - O(n * Catalan(n)) time, O(n * Catalan(n)) space
3. **Closure Number** - O(n * Catalan(n)) time, O(n) space

---

## Approach 1: Backtracking (Optimal)

This is the most intuitive and commonly used approach for generating parentheses.

### Why It Works

We build the string incrementally using backtracking:
- At each position, we can add '(' if we haven't used n pairs
- We can add ')' if it would still result in a valid string (open count > close count)

### Algorithm Steps

1. Start with an empty string and zero counts for open/close
2. If open count equals n, fill the rest with closing parentheses
3. Otherwise:
   - Add '(' if open < n (recurse)
   - Add ')' if open > close (recurse)

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        """
        Generate all combinations of well-formed parentheses.
        
        Args:
            n: Number of pairs of parentheses
            
        Returns:
            List of all valid parentheses combinations
        """
        result = []
        
        def backtrack(s: str, open: int, close: int):
            # If we've used all positions, add to result
            if len(s) == 2 * n:
                result.append(s)
                return
            
            # Add opening parenthesis if we haven't used n pairs
            if open < n:
                backtrack(s + '(', open + 1, close)
            
            # Add closing parenthesis if it's valid
            if close < open:
                backtrack(s + ')', open, close + 1)
        
        backtrack('', 0, 0)
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    vector<string> generateParenthesis(int n) {
        vector<string> result;
        
        function<void(string, int, int)> backtrack = [&](string s, int open, int close) {
            if (s.length() == 2 * n) {
                result.push_back(s);
                return;
            }
            
            if (open < n) {
                backtrack(s + '(', open + 1, close);
            }
            if (close < open) {
                backtrack(s + ')', open, close + 1);
            }
        };
        
        backtrack("", 0, 0);
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        
        backtrack(result, "", 0, 0, n);
        return result;
    }
    
    private void backtrack(List<String> result, String s, int open, int close, int n) {
        if (s.length() == 2 * n) {
            result.add(s);
            return;
        }
        
        if (open < n) {
            backtrack(result, s + "(", open + 1, close, n);
        }
        if (close < open) {
            backtrack(result, s + ")", open, close + 1, n);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
    const result = [];
    
    const backtrack = (s, open, close) => {
        if (s.length === 2 * n) {
            result.push(s);
            return;
        }
        
        if (open < n) {
            backtrack(s + '(', open + 1, close);
        }
        if (close < open) {
            backtrack(s + ')', open, close + 1);
        }
    };
    
    backtrack('', 0, 0);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(4^n / sqrt(n)) - The number of valid combinations (Catalan number) |
| **Space** | O(n) - Recursion depth plus output storage |

---

## Approach 2: Dynamic Programming

This approach builds solutions from smaller subproblems.

### Why It Works

A valid parentheses combination can be seen as:
- An opening bracket
- A valid combination of size i
- A closing bracket
- A valid combination of size n-1-i

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def generateParenthesis_dp(self, n: int) -> List[str]:
        """
        Generate parentheses using dynamic programming.
        
        Args:
            n: Number of pairs of parentheses
            
        Returns:
            List of all valid parentheses combinations
        """
        dp = [[] for _ in range(n + 1)]
        dp[0] = [""]
        
        for i in range(1, n + 1):
            for j in range(i):
                # Combine each combination from left and right
                for left in dp[j]:
                    for right in dp[i - 1 - j]:
                        dp[i].append("(" + left + ")" + right)
        
        return dp[n]
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<string> generateParenthesis(int n) {
        vector<vector<string>> dp(n + 1);
        dp[0] = {""};
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                for (const string& left : dp[j]) {
                    for (const string& right : dp[i - 1 - j]) {
                        dp[i].push_back("(" + left + ")" + right);
                    }
                }
            }
        }
        
        return dp[n];
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<String> generateParenthesis(int n) {
        List<List<String>> dp = new ArrayList<>();
        dp.add(Arrays.asList(""));
        
        for (int i = 1; i <= n; i++) {
            List<String> current = new ArrayList<>();
            for (int j = 0; j < i; j++) {
                for (String left : dp.get(j)) {
                    for (String right : dp.get(i - 1 - j)) {
                        current.add("(" + left + ")" + right);
                    }
                }
            }
            dp.add(current);
        }
        
        return dp.get(n);
    }
}
```

<!-- slide -->
```javascript
var generateParenthesis = function(n) {
    const dp = Array.from({ length: n + 1 }, () => []);
    dp[0] = [''];
    
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            for (const left of dp[j]) {
                for (const right of dp[i - 1 - j]) {
                    dp[i].push('(' + left + ')' + right);
                }
            }
        }
    }
    
    return dp[n];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * Catalan(n)) - For each i, we generate Catalan(i) * Catalan(i-1-i) combinations |
| **Space** | O(n * Catalan(n)) - Storing all combinations |

---

## Approach 3: Closure Number

This approach focuses on the first valid closure.

### Why It Works

Every valid parentheses combination can be represented as:
- k pairs of `()` around a valid combination
- Followed by a valid combination

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def generateParenthesis_closure(self, n: int) -> List[str]:
        """
        Generate parentheses using closure approach.
        
        Args:
            n: Number of pairs of parentheses
            
        Returns:
            List of all valid parentheses combinations
        """
        if n == 0:
            return [""]
        
        result = []
        
        for c in range(n):
            # For each possible number of pairs inside the first closure
            for left in self.generateParenthesis_closure(c):
                for right in self.generateParenthesis_closure(n - 1 - c):
                    result.append("(" + left + ")" + right)
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<string> generateParenthesis(int n) {
        if (n == 0) return {""};
        
        vector<string> result;
        for (int c = 0; c < n; c++) {
            for (const string& left : generateParenthesis(c)) {
                for (const string& right : generateParenthesis(n - 1 - c)) {
                    result.push_back("(" + left + ")" + right);
                }
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<String> generateParenthesis(int n) {
        if (n == 0) return Arrays.asList("");
        
        List<String> result = new ArrayList<>();
        for (int c = 0; c < n; c++) {
            for (String left : generateParenthesis(c)) {
                for (String right : generateParenthesis(n - 1 - c)) {
                    result.add("(" + left + ")" + right);
                }
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
var generateParenthesis = function(n) {
    if (n === 0) return [''];
    
    const result = [];
    for (let c = 0; c < n; c++) {
        for (const left of generateParenthesis(c)) {
            for (const right of generateParenthesis(n - 1 - c)) {
                result.push('(' + left + ')' + right);
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
| **Time** | O(n * Catalan(n)) - Same as DP approach |
| **Space** | O(n) - For recursion stack |

---

## Comparison of Approaches

| Aspect | Backtracking | DP | Closure |
|--------|--------------|-----|---------|
| **Time Complexity** | O(4^n / sqrt(n)) | O(n * Catalan(n)) | O(n * Catalan(n)) |
| **Space Complexity** | O(n) | O(n * Catalan(n)) | O(n) |
| **Implementation** | Simple | Moderate | Moderate |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |
| **Best For** | Most cases | Understanding DP | Alternative view |

**Best Approach:** The backtracking approach (Approach 1) is optimal and most commonly used.

---

## Why Backtracking is Optimal for This Problem

1. **Natural Fit**: The problem naturally requires exploring all valid combinations
2. **Pruning**: We prune invalid branches early (when close >= open)
3. **Simple Implementation**: Clear and easy to understand
4. **Space Efficient**: Only O(n) space for recursion stack

---

## Related Problems

Based on similar themes (backtracking, generation):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Valid Parentheses | [Link](https://leetcode.com/problems/valid-parentheses/) | Check if parentheses are valid |
| Longest Valid Parentheses | [Link](https://leetcode.com/problems/longest-valid-parentheses/) | Find longest valid substring |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Letter Combinations of a Phone Number | [Link](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) | Similar backtracking |
| Combination Sum | [Link](https://leetcode.com/problems/combination-sum/) | Backtracking with sum |
| N-Queens | [Link](https://leetcode.com/problems/n-queens/) | Classic backtracking |

---

## Video Tutorial Links

### Backtracking Approach

- [NeetCode - Generate Parentheses](https://www.youtube.com/watch?v=qB18P1dXZ6c) - Clear explanation
- [Generate Parentheses - Backtracking](https://www.youtube.com/watch?v=63esG4ZU4ks) - Step-by-step

### Dynamic Programming

- [DP Approach Explained](https://www.youtube.com/watch?v=y1oVWLk6qwk) - Understanding DP solution
- [Catalan Numbers](https://www.youtube.com/watch?v=ZSJ4qT2C6oM) - Mathematical background

---

## Follow-up Questions

### Q1: How many valid parentheses combinations are there for n pairs?

**Answer:** The number is the nth Catalan number: C(2n, n) / (n+1). For n=1, it's 1; n=2, it's 2; n=3, it's 5; n=4, it's 14; n=5, it's 42.

---

### Q2: How would you modify the solution to generate all combinations of any type of brackets?

**Answer:** Add parameters for each bracket type and ensure you close each type in the correct order. You'd need separate counts for each bracket type and ensure the closing order is valid.

---

### Q3: Can you generate only k specific combinations instead of all?

**Answer:** Yes, you could use a counter to stop after generating k combinations. However, you'd need to track which combinations have been generated to ensure uniqueness.

---

### Q4: How would you handle the problem if it asked for all combinations with exactly k opening brackets?

**Answer:** Add a parameter to track the number of opening brackets used and prune branches that don't match the target count.

---

### Q5: What edge cases should be tested?

**Answer:**
- n = 0 (should return empty list or handle appropriately)
- n = 1 (should return ["()"])
- n = 8 (maximum constraint)
- Large outputs (ensure efficient memory usage)

---



## Common Pitfalls

### 1. Not Checking Validity
**Issue:** Generating invalid parentheses.

**Solution:** Only add open if open < n, close if close < open.

### 2. Wrong Base Case
**Issue:** Stopping at wrong time.

**Solution:** Add to result when len(current) == 2*n.

### 3. Not Copying Result
**Issue:** All results point to same string.

**Solution:** Add copy: result.append(current[:])

---

## Summary

The **Generate Parentheses** problem demonstrates the power of backtracking:

- **Backtracking**: Optimal with O(4^n / sqrt(n)) time
- **Dynamic Programming**: Alternative with O(n * Catalan(n)) time
- **Closure Number**: Another perspective on the problem

The key insight is that valid parentheses can be built incrementally by ensuring:
- We never close more than we open
- We use exactly n pairs

This is a classic backtracking problem essential for understanding recursion and combinatorial generation.

---

## Additional Resources

- [LeetCode Problem](https://leetcode.com/problems/generate-parentheses/)
- [Catalan Number - Wikipedia](https://en.wikipedia.org/wiki/Catalan_number)
- [Backtracking - GeeksforGeeks](https://www.geeksforgeeks.org/backtracking-algorithms/)
