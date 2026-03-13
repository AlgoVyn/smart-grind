# Take K of Each Character From Left and Right

## Problem Description

You are given a string `s` consisting of the characters 'a', 'b', and 'c' and a non-negative integer `k`. Each minute, you may take either the leftmost character of `s`, or the rightmost character of `s`.

Return the minimum number of minutes needed for you to take at least `k` of each character, or return `-1` if it is not possible to take `k` of each character.

**LeetCode Link:** [Take K of Each Character From Left and Right](https://leetcode.com/problems/take-k-of-each-character-from-left-and-right/)

---

## Examples

**Example 1:**

Input: `s = "aabaaaacaabc"`, `k = 2`
Output: `8`

Explanation:
Take three characters from the left of `s`. You now have two 'a' characters, and one 'b' character.
Take five characters from the right of `s`. You now have four 'a' characters, two 'b' characters, and two 'c' characters.
A total of `3 + 5 = 8` minutes is needed.
It can be proven that `8` is the minimum number of minutes needed.

**Example 2:**

Input: `s = "a"`, `k = 1`
Output: `-1`

Explanation: It is not possible to take one 'b' or 'c' so return `-1`.

---

## Constraints

- `1 <= s.length <= 10^5`
- `s` consists of only the letters 'a', 'b', and 'c'.
- `0 <= k <= s.length`

---

## Pattern: Sliding Window (Two-Pointer)

This problem uses a **sliding window** approach to find the smallest middle substring that can be kept (not taken from the ends). The key insight is that taking characters from both ends is equivalent to finding the longest substring in the middle that we can skip while still having at least k of each character in the remaining string.

### Core Concept

- **Reverse Thinking**: Instead of taking from ends, find middle portion to keep
- **Window Validity**: Window is valid if remaining (outside window) has >= k of each char
- **Minimum Take**: n - max_window_size = minimum minutes needed

---

## Intuition

The key insight for this problem is reversing the problem:

1. **Instead of Taking**: Consider which characters to KEEP (not take)
2. **Middle Substring**: The characters we don't take form a contiguous substring in the middle
3. **Valid Window**: A window is valid if, after removing it, we still have at least k of each character

4. **Why Sliding Window?**:
   - We want the largest possible middle substring
   - This minimizes the characters we need to take from ends
   - Sliding window efficiently finds this maximum valid window

5. **Window Validity Condition**:
   - Total count of each character = total['a'], total['b'], total['c']
   - If we keep a window [left, right], we remove: total - window_count
   - We need: total - window_count >= k
   - Which means: window_count <= total - k

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Sliding Window** - Optimal O(n) solution
2. **Two-Pointer Alternative** - Slightly different implementation

---

## Approach 1: Sliding Window (Optimal)

### Algorithm Steps

1. **Edge Case Check**:
   - If k == 0, return 0 (no need to take anything)
   - Count total occurrences of each character
   - If any count < k, return -1 (impossible)

2. **Sliding Window**:
   - Initialize left = 0, min_length = infinity
   - For each right position:
     - Add s[right] to window count
     - While window is invalid (any char count > total - k):
       - Remove s[left] from window
       - Increment left
     - If window is valid, update min_length

3. **Return Result**:
   - If min_length is infinity, return -1
   - Otherwise, return n - min_length

### Why It Works

The sliding window finds the largest valid middle substring we can keep. By removing this substring, we minimize the characters we need to take from the ends. Since we take from both ends, the remaining string must be contiguous from both sides - which is exactly what the middle substring represents.

### Code Implementation

````carousel
```python
from collections import Counter
from typing import List

class Solution:
    def takeCharacters(self, s: str, k: int) -> int:
        if k == 0:
            return 0
        
        n = len(s)
        total = Counter(s)
        
        # Check if it's possible
        if total['a'] < k or total['b'] < k or total['c'] < k:
            return -1
        
        left = 0
        min_len = n + 1
        window = Counter()
        
        for right in range(n):
            # Expand window
            window[s[right]] += 1
            
            # Shrink window while invalid
            while (window['a'] > total['a'] - k or
                   window['b'] > total['b'] - k or
                   window['c'] > total['c'] - k):
                window[s[left]] -= 1
                left += 1
            
            # Update minimum valid window
            if (window['a'] <= total['a'] - k and
                window['b'] <= total['b'] - k and
                window['c'] <= total['c'] - k):
                min_len = min(min_len, right - left + 1)
        
        if min_len == n + 1:
            return -1
        return n - min_len
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int takeCharacters(string s, int k) {
        if (k == 0) return 0;
        
        int n = s.size();
        unordered_map<char, int> total;
        for (char c : s) total[c]++;
        
        if (total['a'] < k || total['b'] < k || total['c'] < k) {
            return -1;
        }
        
        int left = 0;
        int minLen = n + 1;
        unordered_map<char, int> window;
        
        for (int right = 0; right < n; right++) {
            window[s[right]]++;
            
            while (window['a'] > total['a'] - k ||
                   window['b'] > total['b'] - k ||
                   window['c'] > total['c'] - k) {
                window[s[left]]--;
                left++;
            }
            
            if (window['a'] <= total['a'] - k &&
                window['b'] <= total['b'] - k &&
                window['c'] <= total['c'] - k) {
                minLen = min(minLen, right - left + 1);
            }
        }
        
        return minLen == n + 1 ? -1 : n - minLen;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int takeCharacters(String s, int k) {
        if (k == 0) return 0;
        
        int n = s.length();
        int[] total = new int[3]; // a, b, c
        
        for (char c : s.toCharArray()) {
            total[c - 'a']++;
        }
        
        if (total[0] < k || total[1] < k || total[2] < k) {
            return -1;
        }
        
        int left = 0;
        int minLen = n + 1;
        int[] window = new int[3];
        
        for (int right = 0; right < n; right++) {
            window[s.charAt(right) - 'a']++;
            
            while (window[0] > total[0] - k ||
                   window[1] > total[1] - k ||
                   window[2] > total[2] - k) {
                window[s.charAt(left) - 'a']--;
                left++;
            }
            
            if (window[0] <= total[0] - k &&
                window[1] <= total[1] - k &&
                window[2] <= total[2] - k) {
                minLen = Math.min(minLen, right - left + 1);
            }
        }
        
        return minLen == n + 1 ? -1 : n - minLen;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var takeCharacters = function(s, k) {
    if (k === 0) return 0;
    
    const n = s.length;
    const total = { a: 0, b: 0, c: 0 };
    
    for (const c of s) {
        total[c]++;
    }
    
    if (total.a < k || total.b < k || total.c < k) {
        return -1;
    }
    
    let left = 0;
    let minLen = n + 1;
    const window = { a: 0, b: 0, c: 0 };
    
    for (let right = 0; right < n; right++) {
        window[s[right]]++;
        
        while (window.a > total.a - k ||
               window.b > total.b - k ||
               window.c > total.c - k) {
            window[s[left]]--;
            left++;
        }
        
        if (window.a <= total.a - k &&
            window.b <= total.b - k &&
            window.c <= total.c - k) {
            minLen = Math.min(minLen, right - left + 1);
        }
    }
    
    return minLen === n + 1 ? -1 : n - minLen;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass through string |
| **Space** | O(1) - fixed size counters for 3 characters |

---

## Approach 2: Two-Pointer with Arrays

### Algorithm Steps

1. Use arrays instead of Counter for better performance
2. Same sliding window logic
3. Use array indices for 'a', 'b', 'c'

### Why It Works

Same algorithm, different implementation using arrays instead of hashmaps.

### Code Implementation

````carousel
```python
class Solution:
    def takeCharacters(self, s: str, k: int) -> int:
        if k == 0:
            return 0
        
        n = len(s)
        total = [0] * 26
        for c in s:
            total[ord(c) - ord('a')] += 1
        
        for i in range(3):
            if total[i] < k:
                return -1
        
        left = 0
        min_len = n + 1
        window = [0] * 26
        
        for right in range(n):
            idx = ord(s[right]) - ord('a')
            window[idx] += 1
            
            while (window[0] > total[0] - k or
                   window[1] > total[1] - k or
                   window[2] > total[2] - k):
                idx = ord(s[left]) - ord('a')
                window[idx] -= 1
                left += 1
            
            if (window[0] <= total[0] - k and
                window[1] <= total[1] - k and
                window[2] <= total[2] - k):
                min_len = min(min_len, right - left + 1)
        
        return n - min_len if min_len != n + 1 else -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int takeCharacters(string s, int k) {
        if (k == 0) return 0;
        
        int n = s.size();
        vector<int> total(26, 0);
        for (char c : s) total[c - 'a']++;
        
        for (int i = 0; i < 3; i++) {
            if (total[i] < k) return -1;
        }
        
        int left = 0;
        int minLen = n + 1;
        vector<int> window(26, 0);
        
        for (int right = 0; right < n; right++) {
            window[s[right] - 'a']++;
            
            while (window[0] > total[0] - k ||
                   window[1] > total[1] - k ||
                   window[2] > total[2] - k) {
                window[s[left] - 'a']--;
                left++;
            }
            
            if (window[0] <= total[0] - k &&
                window[1] <= total[1] - k &&
                window[2] <= total[2] - k) {
                minLen = min(minLen, right - left + 1);
            }
        }
        
        return minLen == n + 1 ? -1 : n - minLen;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int takeCharacters(String s, int k) {
        if (k == 0) return 0;
        
        int n = s.length();
        int[] total = new int[26];
        for (char c : s.toCharArray()) {
            total[c - 'a']++;
        }
        
        for (int i = 0; i < 3; i++) {
            if (total[i] < k) return -1;
        }
        
        int left = 0;
        int minLen = n + 1;
        int[] window = new int[26];
        
        for (int right = 0; right < n; right++) {
            window[s.charAt(right) - 'a']++;
            
            while (window[0] > total[0] - k ||
                   window[1] > total[1] - k ||
                   window[2] > total[2] - k) {
                window[s.charAt(left) - 'a']--;
                left++;
            }
            
            if (window[0] <= total[0] - k &&
                window[1] <= total[1] - k &&
                window[2] <= total[2] - k) {
                minLen = Math.min(minLen, right - left + 1);
            }
        }
        
        return minLen == n + 1 ? -1 : n - minLen;
    }
}
```

<!-- slide -->
```javascript
var takeCharacters = function(s, k) {
    if (k === 0) return 0;
    
    const n = s.length;
    const total = new Array(26).fill(0);
    for (const c of s) {
        total[c.charCodeAt(0) - 97]++;
    }
    
    for (let i = 0; i < 3; i++) {
        if (total[i] < k) return -1;
    }
    
    let left = 0;
    let minLen = n + 1;
    const window = new Array(26).fill(0);
    
    for (let right = 0; right < n; right++) {
        window[s.charCodeAt(right) - 97]++;
        
        while (window[0] > total[0] - k ||
               window[1] > total[1] - k ||
               window[2] > total[2] - k) {
            window[s.charCodeAt(left) - 97]--;
            left++;
        }
        
        if (window[0] <= total[0] - k &&
            window[1] <= total[1] - k &&
            window[2] <= total[2] - k) {
            minLen = Math.min(minLen, right - left + 1);
        }
    }
    
    return minLen === n + 1 ? -1 : n - minLen;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(1) - fixed size arrays |

---

## Comparison of Approaches

| Aspect | Sliding Window | Two-Pointer Array |
|--------|----------------|-------------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Simple (Counter) | Moderate (Arrays) |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Medium | Medium |

**Best Approach:** Either approach works; choose based on preference.

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Size Subarray Sum | [Link](https://leetcode.com/problems/minimum-size-subarray-sum/) | Sliding window |
| Longest Substring Without Repeating Characters | [Link](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Sliding window |
| Substring with Concatenation of All Words | [Link](https://leetcode.com/problems/substring-with-concatenation-of-all-words/) | Sliding window |

---

## Video Tutorial Links

1. **[NeetCode - Take K of Each Character](https://www.youtube.com/watch?v=EXAMPLE)** - Clear explanation
2. **[Sliding Window Pattern](https://www.youtube.com/watch?v=EXAMPLE)** - Understanding sliding window

---

## Follow-up Questions

### Q1: How would you modify for more than 3 characters?

**Answer:** Use a hashmap/Counter instead of fixed-size array. The logic remains the same.

---

### Q2: Can you solve without sliding window?

**Answer:** You could try all possible middle substrings (O(n²)), but sliding window is optimal.

---

### Q3: What's the minimum and maximum answer?

**Answer:** Minimum is 0 (if k=0 or already have k of each), maximum is n (take all from one side).

---

## Common Pitfalls

### 1. Not Checking k == 0
**Issue**: For k == 0, answer should be 0.

**Solution**: Add early return for k == 0.

### 2. Not Checking Impossible Case
**Issue**: If total count of any character < k, it's impossible.

**Solution**: Check total counts before processing.

### 3. Off-by-One in Window Validity
**Issue**: Using > instead of >= or vice versa.

**Solution**: Remember: window_count <= total - k is the validity condition.

### 4. Integer Overflow
**Issue**: Using large values for min_len initialization.

**Solution**: Use n + 1 which is guaranteed to be larger than any valid window.

---

## Summary

The **Take K of Each Character From Left and Right** problem demonstrates:
- **Reverse thinking**: Instead of taking from ends, find middle to keep
- **Sliding window**: Efficiently find maximum valid middle substring
- **Window validity**: Based on character counts remaining after removal

Key takeaways:
1. The problem is equivalent to finding the longest valid middle substring
2. Window is valid when window_count <= total - k for all characters
3. Answer = n - max_valid_window_size
4. Edge cases: k=0 (return 0), impossible (return -1)

This problem is essential for understanding sliding window with multiple constraints.

---

### Pattern Summary

This problem exemplifies the **Sliding Window** pattern, characterized by:
- Finding maximum/minimum substring satisfying conditions
- Two-pointer technique for O(n) complexity
- Validity checking based on character counts
- Reversing the problem for easier solution

For more details on this pattern, see the **[Sliding Window Pattern](/patterns/sliding-window)**.
