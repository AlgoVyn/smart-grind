# String - Anagram Check (Frequency Count/Sort)

## Pattern Overview

The **Anagram Check** pattern is a fundamental string manipulation problem that involves determining whether two strings contain exactly the same characters (possibly in a different order). This pattern tests your ability to efficiently compare character frequencies and understand string ordering properties.

**Core Challenge:** Verify if two strings are anagrams of each other by comparing their character compositions without actually sorting the entire strings.

---

## Problem Description

An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once. For example, "listen" and "silent" are anagrams because they contain the same letters in different orders.

### Key Observations

1. **Equal Length Requirement:** For two strings to be anagrams, they must have the same length
2. **Character Frequency Match:** The count of each character in both strings must be identical
3. **Case Sensitivity:** By default, we consider 'A' and 'a' as different characters (unless specified otherwise)
4. **Space Handling:** Spaces may or may not be counted depending on the problem constraints

### Problem Statement

Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.

---

## Examples

**Example 1:**
```
Input: s = "anagram", t = "nagaram"
Output: true
```

**Example 2:**
```
Input: s = "rat", t = "car"
Output: false
```

**Example 3:**
```
Input: s = "a", t = "ab"
Output: false
```

**Example 4:**
```
Input: s = "listen", t = "silent"
Output: true
```

**Example 5:**
```
Input: s = "hello", t = "world"
Output: false
```

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 ≤ s.length, t.length ≤ 10^5` | Input strings can be very long |
| Lowercase English letters only | All characters are 'a' through 'z' |
| Consistent character set | Both strings use the same character set |

---

## Intuition

The core insight for solving the anagram check problem is:

> **Two strings are anagrams if and only if they have identical character frequency counts.**

This leads to two main solution strategies:

### Strategy 1: Frequency Count (Optimal)

Count the occurrences of each character in both strings and compare the counts. Since the strings contain only lowercase English letters, we can use a fixed-size array of size 26 for counting.

**Why it works:** If two strings have the same frequency for every character, they must contain exactly the same letters (possibly in different orders), which is the definition of an anagram.

### Strategy 2: Sorting (Naive)

Sort both strings and compare them character by character. If the sorted strings are identical, the original strings are anagrams.

**Why it works:** Sorting rearranges characters into a canonical order. If two strings are anagrams, their sorted forms will be identical.

---

## Approach 1: Frequency Count ⭐ (Most Optimal)

### Algorithm

1. If the strings have different lengths, return `false` immediately
2. Create an array of size 26 (for 'a' to 'z') initialized to zeros
3. Iterate through the first string, incrementing the count for each character
4. Iterate through the second string, decrementing the count for each character
5. If any count is non-zero after processing both strings, return `false`
6. Otherwise, return `true`

### Why This Works

By incrementing counts for the first string and decrementing for the second, we effectively compute the difference in character frequencies. If the strings are anagrams, all differences will be zero.

### Code Templates

````carousel
<!-- slide -->
```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        """
        Check if two strings are anagrams using frequency counting.
        
        Time: O(n) where n is the length of the strings
        Space: O(1) for the fixed-size frequency array (26)
        
        This is the optimal approach for this problem.
        """
        # Early exit if lengths differ
        if len(s) != len(t):
            return False
        
        # Frequency array for 26 lowercase letters
        count = [0] * 26
        
        # Count characters in first string
        for char in s:
            count[ord(char) - ord('a')] += 1
        
        # Subtract character counts from second string
        for char in t:
            count[ord(char) - ord('a')] -= 1
            # Early exit if count goes negative
            if count[ord(char) - ord('a')] < 0:
                return False
        
        # All counts should be zero if anagrams
        return True
```
<!-- slide -->
```java
class Solution {
    public boolean isAnagram(String s, String String) {
        /**
         * Check if two strings are anagrams using frequency counting.
         *
         * Time: O(n) where n is the length of the strings
         * Space: O(1) for the fixed-size frequency array (26)
         */
        if (s.length() != t.length()) {
            return false;
        }
        
        int[] count = new int[26];
        
        // Count characters in first string
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
        }
        
