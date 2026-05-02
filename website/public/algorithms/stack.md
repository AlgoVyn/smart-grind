# Stack

## Category
Data Structures

## Description

A stack is a linear data structure that follows the Last In First Out (LIFO) principle. The last element added to the stack is the first one to be removed. This fundamental data structure is essential for parsing, recursion simulation, backtracking algorithms, and expression evaluation.

Stacks are ubiquitous in computer science - from the call stack that manages function execution to the undo functionality in applications, browser history navigation, and compiler implementations. Understanding stack operations and patterns is crucial for algorithmic problem solving and systems programming.

---

## Concepts

The stack data structure relies on fundamental LIFO principles.

### 1. Core Operations

| Operation | Time | Description | Stack State |
|-----------|------|-------------|-------------|
| **Push** | O(1) | Add element to top | [..., x] → [..., x, new] |
| **Pop** | O(1) | Remove top element | [..., x, y] → [..., x] |
| **Peek/Top** | O(1) | View top element | [..., x, y] → [..., x, y] |
| **Is Empty** | O(1) | Check if stack is empty | Returns True/False |

### 2. Stack Properties

| Property | Description |
|----------|-------------|
| **LIFO** | Last In, First Out - most recently added element is first to be removed |
| **Ordered** | Elements maintain insertion order |
| **Dynamic size** | Can grow and shrink as needed |
| **Access pattern** | Only top element is accessible |

### 3. Common Stack Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Balanced parentheses** | Syntax validation | Valid Parentheses |
| **Monotonic stack** | Next greater/smaller element | Daily Temperatures |
| **Two stacks** | Queue simulation, min tracking | Min Stack |
| **Recursion simulation** | DFS without recursion | Tree traversal |

### 4. Implementation Options

| Implementation | Time | Space | Notes |
|---------------|------|-------|-------|
| **Array** | O(1) ops | O(n) | Fixed or dynamic capacity |
| **Linked List** | O(1) ops | O(n) | No capacity limit |
| **Python list** | O(1) amortized | O(n) | Dynamic array |

---

## Frameworks

Structured approaches for stack problems.

### Framework 1: Balanced Parentheses

```
┌─────────────────────────────────────────────────────────────┐
│  BALANCED PARENTHESES VALIDATOR                              │
├─────────────────────────────────────────────────────────────┤
│  Input: String with brackets (), [], {}                      │
│  Output: True if balanced, False otherwise                   │
│                                                              │
│  1. Initialize empty stack                                   │
│  2. Create mapping: closing → opening                         │
│     ')': '(', '}': '{', ']': '['                             │
│  3. For each character in string:                          │
│     a. If opening bracket:                                   │
│        - Push to stack                                       │
│     b. If closing bracket:                                   │
│        - If stack empty: return False                       │
│        - Pop from stack                                      │
│        - If popped != matching opening: return False        │
│  4. Return stack.empty()                                     │
│     (True if all brackets matched)                           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Syntax validation, XML/HTML parsing.

### Framework 2: Monotonic Stack (Next Greater Element)

```
┌─────────────────────────────────────────────────────────────┐
│  MONOTONIC STACK - NEXT GREATER ELEMENT                      │
├─────────────────────────────────────────────────────────────┤
│  Input: Array of numbers                                     │
│  Output: For each element, next greater element to right     │
│                                                              │
│  1. Initialize empty stack (will store indices)              │
│  2. Initialize result array with -1 (default)               │
│  3. For i from 0 to n-1:                                    │
│     a. While stack not empty AND arr[i] > arr[stack.top()]: │
│        - idx = stack.pop()                                   │
│        - result[idx] = arr[i]                                │
│     b. Push i to stack                                       │
│  4. Return result                                            │
│                                                              │
│  Stack maintains decreasing order from bottom to top       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Finding next greater/smaller elements, histogram problems.

### Framework 3: Min Stack

