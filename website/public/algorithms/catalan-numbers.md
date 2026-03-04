# Catalan Numbers

## Category
Math & Number Theory

## Description

The **Catalan numbers** form a sequence of natural numbers that appear in numerous counting problems, often involving recursively-defined objects. Named after the Belgian mathematician Eugène Charles Catalan, these numbers have remarkable properties and appear in diverse areas of mathematics and computer science.

The n-th Catalan number `C(n)` counts:

| Application | Description | Example C(3) |
|-------------|-------------|--------------|
| **Valid Parentheses** | Sequences of n pairs of balanced parentheses | `((())), (()()), (())(), ()(()), ()()()` = 5 |
| **Binary Search Trees** | Unique BSTs that can be built with n distinct nodes | 5 different tree structures |
| **Full Binary Trees** | Full binary trees with n+1 leaves | 5 trees |
| **Polygon Triangulation** | Ways to triangulate a convex (n+2)-gon | 14 ways for hexagon |
| **Dyck Paths** | Lattice paths from (0,0) to (2n,0) that never go below x-axis | 5 paths |
| **Stack Sorting** | Valid stack permutations of n elements | 5 permutations |
| **Non-crossing Partitions** | Ways to draw non-intersecting chords in a circle with 2n points | 5 configurations |
| **Mountain Ranges** | Up/down paths that never go below sea level | 5 ranges |

The sequence begins: **1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, 16796, 58786, ...**

---

## When to Use

Use Catalan numbers when solving counting problems involving:

### Common Problem Patterns

- **Balanced Structures**: Parentheses, brackets, or other symbols that must be properly nested
- **Binary Tree Enumeration**: Counting tree structures or traversal sequences
- **Triangulation Problems**: Dividing polygons into triangles
- **Lattice Path Counting**: Paths with constraints (staying above diagonal)
- **Stack Operations**: Valid sequences of push and pop operations
- **Non-crossing Configurations**: Geometric arrangements where elements don't intersect
- **Recursive Decompositions**: Problems that split into two independent subproblems

### Comparison: Catalan vs Other Counting Methods

| Problem Type | Formula | Example |
|--------------|---------|---------|
| **Unrestricted binary trees** | n! permutations | 6 for n=3 |
| **Binary search trees** | C(n) Catalan | 5 for n=3 |
| **All parentheses** | 2^(2n) combinations | 64 for n=3 |
| **Valid parentheses** | C(n) Catalan | 5 for n=3 |
| **All polygon triangulations** | Non-Catalan | Varies |
| **Convex polygon triangulations** | C(n-2) Catalan | 5 for pentagon |

### How to Recognize Catalan Problems

Look for these key indicators:

1. **The answer is independent of the specific values** - only depends on n
2. **The problem involves "balance" or "non-crossing"** constraints
3. **Recursive decomposition** into two independent subproblems
4. **The answer grows as approximately 4^n/n^(3/2)**
5. **Sample answers match Catalan sequence**: 1, 1, 2, 5, 14, 42...

---

## Algorithm Explanation

### Core Concepts

#### 1. The Recursive Structure

The fundamental insight behind Catalan numbers is that problems they solve often decompose recursively into two independent subproblems:

```
For valid parentheses:
( [inside] ) [outside]
  ↓            ↓
 C(k)      ×   C(n-1-k)
```

The "inside" contains k pairs of parentheses, and the "outside" contains n-1-k pairs.

#### 2. Mathematical Formulations

**Formula 1: Recursive Definition (Convolution)**

```
C(0) = 1
C(n+1) = Σ C(i) × C(n-i) for i = 0 to n
```

This is the **Catalan recurrence** - it expresses each Catalan number as the sum of products of smaller Catalan numbers.

**Formula 2: Closed Form (Binomial)**

```
         1     (2n)      (2n)!
C(n) = ─── × (  )  = ───────────
        n+1    ( n )   n!(n+1)!
```

This formula shows that Catalan numbers are closely related to **central binomial coefficients**.

Alternative form:
```
C(n) = C(2n, n) - C(2n, n+1)
```

This form highlights that C(n) counts the "good" paths minus the "bad" paths in lattice path problems.

**Formula 3: Multiplicative Formula (Sequential)**

```
            2(2n-1)
C(n) = C(n-1) × ───────
              n+1
```

Efficient for computing successive Catalan numbers iteratively.

**Formula 4: Asymptotic Growth**

```
         4^n
C(n) ~ ───────
        n^(3/2)√π
```

This shows Catalan numbers grow exponentially (~4^n) but with a polynomial factor that slows the growth.

### Visual Representations

#### Valid Parentheses Enumeration (n=3, C(3)=5)

```
1. ((()))   - fully nested
2. (()())   - nested, then adjacent
3. (())()   - one pair nested, one separate
4. ()(())   - one separate, one nested
5. ()()()   - all separate
```

#### Binary Search Trees (n=3, C(3)=5)

```
    1           1           2           3           3
     \           \         / \         /           /
      2           3       1   3       1           2
       \         /                   \         /
        3       2                     2       1

Tree 1    Tree 2    Tree 3    Tree 4    Tree 5
```

#### Dyck Paths (n=3, C(3)=5)

```
    /
   /  \      /
  /    \    /  \      /
 /      \  /    \    /  \      /
/        \/      \  /    \    /  \    /
----------
UUUDDD   UUDUDD   UUDDUD   UDUUDD   UDUDUD

Path 1   Path 2   Path 3   Path 4   Path 5
(U=up, D=down)
```

#### Polygon Triangulation (n=3, C(3)=5 ways to triangulate pentagon)

```
    1                    1                    1
   / \                  /|\                  /|\
  /   \                / | \                / | \
 5-----2              5--|--2              5--|--2
 |     |              |  |  |              |\ |  |
 |     |      →       |  |  |      or     | \|  |
 |     |              |  |  |              |  |\ |
 4-----3              4--|--3              4--|--3
                      All diagonals       Different
                      from vertex 1       configurations
```

### Why Divide by (n+1)?

