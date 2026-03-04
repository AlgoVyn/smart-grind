# Manacher's Algorithm

## Category
Advanced

## Description

Manacher's Algorithm finds the longest palindromic substring in linear **O(n)** time. It solves both odd-length and even-length palindromes uniformly by transforming the string and using the concept of "palindromic radius".

The algorithm uses a transformed string with special delimiters (e.g., `"#a#b#c#"`) to handle both odd and even length palindromes uniformly. It maintains:
- **`center`**: The center of the rightmost palindrome discovered
- **`right`**: The right boundary of that palindrome  
- **`radius[i]`**: The radius of palindrome centered at position i

For each position, it either:
1. Uses previously computed values to skip comparisons (if within current palindrome)
2. Expands outward to find the palindrome radius
3. Updates center and right boundary if the new palindrome extends further

The key insight is that palindromes reflect around their center, so information from known palindromes can be reused.

---

## When to Use

Use Manacher's Algorithm when you need to solve problems involving:

- **Longest Palindromic Substring**: Find the longest palindrome in a string
- **Palindrome Counting**: Count all palindromic substrings
- **Palindromic Substrings**: Find all palindromic substrings
- **Palindrome Queries**: Answer palindrome-related queries efficiently

### Comparison with Alternatives

| Approach | Time Complexity | Space | Best For |
|----------|----------------|-------|----------|
| **Manacher's Algorithm** | O(n) | O(n) | Single pass, guaranteed linear time |
| **Expand Around Center** | O(n²) | O(1) | Simple cases, small inputs |
| **Dynamic Programming** | O(n²) | O(n²) | When you need all palindromes |
| **Suffix Tree** | O(n) | O(n) | Multiple palindrome queries |

### When to Choose Manacher's vs Expand Around Center

- **Choose Manacher's** when:
  - You need guaranteed O(n) time complexity
  - Input strings are large (10^5+ characters)
  - You need to solve multiple palindrome queries

- **Choose Expand Around Center** when:
  - Simplicity is preferred over efficiency
  - Input strings are small
  - You only need one palindrome answer

---

## Algorithm Explanation

### Core Concept

The key insight behind Manacher's Algorithm is the **palindromic mirror property**: For any palindrome, the substring to the left of its center is a mirror image of the substring to the right. This symmetry allows us to reuse information about previously computed palindromes.

### How It Works

#### String Transformation:
Transform original string to the handle both odd and even length palindromes uniformly:
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
Position:     0 1 2 3 4 5 6 7 8 9

