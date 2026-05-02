# Hungarian Algorithm

## Category
Graphs & Assignment Problems

## Description

The Hungarian Algorithm (also known as the Kuhn-Munkres algorithm) solves the assignment problem in polynomial time. Given a cost matrix where element (i,j) represents the cost of assigning worker i to job j, the algorithm finds the minimum cost perfect matching - assigning each worker to exactly one job such that the total cost is minimized.

This algorithm is fundamental in operations research and combinatorial optimization. It has applications in task scheduling, resource allocation, transportation problems, and bipartite matching with costs. The algorithm achieves O(n³) time complexity for an n×n cost matrix, making it efficient for moderate-sized assignment problems.

---

## Concepts

The Hungarian Algorithm relies on several fundamental concepts from linear programming and graph theory.

### 1. The Assignment Problem

Finding minimum cost perfect matching in bipartite graph:

| Aspect | Description |
|--------|-------------|
| **Input** | n workers, n jobs, n×n cost matrix |
| **Output** | Assignment minimizing total cost |
| **Constraint** | Each worker gets exactly one job, each job to one worker |
| **Complexity** | O(n³) with Hungarian algorithm |

### 2. Bipartite Matching

Graph representation of assignment:

```
Workers on left, Jobs on right
Edge (i,j) with weight = cost[i][j]
Find minimum weight perfect matching
```

### 3. Potential Functions

Key insight for algorithm efficiency:

| Property | Description |
|----------|-------------|
| **Row potential (u)** | u[i] for each worker i |
| **Column potential (v)** | v[j] for each job j |
| **Reduced cost** | cost[i][j] - u[i] - v[j] |
| **Invariant** | Perfect matching in equality graph is optimal |

### 4. Equality Graph

Edges where reduced cost is zero:

```
Edge (i,j) is in equality graph if:
cost[i][j] = u[i] + v[j]

Theorem: Perfect matching in equality graph = optimal solution
```

---

## Frameworks

Structured approaches for implementing the Hungarian Algorithm.

### Framework 1: Standard Hungarian Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD HUNGARIAN ALGORITHM FRAMEWORK                      │
├─────────────────────────────────────────────────────────────┤
│  Input: Cost matrix cost[n][n]                            │
│  Output: Minimum cost and assignment                        │
│                                                             │
│  1. Initialize potentials:                                   │
│     u[i] = min_j(cost[i][j]) for each row i                │
│     v[j] = min_i(cost[i][j] - u[i]) for each col j        │
│                                                             │
│  2. Iteratively improve matching:                           │
│     For each unmatched worker i:                           │
│        a. Build equality graph edges                         │
│        b. Find augmenting path using BFS/DFS               │
│        c. If found: augment matching                        │
│        d. Else: adjust potentials to add new edges         │
│                                                             │
│  3. When all workers matched: return assignment              │
│                                                             │
│  Time: O(n³)                                               │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard assignment problem with square matrix.

### Framework 2: Rectangular Matrix Handling

```
┌─────────────────────────────────────────────────────────────┐
│  HUNGARIAN FOR RECTANGULAR MATRICES                         │
├─────────────────────────────────────────────────────────────┤
│  When n_workers ≠ n_jobs:                                  │
│                                                             │
│  1. Let size = max(n_workers, n_jobs)                     │
│                                                             │
│  2. Create square matrix of size 'size':                   │
│     - Copy original costs                                   │
│     - Fill extra rows/cols with 0 (or large value)        │
│                                                             │
│  3. Run standard Hungarian algorithm                        │
│                                                             │
│  4. Extract valid assignments (ignore dummy entries)      │
│                                                             │
│  Note: For n_workers > n_jobs, some workers unassigned   │
│        For n_workers < n_jobs, some jobs unassigned        │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Unequal number of workers and jobs.

### Framework 3: Maximum Weight Matching

```
┌─────────────────────────────────────────────────────────────┐
│  MAXIMUM WEIGHT MATCHING FRAMEWORK                           │
├─────────────────────────────────────────────────────────────┤
│  To maximize instead of minimize:                            │
│                                                             │
│  1. Find maximum value in cost matrix: max_cost             │
│                                                             │
│  2. Create new cost matrix:                                │
│     new_cost[i][j] = max_cost - cost[i][j]                │
│                                                             │
│  3. Run Hungarian algorithm on new_cost                     │
│                                                             │
│  4. Result:                                                │
│     max_total = n × max_cost - min_cost_result            │
│                                                             │
│  Alternative: Modify algorithm to work with max directly    │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Maximization version of assignment problem.

