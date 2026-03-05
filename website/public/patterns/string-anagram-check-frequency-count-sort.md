# String - Anagram Check (Frequency Count/Sort)

## Problem Description

The **Anagram Check** pattern involves determining if two strings are anagrams of each other. An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Input** | Two strings to compare |
| **Output** | Boolean indicating if strings are anagrams |
| **Key Insight** | Anagrams have identical character frequencies |
| **Time Complexity** | O(n) using frequency count, O(n log n) using sorting |
| **Space Complexity** | O(k) where k is the character set size |

### When to Use

- **Validating word relationships**: When you need to check if two words contain the same letters
- **Grouping anagrams**: As a preprocessing step for grouping words by their character composition
- **String normalization**: When comparing strings that may have different orderings
- **Scrabble/word game problems**: Checking if a word can be formed from given letters
- **Signature generation**: Creating a unique identifier based on character composition

---

## Intuition

The core insight behind anagram checking is elegant in its simplicity:

1. **Character Frequency Equality**: Two strings are anagrams if and only if they contain exactly the same characters with exactly the same frequencies. "listen" and "silent" both have: 1 s, 1 i, 1 l, 1 e, 1 n, 1 t.

2. **The "Fingerprint" Concept**: Think of character frequencies as a unique fingerprint. Any string with the same fingerprint is an anagram, regardless of character order.

3. **Early Termination**: If strings have different lengths, they cannot be anagrams - this provides an O(1) check before any processing.

4. **Counting vs Sorting**: There are two main approaches - counting characters (O(n) time) or sorting both strings (O(n log n) time). Counting is generally preferred for efficiency.

---

## Solution Approaches

### Approach 1: Frequency Count Array (Optimal)

The most efficient approach uses a frequency array to count character occurrences. This achieves O(n) time complexity with minimal overhead.

#### Algorithm

1. Check if strings have equal length. If not, return false.
2. Create a frequency array of size 26 (for lowercase English letters) initialized to zeros.
3. Iterate through both strings simultaneously:
   - Increment count for character from first string
   - Decrement count for character from second string
4. Check if all frequency counts are zero. If yes, strings are anagrams.

#### Implementation

````carousel
```python
def is_anagram_frequency(s: str, t: str) -> bool:
    """
    Check if two strings are anagrams using frequency count.
    
    Args:
        s: First string
        t: Second string
        
    Returns:
        True if strings are anagrams, False otherwise
    """
    # Early termination: different lengths cannot be anagrams
    if len(s) != len(t):
        return False
    
    # Frequency array for 26 lowercase letters
    freq = [0] * 26
    
    # Count characters in both strings
    for i in range(len(s)):
        freq[ord(s[i]) - ord('a')] += 1
        freq[ord(t[i]) - ord('a')] -= 1
    
    # Check if all frequencies are zero
    for count in freq:
        if count != 0:
            return False
    
    return True
```

<!-- slide -->
```cpp
bool isAnagramFrequency(string s, string t) {
    /**
     * Check if two strings are anagrams using frequency count.
     * 
     * @param s First string
     * @param t Second string
     * @return True if strings are anagrams
     */
    // Early termination: different lengths
    if (s.length() != t.length()) {
        return false;
    }
    
    // Frequency array for 26 lowercase letters
    int freq[26] = {0};
    
    // Count characters in both strings
    for (int i = 0; i < s.length(); i++) {
        freq[s[i] - 'a']++;
        freq[t[i] - 'a']--;
    }
    
    // Check if all frequencies are zero
    for (int i = 0; i < 26; i++) {
        if (freq[i] != 0) {
            return false;
        }
    }
    
    return true;
}
```

<!-- slide -->
```java
public boolean isAnagramFrequency(String s, String t) {
    /**
     * Check if two strings are anagrams using frequency count.
     * 
     * @param s First string
     * @param t Second string
     * @return True if strings are anagrams
     */
    // Early termination: different lengths
    if (s.length() != t.length()) {
        return false;
    }
    
    // Frequency array for 26 lowercase letters
    int[] freq = new int[26];
    
    // Count characters in both strings
    for (int i = 0; i < s.length(); i++) {
        freq[s.charAt(i) - 'a']++;
        freq[t.charAt(i) - 'a']--;
    }
    
    // Check if all frequencies are zero
    for (int count : freq) {
        if (count != 0) {
            return false;
        }
    }
    
    return true;
}
```

