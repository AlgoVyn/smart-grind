# Sliding Window - Character Frequency Matching

## Overview

The **Character Frequency Matching** pattern using Sliding Window is a powerful technique used to solve problems where we need to find a substring or subarray in a string/array that contains certain character/element frequency requirements. This pattern efficiently checks if a "pattern" string's character frequencies are satisfied by a substring in the "source" string.

This pattern is fundamental for solving several LeetCode problems including **Minimum Window Substring**, **Permutation in String**, **Find All Anagrams in a String**, and more.

---

## Problem Classification

Character Frequency Matching problems typically fall into two categories:

### 1. Minimum Window Substring Type
- **Goal:** Find the **smallest** window in `s` that contains all characters from `t`
- **Example:** `s = "ADOBECODEBANC"`, `t = "ABC"` → Answer: `"BANC"`

### 2. Permutation/Anagram Detection Type
- **Goal:** Check if there exists a window in `s` that is a **permutation/anagram** of `t`
- **Example:** `s = "abab"`, `t = "ab"` → Answer: `true` (windows: "ab", "ba", "ab")

---

## Intuition

The core intuition behind this pattern is based on three key observations:

### 1. Frequency Comparison
For a substring to satisfy the pattern requirement, the frequency of each character in the window must be **at least** (for minimum window) or **exactly equal to** (for anagram detection) the frequency in the pattern.

### 2. Sliding Window Efficiency
Instead of checking all O(n²) possible substrings, we use a sliding window that:
- **Expands** to include new characters
- **Contracts** when the condition is satisfied
- Moves **monotonically** from left to right

### 3. Counter-Based Tracking
We maintain character counts in a hash map (or array) to track:
- How many of each character are **required**
- How many of each character are **currently in** the window
- How many character requirements are **satisfied**

---

## Approach 1: Fixed-Length Window (Permutation/Anagram Detection)

When we need to check if `t` appears as a permutation in `s`, both strings have a **fixed-length relationship** (usually `len(t)` or related).

### Algorithm Steps

1. **Edge Case:** If `len(t) > len(s)`, return false immediately.

2. **Initialize Counters:**
   - Create frequency map for pattern `t`
   - Create frequency map for current window in `s`

3. **Build Initial Window:**
   - Fill window frequency map with first `len(t)` characters of `s`

4. **Compare & Slide:**
   - If windows match, return true
   - Slide window one character at a time:
     - Remove leftmost character
     - Add new right character
     - Compare counts

### Code Templates

````carousel
```python
from collections import Counter
from typing import List

def check_inclusion(t: str, s: str) -> bool:
    """
    Check if any window in s contains a permutation of t.
    
    Time: O(m + n) where m = len(s), n = len(t)
    Space: O(1) or O(Σ) where Σ is alphabet size
    """
    if len(t) > len(s):
        return False
    
    # Frequency counters
    t_count = Counter(t)
    window_count = Counter()
    
    # Build initial window
    for i in range(len(t)):
        window_count[s[i]] += 1
    
    # Check if windows match
    if window_count == t_count:
        return True
    
    # Slide window
    for i in range(len(t), len(s)):
        # Add new character
        window_count[s[i]] += 1
        # Remove leftmost character
        window_count[s[i - len(t)]] -= 1
        
        # Clean up zero counts
        if window_count[s[i - len(t)]] == 0:
            del window_count[s[i - len(t)]]
        
        if window_count == t_count:
            return True
    
    return False
```

<!-- slide -->

```cpp
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    bool checkInclusion(std::string t, std::string s) {
        if (t.length() > s.length()) return false;
        
        std::vector<int> tCount(26, 0), windowCount(26, 0);
        
        // Build initial window
        for (int i = 0; i < t.length(); i++) {
            tCount[t[i] - 'a']++;
            windowCount[s[i] - 'a']++;
        }
        
        // Check if initial window matches
        if (tCount == windowCount) return true;
        
        // Slide window
        for (int i = t.length(); i < s.length(); i++) {
            windowCount[s[i] - 'a']++;
            windowCount[s[i - t.length()] - 'a']--;
            
            if (tCount == windowCount) return true;
        }
        
        return false;
    }
};
```

<!-- slide -->

