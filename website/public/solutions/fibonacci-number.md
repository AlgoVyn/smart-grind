# Fibonacci Number

## Problem Description

The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is,

F(0) = 0, F(1) = 1
F(n) = F(n - 1) + F(n - 2), for n > 1.

Given n, calculate F(n).

---

## Constraints

- 0 <= n <= 30

---

## Pattern:

This problem follows the **Dynamic Programming - Linear/1D** pattern, also applicable through **Recursion** with memoization.

### Core Concept

- **Sequential Dependency**: Each state depends on previous states (F(n) depends on F(n-1) and F(n-2))
- **Bottom-up Building**: Build solution from base cases up to target
- **Space Optimization**: Only need to track previous two values, not entire array

### When to Use This Pattern

This pattern is applicable when:
1. Problems with sequential dependencies where next state builds on previous states
2. Problems that can be solved iteratively with O(1) space
3. Problems where recursion with memoization provides clean solution

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Recursion | Function calls itself with base cases |
| Memoization | Cache results to avoid recomputation |
| Matrix Exponentiation | For O(log n) Fibonacci solutions |

## Examples

### Example

**Input:**
```
n = 2
```

**Output:**
```
1
```

**Explanation:**
F(2) = F(1) + F(0) = 1 + 0 = 1.

---

### Example 2

**Input:**
```
n = 3
```

**Output:**
```
2
```

**Explanation:**
F(3) = F(2) + F(1) = 1 + 1 = 2.

---

### Example 3

**Input:**
```
n = 4
```

**Output:**
```
3
```

**Explanation:**
F(4) = F(3) + F(2) = 2 + 1 = 3.

---

## Intuition

The Fibonacci sequence has a simple recursive definition where each number is the sum of the two preceding ones. This can be computed:
- Recursively (simple but inefficient)
- Iteratively (efficient)
- Using matrix exponentiation (most efficient for large n)

For n <= 30 (as per constraints), the iterative approach is optimal.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Iterative Approach** - Optimal O(n) time, O(1) space
2. **Recursive with Memoization** - O(n) time, O(n) space
3. **Matrix Exponentiation** - O(log n) time, O(1) space

---

## Approach 1: Iterative Approach (Optimal)

This is the most efficient and straightforward approach for computing Fibonacci numbers.

### Why It Works

We only need to keep track of the two previous Fibonacci numbers at any time. We iterate from 2 to n, updating the two variables in each step.

### Code Implementation

````carousel
```python
class Solution:
    def fib(self, n: int) -> int:
        """
        Calculate the nth Fibonacci number iteratively.
        
        Args:
            n: The position in Fibonacci sequence
            
        Returns:
            The nth Fibonacci number
        """
        if n == 0:
            return 0
        if n == 1:
            return 1
        
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        return b
```

<!-- slide -->
```cpp
class Solution {
public:
    int fib(int n) {
        if (n == 0) return 0;
        if (n == 1) return 1;
        
        int a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            int temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int fib(int n) {
        if (n == 0) return 0;
        if (n == 1) return 1;
        
        int a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            int temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @return {number}
 */
var fib = function(n) {
    if (n === 0) return 0;
    if (n === 1) return 1;
    
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - We iterate n times |
| **Space** | O(1) - Only two variables used |

---

## Approach 2: Recursive with Memoization

This approach uses dynamic programming with memoization to avoid redundant calculations.

### Why It Works

The naive recursive approach has exponential time complexity because it recalculates the same Fibonacci numbers multiple times. Memoization stores previously computed values to avoid this.

### Code Implementation

````carousel
```python
from typing import Dict

class Solution:
    def fib_memo(self, n: int) -> int:
        """
        Calculate Fibonacci using memoization.
        
        Args:
            n: The position in Fibonacci sequence
            
        Returns:
            The nth Fibonacci number
        """
        memo: Dict[int, int] = {0: 0, 1: 1}
        
        def calculate(k: int) -> int:
            if k in memo:
                return memo[k]
            memo[k] = calculate(k - 1) + calculate(k - 2)
            return memo[k]
        
        return calculate(n)
```

<!-- slide -->
```cpp
class Solution {
private:
    unordered_map<int, int> memo;
public:
    int fib(int n) {
        if (n == 0) return 0;
        if (n == 1) return 1;
        if (memo.find(n) != memo.end()) return memo[n];
        
        memo[n] = fib(n - 1) + fib(n - 2);
        return memo[n];
    }
};
```

<!-- slide -->
```java
class Solution {
    private Map<Integer, Integer> memo = new HashMap<>();
    
