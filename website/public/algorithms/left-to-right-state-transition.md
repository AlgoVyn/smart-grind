# Left to Right State Transition

## Category
Dynamic Programming

## Description

Left-to-Right State Transition is a dynamic programming pattern where we scan an array from left to right, maintaining a small set of state variables that capture the best outcome up to each position. The state transitions based on the current element and previous state values, allowing us to solve sequential decision problems efficiently.

This pattern is particularly powerful for problems involving sequential choices (like house robber or stock trading), state machines (like sell/hold/rest states), and "best so far" tracking. By only keeping necessary previous states instead of a full DP table, we often achieve O(1) space complexity while maintaining O(n) time complexity, making it one of the most space-efficient DP techniques.

---

## Concepts

The left-to-right state transition pattern is built on several fundamental concepts.

### 1. State Definition

What each state variable represents:

| State Type | Meaning | Example |
|------------|---------|---------|
| **Single State** | Best value so far | max_profit = max(max_profit, price - min_price) |
| **Two States** | Choose/Skip decision | max(rob_current, skip_current) |
| **Multiple States** | Complex state machine | hold, sold, rest for stock problems |

### 2. Transition Equations

How states update based on current element:

| Problem | Transition |
|---------|------------|
| **Max Profit** | min_price = min(min_price, price)<br>max_profit = max(max_profit, price - min_price) |
| **House Robber** | curr = max(prev1, prev2 + num)<br>prev2, prev1 = prev1, curr |
| **Stock Cooldown** | hold = max(hold, rest - price)<br>sold = hold + price<br>rest = max(rest, prev_sold) |

### 3. Rolling State Optimization

Only keeping necessary previous states:

```
Full DP: dp[i] depends on dp[i-1], dp[i-2]
Optimized: Keep prev1, prev2 only

Space reduction: O(n) → O(1)
```

### 4. State Machine Patterns

Common state transition patterns:

| Pattern | States | Use Case |
|---------|--------|----------|
| **Single Variable** | 1 (best so far) | Running max/min |
| **Two Variables** | 2 (pick/skip) | Binary choice at each step |
| **K Variables** | k states | K-ary decisions |
| **Cyclic States** | n states → state 0 | Periodic patterns |

---

## Frameworks

Structured approaches for implementing left-to-right state transition.

### Framework 1: Two-State Rolling Framework

```
┌─────────────────────────────────────────────────────────────┐
│  TWO-STATE ROLLING FRAMEWORK                                  │
├─────────────────────────────────────────────────────────────┤
│  For problems with binary choice (pick/skip, rob/skip):     │
│                                                                │
│  Initialize:                                                   │
│    prev = 0  # dp[i-2] or base case                          │
│    curr = 0  # dp[i-1]                                       │
│                                                                │
│  For each element:                                            │
│    next_val = max(curr, prev + element)                      │
│    prev = curr                                                │
│    curr = next_val                                            │
│                                                                │
│  Return: curr                                                  │
│                                                                │
│  Examples: House Robber, Delete and Earn                     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Binary choice at each step (pick/skip, rob/not rob).

### Framework 2: State Machine Framework

```
┌─────────────────────────────────────────────────────────────┐
│  STATE MACHINE FRAMEWORK                                      │
├─────────────────────────────────────────────────────────────┤
│  For problems with multiple states and transitions:         │
│                                                                │
│  Define states based on problem:                              │
│    Example (Stock with Cooldown):                             │
│      hold: max profit with stock in hand                     │
│      sold: max profit just sold stock                        │
│      rest: max profit in cooldown/no stock                   │
│                                                                │
│  For each element:                                            │
│    new_hold = max(hold, rest - price)                        │
│    new_sold = hold + price                                    │
│    new_rest = max(rest, sold)                                │
│                                                                │
│    hold, sold, rest = new_hold, new_sold, new_rest          │
│                                                                │
│  Return: max(sold, rest)                                      │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Complex state transitions (stock trading with constraints).

### Framework 3: Running Best Framework

