# String - Repeated Substring Pattern Detection

## Overview

The Repeated Substring Pattern Detection pattern is used to determine if a string can be constructed by repeating a smaller substring. This is a common problem in string processing with applications in data compression, bioinformatics (finding repeats in DNA sequences), and text analysis.

Given a string `s`, we need to determine if there exists a non-empty substring `t` such that `s` can be formed by concatenating `t` one or more times.

| Aspect | Description |
|--------|-------------|
| **Problem Type** | String Pattern Detection |
| **Key Insight** | A repeated pattern must have a length that divides the total string length |
| **Common Use** | Data compression, DNA sequence analysis, text preprocessing |

---

## Intuition

### Why Does This Work?

Consider the string `"ababab"`:

```
Input: "ababab"
Output: true (can be formed by repeating "ab")
```

The key observations are:

1. **Divisibility**: If `s = t + t + ... + t` (k times), then `len(t)` must divide `len(s)`
2. **Periodicity**: The string has a "period" - the smallest unit that repeats
3. **Substring Matching**: The repeating unit must match every segment of the string

**Example Breakdown**:
- `"abcabcabc"` → `"abc"` repeated 3 times
- `"zzzzzz"` → `"z"` repeated 6 times
- `"xyzxyz"` → `"xyz"` repeated 2 times

### Key Properties

- If a string has a repeated pattern, the pattern length is at most `n/2` where `n` is the string length
- The LPS (Longest Prefix Suffix) array from KMP can reveal the period
- String concatenation trick: `(s + s)[1:-1]` contains `s` if it's a repeated pattern

---

## Approach 1: Brute Force (Try All Divisors)

### Intuition

The most straightforward approach is to try every possible substring length that could form a repeating pattern. We only need to check lengths that divide the string length (from 1 to n/2).

### When to Use

- Simple implementation needed
- String length is small (< 10,000 characters)
- When simplicity is preferred over optimization

### Code Template

