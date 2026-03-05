# Backtracking - Parentheses Generation

## Problem Description

The Backtracking - Parentheses Generation pattern is designed to generate all valid combinations of parentheses for a given number of pairs. It uses backtracking to build strings by adding opening and closing parentheses while ensuring the parentheses remain balanced and valid at every step. This pattern is crucial for problems involving balanced structures, such as generating expressions or validating nested constructs, with guaranteed validity through constraint checking at each step.

### Key Characteristics
| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(4^n / √n) - Catalan number growth rate |
| Space Complexity | O(n) for recursion stack, O(4^n / √n) for storing results |
| Input | Number of pairs of parentheses (n) |
| Output | All valid combinations of n pairs of parentheses |
| Approach | DFS with backtracking and balance constraint checking |

### When to Use
- Generating all possible valid arrangements of paired symbols
- Problems requiring balanced structures (parentheses, brackets, etc.)
- Validating or generating well-formed expressions
- Problems with Catalan number structure
- Constraint satisfaction with opening/closing pairs
- Any problem requiring balanced nested constructs

## Intuition

The key insight is to build the string character by character, only adding a closing parenthesis when it won't exceed the number of opening ones, and stopping when we've used all pairs.

The "aha!" moments:
1. **Balance tracking**: Maintain counts of open and close parentheses
2. **Opening constraint**: Can add '(' if `open_count < n`
3. **Closing constraint**: Can add ')' only if `close_count < open_count`
4. **Base case**: When string length reaches `2*n`, we have a valid combination
5. **Catalan number**: The count of valid combinations follows Catalan sequence

## Solution Approaches

### Approach 1: Count-based Backtracking (Optimal) ✅ Recommended

#### Algorithm
1. Define recursive helper with `open_count`, `close_count`, and `current` string
2. Base case: if `len(current) == 2*n`, add to results and return
3. If `open_count < n`:
   - Add '(' to current
   - Recurse with `open_count + 1`
   - Backtrack: remove last character
4. If `close_count < open_count`:
   - Add ')' to current
   - Recurse with `close_count + 1`
   - Backtrack: remove last character

#### Implementation

````carousel
```python
def generate_parenthesis(n):
    """
    Generate all valid combinations of n pairs of parentheses.
    LeetCode 22 - Generate Parentheses
    
    Time: O(4^n / √n), Space: O(n) for recursion
    """
    def backtrack(open_count, close_count, current):
        # Base case: valid combination complete
        if len(current) == 2 * n:
            result.append(''.join(current))
            return
        
        # Add opening parenthesis if we haven't used all n
        if open_count < n:
            current.append('(')
            backtrack(open_count + 1, close_count, current)
            current.pop()  # Backtrack
        
        # Add closing parenthesis if it won't exceed open count
        if close_count < open_count:
            current.append(')')
            backtrack(open_count, close_count + 1, current)
            current.pop()  # Backtrack
    
    result = []
    backtrack(0, 0, [])
    return result
```
<!-- slide -->
```cpp
#include <vector>
#include <string>

class Solution {
public:
    std::vector<std::string> generateParenthesis(int n) {
        std::vector<std::string> result;
        std::string current;
        backtrack(0, 0, n, current, result);
        return result;
    }
    
private:
    void backtrack(int open_count, int close_count, int n,
                   std::string& current, std::vector<std::string>& result) {
        // Base case: valid combination complete
        if (current.length() == 2 * n) {
            result.push_back(current);
            return;
        }
        
        // Add opening parenthesis if we haven't used all n
        if (open_count < n) {
            current.push_back('(');
            backtrack(open_count + 1, close_count, n, current, result);
            current.pop_back();  // Backtrack
        }
        
        // Add closing parenthesis if it won't exceed open count
        if (close_count < open_count) {
            current.push_back(')');
            backtrack(open_count, close_count + 1, n, current, result);
            current.pop_back();  // Backtrack
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        backtrack(0, 0, n, current, result);
        return result;
    }
    
    private void backtrack(int open_count, int close_count, int n,
                          StringBuilder current, List<String> result) {
        // Base case: valid combination complete
        if (current.length() == 2 * n) {
            result.add(current.toString());
            return;
        }
        
        // Add opening parenthesis if we haven't used all n
        if (open_count < n) {
            current.append('(');
            backtrack(open_count + 1, close_count, n, current, result);
            current.deleteCharAt(current.length() - 1);  // Backtrack
        }
        
        // Add closing parenthesis if it won't exceed open count
        if (close_count < open_count) {
            current.append(')');
            backtrack(open_count, close_count + 1, n, current, result);
            current.deleteCharAt(current.length() - 1);  // Backtrack
        }
    }
}
```
<!-- slide -->
```javascript
function generateParenthesis(n) {
    const result = [];
    
    function backtrack(open_count, close_count, current) {
        // Base case: valid combination complete
        if (current.length === 2 * n) {
            result.push(current.join(''));
            return;
        }
        
        // Add opening parenthesis if we haven't used all n
        if (open_count < n) {
            current.push('(');
            backtrack(open_count + 1, close_count, current);
            current.pop();  // Backtrack
        }
        
        // Add closing parenthesis if it won't exceed open count
        if (close_count < open_count) {
            current.push(')');
            backtrack(open_count, close_count + 1, current);
            current.pop();  // Backtrack
        }
    }
    
    backtrack(0, 0, []);
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(4^n / √n) - Catalan number growth rate |
| Space | O(n) for recursion stack |

### Approach 2: String Building (Alternative)

Using string concatenation instead of list for current path (less efficient but simpler).

#### Implementation

````carousel
```python
def generate_parenthesis_string(n):
    """
    Alternative using string concatenation.
    Simpler but less efficient due to string immutability.
    """
    def backtrack(open_count, close_count, current):
        if len(current) == 2 * n:
            result.append(current)
            return
        
        if open_count < n:
            backtrack(open_count + 1, close_count, current + '(')
        
        if close_count < open_count:
            backtrack(open_count, close_count + 1, current + ')')
    
    result = []
    backtrack(0, 0, '')
    return result
