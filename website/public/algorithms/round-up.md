# Round Up (Ceiling Division)

## Category
Mathematics & Integer Arithmetic

## Description

Ceiling division, denoted ⌈a/b⌉, computes the smallest integer greater than or equal to the exact quotient. This fundamental operation appears frequently in algorithmic problems involving resource allocation, pagination, bin packing, and time calculations.

While simple in concept, ceiling division requires careful handling to avoid integer overflow and work correctly with negative numbers. The integer arithmetic trick `(a + b - 1) // b` for positive integers provides an efficient O(1) solution that avoids floating-point operations and their associated precision issues.

---

## Concepts

Ceiling division relies on fundamental integer arithmetic properties.

### 1. Division Types

| Operation | Formula | Example (7/3) | Use Case |
|-----------|---------|---------------|----------|
| **Floor** | ⌊a/b⌋ | 2 | Array indexing |
| **Ceiling** | ⌈a/b⌉ | 3 | Resource allocation |
| **Round** | round(a/b) | 2 | Statistics |
| **Truncate** | int(a/b) | 2 | Type conversion |

### 2. Integer Arithmetic Trick

For positive integers:
```
⌈a/b⌉ = (a + b - 1) // b
```

**Why it works**:
- Adding (b-1) ensures we cross the next integer boundary when there's a remainder
- Integer division then gives us the ceiling
- Works because: a = qb + r where 0 ≤ r < b
- If r = 0: (qb + b - 1) // b = q (no change needed)
- If r > 0: (qb + r + b - 1) // b = q + 1 (ceiling)

### 3. Overflow-Safe Alternatives

