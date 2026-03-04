# XOR Trick

## Category
Bit Manipulation

## Description

The XOR Trick leverages the unique mathematical properties of the XOR (exclusive or) bitwise operation to solve common programming problems elegantly and efficiently. It enables finding single unique elements, swapping values without temporary variables, detecting missing numbers, and more - all in O(n) time with O(1) space complexity.

---

## When to Use

Use the XOR Trick when you need to solve problems involving:

- **Finding Unique Elements**: When all elements appear twice except one (or an odd number of times)
- **Value Swapping**: Swap two variables without using extra space
- **Missing Number Detection**: Find the missing number in a sequence [0, n]
- **Bit Manipulation**: Toggle bits, check parity, or perform bitwise operations
- **Memory-Efficient Operations**: When O(1) space is required

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|----------------|------------------|----------|
| **XOR Trick** | O(n) | O(1) | Single unique element, swapping |
| **Hash Set** | O(n) | O(n) | Multiple unique elements, counting |
| **Sorting** | O(n log n) | O(1) or O(n) | When order matters |
| **Bit Masking** | O(n) | O(1) | Multiple frequencies (3x, etc.) |
| **Math (Sum)** | O(n) | O(1) | Missing number with known formula |

### When to Choose XOR Trick vs Hash Set

- **Choose XOR Trick** when:
  - Only ONE element appears an odd number of times
  - Space must be O(1)
  - You need to swap without temp variable
  - Working with bit-level operations

- **Choose Hash Set** when:
  - Multiple elements appear odd number of times
  - You need to return all unique elements
  - Space is not a constraint
  - Need to track frequencies

---

## Algorithm Explanation

### Core Concept

XOR (exclusive or) is a bitwise operation that returns 1 when the two bits are different, and 0 when they are the same. Its mathematical properties make it incredibly powerful for certain problem types.

**Key XOR Properties:**

1. **Identity**: `a ^ 0 = a` - XOR with 0 returns the same number
2. **Self-inverse**: `a ^ a = 0` - XOR with itself returns 0
3. **Commutative**: `a ^ b = b ^ a` - Order doesn't matter
4. **Associative**: `(a ^ b) ^ c = a ^ (b ^ c)` - Grouping doesn't matter

### How It Works

#### Finding a Unique Element:
When all elements appear twice except one:
```
Given: [4, 1, 2, 1, 2]
XOR all: 4 ^ 1 ^ 2 ^ 1 ^ 2

Using commutative/associative properties:
= 4 ^ (1 ^ 1) ^ (2 ^ 2)
= 4 ^ 0 ^ 0
= 4 ✓
```

Pairs cancel out (a ^ a = 0), leaving only the unique element.

#### Swapping Without Temp Variable:
```
Initial: a = 5, b = 10

Step 1: a = a ^ b  →  a = 5 ^ 10,  b = 10
Step 2: b = a ^ b  →  b = (5^10) ^ 10 = 5,  a = 5^10
Step 3: a = a ^ b  →  a = (5^10) ^ 5 = 10,  b = 5

Result: a = 10, b = 5 ✓
```

### Visual Representation

For array `[4, 1, 2, 1, 2]` finding unique element:

```
Initial: result = 0

Step 1: result = 0 ^ 4 = 4
Step 2: result = 4 ^ 1 = 5
Step 3: result = 5 ^ 2 = 7
Step 4: result = 7 ^ 1 = 6  (1 cancels out!)
Step 5: result = 6 ^ 2 = 4  (2 cancels out!)

Final: 4 ✓
```

### Limitations

- **Only works for ONE unique element**: When all others appear even number of times
- **Integer data only**: Works with numbers, not arbitrary objects
- **Two unique elements**: Requires additional grouping logic
- **Not for counting**: Can't determine how many times elements appear

---

## Algorithm Steps

### Finding Single Unique Element

1. **Initialize result**: Set `result = 0` (XOR identity)
2. **Iterate through array**: For each element in the array
3. **XOR accumulate**: `result ^= element`
4. **Return result**: The remaining value is the unique element

### Finding Two Unique Elements

1. **XOR all elements**: Get `xor_all = a ^ b` (the two unique elements)
2. **Find differentiating bit**: `rightmost_bit = xor_all & (-xor_all)`
3. **Partition into groups**: Elements with that bit set vs unset
4. **XOR each group separately**: Each group contains one unique element
5. **Return both results**: The two accumulated values

