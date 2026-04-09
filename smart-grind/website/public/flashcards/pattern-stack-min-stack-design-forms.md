## Stack - Min Stack Design: Forms

What variations and follow-up problems extend the Min Stack pattern?

<!-- front -->

---

### Form 1: Max Stack

**Problem**: Track maximum instead of minimum.

```python
class MaxStack:
    def __init__(self):
        self.stack = []  # (value, current_maximum)
    
    def push(self, val: int) -> None:
        current_max = max(val, self.stack[-1][1]) if self.stack else val
        self.stack.append((val, current_max))
    
    def getMax(self) -> int:
        return self.stack[-1][1]
    # ... pop and top same as MinStack
```

**Change**: `min()` → `max()`

---

### Form 2: Min and Max Stack

**Problem**: Track both minimum AND maximum.

```python
class MinMaxStack:
    def __init__(self):
        # Stores (value, current_min, current_max)
        self.stack = []
    
    def push(self, val: int) -> None:
        if self.stack:
            current_min = min(val, self.stack[-1][1])
            current_max = max(val, self.stack[-1][2])
        else:
            current_min = current_max = val
        self.stack.append((val, current_min, current_max))
    
    def getMin(self) -> int:
        return self.stack[-1][1]
    
    def getMax(self) -> int:
        return self.stack[-1][2]
```

---

### Form 3: Stack With Increment Operation

**Problem**: Add value to bottom k elements.

```python
class CustomStack:
    def __init__(self, maxSize: int):
        self.stack = []
        self.inc = []  # Increment tracking
        self.max_size = maxSize
    
    def push(self, x: int):
        if len(self.stack) < self.max_size:
            self.stack.append(x)
            self.inc.append(0)  # No increment yet
    
    def pop(self) -> int:
        if not self.stack:
            return -1
        # Carry increment down
        if len(self.inc) > 1:
            self.inc[-2] += self.inc[-1]
        return self.stack.pop() + self.inc.pop()
    
    def increment(self, k: int, val: int):
        if self.inc:
            self.inc[min(k, len(self.inc)) - 1] += val
```

**Key**: Lazy propagation with auxiliary array.

---

### Form 4: Online Stock Span

**Problem**: Find consecutive days price <= today's price.

```python
class StockSpanner:
    def __init__(self):
        # Stack of (price, span)
        self.stack = []
    
    def next(self, price: int) -> int:
        span = 1
        # Pop while previous prices are <= current
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        self.stack.append((price, span))
        return span
```

**Pattern**: Monotonic decreasing stack with metadata.

---

### Related Problems

| Problem | LeetCode | Type | Key Extension |
|---------|----------|------|---------------|
| Min Stack | 155 | Core | Base pattern |
| Max Stack | 716 | Variation | Track max instead |
| Stack With Increment | 1381 | Augmented | Add operations |
| Online Stock Span | 901 | Monotonic | Counting spans |
| Daily Temperatures | 739 | Monotonic | Next greater element |

---

### Extension Checklist

| Extension | Approach | Complexity |
|-----------|----------|------------|
| Min + Max together | Store (val, min, max) | O(1) all ops |
| Min + Sum tracking | Store (val, min, running_sum) | O(1) all ops |
| Thread-safe | Add locks around operations | Same complexity |
| Persistent (undo) | Store history of states | O(n) per op |

<!-- back -->
