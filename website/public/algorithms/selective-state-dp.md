# Selective State DP (Digit DP)

## Category
Dynamic Programming

## Description

Selective State DP, commonly known as Digit DP, is a dynamic programming technique for solving counting problems involving numbers with digit-based constraints. It efficiently counts numbers in a range [L, R] that satisfy specific properties, processing digits from most significant to least significant.

This pattern is particularly powerful for problems like "count numbers in range with digit sum divisible by k" or "count numbers without consecutive 1s in binary representation." By using memoization over digit positions and tracking relevant state, it transforms seemingly exponential problems into polynomial time solutions.

---

## Concepts

Digit DP relies on fundamental concepts of digit processing and state-based dynamic programming.

### 1. Core Components

| Component | Description | Example |
|-----------|-------------|---------|
| **Position** | Current digit being processed | Index from left (0 to len-1) |
| **Tight Constraint** | Whether previous digits matched upper bound | Boolean flag |
| **State** | Problem-specific tracking variable | Sum mod k, last digit, etc. |
| **Started Flag** | Whether we've placed a non-zero digit | Leading zero handling |

### 2. State Transitions

| State Type | Meaning | Use Case |
|------------|---------|----------|
| **pos** | Current digit position | Always present |
| **tight** | Bounded by prefix | Range queries |
| **started** | Leading zeros handled | Numbers with constraints |
| **sum_mod** | Digit sum modulo k | Divisibility problems |
| **prev_digit** | Previous digit placed | Adjacency constraints |
| **count** | Some accumulated count | Limited digit problems |

### 3. Tight Constraint Handling

| tight | Max digit at position | Transition |
|-------|----------------------|------------|
| **True** | Upper bound digit | New_tight = tight && (d == limit) |
| **False** | 9 (or 1 for binary) | New_tight remains False |

### 4. Common State Space

| Problem | States | Time Complexity |
|---------|--------|-----------------|
| Digit sum mod k | pos, sum_mod, tight | O(log R × k × 2) |
| No consecutive 1s | pos, prev_one, tight | O(log R × 2 × 2) |
| Digit set limited | pos, tight, started | O(log R × 2 × 2) |

---

## Frameworks

Structured approaches for Digit DP problems.

### Framework 1: Standard Digit DP

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD DIGIT DP TEMPLATE                                  │
├─────────────────────────────────────────────────────────────┤
│  1. Convert number to digit array (most significant first)│
│  2. Define memoization: dp[pos][state][tight][started]      │
│  3. DFS function:                                            │
│     a. If pos == len(digits):                               │
│        - Return is_valid(final_state) ? 1 : 0             │
│     b. If not tight and memoized: return cached            │
│     c. limit = digits[pos] if tight else 9                │
│     d. ans = 0                                               │
│     e. For d in 0 to limit:                               │
│        - new_state = transition(state, d, started)        │
│        - new_tight = tight and (d == limit)               │
│        - new_started = started or (d != 0)                │
│        - ans += dfs(pos+1, new_state, new_tight, new_started)│
│     f. If not tight: memoize and return                     │
│  4. Answer = dfs(0, initial_state, True, False)             │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Counting numbers in [0, N] with digit constraints.

### Framework 2: Range Query [L, R]

```
┌─────────────────────────────────────────────────────────────┐
│  DIGIT DP FOR RANGE [L, R]                                   │
├─────────────────────────────────────────────────────────────┤
│  Standard trick: count(L, R) = count(0, R) - count(0, L-1)│
│                                                              │
│  1. Implement solve(n): returns count in [0, n]             │
│  2. Answer = solve(R) - solve(L-1)                           │
│  3. Handle L=0 case carefully                               │
│                                                              │
│  This avoids dealing with lower bound in DP                  │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Range queries with lower and upper bounds.

### Framework 3: Binary Digit DP

```
┌─────────────────────────────────────────────────────────────┐
│  BINARY DIGIT DP (NO CONSECUTIVE 1s EXAMPLE)                │
├─────────────────────────────────────────────────────────────┤
│  Problem: Count numbers from 0 to n with no consecutive 1s  │
│                                                              │
│  State: dp[pos][prev_one][tight]                            │
│  - pos: current bit position                                 │
│  - prev_one: was previous bit 1?                            │
│  - tight: bounded by prefix                                 │
│                                                              │
│  Transition:                                                 │
│  - If prev_one == 1: can only place 0                      │
│  - If prev_one == 0: can place 0 or 1                       │
│                                                              │
│  Answer: Count valid binary strings                          │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Binary representation problems.