        // Subtract character counts from second string
        for (int i = 0; i < t.length(); i++) {
            count[t.charAt(i) - 'a']--;
            if (count[t.charAt(i) - 'a'] < 0) {
                return false;
            }
        }
        
        return true;
    }
}
```
<!-- slide -->
```cpp
#include <string>
#include <vector>

class Solution {
public:
    bool isAnagram(std::string s, std::string t) {
        /**
         * Check if two strings are anagrams using frequency counting.
         *
         * Time: O(n) where n is the length of the strings
         * Space: O(1) for the fixed-size frequency array (26)
         */
        if (s.length() != t.length()) {
            return false;
        }
        
        std::vector<int> count(26, 0);
        
        // Count characters in first string
        for (char c : s) {
            count[c - 'a']++;
        }
        
        // Subtract character counts from second string
        for (char c : t) {
            count[c - 'a']--;
            if (count[c - 'a'] < 0) {
                return false;
            }
        }
        
        return true;
    }
};
```
<!-- slide -->
```javascript
/**
 * Check if two strings are anagrams using frequency counting.
 * 
 * Time: O(n) where n is the length of the strings
 * Space: O(1) for the fixed-size frequency array (26)
 * 
 * @param {string} s - First string
 * @param {string} t - Second string
 * @return {boolean} - True if anagrams, false otherwise
 */
var isAnagram = function(s, t) {
    // Early exit if lengths differ
    if (s.length !== t.length()) {
        return false;
    }
    
    const count = new Array(26).fill(0);
    
    // Count characters in first string
    for (let i = 0; i < s.length; i++) {
        count[s.charCodeAt(i) - 'a'.charCodeAt(0)]++;
    }
    
    // Subtract character counts from second string
    for (let i = 0; i < t.length; i++) {
        const idx = t.charCodeAt(i) - 'a'.charCodeAt(0);
        count[idx]--;
        if (count[idx] < 0) {
            return false;
        }
    }
    
    return true;
};
```
````

### Time Complexity

**O(n)**, where `n` is the length of the strings. We iterate through both strings exactly once.

### Space Complexity

**O(1)**, as we use a fixed-size array of 26 integers, regardless of input size.

### Pros

- ✅ Optimal O(n) time complexity
- ✅ Minimal O(1) space usage
- ✅ Single pass through both strings
- ✅ Can exit early if counts don't match
- ✅ No sorting or expensive operations

### Cons

- ❗ Only works when character set is limited (like lowercase letters)
- ❗ For unicode or large character sets, would need a hash map

---

## Approach 2: Sorting Approach ⭐⭐

### Algorithm

1. If the strings have different lengths, return `false` immediately
2. Sort both strings using an efficient sorting algorithm
3. Compare the sorted strings character by character
4. If any character differs, return `false`; otherwise, return `true`

### Why This Works

Sorting rearranges characters into a canonical (standard) order. If two strings are anagrams, their sorted forms will be identical because they contain exactly the same characters.

### Code Templates

````carousel
<!-- slide -->
```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        """
        Check if two strings are anagrams using sorting.
        
        Time: O(n log n) where n is the length of the strings
        Space: O(n) for the sorted strings
        
        This approach is simple but less efficient than counting.
        """
        # Early exit if lengths differ
        if len(s) != len(t):
            return False
        
        # Sort both strings
        return sorted(s) == sorted(t)
```
<!-- slide -->
```java
import java.util.Arrays;

class Solution {
    public boolean isAnagram(String s, String t) {
        /**
         * Check if two strings are anagrams using sorting.
         *
         * Time: O(n log n) where n is the length of the strings
         * Space: O(n) for the sorted character arrays
         */
        if (s.length() != t.length()) {
            return false;
        }
        
        char[] sArr = s.toCharArray();
        char[] tArr = t.toCharArray();
        
        Arrays.sort(sArr);
        Arrays.sort(tArr);
        
        return Arrays.equals(sArr, tArr);
    }
}
```
<!-- slide -->
```cpp
#include <algorithm>
#include <string>

