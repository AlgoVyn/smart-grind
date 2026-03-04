# Edit Distance

## Category
Dynamic Programming

## Description
Edit Distance (also known as Levenshtein Distance) is a classic dynamic programming problem that measures the minimum number of operations required to transform one string into another. The three allowed operations are:
- **Insert**: Add a character at any position
- **Delete**: Remove a character
- **Replace**: Change one character to another

This algorithm is fundamental in applications like spell checkers, DNA sequence alignment, and fuzzy string matching.

---

## When to Use

Use the Edit Distance algorithm when you need to solve problems involving:

- **String Transformation**: Converting one string to another with minimum operations
- **Spell Checking**: Finding the closest matching word in a dictionary
- **Fuzzy Matching**: Determining similarity between two strings
- **DNA Sequence Alignment**: Computing genetic sequence differences
- **Auto-correct Systems**: Suggesting corrections for typos
- **Plagiarism Detection**: Measuring text similarity

### Comparison with Alternatives

| Algorithm/Method | Time Complexity | Space Complexity | Use Case |
|------------------|-----------------|------------------|----------|
| **Edit Distance (DP)** | O(m × n) | O(m × n) or O(min(m,n)) | When exact minimum operations needed |
| **Longest Common Subsequence** | O(m × n) | O(m × n) | When only insertions/deletions allowed |
| **Hamming Distance** | O(n) | O(1) | For strings of equal length only |
| **Jaccard Similarity** | O(n) | O(n) | For set-based similarity (tokenized) |
| **Levenshtein Automaton** | O(m × n) | O(m × n) | For fuzzy search in databases |

### When to Choose Edit Distance vs Other Methods

- **Choose Edit Distance** when:
  - You need the exact minimum number of operations
  - All three operations (insert, delete, replace) are allowed
  - You need to reconstruct the actual transformation steps
  - Strings have different lengths

- **Choose LCS** when:
  - Only insertions and deletions are allowed (no replacements)
  - You need the actual common subsequence

- **Choose Hamming Distance** when:
  - Both strings have equal length
  - Only substitutions are considered
  - Performance is critical (O(n) vs O(m×n))

- **Choose Jaccard Similarity** when:
  - Working with tokenized text (words, n-grams)
  - Set-based similarity is acceptable
  - Performance is critical

---

## Algorithm Explanation

### Core Concept

The key insight behind Edit Distance is that transforming a string can be broken down into smaller subproblems. To transform `word1[0...i]` to `word2[0...j]`, we only need to consider:

1. **Last character comparison**: If `word1[i-1] == word2[j-1]`, no operation is needed for these characters
2. **Three possible operations**: We can either insert, delete, or replace the last character

By building a table where each cell represents the minimum operations to transform prefixes of both strings, we can compute the final answer systematically.

### How It Works

#### DP Table Definition:
`dp[i][j]` = minimum number of operations to transform `word1[0...i-1]` to `word2[0...j-1]`

#### Recurrence Relation:
```
If word1[i-1] == word2[j-1]:
    dp[i][j] = dp[i-1][j-1]  (characters match, no operation needed)
Else:
    dp[i][j] = 1 + min(
        dp[i-1][j],      # Delete word1[i-1]
        dp[i][j-1],      # Insert word2[j-1] into word1
        dp[i-1][j-1]     # Replace word1[i-1] with word2[j-1]
    )
```

#### Base Cases:
- `dp[0][j] = j`: Transform empty string to `word2[0...j-1]` needs j insertions
- `dp[i][0] = i`: Transform `word1[0...i-1]` to empty string needs i deletions

### Visual Example

Transforming "horse" to "ros":

```
        ""  r   o   s
    ""    0   1   2   3
    h    1   1   2   3
    o    2   2   1   2
    r    3   2   2   2
    s    4   3   3   2
    e    5   4   4   3
```

Answer: dp[5][3] = 3

### Key Properties

