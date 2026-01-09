# Minimized Maximum of Products Distributed to Any Store

## Problem Description

You are given an integer `n` representing the number of retail stores. There are `m` product types with varying amounts given in the array `quantities`, where `quantities[i]` is the number of products of type `i`.

Distribute all products to the stores following these rules:

1. A store can receive **at most one product type** but can receive any amount of that type.
2. After distribution, let `x` be the **maximum number of products** given to any store.
3. **Minimize `x`**.

Return the minimum possible value of `x`.

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `n = 6, quantities = [11,6]` | `3` |

**Optimal Distribution:**
- Type 0 (11 products): `[2, 3, 3, 3]` across 4 stores
- Type 1 (6 products): `[3, 3]` across 2 stores

Maximum per store: `max(2, 3, 3, 3, 3, 3) = 3`

**Example 2:**

| Input | Output |
|-------|--------|
| `n = 7, quantities = [15,10,10]` | `5` |

**Optimal Distribution:**
- Type 0 (15 products): `[5, 5, 5]` across 3 stores
- Type 1 (10 products): `[5, 5]` across 2 stores
- Type 2 (10 products): `[5, 5]` across 2 stores

Maximum per store: `max(5, 5, 5, 5, 5, 5, 5) = 5`

**Example 3:**

| Input | Output |
|-------|--------|
| `n = 1, quantities = [100000]` | `100000` |

**Explanation:** Only one store receives all 100000 products.

---

## Constraints

- `m == quantities.length`
- `1 <= m <= n <= 10^5`
- `1 <= quantities[i] <= 10^5`

---

## Solution

```python
import math
from typing import List

class Solution:
    def minimizedMaximum(self, n: int, quantities: List[int]) -> int:
        def can_distribute(x: int) -> bool:
            """Check if we can distribute with max x products per store."""
            stores_needed = 0
            for q in quantities:
                stores_needed += math.ceil(q / x)
            return stores_needed <= n
        
        left, right = 1, max(quantities)
        
        while left < right:
            mid = (left + right) // 2
            if can_distribute(mid):
                right = mid  # Can achieve, try smaller
            else:
                left = mid + 1  # Need larger max
        
        return left
```

---

## Explanation

We use **binary search** on the answer `x` (maximum products per store):

1. **Search range**:
   - `left = 1` — minimum possible max
   - `right = max(quantities)` — maximum possible max (one store per product type)

2. **Helper function `can_distribute(x)`**:
   - For each quantity, calculate stores needed: `ceil(q / x)`
   - Return `True` if total stores needed <= `n`

3. **Binary search**:
   - While `left < right`:
     - Calculate `mid = (left + right) // 2`
     - If `can_distribute(mid)`: try smaller (`right = mid`)
     - Otherwise: need larger (`left = mid + 1`)

4. Return `left`, the smallest `x` that works.

---

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | `O(m log max_q)` — `m` quantities, binary search over max quantity |
| Space | `O(1)` — constant extra space |
