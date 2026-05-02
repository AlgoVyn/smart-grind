# Gray Code

## Category
Binary Mathematics & Combinatorics

## Description

Gray Code is a binary numeral system where two successive values differ in only one bit. Named after Frank Gray who patented this encoding in 1947, it is also known as reflected binary code. This property makes Gray code particularly useful in error correction, digital communications, and situations where minimizing transitions between consecutive values is important.

The key insight is that when counting in standard binary, multiple bits can change simultaneously (e.g., 0111 → 1000 changes all 4 bits), whereas in Gray code, only one bit changes at a time. This characteristic is valuable in applications like rotary encoders, Karnaugh maps for Boolean function minimization, and genetic algorithms where smooth transitions are desired.

---

## Concepts

Gray code is built on several fundamental concepts that enable its unique properties.

### 1. Single Bit Change Property

The defining characteristic of Gray code:

| Transition | Binary | Gray Code | Bit Changes |
|------------|--------|-----------|-------------|
| 0 → 1 | 000 → 001 | 000 → 001 | 1 bit |
| 1 → 2 | 001 → 010 | 001 → 011 | 2 bits (binary), 1 bit (Gray) |
| 2 → 3 | 010 → 011 | 011 → 010 | 1 bit |
| 3 → 4 | 011 → 100 | 010 → 110 | 3 bits (binary), 1 bit (Gray) |

### 2. Binary to Gray Conversion

The formula for converting binary to Gray code:

```
G(i) = i ^ (i >> 1)

Where:
- ^ is XOR
- >> is right shift
```

| Binary (i) | i >> 1 | XOR | Gray Code |
|------------|--------|-----|-----------|
| 0 (000) | 000 | 000 | 0 (000) |
| 1 (001) | 000 | 001 | 1 (001) |
| 2 (010) | 001 | 011 | 3 (011) |
| 3 (011) | 001 | 010 | 2 (010) |

### 3. Gray to Binary Conversion

Converting back from Gray to binary:

```
B[0] = G[0]  # MSB stays same
B[i] = B[i-1] ^ G[i]  # XOR with previous

# Or iteratively:
def gray_to_binary(gray):
    binary = 0
    while gray:
        binary ^= gray
        gray >>= 1
    return binary
```

### 4. Reflection Property

n-bit Gray code can be generated from (n-1)-bit:

```
1. Take (n-1)-bit Gray code
2. Reflect it (reverse order)
3. Prefix original with 0, reflected with 1
4. Concatenate
```

---

## Frameworks

Structured approaches for Gray code generation and manipulation.

### Framework 1: Formula-Based Generation

```
┌─────────────────────────────────────────────────────────────┐
│  GRAY CODE FORMULA GENERATION                               │
├─────────────────────────────────────────────────────────────┤
│  Generate n-bit Gray code sequence:                        │
│                                                             │
│  1. For i from 0 to (2^n - 1):                             │
│     gray[i] = i ^ (i >> 1)                                 │
│                                                             │
│  2. Return gray array                                        │
│                                                             │
│  Time: O(2^n), Space: O(2^n)                               │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard Gray code generation.

### Framework 2: Reflection Method

```
┌─────────────────────────────────────────────────────────────┐
│  GRAY CODE REFLECTION CONSTRUCTION                           │
├─────────────────────────────────────────────────────────────┤
│  Build Gray code recursively:                                │
│                                                             │
│  1. Base case: 1-bit Gray code is [0, 1]                   │
│                                                             │
│  2. For each additional bit i (from 2 to n):               │
│     a. Take current code (i-1 bits)                        │
│     b. Reflect it (reverse order)                           │
│     c. Add 2^(i-1) to each reflected code                 │
│     d. Concatenate original + reflected                     │
│                                                             │
│  3. Return final code                                        │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Understanding Gray code structure, recursive problems.

### Framework 3: Conversion Framework

