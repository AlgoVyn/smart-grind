## Game Theory Nim: Core Concepts

What is the game of Nim and what are the fundamental winning strategies?

<!-- front -->

---

### Fundamental Definition

**Nim:** Two players take turns removing objects from distinct piles. Each move removes any positive number from a single pile. The player who cannot move (all piles empty) loses.

| Aspect | Value |
|--------|-------|
| **Game type** | Impartial, perfect information, normal play |
| **Key concept** | Nim-sum (XOR of all pile sizes) |
| **Winning condition** | Nim-sum ≠ 0 (first player wins) |
| **Losing condition** | Nim-sum = 0 (second player wins) |

---

### Nim-Sum (The Sprague-Grundy Value)

```
Piles: [3, 4, 5]
Binary:
  3 = 011
  4 = 100
  5 = 101
XOR:  010 = 2

Nim-sum = 2 ≠ 0 → First player WINS
```

**Theorem:** P-position (previous player wins) iff nim-sum = 0.  
**Theorem:** N-position (next player wins) iff nim-sum ≠ 0.

---

### Winning Strategy

**If nim-sum ≠ 0:**
1. Compute target = nim-sum XOR pile[i] for each pile
2. Find pile where target < pile[i]
3. Reduce that pile to target
4. New nim-sum = 0 (P-position for opponent)

```python
def find_winning_move(piles):
    nim_sum = 0
    for p in piles:
        nim_sum ^= p
    
    if nim_sum == 0:
        return None  # Losing position
    
    for i, p in enumerate(piles):
        target = nim_sum ^ p
        if target < p:
            return (i, p - target)  # Reduce pile i by this amount
    
    return None
```

---

### Sprague-Grundy Theorem

**Generalization:** Every impartial game under normal play is equivalent to a Nim pile of size equal to its Grundy number.

| Game | Grundy Number |
|------|---------------|
| Terminal position | 0 |
| Single Nim pile | Size of pile |
| Composite game | XOR of component Grundy numbers |

**Application:** Break complex game into independent subgames, compute Grundy for each, XOR together.

<!-- back -->
