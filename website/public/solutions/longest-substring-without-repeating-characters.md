# Longest Substring Without Repeating Characters

## Problem Statement

Given a string `s`, find the length of the **longest substring** without repeating characters.

**Link to problem:** [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

**Constraints:**
- `0 <= s.length <= 5 * 10^4`
- `s` consists of English letters, digits, symbols, and spaces

**Note:**
- A substring is a contiguous sequence of characters
- The substring must not contain any duplicate characters
- We need to find the maximum length among all such substrings
- O(n) solution is required for optimal performance with large inputs

---

## Examples

### Example 1

**Input:**
```
s = "abcabcbb"
```

**Output:**
```
3
```

**Explanation:** The longest substring without repeating characters is "abc", which has length 3.

---

### Example 2

**Input:**
```
s = "bbbbb"
```

**Output:**
```
1
```

**Explanation:** The longest substring without repeating characters is "b", which has length 1.

---

### Example 3

**Input:**
```
s = "pwwkew"
```

**Output:**
```
3
```

**Explanation:** The longest substring without repeating characters is "wke" (or "pwe", "kew"), which has length 3.

---

### Example 4

**Input:**
```
s = ""
```

**Output:**
```
0
```

**Explanation:** Empty string has no characters, so the length is 0.

---

### Example 5

**Input:**
```
s = "dvdf"
```

**Output:**
```
3
```

**Explanation:** The longest substring without repeating characters is "vdf", which has length 3.

---

### Example 6

**Input:**
```
s = "tmmzuxt"
```

**Output:**
```
5
```

**Explanation:** The longest substring without repeating characters is "mzuxt", which has length 5.

---

### Example 7

**Input:**
```
s = "anviaj"
```

**Output:**
```
5
```

**Explanation:** The longest substring without repeating characters is "anvij", which has length 5.

---

## Intuition

The Longest Substring Without Repeating Characters problem requires finding the maximum length of a contiguous substring that contains all unique characters. The naive approach would be to examine all possible substrings and check for duplicates, resulting in O(n²) or O(n³) time complexity.

### Core Insight

The key observation is that we can use a **sliding window** technique to efficiently track the current substring without duplicates. We maintain a window [left, right] that represents the current substring, and expand it by moving the right pointer. When we encounter a duplicate character, we move the left pointer to shrink the window until the duplicate is removed.

### Key Observations

1. **Sliding Window**: Maintain a window [left, right] that always contains unique characters.

2. **Hash Map for Tracking**: Use a hash map (or array for ASCII) to store the most recent index of each character.

3. **Dynamic Window Adjustment**: When a duplicate is found at position `right`, move `left` to `max(left, last_seen[char] + 1)`.

4. **Track Maximum**: Update the maximum length at each step: `max_len = max(max_len, right - left + 1)`.

---

## Multiple Approaches with Code

We'll cover three main approaches:

1. **Brute Force** - O(n²) time, check all substrings
2. **Sliding Window with Hash Map** - O(n) time, optimal solution
3. **Sliding Window with Array** - O(n) time, optimized for ASCII

---

## Approach 1: Brute Force

This approach checks all possible substrings and verifies if they contain unique characters.

### Algorithm Steps

1. Initialize `max_len` to 0
2. For each starting index `left` from 0 to n-1:
   - Create an empty set to track seen characters
   - For each ending index `right` from `left` to n-1:
     - If `s[right]` is already in the set, break (no need to check longer substrings)
     - Add `s[right]` to the set
     - Update `max_len = max(max_len, right - left + 1)`
3. Return `max_len`

### Code Implementation

````carousel
```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        """
        Find the length of the longest substring without repeating characters using brute force.
        
        Args:
            s: Input string
            
        Returns:
            Length of the longest substring without repeating characters
        """
        n = len(s)
        max_len = 0
        
        # Iterate over all possible starting positions
        for left in range(n):
            seen = set()
            
            # Expand the window from left to right
            for right in range(left, n):
                # If character is already seen, break
                if s[right] in seen:
                    break
                
                # Add character to seen set
                seen.add(s[right])
                
                # Update maximum length
                max_len = max(max_len, right - left + 1)
        
        return max_len
```

<!-- slide -->
```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        /**
         * Find the length of the longest substring without repeating characters using brute force.
         * 
         * Args:
         *     s: Input string
         * 
         * Returns:
         *     Length of the longest substring without repeating characters
         */
        int n = s.length();
        int max_len = 0;
        
        // Iterate over all possible starting positions
        for (int left = 0; left < n; left++) {
            unordered_set<char> seen;
            
            // Expand the window from left to right
            for (int right = left; right < n; right++) {
                // If character is already seen, break
                if (seen.count(s[right])) {
                    break;
                }
                
                // Add character to seen set
                seen.insert(s[right]);
                
                // Update maximum length
                max_len = max(max_len, right - left + 1);
            }
        }
        
        return max_len;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        /**
         * Find the length of the longest substring without repeating characters using brute force.
         * 
         * Args:
         *     s: Input string
         * 
         * Returns:
         *     Length of the longest substring without repeating characters
         */
        int n = s.length();
        int max_len = 0;
        
        // Iterate over all possible starting positions
        for (int left = 0; left < n; left++) {
            Set<Character> seen = new HashSet<>();
            
            // Expand the window from left to right
            for (int right = left; right < n; right++) {
                // If character is already seen, break
                if (seen.contains(s.charAt(right))) {
                    break;
                }
                
                // Add character to seen set
                seen.add(s.charAt(right));
                
                // Update maximum length
                max_len = Math.max(max_len, right - left + 1);
            }
        }
        
        return max_len;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the length of the longest substring without repeating characters using brute force.
 * 
 * @param {string} s - Input string
 * @return {number} - Length of the longest substring without repeating characters
 */
var lengthOfLongestSubstring = function(s) {
    const n = s.length;
    let max_len = 0;
    
    // Iterate over all possible starting positions
    for (let left = 0; left < n; left++) {
        const seen = new Set();
        
        // Expand the window from left to right
        for (let right = left; right < n; right++) {
            // If character is already seen, break
            if (seen.has(s[right])) {
                break;
            }
            
            // Add character to seen set
            seen.add(s[right]);
            
            // Update maximum length
            max_len = Math.max(max_len, right - left + 1);
        }
    }
    
    return max_len;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - In worst case, we check all substrings |
| **Space** | O(min(n, m)) - Set stores at most the size of the character set (m) or string length (n) |

---

## Approach 2: Sliding Window with Hash Map (Optimal)

This approach uses a sliding window with a hash map to track the most recent index of each character. When a duplicate is found, we move the left pointer to shrink the window efficiently.

### Algorithm Steps

1. Create an empty hash map to store character -> last seen index
2. Initialize `max_len = 0`, `left = 0`
3. Iterate through each character with index `right`:
   - If `s[right]` is in the hash map and its index is >= `left`:
     - Move `left` to `hash_map[s[right]] + 1`
   - Update `hash_map[s[right]] = right`
   - Update `max_len = max(max_len, right - left + 1)`
4. Return `max_len`

### Code Implementation

````carousel
```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        """
        Find the length of the longest substring without repeating characters using sliding window with hash map.
        
        Args:
            s: Input string
            
        Returns:
            Length of the longest substring without repeating characters
        """
        char_index = {}  # Hash map to store character -> last seen index
        max_len = 0
        left = 0
        
        for right, char in enumerate(s):
            # If character was seen and is within current window, move left pointer
            if char in char_index and char_index[char] >= left:
                left = char_index[char] + 1
            
            # Update the last seen index
            char_index[char] = right
            
            # Update maximum length
            max_len = max(max_len, right - left + 1)
        
        return max_len
```

<!-- slide -->
```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        /**
         * Find the length of the longest substring without repeating characters using sliding window with hash map.
         * 
         * Args:
         *     s: Input string
         * 
         * Returns:
         *     Length of the longest substring without repeating characters
         */
        unordered_map<char, int> char_index;
        int max_len = 0;
        int left = 0;
        
        for (int right = 0; right < s.length(); right++) {
            char c = s[right];
            
            // If character was seen and is within current window, move left pointer
            if (char_index.find(c) != char_index.end() && char_index[c] >= left) {
                left = char_index[c] + 1;
            }
            
            // Update the last seen index
            char_index[c] = right;
            
            // Update maximum length
            max_len = max(max_len, right - left + 1);
        }
        
        return max_len;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        /**
         * Find the length of the longest substring without repeating characters using sliding window with hash map.
         * 
         * Args:
         *     s: Input string
         * 
         * Returns:
         *     Length of the longest substring without repeating characters
         */
        Map<Character, Integer> charIndex = new HashMap<>();
        int max_len = 0;
        int left = 0;
        
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            
            // If character was seen and is within current window, move left pointer
            if (charIndex.containsKey(c) && charIndex.get(c) >= left) {
                left = charIndex.get(c) + 1;
            }
            
            // Update the last seen index
            charIndex.put(c, right);
            
            // Update maximum length
            max_len = Math.max(max_len, right - left + 1);
        }
        
        return max_len;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the length of the longest substring without repeating characters using sliding window with hash map.
 * 
 * @param {string} s - Input string
 * @return {number} - Length of the longest substring without repeating characters
 */
