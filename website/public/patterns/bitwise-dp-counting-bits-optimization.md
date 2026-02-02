# Bitwise DP - Counting Bits Optimization

## Overview

The **Bitwise DP pattern for counting bits optimization** is a fundamental technique in competitive programming and technical interviews. This pattern uses dynamic programming to efficiently compute the number of set bits (Hamming weight) for all integers from 0 to n, leveraging the mathematical relationship between binary representations of consecutive numbers.

This pattern is ideal for problems requiring bit counts across a range, such as generating arrays of bit counts or computing sum of Hamming weights. By using recurrence relations based on bit shifting and parity, it achieves **O(n) time complexity** with **O(n) space complexity**.

## Problem Context

This pattern solves the classic **LeetCode 338 - Counting Bits** problem:

> Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (0 <= i <= n), `ans[i]` is the number of 1's in the binary representation of `i`.

This is an **Easy difficulty** problem that frequently appears in interviews at top tech companies including Google, Amazon, Meta, and Apple.

---

## Core Intuition

The key insight for this pattern is recognizing the **relationship between consecutive numbers** in binary representation:

### Key Observation

For any integer `i`:
- **If i is even**: The binary representation of `i` is the same as `i // 2` with a 0 appended at the end (right shift)
- **If i is odd**: The binary representation of `i` is the same as `i // 2` with a 1 appended at the end

This leads to the fundamental recurrence relation:
- **Even number**: `countBits(i) = countBits(i // 2)` (no new set bit added)
- **Odd number**: `countBits(i) = countBits(i // 2) + 1` (one new set bit added)

### The "Aha!" Moment

```
i = 6 (binary: 110)
i // 2 = 3 (binary: 11)
ans[3] = 2
i % 2 = 0
ans[6] = ans[3] + 0 = 2 ✓

i = 7 (binary: 111)
i // 2 = 3 (binary: 11)
ans[3] = 2
i % 2 = 1
ans[7] = ans[3] + 1 = 3 ✓
```

### Why This Works

When we right-shift a number by 1:
- We're essentially removing the least significant bit (LSB)
- If the LSB was 0 (even), we remove a 0 → count stays the same
- If the LSB was 1 (odd), we remove a 1 → count decreases by 1

Since `i // 2` is always computed before `i`, we can use dynamic programming:
- `ans[i // 2]` is already computed when we're calculating `ans[i]`
- We just need to add `(i % 2)` to account for the LSB

---

## Key Concepts

### Bit Manipulation Fundamentals

| Operation | Description | Example |
|-----------|-------------|---------|
| `i >> 1` | Right shift by 1 (equivalent to `i // 2`) | `6 >> 1 = 3` |
| `i & 1` | Check LSB (equivalent to `i % 2`) | `7 & 1 = 1` |
| `i & (i - 1)` | Removes the lowest set bit | `7 & 6 = 6` |
| `i & -i` | Isolates the lowest set bit | `6 & -6 = 2` |
| `i.bit_length()` | Number of bits needed to represent `i` | `5.bit_length() = 3` |

### DP Recurrence Relations

This pattern offers multiple equivalent formulations:

1. **LSB-based**: `dp[i] = dp[i >> 1] + (i & 1)`
2. **Brian Kernighan's**: `dp[i] = dp[i & (i - 1)] + 1`
3. **Lowest Set Bit**: `dp[i] = dp[i - (i & -i)] + 1`
4. **MSB-based**: `dp[i] = dp[i - msb] + 1` where `msb` is the highest power of 2 ≤ i

### Base Case

- `dp[0] = 0`, as 0 has no set bits (binary representation is just "0")

---

## Solution Approaches

### Approach 1: Dynamic Programming with i // 2 (Optimal) ✅ Recommended

This is the optimal solution that achieves O(n) time complexity by leveraging the relationship between `i` and `i // 2`.

#### Algorithm

1. Initialize an array `ans` of size `n + 1` with all zeros
2. For each integer `i` from 1 to n:
   - Compute `ans[i] = ans[i // 2] + (i % 2)`
   - This uses the fact that `i // 2` is always less than `i` (already computed)