In the binomial coefficient formula:
- C(2n, n) counts all paths from (0,0) to (2n, 0)
- The "bad" paths (those that go below the x-axis) correspond to paths from (0,-2) to (2n,0)
- By the **reflection principle**, there are C(2n, n+1) bad paths
- Good paths = Total - Bad = C(2n, n) - C(2n, n+1) = C(2n, n) / (n+1)

---

## Algorithm Steps

### Computing Catalan Numbers

#### Method 1: Dynamic Programming (Recursive Structure)

1. **Initialize**: Set `catalan[0] = 1`
2. **Iterate**: For i from 1 to n:
   - Set `catalan[i] = 0`
   - For j from 0 to i-1:
     - `catalan[i] += catalan[j] * catalan[i-1-j]`
3. **Return**: `catalan[n]`

#### Method 2: Multiplicative Formula

1. **Initialize**: Set `result = 1` (C(0))
2. **Iterate**: For i from 1 to n:
   - `result = result * 2 * (2*i - 1)`
   - `result = result / (i + 1)` (using modular inverse if needed)
3. **Return**: `result`

#### Method 3: Binomial Coefficient

1. **Compute**: Calculate `C(2n, n)` using binomial formula
2. **Divide**: Return `C(2n, n) / (n + 1)` (using modular inverse)

#### Method 4: Precomputation for Multiple Queries

1. **Initialize array**: `catalan[0..max_n]` with `catalan[0] = 1`
2. **Fill iteratively**: For i from 1 to max_n:
   - `catalan[i] = catalan[i-1] * 2 * (2*i - 1) / (i + 1)`
3. **Query**: Return `catalan[n]` in O(1)

---

## Implementation

### Template Code (Multiple Approaches)

