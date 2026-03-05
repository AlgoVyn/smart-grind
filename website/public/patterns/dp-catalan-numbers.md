# DP - Catalan Numbers

## Problem Description

Catalan numbers form a sequence of natural numbers that appear in various counting problems, particularly those involving recursively-defined objects. This pattern is essential for problems involving valid parentheses, binary trees, triangulations, and recursive structures.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n²) for DP approach, O(n) for mathematical approach |
| Space Complexity | O(n) for DP, O(1) for mathematical |
| Formula | C(n) = (2n)! / ((n+1)! × n!) or C(n) = Σ C(i) × C(n-1-i) |
| Output | nth Catalan number or all Catalan numbers up to n |
| Approach | DP building from smaller subproblems |

### When to Use

- **Valid Parentheses**: Count valid parentheses combinations
- **Binary Trees**: Count unique BST structures with n nodes
- **Triangulation**: Count ways to triangulate a polygon
- **Dyck Paths**: Count paths that don't go below diagonal
- **Stack Sortable Permutations**: Count permutations sortable by one stack
- **Recursive Structures**: Any problem with recursive decomposition

## Intuition

The key insight is that Catalan problems decompose into two independent subproblems, whose solutions multiply and sum across all possible split points.

The "aha!" moments:

1. **Recursive structure**: C(n) = sum of C(i) × C(n-1-i) for all i from 0 to n-1
2. **Left-right decomposition**: Many problems split into independent left and right parts
3. **Base cases**: C(0) = C(1) = 1
4. **Combinatorial formula**: C(n) = C(2n, n) / (n+1) for direct computation
5. **Pattern recognition**: Look for "valid combinations", "unique structures", "non-crossing" patterns

## Solution Approaches

### Approach 1: Dynamic Programming ✅ Recommended

Build Catalan numbers iteratively using the recurrence relation.

#### Algorithm

1. Initialize dp array of size (n+1) with 0
2. Set dp[0] = dp[1] = 1 (base cases)
3. For i from 2 to n:
   - For j from 0 to i-1:
     - dp[i] += dp[j] × dp[i-1-j]
4. Return dp[n]

#### Implementation

````carousel
```python
def catalan_number(n):
    """
    Calculate nth Catalan number using DP.
    
    Time: O(n²), Space: O(n)
    """
    if n <= 1:
        return 1
    
    dp = [0] * (n + 1)
    dp[0] = dp[1] = 1
    
    for i in range(2, n + 1):
        for j in range(i):
            dp[i] += dp[j] * dp[i - 1 - j]
    
    return dp[n]

def all_catalan_numbers(n):
    """Return all Catalan numbers from C(0) to C(n)."""
    dp = [0] * (n + 1)
    dp[0] = 1
    
    for i in range(1, n + 1):
        for j in range(i):
            dp[i] += dp[j] * dp[i - 1 - j]
    
    return dp
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    long long catalanNumber(int n) {
        if (n <= 1) return 1;
        
        vector<long long> dp(n + 1, 0);
        dp[0] = dp[1] = 1;
        
        for (int i = 2; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                dp[i] += dp[j] * dp[i - 1 - j];
            }
        }
        
        return dp[n];
    }
};
```
<!-- slide -->
```java
class Solution {
    public long catalanNumber(int n) {
        if (n <= 1) return 1;
        
        long[] dp = new long[n + 1];
        dp[0] = dp[1] = 1;
        
        for (int i = 2; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                dp[i] += dp[j] * dp[i - 1 - j];
            }
        }
        
        return dp[n];
    }
}
```
<!-- slide -->
```javascript
function catalanNumber(n) {
    if (n <= 1) return 1;
    
    const dp = new Array(n + 1).fill(0);
    dp[0] = dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            dp[i] += dp[j] * dp[i - 1 - j];
        }
    }
    
    return dp[n];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) |
| Space | O(n) |

### Approach 2: Mathematical Formula (Binomial Coefficient)

Compute directly using C(n) = C(2n, n) / (n + 1).

#### Implementation

````carousel
```python
def catalan_number_math(n):
    """
    Calculate nth Catalan number using binomial coefficient.
    C(n) = C(2n, n) / (n + 1)
    
    Time: O(n), Space: O(1)
    """
    from math import comb
    return comb(2 * n, n) // (n + 1)

