## Game Theory Nim: Frameworks

What are the standard implementations for Nim game analysis?

<!-- front -->

---

### Basic Nim Framework

```python
def nim_winner(piles):
    """
    Determine if first player wins
    Returns: (wins, move) where move is (pile_index, remove_count)
    """
    nim_sum = 0
    for p in piles:
        nim_sum ^= p
    
    if nim_sum == 0:
        return (False, None)  # Second player wins with perfect play
    
    # Find winning move
    for i, p in enumerate(piles):
        target = nim_sum ^ p
        if target < p:
            remove = p - target
            return (True, (i, remove))
    
    return (False, None)  # Should not reach here

# Simple usage
def play_nim(piles):
    wins, move = nim_winner(piles)
    if wins:
        print(f"First player wins! Remove {move[1]} from pile {move[0]}")
    else:
        print("Second player wins with perfect play")
```

---

### Grundy Number Computation

```python
def compute_grundy(n, moves_fn, memo={}):
    """
    Compute Grundy number for position n
    moves_fn(n) returns list of reachable positions
    """
    if n in memo:
        return memo[n]
    
    if n == 0:
        return 0
    
    # Get reachable Grundy numbers
    reachable = set()
    for next_pos in moves_fn(n):
        reachable.add(compute_grundy(next_pos, moves_fn, memo))
    
    # mex (minimum excluded value)
    g = 0
    while g in reachable:
        g += 1
    
    memo[n] = g
    return g

# Example: Take-away game (can take 1, 2, or 3 stones)
def takeaway_moves(n):
    return [n-1, n-2, n-3] if n >= 3 else [n-1] if n >= 1 else []

# Grundy sequence: 0, 1, 2, 3, 0, 1, 2, 3, ... (period 4)
```

---

### Composite Game Framework

```python
class CompositeGame:
    """
    Game composed of independent subgames
    """
    def __init__(self, subgames):
        """
        subgames: list of (game_type, position)
        """
        self.subgames = subgames
    
    def compute_grundy(self):
        """Total Grundy = XOR of subgame Grundies"""
        total = 0
        for game_type, pos in self.subgames:
            g = self._subgame_grundy(game_type, pos)
            total ^= g
        return total
    
    def is_winning(self):
        return self.compute_grundy() != 0
    
    def _subgame_grundy(self, game_type, pos):
        # Dispatch to specific Grundy calculators
        calculators = {
            'nim': lambda p: p,  # Nim pile: Grundy = size
            'takeaway': compute_takeaway_grundy,
            'kayles': compute_kayles_grundy,
            'dawson': compute_dawson_grundy,
        }
        return calculators.get(game_type, lambda p: 0)(pos)
```

---

### Nim-Heap Variations

```python
class NimVariation:
    """
    Framework for Nim-like games with modified rules
    """
    
    @staticmethod
    def misere_nim(piles):
        """
        Misère Nim: Last player to move LOSES
        Strategy: Same as normal until all piles are size 1
        """
        if all(p <= 1 for p in piles):
            # Odd number of 1s: second player wins
            return sum(piles) % 2 == 0
        
        # Same as normal Nim
        return nim_winner(piles)[0]
    
    @staticmethod
    def subtraction_game(n, allowed):
        """
        Can only remove from allowed set
        Compute Grundy for single pile
        """
        grundy = [0] * (n + 1)
        
        for i in range(1, n + 1):
            reachable = set()
            for s in allowed:
                if i >= s:
                    reachable.add(grundy[i - s])
            
            g = 0
            while g in reachable:
                g += 1
            grundy[i] = g
        
        return grundy[n]
    
    @staticmethod
    def octal_game(code):
        """
        Octal code defines take-away rules
        Code digits define legal moves
        """
        # Parse octal code and build move set
        pass
```

---

### Sprague-Grundy for Graph Games

```python
def grundy_on_graph(graph, start):
    """
    Game: Move token on graph, no revisiting nodes
    Grundy = mex of neighbor Grundies
    """
    memo = {}
    
    def grundy(node, visited):
        key = (node, frozenset(visited))
        if key in memo:
            return memo[key]
        
        reachable = set()
        for neighbor in graph[node]:
            if neighbor not in visited:
                new_visited = visited | {neighbor}
                reachable.add(grundy(neighbor, new_visited))
        
        g = 0
        while g in reachable:
            g += 1
        
        memo[key] = g
        return g
    
    return grundy(start, {start})
```

<!-- back -->