- **Optimal Substructure**: Solution can be built from subproblems
- **Overlapping Subproblems**: Same subproblems computed multiple times in naive recursion
- **Bottom-up DP**: We build the solution from smaller subproblems to larger ones

---

## Algorithm Steps

### Step-by-Step Approach

1. **Initialize the DP table**
   - Create a 2D array of size `(m+1) × (n+1)` where m = len(word1), n = len(word2)
   - Add extra row and column for empty string base cases

2. **Set base cases**
   - First row (empty word1): `dp[0][j] = j` for all j (j insertions needed)
   - First column (empty word2): `dp[i][0] = i` for all i (i deletions needed)

3. **Fill the DP table**
   - For i from 1 to m:
     - For j from 1 to n:
       - If `word1[i-1] == word2[j-1]`:
         - `dp[i][j] = dp[i-1][j-1]` (characters match)
       - Else:
         - `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`
           - dp[i-1][j]: delete operation
           - dp[i][j-1]: insert operation
           - dp[i-1][j-1]: replace operation

4. **Return the answer**
   - The minimum edit distance is `dp[m][n]`

### Optional: Backtracking for Operations

To reconstruct the actual operations:
1. Start from `i = m, j = n`
2. While i > 0 and j > 0:
   - If `word1[i-1] == word2[j-1]`: Move diagonally (no operation)
   - Else if `dp[i][j] == dp[i-1][j-1] + 1`: Replace operation
   - Else if `dp[i][j] == dp[i-1][j] + 1`: Delete operation
   - Else: Insert operation
3. Handle remaining characters (all deletions or insertions)

---

## Implementation

### Template Code (Standard Edit Distance)

````carousel
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
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

/**
 * Edit Distance (Levenshtein Distance) implementation.
 * 
 * Time: O(m * n)
 * Space: O(m * n)
 */
int minDistance(string word1, string word2) {
    int m = word1.length();
    int n = word2.length();
    
    // Create DP table
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    // Base cases: transform to empty string
    for (int i = 0; i <= m; i++) {
        dp[i][0] = i;  // i deletions
    }
    for (int j = 0; j <= n; j++) {
        dp[0][j] = j;  // j insertions
    }
    
    // Fill the DP table
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];  // Characters match
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

/**
 * Space-optimized version using O(n) space.
 */
int minDistanceOptimized(string word1, string word2) {
    int m = word1.length();
    int n = word2.length();
    
    // Ensure n <= m for space optimization
    if (n > m) {
        swap(word1, word2);
        swap(m, n);
    }
    
    vector<int> prev(n + 1), curr(n + 1);
    
    // Base case: empty word1
    for (int j = 0; j <= n; j++) {
        prev[j] = j;
    }
    
    for (int i = 1; i <= m; i++) {
        curr[0] = i;
        for (int j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) {
                curr[j] = prev[j - 1];
            } else {
                curr[j] = 1 + min({prev[j], curr[j - 1], prev[j - 1]});
            }
        }
        swap(prev, curr);
    }
    
    return prev[n];
}

/**
 * Returns operations as well as the distance.
 */
pair<int, vector<string>> editDistanceWithOperations(string word1, string word2) {
    int m = word1.length();
    int n = word2.length();
    
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
            }
        }
    }
    
    // Backtrack to find operations
    vector<string> operations;
    int i = m, j = n;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && word1[i - 1] == word2[j - 1]) {
            operations.push_back("Match '" + string(1, word1[i - 1]) + "'");
            i--; j--;
        } else if (i > 0 && j > 0 && dp[i][j] == dp[i - 1][j - 1] + 1) {
            operations.push_back("Replace '" + string(1, word1[i - 1]) + 
                               "' with '" + string(1, word2[j - 1]) + "'");
            i--; j--;
        } else if (j > 0 && dp[i][j] == dp[i][j - 1] + 1) {
            operations.push_back("Insert '" + string(1, word2[j - 1]) + "'");
            j--;
        } else {
            operations.push_back("Delete '" + string(1, word1[i - 1]) + "'");
            i--;
        }
    }
    
    reverse(operations.begin(), operations.end());
    return {dp[m][n], operations};
}