# Manual calculation without math.comb
def catalan_number_manual(n):
    """Calculate without using built-in comb function."""
    if n <= 1:
        return 1
    
    result = 1
    # Calculate C(2n, n)
    for i in range(n):
        result = result * (2 * n - i) // (i + 1)
    
    return result // (n + 1)

# First 10 Catalan numbers:
# C(0)=1, C(1)=1, C(2)=2, C(3)=5, C(4)=14, C(5)=42, C(6)=132, C(7)=429, C(8)=1430, C(9)=4862
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    long long catalanNumberMath(int n) {
        // C(2n, n) / (n + 1)
        long long result = 1;
        
        // Calculate C(2n, n)
        for (int i = 0; i < n; i++) {
            result = result * (2 * n - i) / (i + 1);
        }
        
        return result / (n + 1);
    }
};
```
<!-- slide -->
```java
class Solution {
    public long catalanNumberMath(int n) {
        long result = 1;
        
        // Calculate C(2n, n)
        for (int i = 0; i < n; i++) {
            result = result * (2 * n - i) / (i + 1);
        }
        
        return result / (n + 1);
    }
}
```
<!-- slide -->
```javascript
function catalanNumberMath(n) {
    let result = 1;
    
    // Calculate C(2n, n)
    for (let i = 0; i < n; i++) {
        result = result * (2 * n - i) / (i + 1);
    }
    
    return result / (n + 1);
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(1) |

### Approach 3: Generate Valid Parentheses (Application)

Generate all valid combinations of n pairs of parentheses.

#### Implementation

````carousel
```python
def generate_parentheses(n):
    """
    Generate all valid parentheses combinations.
    LeetCode 22 - Generate Parentheses
    
    Time: O(4^n / sqrt(n)), Space: O(n) for recursion
    """
    result = []
    
    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:
            result.append(current)
            return
        
        # Can add opening parenthesis
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        
        # Can add closing parenthesis
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)
    
    backtrack('', 0, 0)
    return result

# Alternative: Using Catalan DP approach with string building
def generate_parentheses_dp(n):
    """Generate using Catalan structure - less efficient but educational."""
    if n == 0:
        return ['']
    
    result = []
    for i in range(n):
        left = generate_parentheses_dp(i)
        right = generate_parentheses_dp(n - 1 - i)
        for l in left:
            for r in right:
                result.append(f'({l}){r}')
    
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
        backtrack(result, "", 0, 0, n);
        return result;
    }
    
private:
    void backtrack(vector<string>& result, string current, int open, int close, int n) {
        if (current.length() == 2 * n) {
            result.push_back(current);
            return;
        }
        
        if (open < n) {
            backtrack(result, current + '(', open + 1, close, n);
        }
        
        if (close < open) {
            backtrack(result, current + ')', open, close + 1, n);
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        backtrack(result, "", 0, 0, n);
        return result;
    }
    
    private void backtrack(List<String> result, String current, int open, int close, int n) {
        if (current.length() == 2 * n) {
            result.add(current);
            return;
        }
        
        if (open < n) {
            backtrack(result, current + '(', open + 1, close, n);
        }
        
        if (close < open) {
            backtrack(result, current + ')', open, close + 1, n);
        }
    }
}
```
<!-- slide -->
```javascript
function generateParenthesis(n) {
    const result = [];
    
    function backtrack(current, open, close) {
        if (current.length === 2 * n) {
            result.push(current);
            return;
        }
        
        if (open < n) {
            backtrack(current + '(', open + 1, close);
        }
        
        if (close < open) {
            backtrack(current + ')', open, close + 1);
        }
    }
    
    backtrack('', 0, 0);
    return result;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(4^n / √n) - nth Catalan number |
| Space | O(n) for recursion stack |

### Approach 4: Unique Binary Search Trees (Application)

Count structurally unique BSTs that store values 1 to n.

#### Implementation

````carousel
```python
def num_trees(n):
    """
    Count unique BSTs with n nodes.
    LeetCode 96 - Unique Binary Search Trees
    
    Time: O(n²), Space: O(n)
    """
    dp = [0] * (n + 1)
    dp[0] = dp[1] = 1
    
    for nodes in range(2, n + 1):
        for root in range(1, nodes + 1):
            left_trees = dp[root - 1]
            right_trees = dp[nodes - root]
            dp[nodes] += left_trees * right_trees
    
    return dp[n]
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int numTrees(int n) {
        vector<int> dp(n + 1, 0);
        dp[0] = dp[1] = 1;
        
        for (int nodes = 2; nodes <= n; nodes++) {
            for (int root = 1; root <= nodes; root++) {
                dp[nodes] += dp[root - 1] * dp[nodes - root];
            }
        }
        
        return dp[n];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int numTrees(int n) {
        int[] dp = new int[n + 1];
        dp[0] = dp[1] = 1;
        
        for (int nodes = 2; nodes <= n; nodes++) {
            for (int root = 1; root <= nodes; root++) {
                dp[nodes] += dp[root - 1] * dp[nodes - root];
            }
        }
        
        return dp[n];
    }
}
```
<!-- slide -->
```javascript
function numTrees(n) {
    const dp = new Array(n + 1).fill(0);
    dp[0] = dp[1] = 1;
    
    for (let nodes = 2; nodes <= n; nodes++) {
        for (let root = 1; root <= nodes; root++) {
            dp[nodes] += dp[root - 1] * dp[nodes - root];
        }
    }
    
    return dp[n];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) |
| Space | O(n) |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| DP Recurrence | O(n²) | O(n) | Need all Catalan numbers or sequence |
| Mathematical | O(n) | O(1) | Just need nth Catalan number |
| Parentheses Generation | O(4^n/√n) | O(n) | Generate all valid combinations |
| Unique BSTs | O(n²) | O(n) | Count tree structures |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) | 22 | Medium | Generate all valid parentheses |
| [Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees/) | 96 | Medium | Count unique BST structures |
| [Unique Binary Search Trees II](https://leetcode.com/problems/unique-binary-search-trees-ii/) | 95 | Medium | Generate all unique BSTs |
| [Number of Ways to Draw Stairs](https://leetcode.com/problems/number-of-ways-to-draw-stairs/) | - | Medium | Catalan-like stair drawing |
| [Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses/) | 241 | Medium | All possible evaluation orders |
| [Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string/) | 678 | Medium | Check valid parentheses with wildcards |

## Video Tutorial Links

1. **[NeetCode - Unique Binary Search Trees](https://www.youtube.com/watch?v=OIc0mHgHUww)** - Catalan DP explained
2. **[Back To Back SWE - Catalan Numbers](https://www.youtube.com/watch?v=eoofUgX7VGg)** - Pattern explanation
3. **[Kevin Naughton Jr. - Generate Parentheses](https://www.youtube.com/watch?v=s9fokUqJ76A)** - Backtracking approach
4. **[Abdul Bari - Catalan Number](https://www.youtube.com/watch?v=eoofUgX7VGg)** - Mathematical explanation
5. **[Techdose - Catalan Number Applications](https://www.youtube.com/watch?v=0iD1H2dBp0s)** - Real-world applications

## Summary

### Key Takeaways

- **Recursive formula**: C(n) = Σ C(i) × C(n-1-i) for i from 0 to n-1
- **Base cases**: C(0) = C(1) = 1
- **Mathematical shortcut**: C(n) = C(2n, n) / (n+1)
- **Pattern recognition**: Look for "valid combinations", "non-crossing", "unique structures"
- **Decomposition**: Problems often split into independent left and right parts
- **Applications**: Parentheses, BSTs, triangulations, Dyck paths

### Common Pitfalls

- **Integer overflow**: Catalan numbers grow very fast; use long/long long
- **Off-by-one in loops**: Ensure loops cover all split points correctly
- **Wrong base cases**: Forgetting C(0) = 1 or C(1) = 1
- **Confusing with Fibonacci**: Catalan has different recurrence
- **Not recognizing the pattern**: Many problems are Catalan in disguise
- **Modulo operations**: For large n, results may need modulo

### Follow-up Questions

1. **How would you solve this modulo 10^9+7?**
   - Use modular arithmetic at each step; precompute modular inverses for math formula

2. **Can you generate all unique BSTs, not just count them?**
   - Use recursion with memoization to generate tree structures

3. **What other problems use Catalan numbers?**
   - Polygon triangulation, Dyck paths, mountain ranges, non-crossing partitions

4. **How does this relate to other counting problems?**
   - Catalan is a special case of many combinatorial sequences

## Pattern Source

[Catalan Numbers Pattern](patterns/dp-catalan-numbers.md)
