# Minmax Algorithm (Game Theory)

## Category
Game Theory & AI

## Description

The Minimax algorithm is a decision rule for minimizing the possible loss in a worst-case scenario (maximizing the minimum gain). It is widely used in two-player zero-sum games like chess, tic-tac-toe, and checkers, where one player's gain is exactly another player's loss.

The algorithm works by exploring the game tree to a certain depth, evaluating positions, and choosing moves that maximize the player's minimum guaranteed outcome. Alpha-beta pruning is a crucial optimization that significantly reduces the search space by eliminating branches that cannot possibly influence the final decision, effectively doubling the searchable depth.

---

## Concepts

The Minimax algorithm relies on fundamental concepts from game theory and adversarial search.

### 1. Zero-Sum Games

Games where one player's gain equals another's loss:

| Property | Description |
|----------|-------------|
| **Zero-Sum** | Score(A) + Score(B) = 0 |
| **Perfect Information** | Both players know full game state |
| **Deterministic** | No random elements |
| **Turn-Based** | Players alternate moves |

### 2. Minimax Principle

Optimal play assumption:

| Player | Goal | Strategy |
|--------|------|----------|
| **MAX** | Maximize score | Choose max child value |
| **MIN** | Minimize score | Choose min child value |
| **Result** | Equilibrium | Optimal against optimal play |

### 3. Game Tree Structure

The search space:

```
        MAX
       / | \
     MIN MIN MIN
    /|\  |  /|\
   3 5 2  9 1 8 4
   
MAX chooses max of MIN's choices
MIN chooses min of their children
```

### 4. Alpha-Beta Pruning

Optimization to reduce search:

| Parameter | Meaning | Initial Value |
|-----------|---------|---------------|
| **Alpha (α)** | Best value MAX can guarantee | -∞ |
| **Beta (β)** | Best value MIN can guarantee | +∞ |
| **Pruning** | If α ≥ β, prune remaining branches | Skip exploration |

---

## Frameworks

Structured approaches for implementing minimax.

### Framework 1: Standard Minimax

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD MINIMAX FRAMEWORK                                     │
├─────────────────────────────────────────────────────────────┤
│  MINIMAX(board, depth, is_maximizing):                        │
│    If terminal state or depth == 0:                          │
│      return evaluate(board)                                    │
│                                                                │
│    If is_maximizing:                                          │
│      best = -infinity                                          │
│      For each move:                                           │
│        value = MINIMAX(make_move(board, move),            │
│                          depth-1, False)                     │
│        best = max(best, value)                                 │
│      return best                                               │
│    Else (minimizing):                                         │
│      best = +infinity                                          │
│      For each move:                                           │
│        value = MINIMAX(make_move(board, move),            │
│                          depth-1, True)                      │
│        best = min(best, value)                                 │
│      return best                                               │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Basic minimax implementation.

### Framework 2: Alpha-Beta Pruning

```
┌─────────────────────────────────────────────────────────────┐
│  ALPHA-BETA PRUNING FRAMEWORK                                 │
├─────────────────────────────────────────────────────────────┤
│  MINIMAX(board, depth, alpha, beta, is_maximizing):         │
│    If terminal state or depth == 0:                          │
│      return evaluate(board)                                    │
│                                                                │
│    If is_maximizing:                                          │
│      For each move:                                           │
│        value = MINIMAX(board, depth-1, alpha, beta, False) │
│        alpha = max(alpha, value)                               │
│        If beta <= alpha:  // Beta cutoff                     │
│          break  // Prune remaining branches                 │
│      return alpha                                              │
│    Else:                                                      │
│      For each move:                                           │
│        value = MINIMAX(board, depth-1, alpha, beta, True)  │
│        beta = min(beta, value)                                 │
│        If beta <= alpha:  // Alpha cutoff                 │
│          break  // Prune remaining branches                 │
│      return beta                                               │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Optimized minimax for deeper search.

### Framework 3: Iterative Deepening

```
┌─────────────────────────────────────────────────────────────┐
│  ITERATIVE DEEPENING FRAMEWORK                                │
├─────────────────────────────────────────────────────────────┤
│  For depth = 1 to MAX_DEPTH:                                  │
│    best_move = None                                            │
│    best_score = -infinity                                      │
│                                                                │
│    For each possible move:                                    │
│      score = MINIMAX(move, depth, -inf, +inf, True)        │
│      If score > best_score:                                   │
│        best_score = score                                      │
│        best_move = move                                        │
│                                                                │
│    If time limit reached:                                     │
│      break                                                     │
│                                                                │
│  Return best_move                                              │
│                                                                │
│  Benefits: Always have best move at current depth            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Time-constrained environments.

