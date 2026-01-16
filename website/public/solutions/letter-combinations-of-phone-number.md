# Letter Combinations of a Phone Number

## Problem Description

Given a string containing digits from `2` to `9`, return all **possible letter combinations** that the number could represent on a classic phone keypad.

Each digit maps to a set of letters, similar to the layout on old telephone keypads:

| Digit | Letters |
|-------|---------|
| 2     | abc     |
| 3     | def     |
| 4     | ghi     |
| 5     | jkl     |
| 6     | mno     |
| 7     | pqrs    |
| 8     | tuv     |
| 9     | wxyz    |

This is a classic **backtracking** problem that requires generating all possible combinations by exploring each digit's possibilities.

---

## Examples

### Example 1

**Input:**
```python
digits = "23"
```

**Output:**
```python
["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]
```

**Explanation:** 
- Digit '2' maps to: a, b, c
- Digit '3' maps to: d, e, f
- All combinations: ad, ae, af, bd, be, bf, cd, ce, cf

---

### Example 2

**Input:**
```python
digits = ""
```

**Output:**
```python
[]
```

**Explanation:** An empty input returns an empty list.

---

### Example 3

**Input:**
```python
digits = "2"
```

**Output:**
```python
["a", "b", "c"]
```

**Explanation:** A single digit returns all its mapped letters.

---

### Example 4

**Input:**
```python
digits = "79"
```

**Output:**
```python
["pw", "px", "py", "pz", "qw", "qx", "qy", "qz", "rw", "rx", "ry", "rz", "sw", "sx", "sy", "sz"]
```

**Explanation:** 
- Digit '7' maps to: p, q, r, s
- Digit '9' maps to: w, x, y, z
- 4 × 4 = 16 combinations total

---

## Constraints

- `0 <= digits.length <= 4`
- `digits[i]` is a digit from `'2'` to `'9'`
- `digits` contains only numeric characters

---

## Intuition

The problem has a natural **tree-like structure**:
- Each digit in the input string represents a level in the combination tree
- Each letter in a digit's mapping represents a branch
- We need to traverse this tree to generate all leaf nodes (complete combinations)

### Key Insight

This is a **cartesian product** problem:
- For digits "23", we need the cartesian product of {"a","b","c"} × {"d","e","f"}

**Backtracking** is the ideal approach:
1. Build combinations character by character
2. When a combination reaches full length, add it to results
3. Backtrack to explore alternative choices

---

## Multiple Approaches

### Approach 1: Backtracking (Recursive) - Recommended

**Idea:** Use recursion to build combinations one character at a time. At each position, try all possible letters for that digit.

**Code:**
```python
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return []
        
        # Mapping of digits to letters
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
        
        def backtrack(index: int, path: List[str]):
            # Base case: when path length equals digits length
            if index == len(digits):
                res.append(''.join(path))
                return
            
            # Get all possible letters for current digit
            possible_letters = phone[digits[index]]
            
            for letter in possible_letters:
                # Choose
                path.append(letter)
                # Explore
                backtrack(index + 1, path)
                # Unchoose (backtrack)
                path.pop()
        
        backtrack(0, [])
        return res
```

**Time Complexity:** O(4^n × n) - Each digit has up to 4 letters, and we process each combination of length n  
**Space Complexity:** O(n) - Recursion stack and path list, where n is digits length

---

### Approach 2: Iterative (BFS/Queue)

**Idea:** Use a queue to build combinations level by level, starting with an empty combination.

**Code:**
```python
from collections import deque
from typing import List

class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return []
        
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
        
        queue = deque([''])
        
        for digit in digits:
            level_size = len(queue)
            
            for _ in range(level_size):
                current = queue.popleft()
                
                for letter in phone[digit]:
                    queue.append(current + letter)
        
        return list(queue)
```

**Time Complexity:** O(4^n × n) - Same as backtracking  
**Space Complexity:** O(4^n × n) - Queue stores all combinations at maximum level

---

### Approach 3: Iterative (Product/Accumulation)

**Idea:** Use Python's `itertools.product` or progressively build combinations.

**Code:**
```python
from typing import List
import itertools

class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return []
        
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
        
        # Get list of letter lists for each digit
        letter_lists = [phone[d] for d in digits]
        
        # Use itertools.product to compute cartesian product
        return [''.join(combination) for combination in itertools.product(*letter_lists)]
```

**Time Complexity:** O(4^n × n) - Product generates all combinations  
**Space Complexity:** O(4^n × n) - Stores all combinations

---

### Approach 4: Using Index Arithmetic (No Strings)

**Idea:** For each combination, compute the index into each digit's letter string.

**Code:**
```python
from typing import List

class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return []
        
        phone = ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz']
        
        n = len(digits)
        result = []
        
        # Total combinations = product of number of letters per digit
        total = 1
        for d in digits:
            total *= len(phone[int(d) - 2])
        
        for i in range(total):
            combination = []
            num = i
            
            for j in range(n - 1, -1, -1):
                digit = int(digits[j]) - 2
                letters = phone[digit]
                index = num % len(letters)
                num //= len(letters)
                combination.append(letters[index])
            
            result.append(''.join(reversed(combination)))
        
        return result
```

