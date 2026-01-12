# Largest Component Size By Common Factor

## Problem Description

You are given an array of **unique positive integers** `nums`. Consider the following graph:

- There are `nums.length` nodes, labeled `nums[0]` to `nums[n-1]`
- There is an **undirected edge** between `nums[i]` and `nums[j]` if they share a common factor **greater than 1**

Return the **size of the largest connected component** in this graph.

---

## Examples

### Example 1

| Input | Output |
|-------|--------|
| `nums = [4,6,15,35]` | `4` |

**Explanation:** All numbers share common factors:
- `4 = 2×2`
- `6 = 2×3`
- `15 = 3×5`
- `35 = 5×7`

All are connected through factors 2, 3, and 5.

### Example 2

| Input | Output |
|-------|--------|
| `nums = [20,50,9,63]` | `2` |

**Explanation:** Two components:
- `{20, 50}` (share factor 10/2)
- `{9, 63}` (share factor 9)

### Example 3

| Input | Output |
|-------|--------|
| `nums = [2,3,6,7,4,12,21,39]` | `8` |

**Explanation:** All numbers are connected.

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 ≤ nums.length ≤ 2 × 10^4` | Array size |
| `1 ≤ nums[i] ≤ 10^5` | Element values |
| All values are unique | No duplicates |

---

## Solution

```python
import math
from typing import List
from collections import defaultdict

class Solution:
    def largestComponentSize(self, nums: List[int]) -> int:
        def factor(x: int) -> set:
            """Get prime factors of x."""
            factors = set()
            # Check divisibility up to sqrt(x)
            for i in range(2, int(math.sqrt(x)) + 1):
                while x % i == 0:
                    factors.add(i)
                    x //= i
            if x > 1:
                factors.add(x)
            return factors
        
        n = len(nums)
        parent = list(range(n))
        rank = [0] * n
        
        # Union-Find: Find with path compression
        def find(x: int) -> int:
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        # Union-Find: Union by rank
        def union(x: int, y: int) -> None:
            px, py = find(x), find(y)
            if px == py:
                return
            if rank[px] < rank[py]:
                parent[px] = py
            elif rank[px] > rank[py]:
                parent[py] = px
            else:
                parent[py] = px
                rank[px] += 1
        
        # Group indices by their prime factors
        groups = defaultdict(list)
        for i, num in enumerate(nums):
            for p in factor(num):
                groups[p].append(i)
        
        # Union all indices sharing a prime factor
        for indices in groups.values():
            for j in range(1, len(indices)):
                union(indices[0], indices[j])
        
        # Count component sizes
        count = defaultdict(int)
        for i in range(n):
            root = find(i)
            count[root] += 1
        
        return max(count.values()) if count else 0
```

---

## Explanation

We model this as a **graph connectivity problem** and use **Union-Find** to efficiently find connected components:

### Key Insight

Two numbers are connected if they share **any prime factor**. Instead of checking all pairs (O(n²)), we:
1. Factorize each number
2. Group indices by their prime factors
3. Union all indices in the same group

### Algorithm Steps

1. **Factorize:** Get all prime factors for each number
2. **Group:** Map each prime factor to all indices containing it
3. **Union:** For each factor group, union all indices together
4. **Count:** Count the size of each component
5. **Result:** Return the maximum component size

---

## Complexity Analysis

| Metric | Complexity | Description |
|--------|------------|-------------|
| **Time** | `O(n × sqrt(M))` | Factorization for each number (M = max value) |
| **Space** | `O(n + F)` | Union-Find + factor groups (F = total factors) |

---

## Follow-up Challenge

Can you optimize factorization using the **Sieve of Eratosthenes**?

**Approach:**
1. Precompute smallest prime factor (SPF) for all numbers up to max(nums)
2. Use SPF for O(log n) factorization per number

```python
def sieve_spf(limit: int) -> List[int]:
    spf = list(range(limit + 1))
    for i in range(2, int(math.sqrt(limit)) + 1):
        if spf[i] == i:  # i is prime
            for j in range(i * i, limit + 1, i):
                if spf[j] == j:
                    spf[j] = i
    return spf
```