int main() {
    cout << "Edit Distance (Levenshtein Distance)" << endl;
    cout << "======================================" << endl;
    
    vector<pair<string, string>> testCases = {
        {"horse", "ros"},
        {"intention", "execution"},
        {"kitten", "sitting"},
        {"", "abc"},
        {"abc", ""},
        {"abc", "abc"}
    };
    
    for (const auto& [word1, word2] : testCases) {
        int dist = minDistance(word1, word2);
        cout << "\n'" << word1 << "' -> '" << word2 << "': " << dist << " operations" << endl;
    }
    
    // Detailed operation trace
    cout << "\n======================================" << endl;
    cout << "Detailed operations for 'horse' -> 'ros':" << endl;
    auto [dist, ops] = editDistanceWithOperations("horse", "ros");
    cout << "Distance: " << dist << endl;
    for (const auto& op : ops) {
        cout << "  " << op << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
public class EditDistance {
    
    /**
     * Calculate the minimum edit distance between two strings.
     * 
     * Time: O(m * n)
     * Space: O(m * n)
     */
    public static int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        
        // Create DP table
        int[][] dp = new int[m + 1][n + 1];
        
        // Base cases: transform to empty string
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;  // i deletions
        }
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;  // j insertions
        }
        
        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];  // Characters match
                } else {
                    dp[i][j] = 1 + Math.min(
                        Math.min(dp[i - 1][j], dp[i][j - 1]),
                        dp[i - 1][j - 1]
                    );
                }
            }
        }
        
        return dp[m][n];
    }
    
    /**
     * Space-optimized version using O(n) space.
     */
    public static int minDistanceOptimized(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        
        // Ensure n <= m for space optimization
        if (n > m) {
            String temp = word1;
            word1 = word2;
            word2 = temp;
            int tempInt = m;
            m = n;
            n = tempInt;
        }
        
        int[] prev = new int[n + 1];
        int[] curr = new int[n + 1];
        
        // Base case: empty word1
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
                        Math.min(prev[j], curr[j - 1]),
                        prev[j - 1]
                    );
                }
            }
            int[] temp = prev;
            prev = curr;
            curr = temp;
        }
        
        return prev[n];
    }
    
    /**
     * Returns operations as well as the distance.
     */
    public static Pair<Integer, List<String>> editDistanceWithOperations(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        
        int[][] dp = new int[m + 1][n + 1];
        
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(
                        Math.min(dp[i - 1][j], dp[i][j - 1]),
                        dp[i - 1][j - 1]
                    );
                }
            }
        }
        
        // Backtrack to find operations
        List<String> operations = new ArrayList<>();
        int i = m, j = n;
        
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && word1.charAt(i - 1) == word2.charAt(j - 1)) {
                operations.add("Match '" + word1.charAt(i - 1) + "'");
                i--; j--;
            } else if (i > 0 && j > 0 && dp[i][j] == dp[i - 1][j - 1] + 1) {
                operations.add("Replace '" + word1.charAt(i - 1) + 
                             "' with '" + word2.charAt(j - 1) + "'");
                i--; j--;
            } else if (j > 0 && dp[i][j] == dp[i][j - 1] + 1) {
                operations.add("Insert '" + word2.charAt(j - 1) + "'");
                j--;
            } else {
                operations.add("Delete '" + word1.charAt(i - 1) + "'");
                i--;
            }
        }
        
        Collections.reverse(operations);
        return new Pair<>(dp[m][n], operations);
    }
    
    public static void main(String[] args) {
        System.out.println("Edit Distance (Levenshtein Distance)");
        System.out.println("======================================");
        
        String[][] testCases = {
            {"horse", "ros"},
            {"intention", "execution"},
            {"kitten", "sitting"},
            {"", "abc"},
            {"abc", ""},
            {"abc", "abc"}
        };
        
        for (String[] testCase : testCases) {
            String word1 = testCase[0];
            String word2 = testCase[1];
            int dist = minDistance(word1, word2);
            System.out.println("\n'" + word1 + "' -> '" + word2 + "': " + dist + " operations");
        }
        
        // Detailed operation trace
        System.out.println("\n======================================");
        System.out.println("Detailed operations for 'horse' -> 'ros':");
        Pair<Integer, List<String>> result = editDistanceWithOperations("horse", "ros");
        System.out.println("Distance: " + result.getKey());
        for (String op : result.getValue()) {
            System.out.println("  " + op);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Edit Distance (Levenshtein Distance) implementation.
 * 
 * Time: O(m * n)
 * Space: O(m * n)
 */
function minDistance(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    
    // Create DP table
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    
    // Base cases: transform to empty string
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;  // i deletions
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;  // j insertions
    }
    
    // Fill the DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];  // Characters match
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
}

/**
 * Space-optimized version using O(n) space.
 */
function minDistanceOptimized(word1, word2) {
    let m = word1.length;
    let n = word2.length;
    
    // Ensure n <= m for space optimization
    if (n > m) {
        [word1, word2] = [word2, word1];
        [m, n] = [n, m];
    }
    
    const prev = Array.from({ length: n + 1 }, (_, j) => j);
    const curr = new Array(n + 1);
    
    for (let i = 1; i <= m; i++) {
        curr[0] = i;
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                curr[j] = prev[j - 1];
            } else {
                curr[j] = 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
            }
        }
        [prev, curr] = [curr, prev];
    }
    
    return prev[n];
}

