# Longest Common Subsequence

## Category
Dynamic Programming

## Description

The Longest Common Subsequence (LCS) is a classic dynamic programming problem that finds the longest subsequence common to two strings. A **subsequence** is a sequence that appears in the same relative order but not necessarily contiguous.

### Core Concept

The key insight behind LCS is that we can break down the problem into smaller subproblems. For two strings `text1` and `text2`, let `dp[i][j]` represent the length of the LCS of the first `i` characters of `text1` and the first `j` characters of `text2`.

The recurrence relation is:
- **If characters match** (`text1[i-1] == text2[j-1]`): `dp[i][j] = dp[i-1][j-1] + 1`
- **If they don't match**: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

This builds a 2D table where each cell represents the LCS length for those prefixes. To reconstruct the actual subsequence, we backtrack from `dp[m][n]` (where m and n are the lengths of the strings).

### Visual Representation

For `text1 = "ABCDGH"` and `text2 = "AEDFHR"`:

```
        ""  A  E  D  F  H  R
    ""   0  0  0  0  0  0  0
    A    0  1  1  1  1  1  1
    B    0  1  1  1  1  1  1
    C    0  1  1  1  1  1  1
    D    0  1  1  2  2  2  2
    G    0  1  1  2  2  2  2
    H    0  1  1  2  2  3  3

LCS = "ADH" (length = 3)
```

### Why Dynamic Programming Works

The LCS problem exhibits **optimal substructure** and **overlapping subproblems**:
1. **Optimal Substructure**: The LCS of two strings can be constructed from the LCS of their prefixes
2. **Overlapping Subproblems**: The same subproblems (LCS of prefixes) are solved multiple times without DP

---

## When to Use

Use this algorithm when you need to solve problems involving:

- **String Comparison**: Finding similarities between two strings or documents
- **Diff Tools**: Version control systems (git diff)
- **Bioinformatics**: DNA sequence alignment
- **Plagiarism Detection**: Finding common sequences between documents
- **Edit Distance**: Related problems like Levenshtein distance

### Comparison with Alternatives

| Algorithm | Use Case | Time | Space | Notes |
|-----------|----------|------|-------|-------|
| **LCS (DP)** | Find longest common subsequence | O(m×n) | O(m×n) | Returns actual subsequence |
| **LCS (Space-Optimized)** | When memory is limited | O(m×n) | O(min(m,n)) | Only stores current row |
| **Rolling Hash** | Quick approximation | O(m+n) | O(1) | May have false positives |
| **Suffix Array** | Multiple string comparisons | O(n log n) | O(n) | More complex to implement |

### When to Choose LCS vs Other Approaches

- **Choose Standard LCS (DP)** when:
  - You need the actual subsequence string
  - Strings are relatively short (< 5000 chars)
  - Memory is not a concern

- **Choose Space-Optimized LCS** when:
  - Memory is limited
  - You only need the length (not the string)
  - Working with very long strings

- **Choose Alternative Approaches** when:
  - Approximate matching is acceptable
  - Strings are extremely long (millions of characters)
  - Multiple queries on the same string

---

## Algorithm Explanation

### How It Works

#### DP Table Building Phase:
1. Create a 2D array `dp` of size `(m+1) × (n+1)` where `dp[i][j]` = LCS length of `text1[0:i]` and `text2[0:j]`
2. Initialize first row and column to 0 (base case: empty string has LCS = 0 with anything)
3. Fill the table by iterating through all positions:
   - If characters match, take diagonal value + 1
   - Otherwise, take max of left and top values

#### Backtracking Phase (to find actual subsequence):
1. Start from `dp[m][n]` (bottom-right corner)
2. If characters match, move diagonally (add character to result)
3. Otherwise, move in the direction of the larger value
4. Continue until reaching `dp[0][0]`

### Key Insights

1. **Base Case**: Empty string has LCS = 0 with any string
2. **State Transition**: Only depends on previous row/column values
3. **Reconstruction**: Backtracking reveals the actual subsequence
4. **Space Optimization**: Only need previous row since each cell only depends on two values

### Limitations

- **O(m×n) time**: Slow for very long strings
- **O(m×n) space**: Can be reduced to O(min(m, n))
- **Not suitable for millions of strings**: Use suffix trees/arrays instead
- **Sequential only**: Doesn't parallelize well

