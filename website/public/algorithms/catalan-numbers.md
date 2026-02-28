# Catalan Numbers

## Category
Math & Number Theory

## Description

The **Catalan numbers** form a sequence of natural numbers that appear in numerous counting problems, often involving recursively-defined objects. The n-th Catalan number `C(n)` counts:

- Valid parentheses sequences with n pairs
- Binary search trees with n nodes
- Full binary trees with n+1 leaves
- Triangulations of a convex (n+2)-gon
- Dyck paths of length 2n
- Ways to correctly match n pairs of brackets
- And many more!

The sequence begins: 1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, ...

---

## When to Use

Use Catalan numbers when counting problems involving:

- **Balanced Parentheses**: Valid sequences of n pairs
- **Binary Trees**: BSTs with n nodes, full binary trees
- **Triangulation**: Ways to triangulate a convex polygon
- **Lattice Paths**: Paths that never cross the diagonal
- **Stack Sorting**: Valid stack permutations
- **Non-crossing Partitions**: Non-intersecting chords in a circle
- **Mountain Ranges**: Up/down paths that don't go below sea level

### Common Pattern

If a problem involves "balanced" structures or "non-crossing" configurations, think Catalan numbers!

---

## Algorithm Explanation

### Formula 1: Recursive Definition

```
C(0) = 1
C(n+1) = Σ C(i) × C(n-i) for i = 0 to n
```

This reflects the recursive structure: split the problem into two smaller independent subproblems.

### Formula 2: Closed Form (Direct)

```
        1     (2n)      (2n)!
C(n) = ─── × (  )  = ───────────
       n+1    ( n )   n!(n+1)!
```

This can be rewritten using binomial coefficients:
```
C(n) = C(2n, n) / (n+1) = C(2n, n) - C(2n, n+1)
```

### Formula 3: Multiplicative Formula

```
           2(2n-1)
C(n) = C(n-1) × ───────
             n+1
```

Efficient for sequential computation.

### Formula 4: Asymptotic

```
        4^n
C(n) ~ ───────
       n^(3/2)√π
```

Grows exponentially but slower than 4^n.

---

## Implementation

### Template Code

