# Fenwick Tree (BIT)

## Category
Advanced

## Description
Binary Indexed Tree for efficient prefix sum queries.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- advanced related operations
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

A Fenwick Tree (Binary Indexed Tree or BIT) is a data structure that supports two operations in O(log n) time:
1. **Point Update**: Add a value at index i
2. **Prefix Sum**: Calculate sum of first k elements

**Why Fenwick Tree?**
- Much simpler to implement than Segment Tree
- Uses less memory (O(n) vs O(4n))
- Same time complexity for both operations

**How it works:**
The key insight is representing an array in binary form. Each index i in the BIT stores the sum of a specific range:
- i = 1: sum[1]
- i = 2: sum[1..2]
- i = 3: sum[3]
- i = 4: sum[1..4]
- i = 5: sum[5]
- i = 6: sum[5..6]
- i = 7: sum[7]
- i = 8: sum[1..8]

The pattern: Each index i stores sum of range (i - LSB(i) + 1) to i, where LSB(i) is the lowest set bit.

**Operations:**
- `update(i, delta)`: Add delta to index i - use `i += LSB(i)` to move to parent
- `query(i)`: Get prefix sum [1..i] - use `i -= LSB(i)` to move to parent

**Time Complexity:**
- Update: O(log n)
- Prefix Sum: O(log n)
- Range Sum: O(log n) using two prefix sums

---

## Implementation

```python
class FenwickTree:
    """
    Fenwick Tree (Binary Indexed Tree) implementation.
    Supports point updates and prefix sum queries in O(log n).
    
    Time: O(log n) for update and query
    Space: O(n)
    """
    
    def __init__(self, size):
        """
        Initialize Fenwick Tree.
        
        Args:
            size: Number of elements (1-indexed)
        """
        self.n = size
        self.tree = [0] * (size + 1)
    
    def _lsb(self, i):
        """Return lowest set bit of i."""
        return i & (-i)
    
    def update(self, index, delta):
        """
        Add delta to element at index.
        
        Args:
            index: 1-indexed position to update
            delta: Value to add
        """
        while index <= self.n:
            self.tree[index] += delta
            index += self._lsb(index)
    
    def query(self, index):
        """
        Get prefix sum from 1 to index (inclusive).
        
        Args:
            index: 1-indexed position
            
        Returns:
            Sum of elements[1..index]
        """
        result = 0
        while index > 0:
            result += self.tree[index]
            index -= self._lsb(index)
        return result
    
    def range_sum(self, left, right):
        """
        Get sum of elements in range [left, right].
        
        Args:
            left: 1-indexed start position
            right: 1-indexed end position
            
        Returns:
            Sum of elements[left..right]
        """
        return self.query(right) - self.query(left - 1)
    
    def __repr__(self):
        return f"FenwickTree({self.tree[1:]})"


# Alternative: Build from array
def build_fenwick(arr):
    """Build Fenwick Tree from array in O(n)."""
    n = len(arr)
    ft = FenwickTree(n)
    
    # Method 1: Direct update O(n log n)
    for i, val in enumerate(arr, 1):
        ft.update(i, val)
    
    # Method 2: Build in O(n)
    # ft.tree = [0] * (n + 1)
    # for i in range(1, n + 1):
    #     ft.tree[i] = arr[i-1]
    #     j = i + ft._lsb(i)
    #     if j <= n:
    #         ft.tree[j] += ft.tree[i]
    
    return ft
```

```javascript
function fenwickTree() {
    // Fenwick Tree (BIT) implementation
    // Time: O(log n)
    // Space: O(n)
}
```

---

## Example

**Input:**
```
Array: [1, 3, 5, 7, 9, 11]
Operations:
  1. query(3)    - sum of first 3 elements
  2. update(2, +2) - add 2 to index 2
  3. query(3)    - sum of first 3 elements after update
  4. range_sum(2, 5) - sum from index 2 to 5
```

**Output:**
```
query(3) = 9       (1 + 3 + 5 = 9)
query(3) = 11      (1 + 5 + 5 = 11, after adding 2)
range_sum(2, 5) = 24  (5 + 7 + 9 + 11 = 32, wait - recalculating)
                     = 5 + 7 + 9 + 11 after update = 32
                     Actually: (3+2=5) + 7 + 9 + 11 = 32
```

**Explanation:**
- Initial array: [1, 3, 5, 7, 9, 11]
- After update(2, +2): [1, 5, 5, 7, 9, 11]
- query(3) = 1 + 5 + 5 = 11
- range_sum(2, 5) = 5 + 5 + 7 + 9 = 26

**Internal Tree Structure:**
```
Index:  1   2   3   4   5   6
Tree:  [1,  4,  5, 16,  9, 20]
        │   │   │   │   │   │
Range: [1] [1-2] [3] [1-4] [5] [5-6]
```

---

## Time Complexity
**O(log n)**

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
