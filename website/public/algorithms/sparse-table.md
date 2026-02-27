# Sparse Table

## Category
Advanced

## Description

A Sparse Table is a data structure that enables **O(1) range query time** after **O(n log n)** preprocessing for idempotent operations like minimum (RMQ), maximum, GCD, and LCM on static arrays. It leverages the power of precomputation to answer range queries in constant time, making it ideal for scenarios where the array never changes but many queries need to be answered quickly.

---

## When to Use

Use the Sparse Table algorithm when you need to solve problems involving:

- **Static Arrays**: When the array elements don't change after initialization
- **Many Range Queries**: When you need to answer a large number of range queries (minimum, maximum, GCD, etc.)
- **Fast Query Time**: When O(1) query time is critical and preprocessing time is acceptable
- **Idempotent Operations**: When the operation is associative and idempotent (f(f(x,y),z) = f(x,y,z) and f(x,x) = x)

### Comparison with Alternatives

| Data Structure | Build Time | Query Time | Update Time | Supports Dynamic Updates |
|----------------|------------|------------|-------------|--------------------------|
| **Prefix Sum** | O(n) | O(1) | O(n) | ❌ No |
| **Sparse Table** | O(n log n) | O(1) | O(n log n) | ❌ No |
| **Segment Tree** | O(n) | O(log n) | O(log n) | ✅ Yes |
| **Fenwick Tree** | O(n) | O(log n) | O(log n) | ✅ Yes (limited) |

### When to Choose Sparse Table vs Segment Tree

- **Choose Sparse Table** when:
  - The array is completely static (no updates)
  - You need O(1) query time
  - You're only using idempotent operations (min, max, GCD)

- **Choose Segment Tree** when:
  - The array may be updated
  - You need more flexibility in operations
  - You're okay with O(log n) query time

---

## Algorithm Explanation

### Core Concept

The key insight behind the Sparse Table is that any interval can be covered by at most **two precomputed intervals** of powers of two. By precomputing the answer for all intervals whose lengths are powers of two, we can answer any range query by combining just two of these precomputed values.

### How It Works

#### Preprocessing Phase:
- `table[i][j]` = minimum/maximum value in the subarray starting at index `i` with length `2^j`
- Build using dynamic programming: `table[i][j] = func(table[i][j-1], table[i + 2^(j-1)][j-1])`
- This means we combine two overlapping intervals of length `2^(j-1)` to get length `2^j`

#### Query Phase:
For a range `[L, R]`:
1. Find the largest power of 2 that is ≤ length: `k = floor(log2(R - L + 1))`
2. The answer is `func(table[L][k], table[R - 2^k + 1][k])`
3. These two intervals may overlap, but since the operation is idempotent (e.g., min/min, max/max), the overlap doesn't matter

### Visual Representation

For array `[2, 5, 1, 8, 3, 9, 4, 6, 7]`:

```
j=0 (len=1):  [2, 5, 1, 8, 3, 9, 4, 6, 7]
j=1 (len=2):  [2, 1, 1, 3, 3, 4, 4, 6]   ← min(2,5), min(5,1), min(1,8), ...
j=2 (len=4):  [1, 1, 3, 4, 4, 6]         ← min of each 4-element window
j=3 (len=8):  [1, 3]                     ← min of each 8-element window
```

### Why Only Two Intervals?

For any range [L, R] of length `len = R - L + 1`:
- Let `k = floor(log2(len))`
- Then `2^k ≤ len < 2^(k+1)`
- Interval 1: [L, L + 2^k - 1] covers the first `2^k` elements
- Interval 2: [R - 2^k + 1, R] covers the last `2^k` elements
- Together, they cover the entire range [L, R]

### Limitations

- **Only works for idempotent operations**: min, max, GCD, LCM (NOT sum!)
- **Doesn't support updates**: Array must be completely static
- **Higher space complexity**: O(n log n) vs O(n) for segment tree
- **Not suitable for dynamic data**: Any change requires rebuilding the entire table

---

## Algorithm Steps

### Building the Sparse Table

