# Manacher's Algorithm

## Category
Advanced

## Description
Manacher's Algorithm finds the longest palindromic substring in linear O(n) time. It solves both odd-length and even-length palindromes by transforming the string and using the concept of "palindromic radius".

The algorithm uses a transformed string with special delimiters (e.g., "#a#b#c#") to handle both odd and even length palindromes uniformly. It maintains:
- `center`: The center of the rightmost palindrome discovered
- `right`: The right boundary of that palindrome  
- `radius[i]`: The radius of palindrome centered at position i

For each position, it either:
1. Uses previously computed values to skip comparisons (if within current palindrome)
2. Expands outward to find the palindrome radius
3. Updates center and right boundary if the new palindrome extends further

The key insight is that palindromes reflect around their center, so information from known palindromes can be reused.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- advanced related operations
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

```javascript
function manachers() {
    // Manacher's Algorithm implementation
    // Time: O(n)
    // Space: O(n)
}
```

---

## Example

**Input:**
```
s = "babad"
```

**Output:**
```
Longest palindrome: "bab" (or "aba")
Start: 0, End: 2
```

**Input:**
```
s = "cbbd"
```

**Output:**
```
Longest palindrome: "bb"
Start: 1, End: 2
```

**Input:**
```
s = "racecar"
```

**Output:**
```
Longest palindrome: "racecar"
```

---

## Time Complexity
**O(n)**

---

## Space Complexity
**O(n)**

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
