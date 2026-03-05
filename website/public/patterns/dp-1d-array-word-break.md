# DP - 1D Array (Word Break Style)

## Problem Description

The DP - 1D Array (Word Break Style) pattern solves string segmentation problems where you need to determine if a string can be broken into valid words from a dictionary. This pattern is essential for word segmentation, dictionary-based parsing, and similar string decomposition problems.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n² × m), where n is string length, m is max word length |
| Space Complexity | O(n), for the DP array |
| Input | String and dictionary of valid words |
| Output | Boolean (segmentable) or list of all possible segmentations |
| Approach | Bottom-up: check all prefixes and suffixes |

### When to Use

- **Word Segmentation**: Check if string can be segmented into dictionary words
- **Text Parsing**: Parse text according to grammar rules
- **Abbreviation Problems**: Check if abbreviation matches pattern
- **Concatenated Words**: Find words formed by concatenating other words
- **Pattern Matching**: Match string against multiple patterns

## Intuition

The key insight is that if we know all valid segmentations up to position i, we can check if the substring from i to j is a valid word to determine if j is segmentable.

The "aha!" moments:

1. **Boolean DP**: dp[i] means "string[0:i] can be segmented"
2. **Prefix-suffix check**: For each position, check all possible word endings
3. **Set for O(1) lookup**: Convert wordDict to a set for fast lookups
4. **Early termination**: Break early when a valid segmentation is found
5. **Extension for listing**: Track predecessors to reconstruct all segmentations

## Solution Approaches

### Approach 1: Basic Word Break ✅ Recommended

Determine if a string can be segmented into dictionary words.

#### Algorithm

1. Convert wordDict to a set for O(1) lookups
2. Initialize dp array of size (n+1) with False
3. Set dp[0] = True (empty string is always segmentable)
4. For each position i from 1 to n:
   - For each position j from 0 to i:
     - If dp[j] is True and s[j:i] is in wordDict:
       - Set dp[i] = True and break
5. Return dp[n]

#### Implementation

````carousel
```python
def word_break(s, word_dict):
    """
    Check if string can be segmented into dictionary words.
    LeetCode 139 - Word Break
    
    Time: O(n² * m), Space: O(n)
    where m is average word length
    """
    word_set = set(word_dict)  # O(1) lookups
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string is segmentable
    
    for i in range(1, n + 1):
        for j in range(i):
            # If prefix [0:j] is segmentable and suffix [j:i] is a word
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break  # Early termination
    
    return dp[n]

# Optimized: Only check valid word lengths
def word_break_optimized(s, word_dict):
    """Optimized version using word length bounds."""
    word_set = set(word_dict)
    min_len = min(len(w) for w in word_dict)
    max_len = max(len(w) for w in word_dict)
    
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        # Only check valid word lengths
        for length in range(min_len, min(max_len, i) + 1):
            j = i - length
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]
```
<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <unordered_set>
using namespace std;

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
function wordBreak(s, wordDict) {
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
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n² × m) |
| Space | O(n) |

### Approach 2: Word Break II (All Possible Segmentation)

Return all possible word break combinations.

#### Implementation

````carousel
```python
def word_break_ii(s, word_dict):
    """
    Return all possible word break combinations.
    LeetCode 140 - Word Break II
    
    Time: O(2^n) worst case, Space: O(n) for recursion
    """
    word_set = set(word_dict)
    memo = {}
    
    def backtrack(start):
        if start in memo:
            return memo[start]
        
        if start == len(s):
            return [""]
        
        result = []
        for end in range(start + 1, len(s) + 1):
            word = s[start:end]
            if word in word_set:
                for rest in backtrack(end):
                    if rest:
                        result.append(word + " " + rest)
                    else:
                        result.append(word)
        
        memo[start] = result
        return result
    
    return backtrack(0)

# DP + Backtracking hybrid
def word_break_ii_dp(s, word_dict):
    """Hybrid approach using DP to check feasibility first."""
    word_set = set(word_dict)
    n = len(s)
    
    # First check if segmentation is possible
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    if not dp[n]:
        return []
    
    # Then use backtracking to find all solutions
    result = []
    def backtrack(start, path):
        if start == n:
            result.append(" ".join(path))
            return
        
        for end in range(start + 1, n + 1):
            word = s[start:end]
            if word in word_set:
                path.append(word)
                backtrack(end, path)
                path.pop()
    
    backtrack(0, [])
    return result
```
<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <unordered_set>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<string> wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        unordered_map<int, vector<string>> memo;
        return backtrack(s, 0, wordSet, memo);
    }
    