3. Return the array

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def countBits(self, n: int) -> List[int]:
        """
        Count the number of 1's in the binary representation for each number from 0 to n.
        
        Uses dynamic programming where:
        - ans[i] = ans[i // 2] + (i % 2)
        - ans[i // 2] is already computed since i // 2 < i
        
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        ans = [0] * (n + 1)  # ans[0] = 0 by default
        
        for i in range(1, n + 1):
            ans[i] = ans[i // 2] + (i % 2)
        
        return ans
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> ans(n + 1, 0);
        
        for (int i = 1; i <= n; i++) {
            ans[i] = ans[i / 2] + (i % 2);
        }
        
        return ans;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[] countBits(int n) {
        int[] ans = new int[n + 1];
        
        for (int i = 1; i <= n; i++) {
            ans[i] = ans[i / 2] + (i % 2);
        }
        
        return ans;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} n - non-negative integer
 * @return {number[]}
 */
var countBits = function(n) {
    const ans = new Array(n + 1).fill(0);
    
    for (let i = 1; i <= n; i++) {
        ans[i] = ans[Math.floor(i / 2)] + (i % 2);
    }
    
    return ans;
};
```
````

#### Step-by-Step Example for n = 5

```
i = 1: ans[1] = ans[0] + 1 = 0 + 1 = 1
i = 2: ans[2] = ans[1] + 0 = 1 + 0 = 1
i = 3: ans[3] = ans[1] + 1 = 1 + 1 = 2
i = 4: ans[4] = ans[2] + 0 = 1 + 0 = 1
i = 5: ans[5] = ans[2] + 1 = 1 + 1 = 2

Result: [0, 1, 1, 2, 1, 2] ✓
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(n) - Single pass through 1 to n |
| **Space** | O(n) - Result array of size n + 1 |

---

### Approach 2: Dynamic Programming with Lowest Set Bit (i & (i-1))

This approach uses Brian Kernighan's insight that `i & (i-1)` removes the lowest set bit from `i`.

#### Algorithm

1. Initialize an array `ans` of size `n + 1` with all zeros
2. For each integer `i` from 1 to n:
   - Compute `ans[i] = ans[i & (i - 1)] + 1`
   - This uses the fact that `i & (i - 1)` is always less than `i`
3. Return the array

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def countBits(self, n: int) -> List[int]:
        """
        Count bits using the relationship:
        bits(i) = bits(i & (i-1)) + 1
        
        This works because i & (i-1) removes the lowest set bit.
        
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        ans = [0] * (n + 1)
        
        for i in range(1, n + 1):
            # i & (i-1) removes the lowest set bit
            ans[i] = ans[i & (i - 1)] + 1
        
        return ans
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> ans(n + 1, 0);
        
        for (int i = 1; i <= n; i++) {
            ans[i] = ans[i & (i - 1)] + 1;
        }
        
        return ans;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] countBits(int n) {
        int[] ans = new int[n + 1];
        
        for (int i = 1; i <= n; i++) {
            ans[i] = ans[i & (i - 1)] + 1;
        }
        
        return ans;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} n - non-negative integer
 * @return {number[]}
 */
var countBits = function(n) {
    const ans = new Array(n + 1).fill(0);
    
    for (let i = 1; i <= n; i++) {
        ans[i] = ans[i & (i - 1)] + 1;
    }
    
    return ans;
};
```
````

#### How It Works

```
i = 7 (binary: 111)
i & (i-1) = 7 & 6 = 6 (binary: 110)
ans[6] = 2
ans[7] = ans[6] + 1 = 2 + 1 = 3 ✓

