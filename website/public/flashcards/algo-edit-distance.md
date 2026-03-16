## Edit Distance (Levenshtein)

**Question:** Minimum operations to convert word1 to word2?

<!-- front -->

---

## Answer: Dynamic Programming

### Solution
```python
def minDistance(word1, word2):
    m, n = len(word1), len(word2))
    
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    for i in range(m + 1):
        dp[i][0] = i  # Delete all
    for j in range(n + 1):
        dp[0][j] = j  # Insert all
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # Delete
                    dp[i][j-1],    # Insert
                    dp[i-1][j-1]  # Replace
                )
    
    return dp[m][n]
```

### Visual: DP Table
```
word1 = "horse", word2 = "ros"

    ""  r  o  s
""   0  1  2  3
h    1  1  2  3
o    2  2  1  2
r    3  2  2  2
s    4  3  3  2
e    5  4  4  3

Answer: dp[5][3] = 3
(horse → rorse → rose → ros)
```

### ⚠️ Tricky Parts

#### 1. The Three Operations
```python
# Delete from word1: dp[i-1][j] + 1
# Insert to word1:    dp[i][j-1] + 1
# Replace:           dp[i-1][j-1] + 1

# If chars match: dp[i-1][j-1] (no operation)
```

#### 2. Space Optimization
```python
def minDistance1D(word1, word2):
    m, n = len(word1), len(word2)
    
    # Only need previous row
    prev = list(range(n + 1))
    curr = [0] * (n + 1)
    
    for i in range(1, m + 1):
        curr[0] = i
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                curr[j] = prev[j-1]
            else:
                curr[j] = 1 + min(prev[j], curr[j-1], prev[j-1])
        prev, curr = curr, prev
    
    return prev[n]
```

#### 3. Operations Meaning
```python
# Delete: Remove char from word1
# "kitten" → "sitten" (delete 'k') 

# Insert: Add char to word1  
# "sitten" → "sitting" (insert 'g')

# Replace: Change char in word1
# "sitten" → "sitting" (replace 'e' with 'i')
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| 2D DP | O(m×n) | O(m×n) |
| 1D DP | O(m×n) | O(min(m,n)) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong base cases | Row 0 = j, Col 0 = i |
| Wrong indices | Use i-1, j-1 for chars |
| Using wrong min | Compare 3 operations |

<!-- back -->
