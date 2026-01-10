# Sort Characters by Frequency

## Problem Description

Given a string `s`, sort it in decreasing order based on the frequency of the characters. The frequency of a character is the number of times it appears in the string.

Return the sorted string. If there are multiple answers, return any of them.

### Examples

**Example 1:**
```python
Input: s = "tree"
Output: "eert"
```

**Example 2:**
```python
Input: s = "cccaaa"
Output: "aaaccc"
```

**Example 3:**
```python
Input: s = "Aabb"
Output: "bbAa"
```

### Constraints

- `1 <= s.length <= 5 * 10^5`
- `s` consists of uppercase and lowercase English letters and digits.

---

## Solution

```python
from collections import Counter

def frequencySort(s):
    count = Counter(s)
    sorted_chars = sorted(count.items(), key=lambda x: x[1], reverse=True)
    result = []
    
    for char, freq in sorted_chars:
        result.append(char * freq)
    
    return ''.join(result)
```

---

## Explanation

This problem sorts characters in a string by their frequency in decreasing order.

### Step-by-Step Approach:

1. **Count Frequencies:**
   - Use Counter to count occurrences of each character.

2. **Sort by Frequency:**
   - Sort the characters by frequency descending.

3. **Build Result:**
   - For each character, append it repeated by its frequency.

4. **Return String:**
   - Join the result list.

### Time Complexity:

- **O(n log n)**, due to sorting the characters.

### Space Complexity:

- **O(n)**, for the counter and result.
