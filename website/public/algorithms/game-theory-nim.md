# Game Theory (Nim / Grundy Numbers)

## Category
Advanced / Math & Number Theory

## Description

**Combinatorial Game Theory** studies two-player games of perfect information with no chance elements. **Nim** is the most fundamental impartial game, and the **Sprague-Grundy Theorem** generalizes Nim analysis to all impartial games, providing a powerful framework for solving complex games by decomposing them into simpler components.

### Key Concepts

- **Impartial Game**: Both players have the same moves available from any position
- **Normal Play**: The player who makes the last move wins (convention)
- **Nim-Sum**: XOR (exclusive OR) of all pile sizes - the decisive factor in Nim
- **Grundy Number** (or nimber): Equivalent Nim pile size for any game position
- **mex Function**: Minimum excludant - the smallest non-negative integer not in a set

The beauty of Nim theory lies in its elegant mathematical foundation: a position is losing if and only if the XOR of all pile sizes equals zero. This simple rule, combined with the Sprague-Grundy theorem, allows us to solve incredibly complex games by breaking them down into independent subgames.

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

**Choose Retrograde Analysis when:**
- The game is represented as a graph
- You need to analyze all positions systematically
- Working with impartial games on graphs

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

#### Computing Grundy Numbers

Base case: `G(0) = 0` (terminal position - no moves available)

For any position n with valid moves:
```
G(n) = mex({ G(n - move) for all valid moves from position n })
```

### Example: Grundy Number Calculation

For a game where you can take 1 or 2 stones:

```
G(0) = 0                                    (terminal)
G(1) = mex({G(0)}) = mex({0}) = 1           (can take 1)
G(2) = mex({G(1), G(0)}) = mex({1, 0}) = 2  (can take 1 or 2)
G(3) = mex({G(2), G(1)}) = mex({2, 1}) = 0  (can take 1 or 2)
G(4) = mex({G(3), G(2)}) = mex({0, 2}) = 1  (can take 1 or 2)
G(5) = mex({G(4), G(3)}) = mex({1, 0}) = 2  (can take 1 or 2)

Pattern emerges: G(n) = n mod 3
```

### Composite Games

When a game consists of multiple independent subgames:
```
G(total) = G(game₁) XOR G(game₂) XOR ... XOR G(gameₙ)
```

The first player wins if and only if `G(total) ≠ 0`.

### Misère Nim Variation

In Misère Nim, the player who makes the last move **loses**:

```
Strategy depends on pile sizes:

Case 1: All piles have size 1
        - First player wins if there are an ODD number of piles
        
Case 2: At least one pile has size > 1
        - Use normal Nim strategy EXCEPT:
        - When all remaining moves leave only size-1 piles,
          leave an ODD number of piles (instead of even)
```

---

## Algorithm Steps

### Standard Nim Analysis

1. **Calculate Nim-Sum**: XOR all pile sizes together
2. **Determine Winner**: 
   - If Nim-Sum ≠ 0: First player can win
   - If Nim-Sum = 0: Second player can win (with optimal play)
3. **Find Winning Move** (if Nim-Sum ≠ 0):
   - For each pile i, compute `target = pile[i] XOR nim_sum`
   - If `target < pile[i]`, reducing pile i to `target` is a winning move
   - Remove `(pile[i] - target)` stones from pile i

### Grundy Number Computation

1. **Initialize**: Set `G[0] = 0` (terminal position)
2. **Iterate**: For each position n from 1 to max_n:
   - Collect all reachable Grundy numbers: `{ G[n - move] for all valid moves }`
   - Compute `G[n] = mex(reachable_set)`
3. **Result**: Array G where G[n] is the Grundy number for position n

### Composite Game Analysis

1. **Decompose**: Split the game into independent subgames
2. **Compute Grundy**: Calculate G for each subgame position
3. **Combine**: XOR all subgame Grundy numbers
4. **Determine Winner**: First player wins if total XOR ≠ 0

---

## Implementation

### Template Code (Complete Game Theory Implementation)

