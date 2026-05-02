# 2-SAT (2-Satisfiability)

## Category
Graphs & Boolean Satisfiability

## Description

2-SAT (2-satisfiability) is the problem of determining whether a Boolean formula in conjunctive normal form with at most 2 literals per clause is satisfiable. It is a fundamental problem in computer science with applications in scheduling, dependency resolution, circuit design, and constraint satisfaction.

The 2-SAT problem is solvable in linear time O(V + E) using strongly connected components (SCC), making it one of the few NP-complete problems that becomes tractable when restricted to 2 literals per clause. The key insight is converting logical implications into a directed graph where finding SCCs reveals contradictions.

---

## Concepts

The 2-SAT algorithm relies on several fundamental concepts that make it efficient.

### 1. Implication Graph

Each clause (a ∨ b) is converted to implications:

| Clause | Implications |
|--------|--------------|
| (a ∨ b) | (¬a → b) ∧ (¬b → a) |
| (¬a ∨ b) | (a → b) ∧ (¬b → ¬a) |
| (a ∨ ¬b) | (¬a → ¬b) ∧ (b → a) |
| (¬a ∨ ¬b) | (a → ¬b) ∧ (b → ¬a) |

**Why it works**: If a is false, then b must be true for the clause (a ∨ b) to be satisfied.

### 2. Variable Representation

Each variable xᵢ and its negation ¬xᵢ are separate nodes:

```
Variable i: node 2*i = xᵢ (true form)
             node 2*i+1 = ¬xᵢ (false form)

Example: n = 3 variables
  x₀ = node 0, ¬x₀ = node 1
  x₁ = node 2, ¬x₁ = node 3
  x₂ = node 4, ¬x₂ = node 5
```

### 3. SCC and Satisfiability

The satisfiability condition:

| Condition | Meaning | Action |
|-----------|---------|--------|
| xᵢ and ¬xᵢ in same SCC | Contradiction found | UNSATISFIABLE |
| xᵢ and ¬xᵢ in different SCCs | No contradiction | SATISFIABLE |

### 4. Assignment from SCC Order

After finding SCCs, assign values based on topological order:

```
If SCC(xᵢ) comes after SCC(¬xᵢ) in topological order:
    Assign xᵢ = TRUE
Else:
    Assign xᵢ = FALSE
```

This ensures that if there's a path from xᵢ to ¬xᵢ, then xᵢ being true would force ¬xᵢ to be true (contradiction), so we assign xᵢ = false.

---

## Frameworks

Structured approaches for solving 2-SAT problems.

### Framework 1: Standard 2-SAT Solver

```
┌─────────────────────────────────────────────────────────────┐
│  2-SAT SOLVER FRAMEWORK                                     │
├─────────────────────────────────────────────────────────────┤
│  Input: n variables, list of clauses (each with 2 literals)  │
│  Output: (satisfiable, assignment)                           │
│                                                              │
│  1. Build implication graph with 2*n nodes                  │
│     For each clause (a ∨ b):                                │
│        - Add edge (¬a → b)                                  │
│        - Add edge (¬b → a)                                  │
│                                                              │
│  2. Find all SCCs using Kosaraju's or Tarjan's algorithm   │
│                                                              │
│  3. Check satisfiability:                                   │
│     For each variable i:                                    │
│        - If SCC(2*i) == SCC(2*i+1): return UNSATISFIABLE   │
│                                                              │
│  4. Build assignment:                                       │
│     For each variable i:                                    │
│        - If SCC(2*i) > SCC(2*i+1): assignment[i] = TRUE      │
│        - Else: assignment[i] = FALSE                        │
│                                                              │
│  5. Return (True, assignment)                                │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: General 2-SAT problems with boolean constraints.

### Framework 2: 2-SAT for Equation Systems

```
┌─────────────────────────────────────────────────────────────┐
│  2-SAT FOR EQUALITY/INEQUALITY CONSTRAINTS                  │
├─────────────────────────────────────────────────────────────┤
│  Input: List of equations/inequalities                       │
│  Format: "a==b" or "a!=b" where a, b are variables           │
│                                                              │
│  1. Map variables to indices (0 to n-1)                     │
│                                                              │
│  2. For each "a==b" constraint:                              │
│     - Add: (a ∧ b) ∨ (¬a ∧ ¬b)                              │
│     - Convert to: (a ∨ ¬b) ∧ (¬a ∨ b)                       │
│                                                              │
│  3. Build 2-SAT instance and solve                           │
│                                                              │
│  4. Verify inequalities separately:                         │
│     - For each "a!=b": check if a and b have different     │
│       values in the assignment                              │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Problems with equality and inequality constraints like LeetCode 990.

