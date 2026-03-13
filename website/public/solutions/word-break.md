# Word Break

## Problem Description

Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.

**Link to problem:** [Word Break - LeetCode 139](https://leetcode.com/problems/word-break/)

## Constraints
- `1 <= s.length <= 300`
- `1 <= wordDict.length <= 1000`
- `1 <= wordDict[i].length <= 20`
- `s` and `wordDict[i]` consist of only lowercase English letters

---

## Pattern: Dynamic Programming

This problem is a classic example of the **Dynamic Programming** pattern. The pattern involves building a solution by solving smaller subproblems.

### Core Concept

- **DP State**: dp[i] = can segment s[0:i]
- **Transition**: dp[i] = True if exists j where dp[j] is True and s[j:i] in dict
- **Base Case**: dp[0] = True (empty string)

---

## Examples

### Example

**Input:** s = "leetcode", wordDict = ["leet","code"]

**Output:** true

**Explanation:** "leetcode" can be segmented as "leet" + "code".

### Example 2

**Input:** s = "applepenapple", wordDict = ["apple","pen"]

**Output:** true

**Explanation:** "applepenapple" can be segmented as "apple" + "pen" + "apple".

### Example 3

**Input:** s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]

**Output:** false

---

## Intuition

The key insight is to build the solution from the beginning:

1. **Base Case**: An empty string is always segmentable
2. **DP Approach**: For each position i, check if any word ending at i can form a valid segmentation
3. **Optimization**: Use a set for O(1) word lookups

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Bottom-up DP (Standard)** - O(n²) time, O(n) space
2. **BFS with Memoization** - O(n²) time, O(n) space
3. **Optimized DP with Trie** - O(n²) time, O(n + dict) space

---

## Approach 1: Bottom-up DP (Standard)

This is the most common and intuitive approach.

### Algorithm Steps

1. Create a set from wordDict for O(1) lookups
2. Initialize dp[0] = True
3. For each position i from 1 to n:
   - For each position j from 0 to i-1:
     - If dp[j] is True and s[j:i] in wordSet:
       - Set dp[i] = True and break
4. Return dp[n]

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        """
        Determine if s can be segmented using DP.
        
        Args:
            s: Input string
            wordDict: List of dictionary words
            
        Returns:
            True if s can be segmented into dictionary words
        """
        word_set = set(wordDict)
        n = len(s)
        dp = [False] * (n + 1)
        dp[0] = True
        
        for i in range(1, n + 1):
            for j in range(i):
                if dp[j] and s[j:i] in word_set:
                    dp[i] = True
                    break
        return dp[n]
