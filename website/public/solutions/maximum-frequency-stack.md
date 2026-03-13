# Maximum Frequency Stack

## Problem Description

Design a stack-like data structure to push elements to the stack and pop the most frequent element from the stack. Implement the `FreqStack` class:

- `FreqStack()` constructs an empty frequency stack
- `void push(int val)` pushes an integer `val` onto the top of the stack
- `int pop()` removes and returns the most frequent element in the stack

If there is a tie for the most frequent element, the element closest to the stack's top is removed and returned.

**LeetCode Link:** [Maximum Frequency Stack - LeetCode](https://leetcode.com/problems/maximum-frequency-stack/)

---

## Examples

### Example 1

**Input:**
```python
["FreqStack", "push", "push", "push", "push", "push", "push", "pop", "pop", "pop", "pop"]
[[], [5], [7], [5], [7], [4], [5], [], [], [], []]
```

**Output:**
```python
[null, null, null, null, null, null, null, 5, 7, 5, 4]
```

**Explanation:**

```
FreqStack freqStack = new FreqStack();
freqStack.push(5);   // The stack is [5]
freqStack.push(7);   // The stack is [5,7]
freqStack.push(5);   // The stack is [5,7,5]
freqStack.push(7);   // The stack is [5,7,5,7]
freqStack.push(4);   // The stack is [5,7,5,7,4]
freqStack.push(5);   // The stack is [5,7,5,7,4,5]
freqStack.pop();     // return 5, as 5 is the most frequent. The stack becomes [5,7,5,7,4]
freqStack.pop();     // return 7, as 5 and 7 are the most frequent, but 7 is closest to the top. The stack becomes [5,7,5,4]
freqStack.pop();     // return 5, as 5 is the most frequent. The stack becomes [5,7,4]
freqStack.pop();     // return 4, as 4, 5 and 7 are the most frequent, but 4 is closest to the top. The stack becomes [5,7]
```

---

## Constraints

- `0 <= val <= 10^9`
- At most `2 * 10^4` calls will be made to push and pop
- It is guaranteed that there will be at least one element in the stack before calling pop

---

## Pattern: HashMap + Grouped Frequency Stacks

This problem uses the **Frequency-Based Data Structure** pattern where elements are grouped by their frequency. A frequency map tracks element counts, while a group map stores elements at each frequency level using deques for LIFO order within each frequency.

### Core Concept

- **Frequency Map**: Track how many times each value appears
- **Group Map**: Store elements grouped by their frequency
- **Max Frequency**: Track the current maximum frequency
- **Tie-Breaking**: Use deque to ensure LIFO order within same frequency

### When to Use This Pattern

This pattern is applicable when:
1. Need to track element frequencies
2. Need to retrieve most frequent elements
3. Need to handle tie-breaking based on recency

---

## Intuition

The key insight for this problem is that we need to **group elements by their frequency** rather than just tracking counts.

### Key Observations

1. **Two-Level Tracking**: We need to track both individual frequencies AND groups of elements at each frequency level.

2. **Tie-Breaking by Recency**: Among elements with the same frequency, the one most recently pushed (closer to top) should be returned first. This is naturally handled by appending to the end of a deque.

3. **Frequency Groups as Stacks**: Each frequency level acts like a stack - we always pop from the highest frequency group, and within that group, from the end (most recent).

4. **Efficient Updates**: When frequency of an element increases, we simply move it to the next frequency group.

### Algorithm Overview

1. Maintain a frequency map: value → count
2. Maintain a group map: frequency → deque of values
3. Track max_freq - the highest frequency currently in the stack
4. For push: increment freq, append to new freq group, update max_freq
5. For pop: pop from max_freq group, decrement freq, update max_freq if needed

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **HashMap + Deque (Optimal)** - Most common and efficient
2. **Using Stack of Stacks** - Alternative conceptual approach

---

## Approach 1: HashMap + Deque (Optimal)

### Algorithm Steps

1. **Data Structures**:
   - `freq`: HashMap mapping value → frequency count
   - `group`: HashMap mapping frequency → deque of values
   - `max_freq`: Current maximum frequency

2. **Push Operation**:
   - Increment frequency of the value
   - Append value to deque at new frequency
   - Update max_freq if new frequency is higher

3. **Pop Operation**:
   - Pop from deque at max_freq
   - Decrement frequency of the value
   - If deque at max_freq becomes empty, decrement max_freq

### Why It Works

This approach works because:
- Elements are grouped by frequency, allowing O(1) access to most frequent
- Deque provides O(1) pop from the "end" (most recent)
- Ties are automatically handled - we always pop the most recent within each frequency group

### Code Implementation

````carousel
```python
from collections import defaultdict, deque
from typing import Dict

class FreqStack:
    def __init__(self):
        """
        Initialize an empty frequency stack.
        """
        # Maps value -> frequency count
        self.freq: Dict[int, int] = defaultdict(int)
        
        # Maps frequency -> deque of values (at that frequency)
        # Using deque for O(1) append and pop
        self.group: Dict[int, deque] = defaultdict(deque)
        
        # Current maximum frequency
        self.max_freq: int = 0
    
    def push(self, val: int) -> None:
        """
        Push an integer val onto the top of the stack.
        
        Args:
            val: The value to push
        """
        # Increment frequency
        self.freq[val] += 1
        freq = self.freq[val]
        
        # Add to group at this frequency
        self.group[freq].append(val)
        
        # Update max frequency if needed
        if freq > self.max_freq:
            self.max_freq = freq
    
    def pop(self) -> int:
        """
        Remove and return the most frequent element.
        If there is a tie, return the one closest to the top.
        
        Returns:
            The most frequent element
        """
        # Get value from max frequency group (end of deque = most recent)
        val = self.group[self.max_freq].pop()
        
        # Decrement its frequency
        self.freq[val] -= 1
        
        # If that frequency group is now empty, decrement max_freq
        if not self.group[self.max_freq]:
            self.max_freq -= 1
        
        return val
```

<!-- slide -->
```cpp
#include <unordered_map>
#include <deque>
using namespace std;

class FreqStack {
private:
    // Maps value -> frequency count
    unordered_map<int, int> freq;
    
    // Maps frequency -> deque of values
    unordered_map<int, deque<int>> group;
    
    // Current maximum frequency
    int maxFreq;
    
public:
    FreqStack() {
        maxFreq = 0;
    }
    
    void push(int val) {
        // Increment frequency
        freq[val]++;
        int f = freq[val];
        
        // Add to group at this frequency
        group[f].push_back(val);
        
        // Update max frequency
        if (f > maxFreq) {
            maxFreq = f;
        }
    }
    
    int pop() {
        // Get value from max frequency group
        int val = group[maxFreq].back();
        group[maxFreq].pop_back();
        
        // Decrement frequency
        freq[val]--;
        
        // If that frequency group is empty, decrement maxFreq
        if (group[maxFreq].empty()) {
            maxFreq--;
        }
        
        return val;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class FreqStack {
    // Maps value -> frequency count
    private HashMap<Integer, Integer> freq;
    
    // Maps frequency -> deque of values
    private HashMap<Integer, Deque<Integer>> group;
    
    // Current maximum frequency
    private int maxFreq;
    
    public FreqStack() {
        freq = new HashMap<>();
        group = new HashMap<>();
        maxFreq = 0;
    }
    
    public void push(int val) {
        // Increment frequency
        freq.put(val, freq.getOrDefault(val, 0) + 1);
        int f = freq.get(val);
        
        // Add to group at this frequency
        group.computeIfAbsent(f, k -> new ArrayDeque<>()).addLast(val);
        
        // Update max frequency
        if (f > maxFreq) {
            maxFreq = f;
        }
    }
    
    public int pop() {
        // Get value from max frequency group
        int val = group.get(maxFreq).removeLast();
        
        // Decrement frequency
        freq.put(val, freq.get(val) - 1);
        
        // If that frequency group is empty, decrement maxFreq
        if (group.get(maxFreq).isEmpty()) {
            maxFreq--;
        }
        
        return val;
    }
}
```

<!-- slide -->
```javascript
class FreqStack {
    constructor() {
        // Maps value -> frequency count
        this.freq = new Map();
        
        // Maps frequency -> array of values
        this.group = new Map();
        
        // Current maximum frequency
        this.maxFreq = 0;
    }
    
    /**
     * Push an integer val onto the top of the stack.
     * @param {number} val
     * @return {void}
     */
    push(val) {
        // Increment frequency
        const f = (this.freq.get(val) || 0) + 1;
        this.freq.set(val, f);
        
        // Add to group at this frequency
        if (!this.group.has(f)) {
            this.group.set(f, []);
        }
        this.group.get(f).push(val);
        
        // Update max frequency
        if (f > this.maxFreq) {
            this.maxFreq = f;
        }
    }
    
    /**
     * Remove and return the most frequent element.
     * @return {number}
     */
    pop() {
        // Get value from max frequency group (end = most recent)
        const group = this.group.get(this.maxFreq);
        const val = group.pop();
        
        // Decrement frequency
        this.freq.set(val, this.freq.get(val) - 1);
        
        // If that frequency group is empty, decrement maxFreq
        if (group.length === 0) {
            this.maxFreq--;
        }
        
        return val;
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) amortized for both push and pop |
| **Space** | O(n) where n is the total number of unique elements pushed |

---

## Approach 2: Using Stack of Stacks

### Algorithm Steps

1. Use a stack of stacks, where each inner stack represents a frequency level
2. When pushing, if the element has reached a new frequency, create a new stack
3. When popping, pop from the highest frequency stack

### Why It Works

This approach provides a different mental model:
- Each frequency level is its own "mini-stack"
- We maintain these mini-stacks in order of frequency
- Popping always comes from the highest frequency stack

### Code Implementation

````carousel
```python
from collections import defaultdict

class FreqStack:
    def __init__(self):
        """
        Using stack of stacks approach.
        """
        # freq[v] = frequency of value v
        self.freq = defaultdict(int)
        
        # stacks[f] = stack of values with frequency f
        self.stacks = defaultdict(list)
        
        self.max_freq = 0
    
    def push(self, val: int) -> None:
        self.freq[val] += 1
        f = self.freq[val]
        self.stacks[f].append(val)
        self.max_freq = max(self.max_freq, f)
    
    def pop(self) -> int:
        val = self.stacks[self.max_freq].pop()
        self.freq[val] -= 1
        if not self.stacks[self.max_freq]:
            self.max_freq -= 1
        return val
```

<!-- slide -->
```cpp
#include <unordered_map>
#include <stack>
using namespace std;

class FreqStack {
private:
    unordered_map<int, int> freq;
    unordered_map<int, stack<int>> stacks;
    int maxFreq;
    
public:
    FreqStack() {
        maxFreq = 0;
    }
    
    void push(int val) {
        freq[val]++;
        int f = freq[val];
        stacks[f].push(val);
        maxFreq = max(maxFreq, f);
    }
    
    int pop() {
        int val = stacks[maxFreq].top();
        stacks[maxFreq].pop();
        freq[val]--;
        if (stacks[maxFreq].empty()) {
            maxFreq--;
        }
        return val;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class FreqStack {
    private HashMap<Integer, Integer> freq;
    private HashMap<Integer, Stack<Integer>> stacks;
    private int maxFreq;
    
    public FreqStack() {
        freq = new HashMap<>();
        stacks = new HashMap<>();
        maxFreq = 0;
    }
    
    public void push(int val) {
        freq.put(val, freq.getOrDefault(val, 0) + 1);
        int f = freq.get(val);
        stacks.computeIfAbsent(f, k -> new Stack<>()).push(val);
        maxFreq = Math.max(maxFreq, f);
    }
    
    public int pop() {
        int val = stacks.get(maxFreq).pop();
        freq.put(val, freq.get(val) - 1);
        if (stacks.get(maxFreq).isEmpty()) {
            maxFreq--;
        }
        return val;
    }
}
```

<!-- slide -->
```javascript
class FreqStack {
    constructor() {
        this.freq = new Map();
        this.stacks = new Map();
        this.maxFreq = 0;
    }
    
    push(val) {
        const f = (this.freq.get(val) || 0) + 1;
        this.freq.set(val, f);
        
        if (!this.stacks.has(f)) {
            this.stacks.set(f, []);
        }
        this.stacks.get(f).push(val);
        
        this.maxFreq = Math.max(this.maxFreq, f);
    }
    
    pop() {
        const group = this.stacks.get(this.maxFreq);
        const val = group.pop();
        
        this.freq.set(val, this.freq.get(val) - 1);
        
        if (group.length === 0) {
            this.maxFreq--;
        }
        
        return val;
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) amortized for both push and pop |
| **Space** | O(n) where n is total elements |

---

## Comparison of Approaches

| Aspect | HashMap + Deque | Stack of Stacks |
|--------|----------------|-----------------|
| **Time Complexity** | O(1) | O(1) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Uses deque | Uses stack |
| **Readability** | Very High | High |

**Best Approach:** Both approaches have identical complexity. Choose based on preference.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Amazon, Microsoft
- **Difficulty**: Hard
- **Concepts Tested**: HashMap design, Frequency tracking, Stack/Deque operations

### Learning Outcomes

1. **Multi-level Data Structures**: Learn to combine multiple data structures
2. **Frequency-Based Design**: Master frequency tracking patterns
3. **Tie-Breaking Logic**: Understand how to handle multiple criteria

---

## Related Problems

Based on similar themes (frequency tracking, priority structures):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| LFU Cache | [Link](https://leetcode.com/problems/lru-cache/) | Least Frequently Used cache |
| Top K Frequent Elements | [Link](https://leetcode.com/problems/top-k-frequent-elements/) | K most frequent elements |
| Last Stone Weight | [Link](https://leetcode.com/problems/last-stone-weight/) | Frequency-based operations |

### Pattern Reference

For more detailed explanations, see:
- **[HashMap Pattern](/patterns/hashmap)**
- **[Stack Pattern](/patterns/stack)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Maximum Frequency Stack - NeetCode](https://www.youtube.com/watch?v=NmT8M9L9NTU)** - Clear explanation
2. **[LeetCode 895 - Maximum Frequency Stack](https://www.youtube.com/watch?v=TwPdtXhL6h0)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you modify the solution to support minimum frequency instead of maximum?

**Answer:** Instead of tracking max_freq, track min_freq and pop from that group. The logic would be inverted.

---

### Q2: What if you needed to get the k most frequent elements (not just one)?

**Answer:** You'd need to pop k times, but this would disturb the frequency counts. A better approach would be to use a separate data structure to track the top k elements.

---

### Q3: How would you implement this with LRU tie-breaking instead of LIFO?

**Answer:** Use a queue instead of a deque for each frequency group. This would ensure that the oldest element at each frequency is returned first.

---

### Q4: Can you implement this with only one HashMap?

**Answer:** Yes, you could use a single HashMap storing (value, frequency) pairs and sort them, but this would be much slower. The two-HashMap approach is optimal.

---

## Common Pitfalls

### 1. Not Using Deque for Group Storage
**Issue**: Regular lists would be O(n) for pop; deques support O(1) append/pop from both ends.

**Solution**: Use deque (or ArrayDeque in Java) for the group storage.

### 2. Forgetting to Update max_freq
**Issue**: After pop, if the deque at max_freq becomes empty, decrement max_freq.

**Solution**: Always check and update max_freq in the pop method.

### 3. Incorrect Frequency Tracking
**Issue**: Decrement frequency after popping, not before.

**Solution**: Pop first, then decrement.

### 4. Tie-Breaking Logic
**Issue**: Elements closer to top (more recently added) should be popped first, which is naturally handled by appending to the right of deque.

**Solution**: Use append/pop from the end of deque.

---

## Summary

The **Maximum Frequency Stack** problem demonstrates advanced data structure design:

Key takeaways:
1. Group elements by frequency using a HashMap
2. Use deque for O(1) operations within each frequency group
3. Track max_freq for O(1) access to most frequent elements
4. LIFO order within each frequency group handles tie-breaking

This problem is essential for understanding how to combine multiple data structures for efficient frequency-based operations.

### Pattern Summary

This problem exemplifies the **Frequency-Based Data Structure** pattern, characterized by:
- Using frequency as the primary grouping mechanism
- Multiple data structures for different aspects (count vs. group)
- O(1) operations through clever design
- Applications in caching, scheduling, and frequency tracking

For more details, see the **[HashMap Pattern](/patterns/hashmap)** and **[Stack Pattern](/patterns/stack)**.

---

## Additional Resources

- [LeetCode Problem 895](https://leetcode.com/problems/maximum-frequency-stack/) - Official problem page
- [HashMap - GeeksforGeeks](https://www.geeksforgeeks.org/hashmap-data-structure/) - Detailed explanation
- [Deque - GeeksforGeeks](https://www.geeksforgeeks.org/deque-set-1-introduction/) - Deque operations