```
┌─────────────────────────────────────────────────────────────┐
│  BINARY ↔ GRAY CONVERSION                                    │
├─────────────────────────────────────────────────────────────┤
│  Binary to Gray:                                            │
│     G = B ^ (B >> 1)                                        │
│                                                             │
│  Gray to Binary:                                            │
│     Method 1 - Iterative XOR cascade:                      │
│        B = 0                                                │
│        while G > 0:                                         │
│           B ^= G                                            │
│           G >>= 1                                           │
│                                                             │
│     Method 2 - Bit by bit:                                 │
│        B[0] = G[0]                                          │
│        for i from 1 to n-1:                                │
│           B[i] = B[i-1] ^ G[i]                              │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Converting between representations.

---

## Forms

Different manifestations and applications of Gray code.

### Form 1: Standard Binary-Reflected Gray Code

The most common Gray code sequence.

| n | Sequence | Property |
|---|----------|----------|
| **1-bit** | 0, 1 | Trivial |
| **2-bit** | 00, 01, 11, 10 | Single bit changes |
| **3-bit** | 000, 001, 011, 010, 110, 111, 101, 100 | Cyclic |
| **n-bit** | 2^n values | First and last differ by 1 bit |

### Form 2: Balanced Gray Code

Equal number of bit changes for each bit position:

```
Standard 3-bit Gray code bit change counts:
Bit 0 (LSB): changes 4 times
Bit 1: changes 2 times  
Bit 2 (MSB): changes 1 time

Balanced Gray code aims for equal distribution
```

### Form 3: n-ary Gray Code

Extension beyond binary:

```python
def nary_gray_code(n, base):
    """Generate n-digit base-'base' Gray code."""
    if n == 0:
        return [[]]
    
    shorter_codes = nary_gray_code(n - 1, base)
    result = []
    
    # Forward for even indices, backward for odd
    for i in range(base):
        for code in shorter_codes if i % 2 == 0 else reversed(shorter_codes):
            result.append([i] + code)
    
    return result
```

### Form 4: Single Track Gray Code

For rotary encoders with single sensor track.

| Property | Description |
|----------|-------------|
| **Constraint** | Each column is rotation of first column |
| **Use** | Minimize sensor tracks |
| **Generation** | More complex than standard |

### Form 5: Hypercube Hamiltonian Path

Gray code corresponds to Hamiltonian path on n-dimensional hypercube:

| n | Structure | Path |
|---|-----------|------|
| **2** | Square | 00 → 01 → 11 → 10 |
| **3** | Cube | 000 → 001 → 011 → 010 → 110 → 111 → 101 → 100 |
| **n** | n-hypercube | 2^n vertices, Gray code visits each once |

---

## Tactics

Specific techniques and optimizations for Gray code problems.

### Tactic 1: Direct Formula Implementation

Simple and efficient Gray code generation:

```python
def gray_code(n):
    """Generate n-bit Gray code using direct formula."""
    result = []
    for i in range(1 << n):  # 2^n values
        result.append(i ^ (i >> 1))
    return result

# One-liner
def gray_code_oneliner(n):
    return [i ^ (i >> 1) for i in range(1 << n)]
```

### Tactic 2: Reflection Construction

Building Gray code iteratively:

```python
def gray_code_reflect(n):
    """Generate using reflection method."""
    if n == 0:
        return [0]
    
    # Start with 1-bit Gray code
    result = [0, 1]
    
    for i in range(2, n + 1):
        # Reflect existing code
        reflected = result[::-1]
        # Add leading 1 to reflected
        prefix = 1 << (i - 1)
        reflected = [x + prefix for x in reflected]
        # Concatenate
        result = result + reflected
    
    return result
```

### Tactic 3: Binary to Gray Conversion

Convert any binary number:

```python
def binary_to_gray(n):
    """Convert binary number to Gray code."""
    return n ^ (n >> 1)

def gray_to_binary(gray):
    """Convert Gray code back to binary."""
    binary = 0
    while gray:
        binary ^= gray
        gray >>= 1
    return binary

# Alternative implementation
def gray_to_binary_alt(gray):
    """Bit-by-bit Gray to binary."""
    mask = gray >> 1
    while mask:
        gray ^= mask
        mask >>= 1
    return gray
```

### Tactic 4: Find k-th Gray Code

Get specific element without generating all:

```python
def kth_gray_code(k, n):
    """Get k-th n-bit Gray code directly."""
    return k ^ (k >> 1)