| Method | Formula | Overflow Safe |
|--------|---------|---------------|
| **Standard** | (a + b - 1) // b | No (a + b might overflow) |
| **Safe** | a // b + (1 if a % b != 0 else 0) | Yes |
| **Python** | -(-a // b) | Yes (handles negatives) |

### 4. Rounding to Multiples

| Operation | Formula | Example |
|-----------|---------|---------|
| **Round up** | ((n + m - 1) // m) × m | 13 → 15 (m=5) |
| **Round down** | (n // m) × m | 13 → 10 (m=5) |
| **Round nearest** | ((n + m//2) // m) × m | 13 → 15 (m=5) |

---

## Frameworks

Structured approaches for ceiling division problems.

### Framework 1: Basic Ceiling Division

```
┌─────────────────────────────────────────────────────────────┐
│  CEILING DIVISION FOR POSITIVE INTEGERS                      │
├─────────────────────────────────────────────────────────────┤
│  Formula: ⌈a/b⌉ = (a + b - 1) // b                         │
│                                                              │
│  Example: ⌈7/3⌉                                             │
│  - (7 + 3 - 1) // 3 = 9 // 3 = 3 ✓                        │
│  - Exact: 7/3 = 2.33..., ceiling = 3                        │
│                                                              │
│  When a is divisible by b:                                  │
│  - (12 + 4 - 1) // 4 = 15 // 4 = 3 ✓ (exact division)      │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Positive integers where overflow isn't a concern.

### Framework 2: Overflow-Safe Ceiling Division

```
┌─────────────────────────────────────────────────────────────┐
│  OVERFLOW-SAFE CEILING DIVISION                            │
├─────────────────────────────────────────────────────────────┤
│  Formula: ⌈a/b⌉ = a // b + (1 if a % b != 0 else 0)       │
│                                                              │
│  Example: ⌈7/3⌉                                             │
│  - 7 // 3 = 2                                               │
│  - 7 % 3 = 1 (not zero)                                     │
│  - Result: 2 + 1 = 3 ✓                                      │
│                                                              │
│  No overflow: operations are on original values only       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Large numbers where a + b might overflow.

### Framework 3: Python Universal Formula

```
┌─────────────────────────────────────────────────────────────┐
│  PYTHON CEILING DIVISION (ALL SIGNS)                         │
├─────────────────────────────────────────────────────────────┤
│  Formula: ⌈a/b⌉ = -(-a // b)                                │
│                                                              │
│  Works for positive and negative numbers!                   │
│                                                              │
│  Example: ⌈7/3⌉ = -(-7 // 3) = -(-3) = 3 ✓                  │
│  Example: ⌈-7/3⌉ = -(--7 // 3) = -(3) = -3 ✓               │
│                                                              │
│  Note: Python's // is floor division (rounds down)         │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Python code with arbitrary signs.

### Framework 4: Pagination Calculation

```
┌─────────────────────────────────────────────────────────────┐
│  PAGINATION USING CEILING DIVISION                         │
├─────────────────────────────────────────────────────────────┤
│  Given: total_items, items_per_page                         │
│                                                              │
│  Number of pages: ⌈total_items / items_per_page⌉           │
│  Formula: (total_items + items_per_page - 1) // items_per_page│
│                                                              │
│  Example: 23 items, 10 per page                            │
│  Pages needed: (23 + 10 - 1) // 10 = 32 // 10 = 3         │
│  (Page 1: 1-10, Page 2: 11-20, Page 3: 21-23)               │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: UI pagination, data chunking.

---

## Forms

Different manifestations of ceiling division.

### Form 1: Standard Ceiling Division

Basic integer arithmetic trick.

| Aspect | Details |
|--------|---------|
| **Formula** | (a + b - 1) // b |
| **Requirement** | a, b > 0 |
| **Overflow risk** | Yes (a + b) |
| **Use case** | General allocation problems |

### Form 2: Overflow-Safe Version

Prevents integer overflow.

| Aspect | Details |
|--------|---------|
| **Formula** | a // b + (a % b != 0) |
| **Requirement** | a, b > 0 |
| **Overflow risk** | No |
| **Trade-off** | Slightly more operations |

### Form 3: Rounding to Multiple

Generalization to arbitrary multiples.

| Aspect | Details |
|--------|---------|
| **Formula** | ((n + m - 1) // m) × m |
| **Result** | Smallest multiple of m ≥ n |
| **Use case** | Memory alignment, block sizing |

### Form 4: Bit-Length Calculations

Specialized for binary problems.

| Aspect | Details |
|--------|---------|
| **Formula** | Various bit manipulation tricks |
| **Use case** | Binary string concatenation |
| **Example** | Length of concatenated binary numbers |

---

## Tactics

Specific techniques for ceiling division problems.

### Tactic 1: Basic Ceiling Division

The standard formula:

```python
def ceil_div(a, b):
    """
    Ceiling division: ceil(a / b) for positive integers.
    Time: O(1), Space: O(1)
    """
    return -(-a // b)  # Python trick works for negative too

def ceil_div_positive(a, b):
    """
    Standard ceiling division for positive a, b.
    """
    return (a + b - 1) // b
```

**Usage**: Resource allocation, pagination.

### Tactic 2: Overflow Protection

Safe version for large numbers:

```python
def ceil_div_safe(a, b):
    """
    Safe ceiling division avoiding overflow.
    """
    return a // b + (1 if a % b != 0 else 0)
```

**Why it matters**: For very large integers (near 2^63), a + b can overflow.

### Tactic 3: Rounding to Multiple

Round up to nearest multiple:

```python
def round_up_to_multiple(n, multiple):
    """
    Round n up to nearest multiple.
    Example: round_up_to_multiple(13, 5) = 15
    """
    return ((n + multiple - 1) // multiple) * multiple

def round_down_to_multiple(n, multiple):
    """
    Round n down to nearest multiple.
    Example: round_down_to_multiple(13, 5) = 10
    """
    return (n // multiple) * multiple
```

**Application**: Memory allocation, block alignment.

### Tactic 4: Pagination Helpers

Common pagination calculations:

```python
def num_pages(total_items, items_per_page):
    """
    Calculate number of pages needed.
    """
    return ceil_div_positive(total_items, items_per_page)

def page_start_index(page, items_per_page):
    """
    Starting index for a given page (0-indexed).
    """
    return page * items_per_page

def page_end_index(page, items_per_page, total_items):
    """
    Ending index (exclusive) for a given page.
    """
    return min((page + 1) * items_per_page, total_items)

def item_page(item_index, items_per_page):
    """
    Which page contains the given item index.
    """
    return item_index // items_per_page
```

**UI applications**: Displaying paginated data.

### Tactic 5: Binary Concatenation Length

LeetCode 1680 style problem:

```python
def concatenated_binary_length(n):
    """
    Length of binary string formed by concatenating 1 to n.
    """
    length = 0
    bit_length = 1
    count = 2  # Numbers with current bit length
    
    while count <= n:
        # Numbers with 'bit_length' bits: from 2^(bit_length-1) to min(2^bit_length - 1, n)
        start = 1 << (bit_length - 1)
        end = min((1 << bit_length) - 1, n)
        numbers_with_this_length = end - start + 1
        length += numbers_with_this_length * bit_length
        bit_length += 1
        count <<= 1
    
    return length

# Alternative: use ceiling log for simpler formula
def concatenated_binary_length_v2(n):
    """
    Alternative using mathematical formula.
    """
    length = 0
    for i in range(1, n + 1):
        length += i.bit_length()
    return length
```

**Optimization**: The first version runs in O(log n) by processing groups of numbers with same bit length.

---

## Python Templates

### Template 1: Basic Ceiling Division

```python
def ceil_div(a: int, b: int) -> int:
    """
    Ceiling division: ceil(a / b)
    
    Works for all integers (positive, negative, zero).
    Uses Python's floor division property.
    
    Time: O(1)
    Space: O(1)
    """
    return -(-a // b)
```

### Template 2: Positive Ceiling Division

```python
def ceil_div_positive(a: int, b: int) -> int:
    """
    Ceiling division for positive integers.
    
    Classic formula: (a + b - 1) // b
    
    Args:
        a: Positive dividend
        b: Positive divisor
    
    Returns:
        Smallest integer >= a/b
    """
    assert a > 0 and b > 0, "Both arguments must be positive"
    return (a + b - 1) // b
```

### Template 3: Overflow-Safe Ceiling Division

```python
def ceil_div_safe(a: int, b: int) -> int:
    """
    Overflow-safe ceiling division.
    
    Avoids computing a + b which might overflow.
    
    Time: O(1)
    Space: O(1)
    """
    q = a // b
    return q + (1 if a % b != 0 else 0)
```

### Template 4: Rounding to Multiple

```python
def round_up_to_multiple(n: int, m: int) -> int:
    """
    Round n up to the nearest multiple of m.
    
    Example: round_up_to_multiple(13, 5) -> 15
    
    Args:
        n: Number to round
        m: Multiple to round to
    
    Returns:
        Smallest multiple of m that is >= n
    """
    return ((n + m - 1) // m) * m

def round_down_to_multiple(n: int, m: int) -> int:
    """
    Round n down to the nearest multiple of m.
    
    Example: round_down_to_multiple(13, 5) -> 10
    """
    return (n // m) * m
```

### Template 5: Pagination Utilities

```python
def calculate_pages(total_items: int, items_per_page: int) -> int:
    """
    Calculate total number of pages needed.
    
    Args:
        total_items: Total count of items
        items_per_page: Items displayed per page
    
    Returns:
        Total number of pages
    """
    if total_items <= 0:
        return 0
    return (total_items + items_per_page - 1) // items_per_page

def get_page_indices(page: int, items_per_page: int, total_items: int) -> tuple:
    """
    Get start and end indices for a given page.
    
    Args:
        page: Page number (0-indexed)
        items_per_page: Items per page
        total_items: Total items
    
    Returns:
        (start_index, end_index) where end_index is exclusive
    """
    start = page * items_per_page
    end = min(start + items_per_page, total_items)
    return start, end
```

---

## When to Use

Use Ceiling Division when you need to solve problems involving:

- **Resource allocation**: Minimum resources for n items with capacity c
- **Pagination**: Number of pages for n items
- **Bin packing**: Minimum bins for items
- **Time calculations**: Duration with fixed-size slots
- **Memory alignment**: Rounding to block boundaries
- **Grid layouts**: Rows/columns needed for n items

### Common Formula Applications

| Problem | Formula | Example |
|---------|---------|---------|
| **Pages needed** | ⌈items / per_page⌉ | 23 items, 10/page → 3 pages |
| **Buses needed** | ⌈passengers / capacity⌉ | 50 people, 15/bus → 4 buses |
| **Time slots** | ⌈duration / slot_size⌉ | 70 min, 30 min slots → 3 slots |
| **Memory blocks** | ⌈bytes / block_size⌉ | 100 bytes, 32B blocks → 4 blocks |

### When to Use Which Formula

- **Python with any signs**: Use `-(-a // b)`
- **Positive integers, no overflow risk**: Use `(a + b - 1) // b`
- **Large integers, overflow risk**: Use `a // b + (a % b != 0)`
- **Rounding to multiple**: Use `((n + m - 1) // m) * m`

---

## Algorithm Explanation

### Core Concept

Ceiling division computes the smallest integer greater than or equal to the exact quotient. For positive integers, we can achieve this without floating-point operations using integer arithmetic tricks.

### Mathematical Proof

For positive integers a and b:
```
a = qb + r, where 0 ≤ r < b (division algorithm)

If r = 0 (a divisible by b):
  (a + b - 1) // b = (qb + b - 1) // b = q (since b-1 < b)
  Correct: ceil(q) = q ✓

If r > 0 (a not divisible by b):
  (a + b - 1) // b = (qb + r + b - 1) // b
                   = (q+1)b + (r-1) // b
                   = q + 1 (since r-1 < b-1 < b)
  Correct: ceil(q + r/b) = q + 1 ✓
```

### Why -(-a // b) Works in Python

Python's `//` is floor division (rounds down). For negative numbers:
```
-7 // 3 = -3  (floor of -2.33... is -3)
-(-7 // 3) = -(-3) = 3

But ceil(-7/3) = ceil(-2.33...) = -2

Wait - that's wrong! Let me check...

Actually: -(-a // b) = ceil(a/b) for all a, b
-7 / 3 = -2.333...
ceil(-2.333...) = -2

But: -(-(-7) // 3) = -(7 // 3) = -2 ✓

For positive 7/3 = 2.333...:
ceil(2.333...) = 3
-(-7 // 3) = -(-3) = 3 ✓
```

Double negation cancels out the floor operation to give ceiling.

### Visual Examples

```
⌈7/3⌉ calculation:
Exact: 7/3 = 2.333...
Ceiling: 3

Formula: (7 + 3 - 1) // 3 = 9 // 3 = 3 ✓

⌈6/3⌉ calculation:
Exact: 6/3 = 2
Ceiling: 2

Formula: (6 + 3 - 1) // 3 = 8 // 3 = 2 ✓
(Note: works because 8//3 = 2 in integer division)
```

---

## Practice Problems

### Problem 1: Concatenation of Consecutive Binary Numbers

**Problem:** [LeetCode 1680 - Concatenation of Consecutive Binary Numbers](https://leetcode.com/problems/concatenation-of-consecutive-binary-numbers/)

**Description:** Given an integer `n`, return the decimal value of the binary string formed by concatenating the binary representations of `1` to `n` in order, modulo 10^9 + 7.

**How to Apply Ceiling Division:**
- Use bit length calculation to determine binary representation sizes
- Ceiling division helps compute number of elements with specific bit lengths

---

### Problem 2: Minimum Number of Work Sessions to Finish the Tasks

**Problem:** [LeetCode 1986 - Minimum Number of Work Sessions to Finish the Tasks](https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/)

**Description:** You have a list of tasks with durations and a session time limit. Return the minimum number of work sessions required.

**How to Apply:**
- Lower bound uses ceiling division of total duration by session time
- Bin packing problem with ceiling division lower bound

---

### Problem 3: Smallest Integer Divisible by K

**Problem:** [LeetCode 1015 - Smallest Integer Divisible by K](https://leetcode.com/problems/smallest-integer-divisible-by-k/)

**Description:** Given a positive integer K, find the length of the smallest positive integer N such that N is divisible by K, and N only contains the digit 1.

**How to Apply:**
- Modular arithmetic with ceiling concepts
- Number theory problem with division properties

---

### Problem 4: Minimum Time to Complete Trips

**Problem:** [LeetCode 2187 - Minimum Time to Complete Trips](https://leetcode.com/problems/minimum-time-to-complete-trips/)

**Description:** You are given an array `time` where `time[i]` denotes how long the ith bus takes to complete one trip. Each bus can make multiple trips consecutively. Return the minimum time required for all buses to complete at least `totalTrips` trips.

**How to Apply:**
- Binary search on time with ceiling division for trip counting
- Calculate trips per bus using ceiling division concepts

---

## Video Tutorial Links

### Fundamentals

- [Ceiling Division Tricks](https://www.youtube.com/watch?v=9pC5jS3s4Wg) - Integer arithmetic
- [Python Division Operators](https://www.youtube.com/watch?v=gh4B5K1fGiA) - // vs / vs ceil
- [Integer Overflow in Division](https://www.youtube.com/watch?v=5i7oKodCRJo) - Safe operations

### Applications

- [LeetCode 1680 Solution](https://www.youtube.com/watch?v=Q9aSI8XMz5k) - Binary concatenation
- [Pagination Math](https://www.youtube.com/watch?v=9pC5jS3s4Wg) - Page calculations
- [Bin Packing Bounds](https://www.youtube.com/watch?v=1QG8J1w1z8w) - Lower bounds

---

## Follow-up Questions

### Q1: Why does (a + b - 1) // b work for ceiling division?

**Answer**: When a is divisible by b, adding (b-1) doesn't push it over the next multiple, so we get the exact quotient. When a has a remainder, adding (b-1) pushes it past the next multiple, so integer division gives us the next integer (ceiling).

### Q2: Can (a + b - 1) // b overflow?

**Answer**: Yes! If a and b are large (near max integer), a + b can overflow. Use `a // b + (1 if a % b != 0 else 0)` for overflow-safe calculations.

### Q3: How do I handle ceiling division with negative numbers?

**Answer**: In Python, use `-(-a // b)` which works for all signs. In other languages, you typically need to handle positive and negative cases separately, or convert to floating-point (which may have precision issues for large integers).

### Q4: What's the difference between ceiling division and rounding up?

**Answer**: They're the same for positive numbers. Ceiling division ⌈a/b⌉ gives the smallest integer ≥ a/b. "Rounding up" usually refers to rounding a number to the nearest integer toward +∞, which is the same as ceiling for positive numbers.

### Q5: When should I use floating-point instead of integer arithmetic?

**Answer**: Use floating-point when:
- Working with non-integers
- Precision requirements are low
- Language doesn't support large integers

Use integer arithmetic when:
- Exact results required
- Working with very large integers
- Performance is critical

---

## Summary

Ceiling division is a fundamental operation with elegant integer arithmetic solutions. The formula `(a + b - 1) // b` provides an efficient O(1) way to compute ceilings without floating-point operations, while variants handle overflow and negative numbers.

**Key Takeaways:**

1. **Formula**: `(a + b - 1) // b` for positive integers
2. **Overflow-safe**: `a // b + (1 if a % b else 0)`
3. **Python trick**: `-(-a // b)` handles all signs
4. **Multiple rounding**: Apply formula then multiply back
5. **Applications**: Pagination, allocation, bin packing, alignment

**When to Use:**
- Resource allocation problems
- Pagination calculations
- Bin packing lower bounds
- Memory alignment
- Any problem needing "minimum number of units"

This simple pattern appears frequently in algorithmic problems and system design, making it an essential tool in any programmer's toolkit.
