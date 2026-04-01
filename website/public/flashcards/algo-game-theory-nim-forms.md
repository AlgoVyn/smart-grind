## Game Theory Nim: Forms & Variations

What are the different forms and variations of Nim games?

<!-- front -->

---

### Standard Nim Form

```python
# Classic Nim: any number from any pile
def standard_nim(piles):
    return reduce(xor, piles) != 0

# With explicit move
def standard_nim_move(piles):
    nim_sum = reduce(xor, piles)
    for i, p in enumerate(piles):
        target = nim_sum ^ p
        if target < p:
            return (i, target)
    return None
```

**Theorem:** First player wins iff nim-sum ≠ 0.

---

### Misère Nim Form

```python
def misere_nim(piles):
    """
    Last player to move loses
    """
    # All piles size 1: play opposite of normal
    if all(p == 1 for p in piles):
        return len(piles) % 2 == 0  # Even count wins
    
    # Otherwise same as normal
    return reduce(xor, piles) != 0

def misere_nim_move(piles):
    """
    Find winning move in Misère Nim
    """
    all_ones = all(p == 1 for p in piles)
    nim_sum = reduce(xor, piles)
    
    if all_ones:
        # Leave odd number of piles for opponent
        if len(piles) % 2 == 1:
            return (0, 1)  # Take any pile
        return None
    
    # Same as normal, but careful when creating all-ones
    for i, p in enumerate(piles):
        target = nim_sum ^ p
        if target < p:
            # Check if this creates all-ones
            new_piles = piles[:i] + [target] + piles[i+1:]
            if all(x <= 1 for x in new_piles):
                # Leave even count
                if sum(1 for x in new_piles if x == 1) % 2 == 0:
                    return (i, p - target)
            else:
                return (i, p - target)
    return None
```

---

### Bounded Nim Form

```python
def bounded_nim(piles, max_take):
    """
    Can take at most max_take from a pile
    """
    # Each pile is independent take-away game
    # Grundy = pile % (max_take + 1)
    total = 0
    for p in piles:
        total ^= (p % (max_take + 1))
    return total != 0

def bounded_nim_move(piles, max_take):
    """
    Find move in bounded Nim
    """
    target_xor = 0
    for p in piles:
        target_xor ^= (p % (max_take + 1))
    
    if target_xor == 0:
        return None
    
    for i, p in enumerate(piles):
        current_mod = p % (max_take + 1)
        target_mod = target_xor ^ current_mod
        
        # Need to change p mod (max_take+1) to target_mod
        # While taking at most max_take
        delta = (current_mod - target_mod) % (max_take + 1)
        if delta > 0 and delta <= max_take and delta <= p:
            return (i, delta)
    
    return None
```

---

### Wythoff's Game Form

```python
def wythoff_position(a, b):
    """
    Wythoff's game: Two piles, can take from one or both equally
    P-positions: (⌊kφ⌋, ⌊kφ²⌋) for k = 0, 1, 2, ...
    where φ = (1 + √5) / 2
    """
    import math
    
    phi = (1 + 5**0.5) / 2
    
    # Sort so a <= b
    a, b = min(a, b), max(a, b)
    
    # Check if (a, b) is cold position
    k = int((b - a) * phi)
    return a == int(k * phi) and b == int(k * phi * phi)

def wythoff_move(a, b):
    """
    Find winning move from Wythoff position
    """
    import math
    phi = (1 + 5**0.5) / 2
    
    a, b = min(a, b), max(a, b)
    
    if wythoff_position(a, b):
        return None  # Losing position
    
    d = b - a
    k = int(d * phi)
    
    # Move to cold position (⌊kφ⌋, ⌊kφ²⌋)
    target_a = int(k * phi)
    target_b = int(k * phi * phi)
    
    if a != target_a:
        # Can reduce a or both
        if a > target_a and b - a == target_b - target_a:
            return ('both', a - target_a)
        return ('a', a - target_a)
    return ('b', b - target_b)
```

---

### Nimble Form (Nim on a Line)

```python
def nimble(coins):
    """
    Coins on a line, can move any coin left any distance
    Nim heap size = position of coin with odd count
    """
    # Position i with k coins contributes (k % 2) * i to nim-sum
    nim_sum = 0
    for pos, count in enumerate(coins):
        if count % 2 == 1:
            nim_sum ^= pos
    
    return nim_sum != 0
```

<!-- back -->
