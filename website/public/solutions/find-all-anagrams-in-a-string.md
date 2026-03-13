# Find All Anagrams In A String

## Problem Description

Given two strings s and p, return an array of all the start indices of p's anagrams in s. You may return the answer in any order.

**LeetCode Link:** [Find All Anagrams in a String - LeetCode 438](https://leetcode.com/problems/find-all-anagrams-in-a-string/)

---

## Examples

### Example 1

**Input:**
```python
s = "cbaebabacd", p = "abc"
```

**Output:**
```python
[0,6]
```

**Explanation:**
The substring with start index = 0 is "cba", which is an anagram of "abc".
The substring with start index = 6 is "bac", which is an anagram of "abc".

---

### Example 2

**Input:**
```python
s = "abab", p = "ab"
```

**Output:**
```python
[0,1,2]
```

**Explanation:**
The substring with start index = 0 is "ab", which is an anagram of "ab".
The substring with start index = 1 is "ba", which is an anagram of "ab".
The substring with start index = 2 is "ab", which is an anagram of "ab".

---

## Constraints

- `1 <= s.length, p.length <= 3 * 10^4`
- `s` and `p` consist of lowercase English letters.

---

## Pattern: Sliding Window with Frequency Array

This problem follows the **Sliding Window** pattern with **Fixed Window Size**, specifically using frequency counting for anagram detection.

### Core Concept

- **Fixed sliding window**: Window size equals length of pattern p
- **Frequency comparison**: Two strings are anagrams if they have identical character frequencies
- **Window sliding**: Move window one character at a time, updating counts

### When to Use This Pattern

This pattern is applicable when:
1. Finding all substrings with specific character properties
2. Anagram detection problems
3. Fixed-size window problems with character counting

---

## Intuition

The key insight is that anagrams have the same character frequencies. We can use a fixed-size sliding window and compare frequency arrays.

### Key Observations

1. **Frequency Matching**: Anagrams have identical character frequency counts
2. **Fixed Window Size**: Window size = len(p) is constant
3. **Efficient Comparison**: Use array of size 26 for lowercase letters
4. **Sliding Window**: Move one character at a time, update counts in O(1)

### Algorithm Overview

1. Create frequency array for pattern p
2. Create frequency array for first window in s
3. Compare and slide window:
   - Add new character entering window
   - Remove old character leaving window
   - Compare frequency arrays
4. Record positions where frequencies match

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Sliding Window with Array** - Optimal O(n) solution
2. **HashMap Approach** - Alternative using dictionary

---

## Approach 1: Sliding Window with Array (Optimal)

### Algorithm Steps

1. If p is longer than s, return empty
2. Create frequency array for pattern p
3. Create frequency array for first window in s
4. Compare and slide window through s
5. Record indices where frequencies match

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        """
        Find all anagram indices using sliding window with frequency array.
        
        Time Complexity: O(n) where n = len(s)
        Space Complexity: O(1) - fixed size arrays
        
        Args:
            s: Source string
            p: Pattern string
            
        Returns:
            List of starting indices of anagrams
        """
        if len(p) > len(s):
            return []
        
        p_count = [0] * 26
        s_count = [0] * 26
        
        # Build pattern frequency
        for char in p:
            p_count[ord(char) - ord('a')] += 1
        
        # Initialize first window
        for i in range(len(p)):
            s_count[ord(s[i]) - ord('a')] += 1
        
        result = []
        if s_count == p_count:
            result.append(0)
        
        # Slide the window
        for i in range(len(p), len(s)):
            # Add new character
            s_count[ord(s[i]) - ord('a')] += 1
            # Remove old character
            s_count[ord(s[i - len(p)]) - ord('a')] -= 1
            
            if s_count == p_count:
                result.append(i - len(p) + 1)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    vector<int> findAnagrams(string s, string p) {
        if (p.length() > s.length()) return {};
        
        vector<int> p_count(26, 0), s_count(26, 0);
        vector<int> result;
        
        // Build pattern frequency
        for (char c : p) {
            p_count[c - 'a']++;
        }
        
        // Initialize first window
        for (int i = 0; i < p.length(); i++) {
            s_count[s[i] - 'a']++;
        }
        
        if (s_count == p_count) {
            result.push_back(0);
        }
        
        // Slide the window
        for (int i = p.length(); i < s.length(); i++) {
            s_count[s[i] - 'a']++;
            s_count[s[i - p.length()] - 'a']--;
            
            if (s_count == p_count) {
                result.push_back(i - p.length() + 1);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> result = new ArrayList<>();
        if (p.length() > s.length()) return result;
        
        int[] p_count = new int[26];
        int[] s_count = new int[26];
        
        // Build pattern frequency
        for (char c : p.toCharArray()) {
            p_count[c - 'a']++;
        }
        
        // Initialize first window
        for (int i = 0; i < p.length(); i++) {
            s_count[s.charAt(i) - 'a']++;
        }
        
        if (Arrays.equals(s_count, p_count)) {
            result.add(0);
        }
        
        // Slide the window
        for (int i = p.length(); i < s.length(); i++) {
            s_count[s.charAt(i) - 'a']++;
            s_count[s.charAt(i - p.length()) - 'a']--;
            
            if (Arrays.equals(s_count, p_count)) {
                result.add(i - p.length() + 1);
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function(s, p) {
    const result = [];
    if (p.length > s.length) return result;
    
    const pCount = new Array(26).fill(0);
    const sCount = new Array(26).fill(0);
    
    // Build pattern frequency
    for (const c of p) {
        pCount[c.charCodeAt(0) - 97]++;
    }
    
    // Initialize first window
    for (let i = 0; i < p.length; i++) {
        sCount[s.charCodeAt(i) - 97]++;
    }
    
    if (sCount.join(',') === pCount.join(',')) {
        result.push(0);
    }
    
    // Slide the window
    for (let i = p.length; i < s.length; i++) {
        sCount[s.charCodeAt(i) - 97]++;
        sCount[s.charCodeAt(i - p.length) - 97]--;
        
        if (sCount.join(',') === pCount.join(',')) {
            result.push(i - p.length + 1);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) where n = len(s) |
| **Space** | O(1) - fixed size arrays of 26 |

---

## Approach 2: HashMap Approach

### Algorithm Steps

1. Use HashMap instead of array for frequency counting
2. Compare maps at each position

### Why It Works

Similar to array approach but using dynamic data structures.

### Code Implementation

````carousel
```python
from typing import List
from collections import Counter

class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        if len(p) > len(s):
            return []
        
        p_count = Counter(p)
        s_count = {}
        result = []
        
        for i in range(len(p)):
            s_count[s[i]] = s_count.get(s[i], 0) + 1
        
        if s_count == p_count:
            result.append(0)
        
        for i in range(len(p), len(s)):
            s_count[s[i]] = s_count.get(s[i], 0) + 1
            s_count[s[i - len(p)]] -= 1
            if s_count[s[i - len(p)]] == 0:
                del s_count[s[i - len(p)]]
            
            if s_count == p_count:
                result.append(i - len(p) + 1)
        
        return result
```
````

---

## Comparison of Approaches

| Aspect | Array Approach | HashMap Approach |
|--------|---------------|------------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(k) where k = unique chars |
| **Speed** | Faster | Slightly slower |

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Meta, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Sliding Window, Frequency Counting, String Manipulation

### Learning Outcomes

1. **Sliding Window Mastery**: Fixed window size sliding
2. **Frequency Counting**: Efficient character frequency comparison
3. **Array vs HashMap**: Choosing appropriate data structures

---

## Related Problems

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Permutation in String | [Link](https://leetcode.com/problems/permutation-in-string/) | Single anagram check |
| Minimum Window Substring | [Link](https://leetcode.com/problems/minimum-window-substring/) | Variable window |
| Valid Anagram | [Link](https://leetcode.com/problems/valid-anagram/) | Basic anagram check |

### Pattern Reference

For more detailed explanations of sliding window patterns, see:
- **[Sliding Window Pattern](/patterns/sliding-window)**

---

## Video Tutorial Links

1. **[NeetCode - Find All Anagrams](https://www.youtube.com/watch?v=)** - Clear explanation
2. **[Sliding Window Pattern](https://www.youtube.com/watch?v=)** - Pattern tutorial

---

## Follow-up Questions

### Q1: How would you handle uppercase letters?

**Answer:** Extend array size to 52 or use hash maps.

### Q2: What if you need to find minimum window?

**Answer:** Use variable-size sliding window (Minimum Window Substring pattern).

---

## Summary

The **Find All Anagrams in a String** problem demonstrates **Sliding Window with Frequency Array**:

- **Fixed Window**: Size equals pattern length
- **Frequency Comparison**: Arrays of size 26 for lowercase letters
- **O(n) Time**: Efficient sliding with O(1) update

Key takeaways:
1. Use fixed-size frequency array for efficiency
2. Slide window one character at a time
3. Compare arrays in O(1) time
4. Record indices where frequencies match

This problem is essential for understanding sliding window with frequency counting.

---

## Additional Resources

- [LeetCode Problem 438](https://leetcode.com/problems/find-all-anagrams-in-a-string/) - Official problem page
- [Sliding Window Technique](https://en.wikipedia.org/wiki/Sliding_window) - Concept explanation

---

## Common Pitfalls

### 1. Not checking p length vs s length
**Issue:** If p is longer than s, no anagrams exist.

**Solution:** Early return [] if len(p) > len(s).

### 2. Incorrect window start index
**Issue:** Calculating wrong starting index after sliding.

**Solution:** Starting index is i - len(p) + 1 for window ending at i.

### 3. Using dictionary instead of array
**Issue:** Dictionary comparison doesn't work element-wise like array.

**Solution:** Use fixed-size array of 26 for lowercase letters; compare directly.

### 4. Comparing arrays incorrectly
**Issue:** Direct == comparison may not work as expected in some languages.

**Solution:** Arrays compare element-by-element in Python; verify behavior in other languages.

### 5. Not handling first window properly
**Issue:** Missing first window check before sliding starts.

**Solution:** Initialize first window separately, check before entering loop.
