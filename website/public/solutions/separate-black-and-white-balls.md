# Separate Black and White Balls

## Problem Description

There are `n` balls on a table, each ball has a color black or white. You are given a 0-indexed binary string `s` of length `n`, where `1` and `0` represent black and white balls, respectively.

In each step, you can choose two adjacent balls and swap them. Return the minimum number of steps to group all the black balls to the right and all the white balls to the left.

**LeetCode Link:** [Separate Black and White Balls](https://leetcode.com/problems/separate-black-and-white-balls/)

---

## Examples

**Example 1:**
- Input: `s = "101"`
- Output: `1`

Explanation: Swap `s[0]` and `s[1]`, resulting in `"011"`. Initially, `1`s are not grouped together, requiring at least 1 step to group them to the right.

**Example 2:**
- Input: `s = "100"`
- Output: `2`

Explanation:
- Swap `s[0]` and `s[1]`, `s = "010"`
- Swap `s[1]` and `s[2]`, `s = "001"`
It can be proven that the minimum number of steps needed is 2.

**Example 3:**
- Input: `s = "0111"`
- Output: `0`

Explanation: All the black balls are already grouped to the right.

---

## Constraints

- `1 <= n == s.length <= 10^5`
- `s[i]` is either `'0'` or `'1'`

---

## Pattern: Greedy Counting

This problem uses **Greedy** approach. Count 1s (black) seen so far, add to swaps when encountering 0.

### Core Concept

- **Greedy Strategy**: Each '0' must swap with all preceding '1's
- **Cumulative Count**: Track black balls encountered
- **Minimum Swaps**: Sum of all required swaps

---

## Intuition

The key insight for this problem is understanding how adjacent swaps accumulate:

1. **Each '0' Must Move Left**:
   - To group whites to the left, each '0' must pass all preceding '1's
   - This requires exactly (number of 1s before this 0) swaps

2. **Why Greedy Works**:
   - The order of swaps doesn't matter for total count
   - Each '1' must pass each '0' that comes before it in final position
   - Total swaps = sum over all '0's of (1s before that position)

3. **Example Walkthrough**:
   - s = "101": 
     - Position 0: '1' → black_count = 1
     - Position 1: '0' → swaps += 1 (this '0' must pass the '1' at position 0)
     - Position 2: '1' → black_count = 2
     - Total swaps = 1

4. **Alternative View**:
   - Think of each '1' moving right
   - Each '1' must move past all '0's that end up to its right
   - Same count!

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Greedy Counting** - Forward pass
2. **Reverse Counting** - Alternative view

---

## Approach 1: Greedy Counting (Forward Pass)

### Algorithm Steps

1. Initialize swaps = 0, black_count = 0
2. Iterate through string left to right
3. For each character:
   - If '0': add black_count to swaps
   - If '1': increment black_count
4. Return swaps

### Why It Works

Each '0' must be swapped past all '1's that come before it. The greedy approach counts exactly these required swaps.

### Code Implementation

````carousel
```python
class Solution:
    def minimumSteps(self, s: str) -> int:
        swaps = 0
        black_count = 0
        
        for char in s:
            if char == '0':
                # This '0' must pass all preceding '1's
                swaps += black_count
            else:
                # Count this '1' for future '0's
                black_count += 1
        
        return swaps
```

<!-- slide -->
```cpp
#include <string>
using namespace std;

class Solution {
public:
    long long minimumSteps(string s) {
        long long swaps = 0;
        long long black_count = 0;
        
        for (char c : s) {
            if (c == '0') {
                swaps += black_count;
            } else {
                black_count++;
            }
        }
        
        return swaps;
    }
};
```

<!-- slide -->
```java
class Solution {
    public long minimumSteps(String s) {
        long swaps = 0;
        long blackCount = 0;
        
        for (char c : s.toCharArray()) {
            if (c == '0') {
                swaps += blackCount;
            } else {
                blackCount++;
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
var minimumSteps = function(s) {
    let swaps = 0;
    let blackCount = 0;
    
    for (const c of s) {
        if (c === '0') {
            swaps += blackCount;
        } else {
            blackCount++;
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
| **Space** | O(1) - constant extra space |

---

## Approach 2: Reverse Counting

### Algorithm Steps

1. Initialize swaps = 0, white_count = 0
2. Iterate through string right to left
3. For each character:
   - If '1': add white_count to swaps
   - If '0': increment white_count
4. Return swaps

### Why It Works

Viewing from the perspective of '1's moving right gives same result.

### Code Implementation

````carousel
```python
class Solution:
    def minimumSteps(self, s: str) -> int:
        swaps = 0
        white_count = 0
        
        for char in reversed(s):
            if char == '1':
                swaps += white_count
            else:
                white_count += 1
        
        return swaps
```

<!-- slide -->
```cpp
class Solution {
public:
    long long minimumSteps(string s) {
        long long swaps = 0;
        long long white_count = 0;
        
        for (int i = s.length() - 1; i >= 0; i--) {
            if (s[i] == '1') {
                swaps += white_count;
            } else {
                white_count++;
            }
        }
        
        return swaps;
    }
};
```

<!-- slide -->
```java
class Solution {
    public long minimumSteps(String s) {
        long swaps = 0;
        long whiteCount = 0;
        
        for (int i = s.length() - 1; i >= 0; i--) {
            if (s.charAt(i) == '1') {
                swaps += whiteCount;
            } else {
                whiteCount++;
            }
        }
        
        return swaps;
    }
}
```

<!-- slide -->
```javascript
var minimumSteps = function(s) {
    let swaps = 0;
    let whiteCount = 0;
    
    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] === '1') {
            swaps += whiteCount;
        } else {
            whiteCount++;
        }
    }
    
    return swaps;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Forward Pass | Reverse Pass |
