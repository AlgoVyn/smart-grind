# Permutation In String

**Link to problem:** [Permutation In String - LeetCode 567](https://leetcode.com/problems/permutation-in-string/)

## Problem Description

Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise.
In other words, return `true` if one of `s1`'s permutations is the substring of `s2`.

## Examples

### Example

**Input:** `s1 = "ab"`, `s2 = "eidbaooo"`  
**Output:** `true`

**Explanation:** `s2` contains one permutation of `s1` (`"ba"`).

### Example 2

**Input:** `s1 = "ab"`, `s2 = "eidboaoo"`  
**Output:** `false`

## Constraints

- `1 <= s1.length, s2.length <= 10^4`
- `s1` and `s2` consist of lowercase English letters.

---

## Intuition

The key insight is that a permutation of `s1` has the same character frequency as `s1` itself. So we need to check if any substring of `s2` has the same character count as `s1`.

**Key Observations:**
1. A permutation contains exactly the same characters (just in different order)
2. If two strings have the same character frequency, one is a permutation of the other
3. We can use a sliding window of size `len(s1)` over `s2`
4. As we slide, we update the character counts by removing the leftmost character and adding the new rightmost character

**Why Sliding Window Works:**
- The window size equals `s1.length()`, which is the exact size needed for a permutation
- Comparing character frequencies tells us if the current window is a permutation
- O(n) time because each character is added and removed at most once

---

## Multiple Approaches

We'll cover three approaches:

1. **Sliding Window with Array Comparison** - O(n) time, O(1) space
2. **Sliding Window with Difference Counter** - O(n) time, O(1) space (optimized)
3. **Sort-Based Approach** - O(n log n) time, O(n) space (alternative)

---

## Approach 1: Sliding Window with Array Comparison (Optimal) ⭐

This is the most straightforward approach using character frequency arrays.

### Algorithm Steps

1. If `len(s1) > len(s2)`, return `false` immediately
2. Create count arrays for both strings (26 for lowercase letters)
3 counts for `s1. Initialize` and the first window of `s2`
4. Compare the two count arrays - if equal, return `true`
5. Slide the window through `s2`, updating counts:
   - Decrement the character leaving the window
   - Increment the character entering the window
6. Return `false` if no match found

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        """
        Check if s2 contains a permutation of s1 using sliding window.
        
        Args:
            s1: Pattern string to match
            s2: Source string to search in
            
        Returns:
            True if s2 contains a permutation of s1, False otherwise
        """
        if len(s1) > len(s2):
            return False
            
        # Count arrays for 26 lowercase letters
        count1 = [0] * 26
        count2 = [0] * 26
        
        # Count characters in s1
        for c in s1:
            count1[ord(c) - ord('a')] += 1
            
        # Count characters in first window of s2
        for i in range(len(s1)):
            count2[ord(s2[i]) - ord('a')] += 1
            
        # Check if first window matches
        if count1 == count2:
            return True
            
        # Slide the window through s2
        for i in range(len(s1), len(s2)):
            # Add new character (right side of window)
            count2[ord(s2[i]) - ord('a')] += 1
            # Remove old character (left side of window)
            count2[ord(s2[i - len(s1)]) - ord('a')] -= 1
            
            # Check if current window matches
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
    /**
     * Check if s2 contains a permutation of s1 using sliding window.
     * 
     * Time Complexity: O(n) where n = s2.length()
     * Space Complexity: O(1) - constant space for 26 character counts
     */
    bool checkInclusion(std::string s1, std::string s2) {
        if (s1.length() > s2.length()) return false;
        
        // Count arrays for 26 lowercase letters
        std::vector<int> count1(26, 0), count2(26, 0);
        
        // Count characters in s1
        for (char c : s1) {
            count1[c - 'a']++;
        }
        
        // Count characters in first window of s2
        for (int i = 0; i < s1.length(); i++) {
            count2[s2[i] - 'a']++;
        }
        
        // Check if first window matches
        if (count1 == count2) return true;
        
        // Slide the window through s2
        for (int i = s1.length(); i < s2.length(); i++) {
            // Add new character (right side)
            count2[s2[i] - 'a']++;
            // Remove old character (left side)
            count2[s2[i - s1.length()] - 'a']--;
            
            // Check if current window matches
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
    /**
     * Check if s2 contains a permutation of s1 using sliding window.
     * 
     * Time Complexity: O(n) where n = s2.length()
     * Space Complexity: O(1) - constant space for 26 character counts
     */
    public boolean checkInclusion(String s1, String s2) {
        if (s1.length() > s2.length()) return false;
        
        // Count arrays for 26 lowercase letters
        int[] count1 = new int[26];
        int[] count2 = new int[26];
        
        // Count characters in s1
        for (char c : s1.toCharArray()) {
            count1[c - 'a']++;
        }
        
        // Count characters in first window of s2
        for (int i = 0; i < s1.length(); i++) {
            count2[s2.charAt(i) - 'a']++;
        }
        
        // Check if first window matches
        if (Arrays.equals(count1, count2)) return true;
        
        // Slide the window through s2
        for (int i = s1.length(); i < s2.length(); i++) {
            // Add new character (right side)
            count2[s2.charAt(i) - 'a']++;
            // Remove old character (left side)
            count2[s2.charAt(i - s1.length()) - 'a']--;
            
            // Check if current window matches
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
    
    // Count arrays for 26 lowercase letters
    const count1 = new Array(26).fill(0);
    const count2 = new Array(26).fill(0);
    
    // Count characters in s1
    for (const c of s1) {
        count1[c.charCodeAt(0) - 97]++;
    }
    
    // Count characters in first window of s2
    for (let i = 0; i < s1.length; i++) {
        count2[s2.charCodeAt(i) - 97]++;
    }
    
    // Check if first window matches
    if (arraysEqual(count1, count2)) return true;
    
    // Slide the window through s2
    for (let i = s1.length; i < s2.length; i++) {
        // Add new character (right side)
        count2[s2.charCodeAt(i) - 97]++;
        // Remove old character (left side)
        count2[s2.charCodeAt(i - s1.length) - 97]--;
        
        // Check if current window matches
        if (arraysEqual(count1, count2)) return true;
    }
    
    return false;
}

// Helper function to compare arrays
function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) where n = len(s2), each character processed at most twice |
| **Space** | O(1), constant space for 26-count arrays |

---

## Approach 2: Sliding Window with Difference Counter (Optimized)

This approach optimizes the comparison by maintaining a difference counter instead of comparing entire arrays.

### Algorithm Steps

1. If `len(s1) > len(s2)`, return `false`
2. Track differences between `s1` and current window using a counter
3. Use a `diff` variable that counts how many character frequencies don't match
4. When `diff == 0`, we have a match

### Code Implementation

````carousel
```python
class Solution:
    def checkInclusion_optimized(self, s1: str, s2: str) -> bool:
        """
        Optimized approach using difference counter.
        
        Args:
            s1: Pattern string to match
            s2: Source string to search in
            
        Returns:
            True if s2 contains a permutation of s1, False otherwise
        """
        if len(s1) > len(s2):
            return False
            
        # Count array for s1
        count = [0] * 26
        for c in s1:
            count[ord(c) - ord('a')] += 1
            
        # Initialize difference counter
        diff = 0
        for i in range(26):
            if count[i] != 0:
                diff += 1
                
        # Check first window
        for i in range(len(s1)):
            idx = ord(s2[i]) - ord('a')
            if count[idx] == 1:  # Was 1, now 0
                diff += 1
            count[idx] -= 1
            if count[idx] == 0:  # Just became 0
                diff -= 1
                
        if diff == 0:
            return True
            
        # Slide window
        for i in range(len(s1), len(s2)):
            # Add new character
            idx = ord(s2[i]) - ord('a')
            if count[idx] == 1:
                diff += 1
            count[idx] -= 1
            if count[idx] == 0:
                diff -= 1
                
            # Remove old character
            old_idx = ord(s2[i - len(s1)]) - ord('a')
            if count[old_idx] == -1:
                diff += 1
            count[old_idx] += 1
            if count[old_idx] == 0:
                diff -= 1
                
            if diff == 0:
                return True
                
        return False
```

<!-- slide -->
```cpp
class Solution {
public:
    bool checkInclusion(string s1, string s2) {
        if (s1.length() > s2.length()) return false;
        
        vector<int> count(26, 0);
        for (char c : s1) count[c - 'a']++;
        
        int diff = 0;
        for (int i = 0; i < 26; i++)
            if (count[i] != 0) diff++;
        
        // Check first window
        for (int i = 0; i < s1.length(); i++) {
            int idx = s2[i] - 'a';
            if (count[idx] == 1) diff++;
            count[idx]--;
            if (count[idx] == 0) diff--;
        }
        
        if (diff == 0) return true;
        
        // Slide window
        for (int i = s1.length(); i < s2.length(); i++) {
            int idx = s2[i] - 'a';
            if (count[idx] == 1) diff++;
            count[idx]--;
            if (count[idx] == 0) diff--;
            
            int oldIdx = s2[i - s1.length()] - 'a';
            if (count[oldIdx] == -1) diff++;
            count[oldIdx]++;
            if (count[oldIdx] == 0) diff--;
            
            if (diff == 0) return true;
        }
        
        return false;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean checkInclusion(String s1, String s2) {
        if (s1.length() > s2.length()) return false;
        
        int[] count = new int[26];
        for (char c : s1.toCharArray()) count[c - 'a']++;
        
        int diff = 0;
        for (int i = 0; i < 26; i++)
            if (count[i] != 0) diff++;
        
        // Check first window
        for (int i = 0; i < s1.length(); i++) {
            int idx = s2.charAt(i) - 'a';
            if (count[idx] == 1) diff++;
            count[idx]--;
            if (count[idx] == 0) diff--;
        }
        
        if (diff == 0) return true;
        
        // Slide window
        for (int i = s1.length(); i < s2.length(); i++) {
            int idx = s2.charAt(i) - 'a';
            if (count[idx] == 1) diff++;
            count[idx]--;
            if (count[idx] == 0) diff--;
            
            int oldIdx = s2.charAt(i - s1.length()) - 'a';
            if (count[oldIdx] == -1) diff++;
            count[oldIdx]++;
            if (count[oldIdx] == 0) diff--;
            
            if (diff == 0) return true;
        }
        
        return false;
    }
}
```

<!-- slide -->
```javascript
var checkInclusion = function(s1, s2) {
    if (s1.length > s2.length) return false;
    
    const count = new Array(26).fill(0);
    for (const c of s1) count[c.charCodeAt(0) - 97]++;
    
    let diff = 0;
    for (let i = 0; i < 26; i++)
        if (count[i] !== 0) diff++;
    
    // Check first window
    for (let i = 0; i < s1.length; i++) {
        let idx = s2.charCodeAt(i) - 97;
        if (count[idx] === 1) diff++;
        count[idx]--;
        if (count[idx] === 0) diff--;
    }
    
    if (diff === 0) return true;
    
    // Slide window
    for (let i = s1.length; i < s2.length; i++) {
        let idx = s2.charCodeAt(i) - 97;
        if (count[idx] === 1) diff++;
        count[idx]--;
        if (count[idx] === 0) diff--;
        
        let oldIdx = s2.charCodeAt(i - s1.length) - 97;
        if (count[oldIdx] === -1) diff++;
        count[oldIdx]++;
        if (count[oldIdx] === 0) diff--;
        
        if (diff === 0) return true;
    }
    
    return false;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) where n = len(s2) |
| **Space** | O(1), constant space |

---

## Approach 3: Sort-Based Approach (Alternative)

This approach sorts both strings and compares them, though it's less efficient.

### Algorithm Steps

1. Sort `s1`
2. For each window of size `len(s1)` in `s2`:
   - Extract the substring
   - Sort it
   - Compare with sorted `s1`
3. Return `true` if any match found

### Code Implementation

````carousel
```python
class Solution:
    def checkInclusion_sort(self, s1: str, s2: str) -> bool:
        """
        Sort-based approach (less efficient but intuitive).
        
        Args:
            s1: Pattern string to match
            s2: Source string to search in
            
        Returns:
            True if s2 contains a permutation of s1, False otherwise
        """
        if len(s1) > len(s2):
            return False
            
        s1_sorted = sorted(s1)
        
        for i in range(len(s2) - len(s1) + 1):
            if sorted(s2[i:i + len(s1)]) == s1_sorted:
                return True
                
        return False
```

<!-- slide -->
```cpp
class Solution {
public:
    bool checkInclusion(string s1, string s2) {
        if (s1.length() > s2.length()) return false;
        
        sort(s1.begin(), s1.end());
        
        for (int i = 0; i <= s2.length() - s1.length(); i++) {
            string window = s2.substr(i, s1.length());
            sort(window.begin(), window.end());
            if (window == s1) return true;
        }
        
        return false;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean checkInclusion(String s1, String s2) {
        if (s1.length() > s2.length()) return false;
        
        char[] s1Chars = s1.toCharArray();
        Arrays.sort(s1Chars);
        String sortedS1 = new String(s1Chars);
        
        for (int i = 0; i <= s2.length() - s1.length(); i++) {
            String window = s2.substring(i, i + s1.length());
            char[] windowChars = window.toCharArray();
            Arrays.sort(windowChars);
            if (new String(windowChars).equals(sortedS1)) return true;
        }
        
        return false;
    }
}
```

<!-- slide -->
```javascript
var checkInclusion = function(s1, s2) {
    if (s1.length > s2.length) return false;
    
    const sortedS1 = s1.split('').sort().join('');
    
    for (let i = 0; i <= s2.length - s1.length; i++) {
        const window = s2.slice(i, i + s1.length);
        if (window.split('').sort().join('') === sortedS1) {
            return true;
        }
    }
    
    return false;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × m log m) where n = len(s2), m = len(s1) |
| **Space** | O(m) for storing sorted strings |

---

## Comparison of Approaches

| Aspect | Array Comparison | Diff Counter | Sort-Based |
|--------|-----------------|--------------|------------|
| **Time Complexity** | O(n) | O(n) | O(n × m log m) |
| **Space Complexity** | O(1) | O(1) | O(m) |
| **Implementation** | Simple | Moderate | Simple |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ❌ No |
| **Best For** | General use | Large alphabets | Small inputs |

**Best Approach:** The Array Comparison approach (Approach 1) is optimal and most commonly used.

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
| Valid Anagram | [Valid Anagram](/solutions/valid-anagram) | Easy |
| Find the Difference | [Find the Difference](/solutions/find-the-difference) | Easy |

---

## Video Resources

- [Permutation in String - NeetCode](https://www.youtube.com/watch?v=UbyhOgBBYGQ)
- [Sliding Window Technique - Abdul Bari](https://www.youtube.com/watch?v=9ZHzBbuZ6VU)
- [LeetCode Official Solution](https://www.youtube.com/watch?v=8hQPLSSjkMY)
- [Two Pointer & Sliding Window Patterns](https://www.youtube.com/watch?v=M2fkG3c8j2U)

---

## Follow-up Questions

### Q1: Can you solve it in O(n) time and O(1) space?

**Answer:** Yes! The sliding window approach with character frequency comparison achieves O(n) time and O(1) space complexity. This is the optimal solution as it uses constant extra space regardless of input size.

---

### Q2: What is the difference between this problem and "Find All Anagrams in a String"?

**Answer:** 
- **Permutation in String**: Returns a boolean (true/false) - just need to find if any permutation exists
- **Find All Anagrams**: Returns all starting indices where anagrams occur - needs to track all positions

Both use the same sliding window technique, but anagram finding requires storing all valid positions.

---

### Q3: How would you handle Unicode characters instead of just lowercase English letters?

**Answer:** 
- Use a HashMap/Dictionary instead of a fixed-size array
- The space complexity remains O(1) in terms of alphabet size, but depends on character set
- For very large character sets (Unicode), consider using a Map to only track characters that appear in s1

---

### Q4: What if s1 contains duplicate characters?

**Answer:** The current solution already handles duplicates correctly! Character frequency arrays count all occurrences, so duplicates are naturally accounted for. For example, s1 = "aab" would match windows with exactly two 'a's and one 'b'.

---

### Q5: How would you modify the solution to find the starting index of the permutation?

**Answer:** Simply return `true` when a match is found. If you need the index, return `i - len(s1) + 1` when the match is detected in the sliding window loop.

---

### Q6: Can you use this approach for case-sensitive matching?

**Answer:** Yes, but you would need to increase the character array size or use a HashMap. For ASCII, use 128-size array; for extended ASCII, use 256. For Unicode, use a HashMap/Dictionary approach.

---

### Q7: What edge cases should be tested?

**Answer:**
- Empty strings (not allowed per constraints, but good to consider)
- s1 longer than s2
- s1 and s2 of equal length
- All same characters (e.g., s1 = "aa", s2 = "aaaa")
- No valid permutation exists
- Valid permutation at the very beginning or end of s2
- Single character s1

---

### Q8: How would you extend this to find all permutations (not just check existence)?

**Answer:** 
- Use the same sliding window technique
- Store the starting index whenever a match is found instead of returning immediately
- Return the list of all indices at the end
- Time complexity remains O(n), space becomes O(k) where k is number of matches

---

## Common Pitfalls

### Common Mistakes to Avoid

1. **Character count mismatches**: Make sure window size exactly matches s1's length

2. **Not updating counts correctly**: When sliding the window, decrement the leftmost character and increment the new rightmost

3. **Early termination**: Don't return true immediately upon finding a match - verify all windows

4. **Case sensitivity**: The problem is case-sensitive, so 'a' and 'A' are different

---

## Summary

The **Permutation In String** problem demonstrates the power of the sliding window technique combined with character frequency counting:

- **Sliding Window**: Efficiently checks each possible substring of length `len(s1)`
- **Character Frequency**: Determines if two strings are permutations of each other
- **Optimal Solution**: O(n) time, O(1) space

This problem is an excellent example of how understanding the problem constraints and properties can lead to an efficient solution. The sliding window pattern is widely applicable to many string and array problems.

For more details on this pattern and its variations, see the **[Sliding Window - Character Frequency Matching](/patterns/sliding-window-character-frequency-matching)** pattern guide.
