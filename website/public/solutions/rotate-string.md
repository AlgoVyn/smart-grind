# Rotate String

## Problem Description

Given two strings `s` and `goal`, return `true` if and only if `s` can become `goal` after some number of shifts on `s`.

A shift on `s` consists of moving the leftmost character of `s` to the rightmost position.

For example, if `s = "abcde"`, then it will be `"bcdea"` after one shift.

**Link to problem:** [Rotate String - LeetCode 796](https://leetcode.com/problems/rotate-string/)

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `s = "abcde"`<br>`goal = "cdeab"` | `true` |

**Explanation:** After 2 shifts: "abcde" → "bcdea" → "cdeab"

**Example 2:**

| Input | Output |
|-------|--------|
| `s = "abcde"`<br>`goal = "abced"` | `false` |

**Explanation:** No number of shifts can produce "abced" from "abcde"

## Constraints

- `1 <= s.length, goal.length <= 100`
- `s` and `goal` consist of lowercase English letters.

---

## Pattern: String Rotation Detection

This problem demonstrates the **String Rotation** pattern, which is a special case of substring checking. The key insight is that any rotation of string `s` will be a substring of `s + s`.

### Core Concept

When you concatenate a string with itself (`s + s`), every possible rotation of `s` becomes a contiguous substring:

```
s = "abcde"
s + s = "abcdeabcde"

Rotations of s:
- "abcde" (0 shifts) - found at index 0
- "bcdea" (1 shift)  - found at index 1
- "cdeab" (2 shifts) - found at index 2
- "deabc" (3 shifts) - found at index 3
- "eabcd" (4 shifts) - found at index 4
```

---

## Intuition

### Why s + s Works

1. **Complete Coverage**: Every possible rotation of `s` is contained in `s + s`
2. **Length Preservation**: We must first verify `len(s) == len(goal)` because shorter strings cannot match longer ones
3. **Efficient Checking**: Instead of generating all rotations (O(n²)), we use substring search (O(n))

### Alternative Approaches

1. **Brute Force**: Generate all rotations and check each (O(n²) - inefficient)
2. **Concatenation + Substring**: Use `s + s` and check if `goal` is a substring (optimal O(n))
3. **Character-by-Character**: Use KMP or rolling hash for O(n) substring search

---

## Multiple Approaches with Code

## Approach 1: Concatenation + Substring (Optimal)

This is the most elegant and efficient solution. By concatenating `s` with itself, all possible rotations become substrings.

````carousel
```python
class Solution:
    def rotateString(self, s: str, goal: str) -> bool:
        """
        Check if goal is a rotation of s.
        
        Args:
            s: Source string
            goal: Target string to check
            
        Returns:
            True if goal can be obtained by rotating s
        """
        # Length check is essential
        if len(s) != len(goal):
            return False
        
        # All rotations of s are substrings of s + s
        return goal in (s + s)
```
<!-- slide -->
```cpp
class Solution {
public:
    bool rotateString(string s, string goal) {
        // Length check is essential
        if (s.length() != goal.length()) {
            return false;
        }
        
        // All rotations of s are substrings of s + s
        return (s + s).find(goal) != string::npos;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean rotateString(String s, String goal) {
        // Length check is essential
        if (s.length() != goal.length()) {
            return false;
        }
        
        // All rotations of s are substrings of s + s
        return (s + s).contains(goal);
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @param {string} goal
 * @return {boolean}
 */
var rotateString = function(s, goal) {
    // Length check is essential
    if (s.length !== goal.length) {
        return false;
    }
    
    // All rotations of s are substrings of s + s
    return (s + s).includes(goal);
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n) where n is the length of strings |
| **Space** | O(n) for the concatenated string |

---

## Approach 2: Character-by-Character Comparison

This approach manually checks each possible rotation without using substring search.

````carousel
```python
class Solution:
    def rotateString_manual(self, s: str, goal: str) -> bool:
        """
        Check rotations by character comparison.
        
        Args:
            s: Source string
            goal: Target string
            
        Returns:
            True if goal can be obtained by rotating s
        """
        if len(s) != len(goal):
            return False
        
        n = len(s)
        
        # Try each possible rotation
        for shift in range(n):
            # Check if rotating s by 'shift' equals goal
            rotated = s[shift:] + s[:shift]
            if rotated == goal:
                return True
        
        return False
```
<!-- slide -->
```cpp
class Solution {
public:
    bool rotateString(string s, string goal) {
        if (s.length() != goal.length()) {
            return false;
        }
        
        int n = s.length();
        
        // Try each possible rotation
        for (int shift = 0; shift < n; shift++) {
            string rotated = s.substr(shift) + s.substr(0, shift);
            if (rotated == goal) {
                return true;
            }
        }
        
        return false;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean rotateString(String s, String goal) {
        if (s.length() != goal.length()) {
            return false;
        }
        
        int n = s.length();
        
        // Try each possible rotation
        for (int shift = 0; shift < n; shift++) {
            String rotated = s.substring(shift) + s.substring(0, shift);
            if (rotated.equals(goal)) {
                return true;
            }
        }
        
        return false;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @param {string} goal
 * @return {boolean}
 */
var rotateString = function(s, goal) {
    if (s.length !== goal.length) {
        return false;
    }
    
    const n = s.length;
    
    // Try each possible rotation
    for (let shift = 0; shift < n; shift++) {
        const rotated = s.slice(shift) + s.slice(0, shift);
        if (rotated === goal) {
            return true;
        }
    }
    
    return false;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n²) - generating each rotation is O(n) |
| **Space** | O(n) for rotated string |

---

## Approach 3: Using Index Tracking

This approach tracks indices to avoid string concatenation.

````carousel
```python
class Solution:
    def rotateString_index(self, s: str, goal: str) -> bool:
        """
        Check rotations using index comparison.
        
        Args:
            s: Source string
            goal: Target string
            
        Returns:
            True if goal can be obtained by rotating s
        """
        if len(s) != len(goal):
            return False
        
        n = len(s)
        
        # Find the starting position of goal in s + s
        for i in range(n):
            match = True
            for j in range(n):
                if s[(i + j) % n] != goal[j]:
                    match = False
                    break
            if match:
                return True
        
        return False
```
<!-- slide -->
```cpp
class Solution {
public:
    bool rotateString(string s, string goal) {
        if (s.length() != goal.length()) {
            return false;
        }
        
        int n = s.length();
        
        // Find the starting position using modular arithmetic
        for (int i = 0; i < n; i++) {
            bool match = true;
            for (int j = 0; j < n; j++) {
                if (s[(i + j) % n] != goal[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return true;
            }
        }
        
        return false;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean rotateString(String s, String goal) {
        if (s.length() != goal.length()) {
            return false;
        }
        
        int n = s.length();
        
        // Find the starting position using modular arithmetic
        for (int i = 0; i < n; i++) {
            boolean match = true;
            for (int j = 0; j < n; j++) {
                if (s.charAt((i + j) % n) != goal.charAt(j)) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return true;
            }
        }
        
        return false;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @param {string} goal
 * @return {boolean}
 */
var rotateString = function(s, goal) {
    if (s.length !== goal.length) {
        return false;
    }
    
    const n = s.length;
    
    // Find the starting position using modular arithmetic
    for (let i = 0; i < n; i++) {
        let match = true;
        for (let j = 0; j < n; j++) {
            if (s[(i + j) % n] !== goal[j]) {
                match = false;
                break;
            }
        }
        if (match) {
            return true;
        }
    }
    
    return false;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n²) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| **Concatenation + Substring** | O(n) | O(n) | Best for interviews |
| **Character-by-Character** | O(n²) | O(n) | More intuitive |
| **Index Tracking** | O(n²) | O(1) | No extra memory |

**Best Approach:** The concatenation + substring approach (Approach 1) is optimal and most commonly used in interviews.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Meta, Google
- **Difficulty**: Easy
- **Pattern**: String manipulation, substring searching

### Key Insights

1. **Concatenation Trick**: The `s + s` pattern is powerful for rotation problems
2. **Length Check**: Always verify lengths first
3. **Substring Search**: Standard library methods make this elegant

---

## Related Problems

### Same Pattern

| Problem | LeetCode Link | Difficulty |
|---------|---------------|-------------|
| Rotate Array | [Link](https://leetcode.com/problems/rotate-array/) | Medium |
| Isomorphic Strings | [Link](https://leetcode.com/problems/isomorphic-strings/) | Easy |
| String Rotation | [Link](https://leetcode.com/problems/rotate-string-lcci/) | Easy |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Find the Index of the First Occurrence | [Link](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/) | Medium | KMP Algorithm |
| Repeated Substring Pattern | [Link](https://leetcode.com/problems/repeated-substring-pattern/) | Easy | String concatenation |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Rotate String](https://www.youtube.com/watch?v=MeRBTyNYcDk)** - Clear explanation of the concatenation approach
2. **[LeetCode Official Solution](https://www.youtube.com/watch?v=Q9E4R6n4qXk)** - Official problem walkthrough
3. **[String Rotation Explained](https://www.youtube.com/watch?v=yp5sElSqtgE)** - Visual explanation

### Additional Resources

- **[String Rotation - GeeksforGeeks](https://www.geeksforgeeks.org/a-program-to-check-if-strings-are-rotations-of-each-other/)** - Detailed explanation

---

## Follow-up Questions

### Q1: What if you need to find the number of shifts required?

**Answer:** Use the index where `goal` starts in `s + s`. If `goal` is found at index `i` in `s + s`, then `i` shifts are required.

---

### Q2: How would you handle this with KMP for better worst-case performance?

**Answer:** Use KMP's preprocessing to achieve O(n) guaranteed time complexity instead of the average O(n) with built-in substring search. KMP finds the pattern in O(n + m) time.

---

### Q3: Can you solve this without concatenation for very large strings?

**Answer:** Yes, use the index-tracking approach (Approach 3) which compares characters using modular arithmetic without creating intermediate strings. However, this has O(n²) time complexity.

---

### Q4: What edge cases should be tested?

**Answer:**
- Empty strings (not allowed by constraints)
- Single character strings
- Strings with all identical characters ("aaa", "aaa")
- Strings where goal equals s (0 shifts)
- Strings with different lengths
- Very long strings (100 characters)

---

### Q5: How does this relate to circular array problems?

**Answer:** This is essentially a 1D circular array problem. The modular arithmetic `(i + j) % n` in Approach 3 demonstrates this connection. Rotation problems in 2D (matrices) use similar principles.

---

## Common Pitfalls

### 1. Forgetting Length Check
**Issue:** Without length check, shorter strings might incorrectly match.

**Solution:** Always check `len(s) == len(goal)` first.

### 2. Using Wrong Concatenation
**Issue:** Using `s * 2` instead of `s + s` in some languages.

**Solution:** Use `s + s` (string concatenation).

### 3. Off-by-One Errors
**Issue:** Incorrect index calculation in manual rotation.

**Solution:** Test with edge cases like shift = 0 and shift = n-1.

---

## Summary

The **Rotate String** problem demonstrates the elegance of string manipulation:

- **Concatenation Trick**: `s + s` contains all rotations as substrings
- **Optimal Solution**: O(n) time using built-in substring search
- **Pattern Recognition**: This pattern extends to circular arrays and matrix rotations

Key takeaways:
1. Always check length equality first
2. The concatenation approach is both simple and efficient
3. This pattern appears in various rotation-related problems

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/rotate-string/discuss/)
- [String Rotation - GeeksforGeeks](https://www.geeksforgeeks.org/a-program-to-check-if-strings-are-rotations-of-each-other/)
- [Pattern: String Rotation](/patterns/string-rotation)