````carousel
```python
from math import comb

MOD = 10**9 + 7


def catalan_direct(n: int, mod: int = MOD) -> int:
    """
    Compute n-th Catalan number using direct formula: C(2n,n) / (n+1)
    
    Time Complexity: O(n) or O(1) if using precomputed factorials
    Space Complexity: O(1)
    
    Note: Requires modular inverse for division.
    """
    if n < 0:
        return 0
    
    # C(n) = C(2n, n) / (n+1)
    # Using modular inverse for division
    numerator = comb(2 * n, n) % mod
    inv = pow(n + 1, mod - 2, mod)  # Fermat's little theorem
    
    return (numerator * inv) % mod


def catalan_dp(n: int, mod: int = MOD) -> int:
    """
    Compute Catalan numbers using dynamic programming.
    
    Time Complexity: O(n²)
    Space Complexity: O(n)
    """
    if n < 0:
        return 0
    
    catalan = [0] * (n + 1)
    catalan[0] = 1
    
    for i in range(1, n + 1):
        for j in range(i):
            catalan[i] = (catalan[i] + catalan[j] * catalan[i - 1 - j]) % mod
    
    return catalan[n]


def catalan_iterative(n: int, mod: int = MOD) -> int:
    """
    Compute n-th Catalan number using multiplicative formula.
    
    C(n) = C(n-1) * 2(2n-1) / (n+1)
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    if n < 0:
        return 0
    
    result = 1
    for i in range(1, n + 1):
        # C(i) = C(i-1) * 2(2i-1) / (i+1)
        result = (result * 2 * (2 * i - 1)) % mod
        result = (result * pow(i + 1, mod - 2, mod)) % mod
    
    return result


class CatalanNumbers:
    """
    Precompute Catalan numbers up to max_n for multiple queries.
    """
    
    def __init__(self, max_n: int, mod: int = MOD):
        """
        Time Complexity: O(max_n)
        Space Complexity: O(max_n)
        """
        self.mod = mod
        self.catalan = [0] * (max_n + 1)
        self.catalan[0] = 1
        
        for i in range(1, max_n + 1):
            # C(i) = C(i-1) * 2(2i-1) / (i+1)
            self.catalan[i] = (self.catalan[i - 1] * 2 * (2 * i - 1)) % mod
            self.catalan[i] = (self.catalan[i] * pow(i + 1, mod - 2, mod)) % mod
    
    def get(self, n: int) -> int:
        """Get n-th Catalan number in O(1)."""
        if n > len(self.catalan) - 1:
            raise ValueError(f"n={n} exceeds precomputed max_n={len(self.catalan)-1}")
        return self.catalan[n]


# Applications

def count_valid_parentheses(n: int, mod: int = MOD) -> int:
    """Count valid sequences of n pairs of parentheses."""
    return catalan_iterative(n, mod)


def count_bsts(n: int, mod: int = MOD) -> int:
    """Count unique binary search trees with n distinct nodes."""
    return catalan_iterative(n, mod)


def count_binary_trees(n: int, mod: int = MOD) -> int:
    """Count full binary trees with n+1 leaves (or n internal nodes)."""
    return catalan_iterative(n, mod)


def count_triangulations(n: int, mod: int = MOD) -> int:
    """
    Count ways to triangulate a convex polygon with n+2 vertices.
    
    Args:
        n: Number of triangles (or n+2 vertices, or n sides added)
    """
    return catalan_iterative(n, mod)


def count_dyck_paths(n: int, mod: int = MOD) -> int:
    """
    Count Dyck paths: paths from (0,0) to (2n,0) using steps (1,1) and (1,-1)
    that never go below the x-axis.
    """
    return catalan_iterative(n, mod)


def count_mountain_ranges(n: int, mod: int = MOD) -> int:
    """
    Count mountain ranges with n upstrokes and n downstrokes.
    Equivalent to Dyck paths.
    """
    return catalan_iterative(n, mod)


# Example usage
if __name__ == "__main__":
    # First 10 Catalan numbers
    print("First 10 Catalan numbers:")
    for i in range(10):
        print(f"C({i}) = {catalan_iterative(i)}")
    
    print(f"\nValid parentheses with 3 pairs: {count_valid_parentheses(3)}")  # 5
    print(f"BSTs with 3 nodes: {count_bsts(3)}")  # 5
    print(f"Triangulations of hexagon: {count_triangulations(4)}")  # 14
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

const int MOD = 1e9 + 7;

long long power(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = (result * base) % mod;
        base = (base * base) % mod;
        exp >>= 1;
    }
    return result;
}

/**
 * Multiplicative formula
 * Time: O(n), Space: O(1)
 */
long long catalan(int n, int mod = MOD) {
    if (n < 0) return 0;
    
    long long result = 1;
    for (int i = 1; i <= n; i++) {
        result = (result * 2 * (2 * i - 1)) % mod;
        result = (result * power(i + 1, mod - 2, mod)) % mod;
    }
    return result;
}

/**
 * DP approach using Pascal's triangle
 * Time: O(n²), Space: O(n)
 */
long long catalanDP(int n, int mod = MOD) {
    if (n < 0) return 0;
    
    vector<long long> catalan(n + 1, 0);
    catalan[0] = 1;
    
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            catalan[i] = (catalan[i] + catalan[j] * catalan[i - 1 - j]) % mod;
        }
    }
    
    return catalan[n];
}

/**
 * Using binomial coefficient
 * Time: O(n), Space: O(1)
 */
long long nCr(int n, int r, int mod) {
    if (r < 0 || r > n) return 0;
    r = min(r, n - r);
    
    long long num = 1, den = 1;
    for (int i = 0; i < r; i++) {
        num = (num * (n - i)) % mod;
        den = (den * (i + 1)) % mod;
    }
    return (num * power(den, mod - 2, mod)) % mod;
}

long long catalanBinomial(int n, int mod = MOD) {
    // C(n) = C(2n, n) / (n+1)
    long long c2n_n = nCr(2 * n, n, mod);
    return (c2n_n * power(n + 1, mod - 2, mod)) % mod;
}
```

