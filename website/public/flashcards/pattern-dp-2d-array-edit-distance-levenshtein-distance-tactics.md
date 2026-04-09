## DP - 2D Array Edit Distance: Tactics

What are practical tactics for solving edit distance problems?

<!-- front -->

---

### Tactic 1: Path Reconstruction (Backtracking)

**Reconstruct the actual operations, not just the count:**

```python
def get_operations(s1, s2, dp):
    """
    Backtrack from dp[m][n] to reconstruct edit sequence.
    Returns list of operations to transform s1 into s2.
    """
    m, n = len(s1), len(s2)
    i, j = m, n
    operations = []
    
    while i > 0 or j > 0:
        if i == 0:
            # Must insert remaining s2 chars
            operations.append(f"Insert '{s2[j-1]}' at position {j}")
            j -= 1
        elif j == 0:
            # Must delete remaining s1 chars
            operations.append(f"Delete '{s1[i-1]}' from position {i}")
            i -= 1
        elif s1[i-1] == s2[j-1]:
            # Characters match - keep it
            operations.append(f"Keep '{s1[i-1]}'")
            i -= 1
            j -= 1
        elif dp[i][j] == dp[i-1][j] + 1:
            # Came from above - deletion
            operations.append(f"Delete '{s1[i-1]}' from position {i}")
            i -= 1
        elif dp[i][j] == dp[i][j-1] + 1:
            # Came from left - insertion
            operations.append(f"Insert '{s2[j-1]}' at position {j}")
            j -= 1
        else:
            # Came from diagonal - replacement
            operations.append(f"Replace '{s1[i-1]}' with '{s2[j-1]}'")
            i -= 1
            j -= 1
    
    return operations[::-1]  # Reverse to get forward order
```

**Use when:** Problem asks for the actual transformation sequence.

---

### Tactic 2: Weighted Operations

**When operations have different costs:**

```python
def min_distance_weighted(s1, s2, delete_cost=1, insert_cost=1, replace_cost=1):
    """
    Edit distance with custom operation costs.
    """
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases with weighted costs
    for i in range(m + 1):
        dp[i][0] = i * delete_cost
    for j in range(n + 1):
        dp[0][j] = j * insert_cost
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = min(
                    dp[i-1][j] + delete_cost,
                    dp[i][j-1] + insert_cost,
                    dp[i-1][j-1] + replace_cost
                )
    
    return dp[m][n]

# Example: Delete=2, Insert=2, Replace=1
# Sometimes cheaper to replace than delete+insert
```

**Common variations:**
- Replace cheaper than delete+insert
- Insert/delete costs vary by character
- Transposition (swap adjacent) as 4th operation (Damerau-Levenshtein)

---

### Tactic 3: Restricted Operations

**Only allow certain operations:**

```python
def min_distance_delete_only(s1, s2):
    """
    Only delete allowed (insert implicitly via other direction).
    This reduces to: len(s1) + len(s2) - 2*LCS
    """
    # Or compute directly:
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1  # LCS length
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    lcs = dp[m][n]
    return (m - lcs) + (n - lcs)  # Deletes from both strings


def min_distance_no_replace(s1, s2):
    """
    Only insert and delete allowed.
    Same result as above (replace = delete + insert).
    """
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                # Only delete and insert, no replace
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]
```

---

### Tactic 4: Early Termination / Pruning

**Stop if distance exceeds threshold:**

```python
def is_one_edit_away(s1: str, s2: str) -> bool:
    """
    Check if edit distance is ≤ 1 (optimized for this specific case).
    """
    m, n = len(s1), len(s2)
    
    # If length diff > 1, need more than 1 edit
    if abs(m - n) > 1:
        return False
    
    found_difference = False
    i = j = 0
    
    while i < m and j < n:
        if s1[i] != s2[j]:
            if found_difference:
                return False  # Second difference found
            found_difference = True
            
            # Skip the longer string's character
            if m > n:
                i += 1
            elif m < n:
                j += 1
            else:
                i += 1
                j += 1
        else:
            i += 1
            j += 1
    
    # Check if one string has extra character at end
    return found_difference or (i < m or j < n)


def min_distance_capped(s1, s2, max_dist):
    """
    Return distance only if ≤ max_dist, else return max_dist+1.
    Early termination optimization.
    """
    m, n = len(s1), len(s2)
    
    # Quick rejection: if length diff > max_dist, impossible
    if abs(m - n) > max_dist:
        return max_dist + 1
    
    # Only keep window of size 2*max_dist+1 around diagonal
    # (Advanced optimization for fuzzy string matching)
    pass
```

---

### Tactic 5: String Swap for Space Optimization

**Always make the shorter string the "row" dimension:**

```python
def min_distance_smart(s1: str, s2: str) -> int:
    """
    Automatically optimize by making shorter string the row.
    """
    # Critical optimization: ensure s1 is shorter
    if len(s1) > len(s2):
        s1, s2 = s2, s1
    
    m, n = len(s1), len(s2)
    
    # Now we only need O(min(m, n)) = O(m) space
    dp = [0] * (m + 1)  # Or however your optimization works
    
    # ... rest of algorithm
    
    return dp[m]
```

**Why this matters:**
- For strings of length 1000 and 10, standard opt uses O(10) = O(10)
- Without swap: O(10) still, but with swap we guarantee it's O(min)
- Some implementations naturally use O(n) where n = len(s2)

---

### Tactic 6: Multiple String Comparison (Batch)

**Compare one string against many:**

```python
def find_closest(query: str, candidates: list[str]) -> str:
    """
    Find candidate with minimum edit distance to query.
    """
    # Preprocess: sort candidates by length (pruning)
    # Use threshold-based early termination
    
    best = None
    best_dist = float('inf')
    
    for cand in candidates:
        # Skip if length diff already exceeds best_dist
        if abs(len(cand) - len(query)) > best_dist:
            continue
        
        dist = min_distance(query, cand)
        if dist < best_dist:
            best_dist = dist
            best = cand
    
    return best
```

<!-- back -->
