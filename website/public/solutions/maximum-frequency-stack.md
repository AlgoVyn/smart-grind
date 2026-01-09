# Maximum Frequency Stack

## Problem Description

Design a stack-like data structure to push elements to the stack and pop the most frequent element from the stack. Implement the `FreqStack` class:

- `FreqStack()` constructs an empty frequency stack
- `void push(int val)` pushes an integer `val` onto the top of the stack
- `int pop()` removes and returns the most frequent element in the stack

If there is a tie for the most frequent element, the element closest to the stack's top is removed and returned.

### Example 1

**Input:**
```
["FreqStack", "push", "push", "push", "push", "push", "push", "pop", "pop", "pop", "pop"]
[[], [5], [7], [5], [7], [4], [5], [], [], [], []]
```

**Output:**
```
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

### Constraints

- `0 <= val <= 10^9`
- At most `2 * 10^4` calls will be made to push and pop
- It is guaranteed that there will be at least one element in the stack before calling pop

## Solution

```python
from collections import defaultdict, deque

class FreqStack:
    def __init__(self):
        self.freq = defaultdict(int)
        self.group = defaultdict(deque)
        self.max_freq = 0

    def push(self, val: int) -> None:
        self.freq[val] += 1
        self.group[self.freq[val]].append(val)
        if self.freq[val] > self.max_freq:
            self.max_freq = self.freq[val]

    def pop(self) -> int:
        val = self.group[self.max_freq].pop()
        self.freq[val] -= 1
        if not self.group[self.max_freq]:
            self.max_freq -= 1
        return val
```

## Explanation

To implement a frequency stack that pops the most frequent element (with ties broken by recency), we use a combination of data structures.

### Data Structures

- **Frequency map (`freq`):** Tracks how many times each value has been pushed
- **Group map (`group`):** Uses frequency as keys and deques as values to store elements at each frequency level
- **max_freq:** Keeps track of the current maximum frequency

### Operations

**Push:**
1. Increment the frequency of the value
2. Append it to the deque for that new frequency
3. Update `max_freq` if necessary

**Pop:**
1. Remove the most recent element from the deque at `max_freq`
2. Decrement its frequency
3. If that deque becomes empty, decrement `max_freq`

This ensures that the most frequent elements are popped first, and among ties, the most recent one is chosen.

### Time Complexity

- **O(1)** for both push and pop operations (deque operations are amortized O(1))

### Space Complexity

- **O(N)**, where `N` is the total number of elements pushed, for storing frequencies and groups
