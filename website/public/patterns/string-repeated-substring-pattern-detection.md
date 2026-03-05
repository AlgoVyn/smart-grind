# String - Repeated Substring Pattern Detection

## Problem Description

The **Repeated Substring Pattern Detection** pattern involves identifying whether a given string can be constructed by repeating a substring multiple times. This pattern tests understanding of string structure, periodicity, and clever string manipulation techniques.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Input** | A single string to analyze |
| **Output** | Boolean indicating if string has repeated substring pattern |
| **Key Insight** | If `s` is a repeated pattern, then `s` is a substring of `(s + s)[1:-1]` |
| **Time Complexity** | O(n) using KMP, O(n²) using brute force |
| **Space Complexity** | O(n) for KMP, O(1) for concatenation trick |

### When to Use

- **Pattern validation**: Checking if data follows a repeating structure
- **Compression detection**: Identifying compressible repeating sequences
- **String analysis**: Finding periodicity in sequences
- **DNA/protein sequence analysis**: Detecting repeating genetic patterns
- **Data validation**: Verifying formatted data patterns

---

## Intuition

The key insights behind repeated substring pattern detection:

1. **The Concatenation Trick**: If a string `s` can be formed by repeating a substring, then `s` must appear in `(s + s)[1:-1]` (s+s without first and last character). For example, "abab" appears in "bababa" (ababab without first and last char).

2. **KMP Failure Function**: The Knuth-Morris-Pratt algorithm's failure function (prefix function) can reveal the longest proper prefix that is also a suffix, which helps determine periodicity.

3. **Length Divisibility**: If a string of length `n` is composed of `k` repetitions of a substring, then `n` must be divisible by the substring length.

4. **Pattern Periodicity**: A string has a repeated pattern if and only if there exists a divisor `d` of `n` such that the string equals its substring of length `d` repeated `n/d` times.

---

## Solution Approaches

### Approach 1: Concatenation Trick (Most Elegant)

This clever approach uses string concatenation to check for repeated patterns without complex algorithms.

#### Algorithm

1. Concatenate the string with itself: `ss = s + s`
2. Remove the first and last characters from `ss`
3. Check if original string `s` exists in the modified `ss`
4. Return true if found, false otherwise

**Why it works**: If `s` is composed of repeated substrings, say `s = t + t + ... + t`, then `s+s` creates overlapping instances of these patterns, and removing first/last char ensures we look for internal matches.

#### Implementation

