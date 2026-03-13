# Add To Array Form Of Integer

## Problem Description

The array-form of an integer `num` is an array representing its digits in left to right order.

For example, for `num = 1321`, the array form is `[1,3,2,1]`.

Given `num`, the array-form of an integer, and an integer `k`, return the array-form of the integer `num + k`.

---

## Examples

**Example 1:**

**Input:**
```
num = [1,2,0,0], k = 34
```

**Output:**
```
[1,2,3,4]
```

**Explanation:** 1200 + 34 = 1234

**Example 2:**

**Input:**
```
num = [2,7,4], k = 181
```

**Output:**
```
[4,5,5]
```

**Explanation:** 274 + 181 = 455

**Example 3:**

**Input:**
```
num = [2,1,5], k = 806
```

**Output:**
```
[1,0,2,1]
```

**Explanation:** 215 + 806 = 1021

---

## Constraints

- `1 <= num.length <= 10^4`
- `0 <= num[i] <= 9`
- `num` does not contain any leading zeros except for the zero itself.
- `1 <= k <= 10^4`

---

## Pattern:

This problem follows the **Digit-by-Digit Addition** pattern, also known as the **Carry Propagation** pattern. It simulates how we perform manual addition on paper.

### Core Concept

- Process digits from **least significant** (rightmost) to **most significant** (leftmost)
- Handle **carry** between adjacent digit positions
- Handle edge cases where result has **more digits** than input

### When to Use This Pattern

This pattern is applicable when:
1. Adding two numbers represented as digit arrays
2. Adding a number to an array-form integer
3. Problems requiring carry/borrow propagation
4. Any simulation of elementary arithmetic operations

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Two Pointers | Both pointers start from the end |
| Simulation | Mimics real-world manual algorithm |
| In-place Modification | Can modify input without extra space |

---

## Intuition

This problem simulates how we add numbers by hand. We start from the rightmost digit (least significant) and work left, handling carries.

### Key Insights

1. **Right-to-Left Processing**: We process digits from right to left, just like manual addition.

2. **Carry Handling**: When the sum exceeds 9, we carry over the tens digit to the next position.

3. **Remaining K**: After processing all digits, if there's still a carry from k, we need to add more digits.

4. **In-Place Modification**: We can modify the array in place from the end, which is efficient.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **In-Place Addition (Optimal)** - O(n) time, O(1) space
2. **Convert to Integer** - Simple but with overflow risk
3. **Using Python's Big Integers** - Very simple but "cheats"

---

## Approach 1: In-Place Addition (Optimal)

This approach modifies the array in place from the end, simulating manual addition.

### Algorithm Steps

1. Start from the last index of the array.
2. For each position:
   - Add current digit to k using divmod: `k, digit = divmod(k + digit, 10)`
   - Update the array with the new digit
3. Continue until k becomes 0.
4. If k is still non-zero after processing all digits, prepend remaining digits.
5. Return the array.

### Why It Works

