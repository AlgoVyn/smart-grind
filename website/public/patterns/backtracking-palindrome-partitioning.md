# Backtracking - Palindrome Partitioning

## Problem Description

The Backtracking - Palindrome Partitioning pattern partitions a given string into substrings where each substring is a palindrome. It uses backtracking to try different partition points, checking if each segment is a palindrome before proceeding. This pattern is useful for problems requiring decomposition of strings into meaningful palindromic components, systematically exploring all valid partitions with efficient pruning when non-palindromic segments are encountered.

### Key Characteristics
| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(2^n × n) - each position can be a partition point, palindrome check is O(n) |
| Space Complexity | O(n) for recursion stack, O(2^n × n) for storing all partitions |
| Input | A string to be partitioned |
| Output | All possible palindrome partitions of the string |
| Approach | DFS with backtracking and palindrome validation |

### When to Use
- Partitioning strings where each part must satisfy a property (palindrome)
- Problems requiring decomposition of strings into valid segments
- Finding all possible ways to split a string with constraints
- String segmentation problems with validation requirements
- Problems where you need to enumerate all valid decompositions
- When early pruning is possible based on segment validity

## Intuition

The key insight is to try ending a palindrome at every possible position from the current start, recurse on the remaining string, and backtrack to try alternative partitions.

The "aha!" moments:
1. **Partition points**: Try every possible end position for the next palindrome substring
2. **Palindrome check**: Verify if the substring from start to end is a palindrome before recursing
3. **Recursion on remainder**: After adding a valid palindrome, recurse on the remaining suffix
4. **Backtracking**: Remove the last added substring to try alternative partitions
5. **Base case**: When start index reaches string length, a valid partition is complete

## Solution Approaches

### Approach 1: Standard Backtracking with Palindrome Check (Optimal) ✅ Recommended

#### Algorithm
1. Define recursive helper with `start` index and `current` partition list
2. Base case: if `start == len(s)`, add copy of current partition to results
3. Iterate `end` from `start + 1` to `len(s)`:
   - Extract substring `s[start:end]`
   - If substring is palindrome:
     - Add to current partition
     - Recurse with `end` as new start
     - Backtrack: remove last added substring
4. Return all collected partitions

#### Implementation