### Swapping Without Temp Variable

1. **First XOR**: `a ^= b` - Store combined value in `a`
2. **Second XOR**: `b ^= a` - Extract original `a` into `b`
3. **Third XOR**: `a ^= b` - Extract original `b` into `a`
4. **Note**: Only works when `a` and `b` are different memory locations

---

## Implementation

### Standard XOR Operations

````carousel
```python
def find_unique(nums):
    """
    Find the single element that appears once while others appear twice.
    
    Args:
        nums: List where every element appears twice except one
    
    Returns:
        The unique element
    
    Time: O(n)
    Space: O(1)
    """
    result = 0
    for num in nums:
        result ^= num
    return result


def swap_values(a, b):
    """
    Swap two values without temporary variable using XOR.
    
    Note: Only works when a and b are different memory locations.
    
    Args:
        a: First value
        b: Second value
    
    Returns:
        Tuple of swapped values (b, a)
    """
    a ^= b
    b ^= a
    a ^= b
    return a, b


def find_missing_number(nums):
    """
    Find missing number in range [0, n] where n = len(nums).
    XOR all indices and values.
    
    Args:
        nums: Array containing n distinct numbers from [0, n] with one missing
    
    Returns:
        The missing number
    """
    n = len(nums)
    result = n  # XOR with n (the extra number)
    for i, num in enumerate(nums):
        result ^= i ^ num
    return result


def find_two_unique(nums):
    """
    Find two unique elements when all others appear twice.
    Uses bit masking to partition elements.
    
    Args:
        nums: List where exactly two elements appear once, rest appear twice
    
    Returns:
        List containing the two unique elements
    """
    # Step 1: XOR all numbers - gives a ^ b
    xor_all = 0
    for num in nums:
        xor_all ^= num
    
    # Step 2: Find rightmost set bit (difference between a and b)
    rightmost_bit = xor_all & (-xor_all)
    
    # Step 3: Partition into two groups and XOR separately
    x, y = 0, 0
    for num in nums:
        if num & rightmost_bit:
            x ^= num
        else:
            y ^= num
    
    return [x, y]


def find_unique_three(nums):
    """
    Find element appearing once while others appear three times.
    Uses bit counting approach.
    
    Args:
        nums: List where every element appears three times except one
    
    Returns:
        The unique element
    """
    result = 0
    for i in range(32):  # For 32-bit integers
        bit_sum = 0
        mask = 1 << i
        for num in nums:
            if num & mask:
                bit_sum += 1
        
        if bit_sum % 3:
            result |= mask
    
    return result


# Example usage and demonstration
if __name__ == "__main__":
    # Test find_unique
    arr1 = [4, 1, 2, 1, 2]
    print(f"Array: {arr1}")
    print(f"Unique element: {find_unique(arr1)}")
    print()
    
    # Test swap
    a, b = 5, 10
    print(f"Before swap: a={a}, b={b}")
    a, b = swap_values(a, b)
    print(f"After swap: a={a}, b={b}")
    print()
    
    # Test missing number
    arr2 = [3, 0, 1]
    print(f"Array: {arr2}")
    print(f"Missing number: {find_missing_number(arr2)}")
    print()
    
    # Test two unique
    arr3 = [1, 2, 1, 3, 2, 5]
    print(f"Array: {arr3}")
    print(f"Two unique elements: {find_two_unique(arr3)}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
using namespace std;

/**
 * Find the single element that appears once while others appear twice.
 * 
 * Time: O(n)
 * Space: O(1)
 */
int findUnique(const vector<int>& nums) {
    int result = 0;
    for (int num : nums) {
        result ^= num;
    }
    return result;
}

/**
 * Swap two values without temporary variable using XOR.
 * Note: Only works when a and b are different memory locations.
 */
void swapValues(int& a, int& b) {
    if (&a != &b) {  // Important: must be different addresses
        a ^= b;
        b ^= a;
        a ^= b;
    }
}

/**
 * Find missing number in range [0, n] where n = nums.size().
 * XOR all indices and values.
 * 
 * Time: O(n)
 * Space: O(1)
 */
int findMissingNumber(const vector<int>& nums) {
    int n = nums.size();
    int result = n;  // XOR with n (the extra number)
    for (int i = 0; i < n; i++) {
        result ^= i ^ nums[i];
    }
    return result;
}

/**
 * Find two unique elements when all others appear twice.
 * Uses bit masking to partition elements.
 * 
 * Time: O(n)
 * Space: O(1)
 */
vector<int> findTwoUnique(const vector<int>& nums) {
    // Step 1: XOR all numbers - gives a ^ b
    int xorAll = 0;
    for (int num : nums) {
        xorAll ^= num;
    }
    
    // Step 2: Find rightmost set bit (difference between a and b)
    int rightmostBit = xorAll & (-xorAll);
    
    // Step 3: Partition into two groups and XOR separately
    int x = 0, y = 0;
    for (int num : nums) {
        if (num & rightmostBit) {
            x ^= num;
        } else {
            y ^= num;
        }
    }
    
    return {x, y};
}

/**
 * Find element appearing once while others appear three times.
 * Uses bit counting approach.
 * 
 * Time: O(32 * n) = O(n)
 * Space: O(1)
 */
int findUniqueThree(const vector<int>& nums) {
    int result = 0;
    for (int i = 0; i < 32; i++) {  // For 32-bit integers
        int bitSum = 0;
        int mask = 1 << i;
        for (int num : nums) {
            if (num & mask) {
                bitSum++;
            }
        }
        
        if (bitSum % 3) {
            result |= mask;
        }
    }
    return result;
}

int main() {
    // Test findUnique
    vector<int> arr1 = {4, 1, 2, 1, 2};
    cout << "Array: ";
    for (int x : arr1) cout << x << " ";
    cout << endl;
    cout << "Unique element: " << findUnique(arr1) << endl;
    cout << endl;
    
    // Test swap
    int a = 5, b = 10;
    cout << "Before swap: a=" << a << ", b=" << b << endl;
    swapValues(a, b);
    cout << "After swap: a=" << a << ", b=" << b << endl;
    cout << endl;
    
    // Test missing number
    vector<int> arr2 = {3, 0, 1};
    cout << "Array: ";
    for (int x : arr2) cout << x << " ";
    cout << endl;
    cout << "Missing number: " << findMissingNumber(arr2) << endl;
    cout << endl;
    
    // Test two unique
    vector<int> arr3 = {1, 2, 1, 3, 2, 5};
    cout << "Array: ";
    for (int x : arr3) cout << x << " ";
    cout << endl;
    vector<int> twoUnique = findTwoUnique(arr3);
    cout << "Two unique elements: " << twoUnique[0] << ", " << twoUnique[1] << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.Arrays;

/**
 * XOR Trick implementations for common problems.
 */
public class XORTechniques {
    
    /**
     * Find the single element that appears once while others appear twice.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public static int findUnique(int[] nums) {
        int result = 0;
        for (int num : nums) {
            result ^= num;
        }
        return result;
    }
    
    /**
     * Swap two values in an array without temporary variable using XOR.
     * Note: Only works when i and j are different indices.
     */
    public static void swapValues(int[] arr, int i, int j) {
        if (i != j) {  // Important: must be different indices
            arr[i] ^= arr[j];
            arr[j] ^= arr[i];
            arr[i] ^= arr[j];
        }
    }
    
    /**
     * Find missing number in range [0, n] where n = nums.length.
     * XOR all indices and values.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public static int findMissingNumber(int[] nums) {
        int n = nums.length;
        int result = n;  // XOR with n (the extra number)
        for (int i = 0; i < n; i++) {
            result ^= i ^ nums[i];
        }
        return result;
    }
    
    /**
     * Find two unique elements when all others appear twice.
     * Uses bit masking to partition elements.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public static int[] findTwoUnique(int[] nums) {
        // Step 1: XOR all numbers - gives a ^ b
        int xorAll = 0;
        for (int num : nums) {
            xorAll ^= num;
        }
        
        // Step 2: Find rightmost set bit (difference between a and b)
        int rightmostBit = xorAll & (-xorAll);
        
        // Step 3: Partition into two groups and XOR separately
        int x = 0, y = 0;
        for (int num : nums) {
            if ((num & rightmostBit) != 0) {
                x ^= num;
            } else {
                y ^= num;
            }
        }
        
        return new int[]{x, y};
    }
    
    /**
     * Find element appearing once while others appear three times.
     * Uses bit counting approach.
     * 
     * Time: O(32 * n) = O(n)
     * Space: O(1)
     */
    public static int findUniqueThree(int[] nums) {
        int result = 0;
        for (int i = 0; i < 32; i++) {  // For 32-bit integers
            int bitSum = 0;
            int mask = 1 << i;
            for (int num : nums) {
                if ((num & mask) != 0) {
                    bitSum++;
                }
            }
            
            if (bitSum % 3 != 0) {
                result |= mask;
            }
        }
        return result;
    }
    
    public static void main(String[] args) {
        // Test findUnique
        int[] arr1 = {4, 1, 2, 1, 2};
        System.out.println("Array: " + Arrays.toString(arr1));
        System.out.println("Unique element: " + findUnique(arr1));
        System.out.println();
        
        // Test swap
        int[] arrSwap = {5, 10};
        System.out.println("Before swap: arr[0]=" + arrSwap[0] + ", arr[1]=" + arrSwap[1]);
        swapValues(arrSwap, 0, 1);
        System.out.println("After swap: arr[0]=" + arrSwap[0] + ", arr[1]=" + arrSwap[1]);
        System.out.println();
        
        // Test missing number
        int[] arr2 = {3, 0, 1};
        System.out.println("Array: " + Arrays.toString(arr2));
        System.out.println("Missing number: " + findMissingNumber(arr2));
        System.out.println();
        
        // Test two unique
        int[] arr3 = {1, 2, 1, 3, 2, 5};
        System.out.println("Array: " + Arrays.toString(arr3));
        int[] twoUnique = findTwoUnique(arr3);
        System.out.println("Two unique elements: " + twoUnique[0] + ", " + twoUnique[1]);
    }
}
```

