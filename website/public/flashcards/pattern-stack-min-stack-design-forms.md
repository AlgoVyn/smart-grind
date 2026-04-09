## Stack - Min Stack Design: Forms

What are the variations and extensions of the Min Stack pattern?

<!-- front -->

---

### Core Form: Basic Min Stack

```python
class MinStack:
    def __init__(self):
        self.stack = []  # (value, min)
    
    def push(self, val): 
        self.stack.append((val, min(val, self.stack[-1][1]) if self.stack else val))
    
    def pop(self): self.stack.pop()
    def top(self): return self.stack[-1][0]
    def getMin(self): return self.stack[-1][1]
```

**Use**: Standard LeetCode 155 Min Stack

---

### Variation 1: Max Stack

Same logic, track maximum instead:

```python
class MaxStack:
    def push(self, val):
        current_max = max(val, self.stack[-1][1]) if self.stack else val
        self.stack.append((val, current_max))
    
    def getMax(self): return self.stack[-1][1]
```

**Problem**: LeetCode 716 - Max Stack

---

### Variation 2: Min & Max Stack

Track both simultaneously:

```python
class MinMaxStack:
    def push(self, val):
        if self.stack:
            prev_min, prev_max = self.stack[-1][1], self.stack[-1][2]
            self.stack.append((val, min(val, prev_min), max(val, prev_max)))
        else:
            self.stack.append((val, val, val))
    
    def getMin(self): return self.stack[-1][1]
    def getMax(self): return self.stack[-1][2]
```

---

### Variation 3: Stack with Increment

```python
class CustomStack:
    """Stack that supports incrementing bottom k elements"""
    def __init__(self, maxSize):
        self.stack = []
        self.inc = []  # Lazy increment tracking
        self.maxSize = maxSize
    
    def push(self, x):
        if len(self.stack) < self.maxSize:
            self.stack.append(x)
            self.inc.append(0)  # No increment yet
    
    def pop(self):
        if not self.stack: return -1
        idx = len(self.stack) - 1
        if idx > 0:
            self.inc[idx - 1] += self.inc[idx]  # Pass increment down
        return self.stack.pop() + self.inc.pop()
    
    def increment(self, k, val):
        idx = min(k, len(self.stack)) - 1
        if idx >= 0:
            self.inc[idx] += val
```

**Problem**: LeetCode 1381 - Design a Stack With Increment Operation

---

### Variation 4: Min Stack with Extra Operations

| Operation | Implementation |
|-----------|----------------|
| `peekMin()` | Return min without removing |
| `popMin()` | Remove minimum element (requires aux storage) |
| `bottom()` | Return oldest element |

```python
# PopMin requires temporary storage
def popMin(self):
    temp = []
    while self.top() != self.getMin():
        temp.append(self.pop())
    min_val = self.pop()  # Remove the min
    while temp:
        self.push(temp.pop())  # Restore others
    return min_val
```

---

### Summary Table

| Form | Stores | Use Case |
|------|--------|----------|
| Min Stack | (val, min) | Track minimum |
| Max Stack | (val, max) | Track maximum |
| MinMax Stack | (val, min, max) | Track both |
| Inc Stack | (val, lazy_inc) | Batch updates |

<!-- back -->
