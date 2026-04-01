## Gas Station: Forms & Variations

What are the different forms and variations of Gas Station problems?

<!-- front -->

---

### Standard Circular Form

```python
def can_complete_circuit_standard(gas, cost):
    """
    Standard: Find any valid starting station
    O(n) greedy solution
    """
    if sum(gas) < sum(cost):
        return -1
    
    start, tank = 0, 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            start = i + 1
            tank = 0
    
    return start
```

**Returns:** Starting index or -1 if impossible.

---

### All Valid Starts Form

```python
def all_valid_starts(gas, cost):
    """
    Find all stations from which circuit is possible
    """
    n = len(gas)
    
    # Double the array to handle circularity
    doubled_gas = gas * 2
    doubled_cost = cost * 2
    
    # Compute prefix sums of net fuel
    net = [g - c for g, c in zip(doubled_gas, doubled_cost)]
    prefix = [0]
    for x in net:
        prefix.append(prefix[-1] + x)
    
    # For each window of size n, check if min(prefix) >= start_value
    valid = []
    
    for start in range(n):
        min_in_window = min(prefix[start:start + n + 1])
        if min_in_window >= prefix[start]:
            valid.append(start)
    
    return valid
```

---

### Minimum Tank Capacity Form

```python
def min_tank_needed(gas, cost, start):
    """
    What's the minimum starting tank to complete from start?
    """
    n = len(gas)
    min_tank = 0
    tank = 0
    
    for i in range(n):
        pos = (start + i) % n
        tank += gas[pos] - cost[pos]
        min_tank = min(min_tank, tank)
    
    # Need at least -min_tank to never go negative
    return max(0, -min_tank)

def find_start_min_capacity(gas, cost):
    """
    Find start requiring minimum initial tank
    """
    n = len(gas)
    best_start = 0
    min_needed = float('inf')
    
    for start in range(n):
        needed = min_tank_needed(gas, cost, start)
        if needed < min_needed:
            min_needed = needed
            best_start = start
    
    return best_start, min_needed
```

---

### Maximum Distance Form

```python
def max_distance_from_start(gas, cost, start):
    """
    Maximum stations reachable from start (not necessarily circular)
    """
    n = len(gas)
    tank = 0
    max_dist = 0
    
    for i in range(n):
        pos = (start + i) % n
        tank += gas[pos]
        
        # Need cost[pos] to go to next
        next_pos = (pos + 1) % n
        if tank < cost[pos]:
            break
        
        tank -= cost[pos]
        max_dist = i + 1
        
        # Stop if we completed full circle
        if next_pos == start:
            break
    
    return max_dist
```

---

### Equal Cost Variant

```python
def can_complete_equal_cost(gas, equal_cost):
    """
    All edges have same cost c
    Simplified analysis
    """
    n = len(gas)
    total_gas = sum(gas)
    
    if total_gas < equal_cost * n:
        return -1
    
    # Find station with cumulative surplus
    # Similar to standard but simpler
    start = 0
    surplus = 0
    
    for i in range(n):
        surplus += gas[i] - equal_cost
        if surplus < 0:
            start = i + 1
            surplus = 0
    
    return start
```

<!-- back -->
