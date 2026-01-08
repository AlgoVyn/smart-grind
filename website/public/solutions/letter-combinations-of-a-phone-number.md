# Letter Combinations Of A Phone Number

## Problem Description
[Link to problem](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)

Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.
A mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.

 
Example 1:

Input: digits = "23"
Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]

Example 2:

Input: digits = "2"
Output: ["a","b","c"]

 
Constraints:

1 <= digits.length <= 4
digits[i] is a digit in the range ['2', '9'].


## Solution

```python
from typing import List

class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return []
        mapping = {
            '2': 'abc',
            '3': 'def',
            '4': 'ghi',
            '5': 'jkl',
            '6': 'mno',
            '7': 'pqrs',
            '8': 'tuv',
            '9': 'wxyz'
        }
        result = []
        def backtrack(index, current):
            if index == len(digits):
                result.append(''.join(current))
                return
            for char in mapping[digits[index]]:
                current.append(char)
                backtrack(index + 1, current)
                current.pop()
        backtrack(0, [])
        return result
```

## Explanation
We use backtracking to generate all combinations. For each digit, we iterate through its possible letters and recurse to the next digit.

When we reach the end of digits, we add the current combination to the result.

Time complexity: O(4^n), where n is the number of digits, since each digit has up to 4 letters.
Space complexity: O(n), for the recursion stack and current list.