|--------|--------------|--------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Simple | Simple |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Easy | Easy |

**Best Approach:** Use either approach; both are equivalent.

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Swaps to Group Ones Together | [Link](https://leetcode.com/problems/minimum-swaps-to-group-ones-together/) | Similar problem |
| Minimum Adjacent Swaps for K Consecutive Ones | [Link](https://leetcode.com/problems/minimum-adjacent-swaps-for-k-consecutive-ones/) | Advanced version |

---

## Video Tutorial Links

1. **[NeetCode - Separate Black and White Balls](https://www.youtube.com/watch?v=EXAMPLE)** - Clear explanation
2. **[Greedy Algorithm Basics](https://www.youtube.com/watch?v=EXAMPLE)** - Understanding greedy approach

---

## Follow-up Questions

### Q1: What if we wanted whites to the right and blacks to the left?

**Answer:** Just reverse the logic - count '0's and add to swaps when seeing '1'.

---

### Q2: Can you solve without counting?

**Answer:** You could simulate swaps, but that would be O(n²) in worst case.

---

### Q3: How does the answer change with more ball colors?

**Answer:** With more colors, it becomes more complex. The general problem requires position-based calculations for each color group.

---

## Common Pitfalls

### 1. Order of Processing
**Issue**: Processing right to left when should be left to right.

**Solution**: Remember each '0' needs to pass preceding '1's.

### 2. Integer Overflow
**Issue**: Large n can cause overflow with int.

**Solution**: Use long (64-bit) for swaps counter.

### 3. Counting Wrong Character
**Issue**: Counting '0's when should count '1's.

**Solution**: Double-check: '0' moves left past all '1's before it.

---

## Summary

The **Separate Black and White Balls** problem demonstrates:
- **Greedy counting**: Accumulate required swaps
- **Prefix sums**: Count elements before current position
- **Minimum swaps**: Each '0' must pass all preceding '1's

Key takeaways:
1. Each '0' requires swapping with all preceding '1's
2. Count black balls as we iterate
3. Add count to swaps when seeing '0'
4. Use long for large inputs

This problem is essential for understanding greedy algorithms with counting.

---

### Pattern Summary

This problem exemplifies the **Greedy Counting** pattern, characterized by:
- Accumulating counts while iterating
- Greedy choice at each step
- O(n) time with O(1) space
- Counting elements before current position

For more details on this pattern, see the **[Greedy Pattern](/patterns/greedy)**.
