# Prefix Sum

## Category
Arrays & Strings

## Description

Prefix Sum is a fundamental technique that enables **O(1) range query time** after **O(n)** preprocessing for sum operations on static arrays. Instead of summing elements for each query (which costs O(n) per query), we precompute cumulative sums once and answer any range sum query in constant time. This makes it ideal for scenarios where the array never changes but many range sum queries need to be answered quickly.

---

## When to Use

Use the Prefix Sum algorithm when you need to solve problems involving:

- **Static Arrays**: When the array elements don't change after initialization
- **Many Range Queries**: When you need to answer a large number of range sum queries
- **Fast Query Time**: When O(1) query time is critical and preprocessing time is acceptable
- **Subarray Problems**: When the problem involves finding subarray sums, averages, or counts within ranges

### Comparison with Alternatives

| Data Structure | Build Time | Query Time | Update Time | Supports Dynamic Updates |
|----------------|------------|------------|-------------|--------------------------|
| **Prefix Sum** | O(n) | O(1) | O(n) | ❌ No |
| **Sparse Table** | O(n log n) | O(1) | O(n log n) | ❌ No (for idempotent ops only) |
| **Segment Tree** | O(n) | O(log n) | O(log n) | ✅ Yes |
| **Fenwick Tree** | O(n) | O(log n) | O(log n) | ✅ Yes (limited) |

### When to Choose Prefix Sum vs Segment Tree

- **Choose Prefix Sum** when:
  - The array is completely static (no updates)
  - You need O(1) query time
  - You're only doing sum operations (not min/max)

- **Choose Segment Tree** when:
  - The array may be updated
  - You need to query different operations (min, max, sum)
  - You're okay with O(log n) query time

---

## Algorithm Explanation

### Core Concept

The key insight behind Prefix Sum is that any subarray sum can be computed by comparing two cumulative sums. By precomputing the sum of all elements from the start to each index, we can answer any range sum query in O(1) by subtracting two prefix values.

### How It Works

#### Preprocessing Phase:
- `prefix[i]` = sum of all elements from index 0 to i-1 (inclusive)
- Build using: `prefix[i] = prefix[i-1] + arr[i-1]`
- Note: We typically use a dummy prefix[0] = 0 for easier calculations

#### Query Phase:
For a range `[L, R]` (inclusive):
1. The answer is `prefix[R + 1] - prefix[L]`
2. This works because:
   - `prefix[R + 1]` = arr[0] + arr[1] + ... + arr[R]
   - `prefix[L]` = arr[0] + arr[1] + ... + arr[L-1]
   - Difference = arr[L] + arr[L+1] + ... + arr[R]

### Visual Representation

For array `[2, 4, 1, 5, 3]`:

```
Index:        0    1    2    3    4
Array:       [2,   4,   1,   5,   3]

Prefix:    0  [2,   6,   7,  12,  15]
           ↑   ↑    ↑    ↑    ↑    ↑
          idx 0   1    2    3    4   5

Query: range_sum(1, 3)
prefix[4] - prefix[1] = 12 - 2 = 10 ✓
(elements: 4 + 1 + 5 = 10)
```

### Why It Works

The mathematical proof is straightforward:
- `prefix[r + 1]` = Σ(arr[0] to arr[r])
- `prefix[l]` = Σ(arr[0] to arr[l-1])
- `prefix[r + 1] - prefix[l]` = Σ(arr[l] to arr[r])

### Limitations

- **Only works for static arrays**: Array must not change between queries
- **Only supports sum operations**: For min/max, use Sparse Table or Segment Tree
- **Higher space complexity**: O(n) additional space required
- **Not suitable for dynamic data**: Any change requires rebuilding the prefix array

---

## Algorithm Steps

### Building the Prefix Sum Array

1. **Initialize**: Create an array of size n+1 with prefix[0] = 0
2. **Iterate**: For i from 1 to n, compute `prefix[i] = prefix[i-1] + arr[i-1]`
3. **Complete**: Now prefix[i] contains sum of first i elements

### Querying a Range

1. **Validate**: Ensure 0 ≤ left ≤ right < n
2. **Compute**: Return `prefix[right + 1] - prefix[left]`
3. **Done**: O(1) time!

### Handling Edge Cases

- **Empty array**: Return 0 or empty prefix
- **Single element range**: Just return that element
- **Full array range**: Return prefix[n] - prefix[0] = prefix[n]
- **Zero-based vs One-based**: Be consistent with indexing

---

## Implementation

### Template Code (Range Sum Query)