---

## Algorithm Steps

### Standard LCS Implementation

1. **Initialize**: Get lengths `m = len(text1)`, `n = len(text2)`
2. **Create DP Table**: Initialize `(m+1) × (n+1)` table with zeros
3. **Fill Table**: For each cell `(i, j)`:
   - If `text1[i-1] == text2[j-1]`: `dp[i][j] = dp[i-1][j-1] + 1`
   - Else: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`
4. **Return Length**: `dp[m][n]` contains the LCS length

### Space-Optimized Implementation

1. **Determine Orientation**: Use shorter string for columns
2. **Initialize Rows**: Create two 1D arrays (previous and current)
3. **Iterate**: For each row, compute current values from previous row
4. **Swap**: After each row, swap previous and current arrays
5. **Return**: Last element of previous row

### Finding the Actual Subsequence

1. **Start Backtracking**: From position `(m, n)` in the DP table
2. **Check Match**: If `text1[i-1] == text2[j-1]`, add to result and move diagonally
3. **Navigate**: If no match, move to larger of `(i-1, j)` or `(i, j-1)`
4. **Reverse**: The collected characters are in reverse order

---

## Implementation

### Template Code (Longest Common Subsequence)

````carousel
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

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

/**
 * Longest Common Subsequence (LCS) Implementation
 * 
 * Time Complexity: O(m * n)
 * Space Complexity: O(m * n)
 */
class LCS {
public:
    /**
     * Find the length of LCS between two strings.
     */
    static int lcsLength(const string& text1, const string& text2) {
        int m = text1.length();
        int n = text2.length();
        
        // Create DP table
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i - 1] == text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        return dp[m][n];
    }
    
    /**
     * Find both the length and the actual LCS string.
     */
    static pair<int, string> lcsWithString(const string& text1, const string& text2) {
        int m = text1.length();
        int n = text2.length();
        
        // Create DP table
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i - 1] == text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        // Backtrack to find the LCS string
        string lcs;
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (text1[i - 1] == text2[j - 1]) {
                lcs += text1[i - 1];
                i--;
                j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        
        reverse(lcs.begin(), lcs.end());
        return {dp[m][n], lcs};
    }
    
    /**
     * Space-optimized version - O(min(m, n)) space.
     */
    static int lcsLengthOptimized(const string& text1, const string& text2) {
        // Ensure text2 is shorter for less memory
        if (text1.length() < text2.length()) {
            return lcsLengthOptimizedHelper(text1, text2);
        }
        return lcsLengthOptimizedHelper(text2, text1);
    }
    
private:
    static int lcsLengthOptimizedHelper(const string& text1, const string& text2) {
        int m = text1.length();
        int n = text2.length();
        
        vector<int> prev(n + 1, 0), curr(n + 1, 0);
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i - 1] == text2[j - 1]) {
                    curr[j] = prev[j - 1] + 1;
                } else {
                    curr[j] = max(prev[j], curr[j - 1]);
                }
            }
            swap(prev, curr);
        }
        
        return prev[n];
    }
};

int main() {
    // Test case 1
    string text1 = "abcde";
    string text2 = "ace";
    auto [len1, lcs1] = LCS::lcsWithString(text1, text2);
    cout << "text1: '" << text1 << "', text2: '" << text2 << "'" << endl;
    cout << "LCS Length: " << len1 << ", LCS String: '" << lcs1 << "'" << endl;
    cout << endl;
    
    // Test case 2
    text1 = "AGCAT";
    text2 = "GAC";
    auto [len2, lcs2] = LCS::lcsWithString(text1, text2);
    cout << "text1: '" << text1 << "', text2: '" << text2 << "'" << endl;
    cout << "LCS Length: " << len2 << ", LCS String: '" << lcs2 << "'" << endl;
    cout << endl;
    
    // Test case 3
    text1 = "ABCDGH";
    text2 = "AEDFHR";
    auto [len3, lcs3] = LCS::lcsWithString(text1, text2);
    cout << "text1: '" << text1 << "', text2: '" << text2 << "'" << endl;
    cout << "LCS Length: " << len3 << ", LCS String: '" << lcs3 << "'" << endl;
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * Longest Common Subsequence (LCS) Implementation
 * 
 * Time Complexity: O(m * n)
 * Space Complexity: O(m * n)
 */
public class LCS {
    
    /**
     * Find the length of LCS between two strings.
     * 
     * @param text1 First string
     * @param text2 Second string
     * @return Length of longest common subsequence
     */
    public static int lcsLength(String text1, String text2) {
        int m = text1.length();
        int n = text2.length();
        
        // Create DP table
        int[][] dp = new int[m + 1][n + 1];
        
        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        return dp[m][n];
    }
    
    /**
     * Find both the length and the actual LCS string.
     * 
     * @return int array where [0] = length, [1] = LCS string
     */
    public static Object[] lcsWithString(String text1, String text2) {
        int m = text1.length();
        int n = text2.length();
        
        // Create DP table
        int[][] dp = new int[m + 1][n + 1];
        
        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        // Backtrack to find the LCS string
        StringBuilder lcs = new StringBuilder();
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                lcs.append(text1.charAt(i - 1));
                i--;
                j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        
        return new Object[]{dp[m][n], lcs.reverse().toString()};
    }
    
    /**
     * Space-optimized version - O(min(m, n)) space.
     */
    public static int lcsLengthOptimized(String text1, String text2) {
        // Ensure text2 is shorter for less memory
        if (text1.length() < text2.length()) {
            String temp = text1;
            text1 = text2;
            text2 = temp;
        }
        
        int m = text1.length();
        int n = text2.length();
        
        int[] prev = new int[n + 1];
        int[] curr = new int[n + 1];
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    curr[j] = prev[j - 1] + 1;
                } else {
                    curr[j] = Math.max(prev[j], curr[j - 1]);
                }
            }
            // Swap arrays
            int[] temp = prev;
            prev = curr;
            curr = temp;
        }
        
        return prev[n];
    }
    
    public static void main(String[] args) {
        // Test case 1
        String text1 = "abcde";
        String text2 = "ace";
        Object[] result1 = lcsWithString(text1, text2);
        System.out.println("text1: '" + text1 + "', text2: '" + text2 + "'");
        System.out.println("LCS Length: " + result1[0] + ", LCS String: '" + result1[1] + "'");
        System.out.println();
        
        // Test case 2
        text1 = "AGCAT";
        text2 = "GAC";
        Object[] result2 = lcsWithString(text1, text2);
        System.out.println("text1: '" + text1 + "', text2: '" + text2 + "'");
        System.out.println("LCS Length: " + result2[0] + ", LCS String: '" + result2[1] + "'");
        System.out.println();
        
        // Test case 3
        text1 = "ABCDGH";
        text2 = "AEDFHR";
        Object[] result3 = lcsWithString(text1, text2);
        System.out.println("text1: '" + text1 + "', text2: '" + text2 + "'");
        System.out.println("LCS Length: " + result3[0] + ", LCS String: '" + result3[1] + "'");
    }
}
```

