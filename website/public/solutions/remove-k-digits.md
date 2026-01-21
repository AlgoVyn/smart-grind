## Remove K Digits

### Problem Statement

LeetCode Problem 402: Remove K Digits

Given a string `num` representing a non-negative integer and an integer `k`, return the smallest possible integer after removing exactly `k` digits from `num`. The resulting number should not have leading zeros, except if the result is `0` itself. The digits must remain in their original relative order; rearrangement is not allowed.

**Constraints:**
- `1 <= k <= num.length <= 10^5`
- `num` consists only of digits ('0'-'9').
- `num` does not have leading zeros, except if `num` is "0".

### Examples

- **Input:** `num = "1432219"`, `k = 3`  
  **Output:** `"1219"`  
  **Explanation:** Remove '4', '3', and '2' to form the smallest possible number.

- **Input:** `num = "10200"`, `k = 1`  
  **Output:** `"200"`  
  **Explanation:** Remove the leading '1' to avoid leading zeros in the result.

- **Input:** `num = "10"`, `k = 2`  
  **Output:** `"0"`  
  **Explanation:** Remove both digits, resulting in `0`.

### Intuition

The goal is to form the smallest number by strategically removing `k` digits. To minimize the number, prioritize removing larger digits that appear earlier (higher place values), but only if doing so allows a smaller digit to take their place. This is like eliminating "peaks" where a digit is larger than the one following it.

A greedy approach works well: Traverse the digits and maintain a monotonically increasing sequence (from left to right) by removing larger digits when possible, using a stack. After processing, if removals remain, trim from the end (as trailing digits have lower impact). Finally, strip leading zeros to get the valid smallest number.

---

## Approach 1: Brute Force (Educational Only - Not Efficient)

Generate all possible combinations of removing exactly `k` digits and find the minimum among the resulting numbers. This involves selecting `n - k` digits in order and comparing them as strings (to handle large numbers).

This approach is impractical for large inputs but helps understand the problem as finding the lexicographically smallest subsequence of length `n - k`.

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

**Time Complexity:** O(C(n, n-k) * (n-k)) where C is binomial coefficient, which is exponential.  
**Space Complexity:** O(n) for storing candidates.

---

## Approach 2: Greedy with Monotonic Stack (Optimal)

Use a stack to build the smallest number greedily:
- Iterate through each digit in `num`.
- While the stack is not empty, the top of the stack is greater than the current digit, and we have removals left (`k > 0`), pop the stack (remove the larger digit).
- Append the current digit to the stack.
- After iteration, if `k` removals remain, pop the last `k` digits from the stack.
- Convert the stack to a string, remove leading zeros, and return "0" if empty.

This ensures we remove digits that violate the increasing order, prioritizing earlier positions for smaller values.

### Implementation

````carousel
```python
class Solution:
    def removeKdigits(self, num: str, k: int) -> str:
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
<!-- slide -->
```java
import java.util.Stack;

class Solution {
    public String removeKdigits(String num, int k) {
        if (num == null || num.isEmpty()) return "0";
        
        Stack<Character> stack = new Stack<>();
        for (char digit : num.toCharArray()) {
            while (k > 0 && !stack.isEmpty() && stack.peek() > digit) {
                stack.pop();
                k--;
            }
            stack.push(digit);
        }
        
        // Remove remaining digits from the end if k > 0
        while (k > 0 && !stack.isEmpty()) {
            stack.pop();
            k--;
        }
        
        // Build result and remove leading zeros
        StringBuilder sb = new StringBuilder();
        for (char c : stack) {
            sb.append(c);
        }
        
        String result = sb.toString().replaceFirst("^0+", "");
        return result.isEmpty() ? "0" : result;
    }
}
```
<!-- slide -->
```cpp
#include <stack>
#include <string>

