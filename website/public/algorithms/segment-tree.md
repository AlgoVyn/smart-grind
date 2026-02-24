# Segment Tree

## Category
Advanced

## Description

A Segment Tree is a binary tree data structure that enables efficient range queries and point updates on an array. It is particularly powerful for solving problems that require querying aggregates (sum, min, max, product, etc.) over subarrays while also supporting dynamic updates to individual elements.

---

## When to Use

Use the Segment Tree algorithm when you need to solve problems involving:

- **Range Queries**: Finding sum, minimum, maximum, or any associative operation over a subarray
- **Point Updates**: Modifying individual array elements while maintaining query capability
- **Mixed Operations**: Both queries and updates interleaved in the problem
- **Dynamic Data**: Array values that change during the problem execution
- **Offline Queries**: When you need to answer multiple range queries efficiently

### Comparison with Alternatives

| Data Structure | Build Time | Query Time | Update Time | Supports Dynamic Updates |
|----------------|------------|------------|-------------|--------------------------|
| **Prefix Sum** | O(n) | O(1) | O(n) | ❌ No |
| **Sparse Table** | O(n log n) | O(1) | O(n) | ❌ No |
| **Segment Tree** | O(n) | O(log n) | O(log n) | ✅ Yes |
| **Fenwick Tree** | O(n) | O(log n) | O(log n) | ✅ Yes (limited) |

---

## Algorithm Explanation

### Core Concept

A Segment Tree represents the array as a binary tree where:
- **Each leaf node** corresponds to a single array element
- **Each internal node** stores the aggregated value of its children (sum, min, max, etc.)
- The **root node** stores the aggregate of the entire array

### Tree Structure

For an array of size `n`:
- The tree is stored as an array of size `4*n` (safe upper bound)
- For a node at index `i`:
  - Left child: `2*i + 1`
  - Right child: `2*i + 2`
  - Parent: `(i - 1) // 2`
- The root is at index `0`

### Visual Representation

For array `[1, 3, 5, 7, 9, 11]`:

```python
                        [36] (0-5)                    ← Root: sum of all elements
                       /      \
               [9] (0-2)       [27] (3-5)             ← Internal nodes: partial sums
               /    \            /    \
          [4](0-1)  [5](2)  [16](3-4)  [11](5)      ← Node values represent range
          /  \                                    ← Each node covers a segment
       [1]   [3]                                 ← Leaves are individual elements
```

---

## Algorithm Steps

### 1. Building the Tree

```python
build(node, start, end):
    if start == end:
        // Leaf node - store the array element
        tree[node] = arr[start]
    else:
        mid = (start + end) // 2
        build(left_child, start, mid)
        build(right_child, mid + 1, end)
        tree[node] = tree[left_child] + tree[right_child]
```

### 2. Querying a Range

```python
query(node, start, end, left, right):
    // Case 1: No overlap - query range is outside node range
    if right < start or left > end:
        return 0  // Identity element (0 for sum, ∞ for min, -∞ for max)
    
    // Case 2: Complete overlap - node range is inside query range
    if left <= start and end <= right:
        return tree[node]
    
    // Case 3: Partial overlap - need to query children
    mid = (start + end) // 2
    left_result = query(left_child, start, mid, left, right)
    right_result = query(right_child, mid + 1, end, left, right)
    return left_result + right_result
```

### 3. Updating a Point

```python
update(node, start, end, idx, value):
    if start == end:
        // Leaf node - update the value
        tree[node] = value
    else:
        mid = (start + end) // 2
        if idx <= mid:
            update(left_child, start, mid, idx, value)
        else:
            update(right_child, mid + 1, end, idx, value)
        tree[node] = tree[left_child] + tree[right_child]
```

---

## Implementation

### Template Code (Range Sum)

