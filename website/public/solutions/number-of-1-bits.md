# Number Of 1 Bits

## Problem Description

Given a positive integer n, write a function that returns the number of set bits in its binary representation (also known as the Hamming weight).

---

## Examples

### Example 1

**Input:**
```python
n = 11
```

**Output:**
```python
3
```

**Explanation:**
The input binary string 1011 has a total of three set bits.

### Example 2

**Input:**
```python
n = 128
```

**Output:**
```python
1
```

**Explanation:**
The input binary string 10000000 has a total of one set bit.

### Example 3

**Input:**
```python
n = 2147483645
```

**Output:**
```python
30
```

**Explanation:**
The input binary string 1111111111111111111111111111101 has a total of thirty set bits.

---

## Constraints

- `1 <= n <= 2^31 - 1`

**Follow up:** If this function is called many times, how would you optimize it?

---

## Solution

```python
class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            count += n & 1
            n >>= 1
        return count
```

---

## Explanation

To count the number of 1 bits (Hamming weight) in the binary representation of an integer, we can iterate through each bit of the number.

### Algorithm Steps

1. Initialize a counter to 0.

2. While the number is not zero, check the least significant bit using `n & 1`. If it's 1, increment the counter.

3. Right shift the number by 1 to check the next bit (`n >>= 1`).

4. Repeat until the number becomes 0.

---

## Complexity Analysis

- **Time Complexity:** O(1), since integers are 32-bit, the loop runs at most 32 times.
- **Space Complexity:** O(1), using only a few variables.
