# Game Theory (Nim / Grundy Numbers)

## Category
Advanced / Math & Number Theory

## Description

**Combinatorial Game Theory** studies two-player games of perfect information with no chance elements. **Nim** is the most fundamental impartial game, and the **Sprague-Grundy Theorem** generalizes Nim analysis to all impartial games.

### Key Concepts

- **Impartial Game**: Both players have the same moves available
- **Normal Play**: Last player to move wins
- **Nim-Sum**: XOR of all pile sizes (determines winner)
- **Grundy Number** (or nimber): Equivalent Nim pile size for any position

---

## When to Use

Use Game Theory when analyzing:

- **Nim Variations**: Multiple piles with removal rules
- **Take-Away Games**: Stones, tokens, or objects removal
- **Subtraction Games**: Remove k objects where k ∈ S
- **Graph Games**: Moving tokens on graphs
- **Impartial Games**: Any game where both players have same options
- **Winning/Losing Positions**: Determine optimal play outcomes

### Common Patterns

- **Single pile with moves 1..k**: Take modulo (k+1)
- **Multiple piles**: Calculate Grundy numbers and XOR
- **Circular/Linear arrangements**: Use symmetry breaking
- **Composite games**: Sprague-Grundy theorem

---

## Algorithm Explanation

### Nim Game

**Rules**: Multiple piles of stones. On each turn, a player removes any positive number of stones from one pile. Player who cannot move loses.

**Winning Strategy**:
```
Nim-Sum = a₁ XOR a₂ XOR ... XOR aₙ

If Nim-Sum ≠ 0: First player wins (with optimal play)
If Nim-Sum = 0: Second player wins (with optimal play)
```

### Sprague-Grundy Theorem

Every impartial game position is equivalent to a Nim pile of size G(position), where:
```
G(position) = mex({G(next_position) for all valid moves})
```

**mex** (minimum excludant): smallest non-negative integer not in the set.

For composite games (sum of independent games):
```
G(total) = G(game₁) XOR G(game₂) XOR ... XOR G(gameₙ)
```

### Computing Grundy Numbers

```
G(0) = 0  (terminal position)
G(n) = mex({G(n - move) for all valid moves from position n})
```

---

## Implementation

### Template Code

````carousel
```python
from functools import lru_cache


def nim_sum(piles: list[int]) -> int:
    """
    Calculate XOR of all pile sizes.
    
    Time: O(n), Space: O(1)
    """
    result = 0
    for pile in piles:
        result ^= pile
    return result


def can_win_nim(piles: list[int]) -> bool:
    """
    Determine if first player can win at Nim.
    
    Returns True if current player can force a win.
    """
    return nim_sum(piles) != 0


def find_winning_move(piles: list[int]) -> tuple[int, int] | None:
    """
    Find a winning move (pile_index, stones_to_remove).
    Returns None if no winning move exists.
    """
    total_xor = nim_sum(piles)
    
    if total_xor == 0:
        return None  # No winning move from losing position
    
    for i, pile in enumerate(piles):
        # Target size for this pile
        target = pile ^ total_xor
        if target < pile:
            return (i, pile - target)
    
    return None


def mex(values: set[int]) -> int:
    """
    Minimum excludant: smallest non-negative integer not in the set.
    """
    m = 0
    while m in values:
        m += 1
    return m


def compute_grundy(max_n: int, valid_moves: list[int]) -> list[int]:
    """
    Compute Grundy numbers for positions 0 to max_n.
    
    Args:
        max_n: Maximum position to compute
        valid_moves: List of allowed move sizes
    
    Returns:
        grundy[i] = Grundy number for position with i objects
    """
    grundy = [0] * (max_n + 1)
    
    for n in range(1, max_n + 1):
        reachable = set()
        for move in valid_moves:
            if move <= n:
                reachable.add(grundy[n - move])
        grundy[n] = mex(reachable)
    
    return grundy


# Common game Grundy numbers

def subtraction_game_grundy(n: int, subtract_set: set[int]) -> int:
    """
    Grundy for subtraction game: can subtract any k ∈ subtract_set.
    """
    grundy = [0] * (n + 1)
    
    for i in range(1, n + 1):
        reachable = {grundy[i - k] for k in subtract_set if k <= i}
        grundy[i] = mex(reachable)
    
    return grundy[n]


def take_1_to_k_grundy(n: int, k: int) -> int:
    """
    Grundy for game where you can take 1 to k objects.
    Pattern: G(n) = n % (k + 1)
    """
    return n % (k + 1)


# Memoized Grundy computation
@lru_cache(maxsize=None)
def grundy_wythoff(n: int, m: int) -> int:
    """
    Grundy for Wythoff's Nim (take from one pile or same amount from both).
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
    
    # Take same from both
    for k in range(1, min(n, m) + 1):
        reachable.add(grundy_wythoff(n - k, m - k))
    
    return mex(reachable)


# Composite games

def composite_game_winner(grundy_values: list[int]) -> bool:
    """
    Determine winner of composite game.
    True = first player wins, False = second player wins.
    """
    total = 0
    for g in grundy_values:
        total ^= g
    return total != 0


# Misère Nim (last player to move loses)
def can_win_misere_nim(piles: list[int]) -> bool:
    """
    Determine winner for Misère Nim.
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


# Example usage
if __name__ == "__main__":
    # Standard Nim
    piles = [3, 4, 5]
    print(f"Nim sum of {piles}: {nim_sum(piles)}")
    print(f"First player can win: {can_win_nim(piles)}")
    
    move = find_winning_move(piles)
    if move:
        print(f"Winning move: remove {move[1]} from pile {move[0]}")
    
    # Grundy for take-1-or-2 game
    grundy_1_2 = compute_grundy(10, [1, 2])
    print(f"\nGrundy numbers (take 1 or 2): {grundy_1_2}")
    
    # Take 1 to 3 game
    print(f"\nTake-1-to-3 game:")
    for n in range(8):
        g = take_1_to_k_grundy(n, 3)
        print(f"  G({n}) = {g}")
    
    # Misère Nim
    print(f"\nMisère Nim with [1,1,1]: {can_win_misere_nim([1,1,1])}")
    print(f"Misère Nim with [2,2]: {can_win_misere_nim([2,2])}")
```

