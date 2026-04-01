# Combinations

## Category
Backtracking

## Description

A **combination** is a selection of k elements from a set of n elements where the order does not matter. This fundamental problem in combinatorics appears frequently in algorithmic interviews and competitive programming scenarios. For example, choosing 2 elements from {1, 2, 3, 4} gives: {1,2}, {1,3}, {1,4}, {2,3}, {2,4}, {3,4} — note that {2,1} is the same as {1,2} since order is irrelevant in combinations.

The mathematical notation for the number of ways to choose k elements from n is **C(n,k)** or **"n choose k"**, calculated as C(n, k) = n! / (k!(n-k)!). This is also called the **binomial coefficient** and appears in the binomial theorem, probability theory, and many algorithmic applications.

The backtracking approach to generating combinations is remarkably elegant because it naturally avoids duplicates by always moving forward through the array, ensuring each combination is generated in sorted order exactly once.

---

## Concepts

The Combinations algorithm is built on several fundamental concepts.

### 1. Binomial Coefficient

The number of k-combinations from n elements:

| n | k | C(n,k) | Interpretation |
|---|---|--------|----------------|
| 4 | 2 | 6 | Choose 2 from 4 |
| 5 | 3 | 10 | Choose 3 from 5 |
| 10 | 5 | 252 | Choose 5 from 10 |
| 20 | 10 | 184,756 | Choose 10 from 20 |

### 2. Forward-Only Selection

Unlike permutations, combinations use a `start` index to ensure:
- Each element is only combined with elements after it
- No duplicate combinations are generated
- Natural sorted order in results

```
For array [1, 2, 3, 4] and k=2:

Choose 1: Can combine with 2, 3, 4 → [1,2], [1,3], [1,4]
Choose 2: Can combine with 3, 4 → [2,3], [2,4]  (not 1, already used)
Choose 3: Can combine with 4 → [3,4]             (not 1, 2)
Choose 4: No elements after it                   (skip)
```

### 3. Pruning Opportunities

Smart pruning can eliminate impossible branches early:

| Condition | Pruning Action |
|-----------|----------------|
| `n - i < k - len(path)` | Not enough elements left, break |
| `current_sum > target` | Exceeds target, return |
| `path.length == k` | Complete, add to results |

### 4. Relationship to Other Patterns

| Pattern | Order Matters? | All Elements? | Implementation |
|---------|---------------|---------------|----------------|
| **Combinations** | No | No (k selected) | `start` index |
| **Permutations** | Yes | Yes (all n) | `used` array |
| **Subsets** | No | Variable | Include/exclude |

---

## Frameworks

Structured approaches for solving combination problems.

### Framework 1: Standard k-Combinations Template

```
┌─────────────────────────────────────────────────────────────┐
│  K-COMBINATIONS FRAMEWORK                                     │
├─────────────────────────────────────────────────────────────┤
│  1. Define backtrack(start, path):                           │
│                                                              │
│     - Base: if len(path) == k:                              │
│         result.append(path[:])                               │
│         return                                               │
│                                                              │
│     - For i from start to n:                                 │
│         (Optional: prune if not enough elements remain)     │
│         path.append(i)                                       │
│         backtrack(i + 1, path)   # i+1, not start+1!        │
│         path.pop()                                           │
│                                                              │
│  2. Initialize: result = [], call backtrack(1, [])          │
│                                                              │
│  3. Return result                                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Classic "n choose k" problems, selecting k from n.

### Framework 2: Combination Sum Template

```
┌─────────────────────────────────────────────────────────────┐
│  COMBINATION SUM FRAMEWORK                                    │
├─────────────────────────────────────────────────────────────┤
│  1. Sort candidates for early termination                    │
│                                                              │
│  2. Define backtrack(start, remaining, path):                │
│                                                              │
│     - Base: if remaining == 0:                              │
│         result.append(path[:])                               │
│         return                                               │
│                                                              │
│     - For i from start to len(candidates):                   │
│         If candidates[i] > remaining: break  # Prune         │
│         path.append(candidates[i])                           │
│         backtrack(i, remaining - cand[i], path)  # Reuse   │
│         path.pop()                                           │
│                                                              │
│  3. Call backtrack(0, target, [])                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Finding combinations that sum to a target.

