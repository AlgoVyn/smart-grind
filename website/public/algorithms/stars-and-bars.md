# Stars and Bars (Combinatorics)

## Category
Combinatorics & Mathematics

## Description

Stars and Bars is a fundamental combinatorial technique for solving distribution problems - counting the ways to distribute n indistinguishable objects into k distinguishable bins. It provides elegant solutions to problems involving non-negative integer solutions to equations, combinations with repetition, and various counting scenarios.

Named for its visual representation where stars (★) represent objects and bars (|) separate bins, this technique transforms complex counting problems into simple binomial coefficient calculations. It's essential for competitive programming, probability calculations, and algorithmic problems involving distributions.

---

## Concepts

Stars and Bars relies on fundamental combinatorics principles.

### 1. Standard Formula

| Problem | Formula | Interpretation |
|---------|---------|----------------|
| **Non-negative solutions** | C(n+k-1, k-1) | n stars, k-1 bars |
| **Positive solutions** | C(n-1, k-1) | Each bin gets at least 1 |
| **Upper bounded** | Inclusion-Exclusion | Apply constraints |

### 2. Visual Representation

```
Distribute 5 identical items to 3 bins:

★★|★★★|     represents (2, 3, 0)
★|★★|★★      represents (1, 2, 2)
|★★★★|★      represents (0, 4, 1)

Total positions: 5 + 2 = 7 (n stars + k-1 bars)
Choose 2 positions for bars: C(7, 2) = 21 ways
```

### 3. Problem Types

| Type | Constraint | Formula |
|------|------------|---------|
| **Unrestricted** | xᵢ ≥ 0 | C(n+k-1, k-1) |
| **Lower bound** | xᵢ ≥ a | Substitute yᵢ = xᵢ - a |
| **Upper bound** | xᵢ ≤ b | Inclusion-Exclusion |
| **Bounded** | a ≤ xᵢ ≤ b | Transform + Inclusion-Exclusion |

### 4. Inclusion-Exclusion Principle

For upper bounds, subtract invalid distributions:

```
Total = C(n+k-1, k-1)
       - Σ C(n-(bᵢ+1)+k-1, k-1)  [subtract where xᵢ > bᵢ]
       + Σ C(n-(bᵢ+1)-(bⱼ+1)+k-1, k-1)  [add back double subtraction]
       - ...
```

---

## Frameworks

Structured approaches for Stars and Bars problems.

### Framework 1: Standard Stars and Bars

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD STARS AND BARS                                     │
├─────────────────────────────────────────────────────────────┤
│  Problem: Count non-negative integer solutions to           │
│           x₁ + x₂ + ... + xₖ = n                           │
│                                                              │
│  Formula: C(n+k-1, k-1) or equivalently C(n+k-1, n)        │
│                                                              │
│  Interpretation:                                            │
│  - Place n stars in a row                                  │
│  - Insert k-1 bars in n+k-1 possible positions            │
│  - Each configuration represents one solution                │
│                                                              │
│  Example: x₁ + x₂ + x₃ = 5                                 │
│  Answer: C(5+3-1, 3-1) = C(7, 2) = 21                      │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Distributing identical items to distinct bins.

### Framework 2: Positive Solutions