````carousel
```python
from math import comb
from typing import List

MOD = 10**9 + 7


def catalan_direct(n: int, mod: int = MOD) -> int:
    """
    Compute n-th Catalan number using direct formula: C(2n,n) / (n+1)
    
    Uses the binomial coefficient formula with modular inverse for division.
    
    Time Complexity: O(n) for computing binomial
    Space Complexity: O(1)
    
    Args:
        n: The index of Catalan number to compute (0-indexed)
        mod: Modulus for result (default 10^9+7)
    
    Returns:
        C(n) mod mod
    """
    if n < 0:
        return 0
    if n == 0:
        return 1
    
    # C(n) = C(2n, n) / (n+1)
    # Using modular inverse for division
    numerator = comb(2 * n, n) % mod
    inv = pow(n + 1, mod - 2, mod)  # Fermat's little theorem for modular inverse
    
    return (numerator * inv) % mod


def catalan_dp(n: int, mod: int = MOD) -> int:
    """
    Compute Catalan numbers using dynamic programming with recurrence.
    
    C(n) = sum of C(i) * C(n-1-i) for i = 0 to n-1
    
    Time Complexity: O(n²)
    Space Complexity: O(n)
    
    Args:
        n: The index of Catalan number to compute
        mod: Modulus for result
    
    Returns:
        C(n) mod mod
    """
    if n < 0:
        return 0
    
    catalan = [0] * (n + 1)
    catalan[0] = 1
    
    # Fill using recurrence: C(i) = sum(C(j) * C(i-1-j))
    for i in range(1, n + 1):
        for j in range(i):
            catalan[i] = (catalan[i] + catalan[j] * catalan[i - 1 - j]) % mod
    
    return catalan[n]


def catalan_iterative(n: int, mod: int = MOD) -> int:
    """
    Compute n-th Catalan number using multiplicative formula.
    
    C(n) = C(n-1) * 2(2n-1) / (n+1)
    
    This is the most efficient method for single queries.
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    
    Args:
        n: The index of Catalan number to compute
        mod: Modulus for result
    
    Returns:
        C(n) mod mod
    """
    if n < 0:
        return 0
    
    result = 1  # C(0) = 1
    for i in range(1, n + 1):
        # C(i) = C(i-1) * 2(2i-1) / (i+1)
        result = (result * 2 * (2 * i - 1)) % mod
        result = (result * pow(i + 1, mod - 2, mod)) % mod
    
    return result


class CatalanNumbers:
    """
    Precompute Catalan numbers up to max_n for multiple queries.
    
    Most efficient when answering many queries with different n values.
    
    Time Complexity: O(max_n) for precomputation, O(1) per query
    Space Complexity: O(max_n)
    """
    
    def __init__(self, max_n: int, mod: int = MOD):
        """
        Precompute all Catalan numbers from C(0) to C(max_n).
        
        Args:
            max_n: Maximum n value needed
            mod: Modulus for all calculations
        """
        self.mod = mod
        self.catalan = [0] * (max_n + 1)
        self.catalan[0] = 1
        
        for i in range(1, max_n + 1):
            # C(i) = C(i-1) * 2(2i-1) / (i+1)
            self.catalan[i] = (self.catalan[i - 1] * 2 * (2 * i - 1)) % mod
            self.catalan[i] = (self.catalan[i] * pow(i + 1, mod - 2, mod)) % mod
    
    def get(self, n: int) -> int:
        """
        Get n-th Catalan number in O(1).
        
        Args:
            n: Index of Catalan number (0 <= n <= max_n)
        
        Returns:
            C(n) mod mod
        
        Raises:
            ValueError: If n exceeds max_n
        """
        if n > len(self.catalan) - 1:
            raise ValueError(f"n={n} exceeds precomputed max_n={len(self.catalan)-1}")
        if n < 0:
            return 0
        return self.catalan[n]
    
    def get_all(self) -> List[int]:
        """Return all precomputed Catalan numbers."""
        return self.catalan.copy()


# ============ APPLICATION FUNCTIONS ============

def count_valid_parentheses(n: int, mod: int = MOD) -> int:
    """
    Count valid sequences of n pairs of parentheses.
    
    Example: n=3 → 5 valid sequences: ((())), (()()), (())(), ()(()), ()()()
    """
    return catalan_iterative(n, mod)


def count_bsts(n: int, mod: int = MOD) -> int:
    """
    Count unique binary search trees with n distinct nodes.
    
    Example: n=3 → 5 different BST structures
    """
    return catalan_iterative(n, mod)


def count_full_binary_trees(n: int, mod: int = MOD) -> int:
    """
    Count full binary trees with n+1 leaves (or n internal nodes).
    
    A full binary tree is where every node has 0 or 2 children.
    """
    return catalan_iterative(n, mod)


def count_triangulations(vertices: int, mod: int = MOD) -> int:
    """
    Count ways to triangulate a convex polygon.
    
    Args:
        vertices: Number of vertices in the polygon
    
    Returns:
        Number of triangulation ways = C(vertices - 2)
    
    Example: Pentagon (5 vertices) → C(3) = 5 ways
             Hexagon (6 vertices) → C(4) = 14 ways
    """
    if vertices < 3:
        return 0
    return catalan_iterative(vertices - 2, mod)


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


def count_stack_permutations(n: int, mod: int = MOD) -> int:
    """
    Count valid permutations of [1..n] achievable using a stack.
    
    Input: 1,2,3,...,n pushed in order
    Output: Count of valid pop sequences
    """
    return catalan_iterative(n, mod)


# ============ GENERATION FUNCTIONS ============

def generate_parentheses(n: int) -> List[str]:
    """
    Generate all valid parentheses combinations using backtracking.
    
    Time Complexity: O(C(n) * n) - generate C(n) strings of length 2n
    Space Complexity: O(C(n) * n) to store results
    """
    result = []
    
    def backtrack(current: str, open_count: int, close_count: int):
        if len(current) == 2 * n:
            result.append(current)
            return
        
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)
    
    backtrack('', 0, 0)
    return result


# ============ EXAMPLE USAGE ============

if __name__ == "__main__":
    print("=" * 60)
    print("CATALAN NUMBERS DEMONSTRATION")
    print("=" * 60)
    
    # First 10 Catalan numbers
    print("\nFirst 10 Catalan numbers:")
    for i in range(10):
        print(f"  C({i}) = {catalan_iterative(i)}")
    
    # Verify with different methods
    print("\nVerification (all methods should match):")
    for i in range(8):
        direct = catalan_direct(i)
        dp = catalan_dp(i)
        iterative = catalan_iterative(i)
        match = "✓" if direct == dp == iterative else "✗"
        print(f"  C({i}): Direct={direct}, DP={dp}, Iter={iterative} {match}")
    
    # Applications
    print("\n" + "=" * 60)
    print("APPLICATIONS")
    print("=" * 60)
    
    print(f"\nValid parentheses with 3 pairs: {count_valid_parentheses(3)}")
    print("  All combinations:")
    for combo in generate_parentheses(3):
        print(f"    {combo}")
    
    print(f"\nBSTs with 3 nodes: {count_bsts(3)}")
    print(f"Triangulations of hexagon (6 vertices): {count_triangulations(6)}")
    print(f"Dyck paths of length 6: {count_dyck_paths(3)}")
    print(f"Mountain ranges with 4 strokes: {count_mountain_ranges(4)}")
    print(f"Stack permutations of 4 elements: {count_stack_permutations(4)}")
    
    # Precomputation example
    print("\n" + "=" * 60)
    print("PRECOMPUTATION EXAMPLE")
    print("=" * 60)
    catalan_pre = CatalanNumbers(20)
    print(f"Precomputed C(0) to C(20)")
    print(f"C(15) = {catalan_pre.get(15)}")
    print(f"C(20) = {catalan_pre.get(20)}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
using namespace std;

const int MOD = 1e9 + 7;

/**
 * Modular exponentiation
 * Time: O(log exp)
 */
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
 * Compute n-th Catalan number using multiplicative formula
 * C(n) = C(n-1) * 2(2n-1) / (n+1)
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
long long catalan(int n, int mod = MOD) {
    if (n < 0) return 0;
    
    long long result = 1;  // C(0) = 1
    for (int i = 1; i <= n; i++) {
        result = (result * 2 * (2 * i - 1)) % mod;
        result = (result * power(i + 1, mod - 2, mod)) % mod;
    }
    return result;
}

/**
 * DP approach using Catalan recurrence
 * C(n) = sum(C(i) * C(n-1-i)) for i = 0 to n-1
 * 
 * Time Complexity: O(n²)
 * Space Complexity: O(n)
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
 * Binomial coefficient using multiplicative formula
 * Time: O(r)
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

/**
 * Catalan using binomial coefficient: C(n) = C(2n,n) / (n+1)
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
long long catalanBinomial(int n, int mod = MOD) {
    if (n < 0) return 0;
    long long c2n_n = nCr(2 * n, n, mod);
    return (c2n_n * power(n + 1, mod - 2, mod)) % mod;
}

/**
 * Precompute all Catalan numbers up to maxN
 * Time Complexity: O(maxN) for precomputation
 * Space Complexity: O(maxN)
 */
class CatalanNumbers {
private:
    vector<long long> precomputed;
    int mod;
    
public:
    CatalanNumbers(int maxN, int m = MOD) : mod(m) {
        precomputed.resize(maxN + 1);
        precomputed[0] = 1;
        
        for (int i = 1; i <= maxN; i++) {
            precomputed[i] = (precomputed[i - 1] * 2 * (2 * i - 1)) % mod;
            precomputed[i] = (precomputed[i] * power(i + 1, mod - 2, mod)) % mod;
        }
    }
    
    long long get(int n) const {
        if (n < 0 || n >= (int)precomputed.size()) return 0;
        return precomputed[n];
    }
    
    const vector<long long>& getAll() const {
        return precomputed;
    }
};

/**
 * Generate all valid parentheses combinations
 */
void generateParenthesesHelper(int n, int open, int close, string current, vector<string>& result) {
    if ((int)current.length() == 2 * n) {
        result.push_back(current);
        return;
    }
    
    if (open < n) {
        generateParenthesesHelper(n, open + 1, close, current + '(', result);
    }
    
    if (close < open) {
        generateParenthesesHelper(n, open, close + 1, current + ')', result);
    }
}

vector<string> generateParentheses(int n) {
    vector<string> result;
    generateParenthesesHelper(n, 0, 0, "", result);
    return result;
}

// Application functions
long long countValidParentheses(int n) { return catalan(n); }
long long countBSTs(int n) { return catalan(n); }
long long countTriangulations(int vertices) { 
    return vertices < 3 ? 0 : catalan(vertices - 2); 
}

int main() {
    cout << "First 10 Catalan numbers:" << endl;
    for (int i = 0; i < 10; i++) {
        cout << "C(" << i << ") = " << catalan(i) << endl;
    }
    
    cout << "\nVerification (all methods match for C(5)=42):" << endl;
    cout << "Multiplicative: " << catalan(5) << endl;
    cout << "DP: " << catalanDP(5) << endl;
    cout << "Binomial: " << catalanBinomial(5) << endl;
    
    cout << "\nValid parentheses with n=3:" << endl;
    auto parens = generateParentheses(3);
    for (const auto& p : parens) {
        cout << "  " << p << endl;
    }
    
    cout << "\nBSTs with 3 nodes: " << countBSTs(3) << endl;
    cout << "Hexagon triangulations: " << countTriangulations(6) << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;

/**
 * Catalan Numbers implementation in Java
 * Includes multiple computation methods and applications
 */
public class CatalanNumbers {
    private static final int MOD = 1_000_000_007;
    
    /**
     * Modular exponentiation using binary exponentiation
     * Time: O(log exp)
     */
    private static long power(long base, long exp, long mod) {
        long result = 1;
        base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = (result * base) % mod;
            base = (base * base) % mod;
            exp >>= 1;
        }
        return result;
    }
    
    /**
     * Multiplicative formula: C(n) = C(n-1) * 2(2n-1) / (n+1)
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    public static long catalan(int n) {
        if (n < 0) return 0;
        
        long result = 1;  // C(0) = 1
        for (int i = 1; i <= n; i++) {
            result = (result * 2 * (2 * i - 1)) % MOD;
            result = (result * power(i + 1, MOD - 2, MOD)) % MOD;
        }
        return result;
    }
    
    /**
     * DP approach using recurrence relation
     * C(n) = sum(C(i) * C(n-1-i)) for i = 0 to n-1
     * Time Complexity: O(n²)
     * Space Complexity: O(n)
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
     * Compute binomial coefficient C(n,r)
     * Time Complexity: O(r)
     */
    private static long nCr(int n, int r) {
        if (r < 0 || r > n) return 0;
        r = Math.min(r, n - r);
        
        long num = 1, den = 1;
        for (int i = 0; i < r; i++) {
            num = (num * (n - i)) % MOD;
            den = (den * (i + 1)) % MOD;
        }
        return (num * power(den, MOD - 2, MOD)) % MOD;
    }
    
    /**
     * Catalan using binomial coefficient formula
     * C(n) = C(2n,n) / (n+1)
     * Time Complexity: O(n)
     */
    public static long catalanBinomial(int n) {
        if (n < 0) return 0;
        long c2n_n = nCr(2 * n, n);
        return (c2n_n * power(n + 1, MOD - 2, MOD)) % MOD;
    }
    
    /**
     * Precompute Catalan numbers for multiple queries
     */
    public static class CatalanPrecomputer {
        private final long[] precomputed;
        private final int mod;
        
        public CatalanPrecomputer(int maxN) {
            this(maxN, MOD);
        }
        
        public CatalanPrecomputer(int maxN, int mod) {
            this.mod = mod;
            this.precomputed = new long[maxN + 1];
            this.precomputed[0] = 1;
            
            for (int i = 1; i <= maxN; i++) {
                precomputed[i] = (precomputed[i - 1] * 2 * (2 * i - 1)) % mod;
                precomputed[i] = (precomputed[i] * power(i + 1, mod - 2, mod)) % mod;
            }
        }
        
        public long get(int n) {
            if (n < 0 || n >= precomputed.length) return 0;
            return precomputed[n];
        }
        
        public long[] getAll() {
            return precomputed.clone();
        }
    }
    
    // Application methods
    public static long countValidParentheses(int n) {
        return catalan(n);
    }
    
    public static long countBSTs(int n) {
        return catalan(n);
    }
    
    public static long countFullBinaryTrees(int n) {
        return catalan(n);
    }
    
    public static long countTriangulations(int vertices) {
        return vertices < 3 ? 0 : catalan(vertices - 2);
    }
    
    public static long countDyckPaths(int n) {
        return catalan(n);
    }
    
    /**
     * Generate all valid parentheses combinations
     */
    public static List<String> generateParentheses(int n) {
        List<String> result = new ArrayList<>();
        generateParenthesesHelper(n, 0, 0, new StringBuilder(), result);
        return result;
    }
    
    private static void generateParenthesesHelper(int n, int open, int close, 
                                                   StringBuilder current, List<String> result) {
        if (current.length() == 2 * n) {
            result.add(current.toString());
            return;
        }
        
        if (open < n) {
            current.append('(');
            generateParenthesesHelper(n, open + 1, close, current, result);
            current.deleteCharAt(current.length() - 1);
        }
        
        if (close < open) {
            current.append(')');
            generateParenthesesHelper(n, open, close + 1, current, result);
            current.deleteCharAt(current.length() - 1);
        }
    }
    
    public static void main(String[] args) {
        System.out.println("First 10 Catalan numbers:");
        for (int i = 0; i < 10; i++) {
            System.out.println("C(" + i + ") = " + catalan(i));
        }
        
        System.out.println("\nVerification (C(5) should be 42):");
        System.out.println("Multiplicative: " + catalan(5));
        System.out.println("DP: " + catalanDP(5));
        System.out.println("Binomial: " + catalanBinomial(5));
        
        System.out.println("\nValid parentheses with n=3:");
        List<String> parens = generateParentheses(3);
        for (String p : parens) {
            System.out.println("  " + p);
        }
        
        System.out.println("\nApplications:");
        System.out.println("BSTs with 3 nodes: " + countBSTs(3));
        System.out.println("Hexagon triangulations: " + countTriangulations(6));
        System.out.println("Dyck paths of length 6: " + countDyckPaths(3));
        
        // Precomputation demo
        CatalanPrecomputer pre = new CatalanPrecomputer(20);
        System.out.println("\nPrecomputed C(15): " + pre.get(15));
        System.out.println("Precomputed C(20): " + pre.get(20));
    }
}
```

