# Largest Component Size by Common Factor

## Problem Description

Given an integer array of positive integers, return the size of the largest set where any two numbers in the set share a common factor greater than 1.

A component is a set of indices where each pair of numbers in the component shares a common factor greater than 1. We need to find the size of the largest such component.

**Note:** A number is always connected to itself (trivially).

---

## Examples

### Example

**Input:**
```python
nums = [4, 6, 15, 35]
```

**Output:**
```python
4
```

**Explanation:**
All four numbers share common factors:
- 4: factors are 2
- 6: factors are 2, 3
- 15: factors are 3, 5
- 35: factors are 5, 7

Since 4 and 6 share factor 2, 6 and 15 share factor 3, and 15 and 35 share factor 5, all numbers are connected. The largest component size is 4.

### Example 2

**Input:**
```python
nums = [20, 50, 9, 63]
```

**Output:**
```python
2
```

**Explanation:**
- 20: factors are 2, 5
- 50: factors are 2, 5
- 9: factors are 3
- 63: factors are 3, 7

So {20, 50} form one component of size 2, and {9, 63} form another component of size 2. The largest component size is 2.

### Example 3

**Input:**
```python
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

**Output:**
```python
7
```

**Explanation:**
- {4, 8} → factor 2
- {6} → alone
- {2, 10} → factor 2
- {3, 9} → factor 3
- {5} → alone
- {7} → alone
- {1} → alone (no factors > 1)

The largest component is {4, 8, 2, 10, 6} which actually has size 5. But we can also form {4, 8} (2), {2, 10} (2), {6} (1), {3, 9} (2), {5} (1), {7} (1), {1} (1). The answer is 7.

Wait, let me recalculate:
- Numbers with factor 2: 2, 4, 6, 8, 10 → component size 5
- Numbers with factor 3: 3, 6, 9 → connected to above through 6
- Numbers with factor 5: 5, 10 → connected to above through 10

So actually all except 7 and 1 are connected → size 7.

---

## Constraints

- `1 <= nums.length <= 2 × 10^4`
- `1 <= nums[i] <= 10^5`
- The answer is guaranteed to fit in a 32-bit integer.

---

## Pattern: Union-Find with Prime Factorization

This problem is a classic example of the **Union-Find (Disjoint Set Union)** pattern combined with **Prime Factorization**. The key insight is to connect numbers that share common prime factors.

### Core Concept

- **Union-Find**: A data structure that tracks which elements belong to the same set
- **Prime Factorization**: Breaking down each number into its prime factors
- **Grouping by Factors**: All numbers containing the same prime factor belong to the same component

---

## Intuition

The key insight for this problem is understanding that two numbers belong in the same component if they share **any** common factor greater than 1. Since any common factor greater than 1 must have at least one prime factor, we can simplify this to:

> Two numbers are connected if they share **any common prime factor**.

### Key Observations

1. **Prime Factor is Sufficient**: If two numbers share a common factor f > 1, then they share at least one prime factor p (where p divides f).

2. **Factor-Based Grouping**: We can think of each prime factor as a "node" in a graph. Each number connects to all its prime factors.

3. **Union Operation**: When we process a number, we union all its prime factors together. Then we union the number itself with its prime factors.

4. **Transitive Connections**: If number A shares factor with B, and B shares factor with C, then A, B, and C are all in the same component (transitive property).

### Algorithm Overview

1. **Factor each number**: For each number, find all its unique prime factors
2. **Create mappings**: Map each prime factor to an index (for Union-Find)
3. **Union**: For each number, union it with all its prime factors
4. **Count**: Find the component with the maximum size

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Union-Find with Prime Factorization** - Optimal solution
2. **Graph-based BFS/DFS** - Alternative approach
3. **Naive Factor-based Grouping** - Brute force (for understanding)

---

## Approach 1: Union-Find with Prime Factorization (Optimal)

### Algorithm Steps

1. **Precompute smallest prime factors (SPF)** using a modified sieve of Eratosthenes up to max(nums)
2. **Factor each number**: For each number, extract all its unique prime factors using SPF
3. **Map factors to indices**: Assign each unique prime factor an index for Union-Find
4. **Initialize Union-Find**: Create parent and size arrays for all unique factors + nums
5. **Union numbers with factors**: For each number, union the number's index with all its prime factor indices
6. **Find maximum component size**: Track the size of each component

### Why It Works

The Union-Find data structure efficiently manages connected components. By treating each prime factor as a "hub" that connects all numbers containing that factor, we automatically create the correct components. Any two numbers that share a factor will be connected through that factor in the Union-Find structure.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.size = [1] * n
    
    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]
    
    def union(self, x: int, y: int) -> None:
        root_x, root_y = self.find(x), self.find(y)
        if root_x != root_y:
            # Union by size
            if self.size[root_x] < self.size[root_y]:
                root_x, root_y = root_y, root_x
            self.parent[root_y] = root_x
            self.size[root_x] += self.size[root_y]
    
    def get_size(self, x: int) -> int:
        return self.size[self.find(x)]


class Solution:
    def largestComponentSize(self, nums: List[int]) -> int:
        """
        Find the largest component size where any two numbers share a common factor > 1.
        
        Uses Union-Find with prime factorization.
        
        Args:
            nums: List of positive integers
            
        Returns:
            Size of the largest component
        """
        if not nums:
            return 0
        
        max_val = max(nums)
        
        # Step 1: Compute smallest prime factor (SPF) for each number
        spf = list(range(max_val + 1))
        for i in range(2, int(max_val**0.5) + 1):
            if spf[i] == i:  # i is prime
                for j in range(i * i, max_val + 1, i):
                    if spf[j] == j:
                        spf[j] = i
        
        # Step 2: Map each prime factor to an index
        # We'll use indices after the nums array for prime factors
        factor_to_index = {}
        next_index = len(nums)
        
        # Step 3: Factor each number and store factor indices
        num_factors = []  # List of sets containing factor indices for each number
        for num in nums:
            factors = set()
            x = num
            while x > 1:
                p = spf[x]
                if p not in factor_to_index:
                    factor_to_index[p] = next_index
                    next_index += 1
                factors.add(factor_to_index[p])
                while x % p == 0:
                    x //= p
            num_factors.append(factors)
        
        # Step 4: Initialize Union-Find
        uf = UnionFind(next_index)
        
        # Step 5: Union each number with its prime factors
        for i, factors in enumerate(num_factors):
            if factors:
                first_factor = next(iter(factors))
                for f in factors:
                    uf.union(i, f)
        
        # Step 6: Find maximum component size (only consider nums indices)
        max_size = 1 if nums else 0
        for i in range(len(nums)):
            max_size = max(max_size, uf.get_size(i))
        
        return max_size
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <set>
using namespace std;

class UnionFind {
public:
    vector<int> parent;
    vector<int> size;
    
    UnionFind(int n) {
        parent.resize(n);
        size.resize(n, 1);
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    void unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX != rootY) {
            // Union by size
            if (size[rootX] < size[rootY]) {
                swap(rootX, rootY);
            }
            parent[rootY] = rootX;
            size[rootX] += size[rootY];
        }
    }
    
    int getSize(int x) {
        return size[find(x)];
    }
};

class Solution {
public:
    int largestComponentSize(vector<int>& nums) {
        if (nums.empty()) return 0;
        
        int maxVal = *max_element(nums.begin(), nums.end());
        
        // Step 1: Compute smallest prime factor
        vector<int> spf(maxVal + 1);
        for (int i = 0; i <= maxVal; i++) {
            spf[i] = i;
        }
        for (int i = 2; i * i <= maxVal; i++) {
            if (spf[i] == i) {  // i is prime
                for (int j = i * i; j <= maxVal; j += i) {
                    if (spf[j] == j) {
                        spf[j] = i;
                    }
                }
            }
        }
        
        // Step 2: Map each prime factor to an index
        unordered_map<int, int> factorToIndex;
        int nextIndex = nums.size();
        
        // Step 3: Factor each number
        vector<set<int>> numFactors(nums.size());
        for (int i = 0; i < nums.size(); i++) {
            int x = nums[i];
            while (x > 1) {
                int p = spf[x];
                if (factorToIndex.find(p) == factorToIndex.end()) {
                    factorToIndex[p] = nextIndex++;
                }
                numFactors[i].insert(factorToIndex[p]);
                while (x % p == 0) {
                    x /= p;
                }
            }
        }
        
        // Step 4: Initialize Union-Find and union
        UnionFind uf(nextIndex);
        
        for (int i = 0; i < numFactors.size(); i++) {
            if (!numFactors[i].empty()) {
                auto it = numFactors[i].begin();
                int firstFactor = *it;
                for (int f : numFactors[i]) {
                    uf.unite(i, f);
                }
            }
        }
        
        // Step 5: Find maximum component size
        int maxSize = 1;
        for (int i = 0; i < nums.size(); i++) {
            maxSize = max(maxSize, uf.getSize(i));
        }
        
        return maxSize;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class UnionFind {
    int[] parent;
    int[] size;
    
    UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
    }
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    void union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX != rootY) {
            // Union by size
            if (size[rootX] < size[rootY]) {
                int temp = rootX;
                rootX = rootY;
                rootY = temp;
            }
            parent[rootY] = rootX;
            size[rootX] += size[rootY];
        }
    }
    
    int getSize(int x) {
        return size[find(x)];
    }
}

class Solution {
    public int largestComponentSize(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        
        int maxVal = Arrays.stream(nums).max().getAsInt();
        
        // Step 1: Compute smallest prime factor
        int[] spf = new int[maxVal + 1];
        for (int i = 0; i <= maxVal; i++) {
            spf[i] = i;
        }
        for (int i = 2; i * i <= maxVal; i++) {
            if (spf[i] == i) {  // i is prime
                for (int j = i * i; j <= maxVal; j += i) {
                    if (spf[j] == j) {
                        spf[j] = i;
                    }
                }
            }
        }
        
        // Step 2: Map each prime factor to an index
        Map<Integer, Integer> factorToIndex = new HashMap<>();
        int nextIndex = nums.length;
        
        // Step 3: Factor each number
        List<Set<Integer>> numFactors = new ArrayList<>();
        for (int num : nums) {
            Set<Integer> factors = new HashSet<>();
            int x = num;
            while (x > 1) {
                int p = spf[x];
                factorToIndex.putIfAbsent(p, nextIndex++);
                factors.add(factorToIndex.get(p));
                while (x % p == 0) {
                    x /= p;
                }
            }
            numFactors.add(factors);
        }
        
        // Step 4: Initialize Union-Find and union
        UnionFind uf = new UnionFind(nextIndex);
        
        for (int i = 0; i < numFactors.size(); i++) {
            Set<Integer> factors = numFactors.get(i);
            if (!factors.isEmpty()) {
                for (int f : factors) {
                    uf.union(i, f);
                }
            }
        }
        
        // Step 5: Find maximum component size
        int maxSize = 1;
        for (int i = 0; i < nums.length; i++) {
            maxSize = Math.max(maxSize, uf.getSize(i));
        }
        
        return maxSize;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var largestComponentSize = function(nums) {
    if (!nums || nums.length === 0) return 0;
    
    const maxVal = Math.max(...nums);
    
    // Step 1: Compute smallest prime factor (SPF)
    const spf = new Array(maxVal + 1).fill(0);
    for (let i = 0; i <= maxVal; i++) {
        spf[i] = i;
    }
    for (let i = 2; i * i <= maxVal; i++) {
        if (spf[i] === i) {  // i is prime
            for (let j = i * i; j <= maxVal; j += i) {
                if (spf[j] === j) {
                    spf[j] = i;
                }
            }
        }
    }
    
    // Step 2: Map each prime factor to an index
    const factorToIndex = new Map();
    let nextIndex = nums.length;
    
    // Step 3: Factor each number
    const numFactors = [];
    for (let i = 0; i < nums.length; i++) {
        const factors = new Set();
        let x = nums[i];
        while (x > 1) {
            const p = spf[x];
            if (!factorToIndex.has(p)) {
                factorToIndex.set(p, nextIndex++);
            }
            factors.add(factorToIndex.get(p));
            while (x % p === 0) {
                x /= p;
            }
        }
        numFactors.push(factors);
    }
    
    // Union-Find implementation
    class UnionFind {
        constructor(n) {
            this.parent = Array.from({ length: n }, (_, i) => i);
            this.size = new Array(n).fill(1);
        }
        
        find(x) {
            if (this.parent[x] !== x) {
                this.parent[x] = this.find(this.parent[x]);
            }
            return this.parent[x];
        }
        
        union(x, y) {
            const rootX = this.find(x);
            const rootY = this.find(y);
            if (rootX !== rootY) {
                if (this.size[rootX] < this.size[rootY]) {
                    [rootX, rootY] = [rootY, rootX];
                }
                this.parent[rootY] = rootX;
                this.size[rootX] += this.size[rootY];
            }
        }
        
        getSize(x) {
            return this.size[this.find(x)];
        }
    }
    
    // Step 4: Initialize Union-Find and union
    const uf = new UnionFind(nextIndex);
    
    for (let i = 0; i < numFactors.length; i++) {
        const factors = numFactors[i];
        if (factors.size > 0) {
            for (const f of factors) {
                uf.union(i, f);
            }
        }
    }
    
    // Step 5: Find maximum component size
    let maxSize = 1;
    for (let i = 0; i < nums.length; i++) {
        maxSize = Math.max(maxSize, uf.getSize(i));
    }
    
    return maxSize;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N × log(M)) where N is the number of elements and M is the maximum value. The log(M) comes from factoring each number. |
| **Space** | O(N + M) for the Union-Find structure and SPF array |

---

## Approach 2: Graph-Based BFS/DFS

### Algorithm Steps

1. **Build adjacency**: Create a graph where each number connects to its prime factors
2. **Find connected components**: Use BFS or DFS to find all connected components
3. **Count component sizes**: Track the size of each component
4. **Return maximum**: Return the largest component size

### Why It Works

This approach treats the problem as a graph connectivity problem. Each number and each prime factor is a node. An edge exists between a number and its prime factors. Connected components in this graph represent the desired groups.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def largestComponentSize(self, nums: List[int]) -> int:
        """
        Find largest component size using BFS/Graph approach.
        """
        if not nums:
            return 0
        
        max_val = max(nums)
        
        # Compute smallest prime factor
        spf = list(range(max_val + 1))
        for i in range(2, int(max_val**0.5) + 1):
            if spf[i] == i:
                for j in range(i * i, max_val + 1, i):
                    if spf[j] == j:
                        spf[j] = i
        
        # Build graph: map prime factor to all numbers containing it
        factor_to_nums = defaultdict(list)
        
        for idx, num in enumerate(nums):
            x = num
            factors = set()
            while x > 1:
                p = spf[x]
                factors.add(p)
                while x % p == 0:
                    x //= p
            
            for f in factors:
                factor_to_nums[f].append(idx)
        
        # BFS to find connected components
        visited = set()
        max_size = 0
        
        for start in range(len(nums)):
            if start in visited:
                continue
            
            # BFS from this node
            queue = deque([start])
            visited.add(start)
            component_size = 0
            
            while queue:
                node = queue.popleft()
                component_size += 1
                
                # Find all numbers that share a factor with current number
                x = nums[node]
                factors = set()
                temp = x
                while temp > 1:
                    p = spf[temp]
                    factors.add(p)
                    while temp % p == 0:
                        temp //= p
                
                # Add all numbers with shared factors
                for f in factors:
                    for neighbor in factor_to_nums[f]:
                        if neighbor not in visited:
                            visited.add(neighbor)
                            queue.append(neighbor)
            
            max_size = max(max_size, component_size)
        
        return max_size
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <queue>
using namespace std;

class Solution {
public:
    int largestComponentSize(vector<int>& nums) {
        if (nums.empty()) return 0;
        
        int maxVal = *max_element(nums.begin(), nums.end());
        int n = nums.size();
        
        // Compute SPF
        vector<int> spf(maxVal + 1);
        for (int i = 0; i <= maxVal; i++) spf[i] = i;
        for (int i = 2; i * i <= maxVal; i++) {
            if (spf[i] == i) {
                for (int j = i * i; j <= maxVal; j += i) {
                    if (spf[j] == j) spf[j] = i;
                }
            }
        }
        
        // Build factor to numbers mapping
        unordered_map<int, vector<int>> factorToNums;
        for (int i = 0; i < n; i++) {
            int x = nums[i];
            unordered_set<int> factors;
            while (x > 1) {
                int p = spf[x];
                factors.insert(p);
                while (x % p == 0) x /= p;
            }
            for (int f : factors) {
                factorToNums[f].push_back(i);
            }
        }
        
        // BFS
        vector<bool> visited(n, false);
        int maxSize = 0;
        
        for (int start = 0; start < n; start++) {
            if (visited[start]) continue;
            
            queue<int> q;
            q.push(start);
            visited[start] = true;
            int componentSize = 0;
            
            while (!q.empty()) {
                int node = q.front();
                q.pop();
                componentSize++;
                
                int x = nums[node];
                unordered_set<int> factors;
                while (x > 1) {
                    int p = spf[x];
                    factors.insert(p);
                    while (x % p == 0) x /= p;
                }
                
                for (int f : factors) {
                    for (int neighbor : factorToNums[f]) {
                        if (!visited[neighbor]) {
                            visited[neighbor] = true;
                            q.push(neighbor);
                        }
                    }
                }
            }
            
            maxSize = max(maxSize, componentSize);
        }
        
        return maxSize;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int largestComponentSize(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        
        int maxVal = Arrays.stream(nums).max().getAsInt();
        int n = nums.length;
        
        // Compute SPF
        int[] spf = new int[maxVal + 1];
        for (int i = 0; i <= maxVal; i++) spf[i] = i;
        for (int i = 2; i * i <= maxVal; i++) {
            if (spf[i] == i) {
                for (int j = i * i; j <= maxVal; j += i) {
                    if (spf[j] == j) spf[j] = i;
                }
            }
        }
        
        // Build factor to numbers mapping
        Map<Integer, List<Integer>> factorToNums = new HashMap<>();
        for (int i = 0; i < n; i++) {
            Set<Integer> factors = new HashSet<>();
            int x = nums[i];
            while (x > 1) {
                int p = spf[x];
                factors.add(p);
                while (x % p == 0) x /= p;
            }
            for (int f : factors) {
                factorToNums.computeIfAbsent(f, k -> new ArrayList<>()).add(i);
            }
        }
        
        // BFS
        boolean[] visited = new boolean[n];
        int maxSize = 0;
        
        for (int start = 0; start < n; start++) {
            if (visited[start]) continue;
            
            Queue<Integer> queue = new LinkedList<>();
            queue.add(start);
            visited[start] = true;
            int componentSize = 0;
            
            while (!queue.isEmpty()) {
                int node = queue.poll();
                componentSize++;
                
                Set<Integer> factors = new HashSet<>();
                int x = nums[node];
                while (x > 1) {
                    int p = spf[x];
                    factors.add(p);
                    while (x % p == 0) x /= p;
                }
                
                for (int f : factors) {
                    for (int neighbor : factorToNums.getOrDefault(f, new ArrayList<>())) {
                        if (!visited[neighbor]) {
                            visited[neighbor] = true;
                            queue.add(neighbor);
                        }
                    }
                }
            }
            
            maxSize = Math.max(maxSize, componentSize);
        }
        
        return maxSize;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var largestComponentSize = function(nums) {
    if (!nums || nums.length === 0) return 0;
    
    const maxVal = Math.max(...nums);
    const n = nums.length;
    
    // Compute SPF
    const spf = new Array(maxVal + 1).fill(0);
    for (let i = 0; i <= maxVal; i++) spf[i] = i;
    for (let i = 2; i * i <= maxVal; i++) {
        if (spf[i] === i) {
            for (let j = i * i; j <= maxVal; j += i) {
                if (spf[j] === j) spf[j] = i;
            }
        }
    }
    
    // Build factor to numbers mapping
    const factorToNums = new Map();
    for (let i = 0; i < n; i++) {
        const factors = new Set();
        let x = nums[i];
        while (x > 1) {
            const p = spf[x];
            factors.add(p);
            while (x % p === 0) x /= p;
        }
        for (const f of factors) {
            if (!factorToNums.has(f)) {
                factorToNums.set(f, []);
            }
            factorToNums.get(f).push(i);
        }
    }
    
    // BFS
    const visited = new Array(n).fill(false);
    let maxSize = 0;
    
    for (let start = 0; start < n; start++) {
        if (visited[start]) continue;
        
        const queue = [start];
        visited[start] = true;
        let componentSize = 0;
        
        while (queue.length > 0) {
            const node = queue.shift();
            componentSize++;
            
            const factors = new Set();
            let x = nums[node];
            while (x > 1) {
                const p = spf[x];
                factors.add(p);
                while (x % p === 0) x /= p;
            }
            
            for (const f of factors) {
                const neighbors = factorToNums.get(f) || [];
                for (const neighbor of neighbors) {
                    if (!visited[neighbor]) {
                        visited[neighbor] = true;
                        queue.push(neighbor);
                    }
                }
            }
        }
        
        maxSize = Math.max(maxSize, componentSize);
    }
    
    return maxSize;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N × log(M)) for factoring + O(N + E) for BFS where E is number of edges |
| **Space** | O(N + M) for the graph and visited array |

---

## Approach 3: Naive Factor-Based Grouping (For Understanding)

### Algorithm Steps

1. **Group by each prime factor**: For each unique prime factor, collect all numbers that have this factor
2. **Build connections**: Create connections between all numbers that share any factor
3. **Find connected components**: Use Union-Find without optimization
4. **Return maximum**: Return the largest component size

### Why It Works

This is conceptually similar to Approach 1 but with a simpler implementation. The key difference is that we don't precompute SPF - instead, we factor each number naively.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

def factorize(n: int) -> List[int]:
    """Naively factorize a number into prime factors."""
    factors = []
    d = 2
    while d * d <= n:
        while n % d == 0:
            factors.append(d)
            n //= d
        d += 1
    if n > 1:
        factors.append(n)
    return list(set(factors))  # Unique factors only


class Solution:
    def largestComponentSize(self, nums: List[int]) -> int:
        """Naive approach - for understanding only."""
        if not nums:
            return 0
        
        n = len(nums)
        
        # Parent array for Union-Find
        parent = list(range(n))
        
        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        def union(x, y):
            px, py = find(x), find(y)
            if px != py:
                parent[px] = py
        
        # Group numbers by each prime factor
        factor_to_nums = defaultdict(list)
        
        for idx, num in enumerate(nums):
            factors = factorize(num)
            for f in factors:
                factor_to_nums[f].append(idx)
        
        # Union all numbers with common factors
        for factor, indices in factor_to_nums.items():
            for i in range(1, len(indices)):
                union(indices[0], indices[i])
        
        # Count component sizes
        component_count = defaultdict(int)
        for i in range(n):
            component_count[find(i)] += 1
        
        return max(component_count.values()) if component_count else 0
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> factorize(int n) {
    vector<int> factors;
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            factors.push_back(d);
            while (n % d == 0) n /= d;
        }
    }
    if (n > 1) factors.push_back(n);
    return factors;
}

class Solution {
public:
    int largestComponentSize(vector<int>& nums) {
        if (nums.empty()) return 0;
        
        int n = nums.size();
        vector<int> parent(n);
        for (int i = 0; i < n; i++) parent[i] = i;
        
        function<int(int)> find = [&](int x) {
            if (parent[x] != x) parent[x] = find(parent[x]);
            return parent[x];
        };
        
        auto unionSets = [&](int x, int y) {
            int px = find(x), py = find(y);
            if (px != py) parent[px] = py;
        };
        
        unordered_map<int, vector<int>> factorToNums;
        for (int i = 0; i < n; i++) {
            vector<int> factors = factorize(nums[i]);
            for (int f : factors) {
                factorToNums[f].push_back(i);
            }
        }
        
        for (auto& [factor, indices] : factorToNums) {
            for (size_t i = 1; i < indices.size(); i++) {
                unionSets(indices[0], indices[i]);
            }
        }
        
        unordered_map<int, int> componentCount;
        for (int i = 0; i < n; i++) {
            componentCount[find(i)]++;
        }
        
        int maxSize = 0;
        for (auto& [root, count] : componentCount) {
            maxSize = max(maxSize, count);
        }
        
        return maxSize;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    private List<Integer> factorize(int n) {
        List<Integer> factors = new ArrayList<>();
        for (int d = 2; d * d <= n; d++) {
            if (n % d == 0) {
                factors.add(d);
                while (n % d == 0) n /= d;
            }
        }
        if (n > 1) factors.add(n);
        return factors;
    }
    
    public int largestComponentSize(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        
        int n = nums.length;
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        
        int[] find = new int[n];
        for (int i = 0; i < n; i++) {
            find[i] = i;
        }
        
        // Simple find with path compression
        Function<Integer, Integer> findFunc = x -> {
            if (parent[x] != x) parent[x] = findFunc.apply(parent[x]);
            return parent[x];
        };
        
        // Union operation
        Runnable union = () -> {};
        
        Map<Integer, List<Integer>> factorToNums = new HashMap<>();
        for (int i = 0; i < n; i++) {
            List<Integer> factors = factorize(nums[i]);
            for (int f : factors) {
                factorToNums.computeIfAbsent(f, k -> new ArrayList<>()).add(i);
            }
        }
        
        for (List<Integer> indices : factorToNums.values()) {
            for (int i = 1; i < indices.size(); i++) {
                int root0 = indices.get(0);
                int rootI = indices.get(i);
                // Simple union
                int p0 = root0, pI = rootI;
                while (parent[p0] != p0) p0 = parent[p0];
                while (parent[pI] != pI) pI = parent[pI];
                if (p0 != pI) parent[p0] = pI;
            }
        }
        
        Map<Integer, Integer> componentCount = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int root = i;
            while (parent[root] != root) root = parent[root];
            componentCount.put(root, componentCount.getOrDefault(root, 0) + 1);
        }
        
        return componentCount.values().stream().max(Integer::compareTo).orElse(0);
    }
}
```

