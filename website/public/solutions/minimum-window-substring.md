# Minimum Window Substring

## Problem Description

Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `""`.

The testcases will be generated such that the answer is unique.

---

## Examples

### Example 1

**Input:**
```python
s = "ADOBECODEBANC", t = "ABC"
```

**Output:**
```python
"BANC"
```

**Explanation:**
The minimum window substring `"BANC"` includes 'A', 'B', and 'C' from string `t`.

### Example 2

**Input:**
```python
s = "a", t = "a"
```

**Output:**
```python
"a"
```

**Explanation:**
The entire string `s` is the minimum window.

### Example 3

**Input:**
```python
s = "a", t = "aa"
```

**Output:**
```python
""
```

**Explanation:**
Both 'a's from `t` must be included in the window. Since the largest window of `s` only has one 'a', return empty string.

---

## Constraints

- `m == s.length`
- `n == t.length`
- `1 <= m, n <= 10^5`
- `s` and `t` consist of uppercase and lowercase English letters

**Follow-up:** Could you find an algorithm that runs in O(m + n) time?

---

## Solution

````carousel
```python
from collections import Counter

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        """
        Find minimum window in s containing all characters of t.
        
        Uses sliding window with character frequency counting.
        """
        if not t or not s:
            return ""
        
        dict_t = Counter(t)
        required = len(dict_t)
        
        # Filter s to only include characters present in t
        filtered_s = []
        for i, char in enumerate(s):
            if char in dict_t:
                filtered_s.append((i, char))
        
        l, r = 0, 0
        formed = 0
        window_counts = {}
        ans = float("inf"), None, None
        
        # Sliding window on filtered list
        while r < len(filtered_s):
            character = filtered_s[r][1]
            window_counts[character] = window_counts.get(character, 0) + 1
            
            if window_counts[character] == dict_t[character]:
                formed += 1
            
            # Contract window when all characters are present
            while l <= r and formed == required:
                character = filtered_s[l][1]
                
                # Save smallest window
                end = filtered_s[r][0]
                start = filtered_s[l][0]
                if end - start + 1 < ans[0]:
                    ans = (end - start + 1, start, end)
                
                window_counts[character] -= 1
                if window_counts[character] < dict_t[character]:
                    formed -= 1
                l += 1
            
            r += 1
        
        return "" if ans[0] == float("inf") else s[ans[1] : ans[2] + 1]
```

<!-- slide -->

```cpp
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <climits>

class Solution {
public:
    std::string minWindow(std::string s, std::string t) {
        if (t.empty() || s.empty()) return "";
        
        std::unordered_map<char, int> dict_t;
        for (char c : t) dict_t[c]++;
        
        int required = dict_t.size();
        std::vector<std::pair<int, char>> filtered_s;
        
        // Filter s to only include characters in t
        for (int i = 0; i < s.size(); i++) {
            if (dict_t.find(s[i]) != dict_t.end()) {
                filtered_s.push_back({i, s[i]});
            }
        }
        
        int l = 0, r = 0;
        int formed = 0;
        std::unordered_map<char, int> window_counts;
        std::pair<int, std::pair<int, int>> ans = {INT_MAX, {-1, -1}};
        
        while (r < filtered_s.size()) {
            char c = filtered_s[r].second;
            window_counts[c]++;
            
            if (window_counts[c] == dict_t[c]) {
                formed++;
            }
            
            while (l <= r && formed == required) {
                char c = filtered_s[l].second;
                
                // Update answer
                int end = filtered_s[r].first;
                int start = filtered_s[l].first;
                if (end - start + 1 < ans.first) {
                    ans = {end - start + 1, {start, end}};
                }
                
                window_counts[c]--;
                if (window_counts[c] < dict_t[c]) {
                    formed--;
                }
                l++;
            }
            
            r++;
        }
        
        return ans.first == INT_MAX ? "" : s.substr(ans.second.first, ans.second.second - ans.second.first + 1);
    }
};
```

<!-- slide -->

