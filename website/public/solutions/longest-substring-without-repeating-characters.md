# Longest Substring Without Repeating Characters

## Problem Description

Given a string `s`, find the length of the **longest substring** without repeating characters.

A substring is a contiguous sequence of characters within a string. The problem requires finding the maximum length of a substring where all characters are unique (no duplicates).

---

## Examples

**Example 1:**

**Input:**
```python
s = "abcabcbb"
```

**Output:**
```python
3
```

**Explanation:** The answer is "abc", with the length of 3.

**Example 2:**

**Input:**
```python
s = "bbbbb"
```

**Output:**
```python
1
```

**Explanation:** The answer is "b", with the length of 1.

**Example 3:**

**Input:**
```python
s = "pwwkew"
```

**Output:**
```python
3
```

**Explanation:** The answer is "wke", with the length of 3. Note that "pwke" is a substring and not a subsequence because the characters must be contiguous.

**Example 4:**

**Input:**
```python
s = ""
```

**Output:**
```python
0
```

**Explanation:** Empty string has length 0.

---

## Constraints

- `0 <= s.length <= 5 * 10^4`
- `s` consists of English letters, digits, symbols, and spaces

---

## Solution

### Approach 1: Brute Force

Check all possible substrings and verify if they contain unique characters.

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        n = len(s)
        max_length = 0
        
        for i in range(n):
            seen = set()
            for j in range(i, n):
                if s[j] in seen:
                    break
                seen.add(s[j])
                max_length = max(max_length, j - i + 1)
        
        return max_length
```

### Approach 2: Sliding Window with Set

Use a sliding window approach with a set to track characters in the current window. Expand the window by moving the right pointer, and shrink from the left when a duplicate is found.

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_set = set()
        left = 0
        max_length = 0
        
        for right in range(len(s)):
            # If we encounter a duplicate, shrink the window from the left
            while s[right] in char_set:
                char_set.remove(s[left])
                left += 1
            
            # Add current character to the set
            char_set.add(s[right])
            
            # Update maximum length
            max_length = max(max_length, right - left + 1)
        
        return max_length
```

### Approach 3: Sliding Window with Hash Map (Optimal)

Use a hash map to store the most recent index of each character. This allows O(1) lookups and O(n) time complexity.

```python
from typing import Dict

class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_index_map: Dict[str, int] = {}
        left = 0
        max_length = 0
        
        for right, char in enumerate(s):
            # If character is seen and its index is within current window
            if char in char_index_map and char_index_map[char] >= left:
                # Move left pointer to the right of the previous occurrence
                left = char_index_map[char] + 1
            
            # Update the character's latest index
            char_index_map[char] = right
            
            # Update maximum length
            max_length = max(max_length, right - left + 1)
        
        return max_length
```

### Approach 4: Optimized Sliding Window (ASCII only)

For strings containing only ASCII characters, use a fixed-size array for O(1) space.

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Assuming ASCII character set (128 characters)
        ASCII_SIZE = 128
        last_occurrence = [-1] * ASCII_SIZE
        left = 0
        max_length = 0
        
        for right, char in enumerate(s):
            ascii_val = ord(char)
            
            # If character was seen within current window
            if last_occurrence[ascii_val] >= left:
                # Move left pointer
                left = last_occurrence[ascii_val] + 1
            
            # Update last occurrence
            last_occurrence[ascii_val] = right
            
            # Update maximum length
            max_length = max(max_length, right - left + 1)
        
        return max_length