```
┌─────────────────────────────────────────────────────────────┐
│  RUNNING BEST FRAMEWORK                                       │
├─────────────────────────────────────────────────────────────┤
│  For tracking best value seen so far:                       │
│                                                                │
│  Initialize:                                                   │
│    best = initial_value                                       │
│    current_metric = initial                                   │
│                                                                │
│  For each element:                                            │
│    Update metric based on element                            │
│    best = max/min(best, metric)                             │
│                                                                │
│  Return: best                                                  │
│                                                                │
│  Examples: Max Profit (min price so far), Max Subarray       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Tracking best value relative to running metric (min price, max sum).

---

## Forms

Different manifestations of the left-to-right state transition pattern.

### Form 1: Single State (Running Best)

Track one optimal value.

| Problem | State | Transition |
|---------|-------|------------|
| **Max Profit** | max_profit | max(max_profit, price - min_price) |
| **Max Subarray** | max_ending_here | max(element, max_ending_here + element) |
| **Min Price** | min_price | min(min_price, price) |

### Form 2: Two States (Pick/Skip)

Binary decision at each step.

| Problem | States | Transition |
|---------|--------|------------|
| **House Robber** | prev2, prev1 | curr = max(prev1, prev2 + num) |
| **Delete and Earn** | prev, curr | curr = max(curr, prev + points) |
| **Binary Choice** | take, skip | New values based on constraints |

### Form 3: Three States (State Machine)

Complex transitions between states.

| Problem | States | Use Case |
|---------|--------|----------|
| **Stock Cooldown** | hold, sold, rest | Trading with cooldown |
| **Stock with Fee** | hold, cash | Transaction fee handling |
| **Paint House** | r, g, b (last color) | Adjacent constraint |

### Form 4: K States (K Transactions)

Generalized to k parallel decisions.

| Problem | States | Complexity |
|---------|--------|------------|
| **Stock IV (k transactions)** | 2*k states | O(n*k) time |
| **K Consecutive Constraints** | k tracking vars | O(n*k) space |

### Form 5: Circular States

Periodic or cyclic patterns.

| Problem | Pattern | Handling |
|---------|---------|----------|
| **Circular House Robber** | First connected to last | Two passes with/without first |
| **Rotating Array** | Index modulo n | State tracks position |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Best Time to Buy and Sell Stock

Classic single-state tracking:

```python
def max_profit(prices):
    """
    LeetCode 121: Best Time to Buy and Sell Stock.
    Time: O(n), Space: O(1)
    """
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        # Update minimum price seen so far
        min_price = min(min_price, price)
        # Maximum profit if selling at current price
        max_profit = max(max_profit, price - min_price)
    
    return max_profit
```

### Tactic 2: House Robber Pattern

Two-state rolling optimization:

```python
def rob(nums):
    """
    LeetCode 198: House Robber.
    Max money without robbing adjacent houses.
    Time: O(n), Space: O(1)
    """
    prev2 = 0  # dp[i-2]
    prev1 = 0  # dp[i-1]
    
    for num in nums:
        # Either rob current (prev2 + num) or skip (prev1)
        curr = max(prev1, prev2 + num)
        prev2 = prev1
        prev1 = curr
    
    return prev1
```

### Tactic 3: Stock with Cooldown (3 States)

State machine pattern:

```python
def max_profit_with_cooldown(prices):
    """
    LeetCode 309: Best Time to Buy and Sell Stock with Cooldown.
    States: hold, sold, rest.
    Time: O(n), Space: O(1)
    """
    hold = float('-inf')  # Max profit holding stock
    sold = 0              # Max profit just sold
    rest = 0              # Max profit in cooldown/rest
    
    for price in prices:
        prev_sold = sold
        # Transition: can sell if holding, can rest or buy if resting
        hold = max(hold, rest - price)  # Keep holding or buy
        sold = hold + price              # Sell what we held
        rest = max(rest, prev_sold)      # Rest or enter cooldown
    
    return max(sold, rest)
```

### Tactic 4: Maximum Subarray (Kadane's)

Running best with restart:

```python
def max_subarray(nums):
    """
    LeetCode 53: Maximum Subarray (Kadane's Algorithm).
    Time: O(n), Space: O(1)
    """
    max_ending_here = max_so_far = nums[0]
    
    for num in nums[1:]:
        # Either extend previous or start new subarray
        max_ending_here = max(num, max_ending_here + num)
        max_so_far = max(max_so_far, max_ending_here)
    
    return max_so_far
