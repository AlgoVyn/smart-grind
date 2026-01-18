# Sliding Window - Character Frequency Matching

## Overview

The Sliding Window - Character Frequency Matching pattern is used for problems involving substring searches where you need to match the frequency of characters between a pattern and substrings of the input string. This pattern maintains frequency counts for both the pattern and the current window, expanding and contracting the window to find matches. It's efficient for anagram detection, permutation checks, and similar character-based matching problems.

When to use: Ideal for problems requiring finding substrings that contain the same characters with the same frequencies as a given pattern, such as checking for permutations or anagrams.

Benefits: Achieves O(n) time complexity with O(1) space for frequency maps (assuming fixed character set like ASCII), making it scalable for large strings.

## Key Concepts

- **Frequency Maps**: Use arrays or dictionaries to count character frequencies for the pattern and current window.
- **Window Expansion**: Move the right pointer to include more characters.
- **Window Contraction**: Move the left pointer when the window matches the pattern or exceeds necessary size.
- **Match Counting**: Track how many characters have matching frequencies to determine if the window is valid.

## Template

```python
def character_frequency_matching(s, p):
    """
    Template for character frequency matching.
    This example checks if p is a permutation of any substring in s.
    Returns starting index of first match or -1.
    """
    if len(p) > len(s):
        return -1
    
    p_count = [0] * 26
    s_count = [0] * 26
    
    # Count frequencies for pattern
    for char in p:
        p_count[ord(char) - ord('a')] += 1
    
    left = 0
    matches = 0
    
    for right in range(len(s)):
        # Add right character to window
        idx = ord(s[right]) - ord('a')
        s_count[idx] += 1
        
        # If this character now matches pattern count, increment matches
        if s_count[idx] == p_count[idx]:
            matches += 1
        elif s_count[idx] == p_count[idx] + 1:
            matches -= 1  # Overcounted
        
        # When window size matches pattern length
        if right - left + 1 == len(p):
            if matches == 26:  # All characters match (assuming lowercase letters)
                return left
            
            # Remove left character from window
            left_idx = ord(s[left]) - ord('a')
            s_count[left_idx] -= 1
            if s_count[left_idx] == p_count[left_idx]:
                matches += 1
            elif s_count[left_idx] == p_count[left_idx] - 1:
                matches -= 1
            left += 1
    
    return -1
```

## Example Problems

1. **Permutation in String**: Check if one string is a permutation of a substring in another.
2. **Find All Anagrams in a String**: Find all starting indices of anagrams of a pattern in a string.
3. **Minimum Window Substring**: Find the smallest substring containing all characters of another string.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the length of the string, as we traverse the string once.
- **Space Complexity**: O(1), since frequency arrays are of fixed size (26 for lowercase letters).

## Common Pitfalls

- **Character Set Assumptions**: Ensure the code handles the expected character set (e.g., only lowercase letters).
- **Match Counting Logic**: Carefully manage the matches counter to avoid off-by-one errors when frequencies change.
- **Window Size Management**: Always check window size before contracting to ensure it matches the pattern length.
- **Edge Cases**: Handle strings shorter than the pattern, empty strings, or patterns with repeated characters.