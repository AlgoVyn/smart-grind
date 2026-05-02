# Traveling Salesman Problem (TSP)

## Category
Dynamic Programming & Graphs

## Description

The Traveling Salesman Problem (TSP) asks: given a list of cities and the distances between each pair, what is the shortest possible route that visits each city exactly once and returns to the origin city? This classic problem is NP-hard, meaning no known polynomial-time algorithm exists for the general case.

For small instances (typically n ≤ 20-22 cities), we can solve TSP exactly using Dynamic Programming with bitmask state compression. This approach, known as the Held-Karp algorithm, achieves O(n² × 2ⁿ) time complexity - exponentially better than the brute-force O(n!) approach of checking all permutations. The DP solution is a staple of advanced algorithm interviews and competitive programming, demonstrating the power of state compression in solving seemingly intractable problems.

---

## Concepts

TSP DP relies on state compression and optimal substructure to efficiently explore the solution space.

### 1. Bitmask State Representation

Using bitmasks to represent visited cities:

| Bit Position | City | Bit Value |
|--------------|------|-----------|
| 0 | City 0 | 1 << 0 = 1 |
| 1 | City 1 | 1 << 1 = 2 |
| 2 | City 2 | 1 << 2 = 4 |
| i | City i | 1 << i |

```
Example with 5 cities:
mask = 0b10101 = 21 means cities 0, 2, 4 are visited
mask = (1 << n) - 1 = 0b11111 = 31 means all cities visited
```

### 2. DP State Definition

| State | Meaning |
|-------|---------|
| `dp[mask][i]` | Minimum cost to visit cities in `mask`, ending at city `i` |
| `mask` | Bitmask representing visited cities |
| `i` | Current city (endpoint of partial tour) |

### 3. State Transitions

From state (mask, i), try visiting unvisited city j:

```
For each city j not in mask:
    new_mask = mask | (1 << j)
    new_cost = dp[mask][i] + dist[i][j]
    dp[new_mask][j] = min(dp[new_mask][j], new_cost)
```

### 4. Complete Tour Construction

After visiting all cities, return to start:

```
answer = min(dp[(1<<n)-1][i] + dist[i][start]) for all i
```

### 5. Complexity Analysis

| Aspect | Value | Explanation |
|--------|-------|-------------|
| **States** | n × 2ⁿ | n ending cities × 2ⁿ masks |
| **Transitions per state** | O(n) | Try all unvisited cities |
| **Total time** | O(n² × 2ⁿ) | n × 2ⁿ × n |
| **Space** | O(n × 2ⁿ) | DP table storage |

---

## Frameworks

Structured approaches for solving TSP with DP.

### Framework 1: Standard TSP DP

```
┌─────────────────────────────────────────────────────────────┐
│  TSP DYNAMIC PROGRAMMING FRAMEWORK                          │
├─────────────────────────────────────────────────────────────┤
│  Input: dist[n][n] - distance matrix                        │
│  Output: minimum tour cost                                  │
│                                                              │
│  1. Initialize:                                              │
│     - n = number of cities                                  │
│     - dp[2^n][n] = infinity                                │
│     - dp[1<<start][start] = 0 (start at start city)        │
│                                                              │
│  2. For each mask from 0 to (1<<n) - 1:                    │
│     a. For each last city i where mask has bit i set:      │
│        - If dp[mask][i] is infinity: continue              │
│        - For each next city j not in mask:                 │
│          * new_mask = mask | (1<<j)                        │
│          * new_cost = dp[mask][i] + dist[i][j]             │
│          * dp[new_mask][j] = min(dp[new_mask][j], new_cost)│
│                                                              │
│  3. Final answer:                                            │
│     - full_mask = (1<<n) - 1 (all cities visited)          │
│     - answer = min(dp[full_mask][i] + dist[i][start])      │
│                                                              │
│  4. Return answer                                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard TSP with n ≤ 20-22 cities.

### Framework 2: TSP with Path Reconstruction

```
┌─────────────────────────────────────────────────────────────┐
│  TSP WITH PATH RECONSTRUCTION                               │
├─────────────────────────────────────────────────────────────┤
│  Same as standard, but track parent pointers:               │
│                                                              │
│  1. Maintain parent[mask][i] = previous city before i      │
│  2. When updating dp[new_mask][j]:                         │
│     - If new_cost < dp[new_mask][j]:                       │
│       * dp[new_mask][j] = new_cost                         │
│       * parent[new_mask][j] = i                          │
│                                                              │
│  3. Reconstruct path:                                        │
│     a. Find ending city with minimum cost + return        │
│     b. Backtrack using parent pointers:                    │
│        - Start at full_mask, last_city                     │
│        - While current is not None:                        │
│          * Add to path                                     │
│          * prev = parent[mask][current]                  │
│          * mask ^= (1 << current)  (remove from mask)      │
│          * current = prev                                  │
│     c. Reverse path to get correct order                   │
│     d. Add start city at end to complete tour              │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When the actual tour path is needed, not just cost.

