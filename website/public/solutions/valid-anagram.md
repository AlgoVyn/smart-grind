# Valid Anagram

## Problem Description

Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.

An **anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

**Link to problem:** [Valid Anagram - LeetCode 242](https://leetcode.com/problems/valid-anagram/)

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `s = "anagram"`<br>`t = "nagaram"` | `true` |

**Explanation:** Both strings contain the same characters with the same frequencies.

**Example 2:**

| Input | Output |
|-------|--------|
| `s = "rat"`<br>`t = "car"` | `false` |

**Explanation:** "rat" has 'r', 'a', 't' while "car" has 'c', 'a', 'r'.

## Constraints

- `1 <= s.length, t.length <= 5 * 10^4`
- `s` and `t` consist of lowercase English letters.

### Follow up

What if the inputs contain Unicode characters? How would you adapt your solution to such a case?

---

## Pattern: Character Frequency Counting

This problem demonstrates the **Hash Table/Frequency Counting** pattern. The key is to count character frequencies in both strings and compare them.

### Core Concept

1. Anagrams have identical character frequencies
2. Count characters in both strings
3. Compare the frequency maps

---

## Intuition

### Why Frequency Counting Works

- If strings are anagrams, each character appears the same number of times in both
- Order doesn't matter, only frequency
- Can use array of size 26 for lowercase letters or hash map for Unicode

### Alternative Approaches

1. **Sorting**: Sort both strings and compare (O(n log n))
2. **Frequency Array**: Use fixed-size array for 26 letters (O(n))
3. **Hash Map**: Use dictionary for general characters (O(n))

---

## Multiple Approaches with Code

## Approach 1: Frequency Array (Optimal for lowercase)

Using a fixed-size array of 26 for lowercase English letters - most efficient.

````carousel
```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        """
        Check if two strings are anagrams using frequency array.
        
        Args:
            s: First string
            t: Second string
            
        Returns:
            True if t is an anagram of s
        """
        # Quick length check
        if len(s) != len(t):
            return False
        
        # Frequency array for 26 lowercase letters
        count = [0] * 26
        
        # Count characters in s, subtract in t
        for i in range(len(s)):
            count[ord(s[i]) - ord('a')] += 1
            count[ord(t[i]) - ord('a')] -= 1
        
        # Check if all counts are zero
        return all(c == 0 for c in count)
```
<!-- slide -->
```cpp
class Solution {
public:
    bool isAnagram(string s, string t) {
        // Quick length check
        if (s.length() != t.length()) {
            return false;
        }
        
        // Frequency array for 26 lowercase letters
        int count[26] = {0};
        
        // Count characters in s, subtract in t
        for (int i = 0; i < s.length(); i++) {
            count[s[i] - 'a']++;
            count[t[i] - 'a']--;
        }
        
        // Check if all counts are zero
        for (int i = 0; i < 26; i++) {
            if (count[i] != 0) {
                return false;
            }
        }
        
        return true;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean isAnagram(String s, String t) {
        // Quick length check
        if (s.length() != t.length()) {
            return false;
        }
        
        // Frequency array for 26 lowercase letters
        int[] count = new int[26];
        
        // Count characters in s, subtract in t
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        
        // Check if all counts are zero
        for (int c : count) {
            if (c != 0) {
                return false;
            }
        }
        
        return true;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
    // Quick length check
    if (s.length !== t.length) {
        return false;
    }
    
    // Frequency array for 26 lowercase letters
    const count = new Array(26).fill(0);
    
    // Count characters in s, subtract in t
    for (let i = 0; i < s.length; i++) {
        count[s.charCodeAt(i) - 97]++;
        count[t.charCodeAt(i) - 97]--;
    }
    
    // Check if all counts are zero
    return count.every(c => c === 0);
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n) - single pass through strings |
| **Space** | O(1) - fixed size array of 26 |

---

## Approach 2: Using Counter/Hash Map

Using Python's Counter or hash maps - works for any characters including Unicode.

````carousel
```python
from collections import Counter

class Solution:
    def isAnagram_counter(self, s: str, t: str) -> bool:
        """
        Check using Counter - works for Unicode.
        
        Args:
            s: First string
            t: Second string
            
        Returns:
            True if anagrams
        """
        return Counter(s) == Counter(t)
```
<!-- slide -->
```cpp
#include <unordered_map>
using namespace std;

class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.length() != t.length()) {
            return false;
        }
        
        unordered_map<char, int> count;
        
        for (int i = 0; i < s.length(); i++) {
            count[s[i]]++;
            count[t[i]]--;
        }
        
        for (auto& pair : count) {
            if (pair.second != 0) {
                return false;
            }
        }
        
        return true;
    }
};
```
<!-- slide -->
```java
import java.util.HashMap;

class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }
        
        HashMap<Character, Integer> count = new HashMap<>();
        
        for (int i = 0; i < s.length(); i++) {
            count.put(s.charAt(i), count.getOrDefault(s.charAt(i), 0) + 1);
            count.put(t.charAt(i), count.getOrDefault(t.charAt(i), 0) - 1);
        }
        
        for (int val : count.values()) {
            if (val != 0) {
                return false;
            }
        }
        
        return true;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
    if (s.length !== t.length) {
        return false;
    }
    
    const count = {};
    
    for (let i = 0; i < s.length; i++) {
        count[s[i]] = (count[s[i]] || 0) + 1;
        count[t[i]] = (count[t[i]] || 0) - 1;
    }
    
    for (const key in count) {
        if (count[key] !== 0) {
            return false;
        }
    }
    
    return true;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n) - single pass |
