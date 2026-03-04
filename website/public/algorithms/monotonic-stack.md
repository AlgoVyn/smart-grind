# Monotonic Stack

## Category
Arrays & Strings

## Description

A **Monotonic Stack** is a stack-based technique that maintains elements in monotonic (strictly increasing or decreasing) order. It is used to efficiently solve problems involving **next greater element**, **next smaller element**, and various other array processing challenges in **O(n) time** with **O(n) space**.

The key insight is that by maintaining a monotonic stack, we can determine relationships between elements without nested loops, achieving linear time complexity instead of O(n²).

---

## When to Use

Use the Monotonic Stack algorithm when you need to solve problems involving:

- **Finding Next Greater/Smaller Elements**: For each element, find the first element to its left/right that is greater/smaller
- **Range Minimum/Maximum Queries**: Processing queries that ask for minimum/maximum in sliding windows
- **Stack-based Array Problems**: Problems that naturally involve comparing adjacent elements
- **Efficient O(n) Solutions**: When you need linear time instead of quadratic brute force

### Comparison with Alternatives

| Approach | Time Complexity | Space | Best For |
|----------|-----------------|-------|----------|
| **Brute Force** | O(n²) | O(1) | Small arrays, simplicity |
| **Monotonic Stack** | O(n) | O(n) | Next greater/smaller element problems |
| **Two-Pass Hash Map** | O(n) | O(n) | Caching results, simpler debugging |
| **Segment Tree** | O(n log n) build, O(log n) query | O(n) | Dynamic updates + queries |

### When to Choose Monotonic Stack vs Other Approaches

- **Choose Monotonic Stack** when:
  - You need to find next greater/smaller element for every position
  - The problem involves histogram/rectangle calculations
  - You need O(n) time with single pass through the array
  - The problem naturally has a "stackable" property (nested intervals)

- **Choose Brute Force** when:
  - Array size is very small (< 100 elements)
  - Simplicity is more important than efficiency
  - Problem doesn't have monotonic property

- **Choose Segment Tree** when:
  - You need both queries and updates
  - Range queries on dynamic data
  - More complex aggregation needed

---

## Algorithm Explanation

### Core Concept

The fundamental principle behind the Monotonic Stack is **delayed processing with stack-based tracking**. Instead of immediately finding the answer for each element, we maintain a stack of candidates that "wait" until a suitable element arrives.

### Types of Monotonic Stacks

1. **Monotonic Decreasing Stack**: Elements are in decreasing order (top is smallest)
   - Used for: **Next Greater Element** problems
   
2. **Monotonic Increasing Stack**: Elements are in increasing order (top is largest)
   - Used for: **Next Smaller Element** problems

### How It Works (Step-by-Step)

For **Next Greater Element** (using decreasing stack):

```
Array: [2, 1, 2, 4, 3]

Step-by-step:
┌─────┬────────────┬─────────┬───────────────────────────────┐
│ i   │ Current    │ Stack   │ Action                        │
├─────┼────────────┼─────────┼───────────────────────────────┤
│ 0   │ nums[0]=2  │ [0]     │ Push index 0 (value 2)        │
│ 1   │ nums[1]=1  │ [0,1]   │ 1 < 2, can't pop, push 1     │
│ 2   │ nums[2]=2  │ [0]     │ 2 > 1: pop idx 1→result[1]=2  │
│     │            │         │ 2 = 2: can't pop (not <)       │
│     │            │         │ Push index 2                  │
│ 3   │ nums[3]=4  │ []      │ 4 > 2: pop idx 2→result[2]=4  │
│     │            │         │ 4 > 2: pop idx 0→result[0]=4  │
│     │            │         │ Push index 3                 │
│ 4   │ nums[4]=3  │ [3,4]   │ 3 < 4, can't pop, push 4      │
└─────┴────────────┴─────────┴───────────────────────────────┘

Result: [4, 2, 4, -1, -1]
```

### Visual Representation

```
Monotonic Decreasing Stack (for Next Greater):

Input: [2, 1, 2, 4, 3]

Processing element 4 (at index 3):
┌─────────────────────────────────────────────────┐
│ Stack (before): [2@0, 1@1, 2@2]                │
│ Current: 4                                      │
│                                                 │
│ Pop 2@2 → result[2] = 4                        │
│ Pop 1@1 → result[1] = 4 (Wait! 1 < 4 is true)  │
│ Pop 2@0 → result[0] = 4 (Wait! 2 < 4 is true)  │
│                                                 │
│ Stack (after): [4@3]                           │
└─────────────────────────────────────────────────┘
```

### Why O(n) Time?

Each element is pushed onto the stack **exactly once** and popped **at most once**. Since there are n elements, the total operations are O(n).

### Key Properties

- **Single Pass**: Process array from left to right (or right to left)
- **Stack Stores Indices**: We store indices, not values, to track positions
- **Lazy Evaluation**: Elements wait in stack until a "better" element arrives
- **No Backtracking**: Once processed, we never revisit elements

