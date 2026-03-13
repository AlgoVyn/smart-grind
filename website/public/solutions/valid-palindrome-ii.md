# Valid Palindrome II

## Problem Description

Given a string `s`, return `true` if the `s` can be palindrome after deleting at most one character from it.

**Link to problem:** [Valid Palindrome II - LeetCode 680](https://leetcode.com/problems/valid-palindrome-ii/)

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `s = "aba"` | `true` |

**Explanation:** Already a palindrome, no deletion needed.

**Example 2:**

| Input | Output |
|-------|--------|
| `s = "abca"` | `true` |

**Explanation:** Delete character 'c' to get "aba" which is a palindrome.

**Example 3:**

| Input | Output |
|-------|--------|
| `s = "abc"` | `false` |

**Explanation:** Cannot form a palindrome by deleting at most one character.

## Constraints

- `1 <= s.length <= 10^5`
- `s` consists of lowercase English letters.

---

## Pattern: Two Pointers with Deletion

This problem extends the classic palindrome checking with the ability to skip one character. The key is to use two pointers and when a mismatch is found, check both possibilities of deleting either the left or right character.

### Core Concept

1. Use two pointers starting from both ends
2. When characters match, move pointers inward
3. When mismatch found, try skipping either left or right character
4. If either works, return true

---

## Intuition

### Why This Works

- If the string is already a palindrome, return true immediately
- If there's exactly one mismatch, we can delete either the left or right character
- We only need to check once because we're allowed to delete at most one character

### Key Insight

When `s[left] != s[right]`, we have two options:
1. Delete `s[left]` and check if `s[left+1:right+1]` is a palindrome
2. Delete `s[right]` and check if `s[left:right]` is a palindrome

If either is true, the original string can form a palindrome with at most one deletion.

---

## Multiple Approaches with Code

## Approach 1: Two Pointers with Helper Function (Optimal)

This is the most efficient solution. When a mismatch is found, we check both possible deletions.

````carousel
```python
class Solution:
    def validPalindrome(self, s: str) -> bool:
        """
        Check if string can be palindrome with at most one deletion.
        
        Args:
            s: Input string to check
            
        Returns:
            True if can form palindrome with at most one deletion
        """
        def is_palindrome(left: int, right: int) -> bool:
            """Check if substring s[left:right+1] is a palindrome."""
            while left < right:
                if s[left] != s[right]:
                    return False
                left += 1
                right -= 1
            return True
        
        left, right = 0, len(s) - 1
        
        while left < right:
            if s[left] != s[right]:
                # Try skipping either left or right character
                return is_palindrome(left + 1, right) or is_palindrome(left, right - 1)
            left += 1
            right -= 1
        
        return True
```
<!-- slide -->
```cpp
class Solution {
public:
    bool validPalindrome(string s) {
        /**
         * Check if string can be palindrome with at most one deletion.
         */
        auto isPalindrome = [&](int left, int right) -> bool {
            while (left < right) {
                if (s[left] != s[right]) {
                    return false;
                }
                left++;
                right--;
            }
            return true;
        };
        
        int left = 0, right = s.length() - 1;
        
        while (left < right) {
            if (s[left] != s[right]) {
                // Try skipping either left or right character
                return isPalindrome(left + 1, right) || isPalindrome(left, right - 1);
            }
            left++;
            right--;
        }
        
        return true;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean validPalindrome(String s) {
        /**
         * Check if string can be palindrome with at most one deletion.
         */
        int left = 0, right = s.length() - 1;
        
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                // Try skipping either left or right character
                return isPalindrome(s, left + 1, right) || isPalindrome(s, left, right - 1);
            }
            left++;
            right--;
        }
        
        return true;
    }
    
    private boolean isPalindrome(String s, int left, int right) {
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var validPalindrome = function(s) {
    const isPalindrome = (left, right) => {
        while (left < right) {
            if (s[left] !== s[right]) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    };
    
    let left = 0, right = s.length - 1;
    
    while (left < right) {
        if (s[left] !== s[right]) {
            // Try skipping either left or right character
            return isPalindrome(left + 1, right) || isPalindrome(left, right - 1);
        }
        left++;
        right--;
    }
    
    return true;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n) - each character visited at most twice |
| **Space** | O(1) - excluding recursion stack |

---

## Approach 2: Using String Slicing

This approach creates substrings to check validity, which is simpler but uses more memory.

````carousel
```python
class Solution:
    def validPalindrome_slice(self, s: str) -> bool:
        """
        Check using string slicing approach.
        """
        left, right = 0, len(s) - 1
        
        while left < right:
            if s[left] != s[right]:
                # Try both possible deletions
                s1 = s[left + 1:right + 1]
                s2 = s[left:right]
                return s1 == s1[::-1] or s2 == s2[::-1]
            left += 1
            right -= 1
        
        return True
```
<!-- slide -->
```cpp
class Solution {
public:
    bool validPalindrome(string s) {
        int left = 0, right = s.length() - 1;
        
        while (left < right) {
            if (s[left] != s[right]) {
                // Try skipping either character
                string s1 = s.substr(left + 1, right - left);
                string s2 = s.substr(left, right - left);
                
                string rs1 = s1;
                reverse(rs1.begin(), rs1.end());
                string rs2 = s2;
                reverse(rs2.begin(), rs2.end());
                
                return s1 == rs1 || s2 == rs2;
            }
            left++;
            right--;
        }
        
        return true;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean validPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                // Try skipping either character
                String s1 = s.substring(left + 1, right + 1);
                String s2 = s.substring(left, right);
                
                return isPalindrome(s1) || isPalindrome(s2);
            }
            left++;
            right--;
        }
        
        return true;
    }
    
    private boolean isPalindrome(String str) {
        int left = 0, right = str.length() - 1;
        while (left < right) {
            if (str.charAt(left) != str.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var validPalindrome = function(s) {
    const isPalindrome = (str) => {
        let left = 0, right = str.length - 1;
        while (left < right) {
            if (str[left] !== str[right]) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    };
    
    let left = 0, right = s.length - 1;
    
    while (left < right) {
        if (s[left] !== s[right]) {
            // Try skipping either character
            const s1 = s.slice(left + 1, right + 1);
            const s2 = s.slice(left, right);
            return isPalindrome(s1) || isPalindrome(s2);
        }
        left++;
        right--;
    }
    
    return true;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n) - substring creation + checking |
| **Space** | O(n) - creating substrings |

---

## Approach 3: Count-Based Approach

This approach counts mismatches and allows at most one.

````carousel
```python
class Solution:
    def validPalindrome_count(self, s: str) -> bool:
        """
        Count mismatches and allow at most one deletion.
        """
        left, right = 0, len(s) - 1
        deletions = 0
        
        while left < right:
            if s[left] != s[right]:
                if deletions == 0:
                    # Try both options - can only delete once
                    return (self._check_palindrome(s, left + 1, right) or 
                            self._check_palindrome(s, left, right - 1))
                return False
            left += 1
            right -= 1
        
        return True
    
    def _check_palindrome(self, s: str, left: int, right: int) -> bool:
        """Helper to check palindrome in range."""
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True
```
<!-- slide -->
```cpp
class Solution {
public:
    bool validPalindrome(string s) {
        int left = 0, right = s.length() - 1;
        
        while (left < right) {
            if (s[left] != s[right]) {
                return isPalindrome(s, left + 1, right) || 
                       isPalindrome(s, left, right - 1);
            }
            left++;
            right--;
        }
        
        return true;
    }
    
private:
    bool isPalindrome(string& s, int left, int right) {
        while (left < right) {
            if (s[left] != s[right]) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean validPalindrome(String s) {
        return helper(s, 0, s.length() - 1, 0);
    }
    
    private boolean helper(String s, int left, int right, int deletions) {
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                if (deletions == 0) {
                    return helper(s, left + 1, right, 1) || 
                           helper(s, left, right - 1, 1);
                }
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var validPalindrome = function(s) {
    const helper = (left, right, deletions) => {
        while (left < right) {
            if (s[left] !== s[right]) {
                if (deletions < 1) {
                    return helper(left + 1, right, deletions + 1) || 
                           helper(left, right - 1, deletions + 1);
                }
                return false;
            }
            left++;
            right--;
        }
        return true;
    };
    
    return helper(0, s.length - 1, 0);
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n) |
| **Space** | O(n) - recursion stack in worst case |

---

## Comparison of Approaches

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| **Two Pointers + Helper** | O(n) | O(1) | Best for interviews |
| **String Slicing** | O(n) | O(n) | Simpler to understand |
| **Count-Based** | O(n) | O(n) | Uses recursion |

**Best Approach:** Two Pointers + Helper (Approach 1) is optimal with O(n) time and O(1) space.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Meta, Amazon, Microsoft
- **Difficulty**: Easy
- **Concepts**: Two pointers, string manipulation

### Key Insights

1. Only one mismatch needs to be handled
2. When mismatch found, check both deletion possibilities
3. Early termination if already palindrome

---

## Related Problems

### Same Pattern (Palindrome)

| Problem | LeetCode Link | Difficulty |
|---------|---------------|-------------|
| Valid Palindrome | [Link](https://leetcode.com/problems/valid-palindrome/) | Easy |
| Palindrome Linked List | [Link](https://leetcode.com/problems/palindrome-linked-list/) | Easy |
| Longest Palindromic Substring | [Link](https://leetcode.com/problems/longest-palindromic-substring/) | Medium |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Valid Palindrome III | [Link](https://leetcode.com/problems/valid-palindrome-iii/) | Hard | DP, recursion |
| Shortest Palindrome | [Link](https://leetcode.com/problems/shortest-palindrome/) | Hard | KMP |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Valid Palindrome II](https://www.youtube.com/watch?v=6G-8cRwcEA)** - Clear explanation
2. **[LeetCode Official Solution](https://www.youtube.com/watch?v=TRgYDO1exjQ)** - Official walkthrough

### Additional Resources

- **[Two Pointers - GeeksforGeeks](https://www.geeksforgeeks.org/two-pointer-technique/)** - Two pointers guide

---

## Follow-up Questions

### Q1: What if you could delete at most k characters?

**Answer:** Use a recursive approach with a parameter tracking deletions. When `k > 1`, use dynamic programming. For general `k`, this becomes the "Minimum Insertion to Form Palindrome" type problem.

---

### Q2: How would you find which character to delete for debugging?

**Answer:** Track the left and right indices when mismatch occurs. Return both possible deletion positions and verify which one works.

---

### Q3: What if strings can have uppercase letters too?

**Answer:** Convert to lowercase first using `s.lower()` in Python, `toLowerCase()` in Java/JavaScript, or similar in C++. The two-pointer logic remains the same.

---

### Q4: Can you solve this without creating helper functions?

**Answer:** Yes, inline the palindrome check. However, helper functions make the code cleaner and more readable.

---

### Q5: What edge cases should be tested?

**Answer:**
- Empty string (not in constraints)
- Single character
- Two characters ("ab", "aa")
- All same characters ("aaa")
- Already palindrome ("aba")
- Needs one deletion ("abca")
- Cannot form palindrome ("abc")

---

## Common Pitfalls

### 1. Forgetting to Check Both Options
**Issue:** Only checking one deletion possibility.

**Solution:** Always check both `is_palindrome(left+1, right)` and `is_palindrome(left, right-1)`.

### 2. Off-by-One Errors
**Issue:** Incorrect substring boundaries.

**Solution:** Be careful with slice indices: `s[left+1:right+1]` includes right, `s[left:right]` excludes right.

### 3. Not Handling Already Palindrome
**Issue:** Failing for strings that are already palindromes.

**Solution:** The main loop should handle this naturally - if no mismatches found, return true.

---

## Summary

The **Valid Palindrome II** problem demonstrates:

- **Two Pointers**: Efficient palindrome checking
- **Single Deletion**: Handle one mismatch by trying both options
- **O(n) Time**: Optimal solution with minimal space

Key takeaways:
1. When mismatch found, try both deletion possibilities
2. Use helper function for clean code
3. This extends to k-deletion problems with modifications

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/valid-palindrome-ii/discuss/)
- [Pattern: Two Pointers](/patterns/two-pointers)
