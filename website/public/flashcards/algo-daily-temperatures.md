## Daily Temperatures

**Question:** How do you find days until warmer temperature for each day?

<!-- front -->

---

## Answer: Monotonic Stack

### Solution
```python
def dailyTemperatures(temperatures):
    n = len(temperatures)
    result = [0] * n
    stack = []  # Store indices
    
    for i in range(n):
        # While current day is warmer than top of stack
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_day = stack.pop()
            result[prev_day] = i - prev_day
        
        stack.append(i)
    
    return result
```

### Visual
```
temperatures = [73,74,75,71,69,72,76,73]

Day 0: 73 → stack: [0]
Day 1: 74 → warmer than 73 → result[0]=1 → stack: [1]
Day 2: 75 → warmer than 74 → result[1]=1 → stack: [2]
Day 3: 71 → stack: [2,3]
Day 4: 69 → stack: [2,3,4]
Day 5: 72 → warmer than 69→result[4]=1, 71→result[3]=1, 75→stack:[2,5]
Day 6: 76 → warmer than 72→result[5]=1, 75→result[2]=4 → stack: [6]
Day 7: 73 → stack: [6,7]

Result: [1,1,4,1,1,1,0,0]
```

### Complexity
- **Time:** O(n) - each element pushed/popped once
- **Space:** O(n)

### Key Points
- Stack stores indices of increasing temperatures
- Find next greater element for each position

<!-- back -->
