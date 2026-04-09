## Stack - Largest Rectangle in Histogram: Framework

What is the complete code template for the Largest Rectangle in Histogram pattern?

<!-- front -->

---

### Framework: Monotonic Stack Area Calculation

```
┌─────────────────────────────────────────────────────────────────────┐
│  LARGEST RECTANGLE IN HISTOGRAM - TEMPLATE                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Initialize:                                                       │
│     - stack = []  # Stores indices with increasing heights          │
│     - max_area = 0                                                  │
│     - Append 0 to heights (sentinel to flush stack)                 │
│                                                                     │
│  2. Iterate through each bar at index i:                            │
│     - While stack not empty AND heights[stack[-1]] > heights[i]:     │
│         - height = heights[stack.pop()]                              │
│         - width = i if stack empty, else i - stack[-1] - 1          │
│         - max_area = max(max_area, height * width)                  │
│       - Push i onto stack                                            │
│                                                                     │
│  3. Return max_area                                                  │
│                                                                     │
│  Key Formula: width = i - stack[-1] - 1 (when stack not empty)      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Monotonic Stack with Sentinel (Recommended)

```python
def largest_rectangle_area(heights: list[int]) -> int:
    """
    Find largest rectangle area in histogram.
    LeetCode 84 - Largest Rectangle in Histogram
    Time: O(n), Space: O(n)
    """
    stack = []  # Stack of indices with increasing heights
    max_area = 0
    
    # Add sentinel value to handle remaining bars
    heights = heights + [0]
    
    for i, h in enumerate(heights):
        # Pop while current height is smaller than stack top
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            # Calculate width
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        
        stack.append(i)
    
    return max_area


def largest_rectangle_area_no_modify(heights: list[int]) -> int:
    """
    Version that doesn't modify input (no sentinel needed).
    Time: O(n), Space: O(n)
    """
    stack = []
    max_area = 0
    n = len(heights)
    
    for i in range(n + 1):
        # Use 0 as sentinel when i == n
        h = heights[i] if i < n else 0
        
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        
        stack.append(i)
    
    return max_area
```

---

### Implementation: Multi-language

```cpp
int largestRectangleArea(vector<int>& heights) {
    stack<int> stack;
    int maxArea = 0;
    
    for (int i = 0; i <= heights.size(); i++) {
        int h = (i == heights.size()) ? 0 : heights[i];
        
        while (!stack.empty() && heights[stack.top()] > h) {
            int height = heights[stack.top()];
            stack.pop();
            int width = stack.empty() ? i : i - stack.top() - 1;
            maxArea = max(maxArea, height * width);
        }
        stack.push(i);
    }
    return maxArea;
}
```

```java
public int largestRectangleArea(int[] heights) {
    Stack<Integer> stack = new Stack<>();
    int maxArea = 0;
    
    for (int i = 0; i <= heights.length; i++) {
        int h = (i == heights.length) ? 0 : heights[i];
        
        while (!stack.isEmpty() && heights[stack.peek()] > h) {
            int height = heights[stack.pop()];
            int width = stack.isEmpty() ? i : i - stack.peek() - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }
    return maxArea;
}
```

---

### Key Framework Elements

| Element | Purpose | Formula/Pattern |
|---------|---------|-----------------|
| `stack` | Store indices in increasing height order | Push i when h >= stack top height |
| Pop condition | Calculate area when height decreases | `heights[stack[-1]] > h` |
| Height | Height of bar being popped | `heights[stack.pop()]` |
| Width | Range where popped bar is minimum | `i - stack[-1] - 1` or `i` if empty |
| Sentinel | Flush remaining bars | Append 0 to heights or iterate to n |
| Max area | Track largest rectangle seen | `max(max_area, height * width)` |

---

### Complexity Summary

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| Time | O(n) | Each index pushed and popped at most once |
| Space | O(n) | Stack size in worst case |

<!-- back -->