```

### Tactic 5: Stock with K Transactions

Generalized k-state pattern:

```python
def max_profit_k_transactions(prices, k):
    """
    LeetCode 188: Best Time to Buy and Sell Stock IV.
    Time: O(n*k), Space: O(k)
    """
    if k >= len(prices) // 2:
        # Unlimited transactions
        return sum(max(0, prices[i] - prices[i-1]) for i in range(1, len(prices)))
    
    # hold[i] = max profit with i transactions, holding stock
    # cash[i] = max profit with i transactions, not holding
    hold = [-float('inf')] * (k + 1)
    cash = [0] * (k + 1)
    
    for price in prices:
        for i in range(1, k + 1):
            hold[i] = max(hold[i], cash[i-1] - price)
            cash[i] = max(cash[i], hold[i] + price)
    
    return cash[k]
```

---

## Python Templates

### Template 1: Best Time to Buy and Sell Stock

```python
def max_profit(prices: list[int]) -> int:
    """
    LeetCode 121: Best Time to Buy and Sell Stock.
    Find maximum profit with single buy and sell.
    
    Args:
        prices: List of stock prices by day
    
    Returns:
        Maximum profit possible
        
    Time: O(n)
    Space: O(1)
    """
    if not prices:
        return 0
    
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    
    return max_profit
```

### Template 2: House Robber

```python
def rob(nums: list[int]) -> int:
    """
    LeetCode 198: House Robber.
    Maximize loot without robbing adjacent houses.
    
    Args:
        nums: Money in each house
    
    Returns:
        Maximum money that can be robbed
        
    Time: O(n)
    Space: O(1)
    """
    prev2 = 0  # dp[i-2]
    prev1 = 0  # dp[i-1]
    
    for num in nums:
        curr = max(prev1, prev2 + num)
        prev2 = prev1
        prev1 = curr
    
    return prev1
```

### Template 3: House Robber II (Circular)

```python
def rob_circular(nums: list[int]) -> int:
    """
    LeetCode 213: House Robber II.
    Houses are in a circle (first and last adjacent).
    
    Args:
        nums: Money in each house
    
    Returns:
        Maximum money that can be robbed
        
    Time: O(n)
    Space: O(1)
    """
    if len(nums) == 1:
        return nums[0]
    
    def rob_linear(houses):
        prev2, prev1 = 0, 0
        for num in houses:
            curr = max(prev1, prev2 + num)
            prev2, prev1 = prev1, curr
        return prev1
    
    # Max of: rob 0..n-2 OR rob 1..n-1
    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))
```

### Template 4: Stock with Cooldown

```python
def max_profit_with_cooldown(prices: list[int]) -> int:
    """
    LeetCode 309: Best Time to Buy and Sell Stock with Cooldown.
    After selling, must wait one day before buying.
    
    Args:
        prices: List of stock prices
    
    Returns:
        Maximum profit
        
    Time: O(n)
    Space: O(1)
    """
    hold = float('-inf')  # Max profit holding stock
    sold = 0              # Max profit just sold
    rest = 0              # Max profit in rest/cooldown
    
    for price in prices:
        prev_sold = sold
        hold = max(hold, rest - price)
        sold = hold + price
        rest = max(rest, prev_sold)
    
    return max(sold, rest)
```

### Template 5: Stock with Transaction Fee

```python
def max_profit_with_fee(prices: list[int], fee: int) -> int:
    """
    LeetCode 714: Best Time to Buy and Sell Stock with Transaction Fee.
    Pay fee when selling.
    
    Args:
        prices: List of stock prices
        fee: Transaction fee per sale
    
    Returns:
        Maximum profit
        
    Time: O(n)
    Space: O(1)
    """
    hold = -prices[0]  # Max profit holding stock
    cash = 0           # Max profit not holding
    
    for price in prices[1:]:
        hold = max(hold, cash - price)
        cash = max(cash, hold + price - fee)
    
    return cash
