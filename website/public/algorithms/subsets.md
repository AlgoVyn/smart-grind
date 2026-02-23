# Subsets

## Category
Backtracking

## Description
Generate all subsets of a set (power set).

---

## When to Use
Use this algorithm when you need to solve problems involving:
- backtracking related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation

Generating Subsets (also known as Power Set) is a classic problem where we need to generate all possible subsets of a given set. For a set of size n, there are 2^n subsets (including empty set).

### Approaches:

#### 1. Backtracking (DFS)
- Treat the problem as exploring a decision tree
- At each element, we have two choices: include or exclude
- Recursively build all combinations

#### 2. Bit Manipulation
- Each subset can be represented as an n-bit number
- For each number from 0 to 2^n - 1:
  - The bit representation tells which elements are in the subset
  - Build the subset based on set bits

### Key Insights:
- The number of subsets is always 2^n (exponential)
- Order of elements in input matters for output order
- Subsets can be generated in sorted or unsorted order depending on requirement

---

## Algorithm Steps

### Backtracking Approach:
1. Start with empty subset
2. For each index from current position to end:
   a. Add current element to subset
   b. Recursively generate subsets with this element
   c. Remove current element (backtrack)
3. Base case: when we've processed all elements, add subset to result

### Bit Manipulation Approach:
1. Calculate total subsets = 2^n
2. For each number from 0 to total - 1:
   a. Convert number to binary representation
   b. For each bit position i:
      - If bit is set, include nums[i] in current subset
   c. Add the constructed subset to result

---

## Implementation

```python
def subsets(nums: list) -> list:
    """
    Generate all possible subsets (power set) using backtracking.
    
    Args:
        nums: Input array of distinct integers
        
    Returns:
        List of all possible subsets
        
    Time: O(n * 2^n)
    Space: O(n) for recursion stack
    """
    result = []
    
    def backtrack(start: int, current: list):
        # Add a copy of current subset (not reference)
        result.append(current[:])
        
        # Try adding each remaining element
        for i in range(start, len(nums)):
            # Include nums[i]
            current.append(nums[i])
            
            # Recursively generate subsets with nums[i]
            backtrack(i + 1, current)
            
            # Backtrack: remove nums[i]
            current.pop()
    
    backtrack(0, [])
    return result


def subsets_iterative(nums: list) -> list:
    """
    Generate all subsets using iterative approach.
    Start with [[]] and for each number, add it to existing subsets.
    
    Time: O(n * 2^n)
    Space: O(n * 2^n) for result
    """
    result = [[]]  # Start with empty set
    
    for num in nums:
        # For each existing subset, create new subset with current num
        new_subsets = [subset + [num] for subset in result]
        result.extend(new_subsets)
    
    return result


def subsets_bit_manipulation(nums: list) -> list:
    """
    Generate all subsets using bit manipulation.
    Each subset is represented by bits - if bit i is set, nums[i] is in subset.
    
    Args:
        nums: Input array
        
    Returns:
        List of all subsets
        
    Time: O(n * 2^n)
    Space: O(n * 2^n)
    """
    n = len(nums)
    result = []
    
    # Total subsets = 2^n
    for mask in range(1 << n):
        subset = []
        for i in range(n):
            # Check if bit i is set in mask
            if mask & (1 << i):
                subset.append(nums[i])
        result.append(subset)
    
    return result


# Example usage
if __name__ == "__main__":
    nums = [1, 2, 3]
    
    print(f"Input: {nums}")
    print(f"\nSubsets (Backtracking):")
    for subset in subsets(nums):
        print(subset)
    
    print(f"\nSubsets (Iterative):")
    for subset in subsets_iterative(nums):
        print(subset)
    
    print(f"\nSubsets (Bit Manipulation):")
    for subset in subsets_bit_manipulation(nums):
        print(subset)

```javascript
function subsets() {
    // Subsets implementation
    // Time: O(2^n)
    // Space: O(n)
}
```

---

## Example

**Input:**
```python
nums = [1, 2, 3]
```

**Output:**
```
Input: [1, 2, 3]

Subsets (Backtracking):
[]
[1]
[1, 2]
[1, 2, 3]
[1, 3]
[2]
[2, 3]
[3]
```

**Explanation:**
For set [1, 2, 3], there are 2^3 = 8 subsets:
- [] (empty set)
- [1]
- [2]
- [3]
- [1, 2]
- [1, 3]
- [2, 3]
- [1, 2, 3]

**Decision Tree:**
```
                    []
                 /   |   \
               [1]  [2]  [3]
              /  \    \
         [1,2] [1,3]  [2,3]
            \
        [1,2,3]
```

**Bit Representation (n=3):**
| Mask | Binary | Subset |
|------|--------|--------|
| 0 | 000 | [] |
| 1 | 001 | [1] |
| 2 | 010 | [2] |
| 3 | 011 | [1,2] |
| 4 | 100 | [3] |
| 5 | 101 | [1,3] |
| 6 | 110 | [2,3] |
| 7 | 111 | [1,2,3] |

---

## Time Complexity
**O(2^n)**

---

## Space Complexity
**O(n)**

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
