# Manacher's Algorithm

## Category
Advanced

## Description

Manacher's Algorithm is a **linear-time algorithm** (O(n)) used to find the longest palindromic substring in a given string. It solves this problem significantly more efficiently than the naive O(n³) or dynamic programming O(n²) approaches.

The algorithm works by leveraging **symmetry properties of palindromes** and avoids redundant computations by utilizing previously computed information. It can find all palindromic substrings in linear time by transforming the string to handle both odd and even length palindromes uniformly.

### Key Characteristics

- **Time Complexity**: O(n) for finding all palindromic substrings
- **Space Complexity**: O(n) for the transformed string and radius array
- **Primary Use**: Longest palindromic substring, counting palindromes
- **Core Innovation**: String transformation + symmetry exploitation

---

## When to Use

Use Manacher's Algorithm when you need to solve problems involving:

- **Longest Palindromic Substring**: Finding the longest contiguous palindrome in a string
- **All Palindromic Substrings**: Enumerating or counting all palindromes in a string
- **Palindromic Radius Queries**: Finding the palindrome radius at each position
- **Center-based Analysis**: When you need to analyze palindromes centered at each position
- **String Pattern Matching**: Problems involving palindrome properties

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|-------------------|----------|
| **Manacher's Algorithm** | O(n) | O(n) | All palindrome problems, frequent queries |
| **Expand Around Center** | O(n²) | O(1) | Simple longest palindrome, space-constrained |
| **Dynamic Programming** | O(n²) | O(n²) | When you need all substrings with overlapping info |
| **Suffix Array + LCP** | O(n log n) | O(n) | Multiple string problems combined |
| **Naive Approach** | O(n³) | O(1) | Never recommended |

### When to Choose Manacher's vs Expand Around Center

**Choose Manacher's Algorithm when:**
- You need to find ALL palindromic substrings
- You have many queries on the same string
- O(n²) is too slow for your constraints
- You need the radius information at every position

**Choose Expand Around Center when:**
- You only need the longest palindromic substring
- Space is extremely constrained (O(1) required)
- The string is small and simplicity matters
- You're in an interview and O(n²) is acceptable

---

## Algorithm Explanation

### Core Concept

Manacher's Algorithm works by maintaining a **transformed string** with special characters (like `#`) inserted between each character and at the boundaries. This transformation ensures that every palindrome has a uniform center, whether it's odd or even length.

The algorithm maintains three key pieces of information:

1. **`p[i]`**: The radius of the palindrome centered at position `i` in the transformed string
2. **`c`**: The center of the rightmost palindrome found so far
3. **`r`**: The right boundary (rightmost index) of that palindrome

### The Transformed String

For a string `"abcba"`, we transform it to `"#a#b#c#b#a#"` (length = 2n + 1)

**Why this works:**
- Every character is a potential center
- Odd and even palindromes are handled uniformly
- No index out of bounds issues at edges

### Visual Representation

For string `"babad"`:

```
Original:    b  a  b  a  d
             ↓  ↓  ↓  ↓  ↓
Transformed: #  b  #  a  #  b  #  a  #  d  #
Index:       0  1  2  3  4  5  6  7  8  9  10
```

**Example Palindromes:**
- `"bab"` (original indices [0,2]) → Center at transformed index 3, Radius = 2
- `"aba"` (original indices [1,3]) → Center at transformed index 5, Radius = 2

### The Key Insight: Mirror Symmetry

```
Rightmost palindrome found so far:
        ←——— r ———→
    [ . . . c . . . ]
            ↑
          center

For position i within the right boundary:
        ←——— r ———→
    [ . . i . c . i' . . ]
            ↑
    mirror = 2*c - i
```

If position `i` is within the current right boundary `r`, we can use information from its mirror position `mirror = 2*c - i` to avoid redundant comparisons.

### Step-by-Step Walkthrough

**Example: String = "abacaba"**

```
Step 1: Transform
Original:  abacaba
Transformed: #a#b#a#c#a#b#a#

Step 2: Initialize
c = 0, r = 0
p = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

Step 3: Process each position
i=0: Expand → p[0]=0
i=1: Expand "a" → p[1]=1
i=2: i < r, use mirror → p[2]=0
i=3: Expand "b" → p[3]=1
i=4: i < r, use mirror → p[4]=2 (extends "aba")
...
Final p array gives all palindrome radii
```

---

## Algorithm Steps

### Step 1: Transform the String

