# Prefix Sum

## Category
Arrays & Strings

## Description
Pre-compute cumulative sums to answer range sum queries in O(1) time.

## Algorithm Explanation
Prefix Sum is a technique that allows answering range sum queries in constant time after O(n) preprocessing. Instead of summing elements for each query (O(n) per query), we precompute cumulative sums and answer queries in O(1).

**Key Concept:**
- Prefix sum at index i stores the sum of all elements from index 0 to i (inclusive)
- Range sum from l to r = prefix[r] - prefix[l-1]

**Algorithm Steps:**
1. **Build prefix array**: `prefix[i] = prefix[i-1] + arr[i]`
2. **Query range sum**: `sum(l, r) = prefix[r] - prefix[l-1]` (if l > 0)

**Why it works:**
- Prefix[r] = arr[0] + arr[1] + ... + arr[r]
- Prefix[l-1] = arr[0] + arr[1] + ... + arr[l-1]
- Prefix[r] - Prefix[l-1] = arr[l] + ... + arr[r]

**Variations:**
1. **1D Prefix Sum**: Sum over array range
2. **2D Prefix Sum**: Sum over matrix sub-rectangle
3. **Prefix XOR**: XOR instead of sum for certain problems

**Time Complexity:**
- Preprocessing: O(n)
- Query: O(1)

**Space Complexity:** O(n)

---

## When to Use
Use this algorithm when you need to solve problems involving:
- arrays & strings related operations
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

## Implementation

```python
class PrefixSum:
    """
    1D Prefix Sum implementation for range sum queries.
    """
    
    def __init__(self, nums):
        """
        Initialize prefix sum array.
        
        Args:
            nums: List of numbers
        
        Time: O(n)
        Space: O(n)
        """
        self.n = len(nums)
        self.prefix = [0] * (self.n + 1)
        
        # prefix[i] = sum of nums[0:i]
        for i in range(self.n):
            self.prefix[i + 1] = self.prefix[i] + nums[i]
    
    def range_sum(self, left, right):
        """
        Get sum of elements from left to right (inclusive).
        
        Args:
            left: Start index
            right: End index
        
        Returns:
            Sum of nums[left:right+1]
        
        Time: O(1)
        """
        return self.prefix[right + 1] - self.prefix[left]


def prefix_sum_array(nums):
    """Standalone function to build prefix sum array."""
    prefix = [0]
    for num in nums:
        prefix.append(prefix[-1] + num)
    return prefix


def range_sum_queries(nums, queries):
    """
    Answer multiple range sum queries.
    
    Args:
        nums: Input array
        queries: List of [left, right] queries
    
    Returns:
        List of sums for each query
    """
    prefix = prefix_sum_array(nums)
    results = []
    
    for left, right in queries:
        results.append(prefix[right + 1] - prefix[left])
    
    return results


# 2D Prefix Sum
class PrefixSum2D:
    """2D Prefix Sum for matrix range queries."""
    
    def __init__(self, matrix):
        """Build 2D prefix sum."""
        if not matrix or not matrix[0]:
            self.prefix = []
            return
        
        m, n = len(matrix), len(matrix[0])
        self.prefix = [[0] * (n + 1) for _ in range(m + 1)]
        
        for i in range(m):
            for j in range(n):
                self.prefix[i + 1][j + 1] = (
                    matrix[i][j]
                    + self.prefix[i][j + 1]
                    + self.prefix[i + 1][j]
                    - self.prefix[i][j]
                )
    
    def region_sum(self, row1, col1, row2, col2):
        """Sum of rectangle from (row1,col1) to (row2,col2)."""
        return (
            self.prefix[row2 + 1][col2 + 1]
            - self.prefix[row1][col2 + 1]
            - self.prefix[row2 + 1][col1]
            + self.prefix[row1][col1]
        )
```

```javascript
class PrefixSum {
    constructor(nums) {
        this.prefix = new Array(nums.length + 1).fill(0);
        for (let i = 0; i < nums.length; i++) {
            this.prefix[i + 1] = this.prefix[i] + nums[i];
        }
    }
    
    rangeSum(left, right) {
        return this.prefix[right + 1] - this.prefix[left];
    }
}

function rangeSumQueries(nums, queries) {
    const prefix = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    
    return queries.map(([left, right]) => 
        prefix[right + 1] - prefix[left]
    );
}
```

---

## Example

**Input:**
```
nums = [2, 4, 1, 5, 3]
```

**Build prefix array:**
```
prefix = [0, 2, 6, 7, 12, 15]
```

**Query: range_sum(1, 3)**
```
Output: 10
Explanation: 4 + 1 + 5 = 10
```

**Query: range_sum(0, 4)**
```
Output: 15
Explanation: 2 + 4 + 1 + 5 + 3 = 15
```

**Query: range_sum(2, 2)**
```
Output: 1
Explanation: Only element at index 2
```

**Multiple Queries:**
```
nums = [1, 2, 3, 4, 5]
queries = [[0, 2], [1, 3], [2, 4]]
```

**Output:**
```
[6, 9, 12]
```

**Explanation:**
- [0,2]: 1+2+3 = 6
- [1,3]: 2+3+4 = 9
- [2,4]: 3+4+5 = 12

**2D Prefix Sum:**
```
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
Query: (0,0) to (2,2)
```

**Output:**
```
45
```

Explanation: Sum of all elements = 1+2+3+4+5+6+7+8+9 = 45

---

## Time Complexity
**O(n) preprocessing, O(1) query**

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