### Framework 3: Decision Framework

```
┌─────────────────────────────────────────────────────────────┐
│  CHOOSING 2-SAT VS ALTERNATIVES                             │
├─────────────────────────────────────────────────────────────┤
│  Use 2-SAT when:                                            │
│    ✓ Each clause has at most 2 literals                     │
│    ✓ Boolean variables with implication constraints         │
│    ✓ Need to find satisfying assignment                     │
│    ✓ Linear time solution is required                       │
│                                                              │
│  Use Union-Find when:                                       │
│    ✓ Only equality constraints (transitive relations)       │
│    ✓ No boolean logic, just equivalence                     │
│                                                              │
│  Use General SAT Solver when:                               │
│    ✓ Clauses have 3+ literals (NP-complete, much harder)    │
│    ✓ Need heuristic/approximation methods                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

Different manifestations of the 2-SAT pattern.

### Form 1: Standard 2-SAT

Standard boolean formula with 2 literals per clause.

| Aspect | Details |
|--------|---------|
| **Clauses** | (a ∨ b), (¬a ∨ c), etc. |
| **Output** | SAT/UNSAT + assignment |
| **Time** | O(V + E) |
| **Space** | O(V + E) |

### Form 2: Equality Constraints

Used for equation satisfiability problems.

| Modification | (a == b) becomes (a ∨ ¬b) ∧ (¬a ∨ b) |
|--------------|----------------------------------------|
| **Use Case** | LeetCode 990 - Satisfiability of Equality Equations |
| **Note** | Inequalities checked separately |

### Form 3: Game Theory Applications

Win/lose conditions modeled as boolean variables.

| Approach | Each game state as variable, moves as implications |
|----------|---------------------------------------------------|
| **Example** | Can I Win (LeetCode 464) - game states |
| **Complexity** | 2^n states for n game positions |

### Form 4: Dependency Resolution

Package/installation dependency problems.

| Constraint | If package A requires B: (¬A_installed → ¬A_can_install) |
|------------|----------------------------------------------------------|
| **Use Case** | Package managers, software installation |
| **Output** | Set of packages that can be installed together |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Kosaraju's Algorithm Implementation

Standard SCC finding for 2-SAT:

```python
def solve_2sat_kosaraju(self):
    """Solve 2-SAT using Kosaraju's algorithm."""
    n = 2 * self.n
    visited = [False] * n
    order = []
    
    # First DFS pass - fill order
    def dfs1(v):
        visited[v] = True
        for u in self.graph[v]:
            if not visited[u]:
                dfs1(u)
        order.append(v)
    
    for v in range(n):
        if not visited[v]:
            dfs1(v)
    
    # Build transpose graph
    transpose = [[] for _ in range(n)]
    for v in range(n):
        for u in self.graph[v]:
            transpose[u].append(v)
    
    # Second DFS pass - find SCCs
    visited = [False] * n
    scc_id = [0] * n
    current_scc = 0
    
    def dfs2(v, scc_num):
        visited[v] = True
        scc_id[v] = scc_num
        for u in transpose[v]:
            if not visited[u]:
                dfs2(u, scc_num)
    
    for v in reversed(order):
        if not visited[v]:
            dfs2(v, current_scc)
            current_scc += 1
    
    # Check satisfiability and build assignment
    assignment = [False] * self.n
    for i in range(self.n):
        if scc_id[2*i] == scc_id[2*i+1]:
            return False, []  # Unsatisfiable
        assignment[i] = scc_id[2*i] > scc_id[2*i+1]
    
    return True, assignment
