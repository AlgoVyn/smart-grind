# Permutations

## Category
Backtracking

## Description

The Permutations algorithm generates all possible arrangements (orderings) of elements in a collection. This fundamental combinatorial technique is essential for solving problems that require exploring all possible orderings, from scheduling problems to password cracking and game AI decision trees.

For n distinct elements, there are exactly n! (n factorial) possible permutations. The backtracking approach systematically explores all arrangements by building permutations incrementally, trying each available element at each position, and "backtracking" (undoing choices) to explore alternative paths. This technique appears frequently in technical interviews and competitive programming for problems involving arrangements, orderings, and exhaustive search.

---

## Concepts

The Permutations algorithm is built on several fundamental concepts that make it effective for combinatorial problems.

### 1. Factorial Growth

The number of permutations grows factorially with input size:

| n | n! | Approximate Size |
|---|-----|------------------|
| 3 | 6 | Trivial |
| 5 | 120 | Small |
| 8 | 40,320 | Moderate |
| 10 | 3,628,800 | Large |
| 12 | 479,001,600 | Very Large |

### 2. Decision Tree Structure

Each level of recursion represents a position in the permutation:

```
Level 0: Choose 1st element (n choices)
Level 1: Choose 2nd element (n-1 choices)
Level 2: Choose 3rd element (n-2 choices)
...
Level n-1: Choose last element (1 choice)
```

| Level | Choices Available | State |
|-------|-----------------|-------|
| 0 | n | Start |
| 1 | n-1 | One element placed |
| 2 | n-2 | Two elements placed |
| n | 0 | Complete permutation |

### 3. State Tracking

Two main approaches track which elements are used:

| Approach | Mechanism | Space | Pros |
|----------|-----------|-------|------|
| **Swap-based** | Swap elements in original array | O(1) aux | Memory efficient |
| **Used Array** | Boolean array tracks used indices | O(n) | Easier to understand |

### 4. Duplicate Handling

When input contains duplicates, special handling prevents duplicate permutations:

- Sort the array first to group duplicates
- Skip elements that are duplicates AND the previous duplicate wasn't used
- This ensures each unique value is only used once per level

---

## Frameworks

Structured approaches for solving permutation problems.

### Framework 1: Used Array Permutation Template

```
┌─────────────────────────────────────────────────────────────┐
│  PERMUTATION WITH USED ARRAY FRAMEWORK                        │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize:                                                │
│     - result = []                                             │
│     - used = [False] * n                                      │
│     - current = []                                            │
│                                                              │
│  2. Define backtrack(current):                               │
│     - Base: if len(current) == n:                             │
│         result.append(current[:])                            │
│         return                                               │
│                                                              │
│     - For each i in range(n):                                │
│         If not used[i]:                                       │
│           used[i] = True                                     │
│           current.append(nums[i])                            │
│           backtrack(current)                                 │
│           current.pop()                                      │
│           used[i] = False                                    │
│                                                              │
│  3. Call backtrack([]) and return result                     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Most intuitive approach; handles duplicates easily.

### Framework 2: Swap-based Permutation Template

```
┌─────────────────────────────────────────────────────────────┐
│  PERMUTATION WITH SWAP FRAMEWORK                              │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize result = []                                    │
│                                                              │
│  2. Define backtrack(start):                                 │
│     - Base: if start == n:                                   │
│         result.append(nums[:])                               │
│         return                                               │
│                                                              │
│     - For each i from start to n-1:                          │
│         Swap nums[start] and nums[i]                        │
│         backtrack(start + 1)                                 │
│         Swap back (restore)                                  │
│                                                              │
│  3. Call backtrack(0) and return result                      │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Memory-constrained scenarios; in-place generation.

### Framework 3: Next Permutation Framework

