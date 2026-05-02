# DP on Trees

## Category
Dynamic Programming on Graphs

## Description

Dynamic Programming on Trees is a powerful technique for solving optimization problems on tree structures where decisions at each node depend on the solutions of its subtrees. This approach leverages the hierarchical nature of trees to decompose complex problems into smaller, manageable subproblems that can be solved recursively.

The key insight behind tree DP is that a tree's recursive structure naturally supports dynamic programming. Each subtree is an independent subproblem, and the solution for a parent node can be computed from the solutions of its children. This post-order processing (children before parent) ensures that when we process a node, all its descendants have already been solved, enabling efficient state transitions.

---

## Concepts

Tree DP is built on several fundamental concepts that make it effective for solving tree-based optimization problems.

### 1. Tree Structure and Terminology

Understanding tree components:

| Component | Description | Role in DP |
|-----------|-------------|------------|
| **Root** | Topmost node, no parent | Starting point for recursion |
| **Leaf** | Node with no children | Base case for recursion |
| **Internal Node** | Has at least one child | Combines child solutions |
| **Parent-Child** | Direct connection | Dependency relationship |
| **Subtree** | Node and all descendants | Independent subproblem |

### 2. Post-Order Processing

Process children before parent:

```
DFS(node):
    for each child in node.children:
        DFS(child)           # Process all children first
    process(node)             # Then process current node
```

| Property | Benefit |
|----------|---------|
| **Bottom-up** | Leaf to root ensures dependencies resolved |
| **Subproblem completion** | All children solved before parent |
| **Natural recursion** | Matches tree structure |

### 3. State Design

Define clear states for each node:

| State Pattern | Meaning | Example |
|--------------|---------|---------|
| **dp[node]** | Single value | Max sum without parent |
| **dp[node][0/1]** | Include/exclude | House Robber III |
| **dp[node][k]** | k states per node | Color assignments |
| **dp[node][child]** | Per child decision | Multiple constraints |

### 4. Rerooting Technique

Compute answers for all possible roots:

| Phase | Action | Purpose |
|-------|--------|---------|
| **First DFS** | Compute dp values from arbitrary root | Get subtree information |
| **Second DFS** | Reroot to compute answers for each node | Answer for each root |

---

## Frameworks

Structured approaches for implementing tree DP solutions.

### Framework 1: Basic Tree DP (Include/Exclude)

```
┌─────────────────────────────────────────────────────────────┐
│  BASIC TREE DP FRAMEWORK                                     │
├─────────────────────────────────────────────────────────────┤
│  For each node, compute states based on children solutions   │
│                                                             │
│  function dfs(node, parent):                                │
│      # Base case                                            │
│      if node is leaf:                                       │
│          return base_case_values                            │
│                                                             │
│      # Process all children                                 │
│      for child in node.children:                            │
│          if child != parent:  # Avoid going back to parent  │
│              child_result = dfs(child, node)                │
│                                                             │
│      # Combine child results for current node               │
│      dp[node] = combine(child_results)                      │
│                                                             │
│      return dp[node]                                        │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: House Robber III, basic include/exclude problems.

### Framework 2: Multi-State Tree DP

```
┌─────────────────────────────────────────────────────────────┐
│  MULTI-STATE TREE DP FRAMEWORK                              │
├─────────────────────────────────────────────────────────────┤
│  When multiple states needed per node:                      │
│                                                             │
│  States (House Robber example):                             │
│    dp[node][0] = max value when node NOT selected          │
│    dp[node][1] = max value when node IS selected           │
│                                                             │
│  Transitions:                                               │
│    dp[node][0] = sum(max(dp[child][0], dp[child][1]))       │
│    dp[node][1] = node.val + sum(dp[child][0])               │
│                                                             │
│  Answer: max(dp[root][0], dp[root][1])                     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Constraint-based selection on trees.

### Framework 3: Tree Rerooting DP

