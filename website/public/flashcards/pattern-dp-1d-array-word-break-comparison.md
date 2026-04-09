## DP - 1D Array (Word Break): Comparison

When should you use different approaches for Word Break problems?

<!-- front -->

---

### Approach Comparison Matrix

| Aspect | Basic DP | Trie + DP | DFS + Memo | BFS |
|--------|----------|-----------|------------|-----|
| **Time** | O(n² × m) | O(n × L) | O(n² × m) | O(n² × m) |
| **Space** | O(n) | O(n + D) | O(n) stack | O(n) |
| **Code Simplicity** | Simple | Complex | Medium | Medium |
| **All Solutions** | Hard | Hard | Natural | Hard |
| **Early Termination** | Partial | Good | Excellent | Partial |

*Where: n = string length, m = avg word length, L = max word length, D = total chars in dict*

---

### When to Use Each Approach

**Basic Bottom-Up DP:**
```
✅ Use when:
   - Just need True/False answer
   - Standard interview setting
   - Want iterative (no recursion stack risk)
   - String length is moderate (< 1000)
```

**Trie + DP:**
```
✅ Use when:
   - Dictionary is very large (10k+ words)
   - Many words share common prefixes
   - Performing multiple queries on same dictionary
   - Need to optimize repeated substring checks
```

**DFS + Memoization:**
```
✅ Use when:
   - Need to enumerate all valid segmentations
   - Problem requires reconstruction
   - Prefer recursive thinking
   - Can short-circuit early on first valid path
```

**BFS:**
```
✅ Use when:
   - Want level-by-level exploration
   - Need shortest segmentation (min words)
   - Alternative to iterative DP for variety
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| Simple existence check | Basic DP | Clean, fast, standard |
| List all sentences | DFS + Memo | Natural recursion for building paths |
| Large dictionary, many queries | Trie | Preprocessing pays off |
| Memory constrained | Basic DP | Minimal extra space |
| Very long strings | Trie or BFS | Better pruning opportunities |

---

### Greedy vs DP

**Does Greedy work for Word Break?**

```python
# Greedy attempt (DOESN'T WORK)
def greedy_word_break(s, word_dict):
    word_set = set(word_dict)
    i = 0
    while i < len(s):
        found = False
        # Try longest match first
        for end in range(len(s), i, -1):
            if s[i:end] in word_set:
                i = end
                found = True
                break
        if not found:
            return False
    return True
```

**Counter-example:**
- s = "aaaaaaa", wordDict = ["aaaa", "aa"]
- Greedy (longest): "aaaa" + "aa" + ? (fails on last 'a')
- But valid: "aa" + "aa" + "aa" + "a"? No... actually "aaaa" + "aaa" fails too
- Let me reconsider: "aaaa" + "aa" + "a" - "a" not in dict
- Actually valid: "aa" + "aa" + "aa" + "a" - no "a"
- Wait, let me recheck: wordDict = ["aaaa", "aa"], s = "aaaaaaa" (7 a's)
- "aaaa" + "aa" = 6 chars, 1 'a' left (not valid)
- "aa" + "aa" + "aa" + "a" = 6 + 1, invalid
- Actually s = "aaaaaaa" cannot be segmented with this dict!

**Correct example:**
- s = "catsanddog", wordDict = ["cat", "cats", "and", "sand", "dog"]
- Greedy longest: "cats" + "and" + "dog" ✓ (works here)
- But greedy could fail on: s = "aaaa", dict = ["a", "aa", "aaa"]
- Greedy: "aaa" + ? (fails), but "aa" + "aa" works

**Rule:** Always use DP for correctness.

---

### Common Pitfalls by Approach

| Approach | Common Mistake | Fix |
|----------|----------------|-----|
| Basic DP | Not using set for wordDict | Convert to `set(wordDict)` first |
| Basic DP | Wrong base case | `dp[0] = True`, not `dp[0] = False` |
| Trie | Not checking `dp[i]` before traversing | Add `if not dp[i]: continue` |
| DFS | No memoization | Add `@lru_cache` or manual memo |
| All | Off-by-one in substring | `s[j:i]` gives chars from j to i-1 |

<!-- back -->