````carousel
```python
class SegmentTree:
    """
    Segment Tree for range sum queries with point updates.
    
    Time Complexities:
        - Build: O(n)
        - Query: O(log n)
        - Update: O(log n)
    
    Space Complexity: O(n)
    """
    
    def __init__(self, arr: list):
        """
        Initialize the segment tree.
        
        Args:
            arr: Input array of numbers
            
        Time: O(n)
        Space: O(n)
        """
        self.n = len(arr)
        # Tree size is 4*n to handle all edge cases
        self.tree = [0] * (4 * self.n)
        if self.n > 0:
            self._build(arr, 0, 0, self.n - 1)
    
    def _build(self, arr: list, node: int, start: int, end: int):
        """Build the segment tree recursively."""
        if start == end:
            # Leaf node - store the element
            self.tree[node] = arr[start]
        else:
            mid = (start + end) // 2
            left_child = 2 * node + 1
            right_child = 2 * node + 2
            
            # Recursively build left and right subtrees
            self._build(arr, left_child, start, mid)
            self._build(arr, right_child, mid + 1, end)
            
            # Combine children results (sum operation)
            self.tree[node] = self.tree[left_child] + self.tree[right_child]
    
    def update(self, idx: int, value: int):
        """
        Update element at index idx to value.
        
        Args:
            idx: Index to update (0-based)
            value: New value
            
        Time: O(log n)
        """
        self._update(0, 0, self.n - 1, idx, value)
    
    def _update(self, node: int, start: int, end: int, idx: int, value: int):
        """Update value at index recursively."""
        if start == end:
            # Leaf node found - update value
            self.tree[node] = value
        else:
            mid = (start + end) // 2
            left_child = 2 * node + 1
            right_child = 2 * node + 2
            
            # Determine which child contains the index
            if idx <= mid:
                self._update(left_child, start, mid, idx, value)
            else:
                self._update(right_child, mid + 1, end, idx, value)
            
            # Recompute current node value
            self.tree[node] = self.tree[left_child] + self.tree[right_child]
    
    def query(self, left: int, right: int) -> int:
        """
        Query sum in range [left, right] (inclusive).
        
        Args:
            left: Left index (inclusive)
            right: Right index (inclusive)
            
        Returns:
            Sum of elements in range [left, right]
            
        Time: O(log n)
        """
        return self._query(0, 0, self.n - 1, left, right)
    
    def _query(self, node: int, start: int, end: int, left: int, right: int) -> int:
        """Query range sum recursively."""
        # Case 1: No overlap
        if right < start or left > end:
            return 0  # Identity for sum
        
        # Case 2: Complete overlap
        if left <= start and end <= right:
            return self.tree[node]
        
        # Case 3: Partial overlap
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
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
using namespace std;

class SegmentTree {
private:
    vector<int> tree;
    int n;
    
    // Build tree recursively
    void build(const vector<int>& arr, int node, int start, int end) {
        if (start == end) {
            // Leaf node
            tree[node] = arr[start];
        } else {
            int mid = (start + end) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;
            
            build(arr, leftChild, start, mid);
            build(arr, rightChild, mid + 1, end);
            
            // Combine children (sum operation)
            tree[node] = tree[leftChild] + tree[rightChild];
        }
    }
    
    // Update value at index recursively
    void update(int node, int start, int end, int idx, int value) {
        if (start == end) {
            // Leaf node found
            tree[node] = value;
        } else {
            int mid = (start + end) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;
            
            if (idx <= mid)
                update(leftChild, start, mid, idx, value);
            else
                update(rightChild, mid + 1, end, idx, value);
            
            tree[node] = tree[leftChild] + tree[rightChild];
        }
    }
    
    // Query range sum recursively
    int query(int node, int start, int end, int left, int right) {
        // No overlap
        if (right < start || left > end)
            return 0;
        
        // Complete overlap
        if (left <= start && end <= right)
            return tree[node];
        
        // Partial overlap
        int mid = (start + end) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;
        
        int leftSum = query(leftChild, start, mid, left, right);
        int rightSum = query(rightChild, mid + 1, end, left, right);
        
        return leftSum + rightSum;
    }
    
public:
    SegmentTree(const vector<int>& arr) {
        n = arr.size();
        tree.assign(4 * n, 0);
        if (n > 0)
            build(arr, 0, 0, n - 1);
    }
    
    // Update element at index to value
    void update(int idx, int value) {
        update(0, 0, n - 1, idx, value);
    }
    
    // Query sum in range [left, right]
    int query(int left, int right) {
        return query(0, 0, n - 1, left, right);
    }
};


int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11};
    SegmentTree st(arr);
    
    cout << "Array: ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    
    cout << "Sum [0,2]: " << st.query(0, 2) << endl;  // 9
    cout << "Sum [1,4]: " << st.query(1, 4) << endl;  // 24
    cout << "Sum [0,5]: " << st.query(0, 5) << endl;  // 36
    
    st.update(2, 10);
    cout << "After update [2]=10, Sum [0,2]: " << st.query(0, 2) << endl;  // 14
    
    return 0;
}
```

