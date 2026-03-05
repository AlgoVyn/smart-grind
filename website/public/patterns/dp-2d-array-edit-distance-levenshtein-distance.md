# DP - 2D Array Edit Distance

## Problem Description

The **DP - 2D Array (Edit Distance / Levenshtein Distance)** pattern is used to compute the minimum number of operations required to transform one string into another. This pattern is fundamental for string transformation problems and extends to many two-sequence comparison problems.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Input** | Two strings (or sequences) |
| **Output** | Minimum edit distance (or transformation cost) |
| **Key Insight** | dp[i][j] represents the minimum cost for first i chars of s1 and first j chars of s2 |
| **Time Complexity** | O(m × n) where m, n are string lengths |
| **Space Complexity** | O(m × n) optimizable to O(min(m, n)) |

### When to Use

- **String transformation**: Converting one string to another with minimum edits
- **Sequence alignment**: DNA/protein sequence alignment in bioinformatics
- **Spell checking**: Finding closest dictionary words to misspelled input
- **Plagiarism detection**: Measuring similarity between documents
- **Diff algorithms**: Computing differences between files or versions

---

## Intuition

### Core Insight

The key insight behind edit distance is that **we build solutions to subproblems and combine them**:

1. **State definition**: `dp[i][j]` = minimum operations to convert `s1[0..i-1]` to `s2[0..j-1]`
2. **Base cases**: 
   - `dp[i][0] = i` (delete all i characters from s1)
   - `dp[0][j] = j` (insert all j characters from s2)
3. **Recurrence**:
   - If `s1[i-1] == s2[j-1]`: `dp[i][j] = dp[i-1][j-1]` (no operation needed)
   - Else: `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`
     - `dp[i-1][j]` + 1 = delete from s1
     - `dp[i][j-1]` + 1 = insert into s1
     - `dp[i-1][j-1]` + 1 = replace in s1

### The "Aha!" Moments

1. **Why 2D DP?** We're comparing two sequences, so we need to track progress in both. Each cell represents a subproblem comparing prefixes of both strings.

2. **What does dp[i][j] really mean?** It's the minimum cost to transform the first i characters of s1 into the first j characters of s2. This builds up the solution incrementally.

3. **Why three operations?** Delete, Insert, Replace are the fundamental string edit operations. Each moves us one step closer to the target string.

### State Transition Visualization

Computing edit distance between "horse" and "ros":
```
      r  o  s
   0  1  2  3
h  1  1  2  3
o  2  2  1  2
r  3  2  2  2
s  4  3  3  2
e  5  4  4  3
```

Final answer: `dp[5][3] = 3` (replace h→r, remove o, remove e)

---

## Solution Approaches

### Approach 1: Standard 2D DP ⭐

The fundamental approach using a full (m+1) × (n+1) DP table.

#### Algorithm

1. **Create DP table** of size (m+1) × (n+1)
2. **Initialize base cases**:
   - First column: dp[i][0] = i (i deletions needed)
   - First row: dp[0][j] = j (j insertions needed)
3. **Fill the table** row by row:
   - If characters match: `dp[i][j] = dp[i-1][j-1]`
   - Else: `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`
4. **Return dp[m][n]**

#### Implementation