<!-- slide -->
```javascript
function isAnagramFrequency(s, t) {
    /**
     * Check if two strings are anagrams using frequency count.
     * 
     * @param {string} s - First string
     * @param {string} t - Second string
     * @return {boolean} True if strings are anagrams
     */
    // Early termination: different lengths
    if (s.length !== t.length) {
        return false;
    }
    
    // Frequency array for 26 lowercase letters
    const freq = new Array(26).fill(0);
    
    // Count characters in both strings
    for (let i = 0; i < s.length; i++) {
        freq[s.charCodeAt(i) - 'a'.charCodeAt(0)]++;
        freq[t.charCodeAt(i) - 'a'.charCodeAt(0)]--;
    }
    
    // Check if all frequencies are zero
    for (let count of freq) {
        if (count !== 0) {
            return false;
        }
    }
    
    return true;
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through both strings plus 26 checks |
| **Space** | O(1) - Fixed size array of 26 elements |

---

### Approach 2: Frequency Count with Hash Map (Unicode Support)

For strings containing Unicode characters or when the character set is unknown, a hash map (dictionary) approach is more flexible.

#### Algorithm

1. Check if strings have equal length. If not, return false.
2. Create a hash map to store character frequencies.
3. Iterate through first string, incrementing counts for each character.
4. Iterate through second string, decrementing counts for each character.
5. If any count becomes negative or a character doesn't exist, return false.
6. Verify all counts are zero (optional, length check handles this).

#### Implementation

````carousel
```python
from collections import Counter

def is_anagram_hashmap(s: str, t: str) -> bool:
    """
    Check if two strings are anagrams using hash map (Counter).
    Supports Unicode characters.
    
    Args:
        s: First string
        t: Second string
        
    Returns:
        True if strings are anagrams, False otherwise
    """
    # Early termination: different lengths
    if len(s) != len(t):
        return False
    
    # Use Counter for automatic frequency counting
    return Counter(s) == Counter(t)


def is_anagram_manual_hashmap(s: str, t: str) -> bool:
    """
    Manual hash map implementation without Counter.
    """
    if len(s) != len(t):
        return False
    
    freq = {}
    
    # Count characters in first string
    for char in s:
        freq[char] = freq.get(char, 0) + 1
    
    # Decrement counts for second string
    for char in t:
        if char not in freq:
            return False
        freq[char] -= 1
        if freq[char] < 0:
            return False
    
    return True
```

<!-- slide -->
```cpp
#include <unordered_map>

bool isAnagramHashmap(string s, string t) {
    /**
     * Check if two strings are anagrams using hash map.
     * Supports extended character sets.
     * 
     * @param s First string
     * @param t Second string
     * @return True if strings are anagrams
     */
    if (s.length() != t.length()) {
        return false;
    }
    
    unordered_map<char, int> freq;
    
    // Count characters in first string
    for (char c : s) {
        freq[c]++;
    }
    
    // Decrement counts for second string
    for (char c : t) {
        if (freq.find(c) == freq.end() || freq[c] == 0) {
            return false;
        }
        freq[c]--;
    }
    
    return true;
}
```

<!-- slide -->
```java
import java.util.HashMap;
import java.util.Map;