<!-- slide -->
```java
public class SegmentTree {
    private int[] tree;
    private int n;
    
    /**
     * Segment Tree for range sum queries with point updates.
     * 
     * Time Complexities:
     *     - Build: O(n)
     *     - Query: O(log n)
     *     - Update: O(log n)
     * 
     * Space Complexity: O(n)
     */
    
    public SegmentTree(int[] arr) {
        n = arr.length;
        tree = new int[4 * n];
        if (n > 0) {
            build(arr, 0, 0, n - 1);
        }
    }
    
    private void build(int[] arr, int node, int start, int end) {
        if (start == end) {
            // Leaf node
            tree[node] = arr[start];
        } else {
            int mid = (start + end) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;
            
            build(arr, leftChild, start, mid);
            build(arr, rightChild, mid + 1, end);
            
            // Combine children (sum operation)
            tree[node] = tree[leftChild] + tree[rightChild];
        }
    }
    
    /**
     * Update element at index to value.
     * 
     * @param idx Index to update (0-based)
     * @param value New value
     */
    public void update(int idx, int value) {
        update(0, 0, n - 1, idx, value);
    }
    
    private void update(int node, int start, int end, int idx, int value) {
        if (start == end) {
            // Leaf node found
            tree[node] = value;
        } else {
            int mid = (start + end) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;
            
            if (idx <= mid) {
                update(leftChild, start, mid, idx, value);
            } else {
                update(rightChild, mid + 1, end, idx, value);
            }
            
            tree[node] = tree[leftChild] + tree[rightChild];
        }
    }
    
    /**
     * Query sum in range [left, right] (inclusive).
     * 
     * @param left Left index (inclusive)
     * @param right Right index (inclusive)
     * @return Sum of elements in range
     */
    public int query(int left, int right) {
        return query(0, 0, n - 1, left, right);
    }
    
    private int query(int node, int start, int end, int left, int right) {
        // No overlap
        if (right < start || left > end) {
            return 0;
        }
        
        // Complete overlap
        if (left <= start && end <= right) {
            return tree[node];
        }
        
        // Partial overlap
        int mid = (start + end) / 2;
        int leftChild = 2 * node + 1;
        int rightChild = 2 * node + 2;
        
        int leftSum = query(leftChild, start, mid, left, right);
        int rightSum = query(rightChild, mid + 1, end, left, right);
        
        return leftSum + rightSum;
    }
    
    
    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9, 11};
        SegmentTree st = new SegmentTree(arr);
        
        System.out.println("Array: [1, 3, 5, 7, 9, 11]");
        System.out.println("Sum [0,2]: " + st.query(0, 2));  // 9
        System.out.println("Sum [1,4]: " + st.query(1, 4));  // 24
        System.out.println("Sum [0,5]: " + st.query(0, 5));  // 36
        
        st.update(2, 10);
        System.out.println("After update [2]=10, Sum [0,2]: " + st.query(0, 2));  // 14
    }
}
```

