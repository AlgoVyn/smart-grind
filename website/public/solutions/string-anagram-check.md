# Valid Anagram

## Problem Statement

LeetCode Problem 242: Valid Anagram

Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.

An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once. For example, "listen" and "silent" are anagrams because they contain the same letters in different orders.

### Examples

Here are some examples to illustrate the problem:

- **Input:** `s = "anagram"`, `t = "nagaram"`<br>
  **Output:** `true`<br>
  **Explanation:** Both strings contain the same letters with the same frequencies: a×3, n×1, g×1, r×1, m×1.

- **Input:** `s = "rat"`, `t = "car"`<br>
  **Output:** `false`<br>
  **Explanation:** The strings have different characters. 'r' appears in s but not in t, while 'c' appears in t but not in s.

- **Input:** `s = "a"`, `t = "ab"`<br>
  **Output:** `false`<br>
  **Explanation:** The strings have different lengths, so they cannot be anagrams.

- **Input:** `s = "listen"`, `t = "silent"`<br>
  **Output:** `true`<br>
  **Explanation:** Both strings contain exactly the same letters: l×1, i×1, s×1, t×1, e×1, n×1.

- **Input:** `s = "hello"`, `t = "world"`<br>
  **Output:** `false`<br>
  **Explanation:** While both strings have 5 characters, their character compositions differ significantly.

### Constraints

- `1 <= s.length <= 10^5`
- `1 <= t.length <= 10^5`
- `s` and `t` consist of lowercase English letters ('a' through 'z')
- The solution should be efficient for strings up to 100,000 characters

---

## Intuition

The key insight is straightforward:

> **Two strings are anagrams if and only if they have identical character frequency counts.**

This observation leads to an efficient solution: count the occurrences of each character in both strings and compare the counts. If all character counts match, the strings are anagrams.

Since we're dealing with lowercase English letters only (26 characters), we can use a fixed-size array for counting, which gives us O(1) space complexity.

---

## Approach 1: Frequency Count (Primary and Optimal) ⭐

### Algorithm

1. If the strings have different lengths, return `false` immediately (different length = cannot be anagrams)
2. Create an array of size 26 (for 'a' to 'z') initialized to zeros
3. Iterate through the first string, incrementing the count for each character
4. Iterate through the second string, decrementing the count for each character
5. During the second iteration, if any count becomes negative, return `false` early
6. After processing both strings, if all counts are zero, return `true`

### Implementation

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
            idx = ord(char) - ord('a')
            count[idx] -= 1
            # Early exit if count goes negative
            if count[idx] < 0:
                return False
        
        # All counts should be zero if anagrams
        return True
