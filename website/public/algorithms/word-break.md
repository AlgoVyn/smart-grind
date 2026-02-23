# Word Break

## Category
Dynamic Programming

## Description
Determine if string can be segmented into dictionary words.

## Algorithm Explanation
The Word Break problem is a classic dynamic programming problem where we need to determine if a string can be segmented into a sequence of one or more words from a given dictionary.

**Dynamic Programming Approach:**
1. **Define DP state**: `dp[i]` = True if the substring `s[0:i]` can be segmented into dictionary words
2. **Initialize**: `dp[0]` = True (empty string can always be segmented)
3. **Transition**: For each position i from 1 to n:
   - Check all positions j from 0 to i-1
   - If `dp[j]` is True AND `s[j:i]` is in the dictionary, then `dp[i]` = True
4. **Result**: Return `dp[n]`

**Why this works:**
- We build up solutions for smaller substrings
- If we can segment up to position j, and the substring from j to i is a word, then we can segment up to i
- This is optimal because we consider all possible break points

**Optimization:**
- Instead of checking all j values, we can use a trie or word set for O(1) word lookup
- Early termination when dp[n] becomes True

**Time Complexity:** O(n² × m) where n is string length and m is max word length (for substring extraction)
**Space Complexity:** O(n) for the dp array

---

## When to Use
Use this algorithm when you need to solve problems involving:
- dynamic programming related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Implementation

```python
def word_break(s, word_dict):
    """
    Determine if string can be segmented into dictionary words.
    
    Args:
        s: String to segment
        word_dict: List of words (dictionary)
    
    Returns:
        True if s can be segmented into words from word_dict
    
    Time: O(n²) for DP
    Space: O(n) for dp array
    """
    word_set = set(word_dict)  # O(1) lookup
    n = len(s)
    
    # dp[i] = True if s[0:i] can be segmented
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string
    
    for i in range(1, n + 1):
        for j in range(i):
            # If we can segment up to j AND s[j:i] is a word
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break  # Early termination
    
    return dp[n]


# Alternative: BFS approach
def word_break_bfs(s, word_dict):
    """Breadth-first search approach."""
    word_set = set(word_dict)
    n = len(s)
    visited = [False] * (n + 1)
    queue = [0]
    
    while queue:
        start = queue.pop(0)
        
        if start == n:
            return True
        
        if visited[start]:
            continue
        
        visited[start] = True
        
        for end in range(start + 1, n + 1):
            if s[start:end] in word_set:
                queue.append(end)
    
    return False


# Return all possible segmentations
def word_break_all(s, word_dict):
    """Return all possible word segmentations."""
    word_set = set(word_dict)
    n = len(s)
    
    # dp[i] = list of ways to segment s[0:i]
    dp = [[] for _ in range(n + 1)]
    dp[0] = [[]]
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                for partial in dp[j]:
                    dp[i].append(partial + [s[j:i]])
    
    return dp[n]
```

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

---

## Example

**Input:**
```
s = "leetcode"
word_dict = ["leet", "code"]
```

**Output:**
```
True
```

**Explanation:** "leetcode" can be segmented as "leet" + "code"

**Input:**
```
s = "applepenapple"
word_dict = ["apple", "pen"]
```

**Output:**
```
True
```

**Explanation:** "applepenapple" = "apple" + "pen" + "apple"

**Input:**
```
s = "catsandog"
word_dict = ["cats", "dog", "sand", "and", "cat"]
```

**Output:**
```
False
```

**Explanation:** Cannot fully segment - "og" is not in dictionary

**Input:**
```
s = "a"
word_dict = ["a"]
```

**Output:**
```
True
```

**Input - All segmentations:**
```
s = "catsandcat"
word_dict = ["cats", "cat", "and", "sand"]
```

**Output:**
```
[["cats", "and", "cat"], ["cat", "sand", "cat"]]
```

---

## Time Complexity
**O(n²)**

---

## Space Complexity
**O(n)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