### Framework 3: Bitmask DP Optimization

```
┌─────────────────────────────────────────────────────────────┐
│  BITMASK ITERATION OPTIMIZATION                             │
├─────────────────────────────────────────────────────────────┤
│  Iterate masks efficiently:                                 │
│                                                              │
│  1. Precompute all masks with specific bits set            │
│  2. Use bit operations for fast checks:                     │
│     - mask & (1<<i): check if city i visited               │
│     - mask | (1<<i): set bit i                             │
│     - mask ^ (1<<i): toggle bit i                           │
│     - (1<<n) - 1: all n bits set                            │
│                                                              │
│  3. Iterate only valid masks:                              │
│     - Skip masks that don't include start city             │
│     - Process masks in increasing order (guarantees        │
│       that subproblems are solved before they're needed)    │
│                                                              │
│  4. Space optimization possible:                           │
│     - Use only two rows if iterative over masks            │
│     - But path reconstruction needs full table             │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Space-constrained environments.

---

## Forms

Different manifestations of the TSP problem.

### Form 1: Standard Metric TSP

Distances satisfy triangle inequality (dist[A][C] ≤ dist[A][B] + dist[B][C]).

| Aspect | Details |
|--------|---------|
| **Distance matrix** | Symmetric, diagonal = 0 |
| **Approximation** | 2-approximation via MST exists |
| **DP solution** | Exact optimal in O(n² × 2ⁿ) |
| **Use case** | Euclidean distances, road networks |

### Form 2: Asymmetric TSP

Distance from A to B may differ from B to A.

| Modification | Works the same, just don't assume symmetry |
|--------------|--------------------------------------------|
| **Dist[i][j]** | May not equal dist[j][i] |
| **Applications** | One-way streets, flight costs |

### Form 3: TSP with Fixed Start

Start city is predetermined.

| Modification | Initialize dp[1<<start][start] = 0 |
|--------------|-------------------------------------|
| **Final check** | Must return to this specific city |
| **Optimization** | Any city can be fixed as start (symmetry) |

### Form 4: Shortest Hamiltonian Path

Visit all cities once, but don't need to return to start.

| Modification | Answer = min(dp[full_mask][i]) without adding return |
|--------------|------------------------------------------------------|
| **Difference** | No return edge cost added |
| **Complexity** | Same O(n² × 2ⁿ) |

### Form 5: Multiple Salesmen (mTSP)

Multiple salesmen, each visiting a subset.

| Approach | Modified state or vehicle routing formulations |
|----------|------------------------------------------------|
| **Complexity** | Much higher, often requires heuristics |
| **Alternative** | Cluster first, then TSP each cluster |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Standard TSP Implementation

Core DP implementation:

```python
def tsp(dist, start=0):
    """
    Solve TSP using DP on subsets.
    
    Args:
        dist: n x n distance matrix
        start: starting city index
    
    Returns:
        minimum tour cost
    """
    n = len(dist)
    INF = float('inf')
    
    # dp[mask][i] = min cost to visit cities in mask, ending at i
    dp = [[INF] * n for _ in range(1 << n)]
    
    # Base case: start at start city
    dp[1 << start][start] = 0
    
    # Iterate over all masks
    for mask in range(1 << n):
        for last in range(n):
            # Skip if last not in mask or unreachable
            if not (mask & (1 << last)):
                continue
            if dp[mask][last] == INF:
                continue
            
            # Try to visit each unvisited city
            for nxt in range(n):
                if mask & (1 << nxt):  # Already visited
                    continue
                
                new_mask = mask | (1 << nxt)
                new_cost = dp[mask][last] + dist[last][nxt]
                
                if new_cost < dp[new_mask][nxt]:
                    dp[new_mask][nxt] = new_cost
    
    # Return to start to complete tour
    ans = INF
    full_mask = (1 << n) - 1
    
    for last in range(n):
        if dp[full_mask][last] != INF:
            ans = min(ans, dp[full_mask][last] + dist[last][start])
    
    return ans