---

## Forms

Different manifestations of selective state DP.

### Form 1: Standard Digit DP

Count numbers with digit constraints.

| Aspect | Details |
|--------|---------|
| **State** | pos, sum_mod, tight, started |
| **Complexity** | O(log R × states × 2 × 2) |
| **Best for** | Digit sum, digit product, digit count |

### Form 2: Binary State DP

Binary representation problems.

| Aspect | Details |
|--------|---------|
| **State** | pos, prev_bit, tight |
| **Complexity** | O(log R × 2 × 2) |
| **Best for** | No consecutive 1s, bit patterns |

### Form 3: Multi-dimensional State

Complex constraints requiring multiple trackers.

| Aspect | Details |
|--------|---------|
| **State** | pos, state1, state2, ..., tight |
| **Complexity** | Product of individual state sizes |
| **Best for** | Multiple simultaneous constraints |

### Form 4: String DP

Similar pattern for string problems.

| Aspect | Details |
|--------|---------|
| **State** | pos, matched_prefix, tight |
| **Complexity** | O(length × pattern_length × 2) |
| **Best for** | Count strings matching patterns |

---

## Tactics

Specific techniques for Digit DP problems.

### Tactic 1: Digit Sum Divisible by K

Count numbers with digit sum % k == 0:

```python
from functools import lru_cache

def count_digit_sum_divisible(n, k):
    """
    Count numbers from 1 to n with digit sum % k == 0.
    Time: O(log n * k), Space: O(log n * k)
    """
    digits = list(map(int, str(n)))
    
    @lru_cache(maxsize=None)
    def dp(pos, sum_mod, tight, started):
        """
        pos: current digit position
        sum_mod: current digit sum mod k
        tight: whether previous digits matched n exactly
        started: whether we've placed a non-zero digit
        """
        if pos == len(digits):
            return 1 if started and sum_mod == 0 else 0
        
        limit = digits[pos] if tight else 9
        result = 0
        
        for d in range(limit + 1):
            new_tight = tight and (d == limit)
            new_started = started or d != 0
            new_sum_mod = (sum_mod + d) % k if new_started else 0
            
            result += dp(pos + 1, new_sum_mod, new_tight, new_started)
        
        return result
    
    return dp(0, 0, True, False)
```

**Key**: Track running sum modulo k.

### Tactic 2: No Consecutive Ones

Binary representation problem:

```python
def count_without_consecutive_ones(n):
    """
    Count numbers from 0 to n with no consecutive 1s in binary.
    """
    binary = bin(n)[2:]
    
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def dp(pos, prev_one, tight):
        if pos == len(binary):
            return 1
        
        limit = int(binary[pos]) if tight else 1
        result = 0
        
        for d in range(limit + 1):
            if prev_one and d == 1:
                continue  # Skip consecutive ones
            
            new_tight = tight and (d == limit)
            result += dp(pos + 1, d == 1, new_tight)
        
        return result
    
    return dp(0, False, True)
```

**Constraint**: Skip placing 1 if previous was 1.

### Tactic 3: Range Query [L, R]

Standard trick for ranges:

```python
def count_in_range(L, R, k):
    """
    Count numbers in [L, R] with digit sum divisible by k.
    """
    def solve(n):
        if n < 0:
            return 0
        return count_digit_sum_divisible(n, k)
    
    return solve(R) - solve(L - 1)
```

**Important**: Handle L=0 edge case.

### Tactic 4: Limited Digit Set

When only certain digits allowed:

```python
def count_with_digit_set(n, digit_set):
    """
    Count numbers from 1 to n using only digits in digit_set.
    """
    digits = list(map(int, str(n)))
    digit_set = set(digit_set)
    
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def dp(pos, tight, started):
        if pos == len(digits):
            return 1 if started else 0
        
        limit = digits[pos] if tight else 9
        result = 0
        
        for d in range(limit + 1):
            if not started and d == 0:
                # Still in leading zeros, can skip
                result += dp(pos + 1, tight and (d == limit), False)
            elif d in digit_set:
                result += dp(pos + 1, tight and (d == limit), True)
        
        return result
    
    return dp(0, True, False)
```

