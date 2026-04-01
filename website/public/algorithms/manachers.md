# Manacher's Algorithm

## Category
Advanced String Algorithms

## Description

Manacher's Algorithm finds the longest palindromic substring in linear **O(n)** time. It elegantly handles both odd-length and even-length palindromes uniformly by transforming the string with special delimiters and using the concept of "palindromic radius" to avoid redundant comparisons.

This algorithm is a classic example of how clever preprocessing and information reuse can transform an O(n²) problem into an O(n) solution. It is essential for competitive programming and frequently appears in technical interviews for string manipulation problems.

---

## Concepts

Manacher's Algorithm is built on several fundamental concepts that enable its linear time complexity.

### 1. String Transformation

The algorithm transforms the original string to handle both odd and even length palindromes uniformly:

| Original | Transformed | Purpose |
|----------|-------------|---------|
| `"abc"` | `"#a#b#c#"` | Every char can be center |
| `"abba"` | `"#a#b#b#a#"` | Even palindromes have center at `#` |
| `"a"` | `"#a#"` | Consistent handling |

The `#` delimiter ensures every position (character or gap) can serve as a palindrome center.

### 2. Palindromic Radius

For each position in the transformed string, we track:

| Variable | Description | Example |
|----------|-------------|---------|
| `radius[i]` | Half-length of palindrome centered at i | `radius[3]=3` for `#a#b#a#` |
| `center` | Center of rightmost discovered palindrome | Updates as we process |
| `right` | Right boundary of rightmost palindrome | `right = center + radius[center]` |

### 3. Mirror Property

The key insight: palindromes reflect around their center.

```
If position i is within the current rightmost palindrome centered at c:
  mirror position = 2*c - i
  
  The palindrome at i mirrors the palindrome at mirror position,
  but is constrained by the right boundary.
```

### 4. Incremental Expansion

When the mirror optimization doesn't give the full answer:
- Expand outward character by character
- Stop when characters don't match
- Update center and right if this palindrome extends further

---

## Frameworks

Structured approaches for solving palindrome problems.

### Framework 1: Standard Manacher's Algorithm

```
┌─────────────────────────────────────────────────────┐
│  MANACHER'S ALGORITHM (Longest Palindrome)         │
├─────────────────────────────────────────────────────┤
│  1. Transform: s → #a#b#c# (add delimiters)       │
│  2. Initialize:                                     │
│     - radius[] = [0] * len(transformed)             │
│     - center = right = 0                            │
│     - max_len = max_center = 0                      │
│  3. For each position i:                           │
│     a. If i < right:                               │
│        radius[i] = min(right-i, radius[2*center-i]) │
│     b. Expand around i while chars match           │
│     c. If i + radius[i] > right:                   │
│        center, right = i, i + radius[i]             │
│     d. Update max if radius[i] > max_len           │
│  4. Extract result from max_center                 │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding longest palindromic substring.

### Framework 2: Counting All Palindromes

```
┌─────────────────────────────────────────────────────┐
│  COUNTING PALINDROMIC SUBSTRINGS                   │
├─────────────────────────────────────────────────────┤
│  1. Run standard Manacher's to get radius[]        │
│  2. Initialize count = 0                           │
│  3. For each position i:                             │
│     a. Each radius[i] contributes radius[i]        │
│        odd-length palindromes                      │
│     b. Each radius[i] at '#' contributes           │
│        radius[i]/2 even-length palindromes          │
│  4. Return total count                             │
└─────────────────────────────────────────────────────┘
```

**When to use**: Counting all palindromic substrings.

### Framework 3: Longest Palindromic Prefix

```
┌─────────────────────────────────────────────────────┐
│  LONGEST PALINDROMIC PREFIX                        │
├─────────────────────────────────────────────────────┤
│  1. Transform original string                      │
│  2. Run Manacher's to get radius[]                 │
│  3. Find largest i where i - radius[i] == 0        │
│     (palindrome starts at beginning)               │
│  4. Convert back to original string indices        │
│  5. Return prefix s[0:max_len]                     │
└─────────────────────────────────────────────────────┘
```

**When to use**: Shortest palindrome by adding characters to end.

---

## Forms

Different manifestations of the Manacher's pattern.

### Form 1: Longest Palindromic Substring

Find the single longest palindrome in a string.

| Aspect | Value | Notes |
|--------|-------|-------|
| Time | O(n) | Linear scan |
| Space | O(n) | Radius array |
| Output | Substring + indices | Convert from transformed |

### Form 2: Count All Palindromic Substrings

Count how many palindromic substrings exist.

| Position Type | Contribution | Formula |
|---------------|--------------|---------|
| At character | Odd-length | `radius[i] // 2 + 1` |
| At `#` | Even-length | `radius[i] // 2` |
| Total | Sum all contributions | `sum(radius[i] + 1) // 2` |

