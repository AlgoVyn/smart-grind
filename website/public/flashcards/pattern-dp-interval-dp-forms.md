## DP - Interval DP: Forms & Variations

What are the different forms of Interval DP problems?

<!-- front -->

---

### Form 1: Standard Interval Partition

```python
def matrix_chain_multiplication(dims):
    """
    Find optimal parenthesization for matrix chain.
    dims[i] = dimensions of matrix i (rows) and i+1 (cols)
    """
    n = len(dims) - 1  # Number of matrices
    
    # dp[i][j] = min cost to multiply matrices i to j
    dp = [[0] * n for _ in range(n)]
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            
            for k in range(i, j):
                # Cost = left + right + multiplication cost
                cost = dp[i][k] + dp[k + 1][j] + \
                       dims[i] * dims[k + 1] * dims[j + 1]
                dp[i][j] = min(dp[i][j], cost)
    
    return dp[0][n - 1]

# Trace for dims = [10, 30, 5, 60]
# Matrices: A(10x30), B(30x5), C(5x60)
# dp[0][1] = 10*30*5 = 1500 (A*B)
# dp[1][2] = 30*5*60 = 9000 (B*C)
# dp[0][2] = min(
#     dp[0][0] + dp[1][2] + 10*30*60,  # (A)*(B*C)
#     dp[0][1] + dp[2][2] + 10*5*60    # (A*B)*(C)
# ) = min(0 + 9000 + 18000, 1500 + 0 + 3000) = 4500
```

---

### Form 2: Last Operation (Burst Balloons)

```python
def max_coins(nums):
    """
    Burst balloons to maximize coins.
    Key: Think about which balloon bursts LAST.
    """
    n = len(nums)
    balloons = [1] + nums + [1]
    
    # dp[i][j] = max coins from bursting all in (i, j)
    dp = [[0] * (n + 2) for _ in range(n + 2)]
    
    for length in range(1, n + 1):
        for left in range(1, n - length + 2):
            right = left + length - 1
            
            for k in range(left, right + 1):
                # k is the LAST balloon to burst
                coins = balloons[left - 1] * balloons[k] * balloons[right + 1]
                coins += dp[left][k - 1] + dp[k + 1][right]
                dp[left][right] = max(dp[left][right], coins)
    
    return dp[1][n]

# Trace for nums = [3, 1, 5, 8]
# dp[1][1]: burst 3 last → 1*3*1 = 9? No wait...
# Actually: left-1=0 (val=1), right+1=2 (val=1), k=1 (val=3)
# coins = 1 * 3 * 1 = 3, but need empty intervals
# dp[1][1] = 1*3*1 = 3
# dp[1][2]: burst 3 last → 1*3*5 + dp[2][2] = 15 + 5 = 20
#           burst 1 last → 1*1*5 + dp[1][1] = 5 + 3 = 8
# Result: max(20, 8) = 20
```

---

### Form 3: Palindrome Partitioning

```python
def min_cut(s):
    """
    Minimum cuts for palindrome partitioning.
    Uses precomputation + 1D DP variant.
    """
    n = len(s)
    
    # Precompute palindrome table
    is_pal = [[False] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):
        for j in range(i, n):
            if s[i] == s[j] and (j - i < 2 or is_pal[i + 1][j - 1]):
                is_pal[i][j] = True
    
    # dp[i] = min cuts for s[0:i+1]
    dp = [float('inf')] * n
    
    for i in range(n):
        if is_pal[0][i]:
            dp[i] = 0
        else:
            for j in range(i):
                if is_pal[j + 1][i]:
                    dp[i] = min(dp[i], dp[j] + 1)
    
    return dp[n - 1]

# Trace for s = "aab"
# is_pal: [0,0]=T, [0,1]=F, [0,2]=F
#         [1,1]=T, [1,2]=F
#         [2,2]=T
# dp[0] = 0 ("a" is palindrome)
# dp[1]: not palindrome, check j=0: is_pal[1,1]=T → dp[1]=dp[0]+1=1
# dp[2]: not palindrome, check j=0: is_pal[1,2]=F, j=1: is_pal[2,2]=T → dp[2]=dp[1]+1=2
# Result: 1 (cut: "aa"|"b" not "a"|"a"|"b")
```