<!-- slide -->
```java
public class CatalanNumbers {
    private static final int MOD = 1_000_000_007;
    
    private static long power(long base, long exp, long mod) {
        long result = 1;
        while (exp > 0) {
            if ((exp & 1) == 1) result = (result * base) % mod;
            base = (base * base) % mod;
            exp >>= 1;
        }
        return result;
    }
    
    /**
     * Multiplicative formula
     */
    public static long catalan(int n) {
        if (n < 0) return 0;
        
        long result = 1;
        for (int i = 1; i <= n; i++) {
            result = (result * 2 * (2 * i - 1)) % MOD;
            result = (result * power(i + 1, MOD - 2, MOD)) % MOD;
        }
        return result;
    }
    
    /**
     * DP approach
     */
    public static long catalanDP(int n) {
        if (n < 0) return 0;
        
        long[] catalan = new long[n + 1];
        catalan[0] = 1;
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                catalan[i] = (catalan[i] + catalan[j] * catalan[i - 1 - j]) % MOD;
            }
        }
        
        return catalan[n];
    }
    
    /**
     * Precompute for multiple queries
     */
    private long[] precomputed;
    
    public CatalanNumbers(int maxN) {
        precomputed = new long[maxN + 1];
        precomputed[0] = 1;
        
        for (int i = 1; i <= maxN; i++) {
            precomputed[i] = (precomputed[i - 1] * 2 * (2 * i - 1)) % MOD;
            precomputed[i] = (precomputed[i] * power(i + 1, MOD - 2, MOD)) % MOD;
        }
    }
    
    public long get(int n) {
        return precomputed[n];
    }
}
```

<!-- slide -->
```javascript
const MOD = 1000000007;

function power(base, exp, mod) {
    let result = 1n;
    base = BigInt(base) % BigInt(mod);
    exp = BigInt(exp);
    mod = BigInt(mod);
    
    while (exp > 0n) {
        if (exp & 1n) result = (result * base) % mod;
        base = (base * base) % mod;
        exp >>= 1n;
    }
    return Number(result);
}

function catalan(n) {
    if (n < 0) return 0;
    
    let result = 1;
    for (let i = 1; i <= n; i++) {
        result = (result * 2 * (2 * i - 1)) % MOD;
        result = (result * power(i + 1, MOD - 2, MOD)) % MOD;
    }
    return result;
}

function catalanDP(n) {
    if (n < 0) return 0;
    
    const catalan = new Array(n + 1).fill(0);
    catalan[0] = 1;
    
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            catalan[i] = (catalan[i] + catalan[j] * catalan[i - 1 - j]) % MOD;
        }
    }
    
    return catalan[n];
}

// Precomputation class
class CatalanNumbers {
    constructor(maxN) {
        this.precomputed = new Array(maxN + 1);
        this.precomputed[0] = 1;
        
        for (let i = 1; i <= maxN; i++) {
            this.precomputed[i] = (this.precomputed[i - 1] * 2 * (2 * i - 1)) % MOD;
            this.precomputed[i] = (this.precomputed[i] * power(i + 1, MOD - 2, MOD)) % MOD;
        }
    }
    
    get(n) {
        return this.precomputed[n];
    }
}

// Example
console.log(catalan(5));  // 42
console.log(catalan(10)); // 16796
```
````

---

## Applications with Examples

### 1. Valid Parentheses

```python
def generate_parentheses(n):
    """Generate all valid parentheses combinations."""
    result = []
    
    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:
            result.append(current)
            return
        
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)
    
    backtrack('', 0, 0)
    return result

# C(3) = 5: ((())), (()()), (())(), ()(()), ()()()
```