Insert a special character (e.g., `#`) between each character and at the beginning/end:

```python
def transform(s):
    """Transform 'abc' → '#a#b#c#'"""
    result = '#'
    for c in s:
        result += c + '#'
    return result
```

### Step 2: Initialize Variables

- Create array `p` of size `n` (transformed length) initialized with zeros
- Set `c = 0` (center) and `r = 0` (right boundary)

### Step 3: Main Loop

For each position `i` from 0 to n-1:

1. **Find mirror position**: `mirror = 2*c - i`
2. **Initialize radius**: If `i < r`, use `min(p[mirror], r - i)`; otherwise use 0
3. **Expand around center**: While characters match, expand outward
4. **Update center**: If palindrome extends past `r`, update `c` and `r`
5. **Store result**: Save `p[i]`

### Step 4: Extract Results

- **Longest palindrome**: Find index with maximum `p[i]`
- **Count palindromes**: Sum `(p[i] + 1) // 2` for all i

---

## Implementation

### Complete Template Code

````carousel
<!-- slide: Python -->
```python
def manacher(s: str) -> list:
    """
    Manacher's Algorithm to find all palindromic substrings.
    
    Returns array p where p[i] is the radius of palindrome centered at i.
    The actual palindrome length in transformed string is 2*p[i] + 1.
    The palindrome length in original string is p[i].
    
    Time Complexity: O(n)
    Space Complexity: O(n)
    
    Args:
        s: Input string
        
    Returns:
        Array of palindrome radii for transformed string
    """
    if not s:
        return []
    
    # Step 1: Transform the string
    # "abc" → "#a#b#c#"
    t = '#' + '#'.join(s) + '#'
    n = len(t)
    
    # Step 2: Initialize radius array
    p = [0] * n
    
    # Step 3: Main algorithm
    c = 0  # center of the rightmost palindrome
    r = 0  # right boundary of the rightmost palindrome
    
    for i in range(n):
        # Step 3a: Find mirror position
        mirror = 2 * c - i
        
        # Step 3b: Initialize radius using previously computed info
        if i < r:
            # p[mirror] is what we know from mirror position
            # r - i is how far we can safely extend within boundary
            p[i] = min(p[mirror], r - i)
        
        # Step 3c: Expand around center i
        # Try to extend the palindrome centered at i
        while (i - p[i] - 1 >= 0 and 
               i + p[i] + 1 < n and 
               t[i - p[i] - 1] == t[i + p[i] + 1]):
            p[i] += 1
        
        # Step 3d: Update center and right boundary if needed
        if i + p[i] > r:
            c = i
            r = i + p[i]
    
    return p


def longest_palindrome(s: str) -> str:
    """
    Find the longest palindromic substring using Manacher's algorithm.
    
    Time Complexity: O(n)
    Space Complexity: O(n)
    
    Args:
        s: Input string
        
    Returns:
        Longest palindromic substring
    """
    if not s:
        return ""
    
    p = manacher(s)
    
    # Find the maximum radius and its center
    max_len = 0
    center_idx = 0
    for i in range(len(p)):
        if p[i] > max_len:
            max_len = p[i]
            center_idx = i
    
    # Convert back to original string indices
    # center_idx in transformed string maps to (center_idx - max_len) // 2 in original
    start = (center_idx - max_len) // 2
    return s[start:start + max_len]


def count_palindromic_substrings(s: str) -> int:
    """
    Count all palindromic substrings in the string.
    
    Each palindrome centered at i with radius p[i] contributes
    (p[i] + 1) // 2 palindromes to the original string.
    
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    if not s:
        return 0
    
    p = manacher(s)
    count = 0
    
    for radius in p:
        # In transformed string: radius gives us info about palindromes
        # In original string: (radius + 1) // 2 gives count
        count += (radius + 1) // 2
    
    return count


# Example usage and test cases
if __name__ == "__main__":
    test_cases = [
        "babad",      # "bab" or "aba"
        "cbbd",       # "bb"
        "a",          # "a"
        "ac",         # "a" or "c"
        "racecar",    # "racecar"
        "aaa",        # "aaa"
        "abacaba",    # "abacaba"
    ]
    
    print("=" * 60)
    print("Manacher's Algorithm - Demo")
    print("=" * 60)
    
    for s in test_cases:
        p = manacher(s)
        longest = longest_palindrome(s)
        count = count_palindromic_substrings(s)
        
        print(f"\nInput: '{s}'")
        print(f"  Longest Palindrome: '{longest}'")
        print(f"  Total Palindromes: {count}")
        print(f"  Radius Array: {p}")
```