```java
import java.util.*;

class Solution {
    public boolean checkInclusion(String t, String s) {
        if (t.length() > s.length()) return false;
        
        int[] tCount = new int[26];
        int[] windowCount = new int[26];
        
        // Build initial window
        for (int i = 0; i < t.length(); i++) {
            tCount[t.charAt(i) - 'a']++;
            windowCount[s.charAt(i) - 'a']++;
        }
        
        // Check if initial window matches
        if (Arrays.equals(tCount, windowCount)) return true;
        
        // Slide window
        for (int i = t.length(); i < s.length(); i++) {
            windowCount[s.charAt(i) - 'a']++;
            windowCount[s.charAt(i - t.length()) - 'a']--;
            
            if (Arrays.equals(tCount, windowCount)) return true;
        }
        
        return false;
    }
}
```

<!-- slide -->

```javascript
/**
 * Check if any window in s contains a permutation of t
 * @param {string} t - Pattern string
 * @param {string} s - Source string
 * @returns {boolean}
 */
function checkInclusion(t, s) {
    if (t.length > s.length) return false;
    
    const tCount = new Array(26).fill(0);
    const windowCount = new Array(26).fill(0);
    
    // Build initial window
    for (let i = 0; i < t.length; i++) {
        tCount[t.charCodeAt(i) - 97]++;
        windowCount[s.charCodeAt(i) - 97]++;
    }
    
    // Check if initial window matches
    if (arraysEqual(tCount, windowCount)) return true;
    
    // Slide window
    for (let i = t.length; i < s.length; i++) {
        windowCount[s.charCodeAt(i) - 97]++;
        windowCount[s.charCodeAt(i - t.length) - 97]--;
        
        if (arraysEqual(tCount, windowCount)) return true;
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

## Approach 2: Variable-Length Window (Minimum Window Substring)

For finding the minimum window containing all characters, we use a **variable-length** sliding window with a more sophisticated tracking mechanism.

### Algorithm Steps

1. **Count Pattern Characters:** Create frequency map for pattern `t`

2. **Track Requirements:**
   - `required`: Number of unique characters in `t`
   - `formed`: Number of unique characters that meet the frequency requirement

3. **Expand Window:**
   - Add characters from left to right
   - Update window frequency count
   - Check if each character requirement is met

4. **Contract Window:**
   - When all requirements are met, try to shrink from left
   - Update minimum window size

5. **Return Result:** Return smallest valid window or empty string

### Code Templates

````carousel
```python
from collections import Counter
from typing import Tuple

def min_window(s: str, t: str) -> str:
    """
    Find the smallest window in s that contains all characters of t.
    
    Time: O(m + n) where m = len(s), n = len(t)
    Space: O(m + n) for filtered list and counters
    """
    if not t or not s:
        return ""
    
    # Frequency of characters in t
    dict_t = Counter(t)
    required = len(dict_t)
    
    # Filter s to only include characters present in t
    # This optimization reduces unnecessary processing
    filtered_s = [(i, char) for i, char in enumerate(s) if char in dict_t]
    
    l, r = 0, 0
    formed = 0
    window_counts = {}
    ans = float("inf"), None, None  # (window_length, left, right)
    
    while r < len(filtered_s):
        character = filtered_s[r][1]
        window_counts[character] = window_counts.get(character, 0) + 1
        
        # Check if current character's count matches required count
        if window_counts[character] == dict_t[character]:
            formed += 1
        
        # Try to contract the window until it's no longer valid
        while l <= r and formed == required:
            character = filtered_s[l][1]
            
            # Update answer with smallest window
            end = filtered_s[r][0]
            start = filtered_s[l][0]
            if end - start + 1 < ans[0]:
                ans = (end - start + 1, start, end)
            
            # Remove leftmost character
            window_counts[character] -= 1
            if window_counts[character] < dict_t[character]:
                formed -= 1
            
            l += 1
        
        r += 1
    
    return "" if ans[0] == float("inf") else s[ans[1]: ans[2] + 1]
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

## Approach 3: Optimized Fixed Window with Match Count

This approach optimizes the comparison step by maintaining a `match_count` instead of comparing entire arrays each time.

### Code Templates