private:
    vector<string> backtrack(const string& s, int start, 
                            unordered_set<string>& wordSet,
                            unordered_map<int, vector<string>>& memo) {
        if (memo.count(start)) return memo[start];
        
        vector<string> result;
        if (start == s.length()) {
            result.push_back("");
            return result;
        }
        
        for (int end = start + 1; end <= s.length(); end++) {
            string word = s.substr(start, end - start);
            if (wordSet.count(word)) {
                vector<string> subs = backtrack(s, end, wordSet, memo);
                for (const string& sub : subs) {
                    result.push_back(word + (sub.empty() ? "" : " " + sub));
                }
            }
        }
        
        memo[start] = result;
        return result;
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<String> wordBreak(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        Map<Integer, List<String>> memo = new HashMap<>();
        return backtrack(s, 0, wordSet, memo);
    }
    
    private List<String> backtrack(String s, int start, 
                                   Set<String> wordSet,
                                   Map<Integer, List<String>> memo) {
        if (memo.containsKey(start)) return memo.get(start);
        
        List<String> result = new ArrayList<>();
        if (start == s.length()) {
            result.add("");
            return result;
        }
        
        for (int end = start + 1; end <= s.length(); end++) {
            String word = s.substring(start, end);
            if (wordSet.contains(word)) {
                List<String> subs = backtrack(s, end, wordSet, memo);
                for (String sub : subs) {
                    result.add(word + (sub.isEmpty() ? "" : " " + sub));
                }
            }
        }
        
        memo.put(start, result);
        return result;
    }
}
```
<!-- slide -->
```javascript
function wordBreak(s, wordDict) {
    const wordSet = new Set(wordDict);
    const memo = new Map();
    
    function backtrack(start) {
        if (memo.has(start)) return memo.get(start);
        
        const result = [];
        if (start === s.length) {
            result.push("");
            return result;
        }
        
        for (let end = start + 1; end <= s.length; end++) {
            const word = s.substring(start, end);
            if (wordSet.has(word)) {
                const subs = backtrack(end);
                for (const sub of subs) {
                    result.push(word + (sub === "" ? "" : " " + sub));
                }
            }
        }
        
        memo.set(start, result);
        return result;
    }
    
    return backtrack(0);
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(2^n) worst case, O(n²) average |
| Space | O(n) for recursion stack |

### Approach 3: Trie Optimization

Use a trie for faster word lookup with pruning.

#### Implementation

````carousel
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Solution:
    def wordBreak(self, s: str, word_dict):
        # Build trie
        root = TrieNode()
        for word in word_dict:
            node = root
            for char in word:
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
            node.is_end = True
        
        n = len(s)
        dp = [False] * (n + 1)
        dp[0] = True
        
        for i in range(n):
            if not dp[i]:
                continue
            
            # Traverse trie from position i
            node = root
            for j in range(i, n):
                if s[j] not in node.children:
                    break
                node = node.children[s[j]]
                if node.is_end:
                    dp[j + 1] = True
        
        return dp[n]
```
<!-- slide -->
```cpp
struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};

class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        TrieNode* root = new TrieNode();
        
        // Build trie
        for (const string& word : wordDict) {
            TrieNode* node = root;
            for (char c : word) {
                if (!node->children.count(c)) {
                    node->children[c] = new TrieNode();
                }
                node = node->children[c];
            }
            node->isEnd = true;
        }
        
        int n = s.length();
        vector<bool> dp(n + 1, false);
        dp[0] = true;
        
        for (int i = 0; i < n; i++) {
            if (!dp[i]) continue;
            
            TrieNode* node = root;
            for (int j = i; j < n; j++) {
                if (!node->children.count(s[j])) break;
                node = node->children[s[j]];
                if (node->isEnd) dp[j + 1] = true;
            }
        }
        
        return dp[n];
    }
};
```
<!-- slide -->
```java
class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isEnd = false;
}

class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        TrieNode root = new TrieNode();
        
        // Build trie
        for (String word : wordDict) {
            TrieNode node = root;
            for (char c : word.toCharArray()) {
                node.children.putIfAbsent(c, new TrieNode());
                node = node.children.get(c);
            }
            node.isEnd = true;
        }
        
        int n = s.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;
        
        for (int i = 0; i < n; i++) {
            if (!dp[i]) continue;
            
            TrieNode node = root;
            for (int j = i; j < n; j++) {
                char c = s.charAt(j);
                if (!node.children.containsKey(c)) break;
                node = node.children.get(c);
                if (node.isEnd) dp[j + 1] = true;
            }
        }
        
        return dp[n];
    }
}
```
<!-- slide -->
```javascript
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEnd = false;
    }
}