````carousel
```python
from typing import List, Tuple, Optional


class PrefixSum:
    """
    1D Prefix Sum for Range Sum Queries on static arrays.
    
    Time Complexities:
        - Build: O(n)
        - Query: O(1)
    
    Space Complexity: O(n)
    
    Perfect for answering many range sum queries on static data.
    """
    
    def __init__(self, nums: List[int]):
        """
        Initialize the Prefix Sum array.
        
        Args:
            nums: Input array (must be static - no updates)
            
        Time: O(n)
        Space: O(n)
        """
        if not nums:
            self.n = 0
            self.prefix = [0]
            return
            
        self.n = len(nums)
        # prefix[i] = sum of nums[0:i] (first i elements)
        # prefix[0] = 0 (dummy for easier calculations)
        self.prefix = [0] * (self.n + 1)
        
        for i in range(self.n):
            self.prefix[i + 1] = self.prefix[i] + nums[i]
    
    def query(self, left: int, right: int) -> int:
        """
        Query the sum of elements in range [left, right] (inclusive).
        
        Args:
            left: Left index (inclusive), 0-based
            right: Right index (inclusive), 0-based
            
        Returns:
            Sum of elements in the range
            
        Raises:
            ValueError: If indices are invalid
            
        Time: O(1)
        """
        if left < 0 or right >= self.n or left > right:
            raise ValueError(f"Invalid range: [{left}, {right}] for array of size {self.n}")
        
        # prefix[right + 1] - prefix[left] = sum of arr[left:right+1]
        return self.prefix[right + 1] - self.prefix[left]
    
    def total_sum(self) -> int:
        """Get the sum of all elements in the array."""
        return self.prefix[self.n]
    
    def prefix_sum_at(self, idx: int) -> int:
        """Get sum of elements from start to idx (inclusive)."""
        if idx < 0 or idx >= self.n:
            raise ValueError(f"Invalid index: {idx}")
        return self.prefix[idx + 1]


class PrefixSum2D:
    """
    2D Prefix Sum for Matrix Range Sum Queries.
    
    Time Complexities:
        - Build: O(m * n)
        - Query: O(1)
    
    Space Complexity: O(m * n)
    """
    
    def __init__(self, matrix: List[List[int]]):
        """Initialize 2D Prefix Sum."""
        if not matrix or not matrix[0]:
            self.m = 0
            self.n = 0
            self.prefix = [[]]
            return
            
        self.m = len(matrix)
        self.n = len(matrix[0])
        
        # prefix[i][j] = sum of all elements in rectangle (0,0) to (i-1, j-1)
        self.prefix = [[0] * (self.n + 1) for _ in range(self.m + 1)]
        
        for i in range(self.m):
            for j in range(self.n):
                # Inclusion-exclusion principle
                self.prefix[i + 1][j + 1] = (
                    matrix[i][j]
                    + self.prefix[i][j + 1]
                    + self.prefix[i + 1][j]
                    - self.prefix[i][j]
                )
    
    def query(self, row1: int, col1: int, row2: int, col2: int) -> int:
        """
        Query sum of rectangle from (row1, col1) to (row2, col2) (inclusive).
        
        Args:
            row1, col1: Top-left corner
            row2, col2: Bottom-right corner
            
        Returns:
            Sum of all elements in the rectangle
        """
        # Using inclusion-exclusion:
        # sum = prefix[row2+1][col2+1] - prefix[row1][col2+1] 
        #       - prefix[row2+1][col1] + prefix[row1][col1]
        return (
            self.prefix[row2 + 1][col2 + 1]
            - self.prefix[row1][col2 + 1]
            - self.prefix[row2 + 1][col1]
            + self.prefix[row1][col1]
        )


# Standalone functions for simple use cases
def build_prefix_sum(nums: List[int]) -> List[int]:
    """Build prefix sum array."""
    prefix = [0]
    for num in nums:
        prefix.append(prefix[-1] + num)
    return prefix


def range_sum(prefix: List[int], left: int, right: int) -> int:
    """Query range sum using prebuilt prefix array."""
    return prefix[right + 1] - prefix[left]


def range_sum_queries(nums: List[int], queries: List[List[int]]) -> List[int]:
    """
    Answer multiple range sum queries efficiently.
    
    Args:
        nums: Input array
        queries: List of [left, right] queries
        
    Returns:
        List of sums for each query
    """
    prefix = build_prefix_sum(nums)
    return [range_sum(prefix, left, right) for left, right in queries]


# Example usage and demonstration
if __name__ == "__main__":
    # 1D Prefix Sum demonstration
    nums = [2, 4, 1, 5, 3]
    print(f"Array: {nums}")
    print()
    
    ps = PrefixSum(nums)
    
    # Query examples
    queries = [(0, 2), (1, 3), (2, 4), (0, 4), (2, 2)]
    
    print("1D Range Sum Queries:")
    print(f"{'Range':<12} {'Elements':<20} {'Sum':<5}")
    print("-" * 45)
    
    for left, right in queries:
        elements = nums[left:right+1]
        result = ps.query(left, right)
        print(f"[{left},{right}]:      {str(elements):<20} {result}")
    
    print(f"\nTotal sum: {ps.total_sum()}")
    
    # 2D Prefix Sum demonstration
    print("\n" + "=" * 50)
    print("2D Prefix Sum Demonstration:")
    print("=" * 50)
    
    matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ]
    
    print("\nMatrix:")
    for row in matrix:
        print(row)
    
    ps2d = PrefixSum2D(matrix)
    
    # Query examples
    rect_queries = [
        (0, 0, 2, 2),  # Full matrix
        (0, 0, 1, 1),  # Top-left 2x2
        (1, 1, 2, 2),  # Bottom-right 2x2
        (0, 1, 2, 1),  # Middle column
    ]
    
    print("\n2D Range Sum Queries:")
    print(f"{'Rectangle':<20} {'Sum':<5}")
    print("-" * 30)
    
    for r1, c1, r2, c2 in rect_queries:
        result = ps2d.query(r1, c1, r2, c2)
        print(f"[{r1},{c1}]->[{r2},{c2}]:       {result}")
    
    # Demonstrate prefix array structure
    print("\n" + "=" * 50)
    print("Prefix Array Structure:")
    print("=" * 50)
    print(f"prefix array: {ps.prefix}")
    print(f"prefix[i] = sum of first {chr(960)} elements")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <stdexcept>
using namespace std;

/**
 * 1D Prefix Sum for Range Sum Queries on static arrays.
 * 
 * Time Complexities:
 *     - Build: O(n)
 *     - Query: O(1)
 * 
 * Space Complexity: O(n)
 */
class PrefixSum {
private:
    vector<long long> prefix;
    int n;

public:
    PrefixSum(const vector<int>& nums) {
        n = nums.size();
        prefix.resize(n + 1, 0);
        
        // prefix[i] = sum of nums[0:i-1]
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }
    
    /**
     * Query sum of elements in range [left, right] (inclusive).
     * 
     * Time: O(1)
     */
    long long query(int left, int right) const {
        if (left < 0 || right >= n || left > right) {
            throw invalid_argument("Invalid range");
        }
        
        return prefix[right + 1] - prefix[left];
    }
    
    /**
     * Get total sum of all elements.
     */
    long long totalSum() const {
        return prefix[n];
    }
};

/**
 * 2D Prefix Sum for Matrix Range Sum Queries.
 * 
 * Time Complexities:
 *     - Build: O(m * n)
 *     - Query: O(1)
 * 
 * Space Complexity: O(m * n)
 */
class PrefixSum2D {
private:
    vector<vector<long long>> prefix;
    int m, n;

public:
    PrefixSum2D(const vector<vector<int>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) {
            m = 0;
            n = 0;
            return;
        }
        
        m = matrix.size();
        n = matrix[0].size();
        
        // prefix[i][j] = sum of rectangle (0,0) to (i-1, j-1)
        prefix.resize(m + 1, vector<long long>(n + 1, 0));
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                prefix[i + 1][j + 1] = 
                    matrix[i][j] 
                    + prefix[i][j + 1] 
                    + prefix[i + 1][j] 
                    - prefix[i][j];
            }
        }
    }
    
    /**
     * Query sum of rectangle from (row1, col1) to (row2, col2).
     */
    long long query(int row1, int col1, int row2, int col2) const {
        return (
            prefix[row2 + 1][col2 + 1]
            - prefix[row1][col2 + 1]
            - prefix[row2 + 1][col1]
            + prefix[row1][col1]
        );
    }
};

// Utility function for standalone usage
vector<long long> buildPrefixSum(const vector<int>& nums) {
    vector<long long> prefix(nums.size() + 1, 0);
    for (size_t i = 0; i < nums.size(); i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    return prefix;
}

long long rangeSum(const vector<long long>& prefix, int left, int right) {
    return prefix[right + 1] - prefix[left];
}


int main() {
    // 1D Prefix Sum demonstration
    vector<int> nums = {2, 4, 1, 5, 3};
    
    cout << "Array: ";
    for (int x : nums) cout << x << " ";
    cout << endl << endl;
    
    PrefixSum ps(nums);
    
    // Query examples
    vector<pair<int, int>> queries = {{0, 2}, {1, 3}, {2, 4}, {0, 4}, {2, 2}};
    
    cout << "1D Range Sum Queries:" << endl;
    cout << "Range      Elements          Sum" << endl;
    cout << "-----------------------------------" << endl;
    
    
    for (auto [left, right] : queries) {
        cout << "[" << left << "," << right << "]:      ";
        for (int i = left; i <= right; i++) {
            cout << nums[i] << " ";
        }
        // Padding
        for (int i = right - left + 1; i < 5; i++) cout << "  ";
        cout << ps.query(left, right) << endl;
    }
    
    cout << "\nTotal sum: " << ps.totalSum() << endl;
    
    // 2D Prefix Sum demonstration
    cout << "\n" << "==================================" << endl;
    cout << "2D Prefix Sum Demonstration:" << endl;
    cout << "==================================" << endl;
    
    vector<vector<int>> matrix = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    
    cout << "\nMatrix:" << endl;
    for (const auto& row : matrix) {
        for (int x : row) cout << x << " ";
        cout << endl;
    }
    
    PrefixSum2D ps2d(matrix);
    
    // Query examples
    vector<array<int, 4>> rectQueries = {
        {0, 0, 2, 2},  // Full matrix
        {0, 0, 1, 1},  // Top-left 2x2
        {1, 1, 2, 2},  // Bottom-right 2x2
        {0, 1, 2, 1},  // Middle column
    };
    
    cout << "\n2D Range Sum Queries:" << endl;
    cout << "Rectangle           Sum" << endl;
    cout << "---------------------------" << endl;
    
    for (const auto& q : rectQueries) {
        cout << "[" << q[0] << "," << q[1] << "]->[" << q[2] << "," << q[3] << "]:    ";
        cout << ps2d.query(q[0], q[1], q[2], q[3]) << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * 1D Prefix Sum for Range Sum Queries on static arrays.
 * 
 * Time Complexities:
 *     - Build: O(n)
 *     - Query: O(1)
 * 
 * Space Complexity: O(n)
 */
public class PrefixSum {
    private long[] prefix;
    private int n;
    
    public PrefixSum(int[] nums) {
        if (nums == null || nums.length == 0) {
            this.n = 0;
            this.prefix = new long[1];
            return;
        }
        
        this.n = nums.length;
        // prefix[i] = sum of nums[0:i-1], prefix[0] = 0
        this.prefix = new long[n + 1];
        
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }
    
    /**
     * Query sum of elements in range [left, right] (inclusive).
     * 
     * Time: O(1)
     */
    public long query(int left, int right) {
        if (left < 0 || right >= n || left > right) {
            throw new IllegalArgumentException(
                "Invalid range: [" + left + ", " + right + "]"
            );
        }
        
        return prefix[right + 1] - prefix[left];
    }
    
    /**
     * Get total sum of all elements.
     */
    public long totalSum() {
        return prefix[n];
    }
    
    /**
     * Get prefix sum at index (sum of elements 0 to idx inclusive).
     */
    public long prefixSumAt(int idx) {
        if (idx < 0 || idx >= n) {
            throw new IndexOutOfBoundsException("Invalid index: " + idx);
        }
        return prefix[idx + 1];
    }
}


/**
 * 2D Prefix Sum for Matrix Range Sum Queries.
 * 
 * Time Complexities:
 *     - Build: O(m * n)
 *     - Query: O(1)
 * 
 * Space Complexity: O(m * n)
 */
public class PrefixSum2D {
    private long[][] prefix;
    private int m, n;
    
    public PrefixSum2D(int[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0] == null || matrix[0].length == 0) {
            this.m = 0;
            this.n = 0;
            this.prefix = new long[0][0];
            return;
        }
        
        this.m = matrix.length;
        this.n = matrix[0].length;
        
        // prefix[i][j] = sum of rectangle (0,0) to (i-1, j-1)
        this.prefix = new long[m + 1][n + 1];
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                prefix[i + 1][j + 1] = 
                    matrix[i][j] 
                    + prefix[i][j + 1] 
                    + prefix[i + 1][j] 
                    - prefix[i][j];
            }
        }
    }
    
    /**
     * Query sum of rectangle from (row1, col1) to (row2, col2) (inclusive).
     */
    public long query(int row1, int col1, int row2, int col2) {
        return (
            prefix[row2 + 1][col2 + 1]
            - prefix[row1][col2 + 1]
            - prefix[row2 + 1][col1]
            + prefix[row1][col1]
        );
    }
}


/**
 * Utility class with static methods for standalone usage.
 */
public class PrefixSumUtil {
    
    /**
     * Build prefix sum array from input array.
     */
    public static long[] buildPrefixSum(int[] nums) {
        if (nums == null || nums.length == 0) {
            return new long[1];
        }
        
        long[] prefix = new long[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        return prefix;
    }
    
    /**
     * Query range sum using prebuilt prefix array.
     */
    public static long rangeSum(long[] prefix, int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
    
    /**
     * Answer multiple range sum queries.
     */
    public static long[] rangeSumQueries(int[] nums, int[][] queries) {
        long[] prefix = buildPrefixSum(nums);
        long[] results = new long[queries.length];
        
        for (int i = 0; i < queries.length; i++) {
            results[i] = rangeSum(prefix, queries[i][0], queries[i][1]);
        }
        return results;
    }
}


/**
 * Demo class for testing.
 */
public class PrefixSumDemo {
    public static void main(String[] args) {
        // 1D Prefix Sum demonstration
        int[] nums = {2, 4, 1, 5, 3};
        
        System.out.print("Array: ");
        System.out.println(Arrays.toString(nums));
        System.out.println();
        
        PrefixSum ps = new PrefixSum(nums);
        
        // Query examples
        int[][] queries = {{0, 2}, {1, 3}, {2, 4}, {0, 4}, {2, 2}};
        
        System.out.println("1D Range Sum Queries:");
        System.out.println("Range      Elements          Sum");
        System.out.println("-----------------------------------");
        
        for (int[] query : queries) {
            int left = query[0], right = query[1];
            System.out.print("[" + left + "," + right + "]:      ");
            for (int i = left; i <= right; i++) {
                System.out.print(nums[i] + " ");
            }
            // Padding
            for (int i = right - left + 1; i < 5; i++) System.out.print("  ");
            System.out.println(ps.query(left, right));
        }
        
        System.out.println("\nTotal sum: " + ps.totalSum());
        
        // 2D Prefix Sum demonstration
        System.out.println("\n==================================");
        System.out.println("2D Prefix Sum Demonstration:");
        System.out.println("==================================");
        
        int[][] matrix = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };
        
        System.out.println("\nMatrix:");
        for (int[] row : matrix) {
            System.out.println(Arrays.toString(row));
        }
        
        PrefixSum2D ps2d = new PrefixSum2D(matrix);
        
        // Query examples
        int[][] rectQueries = {
            {0, 0, 2, 2},  // Full matrix
            {0, 0, 1, 1},  // Top-left 2x2
            {1, 1, 2, 2},  // Bottom-right 2x2
            {0, 1, 2, 1},  // Middle column
        };
        
        System.out.println("\n2D Range Sum Queries:");
        System.out.println("Rectangle           Sum");
        System.out.println("---------------------------");
        
        for (int[] q : rectQueries) {
            System.out.println("[" + q[0] + "," + q[1] + "]->[" + q[2] + "," + q[3] + "]:    " 
                + ps2d.query(q[0], q[1], q[2], q[3]));
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * 1D Prefix Sum for Range Sum Queries on static arrays.
 * 
 * Time Complexities:
 *     - Build: O(n)
 *     - Query: O(1)
 * 
 * Space Complexity: O(n)
 */
class PrefixSum {
    /**
     * Create a Prefix Sum data structure.
     * @param {number[]} nums - Input array (must be static)
     */
    constructor(nums) {
        if (!nums || nums.length === 0) {
            this.n = 0;
            this.prefix = [0];
            return;
        }
        
        this.n = nums.length;
        // prefix[i] = sum of nums[0:i-1], prefix[0] = 0
        this.prefix = new Array(this.n + 1).fill(0);
        
        for (let i = 0; i < this.n; i++) {
            this.prefix[i + 1] = this.prefix[i] + nums[i];
        }
    }
    
    /**
     * Query sum of elements in range [left, right] (inclusive).
     * @param {number} left - Left index (inclusive)
     * @param {number} right - Right index (inclusive)
     * @returns {number} Sum of elements in the range
     * @throws {Error} If range is invalid
     * 
     * Time: O(1)
     */
    query(left, right) {
        if (left < 0 || right >= this.n || left > right) {
            throw new Error(`Invalid range: [${left}, ${right}] for array of size ${this.n}`);
        }
        
        return this.prefix[right + 1] - this.prefix[left];
    }
    
    /**
     * Get total sum of all elements.
     * @returns {number}
     */
    totalSum() {
        return this.prefix[this.n];
    }
    
    /**
     * Get prefix sum at index (sum of elements 0 to idx inclusive).
     * @param {number} idx 
     * @returns {number}
     */
    prefixSumAt(idx) {
        if (idx < 0 || idx >= this.n) {
            throw new Error(`Invalid index: ${idx}`);
        }
        return this.prefix[idx + 1];
    }
}


/**
 * 2D Prefix Sum for Matrix Range Sum Queries.
 * 
 * Time Complexities:
 *     - Build: O(m * n)
 *     - Query: O(1)
 * 
 * Space Complexity: O(m * n)
 */
class PrefixSum2D {
    /**
     * Create a 2D Prefix Sum data structure.
     * @param {number[][]} matrix - 2D array
     */
    constructor(matrix) {
        if (!matrix || matrix.length === 0 || !matrix[0] || matrix[0].length === 0) {
            this.m = 0;
            this.n = 0;
            this.prefix = [[]];
            return;
        }
        
        this.m = matrix.length;
        this.n = matrix[0].length;
        
        // prefix[i][j] = sum of rectangle (0,0) to (i-1, j-1)
        this.prefix = Array.from({ length: this.m + 1 }, () => 
            new Array(this.n + 1).fill(0)
        );
        
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                this.prefix[i + 1][j + 1] = 
                    matrix[i][j] 
                    + this.prefix[i][j + 1] 
                    + this.prefix[i + 1][j] 
                    - this.prefix[i][j];
            }
        }
    }
    
    /**
     * Query sum of rectangle from (row1, col1) to (row2, col2) (inclusive).
     * @param {number} row1 
     * @param {number} col1 
     * @param {number} row2 
     * @param {number} col2 
     * @returns {number}
     */
    query(row1, col1, row2, col2) {
        return (
            this.prefix[row2 + 1][col2 + 1]
            - this.prefix[row1][col2 + 1]
            - this.prefix[row2 + 1][col1]
            + this.prefix[row1][col1]
        );
    }
}


/**
 * Build prefix sum array (standalone function).
 * @param {number[]} nums 
 * @returns {number[]}
 */
function buildPrefixSum(nums) {
    const prefix = [0];
    for (const num of nums) {
        prefix.push(prefix[prefix.length - 1] + num);
    }
    return prefix;
}


/**
 * Query range sum using prebuilt prefix array.
 * @param {number[]} prefix 
 * @param {number} left 
 * @param {number} right 
 * @returns {number}
 */
function rangeSum(prefix, left, right) {
    return prefix[right + 1] - prefix[left];
}


/**
 * Answer multiple range sum queries.
 * @param {number[]} nums 
 * @param {number[][]} queries 
 * @returns {number[]}
 */
function rangeSumQueries(nums, queries) {
    const prefix = buildPrefixSum(nums);
    return queries.map(([left, right]) => rangeSum(prefix, left, right));
}


// Example usage and demonstration
console.log("1D Prefix Sum Demonstration:");
console.log("=".repeat(50));

const nums = [2, 4, 1, 5, 3];
console.log(`\nArray: [${nums.join(', ')}]`);

const ps = new PrefixSum(nums);

// Query examples
const queries = [[0, 2], [1, 3], [2, 4], [0, 4], [2, 2]];

console.log("\n1D Range Sum Queries:");
console.log("Range      Elements          Sum");
console.log("-".repeat(40));

for (const [left, right] of queries) {
    const elements = nums.slice(left, right + 1);
    const result = ps.query(left, right);
    console.log(
        `[${left},${right}]:      ${elements.join(' ').padEnd(18)} ${result}`
    );
}

console.log(`\nTotal sum: ${ps.totalSum()}`);

// 2D Prefix Sum demonstration
console.log("\n" + "=".repeat(50));
console.log("2D Prefix Sum Demonstration:");
console.log("=".repeat(50));

const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

console.log("\nMatrix:");
for (const row of matrix) {
    console.log(`  [${row.join(', ')}]`);
}

const ps2d = new PrefixSum2D(matrix);

// Query examples
const rectQueries = [
    [[0, 0], [2, 2]],  // Full matrix
    [[0, 0], [1, 1]],  // Top-left 2x2
    [[1, 1], [2, 2]],  // Bottom-right 2x2
    [[0, 1], [2, 1]],  // Middle column
];

console.log("\n2D Range Sum Queries:");
console.log("Rectangle           Sum");
console.log("-".repeat(30));

for (const [topLeft, bottomRight] of rectQueries) {
    const [r1, c1] = topLeft;
    const [r2, c2] = bottomRight;
    const result = ps2d.query(r1, c1, r2, c2);
    console.log(`[${r1},${c1}]->[${r2},${c2}]:    ${result}`);
}

// Demonstrate prefix array structure
console.log("\n" + "=".repeat(50));
console.log("Prefix Array Structure:");
console.log("=".repeat(50));
console.log(`prefix array: [${ps.prefix.join(', ')}]`);
console.log("prefix[i] = sum of first i elements");
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Preprocessing/Build** | O(n) | Need to iterate through array once |
| **Query** | O(1) | Just two array lookups and one subtraction |
| **Space** | O(n) | Need additional array of size n+1 |

### Detailed Breakdown

- **Building the prefix array**: For each of n elements, we add to the running sum
  - Total: O(n)

- **Query**: 
  - Two array lookups: O(1)
  - One subtraction: O(1)
  - Total: O(1)

### Special Cases

- **2D Prefix Sum Build**: O(m × n) where m and n are matrix dimensions
- **2D Query**: O(1) with four array lookups and three additions/subtractions

---

## Space Complexity Analysis

- **1D Prefix Sum**: O(n) - stores n+1 long integers
- **2D Prefix Sum**: O(m × n) - stores (m+1) × (n+1) long integers
- **Log Table**: Not needed (unlike Sparse Table)

### Space Optimization (Optional)

For very large arrays, consider:
1. **In-place modification**: If original array can be modified
2. **Memory-mapped files**: For extremely large datasets
3. **Streaming approach**: If queries are known in advance

---

## Common Variations

### 1. Difference Array (Inverse of Prefix Sum)

Used for range update, point query scenarios:

````carousel
```python
class DifferenceArray:
    """
    Difference Array for O(1) range updates.
    
    After all updates, convert back to prefix sum to get final array.
    
    Operations:
        - range_add(l, r, val): Add val to all elements in [l, r]
        - After all updates: Convert to prefix sum for final result
    """
    
    def __init__(self, nums):
        self.n = len(nums)
        self.diff = [0] * (self.n + 1)
        
        # Build difference array
        # diff[i] = nums[i] - nums[i-1]
        self.diff[0] = nums[0]
        for i in range(1, self.n):
            self.diff[i] = nums[i] - nums[i - 1]
    
    def range_add(self, left, right, val):
        """Add val to all elements in range [left, right]."""
        self.diff[left] += val
        if right + 1 < self.n:
            self.diff[right + 1] -= val
    
    def build(self):
        """Convert difference array back to final array via prefix sum."""
        result = [0] * self.n
        result[0] = self.diff[0]
        for i in range(1, self.n):
            result[i] = result[i - 1] + self.diff[i]
        return result
