# Product Of The Last K Numbers

## LeetCode Link

[LeetCode 1352 - Product of the Last K Numbers](https://leetcode.com/problems/product-of-the-last-k-numbers/)

---

## Problem Description

Design an algorithm that accepts a stream of integers and retrieves the product of the last k integers of the stream.

Implement the ProductOfNumbers class:

- `ProductOfNumbers()` Initializes the object with an empty stream.
- `void add(int num)` Appends the integer num to the stream.
- `int getProduct(int k)` Returns the product of the last k numbers in the current list. You can assume that always the current list has at least k numbers.

The test cases are generated so that, at any time, the product of any contiguous sequence of numbers will fit into a single 32-bit integer without overflowing.

---

## Examples

### Example

**Input:**
```
["ProductOfNumbers","add","add","add","add","add","getProduct","getProduct","getProduct","add","getProduct"]
[[],[3],[0],[2],[5],[4],[2],[3],[4],[8],[2]]
```

**Output:**
```
[null,null,null,null,null,null,20,40,0,null,32]
```

**Explanation:**
```
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

---

## Constraints

- `0 <= num <= 100`
- `1 <= k <= 4 * 10^4`
- At most `4 * 10^4` calls will be made to `add` and `getProduct`.
- The product of the stream at any point in time will fit in a 32-bit integer.

---

## Follow up

Can you implement both GetProduct and Add to work in O(1) time complexity instead of O(k) time complexity?

---

## Pattern: Prefix Product with Zero Handling

This problem uses **Prefix Product** array. Handle zeros specially - when 0 is added, reset prefix to [1].

---

## Intuition

The key insight for this problem is using prefix products to answer range product queries in O(1):

### Key Observations

1. **Prefix Product Concept**: Store cumulative products to enable O(1) range queries
   - prefix[i] = product of all numbers from index 0 to i-1
   
2. **Zero Handling Challenge**: A single zero makes the entire product zero
   - Solution: When 0 is encountered, reset prefix array to [1]
   - This effectively "forgets" all numbers before the zero

3. **Product Calculation**: 
   - Product of last k numbers = prefix[last] / prefix[last - k]
   - This is O(1) using division

4. **Crossing Zero Boundary**: If the range crosses a zero, the product is 0
   - Detect by checking if k >= len(prefix)

### Algorithm Overview

1. **Maintain prefix array**: prefix[i] stores product of first i numbers
2. **Add operation**: 
   - If num = 0, reset prefix to [1]
   - Otherwise, append prefix[-1] * num
3. **GetProduct operation**:
   - If k >= len(prefix), return 0 (crosses zero)
   - Otherwise, return prefix[-1] // prefix[-k-1]

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Prefix Product** - Optimal O(1) solution
2. **Naive Array** - O(k) per query (for understanding)
3. **Segment Tree** - For comparison

---

## Approach 1: Prefix Product (Optimal)

### Algorithm Steps

1. Initialize prefix array with [1]
2. For add(num):
   - If num == 0, reset prefix to [1]
   - Else, append prefix[-1] * num
3. For getProduct(k):
   - If k >= len(prefix), return 0
   - Else return prefix[-1] // prefix[-k-1]

### Why It Works

- Prefix products enable O(1) range product queries
- Resetting on zero handles the special case correctly
- Division gives us the product of any range

### Code Implementation

````carousel
```python
class ProductOfNumbers:
    def __init__(self):
        self.prefix = [1]

    def add(self, num: int) -> None:
        if num == 0:
            # Reset prefix when 0 is added
            self.prefix = [1]
        else:
            self.prefix.append(self.prefix[-1] * num)

    def getProduct(self, k: int) -> int:
        # If k >= len(prefix), we crossed a zero
        if k >= len(self.prefix):
            return 0
        return self.prefix[-1] // self.prefix[-1 - k]
```

<!-- slide -->
```cpp
class ProductOfNumbers {
private:
    vector<int> prefix;
    
public:
    ProductOfNumbers() {
        prefix.push_back(1);
    }
    
    void add(int num) {
        if (num == 0) {
            prefix.clear();
            prefix.push_back(1);
        } else {
            prefix.push_back(prefix.back() * num);
        }
    }
    
    int getProduct(int k) {
        if (k >= prefix.size()) {
            return 0;
        }
        return prefix.back() / prefix[prefix.size() - 1 - k];
    }
};
```

<!-- slide -->
```java
class ProductOfNumbers {
    private List<Integer> prefix;
    
    public ProductOfNumbers() {
        prefix = new ArrayList<>();
        prefix.add(1);
    }
    
    public void add(int num) {
        if (num == 0) {
            prefix.clear();
            prefix.add(1);
        } else {
            prefix.add(prefix.get(prefix.size() - 1) * num);
        }
    }
    
    public int getProduct(int k) {
        if (k >= prefix.size()) {
            return 0;
        }
        return prefix.get(prefix.size() - 1) / prefix.get(prefix.size() - 1 - k);
    }
}
```

<!-- slide -->
```javascript
class ProductOfNumbers {
    constructor() {
        this.prefix = [1];
    }
    
    add(num) {
        if (num === 0) {
            this.prefix = [1];
        } else {
            this.prefix.push(this.prefix[this.prefix.length - 1] * num);
        }
    }
    
    getProduct(k) {
        if (k >= this.prefix.length) {
            return 0;
        }
        return Math.floor(this.prefix[this.prefix.length - 1] / 
                         this.prefix[this.prefix.length - 1 - k]);
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) for both add and getProduct |
| **Space** | O(n) where n is number of elements added |

---

## Approach 2: Naive Array (For Understanding)

### Algorithm Steps

1. Store all numbers in an array
2. For getProduct(k), multiply last k numbers

### Why It Works

Simple approach, but O(k) per query. Used for understanding the problem.

### Code Implementation

````carousel
```python
class ProductOfNumbers:
    def __init__(self):
        self.nums = []

    def add(self, num: int) -> None:
        self.nums.append(num)

    def getProduct(self, k: int) -> int:
        product = 1
        for i in range(len(self.nums) - k, len(self.nums)):
            product *= self.nums[i]
        return product
```

<!-- slide -->
```cpp
class ProductOfNumbers {
private:
    vector<int> nums;
    
public:
    void add(int num) {
        nums.push_back(num);
    }
    
    int getProduct(int k) {
        int product = 1;
        for (int i = nums.size() - k; i < nums.size(); i++) {
            product *= nums[i];
        }
        return product;
    }
};
```

<!-- slide -->
```java
class ProductOfNumbers {
    private List<Integer> nums;
    
    public ProductOfNumbers() {
        nums = new ArrayList<>();
    }
    
    public void add(int num) {
        nums.add(num);
    }
    
    public int getProduct(int k) {
        int product = 1;
        for (int i = nums.size() - k; i < nums.size(); i++) {
            product *= nums.get(i);
        }
        return product;
    }
}
```

<!-- slide -->
```javascript
class ProductOfNumbers {
    constructor() {
        this.nums = [];
    }
    
    add(num) {
        this.nums.push(num);
    }
    
    getProduct(k) {
        let product = 1;
        for (let i = this.nums.length - k; i < this.nums.length; i++) {
            product *= this.nums[i];
        }
        return product;
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(k) for getProduct, O(1) for add |
| **Space** | O(n) |

---

## Approach 3: Segment Tree

### Algorithm Steps

1. Build a segment tree for range product queries
2. Add updates modify leaf nodes
3. Query gets product of last k elements

### Why It Works

Segment trees support point updates and range queries in O(log n). More complex but useful for more general problems.

### Code Implementation

````carousel
```python
class ProductOfNumbers:
    def __init__(self):
        self.size = 40000
        self.tree = [1] * (2 * self.size)
        self.pos = 0
    
    def add(self, num: int) -> None:
        idx = self.pos + self.size
        self.tree[idx] = num if num != 0 else 1
        self.pos += 1
        
        # Update tree
        idx //= 2
        while idx:
            self.tree[idx] = self.tree[2*idx] * self.tree[2*idx+1]
            idx //= 2
    
    def getProduct(self, k: int) -> int:
        if k > self.pos:
            return 0
        
        # Check if zero in range
        left = self.pos - k + self.size
        right = self.pos - 1 + self.size
        
        for i in range(left, right + 1):
            if self.tree[i] == 0:
                return 0
        
        # Calculate product
        left += self.size
        right += self.size
        result = 1
        
        while left <= right:
            if left % 2 == 1:
                result *= self.tree[left]
                left += 1
            if right % 2 == 0:
                result *= self.tree[right]
                right -= 1
            left //= 2
            right //= 2
        
        return result
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) for add and getProduct |
| **Space** | O(n) |

---

## Comparison of Approaches

| Aspect | Prefix Product | Naive Array | Segment Tree |
|--------|----------------|-------------|--------------|
| **Add Time** | O(1) | O(1) | O(log n) |
| **GetProduct Time** | O(1) | O(k) | O(log n) |
| **Space** | O(n) | O(n) | O(n) |
| **Implementation** | Simple | Simple | Complex |

**Best Approach:** Use Approach 1 (Prefix Product) for optimal O(1) operations.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Google
- **Difficulty**: Medium
- **Concepts Tested**: Prefix products, Data stream handling, Edge cases

### Learning Outcomes

1. **Prefix Product Pattern**: Learn to use prefix for O(1) range queries
2. **Zero Handling**: Special case handling in data streams
3. **Design Problems**: Class design for streaming data

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Product of Array Except Self | [Link](https://leetcode.com/problems/product-of-array-except-self/) | Similar prefix product |
| Subarray Product Less Than K | [Link](https://leetcode.com/problems/subarray-product-less-than-k/) | Sliding window product |
| Number of Subarrays with Bounded Maximum | [Link](https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum/) | Stream processing |

### Pattern Reference

For more detailed explanations, see:
- **[Sliding Window Variable Size](/patterns/sliding-window-variable-size-condition-based)**

---

## Video Tutorial Links

1. **[NeetCode - Product of the Last K Numbers](https://www.youtube.com/watch?v=3aVyObgWg_4)** - Clear explanation
2. **[Prefix Sum/Product Pattern](https://www.youtube.com/watch?v=ub82Xb1C8os)** - Understanding prefix techniques

---

## Follow-up Questions

### Q1: How would you handle very large numbers that might overflow?

**Answer:** Use Python's arbitrary precision integers (built-in), or in other languages use big integer libraries. For 32-bit constraints as given, use long long in C++ or check for overflow.

---

### Q2: What if we needed to get the product of any arbitrary range, not just the last k?

**Answer:** The same prefix product approach works. Product of range [i, j] = prefix[j+1] / prefix[i]. Just need to track indices carefully.

---

### Q3: How would you modify to support deletion of the last element?

**Answer:** Store the entire prefix array and maintain a pointer. On deletion, decrement the pointer (don't actually delete). Or store all prefixes and use index-based queries.

---

### Q4: What if zeros are very frequent?

**Answer:** The current approach handles this well - resetting the prefix array on zero means we don't store large products of zeros. Time complexity remains O(1).

---

## Common Pitfalls

### 1. Zero Handling
**Issue**: When 0 is added, reset prefix to [1] because any product including 0 is 0.

**Solution**: The code correctly resets prefix on zero.

### 2. GetProduct Check
**Issue**: If k >= len(prefix), return 0 (crosses a zero boundary).

**Solution**: Check length before division to avoid wrong results.

### 3. Division
**Issue**: Use // for integer division, not /.

**Solution**: Integer division ensures exact results.

---

## Summary

The **Product of the Last K Numbers** problem demonstrates the power of prefix products:

- **Prefix Pattern**: Enables O(1) range product queries
- **Zero Handling**: Key challenge - reset on zero
- **Efficient Design**: Both operations are O(1)

Key takeaways:
1. Maintain prefix products for O(1) queries
2. Handle zeros specially - reset prefix array
3. Product of last k = prefix[last] / prefix[last-k]
4. Check for zero-crossing before division

This problem is excellent for learning prefix patterns and handling edge cases in streaming data.

### Pattern Summary

This problem exemplifies the **Prefix Product** pattern, characterized by:
- Storing cumulative products
- O(1) range queries using division
- Special handling of zeros

---

## Additional Resources

- [LeetCode 1352 - Product of the Last K Numbers](https://leetcode.com/problems/product-of-the-last-k-numbers/) - Official problem page
- [Prefix Sum - GeeksforGeeks](https://www.geeksforgeeks.org/prefix-sum-technique/) - Prefix technique basics
- [Pattern: Sliding Window](/patterns/sliding-window-variable-size-condition-based) - Related pattern
