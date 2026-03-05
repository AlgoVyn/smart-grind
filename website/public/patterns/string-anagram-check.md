# String - Anagram Check

## Problem Description

The **Anagram Check** pattern is a fundamental string manipulation problem that involves determining whether two strings contain exactly the same characters (possibly in a different order). This pattern tests your ability to efficiently compare character frequencies and understand string ordering properties.

An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once. For example, "listen" and "silent" are anagrams because they contain the same letters in different orders.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Input** | Two strings to compare |
| **Output** | Boolean indicating if strings are anagrams |
| **Key Insight** | Anagrams have identical character frequencies |
| **Time Complexity** | O(n) using frequency count, O(n log n) using sorting |
| **Space Complexity** | O(1) for array approach, O(k) for hash map |
| **Constraints** | Strings may contain lowercase English letters or Unicode |

### When to Use

- **Validating word relationships**: When you need to check if two words contain the same letters
- **Grouping anagrams**: As a preprocessing step for grouping words by character composition
- **String normalization**: When comparing strings that may have different orderings
- **Scrabble/word game problems**: Checking if a word can be formed from given letters
- **Frequency-based analysis**: Any problem requiring character distribution comparison

---

## Intuition

The core insight for solving the anagram check problem is elegant in its simplicity:

1. **Character Frequency Equality**: Two strings are anagrams if and only if they have identical character frequency counts. "listen" and "silent" both have: 1 s, 1 i, 1 l, 1 e, 1 n, 1 t.

2. **The "Fingerprint" Concept**: Think of character frequencies as a unique fingerprint. Any string with the same fingerprint is an anagram, regardless of character order.

3. **Early Termination**: If strings have different lengths, they cannot be anagrams - this provides an O(1) check before any processing.

4. **Multiple Approaches**: Counting characters (O(n) time) or sorting both strings (O(n log n) time). Counting is generally preferred for efficiency.

---

## Solution Approaches

### Approach 1: Frequency Count Array (Optimal)

The most efficient approach uses a frequency array to count character occurrences. This achieves O(n) time complexity with O(1) space for lowercase English letters.

#### Algorithm

1. Check if strings have equal length. If not, return false.
2. Create a frequency array of size 26 (for lowercase English letters) initialized to zeros.
3. Iterate through the first string, incrementing the count for each character.
4. Iterate through the second string, decrementing the count for each character.
5. If any count is non-zero after processing both strings, return false.
6. Otherwise, return true.

#### Implementation

````carousel
```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        """
        Check if two strings are anagrams using frequency counting.
        Time: O(n), Space: O(1)
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
        
        return True
```
<!-- slide -->
```java
class Solution {
    public boolean isAnagram(String s, String t) {
        /**
         * Check if two strings are anagrams using frequency counting.
         * Time: O(n), Space: O(1)
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
class Solution {
public:
    bool isAnagram(std::string s, std::string t) {
        /**
         * Check if two strings are anagrams using frequency counting.
         * Time: O(n), Space: O(1)
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
 * Time: O(n), Space: O(1)
 * 
 * @param {string} s - First string
 * @param {string} t - Second string
 * @return {boolean} - True if anagrams
 */
var isAnagram = function(s, t) {
    // Early exit if lengths differ
    if (s.length !== t.length) {
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

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through both strings |
| **Space** | O(1) - Fixed size array of 26 elements |

---

### Approach 2: Hash Map (General Character Set)

For strings containing Unicode characters or when the character set is unknown, a hash map (dictionary) approach is more flexible.

#### Algorithm

1. Check if strings have equal length. If not, return false.
2. Create a hash map to store character frequencies.
3. Iterate through the first string, incrementing counts for each character.
4. Iterate through the second string, decrementing counts for each character.
5. If any character count becomes negative or doesn't exist, return false.
6. Otherwise, return true.

#### Implementation

````carousel
```python
from collections import Counter

class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        """
        Check if two strings are anagrams using hash map (Counter).
        Time: O(n), Space: O(k) where k is unique characters
        """
        # Early exit if lengths differ
        if len(s) != len(t):
            return False
        
        # Use Counter for concise frequency counting
        return Counter(s) == Counter(t)