```

### Template 6: General State Transition Template

```python
def state_transition(arr: list, transition_fn, initial_states):
    """
    Generic left-to-right state transition.
    
    Args:
        arr: Input array
        transition_fn: Function(current_element, states) -> new_states
        initial_states: Starting state values
    
    Returns:
        Final states
    """
    states = initial_states
    
    for element in arr:
        states = transition_fn(element, states)
    
    return states

# Example usage for House Robber
def house_robber_transition(num, states):
    prev2, prev1 = states
    curr = max(prev1, prev2 + num)
    return (prev1, curr)

# result = state_transition(nums, house_robber_transition, (0, 0))
```

---

## When to Use

Use Left-to-Right State Transition when you need to solve problems involving:

- **Sequential Decisions**: Making optimal choices as you scan through data
- **State Machines**: Problems with distinct states and transitions
- **Running Optimization**: Tracking best/minimum/maximum up to each point
- **Rolling DP**: When only recent states are needed, not full history
- **Linear Scanning**: Single-pass solutions with O(1) space

### Comparison with Full DP

| Aspect | Left-to-Right State | Full DP Table |
|--------|-------------------|---------------|
| **Space** | O(1) or O(k) | O(n) or O(n×k) |
| **Time** | O(n) or O(n×k) | Same |
| **Applicability** | Limited (only need recent) | Universal |
| **Readability** | Can be cryptic | Clear dependency chain |
| **Debugging** | Harder | Easier |

### When to Choose Each Approach

- **Choose State Transition** when:
  - dp[i] only depends on dp[i-1], dp[i-2], ..., dp[i-k] for small k
  - Space efficiency is critical
  - Comfortable with rolling variable technique

- **Choose Full DP Table** when:
  - Dependencies are complex or non-linear
  - Need to reconstruct solution path
  - Debugging the solution
  - Space is not a constraint

---

## Algorithm Explanation

### Core Concept

The left-to-right state transition pattern maintains a minimal set of state variables that capture all necessary information from previous elements. Instead of storing the entire DP table, we keep only what matters for future decisions, achieving dramatic space savings.

### How It Works

#### Step 1: Identify State Variables

Determine what information is needed from previous steps:
```python
# House Robber: only need last two values
# Stock: need minimum price seen so far
# Complex: need multiple state variables
```

#### Step 2: Define Transitions

Write how states update for each new element:
```python
# Example: House Robber
curr = max(prev_robbed, prev_skipped + house_value)
new_prev_robbed = curr
new_prev_skipped = prev_robbed
```

#### Step 3: Implement Rolling Update

Use tuple unpacking or temp variables:
```python
# Pythonic rolling update
prev2, prev1 = prev1, curr

# Or with tuple unpacking
prev2, prev1 = prev1, max(prev1, prev2 + num)
```

### Visual Representation

**House Robber State Evolution:**
```
Houses: [2, 7, 9, 3, 1]

Step 0: prev2=0, prev1=0
Step 1 (2): curr=max(0, 0+2)=2, prev2=0, prev1=2
Step 2 (7): curr=max(2, 0+7)=7, prev2=2, prev1=7
Step 3 (9): curr=max(7, 2+9)=11, prev2=7, prev1=11
Step 4 (3): curr=max(11, 7+3)=11, prev2=11, prev1=11
Step 5 (1): curr=max(11, 11+1)=12, prev2=11, prev1=12