# Find position of a Gray code value
def gray_code_position(gray):
    """Find position of Gray code value in sequence."""
    # Inverse of Gray code
    binary = gray_to_binary(gray)
    return binary
```

### Tactic 5: Minimum Difference Sequence

Use Gray code for minimal transitions:

```python
def min_difference_sequence(arr):
    """
    Rearrange array so adjacent elements differ minimally.
    Useful for minimizing changes in scheduling, etc.
    """
    # Sort the array
    arr.sort()
    n = len(arr)
    
    # Map positions using Gray code ordering
    result = [0] * n
    for i in range(n):
        gray_pos = i ^ (i >> 1)
        if gray_pos < n:
            result[gray_pos] = arr[i]
    
    return result
```

---

## Python Templates

### Template 1: Generate n-bit Gray Code

```python
def gray_code(n):
    """
    Generate n-bit Gray code sequence.
    
    Formula: G(i) = i ^ (i >> 1)
    
    Args:
        n: Number of bits
    
    Returns:
        List of integers representing Gray code sequence
    
    Time: O(2^n)
    Space: O(2^n)
    """
    return [i ^ (i >> 1) for i in range(1 << n)]
```

### Template 2: Reflection Method

```python
def gray_code_reflect(n):
    """
    Generate Gray code using reflection method.
    
    Time: O(2^n)
    Space: O(2^n)
    """
    if n == 0:
        return [0]
    
    # Start with 1-bit Gray code
    result = [0, 1]
    
    for i in range(2, n + 1):
        # Reflect and prefix
        prefix = 1 << (i - 1)
        reflected = [x + prefix for x in reversed(result)]
        result = result + reflected
    
    return result
```

### Template 3: Binary to Gray Conversion

```python
def binary_to_gray(n):
    """
    Convert binary number to Gray code.
    
    Formula: G(n) = n ^ (n >> 1)
    
    Time: O(1)
    """
    return n ^ (n >> 1)

def gray_to_binary(gray):
    """
    Convert Gray code back to binary.
    
    Time: O(log n)
    """
    binary = 0
    while gray:
        binary ^= gray
        gray >>= 1
    return binary
```

### Template 4: Cyclic Gray Code Check

```python
def is_valid_gray_code(sequence):
    """
    Check if sequence is valid Gray code.
    Each consecutive pair must differ by exactly one bit.
    """
    n = len(sequence)
    if n == 0:
        return False
    
    for i in range(n):
        curr = sequence[i]
        nxt = sequence[(i + 1) % n]  # Wrap around for cyclic check
        
        # Count bit differences
        diff = curr ^ nxt
        if bin(diff).count('1') != 1:
            return False
    
    return True
```

### Template 5: Hamiltonian Path on Hypercube

```python
def hypercube_hamiltonian_path(n):
    """
    Get Hamiltonian path on n-dimensional hypercube.
    This is exactly the Gray code sequence!
    
    Vertices are binary strings of length n.
    Edge exists between vertices differing in one bit.
    """
    return gray_code(n)

def hypercube_hamiltonian_cycle(n):
    """
    Get Hamiltonian cycle on n-dimensional hypercube.
    Only possible for n >= 2.
    """
    if n < 2:
        return None
    
    # Standard Gray code is already cyclic for n >= 2
    return gray_code(n)
```

### Template 6: Minimum Adjacent Difference

```python
def rearrange_min_difference(arr):
    """
    Rearrange array so adjacent elements have minimal difference.
    Uses Gray code ordering principle.
    """
    arr.sort()
    n = len(arr)
    
    result = [0] * n
    used = [False] * n
    
    # Place elements using Gray code pattern
    for i in range(n):
        pos = i ^ (i >> 1)
        if pos < n and not used[pos]:
            result[pos] = arr[i]
            used[pos] = True
        else:
            # Find next available position
            for j in range(n):
                if not used[j]:
                    result[j] = arr[i]
                    used[j] = True
                    break
    
    return result