class Solution {
public:
    bool isAnagram(std::string s, std::string t) {
        /**
         * Check if two strings are anagrams using sorting.
         *
         * Time: O(n log n) where n is the length of the strings
         * Space: O(n) for the sorted strings
         */
        if (s.length() != t.length()) {
            return false;
        }
        
        std::sort(s.begin(), s.end());
        std::sort(t.begin(), t.end());
        
        return s == t;
    }
};
```
<!-- slide -->
```javascript
/**
 * Check if two strings are anagrams using sorting.
 * 
 * Time: O(n log n) where n is the length of the strings
 * Space: O(n) for the sorted strings
 * 
 * @param {string} s - First string
 * @param {string} t - Second string
 * @return {boolean} - True if anagrams, false otherwise
 */
var isAnagram = function(s, t) {
    // Early exit if lengths differ
    if (s.length !== t.length()) {
        return false;
    }
    
    const sSorted = s.split('').sort().join('');
    const tSorted = t.split('').sort().join('');
    
    return sSorted === tSorted;
};
```
````

### Time Complexity

**O(n log n)**, where `n` is the length of the strings. Sorting dominates the time complexity.

### Space Complexity

**O(n)**, as we need to store the sorted strings (or create copies for sorting).

### Pros

- ✅ Simple and intuitive implementation
- ✅ Works for any character set (unicode, special characters, etc.)
- ✅ Easy to understand and explain
- ✅ No need to know the character set in advance

### Cons

- ❗ O(n log n) is slower than O(n) counting approach
- ❗ O(n) additional space for sorted strings
- ❗ Sorting is overkill when we only need to compare frequencies

---

## Approach 3: Hash Map (General Character Set)

### Algorithm

1. If the strings have different lengths, return `false` immediately
2. Create a hash map (dictionary) to store character counts
3. Iterate through the first string, incrementing counts for each character
4. Iterate through the second string, decrementing counts for each character
5. If any character count is non-zero, return `false`
6. Otherwise, return `true`

### Why This Works

A hash map provides the same functionality as the fixed array but works for any character set (not just lowercase letters). It maps each unique character to its frequency count.

### Code Templates

````carousel
<!-- slide -->
```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        """
        Check if two strings are anagrams using a hash map.
        
        Time: O(n) where n is the length of the strings
        Space: O(k) where k is the number of unique characters
        
        This approach works for any character set.
        """
        from collections import Counter
        
        # Early exit if lengths differ
        if len(s) != len(t):
            return False
        
        # Use Counter for concise frequency counting
        return Counter(s) == Counter(t)
        
        # Alternatively, manual implementation:
        # char_count = {}
        # for char in s:
        #     char_count[char] = char_count.get(char, 0) + 1
        # for char in t:
        #     if char not in char_count or char_count[char] == 0:
        #         return False
        #     char_count[char] -= 1
        # return all(count == 0 for count in char_count.values())
```
<!-- slide -->
```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean isAnagram(String s, String t) {
        /**
         * Check if two strings are anagrams using a hash map.
         *
         * Time: O(n) where n is the length of the strings
         * Space: O(k) where k is the number of unique characters
         */
        if (s.length() != t.length()) {
            return false;
        }
        
        Map<Character, Integer> count = new HashMap<>();
        
        // Count characters in first string
        for (char c : s.toCharArray()) {
            count.put(c, count.getOrDefault(c, 0) + 1);
        }
        
        // Subtract character counts from second string
        for (char c : t.toCharArray()) {
            if (!count.containsKey(c) || count.get(c) == 0) {
                return false;
            }
            count.put(c, count.get(c) - 1);
        }
        
        return true;
    }
}
```
<!-- slide -->
```cpp
#include <unordered_map>
#include <string>

class Solution {
public:
    bool isAnagram(std::string s, std::string t) {
        /**
         * Check if two strings are anagrams using a hash map.
         *
         * Time: O(n) where n is the length of the strings
         * Space: O(k) where k is the number of unique characters
         */
        if (s.length() != t.length()) {
            return false;
        }
        
        std::unordered_map<char, int> count;
        
        // Count characters in first string
        for (char c : s) {
            count[c]++;
        }
        
        // Subtract character counts from second string
        for (char c : t) {
            count[c]--;
            if (count[c] < 0) {
                return false;
            }
        }
        
        return true;
    }
};
```
<!-- slide -->
```javascript
/**
 * Check if two strings are anagrams using a hash map.
 * 
 * Time: O(n) where n is the length of the strings
 * Space: O(k) where k is the number of unique characters
 * 
 * @param {string} s - First string
 * @param {string} t - Second string
 * @return {boolean} - True if anagrams, false otherwise
 */