i = 5 (binary: 101)
i & (i-1) = 5 & 4 = 4 (binary: 100)
ans[4] = 1
ans[5] = ans[4] + 1 = 1 + 1 = 2 ✓
```

---

### Approach 3: Dynamic Programming with Lowest One Bit (i & -i)

This approach isolates the lowest set bit using `i & -i` and adds 1 to the count of `i - lowest_bit`.

#### Algorithm

1. Initialize an array `ans` of size `n + 1` with all zeros
2. For each integer `i` from 1 to n:
   - Compute `lowest_bit = i & -i` (isolates the lowest set bit)
   - Compute `ans[i] = ans[i - lowest_bit] + 1`
3. Return the array

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def countBits(self, n: int) -> List[int]:
        """
        Count bits using the relationship:
        bits(i) = bits(i - (i & -i)) + 1
        
        i & -i isolates the lowest set bit (works due to two's complement).
        
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        ans = [0] * (n + 1)
        
        for i in range(1, n + 1):
            # i & -i gives the lowest set bit value
            lowest_bit = i & -i
            ans[i] = ans[i - lowest_bit] + 1
        
        return ans
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> ans(n + 1, 0);
        
        for (int i = 1; i <= n; i++) {
            int lowest_bit = i & -i;
            ans[i] = ans[i - lowest_bit] + 1;
        }
        
        return ans;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] countBits(int n) {
        int[] ans = new int[n + 1];
        
        for (int i = 1; i <= n; i++) {
            int lowestBit = i & -i;
            ans[i] = ans[i - lowestBit] + 1;
        }
        
        return ans;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} n - non-negative integer
 * @return {number[]}
 */
var countBits = function(n) {
    const ans = new Array(n + 1).fill(0);
    
    for (let i = 1; i <= n; i++) {
        const lowestBit = i & -i;
        ans[i] = ans[i - lowestBit] + 1;
    }
    
    return ans;
};
```
````

#### How It Works

```
i = 6 (binary: 110)
lowest_bit = 6 & -6 = 2 (binary: 010)
i - lowest_bit = 6 - 2 = 4 (binary: 100)
ans[4] = 1
ans[6] = ans[4] + 1 = 1 + 1 = 2 ✓

i = 7 (binary: 111)
lowest_bit = 7 & -7 = 1 (binary: 001)
i - lowest_bit = 7 - 1 = 6 (binary: 110)
ans[6] = 2
ans[7] = ans[6] + 1 = 2 + 1 = 3 ✓
```

---

### Approach 4: Dynamic Programming with Most Significant Bit (MSB)

This approach uses the highest power of 2 (most significant bit) to compute the bit count.

#### Algorithm

1. Initialize an array `ans` of size `n + 1` with all zeros
2. Track the current highest power of 2 (msb)
3. For each integer `i` from 1 to n:
   - Update msb when we reach a new power of 2
   - Compute `ans[i] = ans[i - msb] + 1`
4. Return the array

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def countBits(self, n: int) -> List[int]:
        """
        Count bits using the Most Significant Bit (MSB) approach.
        
        The relationship is:
        bits(i) = 1 + bits(i - highest_power_of_2)
        
        Where highest_power_of_2 is the largest power of 2 <= i.
        
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        ans = [0] * (n + 1)
        
        # Track the current highest power of 2
        # msb will be the highest power of 2 <= i
        msb = 1
        
        for i in range(1, n + 1):
            # Check if we've entered a new power of 2 range
            # When i is exactly a power of 2 (i == msb * 2), update msb
            if i == msb * 2:
                msb *= 2
            
            # ans[i] = 1 (for the MSB) + ans[i - msb] (for the remainder)
            ans[i] = ans[i - msb] + 1
        
        return ans
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> ans(n + 1, 0);
        int msb = 1;
        
        for (int i = 1; i <= n; i++) {
            if (i == msb * 2) {
                msb *= 2;
            }
            ans[i] = ans[i - msb] + 1;
        }
        
        return ans;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[] countBits(int n) {
        int[] ans = new int[n + 1];
        int msb = 1;
        
        for (int i = 1; i <= n; i++) {
            if (i == msb * 2) {
                msb *= 2;
            }
            ans[i] = ans[i - msb] + 1;
        }
        
        return ans;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} n - non-negative integer
 * @return {number[]}
 */
var countBits = function(n) {
    const ans = new Array(n + 1).fill(0);
    let msb = 1;
    
    for (let i = 1; i <= n; i++) {
        if (i === msb * 2) {
            msb *= 2;
        }
        ans[i] = ans[i - msb] + 1;
    }
    
    return ans;
};
```
````

#### How It Works

```
i = 1: msb = 1, ans[1] = ans[0] + 1 = 0 + 1 = 1
i = 2: msb = 2, ans[2] = ans[0] + 1 = 0 + 1 = 1
i = 3: msb = 2, ans[3] = ans[1] + 1 = 1 + 1 = 2
i = 4: msb = 4, ans[4] = ans[0] + 1 = 0 + 1 = 1
i = 5: msb = 4, ans[5] = ans[1] + 1 = 1 + 1 = 2
i = 6: msb = 4, ans[6] = ans[2] + 1 = 1 + 1 = 2
i = 7: msb = 4, ans[7] = ans[3] + 1 = 2 + 1 = 3
i = 8: msb = 8, ans[8] = ans[0] + 1 = 0 + 1 = 1

Result: [0, 1, 1, 2, 1, 2, 2, 3, 1] ✓
```

#### Why This Works

Every number `i` can be written as:
```
i = MSB(i) + remainder
```

Where `MSB(i)` is the highest power of 2 less than or equal to `i`, and `remainder = i - MSB(i)`.

The number of set bits in `i` is:
```
bits(i) = 1 (for the MSB) + bits(remainder)
```

---

### Approach 5: Built-in Functions

Each language provides optimized built-in functions for counting set bits.

#### Implementation

````carousel
```python
from typing import List

class Solution:
    def countBits(self, n: int) -> List[int]:
        """
        Count bits using Python's built-in bit_count() method.
        
        This approach is the most concise and leverages optimized C code.
        
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        return [i.bit_count() for i in range(n + 1)]
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> ans(n + 1, 0);
        
        for (int i = 0; i <= n; i++) {
            ans[i] = __builtin_popcount(i);
        }
        
        return ans;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[] countBits(int n) {
        int[] ans = new int[n + 1];
        
        for (int i = 0; i <= n; i++) {
            ans[i] = Integer.bitCount(i);
        }
        
        return ans;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} n - non-negative integer
 * @return {number[]}
 */