````carousel
```python
from collections import Counter
from typing import List

def min_window_optimized(s: str, t: str) -> str:
    """
    Optimized minimum window using match_count instead of array comparison.
    
    Time: O(m + n)
    Space: O(1) or O(Σ)
    """
    if len(t) > len(s):
        return ""
    
    # Character frequency arrays (assuming ASCII)
    t_count = [0] * 128
    window_count = [0] * 128
    match_count = 0
    
    # Build t frequency and count unique characters
    unique_chars = 0
    for char in t:
        if t_count[ord(char)] == 0:
            unique_chars += 1
        t_count[ord(char)] += 1
    
    # Build initial window
    for i in range(len(t)):
        window_count[ord(s[i])] += 1
        if window_count[ord(s[i])] == t_count[ord(s[i])]:
            match_count += 1
    
    if match_count == unique_chars:
        return s[:len(t)]
    
    # Slide window
    for i in range(len(t), len(s)):
        # Add new character
        window_count[ord(s[i])] += 1
        if window_count[ord(s[i])] == t_count[ord(s[i])]:
            match_count += 1
        
        # Remove leftmost character
        window_count[ord(s[i - len(t)])] -= 1
        if window_count[ord(s[i - len(t)])] < t_count[ord(s[i - len(t)])]:
            match_count -= 1
        
        if match_count == unique_chars:
            return s[i - len(t) + 1: i + 1]
    
    return ""
```

<!-- slide -->

```cpp
#include <vector>
#include <string>
#include <algorithm>

class Solution {
public:
    std::string minWindow(std::string s, std::string t) {
        if (t.length() > s.length()) return "";
        
        const int ASCII_SIZE = 128;
        std::vector<int> t_count(ASCII_SIZE, 0), window_count(ASCII_SIZE, 0);
        int match_count = 0;
        int unique_chars = 0;
        
        // Build t frequency
        for (char c : t) {
            if (t_count[c] == 0) unique_chars++;
            t_count[c]++;
        }
        
        // Build initial window
        for (int i = 0; i < t.length(); i++) {
            window_count[s[i]]++;
            if (window_count[s[i]] == t_count[s[i]]) match_count++;
        }
        
        if (match_count == unique_chars) return s.substr(0, t.length());
        
        // Slide window
        for (int i = t.length(); i < s.length(); i++) {
            window_count[s[i]]++;
            if (window_count[s[i]] == t_count[s[i]]) match_count++;
            
            window_count[s[i - t.length()]]--;
            if (window_count[s[i - t.length()]] < t_count[s[i - t.length()]]) 
                match_count--;
            
            if (match_count == unique_chars) 
                return s.substr(i - t.length() + 1, t.length());
        }
        
        return "";
    }
};
```

<!-- slide -->

```java
class Solution {
    public String minWindow(String s, String t) {
        if (t.length() > s.length()) return "";
        
        final int ASCII_SIZE = 128;
        int[] tCount = new int[ASCII_SIZE];
        int[] windowCount = new int[ASCII_SIZE];
        int matchCount = 0;
        int uniqueChars = 0;
        
        // Build t frequency
        for (char c : t.toCharArray()) {
            if (tCount[c] == 0) uniqueChars++;
            tCount[c]++;
        }
        
        // Build initial window
        for (int i = 0; i < t.length(); i++) {
            windowCount[s.charAt(i)]++;
            if (windowCount[s.charAt(i)] == tCount[s.charAt(i)]) matchCount++;
        }
        
        if (matchCount == uniqueChars) return s.substring(0, t.length());
        
        // Slide window
        for (int i = t.length(); i < s.length(); i++) {
            windowCount[s.charAt(i)]++;
            if (windowCount[s.charAt(i)] == tCount[s.charAt(i)]) matchCount++;
            
            windowCount[s.charAt(i - t.length())]--;
            if (windowCount[s.charAt(i - t.length())] < tCount[s.charAt(i - t.length())]) 
                matchCount--;
            
            if (matchCount == uniqueChars) 
                return s.substring(i - t.length() + 1, i + 1);
        }
        
        return "";
    }
}
```

<!-- slide -->

