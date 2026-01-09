# Maximum Frequency Stack

## Problem Description
Design a stack-like data structure to push elements to the stack and pop the most frequent element from the stack.
Implement the FreqStack class:

FreqStack() constructs an empty frequency stack.
void push(int val) pushes an integer val onto the top of the stack.
int pop() removes and returns the most frequent element in the stack.
	
If there is a tie for the most frequent element, the element closest to the stack's top is removed and returned.

 
Example 1:

Input
["FreqStack", "push", "push", "push", "push", "push", "push", "pop", "pop", "pop", "pop"]
[[], [5], [7], [5], [7], [4], [5], [], [], [], []]
Output
[null, null, null, null, null, null, null, 5, 7, 5, 4]

Explanation
FreqStack freqStack = new FreqStack();
freqStack.push(5); // The stack is [5]
freqStack.push(7); // The stack is [5,7]
freqStack.push(5); // The stack is [5,7,5]
freqStack.push(7); // The stack is [5,7,5,7]
freqStack.push(4); // The stack is [5,7,5,7,4]
freqStack.push(5); // The stack is [5,7,5,7,4,5]
freqStack.pop();   // return 5, as 5 is the most frequent. The stack becomes [5,7,5,7,4].
freqStack.pop();   // return 7, as 5 and 7 is the most frequent, but 7 is closest to the top. The stack becomes [5,7,5,4].
freqStack.pop();   // return 5, as 5 is the most frequent. The stack becomes [5,7,4].
freqStack.pop();   // return 4, as 4, 5 and 7 is the most frequent, but 4 is closest to the top. The stack becomes [5,7].

 
Constraints:

0 <= val <= 109
At most 2 * 104 calls will be made to push and pop.
It is guaranteed that there will be at least one element in the stack before calling pop.
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

We maintain a frequency map (`freq`) to track how many times each value has been pushed. A group map (`group`) uses frequency as keys and deques as values to store elements at each frequency level. The `max_freq` variable keeps track of the current maximum frequency.

For push, we increment the frequency of the value, append it to the deque for that new frequency, and update `max_freq` if necessary.

For pop, we remove the most recent element from the deque at `max_freq`, decrement its frequency, and if that deque becomes empty, decrement `max_freq`.

This ensures that the most frequent elements are popped first, and among ties, the most recent one is chosen.

Time Complexity: O(1) for both push and pop operations, as deque operations are amortized O(1).

Space Complexity: O(N), where N is the total number of elements pushed, for storing frequencies and groups.
