## Segment Tree (Range Queries)

**Question:** How does a Segment Tree support range queries and updates in O(log n) time?

<!-- front -->

---

## Answer: Binary Tree for Ranges

### Structure
A segment tree is a binary tree where each node represents a range.

```
Array: [1, 3, 5, 7, 9, 11]
Tree:        [1,11]
            /     \
         [1,5]    [6,11]
         /   \     /   \
       [1,3] [4,5] [6,8] [9,11]
        / \   / \   / \   /  \
       [1,2][3][4][5][6][7] [8][9] [10,11]
```

### Implementation
```python
class SegmentTree:
    def __init__(self, nums):
        self.n = len(nums)
        self.tree = [0] * (4 * self.n)
        self.build(nums, 0, 0, self.n - 1)
    
    def build(self, nums, node, start, end):
        if start == end:
            self.tree[node] = nums[start]
        else:
            mid = (start + end) // 2
            self.build(nums, 2*node+1, start, mid)
            self.build(nums, 2*node+2, mid+1, end)
            self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]
    
    def query(self, node, start, end, left, right):
        if right < start or end < left:
            return 0
        if left <= start and end <= right:
            return self.tree[node]
        mid = (start + end) // 2
        return (self.query(2*node+1, start, mid, left, right) +
                self.query(2*node+2, mid+1, end, left, right))
```

### Complexity
- **Build:** O(n)
- **Query:** O(log n)
- **Update:** O(log n)

### Use Cases
- Range sum/min/max
- Range add/multiply
- Count of numbers in range

### ⚠️ Trade-offs
| Structure | Build | Query | Update | Space |
|-----------|-------|-------|--------|-------|
| Segment Tree | O(n) | O(log n) | O(log n) | O(n) |
| Fenwick Tree | O(n) | O(log n) | O(log n) | O(n) |
| Prefix Sum | O(n) | O(1) | O(n) | O(n) |

<!-- back -->