```
┌─────────────────────────────────────────────────────────────┐
│  MIN STACK - GET MINIMUM IN O(1)                            │
├─────────────────────────────────────────────────────────────┤
│  Data structures:                                            │
│    - main_stack: stores all elements                         │
│    - min_stack: tracks minimums                              │
│                                                              │
│  Push(x):                                                    │
│    - main_stack.push(x)                                      │
│    - If min_stack empty OR x <= min_stack.top():           │
│      * min_stack.push(x)                                     │
│                                                              │
│  Pop():                                                      │
│    - x = main_stack.pop()                                    │
│    - If x == min_stack.top():                              │
│      * min_stack.pop()                                       │
│                                                              │
│  Top(): return main_stack.top()                              │
│  GetMin(): return min_stack.top()                           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Tracking minimum in constant time.

### Framework 4: Two-Stack Queue

```
┌─────────────────────────────────────────────────────────────┐
│  QUEUE USING TWO STACKS                                      │
├─────────────────────────────────────────────────────────────┤
│  Stack in: for push operations                               │
│  Stack out: for pop/peek operations                          │
│                                                              │
│  Push(x): in_stack.push(x)                                   │
│                                                              │
│  Pop():                                                      │
│    - If out_stack empty:                                     │
│      * While in_stack not empty:                           │
│        - out_stack.push(in_stack.pop())                     │
│    - Return out_stack.pop()                                  │
│                                                              │
│  Peek(): Similar to pop but don't remove                     │
│  Empty(): in_stack.empty() AND out_stack.empty()            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Implementing queue with stack operations only.

---

## Forms

Different manifestations of stack-based solutions.

### Form 1: Array-based Stack

Simple implementation using dynamic array.

| Aspect | Details |
|--------|---------|
| **Push** | O(1) amortized (may need resize) |
| **Pop** | O(1) |
| **Peek** | O(1) |
| **Space** | O(n) |

### Form 2: Monotonic Stack

Maintains increasing or decreasing order.

| Variant | Order | Use Case |
|---------|-------|----------|
| **Increasing** | Bottom to top: small → large | Previous smaller element |
| **Decreasing** | Bottom to top: large → small | Next greater element |

### Form 3: Two-Stack Patterns

| Pattern | Stacks | Purpose |
|---------|--------|---------|
| **Min Stack** | Main + Min | Track minimum |
| **Queue** | In + Out | FIFO using LIFO |
| **Sort** | Main + Aux | Stack-based sorting |

### Form 4: Recursion Simulation

Explicit stack for recursive algorithms.

| Use Case | Approach |
|----------|----------|
| **DFS** | Stack instead of recursion |
| **Tree traversal** | Explicit stack for iterative |
| **Backtracking** | Push state, explore, pop |

---

## Tactics

Specific techniques for stack problems.

### Tactic 1: Array-based Stack Implementation

Standard stack using Python list:

```python
class Stack:
    """
    Stack implementation using Python list.
    """
    def __init__(self):
        self.items = []
    
    def push(self, item):
        """Add item to top. O(1)"""
        self.items.append(item)
    
    def pop(self):
        """Remove and return top item. O(1)"""
        if self.is_empty():
            raise IndexError("pop from empty stack")
        return self.items.pop()
    
    def peek(self):
        """Return top item without removing. O(1)"""
        if self.is_empty():
            raise IndexError("peek from empty stack")
        return self.items[-1]
    
    def is_empty(self):
        """Check if stack is empty. O(1)"""
        return len(self.items) == 0
    
    def size(self):
        """Return number of items. O(1)"""
        return len(self.items)
```

### Tactic 2: Balanced Parentheses

Classic stack validation:

```python
def is_balanced_parentheses(s):
    """
    Check if parentheses are balanced.
    Time: O(n), Space: O(n)
    """
    stack = []
    pairs = {'(': ')', '[': ']', '{': '}'}
    
    for char in s:
        if char in pairs:  # Opening bracket
            stack.append(char)
        elif char in pairs.values():  # Closing bracket
            if not stack:
                return False
            if pairs[stack.pop()] != char:
                return False
    
    return len(stack) == 0
```

**Key**: Match each closing with most recent opening.

### Tactic 3: Postfix Expression Evaluation

RPN calculator:

