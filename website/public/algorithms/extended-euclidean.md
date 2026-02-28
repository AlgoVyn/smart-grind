# Extended Euclidean Algorithm

## Category
Math & Number Theory

## Description

The Extended Euclidean Algorithm is an extension to the Euclidean Algorithm that not only finds the **Greatest Common Divisor (GCD)** of two integers `a` and `b`, but also finds the **Bézout coefficients** `x` and `y` such that:

```
ax + by = gcd(a, b)
```

This algorithm is fundamental in number theory and has critical applications in cryptography, modular arithmetic, and solving linear Diophantine equations.

---

## When to Use

Use the Extended Euclidean Algorithm when you need to:

- **Find Modular Inverse**: Compute `a^(-1) mod m` when `gcd(a, m) = 1`
- **Solve Linear Diophantine Equations**: Find integer solutions to `ax + by = c`
- **Compute Bézout Coefficients**: Express GCD as a linear combination
- **Cryptographic Applications**: RSA, elliptic curve cryptography

### Key Insight

While the standard Euclidean algorithm only gives `gcd(a, b)`, the extended version also provides the coefficients that express this GCD as a linear combination of `a` and `b`.

---

## Algorithm Explanation

### Mathematical Foundation

**Bézout's Identity**: For any integers `a` and `b`, there exist integers `x` and `y` such that:
```
ax + by = gcd(a, b)
```

### How It Works

The algorithm works backwards through the Euclidean algorithm steps. If we know:
```
gcd(a, b) = gcd(b, a mod b)
```

And we have coefficients for the recursive call:
```
b·x₁ + (a mod b)·y₁ = gcd(a, b)
```

We can substitute `a mod b = a - ⌊a/b⌋·b` to get:
```
a·y₁ + b·(x₁ - ⌊a/b⌋·y₁) = gcd(a, b)
```

Therefore:
- `x = y₁`
- `y = x₁ - ⌊a/b⌋·y₁`

### Visual Walkthrough

For `a = 30, b = 12`:

```
Step 1: 30 = 2 × 12 + 6     → gcd(30, 12) = gcd(12, 6)
Step 2: 12 = 2 × 6 + 0      → gcd = 6

Working backwards:
From Step 1: 6 = 30 - 2 × 12

So: 30 × (1) + 12 × (-2) = 6
    ↑x              ↑y      ↑gcd
```

---

## Algorithm Steps

1. **Base Case**: If `b = 0`, return `(a, 1, 0)` since `a·1 + 0·0 = a = gcd(a, 0)`
2. **Recursive Step**: Compute `(g, x₁, y₁) = extended_gcd(b, a mod b)`
3. **Back Substitution**:
   - `x = y₁`
   - `y = x₁ - ⌊a/b⌋ × y₁`
4. **Return**: `(g, x, y)` where `g = gcd(a, b)` and `ax + by = g`

---

## Implementation

### Template Code

````carousel
```python
def extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """
    Extended Euclidean Algorithm.
    
    Returns (g, x, y) such that ax + by = g = gcd(a, b)
    
    Args:
        a: First integer
        b: Second integer
        
    Returns:
        Tuple of (gcd, x_coefficient, y_coefficient)
        
    Time Complexity: O(log(min(a, b)))
    Space Complexity: O(log(min(a, b))) for recursion stack
    """
    if b == 0:
        return (a, 1, 0)
    
    # Recursive call
    g, x1, y1 = extended_gcd(b, a % b)
    
    # Back substitution
    x = y1
    y = x1 - (a // b) * y1
    
    return (g, x, y)


def iterative_extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """
    Iterative version of Extended Euclidean Algorithm.
    
    More space efficient than recursive version.
    
    Time Complexity: O(log(min(a, b)))
    Space Complexity: O(1)
    """
    x0, x1 = 1, 0
    y0, y1 = 0, 1
    
    while b != 0:
        q = a // b
        a, b = b, a - q * b
        x0, x1 = x1, x0 - q * x1
        y0, y1 = y1, y0 - q * y1
    
    return (a, x0, y0)


# Example usage
if __name__ == "__main__":
    a, b = 30, 12
    g, x, y = extended_gcd(a, b)
    print(f"gcd({a}, {b}) = {g}")
    print(f"{a} × {x} + {b} × {y} = {a * x + b * y}")
    
    # Verify
    assert a * x + b * y == g
    print("✓ Bézout identity verified!")
```

