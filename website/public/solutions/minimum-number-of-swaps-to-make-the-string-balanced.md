# Minimum Number Of Swaps To Make The String Balanced

## Problem Description

You are given a 0-indexed string `s` of even length `n`. The string consists of exactly `n / 2` opening brackets `'['` and `n / 2` closing brackets `']'`.

A string is called balanced if and only if:
- It is the empty string, or
- It can be written as `AB`, where both `A` and `B` are balanced strings, or
- It can be written as `[C]`, where `C` is a balanced string.

You may swap the brackets at any two indices any number of times. Return the minimum number of swaps to make `s` balanced.

**Link to problem:** [Minimum Number of Swaps to Make the String Balanced - LeetCode 1963](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced/)

## Constraints
- `n == s.length`
- `2 <= n <= 10^6`
- `n` is even
- `s[i]` is either `'['` or `']'`
- The number of opening brackets `'['` equals `n / 2`, and the number of closing brackets `']'` equals `n / 2`

---

## Pattern: Greedy - Balance Tracking

This problem is a classic example of the **Greedy - Balance Tracking** pattern. The pattern involves tracking imbalance and calculating minimum swaps needed.

### Core Concept

- **Track Balance**: Maintain a counter for unmatched closing brackets
- **Maximum Imbalance**: Find the maximum deficit (most negative balance)
- **Swap Calculation**: Each swap fixes two misplaced brackets

---

## Examples

### Example

**Input:**
```
s = "][]["
```

**Output:**
```
1
```

**Explanation:** Swap index 0 with index 3: "][][" → "[[]]"

### Example 2

**Input:**
```
s = "]]][[["
```

**Output:**
```
2
```

**Explanation:**
- Swap indices (0,4): "]]][[[" → "[]][]["
- Swap indices (1,5): "[]][][" → "[[][]]"

### Example 3

**Input:**
```
s = "[]"
```

**Output:**
```
0
```

---

## Intuition

The key insight is that we only need to track the minimum balance (most negative value). This tells us how many closing brackets are "waiting" to be matched. Each swap can fix two problems: moving a closing bracket past an opening bracket.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Greedy Approach (Optimal)** - O(n) time, O(1) space
2. **Stack-based Approach** - O(n) time, O(n) space

---

## Approach 1: Greedy Approach

## Approach 1: Greedy Approach

This is the optimal solution that tracks the minimum balance in a single pass.

### Algorithm Steps

1. Initialize `balance = 0` and `min_balance = 0`
2. Iterate through each character in the string:
   - If character is '[', increment balance
   - If character is ']', decrement balance
   - Update min_balance to track the minimum (most negative) balance
3. Calculate swaps using formula: `(-min_balance + 1) // 2`
4. Return the number of swaps

### Why It Works

The key insight is that we only need to track the minimum balance (most negative value). This tells us how many closing brackets are "waiting" to be matched. Each swap can fix two problems: moving a closing bracket past an opening bracket.

### Code Implementation

````carousel
```python
class Solution:
    def minSwaps(self, s: str) -> int:
        """
        Find minimum swaps to balance the string.
        
        Args:
            s: String of brackets
            
        Returns:
            Minimum number of swaps needed
        """
        balance = 0
        min_balance = 0
        
        for c in s:
            if c == '[':
                balance += 1
            else:
                balance -= 1
            min_balance = min(min_balance, balance)
        
        # Each swap fixes 2 misplaced brackets
        # Formula: (-min_balance + 1) // 2
        return (-min_balance + 1) // 2
```

<!-- slide -->
```cpp
class Solution {
public:
    int minSwaps(string s) {
        int balance = 0;
        int min_balance = 0;
        
        for (char c : s) {
            if (c == '[') {
                balance++;
            } else {
                balance--;
            }
            min_balance = min(min_balance, balance);
        }
        
        return (-min_balance + 1) / 2;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minSwaps(String s) {
        int balance = 0;
        int minBalance = 0;
        
        for (char c : s.toCharArray()) {
            if (c == '[') {
                balance++;
            } else {
                balance--;
            }
            minBalance = Math.min(minBalance, balance);
        }
        
        return (-minBalance + 1) / 2;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {number}
 */
var minSwaps = function(s) {
    let balance = 0;
    let minBalance = 0;
    
    for (const c of s) {
        if (c === '[') {
            balance++;
        } else {
            balance--;
        }
        minBalance = Math.min(minBalance, balance);
    }
    
    return Math.floor((-minBalance + 1) / 2);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass |
| **Space** | O(1) - only variables |

---

## Approach 2: Stack-based Approach

This approach uses a stack to track unmatched opening brackets and simulates the swapping process.

### Problem Description

Given a string of brackets, find the minimum number of swaps needed to make it balanced using a stack-based simulation approach.

### Algorithm Steps

1. Initialize an empty stack and result counter
2. Iterate through each character:
   - If character is '[', push its index onto the stack
   - If character is ']':
     - If stack is not empty, pop the matched '[' index
     - If stack is empty, this ']' needs a swap: increment swap count and push current index (as a placeholder for the swapped '[')
3. Return the swap count

### Why It Works

The stack tracks unmatched opening brackets. When we encounter a closing bracket without a match, we need to swap it with an opening bracket from later in the string. Each such swap fixes the current imbalance and creates a match for future closing brackets.

### Code Implementation

````carousel
```python
class Solution:
    def minSwaps_stack(self, s: str) -> int:
        """
        Find minimum swaps using stack-based approach.
        
        Args:
            s: String of brackets
            
        Returns:
            Minimum number of swaps needed
        """
        stack = []
        swaps = 0
        
        for c in s:
            if c == '[':
                stack.append(c)
            else:
                # Closing bracket
                if stack:
                    stack.pop()
                else:
                    # No match available, need to swap
                    swaps += 1
                    # After swap, we have an extra '[' to match future ']'
                    stack.append('[')
        
        return swaps
