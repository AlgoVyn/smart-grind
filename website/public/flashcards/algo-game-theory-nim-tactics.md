## Game Theory Nim: Tactics & Applications

What tactical patterns leverage Nim theory for problem solving?

<!-- front -->

---

### Tactic 1: Identifying Nim-Equivalent Subgames

```python
def analyze_composite_game(subgames):
    """
    Break complex game into Nim-like components
    """
    # Pattern: Look for independent subgames
    # Each subgame contributes Grundy number to total
    
    total_grundy = 0
    analysis = []
    
    for i, (game_type, state) in enumerate(subgames):
        g = compute_grundy(game_type, state)
        total_grundy ^= g
        analysis.append({
            'subgame': i,
            'type': game_type,
            'state': state,
            'grundy': g
        })
    
    return {
        'winning': total_grundy != 0,
        'total_grundy': total_grundy,
        'components': analysis
    }

# Common subgame types:
# - Pile of stones → Grundy = pile size
# - Kayles (bowling pins) → Precomputed Grundy
# - Turning Turtles → XOR of positions
# - Ruler function games → grundy = trailing zeros
```

---

### Tactic 2: Green Hackenbush

```python
def green_hackenbush_value(tree):
    """
    Green Hackenbush: Cut edges from ground
    Each stalk is a Nim heap of height = length
    """
    # Value of tree = XOR of (lengths of all paths from ground)
    # Or more complex: use colon principle
    
    if tree.is_leaf:
        return 1  # Single edge = heap of size 1
    
    # For multiple branches
    values = [green_hackenbush_value(child) for child in tree.children]
    
    # Apply colon principle
    return nim_sum(values)

def colon_principle(stalks):
    """
    If multiple stalks from same node, XOR their values
    """
    return reduce(xor, stalks, 0)
```

---

### Tactic 3: Turning Turtles / Turning Turtles on a Strip

```python
def turning_turtles(coins):
    """
    Line of coins, some heads up. Move: flip head to tail,
    optionally flip any coin to its left.
    Equivalent to Nim where heads at position i = heap of size i
    """
    # Only heads matter, each contributes its position to nim-sum
    nim_sum = 0
    for pos, is_heads in enumerate(coins):
        if is_heads:
            nim_sum ^= pos
    
    if nim_sum == 0:
        return None  # Losing
    
    # Find move: flip coin at nim_sum, and optionally flip another
    for pos, is_heads in enumerate(coins):
        if is_heads:
            target = nim_sum ^ pos
            if target < pos and coins[target]:  # Need heads at target
                return (pos, target)  # Flip both
            if target == 0:  # Just flip coin at pos to make it 0
                return (pos, None)
    
    return None
```

---

### Tactic 4: Periodicity Detection in Grundy Sequences

```python
def find_grundy_period(moves_fn, max_n=1000):
    """
    Find periodicity in Grundy sequence for subtraction-like games
    """
    grundy = [0]
    
    for n in range(1, max_n):
        reachable = {grundy[n - m] for m in moves_fn(n) if n >= m}
        g = 0
        while g in reachable:
            g += 1
        grundy.append(g)
    
    # Find period
    for period in range(1, len(grundy) // 2):
        if all(grundy[i] == grundy[i + period] 
               for i in range(len(grundy) - period)):
            # Verify preperiod
            for start in range(period):
                if all(grundy[start + i] == grundy[start + period + i]
                       for i in range(len(grundy) - start - period)):
                    return {'preperiod': start, 'period': period, 'sequence': grundy}
    
    return None

# Common periodic games:
# - Take 1,2,3: period 4 starting at 0
# - Subtract {1,3,4}: period 7
# - Kayles: period 12 after preperiod
```

---

### Tactic 5: Dawson's Chess / Kayles Analysis

```python
def kayles_grundy(n, memo={}):
    """
    Kayles: Knock down one pin or two adjacent pins
    Pins in a row, once knocked they split game
    """
    if n in memo:
        return memo[n]
    
    if n == 0:
        return 0
    if n == 1:
        return 1
    
    # All possible moves and resulting positions
    reachable = set()
    
    # Knock down single pin at position i
    for i in range(n):
        left_size = i
        right_size = n - i - 1
        g = kayles_grundy(left_size) ^ kayles_grundy(right_size)
        reachable.add(g)
    
    # Knock down two adjacent pins at positions i, i+1
    for i in range(n - 1):
        left_size = i
        right_size = n - i - 2
        g = kayles_grundy(left_size) ^ kayles_grundy(right_size)
        reachable.add(g)
    
    # mex
    g = 0
    while g in reachable:
        g += 1
    
    memo[n] = g
    return g

# Precompute first values
# 0, 1, 2, 3, 1, 4, 3, 2, 1, 4, 2, 6, ...
# Eventually becomes periodic with period 12
```

<!-- back -->