**Application**: Numbers with specific digit patterns.

### Tactic 5: Binary Search + Digit DP

Finding nth number with property:

```python
def find_nth_number_with_property(n, property_fn):
    """
    Binary search + digit DP to find nth number with property.
    """
    def count_up_to(x):
        # Digit DP to count numbers with property in [1, x]
        pass
    
    left, right = 1, 10**18
    while left < right:
        mid = (left + right) // 2
        if count_up_to(mid) < n:
            left = mid + 1
        else:
            right = mid
    return left
```

**Pattern**: Digit DP provides count function for binary search.

---

## Python Templates

### Template 1: Standard Digit DP

```python
from functools import lru_cache
from typing import List


def digit_dp_template(n: int, k: int) -> int:
    """
    Template for digit DP - count numbers from 0 to n.
    
    Modify the state parameters and transition logic for your problem.
    
    Example: Count numbers with digit sum divisible by k.
    
    Time: O(log n * state_space)
    Space: O(log n * state_space)
    """
    digits = list(map(int, str(n)))
    
    @lru_cache(maxsize=None)
    def dfs(pos: int, state: int, tight: bool, started: bool) -> int:
        """
        Args:
            pos: Current digit position (0 to len(digits))
            state: Problem-specific state (e.g., sum_mod, prev_digit)
            tight: True if prefix equals upper bound prefix
            started: True if we've placed a non-zero digit
        
        Returns:
            Count of valid numbers from this state
        """
        # Base case: processed all digits
        if pos == len(digits):
            # Check if final state is valid
            # Example: return 1 if started and state == 0 else 0
            return 1 if started and state == 0 else 0
        
        # Determine max digit we can place
        limit = digits[pos] if tight else 9
        result = 0
        
        for d in range(limit + 1):
            # Calculate new tight constraint
            new_tight = tight and (d == limit)
            
            # Calculate new started flag
            new_started = started or (d != 0)
            
            # Calculate new state (problem-specific)
            if not new_started:
                # Still in leading zeros
                new_state = state
            else:
                # Update state based on digit
                # Example: new_state = (state + d) % k
                new_state = (state + d) % k
            
            # Skip invalid transitions (problem-specific)
            # Example: if some_constraint_violated: continue
            
            result += dfs(pos + 1, new_state, new_tight, new_started)
        
        return result
    
    return dfs(0, 0, True, False)
```

### Template 2: Range Query Digit DP

```python
def digit_dp_range(L: int, R: int, k: int) -> int:
    """
    Count numbers in [L, R] with digit sum divisible by k.
    
    Uses the trick: count(L, R) = count(0, R) - count(0, L-1)
    """
    def solve(n: int) -> int:
        """Count valid numbers in [0, n]."""
        if n < 0:
            return 0
        
        digits = list(map(int, str(n)))
        
        @lru_cache(maxsize=None)
        def dfs(pos: int, sum_mod: int, tight: bool, started: bool) -> int:
            if pos == len(digits):
                return 1 if started and sum_mod == 0 else 0
            
            limit = digits[pos] if tight else 9
            result = 0
            
            for d in range(limit + 1):
                new_tight = tight and (d == limit)
                new_started = started or (d != 0)
                new_sum_mod = (sum_mod + d) % k if new_started else 0
                
                result += dfs(pos + 1, new_sum_mod, new_tight, new_started)
            
            return result
        
        return dfs(0, 0, True, False)
    
    return solve(R) - solve(L - 1)
```

### Template 3: Binary Digit DP

```python
def binary_digit_dp(n: int) -> int:
    """
    Digit DP for binary numbers.
    Example: Count numbers with no consecutive 1s.
    """
    binary = bin(n)[2:]  # Remove '0b' prefix
    
    @lru_cache(maxsize=None)
    def dfs(pos: int, prev_one: bool, tight: bool) -> int:
        """
        Args:
            pos: Current bit position
            prev_one: Was previous bit 1?
            tight: Bounded by prefix?
        """
        if pos == len(binary):
            return 1  # Valid number found
        
        limit = int(binary[pos]) if tight else 1
        result = 0
        
        for bit in range(limit + 1):
            if prev_one and bit == 1:
                continue  # Would create consecutive 1s
            
            new_tight = tight and (bit == limit)
            result += dfs(pos + 1, bit == 1, new_tight)
        
        return result
    
    return dfs(0, False, True)
```