```

### Tactic 2: Tarjan's Algorithm for SCC

More space-efficient SCC finding:

```python
def solve_2sat_tarjan(self):
    """Solve 2-SAT using Tarjan's algorithm (more efficient)."""
    n = 2 * self.n
    index = 0
    stack = []
    on_stack = [False] * n
    indices = [-1] * n
    lowlink = [0] * n
    scc_id = [0] * n
    current_scc = 0
    
    def strongconnect(v):
        nonlocal index, current_scc
        indices[v] = lowlink[v] = index
        index += 1
        stack.append(v)
        on_stack[v] = True
        
        for w in self.graph[v]:
            if indices[w] == -1:
                strongconnect(w)
                lowlink[v] = min(lowlink[v], lowlink[w])
            elif on_stack[w]:
                lowlink[v] = min(lowlink[v], indices[w])
        
        # If v is a root node, pop the stack and generate an SCC
        if lowlink[v] == indices[v]:
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc_id[w] = current_scc
                if w == v:
                    break
            current_scc += 1
    
    for v in range(n):
        if indices[v] == -1:
            strongconnect(v)
    
    # Check satisfiability
    assignment = [False] * self.n
    for i in range(self.n):
        if scc_id[2*i] == scc_id[2*i+1]:
            return False, []
        assignment[i] = scc_id[2*i] > scc_id[2*i+1]
    
    return True, assignment
```

### Tactic 3: Adding OR Constraints

Helper for adding 2-SAT clauses:

```python
def add_or(self, i, f, j, g):
    """
    Add clause (xi = f) OR (xj = g).
    
    Args:
        i, j: variable indices
        f, g: boolean values (True means xi/xj, False means ¬xi/¬xj)
    """
    # (xi = f) OR (xj = g) is equivalent to:
    # (xi ≠ f) → (xj = g) AND (xj ≠ g) → (xi = f)
    
    # First implication: ¬(xi = f) → (xj = g)
    # Which is: (xi = ¬f) → (xj = g)
    u = 2 * i + (0 if f else 1)  # node for ¬xi if f=True, xi if f=False
    v = 2 * j + (1 if g else 0)  # node for xj if g=True, ¬xj if g=False
    self.graph[u].append(v)
    
    # Second implication: ¬(xj = g) → (xi = f)
    u = 2 * j + (0 if g else 1)
    v = 2 * i + (1 if f else 0)
    self.graph[u].append(v)
```

### Tactic 4: LeetCode 990 - Equations Possible

Handling equality equations with Union-Find + 2-SAT:

```python
def equations_possible(equations):
    """
    Check if equations are consistent.
    equations[i] is "a==b" or "a!=b"
    """
    n = 26  # 26 lowercase letters
    ts = TwoSAT(n)
    
    # First pass: add all equality constraints to 2-SAT
    for eq in equations:
        if eq[1] == '=':
            a = ord(eq[0]) - ord('a')
            b = ord(eq[3]) - ord('a')
            # a == b means (a ∨ ¬b) ∧ (¬a ∨ b)
            ts.add_or(a, True, b, False)   # a OR ¬b
            ts.add_or(a, False, b, True)  # ¬a OR b
    
    # Check if 2-SAT is satisfiable
    possible, _ = ts.solve()
    if not possible:
        return False
    
    # Check inequalities don't violate equalities using Union-Find
    parent = list(range(n))
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py
    
    # Process equalities in Union-Find
    for eq in equations:
        if eq[1] == '=':
            a = ord(eq[0]) - ord('a')
            b = ord(eq[3]) - ord('a')
            union(a, b)
    
    # Check that no inequality connects same component
    for eq in equations:
        if eq[1] == '!':
            a = ord(eq[0]) - ord('a')
            b = ord(eq[3]) - ord('a')
            if find(a) == find(b):
                return False
    
    return True
```

### Tactic 5: Variable Count Reduction

When working with limited variables:

```python
def minimize_variables(self, clauses, n):
    """
    Identify and remove unused variables to reduce graph size.
    Returns: (reduced_n, variable_mapping)
    """
    used = set()
    for clause in clauses:
        for lit in clause:
            var = abs(lit) - 1  # Assuming 1-indexed literals
            used.add(var)
    
    # Create mapping from old to new indices
    mapping = {}
    new_idx = 0
    for i in range(n):
        if i in used:
            mapping[i] = new_idx
            new_idx += 1
    
    return new_idx, mapping