<!-- slide -->
```javascript
/**
 * XOR Trick implementations for common problems.
 */

/**
 * Find the single element that appears once while others appear twice.
 * 
 * @param {number[]} nums - Array where every element appears twice except one
 * @returns {number} The unique element
 * 
 * Time: O(n)
 * Space: O(1)
 */
function findUnique(nums) {
    let result = 0;
    for (const num of nums) {
        result ^= num;
    }
    return result;
}

/**
 * Swap two values without temporary variable using XOR.
 * Note: Only works when a and b are different memory locations.
 * 
 * @param {Object} obj - Object containing values to swap
 * @param {string} key1 - First key
 * @param {string} key2 - Second key
 */
function swapValues(obj, key1, key2) {
    if (key1 !== key2) {
        obj[key1] ^= obj[key2];
        obj[key2] ^= obj[key1];
        obj[key1] ^= obj[key2];
    }
}

/**
 * Find missing number in range [0, n] where n = nums.length.
 * XOR all indices and values.
 * 
 * @param {number[]} nums - Array containing n distinct numbers from [0, n] with one missing
 * @returns {number} The missing number
 * 
 * Time: O(n)
 * Space: O(1)
 */
function findMissingNumber(nums) {
    const n = nums.length;
    let result = n;  // XOR with n (the extra number)
    for (let i = 0; i < n; i++) {
        result ^= i ^ nums[i];
    }
    return result;
}

/**
 * Find two unique elements when all others appear twice.
 * Uses bit masking to partition elements.
 * 
 * @param {number[]} nums - Array where exactly two elements appear once, rest appear twice
 * @returns {number[]} Array containing the two unique elements
 * 
 * Time: O(n)
 * Space: O(1)
 */
function findTwoUnique(nums) {
    // Step 1: XOR all numbers - gives a ^ b
    let xorAll = 0;
    for (const num of nums) {
        xorAll ^= num;
    }
    
    // Step 2: Find rightmost set bit (difference between a and b)
    const rightmostBit = xorAll & (-xorAll);
    
    // Step 3: Partition into two groups and XOR separately
    let x = 0, y = 0;
    for (const num of nums) {
        if (num & rightmostBit) {
            x ^= num;
        } else {
            y ^= num;
        }
    }
    
    return [x, y];
}

/**
 * Find element appearing once while others appear three times.
 * Uses bit counting approach.
 * 
 * @param {number[]} nums - Array where every element appears three times except one
 * @returns {number} The unique element
 * 
 * Time: O(32 * n) = O(n)
 * Space: O(1)
 */
function findUniqueThree(nums) {
    let result = 0;
    for (let i = 0; i < 32; i++) {  // For 32-bit integers
        let bitSum = 0;
        const mask = 1 << i;
        for (const num of nums) {
            if (num & mask) {
                bitSum++;
            }
        }
        
        if (bitSum % 3 !== 0) {
            result |= mask;
        }
    }
    return result;
}

// Example usage and demonstration
const arr1 = [4, 1, 2, 1, 2];
console.log(`Array: [${arr1.join(', ')}]`);
console.log(`Unique element: ${findUnique(arr1)}`);
console.log();

// Test swap
let a = 5, b = 10;
console.log(`Before swap: a=${a}, b=${b}`);
let obj = { a: 5, b: 10 };
swapValues(obj, 'a', 'b');
console.log(`After swap: a=${obj.a}, b=${obj.b}`);
console.log();

// Test missing number
const arr2 = [3, 0, 1];
console.log(`Array: [${arr2.join(', ')}]`);
console.log(`Missing number: ${findMissingNumber(arr2)}`);
console.log();

// Test two unique
const arr3 = [1, 2, 1, 3, 2, 5];
console.log(`Array: [${arr3.join(', ')}]`);
console.log(`Two unique elements: ${findTwoUnique(arr3).join(', ')}`);
```
````