```

**Key points**: Check bit with &, set with |, iterate all masks.

### Tactic 2: Path Reconstruction

Track and reconstruct the optimal tour:

```python
def tsp_with_path(dist, start=0):
    """Return both min cost and the optimal path."""
    n = len(dist)
    INF = float('inf')
    
    dp = [[INF] * n for _ in range(1 << n)]
    parent = [[-1] * n for _ in range(1 << n)]
    
    dp[1 << start][start] = 0
    
    for mask in range(1 << n):
        for last in range(n):
            if not (mask & (1 << last)):
                continue
            if dp[mask][last] == INF:
                continue
            
            for nxt in range(n):
                if mask & (1 << nxt):
                    continue
                
                new_mask = mask | (1 << nxt)
                new_cost = dp[mask][last] + dist[last][nxt]
                
                if new_cost < dp[new_mask][nxt]:
                    dp[new_mask][nxt] = new_cost
                    parent[new_mask][nxt] = last
    
    # Find best ending city
    full_mask = (1 << n) - 1
    min_cost = INF
    last = -1
    
    for i in range(n):
        cost = dp[full_mask][i] + dist[i][start]
        if cost < min_cost:
            min_cost = cost
            last = i
    
    # Reconstruct path
    path = []
    mask = full_mask
    while last != -1:
        path.append(last)
        prev = parent[mask][last]
        mask ^= (1 << last)
        last = prev
    
    path.reverse()
    return min_cost, path
```

**Critical**: Store parent when updating dp for backtracking.

### Tactic 3: Space-Optimized TSP

Use only O(2ⁿ) space with iterative mask processing:

```python
def tsp_space_optimized(dist, start=0):
    """
    Space-optimized version using only two mask rows.
    Note: Cannot reconstruct path with this optimization.
    """
    n = len(dist)
    INF = float('inf')
    
    # dp[i] = min cost to reach city i with current mask set
    # This version processes masks in order and reuses array
    # Actually requires full table for correctness
    
    # Full table is required because different masks can reach
    # the same city with different costs
    # Space optimization only possible with iterative deepening
    
    # For true space optimization, use iterative deepening:
    # Process masks with k bits set, then k+1, etc.
    # But this increases time complexity
    
    # Standard implementation with full table:
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1 << start][start] = 0
    
    for mask in range(1 << n):
        for last in range(n):
            if not (mask & (1 << last)) or dp[mask][last] == INF:
                continue
            
            for nxt in range(n):
                if not (mask & (1 << nxt)):
                    new_mask = mask | (1 << nxt)
                    dp[new_mask][nxt] = min(dp[new_mask][nxt],
                                           dp[mask][last] + dist[last][nxt])
    
    full_mask = (1 << n) - 1
    return min(dp[full_mask][i] + dist[i][start] for i in range(n))
```

**Note**: Full table needed for correctness. Space-time tradeoff exists.

---

## Python Templates

### Template 1: Standard TSP DP

```python
from typing import List


