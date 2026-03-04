# Fenwick Tree (Binary Indexed Tree)

## Category
Advanced

## Description

A Fenwick Tree (also known as Binary Indexed Tree or BIT) is a data structure that efficiently maintains prefix sums and supports point updates. It provides **O(log n)** time complexity for both point updates and prefix sum queries, using **O(n)** space. Unlike Segment Trees, Fenwick Trees are simpler to implement and use less memory while achieving the same asymptotic complexity for these operations.

---

## When to Use

Use the Fenwick Tree when you need to solve problems involving:

- **Dynamic Prefix Sums**: When you need to compute prefix sums with frequent updates
- **Point Updates**: When individual array elements change (not range updates)
- **Range Sum Queries**: When you need sum of any subarray [l, r]
- **Frequency Counting**: Counting elements, inversions, or frequencies in ranges
- **Coordinate Compression Scenarios**: When values are large but queries are on compressed indices

### Comparison with Alternatives

| Data Structure | Build Time | Point Update | Range Query | Space | Supports Dynamic Updates |
|----------------|------------|--------------|-------------|-------|--------------------------|
| **Prefix Sum** | O(n) | O(n) | O(1) | O(n) | ❌ No |
| **Fenwick Tree** | O(n log n) or O(n) | O(log n) | O(log n) | O(n) | ✅ Yes |
| **Segment Tree** | O(n) | O(log n) | O(log n) | O(4n) | ✅ Yes |
| **Sparse Table** | O(n log n) | O(n log n) | O(1) | O(n log n) | ❌ No |

### When to Choose Fenwick Tree vs Segment Tree

- **Choose Fenwick Tree** when:
  - You need prefix sums or point updates
  - Memory is constrained (uses ~4× less memory than segment tree)
  - You want simpler code
  - Operations are associative and have inverses (sum, XOR, etc.)

- **Choose Segment Tree** when:
  - You need range updates (lazy propagation)
  - You need operations without inverses (min, max, GCD)
  - You need more complex query types
  - Memory is not a constraint

---

## Algorithm Explanation

### Core Concept

The Fenwick Tree uses a clever binary representation to store partial sums. Each index `i` in the tree stores the sum of a specific range of elements from the original array. The key insight is using the **lowest set bit (LSB)** of an index to determine which range it represents.

**How It Works:**

For an index `i`, let `lsb(i) = i & (-i)` (the lowest set bit):
- Index `i` stores the sum of range `[i - lsb(i) + 1, i]`

For example with array `[1, 3, 5, 7, 9, 11]`:
```
Index:  1    2     3    4      5    6
Tree:   1    4     5   16      9   20
        │    │     │    │      │    │
Range: [1] [1-2]  [3] [1-4]   [5] [5-6]
        
Binary: 001  010   011  100   101  110
lsb:     1    2     1    4     1    2
```

### Operations

#### 1. Update Operation (Point Update)

To add `delta` to index `i`:
```
while i <= n:
    tree[i] += delta
    i += lsb(i)  # Move to parent (next responsible index)
```

**Why `i += lsb(i)`?**
- This moves to the next index that is responsible for index `i`
- All these indices contain ranges that include position `i`

#### 2. Query Operation (Prefix Sum)

To get sum of elements `[1..i]`:
```
result = 0
while i > 0:
    result += tree[i]
    i -= lsb(i)  # Move to previous segment
```

**Why `i -= lsb(i)`?**
- This removes the lowest set bit, effectively moving to the start of the current range
- Each step adds the precomputed sum for a segment

#### 3. Range Sum Query

To get sum of elements `[l..r]`:
```
sum(l, r) = prefix_sum(r) - prefix_sum(l - 1)
```

### Visual Representation

For array `[3, 2, -1, 6, 5, 4, -3, 3, 7, 2, 3]`:

```
Original Array (1-indexed):
Index:  1   2   3   4   5   6   7   8   9  10  11
Value:  3   2  -1   6   5   4  -3   3   7   2   3

Fenwick Tree Structure:
Index:  1   2    3    4     5   6    7    8      9   10   11
Tree:   3   5   -1   10     5   9   -3   19      7    9    3
        │   │    │    │     │   │    │    │      │    │    │
Range: [1] [1-2][3] [1-4] [5][5-6][7][1-8]  [9] [9-10][11]
```