````carousel
```python
"""
Game Theory: Nim and Grundy Numbers Implementation
Comprehensive implementation for competitive programming and interviews.
"""

from functools import lru_cache
from typing import List, Tuple, Optional, Set


# =============================================================================
# SECTION 1: BASIC NIM OPERATIONS
# =============================================================================

def nim_sum(piles: List[int]) -> int:
    """
    Calculate XOR of all pile sizes (Nim-Sum).
    
    The Nim-Sum determines the winner in standard Nim:
    - If Nim-Sum != 0: First player can force a win
    - If Nim-Sum == 0: Second player can force a win (with optimal play)
    
    Args:
        piles: List of pile sizes
    
    Returns:
        XOR of all pile sizes
    
    Time Complexity: O(n) where n = number of piles
    Space Complexity: O(1)
    
    Example:
        >>> nim_sum([3, 4, 5])
        2  # 3 XOR 4 XOR 5 = 2
    """
    result = 0
    for pile in piles:
        result ^= pile
    return result


def can_win_nim(piles: List[int]) -> bool:
    """
    Determine if first player can win at standard Nim.
    
    Args:
        piles: List of pile sizes
    
    Returns:
        True if current player can force a win
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    return nim_sum(piles) != 0


def find_winning_move(piles: List[int]) -> Optional[Tuple[int, int]]:
    """
    Find a winning move in standard Nim.
    
    Args:
        piles: List of pile sizes
    
    Returns:
        Tuple of (pile_index, stones_to_remove) if winning move exists,
        None otherwise (current position is losing)
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    
    Example:
        >>> find_winning_move([3, 4, 5])
        (2, 3)  # Remove 3 stones from pile 2 (5 -> 2)
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


def get_all_winning_moves(piles: List[int]) -> List[Tuple[int, int]]:
    """
    Get all possible winning moves from current position.
    
    Args:
        piles: List of pile sizes
    
    Returns:
        List of (pile_index, stones_to_remove) tuples
    
    Time Complexity: O(n)
    Space Complexity: O(n) for result
    """
    total_xor = nim_sum(piles)
    winning_moves = []
    
    if total_xor == 0:
        return winning_moves  # No winning moves from losing position
    
    for i, pile in enumerate(piles):
        target = pile ^ total_xor
        if target < pile:
            winning_moves.append((i, pile - target))
    
    return winning_moves


# =============================================================================
# SECTION 2: GRUNDY NUMBER COMPUTATION
# =============================================================================

def mex(values: Set[int]) -> int:
    """
    Minimum excludant: smallest non-negative integer not in the set.
    
    Args:
        values: Set of non-negative integers
    
    Returns:
        Smallest non-negative integer not in values
    
    Time Complexity: O(m) where m is the mex result
    Space Complexity: O(1)
    
    Example:
        >>> mex({0, 1, 2})
        3
        >>> mex({1, 2, 3})
        0
        >>> mex({0, 2, 3})
        1
    """
    m = 0
    while m in values:
        m += 1
    return m


def compute_grundy(max_n: int, valid_moves: List[int]) -> List[int]:
    """
    Compute Grundy numbers for positions 0 to max_n.
    
    The Grundy number G(n) represents the equivalent Nim pile size
    for a position with n objects.
    
    Args:
        max_n: Maximum position to compute
        valid_moves: List of allowed move sizes
    
    Returns:
        List where grundy[i] = Grundy number for position i
    
    Time Complexity: O(max_n × |valid_moves|)
    Space Complexity: O(max_n)
    
    Example:
        >>> compute_grundy(5, [1, 2])
        [0, 1, 2, 0, 1, 2]  # Pattern: G(n) = n % 3
    """
    grundy = [0] * (max_n + 1)
    
    for n in range(1, max_n + 1):
        reachable = set()
        for move in valid_moves:
            if move <= n:
                reachable.add(grundy[n - move])
        grundy[n] = mex(reachable)
    
    return grundy


def compute_grundy_with_pattern(max_n: int, valid_moves: List[int]) -> Tuple[List[int], int]:
    """
    Compute Grundy numbers and detect periodic pattern.
    
    Many games exhibit periodic Grundy patterns after some initial values.
    This function detects such patterns for O(1) lookup.
    
    Args:
        max_n: Maximum position to compute
        valid_moves: List of allowed move sizes
    
    Returns:
        Tuple of (grundy_list, period) where period is 0 if no pattern detected
    
    Time Complexity: O(max_n × |valid_moves|)
    Space Complexity: O(max_n)
    """
    grundy = compute_grundy(max_n, valid_moves)
    
    # Try to find period in the last half of computed values
    # Pattern must repeat at least twice to be considered valid
    for period in range(1, max_n // 3):
        is_periodic = True
        for i in range(max_n // 2, max_n - period):
            if grundy[i] != grundy[i + period]:
                is_periodic = False
                break
        if is_periodic:
            return grundy, period
    
    return grundy, 0  # No pattern detected


# =============================================================================
# SECTION 3: COMMON GAME PATTERNS
# =============================================================================

def take_1_to_k_grundy(n: int, k: int) -> int:
    """
    Grundy number for game where you can take 1 to k objects.
    
    Pattern: G(n) = n % (k + 1)
    
    Args:
        n: Number of objects
        k: Maximum objects that can be taken
    
    Returns:
        Grundy number for position n
    
    Time Complexity: O(1)
    Space Complexity: O(1)
    """
    return n % (k + 1)


def subtraction_game_grundy(n: int, subtract_set: Set[int]) -> int:
    """
    Compute Grundy number for subtraction game.
    
    In subtraction games, you can remove any k from subtract_set.
    
    Args:
        n: Number of objects
        subtract_set: Set of allowed subtraction values
    
    Returns:
        Grundy number for position n
    
    Time Complexity: O(n × |subtract_set|)
    Space Complexity: O(n)
    """
    grundy = [0] * (n + 1)
    
    for i in range(1, n + 1):
        reachable = {grundy[i - k] for k in subtract_set if k <= i}
        grundy[i] = mex(reachable)
    
    return grundy[n]


# Memoized version for complex games
@lru_cache(maxsize=None)
def grundy_wythoff(n: int, m: int) -> int:
    """
    Grundy number for Wythoff's Nim.
    
    Wythoff's Nim allows:
    - Remove any positive number from one pile
    - Remove the same positive number from both piles
    
    Args:
        n: Size of first pile
        m: Size of second pile
    
    Returns:
        Grundy number for position (n, m)
    
    Time Complexity: O(n × m × (n + m)) without memoization
    Space Complexity: O(n × m) for memoization cache
    """
    if n == 0 and m == 0:
        return 0
    
    reachable = set()
    
    # Take from first pile
    for i in range(n):
        reachable.add(grundy_wythoff(i, m))
    
    # Take from second pile
    for j in range(m):
        reachable.add(grundy_wythoff(n, j))
    
    # Take same amount from both piles
    for k in range(1, min(n, m) + 1):
        reachable.add(grundy_wythoff(n - k, m - k))
    
    return mex(reachable)


# =============================================================================
# SECTION 4: COMPOSITE GAMES
# =============================================================================

def composite_game_winner(grundy_values: List[int]) -> bool:
    """
    Determine winner of a composite game.
    
    A composite game is the sum of independent subgames.
    The total Grundy number is the XOR of all subgame Grundy numbers.
    
    Args:
        grundy_values: List of Grundy numbers for each subgame
    
    Returns:
        True if first player wins, False if second player wins
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    total = 0
    for g in grundy_values:
        total ^= g
    return total != 0


def composite_game_analysis(games: List[List[int]]) -> dict:
    """
    Complete analysis of a composite game.
    
    Args:
        games: List of game positions (each is a list of pile sizes)
    
    Returns:
        Dictionary with analysis results
    
    Example:
        >>> composite_game_analysis([[3, 4], [5]])
        {
            'individual_grundy': [7, 5],  # 3^4=7, 5=5
            'total_xor': 2,
            'first_player_wins': True,
            'winning_subgames': [(0, 7, 2)]  # (game_idx, current, target)
        }
    """
    individual = [nim_sum(game) for game in games]
    total = 0
    for g in individual:
        total ^= g
    
    # Find which subgames have winning moves
    winning_subgames = []
    for i, (game, grundy) in enumerate(zip(games, individual)):
        if grundy != 0:
            target = grundy ^ total
            if target < grundy:
                winning_subgames.append((i, grundy, target))
    
    return {
        'individual_grundy': individual,
        'total_xor': total,
        'first_player_wins': total != 0,
        'winning_subgames': winning_subgames
    }


# =============================================================================
# SECTION 5: MISÈRE NIM
# =============================================================================

def can_win_misere_nim(piles: List[int]) -> bool:
    """
    Determine winner for Misère Nim (last player to move loses).
    
    Strategy differs based on pile sizes:
    - If all piles are size 1: First player wins iff odd number of piles
    - Otherwise: Use normal Nim strategy
    
    Args:
        piles: List of pile sizes
    
    Returns:
        True if first player can force a win
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    # Count piles with size > 1
    count_gt_1 = sum(1 for p in piles if p > 1)
    
    if count_gt_1 == 0:
        # All piles have size 1
        # First player wins iff odd number of piles
        return len(piles) % 2 == 1
    else:
        # Normal Nim strategy applies
        return nim_sum(piles) != 0


def find_misere_winning_move(piles: List[int]) -> Optional[Tuple[int, int]]:
    """
    Find a winning move in Misère Nim.
    
    Args:
        piles: List of pile sizes
    
    Returns:
        Tuple of (pile_index, stones_to_remove) or None
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    count_gt_1 = sum(1 for p in piles if p > 1)
    
    if count_gt_1 == 0:
        # All piles are size 1
        # Winning move: leave even number of piles
        if len(piles) % 2 == 1:
            # Take any single pile
            return (0, 1)
        return None
    
    if count_gt_1 == 1:
        # Special case: one pile > 1, rest are 1s
        # Leave odd number of size-1 piles
        nim = nim_sum(piles)
        if nim != 0:
            for i, pile in enumerate(piles):
                if pile > 1:
                    target = pile ^ nim
                    if target == 0 and len([p for p in piles if p == 1]) % 2 == 0:
                        # Would leave even 1s, adjust to leave odd
                        target = 1
                    if target < pile:
                        return (i, pile - target)
    
    # Normal Nim strategy
    return find_winning_move(piles)


# =============================================================================
# SECTION 6: UTILITY FUNCTIONS
# =============================================================================

def print_nim_analysis(piles: List[int]) -> None:
    """
    Print complete analysis of a Nim position.
    
    Args:
        piles: List of pile sizes
    """
    print("=" * 50)
    print(f"NIM POSITION ANALYSIS")
    print("=" * 50)
    print(f"Piles: {piles}")
    
    nim = nim_sum(piles)
    print(f"Nim-Sum: {nim}")
    print(f"Binary: {nim:08b}")
    
    print(f"\nPosition Type: {'WINNING' if nim != 0 else 'LOSING'}")
    print(f"Optimal Player: {'First' if nim != 0 else 'Second'}")
    
    if nim != 0:
        print("\nWinning Moves:")
        for i, pile in enumerate(piles):
            target = pile ^ nim
            if target < pile:
                remove = pile - target
                print(f"  Pile {i}: {pile} -> {target} (remove {remove})")
    
    print("=" * 50)


# =============================================================================
# EXAMPLE USAGE AND DEMONSTRATION
# =============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("GAME THEORY DEMONSTRATION")
    print("=" * 60)
    
    # Example 1: Standard Nim
    print("\n--- Example 1: Standard Nim ---")
    piles = [3, 4, 5]
    print_nim_analysis(piles)
    
    # Example 2: Find winning move
    print("\n--- Example 2: Winning Move ---")
    piles = [7, 4, 1]
    move = find_winning_move(piles)
    if move:
        print(f"Position {piles}: Winning move is pile {move[0]}, remove {move[1]}")
    
    # Example 3: Grundy numbers for take-1-or-2 game
    print("\n--- Example 3: Grundy Numbers (Take 1 or 2) ---")
    grundy_1_2 = compute_grundy(10, [1, 2])
    print(f"Grundy numbers: {grundy_1_2}")
    print(f"Pattern: G(n) = n % 3 = {[n % 3 for n in range(11)]}")
    
    # Example 4: Take 1 to 3 game
    print("\n--- Example 4: Take 1 to 3 Game ---")
    print("Position -> Grundy number:")
    for n in range(8):
        g = take_1_to_k_grundy(n, 3)
        print(f"  G({n}) = {g}")
    
    # Example 5: Misère Nim
    print("\n--- Example 5: Misère Nim ---")
    misere_positions = [[1, 1, 1], [2, 2], [1, 2, 3], [1, 1, 1, 1]]
    for pos in misere_positions:
        winner = "First" if can_win_misere_nim(pos) else "Second"
        print(f"  {pos}: {winner} player wins")
    
    # Example 6: Composite game
    print("\n--- Example 6: Composite Game ---")
    games = [[3, 4], [5], [1, 2]]
    analysis = composite_game_analysis(games)
    print(f"Subgames: {games}")
    print(f"Individual Grundy numbers: {analysis['individual_grundy']}")
    print(f"Total XOR: {analysis['total_xor']}")
    print(f"First player wins: {analysis['first_player_wins']}")
```