```
┌─────────────────────────────────────────────────────────────┐
│  NEXT PERMUTATION FRAMEWORK                                   │
├─────────────────────────────────────────────────────────────┤
│  Find the next lexicographically greater arrangement:        │
│                                                              │
│  1. Find first decreasing element from right (pivot)       │
│     - Scan from right: find i where nums[i] < nums[i+1]      │
│                                                              │
│  2. Find successor (smallest element > nums[i] from right) │
│                                                              │
│  3. Swap pivot and successor                                 │
│                                                              │
│  4. Reverse suffix (elements after pivot position)          │
│     - This gives the minimum increase                        │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Finding single next permutation in O(n) time.

---

## Forms

Different manifestations of the permutation pattern.

### Form 1: All Permutations (Distinct Elements)

Generate all n! permutations of distinct elements.

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Used Array | O(n! × n) | O(n) | Clarity, duplicates handling |
| Swap-based | O(n! × n) | O(1) aux | Memory efficiency |
| Heap's Algorithm | O(n!) | O(1) | Minimal swaps |

### Form 2: Unique Permutations (With Duplicates)

Handle arrays containing duplicate elements.

```
Key technique:
1. Sort the array
2. Skip nums[i] if:
   - nums[i] == nums[i-1] AND
   - nums[i-1] was not used in current permutation

This ensures each unique value is used once per level
```

| Input | Without Handling | With Handling |
|-------|-----------------|---------------|
| [1,1,2] | 6 permutations (duplicates) | 3 unique permutations |

### Form 3: K-th Permutation

Find the k-th permutation without generating all permutations.

```
Mathematical approach using factorial number system:
1. k -= 1 (convert to 0-indexed)
2. For position i from n down to 1:
   - index = k // factorial(i-1)
   - k = k % factorial(i-1)
   - Select element at index from remaining
```

Time: O(n^2) or O(n) with efficient data structure.

### Form 4: Next Permutation

Transform array to next lexicographically greater arrangement.

| Step | Action | Time |
|------|--------|------|
| 1 | Find pivot (first decreasing from right) | O(n) |
| 2 | Find successor (smallest > pivot) | O(n) |
| 3 | Swap pivot and successor | O(1) |
| 4 | Reverse suffix | O(n) |
| **Total** | | **O(n)** |

### Form 5: Permutation Iterator

Generate permutations lazily without storing all.

```python
# Using Python's itertools
from itertools import permutations
for perm in permutations(nums):
    process(perm)  # Memory efficient
```

---

## Tactics

Specific techniques for permutation problems.

### Tactic 1: Skip Duplicates in Used Array Approach

```python
def permute_unique(nums: list[int]) -> list[list[int]]:
    """Generate unique permutations with duplicate handling."""
    nums.sort()  # Sort to group duplicates
    result = []
    n = len(nums)
    used = [False] * n
    
    def backtrack(path: list[int]):
        if len(path) == n:
            result.append(path[:])
            return
        
        for i in range(n):
            if used[i]:
                continue
            # Skip duplicates: only use first occurrence at this level
            if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                continue
            
            used[i] = True
            path.append(nums[i])
            backtrack(path)
            path.pop()
            used[i] = False
    
    backtrack([])
    return result
```

### Tactic 2: Skip Duplicates in Swap Approach

```python
def permute_unique_swap(nums: list[int]) -> list[list[int]]:
    """Generate unique permutations using swap method."""
    result = []
    n = len(nums)
    nums.sort()  # Sort to group duplicates
    
    def backtrack(start: int):
        if start == n:
            result.append(nums[:])
            return
        
        for i in range(start, n):
            # Skip if this is a duplicate at this level
            if i > start and nums[i] == nums[start]:
                continue
            
            nums[start], nums[i] = nums[i], nums[start]
            backtrack(start + 1)
            nums[start], nums[i] = nums[i], nums[start]
    
    backtrack(0)
    return result