```python
def evaluate_postfix(expression):
    """
    Evaluate postfix notation expression.
    Time: O(n), Space: O(n)
    """
    stack = []
    
    for token in expression.split():
        if token.isdigit():
            stack.append(int(token))
        else:  # Operator
            b = stack.pop()
            a = stack.pop()
            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            elif token == '/':
                stack.append(a // b)
    
    return stack[0]
```

**Application**: Calculator implementations, compiler design.

### Tactic 4: Infix to Postfix Conversion

Shunting Yard algorithm:

```python
def infix_to_postfix(expression):
    """
    Convert infix expression to postfix notation.
    Time: O(n), Space: O(n)
    """
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}
    stack = []
    result = []
    
    for char in expression:
        if char.isalnum():  # Operand
            result.append(char)
        elif char == '(':
            stack.append(char)
        elif char == ')':
            while stack and stack[-1] != '(':
                result.append(stack.pop())
            stack.pop()  # Remove '('
        else:  # Operator
            while (stack and stack[-1] != '(' and
                   precedence.get(stack[-1], 0) >= precedence.get(char, 0)):
                result.append(stack.pop())
            stack.append(char)
    
    while stack:
        result.append(stack.pop())
    
    return ''.join(result)
```

**Use**: Expression parsing, compiler design.

### Tactic 5: Min Stack

O(1) minimum tracking:

```python
class MinStack:
    """
    Stack that supports push, pop, top, and getMin in O(1).
    """
    def __init__(self):
        self.stack = []  # Main stack
        self.min_stack = []  # Track minimums
    
    def push(self, x):
        self.stack.append(x)
        # Push current min to min_stack
        if not self.min_stack:
            self.min_stack.append(x)
        else:
            self.min_stack.append(min(x, self.min_stack[-1]))
    
    def pop(self):
        self.min_stack.pop()
        return self.stack.pop()
    
    def top(self):
        return self.stack[-1]
    
    def get_min(self):
        return self.min_stack[-1]
```

**Optimization**: Each element in min_stack tracks min up to that point.

---

## Python Templates

### Template 1: Basic Stack Class

```python
from typing import Any, List


class Stack:
    """
    Stack implementation using Python list.
    
    Supports standard stack operations:
    - push: Add element to top
    - pop: Remove and return top element
    - peek: View top element without removing
    - is_empty: Check if stack is empty
    
    All operations are O(1).
    """
    
    def __init__(self):
        self.items: List[Any] = []
    
    def push(self, item: Any) -> None:
        """Add item to top of stack."""
        self.items.append(item)
    
    def pop(self) -> Any:
        """Remove and return top item."""
        if self.is_empty():
            raise IndexError("pop from empty stack")
        return self.items.pop()
    
    def peek(self) -> Any:
        """Return top item without removing."""
        if self.is_empty():
            raise IndexError("peek from empty stack")
        return self.items[-1]
    
    def is_empty(self) -> bool:
        """Check if stack is empty."""
        return len(self.items) == 0
    
    def size(self) -> int:
        """Return number of items in stack."""
        return len(self.items)
```

### Template 2: Valid Parentheses

```python
def is_valid_parentheses(s: str) -> bool:
    """
    Check if string has balanced brackets.
    
    Time: O(n)
    Space: O(n)
    
    Args:
        s: String containing (, ), {, }, [, ]
    
    Returns:
        True if all brackets are balanced
    """
    stack = []
    pairs = {'(': ')', '[': ']', '{': '}'}
    
    for char in s:
        if char in pairs:
            stack.append(char)
        elif char in pairs.values():
            if not stack:
                return False
            if pairs[stack.pop()] != char:
                return False
    
    return len(stack) == 0
```

### Template 3: Min Stack

```python
class MinStack:
    """
    Stack that supports getMin in O(1).
    
    Uses auxiliary stack to track minimums.
    All operations are O(1).
    """
    
    def __init__(self):
        self.stack: List[int] = []
        self.min_stack: List[int] = []
    
    def push(self, x: int) -> None:
        """Push element x onto stack."""
        self.stack.append(x)
        if not self.min_stack:
            self.min_stack.append(x)
        else:
            self.min_stack.append(min(x, self.min_stack[-1]))
    
    def pop(self) -> int:
        """Remove element on top of stack and return it."""
        self.min_stack.pop()
        return self.stack.pop()
    
    def top(self) -> int:
        """Get top element."""
        return self.stack[-1]
    
    def get_min(self) -> int:
        """Retrieve minimum element in O(1)."""
        return self.min_stack[-1]
```