**Query Example: prefix_sum(6)**
```
Start: i = 6 (binary: 110)
Step 1: Add tree[6] = 9, i = 6 - 2 = 4
Step 2: Add tree[4] = 10, i = 4 - 4 = 0
Result: 9 + 10 = 19 ✓ (3+2-1+6+5+4 = 19)
```

### Why It Works

The Fenwick Tree leverages the binary representation of indices:
- Each index `i` is responsible for exactly `lsb(i)` elements
- When updating, we propagate up to all ancestors that include this position
- When querying, we decompose the prefix into O(log n) non-overlapping ranges
- The number of set bits in binary representation determines the complexity

### Limitations

- **Only works for invertible operations**: sum, XOR (NOT min, max, GCD)
- **1-indexed internally**: Requires careful handling of 0-based arrays
- **Point updates only**: Range updates require lazy propagation or difference arrays
- **Not suitable for all operations**: Operations must satisfy: `query(l,r) = query(r) - query(l-1)`

---

## Algorithm Steps

### Building the Fenwick Tree

**Method 1: O(n log n) - Individual Updates**
1. Initialize tree array with zeros
2. For each element in the input array:
   - Call `update(i, arr[i])`

**Method 2: O(n) - Direct Construction**
1. Copy array into tree (tree[i] = arr[i])
2. For each index `i` from 1 to n:
   - Add tree[i] to tree[i + lsb(i)] if within bounds

### Point Update

1. Start at index `i`
2. While `i <= n`:
   - Add delta to tree[i]
   - Move to parent: `i += lsb(i)`

### Prefix Sum Query

1. Initialize result = 0
2. While `i > 0`:
   - Add tree[i] to result
   - Move to previous: `i -= lsb(i)`
3. Return result

### Range Sum Query

1. Compute `prefix_sum(right)`
2. Compute `prefix_sum(left - 1)`
3. Return their difference

---

## Implementation

### Standard Fenwick Tree (Range Sum)