<!-- slide -->
```javascript
class SegmentTree {
    /**
     * Segment Tree for range sum queries with point updates.
     * 
     * Time Complexities:
     *     - Build: O(n)
     *     - Query: O(log n)
     *     - Update: O(log n)
     * 
     * Space Complexity: O(n)
     */
    
    constructor(arr) {
        this.n = arr.length;
        this.tree = new Array(4 * this.n).fill(0);
        if (this.n > 0) {
            this._build(arr, 0, 0, this.n - 1);
        }
    }
    
    _build(arr, node, start, end) {
        if (start === end) {
            // Leaf node
            this.tree[node] = arr[start];
        } else {
            const mid = Math.floor((start + end) / 2);
            const leftChild = 2 * node + 1;
            const rightChild = 2 * node + 2;
            
            this._build(arr, leftChild, start, mid);
            this._build(arr, rightChild, mid + 1, end);
            
            // Combine children (sum operation)
            this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
        }
    }
    
    /**
     * Update element at index to value.
     * @param {number} idx - Index to update (0-based)
     * @param {number} value - New value
     */
    update(idx, value) {
        this._update(0, 0, this.n - 1, idx, value);
    }
    
    _update(node, start, end, idx, value) {
        if (start === end) {
            // Leaf node found
            this.tree[node] = value;
        } else {
            const mid = Math.floor((start + end) / 2);
            const leftChild = 2 * node + 1;
            const rightChild = 2 * node + 2;
            
            if (idx <= mid) {
                this._update(leftChild, start, mid, idx, value);
            } else {
                this._update(rightChild, mid + 1, end, idx, value);
            }
            
            this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
        }
    }
    
    /**
     * Query sum in range [left, right] (inclusive).
     * @param {number} left - Left index (inclusive)
     * @param {number} right - Right index (inclusive)
     * @returns {number} Sum of elements in range
     */
    query(left, right) {
        return this._query(0, 0, this.n - 1, left, right);
    }
    
    _query(node, start, end, left, right) {
        // No overlap
        if (right < start || left > end) {
            return 0;
        }
        
        // Complete overlap
        if (left <= start && end <= right) {
            return this.tree[node];
        }
        
        // Partial overlap
        const mid = Math.floor((start + end) / 2);
        const leftChild = 2 * node + 1;
        const rightChild = 2 * node + 2;
        
        const leftSum = this._query(leftChild, start, mid, left, right);
        const rightSum = this._query(rightChild, mid + 1, end, left, right);
        
        return leftSum + rightSum;
    }
}


// Example usage
const arr = [1, 3, 5, 7, 9, 11];
const st = new SegmentTree(arr);

console.log(`Array: [${arr.join(', ')}]`);
console.log(`Sum [0,2]: ${st.query(0, 2)}`);  // 9
console.log(`Sum [1,4]: ${st.query(1, 4)}`);  // 24
console.log(`Sum [0,5]: ${st.query(0, 5)}`);  // 36

st.update(2, 10);
console.log(`After update [2]=10, Sum [0,2]: ${st.query(0, 2)}`);  // 14
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Build** | O(n) | Each node is visited once during construction |
| **Query** | O(log n) | At most 4 nodes are visited per level, and there are log(n) levels |
| **Update** | O(log n) | Need to update from leaf to root, traversing log(n) levels |
| **Range Update** | O(log n) per element | If updating multiple elements, multiply by number of elements |

### Space Complexity

- **Tree Storage**: O(n) - Requires 4*n space for the tree array
- **Recursion Stack**: O(log n) - Maximum depth of recursion

---

## Common Variations

### 1. Range Minimum Query (RMQ)

Change the combine operation from sum to min:

```python
tree[node] = min(tree[left_child], tree[right_child])
# Identity value: float('inf')
```

### 2. Range Maximum Query

Change the combine operation to max:

```python
tree[node] = max(tree[left_child], tree[right_child])
# Identity value: float('-inf')
```

### 3. Range Multiplication

```python
tree[node] = tree[left_child] * tree[right_child]
# Identity value: 1
```

### 4. Lazy Propagation

For range updates (adding a value to all elements in a range), use lazy propagation:

````carousel
```python
class SegmentTreeLazy:
    """Segment Tree with Lazy Propagation for range updates."""
    
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        if self.n > 0:
            self._build(arr, 0, 0, self.n - 1)
    
    def _build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
        else:
            mid = (start + end) // 2
            self._build(arr, 2*node+1, start, mid)
            self._build(arr, 2*node+2, mid+1, end)
            self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]
    
    def range_update(self, left, right, value):
        """Add value to all elements in range [left, right]."""
        self._range_update(0, 0, self.n-1, left, right, value)
    
    def _range_update(self, node, start, end, left, right, value):
        # Check for lazy value
        if self.lazy[node] != 0:
            self.tree[node] += (end - start + 1) * self.lazy[node]
            if start != end:
                self.lazy[2*node+1] += self.lazy[node]
                self.lazy[2*node+2] += self.lazy[node]
            self.lazy[node] = 0
        
        # No overlap
        if right < start or left > end:
            return
        
        # Complete overlap
        if left <= start and end <= right:
            self.tree[node] += (end - start + 1) * value
            if start != end:
                self.lazy[2*node+1] += value
                self.lazy[2*node+2] += value
            return
        
        # Partial overlap
        mid = (start + end) // 2
        self._range_update(2*node+1, start, mid, left, right, value)
        self._range_update(2*node+2, mid+1, end, left, right, value)
        self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]
    
    def range_query(self, left, right):
        """Query sum in range [left, right]."""
        return self._range_query(0, 0, self.n-1, left, right)
    
    def _range_query(self, node, start, end, left, right):
        # Check for lazy value
        if self.lazy[node] != 0:
            self.tree[node] += (end - start + 1) * self.lazy[node]
            if start != end:
                self.lazy[2*node+1] += self.lazy[node]
                self.lazy[2*node+2] += self.lazy[node]
            self.lazy[node] = 0
        
        # No overlap
        if right < start or left > end:
            return 0
        
        # Complete overlap
        if left <= start and end <= right:
            return self.tree[node]
        
        # Partial overlap
        mid = (start + end) // 2
        return (self._range_query(2*node+1, start, mid, left, right) +
                self._range_query(2*node+2, mid+1, end, left, right))
