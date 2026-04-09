## String - Multiply Strings (Manual Simulation): Tactics

What are practical tactics for solving string multiplication problems?

<!-- front -->

---

### Tactic 1: Trace Through with a Small Example

**Manually simulate the algorithm to verify understanding:**

```
Input: num1 = "12", num2 = "34"

Setup: result = [0, 0, 0, 0]  (size 2+2=4)

i=1 (digit '2'), j=1 (digit '4'):
  product = 2×4 = 8
  total = 8 + result[1+1+1] = 8 + result[3] = 8 + 0 = 8
  result[3] = 8 % 10 = 8
  result[2] += 8 // 10 = 0
  result = [0, 0, 0, 8]

i=1 (digit '2'), j=0 (digit '3'):
  product = 2×3 = 6
  total = 6 + result[1+0+1] = 6 + result[2] = 6 + 0 = 6
  result[2] = 6 % 10 = 6
  result[1] += 6 // 10 = 0
  result = [0, 0, 6, 8]

i=0 (digit '1'), j=1 (digit '4'):
  product = 1×4 = 4
  total = 4 + result[0+1+1] = 4 + result[2] = 4 + 6 = 10
  result[2] = 10 % 10 = 0
  result[1] += 10 // 10 = 1
  result = [0, 1, 0, 8]

i=0 (digit '1'), j=0 (digit '3'):
  product = 1×3 = 3
  total = 3 + result[0+0+1] = 3 + result[1] = 3 + 1 = 4
  result[1] = 4 % 10 = 4
  result[0] += 4 // 10 = 0
  result = [0, 4, 0, 8]

Skip leading zero at index 0:
Final: "408" ✓ (12 × 34 = 408)
```

---

### Tactic 2: Debug with Position Visualization

**Print positions during execution to catch off-by-one errors:**

```python
def multiply_strings_debug(num1, num2):
    if num1 == "0" or num2 == "0":
        return "0"
    
    m, n = len(num1), len(num2)
    result = [0] * (m + n)
    
    print(f"num1: {num1} (indices 0 to {m-1})")
    print(f"num2: {num2} (indices 0 to {n-1})")
    print(f"result array size: {m + n}")
    print()
    
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            d1 = ord(num1[i]) - ord('0')
            d2 = ord(num2[j]) - ord('0')
            product = d1 * d2
            total = product + result[i + j + 1]
            
            print(f"i={i}({d1}), j={j}({d2}): product={d1}×{d2}={product}")
            print(f"  positions: result[{i+j}] (carry), result[{i+j+1}] (current)")
            print(f"  total={product}+{result[i+j+1]}={total}")
            print(f"  result[{i+j+1}] = {total}%10 = {total%10}")
            print(f"  result[{i+j}] += {total}//10 = {total//10}")
            
            result[i + j + 1] = total % 10
            result[i + j] += total // 10
            print(f"  result now: {result}")
            print()
    
    # Skip leading zeros
    start = 0
    while start < len(result) and result[start] == 0:
        start += 1
    
    return ''.join(map(str, result[start:]))
```

---

### Tactic 3: Handle Edge Cases First

**Always check these before the main algorithm:**

```python
def multiply_robust(num1, num2):
    """
    Production-ready with all edge cases.
    """
    # Edge case 1: Empty strings
    if not num1 or not num2:
        return "0"
    
    # Edge case 2: Contains only zeros
    if set(num1) <= {'0'} or set(num2) <= {'0'}:
        return "0"
    
    # Edge case 3: Contains non-digit characters
    if not num1.isdigit() or not num2.isdigit():
        raise ValueError("Inputs must contain only digits")
    
    # Edge case 4: Leading zeros in input
    num1 = num1.lstrip('0') or "0"
    num2 = num2.lstrip('0') or "0"
    
    # Edge case 5: Either is zero
    if num1 == "0" or num2 == "0":
        return "0"
    
    # Main algorithm...
    return multiply_strings(num1, num2)
```

---

### Tactic 4: Verify with Built-in (for Testing)

**Use Python's big integers to verify your implementation:**

```python
def test_multiply():
    """Test cases for string multiplication."""
    test_cases = [
        ("2", "3", "6"),
        ("123", "456", "56088"),
        ("99", "99", "9801"),
        ("123456789", "987654321", "121932631112635269"),
        ("0", "12345", "0"),
        ("1", "0", "0"),
        ("999", "999", "998001"),
    ]
    
    for num1, num2, expected in test_cases:
        result = multiply_strings(num1, num2)
        # Verify with Python's built-in
        python_result = str(int(num1) * int(num2))
        
        assert result == expected, f"Failed: {num1} × {num2}"
        assert result == python_result, f"Mismatch with Python: {result} != {python_result}"
        print(f"✓ {num1} × {num2} = {result}")
    
    # Large number test (exceeds 64-bit)
    big1 = "12345678901234567890"
    big2 = "98765432109876543210"
    result = multiply_strings(big1, big2)
    expected = str(int(big1) * int(big2))
    assert result == expected
    print(f"✓ Large number test passed")
```

---

### Tactic 5: Extend for Decimal Numbers

**When dealing with floating-point string multiplication:**

```python
def multiply_decimal(num1: str, num2: str) -> str:
    """
    Multiply decimal strings (e.g., "12.34" × "5.6").
    """
    # Count decimal places
    def get_decimal_places(s):
        if '.' in s:
            return len(s) - s.index('.') - 1
        return 0
    
    # Remove decimal points
    def remove_decimal(s):
        return s.replace('.', '')
    
    dp1 = get_decimal_places(num1)
    dp2 = get_decimal_places(num2)
    total_dp = dp1 + dp2
    
    # Multiply as integers
    int_result = multiply_strings(remove_decimal(num1), remove_decimal(num2))
    
    # Insert decimal point
    if total_dp > 0:
        # Pad with leading zeros if needed
        int_result = int_result.zfill(total_dp + 1)
        insert_pos = len(int_result) - total_dp
        result = int_result[:insert_pos] + '.' + int_result[insert_pos:]
        # Remove trailing zeros and trailing decimal point
        result = result.rstrip('0').rstrip('.')
        return result
    
    return int_result

# Example: multiply_decimal("12.34", "5.6") → "69.104"
```

---

### Tactic 6: Handle Negative Numbers

**Extend for signed arithmetic:**

```python
def multiply_signed(num1: str, num2: str) -> str:
    """
    Multiply signed numbers (handles negative inputs).
    """
    # Determine sign
    sign1 = -1 if num1.startswith('-') else 1
    sign2 = -1 if num2.startswith('-') else 1
    result_sign = '-' if sign1 * sign2 == -1 else ''
    
    # Remove signs for multiplication
    abs_num1 = num1.lstrip('-')
    abs_num2 = num2.lstrip('-')
    
    # Multiply absolute values
    abs_result = multiply_strings(abs_num1, abs_num2)
    
    return result_sign + abs_result

# Example: multiply_signed("-123", "456") → "-56088"
#          multiply_signed("-123", "-456") → "56088"
```

<!-- back -->
