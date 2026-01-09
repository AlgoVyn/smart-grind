# Product Of The Last K Numbers

## Problem Description

Design an algorithm that accepts a stream of integers and retrieves the product of the last k integers of the stream.
Implement the ProductOfNumbers class:

- `ProductOfNumbers()` Initializes the object with an empty stream.
- `void add(int num)` Appends the integer num to the stream.
- `int getProduct(int k)` Returns the product of the last k numbers in the current list. You can assume that always the current list has at least k numbers.

The test cases are generated so that, at any time, the product of any contiguous sequence of numbers will fit into a single 32-bit integer without overflowing.

### Example

**Input**
```python
["ProductOfNumbers","add","add","add","add","add","getProduct","getProduct","getProduct","add","getProduct"]
[[],[3],[0],[2],[5],[4],[2],[3],[4],[8],[2]]
```

**Output**
```python
[null,null,null,null,null,null,20,40,0,null,32]
```

**Explanation**
```python
ProductOfNumbers productOfNumbers = new ProductOfNumbers();
productOfNumbers.add(3);        // [3]
productOfNumbers.add(0);        // [3,0]
productOfNumbers.add(2);        // [3,0,2]
productOfNumbers.add(5);        // [3,0,2,5]
productOfNumbers.add(4);        // [3,0,2,5,4]
productOfNumbers.getProduct(2); // return 20. The product of the last 2 numbers is 5 * 4 = 20
productOfNumbers.getProduct(3); // return 40. The product of the last 3 numbers is 2 * 5 * 4 = 40
productOfNumbers.getProduct(4); // return 0. The product of the last 4 numbers is 0 * 2 * 5 * 4 = 0
productOfNumbers.add(8);        // [3,0,2,5,4,8]
productOfNumbers.getProduct(2); // return 32. The product of the last 2 numbers is 4 * 8 = 32
```

### Constraints

- `0 <= num <= 100`
- `1 <= k <= 4 * 10^4`
- At most `4 * 10^4` calls will be made to `add` and `getProduct`.
- The product of the stream at any point in time will fit in a 32-bit integer.

### Follow-up

Can you implement both GetProduct and Add to work in O(1) time complexity instead of O(k) time complexity?

---

## Solution

```python
class ProductOfNumbers:

    def __init__(self):
        self.prefix = [1]

    def add(self, num: int) -> None:
        if num == 0:
            self.prefix = [1]
        else:
            self.prefix.append(self.prefix[-1] * num)

    def getProduct(self, k: int) -> int:
        if k >= len(self.prefix):
            return 0
        return self.prefix[-1] // self.prefix[-1 - k]
```

---

## Explanation

Use a list for prefix products. When 0 is added, reset the list to [1] since any product including 0 is 0. For getProduct, return `prefix[-1] / prefix[-1-k]` if k < len, else 0.

### Step-by-step Approach

1. Maintain a prefix product list, initialized with `[1]`.
2. For `add(num)`:
   - If num is 0, reset prefix to `[1]`.
   - Otherwise, append `prefix[-1] * num`.
3. For `getProduct(k)`:
   - If k >= len(prefix), return 0 (k crosses a zero).
   - Otherwise, return `prefix[-1] // prefix[-1-k]`.

### Complexity Analysis

- **Time Complexity:** Add O(1), GetProduct O(1).
- **Space Complexity:** O(n).