````carousel
```python
def min_distance(word1: str, word2: str) -> int:
    """
    Calculate minimum edit distance between two words.
    
    Args:
        word1: First string
        word2: Second string
        
    Returns:
        Minimum number of operations (insert, delete, replace)
    """
    m, n = len(word1), len(word2)
    
    # dp[i][j] = min operations to convert word1[0..i-1] to word2[0..j-1]
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    for i in range(m + 1):
        dp[i][0] = i  # Delete all characters from word1
    for j in range(n + 1):
        dp[0][j] = j  # Insert all characters from word2
    
    # Fill the DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                # Characters match - no operation needed
                dp[i][j] = dp[i - 1][j - 1]
            else:
                # 1 + min(delete, insert, replace)
                dp[i][j] = 1 + min(
                    dp[i - 1][j],      # Delete from word1
                    dp[i][j - 1],      # Insert into word1
                    dp[i - 1][j - 1]   # Replace in word1
                )
    
    return dp[m][n]


def min_distance_with_operations(word1: str, word2: str):
    """
    Returns edit distance and the sequence of operations.
    """
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    
    # Backtrack to find operations
    operations = []
    i, j = m, n
    while i > 0 or j > 0:
        if i == 0:
            operations.append(f"Insert '{word2[j-1]}' at position {j}")
            j -= 1
        elif j == 0:
            operations.append(f"Delete '{word1[i-1]}' from position {i}")
            i -= 1
        elif word1[i - 1] == word2[j - 1]:
            operations.append(f"Keep '{word1[i-1]}'")
            i -= 1
            j -= 1
        elif dp[i][j] == dp[i - 1][j] + 1:
            operations.append(f"Delete '{word1[i-1]}' from position {i}")
            i -= 1
        elif dp[i][j] == dp[i][j - 1] + 1:
            operations.append(f"Insert '{word2[j-1]}' at position {j}")
            j -= 1
        else:
            operations.append(f"Replace '{word1[i-1]}' with '{word2[j-1]}' at position {i}")
            i -= 1
            j -= 1
    
    return dp[m][n], operations[::-1]
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size();
        int n = word2.size();
        
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        // Base cases
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
        
        // Fill DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i - 1] == word2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + min({
                        dp[i - 1][j],     // Delete
                        dp[i][j - 1],     // Insert
                        dp[i - 1][j - 1]  // Replace
                    });
                }
            }
        }
        
        return dp[m][n];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        
        int[][] dp = new int[m + 1][n + 1];
        
        // Base cases
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
        
        // Fill DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(
                        dp[i - 1][j],     // Delete
                        Math.min(
                            dp[i][j - 1],     // Insert
                            dp[i - 1][j - 1]  // Replace
                        )
                    );
                }
            }
        }
        
        return dp[m][n];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    
    // Create DP table
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Base cases
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }
    
    // Fill DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],     // Delete
                    dp[i][j - 1],     // Insert
                    dp[i - 1][j - 1]  // Replace
                );
            }
        }
    }
    
    return dp[m][n];
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - fill an m×n table |
| **Space** | O(m × n) - for the DP table |

---

### Approach 2: Space Optimized (Two Rows)

Since we only need the previous row to compute the current row, we can use O(min(m, n)) space.

#### Algorithm

1. **Use two arrays**: `prev` and `curr`, each of size n+1
2. **Initialize `prev`** with base cases (0 to n)
3. **Iterate through rows**:
   - Set `curr[0] = i` (current row index)
   - Compute `curr[j]` using `prev[j]`, `curr[j-1]`, `prev[j-1]`
   - Swap `prev` and `curr`
4. **Return `prev[n]`**

#### Implementation

````carousel
```python
def min_distance_optimized(word1: str, word2: str) -> int:
    """
    Space-optimized edit distance using only two rows.
    Time: O(m*n), Space: O(min(m, n))
    """
    # Ensure word1 is the shorter one for space optimization
    if len(word1) > len(word2):
        word1, word2 = word2, word1
    
    m, n = len(word1), len(word2)
    
    # Only need two rows
    prev = list(range(n + 1))  # Previous row
    curr = [0] * (n + 1)       # Current row
    
    for i in range(1, m + 1):
        curr[0] = i  # Base case: delete i characters
        
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                curr[j] = prev[j - 1]
            else:
                curr[j] = 1 + min(prev[j],      # Delete
                                  curr[j - 1],  # Insert
                                  prev[j - 1])  # Replace
        
        # Swap rows
        prev, curr = curr, prev
    
    return prev[n]