---

## Forms

Different manifestations of the Hungarian Algorithm.

### Form 1: Minimization (Standard)

Finding minimum cost assignment.

```python
def hungarian_minimize(cost):
    """Find minimum cost assignment."""
    # Standard implementation
    return min_cost, assignment
```

### Form 2: Maximization

Finding maximum weight assignment.

```python
def hungarian_maximize(profit):
    """Find maximum profit assignment."""
    max_val = max(max(row) for row in profit)
    cost = [[max_val - p for p in row] for row in profit]
    return hungarian_minimize(cost)
```

### Form 3: Rectangular Assignment

When matrix is not square.

```python
def hungarian_rectangular(cost):
    """Handle rectangular cost matrix."""
    n = len(cost)
    m = len(cost[0])
    size = max(n, m)
    
    # Pad to square
    padded = [[0]*size for _ in range(size)]
    for i in range(n):
        for j in range(m):
            padded[i][j] = cost[i][j]
    
    min_cost, assignment = hungarian_minimize(padded)
    
    # Extract valid assignments
    valid = [(i, j) for i, j in assignment if i < n and j < m]
    return min_cost, valid
```

### Form 4: With Constraints

Handling forbidden assignments.

| Constraint | Approach |
|------------|----------|
| **Must assign** | Set cost to 0 or very small value |
| **Cannot assign** | Set cost to infinity or very large |
| **Partial assignment** | Use dummy workers/jobs with cost 0 |

### Form 5: Successive Shortest Path

Alternative implementation using min-cost max-flow.

```python
def hungarian_mcmf(cost):
    """
    Alternative using min-cost max-flow.
    Build flow network and run successive shortest paths.
    """
    # Left side: workers (0 to n-1)
    # Right side: jobs (n to 2n-1)
    # Source: 2n, Sink: 2n+1
    # Edges: source->worker (cap 1, cost 0)
    #        worker->job (cap 1, cost cost[i][j])
    #        job->sink (cap 1, cost 0)
    # Run min-cost max-flow
    pass
```

---

## Tactics

Specific techniques for implementing and optimizing the Hungarian Algorithm.

### Tactic 1: Potential Initialization

Start with good initial potentials:

```python
def initialize_potentials(cost, n):
    """Initialize u and v potentials."""
    u = [0] * (n + 1)  # 1-indexed
    v = [0] * (n + 1)
    p = [0] * (n + 1)  # Matching for jobs
    way = [0] * (n + 1)
    
    for i in range(1, n + 1):
        p[0] = i
        j0 = 0
        minv = [float('inf')] * (n + 1)
        used = [False] * (n + 1)
        
        while True:
            used[j0] = True
            i0 = p[j0]
            delta = float('inf')
            j1 = 0
            
            for j in range(1, n + 1):
                if not used[j]:
                    cur = cost[i0 - 1][j - 1] - u[i0] - v[j]
                    if cur < minv[j]:
                        minv[j] = cur
                        way[j] = j0
                    if minv[j] < delta:
                        delta = minv[j]
                        j1 = j
            
            for j in range(n + 1):
                if used[j]:
                    u[p[j]] += delta
                    v[j] -= delta
                else:
                    minv[j] -= delta
            
            j0 = j1
            if p[j0] == 0:
                break
        
        # Augmenting
        while True:
            j1 = way[j0]
            p[j0] = p[j1]
            j0 = j1
            if j0 == 0:
                break
    
    # p[j] = i means worker i assigned to job j
    assignment = [-1] * n
    for j in range(1, n + 1):
        if p[j] > 0:
            assignment[p[j] - 1] = j - 1
    
    return -v[0], assignment
```

### Tactic 2: Handling Large Costs

Prevent overflow with modulo or scaling:

```python
def hungarian_safe(cost, mod=None):
    """Hungarian with overflow protection."""
    if mod:
        # Work modulo mod
        # Adjust algorithm for modular arithmetic
        pass
    
    # Or use Python's arbitrary precision integers
    return hungarian_minimize(cost)
```

### Tactic 3: Sparse Matrix Optimization

When cost matrix is sparse:

```python
def hungarian_sparse(cost_edges, n):
    """
    Sparse version using adjacency list.
    cost_edges: list of (i, j, cost) for existing edges.
    """
    # Use min-cost max-flow on sparse graph
    # More efficient for sparse matrices
    pass
```

### Tactic 4: Early Termination

When approximate solution acceptable:

```python
def hungarian_approximate(cost, max_iter=None):
    """Hungarian with iteration limit."""
    # Run for max_iter iterations or until convergence
    # Return best solution found
    pass
```

### Tactic 5: Tracking Assignments

Detailed assignment tracking:

```python
def hungarian_with_details(cost):
    """Return detailed assignment information."""
    min_cost, assignment = hungarian_minimize(cost)
    
    details = []
    for worker, job in enumerate(assignment):
        if job >= 0:
            details.append({
                'worker': worker,
                'job': job,
                'cost': cost[worker][job]
            })
    
    return min_cost, assignment, details
```

---

## Python Templates

### Template 1: Standard Hungarian Algorithm

```python
def hungarian_algorithm(cost):
    """
    Hungarian Algorithm for assignment problem.
    
    Args:
        cost: n x n cost matrix
    
    Returns:
        (min_cost, assignment) where assignment[i] = job for worker i
    
    Time: O(n^3)
    Space: O(n^2)
    """
    n = len(cost)
    if n == 0:
        return 0, []
    
    m = len(cost[0])
    # Ensure square matrix
    size = max(n, m)
    
    # Pad if necessary
    padded = [[0] * size for _ in range(size)]
    for i in range(n):
        for j in range(m):
            padded[i][j] = cost[i][j]
    
    # Potentials
    u = [0] * (size + 1)
    v = [0] * (size + 1)
    p = [0] * (size + 1)  # Matching: p[j] = i means i->j
    way = [0] * (size + 1)
    
    for i in range(1, size + 1):
        p[0] = i
        j0 = 0
        minv = [float('inf')] * (size + 1)
        used = [False] * (size + 1)
        
        while True:
            used[j0] = True
            i0 = p[j0]
            delta = float('inf')
            j1 = 0
            
            for j in range(1, size + 1):
                if not used[j]:
                    cur = padded[i0 - 1][j - 1] - u[i0] - v[j]
                    if cur < minv[j]:
                        minv[j] = cur
                        way[j] = j0
                    if minv[j] < delta:
                        delta = minv[j]
                        j1 = j
            
            for j in range(size + 1):
                if used[j]:
                    u[p[j]] += delta
                    v[j] -= delta
                else:
                    minv[j] -= delta
            
            j0 = j1
            if p[j0] == 0:
                break
        
        # Augmenting
        while True:
            j1 = way[j0]
            p[j0] = p[j1]
            j0 = j1
            if j0 == 0:
                break
    
    # Extract assignment
    assignment = [-1] * size
    for j in range(1, size + 1):
        if p[j] > 0:
            assignment[p[j] - 1] = j - 1
    
    # Trim to original size
    assignment = assignment[:n]
    
    # Calculate total cost
    total_cost = sum(cost[i][assignment[i]] 
                     for i in range(n) if assignment[i] < m)
    
    return total_cost, assignment
```

### Template 2: Maximum Weight Matching

```python
def max_weight_hungarian(profit):
    """
    Maximum weight bipartite matching using Hungarian.
    
    Args:
        profit: n x n profit matrix
    
    Returns:
        (max_profit, assignment)
    """
    n = len(profit)
    if n == 0:
        return 0, []
    
    # Find maximum value
    max_val = max(max(row) for row in profit)
    
    # Convert to minimization
    cost = [[max_val - p for p in row] for row in profit]
    
    min_cost, assignment = hungarian_algorithm(cost)
    
    # Convert back
    max_total = n * max_val - min_cost
    
    return max_total, assignment
```

### Template 3: Rectangular Matrix

