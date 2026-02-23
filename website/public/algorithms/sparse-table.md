# Sparse Table

## Category
Advanced

## Description
Data structure for O(1) range minimum queries (static array).

---

## When to Use
Use this algorithm when you need to solve problems involving:
- advanced related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation

A Sparse Table is a data structure used for Range Minimum Queries (RMQ) and Range Maximum Queries (RMQ) on static arrays. It provides O(1) query time after O(n log n) preprocessing, making it ideal for scenarios where:
- The array doesn't change (static)
- Many queries need to be answered
- Query time must be fast

### How it Works:
The key insight is that any interval can be covered by at most two precomputed intervals of powers of two.

### Preprocessing:
- table[i][j] = minimum value in subarray starting at index i with length 2^j
- Build using dynamic programming: table[i][j] = min(table[i][j-1], table[i + 2^{j-1}][j-1])

### Query:
- For range [L, R], find the largest power of 2 <= length
- Answer = min(table[L][k], table[R - 2^k + 1][k])
- This works because the two intervals may overlap but both contain the minimum

### Limitations:
- Only works for idempotent operations (min, max, gcd)
- Doesn't support updates (array must be static)
- Higher space complexity than segment tree

---

## Algorithm Steps

### Building the Table:
1. Determine log2 of array length
2. Initialize table[n][log_n + 1]
3. For j = 0: table[i][0] = arr[i] (intervals of length 1)
4. For j > 0: table[i][j] = min(table[i][j-1], table[i + 2^{j-1}][j-1])

### Querying:
1. Calculate k = floor(log2(right - left + 1))
2. Return min(table[left][k], table[right - 2^k + 1][k])

---

## Implementation

```python
import math

class SparseTable:
    """Sparse Table for Range Minimum/Maximum Queries on static arrays."""
    
    def __init__(self, arr: list, func=min):
        """
        Initialize the Sparse Table.
        
        Args:
            arr: Input array (static)
            func: Aggregation function (min or max)
            
        Time: O(n log n)
        Space: O(n log n)
        """
        self.n = len(arr)
        self.func = func
        
        # Calculate number of columns needed
        self.log_n = math.floor(math.log2(self.n)) + 1
        
        # Build sparse table
        # table[j][i] = answer for range [i, i + 2^j - 1]
        self.table = [[0] * self.n for _ in range(self.log_n)]
        
        # Base case: intervals of length 1
        for i in range(self.n):
            self.table[0][i] = arr[i]
        
        # Build table for larger intervals
        for j in range(1, self.log_n):
            for i in range(self.n - (1 << j) + 1):
                self.table[j][i] = self.func(
                    self.table[j-1][i],
                    self.table[j-1][i + (1 << (j-1))]
                )
    
    def query(self, left: int, right: int):
        """
        Query the minimum/maximum value in range [left, right].
        
        Args:
            left: Left index (inclusive)
            right: Right index (inclusive)
            
        Returns:
            Minimum/maximum value in the range
            
        Time: O(1)
        """
        if left < 0 or right >= self.n or left > right:
            raise ValueError("Invalid range")
        
        # Length of the range
        length = right - left + 1
        
        # Largest power of 2 <= length
        k = math.floor(math.log2(length))
        
        # Combine two intervals
        return self.func(
            self.table[k][left],
            self.table[k][right - (1 << k) + 1]
        )


class SparseTableMax(SparseTable):
    """Sparse Table for Range Maximum Queries."""
    def __init__(self, arr: list):
        super().__init__(arr, func=max)


# Example usage
if __name__ == "__main__":
    arr = [2, 5, 1, 8, 3, 9, 4, 6, 7]
    
    print(f"Array: {arr}")
    
    # Create min and max sparse tables
    st_min = SparseTable(arr, min)
    st_max = SparseTableMax(arr)
    
    # Query examples
    queries = [(0, 3), (2, 5), (1, 7), (4, 8)]
    
    print("\nQuery Results:")
    print(f"{'Range':<10} {'Min':<5} {'Max':<5}")
    print("-" * 20)
    for left, right in queries:
        min_val = st_min.query(left, right)
        max_val = st_max.query(left, right)
        print(f"[{left},{right}]:     {min_val:<5} {max_val:<5}")

```javascript
function sparseTable() {
    // Sparse Table implementation
    // Time: O(n log n) build, O(1) query
    // Space: O(n log n)
}
```

---

## Example

**Input:**
```python
arr = [2, 5, 1, 8, 3, 9, 4, 6, 7]
st_min = SparseTable(arr, min)
st_max = SparseTableMax(arr)
```

**Output:**
```
Array: [2, 5, 1, 8, 3, 9, 4, 6, 7]

Query Results:
Range     Min   Max   
--------------------
[0,3]:     2     8
[2,5]:     1     9
[1,7]:     1     9
[4,8]:     3     7
```

**Explanation:**
- For query [0,3]: elements are [2, 5, 1, 8], min=2, max=8
- For query [2,5]: elements are [1, 8, 3, 9], min=1, max=9
- For query [1,7]: elements are [5, 1, 8, 3, 9, 4, 6], min=1, max=9
- For query [4,8]: elements are [3, 9, 4, 6, 7], min=3, max=7

**Sparse Table Structure (showing powers of 2):**
```
j=0 (len=1):  [2, 5, 1, 8, 3, 9, 4, 6, 7]
j=1 (len=2):  [2, 1, 1, 3, 3, 4, 4, 6]
j=2 (len=4):  [1, 1, 3, 4, 4, 6]
j=3 (len=8):  [1, 3]
```

Query [2,5] (length 4, k=2):
- min(table[2][2], table[2][5-4+1]) = min(table[2][2], table[2][3]) = min(3, 4) = 1 ✓

---

## Time Complexity
**O(n log n) build, O(1) query**

---

## Space Complexity
**O(n log n)**

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
