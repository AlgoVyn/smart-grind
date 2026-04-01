## Title: Word Break - Comparison Guide

How does Word Break DP compare to other string/segmentation algorithms?

<!-- front -->

---

### String Segmentation Algorithm Comparison

| Algorithm | Time | Space | Use Case |
|-----------|------|-------|----------|
| **Naive recursive** | O(2^n) | O(n) | Never use |
| **Memoization (top-down)** | O(n³) | O(n) | Sparse valid splits |
| **DP bottom-up** | O(n²) | O(n) | Dense valid splits |
| **DP + Trie** | O(n²) | O(n + TW) | Large dictionary |
| **BFS** | O(n²) | O(n) | Find any path quickly |
| **A* / Heuristic** | O(n²) avg | O(n) | Very long strings |

**Where n = string length, T = dictionary size, W = average word length**

---

### Word Break vs Palindrome Partitioning

| Aspect | Word Break | Palindrome Partition |
|--------|------------|---------------------|
| **Dictionary** | External wordDict | Implicit (palindromes) |
| **Check** | `s[j:i] in dict` | `is_palindrome(s[j:i])` |
| **Preprocessing** | Set for O(1) lookup | DP table for palindrome |
| **Time** | O(n²) | O(n²) |
| **Space** | O(n + D) | O(n²) for palindrome table |

```python
# Word Break
dp[i] = any(dp[j] and s[j:i] in word_set for j in range(i))

# Palindrome Partition
dp[i] = min(dp[j] + 1 for j in range(i) if is_pal[j][i-1])
```

---

### Word Break vs Regular Expression

| Aspect | Word Break | Regex Matching |
|--------|------------|----------------|
| **Pattern** | OR of literal words | Complex patterns |
| **Engine** | DP segmentation | NFA/DFA simulation |
| **Backrefs** | No | Yes |
| **Optimization** | Word length pruning | State minimization |
| **Expressiveness** | Limited | Turing complete |

```python
# Word Break: s matches word1|word2|...
# Regex: re.fullmatch('|'.join(wordDict), s)
# Word Break DP is faster for this specific case
```

---

### Decision vs Count vs Reconstruction

| Variant | DP State | Time | Space |
|---------|----------|------|-------|
| **Decision** | `dp[i] : bool` | O(n²) | O(n) |
| **Count** | `dp[i] : int` | O(n²) | O(n) |
| **Reconstruction** | `dp[i] : List[int]` | O(n² + k·n) | O(n²) |

**k = number of valid segmentations (can be exponential)**

```python
# Decision: Early terminate
if dp[j] and s[j:i] in word_set:
    dp[i] = True
    break  # Found one, stop

# Count: Sum all
if dp[j] and s[j:i] in word_set:
    dp[i] += dp[j]  # Add all ways

# Reconstruction: Store predecessors
dp[i].append(j)  # j is a valid split point
```

---

### Dictionary Data Structure Comparison

| Structure | Build | Lookup | Best For |
|-----------|-------|--------|----------|
| **Hash Set** | O(TW) | O(W) avg | Small-medium dict |
| **Trie** | O(TW) | O(W) | Large dict, prefix sharing |
| **Double-array Trie** | O(TW) | O(W) | Very large dict |
| **Aho-Corasick** | O(TW) | O(n) total | Multiple pattern matching |
| **Bloom Filter** | O(T) | O(1) | Probabilistic (may have false positive) |

```python
# For Word Break II with many queries on same dict:
# Build Trie once, reuse for all queries
```

<!-- back -->
