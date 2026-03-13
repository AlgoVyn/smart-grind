# Word Break II

## Problem Description

Given a string `s` and a dictionary of strings `wordDict`, add spaces in `s` to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in any order.

Note that the same word in the dictionary may be reused multiple times in the segmentation.

## Examples

**Example 1:**

**Input:**
```
s = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]
```

**Output:**
```
["cats and dog","cat sand dog"]
```

**Example 2:**

**Input:**
```
s = "pineapplepenapple", wordDict = ["apple","pen","applepen","pine","pineapple"]
```

**Output:**
```
["pine apple pen apple","pineapple pen apple","pine applepen apple"]
```

**Explanation:** Note that you are allowed to reuse a dictionary word.

**Example 3:**

**Input:**
```
s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
```

**Output:**
```
[]
```

## Constraints

- `1 <= s.length <= 20`
- `1 <= wordDict.length <= 1000`
- `1 <= wordDict[i].length <= 10`
- `s` and `wordDict[i]` consist of only lowercase English letters.
- All the strings of `wordDict` are unique.
- Input is generated in a way that the length of the answer doesn't exceed `10^5`.

---

## Pattern:

This problem follows the **Backtracking with Memoization** pattern, also known as **Recursive DP** or **Top-Down DP**. It's used for generating all possible combinations/paths in constraint satisfaction problems.

### Core Concept

- Use **recursion** to explore all possible choices
- Apply **memoization** (caching) to avoid recomputing the same subproblems
- Each position in the string is processed once, storing results for reuse
- Base case: reaching the end of the string returns an empty completion signal

### When to Use This Pattern

This pattern is applicable when:
1. Generating all possible combinations or permutations
2. Problems with overlapping subproblems
3. Constraint satisfaction problems
4. String/array segmentation problems
5. When you need both existence check AND enumeration

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Bottom-up DP | Iterative approach building from smaller subproblems |
| BFS/Queue | Level-order exploration of all paths |
| Trie + DP | For large dictionaries with prefix matching |

---

## Intuition

This problem extends Word Break I, where we only needed to determine if segmentation is possible. Here, we need to generate **all possible sentences**.

### Key Insights

1. **Backtracking**: We try all possible word combinations by recursively breaking the string.

2. **Memoization**: Many substrings can be reached through different paths, so we cache results to avoid recomputation.

3. **Base Case**: When we reach the end of the string (index equals string length), we've found a valid sentence - return an empty string to signal completion.

4. **Combination**: For each valid word at position `start`, combine it with all suffixes from recursive calls.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Backtracking with Memoization** - Optimal O(n²) solution
2. **DP with Sentence Tracking** - Bottom-up approach
3. **BFS/Queue-based** - Level-order exploration

---

## Approach 1: Backtracking with Memoization (Optimal)

This approach uses recursion with memoization to efficiently generate all sentences.

### Algorithm Steps

1. Convert wordDict to a set for O(1) lookups.
2. Create a memoization cache (dictionary) to store results for each start index.
3. Define a recursive function `backtrack(start)`:
   - If start in memo, return cached result.
   - If start == len(s), return [""](empty string to combine with).
   - For each end position from start+1 to len(s):
     - If s[start:end] in wordSet, recursively call backtrack(end).
     - For each suffix, combine word + " " + suffix.
   - Store result in memo and return.
4. Call backtrack(0) to get all sentences.

### Why It Works

The recursion explores all possible word choices at each position. The memoization ensures each substring position is processed only once, even if reached through different paths.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> List[str]:
        """
        Find all possible word break sentences using backtracking with memoization.
        
        Args:
            s: Input string to break into words
            wordDict: List of valid words
            
        Returns:
            List of all possible sentences
        """
        wordSet = set(wordDict)
        memo = {}
        
        def backtrack(start: int) -> List[str]:
            """Generate all sentences starting from position start"""
            if start in memo:
                return memo[start]
            
            # Base case: reached end of string
            if start == len(s):
                return [""]
            
            result = []
            
            # Try all possible end positions
            for end in range(start + 1, len(s) + 1):
                word = s[start:end]
                
                # Check if this word is in dictionary
                if word in wordSet:
                    # Get all suffixes from recursive calls
                    for suffix in backtrack(end):
                        if suffix:
                            result.append(word + " " + suffix)
                        else:
                            # Reached end, don't add extra space
                            result.append(word)
            
            memo[start] = result
            return result
        
        return backtrack(0)
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_set>
#include <unordered_map>
using namespace std;

class Solution {
private:
    unordered_set<string> wordSet;
    unordered_map<int, vector<string>> memo;
    
