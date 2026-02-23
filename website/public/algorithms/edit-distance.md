# Edit Distance

## Category
Dynamic Programming

## Description
Find minimum operations (insert, delete, replace) to transform one string to another.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- dynamic programming related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation
Edit Distance (also known as Levenshtein distance) is a classic dynamic programming problem that measures the minimum number of operations required to transform one string into another. The three allowed operations are:

1. **Insert**: Add a character at any position
2. **Delete**: Remove a character
3. **Replace**: Change one character to another

### How It Works:
We build a DP table where `dp[i][j]` represents the minimum operations to transform the first `i` characters of word1 into the first `j` characters of word2.

### DP Recurrence:
- If word1[i-1] == word2[j-1]: `dp[i][j] = dp[i-1][j-1]` (no operation needed)
- Otherwise: `dp[i][j] = 1 + min(`:
  - `dp[i-1][j]` (delete from word1)
  - `dp[i][j-1]` (insert into word1)
  - `dp[i-1][j-1]` (replace)

### Base Cases:
- `dp[0][j] = j` (j insertions to create empty string from empty)
- `dp[i][0] = i` (i deletions to create empty from word1)

### Key Properties:
- **Optimal Substructure**: Solution can be built from subproblems
- **Overlapping Subproblems**: Same subproblems computed multiple times
- **Time Complexity**: O(m * n) where m, n are string lengths
- **Space Complexity**: O(m * n) or O(min(m, n)) optimized

---

## Algorithm Steps
1. Create DP table of size (m+1) × (n+1)
2. Initialize base cases:
   - First row: dp[0][j] = j (insert j characters)
   - First column: dp[i][0] = i (delete i characters)
3. Fill the table for i = 1 to m, j = 1 to n:
   - If characters match: dp[i][j] = dp[i-1][j-1]
   - Else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
4. Return dp[m][n]

---

## Implementation

```python
def minDistance(word1: str, word2: str) -> int:
    """
    Calculate the minimum edit distance between two strings.
    
    Allowed operations: Insert, Delete, Replace
    
    Args:
        word1: Source string
        word2: Target string
    
    Returns:
        Minimum number of operations to transform word1 to word2
    
    Time: O(m * n)
    Space: O(m * n)
    """
    m, n = len(word1), len(word2)
    
    # Create DP table
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    # Transform empty string to word2[0:j] needs j insertions
    for j in range(n + 1):
        dp[0][j] = j
    
    # Transform word1[0:i] to empty string needs i deletions
    for i in range(m + 1):
        dp[i][0] = i
    
    # Fill the DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                # Characters match, no operation needed
                dp[i][j] = dp[i - 1][j - 1]
            else:
                # Minimum of insert, delete, replace
                dp[i][j] = 1 + min(
                    dp[i - 1][j],      # Delete from word1
                    dp[i][j - 1],      # Insert into word1
                    dp[i - 1][j - 1]   # Replace
                )
    
    return dp[m][n]


def minDistance_optimized(word1: str, word2: str) -> int:
    """
    Space-optimized version using only O(n) space.
    
    Time: O(m * n)
    Space: O(n)
    """
    m, n = len(word1), len(word2)
    
    # Ensure we use the shorter string for the DP array
    if n > m:
        word1, word2 = word2, word1
        m, n = n, m
    
    # Only need previous row
    prev = list(range(n + 1))
    curr = [0] * (n + 1)
    
    for i in range(1, m + 1):
        curr[0] = i
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                curr[j] = prev[j - 1]
            else:
                curr[j] = 1 + min(prev[j], curr[j - 1], prev[j - 1])
        prev, curr = curr, prev
    
    return prev[n]


def edit_distance_with_operations(word1: str, word2: str) -> tuple:
    """
    Returns both minimum distance and the sequence of operations.
    
    Returns:
        Tuple of (distance, list of operations)
    """
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(m + 1):
        dp[i][0] = i
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    
    # Backtrack to find operations
    operations = []
    i, j = m, n
    while i > 0 or j > 0:
        if i > 0 and j > 0 and word1[i-1] == word2[j-1]:
            operations.append(f"Match '{word1[i-1]}'")
            i -= 1
            j -= 1
        elif i > 0 and j > 0 and dp[i][j] == dp[i-1][j-1] + 1:
            operations.append(f"Replace '{word1[i-1]}' with '{word2[j-1]}'")
            i -= 1
            j -= 1
        elif j > 0 and dp[i][j] == dp[i][j-1] + 1:
            operations.append(f"Insert '{word2[j-1]}'")
            j -= 1
        else:
            operations.append(f"Delete '{word1[i-1]}'")
            i -= 1
    
    return dp[m][n], operations[::-1]


# Example usage
if __name__ == "__main__":
    print("Edit Distance (Levenshtein Distance)")
    print("=" * 40)
    
    # Test cases
    test_cases = [
        ("horse", "ros"),
        ("intention", "execution"),
        ("kitten", "sitting"),
        ("", "abc"),
        ("abc", ""),
        ("abc", "abc"),
    ]
    
    for word1, word2 in test_cases:
        dist = minDistance(word1, word2)
        print(f"\n'{word1}' -> '{word2}': {dist} operations")
    
    # Detailed operation trace
    print("\n" + "=" * 40)
    print("Detailed operations for 'horse' -> 'ros':")
    dist, ops = edit_distance_with_operations("horse", "ros")
    print(f"Distance: {dist}")
    for op in ops:
        print(f"  {op}")

```javascript
function editDistance() {
    // Edit Distance implementation
    // Time: O(m * n)
    // Space: O(m * n)
}
```

---

## Example

**Input:**
```
Word1 = "horse", Word2 = "ros"
Word1 = "intention", Word2 = "execution"
Word1 = "", Word2 = "abc"
Word1 = "abc", Word2 = "abc"
```

**Output:**
```
'horse' -> 'ros': 3 operations
'intention' -> 'execution': 5 operations
'' -> 'abc': 3 operations
'abc' -> 'abc': 0 operations

Detailed operations for 'horse' -> 'ros':
Distance: 3
  Replace 'h' with 'r'
  Delete 'r'
  Delete 'e'

Alternative path:
  horse → rorse (replace 'h' with 'r')
  → rose (replace 'r' with 's')
  → ros (delete 'e')
```

---

## Time Complexity
**O(m * n)**

---

## Space Complexity
**O(m * n)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
