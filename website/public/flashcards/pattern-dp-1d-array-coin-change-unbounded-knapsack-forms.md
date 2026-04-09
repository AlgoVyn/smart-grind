## DP - 1D Array (Coin Change / Unbounded Knapsack): Forms & Variations

What are the different forms and variations of Coin Change / Unbounded Knapsack problems?

<!-- front -->

---

### Form 1: Minimum Number of Coins

**LeetCode 322 - Coin Change**
```python
def coin_change_min(coins, amount):
    """Find minimum coins to make amount."""
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1

# Example: coins=[1,2,5], amount=11
# Result: 3 (5+5+1)
```

---

### Form 2: Number of Ways (Combinations)

**LeetCode 518 - Coin Change II**
```python
def coin_change_ways(coins, amount):
    """Count combinations (order doesn't matter)."""
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    # Coin outer = combinations
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    
    return dp[amount]

# Example: coins=[1,2,5], amount=5
# Ways: [1,1,1,1,1], [1,1,1,2], [1,2,2], [5]
# Result: 4
```

---

### Form 3: Number of Ways (Permutations)

**LeetCode 377 - Combination Sum IV**
```python
def coin_change_permutations(coins, amount):
    """Count permutations (order matters)."""
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    # Amount outer = permutations
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] += dp[i - coin]
    
    return dp[amount]

# Example: coins=[1,2,3], amount=4
# Some permutations: [1,1,1,1], [1,1,2], [1,2,1], [2,1,1], [2,2], [1,3], [3,1]
# Result: 7
```

---

### Form 4: Unbounded Knapsack (Maximize Value)

**Standard unbounded knapsack:**
```python
def unbounded_knapsack(values, weights, W):
    """Maximize value with unlimited items."""
    dp = [0] * (W + 1)
    
    for w in range(1, W + 1):
        for i in range(len(values)):
            if weights[i] <= w:
                dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[W]
```

---

### Form 5: Rod Cutting

**Maximize value when cutting rod:**
```python
def rod_cutting(prices, n):
    """
    prices[i] = value of piece of length i+1
    Maximize value from rod of length n
    """
    dp = [0] * (n + 1)
    
    for length in range(1, n + 1):
        for cut_len in range(1, length + 1):
            if cut_len <= len(prices):
                dp[length] = max(dp[length], 
                                dp[length - cut_len] + prices[cut_len - 1])
    
    return dp[n]

# Example: prices=[1,5,8,9], n=4
# Best: cut into 2+2, value = 5+5 = 10
```

---

### Form 6: Perfect Squares

**LeetCode 279 - Perfect Squares**
```python
def num_squares(n):
    """Minimum number of perfect squares that sum to n."""
    # Precompute squares as "coins"
    squares = [i * i for i in range(1, int(n**0.5) + 1)]
    
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    
    for i in range(1, n + 1):
        for sq in squares:
            if sq > i:
                break
            dp[i] = min(dp[i], dp[i - sq] + 1)
    
    return dp[n]

# Example: n=12
# 12 = 4 + 4 + 4 (3 squares)
# Not 9 + 1 + 1 + 1 (4 squares)
# Result: 3
```

---

### Form 7: Minimum Cost for Tickets

**LeetCode 983 - Minimum Cost For Tickets**
```python
def mincost_tickets(days, costs):
    """
    costs[0] = 1-day pass
    costs[1] = 7-day pass  
    costs[2] = 30-day pass
    """
    last_day = days[-1]
    dp = [0] * (last_day + 1)
    day_set = set(days)
    
    for i in range(1, last_day + 1):
        if i not in day_set:
            dp[i] = dp[i - 1]
        else:
            dp[i] = min(
                dp[i - 1] + costs[0],      # 1-day
                dp[max(0, i - 7)] + costs[1],   # 7-day
                dp[max(0, i - 30)] + costs[2]   # 30-day
            )
    
    return dp[last_day]
```

---

### Form 8: 2 Keys Keyboard

**LeetCode 650 - 2 Keys Keyboard**
```python
def min_steps(n):
    """Minimum steps to get n 'A's (copy-all and paste)."""
    dp = [float('inf')] * (n + 1)
    dp[1] = 0
    
    for i in range(2, n + 1):
        # Try all divisors
        for j in range(1, int(i**0.5) + 1):
            if i % j == 0:
                # Copy at j, paste (i/j - 1) times
                dp[i] = min(dp[i], dp[j] + i // j)
                # Copy at i/j, paste (j - 1) times  
                dp[i] = min(dp[i], dp[i // j] + j)
    
    return dp[n]
```

---

### Form 9: Integer Break

**LeetCode 343 - Integer Break**
```python
def integer_break(n):
    """Maximize product by breaking integer into sum of integers >= 2."""
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        for j in range(1, i):
            # Break into j and (i-j), or further break (i-j)
            dp[i] = max(dp[i], j * (i - j), j * dp[i - j])
    
    return dp[n]
```

---

### Summary Table

| Problem | Goal | DP Meaning | Special Notes |
|---------|------|-----------|---------------|
| Coin Change (Min) | Minimize | dp[i] = min coins | Return -1 if impossible |
| Coin Change II | Count combinations | dp[i] += dp[i-coin] | Coin outer loop |
| Combination Sum IV | Count permutations | dp[i] += dp[i-coin] | Amount outer loop |
| Unbounded Knapsack | Maximize value | dp[w] = max | Forward iteration |
| Rod Cutting | Maximize value | dp[len] = max | Prices per length |
| Perfect Squares | Minimize count | dp[i] = min | Squares as coins |
| Min Cost Tickets | Minimize cost | dp[day] = min | Travel day constraint |
| 2 Keys Keyboard | Minimize steps | dp[n] = min | Divisors as "coins" |
| Integer Break | Maximize product | dp[i] = max | Can break further |

<!-- back -->