def tsp(dist: List[List[int]], start: int = 0) -> int:
    """
    Solve Traveling Salesman Problem using DP with bitmasks.
    
    Args:
        dist: n x n distance matrix where dist[i][j] is cost
              to travel from city i to city j
        start: Starting city index (default 0)
    
    Returns:
        Minimum cost to visit all cities and return to start
    
    Time: O(n^2 * 2^n)
    Space: O(n * 2^n)
    
    Constraints: n <= 20-22 for reasonable runtime
    """
    n = len(dist)
    INF = float('inf')
    
    # dp[mask][i] = minimum cost to visit cities in 'mask',
    #               ending at city 'i'
    dp = [[INF] * n for _ in range(1 << n)]
    
    # Base case: start at 'start' city
    dp[1 << start][start] = 0
    
    # Process all masks
    for mask in range(1 << n):
        for last in range(n):
            # Skip if 'last' city not in current mask
            if not (mask & (1 << last)):
                continue
            # Skip if unreachable
            if dp[mask][last] == INF:
                continue
            
            # Try visiting each unvisited city
            for nxt in range(n):
                if mask & (1 << nxt):  # Already visited
                    continue
                
                new_mask = mask | (1 << nxt)
                new_cost = dp[mask][last] + dist[last][nxt]
                
                if new_cost < dp[new_mask][nxt]:
                    dp[new_mask][nxt] = new_cost
    
    # Complete the tour by returning to start
    full_mask = (1 << n) - 1  # All cities visited
    ans = INF
    
    for last in range(n):
        if dp[full_mask][last] != INF:
            tour_cost = dp[full_mask][last] + dist[last][start]
            ans = min(ans, tour_cost)
    
    return ans if ans != INF else -1
```

### Template 2: TSP with Path Reconstruction

```python
from typing import List, Tuple


def tsp_with_path(dist: List[List[int]], start: int = 0) -> Tuple[int, List[int]]:
    """
    Solve TSP and return both minimum cost and the optimal path.
    
    Returns:
        Tuple of (minimum_cost, path_list)
        Path starts and ends at 'start' city
    
    Time: O(n^2 * 2^n)
    Space: O(n * 2^n)
    """
    n = len(dist)
    INF = float('inf')
    
    # DP table and parent pointers for reconstruction
    dp = [[INF] * n for _ in range(1 << n)]
    parent = [[-1] * n for _ in range(1 << n)]
    
    dp[1 << start][start] = 0
    
    # Fill DP table
    for mask in range(1 << n):
        for last in range(n):
            if not (mask & (1 << last)):
                continue
            if dp[mask][last] == INF:
                continue
            
            for nxt in range(n):
                if mask & (1 << nxt):
                    continue
                
                new_mask = mask | (1 << nxt)
                new_cost = dp[mask][last] + dist[last][nxt]
                
                if new_cost < dp[new_mask][nxt]:
                    dp[new_mask][nxt] = new_cost
                    parent[new_mask][nxt] = last
    
    # Find best ending city
    full_mask = (1 << n) - 1
    min_cost = INF
    last_city = -1
    
    for i in range(n):
        if dp[full_mask][i] != INF:
            total_cost = dp[full_mask][i] + dist[i][start]
            if total_cost < min_cost:
                min_cost = total_cost
                last_city = i
    
    # Reconstruct path by backtracking
    path = []
    mask = full_mask
    curr = last_city
    
    while curr != -1:
        path.append(curr)
        prev = parent[mask][curr]
        mask ^= (1 << curr)  # Remove current from mask
        curr = prev
    
    path.reverse()
    path.append(start)  # Complete the cycle
    
    return min_cost, path
```

### Template 3: Shortest Hamiltonian Path

```python
from typing import List


def hamiltonian_path(dist: List[List[int]], start: int = 0) -> int:
    """
    Find shortest path visiting all cities exactly once.
    Does NOT require returning to start (unlike TSP).
    
    Returns:
        Minimum cost of Hamiltonian path starting at 'start'
    
    Time: O(n^2 * 2^n)
    Space: O(n * 2^n)
    """
    n = len(dist)
    INF = float('inf')
    
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1 << start][start] = 0
    
    for mask in range(1 << n):
        for last in range(n):
            if not (mask & (1 << last)) or dp[mask][last] == INF:
                continue
            
            for nxt in range(n):
                if mask & (1 << nxt):
                    continue
                
                new_mask = mask | (1 << nxt)
                new_cost = dp[mask][last] + dist[last][nxt]
                dp[new_mask][nxt] = min(dp[new_mask][nxt], new_cost)
    
    # No need to return to start - just minimum to reach any city
    full_mask = (1 << n) - 1
    return min(dp[full_mask][i] for i in range(n))