````carousel
```python
class FenwickTree:
    """
    Fenwick Tree (Binary Indexed Tree) for range sum queries and point updates.
    
    Time Complexities:
        - Update: O(log n)
        - Query: O(log n)
        - Build: O(n log n) or O(n)
    
    Space Complexity: O(n)
    """
    
    def __init__(self, size):
        """
        Initialize Fenwick Tree.
        
        Args:
            size: Number of elements (1-indexed internally)
        """
        self.n = size
        self.tree = [0] * (size + 1)
    
    @staticmethod
    def _lsb(i):
        """Return lowest set bit of i using two's complement."""
        return i & (-i)
    
    def update(self, index, delta):
        """
        Add delta to element at index.
        
        Args:
            index: 1-indexed position to update
            delta: Value to add
            
        Time: O(log n)
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
            
        Time: O(log n)
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
            
        Time: O(log n)
        """
        return self.query(right) - self.query(left - 1)
    
    def __repr__(self):
        return f"FenwickTree({self.tree[1:]})"


# Build from array - O(n log n)
def build_fenwick_from_updates(arr):
    """Build Fenwick Tree using individual updates."""
    n = len(arr)
    ft = FenwickTree(n)
    for i, val in enumerate(arr, 1):
        ft.update(i, val)
    return ft


# Build from array - O(n)
def build_fenwick_linear(arr):
    """Build Fenwick Tree in linear time."""
    n = len(arr)
    tree = [0] * (n + 1)
    
    # Copy array values
    for i in range(1, n + 1):
        tree[i] = arr[i - 1]
    
    # Build tree by propagating to parents
    for i in range(1, n + 1):
        j = i + (i & -i)  # Parent index
        if j <= n:
            tree[j] += tree[i]
    
    ft = FenwickTree(n)
    ft.tree = tree
    return ft


# Example usage
if __name__ == "__main__":
    arr = [3, 2, -1, 6, 5, 4, -3, 3, 7, 2, 3]
    print(f"Array: {arr}")
    print(f"Array length: {len(arr)}")
    
    # Build Fenwick Tree
    ft = build_fenwick_linear(arr)
    print(f"\nFenwick Tree: {ft}")
    
    # Query examples
    print("\nQuery Results:")
    print(f"{'Query':<20} {'Result':<10} {'Verification'}")
    print("-" * 60)
    
    queries = [
        ("prefix_sum(6)", ft.query(6), sum(arr[:6])),
        ("prefix_sum(11)", ft.query(11), sum(arr)),
        ("range_sum(3, 7)", ft.range_sum(3, 7), sum(arr[2:7])),
        ("range_sum(1, 4)", ft.range_sum(1, 4), sum(arr[:4])),
    ]
    
    for name, result, verify in queries:
        status = "✓" if result == verify else "✗"
        print(f"{name:<20} {result:<10} {verify} {status}")
    
    # Demonstrate update
    print("\n" + "="*60)
    print("Update Operation: add 5 to index 4")
    print("="*60)
    ft.update(4, 5)
    print(f"After update(4, 5): {ft}")
    print(f"New prefix_sum(6): {ft.query(6)} (was {sum(arr[:6])})")
    print(f"Expected: {sum(arr[:6]) + 5}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
using namespace std;

/**
 * Fenwick Tree (Binary Indexed Tree) for range sum queries and point updates.
 * 
 * Time Complexities:
 *     - Update: O(log n)
 *     - Query: O(log n)
 * 
 * Space Complexity: O(n)
 */
class FenwickTree {
private:
    vector<int> tree;
    int n;
    
    int lsb(int i) const {
        return i & (-i);
    }
    
public:
    FenwickTree(int size) : n(size) {
        tree.resize(size + 1, 0);
    }
    
    /**
     * Add delta to element at index.
     * Time: O(log n)
     */
    void update(int index, int delta) {
        while (index <= n) {
            tree[index] += delta;
            index += lsb(index);
        }
    }
    
    /**
     * Get prefix sum from 1 to index (inclusive).
     * Time: O(log n)
     */
    int query(int index) const {
        int result = 0;
        while (index > 0) {
            result += tree[index];
            index -= lsb(index);
        }
        return result;
    }
    
    /**
     * Get sum of elements in range [left, right].
     * Time: O(log n)
     */
    int rangeSum(int left, int right) const {
        return query(right) - query(left - 1);
    }
};

/**
 * Build Fenwick Tree from array in O(n log n).
 */
FenwickTree buildFenwick(const vector<int>& arr) {
    FenwickTree ft(arr.size());
    for (int i = 0; i < arr.size(); i++) {
        ft.update(i + 1, arr[i]);
    }
    return ft;
}

/**
 * Build Fenwick Tree from array in O(n).
 */
FenwickTree buildFenwickLinear(const vector<int>& arr) {
    int n = arr.size();
    FenwickTree ft(n);
    
    // Copy array values (1-indexed)
    for (int i = 1; i <= n; i++) {
        ft.tree[i] = arr[i - 1];
    }
    
    // Build tree by propagating to parents
    for (int i = 1; i <= n; i++) {
        int j = i + (i & -i);
        if (j <= n) {
            ft.tree[j] += ft.tree[i];
        }
    }
    
    return ft;
}

int main() {
    vector<int> arr = {3, 2, -1, 6, 5, 4, -3, 3, 7, 2, 3};
    
    cout << "Array: ";
    for (int x : arr) cout << x << " ";
    cout << endl << endl;
    
    // Build Fenwick Tree
    FenwickTree ft = buildFenwickLinear(arr);
    
    // Query examples
    cout << "Query Results:" << endl;
    cout << "Query               Result    Verification" << endl;
    cout << "----------------------------------------" << endl;
    
    cout << "prefix_sum(6):      " << ft.query(6) << "        ";
    int sum6 = 0;
    for (int i = 0; i < 6; i++) sum6 += arr[i];
    cout << sum6 << endl;
    
    cout << "prefix_sum(11):     " << ft.query(11) << "       ";
    int total = 0;
    for (int x : arr) total += x;
    cout << total << endl;
    
    cout << "range_sum(3, 7):    " << ft.rangeSum(3, 7) << "        ";
    int sum37 = 0;
    for (int i = 2; i < 7; i++) sum37 += arr[i];
    cout << sum37 << endl;
    
    // Demonstrate update
    cout << endl << "Update Operation: add 5 to index 4" << endl;
    ft.update(4, 5);
    cout << "New prefix_sum(6):  " << ft.query(6) << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.Arrays;

/**
 * Fenwick Tree (Binary Indexed Tree) for range sum queries and point updates.
 * 
 * Time Complexities:
 *     - Update: O(log n)
 *     - Query: O(log n)
 * 
 * Space Complexity: O(n)
 */
public class FenwickTree {
    private int[] tree;
    private int n;
    
    public FenwickTree(int size) {
        this.n = size;
        this.tree = new int[size + 1];
    }
    
    private int lsb(int i) {
        return i & (-i);
    }
    
    /**
     * Add delta to element at index.
     * Time: O(log n)
     */
    public void update(int index, int delta) {
        while (index <= n) {
            tree[index] += delta;
            index += lsb(index);
        }
    }
    
    /**
     * Get prefix sum from 1 to index (inclusive).
     * Time: O(log n)
     */
    public int query(int index) {
        int result = 0;
        while (index > 0) {
            result += tree[index];
            index -= lsb(index);
        }
        return result;
    }
    
    /**
     * Get sum of elements in range [left, right].
     * Time: O(log n)
     */
    public int rangeSum(int left, int right) {
        return query(right) - query(left - 1);
    }
    
    /**
     * Build Fenwick Tree from array in O(n log n).
     */
    public static FenwickTree buildFromArray(int[] arr) {
        FenwickTree ft = new FenwickTree(arr.length);
        for (int i = 0; i < arr.length; i++) {
            ft.update(i + 1, arr[i]);
        }
        return ft;
    }
    
    /**
     * Build Fenwick Tree from array in O(n).
     */
    public static FenwickTree buildLinear(int[] arr) {
        int n = arr.length;
        FenwickTree ft = new FenwickTree(n);
        
        // Copy array values
        for (int i = 1; i <= n; i++) {
            ft.tree[i] = arr[i - 1];
        }
        
        // Build tree by propagating to parents
        for (int i = 1; i <= n; i++) {
            int j = i + (i & -i);
            if (j <= n) {
                ft.tree[j] += ft.tree[i];
            }
        }
        
        return ft;
    }
    
    @Override
    public String toString() {
        return "FenwickTree" + Arrays.toString(Arrays.copyOfRange(tree, 1, n + 1));
    }
    
    public static void main(String[] args) {
        int[] arr = {3, 2, -1, 6, 5, 4, -3, 3, 7, 2, 3};
        
        System.out.println("Array: " + Arrays.toString(arr));
        System.out.println();
        
        // Build Fenwick Tree
        FenwickTree ft = buildLinear(arr);
        System.out.println("Fenwick Tree: " + ft);
        
        // Query examples
        System.out.println("\nQuery Results:");
        System.out.println("Query               Result    Verification");
        System.out.println("----------------------------------------");
        
        System.out.println("prefix_sum(6):      " + ft.query(6) + "        " + 
            Arrays.stream(Arrays.copyOfRange(arr, 0, 6)).sum());
        System.out.println("prefix_sum(11):     " + ft.query(11) + "       " + 
            Arrays.stream(arr).sum());
        System.out.println("range_sum(3, 7):    " + ft.rangeSum(3, 7) + "        " + 
            Arrays.stream(Arrays.copyOfRange(arr, 2, 7)).sum());
        
        // Demonstrate update
        System.out.println("\nUpdate Operation: add 5 to index 4");
        ft.update(4, 5);
        System.out.println("New prefix_sum(6):  " + ft.query(6));
    }
}
```