<!-- slide -->
```cpp
#include <iostream>
#include <tuple>
using namespace std;

/**
 * Extended Euclidean Algorithm
 * 
 * Returns tuple of (gcd, x, y) such that ax + by = gcd(a, b)
 * 
 * Time Complexity: O(log(min(a, b)))
 * Space Complexity: O(log(min(a, b)))
 */
tuple<int, int, int> extendedGCD(int a, int b) {
    if (b == 0) {
        return {a, 1, 0};
    }
    
    auto [g, x1, y1] = extendedGCD(b, a % b);
    
    int x = y1;
    int y = x1 - (a / b) * y1;
    
    return {g, x, y};
}

/**
 * Iterative version
 * Space Complexity: O(1)
 */
tuple<int, int, int> extendedGCDIterative(int a, int b) {
    int x0 = 1, x1 = 0;
    int y0 = 0, y1 = 1;
    
    while (b != 0) {
        int q = a / b;
        tie(a, b) = make_pair(b, a - q * b);
        tie(x0, x1) = make_pair(x1, x0 - q * x1);
        tie(y0, y1) = make_pair(y1, y0 - q * y1);
    }
    
    return {a, x0, y0};
}

int main() {
    int a = 30, b = 12;
    auto [g, x, y] = extendedGCD(a, b);
    
    cout << "gcd(" << a << ", " << b << ") = " << g << endl;
    cout << a << " × " << x << " + " << b << " × " << y << " = " << a*x + b*y << endl;
    
    return 0;
}
```

<!-- slide -->
```java
public class ExtendedEuclidean {
    
    /**
     * Result class to hold GCD and coefficients
     */
    public static class Result {
        public int gcd, x, y;
        
        public Result(int gcd, int x, int y) {
            this.gcd = gcd;
            this.x = x;
            this.y = y;
        }
        
        @Override
        public String toString() {
            return String.format("gcd=%d, x=%d, y=%d", gcd, x, y);
        }
    }
    
    /**
     * Extended Euclidean Algorithm
     * Returns (gcd, x, y) such that ax + by = gcd(a, b)
     * 
     * Time: O(log(min(a, b)))
     * Space: O(log(min(a, b)))
     */
    public static Result extendedGCD(int a, int b) {
        if (b == 0) {
            return new Result(a, 1, 0);
        }
        
        Result next = extendedGCD(b, a % b);
        
        int x = next.y;
        int y = next.x - (a / b) * next.y;
        
        return new Result(next.gcd, x, y);
    }
    
    /**
     * Iterative version
     * Space: O(1)
     */
    public static Result extendedGCDIterative(int a, int b) {
        int x0 = 1, x1 = 0;
        int y0 = 0, y1 = 1;
        
        while (b != 0) {
            int q = a / b;
            int tempA = a;
            a = b;
            b = tempA - q * b;
            
            int tempX = x0;
            x0 = x1;
            x1 = tempX - q * x1;
            
            int tempY = y0;
            y0 = y1;
            y1 = tempY - q * y1;
        }
        
        return new Result(a, x0, y0);
    }
    
    public static void main(String[] args) {
        int a = 30, b = 12;
        Result result = extendedGCD(a, b);
        
        System.out.println(result);
        System.out.printf("%d × %d + %d × %d = %d%n", 
            a, result.x, b, result.y, a * result.x + b * result.y);
    }
}
```

<!-- slide -->
```javascript
/**
 * Extended Euclidean Algorithm
 * 
 * @param {number} a - First integer
 * @param {number} b - Second integer
 * @returns {[number, number, number]} - [gcd, x, y] where ax + by = gcd
 * 
 * Time Complexity: O(log(min(a, b)))
 * Space Complexity: O(log(min(a, b)))
 */
function extendedGCD(a, b) {
    if (b === 0) {
        return [a, 1, 0];
    }
    
    const [g, x1, y1] = extendedGCD(b, a % b);
    
    const x = y1;
    const y = x1 - Math.floor(a / b) * y1;
    
    return [g, x, y];
}

/**
 * Iterative version
 * Space Complexity: O(1)
 */
function extendedGCDIterative(a, b) {
    let x0 = 1, x1 = 0;
    let y0 = 0, y1 = 1;
    
    while (b !== 0) {
        const q = Math.floor(a / b);
        [a, b] = [b, a - q * b];
        [x0, x1] = [x1, x0 - q * x1];
        [y0, y1] = [y1, y0 - q * y1];
    }
    
    return [a, x0, y0];
}

// Example usage
const a = 30, b = 12;
const [g, x, y] = extendedGCD(a, b);
console.log(`gcd(${a}, ${b}) = ${g}`);
console.log(`${a} × ${x} + ${b} × ${y} = ${a * x + b * y}`);
```
````

---

## Common Applications

### 1. Finding Modular Inverse