Result: 12
```

### Why It Works

1. **Optimal Substructure**: Current optimal depends only on previous optimal
2. **No Remorse**: Once passed, earlier decisions don't need revisiting
3. **Markov Property**: Future depends only on current state, not path

### Limitations

- **Complex Dependencies**: If dp[i] depends on arbitrary previous states, can't roll
- **Path Reconstruction**: Harder to trace back decisions
- **Multiple Dimensions**: More complex for 2D problems

---

## Practice Problems

### Problem 1: Best Time to Buy and Sell Stock

**Problem:** [LeetCode 121 - Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)

**Description:** Find max profit with single transaction.

**How to Apply:**
- Track min_price (state)
- Update max_profit for each price

---

### Problem 2: House Robber

**Problem:** [LeetCode 198 - House Robber](https://leetcode.com/problems/house-robber/)

**Description:** Maximize loot without robbing adjacent houses.

**How to Apply:**
- Two states: rob previous or skip previous
- Rolling update: prev2, prev1

---

### Problem 3: Best Time to Buy and Sell Stock with Cooldown

**Problem:** [LeetCode 309 - Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)

**Description:** After selling, must wait one day before buying.

**How to Apply:**
- Three states: hold, sold, rest
- State machine transitions

---

### Problem 4: Best Time to Buy and Sell Stock IV

**Problem:** [LeetCode 188 - Best Time to Buy and Sell Stock IV](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/)

**Description:** At most k transactions allowed.

**How to Apply:**
- 2*k states (hold/cash for each transaction count)
- Nested loop over prices and k

---

### Problem 5: Maximum Subarray

**Problem:** [LeetCode 53 - Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)

**Description:** Find contiguous subarray with maximum sum.

**How to Apply:**
- Single state: max_ending_here
- Kadane's algorithm

---

## Video Tutorial Links

### Fundamentals

- [Dynamic Programming Patterns - NeetCode](https://www.youtube.com/watch?v=H9JkE3xD28o) - DP patterns
- [House Robber Explained - Back to Back SWE](https://www.youtube.com/watch?v=JZCqX7bEz1k) - State transition
- [Stock Trading Problems - Nick White](https://www.youtube.com/watch?v=yzNqe2F0HwA) - State machine

### Advanced Topics

- [DP State Machine - LeetCode Discuss](https://leetcode.com/discuss/general-discussion/1065227/dp-state-machine) - State machine patterns
- [Kadane's Algorithm - William Fiset](https://www.youtube.com/watch?v=3nAYt3RSwtE) - Maximum subarray

---

## Follow-up Questions

### Q1: When can I use rolling state optimization vs full DP table?

**Answer:** Use rolling state when dp[i] depends only on a fixed small number of previous states (like dp[i-1], dp[i-2]). If dp[i] depends on arbitrary previous states (like dp[i] = max(dp[j]) for all j < i), you need the full table.

---

### Q2: How do I choose what states to track?

**Answer:** States should capture all information needed to make the optimal decision at each step. Ask: "What would I need to know from previous steps to make the best choice now?" Keep states minimal but sufficient.

---

### Q3: Can I always reconstruct the solution with rolling state?

**Answer:** It's harder with rolling state since you don't keep history. To reconstruct, either: (1) keep the full table for reconstruction, or (2) store additional "choice" information during the forward pass.

---

### Q4: What's the difference between state machine DP and regular DP?

**Answer:** State machine DP explicitly models distinct states (like hold/sold/rest) with defined transitions. Regular DP typically tracks a value directly. State machines are useful when the "mode" or state matters as much as the value.

---

### Q5: How do I handle circular/house robber II type problems?

**Answer:** Break the circle by considering two cases: (1) include first element, exclude last, (2) exclude first element, include last. Solve both linearly and take the maximum. This avoids the circular dependency.

---

## Summary

Left-to-Right State Transition is a powerful dynamic programming pattern for sequential decision problems. The key takeaways are:

1. **Minimal State**: Track only necessary information from previous steps
2. **Rolling Update**: Use O(1) space by keeping only recent states
3. **State Machines**: Model complex problems with explicit state transitions
4. **Efficiency**: Achieve O(n) time with O(1) space for many problems
5. **Pattern Recognition**: Identify pick/skip, hold/sell, or tracking patterns

**When to Use:**
- Sequential decisions with local dependencies
- Running best/minimum/maximum tracking
- State machine problems (stock trading)
- Space-constrained DP problems

**Common Patterns:**
```python
# Running best
min_price = min(min_price, price)
max_profit = max(max_profit, price - min_price)

# Pick/skip rolling
prev2, prev1 = prev1, max(prev1, prev2 + num)

# State machine
hold, sold, rest = max(hold, rest - price), hold + price, max(rest, prev_sold)
```

This pattern transforms O(n) space DP solutions into O(1) space, making it essential for optimizing space complexity in competitive programming.