### Form 3: Longest Palindromic Subsequence

Note: Manacher finds substrings, not subsequences. For subsequences, use DP.

```
DP approach for subsequence:
dp[i][j] = dp[i+1][j-1] + 2 if s[i] == s[j]
         = max(dp[i+1][j], dp[i][j-1]) otherwise
```

### Form 4: Palindrome Queries

After preprocessing, answer queries about palindromes.

| Query | Preprocessing | Query Time |
|-------|---------------|------------|
| Is s[i:j] palindrome? | Manacher + radius | O(1) |
| Longest palindrome at i? | Manacher | O(1) |
| Count palindromes in range? | Prefix sums on radius | O(1) |

### Form 5: Circular Palindromes

Find longest palindrome in circular string.

```
Technique: Duplicate string: "abc" → "abcabc"
Apply Manacher's
Adjust for wrap-around
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Efficient String Transformation

```python
def transform_string(s: str) -> str:
    """
    Transform string for Manacher's algorithm.
    Ensures every position can be a palindrome center.
    """
    # Efficient transformation using join
    return '#' + '#'.join(s) + '#'


# Alternative for character-by-character processing
def transform_manual(s: str) -> list[str]:
    """Manual transformation returning list."""
    result = ['#']
    for c in s:
        result.append(c)
        result.append('#')
    return result
```

### Tactic 2: Converting Back to Original Indices

```python
def transformed_to_original(transformed_pos: int, radius: int) -> tuple[int, int]:
    """
    Convert transformed string coordinates to original string indices.
    
    Returns: (start_index, length) in original string
    """
    # Start in original string
    start = (transformed_pos - radius) // 2
    # Length in original string
    length = radius
    return start, length


def get_original_substring(s: str, transformed_pos: int, radius: int) -> str:
    """Extract the palindrome substring from original string."""
    start, length = transformed_to_original(transformed_pos, radius)
    return s[start:start + length]