```
<!-- slide -->
```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean isAnagram(String s, String t) {
        /**
         * Check if two strings are anagrams using hash map.
         * Time: O(n), Space: O(k)
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
         * Check if two strings are anagrams using hash map.
         * Time: O(n), Space: O(k)
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
 * Check if two strings are anagrams using hash map.
 * Time: O(n), Space: O(k)
 * 
 * @param {string} s - First string
 * @param {string} t - Second string
 * @return {boolean} - True if anagrams
 */
var isAnagram = function(s, t) {
    if (s.length !== t.length) {
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

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through both strings |
| **Space** | O(k) - Where k is the unique character count |

---

### Approach 3: Sorting

The sorting approach converts both strings to sorted character sequences and compares them. This is conceptually simple but less efficient.

#### Algorithm

1. Check if strings have equal length. If not, return false.
2. Convert both strings to character arrays.
3. Sort both arrays.
4. Compare the sorted arrays element by element.

#### Implementation

````carousel
```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        """
        Check if two strings are anagrams by sorting.
        Time: O(n log n), Space: O(n)
        """
        if len(s) != len(t):
            return False
        
        return sorted(s) == sorted(t)
```
<!-- slide -->
```java
import java.util.Arrays;

class Solution {
    public boolean isAnagram(String s, String t) {
        /**
         * Check if two strings are anagrams by sorting.
         * Time: O(n log n), Space: O(n)
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
         * Check if two strings are anagrams by sorting.
         * Time: O(n log n), Space: O(n)
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
 * Check if two strings are anagrams by sorting.
 * Time: O(n log n), Space: O(n)
 * 
 * @param {string} s - First string
 * @param {string} t - Second string
 * @return {boolean} - True if anagrams
 */
var isAnagram = function(s, t) {
    if (s.length !== t.length) {
        return false;
    }
    
    const sSorted = s.split('').sort().join('');
    const tSorted = t.split('').sort().join('');
    
    return sSorted === tSorted;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - Due to sorting |
| **Space** | O(n) - For storing sorted arrays/strings |

---

### Approach 4: Prime Number Multiplication (Mathematical)

Assign a unique prime number to each character and multiply them together. By the Fundamental Theorem of Arithmetic, equal products imply anagrams.

#### Implementation

````carousel
```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        """
        Check if two strings are anagrams using prime multiplication.
        Time: O(n), Space: O(1)
        Warning: Products can overflow for long strings.
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
         * Check using prime number multiplication.
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
class Solution {
public:
    bool isAnagram(std::string s, std::string t) {
        if (s.length() != t.length()) {
            return false;
        }
        
        const std::vector<int> primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
                43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101};
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
```
<!-- slide -->
```javascript
/**
 * Check using prime number multiplication.
 * Uses BigInt to handle overflow.
 * 
 * @param {string} s - First string
 * @param {string} t - Second string
 * @return {boolean} - True if anagrams
 */
var isAnagram = function(s, t) {
    const primes = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
        43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101
    ];
    
    if (s.length !== t.length) {
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

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through strings |
| **Space** | O(1) - Fixed prime array |

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| **Frequency Count Array** | O(n) | O(1) | **Optimal** - lowercase English letters |
| **Hash Map** | O(n) | O(k) | Unicode/unknown character sets |
| **Sorting** | O(n log n) | O(n) | Quick implementation, any character set |
| **Prime Multiplication** | O(n) | O(1) | Mathematical elegance (overflow risk) |

**Where n is the length of the strings, and k is the number of unique characters.**

---

## Related Problems

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Valid Anagram | [Link](https://leetcode.com/problems/valid-anagram/) | Basic anagram check |
| Find the Difference | [Link](https://leetcode.com/problems/find-the-difference/) | Find extra character in anagram |
| Ransom Note | [Link](https://leetcode.com/problems/ransom-note/) | Check if magazine can form ransom note |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Group Anagrams | [Link](https://leetcode.com/problems/group-anagrams/) | Group words by anagram relationship |
| Find All Anagrams in a String | [Link](https://leetcode.com/problems/find-all-anagrams-in-a-string/) | Find all anagram substrings |
| Permutation in String | [Link](https://leetcode.com/problems/permutation-in-string/) | Check if permutation exists as substring |

---

## Video Tutorial Links

1. [NeetCode - Valid Anagram](https://www.youtube.com/watch?v=9UtInBqnCgA) - Clear explanation of frequency count approach
2. [Back to Back SWE - Anagram Problem](https://www.youtube.com/watch?v=9Kc0eQfXf0o) - Detailed walkthrough
3. [Group Anagrams Explanation](https://www.youtube.com/watch?v=vzdNOK2oB2E) - Extending anagram logic
4. [LeetCode Official Solution](https://www.youtube.com/watch?v=9UtQ5f_jOQQ) - Multiple approaches explained

---

## Summary

### Key Takeaways

1. **Frequency Count is Optimal**: For lowercase English letters, the array-based frequency count provides O(n) time with O(1) space.

2. **Early Termination**: Always check string lengths first for an O(1) optimization.

3. **Hash Map Flexibility**: Use hash maps when dealing with Unicode or unknown character sets.

4. **Sorting Simplicity**: The sorting approach is concise but less efficient at O(n log n).

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Not checking lengths first** | Always check `len(s) != len(t)` before processing |
| **Off-by-one in array indexing** | Ensure `char - 'a'` gives correct 0-25 index |
| **Assuming only lowercase** | Clarify character set constraints with interviewer |
| **Integer overflow in primes** | Use BigInt or avoid prime approach for long strings |

### Follow-up Questions

**Q1: How would you handle case-insensitive anagram checks?**

Convert both strings to the same case (e.g., lowercase) before comparison.

**Q2: What if you needed to ignore spaces and punctuation?**

Preprocess to remove non-alphabetic characters before comparison.

**Q3: How would you find all anagrams of a string in a list?**

Use a hash map to group strings by their sorted form or frequency signature.

**Q4: What is the minimum number of character changes needed to make two strings anagrams?**

Calculate the absolute difference in character frequencies. The answer is half the sum of all differences.

---

## Pattern Source

For more string pattern implementations, see:
- **[String - Anagram Check (Frequency Count/Sort)](/patterns/string-anagram-check-frequency-count-sort)**
- **[String - Matching (Naive/KMP/Rabin-Karp)](/patterns/string-matching-naive-kmp-rabin-karp)**