```python
def hungarian_rectangular(cost):
    """
    Hungarian algorithm for rectangular matrix.
    
    Args:
        cost: n x m matrix (n workers, m jobs)
    
    Returns:
        (total_cost, assignment)
    
    If n <= m: all workers assigned
    If n > m: only m workers assigned
    """
    n = len(cost)
    m = len(cost[0]) if cost else 0
    
    if n <= m:
        # More jobs than workers
        size = m
        padded = [[0] * size for _ in range(size)]
        for i in range(n):
            for j in range(m):
                padded[i][j] = cost[i][j]
        # Extra rows are dummy workers with 0 cost
    else:
        # More workers than jobs
        size = n
        padded = [[0] * size for _ in range(size)]
        for i in range(n):
            for j in range(m):
                padded[i][j] = cost[i][j]
        # Extra columns are dummy jobs with 0 cost
    
    total_cost, full_assignment = hungarian_algorithm(padded)
    
    # Extract valid assignments
    if n <= m:
        assignment = full_assignment[:n]
        # Filter out dummy jobs
        assignment = [j if j < m else -1 for j in assignment]
    else:
        # Only first m workers get real jobs
        assignment = full_assignment[:n]
        valid_count = sum(1 for j in assignment if j < m and j >= 0)
        # assignment[i] = job for worker i, or -1 if unassigned
    
    # Recalculate cost with original matrix
    actual_cost = sum(cost[i][assignment[i]] 
                      for i in range(n) 
                      if assignment[i] >= 0 and assignment[i] < m)
    
    return actual_cost, assignment
```

### Template 4: Assignment with Details

```python
def hungarian_detailed(cost):
    """
    Hungarian algorithm with detailed output.
    
    Returns:
        {
            'total_cost': total cost,
            'assignment': list of (worker, job, cost),
            'unassigned_workers': list,
            'unassigned_jobs': list
        }
    """
    n = len(cost)
    m = len(cost[0]) if cost else 0
    
    total_cost, assignment = hungarian_algorithm(cost)
    
    details = {
        'total_cost': total_cost,
        'assignment': [],
        'unassigned_workers': [],
        'unassigned_jobs': list(range(m))
    }
    
    for worker, job in enumerate(assignment):
        if job >= 0 and job < m:
            details['assignment'].append({
                'worker': worker,
                'job': job,
                'cost': cost[worker][job]
            })
            if job in details['unassigned_jobs']:
                details['unassigned_jobs'].remove(job)
        else:
            details['unassigned_workers'].append(worker)
    
    return details
```

### Template 5: Constraint Handling

```python
def hungarian_with_constraints(cost, must_assign=None, cannot_assign=None):
    """
    Hungarian with assignment constraints.
    
    Args:
        cost: n x m cost matrix
        must_assign: list of (worker, job) that must be paired
        cannot_assign: list of (worker, job) that cannot be paired
    
    Returns:
        (cost, assignment) satisfying constraints if possible
    """
    import copy
    modified_cost = copy.deepcopy(cost)
    n = len(cost)
    m = len(cost[0]) if cost else 0
    
    LARGE = 10**18
    
    # Handle must_assign by setting other costs very high
    if must_assign:
        for w, j in must_assign:
            for col in range(m):
                if col != j:
                    modified_cost[w][col] = LARGE
            for row in range(n):
                if row != w:
                    modified_cost[row][j] = LARGE
    
    # Handle cannot_assign
    if cannot_assign:
        for w, j in cannot_assign:
            modified_cost[w][j] = LARGE
    
    return hungarian_algorithm(modified_cost)
```

### Template 6: Batch Assignment

```python
def batch_assign(cost_matrix_list):
    """
    Solve multiple assignment problems efficiently.
    
    Args:
        cost_matrix_list: List of cost matrices
    
    Returns:
        List of (cost, assignment) tuples
    """
    results = []
    for cost in cost_matrix_list:
        results.append(hungarian_algorithm(cost))
    return results
```

---

## When to Use

Use the Hungarian Algorithm when you need:

- **Optimal Assignment**: Assign workers to jobs minimizing cost
- **Bipartite Matching**: With edge weights/costs
- **Square Matrix**: n workers and n jobs
- **Polynomial Time**: O(n³) is acceptable