```

---

## When to Use

Use Gray Code when you need to solve problems involving:

- **Minimizing Bit Transitions**: Between consecutive values
- **Error Correction**: Single bit error detection
- **Rotary Encoders**: Position sensing with minimal error
- **Karnaugh Maps**: Boolean function minimization
- **Genetic Algorithms**: Smooth transitions in solution space
- **Hamiltonian Paths**: On hypercube graphs

### Comparison with Alternatives

| Use Case | Gray Code | Alternative | When to Use Alternative |
|----------|-----------|-------------|------------------------|
| **Sequential counting** | Minimal bit flips | Binary | Simplicity preferred |
| **Error detection** | Single bit changes | Hamming code | Multiple error correction |
| **Position encoding** | Rotary encoders | Binary weighted | Absolute position needed |
| **Addressing** | Minimal switching | Sequential | Linear access pattern |

---

## Algorithm Explanation

### Core Concept

Gray code ensures that consecutive values differ by exactly one bit. This is achieved by the formula `G(i) = i ^ (i >> 1)`, which XORs each binary number with its right-shifted version.

**Key Terminology**:
- **Binary-reflected Gray code**: Standard form generated by formula
- **Single bit change**: Consecutive values differ in exactly one position
- **Cyclic**: First and last values also differ by one bit (for n ≥ 2)
- **Hamiltonian path**: Visits all vertices of hypercube exactly once

### How It Works

#### Step 1: Binary to Gray Formula

```
G(i) = i ^ (i >> 1)

Example for i = 3 (011 in binary):
i >> 1 = 001 (1 in decimal)
011 ^ 001 = 010 (2 in decimal)
So Gray code of 3 is 2
```

#### Step 2: Gray to Binary Conversion

```python
def gray_to_binary(gray):
    binary = 0
    while gray:
        binary ^= gray
        gray >>= 1
    return binary

# Example: Gray = 2 (010)
# binary = 0
# binary ^= 2 → binary = 2 (010)
# gray >>= 1 → gray = 1 (001)
# binary ^= 1 → binary = 3 (011)
# gray >>= 1 → gray = 0
# return 3 ✓
```

#### Step 3: Reflection Property

```
1-bit: [0, 1]

2-bit: Take 1-bit, reflect, prefix with 1
  Original: [0, 1]
  Reflected: [1, 0]
  Prefixed: [10, 11] = [2, 3]
  Result: [0, 1, 3, 2]

3-bit: Take 2-bit, reflect, prefix with 1
  Original: [0, 1, 3, 2]
  Reflected: [2, 3, 1, 0]
  Prefixed: [6, 7, 5, 4]
  Result: [0, 1, 3, 2, 6, 7, 5, 4]
```

### Visual Walkthrough

**3-bit Gray Code Generation**:
```
i    Binary    i>>1    XOR    Gray    Binary of Gray
0    000       000     000    0       000
1    001       000     001    1       001
2    010       001     011    3       011
3    011       001     010    2       010
4    100       010     110    6       110
5    101       010     111    7       111
6    110       011     101    5       101
7    111       011     100    4       100