<!-- slide -->
```cpp
/**
 * Game Theory: Nim and Grundy Numbers Implementation
 * Comprehensive C++ implementation for competitive programming
 */

#include <bits/stdc++.h>
using namespace std;

// ============================================================================
// SECTION 1: BASIC NIM OPERATIONS
// ============================================================================

/**
 * Calculate XOR of all pile sizes (Nim-Sum)
 * Time: O(n), Space: O(1)
 */
int nimSum(const vector<int>& piles) {
    int result = 0;
    for (int pile : piles) {
        result ^= pile;
    }
    return result;
}

/**
 * Determine if first player can win at standard Nim
 * Time: O(n), Space: O(1)
 */
bool canWinNim(const vector<int>& piles) {
    return nimSum(piles) != 0;
}

/**
 * Find a winning move in standard Nim
 * Returns {pileIndex, stonesToRemove} or {-1, -1} if no winning move
 * Time: O(n), Space: O(1)
 */
pair<int, int> findWinningMove(const vector<int>& piles) {
    int totalXor = nimSum(piles);
    
    if (totalXor == 0) {
        return {-1, -1};  // No winning move from losing position
    }
    
    for (int i = 0; i < (int)piles.size(); i++) {
        int target = piles[i] ^ totalXor;
        if (target < piles[i]) {
            return {i, piles[i] - target};
        }
    }
    
    return {-1, -1};  // Should not reach here if totalXor != 0
}

/**
 * Get all winning moves from current position
 * Time: O(n), Space: O(n) for result
 */
vector<pair<int, int>> getAllWinningMoves(const vector<int>& piles) {
    int totalXor = nimSum(piles);
    vector<pair<int, int>> winningMoves;
    
    if (totalXor == 0) {
        return winningMoves;
    }
    
    for (int i = 0; i < (int)piles.size(); i++) {
        int target = piles[i] ^ totalXor;
        if (target < piles[i]) {
            winningMoves.push_back({i, piles[i] - target});
        }
    }
    
    return winningMoves;
}

// ============================================================================
// SECTION 2: GRUNDY NUMBER COMPUTATION
// ============================================================================

/**
 * Minimum excludant: smallest non-negative integer not in the set
 * Time: O(m) where m is the mex result
 */
int mex(const unordered_set<int>& values) {
    int m = 0;
    while (values.count(m)) {
        m++;
    }
    return m;
}

/**
 * Compute Grundy numbers for positions 0 to maxN
 * Time: O(maxN × |moves|)
 * Space: O(maxN)
 */
vector<int> computeGrundy(int maxN, const vector<int>& moves) {
    vector<int> grundy(maxN + 1, 0);
    
    for (int n = 1; n <= maxN; n++) {
        unordered_set<int> reachable;
        for (int move : moves) {
            if (move <= n) {
                reachable.insert(grundy[n - move]);
            }
        }
        grundy[n] = mex(reachable);
    }
    
    return grundy;
}

/**
 * Grundy number for game where you can take 1 to k objects
 * Pattern: G(n) = n % (k + 1)
 * Time: O(1)
 */
int take1ToKGrundy(int n, int k) {
    return n % (k + 1);
}

/**
 * Grundy number for subtraction game
 * Time: O(n × |subtractSet|)
 */
int subtractionGameGrundy(int n, const unordered_set<int>& subtractSet) {
    vector<int> grundy(n + 1, 0);
    
    for (int i = 1; i <= n; i++) {
        unordered_set<int> reachable;
        for (int k : subtractSet) {
            if (k <= i) {
                reachable.insert(grundy[i - k]);
            }
        }
        grundy[i] = mex(reachable);
    }
    
    return grundy[n];
}

// ============================================================================
// SECTION 3: COMPOSITE GAMES
// ============================================================================

/**
 * Determine winner of a composite game
 * Time: O(n), Space: O(1)
 */
bool compositeGameWinner(const vector<int>& grundyValues) {
    int total = 0;
    for (int g : grundyValues) {
        total ^= g;
    }
    return total != 0;
}

/**
 * Complete analysis of a composite game
 */
struct CompositeAnalysis {
    vector<int> individualGrundy;
    int totalXor;
    bool firstPlayerWins;
    vector<tuple<int, int, int>> winningSubgames;  // (idx, current, target)
};

CompositeAnalysis compositeGameAnalysis(const vector<vector<int>>& games) {
    CompositeAnalysis result;
    
    for (const auto& game : games) {
        result.individualGrundy.push_back(nimSum(game));
    }
    
    result.totalXor = 0;
    for (int g : result.individualGrundy) {
        result.totalXor ^= g;
    }
    
    result.firstPlayerWins = (result.totalXor != 0);
    
    // Find winning subgames
    for (int i = 0; i < (int)games.size(); i++) {
        int grundy = result.individualGrundy[i];
        if (grundy != 0) {
            int target = grundy ^ result.totalXor;
            if (target < grundy) {
                result.winningSubgames.push_back({i, grundy, target});
            }
        }
    }
    
    return result;
}

// ============================================================================
// SECTION 4: MISÈRE NIM
// ============================================================================

/**
 * Determine winner for Misère Nim (last player to move loses)
 * Time: O(n), Space: O(1)
 */
bool canWinMisereNim(const vector<int>& piles) {
    int countGt1 = 0;
    for (int p : piles) {
        if (p > 1) countGt1++;
    }
    
    if (countGt1 == 0) {
        // All piles have size 1
        return piles.size() % 2 == 1;
    } else {
        // Normal Nim strategy applies
        return nimSum(piles) != 0;
    }
}

/**
 * Find winning move in Misère Nim
 * Time: O(n), Space: O(1)
 */
pair<int, int> findMisereWinningMove(const vector<int>& piles) {
    int countGt1 = 0;
    for (int p : piles) {
        if (p > 1) countGt1++;
    }
    
    if (countGt1 == 0) {
        // All piles are size 1
        if (piles.size() % 2 == 1) {
            return {0, 1};  // Take any pile
        }
        return {-1, -1};
    }
    
    // Normal Nim strategy for most cases
    return findWinningMove(piles);
}

// ============================================================================
// SECTION 5: UTILITY FUNCTIONS
// ============================================================================

/**
 * Print complete analysis of a Nim position
 */
void printNimAnalysis(const vector<int>& piles) {
    cout << string(50, '=') << endl;
    cout << "NIM POSITION ANALYSIS" << endl;
    cout << string(50, '=') << endl;
    
    cout << "Piles: [";
    for (int i = 0; i < (int)piles.size(); i++) {
        if (i > 0) cout << ", ";
        cout << piles[i];
    }
    cout << "]" << endl;
    
    int nim = nimSum(piles);
    cout << "Nim-Sum: " << nim << endl;
    cout << "Binary: " << bitset<8>(nim) << endl;
    
    cout << "\nPosition Type: " << (nim != 0 ? "WINNING" : "LOSING") << endl;
    cout << "Optimal Player: " << (nim != 0 ? "First" : "Second") << endl;
    
    if (nim != 0) {
        cout << "\nWinning Moves:" << endl;
        for (int i = 0; i < (int)piles.size(); i++) {
            int target = piles[i] ^ nim;
            if (target < piles[i]) {
                int remove = piles[i] - target;
                cout << "  Pile " << i << ": " << piles[i] << " -> " 
                     << target << " (remove " << remove << ")" << endl;
            }
        }
    }
    
    cout << string(50, '=') << endl;
}

// ============================================================================
// EXAMPLE USAGE AND DEMONSTRATION
// ============================================================================

int main() {
    cout << "\n" << string(60, '=') << endl;
    cout << "GAME THEORY DEMONSTRATION" << endl;
    cout << string(60, '=') << endl;
    
    // Example 1: Standard Nim
    cout << "\n--- Example 1: Standard Nim ---" << endl;
    vector<int> piles1 = {3, 4, 5};
    printNimAnalysis(piles1);
    
    // Example 2: Find winning move
    cout << "\n--- Example 2: Winning Move ---" << endl;
    vector<int> piles2 = {7, 4, 1};
    auto move = findWinningMove(piles2);
    if (move.first != -1) {
        cout << "Position [7, 4, 1]: Winning move is pile " 
             << move.first << ", remove " << move.second << endl;
    }
    
    // Example 3: Grundy numbers
    cout << "\n--- Example 3: Grundy Numbers (Take 1 or 2) ---" << endl;
    vector<int> grundy12 = computeGrundy(10, {1, 2});
    cout << "Grundy numbers: [";
    for (int i = 0; i <= 10; i++) {
        if (i > 0) cout << ", ";
        cout << grundy12[i];
    }
    cout << "]" << endl;
    cout << "Pattern: G(n) = n % 3" << endl;
    
    // Example 4: Misère Nim
    cout << "\n--- Example 4: Misère Nim ---" << endl;
    vector<vector<int>> miserePos = {{1, 1, 1}, {2, 2}, {1, 2, 3}, {1, 1, 1, 1}};
    for (const auto& pos : miserePos) {
        bool firstWins = canWinMisereNim(pos);
        cout << "  [";
        for (int i = 0; i < (int)pos.size(); i++) {
            if (i > 0) cout << ", ";
            cout << pos[i];
        }
        cout << "]: " << (firstWins ? "First" : "Second") << " player wins" << endl;
    }
    
    // Example 5: Composite game
    cout << "\n--- Example 5: Composite Game ---" << endl;
    vector<vector<int>> games = {{3, 4}, {5}, {1, 2}};
    auto analysis = compositeGameAnalysis(games);
    cout << "Subgames:" << endl;
    for (const auto& g : games) {
        cout << "  [";
        for (int i = 0; i < (int)g.size(); i++) {
            if (i > 0) cout << ", ";
            cout << g[i];
        }
        cout << "]" << endl;
    }
    cout << "Individual Grundy: [";
    for (int i = 0; i < (int)analysis.individualGrundy.size(); i++) {
        if (i > 0) cout << ", ";
        cout << analysis.individualGrundy[i];
    }
    cout << "]" << endl;
    cout << "Total XOR: " << analysis.totalXor << endl;
    cout << "First player wins: " << (analysis.firstPlayerWins ? "Yes" : "No") << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Game Theory: Nim and Grundy Numbers Implementation
 * Comprehensive Java implementation for competitive programming
 */
public class GameTheory {
    
    // ========================================================================
    // SECTION 1: BASIC NIM OPERATIONS
    // ========================================================================
    
    /**
     * Calculate XOR of all pile sizes (Nim-Sum)
     * Time: O(n), Space: O(1)
     */
    public static int nimSum(List<Integer> piles) {
        int result = 0;
        for (int pile : piles) {
            result ^= pile;
        }
        return result;
    }
    
    /**
     * Determine if first player can win at standard Nim
     * Time: O(n), Space: O(1)
     */
    public static boolean canWinNim(List<Integer> piles) {
        return nimSum(piles) != 0;
    }
    
    /**
     * Find a winning move in standard Nim
     * Returns int[2] = {pileIndex, stonesToRemove} or null if no winning move
     * Time: O(n), Space: O(1)
     */
    public static int[] findWinningMove(List<Integer> piles) {
        int totalXor = nimSum(piles);
        
        if (totalXor == 0) {
            return null;  // No winning move from losing position
        }
        
        for (int i = 0; i < piles.size(); i++) {
            int target = piles.get(i) ^ totalXor;
            if (target < piles.get(i)) {
                return new int[]{i, piles.get(i) - target};
            }
        }
        
        return null;
    }
    
    /**
     * Get all winning moves from current position
     * Time: O(n), Space: O(n) for result
     */
    public static List<int[]> getAllWinningMoves(List<Integer> piles) {
        int totalXor = nimSum(piles);
        List<int[]> winningMoves = new ArrayList<>();
        
        if (totalXor == 0) {
            return winningMoves;
        }
        
        for (int i = 0; i < piles.size(); i++) {
            int target = piles.get(i) ^ totalXor;
            if (target < piles.get(i)) {
                winningMoves.add(new int[]{i, piles.get(i) - target});
            }
        }
        
        return winningMoves;
    }
    
    // ========================================================================
    // SECTION 2: GRUNDY NUMBER COMPUTATION
    // ========================================================================
    
    /**
     * Minimum excludant: smallest non-negative integer not in the set
     * Time: O(m) where m is the mex result
     */
    public static int mex(Set<Integer> values) {
        int m = 0;
        while (values.contains(m)) {
            m++;
        }
        return m;
    }
    
    /**
     * Compute Grundy numbers for positions 0 to maxN
     * Time: O(maxN × |moves|)
     * Space: O(maxN)
     */
    public static int[] computeGrundy(int maxN, int[] moves) {
        int[] grundy = new int[maxN + 1];
        
        for (int n = 1; n <= maxN; n++) {
            Set<Integer> reachable = new HashSet<>();
            for (int move : moves) {
                if (move <= n) {
                    reachable.add(grundy[n - move]);
                }
            }
            grundy[n] = mex(reachable);
        }
        
        return grundy;
    }
    
    /**
     * Grundy number for game where you can take 1 to k objects
     * Pattern: G(n) = n % (k + 1)
     * Time: O(1)
     */
    public static int take1ToKGrundy(int n, int k) {
        return n % (k + 1);
    }
    
    /**
     * Grundy number for subtraction game
     * Time: O(n × |subtractSet|)
     */
    public static int subtractionGameGrundy(int n, Set<Integer> subtractSet) {
        int[] grundy = new int[n + 1];
        
        for (int i = 1; i <= n; i++) {
            Set<Integer> reachable = new HashSet<>();
            for (int k : subtractSet) {
                if (k <= i) {
                    reachable.add(grundy[i - k]);
                }
            }
            grundy[i] = mex(reachable);
        }
        
        return grundy[n];
    }
    
    /**
     * Grundy number with memoization for complex games
     */
    private static Map<String, Integer> grundyCache = new HashMap<>();
    
    public static int grundyWythoff(int n, int m) {
        String key = n + "," + m;
        if (grundyCache.containsKey(key)) {
            return grundyCache.get(key);
        }
        
        if (n == 0 && m == 0) {
            return 0;
        }
        
        Set<Integer> reachable = new HashSet<>();
        
        // Take from first pile
        for (int i = 0; i < n; i++) {
            reachable.add(grundyWythoff(i, m));
        }
        
        // Take from second pile
        for (int j = 0; j < m; j++) {
            reachable.add(grundyWythoff(n, j));
        }
        
        // Take same from both
        for (int k = 1; k <= Math.min(n, m); k++) {
            reachable.add(grundyWythoff(n - k, m - k));
        }
        
        int result = mex(reachable);
        grundyCache.put(key, result);
        return result;
    }
    
    // ========================================================================
    // SECTION 3: COMPOSITE GAMES
    // ========================================================================
    
    /**
     * Determine winner of a composite game
     * Time: O(n), Space: O(1)
     */
    public static boolean compositeGameWinner(int[] grundyValues) {
        int total = 0;
        for (int g : grundyValues) {
            total ^= g;
        }
        return total != 0;
    }
    
    /**
     * Composite game analysis result
     */
    public static class CompositeAnalysis {
        public int[] individualGrundy;
        public int totalXor;
        public boolean firstPlayerWins;
        public List<int[]> winningSubgames;  // {idx, current, target}
        
        public CompositeAnalysis() {
            winningSubgames = new ArrayList<>();
        }
    }
    
    /**
     * Complete analysis of a composite game
     */
    public static CompositeAnalysis compositeGameAnalysis(List<List<Integer>> games) {
        CompositeAnalysis result = new CompositeAnalysis();
        result.individualGrundy = new int[games.size()];
        
        for (int i = 0; i < games.size(); i++) {
            result.individualGrundy[i] = nimSum(games.get(i));
        }
        
        result.totalXor = 0;
        for (int g : result.individualGrundy) {
            result.totalXor ^= g;
        }
        
        result.firstPlayerWins = (result.totalXor != 0);
        
        // Find winning subgames
        for (int i = 0; i < games.size(); i++) {
            int grundy = result.individualGrundy[i];
            if (grundy != 0) {
                int target = grundy ^ result.totalXor;
                if (target < grundy) {
                    result.winningSubgames.add(new int[]{i, grundy, target});
                }
            }
        }
        
        return result;
    }
    
    // ========================================================================
    // SECTION 4: MISÈRE NIM
    // ========================================================================
    
    /**
     * Determine winner for Misère Nim (last player to move loses)
     * Time: O(n), Space: O(1)
     */
    public static boolean canWinMisereNim(List<Integer> piles) {
        int countGt1 = 0;
        for (int p : piles) {
            if (p > 1) countGt1++;
        }
        
        if (countGt1 == 0) {
            // All piles have size 1
            return piles.size() % 2 == 1;
        } else {
            // Normal Nim strategy applies
            return nimSum(piles) != 0;
        }
    }
    
    /**
     * Find winning move in Misère Nim
     * Time: O(n), Space: O(1)
     */
    public static int[] findMisereWinningMove(List<Integer> piles) {
        int countGt1 = 0;
        for (int p : piles) {
            if (p > 1) countGt1++;
        }
        
        if (countGt1 == 0) {
            // All piles are size 1
            if (piles.size() % 2 == 1) {
                return new int[]{0, 1};  // Take any pile
            }
            return null;
        }
        
        // Normal Nim strategy for most cases
        return findWinningMove(piles);
    }
    
    // ========================================================================
    // SECTION 5: UTILITY FUNCTIONS
    // ========================================================================
    
    /**
     * Print complete analysis of a Nim position
     */
    public static void printNimAnalysis(List<Integer> piles) {
        System.out.println("=".repeat(50));
        System.out.println("NIM POSITION ANALYSIS");
        System.out.println("=".repeat(50));
        System.out.println("Piles: " + piles);
        
        int nim = nimSum(piles);
        System.out.println("Nim-Sum: " + nim);
        System.out.println("Binary: " + String.format("%8s", Integer.toBinaryString(nim)).replace(' ', '0'));
        
        System.out.println("\nPosition Type: " + (nim != 0 ? "WINNING" : "LOSING"));
        System.out.println("Optimal Player: " + (nim != 0 ? "First" : "Second"));
        
        if (nim != 0) {
            System.out.println("\nWinning Moves:");
            for (int i = 0; i < piles.size(); i++) {
                int target = piles.get(i) ^ nim;
                if (target < piles.get(i)) {
                    int remove = piles.get(i) - target;
                    System.out.println("  Pile " + i + ": " + piles.get(i) + " -> " 
                                     + target + " (remove " + remove + ")");
                }
            }
        }
        
        System.out.println("=".repeat(50));
    }
    
    // ========================================================================
    // EXAMPLE USAGE AND DEMONSTRATION
    // ========================================================================
    
    public static void main(String[] args) {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("GAME THEORY DEMONSTRATION");
        System.out.println("=".repeat(60));
        
        // Example 1: Standard Nim
        System.out.println("\n--- Example 1: Standard Nim ---");
        List<Integer> piles1 = Arrays.asList(3, 4, 5);
        printNimAnalysis(piles1);
        
        // Example 2: Find winning move
        System.out.println("\n--- Example 2: Winning Move ---");
        List<Integer> piles2 = Arrays.asList(7, 4, 1);
        int[] move = findWinningMove(piles2);
        if (move != null) {
            System.out.println("Position " + piles2 + ": Winning move is pile " 
                             + move[0] + ", remove " + move[1]);
        }
        
        // Example 3: Grundy numbers
        System.out.println("\n--- Example 3: Grundy Numbers (Take 1 or 2) ---");
        int[] grundy12 = computeGrundy(10, new int[]{1, 2});
        System.out.println("Grundy numbers: " + Arrays.toString(grundy12));
        System.out.println("Pattern: G(n) = n % 3");
        
        // Example 4: Misère Nim
        System.out.println("\n--- Example 4: Misère Nim ---");
        List<List<Integer>> miserePos = Arrays.asList(
            Arrays.asList(1, 1, 1),
            Arrays.asList(2, 2),
            Arrays.asList(1, 2, 3),
            Arrays.asList(1, 1, 1, 1)
        );
        for (List<Integer> pos : miserePos) {
            boolean firstWins = canWinMisereNim(pos);
            System.out.println("  " + pos + ": " + (firstWins ? "First" : "Second") + " player wins");
        }
        
        // Example 5: Composite game
        System.out.println("\n--- Example 5: Composite Game ---");
        List<List<Integer>> games = Arrays.asList(
            Arrays.asList(3, 4),
            Arrays.asList(5),
            Arrays.asList(1, 2)
        );
        CompositeAnalysis analysis = compositeGameAnalysis(games);
        System.out.println("Subgames: " + games);
        System.out.println("Individual Grundy: " + Arrays.toString(analysis.individualGrundy));
        System.out.println("Total XOR: " + analysis.totalXor);
        System.out.println("First player wins: " + (analysis.firstPlayerWins ? "Yes" : "No"));
    }
}
```