````carousel
```python
# Repeated Substring Pattern - Brute Force (Python)
def repeated_substring_pattern(s: str) -> bool:
    """
    Check if string can be formed by repeating a substring.
    
    Args:
        s: Input string to check
    
    Returns:
        True if s is a repeated substring pattern, False otherwise
    """
    n = len(s)
    
    # Try all possible substring lengths from 1 to n//2
    for i in range(1, n // 2 + 1):
        # Only consider divisors of n
        if n % i == 0:
            substring = s[:i]
            # Check if repeating the substring n//i times gives us s
            if substring * (n // i) == s:
                return True
    
    return False


# Example usage
if __name__ == "__main__":
    test_cases = [
        ("abab", True),      # "ab" repeated 2 times
        ("aba", False),      # No valid pattern
        ("abcabcabc", True),  # "abc" repeated 3 times
        ("a", False),        # Single character
        ("zzzzzz", True),    # "z" repeated 6 times
        ("xyzxyz", True),    # "xyz" repeated 2 times
        ("abcdabcd", True),  # "abcd" repeated 2 times
        ("abcab", False),    # No valid pattern
    ]
    
    for s, expected in test_cases:
        result = repeated_substring_pattern(s)
        print(f"'{s}': {result} (expected: {expected})")
        assert result == expected
```
<!-- slide -->
```cpp
// Repeated Substring Pattern - Brute Force (C++)
#include <string>
#include <iostream>
using namespace std;

bool repeatedSubstringPattern(const string& s) {
    int n = s.length();
    
    // Try all possible substring lengths from 1 to n//2
    for (int i = 1; i <= n / 2; i++) {
        // Only consider divisors of n
        if (n % i == 0) {
            string substring = s.substr(0, i);
            string repeated;
            
            // Repeat substring n/i times
            for (int j = 0; j < n / i; j++) {
                repeated += substring;
            }
            
            if (repeated == s) {
                return true;
            }
        }
    }
    
    return false;
}

// Example usage
int main() {
    vector<pair<string, bool>> test_cases = {
        {"abab", true},      // "ab" repeated 2 times
        {"aba", false},      // No valid pattern
        {"abcabcabc", true}, // "abc" repeated 3 times
        {"a", false},        // Single character
        {"zzzzzz", true},    // "z" repeated 6 times
        {"xyzxyz", true},    // "xyz" repeated 2 times
        {"abcdabcd", true},  // "abcd" repeated 2 times
        {"abcab", false},    // No valid pattern
    };
    
    for (const auto& [s, expected] : test_cases) {
        bool result = repeatedSubstringPattern(s);
        cout << "'" << s << "': " << (result ? "true" : "false") 
             << " (expected: " << (expected ? "true" : "false") << ")" << endl;
    }
    
    return 0;
}
```
<!-- slide -->
```java
// Repeated Substring Pattern - Brute Force (Java)
public class RepeatedSubstringPattern {
    
    public static boolean repeatedSubstringPattern(String s) {
        int n = s.length();
        
        // Try all possible substring lengths from 1 to n//2
        for (int i = 1; i <= n / 2; i++) {
            // Only consider divisors of n
            if (n % i == 0) {
                String substring = s.substring(0, i);
                StringBuilder repeated = new StringBuilder();
                
                // Repeat substring n/i times
                for (int j = 0; j < n / i; j++) {
                    repeated.append(substring);
                }
                
                if (repeated.toString().equals(s)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // Example usage
    public static void main(String[] args) {
        String[][] testCases = {
            {"abab", "true"},       // "ab" repeated 2 times
            {"aba", "false"},       // No valid pattern
            {"abcabcabc", "true"},  // "abc" repeated 3 times
            {"a", "false"},         // Single character
            {"zzzzzz", "true"},     // "z" repeated 6 times
            {"xyzxyz", "true"},     // "xyz" repeated 2 times
            {"abcdabcd", "true"},   // "abcd" repeated 2 times
            {"abcab", "false"},     // No valid pattern
        };
        
        for (String[] testCase : testCases) {
            String s = testCase[0];
            boolean expected = Boolean.parseBoolean(testCase[1]);
            boolean result = repeatedSubstringPattern(s);
            System.out.println("'" + s + "': " + result + " (expected: " + expected + ")");
        }
    }
}
```
<!-- slide -->
```javascript
// Repeated Substring Pattern - Brute Force (JavaScript)
/**
 * Check if string can be formed by repeating a substring.
 * @param {string} s - Input string to check
 * @returns {boolean} True if s is a repeated substring pattern
 */
function repeatedSubstringPattern(s) {
    const n = s.length;
    
    // Try all possible substring lengths from 1 to n//2
    for (let i = 1; i <= Math.floor(n / 2); i++) {
        // Only consider divisors of n
        if (n % i === 0) {
            const substring = s.slice(0, i);
            let repeated = '';
            
            // Repeat substring n/i times
            for (let j = 0; j < n / i; j++) {
                repeated += substring;
            }
            
            if (repeated === s) {
                return true;
            }
        }
    }
    
    return false;
}

// Example usage
const testCases = [
    ['abab', true],       // "ab" repeated 2 times
    ['aba', false],       // No valid pattern
    ['abcabcabc', true],  // "abc" repeated 3 times
    ['a', false],         // Single character
    ['zzzzzz', true],     // "z" repeated 6 times
    ['xyzxyz', true],     // "xyz" repeated 2 times
    ['abcdabcd', true],   // "abcd" repeated 2 times
    ['abcab', false],     // No valid pattern
];

testCases.forEach(([s, expected]) => {
    const result = repeatedSubstringPattern(s);
    console.log(`'${s}': ${result} (expected: ${expected})`);
});
```
````

### Time and Space Complexity

| Complexity | Value |
|------------|-------|
| **Time** | O(n × d) where d is number of divisors, worst case O(n²) |
| **Space** | O(1) auxiliary (excluding input and output) |

---

## Approach 2: KMP-Based Solution (LPS Array)

### Intuition

The KMP algorithm's LPS (Longest Prefix Suffix) array provides crucial information about the string's periodicity. The key insight is:

- If `s` is a repeated pattern, the LPS value at the last character tells us about the overlap
- The repeating unit length = `n - lps[n-1]`
- If `n % (n - lps[n-1]) == 0`, then it's a repeated pattern

### Why This Works

For `"ababab"`:
- LPS array: `[0, 0, 1, 2, 3, 4]`
- LPS[5] = 4 (longest proper prefix which is also suffix for "ababab")
- Repeating unit length = 6 - 4 = 2 ("ab")
- Since 6 % 2 == 0, it's a repeated pattern

### When to Use

- Large strings where efficiency matters
- When you already need KMP preprocessing for other operations
- Guaranteed O(n) solution

### Code Template