```
┌─────────────────────────────────────────────────────────────┐
│  POSITIVE SOLUTIONS (EACH BIN AT LEAST 1)                  │
├─────────────────────────────────────────────────────────────┤
│  Problem: x₁ + x₂ + ... + xₖ = n, where xᵢ ≥ 1          │
│                                                              │
│  Transformation:                                            │
│  Let yᵢ = xᵢ - 1, so yᵢ ≥ 0                                │
│  Then: y₁ + y₂ + ... + yₖ = n - k                          │
│                                                              │
│  Formula: C((n-k)+k-1, k-1) = C(n-1, k-1)                  │
│                                                              │
│  Requires: n ≥ k (otherwise 0 solutions)                     │
│                                                              │
│  Example: Distribute 5 candies to 3 children, each ≥ 1   │
│  Answer: C(5-1, 3-1) = C(4, 2) = 6                         │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Each recipient must receive at least one item.

### Framework 3: Inclusion-Exclusion for Upper Bounds

```
┌─────────────────────────────────────────────────────────────┐
│  UPPER BOUND CONSTRAINTS                                     │
├─────────────────────────────────────────────────────────────┤
│  Problem: x₁ + x₂ + ... + xₖ = n, where 0 ≤ xᵢ ≤ bᵢ      │
│                                                              │
│  Method:                                                    │
│  1. Start with total: C(n+k-1, k-1)                        │
│  2. Subtract cases where xᵢ > bᵢ:                           │
│     - Substitute xᵢ' = xᵢ - (bᵢ+1)                         │
│     - Count: C(n-(bᵢ+1)+k-1, k-1)                          │
│  3. Add back double-counted cases (inclusion-exclusion)   │
│                                                              │
│  For single upper bound b on all variables:                 │
│  Sum over i from 0 to k: (-1)ⁱ × C(k,i) × C(n-i(b+1)+k-1, k-1)│
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Capacity constraints on bins.

---

## Forms

Different manifestations of Stars and Bars problems.

### Form 1: Unrestricted Distribution

Basic case with no constraints.

| Aspect | Details |
|--------|---------|
| **Problem** | x₁ + ... + xₖ = n, xᵢ ≥ 0 |
| **Formula** | C(n+k-1, k-1) |
| **Example** | Distribute 10 identical balls to 4 boxes: C(13, 3) = 286 |

### Form 2: Minimum Constraints

Each bin must have at least some items.

| Aspect | Details |
|--------|---------|
| **Problem** | x₁ + ... + xₖ = n, xᵢ ≥ m |
| **Transformation** | yᵢ = xᵢ - m, then y₁ + ... + yₖ = n - km |
| **Formula** | C(n-km+k-1, k-1) if n ≥ km, else 0 |

### Form 3: Upper Bound Constraints

Bins have maximum capacity.

| Aspect | Details |
|--------|---------|
| **Problem** | x₁ + ... + xₖ = n, 0 ≤ xᵢ ≤ b |
| **Method** | Inclusion-Exclusion |
| **Complexity** | O(k) terms |

### Form 4: Multisets

Counting combinations with repetition.

| Aspect | Details |
|--------|---------|
| **Problem** | Choose n items from k types (repetition allowed) |
| **Equivalence** | Distribution of n identical to k distinct |
| **Formula** | C(n+k-1, n) |

---

## Tactics

Specific techniques for Stars and Bars problems.

### Tactic 1: Basic Counting

Standard formula application:

```python
from math import comb

def stars_and_bars(n, k):
    """
    Count ways to put n identical items into k distinct bins.
    Formula: C(n+k-1, k-1)
    """
    return comb(n + k - 1, k - 1)

def stars_and_bars_positive(n, k):
    """
    Each bin must have at least 1 item.
    Formula: C(n-1, k-1)
    """
    if n < k:
        return 0
    return comb(n - 1, k - 1)
```

### Tactic 2: Lower Bound Transformation

Handle minimum constraints:

```python
def count_solutions(equation_sum, num_vars, min_val=0, max_val=None):
    """
    Count solutions to: x₁ + x₂ + ... + x_num_vars = equation_sum
    with constraints: min_val ≤ xᵢ ≤ max_val (optional)
    """
    if min_val > 0:
        # Transform: yᵢ = xᵢ - min_val, so yᵢ ≥ 0
        remaining = equation_sum - num_vars * min_val
        if remaining < 0:
            return 0
        return stars_and_bars(remaining, num_vars)
    
    if max_val is not None:
        # Use inclusion-exclusion
        total = stars_and_bars(equation_sum, num_vars)
        
        # Subtract cases where at least one variable > max_val
        for i in range(1, num_vars + 1):
            # Choose i variables to exceed max_val
            subtract = comb(num_vars, i) * stars_and_bars(
                equation_sum - i * (max_val + 1), num_vars
            ) if equation_sum - i * (max_val + 1) >= 0 else 0
            
            if i % 2 == 1:
                total -= subtract
            else:
                total += subtract
        
        return total
    
    return stars_and_bars(equation_sum, num_vars)
```

