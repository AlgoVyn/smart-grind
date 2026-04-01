# Game Theory (Nim / Grundy Numbers)

## Category
Advanced / Math & Number Theory

## Description

**Combinatorial Game Theory** studies two-player games of perfect information with no chance elements. **Nim** is the most fundamental impartial game, and the **Sprague-Grundy Theorem** generalizes Nim analysis to all impartial games, providing a powerful framework for solving complex games by decomposing them into simpler components.

The beauty of Nim theory lies in its elegant mathematical foundation: a position is losing if and only if the XOR of all pile sizes equals zero. This simple rule, combined with the Sprague-Grundy theorem, allows us to solve incredibly complex games by breaking them down into independent subgames.

---

## Concepts

The Game Theory framework is built on several fundamental concepts that enable analysis of impartial games.

### 1. Impartial Games

An impartial game is one where both players have the same moves available from any position:

| Property | Description | Example |
|----------|-------------|---------|
| **Same moves** | Both players can make identical moves | Nim: both remove stones |
| **Normal play** | Last player to move wins | Standard convention |
| **Misère play** | Last player to move loses | Alternative convention |
| **Perfect info** | All game state is visible | No hidden information |

### 2. Nim-Sum (XOR)

The Nim-Sum is the XOR of all pile sizes and determines the winner:

```
Nim-Sum = a₁ XOR a₂ XOR a₃ XOR ... XOR aₙ

If Nim-Sum ≠ 0: First player has a winning strategy
If Nim-Sum = 0: Second player can force a win
```

**Why XOR?**
- Self-inverse: `a XOR a = 0`
- Associative and Commutative
- Identity: `a XOR 0 = a`
- Binary independence: each bit position analyzed separately

### 3. Grundy Numbers (Nimbers)

Every impartial game position has an equivalent Nim pile size:

```
G(position) = mex({ G(next_position) for all valid moves })

Where mex = minimum excludant (smallest non-negative integer not in set)
```

### 4. Sprague-Grundy Theorem

For composite games (sum of independent subgames):

```
G(total) = G(game₁) XOR G(game₂) XOR ... XOR G(gameₙ)

First player wins iff G(total) ≠ 0
```

This allows decomposition of complex games into independent Nim piles.

---

## Frameworks

Structured approaches for solving game theory problems.

### Framework 1: Standard Nim Analysis

```
┌─────────────────────────────────────────────────────┐
│  STANDARD NIM ANALYSIS FRAMEWORK                    │
├─────────────────────────────────────────────────────┤
│  1. Calculate Nim-Sum: XOR all pile sizes           │
│  2. Determine winner:                               │
│     - If Nim-Sum ≠ 0: First player wins             │
│     - If Nim-Sum = 0: Second player wins            │
│  3. Find winning move (if Nim-Sum ≠ 0):             │
│     a. For each pile i: target = pile[i] XOR sum   │
│     b. If target < pile[i], that's a winning move  │
│     c. Remove (pile[i] - target) stones from pile i│
└─────────────────────────────────────────────────────┘
```

**When to use**: Standard Nim (remove any number from one pile), need optimal move.

### Framework 2: Grundy Number Computation

```
┌─────────────────────────────────────────────────────┐
│  GRUNDY NUMBER COMPUTATION FRAMEWORK                 │
├─────────────────────────────────────────────────────┤
│  1. Base case: G(0) = 0 (terminal position)          │
│  2. For each position n from 1 to max:               │
│     a. Find all valid moves from position n          │
│     b. Collect Grundy numbers of all reachable positions│
│     c. G(n) = mex(collected set)                      │
│  3. Return array G where G[n] is Grundy for position n│
└─────────────────────────────────────────────────────┘
```

**When to use**: Custom game rules, need to analyze non-standard impartial games.

### Framework 3: Composite Game Analysis