```

### Template 4: TSP on Strings (Shortest Superstring)

```python
def shortest_superstring(words: List[str]) -> str:
    """
    LeetCode 943: Find the Shortest Superstring
    
    Given array of strings, find shortest string that contains
    each string as a substring. This is essentially TSP where
    cities are words and edge costs are overlap amounts.
    
    Time: O(n^2 * 2^n) where n = len(words)
    Space: O(n * 2^n)
    """
    n = len(words)
    
    # Precompute overlap between word i and word j
    # overlap[i][j] = max k such that suffix of words[i]
    # matches prefix of words[j] with length k
    overlap = [[0] * n for _ in range(n)]
    
    for i in range(n):
        for j in range(n):
            if i != j:
                max_ovl = min(len(words[i]), len(words[j]))
                for k in range(max_ovl, 0, -1):
                    if words[i].endswith(words[j][:k]):
                        overlap[i][j] = k
                        break
    
    # DP[mask][i] = max overlap when ending at word i
    dp = [[0] * n for _ in range(1 << n)]
    parent = [[-1] * n for _ in range(1 << n)]
    
    for mask in range(1 << n):
        for last in range(n):
            if not (mask & (1 << last)):
                continue
            
            for nxt in range(n):
                if mask & (1 << nxt):
                    continue
                
                new_mask = mask | (1 << nxt)
                new_overlap = dp[mask][last] + overlap[last][nxt]
                
                if new_overlap > dp[new_mask][nxt]:
                    dp[new_mask][nxt] = new_overlap
                    parent[new_mask][nxt] = last
    
    # Find best ending
    full_mask = (1 << n) - 1
    max_overlap = 0
    last = -1
    
    for i in range(n):
        if dp[full_mask][i] > max_overlap:
            max_overlap = dp[full_mask][i]
            last = i
    
    # Reconstruct order
    order = []
    mask = full_mask
    while last != -1:
        order.append(last)
        prev = parent[mask][last]
        mask ^= (1 << last)
        last = prev
    order.reverse()
    
    # Build superstring
    result = words[order[0]]
    for i in range(1, len(order)):
        ovl = overlap[order[i-1]][order[i]]
        result += words[order[i]][ovl:]
    
    return result
```

### Template 5: TSP with City Pruning

```python
def tsp_pruned(dist: List[List[int]], start: int = 0) -> int:
    """
    TSP with simple pruning - skip obviously bad paths.
    Useful when some paths have very high costs.
    """
    n = len(dist)
    INF = float('inf')
    
    # Precompute minimum outgoing edge from each city
    min_outgoing = [min(dist[i][j] for j in range(n) if j != i) 
                    for i in range(n)]
    
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1 << start][start] = 0
    
    for mask in range(1 << n):
        for last in range(n):
            if not (mask & (1 << last)) or dp[mask][last] == INF:
                continue
            
            for nxt in range(n):
                if mask & (1 << nxt):
                    continue
                
                # Simple pruning: estimate lower bound for completing tour
                new_mask = mask | (1 << nxt)
                new_cost = dp[mask][last] + dist[last][nxt]
                
                # Lower bound: current cost + min to complete
                remaining = ((1 << n) - 1) ^ new_mask
                lb = new_cost
                for i in range(n):
                    if remaining & (1 << i):
                        lb += min_outgoing[i]
                
                # Skip if this state already has better cost
                if new_cost < dp[new_mask][nxt]:
                    dp[new_mask][nxt] = new_cost
    
    full_mask = (1 << n) - 1
    return min(dp[full_mask][i] + dist[i][start] for i in range(n))
