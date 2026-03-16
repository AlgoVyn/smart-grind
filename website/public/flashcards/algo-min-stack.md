## Min Stack

**Question:** Design stack with O(1) push, pop, top, and getMin?

<!-- front -->

---

## Answer: Two Stacks Approach

### Solution
```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []
    
    def push(self, val):
        self.stack.append(val)
        
        # Track minimum
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
    
    def pop(self):
        val = self.stack.pop()
        
        # Remove from min_stack if needed
        if val == self.min_stack[-1]:
            self.min_stack.pop()
    
    def top(self):
        return self.stack[-1]
    
    def getMin(self):
        return self.min_stack[-1]
```

### Visual: Stacks
```
Operations:
push(5)    → stack:[5], min:[5]
push(3)    → stack:[5,3], min:[5,3]
push(7)    → stack:[5,3,7], min:[5,3]
push(3)    → stack:[5,3,7,3], min:[5,3,3]
pop()      → stack:[5,3,7], min:[5,3]
pop()      → stack:[5,3], min:[5,3]
getMin()   → 3
top()      → 3
```

### ⚠️ Tricky Parts

#### 1. Duplicate Minimums
```python
# Use <= not < for duplicate handling
# When same minimum is pushed twice
# Must remove correctly on pop

# If we used <:
# push(3), push(3), pop() → min_stack still has 3 ✗

# Using <=:
# push(3), push(3) → min:[3,3]
# pop() → removes one, still has one ✓
```

#### 2. Alternative: Single Stack with Pairs
```python
# Store (value, current_min) pairs
stack = []

def push(val):
    min_val = min(val, stack[-1][1] if stack else val)
    stack.append((val, min_val))
```

### Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| All ops | O(1) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using < instead of <= | Handle duplicates |
| Not updating min | Update on every push |
| Wrong comparison | Check min_stack not empty |

<!-- back -->