```

### Tactic 3: Mathematical K-th Permutation

```python
def get_kth_permutation(n: int, k: int) -> str:
    """
    Find k-th permutation of [1, 2, ..., n].
    Time: O(n^2), Space: O(n)
    """
    # Create list of available numbers
    nums = list(range(1, n + 1))
    k -= 1  # Convert to 0-indexed
    result = []
    
    # Precompute factorials
    factorial = [1] * (n + 1)
    for i in range(2, n + 1):
        factorial[i] = factorial[i - 1] * i
    
    for i in range(n, 0, -1):
        # Determine which number to pick
        idx = k // factorial[i - 1]
        k = k % factorial[i - 1]
        
        result.append(str(nums.pop(idx)))
    
    return ''.join(result)
```

### Tactic 4: Early Termination

Stop after finding first valid permutation meeting criteria:

```python
def find_valid_permutation(nums: list[int], condition) -> list[int]:
    """Find first permutation satisfying condition."""
    n = len(nums)
    used = [False] * n
    result = []
    
    def backtrack(path: list[int]) -> bool:
        if len(path) == n:
            if condition(path):
                result.append(path[:])
                return True  # Found it!
            return False
        
        for i in range(n):
            if not used[i]:
                used[i] = True
                path.append(nums[i])
                if backtrack(path):
                    return True  # Propagate success
                path.pop()
                used[i] = False
        
        return False
    
    backtrack([])
    return result[0] if result else []
```

### Tactic 5: Permutation Parity (Even/Odd)

Track whether permutation is even or odd (useful for some puzzles):

```python
def count_inversions(perm: list[int]) -> int:
    """Count inversions to determine parity."""
    count = 0
    for i in range(len(perm)):
        for j in range(i + 1, len(perm)):
            if perm[i] > perm[j]:
                count += 1
    return count

def is_even_permutation(perm: list[int]) -> bool:
    return count_inversions(perm) % 2 == 0
```

### Tactic 6: Lexicographic Comparison

Compare permutations efficiently:

```python
def is_lexicographically_smaller(perm1: list[int], perm2: list[int]) -> bool:
    """Check if perm1 comes before perm2 lexicographically."""
    for a, b in zip(perm1, perm2):
        if a < b:
            return True
        if a > b:
            return False
    return len(perm1) < len(perm2)
```

---

## Python Templates

### Template 1: All Permutations (Used Array)

```python
def permute(nums: list[int]) -> list[list[int]]:
    """
    Template for generating all permutations.
    Uses used array to track which elements are included.
    Time: O(n! × n), Space: O(n)
    """
    result = []
    n = len(nums)
    used = [False] * n
    
    def backtrack(current: list[int]):
        # Base case: complete permutation
        if len(current) == n:
            result.append(current[:])
            return
        
        # Try each unused element
        for i in range(n):
            if not used[i]:
                used[i] = True
                current.append(nums[i])
                backtrack(current)
                current.pop()
                used[i] = False
    
    backtrack([])
    return result
```

### Template 2: All Permutations (Swap-based)

```python
def permute_swap(nums: list[int]) -> list[list[int]]:
    """
    Template for in-place permutation generation.
    Swaps elements to generate permutations.
    Time: O(n! × n), Space: O(1) auxiliary
    """
    result = []
    n = len(nums)
    
    def backtrack(start: int):
        if start == n:
            result.append(nums[:])  # Make a copy
            return
        
        for i in range(start, n):
            # Swap current element to position 'start'
            nums[start], nums[i] = nums[i], nums[start]
            backtrack(start + 1)
            # Backtrack: restore original order
            nums[start], nums[i] = nums[i], nums[start]
    
    backtrack(0)
    return result
```

### Template 3: Unique Permutations (With Duplicates)

```python
def permute_unique(nums: list[int]) -> list[list[int]]:
    """
    Template for permutations with duplicate handling.
    Sorts first, then skips duplicates at same level.
    Time: O(n! × n) worst case, Space: O(n)
    """
    result = []
    nums.sort()  # Sort to group duplicates
    n = len(nums)
    used = [False] * n
    
    def backtrack(current: list[int]):
        if len(current) == n:
            result.append(current[:])
            return
        
        for i in range(n):
            if used[i]:
                continue
            
            # Skip duplicates: only use first occurrence at this level
            if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                continue
            
            used[i] = True
            current.append(nums[i])
            backtrack(current)
            current.pop()
            used[i] = False
    
    backtrack([])
    return result