### Framework 3: Combination with Duplicates Handling

```
┌─────────────────────────────────────────────────────────────┐
│  COMBINATIONS WITH DUPLICATES FRAMEWORK                       │
├─────────────────────────────────────────────────────────────┤
│  1. Sort the input array to group duplicates                 │
│                                                              │
│  2. In the for loop, add skip condition:                     │
│       if i > start and nums[i] == nums[i-1]:                 │
│           continue   # Skip duplicate at this level         │
│                                                              │
│  3. This ensures each unique value is only used once        │
│     per recursion level, preventing duplicate combinations  │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Input contains duplicate elements.

---

## Forms

Different manifestations of the combination pattern.

### Form 1: Standard Combinations (n choose k)

Generate all ways to choose k elements from n.

| n | k | Result Count | Example Output |
|---|---|--------------|----------------|
| 4 | 2 | 6 | [1,2], [1,3], [1,4], [2,3], [2,4], [3,4] |
| 5 | 3 | 10 | [1,2,3], [1,2,4], ..., [3,4,5] |

### Form 2: Combination Sum (Unlimited Use)

Find combinations summing to target, elements can be reused.

```
Key difference: backtrack(i, ...) not backtrack(i+1, ...)
                          ^
                          Can reuse same element
```

| Variation | Can Reuse? | Backtrack Call |
|-----------|-----------|----------------|
| Unlimited | Yes | `backtrack(i, ...)` |
| Limited | Once | `backtrack(i+1, ...)` |

### Form 3: Combination Sum II (Single Use with Duplicates)

Each element used once, input may have duplicates.

```
Requirements:
1. Sort input
2. Skip duplicates: if i > start and nums[i] == nums[i-1]: continue
3. Use i+1 in recursion (no reuse)
```

### Form 4: Letter Combinations

Generate combinations from multiple sets (like phone keypad).

```
Mapping: digit -> set of letters
For each digit, choose one letter
Combine choices across all digits

Example: "23" -> [ad, ae, af, bd, be, bf, cd, ce, cf]
```

### Form 5: Combinations of Array Elements

Choose from specific array rather than 1 to n.

```python
# Choose k from specific array
def combine_from_array(nums, k):
    def backtrack(start, path):
        if len(path) == k:
            result.append(path[:])
            return
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
```

---

## Tactics

Specific techniques for combination problems.

### Tactic 1: Pruning by Remaining Elements

```python
def combine_with_pruning(n: int, k: int) -> list[list[int]]:
    """Prune when not enough elements remain."""
    result = []
    
    def backtrack(start: int, path: list[int]):
        if len(path) == k:
            result.append(path[:])
            return
        
        for i in range(start, n + 1):
            # Pruning: if not enough elements left, break
            # Need: k - len(path) more
            # Have: n - i + 1 available (including i)
            if n - i + 1 < k - len(path):
                break
            
            path.append(i)
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(1, [])
    return result
```

### Tactic 2: Handling Duplicates

```python
def combine_with_duplicates(nums: list[int], k: int) -> list[list[int]]:
    """Generate unique combinations from array with duplicates."""
    nums.sort()  # Sort to group duplicates
    result = []
    n = len(nums)
    
    def backtrack(start: int, path: list[int]):
        if len(path) == k:
            result.append(path[:])
            return
        
        for i in range(start, n):
            # Skip duplicates at same level
            if i > start and nums[i] == nums[i - 1]:
                continue
            
            # Pruning: not enough elements left
            if n - i < k - len(path):
                break
            
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result
```

### Tactic 3: Target Sum with Pruning

```python
def combination_sum_pruned(candidates: list[int], target: int) -> list[list[int]]:
    """Combination sum with aggressive pruning."""
    result = []
    candidates.sort()  # Sort enables pruning
    
    def backtrack(start: int, remaining: int, path: list[int]):
        if remaining == 0:
            result.append(path[:])
            return
        
        for i in range(start, len(candidates)):
            # Prune: too big, and all subsequent are bigger
            if candidates[i] > remaining:
                break
            
            # Optional: skip duplicates
            if i > start and candidates[i] == candidates[i - 1]:
                continue
            
            path.append(candidates[i])
            backtrack(i, remaining - candidates[i], path)  # Can reuse
            path.pop()
    
    backtrack(0, target, [])
    return result
