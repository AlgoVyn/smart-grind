# Sort Characters By Frequency

## Problem Description
[Link to problem](https://leetcode.com/problems/sort-characters-by-frequency/)

Given a string s, sort it in decreasing order based on the frequency of the characters. The frequency of a character is the number of times it appears in the string.
Return the sorted string. If there are multiple answers, return any of them.
 
Example 1:

Input: s = "tree"
Output: "eert"
Explanation: 'e' appears twice while 'r' and 't' both appear once.
So 'e' must appear before both 'r' and 't'. Therefore "eetr" is also a valid answer.

Example 2:

Input: s = "cccaaa"
Output: "aaaccc"
Explanation: Both 'c' and 'a' appear three times, so both "cccaaa" and "aaaccc" are valid answers.
Note that "cacaca" is incorrect, as the same characters must be together.

Example 3:

Input: s = "Aabb"
Output: "bbAa"
Explanation: "bbaA" is also a valid answer, but "Aabb" is incorrect.
Note that 'A' and 'a' are treated as two different characters.

 
Constraints:

1 <= s.length <= 5 * 105
s consists of uppercase and lowercase English letters and digits.


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
- O(n log n), due to sorting the characters.

### Space Complexity:
- O(n), for the counter and result.