### Comparison with Alternatives

| Approach | Time | Best For | Limitations |
|----------|------|----------|-------------|
| **Hungarian** | O(n³) | Dense matrices, exact solution | n ≤ 500 typically |
| **Min-Cost Max-Flow** | O(n³) or better | Sparse matrices, constraints | More complex |
| **Greedy** | O(n²) | Approximation, large n | Not optimal |
| **DP on Subsets** | O(n × 2ⁿ) | Small n (n ≤ 20) | Exponential |
| **Auction Algorithm** | O(n³) avg | Very large n, parallel | Approximate |

### When to Choose Hungarian vs Other Approaches

- **Choose Hungarian** when:
  - Need exact optimal solution
  - Matrix is dense
  - n ≤ 500 (reasonable time)
  - Simple implementation preferred

- **Choose Min-Cost Max-Flow** when:
  - Matrix is sparse
  - Additional constraints needed
  - More flexibility required

- **Choose Greedy** when:
  - Approximation acceptable
  - Very large n
  - Real-time requirements

---

## Algorithm Explanation

### Core Concept

The Hungarian Algorithm maintains potential functions u (for rows) and v (for columns) such that u[i] + v[j] ≤ cost[i][j] for all i,j. It finds a perfect matching in the "equality graph" where u[i] + v[j] = cost[i][j].

**Key Terminology**:
- **Potential**: Dual variables u[i] and v[j]
- **Reduced cost**: cost[i][j] - u[i] - v[j]
- **Equality graph**: Edges where reduced cost is zero
- **Alternating path**: Path alternating between matched and unmatched edges
- **Augmenting path**: Alternating path with unmatched endpoints

### How It Works

#### Step 1: Initialize Potentials

```python
u[i] = min(cost[i])  # Minimum in row i
v[j] = min(cost[i][j] - u[i])  # Minimum in column j after adjusting
```

#### Step 2: Find Augmenting Path

```python
# For each unmatched worker, try to find augmenting path
# Using BFS/DFS in equality graph
# If found: augment matching
# If not: adjust potentials to add more edges
```

#### Step 3: Adjust Potentials

```python
# When stuck, increase u for S (visited rows)
# Decrease v for T (visited columns)
# By minimum reduced cost of edge from S to complement of T
# This adds at least one new edge to equality graph
```

#### Step 4: Termination

```python
# When all workers matched, we have optimal assignment
# The sum of potentials equals minimum cost
```

### Visual Walkthrough

**Example: 3×3 Cost Matrix**:
```
Cost matrix:
    J1  J2  J3
W1 [ 3,  1,  2 ]
W2 [ 2,  4,  3 ]
W3 [ 1,  3,  4 ]

Step 1: Initialize potentials
u[1] = min(3,1,2) = 1
u[2] = min(2,4,3) = 2
u[3] = min(1,3,4) = 1

v[1] = min(3-1, 2-2, 1-1) = min(2,0,0) = 0
v[2] = min(1-1, 4-2, 3-1) = min(0,2,2) = 0
v[3] = min(2-1, 3-2, 4-1) = min(1,1,3) = 1

Equality graph edges (reduced cost = 0):
W1-J2 (1-1-0=0)
W2-J1 (2-2-0=0)
W3-J1 (1-1-0=0), W3-J2 (3-1-0=2≠0)

Try to find perfect matching...
If not possible, adjust potentials and continue.

Final assignment: W1-J2 (1), W2-J3 (3), W3-J1 (1)
Total cost: 5
```

### Why Hungarian Works

1. **Duality**: Potentials provide lower bound on optimal cost
2. **Complementary Slackness**: Matching in equality graph is optimal
3. **Augmentation**: Each iteration increases matching size or improves potentials
4. **Polynomial**: O(n) iterations, each O(n²), total O(n³)

### Limitations

- **Cubic Time**: O(n³) limits n to ~500 in practice
- **Dense Matrix**: Optimized for dense matrices
- **Square Requirement**: Needs equal workers and jobs (or padding)
- **Numerical Issues**: Large costs can cause precision problems

---

## Practice Problems

### Problem 1: Maximum Compatibility Score Sum