```

### Tactic 3: Counting Palindromes Efficiently

```python
def count_palindromes_fast(s: str) -> int:
    """
    Count all palindromic substrings in O(n) time.
    Uses Manacher's radius array.
    """
    if not s:
        return 0
    
    # Transform and get radius
    t = '#' + '#'.join(s) + '#'
    n = len(t)
    radius = [0] * n
    center = right = 0
    
    for i in range(n):
        if i < right:
            mirror = 2 * center - i
            radius[i] = min(right - i, radius[mirror])
        
        # Expand
        while i - radius[i] - 1 >= 0 and i + radius[i] + 1 < n \
              and t[i - radius[i] - 1] == t[i + radius[i] + 1]:
            radius[i] += 1
        
        if i + radius[i] > right:
            center, right = i, i + radius[i]
    
    # Count palindromes
    # Each radius[i] means (radius[i] + 1) palindromes centered at i
    # But this counts each palindrome twice (once in transformed string)
    # And includes single delimiters as "palindromes"
    count = sum((r + 1) // 2 for r in radius)
    return count
```

### Tactic 4: Finding All Palindrome Centers

```python
def find_all_palindrome_centers(s: str) -> list[tuple[int, int]]:
    """
    Find all palindrome centers with their maximum radii.
    Returns list of (center_position, radius) tuples.
    """
    if not s:
        return []
    
    t = '#' + '#'.join(s) + '#'
    n = len(t)
    radius = [0] * n
    center = right = 0
    centers = []
    
    for i in range(n):
        if i < right:
            mirror = 2 * center - i
            radius[i] = min(right - i, radius[mirror])
        
        while i - radius[i] - 1 >= 0 and i + radius[i] + 1 < n \
              and t[i - radius[i] - 1] == t[i + radius[i] + 1]:
            radius[i] += 1
        
        if i + radius[i] > right:
            center, right = i, i + radius[i]
        
        if radius[i] > 0:
            centers.append((i, radius[i]))
    
    return centers
```

### Tactic 5: Manacher's vs Expand-Around-Center Decision

```python
def choose_palindrome_algorithm(s: str) -> str:
    """
    Decide which algorithm to use based on input characteristics.
    """
    n = len(s)
    
    # Use Manacher's for large inputs or when O(n) is critical
    if n > 10000:
        return "manacher"
    
    # Use expand-around-center for simplicity on small inputs
    if n < 1000:
        return "expand_around_center"
    
    # Consider expected number of palindromes
    # If many palindromes expected, Manacher's efficiency matters more
    return "manacher"  # Default to efficient algorithm
```

---

## Python Templates

### Template 1: Standard Manacher's Algorithm (Longest Palindrome)

```python
def manacher_longest_palindrome(s: str) -> str:
    """
    Find the longest palindromic substring using Manacher's Algorithm.
    
    Args:
        s: Input string
    
    Returns:
        The longest palindromic substring
    
    Time: O(n)
    Space: O(n)
    """
    if not s:
        return ""
    
    # Transform string: "abc" -> "#a#b#c#"
    transformed = '#' + '#'.join(s) + '#'
    n = len(transformed)
    
    # Radius array: radius[i] = radius of palindrome centered at i
    radius = [0] * n
    center = right = 0
    max_len = max_center = 0
    
    for i in range(n):
        # If i is within the current palindrome, use mirror
        if i < right:
            mirror = 2 * center - i
            radius[i] = min(right - i, radius[mirror])
        
        # Expand around center i
        while i - radius[i] - 1 >= 0 and i + radius[i] + 1 < n:
            if transformed[i - radius[i] - 1] == transformed[i + radius[i] + 1]:
                radius[i] += 1
            else:
                break
        
        # Update center and right if we found a larger palindrome
        if i + radius[i] > right:
            center = i
            right = i + radius[i]
        
        # Track maximum
        if radius[i] > max_len:
            max_len = radius[i]
            max_center = i
    
    # Convert back to original string indices
    start = (max_center - max_len) // 2
    return s[start:start + max_len]
```

### Template 2: Manacher's with Indices (Start and End)

```python
def manacher_with_indices(s: str) -> tuple[str, int, int]:
    """
    Find longest palindromic substring with start and end indices.
    
    Args:
        s: Input string
    
    Returns:
        Tuple of (palindrome, start_index, end_index)
        end_index is inclusive
    
    Time: O(n)
    Space: O(n)
    """
    if not s:
        return "", -1, -1
    
    transformed = '#' + '#'.join(s) + '#'
    n = len(transformed)
    radius = [0] * n
    center = right = 0
    max_len = max_center = 0
    
    for i in range(n):
        if i < right:
            mirror = 2 * center - i
            radius[i] = min(right - i, radius[mirror])
        
        while i - radius[i] - 1 >= 0 and i + radius[i] + 1 < n:
            if transformed[i - radius[i] - 1] == transformed[i + radius[i] + 1]:
                radius[i] += 1
            else:
                break
        
        if i + radius[i] > right:
            center = i
            right = i + radius[i]
        
        if radius[i] > max_len:
            max_len = radius[i]
            max_center = i
    
    # Convert to original indices
    start = (max_center - max_len) // 2
    end = start + max_len - 1
    
    return s[start:start + max_len], start, end
```

### Template 3: Count All Palindromic Substrings

```python
def count_palindromic_substrings(s: str) -> int:
    """
    Count all palindromic substrings in s.
    
    Args:
        s: Input string
    
    Returns:
        Number of palindromic substrings
    
    Time: O(n)
    Space: O(n)
    """
    if not s:
        return 0
    
    transformed = '#' + '#'.join(s) + '#'
    n = len(transformed)
    radius = [0] * n
    center = right = 0
    
    for i in range(n):
        if i < right:
            mirror = 2 * center - i
            radius[i] = min(right - i, radius[mirror])
        
        while i - radius[i] - 1 >= 0 and i + radius[i] + 1 < n:
            if transformed[i - radius[i] - 1] == transformed[i + radius[i] + 1]:
                radius[i] += 1
            else:
                break
        
        if i + radius[i] > right:
            center = i
            right = i + radius[i]
    
    # Each radius[i] gives (radius[i] + 1) / 2 palindromes
    # Integer division accounts for transformed string structure
    count = sum((r + 1) // 2 for r in radius)
    return count
```

### Template 4: Check if Substring is Palindrome (After Preprocessing)

```python
class PalindromeQuery:
    """
    Preprocess string to answer palindrome queries in O(1).
    """
    
    def __init__(self, s: str):
        self.s = s
        self.transformed = '#' + '#'.join(s) + '#'
        self.n = len(self.transformed)
        self.radius = [0] * self.n
        
        # Run Manacher's
        center = right = 0
        for i in range(self.n):
            if i < right:
                mirror = 2 * center - i
                self.radius[i] = min(right - i, self.radius[mirror])
            
            while i - self.radius[i] - 1 >= 0 and i + self.radius[i] + 1 < self.n:
                if self.transformed[i - self.radius[i] - 1] == \
                   self.transformed[i + self.radius[i] + 1]:
                    self.radius[i] += 1
                else:
                    break
            
            if i + self.radius[i] > right:
                center, right = i, i + self.radius[i]
    
    def is_palindrome(self, start: int, end: int) -> bool:
        """
        Check if s[start:end+1] is a palindrome.
        
        Args:
            start: Start index in original string (inclusive)
            end: End index in original string (inclusive)
        
        Returns:
            True if substring is palindrome
        """
        length = end - start + 1
        # Center in transformed string
        center = 2 * start + length
        # Required radius
        required_radius = length
        
        return self.radius[center] >= required_radius
```

### Template 5: Longest Palindromic Prefix

```python
def longest_palindromic_prefix(s: str) -> str:
    """
    Find the longest prefix that is a palindrome.
    Used in shortest palindrome problems.
    
    Args:
        s: Input string
    
    Returns:
        Longest palindromic prefix
    """
    if not s:
        return ""
    
    transformed = '#' + '#'.join(s) + '#'
    n = len(transformed)
    radius = [0] * n
    center = right = 0
    max_prefix_len = 0
    
    for i in range(n):
        if i < right:
            mirror = 2 * center - i
            radius[i] = min(right - i, radius[mirror])
        
        while i - radius[i] - 1 >= 0 and i + radius[i] + 1 < n:
            if transformed[i - radius[i] - 1] == transformed[i + radius[i] + 1]:
                radius[i] += 1
            else:
                break
        
        if i + radius[i] > right:
            center = i
            right = i + radius[i]
        
        # Check if this palindrome starts at beginning
        # In transformed: position 0 is '#', so palindrome start is at 0
        if i - radius[i] == 0:
            # Convert to original string length
            orig_len = radius[i]
            max_prefix_len = max(max_prefix_len, orig_len)
    
    return s[:max_prefix_len]


def shortest_palindrome(s: str) -> str:
    """
    Find shortest palindrome by adding characters in front.
    Uses longest palindromic prefix.
    """
    if not s:
        return ""
    
    prefix = longest_palindromic_prefix(s)
    suffix = s[len(prefix):]
    return suffix[::-1] + s
```

---

## When to Use

Use Manacher's Algorithm when you need to solve problems involving:

- **Longest Palindromic Substring**: Finding the longest palindrome in a string
- **Palindrome Counting**: Counting all palindromic substrings efficiently
- **Multiple Palindrome Queries**: Answering many palindrome-related queries
- **Large Input Strings**: When O(n²) approaches are too slow (n > 10^5)

### Comparison with Alternatives

| Approach | Time Complexity | Space | Best For |
|----------|----------------|-------|----------|
| **Manacher's Algorithm** | O(n) | O(n) | Large inputs, guaranteed linear time |
| **Expand Around Center** | O(n²) | O(1) | Simple cases, small inputs |
| **Dynamic Programming** | O(n²) | O(n²) | When you need all palindrome info |
| **Suffix Tree/Array** | O(n) | O(n) | Multiple complex string queries |

### When to Choose Manacher's vs Expand Around Center

- **Choose Manacher's** when:
  - You need guaranteed O(n) time complexity
  - Input strings are large (10^5+ characters)
  - You need to solve multiple palindrome queries on the same string
  - Performance is critical

- **Choose Expand Around Center** when:
  - Simplicity is preferred over efficiency
  - Input strings are small (< 1000 characters)
  - You only need one palindrome answer
  - Memory is extremely constrained

---

## Algorithm Explanation

### Core Concept

The key insight behind Manacher's Algorithm is the **palindromic mirror property**: For any palindrome, the substring to the left of its center is a mirror image of the substring to the right. This symmetry allows us to reuse information about previously computed palindromes.

### How It Works

#### String Transformation:
Transform original string to handle both odd and even length palindromes uniformly:
- Original: `"abc"` → Transformed: `"#a#b#c#"`
- Original: `"abba"` → Transformed: `"#a#b#b#a#"`

This ensures every character (and every gap between characters) can serve as a palindrome center.

#### The Algorithm:

1. **Initialize**: Create transformed string `t = "#" + "#".join(s) + "#"`
2. **Maintain State**:
   - `radius[i]` = radius of palindrome centered at position i
   - `center` = center of the rightmost palindrome
   - `right` = right boundary of that palindrome

3. **For each position i**:
   - **If i ≤ right**: Use mirror position `mirror = 2*center - i`
     - `radius[i] = min(right - i, radius[mirror])`
   - **Attempt expansion**: Expand around i while characters match
   - **Update**: If new palindrome extends past `right`, update `center` and `right`

### Visual Representation

For string `"babad"`:

```
Transformed: # b # a # b # a # d #
Position:     0 1 2 3 4 5 6 7 8 9 10

Processing:
- i=1: radius=1 (#b#) - expand from here
- i=3: radius=3 (#b#a#b#) - palindrome "bab" found
- i=5: radius=1 (#b#) - uses mirror optimization
- i=7: radius=1 (#a#) - uses mirror optimization

Final radius array: [0,1,0,3,0,1,0,1,0,1,0]
```

### Why It Works in O(n)

The algorithm achieves linear time because:
1. **Mirror optimization**: When inside a known palindrome, we can skip comparisons
2. **Each position is expanded at most once**: After expansion, the right boundary moves right
3. **Total expansions ≤ n**: The right boundary moves at most n positions total

### Limitations

- **Space complexity**: Requires O(n) extra space for the radius array
- **Transformed string**: Doubles the input size (constant factor overhead)
- **Not online**: Requires the entire string upfront
- **Substring only**: Finds palindromic substrings, not subsequences

---

## Practice Problems

### Problem 1: Longest Palindromic Substring

**Problem:** [LeetCode 5 - Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)

**Description:** Given a string `s`, return the longest palindromic substring in `s`.

**How to Apply Manacher's:**
- Transform string with delimiters
- Use the standard algorithm to find maximum radius
- Convert back to original string indices
- Time: O(n), Space: O(n)

---

### Problem 2: Palindromic Substrings

**Problem:** [LeetCode 647 - Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/)

**Description:** Given a string `s`, return the number of palindromic substrings in it.

**How to Apply Manacher's:**
- Run Manacher's algorithm to get radius array
- Each position i contributes `(radius[i] + 1) // 2` palindromes
- Sum all contributions for final count
- Time: O(n), Space: O(n)

---

### Problem 3: Longest Palindromic Subsequence

**Problem:** [LeetCode 516 - Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/)

**Description:** Given a string `s`, return the length of the longest palindromic subsequence.

**How to Apply Manacher's:**
- Note: Manacher finds substrings, not subsequences
- Use DP approach: `dp[i][j] = dp[i+1][j-1] + 2` if s[i] == s[j]
- Alternative: Adapt Manacher concepts for subsequence version

---

### Problem 4: Shortest Palindrome

**Problem:** [LeetCode 214 - Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/)

**Description:** Given a string `s`, you can add characters in front of it to make it a palindrome. Return the shortest palindrome you can find.

**How to Apply Manacher's:**
- Find longest palindromic prefix using Manacher's
- Reverse the remaining suffix and prepend to original
- The result is the shortest possible palindrome

---

### Problem 5: Count Different Palindromic Subsequences

**Problem:** [LeetCode 730 - Count Different Palindromic Subsequences](https://leetcode.com/problems/count-different-palindromic-subsequences/)

**Description:** Given a string s, return the number of different non-empty palindromic subsequences in s.

**How to Apply Manacher's:**
- This is a subsequence problem, not a substring problem
- Use DP approach with character tracking
- Manacher's provides insight into palindrome structure but isn't directly applicable

---

## Video Tutorial Links

### Fundamentals

- [Manacher's Algorithm - Longest Palindromic Substring (Take U Forward)](https://www.youtube.com/watch?v=nbCL-15Eccs) - Comprehensive introduction
- [Manacher's Algorithm Explained (WilliamFiset)](https://www.youtube.com/watch?v=NS2UwH9bFqw) - Detailed explanation with visualizations
- [Palindrome Problems (NeetCode)](https://www.youtube.com/watch?v=4ykp9P8r3w0) - Multiple palindrome problem patterns

### Advanced Topics

- [Counting Palindromes](https://www.youtube.com/watch?v=yY2uR6XUJJE) - Counting all palindromic substrings
- [Palindrome Variations](https://www.youtube.com/watch?v=6U7wlZVG0yw) - Different palindrome problems
- [Manacher vs Other Approaches](https://www.youtube.com/watch?v=3ifS-IZz8qE) - Comparing different palindrome algorithms

---

## Follow-up Questions

### Q1: Why do we use '#' as a delimiter in Manacher's Algorithm?

**Answer:** The '#' delimiter serves several purposes:
- **Handles both odd and even**: Every position can be a center (character positions for odd, # positions for even)
- **Avoids boundary issues**: No need to check for string boundaries separately during expansion
- **Unique character**: '#' won't appear in typical input strings, preventing conflicts
- **Symmetry**: The transformed string maintains palindrome properties uniformly

Any character that doesn't appear in the input can be used as a delimiter.

---

### Q2: Can Manacher's Algorithm be used for circular strings?

**Answer:** Yes, with modifications:
- Duplicate the string: For string "abc", use "abcabc"
- Apply Manacher's to the duplicated version
- Adjust for wrap-around cases when extracting results
- This is useful for problems like "longest palindromic substring in a circular string"
- Time complexity remains O(n) but with a larger constant factor

---

### Q3: What is the difference between Manacher's and expand-around-center?

**Answer:**

| Aspect | Manacher's | Expand Around Center |
|--------|------------|---------------------|
| Time | O(n) | O(n²) |
| Space | O(n) | O(1) |
| Implementation | More complex | Simpler |
| Reuses info | Yes (mirror property) | No |
| Best for | Large inputs | Small inputs |
| Preprocessing | Required | None |

Manacher's precomputes radii for all positions, enabling O(1) palindrome checks after preprocessing. Expand-around-center recomputes for each center independently.

---

### Q4: How would you modify Manacher's to find the shortest palindromic addition?

**Answer:** 
- Find the longest palindromic prefix using Manacher's
- The suffix after this prefix needs to be reversed and prepended
- Example: s = "aacecaaa", longest palindromic prefix = "aacecaa"
- Suffix = "a", reversed = "a", result = "a" + "aacecaaa" = "aaacecaaa"

This approach uses the fact that making the longest prefix a palindrome requires adding the minimum number of characters.

---

### Q5: Can Manacher's Algorithm be parallelized?

**Answer:** Not easily, because:
- The algorithm has inherent sequential dependencies between positions
- Each calculation may depend on previously computed center and right boundary
- The mirror optimization requires knowing the current rightmost palindrome
- However, the expansion phase within a single position could theoretically be parallelized
- For very long strings, consider chunking with overlap or approximate algorithms

---

## Summary

Manacher's Algorithm is an elegant solution for palindrome-related problems with **O(n) time complexity**. Key takeaways:

- **Linear time**: Beats O(n²) brute-force approaches
- **Single pass**: Processes entire string in one iteration
- **Mirror property**: Reuses information from known palindromes
- **Uniform handling**: Transformed string handles both odd and even palindromes
- **Versatile**: Can be adapted for counting, shortest palindrome, and queries

When to use:
- ✅ Finding longest palindromic substring
- ✅ Counting all palindromic substrings  
- ✅ When input size is large (10^5+ characters)
- ✅ Multiple palindrome queries on same string

When not to use:
- ❌ Simple cases where expand-around-center suffices
- ❌ When space is extremely constrained (need O(1) space)
- ❌ Finding palindromic subsequences (use DP instead)

This algorithm is essential for competitive programming and technical interviews, especially in string manipulation and palindrome-related problems.
