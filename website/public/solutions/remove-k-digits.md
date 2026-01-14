## Remove K Digits

### Problem Statement
Given a string `num` representing a non-negative integer and an integer `k`, return the smallest possible integer after removing exactly `k` digits from `num`. The resulting number should not have leading zeros, except if the result is `0` itself. The digits must remain in their original relative order; rearrangement is not allowed.

**Constraints:**
- `1 <= k <= num.length <= 10^5`
- `num` consists only of digits ('0'-'9').
- `num` does not have leading zeros, except if `num` is "0".

### Examples
1. **Input:** `num = "1432219"`, `k = 3`  
   **Output:** `"1219"`  
   **Explanation:** Remove '4', '3', and '2' to form the smallest possible number.

2. **Input:** `num = "10200"`, `k = 1`  
   **Output:** `"200"`  
   **Explanation:** Remove the leading '1' to avoid leading zeros in the result.

3. **Input:** `num = "10"`, `k = 2`  
   **Output:** `"0"`  
   **Explanation:** Remove both digits, resulting in `0`.

### Intuition
The goal is to form the smallest number by strategically removing `k` digits. To minimize the number, prioritize removing larger digits that appear earlier (higher place values), but only if doing so allows a smaller digit to take their place. This is like eliminating "peaks" where a digit is larger than the one following it.

A greedy approach works well: Traverse the digits and maintain a monotonically increasing sequence (from left to right) by removing larger digits when possible, using a stack. After processing, if removals remain, trim from the end (as trailing digits have lower impact). Finally, strip leading zeros to get the valid smallest number.

### Approach 1: Brute Force (For Conceptual Understanding, Not Efficient)
Generate all possible combinations of removing exactly `k` digits and find the minimum among the resulting numbers. This involves selecting `n - k` digits in order and comparing them as strings (to handle large numbers).

**Code (Python):**
```python
from itertools import combinations

def removeKdigits(num: str, k: int) -> str:
    n = len(num)
    if k >= n:
        return "0"
    
    min_num = float('inf')
    for combo in combinations(range(n), n - k):
        candidate = ''.join(num[i] for i in combo).lstrip('0')
        if not candidate:
            candidate = '0'
        min_num = min(min_num, int(candidate))
    
    return str(min_num)
```

**Time Complexity:** O(C(n, n-k) * (n-k)) where C is binomial coefficient, which is exponential and too slow for n=10^5.  
**Space Complexity:** O(n) for storing candidates.

This is impractical for large inputs but helps understand the problem as finding the lexicographically smallest subsequence of length `n - k`.

### Approach 2: Greedy with Monotonic Stack (Optimal)
Use a stack to build the smallest number greedily:
- Iterate through each digit in `num`.
- While the stack is not empty, the top of the stack is greater than the current digit, and we have removals left (`k > 0`), pop the stack (remove the larger digit).
- Append the current digit to the stack.
- After iteration, if `k` removals remain, pop the last `k` digits from the stack.
- Convert the stack to a string, remove leading zeros, and return "0" if empty.

This ensures we remove digits that violate the increasing order, prioritizing earlier positions for smaller values.

**Code (Python):**
```python
def removeKdigits(num: str, k: int) -> str:
    if not num:
        return "0"
    
    stack = []
    for digit in num:
        while k > 0 and stack and stack[-1] > digit:
            stack.pop()
            k -= 1
        stack.append(digit)
    
    # If k > 0, remove the remaining from the end
    while k > 0:
        if stack:
            stack.pop()
        k -= 1
    
    # Build the result string, remove leading zeros
    result = ''.join(stack).lstrip('0')
    return result if result else "0"
```

**Time Complexity:** O(n), where n is the length of `num`. Each digit is pushed and popped at most once.  
**Space Complexity:** O(n) for the stack.

This is the efficient solution, suitable for the constraints.

### Approach 3: Dynamic Programming (Less Common, Suboptimal)
The DP approach treats the problem as finding the lexicographically smallest subsequence of exactly `m = n - k` digits from the first `i` digits, for various prefixes.

#### Intuition for DP
- We define a state `dp[i][j]` as the **lexicographically smallest string** formed by keeping exactly `j` digits from the first `i` digits of `num` (i.e., removing `i - j` digits).
- The goal is to compute `dp[n][m]`, where `n = len(num)` and `m = n - k`.
- For each state, we decide whether to **keep** the `i`-th digit (0-indexed) or **skip** (remove) it:
  - If we skip it: `dp[i][j] = dp[i-1][j]` (we keep the same number of digits from the previous prefix).
  - If we keep it: `dp[i][j] = dp[i-1][j-1] + num[i-1]` (append the current digit to the smallest string keeping `j-1` digits from the first `i-1` digits). This is only possible if `j >= 1`.
- At each state, we take the minimum (lexicographically smallest) of the valid options.
- All strings in `dp[i][j]` have the same length `j`, so string comparison directly gives the lex order.
- After computing, we strip leading zeros from the result.

This ensures we explore all ways to choose which digits to remove while maintaining order and minimizing the number.