```

### Template 4: Next Permutation (In-place)

```python
def next_permutation(nums: list[int]) -> None:
    """
    Template for finding next lexicographical permutation.
    Modifies array in-place.
    Time: O(n), Space: O(1)
    """
    n = len(nums)
    
    # Step 1: Find pivot (first decreasing from right)
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    
    # Step 2: Find successor and swap (if pivot found)
    if i >= 0:
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    
    # Step 3: Reverse suffix
    left, right = i + 1, n - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1
```

### Template 5: K-th Permutation

```python
def get_kth_permutation(n: int, k: int) -> str:
    """
    Template for finding k-th permutation without generating all.
    Uses factorial number system.
    Time: O(n^2), Space: O(n)
    """
    # Available numbers
    nums = list(range(1, n + 1))
    k -= 1  # Convert to 0-indexed
    
    # Precompute factorials
    factorial = [1] * (n + 1)
    for i in range(2, n + 1):
        factorial[i] = factorial[i - 1] * i
    
    result = []
    for i in range(n, 0, -1):
        idx = k // factorial[i - 1]
        k = k % factorial[i - 1]
        result.append(str(nums.pop(idx)))
    
    return ''.join(result)
```

### Template 6: String Permutations

```python
def string_permutations(s: str) -> list[str]:
    """
    Template for generating all permutations of a string.
    Handles duplicate characters properly.
    Time: O(n! × n), Space: O(n)
    """
    result = []
    chars = sorted(s)  # Sort for duplicate handling
    n = len(chars)
    used = [False] * n
    
    def backtrack(current: list[str]):
        if len(current) == n:
            result.append(''.join(current))
            return
        
        for i in range(n):
            if used[i]:
                continue
            if i > 0 and chars[i] == chars[i - 1] and not used[i - 1]:
                continue
            
            used[i] = True
            current.append(chars[i])
            backtrack(current)
            current.pop()
            used[i] = False
    
    backtrack([])
    return result
```

---

## When to Use

Use the Permutations algorithm when you need to solve problems involving:

- **Generating All Orderings**: When you need to explore all possible arrangements
- **Combinatorial Search**: When the solution requires trying all possible combinations
- **Finding Lexicographic Successor**: Next permutation problems
- **K-th Ordering**: Finding specific permutation without enumeration

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|----------------|-------------------|---------------|
| **Backtracking (Used Array)** | O(n! × n) | O(n) | Most intuitive, handles duplicates well |
| **Backtracking (Swap)** | O(n! × n) | O(1) aux | Memory-constrained scenarios |
| **Heap's Algorithm** | O(n!) | O(1) | Minimal swaps needed |
| **Next Permutation** | O(n) | O(1) | Sequential generation |
| **K-th (Mathematical)** | O(n^2) | O(n) | Direct access without enumeration |

### When to Choose Each Approach

- **Choose Used Array** when:
  - You want clear, readable code
  - Input may contain duplicates
  - You need to track exactly which elements are used

- **Choose Swap-based** when:
  - Memory is extremely constrained
  - You want in-place generation
  - Input has no duplicates

- **Choose Mathematical (K-th)** when:
  - You need a specific permutation without generating all
  - n is large but you only need one result

---

## Algorithm Explanation

### Core Concept

The key insight behind permutation generation is treating the problem as building a decision tree where each level corresponds to a position in the permutation. At each level, we try all unused elements, recursively building the rest of the permutation, then undoing our choice to try the next element.

### How It Works

1. **Used Array Approach**:
   - Track which elements are already in the current permutation
   - Try each unused element at current position
   - Mark as used, recurse, then unmark (backtrack)
   - When all positions filled, save the permutation

2. **Swap-based Approach**:
   - Swap each element into the current position
   - Recurse on remaining positions
   - Swap back to restore original order

### Visual Representation

For input `[1, 2, 3]`, the decision tree:

```
                     []
                   /  |  \
                 [1] [2] [3]
                / |   |   \
             [1,2][1,3][2,1][2,3][3,1][3,2]
              |    |    |    |    |    |
           [1,2,3] ... (complete permutations)