var isAnagram = function(s, t) {
    // Early exit if lengths differ
    if (s.length !== t.length()) {
        return false;
    }
    
    const count = new Map();
    
    // Count characters in first string
    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        count.set(char, (count.get(char) || 0) + 1);
    }
    
    // Subtract character counts from second string
    for (let i = 0; i < t.length; i++) {
        const char = t[i];
        if (!count.has(char) || count.get(char) === 0) {
            return false;
        }
        count.set(char, count.get(char) - 1);
    }
    
    return true;
};
```
````

### Time Complexity

**O(n)**, where `n` is the length of the strings. Hash map operations are O(1) on average.

### Space Complexity

**O(k)**, where `k` is the number of unique characters in the strings.

### Pros

- ✅ Works for any character set (unicode, special characters, etc.)
- ✅ O(n) time complexity
- ✅ More flexible than fixed array approach
- ✅ Handles any alphabet or character set

### Cons

- ❗ Hash map has overhead compared to fixed array
- ❗ Worst-case O(n) space for hash map operations
- ❗ For lowercase letters, fixed array is more efficient

---

## Approach 4: Prime Number Multiplication (Mathematical)

### Algorithm

1. If the strings have different lengths, return `false` immediately
2. Assign a unique prime number to each possible character
3. Multiply the prime numbers for all characters in the first string
4. Multiply the prime numbers for all characters in the second string
5. If the products are equal, the strings are anagrams

### Why This Works

By the Fundamental Theorem of Arithmetic, every integer greater than 1 has a unique prime factorization. If two strings have the same character frequencies, their prime products will be identical.

### Code Templates

````carousel
<!-- slide -->
```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        """
        Check if two strings are anagrams using prime number multiplication.
        
        Time: O(n) where n is the length of the strings
        Space: O(1) for the prime mapping
        
        This is a mathematical approach using unique prime factors.
        Warning: Products can be very large for long strings.
        """
        if len(s) != len(t):
            return False
        
        # Prime numbers for 'a' through 'z'
        primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
                  43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101]
        
        product1 = 1
        product2 = 1
        
        for char in s:
            product1 *= primes[ord(char) - ord('a')]
        
        for char in t:
            product2 *= primes[ord(char) - ord('a')]
        
        return product1 == product2
```
<!-- slide -->
```java
class Solution {
    private static final int[] PRIMES = {
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
        43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101
    };
    
    public boolean isAnagram(String s, String t) {
        /**
         * Check if two strings are anagrams using prime number multiplication.
         *
         * Time: O(n) where n is the length of the strings
         * Space: O(1) for the prime mapping
         *
         * Warning: Products can overflow for long strings.
         */
        if (s.length() != t.length()) {
            return false;
        }
        
        long product1 = 1;
        long product2 = 1;
        
        for (int i = 0; i < s.length(); i++) {
            product1 *= PRIMES[s.charAt(i) - 'a'];
        }
        
        for (int i = 0; i < t.length(); i++) {
            product2 *= PRIMES[t.charAt(i) - 'a'];
        }
        
        return product1 == product2;
    }
}
```
<!-- slide -->
```cpp
#include <vector>
#include <string>

class Solution {
private:
    static const std::vector<int> PRIMES;
    
    static const std::vector<int> initPrimes() {
        return {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
                43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101};
    }
    
public:
    bool isAnagram(std::string s, std::string t) {
        /**
         * Check if two strings are anagrams using prime number multiplication.
         *
         * Time: O(n) where n is the length of the strings
         * Space: O(1) for the prime mapping
         *
         * Warning: Products can overflow for long strings.
         */
        if (s.length() != t.length()) {
            return false;
        }
        
        static const std::vector<int> primes = initPrimes();
        long long product1 = 1;
        long long product2 = 1;
        
        for (char c : s) {
            product1 *= primes[c - 'a'];
        }
        
        for (char c : t) {
            product2 *= primes[c - 'a'];
        }
        
        return product1 == product2;
    }
};