<!-- slide -->
```javascript
/**
 * Longest Common Subsequence (LCS) Implementation
 * 
 * Time Complexity: O(m * n)
 * Space Complexity: O(m * n)
 */

/**
 * Find the length of LCS between two strings.
 * @param {string} text1 - First string
 * @param {string} text2 - Second string
 * @returns {number} Length of longest common subsequence
 */
function lcsLength(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    
    // Create DP table
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    
    // Fill the DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}

/**
 * Find both the length and the actual LCS string.
 * @param {string} text1 - First string
 * @param {string} text2 - Second string
 * @returns {{length: number, lcs: string}} Object with length and LCS string
 */
function lcsWithString(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    
    // Create DP table
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    
    // Fill the DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // Backtrack to find the LCS string
    let lcs = '';
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (text1[i - 1] === text2[j - 1]) {
            lcs = text1[i - 1] + lcs;
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    
    return { length: dp[m][n], lcs };
}

/**
 * Space-optimized version - O(min(m, n)) space.
 * @param {string} text1 - First string
 * @param {string} text2 - Second string
 * @returns {number} Length of longest common subsequence
 */
function lcsLengthOptimized(text1, text2) {
    // Ensure text2 is shorter for less memory
    if (text1.length < text2.length) {
        [text1, text2] = [text2, text1];
    }
    
    const m = text1.length;
    const n = text2.length;
    
    let prev = new Array(n + 1).fill(0);
    let curr = new Array(n + 1).fill(0);
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                curr[j] = prev[j - 1] + 1;
            } else {
                curr[j] = Math.max(prev[j], curr[j - 1]);
            }
        }
        [prev, curr] = [curr, prev];
    }
    
    return prev[n];
}

// Example usage and tests
console.log("=== LCS Implementation Tests ===\n");

// Test case 1
let text1 = "abcde";
let text2 = "ace";
let result = lcsWithString(text1, text2);
console.log(`text1: '${text1}', text2: '${text2}'`);
console.log(`LCS Length: ${result.length}, LCS String: '${result.lcs}'`);

// Test case 2
text1 = "abc";
text2 = "def";
result = lcsWithString(text1, text2);
console.log(`\ntext1: '${text1}', text2: '${text2}'`);
console.log(`LCS Length: ${result.length}, LCS String: '${result.lcs}'`);

// Test case 3
text1 = "agcat";
text2 = "gac";
result = lcsWithString(text1, text2);
console.log(`\ntext1: '${text1}', text2: '${text2}'`);
console.log(`LCS Length: ${result.length}, LCS String: '${result.lcs}'`);

// Test case 4
text1 = "ABCDGH";
text2 = "AEDFHR";
result = lcsWithString(text1, text2);
console.log(`\ntext1: '${text1}', text2: '${text2}'`);
console.log(`LCS Length: ${result.length}, LCS String: '${result.lcs}'`);

// Test space-optimized version
console.log("\n=== Space-Optimized Version ===");
text1 = "abcde";
text2 = "ace";
console.log(`LCS Length (optimized): ${lcsLengthOptimized(text1, text2)}`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **DP Table Building** | O(m × n) | Fill all m×n cells |
| **Backtracking** | O(m + n) | Worst case traverses entire table |
| **Total** | O(m × n) | Dominated by table building |
| **Space-Optimized** | O(m × n) | Same time, less space |

### Detailed Breakdown

- **Building the table**: For each of the m×n cells, we perform O(1) work (one comparison and possibly one max operation)
  - Total: m × n = O(m × n)

- **Backtracking**: In the worst case (no characters match), we may traverse all m + n cells
  - Total: O(m + n)

- **Space optimization**: We reduce space from O(m×n) to O(min(m,n)) by only storing one row at a time
  - Trade-off: We lose the ability to reconstruct the actual subsequence (only get length)

---

## Space Complexity Analysis

| Implementation | Space Complexity | Description |
|----------------|-----------------|-------------|
| **Standard** | O(m × n) | Full DP table |
| **Space-Optimized** | O(min(m, n)) | Two 1D arrays |
| **Single Row** | O(n) | If fixing one string |

### Space Optimization Details

1. **Two-Row Optimization**: Only store previous and current rows
   - Works when you only need LCS length
   - Cannot reconstruct the actual subsequence

2. **Rolling Array**: Use a single array with careful index management
   - Slightly faster due to better cache locality

3. **When to Use Each**:
   - Full table: Need actual subsequence string
   - Two rows: Need length, memory constrained
   - Single row: One string is very long

---

## Common Variations

### 1. Longest Common Substring (Not Subsequence)

The substring must be contiguous. Different DP formulation:

````carousel
```python
def longest_common_substring(text1: str, text2: str) -> tuple:
    """
    Find the longest common substring (contiguous).
    
    Time: O(m * n)
    Space: O(m * n) or O(min(m, n))
    """
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    max_length = 0
    end_index = 0  # End index in text1
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
                if dp[i][j] > max_length:
                    max_length = dp[i][j]
                    end_index = i
            else:
                dp[i][j] = 0
    
    return max_length, text1[end_index - max_length:end_index]
