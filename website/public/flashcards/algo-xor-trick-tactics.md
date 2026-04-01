## Title: XOR Trick - Tactics

What are practical tactics for applying XOR in problem solving?

<!-- front -->

---

### Tactic 1: Bit Counting for Multiple Appearances

**Pattern:** When elements appear k times (k > 2)

```python
def single_number_ii(nums):
    """
    Every element appears 3 times except one
    Use bit counting: if a bit appears 3k+1 times, it's in result
    """
    result = 0
    for i in range(32):  # For each bit position
        bit_sum = 0
        for num in nums:
            bit_sum += (num >> i) & 1
        
        # If bit appears 3k+1 times, it's in unique number
        if bit_sum % 3 == 1:
            result |= (1 << i)
    
    # Handle negative numbers (two's complement)
    if result >= 2**31:
        result -= 2**32
    
    return result

# Alternative: Use finite state machine with two bits
# seen_once, seen_twice tracking
```

| Appearances | Approach |
|-------------|----------|
| 2 (even) | XOR all |
| 3 | Bit counting / FSM |
| k | Modulo k bit counting |

---

### Tactic 2: XOR with Index for Position Problems

**Pattern:** Find number at wrong position or with wrong value

```python
def find_mismatch(nums):
    """
    nums should be 0..n-1 but one index has wrong value
    """
    n = len(nums)
    xor_all = 0
    
    # XOR all indices and all values
    for i in range(n):
        xor_all ^= i ^ nums[i]
    
    # xor_all = wrong_index ^ wrong_value
    return xor_all  # Need additional logic to separate

def find_duplicate_xor(nums):
    """
    nums: values in range 1..n, one duplicate
    n+1 elements total
    """
    n = len(nums) - 1
    xor = 0
    
    # XOR all expected (1..n) and all actual
    for i in range(1, n + 1):
        xor ^= i
    for num in nums:
        xor ^= num
    
    return xor  # This is the duplicate
```

---

### Tactic 3: Range XOR with Pattern

**Pattern:** Compute XOR(0..n) without iteration

```python
def xor_0_to_n(n):
    """
    XOR of all numbers from 0 to n
    O(1) using pattern
    """
    pattern = [n, 1, n + 1, 0]
    return pattern[n % 4]

# Pattern explanation:
# n=0: 0          → 0
# n=1: 0^1=1      → 1
# n=2: 0^1^2=3    → 3 (n+1)
# n=3: 0^1^2^3=0  → 0
# n=4: ...^4=4    → 4 (n)
# Cycle repeats every 4

def xor_l_to_r(l, r):
    """XOR of all numbers from l to r inclusive"""
    return xor_0_to_n(r) ^ xor_0_to_n(l - 1)

# xor(l, r) = xor(0, r) ^ xor(0, l-1)
# Because: xor(0, l-1) ^ xor(l, r) = xor(0, r)
```

---

### Tactic 4: XOR for Pair Counting

**Pattern:** Count pairs with XOR less than K

```python
def count_pairs_xor_less_than(nums, k):
    """
    Count pairs (i, j) where i < j and nums[i] ^ nums[j] < k
    """
    from collections import defaultdict
    
    # Trie-based approach for efficient counting
    class TrieNode:
        def __init__(self):
            self.children = {}
            self.count = 0
    
    root = TrieNode()
    
    def insert(num):
        node = root
        for i in range(31, -1, -1):
            bit = (num >> i) & 1
            if bit not in node.children:
                node.children[bit] = TrieNode()
            node = node.children[bit]
            node.count += 1
    
    def count_less(num, k):
        """Count numbers x in trie where num ^ x < k"""
        node = root
        result = 0
        for i in range(31, -1, -1):
            if not node:
                break
            num_bit = (num >> i) & 1
            k_bit = (k >> i) & 1
            
            if k_bit == 1:
                # If k has bit 1, we can take either path
                # One path makes XOR bit 0 (< k), other makes 1 (= so far)
                if num_bit in node.children:
                    result += node.children[num_bit].count
                node = node.children.get(1 - num_bit)
            else:
                # k has bit 0, must match num_bit to keep XOR < k
                node = node.children.get(num_bit)
        return result
    
    result = 0
    for num in nums:
        result += count_less(num, k)
        insert(num)
    
    return result
```

---

### Tactic 5: XOR for Randomization/Hashing

**Pattern:** Use XOR as simple hash or checksum

```python
def xor_hash(data):
    """Simple XOR hash of byte sequence"""
    result = 0
    for byte in data:
        result ^= byte
    return result

def xor_checksum(arr):
    """Detect single bit error in array"""
    checksum = 0
    for num in arr:
        checksum ^= num
    return checksum

# Properties useful for hashing:
# - Order independent (commutative)
# - Fast computation
# - Detects odd number of bit flips

# XOR swap for in-place array reversal
def reverse_xor(arr):
    """Reverse array using XOR swaps"""
    n = len(arr)
    for i in range(n // 2):
        arr[i] ^= arr[n - 1 - i]
        arr[n - 1 - i] ^= arr[i]
        arr[i] ^= arr[n - 1 - i]
    return arr
```

<!-- back -->