class Solution {
public:
    string removeKdigits(string num, int k) {
        if (num.empty()) return "0";
        
        std::stack<char> stack;
        for (char digit : num) {
            while (k > 0 && !stack.empty() && stack.top() > digit) {
                stack.pop();
                k--;
            }
            stack.push(digit);
        }
        
        // Remove remaining digits from the end if k > 0
        while (k > 0 && !stack.empty()) {
            stack.pop();
            k--;
        }
        
        // Build result string
        string result;
        while (!stack.empty()) {
            result = stack.top() + result;
            stack.pop();
        }
        
        // Remove leading zeros
        size_t pos = result.find_first_not_of('0');
        if (pos == string::npos) return "0";
        return result.substr(pos);
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {string} num
 * @param {number} k
 * @return {string}
 */
var removeKdigits = function(num, k) {
    if (!num) return "0";
    
    const stack = [];
    for (const digit of num) {
        while (k > 0 && stack.length > 0 && stack[stack.length - 1] > digit) {
            stack.pop();
            k--;
        }
        stack.push(digit);
    }
    
    // Remove remaining digits from the end if k > 0
    while (k > 0 && stack.length > 0) {
        stack.pop();
        k--;
    }
    
    // Build result and remove leading zeros
    const result = stack.join('').replace(/^0+/, '');
    return result || "0";
};
```
````

### Explanation Step-by-Step

1. Initialize an empty stack to store digits.
2. For each digit in the number:
   - While we can remove digits (`k > 0`), the stack is not empty, and the top of the stack is greater than the current digit, pop the stack (removing the larger digit and reducing `k`).
   - Push the current digit onto the stack.
3. After processing all digits, if we still have removals left (`k > 0`), remove digits from the end of the stack (trailing digits have less impact on the value).
4. Convert the stack to a string and remove leading zeros.
5. Return "0" if the result is empty.

### Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `num`. Each digit is pushed and popped at most once.
- **Space Complexity:** O(n) for the stack.

This is the efficient solution, suitable for the constraints.

---

## Approach 3: Bottom-Up Dynamic Programming

The DP approach treats the problem as finding the lexicographically smallest subsequence of exactly `m = n - k` digits from the first `i` digits.

### Intuition for DP

- Define a state `dp[i][j]` as the **lexicographically smallest string** formed by keeping exactly `j` digits from the first `i` digits of `num` (i.e., removing `i - j` digits).
- The goal is to compute `dp[n][m]`, where `n = len(num)` and `m = n - k`.
- For each state, decide whether to **keep** the `i`-th digit or **skip** (remove) it:
  - If we skip it: `dp[i][j] = dp[i-1][j]` (we keep the same number of digits from the previous prefix).
  - If we keep it: `dp[i][j] = dp[i-1][j-1] + num[i-1]` (append the current digit to the smallest string keeping `j-1` digits from the first `i-1` digits).
- Take the minimum (lexicographically smallest) of the valid options.
- After computing, strip leading zeros from the result.

### Implementation

````carousel
```python
class Solution:
    def removeKdigits(self, num: str, k: int) -> str:
        n = len(num)
        m = n - k
        if m == 0:
            return "0"
        
        # dp[i][j]: smallest string keeping j digits from first i chars
        dp = [["" for _ in range(m + 1)] for _ in range(n + 1)]
        
        for i in range(1, n + 1):
            digit = num[i - 1]
            for j in range(min(i, m) + 1):
                candidates = []
                # Option 1: Skip current digit
                if j <= i - 1 and (dp[i - 1][j] or j == 0):
                    candidates.append(dp[i - 1][j])
                # Option 2: Keep current digit
                if j >= 1 and (dp[i - 1][j - 1] or j - 1 == 0):
                    candidates.append(dp[i - 1][j - 1] + digit)
                if candidates:
                    dp[i][j] = min(candidates)
        
        result = dp[n][m].lstrip('0')
        return result if result else "0"
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public String removeKdigits(String num, int k) {
        int n = num.length();
        int m = n - k;
        if (m == 0) return "0";
        
        // dp[i][j]: smallest string keeping j digits from first i chars
        String[][] dp = new String[n + 1][m + 1];
        for (int i = 0; i <= n; i++) {
            Arrays.fill(dp[i], "");
        }
        
        for (int i = 1; i <= n; i++) {
            char digit = num.charAt(i - 1);
            for (int j = 0; j <= Math.min(i, m); j++) {
                List<String> candidates = new ArrayList<>();
                // Option 1: Skip current digit
                if (j <= i - 1 && (dp[i - 1][j].length() == j || j == 0)) {
                    candidates.add(dp[i - 1][j]);
                }
                // Option 2: Keep current digit
                if (j >= 1 && (dp[i - 1][j - 1].length() == j - 1 || j - 1 == 0)) {
                    candidates.add(dp[i - 1][j - 1] + digit);
                }
                if (!candidates.isEmpty()) {
                    dp[i][j] = Collections.min(candidates);
                }
            }
        }
        
        String result = dp[n][m].replaceFirst("^0+", "");
        return result.isEmpty() ? "0" : result;
    }
}
```
<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    string removeKdigits(string num, int k) {
        int n = num.length();
        int m = n - k;
        if (m == 0) return "0";
        
        // dp[i][j]: smallest string keeping j digits from first i chars
        std::vector<std::vector<std::string>> dp(n + 1, std::vector<std::string>(m + 1, ""));
        
        for (int i = 1; i <= n; i++) {
            char digit = num[i - 1];
            for (int j = 0; j <= std::min(i, m); j++) {
                std::vector<std::string> candidates;
                // Option 1: Skip current digit
                if (j <= i - 1 && (dp[i - 1][j].length() == j || j == 0)) {
                    candidates.push_back(dp[i - 1][j]);
                }
                // Option 2: Keep current digit
                if (j >= 1 && (dp[i - 1][j - 1].length() == j - 1 || j - 1 == 0)) {
                    candidates.push_back(dp[i - 1][j - 1] + digit);
                }
                if (!candidates.empty()) {
                    dp[i][j] = *std::min_element(candidates.begin(), candidates.end());
                }
            }
        }
        
        std::string result = dp[n][m];
        size_t pos = result.find_first_not_of('0');
        if (pos == std::string::npos) return "0";
        return result.substr(pos);
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {string} num
 * @param {number} k
 * @return {string}
 */
var removeKdigits = function(num, k) {
    const n = num.length;
    const m = n - k;
    if (m === 0) return "0";
    
    // dp[i][j]: smallest string keeping j digits from first i chars
    const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(""));
    
    for (let i = 1; i <= n; i++) {
        const digit = num[i - 1];
        for (let j = 0; j <= Math.min(i, m); j++) {
            const candidates = [];
            // Option 1: Skip current digit
            if (j <= i - 1 && (dp[i - 1][j].length === j || j === 0)) {
                candidates.push(dp[i - 1][j]);
            }
            // Option 2: Keep current digit
            if (j >= 1 && (dp[i - 1][j - 1].length === j - 1 || j - 1 === 0)) {
                candidates.push(dp[i - 1][j - 1] + digit);
            }
            if (candidates.length > 0) {
                dp[i][j] = candidates.reduce((min, curr) => curr < min ? curr : min);
            }
        }
    }
    
    const result = dp[n][m].replace(/^0+/, '');
    return result || "0";
};
```
````

### Complexity Analysis

- **Time Complexity:** O(n * m^2) due to string operations and comparisons.
- **Space Complexity:** O(n * m) for the DP table.

This approach is for educational purposes and works for small inputs. For large inputs, use the greedy stack approach.

---

## Approach 4: Top-Down Dynamic Programming with Memoization

This approach uses recursion with memoization to avoid recomputing overlapping subproblems. It's more intuitive than bottom-up DP and naturally handles the "skip or keep" decision.

### Intuition

- Use a recursive function that takes the current position `pos` (how many digits we've processed) and `remaining` (how many digits we still need to keep).
- At each step, we can either skip the current digit or keep it.
- Use memoization to store results for each `(pos, remaining)` pair.
- The base case is when we've processed all digits (`pos == n`), return an empty string if `remaining == 0`, otherwise return an invalid marker.

### Implementation

````carousel
```python
class Solution:
    def removeKdigits(self, num: str, k: int) -> str:
        n = len(num)
        m = n - k
        if m == 0:
            return "0"
        
        from functools import lru_cache
        
        @lru_cache(None)
        def dp(pos: int, remaining: int) -> str:
            # Base case: we've processed all digits
            if pos == n:
                return "" if remaining == 0 else None
            
            # If we need to keep 0 digits, return empty (skip all remaining)
            if remaining == 0:
                return ""
            
            # Option 1: Skip current digit
            skip = dp(pos + 1, remaining)
            
            # Option 2: Keep current digit
            keep = dp(pos + 1, remaining - 1)
            if keep is not None:
                keep = num[pos] + keep
            
            # Return the lexicographically smaller valid result
            if skip is not None and (keep is None or skip <= keep):
                return skip
            return keep
        
        result = dp(0, m)
        if result is None:
            result = ""
        result = result.lstrip('0')
        return result if result else "0"
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    private String num;
    private int n;
    private String[][] memo;
    
    private String dp(int pos, int remaining) {
        if (pos == n) {
            return remaining == 0 ? "" : null;
        }
        if (remaining == 0) {
            return "";
        }
        if (memo[pos][remaining] != null) {
            return memo[pos][remaining];
        }
        
        // Option 1: Skip current digit
        String skip = dp(pos + 1, remaining);
        
        // Option 2: Keep current digit
        String keep = dp(pos + 1, remaining - 1);
        if (keep != null) {
            keep = num.charAt(pos) + keep;
        }
        
        // Return the lexicographically smaller valid result
        String result;
        if (skip != null && (keep == null || skip.compareTo(keep) <= 0)) {
            result = skip;
        } else {
            result = keep;
        }
        
        memo[pos][remaining] = result;
        return result;
    }
    
    public String removeKdigits(String num, int k) {
        this.num = num;
        this.n = num.length();
        int m = n - k;
        if (m == 0) return "0";
        
        memo = new String[n + 1][m + 1];
        String result = dp(0, m);
        if (result == null) result = "";
        
        result = result.replaceFirst("^0+", "");
        return result.isEmpty() ? "0" : result;
    }
}
```
<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>
#include <climits>

class Solution {
private:
    std::string num;
    int n;
    std::vector<std::vector<std::string>> memo;
    std::vector<std::vector<bool>> visited;
    
    std::string dp(int pos, int remaining) {
        if (pos == n) {
            return remaining == 0 ? "" : "NULL";
        }
        if (remaining == 0) {
            return "";
        }
        if (visited[pos][remaining]) {
            return memo[pos][remaining];
        }
        
        // Option 1: Skip current digit
        std::string skip = dp(pos + 1, remaining);
        
        // Option 2: Keep current digit
        std::string keep = dp(pos + 1, remaining - 1);
        if (keep != "NULL") {
            keep = num[pos] + keep;
        }
        
        // Return the lexicographically smaller valid result
        std::string result;
        if (skip != "NULL" && (keep == "NULL" || skip <= keep)) {
            result = skip;
        } else {
            result = keep;
        }
        
        visited[pos][remaining] = true;
        memo[pos][remaining] = result;
        return result;
    }
    
public:
    string removeKdigits(string num, int k) {
        this->num = num;
        this->n = num.length();
        int m = n - k;
        if (m == 0) return "0";
        
        memo = std::vector<std::vector<std::string>>(n + 1, std::vector<std::string>(m + 1));
        visited = std::vector<std::vector<bool>>(n + 1, std::vector<bool>(m + 1, false));
        
        std::string result = dp(0, m);
        if (result == "NULL") result = "";
        
        size_t pos = result.find_first_not_of('0');
        if (pos == std::string::npos) return "0";
        return result.substr(pos);
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {string} num
 * @param {number} k
 * @return {string}
 */
var removeKdigits = function(num, k) {
    const n = num.length;
    const m = n - k;
    if (m === 0) return "0";
    
    const memo = new Map();
    
    function dp(pos, remaining) {
        if (pos === n) {
            return remaining === 0 ? "" : null;
        }
        if (remaining === 0) {
            return "";
        }
        
        const key = `${pos},${remaining}`;
        if (memo.has(key)) {
            return memo.get(key);
        }
        
        // Option 1: Skip current digit
        const skip = dp(pos + 1, remaining);
        
        // Option 2: Keep current digit
        let keep = null;
        const keepResult = dp(pos + 1, remaining - 1);
        if (keepResult !== null) {
            keep = num[pos] + keepResult;
        }
        
        // Return the lexicographically smaller valid result
        let result;
        if (skip !== null && (keep === null || skip <= keep)) {
            result = skip;
        } else {
            result = keep;
        }
        
        memo.set(key, result);
        return result;
    }
    
    let result = dp(0, m);
    if (result === null) result = "";
    
    result = result.replace(/^0+/, '');
    return result || "0";
};
```
````

### Complexity Analysis

- **Time Complexity:** O(n * m) states, each computed once. String concatenation can be O(m) per call, leading to O(n * m^2) in worst case.
- **Space Complexity:** O(n * m) for memoization + O(m) for recursion stack.

The greedy stack approach is still preferred for large inputs due to its O(n) complexity.

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|-----------------|------------------|----------|
| Brute Force | O(C(n, n-k) * (n-k)) | O(n) | Educational only - exponential |
| Greedy with Monotonic Stack | O(n) | O(n) | **Recommended** - Optimal for constraints |
| Bottom-Up DP | O(n * m^2) | O(n * m) | Educational - small inputs only |
| Top-Down DP with Memoization | O(n * m^2) | O(n * m) | Educational - intuitive recursion |

---

## Related Problems

Based on similar themes like greedy digit manipulation, subsequences, or monotonic stacks:

- [316. Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters/) (Monotonic stack for lexicographically smallest subsequence).
- [321. Create Maximum Number](https://leetcode.com/problems/create-maximum-number/) (Similar greedy removal but for maximum).
- [738. Monotone Increasing Digits](https://leetcode.com/problems/monotone-increasing-digits/) (Adjust digits for increasing sequence).
- [1673. Find the Most Competitive Subsequence](https://leetcode.com/problems/find-the-most-competitive-subsequence/) (Similar stack-based greedy for smallest subsequence).
- [2208. Minimum Operations to Halve Array Sum](https://leetcode.com/problems/minimum-operations-to-halve-array-sum/) (Greedy with priority queue, related to removals).
- [1481. Least Number of Unique Integers after K Removals](https://leetcode.com/problems/least-number-of-unique-integers-after-k-removals/) (Frequency-based removals).

---

## Video Tutorial Links

Here are some helpful video explanations:

- [Remove K Digits - Leetcode 402 - Python](https://www.youtube.com/watch?v=cFabMOnJaq0) by NeetCode (focuses on Python implementation and intuition).
- [LeetCode Remove K Digits Solution Explained - Java](https://www.youtube.com/watch?v=vbM41Zql228) by Nick White (Java-focused with step-by-step walkthrough).
- [402. Remove K Digits | Monotonic Stack | Greedy | Brute Force](https://www.youtube.com/watch?v=chte4pRYujs) by Code with Alisha (covers multiple approaches including brute force).
- [Remove K Digits | Intuition | Dry Run | Leetcode 402](https://www.youtube.com/watch?v=lWcZB7l-O7M) by CodeChef (detailed dry run and intuition).

---

## Follow-up Questions

1. **How would you modify this solution to return the maximum number instead of minimum?**

   **Answer:** Reverse the comparison logic in the greedy stack approach. Instead of removing digits where `stack[-1] > digit`, remove when `stack[-1] < digit` (keep larger digits and remove smaller ones). Alternatively, negate all digits and find the minimum, then negate back. The DP approaches can be similarly modified by changing the comparison from `min` to `max`.

2. **What if `k` can be any value from 0 to `num.length`?**

   **Answer:** The greedy stack approach already handles this case. If `k = 0`, the while loop condition fails and no digits are removed. If `k >= n`, the result would be "0". For the DP approaches, if `k >= n`, set `m = max(0, n - k)` and return "0" if `m == 0`.

3. **How would you count the number of distinct ways to remove exactly `k` digits?**

   **Answer:** This is a combinatorial problem. The number of ways to choose which `k` positions to remove is `C(n, k)`, but not all result in unique numbers. To count distinct results, we can use a set to store all possible results (backtracking), or use DP to count unique subsequences. A more efficient approach would use a trie or hash map to deduplicate results as we generate them. For very large `n`, this becomes computationally expensive.

4. **Can this be solved with a two-pointer approach?**

   **Answer:** Not directly in the traditional sense. The problem requires making decisions based on future digits (removing a digit now depends on what comes later), which is why the stack (which can look back) works well. However, a two-pointer approach could be used in a modified form where one pointer tracks the current position and another tracks where to write in the result array, similar to the greedy logic but with array manipulation instead of a stack.

5. **How would you handle very large numbers that exceed standard integer limits?**

   **Answer:** The current solutions already handle this by working with strings throughout, never converting to integers until the final result (and even then, we strip zeros and return a string). For comparison purposes, we use lexicographic string comparison which works correctly for numbers represented as strings of digits. This is why the greedy approach is ideal - it never needs to parse the full number as an integer.

6. **What if you need to remove digits such that the result is the smallest but also divisible by a certain number?**

   **Answer:** This becomes a much harder problem. You would need to modify the DP approach to track divisibility as an additional state. For example, `dp[pos][remaining][mod]` where `mod` is the remainder when divided by the target number. This would be O(n * m * divisor) time and space, which is feasible for small divisors but not for large ones. The greedy approach cannot be directly extended.

7. **How would you adapt this solution for a streaming input (digits arriving one at a time)?**

   **Answer:** The greedy stack approach works naturally with streaming. Each new digit can be processed against the current stack using the same logic. You can maintain a sliding window or periodically output intermediate results. However, once digits are removed from the stack, they cannot be recovered, so careful consideration is needed for backtracking scenarios.

---

## LeetCode Link

[Remove K Digits - LeetCode](https://leetcode.com/problems/remove-k-digits/)