def min_distance_1d(word1: str, word2: str) -> int:
    """
    Single array space optimization.
    We update in-place, keeping the diagonal value separately.
    """
    m, n = len(word1), len(word2)
    
    # Ensure word1 is shorter
    if m > n:
        return min_distance_1d(word2, word1)
    
    dp = list(range(n + 1))
    
    for i in range(1, m + 1):
        prev_diag = dp[0]  # dp[i-1][j-1]
        dp[0] = i          # dp[i][0]
        
        for j in range(1, n + 1):
            temp = dp[j]   # Save for next iteration (becomes prev_diag)
            
            if word1[i - 1] == word2[j - 1]:
                dp[j] = prev_diag
            else:
                dp[j] = 1 + min(dp[j],      # dp[i-1][j] (delete)
                               dp[j - 1],   # dp[i][j-1] (insert)
                               prev_diag)   # dp[i-1][j-1] (replace)
            
            prev_diag = temp
    
    return dp[n]
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

class SolutionOptimized {
public:
    int minDistance(string word1, string word2) {
        // Ensure word1 is shorter
        if (word1.size() > word2.size()) {
            swap(word1, word2);
        }
        
        int m = word1.size();
        int n = word2.size();
        
        vector<int> prev(n + 1);
        vector<int> curr(n + 1);
        
        // Initialize
        for (int j = 0; j <= n; j++) {
            prev[j] = j;
        }
        
        for (int i = 1; i <= m; i++) {
            curr[0] = i;
            
            for (int j = 1; j <= n; j++) {
                if (word1[i - 1] == word2[j - 1]) {
                    curr[j] = prev[j - 1];
                } else {
                    curr[j] = 1 + min({
                        prev[j],
                        curr[j - 1],
                        prev[j - 1]
                    });
                }
            }
            
            swap(prev, curr);
        }
        
        return prev[n];
    }
};
```

<!-- slide -->
```java
class SolutionOptimized {
    public int minDistance(String word1, String word2) {
        // Ensure word1 is shorter
        if (word1.length() > word2.length()) {
            String temp = word1;
            word1 = word2;
            word2 = temp;
        }
        
        int m = word1.length();
        int n = word2.length();
        
        int[] prev = new int[n + 1];
        int[] curr = new int[n + 1];
        
        // Initialize
        for (int j = 0; j <= n; j++) {
            prev[j] = j;
        }
        
        for (int i = 1; i <= m; i++) {
            curr[0] = i;
            
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    curr[j] = prev[j - 1];
                } else {
                    curr[j] = 1 + Math.min(
                        prev[j],
                        Math.min(curr[j - 1], prev[j - 1])
                    );
                }
            }
            
            // Swap
            int[] temp = prev;
            prev = curr;
            curr = temp;
        }
        
        return prev[n];
    }
}
```

<!-- slide -->
```javascript
var minDistanceOptimized = function(word1, word2) {
    // Ensure word1 is shorter
    if (word1.length > word2.length) {
        [word1, word2] = [word2, word1];
    }
    
    const m = word1.length;
    const n = word2.length;
    
    let prev = Array(n + 1).fill(0).map((_, i) => i);
    let curr = Array(n + 1).fill(0);
    
    for (let i = 1; i <= m; i++) {
        curr[0] = i;
        
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                curr[j] = prev[j - 1];
            } else {
                curr[j] = 1 + Math.min(
                    prev[j],      // Delete
                    curr[j - 1],  // Insert
                    prev[j - 1]   // Replace
                );
            }
        }
        
        [prev, curr] = [curr, prev];
    }
    
    return prev[n];
};
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| **Full 2D DP** | O(m × n) | O(m × n) | Path reconstruction, debugging |
| **Two Rows** | O(m × n) | O(min(m, n)) | **General use** - better space |
| **Single Array** | O(m × n) | O(min(m, n)) | Minimal space usage |

**Where:**
- `m` = length of first string
- `n` = length of second string

---

