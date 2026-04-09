## Stack - Min Stack Design: Framework

What is the complete code template for a Min Stack with O(1) operations?

<!-- front -->

---

### Framework: Min Stack Design

```
┌─────────────────────────────────────────────────────────┐
│  MIN STACK DESIGN - TEMPLATE                            │
├─────────────────────────────────────────────────────────┤
│  APPROACH 1: Pair Storage (Recommended)                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                  │
│  1. Store (value, current_min) tuple for each element  │
│  2. On push: new_min = min(val, stack[-1].min)         │
│     - If stack empty: new_min = val                     │
│  3. On pop: simply remove top tuple                    │
│  4. On getMin: return min from top tuple               │
│  5. On top: return value from top tuple                  │
├─────────────────────────────────────────────────────────┤
│  APPROACH 2: Two Stack Method                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━                          │
│  1. Main stack: stores values                           │
│  2. Min stack: stores only minimums                   │
│  3. On push: push to main, push to min if val <= min   │
│  4. On pop: pop from main, pop from min if match       │
│  5. On getMin: return top of min stack                 │
└─────────────────────────────────────────────────────────┘
```

---

### Implementation: Pair Storage (Recommended)

```python
class MinStack:
    def __init__(self):
        self.stack = []  # Stores (value, current_minimum)
    
    def push(self, val: int) -> None:
        current_min = min(val, self.stack[-1][1]) if self.stack else val
        self.stack.append((val, current_min))
    
    def pop(self) -> None:
        self.stack.pop()
    
    def top(self) -> int:
        return self.stack[-1][0]
    
    def getMin(self) -> int:
        return self.stack[-1][1]
```

---

### Implementation: Two Stacks

```python
class MinStackTwoStacks:
    def __init__(self):
        self.stack = []      # Main stack
        self.min_stack = []  # Auxiliary stack for minimums
    
    def push(self, val: int) -> None:
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
    
    def pop(self) -> None:
        val = self.stack.pop()
        if val == self.min_stack[-1]:
            self.min_stack.pop()
    
    def top(self) -> int:
        return self.stack[-1]
    
    def getMin(self) -> int:
        return self.min_stack[-1]
```

---

### Key Pattern Elements

| Element | Purpose | Approach |
|---------|---------|----------|
| Tuple storage | Store value + min together | Pair storage |
| Min stack | Track min history separately | Two stacks |
| min() on push | Calculate new minimum | Both |
| <= comparison | Handle duplicates correctly | Two stacks |

---

### Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| push | O(1) | O(n) total |
| pop | O(1) | - |
| top | O(1) | - |
| getMin | O(1) | - |

<!-- back -->