### 2. Binary Search Trees

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def generate_trees(n):
    """Generate all structurally unique BSTs with values 1..n."""
    def build(start, end):
        if start > end:
            return [None]
        
        all_trees = []
        for root_val in range(start, end + 1):
            left_trees = build(start, root_val - 1)
            right_trees = build(root_val + 1, end)
            
            for left in left_trees:
                for right in right_trees:
                    root = TreeNode(root_val)
                    root.left = left
                    root.right = right
                    all_trees.append(root)
        
        return all_trees
    
    return build(1, n) if n > 0 else []
```

### 3. Dyck Paths

```python
def count_dyck_paths(n):
    """
    Count paths from (0,0) to (2n,0) using steps U=(1,1) and D=(1,-1)
    that never go below the x-axis.
    """
    return catalan_iterative(n)

# C(3) = 5 paths:
# UUUDDD, UUDUDD, UUDDUD, UDUUDD, UDUDUD
```

---

## Time & Space Complexity

| Method | Time | Space | Notes |
|--------|------|-------|-------|
| Multiplicative | O(n) | O(1) | Best for single query |
| DP | O(n²) | O(n) | Shows recursive structure |
| Binomial | O(n) | O(1) | Requires nCr computation |
| Precompute | O(max_n) | O(max_n) | Best for multiple queries |

---

## Practice Problems

### Problem 1: Unique Binary Search Trees
**Problem**: [LeetCode 96 - Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees/)

**Solution**: Direct Catalan number computation.

### Problem 2: Generate Parentheses
**Problem**: [LeetCode 22 - Generate Parentheses](https://leetcode.com/problems/generate-parentheses/)

**Solution**: Backtracking with Catalan count verification.

### Problem 3: Unique Binary Search Trees II
**Problem**: [LeetCode 95 - Unique Binary Search Trees II](https://leetcode.com/problems/unique-binary-search-trees-ii/)

**Solution**: Generate all trees using recursive structure.

### Problem 4: Minimum Score Triangulation
**Problem**: [LeetCode 1039 - Minimum Score Triangulation of Polygon](https://leetcode.com/problems/minimum-score-triangulation-of-polygon/)

**Solution**: DP with Catalan-like structure.

---

## Follow-up Questions

### Q1: Why is the recursive formula C(n) = Σ C(i)×C(n-1-i)?

**Answer**: This reflects the "first return to axis" decomposition. For Dyck paths, find where the path first returns to the x-axis, splitting it into two independent smaller paths.

### Q2: What's the connection between Catalan numbers and the central binomial coefficient?

**Answer**: `C(n) = C(2n,n) / (n+1)`. The division by (n+1) accounts for the constraint of never going below the diagonal.

### Q3: Can Catalan numbers be negative?

**Answer**: No, all Catalan numbers are positive integers for n ≥ 0.

### Q4: How large can n be before overflow?

**Answer**: Without modulo, C(19) ≈ 1.7×10^9 exceeds 32-bit int. C(34) exceeds 64-bit. Always use modulo for n > 20.

---

## Summary

Catalan numbers appear in numerous counting problems involving:
- Balanced structures
- Recursive decompositions
- Non-crossing configurations

**Key formulas:**
1. `C(n) = C(2n,n) / (n+1)` - Direct
2. `C(n) = C(n-1) × 2(2n-1) / (n+1)` - Multiplicative
3. `C(n) = Σ C(i)×C(n-1-i)` - Recursive

**When to suspect Catalan:** Problems involving balanced parentheses, binary trees, triangulations, or non-crossing paths.

---

## Related Algorithms

- [Binomial Coefficients](./ncr-binomial.md) - Direct relationship with Catalan
- [Dynamic Programming](./dynamic-programming.md) - Recursive structure
- [Backtracking](./backtracking.md) - Generate all valid configurations