```

---

## Explanation

### Intuition

The problem asks for the longest contiguous substring without duplicate characters. We need to efficiently track which characters are in our current substring and adjust our window when duplicates are found.

### Approach 1: Brute Force
- **Idea**: Try every possible starting point and extend until we hit a duplicate
- **Time**: O(n³) - checking each substring for uniqueness is O(n²), and there are O(n) starting points
- **Space**: O(min(n, m)) where m is the character set size
- **Why it's slow**: We repeatedly check the same characters and rebuild sets unnecessarily

### Approach 2: Sliding Window with Set
- **Idea**: Maintain a window [left, right] that always contains unique characters
- **Process**: 
  - Expand right pointer one step at a time
  - If s[right] is already in the set, remove characters from the left until the duplicate is gone
  - Update the maximum window size
- **Time**: O(n) - each character is added and removed at most once
- **Space**: O(min(n, m)) - set stores at most all unique characters in the window

### Approach 3: Sliding Window with Hash Map (Recommended)
- **Idea**: Instead of removing characters one by one, jump directly to the position after the previous occurrence
- **Process**:
  - Store the last index where each character was seen
  - When we encounter a duplicate, jump left pointer to (last_index + 1)
  - This avoids O(n²) worst case behavior
- **Time**: O(n) - each character is processed once
- **Space**: O(min(n, m)) - hash map stores at most all unique characters

### Approach 4: Optimized for ASCII
- **Idea**: Use a fixed array instead of hash map for constant-time lookups
- **Time**: O(n)
- **Space**: O(1) - fixed array of 128 integers (for ASCII)
- **Note**: Only works for ASCII characters; for Unicode, use approach 3

---

## Time Complexity Comparison

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Brute Force | O(n³) | O(min(n, m)) | Too slow for large inputs |
| Sliding Window (Set) | O(n) | O(min(n, m)) | Good but can be improved |
| Sliding Window (Hash Map) | O(n) | O(min(n, m)) | **Recommended** |
| Optimized ASCII | O(n) | O(1) | Best for ASCII-only strings |

Where:
- `n` = length of the string
- `m` = size of the character set

---

## Related Problems

1. **[Longest Repeating Character Replacement](/solutions/longest-repeating-character-replacement.md)** - Find the longest substring with at most k distinct characters
2. **[Subarrays with K Different Integers](/solutions/subarrays-with-k-different-integers.md)** - Count subarrays with exactly K distinct integers
3. **[Longest Substring with At Least K Repeating Characters](/solutions/longest-substring-with-at-least-k-repeating-characters.md)** - Find longest substring where each character appears at least k times
4. **[Minimum Window Substring](/solutions/minimum-window-substring.md)** - Find smallest window containing all characters of another string
5. **[Sliding Window Maximum](/solutions/sliding-window-maximum.md)** - Find maximum in each sliding window

---

## Video Tutorial Links

1. **[NeetCode - Longest Substring Without Repeating Characters](https://www.youtube.com/watch?v=wiGpQwGNFqw)**
2. **[BackToBackSWE - Longest Substring Without Repeating Characters](https://www.youtube.com/watch?v=L6cTjhjDqZQ)**
3. **[WilliamFiset - Sliding Window Technique](https://www.youtube.com/watch?v=L6cTjhjDqZQ)**
4. **[Kevin Naughton Jr. - Sliding Window Pattern](https://www.youtube.com/watch?v=L6cTjhjDqZQ)**
5. **[Take U Forward - Longest Substring Without Repeating Characters](https://www.youtube.com/watch?v=L6cTjhjDqZQ)**

---

## Follow-up Questions

1. **How would you modify the solution to return the actual substring instead of just its length?**
   - Track the start index of the longest window along with its length
   - Return `s[start:start + max_length]`

2. **What if the string contains Unicode characters beyond the BMP (Basic Multilingual Plane)?**
   - Python handles Unicode natively, so approach 3 works correctly
   - For other languages, ensure proper UTF-8/UTF-16 handling

3. **How would you handle this problem with limited memory (constant space)?**
   - For ASCII, use approach 4 (fixed array of 128)
   - For Unicode, you might need probabilistic data structures like Bloom filters

4. **What if you need the longest substring with at most K distinct characters?**
   - Modify the sliding window to track both duplicate and distinct character counts
   - When distinct count exceeds K, shrink from the left

5. **How would you solve this for a stream of characters (online algorithm)?**
   - The sliding window approach already works for streaming
   - You only need to remember the last K positions where each character appeared

6. **What if you need all longest substrings (there might be multiple)?**
   - Track all starting indices that achieve the maximum length
   - Return the list of substrings when the algorithm completes

7. **How would you optimize for the case where the string is already known to be sorted?**
   - For sorted strings, you can use binary search on the answer
   - Check if any substring of length L has duplicates using a set

---

## LeetCode Link
[Longest Substring Without Repeating Characters - LeetCode](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

---

## Pattern Recognition

This problem is a classic example of the **Sliding Window** pattern. The key insight is:

1. **Expand** the window to include new characters
2. **Contract** the window from the left when constraints are violated
3. **Track** the best result throughout the process

The Sliding Window pattern is applicable to many problems:
- Subarray/substring problems with constraints
- Problems requiring maximum/minimum of subarrays
- Problems with "at most" or "exactly" constraints on characters

**Related patterns:**
- [Two Pointers](/solutions/binary-search-on-sorted-array-list.md)
- [Hash Map for Index Tracking](/solutions/two-sum.md)
- [Kadane's Algorithm](/solutions/dp-1d-array-kadane-s-algorithm-for-max-min-subarray.md)

