# Guess Number Higher Or Lower

## Problem Description

We are playing the Guess Game. The game is as follows:
I pick a number from 1 to n. You have to guess which number I picked (the number I picked stays the same throughout the game).
Every time you guess wrong, I will tell you whether the number I picked is higher or lower than your guess.
You call a pre-defined API int guess(int num), which returns three possible results:

-1: Your guess is higher than the number I picked (i.e. num > pick).
1: Your guess is lower than the number I picked (i.e. num < pick).
0: your guess is equal to the number I picked (i.e. num == pick).

Return the number that I picked.

**LeetCode Link:** [Guess Number Higher or Lower - LeetCode 374](https://leetcode.com/problems/guess-number-higher-or-lower/)

---

## Examples

### Example 1:

**Input:**
```python
n = 10, pick = 6
```

**Output:**
```python
6
```

### Example 2:

**Input:**
```python
n = 1, pick = 1
```

**Output:**
```python
1
```

### Example 3:

**Input:**
```python
n = 2, pick = 1
```

**Output:**
```python
1
```

---

## Constraints

- 1 <= n <= 2^31 - 1
- 1 <= pick <= n

---

## Pattern: Binary Search - API-Based

This problem demonstrates the **Binary Search** pattern with an API-based guess function. The key is using feedback from the guess API to narrow down the search space.

### Core Concept

- **API Feedback**: -1 (higher), 1 (lower), 0 (correct)
- **Search Space**: Range from 1 to n
- **Binary Search**: O(log n) guesses required
- **Halving**: Each guess eliminates half the remaining numbers

### When to Use This Pattern

This pattern is applicable when:
1. Finding element in sorted range with feedback
2. Search problems with comparison results
3. Problems requiring logarithmic time complexity

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Binary Search | Core search technique |
| Ternary Search | For unimodal functions |
| Exponential Search | For unbounded ranges |

### Pattern Summary

This problem exemplifies **Binary Search with API**, characterized by:
- Halving search space with each iteration
- Using feedback to determine direction
- O(log n) time complexity

---

## Intuition

The key insight is using binary search to efficiently find the hidden number. Each guess provides feedback that tells us which half contains the target.

### Key Observations

1. **API Feedback**: -1 means guess is too high, 1 means too low
2. **Search Space**: Range from 1 to n
3. **Halving**: Each guess eliminates approximately half the remaining numbers
4. **Optimal Strategy**: Binary search is optimal for this problem

### Why Binary Search Works

Binary search guarantees O(log n) time because each guess eliminates half the remaining search space. The guess API provides exact feedback about which direction to search.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Binary Search** - Standard approach
2. **Linear Search** - Simple but slower (for understanding)

---

## Approach 1: Binary Search (Optimal)

### Algorithm Steps

1. Initialize left = 1, right = n
2. While left <= right:
   - Calculate mid = left + (right - left) // 2 (avoid overflow)
   - Get guess result using API
   - If result == 0: return mid (found!)
   - If result == -1: target is lower, search left (right = mid - 1)
   - If result == 1: target is higher, search right (left = mid + 1)

### Why It Works

Binary search systematically narrows the search space by half with each iteration. The feedback from the guess API directly tells us which half contains the target.

### Code Implementation

````carousel
```python
class Solution:
    def guessNumber(self, n: int) -> int:
        """
        Find the picked number using binary search.
        
        Args:
            n: Upper bound of the search range
            
        Returns:
            The picked number
        """
        left, right = 1, n
        
        while left <= right:
            # Avoid overflow using left + (right - left) // 2
            mid = left + (right - left) // 2
            result = guess(mid)
            
            if result == 0:
                # Found the number
                return mid
            elif result == -1:
                # Guess is too high, search left
                right = mid - 1
            else:
                # Guess is too low, search right
                left = mid + 1
        
        return -1  # Should never reach here
```

<!-- slide -->
```cpp
/** 
 * Forward declaration of guess API.
 * @param  num   your guess
 * @return 	     -1 if num is higher than the picked number
 *			      1 if num is lower than the picked number
 *               otherwise return 0
 */
int guess(int num);

class Solution {
public:
    int guessNumber(int n) {
        int left = 1, right = n;
        
        while (left <= right) {
            // Avoid overflow
            int mid = left + (right - left) / 2;
            int result = guess(mid);
            
            if (result == 0) {
                return mid;
            } else if (result == -1) {
                // Guess is too high
                right = mid - 1;
            } else {
                // Guess is too low
                left = mid + 1;
            }
        }
        
        return -1;
    }
};
```

<!-- slide -->
```java
/* The guess API is defined in the parent class GuessGame.
   int guess(int num); */

public class Solution extends GuessGame {
    public int guessNumber(int n) {
        int left = 1, right = n;
        
        while (left <= right) {
            // Avoid overflow
            int mid = left + (right - left) / 2;
            int result = guess(mid);
            
            if (result == 0) {
                return mid;
            } else if (result == -1) {
                // Guess is too high
                right = mid - 1;
            } else {
                // Guess is too low
                left = mid + 1;
            }
        }
        
        return -1;
    }
}
```

<!-- slide -->
```javascript
/** 
 * Forward declaration of guess API.
 * @param  num   your guess
 * @return 	     -1 if num is higher than the picked number
 *			      1 if num is lower than the picked number
 *               otherwise return 0
 */
var guess = function(num) {}

var guessNumber = function(n) {
    let left = 1, right = n;
    
    while (left <= right) {
        // Avoid overflow
        const mid = left + Math.floor((right - left) / 2);
        const result = guess(mid);
        
        if (result === 0) {
            return mid;
        } else if (result === -1) {
            // Guess is too high
            right = mid - 1;
        } else {
            // Guess is too low
            left = mid + 1;
        }
    }
    
    return -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) - binary search |
| **Space** | O(1) - constant space |

---

## Approach 2: Linear Search (For Understanding)

### Algorithm Steps

1. Simply iterate from 1 to n
2. Return the first number that matches

### Why It Works

This is a brute-force approach that works but is inefficient. It's included for understanding but should never be used in practice.

### Code Implementation

````carousel
```python
class Solution:
    def guessNumber(self, n: int) -> int:
        """Linear search - for understanding only."""
        for i in range(1, n + 1):
            if guess(i) == 0:
                return i
        return -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int guessNumber(int n) {
        for (int i = 1; i <= n; i++) {
            if (guess(i) == 0) return i;
        }
        return -1;
    }
};
```

<!-- slide -->
```java
public class Solution extends GuessGame {
    public int guessNumber(int n) {
        for (int i = 1; i <= n; i++) {
            if (guess(i) == 0) return i;
        }
        return -1;
    }
}
```

<!-- slide -->
```javascript
var guessNumber = function(n) {
    for (let i = 1; i <= n; i++) {
        if (guess(i) === 0) return i;
    }
    return -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - linear search |
| **Space** | O(1) - constant space |

---

## Comparison of Approaches

| Aspect | Binary Search | Linear Search |
|--------|--------------|---------------|
| **Time Complexity** | O(log n) | O(n) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ | ❌ |
| **Recommended** | ✅ | ❌ (understanding only) |

**Best Approach:** Use Binary Search for optimal O(log n) performance.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Google, Microsoft
- **Difficulty**: Easy
- **Concepts Tested**: Binary Search, API Usage, Basic Algorithms

### Learning Outcomes

1. **Binary Search Mastery**: Understand the fundamentals of binary search
2. **API Integration**: Learn to work with provided APIs
3. **Edge Cases**: Handle boundary conditions properly

---

## Related Problems

Based on similar themes (Binary Search):

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Search in Rotated Array | [Link](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Binary search variant |
| Find First and Last Position | [Link](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) | Range search |
| Binary Search | [Link](https://leetcode.com/problems/binary-search/) | Basic binary search |

### Pattern Reference

For more detailed explanations, see:
- **[Binary Search Pattern](/patterns/binary-search)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Guess Number](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Clear explanation
2. **[Binary Search Tutorial](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Binary search fundamentals
3. **[LeetCode 374](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Problem walkthrough

---

## Follow-up Questions

### Q1: How would you modify for minimum guesses?

**Answer:** This is exactly what binary search achieves - minimum O(log n) guesses.

---

### Q2: What if the API was noisy/unreliable?

**Answer:** You would need multiple guesses or error-correcting strategies.

---

### Q3: Can you achieve better than O(log n)?

**Answer:** No, binary search is optimal for comparison-based guessing.

---

## Common Pitfalls

### 1. Confusing API Return Values
**Issue:** Misunderstanding -1 and 1 return values.

**Solution:** Remember: -1 means guess is HIGHER (pick is lower), 1 means guess is LOWER (pick is higher).

### 2. Integer Overflow in Mid Calculation
**Issue:** Using `(left + right) // 2` can overflow.

**Solution:** Use `left + (right - left) // 2`.

### 3. Wrong Loop Condition
**Issue:** Using `left < right` instead of `left <= right`.

**Solution:** Use `<=` to check boundary elements.

### 4. Not Handling Edge Cases
**Issue:** Not handling n=1 correctly.

**Solution:** Algorithm handles it with proper initialization.

---

## Summary

The **Guess Number Higher or Lower** problem demonstrates the **Binary Search** pattern with an API-based guess function. The key is using feedback from the guess API to narrow down the search space.

### Key Takeaways

1. **API Feedback Interpretation**: -1 means guess is higher (pick is lower), 1 means guess is lower (pick is higher)
2. **Binary Search Fundamentals**: Use left and right pointers to narrow search space
3. **Loop Condition**: Use `<=` to check boundary elements
4. **Integer Overflow Prevention**: Use `left + (right - left) // 2` instead of `(left + right) // 2`

### Pattern Summary

This problem exemplifies the **Binary Search** pattern, characterized by:
- Halving the search space with each iteration
- Using O(log n) time complexity
- Requiring sorted or partially sorted data structure

For more details on this pattern, see the **[Binary Search](/patterns/binary-search)**.

---

## Additional Resources

- [LeetCode Problem 374](https://leetcode.com/problems/guess-number-higher-or-lower/) - Official problem page
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Detailed explanation
- [Pattern: Binary Search](/patterns/binary-search) - Comprehensive pattern guide