/**
 * Returns operations as well as the distance.
 */
function editDistanceWithOperations(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }
    
    // Backtrack to find operations
    const operations = [];
    let i = m, j = n;
    
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && word1[i - 1] === word2[j - 1]) {
            operations.push(`Match '${word1[i - 1]}'`);
            i--; j--;
        } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
            operations.push(`Replace '${word1[i - 1]}' with '${word2[j - 1]}'`);
            i--; j--;
        } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
            operations.push(`Insert '${word2[j - 1]}'`);
            j--;
        } else {
            operations.push(`Delete '${word1[i - 1]}'`);
            i--;
        }
    }
    
    return { distance: dp[m][n], operations: operations.reverse() };
}

// Example usage and demonstration
console.log("Edit Distance (Levenshtein Distance)");
console.log("======================================");

const testCases = [
    ["horse", "ros"],
    ["intention", "execution"],
    ["kitten", "sitting"],
    ["", "abc"],
    ["abc", ""],
    ["abc", "abc"]
];

for (const [word1, word2] of testCases) {
    const dist = minDistance(word1, word2);
    console.log(`\n'${word1}' -> '${word2}': ${dist} operations`);
}

// Detailed operation trace
console.log("\n======================================");
console.log("Detailed operations for 'horse' -> 'ros':");
const { distance, operations } = editDistanceWithOperations("horse", "ros");
console.log(`Distance: ${distance}`);
for (const op of operations) {
    console.log(`  ${op}`);
}
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Standard DP** | O(m × n) | Fill entire m×n table |
| **Space-Optimized** | O(m × n) | Same number of operations |
| **Backtracking** | O(m + n) | To reconstruct operations |

### Detailed Breakdown

- **Building the table**: For each cell (i,j), we perform O(1) work (three comparisons and a min)
- **Total cells**: (m+1) × (n+1) = O(m × n)
- **Space optimization**: Only keeps two rows at a time, reducing space from O(m×n) to O(n)

---

## Space Complexity Analysis

| Version | Space Complexity | Description |
|---------|-----------------|-------------|
| **Standard** | O(m × n) | Full DP table storage |
| **Space-Optimized** | O(min(m, n)) | Only two rows stored |
| **Backtracking** | O(m × n) | Need full table for path reconstruction |

### Space Optimization Explanation