```
┌─────────────────────────────────────────────────────┐
│  COMPOSITE GAME ANALYSIS FRAMEWORK                   │
├─────────────────────────────────────────────────────┤
│  1. Decompose game into independent subgames        │
│  2. Compute Grundy number for each subgame           │
│     - For Nim subgames: Grundy = pile size          │
│     - For custom games: use Grundy computation        │
│  3. Calculate total: XOR all subgame Grundy numbers   │
│  4. Determine winner:                                │
│     - Total ≠ 0: First player wins                   │
│     - Total = 0: Second player wins                  │
│  5. Find winning move in subgame that changes total  │
└─────────────────────────────────────────────────────┘
```

**When to use**: Games composed of multiple independent components.

---

## Forms

Different manifestations of game theory analysis.

### Form 1: Standard Nim (Piles)

Multiple piles, remove any positive number from one pile.

| Pile Sizes | Nim-Sum | Winner | Optimal First Move |
|------------|---------|--------|-------------------|
| [1, 2, 3] | 0 | Second | None (losing) |
| [3, 4, 5] | 2 | First | Pile 3: 5 → 3 |
| [7, 4, 1] | 2 | First | Pile 1: 7 → 5 |
| [1, 1, 1] | 1 | First | Any pile to 0 |

### Form 2: Subtraction Games

Remove k stones where k belongs to a specific set S.

| Game | Allowed Moves | Grundy Pattern |
|------|---------------|----------------|
| Take 1-2 | {1, 2} | G(n) = n % 3 |
| Take 1-3 | {1, 2, 3} | G(n) = n % 4 |
| Take 1 or 3 | {1, 3} | Periodic pattern |
| Take odd numbers | {1, 3, 5, ...} | G(n) = n % 2 |

### Form 3: Wythoff's Nim

Remove from one pile OR same amount from both piles.

```
Winning positions (losing for player to move):
(k·φ, k·φ²) where φ = (1+√5)/2 ≈ 1.618

Examples: (0,0), (1,2), (3,5), (4,7), (6,10)
```

### Form 4: Misère Nim

Last player to move LOSES (instead of wins).

| Scenario | Strategy |
|----------|----------|
| All piles size 1 | First wins if odd number of piles |
| At least one pile > 1 | Use normal Nim strategy except: |
| Final move case | Leave odd number of size-1 piles |

### Form 5: Composite Games

Sum of independent games played simultaneously.

```
Game A: Nim pile [3, 4] → Grundy = 3 XOR 4 = 7
Game B: Single pile 5 → Grundy = 5
Game C: Take-1-or-2 game with 10 → Grundy = 10 % 3 = 1

Total Grundy = 7 XOR 5 XOR 1 = 3 ≠ 0
→ First player wins
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Nim-Sum Calculation

Compute XOR of all pile sizes:

```python
def nim_sum(piles: list[int]) -> int:
    """Calculate XOR of all pile sizes."""
    result = 0
    for pile in piles:
        result ^= pile
    return result

def can_win_nim(piles: list[int]) -> bool:
    """Determine if first player can win."""
    return nim_sum(piles) != 0
```

### Tactic 2: Finding Winning Move

Find a move that makes Nim-Sum zero:

```python
def find_winning_move(piles: list[int]) -> tuple[int, int] | None:
    """
    Find (pile_index, stones_to_remove) for winning move.
    Returns None if no winning move exists (losing position).
    """
    total_xor = nim_sum(piles)
    
    if total_xor == 0:
        return None  # No winning move from losing position
    
    for i, pile in enumerate(piles):
        # Target size for this pile after the move
        target = pile ^ total_xor
        if target < pile:
            return (i, pile - target)
    
    return None
```

### Tactic 3: Computing mex (Minimum Excludant)

Find smallest non-negative integer not in set:

```python
def mex(values: set[int]) -> int:
    """Minimum excludant: smallest non-negative integer not in set."""
    m = 0
    while m in values:
        m += 1
    return m
```

### Tactic 4: Grundy Number Precomputation

Compute Grundy numbers for all positions:

```python
def compute_grundy(max_n: int, valid_moves: list[int]) -> list[int]:
    """
    Compute Grundy numbers for positions 0 to max_n.
    
    Args:
        max_n: Maximum position to compute
        valid_moves: List of allowed move sizes
    
    Returns:
        List where grundy[i] = Grundy number for position i
    """
    grundy = [0] * (max_n + 1)
    
    for n in range(1, max_n + 1):
        reachable = set()
        for move in valid_moves:
            if move <= n:
                reachable.add(grundy[n - move])
        grundy[n] = mex(reachable)
    
    return grundy