### Tactic 3: Dice Sum Problems

Classic application:

```python
def dice_sum_probability(num_dice, target_sum):
    """
    Count ways to get target_sum with num_dice dice.
    Each die shows 1-6.
    """
    # Transform to stars and bars with constraints
    # x₁ + x₂ + ... + x_num_dice = target_sum, 1 ≤ xᵢ ≤ 6
    if target_sum < num_dice or target_sum > 6 * num_dice:
        return 0
    
    # yᵢ = xᵢ - 1, so 0 ≤ yᵢ ≤ 5
    # y₁ + y₂ + ... + y_num_dice = target_sum - num_dice
    remaining = target_sum - num_dice
    
    # Use inclusion-exclusion
    total = 0
    for i in range(0, num_dice + 1):
        sign = (-1) ** i
        ways = comb(num_dice, i) * comb(
            remaining - i * 6 + num_dice - 1, 
            num_dice - 1
        ) if remaining - i * 6 >= 0 else 0
        total += sign * ways
    
    return total
```

**Application**: Probability calculations with dice.

### Tactic 4: Integer Partitions

Related but different concept:

```python
def partitions_at_most_k(n, k):
    """Count partitions of n into at most k parts."""
    # Equivalent to partitions of n with largest part at most k
    # DP approach
    dp = [[0] * (k + 1) for _ in range(n + 1)]
    dp[0][0] = 1
    
    for i in range(1, n + 1):
        for j in range(1, k + 1):
            dp[i][j] = dp[i][j - 1]
            if i >= j:
                dp[i][j] += dp[i - j][j]
    
    return dp[n][k]
```

