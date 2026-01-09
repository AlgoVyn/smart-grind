# Minimum Penalty For A Shop

## Problem Description

You are given the customer visit log of a shop represented by a 0-indexed string `customers` consisting only of characters `'N'` and `'Y'`:

- If the `i-th` character is `'Y'`, it means that customers come at the `i-th` hour
- `'N'` indicates that no customers come at the `i-th` hour

If the shop closes at the `j-th` hour (0 <= j <= n), the penalty is calculated as follows:

- For every hour when the shop is open and no customers come, the penalty increases by 1
- For every hour when the shop is closed and customers come, the penalty increases by 1

Return the earliest hour at which the shop must be closed to incur a minimum penalty.

**Note:** If a shop closes at the `j-th` hour, it means the shop is closed at the hour `j`.

## Examples

### Example 1

**Input:**
```
customers = "YYNY"
```

**Output:**
```
2
```

**Explanation:**
- Closing at 0th hour: penalty = 1 + 1 + 0 + 1 = 3
- Closing at 1st hour: penalty = 0 + 1 + 0 + 1 = 2
- Closing at 2nd hour: penalty = 0 + 0 + 0 + 1 = 1
- Closing at 3rd hour: penalty = 0 + 0 + 1 + 1 = 2
- Closing at 4th hour: penalty = 0 + 0 + 1 + 0 = 1

Closing at 2nd or 4th hour gives minimum penalty. Since 2 is earlier, the answer is 2.

### Example 2

**Input:**
```
customers = "NNNNN"
```

**Output:**
```
0
```

**Explanation:**
It is best to close the shop at the 0th hour as no customers arrive.

### Example 3

**Input:**
```
customers = "YYYY"
```

**Output:**
```
4
```

**Explanation:**
It is best to close the shop at the 4th hour as customers arrive at each hour.

## Constraints

- `1 <= customers.length <= 10^5`
- `customers` consists only of characters `'Y'` and `'N'`

## Solution

```python
class Solution:
    def bestClosingTime(self, customers: str) -> int:
        """
        Find the earliest hour to close shop with minimum penalty.
        
        Penalty = N's in open hours + Y's in closed hours
        """
        n = len(customers)
        total_y = customers.count('Y')  # Total Y's that will be in closed hours
        
        min_penalty = float('inf')
        best_hour = 0
        
        current_n = 0  # N's seen so far (in open hours)
        current_y_after = total_y  # Y's that will be in closed hours
        
        for j in range(n + 1):
            penalty = current_n + current_y_after
            if penalty < min_penalty:
                min_penalty = penalty
                best_hour = j
            
            if j < n:
                if customers[j] == 'N':
                    current_n += 1  # This N moves from closed to open
                else:
                    current_y_after -= 1  # This Y moves from closed to open
        
        return best_hour
```

## Explanation

This problem requires finding the earliest hour to close the shop to minimize the penalty based on customer visits.

1. **Penalty calculation**: For closing at hour `j`:
   - Open hours: `0` to `j-1` (penalty for `'N'` in this range)
   - Closed hours: `j` to `n-1` (penalty for `'Y'` in this range)

2. **Single pass**: Iterate through possible closing hours:
   - Track N's in open hours and Y's in closed hours
   - Update penalty and best hour

3. **Return earliest minimum**: Track the minimum penalty and smallest hour achieving it

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of customers
- **Space Complexity:** O(1), using only constant extra space