```

<!-- slide -->
```cpp
class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        int n = s.length();
        vector<bool> dp(n + 1, false);
        dp[0] = true;
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && wordSet.count(s.substr(j, i - j))) {
                    dp[i] = true;
                    break;
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
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        int n = s.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && wordSet.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
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
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function(s, wordDict) {
    const wordSet = new Set(wordDict);
    const n = s.length;
    const dp = new Array(n + 1).fill(false);
    dp[0] = true;
    
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            if (dp[j] && wordSet.has(s.substring(j, i))) {
                dp[i] = true;
                break;
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
| **Time** | O(n²) - checking all substrings |
| **Space** | O(n + m) - dp array + word set |

---

## Approach 2: BFS with Memoization

This approach uses BFS from the start position.

### Algorithm Steps

1. Use a queue starting from position 0
2. Use a visited set to avoid reprocessing
3. For each position, try all possible word lengths
4. If we reach position n, return True

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def wordBreak_bfs(self, s: str, wordDict: List[str]) -> bool:
        """
        Determine if s can be segmented using BFS.
        
        Args:
            s: Input string
            wordDict: List of dictionary words
            
        Returns:
            True if s can be segmented into dictionary words
        """
        word_set = set(wordDict)
        n = len(s)
        
        queue = deque([0])
        visited = set()
        
        while queue:
            start = queue.popleft()
            
            if start in visited:
                continue
            visited.add(start)
            
            for end in range(start + 1, n + 1):
                if s[start:end] in word_set:
                    if end == n:
                        return True
                    queue.append(end)
        
        return False
```

<!-- slide -->
```cpp
class Solution {
public:
    bool wordBreakBFS(string s, vector<string>& wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        int n = s.length();
        queue<int> q;
        vector<bool> visited(n + 1, false);
        q.push(0);
        
        while (!q.empty()) {
            int start = q.front();
            q.pop();
            
            if (visited[start]) continue;
            visited[start] = true;
            
            for (int end = start + 1; end <= n; end++) {
                if (wordSet.count(s.substr(start, end - start))) {
                    if (end == n) return true;
                    q.push(end);
                }
            }
        }
        
        return false;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean wordBreakBFS(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        int n = s.length();
        Queue<Integer> queue = new LinkedList<>();
        boolean[] visited = new boolean[n + 1];
        queue.offer(0);
        
        while (!queue.isEmpty()) {
            int start = queue.poll();
            
            if (visited[start]) continue;
            visited[start] = true;
            
            for (int end = start + 1; end <= n; end++) {
                if (wordSet.contains(s.substring(start, end))) {
                    if (end == n) return true;
                    queue.offer(end);
                }
            }
        }
        
        return false;
    }
}
```

<!-- slide -->
```javascript
var wordBreak = function(s, wordDict) {
    const wordSet = new Set(wordDict);
    const n = s.length;
    const queue = [0];
    const visited = new Set();
    
    while (queue.length > 0) {
        const start = queue.shift();
        
        if (visited.has(start)) continue;
        visited.add(start);
        
        for (let end = start + 1; end <= n; end++) {
            if (wordSet.has(s.substring(start, end))) {
                if (end === n) return true;
                queue.push(end);
            }
        }
    }
    
    return false;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) in worst case |
| **Space** | O(n + m) - visited + word set |

---

## Approach 3: Optimized DP with Word Length Tracking

This approach optimizes by tracking valid word lengths.

### Algorithm Steps

1. Track maximum and minimum word lengths
2. Only check substrings of valid lengths
3. Same DP logic but with optimized inner loop

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def wordBreak_optimized(self, s: str, wordDict: List[str]) -> bool:
        """
        Optimized DP using word length constraints.
        """
        word_set = set(wordDict)
        n = len(s)
        
        # Track valid word lengths
        max_len = max(len(word) for word in wordDict)
        min_len = min(len(word) for word in wordDict)
        
        dp = [False] * (n + 1)
        dp[0] = True
        
        for i in range(1, n + 1):
            # Only check lengths within word length constraints
            for j in range(max(0, i - max_len), i):
                if dp[j] and s[j:i] in word_set:
                    dp[i] = True
                    break
        
        return dp[n]
```

<!-- slide -->
```cpp
class Solution {
public:
    bool wordBreakOptimized(string s, vector<string>& wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        int n = s.length();
        
        int maxLen = 0, minLen = INT_MAX;
        for (const string& word : wordDict) {
            maxLen = max(maxLen, (int)word.length());
            minLen = min(minLen, (int)word.length());
        }
        
        vector<bool> dp(n + 1, false);
        dp[0] = true;
        
        for (int i = 1; i <= n; i++) {
            for (int j = max(0, i - maxLen); j < i; j++) {
                if (dp[j] && wordSet.count(s.substr(j, i - j))) {
                    dp[i] = true;
                    break;
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
    public boolean wordBreakOptimized(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        int n = s.length();
        
        int maxLen = 0, minLen = Integer.MAX_VALUE;
        for (String word : wordDict) {
            maxLen = Math.max(maxLen, word.length());
            minLen = Math.min(minLen, word.length());
        }
        
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;
        
        for (int i = 1; i <= n; i++) {
            for (int j = Math.max(0, i - maxLen); j < i; j++) {
                if (dp[j] && wordSet.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        
        return dp[n];
    }
}
```

<!-- slide -->
```javascript
var wordBreak = function(s, wordDict) {
    const wordSet = new Set(wordDict);
    const n = s.length;
    
    const maxLen = Math.max(...wordDict.map(w => w.length));
    
    const dp = new Array(n + 1).fill(false);
    dp[0] = true;
    
    for (let i = 1; i <= n; i++) {
        for (let j = Math.max(0, i - maxLen); j < i; j++) {
            if (dp[j] && wordSet.has(s.substring(j, i))) {
                dp[i] = true;
                break;
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
| **Time** | O(n × max_word_length) - reduced inner loop |
| **Space** | O(n + m) |

---

## Comparison of Approaches

| Aspect | Bottom-up DP | BFS | Optimized DP |
|--------|--------------|-----|--------------|
| **Time Complexity** | O(n²) | O(n²) | O(n × L) |
| **Space Complexity** | O(n) | O(n) | O(n) |
| **Implementation** | Simple | Moderate | Moderate |
| **Early Exit** | No | Yes | No |

**Best Approach:** Standard bottom-up DP is simplest and works well. BFS can exit early.

---

## Why DP Works for This Problem

The dynamic programming approach works because:

1. **Optimal Substructure**: If s[0:j] can be segmented and s[j:i] is a word, then s[0:i] can be segmented
2. **Overlapping Subproblems**: Many substrings are checked repeatedly in brute force
3. **Base Case**: Empty string is always segmentable

---

## Related Problems

### Similar Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Word Break II | [Link](https://leetcode.com/problems/word-break-ii/) | Return all segmentations |
| Concatenated Words | [Link](https://leetcode.com/problems/concatenated-words/) | Words that can be formed |
| Solve the Equation | [Link](https://leetcode.com/problems/solve-the-equation/) | Similar DP pattern |
| Number of Ways to Stay in the Same Place | [Link](https://leetcode.com/problems/number-of-ways-to-stay-in-the-same-place-after-some-steps/) | Similar DP |

### Pattern Reference

For more detailed explanations of the DP pattern, see:
- **[Dynamic Programming Pattern](/patterns/dynamic-programming)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Dynamic Programming

- [NeetCode - Word Break](https://www.youtube.com/watch?v=7C_f7fD2p14) - Clear explanation with examples
- [Word Break DP Solution](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Official explanation

### Related Concepts

- [Introduction to Dynamic Programming](https://www.youtube.com/watch?v=8jP8CCrj8cI) - DP fundamentals
- [BFS Traversal](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - BFS technique

---

## Follow-up Questions

### Q1: How would you return all possible segmentations?

**Answer:** Use backtracking with memoization. Store results at each position and recursively build all possible segmentations.

---

### Q2: What if the dictionary is very large?

**Answer:** Use a Trie data structure for O(1) prefix lookups. For each position, traverse the Trie to find matching words.

---

### Q3: How would you handle optimization for very long strings?

**Answer:** The optimized DP with word length constraints reduces inner loop to O(max_word_length) instead of O(n).

---

### Q4: Can you solve it with O(n) time?

**Answer:** No, in the worst case we need to check all substrings which is O(n²). However, with proper word length constraints, practical performance is better.

---

### Q5: What edge cases should be tested?

**Answer:**
- Empty string
- Empty dictionary
- Single character string
- All single character words
- Words longer than string
- Duplicate words in dictionary
- String that exactly matches a word

---

### Q6: How does memoization help in recursive solution?

**Answer:** Memoization avoids recomputing results for the same position. Store dp[i] after computing to use in future calculations.

---



## Common Pitfalls

### 1. Wrong DP Definition
**Issue:** Not clear what dp[i] represents.

**Solution:** dp[i] = True if s[0:i] can be segmented.

### 2. Not Resetting for Each Start
**Issue:** Checking from wrong position.

**Solution:** Outer loop for start, inner for end.

### 3. Performance
**Issue:** O(n²) with set lookups.

**Solution:** Use trie for faster lookups if needed.

---

## Summary

The **Word Break** problem demonstrates **Dynamic Programming**:
- dp[i] represents if s[0:i] can be segmented
- Check all possible previous split points
- O(n²) time complexity with optimization possible

This is a fundamental DP problem that appears in many variations.

### Pattern Summary

This problem exemplifies the **Dynamic Programming** pattern, which is characterized by:
- Building solution from smaller subproblems
- Using array/memoization for intermediate results
- Checking all possible splits

For more details on this pattern, see the **[Dynamic Programming Pattern](/patterns/dynamic-programming)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/word-break/discuss/) - Community solutions
- [Dynamic Programming - GeeksforGeeks](https://www.geeksforgeeks.org/dynamic-programming/) - Detailed explanation
- [Word Break II Solution](https://www.geeksforgeeks.org/word-break-problem-using-trie/) - Using Trie
- [Pattern: Dynamic Programming](/patterns/dynamic-programming) - Comprehensive pattern guide