## Related Problems

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Edit Distance** | [Link](https://leetcode.com/problems/edit-distance/) | Classic edit distance |
| **Delete Operation for Two Strings** | [Link](https://leetcode.com/problems/delete-operation-for-two-strings/) | Convert using only deletes |
| **Minimum ASCII Delete Sum** | [Link](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/) | Minimize ASCII sum of deletions |
| **Longest Common Subsequence** | [Link](https://leetcode.com/problems/longest-common-subsequence/) | Related 2D DP pattern |
| **Distinct Subsequences** | [Link](https://leetcode.com/problems/distinct-subsequences/) | Count distinct subsequences |
| **Interleaving String** | [Link](https://leetcode.com/problems/interleaving-string/) | Check if string is interleaving |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Regular Expression Matching** | [Link](https://leetcode.com/problems/regular-expression-matching/) | Pattern matching with DP |
| **Wildcard Matching** | [Link](https://leetcode.com/problems/wildcard-matching/) | Pattern matching with wildcards |
| **Shortest Common Supersequence** | [Link](https://leetcode.com/problems/shortest-common-supersequence/) | Construct shortest supersequence |
| **String Transformation** | [Link](https://leetcode.com/problems/string-transformation/) | Complex transformation rules |

---

## Video Tutorial Links

1. [Edit Distance - NeetCode](https://www.youtube.com/watch?v=XYi2-LPrw4A) - Complete DP walkthrough
2. [Levenshtein Distance - Abdul Bari](https://www.youtube.com/watch?v=We3YDTzNXEk) - Detailed explanation
3. [2D Dynamic Programming - Back To Back SWE](https://www.youtube.com/watch?v=0bqfTzpWySY) - General patterns
4. [String DP Problems - Tushar Roy](https://www.youtube.com/watch?v=ocZMDMZwhCY) - Multiple string DP patterns

---

## Summary

### Key Takeaways

1. **2D DP for two sequences** - When comparing two strings/sequences, use a 2D table
2. **State definition is crucial** - `dp[i][j]` = cost for first i chars of s1 and first j chars of s2
3. **Three operations** - Delete, Insert, Replace cover all transformation possibilities
4. **Space can be optimized** - Only need previous row, so O(min(m,n)) space is sufficient
5. **Backtracking finds the path** - Trace back from dp[m][n] to reconstruct operations

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Forgetting base cases** | Always initialize first row and column |
| **Off-by-one in indexing** | dp[i][j] corresponds to s1[i-1] and s2[j-1] |
| **Not handling empty strings** | Base cases cover dp[i][0] and dp[0][j] |
| **Wrong recurrence relation** | Check all three operations when characters don't match |
| **Ignoring character match case** | When s1[i-1] == s2[j-1], no operation needed |

### Follow-up Questions

**Q1: How would you modify this to only allow insert and delete (no replace)?**

Remove the replace option from the min() calculation. When characters differ, only consider insert and delete.

**Q2: How do you find the actual sequence of operations, not just the count?**

Backtrack from dp[m][n] to dp[0][0]:
- If chars match: move diagonally up-left
- If dp[i][j] = dp[i-1][j] + 1: deletion, move up
- If dp[i][j] = dp[i][j-1] + 1: insertion, move left
- If dp[i][j] = dp[i-1][j-1] + 1: replacement, move diagonally

**Q3: What if operations have different costs?**

Modify the recurrence to use the specific costs:
`dp[i][j] = min(dp[i-1][j] + delete_cost, dp[i][j-1] + insert_cost, dp[i-1][j-1] + replace_cost)`

**Q4: How is this related to Longest Common Subsequence (LCS)?**

Edit distance = len(s1) + len(s2) - 2 * LCS(s1, s2) when only insert/delete are allowed. Replace counts as one operation instead of delete+insert.

---

## Pattern Source

For more dynamic programming patterns, see:
- **[DP - 1D Array Fibonacci](/patterns/dp-1d-array-fibonacci)**
- **[DP - 1D Array Knapsack](/patterns/dp-1d-array-0-1-knapsack-subset-sum)**
- **[DP - 1D Array Coin Change](/patterns/dp-1d-array-coin-change-unbounded-knapsack)**
- **[DP - Stock Problems](/patterns/dp-stock-problems)**

---

## Additional Resources

- [LeetCode Edit Distance](https://leetcode.com/problems/edit-distance/)
- [GeeksforGeeks Edit Distance](https://www.geeksforgeeks.org/edit-distance-dp-5/)
- [Wikipedia - Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance)
- [String Algorithms - Stanford](http://web.stanford.edu/class/cs97si/)
