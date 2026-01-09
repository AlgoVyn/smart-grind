# Rotate String

## Problem Description
Given two strings s and goal, return true if and only if s can become goal after some number of shifts on s.
A shift on s consists of moving the leftmost character of s to the rightmost position.

For example, if s = "abcde", then it will be "bcdea" after one shift.

 
Example 1:
Input: s = "abcde", goal = "cdeab"
Output: true
Example 2:
Input: s = "abcde", goal = "abced"
Output: false

 
Constraints:

1 <= s.length, goal.length <= 100
s and goal consist of lowercase English letters.
## Solution

```python
class Solution:
    def rotateString(self, s: str, goal: str) -> bool:
        return len(s) == len(goal) and goal in s + s
```

## Explanation

This problem requires checking if one string is a rotation of another.

### Approach

Concatenate s with itself and check if goal is a substring, ensuring lengths are equal.

### Step-by-Step Explanation

1. **Length Check**: If lengths differ, false.

2. **Substring Check**: If goal is in s+s, true.

### Time Complexity

- O(n), where n is the length of s.

### Space Complexity

- O(n), for the concatenated string.