````carousel
```python
# Repeated Substring Pattern - KMP/LPS (Python)
def compute_lps(s: str) -> list[int]:
    """
    Compute the LPS (Longest Prefix Suffix) array for KMP algorithm.
    
    Args:
        s: Input string
    
    Returns:
        LPS array where lps[i] is the length of longest proper prefix
        which is also suffix for s[0..i]
    """
    n = len(s)
    lps = [0] * n
    length = 0  # length of the previous longest prefix suffix
    
    i = 1
    while i < n:
        if s[i] == s[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    
    return lps


def repeated_substring_pattern_kmp(s: str) -> bool:
    """
    Check if string can be formed by repeating a substring using KMP/LPS.
    
    Args:
        s: Input string to check
    
    Returns:
        True if s is a repeated substring pattern, False otherwise
    """
    n = len(s)
    
    # Single character cannot be a repeated pattern
    if n <= 1:
        return False
    
    # Compute LPS array
    lps = compute_lps(s)
    
    # The length of the repeating unit
    repeat_len = n - lps[-1]
    
    # Check if it's a repeated pattern
    # If n is divisible by repeat_len, then s is made of repeated units
    if repeat_len != n and n % repeat_len == 0:
        return True
    
    return False


# Example usage
if __name__ == "__main__":
    test_cases = [
        ("abab", True),      # "ab" repeated 2 times
        ("aba", False),      # No valid pattern
        ("abcabcabc", True), # "abc" repeated 3 times
        ("a", False),        # Single character
        ("zzzzzz", True),    # "z" repeated 6 times
        ("xyzxyz", True),    # "xyz" repeated 2 times
        ("abcdabcd", True),  # "abcd" repeated 2 times
        ("abcab", False),    # No valid pattern
        ("aaaaa", True),     # "a" repeated 5 times
        ("ababab", True),    # "ab" repeated 3 times
    ]
    
    for s, expected in test_cases:
        result = repeated_substring_pattern_kmp(s)
        print(f"'{s}': {result} (expected: {expected})")
        assert result == expected
```
<!-- slide -->
```cpp
// Repeated Substring Pattern - KMP/LPS (C++)
#include <string>
#include <vector>
#include <iostream>
using namespace std;

vector<int> computeLPS(const string& s) {
    int n = s.length();
    vector<int> lps(n, 0);
    int length = 0;  // length of the previous longest prefix suffix
    
    int i = 1;
    while (i < n) {
        if (s[i] == s[length]) {
            length++;
            lps[i] = length;
            i++;
        } else {
            if (length != 0) {
                length = lps[length - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    
    return lps;
}

bool repeatedSubstringPatternKMP(const string& s) {
    int n = s.length();
    
    // Single character cannot be a repeated pattern
    if (n <= 1) {
        return false;
    }
    
    // Compute LPS array
    vector<int> lps = computeLPS(s);
    
    // The length of the repeating unit
    int repeatLen = n - lps[n - 1];
    
    // Check if it's a repeated pattern
    // If n is divisible by repeatLen, then s is made of repeated units
    if (repeatLen != n && n % repeatLen == 0) {
        return true;
    }
    
    return false;
}

// Example usage
int main() {
    vector<pair<string, bool>> testCases = {
        {"abab", true},       // "ab" repeated 2 times
        {"aba", false},       // No valid pattern
        {"abcabcabc", true},  // "abc" repeated 3 times
        {"a", false},        // Single character
        {"zzzzzz", true},    // "z" repeated 6 times
        {"xyzxyz", true},    // "xyz" repeated 2 times
        {"abcdabcd", true},  // "abcd" repeated 2 times
        {"abcab", false},    // No valid pattern
        {"aaaaa", true},     // "a" repeated 5 times
        {"ababab", true},    // "ab" repeated 3 times
    };
    
    for (const auto& [s, expected] : testCases) {
        bool result = repeatedSubstringPatternKMP(s);
        cout << "'" << s << "': " << (result ? "true" : "false") 
             << " (expected: " << (expected ? "true" : "false") << ")" << endl;
    }
    
    return 0;
}
```
<!-- slide -->
```java
// Repeated Substring Pattern - KMP/LPS (Java)
public class RepeatedSubstringPatternKMP {
    
    private static int[] computeLPS(String s) {
        int n = s.length();
        int[] lps = new int[n];
        int length = 0;  // length of the previous longest prefix suffix
        
        int i = 1;
        while (i < n) {
            if (s.charAt(i) == s.charAt(length)) {
                length++;
                lps[i] = length;
                i++;
            } else {
                if (length != 0) {
                    length = lps[length - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        
        return lps;
    }
    
    public static boolean repeatedSubstringPattern(String s) {
        int n = s.length();
        
        // Single character cannot be a repeated pattern
        if (n <= 1) {
            return false;
        }
        
        // Compute LPS array
        int[] lps = computeLPS(s);
        
        // The length of the repeating unit
        int repeatLen = n - lps[n - 1];
        
        // Check if it's a repeated pattern
        // If n is divisible by repeatLen, then s is made of repeated units
        if (repeatLen != n && n % repeatLen == 0) {
            return true;
        }
        
        return false;
    }
    
    // Example usage
    public static void main(String[] args) {
        String[][] testCases = {
            {"abab", "true"},       // "ab" repeated 2 times
            {"aba", "false"},       // No valid pattern
            {"abcabcabc", "true"},  // "abc" repeated 3 times
            {"a", "false"},         // Single character
            {"zzzzzz", "true"},     // "z" repeated 6 times
            {"xyzxyz", "true"},     // "xyz" repeated 2 times
            {"abcdabcd", "true"},   // "abcd" repeated 2 times
            {"abcab", "false"},     // No valid pattern
            {"aaaaa", "true"},      // "a" repeated 5 times
            {"ababab", "true"},     // "ab" repeated 3 times
        };
        
        for (String[] testCase : testCases) {
            String s = testCase[0];
            boolean expected = Boolean.parseBoolean(testCase[1]);
            boolean result = repeatedSubstringPattern(s);
            System.out.println("'" + s + "': " + result + " (expected: " + expected + ")");
        }
    }
}
```
<!-- slide -->
```javascript
// Repeated Substring Pattern - KMP/LPS (JavaScript)
/**
 * Compute the LPS (Longest Prefix Suffix) array for KMP algorithm.
 * @param {string} s - Input string
 * @returns {number[]} LPS array
 */
function computeLPS(s) {
    const n = s.length;
    const lps = new Array(n).fill(0);
    let length = 0;  // length of the previous longest prefix suffix
    
    let i = 1;
    while (i < n) {
        if (s[i] === s[length]) {
            length++;
            lps[i] = length;
            i++;
        } else {
            if (length !== 0) {
                length = lps[length - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    
    return lps;
}

/**
 * Check if string can be formed by repeating a substring using KMP/LPS.
 * @param {string} s - Input string to check
 * @returns {boolean} True if s is a repeated substring pattern
 */
function repeatedSubstringPatternKMP(s) {
    const n = s.length;
    
    // Single character cannot be a repeated pattern
    if (n <= 1) {
        return false;
    }
    
    // Compute LPS array
    const lps = computeLPS(s);
    
    // The length of the repeating unit
    const repeatLen = n - lps[n - 1];
    
    // Check if it's a repeated pattern
    // If n is divisible by repeatLen, then s is made of repeated units
    if (repeatLen !== n && n % repeatLen === 0) {
        return true;
    }
    
    return false;
}

// Example usage
const testCases = [
    ['abab', true],       // "ab" repeated 2 times
    ['aba', false],       // No valid pattern
    ['abcabcabc', true],  // "abc" repeated 3 times
    ['a', false],        // Single character
    ['zzzzzz', true],    // "z" repeated 6 times
    ['xyzxyz', true],    // "xyz" repeated 2 times
    ['abcdabcd', true],  // "abcd" repeated 2 times
    ['abcab', false],    // No valid pattern
    ['aaaaa', true],     // "a" repeated 5 times
    ['ababab', true],    // "ab" repeated 3 times
];

testCases.forEach(([s, expected]) => {
    const result = repeatedSubstringPatternKMP(s);
    console.log(`'${s}': ${result} (expected: ${expected})`);
});
```
````