```
````

### 2. Prefix XOR

For range XOR queries (useful for finding unique elements in ranges):

````carousel
```python
class PrefixXOR:
    """Prefix XOR for Range XOR Queries."""
    
    def __init__(self, nums):
        self.n = len(nums)
        self.prefix = [0] * (self.n + 1)
        
        for i in range(self.n):
            self.prefix[i + 1] = self.prefix[i] ^ nums[i]
    
    def query(self, left, right):
        """XOR of elements in range [left, right]."""
        return self.prefix[right + 1] ^ self.prefix[left]
```
````

### 3. Prefix Min/Max (Cumulative Extremes)

For range minimum/maximum from start:

````carousel
```python
class PrefixMinMax:
    """Prefix Min and Max for range queries from start."""
    
    def __init__(self, nums):
        self.n = len(nums)
        self.prefix_min = [float('inf')] * (self.n + 1)
        self.prefix_max = [float('-inf')] * (self.n + 1)
        
        for i in range(self.n):
            self.prefix_min[i + 1] = min(self.prefix_min[i], nums[i])
            self.prefix_max[i + 1] = max(self.prefix_max[i], nums[i])
    
    def min_from_start(self, right):
        """Minimum from index 0 to right."""
        return self.prefix_min[right + 1]
    
    def max_from_start(self, right):
        """Maximum from index 0 to right."""
        return self.prefix_max[right + 1]