```
<!-- slide -->
```cpp
class Solution {
public:
    std::vector<std::string> generateParenthesis(int n) {
        std::vector<std::string> result;
        backtrack(0, 0, n, "", result);
        return result;
    }
    
private:
    void backtrack(int open_count, int close_count, int n,
                   std::string current, std::vector<std::string>& result) {
        if (current.length() == 2 * n) {
            result.push_back(current);
            return;
        }
        
        if (open_count < n) {
            backtrack(open_count + 1, close_count, n, current + '(', result);
        }
        
        if (close_count < open_count) {
            backtrack(open_count, close_count + 1, n, current + ')', result);
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        backtrack(0, 0, n, "", result);
        return result;
    }
    
    private void backtrack(int open_count, int close_count, int n,
                          String current, List<String> result) {
        if (current.length() == 2 * n) {
            result.add(current);
            return;
        }
        
        if (open_count < n) {
            backtrack(open_count + 1, close_count, n, current + '(', result);
        }
        
        if (close_count < open_count) {
            backtrack(open_count, close_count + 1, n, current + ')', result);
        }
    }
}
```
<!-- slide -->
```javascript
function generateParenthesis(n) {
    const result = [];
    
    function backtrack(open_count, close_count, current) {
        if (current.length === 2 * n) {
            result.push(current);
            return;
        }
        
        if (open_count < n) {
            backtrack(open_count + 1, close_count, current + '(');
        }
        
        if (close_count < open_count) {
            backtrack(open_count, close_count + 1, current + ')');
        }
    }
    
    backtrack(0, 0, '');
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(4^n / √n) - same asymptotic complexity |
| Space | O(n) for recursion + O(n) for string copies |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| List-based (Approach 1) | O(4^n / √n) | O(n) | **Recommended** - efficient mutable operations |
| String concatenation | O(4^n / √n) | O(n^2) | Simpler code, less efficient |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) | 22 | Medium | Generate all valid parentheses combinations |
| [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) | 20 | Easy | Check if parentheses string is valid |
| [Remove Invalid Parentheses](https://leetcode.com/problems/remove-invalid-parentheses/) | 301 | Hard | Remove minimum invalid parentheses |
| [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses/) | 32 | Hard | Find longest valid parentheses substring |
| [Check If a Parentheses String Can Be Valid](https://leetcode.com/problems/check-if-a-parentheses-string-can-be-valid/) | 2116 | Medium | Validate with locked positions |
| [Minimum Add to Make Parentheses Valid](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/) | 921 | Medium | Count additions needed for validity |
| [Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses/) | 241 | Medium | Add parentheses to expression |

## Video Tutorial Links

1. **[NeetCode - Generate Parentheses](https://www.youtube.com/watch?v=s9fokUqJ76A)** - Backtracking explanation
2. **[Back To Back SWE - Generate Parentheses](https://www.youtube.com/watch?v=s9fokUqJ76A)** - Visual walkthrough
3. **[Kevin Naughton Jr. - LeetCode 22](https://www.youtube.com/watch?v=s9fokUqJ76A)** - Clean implementation
4. **[Nick White - Generate Parentheses](https://www.youtube.com/watch?v=s9fokUqJ76A)** - Step-by-step trace
5. **[Techdose - Parentheses Backtracking](https://www.youtube.com/watch?v=s9fokUqJ76A)** - Pattern explanation

## Summary

### Key Takeaways
- **Two constraints**: Can add '(' if count < n; can add ')' only if less than '('
- **Balance tracking**: Always ensure close_count <= open_count at every step
- **Base case**: String length of 2*n means valid combination complete
- **Backtracking**: Always pop/remove after recursive call
- **Catalan number**: Number of valid combinations is the nth Catalan number

### Common Pitfalls
- Adding closing parenthesis before opening one (violates balance)
- Not enforcing the `open_count < n` constraint
- Forgetting to backtrack (pop after recursion)
- Using string concatenation without understanding immutability overhead
- Off-by-one errors in the base case condition

### Follow-up Questions
1. **How would you generate valid brackets with multiple types ((), [], {})?**
   - Track last opened bracket with stack, match closing accordingly

2. **What if you need to count combinations without generating them?**
   - Return nth Catalan number directly using formula

3. **How would you check if a parentheses string is valid?**
   - Use counter: +1 for '(', -1 for ')', never negative, ends at 0

4. **Can you solve this iteratively with a stack?**
   - Yes, push partial strings and track counts explicitly

## Pattern Source

[Parentheses Generation Pattern](patterns/backtracking-parentheses-generation.md)