```

<!-- slide -->
```cpp
class SegmentTreeLazy {
private:
    vector<int> tree, lazy;
    int n;
    
    void build(const vector<int>& arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
        } else {
            int mid = (start + end) / 2;
            build(arr, 2*node+1, start, mid);
            build(arr, 2*node+2, mid+1, end);
            tree[node] = tree[2*node+1] + tree[2*node+2];
        }
    }
    
    void propagate(int node, int start, int end) {
        if (lazy[node] != 0) {
            tree[node] += (end - start + 1) * lazy[node];
            if (start != end) {
                lazy[2*node+1] += lazy[node];
                lazy[2*node+2] += lazy[node];
            }
            lazy[node] = 0;
        }
    }
    
    void rangeUpdate(int node, int start, int end, int left, int right, int value) {
        propagate(node, start, end);
        
        if (right < start || left > end) return;
        
        if (left <= start && end <= right) {
            tree[node] += (end - start + 1) * value;
            if (start != end) {
                lazy[2*node+1] += value;
                lazy[2*node+2] += value;
            }
            return;
        }
        
        int mid = (start + end) / 2;
        rangeUpdate(2*node+1, start, mid, left, right, value);
        rangeUpdate(2*node+2, mid+1, end, left, right, value);
        tree[node] = tree[2*node+1] + tree[2*node+2];
    }
    
    int rangeQuery(int node, int start, int end, int left, int right) {
        propagate(node, start, end);
        
        if (right < start || left > end) return 0;
        
        if (left <= start && end <= right) return tree[node];
        
        int mid = (start + end) / 2;
        return rangeQuery(2*node+1, start, mid, left, right) +
               rangeQuery(2*node+2, mid+1, end, left, right);
    }
    
