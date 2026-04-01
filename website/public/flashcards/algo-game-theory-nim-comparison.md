## Game Theory Nim: Comparison with Alternatives

How does Nim theory compare to other game theory approaches?

<!-- front -->

---

### Nim vs Minimax vs Alpha-Beta

| Approach | Game Type | Complexity | Optimal Play | Use When |
|----------|-----------|------------|--------------|----------|
| **Nim-sum** | Impartial | O(n) | ✓ Guaranteed | Nim-like positions |
| **Sprague-Grundy** | Impartial | Varies | ✓ Guaranteed | Decomposable games |
| **Minimax** | General | O(b^d) | ✓ Small games | Any perfect info game |
| **Alpha-Beta** | General | O(b^(d/2)) | ✓ Small games | Same, optimized |

```python
# Nim-sum: instant result
def solve_nim(piles):
    return reduce(xor, piles) != 0

# Minimax: exponential for general game
def minimax(state, depth, maximizing):
    if game_over(state) or depth == 0:
        return evaluate(state)
    
    if maximizing:
        return max(minimax(move, depth-1, False) for move in get_moves(state))
    else:
        return min(minimax(move, depth-1, True) for move in get_moves(state))
```

**Winner:** Nim-sum for Nim, Minimax for complex non-decomposable games.

---

### Sprague-Grundy vs Direct DP

| Approach | Precomputation | Query Time | Memory | Best For |
|----------|----------------|------------|--------|----------|
| **Sprague-Grundy** | O(n × moves) | O(1) | O(n) | Repeated queries |
| **Direct DP** | None | O(n × moves) | O(n) | Single query |
| **Pattern search** | O(n) | O(1) | O(period) | Periodic games |

```python
# Sprague-Grundy: precompute once
grundy = [compute_grundy(i) for i in range(MAX_N)]
# Queries: O(1)

def query(positions):
    return reduce(xor, (grundy[p] for p in positions))

# Direct DP: compute on the fly
# No precomputation, but slower for many queries
```

---

### When to Use Each Game Theory Tool

| Problem Structure | Use |
|-------------------|-----|
| **Independent piles** | Nim-sum |
| **Take-away with fixed set** | Grundy numbers |
| **Graph with no revisits** | Grundy on graph |
| **General game tree** | Minimax / Alpha-beta |
| **Probabilistic elements** | Expectiminimax |
| **Large state space** | Monte Carlo Tree Search |
| **Partial information** | Game-theoretic analysis |

---

### Impartial vs Partisan Games

| Property | Impartial | Partisan |
|----------|-----------|----------|
| **Available moves** | Same for both players | Different for each |
| **Theory** | Sprague-Grundy complete | No general theory |
| **Examples** | Nim, Kayles | Chess, Go |
| **Analysis** | Nim-heap equivalence | Ad-hoc or heuristics |

```python
# Impartial: Sprague-Grundy applies
def is_winning_impartial(state):
    return compute_grundy(state) != 0

# Partisan: No general method
def analyze_partisan(state, player):
    # Must use minimax or domain-specific analysis
    if player == 'A':
        moves = get_moves_A(state)
    else:
        moves = get_moves_B(state)
    # ... minimax analysis
```

**Key insight:** Sprague-Grundy only works for impartial games.

<!-- back -->