```java
import java.util.*;

class Solution {
    public String minWindow(String s, String t) {
        if (t.isEmpty() || s.isEmpty()) return "";
        
        Map<Character, Integer> dict_t = new HashMap<>();
        for (char c : t.toCharArray()) {
            dict_t.put(c, dict_t.getOrDefault(c, 0) + 1);
        }
        
        int required = dict_t.size();
        List<int[]> filtered_s = new ArrayList<>();
        
        // Filter s to only include characters in t
        for (int i = 0; i < s.length(); i++) {
            if (dict_t.containsKey(s.charAt(i))) {
                filtered_s.add(new int[]{i, s.charAt(i)});
            }
        }
        
        int l = 0, r = 0;
        int formed = 0;
        Map<Character, Integer> window_counts = new HashMap<>();
        int[] ans = {Integer.MAX_VALUE, -1, -1};
        
        while (r < filtered_s.size()) {
            char c = (char) filtered_s.get(r)[1];
            window_counts.put(c, window_counts.getOrDefault(c, 0) + 1);
            
            if (window_counts.get(c).equals(dict_t.get(c))) {
                formed++;
            }
            
            while (l <= r && formed == required) {
                char c2 = (char) filtered_s.get(l)[1];
                
                int end = filtered_s.get(r)[0];
                int start = filtered_s.get(l)[0];
                if (end - start + 1 < ans[0]) {
                    ans[0] = end - start + 1;
                    ans[1] = start;
                    ans[2] = end;
                }
                
                window_counts.put(c2, window_counts.get(c2) - 1);
                if (window_counts.get(c2) < dict_t.get(c2)) {
                    formed--;
                }
                l++;
            }
            
            r++;
        }
        
        return ans[0] == Integer.MAX_VALUE ? "" : s.substring(ans[1], ans[2] + 1);
    }
}
```

<!-- slide -->

```javascript
/**
 * Find the smallest window in s that contains all characters of t
 * @param {string} s - Source string
 * @param {string} t - Pattern string
 * @returns {string}
 */
function minWindow(s, t) {
    if (!t || !s) return "";
    
    const dict_t = new Map();
    for (const c of t) {
        dict_t.set(c, (dict_t.get(c) || 0) + 1);
    }
    
    const required = dict_t.size;
    const filtered_s = [];
    
    // Filter s to only include characters in t
    for (let i = 0; i < s.length; i++) {
        if (dict_t.has(s[i])) {
            filtered_s.push([i, s[i]]);
        }
    }
    
    let l = 0, r = 0;
    let formed = 0;
    const window_counts = new Map();
    let ans = [Infinity, -1, -1]; // [length, left, right]
    
    while (r < filtered_s.length) {
        const c = filtered_s[r][1];
        window_counts.set(c, (window_counts.get(c) || 0) + 1);
        
        if (window_counts.get(c) === dict_t.get(c)) {
            formed++;
        }
        
        while (l <= r && formed === required) {
            const c2 = filtered_s[l][1];
            
            const end = filtered_s[r][0];
            const start = filtered_s[l][0];
            if (end - start + 1 < ans[0]) {
                ans = [end - start + 1, start, end];
            }
            
            window_counts.set(c2, window_counts.get(c2) - 1);
            if (window_counts.get(c2) < dict_t.get(c2)) {
                formed--;
            }
            l++;
        }
        
        r++;
    }
    
    return ans[0] === Infinity ? "" : s.substring(ans[1], ans[2] + 1);
}
```
````

---

## Explanation

This problem requires finding the smallest substring in `s` that contains all characters of `t`, including duplicates.

### Algorithm Steps

1. **Frequency count**: Use a counter for `t` to know required character counts.

2. **Filter s**: Create a list of (index, char) for characters in `s` that are in `t`.

3. **Sliding window**: Use two pointers on the filtered list:
   - Expand right, add character to window
   - When all required characters are present, try to contract left
   - Track the minimum window

4. **Return result**: If valid window found, return substring; else, empty string.

---

## Complexity Analysis

- **Time Complexity:** O(m + n), where m is length of s and n is length of t
- **Space Complexity:** O(m + n), for the filtered list and counters

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
| Permutation in String | [Permutation In String](/solutions/permutation-in-string) | Medium |
| Find All Anagrams in a String | [Find All Anagrams](/solutions/find-all-anagrams-in-a-string) | Medium |

---

## Video Resources

- [Minimum Window Substring - NeetCode](https://www.youtube.com/watch?v=jSto0O4Zb4M)
- [Sliding Window Technique - Abdul Bari](https://www.youtube.com/watch?v=9ZHzBbuZ6VU)