#### Recurrence Relation
```
dp[i][j] = min(
    dp[i-1][j]                  # Skip the i-th digit (if i > j, since we can't keep more than available)
    dp[i-1][j-1] + num[i-1]     # Keep the i-th digit (if j >= 1)
)
```
- We take the lex-min of the valid candidates.

#### Base Cases
- `dp[0][0] = ""` (empty string for 0 digits from 0 prefix).
- For `j > 0`, `dp[0][j]` is impossible (empty).
- For `i > 0, j = 0`: `dp[i][0] = ""` (remove all digits).

#### Code (Python)
This implementation uses a 2D list of strings. Note: For optimization, we could use two 1D arrays (previous and current row) to reduce space to O(m * n) for strings, but it's still prohibitive for large n.

```python
def removeKdigits(num: str, k: int) -> str:
    n = len(num)
    m = n - k
    if m == 0:
        return "0"
    if m < 0:
        return ""  # Invalid, but per constraints k <= n

    # dp[i][j]: smallest string keeping j digits from first i chars (1-based i for loop convenience)
    dp = [["" for _ in range(m + 1)] for _ in range(n + 1)]
    # Base: dp[0][0] = "" (already set)

    for i in range(1, n + 1):
        digit = num[i - 1]
        for j in range(min(i, m) + 1):
            candidates = []
            # Option 1: Skip current digit
            if j <= i - 1:  # Enough digits before
                if dp[i - 1][j] or j == 0:  # Valid if not impossible
                    candidates.append(dp[i - 1][j])
            # Option 2: Keep current digit
            if j >= 1 and (dp[i - 1][j - 1] or j - 1 == 0):
                candidates.append(dp[i - 1][j - 1] + digit)
            if candidates:
                dp[i][j] = min(candidates)  # Lex smallest

    result = dp[n][m]
    result = result.lstrip('0')
    return result if result else "0"
```

- **Explanation of Code**:
  - We initialize a `(n+1) x (m+1)` DP table with empty strings.
  - For each prefix length `i` (1 to n), and for each possible kept digits `j` (0 to min(i, m)):
    - Collect candidates for skip and keep options.
    - Use Python's `min()` on strings for lex smallest (works because all candidates have length `j`).
  - Handle empty strings for base cases (represents "0" or invalid).
  - After filling, get `dp[n][m]`, remove leading zeros, and return "0" if empty.

#### Example Walkthrough
Take `num = "1432219"`, `k = 3`, `n=7`, `m=4`.
- We build dp table step by step.
- For i=1, digit='1': dp[1][1] = "1", dp[1][0] = ""
- Progressively, at each step, we choose keep/skip to minimize the string.
- Final dp[7][4] = "1219" (smallest).

For `num = "10200"`, `k=1`, `m=4`: Final "0200" -> lstrip -> "200".

#### Time and Space Complexity
- **Time**: O(n * m * l), where l is average string length (~m/2). String comparison and concatenation take O(m) time, leading to O(n * m^2) in worst case. For n=10^5, m=10^5, this is ~10^15 operations—way too slow.
- **Space**: O(n * m) for the table, but each string is up to O(m) chars, so total ~O(n * m^2) = ~10^15 bytes—impossible.
- **Why Suboptimal?** String storage and operations dominate. For large n, use the greedy stack (O(n) time/space). This DP is for educational purposes or small constraints.

### Related Problems
Based on similar themes like greedy digit manipulation, subsequences, or monotonic stacks:
- [316. Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters/) (Monotonic stack for lexicographically smallest subsequence).
- [321. Create Maximum Number](https://leetcode.com/problems/create-maximum-number/) (Similar greedy removal but for maximum).
- [738. Monotone Increasing Digits](https://leetcode.com/problems/monotone-increasing-digits/) (Adjust digits for increasing sequence).
- [1673. Find the Most Competitive Subsequence](https://leetcode.com/problems/find-the-most-competitive-subsequence/) (Similar stack-based greedy for smallest subsequence).
- [2208. Minimum Operations to Halve Array Sum](https://leetcode.com/problems/minimum-operations-to-halve-array-sum/) (Greedy with priority queue, related to removals).
- [1481. Least Number of Unique Integers after K Removals](https://leetcode.com/problems/least-number-of-unique-integers-after-k-removals/) (Frequency-based removals).

### Video Tutorial Links
Here are some helpful video explanations:
- [Remove K Digits - Leetcode 402 - Python](https://www.youtube.com/watch?v=cFabMOnJaq0) by NeetCode (focuses on Python implementation and intuition).
- [LeetCode Remove K Digits Solution Explained - Java](https://www.youtube.com/watch?v=vbM41Zql228) by Nick White (Java-focused with step-by-step walkthrough).
- [402. Remove K Digits | Monotonic Stack | Greedy | Brute Force](https://www.youtube.com/watch?v=chte4pRYujs) by Code with Alisha (covers multiple approaches including brute force).
- [Remove K Digits | Intuition | Dry Run | Leetcode 402](https://www.youtube.com/watch?v=lWcZB7l-O7M) by CodeChef (detailed dry run and intuition).