---

## Example

**Input - Single Unique:**
```
nums = [2, 2, 1]
```

**Output:**
```
1
```

**Explanation:** 2 ^ 2 = 0, 0 ^ 1 = 1

---

**Input - Single Unique (larger array):**
```
nums = [4, 1, 2, 1, 2]
```

**Output:**
```
4
```

**Explanation:** 4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1^1) ^ (2^2) = 4 ^ 0 ^ 0 = 4

---

**Input - Swap values:**
```
a = 5, b = 10
```

**Output:**
```
a = 10, b = 5
```

**Explanation:** XOR swap uses the property that (a^b)^b = a and (a^b)^a = b

---

**Input - Missing number:**
```
nums = [3, 0, 1]
n = 3
```

**Output:**
```
2
```

**Explanation:** XOR indices [0,1,2,3] with values [3,0,1]: 
0^3 ^ 1^0 ^ 2^1 ^ 3 = (0^0) ^ (1^1) ^ (3^3) ^ 2 = 2

---

**Input - Two unique elements:**
```
nums = [1, 2, 1, 3, 2, 5]
```

**Output:**
```
[3, 5]  (or [5, 3])
```

**Explanation:** XOR all = 3 ^ 5. Rightmost bit = 1, partitions into [1,3,1,3] and [2,2,5]. XOR each group separately.

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Find Single Unique** | O(n) | One pass through the array |
| **Find Two Unique** | O(n) | Two passes through the array |
| **Find Missing Number** | O(n) | One pass through the array |
| **Swap Values** | O(1) | Constant time XOR operations |
| **Find Unique (3x frequency)** | O(32 × n) = O(n) | 32 passes for each bit position |

