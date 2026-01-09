# Unique Binary Search Trees

## Problem Description

Given an integer `n`, return the number of structurally unique BST's (binary search trees) which has exactly `n` nodes of unique values from `1` to `n`.

### Examples

**Example 1:**

**Input:**
```python
n = 3
```

**Output:**
```python
5
```

**Example 2:**

**Input:**
```python
n = 1
```

**Output:**
```python
1
```

### Constraints

- `1 <= n <= 19`

---

## Solution

```python
def numTrees(n):
    dp = [0] * (n + 1)
    dp[0] = 1
    dp[1] = 1
    for i in range(2, n + 1):
        for j in range(i):
            dp[i] += dp[j] * dp[i - 1 - j]
    return dp[n]
```

---

## Explanation

This problem calculates the number of unique BSTs with `n` nodes using dynamic programming. The solution is based on the Catalan number.

### Step-by-Step Approach

1. **Initialize DP Array:**
   - `dp[0] = 1` (empty tree), `dp[1] = 1` (single node).

2. **Fill DP Array:**
   - For `i` from 2 to `n`, `dp[i] = sum of dp[j] * dp[i-1-j]` for `j` from 0 to `i-1`, where `j` is the number of nodes in left subtree.

3. **Return Result:**
   - `dp[n]` is the number of unique BSTs.

### Time Complexity

- **O(n^2)**, due to the nested loops.

### Space Complexity

- **O(n)**, for the dp array.