<!-- slide -->
```javascript
/**
 * Catalan Numbers implementation in JavaScript
 * Includes multiple computation methods and applications
 */

const MOD = 1000000007;

/**
 * Modular exponentiation
 * Time: O(log exp)
 */
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

/**
 * Compute n-th Catalan number using multiplicative formula
 * C(n) = C(n-1) * 2(2n-1) / (n+1)
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function catalan(n, mod = MOD) {
    if (n < 0) return 0;
    
    let result = 1;  // C(0) = 1
    for (let i = 1; i <= n; i++) {
        result = (result * 2 * (2 * i - 1)) % mod;
        result = (result * power(i + 1, mod - 2, mod)) % mod;
    }
    return result;
}

/**
 * DP approach using recurrence
 * C(n) = sum(C(i) * C(n-1-i))
 * Time Complexity: O(n²)
 * Space Complexity: O(n)
 */
function catalanDP(n, mod = MOD) {
    if (n < 0) return 0;
    
    const catalan = new Array(n + 1).fill(0);
    catalan[0] = 1;
    
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            catalan[i] = (catalan[i] + catalan[j] * catalan[i - 1 - j]) % mod;
        }
    }
    
    return catalan[n];
}

/**
 * Binomial coefficient helper
 */
function nCr(n, r, mod) {
    if (r < 0 || r > n) return 0;
    r = Math.min(r, n - r);
    
    let num = 1, den = 1;
    for (let i = 0; i < r; i++) {
        num = (num * (n - i)) % mod;
        den = (den * (i + 1)) % mod;
    }
    return (num * power(den, mod - 2, mod)) % mod;
}

/**
 * Catalan using binomial coefficient
 * C(n) = C(2n,n) / (n+1)
 */
function catalanBinomial(n, mod = MOD) {
    if (n < 0) return 0;
    const c2n_n = nCr(2 * n, n, mod);
    return (c2n_n * power(n + 1, mod - 2, mod)) % mod;
}

/**
 * Precompute Catalan numbers for multiple queries
 */
class CatalanPrecomputer {
    constructor(maxN, mod = MOD) {
        this.mod = mod;
        this.precomputed = new Array(maxN + 1);
        this.precomputed[0] = 1;
        
        for (let i = 1; i <= maxN; i++) {
            this.precomputed[i] = (this.precomputed[i - 1] * 2 * (2 * i - 1)) % mod;
            this.precomputed[i] = (this.precomputed[i] * power(i + 1, mod - 2, mod)) % mod;
        }
    }
    
    get(n) {
        if (n < 0 || n >= this.precomputed.length) return 0;
        return this.precomputed[n];
    }
    
    getAll() {
        return [...this.precomputed];
    }
}

/**
 * Generate all valid parentheses combinations
 */
function generateParentheses(n) {
    const result = [];
    
    function backtrack(current, open, close) {
        if (current.length === 2 * n) {
            result.push(current);
            return;
        }
        
        if (open < n) {
            backtrack(current + '(', open + 1, close);
        }
        
        if (close < open) {
            backtrack(current + ')', open, close + 1);
        }
    }
    
    backtrack('', 0, 0);
    return result;
}

// Application functions
const countValidParentheses = (n) => catalan(n);
const countBSTs = (n) => catalan(n);
const countFullBinaryTrees = (n) => catalan(n);
const countTriangulations = (vertices) => vertices < 3 ? 0 : catalan(vertices - 2);
const countDyckPaths = (n) => catalan(n);
const countMountainRanges = (n) => catalan(n);
const countStackPermutations = (n) => catalan(n);

// ============ DEMONSTRATION ============

console.log("=".repeat(60));
console.log("CATALAN NUMBERS DEMONSTRATION");
console.log("=".repeat(60));

console.log("\nFirst 10 Catalan numbers:");
for (let i = 0; i < 10; i++) {
    console.log(`  C(${i}) = ${catalan(i)}`);
}

console.log("\nVerification (all methods for C(5) = 42):");
console.log(`  Multiplicative: ${catalan(5)}`);
console.log(`  DP: ${catalanDP(5)}`);
console.log(`  Binomial: ${catalanBinomial(5)}`);

console.log("\nValid parentheses with n=3:");
const parens = generateParentheses(3);
parens.forEach(p => console.log(`  ${p}`));

console.log("\nApplications:");
console.log(`  BSTs with 3 nodes: ${countBSTs(3)}`);
console.log(`  Hexagon triangulations: ${countTriangulations(6)}`);
console.log(`  Dyck paths of length 6: ${countDyckPaths(3)}`);
console.log(`  Mountain ranges with 4 strokes: ${countMountainRanges(4)}`);

// Precomputation demo
const pre = new CatalanPrecomputer(20);
console.log("\nPrecomputation:");
console.log(`  C(15) = ${pre.get(15)}`);
console.log(`  C(20) = ${pre.get(20)}`);

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        catalan,
        catalanDP,
        catalanBinomial,
        CatalanPrecomputer,
        generateParentheses,
        countValidParentheses,
        countBSTs,
        countTriangulations,
        countDyckPaths
    };
}
```
````