function wordBreak(s, wordDict) {
    const root = new TrieNode();
    
    // Build trie
    for (const word of wordDict) {
        let node = root;
        for (const c of word) {
            if (!node.children.has(c)) {
                node.children.set(c, new TrieNode());
            }
            node = node.children.get(c);
        }
        node.isEnd = true;
    }
    
    const n = s.length;
    const dp = new Array(n + 1).fill(false);
    dp[0] = true;
    
    for (let i = 0; i < n; i++) {
        if (!dp[i]) continue;
        
        let node = root;
        for (let j = i; j < n; j++) {
            const c = s[j];
            if (!node.children.has(c)) break;
            node = node.children.get(c);
            if (node.isEnd) dp[j + 1] = true;
        }
    }
    
    return dp[n];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × L), where L is max word length |
| Space | O(n + total_chars_in_dict) |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Basic DP | O(n² × m) | O(n) | Simple word break check |
| Optimized with bounds | O(n × k × m) | O(n) | When word lengths vary |
| Trie-based | O(n × L) | O(n + D) | Large dictionary, many queries |
| Backtracking | O(2^n) | O(n) | Find all possible segmentations |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Word Break](https://leetcode.com/problems/word-break/) | 139 | Medium | Check if string is segmentable |
| [Word Break II](https://leetcode.com/problems/word-break-ii/) | 140 | Hard | Find all possible segmentations |
| [Concatenated Words](https://leetcode.com/problems/concatenated-words/) | 472 | Hard | Find words formed by concatenation |
| [Add Bold Tag in String](https://leetcode.com/problems/add-bold-tag-in-string/) | 616 | Medium | Mark substrings in dictionary |
| [Extra Characters in a String](https://leetcode.com/problems/extra-characters-in-a-string/) | 2707 | Medium | Minimize extra characters after segmentation |
| [Number of Ways to Form Target String](https://leetcode.com/problems/number-of-ways-to-form-target-string-given-a-dictionary/) | 1639 | Hard | Form target from word characters |

## Video Tutorial Links

1. **[NeetCode - Word Break](https://www.youtube.com/watch?v=Sx9NNgInc3A)** - DP approach explained
2. **[Back To Back SWE - Word Break](https://www.youtube.com/watch?v=iWenZCZEBIA)** - Visual explanation
3. **[Kevin Naughton Jr. - Word Break](https://www.youtube.com/watch?v=th4OnoGasMU)** - Step-by-step solution
4. **[Techdose - Word Break Variations](https://www.youtube.com/watch?v=5_T7ihU-zdq)** - All variations covered
5. **[Abdul Bari - String DP](https://www.youtube.com/watch?v=WepWFGxiwRs)** - General string DP concepts

## Summary

### Key Takeaways

- **Set for O(1) lookups**: Always convert wordDict to a hash set
- **dp[i] represents prefix**: dp[i] = True means s[0:i] can be segmented
- **Prefix-suffix decomposition**: Check if prefix is valid AND suffix is a word
- **Early termination**: Break inner loop once valid segmentation found
- **Trie optimization**: For large dictionaries, trie reduces repeated prefix checks
- **Backtracking for all solutions**: Use memoization to avoid redundant work

### Common Pitfalls

- **Not using a set**: O(m) lookup in list instead of O(1) in set
- **Wrong base case**: Forgetting dp[0] = True breaks everything
- **Substring bounds**: Off-by-one errors in s[j:i] range
- **Not handling empty string**: Edge case where s = "" or wordDict = []
- **Brute force without memoization**: Exponential time for Word Break II
- **Recursive without DP**: TLE on large inputs

### Follow-up Questions

1. **How would you handle extremely long strings?**
   - Use BFS or trie-based approach; consider segmenting greedily with backtracking

2. **What if you need the minimum number of words?**
   - Change dp to store min count: dp[i] = min(dp[i], dp[j] + 1)

3. **Can you optimize for multiple queries on same dictionary?**
   - Build a trie once and reuse; preprocessing pays off

4. **How to handle wildcard characters?**
   - Use modified trie with wildcard support or regex matching

## Pattern Source

[Word Break Pattern](patterns/dp-1d-array-word-break.md)
