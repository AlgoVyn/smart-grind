# Different Ways To Add Parentheses

## Problem Description

Given a string expression of numbers and operators, return all possible results from computing all the different possible ways to group numbers and operators. You may return the answer in any order.

The test cases are generated such that the output values fit in a 32-bit integer and the number of different results does not exceed 10^4.

**Link to problem:** [Different Ways to Add Parentheses - LeetCode 241](https://leetcode.com/problems/different-ways-to-add-parentheses/)

---

## Examples

### Example

**Input:**
```
expression = "2-1-1"
```

**Output:**
```
[0,2]
```

**Explanation:**
```
((2-1)-1) = 0
(2-(1-1)) = 2
```

### Example 2

**Input:**
```
expression = "2*3-4*5"
```

**Output:**
```
[-34,-14,-10,-10,10]
```

**Explanation:**
```
(2*(3-(4*5))) = -34
((2*3)-(4*5)) = -14
((2*(3-4))*5) = -10
(2*((3-4)*5)) = -10
(((2*3)-4)*5) = 10
```

---

## Constraints

- `1 <= expression.length <= 20`
- `expression` consists of digits and the operator '+', '-', and '*'.
- All the integer values in the input expression are in the range [0, 99].
- The integer values in the input expression do not have a leading '-' or '+' denoting the sign.

---

## Pattern: Divide and Conquer - Expression Evaluation

This problem is a classic example of the **Divide and Conquer** pattern for expression evaluation. The key insight is that each operator splits the expression into left and right subexpressions, which can be evaluated independently and then combined.

### Core Concept

For any operator in the expression:
- Split the expression at that operator into left and right parts
- Compute all possible results for the left expression
- Compute all possible results for the right expression
- Combine each left result with each right result using the operator

This creates a recursive tree of computations where each node represents a subexpression.

---

## Intuition

The fundamental insight is that operators are associative in different ways:

1. **Operator Precedence**: Different groupings produce different results due to operator precedence
2. **Divide and Conquer**: Each operator divides the problem into smaller subproblems
3. **Memoization**: The same subexpression may appear multiple times in the recursion tree, so caching results is essential

### Visual Example

For expression "2*3-4*5":

```
         *
        / \
       2   -
          / \
         3   *
            / \
           4   5

Different parenthesizations:
(2*(3-(4*5))) = 2*(3-20) = 2*(-17) = -34
((2*3)-(4*5)) = 6-20 = -14
((2*(3-4))*5) = (2*(-1))*5 = -10
(2*((3-4)*5)) = 2*(-1*5) = -10
(((2*3)-4)*5) = (6-4)*5 = 10
```

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Memoized Recursion (Optimal)** - O(n × result_count) time, uses caching
2. **Parse Tree Construction** - Build expression tree then evaluate
3. **Iterative Dynamic Programming** - Bottom-up evaluation

---

## Approach 1: Memoized Recursion (Optimal)

This is the most efficient and elegant solution using recursion with memoization.

### Algorithm Steps

1. Use a hash map to cache results for each subexpression
2. For each expression:
   - If it's a single number, return it as a list
   - If it contains operators:
     - Find each operator position
     - For each operator:
       - Recursively compute all results for left part
       - Recursively compute all results for right part
       - Combine left and right results using the operator
3. Return cached results

### Why It Works

The divide-and-conquer approach works because:
- Each operator is independent - we can evaluate left and right separately
- Different parenthesizations correspond to different ways of choosing which operator to apply first
- By exploring all operators at all positions, we cover all possible groupings
- Memoization avoids recomputing the same subexpressions

### Code Implementation

````carousel
```python
from typing import List
from functools import lru_cache

class Solution:
    def diffWaysToCompute(self, expression: str) -> List[int]:
        """
        Compute all possible results from different parenthesizations.
        
        Args:
            expression: String containing numbers and operators (+, -, *)
            
        Returns:
            List of all possible results
        """
        @lru_cache(None)
        def compute(expr: str) -> List[int]:
            # Base case: expression is just a number
            if expr.isdigit():
                return [int(expr)]
            
            results = []
            
            # Find each operator and split at that position
            for i, char in enumerate(expr):
                if char in '+-*':
                    # Recursively compute left and right parts
                    left_results = compute(expr[:i])
                    right_results = compute(expr[i+1:])
                    
                    # Combine all left and right results with the operator
                    for left in left_results:
                        for right in right_results:
                            if char == '+':
                                results.append(left + right)
                            elif char == '-':
                                results.append(left - right)
                            elif char == '*':
                                results.append(left * right)
            
            return results
        
        return compute(expression)
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
private:
    unordered_map<string, vector<int>> memo;
    
    vector<int> compute(const string& expr) {
        // Check memo
        if (memo.find(expr) != memo.end()) {
            return memo[expr];
        }
        
        vector<int> results;
        
        // Base case: expression is just a number
        if (expr.find_first_of("+-*") == string::npos) {
            results.push_back(stoi(expr));
            memo[expr] = results;
            return results;
        }
        
        // Find each operator and split at that position
        for (size_t i = 0; i < expr.size(); i++) {
            char op = expr[i];
            if (op == '+' || op == '-' || op == '*') {
                // Recursively compute left and right parts
                vector<int> leftResults = compute(expr.substr(0, i));
                vector<int> rightResults = compute(expr.substr(i + 1));
                
                // Combine all left and right results with the operator
                for (int left : leftResults) {
                    for (int right : rightResults) {
                        if (op == '+') {
                            results.push_back(left + right);
                        } else if (op == '-') {
                            results.push_back(left - right);
                        } else {
                            results.push_back(left * right);
                        }
                    }
                }
            }
        }
        
        memo[expr] = results;
        return results;
    }
    
public:
    vector<int> diffWaysToCompute(string expression) {
        return compute(expression);
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    private Map<String, List<Integer>> memo = new HashMap<>();
    
    private List<Integer> compute(String expr) {
        // Check memo
        if (memo.containsKey(expr)) {
            return memo.get(expr);
        }
        
        List<Integer> results = new ArrayList<>();
        
        // Base case: expression is just a number
        if (!expr.contains("+") && !expr.contains("-") && !expr.contains("*")) {
            results.add(Integer.parseInt(expr));
            memo.put(expr, results);
            return results;
        }
        
        // Find each operator and split at that position
        for (int i = 0; i < expr.length(); i++) {
            char op = expr.charAt(i);
            if (op == '+' || op == '-' || op == '*') {
                // Recursively compute left and right parts
                List<Integer> leftResults = compute(expr.substring(0, i));
                List<Integer> rightResults = compute(expr.substring(i + 1));
                
                // Combine all left and right results with the operator
                for (int left : leftResults) {
                    for (int right : rightResults) {
                        if (op == '+') {
                            results.add(left + right);
                        } else if (op == '-') {
                            results.add(left - right);
                        } else {
                            results.add(left * right);
                        }
                    }
                }
            }
        }
        
        memo.put(expr, results);
        return results;
    }
    
    public List<Integer> diffWaysToCompute(String expression) {
        return compute(expression);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} expression
 * @return {number[]}
 */
var diffWaysToCompute = function(expression) {
    const memo = new Map();
    
    const compute = (expr) => {
        // Check memo
        if (memo.has(expr)) {
            return memo.get(expr);
        }
        
        const results = [];
        
        // Base case: expression is just a number
        if (!expr.includes('+') && !expr.includes('-') && !expr.includes('*')) {
            results.push(parseInt(expr));
            memo.set(expr, results);
            return results;
        }
        
        // Find each operator and split at that position
        for (let i = 0; i < expr.length; i++) {
            const op = expr[i];
            if (op === '+' || op === '-' || op === '*') {
                // Recursively compute left and right parts
                const leftResults = compute(expr.slice(0, i));
                const rightResults = compute(expr.slice(i + 1));
                
                // Combine all left and right results with the operator
                for (const left of leftResults) {
                    for (const right of rightResults) {
                        if (op === '+') {
                            results.push(left + right);
                        } else if (op === '-') {
                            results.push(left - right);
                        } else {
                            results.push(left * right);
                        }
                    }
                }
            }
        }
        
        memo.set(expr, results);
        return results;
    };
    
    return compute(expression);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × 2^n) in worst case - exponential but acceptable for n≤20 |
| **Space** | O(n × result_count) - memoization cache and recursion stack |

---

## Approach 2: Expression Tree + DFS

This approach builds an expression tree first, then performs DFS to evaluate all possible groupings.

### Algorithm Steps

1. Build an expression tree where:
   - Numbers are leaf nodes
   - Operators are internal nodes with left and right children
2. Perform DFS on the tree:
   - For leaf nodes, return the number
   - For operator nodes:
     - Recursively get all possible values for left and right
     - Combine all combinations with the operator
3. Return all possible results

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def diffWaysToCompute_tree(self, expression: str) -> List[int]:
        """
        Using expression tree and DFS approach.
        """
        # Build expression tree
        def build_tree(expr: str):
            # Find operator with lowest precedence (leftmost)
            # For simplicity, find any operator not in parentheses
            depth = 0
            for i in range(len(expr) - 1, -1, -1):
                if expr[i] == ')':
                    depth += 1
                elif expr[i] == '(':
                    depth -= 1
                elif depth == 0 and expr[i] in '+-*':
                    return (expr[i], build_tree(expr[:i]), build_tree(expr[i+1:]))
            return ('num', expr)
        
        # Evaluate tree with all possible groupings
        def evaluate(tree):
            if tree[0] == 'num':
                return [int(tree[1])]
            
            op, left, right = tree[0], tree[1], tree[2]
            left_results = evaluate(left)
            right_results = evaluate(right)
            
            results = []
            for l in left_results:
                for r in right_results:
                    if op == '+':
                        results.append(l + r)
                    elif op == '-':
                        results.append(l - r)
                    else:
                        results.append(l * r)
            return results
        
        return evaluate(build_tree(expression))
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <cctype>
using namespace std;

class Solution {
public:
    struct Node {
        bool isNum;
        int num;
        char op;
        Node* left;
        Node* right;
        Node(int n) : isNum(true), num(n), op(0), left(nullptr), right(nullptr) {}
        Node(char o, Node* l, Node* r) : isNum(false), num(0), op(o), left(l), right(r) {}
    };
    
    vector<int> diffWaysToCompute(string expression) {
        Node* root = buildTree(expression);
        return evaluate(root);
    }
    
private:
    Node* buildTree(const string& expr) {
        int depth = 0;
        for (int i = expr.size() - 1; i >= 0; i--) {
            if (expr[i] == ')') depth++;
            else if (expr[i] == '(') depth--;
            else if (depth == 0 && (expr[i] == '+' || expr[i] == '-' || expr[i] == '*')) {
                return new Node(expr[i], 
                    buildTree(expr.substr(0, i)), 
                    buildTree(expr.substr(i + 1)));
            }
        }
        return new Node(stoi(expr));
    }
    
    vector<int> evaluate(Node* node) {
        if (node->isNum) return {node->num};
        
        vector<int> left = evaluate(node->left);
        vector<int> right = evaluate(node->right);
        vector<int> result;
        
        for (int l : left) {
            for (int r : right) {
                if (node->op == '+') result.push_back(l + r);
                else if (node->op == '-') result.push_back(l - r);
                else result.push_back(l * r);
            }
        }
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    private static class Node {
        boolean isNum;
        int num;
        char op;
        Node left, right;
        Node(int n) { this.isNum = true; this.num = n; }
        Node(char o, Node l, Node r) { this.isNum = false; this.op = o; this.left = l; this.right = r; }
    }
    
    public List<Integer> diffWaysToCompute(String expression) {
        Node root = buildTree(expression);
        return evaluate(root);
    }
    
    private Node buildTree(String expr) {
        int depth = 0;
        for (int i = expr.length() - 1; i >= 0; i--) {
            char c = expr.charAt(i);
            if (c == ')') depth++;
            else if (c == '(') depth--;
            else if (depth == 0 && (c == '+' || c == '-' || c == '*')) {
                return new Node(c, 
                    buildTree(expr.substring(0, i)), 
                    buildTree(expr.substring(i + 1)));
            }
        }
        return new Node(Integer.parseInt(expr));
    }
    
    private List<Integer> evaluate(Node node) {
        if (node.isNum) return List.of(node.num);
        
        List<Integer> left = evaluate(node.left);
        List<Integer> right = evaluate(node.right);
        List<Integer> result = new ArrayList<>();
        
        for (int l : left) {
            for (int r : right) {
                if (node.op == '+') result.add(l + r);
                else if (node.op == '-') result.add(l - r);
                else result.add(l * r);
            }
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} expression
 * @return {number[]}
 */
var diffWaysToCompute = function(expression) {
    // Build expression tree
    const buildTree = (expr) => {
        let depth = 0;
        for (let i = expr.length - 1; i >= 0; i--) {
            if (expr[i] === ')') depth++;
            else if (expr[i] === '(') depth--;
            else if (depth === 0 && ['+', '-', '*'].includes(expr[i])) {
                return { 
                    op: expr[i], 
                    left: buildTree(expr.slice(0, i)), 
                    right: buildTree(expr.slice(i + 1)) 
                };
            }
        }
        return { num: parseInt(expr) };
    };
    
    // Evaluate tree
    const evaluate = (node) => {
        if (node.num !== undefined) return [node.num];
        
        const left = evaluate(node.left);
        const right = evaluate(node.right);
        const results = [];
        
        for (const l of left) {
            for (const r of right) {
                if (node.op === '+') results.push(l + r);
                else if (node.op === '-') results.push(l - r);
                else results.push(l * r);
            }
        }
        return results;
    };
    
    return evaluate(buildTree(expression));
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × 2^n) - Same as memoized recursion |
| **Space** | O(n × 2^n) - Tree plus result storage |

---

## Approach 3: Dynamic Programming (Bottom-Up)

This approach processes shorter substrings first and builds up to the full expression.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def diffWaysToCompute_dp(self, expression: str) -> List[int]:
        """
        Using dynamic programming (bottom-up) approach.
        """
        n = len(expression)
        # dp[i][j] = all possible results for expression[i:j+1]
        dp = {}
        
        # Helper to check if substring is a number
        def is_number(expr):
            return expr.isdigit()
        
        # Fill dp for substrings of increasing length
        for length in range(1, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                expr = expression[i:j+1]
                
                if is_number(expr):
                    dp[(i, j)] = [int(expr)]
                else:
                    results = []
                    # Try each operator position
                    for k in range(i, j + 1):
                        if expression[k] in '+-*':
                            left = dp.get((i, k-1), [])
                            right = dp.get((k+1, j), [])
                            
                            for l in left:
                                for r in right:
                                    if expression[k] == '+':
                                        results.append(l + r)
                                    elif expression[k] == '-':
                                        results.append(l - r)
                                    else:
                                        results.append(l * r)
                    
                    if results:
                        dp[(i, j)] = results
        
        return dp.get((0, n-1), [])
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> diffWaysToCompute(string expression) {
        int n = expression.size();
        // dp[i][j] for substring [i, j]
        unordered_map<int, vector<int>> dp;
        
        // Process all possible substrings
        for (int len = 1; len <= n; len++) {
            for (int i = 0; i + len <= n; i++) {
                int j = i + len - 1;
                string expr = expression.substr(i, len);
                
                // Check if it's a number
                bool isNum = true;
                for (char c : expr) {
                    if (!isdigit(c)) {
                        isNum = false;
                        break;
                    }
                }
                
                if (isNum) {
                    dp[i * 100 + j] = {stoi(expr)};
                } else {
                    vector<int> results;
                    // Try each operator
                    for (int k = i; k <= j; k++) {
                        char op = expression[k];
                        if (op == '+' || op == '-' || op == '*') {
                            auto leftIt = dp.find(i * 100 + k - 1);
                            auto rightIt = dp.find((k + 1) * 100 + j);
                            
                            if (leftIt != dp.end() && rightIt != dp.end()) {
                                for (int l : leftIt->second) {
                                    for (int r : rightIt->second) {
                                        if (op == '+') results.push_back(l + r);
                                        else if (op == '-') results.push_back(l - r);
                                        else results.push_back(l * r);
                                    }
                                }
                            }
                        }
                    }
                    if (!results.empty()) {
                        dp[i * 100 + j] = results;
                    }
                }
            }
        }
        
        return dp[0 * 100 + (n - 1)];
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<Integer> diffWaysToCompute(String expression) {
        int n = expression.length();
        // dp[i][j] for substring [i, j]
        Map<String, List<Integer>> dp = new HashMap<>();
        
        // Process all possible substrings
        for (int len = 1; len <= n; len++) {
            for (int i = 0; i + len <= n; i++) {
                int j = i + len - 1;
                String expr = expression.substring(i, j + 1);
                
                // Check if it's a number
                if (!expr.contains("+") && !expr.contains("-") && !expr.contains("*")) {
                    dp.put(expr, List.of(Integer.parseInt(expr)));
                } else {
                    List<Integer> results = new ArrayList<>();
                    // Try each operator
                    for (int k = i; k <= j; k++) {
                        char op = expression.charAt(k);
                        if (op == '+' || op == '-' || op == '*') {
                            String leftKey = expression.substring(i, k);
                            String rightKey = expression.substring(k + 1, j + 1);
                            
                            if (dp.containsKey(leftKey) && dp.containsKey(rightKey)) {
                                for (int l : dp.get(leftKey)) {
                                    for (int r : dp.get(rightKey)) {
                                        if (op == '+') results.add(l + r);
                                        else if (op == '-') results.add(l - r);
                                        else results.add(l * r);
                                    }
                                }
                            }
                        }
                    }
                    if (!results.isEmpty()) {
                        dp.put(expr, results);
                    }
                }
            }
        }
        
        return dp.getOrDefault(expression, new ArrayList<>());
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} expression
 * @return {number[]}
 */
var diffWaysToCompute = function(expression) {
    const n = expression.length();
    const dp = new Map();
    
    // Process all possible substrings
    for (let len = 1; len <= n; len++) {
        for (let i = 0; i + len <= n; i++) {
            const j = i + len - 1;
            const expr = expression.slice(i, j + 1);
            
            // Check if it's a number
            if (!expr.includes('+') && !expr.includes('-') && !expr.includes('*')) {
                dp.set(expr, [parseInt(expr)]);
            } else {
                const results = [];
                // Try each operator
                for (let k = i; k <= j; k++) {
                    const op = expression[k];
                    if (op === '+' || op === '-' || op === '*') {
                        const leftKey = expression.slice(i, k);
                        const rightKey = expression.slice(k + 1, j + 1);
                        
                        if (dp.has(leftKey) && dp.has(rightKey)) {
                            for (const l of dp.get(leftKey)) {
                                for (const r of dp.get(rightKey)) {
                                    if (op === '+') results.push(l + r);
                                    else if (op === '-') results.push(l - r);
                                    else results.push(l * r);
                                }
                            }
                        }
                    }
                }
                if (results.length > 0) {
                    dp.set(expr, results);
                }
            }
        }
    }
    
    return dp.get(expression) || [];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n³ × result_count) - Triple loop for substrings |
| **Space** | O(n² × result_count) - DP table |

---

## Comparison of Approaches

| Aspect | Memoized Recursion | Expression Tree | DP Bottom-Up |
|--------|-------------------|-----------------|--------------|
| **Time Complexity** | O(n × 2^n) | O(n × 2^n) | O(n³ × 2^n) |
| **Space Complexity** | O(n × 2^n) | O(n × 2^n) | O(n² × 2^n) |
| **Implementation** | Simple | Moderate | Complex |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |
| **Best For** | Production | Educational | Understanding DP |

**Best Approach:** Memoized Recursion is the optimal and most elegant solution for## Why Divide and Conquer Works

 this problem.

---

The solution leverages two key observations:

1. **Operator Independence**: Each operator splits the expression into left and right subexpressions that can be evaluated independently
2. **Complete Coverage**: By recursively applying this to all operators at all positions, we cover every possible parenthesization
3. **Result Combination**: The final result is the Cartesian product of left results and right results combined with the operator

The recursion tree naturally represents all possible evaluation orders, and memoization ensures we don't recompute the same subexpressions.

---

## Related Problems

Based on similar themes (expression parsing, divide and conquer, recursion):

### Same Pattern (Expression Evaluation)

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Basic Calculator | [Link](https://leetcode.com/problems/basic-calculator/) | Evaluate expression with parentheses |
| Basic Calculator II | [Link](https://leetcode.com/problems/basic-calculator-ii/) | Expression with + - * / |
| Evaluate Reverse Polish Notation | [Link](https://leetcode.com/problems/evaluate-reverse-polish-notation/) | Stack-based evaluation |

### Similar Concepts

| Problem | LeetCode Link | Related Technique |
|---------|---------------|-------------------|
| Decode Ways | [Link](https://leetcode.com/problems/decode-ways/) | DP with multiple choices |
| Unique Binary Search Trees | [Link](https://leetcode.com/problems/unique-binary-search-trees/) | Catalan numbers |
| Word Break | [Link](https://leetcode.com/problems/word-break/) | Divide and conquer with memoization |

### Pattern Reference

For more detailed explanations of the Divide and Conquer pattern, see:
- **[Divide and Conquer - Expression Evaluation Pattern](/patterns/divide-conquer-expression-evaluation)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Divide and Conquer Approach

- [NeetCode - Different Ways to Add Parentheses](https://www.youtube.com/watch?v=9hE21f2bPRo) - Clear explanation with examples
- [Different Ways to Add Parentheses - Back to Back SWE](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Official problem solution
- [Expression Tree Evaluation](https://www.youtube.com/watch?v=ygK60X4kQBg) - Understanding expression trees

### Additional Resources

- [Recursion and Memoization](https://www.youtube.com/watch?v=0jN2cIoXK7Q) - DP fundamentals
- [Expression Parsing](https://www.youtube.com/watch?v=IjJ7wyBOgTM) - Different parsing techniques

---

## Follow-up Questions

### Q1: How would you handle division operator?

**Answer:** Add '/' to the operator list and handle integer division. Note that division by zero is not possible given the problem constraints. Use integer division that truncates towards zero (as in C++/Java) or floor division (as in Python).

---

### Q2: What is the time complexity without memoization?

**Answer:** Without memoization, the time complexity is O(2^n) where n is the number of operators. This is because the recursion creates an exponential number of subproblems, many of which are duplicates. With memoization, each unique subexpression is computed only once.

---

### Q3: How would you modify the solution to handle negative numbers in the input?

**Answer:** The current solution assumes numbers don't have signs. To handle negative numbers, you would need to handle unary operators. One approach is to preprocess the expression to convert "-2+1" to "(-2)+1" by adding parentheses around negative numbers.

---

### Q4: Can this be solved iteratively without recursion?

**Answer:** Yes, using dynamic programming (bottom-up) as shown in Approach 3. You build up solutions for shorter substrings and use them to compute longer substrings. However, the recursive solution is more elegant and intuitive.

---

### Q5: How would you handle very large numbers that don't fit in 32-bit integer?

**Answer:** Use 64-bit integers (long long) or arbitrary precision integers (BigInteger in Java, Python's int is arbitrary precision). The problem states output fits in 32-bit, so this is only needed if you want to handle edge cases or extensions.

---

### Q6: How would you output the parenthesizations along with results?

**Answer:** Modify the return type to include both the result and the parenthesized string. Instead of returning `List[int]`, return `List[Tuple[str, int]]` where the string is the fully parenthesized expression.

---

### Q7: What edge cases should be tested?

**Answer:**
- Single number: "5" → [5]
- Single operator: "1+2" → [3]
- Multiple operators: "1+2+3" 
- Only subtraction: "1-2-3"
- Only multiplication: "1*2*3"
- Mixed operators: "2*3-4*5"
- Numbers with multiple digits: "10+20-30"

---

### Q8: How does this relate to the concept of Catalan numbers?

**Answer:** The number of different ways to parenthesize an expression with n+1 operands is the nth Catalan number: C_n = (2n)!/(n!(n+1)!). For example, with 3 numbers (2 operators), there are C_2 = 2 ways. With 4 numbers (3 operators), there are C_3 = 5 ways.

---

## Common Pitfalls

### Common Mistakes to Avoid

1. **Not handling the base case**: Make sure to handle the case when there are no operators (single number)

2. **Incorrect recursion depth**: Be aware of the maximum recursion depth for deeply nested expressions

3. **Integer overflow**: In languages like C++ and Java, be careful with large intermediate results

4. **Duplicate results**: The same expression can be evaluated in different ways - ensure your algorithm handles all partitions

---

## Summary

The **Different Ways to Add Parentheses** problem demonstrates the power of the **Divide and Conquer** pattern:

- **Memoized Recursion**: Optimal O(n × 2^n) solution, elegant and widely used
- **Expression Tree**: Alternative approach, builds tree then evaluates
- **Dynamic Programming**: Bottom-up approach, more complex but instructive

The key insight is that each operator independently splits the problem into left and right subproblems, and all combinations of left and right results produce all possible parenthesizations.

For more details on this pattern and its variations, see the **[Divide and Conquer - Expression Evaluation Pattern](/patterns/divide-conquer-expression-evaluation)**.