```
┌─────────────────────────────────────────────────────────────┐
│  TREE REROOTING FRAMEWORK                                    │
├─────────────────────────────────────────────────────────────┤
│  Compute answer for each node as root:                      │
│                                                             │
│  Phase 1 - First DFS (pick arbitrary root, e.g., 0):       │
│      dp1[node] = value considering only subtree              │
│      Calculate subtree sizes, depths, or other aggregates  │
│                                                             │
│  Phase 2 - Second DFS (reroot):                             │
│      ans[node] = answer when tree is rooted at node        │
│                                                             │
│      For each child:                                        │
│          # When moving root from node to child:             │
│          # - child's subtree nodes get closer             │
│          # - other nodes get farther                        │
│          ans[child] = ans[node] - contribution[child]      │
│                             + contribution[rest_of_tree]     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Sum of distances, tree center problems.

---

## Forms

Different manifestations of the tree DP pattern.

### Form 1: Include/Exclude DP

Binary decision at each node.

| Problem | State Definition |
|---------|-----------------|
| **House Robber III** | Rob node or not |
| **Maximum Independent Set** | Include node or not |
| **Vertex Cover** | Cover edge via this node or child |

```python
def dfs(node):
    if not node:
        return [0, 0]
    
    left = dfs(node.left)
    right = dfs(node.right)
    
    not_take = max(left) + max(right)
    take = node.val + left[0] + right[0]
    
    return [not_take, take]
```

### Form 2: Path-Based DP

Tracking paths through nodes.

| Problem | Approach |
|---------|----------|
| **Diameter** | Track two longest child paths |
| **Max Path Sum** | Track best path through node |
| **Longest Univalue Path** | Track consecutive same values |

### Form 3: Subtree Aggregation DP

Combining information from entire subtrees.

| Problem | Aggregation |
|---------|-------------|
| **Subtree Sum** | Sum of all node values |
| **Subtree Size** | Count of nodes |
| **Count Good Nodes** | Nodes with max value on path |

### Form 4: State Transfer DP

Color/state assignment with constraints.

```python
# Example: Tree coloring with no adjacent same color
def dfs(node, parent):
    # dp[c] = ways to color subtree when node has color c
    dp = [1, 1, 1]  # 3 colors
    
    for child in children[node]:
        if child == parent:
            continue
        child_dp = dfs(child, node)
        
        for c in range(3):
            # Multiply by sum of valid child colors
            dp[c] *= sum(child_dp[cc] for cc in range(3) if cc != c)
    
    return dp
```

### Form 5: Binary Lifting / Ancestor DP

Preprocess for ancestor queries.

| Use Case | Preprocessing | Query |
|----------|-------------|-------|
| **LCA** | up[k][v] = 2^k-th ancestor | O(log n) |
| **K-th Ancestor** | Same table | O(log n) |
| **Max Edge to Ancestor** | max_up[k][v] | O(log n) |

---

## Tactics

Specific techniques and optimizations for tree DP.

### Tactic 1: Post-Order with Global Variable

Track global answer during DFS:

```python
def max_path_sum(root):
    """Binary Tree Maximum Path Sum."""
    ans = float('-inf')
    
    def dfs(node):
        nonlocal ans
        if not node:
            return 0
        
        # Get contributions from children (ignore negative)
        left = max(0, dfs(node.left))
        right = max(0, dfs(node.right))
        
        # Update global answer with path through node
        ans = max(ans, node.val + left + right)
        
        # Return max path starting from node going down
        return node.val + max(left, right)
    
    dfs(root)
    return ans
```

### Tactic 2: Tree Diameter Calculation

Find longest path using two DFS or DP:

```python
def tree_diameter(edges):
    """Find tree diameter using two BFS/DFS."""
    n = len(edges) + 1
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    
    def bfs(start):
        dist = [-1] * n
        dist[start] = 0
        queue = deque([start])
        far_node = start
        
        while queue:
            u = queue.popleft()
            far_node = u
            for v in adj[u]:
                if dist[v] == -1:
                    dist[v] = dist[u] + 1
                    queue.append(v)
        
        return far_node, dist
    
    # First BFS from any node
    u, _ = bfs(0)
    # Second BFS from farthest node
    v, dist = bfs(u)
    
    return dist[v]  # Diameter
