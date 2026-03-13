# Palindromic Substrings

## Problem Description

Given a string `s`, return the number of palindromic substrings in it.

A string is a palindrome when it reads the same backward as forward.
A substring is a contiguous sequence of characters within the string.

**LeetCode Link:** [LeetCode 647 - Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/)

---

## Examples

### Example 1

**Input:** `s = "abc"`  
**Output:** `3`

**Explanation:** Three palindromic strings: "a", "b", "c".

### Example 2

**Input:** `s = "aaa"`  
**Output:** `6`

**Explanation:** Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".

---

## Constraints

- `1 <= s.length <= 1000`
- `s` consists of lowercase English letters.

---

## Pattern: Expand Around Center

This problem uses the **Expand Around Center** technique. Each palindrome has a center, and we expand outward checking for matches.

---

## Intuition

The key insight for this problem is understanding that every palindrome has a "center" from which it expands outward. 

### Key Observations

1. **Two Types of Centers**: 
   - Odd-length palindromes have a single character center (e.g., "aba" has center at 'b')
   - Even-length palindromes have a center between two characters (e.g., "abba" has center between the two 'b's)

2. **Expand Symmetrically**: From each center, expand left and right simultaneously. If characters match, it's a palindrome.

3. **Count All Centers**: There are n centers for odd-length and (n-1) centers for even-length, totaling 2n-1 centers.

4. **Why O(n²) is Optimal**: We must check each possible center, and each expansion can go up to O(n), so O(n²) is the best we can do.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Expand Around Center** - Optimal solution
2. **Dynamic Programming** - Alternative approach
3. **Manacher's Algorithm** - Advanced O(n) solution

---

## Approach 1: Expand Around Center (Optimal)

### Algorithm Steps

1. Initialize count to 0
2. For each position i in the string:
   - Expand around center i for odd-length palindromes
   - Expand around center between i and i+1 for even-length palindromes
3. Return total count

### Why It Works

Every palindrome has a center. By checking all possible centers and expanding outward, we count all palindromic substrings.

### Code Implementation

````carousel
```python
class Solution:
    def countSubstrings(self, s: str) -> int:
        """
        Count palindromic substrings using expand around center.
        
        Time: O(n^2), Space: O(1)
        """
        count = 0
        n = len(s)
        
        for i in range(n):
            # Odd-length palindromes (center at i)
            count += self.expandAroundCenter(s, i, i)
            
            # Even-length palindromes (center between i and i+1)
            count += self.expandAroundCenter(s, i, i + 1)
        
        return count
    
    def expandAroundCenter(self, s: str, left: int, right: int) -> int:
        """Expand around center and count palindromes."""
        count = 0
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
        return count
```

<!-- slide -->
```cpp
#include <string>
using namespace std;

class Solution {
public:
    int countSubstrings(string s) {
        int count = 0;
        int n = s.length();
        
        for (int i = 0; i < n; i++) {
            // Odd-length palindromes (center at i)
            count += expandAroundCenter(s, i, i);
            
            // Even-length palindromes (center between i and i+1)
            count += expandAroundCenter(s, i, i + 1);
        }
        
        return count;
    }
    
private:
    int expandAroundCenter(const string& s, int left, int right) {
        int count = 0;
        while (left >= 0 && right < s.length() && s[left] == s[right]) {
            count++;
            left--;
            right++;
        }
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int countSubstrings(String s) {
        int count = 0;
        int n = s.length();
        
        for (int i = 0; i < n; i++) {
            // Odd-length palindromes (center at i)
            count += expandAroundCenter(s, i, i);
            
            // Even-length palindromes (center between i and i+1)
            count += expandAroundCenter(s, i, i + 1);
        }
        
        return count;
    }
    
    private int expandAroundCenter(String s, int left, int right) {
        int count = 0;
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            count++;
            left--;
            right++;
        }
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {number}
 */
var countSubstrings = function(s) {
    let count = 0;
    const n = s.length;
    
    for (let i = 0; i < n; i++) {
        // Odd-length palindromes (center at i)
        count += expandAroundCenter(s, i, i);
        
        // Even-length palindromes (center between i and i+1)
        count += expandAroundCenter(s, i, i + 1);
    }
    
    return count;
};

function expandAroundCenter(s, left, right) {
    let count = 0;
    while (left >= 0 && right < s.length && s[left] === s[right]) {
        count++;
        left--;
        right++;
    }
    return count;
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²), expanding around each of 2n-1 centers |
| **Space** | O(1), only counter variable |

---

## Approach 2: Dynamic Programming

### Algorithm Steps

1. Create DP table dp[i][j] = true if s[i..j] is palindrome
2. Base case: single chars are palindromes
3. Recursive case: s[i..j] is palindrome if s[i] == s[j] and (j-i<=2 or dp[i+1][j-1])
4. Count all true entries

### Why It Works

Dynamic programming builds up solutions to subproblems. We determine if a substring is a palindrome by checking its endpoints and the inner substring.

### Code Implementation

````carousel
```python
class Solution:
    def countSubstrings_dp(self, s: str) -> int:
        """
        Count using dynamic programming.
        
        Time: O(n^2), Space: O(n^2)
        """
        n = len(s)
        dp = [[False] * n for _ in range(n)]
        count = 0
        
        # All substrings of length 1
        for i in range(n):
            dp[i][i] = True
            count += 1
        
        # Check substrings of length 2 and more
        for length in range(2, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                
                if length == 2:
                    dp[i][j] = (s[i] == s[j])
                else:
                    dp[i][j] = (s[i] == s[j]) and dp[i + 1][j - 1]
                
                if dp[i][j]:
                    count += 1
        
        return count
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    int countSubstrings(string s) {
        int n = s.length();
        vector<vector<bool>> dp(n, vector<bool>(n, false));
        int count = 0;
        
        // All substrings of length 1
        for (int i = 0; i < n; i++) {
            dp[i][i] = true;
            count++;
        }
        
        // Check substrings of length 2 and more
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i + len <= n; i++) {
                int j = i + len - 1;
                
                if (len == 2) {
                    dp[i][j] = (s[i] == s[j]);
                } else {
                    dp[i][j] = (s[i] == s[j]) && dp[i + 1][j - 1];
                }
                
                if (dp[i][j]) count++;
            }
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int countSubstrings(String s) {
        int n = s.length();
        boolean[][] dp = new boolean[n][n];
        int count = 0;
        
        // All substrings of length 1
        for (int i = 0; i < n; i++) {
            dp[i][i] = true;
            count++;
        }
        
        // Check substrings of length 2 and more
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i + len <= n; i++) {
                int j = i + len - 1;
                
                if (len == 2) {
                    dp[i][j] = (s.charAt(i) == s.charAt(j));
                } else {
                    dp[i][j] = (s.charAt(i) == s.charAt(j)) && dp[i + 1][j - 1];
                }
                
                if (dp[i][j]) count++;
            }
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {number}
 */
var countSubstrings = function(s) {
    const n = s.length;
    const dp = Array.from({ length: n }, () => Array(n).fill(false));
    let count = 0;
    
    // All substrings of length 1
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
        count++;
    }
    
    // Check substrings of length 2 and more
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i + len <= n; i++) {
            const j = i + len - 1;
            
            if (len === 2) {
                dp[i][j] = (s[i] === s[j]);
            } else {
                dp[i][j] = (s[i] === s[j]) && dp[i + 1][j - 1];
            }
            
            if (dp[i][j]) count++;
        }
    }
    
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²), filling DP table |
| **Space** | O(n²), DP table |

