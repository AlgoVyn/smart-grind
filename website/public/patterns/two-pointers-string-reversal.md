# Two Pointers - String Reversal

## Overview

The **Two Pointers - String Reversal** pattern is a fundamental technique for reversing strings or character arrays in-place. It uses two pointers starting from opposite ends of the string, swapping characters and moving toward the center until the entire string is reversed.

This pattern is essential for:
- **In-place string manipulation** without additional memory
- **Palindrome checking** problems
- **String reconstruction** tasks
- **Substring reversal** within larger strings

---

## Key Concepts

### Core Components

| Concept | Description |
|---------|-------------|
| **Swap Operation** | Exchange characters at left and right pointers |
| **Pointer Convergence** | Move pointers toward each other until they meet |
| **In-place Modification** | Reverse the string without using additional space |
| **Substring Reversal** | Adapt the pattern to reverse specific character ranges |

### Why Two Pointers for String Reversal?

1. **Efficiency**: O(n) time complexity - each character is visited exactly once
2. **Space Optimization**: O(1) space - no additional data structures needed
3. **Simplicity**: Straightforward implementation with minimal logic
4. **Versatility**: Can be adapted for substrings, palindromes, and other string operations

---

## Intuition

The two-pointer string reversal leverages a simple mathematical insight: **reversing a sequence is equivalent to swapping symmetric pairs of elements**.

```
Original:  [H, e, l, l, o]
Indices:    0  1  2  3  4

Step 1: Swap index 0 and 4
        [o, e, l, l, H]

Step 2: Swap index 1 and 3
        [o, l, l, e, H]

Step 3: Pointers meet at center - done!
        [o, l, l, e, h]
```

### Key Observations

1. **Symmetric Pairing**: The character at position `i` pairs with position `n-1-i`
2. **Termination Condition**: Continue until `left >= right`
3. **Center Element**: Single characters (odd length) don't need swapping

---

## Approaches

### Approach 1: Basic String Reversal ⭐

The simplest form of the pattern, reversing an entire character array.

#### Algorithm
1. Initialize `left = 0` and `right = len(s) - 1`
2. While `left < right`:
   - Swap `s[left]` and `s[right]`
   - Increment `left` by 1
   - Decrement `right` by 1

#### Code Templates

````carousel
```python
from typing import List

class Solution:
    def reverseString(self, s: List[str]) -> None:
        """
        Reverses the string in-place using two pointers.
        
        Args:
            s: List of characters to reverse (modified in-place)
        """
        left, right = 0, len(s) - 1
        
        while left < right:
            # Swap characters
            s[left], s[right] = s[right], s[left]
            left += 1
            right -= 1
```
<!-- slide -->
```cpp
class Solution {
public:
    void reverseString(vector<char>& s) {
        int left = 0;
        int right = s.size() - 1;
        
        while (left < right) {
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
    public void reverseString(char[] s) {
        int left = 0;
        int right = s.length - 1;
        
        while (left < right) {
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
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
};
```
````

#### Time Complexity
- **O(n)**, where n is the string length
- Each character is swapped exactly once

#### Space Complexity
- **O(1)**, constant extra space for pointers

---

### Approach 2: Substring Reversal

Reverses a specific portion of the string (from `start` to `end` indices).

#### Algorithm
1. Initialize `left = start` and `right = end`
2. While `left < right`:
   - Swap `s[left]` and `s[right]`
   - Increment `left` by 1
   - Decrement `right` by 1

#### Code Templates

````carousel
```python
from typing import List

class Solution:
    def reverse_substring(self, s: List[str], start: int, end: int) -> None:
        """
        Reverses the substring from start to end (inclusive) in-place.
        
        Args:
            s: List of characters
            start: Starting index (inclusive)
            end: Ending index (inclusive)
        """
        left, right = start, end
        
        while left < right:
            s[left], s[right] = s[right], s[left]
            left += 1
            right -= 1
```
<!-- slide -->
```cpp
class Solution {
public:
    void reverseSubstring(string& s, int start, int end) {
        int left = start;
        int right = end;
        
        while (left < right) {
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
    public void reverseSubstring(char[] s, int start, int end) {
        int left = start;
        int right = end;
        
        while (left < right) {
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
 * @param {character[]} s
 * @param {number} start
 * @param {number} end
 * @return {void}
 */
var reverseSubstring = function(s, start, end) {
    let left = start;
    let right = end;
    
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
};
```
````