| **Space** | O(k) - where k is unique characters |

---

## Approach 3: Sorting (Simple but slower)

Sort both strings and compare - works for any characters.

````carousel
```python
class Solution:
    def isAnagram_sort(self, s: str, t: str) -> bool:
        """
        Check by sorting strings - works for Unicode.
        
        Args:
            s: First string
            t: Second string
            
        Returns:
            True if anagrams
        """
        return sorted(s) == sorted(t)
```
<!-- slide -->
```cpp
#include <algorithm>
using namespace std;

class Solution {
public:
    bool isAnagram(string s, string t) {
        sort(s.begin(), s.end());
        sort(t.begin(), t.end());
        return s == t;
    }
};
```
<!-- slide -->
```java
class Solution {
    public boolean isAnagram(String s, String t) {
        char[] sArr = s.toCharArray();
        char[] tArr = t.toCharArray();
        Arrays.sort(sArr);
        Arrays.sort(tArr);
        return Arrays.equals(sArr, tArr);
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
    return s.split('').sort().join('') === t.split('').sort().join('');
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n log n) - due to sorting |
| **Space** | O(n) - for sorted strings |

---

## Comparison of Approaches

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Frequency Array** | O(n) | O(1) | Lowercase letters |
| **Hash Map/Counter** | O(n) | O(k) | Unicode/general |
| **Sorting** | O(n log n) | O(n) | Simplicity |

**Best Approach:** Frequency Array (Approach 1) is optimal for lowercase English letters.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very commonly asked in technical interviews
- **Companies**: Google, Meta, Amazon, Microsoft, Bloomberg
- **Difficulty**: Easy
- **Concepts**: Hash tables, frequency counting

### Key Insights

1. Anagrams have identical character frequencies
2. Use array for 26 letters, map for Unicode
3. Single pass is sufficient with proper counting

---

## Follow up: Unicode Handling

The frequency array approach works for lowercase English letters. For Unicode:

**Answer:** Use a hash map (dictionary) instead of a fixed-size array. The time complexity remains O(n) but space becomes O(k) where k is the number of unique characters. Python's Counter handles this automatically.

---

## Related Problems

### Same Pattern (Frequency Counting)

| Problem | LeetCode Link | Difficulty |
|---------|---------------|-------------|
| Group Anagrams | [Link](https://leetcode.com/problems/group-anagrams/) | Medium |
| Find All Anagrams | [Link](https://leetcode.com/problems/find-all-anagrams-in-a-string/) | Medium |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Ransom Note | [Link](https://leetcode.com/problems/ransom-note/) | Easy | Frequency counting |
| First Unique Character | [Link](https://leetcode.com/problems/first-unique-character-in-a-string/) | Easy | Hash map |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Valid Anagram](https://www.youtube.com/watch?v=9N3-1k05p14)** - Clear explanation
2. **[LeetCode Official Solution](https://www.youtube.com/watch?v=9N3-1k05p14)** - Official walkthrough

### Additional Resources

- **[Anagram - Wikipedia](https://en.wikipedia.org/wiki/Anagram)** - Background on anagrams
- **[Hash Tables - GeeksforGeeks](https://www.geeksforgeeks.org/hashing-data-structure/)** - Hash table guide

---

## Follow-up Questions

### Q1: What if you need to check multiple string pairs?

**Answer:** Pre-compute character signatures (sorted string or frequency count) and compare. This can be done in O(n) per string after O(n log n) preprocessing.

---

### Q2: How would you handle case sensitivity?

**Answer:** Convert both strings to lowercase (or uppercase) before counting. The algorithm remains the same.

---

### Q3: Can you use XOR to solve this?

**Answer:** No, XOR only works when each character appears exactly twice. Anagrams may have different frequencies, so XOR cannot distinguish between "ab" and "aabb".

---

### Q4: What's the space complexity for the frequency array?

**Answer:** O(1) because the array size is fixed at 26 regardless of input size. This is constant space for this problem.

---

### Q5: How would you handle spaces or special characters?

**Answer:** For fixed character sets like ASCII, expand the array size. For variable sets like Unicode, use a hash map/dictionary.

---

## Common Pitfalls

### 1. Forgetting Length Check
**Issue:** Not checking if lengths are equal first.

**Solution:** Add early return `if len(s) != len(t): return False`

### 2. Using Wrong Index
**Issue:** Using ASCII values directly instead of offset from 'a'.

**Solution:** Use `ord(c) - ord('a')` to get 0-25 index.

### 3. Not Initializing Count
**Issue:** Forgetting to initialize the count array.

**Solution:** Always initialize with `[0] * 26` or similar.

---

## Summary

The **Valid Anagram** problem demonstrates:

- **Frequency Counting**: O(n) solution using arrays or hash maps
- **Pattern Recognition**: Identify when to use hash tables
- **Space Optimization**: Fixed array for known character sets

Key takeaways:
1. Anagrams have identical character frequencies
2. Use frequency array for lowercase (O(1) space)
3. Use hash map for Unicode/general characters
4. Sorting also works but is slower (O(n log n))

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/valid-anagram/discuss/)
- [Pattern: Hash Table](/patterns/hash-table)