var countBits = function(n) {
    const ans = [];
    
    for (let i = 0; i <= n; i++) {
        ans.push(i.toString(2).split('1').length - 1);
    }
    
    return ans;
};
```
````

---

## Visual Binary Table

| Number | Binary | Set Bits | ans[i] |
|--------|--------|----------|--------|
| 0 | 0000 | 0 | 0 |
| 1 | 0001 | 1 | 1 |
| 2 | 0010 | 1 | 1 |
| 3 | 0011 | 2 | 2 |
| 4 | 0100 | 1 | 1 |
| 5 | 0101 | 2 | 2 |
| 6 | 0110 | 2 | 2 |
| 7 | 0111 | 3 | 3 |
| 8 | 1000 | 1 | 1 |
| 9 | 1001 | 2 | 2 |
| 10 | 1010 | 2 | 2 |
| 11 | 1011 | 3 | 3 |
| 12 | 1100 | 2 | 2 |
| 13 | 1101 | 3 | 3 |
| 14 | 1110 | 3 | 3 |
| 15 | 1111 | 4 | 4 |

---

## Complexity Analysis

### Comparison of All Approaches

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|-----------------|------------------|---------------|
| **DP with i // 2** | O(n) | O(n) | ✅ **General case** - Recommended |
| **DP with i & (i-1)** | O(n) | O(n) | When Brian Kernighan's is preferred |
| **DP with i & -i** | O(n) | O(n) | Alternative bit manipulation |
| **Built-in functions** | O(n) | O(n) | Language-specific optimization |
| **DP with MSB** | O(n) | O(n) | Understanding MSB concept |

### Why O(n) is Optimal

**No, we cannot achieve better than O(n) time:**
- We must compute values for all n + 1 numbers
- Even reading each number once takes O(n) time
- Any solution must be Ω(n) (omega of n)

**Space reduction is not possible:**
- The output itself requires O(n) space
- We cannot use less than O(n) space for the result

---

## Template Code

### Generic Python Template

```python
from typing import List