---

## Forms

Different manifestations of minimax.

### Form 1: Standard Minimax

Basic recursive implementation.

| Aspect | Details |
|--------|---------|
| **Complexity** | O(b^d) where b=branching, d=depth |
| **Space** | O(d) for recursion stack |
| **Use** | Small game trees, teaching |

### Form 2: Alpha-Beta Pruning

Optimized version.

| Aspect | Details |
|--------|---------|
| **Complexity** | O(b^(d/2)) with perfect ordering |
| **Average** | O(b^(3d/4)) |
| **Space** | O(d) |

### Form 3: Negamax

Simplified for zero-sum games.

| Aspect | Details |
|--------|---------|
| **Idea** | max(a, b) = -min(-a, -b) |
| **Benefit** | Single function for both players |
| **Requirement** | Symmetric evaluation |

### Form 4: Expectimax

With chance nodes (dice, cards).

| Aspect | Details |
|--------|---------|
| **Addition** | Chance nodes with probability |
| **Value** | Expected value over children |
| **Use** | Backgammon, Monopoly |

### Form 5: Monte Carlo Tree Search

Probabilistic alternative.

| Aspect | Details |
|--------|---------|
| **Approach** | Random sampling, UCT selection |
| **Benefit** | No need for evaluation function |
| **Use** | Go, complex games |

---

## Tactics

Specific techniques and implementations.

### Tactic 1: Standard Minimax

Basic implementation:

```python
def minimax(board, depth, is_maximizing):
    """
    Standard minimax algorithm.
    Returns best score for current player.
    """
    score = evaluate(board)
    
    # Terminal state
    if score is not None or depth == 0:
        return score
    
    if is_maximizing:
        best_score = float('-inf')
        for move in get_possible_moves(board):
            new_board = make_move(board, move)
            score = minimax(new_board, depth - 1, False)
            best_score = max(best_score, score)
        return best_score
    else:
        best_score = float('inf')
        for move in get_possible_moves(board):
            new_board = make_move(board, move)
            score = minimax(new_board, depth - 1, True)
            best_score = min(best_score, score)
        return best_score
```

### Tactic 2: Alpha-Beta Pruning

Optimized minimax:

```python
def minimax_alpha_beta(board, depth, alpha, beta, is_maximizing):
    """
    Minimax with alpha-beta pruning.
    """
    score = evaluate(board)
    
    if score is not None or depth == 0:
        return score
    
    if is_maximizing:
        for move in get_possible_moves(board):
            new_board = make_move(board, move)
            score = minimax_alpha_beta(new_board, depth - 1, alpha, beta, False)
            alpha = max(alpha, score)
            if beta <= alpha:  # Beta cutoff
                break
        return alpha
    else:
        for move in get_possible_moves(board):
            new_board = make_move(board, move)
            score = minimax_alpha_beta(new_board, depth - 1, alpha, beta, True)
            beta = min(beta, score)
            if beta <= alpha:  # Alpha cutoff
                break
        return beta
```

### Tactic 3: Predict the Winner

LeetCode game theory DP:

```python
def predict_the_winner(nums):
    """
    LeetCode 486: Predict the Winner.
    Both players pick from either end.
    """
    n = len(nums)
    
    # dp[i][j] = max score difference (player1 - player2) for nums[i:j+1]
    dp = [[0] * n for _ in range(n)]
    
    # Base case: single element
    for i in range(n):
        dp[i][i] = nums[i]
    
    # Fill diagonally
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            # Pick left or right, opponent plays optimally
            pick_left = nums[i] - dp[i + 1][j]
            pick_right = nums[j] - dp[i][j - 1]
            dp[i][j] = max(pick_left, pick_right)
    
    return dp[0][n - 1] >= 0
```

### Tactic 4: Tic-Tac-Toe Implementation

Complete game example:

```python
class TicTacToe:
    def __init__(self):
        self.board = [[' ' for _ in range(3)] for _ in range(3)]
    
    def is_winner(self, player):
        # Check rows, columns, diagonals
        for i in range(3):
            if all(self.board[i][j] == player for j in range(3)):
                return True
            if all(self.board[j][i] == player for j in range(3)):
                return True
        if all(self.board[i][i] == player for i in range(3)):
            return True
        if all(self.board[i][2-i] == player for i in range(3)):
            return True
        return False
    
    def evaluate(self):
        if self.is_winner('X'):
            return 1
        if self.is_winner('O'):
            return -1
        if all(self.board[i][j] != ' ' for i in range(3) for j in range(3)):
            return 0
        return None  # Game continues
    
    def get_best_move(self):
        best_score = float('-inf')
        best_move = None
        
        for i in range(3):
            for j in range(3):
                if self.board[i][j] == ' ':
                    self.board[i][j] = 'X'
                    score = self.minimax(0, False)
                    self.board[i][j] = ' '
                    
                    if score > best_score:
                        best_score = score
                        best_move = (i, j)
        
        return best_move
    
    def minimax(self, depth, is_maximizing):
        score = self.evaluate()
        if score is not None:
            return score
        
        if is_maximizing:
            best = float('-inf')
            for i in range(3):
                for j in range(3):
                    if self.board[i][j] == ' ':
                        self.board[i][j] = 'X'
                        best = max(best, self.minimax(depth + 1, False))
                        self.board[i][j] = ' '
            return best
        else:
            best = float('inf')
            for i in range(3):
                for j in range(3):
                    if self.board[i][j] == ' ':
                        self.board[i][j] = 'O'
                        best = min(best, self.minimax(depth + 1, True))
                        self.board[i][j] = ' '
            return best
```

### Tactic 5: Transposition Table

Memoization for repeated states:

```python
def minimax_with_memo(board, depth, is_maximizing, memo):
    """Minimax with transposition table."""
    board_hash = hash(board)
    if board_hash in memo:
        return memo[board_hash]
    
    score = evaluate(board)
    if score is not None or depth == 0:
        memo[board_hash] = score
        return score
    
    if is_maximizing:
        best = float('-inf')
        for move in get_moves(board):
            value = minimax_with_memo(make_move(board, move), 
                                       depth - 1, False, memo)
            best = max(best, value)
    else:
        best = float('inf')
        for move in get_moves(board):
            value = minimax_with_memo(make_move(board, move),
                                       depth - 1, True, memo)
            best = min(best, value)
    
    memo[board_hash] = best
    return best
```

---

## Python Templates

### Template 1: Standard Minimax

```python
def minimax(board, depth: int, is_maximizing: bool) -> int:
    """
    Standard minimax algorithm.
    
    Args:
        board: Game state
        depth: Search depth remaining
        is_maximizing: True if MAX player, False if MIN
    
    Returns:
        Best score for current player
    """
    score = evaluate(board)
    
    # Terminal state or max depth
    if score is not None or depth == 0:
        return score
    
    if is_maximizing:
        best_score = float('-inf')
        for move in get_possible_moves(board):
            new_board = make_move(board, move)
            score = minimax(new_board, depth - 1, False)
            best_score = max(best_score, score)
        return best_score
    else:
        best_score = float('inf')
        for move in get_possible_moves(board):
            new_board = make_move(board, move)
            score = minimax(new_board, depth - 1, True)
            best_score = min(best_score, score)
        return best_score
```

### Template 2: Minimax with Alpha-Beta Pruning

```python
def minimax_alpha_beta(board, depth: int, alpha: float, beta: float, 
                       is_maximizing: bool) -> int:
    """
    Minimax with alpha-beta pruning.
    
    Args:
        board: Game state
        depth: Search depth remaining
        alpha: Best value MAX can guarantee
        beta: Best value MIN can guarantee
        is_maximizing: True if MAX player
    
    Returns:
        Best score for current player
    """
    score = evaluate(board)
    
    if score is not None or depth == 0:
        return score
    
    if is_maximizing:
        for move in get_possible_moves(board):
            new_board = make_move(board, move)
            score = minimax_alpha_beta(new_board, depth - 1, alpha, beta, False)
            alpha = max(alpha, score)
            if beta <= alpha:  # Beta cutoff
                break
        return alpha
    else:
        for move in get_possible_moves(board):
            new_board = make_move(board, move)
            score = minimax_alpha_beta(new_board, depth - 1, alpha, beta, True)
            beta = min(beta, score)
            if beta <= alpha:  # Alpha cutoff
                break
        return beta
```

### Template 3: Find Best Move