---

## Time Complexity Analysis

| Method | Time Complexity | Space Complexity | Best For |
|--------|-----------------|------------------|----------|
| **Multiplicative (Iterative)** | O(n) | O(1) | Single query, large n |
| **DP (Recurrence)** | O(n²) | O(n) | Understanding structure |
| **Binomial Coefficient** | O(n) | O(1) | When nCr available |
| **Precomputation** | O(max_n) preprocessing | O(max_n) | Multiple queries |

### Detailed Breakdown

#### Multiplicative Formula

```
C(n) = C(n-1) × 2(2n-1) / (n+1)
```

- **Time**: O(n) - single loop from 1 to n
- **Space**: O(1) - only stores current result
- **Operations per iteration**: 2 multiplications, 1 modular inverse (via pow, O(log MOD))
- **Total**: O(n × log MOD) ≈ O(n) for typical mod values

#### Dynamic Programming

```
C(i) = Σ C(j) × C(i-1-j) for j = 0 to i-1
```

- **Time**: O(n²) - nested loops: outer n, inner average n/2
- **Space**: O(n) - array of size n+1
- **Total operations**: 1 + 2 + ... + n = n(n+1)/2 ≈ n²/2

#### Binomial Coefficient

```
C(n) = C(2n, n) / (n+1)
```

