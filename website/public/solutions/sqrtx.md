# Sqrt(x)

## Problem Description

Given a non-negative integer `x`, compute and return the square root of `x`. Since the return type is an integer, the decimal digits are truncated, and only the integer part of the result is returned.

Note: You are not allowed to use any built-in exponent function or operator, such as `pow(x, 0.5)` in Python or `x ** 0.5`.

This is **LeetCode Problem #69** and is classified as an Easy difficulty problem. It tests your understanding of binary search and mathematical approximations.

### Detailed Problem Statement
- Input is a non-negative integer x
- Output is the floor value of sqrt(x)
- No built-in square root functions allowed
- Must handle large values of x efficiently

## Constraints
| Constraint | Description |
|------------|-------------|
| `0 <= x <= 2^31 - 1` | Very large possible values |

---

## Examples

### Example 1:
```
Input: x = 4
Output: 2
Explanation: The square root of 4 is 2, so we return 2.
```

### Example 2:
```
Input: x = 8
Output: 2
Explanation: The square root of 8 is 2.828..., and since we truncate the decimal part, 2 is returned.
```

### Example 3:
```
Input: x = 0
Output: 0
Explanation: The square root of 0 is 0.
```

### Example 4:
```
Input: x = 1
Output: 1
Explanation: The square root of 1 is 1.
```

### Example 5:
```
Input: x = 2147483647
Output: 46340
Explanation: The square root of 2^31 - 1 is approximately 46340.95..., so we return 46340.
```

---

## Pattern: Binary Search - Integer Square Root

This problem is a classic example of the **Binary Search** pattern for finding floor values. The key insight is that the square function is monotonically increasing for non-negative numbers, making binary search applicable.

### Core Concept

- **Monotonic Property**: For x ≥ 0, if a < b then a² < b²
- **Search Space**: sqrt(x) is in range [0, x] for x ≥ 1, or [0, x/2] for x ≥ 4
- **Goal**: Find the largest integer mid where mid² ≤ x

---

## Intuition

The problem can be efficiently solved using **binary search** to find the largest integer `mid` such that `mid * mid <= x`. This approach works because the square function is monotonically increasing.

Key insight: For x in [0, n], we can search in the range [0, n] to find the maximum mid where mid² ≤ x.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Binary Search (Optimal)** - O(log n) time, O(1) space ✅ Recommended
2. **Newton-Raphson Method** - O(log n) time, O(1) space
3. **Brute Force** - O(√n) time, O(1) space (Not Recommended)

---

## Approach 1: Binary Search (Optimal) ✅

This is the most efficient approach with O(log n) time complexity. By using binary search, we find the largest integer mid where mid² ≤ x.

### Algorithm Steps