```

### Why It Works

- **Completeness**: Every possible permutation is explored exactly once
- **Correctness**: Each permutation contains all elements exactly once
- **No Duplicates**: By only using unused elements, we avoid repetition
- **Efficiency**: Early termination when solution found (optional)

### Limitations

- **Factorial Time**: n! grows extremely fast, impractical for n > 12
- **Memory**: Storing all permutations requires O(n! × n) space
- **Duplicates**: Requires special handling to avoid duplicate permutations

---

## Practice Problems

### Problem 1: Next Permutation

**Problem:** [LeetCode 31 - Next Permutation](https://leetcode.com/problems/next-permutation/)

**Description:** Given an array of integers, transform it to the next lexicographically greater permutation. If the array is the last permutation, wrap around to the first (sorted ascending).

**How to Apply Permutations:**
- Find pivot: first decreasing element from right
- Find successor: smallest element > pivot from right
- Swap pivot and successor
- Reverse suffix after pivot
- Time: O(n), Space: O(1)

---

### Problem 2: Permutations II (Unique Permutations)

**Problem:** [LeetCode 47 - Permutations II](https://leetcode.com/problems/permutations-ii/)

**Description:** Given a collection of numbers that may contain duplicates, return all unique permutations.

**How to Apply Permutations:**
- Sort the array first to group duplicates
- Use `used` array to track elements
- Skip duplicate elements at same recursion level: `if i > 0 and nums[i] == nums[i-1] and not used[i-1]: continue`
- Time: O(n! × n) worst case, Space: O(n)

---

### Problem 3: Permutation Sequence (K-th Permutation)

**Problem:** [LeetCode 60 - Permutation Sequence](https://leetcode.com/problems/permutation-sequence/)

**Description:** Given n and k, return the k-th permutation sequence of numbers 1 to n.

**How to Apply Permutations:**
- Use factorial number system (factoradic)
- Calculate which element to pick at each position using factorials
- Don't generate all permutations
- Time: O(n^2), Space: O(n)

---

### Problem 4: Permutation in String

**Problem:** [LeetCode 567 - Permutation in String](https://leetcode.com/problems/permutation-in-string/)

**Description:** Given two strings s1 and s2, return true if s2 contains a permutation of s1 (any arrangement of s1's characters as a substring).

**How to Apply Permutations:**
- Instead of generating permutations, use sliding window with character count
- Compare character frequency maps
- Time: O(n), Space: O(1) (fixed 26 characters)

---

### Problem 5: Letter Case Permutation

**Problem:** [LeetCode 784 - Letter Case Permutation](https://leetcode.com/problems/letter-case-permutation/)

**Description:** Given a string s, return all possible strings we could create by changing the case of some (or none) of the letters. Digits remain as is.

**How to Apply Permutations:**
- At each alphabetic character, branch: lowercase or uppercase
- Digits have only one branch
- Similar to permutation with binary choices per letter
- Time: O(2^L × n) where L is number of letters, Space: O(2^L × n)

---

## Video Tutorial Links

### Fundamentals

- [Permutations - Backtracking (Take U Forward)](https://www.youtube.com/watch?v=YK1PFtS5uQQ) - Comprehensive introduction
- [Generate All Permutations (WilliamFiset)](https://www.youtube.com/watch?v=18YkysX3h2Q) - Visual explanation
- [Permutations - LeetCode Solution (NeetCode)](https://www.youtube.com/watch?v=oC88Gt3FZq8) - Practical implementation

### Advanced Topics

- [Next Permutation Algorithm](https://www.youtube.com/watch?v=quAS1Iyd8O0) - Efficient next permutation
- [Permutations with Duplicates](https://www.youtube.com/watch?v=0OghtN5M6lc) - Handling duplicates
- [K-th Permutation](https://www.youtube.com/watch?v=w7a0BfFGf3U) - Mathematical approach
- [Heap's Algorithm](https://www.youtube.com/watch?v=72B80M4WK6M) - Minimal swaps

---

## Follow-up Questions

### Q1: How do you handle permutations when n is very large (n > 12)?

**Answer:** For large n:
1. **Don't generate all**: Use mathematical approaches (k-th permutation)
2. **Pruning**: Only generate permutations meeting specific criteria
3. **Random sampling**: Generate random permutations for estimation
4. **Iterative deepening**: Limit depth of search
5. **Approximation**: Use heuristics when exact enumeration is infeasible

### Q2: What is the difference between permutations and combinations?

**Answer:**

| Aspect | Permutations | Combinations |
|--------|--------------|--------------|
| **Order matters** | Yes | No |
| **Formula** | P(n,k) = n!/(n-k)! | C(n,k) = n!/(k!(n-k)!) |
| **Count** | More | Less |
| **Example** | [1,2] ≠ [2,1] | {1,2} = {2,1} |
| **Implementation** | `used` array or swap | `start` index |

### Q3: How do you generate permutations iteratively?

**Answer:** Three main approaches:
1. **Next Permutation**: Use `next_permutation()` repeatedly in a loop
2. **Heap's Algorithm**: Iterative version of the recursive algorithm
3. **Steinhaus-Johnson-Trotter**: Generate using adjacent swaps

```python
# Using next_permutation iteratively
def permutations_iterative(nums):
    nums.sort()
    result = [nums[:]]
    while True:
        # Find next permutation manually
        i = len(nums) - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1
        if i < 0:
            break
        j = len(nums) - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
        nums[i+1:] = reversed(nums[i+1:])
        result.append(nums[:])
    return result