### Time and Space Complexity

| Complexity | Value |
|------------|-------|
| **Time** | O(n) - single pass to compute LPS |
| **Space** | O(n) for LPS array |

---

## Approach 3: String Concatenation Trick

### Intuition

A clever observation: If `s` is formed by repeating a substring, then `s` will appear in `(s + s)[1:-1]`.

**Why this works**:
- `(s + s)` = `"ababab" + "ababab"` = `"abababababab"`
- Removing first and last character: `"bababababa"`
- `"ababab"` appears in this string because of the overlapping pattern

### When to Use

- One-liner solution needed
- Memory is not a constraint
- Quick and elegant solution for interviews

### Code Template

````carousel
```python
# Repeated Substring Pattern - String Concatenation Trick (Python)
def repeated_substring_pattern_trick(s: str) -> bool:
    """
    Check if string can be formed by repeating a substring.
    Uses the string concatenation trick.
    
    Args:
        s: Input string to check
    
    Returns:
        True if s is a repeated substring pattern, False otherwise
    """
    # If s is a repeated pattern, it will appear in (s + s)[1:-1]
    doubled = (s + s)[1:-1]
    return s in doubled


# Example usage
if __name__ == "__main__":
    test_cases = [
        ("abab", True),      # "ab" repeated 2 times
        ("aba", False),      # No valid pattern
        ("abcabcabc", True), # "abc" repeated 3 times
        ("a", False),        # Single character
        ("zzzzzz", True),    # "z" repeated 6 times
        ("xyzxyz", True),    # "xyz" repeated 2 times
        ("abcdabcd", True),  # "abcd" repeated 2 times
        ("abcab", False),    # No valid pattern
        ("aaaaa", True),     # "a" repeated 5 times
        ("ababab", True),    # "ab" repeated 3 times
    ]
    
    for s, expected in test_cases:
        result = repeated_substring_pattern_trick(s)
        print(f"'{s}': {result} (expected: {expected})")
        assert result == expected
```
<!-- slide -->
```cpp
// Repeated Substring Pattern - String Concatenation Trick (C++)
#include <string>
#include <iostream>
using namespace std;

bool repeatedSubstringPatternTrick(const string& s) {
    // If s is a repeated pattern, it will appear in (s + s)[1:-1]
    string doubled = s + s;
    string middle = doubled.substr(1, doubled.length() - 2);
    
    return middle.find(s) != string::npos;
}

// Example usage
int main() {
    vector<pair<string, bool>> testCases = {
        {"abab", true},       // "ab" repeated 2 times
        {"aba", false},       // No valid pattern
        {"abcabcabc", true},  // "abc" repeated 3 times
        {"a", false},        // Single character
        {"zzzzzz", true},    // "z" repeated 6 times
        {"xyzxyz", true},    // "xyz" repeated 2 times
        {"abcdabcd", true},  // "abcd" repeated 2 times
        {"abcab", false},    // No valid pattern
        {"aaaaa", true},     // "a" repeated 5 times
        {"ababab", true},    // "ab" repeated 3 times
    };
    
    for (const auto& [s, expected] : testCases) {
        bool result = repeatedSubstringPatternTrick(s);
        cout << "'" << s << "': " << (result ? "true" : "false") 
             << " (expected: " << (expected ? "true" : "false") << ")" << endl;
    }
    
    return 0;
}
```
<!-- slide -->
```java
// Repeated Substring Pattern - String Concatenation Trick (Java)
public class RepeatedSubstringPatternTrick {
    
    public static boolean repeatedSubstringPattern(String s) {
        // If s is a repeated pattern, it will appear in (s + s)[1:-1]
        String doubled = s + s;
        String middle = doubled.substring(1, doubled.length() - 1);
        
        return middle.contains(s);
    }
    
    // Example usage
    public static void main(String[] args) {
        String[][] testCases = {
            {"abab", "true"},       // "ab" repeated 2 times
            {"aba", "false"},       // No valid pattern
            {"abcabcabc", "true"},  // "abc" repeated 3 times
            {"a", "false"},         // Single character
            {"zzzzzz", "true"},     // "z" repeated 6 times
            {"xyzxyz", "true"},     // "xyz" repeated 2 times
            {"abcdabcd", "true"},   // "abcd" repeated 2 times
            {"abcab", "false"},    // No valid pattern
            {"aaaaa", "true"},      // "a" repeated 5 times
            {"ababab", "true"},     // "ab" repeated 3 times
        };
        
        for (String[] testCase : testCases) {
            String s = testCase[0];
            boolean expected = Boolean.parseBoolean(testCase[1]);
            boolean result = repeatedSubstringPattern(s);
            System.out.println("'" + s + "': " + result + " (expected: " + expected + ")");
        }
    }
}
```
<!-- slide -->
```javascript
// Repeated Substring Pattern - String Concatenation Trick (JavaScript)
/**
 * Check if string can be formed by repeating a substring.
 * Uses the string concatenation trick.
 * @param {string} s - Input string to check
 * @returns {boolean} True if s is a repeated substring pattern
 */
function repeatedSubstringPatternTrick(s) {
    // If s is a repeated pattern, it will appear in (s + s)[1:-1]
    const doubled = s + s;
    const middle = doubled.slice(1, -1);
    
    return middle.includes(s);
}

// Example usage
const testCases = [
    ['abab', true],       // "ab" repeated 2 times
    ['aba', false],       // No valid pattern
    ['abcabcabc', true],  // "abc" repeated 3 times
    ['a', false],        // Single character
    ['zzzzzz', true],    // "z" repeated 6 times
    ['xyzxyz', true],    // "xyz" repeated 2 times
    ['abcdabcd', true],  // "abcd" repeated 2 times
    ['abcab', false],    // No valid pattern
    ['aaaaa', true],     // "a" repeated 5 times
    ['ababab', true],    // "ab" repeated 3 times
];

testCases.forEach(([s, expected]) => {
    const result = repeatedSubstringPatternTrick(s);
    console.log(`'${s}': ${result} (expected: ${expected})`);
});
```
````

