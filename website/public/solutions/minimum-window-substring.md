# Minimum Window Substring

**Link to problem:** [Minimum Window Substring - LeetCode 76](https://leetcode.com/problems/minimum-window-substring/)

## Problem Description

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Sliding Window (Optimal)** - O(m + n) time
2. **Expanded Sliding Window** - Alternative implementation

---

## Pattern: Sliding Window / Hash Map

This problem demonstrates algorithmic problem-solving patterns.

Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `""`.

The testcases will be generated such that the answer is unique.

---

## Examples

### Example

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

## Intuition

The key insight is using the **sliding window** technique:

1. **Expand Right**: Keep expanding the right pointer to include more characters
2. **Check Validity**: When the window contains all characters of `t`, try to shrink from the left
3. **Contract Left**: Move left pointer to find smaller valid windows
4. **Track Minimum**: Record the smallest window found

The trick is maintaining character frequency counts and tracking how many unique character types have met their required count.

---

## Approach 1: Sliding Window (Optimal)

### Algorithm Steps

1. Create frequency counter for characters in t
2. Use two pointers (left, right) to form a sliding window
3. Expand right to include more characters
4. When window contains all characters of t, try to shrink from left
5. Track minimum window found

### Code Implementation

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

## Approach 2: Two Hash Maps (Alternative)

### Algorithm Steps

1. Use two hash maps: one for t's character counts, one for window's character counts
2. Expand window by moving right pointer
3. When window is valid (contains all chars in t), try to shrink from left
4. Use a "formed" counter to track how many characters have met their required count

### Code Implementation

````carousel
```python
from collections import Counter

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        """
        Find minimum window substring using two hash maps.
        """
        if not t or not s:
            return ""
        
        # Count characters in t
        dict_t = Counter(t)
        required = len(dict_t)
        
        # Sliding window pointers
        left = right = 0
        
        # Current window character counts
        window_counts = {}
        
        # Track how many unique characters have met their requirement
        formed = 0
        
        # Result: (length, left, right)
        ans = float('inf'), 0, 0
        
        while right < len(s):
            # Add character to window
            char = s[right]
            window_counts[char] = window_counts.get(char, 0) + 1
            
            # Check if this character meets requirement
            if char in dict_t and window_counts[char] == dict_t[char]:
                formed += 1
            
            # Try to shrink window while it's valid
            while formed == required:
                char = s[left]
                
                # Update answer
                if right - left + 1 < ans[0]:
                    ans = (right - left + 1, left, right)
                
                # Remove character from window
                window_counts[char] -= 1
                if char in dict_t and window_counts[char] < dict_t[char]:
                    formed -= 1
                
                left += 1
            
            right += 1
        
        return "" if ans[0] == float('inf') else s[ans[1]:ans[2]+1]
```

<!-- slide -->
```cpp
class Solution {
public:
    string minWindow(string s, string t) {
        if (s.empty() || t.empty()) return "";
        
        // Count required characters
        vector<int> required(128, 0);
        for (char c : t) required[c]++;
        
        int left = 0, right = 0;
        int formed = 0, required_cnt = t.size();
        vector<int> window(128, 0);
        
        int ans_left = -1, ans_right = -1, ans_len = INT_MAX;
        
        while (right < s.size()) {
            window[s[right]]++;
            if (required[s[right]] && window[s[right]] == required[s[right]]) {
                formed++;
            }
            
            while (formed == required_cnt) {
                if (right - left + 1 < ans_len) {
                    ans_len = right - left + 1;
                    ans_left = left;
                    ans_right = right;
                }
                
                window[s[left]]--;
                if (required[s[left]] && window[s[left]] < required[s[left]]) {
                    formed--;
                }
                left++;
            }
            right++;
        }
        
        return ans_left == -1 ? "" : s.substr(ans_left, ans_len);
    }
};
```

<!-- slide -->
```java
class Solution {
    public String minWindow(String s, String t) {
        if (s.isEmpty() || t.isEmpty()) return "";
        
        // Count required characters
        int[] required = new int[128];
        for (char c : t.toCharArray()) required[c]++;
        
        int left = 0, right = 0;
        int formed = 0, requiredCnt = t.length();
        int[] window = new int[128];
        
        int ansLeft = -1, ansRight = -1, ansLen = Integer.MAX_VALUE;
        
        while (right < s.length()) {
            char c = s.charAt(right);
            window[c]++;
            if (required[c] > 0 && window[c] == required[c]) {
                formed++;
            }
            
            while (formed == requiredCnt) {
                if (right - left + 1 < ansLen) {
                    ansLen = right - left + 1;
                    ansLeft = left;
                    ansRight = right;
                }
                
                char leftChar = s.charAt(left);
                window[leftChar]--;
                if (required[leftChar] > 0 && window[leftChar] < required[leftChar]) {
                    formed--;
                }
                left++;
            }
            right++;
        }
        
        return ansLeft == -1 ? "" : s.substring(ansLeft, ansRight + 1);
    }
}
```

<!-- slide -->
```javascript
var minWindow = function(s, t) {
    if (!s || !t) return "";
    
    // Count required characters
    const required = {};
    for (const c of t) required[c] = (required[c] || 0) + 1;
    
    let left = 0, right = 0;
    let formed = 0, requiredCnt = Object.keys(required).length;
    const window = {};
    
    let ansLeft = -1, ansRight = -1, ansLen = Infinity;
    
    while (right < s.length) {
        const char = s[right];
        window[char] = (window[char] || 0) + 1;
        
        if (required[char] && window[char] === required[char]) {
            formed++;
        }
        
        while (formed === requiredCnt) {
            if (right - left + 1 < ansLen) {
                ansLen = right - left + 1;
                ansLeft = left;
                ansRight = right;
            }
            
            const leftChar = s[left];
            window[leftChar]--;
            if (required[leftChar] && window[leftChar] < required[leftChar]) {
                formed--;
            }
            left++;
        }
        right++;
    }
    
    return ansLeft === -1 ? "" : s.substring(ansLeft, ansRight + 1);
};
```
````

---

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m + n) - Each character visited at most twice |
| **Space** | O(1) - Fixed size arrays for 128 characters |