#### Use Cases
- Implementing "Reverse Words in a String II"
- Partial string reconstructions
- Rotating string segments

---

### Approach 3: Recursive Reversal

A recursive approach that naturally follows the two-pointer logic.

#### Algorithm
1. Base case: if `left >= right`, return
2. Swap `s[left]` and `s[right]`
3. Recursive call with `left + 1` and `right - 1`

#### Code Templates

````carousel
```python
from typing import List

class Solution:
    def reverseStringRecursive(self, s: List[str], left: int = 0, right: int = None) -> None:
        """
        Recursively reverses the string in-place.
        
        Args:
            s: List of characters to reverse
            left: Left pointer (default 0)
            right: Right pointer (default len-1)
        """
        if right is None:
            right = len(s) - 1
        
        if left >= right:
            return
        
        s[left], s[right] = s[right], s[left]
        self.reverseStringRecursive(s, left + 1, right - 1)
```
<!-- slide -->
```cpp
class Solution {
public:
    void reverseStringRecursive(string& s, int left = 0, int right = -1) {
        if (right == -1) right = s.length() - 1;
        
        if (left >= right) return;
        
        swap(s[left], s[right]);
        reverseStringRecursive(s, left + 1, right - 1);
    }
};
```
<!-- slide -->
```java
class Solution {
    public void reverseStringRecursive(char[] s) {
        reverseStringRecursive(s, 0, s.length - 1);
    }
    
    private void reverseStringRecursive(char[] s, int left, int right) {
        if (left >= right) return;
        
        char temp = s[left];
        s[left] = s[right];
        s[right] = temp;
        
        reverseStringRecursive(s, left + 1, right - 1);
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {character[]} s
 * @param {number} left
 * @param {number} right
 */
var reverseStringRecursive = function(s, left = 0, right = null) {
    if (right === null) right = s.length - 1;
    
    if (left >= right) return;
    
    [s[left], s[right]] = [s[right], s[left]];
    reverseStringRecursive(s, left + 1, right - 1);
};
```
````

#### Time Complexity
- **O(n)**, each element processed once

#### Space Complexity
- **O(n)** due to recursion stack

---

### Approach 4: Reversing with Step Size

Reverses the string in chunks of size `k` (used in "Reverse String II" problems).

#### Algorithm
1. Iterate through the string in chunks of `k`
2. For each chunk, reverse the first `min(k, remaining)` characters
3. Move to the next chunk

#### Code Templates

````carousel
```python
from typing import List

class Solution:
    def reverse_str(self, s: List[str], k: int) -> None:
        """
        Reverses each chunk of k characters in the string.
        
        Args:
            s: List of characters to modify in-place
            k: Chunk size for reversal
        """
        n = len(s)
        i = 0
        
        while i < n:
            # Reverse the first k characters (or remaining if less)
            left = i
            right = min(i + k - 1, n - 1)
            
            while left < right:
                s[left], s[right] = s[right], s[left]
                left += 1
                right -= 1
            
            # Move to next chunk (skip k characters)
            i += k
```
<!-- slide -->
```cpp
class Solution {
public:
    void reverseStr(string& s, int k) {
        int n = s.size();
        for (int i = 0; i < n; i += 2 * k) {
            int left = i;
            int right = min(i + k - 1, n - 1);
            
            while (left < right) {
                swap(s[left], s[right]);
                left++;
                right--;
            }
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public void reverseStr(char[] s, int k) {
        int n = s.length;
        
        for (int i = 0; i < n; i += 2 * k) {
            int left = i;
            int right = Math.min(i + k - 1, n - 1);
            
            while (left < right) {
                char temp = s[left];
                s[left] = s[right];
                s[right] = temp;
                left++;
                right--;
            }
        }
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {character[]} s
 * @param {number} k
 * @return {void}
 */
var reverseStr = function(s, k) {
    const n = s.length;
    
    for (let i = 0; i < n; i += 2 * k) {
        let left = i;
        let right = Math.min(i + k - 1, n - 1);
        
        while (left < right) {
            [s[left], s[right]] = [s[right], s[left]];
            left++;
            right--;
        }
    }
};
```
````

