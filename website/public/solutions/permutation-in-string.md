# Permutation In String

## Problem Description

Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise.
In other words, return `true` if one of `s1`'s permutations is the substring of `s2`.

### Example 1

**Input:** `s1 = "ab"`, `s2 = "eidbaooo"`  
**Output:** `true`

**Explanation:** `s2` contains one permutation of `s1` (`"ba"`).

### Example 2

**Input:** `s1 = "ab"`, `s2 = "eidboaoo"`  
**Output:** `false`

### Constraints

- `1 <= s1.length, s2.length <= 10^4`
- `s1` and `s2` consist of lowercase English letters.

---

## Solution

````carousel
```python
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        if len(s1) > len(s2):
            return False
        count1 = [0] * 26
        count2 = [0] * 26
        for c in s1:
            count1[ord(c) - ord('a')] += 1
        for i in range(len(s1)):
            count2[ord(s2[i]) - ord('a')] += 1
        if count1 == count2:
            return True
        for i in range(len(s1), len(s2)):
            count2[ord(s2[i - len(s1)]) - ord('a')] -= 1
            count2[ord(s2[i]) - ord('a')] += 1
            if count1 == count2:
                return True
        return False
```

<!-- slide -->

```cpp
#include <vector>
#include <string>
#include <algorithm>

class Solution {
public:
    bool checkInclusion(std::string s1, std::string s2) {
        if (s1.length() > s2.length()) return false;
        
        std::vector<int> count1(26, 0), count2(26, 0);
        
        for (char c : s1) {
            count1[c - 'a']++;
        }
        
        for (int i = 0; i < s1.length(); i++) {
            count2[s2[i] - 'a']++;
        }
        
        if (count1 == count2) return true;
        
        for (int i = s1.length(); i < s2.length(); i++) {
            count2[s2[i - s1.length()] - 'a']--;
            count2[s2[i] - 'a']++;
            if (count1 == count2) return true;
        }
        
        return false;
    }
};
```

<!-- slide -->

```java
import java.util.*;

class Solution {
    public boolean checkInclusion(String s1, String s2) {
        if (s1.length() > s2.length()) return false;
        
        int[] count1 = new int[26];
        int[] count2 = new int[26];
        
        for (char c : s1.toCharArray()) {
            count1[c - 'a']++;
        }
        
        for (int i = 0; i < s1.length(); i++) {
            count2[s2.charAt(i) - 'a']++;
        }
        
        if (Arrays.equals(count1, count2)) return true;
        
        for (int i = s1.length(); i < s2.length(); i++) {
            count2[s2.charAt(i - s1.length()) - 'a']--;
            count2[s2.charAt(i) - 'a']++;
            if (Arrays.equals(count1, count2)) return true;
        }
        
        return false;
    }
}
```

<!-- slide -->

```javascript
/**
 * Check if any window in s2 contains a permutation of s1
 * @param {string} s1 - Pattern string
 * @param {string} s2 - Source string
 * @returns {boolean}
 */
function checkInclusion(s1, s2) {
    if (s1.length > s2.length) return false;
    
    const count1 = new Array(26).fill(0);
    const count2 = new Array(26).fill(0);
    
    for (const c of s1) {
        count1[c.charCodeAt(0) - 97]++;
    }
    
    for (let i = 0; i < s1.length; i++) {
        count2[s2.charCodeAt(i) - 97]++;
    }
    
    if (arraysEqual(count1, count2)) return true;
    
    for (let i = s1.length; i < s2.length; i++) {
        count2[s2.charCodeAt(i - s1.length) - 97]--;
        count2[s2.charCodeAt(i) - 97]++;
        if (arraysEqual(count1, count2)) return true;
    }
    
    return false;
}

// Helper function
function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}
```
````

---

## Explanation

Use a sliding window of length `len(s1)` on `s2`. Maintain frequency counts for `s1` and the current window in `s2`. If counts match, return `true`. Slide the window, updating counts.

### Step-by-step Approach

1. If `s1` is longer than `s2`, return `false`.
2. Initialize count arrays for both strings.
3. Count characters in `s1` and first window of `s2`.
4. If counts match, return `true`.
5. Slide the window through `s2`, updating counts.
6. Return `false` if no match found.

### Complexity Analysis

- **Time Complexity:** O(n), where n is `len(s2)`.
- **Space Complexity:** O(1).

---

## Pattern Reference

This solution uses the **Sliding Window - Character Frequency Matching** pattern. For a comprehensive guide on this pattern including:
- Detailed explanation and intuition
- Multiple approaches with templates in Python, C++, Java, and JavaScript
- Related problems with LeetCode links
- Video tutorial references

See: [Sliding Window - Character Frequency Matching](/patterns/sliding-window-character-frequency-matching)

---

## Related Problems

| Problem | Solution Link | Difficulty |
|---------|---------------|------------|
| Minimum Window Substring | [Minimum Window Substring](/solutions/minimum-window-substring) | Hard |
| Find All Anagrams in a String | [Find All Anagrams](/solutions/find-all-anagrams-in-a-string) | Medium |

---

## Video Resources

- [Permutation in String - NeetCode](https://www.youtube.com/watch?v=UbyhOgBBYGQ)
- [Sliding Window Technique - Abdul Bari](https://www.youtube.com/watch?v=9ZHzBbuZ6VU)