---

## Comparison of Approaches

| Aspect | Sliding Window | Two Hash Maps |
|--------|----------------|---------------|
| **Time** | O(m + n) | O(m + n) |
| **Space** | O(1) | O(1) |
| **Implementation** | Filtered approach | Direct approach |

---

## Related Problems

| Problem | Solution Link | Difficulty |
|---------|---------------|------------|
| Permutation in String | [Permutation In String](/solutions/permutation-in-string) | Medium |
| Find All Anagrams in a String | [Find All Anagrams](/solutions/find-all-anagrams-in-a-string) | Medium |

---

## Follow-up Questions

### Q1: Can you solve this in O(n) time?

**Answer:** Yes! The sliding window approach already achieves O(m + n) time complexity where m is the length of s and n is the length of t. Each character in s is visited at most twice (once by right pointer, once by left pointer).

### Q2: How would you modify the solution to return the actual substring?

**Answer:** Instead of just tracking the minimum length, also track the starting and ending indices. When a smaller window is found, store these indices and return `s[start:end+1]` at the end.

### Q3: What if t contains characters not in s?

**Answer:** The algorithm naturally handles this - it will never find a valid window and returns an empty string.

### Q4: How would you handle case-sensitive vs case-insensitive comparison?

**Answer:** Convert both strings to lowercase (or uppercase) before processing if case-insensitive matching is required.

### Q5: What if you need the minimum window containing ALL characters from t in ANY order (permutation) instead of all character types?

**Answer:** This is a different problem (Permutation in String). You would need to use a sliding window with character frequency matching that tracks all required characters in exact quantities.

---

## Common Pitfalls

### 1. Not Filtering Characters
**Issue**: Processing all characters in s instead of only those in t.

**Solution**: Create a filtered list of indices containing only characters from t to reduce unnecessary processing.

### 2. Wrong Comparison Logic
**Issue**: Using `==` instead of `>=` when checking if character count requirements are met.

**Solution**: Use `>=` because the window may have more of a character than needed.

### 3. Not Updating Answer During Contraction
**Issue**: Only updating answer when expanding, missing updates during window contraction.

**Solution**: Update the answer inside the inner while loop where the window is being contracted.

### 4. Off-by-One Errors in Index Calculation
**Issue**: Incorrect substring extraction due to index boundaries.

**Solution**: Use `end - start + 1` for length, and `s[start:end+1]` for substring extraction.

### 5. Not Handling Empty Strings
**Issue**: Not checking for empty s or t at the beginning.

**Solution**: Return empty string early if either s or t is empty.

---

## Video Resources

- [Minimum Window Substring - NeetCode](https://www.youtube.com/watch?v=jSto0O4Zb4M)
- [Sliding Window Technique - Abdul Bari](https://www.youtube.com/watch?v=9ZHzBbuZ6VU)

---

## Summary

The **Minimum Window Substring** problem is a classic sliding window problem that demonstrates the power of the two-pointer technique with frequency counting:

- **Sliding Window**: Efficiently expand and contract a window to find the minimum substring
- **Character Frequency Matching**: Track required character counts using counters
- **Time Complexity**: O(m + n) - each character visited at most twice
- **Space Complexity**: O(m + n) - for filtered list and counters

The key insight is using a filtered list of only relevant characters and maintaining two pointers that dynamically adjust the window based on whether all required characters are present.

This problem is an excellent demonstration of how sliding window can optimize substring searching problems.

### Pattern Summary

This problem exemplifies the **Sliding Window - Character Frequency Matching** pattern, which is characterized by:
- Using two pointers to define a window
- Tracking character frequencies with counters
- Expanding right pointer to include characters
- Contract left pointer when conditions are met
- Finding optimal window size through dynamic adjustment

For more details on this pattern and its variations, see the **[Sliding Window - Character Frequency Matching Pattern](/patterns/sliding-window-character-frequency-matching)**.