<!-- slide: C++ -->
```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

/**
 * Manacher's Algorithm to find all palindromic substrings.
 * 
 * Returns vector p where p[i] is the radius of palindrome centered at i.
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 * 
 * @param s Input string
 * @return Vector of palindrome radii for transformed string
 */
vector<int> manacher(const string& s) {
    if (s.empty()) return {};
    
    // Step 1: Transform the string
    // "abc" → "#a#b#c#"
    string t = "#";
    for (char c : s) {
        t += c;
        t += '#';
    }
    int n = t.length();
    
    // Step 2: Initialize radius array
    vector<int> p(n, 0);
    
    // Step 3: Main algorithm
    int c = 0;  // center of rightmost palindrome
    int r = 0;  // right boundary of rightmost palindrome
    
    for (int i = 0; i < n; i++) {
        // Step 3a: Find mirror position
        int mirror = 2 * c - i;
        
        // Step 3b: Initialize radius
        if (i < r) {
            p[i] = min(p[mirror], r - i);
        }
        
        // Step 3c: Expand around center
        while (i - p[i] - 1 >= 0 && 
               i + p[i] + 1 < n && 
               t[i - p[i] - 1] == t[i + p[i] + 1]) {
            p[i]++;
        }
        
        // Step 3d: Update center and right boundary
        if (i + p[i] > r) {
            c = i;
            r = i + p[i];
        }
    }
    
    return p;
}

/**
 * Find the longest palindromic substring.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
string longestPalindrome(const string& s) {
    if (s.empty()) return "";
    
    vector<int> p = manacher(s);
    
    // Find maximum radius and its center
    int maxLen = 0;
    int centerIdx = 0;
    for (int i = 0; i < (int)p.size(); i++) {
        if (p[i] > maxLen) {
            maxLen = p[i];
            centerIdx = i;
        }
    }
    
    // Convert back to original string indices
    int start = (centerIdx - maxLen) / 2;
    return s.substr(start, maxLen);
}

/**
 * Count all palindromic substrings.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
int countPalindromicSubstrings(const string& s) {
    if (s.empty()) return 0;
    
    vector<int> p = manacher(s);
    int count = 0;
    
    for (int radius : p) {
        count += (radius + 1) / 2;
    }
    
    return count;
}

int main() {
    vector<string> testCases = {
        "babad",      // "bab" or "aba"
        "cbbd",       // "bb"
        "a",          // "a"
        "ac",         // "a" or "c"
        "racecar",    // "racecar"
        "aaa",        // "aaa"
        "abacaba"     // "abacaba"
    };
    
    cout << string(60, '=') << endl;
    cout << "Manacher's Algorithm - Demo" << endl;
    cout << string(60, '=') << endl;
    
    for (const string& s : testCases) {
        vector<int> p = manacher(s);
        string longest = longestPalindrome(s);
        int count = countPalindromicSubstrings(s);
        
        cout << "\nInput: '" << s << "'" << endl;
        cout << "  Longest Palindrome: '" << longest << "'" << endl;
        cout << "  Total Palindromes: " << count << endl;
        cout << "  Radius Array: [";
        for (int i = 0; i < (int)p.size(); i++) {
            if (i > 0) cout << ", ";
            cout << p[i];
        }
        cout << "]" << endl;
    }
    
    return 0;
}
```

