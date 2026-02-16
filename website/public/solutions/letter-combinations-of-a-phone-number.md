# Letter Combinations of a Phone Number

## Problem Description

Given a string containing digits from 2-9, return all possible letter combinations that the number could represent on a traditional phone keypad. Return the answer in any order.

This is a classic backtracking problem that demonstrates systematic exploration of all possible combinations.

### Understanding the Problem

A standard telephone keypad maps digits to letters as follows:

| Digit | Letters |
|-------|---------|
| 2 | abc |
| 3 | def |
| 4 | ghi |
| 5 | jkl |
| 6 | mno |
| 7 | pqrs |
| 8 | tuv |
| 9 | wxyz |

For example, the digit string "23" can produce 9 combinations: "ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf".

---

## Constraints

- `0 <= digits.length <= 4`
- `digits[i]` is a digit from '2' to '9'
- If `digits` is empty, return an empty list `[]`

---

## Example 1

**Input:**
```python
digits = "23"
```

**Output:**
```python
["ad","ae","af","bd","be","bf","cd","ce","cf"]
```

**Visual:**
```
      Start
         |
      [a,b,c]  ← First digit '2'
      /  |  \
    ad  ae  af
    |   |   |
  [d,e,f]  ← Second digit '3'
  / | \ | \ \
 bd be bf cd ce cf
```

**Explanation:**
- Digit '2' maps to ['a', 'b', 'c']
- Digit '3' maps to ['d', 'e', 'f']
- Each letter from '2' combines with each letter from '3'
- Total combinations: 3 × 3 = 9

---

## Example 2

**Input:**
```python
digits = ""
```

**Output:**
```python
[]
```

**Explanation:**
- Empty input string should return an empty list

---

## Example 3

**Input:**
```python
digits = "2"
```

**Output:**
```python
["a", "b", "c"]
```

**Explanation:**
- Single digit maps to its corresponding letters directly

---

## Example 4

**Input:**
```python
digits = "79"
```

**Output:**
```python
["pw","px","py","pz","qw","qx","qy","qz","rw","rx","ry","rz","sw","sx","sy","sz"]
```

**Explanation:**
- Digit '7' has 4 letters (pqrs)
- Digit '9' has 4 letters (wxyz)
- Total combinations: 4 × 4 = 16

---

## Solution

This problem has multiple solutions ranging from simple backtracking to iterative approaches. We explore:

1. **Recursive Backtracking** - Classic DFS approach
2. **Iterative BFS** - Level-by-level building
3. **Index-based DFS** - Using indices instead of string slicing
4. **Cartesian Product** - Mathematical approach

---

## Approach 1: Recursive Backtracking

### Algorithm

The backtracking approach builds combinations one digit at a time:

1. Create a mapping from digits to their letter combinations
2. Use a recursive function that takes:
   - `current`: the current combination being built
   - `index`: which digit we're currently processing
3. If `index == len(digits)`, add the current combination to results
4. Otherwise, get the letters for `digits[index]` and:
   - For each letter, append it to current and recurse
   - Backtrack by removing the last letter

### Code Implementation

````carousel
```python
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        """
        Generate all letter combinations from phone number digits.
        
        Args:
            digits: String containing digits from 2-9
            
        Returns:
            List of all possible letter combinations
        """
        if not digits:
            return []
        
        # Digit to letter mapping
        phone = {
            '2': 'abc',
            '3': 'def',
            '4': 'ghi',
            '5': 'jkl',
            '6': 'mno',
            '7': 'pqrs',
            '8': 'tuv',
            '9': 'wxyz'
        }
        
        res = []
        
        def backtrack(index: int, current: str):
            # Base case: reached the end of digits
            if index == len(digits):
                res.append(current)
                return
            
            # Get letters for current digit
            letters = phone[digits[index]]
            
            # Try each letter
            for letter in letters:
                backtrack(index + 1, current + letter)
        
        backtrack(0, "")
        return res
```