```
````

### 2. Longest Common Subsequence of K Sequences

Extend LCS to more than two strings:

````carousel
```python
def lcs_k_strings(strings: list, k: int = None) -> int:
    """
    Find LCS length of k strings.
    
    Time: O(n1 * n2 * ... * nk) - exponential in k!
    Space: O(n1 * n2 * ... * nk)
    
    Note: Only practical for very small k (2-3)
    """
    if k is None:
        k = len(strings)
    
    if k == 1:
        return len(strings[0])
    
    if k == 2:
        return lcs_length(strings[0], strings[1])
    
    # For k > 2, recursively compute LCS
    # This becomes very expensive quickly!
    from functools import reduce
    return reduce(lcs_length, strings)
```
````

### 3. Edit Distance (Levenshtein Distance)

Related problem - minimum operations to transform one string to another:

````carousel
```python
def min_edit_distance(text1: str, text2: str) -> int:
    """
    Minimum operations to transform text1 to text2.
    Operations: insert, delete, replace
    
    Time: O(m * n)
    Space: O(m * n)
    """
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    for i in range(m + 1):
        dp[i][0] = i  # Delete all
    for j in range(n + 1):
        dp[0][j] = j  # Insert all
    
    # Fill table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j],    # delete
                                   dp[i][j - 1],    # insert
                                   dp[i - 1][j - 1]) # replace
    
    return dp[m][n]