**Time Complexity:** O(4^n × n)  
**Space Complexity:** O(4^n × n) - Result storage

---

### Approach 5: Bitmask Mapping (Space-Optimized Output)

**Idea:** For memory-constrained scenarios, generate combinations on-the-fly using a counter.

**Code:**
```python
from typing import List, Iterator

class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return []
        
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
        
        # Generator for combinations
        def generate() -> Iterator[str]:
            n = len(digits)
            indices = [0] * n
            
            while True:
                # Build current combination
                yield ''.join(phone[digits[i]][indices[i]] for i in range(n))
                
                # Increment like an odometer
                for pos in reversed(range(n)):
                    indices[pos] += 1
                    if indices[pos] < len(phone[digits[pos]]):
                        break
                    indices[pos] = 0
                else:
                    break
        
        # Collect exactly 'total' combinations
        return list(generate())
```

**Time Complexity:** O(4^n × n)  
**Space Complexity:** O(n) - Only indices array (output not counted)

---

## Time/Space Complexity Summary

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Backtracking (Recursive) | O(4^n × n) | O(n) | **Recommended** - Clean and intuitive |
| Iterative (Queue/BFS) | O(4^n × n) | O(4^n × n) | Easy to understand, uses more memory |
| Iterative (Product) | O(4^n × n) | O(4^n × n) | Pythonic, uses itertools |
| Index Arithmetic | O(4^n × n) | O(4^n × n) | No recursion, but complex |
| Bitmask/Generator | O(4^n × n) | O(n) | Memory-efficient for streaming |

**Where n = len(digits) and 4^n represents the maximum combinations (when all digits are 7 or 9).**

---

## Related Problems

| Problem | Description | Link |
|---------|-------------|------|
| **Generate Parentheses** | Generate all valid parenthesis combinations | [LC 22](https://leetcode.com/problems/generate-parentheses/) / [Solution](./backtracking-parentheses-generation.md) |
| **Combination Sum** | Find all combinations that sum to target | [LC 39](https://leetcode.com/problems/combination-sum/) / [Solution](./backtracking-combination-sum.md) |
| **Subsets** | Generate all possible subsets | [LC 78](https://leetcode.com/problems/subsets/) / [Solution](./backtracking-subsets-include-exclude.md) |
| **Permutations** | Generate all permutations of an array | [LC 46](https://leetcode.com/problems/permutations/) / [Solution](./backtracking-permutations.md) |
| **Restore IP Addresses** | Restore valid IP addresses from string | [LC 93](https://leetcode.com/problems/restore-ip-addresses/) |
| **Word Search** | Find words in a 2D grid | [LC 79](https://leetcode.com/problems/word-search/) / [Solution](./backtracking-word-search-path-finding-in-grid.md) |
| **Palindrome Partitioning** | Partition string into palindromes | [LC 131](https://leetcode.com/problems/palindrome-partitioning/) / [Solution](./backtracking-palindrome-partitioning.md) |

---

## Video Tutorials

1. [NeetCode - Letter Combinations of Phone Number](https://www.youtube.com/watch?v=0snEunUacZY)
2. [Back-to-Back SWE - Letter Combinations](https://www.youtube.com/watch?v=21F9c0x6z8Y)
3. [Derrick G. - Backtracking Masterclass](https://www.youtube.com/watch?v=12lAl6jTE6U)
4. [Fraz - Letter Combinations Explanation](https://www.youtube.com/watch?v=tR0E-53mI7w)

---

## Follow-up Questions

1. **How would you modify the solution to return combinations in sorted order?**  
   The backtracking approach naturally generates combinations in lex order if digits are processed in order.

2. **What if some digits map to custom letter sets?**  
   Pass a mapping dictionary as a parameter and modify the lookup logic.

3. **How would you handle a constraint where certain letter combinations are invalid?**  
   Add a validation function that checks the current partial combination before recursing deeper.

4. **How would you count the number of combinations without generating them?**  
   Simply multiply the number of letters for each digit: `result = product(len(phone[d]) for d in digits)`

5. **What if the input contains digits 0 or 1?**  
   Add a validation check and return empty list, or handle them as special cases.

6. **How would you parallelize this computation?**  
   The work can be split by distributing first-level letter choices across threads/processes.

7. **What if you need to generate combinations in reverse order?**  
   Reverse the letter strings in the phone mapping, or iterate backwards in the result collection.

---

## Summary

The Letter Combinations of a Phone Number problem is a foundational backtracking problem that demonstrates:

- **Tree traversal**: The solution space forms a k-ary tree where k is the max letters per digit
- **Backtracking**: Choose → Explore → Unchoose pattern
- **Cartesian product**: All combinations are the product of letter sets
- **State management**: Tracking the current path through recursion

The recursive backtracking approach is recommended because:
- Clean, intuitive code structure
- O(n) auxiliary space (not counting output)
- Easy to modify for additional constraints
- Natural exploration of the solution tree

Key takeaways:
- Map digits to letters using a dictionary
- Use recursion to build combinations character by character
- Add combination to results when full length is reached
- Backtrack by removing the last character to explore alternatives