<!-- slide -->
```javascript
function factorize(n) {
    const factors = [];
    for (let d = 2; d * d <= n; d++) {
        if (n % d === 0) {
            factors.push(d);
            while (n % d === 0) n /= d;
        }
    }
    if (n > 1) factors.push(n);
    return factors;
}

/**
 * @param {number[]} nums
 * @return {number}
 */
var largestComponentSize = function(nums) {
    if (!nums || nums.length === 0) return 0;
    
    const n = nums.length;
    const parent = Array.from({ length: n }, (_, i) => i);
    
    const find = (x) => {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    };
    
    const union = (x, y) => {
        const px = find(x);
        const py = find(y);
        if (px !== py) {
            parent[px] = py;
        }
    };
    
    const factorToNums = new Map();
    for (let i = 0; i < n; i++) {
        const factors = factorize(nums[i]);
        for (const f of factors) {
            if (!factorToNums.has(f)) {
                factorToNums.set(f, []);
            }
            factorToNums.get(f).push(i);
        }
    }
    
    for (const indices of factorToNums.values()) {
        for (let i = 1; i < indices.length; i++) {
            union(indices[0], indices[i]);
        }
    }
    
    const componentCount = new Map();
    for (let i = 0; i < n; i++) {
        const root = find(i);
        componentCount.set(root, (componentCount.get(root) || 0) + 1);
    }
    
    return Math.max(...componentCount.values());
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N × √M) where M is max value (naive factorization) |
| **Space** | O(N + F) where F is number of unique factors |

---

## Comparison of Approaches

| Aspect | Union-Find + SPF | Graph BFS | Naive Factorization |
|--------|-----------------|-----------|---------------------|
| **Time Complexity** | O(N × log M) | O(N × log M) | O(N × √M) |
| **Space Complexity** | O(N + M) | O(N + M) | O(N + F) |
| **Implementation** | Moderate | Moderate | Simple |
| **LeetCode Optimal** | ✅ | ✅ | ❌ (too slow) |
| **Difficulty** | Medium | Medium | Easy |

**Best Approach:** Use Approach 1 (Union-Find with SPF) for the optimal solution. It efficiently factors numbers and uses Union-Find for fast component management.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Amazon, Microsoft
- **Difficulty**: Hard
- **Concepts Tested**: Union-Find, Prime Factorization, Graph Theory, Number Theory

### Learning Outcomes

1. **Union-Find Mastery**: Learn to efficiently manage connected components
2. **Number Theory**: Understand prime factorization and its applications
3. **Optimization**: Learn to precompute SPF for efficient factorization
4. **Graph Thinking**: Convert mathematical problems to graph problems

---

## Related Problems

Based on similar themes (Union-Find, factor-based grouping, number theory):

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Connected Components in an Undirected Graph | [Link](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) | Classic Union-Find |
| Graph Valid Tree | [Link](https://leetcode.com/problems/valid-tree/) | Union-Find connectivity |
| Most Stones Removed with Same Row or Column | [Link](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/) | Union-Find on coordinates |
| Smallest String With Swaps | [Link](https://leetcode.com/problems/smallest-string-with-swaps/) | Union-Find with sorting |
| Satisfiability of Equality Equations | [Link](https://leetcode.com/problems/satisfiability-of-equality-equations/) | Union-Find with constraints |

### Pattern Reference

For more detailed explanations of the Union-Find pattern, see:
- **[Union-Find Pattern](/patterns/union-find)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Largest Component Size by Common Factor](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Clear explanation with visual examples
2. **[Largest Component Size - LeetCode 952](https://www.youtube.com/watch?v=3OMP2rRdYms)** - Detailed walkthrough
3. **[Union-Find Tutorial](https://www.youtube.com/watch?v=0jNmHPfAYPUE)** - Understanding Union-Find data structure

### Related Concepts

- **[Prime Factorization](https://www.youtube.com/watch?v=6PDtcNH0hfo)** - Number theory basics
- **[Sieve of Eratosthenes](https://www.youtube.com/watch?v=pKv寇0T6F2U)** - Prime number generation

---

## Follow-up Questions

### Q1: How would you modify the solution if we wanted to find all component sizes?

**Answer:** Instead of just tracking the maximum, maintain a counter map that tracks the size of each component root. After all unions are done, iterate through all elements, find their root, and count the size of each component.

---

### Q2: What if we needed to output which numbers belong to the largest component?

**Answer:** After building the Union-Find structure, iterate through all numbers, find their root, and group them by root. Then find the root with the maximum size and return all numbers belonging to that root.

---

### Q3: How does this problem change if we consider composite factors instead of just prime factors?

**Answer:** Actually, using only prime factors is sufficient! If two numbers share any common factor > 1, they share at least one prime factor. This is because any composite factor can be broken down into prime factors, and if the composite divides both numbers, so do its prime factors.

---

### Q4: Can you solve this using a different data structure besides Union-Find?

**Answer:** Yes, you can use a graph-based approach with BFS/DFS (Approach 2). Each number and prime factor becomes a node, and edges connect numbers to their prime factors. Then use BFS/DFS to find connected components.

---

### Q5: How would you handle very large numbers (e.g., up to 10^9)?

**Answer:** For larger numbers, you'd need a more efficient factorization algorithm. Options include:
- Precomputed primes up to √10^9 (about 31623)
- Using a probabilistic factorization like Pollard's Rho
- Using a segmented approach with precomputed small primes

---

### Q6: What's the maximum number of unique prime factors any number in the input can have?

**Answer:** The maximum number of distinct prime factors for any number up to 10^5 is limited. Since 2 × 3 × 5 × 7 × 11 × 13 = 30030, and 2 × 3 × 5 × 7 × 11 × 13 × 17 = 510510 > 10^5, the maximum is 6 unique prime factors.

---

## Common Pitfalls

### 1. Not Handling Duplicate Factors
**Issue**: Counting the same factor multiple times for a number.

**Solution**: Use a set to store unique prime factors. For example, 12 = 2² × 3 has unique factors {2, 3}, not {2, 2, 3}.

### 2. Forgetting Number 1
**Issue**: Number 1 has no prime factors and cannot connect to anything.

**Solution**: Handle 1 separately - it always forms a component of size 1 by itself.

### 3. Not Using Path Compression
**Issue**: Union-Find operations become slow without path compression.

**Solution**: Always implement path compression in the find operation.

### 4. Inefficient Factorization
**Issue**: Using trial division for each number is too slow.

**Solution**: Precompute smallest prime factor (SPF) array using a modified sieve, then factor in O(log n) time per number.

### 5. Not Mapping Factors to Indices
**Issue**: Trying to use prime factors directly as indices in Union-Find.

**Solution**: Create a mapping from each unique prime factor to a consecutive index starting from n (after the nums indices).

---

## Summary

The **Largest Component Size by Common Factor** problem demonstrates the power of combining two important algorithmic concepts:

- **Union-Find**: Efficiently manages connected components with near O(1) operations
- **Prime Factorization**: Breaks down numbers into their fundamental building blocks

Key takeaways:
1. Two numbers are in the same component if they share any prime factor
2. Precompute smallest prime factors (SPF) for efficient factorization
3. Map each prime factor to an index for Union-Find
4. Union each number with all its prime factors
5. The largest component size is the answer

This problem is essential for understanding how to apply Union-Find to number theory problems and forms the foundation for more complex factor-based grouping problems.

### Pattern Summary

This problem exemplifies the **Union-Find with Number Theory** pattern, characterized by:
- Using prime factorization to identify connections
- Converting mathematical relationships to graph-like structures
- Efficient component management with Union-Find
- Precomputation for optimization (SPF array)

For more details on this pattern and its variations, see the **[Union-Find Pattern](/patterns/union-find)**.

---

## Additional Resources

- [LeetCode Problem 952](https://leetcode.com/problems/largest-component-size-by-common-factor/) - Official problem page
- [Union-Find - GeeksforGeeks](https://www.geeksforgeeks.org/union-find/) - Detailed Union-Find explanation
- [Prime Factorization - Wikipedia](https://en.wikipedia.org/wiki/Prime_factorization) - Number theory fundamentals
- [Pattern: Union-Find](/patterns/union-find) - Comprehensive pattern guide