1. **Handle Base Cases**: Return x directly for x = 0 or x = 1
2. **Set Search Range**: For x ≥ 4, sqrt(x) ≤ x/2, so search in [1, x//2]
3. **Binary Search**: Find the largest mid where mid² ≤ x
4. **Track Result**: Keep track of the last valid mid as potential answer
5. **Avoid Overflow**: Use `left + (right - left) // 2` instead of `(left + right) // 2`

### Why It Works

The square function is monotonically increasing for non-negative numbers. Binary search efficiently narrows down the search space by half with each iteration, guaranteeing we find the maximum integer whose square is less than or equal to x.

### Code Implementation

````carousel
```python
class Solution:
    def mySqrt(self, x: int) -> int:
        """
        Compute the integer square root of a non-negative integer.
        
        Args:
            x: Non-negative integer
            
        Returns:
            Floor of square root (largest integer where square <= x)
        """
        if x == 0 or x == 1:
            return x
        
        left = 1
        right = x // 2  # sqrt(x) <= x/2 for x >= 4
        result = 0
        
        while left <= right:
            mid = left + (right - left) // 2  # Avoid overflow
            mid_squared = mid * mid
            
            if mid_squared == x:
                return mid
            elif mid_squared < x:
                result = mid  # Potential candidate
                left = mid + 1
            else:
                right = mid - 1
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    int mySqrt(int x) {
        /**
         * Compute the integer square root of a non-negative integer.
         * 
         * Args:
         *     x: Non-negative integer
         * 
         * Returns:
         *     Floor of square root (largest integer where square <= x)
         */
        if (x == 0 || x == 1) {
            return x;
        }
        
        int left = 1;
        int right = x / 2;  // sqrt(x) <= x/2 for x >= 4
        int result = 0;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;  // Avoid overflow
            long long midSquared = 1LL * mid * mid;  // Use long long
            
            if (midSquared == x) {
                return mid;
            } else if (midSquared < x) {
                result = mid;  // Potential candidate
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int mySqrt(int x) {
        /**
         * Compute the integer square root of a non-negative integer.
         * 
         * Args:
         *     x: Non-negative integer
         * 
         * Returns:
         *     Floor of square root (largest integer where square <= x)
         */
        if (x == 0 || x == 1) {
            return x;
        }
        
        int left = 1;
        int right = x / 2;  // sqrt(x) <= x/2 for x >= 4
        int result = 0;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;  // Avoid overflow
            long midSquared = (long) mid * mid;  // Use long to avoid overflow
            
            if (midSquared == x) {
                return mid;
            } else if (midSquared < x) {
                result = mid;  // Potential candidate
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Compute the integer square root of a non-negative integer.
 * 
 * @param {number} x - Non-negative integer
 * @return {number} - Floor of square root
 */
var mySqrt = function(x) {
    if (x === 0 || x === 1) {
        return x;
    }
    
    let left = 1;
    let right = Math.floor(x / 2);  // sqrt(x) <= x/2 for x >= 4
    let result = 0;
    
    while (left <= right) {
        let mid = left + Math.floor((right - left) / 2);  // Avoid overflow
        let midSquared = mid * mid;
        
        if (midSquared === x) {
            return mid;
        } else if (midSquared < x) {
            result = mid;  // Potential candidate
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) - Each iteration halves the search space |
| **Space** | O(1) - Only a few integer variables used |

---

## Approach 2: Newton-Raphson Method

A mathematical approximation method that converges quadratically to the square root.

### Algorithm Steps

1. **Initial Guess**: Start with guess = x
2. **Iterative Formula**: Use `new_guess = (guess + x/guess) / 2`
3. **Convergence**: Stop when the guess stops improving
4. **Integer Result**: Return the integer part

### Why It Works

The Newton-Raphson method finds roots of equations. For sqrt(x), we find the root of f(y) = y² - x = 0. The iterative formula converges quadratically (error decreases exponentially).

### Code Implementation

````carousel
```python
class Solution:
    def mySqrt(self, x: int) -> int:
        """
        Compute square root using Newton-Raphson method.
        
        Args:
            x: Non-negative integer
            
        Returns:
            Floor of square root
        """
        if x == 0:
            return 0
        
        guess = x
        while True:
            new_guess = (guess + x // guess) // 2
            if new_guess >= guess:
                return guess
            guess = new_guess
```

<!-- slide -->
```cpp
class Solution {
public:
    int mySqrt(int x) {
        /**
         * Compute square root using Newton-Raphson method.
         */
        if (x == 0) {
            return 0;
        }
        
        long long guess = x;
        while (true) {
            long long new_guess = (guess + x / guess) / 2;
            if (new_guess >= guess) {
                return (int)guess;
            }
            guess = new_guess;
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    public int mySqrt(int x) {
        /**
         * Compute square root using Newton-Raphson method.
         */
        if (x == 0) {
            return 0;
        }
        
        long guess = x;
        while (true) {
            long newGuess = (guess + x / guess) / 2;
            if (newGuess >= guess) {
                return (int)guess;
            }
            guess = newGuess;
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Compute square root using Newton-Raphson method.
 * 
 * @param {number} x - Non-negative integer
 * @return {number} - Floor of square root
 */
var mySqrt = function(x) {
    if (x === 0) {
        return 0;
    }
    
    let guess = x;
    while (true) {
        let newGuess = Math.floor((guess + Math.floor(x / guess)) / 2);
        if (newGuess >= guess) {
            return guess;
        }
        guess = newGuess;
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) - Quadratic convergence |
| **Space** | O(1) - Constant extra space |

---

## Approach 3: Brute Force (Not Recommended)

A simple but inefficient approach for comparison purposes.

### Algorithm Steps

1. **Start from 1**: Initialize counter from 1
2. **Increment**: Check each i until i² > x
3. **Return Result**: i-1 is the floor of sqrt(x)

### Code Implementation

````carousel
```python
class Solution:
    def mySqrt(self, x: int) -> int:
        """
        Compute square root using brute force.
        NOT RECOMMENDED - Very slow for large x
        """
        if x == 0:
            return 0
        
        i = 1
        while i * i <= x:
            i += 1
        return i - 1
```

<!-- slide -->
```cpp
class Solution {
public:
    int mySqrt(int x) {
        // NOT RECOMMENDED - Very slow for large x
        if (x == 0) return 0;
        
        int i = 1;
        while (1LL * i * i <= x) {
            i++;
        }
        return i - 1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int mySqrt(int x) {
        // NOT RECOMMENDED - Very slow for large x
        if (x == 0) return 0;
        
        int i = 1;
        while ((long) i * i <= x) {
            i++;
        }
        return i - 1;
    }
}
```

<!-- slide -->
```javascript
/**
 * Compute square root using brute force.
 * NOT RECOMMENDED - Very slow for large x
 * 
 * @param {number} x - Non-negative integer
 * @return {number} - Floor of square root
 */
var mySqrt = function(x) {
    if (x === 0) return 0;
    
    let i = 1;
    while (i * i <= x) {
        i++;
    }
    return i - 1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(√n) - For x=2^31-1, ~46340 iterations |
| **Space** | O(1) - Constant extra space |

---

## Comparison of Approaches

| Aspect | Binary Search | Newton-Raphson | Brute Force |
|--------|---------------|---------------|-------------|
| **Time Complexity** | O(log n) | O(log n) | O(√n) |
| **Space Complexity** | O(1) | O(1) | O(1) |
| **Implementation** | Moderate | Moderate | Simple |
| **Convergence** | Linear | Quadratic | N/A |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ❌ No |
| **Best For** | General use | Fast convergence | Learning only |

**Best Approach:** Binary search is recommended for its simplicity, efficiency, and guaranteed O(log n) performance. Newton-Raphson is also excellent but may be less intuitive.

---

## Why Binary Search is Optimal for This Problem

1. **Guaranteed Performance**: O(log n) time complexity is guaranteed
2. **No Overflow Issues**: Using mid = left + (right - left) / 2 prevents overflow
3. **Simple Implementation**: Easy to understand and implement correctly
4. **Space Efficient**: O(1) space complexity
5. **Handles Edge Cases**: Naturally handles x=0, x=1, and large values
6. **Industry Standard**: Most commonly used approach in interviews

---

## Edge Cases and Common Pitfalls

### Edge Cases
1. **x = 0**: Returns 0
2. **x = 1**: Returns 1
3. **x = 2,3**: Returns 1
4. **Perfect Squares**: Returns exact root (e.g., x=16 returns 4)
5. **Maximum Value (2^31-1)**: Returns 46340

### Common Mistakes
1. **Integer Overflow**: When calculating mid*mid for large x - use long types
2. **Incorrect Search Range**: Not considering x/2 as upper bound for x ≥ 4
3. **Off-by-one Errors**: Forgetting to return result after loop ends
4. **Not Handling Base Cases**: Forgetting x=0 and x=1 return themselves
5. **Mid Calculation**: Using (left + right) / 2 can overflow for large numbers

---

## Why This Problem is Important

### Interview Relevance
- **Frequency**: Frequently asked in coding interviews
- **Companies**: Google, Amazon, Microsoft, Apple, Facebook
- **Difficulty**: Easy, but tests problem-solving fundamentals
- **Variations**: Leads to problems like "Sqrt(x) with Precision"

### Learning Outcomes
1. **Binary Search Mastery**: Apply binary search to non-standard problems
2. **Mathematical Thinking**: Understand square root properties
3. **Edge Case Handling**: Account for very large values and base cases
4. **Algorithm Selection**: Choose between different approaches based on efficiency

---

## Related Problems

### Same Pattern (Binary Search)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Search Insert Position | [Link](https://leetcode.com/problems/search-insert-position/) | Easy | Find insertion point in sorted array |
| First Bad Version | [Link](https://leetcode.com/problems/first-bad-version/) | Easy | Binary search in API-based scenario |
| Find Minimum in Rotated Sorted Array | [Link](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | Medium | Modified binary search |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Valid Perfect Square | [Link](https://leetcode.com/problems/valid-perfect-square/) | Easy | Check if number is perfect square |
| Pow(x, n) | [Link](https://leetcode.com/problems/powx-n/) | Medium | Implement exponentiation |
| Cube Root | [Link](https://leetcode.com/problems/find-sqrtx-lcci/) | Medium | Implement cube root |

### Pattern Reference

For more detailed explanations of the Binary Search pattern and its variations, see:
- **[Binary Search Pattern](/patterns/binary-search)** - Comprehensive pattern guide

---

## Video Tutorial Links

### Binary Search Solutions

1. **[Sqrt(x) - Binary Search Solution - NeetCode](https://www.youtube.com/watch?v=j2HSd3HCpDs)**
   - Clear binary search explanation
   - Step-by-step walkthrough
   - Edge case coverage

2. **[LeetCode 69 - Sqrt(x) - William Lin](https://www.youtube.com/watch?v=VYtEKhxKd1Q)**
   - Multiple approaches discussed
   - Time and space complexity analysis
   - Code implementation in Python

3. **[Binary Search Explained](https://www.youtube.com/watch?v=JQhciTuD3E8)**
   - General binary search concepts
   - Visual explanations
   - Beginner-friendly

### Additional Resources

- **[Binary Search Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/)** - Comprehensive guide
- **[Newton-Raphson Method - Wikipedia](https://en.wikipedia.org/wiki/Newton%27s_method)** - Mathematical background
- **[LeetCode Discuss](https://leetcode.com/problems/sqrtx/discuss/)** - Community solutions and tips

---

## Follow-up Questions

### Q1: What's the time complexity of binary search approach?

**Answer:** O(log n) - Each iteration halves the search space, so we need at most log₂(x) iterations.

---

### Q2: Why do we use mid = left + (right - left) // 2 instead of (left + right) // 2?

**Answer:** To avoid integer overflow. In languages like Java and C++, adding two large integers can exceed the maximum value. The formula `left + (right - left) // 2` is mathematically equivalent but safer.

---

### Q3: What's the square root of 0?

**Answer:** 0. This is handled as a base case at the beginning of the solution.

---

### Q4: How would you modify the solution to return square root with decimal precision?

**Answer:** After finding the integer part, perform another binary search for decimal places. For example, to get 2 decimal places, search for the value that when squared gives x * 100.

---

### Q5: How does Newton-Raphson method work for this problem?

**Answer:** It uses iterative approximation. Starting with guess = x, each iteration uses the formula: new_guess = (guess + x/guess) / 2. This converges quadratically to the square root.

---

### Q6: What's the maximum x the solution can handle?

**Answer:** Up to 2^31 - 1 (2147483647). In Python, big integers are handled automatically. In Java/C++, use long types to avoid overflow when calculating mid*mid.

---

### Q7: How would you handle negative numbers?

**Answer:** The problem states x is non-negative, so we don't need to handle negatives. For negative inputs, we'd need to return NaN or throw an error.

---

### Q8: What if you need to compute cube roots instead of square roots?

**Answer:** Modify the condition to check mid³ <= x instead of mid² <= x. The search range would be [0, x] for positive x.

---

### Q9: How does this relate to finding perfect squares?

**Answer:** If mid² == x during the search, then x is a perfect square. You can add a check to return mid immediately when found.

---

### Q10: How would you test this solution?

**Answer:** Test with edge cases: 0, 1, 2, 3, 4, 8, 16, 100, 2147483647. Also test perfect squares and non-perfect squares to verify correct truncation behavior.

---

### Q11: What if x is given as a very large integer (1000+ digits)?

**Answer:** For extremely large numbers, use string-based arithmetic or arbitrary precision libraries. The binary search still works but requires custom big integer operations.

---

### Q12: How would you optimize for very large inputs?

**Answer:** Binary search is already optimal for this problem with O(log n) time. For practical purposes, the maximum 32-bit integer only needs about 31 iterations.

---

## Common Pitfalls

### 1. Integer Overflow
**Issue**: When calculating mid*mid for large x, the result can overflow 32-bit integer.

**Solution**: Use long/long long types in Java/C++ or use the formula `mid <= x / mid` instead of `mid * mid <= x`.

### 2. Wrong Search Range
**Issue**: Using [0, x] as search range is correct but inefficient for large x.

**Solution**: For x ≥ 4, sqrt(x) ≤ x/2, so use [1, x//2] as the search range.

### 3. Off-by-one Errors
**Issue**: Returning wrong value when loop ends.

**Solution**: Keep track of result during the search and return it after the loop completes.

### 4. Base Cases Not Handled
**Issue**: Forgetting to handle x = 0 and x = 1.

**Solution**: Add base case checks at the beginning of the function.

### 5. Mid Calculation Overflow
**Issue**: Using (left + right) / 2 can overflow.

**Solution**: Use left + (right - left) / 2.

---

## Summary

The **Sqrt(x)** problem is a classic binary search problem that requires:

1. **Binary Search Application**: Use binary search to find square roots efficiently
2. **Mathematical Insight**: Recognize that square roots are monotonically increasing
3. **Edge Case Handling**: Account for x=0, x=1, and very large values
4. **Overflow Protection**: Prevent integer overflow in calculations

The binary search approach is the most efficient solution with O(log n) time complexity, making it suitable for very large values of x up to 2^31 - 1. The Newton-Raphson method is also efficient and converges very quickly, though it may be less intuitive for beginners.

### Pattern Summary

This problem exemplifies the **Binary Search** pattern for finding floor values, which is characterized by:
- Monotonically increasing search space
- Halving the search space in each iteration
- O(log n) time complexity
- O(1) space complexity

For more details on this pattern and its variations, see the **[Binary Search Pattern](/patterns/binary-search)**.

---

## Additional Resources

- [LeetCode Problem 69](https://leetcode.com/problems/sqrtx/) - Official problem page
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Detailed explanation
- [Newton's Method - Wikipedia](https://en.wikipedia.org/wiki/Newton%27s_method) - Mathematical background
- [Pattern: Binary Search](/patterns/binary-search) - Comprehensive pattern guide