### Time and Space Complexity

| Complexity | Value |
|------------|-------|
| **Time** | O(n) for string concatenation and search (depends on implementation) |
| **Space** | O(n) for the doubled string |

---

## Approach 4: Sliding Window with Optimization

### Intuition

Instead of checking every divisor, we can optimize by:
1. Early termination when a mismatch is found
2. Only checking candidate lengths that divide n
3. Verifying incrementally

### When to Use

- When you want a balance between simplicity and efficiency
- String lengths are moderate

### Code Template

````carousel
```python
# Repeated Substring Pattern - Sliding Window (Python)
def repeated_substring_pattern_sliding(s: str) -> bool:
    """
    Check if string can be formed by repeating a substring using sliding window.
    
    Args:
        s: Input string to check
    
    Returns:
        True if s is a repeated substring pattern, False otherwise
    """
    n = len(s)
    
    # Find all divisors of n (potential pattern lengths)
    divisors = []
    for i in range(1, int(n**0.5) + 1):
        if n % i == 0:
            divisors.append(i)
            if i != n // i:
                divisors.append(n // i)
    
    # Sort divisors to try smaller patterns first
    divisors.sort()
    
    for pattern_len in divisors:
        if pattern_len == n:  # Skip the full length
            continue
        
        pattern = s[:pattern_len]
        is_valid = True
        
        # Check each segment
        for i in range(pattern_len, n, pattern_len):
            if s[i:i+pattern_len] != pattern:
                is_valid = False
                break
        
        if is_valid:
            return True
    
    return False


# Example usage
if __name__ == "__main__":
    test_cases = [
        ("abab", True),      # "ab" repeated 2 times
        ("aba", False),      # No valid pattern
        ("abcabcabc", True), # "abc" repeated 3 times
        ("a", False),        # Single character
        ("zzzzzz", True),    # "z" repeated 6 times
        ("xyzxyz", True),    # "xyz" repeated 2 times
        ("abcdabcd", True),  # "abcd" repeated 2 times
        ("abcab", False),    # No valid pattern
        ("aaaaa", True),     # "a" repeated 5 times
        ("ababab", True),    # "ab" repeated 3 times
    ]
    
    for s, expected in test_cases:
        result = repeated_substring_pattern_sliding(s)
        print(f"'{s}': {result} (expected: {expected})")
        assert result == expected
```
<!-- slide -->
```cpp
// Repeated Substring Pattern - Sliding Window (C++)
#include <string>
#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

bool repeatedSubstringPatternSliding(const string& s) {
    int n = s.length();
    
    // Find all divisors of n (potential pattern lengths)
    vector<int> divisors;
    for (int i = 1; i * 1LL * i <= n; i++) {
        if (n % i == 0) {
            divisors.push_back(i);
            if (i != n / i) {
                divisors.push_back(n / i);
            }
        }
    }
    
    // Sort divisors to try smaller patterns first
    sort(divisors.begin(), divisors.end());
    
    for (int patternLen : divisors) {
        if (patternLen == n) {  // Skip the full length
            continue;
        }
        
        string pattern = s.substr(0, patternLen);
        bool isValid = true;
        
        // Check each segment
        for (int i = patternLen; i < n; i += patternLen) {
            if (s.substr(i, patternLen) != pattern) {
                isValid = false;
                break;
            }
        }
        
        if (isValid) {
            return true;
        }
    }
    
    return false;
}

// Example usage
int main() {
    vector<pair<string, bool>> testCases = {
        {"abab", true},       // "ab" repeated 2 times
        {"aba", false},       // No valid pattern
        {"abcabcabc", true},  // "abc" repeated 3 times
        {"a", false},        // Single character
        {"zzzzzz", true},    // "z" repeated 6 times
        {"xyzxyz", true},    // "xyz" repeated 2 times
        {"abcdabcd", true},  // "abcd" repeated 2 times
        {"abcab", false},    // No valid pattern
        {"aaaaa", true},     // "a" repeated 5 times
        {"ababab", true},    // "ab" repeated 3 times
    };
    
    for (const auto& [s, expected] : testCases) {
        bool result = repeatedSubstringPatternSliding(s);
        cout << "'" << s << "': " << (result ? "true" : "false") 
             << " (expected: " << (expected ? "true" : "false") << ")" << endl;
    }
    
    return 0;
}
```
<!-- slide -->
```java
// Repeated Substring Pattern - Sliding Window (Java)
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class RepeatedSubstringPatternSliding {
    
    public static boolean repeatedSubstringPattern(String s) {
        int n = s.length();
        
        // Find all divisors of n (potential pattern lengths)
        List<Integer> divisors = new ArrayList<>();
        for (int i = 1; i * 1L * i <= n; i++) {
            if (n % i == 0) {
                divisors.add(i);
                if (i != n / i) {
                    divisors.add(n / i);
                }
            }
        }
        
        // Sort divisors to try smaller patterns first
        Collections.sort(divisors);
        
        for (int patternLen : divisors) {
            if (patternLen == n) {  // Skip the full length
                continue;
            }
            
            String pattern = s.substring(0, patternLen);
            boolean isValid = true;
            
            // Check each segment
            for (int i = patternLen; i < n; i += patternLen) {
                int endIdx = Math.min(i + patternLen, n);
                if (!s.substring(i, endIdx).equals(pattern)) {
                    isValid = false;
                    break;
                }
            }
            
            if (isValid) {
                return true;
            }
        }
        
        return false;
    }
    
    // Example usage
    public static void main(String[] args) {
        String[][] testCases = {
            {"abab", "true"},       // "ab" repeated 2 times
            {"aba", "false"},       // No valid pattern
            {"abcabcabc", "true"},  // "abc" repeated 3 times
            {"a", "false"},         // Single character
            {"zzzzzz", "true"},     // "z" repeated 6 times
            {"xyzxyz", "true"},     // "xyz" repeated 2 times
            {"abcdabcd", "true"},   // "abcd" repeated 2 times
            {"abcab", "false"},     // No valid pattern
            {"aaaaa", "true"},      // "a" repeated 5 times
            {"ababab", "true"},     // "ab" repeated 3 times
        };
        
        for (String[] testCase : testCases) {
            String s = testCase[0];
            boolean expected = Boolean.parseBoolean(testCase[1]);
            boolean result = repeatedSubstringPattern(s);
            System.out.println("'" + s + "': " + result + " (expected: " + expected + ")");
        }
    }
}
```
<!-- slide -->
```javascript
// Repeated Substring Pattern - Sliding Window (JavaScript)
/**
 * Check if string can be formed by repeating a substring using sliding window.
 * @param {string} s - Input string to check
 * @returns {boolean} True if s is a repeated substring pattern
 */
function repeatedSubstringPatternSliding(s) {
    const n = s.length;
    
    // Find all divisors of n (potential pattern lengths)
    const divisors = [];
    for (let i = 1; i * i <= n; i++) {
        if (n % i === 0) {
            divisors.push(i);
            if (i !== Math.floor(n / i)) {
                divisors.push(Math.floor(n / i));
            }
        }
    }
    
    // Sort divisors to try smaller patterns first
    divisors.sort((a, b) => a - b);
    
    for (const patternLen of divisors) {
        if (patternLen === n) {  // Skip the full length
            continue;
        }
        
        const pattern = s.slice(0, patternLen);
        let isValid = true;
        
        // Check each segment
        for (let i = patternLen; i < n; i += patternLen) {
            const segment = s.slice(i, i + patternLen);
            if (segment !== pattern) {
                isValid = false;
                break;
            }
        }
        
        if (isValid) {
            return true;
        }
    }
    
    return false;
}

// Example usage
const testCases = [
    ['abab', true],       // "ab" repeated 2 times
    ['aba', false],       // No valid pattern
    ['abcabcabc', true],  // "abc" repeated 3 times
    ['a', false],        // Single character
    ['zzzzzz', true],    // "z" repeated 6 times
    ['xyzxyz', true],    // "xyz" repeated 2 times
    ['abcdabcd', true],  // "abcd" repeated 2 times
    ['abcab', false],    // No valid pattern
    ['aaaaa', true],     // "a" repeated 5 times
    ['ababab', true],    // "ab" repeated 3 times
];

testCases.forEach(([s, expected]) => {
    const result = repeatedSubstringPatternSliding(s);
    console.log(`'${s}': ${result} (expected: ${expected})`);
});
```
````