<!-- slide -->
```javascript
/**
 * Fenwick Tree (Binary Indexed Tree) for range sum queries and point updates.
 * 
 * Time Complexities:
 *     - Update: O(log n)
 *     - Query: O(log n)
 * 
 * Space Complexity: O(n)
 */
class FenwickTree {
    /**
     * @param {number} size - Number of elements
     */
    constructor(size) {
        this.n = size;
        this.tree = new Array(size + 1).fill(0);
    }
    
    /**
     * Return lowest set bit of i.
     * @param {number} i
     * @returns {number}
     */
    static lsb(i) {
        return i & (-i);
    }
    
    /**
     * Add delta to element at index.
     * Time: O(log n)
     * @param {number} index - 1-indexed position
     * @param {number} delta - Value to add
     */
    update(index, delta) {
        while (index <= this.n) {
            this.tree[index] += delta;
            index += FenwickTree.lsb(index);
        }
    }
    
    /**
     * Get prefix sum from 1 to index (inclusive).
     * Time: O(log n)
     * @param {number} index - 1-indexed position
     * @returns {number}
     */
    query(index) {
        let result = 0;
        while (index > 0) {
            result += this.tree[index];
            index -= FenwickTree.lsb(index);
        }
        return result;
    }
    
    /**
     * Get sum of elements in range [left, right].
     * Time: O(log n)
     * @param {number} left - 1-indexed start position
     * @param {number} right - 1-indexed end position
     * @returns {number}
     */
    rangeSum(left, right) {
        return this.query(right) - this.query(left - 1);
    }
    
    toString() {
        return `FenwickTree([${this.tree.slice(1).join(', ')}])`;
    }
}

/**
 * Build Fenwick Tree from array in O(n log n).
 * @param {number[]} arr
 * @returns {FenwickTree}
 */
function buildFenwickFromUpdates(arr) {
    const ft = new FenwickTree(arr.length);
    for (let i = 0; i < arr.length; i++) {
        ft.update(i + 1, arr[i]);
    }
    return ft;
}

/**
 * Build Fenwick Tree from array in O(n).
 * @param {number[]} arr
 * @returns {FenwickTree}
 */
function buildFenwickLinear(arr) {
    const n = arr.length;
    const ft = new FenwickTree(n);
    
    // Copy array values
    for (let i = 1; i <= n; i++) {
        ft.tree[i] = arr[i - 1];
    }
    
    // Build tree by propagating to parents
    for (let i = 1; i <= n; i++) {
        const j = i + (i & -i);
        if (j <= n) {
            ft.tree[j] += ft.tree[i];
        }
    }
    
    return ft;
}

// Example usage
const arr = [3, 2, -1, 6, 5, 4, -3, 3, 7, 2, 3];
console.log(`Array: [${arr.join(', ')}]`);
console.log(`Array length: ${arr.length}\n`);

// Build Fenwick Tree
const ft = buildFenwickLinear(arr);
console.log(`Fenwick Tree: ${ft}`);

// Query examples
console.log("\nQuery Results:");
console.log("Query               Result    Verification");
console.log("----------------------------------------");

const sum6 = arr.slice(0, 6).reduce((a, b) => a + b, 0);
const total = arr.reduce((a, b) => a + b, 0);
const sum37 = arr.slice(2, 7).reduce((a, b) => a + b, 0);

console.log(`prefix_sum(6):      ${ft.query(6)}        ${sum6}`);
console.log(`prefix_sum(11):     ${ft.query(11)}       ${total}`);
console.log(`range_sum(3, 7):    ${ft.rangeSum(3, 7)}        ${sum37}`);

// Demonstrate update
console.log("\nUpdate Operation: add 5 to index 4");
ft.update(4, 5);
console.log(`New prefix_sum(6):  ${ft.query(6)} (was ${sum6})`);
console.log(`Expected: ${sum6 + 5}`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Point Update** | O(log n) | Propagates through O(log n) indices |
| **Prefix Sum Query** | O(log n) | Sums O(log n) non-overlapping ranges |
| **Range Sum Query** | O(log n) | Two prefix sum queries |
| **Build (Updates)** | O(n log n) | n individual updates |
| **Build (Linear)** | O(n) | Direct construction |

### Detailed Breakdown

**Update Operation:**
- Each update touches indices: `i, i+lsb(i), i+lsb(i)+lsb(i+lsb(i)), ...`
- This climbs the "tree" structure toward larger indices
- Maximum iterations = number of bits = O(log n)

**Query Operation:**
- Each query processes indices: `i, i-lsb(i), i-lsb(i)-lsb(i-lsb(i)), ...`
- This removes the lowest set bit each iteration
- Maximum iterations = number of set bits ≤ O(log n)

**Why O(log n) and not O(log² n)?**
- The binary representation ensures at most log₂(n) + 1 operations
- For n = 10⁶, log₂(n) ≈ 20 operations maximum

---

## Space Complexity Analysis

| Component | Space | Description |
|-----------|-------|-------------|
| **Tree Array** | O(n) | n+1 integers (1-indexed) |
| **Total** | O(n) | Linear space requirement |

### Space Comparison with Segment Tree

- **Fenwick Tree**: ~n integers
- **Segment Tree**: ~4n integers
- **Sparse Table**: O(n log n) integers

Fenwick Tree uses approximately 4× less memory than Segment Tree, making it ideal for memory-constrained environments.

---

## Common Variations

### 1. Fenwick Tree for Range Updates and Point Queries

Use a difference array approach where the Fenwick Tree stores differences:

````carousel
```python
class FenwickTreeRangeUpdate:
    """
    Fenwick Tree supporting range updates and point queries.
    
    To add 'val' to range [l, r]:
        update(l, val)
        update(r + 1, -val)
    
    To query point i:
        return prefix_sum(i)
    """
    
    def __init__(self, size):
        self.n = size
        self.tree = [0] * (size + 2)
    
    def _lsb(self, i):
        return i & (-i)
    
    def _update(self, index, delta):
        while index <= self.n + 1:
            self.tree[index] += delta
            index += self._lsb(index)
    
    def range_add(self, left, right, delta):
        """Add delta to all elements in range [left, right]."""
        self._update(left, delta)
        self._update(right + 1, -delta)
    
    def point_query(self, index):
        """Get value at specific index."""
        result = 0
        while index > 0:
            result += self.tree[index]
            index -= self._lsb(index)
        return result