````carousel
```python
def repeated_substring_pattern(s: str) -> bool:
    """
    Check if string has repeated substring pattern using concatenation trick.
    Time: O(n), Space: O(n)
    
    Args:
        s: Input string to check
        
    Returns:
        True if s can be formed by repeating a substring
    """
    if len(s) <= 1:
        return False
    
    # s should appear in (s+s)[1:-1] if it has repeated pattern
    return s in (s + s)[1:-1]
```
<!-- slide -->
```cpp
bool repeatedSubstringPattern(string s) {
    /**
     * Check if string has repeated substring pattern.
     * Time: O(n), Space: O(n)
     * 
     * @param s Input string
     * @return True if s has repeated pattern
     */
    if (s.length() <= 1) {
        return false;
    }
    
    string ss = s + s;
    return ss.substr(1, ss.length() - 2).find(s) != string::npos;
}
```
<!-- slide -->
```java
public boolean repeatedSubstringPattern(String s) {
    /**
     * Check if string has repeated substring pattern.
     * Time: O(n), Space: O(n)
     * 
     * @param s Input string
     * @return True if s has repeated pattern
     */
    if (s.length() <= 1) {
        return false;
    }
    
    String ss = s + s;
    return ss.substring(1, ss.length() - 1).contains(s);
}
```
<!-- slide -->
```javascript
/**
 * Check if string has repeated substring pattern.
 * Time: O(n), Space: O(n)
 * 
 * @param {string} s - Input string
 * @return {boolean} True if s has repeated pattern
 */
function repeatedSubstringPattern(s) {
    if (s.length <= 1) {
        return false;
    }
    
    return (s + s).slice(1, -1).includes(s);
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - String contains/substring operations |
| **Space** | O(n) - For the concatenated string |

---

### Approach 2: KMP Failure Function (Optimal)

Using the KMP algorithm's failure function (prefix function) to find the longest proper prefix which is also a suffix.

#### Algorithm

1. Compute the KMP prefix function (failure function) for the string
2. Let `n = len(s)` and `lps = prefix_function[n-1]` (length of longest proper prefix-suffix)
3. If `lps > 0` and `n % (n - lps) == 0`, return true
4. Otherwise, return false

**Why it works**: If the string has a repeated pattern of length `k`, then the longest proper prefix-suffix will indicate this periodicity.

#### Implementation

````carousel
```python
def repeated_substring_pattern_kmp(s: str) -> bool:
    """
    Check repeated pattern using KMP failure function.
    Time: O(n), Space: O(n)
    """
    n = len(s)
    if n <= 1:
        return False
    
    # Compute prefix function (failure function)
    prefix = [0] * n
    for i in range(1, n):
        j = prefix[i - 1]
        while j > 0 and s[i] != s[j]:
            j = prefix[j - 1]
        if s[i] == s[j]:
            j += 1
        prefix[i] = j
    
    # Check if repeated pattern exists
    lps = prefix[-1]  # longest proper prefix which is also suffix
    return lps > 0 and n % (n - lps) == 0