The key insight is that to compute `dp[i][j]`, we only need:
- `dp[i-1][j-1]` (diagonal)
- `dp[i-1][j]` (directly above)
- `dp[i][j-1]` (directly to the left)

This means we only need to keep the current row and previous row in memory.

---

## Common Variations

### 1. Weighted Edit Distance

Different operations have different costs:

````carousel
```python
def weightedEditDistance(word1, word2, insert_cost=1, delete_cost=1, replace_cost=1):
    """Edit distance with custom operation costs."""
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for j in range(n + 1):
        dp[0][j] = j * insert_cost
    for i in range(m + 1):
        dp[i][0] = i * delete_cost
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = min(
                    dp[i - 1][j] + delete_cost,      # Delete
                    dp[i][j - 1] + insert_cost,      # Insert
                    dp[i - 1][j - 1] + replace_cost  # Replace
                )
    
    return dp[m][n]
```
````

### 2. Only Insert and Delete (LCS Variant)

When replace is not allowed, this becomes equivalent to: `m + n - 2 * LCS(word1, word2)`

### 3. Only Delete and Insert (Damerau-Levenshtein Limited)

Similar to standard but without transpositions.

### 4. Optimal String Alignment Distance

Restricts that each substring can be edited at most once. This is not a true metric but is faster to compute.

### 5. Edit Distance with Two Strings of Constraints

When one string is very long and the other is short, use banded DP to limit the search space.

---

## Practice Problems

### Problem 1: Edit Distance (Classic)