public:
    SegmentTreeLazy(const vector<int>& arr) {
        n = arr.size();
        tree.assign(4*n, 0);
        lazy.assign(4*n, 0);
        if (n > 0) build(arr, 0, 0, n-1);
    }
    
    void rangeUpdate(int left, int right, int value) {
        rangeUpdate(0, 0, n-1, left, right, value);
    }
    
    int rangeQuery(int left, int right) {
        return rangeQuery(0, 0, n-1, left, right);
    }
};
```

<!-- slide -->
```java
public class SegmentTreeLazy {
    private int[] tree;
    private int[] lazy;
    private int n;
    
    public SegmentTreeLazy(int[] arr) {
        n = arr.length;
        tree = new int[4 * n];
        lazy = new int[4 * n];
        if (n > 0) build(arr, 0, 0, n - 1);
    }
    
    private void build(int[] arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
        } else {
            int mid = (start + end) / 2;
            build(arr, 2*node+1, start, mid);
            build(arr, 2*node+2, mid+1, end);
            tree[node] = tree[2*node+1] + tree[2*node+2];
        }
    }
    
    private void propagate(int node, int start, int end) {
        if (lazy[node] != 0) {
            tree[node] += (end - start + 1) * lazy[node];
            if (start != end) {
                lazy[2*node+1] += lazy[node];
                lazy[2*node+2] += lazy[node];
            }
            lazy[node] = 0;
        }
    }
    
    public void rangeUpdate(int left, int right, int value) {
        rangeUpdate(0, 0, n-1, left, right, value);
    }
    
    private void rangeUpdate(int node, int start, int end, int left, int right, int value) {
        propagate(node, start, end);
        
        if (right < start || left > end) return;
        
        if (left <= start && end <= right) {
            tree[node] += (end - start + 1) * value;
            if (start != end) {
                lazy[2*node+1] += value;
                lazy[2*node+2] += value;
            }
            return;
        }
        
        int mid = (start + end) / 2;
        rangeUpdate(2*node+1, start, mid, left, right, value);
        rangeUpdate(2*node+2, mid+1, end, left, right, value);
        tree[node] = tree[2*node+1] + tree[2*node+2];
    }
    
    public int rangeQuery(int left, int right) {
        return rangeQuery(0, 0, n-1, left, right);
    }
    
    private int rangeQuery(int node, int start, int end, int left, int right) {
        propagate(node, start, end);
        
        if (right < start || left > end) return 0;
        
        if (left <= start && end <= right) return tree[node];
        
        int mid = (start + end) / 2;
        return rangeQuery(2*node+1, start, mid, left, right) +
               rangeQuery(2*node+2, mid+1, end, left, right);
    }
}
```

<!-- slide -->
```javascript
class SegmentTreeLazy {
    constructor(arr) {
        this.n = arr.length;
        this.tree = new Array(4 * this.n).fill(0);
        this.lazy = new Array(4 * this.n).fill(0);
        if (this.n > 0) {
            this._build(arr, 0, 0, this.n - 1);
        }
    }
    
    _build(arr, node, start, end) {
        if (start === end) {
            this.tree[node] = arr[start];
        } else {
            const mid = Math.floor((start + end) / 2);
            this._build(arr, 2*node+1, start, mid);
            this._build(arr, 2*node+2, mid+1, end);
            this.tree[node] = this.tree[2*node+1] + this.tree[2*node+2];
        }
    }
    
    _propagate(node, start, end) {
        if (this.lazy[node] !== 0) {
            this.tree[node] += (end - start + 1) * this.lazy[node];
            if (start !== end) {
                this.lazy[2*node+1] += this.lazy[node];
                this.lazy[2*node+2] += this.lazy[node];
            }
            this.lazy[node] = 0;
        }
    }
    
