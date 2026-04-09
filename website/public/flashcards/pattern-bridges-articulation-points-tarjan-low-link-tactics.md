## Bridges & Articulation Points (Tarjan's) - Tactics

What are specific techniques for applying Tarjan's algorithm?

<!-- front -->

---

### Tactic 1: Network Reliability Analysis

Find vulnerable points in communication networks.

```python
def find_critical_servers(network):
    """
    Identify servers whose failure disconnects the network.
    Returns: (critical_connections, critical_servers)
    """
    bridges, articulation_points = tarjan_bridges_ap(network)
    return bridges, articulation_points

# Use case: Prioritize backup connections for bridges
# Use case: Add redundancy at articulation points
```

---

### Tactic 2: Biconnected Component Detection

Group edges that form cycles together.

```python
def find_biconnected_components(graph):
    """
    Find components that remain connected if any node fails.
    """
    bridges, _ = tarjan_bridges_ap(graph)
    bridge_set = set(bridges)
    
    # Non-bridge edges form biconnected components
    components = []
    visited = set()
    
    def dfs_component(u, current):
        visited.add(u)
        current.append(u)
        for v in graph[u]:
            if (u, v) in bridge_set or (v, u) in bridge_set:
                continue  # Skip bridge edges
            if v not in visited:
                dfs_component(v, current)
    
    for node in graph:
        if node not in visited:
            component = []
            dfs_component(node, component)
            if component:
                components.append(component)
    
    return components
```

---

### Tactic 3: Critical Infrastructure (Road Networks)

Find roads that cannot be closed without disconnecting areas.

```python
def find_critical_roads(city_graph):
    """
    In a road network, find bridges (critical roads).
    These roads must remain open for full connectivity.
    """
    bridges, _ = tarjan_bridges_ap(city_graph)
    
    # Each bridge represents a road that, if closed,
    # disconnects parts of the city
    return [
        {
            'road': (u, v),
            'criticality': 'high',
            'recommendation': 'Maintain at all times or build alternate route'
        }
        for u, v in bridges
    ]
```

---

### Tactic 4: Dependency Analysis

Find critical dependencies in software/module graphs.

```python
def find_circular_dependency_risks(dependency_graph):
    """
    Identify modules that, if removed, break the system.
    Also find dependencies that are single points of failure.
    """
    bridges, articulation_points = tarjan_bridges_ap(dependency_graph)
    
    return {
        'single_point_of_failure_modules': articulation_points,
        'irreplaceable_dependencies': bridges,
        'recommendation': 'Decouple articulation points, add redundancy for bridges'
    }
```

---

### Tactic 5: Iterative Version for Deep Graphs

Avoid recursion depth issues with explicit stack.

```python
def tarjan_iterative(graph):
    """
    Iterative version for very deep graphs.
    Same logic, no recursion limit issues.
    """
    n = len(graph)
    disc = {}
    low = {}
    parent = {}
    bridges = []
    ap = set()
    children_count = {}
    time = [0]
    
    for start in graph:
        if start in disc:
            continue
        
        # Stack: (node, iterator, state)
        stack = [(start, iter(graph[start]), 0)]
        parent[start] = None
        
        while stack:
            u, neighbors, state = stack[-1]
            
            if state == 0:  # First visit
                disc[u] = low[u] = time[0]
                time[0] += 1
                children_count[u] = 0
                stack[-1] = (u, neighbors, 1)
            
            try:
                v = next(neighbors)
                
                if v not in disc:
                    # Tree edge
                    parent[v] = u
                    children_count[u] += 1
                    stack.append((v, iter(graph[v]), 0))
                elif v != parent.get(u):
                    # Back edge
                    low[u] = min(low[u], disc[v])
            except StopIteration:
                # Backtrack
                stack.pop()
                if parent.get(u) is not None:
                    pu = parent[u]
                    low[pu] = min(low[pu], low[u])
                    if low[u] > disc[pu]:
                        bridges.append((pu, u))
                    if low[u] >= disc[pu]:
                        ap.add(pu)
                elif children_count[u] > 1:
                    ap.add(u)
    
    return bridges, ap
```

<!-- back -->