When `gcd(a, m) = 1`, the modular inverse of `a` modulo `m` exists:

```python
def mod_inverse(a: int, m: int) -> int | None:
    """
    Returns modular inverse of a under modulo m.
    Returns None if inverse doesn't exist.
    """
    g, x, _ = extended_gcd(a % m, m)
    if g != 1:
        return None  # Inverse doesn't exist
    return (x % m + m) % m  # Ensure positive result

# Example: inverse of 3 mod 11
# 3 × 4 = 12 ≡ 1 (mod 11)
print(mod_inverse(3, 11))  # Output: 4
```

### 2. Solving Linear Diophantine Equations

For equation `ax + by = c`:

```python
def solve_diophantine(a: int, b: int, c: int) -> tuple[int, int] | None:
    """
    Finds one solution to ax + by = c.
    Returns (x, y) or None if no solution exists.
    """
    g, x0, y0 = extended_gcd(abs(a), abs(b))
    
    if c % g != 0:
        return None  # No solution exists
    
    # Scale the solution
    x0 *= c // g
    y0 *= c // g
    
    # Adjust signs based on original a, b
    if a < 0: x0 = -x0
    if b < 0: y0 = -y0
    
    return (x0, y0)

# Find all solutions: x = x0 + (b/g)·t, y = y0 - (a/g)·t for any integer t
def all_solutions(a: int, b: int, c: int, x0: int, y0: int, g: int):
    """Generate all solutions to ax + by = c."""
    t = 0
    while True:
        x = x0 + (b // g) * t
        y = y0 - (a // g) * t
        yield (x, y)
        t += 1
```

---

## Time & Space Complexity

| Aspect | Complexity | Explanation |
|--------|-----------|-------------|
| **Time** | O(log(min(a, b))) | Same as Euclidean algorithm |
| **Space (Recursive)** | O(log(min(a, b))) | Recursion stack depth |
| **Space (Iterative)** | O(1) | Constant extra space |

---

## Practice Problems

### Problem 1: Check if Good Array
**Problem**: [LeetCode 1250 - Check If It Is a Good Array](https://leetcode.com/problems/check-if-it-is-a-good-array/)

**Solution**: An array is "good" if GCD of all elements is 1. Use Extended GCD to verify.

### Problem 2: Pour Water Between Buckets
**Problem**: Given two buckets of sizes m and n, can you measure exactly d liters?

**Solution**: This is a classic application. Possible iff d is a multiple of gcd(m, n) and d ≤ max(m, n).

### Problem 3: Linear Combination
**Problem**: Find if target can be formed as a linear combination of given numbers.

**Solution**: Use Extended GCD to find coefficients, then check if target is achievable.

---

## Follow-up Questions

### Q1: Why do we need the Extended version? Can't we just use regular GCD?

**Answer**: Regular GCD only gives the greatest common divisor. The Extended version provides the Bézout coefficients, which are essential for:
- Modular inverses (needed in cryptography and competitive programming)
- Solving linear Diophantine equations
- Proving theoretical results in number theory

### Q2: What happens when gcd(a, b) ≠ 1? Can we still find a modular inverse?

**Answer**: No. The modular inverse of `a` modulo `m` exists **if and only if** `gcd(a, m) = 1`. When they share a common factor, no integer `x` satisfies `ax ≡ 1 (mod m)`.

### Q3: Can the coefficients x and y be negative?

**Answer**: Yes! The Bézout coefficients can be negative. The algorithm guarantees `ax + by = gcd(a, b)`, but `x` and `y` can be any integers (positive, negative, or zero) that satisfy this equation.

### Q4: Are the Bézout coefficients unique?

**Answer**: No. If `(x, y)` is one solution, then for any integer `t`:
- `x' = x + (b/gcd)·t`
- `y' = y - (a/gcd)·t`

is also a solution. There are infinitely many solutions.

---

## Summary

The Extended Euclidean Algorithm is a powerful tool that extends the basic GCD computation to find the Bézout coefficients. It's essential for:

- **Modular arithmetic**: Computing inverses for division under modulo
- **Cryptography**: RSA and other public-key systems
- **Number theory**: Solving Diophantine equations
- **Competitive programming**: Many problems reduce to finding these coefficients

**Key Takeaway**: When you need more than just the GCD—when you need to express that GCD as a linear combination—use the Extended Euclidean Algorithm.

---

## Related Algorithms

- [GCD (Euclidean)](./gcd-euclidean.md) - Basic GCD computation
- [Modular Inverse](./modular-inverse.md) - Application of Extended GCD
- [Chinese Remainder Theorem](./chinese-remainder.md) - Uses modular inverses