<!-- slide -->
```cpp
#include <vector>
#include <set>
#include <algorithm>
using namespace std;

int nimSum(const vector<int>& piles) {
    int result = 0;
    for (int pile : piles) result ^= pile;
    return result;
}

bool canWinNim(const vector<int>& piles) {
    return nimSum(piles) != 0;
}

int mex(const set<int>& values) {
    int m = 0;
    while (values.count(m)) m++;
    return m;
}

vector<int> computeGrundy(int maxN, const vector<int>& moves) {
    vector<int> grundy(maxN + 1, 0);
    
    for (int n = 1; n <= maxN; n++) {
        set<int> reachable;
        for (int move : moves) {
            if (move <= n) reachable.insert(grundy[n - move]);
        }
        grundy[n] = mex(reachable);
    }
    
    return grundy;
}

// Take 1 to k: Grundy = n % (k + 1)
int take1ToKGrundy(int n, int k) {
    return n % (k + 1);
}

// Composite game
bool compositeGameWinner(const vector<int>& grundyValues) {
    int total = 0;
    for (int g : grundyValues) total ^= g;
    return total != 0;
}

// Misère Nim
bool canWinMisereNim(const vector<int>& piles) {
    int countGt1 = 0;
    for (int p : piles) if (p > 1) countGt1++;
    
    if (countGt1 == 0) {
        return piles.size() % 2 == 1;
    } else {
        return nimSum(piles) != 0;
    }
}
```

<!-- slide -->
```java
import java.util.*;

public class GameTheory {
    
    public static int nimSum(List<Integer> piles) {
        int result = 0;
        for (int pile : piles) result ^= pile;
        return result;
    }
    
    public static boolean canWinNim(List<Integer> piles) {
        return nimSum(piles) != 0;
    }
    
    public static int mex(Set<Integer> values) {
        int m = 0;
        while (values.contains(m)) m++;
        return m;
    }
    
    public static int[] computeGrundy(int maxN, int[] moves) {
        int[] grundy = new int[maxN + 1];
        
        for (int n = 1; n <= maxN; n++) {
            Set<Integer> reachable = new HashSet<>();
            for (int move : moves) {
                if (move <= n) reachable.add(grundy[n - move]);
            }
            grundy[n] = mex(reachable);
        }
        
        return grundy;
    }
    
    public static int take1ToKGrundy(int n, int k) {
        return n % (k + 1);
    }
    
    public static boolean compositeGameWinner(int[] grundyValues) {
        int total = 0;
        for (int g : grundyValues) total ^= g;
        return total != 0;
    }
    
    public static boolean canWinMisereNim(List<Integer> piles) {
        int countGt1 = 0;
        for (int p : piles) if (p > 1) countGt1++;
        
        if (countGt1 == 0) {
            return piles.size() % 2 == 1;
        } else {
            return nimSum(piles) != 0;
        }
    }
}
```

