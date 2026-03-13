# Shortest Palindrome

## Problem Description

You are given a string `s`. You can flip any character at any position. You need to make `s` a palindrome by adding characters to the front of the string. Return the shortest palindrome you can find.

A palindrome is a string that reads the same forward and backward.

**Link to problem:** [Shortest Palindrome - LeetCode 214](https://leetcode.com/problems/shortest-palindrome/)

---

## Pattern: KMP (Longest Prefix Suffix)

KMP (Longest Prefix Suffix)

This problem uses **KMP Algorithm** to find longest palindromic prefix. Build s + '#' + rev(s), compute LPS array.

---

## Intuition

The key insight for this problem is transforming the palindrome problem into a pattern matching problem using the KMP (Knuth-Morris-Pratt) algorithm.

### Key Observations

1. **Longest Palindromic Prefix**: We need to find how much of the string is already a palindrome from the start. This tells us what portion doesn't need to be modified.

2. **KMP Application**: By combining the string with its reverse using a separator character, we can use KMP's LPS (Longest Prefix Suffix) array to find the longest palindromic prefix efficiently.

3. **Minimum Characters to Add**: Once we know the longest palindromic prefix, we only need to add the reverse of the remaining non-palindromic suffix to create a palindrome.

### Why KMP Works

- The combined string `s + '#' + reverse(s)` allows us to find matching prefix-suffix
- The LPS array gives us the length of the longest prefix that is also a suffix
- This length represents the longest palindromic prefix of the original string

### Algorithm Overview

1. Reverse the string
2. Combine with separator: `s + '#' + reverse(s)`
3. Compute LPS array using KMP
4. LPS[-1] gives the longest palindromic prefix length
5. Add reverse of non-palindromic part to front

---

## Common Pitfalls

- **Separator**: Use '#' (or any non-letter) to separate s from rev(s)
- **LPS usage**: lps[-1] gives length of longest palindromic prefix
- **Reversed substring**: Add rev(s)[0:n-lps[-1]] to front

---

## Problem Description

You are given a string `s`. You can convert `s` to a palindrome by adding characters in front of it. Return the shortest palindrome you can find by performing this transformation.

## Examples

**Example 1:**
- Input: `s = "aacecaaa"`
- Output: `"aaacecaaa"`

**Example 2:**
- Input: `s = "abcd"`
- Output: `"dcbabcd"`

## Constraints

- `0 <= s.length <= 5 * 10^4`
- `s` consists of lowercase English letters only.

---

## Solution Overview

This problem requires making the shortest palindrome by adding characters in front of the string. The key insight is to find the longest palindromic prefix in the string, which tells us how much of the string is already a palindrome from the start. We then reverse the remaining suffix and prepend it to the original string.

## Multiple Approaches with Code

We'll cover two approaches:

1. **KMP Algorithm (Optimal)** - O(n) time using LPS array
2. **Two Pointers with Recursion** - O(n²) time using recursive approach

---

## Approach 1: KMP (Knuth-Morris-Pratt) Algorithm (Optimal)

Use KMP algorithm to find the longest prefix of `s` that is also a suffix when combined with the reverse of `s`. This is an efficient O(n) solution compared to brute force approaches.

---

## Algorithm Steps

1. **Reverse**: Get the reverse of `s` - `rev_s = s[::-1]`
2. **Temp String**: Create `s + '#' + rev_s` - the '#' is a separator character
3. **Prefix Table (LPS)**: Compute KMP prefix table (LPS array) for the temp string
4. **Longest Prefix**: `lps[-1]` gives the length of the longest prefix that matches a suffix
5. **Calculate Characters to Add**: The non-palindromic part is `s[lps[-1]:]`, reversed it becomes what we need to add
6. **Return**: Concatenate reversed non-palindromic part + original string

---

## Implementation

````carousel
```python
class Solution:
    def shortestPalindrome(self, s: str) -> str:
        """
        Find the shortest palindrome by adding characters in front of s.
        
        Uses KMP (Knuth-Morris-Pratt) algorithm to find the longest
        palindromic prefix in O(n) time.
        
        Time: O(n)
        Space: O(n)
        """
        if not s:
            return s
        
        # Step 1: Create the reverse of the string
        rev_s = s[::-1]
        
        # Step 2: Create combined string with separator
        # The separator ensures we match prefix of s with suffix of rev_s
        temp = s + '#' + rev_s
        
        # Step 3: Compute KMP prefix (LPS) table
        lps = [0] * len(temp)
        
        for i in range(1, len(temp)):
            j = lps[i - 1]
            
            # Fall back to previous longest proper prefix
            while j > 0 and temp[i] != temp[j]:
                j = lps[j - 1]
            
            # Extend the match if characters match
            if temp[i] == temp[j]:
                j += 1
            
            lps[i] = j
        
        # Step 4: Get the length of longest palindromic prefix
        longest = lps[-1]
        
        # Step 5: Characters to add = reverse of s[longest:]
        to_add = rev_s[:len(s) - longest]
        
        # Step 6: Return the shortest palindrome
        return to_add + s


# Alternative: Manual KMP implementation for clarity
def compute_lps(pattern: str) -> list[int]:
    """
    Compute the LPS (Longest Prefix Suffix) array for KMP.
    
    lps[i] = length of longest proper prefix that is also suffix
    for pattern[0:i+1]
    """
    m = len(pattern)
    lps = [0] * m
    length = 0  # length of previous longest prefix suffix
    
    i = 1
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    
    return lps


class SolutionKMP:
    def shortestPalindrome(self, s: str) -> str:
        """Using separate KMP function for clarity."""
        if not s:
            return s
        
        rev_s = s[::-1]
        temp = s + '#' + rev_s
        lps = compute_lps(temp)
        
        longest = lps[-1]
        to_add = rev_s[:len(s) - longest]
        
        return to_add + s


# Example usage
if __name__ == "__main__":
    sol = Solution()
    
    # Test cases
    print(sol.shortestPalindrome("aacecaaa"))  # "aaacecaaa"
    print(sol.shortestPalindrome("abcd"))       # "dcbabcd"
    print(sol.shortestPalindrome("a"))          # "a"
    print(sol.shortestPalindrome(""))           # ""
    
    # Additional test
    print(sol.shortestPalindrome("abcabc"))    # "abcabc" (already palindrome)
```
<!-- slide -->
```cpp
class Solution {
public:
    string shortestPalindrome(string s) {
        if (s.empty()) return s;
        
        // Step 1: Reverse the string
        string rev_s = s;
        reverse(rev_s.begin(), rev_s.end());
        
        // Step 2: Create combined string with separator
        string temp = s + "#" + rev_s;
        
        // Step 3: Compute KMP prefix (LPS) table
        vector<int> lps(temp.size(), 0);
        
        for (int i = 1; i < temp.size(); i++) {
            int j = lps[i - 1];
            
            while (j > 0 && temp[i] != temp[j]) {
                j = lps[j - 1];
            }
            
            if (temp[i] == temp[j]) {
                j++;
            }
            
            lps[i] = j;
        }
        
        // Step 4: Get longest palindromic prefix
        int longest = lps.back();
        
        // Step 5: Characters to add
        string to_add = rev_s.substr(0, s.size() - longest);
        
        // Step 6: Return shortest palindrome
        return to_add + s;
    }
};


// Alternative with separate KMP function
vector<int> computeLPS(const string& pattern) {
    int m = pattern.size();
    vector<int> lps(m, 0);
    int length = 0;
    
    for (int i = 1; i < m; i++) {
        if (pattern[i] == pattern[length]) {
            length++;
            lps[i] = length;
        } else {
            if (length != 0) {
                length = lps[length - 1];
                i--;  // Retry with new length
            } else {
                lps[i] = 0;
            }
        }
    }
    
    return lPS;
}

class SolutionAlt {
public:
    string shortestPalindrome(string s) {
        if (s.empty()) return s;
        
        string rev_s = s;
        reverse(rev_s.begin(), rev_s.end());
        string temp = s + "#" + rev_s;
        
        vector<int> lps = computeLPS(temp);
        int longest = lps.back();
        
        string to_add = rev_s.substr(0, s.size() - longest);
        return to_add + s;
    }
};


// Example usage
int main() {
    Solution sol;
    
    cout << sol.shortestPalindrome("aacecaaa") << endl;  // "aaacecaaa"
    cout << sol.shortestPalindrome("abcd") << endl;       // "dcbabcd"
    cout << sol.shortestPalindrome("a") << endl;         // "a"
    
    return 0;
}
```
<!-- slide -->
```java
class Solution {
    public String shortestPalindrome(String s) {
        if (s == null || s.isEmpty()) {
            return s;
        }
        
        // Step 1: Reverse the string
        String rev_s = new StringBuilder(s).reverse().toString();
        
        // Step 2: Create combined string with separator
        String temp = s + "#" + rev_s;
        
        // Step 3: Compute KMP prefix (LPS) table
        int[] lps = new int[temp.length()];
        
        for (int i = 1; i < temp.length(); i++) {
            int j = lps[i - 1];
            
            while (j > 0 && temp.charAt(i) != temp.charAt(j)) {
                j = lps[j - 1];
            }
            
            if (temp.charAt(i) == temp.charAt(j)) {
                j++;
            }
            
            lps[i] = j;
        }
        
        // Step 4: Get longest palindromic prefix
        int longest = lps[lps.length - 1];
        
        // Step 5: Characters to add
        String to_add = rev_s.substring(0, s.length() - longest);
        
        // Step 6: Return shortest palindrome
        return to_add + s;
    }
}


// Alternative with separate KMP function
class SolutionAlt {
    
    private int[] computeLPS(String pattern) {
        int m = pattern.length();
        int[] lps = new int[m];
        int length = 0;
        
        for (int i = 1; i < m; i++) {
            if (pattern.charAt(i) == pattern.charAt(length)) {
                length++;
                lps[i] = length;
            } else {
                if (length != 0) {
                    length = lps[length - 1];
                    i--;  // Retry with new length
                } else {
                    lps[i] = 0;
                }
            }
        }
        
        return lps;
    }
    
    public String shortestPalindrome(String s) {
        if (s == null || s.isEmpty()) {
            return s;
        }
        
        String rev_s = new StringBuilder(s).reverse().toString();
        String temp = s + "#" + rev_s;
        
        int[] lps = computeLPS(temp);
        int longest = lps[lps.length - 1];
        
        String to_add = rev_s.substring(0, s.length() - longest);
        return to_add + s;
    }
}


// Example usage
public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        System.out.println(sol.shortestPalindrome("aacecaaa"));  // "aaacecaaa"
        System.out.println(sol.shortestPalindrome("abcd"));       // "dcbabcd"
        System.out.println(sol.shortestPalindrome("a"));         // "a"
    }
}
```
<!-- slide -->
```javascript
/**
 * Find the shortest palindrome by adding characters in front of s.
 * Uses KMP (Knuth-Morris-Pratt) algorithm.
 * 
 * @param {string} s - Input string
 * @returns {string} Shortest palindrome
 */
function shortestPalindrome(s) {
    if (!s || s.length === 0) {
        return s;
    }
    
    // Step 1: Reverse the string
    const rev_s = s.split('').reverse().join('');
    
    // Step 2: Create combined string with separator
    const temp = s + '#' + rev_s;
    
    // Step 3: Compute KMP prefix (LPS) table
    const lps = new Array(temp.length).fill(0);
    
    for (let i = 1; i < temp.length; i++) {
        let j = lps[i - 1];
        
        // Fall back to previous longest proper prefix
        while (j > 0 && temp[i] !== temp[j]) {
            j = lps[j - 1];
        }
        
        // Extend the match if characters match
        if (temp[i] === temp[j]) {
            j++;
        }
        
        lps[i] = j;
    }
    
    // Step 4: Get longest palindromic prefix
    const longest = lps[lps.length - 1];
    
    // Step 5: Characters to add
    const to_add = rev_s.slice(0, s.length - longest);
    
    // Step 6: Return shortest palindrome
    return to_add + s;
}


/**
 * Compute LPS array for KMP algorithm.
 * @param {string} pattern 
 * @returns {number[]} LPS array
 */
function computeLPS(pattern) {
    const m = pattern.length;
    const lps = new Array(m).fill(0);
    let length = 0;
    
    for (let i = 1; i < m; i++) {
        if (pattern[i] === pattern[length]) {
            length++;
            lps[i] = length;
        } else {
            if (length !== 0) {
                length = lps[length - 1];
                i--;  // Retry with new length
            } else {
                lps[i] = 0;
            }
        }
    }
    
    return lps;
}


/**
 * Alternative implementation using separate KMP function.
 * @param {string} s 
 * @returns {string}
 */
function shortestPalindromeAlt(s) {
    if (!s || s.length === 0) return s;
    
    const rev_s = s.split('').reverse().join('');
    const temp = s + '#' + rev_s;
    const lps = computeLPS(temp);
    
    const longest = lps[lps.length - 1];
    const to_add = rev_s.slice(0, s.length - longest);
    
    return to_add + s;
}


// Example usage
console.log(shortestPalindrome("aacecaaa"));  // "aaacecaaa"
console.log(shortestPalindrome("abcd"));       // "dcbabcd"
console.log(shortestPalindrome("a"));          // "a"
console.log(shortestPalindrome(""));           // ""
console.log(shortestPalindrome("abcabc"));     // "abcabc"
```
````

---

## Explanation

This problem demonstrates a powerful application of the KMP (Knuth-Morris-Pratt) algorithm beyond simple pattern matching. The key insight is to transform the palindrome problem into a pattern matching problem.

### Why KMP Works Here

1. **Combined String**: By creating `s + '#' + reverse(s)`, we create a string where:
   - The prefix comes from the original string `s`
   - The suffix comes from the reversed string `reverse(s)`
   - The `#` separator ensures we don't match across the boundary incorrectly

2. **LPS Array**: The LPS (Longest Prefix Suffix) array tells us the longest prefix of this combined string that is also a suffix. Since the suffix comes from `reverse(s)`, this longest match represents the longest prefix of `s` that appears as a suffix in `reverse(s)`, which is equivalent to the longest palindromic prefix of `s`.

3. **Building the Result**: Once we know how much of `s` is already a palindrome from the start, we simply need to prepend the reverse of the remaining non-palindromic suffix.

### Example Walkthrough

For `s = "abcd"`:
- `rev_s = "dcba"`
- `temp = "abcd#dcba"`
- Compute LPS: `[0, 0, 0, 0, 1, 2, 3, 4]`
- `longest = 4` (Wait, this doesn't seem right...)

Actually for "abcd":
- `temp = "abcd#dcba"`
- LPS array: The longest prefix that's also a suffix... let me recalculate
- Actually for this case, we need LPS = 0 because there's no palindromic prefix
- So we add reverse of entire string: "dcba" + "abcd" = "dcbabcd" ✓

For `s = "aacecaaa"`:
- `rev_s = "aaacecaa"`
- `temp = "aacecaaa#aaacecaa"`
- LPS gives us the longest palindromic prefix: "aacecaaa" reversed is "aaacecaa" - the longest common is "aa" which is 2 characters of palindrome? No wait...

Let me verify: "aacecaaa" - the longest palindromic prefix is "aacecaaa" itself? No actually:
- "aacecaaa" reversed is "aaacecaa"
- They share "aa" at the start and end
- So LPS = 2 means we add 1 character "a" in front? 

Wait, the output is "aaacecaaa" - we add one "a" to the front.

So for "aacecaaa":
- We find longest palindrome prefix = 8 (actually the whole string is a palindrome! Wait no, it's not)
- "aacecaaa" reversed is "aaacecaa"
- Comparing: a a c e c a a a
-                  a a a c e c a a
- They share "aa" but not more

Actually let's compute: LPS[-1] = 3 maybe?
- s = "aacecaaa"
- rev_s = "aaacecaa"  
- temp = "aacecaaa#aaacecaa"
- LPS[14] = 3 (the "caa" matches)
- This means longest palindromic prefix = 3
- So we add rev_s[0:8-3] = rev_s[0:5] = "aaace"
- "aaace" + "aacecaaa" = "aaaceaacecaaa" - wait that's wrong

Let me think again. The output should be "aaacecaaa". We add one "a" to the front.

So longest palindrome prefix = 7 ("acecaaa" is palindrome? No wait...)
- "aacecaaa" - checking from start: a a c e c a a a
- If we use LPS = 1, we add rev_s[0:8-1] = rev_s[0:7] = "aaaceca"
- That's wrong

The answer is LPS = 1, so we add rev_s[0:8-1] = "aaacec" (7 chars) -> No that's wrong.

Actually I think the longest palindrome prefix of "aacecaaa" is 1 (just "a" - both first and last character are "a"). So we add rev_s[0:7] = "aaaceca" to get... no that doesn't work.

Wait, I think I'm confusing myself. Let me recalculate:
- For palindrome: we need to find the longest prefix that is also a suffix when comparing s with reverse(s)
- "aacecaaa" vs "aaacecaa"
- They match at: position 0: 'a' vs 'a' - match; position 1: 'a' vs 'a' - match; position 2: 'c' vs 'a' - no
- So the longest is "aa" = 2 characters

If LPS = 2, we add rev_s[0:8-2] = rev_s[0:6] = "aaacec"
Result: "aaacec" + "aacecaaa" = "aaacecaacecaaa" - wrong!

Let me check: output is "aaacecaaa"
- That's "a" + "aacecaaa"
- So we only added one character

So actually LPS should be 7? Let's verify:
- The string "aacecaaa" has palindrome "aacecaaa" - NO wait, it's not a palindrome
- Wait, maybe the string IS a palindrome? Let me check again
- "aacecaaa" reversed is "aaacecaa"
- These are NOT equal

OH! The answer "aaacecaaa" has first char 'a', last char 'a'. 
- The longest palindrome prefix is "a" (single character)
- So LPS = 1

If LPS = 1:
- We add rev_s[0:8-1] = rev_s[0:7] = "aaaceca"
- Result: "aaaceca" + "aacecaaa" = "aaacecaaacecaaa" - WRONG!

I think there's an error in my understanding. Let me re-verify the algorithm.

Actually wait - let me check the output: "aaacecaaa" = "a" + "aacecaaa"
We added ONE character to the front.

So the algorithm is: we find the longest prefix of s that is a palindrome. But we're comparing s with reverse(s).

Actually the algorithm is: find longest prefix of s that appears as a suffix in reverse(s) - this represents the palindrome at the END of s? No, we want palindrome at the BEGINNING.

Actually re-reading: "find the longest prefix of s that is also a suffix" - in the context of KMP on s + '#' + rev_s, this gives us the longest prefix of s that matches a suffix of rev_s, which means it's a suffix-palindrome in s, which is the same as a prefix-palindrome in reverse(s)... I'm getting confused.

Let me just trust the algorithm and verify: LPS = 1 for "aacecaaa", so we add rev_s[0:7] = "aaaceca"... wait that's not "a".

OH! I see the issue. For "aacecaaa", the LPS value at the end should be 1, but maybe my manual calculation was wrong. Let me think about it differently:

Actually looking at the result "aaacecaaa":
- We added "a" to the front
- This makes "a" + "aacecaaa" = "aaacecaaa"
- Now the whole string is a palindrome: a a c e c a a a
- Reverse is: a a a c e c a a - wait these don't match!

Wait, "aaacecaaa" reversed is "aaacecaa" which is NOT equal to "aaacecaaa"!

Oh! Maybe the expected output is wrong? Let me check LeetCode...

Actually wait, I just realized - "aacecaaa" IS already a palindrome! Let me check:
- Forward: a a c e c a a a
- Backward: a a a c e c a a

Wait these don't match. Let me check character by character:
- Position 0: a (first) vs a (last) ✓
- Position 1: a (second) vs a (second-last) ✓  
- Position 2: c vs c ✓
- Position 3: e vs e ✓
- Position 4: c vs c ✓
- Position 5: a vs a ✓
- Position 6: a vs a ✓
- Position 7: a (last) vs a (first) ✓

Actually wait, "aacecaaa" has 8 characters. Let me re-index:
Index:     0 1 2 3 4 5 6 7
Char:      a a c e c a a a
Reverse:   a a a c e c a a

Index 0: 'a' == 'a' ✓
Index 1: 'a' == 'a' ✓
Index 2: 'c' == 'a' ✗

So it's NOT a palindrome!

But wait, maybe I'm computing LPS wrong. Let me think:
- s = "aacecaaa"
- rev_s = "aaacecaa"
- temp = "aacecaaa#aaacecaa"

We want to find: longest prefix of s that matches a suffix of rev_s

rev_s suffixes:
- "a" - matches prefix "a" of s? Yes! So LPS >= 1
- "aa" - matches prefix "aa" of s? Yes! LPS >= 2
- "caa" - matches prefix "caa" of s? No
- "ecaa" - matches prefix "ecaa"? No
- "cecaa" - No
- "ececaa" - No
- "acecaa" - No
- "aacecaa" - No

So LPS = 2!

If LPS = 2, then we add rev_s[0:8-2] = rev_s[0:6] = "aaacec"
Result: "aaacec" + "aacecaaa" = "aaacecaacecaaa" - NOT "aaacecaaa"

Hmm, this doesn't match. Let me reconsider the problem:

Maybe I'm computing the LPS on the wrong string? The algorithm says to compute on s + '#' + rev_s, so:
- temp = "aacecaaa#aaacecaa"  
- We want prefix of temp that's also suffix of temp
- The prefix "aacecaaa" (first 8 chars) vs suffix of length 8: "aaacecaa" - no match
- The prefix "aacecaa" vs suffix "aacecaa" - YES! So LPS = 7?

Wait that would mean we add rev_s[0:8-7] = rev_s[0:1] = "a"
Result: "a" + "aacecaaa" = "aaacecaaa" ✓

So LPS = 7! The longest prefix of "aacecaaa#aaacecaa" that's also a suffix:
- Check length 7: prefix = "aacecaa", suffix = "aacecaa" ✓

So the longest palindrome prefix of "aacecaaa" has length 7: "aacecaa"
- "aacecaa" reversed is "aacecaa" ✓

This makes sense! The original string starts with a 7-character palindrome, so we only need to add 1 character.

### Complexity Analysis

- **Time Complexity**: O(n) where n is the length of string s
  - Building the combined string: O(n)
  - Computing LPS array: O(n)
  - All other operations: O(n)
  
- **Space Complexity**: O(n)
  - Combined string: O(n)
  - LPS array: O(n)
  - Reversed string: O(n)

---

## Approach 2: Two Pointers with Recursion

### Algorithm Steps

1. Use two pointers: one at start, one at end
2. Expand inward checking for palindrome
3. Find the longest palindromic prefix
4. Reverse the remaining suffix and prepend to original string

### Why It Works

This is a brute force approach that checks each position to find the longest palindromic prefix. It correctly finds the answer but is less efficient.

### Code Implementation

````carousel
```python
class Solution:
    def shortestPalindrome(self, s: str) -> str:
        """
        Find shortest palindrome using two pointers.
        
        Time: O(n²)
        Space: O(n)
        """
        if not s:
            return s
        
        n = len(s)
        
        # Find longest palindromic prefix
        for i in range(n):
            # Check if s[0:n-i] is palindrome
            if self.is_palindrome(s, 0, n - i - 1):
                # Reverse the remaining part and prepend
                remaining = s[n - i:][::-1]
                return remaining + s
        
        return s
    
    def is_palindrome(self, s: str, left: int, right: int) -> bool:
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
    string shortestPalindrome(string s) {
        if (s.empty()) return s;
        
        int n = s.length();
        
        for (int i = 0; i < n; i++) {
            if (isPalindrome(s, 0, n - i - 1)) {
                string remaining = s.substr(n - i);
                reverse(remaining.begin(), remaining.end());
                return remaining + s;
            }
        }
        
        return s;
    }
    
private:
    bool isPalindrome(const string& s, int left, int right) {
        while (left < right) {
            if (s[left] != s[right]) return false;
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
    public String shortestPalindrome(String s) {
        if (s == null || s.isEmpty()) return s;
        
        int n = s.length();
        
        for (int i = 0; i < n; i++) {
            if (isPalindrome(s, 0, n - i - 1)) {
                String remaining = new StringBuilder(s.substring(n - i)).reverse().toString();
                return remaining + s;
            }
        }
        
        return s;
    }
    
    private boolean isPalindrome(String s, int left, int right) {
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }
        return true;
    }
}
```

<!-- slide -->
```javascript
var shortestPalindrome = function(s) {
    if (!s || s.length === 0) return s;
    
    const n = s.length;
    
    const isPalindrome = (left, right) => {
        while (left < right) {
            if (s[left] !== s[right]) return false;
            left++;
            right--;
        }
        return true;
    };
    
    for (let i = 0; i < n; i++) {
        if (isPalindrome(0, n - i - 1)) {
            const remaining = s.slice(n - i).split('').reverse().join('');
            return remaining + s;
        }
    }
    
    return s;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - checking each prefix |
| **Space** | O(n) - for substring operations |

---

## Comparison of Approaches

| Aspect | KMP | Two Pointers |
|--------|-----|---------------|
| **Time Complexity** | O(n) | O(n²) |
| **Space Complexity** | O(n) | O(n) |
| **LeetCode Optimal** | ✅ Yes | ❌ No |

---

## Follow-up Questions

### Q1: Why use KMP instead of simpler approaches?

**Answer:** KMP provides O(n) time complexity compared to O(n²) for brute force approaches. For strings up to 50,000 characters, this is crucial for performance.

---

### Q2: What separator character should we use?

**Answer:** Any character not appearing in the string works. '#' is commonly used because it's unlikely to appear in lowercase English strings.

---

### Q3: Can we solve this without extra space?

**Answer:** The two-pointer recursive approach uses O(n) space for recursion stack. The KMP approach inherently needs O(n) space for the combined string and LPS array.

---

### Q4: How does this relate to finding the longest palindromic suffix?

**Answer:** The problem asks to add characters to the front, so we find the longest palindromic prefix. This is equivalent to finding the longest palindromic suffix in the reversed string.

---

## Summary

This problem demonstrates the **KMP (Knuth-Morris-Pratt) Algorithm** pattern for finding the longest palindromic prefix efficiently.

**Key Takeaways:**
- By combining the string with its reverse using a separator, we transform the palindrome problem into a pattern matching problem
- The LPS (Longest Prefix Suffix) array from KMP gives us the longest palindromic prefix in O(n) time
- The solution efficiently handles strings up to 50,000 characters
- The key insight is that we only need to add the reverse of the non-palindromic suffix to make the string a palindrome

**Pattern Summary:** This problem exemplifies KMP-based palindrome finding, characterized by:
- Building a combined string `s + '#' + reverse(s)` to find matching prefix-suffix
- Computing LPS array in O(n) time to find longest palindromic prefix
- Prepending only the minimum characters needed to create the shortest palindrome
- Time complexity O(n) and space complexity O(n)

---

## Related Problems

Based on similar themes (palindrome, string manipulation):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Palindrome Pairs | [Link](https://leetcode.com/problems/palindrome-pairs/) | Find palindrome pairs |
| Longest Palindromic Substring | [Link](https://leetcode.com/problems/longest-palindromic-substring/) | Find longest palindrome |
| Valid Palindrome | [Link](https://leetcode.com/problems/valid-palindrome/) | Check if palindrome |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

- [NeetCode - Shortest Palindrome](https://www.youtube.com/watch?v=7j-H64yXjrM) - Clear explanation
- [KMP Algorithm Explanation](https://www.youtube.com/watch?v=KG44VoEtaA0) - Understanding LPS array
