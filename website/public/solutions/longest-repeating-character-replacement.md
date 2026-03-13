# Longest Repeating Character Replacement

## Problem Description

You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times.

Return the length of the longest substring containing the same letter you can get after performing the above operations.

**Link to problem:** [Longest Repeating Character Replacement - LeetCode 424](https://leetcode.com/problems/longest-repeating-character-replacement/)

## Constraints
- `1 <= s.length <= 10^5`
- `s` consists of only uppercase English letters
- `0 <= k <= s.length`

---

## Pattern: Sliding Window with Character Count

This problem uses the **Sliding Window** pattern with a character frequency counter. The key insight is that we don't need to know which character to replace - we just need to maintain a window where we can convert all other characters to the most frequent one within k operations.

### Core Concept

The key insight is:
- For any window, the minimum changes needed = window_size - max_frequency
- If this is <= k, the window is valid
- We use sliding window to maintain the largest valid window

---

## Examples

### Example

**Input:**
```
s = "ABAB", k = 2
```

**Output:**
```
4
```

**Explanation:** Replace the two 'A's with two 'B's (or vice versa) to get a substring of 4 identical characters.

### Example 2

**Input:**
```
s = "AABABBA", k = 1
```

**Output:**
```
4
```

**Explanation:** Replace the one 'A' in the middle with 'B' to form "AABBBBA". The substring "BBBB" has length 4.

### Example 3

**Input:**
```
s = "ABCDE", k = 1
```

**Output:**
```
2
```

**Explanation:** We can only change one character, so maximum is 2 (either "AA", "BB", "CC", "DD", or "EE").

---

## Intuition

The key insight is:

1. **Valid Window Condition**: For a window [left, right], changes needed = window_size - max_count
2. **Sliding Window**: Expand right, shrink left when invalid
3. **Optimization**: We don't need to recalculate max_count every time - just track the most frequent character

### Why It Works

The sliding window maintains the largest possible valid window. By tracking the maximum frequency within the window, we can determine if the window is valid (needs <= k changes).

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Sliding Window with Counter (Optimal)** - O(n) time, O(1) space
2. **Brute Force** - O(n² × 26) time - Not recommended

---

## Approach 1: Sliding Window with Counter (Optimal)

This is the standard solution using sliding window with character frequency tracking.

### Algorithm Steps

1. Initialize `left = 0`, `max_len = 0`, `max_freq = 0`
2. Create a counter for character frequencies
3. For each `right` from 0 to n-1:
   - Add `s[right]` to counter
   - Update `max_freq` if needed
   - While window_size - max_freq > k:
     - Remove `s[left]` from counter
     - Increment `left`
   - Update `max_len` with current window size
4. Return `max_len`

### Why It Works

The sliding window maintains the largest valid window. The key insight is that we only need to know the count of the most frequent character to determine if we can make the window valid with k changes.

### Code Implementation

````carousel
```python
from collections import Counter

class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        """
        Find longest repeating character substring with at most k replacements.
        
        Args:
            s: Input string of uppercase letters
            k: Maximum number of replacements allowed
            
        Returns:
            Length of longest valid substring
        """
        left = 0
        max_len = 0
        max_freq = 0
        counter = Counter()
        
        for right in range(len(s)):
            # Add current character to counter
            counter[s[right]] += 1
            
            # Update max frequency in current window
            max_freq = max(max_freq, counter[s[right]])
            
            # If window is invalid, shrink from left
            while (right - left + 1) - max_freq > k:
                counter[s[left]] -= 1
                left += 1
                # Note: We don't update max_freq here for efficiency
                # max_freq is an upper bound, not exact
            
            # Update maximum length
            max_len = max(max_len, right - left + 1)
        
        return max_len
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    /**
     * Find longest repeating character substring with at most k replacements.
     * 
     * @param s Input string of uppercase letters
     * @param k Maximum number of replacements allowed
     * @return Length of longest valid substring
     */
    int characterReplacement(string s, int k) {
        int left = 0;
        int maxLen = 0;
        int maxFreq = 0;
        int counter[26] = {0};
        
        for (int right = 0; right < s.length(); right++) {
            // Add current character to counter
            counter[s[right] - 'A']++;
            
            // Update max frequency in current window
            maxFreq = max(maxFreq, counter[s[right] - 'A']);
            
            // If window is invalid, shrink from left
            while ((right - left + 1) - maxFreq > k) {
                counter[s[left] - 'A']--;
                left++;
            }
            
            // Update maximum length
            maxLen = max(maxLen, right - left + 1);
        }
        
        return maxLen;
    }
};
```

<!-- slide -->
```java
class Solution {
    /**
     * Find longest repeating character substring with at most k replacements.
     * 
     * @param s Input string of uppercase letters
     * @param k Maximum number of replacements allowed
     * @return Length of longest valid substring
     */
    public int characterReplacement(String s, int k) {
        int left = 0;
        int maxLen = 0;
        int maxFreq = 0;
        int[] counter = new int[26];
        
        for (int right = 0; right < s.length(); right++) {
            // Add current character to counter
            counter[s.charAt(right) - 'A']++;
            
            // Update max frequency in current window
            maxFreq = Math.max(maxFreq, counter[s.charAt(right) - 'A']);
            
            // If window is invalid, shrink from left
            while ((right - left + 1) - maxFreq > k) {
                counter[s.charAt(left) - 'A']--;
                left++;
            }
            
            // Update maximum length
            maxLen = Math.max(maxLen, right - left + 1);
        }
        
        return maxLen;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find longest repeating character substring with at most k replacements.
 * 
 * @param {string} s - Input string of uppercase letters
 * @param {number} k - Maximum number of replacements allowed
 * @return {number} - Length of longest valid substring
 */
var characterReplacement = function(s, k) {
    let left = 0;
    let maxLen = 0;
    let maxFreq = 0;
    const counter = new Array(26).fill(0);
    
    for (let right = 0; right < s.length; right++) {
        // Add current character to counter
        counter[s.charCodeAt(right) - 65]++;
        
        // Update max frequency in current window
        maxFreq = Math.max(maxFreq, counter[s.charCodeAt(right) - 65]);
        
        // If window is invalid, shrink from left
        while ((right - left + 1) - maxFreq > k) {
            counter[s.charCodeAt(left) - 65]--;
            left++;
        }
        
        // Update maximum length
        maxLen = Math.max(maxLen, right - left + 1);
    }
    
    return maxLen;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each character is processed at most twice |
| **Space** | O(1) - Counter stores at most 26 uppercase letters |

---

## Approach 2: Brute Force

This approach tries all possible windows. Not recommended.

### Algorithm Steps

1. For each starting position, expand and try all possible windows
2. Check if valid by counting frequencies
3. Track maximum valid window

### Code Implementation

````carousel
```python
from collections import Counter

class Solution:
    def characterReplacement_bruteforce(self, s: str, k: int) -> int:
        """
        Brute force approach - not recommended.
        """
        n = len(s)
        max_len = 0
        
        for left in range(n):
            counter = Counter()
            for right in range(left, n):
                counter[s[right]] += 1
                max_freq = max(counter.values())
                
                if (right - left + 1) - max_freq <= k:
                    max_len = max(max_len, right - left + 1)
                else:
                    break
        
        return max_len
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    int characterReplacement(string s, int k) {
        int n = s.length();
        int maxLen = 0;
        
        for (int left = 0; left < n; left++) {
            int counter[26] = {0};
            for (int right = left; right < n; right++) {
                counter[s[right] - 'A']++;
                int maxFreq = 0;
                for (int i = 0; i < 26; i++) {
                    maxFreq = max(maxFreq, counter[i]);
                }
                
                if ((right - left + 1) - maxFreq <= k) {
                    maxLen = max(maxLen, right - left + 1);
                } else {
                    break;
                }
            }
        }
        
        return maxLen;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int characterReplacement(String s, int k) {
        int n = s.length();
        int maxLen = 0;
        
        for (int left = 0; left < n; left++) {
            int[] counter = new int[26];
            for (int right = left; right < n; right++) {
                counter[s.charAt(right) - 'A']++;
                int maxFreq = 0;
                for (int count : counter) {
                    maxFreq = Math.max(maxFreq, count);
                }
                
                if ((right - left + 1) - maxFreq <= k) {
                    maxLen = Math.max(maxLen, right - left + 1);
                } else {
                    break;
                }
            }
        }
        
        return maxLen;
    }
}
```

<!-- slide -->
```javascript
/**
 * Brute force approach - not recommended.
 * 
 * @param {string} s - Input string
 * @param {number} k - Maximum replacements
 * @return {number} - Maximum length
 */
var characterReplacement = function(s, k) {
    const n = s.length();
    let maxLen = 0;
    
    for (let left = 0; left < n; left++) {
        const counter = new Array(26).fill(0);
        for (let right = left; right < n; right++) {
            counter[s.charCodeAt(right) - 65]++;
            const maxFreq = Math.max(...counter);
            
            if ((right - left + 1) - maxFreq <= k) {
                maxLen = Math.max(maxLen, right - left + 1);
            } else {
                break;
            }
        }
    }
    
    return maxLen;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n² × 26) - Nested loops with frequency counting |
| **Space** | O(1) - Counter |

---

## Comparison of Approaches

| Aspect | Sliding Window | Brute Force |
|--------|---------------|-------------|
| **Time Complexity** | O(n) | O(n² × 26) |
| **Space Complexity** | O(1) | O(1) |
| **LeetCode Optimal** | ✅ Yes | ❌ No |
| **Best For** | All inputs | Not recommended |

**Best Approach:** The sliding window approach is optimal.

---

## Key Insight: Why Not Update maxFreq on Shrink?

An interesting optimization is that we don't need to recalculate max_freq when shrinking the window. Here's why:

- max_freq is an upper bound on the actual maximum
- As we shrink, max_freq can only stay the same or decrease
- Using a slightly higher max_freq is okay - it makes our condition more strict
- If the window was valid with the old max_freq, it remains valid

This gives us O(n) time instead of O(n × 26).

---

## Related Problems

Based on similar themes (sliding window, string manipulation):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Longest Repeating Character Replacement | [Link](https://leetcode.com/problems/longest-repeating-character-replacement/) | This problem |
| Longest Substring Without Repeating Characters | [Link](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | No repeating characters |
| Maximum Number of Vowels in a Substring | [Link](https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/) | Sliding window with constraint |

### Pattern Reference

For more detailed explanations of the Sliding Window pattern, see:
- **[Sliding Window - Variable Size](/patterns/sliding-window-variable-size-condition-based)**
- **[Sliding Window - Fixed Size](/patterns/sliding-window-fixed-size-subarray-calculation)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Sliding Window

- [NeetCode - Longest Repeating Character Replacement](https://www.youtube.com/watch?v=gC8cDnR0oZQ) - Clear explanation with visual examples
- [Character Replacement - Back to Back SWE](https://www.youtube.com/watch?v=gC8cDnR0oZQ) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=gC8cDnR0oZQ) - Official problem solution

### Related Concepts

- [Sliding Window Technique](https://www.youtube.com/watch?v=gC8cDnR0oZQ) - Understanding sliding window
- [Character Frequency Counting](https://www.youtube.com/watch?v=gC8cDnR0oZQ) - Efficient counting

---

## Follow-up Questions

### Q1: Why don't we need to update max_freq when shrinking the window?

**Answer:** We don't need to because max_freq is an upper bound. As we shrink, the window only becomes more valid, so using a stale max_freq doesn't break correctness. This optimization gives us O(n) time.

---

### Q2: What if k is larger than the string length?

**Answer:** The problem guarantees 0 <= k <= s.length. If k >= n, we can change all characters to be the same, so answer is n.

---

### Q3: Can you solve it for lowercase letters too?

**Answer:** Yes, simply adjust the counter size from 26 to 52 or use a hash map for any character set.

---

### Q4: What is the time complexity?

**Answer:** O(n) time and O(1) space. Each character is processed at most twice.

---

### Q5: How would you find the actual substring?

**Answer:** Track the left and right pointers when you update max_len. This gives you the exact substring.

---

### Q6: What if we need to know which character to replace?

**Answer:** The algorithm doesn't need to know this. We just track the count of the most frequent character and assume we can convert all others.

---

### Q7: How is this different from Longest Substring Without Repeating Characters?

**Answer:** In that problem, we can't have any repeating characters. Here, we can have repeats - we just need to be able to make them all the same with at most k replacements.

---

### Q8: What edge cases should be tested?

**Answer:**
- k = 0 (no replacements allowed)
- k >= n (can change everything)
- All same characters
- No same characters with small k

---

## Common Pitfalls

### 1. Not Using Correct Comparison
**Issue:** Using >= instead of > in the while condition.

**Solution:** Use > since we need window_size - max_freq <= k to be valid.

### 2. Updating maxFreq Incorrectly
**Issue:** Trying to recalculate maxFreq on every shrink.

**Solution:** Don't update - use the optimization mentioned above.

### 3. Wrong Counter Size
**Issue:** Not accounting for uppercase letters only.

**Solution:** Use array of size 26 for uppercase A-Z.

### 4. Not Handling k = 0
**Issue:** Not testing edge case where no replacements allowed.

**Solution:** The algorithm handles this correctly - max_freq must equal window size.

---

## Summary

The **Longest Repeating Character Replacement** problem demonstrates the sliding window technique with character counting:

- **Optimal Solution**: O(n) time with sliding window
- **Key Insight**: window_size - max_freq <= k for valid window
- **Optimization**: Don't update max_freq when shrinking

The key insight is that we only need to track the most frequent character in the window. The number of changes needed to make all characters the same is window_size - max_freq.

### Pattern Summary

This problem exemplifies the **Sliding Window with Frequency Count** pattern, which is characterized by:
- Variable-size sliding window
- Character frequency tracking
- O(n) time complexity
- O(1) space for bounded alphabet

For more details on this pattern and its variations, see:
- **[Sliding Window - Variable Size](/patterns/sliding-window-variable-size-condition-based)**

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/longest-repeating-character-replacement/discuss/) - Community solutions
- [Sliding Window - GeeksforGeeks](https://www.geeksforgeeks.org/window-sliding-technique/) - Understanding sliding window
- [Character Frequency - Geeksforgeeks](https://www.geeksforgeeks.org/counting-frequencies-of-array-elements/) - Frequency counting
- [Pattern: Sliding Window - Variable Size](/patterns/sliding-window-variable-size-condition-based) - Related pattern guide
