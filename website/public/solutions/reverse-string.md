# Reverse String

## Problem Description

Write a function that reverses a string. The input string is given as an array of characters `s`.

You must do this by modifying the input array in-place with O(1) extra memory.

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `s = ["h","e","l","l","o"]` | `["o","l","l","e","h"]` |

**Example 2:**

| Input | Output |
|-------|--------|
| `s = ["H","a","n","n","a","h"]` | `["h","a","n","n","a","H"]` |

## Constraints

- `1 <= s.length <= 10^5`
- `s[i]` is a printable ASCII character.

---

## Pattern:

This problem follows the **Two Pointers** pattern for in-place array manipulation.

### Core Concept

- **Symmetric Pairing**: Swap characters at symmetric positions from both ends
- **In-Place Modification**: No extra array needed, O(1) space
- **Termination**: Loop ends when pointers meet or cross

### When to Use This Pattern

This pattern is applicable when:
1. Reversing arrays or strings in-place
2. Problems requiring symmetric element swapping
3. Palindrome checking problems

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Two Pointers | General technique with left/right pointers |
| In-Place Swap | Modify without额外空间 |
| Palindrome Check | Similar symmetric comparison |

## Intuition

The key insight is that reversing a string is equivalent to swapping symmetric pairs of characters. For a string of length `n`, the character at position `i` should be swapped with the character at position `n-1-i`.

**Why Two Pointers Works:**
1. **Symmetric Pairing**: Each swap corrects two character positions simultaneously
2. **Termination**: Loop ends when `left >= right`, ensuring all pairs are swapped
3. **Efficiency**: Each character is visited exactly once
4. **In-Place**: Only uses two pointer variables, no extra array needed

---

## Multiple Approaches

We'll cover three approaches:

1. **Two Pointers (Optimal)** ⭐ - O(n) time, O(1) space
2. **Recursive In-Place** - O(n) time, O(n) stack space
3. **Built-in Functions** - O(n) time, O(n) space (not in-place)

---

## Approach 1: Two Pointers (Optimal) ⭐

Use two pointers starting at the beginning and end of the array, swapping characters and moving toward the center until the entire string is reversed.

### Algorithm Steps

1. Initialize `left = 0` and `right = len(s) - 1`
2. While `left < right`:
   - Swap `s[left]` and `s[right]`
   - Increment `left` by 1
   - Decrement `right` by 1

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def reverseString(self, s: List[str]) -> None:
        """
        Reverses the string in-place using two pointers.
        
        Args:
            s: List of characters to reverse (modified in-place)
        
        Time Complexity: O(n) - each character is swapped once
        Space Complexity: O(1) - constant extra space
        """
        left, right = 0, len(s) - 1
        
        while left < right:
            # Swap characters at left and right pointers
            s[left], s[right] = s[right], s[left]
            left += 1
            right -= 1
