# Combinations

## Category
Backtracking

## Description
Generate all k-combinations from n elements.

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

## How It Works
Generate all k-combinations from n elements using **backtracking**. A combination is a selection of k elements from a set of n elements where the order doesn't matter.

**Key Concept:** At each position, we choose an element from the remaining pool and recursively choose the remaining elements.

**Backtracking Approach:**
1. Start with an empty combination
2. At each step, try adding the next available element
3. Recurse to fill the remaining positions
4. Backtrack (remove the last element) to try other possibilities

**Why it works:** We systematically explore all possible selections by:
- Tracking the current start index
- For each index, either include it in the combination or skip it
- Using recursion to handle the remaining positions

**Algorithm Detail:**
- Use a helper function with parameters: `start` (current index), `path` (current combination)
- At each recursion level, iterate from `start` to `n - 1`
- Add current element to path, recurse with `start + 1`
- Backtrack by removing the last element
- Base case: when `len(path) == k`, add a copy to result

---

## Implementation

```python
def combine(n, k):
    """
    Generate all k-combinations from 1 to n
    Time: O(C(n,k) * k)
    Space: O(k) for recursion stack + O(C(n,k) * k) for result
    
    Args:
        n: Total number of elements (1 to n)
        k: Size of each combination
    
    Returns:
        List of all k-combinations
    """
    result = []
    
    def backtrack(start, path):
        # Base case: combination is complete
        if len(path) == k:
            result.append(path[:])  # Append a copy
            return
        
        # Try adding each remaining element
        for i in range(start, n):
            path.append(i + 1)  # Add element (1-indexed)
            backtrack(i + 1, path)  # Recurse with next start index
            path.pop()  # Backtrack: remove last element
    
    backtrack(0, [])
    return result


# Example usage
if __name__ == "__main__":
    n, k = 4, 2
    result = combine(n, k)
    print(f"Combinations of {k} from 1 to {n}:")
    print(result)
    # Output: [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]
```

```javascript
function combinations() {
    // Combinations implementation
    // Time: O(C(n,k) * k)
    // Space: O(k)
}
```

---

## Example

**Input:**
```
n = 4, k = 2
```

**Output:**
```
Combinations of 2 from 1 to 4:
[[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]
```

**Explanation:** All possible ways to choose 2 elements from {1, 2, 3, 4}:
- [1, 2], [1, 3], [1, 4]
- [2, 3], [2, 4]
- [3, 4]

---

## Time Complexity
**O(C(n,k) * k)**

---

## Space Complexity
**O(k)**

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