const std::vector<int> Solution::PRIMES = Solution::initPrimes();
```
<!-- slide -->
```javascript
/**
 * Check if two strings are anagrams using prime number multiplication.
 * 
 * Time: O(n) where n is the length of the strings
 * Space: O(1) for the prime mapping
 * 
 * @param {string} s - First string
 * @param {string} t - Second string
 * @return {boolean} - True if anagrams, false otherwise
 */
var isAnagram = function(s, t) {
    // Prime numbers for 'a' through 'z'
    const primes = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
        43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101
    ];
    
    if (s.length !== t.length()) {
        return false;
    }
    
    let product1 = 1n;
    let product2 = 1n;
    
    for (let i = 0; i < s.length; i++) {
        product1 *= BigInt(primes[s.charCodeAt(i) - 'a'.charCodeAt(0)]);
    }
    
    for (let i = 0; i < t.length; i++) {
        product2 *= BigInt(primes[t.charCodeAt(i) - 'a'.charCodeAt(0)]);
    }
    
    return product1 === product2;
};
```
````

### Time Complexity

**O(n)**, where `n` is the length of the strings.

### Space Complexity

**O(1)**, as we use a fixed-size prime array.

### Pros

- ✅ Mathematical elegance
- ✅ No need to store character counts
- ✅ Works for any character set with enough primes

### Cons

- ❗ Products can overflow very quickly (use BigInt in JavaScript)
- ❗ Limited to character sets with unique prime assignments
- ❗ Not practical for long strings due to overflow

---

## Step-by-Step Example

Let's trace through `s = "anagram"` and `t = "nagaram"` using the frequency count approach:

### Initial State
```
s = "anagram"
t = "nagaram"
count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

### Step 1: Process 'a' in s
```
count[0] = 1  // 'a'
```

### Step 2: Process 'n' in s
```
count[13] = 1  // 'n'
```

### Step 3: Process 'a' in s
```
count[0] = 2
```

### Step 4: Process 'g' in s
```
count[6] = 1  // 'g'
```

### Step 5: Process 'r' in s
```
count[17] = 1  // 'r'
```

### Step 6: Process 'a' in s
```
count[0] = 3
```

### Step 7: Process 'm' in s
```
count[12] = 1  // 'm'
```

### Step 8: Process 'n' in t (decrement)
```
count[13] = 0
```

### Step 9: Process 'a' in t (decrement)
```
count[0] = 2
```

### Step 10: Process 'g' in t (decrement)
```
count[6] = 0
```

### Step 11: Process 'a' in t (decrement)
```
count[0] = 1
```

### Step 12: Process 'r' in t (decrement)
```
count[17] = 0
```

### Step 13: Process 'a' in t (decrement)
```
count[0] = 0
```

### Step 14: Process 'm' in t (decrement)
```
count[12] = 0
```

### Final Result
```
All counts are zero → return true
```

---

## Time Complexity Comparison

| Approach | Time Complexity | Space Complexity | Best For |
|----------|-----------------|------------------|----------|
| Frequency Count | O(n) | O(1) | **Optimal - lowercase letters only** |
| Sorting | O(n log n) | O(n) | Simplicity, any character set |
| Hash Map | O(n) | O(k) | Any character set |
| Prime Multiplication | O(n) | O(1) | Mathematical curiosity |

For the standard LeetCode problem (lowercase letters), the **frequency count approach is optimal** with O(n) time and O(1) space.

---

## When to Use This Pattern

Use the Anagram Check pattern when you need to:

1. **Compare character compositions** - Determine if two strings contain the same characters
2. **Validate word variations** - Check if one word can be formed from another
3. **Detect anagram relationships** - Find or verify anagram pairs
4. **Frequency-based comparisons** - Compare distributions of items

### Real-World Applications

- **Word games** - Scrabble, word puzzles, anagram solvers
- **Data deduplication** - Identify duplicate entries with different ordering
- **Cryptography** - Frequency analysis of characters
- **Text processing** - Detecting case-insensitive matches
- **Spam detection** - Identifying obfuscated spam words

---

## Related Problems

