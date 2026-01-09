# Russian Doll Envelopes

## Problem Description

You are given a 2D array of integers `envelopes` where `envelopes[i] = [wi, hi]` represents the width and the height of an envelope.

One envelope can fit into another if and only if both the width and height of one envelope are greater than the other envelope's width and height.

Return the maximum number of envelopes you can Russian doll (i.e., put one inside the other).

**Note:** You cannot rotate an envelope.

### Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `envelopes = [[5,4],[6,4],[6,7],[2,3]]` | `3` |

**Explanation:** The maximum number of envelopes you can Russian doll is 3 (`[2,3]` => `[5,4]` => `[6,7]`).

**Example 2:**

| Input | Output |
|-------|--------|
| `envelopes = [[1,1],[1,1],[1,1]]` | `1` |

### Constraints

- `1 <= envelopes.length <= 10^5`
- `envelopes[i].length == 2`
- `1 <= wi, hi <= 10^5`

## Solution

```python
def maxEnvelopes(envelopes):
    envelopes.sort(key=lambda x: (x[0], -x[1]))
    heights = [e[1] for e in envelopes]
    
    # Longest Increasing Subsequence on heights
    tails = []
    for num in heights:
        left, right = 0, len(tails) - 1
        while left <= right:
            mid = (left + right) // 2
            if tails[mid] < num:
                left = mid + 1
            else:
                right = mid - 1
        if left == len(tails):
            tails.append(num)
        else:
            tails[left] = num
    return len(tails)
```

## Explanation

This problem finds the maximum number of envelopes that can be nested. It sorts envelopes by width ascending and height descending for equal widths, then computes the longest increasing subsequence on heights.

### Approach

1. **Sort Envelopes:** Sort by width ascending. For equal widths, sort height descending to prevent nesting envelopes with same width.

2. **Extract Heights:** Create a list of heights from the sorted envelopes.

3. **Compute LIS on Heights:** Use a dynamic programming approach with binary search (patience sorting) to find the length of the longest increasing subsequence.
   - Maintain a `tails` array where `tails[i]` is the smallest tail of all increasing subsequences of length `i+1`.
   - For each height, find the insertion point using binary search and update `tails`.

4. **Return Length:** The length of `tails` is the maximum number of nested envelopes.

### Time Complexity

- O(n log n), where n is the number of envelopes, due to sorting and binary search in LIS.

### Space Complexity

- O(n), for the heights list and tails array.