**Problem:** [LeetCode 72 - Edit Distance](https://leetcode.com/problems/edit-distance/)

**Description:** Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2` where operations are insert, delete, or replace.

**How to Apply:**
- This is the classic edit distance problem
- Build a DP table where `dp[i][j]` represents the minimum operations to transform `word1[0:i]` to `word2[0:j]`
- Use the standard recurrence relation

---

### Problem 2: One Edit Distance

**Problem:** [LeetCode 161 - One Edit Distance](https://leetcode.com/problems/one-edit-distance/)

**Description:** Given two strings s and t, return true if they are both exactly one edit distance apart.

**How to Apply:**
- If lengths differ by more than 1, return false
- If lengths are equal, check if exactly one character differs
- If lengths differ by 1, check if one can be inserted into the shorter string to get the longer

---

### Problem 3: Minimum ASCII Delete Sum

**Problem:** [LeetCode 712 - Minimum ASCII Delete Sum for Two Strings](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/)

**Description:** Given two strings, find the minimum sum of ASCII values of deleted characters to make them equal.

**How to Apply:**
- Similar to edit distance but only insert and delete (no replace)
- The cost of deleting a character is its ASCII value
- Use DP with cumulative costs

---

### Problem 4: Delete Operation for Two Strings

**Problem:** [LeetCode 583 - Delete Operation for Two Strings](https://leetcode.com/problems/delete-operation-for-two-strings/)

**Description:** Given two strings, return the minimum number of steps required to make the two strings equal. You can delete characters from either string.

**How to Apply:**
- This is equivalent to: `len(word1) + len(word2) - 2 * LCS(word1, word2)`
- Or use standard DP with only delete operations

---

### Problem 5: Shortest Common Supersequence

**Problem:** [LeetCode 1092 - Shortest Common Supersequence](https://leetcode.com/problems/shortest-common-supersequence/)

**Description:** Given two strings str1 and str2, return the shortest string that has both str1 and str2 as subsequences.

**How to Apply:**
- Use edit distance concepts combined with LCS
- The shortest common supersequence length = len(str1) + len(str2) - LCS(str1, str2)
- Use DP to reconstruct the actual supersequence

---

## Video Tutorial Links

### Fundamentals

- [Edit Distance - Dynamic Programming (Take U Forward)](https://www.youtube.com/watch?v=XYi2LPrP824) - Comprehensive introduction to edit distance
- [Levenshtein Distance Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=MiX0QMxhF-0) - Detailed explanation with visualizations
- [Edit Distance LeetCode Solution (NeetCode)](https://www.youtube.com/watch?v=fRbaV1NF3X8) - Practical implementation guide

### Advanced Topics

- [Space Optimized Edit Distance](https://www.youtube.com/watch?v=We3Y1xK0rWw) - Reducing space complexity
- [Edit Distance Variations](https://www.youtube.com/watch?v=0iW91_2KH9o) - Different variants and use cases
- [DP on Strings (Striver)](https://www.youtube.com/watch?v=1hG9DO4psJU) - Edit distance as part of string DP

---

## Follow-up Questions

### Q1: How would you optimize space complexity from O(m × n) to O(min(m, n))?

**Answer:** The key insight is that to compute `dp[i][j]`, we only need:
- `dp[i-1][j-1]` (the diagonal value)
- `dp[i-1][j]` (the value from the previous row)
- `dp[i][j-1]` (the value from the current row)

Therefore, we only need to keep two rows in memory at any time. We can swap between them using array rotation. Additionally, we should always use the shorter string for the DP array to minimize space.

### Q2: How would you reconstruct the actual operations performed?

**Answer:** To reconstruct operations, we need the full DP table (not the space-optimized version). Starting from `dp[m][n]`, we backtrack:
- If characters match, move diagonally (no operation)
- If `dp[i][j] = dp[i-1][j-1] + 1`, it was a replace operation
- If `dp[i][j] = dp[i][j-1] + 1`, it was an insert operation
- If `dp[i][j] = dp[i-1][j] + 1`, it was a delete operation

### Q3: What modifications are needed to handle only insert and delete (no replace)?

**Answer:** Simply remove the replace option from the recurrence:
```python
dp[i][j] = min(
    dp[i-1][j] + 1,  # Delete
    dp[i][j-1] + 1   # Insert
)
```
This is equivalent to finding the LCS and computing: `m + n - 2 * LCS`.

### Q4: How would you add custom costs for each operation?

**Answer:** Modify the recurrence to include costs:
```python
dp[i][j] = min(
    dp[i-1][j] + delete_cost,
    dp[i][j-1] + insert_cost,
    dp[i-1][j-1] + (0 if chars match else replace_cost)
)
```

### Q5: What is the difference between Levenshtein and Damerau-Levenshtein distance?

**Answer:** The Damerau-Levenshtein distance adds **transposition** as a fourth operation (swapping two adjacent characters counts as one operation). It provides a more accurate measure for keyboard typos but is more complex to compute efficiently.

---

## Summary

Edit Distance (Levenshtein Distance) is a fundamental dynamic programming problem with wide applications in:

- **Text Processing**: Spell checkers, auto-correct, fuzzy search
- **Bioinformatics**: DNA sequence alignment
- **Plagiarism Detection**: Measuring text similarity

### Key Takeaways

- **Time Complexity**: O(m × n) for both standard and space-optimized versions
- **Space Complexity**: O(m × n) standard, O(min(m, n)) optimized
- **Core Idea**: Build DP table where each cell represents the minimum operations for prefix transformation
- **Three Operations**: Insert, Delete, Replace (each costs 1 in standard version)
- **Space Optimization**: Only need two rows at a time, swap and reuse

### When to Use

- ✅ When you need exact minimum operations
- ✅ When all three operations are allowed
- ✅ When you need to reconstruct the transformation steps
- ❌ For very long strings where O(m × n) is too slow (consider approximate algorithms, hashing, or indexing)

This algorithm is essential for competitive programming and technical interviews, forming the foundation for many string manipulation and dynamic programming problems.

---

## Related Algorithms

- [Longest Common Subsequence](./lcs.md) - Related DP problem
- [Longest Common Substring](./lcs-substring.md) - Contiguous matching
- [Knuth-Morris-Pratt](./kmp.md) - String pattern matching
- [Rabin-Karp](./rabin-karp.md) - String hashing
