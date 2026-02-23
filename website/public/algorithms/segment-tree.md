# Segment Tree

## Category
Advanced

## Description
Data structure for range queries and point updates.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- advanced related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation

A Segment Tree is a binary tree data structure that allows efficient range queries and point updates. It is particularly useful for problems involving:
- Range sum queries
- Range minimum/maximum queries
- Range add/multiply operations
- Point updates with range queries

### Why use Segment Tree?
- Array prefix sums only support range sum queries after O(n) preprocessing, and point updates are expensive
- Segment trees support both point updates and range queries in O(log n) time
- Build time is O(n), making it ideal for dynamic scenarios

### Structure:
- The tree is stored as an array where index 0 is the root
- For a node at index i:
  - Left child: 2*i + 1
  - Right child: 2*i + 2
  - Parent: (i - 1) // 2
- Each node stores the aggregated value for its segment (e.g., sum, min, max)
- The leaves represent individual array elements

### Operations:
1. **Build**: O(n) - Recursively build from bottom up
2. **Query**: O(log n) - Query range by combining relevant nodes
3. **Update**: O(log n) - Update single element and propagate changes

---

## Algorithm Steps

### Building the Tree:
1. If the segment has one element, it's a leaf - store the element
2. Otherwise, recursively build left and right children
3. Combine children values using the operation (sum, min, max)

### Querying a Range:
1. If the query range completely covers the node range, return node value
2. If no overlap, return identity value (0 for sum, inf for min, -inf for max)
3. If partial overlap, recursively query both children and combine

### Updating a Point:
1. If at leaf node, update the value
2. Otherwise, update the appropriate child and recombine

---

## Implementation

```python
class SegmentTree:
    """Segment Tree for range sum queries with point updates."""
    
    def __init__(self, arr: list):
        """
        Initialize the segment tree.
        
        Args:
            arr: Input array
            
        Time: O(n)
        Space: O(n)
        """
        self.n = len(arr)
        # Tree size is 4*n to handle all cases
        self.tree = [0] * (4 * self.n)
        if self.n > 0:
            self._build(arr, 0, 0, self.n - 1)
    
    def _build(self, arr: list, node: int, start: int, end: int):
        """Build the segment tree recursively."""
        if start == end:
            # Leaf node
            self.tree[node] = arr[start]
        else:
            mid = (start + end) // 2
            left_child = 2 * node + 1
            right_child = 2 * node + 2
            
            self._build(arr, left_child, start, mid)
            self._build(arr, right_child, mid + 1, end)
            
            # Combine children (sum operation)
            self.tree[node] = self.tree[left_child] + self.tree[right_child]
    
    def update(self, idx: int, value: int):
        """
        Update element at index idx to value.
        
        Args:
            idx: Index to update
            value: New value
            
        Time: O(log n)
        """
        self._update(0, 0, self.n - 1, idx, value)
    
    def _update(self, node: int, start: int, end: int, idx: int, value: int):
        """Update recursively."""
        if start == end:
            # Leaf node found
            self.tree[node] = value
        else:
            mid = (start + end) // 2
            left_child = 2 * node + 1
            right_child = 2 * node + 2
            
            if idx <= mid:
                self._update(left_child, start, mid, idx, value)
            else:
                self._update(right_child, mid + 1, end, idx, value)
            
            self.tree[node] = self.tree[left_child] + self.tree[right_child]
    
    def query(self, left: int, right: int) -> int:
        """
        Query sum in range [left, right].
        
        Args:
            left: Left index (inclusive)
            right: Right index (inclusive)
            
        Returns:
            Sum of elements in range [left, right]
            
        Time: O(log n)
        """
        return self._query(0, 0, self.n - 1, left, right)
    
    def _query(self, node: int, start: int, end: int, left: int, right: int) -> int:
        """Query recursively."""
        # No overlap
        if right < start or left > end:
            return 0  # Identity for sum
        
        # Complete overlap
        if left <= start and end <= right:
            return self.tree[node]
        
        # Partial overlap
        mid = (start + end) // 2
        left_child = 2 * node + 1
        right_child = 2 * node + 2
        
        left_sum = self._query(left_child, start, mid, left, right)
        right_sum = self._query(right_child, mid + 1, end, left, right)
        
        return left_sum + right_sum


# Example usage
if __name__ == "__main__":
    arr = [1, 3, 5, 7, 9, 11]
    st = SegmentTree(arr)
    
    print(f"Array: {arr}")
    print(f"Sum [0,2]: {st.query(0, 2)}")  # 1+3+5 = 9
    print(f"Sum [1,4]: {st.query(1, 4)}")  # 3+5+7+9 = 24
    print(f"Sum [0,5]: {st.query(0, 5)}")  # 1+3+5+7+9+11 = 36
    
    # Update index 2 from 5 to 10
    st.update(2, 10)
    print(f"After update [2]=10, Sum [0,2]: {st.query(0, 2)}")  # 1+3+10 = 14

```javascript
function segmentTree() {
    // Segment Tree implementation
    // Time: O(log n) for queries and updates
    // Space: O(n)
}
```

---

## Example

**Input:**
```python
arr = [1, 3, 5, 7, 9, 11]
st = SegmentTree(arr)
```

**Output:**
```
Array: [1, 3, 5, 7, 9, 11]
Sum [0,2]: 9
Sum [1,4]: 24
Sum [0,5]: 36
After update [2]=10, Sum [0,2]: 14
```

**Explanation:**
- Initial array: [1, 3, 5, 7, 9, 11]
- Query sum of indices [0,2]: 1 + 3 + 5 = 9
- Query sum of indices [1,4]: 3 + 5 + 7 + 9 = 24
- Query sum of entire array [0,5]: 1 + 3 + 5 + 7 + 9 + 11 = 36
- After updating index 2 from 5 to 10, query [0,2]: 1 + 3 + 10 = 14

**Segment Tree Structure for array [1, 3, 5, 7, 9, 11]:**
```
                    [36] (0-5)
                   /      \
              [9] (0-2)   [27] (3-5)
              /    \       /    \
          [4](0-1) [5](2) [16](3-4) [11](5)
          /  \          /  \
       [1] [3]       [7] [9]
```

---

## Time Complexity
**O(log n) for queries and updates**

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
