# Final Prices With A Special Discount In A Shop

## Solution

You are given an integer array prices where prices[i] is the price of the ith item in a shop.
There is a special discount for items in the shop. If you buy the ith item, then you will receive a discount equivalent to prices[j] where j is the minimum index such that j > i and prices[j] <= prices[i]. Otherwise, you will not receive any discount at all.
Return an integer array answer where answer[i] is the final price you will pay for the ith item of the shop, considering the special discount.

## Constraints

- 1 <= prices.length <= 500
- 1 <= prices[i] <= 1000

## Example 1

**Input:**
```python
prices = [8,4,6,2,3]
```

**Output:**
```python
[4,2,4,2,3]
```

**Explanation:**
For item 0 with price[0]=8 you will receive a discount equivalent to prices[1]=4, therefore, the final price you will pay is 8 - 4 = 4.
For item 1 with price[1]=4 you will receive a discount equivalent to prices[3]=2, therefore, the final price you will pay is 4 - 2 = 2.
For item 2 with price[2]=6 you will receive a discount equivalent to prices[3]=2, therefore, the final price you will pay is 6 - 2 = 4.
For items 3 and 4 you will not receive any discount at all.

## Example 2

**Input:**
```python
prices = [1,2,3,4,5]
```

**Output:**
```python
[1,2,3,4,5]
```

**Explanation:**
In this case, for all items, you will not receive any discount at all.

## Example 3

**Input:**
```python
prices = [10,1,1,6]
```

**Output:**
```python
[9,0,1,6]
```

## Solution

```python
from typing import List

class Solution:
    def finalPrices(self, prices: List[int]) -> List[int]:
        n = len(prices)
        answer = [0] * n
        stack = []
        for i in range(n - 1, -1, -1):
            while stack and prices[stack[-1]] > prices[i]:
                stack.pop()
            if stack:
                answer[i] = prices[i] - prices[stack[-1]]
            else:
                answer[i] = prices[i]
            stack.append(i)
        return answer
```

## Explanation

We need to compute the final prices after applying discounts based on the next smaller or equal price to the right. This is efficiently solved using a monotonic stack that maintains indices in decreasing order of prices.

### Step-by-Step Explanation:

1. **Initialize stack and answer array**: Create an empty stack and an answer array of the same size as prices.

2. **Iterate from right to left**: For each index i from n-1 down to 0:
   - While the stack is not empty and the price at the top of the stack is greater than prices[i], pop the stack (these cannot be discounts for future elements).
   - If the stack is not empty, the top of the stack is the index j where prices[j] <= prices[i], so discount = prices[j]. Otherwise, discount = 0.
   - Set answer[i] = prices[i] - discount.
   - Push i onto the stack.

3. **Return the answer array**.

### Time Complexity:

- O(n), where n is the length of prices, as each element is pushed and popped at most once.

### Space Complexity:

- O(n), for the stack and answer array.