### Detailed Breakdown

- **Finding unique element**: Single XOR accumulation across all n elements
  - One iteration: O(n)
  - XOR operation: O(1)
  - Total: O(n)

- **Finding two unique elements**:
  - First pass (XOR all): O(n)
  - Find rightmost bit: O(1)
  - Second pass (partition and XOR): O(n)
  - Total: O(n)

- **Finding missing number**:
  - XOR with n: O(1)
  - Loop through indices and values: O(n)
  - Total: O(n)

---

## Space Complexity Analysis

| Operation | Space Complexity | Description |
|-----------|-----------------|-------------|
| **All XOR Operations** | O(1) | Only store result variable(s) |
| **Find Two Unique** | O(1) | Store two result variables |
| **Bit Counting (3x)** | O(1) | Only counters and result |

### Space Optimization Notes

- **No auxiliary data structures**: Unlike hash set solutions that require O(n) space
- **Iterative approach**: No recursion stack needed
- **Bit manipulation**: Works with primitive integer types only

---

## Common Variations

### 1. Find Single Number II (Appears Once, Others 3x)

When every element appears three times except one:

````carousel
```python
def single_number_ii(nums):
    """
    Find element appearing once while others appear three times.
    Uses bit counting - count 1s at each position modulo 3.
    
    Time: O(32 * n) = O(n)
    Space: O(1)
    """
    result = 0
    for i in range(32):
        bit_sum = 0
        for num in nums:
            # Get i-th bit and add to sum
            bit_sum += (num >> i) & 1
        
        # If count of 1s is not multiple of 3, this bit is set in answer
        if bit_sum % 3:
            result |= (1 << i)
    
    # Handle negative numbers (Python uses arbitrary precision)
    if result >= 2**31:
        result -= 2**32
    
    return result
```
````

