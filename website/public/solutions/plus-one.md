# Plus One

## Problem Statement

Given a non-empty array of decimal digits `digits` representing a non-negative integer, increment the integer by one and return the resulting array of digits.

The digits are stored such that the most significant digit is at the head of the list, meaning `digits[0]` is the thousands digit and `digits[-1]` is the ones digit.

**Constraints:**
- `1 <= digits.length <= 100`
- `0 <= digits[i] <= 9`
- The integer does not have leading zeros (except the number 0 itself)

## Examples

**Example 1:**
```
Input: digits = [1, 2, 3]
Output: [1, 2, 4]
Explanation: 123 + 1 = 124
```

**Example 2:**
```
Input: digits = [4, 3, 2, 1]
Output: [4, 3, 2, 2]
Explanation: 4321 + 1 = 4322
```

**Example 3:**
```
Input: digits = [9, 9, 9]
Output: [1, 0, 0, 0]
Explanation: 999 + 1 = 1000
```

## Intuition

The problem simulates adding 1 to a number represented as an array of digits. Key observations:

- We start adding from the least significant digit (rightmost)
- If adding 1 results in a value < 10, we're done
- If it equals 10, we set the digit to 0 and carry 1 to the next position
- This carry propagation continues until we either stop at a digit < 9 or exhaust all digits

## Multiple Approaches

### Approach 1: Reverse Iteration (Most Efficient)

```python
def plus_one(digits):
    """
    Time: O(n) - single pass through digits
    Space: O(1) - modifies array in place
    """
    n = len(digits)
    for i in range(n - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits  # Early return, no carry
        digits[i] = 0  # Handle carry, digit becomes 0
    
    # All digits were 9, need new leading 1
    return [1] + digits
```

**Explanation:**
- Iterate from right to left (least significant to most significant digit)
- If current digit is less than 9, simply increment and return (no carry)
- If digit is 9, set it to 0 and continue (carry propagation)
- If we exit the loop, all digits were 9, so prepend 1

### Approach 2: String Conversion (Simple but Less Efficient)

```python
def plus_one(digits):
    """
    Convert to string, add 1, convert back.
    Time: O(n) but with string conversions
    Space: O(n)
    """
    num = int(''.join(map(str, digits)))
    num += 1
    return [int(d) for d in str(num)]
```

**Explanation:**
- Convert digit array to string, then to integer
- Add 1 to the integer
- Convert back to string and split into digits
- This approach is simple but inefficient for very large numbers

### Approach 3: Recursive Solution

```python
def plus_one(digits):
    """
    Recursive approach with backtracking.
    Time: O(n) worst case
    Space: O(n) - recursion stack
    """
    if not digits:
        return [1]
    
    if digits[-1] < 9:
        digits[-1] += 1
        return digits
    
    digits[-1] = 0
    return plus_one(digits[:-1]) + [0] if digits[:-1] else [1, 0]
```

**Explanation:**
- Base case: empty array means we're done
- Recursive case: handle the last digit
- If last digit < 9, increment and return
- If last digit is 9, set to 0 and recursively process the rest
- If all digits were 9, prepend 1

### Approach 4: Using List Slice for All-9s Case

```python
def plus_one(digits):
    """
    Handle general case and special all-9s case separately.
    Time: O(n)
    Space: O(n) in worst case
    """
    # Handle all 9s case first (optimization)
    if all(d == 9 for d in digits):
        return [1] + [0] * len(digits)
    
    # Normal case - work backwards
    for i in range(len(digits) - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            break
        digits[i] = 0
    
    return digits
```

**Explanation:**
- Check for all-9s case upfront and handle it separately
- For normal case, iterate backwards and handle carry propagation
- More explicit about the two different cases

## Time & Space Complexity Analysis

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Reverse Iteration | O(n) | O(1) | Best solution, early termination |
| String Conversion | O(n) | O(n) | Simple but uses extra memory |
| Recursive | O(n) | O(n) | Stack overhead |
| Separate Cases | O(n) | O(n) | Clear but more verbose |

**n = number of digits**

**Best Case Analysis:**
- When the last digit is < 9: O(1) time, just increment and return
- Example: [1, 2, 3] → O(1) operations

**Worst Case Analysis:**
- When all digits are 9: O(n) time, must process all digits
- Example: [9, 9, 9] → O(n) operations

## Common Pitfalls

1. **Carry Propagation**: Forgetting to continue checking after setting a digit to 0 can miss further carries.

2. **Leading Zeros**: The array shouldn't have leading zeros except for the number 0, but handle cases where all digits are 9.

3. **Empty Array**: Though unlikely, ensure the array is non-empty as per problem constraints.

4. **In-Place Modification**: Remember that the function modifies the input array; if preservation is needed, make a copy first.

5. **Edge Cases**: Don't forget the all-9s case which requires adding a new leading 1.

## Related Problems

1. **[Add Two Numbers (LeetCode 2)](https://leetcode.com/problems/add-two-numbers/)** - Add two numbers represented as linked lists

2. **[Add Binary (LeetCode 67)](https://leetcode.com/problems/add-binary/)** - Add two binary strings

3. **[Add Strings (LeetCode 415)](https://leetcode.com/problems/add-strings/)** - Add two non-negative integer strings

4. **[Plus One Linked List (LeetCode 369)](https://leetcode.com/problems/plus-one-linked-list/)** - Same problem with linked list representation

## Video Tutorial Links

- [NeetCode - Plus One](https://www.youtube.com/watch?v=1L1N199hbFw)
- [LeetCode Official Solution](https://leetcode.com/problems/plus-one/solution/)
- [Back to Back SWE - Plus One](https://www.youtube.com/watch?v=2J2-82tK6vw)

## Key Takeaways

1. **Early termination**: Most numbers don't cause carry propagation through all digits

2. **In-place modification**: Only allocate new space when necessary (all 9s case)

3. **Right-to-left processing**: Always start from least significant digit for arithmetic operations

4. **Handle edge cases**: Pay special attention to all-9s input which requires special handling