```

<!-- slide -->
```java
class Solution {
    public boolean isAnagram(String s, String t) {
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
            int idx = t.charAt(i) - 'a';
            count[idx]--;
            if (count[idx] < 0) {
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

### Explanation Step-by-Step

Let's trace through `s = "anagram"` and `t = "nagaram"`:

1. **Length Check:** Both strings have length 7, so we continue.

2. **First Pass (Counting):**
   - 'a': count[0] = 1
   - 'n': count[13] = 1
   - 'a': count[0] = 2
   - 'g': count[6] = 1
   - 'r': count[17] = 1
   - 'a': count[0] = 3
   - 'm': count[12] = 1

3. **Second Pass (Subtracting):**
   - 'n': count[13] = 0 (no early exit)
   - 'a': count[0] = 2 (no early exit)
   - 'g': count[6] = 0 (no early exit)
   - 'a': count[0] = 1 (no early exit)
   - 'r': count[17] = 0 (no early exit)
   - 'a': count[0] = 0 (no early exit)
   - 'm': count[12] = 0 (no early exit)

4. **Final Check:** All counts are zero, return `true`.

### Complexity Analysis

- **Time Complexity:** O(n) - We iterate through each string exactly once.
- **Space Complexity:** O(1) - We use a fixed-size array of 26 integers, regardless of input size.

This is the optimal solution for the given constraints.

---

## Approach 2: Sorting (Simple but Less Efficient)

### Algorithm

1. If the strings have different lengths, return `false` immediately
2. Sort both strings using an efficient sorting algorithm
3. Compare the sorted strings character by character
4. If any character differs, return `false`; otherwise, return `true`

### Implementation

````carousel
<!-- slide -->
```python
class Solution:
    def isAnagram(self, s: str, t: str) ->        Check if two strings are anagrams bool:
        """
 using sorting.
        
        Time: O(n log n) where n is the length of the strings
        Space: O(n) for the sorted strings
        
        This approach is simple but less efficient than counting.
        """
        # Early exit if lengths differ
        if len(s) != len(t):
            return False
        
        # Sort both strings and compare
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

### Explanation Step-by-Step

1. **Length Check:** If lengths differ, return `false` immediately.

2. **Sorting:** Sort both strings. For example:
   - "anagram" → "aaagmnr"
   - "nagaram" → "aaagmnr"

3. **Comparison:** After sorting, both strings are identical, so return `true`.

### Complexity Analysis

- **Time Complexity:** O(n log n) - Sorting dominates the time complexity.
- **Space Complexity:** O(n) - For storing sorted strings (or in-place sorting overhead).

---

## Approach 3: Hash Map (For General Character Sets)

### Algorithm

1. If the strings have different lengths, return `false` immediately
2. Create a hash map (dictionary) to store character counts
3. Iterate through the first string, incrementing counts for each character
4. Iterate through the second string, decrementing counts for each character
5. If any character count is non-zero, return `false`
6. Otherwise, return `true`

### Implementation

````carousel
<!-- slide -->
```python
from collections import Counter

class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        """
        Check if two strings are anagrams using a hash map.
        
        Time: O(n) where n is the length of the strings
        Space: O(k) where k is the number of unique characters
        
        This approach works for any character set.
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
 * * Space: O(k) where k is the number of unique characters
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

### Complexity Analysis

- **Time Complexity:** O(n) - Hash map operations are O(1) on average.
- **Space Complexity:** O(k) - Where k is the number of unique characters.

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Best For |
|----------|-----------------|------------------|----------|
| Frequency Count | O(n) | O(1) | **Recommended** - Optimal for lowercase letters |
| Sorting | O(n log n) | O(n) | Simplicity, any character set |
| Hash Map | O(n) | O(k) | Any character set (unicode, etc.) |

For the standard LeetCode problem (lowercase letters), the **Frequency Count approach is optimal** with O(n) time and O(1) space.

---

## Related Problems

Here are some LeetCode problems that build on similar concepts (string manipulation, character frequency, or anagram-related operations):

- [Group Anagrams (Medium)](https://leetcode.com/problems/group-anagrams/) - Group strings by their anagram equivalence.
- [Find All Anagrams in a String (Medium)](https://leetcode.com/problems/find-all-anagrams-in-a-string/) - Find all anagram start indices in a string.
- [Minimum Number of Steps to Make Two Strings Anagram (Medium)](https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram/) - Calculate minimum character changes.
- [Check if Two String Arrays are Equivalent (Easy)](https://leetcode.com/problems/check-if-two-string-arrays-are-equivalent/) - Compare string arrays.
- [Remove Letter To Make Sorted (Easy)](https://leetcode.com/problems/remove-letter-to-make-sorted/) - Sort by removing minimum letters.
- [Find the Difference of Two Arrays (Easy)](https://leetcode.com/problems/find-the-difference-of-two-arrays/) - Find symmetric difference of two arrays.

---

## Video Tutorial Links

For visual explanations, here are some recommended YouTube tutorials:

- [NeetCode - Valid Anagram Solution](https://www.youtube.com/watch?v=9UtQ5f_jOQQ) - Clear explanation of the frequency counting approach.
- [Back to Back SWE - Anagram Check](https://www.youtube.com/watch?v=3M0LvH1v8cU) - Detailed walkthrough of the solution.
- [LeetCode Official Solution](https://www.youtube.com/watch?v=9UtQ5f_jOQQ) - Official solution explanation.
- [Anagram Groups - Group Anagrams](https://www.youtube.com/watch?v=vP9ogEVG0MQ) - Related problem solution.
- [TechDive - Anagram Detection](https://www.youtube.com/watch?v=IGame7Flt8U) - Alternative explanation.

---

## Follow-up Questions

**1. How would you handle case-insensitive anagram checks?**

**Answer:** Convert both strings to the same case (e.g., lowercase) before comparison. The frequency counting approach works the same way after normalization.

```python
def isAnagramCaseInsensitive(s: str, t: str) -> bool:
    return isAnagram(s.lower(), t.lower())
```

**2. What if you needed to ignore spaces in the comparison?**

**Answer:** Filter out spaces from both strings before processing.

```python
def isAnagramIgnoreSpaces(s: str, t: str) -> bool:
    s_filtered = s.replace(" ", "")
    t_filtered = t.replace(" ", "")
    return isAnagram(s_filtered, t_filtered)
```

**3. How would you find all anagrams of a string in a list?**

**Answer:** Use a hash map to group strings by their sorted form (or frequency signature). Strings with the same signature are anagrams.

```python
from collections import defaultdict

def groupAnagrams(strs: List[str]) -> List[List[str]]:
    groups = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))
        groups[key].append(s)
    return list(groups.values())
```

**4. What is the minimum number of character changes needed to make two strings anagrams?**

**Answer:** Calculate the absolute difference in character frequencies. The answer is half the sum of all differences (since each change fixes two characters).

```python
def minStepsToMakeAnagrams(s: str, t: str) -> int:
    if len(s) != len(t):
        return -1  # Not possible
    
    count = [0] * 26
    for char in s:
        count[ord(char) - ord('a')] += 1
    for char in t:
        count[ord(char) - ord('a')] -= 1
    
    return sum(abs(c) for c in count) // 2
```

**5. How would you check if two strings are anagrams in a single pass without early termination?**

**Answer:** You could count both strings separately and compare the counts at the end.

```python
def isAnagramTwoPass(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    
    count1 = [0] * 26
    count2 = [0] * 26
    
    for char in s:
        count1[ord(char) - ord('a')] += 1
    for char in t:
        count2[ord(char) - ord('a')] += 1
    
    return count1 == count2
```

**6. How would you handle very long strings (millions of characters)?**

**Answer:** The frequency count approach is still optimal with O(n) time. Consider streaming approaches to avoid loading entire strings into memory, though this is rarely needed given the O(n) efficiency.

**7. What if the strings could contain unicode characters?**

**Answer:** Use a hash map instead of a fixed-size array to handle the potentially large character set.

**8. How would you optimize for cache performance with very large strings?**

**Answer:** Process strings in cache-friendly chunks, or use SIMD instructions for character comparison. However, for the given constraints (100K characters), this is unnecessary optimization.

---

## LeetCode Link

[Valid Anagram - LeetCode](https://leetcode.com/problems/valid-anagram/)