### Time and Space Complexity

| Complexity | Value |
|------------|-------|
| **Time** | O(n × d) where d is number of divisors |
| **Space** | O(1) auxiliary |

---

## Comparison Summary

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|-----------------|------------------|---------------|
| **Brute Force** | O(n²) worst case | O(1) | Small strings, simplicity |
| **KMP/LPS** | O(n) | O(n) | Large strings, guaranteed optimal |
| **String Trick** | O(n) | O(n) | One-liner, interviews |
| **Sliding Window** | O(n × d) | O(1) | Moderate strings, divisor optimization |

### Algorithm Selection Guide

1. **Choose Brute Force when**:
   - String length is small (< 10,000)
   - Simplicity is preferred
   - Code readability is important

2. **Choose KMP/LPS when**:
   - Large strings (> 100,000 characters)
   - Guaranteed O(n) performance needed
   - Already using KMP for other operations

3. **Choose String Trick when**:
   - Quick interview solution
   - Memory is not a constraint
   - One-liner is preferred

4. **Choose Sliding Window when**:
   - Balance between efficiency and simplicity
   - Many divisors need to be checked
   - Early termination helps

---

## Related Problems

### LeetCode Problems

| Problem | Difficulty | Description |
|---------|------------|-------------|
| [459. Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/) | Medium | Check if string is repeated substring |
| [686. Repeated String Match](https://leetcode.com/problems/repeated-string-match/) | Medium | Find minimum repeats needed |
| [1071. Greatest Common Divisor of Strings](https://leetcode.com/problems/greatest-common-divisor-of-strings/) | Easy | Find GCD of string patterns |
| [796. Rotate String](https://leetcode.com/problems/rotate-string/) | Easy | Check if one string is rotation of another |
| [28. Implement strStr()](https://leetcode.com/problems/implement-strstr/) | Easy | Find first occurrence of substring |

### Similar Pattern Problems

| Problem | Difficulty | Related Concept |
|---------|------------|-----------------|
| [1392. Longest Happy Prefix](https://leetcode.com/problems/longest-happy-prefix/) | Hard | KMP LPS application |
| [1044. Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring/) | Hard | Rolling hash for repeated substrings |
| [466. Count The Repetitions](https://leetcode.com/problems/count-the-repetitions/) | Hard | Count pattern repetitions |
| [1028. Recover a String From Deleted Substring](https://leetcode.com/problems/recover-a-string-from-deleted-substring/) | Hard | String reconstruction |

---

## Video Tutorials

### Repeated Substring Pattern
- [LeetCode 459: Repeated Substring Pattern - NeetCode](https://www.youtube.com/watch?v=B3kT9CtTjK4) - Detailed solution walkthrough
- [Repeated Substring Pattern - KMP Approach](https://www.youtube.com/watch?v=RV5762B1mPs) - KMP-based solution
- [String Pattern Detection -技巧](https://www.youtube.com/watch?v=nM603K25X6k) - Chinese explanation

### KMP Algorithm (Related)
- [Knuth-Morris-Pratt (KMP) Algorithm - Abdul Bari](https://www.youtube.com/watch?v=4jY57Ehc14Y) - Comprehensive KMP explanation
- [KMP Algorithm Explained - CodeHelp](https://www.youtube.com/watch?v=GTJr8OvyEVQ) - Detailed tutorial with examples

### String Matching
- [String Matching Algorithms - Introduction](https://www.youtube.com/watch?v=5i7oKodCRJo) - Comparison of all methods
- [LeetCode 28 Solution Walkthrough](https://www.youtube.com/watch?v=Gjkhm1gYIMw) - Problem-solving session

---

## Common Pitfalls

### 1. Single Character Edge Case
```python
# Wrong: Single character cannot be a repeated pattern
# Correct: Return False for n <= 1
if n <= 1:
    return False
```

### 2. Divisibility Check
```python
# Wrong: Checking all lengths
# Correct: Only check divisors of n
if n % i == 0:
    # Check this length
```

### 3. LPS Array Interpretation
```python
# Wrong: Using LPS value directly
# Correct: pattern_length = n - lps[n-1]
repeat_len = n - lps[-1]
if n % repeat_len == 0:
    return True
```

### 4. String Concatenation Bounds
```python
# Wrong: (s + s)[1:-1] when n=1 produces empty string
# Correct: Handle edge cases properly
if len(s) <= 1:
    return False
```

### 5. Memory Usage
```python
# Wrong: Creating multiple large strings in brute force
# Correct: Use efficient string operations
# KMP approach uses O(n) space but only once
```

---

## Practice Problems

### Beginner
1. [459. Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/) - Basic pattern detection
2. [796. Rotate String](https://leetcode.com/problems/rotate-string/) - Simple string check

### Intermediate
1. [686. Repeated String Match](https://leetcode.com/problems/repeated-string-match/) - String repetition + search
2. [1071. Greatest Common Divisor of Strings](https://leetcode.com/problems/greatest-common-divisor-of-strings/) - GCD of strings

### Advanced
1. [1392. Longest Happy Prefix](https://leetcode.com/problems/longest-happy-prefix/) - KMP LPS advanced usage
2. [1044. Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring/) - Rolling hash application

---

## Summary

The Repeated Substring Pattern Detection problem can be solved using multiple approaches, each with different trade-offs:

**Key Takeaways**:
- **Brute Force** is simple but inefficient for large strings
- **KMP/LPS** provides optimal O(n) time with O(n) space
- **String Trick** offers an elegant one-line solution
- **Sliding Window** balances efficiency and readability

**Pattern Recognition**:
- Look for divisibility constraints (pattern length must divide string length)
- Use LPS array for periodicity detection
- Consider string concatenation for elegant solutions

**Real-World Applications**:
- Data compression algorithms
- DNA sequence analysis
- Text preprocessing for search engines
- String hashing and fingerprinting

Mastering this pattern helps in solving related problems involving string periodicity, pattern matching, and efficient substring detection.