var lengthOfLongestSubstring = function(s) {
    const charIndex = new Map();
    let max_len = 0;
    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
        const c = s[right];
        
        // If character was seen and is within current window, move left pointer
        if (charIndex.has(c) && charIndex.get(c) >= left) {
            left = charIndex.get(c) + 1;
        }
        
        // Update the last seen index
        charIndex.set(c, right);
        
        // Update maximum length
        max_len = Math.max(max_len, right - left + 1);
    }
    
    return max_len;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each character is processed at most twice (once by right, once by left) |
| **Space** | O(min(n, m)) - Hash map stores at most the size of the character set (m) or string length (n) |

---

## Approach 3: Sliding Window with Array (Optimized for ASCII)

This approach uses an array of size 128 (for ASCII) to track character indices, which is faster than a hash map for ASCII characters.

### Algorithm Steps

1. Create an array of size 128 (or 256 for extended ASCII) initialized to -1
2. Initialize `max_len = 0`, `left = 0`
3. Iterate through each character with index `right`:
   - Get the ASCII value of `s[right]`
   - If `last_seen[ascii] >= left`, move `left` to `last_seen[ascii] + 1`
   - Update `last_seen[ascii] = right`
   - Update `max_len = max(max_len, right - left + 1)`
4. Return `max_len`