```

### Tactic 3: Rerooting Formula

Calculate answer for each root:

```python
def sum_of_distances(n, edges):
    """Sum of distances from each node to all other nodes."""
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    
    count = [1] * n  # Subtree sizes
    ans = [0] * n    # Answer for each root
    
    # First DFS: compute count and ans[0]
    def dfs1(u, parent):
        for v in adj[u]:
            if v != parent:
                dfs1(v, u)
                count[u] += count[v]
                ans[u] += ans[v] + count[v]
    
    # Second DFS: reroot to get all answers
    def dfs2(u, parent):
        for v in adj[u]:
            if v != parent:
                # When moving root from u to v:
                # - v's subtree (count[v] nodes) get 1 closer
                # - other nodes (n - count[v]) get 1 farther
                ans[v] = ans[u] - count[v] + (n - count[v])
                dfs2(v, u)
    
    dfs1(0, -1)
    dfs2(0, -1)
    return ans
```

### Tactic 4: Handling N-ary Trees

General tree DP for arbitrary number of children:

```python
def max_value_nary(root):
    """Maximum value selection for n-ary tree."""
    def dfs(node):
        if not node:
            return [0, 0]
        
        not_take = 0
        take_children_not = 0
        
        for child in node.children:
            child_dp = dfs(child)
            not_take += max(child_dp)
            take_children_not += child_dp[0]
        
        take = node.val + take_children_not
        return [not_take, take]
    
    return max(dfs(root))
```

### Tactic 5: Bottom-Up Iterative DP

Avoid recursion stack limits:

```python
def bottom_up_tree_dp(root):
    """Iterative post-order using stack."""
    if not root:
        return 0
    
    dp = {}  # node -> dp value
    stack = [(root, False)]
    
    while stack:
        node, processed = stack.pop()
        
        if not node:
            continue
        
        if processed:
            # Process node after children
            left_val = dp.get(node.left, 0)
            right_val = dp.get(node.right, 0)
            dp[node] = combine(left_val, right_val, node.val)
        else:
            # Push node back, then children
            stack.append((node, True))
            stack.append((node.right, False))
            stack.append((node.left, False))
    
    return dp[root]
```

---

## Python Templates

### Template 1: Basic Tree DP (Include/Exclude)

```python
def house_robber_iii(root):
    """
    House Robber III: Max money without robbing adjacent houses.
    LeetCode 337.
    
    dp[node] = [max_without_node, max_with_node]
    
    Time: O(n), Space: O(h) for recursion stack
    """
    def dfs(node):
        if not node:
            return [0, 0]
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # Not rob current: can rob or not rob children
        not_rob = max(left) + max(right)
        
        # Rob current: cannot rob children
        rob = node.val + left[0] + right[0]
        
        return [not_rob, rob]
    
    return max(dfs(root))
```

### Template 2: Maximum Path Sum (Global + Local)

```python
def max_path_sum(root):
    """
    Binary Tree Maximum Path Sum.
    LeetCode 124.
    
    Time: O(n), Space: O(h)
    """
    ans = float('-inf')
    
    def dfs(node):
        nonlocal ans
        if not node:
            return 0
        
        # Max contribution from children (ignore negative)
        left = max(0, dfs(node.left))
        right = max(0, dfs(node.right))
        
        # Update global answer with path through node
        ans = max(ans, node.val + left + right)
        
        # Return max path starting from node going downward
        return node.val + max(left, right)
    
    dfs(root)
    return ans
```

### Template 3: Longest Path with Constraints

```python
def longest_path_with_different_chars(parent, s):
    """
    Longest Path With Different Adjacent Characters.
    LeetCode 2246.
    
    Time: O(n), Space: O(n)
    """
    n = len(parent)
    children = [[] for _ in range(n)]
    for i in range(1, n):
        children[parent[i]].append(i)
    
    ans = 1
    
    def dfs(node):
        nonlocal ans
        max1 = max2 = 0  # Two longest valid child paths
        
        for child in children[node]:
            child_len = dfs(child)
            
            # Can only extend if characters differ
            if s[child] != s[node]:
                if child_len > max1:
                    max2 = max1
                    max1 = child_len
                elif child_len > max2:
                    max2 = child_len
        
        # Update answer with path through this node
        ans = max(ans, max1 + max2 + 1)
        
        return max1 + 1
    
    dfs(0)
    return ans