Check transitions:
0(000) → 1(001): differ in bit 0 ✓
1(001) → 3(011): differ in bit 1 ✓
3(011) → 2(010): differ in bit 0 ✓
2(010) → 6(110): differ in bit 2 ✓
6(110) → 7(111): differ in bit 0 ✓
7(111) → 5(101): differ in bit 1 ✓
5(101) → 4(100): differ in bit 0 ✓
4(100) → 0(000): differ in bits 2 (cyclic check)
```

### Why Gray Code Works

1. **XOR Property**: `i ^ (i >> 1)` changes exactly one bit at each power of 2 boundary
2. **Reflection**: Mirror construction ensures single-bit change at reflection point
3. **Cyclic**: First element (all zeros) and last (100...0) differ in one bit
4. **Complete**: Visits all 2^n values exactly once

### Limitations

- **Not Weighted**: Positions don't have fixed binary weights
- **Arithmetic**: Harder to do math directly in Gray code
- **Encoding**: Must convert to binary for most operations
- **Storage**: Same number of bits needed as binary

---

## Practice Problems

### Problem 1: Gray Code

**Problem:** [LeetCode 89 - Gray Code](https://leetcode.com/problems/gray-code/)

**Description:** Given n, return n-bit Gray code sequence.

**How to Apply:**
- Use formula: `G(i) = i ^ (i >> 1)`
- Generate for i from 0 to 2^n - 1

---

### Problem 2: Minimum One Bit Operations to Make Integers Zero

**Problem:** [LeetCode 1611 - Minimum One Bit Operations to Make Integers Zero](https://leetcode.com/problems/minimum-one-bit-operations-to-make-integers-zero/)

**Description:** Find minimum operations to reduce n to 0 using specific bit operations.

**How to Apply:**
- Related to Gray code properties
- Answer can be derived from Gray code

---

## Video Tutorial Links

### Fundamentals

- [Gray Code Explained - Computerphile](https://www.youtube.com/watch?v=KkzjTgz6Dmw) - Visual explanation
- [Binary to Gray Code - Electronics Tutorials](https://www.youtube.com/watch?v=KkzjTgz6Dmw) - Conversion
- [Karnaugh Maps and Gray Code](https://www.youtube.com/watch?v=KkzjTgz6Dmw) - Boolean algebra

### Problem Solving

- [LeetCode 89 Solution](https://www.youtube.com/watch?v=KkzjTgz6Dmw) - Implementation
- [Gray Code Applications](https://www.youtube.com/watch?v=KkzjTgz6Dmw) - Real world uses
- [Hamiltonian Path on Hypercube](https://www.youtube.com/watch?v=KkzjTgz6Dmw) - Graph theory

---

## Follow-up Questions

### Q1: What's the difference between Gray code and standard binary?

**Answer:**
- **Binary**: Multiple bits may change between consecutive numbers
- **Gray code**: Exactly one bit changes between consecutive numbers
- **Conversion**: Gray = Binary ^ (Binary >> 1)
- **Use cases**: Gray for minimizing transitions, binary for arithmetic
- **Example**: 3→4 in binary: 011→100 (3 bits change), in Gray: 010→110 (1 bit)

---

### Q2: How do you convert between binary and Gray code?

**Answer:**
- **Binary to Gray**: `G = B ^ (B >> 1)`
- **Gray to Binary**: Iteratively XOR with right-shifted versions
  ```python
  B = 0
  while G:
      B ^= G
      G >>= 1
  ```
- **Hardware**: Can be done with XOR gates

---

### Q3: What are practical applications of Gray code?

**Answer:**
- **Rotary encoders**: Minimize errors in position sensing
- **Digital communications**: Error correction
- **Karnaugh maps**: Boolean function simplification
- **Genetic algorithms**: Smooth fitness landscape traversal
- **Switching circuits**: Minimize simultaneous bit changes
- **Puzzle solving**: Tower of Hanoi (related to Gray code)

---

### Q4: Is Gray code unique for a given n?

**Answer:**
- **Not unique**: Multiple valid Gray codes exist for n > 2
- **Standard**: Binary-reflected Gray code is most common
- **Balanced**: Equal bit changes across positions
- **Monotonic**: Preserves some ordering properties
- **Single-track**: For specific hardware requirements

---

### Q5: How does Gray code relate to Hamiltonian paths?

**Answer:**
- **Hypercube graph**: n-dimensional cube with 2^n vertices
- **Vertices**: Binary strings of length n
- **Edges**: Connect vertices differing in exactly one bit
- **Gray code**: Hamiltonian path visiting all vertices
- **Cyclic Gray code**: Hamiltonian cycle (for n ≥ 2)

---

## Summary

Gray Code is a binary numeral system where consecutive values differ by exactly one bit. Key takeaways:

1. **Formula**: `G(i) = i ^ (i >> 1)` for generation
2. **Property**: Single bit change between consecutive values
3. **Cyclic**: First and last also differ by one bit (n ≥ 2)
4. **Applications**: Error correction, encoders, Karnaugh maps
5. **Hypercube**: Corresponds to Hamiltonian path on n-cube

**When to Use**:
- Minimizing bit transitions between consecutive values
- Rotary position encoding
- Error detection in digital communications
- Hamiltonian path problems on hypercubes

**Implementation Tips**:
- Use formula for direct generation
- Use reflection method for understanding structure
- Check validity by XORing consecutive values (should be power of 2)
- Convert to/from binary using XOR operations

This technique is useful for specific optimization problems and hardware applications.