    public int fib(int n) {
        if (n == 0) return 0;
        if (n == 1) return 1;
        if (memo.containsKey(n)) return memo.get(n);
        
        memo.put(n, fib(n - 1) + fib(n - 2));
        return memo.get(n);
    }
}
```

<!-- slide -->
```javascript
var fib = function(n) {
    const memo = new Map();
    memo.set(0, 0);
    memo.set(1, 1);
    
    function calculate(k) {
        if (memo.has(k)) return memo.get(k);
        const result = calculate(k - 1) + calculate(k - 2);
        memo.set(k, result);
        return result;
    }
    
    return calculate(n);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each Fibonacci number computed once |
| **Space** | O(n) - Memoization cache stores n values |

---

## Approach 3: Matrix Exponentiation

This is the most efficient approach for very large values of n.

### Why It Works

The Fibonacci sequence can be represented as a matrix multiplication:
```
| F(n+1) |   | 1 1 |^n   | F(1) |
| F(n)   | = | 1 0 |   | F(0) |
```

Using exponentiation by squaring, we can compute this in O(log n) time.

### Code Implementation

````carousel
```python
class Solution:
    def fib_matrix(self, n: int) -> int:
        """
        Calculate Fibonacci using matrix exponentiation.
        
        Args:
            n: The position in Fibonacci sequence
            
        Returns:
            The nth Fibonacci number
        """
        if n <= 1:
            return n
        
        def matrix_mult(A, B):
            return [
                [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
                [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]
            ]
        
        def matrix_pow(M, p):
            result = [[1, 0], [0, 1]]
            base = M
            while p > 0:
                if p % 2 == 1:
                    result = matrix_mult(result, base)
                base = matrix_mult(base, base)
                p //= 2
            return result
        
        base_matrix = [[1, 1], [1, 0]]
        powered = matrix_pow(base_matrix, n)
        return powered[0][1]
```

<!-- slide -->
```cpp
class Solution {
public:
    int fib(int n) {
        if (n <= 1) return n;
        
        vector<vector<long long>> base = {{1, 1}, {1, 0}};
        vector<vector<long long>> result = {{1, 0}, {0, 1}};
        
        while (n > 0) {
            if (n % 2 == 1) {
                result = multiply(result, base);
            }
            base = multiply(base, base);
            n /= 2;
        }
        return result[0][1];
    }
    
private:
    vector<vector<long long>> multiply(vector<vector<long long>> A, vector<vector<long long>> B) {
        return {
            {A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]},
            {A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]}
        };
    }
};
```

<!-- slide -->
```java
class Solution {
    public int fib(int n) {
        if (n <= 1) return n;
        
        long[][] base = {{1, 1}, {1, 0}};
        long[][] result = {{1, 0}, {0, 1}};
        
        while (n > 0) {
            if (n % 2 == 1) {
                result = multiply(result, base);
            }
            base = multiply(base, base);
            n /= 2;
        }
        return (int)result[0][1];
    }
    
    private long[][] multiply(long[][] A, long[][] B) {
        return new long[][] {
            {A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]},
            {A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]}
        };
    }
}
```

<!-- slide -->
```javascript
var fib = function(n) {
    if (n <= 1) return n;
    
    const multiply = (A, B) => [
        [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
        [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]
    ];
    
    const matrixPow = (M, p) => {
        let result = [[1, 0], [0, 1]];
        let base = M;
        while (p > 0) {
            if (p % 2 === 1) {
                result = multiply(result, base);
            }
            base = multiply(base, base);
            p = Math.floor(p / 2);
        }
        return result;
    };
    
    const base = [[1, 1], [1, 0]];
    const powered = matrixPow(base, n);
    return powered[0][1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) - Matrix exponentiation by squaring |
| **Space** | O(log n) - Recursion depth for exponentiation |

---

## Comparison of Approaches

| Aspect | Iterative | Memoization | Matrix Exponentiation |
|--------|-----------|-------------|----------------------|
| **Time Complexity** | O(n) | O(n) | O(log n) |
| **Space Complexity** | O(1) | O(n) | O(log n) |
| **Implementation** | Simple | Moderate | Complex |
| **Best For** | n <= 30 | n <= 1000 | Large n |

**Best Approach:** The iterative approach (Approach 1) is optimal for the given constraints (n <= 30) and is the most commonly used solution.

---

## Related Problems

Based on similar themes (dynamic programming, recursion):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Climbing Stairs | [Link](https://leetcode.com/problems/climbing-stairs/) | Similar to Fibonacci |
| N-th Tribonacci Number | [Link](https://leetcode.com/problems/n-th-tribonacci-number/) | Extended Fibonacci |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Fibonacci Number | [Link](https://leetcode.com/problems/fibonacci-number/) | This problem |
| House Robber | [Link](https://leetcode.com/problems/house-robber/) | DP similar to Fibonacci |

---

## Video Tutorial Links

### Iterative Approach

- [NeetCode - Fibonacci Number](https://www.youtube.com/watch?v=oL GeraldR8vM) - Clear explanation
- [Fibonacci - Iterative Solution](https://www.youtube.com/watch?v=0L GeraldR8vM) - Step-by-step

### Recursive and Memoization

- [Fibonacci with Memoization](https://www.youtube.com/watch?v=oZ9g7aKq6zU) - Understanding DP
- [Understanding Recursion](https://www.youtube.com/watch?v=XYqMwjqXo3s) - Recursion basics

### Matrix Exponentiation

- [Matrix Exponentiation](https://www.youtube.com/watch?v=4F5n34M7ePQ) - Advanced approach
- [Fast Fibonacci](https://www.youtube.com/watch?v=Lu-5rXrW4Kk) - O(log n) solution

---

## Follow-up Questions

### Q1: What is the time and space complexity of the naive recursive approach?

**Answer:** The naive recursive approach has O(2^n) time complexity because it makes two recursive calls for each node in the recursion tree, and O(n) space complexity due to the recursion stack. This is extremely inefficient for large n.

---

### Q2: How would you handle very large n (like n = 10^9)?

**Answer:** Use matrix exponentiation which achieves O(log n) time complexity. This is the fastest possible algorithm for computing Fibonacci numbers.

---

### Q3: What is the relationship between Fibonacci and the golden ratio?

**Answer:** The nth Fibonacci number can be approximated as F(n) ≈ φ^n / √5, where φ (phi) = (1 + √5) / 2 ≈ 1.618 is the golden ratio. This is known as Binet's formula.

---

### Q4: How would you compute the last digit of the nth Fibonacci number efficiently?

**Answer:** Use modular arithmetic with any of the above approaches. For the iterative approach, just take modulo 10 at each step: `a, b = b, (a + b) % 10`.

---

### Q5: What edge cases should be tested?

**Answer:**
- n = 0 (should return 0)
- n = 1 (should return 1)
- Large n (e.g., n = 30)
- Maximum constraint (n = 30)

---

## Common Pitfalls

### 1. Naive Recursion - Exponential Time
**Issue:** Using naive recursive approach leads to O(2^n) time complexity due to overlapping subproblems.

**Solution:** Use iterative approach or add memoization to achieve O(n) time.

### 2. Wrong Base Cases
**Issue:** Not handling base cases correctly (n=0 and n=1) leads to incorrect results.

**Solution:** Always check for n == 0 and n == 1 before iterating.

### 3. Integer Overflow for Large n
**Issue:** Fibonacci numbers grow exponentially and can exceed 32-bit integer limits.

**Solution:** Use long数据类型 or modulo arithmetic if only last digit is needed.

### 4. Unnecessary Space
**Issue:** Using array to store all Fibonacci values when only previous two are needed.

**Solution:** Use two variables to track previous two values, achieving O(1) space.

### 5. Matrix Exponentiation Complexity
**Issue:** Overcomplicating with matrix exponentiation when n is small (n <= 30).

**Solution:** Iterative approach is simpler and sufficient for small n.

---

## Summary

The **Fibonacci Number** problem is a classic dynamic programming problem that demonstrates:

- **Iterative approach**: Optimal for small n with O(n) time and O(1) space
- **Memoization**: Eliminates redundant calculations
- **Matrix exponentiation**: Most efficient for large n with O(log n) time

For the given constraint (n <= 30), the iterative approach is the best choice due to its simplicity and efficiency.

This problem is fundamental to understanding dynamic programming and is frequently asked in technical interviews.

---

## Additional Resources

- [LeetCode Problem](https://leetcode.com/problems/fibonacci-number/)
- [Fibonacci Sequence - Wikipedia](https://en.wikipedia.org/wiki/Fibonacci_number)
- [Golden Ratio](https://en.wikipedia.org/wiki/Golden_ratio)