<!-- slide: Java -->
```java
import java.util.Arrays;

/**
 * Manacher's Algorithm implementation.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
public class Manacher {
    
    /**
     * Manacher's Algorithm to find all palindromic substrings.
     * 
     * Returns array p where p[i] is the radius of palindrome centered at i.
     * 
     * @param s Input string
     * @return Array of palindrome radii for transformed string
     */
    public static int[] manacher(String s) {
        if (s == null || s.isEmpty()) {
            return new int[0];
        }
        
        // Step 1: Transform the string
        // "abc" → "#a#b#c#"
        StringBuilder t = new StringBuilder("#");
        for (char c : s.toCharArray()) {
            t.append(c).append('#');
        }
        int n = t.length();
        
        // Step 2: Initialize radius array
        int[] p = new int[n];
        
        // Step 3: Main algorithm
        int c = 0;  // center of rightmost palindrome
        int r = 0;  // right boundary of rightmost palindrome
        
        for (int i = 0; i < n; i++) {
            // Step 3a: Find mirror position
            int mirror = 2 * c - i;
            
            // Step 3b: Initialize radius
            if (i < r) {
                p[i] = Math.min(p[mirror], r - i);
            }
            
            // Step 3c: Expand around center
            while (i - p[i] - 1 >= 0 && 
                   i + p[i] + 1 < n && 
                   t.charAt(i - p[i] - 1) == t.charAt(i + p[i] + 1)) {
                p[i]++;
            }
            
            // Step 3d: Update center and right boundary
            if (i + p[i] > r) {
                c = i;
                r = i + p[i];
            }
        }
        
        return p;
    }
    
    /**
     * Find the longest palindromic substring.
     * 
     * @param s Input string
     * @return Longest palindromic substring
     */
    public static String longestPalindrome(String s) {
        if (s == null || s.isEmpty()) {
            return "";
        }
        
        int[] p = manacher(s);
        
        // Find maximum radius and its center
        int maxLen = 0;
        int centerIdx = 0;
        for (int i = 0; i < p.length; i++) {
            if (p[i] > maxLen) {
                maxLen = p[i];
                centerIdx = i;
            }
        }
        
        // Convert back to original string indices
        int start = (centerIdx - maxLen) / 2;
        return s.substring(start, start + maxLen);
    }
    
    /**
     * Count all palindromic substrings.
     * 
     * @param s Input string
     * @return Count of palindromic substrings
     */
    public static int countPalindromicSubstrings(String s) {
        if (s == null || s.isEmpty()) {
            return 0;
        }
        
        int[] p = manacher(s);
        int count = 0;
        
        for (int radius : p) {
            count += (radius + 1) / 2;
        }
        
        return count;
    }
    
    public static void main(String[] args) {
        String[] testCases = {
            "babad",      // "bab" or "aba"
            "cbbd",       // "bb"
            "a",          // "a"
            "ac",         // "a" or "c"
            "racecar",    // "racecar"
            "aaa",        // "aaa"
            "abacaba"     // "abacaba"
        };
        
        System.out.println("=".repeat(60));
        System.out.println("Manacher's Algorithm - Demo");
        System.out.println("=".repeat(60));
        
        for (String s : testCases) {
            int[] p = manacher(s);
            String longest = longestPalindrome(s);
            int count = countPalindromicSubstrings(s);
            
            System.out.println("\nInput: '" + s + "'");
            System.out.println("  Longest Palindrome: '" + longest + "'");
            System.out.println("  Total Palindromes: " + count);
            System.out.println("  Radius Array: " + Arrays.toString(p));
        }
    }
}
```

