# Combination Sum

## Category
Backtracking

## Description
Find all combinations that sum to target (with repetition allowed).

---

## When to Use
Use this algorithm when you need to solve problems involving:
- backtracking related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Algorithm Explanation

The Combination Sum problem uses backtracking to find all unique combinations of candidates that sum to a target. Unlike other combination problems, each candidate can be used unlimited times (unbounded).

**Key Concepts:**

1. **Backtracking**: A systematic way to explore all possible solutions by building candidates incrementally and removing (backtracking) when a solution is not valid

2. **Sorting**: Sort candidates first to enable pruning - if current sum exceeds target, no need to explore larger candidates

3. **Pruning**: Skip branches that cannot lead to valid solutions early

**Algorithm Steps:**
1. Sort the candidates (enables early termination)
2. Use recursive backtracking:
   - At each level, try each candidate starting from current index
   - Add candidate to current combination
   - Recurse with same index (to allow reuse)
   - Backtrack by removing the candidate

**Why sort?** When candidates are sorted, if adding a candidate exceeds the target, we know all larger candidates will also exceed - we can stop exploring that branch.

**Time Complexity:** O(2^n) in worst case - exponential due to exploring all combinations
**Space Complexity:** O(target) for recursion stack and current combination

---

## Implementation

```python
def combination_sum(candidates, target):
    """
    Find all unique combinations of candidates that sum to target.
    Each candidate may be used unlimited times.
    
    Args:
        candidates: List of distinct positive integers
        target: Target sum
        
    Returns:
        List of all unique combinations
        
    Time: O(2^n)
    Space: O(target) for recursion stack
    """
    candidates.sort()  # Sort to enable pruning
    result = []
    
    def backtrack(start, current组合, remaining):
        """Recursively build combinations."""
        # Base case: found valid combination
        if remaining == 0:
            result.append(list(current组合))
            return
        
        # Try each candidate from start index
        for i in range(start, len(candidates)):
            candidate = candidates[i]
            
            # Pruning: if candidate > remaining, no need to try larger ones
            if candidate > remaining:
                break
            
            # Choose: add candidate to current combination
            current组合.append(candidate)
            
            # Explore: recurse with same index (unlimited use allowed)
            backtrack(i, current组合, remaining - candidate)
            
            # Unchoose: backtrack
            current组合.pop()
    
    backtrack(0, [], target)
    return result


# Alternative: Iterative approach using BFS-style
def combination_sum_iterative(candidates, target):
    """Iterative solution using BFS approach."""
    candidates.sort()
    result = [[0]]  # Start with empty combination with sum 0
    
    for i, candidate in enumerate(candidates):
        new_result = []
        for combination in result:
            total = sum(combination)
            # Add this candidate multiple times
            while total < target:
                new_combination = combination + [candidate]
                new_result.append(new_combination)
                total += candidate
            # If exactly target, this is valid
            if total == target:
                new_result.append(combination + [candidate])
        result = new_result
    
    # Filter combinations that sum to target
    return [combo for combo in result if sum(combo) == target]
```

```javascript
function combinationSum() {
    // Combination Sum implementation
    // Time: O(2^n)
    // Space: O(target)
}
```

---

## Example

**Input:**
```
candidates = [2, 3, 6, 7]
target = 7
```

**Output:**
```
[[2, 2, 3], [7]]
```

**Explanation:**
All unique combinations that sum to 7:
- [2, 2, 3] = 2 + 2 + 3 = 7
- [7] = 7 (single candidate)

Note: [3, 2, 2] is same as [2, 2, 3] - duplicates not allowed

**Additional Examples:**
```
Input: candidates = [2, 3, 5], target = 8
Output: [[2, 2, 2, 2], [2, 3, 3], [3, 5]]

Input: candidates = [2], target = 1
Output: []  (no combination possible)

Input: candidates = [1], target = 1
Output: [[1]]
```

---

## Time Complexity
**O(2^n)**

---

## Space Complexity
**O(target)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