```

### Tactic 4: Iterative Combination Generation

```python
def combine_iterative(n: int, k: int) -> list[list[int]]:
    """
    Generate combinations iteratively without recursion.
    Uses lexicographic ordering.
    """
    result = []
    combo = list(range(1, k + 1))  # First combination
    
    while True:
        result.append(combo[:])
        
        # Find rightmost element that can be incremented
        i = k - 1
        while i >= 0 and combo[i] == n - k + i + 1:
            i -= 1
        
        if i < 0:
            break  # All combinations generated
        
        # Increment and reset subsequent
        combo[i] += 1
        for j in range(i + 1, k):
            combo[j] = combo[j - 1] + 1
    
    return result
```

### Tactic 5: Bitmask for Small n

```python
def combine_bitmask(n: int, k: int) -> list[list[int]]:
    """
    Generate combinations using bitmasks.
    Efficient for small n (n <= 20).
    """
    result = []
    
    # Iterate through all bitmasks
    for mask in range(1 << n):
        # Count set bits
        if bin(mask).count('1') == k:
            combo = []
            for i in range(n):
                if mask & (1 << i):
                    combo.append(i + 1)
            result.append(combo)
    
    return result
```

---

## Python Templates

### Template 1: Standard Combinations (n choose k)

```python
def combine(n: int, k: int) -> list[list[int]]:
    """
    Template for generating all k-combinations from 1 to n.
    Time: O(C(n,k) * k), Space: O(k) for recursion
    """
    result = []
    
    def backtrack(start: int, path: list[int]):
        # Base case: combination complete
        if len(path) == k:
            result.append(path[:])
            return
        
        # Try each possible next element
        for i in range(start, n + 1):
            # Optional pruning: not enough elements left
            if n - i + 1 < k - len(path):
                break
            
            path.append(i)
            backtrack(i + 1, path)  # i+1 ensures forward movement
            path.pop()
    
    backtrack(1, [])
    return result
```

### Template 2: Combination Sum (Unlimited Use)

```python
def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    """
    Template for combination sum where elements can be reused.
    Time: O(target/min(candidates)), Space: O(target/min(candidates))
    """
    result = []
    candidates.sort()  # Sort for pruning
    
    def backtrack(start: int, remaining: int, path: list[int]):
        if remaining == 0:
            result.append(path[:])
            return
        
        for i in range(start, len(candidates)):
            # Pruning: too large
            if candidates[i] > remaining:
                break
            
            path.append(candidates[i])
            # Use i (not i+1) to allow reuse of same element
            backtrack(i, remaining - candidates[i], path)
            path.pop()
    
    backtrack(0, target, [])
    return result
```

### Template 3: Combination Sum II (Single Use, With Duplicates)

```python
def combination_sum2(candidates: list[int], target: int) -> list[list[int]]:
    """
    Template for combination sum with single use and duplicates.
    Each number used at most once, input may contain duplicates.
    Time: O(2^n), Space: O(n)
    """
    result = []
    candidates.sort()  # Sort for duplicate handling and pruning
    
    def backtrack(start: int, remaining: int, path: list[int]):
        if remaining == 0:
            result.append(path[:])
            return
        
        for i in range(start, len(candidates)):
            # Skip duplicates at same level
            if i > start and candidates[i] == candidates[i - 1]:
                continue
            
            # Pruning: too large
            if candidates[i] > remaining:
                break
            
            path.append(candidates[i])
            # Use i+1 (not i) - each element used once
            backtrack(i + 1, remaining - candidates[i], path)
            path.pop()
    
    backtrack(0, target, [])
    return result