<!-- slide: JavaScript -->
```javascript
/**
 * Manacher's Algorithm to find all palindromic substrings.
 * 
 * Returns array p where p[i] is the radius of palindrome centered at i.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 * 
 * @param {string} s - Input string
 * @returns {number[]} Array of palindrome radii for transformed string
 */
function manacher(s) {
    if (!s || s.length === 0) {
        return [];
    }
    
    // Step 1: Transform the string
    // "abc" → "#a#b#c#"
    const t = '#' + s.split('').join('#') + '#';
    const n = t.length;
    
    // Step 2: Initialize radius array
    const p = new Array(n).fill(0);
    
    // Step 3: Main algorithm
    let c = 0;  // center of rightmost palindrome
    let r = 0;  // right boundary of rightmost palindrome
    
    for (let i = 0; i < n; i++) {
        // Step 3a: Find mirror position
        const mirror = 2 * c - i;
        
        // Step 3b: Initialize radius
        if (i < r) {
            p[i] = Math.min(p[mirror], r - i);
        }
        
        // Step 3c: Expand around center
        while (i - p[i] - 1 >= 0 && 
               i + p[i] + 1 < n && 
               t[i - p[i] - 1] === t[i + p[i] + 1]) {
            p[i]++;
        }
        
        // Step 3d: Update center and right boundary
        if (i + p[i] > r) {
            c = i;
            r = i + p[i];
        }
    }
    
    return p;
}

/**
 * Find the longest palindromic substring.
 * 
 * @param {string} s - Input string
 * @returns {string} Longest palindromic substring
 */
function longestPalindrome(s) {
    if (!s || s.length === 0) {
        return "";
    }
    
    const p = manacher(s);
    
    // Find maximum radius and its center
    let maxLen = 0;
    let centerIdx = 0;
    for (let i = 0; i < p.length; i++) {
        if (p[i] > maxLen) {
            maxLen = p[i];
            centerIdx = i;
        }
    }
    
    // Convert back to original string indices
    const start = Math.floor((centerIdx - maxLen) / 2);
    return s.slice(start, start + maxLen);
}

/**
 * Count all palindromic substrings.
 * 
 * @param {string} s - Input string
 * @returns {number} Count of palindromic substrings
 */
function countPalindromicSubstrings(s) {
    if (!s || s.length === 0) {
        return 0;
    }
    
    const p = manacher(s);
    let count = 0;
    
    for (const radius of p) {
        count += Math.floor((radius + 1) / 2);
    }
    
    return count;
}

// Example usage and test cases
const testCases = [
    "babad",      // "bab" or "aba"
    "cbbd",       // "bb"
    "a",          // "a"
    "ac",         // "a" or "c"
    "racecar",    // "racecar"
    "aaa",        // "aaa"
    "abacaba"     // "abacaba"
];

console.log("=".repeat(60));
console.log("Manacher's Algorithm - Demo");
console.log("=".repeat(60));

for (const s of testCases) {
    const p = manacher(s);
    const longest = longestPalindrome(s);
    const count = countPalindromicSubstrings(s);
    
    console.log(`\nInput: '${s}'`);
    console.log(`  Longest Palindrome: '${longest}'`);
    console.log(`  Total Palindromes: ${count}`);
    console.log(`  Radius Array: [${p.join(', ')}]`);
}
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **String Transformation** | O(n) | Creating the transformed string with delimiters |
| **Main Loop** | O(n) | Each position is processed once |
| **Expansion** | O(n) total | Each character comparison happens at most twice |
| **Finding Maximum** | O(n) | Linear scan of radius array |
| **Total** | **O(n)** | Linear time algorithm |

### Detailed Breakdown

**Why is expansion O(n) total and not O(n²)?**

The key insight is that the right boundary `r` only moves forward:
- `r` starts at 0 and can only increase
- Each expansion either:
  - Uses precomputed mirror information (O(1))
  - Extends `r` by doing character comparisons
- Since `r` can increase at most `n` times, total comparisons are O(n)

**Visual Proof:**
```
Each character position is "covered" by the right boundary at most once:

Initial:  r = 0
After i=2: r = 4  (covered positions 0-4)
After i=5: r = 8  (covered positions 0-8)
...

