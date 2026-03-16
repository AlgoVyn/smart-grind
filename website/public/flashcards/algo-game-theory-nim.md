## Game Theory - Nim

**Question:** Determine winning position in impartial games?

<!-- front -->

---

## Answer: XOR of Pile Sizes

### Nim Game
```python
def nim_winner(piles):
    xor_sum = 0
    for pile in piles:
        xor_sum ^= pile
    
    # If xor != 0, first player wins
    # If xor == 0, second player wins
    return xor_sum != 0
```

### Optimal Move
```python
def optimal_move(piles):
    xor_sum = 0
    for pile in piles:
        xor_sum ^= pile
    
    if xor_sum == 0:
        return None  # No winning move
    
    # Find pile to reduce
    for i, pile in enumerate(piles):
        target = xor_sum ^ pile
        if target < pile:
            return (i, pile - target)
    
    return None
```

### Visual: XOR Analysis
```
Piles: [3, 4, 5]

XOR: 3 ⊕ 4 ⊕ 5 = 2 (non-zero)
→ First player wins

Optimal move:
- Try reducing pile 3 to: 3 ⊕ 2 = 1
  New piles: [1, 4, 5], XOR = 1 ⊕ 4 ⊕ 5 = 0 ✓
```

### ⚠️ Tricky Parts

#### 1. Why XOR Works?
```python
# Grundy numbers for Nim = pile size
# XOR combines independent subgames

# Key property:
# - xor = 0 → all moves lead to xor ≠ 0
# - xor ≠ 0 → some move leads to xor = 0
```

#### 2. General Impartial Games
```python
# Compute Grundy number for each position
# Position is losing if XOR of all Grundies = 0

# Grundy(n) = mex{Grundy(next states)}
# mex = minimum excluded value
```

### Common Positions

| Position | XOR | Winner |
|----------|-----|--------|
| [1] | 1 | First |
| [1,1] | 0 | Second |
| [1,2,3] | 0 | Second |
| [2,5,7] | 2 ≠ 0 | First |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using sum | Use XOR, not sum |
| Not checking 0 | 0 means losing |
| Wrong Grundy | Compute correctly |

<!-- back -->