    rangeUpdate(left, right, value) {
        this._rangeUpdate(0, 0, this.n - 1, left, right, value);
    }
    
    _rangeUpdate(node, start, end, left, right, value) {
        this._propagate(node, start, end);
        
        if (right < start || left > end) return;
        
        if (left <= start && end <= right) {
            this.tree[node] += (end - start + 1) * value;
            if (start !== end) {
                this.lazy[2*node+1] += value;
                this.lazy[2*node+2] += value;
            }
            return;
        }
        
        const mid = Math.floor((start + end) / 2);
        this._rangeUpdate(2*node+1, start, mid, left, right, value);
        this._rangeUpdate(2*node+2, mid+1, end, left, right, value);
        this.tree[node] = this.tree[2*node+1] + this.tree[2*node+2];
    }
    
    rangeQuery(left, right) {
        return this._rangeQuery(0, 0, this.n - 1, left, right);
    }
    
    _rangeQuery(node, start, end, left, right) {
        this._propagate(node, start, end);
        
        if (right < start || left > end) return 0;
        
        if (left <= start && end <= right) return this.tree[node];
        
        const mid = Math.floor((start + end) / 2);
        return this._rangeQuery(2*node+1, start, mid, left, right) +
               this._rangeQuery(2*node+2, mid+1, end, left, right);
    }
}
```
````

### 5. Iterative Segment Tree

For better performance in some languages:

```python
class SegmentTreeIterative:
    """Iterative Segment Tree for better performance."""
    
    def __init__(self, arr):
        self.n = len(arr)
        self.size = 1
        while self.size < self.n:
            self.size <<= 1
        self.tree = [0] * (2 * self.size)
        
        # Build tree
        for i in range(self.n):
            self.tree[self.size + i] = arr[i]
        for i in range(self.size - 1, 0, -1):
            self.tree[i] = self.tree[2*i] + self.tree[2*i+1]
    
    def update(self, idx, value):
        idx += self.size
        self.tree[idx] = value
        idx >>= 1
        while idx:
            self.tree[idx] = self.tree[2*idx] + self.tree[2*idx+1]
            idx >>= 1
    
    def query(self, left, right):
        left += self.size
        right += self.size
        result = 0
        while left <= right:
            if left & 1:
                result += self.tree[left]
                left += 1
            if not right & 1:
                result += self.tree[right]
                right -= 1
            left >>= 1
            right >>= 1
        return result
