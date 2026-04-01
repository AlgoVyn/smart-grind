## Dijkstra's Algorithm: Problem Forms

What are the variations and applications of Dijkstra's algorithm?

<!-- front -->

---

### Shortest Path with Constraints

```python
def shortest_path_with_constraint(graph, source, target, max_edges):
    """
    Shortest path using at most max_edges edges
    State: (node, edges_used)
    """
    dist = {(source, 0): 0}
    pq = [(0, source, 0)]  # (dist, node, edges)
    
    while pq:
        d, u, edges = heapq.heappop(pq)
        
        if u == target:
            return d
        
        if edges >= max_edges:
            continue
        
        for v, w in graph[u]:
            new_dist = d + w
            key = (v, edges + 1)
            if key not in dist or new_dist < dist.get(key, float('inf')):
                dist[key] = new_dist
                heapq.heappush(pq, (new_dist, v, edges + 1))
    
    return -1
```

---

### Shortest Path with State

```python
def shortest_path_with_state(graph, source, target):
    """
    State includes additional information (e.g., remaining fuel)
    """
    # State: (node, fuel_remaining)
    dist = {}
    pq = [(0, source, max_fuel)]  # (dist, node, fuel)
    
    while pq:
        d, u, fuel = heapq.heappop(pq)
        
        if u == target:
            return d
        
        key = (u, fuel)
        if key in dist and dist[key] < d:
            continue
        
        # Drive to neighbors
        for v, cost in graph[u]:
            new_fuel = fuel - cost
            if new_fuel >= 0:
                new_dist = d + cost
                new_key = (v, new_fuel)
                if new_key not in dist or new_dist < dist[new_key]:
                    dist[new_key] = new_dist
                    heapq.heappush(pq, (new_dist, v, new_fuel))
        
        # Refuel at current node (if station)
        if is_fuel_station(u) and fuel < max_fuel:
            new_key = (u, max_fuel)
            refuel_cost = fuel_price[u] * (max_fuel - fuel)
            new_dist = d + refuel_cost
            if new_key not in dist or new_dist < dist[new_key]:
                dist[new_key] = new_dist
                heapq.heappush(pq, (new_dist, u, max_fuel))
```

---

### Second Shortest Path

```python
def second_shortest_path(graph, source, target):
    """
    Find second shortest distinct path
    """
    # dist[node][0] = shortest, dist[node][1] = second shortest
    dist = {node: [float('inf'), float('inf')] for node in graph}
    dist[source][0] = 0
    
    pq = [(0, source)]
    
    while pq:
        d, u = heapq.heappop(pq)
        
        for v, w in graph[u]:
            new_dist = d + w
            
            # Update shortest
            if new_dist < dist[v][0]:
                dist[v][1] = dist[v][0]
                dist[v][0] = new_dist
                heapq.heappush(pq, (new_dist, v))
            # Update second shortest
            elif dist[v][0] < new_dist < dist[v][1]:
                dist[v][1] = new_dist
                heapq.heappush(pq, (new_dist, v))
    
    return dist[target][1] if dist[target][1] != float('inf') else -1
```

---

### Time-Dependent Shortest Path

```python
def time_dependent_dijkstra(graph, source, departure_time):
    """
    Edge weights depend on arrival time (e.g., traffic)
    """
    # dist[node] = earliest arrival time
    dist = {node: float('inf') for node in graph}
    dist[source] = departure_time
    
    pq = [(departure_time, source)]
    
    while pq:
        arrival, u = heapq.heappop(pq)
        
        if arrival > dist[u]:
            continue
        
        for v in graph[u]:
            # Travel time depends on when we arrive at u
            travel_time = get_travel_time(u, v, arrival)
            new_arrival = arrival + travel_time
            
            if new_arrival < dist[v]:
                dist[v] = new_arrival
                heapq.heappush(pq, (new_arrival, v))
    
    return dist
```

---

### Constrained Shortest Path (A* Alternative)

```python
def a_star_dijkstra(graph, source, target, heuristic):
    """
    A* uses heuristic to guide search
    f(n) = g(n) + h(n) where g=actual cost, h=estimate to target
    """
    dist = {node: float('inf') for node in graph}
    dist[source] = 0
    
    # Priority on f = g + h
    pq = [(heuristic(source, target), 0, source)]
    
    while pq:
        f, g, u = heapq.heappop(pq)
        
        if u == target:
            return g
        
        if g > dist[u]:
            continue
        
        for v, w in graph[u]:
            new_g = g + w
            if new_g < dist[v]:
                dist[v] = new_g
                f = new_g + heuristic(v, target)
                heapq.heappush(pq, (f, new_g, v))
    
    return -1
```

<!-- back -->