- **Time**: O(n) - compute C(2n, n) via multiplicative formula
- **Space**: O(1)
- **Alternative**: Precompute factorials and inverse factorials for O(1) queries

#### Precomputation Strategy

```
Precompute: C(0), C(1), ..., C(max_n)
Query: O(1) lookup
```

- **Preprocessing Time**: O(max_n)
- **Query Time**: O(1)
- **Space**: O(max_n)
- **Best for**: Multiple queries with different n values

---

## Space Complexity Analysis

| Method | Space | Notes |
|--------|-------|-------|
| Multiplicative | O(1) | Only current value stored |
| DP | O(n) | Array of size n+1 |
| Binomial | O(1) | No additional storage |
| Precomputation | O(max_n) | Store all values up to max_n |
| Factorial-based | O(n) | If storing factorials and inverse factorials |

### Space Optimization Tips

1. **For single query**: Use multiplicative formula (O(1) space)
2. **For range queries**: Precompute once (O(max_n) space)
3. **For very large n**: Use BigInt or arbitrary precision libraries
4. **Memory-constrained**: Compute on-the-fly with multiplicative formula

---

## Common Variations

### 1. Recursive Implementation (Educational)

For understanding the recursive structure:

````carousel
```python
def catalan_recursive(n, memo=None):
    """
    Recursive with memoization.
    Shows the recursive structure clearly.
    Time: O(n²), Space: O(n)
    """
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n <= 1:
        return 1
    
    result = 0
    for i in range(n):
        result += catalan_recursive(i, memo) * catalan_recursive(n - 1 - i, memo)
    
    memo[n] = result
    return result
```
````

### 2. Big Integer Version (Exact Values)

For exact Catalan numbers without modulo:

````carousel
```python
from math import comb

def catalan_exact(n):
    """
    Return exact Catalan number as integer.
    Grows very fast: C(19) > 10^9, C(34) > 10^19
    """
    return comb(2 * n, n) // (n + 1)

# First few exact values
exact_values = [catalan_exact(i) for i in range(20)]
print(exact_values)
# [1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, 16796, 58786, ...]
```
````

### 3. Factorial Precomputation for O(1) Queries

When many queries needed:

````carousel
```python
class CatalanFastQuery:
    """
    O(1) per query after O(n) preprocessing.
    Uses precomputed factorials and inverse factorials.
    """
    
    def __init__(self, max_n, mod=10**9 + 7):
        self.mod = mod
        self.max_n = max_n
        
        # Precompute factorials
        self.fact = [1] * (2 * max_n + 1)
        for i in range(1, 2 * max_n + 1):
            self.fact[i] = (self.fact[i - 1] * i) % mod
        
        # Precompute inverse factorials
        self.inv_fact = [1] * (2 * max_n + 1)
        self.inv_fact[2 * max_n] = pow(self.fact[2 * max_n], mod - 2, mod)
        for i in range(2 * max_n - 1, -1, -1):
            self.inv_fact[i] = (self.inv_fact[i + 1] * (i + 1)) % mod
    
    def nCr(self, n, r):
        """O(1) binomial coefficient"""
        if r < 0 or r > n:
            return 0
        return (self.fact[n] * self.inv_fact[r] % self.mod * 
                self.inv_fact[n - r]) % self.mod
    
    def get(self, n):
        """O(1) Catalan number query"""
        if n > self.max_n:
            raise ValueError(f"n={n} exceeds max_n={self.max_n}")
        c2n_n = self.nCr(2 * n, n)
        return (c2n_n * pow(n + 1, self.mod - 2, self.mod)) % self.mod
```
````

### 4. Streaming/Online Computation

For computing Catalan numbers in a stream:

````carousel
```python
def catalan_stream():
    """
    Generator that yields Catalan numbers C(0), C(1), C(2), ...
    """
    n = 0
    result = 1  # C(0) = 1
    
    while True:
        yield result
        n += 1
        # C(n) = C(n-1) * 2(2n-1) / (n+1)
        result = result * 2 * (2 * n - 1) // (n + 1)

# Usage
stream = catalan_stream()
for _ in range(10):
    print(next(stream))  # Prints C(0) to C(9)
```
````

### 5. Matrix Exponentiation (Advanced)

For very large n with modulo (O(log n) time):

The Catalan recurrence can be expressed using matrix exponentiation for O(log n) computation, though this is rarely used in practice due to complexity overhead.

---

## Practice Problems

### Problem 1: Unique Binary Search Trees

**Problem**: [LeetCode 96 - Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees/)

**Difficulty**: Medium

**Description**: Given an integer `n`, return the number of structurally unique BST's (binary search trees) which has exactly `n` nodes of unique values from 1 to n.

**How to Apply Catalan Numbers**:
- The number of unique BSTs with n nodes is exactly C(n)
- For each possible root value k (from 1 to n), the left subtree has k-1 nodes and the right subtree has n-k nodes
- Total trees = Σ C(k-1) × C(n-k) for k = 1 to n = C(n)

**Solution Approach**:
```python
def numTrees(n: int) -> int:
    # Direct Catalan number computation
    result = 1
    for i in range(1, n + 1):
        result = result * 2 * (2 * i - 1) // (i + 1)
    return result
```

---

### Problem 2: Generate Parentheses

