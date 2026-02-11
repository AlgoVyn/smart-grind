# Reverse String

## Problem Description

Write a function that reverses a string. The input string is given as an array of characters `s`.

You must do this by modifying the input array in-place with O(1) extra memory.

### Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `s = ["h","e","l","l","o"]` | `["o","l","l","e","h"]` |

**Example 2:**

| Input | Output |
|-------|--------|
| `s = ["H","a","n","n","a","h"]` | `["h","a","n","n","a","H"]` |

### Constraints

- `1 <= s.length <= 10^5`
- `s[i]` is a printable ASCII character.

---

## Solution

### Approach: Two Pointers ⭐

Use two pointers starting at the beginning and end of the array, swapping characters and moving toward the center until the entire string is reversed.

### Algorithm

1. Initialize `left = 0` and `right = len(s) - 1`
2. While `left < right`:
   - Swap `s[left]` and `s[right]`
   - Increment `left` by 1
   - Decrement `right` by 1

### Code

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

---

## Explanation

### Intuition

The key insight is that reversing a string is equivalent to swapping symmetric pairs of characters. For a string of length `n`, the character at position `i` should be swapped with the character at position `n-1-i`.

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

### Why This Works

1. **Symmetric Pairing**: Each swap corrects two character positions simultaneously
2. **Termination**: Loop ends when `left >= right`, ensuring all pairs are swapped
3. **Efficiency**: Each character is visited exactly once

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

---

## Follow-up Questions

1. **How would you reverse a string without using a temporary variable?**
   - Use XOR swap: `a ^= b; b ^= a; a ^= b;`

2. **What if the input is a string (not char array) in Python?**
   - Convert to list: `s = list(s)` then reverse, or use slicing: `s[::-1]`

3. **How would you reverse only a portion of the string?**
   - Use `left = start` and `right = end` instead of `0` and `len(s)-1`

4. **Can you reverse a string in-place using recursion?**
   - Yes, but it uses O(n) stack space instead of O(1)

---

## References

- [LeetCode 344 - Reverse String](https://leetcode.com/problems/reverse-string/)
- [Two Pointers Technique - GeeksforGeeks](https://www.geeksforgeeks.org/two-pointers-technique/)