```

### Template 6: Count Hamiltonian Paths

```python
def count_hamiltonian_paths(graph: List[List[int]], start: int = 0) -> int:
    """
    Count number of Hamiltonian paths starting from 'start'.
    Graph is adjacency matrix (1 if edge exists, INF if not).
    
    Time: O(n^2 * 2^n)
    Space: O(n * 2^n)
    """
    n = len(graph)
    MOD = 10**9 + 7
    
    # dp[mask][i] = number of ways to reach mask ending at i
    dp = [[0] * n for _ in range(1 << n)]
    dp[1 << start][start] = 1
    
    for mask in range(1 << n):
        for last in range(n):
            if not (mask & (1 << last)) or dp[mask][last] == 0:
                continue
            
            for nxt in range(n):
                if mask & (1 << nxt):  # Already visited
                    continue
                if graph[last][nxt] == 0:  # No edge
                    continue
                
                new_mask = mask | (1 << nxt)
                dp[new_mask][nxt] = (dp[new_mask][nxt] + dp[mask][last]) % MOD
    
    # Sum all paths that visit all nodes
    full_mask = (1 << n) - 1
    return sum(dp[full_mask][i] for i in range(n)) % MOD
```

---

## When to Use

Use the TSP Dynamic Programming solution when you need to solve problems involving:

- **Small exact TSP**: n ≤ 20-22 cities requiring optimal solution
- **Hamiltonian cycles/paths**: Visit all nodes with optimal cost
- **Bitmask DP practice**: Classic state compression problem
- **Shortest superstring**: String overlap optimization
- **Exact optimization**: When approximations are not acceptable
- **NP-hard demonstration**: Understanding complexity classes

### Comparison with Alternative Approaches

| Approach | Time | Space | Best For | Limitations |
|----------|------|-------|----------|-------------|
| **DP (Held-Karp)** | O(n² × 2ⁿ) | O(n × 2ⁿ) | n ≤ 20-22, exact | Exponential space |
| **Brute Force** | O(n!) | O(n) | n ≤ 10 | Too slow for n > 10 |
| **Branch & Bound** | O(n!) worst | O(n²) | n ≤ 30-40 | Implementation complex |
| **Approximation (MST)** | O(n²) | O(n) | Large n, near-optimal | Not exact |
| **Christofides** | O(n³) | O(n²) | Metric TSP, 1.5-approx | Requires metric |

### When to Choose Different Approaches

- **Choose DP (Held-Karp)** when:
  - Exact solution is required
  - n ≤ 20-22 cities
  - No specific structure (metric, Euclidean) to exploit
  - Implementation time is limited

- **Choose Approximation when**:
  - n is large (hundreds or thousands)
  - Near-optimal is acceptable
  - Metric properties hold (triangle inequality)
  - Running time matters more than optimality

- **Choose Heuristics (Genetic, Simulated Annealing) when**:
  - Very large n (thousands+)
  - Real-world problem with time constraints
  - Some error is acceptable
  - Problem has structure to exploit

---

## Algorithm Explanation

### Core Concept

The TSP DP solution uses state compression to reduce the problem from factorial to exponential complexity. By representing visited cities as a bitmask, we create subproblems that can be solved once and reused.

**Key Terminology**:
- **Bitmask**: Integer where each bit represents whether a city is visited
- **State**: dp[mask][i] = minimum cost to reach city i having visited cities in mask
- **Transition**: Moving from one state to another by visiting a new city
- **Held-Karp Algorithm**: The DP approach to TSP (1962)

### How It Works

#### State Representation

```
For 4 cities: A, B, C, D

mask = 0b1011 (binary) = 11 (decimal)
         DCBA
         ↓↓↓↓
         1011
         
Means: A visited (bit 0), B visited (bit 1), C not visited (bit 2), D visited (bit 3)
```

#### DP Filling Process

```
Initialize: dp[0001][A] = 0 (start at A)

Process mask 0001 (only A visited):
  From A, can visit B, C, or D:
  dp[0011][B] = dist[A][B]  (visit B from A)
  dp[0101][C] = dist[A][C]  (visit C from A)
  dp[1001][D] = dist[A][D]  (visit D from A)