<!-- slide -->
```javascript
/**
 * Game Theory: Nim and Grundy Numbers Implementation
 * Comprehensive JavaScript implementation for competitive programming
 */

// ============================================================================
// SECTION 1: BASIC NIM OPERATIONS
// ============================================================================

/**
 * Calculate XOR of all pile sizes (Nim-Sum)
 * @param {number[]} piles - Array of pile sizes
 * @returns {number} XOR of all pile sizes
 * @time O(n)
 * @space O(1)
 */
function nimSum(piles) {
    return piles.reduce((acc, pile) => acc ^ pile, 0);
}

/**
 * Determine if first player can win at standard Nim
 * @param {number[]} piles - Array of pile sizes
 * @returns {boolean} True if first player can win
 * @time O(n)
 * @space O(1)
 */
function canWinNim(piles) {
    return nimSum(piles) !== 0;
}

/**
 * Find a winning move in standard Nim
 * @param {number[]} piles - Array of pile sizes
 * @returns {[number, number]|null} [pileIndex, stonesToRemove] or null
 * @time O(n)
 * @space O(1)
 */
function findWinningMove(piles) {
    const totalXor = nimSum(piles);
    
    if (totalXor === 0) {
        return null;  // No winning move from losing position
    }
    
    for (let i = 0; i < piles.length; i++) {
        const target = piles[i] ^ totalXor;
        if (target < piles[i]) {
            return [i, piles[i] - target];
        }
    }
    
    return null;
}

/**
 * Get all winning moves from current position
 * @param {number[]} piles - Array of pile sizes
 * @returns {[number, number][]} Array of [pileIndex, stonesToRemove]
 * @time O(n)
 * @space O(n)
 */
function getAllWinningMoves(piles) {
    const totalXor = nimSum(piles);
    const winningMoves = [];
    
    if (totalXor === 0) {
        return winningMoves;
    }
    
    for (let i = 0; i < piles.length; i++) {
        const target = piles[i] ^ totalXor;
        if (target < piles[i]) {
            winningMoves.push([i, piles[i] - target]);
        }
    }
    
    return winningMoves;
}

// ============================================================================
// SECTION 2: GRUNDY NUMBER COMPUTATION
// ============================================================================

/**
 * Minimum excludant: smallest non-negative integer not in the set
 * @param {Set<number>} values - Set of non-negative integers
 * @returns {number} Smallest non-negative integer not in values
 * @time O(m) where m is the mex result
 */
function mex(values) {
    let m = 0;
    while (values.has(m)) {
        m++;
    }
    return m;
}

/**
 * Compute Grundy numbers for positions 0 to maxN
 * @param {number} maxN - Maximum position to compute
 * @param {number[]} moves - Array of allowed move sizes
 * @returns {number[]} Array where grundy[i] = Grundy number for position i
 * @time O(maxN × |moves|)
 * @space O(maxN)
 */
function computeGrundy(maxN, moves) {
    const grundy = new Array(maxN + 1).fill(0);
    
    for (let n = 1; n <= maxN; n++) {
        const reachable = new Set();
        for (const move of moves) {
            if (move <= n) {
                reachable.add(grundy[n - move]);
            }
        }
        grundy[n] = mex(reachable);
    }
    
    return grundy;
}

/**
 * Grundy number for game where you can take 1 to k objects
 * Pattern: G(n) = n % (k + 1)
 * @param {number} n - Number of objects
 * @param {number} k - Maximum objects that can be taken
 * @returns {number} Grundy number
 * @time O(1)
 * @space O(1)
 */
function take1ToKGrundy(n, k) {
    return n % (k + 1);
}

/**
 * Grundy number for subtraction game
 * @param {number} n - Number of objects
 * @param {Set<number>} subtractSet - Set of allowed subtraction values
 * @returns {number} Grundy number
 * @time O(n × |subtractSet|)
 * @space O(n)
 */
function subtractionGameGrundy(n, subtractSet) {
    const grundy = new Array(n + 1).fill(0);
    
    for (let i = 1; i <= n; i++) {
        const reachable = new Set();
        for (const k of subtractSet) {
            if (k <= i) {
                reachable.add(grundy[i - k]);
            }
        }
        grundy[i] = mex(reachable);
    }
    
    return grundy[n];
}

// Cache for memoized Grundy computation
const grundyCache = new Map();

/**
 * Grundy number for Wythoff's Nim (with memoization)
 * Wythoff's Nim allows removing from one pile or same amount from both
 * @param {number} n - Size of first pile
 * @param {number} m - Size of second pile
 * @returns {number} Grundy number
 * @time O(n × m × (n + m)) without memoization
 * @space O(n × m) for cache
 */
function grundyWythoff(n, m) {
    const key = `${n},${m}`;
    if (grundyCache.has(key)) {
        return grundyCache.get(key);
    }
    
    if (n === 0 && m === 0) {
        return 0;
    }
    
    const reachable = new Set();
    
    // Take from first pile
    for (let i = 0; i < n; i++) {
        reachable.add(grundyWythoff(i, m));
    }
    
    // Take from second pile
    for (let j = 0; j < m; j++) {
        reachable.add(grundyWythoff(n, j));
    }
    
    // Take same amount from both piles
    for (let k = 1; k <= Math.min(n, m); k++) {
        reachable.add(grundyWythoff(n - k, m - k));
    }
    
    const result = mex(reachable);
    grundyCache.set(key, result);
    return result;
}

// ============================================================================
// SECTION 3: COMPOSITE GAMES
// ============================================================================

/**
 * Determine winner of a composite game
 * @param {number[]} grundyValues - Array of Grundy numbers for each subgame
 * @returns {boolean} True if first player wins
 * @time O(n)
 * @space O(1)
 */
function compositeGameWinner(grundyValues) {
    const total = grundyValues.reduce((acc, g) => acc ^ g, 0);
    return total !== 0;
}

/**
 * Complete analysis of a composite game
 * @param {number[][]} games - Array of game positions (each is array of pile sizes)
 * @returns {Object} Analysis result with individual Grundy, total XOR, etc.
 */
function compositeGameAnalysis(games) {
    const individualGrundy = games.map(game => nimSum(game));
    const totalXor = individualGrundy.reduce((acc, g) => acc ^ g, 0);
    
    // Find winning subgames
    const winningSubgames = [];
    for (let i = 0; i < games.length; i++) {
        const grundy = individualGrundy[i];
        if (grundy !== 0) {
            const target = grundy ^ totalXor;
            if (target < grundy) {
                winningSubgames.push([i, grundy, target]);
            }
        }
    }
    
    return {
        individualGrundy,
        totalXor,
        firstPlayerWins: totalXor !== 0,
        winningSubgames
    };
}

// ============================================================================
// SECTION 4: MISÈRE NIM
// ============================================================================

/**
 * Determine winner for Misère Nim (last player to move loses)
 * @param {number[]} piles - Array of pile sizes
 * @returns {boolean} True if first player can win
 * @time O(n)
 * @space O(1)
 */
function canWinMisereNim(piles) {
    const countGt1 = piles.filter(p => p > 1).length;
    
    if (countGt1 === 0) {
        // All piles have size 1
        return piles.length % 2 === 1;
    } else {
        // Normal Nim strategy applies
        return nimSum(piles) !== 0;
    }
}

/**
 * Find winning move in Misère Nim
 * @param {number[]} piles - Array of pile sizes
 * @returns {[number, number]|null} [pileIndex, stonesToRemove] or null
 * @time O(n)
 * @space O(1)
 */
function findMisereWinningMove(piles) {
    const countGt1 = piles.filter(p => p > 1).length;
    
    if (countGt1 === 0) {
        // All piles are size 1
        if (piles.length % 2 === 1) {
            return [0, 1];  // Take any pile
        }
        return null;
    }
    
    // Normal Nim strategy for most cases
    return findWinningMove(piles);
}

// ============================================================================
// SECTION 5: UTILITY FUNCTIONS
// ============================================================================

/**
 * Print complete analysis of a Nim position
 * @param {number[]} piles - Array of pile sizes
 */
function printNimAnalysis(piles) {
    console.log("=".repeat(50));
    console.log("NIM POSITION ANALYSIS");
    console.log("=".repeat(50));
    console.log(`Piles: [${piles.join(", ")}]`);
    
    const nim = nimSum(piles);
    console.log(`Nim-Sum: ${nim}`);
    console.log(`Binary: ${nim.toString(2).padStart(8, '0')}`);
    
    console.log(`\nPosition Type: ${nim !== 0 ? "WINNING" : "LOSING"}`);
    console.log(`Optimal Player: ${nim !== 0 ? "First" : "Second"}`);
    
    if (nim !== 0) {
        console.log("\nWinning Moves:");
        for (let i = 0; i < piles.length; i++) {
            const target = piles[i] ^ nim;
            if (target < piles[i]) {
                const remove = piles[i] - target;
                console.log(`  Pile ${i}: ${piles[i]} -> ${target} (remove ${remove})`);
            }
        }
    }
    
    console.log("=".repeat(50));
}

// ============================================================================
// EXAMPLE USAGE AND DEMONSTRATION
// ============================================================================

console.log("\n" + "=".repeat(60));
console.log("GAME THEORY DEMONSTRATION");
console.log("=".repeat(60));

// Example 1: Standard Nim
console.log("\n--- Example 1: Standard Nim ---");
const piles1 = [3, 4, 5];
printNimAnalysis(piles1);

// Example 2: Find winning move
console.log("\n--- Example 2: Winning Move ---");
const piles2 = [7, 4, 1];
const move = findWinningMove(piles2);
if (move) {
    console.log(`Position [${piles2.join(", ")}]: Winning move is pile ${move[0]}, remove ${move[1]}`);
}

// Example 3: Grundy numbers
console.log("\n--- Example 3: Grundy Numbers (Take 1 or 2) ---");
const grundy12 = computeGrundy(10, [1, 2]);
console.log(`Grundy numbers: [${grundy12.join(", ")}]`);
console.log(`Pattern: G(n) = n % 3`);

// Example 4: Take 1 to 3 game
console.log("\n--- Example 4: Take 1 to 3 Game ---");
console.log("Position -> Grundy number:");
for (let n = 0; n < 8; n++) {
    const g = take1ToKGrundy(n, 3);
    console.log(`  G(${n}) = ${g}`);
}

// Example 5: Misère Nim
console.log("\n--- Example 5: Misère Nim ---");
const miserePositions = [[1, 1, 1], [2, 2], [1, 2, 3], [1, 1, 1, 1]];
for (const pos of miserePositions) {
    const winner = canWinMisereNim(pos) ? "First" : "Second";
    console.log(`  [${pos.join(", ")}]: ${winner} player wins`);
}

// Example 6: Composite game
console.log("\n--- Example 6: Composite Game ---");
const games = [[3, 4], [5], [1, 2]];
const analysis = compositeGameAnalysis(games);
console.log(`Subgames: ${JSON.stringify(games)}`);
console.log(`Individual Grundy: [${analysis.individualGrundy.join(", ")}]`);
console.log(`Total XOR: ${analysis.totalXor}`);
console.log(`First player wins: ${analysis.firstPlayerWins ? "Yes" : "No"}`);

// Export functions for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        nimSum,
        canWinNim,
        findWinningMove,
        getAllWinningMoves,
        mex,
        computeGrundy,
        take1ToKGrundy,
        subtractionGameGrundy,
        grundyWythoff,
        compositeGameWinner,
        compositeGameAnalysis,
        canWinMisereNim,
        findMisereWinningMove,
        printNimAnalysis
    };
}
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|-----------------|-------------|
| **Nim-Sum Calculation** | O(n) | Single pass XOR over all piles |
| **Find Winning Move** | O(n) | Calculate XOR + scan all piles |
| **Grundy (single position)** | O(n × \|moves\|) | Compute reachable states and mex |
| **Grundy (all positions to n)** | O(n × \|moves\|) | Dynamic programming approach |
| **Composite Game Analysis** | O(k × n) | k subgames, n piles each |
| **Misère Nim** | O(n) | Count piles + XOR calculation |

### Detailed Breakdown

**Nim-Sum Calculation:**
- Single XOR operation per pile: O(1) per pile
- Total: O(n) where n = number of piles

**Finding Winning Moves:**
- Calculate nim-sum: O(n)
- For each pile, check if `(pile ^ nim_sum) < pile`: O(1) per pile
- Total: O(n)

**Grundy Number Computation:**
- For each position from 1 to n: O(n)
- For each valid move: O(\|moves\|)
- mex operation on reachable set: O(\|reachable\|) ≤ O(\|moves\|)
- Total: O(n × \|moves\|)

**Memoized Grundy (Wythoff's Nim):**
- Without memoization: O(n × m × (n + m)) - exponential
- With memoization: O(n × m) unique states
- Each state explores O(n + m) moves
- Total: O((n × m) × (n + m))

---

## Space Complexity Analysis

| Data Structure | Space Complexity | Description |
|----------------|------------------|-------------|
| **Nim-Sum** | O(1) | Single integer accumulator |
| **Winning Move Search** | O(1) | Constant extra space |
| **Grundy Array** | O(n) | Store Grundy numbers for positions 0..n |
| **Grundy (memoized)** | O(n × m) | 2D cache for Wythoff's Nim |
| **Composite Games** | O(k) | k subgame Grundy numbers |

### Space Optimization Tips

1. **Pattern Detection**: Many games exhibit periodic Grundy patterns
   - Store first period + offset for O(1) lookup
   - Reduces space from O(n) to O(period)

2. **On-the-fly Computation**: For single queries, compute Grundy recursively with memoization instead of full DP array

3. **Bit-packed Storage**: If Grundy values are small, use bit manipulation to reduce memory footprint

---

## Common Variations

### 1. Misère Nim (Last Player Loses)

Misère Nim changes the winning condition - the player who makes the last move loses.

**Strategy:**
```
If all piles have size 1:
    First player wins iff odd number of piles