```
````

### 2. Fenwick Tree for Range Updates and Range Queries

Requires two Fenwick Trees to handle both operations:

````carousel
```python
class FenwickTreeRangeQuery:
    """
    Fenwick Tree supporting range updates and range sum queries.
    Uses two trees: B1 for linear coefficient, B2 for constant.
    """
    
    def __init__(self, size):
        self.n = size
        self.B1 = [0] * (size + 2)  # Linear coefficient tree
        self.B2 = [0] * (size + 2)  # Constant tree
    
    def _lsb(self, i):
        return i & (-i)
    
    def _add(self, tree, index, delta):
        while index <= self.n + 1:
            tree[index] += delta
            index += self._lsb(index)
    
    def _sum(self, tree, index):
        result = 0
        while index > 0:
            result += tree[index]
            index -= self._lsb(index)
        return result
    
    def range_add(self, left, right, delta):
        """Add delta to all elements in range [left, right]."""
        self._add(self.B1, left, delta)
        self._add(self.B1, right + 1, -delta)
        self._add(self.B2, left, delta * (left - 1))
        self._add(self.B2, right + 1, -delta * right)
    
    def _prefix_sum(self, index):
        """Get prefix sum [1..index]."""
        return self._sum(self.B1, index) * index - self._sum(self.B2, index)
    
    def range_sum(self, left, right):
        """Get sum of range [left, right]."""
        return self._prefix_sum(right) - self._prefix_sum(left - 1)
