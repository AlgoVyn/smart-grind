# Happy Number

## Problem Description

Write an algorithm to determine if a number `n` is happy.

A happy number is a number defined by the following process:

1. Starting with any positive integer, replace the number by the sum of the squares of its digits.
2. Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.
3. Those numbers for which this process ends in 1 are happy.

Return `true` if `n` is a happy number, and `false` if not.

**Link to problem:** [Happy Number - LeetCode 202](https://leetcode.com/problems/happy-number/)

---

## Examples

### Example 1

| Input | Output |
|-------|--------|
| `n = 19` | `true` |

**Explanation:**

```
1² + 9² = 82
8² + 2² = 68
6² + 8² = 100
1² + 0² + 0² = 1
```

### Example 2

| Input | Output |
|-------|--------|
| `n = 2` | `false` |

---

## Constraints

- `1 <= n <= 2³¹ - 1`

---

## Pattern: Cycle Detection

This problem follows the **Cycle Detection** pattern using Floyd's algorithm.

---

## Intuition

The key insight for this problem is understanding the behavior of repeated digit square sums:

> Any non-happy number will eventually enter a cycle (usually the cycle 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4), while happy numbers will reach 1.

### Key Observations

1. **Finite State Machine**: The transformation creates a deterministic sequence that either reaches 1 or enters a cycle.

2. **Cycle Detection**: Since we know unhappy numbers enter a cycle, we just need to detect if we reach 1 or enter a cycle.

3. **Two Approaches**:
   - **Hash Set**: Track all seen numbers - if we see a repeat, it's a cycle
   - **Floyd's Tortoise & Hare**: Use slow and fast pointers - if they meet, there's a cycle

4. **Mathematical Property**: All unhappy numbers eventually reach the cycle containing 4. This is a useful shortcut!

### Algorithm Overview

**Approach 1: Hash Set**
1. Keep a set of seen numbers
2. If we see a number again, return false (cycle)
3. If we reach 1, return true

**Approach 2: Floyd's Algorithm**
1. Use slow pointer (moves 1 step) and fast pointer (moves 2 steps)
2. If they meet, there's a cycle (not happy)
3. If fast reaches 1, it's happy

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Floyd's Tortoise & Hare** - Optimal solution (O(log n) time, O(1) space)
2. **Hash Set** - Alternative approach (O(log n) time, O(log n) space)

---

## Approach 1: Floyd's Tortoise & Hare (Optimal) ⭐

### Algorithm Steps

1. Initialize slow pointer to n
2. Initialize fast pointer to get_next(n)
3. Loop while fast != 1:
   - Move slow one step: slow = get_next(slow)
   - Move fast two steps: fast = get_next(get_next(fast))
   - If slow == fast, return false (cycle detected)
4. Return true (reached 1)

### Why It Works

Floyd's algorithm detects cycles without extra space:
- If there's a cycle, fast and slow pointers will eventually meet
- If the sequence reaches 1, fast will become 1 and we can stop

### Code Implementation

````carousel
```python
class Solution:
    def isHappy(self, n: int) -> bool:
        """
        Determine if a number is happy using Floyd's algorithm.
        
        Args:
            n: The input number
            
        Returns:
            True if n is happy, False otherwise
        """
        def get_next(num: int) -> int:
            """Calculate sum of squares of digits."""
            total = 0
            while num > 0:
                digit = num % 10
                total += digit * digit
                num //= 10
            return total
        
        # Handle edge case
        if n <= 0:
            return False
        
        # Initialize pointers
        slow = n
        fast = get_next(n)
        
        # Floyd's cycle detection
        while fast != 1 and slow != fast:
            slow = get_next(slow)
            fast = get_next(get_next(fast))
        
        return fast == 1
```

<!-- slide -->
```cpp
class Solution {
public:
    bool isHappy(int n) {
        // Helper function to get sum of squares of digits
        auto getNext = [](int num) {
            int total = 0;
            while (num > 0) {
                int digit = num % 10;
                total += digit * digit;
                num /= 10;
            }
            return total;
        };
        
        if (n <= 0) return false;
        
        int slow = n;
        int fast = getNext(n);
        
        // Floyd's cycle detection
        while (fast != 1 && slow != fast) {
            slow = getNext(slow);
            fast = getNext(getNext(fast));
        }
        
        return fast == 1;
    }
};
```

<!-- slide -->
```java
class Solution {
    private int getNext(int n) {
        int total = 0;
        while (n > 0) {
            int digit = n % 10;
            total += digit * digit;
            n /= 10;
        }
        return total;
    }
    
    public boolean isHappy(int n) {
        if (n <= 0) return false;
        
        int slow = n;
        int fast = getNext(n);
        
        // Floyd's cycle detection
        while (fast != 1 && slow != fast) {
            slow = getNext(slow);
            fast = getNext(getNext(fast));
        }
        
        return fast == 1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @return {boolean}
 */
var isHappy = function(n) {
    // Helper function to get sum of squares of digits
    const getNext = (num) => {
        let total = 0;
        while (num > 0) {
            const digit = num % 10;
            total += digit * digit;
            num = Math.floor(num / 10);
        }
        return total;
    };
    
    if (n <= 0) return false;
    
    let slow = n;
    let fast = getNext(n);
    
    // Floyd's cycle detection
    while (fast !== 1 && slow !== fast) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }
    
    return fast === 1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) - each step reduces the number |
| **Space** | O(1) - constant extra space |

---

## Approach 2: Hash Set

### Algorithm Steps

1. Use a set to track all seen numbers
2. While n is not 1 and not in set:
   - Add n to set
   - Calculate next number
   - Update n
3. Return true if n == 1, false otherwise

### Why It Works

Using a set to track seen numbers is intuitive:
- If we see a number again, we've entered a cycle
- If we reach 1, the number is happy

### Code Implementation

````carousel
```python
class Solution:
    def isHappy(self, n: int) -> bool:
        """
        Determine if a number is happy using hash set.
        
        Args:
            n: The input number
            
        Returns:
            True if n is happy, False otherwise
        """
        def get_next(num: int) -> int:
            """Calculate sum of squares of digits."""
            total = 0
            while num > 0:
                digit = num % 10
                total += digit * digit
                num //= 10
            return total
        
        seen = set()
        
        while n != 1 and n not in seen:
            seen.add(n)
            n = get_next(n)
        
        return n == 1
```

<!-- slide -->
```cpp
class Solution {
public:
    bool isHappy(int n) {
        unordered_set<int> seen;
        
        while (n != 1 && seen.find(n) == seen.end()) {
            seen.insert(n);
            
            int next = 0;
            while (n > 0) {
                int digit = n % 10;
                next += digit * digit;
                n /= 10;
            }
            n = next;
        }
        
        return n == 1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean isHappy(int n) {
        Set<Integer> seen = new HashSet<>();
        
        while (n != 1 && !seen.contains(n)) {
            seen.add(n);
            
            int next = 0;
            while (n > 0) {
                int digit = n % 10;
                next += digit * digit;
                n /= 10;
            }
            n = next;
        }
        
        return n == 1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @return {boolean}
 */
var isHappy = function(n) {
    const seen = new Set();
    
    const getNext = (num) => {
        let total = 0;
        while (num > 0) {
            const digit = num % 10;
            total += digit * digit;
            num = Math.floor(num / 10);
        }
        return total;
    };
    
    while (n !== 1 && !seen.has(n)) {
        seen.add(n);
        n = getNext(n);
    }
    
    return n === 1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) - each step reduces the number |
| **Space** | O(log n) - set of seen numbers |

---

## Comparison of Approaches

| Aspect | Floyd's Algorithm | Hash Set |
|--------|------------------|----------|
| **Time Complexity** | O(log n) | O(log n) |
| **Space Complexity** | O(1) | O(log n) |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Medium | Easy |
| **Memory Usage** | Constant | Linear |

**Best Approach:** Use Approach 1 (Floyd's Algorithm) for optimal space complexity. It's a classic cycle detection technique.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Microsoft, Google
- **Difficulty**: Easy/Medium
- **Concepts Tested**: Cycle detection, Floyd's algorithm, mathematical properties

### Learning Outcomes

1. **Floyd's Algorithm**: Master the tortoise and hare technique for cycle detection
2. **Mathematical Insight**: Understand why unhappy numbers enter cycles
3. **Space Optimization**: Learn to reduce space from O(n) to O(1)

---

## Related Problems

Based on similar themes (cycle detection, mathematical sequences):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Linked List Cycle II | [Link](https://leetcode.com/problems/linked-list-cycle-ii/) | Floyd's algorithm on linked list |
| Find the Duplicate Number | [Link](https://leetcode.com/problems/find-the-duplicate-number/) | Cycle detection in array |
| Candy Crush | [Link](https://leetcode.com/problems/candy-crush/) | Similar digit manipulation |
| Ugly Number | [Link](https://leetcode.com/problems/ugly-number/) | Mathematical sequence |

### Pattern Reference

For more detailed explanations of the Cycle Detection pattern, see:
- **[Two Pointers Pattern](/patterns/two-pointers-fast-slow-cycle-detection)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Happy Number](https://www.youtube.com/watch?v=ljzPaEzF6oM)** - Clear explanation with visual examples
2. **[Happy Number - LeetCode 202](https://www.youtube.com/watch?v=oQ2rL0zrRjw)** - Detailed walkthrough
3. **[Floyd's Cycle Detection Algorithm](https://www.youtube.com/watch?v=wjYnzkAhcNk)** - Understanding tortoise and hare

### Related Concepts

- **[Number Theory Basics](https://www.youtube.com/watch?v=1kQ3b9b2bTQ)** - Mathematical foundations
- **[Digit Manipulation](https://www.youtube.com/watch?v=u0X7m9kX6l8)** - Common techniques

---

## Follow-up Questions

### Q1: What if we needed to find the cycle length?

**Answer:** Once fast and slow meet, keep one pointer fixed and move the other until they meet again. The number of steps is the cycle length.

---

### Q2: Can you prove that all unhappy numbers eventually enter the same cycle?

**Answer:** Yes! It's mathematically proven that all unhappy numbers eventually reach 4, which is part of the cycle 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4.

---

### Q3: How would you find which number in the cycle an unhappy number reaches?

**Answer:** Use Floyd's algorithm to find the meeting point, then use a second pass to find the entry point of the cycle.

---

### Q4: What if we wanted to find all happy numbers up to n?

**Answer:** You'd need to check each number individually. However, you can use the mathematical property that unhappy numbers reach 4 to short-circuit.

---

### Q5: Can this problem be solved using recursion?

**Answer:** Yes, but it's not recommended due to potential stack overflow for very deep recursions. Iteration is safer.

---

## Common Pitfalls

### 1. Infinite Loop
**Issue:** Not detecting cycle and looping forever.

**Solution:** Use cycle detection (Floyd's or hash set).

### 2. Wrong Sum Function
**Issue:** Not calculating digit squares correctly.

**Solution:** Sum of (digit * digit) for each digit.

### 3. Not Handling 1
**Issue:** Not recognizing 1 as happy number.

**Solution:** Return true if sum reaches 1.

### 4. Wrong Base Case
**Issue:** Not handling n = 0 or negative numbers.

**Solution:** The problem states n >= 1, so handle edge cases appropriately.

### 5. Performance Issues
**Issue:** Using string conversion instead of digit extraction.

**Solution:** Use modulo and division to extract digits mathematically.

---

## Summary

The **Happy Number** problem demonstrates **Cycle Detection** using Floyd's Tortoise and Hare algorithm. The key insight is that unhappy numbers will eventually enter a cycle.

### Key Takeaways

1. **Cycle Detection**: Use Floyd's algorithm for O(1) space complexity
2. **Digit Extraction**: Use modulo and division to extract digits
3. **Mathematical Property**: All unhappy numbers reach the cycle containing 4
4. **Two Approaches**: Hash set (O(n) space) vs Floyd's (O(1) space)

### Pattern Summary

This problem exemplifies the **Cycle Detection** pattern, characterized by:
- Detecting cycles in deterministic sequences
- Using slow and fast pointers (Floyd's algorithm)
- Mathematical properties that guarantee termination

For more details on this pattern, see the **[Two Pointers Pattern](/patterns/two-pointers-fast-slow-cycle-detection)**.

---

## Additional Resources

- [LeetCode Problem 202](https://leetcode.com/problems/happy-number/) - Official problem page
- [Floyd's Cycle Detection - Wikipedia](https://en.wikipedia.org/wiki/Cycle_detection) - Algorithm explanation
- [Number Theory - Happy Numbers](https://mathworld.wolfram.com/HappyNumber.html) - Mathematical background
- [Pattern: Two Pointers](/patterns/two-pointers-fast-slow-cycle-detection) - Comprehensive pattern guide