```

---

## Python Templates

### Template 1: Complete 2-SAT Solver

```python
from typing import List, Tuple


class TwoSAT:
    """
    2-SAT solver using Kosaraju's algorithm.
    
    Time: O(V + E) for solving
    Space: O(V + E)
    """
    
    def __init__(self, n: int):
        """
        Initialize with n variables (indices 0 to n-1).
        Variable i: node 2*i = xi, node 2*i+1 = ¬xi
        """
        self.n = n
        self.graph = [[] for _ in range(2 * n)]
    
    def add_or(self, i: int, f: bool, j: int, g: bool):
        """
        Add clause (xi = f) OR (xj = g).
        f, g are booleans: True means xi/xj, False means ¬xi/¬xj.
        """
        # (xi = f) OR (xj = g) means:
        # (xi ≠ f) → (xj = g) AND (xj ≠ g) → (xi = f)
        
        u = 2 * i + (0 if f else 1)  # ¬xi if f=True, xi if f=False
        v = 2 * j + (1 if g else 0)  # xj if g=True, ¬xj if g=False
        self.graph[u].append(v)
        
        u = 2 * j + (0 if g else 1)
        v = 2 * i + (1 if f else 0)
        self.graph[u].append(v)
    
    def add_implication(self, i: int, f: bool, j: int, g: bool):
        """Add implication (xi = f) → (xj = g)."""
        self.add_or(i, not f, j, g)
    
    def add_xor(self, i: int, j: int):
        """Add constraint that exactly one of xi, xj is true."""
        self.add_or(i, True, j, True)   # xi ∨ xj
        self.add_or(i, False, j, False)  # ¬xi ∨ ¬xj
    
    def solve(self) -> Tuple[bool, List[bool]]:
        """
        Solve the 2-SAT instance.
        
        Returns:
            (satisfiable, assignment)
            If satisfiable is False, assignment is empty.
        """
        n_nodes = 2 * self.n
        visited = [False] * n_nodes
        order = []
        
        # First DFS pass
        def dfs1(v: int):
            visited[v] = True
            for u in self.graph[v]:
                if not visited[u]:
                    dfs1(u)
            order.append(v)
        
        for v in range(n_nodes):
            if not visited[v]:
                dfs1(v)
        
        # Build transpose graph
        transpose = [[] for _ in range(n_nodes)]
        for v in range(n_nodes):
            for u in self.graph[v]:
                transpose[u].append(v)
        
        # Second DFS pass - find SCCs
        visited = [False] * n_nodes
        scc_id = [0] * n_nodes
        current_scc = 0
        
        def dfs2(v: int, scc_num: int):
            visited[v] = True
            scc_id[v] = scc_num
            for u in transpose[v]:
                if not visited[u]:
                    dfs2(u, scc_num)
        
        for v in reversed(order):
            if not visited[v]:
                dfs2(v, current_scc)
                current_scc += 1
        
        # Check satisfiability and build assignment
        assignment = [False] * self.n
        for i in range(self.n):
            if scc_id[2 * i] == scc_id[2 * i + 1]:
                return False, []  # Contradiction found
            # Variable is true if its SCC comes after negation's SCC
            assignment[i] = scc_id[2 * i] > scc_id[2 * i + 1]
        
        return True, assignment