```
````

### 3. Fenwick Tree for Inversion Count

Count the number of inversions in an array efficiently:

````carousel
```python
def count_inversions(arr):
    """
    Count inversions in array using Fenwick Tree.
    Inversion: pair (i, j) where i < j and arr[i] > arr[j]
    
    Time: O(n log n)
    Space: O(n)
    """
    # Coordinate compression
    sorted_unique = sorted(set(arr))
    compress = {v: i + 1 for i, v in enumerate(sorted_unique)}
    
    n = len(sorted_unique)
    ft = FenwickTree(n)
    inversions = 0
    
    # Process from right to left
    for i in range(len(arr) - 1, -1, -1):
        idx = compress[arr[i]]
        # Count elements smaller than current (already seen)
        inversions += ft.query(idx - 1)
        ft.update(idx, 1)
    
    return inversions

# Example
arr = [5, 2, 6, 1, 3]
print(f"Array: {arr}")
print(f"Inversions: {count_inversions(arr)}")  # Output: 5
```
````

### 4. 2D Fenwick Tree

For 2D range sum queries and point updates:

````carousel
```python
class FenwickTree2D:
    """
    2D Fenwick Tree for range sum queries on a matrix.
    
    Time: O(log² n) for update and query
    Space: O(n²)
    """
    
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.tree = [[0] * (cols + 1) for _ in range(rows + 1)]
    
    def _lsb(self, i):
        return i & (-i)
    
    def update(self, row, col, delta):
        """Add delta to element at (row, col)."""
        i = row
        while i <= self.rows:
            j = col
            while j <= self.cols:
                self.tree[i][j] += delta
                j += self._lsb(j)
            i += self._lsb(i)
    
    def query(self, row, col):
        """Get sum of rectangle [1..row][1..col]."""
        result = 0
        i = row
        while i > 0:
            j = col
            while j > 0:
                result += self.tree[i][j]
                j -= self._lsb(j)
            i -= self._lsb(i)
        return result
    
    def range_sum(self, r1, c1, r2, c2):
        """Get sum of rectangle [r1..r2][c1..c2]."""
        return (self.query(r2, c2) 
                - self.query(r1 - 1, c2) 
                - self.query(r2, c1 - 1) 
                + self.query(r1 - 1, c1 - 1))