### Template 4: Digit Set Constraint

```python
def digit_set_dp(n: int, allowed_digits: List[int]) -> int:
    """
    Count numbers from 1 to n using only allowed_digits.
    """
    allowed = set(allowed_digits)
    digits = list(map(int, str(n)))
    
    @lru_cache(maxsize=None)
    def dfs(pos: int, tight: bool, started: bool) -> int:
        if pos == len(digits):
            return 1 if started else 0
        
        limit = digits[pos] if tight else 9
        result = 0
        
        for d in range(limit + 1):
            new_tight = tight and (d == limit)
            new_started = started or (d != 0)
            
            if not new_started:
                # Still leading zeros, always allowed
                result += dfs(pos + 1, new_tight, False)
            elif d in allowed:
                result += dfs(pos + 1, new_tight, True)
        
        return result
    
    return dfs(0, True, False)
```

---

## When to Use

Use Digit DP when you need to solve problems involving:

- **Counting numbers in range** with digit-based properties
- **Digit sum constraints** (divisible by k, equal to target)
- **Digit patterns** (no consecutive digits, specific sequences)
- **Binary representations** with bit constraints
- **Lexicographic counting** of numbers/strings

### Comparison with Alternatives

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Digit DP** | O(log R × states) | O(log R × states) | Range queries, digit constraints |
| **Brute Force** | O(R-L) | O(1) | Small ranges |
| **Mathematical** | O(1) or O(log n) | O(1) | Simple patterns (sometimes) |
| **Generating Functions** | Varies | Varies | Complex combinatorics |

### When to Choose Digit DP

- **Choose Digit DP** when:
  - Counting numbers in large range [L, R]
  - Constraints involve individual digits
  - Range is up to 10^18 or larger
  - Need to handle many queries

- **Consider Alternatives** when:
  - Range is small (< 10^6)
  - Simple mathematical formula exists
  - Single query with small constraints

---

## Algorithm Explanation

### Core Concept

Digit DP processes numbers digit by digit from most significant to least significant. At each position, it tracks whether the prefix built so far is "tight" (exactly matches the upper bound) or "loose" (already smaller than upper bound). This allows efficient counting without enumerating all numbers.

### How It Works

#### Step 1: Decompose Number
```python
digits = list(map(int, str(n)))  # [1, 2, 3] for n=123
```

#### Step 2: Recursive DFS with Memoization
- Process position by position
- Track relevant state (sum_mod, prev_digit, etc.)
- Use tight constraint to limit digit choices

#### Step 3: State Transitions
```
For each digit position:
  - Determine max digit (tight ? upper_bound_digit : 9)
  - For each possible digit d:
    * Update state
    * Update tight flag
    * Recurse to next position
```

### Visual Walkthrough

**Example**: Count numbers ≤ 123 with digit sum divisible by 3

```
Processing "123", position 0 (digit 1):
- tight=True, so max digit = 1
- Try d=0: new_tight=False (0 < 1)
  Can place any digits 0-9 at remaining positions
- Try d=1: new_tight=True (1 == 1)
  Must respect upper bound at next positions

The DP explores both paths, memoizing results.
```

### Why Memoization Works

When `tight=False`, the count from a given (pos, state) is the same regardless of how we got there. This allows us to cache and reuse results, reducing complexity from exponential to polynomial.

---

## Practice Problems

### Problem 1: Numbers At Most N Given Digit Set