```
````

### 4. Rolling Hash Prefix

For string substring comparisons:

````carousel
```python
class RollingHash:
    """Rolling hash using prefix sums for O(1) substring hash."""
    
    def __init__(self, s, base=91138233, mod=10**9 + 7):
        self.s = s
        self.n = len(s)
        self.base = base
        self.mod = mod
        self.prefix = [0] * (self.n + 1)
        
        for i in range(self.n):
            self.prefix[i + 1] = (self.prefix[i] * base + ord(s[i])) % mod
    
    def get_hash(self, left, right):
        """Get hash of substring [left, right]."""
        return (
            self.prefix[right + 1] 
            - self.prefix[left] * pow(self.base, right - left + 1, self.mod)
        ) % self.mod
```
````

### 5. 2D Prefix Sum with Updates

For matrices requiring range sum with point updates:

````carousel
```python
class Fenwick2D:
    """2D Fenwick Tree for dynamic range sum queries."""
    
    def __init__(self, matrix):
        self.m = len(matrix)
        self.n = len(matrix[0]) if matrix else 0
        self.tree = [[0] * (self.n + 1) for _ in range(self.m + 1)]
        
        # Build initial tree
        for i in range(self.m):
            for j in range(self.n):
                self._update(i + 1, j + 1, matrix[i][j])
    
    def _update(self, i, j, delta):
        """Update point (i, j) by delta."""
        while i <= self.m:
            row = j
            while row <= self.n:
                self.tree[i][row] += delta
                row += row & -row
            i += i & -i
    
    def _query(self, i, j):
        """Query sum of rectangle (1,1) to (i,j)."""
        result = 0
        while i > 0:
            row = j
            while row > 0:
                result += self.tree[i][row]
                row -= row & -row
            i -= i & -i
        return result
    
    def query(self, row1, col1, row2, col2):
        """Query sum of rectangle (row1, col1) to (row2, col2)."""
        return (
            self._query(row2 + 1, col2 + 1)
            - self._query(row1, col2 + 1)
            - self._query(row2 + 1, col1)
            + self._query(row1, col1)
        )
