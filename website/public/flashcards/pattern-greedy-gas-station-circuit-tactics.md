# Pattern: Greedy - Gas Station Circuit (Tactics)

---

## Front
What is the **single-pass tactic** for Gas Station Circuit?

## Back
Combine feasibility check and start-finding in **one loop**:

```python
def can_complete_circuit(gas, cost):
    total_gas = total_cost = current_tank = 0
    start = 0
    
    for i in range(len(gas)):
        total_gas += gas[i]
        total_cost += cost[i]
        current_tank += gas[i] - cost[i]
        
        if current_tank < 0:
            start = i + 1
            current_tank = 0
    
    return start if total_gas >= total_cost else -1
```

**Advantage**: O(n) time with only one pass through the array.

---

## Front
What is the **two-pass tactic** for Gas Station Circuit?

## Back
Separate concerns into **distinct phases**:

```python
def can_complete_circuit_two_pass(gas, cost):
    # Pass 1: Verify feasibility
    if sum(gas) < sum(cost):
        return -1
    
    # Pass 2: Find starting point
    current_tank = 0
    start = 0
    
    for i in range(len(gas)):
        current_tank += gas[i] - cost[i]
        if current_tank < 0:
            start = i + 1
            current_tank = 0
    
    return start
```

**Advantage**: Clearer logic separation, easier to understand.

---

## Front
What is the **simulation verification tactic**?

## Back
After finding a candidate, **simulate the full journey** to verify:

```python
def verify_start(gas, cost, start):
    n = len(gas)
    tank = 0
    
    for i in range(n):
        idx = (start + i) % n  # circular indexing
        tank += gas[idx] - cost[idx]
        if tank < 0:
            return False  # Verification failed
    
    return True  # Can complete circuit
```

**Use when**: You need to confirm correctness or handle edge cases.

---

## Front
What is the **pre-check optimization** tactic?

## Back
Add a **quick reject** before the main algorithm:

```python
def can_complete_circuit(gas, cost):
    # Quick reject: Early exit if obviously impossible
    if not gas or not cost or len(gas) != len(cost):
        return -1
    
    if sum(gas) < sum(cost):  # O(n) but catches many cases
        return -1
    
    # ... rest of algorithm
```

**When to use**: Large input sizes where early termination saves time.

---

## Front
What is the **prefix sum deficit tracking** tactic?

## Back
Track the **minimum prefix sum** to find the optimal starting point:

```python
def find_start_prefix_sums(gas, cost):
    n = len(gas)
    
    # Create array of net changes
    net = [gas[i] - cost[i] for i in range(n)]
    
    # Find point where prefix sum is minimized
    # Starting after that point ensures sum never goes negative
    prefix = 0
    min_prefix = 0
    min_index = 0
    
    for i in range(n):
        prefix += net[i]
        if prefix < min_prefix:
            min_prefix = prefix
            min_index = i + 1  # start AFTER the dip
    
    return min_index % n if prefix >= 0 else -1
```

**Insight**: Start after the point of maximum cumulative deficit.

---

## Front
What is the **candidate elimination** tactic?

## Back
Use the failure point to **eliminate multiple candidates at once**:

```python
start = 0
while start < n:
    tank = 0
    for i in range(n):
        idx = (start + i) % n
        tank += gas[idx] - cost[idx]
        
        if tank < 0:
            # Eliminate start through idx
            # Next candidate must be after idx
            start = idx + 1
            break
    else:
        return start  # Completed full circuit

return -1
```

**Optimization**: Each failure eliminates O(n) candidates, but algorithm remains O(n) total.

---

## Front
What is the **early termination** tactic in the loop?

## Back
Check if start index becomes **invalid during iteration**:

```python
for i in range(n):
    # ... update tank ...
    
    if current_tank < 0:
        start = i + 1
        current_tank = 0
        
        # Early termination: if start > n-1, no valid start exists
        if start >= n:
            return -1  # Would need to check total_gas >= total_cost
```

**Note**: Usually redundant since total_gas < total_cost check handles this, but useful for clarity.

---