```
<!-- slide -->
```cpp
bool repeatedSubstringPatternKMP(string s) {
    int n = s.length();
    if (n <= 1) return false;
    
    vector<int> prefix(n, 0);
    
    // Compute prefix function
    for (int i = 1; i < n; i++) {
        int j = prefix[i - 1];
        while (j > 0 && s[i] != s[j]) {
            j = prefix[j - 1];
        }
        if (s[i] == s[j]) {
            j++;
        }
        prefix[i] = j;
    }
    
    int lps = prefix[n - 1];
    return lps > 0 && n % (n - lps) == 0;
}
```
<!-- slide -->
```java
public boolean repeatedSubstringPatternKMP(String s) {
    int n = s.length();
    if (n <= 1) return false;
    
    int[] prefix = new int[n];
    
    // Compute prefix function
    for (int i = 1; i < n; i++) {
        int j = prefix[i - 1];
        while (j > 0 && s.charAt(i) != s.charAt(j)) {
            j = prefix[j - 1];
        }
        if (s.charAt(i) == s.charAt(j)) {
            j++;
        }
        prefix[i] = j;
    }
    
    int lps = prefix[n - 1];
    return lps > 0 && n % (n - lps) == 0;
}
```
<!-- slide -->
```javascript
function repeatedSubstringPatternKMP(s) {
    const n = s.length;
    if (n <= 1) return false;
    
    const prefix = new Array(n).fill(0);
    
    // Compute prefix function
    for (let i = 1; i < n; i++) {
        let j = prefix[i - 1];
        while (j > 0 && s[i] !== s[j]) {
            j = prefix[j - 1];
        }
        if (s[i] === s[j]) {
            j++;
        }
        prefix[i] = j;
    }
    
    const lps = prefix[n - 1];
    return lps > 0 && n % (n - lps) === 0;
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass to compute prefix function |
| **Space** | O(n) - Prefix array storage |

---

### Approach 3: Brute Force (Check All Divisors)

Try all possible substring lengths that divide the string length evenly.

#### Algorithm

1. For each possible divisor `i` from 1 to n/2:
   - If `n % i == 0` (i divides n evenly):
     - Extract substring of length `i`
     - Repeat it `n/i` times and compare with original
     - If match found, return true
2. Return false if no pattern found

#### Implementation

````carousel
```python
def repeated_substring_pattern_brute(s: str) -> bool:
    """
    Check repeated pattern using brute force.
    Time: O(n²), Space: O(n)
    """
    n = len(s)
    
    for i in range(1, n // 2 + 1):
        if n % i == 0:  # i must divide n evenly
            substring = s[:i]
            if substring * (n // i) == s:
                return True
    
    return False
```
<!-- slide -->
```cpp
bool repeatedSubstringPatternBrute(string s) {
    int n = s.length();
    
    for (int i = 1; i <= n / 2; i++) {
        if (n % i == 0) {
            string substring = s.substr(0, i);
            string repeated = "";
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
```
<!-- slide -->
```java
public boolean repeatedSubstringPatternBrute(String s) {
    int n = s.length();
    
    for (int i = 1; i <= n / 2; i++) {
        if (n % i == 0) {
            String substring = s.substring(0, i);
            StringBuilder repeated = new StringBuilder();
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
```
<!-- slide -->
```javascript
function repeatedSubstringPatternBrute(s) {
    const n = s.length;
    
    for (let i = 1; i <= n / 2; i++) {
        if (n % i === 0) {
            const substring = s.slice(0, i);
            const repeated = substring.repeat(n / i);
            if (repeated === s) {
                return true;
            }
        }
    }
    
    return false;
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Try n/2 divisors, each comparison is O(n) |
| **Space** | O(n) - For building repeated string |

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| **Concatenation Trick** | O(n) | O(n) | **Most elegant**, interviews |
| **KMP Failure Function** | O(n) | O(n) | **Optimal**, understanding periodicity |
| **Brute Force** | O(n²) | O(n) | Small strings, clarity |

---

## Related Problems

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Repeated Substring Pattern | [Link](https://leetcode.com/problems/repeated-substring-pattern/) | Primary problem for this pattern |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Implement strStr() | [Link](https://leetcode.com/problems/implement-strstr/) | Find substring using KMP |
| KMP Algorithm Problems | Various | Pattern matching applications |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Shortest Palindrome | [Link](https://leetcode.com/problems/shortest-palindrome/) | Uses KMP concepts |

---

## Video Tutorial Links

1. [NeetCode - Repeated Substring Pattern](https://www.youtube.com/watch?v=g4Vr0fmXjOw) - Concatenation trick explained
2. [KMP Algorithm Explained](https://www.youtube.com/watch?v=GTJr8OvyEVQ) - Understanding prefix function
3. [Pattern Matching Algorithms](https://www.youtube.com/watch?v=BXCEFAzhxGY) - String pattern concepts

---

## Summary

### Key Takeaways

1. **Concatenation Trick is Elegant**: The `(s+s)[1:-1]` check is the most concise solution and commonly expected in interviews.

2. **KMP for Understanding**: Learning the KMP failure function approach provides deeper insight into string periodicity.

3. **Length Divisibility**: The pattern length must divide the total string length evenly.

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Not checking length > 1** | Single character strings cannot have patterns |
| **Off-by-one in concatenation** | Remember `[1:-1]` removes first AND last character |
| **Integer division errors** | Use `n % i == 0` to check divisibility |
| **Building large strings** | Avoid O(n²) approaches for large inputs |

### Follow-up Questions

**Q1: How do you find the smallest repeating unit?**

The smallest repeating unit has length `n - lps` where `lps` is the longest proper prefix-suffix from KMP.

**Q2: How many times does the pattern repeat?**

The pattern repeats `n / (n - lps)` times, or `n / pattern_length`.

**Q3: Can you solve this without extra space?**

The brute force approach can be modified to check character by character without building strings, achieving O(1) space.

---

## Pattern Source

For more string pattern implementations, see:
- **[String - Matching (Naive/KMP/Rabin-Karp)](/patterns/string-matching-naive-kmp-rabin-karp)**
- **[String - Anagram Check](/patterns/string-anagram-check)**