````carousel
```python
def partition(s):
    """
    Partition string into all possible palindrome substrings.
    LeetCode 131 - Palindrome Partitioning
    
    Time: O(2^n × n), Space: O(n) for recursion
    """
    def backtrack(start, current):
        # Base case: reached the end of the string
        if start == len(s):
            result.append(current[:])  # Add a copy
            return
        
        # Try all possible end positions for the next palindrome
        for end in range(start + 1, len(s) + 1):
            substring = s[start:end]
            if is_palindrome(substring):
                current.append(substring)
                backtrack(end, current)
                current.pop()  # Backtrack
    
    def is_palindrome(sub):
        return sub == sub[::-1]
    
    result = []
    backtrack(0, [])
    return result
```
<!-- slide -->
```cpp
#include <vector>
#include <string>

class Solution {
public:
    std::vector<std::vector<std::string>> partition(std::string s) {
        std::vector<std::vector<std::string>> result;
        std::vector<std::string> current;
        backtrack(s, 0, current, result);
        return result;
    }
    
private:
    void backtrack(const std::string& s, int start, 
                   std::vector<std::string>& current,
                   std::vector<std::vector<std::string>>& result) {
        // Base case: reached the end
        if (start == s.length()) {
            result.push_back(current);
            return;
        }
        
        // Try all possible end positions
        for (int end = start + 1; end <= s.length(); end++) {
            std::string substring = s.substr(start, end - start);
            if (isPalindrome(substring)) {
                current.push_back(substring);
                backtrack(s, end, current, result);
                current.pop_back();  // Backtrack
            }
        }
    }
    
    bool isPalindrome(const std::string& sub) {
        int left = 0, right = sub.length() - 1;
        while (left < right) {
            if (sub[left++] != sub[right--]) return false;
        }
        return true;
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<List<String>> partition(String s) {
        List<List<String>> result = new ArrayList<>();
        List<String> current = new ArrayList<>();
        backtrack(s, 0, current, result);
        return result;
    }
    
    private void backtrack(String s, int start, 
                          List<String> current, List<List<String>> result) {
        // Base case: reached the end
        if (start == s.length()) {
            result.add(new ArrayList<>(current));
            return;
        }
        
        // Try all possible end positions
        for (int end = start + 1; end <= s.length(); end++) {
            String substring = s.substring(start, end);
            if (isPalindrome(substring)) {
                current.add(substring);
                backtrack(s, end, current, result);
                current.remove(current.size() - 1);  // Backtrack
            }
        }
    }
    
    private boolean isPalindrome(String sub) {
        int left = 0, right = sub.length() - 1;
        while (left < right) {
            if (sub.charAt(left++) != sub.charAt(right--)) return false;
        }
        return true;
    }
}
```
<!-- slide -->
```javascript
function partition(s) {
    const result = [];
    
    function backtrack(start, current) {
        // Base case: reached the end
        if (start === s.length) {
            result.push([...current]);
            return;
        }
        
        // Try all possible end positions
        for (let end = start + 1; end <= s.length; end++) {
            const substring = s.slice(start, end);
            if (isPalindrome(substring)) {
                current.push(substring);
                backtrack(end, current);
                current.pop();  // Backtrack
            }
        }
    }
    
    function isPalindrome(sub) {
        let left = 0, right = sub.length - 1;
        while (left < right) {
            if (sub[left++] !== sub[right--]) return false;
        }
        return true;
    }
    
    backtrack(0, []);
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(2^n × n) - each position can be a partition point, palindrome check O(n) |
| Space | O(n) for recursion stack |

### Approach 2: Precompute Palindrome DP (Optimized)

Precompute a DP table to check if any substring is a palindrome in O(1) time, trading space for time.

#### Implementation

````carousel
```python
def partition_optimized(s):
    """
    Optimized version using DP table for palindrome checks.
    Reduces repeated palindrome computations.
    """
    n = len(s)
    # dp[i][j] = True if s[i:j+1] is palindrome
    dp = [[False] * n for _ in range(n)]
    
    # Fill DP table
    for i in range(n - 1, -1, -1):
        for j in range(i, n):
            if s[i] == s[j] and (j - i <= 2 or dp[i + 1][j - 1]):
                dp[i][j] = True
    
    def backtrack(start, current):
        if start == n:
            result.append(current[:])
            return
        
        for end in range(start, n):
            if dp[start][end]:  # O(1) palindrome check
                current.append(s[start:end + 1])
                backtrack(end + 1, current)
                current.pop()
    
    result = []
    backtrack(0, [])
    return result
```
<!-- slide -->
```cpp
class Solution {
public:
    std::vector<std::vector<std::string>> partition(std::string s) {
        int n = s.length();
        // dp[i][j] = true if s[i..j] is palindrome
        std::vector<std::vector<bool>> dp(n, std::vector<bool>(n, false));
        
        // Fill DP table
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                if (s[i] == s[j] && (j - i <= 2 || dp[i + 1][j - 1])) {
                    dp[i][j] = true;
                }
            }
        }
        
        std::vector<std::vector<std::string>> result;
        std::vector<std::string> current;
        backtrack(s, 0, current, result, dp);
        return result;
    }
    