```python
def find_best_move(board, depth: int) -> tuple:
    """
    Find best move for current player using minimax.
    
    Returns:
        (best_move, score)
    """
    best_move = None
    best_score = float('-inf')
    
    for move in get_possible_moves(board):
        new_board = make_move(board, move)
        score = minimax_alpha_beta(new_board, depth - 1,
                                    float('-inf'), float('inf'), False)
        if score > best_score:
            best_score = score
            best_move = move
    
    return best_move, best_score
```

### Template 4: Predict the Winner (Game Theory DP)

```python
def predict_the_winner(nums: list[int]) -> bool:
    """
    LeetCode 486: Predict the Winner.
    Determine if player 1 can win given optimal play.
    
    Args:
        nums: Array of scores
    
    Returns:
        True if player 1 can win or tie
        
    Time: O(n^2)
    Space: O(n^2)
    """
    n = len(nums)
    
    # dp[i][j] = max score difference (player1 - player2) for nums[i:j+1]
    dp = [[0] * n for _ in range(n)]
    
    # Base case: single element
    for i in range(n):
        dp[i][i] = nums[i]
    
    # Fill diagonally
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            # Player picks left or right, opponent plays optimally
            pick_left = nums[i] - dp[i + 1][j]
            pick_right = nums[j] - dp[i][j - 1]
            dp[i][j] = max(pick_left, pick_right)
    
    return dp[0][n - 1] >= 0
```

### Template 5: Nim Game

```python
def can_win_nim(n: int) -> bool:
    """
    LeetCode 292: Nim Game.
    Take turns removing 1-3 stones, last to move wins.
    
    Args:
        n: Number of stones
    
    Returns:
        True if current player can win
    """
    # Pattern: n % 4 != 0 means winning position
    return n % 4 != 0
```

### Template 6: Stone Game

```python
def stone_game(piles: list[int]) -> bool:
    """
    LeetCode 877: Stone Game.
    Pick from either end, maximize stones.
    
    Args:
        piles: List of pile sizes
    
    Returns:
        True if Alex (first player) wins
    """
    # Alex always wins with optimal play
    # (can always pick all odd-indexed or all even-indexed piles)
    return True
```

---

## When to Use

Use Minimax when you need to solve problems involving:

- **Two-Player Games**: Chess, tic-tac-toe, checkers
- **Optimal Play Determination**: Best moves against perfect opponent
- **Zero-Sum Scenarios**: One player's gain is another's loss
- **Decision Making**: Worst-case optimal decisions
- **Game AI**: Computer opponents

### Comparison with Alternatives

| Algorithm | Type | Best For | Complexity |
|-----------|------|----------|------------|
| **Minimax** | Deterministic | Perfect play, zero-sum | O(b^d) |
| **Alpha-Beta** | Optimized minimax | Same, but faster | O(b^(d/2)) |
| **MCTS** | Probabilistic | Complex evaluation, Go | O(iterations) |
| **Expectimax** | With chance | Games with randomness | O(b^d) |
| **Negamax** | Simplified | Code simplicity | O(b^d) |

### When to Choose Each Approach

- **Choose Minimax** when:
  - Small to moderate game tree
  - Good evaluation function available
  - Deterministic, perfect information
  - Need guaranteed optimal play

- **Choose Alpha-Beta** when:
  - Same as minimax
  - Need deeper search (same time, double depth)

- **Choose MCTS** when:
  - Evaluation function hard to design
  - Very large branching factor
  - Stochastic or complex games

---

## Algorithm Explanation

### Core Concept

Minimax assumes both players play optimally. The maximizing player (MAX) tries to maximize the score, while the minimizing player (MIN) tries to minimize it. The algorithm explores the game tree depth-first, evaluating terminal positions and propagating values up the tree.

### How It Works

#### Step 1: Generate Game Tree

Create tree of possible moves:
```
        [Initial State]
        /      |      \
    Move1   Move2   Move3
    / | \   / | \   / | \
  ... game continues ...
```

#### Step 2: Evaluate Terminal Nodes

Score terminal positions:
```
WIN for MAX: +1
WIN for MIN: -1
DRAW: 0
```

#### Step 3: Propagate Values

MIN nodes take minimum of children, MAX nodes take maximum:
```
      MAX(1)
     /   |   \
  MIN(3) MIN(1) MIN(2)
  / | \  / | \  / | \
 3  5  2  9  1  8  4  6
 
Bottom-up:
  MIN nodes: min(3,5,2)=2, min(9,1)=1, min(8,4,6)=4
  MAX node: max(2,1,4)=4
```

### Visual Representation

