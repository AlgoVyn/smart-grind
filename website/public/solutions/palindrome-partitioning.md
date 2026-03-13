# Palindrome Partitioning

## Problem Description

Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of `s`.

A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward. For example, "aba" is a palindrome, while "abc" is not.

This problem requires generating all possible ways to partition a string into palindromic substrings, which is a classic backtracking problem.

**Link to problem:** [Palindrome Partitioning - LeetCode 131](https://leetcode.com/problems/palindrome-partitioning/)

## Examples

**Example 1:**
- Input: `s = "aab"`  
- Output: `[["a","a","b"],["aa","b"]]`

**Explanation:** 
- Partition "aab" into ["a", "a", "b"] - all substrings are palindromes
- Partition "aab" into ["aa", "b"] - all substrings are palindromes

**Example 2:**
- Input: `s = "a"`  
- Output: `[["a"]]`

**Example 3:**
- Input: `s = "abc"`  
- Output: `[["a","b","c"]]`

## Constraints

- `1 <= s.length <= 16`
- `s` contains only lowercase English letters.

---

## Pattern: Backtracking - Partitioning

This problem is a classic example of the **Backtracking - Partitioning** pattern. The pattern involves generating all possible partitions of a string or array based on certain constraints, exploring each possibility through recursion and backtracking.

### Core Concept

The fundamental idea is to explore all possible partitions using backtracking:
- **Recursive Exploration**: Try all possible starting positions and expand
- **Constraint Checking**: Only proceed with partitions where each substring is valid (palindrome)
- **Backtracking**: Undo choices when backtracking to explore other possibilities

---

## Intuition

The key insight for this problem is that we need to explore ALL possible ways to partition the string:

1. **Generate and Test**: For each position, try all possible end positions and check if the substring is a palindrome
2. **Recursive Structure**: If we have a valid palindrome prefix, the rest of the string can be partitioned recursively
3. **Complete Search**: We must explore ALL possibilities since we need ALL valid partitions

### Why Backtracking?

- The problem requires finding ALL valid solutions, not just ONE
- We need to try every possible way to split the string
- Each decision leads to more decisions (exponential possibilities)
- Backtracking allows us to explore all paths and undo choices when needed

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Backtracking with Palindrome Check (Optimal)** - O(n × 2^n) time, O(n) space
2. **Backtracking with DP Preprocessing** - O(n × 2^n) time, O(n²) space

---

## Approach 1: Backtracking with Palindrome Check

This is the optimal approach where we check if a substring is a palindrome on-the-fly during the backtracking process.

### Algorithm Steps

1. Define a helper function to check if a substring is a palindrome
2. Use backtracking to try all possible partitions:
   - Start from index 0
   - For each end position from start to end of string
   - If substring s[start:end] is palindrome, add to path and recurse
   - Backtrack by removing the last added substring
3. When we reach the end of the string, add a copy of the path to results

### Why It Works

The backtracking algorithm systematically explores all possible ways to partition the string. At each position, it tries all possible palindrome substrings and recursively explores further partitions. When it reaches the end, it has found a valid partition.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def partition(self, s: str) -> List[List[str]]:
        """
        Find all palindrome partitioning of string s using backtracking.
        
        Args:
            s: Input string to partition
            
        Returns:
            List of all possible palindrome partitions
        """
        def is_pal(sub):
            """Check if a substring is a palindrome."""
            return sub == sub[::-1]
        
        def backtrack(start, path):
            """Backtrack through all possible partitions."""
            # Base case: reached end of string
            if start == len(s):
                result.append(path[:])
                return
            
            # Try all possible end positions
            for end in range(start + 1, len(s) + 1):
                # Check if current substring is palindrome
                if is_pal(s[start:end]):
                    # Add to current partition
                    path.append(s[start:end])
                    # Recurse with next start position
                    backtrack(end, path)
                    # Backtrack: remove last element
                    path.pop()
        
        result = []
        backtrack(0, [])
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <algorithm>

class Solution {
public:
    vector<vector<string>> partition(string s) {
        /**
         * Find all palindrome partitioning of string s using backtracking.
         * 
         * @param s: Input string to partition
         * @return: List of all possible palindrome partitions
         */
        vector<vector<string>> result;
        vector<string> path;
        backtrack(s, 0, path, result);
        return result;
    }
    
private:
    bool isPalindrome(const string& s, int start, int end) {
        while (start < end) {
            if (s[start] != s[end]) return false;
            start++;
            end--;
        }
        return true;
    }
    
    void backtrack(const string& s, int start, 
                   vector<string>& path, 
                   vector<vector<string>>& result) {
        if (start == s.length()) {
            result.push_back(path);
            return;
        }
        
        for (int end = start; end < s.length(); end++) {
            if (isPalindrome(s, start, end)) {
                path.push_back(s.substr(start, end - start + 1));
                backtrack(s, end + 1, path, result);
                path.pop_back();
            }
        }
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<String>> partition(String s) {
        /**
         * Find all palindrome partitioning of string s using backtracking.
         * 
         * @param s: Input string to partition
         * @return: List of all possible palindrome partitions
         */
        List<List<String>> result = new ArrayList<>();
        List<String> path = new ArrayList<>();
        backtrack(s, 0, path, result);
        return result;
    }
    
    private void backtrack(String s, int start, 
                          List<String> path, 
                          List<List<String>> result) {
        if (start == s.length()) {
            result.add(new ArrayList<>(path));
            return;
        }
        
        for (int end = start; end < s.length(); end++) {
            if (isPalindrome(s, start, end)) {
                path.add(s.substring(start, end + 1));
                backtrack(s, end + 1, path, result);
                path.remove(path.size() - 1);
            }
        }
    }
    
    private boolean isPalindrome(String s, int start, int end) {
        while (start < end) {
            if (s.charAt(start) != s.charAt(end)) {
                return false;
            }
            start++;
            end--;
        }
        return true;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find all palindrome partitioning of string s using backtracking.
 * 
 * @param {string} s - Input string to partition
 * @return {string[][]} - List of all possible palindrome partitions
 */
var partition = function(s) {
    const result = [];
    const path = [];
    
    const isPalindrome = (start, end) => {
        while (start < end) {
            if (s[start] !== s[end]) return false;
            start++;
            end--;
        }
        return true;
    };
    
    const backtrack = (start) => {
        if (start === s.length) {
            result.push([...path]);
            return;
        }
        
        for (let end = start; end < s.length; end++) {
            if (isPalindrome(start, end)) {
                path.push(s.substring(start, end + 1));
                backtrack(end + 1);
                path.pop();
            }
        }
    };
    
    backtrack(0);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × 2^n) - In worst case, there are 2^(n-1) partitions, and checking each palindrome takes O(n) |
| **Space** | O(n) for recursion stack and path storage |

---

## Approach 2: Backtracking with DP Preprocessing

This approach precomputes which substrings are palindromes using dynamic programming, then uses this information during backtracking.

### Algorithm Steps

1. **Preprocessing**: Create a DP table to store whether each substring s[i:j] is a palindrome
2. **Backtracking**: Use the DP table to quickly check if a substring is a palindrome
3. Same backtracking logic as Approach 1

### Why It Works

By precomputing palindromes, we reduce the time complexity of palindrome checking from O(n) to O(1) during backtracking. This can significantly improve performance for longer strings.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def partition_dp(self, s: str) -> List[List[str]]:
        """
        Find all palindrome partitioning using DP preprocessing.
        
        Args:
            s: Input string to partition
            
        Returns:
            List of all possible palindrome partitions
        """
        n = len(s)
        
        # DP table: dp[i][j] = True if s[i:j+1] is palindrome
        dp = [[False] * n for _ in range(n)]
        
        # Fill DP table
        for i in range(n - 1, -1, -1):
            for j in range(i, n):
                if s[i] == s[j] and (j - i <= 2 or dp[i + 1][j - 1]):
                    dp[i][j] = True
        
        def backtrack(start, path):
            if start == n:
                result.append(path[:])
                return
            
            for end in range(start, n):
                if dp[start][end]:
                    path.append(s[start:end + 1])
                    backtrack(end + 1, path)
                    path.pop()
        
        result = []
        backtrack(0, [])
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<string>> partition(string s) {
        int n = s.length();
        
        // DP table: dp[i][j] = True if s[i:j+1] is palindrome
        vector<vector<bool>> dp(n, vector<bool>(n, false));
        
        // Fill DP table
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                if (s[i] == s[j] && (j - i <= 2 || dp[i + 1][j - 1])) {
                    dp[i][j] = true;
                }
            }
        }
        
        vector<vector<string>> result;
        vector<string> path;
        backtrack(s, dp, 0, path, result);
        return result;
    }
    
private:
    void backtrack(const string& s, const vector<vector<bool>>& dp,
                   int start, vector<string>& path,
                   vector<vector<string>>& result) {
        if (start == s.length()) {
            result.push_back(path);
            return;
        }
        
        for (int end = start; end < s.length(); end++) {
            if (dp[start][end]) {
                path.push_back(s.substr(start, end - start + 1));
                backtrack(s, dp, end + 1, path, result);
                path.pop_back();
            }
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<List<String>> partition(String s) {
        int n = s.length();
        
        // DP table: dp[i][j] = True if s[i:j+1] is palindrome
        boolean[][] dp = new boolean[n][n];
        
        // Fill DP table
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                if (s.charAt(i) == s.charAt(j) && (j - i <= 2 || dp[i + 1][j - 1])) {
                    dp[i][j] = true;
                }
            }
        }
        
        List<List<String>> result = new ArrayList<>();
        List<String> path = new ArrayList<>();
        backtrack(s, dp, 0, path, result);
        return result;
    }
    
    private void backtrack(String s, boolean[][] dp, int start,
                          List<String> path, List<List<String>> result) {
        if (start == s.length()) {
            result.add(new ArrayList<>(path));
            return;
        }
        
        for (int end = start; end < s.length(); end++) {
            if (dp[start][end]) {
                path.add(s.substring(start, end + 1));
                backtrack(s, dp, end + 1, path, result);
                path.remove(path.size() - 1);
            }
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Find all palindrome partitioning using DP preprocessing.
 * 
 * @param {string} s - Input string to partition
 * @return {string[][]} - List of all possible palindrome partitions
 */
var partition = function(s) {
    const n = s.length;
    
    // DP table: dp[i][j] = True if s[i:j+1] is palindrome
    const dp = Array.from({ length: n }, () => Array(n).fill(false));
    
    // Fill DP table
    for (let i = n - 1; i >= 0; i--) {
        for (let j = i; j < n; j++) {
            if (s[i] === s[j] && (j - i <= 2 || dp[i + 1][j - 1])) {
                dp[i][j] = true;
            }
        }
    }
    
    const result = [];
    const path = [];
    
    const backtrack = (start) => {
        if (start === n) {
            result.push([...path]);
            return;
        }
        
        for (let end = start; end < n; end++) {
            if (dp[start][end]) {
                path.push(s.substring(start, end + 1));
                backtrack(end + 1);
                path.pop();
            }
        }
    };
    
    backtrack(0);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × 2^n) - Same as Approach 1, but with better constant factor |
| **Space** | O(n²) for DP table + O(n) for recursion stack |

---

## Comparison of Approaches

| Aspect | Approach 1 (On-the-fly) | Approach 2 (DP Preprocessing) |
|--------|-------------------------|-------------------------------|
| **Time Complexity** | O(n × 2^n) | O(n × 2^n) |
| **Space Complexity** | O(n) | O(n²) |
| **Palindrome Check** | O(n) per check | O(1) per check |
| **Implementation** | Simpler | More complex |
| **Best For** | Short strings | Longer strings |

**Best Approach:** Approach 1 is generally preferred due to its simplicity and lower space complexity. Approach 2 can be faster for longer strings due to reduced palindrome checking time.

---

## Why Backtracking is Optimal for This Problem

The backtracking approach is optimal for this problem because:

1. **Complete Search**: We must find ALL valid partitions, not just one
2. **No Overlapping Subproblems**: Each partition path is unique
3. **Exponential Nature**: The problem inherently has exponential solutions
4. **Optimal Substructure**: Valid partitions of the whole = valid prefix + valid suffix partition

The key insight is that we cannot use dynamic programming to find ALL solutions efficiently because the number of solutions itself can be exponential.

---

## Related Problems

Based on similar themes (backtracking, partitioning, palindrome checking):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Palindrome Number | [Link](https://leetcode.com/problems/palindrome-number/) | Check if a number is palindrome |
| Valid Palindrome | [Link](https://leetcode.com/problems/valid-palindrome/) | Check if string is palindrome ignoring non-alphanumeric |
| Reverse String | [Link](https://leetcode.com/problems/reverse-string/) | Reverse string in-place |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Palindrome Partitioning II | [Link](https://leetcode.com/problems/palindrome-partitioning-ii/) | Minimum cuts needed for palindrome partition |
| Palindromic Substrings | [Link](https://leetcode.com/problems/palindromic-substrings/) | Count all palindromic substrings |
| Longest Palindromic Substring | [Link](https://leetcode.com/problems/longest-palindromic-substring/) | Find longest palindromic substring |
| Word Break | [Link](https://leetcode.com/problems/word-break/) | Partition string into dictionary words |

### Pattern Reference

For more detailed explanations of the Backtracking pattern and its variations, see:
- **[Backtracking - Permutations Pattern](/patterns/backtracking-permutations)**
- **[Backtracking - Word Search Pattern](/patterns/backtracking-word-search-path-finding-in-grid)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Backtracking Technique

- [NeetCode - Palindrome Partitioning](https://www.youtube.com/watch?v=REfc5n1k6Gk) - Clear explanation with visual examples
- [Back to Back SWE - Palindrome Partitioning](https://www.youtube.com/watch?v=qZ19 postX1vQ) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Official problem solution

### Palindrome Checking

- [Palindrome Checking Techniques](https://www.youtube.com/watch?v=qZ19 postX1vQ) - Different ways to check palindromes
- [DP for Palindromes](https://www.youtube.com/watch?v=qZ19 postX1vQ) - Dynamic programming approach

---

## Follow-up Questions

### Q1: What is the time complexity of generating all partitions?

**Answer:** The worst-case time complexity is O(n × 2^n), where n is the length of the string. This is because there are at most 2^(n-1) possible partitions, and checking each palindrome substring takes O(n) time in Approach 1.

---

### Q2: How would you modify to find the minimum number of cuts?

**Answer:** This is the problem "Palindrome Partitioning II". You would use dynamic programming where dp[i] represents the minimum cuts needed for s[0:i+1]. The recurrence is: dp[i] = 0 if s[0:i+1] is palindrome, else min(dp[j] + 1) for all j < i where s[j+1:i+1] is palindrome.

---

### Q3: How would you find only unique partitions (no duplicates)?

**Answer:** Use a set to track unique partitions. However, since each partition is a list of strings, you'd need to convert each partition to a tuple (which is hashable) before adding to the set. Alternatively, ensure you don't generate duplicates by skipping certain branches during backtracking.

---

### Q4: What if we need to partition into a specific number of parts?

**Answer:** Add a parameter to track the number of parts used. Only add to result when we reach the end AND have exactly the required number of parts. If we exceed the required parts before reaching the end, prune that branch.

---

### Q5: How would you handle Unicode characters?

**Answer:** The solution naturally handles Unicode since it operates on characters. However, the palindrome check might need adjustment depending on what constitutes a "character" in your definition (code points vs. grapheme clusters).

---

### Q6: What edge cases should be tested?

**Answer:**
- Empty string (should return empty partition)
- Single character (should return that character)
- All same characters (e.g., "aaa" - many partitions)
- All different characters (e.g., "abc" - only one partition)
- String with spaces or special characters
- Very long string (performance test)

---

### Q7: Can we use iterative approach instead of recursive?

**Answer:** Yes, but it's more complex. You would need to manually manage a stack to track the current path and position. The recursive approach is more intuitive and cleaner for this type of problem.

---

### Q8: How would you optimize for space complexity?

**Answer:** Approach 1 already uses O(n) space for the recursion stack. To reduce further, you could use iterative deepening or convert to an iterative approach with explicit stack management.

---

## Common Pitfalls

### 1. Not Making a Copy of Path
**Issue:** Adding the path directly to results without copying leads to modifications later.

**Solution:** Always append a copy: `result.append(path[:])` in Python, `result.push_back(path)` in C++ after copying.

### 2. String Slicing Performance
**Issue:** Using `s[start:end]` repeatedly creates new strings.

**Solution:** Pass indices instead of creating substrings when possible, or use string views in C++.

### 3. Not Handling Empty String
**Issue:** For empty input, the algorithm should return empty result.

**Solution:** Add early return for empty string case.

### 4. Off-by-One Errors
**Issue:** Incorrect range in loops causing missing or extra characters.

**Solution:** Carefully trace through with small examples.

---

## Summary

The **Palindrome Partitioning** problem demonstrates the power of backtracking for generating all possible solutions:

- **Backtracking approach**: Systematically explores all partitions
- **Two implementations**: On-the-fly palindrome checking and DP preprocessing
- **Time complexity**: O(n × 2^n) in worst case
- **Space complexity**: O(n) or O(n²) depending on approach

The key insight is that backtracking is necessary because we need ALL valid partitions, and the problem inherently has exponential number of solutions. This problem is an excellent demonstration of when backtracking is the appropriate algorithmic strategy.

### Pattern Summary

This problem exemplifies the **Backtracking - Partitioning** pattern, which is characterized by:
- Generating all possible partitions based on constraints
- Using recursion to explore all possibilities
- Backtracking to undo choices
- Checking validity at each step
- Time complexity exponential in nature

For more details on this pattern and its variations, see the **[Backtracking - Word Search Pattern](/patterns/backtracking-word-search-path-finding-in-grid)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/palindrome-partitioning/discuss/) - Community solutions and explanations
- [Backtracking - GeeksforGeeks](https://www.geeksforgeeks.org/backtracking-algorithms/) - Detailed explanation
- [Palindrome Algorithms - Wikipedia](https://en.wikipedia.org/wiki/Palindrome) - Learn about palindromes
- [Pattern: Backtracking - Permutations](/patterns/backtracking-permutations) - Comprehensive pattern guide