Else:
    Use normal Nim strategy, but when making the final
    move that leaves only size-1 piles, leave an ODD count
```

**Implementation:**

````carousel
```python
def can_win_misere_nim(piles):
    count_gt_1 = sum(1 for p in piles if p > 1)
    
    if count_gt_1 == 0:
        # All piles size 1: first wins if odd count
        return len(piles) % 2 == 1
    else:
        # Normal Nim strategy
        return nim_sum(piles) != 0
```
````

### 2. Subtraction Games

Remove k objects where k belongs to a specific set S.

**Example - Take 1, 3, or 4:**
```
G(0) = 0
G(1) = mex{G(0)} = mex{0} = 1
G(2) = mex{G(1)} = mex{1} = 0
G(3) = mex{G(2), G(0)} = mex{0, 0} = 1
G(4) = mex{G(3), G(1), G(0)} = mex{1, 1, 0} = 2
...
```

**Key Insight**: Many subtraction games eventually become periodic.

### 3. Take-Away Games with Upper Bounds

Can take 1 to k objects: **G(n) = n mod (k+1)**

**Proof Sketch:**
- Base: G(0) = 0
- Inductive step: From position n, can reach positions n-1, n-2, ..., n-k
- These have Grundy numbers (n-1)%(k+1), (n-2)%(k+1), etc.
- The mex of these k consecutive values (mod k+1) is n%(k+1)

### 4. Wythoff's Nim

Remove any positive number from one pile OR the same positive number from both piles.

**Key Property**: Losing positions are related to the golden ratio!
```
Losing positions (a_k, b_k) where:
a_k = floor(k × φ)
b_k = floor(k × φ²) = a_k + k
where φ = (1 + √5) / 2 ≈ 1.618
```

**Example losing positions:** (0,0), (1,2), (3,5), (4,7), (6,10)...

### 5. Nim with Pass Move

Each player can pass once per game:
- Changes the parity analysis
- Effectively adds a binary state (passed/not passed) to each position
- Grundy numbers become G(position, pass_available)

### 6. Circular Nim

Piles arranged in a circle, can only take from adjacent piles:
- Requires graph-based analysis
- Use Sprague-Grundy on the circular arrangement
- More complex than standard Nim

---

## Practice Problems

### Problem 1: Nim Game (LeetCode 292)

**Problem:** [292. Nim Game](https://leetcode.com/problems/nim-game/)

**Description:** You are playing a simplified Nim game with your friend. There is a heap of stones on the table, each time one of you takes turns to remove 1 to 3 stones. The one who removes the last stone will be the winner. You will take the first turn to remove stones. Given n, determine if you can win the game.

**How to Apply:**
- This is a take-1-to-k game where k = 3
- Use the formula: `G(n) = n % (k + 1) = n % 4`
- First player wins iff `n % 4 != 0`

**Solution:**
```python
def canWinNim(n: int) -> bool:
    return n % 4 != 0