```

---

## Practice Problems

### Problem 1: Range Sum Query - Mutable

**Problem:** [LeetCode 307](https://leetcode.com/problems/range-sum-query-mutable/)

**Description:** Given an integer array `nums`, find the sum of the elements between indices `left` and `right` inclusive, where `left <= right`. Additionally, implement `update(index, val)` to modify `nums[index]` to a new value.

**How to Apply Segment Tree:**
- Build a segment tree on the input array
- Use `query(left, right)` for range sum queries
- Use `update(index, value)` for point updates
- Both operations run in O(log n) time

---

### Problem 2: Count of Range Sum

**Problem:** [LeetCode 327](https://leetcode.com/problems/count-of-range-sum/)

**Description:** Given an array `nums` and integers `lower` and `upper`, return the number of range sums that lie in `[lower, upper]`.

**How to Apply Segment Tree:**
- Use prefix sums and coordinate compression
- Build a segment tree over the compressed coordinates
- For each prefix sum, query how many previous sums fall in the valid range
- This is a classic application of segment tree for counting problems

---

### Problem 3: My Calendar I

**Problem:** [LeetCode 729](https://leetcode.com/problems/my-calendar-i/)

**Description:** Implement a `MyCalendar` class to store events as `[start, end)` intervals and check if a new event can be added without conflicts.

**How to Apply Segment Tree:**
- Use a segment tree over the time range
- Each node stores whether its segment is fully booked
- Query and update operations detect overlaps in O(log N) time

---

### Problem 4: Merge Intervals

**Problem:** [LeetCode 56](https://leetcode.com/problems/merge-intervals/)

**Description:** Given a collection of intervals, merge all overlapping intervals.

**How to Apply Segment Tree:**
- Sort intervals by start time
- Use a segment tree or ordered map to track maximum end time
- Merge intervals where current start <= previous max end

---

### Problem 5: Range Frequency Queries

**Problem:** [LeetCode 2080](https://leetcode.com/problems/range-frequency-queries/)

**Description:** Design a data structure that efficiently answers frequency queries for element values within a given range `[left, right]`.

**How to Apply Segment Tree:**
- Build segment tree where each node stores a hash map of value frequencies
- Query combines maps from relevant nodes
- Supports both point updates and range frequency queries

---

## Video Tutorial Links

### Fundamentals

- [Segment Tree - Introduction (Take U Forward)](https://www.youtube.com/watch?v=2F4r0N2u4vU) - Comprehensive introduction to segment trees
- [Segment Tree Build & Query (WilliamFiset)](https://www.youtube.com/watch?v=zb72gK9jGNY) - Detailed explanation with visualizations
- [Segment Tree Implementation (NeetCode)](https://www.youtube.com/watch?v=2W2y2X8X7Qw) - Practical implementation guide

### Advanced Topics

- [Lazy Propagation (Take U Forward)](https://www.youtube.com/watch?v=xuoQq4f3-Js) - Range updates with lazy propagation
- [Segment Tree Practice Problems (NeetCode)](https://www.youtube.com/watch?v=3aVPh70xT3M) - Problem-solving strategies
- [Advanced Segment Tree Techniques](https://www.youtube.com/watch?v=2p2WxxT6r6w) - Complex variations

### Comparison with Alternatives

- [Segment Tree vs Fenwick Tree](https://www.youtube.com/watch?v=v0dJ4x4Y4cM) - When to use which data structure

---

## Follow-up Questions

### Q1: What is the difference between Segment Tree and Fenwick Tree?

**Answer:** Both support point updates and range queries in O(log n) time. However:
- **Segment Tree**: More flexible, can handle any associative operation (min, max, sum, product), easier to extend for range updates with lazy propagation
- **Fenwick Tree**: More memory efficient (O(n) vs O(4n)), slightly simpler implementation, but limited to prefix sums and similar operations

### Q2: Can Segment Tree handle non-commutative operations?

**Answer:** Yes, but you need to maintain both directions. For non-commutative operations like matrix multiplication or string concatenation, store both left-to-right and right-to-left values at each node.

### Q3: What is the maximum size of array that segment tree can handle?

**Answer:** With O(n) space and O(log n) operations, segment trees can handle arrays up to ~10^6 elements easily in most languages. For larger datasets, consider using external memory or distributed segment trees.

### Q4: How do you handle overflow in segment tree?

**Answer:** Use appropriate data types (long long in C++, BigInt in JavaScript, long in Java) and modular arithmetic when needed. For multiplication operations, be especially careful with overflow.

### Q5: Can segment tree be used for 2D range queries?

**Answer:** Yes, you can create a 2D segment tree (segment tree of segment trees) or use a quad tree. This increases time complexity to O(log² n) but enables matrix range queries.

---

## Summary

The Segment Tree is a powerful data structure for:
- **Efficient range queries** in O(log n) time
- **Dynamic updates** with O(log n) complexity
- **Flexible operations** - supports any associative operation
- **Advanced variations** - lazy propagation, 2D trees, persistent segment trees

Key takeaways:
- Build once in O(n), then query/update in O(log n)
- Use lazy propagation for range updates
- Choose between segment tree (flexible) and Fenwick tree (efficient) based on requirements
- Practice the template until it becomes second nature

This data structure is essential for competitive programming and technical interviews at major tech companies.