public boolean isAnagramHashmap(String s, String t) {
    /**
     * Check if two strings are anagrams using hash map.
     * 
     * @param s First string
     * @param t Second string
     * @return True if strings are anagrams
     */
    if (s.length() != t.length()) {
        return false;
    }
    
    Map<Character, Integer> freq = new HashMap<>();
    
    // Count characters in first string
    for (char c : s.toCharArray()) {
        freq.put(c, freq.getOrDefault(c, 0) + 1);
    }
    
    // Decrement counts for second string
    for (char c : t.toCharArray()) {
        if (!freq.containsKey(c) || freq.get(c) == 0) {
            return false;
        }
        freq.put(c, freq.get(c) - 1);
    }
    
    return true;
}
```

<!-- slide -->
```javascript
function isAnagramHashmap(s, t) {
    /**
     * Check if two strings are anagrams using hash map.
     * 
     * @param {string} s - First string
     * @param {string} t - Second string
     * @return {boolean} True if strings are anagrams
     */
    if (s.length !== t.length) {
        return false;
    }
    
    const freq = new Map();
    
    // Count characters in first string
    for (const char of s) {
        freq.set(char, (freq.get(char) || 0) + 1);
    }
    
    // Decrement counts for second string
    for (const char of t) {
        if (!freq.has(char) || freq.get(char) === 0) {
            return false;
        }
        freq.set(char, freq.get(char) - 1);
    }
    
    return true;
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through both strings |
| **Space** | O(k) - Where k is the unique character count |

---

### Approach 3: Sorting (Simple but Less Efficient)

The sorting approach converts both strings to sorted character sequences and compares them. This is conceptually simple but less efficient.

#### Algorithm

1. Check if strings have equal length. If not, return false.
2. Convert both strings to character arrays.
3. Sort both arrays.
4. Compare the sorted arrays element by element.

#### Implementation

````carousel
```python
def is_anagram_sort(s: str, t: str) -> bool:
    """
    Check if two strings are anagrams by sorting.
    
    Args:
        s: First string
        t: Second string
        
    Returns:
        True if strings are anagrams, False otherwise
    """
    # Early termination: different lengths
    if len(s) != len(t):
        return False
    
    # Sort and compare
    return sorted(s) == sorted(t)
```

<!-- slide -->
```cpp
#include <algorithm>

bool isAnagramSort(string s, string t) {
    /**
     * Check if two strings are anagrams by sorting.
     * 
     * @param s First string
     * @param t Second string
     * @return True if strings are anagrams
     */
    if (s.length() != t.length()) {
        return false;
    }
    
    sort(s.begin(), s.end());
    sort(t.begin(), t.end());
    
    return s == t;
}
```

<!-- slide -->
```java
import java.util.Arrays;

public boolean isAnagramSort(String s, String t) {
    /**
     * Check if two strings are anagrams by sorting.
     * 
     * @param s First string
     * @param t Second string
     * @return True if strings are anagrams
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
```

<!-- slide -->
```javascript
function isAnagramSort(s, t) {
    /**
     * Check if two strings are anagrams by sorting.
     * 
     * @param {string} s - First string
     * @param {string} t - Second string
     * @return {boolean} True if strings are anagrams
     */
    if (s.length !== t.length) {
        return false;
    }
    
    const sSorted = s.split('').sort().join('');
    const tSorted = t.split('').sort().join('');
    
    return sSorted === tSorted;
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - Due to sorting |
| **Space** | O(n) - For storing sorted arrays/strings |

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| **Frequency Count Array** | O(n) | O(1) | Lowercase English letters, optimal performance |
| **Hash Map** | O(n) | O(k) | Unicode/unknown character sets |
| **Sorting** | O(n log n) | O(n) | Quick implementation, interviews |

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

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Window Substring | [Link](https://leetcode.com/problems/minimum-window-substring/) | Find minimum substring containing all characters |
| Substring with Concatenation of All Words | [Link](https://leetcode.com/problems/substring-with-concatenation-of-all-words/) | Find concatenated permutations |

---

## Video Tutorial Links

1. [NeetCode - Valid Anagram](https://www.youtube.com/watch?v=9UtInBqnCgA) - Clear explanation of frequency count approach
2. [Back to Back SWE - Anagram Problem](https://www.youtube.com/watch?v=9Kc0eQfXf0o) - Detailed walkthrough
3. [LeetCode Official Solution](https://www.youtube.com/watch?v=9Kc0eQfXf0o) - Multiple approaches explained
4. [Group Anagrams Explanation](https://www.youtube.com/watch?v=vzdNOK2oB2E) - Extending anagram logic

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
| **Modifying original strings** | Create copies when sorting to avoid side effects |
| **Integer overflow in frequency** | Use appropriate data types for large strings |

### Follow-up Questions

**Q1: How would you handle strings with spaces and punctuation?**

Preprocess to remove non-alphabetic characters and convert to consistent case:
```python
import re
cleaned = re.sub(r'[^a-zA-Z]', '', s).lower()
```

**Q2: Can you solve this with O(1) extra space for Unicode strings?**

No - you need at least O(k) space to track k unique characters. However, you can modify one string in-place if allowed.

**Q3: How would you find all anagrams of a string efficiently?**

Generate the frequency signature (tuple of counts) and use as a hash map key to group all anagrams together.

**Q4: What if the strings are extremely large (billions of characters)?**

Use streaming algorithms with probabilistic data structures like Count-Min Sketch for approximate results.

---

## Pattern Source

For more string pattern implementations, see:
- **[String - Anagram Check](/patterns/string-anagram-check)**
- **[String - Matching (Naive/KMP/Rabin-Karp)](/patterns/string-matching-naive-kmp-rabin-karp)**
