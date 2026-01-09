# Flatten Nested List Iterator

## Problem Description

You are given a nested list of integers nestedList. Each element is either an integer or a list whose elements may also be integers or other lists. Implement an iterator to flatten it.
Implement the NestedIterator class:
- NestedIterator(List<NestedInteger> nestedList) Initializes the iterator with the nested list nestedList.
- int next() Returns the next integer in the nested list.
- boolean hasNext() Returns true if there are still some integers in the nested list and false otherwise.
Your code will be tested with the following pseudocode:
```python
initialize iterator with nestedList
res = []
while iterator.hasNext()
    append iterator.next() to the end of res
return res
```python
If res matches the expected flattened list, then your code will be judged as correct.

### Examples

**Example 1:**

**Input:** nestedList = [[1,1],2,[1,1]]

**Output:** [1,1,2,1,1]

**Explanation:** By calling next repeatedly until hasNext returns false, the order of elements returned by next should be: [1,1,2,1,1].

**Example 2:**

**Input:** nestedList = [1,[4,[6]]]

**Output:** [1,4,6]

**Explanation:** By calling next repeatedly until hasNext returns false, the order of elements returned by next should be: [1,4,6].

### Constraints

- 1 <= nestedList.length <= 500
- The values of the integers in the nested list is in the range [-10^6, 10^6].

## Solution

```
# """
# This is the interface that allows for creating nested lists.
# You should not implement it, or speculate about its implementation
# """
#class NestedInteger:
#    def isInteger(self) -> bool:
#        """
#        @return True if this NestedInteger holds a single integer, rather than a nested list.
#        """
#
#    def getInteger(self) -> int:
#        """
#        @return the single integer that this NestedInteger holds, if it holds a single integer
#        Return None if this NestedInteger holds a nested list
#        """
#
#    def getList(self) -> [NestedInteger]:
#        """
#        @return the nested list that this NestedInteger holds, if it holds a nested list
#        Return None if this NestedInteger holds a single integer
#        """

class NestedIterator:
    def __init__(self, nestedList: [NestedInteger]):
        self.stack = nestedList[::-1]
    
    def next(self) -> int:
        self.hasNext()
        return self.stack.pop().getInteger()
    
    def hasNext(self) -> bool:
        while self.stack:
            if self.stack[-1].isInteger():
                return True
            else:
                lst = self.stack.pop().getList()
                self.stack.extend(lst[::-1])
        return False
```

### Approach

Use a stack to store the nested list elements in reverse order.
In hasNext(), while the top is a list, pop it and push its elements in reverse order onto the stack.
When top is an integer, return true.
In next(), call hasNext() to ensure top is integer, then pop and return it.
This flattens the nested list on the fly.

### Complexity

**Time Complexity:** next() and hasNext() amortized O(1), total O(n) for all operations.

**Space Complexity:** O(n) for the stack.
