# Decode Ways

## Problem Description

You have intercepted a secret message encoded as a string of numbers. The message is decoded via the following mapping:
- "1" → 'A'
- "2" → 'B'
- ...
- "25" → 'Y'
- "26" → 'Z'

However, while decoding the message, you realize that there are many different ways you can decode the message because some codes are contained in other codes ("2" and "5" vs "25").

For example, "11106" can be decoded into:
- "AAJF" with the grouping (1, 1, 10, 6)
- "KJF" with the grouping (11, 10, 6)
- The grouping (1, 11, 06) is invalid because "06" is not a valid code (only "6" is valid).

Note: there may be strings that are impossible to decode.

Given a string `s` containing only digits, return the number of ways to decode it. If the entire string cannot be decoded in any valid way, return 0.

The test cases are generated so that the answer fits in a 32-bit integer.

**Link to problem:** [Decode Ways - LeetCode 91](https://leetcode.com/problems/decode-ways/)

## Constraints
- `1 <= s.length <= 100`
- `s` contains only digits and may contain leading zero(s).

---

## Pattern: Dynamic Programming - String Decoding

This problem is a classic example of the **Dynamic Programming - String Decoding** pattern. The pattern involves counting ways to decode by considering each digit and adjacent digit pairs as potential encoding units.

### Core Concept

The fundamental idea is dynamic programming where we consider:
- **Single digit**: Can be decoded if it's not '0' (since '0' has no mapping)
- **Two digits**: Can be decoded if the number is between 10 and 26

The number of ways to decode up to position i depends on the ways to decode up to i-1 and i-2.

---

## Examples

### Example

**Input:**
```
s = "12"
```

**Output:**
```
2
```

**Explanation:**
- "1" → 'A', "2" → 'B' → "AB"
- "12" → 'L' → "L"
- Two ways: "AB" and "L"

### Example 2

**Input:**
```
s = "226"
```

**Output:**
```
3
```

**Explanation:**
- "2"→'B', "2"→'B', "6"→'F' → "BBF"
- "22"→'V', "6"→'F' → "VF"
- "2"→'B', "26"→'Z' → "BZ"
- Three ways: "BBF", "VF", "BZ"

### Example 3

**Input:**
```
s = "06"
```

**Output:**
```
0
```

**Explanation:** "06" cannot be mapped to 'F' because of the leading zero. Only "6" is valid, but "0" alone is invalid.

### Example 4

**Input:**
```
s = "10"
```

**Output:**
```
1
```

**Explanation:** "10" → 'J' only. "1" + "0" is invalid because "0" has no mapping.

### Example 5

**Input:**
```
s = "1010"
```

**Output:**
```
1
```

**Explanation:**
- "10"→'J', "10"→'J' → "JJ"
- Other combinations are invalid due to leading zeros or invalid 2-digit numbers

---

## Intuition

The key insight is understanding how encoding decisions interact:

1. **Single Digit**: A digit '1'-'9' can be decoded alone (except '0')
2. **Two Digits**: A pair from '10' to '26' can be decoded as one letter
3. **Dependency**: The number of ways at position i depends on previous positions

### Why Dynamic Programming?

Consider string "1234":
- At position 3 (digit '3'):
  - If we decode '3' alone: ways = ways to decode "12" = 2
  - If we decode '34' together: ways = ways to decode "1" = 1
- Total = 2 + 1 = 3

The recurrence: `dp[i] = dp[i-1] (if s[i] valid) + dp[i-2] (if s[i-1:i+1] valid)`

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Dynamic Programming with Array** - O(n) time, O(n) space
2. **Dynamic Programming with Two Variables** - O(n) time, O(1) space
3. **Recursive with Memoization** - O(n) time, O(n) space

---

## Approach 1: Dynamic Programming with Array

This is the classic DP approach. We use an array where dp[i] represents the number of ways to decode the first i characters.

### Algorithm Steps

1. Create dp array of size n+1, dp[0] = 1
2. For each position i from 1 to n:
   - If s[i-1] != '0', add dp[i-1] to dp[i]
   - If the two-digit number s[i-2:i] is between 10 and 26, add dp[i-2] to dp[i]
3. Return dp[n]

### Why It Works

The recurrence relation captures all valid decodings:
- Taking a single digit doesn't affect future decodings
- Taking a two-digit number also doesn't affect the rest
- By summing both possibilities, we count all valid paths

### Code Implementation

````carousel
```python
class Solution:
    def numDecodings(self, s: str) -> int:
        """
        Count the number of ways to decode a numeric string.
        
        Args:
            s: String of digits to decode
            
        Returns:
            Number of valid decode ways
        """
        if not s or s[0] == '0':
            return 0
        
        n = len(s)
        dp = [0] * (n + 1)
        dp[0] = 1  # Empty string has one way to decode
        
        # First character
        if s[0] != '0':
            dp[1] = 1
        
        for i in range(2, n + 1):
            # Single digit decoding
            if s[i-1] != '0':
                dp[i] += dp[i-1]
            
            # Two digit decoding
            two_digit = int(s[i-2:i])
            if 10 <= two_digit <= 26:
                dp[i] += dp[i-2]
        
        return dp[n]
```

<!-- slide -->
```cpp
class Solution {
public:
    int numDecodings(string s) {
        /**
         * Count the number of ways to decode a numeric string.
         * 
         * Args:
         *     s: String of digits to decode
         * 
         * Returns:
         *     Number of valid decode ways
         */
        if (s.empty() || s[0] == '0') return 0;
        
        int n = s.length();
        vector<int> dp(n + 1, 0);
        dp[0] = 1;
        dp[1] = 1;
        
        for (int i = 2; i <= n; i++) {
            // Single digit
            if (s[i-1] != '0') {
                dp[i] += dp[i-1];
            }
            
            // Two digits
            int two_digit = (s[i-2] - '0') * 10 + (s[i-1] - '0');
            if (two_digit >= 10 && two_digit <= 26) {
                dp[i] += dp[i-2];
            }
        }
        
        return dp[n];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int numDecodings(String s) {
        /**
         * Count the number of ways to decode a numeric string.
         * 
         * Args:
         *     s: String of digits to decode
         * 
         * Returns:
         *     Number of valid decode ways
         */
        if (s.isEmpty() || s.charAt(0) == '0') return 0;
        
        int n = s.length();
        int[] dp = new int[n + 1];
        dp[0] = 1;
        dp[1] = 1;
        
        for (int i = 2; i <= n; i++) {
            // Single digit
            if (s.charAt(i-1) != '0') {
                dp[i] += dp[i-1];
            }
            
            // Two digits
            int twoDigit = Integer.parseInt(s.substring(i-2, i));
            if (twoDigit >= 10 && twoDigit <= 26) {
                dp[i] += dp[i-2];
            }
        }
        
        return dp[n];
    }
}
```

<!-- slide -->
```javascript
/**
 * Count the number of ways to decode a numeric string.
 * 
 * @param {string} s - String of digits to decode
 * @return {number} - Number of valid decode ways
 */
var numDecodings = function(s) {
    if (!s || s[0] === '0') return 0;
    
    const n = s.length;
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        // Single digit
        if (s[i-1] !== '0') {
            dp[i] += dp[i-1];
        }
        
        // Two digits
        const twoDigit = parseInt(s.substring(i-2, i));
        if (twoDigit >= 10 && twoDigit <= 26) {
            dp[i] += dp[i-2];
        }
    }
    
    return dp[n];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each position processed once |
| **Space** | O(n) - DP array of size n+1 |

---

## Approach 2: Dynamic Programming with O(1) Space

This approach optimizes space by using only two variables instead of an array.

### Algorithm Steps

1. Use two variables: prev2 (dp[i-2]) and prev1 (dp[i-1])
2. Iterate through the string, updating current based on prev1 and prev2
3. Shift variables for next iteration

### Code Implementation

````carousel
```python
class Solution:
    def numDecodings_optimized(self, s: str) -> int:
        """
        Count decode ways with O(1) space.
        
        Args:
            s: String of digits to decode
            
        Returns:
            Number of valid decode ways
        """
        if not s or s[0] == '0':
            return 0
        
        n = len(s)
        if n == 1:
            return 1
        
        # dp[i-2], dp[i-1], dp[i]
        prev2 = 1  # dp[0]
        prev1 = 1  # dp[1]
        
        for i in range(2, n + 1):
            curr = 0
            
            # Single digit
            if s[i-1] != '0':
                curr += prev1
            
            # Two digits
            two_digit = int(s[i-2:i])
            if 10 <= two_digit <= 26:
                curr += prev2
            
            prev2 = prev1
            prev1 = curr
        
        return prev1
```

<!-- slide -->
```cpp
class Solution {
public:
    int numDecodingsOptimized(string s) {
        if (s.empty() || s[0] == '0') return 0;
        if (s.length() == 1) return 1;
        
        int prev2 = 1;  // dp[i-2]
        int prev1 = 1;  // dp[i-1]
        
        for (int i = 2; i <= s.length(); i++) {
            int curr = 0;
            
            // Single digit
            if (s[i-1] != '0') {
                curr += prev1;
            }
            
            // Two digits
            int two_digit = (s[i-2] - '0') * 10 + (s[i-1] - '0');
            if (two_digit >= 10 && two_digit <= 26) {
                curr += prev2;
            }
            
            prev2 = prev1;
            prev1 = curr;
        }
        
        return prev1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int numDecodingsOptimized(String s) {
        if (s.isEmpty() || s.charAt(0) == '0') return 0;
        if (s.length() == 1) return 1;
        
        int prev2 = 1;  // dp[i-2]
        int prev1 = 1;  // dp[i-1]
        
        for (int i = 2; i < s.length(); i++) {
            int curr = 0;
            
            // Single digit
            if (s.charAt(i) != '0') {
                curr += prev1;
            }
            
            // Two digits
            int twoDigit = Integer.parseInt(s.substring(i-1, i+1));
            if (twoDigit >= 10 && twoDigit <= 26) {
                curr += prev2;
            }
            
            prev2 = prev1;
            prev1 = curr;
        }
        
        return prev1;
    }
}
```

<!-- slide -->
```javascript
var numDecodingsOptimized = function(s) {
    if (!s || s[0] === '0') return 0;
    if (s.length === 1) return 1;
    
    let prev2 = 1;  // dp[i-2]
    let prev1 = 1;  // dp[i-1]
    
    for (let i = 2; i < s.length; i++) {
        let curr = 0;
        
        // Single digit
        if (s[i] !== '0') {
            curr += prev1;
        }
        
        // Two digits
        const twoDigit = parseInt(s.substring(i-1, i+1));
        if (twoDigit >= 10 && twoDigit <= 26) {
            curr += prev2;
        }
        
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each position processed once |
| **Space** | O(1) - Only two integer variables |

---

## Approach 3: Recursive with Memoization

This approach uses recursion with memoization to avoid redundant calculations.

### Algorithm Steps

1. Define recursive function that returns ways to decode from position i
2. Use memoization array to cache results
3. At each position, try single digit and two-digit options
4. Return sum of valid options

### Code Implementation

````carousel
```python
class Solution:
    def numDecodings_memo(self, s: str) -> int:
        """
        Count decode ways using recursion with memoization.
        
        Args:
            s: String of digits to decode
            
        Returns:
            Number of valid decode ways
        """
        from functools import lru_cache
        
        n = len(s)
        
        @lru_cache(maxsize=None)
        def dp(i: int) -> int:
            if i == n:
                return 1  # Reached end successfully
            if s[i] == '0':
                return 0  # Can't decode '0' alone
            
            # Single digit
            result = dp(i + 1)
            
            # Two digits
            if i + 1 < n:
                two_digit = int(s[i:i+2])
                if 10 <= two_digit <= 26:
                    result += dp(i + 2)
            
            return result
        
        return dp(0)
```

<!-- slide -->
```cpp
class Solution {
public:
    int numDecodingsMemo(string s) {
        int n = s.length();
        vector<int> memo(n, -1);
        
        function<int(int)> dp = [&](int i) -> int {
            if (i == n) return 1;
            if (s[i] == '0') return 0;
            if (memo[i] != -1) return memo[i];
            
            int result = dp(i + 1);
            if (i + 1 < n) {
                int two_digit = (s[i] - '0') * 10 + (s[i+1] - '0');
                if (two_digit >= 10 && two_digit <= 26) {
                    result += dp(i + 2);
                }
            }
            
            memo[i] = result;
            return result;
        };
        
        return dp(0);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int numDecodingsMemo(String s) {
        int n = s.length();
        int[] memo = new int[n];
        Arrays.fill(memo, -1);
        
        return dp(s, 0, memo);
    }
    
    private int dp(String s, int i, int[] memo) {
        if (i == s.length()) return 1;
        if (s.charAt(i) == '0') return 0;
        if (memo[i] != -1) return memo[i];
        
        int result = dp(s, i + 1, memo);
        if (i + 1 < s.length()) {
            int twoDigit = Integer.parseInt(s.substring(i, i + 2));
            if (twoDigit >= 10 && twoDigit <= 26) {
                result += dp(s, i + 2, memo);
            }
        }
        
        memo[i] = result;
        return result;
    }
}
```

<!-- slide -->
```javascript
var numDecodingsMemo = function(s) {
    const n = s.length;
    const memo = new Array(n).fill(-1);
    
    function dp(i) {
        if (i === n) return 1;
        if (s[i] === '0') return 0;
        if (memo[i] !== -1) return memo[i];
        
        let result = dp(i + 1);
        if (i + 1 < n) {
            const twoDigit = parseInt(s.substring(i, i + 2));
            if (twoDigit >= 10 && twoDigit <= 26) {
                result += dp(i + 2);
            }
        }
        
        memo[i] = result;
        return result;
    }
    
    return dp(0);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each position computed once due to memoization |
| **Space** | O(n) - Memoization array and recursion stack |

---

## Comparison of Approaches

| Aspect | DP Array | DP Optimized | Memoization |
|--------|----------|--------------|-------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(n) | O(1) | O(n) |
| **Implementation** | Simple | Simple | Moderate |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Best For** | Understanding | Production | Large inputs |

**Best Approach:** Approach 2 (DP with O(1) space) is optimal and commonly used. It's simple and efficient.

---

## Why Dynamic Programming Works

The DP approach works because:

1. **Optimal Substructure**: The number of ways to decode prefix of length i depends only on prefixes of length i-1 and i-2
2. **No Overlapping Subproblems**: Each position is computed exactly once with memoization
3. **Boundary Conditions**: Properly handles '0' characters and edge cases
4. **Linear Progression**: We process left to right, building on previous results

---

## Common Pitfalls

### 1. Leading Zeros
**Issue**: Strings starting with '0' are invalid.

**Solution**: Return 0 immediately if s[0] == '0'.

### 2. Single '0' Character
**Issue**: '0' cannot be decoded alone.

**Solution**: Check s[i] != '0' before adding single-digit ways.

### 3. Two-digit Range
**Issue**: Only numbers 10-26 are valid.

**Solution**: Check `10 <= two_digit <= 26`.

### 4. Array Bounds
**Issue**: Accessing s[i-2] when i=1.

**Solution**: Handle i=1 separately or check bounds before two-digit check.

---

## Related Problems

Based on similar themes (DP, string decoding):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Climbing Stairs | [Link](https://leetcode.com/problems/climbing-stairs/) | Similar DP pattern |
| House Robber | [Link](https://leetcode.com/problems/house-robber/) | DP with two states |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Decode Ways II | [Link](https://leetcode.com/problems/decode-ways-ii/) | Wildcard '*' support |
| Number of Ways to Separate Numbers | [Link](https://leetcode.com/problems/number-of-ways-to-separate-numbers/) | Related DP |
| Integer Break | [Link](https://leetcode.com/problems/integer-break/) | Product DP |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Score Triangulation | [Link](https://leetcode.com/problems/minimum-score-triangulation-of-polygon/) | 2D DP |

### Pattern Reference

For more detailed explanations of the Dynamic Programming pattern, see:
- **[Dynamic Programming Pattern](/patterns/dp-1d-basics)**
- **[String DP](/patterns/dp-string)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Dynamic Programming Explanation

- [NeetCode - Decode Ways](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation with visual examples
- [Back to Back SWE - Decode Ways](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Official problem solution

### Related Concepts

- [Dynamic Programming Basics](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Understanding DP
- [String DP Patterns](https://www.youtube.com/watch?v=8hQPLSSjkMY) - DP for strings

---

## Follow-up Questions

### Q1: How would you modify the solution to handle '*' (wildcard) characters?

**Answer:** The wildcard can represent 1-9. You would need to handle more cases:
- '*' alone: 9 ways
- '1*': 9 ways (11-19)
- '2*': 6 ways (21-26)
- Use DP with additional cases for '*'.

---

### Q2: What is the time complexity if we don't use memoization?

**Answer:** Without memoization, the recursive solution would be O(2^n) because it explores all possible combinations, with exponential growth due to overlapping subproblems.

---

### Q3: Can you solve it using BFS instead of DP?

**Answer:** Yes, you could use BFS to explore all valid decodings, but it would be less efficient than DP due to overhead. BFS would be O(2^n) worst case.

---

### Q4: How would you return the actual decoded strings instead of just the count?

**Answer:** Instead of counting, you would build strings at each step. The space complexity would be much higher since you'd store all decoded strings.

---

### Q5: What is the maximum number of ways for a string of length 100?

**Answer:** The number grows exponentially. For strings without zeros and with many valid two-digit combinations, it can be very large. The problem guarantees the answer fits in 32-bit.

---

### Q6: How does the solution handle consecutive zeros?

**Answer:** If we encounter '0', we skip single-digit decoding. If the previous digit can't form a valid two-digit number (like "00" or "30"), the total ways become 0.

---

### Q7: What edge cases should be tested?

**Answer:**
- Empty string (handled by returning 0)
- Single character ("1" → 1, "0" → 0)
- All valid single digits ("1111" → 1)
- Multiple zeros ("1010")
- Max length ("1111111111...")
- Leading zeros ("01", "10")

---

### Q8: How would you optimize for very long strings (10^5 characters)?

**Answer:**
- Use O(1) space approach
- Process in chunks if needed
- Use iterative instead of recursive to avoid stack overflow

---

## Summary

The **Decode Ways** problem demonstrates dynamic programming for string decoding:

- **DP with array**: O(n) time, O(n) space
- **DP optimized**: O(n) time, O(1) space - optimal
- **Memoization**: O(n) time, O(n) space - alternative approach

The key insight is the recurrence relation: `dp[i] = dp[i-1] + dp[i-2]`, where we can either decode the last digit alone or as part of a two-digit number.

This problem is an excellent demonstration of how dynamic programming solves counting problems with overlapping subproblems.

### Pattern Summary

This problem exemplifies the **Dynamic Programming - String Decoding** pattern, which is characterized by:
- Linear progression through string
- Considering single and two-character encodings
- Using previous states to compute current state
- Handling edge cases (zeros, bounds)
- Achieving O(n) time complexity

For more details on this pattern and its variations, see the **[Dynamic Programming Pattern](/patterns/dp-1d-basics)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/decode-ways/discuss/) - Community solutions
- [Dynamic Programming - GeeksforGeeks](https://www.geeksforgeeks.org/dynamic-programming/) - Detailed DP explanation
- [String DP Patterns](https://www.geeksforgeeks.org/dp-strings/) - DP for strings
- [Pattern: Dynamic Programming](/patterns/dp-1d-basics) - Comprehensive pattern guide