```
````

---

## Practice Problems

### Problem 1: Range Sum Query - Immutable

**Problem:** [LeetCode 303 - Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/)

**Description:** Given an integer array `nums`, find the sum of the elements between indices `left` and `right` inclusive.

**How to Apply Prefix Sum:**
- Precompute prefix sums in constructor
- Answer each query in O(1) using `prefix[right + 1] - prefix[left]`
- This is the classic use case for prefix sum

---

### Problem 2: Range Sum Query 2D - Immutable

**Problem:** [LeetCode 304 - Range Sum Query 2D - Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable/)

**Description:** Given a 2D matrix `matrix`, find the sum of the elements inside the rectangle defined by its upper left corner `(row1, col1)` and lower right corner `(row2, col2)`.

**How to Apply Prefix Sum:**
- Build 2D prefix sum using inclusion-exclusion
- Answer each query in O(1): `prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1]`
- Essential for multiple rectangle sum queries on static matrices

---

### Problem 3: Subarray Sum Equals K

**Problem:** [LeetCode 560 - Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/)

**Description:** Given an array of integers `nums` and an integer `k`, return the total number of continuous subarrays whose sum equals `k`.

**How to Apply Prefix Sum:**
- Use prefix sum with hashmap to count subarrays with sum k
- For each prefix sum, check if (prefix - k) exists in hashmap
- This transforms O(n²) brute force to O(n)

---

### Problem 4: Product of Array Except Self

**Problem:** [LeetCode 238 - Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)

**Description:** Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.

**How to Apply Prefix Sum Concept:**
- Use prefix product concept (similar to prefix sum)
- Build prefix products from left and suffix products from right
- answer[i] = prefixProd[i-1] * suffixProd[i+1]

---

### Problem 5: Maximum Size Subarray Sum Equals K

**Problem:** [LeetCode 325 - Maximum Size Subarray Sum Equals K](https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/)

**Description:** Given an integer array `nums` and an integer `k`, return the maximum length of a subarray that sums to `k`.

**How to Apply Prefix Sum:**
- Use prefix sum with hashmap storing earliest index
- When prefix[i] - k exists, subarray from that index + 1 to i sums to k
- Track maximum length found

---

## Video Tutorial Links

### Fundamentals

- [Prefix Sum Introduction (Take U Forward)](https://www.youtube.com/watch?v=4R1LfkA3jX4) - Comprehensive introduction to prefix sum
- [Prefix Sum Implementation (WilliamFiset)](https://www.youtube.com/watch?v=8jI4GcjBfM8) - Detailed explanation with visualizations
- [Range Sum Query (LeetCode)](https://www.youtube.com/watch?v=8M5h2eKHGgQ) - Practical implementation guide

### Advanced Topics

- [2D Prefix Sum](https://www.youtube.com/watch?v=J1w2NfYmQfM) - 2D range queries
- [Difference Array](https://www.youtube.com/watch?v=nQMYSyHGKDQ) - Range updates
- [Prefix Sum Variations](https://www.youtube.com/watch?v=6X7fM8G94zI) - XOR, min, max variations

---

## Follow-up Questions

### Q1: What operations can Prefix Sum support besides sum?

**Answer:** Prefix Sum can support any **associative** operation:
- **Sum**: Always works (a + b = b + a, (a + b) + c = a + (b + c))
- **XOR**: Works because a ^ a = 0 and XOR is associative
- **Product**: Works (but watch for overflow)
- **NOT min/max**: Prefix min/max doesn't give range min/max (use Sparse Table)

### Q2: Can Prefix Sum handle range minimum queries?

**Answer:** No, Prefix Sum cannot efficiently handle range minimum queries because:
- Minimum is not invertible: knowing sum(l,r) doesn't help find min(l,r)
- Use **Sparse Table** for O(1) min queries on static arrays
- Use **Segment Tree** for dynamic min queries

### Q3: What is the maximum array size Prefix Sum can handle?

**Answer:** With O(n) space, typical limits are:
- **Memory**: ~800MB → ~10^8 elements (using 8-byte longs)
- **Time**: Build takes O(n) → practical up to ~10^8 elements
- For larger datasets, consider streaming or external memory approaches

### Q4: How do you handle updates in Prefix Sum?

**Answer:** Prefix Sum **does not support efficient updates**. Options:
1. **Rebuild entire prefix**: O(n) per update - not practical for frequent updates
2. **Use Fenwick Tree instead**: O(log n) per query and update
3. **Use Segment Tree**: O(log n) for both query and update

### Q5: How does Prefix Sum compare to 2D Sparse Table?

**Answer:** 
- **Query time**: Both O(1) for sum operations
- **Space**: Both O(n) or O(m×n)
- **Operations**: Prefix Sum only for sums; Sparse Table for idempotent ops
- **Choice**: Use Prefix Sum for sums; Sparse Table for min/max/GCD

---

## Summary

The Prefix Sum is a fundamental and powerful data structure for **static arrays** requiring **fast range sum queries**. Key takeaways:

- **Build once**: O(n) preprocessing, then O(1) queries
- **O(1) query time**: Major advantage over segment tree for sums
- **Simple implementation**: Just cumulative sums in an array
- **Versatile variations**: 2D, XOR, difference array, rolling hash
- **Space efficient**: O(n) vs O(n log n) for sparse table

When to use:
- ✅ Static arrays with many range sum queries
- ✅ When O(1) query time is critical
- ✅ 2D matrix range queries
- ✅ Problems involving subarray sums
- ❌ When array elements change (use Fenwick/Segment Tree)
- ❌ For min/max queries (use Sparse Table or Segment Tree)

This technique is essential for competitive programming and technical interviews, especially in problems involving range queries, subarray problems, and cumulative calculations.

---

## Related Algorithms

- [Sparse Table](./sparse-table.md) - O(1) range min/max queries
- [Segment Tree](./segment-tree.md) - Dynamic range queries
- [Fenwick Tree](./fenwick-tree.md) - Dynamic prefix sums with updates
- [Difference Array](./difference-array.md) - Range updates, point queries
