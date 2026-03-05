# String - Palindrome Check (Two Pointers / Reverse)

## Problem Description

The **Palindrome Check** pattern involves determining whether a given string reads the same forwards and backwards. This is a fundamental string manipulation pattern that appears frequently in technical interviews at companies like Google, Amazon, Meta, and Apple.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Input** | A string to check for palindrome property |
| **Output** | Boolean indicating if string is a palindrome |
| **Key Insight** | Compare characters from both ends moving towards center |
| **Time Complexity** | O(n) for two pointers, O(n) for reverse and compare |
| **Space Complexity** | O(1) for two pointers, O(n) for reverse approach |

### When to Use

- **Basic palindrome validation**: Checking if a word or phrase reads the same forwards and backwards
- **Valid palindrome problems**: When you need to ignore non-alphanumeric characters and case
- **Almost palindrome**: Checking if string can become palindrome by removing at most one character
- **String preprocessing**: As a step in more complex string algorithms

---

## Intuition

The core insights behind palindrome checking:

1. **Symmetry Property**: A palindrome has a line of symmetry. Characters at symmetric positions from the center must be equal.

2. **Two Pointers Convergence**: By placing one pointer at the start and one at the end, moving them towards each other while comparing characters, we can verify the palindrome property in O(n) time with O(1) space.

3. **Reverse and Compare**: A string is a palindrome if it equals its reverse. This is the most intuitive approach but requires O(n) space.

4. **Character Filtering**: Real-world palindrome problems often require preprocessing: converting to lowercase and removing non-alphanumeric characters before checking.

---

## Solution Approaches

### Approach 1: Two Pointers (Optimal)

The two-pointer approach achieves O(n) time and O(1) space by comparing characters from both ends.

#### Algorithm

1. Initialize left pointer at index 0, right pointer at index n-1
2. While left < right:
   - Skip non-alphanumeric characters at left (increment left)
   - Skip non-alphanumeric characters at right (decrement right)
   - Compare characters at left and right (case-insensitive)
   - If mismatch, return false
   - Increment left, decrement right
3. Return true if all comparisons matched

#### Implementation

````carousel
```python
def is_palindrome_two_pointers(s: str) -> bool:
    """
    Check if string is palindrome using two pointers.
    Time: O(n), Space: O(1)
    """
    left, right = 0, len(s) - 1
    
    while left < right:
        # Skip non-alphanumeric characters
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        # Compare characters (case-insensitive)
        if left < right:
            if s[left].lower() != s[right].lower():
                return False
            left += 1
            right -= 1
    
    return True
```
<!-- slide -->
```cpp
bool isPalindrome(const std::string& s) {
    int left = 0, right = s.length() - 1;
    
    while (left < right) {
        while (left < right && !std::isalnum(s[left])) left++;
        while (left < right && !std::isalnum(s[right])) right--;
        
        if (left < right) {
            if (std::tolower(s[left]) != std::tolower(s[right]))
                return false;
            left++;
            right--;
        }
    }
    return true;
}
```
<!-- slide -->
```java
public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    
    while (left < right) {
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
        
        if (left < right) {
            if (Character.toLowerCase(s.charAt(left)) != 
                Character.toLowerCase(s.charAt(right)))
                return false;
            left++;
            right--;
        }
    }
    return true;
}
```
<!-- slide -->
```javascript
function isPalindrome(s) {
    let left = 0, right = s.length - 1;
    
    while (left < right) {
        while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;
        while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;
        
        if (left < right) {
            if (s[left].toLowerCase() !== s[right].toLowerCase())
                return false;
            left++;
            right--;
        }
    }
    return true;
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through string |
| **Space** | O(1) - Only two pointers used |

---

### Approach 2: Reverse and Compare

Filter and reverse the string, then compare with original.

#### Algorithm

1. Filter string to keep only alphanumeric characters
2. Convert to lowercase
3. Reverse the filtered string
4. Compare filtered string with its reverse

#### Implementation

````carousel
```python
def is_palindrome_reverse(s: str) -> bool:
    """
    Check palindrome by filtering and reversing.
    Time: O(n), Space: O(n)
    """
    filtered = ''.join(c.lower() for c in s if c.isalnum())
    return filtered == filtered[::-1]