```

---

### Problem 2: Game of Nim (LeetCode 1908)

**Problem:** [1908. Game of Nim](https://leetcode.com/problems/game-of-nim/)

**Description:** Alice and Bob take turns playing a game with n piles of stones. On each turn, a player removes any non-zero number of stones from any single pile. Return `true` if Alice wins the game, assuming both players play optimally.

**How to Apply:**
- Classic Nim game with multiple piles
- Calculate Nim-sum by XORing all pile sizes
- Alice (first player) wins if Nim-sum ≠ 0

**Solution:**
```python
from functools import reduce
import operator

def nimGame(piles: List[int]) -> bool:
    return reduce(operator.xor, piles, 0) != 0
```

---

### Problem 3: Can I Win (LeetCode 464)

**Problem:** [464. Can I Win](https://leetcode.com/problems/can-i-win/)

**Description:** In the "100 game," two players take turns adding integers to a running total, with the goal of reaching exactly 100. The integers are from 1 to maxChoosableInteger, and each can only be used once. Determine if the first player can force a win.

**How to Apply:**
- This is an impartial game with state = (used_numbers, current_sum)
- Use memoization with bitmasks to represent used numbers
- State space: 2^maxChoosableInteger × desiredTotal
- Apply minimax with memoization (not pure Nim, but related game theory)

**Solution Approach:**
```python
def canIWin(maxChoosableInteger: int, desiredTotal: int) -> bool:
    # If sum of all numbers < desiredTotal, no one can win
    if (1 + maxChoosableInteger) * maxChoosableInteger // 2 < desiredTotal:
        return False
    
    @lru_cache(None)
    def dfs(used_numbers: int, current_total: int) -> bool:
        # Try each available number
        for i in range(maxChoosableInteger):
            cur = 1 << i
            if not (used_numbers & cur):  # Number i+1 not used
                if current_total + i + 1 >= desiredTotal:
                    return True  # Win immediately
                # Check if opponent loses
                if not dfs(used_numbers | cur, current_total + i + 1):
                    return True
        return False
    
    return dfs(0, 0)