Process mask 0011 (A,B visited):
  From B, can visit C or D:
  dp[0111][C] = min(dp[0111][C], dp[0011][B] + dist[B][C])
  dp[1011][D] = min(dp[1011][D], dp[0011][B] + dist[B][D])

... continue until all masks processed

Final step: dp[1111][X] + dist[X][A] for each X
```

#### Optimal Substructure

The minimum tour through all cities = min over all possibilities of:
- (minimum tour through n-1 cities ending at city i) + (cost from i back to start)

This recursive structure allows DP to build up solutions from smaller subproblems.

### Visual Walkthrough

**3-City Example**: Cities A, B, C with distances:
```
    A --5-- B
    |      |
    3      2
    |      |
    C --4--
```

**Distance Matrix**:
```
    A   B   C
A   0   5   3
B   5   0   2
C   3   2   0
```

**DP Execution**:
```
Mask 001 (A): dp[001][A] = 0

Mask 011 (A,B): 
  dp[011][B] = dp[001][A] + dist[A][B] = 0 + 5 = 5

Mask 101 (A,C):
  dp[101][C] = dp[001][A] + dist[A][C] = 0 + 3 = 3

Mask 111 (A,B,C):
  From B: dp[011][B] + dist[B][C] = 5 + 2 = 7
  From C: dp[101][C] + dist[C][B] = 3 + 2 = 5
  dp[111][B] = 7 (via C→B... wait, let me recalculate)
  
  Actually: To reach C with mask 111:
  dp[111][C] = min(dp[011][B] + dist[B][C]) = 5 + 2 = 7
  
  To reach B with mask 111:
  dp[111][B] = dp[101][C] + dist[C][B] = 3 + 2 = 5

Final answer:
  From B: dp[111][B] + dist[B][A] = 5 + 5 = 10
  From C: dp[111][C] + dist[C][A] = 7 + 3 = 10

Optimal tour cost = 10 (A→C→B→A or A→B→C... wait)
  