---

## Algorithm Steps

### For Next Greater Element (Right Side)

1. **Initialize**: Create empty stack and result array filled with -1
2. **Iterate**: Loop through each index `i` from 0 to n-1
3. **Pop Smaller**: While stack is not empty AND nums[stack.top] < nums[i]:
   - Set result[stack.top] = nums[i] (current element is the next greater)
   - Pop from stack
4. **Push**: Push current index `i` onto stack
5. **Complete**: Any indices remaining in stack have no greater element (stay -1)

### For Next Smaller Element (Right Side)

1. **Initialize**: Create empty stack and result array filled with -1
2. **Iterate**: Loop through each index `i` from 0 to n-1
3. **Pop Greater**: While stack is not empty AND nums[stack.top] > nums[i]:
   - Set result[stack.top] = nums[i]
   - Pop from stack
4. **Push**: Push current index `i` onto stack

### For Circular Array

1. **Traverse twice**: Loop through indices 0 to 2n-1, using `i % n` for actual values
2. **Stop condition**: Break when all elements have found their answer

### For Left-Side Processing

- Simply iterate from right to left (reverse the array direction)

---

## Implementation

### Template Code (Next Greater/Smaller Element)

````carousel
```python
from typing import List, Optional
import sys

class MonotonicStack:
    """
    Monotonic Stack implementation for Next Greater/Smaller problems.
    
    Time Complexities:
        - Single pass: O(n)
        - Space: O(n)
    
    Supports:
        - Next Greater Element (right/left)
        - Next Smaller Element (right/left)
        - Circular arrays
    """
    
    @staticmethod
    def next_greater_right(nums: List[int]) -> List[int]:
        """
        Find the next greater element to the RIGHT of each element.
        
        Args:
            nums: Input array
            
        Returns:
            Array where result[i] = next greater element to right of nums[i],
            or -1 if no greater element exists
            
        Time: O(n), Space: O(n)
        """
        n = len(nums)
        result = [-1] * n
        stack = []  # Stores indices of elements in decreasing order
        
        for i in range(n):
            # Pop elements smaller than current (they found their answer)
            while stack and nums[stack[-1]] < nums[i]:
                result[stack.pop()] = nums[i]
            stack.append(i)
        
        # Remaining elements have no greater element to the right
        return result
    
    @staticmethod
    def next_smaller_right(nums: List[int]) -> List[int]:
        """
        Find the next smaller element to the RIGHT of each element.
        
        Time: O(n), Space: O(n)
        """
        n = len(nums)
        result = [-1] * n
        stack = []  # Stores indices of elements in increasing order
        
        for i in range(n):
            # Pop elements greater than current
            while stack and nums[stack[-1]] > nums[i]:
                result[stack.pop()] = nums[i]
            stack.append(i)
        
        return result
    
    @staticmethod
    def next_greater_left(nums: List[int]) -> List[int]:
        """
        Find the next greater element to the LEFT of each element.
        Iterate from left to right, but compare differently.
        
        Time: O(n), Space: O(n)
        """
        n = len(nums)
        result = [-1] * n
        stack = []  # Monotonic decreasing
        
        for i in range(n):
            # Pop while current is >= stack top (for strict greater, use >)
            while stack and nums[stack[-1]] <= nums[i]:
                stack.pop()
            # Stack not empty = top is next greater to left
            if stack:
                result[i] = nums[stack[-1]]
            stack.append(i)
        
        return result
    
    @staticmethod
    def next_smaller_left(nums: List[int]) -> List[int]:
        """
        Find the next smaller element to the LEFT of each element.
        
        Time: O(n), Space: O(n)
        """
        n = len(nums)
        result = [-1] * n
        stack = []  # Monotonic increasing
        
        for i in range(n):
            while stack and nums[stack[-1]] >= nums[i]:
                stack.pop()
            if stack:
                result[i] = nums[stack[-1]]
            stack.append(i)
        
        return result
    
    @staticmethod
    def next_greater_circular(nums: List[int]) -> List[int]:
        """
        Find the next greater element in a CIRCULAR array.
        Wraps around to the beginning.
        
        Time: O(n), Space: O(n)
        """
        n = len(nums)
        result = [-1] * n
        stack = []
        
        for i in range(2 * n):
            curr = nums[i % n]
            
            while stack and nums[stack[-1]] < curr:
                idx = stack.pop()
                if result[idx] == -1:  # Only set once (first greater)
                    result[idx] = curr
            
            if i < n:  # Only push indices from first pass
                stack.append(i % n)
            
            # Optimization: break if stack is empty after first pass
            if i >= n - 1 and not stack:
                break
        
        return result
    
    @staticmethod
    def daily_temperatures(temps: List[int]) -> List[int]:
        """
        LeetCode 739: Daily Temperatures
        Find number of days to wait for warmer temperature.
        
        Time: O(n), Space: O(n)
        """
        n = len(temps)
        result = [0] * n
        stack = []  # Store indices
        
        for i in range(n):
            # Pop colder days, they're done waiting
            while stack and temps[stack[-1]] < temps[i]:
                prev_idx = stack.pop()
                result[prev_idx] = i - prev_idx
            stack.append(i)
        
        # Remaining indices already have 0 (no warmer day)
        return result
    
    @staticmethod
    def largest_rectangle_histogram(heights: List[int]) -> int:
        """
        LeetCode 84: Largest Rectangle in Histogram
        Find largest rectangle in histogram.
        
        Time: O(n), Space: O(n)
        
        Adds sentinel (0 height) at end to flush stack
        """
        n = len(heights)
        stack = []  # Store indices of increasing heights
        max_area = 0
        
        for i in range(n + 1):
            h = heights[i] if i < n else 0  # Sentinel
            
            while stack and heights[stack[-1]] > h:
                height = heights[stack.pop()]
                width = i if not stack else i - stack[-1] - 1
                max_area = max(max_area, height * width)
            
            stack.append(i)
        
        return max_area


# Example usage and demonstration
if __name__ == "__main__":
    print("=" * 60)
    print("Monotonic Stack - Demo Examples")
    print("=" * 60)
    
    # Example 1: Next Greater Element
    nums = [2, 1, 2, 4, 3]
    result = MonotonicStack.next_greater_right(nums)
    print(f"\nInput: {nums}")
    print(f"Next Greater (right): {result}")
    # Expected: [4, 2, 4, -1, -1]
    
    # Example 2: Next Smaller Element
    result_smaller = MonotonicStack.next_smaller_right(nums)
    print(f"Next Smaller (right): {result_smaller}")
    # Expected: [-1, 1, -1, 3, -1]
    
    # Example 3: Next Greater Left
    result_left = MonotonicStack.next_greater_left(nums)
    print(f"Next Greater (left): {result_left}")
    # Expected: [-1, 2, 2, 4, 4]
    
    # Example 4: Circular Next Greater
    nums2 = [1, 2, 3, 4]
    result_circular = MonotonicStack.next_greater_circular(nums2)
    print(f"\nCircular Input: {nums2}")
    print(f"Next Greater (circular): {result_circular}")
    # Expected: [2, 3, 4, 1]
    
    # Example 5: Daily Temperatures
    temps = [73, 74, 75, 71, 69, 72, 76, 73]
    days = MonotonicStack.daily_temperatures(temps)
    print(f"\nTemperatures: {temps}")
    print(f"Days to wait: {days}")
    # Expected: [1, 1, 4, 2, 1, 1, 0, 0]
    
    # Example 6: Largest Rectangle in Histogram
    heights = [2, 1, 5, 6, 2, 3]
    area = MonotonicStack.largest_rectangle_histogram(heights)
    print(f"\nHistogram heights: {heights}")
    print(f"Largest rectangle area: {area}")
    # Expected: 10 (5*2)
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <stack>
#include <algorithm>
using namespace std;

/**
 * Monotonic Stack implementation for Next Greater/Smaller problems.
 * 
 * Time Complexities:
 *     - Single pass: O(n)
 *     - Space: O(n)
 */
class MonotonicStack {
public:
    /**
     * Find next greater element to the RIGHT of each element.
     * Uses monotonic decreasing stack.
     * 
     * Time: O(n), Space: O(n)
     */
    static vector<int> nextGreaterRight(const vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n, -1);
        stack<int> st;  // Stores indices
        
        for (int i = 0; i < n; i++) {
            // Pop elements smaller than current
            while (!st.empty() && nums[st.top()] < nums[i]) {
                result[st.top()] = nums[i];
                st.pop();
            }
            st.push(i);
        }
        
        return result;
    }
    
    /**
     * Find next smaller element to the RIGHT of each element.
     * Uses monotonic increasing stack.
     * 
     * Time: O(n), Space: O(n)
     */
    static vector<int> nextSmallerRight(const vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n, -1);
        stack<int> st;
        
        for (int i = 0; i < n; i++) {
            // Pop elements greater than current
            while (!st.empty() && nums[st.top()] > nums[i]) {
                result[st.top()] = nums[i];
                st.pop();
            }
            st.push(i);
        }
        
        return result;
    }
    
    /**
     * Find next greater element to the LEFT of each element.
     * 
     * Time: O(n), Space: O(n)
     */
    static vector<int> nextGreaterLeft(const vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n, -1);
        stack<int> st;
        
        for (int i = 0; i < n; i++) {
            while (!st.empty() && nums[st.top()] <= nums[i]) {
                st.pop();
            }
            if (!st.empty()) {
                result[i] = nums[st.top()];
            }
            st.push(i);
        }
        
        return result;
    }
    
    /**
     * Find next greater element in CIRCULAR array.
     * 
     * Time: O(n), Space: O(n)
     */
    static vector<int> nextGreaterCircular(const vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n, -1);
        stack<int> st;
        
        for (int i = 0; i < 2 * n; i++) {
            int curr = nums[i % n];
            
            while (!st.empty() && nums[st.top()] < curr) {
                int idx = st.top();
                if (result[idx] == -1) {
                    result[idx] = curr;
                }
                st.pop();
            }
            
            if (i < n) {
                st.push(i % n);
            }
            
            if (i >= n - 1 && st.empty()) {
                break;
            }
        }
        
        return result;
    }
    
    /**
     * LeetCode 739: Daily Temperatures
     * Find number of days to wait for warmer temperature.
     * 
     * Time: O(n), Space: O(n)
     */
    static vector<int> dailyTemperatures(const vector<int>& temps) {
        int n = temps.size();
        vector<int> result(n, 0);
        stack<int> st;
        
        for (int i = 0; i < n; i++) {
            while (!st.empty() && temps[st.top()] < temps[i]) {
                int prevIdx = st.top();
                result[prevIdx] = i - prevIdx;
                st.pop();
            }
            st.push(i);
        }
        
        return result;
    }
    
    /**
     * LeetCode 84: Largest Rectangle in Histogram
     * Find largest rectangle in histogram.
     * 
     * Time: O(n), Space: O(n)
     */
    static int largestRectangleHistogram(const vector<int>& heights) {
        int n = heights.size();
        stack<int> st;
        int maxArea = 0;
        
        for (int i = 0; i <= n; i++) {
            int h = (i < n) ? heights[i] : 0;  // Sentinel
            
            while (!st.empty() && heights[st.top()] > h) {
                int height = heights[st.top()];
                st.pop();
                int width = st.empty() ? i : i - st.top() - 1;
                maxArea = max(maxArea, height * width);
            }
            
            st.push(i);
        }
        
        return maxArea;
    }
};

// Demo main function
int main() {
    cout << "=" << 60 << endl;
    cout << "Monotonic Stack - Demo Examples" << endl;
    cout << "=" << 60 << endl;
    
    // Example 1: Next Greater
    vector<int> nums = {2, 1, 2, 4, 3};
    vector<int> result = MonotonicStack::nextGreaterRight(nums);
    
    cout << "\nInput: ";
    for (int x : nums) cout << x << " ";
    cout << "\nNext Greater (right): ";
    for (int x : result) cout << x << " ";
    cout << endl;
    // Expected: [4, 2, 4, -1, -1]
    
    // Example 2: Next Smaller
    vector<int> resultSmaller = MonotonicStack::nextSmallerRight(nums);
    cout << "Next Smaller (right): ";
    for (int x : resultSmaller) cout << x << " ";
    cout << endl;
    // Expected: [-1, 1, -1, 3, -1]
    
    // Example 3: Circular
    vector<int> nums2 = {1, 2, 3, 4};
    vector<int> resultCircular = MonotonicStack::nextGreaterCircular(nums2);
    cout << "\nCircular Input: ";
    for (int x : nums2) cout << x << " ";
    cout << "\nNext Greater (circular): ";
    for (int x : resultCircular) cout << x << " ";
    cout << endl;
    // Expected: [2, 3, 4, 1]
    
    // Example 4: Daily Temperatures
    vector<int> temps = {73, 74, 75, 71, 69, 72, 76, 73};
    vector<int> days = MonotonicStack::dailyTemperatures(temps);
    cout << "\nTemperatures: ";
    for (int x : temps) cout << x << " ";
    cout << "\nDays to wait: ";
    for (int x : days) cout << x << " ";
    cout << endl;
    // Expected: [1, 1, 4, 2, 1, 1, 0, 0]
    
    // Example 5: Largest Rectangle
    vector<int> heights = {2, 1, 5, 6, 2, 3};
    int area = MonotonicStack::largestRectangleHistogram(heights);
    cout << "\nHistogram heights: ";
    for (int x : heights) cout << x << " ";
    cout << "\nLargest rectangle area: " << area << endl;
    // Expected: 10
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Monotonic Stack implementation for Next Greater/Smaller problems.
 * 
 * Time Complexities:
 *     - Single pass: O(n)
 *     - Space: O(n)
 */
public class MonotonicStack {
    
    /**
     * Find next greater element to the RIGHT of each element.
     * Uses monotonic decreasing stack.
     * 
     * Time: O(n), Space: O(n)
     */
    public static int[] nextGreaterRight(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Arrays.fill(result, -1);
        
        Deque<Integer> stack = new ArrayDeque<>();  // Stores indices
        
        for (int i = 0; i < n; i++) {
            // Pop elements smaller than current
            while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
                result[stack.pop()] = nums[i];
            }
            stack.push(i);
        }
        
        return result;
    }
    
    /**
     * Find next smaller element to the RIGHT of each element.
     * Uses monotonic increasing stack.
     * 
     * Time: O(n), Space: O(n)
     */
    public static int[] nextSmallerRight(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Arrays.fill(result, -1);
        
        Deque<Integer> stack = new ArrayDeque<>();
        
        for (int i = 0; i < n; i++) {
            // Pop elements greater than current
            while (!stack.isEmpty() && nums[stack.peek()] > nums[i]) {
                result[stack.pop()] = nums[i];
            }
            stack.push(i);
        }
        
        return result;
    }
    
    /**
     * Find next greater element to the LEFT of each element.
     * 
     * Time: O(n), Space: O(n)
     */
    public static int[] nextGreaterLeft(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Arrays.fill(result, -1);
        
        Deque<Integer> stack = new ArrayDeque<>();
        
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && nums[stack.peek()] <= nums[i]) {
                stack.pop();
            }
            if (!stack.isEmpty()) {
                result[i] = nums[stack.peek()];
            }
            stack.push(i);
        }
        
        return result;
    }
    
    /**
     * Find next greater element in CIRCULAR array.
     * 
     * Time: O(n), Space: O(n)
     */
    public static int[] nextGreaterCircular(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Arrays.fill(result, -1);
        
        Deque<Integer> stack = new ArrayDeque<>();
        
        for (int i = 0; i < 2 * n; i++) {
            int curr = nums[i % n];
            
            while (!stack.isEmpty() && nums[stack.peek()] < curr) {
                int idx = stack.pop();
                if (result[idx] == -1) {
                    result[idx] = curr;
                }
            }
            
            if (i < n) {
                stack.push(i % n);
            }
            
            if (i >= n - 1 && stack.isEmpty()) {
                break;
            }
        }
        
        return result;
    }
    
    /**
     * LeetCode 739: Daily Temperatures
     * Find number of days to wait for warmer temperature.
     * 
     * Time: O(n), Space: O(n)
     */
    public static int[] dailyTemperatures(int[] temps) {
        int n = temps.length;
        int[] result = new int[n];
        Arrays.fill(result, 0);
        
        Deque<Integer> stack = new ArrayDeque<>();
        
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temps[stack.peek()] < temps[i]) {
                int prevIdx = stack.pop();
                result[prevIdx] = i - prevIdx;
            }
            stack.push(i);
        }
        
        return result;
    }
    
    /**
     * LeetCode 84: Largest Rectangle in Histogram
     * Find largest rectangle in histogram.
     * 
     * Time: O(n), Space: O(n)
     */
    public static int largestRectangleHistogram(int[] heights) {
        int n = heights.length;
        Deque<Integer> stack = new ArrayDeque<>();
        int maxArea = 0;
        
        for (int i = 0; i <= n; i++) {
            int h = (i < n) ? heights[i] : 0;  // Sentinel
            
            while (!stack.isEmpty() && heights[stack.peek()] > h) {
                int height = heights[stack.pop()];
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            
            stack.push(i);
        }
        
        return maxArea;
    }
    
    // Demo main method
    public static void main(String[] args) {
        System.out.println("=".repeat(60));
        System.out.println("Monotonic Stack - Demo Examples");
        System.out.println("=".repeat(60));
        
        // Example 1: Next Greater
        int[] nums = {2, 1, 2, 4, 3};
        int[] result = nextGreaterRight(nums);
        
        System.out.println("\nInput: " + Arrays.toString(nums));
        System.out.println("Next Greater (right): " + Arrays.toString(result));
        // Expected: [4, 2, 4, -1, -1]
        
        // Example 2: Next Smaller
        int[] resultSmaller = nextSmallerRight(nums);
        System.out.println("Next Smaller (right): " + Arrays.toString(resultSmaller));
        // Expected: [-1, 1, -1, 3, -1]
        
        // Example 3: Circular
        int[] nums2 = {1, 2, 3, 4};
        int[] resultCircular = nextGreaterCircular(nums2);
        System.out.println("\nCircular Input: " + Arrays.toString(nums2));
        System.out.println("Next Greater (circular): " + Arrays.toString(resultCircular));
        // Expected: [2, 3, 4, 1]
        
        // Example 4: Daily Temperatures
        int[] temps = {73, 74, 75, 71, 69, 72, 76, 73};
        int[] days = dailyTemperatures(temps);
        System.out.println("\nTemperatures: " + Arrays.toString(temps));
        System.out.println("Days to wait: " + Arrays.toString(days));
        // Expected: [1, 1, 4, 2, 1, 1, 0, 0]
        
        // Example 5: Largest Rectangle
        int[] heights = {2, 1, 5, 6, 2, 3};
        int area = largestRectangleHistogram(heights);
        System.out.println("\nHistogram heights: " + Arrays.toString(heights));
        System.out.println("Largest rectangle area: " + area);
        // Expected: 10
    }
}
```