```

---

### Problem 4: Cat and Mouse II (LeetCode 1728)

**Problem:** [1728. Cat and Mouse II](https://leetcode.com/problems/cat-and-mouse-ii/)

**Description:** A game on a grid where Cat and Mouse take turns moving. Determine if Mouse can escape or if Cat will catch Mouse.

**How to Apply:**
- This is a **partisan** game (Cat and Mouse have different moves)
- Use retrograde analysis / game graph analysis
- State: (mouse_pos, cat_pos, turn)
- States can be: MOUSE_WIN, CAT_WIN, or DRAW
- Work backwards from terminal states

**Key Insight:** Not directly applicable with Sprague-Grundy (partisan), but uses similar game-theoretic analysis with state classification.

---

### Problem 5: Stone Game IX (LeetCode 2029)

**Problem:** [2029. Stone Game IX](https://leetcode.com/problems/stone-game-ix/)

**Description:** Alice and Bob take turns removing stones from a pile. Each stone has a value. The sum of removed stones is kept modulo 3. A player loses if after their move, the total sum ≡ 0 (mod 3). Determine if Alice can win.

**How to Apply:**
- State-based game theory with modulo constraint
- Count stones by value % 3 (three types: 0, 1, 2)
- Use DP with state (count0, count1, count2, current_sum_mod3, turn)
- Apply minimax to determine winning positions

**Solution Approach:**
```python
def stoneGameIX(stones: List[int]) -> bool:
    from functools import lru_cache
    
    count = [0, 0, 0]
    for s in stones:
        count[s % 3] += 1
    
    @lru_cache(None)
    def dfs(c0, c1, c2, mod, is_alice_turn):
        # Check terminal conditions
        if c0 + c1 + c2 == 0:
            return not is_alice_turn  # Previous player made last move
        
        # Try each type of stone
        # Type 0: always safe (doesn't change mod)
        if c0 > 0:
            if not dfs(c0 - 1, c1, c2, mod, not is_alice_turn):
                return True
        
        # Type 1: safe if (mod + 1) % 3 != 0
        if c1 > 0 and (mod + 1) % 3 != 0:
            if not dfs(c0, c1 - 1, c2, (mod + 1) % 3, not is_alice_turn):
                return True
        
        # Type 2: safe if (mod + 2) % 3 != 0
        if c2 > 0 and (mod + 2) % 3 != 0:
            if not dfs(c0, c1, c2 - 1, (mod + 2) % 3, not is_alice_turn):
                return True
        
        return False
    
    # Alice can start with type 1 or type 2
    return dfs(count[0], count[1], count[2], 0, True)