**Problem:** [LeetCode 902 - Numbers At Most N Given Digit Set](https://leetcode.com/problems/numbers-at-most-n-given-digit-set/)

**Description:** Given an array of digits which is sorted in non-decreasing order, return the number of numbers in [1, N] that can be formed using these digits.

**How to Apply:**
- Use Digit DP with tight constraint
- State: position, tight flag
- Only allow digits from the given set

---

### Problem 2: Non-negative Integers without Consecutive Ones

**Problem:** [LeetCode 600 - Non-negative Integers without Consecutive Ones](https://leetcode.com/problems/non-negative-integers-without-consecutive-ones/)

**Description:** Given a positive integer n, return the number of non-negative integers less than or equal to n that don't have consecutive 1s in their binary representation.

**How to Apply:**
- Binary Digit DP
- State: position, prev_one flag, tight flag
- Skip transitions that would create consecutive 1s

---

### Problem 3: Count the Number of Powerful Integers

**Problem:** [LeetCode 2999 - Count the Number of Powerful Integers](https://leetcode.com/problems/count-the-number-of-powerful-integers/)

**Description:** Given three integers `start`, `finish`, and `limit`, return the number of powerful integers in the range [start, finish].

**How to Apply:**
- Digit DP with digit sum and digit constraints
- Range query using solve(finish) - solve(start-1)
- Track digit sum and bounded digit flag

---

### Problem 4: K-th Smallest in Lexicographical Order

**Problem:** [LeetCode 440 - K-th Smallest in Lexicographical Order](https://leetcode.com/problems/k-th-smallest-in-lexicographical-order/)

**Description:** Given two integers `n` and `k`, return the kth lexicographically smallest integer in [1, n].

**How to Apply:**
- Binary search + Digit DP to count numbers
- Or use Trie-like traversal with counting

---

## Video Tutorial Links

### Fundamentals

- [Digit DP Introduction](https://www.youtube.com/watch?v=3n20uyThQhU) - Concept explanation
- [Digit DP Tutorial](https://www.youtube.com/watch?v=75ViLQt7vRw) - Implementation
- [Binary Digit DP](https://www.youtube.com/watch?v=5i7oKodCRJo) - Binary constraints

### Problem Solutions

- [LeetCode 902 Solution](https://www.youtube.com/watch?v=2z8GJ_4b6tI) - Numbers At Most N
- [LeetCode 600 Solution](https://www.youtube.com/watch?v=4i7-6x9z5jE) - No Consecutive Ones
- [Digit DP Patterns](https://www.youtube.com/watch?v=9Z1wUhlF4d8) - Common patterns

---

## Follow-up Questions

### Q1: Why does Digit DP use DFS instead of iterative DP?

**Answer**: The tight constraint makes the state space irregular - transitions depend on the path taken (whether we're tight or not). DFS with memoization naturally handles this, while iterative DP would need careful state ordering.

### Q2: Can Digit DP handle very large upper bounds (10^100)?

**Answer**: Yes! That's the strength of Digit DP. Since complexity is O(log R × states), it easily handles bounds with 100+ digits. Just process the number as a string/digit array.

### Q3: How do I handle multiple queries efficiently?

**Answer**: For many queries, you can't reuse memoization between different upper bounds (different digit arrays). However, you can use iterative DP with prefix optimization or precompute for common states. The standard trick is using solve(R) - solve(L-1) for each query.

### Q4: Can Digit DP work with decimal numbers or other bases?

**Answer**: Yes! The technique works with any base. Just adjust the digit range (0 to base-1) and the number decomposition. Binary DP is a common special case.

### Q5: When should I use memoization vs tabulation for Digit DP?

**Answer**: Memoization (top-down) is preferred because:
- Only reachable states are computed
- Tight constraint naturally handled
- Easier to implement and debug

Tabulation (bottom-up) is possible but more complex due to state dependencies.

---

## Summary

Digit DP is a powerful technique for solving counting problems with digit-based constraints over large ranges. By processing digits from most significant to least significant and using memoization, it achieves logarithmic time complexity in the upper bound.

**Key Takeaways:**

1. **State Design**: Position, tight constraint, started flag, problem-specific state
2. **Tight Constraint**: Controls maximum digit at each position
3. **Memoization**: Cache results for (pos, state, tight) combinations
4. **Range Queries**: Use solve(R) - solve(L-1) trick
5. **Flexibility**: Adapts to various digit constraints

**When to Use:**
- Counting numbers in large ranges with digit constraints
- Problems involving digit sums, patterns, or binary representations
- When range is too large for brute force

Digit DP is an advanced but essential technique for competitive programming and technical interviews, especially for problems involving number theory and combinatorics over ranges.