    vector<string> backtrack(int start, const string& s) {
        if (memo.count(start)) {
            return memo[start];
        }
        
        // Base case: reached end of string
        if (start == s.length()) {
            return {""};
        }
        
        vector<string> result;
        
        // Try all possible end positions
        for (int end = start + 1; end <= s.length(); end++) {
            string word = s.substr(start, end - start);
            
            if (wordSet.count(word)) {
                vector<string> suffixes = backtrack(end, s);
                for (const string& suffix : suffixes) {
                    if (suffix.empty()) {
                        result.push_back(word);
                    } else {
                        result.push_back(word + " " + suffix);
                    }
                }
            }
        }
        
        memo[start] = result;
        return result;
    }
    
public:
    vector<string> wordBreak(string s, vector<string>& wordDict) {
        wordSet = unordered_set<string>(wordDict.begin(), wordDict.end());
        return backtrack(0, s);
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    private Set<String> wordSet;
    private Map<Integer, List<String>> memo;
    
    private List<String> backtrack(int start, String s) {
        if (memo.containsKey(start)) {
            return memo.get(start);
        }
        
        // Base case: reached end of string
        if (start == s.length()) {
            List<String> base = new ArrayList<>();
            base.add("");
            return base;
        }
        
        List<String> result = new ArrayList<>();
        
        // Try all possible end positions
        for (int end = start + 1; end <= s.length(); end++) {
            String word = s.substring(start, end);
            
            if (wordSet.contains(word)) {
                List<String> suffixes = backtrack(end, s);
                for (String suffix : suffixes) {
                    if (suffix.isEmpty()) {
                        result.add(word);
                    } else {
                        result.add(word + " " + suffix);
                    }
                }
            }
        }
        
        memo.put(start, result);
        return result;
    }
    
    public List<String> wordBreak(String s, List<String> wordDict) {
        wordSet = new HashSet<>(wordDict);
        memo = new HashMap<>();
        return backtrack(0, s);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {string[]}
 */
var wordBreak = function(s, wordDict) {
    const wordSet = new Set(wordDict);
    const memo = {};
    
    const backtrack = (start) => {
        if (memo[start] !== undefined) {
            return memo[start];
        }
        
        // Base case: reached end of string
        if (start === s.length) {
            return [""];
        }
        
        const result = [];
        
        // Try all possible end positions
        for (let end = start + 1; end <= s.length; end++) {
            const word = s.slice(start, end);
            
            if (wordSet.has(word)) {
                const suffixes = backtrack(end);
                for (const suffix of suffixes) {
                    if (suffix === "") {
                        result.push(word);
                    } else {
                        result.push(word + " " + suffix);
                    }
                }
            }
        }
        
        memo[start] = result;
        return result;
    };
    
    return backtrack(0);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n² × m) where n = string length, m = average word length checks |
| **Space** | O(n²) for memoization cache and result storage |

---

## Approach 2: DP with Sentence Tracking

This bottom-up approach builds sentences using dynamic programming.

### Algorithm Steps

1. Initialize dp array where dp[i] stores all sentences for substring s[0:i].
2. Set dp[0] = [""] (empty string base case).
3. For each position i from 1 to n:
   - For each j from 0 to i-1:
     - If s[j:i] in wordDict and dp[j] is non-empty:
       - Add all combinations of dp[j] words + s[j:i]
4. Return dp[n].

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> List[str]:
        wordSet = set(wordDict)
        n = len(s)
        
        # dp[i] = list of sentences for s[0:i]
        dp = [[] for _ in range(n + 1)]
        dp[0] = [""]  # Base case
        
        # Fill DP table
        for i in range(1, n + 1):
            for j in range(i):
                # Check if s[j:i] is a valid word
                if s[j:i] in wordSet and dp[j]:
                    word = s[j:i]
                    for sentence in dp[j]:
                        if sentence:
                            dp[i].append(sentence + " " + word)
                        else:
                            dp[i].append(word)
        
        return dp[n]
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_set>
using namespace std;

class Solution {
public:
    vector<string> wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        int n = s.length();
        
        // dp[i] = list of sentences for s[0:i]
        vector<vector<string>> dp(n + 1);
        dp[0] = {""};
        
        // Fill DP table
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                string word = s.substr(j, i - j);
                if (wordSet.count(word) && !dp[j].empty()) {
                    for (const string& sentence : dp[j]) {
                        if (sentence.empty()) {
                            dp[i].push_back(word);
                        } else {
                            dp[i].push_back(sentence + " " + word);
                        }
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
import java.util.*;

class Solution {
    public List<String> wordBreak(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        int n = s.length();
        
        // dp[i] = list of sentences for s[0:i]
        List<String>[] dp = new ArrayList[n + 1];
        for (int i = 0; i <= n; i++) {
            dp[i] = new ArrayList<>();
        }
        dp[0].add("");
        
        // Fill DP table
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                String word = s.substring(j, i);
                if (wordSet.contains(word) && !dp[j].isEmpty()) {
                    for (String sentence : dp[j]) {
                        if (sentence.isEmpty()) {
                            dp[i].add(word);
                        } else {
                            dp[i].add(sentence + " " + word);
                        }
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
 * @param {string[]} wordDict
 * @return {string[]}
 */
var wordBreak = function(s, wordDict) {
    const wordSet = new Set(wordDict);
    const n = s.length;
    
    // dp[i] = list of sentences for s[0:i]
    const dp = Array.from({ length: n + 1 }, () => []);
    dp[0] = [""];
    
    // Fill DP table
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            const word = s.slice(j, i);
            if (wordSet.has(word) && dp[j].length > 0) {
                for (const sentence of dp[j]) {
                    if (sentence === "") {
                        dp[i].push(word);
                    } else {
                        dp[i].push(sentence + " " + word);
                    }
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
| **Time** | O(n² × m) |
| **Space** | O(n²) for DP table and results |

---

## Approach 3: BFS with Queue

This approach uses breadth-first search to explore all possible segmentations.

### Algorithm Steps

1. Use a queue storing (position, current_sentence) pairs.
2. Start with (0, "").
3. While queue is not empty:
   - Dequeue position and current sentence.
   - Try all possible words starting from position.
   - When reaching end, add sentence to result.
4. Return all sentences.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> List[str]:
        wordSet = set(wordDict)
        n = len(s)
        
        result = []
        queue = deque([(0, "")])
        
        while queue:
            start, sentence = queue.popleft()
            
            # Try all possible end positions
            for end in range(start + 1, n + 1):
                word = s[start:end]
                
                if word in wordSet:
                    new_sentence = sentence + " " + word if sentence else word
                    
                    if end == n:
                        # Reached the end
                        result.append(new_sentence)
                    else:
                        # Add to queue for further exploration
                        queue.append((end, new_sentence))
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_set>
#include <queue>
using namespace std;

class Solution {
public:
    vector<string> wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        int n = s.length();
        
        vector<string> result;
        queue<pair<int, string>> q;
        q.push({0, ""});
        
        while (!q.empty()) {
            auto [start, sentence] = q.front();
            q.pop();
            
            // Try all possible end positions
            for (int end = start + 1; end <= n; end++) {
                string word = s.substr(start, end - start);
                
                if (wordSet.count(word)) {
                    string newSentence = sentence.empty() ? word : sentence + " " + word;
                    
                    if (end == n) {
                        result.push_back(newSentence);
                    } else {
                        q.push({end, newSentence});
                    }
                }
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<String> wordBreak(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        int n = s.length();
        
        List<String> result = new ArrayList<>();
        Queue<Pair<Integer, String>> q = new LinkedList<>();
        q.offer(new Pair<>(0, ""));
        
        while (!q.isEmpty()) {
            Pair<Integer, String> current = q.poll();
            int start = current.getKey();
            String sentence = current.getValue();
            
            // Try all possible end positions
            for (int end = start + 1; end <= n; end++) {
                String word = s.substring(start, end);
                
                if (wordSet.contains(word)) {
                    String newSentence = sentence.isEmpty() ? word : sentence + " " + word;
                    
                    if (end == n) {
                        result.add(newSentence);
                    } else {
                        q.offer(new Pair<>(end, newSentence));
                    }
                }
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {string[]}
 */
var wordBreak = function(s, wordDict) {
    const wordSet = new Set(wordDict);
    const n = s.length;
    
    const result = [];
    const queue = [{ start: 0, sentence: "" }];
    
    while (queue.length > 0) {
        const { start, sentence } = queue.shift();
        
        // Try all possible end positions
        for (let end = start + 1; end <= n; end++) {
            const word = s.slice(start, end);
            
            if (wordSet.has(word)) {
                const newSentence = sentence === "" ? word : sentence + " " + word;
                
                if (end === n) {
                    result.push(newSentence);
                } else {
                    queue.push({ start: end, sentence: newSentence });
                }
            }
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n² × m) |
| **Space** | O(n²) for queue and results |

---

## Comparison of Approaches

| Aspect | Backtracking + Memo | DP Table | BFS |
|--------|---------------------|-----------|-----|
| **Time Complexity** | O(n² × m) | O(n² × m) | O(n² × m) |
| **Space Complexity** | O(n²) | O(n²) | O(n²) |
| **Implementation** | Recursive | Iterative | Iterative |
| **Natural for This Problem** | ✅ Best | Good | Good |
| **Memoization** | Yes (automatic) | Built-in | Manual |

---

## Why This Problem is Important

### Interview Relevance
- **Frequency**: Frequently asked in technical interviews
- **Companies**: Amazon, Google, Apple, Microsoft
- **Difficulty**: Hard (due to output size)
- **Concepts**: Backtracking, memoization, string manipulation

### Key Learnings
1. **Backtracking**: Exploring all possible combinations
2. **Memoization**: Avoiding redundant computation
3. **String building**: Efficiently combining words
4. **DP vs Recursion**: Understanding when to use each

---

## Related Problems

### Same Pattern (String Segmentation)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Word Break II | [Link](https://leetcode.com/problems/word-break-ii/) | Hard | This problem |
| Word Break | [Link](https://leetcode.com/problems/word-break/) | Medium | Just check if possible |
| Concatenated Words | [Link](https://leetcode.com/problems/concatenated-words/) | Hard | Find compound words |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Letter Combinations | [Link](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) | Medium | Backtracking |
| Generate Parentheses | [Link](https://leetcode.com/problems/generate-parentheses/) | Medium | Backtracking |
| Restore IP Addresses | [Link](https://leetcode.com/problems/restore-ip-addresses/) | Medium | Backtracking |

---

## Video Tutorial Links

### Backtracking and Memoization

1. **[Word Break II - NeetCode](https://www.youtube.com/watch?v=inhJ9j6lnB4)** - Clear explanation with visual examples
2. **[LeetCode 140 - Word Break II](https://www.youtube.com/watch?v=SLauQyW47Lg)** - Detailed walkthrough
3. **[Backtracking Pattern](https://www.youtube.com/watch?v=1nYbFqgXjBk)** - Understanding backtracking

### Related Concepts

- **[Memoization Explained](https://www.youtube.com/watch?v=oWV3H-euHdE)** - DP with recursion
- **[String DP Problems](https://www.youtube.com/watch?v=U1X4Yn-ZYB8)** - Similar patterns

---

## Follow-up Questions

### Q1: How would you modify to return results in sorted order?

**Answer:** After generating all results, sort the list. Note that this adds O(n log n) time complexity.

---

### Q2: What if the dictionary is very large (10,000+ words)?

**Answer:** Use a Trie data structure for faster prefix lookup. This reduces substring checking from O(m) to O(length of substring).

---

### Q3: How would you handle duplicate sentences in the output?

**Answer:** Use a set to track unique sentences while generating, or deduplicate at the end. The problem states dictionary words are unique, but there can still be duplicate paths.

---

### Q4: Can you solve without recursion (iterative only)?

**Answer:** Yes! Use the DP table approach (Approach 2) which is purely iterative.

---

### Q5: How would you limit the number of sentences returned?

**Answer:** Add a counter to stop generating when reaching the limit. Use early termination in the recursion or BFS.

---

### Q6: What if words can be reused unlimited times?

**Answer:** The current solution already supports this - we can use each dictionary word multiple times since we don't remove words after use.

---

### Q7: How would you handle very long input strings?

**Answer:** The solution handles strings up to length 20 (per constraints). For longer strings, consider using a Trie for faster lookups and potentially pruning branches early.

---

### Q8: What edge cases should you test?

**Answer:**
- Empty dictionary → return empty list
- String that can't be broken → return empty list
- Single word in dictionary matching entire string → return that word
- Multiple ways to break the same string
- Dictionary with overlapping words
- Very long result list (up to 10^5 per constraints)

---

### Q9: How does this differ from Word Break I?

**Answer:** Word Break I only asks if segmentation is possible (boolean). Word Break II requires generating all possible sentences, making it harder and more complex in terms of output handling.

---

### Q10: How would you optimize for memory when result is huge?

**Answer:** Use a generator/iterator pattern to yield results one at a time instead of storing all in memory. This is more complex but handles large outputs better.

---

## Common Pitfalls

### 1. Missing Base Case
**Issue**: Not handling the case when we reach the end of the string.

**Solution**: Return [""] when start == len(s), representing a valid completion.

### 2. Extra Space at End
**Issue**: Adding an extra space at the end of sentences.

**Solution**: Check if suffix is empty before adding space: `word + " " + suffix` if suffix else `word`.

### 3. Not Using Memoization
**Issue**: Exponential time complexity without caching.

**Solution**: Always use memoization when the same substring can be reached through different paths.

### 4. Incorrect Set Lookup
**Issue**: Using list instead of set for dictionary.

**Solution**: Convert wordDict to a set for O(1) lookups.

---

## Summary

The **Word Break II** problem demonstrates powerful **backtracking with memoization** techniques:

- **Recursive exploration**: Try all possible word combinations
- **Memoization**: Cache results for each position to avoid recomputation
- **String building**: Efficiently combine words with proper spacing
- **Base case handling**: Return [""] at the end to signal completion

This pattern is essential for:
- Generating all combinations/paths
- Problems with overlapping subproblems
- String manipulation with constraints

The key insight is recognizing that the same substring position can be reached through different paths, making memoization critical for efficiency.