```

### Template 2: Tarjan's Algorithm 2-SAT

```python
class TwoSATTarjan:
    """2-SAT solver using Tarjan's algorithm (more space efficient)."""
    
    def __init__(self, n: int):
        self.n = n
        self.graph = [[] for _ in range(2 * n)]
    
    def add_or(self, i: int, f: bool, j: int, g: bool):
        u = 2 * i + (0 if f else 1)
        v = 2 * j + (1 if g else 0)
        self.graph[u].append(v)
        u = 2 * j + (0 if g else 1)
        v = 2 * i + (1 if f else 0)
        self.graph[u].append(v)
    
    def solve(self) -> Tuple[bool, List[bool]]:
        n_nodes = 2 * self.n
        index = 0
        stack = []
        on_stack = [False] * n_nodes
        indices = [-1] * n_nodes
        lowlink = [0] * n_nodes
        scc_id = [0] * n_nodes
        current_scc = 0
        
        def strongconnect(v: int):
            nonlocal index, current_scc
            indices[v] = lowlink[v] = index
            index += 1
            stack.append(v)
            on_stack[v] = True
            
            for w in self.graph[v]:
                if indices[w] == -1:
                    strongconnect(w)
                    lowlink[v] = min(lowlink[v], lowlink[w])
                elif on_stack[w]:
                    lowlink[v] = min(lowlink[v], indices[w])
            
            if lowlink[v] == indices[v]:
                while True:
                    w = stack.pop()
                    on_stack[w] = False
                    scc_id[w] = current_scc
                    if w == v:
                        break
                current_scc += 1
        
        for v in range(n_nodes):
            if indices[v] == -1:
                strongconnect(v)
        
        assignment = [False] * self.n
        for i in range(self.n):
            if scc_id[2 * i] == scc_id[2 * i + 1]:
                return False, []
            assignment[i] = scc_id[2 * i] > scc_id[2 * i + 1]
        
        return True, assignment
```

### Template 3: Equality Equations Solver

```python
def equations_possible(equations: List[str]) -> bool:
    """
    LeetCode 990: Satisfiability of Equality Equations.
    Check if equations are consistent.
    """
    n = 26  # 26 lowercase letters
    
    # Union-Find for equalities
    parent = list(range(n))
    
    def find(x: int) -> int:
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x: int, y: int):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py
    
    # First pass: process all equalities
    for eq in equations:
        if eq[1] == '=':
            a = ord(eq[0]) - ord('a')
            b = ord(eq[3]) - ord('a')
            union(a, b)
    
    # Second pass: verify all inequalities
    for eq in equations:
        if eq[1] == '!':
            a = ord(eq[0]) - ord('a')
            b = ord(eq[3]) - ord('a')
            if find(a) == find(b):
                return False
    
    return True
```

### Template 4: 2-SAT with At Most One Constraint

```python
class TwoSATAtMostOne(TwoSAT):
    """2-SAT with "at most one" constraint (at most one variable true)."""
    
    def add_at_most_one(self, vars: List[int]):
        """
        Add constraint that at most one of the variables can be true.
        Uses auxiliary variables for O(n) clauses instead of O(n²).
        """
        n = len(vars)
        if n <= 1:
            return
        
        # Create auxiliary variables
        # aux[i] means "at least one of vars[0..i] is true"
        aux_start = self.n
        self.n += n - 1
        # Extend graph
        self.graph.extend([[] for _ in range(2 * (n - 1))])
        
        # Add constraints
        for i in range(n):
            if i == 0:
                # vars[0] → aux[0]
                self.add_or(vars[0], False, aux_start, True)
            elif i == n - 1:
                # aux[n-2] → vars[n-1]
                self.add_or(aux_start + i - 1, False, vars[i], True)
            else:
                # aux[i-1] → aux[i]
                self.add_or(aux_start + i - 1, False, aux_start + i, True)
                # vars[i] → aux[i]
                self.add_or(vars[i], False, aux_start + i, True)
                # vars[i] → ¬aux[i-1]
                self.add_or(vars[i], False, aux_start + i - 1, False)
```

### Template 5: Range 2-SAT (LeetCode 2513)

```python
def minimize_set(divisor1: int, divisor2: int, uniqueCnt1: int, uniqueCnt2: int) -> int:
    """
    Minimize the set of integers to satisfy divisibility constraints.
    Uses binary search + 2-SAT verification.
    """
    from math import lcm
    
    def is_possible(n: int) -> bool:
        """Check if we can select numbers satisfying constraints."""
        # This is a simplified version - actual implementation depends on problem
        # Count numbers not divisible by divisor1 (set1)
        not_div1 = n - n // divisor1
        # Count numbers not divisible by divisor2 (set2)
        not_div2 = n - n // divisor2
        # Count numbers not divisible by either (both sets)
        not_div_either = n - n // divisor1 - n // divisor2 + n // lcm(divisor1, divisor2)
        
        # Check if we have enough unique numbers
        if not_div1 < uniqueCnt1 or not_div2 < uniqueCnt2:
            return False
        if not_div_either < uniqueCnt1 + uniqueCnt2 - (n - not_div_either):
            return False
        return True
    
    # Binary search on answer
    left, right = 1, 10**10
    answer = right
    
    while left <= right:
        mid = (left + right) // 2
        if is_possible(mid):
            answer = mid
            right = mid - 1
        else:
            left = mid + 1
    
    return answer