```
````

---

## Practice Problems

### Problem 1: Range Sum Query - Mutable

**Problem:** [LeetCode 307 - Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/)

**Description:** Given an integer array `nums`, handle multiple queries of the following types:
1. Update the value of an element in `nums`.
2. Calculate the sum of the elements of `nums` between indices `left` and `right` inclusive.

**How to Apply Fenwick Tree:**
- Use Fenwick Tree to store prefix sums
- Update operation: O(log n)
- Range sum query: O(log n) using prefix differences

---

### Problem 2: Count of Smaller Numbers After Self

**Problem:** [LeetCode 315 - Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)

**Description:** Given an integer array `nums`, return a new array `counts` where `counts[i]` is the number of smaller elements to the right of `nums[i]`.

**How to Apply Fenwick Tree:**
- Coordinate compress the values
- Process array from right to left
- Use Fenwick Tree to count frequencies of seen elements
- Query count of elements less than current before updating

---

### Problem 3: Reverse Pairs

**Problem:** [LeetCode 493 - Reverse Pairs](https://leetcode.com/problems/reverse-pairs/)

**Description:** Given an integer array `nums`, return the number of reverse pairs in the array. A reverse pair is a pair `(i, j)` where `0 <= i < j < nums.length` and `nums[i] > 2 * nums[j]`.

**How to Apply Fenwick Tree:**
- Coordinate compression on both `nums[i]` and `2 * nums[i]`
- Process from right to left
- Query count of elements satisfying `nums[i] > 2 * nums[j]`
- Update frequency of current element

---

### Problem 4: Count of Range Sum

**Problem:** [LeetCode 327 - Count of Range Sum](https://leetcode.com/problems/count-of-range-sum/)

**Description:** Given an integer array `nums` and two integers `lower` and `upper`, return the number of range sums that lie in `[lower, upper]` inclusive.

**How to Apply Fenwick Tree:**
- Transform to prefix sums problem
- For each prefix sum, count previous prefix sums in range `[current - upper, current - lower]`
- Use Fenwick Tree with coordinate-compressed prefix sums

---

### Problem 5: Create Sorted Array through Instructions

**Problem:** [LeetCode 1649 - Create Sorted Array through Instructions](https://leetcode.com/problems/create-sorted-array-through-instructions/)

**Description:** Given an integer array `instructions`, you are asked to create a sorted array from the elements in `instructions`. You start with an empty container `nums`. For each element from left to right in `instructions`, insert it into `nums`. The cost of each insertion is the minimum of the number of elements currently in `nums` that are strictly less than or strictly greater than the element being inserted. Return the total cost to insert all elements.

**How to Apply Fenwick Tree:**
- Use Fenwick Tree to maintain frequency count
- For each insertion, query:
  - Count of elements less than current (strictly less)
  - Count of elements greater than current (strictly greater)
- Add minimum of the two to total cost
- Update frequency of current element

---

## Video Tutorial Links

### Fundamentals

- [Fenwick Tree / Binary Indexed Tree (Take U Forward)](https://www.youtube.com/watch?v=CWDQJGaN1gY) - Comprehensive introduction with visualizations
- [Binary Indexed Tree (Fenwick Tree) - CP Algorithms](https://www.youtube.com/watch?v=uSFzHCZ4E-8) - Theory and implementation
- [Fenwick Tree Explained (NeetCode)](https://www.youtube.com/watch?v=qijYQx4b7zU) - Practical problem-solving approach

### Advanced Topics

- [Range Update with Fenwick Tree](https://www.youtube.com/watch?v=kPaJfAUwViY) - Handling range updates efficiently
- [Fenwick Tree vs Segment Tree](https://www.youtube.com/watch?v=RgITNht_f4Q) - When to use which data structure
- [2D Fenwick Tree Tutorial](https://www.youtube.com/watch?v=DPiY9wJYOzw) - 2D range queries

---

## Follow-up Questions

### Q1: Why does `i & (-i)` give the lowest set bit?

**Answer:** This works due to two's complement representation:
- In two's complement, `-i` is represented as `~i + 1` (bitwise NOT plus 1)
- This flips all bits up to and including the lowest set bit of `i`
- When ANDed with the original `i`, only that lowest set bit remains
- Example: `i = 12` (1100), `-i` in binary (two's complement) is ...11110100
- `1100 & 0100 = 0100` (which is 4)

### Q2: Can Fenwick Tree handle range updates efficiently?

**Answer:** Standard Fenwick Tree only supports point updates. For range updates:
- **Range update + Point query**: Use difference array technique with one Fenwick Tree
- **Range update + Range query**: Requires two Fenwick Trees to handle linear coefficients
- **Alternative**: Use Segment Tree with lazy propagation for simpler implementation

### Q3: What operations can Fenwick Tree support besides sum?

**Answer:** Fenwick Tree works for any operation that:
1. Is associative: `(a op b) op c = a op (b op c)`
2. Has an inverse: `a op inv(a) = identity`

Supported operations:
- **Sum**: `inv(a) = -a`
- **XOR**: `inv(a) = a` (self-inverse)
- **Multiplication**: `inv(a) = 1/a` (if a ≠ 0)

NOT supported:
- **Min/Max**: No inverse operation
- **GCD**: No inverse operation
- Use Segment Tree for these operations

### Q4: How does Fenwick Tree compare to Prefix Sum array?

**Answer:**
- **Prefix Sum**: O(1) query, O(n) update
- **Fenwick Tree**: O(log n) query, O(log n) update

Choose:
- **Prefix Sum**: When array is static (no updates)
- **Fenwick Tree**: When you need both queries and updates
- For purely static arrays, Prefix Sum is simpler and faster

### Q5: Why is Fenwick Tree 1-indexed internally?

**Answer:**
- The bit manipulation relies on `i & (-i)` returning meaningful values
- If `i = 0`, then `i & (-i) = 0`, causing infinite loops
- 1-indexing ensures the loop termination conditions work correctly:
  - Update: `i += lsb(i)` eventually exceeds n
  - Query: `i -= lsb(i)` eventually reaches 0
- When working with 0-based arrays, simply add 1 to all indices

---

## Summary

The Fenwick Tree (Binary Indexed Tree) is an elegant data structure for **dynamic prefix sum** queries with **point updates**. Key takeaways:

- **O(log n)** time for both update and query operations
- **O(n)** space - much more memory-efficient than Segment Tree
- **Simple implementation** - fewer lines of code than Segment Tree
- **Bit manipulation** - leverages binary representation for efficiency
- **Invertible operations only** - works for sum, XOR; not for min/max

When to use:
- ✅ Dynamic arrays with frequent updates and prefix sum queries
- ✅ Counting inversions or frequencies
- ✅ Range sum queries with point updates
- ✅ Memory-constrained environments
- ❌ Operations without inverses (min, max, GCD)
- ❌ Range updates without additional techniques

The Fenwick Tree is an essential data structure for competitive programming and technical interviews, offering an optimal balance of simplicity, efficiency, and low memory usage for prefix sum problems.

---

## Related Algorithms

- [Segment Tree](./segment-tree.md) - Dynamic range queries for any operation
- [Sparse Table](./sparse-table.md) - Static range queries in O(1)
- [Prefix Sum](./prefix-sum.md) - Static range sums in O(1)
- [Difference Array](./difference-array.md) - Range updates in O(1)
