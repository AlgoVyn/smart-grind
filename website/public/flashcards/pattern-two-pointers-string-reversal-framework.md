## Two Pointers - String Reversal: Framework

What is the complete code template for string reversal?

<!-- front -->

---

### Framework 1: Basic Reversal Template

```
┌─────────────────────────────────────────────────────┐
│  STRING REVERSAL - BASIC TEMPLATE                    │
├─────────────────────────────────────────────────────┤
│  1. Convert string to char array (if immutable)     │
│  2. Initialize left = 0, right = n - 1              │
│  3. While left < right:                             │
│     a. Swap chars[left] and chars[right]            │
│     b. left += 1                                    │
│     c. right -= 1                                   │
│  4. Return joined array / modified string           │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def reverse_string(s):
    """Reverse string in-place."""
    chars = list(s)
    left, right = 0, len(chars) - 1
    
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
    
    return ''.join(chars)
```

---

### Framework 2: Reverse Words in String

```python
def reverse_words(s):
    """Reverse word order, words themselves not reversed."""
    chars = list(s)
    n = len(chars)
    
    # Step 1: Reverse entire string
    _reverse(chars, 0, n - 1)
    
    # Step 2: Reverse each word
    start = 0
    for i in range(n + 1):
        if i == n or chars[i] == ' ':
            _reverse(chars, start, i - 1)
            start = i + 1
    
    return ''.join(chars)

def _reverse(chars, left, right):
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
```

---

### Framework 3: Rotate Array

```python
def rotate(nums, k):
    """Rotate array to right by k steps."""
    n = len(nums)
    k = k % n
    
    # Reverse all
    _reverse(nums, 0, n - 1)
    # Reverse first k
    _reverse(nums, 0, k - 1)
    # Reverse remaining
    _reverse(nums, k, n - 1)

def _reverse(arr, left, right):
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
```

---

### Key Pattern Elements

| Element | Value | Purpose |
|---------|-------|---------|
| left | 0 | Start from beginning |
| right | n-1 | Start from end |
| while | left < right | Stop when pointers meet |
| swap | Simultaneous assignment | Exchange values |

<!-- back -->