private:
    void backtrack(const std::string& s, int start,
                   std::vector<std::string>& current,
                   std::vector<std::vector<std::string>>& result,
                   const std::vector<std::vector<bool>>& dp) {
        if (start == s.length()) {
            result.push_back(current);
            return;
        }
        
        for (int end = start; end < s.length(); end++) {
            if (dp[start][end]) {
                current.push_back(s.substr(start, end - start + 1));
                backtrack(s, end + 1, current, result, dp);
                current.pop_back();
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
        // dp[i][j] = true if s[i..j] is palindrome
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
        List<String> current = new ArrayList<>();
        backtrack(s, 0, current, result, dp);
        return result;
    }
    
    private void backtrack(String s, int start, List<String> current,
                          List<List<String>> result, boolean[][] dp) {
        if (start == s.length()) {
            result.add(new ArrayList<>(current));
            return;
        }
        
        for (int end = start; end < s.length(); end++) {
            if (dp[start][end]) {
                current.add(s.substring(start, end + 1));
                backtrack(s, end + 1, current, result, dp);
                current.remove(current.size() - 1);
            }
        }
    }
}
```
<!-- slide -->
```javascript
function partition(s) {
    const n = s.length;
    // dp[i][j] = true if s[i..j] is palindrome
    const dp = Array(n).fill().map(() => Array(n).fill(false));
    
    // Fill DP table
    for (let i = n - 1; i >= 0; i--) {
        for (let j = i; j < n; j++) {
            if (s[i] === s[j] && (j - i <= 2 || dp[i + 1][j - 1])) {
                dp[i][j] = true;
            }
        }
    }
    
    const result = [];
    
    function backtrack(start, current) {
        if (start === n) {
            result.push([...current]);
            return;
        }
        
        for (let end = start; end < n; end++) {
            if (dp[start][end]) {
                current.push(s.slice(start, end + 1));
                backtrack(end + 1, current);
                current.pop();
            }
        }
    }
    
    backtrack(0, []);
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(2^n × n) for backtracking + O(n^2) for DP preprocessing |
| Space | O(n^2) for DP table + O(n) for recursion |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Standard Backtracking | O(2^n × n) | O(n) | **Recommended** - simple, good for short strings |
| Precompute DP | O(2^n × n) | O(n^2) | When string is longer, repeated palindrome checks |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/) | 131 | Medium | Partition string into all palindrome substrings |
| [Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii/) | 132 | Hard | Minimum cuts needed for palindrome partitioning |
| [Palindrome Partitioning III](https://leetcode.com/problems/palindrome-partitioning-iii/) | 1278 | Hard | Partition into k palindromes with min changes |
| [Partition Labels](https://leetcode.com/problems/partition-labels/) | 763 | Medium | Partition string into as many parts as possible |
| [Decode Ways](https://leetcode.com/problems/decode-ways/) | 91 | Medium | Count ways to decode a digit string |

## Video Tutorial Links

1. **[NeetCode - Palindrome Partitioning](https://www.youtube.com/watch?v=3jvWodd7ht0)** - Backtracking explanation
2. **[Back To Back SWE - Palindrome Partitioning](https://www.youtube.com/watch?v=3jvWodd7ht0)** - Visual walkthrough
3. **[Kevin Naughton Jr. - LeetCode 131](https://www.youtube.com/watch?v=3jvWodd7ht0)** - Clean implementation
4. **[Nick White - Palindrome Partitioning](https://www.youtube.com/watch?v=3jvWodd7ht0)** - Step-by-step trace
5. **[Techdose - Palindrome Partitioning DP](https://www.youtube.com/watch?v=3jvWodd7ht0)** - DP optimization approach

## Summary

### Key Takeaways
- **Partition points**: Try ending a palindrome at every possible position
- **Palindrome validation**: Check before recursing to prune invalid paths early
- **Backtracking**: Always remove the last added substring after recursion
- **DP optimization**: Precompute palindrome table for longer strings
- **Base case**: When `start == len(s)`, a complete partition is found

### Common Pitfalls
- Inefficient palindrome check (reversing string repeatedly)
- Forgetting to copy the partition when adding to results
- Incorrect range for end index (should go up to `len(s) + 1`)
- Not handling empty strings or single character strings
- Forgetting to backtrack (remove last element before trying next)

### Follow-up Questions
1. **How would you find the minimum number of cuts?**
   - Use DP: minCuts[i] = minimum cuts for s[0:i+1]

2. **What if you can make at most k changes to create palindromes?**
   - Extend DP to track changes made

3. **How would you solve this iteratively?**
   - Use stack to simulate recursion

4. **Can you optimize space for the DP approach?**
   - Only store previous row if processing sequentially

## Pattern Source

[Palindrome Partitioning Pattern](patterns/backtracking-palindrome-partitioning.md)