<!-- slide -->
```javascript
/**
 * Monotonic Stack implementation for Next Greater/Smaller problems.
 * 
 * Time Complexities:
 *     - Single pass: O(n)
 *     - Space: O(n)
 */
class MonotonicStack {
    /**
     * Find next greater element to the RIGHT of each element.
     * Uses monotonic decreasing stack.
     * 
     * @param {number[]} nums - Input array
     * @returns {number[]} Array where result[i] = next greater to right, or -1
     * 
     * Time: O(n), Space: O(n)
     */
    static nextGreaterRight(nums) {
        const n = nums.length;
        const result = new Array(n).fill(-1);
        const stack = [];  // Stores indices
        
        for (let i = 0; i < n; i++) {
            // Pop elements smaller than current
            while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
                result[stack.pop()] = nums[i];
            }
            stack.push(i);
        }
        
        return result;
    }
    
    /**
     * Find next smaller element to the RIGHT of each element.
     * Uses monotonic increasing stack.
     * 
     * Time: O(n), Space: O(n)
     */
    static nextSmallerRight(nums) {
        const n = nums.length;
        const result = new Array(n).fill(-1);
        const stack = [];
        
        for (let i = 0; i < n; i++) {
            // Pop elements greater than current
            while (stack.length && nums[stack[stack.length - 1]] > nums[i]) {
                result[stack.pop()] = nums[i];
            }
            stack.push(i);
        }
        
        return result;
    }
    
    /**
     * Find next greater element to the LEFT of each element.
     * 
     * Time: O(n), Space: O(n)
     */
    static nextGreaterLeft(nums) {
        const n = nums.length;
        const result = new Array(n).fill(-1);
        const stack = [];
        
        for (let i = 0; i < n; i++) {
            while (stack.length && nums[stack[stack.length - 1]] <= nums[i]) {
                stack.pop();
            }
            if (stack.length) {
                result[i] = nums[stack[stack.length - 1]];
            }
            stack.push(i);
        }
        
        return result;
    }
    
    /**
     * Find next greater element in CIRCULAR array.
     * 
     * Time: O(n), Space: O(n)
     */
    static nextGreaterCircular(nums) {
        const n = nums.length;
        const result = new Array(n).fill(-1);
        const stack = [];
        
        for (let i = 0; i < 2 * n; i++) {
            const curr = nums[i % n];
            
            while (stack.length && nums[stack[stack.length - 1]] < curr) {
                const idx = stack.pop();
                if (result[idx] === -1) {
                    result[idx] = curr;
                }
            }
            
            if (i < n) {
                stack.push(i % n);
            }
            
            if (i >= n - 1 && stack.length === 0) {
                break;
            }
        }
        
        return result;
    }
    
    /**
     * LeetCode 739: Daily Temperatures
     * Find number of days to wait for warmer temperature.
     * 
     * @param {number[]} temps - Temperature array
     * @returns {number[]} Days to wait for warmer temperature
     * 
     * Time: O(n), Space: O(n)
     */
    static dailyTemperatures(temps) {
        const n = temps.length;
        const result = new Array(n).fill(0);
        const stack = [];  // Stores indices
        
        for (let i = 0; i < n; i++) {
            while (stack.length && temps[stack[stack.length - 1]] < temps[i]) {
                const prevIdx = stack.pop();
                result[prevIdx] = i - prevIdx;
            }
            stack.push(i);
        }
        
        return result;
    }
    
    /**
     * LeetCode 84: Largest Rectangle in Histogram
     * Find largest rectangle in histogram.
     * 
     * @param {number[]} heights - Histogram heights
     * @returns {number} Largest rectangle area
     * 
     * Time: O(n), Space: O(n)
     */
    static largestRectangleHistogram(heights) {
        const n = heights.length;
        const stack = [];  // Stores indices
        let maxArea = 0;
        
        for (let i = 0; i <= n; i++) {
            const h = i < n ? heights[i] : 0;  // Sentinel
            
            while (stack.length && heights[stack[stack.length - 1]] > h) {
                const height = heights[stack.pop()];
                const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            
            stack.push(i);
        }
        
        return maxArea;
    }
}


// Example usage and demonstration
console.log("=".repeat(60));
console.log("Monotonic Stack - Demo Examples");
console.log("=".repeat(60));

// Example 1: Next Greater
const nums = [2, 1, 2, 4, 3];
const result = MonotonicStack.nextGreaterRight(nums);
console.log(`\nInput: [${nums.join(', ')}]`);
console.log(`Next Greater (right): [${result.join(', ')}]`);
// Expected: [4, 2, 4, -1, -1]

// Example 2: Next Smaller
const resultSmaller = MonotonicStack.nextSmallerRight(nums);
console.log(`Next Smaller (right): [${resultSmaller.join(', ')}]`);
// Expected: [-1, 1, -1, 3, -1]

// Example 3: Circular
const nums2 = [1, 2, 3, 4];
const resultCircular = MonotonicStack.nextGreaterCircular(nums2);
console.log(`\nCircular Input: [${nums2.join(', ')}]`);
console.log(`Next Greater (circular): [${resultCircular.join(', ')}]`);
// Expected: [2, 3, 4, 1]

// Example 4: Daily Temperatures
const temps = [73, 74, 75, 71, 69, 72, 76, 73];
const days = MonotonicStack.dailyTemperatures(temps);
console.log(`\nTemperatures: [${temps.join(', ')}]`);
console.log(`Days to wait: [${days.join(', ')}]`);
// Expected: [1, 1, 4, 2, 1, 1, 0, 0]

// Example 5: Largest Rectangle
const heights = [2, 1, 5, 6, 2, 3];
const area = MonotonicStack.largestRectangleHistogram(heights);
console.log(`\nHistogram heights: [${heights.join(', ')}]`);
console.log(`Largest rectangle area: ${area}`);
// Expected: 10
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Single Pass (Push/Pop)** | O(n) | Each element pushed/popped at most once |
| **Next Greater (Right)** | O(n) | One forward pass through array |
| **Next Smaller (Right)** | O(n) | One forward pass through array |
| **Next Greater (Left)** | O(n) | One forward pass comparing to stack |
| **Circular Array** | O(n) | At most 2 passes through array |
| **Daily Temperatures** | O(n) | Single pass with stack |
| **Largest Rectangle** | O(n) | Single pass with sentinel |

### Detailed Breakdown

- **Best Case**: O(n) - when array is already monotonic or all elements find answers immediately
- **Worst Case**: O(n) - each element pushed and popped exactly once
- **Average**: O(n) - guaranteed linear time

### Space Complexity Analysis

| Structure | Space | Description |
|-----------|-------|-------------|
| **Stack** | O(n) | Worst case: strictly increasing/decreasing array |
| **Result Array** | O(n) | Stores answer for each element |
| **Total** | O(n) | Linear space required |

---

## Common Variations

### 1. Monotonic Decreasing Stack (Next Greater)

Used when you need to find the next bigger element.

```python
# Pseudocode
stack = []  # decreasing (largest at bottom)
for i in range(n):
    while stack and nums[stack[-1]] < nums[i]:
        result[stack.pop()] = nums[i]
    stack.append(i)
