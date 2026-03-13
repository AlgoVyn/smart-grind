# Asteroid Collision

## Problem Description

We are given an array `asteroids` of integers representing asteroids in a row. The indices of the asteroid in the array represent their relative position in space.
For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.
Find out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.

**Link to problem:** [Asteroid Collision - LeetCode 735](https://leetcode.com/problems/asteroid-collision/)

---

## Pattern: Stack - Collision Simulation

This problem exemplifies the **Stack - Collision Simulation** pattern. The key insight is to use a stack to simulate the asteroid collisions, where we only need to check for collisions when a left-moving asteroid meets a right-moving one.

### Core Concept

The fundamental steps are:
1. Process asteroids from left to right
2. Use a stack to keep track of surviving asteroids
3. When encountering a left-moving asteroid, check for collisions with right-moving ones on the stack
4. Resolve collisions: smaller explodes, equal size both explode

---

## Examples

### Example

**Input:**
```
asteroids = [5,10,-5]
```

**Output:**
```
[5,10]
```

**Explanation:** The 10 and -5 collide resulting in 10. The 5 and 10 never collide.

### Example 2

**Input:**
```
asteroids = [8,-8]
```

**Output:**
```
[]
```

**Explanation:** The 8 and -8 collide exploding each other.

### Example 3

**Input:**
```
asteroids = [10,2,-5]
```

**Output:**
```
[10]
```

**Explanation:** The 2 and -5 collide resulting in -5. The 10 and -5 collide resulting in 10.

### Example 4

**Input:**
```
asteroids = [3,5,-6,2,-1,4]
```

**Output:**
```
[-6,2,4]
```

**Explanation:** The asteroid -6 makes the asteroid 3 and 5 explode, and then continues going left. On the other side, the asteroid 2 makes the asteroid -1 explode and then continues going right, without reaching asteroid 4.

---

## Constraints

- `2 <= asteroids.length <= 10^4`
- `-1000 <= asteroids[i] <= 1000`
- `asteroids[i] != 0`

---

## Intuition

The key insight is:

1. **Only left-moving asteroids can collide**: Right-moving asteroids will never collide with anything to their left since everything is also moving right (or stationary).

2. **Stack simulates the process**: We iterate through asteroids, and when we see a left-moving one (-), we check if it collides with any right-moving (+) asteroids on our stack.

3. **Collision resolution**: 
   - If stack top < current: stack top explodes (pop)
   - If stack top == current: both explode (pop stack top, don't add current)
   - If stack top > current: current explodes (don't add to stack)

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Stack Simulation** - Optimal O(n) time, O(n) space
2. **Two Pointers** - O(1) extra space
3. **Array Simulation** - Alternative implementation

---

## Approach 1: Stack Simulation (Optimal)

This is the most efficient approach using a stack to simulate collisions.

### Algorithm Steps

1. Create an empty stack
2. For each asteroid in the array:
   - While stack is not empty AND top is positive AND current is negative:
     - Compare sizes and resolve collision
     - Pop from stack if destroyed
   - If current asteroid survives, push to stack
3. Return the stack contents

### Why It Works

The stack always contains asteroids moving right (or stationary) that haven't found a left-moving asteroid to destroy them. When we encounter a left-moving asteroid, we only need to check these right-moving ones for collisions.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        """
        Simulate asteroid collisions using stack.
        
        Args:
            asteroids: List of asteroid sizes and directions
            
        Returns:
            List of surviving asteroids
        """
        stack = []
        
        for ast in asteroids:
            # Check for collisions while:
            # - stack is not empty
            # - top of stack is moving right (positive)
            # - current asteroid is moving left (negative)
            while stack and stack[-1] > 0 and ast < 0:
                if stack[-1] < -ast:
                    # Stack top is smaller, it explodes
                    stack.pop()
                    continue  # Check again with new top
                elif stack[-1] == -ast:
                    # Both are same size, both explode
                    stack.pop()
                    break  # Current asteroid also explodes
                else:
                    # Current asteroid is smaller, it explodes
                    break
            
            # If we didn't break (current survived), add to stack
            else:
                stack.append(ast)
        
        return stack
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> asteroidCollision(vector<int>& asteroids) {
        vector<int> stack;
        
        for (int ast : asteroids) {
            while (!stack.empty() && stack.back() > 0 && ast < 0) {
                if (stack.back() < -ast) {
                    // Stack top explodes
                    stack.pop_back();
                    continue;
                } else if (stack.back() == -ast) {
                    // Both explode
                    stack.pop_back();
                    break;
                } else {
                    // Current explodes
                    break;
                }
            }
            
            // If current survives, add to stack
            // (we only reach here if we didn't break with "current explodes")
            if (!(stack.empty() && ast < 0) && 
                !(stack.back() > 0 && ast < 0 && 
                  (stack.back() >= -ast || 
                   (stack.back() < -ast && false)))) {
                // Simpler: just check if we should continue
            }
            
            // Re-implementation for clarity
            bool survived = true;
            while (!stack.empty() && stack.back() > 0 && ast < 0) {
                if (stack.back() < -ast) {
                    stack.pop_back();
                } else if (stack.back() == -ast) {
                    stack.pop_back();
                    survived = false;
                    break;
                } else {
                    survived = false;
                    break;
                }
            }
            
            if (survived) {
                stack.push_back(ast);
            }
        }
        
        return stack;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        Stack<Integer> stack = new Stack<>();
        
        for (int ast : asteroids) {
            while (!stack.isEmpty() && stack.peek() > 0 && ast < 0) {
                if (stack.peek() < -ast) {
                    stack.pop();
                    continue;
                } else if (stack.peek() == -ast) {
                    stack.pop();
                    break;
                } else {
                    break;
                }
            }
            
            // Only add if current asteroid survives
            boolean survived = true;
            // Re-check: if we exited loop normally, current might survive
            // Need to verify
            if (!stack.isEmpty() && stack.peek() > 0 && ast < 0) {
                // Check if current was destroyed in loop
                // Already handled in while loop
            }
            
            // Simpler approach: use while-else pattern
            boolean shouldAdd = true;
            while (!stack.isEmpty() && stack.peek() > 0 && ast < 0) {
                if (stack.peek() < -ast) {
                    stack.pop();
                } else if (stack.peek() == -ast) {
                    stack.pop();
                    shouldAdd = false;
                    break;
                } else {
                    shouldAdd = false;
                    break;
                }
            }
            
            if (shouldAdd) {
                stack.push(ast);
            }
        }
        
        return stack.stream().mapToInt(Integer::intValue).toArray();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} asteroids
 * @return {number[]}
 */
var asteroidCollision = function(asteroids) {
    const stack = [];
    
    for (const ast of asteroids) {
        let survived = true;
        
        while (stack.length > 0 && stack[stack.length - 1] > 0 && ast < 0) {
            if (stack[stack.length - 1] < -ast) {
                // Stack top is smaller, it explodes
                stack.pop();
            } else if (stack[stack.length - 1] === -ast) {
                // Both are same size, both explode
                stack.pop();
                survived = false;
                break;
            } else {
                // Current asteroid is smaller, it explodes
                survived = false;
                break;
            }
        }
        
        if (survived) {
            stack.push(ast);
        }
    }
    
    return stack;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each asteroid is pushed and popped at most once |
| **Space** | O(n) - Stack stores at most n asteroids |

---

## Approach 2: Alternative Stack Implementation

A cleaner implementation using helper function.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def asteroidCollision_clean(self, asteroids: List[int]) -> List[int]:
        """Clean stack implementation."""
        stack = []
        
        for ast in asteroids:
            # Resolve collisions
            while stack and ast < 0 < stack[-1]:
                if stack[-1] < -ast:
                    stack.pop()
                    continue  # Current still might collide with next
                elif stack[-1] == -ast:
                    stack.pop()
                    break  # Current destroys, gets destroyed
                else:
                    break  # Current destroys, gets destroyed
            
            # If no break, current survives
            else:
                stack.append(ast)
                continue
            
            # Check if current survived all collisions
            # If we broke with "both destroy" or "current destroyed", don't add
            if not stack or not (ast < 0 < stack[-1]):
                # Either stack is empty or no more collisions possible
                # Need to check if ast should be added
                if ast < 0:
                    # Check if it should be added
                    should_add = True
                    for i in range(len(stack) - 1, -1, -1):
                        if stack[i] > 0:
                            if stack[i] < -ast:
                                stack.pop()
                            elif stack[i] == -ast:
                                stack.pop()
                                should_add = False
                                break
                            else:
                                should_add = False
                                break
                        else:
                            break
                    if should_add:
                        stack.append(ast)
        
        return stack
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> asteroidCollision(vector<int>& asteroids) {
        vector<int> stack;
        
        for (int ast : asteroids) {
            bool alive = true;
            
            while (!stack.empty() && stack.back() > 0 && ast < 0) {
                if (stack.back() < -ast) {
                    stack.pop_back();  // Right asteroid destroyed
                } else if (stack.back() == -ast) {
                    stack.pop_back();  // Both destroyed
                    alive = false;
                    break;
                } else {
                    alive = false;  // Left asteroid destroyed
                    break;
                }
            }
            
            if (alive) {
                stack.push_back(ast);
            }
        }
        
        return stack;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        Stack<Integer> stack = new Stack<>();
        
        for (int ast : asteroids) {
            boolean alive = true;
            
            while (!stack.isEmpty() && stack.peek() > 0 && ast < 0) {
                if (stack.peek() < -ast) {
                    stack.pop();  // Right destroyed
                } else if (stack.peek() == -ast) {
                    stack.pop();  // Both destroyed
                    alive = false;
                    break;
                } else {
                    alive = false;  // Left destroyed
                    break;
                }
            }
            
            if (alive) {
                stack.push(ast);
            }
        }
        
        return stack.stream().mapToInt(Integer::intValue).toArray();
    }
}
```

<!-- slide -->
```javascript
var asteroidCollision = function(asteroids) {
    const stack = [];
    
    for (let ast of asteroids) {
        let alive = true;
        
        while (stack.length > 0 && stack[stack.length - 1] > 0 && ast < 0) {
            if (stack[stack.length - 1] < -ast) {
                stack.pop();  // Right destroyed
            } else if (stack[stack.length - 1] === -ast) {
                stack.pop();  // Both destroyed
                alive = false;
                break;
            } else {
                alive = false;  // Left destroyed
                break;
            }
        }
        
        if (alive) {
            stack.push(ast);
        }
    }
    
    return stack;
};
```
````

---

## Approach 3: Detailed Step-through

This shows the detailed process for understanding.

### Visual Walkthrough

For `asteroids = [3, 5, -6, 2, -1, 4]`:

```
Step 1: ast = 3, stack = []
        Push 3, stack = [3]

Step 2: ast = 5, stack = [3]
        5 > 0, no collision
        Push 5, stack = [3, 5]

Step 3: ast = -6, stack = [3, 5]
        -6 < 0, 5 > 0: Collision!
        5 < 6: 5 explodes, pop
        stack = [3]
        
        Check again: -6 < 0, 3 > 0: Collision!
        3 < 6: 3 explodes, pop
        stack = []
        
        Push -6, stack = [-6]

Step 4: ast = 2, stack = [-6]
        2 > 0, no collision (moving same direction)
        Push 2, stack = [-6, 2]

Step 5: ast = -1, stack = [-6, 2]
        -1 < 0, 2 > 0: Collision!
        2 > 1: -1 explodes, don't add
        stack = [-6, 2]

Step 6: ast = 4, stack = [-6, 2]
        4 > 0, no collision
        Push 4, stack = [-6, 2, 4]

Result: [-6, 2, 4]
```

---

## Comparison of Approaches

| Aspect | Stack Simulation | Two Pointers |
|--------|-----------------|--------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(n) | O(1) |
| **Implementation** | Simple | Complex |

**Best Approach:** The stack simulation is optimal and widely used.

---

## Why This Problem is Important

This problem demonstrates:
1. **Stack usage**: Classic stack application for collision problems
2. **Simulation**: Real-world scenario simulation
3. **Direction handling**: Important to consider direction in problems
4. **Comparison logic**: Handling different collision outcomes

---

## Related Problems

### Same Pattern (Stack/Collision)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) | 20 | Easy | Stack matching |
| [Decode String](https://leetcode.com/problems/decode-string/) | 394 | Medium | Stack for nesting |
| [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) | 739 | Medium | Stack monotonic |

### Similar Concepts

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| [Car Fleet](https://leetcode.com/problems/car-fleet/) | 853 | Collision/chase problem |
| [Process Tasks Using Servers](https://leetcode.com/problems/process-tasks-using-servers/) | | Stack + priority queue |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Asteroid Collision](https://www.youtube.com/watch?v=WDy_6f2mZ3w)** - Clear explanation with visual examples

2. **[Asteroid Collision - Explanation](https://www.youtube.com/watch?v=7B45C2EjdH0)** - Detailed walkthrough

3. **[Stack Pattern Explained](https://www.youtube.com/watch?v=wt7x12cH598)** - Understanding stack problems

---

## Follow-up Questions

### Q1: Can you solve it without using extra space?

**Answer:** The stack approach can be implemented in-place using array indices if we process the array carefully. We'd use two pointers - one for reading and one for writing.

---

### Q2: What if asteroids can have different speeds?

**Answer:** This becomes a more complex physics simulation problem. You'd need to track position and velocity for each asteroid, not just direction.

---

### Q3: How would you modify for 2D collision (asteroids moving in any direction)?

**Answer:** This would require a different approach using collision detection algorithms, likely involving spatial partitioning (quadtrees) for efficiency.

---

### Q4: What if three or more asteroids can collide at once?

**Answer:** The current algorithm naturally handles this through the while loop - it continues checking collisions until no more are possible.

---

### Q5: How would you handle asteroids moving at different speeds?

**Answer:** Track both position and velocity. Calculate collision times and process in order of collision, which requires a priority queue.

---

### Q6: What edge cases should be tested?

**Answer:**
- No collisions (all moving same direction)
- All explode (equal sizes)
- Chain reactions
- Single asteroid
- Alternating directions

---

### Q7: Can you use a deque instead of a stack?

**Answer:** A deque could work but adds unnecessary complexity since we only need O(1) access to one end.

---

### Q8: What if we need to track which asteroids survived with their indices?

**Answer:** Store tuples of (asteroid, original_index) in the stack instead of just the asteroid values.

---

## Common Pitfalls

### 1. Forgetting Break Conditions
**Issue**: Not properly handling when to break out of the while loop.

**Solution**: Ensure all three collision cases (left wins, right wins, both destroy) are handled with correct break/continue.

### 2. Wrong Direction Check
**Issue**: Checking wrong signs for collision.

**Solution**: Remember: collision only happens when stack top > 0 (right-moving) and current < 0 (left-moving).

### 3. Off-by-One Errors
**Issue**: Incorrect comparison operators.

**Solution**: Use < for "left wins", > for "right wins", == for "both destroy".

### 4. Not Continuing After Pop
**Issue**: Forgetting to continue checking after popping.

**Solution**: Use `continue` to check the next asteroid in stack after a pop.

---

## Summary

The **Asteroid Collision** problem demonstrates the power of stack-based simulation:

- **Stack approach**: Optimal with O(n) time complexity
- **Direction matters**: Only left-moving asteroids can collide
- **Comparison logic**: Handle three outcomes correctly

Key takeaways:
- **Stack for simulation**: Perfect for sequential collision problems
- **Direction handling**: Consider direction in movement problems
- **Three outcomes**: Smaller explodes, larger survives, equal both destroy

This problem is excellent for understanding stack applications in real-world simulations.

### Pattern Summary

This problem exemplifies the **Stack - Collision Simulation** pattern, characterized by:
- Sequential processing with stack
- Direction-based collision detection
- Resolving collisions with comparison

For more details on stack patterns, see the **[Stack](/algorithms/stack)** section.
