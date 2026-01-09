# Minimum Number Of Swaps To Make The String Balanced

## Problem Description

You are given a 0-indexed string `s` of even length `n`. The string consists of exactly `n / 2` opening brackets `'['` and `n / 2` closing brackets `']'`.

A string is called balanced if and only if:

- It is the empty string, or
- It can be written as `AB`, where both `A` and `B` are balanced strings, or
- It can be written as `[C]`, where `C` is a balanced string.

You may swap the brackets at any two indices any number of times. Return the minimum number of swaps to make `s` balanced.

## Examples

### Example 1

**Input:**
```python
s = "][]["
```

**Output:**
```python
1
```

**Explanation:**
You can make the string balanced by swapping index 0 with index 3. The resulting string is `"[[]]"`.

### Example 2

**Input:**
```python
s = "]]][[["
```

**Output:**
```python
2
```

**Explanation:**
You can do the following to make the string balanced:
- Swap index 0 with index 4: `s = "[]][]["`
- Swap index 1 with index 5: `s = "[[][]]"`

### Example 3

**Input:**
```python
s = "[]"
```

**Output:**
```python
0
```

**Explanation:**
The string is already balanced.

## Constraints

- `n == s.length`
- `2 <= n <= 10^6`
- `n` is even
- `s[i]` is either `'['` or `']'`
- The number of opening brackets `'['` equals `n / 2`, and the number of closing brackets `']'` equals `n / 2`

## Solution

```python
class Solution:
    def minSwaps(self, s: str) -> int:
        """
        Find minimum swaps to balance the string.
        
        Track the minimum balance (most negative) encountered.
        Each swap fixes two misplaced brackets.
        """
        balance = 0
        min_balance = 0
        
        for c in s:
            if c == '[':
                balance += 1
            else:
                balance -= 1
            min_balance = min(min_balance, balance)
        
        # (-min_balance + 1) // 2 swaps needed
        return (-min_balance + 1) // 2
```

## Explanation

This problem requires finding the minimum number of swaps to balance a string of brackets.

1. **Track balance**: Iterate through the string, maintaining a balance counter:
   - Increment for `'['`
   - Decrement for `']'`

2. **Find maximum imbalance**: Track `min_balance`, the most negative value reached (represents the maximum imbalance).

3. **Calculate swaps**: Each swap can fix two misplaced brackets (one `'['` and one `']'`). The formula `(-min_balance + 1) // 2` gives the minimum swaps.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of the string
- **Space Complexity:** O(1), using only a few variables