**Problem:** [LeetCode 1947 - Maximum Compatibility Score Sum](https://leetcode.com/problems/maximum-compatibility-score-sum/)

**Description:** Assign students to mentors to maximize total compatibility.

**How to Apply Hungarian:**
- Build compatibility score matrix
- Use maximization version of Hungarian

---

### Problem 2: Campus Bikes II

**Problem:** [LeetCode 1066 - Campus Bikes II](https://leetcode.com/problems/campus-bikes-ii/)

**Description:** Assign workers to bikes to minimize total Manhattan distance.

**How to Apply:**
- Cost = Manhattan distance
- Use standard minimization Hungarian
- Or use DP on subsets for small n

---

### Problem 3: Minimum Cost to Connect Two Groups

**Problem:** [LeetCode 1595 - Minimum Cost to Connect Two Groups of Points](https://leetcode.com/problems/minimum-cost-to-connect-two-groups-of-points/)

**Description:** Connect all points in group 1 to all in group 2 with minimum cost.

**How to Apply:**
- This is a variation of assignment
- May need to use min-cost max-flow instead

---

## Video Tutorial Links

### Fundamentals

- [Hungarian Algorithm - Algorithms Live](https://www.youtube.com/watch?v=2v7Dhh6wP8k) - Comprehensive tutorial covering the algorithm basics
- Search for "Assignment Problem Operations Research" for theoretical background from academic sources
- Look for "Hungarian Algorithm Step by Step" walkthrough tutorials

### Problem Solving

- [LeetCode 1947 - Maximum Compatibility Score Solution](https://www.youtube.com/results?search_query=leetcode+1947+hungarian+algorithm) - Video solutions for compatibility score problem
- Search for "Assignment Problem Variations" to learn about different constraint handling
- Look for "Hungarian Algorithm Coding Interview" for implementation tips and practice

---

## Follow-up Questions

### Q1: What's the difference between Hungarian and min-cost max-flow?

**Answer:**
- **Hungarian**: Specialized for assignment, O(n³), dense matrices
- **Min-Cost Max-Flow**: More general, handles constraints, sparse graphs
- **When to use each**: Hungarian for pure assignment, MCMF for constraints
- **Performance**: Similar for assignment, MCMF more flexible

---

### Q2: Can Hungarian handle negative costs?

**Answer:**
- **Yes**: Algorithm works with negative values
- **Shift**: Can add constant to make all positive if needed
- **Caution**: May affect integer overflow with large shifts
- **Better**: Use potentials to handle naturally

---

### Q3: What if the number of workers and jobs are different?

**Answer:**
- **Pad matrix**: Add dummy workers/jobs with 0 cost
- **Rectangular Hungarian**: Some implementations handle directly
- **Unassigned**: Workers or jobs may remain unassigned
- **Cost**: Only count actual assignments in total cost

---

### Q4: How does Hungarian compare to greedy for assignment?

**Answer:**
- **Hungarian**: Optimal solution, O(n³)
- **Greedy**: Fast O(n²), but not optimal
- **Approximation ratio**: Greedy can be arbitrarily bad
- **Use greedy**: When approximation acceptable or n very large

---

### Q5: Can Hungarian be parallelized?

**Answer:**
- **Sequential nature**: Difficult to parallelize effectively
- **Auction algorithm**: Alternative that parallelizes better
- **Matrix operations**: Some steps can use parallel linear algebra
- **Limited benefit**: O(n³) often fast enough for typical n

---

## Summary

The Hungarian Algorithm solves assignment problems optimally in O(n³). Key takeaways:

1. **Purpose**: Minimum cost perfect matching in bipartite graphs
2. **Mechanism**: Potential functions and equality graph
3. **Complexity**: O(n³) time, O(n²) space
4. **Variations**: Minimization, maximization, rectangular matrices
5. **Applications**: Task assignment, resource allocation, scheduling

**When to Use**:
- Optimal assignment needed
- Dense cost matrix
- Moderate size (n ≤ 500)
- Exact solution required

**Implementation Tips**:
- Use 1-indexed arrays for cleaner code
- Handle rectangular matrices by padding
- Convert maximization to minimization
- Use large constants for forbidden assignments

This classic algorithm is essential for optimization problems and competitive programming.