```
<!-- slide -->
```cpp
bool isPalindrome(const std::string& s) {
    std::string filtered;
    for (char c : s) {
        if (std::isalnum(c))
            filtered += std::tolower(c);
    }
    std::string reversed = filtered;
    std::reverse(reversed.begin(), reversed.end());
    return filtered == reversed;
}
```
<!-- slide -->
```java
public boolean isPalindrome(String s) {
    StringBuilder filtered = new StringBuilder();
    for (char c : s.toCharArray()) {
        if (Character.isLetterOrDigit(c))
            filtered.append(Character.toLowerCase(c));
    }
    return filtered.toString().equals(
        filtered.reverse().toString());
}
```
<!-- slide -->
```javascript
function isPalindrome(s) {
    const filtered = s.toLowerCase()
                      .split('')
                      .filter(c => /[a-z0-9]/.test(c))
                      .join('');
    const reversed = filtered.split('').reverse().join('');
    return filtered === reversed;
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Filter and reverse operations |
| **Space** | O(n) - For filtered and reversed strings |

---

### Approach 3: Valid Palindrome II (Almost Palindrome)

Check if string can become palindrome by removing at most one character.

#### Algorithm

1. Use two pointers from both ends
2. When characters don't match, try skipping either left or right character
3. Check if remaining substring is palindrome
4. Return true if either option works

#### Implementation

````carousel
```python
def valid_palindrome_ii(s: str) -> bool:
    """
    Check if s can be palindrome by removing at most one char.
    """
    def is_palindrome_range(left: int, right: int) -> bool:
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True
    
    left, right = 0, len(s) - 1
    
    while left < right:
        if s[left] != s[right]:
            # Try removing left or right character
            return (is_palindrome_range(left + 1, right) or
                   is_palindrome_range(left, right - 1))
        left += 1
        right -= 1
    
    return True
```
<!-- slide -->
```cpp
class Solution {
    bool isPalindromeRange(const string& s, int left, int right) {
        while (left < right) {
            if (s[left] != s[right]) return false;
            left++; right--;
        }
        return true;
    }
    
public:
    bool validPalindrome(string s) {
        int left = 0, right = s.length() - 1;
        
        while (left < right) {
            if (s[left] != s[right]) {
                return isPalindromeRange(s, left + 1, right) ||
                       isPalindromeRange(s, left, right - 1);
            }
            left++; right--;
        }
        return true;
    }
};
```
<!-- slide -->
```java
class Solution {
    private boolean isPalindromeRange(String s, int left, int right) {
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++; right--;
        }
        return true;
    }
    
    public boolean validPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return isPalindromeRange(s, left + 1, right) ||
                       isPalindromeRange(s, left, right - 1);
            }
            left++; right--;
        }
        return true;
    }
}
```
<!-- slide -->
```javascript
function validPalindrome(s) {
    const isPalindromeRange = (left, right) => {
        while (left < right) {
            if (s[left] !== s[right]) return false;
            left++; right--;
        }
        return true;
    };
    
    let left = 0, right = s.length - 1;
    
    while (left < right) {
        if (s[left] !== s[right]) {
            return isPalindromeRange(left + 1, right) ||
                   isPalindromeRange(left, right - 1);
        }
        left++; right--;
    }
    return true;
}
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| **Two Pointers** | O(n) | O(1) | **Optimal** - General use |
| **Reverse & Compare** | O(n) | O(n) | When simplicity is preferred |
| **Valid Palindrome II** | O(n) | O(1) | Almost palindrome problems |

---

## Related Problems

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Valid Palindrome | [Link](https://leetcode.com/problems/valid-palindrome/) | Check with alphanumeric filtering |
| Palindrome Number | [Link](https://leetcode.com/problems/palindrome-number/) | Check if integer is palindrome |
| Reverse String | [Link](https://leetcode.com/problems/reverse-string/) | Basic string reversal |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Valid Palindrome II | [Link](https://leetcode.com/problems/valid-palindrome-ii/) | Remove at most one character |
| Palindrome Linked List | [Link](https://leetcode.com/problems/palindrome-linked-list/) | Check linked list palindrome |
| Longest Palindromic Substring | [Link](https://leetcode.com/problems/longest-palindromic-substring/) | Find longest palindrome |

---

## Video Tutorial Links

1. [NeetCode - Valid Palindrome](https://www.youtube.com/watch?v=jj_1q64YUOw) - Two pointers explained
2. [Valid Palindrome II - Algorithm](https://www.youtube.com/watch?v=JrxRYBwG6EU) - Almost palindrome technique
3. [Two Pointers for Palindromes](https://www.youtube.com/watch?v=9Ky73-gW_Yk) - Comprehensive review

---

## Summary

### Key Takeaways

1. **Two Pointers is Optimal**: For standard palindrome checks, two pointers provides O(n) time with O(1) space, making it the preferred approach.

2. **Filter First**: Most real-world palindrome problems require preprocessing to handle case and non-alphanumeric characters.

3. **Valid Palindrome II**: When allowed to remove one character, the key is to try both options when a mismatch is found.

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Not handling case sensitivity** | Always convert to consistent case |
| **Forgetting edge cases** | Empty string and single char are palindromes |
| **Infinite loops with while** | Ensure pointers always move towards center |
| **Integer overflow** | For number palindromes, use string conversion |

### Follow-up Questions

**Q1: How do you check palindrome for a linked list?**

Find middle using fast/slow pointers, reverse second half, then compare.

**Q2: What's the longest palindromic substring?**

Use expanding from center or dynamic programming approaches.

**Q3: How to handle Unicode characters?**

Normalize using Unicode normalization, then apply standard approach.

---

## Pattern Source

For more string pattern implementations, see:
- **[Two Pointers - Expanding From Center](/patterns/two-pointers-expanding-from-center-palindromes)**
- **[String - Anagram Check](/patterns/string-anagram-check)**