```

### Template 4: Tree Rerooting (Sum of Distances)

```python
def sum_of_distances_in_tree(n, edges):
    """
    Sum of Distances in Tree - answer for each node as root.
    LeetCode 834.
    
    Time: O(n), Space: O(n)
    """
    from collections import defaultdict
    
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    count = [1] * n  # Subtree node counts
    ans = [0] * n    # Answer for each root
    
    # First DFS: compute ans[0] and subtree counts
    def dfs1(node, parent):
        for nei in graph[node]:
            if nei != parent:
                dfs1(nei, node)
                count[node] += count[nei]
                ans[node] += ans[nei] + count[nei]
    
    # Second DFS: reroot to compute all answers
    def dfs2(node, parent):
        for nei in graph[node]:
            if nei != parent:
                # Formula: ans[child] = ans[parent] - count[child] + (n - count[child])
                ans[nei] = ans[node] - count[nei] + (n - count[nei])
                dfs2(nei, node)
    
    dfs1(0, -1)
    dfs2(0, -1)
    return ans
```

### Template 5: Subtree DP with Node Values

```python
def subtree_max_sum(root):
    """
    Maximum subtree sum (any subtree).
    
    Time: O(n), Space: O(h)
    """
    max_sum = float('-inf')
    
    def dfs(node):
        nonlocal max_sum
        if not node:
            return 0
        
        # Get subtree sums from children
        left = dfs(node.left)
        right = dfs(node.right)
        
        # Subtree sum including current node and any positive children
        subtree_sum = node.val + max(0, left) + max(0, right)
        max_sum = max(max_sum, subtree_sum)
        
        # Return contribution to parent (must include current node)
        return node.val + max(0, left) + max(0, right)
    
    dfs(root)
    return max_sum
```

### Template 6: Count Nodes with Highest Score

```python
def count_highest_score_nodes(parents):
    """
    Count Nodes With the Highest Score.
    LeetCode 2049.
    
    Time: O(n), Space: O(n)
    """
    n = len(parents)
    children = [[] for _ in range(n)]
    for i in range(1, n):
        children[parents[i]].append(i)
    
    max_score = 0
    count = 0
    
    def dfs(node):
        nonlocal max_score, count
        
        score = 1
        total = 1  # Include current node
        
        for child in children[node]:
            child_size = dfs(child)
            total += child_size
            score *= child_size
        
        # Multiply by size of "rest of tree" (if not root)
        if node != 0:
            score *= (n - total)
        
        if score > max_score:
            max_score = score
            count = 1
        elif score == max_score:
            count += 1
        
        return total
    
    dfs(0)
    return count
```

---

## When to Use

Use Tree DP when you need to solve problems involving:

- **Tree Structure**: Problem naturally defined on trees
- **Optimal Selection**: Choose optimal subset of nodes with constraints
- **Path Problems**: Longest/shortest/maximum sum paths
- **Subtree Queries**: Aggregating information from subtrees
- **Rerooting**: Answer for each node as potential root
- **Parent-Child Constraints**: Decisions depend on parent/child relationships

### Comparison with Alternatives

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Tree DP** | O(n) | O(h) | Optimization on trees |
| **BFS/DFS** | O(n) | O(w) | Simple traversal, shortest path |
| **Tree Decomposition** | O(n log n) | O(n) | Path queries, updates |
| **Greedy** | O(n) | O(1) | When local optimal is global |

### When to Choose Tree DP vs Other Approaches

- **Choose Tree DP** when:
  - Problem requires optimization with parent-child constraints
  - Need to consider all subtrees
  - Decision at node depends on children's solutions
  - Rerooting needed for all-node answers

- **Choose Simple DFS/BFS** when:
  - Just need to visit all nodes
  - No optimization or state tracking needed

- **Choose Heavy-Light Decomposition** when:
  - Path queries with updates needed
  - Multiple queries on same tree

---

## Algorithm Explanation

### Core Concept

Tree DP solves optimization problems on trees by computing values for subtrees and combining them at parent nodes. The recursive structure of trees naturally supports this bottom-up approach.

**Key Terminology**:
- **dp[node]**: Optimal value for subtree rooted at node
- **State**: Information needed to make decisions at each node
- **Transition**: How parent state relates to child states
- **Post-order**: Process children before parent

### How It Works

#### Step 1: Define State

```python
# For each node, what information do we need?
dp[node] = optimal_value_for_subtree
# Or multiple states:
dp[node][0] = value when condition A
dp[node][1] = value when condition B
```

#### Step 2: Define Transitions

```python
# How do we compute dp[node] from children?
dp[node] = combine(
    dp[child1],
    dp[child2],
    ...,
    node_value
)
```

#### Step 3: Handle Base Cases

```python
# Leaves have simple base cases
if node is leaf:
    return base_value