```javascript
/**
 * Optimized minimum window using match count
 * @param {string} s
 * @param {string} t
 * @returns {string}
 */
function minWindowOptimized(s, t) {
    if (t.length > s.length) return "";
    
    const ASCII_SIZE = 128;
    const tCount = new Array(ASCII_SIZE).fill(0);
    const windowCount = new Array(ASCII_SIZE).fill(0);
    let matchCount = 0;
    let uniqueChars = 0;
    
    // Build t frequency
    for (let i = 0; i < t.length; i++) {
        const c = t.charCodeAt(i);
        if (tCount[c] === 0) uniqueChars++;
        tCount[c]++;
    }
    
    // Build initial window
    for (let i = 0; i < t.length; i++) {
        const c = s.charCodeAt(i);
        windowCount[c]++;
        if (windowCount[c] === tCount[c]) matchCount++;
    }
    
    if (matchCount === uniqueChars) return s.substring(0, t.length);
    
    // Slide window
    for (let i = t.length; i < s.length; i++) {
        const newChar = s.charCodeAt(i);
        windowCount[newChar]++;
        if (windowCount[newChar] === tCount[newChar]) matchCount++;
        
        const leftChar = s.charCodeAt(i - t.length);
        windowCount[leftChar]--;
        if (windowCount[leftChar] < tCount[leftChar]) matchCount--;
        
        if (matchCount === uniqueChars) 
            return s.substring(i - t.length + 1, i + 1);
    }
    
    return "";
}
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Best For |
|----------|-----------------|------------------|----------|
| Fixed-Length Window | O(m + n) | O(1) or O(Σ) | Permutation/Anagram detection |
| Variable-Length Window | O(m + n) | O(m + n) | Minimum window substring |
| Optimized Fixed Window | O(m + n) | O(Σ) | Memory-constrained environments |

Where:
- `m = len(s)`, `n = len(t)`
- `Σ = alphabet size (26 for lowercase, 128 for ASCII, 256 for extended ASCII)`

---

## Related Problems

| Problem | LeetCode Link | Difficulty | Pattern Type |
|---------|---------------|------------|--------------|
| Minimum Window Substring | [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) | Hard | Variable-length window |
| Permutation in String | [567. Permutation in String](https://leetcode.com/problems/permutation-in-string/) | Medium | Fixed-length window |
| Find All Anagrams in a String | [438. Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/) | Medium | Fixed-length window |
| Smallest Window Substring | [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) | Hard | Variable-length window |
| Substring with Concatenation of All Words | [30. Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words/) | Hard | Fixed-length multi-char window |
| Longest Substring with At Most K Distinct Characters | [3. Longest Substring with At Most K Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/) | Medium | Variable-length with constraints |
| Fruit Into Baskets | [904. Fruit Into Baskets](https://leetcode.com/problems/fruit-into-baskets/) | Medium | Variable-length with constraints |

---

## Video Tutorials

1. **[Sliding Window Technique - Abdul Bari](https://www.youtube.com/watch?v=9ZHzBbuZ6VU)** - Classic explanation of sliding window basics

2. **[Minimum Window Substring - NeetCode](https://www.youtube.com/watch?v=jSto0O4Zb4M)** - Step-by-step solution with visualization

3. **[Permutation in String - NeetCode](https://www.youtube.com/watch?v=UbyhOgBBYGQ)** - Fixed-length window pattern explained

4. **[Sliding Window Pattern - Educative](https://www.educative.io/blog/sliding-window-pattern)** - Comprehensive written tutorial with examples

5. **[Find All Anagrams in a String - Back To Back SWE](https://www.youtube.com/watch?v=M8aL3IO4cLo)** - Detailed explanation with code walkthrough

---

## Key Takeaways

1. **Pattern Recognition:** Identify whether the problem requires a fixed-length or variable-length window based on the question type.

2. **Frequency Tracking:** Use hash maps or arrays to track character frequencies efficiently.

3. **Two-Pointer Movement:** Both pointers only move forward, ensuring O(n) time complexity.

4. **Optimization:** For fixed-length problems, maintain a match count instead of comparing entire arrays.

5. **Edge Cases:** Always handle empty strings, pattern longer than source, and single-character edge cases.

---

## Template Selection Guide

Choose the appropriate template based on your specific use case:

| Use Case | Recommended Template |
|----------|---------------------|
| Check if `t` is a permutation of any substring in `s` | **Approach 1** (Fixed-Length Window) |
| Find minimum window containing all `t` characters | **Approach 2** (Variable-Length Window) |
| Memory-constrained environment | **Approach 3** (Optimized Fixed Window) |
| Multiple character types (Unicode) | **Approach 2** with `Counter`/`Map` |

---

## Follow-Up Questions to Consider

1. **What if the pattern contains special characters or Unicode?** → Use `Map` instead of fixed-size array.

2. **What if we need the count of all valid windows?** → Modify to return array of window indices instead of stopping at first match.

3. **What if the window size varies based on multiple constraints?** → Combine with additional tracking variables for complex conditions.

---

## References

- LeetCode Problem Set - Sliding Window Category
- "Cracking the Coding Interview" - Sliding Window Pattern
- "Elements of Programming Interviews" - String Problems
- NeetCode YouTube Channel - Systematically Solved Problems

---

**Pattern Tags:** `Sliding Window` `Frequency Matching` `String Matching` `Anagram Detection` `Minimum Window Substring`