```

### Template 4: Combinations from Array (Not 1 to n)

```python
def combine_from_array(nums: list[int], k: int) -> list[list[int]]:
    """
    Template for k-combinations from arbitrary array.
    Time: O(C(n,k) * k), Space: O(k)
    """
    result = []
    n = len(nums)
    
    def backtrack(start: int, path: list[int]):
        if len(path) == k:
            result.append(path[:])
            return
        
        for i in range(start, n):
            # Pruning
            if n - i < k - len(path):
                break
            
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result
```

### Template 5: Letter Combinations (Phone Keypad)

```python
def letter_combinations(digits: str) -> list[str]:
    """
    Template for letter combinations from multiple sets.
    Classic phone keypad problem.
    Time: O(4^n) where n is digit count, Space: O(4^n)
    """
    if not digits:
        return []
    
    mapping = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }
    
    result = []
    
    def backtrack(index: int, path: list[str]):
        if index == len(digits):
            result.append(''.join(path))
            return
        
        for letter in mapping[digits[index]]:
            path.append(letter)
            backtrack(index + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result
```

### Template 6: Combinations with Duplicates Handling

```python
def combine_unique(nums: list[int], k: int) -> list[list[int]]:
    """
    Template for unique combinations from array with duplicates.
    Time: O(C(n,k) * k), Space: O(k)
    """
    nums.sort()  # Essential for duplicate handling
    result = []
    n = len(nums)
    
    def backtrack(start: int, path: list[int]):
        if len(path) == k:
            result.append(path[:])
            return
        
        for i in range(start, n):
            # Skip duplicates at same level
            if i > start and nums[i] == nums[i - 1]:
                continue
            
            # Pruning
            if n - i < k - len(path):
                break
            
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result
```

---

## When to Use

Use the Combinations algorithm when you need to solve problems involving:

- **Selecting k from n**: When choosing k elements where order doesn't matter
- **Sum Target Problems**: Finding groups that sum to a target
- **Multi-set Combinations**: Combining choices from multiple categories
- **Enumerating All Selections**: When you need all possible groups

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|----------------|-------------------|---------------|
| **Backtracking** | O(C(n,k) × k) | O(k) | General combination problems |
| **Iterative** | O(C(n,k) × k) | O(k) | When recursion depth is a concern |
| **Bitmask** | O(2^n × n) | O(C(n,k) × k) | Small n (≤20), quick implementation |
| **Mathematical** | O(k) or O(1) | O(1) | When only count needed, not enumeration |

### When to Choose Combinations vs Related Patterns

- **Choose Combinations** when:
  - Order of selection doesn't matter
  - You're selecting k from n
  - You need to avoid duplicate orderings

- **Choose Permutations** when:
  - Order matters
  - You need all arrangements

- **Choose Subsets (Power Set)** when:
  - You need all possible groups of any size
  - Every element has binary choice (include/exclude)

---

## Algorithm Explanation

### Core Concept

The key insight behind combination generation is the **forward-only selection** strategy. By always selecting the next element from positions after the current element, we naturally:
1. Maintain sorted order within each combination
2. Avoid duplicate combinations (since {1,2} and {2,1} are the same)
3. Explore the solution space systematically

### How It Works

1. **Base Case**: When the current combination reaches size k, add it to results
2. **Recursive Case**: For each position from `start` to n:
   - Add the element to current combination
   - Recurse with `start = i + 1` (next position)
   - Remove element (backtrack) and try next

### Visual Representation

For n=4, k=2:

```
Start: []
│
├── Choose 1: [1]
│   ├── Choose 2: [1,2] → ✅
│   ├── Choose 3: [1,3] → ✅
│   └── Choose 4: [1,4] → ✅
│
├── Choose 2: [2]
│   ├── Choose 3: [2,3] → ✅
│   └── Choose 4: [2,4] → ✅
│
└── Choose 3: [3]
    └── Choose 4: [3,4] → ✅

Result: 6 combinations (C(4,2) = 6)
```

### Why It Works

- **No Duplicates**: Forward movement ensures each combination is unique
- **Complete**: Every valid k-combination is generated
- **Sorted**: Each combination is naturally in ascending order
- **Efficient**: Only explores C(n,k) paths, not n! like permutations

### Limitations

- **Exponential**: C(n,k) grows rapidly for large n and k ≈ n/2
- **Memory**: Storing all combinations requires O(C(n,k) × k) space
- **Not for Large n**: n > 30 with k ≈ n/2 becomes impractical

---

## Practice Problems

### Problem 1: Combinations

**Problem:** [LeetCode 77 - Combinations](https://leetcode.com/problems/combinations/)

**Description:** Given two integers n and k, return all possible combinations of k numbers chosen from 1 to n.

**How to Apply Combinations:**
- Classic k-combinations problem
- Use standard backtracking template
- Optional pruning: `if n - i + 1 < k - len(path): break`
- Time: O(C(n,k) × k), Space: O(k)

---

### Problem 2: Combination Sum

**Problem:** [LeetCode 39 - Combination Sum](https://leetcode.com/problems/combination-sum/)

**Description:** Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may use the same number unlimited times.

**How to Apply Combinations:**
- Sort candidates for pruning
- Use `backtrack(i, ...)` not `backtrack(i+1, ...)` to allow reuse
- Prune when `candidates[i] > remaining`
- Time: O(target/min_candidate), Space: O(target/min_candidate)

---

### Problem 3: Combination Sum II

**Problem:** [LeetCode 40 - Combination Sum II](https://leetcode.com/problems/combination-sum-ii/)

**Description:** Given a collection of candidate numbers and a target, find all unique combinations where the candidate numbers sum to target. Each number may be used once. The array contains duplicates.

**How to Apply Combinations:**
- Sort candidates (required for duplicate handling)
- Skip duplicates: `if i > start and candidates[i] == candidates[i-1]: continue`
- Use `backtrack(i+1, ...)` each element used once
- Time: O(2^n), Space: O(n)

---

### Problem 4: Letter Combinations of a Phone Number

**Problem:** [LeetCode 17 - Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)

**Description:** Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent based on phone keypad mapping.

**How to Apply Combinations:**
- Each digit maps to a set of letters
- Combine one letter from each digit's set
- Classic multi-set combination problem
- Time: O(4^n) where n is digit count, Space: O(4^n)

---

### Problem 5: Subsets (Power Set)

**Problem:** [LeetCode 78 - Subsets](https://leetcode.com/problems/subsets/)

**Description:** Given an integer array nums of unique elements, return all possible subsets (the power set).

**How to Apply Combinations:**
- Similar to combinations but for all sizes (0 to n)
- Add current path at every node, not just leaves
- Each element: include or exclude
- Time: O(n × 2^n), Space: O(n × 2^n)

---

## Video Tutorial Links

### Fundamentals

- [Combinations - Backtracking (NeetCode)](https://www.youtube.com/watch?v=q0s6m7AiM7w) - Clear pattern explanation
- [LeetCode 77 Combinations (Tech With Nikola)](https://www.youtube.com/watch?v=GBKI9VSKdGg) - Step-by-step walkthrough
- [Backtracking Algorithm Pattern (Back To Back SWE)](https://www.youtube.com/watch?v=DKC2sStG3-U) - Deep dive

### Problem-Specific

- [Combination Sum (NeetCode)](https://www.youtube.com/watch?v=GBKI9VSKdGg) - Unlimited reuse variations
- [Combination Sum II (NeetCode)](https://www.youtube.com/watch?v=0OghtN5M6lc) - Single use with duplicates
- [Letter Combinations (NeetCode)](https://www.youtube.com/watch?v=0snEunUacZY) - Multi-set combinations
- [Subsets vs Combinations (Kevin Naughton Jr.)](https://www.youtube.com/watch?v=77N5K-8hpfM) - Understanding differences

### Advanced Topics

- [Optimizing Backtracking with Pruning](https://www.youtube.com/watch?v=Zq4upTEaIog) - Pruning techniques
- [Iterative Combination Generation](https://www.youtube.com/watch?v=REOH22Xwdkk) - Non-recursive approaches

---

## Follow-up Questions

### Q1: How does the backtracking approach avoid generating duplicate combinations?

**Answer:** The forward-only selection strategy ensures no duplicates:
- After choosing element at index i, we only consider elements from i+1 onwards
- This means {1,2} can be generated but {2,1} cannot (since 1 comes before 2)
- Since order doesn't matter in combinations, we only need one ordering
- The `start` parameter in recursion enforces this forward movement

### Q2: What is the difference between combinations and permutations?

**Answer:**

| Aspect | Combinations | Permutations |
|--------|--------------|--------------|
| **Order matters** | No | Yes |
| **Notation** | C(n,k) | P(n,k) |
| **Count** | n!/(k!(n-k)!) | n!/(n-k)! |
| **Implementation** | `start` index | `used` array |
| **Example n=3, k=2** | {1,2}, {1,3}, {2,3} | [1,2], [2,1], [1,3], [3,1], [2,3], [3,2] |

### Q3: How do you handle memory issues when C(n,k) is very large?

**Answer:** Several strategies:
1. **Generator pattern**: Yield combinations one at a time instead of storing all
2. **Process as you generate**: Don't store, process immediately
3. **Pruning**: Add more constraints to reduce valid combinations
4. **Iterative with streaming**: Write results to file instead of memory
5. **Mathematical approach**: Calculate count without enumeration when only count needed

### Q4: Why do we make a copy when adding to result?

**Answer:** In Python, lists are mutable objects:
- `result.append(path)` adds a reference to the same list
- All entries would point to the same list object
- When `path` changes, all "stored" combinations change with it
- `result.append(path[:])` creates a snapshot copy at that moment
- This preserves each combination as it was when found

### Q5: Can combinations be generated without recursion?

**Answer:** Yes, using lexicographic ordering:

```python
def combine_iterative(n, k):
    result = []
    combo = list(range(1, k + 1))  # First combination
    
    while True:
        result.append(combo[:])
        
        # Find rightmost element that can be incremented
        i = k - 1
        while i >= 0 and combo[i] == n - k + i + 1:
            i -= 1
        
        if i < 0:
            break
        
        combo[i] += 1
        for j in range(i + 1, k):
            combo[j] = combo[j - 1] + 1
    
    return result
```

This uses O(k) space and avoids recursion depth limits.

---

## Summary

The Combinations algorithm using backtracking is a fundamental technique for generating all k-selections from n elements. Key takeaways:

- **Forward-Only Selection**: Use `start` index to avoid duplicates and maintain order
- **Binomial Coefficient**: C(n,k) = n!/(k!(n-k)!) total combinations
- **Time Complexity**: O(C(n,k) × k) — must generate and copy each combination
- **Space Complexity**: O(k) for recursion stack + O(C(n,k) × k) for storage
- **Pruning**: Skip branches where not enough elements remain
- **Duplicates**: Sort input, skip duplicates at same recursion level

When to use:
- ✅ Selecting k elements where order doesn't matter
- ✅ Finding groups that sum to a target
- ✅ Multi-set combination problems
- ✅ Enumerating all possible selections
- ❌ When order matters (use permutations)
- ❌ When you only need the count (use mathematical formula)

Master the combination pattern as it forms the foundation for many backtracking interview problems and appears frequently in combinatorial challenges.