**Note**: This is partitions (order doesn't matter), different from compositions (order matters).

### Tactic 5: Multisets and Combinations

Choosing with repetition:

```python
def multiset_combinations(n, k):
    """
    Ways to choose k items from n types (repetition allowed).
    Equivalent to distributing k identical items to n distinct bins.
    """
    return comb(n + k - 1, k)
```

---

## Python Templates

### Template 1: Stars and Bars (Standard)

```python
from math import comb


def stars_and_bars(n: int, k: int) -> int:
    """
    Count ways to distribute n identical items into k distinct bins.
    
    Formula: C(n+k-1, k-1)
    
    This is equivalent to counting non-negative integer solutions to:
    x₁ + x₂ + ... + xₖ = n
    
    Args:
        n: Number of identical items
        k: Number of distinct bins
    
    Returns:
        Number of ways to distribute
    
    Example:
        stars_and_bars(5, 3) = 21
        (Ways to distribute 5 identical balls to 3 distinct boxes)
    """
    return comb(n + k - 1, k - 1)
```

### Template 2: Positive Solutions

```python
def stars_and_bars_positive(n: int, k: int) -> int:
    """
    Count ways to distribute n identical items into k distinct bins
    where each bin gets at least 1 item.
    
    Formula: C(n-1, k-1)
    
    This is equivalent to counting positive integer solutions to:
    x₁ + x₂ + ... + xₖ = n
    
    Args:
        n: Number of identical items (must be ≥ k)
        k: Number of distinct bins
    
    Returns:
        Number of ways, or 0 if n < k
    """
    if n < k:
        return 0
    return comb(n - 1, k - 1)
```

### Template 3: Bounded Solutions

```python
def stars_and_bars_bounded(n: int, k: int, max_per_bin: int) -> int:
    """
    Count ways to distribute n identical items into k distinct bins
    where each bin gets at most max_per_bin items.
    
    Uses inclusion-exclusion principle.
    
    Args:
        n: Number of identical items
        k: Number of distinct bins
        max_per_bin: Maximum items per bin
    
    Returns:
        Number of valid distributions
    """
    total = 0
    
    # Inclusion-exclusion over bins that exceed limit
    for i in range(0, k + 1):
        sign = (-1) ** i
        # Choose i bins to definitely exceed max_per_bin
        # Give them (max_per_bin + 1) items each
        remaining = n - i * (max_per_bin + 1)
        
        if remaining < 0:
            continue
        
        # Distribute remaining freely
        ways = comb(k, i) * comb(remaining + k - 1, k - 1)
        total += sign * ways
    
    return total
```

### Template 4: Multisets

```python
def multiset_combinations(types: int, choose: int) -> int:
    """
    Ways to choose 'choose' items from 'types' types,
    where repetition is allowed.
    
    Equivalent to distributing 'choose' identical items
    into 'types' distinct bins.
    
    Args:
        types: Number of different types available
        choose: Number of items to choose
    
    Returns:
        Number of multisets
    """
    return comb(types + choose - 1, choose)
```

---

## When to Use

Use Stars and Bars when you need to solve problems involving:

- **Distribution of identical items**: Balls, candies, resources
- **Non-negative integer solutions**: Equations like x₁ + ... + xₖ = n
- **Combinations with repetition**: Choosing items when types can repeat
- **Dice/coin probability**: Counting outcomes with constraints
- **Partition problems**: Dividing resources among recipients

### Comparison with Related Concepts

| Problem Type | Formula | Example |
|-------------|---------|---------|
| **Stars and Bars** | C(n+k-1, k-1) | Distribute n identical to k distinct |
| **Combinations** | C(n, k) | Choose k from n distinct |
| **Permutations** | P(n, k) = n!/(n-k)! | Arrange k from n |
| **Partitions** | p(n, k) | Divide n into k groups (order doesn't matter) |

### When to Choose Stars and Bars

- **Choose Stars and Bars** when:
  - Items are identical/indistinguishable
  - Bins/containers are distinct
  - Distribution/concept applies
  - Equation x₁ + ... + xₖ = n needs solution count

- **Consider Alternatives** when:
  - Items are distinct (use inclusion-exclusion or exponential generating functions)
  - Order matters (use compositions, not partitions)
  - Complex constraints (use DP or generating functions)

---

## Algorithm Explanation

### Core Concept

The "Stars and Bars" name comes from the visual representation: stars (★) represent items to distribute, and bars (|) separate different bins. The arrangement of n stars and k-1 bars uniquely determines a distribution.

### Mathematical Derivation

To solve x₁ + x₂ + ... + xₖ = n with xᵢ ≥ 0:

1. Place n stars: ★★★...★ (n times)
2. We need k-1 bars to create k sections
3. Total positions: n + (k-1) = n+k-1
4. Choose k-1 positions for bars (or n positions for stars)
5. Number of ways: C(n+k-1, k-1) = C(n+k-1, n)

### Visual Representation

**Example**: x₁ + x₂ + x₃ = 5

```
★★|★★★|     → x₁=2, x₂=3, x₃=0
|★★★★|★     → x₁=0, x₂=4, x₃=1
★★★★★||     → x₁=5, x₂=0, x₃=0

Total: C(5+3-1, 3-1) = C(7, 2) = 21 configurations
```

### Transformations

**For xᵢ ≥ 1 (each bin at least 1):**
```
Let yᵢ = xᵢ - 1, so yᵢ ≥ 0
Then: (y₁+1) + (y₂+1) + ... + (yₖ+1) = n
      y₁ + y₂ + ... + yₖ = n - k
Answer: C((n-k)+k-1, k-1) = C(n-1, k-1)
```

**For xᵢ ≥ a (minimum a per bin):**
```
Let yᵢ = xᵢ - a
Answer: C(n-ka+k-1, k-1)
```

---

## Practice Problems

### Problem 1: Number of Ways to Form Target String

**Problem:** [LeetCode - Number of Ways to Form a Target String Given a Dictionary](https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary/)

**Description:** Count ways to form target string using characters from dictionary words.

**How to Apply:**
- Count character frequencies at each position
- Use combinatorics to count valid ways
- Related to multisets and distributions

---

### Problem 2: Combination Sum IV

**Problem:** [LeetCode 377 - Combination Sum IV](https://leetcode.com/problems/combination-sum-iv/)

**Description:** Given an array of distinct integers and a target, return the number of possible combinations that add up to target.

**How to Apply:**
- DP approach similar to counting integer solutions
- Each number can be used unlimited times
- Stars and bars intuition with restricted values

---

## Video Tutorial Links

### Fundamentals

- [Stars and Bars Explained](https://www.youtube.com/watch?v=Ix6rQ1jI2u8) - Visual explanation
- [Combinatorics - Compositions](https://www.youtube.com/watch?v=4jM9M4zM1gQ) - Integer solutions
- [Inclusion-Exclusion Principle](https://www.youtube.com/watch?v=8H7x7LNtSiQ) - Advanced applications

### Applications

- [Dice Probability](https://www.youtube.com/watch?v=4iC6B2r8r30) - Sum of dice
- [Distribution Problems](https://www.youtube.com/watch?v=Ja7jGznx5JA) - Various scenarios
- [Competitive Programming](https://www.youtube.com/watch?v=8H7x7LNtSiQ) - Common patterns

---

## Follow-up Questions

### Q1: Why is the formula C(n+k-1, k-1) and not C(n+k-1, n)?

**Answer**: Both are correct! C(n+k-1, k-1) = C(n+k-1, n) because C(m, r) = C(m, m-r). Choose whichever is easier to compute: usually min(k-1, n).

### Q2: What if bins are also identical (not distinct)?

**Answer**: Then it becomes a partition problem, not Stars and Bars. Partitions count the number of ways to write n as a sum of positive integers where order doesn't matter. This is more complex and uses generating functions or partition function p(n).

### Q3: How do I handle constraints like x₁ ≤ x₂ ≤ ... ≤ xₖ?

**Answer**: This changes the problem significantly. One approach is to substitute y₁ = x₁, y₂ = x₂ - x₁, y₃ = x₃ - x₂, etc. with yᵢ ≥ 0. This transforms the ordering constraint into non-negativity constraints.

### Q4: Can Stars and Bars be used for probability calculations?

**Answer**: Yes! It's often used to count favorable outcomes. For example, probability of getting sum S with n dice: count valid (d₁, d₂, ..., dₙ) where each 1 ≤ dᵢ ≤ 6 using inclusion-exclusion, then divide by 6ⁿ.

### Q5: What's the difference between Stars and Bars and integer partitions?

**Answer**: 
- **Stars and Bars**: Bins are distinct (x₁, x₂, ..., xₖ are distinguishable)
- **Partitions**: Groups are indistinguishable (5 = 2+3 is same as 5 = 3+2)

Stars and Bars uses compositions (order matters), partitions don't.

---

## Summary

Stars and Bars is an essential combinatorial technique that elegantly solves distribution problems using simple binomial coefficients. Its visual representation and mathematical foundation make it a powerful tool for competitive programming and algorithm design.

**Key Takeaways:**

1. **Formula**: C(n+k-1, k-1) for n identical items to k distinct bins
2. **Transformation**: Adjust for minimum constraints by substitution
3. **Inclusion-Exclusion**: Handle maximum constraints
4. **Visual**: Stars (items) and bars (separators)
5. **Multisets**: Equivalent to combinations with repetition

**When to Use:**
- Distributing identical items to distinct containers
- Counting non-negative integer solutions
- Combinations with repetition
- Dice/coin probability problems

Understanding Stars and Bars provides a foundation for more advanced combinatorics and is frequently tested in technical interviews and competitive programming contests.