```

### Template 6: 2-SAT for Graph Coloring

```python
def two_colorable(n: int, edges: List[List[int]]) -> Tuple[bool, List[int]]:
    """
    Check if graph is bipartite (2-colorable) using 2-SAT.
    Returns (is_bipartite, coloring).
    """
    ts = TwoSAT(n)
    
    # For each edge (u, v): u and v must have different colors
    # Color[u] != Color[v] means (Color[u] XOR Color[v])
    # Which is: (u ∨ v) ∧ (¬u ∨ ¬v)
    for u, v in edges:
        ts.add_or(u, True, v, True)      # u ∨ v
        ts.add_or(u, False, v, False)    # ¬u ∨ ¬v
    
    return ts.solve()
```

---

## When to Use

Use 2-SAT when you need to solve problems involving:

- **Boolean constraints**: Each constraint involves at most 2 boolean variables
- **Implication relationships**: Logic of the form "if A then B"
- **Dependency problems**: Package dependencies, task prerequisites
- **Equality/inequality systems**: Checking consistency of equations
- **Two-coloring problems**: Bipartite graph checking
- **Game theory**: Win/lose conditions with two outcomes

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|-----------------|------------------|---------------|
| **2-SAT (SCC)** | O(V + E) | O(V + E) | Boolean clauses with 2 literals |
| **Union-Find** | O(V + E × α(V)) | O(V) | Only equality constraints |
| **General SAT** | Exponential | Exponential | 3+ literals per clause |
| **Brute Force** | O(2^n) | O(1) | Very small n (< 20) |

### When to Choose Each Approach

- **Choose 2-SAT** when:
  - Each clause has at most 2 literals
  - You need a satisfying assignment
  - Linear time is required
  - Problem has boolean implications

- **Choose Union-Find** when:
  - Only dealing with equivalence/inequality
  - No complex boolean logic
  - Just need to check consistency

- **Choose Brute Force** when:
  - n < 20 variables
  - Quick implementation needed
  - Testing only

---

## Algorithm Explanation

### Core Concept

The 2-SAT algorithm converts boolean satisfiability into a graph reachability problem. Each boolean variable x and its negation ¬x become nodes. Each clause (a ∨ b) becomes two implications: (¬a → b) and (¬b → a). The instance is satisfiable if and only if no variable and its negation are in the same strongly connected component.

### How It Works

#### Step 1: Build Implication Graph

For each clause (a ∨ b):
```
Add edge: ¬a → b
Add edge: ¬b → a
```

**Why this works**: If a is false, then b must be true for the clause to be satisfied.

#### Step 2: Find SCCs

Use Kosaraju's or Tarjan's algorithm to find all strongly connected components in O(V + E) time.

#### Step 3: Check Satisfiability

For each variable xᵢ:
```
If SCC(xᵢ) == SCC(¬xᵢ): return UNSATISFIABLE
```

If a variable and its negation are in the same SCC, there's a path from xᵢ to ¬xᵢ and back, meaning xᵢ → ¬xᵢ → xᵢ. This is a contradiction.

#### Step 4: Build Assignment

Process SCCs in reverse topological order (higher id means earlier in topological order):
```
For each variable i:
    If SCC(xᵢ) > SCC(¬xᵢ): assign xᵢ = TRUE
    Else: assign xᵢ = FALSE