### Code Implementation

````carousel
```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        """
        Find the length of the longest substring without repeating characters using sliding window with array.
        
        Args:
            s: Input string
            
        Returns:
            Length of the longest substring without repeating characters
        """
        # ASCII character set (128 characters)
        last_seen = [-1] * 128
        max_len = 0
        left = 0
        
        for right, char in enumerate(s):
            ascii_val = ord(char)
            
            # If character was seen and is within current window, move left pointer
            if last_seen[ascii_val] >= left:
                left = last_seen[ascii_val] + 1
            
            # Update the last seen index
            last_seen[ascii_val] = right
            
            # Update maximum length
            max_len = max(max_len, right - left + 1)
        
        return max_len
```

<!-- slide -->
```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        /**
         * Find the length of the longest substring without repeating characters using sliding window with array.
         * 
         * Args:
         *     s: Input string
         * 
         * Returns:
         *     Length of the longest substring without repeating characters
         */
        // ASCII character set (128 characters)
        vector<int> last_seen(128, -1);
        int max_len = 0;
        int left = 0;
        
        for (int right = 0; right < s.length(); right++) {
            int ascii_val = static_cast<int>(s[right]);
            
            // If character was seen and is within current window, move left pointer
            if (last_seen[ascii_val] >= left) {
                left = last_seen[ascii_val] + 1;
            }
            
            // Update the last seen index
            last_seen[ascii_val] = right;
            
            // Update maximum length
            max_len = max(max_len, right - left + 1);
        }
        
        return max_len;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        /**
         * Find the length of the longest substring without repeating characters using sliding window with array.
         * 
         * Args:
         *     s: Input string
         * 
         * Returns:
         *     Length of the longest substring without repeating characters
         */
        // ASCII character set (128 characters)
        int[] last_seen = new int[128];
        Arrays.fill(last_seen, -1);
        
        int max_len = 0;
        int left = 0;
        
        for (int right = 0; right < s.length(); right++) {
            int ascii_val = (int) s.charAt(right);
            
            // If character was seen and is within current window, move left pointer
            if (last_seen[ascii_val] >= left) {
                left = last_seen[ascii_val] + 1;
            }
            
            // Update the last seen index
            last_seen[ascii_val] = right;
            
            // Update maximum length
            max_len = Math.max(max_len, right - left + 1);
        }
        
        return max_len;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the length of the longest substring without repeating characters using sliding window with array.
 * 
 * @param {string} s - Input string
 * @return {number} - Length of the longest substring without repeating characters
 */
var lengthOfLongestSubstring = function(s) {
    // ASCII character set (128 characters)
    const last_seen = new Array(128).fill(-1);
    let max_len = 0;
    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
        const ascii_val = s.charCodeAt(right);
        
        // If character was seen and is within current window, move left pointer
        if (last_seen[ascii_val] >= left) {
            left = last_seen[ascii_val] + 1;
        }
        
        // Update the last seen index
        last_seen[ascii_val] = right;
        
        // Update maximum length
        max_len = Math.max(max_len, right - left + 1);
    }
    
    return max_len;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each character is processed at most twice |
| **Space** | O(1) - Fixed-size array of 128 (or 256) integers |

---

## Comparison of Approaches

| Aspect | Brute Force | Sliding Window (Hash Map) | Sliding Window (Array) |
|--------|-------------|---------------------------|------------------------|
| **Time Complexity** | O(n²) | O(n) | O(n) |
| **Space Complexity** | O(min(n, m)) | O(min(n, m)) | O(1) |
| **Implementation** | Very Simple | Moderate | Moderate |
| **Code Readability** | High | Medium | Medium |
| **Best For** | Learning, small strings | General case, Unicode | ASCII strings, performance |

---

## Why Sliding Window Approach is Preferred

The sliding window approach is the optimal solution because:

1. **Linear Time**: Achieves O(n) time complexity, making it suitable for large inputs
2. **Single Pass**: Each character is processed at most twice (once by right pointer, once by left pointer)
3. **Memory Efficient**: Uses either a hash map (O(min(n, m))) or fixed-size array (O(1))
4. **Interview Favorite**: Demonstrates understanding of two-pointer techniques and hash map usage
5. **Versatile**: Works with any character set (Unicode, ASCII, etc.)

---

## Related Problems

Based on similar themes (sliding window, substring, character tracking):

- **[Longest Substring with At Most K Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/)** - Extension with k distinct characters limit
- **[Subarrays with K Different Integers](https://leetcode.com/problems/subarrays-with-k-different-integers/)** - Count subarrays with exactly k distinct integers
- **[Permutation in String](https://leetcode.com/problems/permutation-in-string/)** - Check if one string contains permutation of another
- **[Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/)** - Find minimum window containing all characters
- **[Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/)** - Similar sliding window with character replacement
- **[Contains Duplicate II](https://leetcode.com/problems/contains-duplicate-ii/)** - Check for duplicates within distance k

---

## Pattern Documentation

For a comprehensive guide on the **Sliding Window** pattern, including detailed explanations, multiple approaches, and templates in Python, C++, Java, and JavaScript, see:

- **[Sliding Window Pattern](../patterns/sliding-window-fixed-size-subarray-calculation.md)** - Complete pattern documentation

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining the problem and solutions:

- [Longest Substring Without Repeating Characters - LeetCode 3 - Complete Explanation](https://www.youtube.com/watch?v=wiGpQwGFK-E) - Comprehensive explanation with sliding window
- [Sliding Window Technique](https://www.youtube.com/watch?v=MK-NZN4d9yI) - Detailed sliding window tutorial
- [Hash Map Approach](https://www.youtube.com/watch?v=3I3K2aG1j9U) - Hash map implementation
- [ASCII Array Optimization](https://www.youtube.com/watch?v=3YDbEOv15_8) - Array-based solution for performance
- [Two Pointer Technique](https://www.youtube.com/watch?v=qlH0OR3T5j4) - Two-pointer approach explanation

---

## Followup Questions

### Q1: How would you modify the solution to return the actual substring instead of just the length?

**Answer:** Track the starting index of the longest substring along with its length. When updating the maximum length, also store the starting index. At the end, return `s[start_index:start_index + max_len]`. You'll need to maintain both `max_len` and `max_start` variables.

---

### Q2: What if the string contains Unicode characters?

**Answer:** For Unicode characters, use a hash map (dictionary) instead of a fixed-size array. The hash map approach naturally supports any character set. In Python, Java, and JavaScript, strings are Unicode by default, so the hash map solution works seamlessly.

---

### Q3: How would you handle the case where you need at most K distinct characters instead of all unique?

**Answer:** Maintain a hash map to count character frequencies within the current window. When the number of distinct characters exceeds K, move the left pointer to shrink the window until we're back to K distinct characters. This requires tracking both the character-to-count map and the current distinct count.

---

### Q4: Can this problem be solved using a dynamic programming approach?

**Answer:** Yes, but it's less efficient. You can use DP where `dp[i]` represents the length of the longest valid substring ending at position `i`. The recurrence would be: `dp[i] = min(dp[i-1] + 1, i - last_seen[s[i]])` where `last_seen` tracks the last occurrence. This gives O(n) time but requires additional space.

---

### Q5: How would you test this solution?

**Answer:** Test with various cases:
1. Empty string: `""` → `0`
2. Single character: `"a"` → `1`
3. All unique: `"abcde"` → `5`
4. All same: `"aaaaa"` → `1`
5. Standard case: `"abcabcbb"` → `3`
6. With spaces: `"hello world"` → `9` ("world" or "ello wo")
7. With numbers and symbols: `"a1b2c3d1e2f3g1"` → Test various patterns
8. Unicode: `"你好世界你好"` → Test with non-ASCII characters

---

### Q6: What's the difference between using `>` vs `>=` when comparing last seen indices?

**Answer:** The condition `last_seen[char] >= left` ensures we only move the left pointer if the duplicate character is within the current window. If we used `>`, we'd unnecessarily move the left pointer when the duplicate is outside the window. The `>=` is correct because we want to exclude the duplicate from the new window.

---

### Q7: How would you modify the solution to count all valid substrings (not just find the maximum)?

**Answer:** For each ending position `right`, the number of valid substrings ending at `right` equals `right - left + 1`. Sum this value across all positions to get the total count. This gives you O(n) time and O(1) extra space.

---

### Q8: What happens with very long strings (close to the constraint 5*10^4)?

**Answer:** The sliding window solution handles this efficiently with O(n) time complexity. At 50,000 characters, the algorithm will process each character once, making it very fast. The array-based approach with O(1) space is particularly suitable for such cases.

---

### Q9: How would you implement this with a bitset for ASCII characters?

**Answer:** You can use a 128-bit bitset to track seen characters, but this doesn't directly give you the indices needed to move the left pointer. You would need additional logic to track positions. The array approach is simpler and more practical for this problem.

---

### Q10: Can you return all longest substrings if there are multiple with the same length?

**Answer:** Yes, track all starting indices that achieve the maximum length. When a new maximum is found, clear the list and add the current start. When the maximum is matched, add the current start. At the end, extract all substrings using the stored starting indices.

---

### Q11: How does the sliding window ensure we never miss a valid substring?

**Answer:** The window [left, right] always represents a valid substring (no duplicates). When we encounter a duplicate at position `right`, we move `left` to exclude the previous occurrence, ensuring the new window is also valid. Since we check every possible `right` position and always maintain the longest valid window ending at `right`, we never miss any valid substring.

---

### Q12: What are the edge cases to consider?

**Answer:** Edge cases include:
1. Empty string (`""`) → return 0
2. String with 1 character → return 1
3. String with only one repeated character (`"aaaaa"`) → return 1
4. String with all unique characters → return string length
5. String with spaces and special characters → handle ASCII correctly
6. Unicode strings → use hash map approach

---

## Summary

The Longest Substring Without Repeating Characters problem is a classic example of the sliding window technique. Several approaches exist, each with different trade-offs:

**Key Takeaways:**
- Sliding window with hash map provides optimal O(n) time complexity
- Brute force is O(n²), suitable only for learning or small inputs
- Array-based approach gives O(1) space for ASCII strings
- The window [left, right] always maintains unique characters
- When a duplicate is found, move left to exclude the previous occurrence
- Track the maximum length throughout the iteration
- This problem is frequently asked in technical interviews at major tech companies
- Understanding this pattern helps solve many related sliding window problems

This problem demonstrates the power of the two-pointer technique and is essential knowledge for coding interviews.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/longest-substring-without-repeating-characters/discuss/) - Community solutions and explanations
- [Sliding Window Pattern](https://www.geeksforgeeks.org/window-sliding-technique/) - Window sliding technique concepts
- [Hash Map Basics](https://docs.python.org/3/tutorial/datastructures.html#dictionaries) - Python dictionary documentation
- [C++ unordered_map](https://en.cppreference.com/w/cpp/container/unordered_map) - C++ unordered_map reference
- [Java HashMap](https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html) - Java HashMap API
- [JavaScript Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) - JavaScript Map documentation
