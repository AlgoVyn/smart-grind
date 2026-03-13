# Move Pieces To Obtain A String

## LeetCode Link

[LeetCode 777 - Swap Adjacent in LR String](https://leetcode.com/problems/swap-adjacent-in-lr-string/)

---

## Problem Description

You are given two strings `start` and `target`, both of length `n`. Each string consists only of the characters `'L'`, `'R'`, and `'_'` where:

- The characters `'L'` and `'R'` represent pieces, where a piece `'L'` can move to the left only if there is a blank space directly to its left, and a piece `'R'` can move to the right only if there is a blank space directly to its right.
- The character `'_'` represents a blank space that can be occupied by any of the `'L'` or `'R'` pieces.

Return `true` if it is possible to obtain the string `target` by moving the pieces of the string `start` any number of times. Otherwise, return `false`.

---

## Examples

### Example 1

**Input:**
```
start = "_L__R__R_", target = "L______RR"
```

**Output:**
```
true
```

**Explanation:**
We can obtain the string `target` from `start` by doing the following moves:
- Move the first piece one step to the left, `start` becomes equal to `"L___R__R_"`.
- Move the last piece one step to the right, `start` becomes equal to `"L___R___R"`.
- Move the second piece three steps to the right, `start` becomes equal to `"L______RR"`.

### Example 2

**Input:**
```
start = "R_L_", target = "__LR"
```

**Output:**
```
false
```

**Explanation:**
The `'R'` piece in the string `start` can move one step to the right to obtain `"_RL_"`.
After that, no pieces can move anymore, so it is impossible to obtain the string `target` from `start`.

### Example 3

**Input:**
```
start = "_R", target = "R_"
```

**Output:**
```
false
```

**Explanation:**
The piece in the string `start` can move only to the right, so it is impossible to obtain the string `target` from `start`.

---

## Constraints

- `n == start.length == target.length`
- `1 <= n <= 10^5`
- `start` and `target` consist of the characters `'L'`, `'R'`, and `'_'`.

---

## Pattern: Two Pointer String Comparison

This problem uses **Two Pointers** to compare character positions in start and target strings, checking if movement constraints are satisfied.

---

## Intuition

The key insight for this problem is understanding the movement constraints for L and R pieces:

### Key Observations

1. **L Movement Constraint**: An 'L' can only move LEFT, meaning its position in start must be >= its position in target.

2. **R Movement Constraint**: An 'R' can only move RIGHT, meaning its position in start must be <= its position in target.

3. **Character Order**: Both strings must contain the same characters (ignoring underscores) in the same order.

4. **Skip Underscores**: Both pointers must skip '_' characters to find actual pieces.

### Algorithm Overview

1. **Check character match**: Verify start.replace('_', '') == target.replace('_', '')
2. **Two-pointer traversal**: 
   - Skip underscores in both strings
   - For each matching character pair:
     - If 'L': start_pos >= target_pos (can only move left)
     - If 'R': start_pos <= target_pos (can only move right)
3. **Return result**: True if all constraints satisfied

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two Pointers** - Optimal solution
2. **Index Array** - Alternative approach

---

## Approach 1: Two Pointers (Optimal)

### Algorithm Steps

1. First check if character sets match (ignoring '_')
2. Use two pointers to traverse both strings
3. Skip underscores in both strings
4. For each non-underscore character pair:
   - Check movement constraints
5. Return true if all checks pass

### Why It Works

The two-pointer approach directly checks the movement constraints. By processing characters in order and verifying position constraints, we ensure the transformation is possible.

### Code Implementation

````carousel
```python
class Solution:
    def canChange(self, start: str, target: str) -> bool:
        # First, check if the non-blank characters match
        if start.replace('_', '') != target.replace('_', ''):
            return False
        
        i, j = 0, 0
        n = len(start)
        
        # Use two pointers to ensure 'L' can only move left and 'R' can only move right
        while i < n and j < n:
            # Skip blanks in start
            while i < n and start[i] == '_':
                i += 1
            # Skip blanks in target
            while j < n and target[j] == '_':
                j += 1
            
            if i < n and j < n:
                # Check if characters match
                if start[i] != target[j]:
                    return False
                # Check movement constraints
                if start[i] == 'L' and i < j:
                    return False
                if start[i] == 'R' and i > j:
                    return False
                i += 1
                j += 1
        
        return True
```

<!-- slide -->
```cpp
class Solution {
public:
    bool canChange(string start, string target) {
        // Check if non-blank characters match
        string s1, s2;
        for (char c : start) if (c != '_') s1 += c;
        for (char c : target) if (c != '_') s2 += c;
        if (s1 != s2) return false;
        
        int n = start.length();
        int i = 0, j = 0;
        
        while (i < n && j < n) {
            // Skip blanks in start
            while (i < n && start[i] == '_') i++;
            // Skip blanks in target
            while (j < n && target[j] == '_') j++;
            
            if (i < n && j < n) {
                if (start[i] != target[j]) return false;
                if (start[i] == 'L' && i < j) return false;
                if (start[i] == 'R' && i > j) return false;
                i++;
                j++;
            }
        }
        
        return true;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean canChange(String start, String target) {
        // Check if non-blank characters match
        StringBuilder s1 = new StringBuilder();
        StringBuilder s2 = new StringBuilder();
        
        for (char c : start.toCharArray()) {
            if (c != '_') s1.append(c);
        }
        for (char c : target.toCharArray()) {
            if (c != '_') s2.append(c);
        }
        
        if (!s1.toString().equals(s2.toString())) {
            return false;
        }
        
        int n = start.length();
        int i = 0, j = 0;
        
        while (i < n && j < n) {
            // Skip blanks in start
            while (i < n && start.charAt(i) == '_') i++;
            // Skip blanks in target
            while (j < n && target.charAt(j) == '_') j++;
            
            if (i < n && j < n) {
                if (start.charAt(i) != target.charAt(j)) return false;
                if (start.charAt(i) == 'L' && i < j) return false;
                if (start.charAt(i) == 'R' && i > j) return false;
                i++;
                j++;
            }
        }
        
        return true;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} start
 * @param {string} target
 * @return {boolean}
 */
var canChange = function(start, target) {
    // Check if non-blank characters match
    const s1 = start.replace(/_/g, '');
    const s2 = target.replace(/_/g, '');
    if (s1 !== s2) return false;
    
    const n = start.length;
    let i = 0, j = 0;
    
    while (i < n && j < n) {
        // Skip blanks in start
        while (i < n && start[i] === '_') i++;
        // Skip blanks in target
        while (j < n && target[j] === '_') j++;
        
        if (i < n && j < n) {
            if (start[i] !== target[j]) return false;
            if (start[i] === 'L' && i < j) return false;
            if (start[i] === 'R' && i > j) return false;
            i++;
            j++;
        }
    }
    
    return true;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) — single pass through strings |
| **Space** | O(1) — constant extra space |

---

## Approach 2: Index Array (Alternative)

### Algorithm Steps

1. Collect indices of L and R in both strings
2. Compare positions respecting movement constraints

### Why It Works

This approach separates L and R handling for clearer logic. Both approaches have the same complexity.

### Code Implementation

````carousel
```python
class Solution:
    def canChange(self, start: str, target: str) -> bool:
        # Check if non-blank characters match
        if start.replace('_', '') != target.replace('_', ''):
            return False
        
        # Get positions of L and R in start and target
        start_L = [i for i, c in enumerate(start) if c == 'L']
        start_R = [i for i, c in enumerate(start) if c == 'R']
        target_L = [i for i, c in enumerate(target) if c == 'L']
        target_R = [i for i, c in enumerate(target) if c == 'R']
        
        # L can only move left: start pos >= target pos
        for s, t in zip(start_L, target_L):
            if s < t:
                return False
        
        # R can only move right: start pos <= target pos
        for s, t in zip(start_R, target_R):
            if s > t:
                return False
        
        return True
```

<!-- slide -->
```cpp
class Solution {
public:
    bool canChange(string start, string target) {
        // Check if non-blank characters match
        string s1, s2;
        for (char c : start) if (c != '_') s1 += c;
        for (char c : target) if (c != '_') s2 += c;
        if (s1 != s2) return false;
        
        // Get positions
        vector<int> startL, startR, targetL, targetR;
        for (int i = 0; i < start.length(); i++) {
            if (start[i] == 'L') startL.push_back(i);
            if (start[i] == 'R') startR.push_back(i);
        }
        for (int i = 0; i < target.length(); i++) {
            if (target[i] == 'L') targetL.push_back(i);
            if (target[i] == 'R') targetR.push_back(i);
        }
        
        // L: start >= target (can only move left)
        for (int i = 0; i < startL.size(); i++) {
            if (startL[i] < targetL[i]) return false;
        }
        
        // R: start <= target (can only move right)
        for (int i = 0; i < startR.size(); i++) {
            if (startR[i] > targetR[i]) return false;
        }
        
        return true;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean canChange(String start, String target) {
        // Check if non-blank characters match
        StringBuilder s1 = new StringBuilder();
        StringBuilder s2 = new StringBuilder();
        
        for (char c : start.toCharArray()) {
            if (c != '_') s1.append(c);
        }
        for (char c : target.toCharArray()) {
            if (c != '_') s2.append(c);
        }
        
        if (!s1.toString().equals(s2.toString())) {
            return false;
        }
        
        // Get positions
        List<Integer> startL = new ArrayList<>();
        List<Integer> startR = new ArrayList<>();
        List<Integer> targetL = new ArrayList<>();
        List<Integer> targetR = new ArrayList<>();
        
        for (int i = 0; i < start.length(); i++) {
            if (start.charAt(i) == 'L') startL.add(i);
            if (start.charAt(i) == 'R') startR.add(i);
        }
        for (int i = 0; i < target.length(); i++) {
            if (target.charAt(i) == 'L') targetL.add(i);
            if (target.charAt(i) == 'R') targetR.add(i);
        }
        
        // L: start >= target
        for (int i = 0; i < startL.size(); i++) {
            if (startL.get(i) < targetL.get(i)) return false;
        }
        
        // R: start <= target
        for (int i = 0; i < startR.size(); i++) {
            if (startR.get(i) > targetR.get(i)) return false;
        }
        
        return true;
    }
}
```

<!-- slide -->
```javascript
var canChange = function(start, target) {
    // Check if non-blank characters match
    const s1 = start.replace(/_/g, '');
    const s2 = target.replace(/_/g, '');
    if (s1 !== s2) return false;
    
    // Get positions
    const startL = [], startR = [], targetL = [], targetR = [];
    for (let i = 0; i < start.length; i++) {
        if (start[i] === 'L') startL.push(i);
        if (start[i] === 'R') startR.push(i);
    }
    for (let i = 0; i < target.length; i++) {
        if (target[i] === 'L') targetL.push(i);
        if (target[i] === 'R') targetR.push(i);
    }
    
    // L: start >= target
    for (let i = 0; i < startL.length; i++) {
        if (startL[i] < targetL[i]) return false;
    }
    
    // R: start <= target
    for (let i = 0; i < startR.length; i++) {
        if (startR[i] > targetR[i]) return false;
    }
    
    return true;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) — single pass to collect indices |
| **Space** | O(n) — storing indices |

---

## Comparison of Approaches

| Aspect | Two Pointers | Index Array |
|--------|--------------|-------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) |
| **Implementation** | Simple | Moderate |

**Best Approach:** Use Approach 1 (Two Pointers) for O(1) space.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Facebook
- **Difficulty**: Easy/Medium
- **Concepts Tested**: Two pointers, String manipulation, Movement constraints

### Learning Outcomes

1. **Two Pointer Pattern**: Master two-pointer technique for string problems
2. **Movement Constraints**: Understand directional movement restrictions
3. **Edge Case Handling**: Learn to handle underscores and boundary cases

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| String After Replacement | [Link](https://leetcode.com/problems/string-after-replacement/) | String manipulation |
| Transform to Chessboard | [Link](https://leetcode.com/problems/transform-to-chessboard/) | Array transformation |

### Pattern Reference

For more details, see:
- **[Two Pointers Pattern](/patterns/two-pointers-fast-slow-cycle-detection)**

---

## Video Tutorial Links

1. **[NeetCode - Swap Adjacent in LR String](https://www.youtube.com/watch?v=aM1A3e7y1Jc)** - Clear explanation
2. **[Two Pointers Tutorial](https://www.youtube.com/watch?v=Kv2rJ4D-1mU)** - Two pointers technique

---

## Follow-up Questions

### Q1: How would you modify the solution if pieces could move multiple steps?

**Answer:** The current solution already handles multi-step movement. The constraint checks position differences, not number of moves.

---

### Q2: What if L could also move right in some cases?

**Answer:** Would need to modify the constraint check. The current logic depends on L only moving left and R only moving right.

---

### Q3: How would you handle an invalid input where positions don't match?

**Answer:** The first check `start.replace('_', '') != target.replace('_', '')` handles this - it ensures character sets match.

---

### Q4: Can you solve this using recursion?

**Answer:** Not recommended - iterative solution is cleaner and more efficient. Recursion would require more complex state tracking.

---

## Common Pitfalls

### 1. Character Order Check
**Issue**: Must verify start.replace('_', '') == target.replace('_', '') first.

**Solution**: Add this check at the beginning.

### 2. L Direction
**Issue**: L in start can only move left, so start position >= target position.

**Solution**: Check `if start[i] == 'L' and i < j: return False`.

### 3. R Direction
**Issue**: R in start can only move right, so start position <= target position.

**Solution**: Check `if start[i] == 'R' and i > j: return False`.

### 4. Skip Underscores
**Issue**: Both pointers must skip '_' characters to find actual pieces.

**Solution**: Use while loops to skip underscores in both strings.

---

## Summary

The **Move Pieces to Obtain a String** problem demonstrates the two-pointer technique:

- **Directional Movement**: L can only move left, R can only move right
- **Two Pointer Solution**: O(n) time, O(1) space
- **Position Constraints**: Key to solving the problem

Key takeaways:
1. L can only move left: start_pos >= target_pos
2. R can only move right: start_pos <= target_pos
3. Character sets must match (ignoring underscores)
4. Skip underscores in both strings during traversal

This problem is excellent for learning two-pointer techniques and string manipulation.

### Pattern Summary

This problem exemplifies the **Two Pointers** pattern, characterized by:
- Simultaneous traversal of multiple sequences
- O(1) space complexity
- Direct constraint checking

---

## Additional Resources

- [LeetCode 777 - Swap Adjacent in LR String](https://leetcode.com/problems/swap-adjacent-in-lr-string/) - Official problem page
- [Two Pointers - GeeksforGeeks](https://www.geeksforgeeks.org/two-pointer-technique/) - Two pointers basics
- [Pattern: Two Pointers](/patterns/two-pointers-fast-slow-cycle-detection) - Related pattern