<!-- slide -->
```cpp
class Solution {
private:
    vector<string> result;
    unordered_map<char, string> phone;
    
    void backtrack(int index, string current, const string& digits) {
        // Base case: reached the end of digits
        if (index == digits.length()) {
            result.push_back(current);
            return;
        }
        
        // Get letters for current digit
        string letters = phone[digits[index]];
        
        // Try each letter
        for (char letter : letters) {
            backtrack(index + 1, current + letter, digits);
        }
    }
    
public:
    Solution() {
        phone = {
            {'2', "abc"},
            {'3', "def"},
            {'4', "ghi"},
            {'5', "jkl"},
            {'6', "mno"},
            {'7', "pqrs"},
            {'8', "tuv"},
            {'9', "wxyz"}
        };
    }
    
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) {
            return {};
        }
        
        result.clear();
        backtrack(0, "", digits);
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    private List<String> result;
    private Map<Character, String> phone;
    
    public Solution() {
        phone = new HashMap<>();
        phone.put('2', "abc");
        phone.put('3', "def");
        phone.put('4', "ghi");
        phone.put('5', "jkl");
        phone.put('6', "mno");
        phone.put('7', "pqrs");
        phone.put('8', "tuv");
        phone.put('9', "wxyz");
    }
    
    public List<String> letterCombinations(String digits) {
        result = new ArrayList<>();
        if (digits.isEmpty()) {
            return result;
        }
        
        backtrack(0, new StringBuilder(), digits);
        return result;
    }
    
    private void backtrack(int index, StringBuilder current, String digits) {
        // Base case: reached the end of digits
        if (index == digits.length()) {
            result.add(current.toString());
            return;
        }
        
        // Get letters for current digit
        String letters = phone.get(digits.charAt(index));
        
        // Try each letter
        for (char letter : letters.toCharArray()) {
            current.append(letter);
            backtrack(index + 1, current, digits);
            current.deleteCharAt(current.length() - 1);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function(digits) {
    if (!digits) return [];
    
    // Digit to letter mapping
    const phone = {
        '2': 'abc',
        '3': 'def',
        '4': 'ghi',
        '5': 'jkl',
        '6': 'mno',
        '7': 'pqrs',
        '8': 'tuv',
        '9': 'wxyz'
    };
    
    const result = [];
    
    function backtrack(index, current) {
        // Base case: reached the end of digits
        if (index === digits.length) {
            result.push(current);
            return;
        }
        
        // Get letters for current digit
        const letters = phone[digits[index]];
        
        // Try each letter
        for (let i = 0; i < letters.length; i++) {
            backtrack(index + 1, current + letters[i]);
        }
    }
    
    backtrack(0, "");
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(4^n × n) - Where n is the length of digits. Each position has at most 4 choices (digit 7 and 9) |
| **Space** | O(n) - Recursion stack depth + output storage |
| **Output Size** | O(4^n × n) - Total characters in all combinations |

---

## Approach 2: Iterative BFS (Level-by-Level)

### Algorithm

Instead of recursion, we can build combinations iteratively:

1. Initialize the result with an empty string
2. For each digit in the input:
   - Create a new list for the next level
   - For each existing combination, append each letter from the current digit
3. Replace the old result with the new combinations

### Code Implementation

````carousel
```python
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        """
        Generate all letter combinations using iterative BFS approach.
        
        Args:
            digits: String containing digits from 2-9
            
        Returns:
            List of all possible letter combinations
        """
        if not digits:
            return []
        
        # Digit to letter mapping
        phone = {
            '2': 'abc',
            '3': 'def',
            '4': 'ghi',
            '5': 'jkl',
            '6': 'mno',
            '7': 'pqrs',
            '8': 'tuv',
            '9': 'wxyz'
        }
        
        # Start with empty combination
        result = [""]
        
        # Process each digit
        for digit in digits:
            letters = phone[digit]
            new_combinations = []
            
            # Build combinations for current digit
            for current in result:
                for letter in letters:
                    new_combinations.append(current + letter)
            
            result = new_combinations
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) {
            return {};
        }
        
        unordered_map<char, string> phone = {
            {'2', "abc"},
            {'3', "def"},
            {'4', "ghi"},
            {'5', "jkl"},
            {'6', "mno"},
            {'7', "pqrs"},
            {'8', "tuv"},
            {'9', "wxyz"}
        };
        
        vector<string> result = {""};
        
        for (char digit : digits) {
            string letters = phone[digit];
            vector<string> new_combinations;
            
            for (const string& current : result) {
                for (char letter : letters) {
                    new_combinations.push_back(current + letter);
                }
            }
            
            result = move(new_combinations);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<String> letterCombinations(String digits) {
        if (digits.isEmpty()) {
            return new ArrayList<>();
        }
        
        Map<Character, String> phone = new HashMap<>();
        phone.put('2', "abc");
        phone.put('3', "def");
        phone.put('4', "ghi");
        phone.put('5', "jkl");
        phone.put('6', "mno");
        phone.put('7', "pqrs");
        phone.put('8', "tuv");
        phone.put('9', "wxyz");
        
        List<String> result = new ArrayList<>();
        result.add("");
        
        for (char digit : digits.toCharArray()) {
            String letters = phone.get(digit);
            List<String> new_combinations = new ArrayList<>();
            
            for (String current : result) {
                for (char letter : letters.toCharArray()) {
                    new_combinations.add(current + letter);
                }
            }
            
            result = new_combinations;
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function(digits) {
    if (!digits) return [];
    
    const phone = {
        '2': 'abc',
        '3': 'def',
        '4': 'ghi',
        '5': 'jkl',
        '6': 'mno',
        '7': 'pqrs',
        '8': 'tuv',
        '9': 'wxyz'
    };
    
    let result = [""];
    
    for (let i = 0; i < digits.length; i++) {
        const letters = phone[digits[i]];
        const new_combinations = [];
        
        for (let j = 0; j < result.length; j++) {
            const current = result[j];
            for (let k = 0; k < letters.length; k++) {
                new_combinations.push(current + letters[k]);
            }
        }
        
        result = new_combinations;
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(4^n × n) - Same as backtracking |
| **Space** | O(4^n × n) - Output storage (no recursion stack) |
| **Benefit** | No recursion overhead, easier to understand for some |

---

## Approach 3: Index-based DFS with StringBuilder

### Algorithm

This approach is similar to backtracking but uses indices to avoid string slicing:

1. Use a `StringBuilder` (or mutable string) for efficient append/removal
2. Pass indices to track current position instead of slicing strings
3. This avoids creating new string objects on each recursive call

### Code Implementation

````carousel
```python
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        """
        Generate all letter combinations using index-based DFS.
        
        Args:
            digits: String containing digits from 2-9
            
        Returns:
            List of all possible letter combinations
        """
        if not digits:
            return []
        
        # Digit to letter mapping
        phone = {
            '2': 'abc',
            '3': 'def',
            '4': 'ghi',
            '5': 'jkl',
            '6': 'mno',
            '7': 'pqrs',
            '8': 'tuv',
            '9': 'wxyz'
        }
        
        res = []
        n = len(digits)
        
        def dfs(index: int, path: list):
            if index == n:
                res.append(''.join(path))
                return
            
            for char in phone[digits[index]]:
                path.append(char)
                dfs(index + 1, path)
                path.pop()
        
        dfs(0, [])
        return res
```

<!-- slide -->
```cpp
class Solution {
private:
    vector<string> result;
    unordered_map<char, string> phone;
    
    void dfs(int index, string& path, const string& digits) {
        if (index == digits.length()) {
            result.push_back(path);
            return;
        }
        
        string letters = phone[digits[index]];
        for (char letter : letters) {
            path.push_back(letter);
            dfs(index + 1, path, digits);
            path.pop_back();
        }
    }
    
public:
    Solution() {
        phone = {
            {'2', "abc"},
            {'3', "def"},
            {'4', "ghi"},
            {'5', "jkl"},
            {'6', "mno"},
            {'7', "pqrs"},
            {'8', "tuv"},
            {'9', "wxyz"}
        };
    }
    
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) {
            return {};
        }
        
        string path;
        dfs(0, path, digits);
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    private List<String> result;
    private Map<Character, String> phone;
    
    public Solution() {
        phone = new HashMap<>();
        phone.put('2', "abc");
        phone.put('3', "def");
        phone.put('4', "ghi");
        phone.put('5', "jkl");
        phone.put('6', "mno");
        phone.put('7', "pqrs");
        phone.put('8', "tuv");
        phone.put('9', "wxyz");
    }
    
    public List<String> letterCombinations(String digits) {
        result = new ArrayList<>();
        if (digits.isEmpty()) {
            return result;
        }
        
        StringBuilder sb = new StringBuilder();
        dfs(0, sb, digits);
        return result;
    }
    
    private void dfs(int index, StringBuilder sb, String digits) {
        if (index == digits.length()) {
            result.add(sb.toString());
            return;
        }
        
        String letters = phone.get(digits.charAt(index));
        for (char letter : letters.toCharArray()) {
            sb.append(letter);
            dfs(index + 1, sb, digits);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function(digits) {
    if (!digits) return [];
    
    const phone = {
        '2': 'abc',
        '3': 'def',
        '4': 'ghi',
        '5': 'jkl',
        '6': 'mno',
        '7': 'pqrs',
        '8': 'tuv',
        '9': 'wxyz'
    };
    
    const result = [];
    
    function dfs(index, path) {
        if (index === digits.length) {
            result.push(path.join(''));
            return;
        }
        
        const letters = phone[digits[index]];
        for (let i = 0; i < letters.length; i++) {
            path.push(letters[i]);
            dfs(index + 1, path);
            path.pop();
        }
    }
    
    dfs(0, []);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(4^n × n) - Same as other approaches |
| **Space** | O(n) - Path array + result storage |
| **Improvement** | More efficient string building, less memory allocation |

---

## Approach 4: Cartesian Product (Python only)

### Algorithm

Using Python's `itertools.product` to compute the Cartesian product:

1. Convert each digit to its letter list
2. Use `itertools.product` to generate all combinations
3. Join each combination into a string

### Code Implementation

````carousel
```python
from itertools import product
from typing import List

class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        """
        Generate all letter combinations using Cartesian product.
        
        Args:
            digits: String containing digits from 2-9
            
        Returns:
            List of all possible letter combinations
        """
        if not digits:
            return []
        
        # Digit to letter mapping
        phone = {
            '2': 'abc',
            '3': 'def',
            '4': 'ghi',
            '5': 'jkl',
            '6': 'mno',
            '7': 'pqrs',
            '8': 'tuv',
            '9': 'wxyz'
        }
        
        # Get letter lists for each digit
        letter_lists = [phone[digit] for digit in digits]
        
        # Compute Cartesian product and join each tuple
        return [''.join(combo) for combo in product(*letter_lists)]
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(4^n × n) - Same complexity, cleaner code |
| **Space** | O(4^n × n) - Output storage |
| **Benefit** | Concise, readable, uses built-in library |

---

## Comparison of Approaches

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| **Recursive Backtracking** | O(4^n × n) | O(n) | Classic, intuitive | String concatenation overhead |
| **Iterative BFS** | O(4^n × n) | O(4^n × n) | No recursion, easy to debug | More memory for intermediate results |
| **Index-based DFS** | O(4^n × n) | O(n) | Memory efficient | Slightly more complex |
| **Cartesian Product** | O(4^n × n) | O(4^n × n) | Very clean code | Python only, less educational |

**Recommendation:** Use recursive backtracking for interviews—it's the most demonstrative of the backtracking pattern. Use iterative BFS for production code in languages without strong recursion support.

---

## Explanation

### Why Backtracking Works

The problem has a natural tree structure:

```
"23"
         a                    b                    c
        / \                  / \                  / \
       d   e   f            d   e   f            d   e   f
      / \ / \ / \          / \ / \ / \          / \ / \ / \
     ad ae af bd be bf cd ce cf
```

Each level of the tree represents one digit, and each node represents adding a letter. Backtracking systematically explores all paths from root to leaf.

### Key Insights

1. **Tree Structure**: The problem naturally forms a n-ary tree where each node has 3-4 children
2. **Complete Exploration**: Every valid combination must be visited exactly once
3. **Backtracking**: The pattern of exploring, recording, and undoing is fundamental to combinatorial problems

### Visualizing the Recursion

For "23":
```
backtrack(0, "")
├── 'a' → backtrack(1, "a")
│       ├── 'd' → backtrack(2, "ad") ✓ add "ad"
│       ├── 'e' → backtrack(2, "ae") ✓ add "ae"
│       └── 'f' → backtrack(2, "af") ✓ add "af"
├── 'b' → backtrack(1, "b")
│       ├── 'd' → backtrack(2, "bd") ✓ add "bd"
│       ├── 'e' → backtrack(2, "be") ✓ add "be"
│       └── 'f' → backtrack(2, "bf") ✓ add "bf"
└── 'c' → backtrack(1, "c")
        ├── 'd' → backtrack(2, "cd") ✓ add "cd"
        ├── 'e' → backtrack(2, "ce") ✓ add "ce"
        └── 'f' → backtrack(2, "cf") ✓ add "cf"
```

---

## Followup Questions

### Q1: How would you modify the solution to return combinations in sorted order?

**Answer:** Sort the input digits first, or sort the output before returning. The recursion naturally explores in lexicographical order if you iterate through letters in alphabetical order (which we do).

### Q2: How would you count the total number of combinations without storing them?

**Answer:** Use the product rule: multiply the number of letters for each digit. For digit '7' or '9', multiply by 4; for others, multiply by 3. For "23": 3 × 3 = 9 combinations.

### Q3: How would you generate combinations one at a time using an iterator?

**Answer:** Use Python generators with `yield`. Convert the recursive function to a generator that yields each combination instead of storing them in a list. This reduces memory usage for large outputs.

### Q4: How would you handle additional constraints like forbidden letter pairs?

**Answer:** Add validation in the recursive step: before recursing, check if the current partial combination violates any constraints. If it does, skip that branch entirely.

### Q5: How would you parallelize this computation?

**Answer:** The problem is embarrassingly parallel. Each top-level letter branch can be computed independently. Use thread pools or process pools to distribute work across available cores.

### Q6: What's the maximum number of combinations for the given constraints?

**Answer:** With max 4 digits (constraint), the worst case is "79" or "97" repeated:
- Each has 4 letters
- Maximum: 4^4 = 256 combinations

### Q7: How would you modify the solution for a 12-key keypad with special characters?

**Answer:** Extend the mapping dictionary to include additional keys. For example, add '0' with " " (space), '*' with punctuation, etc. The algorithm remains identical.

### Q8: How would you generate combinations using bit manipulation?

**Answer:** Use an integer counter from 0 to (total_combinations - 1). For each number, compute the combination by dividing by the letter counts for each digit position (like mixed-radix counting). This provides O(1) access to any specific combination.

---

## Related Problems

- [Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) - Similar backtracking with constraints
- [Subsets](https://leetcode.com/problems/subsets/) - Generate all subsets using backtracking
- [Permutations](https://leetcode.com/problems/permutations/) - Generate all permutations
- [Combination Sum](https://leetcode.com/problems/combination-sum/) - Backtracking with sum constraints
- [Restore IP Addresses](https://leetcode.com/problems/restore-ip-addresses/) - Backtracking for valid IP segments
- [Word Search](https://leetcode.com/problems/word-search/) - 2D backtracking
- [N-Queens](https://leetcode.com/problems/n-queens/) - Classic backtracking with constraints
- [Sudoku Solver](https://leetcode.com/problems/sudoku-solver/) - Complex backtracking puzzle

---

## Video Tutorials

- [Letter Combinations of a Phone Number - LeetCode 17](https://www.youtube.com/watch?v=21O8qE5L1t0)
- [Backtracking Algorithm Explained](https://www.youtube.com/watch?v=DKC8YfNqj2Q)
- [Phone Letter Combinations - Detailed Walkthrough](https://www.youtube.com/watch?v=1KMJ_6n2iwM)
- [DFS vs BFS for Letter Combinations](https://www.youtube.com/watch?v=vB1n16aD-YI)

---

## Summary

The Letter Combinations of a Phone Number problem is a classic backtracking exercise. Key takeaways:

1. **Backtracking Pattern**: Explore → Record → Backtrack (undo) → Continue
2. **Tree Structure**: Each digit creates a level with 3-4 branches
3. **Complexity**: O(4^n) where n is the number of digits
4. **Optimization**: Use StringBuilder/mutable structures for efficiency
5. **Flexibility**: The pattern applies to many combinatorial problems

The recursive backtracking approach is recommended for interviews as it clearly demonstrates the algorithmic pattern. For production, consider iterative approaches to avoid recursion limits.
