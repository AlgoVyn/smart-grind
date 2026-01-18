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

### Key Constraints
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

## Intuition
The problem can be efficiently solved using **binary search** to find the largest integer `mid` such that `mid * mid <= x`. This approach works because the square function is monotonically increasing.

Key insight: For x in [0, n], we can search in the range [0, n] to find the maximum mid where mid² ≤ x.

---

## Solution Approaches

### Approach 1: Binary Search (Optimal) ✅ Recommended
This is the most efficient approach with O(log n) time complexity.

```python
class Solution:
    def mySqrt(self, x: int) -> int:
        if x == 0 or x == 1:
            return x
        
        left = 1
        right = x // 2  # sqrt(x) <= x/2 for x >=4
        
        while left <= right:
            mid = left + (right - left) // 2  # Avoid overflow
            mid_squared = mid * mid
            
            if mid_squared == x:
                return mid
            elif mid_squared < x:
                left = mid + 1
                result = mid  # Potential candidate
            else:
                right = mid - 1
        
        return result
```

#### How It Works
1. **Base Cases**: Handle x=0 and x=1 directly
2. **Search Range**: For x ≥4, sqrt(x) ≤ x/2
3. **Binary Search**: Find the largest mid where mid² ≤ x
4. **Overflow Protection**: Use `left + (right - left) // 2` instead of `(left + right) // 2`
5. **Result Tracking**: Keep track of the last valid mid

---

### Approach 2: Newton-Raphson Method
A mathematical approximation method that converges quadratically.

```python
class Solution:
    def mySqrt(self, x: int) -> int:
        if x == 0:
            return 0
        
        guess = x
        while True:
            new_guess = (guess + x // guess) // 2
            if new_guess >= guess:
                return guess
            guess = new_guess
```

#### How It Works
1. **Initial Guess**: Start with guess = x
2. **Iterative Improvement**: Use formula `new_guess = (guess + x/guess)/2`
3. **Convergence Check**: Stop when improvement is negligible
4. **Integer Division**: Use integer division for efficiency

---

### Approach 3: Brute Force (Not Recommended)
A simple but inefficient approach for comparison.

```python
class Solution:
    def mySqrt(self, x: int) -> int:
        if x == 0:
            return 0
        
        i = 1
        while i * i <= x:
            i += 1
        return i - 1
```

#### How It Works
1. **Incremental Check**: Start from 1 and check each i
2. **Stop Condition**: When i² exceeds x
3. **Return Result**: i-1 is the floor of sqrt(x)

---

## Complexity Analysis

### Comparison of Approaches
| Approach | Time Complexity | Space Complexity | Status |
|----------|-----------------|------------------|--------|
| **Binary Search** | O(log n) | O(1) | ✅ **Optimal** |
| **Newton-Raphson** | O(log n) | O(1) | ✅ Efficient |
| **Brute Force** | O(sqrt(n)) | O(1) | ❌ Inefficient |

### Binary Search Complexity
- **Time**: O(log n) - Each iteration halves the search space
- **Space**: O(1) - Constant extra space

### Newton-Raphson Complexity
- **Time**: O(log n) - Quadratic convergence
- **Space**: O(1) - Constant extra space

### Brute Force Complexity
- **Time**: O(sqrt(n)) - For x=2^31-1, this would take ~46340 steps
- **Space**: O(1) - Constant extra space

---

## Edge Cases and Common Pitfalls

### Edge Cases
1. **x = 0**: Returns 0
2. **x = 1**: Returns 1
3. **x = 2,3**: Returns 1
4. **Perfect Squares**: Returns exact root (e.g., x=16 returns 4)
5. **Maximum Value (2^31-1)**: Returns 46340

### Common Mistakes
1. **Integer Overflow**: When calculating mid*mid for large x
2. **Incorrect Search Range**: Not considering x/2 as upper bound for x ≥4
3. **Off-by-one Errors**: Forgetting to return mid-1 or similar
4. **Not Handling Base Cases**: Forgetting x=0 and x=1

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
| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Search Insert Position](/solutions/search-insert-position.md) | 35 | Easy | Find insertion point in sorted array |
| [First Bad Version](/solutions/first-bad-version.md) | 278 | Easy | Binary search in API-based scenario |
| [Find Minimum in Rotated Sorted Array](/solutions/find-minimum-in-rotated-sorted-array.md) | 153 | Medium | Modified binary search |

### Similar Concepts
| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Sqrt(x) with Precision](/solutions/sqrtx-precision.md) | - | Medium | Return square root with decimal precision |
| [Pow(x, n)](/solutions/powx-n.md) | 50 | Medium | Implement exponentiation |
| [Valid Perfect Square](/solutions/valid-perfect-square.md) | 367 | Easy | Check if number is perfect square |

---

## Video Tutorial Links

### Recommended Tutorials
1. **[Sqrt(x) - Binary Search Solution - NeetCode](https://www.youtube.com/watch?v=j2HSd3HCpDs)**
   - Clear binary search explanation
   - Step-by-step walkthrough
   - Edge case coverage

2. **[LeetCode 69 - Sqrt(x) - William Lin](https://www.youtube.com/watch?v=VYtEKhxKd1Q)**
   - Multiple approaches discussed
   - Time and space complexity analysis
   - Code implementation in Python

3. **[Binary Search Explained - Khan Academy](https://www.youtube.com/watch?v=JQhciTuD3E8)**
   - General binary search concepts
   - Visual explanations
   - Beginner-friendly

### Additional Resources
- **[Binary Search Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/)** - Comprehensive guide
- **[Newton-Raphson Method - Wikipedia](https://en.wikipedia.org/wiki/Newton%27s_method)** - Mathematical background
- **[LeetCode Discuss](https://leetcode.com/problems/sqrtx/discuss/)** - Community solutions and tips

---

## Follow-up Questions

### Basic Level
1. **What's the time complexity of binary search approach?**
   - O(log n)

2. **Why do we use mid = left + (right - left) // 2 instead of (left + right) // 2?**
   - To avoid integer overflow

3. **What's the square root of 0?**
   - 0

### Intermediate Level
4. **How would you modify the solution to return square root with decimal precision?**
   - After finding integer part, perform binary search for decimal places

5. **How does Newton-Raphson method work for this problem?**
   - Uses iterative approximation to find square root

6. **What's the maximum x the solution can handle?**
   - Up to 2^31 - 1 (Python handles big integers, but in other languages might need long)

### Advanced Level
7. **How would you handle negative numbers?**
   - The problem states x is non-negative, so we don't need to handle it

8. **What if you need to compute cube roots instead of square roots?**
   - Modify the condition to mid^3 <= x

9. **How does this relate to finding perfect squares?**
   - If mid^2 == x, then x is a perfect square

### Practical Implementation Questions
10. **How would you test this solution?**
    - Test all edge cases, perfect squares, and large numbers

11. **What if x is given as a very large integer (1000+ digits)?**
    - Use string-based or arbitrary precision arithmetic

12. **How would you optimize for very large inputs?**
    - Binary search is already optimal for this problem

---

## Summary
The **Sqrt(x)** problem is a classic binary search problem that requires:

1. **Binary Search Application**: Use binary search to find square roots efficiently
2. **Mathematical Insight**: Recognize that square roots are monotonically increasing
3. **Edge Case Handling**: Account for x=0, x=1, and very large values
4. **Overflow Protection**: Prevent integer overflow in calculations

The binary search approach is the most efficient solution with O(log n) time complexity, making it suitable for very large values of x up to 2^31 - 1. The Newton-Raphson method is also efficient and converges very quickly, though it may be less intuitive for beginners.
