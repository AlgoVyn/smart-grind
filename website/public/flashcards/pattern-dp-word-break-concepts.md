## DP - Word Break: Core Concepts

What are the fundamental principles of word break?

<!-- front -->

---

### Core Concept

**dp[i] represents whether the substring s[0:i] can be segmented into valid dictionary words. Build up from empty string to full string.**

**Example:**
```
s = "leetcode", dict = ["leet", "code"]

dp[0] = True (empty string)

i=4: "leet" in dict, dp[0]=True → dp[4]=True
i=8: "code" in dict, dp[4]=True → dp[8]=True

Result: dp[8]=True
```

---

### The Pattern

```
For each position i:
  Check all possible previous positions j:
    If s[0:j] is valid (dp[j]) AND s[j:i] is in dict:
      Then s[0:i] is valid (dp[i] = True)

This checks every possible last word ending at i.
```

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n² × m) | n=string length, m=max word length |
| Space | O(n) | DP array |
| Lookup | O(1) | Using hash set |

---

### Key Insight

**The problem has optimal substructure**: If we can segment up to position j, and there's a valid word from j to i, then we can segment up to i.

<!-- back -->
