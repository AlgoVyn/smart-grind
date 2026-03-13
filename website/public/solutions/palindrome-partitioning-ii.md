# Palindrome Partitioning II

## LeetCode Link

[Palindrome Partitioning II - LeetCode](https://leetcode.com/problems/palindrome-partitioning-ii/)

---

## Problem Description

Given a string `s`, partition `s` such that every substring of the partition is a palindrome.
Return the minimum cuts needed for a palindrome partitioning of `s`.

---

## Examples

### Example 1

**Input:**
```python
s = "aab"
```

**Output:**
```python
1
```

**Explanation:**
The palindrome partitioning `["aa","b"]` could be produced using 1 cut.

### Example 2

**Input:**
```python
s = "a"
```

**Output:**
```python
0
```

**Explanation:**
A single character is already a palindrome, no cuts needed.

### Example 3

**Input:**
```python
s = "ab"
```

**Output:**
```python
1
```

**Explanation:**
Need one cut: ["a", "b"]

---

## Constraints

- `1 <= s.length <= 2000`
- `s` consists of lowercase English letters only.

---

## Pattern: Dynamic Programming on Strings

This problem uses **DP** with two stages: 
1. Precompute all palindromic substrings using DP table
2. DP for minimum cuts

---

## Intuition

The key insight for this problem is breaking it into two subproblems:
1. Finding all palindromic substrings efficiently
2. Using those results to find minimum cuts

### Key Observations

1. **Two-Stage DP**: First find all palindromes, then use that to compute minimum cuts.

2. **Palindrome DP**: A substring s[i:j] is palindrome if:
   - s[i] == s[j] AND
   - The substring between them is palindrome (or length ≤ 2)

3. **Cuts DP**: dp[i] = minimum cuts for s[0:i]
   - If s[0:i] is palindrome: dp[i] = 0
   - Otherwise: dp[i] = 1 + min(dp[j]) for all j < i where s[j:i] is palindrome

4. **Cuts vs Partitions**: Number of cuts = number of partitions - 1

### Algorithm Overview

1. **Precompute palindromes**: Build is_pal[i][j] table
2. **Compute min cuts**: For each position, find minimum cuts needed
3. **Return result**: dp[n] - 1

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Standard DP** - O(n²) time, O(n²) space
2. **Space-Optimized DP** - O(n²) time, O(n) space

---

## Approach 1: Standard Dynamic Programming

### Algorithm Steps

1. Create 2D `is_pal` table to mark palindromic substrings
2. Fill table by increasing substring length
3. Build dp array for minimum cuts
4. Return dp[n] - 1

### Why It Works

The approach works because we first precompute all palindrome information, then use it to make optimal cutting decisions. The DP ensures we find the minimum cuts by considering all valid partitions.

### Code Implementation

````carousel
```python
class Solution:
    def minCut(self, s: str) -> int:
        """
        Find minimum cuts for palindrome partitioning.
        
        Args:
            s: Input string
            
        Returns:
            Minimum number of cuts
        """
        n = len(s)
        
        # is_pal[i][j] = True if s[i:j+1] is palindrome
        is_pal = [[False] * n for _ in range(n)]
        
        # Precompute palindromes: fill by increasing length
        # Length 1: single characters
        for i in range(n):
            is_pal[i][i] = True
        
        # Length 2: two same characters
        for i in range(n - 1):
            if s[i] == s[i + 1]:
                is_pal[i][i + 1] = True
        
        # Length >= 3
        for length in range(3, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                if s[i] == s[j] and is_pal[i + 1][j - 1]:
                    is_pal[i][j] = True
        
        # dp[i] = minimum cuts for s[0:i]
        dp = [float('inf')] * (n + 1)
        dp[0] = 0  # Empty string needs 0 cuts
        
        for i in range(1, n + 1):
            # If s[0:i] is palindrome, no cut needed
            if is_pal[0][i - 1]:
                dp[i] = 0
            else:
                # Try all possible last cut positions
                for j in range(1, i):
                    if is_pal[j][i - 1]:
                        dp[i] = min(dp[i], dp[j] + 1)
        
        return dp[n]
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minCut(string s) {
        int n = s.length();
        
        // is_pal[i][j] = True if s[i:j+1] is palindrome
        vector<vector<bool>> is_pal(n, vector<bool>(n, false));
        
        // Length 1: single characters
        for (int i = 0; i < n; i++) {
            is_pal[i][i] = true;
        }
        
        // Length 2: two same characters
        for (int i = 0; i < n - 1; i++) {
            if (s[i] == s[i + 1]) {
                is_pal[i][i + 1] = true;
            }
        }
        
        // Length >= 3
        for (int length = 3; length <= n; length++) {
            for (int i = 0; i + length <= n; i++) {
                int j = i + length - 1;
                if (s[i] == s[j] && is_pal[i + 1][j - 1]) {
                    is_pal[i][j] = true;
                }
            }
        }
        
        // dp[i] = minimum cuts for s[0:i]
        vector<int> dp(n + 1, INT_MAX);
        dp[0] = 0;
        
        for (int i = 1; i <= n; i++) {
            if (is_pal[0][i - 1]) {
                dp[i] = 0;
            } else {
                for (int j = 1; j < i; j++) {
                    if (is_pal[j][i - 1]) {
                        dp[i] = min(dp[i], dp[j] + 1);
                    }
                }
            }
        }
        
        return dp[n];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minCut(String s) {
        int n = s.length();
        
        // is_pal[i][j] = True if s[i:j+1] is palindrome
        boolean[][] is_pal = new boolean[n][n];
        
        // Length 1: single characters
        for (int i = 0; i < n; i++) {
            is_pal[i][i] = true;
        }
        
        // Length 2: two same characters
        for (int i = 0; i < n - 1; i++) {
            if (s.charAt(i) == s.charAt(i + 1)) {
                is_pal[i][i + 1] = true;
            }
        }
        
        // Length >= 3
        for (int length = 3; length <= n; length++) {
            for (int i = 0; i + length <= n; i++) {
                int j = i + length - 1;
                if (s.charAt(i) == s.charAt(j) && is_pal[i + 1][j - 1]) {
                    is_pal[i][j] = true;
                }
            }
        }
        
        // dp[i] = minimum cuts for s[0:i]
        int[] dp = new int[n + 1];
        for (int i = 0; i <= n; i++) {
            dp[i] = Integer.MAX_VALUE;
        }
        dp[0] = 0;
        
        for (int i = 1; i <= n; i++) {
            if (is_pal[0][i - 1]) {
                dp[i] = 0;
            } else {
                for (int j = 1; j < i; j++) {
                    if (is_pal[j][i - 1]) {
                        dp[i] = Math.min(dp[i], dp[j] + 1);
                    }
                }
            }
        }
        
        return dp[n];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {number}
 */
var minCut = function(s) {
    const n = s.length;
    
    // is_pal[i][j] = True if s[i:j+1] is palindrome
    const is_pal = Array.from({ length: n }, () => Array(n).fill(false));
    
    // Length 1: single characters
    for (let i = 0; i < n; i++) {
        is_pal[i][i] = true;
    }
    
    // Length 2: two same characters
    for (let i = 0; i < n - 1; i++) {
        if (s[i] === s[i + 1]) {
            is_pal[i][i + 1] = true;
        }
    }
    
    // Length >= 3
    for (let length = 3; length <= n; length++) {
        for (let i = 0; i + length <= n; i++) {
            const j = i + length - 1;
            if (s[i] === s[j] && is_pal[i + 1][j - 1]) {
                is_pal[i][j] = true;
            }
        }
    }
    
    // dp[i] = minimum cuts for s[0:i]
    const dp = new Array(n + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i <= n; i++) {
        if (is_pal[0][i - 1]) {
            dp[i] = 0;
        } else {
            for (let j = 1; j < i; j++) {
                if (is_pal[j][i - 1]) {
                    dp[i] = Math.min(dp[i], dp[j] + 1);
                }
            }
        }
    }
    
    return dp[n];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Both palindrome and cut DP |
| **Space** | O(n²) - is_pal matrix |

---

## Approach 2: Space-Optimized DP

### Algorithm Steps

1. Compute palindromes on-the-fly while computing dp
2. Use O(n) space by computing palindrome check inline

### Why It Works

Instead of storing all palindrome information, we can check palindromes while computing dp. This reduces space but keeps the same time complexity.

### Code Implementation

````carousel
```python
class Solution:
    def minCut(self, s: str) -> int:
        """
        Space-optimized approach.
        """
        n = len(s)
        dp = list(range(n))  # dp[i] = min cuts for s[0:i+1]
        
        for i in range(n):
            # Check odd-length palindrons centered at i
            self._check_palindrome(s, i, i, dp, i)
            # Check even-length palindrons centered at i, i+1
            self._check_palindrome(s, i, i + 1, dp, i)
        
        return dp[n - 1]
    
    def _check_palindrome(self, s, left, right, dp, i):
        """Check palindromes ending at position i."""
        n = len(s)
        while left >= 0 and right < n and s[left] == s[right]:
            if left == 0:
                dp[i] = 0
            else:
                dp[i] = min(dp[i], dp[left - 1] + 1)
            left -= 1
            right += 1
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minCut(string s) {
        int n = s.length();
        vector<int> dp(n);
        for (int i = 0; i < n; i++) {
            dp[i] = i;  // Maximum cuts = i
        }
        
        for (int i = 0; i < n; i++) {
            checkPalindrome(s, i, i, dp, i);      // Odd
            checkPalindrome(s, i, i + 1, dp, i);   // Even
        }
        
        return dp[n - 1];
    }
    
private:
    void checkPalindrome(string& s, int left, int right, vector<int>& dp, int i) {
        int n = s.length();
        while (left >= 0 && right < n && s[left] == s[right]) {
            if (left == 0) {
                dp[i] = 0;
            } else {
                dp[i] = min(dp[i], dp[left - 1] + 1);
            }
            left--;
            right++;
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minCut(String s) {
        int n = s.length();
        int[] dp = new int[n];
        for (int i = 0; i < n; i++) {
            dp[i] = i;
        }
        
        for (int i = 0; i < n; i++) {
            checkPalindrome(s, i, i, dp, i);
            checkPalindrome(s, i, i + 1, dp, i);
        }
        
        return dp[n - 1];
    }
    
    private void checkPalindrome(String s, int left, int right, int[] dp, int i) {
        int n = s.length();
        while (left >= 0 && right < n && s.charAt(left) == s.charAt(right)) {
            if (left == 0) {
                dp[i] = 0;
            } else {
                dp[i] = Math.min(dp[i], dp[left - 1] + 1);
            }
            left--;
            right++;
        }
    }
}
```

<!-- slide -->
```javascript
var minCut = function(s) {
    const n = s.length();
    const dp = new Array(n);
    for (let i = 0; i < n; i++) {
        dp[i] = i;
    }
    
    const checkPalindrome = (left, right, i) => {
        while (left >= 0 && right < n && s[left] === s[right]) {
            if (left === 0) {
                dp[i] = 0;
            } else {
                dp[i] = Math.min(dp[i], dp[left - 1] + 1);
            }
            left--;
            right++;
        }
    };
    
    for (let i = 0; i < n; i++) {
        checkPalindrome(i, i, i);
        checkPalindrome(i, i + 1, i);
    }
    
    return dp[n - 1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Same as standard approach |
| **Space** | O(n) - Only dp array |

---

## Comparison of Approaches

| Aspect | Approach 1 (Standard) | Approach 2 (Space-Optimized) |
|--------|----------------------|------------------------------|
| **Time Complexity** | O(n²) | O(n²) |
| **Space Complexity** | O(n²) | O(n) |
| **Implementation** | Simple | Moderate |
| **LeetCode Optimal** | ✅ | ✅ |

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Meta, Amazon
- **Difficulty**: Hard
- **Concepts Tested**: Dynamic Programming, String Manipulation

### Learning Outcomes

1. **Two-Stage DP**: Master combining two DP solutions
2. **Palindrome Check**: Efficient palindrome preprocessing
3. **Space Optimization**: Reduce space complexity

---

## Related Problems

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Palindrome Partitioning | [Link](https://leetcode.com/problems/palindrome-partitioning/) | Find all partitions |
| Longest Palindromic Substring | [Link](https://leetcode.com/problems/longest-palindromic-substring/) | Related |
| Minimum Insertions | [Link](https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/) | Similar DP |
| Valid Palindrome II | [Link](https://leetcode.com/problems/valid-palindrome-ii/) | Related |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Palindrome Partitioning II](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Clear explanation
2. **[DP on Strings](https://www.youtube.com/watch?v=8grsX-cB0jU)** - String DP patterns

---

## Follow-up Questions

### Q1: How would you reconstruct the actual partitions?

**Answer:** Maintain a separate array to track where cuts are made, then backtrack to reconstruct partitions.

---

### Q2: Can this be solved using DFS + memoization?

**Answer:** Yes, but it would be less efficient. The DP approach is optimal.

---

### Q3: What if we wanted maximum cuts instead of minimum?

**Answer:** That would be n - 1 (cut between every character).

---

### Q4: How does this relate to Palindrome Partitioning I?

**Answer:** Problem I asks for ALL valid partitions; this problem asks for MINIMUM cuts.

---

## Common Pitfalls

### 1. Return Value
**Issue**: dp[n] - 1, not dp[n] (cuts = partitions - 1).

**Solution**: In the optimized approach, dp[i] stores cuts directly.

### 2. Palindrome DP Order
**Issue**: Fill table by increasing length to ensure subproblems are solved first.

**Solution**: Process lengths from 1 to n.

### 3. Base Case
**Issue**: Single character is always palindrome, length 2 needs s[i] == s[i+1].

**Solution**: Handle these cases explicitly.

---

## Summary

The **Palindrome Partitioning II** problem demonstrates **Two-Stage Dynamic Programming** on strings.

Key takeaways:
1. Precompute all palindromes using DP
2. Use palindrome info to compute minimum cuts
3. dp[i] = minimum cuts for s[0:i]
4. Can optimize space from O(n²) to O(n)

This problem is essential for understanding string DP and palindrome problems.

### Pattern Summary

This problem exemplifies the **String DP with Preprocessing** pattern:
- First stage: compute auxiliary information
- Second stage: use it for main problem

---

## Additional Resources

- [LeetCode Problem 132](https://leetcode.com/problems/palindrome-partitioning-ii/) - Official problem page
- [DP on Strings - GeeksforGeeks](https://www.geeksforgeeks.org/dynamic-programming/) - Detailed explanation
- [Pattern: Dynamic Programming](/patterns/dynamic-programming) - Comprehensive guide