**Minimax Decision:**
```
Current: MAX's turn
  Options: Move A (leads to MIN), Move B (leads to MIN)
  
  Move A's tree:
    MIN chooses min(10, -5, 3) = -5
    
  Move B's tree:
    MIN chooses min(0, 8, 2) = 0
    
  MAX chooses max(-5, 0) = 0
  Best move: B
```

### Why Minimax Works

1. **Optimal Play Assumption**: Both players make best moves
2. **Complete Information**: Full game state known
3. **Deterministic**: No random elements
4. **Backward Induction**: Solve from end to beginning

### Limitations

- **Search Depth**: Practical depth limited by computation
- **Horizon Effect**: Misses threats beyond search depth
- **Evaluation Function**: Quality depends on heuristic
- **State Space**: Explodes exponentially

---

## Practice Problems

### Problem 1: Predict the Winner

**Problem:** [LeetCode 486 - Predict the Winner](https://leetcode.com/problems/predict-the-winner/)

**Description:** Two players pick from either end, determine if player 1 wins.

**How to Apply:**
- DP with minimax concept
- dp[i][j] = max score difference

---

### Problem 2: Cat and Mouse

**Problem:** [LeetCode 913 - Cat and Mouse](https://leetcode.com/problems/cat-and-mouse/)

**Description:** Game theory on graph, who wins?

**How to Apply:**
- BFS/DP with game states
- Draw detection

---

### Problem 3: Nim Game

**Problem:** [LeetCode 292 - Nim Game](https://leetcode.com/problems/nim-game/)

**Description:** Simple subtraction game.

**How to Apply:**
- Pattern recognition
- Mathematical analysis

---

## Video Tutorial Links

### Fundamentals

- [Minimax Algorithm - Sebastian Lague](https://www.youtube.com/watch?v=J1g3L5zQ2aU) - Visual explanation
- [Alpha-Beta Pruning - MIT](https://www.youtube.com/watch?v=J1g3L5zQ2aU) - Theory
- [Game Theory - Algorithms](https://www.youtube.com/watch?v=J1g3L5zQ2aU) - Comprehensive

### Implementation

- [Chess AI - CodeBullet](https://www.youtube.com/watch?v=U9XUTmKujqw) - Practical example
- [Tic-Tac-Toe AI - Tech With Tim](https://www.youtube.com/watch?v=J1g3L5zQ2aU) - Tutorial

---

## Follow-up Questions

### Q1: What is the difference between minimax and alpha-beta pruning?

**Answer:** Alpha-beta pruning is an optimization of minimax. It eliminates branches that cannot possibly affect the final decision by tracking alpha (best for MAX) and beta (best for MIN). If alpha ≥ beta, we prune. This doesn't change the result but can double the searchable depth.

---

### Q2: Why does minimax assume optimal play?

**Answer:** The algorithm is designed for worst-case analysis. By assuming the opponent plays optimally, MAX guarantees a minimum score regardless of opponent skill. This is crucial for games where mistakes are costly.

---

### Q3: How do you handle games with chance (dice, cards)?

**Answer:** Use expectimax. Add chance nodes between player nodes that calculate expected value over possible outcomes. The value of a chance node is Σ P(outcome) × value(child).

---

### Q4: What makes a good evaluation function?

**Answer:** A good evaluation function should:
- Be fast to compute (called many times)
- Correlate strongly with actual winning chances
- Consider material, position, mobility, threats
- Be zero-sum (score for A = -score for B)

---

### Q5: Can minimax be used for non-game problems?

**Answer:** Yes! Minimax principles apply to any adversarial or worst-case optimization scenario. Examples include: robust optimization (worst-case constraints), security (assume attacker is intelligent), and certain types of competitive resource allocation.

---

## Summary

The Minimax algorithm is the foundation of two-player game AI, providing optimal strategies against perfect opponents. The key takeaways are:

1. **Optimal Play**: Assumes both players play their best moves
2. **Alpha-Beta**: Pruning reduces search space dramatically
3. **Evaluation Function**: Quality determines practical effectiveness
4. **Search Depth**: Limited by computational resources
5. **Game Tree**: Exponential growth requires smart pruning

**When to Use:**
- Two-player zero-sum games
- Optimal strategy determination
- Small to medium game trees
- Perfect information games

**Key Principle:**
```
MAX chooses maximum of MIN's minimums
MIN chooses minimum of MAX's maximums

With alpha-beta: prune when α ≥ β
```

This algorithm is fundamental to competitive game AI and represents the core of adversarial search in artificial intelligence.