# Common patterns:
# Take 1 to k: G(n) = n % (k + 1)
# Take {1, 3, 4}: Compute with function above
```

### Tactic 5: Pattern Recognition

Many games have periodic Grundy sequences:

```python
def compute_grundy_with_pattern(max_n: int, valid_moves: list[int]) -> tuple[list[int], int]:
    """
    Compute Grundy numbers and detect periodic pattern.
    Returns (grundy_list, period) where period=0 if no pattern.
    """
    grundy = compute_grundy(max_n, valid_moves)
    
    # Try to find period in the last half of computed values
    for period in range(1, max_n // 3):
        is_periodic = True
        for i in range(max_n // 2, max_n - period):
            if grundy[i] != grundy[i + period]:
                is_periodic = False
                break
        if is_periodic:
            return grundy, period
    
    return grundy, 0
```

### Tactic 6: Misère Nim Strategy

Handle the losing-last-move variant:

```python
def can_win_misere_nim(piles: list[int]) -> bool:
    """
    Determine winner for Misère Nim (last player to move loses).
    """
    count_gt_1 = sum(1 for p in piles if p > 1)
    
    if count_gt_1 == 0:
        # All piles have size 1
        # First player wins iff odd number of piles
        return len(piles) % 2 == 1
    else:
        # Normal Nim strategy applies
        return nim_sum(piles) != 0
```

---

## Python Templates

### Template 1: Nim Sum and Basic Analysis

```python
def nim_sum(piles: list[int]) -> int:
    """
    Template 1: Calculate XOR of all pile sizes.
    Time: O(n), Space: O(1)
    """
    result = 0
    for pile in piles:
        result ^= pile
    return result


def can_win_nim(piles: list[int]) -> bool:
    """
    Template 1b: Determine if first player can win at standard Nim.
    Time: O(n), Space: O(1)
    """
    return nim_sum(piles) != 0
```

### Template 2: Finding Winning Move

```python
def find_winning_move(piles: list[int]) -> tuple[int, int] | None:
    """
    Template 2: Find a winning move in standard Nim.
    Returns (pile_index, stones_to_remove) or None if losing position.
    
    Time: O(n), Space: O(1)
    """
    total_xor = nim_sum(piles)
    
    if total_xor == 0:
        return None
    
    for i, pile in enumerate(piles):
        target = pile ^ total_xor
        if target < pile:
            return (i, pile - target)
    
    return None
```

### Template 3: Grundy Number Computation

```python
def compute_grundy(max_n: int, valid_moves: list[int]) -> list[int]:
    """
    Template 3: Compute Grundy numbers for positions 0 to max_n.
    
    Args:
        max_n: Maximum position to compute
        valid_moves: List of allowed move sizes
    
    Returns:
        List where grundy[i] = Grundy number for position i
    
    Time: O(max_n × |valid_moves|), Space: O(max_n)
    """
    def mex(values: set[int]) -> int:
        m = 0
        while m in values:
            m += 1
        return m
    
    grundy = [0] * (max_n + 1)
    
    for n in range(1, max_n + 1):
        reachable = set()
        for move in valid_moves:
            if move <= n:
                reachable.add(grundy[n - move])
        grundy[n] = mex(reachable)
    
    return grundy
```

### Template 4: Take-1-to-K Game

```python
def take_1_to_k_grundy(n: int, k: int) -> int:
    """
    Template 4: Grundy number for game where you can take 1 to k objects.
    Pattern: G(n) = n % (k + 1)
    
    Time: O(1), Space: O(1)
    """
    return n % (k + 1)
```

### Template 5: Composite Game Analysis

```python
def composite_game_winner(grundy_values: list[int]) -> bool:
    """
    Template 5: Determine winner of a composite game.
    
    Args:
        grundy_values: List of Grundy numbers for each subgame
    
    Returns:
        True if first player wins, False otherwise
    
    Time: O(n), Space: O(1)
    """
    total = 0
    for g in grundy_values:
        total ^= g
    return total != 0
```

### Template 6: Misère Nim

```python
def can_win_misere_nim(piles: list[int]) -> bool:
    """
    Template 6: Determine winner for Misère Nim.
    Last player to move loses instead of wins.
    
    Time: O(n), Space: O(1)
    """
    count_gt_1 = sum(1 for p in piles if p > 1)
    
    if count_gt_1 == 0:
        # All piles have size 1
        # First player wins iff odd number of piles
        return len(piles) % 2 == 1
    else:
        # Normal Nim strategy applies
        return nim_sum(piles) != 0
```

### Template 7: Complete Nim Analysis

```python
def analyze_nim_position(piles: list[int]) -> dict:
    """
    Template 7: Complete analysis of a Nim position.
    Returns dictionary with all relevant information.
    """
    nim = nim_sum(piles)
    
    winning_moves = []
    if nim != 0:
        for i, pile in enumerate(piles):
            target = pile ^ nim
            if target < pile:
                winning_moves.append({
                    'pile': i,
                    'current': pile,
                    'target': target,
                    'remove': pile - target
                })
    
    return {
        'piles': piles,
        'nim_sum': nim,
        'binary': bin(nim),
        'first_player_wins': nim != 0,
        'winning_moves': winning_moves
    }
```

---

## When to Use

Use Game Theory algorithms when analyzing:

- **Nim Variations**: Multiple piles with various removal rules
- **Take-Away Games**: Stones, tokens, or objects removal from heaps
- **Subtraction Games**: Remove k objects where k belongs to a specific set S
- **Graph Games**: Moving tokens on directed graphs (reachability games)
- **Impartial Games**: Any game where both players have identical move options
- **Composite Games**: Games that can be decomposed into independent subgames
- **Winning/Losing Positions**: Determine optimal play outcomes and strategies

### Comparison with Alternative Approaches

| Approach | Use Case | Time Complexity | Space Complexity | Notes |
|----------|----------|-----------------|------------------|-------|
| **Nim-Sum (XOR)** | Standard Nim, multiple piles | O(n) | O(1) | Optimal for pure Nim |
| **Grundy Numbers** | General impartial games | O(n × \|moves\|) | O(n) | Universal solution |
| **Minimax with DP** | Small state spaces | O(states) | O(states) | Exhaustive search |
| **Pattern Recognition** | Periodic Grundy sequences | O(1) per query | O(1) | After preprocessing |
| **Retrograde Analysis** | Graph games | O(V + E) | O(V) | For game graphs |

### When to Choose Each Approach

**Choose Nim-Sum (XOR) when:**
- Playing standard Nim (remove any positive number from one pile)
- All piles are independent
- You need O(n) solution with O(1) space

**Choose Grundy Numbers when:**
- The game has custom move rules
- You need to combine multiple independent games
- The game state can be mapped to a single integer

**Choose Pattern Recognition when:**
- Grundy numbers show periodic behavior
- You need O(1) lookup after preprocessing
- Working with very large position values

---

## Algorithm Explanation

### Core Concept: The Nim-Sum

The fundamental insight of Nim theory is that the **Nim-Sum** (XOR of all pile sizes) completely determines the game outcome:

```
Nim-Sum = a₁ XOR a₂ XOR a₃ XOR ... XOR aₙ

If Nim-Sum ≠ 0: First player has a winning strategy
If Nim-Sum = 0: Second player has a winning strategy (with optimal play)
```

### Why XOR?

The XOR operation has special properties that make it perfect for analyzing impartial games:

1. **Self-inverse**: `a XOR a = 0` (a pile XORed with itself cancels out)
2. **Associative and Commutative**: Order doesn't matter
3. **Identity element**: `a XOR 0 = a`
4. **Binary intuition**: Each bit position is independent

### Visual Representation: Nim Game Tree

Consider a simple Nim game with piles [1, 2, 3]:

```
Initial Position: [1, 2, 3]
Nim-Sum: 1 XOR 2 XOR 3 = 0 (Losing position for current player)

                    [1, 2, 3] (XOR=0, Losing)
                         |
        +----------------+----------------+
        |                |                |
    [0, 2, 3]        [1, 0, 3]        [1, 2, 0]
    XOR=1            XOR=2            XOR=3
    (Winning)        (Winning)        (Winning)
        |                |                |
    [0, 2, 2]        [1, 0, 1]        [1, 1, 0]
    XOR=0            XOR=0            XOR=0
    (Losing)         (Losing)         (Losing)
```

### Sprague-Grundy Theorem

The Sprague-Grundy theorem is the foundation of impartial game theory:

> Every impartial game position is equivalent to a Nim pile of size G(position), where G is the Grundy number.

**Grundy Number Definition:**
```
G(position) = mex({ G(next_position) for all valid moves from position })
```

Where **mex** (minimum excludant) is the smallest non-negative integer not in the set.

### Composite Games

When a game consists of multiple independent subgames:
```
G(total) = G(game₁) XOR G(game₂) XOR ... XOR G(gameₙ)
```

The first player wins if and only if `G(total) ≠ 0`.

### Why It Works

- **Binary independence**: Each bit position can be analyzed separately
- **Optimal play assumption**: Both players play perfectly
- **Position equivalence**: All impartial games reduce to Nim
- **Mex property**: Ensures no position is equivalent to any reachable position

### Limitations

- **Only works for impartial games**: Both players must have identical moves
- **Normal play convention**: Standard theory assumes last player wins
- **Perfect information**: No hidden information allowed
- **Finite games**: Games must eventually terminate
- **Misère play requires special handling**: Different strategy when last player loses

---

## Practice Problems

### Problem 1: Can I Win (Nim Game)

**Problem:** [LeetCode 292 - Nim Game](https://leetcode.com/problems/nim-game/)

**Description:** You are playing the following Nim Game with your friend: There is a heap of stones on the table, each time one player takes 1 to 3 stones. The one who takes the last stone wins. Given n stones, determine if you can win assuming both play optimally.

**How to Apply Game Theory:**
- This is a subtraction game with moves {1, 2, 3}
- Grundy numbers: G(n) = n % 4
- First player wins iff n % 4 != 0

---

### Problem 2: Cat and Mouse

**Problem:** [LeetCode 913 - Cat and Mouse](https://leetcode.com/problems/cat-and-mouse/)

**Description:** A game on a graph where a cat and mouse move alternately. Determine the winner assuming optimal play.

**How to Apply Game Theory:**
- Use retrograde analysis on game states
- Each state: (cat_position, mouse_position, turn)
- Determine winning/losing/draw states
- Apply minimax with memoization

---

### Problem 3: Stone Game

**Problem:** [LeetCode 877 - Stone Game](https://leetcode.com/problems/stone-game/)

**Description:** Alex and Lee play a game with piles of stones. Each turn, a player takes the entire pile from either end. Determine if Alex can win.

**How to Apply Game Theory:**
- This is a partisan game (different moves available)
- Use dynamic programming with game states
- dp[i][j] = maximum score difference for piles i to j
- First player can always win with optimal play

---

### Problem 4: Predict the Winner

**Problem:** [LeetCode 486 - Predict the Winner](https://leetcode.com/problems/predict-the-winner/)

**Description:** Given an array of scores, two players take turns picking from either end. Return true if first player can win.

**How to Apply Game Theory:**
- Similar to Stone Game
- Use DP to track score difference
- State: dp[i][j] = max score current player can get from range i to j
- Return dp[0][n-1] >= 0

---

### Problem 5: Divisor Game

**Problem:** [LeetCode 1025 - Divisor Game](https://leetcode.com/problems/divisor-game/)

**Description:** Alice and Bob take turns playing a game, starting with number N. Each turn, a player chooses a divisor x of N where 1 <= x < N, and replaces N with N - x. Determine if Alice wins.

**How to Apply Game Theory:**
- Compute winning/losing states using DP
- State i is winning if there exists a move to a losing state
- Pattern: First player wins iff N is even

---

## Video Tutorial Links

### Fundamentals

- [Nim Game Theory (MIT OpenCourseWare)](https://www.youtube.com/watch?v=3h09j-d01YM) - Comprehensive introduction to Nim
- [Game Theory - Sprague-Grundy Theorem](https://www.youtube.com/watch?v=GRXJa8h11kY) - Advanced theory
- [Combinatorial Game Theory (Numberphile)](https://www.youtube.com/watch?v=hK_I3pQG1) - Intuitive introduction

### Nim and Grundy Numbers

- [Nim Game Explained](https://www.youtube.com/watch?v=1jTl3cbq6zg) - How to play and win
- [Grundy Numbers / Nimbers](https://www.youtube.com/watch?v=0gBD7h7B_1w) - Sprague-Grundy theorem
- [Impartial Games](https://www.youtube.com/watch?v=7N9nF5g1L1k) - Theory and applications

### Competitive Programming

- [Game Theory in CP (Errichto)](https://www.youtube.com/watch?v=8NXbFkr8-CE) - Practical applications
- [Nim Game Problems](https://www.youtube.com/watch?v=0gBD7h7B_1w) - Solving contest problems
- [Winning and Losing Positions](https://www.youtube.com/watch?v=4N5L4R6V6e8) - Game state analysis

---

## Follow-up Questions

### Q1: What is the difference between impartial and partisan games?

**Answer:** 
- **Impartial games**: Both players have the same moves available from any position. Examples: Nim, subtraction games.
- **Partisan games**: Players have different available moves. Examples: Chess (white vs black pieces), Stone Game (ends change).

Nim-Sum and Grundy numbers only apply to impartial games. Partisan games require different analysis techniques.

---

### Q2: How do you handle misère play (last player to move loses)?

**Answer:** Misère Nim requires different strategy:
- **All piles size 1**: First player wins with odd number of piles
- **At least one pile > 1**: Use normal Nim strategy except for final move
- **Final position**: Leave an odd number of size-1 piles instead of even

For general misère games, the Sprague-Grundy theorem doesn't directly apply.

---

### Q3: Can you use game theory for games with randomness or hidden information?

**Answer:** Standard combinatorial game theory assumes:
- Perfect information (no hidden info)
- No chance elements
- Both players play optimally

For games with randomness, use expected value and probability. For hidden information, use game theory with information sets (like in poker).

---

### Q4: How do you find the Grundy number for a complex game?

**Answer:** Follow these steps:
1. Identify all possible moves from current position
2. Recursively compute Grundy numbers for each resulting position
3. Collect all reachable Grundy numbers in a set
4. Grundy number = mex (minimum excluded value) of the set

For many games, Grundy numbers follow patterns that can be computed without full recursion.

---

### Q5: What is the relationship between XOR and binary representation in Nim?

**Answer:** The Nim-Sum XOR works because:
- Each bit position represents an independent game
- XOR ensures each bit column has even parity for losing positions
- Making a move changes exactly those bit positions where the pile size changes
- The winning strategy is to make all bit columns have even parity (XOR = 0)

---

## Summary

Game Theory, particularly Nim and Grundy Numbers, provides a powerful mathematical framework for analyzing impartial games. Key takeaways:

- **Nim-Sum determines winner**: XOR of all pile sizes
- **Grundy numbers generalize Nim**: Every impartial game position has an equivalent Nim pile size
- **Sprague-Grundy theorem**: Composite games can be analyzed by XORing subgame Grundy numbers
- **Optimal play**: Both players assumed to play perfectly
- **Misère variant**: Special handling when last player to move loses

When to use:
- ✅ Nim and Nim-like games
- ✅ Take-away games with defined move sets
- ✅ Composite games with independent components
- ✅ Finding winning/losing positions
- ✅ Determining optimal moves

When NOT to use:
- ❌ Partisan games (different moves for each player)
- ❌ Games with hidden information
- ❌ Games with chance/randomness
- ❌ Games that don't satisfy normal play convention

Mastering game theory is essential for competitive programming, especially for problems involving winning positions, optimal strategies, and impartial combinatorial games.