Total coverage extensions: O(n)
Total character comparisons: O(n)
```

---

## Space Complexity Analysis

| Component | Space Complexity | Description |
|-----------|------------------|-------------|
| **Transformed String** | O(n) | String of length 2n + 1 |
| **Radius Array** | O(n) | Stores palindrome radii |
| **Variables** | O(1) | Center, right boundary, loop indices |
| **Total** | **O(n)** | Linear space required |

### Space Optimization (Optional)

For extremely large strings where space is critical:

1. **On-the-fly transformation**: Instead of storing `t`, compute `t[i]` as needed:
   ```python
   def get_transformed(t, i):
       if i % 2 == 0:
           return '#'  # Even indices are separators
       return t[i // 2]  # Odd indices are characters
   ```

2. **Streaming output**: If you only need the longest palindrome (not all radii), you can reduce space further.

---

## Common Variations

### 1. Count All Palindromic Substrings

Count how many palindromic substrings exist in the string (LeetCode 647):

```python
def count_palindromes(s: str) -> int:
    """
    Count all palindromic substrings in O(n) time.
    
    Each radius contributes (radius + 1) // 2 palindromes:
    - radius 0: 0 palindromes (just the separator)
    - radius 1: 1 palindrome (single char or double)
    - radius 2: 1 palindrome (3 chars or 4 chars)
    - radius 3: 2 palindromes (center + one inside)
    """
    if not s:
        return 0
    
    p = manacher(s)
    count = 0
    
    for radius in p:
        # Convert transformed radius to original string palindrome count
        count += (radius + 1) // 2
    
    return count
```

### 2. Longest Palindromic Substring with Start Index

Return both the palindrome and its starting position:

```python
def longest_palindrome_with_index(s: str) -> tuple:
    """
    Find longest palindrome and its starting index.
    
    Returns: (palindrome_string, start_index)
    """
    if not s:
        return ("", -1)
    
    p = manacher(s)
    
    max_len = 0
    center_idx = 0
    
    for i in range(len(p)):
        if p[i] > max_len:
            max_len = p[i]
            center_idx = i
    
    start = (center_idx - max_len) // 2
    return (s[start:start + max_len], start)
```

### 3. Shortest Palindrome (LeetCode 214)

Find minimum insertions at the beginning to make string palindrome:

```python
def shortest_palindrome(s: str) -> str:
    """
    Find shortest palindrome by adding characters in front.
    
    Key insight: Find longest palindromic prefix, then reverse
    the remaining suffix and add to front.
    """
    if not s:
        return ""
    
    # Concatenate s + '#' + reverse(s) and find LPS
    rev_s = s[::-1]
    combined = s + '#' + rev_s
    
    # Use Manacher on combined string
    p = manacher(combined)
    
    # The palindrome at position len(s) tells us the longest prefix match
    center = len(s)
    prefix_len = p[2 * center + 1] if 2 * center + 1 < len(p) else 0
    
    # Reverse the non-matching suffix and add to front
    to_add = rev_s[:len(s) - prefix_len]
    return to_add + s
```

### 4. Palindrome Pairs (LeetCode 336)

Given a list of words, find all pairs that form palindromes:

```python
def palindrome_pairs(words):
    """
    Find all pairs (i, j) such that words[i] + words[j] is a palindrome.
    
    Strategy:
    1. Build hash map of word -> index
    2. For each word, try all possible splits
    3. Check if either part forms palindrome with another word
    """
    word_map = {word: i for i, word in enumerate(words)}
    result = []
    
    for i, word in enumerate(words):
        n = len(word)
        
        for j in range(n + 1):
            prefix = word[:j]
            suffix = word[j:]
            
            # Case 1: prefix is palindrome, check for reverse of suffix
            rev_suffix = suffix[::-1]
            if prefix == prefix[::-1] and rev_suffix in word_map and word_map[rev_suffix] != i:
                result.append([word_map[rev_suffix], i])
            
            # Case 2: suffix is palindrome, check for reverse of prefix
            rev_prefix = prefix[::-1]
            if j != n and suffix == suffix[::-1] and rev_prefix in word_map and word_map[rev_prefix] != i:
                result.append([i, word_map[rev_prefix]])
    
    return result
```

### 5. Longest Palindromic Subsequence (Different from Substring!)

Note: Manacher finds substrings (contiguous), not subsequences. For subsequences, use DP:

```python
def longest_palindromic_subsequence(s: str) -> int:
    """
    Find length of longest palindromic subsequence using DP.
    Note: This is different from substring - characters need not be contiguous.
    """
    n = len(s)
    # dp[i][j] = length of LPS in s[i:j+1]
    dp = [[0] * n for _ in range(n)]
    
    # Single characters are palindromes of length 1
    for i in range(n):
        dp[i][i] = 1
    
    # Fill for lengths 2 to n
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            if s[i] == s[j]:
                if length == 2:
                    dp[i][j] = 2
                else:
                    dp[i][j] = dp[i + 1][j - 1] + 2
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
    
    return dp[0][n - 1]
```

---

## Practice Problems

### Problem 1: Longest Palindromic Substring

**Problem:** [LeetCode 5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)

**Description:** Given a string `s`, return the longest palindromic substring in `s`.

**Example:**
- Input: `s = "babad"`
- Output: `"bab"` (or `"aba"`)

**How to Apply Manacher's Algorithm:**
- Use the template code to find the palindrome with maximum radius
- Extract the substring from the original string using the formula: `start = (center - radius) // 2`
- Time complexity: O(n), Space complexity: O(n)

**Key Points:**
- Multiple valid answers may exist (return any)
- Handle edge cases: empty string, single character
- Remember: radius in transformed string = length in original string

---

### Problem 2: Palindromic Substrings

**Problem:** [LeetCode 647. Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/)

**Description:** Given a string `s`, return the number of palindromic substrings in `s`.

**Example:**
- Input: `s = "aaa"`
- Output: `6` ("a", "a", "a", "aa", "aa", "aaa")

**How to Apply Manacher's Algorithm:**
- Run Manacher to get the radius array `p`
- Each position `i` contributes `(p[i] + 1) // 2` palindromes
- Sum all contributions to get the answer in O(n)

**Key Points:**
- Single characters count as palindromes
- Overlapping palindromes are counted separately
- Formula derivation: radius 1 → 1 palindrome, radius 2 → 1 palindrome, radius 3 → 2 palindromes, etc.

---

### Problem 3: Shortest Palindrome

**Problem:** [LeetCode 214. Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/)

**Description:** Given a string `s`, you can add any number of characters in front of it to make it a palindrome. Return the shortest palindrome you can find.

**Example:**
- Input: `s = "aacecaaa"`
- Output: `"aaacecaaa"`

**How to Apply Manacher's Algorithm:**
- Find the longest palindromic prefix of `s`
- Reverse the remaining suffix and prepend it
- To find longest palindromic prefix: concatenate `s + '#' + reverse(s)` and apply Manacher
- The LPS ending at the middle gives the longest prefix match

---

### Problem 4: Longest Palindromic Subsequence

**Problem:** [LeetCode 516. Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/)

**Description:** Given a string `s`, return the length of the longest palindromic subsequence.

**Example:**
- Input: `s = "bbbab"`
- Output: `4` ("bbbb")

**Important Note:**
- This problem asks for **subsequence**, not **substring**
- Manacher finds substrings (contiguous), NOT subsequences
- For this problem, use **Dynamic Programming** instead
- LPS length = length of s - minimum insertions to make palindrome

---

### Problem 5: Palindrome Pairs

**Problem:** [LeetCode 336. Palindrome Pairs](https://leetcode.com/problems/palindrome-pairs/)

**Description:** Given a list of unique words, find all pairs of distinct indices `(i, j)` such that `words[i] + words[j]` is a palindrome.

**Example:**
- Input: `words = ["abcd", "dcba", "lls", "s", "sssll"]`
- Output: `[[0,1],[1,0],[3,2],[2,4]]`

**How to Apply Manacher's Algorithm:**
- Build a hash map of word → index for O(1) lookup
- For each word, try all possible split points
- Use Manacher (or simple palindrome check) to test if prefix/suffix is palindrome
- If prefix is palindrome, look for reverse of suffix in hash map
- If suffix is palindrome, look for reverse of prefix in hash map

**Optimization:**
- Precompute palindrome information for all possible splits
- Handle empty string case specially

---

## Video Tutorial Links

### Fundamentals

- [Manacher's Algorithm - Introduction (Take U Forward)](https://www.youtube.com/watch?v=4kT3AVK4GKA) - Comprehensive introduction with step-by-step explanation
- [Manacher's Algorithm Explained (WilliamFiset)](https://www.youtube.com/watch?v=nbTSfrEfoE0) - Detailed explanation with visualizations
- [Longest Palindromic Substring (NeetCode)](https://www.youtube.com/watch?v=8jG1xI2kIdI) - LeetCode problem solution approach

### Advanced Topics

- [Palindromic Substrings (NeetCode)](https://www.youtube.com/watch?v=6kALZikXxLc) - Counting all palindromes efficiently
- [Shortest Palindrome Problem (Tech Dose)](https://www.youtube.com/watch?v=vT7O0OmiNyM) - KMP and Manacher approaches
- [Manacher's Algorithm - Practice Problems (Codeforces)](https://www.youtube.com/watch?v=6_1k2C2J1fQ) - Competitive programming strategies

### Comparison with Alternatives

- [Expand Around Center vs Manacher (Kevin Naughton Jr.)](https://www.youtube.com/watch?v=NVQt2P6NRtM) - When to use which approach
- [Dynamic Programming for Palindromes](https://www.youtube.com/watch?v=UuVqmSzIMkI) - Alternative O(n²) approach

---

## Follow-up Questions

### Q1: Why do we use special characters (`#`) in the transformation?

**Answer:** The transformation (adding `#` between characters and at boundaries) serves three purposes:

1. **Uniform Centers**: Every palindrome has a single, well-defined center. Without it, even-length palindromes (like "aa") don't have a true center character—they have a center *between* characters.

2. **Simplified Logic**: Both odd and even length palindromes are handled uniformly. A palindrome of length `k` in the original string becomes a palindrome of radius `k` in the transformed string.

3. **No Boundary Issues**: The separators at the beginning and end prevent index out-of-bounds errors during expansion.

```
Original:   "aba" (odd)  →  Center at 'b'
            "abba" (even) →  Center between 'b' and 'b'

Transformed: "#a#b#a#"  →  Center always at some index
             "#a#b#b#a#" →  Center at index 4 (the middle #)
```

---

### Q2: Can Manacher's Algorithm be used for circular strings?

**Answer:** Yes, with modifications. For circular strings (where the string wraps around):

1. **Approach**: Create a doubled string (`s + s`) and apply Manacher
2. **Constraint**: Only consider palindromes of length ≤ n (original length)
3. **Complexity**: Still O(n) with careful implementation

**Example:**
```
Circular string: "abac"
In circular form: "abacabac..."
Palindromes can wrap: "aca" (indices 2,3,0 in circular form)

Solution: Double the string to "abacabac" and find palindromes
```

---

### Q3: How does the algorithm handle edge cases?

**Answer:** The algorithm naturally handles edge cases:

| Case | Behavior |
|------|----------|
| Empty string | Returns empty array / empty string |
| Single character | Returns that character as the palindrome (radius = 1) |
| All same characters | Returns the entire string (longest palindrome = full string) |
| No palindromes > 1 char | Returns single characters (each is a palindrome) |
| Very long string | O(n) time and space still apply |

---

### Q4: What is the key insight behind Manacher's O(n) complexity?

**Answer:** The key insight is **symmetry exploitation** and **boundary tracking**:

1. **Mirror Property**: If we know a palindrome centered at `c` extends to `r`, then for any position `i` within this range, its mirror `mirror = 2*c - i` gives us information about the minimum palindrome radius at `i`.

2. **Bounded Expansion**: We only expand beyond the precomputed minimum when necessary. If `i + p[mirror] < r`, we don't need to expand at all!

3. **Monotonic Right Boundary**: The right boundary `r` only moves forward. Since each character comparison either:
   - Uses O(1) mirror information, OR
   - Extends `r` (which can happen at most n times)
   
   Total comparisons are O(n).

---

### Q5: Can Manacher's Algorithm be modified to find the longest palindromic substring of at least length k?

**Answer:** Yes, several approaches:

1. **Post-processing**: Run standard Manacher, then filter for radii ≥ k

2. **Early termination**: During the algorithm, track if any radius ≥ k is found

3. **First-k optimization**: If you need the shortest palindrome ≥ k, maintain a priority queue during processing

```python
def longest_palindrome_at_least_k(s: str, k: int) -> str:
    """Find longest palindrome with length >= k."""
    if k <= 0:
        return longest_palindrome(s)
    
    p = manacher(s)
    best_len = 0
    best_center = 0
    
    for i in range(len(p)):
        if p[i] >= k and p[i] > best_len:
            best_len = p[i]
            best_center = i
    
    if best_len < k:
        return ""  # No palindrome of length >= k found
    
    start = (best_center - best_len) // 2
    return s[start:start + best_len]
```

---

## Summary

Manacher's Algorithm is an elegant **linear-time solution** for palindrome-related problems:

### Key Takeaways

| Aspect | Details |
|--------|---------|
| **Time Complexity** | O(n) - Much faster than O(n²) or O(n³) alternatives |
| **Space Complexity** | O(n) - For transformed string and radius array |
| **Core Innovation** | String transformation + symmetry exploitation |
| **Best Used For** | Finding all palindromes, longest palindrome, counting palindromes |

### Essential Points to Remember

1. **Always transform the string** with special characters (`#`) to handle both odd and even length palindromes uniformly

2. **Maintain three variables**:
   - `p[i]`: radius at position i
   - `c`: center of rightmost palindrome
   - `r`: right boundary of rightmost palindrome

3. **Use mirror positions** to skip unnecessary computations: `mirror = 2*c - i`

4. **Radius conversion**: 
   - `p[i]` in transformed string = length in original string
   - Start index in original = `(center - radius) // 2`

5. **Practice the template** until it becomes second nature—this algorithm is commonly asked in technical interviews

### When to Use Manacher's

✅ **Use when:**
- Finding longest palindromic substring
- Counting all palindromic substrings
- Need O(n) solution for palindrome problems
- Multiple queries on same string

❌ **Don't use when:**
- Space is extremely constrained (use expand-around-center O(1) space)
- Only need to check if string is palindrome (use two pointers)
- Finding palindromic subsequence (use DP instead)

---

## Related Algorithms

- [Expand Around Center](./two-pointers.md) - O(n²) time, O(1) space alternative for longest palindrome
- [Dynamic Programming](./dp-palindrome.md) - For palindromic subsequence and substring problems
- [KMP Algorithm](./kmp.md) - Used in shortest palindrome problem for prefix function
- [Rolling Hash](./rolling-hash.md) - Alternative approach for palindrome detection
- [Suffix Array](./suffix-array.md) - For complex string palindrome problems