### 2. Find Single Number III (Two Unique Elements)

When exactly two elements appear once and all others appear twice:

````carousel
```python
def single_number_iii(nums):
    """
    Find two elements appearing once while others appear twice.
    
    Time: O(n)
    Space: O(1)
    """
    # XOR all to get a ^ b
    xor_all = 0
    for num in nums:
        xor_all ^= num
    
    # Find any set bit (rightmost is easiest)
    # This bit differs between a and b
    diff_bit = xor_all & (-xor_all)
    
    # Partition and XOR each group
    a, b = 0, 0
    for num in nums:
        if num & diff_bit:
            a ^= num
        else:
            b ^= num
    
    return [a, b]
```
````

### 3. XOR for Character Cases

Toggle between uppercase and lowercase:

````carousel
```python
def toggle_case(char):
    """
    Toggle between 'A' and 'a' using XOR.
    ASCII: 'A' = 65, 'a' = 97, difference is 32 (2^5)
    """
    return chr(ord(char) ^ 32)

# Examples:
# toggle_case('A') -> 'a'
# toggle_case('a') -> 'A'
```
````

### 4. XOR Cipher (Simple Encryption)

Basic encryption using XOR with a key:

````carousel
```python
def xor_cipher(text, key):
    """
    Simple XOR cipher for encryption/decryption.
    XORing twice with same key returns original.
    
    Time: O(n) where n = len(text)
    Space: O(n) for result
    """
    result = []
    key_len = len(key)
    for i, char in enumerate(text):
        result.append(chr(ord(char) ^ ord(key[i % key_len])))
    return ''.join(result)

# Usage:
# encrypted = xor_cipher("Hello", "key")
# decrypted = xor_cipher(encrypted, "key")  # Returns "Hello"
```
````

---

## Practice Problems

### Problem 1: Single Number