### Template 4: Monotonic Stack (Next Greater Element)

```python
def next_greater_element(nums: List[int]) -> List[int]:
    """
    Find next greater element for each element.
    Returns -1 if no greater element exists.
    
    Time: O(n)
    Space: O(n)
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Stores indices
    
    for i in range(n):
        # Pop smaller elements
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)
    
    return result
```

### Template 5: Evaluate RPN

```python
def eval_rpn(tokens: List[str]) -> int:
    """
    Evaluate Reverse Polish Notation expression.
    
    Time: O(n)
    Space: O(n)
    """
    stack = []
    operators = {'+', '-', '*', '/'}
    
    for token in tokens:
        if token in operators:
            b = stack.pop()
            a = stack.pop()
            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            elif token == '/':
                stack.append(int(a / b))
        else:
            stack.append(int(token))
    
    return stack[0]
```

---

## When to Use

Use a stack when you need to solve problems involving:

- **LIFO access pattern**: Last element processed first
- **Backtracking**: Undo operations, exploring paths
- **Parsing**: Syntax validation, expression evaluation
- **Recursion simulation**: DFS, tree traversals
- **Reversing**: Palindromes, string reversal
- **Matching**: Brackets, tags, pairs

### Common Stack Patterns

| Pattern | Use Case |
|---------|----------|
| **Balanced brackets** | Syntax validation |
| **Monotonic stack** | Next greater/smaller element |
| **Two stacks** | Queue simulation, min tracking |
| **Recursion simulation** | Iterative DFS |
| **Undo mechanism** | Editor undo, browser back |

### When to Choose Stack vs Other Data Structures

- **Choose Stack** when:
  - LIFO order is natural for the problem
  - Need to reverse or backtrack
  - Parsing nested structures
  - Simulating recursion

- **Choose Queue** when:
  - FIFO order is needed
  - BFS traversal
  - Fair scheduling required

- **Choose Priority Queue** when:
  - Need to process by priority
  - Dijkstra's algorithm
  - Greedy algorithms

---

## Algorithm Explanation

### Core Concept

A stack restricts access to one end (the top), enforcing LIFO ordering. This simple restriction provides powerful capabilities for tracking state, handling nested structures, and managing undo operations.

### How Stack Operations Work

#### Push Operation
```
Before: [A, B, C]  (C is top)
Push D
After:  [A, B, C, D]  (D is now top)
```

#### Pop Operation
```
Before: [A, B, C, D]  (D is top)
Pop → returns D
After:  [A, B, C]  (C is now top)
```

### Visual Walkthrough

**Balanced Parentheses Example**:
```
Input: "{[()]}"

Step 1: '{' → stack: ['{']
Step 2: '[' → stack: ['{', '[']
Step 3: '(' → stack: ['{', '[', '(']
Step 4: ')' → matches '(', stack: ['{', '[']
Step 5: ']' → matches '[', stack: ['{']
Step 6: '}' → matches '{', stack: []

Result: Empty stack → Balanced ✓
```

**Monotonic Stack Example** (Next Greater):
```
Input: [2, 1, 2, 4, 3]

i=0, val=2: stack=[0]
i=1, val=1: stack=[0, 1] (1 < 2)
i=2, val=2: pop 1 (2 > 1), result[1]=2
            pop 0 (2 == 2)? no, keep
            stack=[0, 2]
i=3, val=4: pop 2 (4 > 2), result[2]=4
            pop 0 (4 > 2), result[0]=4
            stack=[3]
i=4, val=3: stack=[3, 4]

Result: [4, 2, 4, -1, -1]
```

---

## Practice Problems

### Problem 1: Valid Parentheses

**Problem:** [LeetCode 20 - Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)

**Description:** Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

**How to Apply:**
- Use stack to track opening brackets
- Match each closing with top of stack
- Check stack is empty at end