We process the addition digit by digit from right to left. The `divmod` operation gives us both the new digit (k + current) % 10 and the carry (k + current) // 10. This is exactly how manual addition works.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def addToArrayForm(self, num: List[int], k: int) -> List[int]:
        """
        Add k to number represented as array.
        
        Args:
            num: Array of digits representing the number
            k: Integer to add
            
        Returns:
            Array of digits representing the sum
        """
        # Process from right to left
        for i in range(len(num) - 1, -1, -1):
            if k == 0:
                break
            
            # Add current digit to k, get new digit and carry
            k, num[i] = divmod(k + num[i], 10)
        
        # If k still has remaining digits, prepend them
        while k > 0:
            k, digit = divmod(k, 10)
            num.insert(0, digit)
        
        return num
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> addToArrayForm(vector<int>& num, int k) {
        // Process from right to left
        for (int i = num.size() - 1; i >= 0; i--) {
            if (k == 0) break;
            
            int sum = k + num[i];
            num[i] = sum % 10;
            k = sum / 10;
        }
        
        // If k still has remaining digits, prepend them
        while (k > 0) {
            num.insert(num.begin(), k % 10);
            k /= 10;
        }
        
        return num;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<Integer> addToArrayForm(int[] num, int k) {
        // Convert to ArrayList for easy insertion
        List<Integer> result = new ArrayList<>();
        for (int digit : num) {
            result.add(digit);
        }
        
        // Process from right to left
        for (int i = result.size() - 1; i >= 0; i--) {
            if (k == 0) break;
            
            int sum = k + result.get(i);
            result.set(i, sum % 10);
            k = sum / 10;
        }
        
        // If k still has remaining digits, prepend them
        while (k > 0) {
            result.add(0, k % 10);
            k /= 10;
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} num
 * @param {number} k
 * @return {number[]}
 */
var addToArrayForm = function(num, k) {
    // Process from right to left
    for (let i = num.length - 1; i >= 0; i--) {
        if (k === 0) break;
        
        const sum = k + num[i];
        num[i] = sum % 10;
        k = Math.floor(sum / 10);
    }
    
    // If k still has remaining digits, prepend them
    while (k > 0) {
        num.unshift(k % 10);
        k = Math.floor(k / 10);
    }
    
    return num;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + log(k)) - process each digit once, plus remaining k digits |
| **Space** | O(1) for in-place, or O(log(k)) if new digits need to be added |

---

## Approach 2: Using String Conversion

This approach converts the array to an integer, adds k, then converts back. Note: This can overflow for large numbers in some languages.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def addToArrayForm(self, num: List[int], k: int) -> List[int]:
        # Convert array to integer (careful with large numbers)
        # For Python, integers have arbitrary precision
        
        # Method 1: Join and convert
        int_num = int(''.join(map(str, num)))
        total = int_num + k
        
        # Convert back to array
        return [int(d) for d in str(total)]
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <sstream>
using namespace std;

class Solution {
public:
    vector<int> addToArrayForm(vector<int>& num, int k) {
        // Note: This approach may overflow for large numbers
        // Only works when num length is small
        
        // Convert to string
        string s;
        for (int d : num) s += to_string(d);
        
        // Convert to integer
        long long n = stoll(s);
        n += k;
        
        // Convert back to vector
        string result = to_string(n);
        vector<int> ans;
        for (char c : result) {
            ans.push_back(c - '0');
        }
        
        return ans;
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<Integer> addToArrayForm(int[] num, int k) {
        // Note: This approach may overflow for large numbers
        // Only works when num length is small
        
        // Convert array to string
        StringBuilder sb = new StringBuilder();
        for (int d : num) sb.append(d);
        
        // Parse and add
        long n = Long.parseLong(sb.toString());
        n += k;
        
        // Convert back to list
        String result = Long.toString(n);
        List<Integer> ans = new ArrayList<>();
        for (char c : result.toCharArray()) {
            ans.add(c - '0');
        }
        
        return ans;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} num
 * @param {number} k
 * @return {number[]}
 */
var addToArrayForm = function(num, k) {
    // Convert to string, add, convert back
    const numStr = num.join('');
    const total = BigInt(numStr) + BigInt(k);
    
    return total.toString().split('').map(Number);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) for conversions |
| **Space** | O(n) for string/number storage |

---

## Approach 3: Mathematical Addition

This approach uses pure mathematical operations without string conversion.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def addToArrayForm(self, num: List[int], k: int) -> List[int]:
        # Mathematical approach - traverse from end
        result = []
        carry = k
        
        # Process from right to left
        for i in range(len(num) - 1, -1, -1):
            total = num[i] + carry
            result.append(total % 10)
            carry = total // 10
        
        # Handle remaining carry
        while carry > 0:
            result.append(carry % 10)
            carry //= 10
        
        # Reverse to get correct order
        return result[::-1]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> addToArrayForm(vector<int>& num, int k) {
        vector<int> result;
        int carry = k;
        
        // Process from right to left
        for (int i = num.size() - 1; i >= 0; i--) {
            int total = num[i] + carry;
            result.push_back(total % 10);
            carry = total / 10;
        }
        
        // Handle remaining carry
        while (carry > 0) {
            result.push_back(carry % 10);
            carry /= 10;
        }
        
        // Reverse to get correct order
        reverse(result.begin(), result.end());
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<Integer> addToArrayForm(int[] num, int k) {
        List<Integer> result = new ArrayList<>();
        int carry = k;
        
        // Process from right to left
        for (int i = num.length - 1; i >= 0; i--) {
            int total = num[i] + carry;
            result.add(total % 10);
            carry = total / 10;
        }
        
        // Handle remaining carry
        while (carry > 0) {
            result.add(carry % 10);
            carry /= 10;
        }
        
        // Reverse to get correct order
        Collections.reverse(result);
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} num
 * @param {number} k
 * @return {number[]}
 */
var addToArrayForm = function(num, k) {
    const result = [];
    let carry = k;
    
    // Process from right to left
    for (let i = num.length - 1; i >= 0; i--) {
        const total = num[i] + carry;
        result.push(total % 10);
        carry = Math.floor(total / 10);
    }
    
    // Handle remaining carry
    while (carry > 0) {
        result.push(carry % 10);
        carry = Math.floor(carry / 10);
    }
    
    // Reverse to get correct order
    return result.reverse();
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + log(k)) |
| **Space** | O(n) for result array |

---

## Comparison of Approaches

| Aspect | In-Place | String Conversion | Mathematical |
|--------|----------|-------------------|--------------|
| **Time Complexity** | O(n + log(k)) | O(n) | O(n + log(k)) |
| **Space Complexity** | O(1)* | O(n) | O(n) |
| **Overflow Risk** | No | Yes | No |
| **Modifies Input** | Yes | No | No |
| **Readability** | Good | Best | Good |

*Note: O(1) when no new digits are added, O(log(k)) otherwise.

---

## Why This Problem is Important

### Interview Relevance
- **Frequency**: Frequently asked in technical interviews
- **Companies**: Amazon, Apple, Microsoft
- **Difficulty**: Easy to Medium
- **Concepts**: Array manipulation, carry handling, simulation

### Key Learnings
1. **Simulation**: Simulating manual addition algorithm
2. **Carry propagation**: Understanding how carries work
3. **Edge cases**: Handling when result has more digits than input

---

## Related Problems

### Same Pattern (Array/Number Manipulation)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Add to Array Form | [Link](https://leetcode.com/problems/add-to-array-form-of-integer/) | Easy | This problem |
| Plus One | [Link](https://leetcode.com/problems/plus-one/) | Easy | Add 1 to array |
| Multiply Strings | [Link](https://leetcode.com/problems/multiply-strings/) | Medium | String multiplication |
| Add Binary | [Link](https://leetcode.com/problems/add-binary/) | Easy | Binary addition |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Big Integer Addition | [Link](https://practice.geeksforgeeks.org/problems/addition-of-two-numbers-whose-are-stored-in-linked-list/1) | Medium | Linked list addition |
| Sum of Arrays | [Link](https://leetcode.com/problems/sum-of-two-integers/) | Medium | Bit manipulation |

---

## Video Tutorial Links

### Array and Number Operations

1. **[Add to Array Form - NeetCode](https://www.youtube.com/watch?v=JaV6L16H8QQ)** - Clear explanation with visual examples
2. **[LeetCode 989 - Add to Array Form](https://www.youtube.com/watch?v=6J0I1y1JzO8)** - Detailed walkthrough
3. **[Plus One Explained](https://www.youtube.com/watch?v=KEqrQ9f1Hbc)** - Related problem

### Related Concepts

- **[Carry Propagation](https://www.youtube.com/watch?v=7K1K3N7l1x4)** - Understanding carries
- **[Big Number Operations](https://www.youtube.com/watch?v=wmm7CQqt5wI)** - Handling large numbers

---

## Follow-up Questions

### Q1: What if k can be extremely large (like 10^1000)?

**Answer:** The in-place approach handles this naturally by processing digits one at a time. Just ensure you use appropriate data types (BigInt in JavaScript, arbitrary precision in Python).

---

### Q2: How would you modify to work with a linked list instead of array?

**Answer:** Same algorithm but traverse the linked list from end. This requires either reversing the list first or using a stack to simulate the reverse traversal.

---

### Q3: What if you need to add two array-form numbers?

**Answer:** Use the same algorithm but with two pointers, one for each array. Process from right to left, adding both digits plus any carry.

---

### Q4: Can you do this without converting the entire array?

**Answer:** Yes, the in-place approach does exactly this. It processes from the end and only modifies digits as needed.

---

### Q5: How would you handle negative numbers?

**Answer:** For negative numbers, you would need to handle subtraction instead of addition. The algorithm would be more complex, requiring borrowing instead of carrying.

---

### Q6: What is the maximum size of the result?

**Answer:** The result can have at most max(len(num), log10(k) + 1) + 1 digits (the +1 is for cases like 999 + 1 = 1000).

---

### Q7: What edge cases should you test?

**Answer:**
- k = 0 (no change to num)
- num = [0], k = 1 (single digit result)
- num = [9, 9, 9], k = 1 (carry creates new digit)
- num = [1], k = 9999 (large k)
- num = [5], k = 5 (same digit)
- All 9s in num with carry

---

### Q8: How does this compare to adding 1 (Plus One problem)?

**Answer:** This is a generalization of Plus One. Plus One is just this problem with k = 1. The algorithm is the same.

---

### Q9: Why is the solution more efficient than converting to integer first?

**Answer:** Converting to integer and back takes O(n) time for the conversions. The in-place approach only does O(n) total work and can early-exit if k becomes 0 early.

---

### Q10: Can this be done in a single pass without any extra space?

**Answer:** The in-place approach is already very space-efficient. If the result fits in the existing array, no extra space is needed. Only when the result has more digits do we need additional space.

---

## Common Pitfalls

### 1. Not Handling Remaining K
**Issue:** Returning without processing remaining carry after the loop.

**Solution:** Always check if k > 0 after processing all digits and prepend remaining digits.

### 2. Off-by-One in Loop
**Issue:** Using wrong range in for loop.

**Solution:** Use `for i in range(len(num) - 1, -1, -1):` to iterate from last index to 0.

### 3. Forgetting to Break Early
**Issue:** Continuing loop even when k becomes 0.

**Solution:** Add `if k == 0: break` to stop processing when there's nothing left to add.

### 4. Wrong Insert Position
**Issue:** Inserting at end instead of beginning.

**Solution:** Use `insert(0, digit)` or build result in reverse and flip at the end.

---

## Summary

The **Add to Array Form of Integer** problem demonstrates **simulation of manual addition**:

- **In-place processing**: Modify array from right to left
- **Carry handling**: Use divmod to extract digit and carry
- **Edge cases**: When result has more digits than input
- **Efficiency**: O(n + log(k)) time, O(1) space

Key insights:
1. Process from least significant digit (right end)
2. Use divmod to handle carries elegantly
3. Handle remaining k after all digits processed
4. Works for arbitrarily large numbers

This pattern extends to:
- Plus One (k = 1)
- Adding two array-form numbers
- Binary string addition
- Any digit-by-digit arithmetic operation