```

<!-- slide -->
```cpp
class Solution {
public:
    int minSwaps(string s) {
        vector<char> stack;
        int swaps = 0;
        
        for (char c : s) {
            if (c == '[') {
                stack.push_back(c);
            } else {
                if (!stack.empty()) {
                    stack.pop_back();
                } else {
                    swaps++;
                    stack.push_back('[');
                }
            }
        }
        
        return swaps;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minSwaps(String s) {
        Stack<Character> stack = new Stack<>();
        int swaps = 0;
        
        for (char c : s.toCharArray()) {
            if (c == '[') {
                stack.push(c);
            } else {
                if (!stack.isEmpty()) {
                    stack.pop();
                } else {
                    swaps++;
                    stack.push('[');
                }
            }
        }
        
        return swaps;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {number}
 */
var minSwaps = function(s) {
    const stack = [];
    let swaps = 0;
    
    for (const c of s) {
        if (c === '[') {
            stack.push(c);
        } else {
            if (stack.length > 0) {
                stack.pop();
            } else {
                swaps++;
                stack.push('[');
            }
        }
    }
    
    return swaps;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass |
| **Space** | O(n) - stack storage |

---

## Comparison of Approaches

| Aspect | Greedy Approach | Stack-based |
|--------|----------------|-------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) |
| **Implementation** | Simple formula | Stack simulation |
| **LeetCode Optimal** | ✅ Yes | ❌ No |
| **Best For** | Space-constrained | Understanding the process |

**Best Approach:** The greedy approach is optimal with O(1) space and is the preferred solution. The stack-based approach helps understand the problem intuitively.

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Add to Make Parentheses Valid | [Link](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/) | Similar balance tracking |
| Score of Parentheses | [Link](https://leetcode.com/problems/score-of-parentheses/) | Balanced strings |

---

## Follow-up Questions

### Q1: Why formula (-min_balance + 1) / 2?

**Answer:** Each swap moves one '[' from right to left, fixing two imbalances. With min_balance = -x, we need (x+1)/2 swaps.

---

### Q2: Does the string length matter?

**Answer:** Only the minimum balance matters. Length ensures equal numbers of '[' and ']'.

---

## Common Pitfalls

### 1. Integer Division
**Issue**: Using integer division incorrectly.

**Solution**: Use `(-min_balance + 1) // 2` (floor division) to ensure correct rounding.

### 2. Balance Tracking
**Issue**: Not tracking minimum balance correctly.

**Solution**: Update min_balance after each character, not just at the end.

### 3. Negative Values
**Issue**: Not handling negative balance properly.

**Solution**: The formula works because min_balance is negative or zero.

### 4. Edge Cases
**Issue**: Not handling already balanced strings.

**Solution**: If min_balance = 0, formula returns 0, which is correct.

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

- [NeetCode - Minimum Swaps to Balance](https://www.youtube.com/watch?v=SuJyGk1kG5E) - Clear explanation
- [Greedy Approach Explained](https://www.youtube.com/watch?v=qH0bgiMuj9U) - Detailed walkthrough
- [LeetCode Official](https://www.youtube.com/watch?v=3Q_o3J3qGiY) - Official solution

---

## Summary

The **Minimum Number of Swaps to Make the String Balanced** problem demonstrates **Greedy Balance Tracking**:
- **Two approaches**: Greedy (optimal O(1) space) and Stack-based (O(n) space)
- Track minimum balance in single pass
- Calculate swaps from maximum deficit
- O(n) time, O(1) space (greedy)

The greedy approach is optimal and preferred, while stack-based helps understand the problem intuitively.