**Problem**: [LeetCode 22 - Generate Parentheses](https://leetcode.com/problems/generate-parentheses/)

**Difficulty**: Medium

**Description**: Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

**How to Apply Catalan Numbers**:
- The number of valid combinations is C(n)
- Use backtracking with constraint: at any point, #close ≤ #open ≤ n
- The recursive structure mirrors the Catalan recurrence

**Solution Approach**:
```python
def generateParenthesis(n: int) -> List[str]:
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
```

---

### Problem 3: Unique Binary Search Trees II

**Problem**: [LeetCode 95 - Unique Binary Search Trees II](https://leetcode.com/problems/unique-binary-search-trees-ii/)

**Difficulty**: Medium

**Description**: Given an integer `n`, return all the structurally unique BST's, which has exactly `n` nodes of unique values from 1 to n.

**How to Apply Catalan Numbers**:
- The number of trees is C(n), but we need to generate all of them
- Use divide and conquer: for each root, recursively generate left and right subtrees
- Combine all left-right pairs for each root

**Solution Approach**:
```python
def generateTrees(n: int) -> List[Optional[TreeNode]]:
    if n == 0:
        return []
    
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
    
    return build(1, n)
```

---

### Problem 4: Minimum Score Triangulation of Polygon

**Problem**: [LeetCode 1039 - Minimum Score Triangulation of Polygon](https://leetcode.com/problems/minimum-score-triangulation-of-polygon/)

**Difficulty**: Medium

**Description**: You have a convex `n`-sided polygon where each vertex has an integer value. You are given an integer array `values` where `values[i]` is the value of the i-th vertex in clockwise order.

Return the minimum possible score that you can achieve with some triangulation of the polygon.

**How to Apply Catalan Numbers**:
- The number of possible triangulations is C(n-2), but we need the minimum score
- Use DP with the same recursive structure as Catalan
- `dp[i][j]` = minimum score for triangulating polygon from vertex i to j

**Solution Approach**:
```python
def minScoreTriangulation(values: List[int]) -> int:
    n = len(values)
    dp = [[0] * n for _ in range(n)]
    
    for length in range(2, n):  # length of diagonal
        for i in range(n - length):
            j = i + length
            dp[i][j] = float('inf')
            for k in range(i + 1, j):
                score = dp[i][k] + dp[k][j] + values[i] * values[k] * values[j]
                dp[i][j] = min(dp[i][j], score)
    
    return dp[0][n - 1]
```

---

### Problem 5: Number of Ways to Draw Stairs

**Problem**: [LeetCode 891 - Sum of Subsequence Widths](https://leetcode.com/problems/sum-of-subsequence-widths/) (related)

**Alternative Problem**: Count the number of ways to draw a "mountain" with n up-strokes and n down-strokes where we never go below the starting level.

**How to Apply Catalan Numbers**:
- This is exactly the Dyck path counting problem
- Each "up" is an opening parenthesis, each "down" is a closing parenthesis
- The answer is C(n)

**Solution Approach**:
```python
def countMountains(n: int) -> int:
    MOD = 10**9 + 7
    result = 1
    for i in range(1, n + 1):
        result = (result * 2 * (2 * i - 1)) % MOD
        result = (result * pow(i + 1, MOD - 2, MOD)) % MOD
    return result
```

**Additional Similar Problems**:
- [LeetCode 241 - Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses/)
- [LeetCode 2411 - Smallest Subarrays With Maximum Bitwise OR](https://leetcode.com/problems/smallest-subarrays-with-maximum-bitwise-or/) (uses Catalan-like structures)

---

## Video Tutorial Links

### Fundamentals

- [Catalan Numbers - Introduction and Applications (NeetCode)](https://www.youtube.com/watch?v=ZiKxNWLfDH4) - Excellent overview with code examples
- [Catalan Numbers Explained (WilliamFiset)](https://www.youtube.com/watch?v=eoOfXF8N1Z4) - Mathematical foundations and applications
- [Catalan Numbers in Competitive Programming (Codeforces)](https://www.youtube.com/watch?v=CAaDJJUsNXI) - Practical CP applications
- [Valid Parentheses and Catalan Numbers (Back To Back SWE)](https://www.youtube.com/watch?v=J0kT4TSbQ5E) - Deep dive into parenthesis problems

### Applications

- [Binary Search Trees and Catalan Numbers (MyCodeSchool)](https://www.youtube.com/watch?v=YDf982Lb84o) - Tree enumeration problems
- [Dynamic Programming with Catalan Numbers (Abdul Bari)](https://www.youtube.com/watch?v=yy2kWY5q3qk) - DP approach to Catalan problems
- [Polygon Triangulation (MIT OpenCourseWare)](https://www.youtube.com/watch?v=0FQ4_2x8S7M) - Geometric applications
- [Lattice Paths and Catalan Numbers (3Blue1Brown)](https://www.youtube.com/watch?v=HEfHFsfGXjs) - Visual explanation

### Advanced Topics

- [Generalized Catalan Numbers (Numberphile)](https://www.youtube.com/watch?v=vTqW8Q78-70) - Extensions and variations
- [Catalan Numbers in Combinatorics (nptelhrd)](https://www.youtube.com/watch?v=0oE8hOi2d6s) - University-level combinatorics
- [Catalan Numbers and Generating Functions (Socratica)](https://www.youtube.com/watch?v=bxKo57M_ecg) - Advanced mathematical perspective

---

## Follow-up Questions

### Q1: Why is the recursive formula C(n) = Σ C(i) × C(n-1-i)?

**Answer**: This reflects the "first return to axis" decomposition principle:

For any Catalan structure (Dyck paths, valid parentheses, BSTs), we can identify a "split point" that divides the problem into two independent subproblems:

1. **For valid parentheses**: The first opening `(` matches with some closing `)`. Everything inside forms one subproblem (C(i)), everything after forms another (C(n-1-i)).

2. **For BSTs**: Choose a root (n choices). The left subtree has i nodes (C(i)), the right subtree has n-1-i nodes (C(n-1-i)).

3. **For Dyck paths**: Find where the path first returns to the x-axis. Before that point is one independent path (C(i)), after is another (C(n-1-i)).

This convolution structure is why the generating function for Catalan numbers satisfies: `C(x) = 1 + xC(x)²`

---

### Q2: What's the connection between Catalan numbers and the central binomial coefficient?

**Answer**: 

```
C(n) = (1/(n+1)) × C(2n, n) = C(2n, n) - C(2n, n+1)
```

**Intuitive explanation using Dyck paths**:
- C(2n, n) counts all paths from (0,0) to (2n, 0) with n up and n down steps
- Some paths go below the x-axis ("bad" paths)
- By the **reflection principle**, bad paths correspond to paths from (0,-2) to (2n,0)
- Number of bad paths = C(2n, n+1)
- Good paths = Total - Bad = C(2n, n) - C(2n, n+1) = C(2n, n)/(n+1)

**Why divide by (n+1)?**
This represents the probability that a random path with n up and n down steps never goes below the starting point. As n → ∞, this probability approaches 0 (most paths cross below).

---

### Q3: Can Catalan numbers be negative or non-integer?

**Answer**: 

**For n ≥ 0**: No, all Catalan numbers are positive integers.

**Proof**:
- Base: C(0) = 1 (positive integer)
- Inductive step: If C(k) is a positive integer for all k < n, then
  - C(n) = Σ C(i) × C(n-1-i) is a sum of products of positive integers
  - Therefore C(n) is a positive integer

**For generalization**: 
- **Fuss-Catalan numbers**: C_n^(p) = (1/((p-1)n+1)) × C(pn, n) for counting p-ary trees
- **Ballot numbers**: Related generalization counting paths with different constraints
- **Narayana numbers**: Refinement of Catalan numbers that also track number of peaks

**Negative indices**: Using the gamma function, C(n) can be extended to complex numbers, but this is rarely needed in competitive programming.

---

### Q4: How large can n be before overflow, and how to handle large n?

**Answer**: 

**Overflow thresholds**:

| Data Type | Max n | C(max_n) |
|-----------|-------|----------|
| 32-bit int | 18 | 4.7 × 10⁹ |
| 64-bit long | 34 | 3.3 × 10¹⁸ |
| 128-bit | 67 | 1.6 × 10³⁸ |
| BigInteger | Unlimited | - |

**Handling large n**:

1. **Use modulo arithmetic**: For n > 34, always compute C(n) mod M
   ```python
   MOD = 10**9 + 7  # Common in competitive programming
   ```

2. **Modular inverse for division**: Use Fermat's little theorem (when MOD is prime):
   ```python
   inv = pow(n + 1, MOD - 2, MOD)  # Modular inverse of (n+1)
   ```

3. **Precomputation with modulo**: For many queries, precompute all values mod M

4. **Big integer libraries**: Python handles big integers automatically; in Java use `BigInteger`

5. **Approximation for very large n**: Use Stirling's approximation
   ```
   log(C(n)) ≈ 2n×log(2) - (3/2)×log(n) - (1/2)×log(π)
   ```

---

### Q5: How do Catalan numbers relate to other combinatorial sequences?

**Answer**:

**Direct relationships**:

| Sequence | Relationship to C(n) |
|----------|---------------------|
| **Central binomial** | C(n) = C(2n,n)/(n+1) |
| **Factorial** | C(n) ~ 4ⁿ/(n^(3/2)×√π) |
| **Fibonacci** | Both satisfy linear recurrences; Catalan recurrence is quadratic |
| **Bell numbers** | Both count partitions, but Bell counts all partitions, Catalan only non-crossing |

**Related sequences**:

1. **Motzkin numbers**: Count paths that can stay at the same level (Catalan is a subset)
2. **Narayana numbers**: Refinement of Catalan by number of "peaks" or "returns"
3. **Schröder numbers**: Count paths with diagonal steps allowed
4. **Bergeron numbers**: Generalization to k-ary trees

**Generating function**:
```
C(x) = Σ C(n)×x^n = (1 - √(1-4x)) / (2x)
```

This generating function relationship connects Catalan numbers to:
- **Binomial theorem** with fractional exponents
- **Power series expansions**
- **Analytic combinatorics**

---

## Summary

The **Catalan numbers** are a fundamental sequence in combinatorics with applications spanning computer science, mathematics, and beyond. Key takeaways:

### Essential Formulas

1. **Recursive**: `C(n) = Σ C(i) × C(n-1-i)` - Shows the convolution structure
2. **Binomial**: `C(n) = C(2n,n) / (n+1)` - Direct computation
3. **Multiplicative**: `C(n) = C(n-1) × 2(2n-1)/(n+1)` - Efficient iterative computation

### When to Use Catalan Numbers

- ✅ Counting **balanced** or **non-crossing** structures
- ✅ Problems involving **binary trees** or **parentheses**
- ✅ **Polygon triangulation** or **lattice path** counting
- ✅ Problems with **recursive decomposition** into two subproblems

### Implementation Best Practices

| Scenario | Recommended Method |
|----------|-------------------|
| Single query, large n | Multiplicative formula (O(n)) |
| Multiple queries | Precomputation (O(max_n) + O(1) per query) |
| Understanding structure | DP approach (O(n²)) |
| Very large n with modulo | Binomial with modular arithmetic |

### Common Applications

1. **Valid Parentheses**: C(n) valid sequences of n pairs
2. **Binary Search Trees**: C(n) unique BST structures with n nodes
3. **Polygon Triangulation**: C(n-2) ways to triangulate an n-gon
4. **Dyck Paths**: C(n) lattice paths staying above diagonal
5. **Stack Permutations**: C(n) valid output sequences from stack

### Important Properties

- **Growth rate**: ~4ⁿ/(n^(3/2)×√π) - exponential but slower than 4ⁿ
- **All values are integers** for n ≥ 0
- **Modulo arithmetic** essential for n > 34 (64-bit overflow)
- **Recursive structure** enables divide-and-conquer solutions

Mastering Catalan numbers provides powerful tools for solving counting problems in competitive programming and technical interviews, especially those involving balanced structures or recursive decompositions.

---

## Related Algorithms

- [Binomial Coefficients](./ncr-binomial.md) - Direct relationship with Catalan formula
- [Dynamic Programming](./climbing-stairs.md) - Similar recursive structure
- [Backtracking](./permutations.md) - Generate all valid configurations
- [Segment Tree](./segment-tree.md) - For range queries in related problems
- [Matrix Exponentiation](./matrix-exponentiation.md) - Alternative O(log n) computation method
- [Modular Arithmetic](./modular-exponentiation.md) - Essential for large n calculations