---

## Step-by-Step Example

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

## Time Complexity Comparison

| Approach | Time Complexity | Space Complexity | Best For |
|----------|-----------------|------------------|----------|
| Basic Reversal | O(n) | O(1) | Simple string reversal |
| Substring Reversal | O(n) | O(1) | Partial reversals |
| Recursive | O(n) | O(n) | Educational purposes |
| Step Size | O(n) | O(1) | Chunk-based operations |

---

## Common Pitfalls

1. **Immutable Strings**: Remember strings are immutable in many languages - convert to list/char array first
2. **Pointer Crossing**: Ensure termination condition is `left < right`, not `<=`
3. **Empty/Single Character**: Handle edge cases (empty string, single char) - no swaps needed
4. **Index Out of Bounds**: Always validate indices when reversing substrings
5. **Unicode/UTF-8**: Basic two-pointer works for single-byte characters; may need adjustment for multi-byte

---

## Related Problems

### LeetCode Problems

| Problem | Difficulty | Description | Link |
|---------|------------|-------------|------|
| Reverse String | Easy | Basic in-place reversal | [LeetCode 344](https://leetcode.com/problems/reverse-string/) |
| Reverse String II | Medium | Reverse in chunks of k | [LeetCode 541](https://leetcode.com/problems/reverse-string-ii/) |
| Reverse Words in a String III | Easy | Reverse each word individually | [LeetCode 557](https://leetcode.com/problems/reverse-words-in-a-string-iii/) |
| Reverse Vowels of a String | Easy | Reverse only vowels | [LeetCode 345](https://leetcode.com/problems/reverse-vowels-of-a-string/) |
| Valid Palindrome | Easy | Check palindrome with two pointers | [LeetCode 125](https://leetcode.com/problems/valid-palindrome/) |
| Palindrome Linked List | Easy | Check palindrome in linked list | [LeetCode 234](https://leetcode.com/problems/palindrome-linked-list/) |

### Pattern Variations

- **[Palindrome Check](two-pointers-expanding-from-center-palindromes.md)** - Expanding from center
- **[String Comparison with Backspaces](two-pointers-string-comparison-with-backspaces.md)** - Handling deletions
- **[Converging Sorted Array](two-pointers-converging-sorted-array-target-sum.md)** - Two pointers for sum problems
- **[In-place Array Modification](two-pointers-in-place-array-modification.md)** - Array manipulation patterns

---

## Video Tutorials

- [NeetCode - Reverse String](https://www.youtube.com/watch?v=8nhKfk72lQQ)
- [NeetCode - Reverse String II](https://www.youtube.com/watch?v=J7mLbbzL92c)
- [Back to Back SWE - Two Pointers Technique](https://www.youtube.com/watch?v=KshM4gFwdX8)
- [Abdul Bari - Two Pointers Technique](https://www.youtube.com/watch?v=Hoix4LQ92u0)

---

## Follow-up Questions

1. **How would you reverse a string without using extra space in a language with immutable strings?**
   - Convert to char array, perform reversal, convert back

2. **How do you handle reversal in languages with different character encodings?**
   - Consider Unicode code points instead of byte indices

3. **What if you need to reverse only alphanumeric characters while preserving others?**
   - Add validation checks in the swap condition

4. **How would you reverse a string in-place using bitwise operations?**
   - Use XOR swap: `a ^= b; b ^= a; a ^= b;`

5. **Can you reverse a string in-place without using temporary variables?**
   - Yes, using XOR swap or arithmetic operations

---

## References

- [LeetCode - Reverse String](https://leetcode.com/problems/reverse-string/)
- [Two Pointers Technique - GeeksforGeeks](https://www.geeksforgeeks.org/two-pointers-technique/)