<!-- slide -->
```javascript
function nimSum(piles) {
    return piles.reduce((acc, pile) => acc ^ pile, 0);
}

function canWinNim(piles) {
    return nimSum(piles) !== 0;
}

function mex(values) {
    const set = new Set(values);
    let m = 0;
    while (set.has(m)) m++;
    return m;
}

function computeGrundy(maxN, moves) {
    const grundy = new Array(maxN + 1).fill(0);
    
    for (let n = 1; n <= maxN; n++) {
        const reachable = new Set();
        for (const move of moves) {
            if (move <= n) reachable.add(grundy[n - move]);
        }
        grundy[n] = mex(reachable);
    }
    
    return grundy;
}

function take1ToKGrundy(n, k) {
    return n % (k + 1);
}

function compositeGameWinner(grundyValues) {
    const total = grundyValues.reduce((acc, g) => acc ^ g, 0);
    return total !== 0;
}

function canWinMisereNim(piles) {
    const countGt1 = piles.filter(p => p > 1).length;
    
    if (countGt1 === 0) {
        return piles.length % 2 === 1;
    } else {
        return nimSum(piles) !== 0;
    }
}
```
````

---

## Common Grundy Patterns

| Game Description | Grundy Pattern |
|-----------------|----------------|
| Take 1..k | G(n) = n mod (k+1) |
| Take powers of 2 | G(n) = n (binary representation) |
| Take prime numbers | Compute dynamically |
| Take odd numbers | G(n) = n mod 2 |
| Wythoff's Nim | Beatty sequences (φ-based) |

---

## Applications

### 1. Stone Game

```python
def stone_game_winner(piles: list[int]) -> str:
    """
    Standard Nim - determine winner.
    """
    return "First" if can_win_nim(piles) else "Second"
```

### 2. Subset Game

```python
def subset_game(n: int, moves: list[int]) -> bool:
    """
    Determine if first player wins with given moves.
    """
    grundy = [0] * (n + 1)
    
    for i in range(1, n + 1):
        reachable = set()
        for m in moves:
            if m <= i:
                reachable.add(grundy[i - m])
        grundy[i] = mex(reachable)
    
    return grundy[n] != 0
```

---

## Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Nim Sum | O(n) | O(1) |
| Grundy (single) | O(n × |moves|) | O(n) |
| Grundy (memoized) | O(n × |moves|) | O(n) |
| Pattern finding | O(n) | O(n) |

---

## Practice Problems

### Problem 1: Can I Win
**Problem**: [LeetCode 464 - Can I Win](https://leetcode.com/problems/can-i-win/)

**Solution**: Game theory with memoization.

### Problem 2: Cat and Mouse
**Problem**: [LeetCode 1728 - Cat and Mouse II](https://leetcode.com/problems/cat-and-mouse-ii/)

**Solution**: Graph game theory, determine winning positions.

### Problem 3: Stone Game
**Problem**: Various stone game problems.

**Solution**: Apply Sprague-Grundy theorem.

---

## Follow-up Questions

### Q1: How do I find the winning move in Nim?

**Answer**: Find pile i where `pile[i] ^ nim_sum < pile[i]`. Reduce that pile to `pile[i] ^ nim_sum`.

### Q2: What if moves depend on the state?

**Answer**: Use DP with memoization to compute Grundy numbers for each state.

### Q3: Can I apply this to partisan games?

**Answer**: No, Sprague-Grundy only applies to impartial games. Partisan games require different analysis.

---

## Summary

Game theory for impartial games:

- **Nim**: XOR of pile sizes determines winner
- **Grundy numbers**: mex of reachable positions
- **Sprague-Grundy**: XOR of component games
- **Misère Nim**: Special case when all piles are 1

**Key Formula**: `G(position) = mex({G(next) for all valid moves})`

---

## Related Algorithms

- [Dynamic Programming](./dynamic-programming.md) - For state memoization
- [Bit Manipulation](./bit-manipulation.md) - XOR operations in Nim
- [Graph Theory](./graph-theory.md) - For graph-based games