1. **Calculate log values**: Precompute `log2[i]` for all i from 1 to n
2. **Initialize table**: Create a 2D array of size [n][log_n + 1]
3. **Base case**: For j = 0, `table[i][0] = arr[i]` (intervals of length 1)
4. **Build larger intervals**: For j > 0, `table[i][j] = func(table[i][j-1], table[i + 2^(j-1)][j-1])`

### Querying a Range

1. Calculate `length = right - left + 1`
2. Find `k = floor(log2(length))` (largest power of 2 ≤ length)
3. Return `func(table[left][k], table[right - 2^k + 1][k])`

---

## Implementation

### Template Code (Range Minimum/Maximum Query)

````carousel
```python
import math
from typing import List, Callable, Optional

class SparseTable:
    """
    Sparse Table for Range Minimum/Maximum Queries on static arrays.
    
    Time Complexities:
        - Build: O(n log n)
        - Query: O(1)
    
    Space Complexity: O(n log n)
    
    Supports any idempotent operation: min, max, GCD, LCM, etc.
    """
    
    def __init__(self, arr: List[int], func: Callable = min):
        """
        Initialize the Sparse Table.
        
        Args:
            arr: Input array (must be static - no updates)
            func: Idempotent function (min, max, gcd, etc.)
            
        Time: O(n log n)
        Space: O(n log n)
        """
        if not arr:
            self.n = 0
            self.log_n = 0
            self.table = []
            self.log = []
            return
            
        self.n = len(arr)
        self.func = func
        
        # Precompute log2 values for all lengths
        self.log = [0] * (self.n + 1)
        for i in range(2, self.n + 1):
            self.log[i] = self.log[i // 2] + 1
        
        self.log_n = self.log[self.n] + 1
        
        # Build sparse table: table[j][i] = answer for range [i, i + 2^j - 1]
        self.table = [[0] * self.n for _ in range(self.log_n)]
        
        # Base case: intervals of length 1 (2^0 = 1)
        for i in range(self.n):
            self.table[0][i] = arr[i]
        
        # Build table for larger intervals
        for j in range(1, self.log_n):
            for i in range(self.n - (1 << j) + 1):
                self.table[j][i] = self.func(
                    self.table[j-1][i],
                    self.table[j-1][i + (1 << (j-1))]
                )
    
    def query(self, left: int, right: int) -> int:
        """
        Query the value in range [left, right] (inclusive).
        
        Args:
            left: Left index (inclusive), 0-based
            right: Right index (inclusive), 0-based
            
        Returns:
            Minimum/Maximum value in the range
            
        Time: O(1)
        """
        if left < 0 or right >= self.n or left > right:
            raise ValueError(f"Invalid range: [{left}, {right}] for array of size {self.n}")
        
        # Length of the range
        length = right - left + 1
        
        # Largest power of 2 <= length
        k = self.log[length]
        
        # Combine two intervals that cover the entire range
        return self.func(
            self.table[k][left],
            self.table[k][right - (1 << k) + 1]
        )


class SparseTableMin(SparseTable):
    """Sparse Table for Range Minimum Queries."""
    def __init__(self, arr: List[int]):
        super().__init__(arr, min)


class SparseTableMax(SparseTable):
    """Sparse Table for Range Maximum Queries."""
    def __init__(self, arr: List[int]):
        super().__init__(arr, max)


class SparseTableGCD(SparseTable):
    """Sparse Table for Range GCD Queries."""
    def __init__(self, arr: List[int]):
        import math
        super().__init__(arr, math.gcd)


# Example usage and demonstration
if __name__ == "__main__":
    arr = [2, 5, 1, 8, 3, 9, 4, 6, 7]
    
    print(f"Array: {arr}")
    print(f"Array length: {len(arr)}")
    print()
    
    # Create sparse tables for min, max, and GCD
    st_min = SparseTableMin(arr)
    st_max = SparseTableMax(arr)
    st_gcd = SparseTableGCD(arr)
    
    # Query examples
    queries = [(0, 3), (2, 5), (1, 7), (4, 8), (0, 8)]
    
    print("Query Results:")
    print(f"{'Range':<12} {'Elements':<25} {'Min':<5} {'Max':<5} {'GCD':<5}")
    print("-" * 60)
    
    for left, right in queries:
        elements = arr[left:right+1]
        min_val = st_min.query(left, right)
        max_val = st_max.query(left, right)
        gcd_val = st_gcd.query(left, right)
        print(f"[{left},{right}]:      {str(elements):<25} {min_val:<5} {max_val:<5} {gcd_val:<5}")
    
    # Demonstrate the internal table structure
    print("\n" + "="*60)
    print("Sparse Table Structure (showing min values):")
    print("="*60)
    for j in range(st_min.log_n):
        print(f"j={j} (len={1<<j}): {st_min.table[j][:st_min.n - (1<<j) + 1]}")
    
    # Example: How query [2,5] works
    print("\n" + "="*60)
    print("Query [2,5] (elements: [1, 8, 3, 9], length=4, k=2):")
    print("="*60)
    k = 2
    left, right = 2, 5
    print(f"table[{k}][{left}] = table[2][2] = {st_min.table[k][left]}")
    print(f"table[{k}][{right - (1<<k) + 1}] = table[2][{right - (1<<k) + 1}] = {st_min.table[k][right - (1<<k) + 1]}")
    print(f"min({st_min.table[k][left]}, {st_min.table[k][right - (1<<k) + 1]}) = {st_min.query(left, right)} ✓")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

/**
 * Sparse Table for Range Minimum/Maximum Queries on static arrays.
 * 
 * Time Complexities:
 *     - Build: O(n log n)
 *     - Query: O(1)
 * 
 * Space Complexity: O(n log n)
 */
class SparseTable {
private:
    vector<vector<int>> table;
    vector<int> log_;
    int n;
    bool (*func)(int, int);  // Function pointer for min/max/gcd
    
    // Default: min operation
    static int defaultMin(int a, int b) { return min(a, b); }
    
public:
    SparseTable(const vector<int>& arr, bool useMin = true) {
        n = arr.size();
        if (n == 0) return;
        
        func = useMin ? static_cast<int(*)(int,int)>(min) : max;
        
        // Precompute log2 values
        log_.resize(n + 1);
        log_[1] = 0;
        for (int i = 2; i <= n; i++) {
            log_[i] = log_[i/2] + 1;
        }
        
        int logN = log_[n] + 1;
        
        // Build sparse table
        table.resize(logN, vector<int>(n));
        
        // Base case: intervals of length 1
        for (int i = 0; i < n; i++) {
            table[0][i] = arr[i];
        }
        
        // Build for larger intervals
        for (int j = 1; j < logN; j++) {
            for (int i = 0; i + (1 << j) <= n; i++) {
                table[j][i] = min(
                    table[j-1][i],
                    table[j-1][i + (1 << (j-1))]
                );
            }
        }
    }
    
    /**
     * Query minimum/maximum in range [left, right] (inclusive).
     * 
     * Time: O(1)
     */
    int query(int left, int right) const {
        if (left < 0 || right >= n || left > right) {
            throw invalid_argument("Invalid range");
        }
        
        int length = right - left + 1;
        int k = log_[length];
        
        return min(
            table[k][left],
            table[k][right - (1 << k) + 1]
        );
    }
};

// Specialized versions
class SparseTableMin : public SparseTable {
public:
    SparseTableMin(const vector<int>& arr) : SparseTable(arr, true) {}
};

class SparseTableMax : public SparseTable {
public:
    SparseTableMax(const vector<int>& arr) : SparseTable(arr, false) {}
};


int main() {
    vector<int> arr = {2, 5, 1, 8, 3, 9, 4, 6, 7};
    
    cout << "Array: ";
    for (int x : arr) cout << x << " ";
    cout << endl << endl;
    
    // Create sparse tables
    SparseTableMin stMin(arr);
    SparseTableMax stMax(arr);
    
    // Query examples
    vector<pair<int,int>> queries = {{0, 3}, {2, 5}, {1, 7}, {4, 8}};
    
    cout << "Query Results:" << endl;
    cout << "Range      Elements              Min   Max" << endl;
    cout << "------------------------------------------------" << endl;
    
    for (auto [left, right] : queries) {
        cout << "[" << left << "," << right << "]:     ";
        for (int i = left; i <= right; i++) {
            cout << arr[i] << " ";
        }
        // Padding for alignment
        for (int i = right - left + 1; i < 7; i++) cout << " ";
        cout << stMin.query(left, right) << "    " << stMax.query(left, right) << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.Arrays;

/**
 * Sparse Table for Range Minimum/Maximum Queries on static arrays.
 * 
 * Time Complexities:
 *     - Build: O(n log n)
 *     - Query: O(1)
 * 
 * Space Complexity: O(n log n)
 */
public class SparseTable {
    private int[][] table;
    private int[] log_;
    private int n;
    private boolean isMin;  // true for min, false for max
    
    public SparseTable(int[] arr, boolean isMin) {
        if (arr == null || arr.length == 0) {
            this.n = 0;
            this.table = null;
            this.log_ = null;
            return;
        }
        
        this.n = arr.length;
        this.isMin = isMin;
        
        // Precompute log2 values
        log_ = new int[n + 1];
        log_[1] = 0;
        for (int i = 2; i <= n; i++) {
            log_[i] = log_[i / 2] + 1;
        }
        
        int logN = log_[n] + 1;
        
        // Build sparse table
        table = new int[logN][n];
        
        // Base case: intervals of length 1
        for (int i = 0; i < n; i++) {
            table[0][i] = arr[i];
        }
        
        // Build for larger intervals
        for (int j = 1; j < logN; j++) {
            for (int i = 0; i + (1 << j) <= n; i++) {
                int left = table[j-1][i];
                int right = table[j-1][i + (1 << (j-1))];
                table[j][i] = isMin ? Math.min(left, right) : Math.max(left, right);
            }
        }
    }
    
    /**
     * Query minimum/maximum in range [left, right] (inclusive).
     * 
     * Time: O(1)
     */
    public int query(int left, int right) {
        if (left < 0 || right >= n || left > right) {
            throw new IllegalArgumentException("Invalid range: [" + left + ", " + right + "]");
        }
        
        int length = right - left + 1;
        int k = log_[length];
        
        int first = table[k][left];
        int second = table[k][right - (1 << k) + 1];
        
        return isMin ? Math.min(first, second) : Math.max(first, second);
    }
    
    // Convenience constructors
    public SparseTable(int[] arr) {
        this(arr, true);  // Default to min
    }
    
    public static SparseTable createMin(int[] arr) {
        return new SparseTable(arr, true);
    }
    
    public static SparseTable createMax(int[] arr) {
        return new SparseTable(arr, false);
    }
    
    // GCD support
    public static SparseTable createGCD(int[] arr) {
        return new GCDSparseTable(arr);
    }
    
    // GCD Sparse Table
    private static class GCDSparseTable extends SparseTable {
        public GCDSparseTable(int[] arr) {
            super(arr, true);
        }
        
        @Override
        public int query(int left, int right) {
            int result = 0;
            int length = right - left + 1;
            int k = log_[length];
            
            // Override to use GCD instead of min/max
            int first = table[k][left];
            int second = table[k][right - (1 << k) + 1];
            return gcd(first, second);
        }
        
        private int gcd(int a, int b) {
            while (b != 0) {
                int temp = b;
                b = a % b;
                a = temp;
            }
            return a;
        }
    }
    
    public static void main(String[] args) {
        int[] arr = {2, 5, 1, 8, 3, 9, 4, 6, 7};
        
        System.out.print("Array: ");
        System.out.println(Arrays.toString(arr));
        System.out.println();
        
        // Create sparse tables
        SparseTable stMin = SparseTable.createMin(arr);
        SparseTable stMax = SparseTable.createMax(arr);
        
        // Query examples
        int[][] queries = {{0, 3}, {2, 5}, {1, 7}, {4, 8}};
        
        System.out.println("Query Results:");
        System.out.println("Range      Elements         Min   Max");
        System.out.println("----------------------------------------");
        
        for (int[] query : queries) {
            int left = query[0], right = query[1];
            System.out.print("[" + left + "," + right + "]:     ");
            for (int i = left; i <= right; i++) {
                System.out.print(arr[i] + " ");
            }
            System.out.print("  ");
            System.out.print(stMin.query(left, right) + "    " + stMax.query(left, right));
            System.out.println();
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Sparse Table for Range Minimum/Maximum Queries on static arrays.
 * 
 * Time Complexities:
 *     - Build: O(n log n)
 *     - Query: O(1)
 * 
 * Space Complexity: O(n log n)
 */
class SparseTable {
    /**
     * Create a Sparse Table.
     * @param {number[]} arr - Input array (must be static)
     * @param {Function} func - Idempotent function (min, max, Math.gcd)
     */
    constructor(arr, func = Math.min) {
        if (!arr || arr.length === 0) {
            this.n = 0;
            this.table = [];
            this.log = [];
            return;
        }
        
        this.n = arr.length;
        this.func = func;
        
        // Precompute log2 values
        this.log = new Array(this.n + 1).fill(0);
        for (let i = 2; i <= this.n; i++) {
            this.log[i] = this.log[Math.floor(i / 2)] + 1;
        }
        
        const logN = this.log[this.n] + 1;
        
        // Build sparse table: table[j][i] = answer for range [i, i + 2^j - 1]
        this.table = Array.from({ length: logN }, () => new Array(this.n).fill(0));
        
        // Base case: intervals of length 1
        for (let i = 0; i < this.n; i++) {
            this.table[0][i] = arr[i];
        }
        
        // Build for larger intervals
        for (let j = 1; j < logN; j++) {
            for (let i = 0; i + (1 << j) <= this.n; i++) {
                this.table[j][i] = this.func(
                    this.table[j - 1][i],
                    this.table[j - 1][i + (1 << (j - 1))]
                );
            }
        }
    }
    
    /**
     * Query the value in range [left, right] (inclusive).
     * @param {number} left - Left index (inclusive)
     * @param {number} right - Right index (inclusive)
     * @returns {number} Minimum/Maximum value in the range
     * @throws {Error} If range is invalid
     * 
     * Time: O(1)
     */
    query(left, right) {
        if (left < 0 || right >= this.n || left > right) {
            throw new Error(`Invalid range: [${left}, ${right}] for array of size ${this.n}`);
        }
        
        // Length of the range
        const length = right - left + 1;
        
        // Largest power of 2 <= length
        const k = this.log[length];
        
        // Combine two intervals that cover the entire range
        return this.func(
            this.table[k][left],
            this.table[k][right - (1 << k) + 1]
        );
    }
}

// Specialized versions
class SparseTableMin extends SparseTable {
    constructor(arr) {
        super(arr, Math.min);
    }
}

class SparseTableMax extends SparseTable {
    constructor(arr) {
        super(arr, Math.max);
    }
}

// GCD helper function
function gcd(a, b) {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

class SparseTableGCD extends SparseTable {
    constructor(arr) {
        super(arr, gcd);
    }
}


// Example usage and demonstration
const arr = [2, 5, 1, 8, 3, 9, 4, 6, 7];

console.log(`Array: [${arr.join(', ')}]`);
console.log(`Array length: ${arr.length}`);
console.log();

// Create sparse tables
const stMin = new SparseTableMin(arr);
const stMax = new SparseTableMax(arr);
const stGCD = new SparseTableGCD(arr);

// Query examples
const queries = [[0, 3], [2, 5], [1, 7], [4, 8], [0, 8]];

console.log("Query Results:");
console.log(`Range      Elements                Min   Max   GCD`);
console.log("--------------------------------------------------------");

for (const [left, right] of queries) {
    const elements = arr.slice(left, right + 1);
    const minVal = stMin.query(left, right);
    const maxVal = stMax.query(left, right);
    const gcdVal = stGCD.query(left, right);
    console.log(
        `[${left},${right}]:     ${elements.join(' ').padEnd(20)} ${String(minVal).padEnd(5)} ${String(maxVal).padEnd(5)} ${gcdVal}`
    );
}

// Demonstrate the internal table structure
console.log("\n" + "=".60);
console.log("Sparse Table Structure (showing min values):");
console.log("=".60);

const logN = stMin.log[arr.length] + 1;
for (let j = 0; j < logN; j++) {
    const row = stMin.table[j].slice(0, arr.length - (1 << j) + 1);
    console.log(`j=${j} (len=${1 << j}): [${row.join(', ')}]`);
}

// Example: How query [2,5] works
console.log("\n" + "=".60);
console.log("Query [2,5] (elements: [1, 8, 3, 9], length=4, k=2):");
console.log("=".60);
const k = 2;
const [ql, qr] = [2, 5];
console.log(`table[${k}][${ql}] = table[2][2] = ${stMin.table[k][ql]}`);
console.log(`table[${k}][${qr - (1 << k) + 1}] = table[2][${qr - (1 << k) + 1}] = ${stMin.table[k][qr - (1 << k) + 1]}`);
console.log(`min(${stMin.table[k][ql]}, ${stMin.table[k][qr - (1 << k) + 1]}) = ${stMin.query(ql, qr)} ✓`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Preprocessing/Build** | O(n log n) | Need to fill all n × log(n) entries |
| **Query** | O(1) | Just two table lookups and one combine operation |
| **Space** | O(n log n) | Table size is n × (floor(log₂n) + 1) |

### Detailed Breakdown

- **Building the table**: For each level j (0 to log n), we compute n - 2^j + 1 values
  - Total: Σ(n - 2^j + 1) for j=0 to log n = O(n log n)

- **Query**: 
  - Compute k = log₂(length): O(1)
  - Two table lookups: O(1)
  - One combine operation: O(1)
  - Total: O(1)

---

## Space Complexity Analysis

- **Main Table**: O(n log n) - stores n × (log n + 1) integers
- **Log Table**: O(n) - stores log values for quick lookup
- **Total**: O(n log n)

### Space Optimization (Optional)

For very large arrays, consider:
1. **Half-table approach**: Store only half the table if using symmetric operations
2. **Compression**: Use smaller data types if values fit
3. **Disk-based storage**: For extremely large datasets

---

## Common Variations

### 1. Range GCD Query

GCD is also idempotent: `gcd(gcd(a,b),c) = gcd(a,b,c)` and `gcd(a,a) = a`

````carousel
```python
import math