```

### Q4: Can you optimize for finding just one valid permutation?

**Answer:** Yes, add early termination:

```python
def find_one_permutation(nums, condition):
    def backtrack(path):
        if len(path) == len(nums):
            return path[:] if condition(path) else None
        
        for i in range(len(nums)):
            if not used[i]:
                used[i] = True
                path.append(nums[i])
                result = backtrack(path)
                if result:  # Early termination!
                    return result
                path.pop()
                used[i] = False
        return None
    
    used = [False] * len(nums)
    return backtrack([])
```

### Q5: How do you determine if one array is a permutation of another?

**Answer:** Three methods:
1. **Sorting**: Sort both and compare - O(n log n)
2. **Frequency Count**: Count elements in both, compare - O(n)
3. **XOR** (for numbers): XOR all elements from both arrays, should be 0 - O(n)

```python
def is_permutation(arr1, arr2):
    if len(arr1) != len(arr2):
        return False
    from collections import Counter
    return Counter(arr1) == Counter(arr2)  # O(n)
```

---

## Summary

The Permutations algorithm is a fundamental backtracking technique for generating all possible arrangements of elements. Key takeaways:

- **Factorial Growth**: n! permutations exist for n distinct elements
- **Two Main Approaches**: Used array (intuitive) vs swap-based (memory efficient)
- **Duplicate Handling**: Sort and skip duplicates at same recursion level
- **Time Complexity**: O(n! × n) - must copy each permutation
- **Space Complexity**: O(n) for recursion stack
- **K-th Permutation**: Can be found mathematically in O(n^2) without enumeration

When to use:
- ✅ Generating all possible orderings
- ✅ Finding next/previous lexicographic permutation
- ✅ Problems requiring exhaustive arrangement search
- ❌ When n > 12 (consider mathematical approaches)
- ❌ When order doesn't matter (use combinations instead)

Master the permutation pattern as it appears frequently in technical interviews and serves as the foundation for many combinatorial problems.