---

### Problem 2: Min Stack

**Problem:** [LeetCode 155 - Min Stack](https://leetcode.com/problems/min-stack/)

**Description:** Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

**How to Apply:**
- Use two stacks: main and min tracking
- Push min of current and new element to min_stack
- Pop from both stacks together

---

### Problem 3: Evaluate Reverse Polish Notation

**Problem:** [LeetCode 150 - Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/)

**Description:** Evaluate the value of an arithmetic expression in Reverse Polish Notation.

**How to Apply:**
- Stack for operands
- Pop two operands when encountering operator
- Push result back

---

### Problem 4: Daily Temperatures

**Problem:** [LeetCode 739 - Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)

**Description:** Given an array of temperatures, return an array where each element is the number of days until a warmer temperature.

**How to Apply:**
- Monotonic decreasing stack
- Pop while current > stack top
- Record days difference

---

### Problem 5: Next Greater Element I

**Problem:** [LeetCode 496 - Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)

**Description:** Find the next greater element for each element in subset.

**How to Apply:**
- Monotonic stack on full array
- Build mapping of element → next greater
- Lookup for subset

---

## Video Tutorial Links

### Fundamentals

- [Stack Data Structure](https://www.youtube.com/watch?v=wjI1WNcIntg) - Complete explanation
- [Monotonic Stack](https://www.youtube.com/watch?v=J-5ZNP1xFgM) - Pattern explanation
- [Stack Applications](https://www.youtube.com/watch?v=GBST5rB7gH8) - Real-world uses

### Problem Solutions

- [LeetCode 20 Solution](https://www.youtube.com/watch?v=9km_UfC7iEI) - Valid Parentheses
- [LeetCode 155 Solution](https://www.youtube.com/watch?v=wx0G2D6--28) - Min Stack
- [LeetCode 739 Solution](https://www.youtube.com/watch?v=HV8bqy7cfCE) - Daily Temperatures

---

## Follow-up Questions

### Q1: Can a stack be implemented using a linked list?

**Answer**: Yes! Both array and linked list implementations provide O(1) push and pop. Linked list has no capacity limit and no resize overhead, but has pointer overhead per element. Array has better cache locality and less memory overhead.

### Q2: What's the difference between a stack and a recursion call stack?

**Answer**: The call stack is a specific implementation using stack principles to manage function calls - storing return addresses, local variables, and parameters. A general stack is a data structure for programmer use. Both follow LIFO, but the call stack is managed by the runtime.

### Q3: When should I use a monotonic stack vs a regular stack?

**Answer**: Use monotonic stack when you need to find the "next greater" or "next smaller" element for each element in an array. The monotonic property (maintaining increasing or decreasing order) allows efficient finding of such relationships in O(n) time.

### Q4: Can stacks handle undo/redo functionality?

**Answer**: Yes! A single stack handles undo (pop to undo). For redo, use a second stack: when you undo, pop from undo stack and push to redo stack. When you perform a new action, clear the redo stack.

### Q5: What makes the Min Stack work in O(1)?

**Answer**: The key insight is that each element in the auxiliary stack tracks the minimum of all elements up to that point in the main stack. When we push a new element, the new minimum is min(new_element, current_minimum). This allows getMin() to simply return the top of the auxiliary stack.

---

## Summary

The stack is a fundamental data structure with wide-ranging applications in computer science. Its LIFO principle provides elegant solutions for parsing, backtracking, and expression evaluation problems.

**Key Takeaways:**

1. **LIFO Principle**: Last In, First Out governs all operations
2. **O(1) Operations**: Push, pop, and peek are constant time
3. **Monotonic Stack**: Powerful pattern for next greater/smaller problems
4. **Two-Stack Patterns**: Enable queue simulation and min tracking
5. **Recursion Simulation**: Convert recursive to iterative algorithms

**When to Use:**
- Balanced bracket validation
- Expression evaluation (infix/postfix)
- Undo/redo functionality
- Backtracking algorithms
- DFS without recursion

Understanding stack operations and patterns is essential for technical interviews and algorithmic problem solving.