class SparseTableGCD:
    """Sparse Table for Range GCD Queries."""
    
    def __init__(self, arr):
        self.n = len(arr)
        self.log = [0] * (self.n + 1)
        for i in range(2, self.n + 1):
            self.log[i] = self.log[i // 2] + 1
        
        log_n = self.log[self.n] + 1
        self.table = [[0] * self.n for _ in range(log_n)]
        
        for i in range(self.n):
            self.table[0][i] = arr[i]
        
        for j in range(1, log_n):
            for i in range(self.n - (1 << j) + 1):
                self.table[j][i] = math.gcd(
                    self.table[j-1][i],
                    self.table[j-1][i + (1 << (j-1))]
                )
    
    def query(self, left, right):
        length = right - left + 1
        k = self.log[length]
        return math.gcd(
            self.table[k][left],
            self.table[k][right - (1 << k) + 1]
        )
```
````

### 2. Space-Optimized Sparse Table

For applications where space is critical, build the table row by row and discard rows that won't be needed for future queries.

### 3. 2D Sparse Table

For 2D range minimum/maximum queries:

````carousel
```python
class SparseTable2D:
    """2D Sparse Table for matrix range queries."""
    
    def __init__(self, matrix):
        if not matrix or not matrix[0]:
            return
            
        self.n = len(matrix)
        self.m = len(matrix[0])
        
        # Precompute logs
        self.log_n = [0] * (self.n + 1)
        self.log_m = [0] * (self.m + 1)
        
        for i in range(2, max(self.n, self.m) + 1):
            if i <= self.n:
                self.log_n[i] = self.log_n[i // 2] + 1
            if i <= self.m:
                self.log_m[i] = self.log_m[i // 2] + 1
        
        # Build 2D sparse table
        self.st = [[[[0] * (self.m) for _ in range(self.n)] 
                   for _ in range(self.log_n[self.n] + 1)]]
        
        # Base case: j = 0 (vertical 1D sparse tables)
        for i in range(self.n):
            row = []
            for j in range(self.m):
                row.append(matrix[i][j])
            st_row = SparseTableMin(row) if False else None
        
        # ... (full implementation)
    
    def query(self, r1, c1, r2, c2):
        # Query 2D range minimum
        # Similar to 1D but with 4 corners
        pass
```
````

### 4. Sparse Table with Multiple Operations

Build separate tables for min, max, and GCD simultaneously:

````carousel
```python
class MultiSparseTable:
    """Sparse Table supporting multiple operations."""
    
    def __init__(self, arr):
        import math
        self.n = len(arr)
        
        # Log table
        self.log = [0] * (self.n + 1)
        for i in range(2, self.n + 1):
            self.log[i] = self.log[i // 2] + 1
        
        log_n = self.log[self.n] + 1
        
        # Separate tables for each operation
        self.min_table = [[0] * self.n for _ in range(log_n)]
        self.max_table = [[0] * self.n for _ in range(log_n)]
        self.gcd_table = [[0] * self.n for _ in range(log_n)]
        
        for i in range(self.n):
            self.min_table[0][i] = arr[i]
            self.max_table[0][i] = arr[i]
            self.gcd_table[0][i] = arr[i]
        
        for j in range(1, log_n):
            for i in range(self.n - (1 << j) + 1):
                self.min_table[j][i] = min(
                    self.min_table[j-1][i],
                    self.min_table[j-1][i + (1 << (j-1))]
                )
                self.max_table[j][i] = max(
                    self.max_table[j-1][i],
                    self.max_table[j-1][i + (1 << (j-1))]
                )
                self.gcd_table[j][i] = math.gcd(
                    self.gcd_table[j-1][i],
                    self.gcd_table[j-1][i + (1 << (j-1))]
                )
    
    def query_min(self, left, right):
        k = self.log[right - left + 1]
        return min(self.min_table[k][left], 
                   self.min_table[k][right - (1 << k) + 1])
    
    def query_max(self, left, right):
        k = self.log[right - left + 1]
        return max(self.max_table[k][left], 
                   self.max_table[k][right - (1 << k) + 1])
    
    def query_gcd(self, left, right):
        import math
        k = self.log[right - left + 1]
        return math.gcd(self.gcd_table[k][left], 
                        self.gcd_table[k][right - (1 << k) + 1])
```
````

---

## Practice Problems

### Problem 1: Range Minimum Query

**Problem:** [LeetCode 703 - Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/)

**Description:** Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element.

**How to Apply Sparse Table:**
- Build a sparse table on the fixed-size sliding window
- Answer each query in O(1) for the current minimum/maximum
- This is useful when the window size is fixed and queries are frequent

---

### Problem 2: Maximum Gap Problem

**Problem:** [LeetCode 164 - Maximum Gap](https://leetcode.com/problems/maximum-gap/)

**Description:** Given an integer array `nums`, return the maximum absolute difference between any two adjacent elements in the sorted form of `nums`.

**How to Apply Sparse Table:**
- After sorting, use a sparse table to efficiently query maximum gap in any range
- This helps avoid binary search for each query

---

### Problem 3: Array Range Queries

**Problem:** [LeetCode 1526 - Minimum Number of Operations to Make Array Continuous](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous/)

**Description:** An array is continuous if all elements are the same or consecutive integers. Find minimum operations to make the array continuous.

**How to Apply Sparse Table:**
- Sort the array and use sparse table for range max queries
- Efficiently find maximum difference in any window in O(1)

---

### Problem 4: Subarray Minimum/Maximum Queries

**Problem:** [LeetCode 2100 - Find Good Days to Rob the Bank](https://leetcode.com/problems/find-good-days-to-rob-the-bank/)

**Description:** Given an array of security levels and a time parameter, find all indices that are "good" (there are at least `time` days before that are non-increasing and at least `time` days after that are non-decreasing).

**How to Apply Sparse Table:**
- Build two sparse tables: one for range minimum, one for range maximum
- Answer queries in O(1) to check if a position satisfies the condition
- This avoids O(n) scanning for each position

---

### Problem 5: GCD Queries on Array

**Problem:** [LeetCode 2439 - Minimize Maximum of Array](https://leetcode.com/problems/minimize-maximum-of-array/)

**Description:** Minimize the maximum value of the array after applying operations where each operation increments any element by 1 up to a limit.

**How to Apply Sparse Table:**
- Use sparse table with GCD operation to efficiently compute GCD of any subarray
- This helps verify if a candidate answer is achievable in O(1) per check

---

## Video Tutorial Links

### Fundamentals

- [Sparse Table - Introduction (Take U Forward)](https://www.youtube.com/watch?v=2F4r0N2u4vU) - Comprehensive introduction to sparse tables
- [Sparse Table Implementation (WilliamFiset)](https://www.youtube.com/watch?v=zb72gK9jGNY) - Detailed explanation with visualizations
- [Range Minimum Query (RMQ) - Sparse Table (NeetCode)](https://www.youtube.com/watch?v=2W2y2X8X7Qw) - Practical implementation guide

### Advanced Topics

- [2D Sparse Table](https://www.youtube.com/watch?v=xuoQq4f3-Js) - 2D range queries
- [Sparse Table vs Segment Tree](https://www.youtube.com/watch?v=v0dJ4x4Y4cM) - When to use which data structure
- [GCD Sparse Table](https://www.youtube.com/watch?v=3aVPh70xT3M) - GCD queries on ranges

---

## Follow-up Questions

### Q1: What operations can Sparse Table support besides min and max?

**Answer:** Sparse Table can support any **idempotent and associative** operation:
- **Min/Max**: Always works
- **GCD/LCM**: Works because gcd(a,a) = a and gcd is associative
- **Bitwise AND/OR**: Works because a&a=a and a|a=a
- **NOT sum**: Sum is not idempotent (a+a ≠ a)

### Q2: Can Sparse Table handle range sum queries?

**Answer:** No, Sparse Table cannot efficiently handle range sum queries because:
- Sum is not idempotent: sum(a, a) = 2a ≠ a
- The two-interval trick doesn't work
- Use **Prefix Sum** for O(1) sum queries, or **Segment Tree** for dynamic updates

### Q3: What is the maximum array size Sparse Table can handle?

**Answer:** With O(n log n) space, typical limits are:
- **Memory**: ~100MB → ~10^7 elements
- **Time**: Build takes O(n log n) → practical up to ~10^6 elements
- For larger datasets, consider segment tree or external memory approaches

### Q4: How do you handle updates in Sparse Table?

**Answer:** Sparse Table **does not support efficient updates**. Options:
1. **Rebuild entire table**: O(n log n) per update - not practical for frequent updates
2. **Use Segment Tree instead**: O(log n) per query and update
3. **Use Fenwick Tree**: O(log n) for sum queries with updates
4. **Hybrid approach**: Partition array into blocks, rebuild blocks that change

### Q5: How does Sparse Table compare to segment tree in practice?

**Answer:** 
- **Query time**: Sparse Table wins (O(1) vs O(log n))
- **Update time**: Sparse Table loses (O(n log n) vs O(log n))
- **Space**: Sparse Table uses more (O(n log n) vs O(4n))
- **Flexibility**: Segment Tree wins (any operation, dynamic data)
- **Choice**: Use Sparse Table for static arrays with many queries; segment tree for dynamic data

---

## Summary

The Sparse Table is a powerful data structure for **static arrays** requiring **fast range queries** with **idempotent operations**. Key takeaways:

- **Build once**: O(n log n) preprocessing, then O(1) queries
- **O(1) query time**: Major advantage over segment tree
- **Limited operations**: Only works for idempotent operations (min, max, GCD)
- **No updates**: Array must be completely static
- **Space tradeoff**: Uses more memory than segment tree but provides faster queries

When to use:
- ✅ Static arrays with many min/max/GCD queries
- ✅ When O(1) query time is critical
- ❌ When array elements change
- ❌ For sum/product queries (use prefix sum or segment tree)

This data structure is essential for competitive programming and technical interviews, especially in problems involving range minimum/maximum queries on static data.

---

## Related Algorithms

- [Segment Tree](./segment-tree.md) - Dynamic range queries
- [Fenwick Tree](./fenwick-tree.md) - Dynamic prefix sums
- [Prefix Sum](./prefix-sum.md) - Static range sums
- [Binary Lifting](./binary-lifting.md) - Similar preprocessing for ancestor queries
