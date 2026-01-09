# Separate Black and White Balls

## Problem Description

There are `n` balls on a table, each ball has a color black or white. You are given a 0-indexed binary string `s` of length `n`, where `1` and `0` represent black and white balls, respectively.

In each step, you can choose two adjacent balls and swap them. Return the minimum number of steps to group all the black balls to the right and all the white balls to the left.

### Examples

**Example 1:**
- Input: `s = "101"`
- Output: `1`

**Explanation:** Swap `s[0]` and `s[1]`, resulting in `"011"`. Initially, `1`s are not grouped together, requiring at least 1 step to group them to the right.

**Example 2:**
- Input: `s = "100"`
- Output: `2`

**Explanation:**
- Swap `s[0]` and `s[1]`, `s = "010"`
- Swap `s[1]` and `s[2]`, `s = "001"`
It can be proven that the minimum number of steps needed is `2`.

**Example 3:**
- Input: `s = "0111"`
- Output: `0`

**Explanation:** All the black balls are already grouped to the right.

### Constraints

- `1 <= n == s.length <= 10^5`
- `s[i]` is either `'0'` or `'1'`

---

## Solution

```python
class Solution:
    def minimumSteps(self, s: str) -> int:
        swaps = 0
        black_count = 0
        for char in s:
            if char == '0':
                swaps += black_count
            else:
                black_count += 1
        return swaps
```

---

## Explanation

We count the number of `1`s (black balls) encountered so far. For each `0` (white ball), we add the current black count to swaps, as each black ball to the left needs to be swapped past this white ball.

### Approach

1. Iterate through the string from left to right.
2. Keep track of the number of black balls (`1`s) encountered so far.
3. For each white ball (`0`), add the current black count to the total swaps.
4. For each black ball, increment the black count.

### Algorithm Steps

1. **Initialize**: Set `swaps = 0` and `black_count = 0`.
2. **Iterate**: For each character in `s`:
   - If character is `'0'`, add `black_count` to `swaps`.
   - If character is `'1'`, increment `black_count`.
3. **Return**: The total `swaps` value.

### Time Complexity

- **O(n)**, where `n` is the length of the string.

### Space Complexity

- **O(1)**, constant extra space.
