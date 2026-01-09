# Minimum Add to Make Parentheses Valid

## Problem Description

A parentheses string is valid if and only if:

- It is an empty string
- It can be written as `AB` (concatenation of two valid strings)
- It can be written as `(A)` where `A` is a valid string

You are given a parentheses string `s`. In one move, you can **insert a parenthesis at any position**.

Return the **minimum number of moves** required to make `s` valid.

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `s = "())"` | `1` |

**Explanation:** Insert `'('` at the beginning to make `"(())"`.

**Example 2:**

| Input | Output |
|-------|--------|
| `s = "((("` | `3` |

**Explanation:** Insert `')'` at the end three times to make `"((()))"`.

## Constraints

- `1 <= s.length <= 1000`
- `s[i]` is either `'('` or `')'`

## Solution

```python
class Solution:
    def minAddToMakeValid(self, s: str) -> int:
        """
        Track balance of opening parentheses.
        Returns the minimum insertions needed.
        """
        ans = 0      # Total insertions needed
        bal = 0      # Current balance of '(' minus ')'
        
        for c in s:
            if c == '(':
                bal += 1
            else:  # c == ')'
                bal -= 1
                if bal < 0:
                    # Need to insert '(' before this ')'
                    ans += 1
                    bal = 0  # Reset balance after insertion
        
        # Remaining '(' need closing ')'
        ans += bal
        return ans
```

## Explanation

We use a **balance counter** to track unmatched opening parentheses:

1. **Initialize** `ans = 0` (total insertions), `bal = 0` (current balance).
2. **Iterate through each character**:
   - If `'('`: increment `bal`
   - If `')'`: decrement `bal`
     - If `bal < 0`: we have an unmatched `')'`, need to insert `'('` → `ans += 1`, reset `bal = 0`
3. **After loop**: `bal` holds the count of unmatched `'('`, each needs a `')'` → `ans += bal`
4. Return `ans`.

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | `O(n)` — single pass through the string |
| Space | `O(1)` — constant extra space |
