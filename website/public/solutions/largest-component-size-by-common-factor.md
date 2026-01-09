# Largest Component Size By Common Factor

## Problem Description
You are given an integer array of unique positive integers nums. Consider the following graph:

There are nums.length nodes, labeled nums[0] to nums[nums.length - 1],
There is an undirected edge between nums[i] and nums[j] if nums[i] and nums[j] share a common factor greater than 1.

Return the size of the largest connected component in the graph.
 
Example 1:
Input: nums = [4,6,15,35]
Output: 4

Example 2:
Input: nums = [20,50,9,63]
Output: 2

Example 3:
Input: nums = [2,3,6,7,4,12,21,39]
Output: 8

 
Constraints:

1 <= nums.length <= 2 * 104
1 <= nums[i] <= 105
All the values of nums are unique.
## Solution

```python
import math
from typing import List
from collections import defaultdict

class Solution:
    def largestComponentSize(self, nums: List[int]) -> int:
        def factor(x):
            factors = set()
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
        
        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        def union(x, y):
            px, py = find(x), find(y)
            if px != py:
                if rank[px] < rank[py]:
                    parent[px] = py
                elif rank[px] > rank[py]:
                    parent[py] = px
                else:
                    parent[py] = px
                    rank[px] += 1
        
        groups = defaultdict(list)
        for i, num in enumerate(nums):
            for p in factor(num):
                groups[p].append(i)
        
        for p, indices in groups.items():
            for j in range(1, len(indices)):
                union(indices[0], indices[j])
        
        count = defaultdict(int)
        for i in range(n):
            count[find(i)] += 1
        return max(count.values()) if count else 0
```

## Explanation
We model the problem as a graph where nodes are indices of nums, and edges connect indices if their nums share a common factor >1.

To find connected components efficiently, we use Union-Find.

For each num, we factorize it to get its prime factors. We group indices by their prime factors.

For each prime factor p, we union all indices that have p as a factor.

After unioning, we count the size of each component and return the maximum.

Time complexity: O(n * log M), where M is max num, for factorization, plus union operations.
Space complexity: O(n), for Union-Find and groups.
