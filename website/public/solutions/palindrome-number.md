# Palindrome Number

## Problem Description

Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.

An integer is a palindrome when it reads the same forward and backward. For example, `121` is a palindrome because reversing its digits gives `121` again. However, `-121` is not a palindrome because reversing it gives `121-`, which is different from the original.

---

## Examples

**Example 1:**

**Input:** `x = 121`
**Output:** `true`
**Explanation:** 121 reads as 121 from left to right and from right to left.

**Example 2:**

**Input:** `x = -121`
**Output:** `false`
**Explanation:** From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.

**Example 3:**

**Input:** `x = 10`
**Output:** `false`
**Explanation:** Reads 01 from right to left. Therefore it is not a palindrome.

---

## Constraints

- `-2^31 <= x <= 2^31 - 1`

---

## Intuition

To determine if a number is a palindrome, we can think about it in a few ways:
1. **String representation**: If we convert the number to a string, we can simply check if the string is equal to its reverse.
2. **Mathematical reversal**: We can reverse the digits of the number mathematically and compare the result with the original number.
3. **Optimized mathematical reversal**: We only need to reverse half of the digits. If the first half of the number is equal to the reversed second half, then the number is a palindrome.

> [!NOTE]
> Negative numbers are never palindromes because of the leading minus sign.
> Numbers ending in 0 (except 0 itself) are never palindromes because they would have a leading 0 when reversed.

---

## Approach 1: String Conversion

The most straightforward way is to convert the integer to a string and use the standard string palindrome check.

### Implementation

````carousel
```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0:
            return False
        s = str(x)
        return s == s[::-1]
```
<!-- slide -->
```java
class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0) return false;
        String s = String.valueOf(x);
        String reversed = new StringBuilder(s).reverse().toString();
        return s.equals(reversed);
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    if (x < 0) return false;
    const s = x.toString();
    return s === s.split('').reverse().join('');
};
```
<!-- slide -->
```cpp
class Solution {
public:
    bool isPalindrome(int x) {
        if (x < 0) return false;
        string s = to_string(x);
        string r = s;
        reverse(r.begin(), r.end());
        return s == r;
    }
};
```
````

### Complexity Analysis

- **Time Complexity:** O(n), where n is the number of digits in `x`.
- **Space Complexity:** O(n) to store the string representation.

---

## Approach 2: Reversing the Entire Number

We can reverse the digits of the integer mathematically. However, we must be careful about integer overflow when reversing the entire number (though LeetCode's environment often handles this, it's good practice to consider it).

### Implementation

````carousel
```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0 or (x != 0 and x % 10 == 0):
            return False
        
        original = x
        reversed_num = 0
        while x > 0:
            reversed_num = reversed_num * 10 + (x % 10)
            x //= 10
            
        return original == reversed_num
```
<!-- slide -->
```java
class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0 || (x != 0 && x % 10 == 0)) return false;
        
        int original = x;
        long reversed = 0; // Use long to prevent overflow
        while (x > 0) {
            reversed = reversed * 10 + (x % 10);
            x /= 10;
        }
        
        return original == (int)reversed;
    }
}
```
<!-- slide -->
```javascript
var isPalindrome = function(x) {
    if (x < 0 || (x !== 0 && x % 10 === 0)) return false;
    
    let original = x;
    let reversed = 0;
    while (x > 0) {
        reversed = reversed * 10 + (x % 10);
        x = Math.floor(x / 10);
    }
    
    return original === reversed;
};
```
````

### Complexity Analysis

- **Time Complexity:** O(log₁₀ n), which is proportional to the number of digits.
- **Space Complexity:** O(1).

---

## Approach 3: Reversing Half the Number (Optimal)

To avoid potential overflow and improve efficiency slightly, we can reverse only the second half of the number. If the number is a palindrome, the first half should be equal to the reversed second half.

### Implementation

````carousel
```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        # Special cases:
        # Negative numbers are not palindromes
        # Numbers ending in 0 (except 0 itself) are not palindromes
        if x < 0 or (x % 10 == 0 and x != 0):
            return False
            
        reversed_half = 0
        while x > reversed_half:
            reversed_half = reversed_half * 10 + (x % 10)
            x //= 10
            
        # When digits are odd, we can get rid of the middle digit by reversed_half // 10
        return x == reversed_half or x == reversed_half // 10
```
<!-- slide -->
```java
class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;
        
        int reversedHalf = 0;
        while (x > reversedHalf) {
            reversedHalf = reversedHalf * 10 + (x % 10);
            x /= 10;
        }
        
        return x == reversedHalf || x == reversedHalf / 10;
    }
}
```
<!-- slide -->
```javascript
var isPalindrome = function(x) {
    if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
    
    let reversedHalf = 0;
    while (x > reversedHalf) {
        reversedHalf = reversedHalf * 10 + (x % 10);
        x = Math.floor(x / 10);
    }
    
    return x === reversedHalf || x === Math.floor(reversedHalf / 10);
};
```
````

### Complexity Analysis

- **Time Complexity:** O(log₁₀ n).
- **Space Complexity:** O(1).

---

## Related Problems

1. **[Palindrome Linked List](/solutions/palindrome-linked-list.md)**
2. **[Valid Palindrome](/solutions/valid-palindrome.md)**
3. **[Longest Palindromic Substring](/solutions/longest-palindromic-substring.md)**

---

## Video Tutorial Links

1. [NeetCode - Palindrome Number](https://youtu.be/yubRKwCPyAk)
2. [BackToBack SWE - Palindrome Number](https://youtu.be/HSK2C3RqM6w)

---

## Followup Questions

1. **How would you solve this for a string that contains spaces and punctuation?**
   - You would first clean the string (remove non-alphanumeric characters and convert to lower case) and then use the two-pointer approach.
2. **What is the significance of the `x > reversed_half` condition?**
   - It ensures we only process half of the digits. Once `x` becomes smaller than or equal to `reversed_half`, we know we've reached the middle.
3. **How do you handle odd-length numbers in the half-reversal approach?**
   - By using `x == reversed_half // 10`, which effectively ignores the middle digit (as it doesn't matter for palindrome property).

---

## LeetCode Link
[Palindrome Number - LeetCode](https://leetcode.com/problems/palindrome-number/)
