# Is Subsequence

## Problem Description

Given two strings `s` and `t`, return `true` if `s` is a **subsequence** of `t`, or `false` otherwise.

A **subsequence** of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters.

For example:
- `"ace"` is a subsequence of `"abcde"`
- `"aec"` is **not** a subsequence of `"abcde"` (order is wrong)

**Link to problem:** [Is Subsequence - LeetCode 392](https://leetcode.com/problems/is-subsequence/)

---

## Examples

### Example 1

| Input | Output |
|-------|--------|
| `s = "abc"`, `t = "ahbgdc"` | `true` |

### Example 2

| Input | Output |
|-------|--------|
| `s = "axc"`, `t = "ahbgdc"` | `false` |

---

## Constraints

- `0 <= s.length <= 100`
- `0 <= t.length <= 10⁴`
- `s` and `t` consist only of lowercase English letters.

**Follow up:** Suppose there are lots of incoming `s`, say `s1, s2, ..., sk` where `k >= 10⁹`, and you want to check if `t` has each as a subsequence. How would you change your code?

---

## Pattern: Two Pointers - Sequential Search

This problem demonstrates the **Two Pointers** pattern for subsequence checking. The key is iterating through both strings while maintaining relative order.

---

## Intuition

The key insight for this problem is understanding what it means to be a subsequence:

> A string s is a subsequence of t if all characters of s appear in t in the same order (not necessarily contiguously).

### Key Observations

1. **Order Preservation**: Characters must appear in the same order, but can have gaps between them.

2. **Two Pointers**: Use one pointer for s and one for t to traverse both strings.

3. **Greedy Matching**: At each step, try to find the next character of s in t.

4. **Early Termination**: If we run out of t before matching all of s, it's not a subsequence.

### Algorithm Overview

1. Initialize pointers i = 0 (for s) and j = 0 (for t)
2. While i < len(s) and j < len(t):
   - If s[i] == t[j], increment i (found match)
   - Always increment j (move through t)
3. Return i == len(s)

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two Pointers** - Basic solution (O(|t|) time)
2. **Binary Search** - For follow-up with preprocessing (O(|t| + |s| log |t|))

---

## Approach 1: Two Pointers (Optimal) ⭐

### Algorithm Steps

1. Initialize i = 0 for s, j = 0 for t
2. While i < len(s) and j < len(t):
   - If s[i] == t[j], increment i
   - Always increment j
3. Return i == len(s)

### Why It Works

This works because:
1. We scan t only once
2. We only advance i when we find a match
3. Order is preserved since j always moves forward

### Code Implementation

````carousel
```python
class Solution:
    def isSubsequence(self, s: str, t: str) -> bool:
        """
        Check if s is a subsequence of t using two pointers.
        
        Args:
            s: Source string
            t: Target string
            
        Returns:
            True if s is subsequence of t, False otherwise
        """
        i, j = 0, 0  # i for s, j for t
        
        while i < len(s) and j < len(t):
            if s[i] == t[j]:
                i += 1  # Match found, move to next char in s
            j += 1  # Always move to next char in t
        
        return i == len(s)  # True if we matched all of s
```

<!-- slide -->
```cpp
class Solution {
public:
    bool isSubsequence(string s, string t) {
        int i = 0, j = 0;
        
        while (i < s.length() && j < t.length()) {
            if (s[i] == t[j]) {
                i++;  // Match found
            }
            j++;  // Always move forward
        }
        
        return i == s.length();
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean isSubsequence(String s, String t) {
        int i = 0, j = 0;
        
        while (i < s.length() && j < t.length()) {
            if (s.charAt(i) == t.charAt(j)) {
                i++;  // Match found
            }
            j++;  // Always move forward
        }
        
        return i == s.length();
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
var isSubsequence = function(s, t) {
    let i = 0, j = 0;
    
    while (i < s.length && j < t.length) {
        if (s[i] === t[j]) {
            i++;  // Match found
        }
        j++;  // Always move forward
    }
    
    return i === s.length;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(|t|) - single pass through t |
| **Space** | O(1) - constant space |

---

## Approach 2: Binary Search (For Follow-up) ⭐

### Algorithm Steps

1. **Preprocessing**: Build a map of each character to list of indices in t
2. For each character in s:
   - Use binary search to find the smallest index > previous match
   - If not found, return false
3. Return true if all characters found

### Why It Works

This approach efficiently handles multiple queries by preprocessing t once.

### Code Implementation

````carousel
```python
from typing import List
import bisect

class Solution:
    def isSubsequence(self, s: str, t: str) -> bool:
        """
        Using binary search with preprocessing for multiple queries.
        """
        # Preprocess: map each char to list of indices
        char_indices = {chr(i): [] for i in range(ord('a'), ord('z') + 1)}
        for idx, ch in enumerate(t):
            char_indices[ch].append(idx)
        
        # Binary search for each character in s
        prev = -1
        for ch in s:
            if ch not in char_indices or not char_indices[ch]:
                return False
            
            # Find smallest index > prev
            idx_list = char_indices[ch]
            pos = bisect.bisect_right(idx_list, prev)
            
            if pos == len(idx_list):
                return False
            prev = idx_list[pos]
        
        return True
```

<!-- slide -->
```cpp
class Solution {
public:
    bool isSubsequence(string s, string t) {
        // Preprocess: map each char to list of indices
        vector<vector<int>> charIndices(26);
        for (int i = 0; i < t.length(); i++) {
            charIndices[t[i] - 'a'].push_back(i);
        }
        
        // Binary search for each character in s
        int prev = -1;
        for (char ch : s) {
            int idx = ch - 'a';
            auto& vec = charIndices[idx];
            
            // Find smallest index > prev
            auto it = upper_bound(vec.begin(), vec.end(), prev);
            if (it == vec.end()) return false;
            prev = *it;
        }
        
        return true;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean isSubsequence(String s, String t) {
        // Preprocess: map each char to list of indices
        List<Integer>[] charIndices = new ArrayList[26];
        for (int i = 0; i < 26; i++) charIndices[i] = new ArrayList<>();
        
        for (int i = 0; i < t.length(); i++) {
            charIndices[t.charAt(i) - 'a'].add(i);
        }
        
        // Binary search for each character in s
        int prev = -1;
        for (int i = 0; i < s.length(); i++) {
            int idx = s.charAt(i) - 'a';
            List<Integer> list = charIndices[idx];
            
            // Find smallest index > prev
            int pos = Collections.binarySearch(list, prev + 1);
            if (pos < 0) pos = -pos - 1;
            if (pos >= list.size()) return false;
            prev = list.get(pos);
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
var isSubsequence = function(s, t) {
    // Preprocess: map each char to list of indices
    const charIndices = {};
    for (let i = 0; i < t.length; i++) {
        const ch = t[i];
        if (!charIndices[ch]) charIndices[ch] = [];
        charIndices[ch].push(i);
    }
    
    // Binary search for each character in s
    let prev = -1;
    for (const ch of s) {
        if (!charIndices[ch]) return false;
        
        // Find smallest index > prev
        const list = charIndices[ch];
        let left = 0, right = list.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (list[mid] > prev) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        
        if (left >= list.length) return false;
        prev = list[left];
    }
    
    return true;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(|t| + |s| log |t|) - preprocess + binary search |
| **Space** | O(|t|) - storing indices |

---

## Comparison of Approaches

| Aspect | Two Pointers | Binary Search |
|--------|--------------|---------------|
| **Time (single query)** | O(\|t\|) | O(\|t\| + \|s\| log \|t\|) |
| **Time (k queries)** | O(k × \|t\|) | O(\|t\| + k × \|s\| log \|t\|) |
| **Space** | O(1) | O(\|t\|) |
| **Difficulty** | Easy | Medium |

**Best Approach:** Use Two Pointers for single query, Binary Search for multiple queries (follow-up).

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Google, Microsoft, Bloomberg
- **Difficulty**: Easy
- **Concepts Tested**: Two pointers, string manipulation, binary search

### Learning Outcomes

1. **Two Pointers**: Master the technique for sequential matching
2. **Binary Search**: Apply to follow-up with preprocessing
3. **Subsequence vs Substring**: Understand the difference

---

## Related Problems

Based on similar themes (string matching, two pointers):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Matching Subsequences | [Link](https://leetcode.com/problems/number-of-matching-subsequences/) | Multiple subsequence queries |
| Minimum Window Subsequence | [Link](https://leetcode.com/problems/minimum-window-subsequence/) | Find smallest subsequence |
| Longest Word in Dictionary | [Link](https://leetcode.com/problems/longest-word-in-dictionary/) | Subsequence ordering |
| Shortest Way to Form String | [Link](https://leetcode.com/problems/shortest-way-to-form-string/) | Similar to subsequence |

### Pattern Reference

For more detailed explanations of the Two Pointers pattern, see:
- **[Two Pointers Pattern](/patterns/two-pointers-fast-slow-cycle-detection)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Is Subsequence](https://www.youtube.com/watch?v=1z1R3N0g7P4)** - Clear explanation with visual examples
2. **[Is Subsequence - LeetCode 392](https://www.youtube.com/watch?v=V0MryMQgkMc)** - Detailed walkthrough
3. **[Two Pointers Technique](https://www.youtube.com/watch?v=Q2k4d2ohkT8)** - Understanding two pointers

### Related Concepts

- **[Binary Search](https://www.youtube.com/watch?v=AXx1WuKjD1w)** - Search optimization
- **[String Manipulation](https://www.youtube.com/watch?v=3a2KRJO2OEA)** - Common techniques

---

## Follow-up Questions

### Q1: How would you change your code for multiple queries (k >= 10^9)?

**Answer:** Preprocess t by creating a mapping from each character to a list of indices. Then use binary search to find each character's position efficiently.

---

### Q2: What if s and t could be very long (10^5+ characters)?

**Answer:** Use the binary search approach with preprocessing to handle large inputs efficiently.

---

### Q3: How would you find the shortest subsequence that contains all characters of s?

**Answer:** This is the "Minimum Window Subsequence" problem. Use dynamic programming or sliding window.

---

### Q4: Can this be solved using recursion?

**Answer:** Yes, recursively match first character and solve subproblem, but iteration is more efficient.

---

### Q5: What's the difference between subsequence and substring?

**Answer:** Subsequence preserves order but can have gaps; substring requires contiguity.

---

## Common Pitfalls

### 1. Not Moving Both Pointers Correctly
**Issue:** Only incrementing one pointer or incrementing at wrong time.

**Solution:** Always increment j, only increment i on match.

### 2. Empty String Handling
**Issue:** Not handling edge cases where s or t is empty.

**Solution:** Empty s is always a subsequence, return i == len(s).

### 3. Confusing Subsequence with Substring
**Issue:** Thinking characters must be contiguous.

**Solution:** Subsequence allows gaps, only order matters.

### 4. Not Checking Both Pointers
**Issue:** Only checking i but not j bounds.

**Solution:** Use `while i < len(s) and j < len(t)`.

### 5. Wrong Comparison
**Issue:** Using wrong comparison operator.

**Solution:** Check for equality with ==, not assignment.

---

## Summary

The **Is Subsequence** problem demonstrates the **Two Pointers** pattern for subsequence checking. The key is iterating through both strings while maintaining relative order.

### Key Takeaways

1. **Sequential Matching**: Match characters of s in order within t
2. **Two Pointers**: i for s, j for t - always advance j, only advance i on match
3. **Single Pass**: O(|t|) time complexity
4. **Follow-up Optimization**: Preprocess t with character-to-indices mapping for multiple queries

### Pattern Summary

This problem exemplifies the **Two Pointers** pattern, characterized by:
- Using two pointers to traverse data structures
- Making one pass through the data when possible
- Maintaining relative order or positions

For more details on this pattern, see the **[Two Pointers](/patterns/two-pointers-fast-slow-cycle-detection)**.

---

## Additional Resources

- [LeetCode Problem 392](https://leetcode.com/problems/is-subsequence/) - Official problem page
- [Subsequence - Wikipedia](https://en.wikipedia.org/wiki/Subsequence) - Mathematical definition
- [Two Pointers Technique](https://www.geeksforgeeks.org/two-pointers-technique/) - Detailed explanation
- [Pattern: Two Pointers](/patterns/two-pointers-fast-slow-cycle-detection) - Comprehensive pattern guide