| Problem | Difficulty | Description | LeetCode Link |
|---------|------------|-------------|---------------|
| Valid Anagram | Easy | Basic anagram check | [Link](https://leetcode.com/problems/valid-anagram/) |
| Group Anagrams | Medium | Group strings by anagram equivalence | [Link](https://leetcode.com/problems/group-anagrams/) |
| Find All Anagrams in a String | Medium | Find all anagram start indices | [Link](https://leetcode.com/problems/find-all-anagrams-in-a-string/) |
| Minimum Number of Steps to Make Two Strings Anagram | Medium | Minimum character changes | [Link](https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram/) |
| Check if Two String Arrays are Equivalent | Easy | Array-based string comparison | [Link](https://leetcode.com/problems/check-if-two-string-arrays-are-equivalent/) |
| Remove Letter To Make Sorted | Easy | Sort by removing minimum letters | [Link](https://leetcode.com/problems/remove-letter-to-make-sorted/) |

---

## Video Tutorials

| Tutorial | Platform | Link |
|----------|----------|------|
| NeetCode - Valid Anagram Solution | YouTube | [Watch](https://www.youtube.com/watch?v=9UtQ5f_jOQQ) |
| Back to Back SWE - Anagram Check | YouTube | [Watch](https://www.youtube.com/watch?v=3M0LvH1v8cU) |
| LeetCode Official Solution | YouTube | [Watch](https://www.youtube.com/watch?v=9UtQ5f_jOQQ) |
| Anagram Groups - Group Anagrams | YouTube | [Watch](https://www.youtube.com/watch?v=vP9ogEVG0MQ) |
| TechDive - Anagram Detection | YouTube | [Watch](https://www.youtube.com/watch?v=IGame7Flt8U) |

---

## Follow-up Questions

**1. How would you handle case-insensitive anagram checks?**

Convert both strings to the same case (e.g., lowercase) before comparison. The frequency counting approach works the same way.

**2. What if you needed to ignore spaces in the comparison?**

Filter out spaces from both strings before processing, or count spaces separately and compare their counts.

**3. How would you find all anagrams of a string in a list?**

Use a hash map to group strings by their sorted form (or frequency signature). Strings with the same signature are anagrams.

**4. What if the strings could contain unicode characters?**

Use a hash map instead of a fixed-size array to handle the potentially large character set.

**5. How would you optimize for early termination?**

During the counting process, if any character count becomes negative, you can immediately return false since the strings can't be anagrams.

**6. What is the minimum number of character changes needed to make two strings anagrams?**

Calculate the absolute difference in character frequencies. The answer is half the sum of all differences (since each change fixes two characters).

**7. How would you handle very long strings (millions of characters)?**

The frequency count approach is still optimal with O(n) time. Consider streaming approaches to avoid loading entire strings into memory.

**8. What if you needed to check anagrams in a case where character set is unknown?**

Use a hash map approach that dynamically builds the frequency dictionary based on the characters encountered.

---

## Common Mistakes to Avoid

1. **❌ Forgetting length check**
   - Always check if strings have the same length first
   - Different length strings can never be anagrams

2. **❌ Using sorting for large inputs**
   - O(n log n) is slower than O(n) counting
   - Only use sorting when character set is large/unknown

3. **❌ Not handling case sensitivity**
   - 'A' and 'a' are different characters by default
   - Convert to same case if needed

4. **❌ Not considering space complexity**
   - Fixed array is O(1), hash map is O(k) where k is unique chars
   - Choose based on your constraints

5. **❌ Integer overflow in prime multiplication**
   - Products grow very quickly
   - Use BigInt or avoid this approach for long strings

6. **❌ Modifying input strings unintentionally**
   - Sorting modifies the string in some languages
   - Make copies if you need to preserve original strings

7. **❌ Early exit without checking all counts**
   - Make sure all character counts return to zero
   - One non-zero count means not anagrams

---

## References

- [LeetCode 242 - Valid Anagram](https://leetcode.com/problems/valid-anagram/)
- [Anagram - Wikipedia](https://en.wikipedia.org/wiki/Anagram)
- [Fundamental Theorem of Arithmetic](https://en.wikipedia.org/wiki/Fundamental_theorem_of_arithmetic)
- [Character Frequency Analysis](https://en.wikipedia.org/wiki/Frequency_analysis)
