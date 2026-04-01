## Graph DFS: Tactics & Applications

What tactical patterns leverage DFS for problem solving?

<!-- front -->

---

### Tactic 1: Cycle Detection and Classification

```python
def classify_edges(graph):
    """
    Classify edges during DFS:
    - Tree edges: to unvisited node
    - Back edges: to ancestor (cycle)
    - Forward edges: to descendant (not tree edge)
    - Cross edges: to other subtree
    """
    n = len(graph)
    entry = [0] * n  # Entry time
    exit = [0] * n   # Exit time
    time = [0]
    
    edges = {'tree': [], 'back': [], 'forward': [], 'cross': []}
    
    def dfs(u):
        time[0] += 1
        entry[u] = time[0]
        
        for v in graph[u]:
            if entry[v] == 0:  # Unvisited
                edges['tree'].append((u, v))
                dfs(v)
            elif exit[v] == 0:  # Visited but not exited (ancestor)
                edges['back'].append((u, v))
            elif entry[u] < entry[v]:  # Descendant
                edges['forward'].append((u, v))
            else:  # Cross edge
                edges['cross'].append((u, v))
        
        time[0] += 1
        exit[u] = time[0]
    
    for i in range(n):
        if entry[i] == 0:
            dfs(i)
    
    return edges
```

---

### Tactic 2: Articulation Points and Bridges

```python
def find_articulation_points(graph):
    """
    Find articulation points (cut vertices)
    Using DFS low-link values
    """
    n = len(graph)
    discovery = [0] * n
    low = [0] * n
    visited = [False] * n
    articulation = [False] * n
    time = [0]
    
    def dfs(u, parent):
        children = 0
        time[0] += 1
        discovery[u] = low[u] = time[0]
        visited[u] = True
        
        for v in graph[u]:
            if not visited[v]:
                children += 1
                dfs(v, u)
                
                low[u] = min(low[u], low[v])
                
                # Articulation point condition
                if parent != -1 and low[v] >= discovery[u]:
                    articulation[u] = True
            elif v != parent:
                low[u] = min(low[u], discovery[v])
        
        # Root is articulation if it has 2+ children
        if parent == -1 and children > 1:
            articulation[u] = True
    
    for i in range(n):
        if not visited[i]:
            dfs(i, -1)
    
    return [i for i, is_art in enumerate(articulation) if is_art]

def find_bridges(graph):
    """Similar approach for bridges (cut edges)"""
    # Bridge: low[v] > discovery[u] for edge (u, v)
    pass
```

---

### Tactic 3: Tree DP on DFS

```python
def tree_dp_dfs(graph, root):
    """
    Dynamic programming on trees using DFS
    Example: Maximum independent set on tree
    """
    n = len(graph)
    dp = [[0, 0] for _ in range(n)]  # [not taken, taken]
    
    def dfs(u, parent):
        dp[u][1] = 1  # Taking u
        
        for v in graph[u]:
            if v != parent:
                dfs(v, u)
                # Not taking u: can take or not take children
                dp[u][0] += max(dp[v][0], dp[v][1])
                # Taking u: cannot take children
                dp[u][1] += dp[v][0]
    
    dfs(root, -1)
    return max(dp[root][0], dp[root][1])
```

---

### Tactic 4: Re-rooting Technique

```python
def rerooting_dfs(graph):
    """
    Compute DP values for all possible roots efficiently
    """
    n = len(graph)
    dp_down = [0] * n  # DP when rooted at node, downward only
    dp_up = [0] * n    # DP considering parent contributions
    answer = [0] * n    # Final answer for each root
    
    # First DFS: compute downward DP
    def dfs1(u, parent):
        dp_down[u] = 1  # Base case
        for v in graph[u]:
            if v != parent:
                dfs1(v, u)
                dp_down[u] += dp_down[v]
    
    # Second DFS: compute answers using rerooting
    def dfs2(u, parent, parent_contribution):
        # Calculate answer for u as root
        children_sum = sum(dp_down[v] for v in graph[u] if v != parent)
        answer[u] = children_sum + parent_contribution
        
        # Pass contributions to children
        for v in graph[u]:
            if v != parent:
                # Contribution from all siblings
                sibling_sum = children_sum - dp_down[v]
                # Plus parent's contribution and self
                new_contrib = sibling_sum + parent_contribution + 1
                dfs2(v, u, new_contrib)
    
    dfs1(0, -1)
    dfs2(0, -1, 0)
    return answer
```

---

### Tactic 5: Backtracking with Pruning

```python
def backtrack_dfs(choices, target):
    """
    General backtracking framework using DFS
    """
    best = [None]
    
    def dfs(current, index, remaining):
        # Pruning: if remaining < 0, impossible
        if remaining < 0:
            return
        
        # Success condition
        if index == len(choices):
            if remaining == 0:
                best[0] = current[:]
            return
        
        # Try all options for current choice
        for option in generate_options(choices[index]):
            current.append(option)
            dfs(current, index + 1, remaining - option.cost)
            current.pop()
    
    dfs([], 0, target)
    return best[0]

# Example: N-Queens
def solve_n_queens(n):
    def is_valid(board, row, col):
        for r, c in enumerate(board[:row]):
            if c == col or abs(r - row) == abs(c - col):
                return False
        return True
    
    solutions = []
    
    def dfs(board, row):
        if row == n:
            solutions.append(board[:])
            return
        
        for col in range(n):
            if is_valid(board, row, col):
                board.append(col)
                dfs(board, row + 1)
                board.pop()
    
    dfs([], 0)
    return solutions
```

<!-- back -->
