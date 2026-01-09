# Integer to Roman

## Problem Description

Seven different symbols represent Roman numerals with the following values:

| Symbol | Value |
|--------|-------|
| I | 1 |
| V | 5 |
| X | 10 |
| L | 50 |
| C | 100 |
| D | 500 |
| M | 1000 |

Roman numerals are formed by appending the conversions of decimal place values from **highest to lowest**. The conversion rules are:

1. **Standard Values:** If the value does not start with 4 or 9, select the symbol of the maximal value that can be subtracted from the input, append that symbol, subtract its value, and repeat.

2. **Subtractive Forms:** If the value starts with 4 or 9, use the subtractive form:
   - 4 = IV (1 less than 5)
   - 9 = IX (1 less than 10)
   - 40 = XL, 90 = XC, 400 = CD, 900 = CM

3. **Repetition:** Only powers of 10 (I, X, C, M) can be appended consecutively at most 3 times.

Given an integer, convert it to a Roman numeral.

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `num = 3749` | `"MMMDCCXLIX"` |

**Explanation:**
```python
3000 = MMM (1000 + 1000 + 1000)
 700 = DCC (500 + 100 + 100)
  40 = XL (10 less than 50)
   9 = IX (1 less than 10)
```

**Example 2:**

| Input | Output |
|-------|--------|
| `num = 58` | `"LVIII"` |

**Explanation:**
```python
50 = L
 8 = VIII
```

**Example 3:**

| Input | Output |
|-------|--------|
| `num = 1994` | `"MCMXCIV"` |

**Explanation:**
```python
1000 = M
 900 = CM
  90 = XC
   4 = IV
```

## Constraints

- `1 <= num <= 3999`

## Solution

```python
class Solution:
    def intToRoman(self, num: int) -> str:
        # Value-Symbol pairs in descending order (including subtractive forms)
        vals = [
            (1000, "M"),
            (900, "CM"),
            (500, "D"),
            (400, "CD"),
            (100, "C"),
            (90, "XC"),
            (50, "L"),
            (40, "XL"),
            (10, "X"),
            (9, "IX"),
            (5, "V"),
            (4, "IV"),
            (1, "I")
        ]
        res = ""
        for val, sym in vals:
            while num >= val:
                res += sym
                num -= val
        return res
```

## Explanation

This problem converts an integer to a Roman numeral using a greedy approach.

### Algorithm

1. **Predefined Values:** Create a list of value-symbol pairs in descending order, including subtractive forms (like 900=CM, 4=IV).

2. **Greedy Selection:** For each value-symbol pair:
   - While the number is greater than or equal to the value, append the symbol.
   - Subtract the value from the number.

3. **Termination:** Continue until all values have been processed.

### Key Insight

The greedy approach works because:
- The list is sorted in descending order.
- Each value in the list is the largest possible Roman numeral that can be subtracted at that position.
- Subtractive forms (4, 9, 40, 90, etc.) are explicitly included to handle those cases correctly.

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) - num ≤ 3999, constant number of iterations |
| **Space** | O(1) - fixed size list, output string excluded |

The algorithm runs in constant time since the input range is limited.
