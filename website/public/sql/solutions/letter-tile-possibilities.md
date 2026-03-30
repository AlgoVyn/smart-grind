# 1079. Letter Tile Possibilities

## Problem

You have `n` tiles, where each tile has one letter `tiles[i]` printed on it. Return the number of possible non-empty sequences of letters you can make using the letters printed on those tiles.

### Schema

**Note:** This is primarily a combinatorics/mathematical problem rather than a traditional SQL problem. The solution involves calculating permutations with repeated elements.

### Requirements

- Return: The count of distinct non-empty sequences that can be formed
- Each tile can be used at most once in a sequence
- Sequences of different lengths count separately
- Duplicate tiles create duplicate sequences (but we count unique sequences)

**Example 1:**
- Input: tiles = "AAB"
- Possible sequences: "A", "B", "AA", "AB", "BA", "AAB", "ABA", "BAA"
- Result: 8

**Example 2:**
- Input: tiles = "AAABBC"
- Result: 188

**Example 3:**
- Input: tiles = "V"
- Result: 1

## Approaches

### Approach 1: Recursive Generation with Backtracking (Conceptual)

Use recursion to generate all possible sequences by trying each available tile at each position.

#### Algorithm

1. Count frequency of each character in tiles
2. For each character with remaining count > 0:
   - Use one occurrence and recursively count sequences
   - Add 1 for the current single character sequence
   - Restore count (backtrack)
3. Sum all valid sequences

#### Implementation (Python/Pseudocode)

```python
def numTilePossibilities(tiles: str) -> int:
    from collections import Counter
    count = Counter(tiles)
    
    def backtrack():
        total = 0
        for char in count:
            if count[char] > 0:
                count[char] -= 1
                total += 1 + backtrack()  # 1 for current char + sequences after it
                count[char] += 1
        return total
    
    return backtrack()
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n!) - in worst case, all permutations of all lengths |
| Space | O(n) - recursion depth and frequency array |

### Approach 2: Factorial/Combinatorial Mathematics

Use mathematical formulas to calculate permutations with repeated elements for each possible length.

#### Algorithm

1. Count frequency of each character (e.g., A:2, B:1)
2. For each possible sequence length from 1 to n:
   - Calculate permutations using multiset permutation formula
   - Sum results for all lengths

#### Formula

For a sequence of length k with character frequencies (f₁, f₂, ..., fₘ):

```
P(k) = Σ [k! / (f₁! × f₂! × ... × fₘ!)]
```

Where the sum is over all combinations where Σfᵢ = k and fᵢ ≤ original_count[charᵢ]

#### Implementation (Dynamic Programming)

```python
def numTilePossibilities(tiles: str) -> int:
    from collections import Counter
    from math import factorial
    
    freq = list(Counter(tiles).values())
    n = len(tiles)
    
    # dp[i][j] = number of sequences of length j using first i character types
    # This approach uses dynamic programming to count efficiently
    
    # Simpler: generate all using recursion with memoization
    def count(freq_list):
        total = 0
        for i in range(len(freq_list)):
            if freq_list[i] > 0:
                freq_list[i] -= 1
                total += 1 + count(freq_list)
                freq_list[i] += 1
        return total
    
    return count(freq)
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × 2ⁿ) - exponential due to exploring all subsets |
| Space | O(n) - for frequency tracking and recursion |

### Approach 3: Iterative Set Generation

Build sequences iteratively by adding one character at a time to existing sequences.

#### Algorithm

1. Start with empty set
2. For each tile:
   - Add it to all existing sequences (front and back, avoiding duplicates)
   - Add the tile itself as a new single-character sequence
3. Use a set to track unique sequences

#### Implementation

```python
def numTilePossibilities(tiles: str) -> int:
    sequences = set()
    sequences.add("")  # Start with empty
    
    for tile in tiles:
        new_sequences = set()
        for seq in sequences:
            # Insert tile at all possible positions
            for i in range(len(seq) + 1):
                new_seq = seq[:i] + tile + seq[i:]
                new_sequences.add(new_seq)
        sequences |= new_sequences
    
    return len(sequences) - 1  # Subtract empty string
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × n!) - generating and storing all permutations |
| Space | O(n!) - storing all unique sequences |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Recursive Backtracking | O(n!) | O(n) | Clean, efficient pruning | Still exponential |
| Mathematical | O(n × 2ⁿ) | O(n) | No sequence storage needed | Complex to implement |
| Iterative Set | O(n × n!) | O(n!) | Intuitive, easy to understand | High space usage |

**Recommended:** Approach 1 (Recursive Backtracking) - most balanced for interview settings, good combination of clarity and efficiency.

## Final Solution

### Python Implementation (Recommended)

```python
from collections import Counter

def numTilePossibilities(tiles: str) -> int:
    """
    Count the number of possible non-empty sequences from given tiles.
    Uses backtracking with frequency counting for efficiency.
    """
    count = Counter(tiles)
    chars = list(count.keys())
    
    def backtrack():
        total = 0
        for char in chars:
            if count[char] > 0:
                # Use this character
                count[char] -= 1
                # Count: 1 for this char alone + all sequences extending it
                total += 1 + backtrack()
                # Backtrack: restore the count
                count[char] += 1
        return total
    
    return backtrack()
```

### Key Concepts

- **Backtracking**: Try each available option, recurse, then undo (backtrack) to try next option
- **Frequency Count**: Using Counter to track how many of each character remain available
- **Recursive Counting**: Each recursive call returns 1 (for the character itself) plus the count of all longer sequences that can be formed by appending to it
- **Pruning by Availability**: Only recurse on characters that still have remaining count > 0

### Notes

- This is a combinatorics problem that doesn't have a pure SQL solution
- The recursive approach naturally handles duplicate tiles through frequency counting
- Time complexity is bounded by the total number of valid sequences
- For large inputs (n > 20), consider memoization or mathematical approaches
- The problem is equivalent to counting all non-empty permutations of all non-empty subsets