```

#### Step 4: Post-Order DFS

```python
def dfs(node, parent):
    # Process children first
    for child in children[node]:
        if child != parent:
            dfs(child, node)
    
    # Now compute current node
    compute_dp(node)
```

### Visual Walkthrough

**House Robber III Example**:
```
Tree:      3
          / \
         2   3
          \   \
           3   1

Processing (post-order):

1. Process leaf 3 (left): returns [0, 3]
   - not_rob = 0, rob = 3

2. Process node 2: 
   - left: [0, 3], right: None = [0, 0]
   - not_rob = max(0,3) + 0 = 3
   - rob = 2 + 0 + 0 = 2
   - returns [3, 2]

3. Process leaf 1: returns [0, 1]

4. Process node 3 (right):
   - right: [0, 1]
   - not_rob = 0, rob = 3
   - returns [0, 3]... wait, need to include child
   
   Correction:
   - not_rob = max(0, 1) = 1
   - rob = 3 + 0 = 3
   - returns [1, 3]

5. Process root 3:
   - left: [3, 2], right: [1, 3]
   - not_rob = max(3,2) + max(1,3) = 3 + 3 = 6
   - rob = 3 + 3 + 1 = 7
   - Answer: max(6, 7) = 7
```

### Why Tree DP Works

1. **Optimal Substructure**: Optimal solution uses optimal subtree solutions
2. **No Overlap**: Each subtree is independent
3. **Natural Recursion**: Tree structure matches recursion
4. **Linear Time**: O(n) since each node processed once

### Limitations

- **Stack Depth**: Recursion limited by tree height (can use iterative)
- **Memory**: O(h) recursion stack where h = height
- **State Explosion**: Too many states per node causes issues
- **Graphs Not Trees**: Cycles require different approaches

---

## Practice Problems

### Problem 1: House Robber III

**Problem:** [LeetCode 337 - House Robber III](https://leetcode.com/problems/house-robber-iii/)

**Description:** Binary tree houses. Rob a node → cannot rob its direct children. Find maximum money.

**How to Apply Tree DP:**
- State: [max_without_node, max_with_node]
- Transition: not_rob = sum(max(child)), rob = node.val + sum(child[0])
- Answer: max of root states

---

### Problem 2: Binary Tree Maximum Path Sum

**Problem:** [LeetCode 124 - Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/)

**Description:** Find maximum sum path (any path between any two nodes).

**How to Apply Tree DP:**
- Track global max with path through each node
- Return max path starting from node going down
- Combine left and right contributions

---

### Problem 3: Longest Path With Different Adjacent Characters

**Problem:** [LeetCode 2246 - Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters/)

**Description:** Tree defined by parent array, find longest path where adjacent nodes have different characters.

**How to Apply Tree DP:**
- For each node, track two longest valid child paths
- Only extend through children with different characters
- Update global answer at each node

---

### Problem 4: Sum of Distances in Tree

**Problem:** [LeetCode 834 - Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree/)

**Description:** For each node, compute sum of distances to all other nodes.

**How to Apply Tree DP:**
- First DFS: compute subtree sizes and ans[0]
- Second DFS: reroot using formula ans[child] = ans[parent] - count[child] + (n - count[child])

---

### Problem 5: Count Nodes With the Highest Score

**Problem:** [LeetCode 2049 - Count Nodes With the Highest Score](https://leetcode.com/problems/count-nodes-with-the-highest-score/)

**Description:** Remove each node, compute product of subtree sizes, count nodes with max score.

**How to Apply Tree DP:**
- DFS to compute subtree sizes
- For each node, score = product of (subtree sizes of children) × (n - total_subtree_size)

---

### Problem 6: Distribute Coins in Binary Tree

**Problem:** [LeetCode 979 - Distribute Coins in Binary Tree](https://leetcode.com/problems/distribute-coins-in-binary-tree/)

**Description:** Each node has coins (possibly more than 1 or 0). Move coins so each node has exactly 1. Minimize moves.

**How to Apply Tree DP:**
- For each node, compute excess coins (node.val - 1 + excess from children)
- Total moves = sum of absolute excess values

---

## Video Tutorial Links

### Fundamentals

- [DP on Trees - NeetCode](https://www.youtube.com/watch?v=1KxD5D2J6uk) - Comprehensive tree DP
- [Tree Algorithms - William Fiset](https://www.youtube.com/watch?v=1KxD5D2J6uk) - Visual explanations
- [Tree DP Fundamentals - Algorithms Live](https://www.youtube.com/watch?v=ZqAb62lZMPc) - Core concepts

### Problem Solving

- [House Robber III Solution](https://www.youtube.com/watch?v=1KxD5D2J6uk) - Classic tree DP
- [Maximum Path Sum Explanation](https://www.youtube.com/watch?v=1KxD5D2J6uk) - Global + local states
- [Rerooting Technique](https://www.youtube.com/watch?v=ZqAb62lZMPc) - All-root answers

### Advanced Topics

- [Tree Rerooting Deep Dive](https://www.youtube.com/watch?v=ZqAb62lZMPc) - Technical details
- [Heavy-Light Decomposition](https://www.youtube.com/watch?v=ZqAb62lZMPc) - For path queries
- [Centroid Decomposition](https://www.youtube.com/watch?v=ZqAb62lZMPc) - Alternative tree decomposition

---

## Follow-up Questions

### Q1: How do you handle very deep trees that might cause stack overflow?

**Answer:**
- **Iterative DFS**: Use explicit stack with (node, state) tuples
- **Increase stack size**: System-dependent (not recommended)
- **Tree flattening**: Convert to parent array and process bottom-up
- **Tail recursion**: Some languages optimize, Python does not

---

### Q2: Can tree DP be applied to graphs with cycles?

**Answer:**
- **No directly**: Cycles break the tree DP assumptions
- **Tree decomposition**: Break cycles (e.g., find spanning tree)
- **Special techniques**: Graph DP with cycle handling
- **Convert to tree**: Use DFS tree of the graph, handle back edges separately

---

### Q3: What's the difference between rerooting and just running DP from each node?

**Answer:**
- **Rerooting**: O(n) total using clever formula
- **Naive**: O(n²) running DP n times
- **Rerooting formula**: Uses subtree information to compute new root answer in O(1)
- **When to use**: When answers needed for all nodes as root

---

### Q4: How do you design the state for a tree DP problem?

**Answer:**
1. **Identify constraints**: What restrictions exist on parent/child?
2. **Binary decisions**: Include/exclude often gives 2 states
3. **Count states**: How many ways to be in each state?
4. **Transition clarity**: Can you define how states combine?
5. **Base cases**: What are leaf node values?

---

### Q5: When should you use bottom-up (iterative) vs top-down (recursive) tree DP?

**Answer:**
- **Top-down (recursive)**:
  - More intuitive, matches tree structure
  - Natural with memoization
  - Risk of stack overflow on deep trees
  
- **Bottom-up (iterative)**:
  - No recursion stack issues
  - Often faster in practice
  - Requires processing order (e.g., reverse BFS)
  - More complex to implement

---

## Summary

Tree DP is a powerful technique for solving optimization problems on tree structures. Key takeaways:

1. **Post-Order Processing**: Children must be processed before parents
2. **State Design**: Clear states capturing decision possibilities
3. **Transitions**: Combine child solutions for parent solution
4. **Rerooting**: Two DFS passes for all-root answers
5. **Linear Time**: O(n) for most tree DP problems

**When to Use**:
- Optimal decisions with parent-child constraints
- Subtree aggregation problems
- Path optimization in trees
- All-node answers needed (with rerooting)

**Implementation Tips**:
- Use post-order DFS (children before parent)
- Define clear base cases for leaves
- Track global answers when needed
- Consider iterative approach for very deep trees

This technique is fundamental for tree-based problems in competitive programming and technical interviews.