```

<!-- slide -->
```cpp
class Solution {
public:
    /**
     * Reverses the string in-place using two pointers.
     * 
     * Time Complexity: O(n) - each character is swapped once
     * Space Complexity: O(1) - constant extra space
     */
    void reverseString(vector<char>& s) {
        int left = 0;
        int right = s.size() - 1;
        
        while (left < right) {
            // Swap characters at left and right pointers
            swap(s[left], s[right]);
            left++;
            right--;
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    /**
     * Reverses the string in-place using two pointers.
     * 
     * Time Complexity: O(n) - each character is swapped once
     * Space Complexity: O(1) - constant extra space
     */
    public void reverseString(char[] s) {
        int left = 0;
        int right = s.length - 1;
        
        while (left < right) {
            // Swap characters at left and right pointers
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left++;
            right--;
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Reverses the string in-place using two pointers.
 * 
 * Time Complexity: O(n) - each character is swapped once
 * Space Complexity: O(1) - constant extra space
 * 
 * @param {character[]} s - List of characters to reverse (modified in-place)
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        // Swap characters at left and right pointers
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
};
```
````

### Step-by-Step Example

Let's trace through reversing `["h", "e", "l", "l", "o"]`:

```
Initial:     ["h", "e", "l", "l", "o"]
             ^                     ^
            left                  right

Step 1: Swap 'h' and 'o'
Result:  ["o", "e", "l", "l", "h"]
              ^                 ^
             left              right

Step 2: Swap 'e' and 'l'
Result:  ["o", "l", "l", "e", "h"]
                  ^     ^
                 left  right

Step 3: Pointers meet at center (left >= right)
        Single element "l" doesn't need swapping
Final:   ["o", "l", "l", "e", "h"] ✓
```

---

## Approach 2: Recursive In-Place

This approach uses recursion to reverse the string, swapping elements as the recursion unwinds.

### Algorithm Steps

1. Base case: if left >= right, return (nothing to swap)
2. Recursive case:
   - Swap s[left] and s[right]
   - Recursively call with left+1, right-1

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def reverseString(self, s: List[str]) -> None:
        """
        Reverses the string in-place using recursion.
        
        Time Complexity: O(n) - each character is visited once
        Space Complexity: O(n) - recursive call stack
        """
        def helper(left: int, right: int):
            if left >= right:
                return
            # Swap characters
            s[left], s[right] = s[right], s[left]
            # Recurse on inner substring
            helper(left + 1, right - 1)
        
        helper(0, len(s) - 1)
```

<!-- slide -->
```cpp
class Solution {
public:
    /**
     * Reverses the string in-place using recursion.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n) - recursive call stack
     */
    void reverseString(vector<char>& s) {
        helper(s, 0, s.size() - 1);
    }
    
private:
    void helper(vector<char>& s, int left, int right) {
        if (left >= right) return;
        swap(s[left], s[right]);
        helper(s, left + 1, right - 1);
    }
};
```

<!-- slide -->
```java
class Solution {
    /**
     * Reverses the string in-place using recursion.
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n) - recursive call stack
     */
    public void reverseString(char[] s) {
        helper(s, 0, s.length - 1);
    }
    
    private void helper(char[] s, int left, int right) {
        if (left >= right) return;
        char temp = s[left];
        s[left] = s[right];
        s[right] = temp;
        helper(s, left + 1, right - 1);
    }
}
```

<!-- slide -->
```javascript
/**
 * Reverses the string in-place using recursion.
 * 
 * @param {character[]} s - List of characters to reverse
 */
var reverseString = function(s) {
    const helper = (left, right) => {
        if (left >= right) return;
        [s[left], s[right]] = [s[right], s[left]];
        helper(left + 1, right - 1);
    };
    
    helper(0, s.length - 1);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each character is swapped once |
| **Space** | O(n) - recursive call stack depth |

---

## Approach 3: Built-in Functions (Not In-Place)

This approach uses language built-in functions but doesn't meet the in-place requirement.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def reverseString_builtin(self, s: List[str]) -> None:
        """
        Using Python's built-in reverse (modifies in-place).
        This is O(n) but modifies the list directly.
        """
        s.reverse()  # In-place reversal
        
        # Alternative: s[:] = s[::-1]  # Create reversed copy then assign
```

<!-- slide -->
```cpp
class Solution {
public:
    // Note: This doesn't meet in-place requirement
    // Using std::reverse for demonstration
    void reverseString(vector<char>& s) {
        std::reverse(s.begin(), s.end());
    }
};
```

<!-- slide -->
```java
class Solution {
    public void reverseString(char[] s) {
        // Using Java's Collections.reverse
        // Note: This requires converting to Character list
        int left = 0, right = s.length - 1;
        while (left < right) {
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left++;
            right--;
        }
        
        // Built-in: new StringBuilder(s).reverse().toString()
        // But this creates a new string, not in-place
    }
}
```

<!-- slide -->
```javascript
/**
 * Using built-in reverse (not in-place, creates new array)
 */
var reverseString = function(s) {
    // This modifies s in-place in JavaScript
    s.reverse();
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(n) for most implementations (or O(1) for in-place like JS/Python reverse) |

---

## Comparison of Approaches

| Aspect | Two Pointers | Recursive | Built-in |
|--------|--------------|-----------|----------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) | Varies |
| **In-Place** | ✅ Yes | ✅ Yes | ❌ Mostly No |
| **Implementation** | Simple | Moderate | Simplest |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |
| **Best For** | Interviews | Learning | Quick scripts |

**Best Approach:** The two-pointer approach (Approach 1) is optimal with O(n) time and O(1) space complexity, and is the LeetCode-preferred solution.

---

## Time and Space Complexity

### Time Complexity
- **O(n)**, where `n` is the length of the string
- Each character is swapped exactly once

### Space Complexity
- **O(1)**, constant extra space for pointers
- In-place modification of the input array

---

## Related Problems

### Pattern-Based Problems

1. **[Two Pointers - String Reversal](two-pointers-string-reversal.md)** - General pattern for string reversal
2. **[Two Pointers - Palindrome Check](two-pointers-expanding-from-center-palindromes.md)** - Check palindromes using two pointers
3. **[Two Pointers - String Comparison](two-pointers-string-comparison-with-backspaces.md)** - Handle backspaces in string comparison

### Similar LeetCode Problems

| Problem | Difficulty | Link |
|---------|------------|------|
| Reverse String II | Medium | [LeetCode 541](https://leetcode.com/problems/reverse-string-ii/) |
| Reverse Words in a String III | Easy | [LeetCode 557](https://leetcode.com/problems/reverse-words-in-a-string-iii/) |
| Reverse Vowels of a String | Easy | [LeetCode 345](https://leetcode.com/problems/reverse-vowels-of-a-string/) |
| Valid Palindrome | Easy | [LeetCode 125](https://leetcode.com/problems/valid-palindrome/) |

---

## Video Tutorials

- [NeetCode - Reverse String](https://www.youtube.com/watch?v=8nhKfk72lQQ)
- [Back to Back SWE - Reverse String](https://www.youtube.com/watch?v=n8jeyB3u6I4)
- [LeetCode Official Solution](https://www.youtube.com/watch?v=_reI98Ck6h0)
- [Two Pointers Pattern Explained](https://www.youtube.com/watch?v=1AXG3113C3I)

---

## Follow-up Questions

### Q1: How would you reverse a string without using a temporary variable?

**Answer:** Use the XOR swap algorithm (for integer/character arrays):
```python
# XOR swap (works for integers/chars)
a ^= b
b ^= a
a ^= b
```
However, this doesn't work directly in Python due to immutability of strings. In C/C++, this technique can swap two elements without a temporary variable.

---

### Q2: What if the input is a string (not char array) in Python?

**Answer:** 
- Convert to list: `s = list(s)` then reverse
- Use slicing: `s[::-1]` (creates new string)
- Use built-in `reversed()`: `''.join(reversed(s))`
- Note: Strings are immutable in Python, so you must create a new string

---

### Q3: How would you reverse only a portion of the string?

**Answer:** Use `left = start` and `right = end` instead of `0` and `len(s)-1`:
```python
def reverse_partial(s, start, end):
    while start < end:
        s[start], s[end] = s[end], s[start]
        start += 1
        end -= 1
```

---

### Q4: Can you reverse a string in-place using recursion?

**Answer:** Yes, but it uses O(n) stack space instead of O(1):
```python
def reverse_recursive(s, left, right):
    if left >= right:
        return
    s[left], s[right] = s[right], s[left]
    reverse_recursive(s, left + 1, right - 1)
```
This is still technically "in-place" for the array, but uses extra memory for the call stack.

---

### Q5: How would you handle reversing a linked list instead of an array?

**Answer:** Use the iterative approach with three pointers:
- Previous (prev) - starts as null
- Current (curr) - starts at head
- Next (next) - stores curr.next before changing it

```python
def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev
```

---

### Q6: What is the difference between reversing a string and checking for a palindrome?

**Answer:** 
- **Reverse String**: Swaps characters symmetrically from ends toward center
- **Palindrome Check**: Uses two pointers moving toward center, comparing characters at each step (no actual swapping needed)

Both use similar two-pointer technique but palindrome check doesn't modify the array.

---

### Q7: How would you reverse a string word by word (not character by character)?

**Answer:** 
1. Reverse the entire string
2. Then reverse each individual word

Example: "the sky is blue" → "blue is sky the"

```python
def reverse_words(s):
    # Reverse entire string
    s.reverse()
    
    # Reverse each word
    start = 0
    for end in range(len(s)):
        if s[end] == ' ':
            reverse(s, start, end - 1)
            start = end + 1
    # Reverse last word
    reverse(s, start, len(s) - 1)
```

---

### Q8: What edge cases should be tested?

**Answer:**
- Empty string (single character)
- Single character string
- Two characters ("ab" → "ba")
- All same characters ("aaa" → "aaa")
- Already reversed string
- Strings with special characters
- Very long strings (test performance)

---

### Q9: How would you implement this in a language that doesn't support pointer manipulation?

**Answer:** Use index-based access:
- Python: `s[i], s[j] = s[j], s[i]`
- Java: Use a temporary variable for swapping
- JavaScript: Array destructuring `[a, b] = [b, a]` or temporary variable

---

### Q10: Can you optimize for cache locality?

**Answer:** Yes! The two-pointer approach is cache-friendly because:
- Sequential memory access patterns
- Characters are stored contiguously
- Each swap operates on adjacent or nearby memory locations

For extremely large strings, consider processing in cache-sized chunks for better performance.

---

## Common Pitfalls

### 1. Using Wrong Loop Condition
**Issue:** Using `left <= right` instead of `left < right` causes double-swapping of middle element for odd-length strings.

**Solution:** Use `left < right` to ensure each pair is swapped exactly once.

### 2. Not Modifying In-Place
**Issue:** Creating a new reversed array instead of modifying input in-place.

**Solution:** Use two pointers and swap in-place to meet O(1) space requirement.

### 3. Forgetting to Handle Empty or Single Character
**Issue:** Not handling edge cases where string length is 0 or 1.

**Solution:** The algorithm naturally handles these (loop doesn't execute), but test explicitly.

### 4. Using Recursive Approach for Production
**Issue:** Using recursion when iterative approach is simpler and more efficient.

**Solution:** Use iterative two-pointer approach; recursion adds O(n) stack space.

### 5. Confusing String with Array
**Issue:** In Python, strings are immutable - cannot swap characters in place.

**Solution:** Convert string to list first: `s = list(s)`, then reverse.

---

## Summary

The **Reverse String** problem is a classic two-pointer problem that demonstrates:

- **Two Pointers Pattern**: Efficiently process from both ends
- **In-Place Modification**: O(1) space solution
- **Symmetric Swapping**: Each swap fixes two positions
- **Termination Condition**: When pointers meet or cross

Key Takeaways:
1. Time complexity is O(n) - each character visited once
2. Space complexity is O(1) - only two pointers needed
3. The two-pointer approach is the optimal solution
4. Understanding the symmetric property is key

This problem is excellent for learning the two-pointer pattern, which applies to many other string and array problems.

---

## References

- [LeetCode 344 - Reverse String](https://leetcode.com/problems/reverse-string/)
- [Two Pointers Technique - GeeksforGeeks](https://www.geeksforgeeks.org/two-pointers-technique/)
- [Pattern: Two Pointers - String Reversal](/patterns/two-pointers-string-reversal)
