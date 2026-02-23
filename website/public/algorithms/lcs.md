# Longest Common Subsequence

## Category
Dynamic Programming

## Description
The Longest Common Subsequence (LCS) is a classic dynamic programming problem that finds the longest subsequence common to two strings. A subsequence is a sequence that appears in the same relative order but not necessarily contiguous.

The DP approach builds a 2D table where `dp[i][j]` represents the LCS length of the first `i` characters of string1 and first `j` characters of string2:
- If characters match: `dp[i][j] = dp[i-1][j-1] + 1`
- If they don't match: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

This can be optimized to O(min(m,n)) space by only keeping track of the previous row.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- dynamic programming related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Implementation

```python
def longest_common_subsequence(text1: str, text2: str) -> tuple:
    """
    Find the longest common subsequence between two strings.
    
    Args:
        text1: First string
        text2: Second string
        
    Returns:
        Tuple of (lcs_length, lcs_string)
        
    Time: O(m * n)
    Space: O(m * n)
    """
    m, n = len(text1), len(text2)
    
    # Create DP table
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Fill the DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    # Backtrack to find the actual LCS string
    lcs = []
    i, j = m, n
    while i > 0 and j > 0:
        if text1[i - 1] == text2[j - 1]:
            lcs.append(text1[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    
    return dp[m][n], ''.join(reversed(lcs))


def lcs_length(text1: str, text2: str) -> int:
    """
    Space-optimized version that returns only LCS length.
    
    Args:
        text1: First string
        text2: Second string
        
    Returns:
        Length of longest common subsequence
        
    Time: O(m * n)
    Space: O(min(m, n))
    """
    # Ensure we use the shorter string for columns
    if len(text1) < len(text2):
        text1, text2 = text2, text1
    
    m, n = len(text1), len(text2)
    
    # Only keep two rows (previous and current)
    prev = [0] * (n + 1)
    curr = [0] * (n + 1)
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                curr[j] = prev[j - 1] + 1
            else:
                curr[j] = max(prev[j], curr[j - 1])
        prev, curr = curr, prev
    
    return prev[n]


# Example usage
if __name__ == "__main__":
    # Test case 1
    text1 = "abcde"
    text2 = "ace"
    length, lcs_str = longest_common_subsequence(text1, text2)
    print(f"text1: '{text1}', text2: '{text2}'")
    print(f"LCS Length: {length}, LCS String: '{lcs_str}'")  # Output: 3, 'ace'
    
    # Test case 2
    text1 = "abc"
    text2 = "def"
    length, lcs_str = longest_common_subsequence(text1, text2)
    print(f"\ntext1: '{text1}', text2: '{text2}'")
    print(f"LCS Length: {length}, LCS String: '{lcs_str}'")  # Output: 0, ''
    
    # Test case 3
    text1 = "agcat"
    text2 = "gac"
    length, lcs_str = longest_common_subsequence(text1, text2)
    print(f"\ntext1: '{text1}', text2: '{text2}'")
    print(f"LCS Length: {length}, LCS String: '{lcs_str}'")  # Output: 2, 'ga'
    
    # Test case 4 - Long sequences
    text1 = "ABCDGH"
    text2 = "AEDFHR"
    length, lcs_str = longest_common_subsequence(text1, text2)
    print(f"\ntext1: '{text1}', text2: '{text2}'")
    print(f"LCS Length: {length}, LCS String: '{lcs_str}'")  # Output: 3, 'ADH'
```

```javascript
function lcs() {
    // Longest Common Subsequence implementation
    // Time: O(m * n)
    // Space: O(m * n)
}
```

---

## Example

**Input:**
```
text1 = "abcde"
text2 = "ace"
```

**Output:**
```
LCS Length: 3
LCS String: "ace"
```

**Input:**
```
text1 = "AGCAT"
text2 = "GAC"
```

**Output:**
```
LCS Length: 2
LCS String: "GA"
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