```

This ensures that if there's a path from xᵢ to ¬xᵢ, then xᵢ must be false (otherwise ¬xᵢ would also need to be true, contradiction).

### Visual Walkthrough

**Example**: Clauses (a ∨ b) ∧ (¬a ∨ c) ∧ (¬b ∨ ¬c)

```
Build implication graph:
  (a ∨ b)    → edges: ¬a → b, ¬b → a
  (¬a ∨ c)   → edges: a → c, ¬c → ¬a
  (¬b ∨ ¬c)  → edges: b → ¬c, c → ¬b

Nodes: a, ¬a, b, ¬b, c, ¬c

SCCs found:
  SCC 0: {a, c, ¬b}
  SCC 1: {¬a, b, ¬c}

Check: a and ¬a in different SCCs ✓
       b and ¬b in different SCCs ✓
       c and ¬c in different SCCs ✓

Assignment (SCC 0 > SCC 1):
  a: SCC(a)=0 > SCC(¬a)=1 → TRUE
  b: SCC(b)=1 > SCC(¬b)=0 → FALSE
  c: SCC(c)=0 > SCC(¬c)=1 → TRUE

Verify: (T ∨ F) ∧ (F ∨ T) ∧ (T ∨ F) = T ∧ T ∧ T = SATISFIED ✓
```

### Why 2-SAT is Tractable

- **2 literals limit**: Each clause creates exactly 2 implications
- **Graph structure**: The implication graph has special properties
- **SCC characterization**: Satisfiability reduces to SCC checking
- **Linear time**: Kosaraju's/Tarjan's algorithms run in O(V + E)

### Limitations

- **Only 2 literals**: 3-SAT is NP-complete
- **No optimization**: Only finds satisfying assignment, not optimal
- **Boolean only**: Variables must be true/false

---

## Practice Problems

### Problem 1: Satisfiability of Equality Equations

**Problem:** [LeetCode 990 - Satisfiability of Equality Equations](https://leetcode.com/problems/satisfiability-of-equality-equations/)

**Description:** Given an array of equations representing relationships between variables, return true if all equations can be satisfied simultaneously. Equations are in the form "a==b" or "a!=b".

**How to Apply 2-SAT:**
- Map each unique variable to an index
- For each equality "a==b", add implications to force same value
- Use Union-Find to check inequalities don't violate equalities
- Return true if no contradictions found

---

### Problem 2: Numbers At Most N Given Digit Set

**Problem:** [LeetCode 902 - Numbers At Most N Given Digit Set](https://leetcode.com/problems/numbers-at-most-n-given-digit-set/)

**Description:** We have a sorted set of digits D. Return the number of positive integers that can be written using digits from D that are less than or equal to N.

**How to Apply 2-SAT:**
- This problem uses digit DP with boolean states
- Similar constraint satisfaction pattern
- Count valid numbers using digit-by-digit construction

---

### Problem 3: Numbers With Repeated Digits

**Problem:** [LeetCode 1012 - Numbers With Repeated Digits](https://leetcode.com/problems/numbers-with-repeated-digits/)

**Description:** Given a positive integer N, return the number of positive integers less than or equal to N that have at least 1 repeated digit.

**How to Apply 2-SAT:**
- Digit DP with bitmask tracking used digits
- State includes which digits have been used
- Similar state space exploration as 2-SAT

---

### Problem 4: Minimum Number of Work Sessions to Finish the Tasks

**Problem:** [LeetCode 1986 - Minimum Number of Work Sessions to Finish the Tasks](https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/)

**Description:** There are n tasks assigned to you. The i-th task has difficulty tasks[i]. Each work session lasts sessionTime minutes. Return the minimum number of work sessions needed.

**How to Apply 2-SAT:**
- Can use binary search + 2-SAT verification
- Or use bitmask DP similar to 2-SAT state representation

---

### Problem 5: Maximum Number of Weeks You Can Work

**Problem:** [LeetCode 1953 - Maximum Number of Weeks You Can Work](https://leetcode.com/problems/maximum-number-of-weeks-you-can-work/)

**Description:** There are n projects numbered from 0 to n - 1. You are given an integer array milestones where each milestones[i] denotes the number of milestones the i-th project has. Return the maximum number of weeks you can work.

**How to Apply 2-SAT:**
- Constraint satisfaction with scheduling
- Check if arrangement is possible

---

### Problem 6: Can I Win

**Problem:** [LeetCode 464 - Can I Win](https://leetcode.com/problems/can-i-win/)

**Description:** In the "100 game" two players take turns adding integers to a running total. Given maxChoosableInteger and desiredTotal, return true if the first player can force a win.

**How to Apply 2-SAT:**
- Game state as boolean (winning/losing)
- Implications between states
- Similar recursive structure

---

## Video Tutorial Links

### Fundamentals

- [2-SAT and Implication Graphs - Algorithms Live!](https://www.youtube.com/watch?v=0yGXqE_YQTU) - Comprehensive 2-SAT explanation
- [Strongly Connected Components - William Fiset](https://www.youtube.com/watch?v=9rQMLpQj1O8) - SCC algorithms with visual explanations
- Search for "Kosaraju's Algorithm Abdul Bari" for alternative SCC explanations

### Advanced Topics

- Search for "Tarjan's Algorithm William Fiset" for single-pass SCC algorithm
- [2-SAT Applications - Competitive Programming](https://www.youtube.com/watch?v=0yGXqE_YQTU) - Codeforces and contest problems
- Search for "Boolean Satisfiability MIT OCW" for theoretical foundations

---

## Follow-up Questions

### Q1: What is the difference between 2-SAT and 3-SAT?

**Answer:** 2-SAT is solvable in linear time O(V + E) using SCC, while 3-SAT is NP-complete. The key difference is that with only 2 literals per clause, the implication graph has special structure that makes satisfiability tractable. With 3 literals, we cannot decompose into simple implications.

### Q2: Can 2-SAT handle weighted constraints or optimization?

**Answer:** Standard 2-SAT finds any satisfying assignment, not necessarily optimal. For optimization, you would need:
- Binary search on answer + 2-SAT verification
- MAX-2-SAT (finding assignment satisfying maximum clauses) is NP-hard
- For weighted cases, use ILP or approximation algorithms

### Q3: How to handle "at most one" or "at least k" constraints in 2-SAT?

**Answer:** Pure 2-SAT cannot directly express these, but you can:
- "At most one": Use auxiliary variables with O(n) clauses
- "At least k": Requires exponential encoding or use different approach
- Consider using ILP or pseudo-boolean constraints

### Q4: What is the space complexity advantage of Tarjan's over Kosaraju's?

**Answer:** Both are O(V + E) time, but:
- Kosaraju's: Needs transpose graph (2E space) + two DFS passes
- Tarjan's: Single pass, no transpose needed, O(V) stack space
- Tarjan's is generally preferred for space-constrained environments

### Q5: Can 2-SAT be used for graph bipartiteness checking?

**Answer:** Yes! Graph is bipartite iff it can be 2-colored. Each vertex v becomes a boolean variable (color 0 or 1). For each edge (u, v), add constraint that u ≠ v, which is (u ∨ v) ∧ (¬u ∨ ¬v) in 2-SAT form.

---

## Summary

2-SAT is a fundamental algorithm for boolean satisfiability with exactly 2 literals per clause. It elegantly reduces to finding strongly connected components in an implication graph, yielding a linear-time solution.

**Key Takeaways**:

1. **Implication Graph**: Convert each clause (a ∨ b) to implications (¬a → b) and (¬b → a)
2. **SCC Check**: Instance is satisfiable iff no variable and its negation share an SCC
3. **Linear Time**: O(V + E) using Kosaraju's or Tarjan's algorithm
4. **Assignment**: Variables in later SCCs (topological order) are assigned TRUE
5. **Applications**: Dependency resolution, scheduling, constraint satisfaction

**When to Use 2-SAT**:
- Boolean constraints with at most 2 literals per clause
- Need to find satisfying assignment
- Linear time complexity required
- Implication relationships between variables

**When NOT to Use**:
- 3+ literals per clause (use SAT solvers or approximation)
- Need optimization rather than satisfiability
- Non-boolean variables

2-SAT is one of the rare NP-complete problems that becomes tractable with a simple restriction, making it a powerful tool in competitive programming and algorithm design.