def count_bits_dp(n: int) -> List[int]:
    """
    Count the number of 1's in the binary representation for each number from 0 to n.
    
    Args:
        n: Integer up to which to compute bit counts.
    
    Returns:
        List of integers where ans[i] is the number of 1's in binary representation of i.
    """
    ans = [0] * (n + 1)
    
    for i in range(1, n + 1):
        # Choose one of the following:
        # Option 1: ans[i] = ans[i // 2] + (i % 2)
        # Option 2: ans[i] = ans[i & (i - 1)] + 1
        # Option 3: ans[i] = ans[i - (i & -i)] + 1
        
        ans[i] = ans[i // 2] + (i % 2)  # Recommended
    
    return ans
```

### Generic C++ Template

```cpp
#include <vector>
using namespace std;

vector<int> countBits(int n) {
    vector<int> ans(n + 1, 0);
    
    for (int i = 1; i <= n; i++) {
        // Choose one of the following:
        // Option 1: ans[i] = ans[i / 2] + (i % 2);
        // Option 2: ans[i] = ans[i & (i - 1)] + 1;
        // Option 3: ans[i] = ans[i - (i & -i)] + 1;
        
        ans[i] = ans[i / 2] + (i % 2);  // Recommended
    }
    
    return ans;
}
```

### Generic Java Template

```java
class Solution {
    public int[] countBits(int n) {
        int[] ans = new int[n + 1];
        
        for (int i = 1; i <= n; i++) {
            // Choose one of the following:
            // Option 1: ans[i] = ans[i / 2] + (i % 2);
            // Option 2: ans[i] = ans[i & (i - 1)] + 1;
            // Option 3: ans[i] = ans[i - (i & -i)] + 1;
            
            ans[i] = ans[i / 2] + (i % 2);  // Recommended
        }
        
        return ans;
    }
}
```

### Generic JavaScript Template

```javascript
/**
 * @param {number} n - non-negative integer
 * @return {number[]}
 */
var countBits = function(n) {
    const ans = new Array(n + 1).fill(0);
    
    for (let i = 1; i <= n; i++) {
        // Choose one of the following:
        // Option 1: ans[i] = ans[Math.floor(i / 2)] + (i % 2);
        // Option 2: ans[i] = ans[i & (i - 1)] + 1;
        // Option 3: ans[i] = ans[i - (i & -i)] + 1;
        
        ans[i] = ans[Math.floor(i / 2)] + (i % 2);  // Recommended
    }
    
    return ans;
};
```

---

## Edge Cases and Common Pitfalls

### Edge Cases to Consider

1. **n = 0**
   ```
   Input: n = 0
   Output: [0]
   Explanation: Only number 0, which has 0 set bits.
   ```

2. **n = 1**
   ```
   Input: n = 1
   Output: [0, 1]
   Explanation: 0 -> 0, 1 -> 1 (one set bit).
   ```

3. **Power of 2**
   ```
   Input: n = 8
   Output: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2]
   Explanation: Powers of 2 always have exactly 1 set bit.
   ```

### Common Mistakes to Avoid

1. **Forgetting ans[0]**
   ```python
   # Wrong!
   ans = [0] * n  # Size n instead of n + 1
   
   # Correct!
   ans = [0] * (n + 1)
   ```

2. **Starting from 0**
   ```python
   # Wrong! ans[0] is already 0
   for i in range(0, n + 1):
       ans[i] = ans[i // 2] + (i % 2)
   
   # Correct! Start from 1
   for i in range(1, n + 1):
       ans[i] = ans[i // 2] + (i % 2)
   ```

3. **Using integer division incorrectly**
   ```python
   # Wrong!
   ans[i] = ans[i / 2] + (i % 2)  # / is float division
   
   # Correct!
   ans[i] = ans[i // 2] + (i % 2)  # // is integer division
   ```

---

## Related Problems

### Same Pattern (DP with Bit Manipulation)

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) | 191 | Easy | Count set bits in a single number |
| [Reverse Bits](https://leetcode.com/problems/reverse-bits/) | 190 | Easy | Reverse bits of a 32-bit integer |
| [Power of Two](https://leetcode.com/problems/power-of-two/) | 231 | Easy | Check if number is power of two |
| [Single Number](https://leetcode.com/problems/single-number/) | 136 | Easy | Find unique element using XOR |
| [Single Number II](https://leetcode.com/problems/single-number-ii/) | 137 | Medium | Find unique element with triples |

### Similar Concepts

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Total Hamming Distance](https://leetcode.com/problems/total-hamming-distance/) | 477 | Medium | Sum of Hamming distances between pairs |
| [Hamming Distance](https://leetcode.com/problems/hamming-distance/) | 461 | Easy | Hamming distance between two numbers |
| [Gray Code](https://leetcode.com/problems/gray-code/) | 89 | Medium | Generate Gray code sequence |
| [Missing Number](https://leetcode.com/problems/missing-number/) | 268 | Easy | Find missing number using XOR |
| [Bitwise AND of Numbers Range](https://leetcode.com/problems/bitwise-and-of-numbers-range/) | 201 | Medium | Bitwise AND of range |
| [Binary Watch](https://leetcode.com/problems/binary-watch/) | 401 | Easy | Convert LED count to time |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[Counting Bits - NeetCode](https://www.youtube.com/watch?v=RyBMvRj29_w)**
   - Excellent visual explanation of the DP approach
   - Step-by-step walkthrough
   - Part of popular NeetCode playlist

2. **[Counting Bits - William Lin](https://www.youtube.com/watch?v=ypaEyWciklQ)**
   - Clean and concise explanation
   - Multiple approaches covered
   - Great for interview preparation

3. **[Dynamic Programming + Bit Manipulation](https://www.youtube.com/watch?v=yl2jB8T13aQ)**
   - Deep dive into DP with bit manipulation
   - Visual demonstrations
   - Beginner-friendly

4. **[LeetCode Official Solution](https://www.youtube.com/watch?v=35qD-_kEoUY)**
   - Official solution walkthrough
   - Best practices and edge cases

5. **[Bit Manipulation Masterclass](https://www.youtube.com/watch?v=6TcLqR_4u88)**
   - Comprehensive bit manipulation guide
   - Related problems covered

### Additional Resources

- **[Brian Kernighan's Algorithm](https://www.geeksforgeeks.org/count-set-bits-in-an-integer/)** - GeeksforGeeks explanation
- **[Bitwise Operations](https://en.wikipedia.org/wiki/Bitwise_operation)** - Wikipedia theoretical background
- **[LeetCode Discuss](https://leetcode.com/problems/counting-bits/discuss/)** - Community solutions and tips

---

## Why This Pattern is Important

### Interview Relevance

- **Frequency**: Frequently asked in technical interviews
- **Companies**: Google, Amazon, Meta, Apple, Microsoft, Bloomberg
- **Difficulty**: Easy, but tests understanding of DP and bit manipulation
- **Pattern**: Leads to many related bit manipulation problems

### Learning Outcomes

1. **DP + Bit Manipulation**: Learn to combine dynamic programming with bitwise operations
2. **Pattern Recognition**: Identify relationships between consecutive numbers
3. **Optimization**: Understand why O(n) is optimal for this problem
4. **Multiple Approaches**: See how the same problem can be solved in different ways

### Real-World Applications

- Error detection/correction codes (Hamming codes)
- Cryptography (key generation, hash functions)
- Data compression algorithms
- Network routing and IP addressing
- Graphics and image processing

---

## MSB vs LSB Approaches

| Aspect | LSB-based (i//2) | MSB-based |
|--------|------------------|-----------|
| **Formula** | `bits(i) = bits(i//2) + (i%2)` | `bits(i) = bits(i - MSB) + 1` |
| **Direction** | Bottom-up (smaller → larger) | Top-down (larger → smaller) |
| **Intuition** | Remove LSB, count remains | Remove MSB, subtract 1 |
| **Easier to** | Understand for most people | Understand binary structure |

---

## Summary

The **Bitwise DP - Counting Bits Optimization** pattern is a fundamental technique that demonstrates how understanding the mathematical structure of a problem can lead to elegant and optimal solutions. The key takeaways are:

1. **Core Insight**: `ans[i] = ans[i // 2] + (i % 2)` leverages the binary structure of numbers
2. **Optimality**: O(n) time is optimal since we must compute all values
3. **Multiple Approaches**: Several equivalent formulations exist (i//2, i&(i-1), i&-i, MSB)
4. **Practicality**: The pattern extends to many related problems in bit manipulation

This pattern is essential for any developer preparing for technical interviews or working with low-level systems programming.

---

## LeetCode Link

[Counting Bits - LeetCode](https://leetcode.com/problems/counting-bits/)