---

### Form 4: Longest Palindromic Subsequence

```python
def longest_palindrome_subseq(s):
    """
    LPS using interval DP.
    """
    n = len(s)
    
    # dp[i][j] = LPS length in s[i:j+1]
    dp = [[0] * n for _ in range(n)]
    
    # Base: single character
    for i in range(n):
        dp[i][i] = 1
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            if s[i] == s[j]:
                # Match found: add 2 to inner LPS
                dp[i][j] = 2 + (dp[i + 1][j - 1] if length > 2 else 0)
            else:
                # No match: take best of either side
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
    
    return dp[0][n - 1]

# Trace for s = "bbbab"
# dp[0][0..4] = 1 (base)
# dp[1][1..4] = 1, etc.
# length=2: [0,1]=b,b match → 2, [1,2]=b,b → 2, etc.
# length=3: [0,2]=b,b,b → 3, [1,3]=b,b,a → max(2,2)=2
# length=5: [0,4]=b,b,b,a,b → s[0]==s[4] → 2+dp[1][3]=2+2=4
# Result: 4 ("bbbb" or "bab")
```

---

### Form 5: Predict the Winner (Game Theory)

```python
def predict_winner(nums):
    """
    Game theory on intervals. Two players take turns picking ends.
    """
    n = len(nums)
    
    # dp[i][j] = max score difference (current - opponent) for interval [i,j]
    dp = [[0] * n for _ in range(n)]
    
    # Base: single element
    for i in range(n):
        dp[i][i] = nums[i]
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            # Pick left or right, opponent plays optimally on remainder
            pick_left = nums[i] - dp[i + 1][j]
            pick_right = nums[j] - dp[i][j - 1]
            dp[i][j] = max(pick_left, pick_right)
    
    return dp[0][n - 1] >= 0  # True if player 1 can win

# Trace for nums = [1, 5, 2]
# dp[0][0]=1, dp[1][1]=5, dp[2][2]=2
# dp[0][1]: pick_left=1-5=-4, pick_right=5-1=4 → max=4
# dp[1][2]: pick_left=5-2=3, pick_right=2-5=-3 → max=3
# dp[0][2]: pick_left=1-3=-2, pick_right=2-4=-2 → max=-2
# Result: False (player 2 wins)
```

---

### Form 6: Remove Boxes with Consecutive Groups

```python
def remove_boxes(boxes):
    """
    Remove boxes for max points. Consecutive same-color boxes give more points.
    dp[i][j][k] = max points removing boxes[i:j+1] with k same-color boxes
                  appended to the left of boxes[i]
    """
    n = len(boxes)
    
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def solve(i, j, k):
        if i > j:
            return 0
        
        # Count consecutive boxes same color as boxes[i]
        count = k
        while i + 1 <= j and boxes[i + 1] == boxes[i]:
            i += 1
            count += 1
        
        # Option 1: Remove current group now
        result = count * count + solve(i + 1, j, 0)
        
        # Option 2: Try to merge with same color later
        for m in range(i + 1, j + 1):
            if boxes[m] == boxes[i]:
                # Keep current, solve middle, then merge
                result = max(result, 
                    solve(i + 1, m - 1, 0) + solve(m, j, count))
        
        return result
    
    return solve(0, n - 1, 0)
```

---

### Form Comparison

| Form | State | Key Idea | Time |
|------|-------|----------|------|
| Standard | `dp[i][j]` | Partition at k | O(n³) |
| Last Operation | `dp[i][j]` | What happens last | O(n³) |
| Palindrome | `dp[i]` + precompute | Precompute + linear | O(n²) |
| LPS | `dp[i][j]` | Match ends or skip | O(n²) |
| Game Theory | `dp[i][j]` | Score difference | O(n²) |
| With Groups | `dp[i][j][k]` | Track consecutive count | O(n⁴) |

<!-- back -->