```

### 2. Monotonic Increasing Stack (Next Smaller)

Used when you need to find the next smaller element.

```python
# Pseudocode
stack = []  # increasing (smallest at bottom)
for i in range(n):
    while stack and nums[stack[-1]] > nums[i]:
        result[stack.pop()] = nums[i]
    stack.append(i)
```

### 3. Strict vs Non-Strict Comparisons

- **Strict** (`<` or `>`): Find next strictly greater/smaller
- **Non-strict** (`<=` or `>=`): Find next greater-or-equal/smaller-or-equal

### 4. Processing from Right to Left

Sometimes more intuitive for certain problems:

```python
# Process from right
for i in reversed(range(n)):
    while stack and nums[stack[-1]] <= nums[i]:
        stack.pop()
    # Now top of stack is next greater to the right
    result[i] = nums[stack[-1]] if stack else -1
    stack.append(i)
```

### 5. Two-Pass for Circular Arrays

Traverse array twice to handle wrap-around:

```python
for i in range(2 * n):
    curr = nums[i % n]
    # Process with circular comparison
```

### 6. Stack with Additional Data

Store tuples for complex tracking:

```python
# Track count or frequency
stack = []  # [(value, count), ...]

# Track minimum in stack
stack = []  # [(value, current_min), ...]
```

---

## Practice Problems

### Problem 1: Next Greater Element I

**Problem:** [LeetCode 496 - Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)

**Description:** You are given two integer arrays `nums1` and `nums2` (where `nums1` is a subset of `nums2`). For each element in `nums1`, find the next greater element in `nums2`.

**How to Apply Monotonic Stack:**
- First, build next greater map for all elements in `nums2` using monotonic stack in O(n)
- Then simply look up each element from `nums1` in O(m) where m = len(nums1)
- Total: O(n + m)

---

### Problem 2: Daily Temperatures

**Problem:** [LeetCode 739 - Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)

**Description:** Given an array of daily temperatures, return an array where `answer[i]` is the number of days to wait for a warmer temperature.

**How to Apply Monotonic Stack:**
- Use monotonic decreasing stack (stores indices)
- When a warmer temperature arrives, pop and calculate days waited
- Continue until stack is empty or current temp is not warmer

---

### Problem 3: Largest Rectangle in Histogram

**Problem:** [LeetCode 84 - Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)

**Description:** Given an array representing bar heights in a histogram, find the largest rectangle area.

**How to Apply Monotonic Stack:**
- Use monotonic increasing stack
- Add sentinel (height 0) at end to "flush" the stack
- When popping a bar, calculate area with current bar as shortest
- Width = distance to next smaller bar in stack

---

### Problem 4: Sum of Subarray Minimums

**Problem:** [LeetCode 907 - Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums/)

**Description:** Given an array, find the sum of minimums of all subarrays.

**How to Apply Monotonic Stack:**
- For each element, find how many subarrays where it's the minimum
- Use two passes: count subarrays where element is "next smaller" on left/right
- Contribution = arr[i] × left_count × right_count

---

### Problem 5: Online Stock Span

**Problem:** [LeetCode 901 - Online Stock Span](https://leetcode.com/problems/online-stock-span/)

**Description:** Define span as number of consecutive days (including today) with price ≤ today's price. Implement a stock span class.

**How to Apply Monotonic Stack:**
- Use decreasing stack (larger prices at bottom)
- For each price, pop smaller/equal prices, accumulate span
- Stack stores (price, span) pairs

---

## Video Tutorial Links

### Fundamentals

- [Monotonic Stack - Introduction (Take U Forward)](https://www.youtube.com/watch?v=vxhG9bjSm6I) - Comprehensive introduction
- [Monotonic Stack Implementation (NeetCode)](https://www.youtube.com/watch?v=cT8xSso4yg0) - Practical implementation
- [Next Greater Element (WilliamFiset)](https://www.youtube.com/watch?v=DuX6R8Q4riU) - Detailed explanation

### Problem-Specific

- [Largest Rectangle in Histogram](https://www.youtube.com/watch?v=zx5x3bKzg1o) - LeetCode 84 solution
- [Daily Temperatures](https://www.youtube.com/watch?v=WTpI1L9P-Ss) - LeetCode 739 solution
- [Stock Span Problem](https://www.youtube.com/watch?v=0lZhr1cR4fQ) - Classic monotonic stack application

### Advanced

- [Sum of Subarray Minimums](https://www.youtube.com/watch?v=xH4VSxfgP5I) - Advanced monotonic stack
- [Monotonic Stack Patterns](https://www.youtube.com/watch?v=RRM2L-VBhOA) - Common patterns and variations

---

## Follow-up Questions

### Q1: When should I use a monotonic decreasing vs increasing stack?

**Answer:** 
- **Decreasing Stack** (largest at bottom): When finding **next greater** element
- **Increasing Stack** (smallest at bottom): When finding **next smaller** element

The stack always keeps the "waiting" elements in monotonic order. When a new element arrives that breaks the monotonic property, those waiting elements have found their answer.

### Q2: Can Monotonic Stack be used for left-side queries?

**Answer:** Yes! You have two options:
1. **Reverse iteration**: Process array from right to left
2. **Adapt comparison**: Process left to right but change the comparison logic (see `next_greater_left` example)

### Q3: What if I need both next greater and next smaller?

**Answer:** Run the algorithm twice (O(2n) = O(n)), or modify to track both in single pass with two stacks. For most problems, two passes is cleaner and still linear.

### Q4: How do I handle duplicate elements?

**Answer:** Depends on requirement:
- **Strict** (`<` or `>`): Duplicates don't count as "greater" or "smaller"
- **Non-strict** (`<=` or `>=`): Duplicates count
- Example: For "next greater or equal", use `while stack and nums[stack[-1]] <= nums[i]`

### Q5: Can Monotonic Stack be used for minimum instead of maximum?

**Answer:** Yes! Simply flip the comparison:
- For **next smaller**: Use increasing stack, pop when `nums[top] > nums[i]`
- For **next greater**: Use decreasing stack, pop when `nums[top] < nums[i]`

The algorithm is symmetric.

---

## Summary

The Monotonic Stack is an elegant technique for solving **next greater/smaller element** problems in **O(n) time**. Key takeaways:

- **Linear Time**: Each element pushed/popped at most once → O(n)
- **Stack-Based**: Maintains monotonic order to efficiently find relationships
- **Versatile**: Works for left/right queries, circular arrays, and more
- **Common Applications**: Daily Temperatures, Largest Rectangle in Histogram, Stock Span

When to use:
- ✅ Finding next greater/smaller element for each position
- ✅ Histogram/rectangle problems
- ✅ Problems with "waiting" element patterns
- ❌ When you need random access to results (use hash map instead)
- ❌ When space is extremely constrained (O(n) required)

This technique is essential for competitive programming and technical interviews, especially in problems involving array relationships and range queries.

---

## Related Algorithms

- [Stack](./stack.md) - Basic stack data structure
- [Two Pointers](./two-pointers.md) - Another O(n) array technique
- [Sliding Window](./sliding-window.md) - Related O(n) pattern
- [Prefix Sum](./prefix-sum.md) - For range sum queries