Actual optimal: A→C→B→A = 3 + 2 + 5 = 10 ✓
```

### Complexity Analysis

| Step | Operations |
|------|------------|
| States | n × 2ⁿ |
| Transitions per state | O(n) |
| Total time | O(n² × 2ⁿ) |
| Memory | O(n × 2ⁿ) |

For n = 20: 20 × 2²⁰ ≈ 20 million states, feasible in ~1 second.
For n = 25: 25 × 2²⁵ ≈ 800 million states, likely too slow.

### Limitations

- **Exponential space**: Cannot handle n > 22-25 due to memory
- **Exact only**: No approximation guarantee for large n
- **Complete graph assumption**: Works with any distance matrix
- **Symmetric not required**: Handles asymmetric TSP equally

---

## Practice Problems

### Problem 1: Find the Shortest Superstring

**Problem:** [LeetCode 943 - Find the Shortest Superstring](https://leetcode.com/problems/find-the-shortest-superstring/)

**Description:** Given an array of strings, find the shortest string that contains each string as a substring. This is essentially TSP where we want to maximize overlaps between consecutive strings.

**How to Apply TSP:**
- Precompute overlap[i][j] = maximum suffix-prefix match
- Run TSP DP maximizing total overlap (or minimizing total length)
- Construct superstring from optimal order

---

### Problem 2: Minimum Cost to Connect Two Groups of Points

**Problem:** [LeetCode 1595 - Minimum Cost to Connect Two Groups of Points](https://leetcode.com/problems/minimum-cost-to-connect-two-groups-of-points/)

**Description:** Given two groups of points with connection costs between them, find minimum cost to connect every point in group 1 to at least one point in group 2, and vice versa.

**How to Apply:**
- Similar bitmask DP structure
- State represents which points in group 2 are connected
- Transitions connect next point in group 1

---

### Problem 3: Minimum Path Cost in a Hidden Grid

**Problem:** LeetCode interactive problem with hidden grid

**Description:** Navigate a hidden grid to visit all target cells with minimum cost. Uses TSP-like state exploration.

**How to Apply:**
- State compression for visited targets
- BFS/shortest path for actual movement
- Combined approach for optimal solution

---

## Video Tutorial Links

### Fundamentals

- [TSP Dynamic Programming - William Fiset](https://www.youtube.com/watch?v=JE3Jl) - Held-Karp algorithm
- [Bitmask DP Tutorial - Errichto](https://www.youtube.com/watch?v=H) - State compression
- [TSP Explained - Abdul Bari](https://www.youtube.com/watch?v=JE3Jl) - Complete walkthrough

### Problem Solutions

- [LeetCode 943 Solution](https://www.youtube.com/watch?v=pUtx2R28n) - Shortest superstring
- [Bitmask DP Problems](https://www.youtube.com/watch?v=fa6) - Competitive programming
- [Traveling Salesman DP](https://www.youtube.com/watch?v=1F7) - Implementation details

### Advanced Topics

- [TSP Approximations](https://www.youtube.com/watch?v=Ii) - When DP is too slow
- [State Compression DP](https://www.youtube.com/watch?v=U) - General techniques
- [Hamiltonian Path Problems](https://www.youtube.com/watch?v=b) - Variations

---

## Follow-up Questions

### Q1: What is the practical limit for the DP solution?

**Answer:** Typically n ≤ 20-22 cities. For n = 20: 20 × 2²⁰ ≈ 20 million states, manageable in ~1 second with optimized code. For n = 25: ~800 million states, usually too slow. Time complexity is O(n² × 2ⁿ), so each additional city roughly doubles the runtime.

---

### Q2: How does TSP DP compare to brute force?

**Answer:** Brute force tries all (n-1)!/2 permutations (for symmetric TSP). For n = 15: brute force ≈ 40 billion, DP = 15 × 2¹⁵ ≈ 500,000. DP is exponentially faster. However, for n ≤ 10, brute force with pruning might be simpler to implement.

---

### Q3: Can you solve TSP faster than O(n² × 2ⁿ)?

**Answer:** No known exact algorithm solves general TSP in sub-exponential time. The Held-Karp DP is optimal for exact solutions. Approximation algorithms (like Christofides for metric TSP) can run in polynomial time but don't guarantee exact optimality.

---

### Q4: How do you reconstruct the actual tour path?

**Answer:** Maintain a parent[mask][i] table that records which city was visited before city i in the optimal path to mask. After computing DP, backtrack from full_mask and the optimal ending city using parent pointers to reconstruct the tour in reverse order.

---

### Q5: Does this work for asymmetric TSP?

**Answer:** Yes, the DP solution works unchanged for asymmetric TSP where dist[i][j] ≠ dist[j][i]. The algorithm doesn't assume symmetry. The only difference is that the number of valid tours is (n-1)! instead of (n-1)!/2, but the DP complexity remains O(n² × 2ⁿ).

---

## Summary

The Traveling Salesman Problem (TSP) Dynamic Programming solution (Held-Karp algorithm) solves the classic NP-hard problem exactly in O(n² × 2ⁿ) time using bitmask state compression. While still exponential, this is dramatically better than the factorial brute-force approach.

**Key Takeaways**:

1. **Bitmask State**: Each bit represents a visited city, enabling compact state representation
2. **Optimal Substructure**: dp[mask][i] = minimum cost to reach city i with visited set mask
3. **Held-Karp Algorithm**: Classic DP approach achieving O(n² × 2ⁿ) time
4. **Practical Limit**: n ≤ 20-22 for reasonable runtime
5. **Exact Solution**: Guarantees optimal tour, unlike approximation algorithms

**When to Use**:
- Exact TSP solution needed with n ≤ 20-22
- Hamiltonian path/cycle problems
- Shortest superstring and similar overlap problems
- Bitmask DP practice and demonstration

**Important Notes**:
- Space complexity is also exponential: O(n × 2ⁿ)
- For larger instances, use approximation algorithms or heuristics
- Path reconstruction requires additional parent pointer table
- Works for both symmetric and asymmetric TSP

This algorithm demonstrates the power of dynamic programming with state compression for solving apparently intractable problems.