**Problem:** [LeetCode 136 - Single Number](https://leetcode.com/problems/single-number/)

**Description:** Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.

**How to Apply XOR Trick:**
- XOR all elements together
- Pairs cancel out (a ^ a = 0)
- Result is the unique element
- Follows your solution at: [bitwise-xor-finding-single-missing-number](../solutions/bitwise-xor-finding-single-missing-number.md)

---

### Problem 2: Single Number II

**Problem:** [LeetCode 137 - Single Number II](https://leetcode.com/problems/single-number-ii/)

**Description:** Given an integer array `nums` where every element appears three times except for one, which appears exactly once. Find the single element.

**How to Apply XOR Trick:**
- Count set bits at each position across all numbers
- Bits that appear 3k+1 times belong to the unique number
- Reconstruct the answer from bit counts

---

### Problem 3: Missing Number

**Problem:** [LeetCode 268 - Missing Number](https://leetcode.com/problems/missing-number/)

**Description:** Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.

**How to Apply XOR Trick:**
- XOR all indices (0 to n) with all values in array
- All present numbers cancel out
- Result is the missing number

---

### Problem 4: Find the Duplicate Number

**Problem:** [LeetCode 287 - Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)

**Description:** Given an array of `n + 1` integers where each integer is between 1 and `n` (inclusive), prove that at least one duplicate number must exist. Find the duplicate.

**How to Apply XOR Trick:**
- XOR all array elements with all numbers from 1 to n
- All unique numbers cancel out
- The duplicate appears twice in XOR, leaving it as result
- Note: Only works when duplicate appears exactly twice

---

### Problem 5: Flipping an Image

**Problem:** [LeetCode 832 - Flipping an Image](https://leetcode.com/problems/flipping-an-image/)

**Description:** Given an `n x n` binary matrix `image`, flip the image horizontally, then invert it.

**How to Apply XOR Trick:**
- Use XOR 1 to invert bits (0^1=1, 1^1=0)
- Swap elements using XOR for in-place reversal
- Efficient bit manipulation for binary matrices

---

## Video Tutorial Links

### Fundamentals

- [XOR Trick - Single Number (NeetCode)](https://www.youtube.com/watch?v=sGQJqHyt-hg) - Clear explanation of XOR properties
- [Bit Manipulation Tutorial (Take U Forward)](https://www.youtube.com/watch?v=5rtVTYAk9KQ) - Comprehensive bit manipulation concepts
- [XOR Swap Algorithm (Computerphile)](https://www.youtube.com/watch?v=7SGOYURWqJ8) - Mathematical proof of XOR swap

### Advanced Topics

- [Single Number II - Bit Counting](https://www.youtube.com/watch?v=5mLrTfhorwY) - Handling 3x frequency
- [Missing Number using XOR](https://www.youtube.com/watch?v=5HgW5qK8aB8) - Alternative to math approach
- [Bitwise Operators in Python](https://www.youtube.com/watch?v=5mLrTfhorwY) - Language-specific techniques

---

## Follow-up Questions

### Q1: Why does XOR swap work, and when should I avoid it?

**Answer:** XOR swap works because:
- Step 1: `a = a ^ b` stores combined information
- Step 2: `b = (a ^ b) ^ b = a` extracts original `a`
- Step 3: `a = (a ^ b) ^ a = b` extracts original `b`

**Avoid when:**
- `a` and `b` point to the same memory location (results in 0)
- Code readability is more important than micro-optimization
- Working with non-integer types

### Q2: Can XOR trick find the unique element if it appears 3 times instead of 1?

**Answer:** No, basic XOR trick doesn't work for 3x frequency because:
- XORing a number 3 times: `a ^ a ^ a = a` (not 0)
- The unique element would still appear in result
- For 3x frequency, use **bit counting approach** (count set bits at each position modulo 3)

### Q3: Why is XOR preferred over using a Hash Set for finding unique elements?

**Answer:** XOR is preferred when:
- **Space is constrained**: O(1) vs O(n) space
- **Only one unique element**: Simple and elegant solution
- **Bit manipulation allowed**: Works only for integers

Hash Set is better when:
- **Multiple unique elements** need to be found
- **Non-integer data** types
- **Need counts** or additional information

### Q4: Can XOR trick work with negative numbers?

**Answer:** Yes, XOR works with negative numbers in two's complement representation:
- Negative numbers have their sign bit set
- XOR operations work on all bits including sign bit
- In Python, need to handle arbitrary precision (may need to mask to 32 bits)

### Q5: How does XOR compare to the mathematical approach for finding missing number?

**Answer:** 

| Aspect | XOR Approach | Math Approach (Sum) |
|--------|-------------|---------------------|
| **Formula** | XOR all indices and values | `expected_sum - actual_sum` |
| **Overflow risk** | No (XOR doesn't overflow) | Yes (for large n) |
| **Intuition** | Bit manipulation | Arithmetic |
| **Space** | O(1) | O(1) |
| **Time** | O(n) | O(n) |

**Recommendation:** Use XOR when overflow is a concern; use sum for clearer code.

---

## Summary

The XOR Trick is a powerful technique leveraging the mathematical properties of the XOR operation to solve common programming problems with optimal time and space complexity. Key takeaways:

- **O(n) time, O(1) space**: Optimal complexity for single unique element problems
- **Key properties**: Identity (a^0=a), Self-inverse (a^a=0), Commutative, Associative
- **Common use cases**: Finding unique elements, swapping without temp, missing numbers
- **Limitations**: Only works for ONE unique element when others appear even times

When to use:
- ✅ Finding single element appearing once (others twice)
- ✅ Swapping integers without extra space
- ✅ Finding missing number in sequence
- ✅ Bit-level manipulation and toggling
- ❌ Finding multiple unique elements
- ❌ Non-integer data types
- ❌ When elements appear odd frequencies other than 1

This technique is essential for competitive programming and technical interviews, providing elegant solutions to problems that might otherwise require additional space complexity.

---

## Related Algorithms

- [Count Bits](./count-bits.md) - Related bit manipulation techniques
- [Subset Generation with Bits](./subset-generation-bits.md) - Bit masking patterns
- [Modular Inverse](./modular-inverse.md) - Number theory concepts
- [NCR Binomial](./ncr-binomial.md) - Mathematical properties