Processing:
- i=1: radius=1 (#b#) - expand from here
- i=3: radius=3 (#b#a#b#) - palindrome "bab" found
- i=5: radius=1 (#b#) - still within right boundary
- Final radius array: [0,1,0,3,0,1,0,0,0,0]
```

### Why It Works in O(n)

The algorithm achieves linear time because:
1. **Mirror optimization**: When inside a known palindrome, we can skip comparison
2. **Each position is expanded at most once**: After expansion, the right boundary moves right
3. **Total expansions ≤ n**: The right boundary moves at most n positions total

### Limitations

- **Space complexity**: Requires O(n) extra space for the radius array
- **Transformed string**: Doubles the input size (though this is constant factor)
- **Not online**: Requires the entire string upfront

---

## Algorithm Steps

### Finding Longest Palindromic Substring

1. **Transform the string**: Add delimiters between characters
   - `"abc"` → `"#a#b#c#"`

2. **Initialize variables**:
   - `radius = [0] * n` (n = length of transformed string)
   - `center = right = 0`
   - `max_len = max_start = 0`

3. **Iterate through each position**:
   - Calculate mirror position if within right boundary
   - Use minimum of (right - i) and mirror's radius
   - Attempt to expand beyond current radius
   - Update center and right if new palindrome extends further
   - Track maximum length found

4. **Extract result**: Convert from transformed coordinates to original string indices

### Counting All Palindromic Substrings

1. **Run standard Manacher's** to get radius array
2. **For each position i**:
   - Odd-length: radius[i] gives count of odd palindromes centered here
   - Even-length: Check adjacent positions for even-length palindromes

---

## Implementation

### Template Code (Longest Palindromic Substring)

````carousel
```python
def manacher(s: str) -> tuple:
    """
    Find the longest palindromic substring using Manacher's Algorithm.
    
    Args:
        s: Input string
        
    Returns:
        Tuple of (longest_palindrome, start_index, end_index)
        
    Time: O(n)
    Space: O(n)
    """
    if not s:
        return "", -1, -1
    
    # Transform string: "abc" -> "#a#b#c#"
    # This handles both odd and even length palindromes
    transformed = '#' + '#'.join(s) + '#'
    n = len(transformed)
    
    # Radius array: radius[i] = radius of palindrome centered at i
    radius = [0] * n
    center = right = 0
    max_len = max_start = 0
    
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
            max_start = (i - radius[i]) // 2
    
    return s[max_start:max_start + max_len], max_start, max_start + max_len - 1


def manacher_lengths(s: str) -> list:
    """
    Return the length of longest palindrome ending at each position.
    
    Args:
        s: Input string
        
    Returns:
        List of maximum palindrome lengths
        
    Time: O(n)
    Space: O(n)
    """
    if not s:
        return []
    
    # Transform string
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
    
    # Convert radius to actual palindrome lengths in original string
    lengths = []
    for i in range(n):
        if transformed[i] == '#':
            # Even length palindrome
            lengths.append(radius[i] // 2 * 2)
        else:
            # Odd length palindrome
            lengths.append((radius[i] // 2) * 2 + 1)
    
    return lengths


# Example usage
if __name__ == "__main__":
    # Test case 1
    s = "babad"
    palindrome, start, end = manacher(s)
    print(f"String: '{s}'")
    print(f"Longest palindrome: '{palindrome}' ({start}-{end})")  # "bab" or "aba"
    
    # Test case 2
    s = "cbbd"
    palindrome, start, end = manacher(s)
    print(f"\nString: '{s}'")
    print(f"Longest palindrome: '{palindrome}' ({start}-{end})")  # "bb"
    
    # Test case 3
    s = "a"
    palindrome, start, end = manacher(s)
    print(f"\nString: '{s}'")
    print(f"Longest palindrome: '{palindrome}'")  # "a"
    
    # Test case 4
    s = "racecar"
    palindrome, start, end = manacher(s)
    print(f"\nString: '{s}'")
    print(f"Longest palindrome: '{palindrome}'")  # "racecar"
    
    # Test case 5 - Even length
    s = "abacdfgdcaba"
    palindrome, start, end = manacher(s)
    print(f"\nString: '{s}'")
    print(f"Longest palindrome: '{palindrome}'")  # "aba" (at beginning and end)
    
    # Test case 6
    s = "noon"
    palindrome, start, end = manacher(s)
    print(f"\nString: '{s}'")
    print(f"Longest palindrome: '{palindrome}'")  # "noon"
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

/**
 * Manacher's Algorithm for finding longest palindromic substring.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
class Manacher {
private:
    string transformed;
    vector<int> radius;
    int n;
    
public:
    Manacher(const string& s) {
        if (s.empty()) {
            n = 0;
            return;
        }
        
        // Transform: "abc" -> "#a#b#c#"
        transformed = "#";
        for (char c : s) {
            transformed += c;
            transformed += '#';
        }
        n = transformed.length();
        
        // Find longest palindrome
        radius.assign(n, 0);
        int center = 0, right = 0;
        
        for (int i = 0; i < n; i++) {
            // Use mirror if within right boundary
            if (i < right) {
                int mirror = 2 * center - i;
                radius[i] = min(right - i, radius[mirror]);
            }
            
            // Expand around center
            while (i - radius[i] - 1 >= 0 && i + radius[i] + 1 < n &&
                   transformed[i - radius[i] - 1] == transformed[i + radius[i] + 1]) {
                radius[i]++;
            }
            
            // Update center and right
            if (i + radius[i] > right) {
                center = i;
                right = i + radius[i];
            }
        }
    }
    
    /**
     * Get the longest palindromic substring.
     * Returns: pair of (substring, start_index)
     */
    pair<string, int> longestPalindrome() const {
        if (n == 0) return {"", -1};
        
        int maxLen = 0, maxStart = 0;
        for (int i = 0; i < n; i++) {
            if (radius[i] > maxLen) {
                maxLen = radius[i];
                maxStart = (i - radius[i]) / 2;
            }
        }
        
        // Convert start position to original string
        string original = transformed;
        // Extract from original positions
        return {"", maxStart};
    }
    
    /**
     * Get all palindrome lengths at each position.
     */
    vector<int> getPalindromeLengths() const {
        vector<int> lengths;
        for (int i = 0; i < n; i++) {
            if (transformed[i] == '#') {
                lengths.push_back(radius[i] / 2 * 2);  // Even
            } else {
                lengths.push_back(radius[i] / 2 * 2 + 1);  // Odd
            }
        }
        return lengths;
    }
};

int main() {
    // Test cases
    vector<string> testCases = {"babad", "cbbd", "racecar", "a", "noon"};
    
    for (const string& s : testCases) {
        Manacher m(s);
        auto [pal, start] = m.longestPalindrome();
        cout << "String: \"" << s << "\"" << endl;
        cout << "Longest palindrome found" << endl;
        cout << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * Manacher's Algorithm for finding longest palindromic substring.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
public class Manacher {
    private String transformed;
    private int[] radius;
    private int n;
    
    public Manacher(String s) {
        if (s == null || s.isEmpty()) {
            n = 0;
            return;
        }
        
        // Transform: "abc" -> "#a#b#c#"
        StringBuilder sb = new StringBuilder("#");
        for (char c : s.toCharArray()) {
            sb.append(c).append('#');
        }
        transformed = sb.toString();
        n = transformed.length();
        
        // Find longest palindrome
        radius = new int[n];
        int center = 0, right = 0;
        
        for (int i = 0; i < n; i++) {
            // Use mirror if within right boundary
            if (i < right) {
                int mirror = 2 * center - i;
                radius[i] = Math.min(right - i, radius[mirror]);
            }
            
            // Expand around center
            while (i - radius[i] - 1 >= 0 && 
                   i + radius[i] + 1 < n &&
                   transformed.charAt(i - radius[i] - 1) == 
                   transformed.charAt(i + radius[i] + 1)) {
                radius[i]++;
            }
            
            // Update center and right
            if (i + radius[i] > right) {
                center = i;
                right = i + radius[i];
            }
        }
    }
    
    /**
     * Get the longest palindromic substring.
     * Returns: array of [substring, startIndex, endIndex]
     */
    public String[] longestPalindrome() {
        if (n == 0) return new String[]{"", "-1", "-1"};
        
        int maxLen = 0, maxStart = 0;
        for (int i = 0; i < n; i++) {
            if (radius[i] > maxLen) {
                maxLen = radius[i];
                maxStart = (i - radius[i]) / 2;
            }
        }
        
        return new String[]{
            "",  // substring would need original string reference
            String.valueOf(maxStart),
            String.valueOf(maxStart + maxLen - 1)
        };
    }
    
    /**
     * Get all palindrome lengths at each position.
     */
    public int[] getPalindromeLengths() {
        int[] lengths = new int[n];
        for (int i = 0; i < n; i++) {
            if (transformed.charAt(i) == '#') {
                lengths[i] = (radius[i] / 2) * 2;  // Even
            } else {
                lengths[i] = (radius[i] / 2) * 2 + 1;  // Odd
            }
        }
        return lengths;
    }
    
    public static void main(String[] args) {
        String[] testCases = {"babad", "cbbd", "racecar", "a", "noon"};
        
        for (String s : testCases) {
            Manacher m = new Manacher(s);
            System.out.println("String: \"" + s + "\"");
            System.out.println("Longest palindrome found");
            System.out.println();
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Manacher's Algorithm for finding longest palindromic substring.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function manacher(s) {
    if (!s || s.length === 0) {
        return { palindrome: "", start: -1, end: -1 };
    }
    
    // Transform: "abc" -> "#a#b#c#"
    let transformed = '#';
    for (let i = 0; i < s.length; i++) {
        transformed += s[i] + '#';
    }
    const n = transformed.length;
    
    // Radius array
    const radius = new Array(n).fill(0);
    let center = 0, right = 0;
    let maxLen = 0, maxStart = 0;
    
    for (let i = 0; i < n; i++) {
        // Use mirror if within right boundary
        if (i < right) {
            const mirror = 2 * center - i;
            radius[i] = Math.min(right - i, radius[mirror]);
        }
        
        // Expand around center
        while (i - radius[i] - 1 >= 0 && 
               i + radius[i] + 1 < n &&
               transformed[i - radius[i] - 1] === transformed[i + radius[i] + 1]) {
            radius[i]++;
        }
        
        // Update center and right
        if (i + radius[i] > right) {
            center = i;
            right = i + radius[i];
        }
        
        // Track maximum
        if (radius[i] > maxLen) {
            maxLen = radius[i];
            maxStart = Math.floor((i - radius[i]) / 2);
        }
    }
    
    return {
        palindrome: s.slice(maxStart, maxStart + maxLen),
        start: maxStart,
        end: maxStart + maxLen - 1
    };
}

/**
 * Get palindrome lengths at each position.
 */
function manacherLengths(s) {
    if (!s || s.length === 0) return [];
    
    // Transform
    let transformed = '#';
    for (let i = 0; i < s.length; i++) {
        transformed += s[i] + '#';
    }
    const n = transformed.length;
    
    const radius = new Array(n).fill(0);
    let center = 0, right = 0;
    
    for (let i = 0; i < n; i++) {
        if (i < right) {
            const mirror = 2 * center - i;
            radius[i] = Math.min(right - i, radius[mirror]);
        }
        
        while (i - radius[i] - 1 >= 0 && 
               i + radius[i] + 1 < n &&
               transformed[i - radius[i] - 1] === transformed[i + radius[i] + 1]) {
            radius[i]++;
        }
        
        if (i + radius[i] > right) {
            center = i;
            right = i + radius[i];
        }
    }
    
    // Convert to actual lengths
    const lengths = [];
    for (let i = 0; i < n; i++) {
        if (transformed[i] === '#') {
            lengths.push(Math.floor(radius[i] / 2) * 2);
        } else {
            lengths.push(Math.floor(radius[i] / 2) * 2 + 1);
        }
    }
    
    return lengths;
}

// Test examples
const testCases = ["babad", "cbbd", "racecar", "a", "noon"];

for (const s of testCases) {
    const result = manacher(s);
    console.log(`String: '${s}'`);
    console.log(`Longest palindrome: '${result.palindrome}' (${result.start}-${result.end})`);
    console.log();
}
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Preprocessing** | O(n) | Single pass through string |
| **Query (longest palindrome)** | O(1) | After preprocessing, just read from radius array |
| **All palindrome lengths** | O(n) | Iterate through radius array |
| **Space** | O(n) | Store transformed string and radius array |

### Detailed Breakdown

- **String transformation**: O(n) - need to insert delimiters
- **Main algorithm loop**: O(n) - each position is processed once
  - Mirror calculation: O(1) per position
  - Expansion: Each character is matched at most once (when right boundary moves)
  - Total expansions: ≤ n

---

## Space Complexity Analysis

- **Transformed string**: O(2n + 1) = O(n) - adds # between each character
- **Radius array**: O(n) - stores palindrome radius for each position
- **Auxiliary variables**: O(1) - center, right, maxLen, etc.
- **Total**: O(n)

### Space Optimization (Optional)

For very large strings, consider:
1. **In-place transformation**: Work directly with original string indices
2. **Character array**: Use array instead of string for transformed version
3. **Rolling computation**: If only longest palindrome needed, don't store all radii

---

## Common Variations

### 1. Longest Palindromic Substring (Standard)

Returns the longest palindromic substring and its position.

````carousel
```python
def longest_palindrome(s: str) -> str:
    """Find the longest palindromic substring."""
    if not s:
        return ""
    
    transformed = '#' + '#'.join(s) + '#'
    n = len(transformed)
    radius = [0] * n
    center = right = 0
    max_len = max_start = 0
    
    for i in range(n):
        if i < right:
            radius[i] = min(right - i, radius[2 * center - i])
        
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
            max_start = (i - radius[i]) // 2
    
    return s[max_start:max_start + max_len]
```
````

### 2. Count All Palindromic Substrings

Count how many palindromic substrings exist in the string.

````carousel
```python
def count_palindromes(s: str) -> int:
    """Count all palindromic substrings."""
    if not s:
        return 0
    
    transformed = '#' + '#'.join(s) + '#'
    n = len(transformed)
    radius = [0] * n
    center = right = 0
    count = 0
    
    for i in range(n):
        if i < right:
            radius[i] = min(right - i, radius[2 * center - i])
        
        while i - radius[i] - 1 >= 0 and i + radius[i] + 1 < n:
            if transformed[i - radius[i] - 1] == transformed[i + radius[i] + 1]:
                radius[i] += 1
            else:
                break
        
        if i + radius[i] > right:
            center = i
            right = i + radius[i]
        
        # Each radius[i] gives (radius[i] + 1) palindromes
        count += radius[i] + 1
    
    # Adjust for transformed string
    return count // 2
```
````

### 3. Longest Palindromic Prefix

Find the longest prefix that is a palindrome.

````carousel
```python
def longest_palindromic_prefix(s: str) -> str:
    """Find the longest prefix that is a palindrome."""
    if not s:
        return ""
    
    transformed = s + '#' + s[::-1]
    n = len(transformed)
    pi = [0] * n
    
    # KMP prefix function
    for i in range(1, n):
        j = pi[i - 1]
        while j > 0 and transformed[i] != transformed[j]:
            j = pi[j - 1]
        if transformed[i] == transformed[j]:
            j += 1
        pi[i] = j
    
    return s[:pi[-1]]
```
````

### 4. Palindrome Pairs

Find all pairs of indices where substrings form palindromes.

````carousel
```python
def palindrome_pairs(words: list) -> list:
    """Find all pairs of indices where concatenation forms palindrome."""
    result = []
    word_dict = {word: i for i, word in enumerate(words)}
    
    for i, word in enumerate(words):
        # Check each possible split
        for j in range(len(word) + 1):
            left = word[:j]
            right = word[j:]
            
            # Case 1: left is palindrome, reversed right exists
            if left == left[::-1] and right[::-1] in word_dict:
                if word_dict[right[::-1]] != i:
                    result.append([word_dict[right[::-1]], i])
            
            # Case 2: right is palindrome, reversed left exists
            if right == right[::-1] and left[::-1] in word_dict:
                if word_dict[left[::-1]] != i:
                    result.append([i, word_dict[left[::-1]]])
    
    return result
```
````

---

## Practice Problems

### Problem 1: Longest Palindromic Substring

**Problem:** [LeetCode 5 - Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)

**Description:** Given a string `s`, return the longest palindromic substring in `s`.

**How to Apply Manacher's:**
- Transform string with delimiters
- Use the standard algorithm to find maximum radius
- Convert back to original string indices

---

### Problem 2: Palindromic Substrings

**Problem:** [LeetCode 647 - Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/)

**Description:** Given a string `s`, return the number of palindromic substrings in it.

**How to Apply Manacher's:**
- Run Manacher's algorithm to get radius array
- Each position i contributes (radius[i] + 1) palindromes
- Sum all contributions and divide by 2 for final count

---

### Problem 3: Longest Palindromic Subsequence

**Problem:** [LeetCode 516 - Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/)

**Description:** Given a string `s`, return the length of the longest palindromic subsequence.

**How to Apply Manacher's:**
- Note: Manacher finds substrings, not subsequences
- Use DP approach: `dp[i][j] = dp[i+1][j-1] + 2` if s[i] == s[j]
- Alternative: Use Manacher for substring version, adapt for subsequence

---

### Problem 4: Shortest Palindrome

**Problem:** [LeetCode 214 - Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/)

**Description:** Given a string `s`, you can add characters in front of it to make it a palindrome.

**How to Apply Manacher's:**
- Find longest palindromic prefix
- Reverse remaining suffix and prepend to original
- Alternatively: Use KMP on `s + '#' + reverse(s)`

---

### Problem 5: Palindrome Pairs

**Problem:** [LeetCode 336 - Palindrome Pairs](https://leetcode.com/problems/palindrome-pairs/)

**Description:** Given a list of unique words, find all pairs of indices where concatenation forms a palindrome.

**How to Apply Manacher's:**
- This problem uses a different approach (hash + palindrome check)
- For each word, check all possible split points
- Use Manacher's to quickly check if left/right part is palindrome

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
- **Handles both odd and even**: Every position can be a center
- **Avoids boundary issues**: No need to check for string boundaries separately
- **Unique character**: '#' won't appear in typical input strings
- **Symmetry**: The transformed string maintains palindrome properties

Any non-alphabetic character works as a delimiter.

### Q2: Can Manacher's Algorithm be used for circular strings?

**Answer:** Yes, with modifications:
- Duplicate the string: For string "abc", use "abcabc"
- Apply Manacher's to the duplicated version
- Adjust for wrap-around cases
- This is useful for problems like "longest palindromic substring in a circular string"

### Q3: What is the difference between Manacher's and expand-around-center?

**Answer:**
| Aspect | Manacher's | Expand Around Center |
|--------|-------------|---------------------|
| Time | O(n) | O(n²) |
| Space | O(n) | O(1) |
| Implementation | Complex | Simple |
| Reuses info | Yes | No |
| Best for | Large inputs | Small inputs |

Manacher's precomputes radii for all positions; expand-around-center recomputes for each center.

### Q4: How would you modify Manacher's to find the shortest palindromic addition?

**Answer:** 
- Find the longest palindromic prefix
- Reverse the remaining suffix
- Prepend the reversed suffix to the original string
- This gives the shortest palindrome that can be formed by adding characters to the front

### Q5: Can Manacher's Algorithm be parallelized?

**Answer:** Not easily, because:
- The algorithm has inherent dependencies between positions
- Each calculation may depend on previously computed values
- However, the expansion phase can potentially be parallelized
- For very long strings, consider chunking and merging results

---

## Summary

Manacher's Algorithm is an elegant solution for palindrome-related problems with **O(n) time complexity**. Key takeaways:

- **Linear time**: Beats O(n²) brute-force approaches
- **Single pass**: Processes entire string in one iteration
- **Mirror property**: Reuses information from known palindromes
- **Versatile**: Can be adapted for counting, shortest palindrome, etc.

When to use:
- ✅ Finding longest palindromic substring
- ✅ Counting all palindromic substrings  
- ✅ When input size is large (10^5+ characters)
- ✅ Multiple palindrome queries on same string

- ❌ Simple cases where expand-around-center suffices
- ❌ When space is extremely constrained

This algorithm is essential for competitive programming and technical interviews, especially in string manipulation and palindrome-related problems.

---

## Related Algorithms

- [Expand Around Center](./expand-center.md) - Simpler O(n²) approach
- [KMP String Matching](./kmp.md) - Similar preprocessing concept
- [Rolling Hash](./rolling-hash.md) - Another palindrome detection method
- [Dynamic Programming](./dp-basics.md) - Alternative for palindrome subsequence
