## Gas Station: Frameworks

What are the standard implementations for Gas Station problems?

<!-- front -->

---

### Circular Route Framework

```python
def can_complete_circuit(gas, cost):
    """
    Find starting station to complete circular route
    Returns: start index or -1 if impossible
    """
    n = len(gas)
    
    # Check if total gas >= total cost
    total_gas = sum(gas)
    total_cost = sum(cost)
    
    if total_gas < total_cost:
        return -1
    
    # Greedy: find valid start
    start = 0
    tank = 0
    
    for i in range(n):
        tank += gas[i] - cost[i]
        
        if tank < 0:
            # Cannot reach i+1 from start or any station in [start, i]
            start = i + 1
            tank = 0
    
    return start

# Verification
def verify_solution(gas, cost, start):
    """Verify start position completes circuit"""
    n = len(gas)
    tank = 0
    
    for i in range(n):
        pos = (start + i) % n
        tank += gas[pos]
        if tank < cost[pos]:
            return False
        tank -= cost[pos]
    
    return True
```

---

### Linear Route Framework

```python
def can_reach_end_linear(gas, cost):
    """
    Can we reach end from start 0? (Not circular)
    """
    tank = 0
    for i in range(len(gas)):
        tank += gas[i]
        if tank < cost[i]:
            return False
        tank -= cost[i]
    return True

def min_stops_to_reach_end(gas, cost, start_fuel=0):
    """
    Minimum stops needed to reach end
    Greedy: always take max available when needed
    """
    import heapq
    
    n = len(gas)
    tank = start_fuel
    stops = 0
    max_heap = []
    
    for i in range(n):
        # Need to reach station i+1
        required = cost[i]
        tank += gas[i]
        heapq.heappush(max_heap, -gas[i])
        
        while tank < required and max_heap:
            # Use best previous gas (but we already have it...)
            # Actually: this is for "choose to stop or not" variant
            tank += -heapq.heappop(max_heap)
            stops += 1
        
        if tank < required:
            return -1  # Cannot reach
        
        tank -= required
    
    return stops
```

---

### Multiple Stations Selection

```python
def max_distance_with_k_stops(gas, cost, k):
    """
    Maximum distance reachable with at most k refueling stops
    """
    import heapq
    
    n = len(gas)
    # Simplified: assume we start with full tank
    # Choose k best stations to stop at
    
    # Greedy: always pick station with most gas when needed
    tank = gas[0]  # Start with gas at station 0
    stops = 0
    pq = []  # Max heap of available gas
    
    for i in range(1, n):
        # Need cost[i-1] to reach station i
        required = cost[i-1]
        
        while tank < required and stops < k and pq:
            tank += -heapq.heappop(pq)
            stops += 1
        
        if tank < required:
            return i - 1  # Can only reach station i-1
        
        tank -= required
        heapq.heappush(pq, -gas[i])
    
    return n - 1  # Reached all stations
```

---

### Refuel with Constraints

```python
def min_refuel_stops(target, start_fuel, stations):
    """
    stations[i] = (position, fuel_available)
    Min stops to reach target
    """
    import heapq
    
    tank = start_fuel
    stops = 0
    prev_pos = 0
    max_heap = []
    
    for pos, fuel in stations + [(target, 0)]:
        distance = pos - prev_pos
        
        # Need to cover distance
        while tank < distance:
            if not max_heap:
                return -1  # Cannot reach
            tank += -heapq.heappop(max_heap)
            stops += 1
        
        tank -= distance
        heapq.heappush(max_heap, -fuel)
        prev_pos = pos
    
    return stops
```

---

### Circular with Multiple Vehicles

```python
def can_multiple_circuits(gas, cost, vehicles):
    """
    Can 'vehicles' number of vehicles complete the circuit?
    """
    n = len(gas)
    total_gas = sum(gas)
    total_cost = sum(cost)
    
    if total_gas < total_cost * vehicles:
        return False
    
    # Find all valid starting points
    valid_starts = []
    
    for start in range(n):
        tank = 0
        valid = True
        for i in range(n):
            pos = (start + i) % n
            tank += gas[pos] - cost[pos]
            if tank < 0:
                valid = False
                break
        
        if valid:
            valid_starts.append(start)
    
    return len(valid_starts) >= vehicles
```

<!-- back -->