---

## Comparison of Approaches

| Aspect | Expand Around Center | DP | Manacher's |
|--------|---------------------|-----|------------|
| **Time Complexity** | O(n²) | O(n²) | O(n) |
| **Space Complexity** | O(1) | O(n²) | O(n) |
| **LeetCode Optimal** | ✅ | ❌ | ❌ (overkill) |

**Best Approach:** Use Approach 1 (Expand Around Center) for optimal balance of simplicity and efficiency.

---

## Common Pitfalls

- **Two center types**: Must check both odd-length (single char center) and even-length (between chars) centers
- **Boundary conditions**: Always check left >= 0 and right < len(s) before accessing
- **Order of expansion**: Expand odd then even for each position
- **Off-by-one**: Remember there are n odd centers and n-1 even centers

---

## Related Problems

Based on similar themes (Palindrome, String Manipulation):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Longest Palindromic Substring | [Link](https://leetcode.com/problems/longest-palindromic-substring/) | Find longest palindrome |
| Palindromic Substrings | [Link](https://leetcode.com/problems/palindromic-substrings/) | Count all palindromes |
| Valid Palindrome | [Link](https://leetcode.com/problems/valid-palindrome/) | Check entire string |
| Palindrome Partitioning | [Link](https://leetcode.com/problems/palindrome-partitioning/) | Partition into palindromes |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode - Palindromic Substrings](https://www.youtube.com/watch?v=D73C9Vd2zHM)** - Clear explanation with visual examples
2. **[Expand Around Center](https://www.youtube.com/watch?v=U4HN-kg0e2s)** - Understanding the technique
3. **[LeetCode 647 - Solution Walkthrough](https://www.youtube.com/watch?v=j3QZ50fdLZQ)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you modify to find the longest palindromic substring instead?

**Answer:** Track the starting index and length of the longest palindrome while expanding. When you find a longer palindrome, update these values.

---

### Q2: What if you needed to return all palindromic substrings?

**Answer:** Instead of just counting, collect the substrings during expansion. Store s[left+1:right] each time you find a palindrome.

---

### Q3: Can you solve this in O(n) time?

**Answer:** Yes, using Manacher's algorithm, which finds longest palindromes in linear time. However, it's complex and usually unnecessary for this problem.

---

### Q4: Why is expand around center O(n²) and not O(n)?

**Answer:** Each center can expand up to O(n) characters. With 2n-1 centers, worst case is O(n²). We must check all possible centers to guarantee finding all palindromes.

---

### Q5: What's the maximum number of palindromic substrings a string can have?

**Answer:** For a string of length n with all same characters (e.g., "aaaaa"), the number is n*(n+1)/2. For "aaa", it's 6 (a, a, a, aa, aa, aaa).

---

## Summary

The **Palindromic Substrings** problem demonstrates the **Expand Around Center** technique for finding palindromes efficiently.

Key takeaways:
1. Every palindrome has a center - either a character or between characters
2. Expand outward from each center, counting matches
3. Check both odd and even length centers
4. Time complexity O(n²) is optimal for this problem

This problem is essential for understanding palindrome-related string problems.

### Pattern Summary

This problem exemplifies the **Expand Around Center** pattern, characterized by:
- Using character centers for palindrome detection
- Symmetric expansion in both directions
- O(n²) time complexity
- O(1) space complexity

For more details on this pattern and its variations, see the **[Expand Around Center Pattern](/patterns/expand-around-center)**.