```
````

### 4. Sequence Alignment (With Gap Penalty)

More realistic biological sequence alignment:

````carousel
```python
def sequence_alignment(text1: str, text2: str, 
                       match: int = 1, 
                       mismatch: int = -1, 
                       gap: int = -2) -> int:
    """
    Global sequence alignment with scores.
    
    Time: O(m * n)
    Space: O(m * n)
    """
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Initialize with gap penalties
    for i in range(1, m + 1):
        dp[i][0] = dp[i-1][0] + gap
    for j in range(1, n + 1):
        dp[0][j] = dp[0][j-1] + gap
    
    # Fill table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i-1][j-1] + match
            else:
                dp[i][j] = max(
                    dp[i-1][j] + gap,      # delete/gap in text2
                    dp[i][j-1] + gap,      # insert/gap in text1
                    dp[i-1][j-1] + mismatch  # mismatch
                )
    
    return dp[m][n]
```
````

---

## Practice Problems

### Problem 1: Longest Common Subsequence

**Problem:** [LeetCode 1143 - Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/)

**Description:** Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return 0.

**How to Apply LCS:**
- This is the classic LCS problem
- Build a 2D DP table where `dp[i][j]` represents LCS length of first i chars of text1 and first j chars of text2
- Time: O(m×n), Space: O(m×n) or O(min(m,n))

---

### Problem 2: Delete Operation for Two Strings

**Problem:** [LeetCode 583 - Delete Operation for Two Strings](https://leetcode.com/problems/delete-operation-for-two-strings/)

**Description:** Given two strings word1 and word2, return the minimum number of steps required to make word1 and word2 the same. In one step, you can delete exactly one character in either string.

**How to Apply LCS:**
- The answer = len(word1) + len(word2) - 2 * LCS(word1, word2)
- Because deletions = total chars - common chars
- Use LCS to find common subsequence, then compute deletions

---

### Problem 3: Shortest Common Supersequence

**Problem:** [LeetCode 1092 - Shortest Common Supersequence](https://leetcode.com/problems/shortest-common-supersequence/)

**Description:** Given two strings str1 and str2, return the shortest string that has both str1 and str2 as subsequences.

**How to Apply LCS:**
- First compute LCS of str1 and str2
- Build result by interleaving: when characters match, add once; when they don't, add from the string with larger DP value
- The length = len(str1) + len(str2) - LCS

---

### Problem 4: Longest Palindromic Subsequence

**Problem:** [LeetCode 516 - Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/)

**Description:** Given a string s, find the length of the longest palindromic subsequence in s.

**How to Apply LCS:**
- This is LCS(s, reversed(s))
- Find LCS between the original string and its reverse
- Result gives the longest palindromic subsequence

---

### Problem 5: Minimum ASCII Delete Sum for Two Strings

**Problem:** [LeetCode 712 - Minimum ASCII Delete Sum for Two Strings](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/)

**Description:** Given two strings s1 and s2, find the minimum ASCII delete sum for both strings.

**How to Apply LCS:**
- Modified LCS where we sum ASCII values instead of counting
- dp[i][j] = minimum delete sum for s1[0:i] and s2[0:j]
- If chars match: dp[i][j] = dp[i-1][j-1]
- Else: dp[i][j] = min(dp[i-1][j] + s1[i-1], dp[i][j-1] + s2[j-1])

---

## Video Tutorial Links

### Fundamentals

- [LCS Introduction (Take U Forward)](https://www.youtube.com/watch?v=NPw9K2zH5Q4) - Comprehensive introduction to LCS
- [Longest Common Subsequence (WilliamFiset)](https://www.youtube.com/watch?v=LAwnG4C2QEw) - Detailed explanation with visualizations
- [LCS Dynamic Programming (NeetCode)](https://www.youtube.com/watch?v=NnP57Rj4r7U) - Practical implementation guide

### Advanced Topics

- [Edit Distance Problem](https://www.youtube.com/watch?v=We3Yvs7SmjX) - Related problem with more operations
- [Shortest Common Supersequence](https://www.youtube.com/watch?v=VDuchYJnw5k) - Building on LCS
- [Palindromic Subsequence](https://www.youtube.com/watch?v=AWJ0PPDboP4) - LCS with reversed string

### Variations

- [Longest Common Substring](https://www.youtube.com/watch?v=BysNXJb8jC8) - Contiguous vs non-contiguous
- [Space Optimization for LCS](https://www.youtube.com/watch?v=hR3s9rGlNUs) - Reducing memory usage

---

## Follow-up Questions

### Q1: What is the difference between LCS and Longest Common Substring?

**Answer:** 
- **LCS (Subsequence)**: Characters don't need to be contiguous; maintains relative order
- **Longest Common Substring**: Characters MUST be contiguous
- LCS is more flexible and generally has larger results
- Implementation differs: substring sets cell to 0 on mismatch, subsequence takes max of left/top

### Q2: Can LCS be solved recursively without DP?

**Answer:** Yes, but it's extremely inefficient:
- Recursive solution has O(2^m × 2^n) time complexity in worst case
- With memoization, it becomes O(m × n) - same as bottom-up DP
- However, recursion has O(m × n) call stack space
- Bottom-up DP is generally preferred for better performance and no stack overflow risk

### Q3: What is the maximum string length LCS can handle?

**Answer:** With standard O(m × n) space:
- **Memory**: ~100MB → ~10^7 cells → strings up to ~3000 chars
- **Time**: For 3000×3000, that's 9 million operations - feasible

For very long strings:
- Use space-optimized version (O(min(m,n)) space)
- Consider approximation algorithms for DNA sequences (millions of chars)
- Use suffix trees for multiple queries

### Q4: How does LCS relate to the Edit Distance problem?

**Answer:** They are closely related:
- **LCS**: Maximize matching characters
- **Edit Distance**: Minimize operations (insert, delete, replace)
- Relationship: Edit Distance = len(s1) + len(s2) - 2 × LCS(s1, s2)
- Both use similar DP approaches

### Q5: Can LCS handle Unicode or multibyte characters?

**Answer:** Yes, but with considerations:
- The algorithm works at the character level regardless of encoding
- For UTF-8 strings in Python, each character is a Unicode code point
- In C++/Java, `std::string`/`String` handles Unicode natively
- Performance may vary based on character encoding

---

## Summary

The Longest Common Subsequence is a fundamental dynamic programming problem with applications in string comparison, version control, bioinformatics, and more.

- **Core Concept**: Build a 2D table where each cell represents LCS length of prefixes
- **Time Complexity**: O(m × n) - must examine all cell combinations
- **Space Complexity**: O(m × n) standard, O(min(m, n)) optimized
- **Key Insight**: Only need previous row for length; full table for reconstruction

When to use:
- ✅ String comparison and diff tools
- ✅ Finding common patterns in sequences
- ✅ Bioinformatics applications
- ✅ Related problems (edit distance, palindromic subsequence)
- ❌ Very long strings (millions of chars) - use suffix trees
- ❌ When only approximate matching needed - use hashing

This algorithm is essential for competitive programming and technical interviews, serving as a building block for many string DP problems.

---

## Related Algorithms

- [Shortest Common Supersequence](./shortest-common-supersequence.md) - Build shortest superstring containing both
- [Edit Distance](./edit-distance.md) - Minimum operations to transform strings
- [Longest Increasing Subsequence](./lis.md) - Similar DP approach for single array
- [Palindromic Subsequence](./palindromic-subsequence.md) - LCS with reversed string