```

---

## Video Tutorial Links

### Fundamentals

- [Nim Game Theory Explained (WilliamFiset)](https://www.youtube.com/watch?v=51Bj6NCHKL0) - Excellent introduction to Nim and XOR strategy
- [Sprague-Grundy Theorem (Algorithms Live!)](https://www.youtube.com/watch?v=0L1p0pL5osA) - Deep dive into impartial game theory
- [Game Theory for Competitive Programming (Errichto)](https://www.youtube.com/watch?v=5yK9h1V3X5E) - Practical applications in contests

### Advanced Topics

- [Misère Nim Strategy (MindYourDecisions)](https://www.youtube.com/watch?v=KfSgE_wDFPE) - Understanding the misère variation
- [Wythoff's Nim and the Golden Ratio](https://www.youtube.com/watch?v=3pA3i6U0B2M) - Mathematical beauty of Wythoff's game
- [Grundy Numbers Explained (Tushar Roy)](https://www.youtube.com/watch?v=5yK9h1V3X5E) - Step-by-step Grundy computation

### Practice Problems Walkthrough

- [LeetCode Nim Game Solution](https://www.youtube.com/watch?v=4Z_4T6k2d1A) - Solving the classic Nim problem
- [Combinatorial Game Theory Playlist (MIT OpenCourseWare)](https://www.youtube.com/playlist?list=PL6NdkQ84ROM7i2gF4g4e69L9hRdpV3I1e) - Academic deep dive

---

## Follow-up Questions

### Q1: Why does the XOR operation determine the winner in Nim?

**Answer:** The XOR (nim-sum) works because of three key properties:

1. **Terminal position has nim-sum 0**: When all piles are empty, XOR = 0
2. **From any position with nim-sum ≠ 0, there exists a move to nim-sum = 0**: This is the winning strategy - always leave your opponent with XOR = 0
3. **From any position with nim-sum = 0, all moves lead to nim-sum ≠ 0**: The opponent cannot maintain the losing position

These properties mirror the definition of P-positions (previous player wins) and N-positions (next player wins) in combinatorial game theory.

### Q2: How do I find the actual winning move, not just determine if one exists?

**Answer:** Given nim-sum `S` and piles `p₁, p₂, ..., pₙ`:

1. Find a pile `pᵢ` where `pᵢ XOR S < pᵢ`
2. Reduce pile `pᵢ` to `pᵢ XOR S`
3. Remove `pᵢ - (pᵢ XOR S)` stones from pile `i`

**Why this works:** After the move, the new nim-sum is `(pᵢ XOR S) XOR (other piles) = S XOR S = 0`, leaving the opponent in a losing position.

### Q3: Can Sprague-Grundy be applied to all games?

**Answer:** No, Sprague-Grundy theorem applies **only to impartial games** where:
- Both players have the same available moves from any position
- The last player to move wins (normal play convention)

It does **NOT** apply to:
- **Partisan games**: Where players have different moves (e.g., Chess, Checkers)
- **Games with chance elements**: Dice, card draws
- **Games with imperfect information**: Hidden cards, simultaneous moves

For partisan games, use minimax or other game theory approaches.

### Q4: What are some common Grundy number patterns?

**Answer:** Here are frequently encountered patterns:

| Game Description | Grundy Pattern | Period |
|-----------------|----------------|--------|
| Take 1..k | G(n) = n mod (k+1) | k+1 |
| Take powers of 2 | G(n) = number of 1s in binary (popcount) | None |
| Take odd numbers | G(n) = n mod 2 | 2 |
| Take 1 or 3 | Periodic: [0,1,0,1,2,3,2,0,1,0,1,2,3,2...] | 5 |
| Wythoff's Nim | Non-periodic, related to φ | None |

### Q5: How do I handle games where the Grundy computation is too slow?

**Answer:** Several optimization strategies:

1. **Pattern Detection**: Compute Grundy values until a period is detected, then use modulo arithmetic
2. **Matrix Exponentiation**: For linear recurrences, use fast exponentiation (O(log n))
3. **Memoization with Pruning**: Skip states that are unreachable
4. **Symmetry Exploitation**: Many games have symmetric positions with identical Grundy numbers
5. **Approximation**: For very large n, use mathematical properties (e.g., Wythoff's golden ratio formula)

---

## Summary

Game theory, particularly Nim and the Sprague-Grundy theorem, provides powerful tools for analyzing impartial combinatorial games:

### Key Takeaways

1. **Nim-Sum Rule**: XOR all pile sizes. If result ≠ 0, first player wins; otherwise, second player wins with optimal play.

2. **Sprague-Grundy Theorem**: Every impartial game position is equivalent to a Nim pile of size G(position), where:
   ```
   G(position) = mex({ G(next_position) for all valid moves })
   ```

3. **Composite Games**: XOR the Grundy numbers of all independent subgames.

4. **Common Patterns**:
   - Take 1..k: `G(n) = n mod (k+1)`
   - Many games eventually become periodic

5. **Misère Nim**: Special case where last player loses - strategy differs when all piles are size 1.

### When to Use

- ✅ **Multiple independent subgames** - Use Sprague-Grundy
- ✅ **Standard Nim variations** - Use nim-sum (XOR)
- ✅ **Subtraction/take-away games** - Compute Grundy numbers
- ✅ **Games with periodic patterns** - Precompute and use O(1) lookup
- ❌ **Partisan games** (Chess, Checkers) - Use minimax instead
- ❌ **Games with hidden information** - Different theory applies

### Quick Reference

```
Standard Nim Winner:  (pile₁ XOR pile₂ XOR ... XOR pileₙ) ≠ 0
Grundy Number:       G(n) = mex({ G(n - move) for all valid moves })
Composite Game:      G(total) = G(game₁) XOR G(game₂) XOR ...
mex function:        smallest non-negative integer not in set
```

Mastering these concepts will help you solve a wide variety of competitive programming problems involving game theory and optimal play analysis.

---

## Related Algorithms

- [Bit Manipulation](./bit-manipulation.md) - XOR operations fundamental to Nim
- [Dynamic Programming](./dynamic-programming.md) - State memoization for Grundy numbers
- [Minimax Algorithm](./minimax.md) - For partisan games where Sprague-Grundy doesn't apply
- [Graph Theory](./graph-theory.md) - For games played on graphs
- [Memoization Patterns](./memoization-patterns.md) - Caching strategies for game states
