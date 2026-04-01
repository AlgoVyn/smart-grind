## Edit Distance: Tactics & Tricks

What are the essential tactics for edit distance problems?

<!-- front -->

---

### Tactic 1: Space Optimization Pattern

```python
def space_optimize_template():
    """
    Standard pattern for reducing 2D DP to 1D
    """
    # For DP[i][j] that only depends on:
    # - dp[i-1][j] (previous row, same col)
    # - dp[i][j-1] (current row, previous col)  
    # - dp[i-1][j-1] (previous row, previous col)
    
    prev = [0] * (n + 1)
    curr = [0] * (n + 1)
    
    for i in range(1, m + 1):
        curr[0] = i  # Base case
        for j in range(1, n + 1):
            # Need prev[j] (dp[i-1][j])
            # Need curr[j-1] (dp[i][j-1])
            # Need prev[j-1] (dp[i-1][j-1])
            
            # Store diagonal before overwriting
            diagonal = prev[j-1]
            
            curr[j] = compute(prev[j], curr[j-1], diagonal)
        
        prev, curr = curr, prev  # Swap for next iteration
```

---

### Tactic 2: Early Termination Optimization

```python
def edit_distance_early_exit(s: str, t: str, max_dist: int) -> int:
    """
    Return early if distance exceeds max_dist
    Useful for spell checking (only care if close enough)
    """
    m, n = len(s), len(t)
    
    if abs(m - n) > max_dist:
        return max_dist + 1  # Can't be within bound
    
    # Only compute band of width 2*max_dist+1 around diagonal
    prev = [float('inf')] * (n + 1)
    curr = [float('inf')] * (n + 1)
    
    for i in range(m + 1):
        # Only compute j in [max(0, i-max_dist), min(n, i+max_dist)]
        start = max(0, i - max_dist)
        end = min(n, i + max_dist) + 1
        
        for j in range(start, end):
            # Standard DP but only in band
            pass
    
    result = prev[n]
    return result if result <= max_dist else max_dist + 1
```

---

### Tactic 3: Transform to LCS

```python
def when_to_use_lcs():
    """
    If only insert/delete (no replace):
    Edit distance = len1 + len2 - 2*LCS
    
    If replace allowed: can't use LCS directly
    """
    pass

def lcs_to_edit_distance():
    """
    LCS is simpler (no +1 for operations)
    But only works when replace not needed
    """
    # LCS recurrence:
    # if match: dp[i][j] = dp[i-1][j-1] + 1
    # else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    pass
```

---

### Tactic 4: String Alignment Visualization

```python
def visualize_alignment(word1: str, word2: str, operations: list):
    """
    Visual understanding of edit operations
    
    Example: "kitten" → "sitting"
    
    kitten      (replace k→s)
    sitten      (replace e→i)
    sittin      (insert g)
    sitting
    
    Align:
    kitten-
    sitting
    ^^^^^^^
    RRIMMR
    (R=Replace, I=Insert, M=Match)
    """
    pass
```

---

### Tactic 5: Bit-Parallel for Small Alphabets

```python
def bit_parallel_edit_distance(s: str, t: str) -> int:
    """
    Myers' bit-parallel algorithm: O(⌈m/w⌉n) where w = word size
    Fast for strings where m <= 64 (or 128, etc.)
    """
    # Compress DP states into bit vectors
    # Myer's algorithm exploits bit parallelism
    # Each column of DP represented as bit differences
    
    # Implementation is complex but very fast for short patterns
    # Used in bioinformatics (e.g., BLAST)
    pass
```

**Use when:** Pattern is short (m <= word size), many comparisons needed.

<!-- back -->
