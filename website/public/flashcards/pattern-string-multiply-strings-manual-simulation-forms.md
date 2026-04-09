## String - Multiply Strings (Manual Simulation): Forms & Variations

What are the different forms and variations of string multiplication problems?

<!-- front -->

---

### Standard Form

Multiply two non-negative integer strings.

```python
def multiply_standard(num1: str, num2: str) -> str:
    """
    Basic string multiplication (LeetCode 43).
    Input: "123", "456" → Output: "56088"
    """
    if num1 == "0" or num2 == "0":
        return "0"
    
    m, n = len(num1), len(num2)
    result = [0] * (m + n)
    
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            product = (ord(num1[i]) - ord('0')) * (ord(num2[j]) - ord('0'))
            total = product + result[i + j + 1]
            result[i + j + 1] = total % 10
            result[i + j] += total // 10
    
    start = 0
    while start < len(result) and result[start] == 0:
        start += 1
    
    return ''.join(map(str, result[start:]))
```

---

### Form: Signed Multiplication

Handle positive and negative numbers.

```python
def multiply_signed(num1: str, num2: str) -> str:
    """
    Multiply signed numbers.
    Input: "-123", "456" → Output: "-56088"
    Input: "-123", "-456" → Output: "56088"
    """
    # Determine result sign
    negative = (num1[0] == '-') ^ (num2[0] == '-')
    
    # Remove signs
    abs_num1 = num1.lstrip('-')
    abs_num2 = num2.lstrip('-')
    
    # Multiply absolute values
    result = multiply_standard(abs_num1, abs_num2)
    
    return '-' + result if negative and result != "0" else result

# Test cases:
# multiply_signed("2", "3") → "6"
# multiply_signed("-2", "3") → "-6"
# multiply_signed("-2", "-3") → "6"
# multiply_signed("0", "-123") → "0"
```

---

### Form: Decimal/Floating-Point Multiplication

Multiply decimal numbers represented as strings.

```python
def multiply_decimal(num1: str, num2: str) -> str:
    """
    Multiply decimal strings.
    Input: "12.34", "5.6" → Output: "69.104"
    """
    # Count decimal places
    decimal_places_1 = len(num1) - num1.find('.') - 1 if '.' in num1 else 0
    decimal_places_2 = len(num2) - num2.find('.') - 1 if '.' in num2 else 0
    total_places = decimal_places_1 + decimal_places_2
    
    # Remove decimal points
    int_num1 = num1.replace('.', '')
    int_num2 = num2.replace('.', '')
    
    # Multiply as integers
    int_result = multiply_standard(int_num1, int_num2)
    
    # Insert decimal point
    if total_places > 0:
        # Pad with leading zeros if necessary
        int_result = int_result.zfill(total_places + 1)
        insert_pos = len(int_result) - total_places
        result = int_result[:insert_pos] + '.' + int_result[insert_pos:]
        # Clean up: remove trailing zeros and unnecessary decimal point
        result = result.rstrip('0').rstrip('.')
        return result
    
    return int_result

# Test cases:
# multiply_decimal("0.5", "0.2") → "0.1"
# multiply_decimal("123.45", "0.01") → "1.2345"
# multiply_decimal("2.5", "4") → "10"
```

---

### Form: Large Number Factorial

Compute factorial of large n (result as string).

```python
def factorial_string(n: int) -> str:
    """
    Compute n! as string for large n.
    """
    result = "1"
    for i in range(2, n + 1):
        result = multiply_standard(result, str(i))
    return result

def factorial_optimized(n: int) -> str:
    """
    Optimized using divide-and-conquer (product tree).
    Reduces number of multiplications from O(n) to O(log n) large multiplies.
    """
    def product_range(start, end):
        """Compute product of range [start, end] as string."""
        if start > end:
            return "1"
        if start == end:
            return str(start)
        mid = (start + end) // 2
        left = product_range(start, mid)
        right = product_range(mid + 1, end)
        return multiply_standard(left, right)
    
    return product_range(2, n)

# Example: factorial_string(100) produces 158-digit number
# 93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000
```

---

### Form: String Power (Exponentiation)

Compute num^k for large k.

```python
def string_power(num: str, k: int) -> str:
    """
    Compute num^k using fast exponentiation.
    Time: O(log k × n²) where n is digit count
    """
    if k == 0:
        return "1"
    if k == 1:
        return num
    
    # Fast exponentiation
    half = string_power(num, k // 2)
    result = multiply_standard(half, half)
    
    if k % 2 == 1:
        result = multiply_standard(result, num)
    
    return result

# Example: string_power("2", 100) computes 2^100
# Result: "1267650600228229401496703205376"
```

---

### Form: Modular String Multiplication

Compute (num1 × num2) % mod for very large numbers.

```python
def multiply_mod(num1: str, num2: str, mod: int) -> int:
    """
    Compute (num1 × num2) % mod without full multiplication overflow.
    Useful when intermediate product exceeds limits.
    """
    # Convert num1 to int mod mod
    a = 0
    for c in num1:
        a = (a * 10 + (ord(c) - ord('0'))) % mod
    
    # Convert num2 similarly
    b = 0
    for c in num2:
        b = (b * 10 + (ord(c) - ord('0'))) % mod
    
    # Multiply mods
    return (a * b) % mod

def power_mod(base: str, exp: int, mod: int) -> int:
    """
    Compute (base^exp) % mod for string base.
    """
    # Convert base to int mod mod
    b = 0
    for c in base:
        b = (b * 10 + (ord(c) - ord('0'))) % mod
    
    # Fast exponentiation
    result = 1
    while exp > 0:
        if exp & 1:
            result = (result * b) % mod
        b = (b * b) % mod
        exp >>= 1
    
    return result

# Example: power_mod("123456789", 1000, 1000000007) for cryptography
```

---

### Form: Add Strings (Companion Pattern)

Add two string numbers (often paired with multiply).

```python
def add_strings(num1: str, num2: str) -> str:
    """
    Add two string-represented numbers.
    Companion to multiply_strings pattern.
    """
    result = []
    carry = 0
    i, j = len(num1) - 1, len(num2) - 1
    
    while i >= 0 or j >= 0 or carry:
        d1 = ord(num1[i]) - ord('0') if i >= 0 else 0
        d2 = ord(num2[j]) - ord('0') if j >= 0 else 0
        
        total = d1 + d2 + carry
        result.append(str(total % 10))
        carry = total // 10
        
        i -= 1
        j -= 1
    
    return ''.join(reversed(result))

# Example: add_strings("123", "456") → "579"
#          add_strings("999", "1") → "1000"
```

---

### Summary: Form Selection Guide

| Variation | Key Modification | Use Case |
|-----------|-----------------|----------|
| Standard | Base algorithm | Interview standard |
| Signed | Track sign separately | Calculator apps |
| Decimal | Track decimal positions | Financial apps |
| Factorial | Iterative multiplication | Combinatorics |
| Power | Fast exponentiation | Cryptography |
| Modular | Mod at each step | Large number crypto |
| Add | Single pass with carry | Building blocks |

<!-- back -->
