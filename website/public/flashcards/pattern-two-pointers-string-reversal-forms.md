## Two Pointers - String Reversal: Forms

What are the different variations of string reversal?

<!-- front -->

---

### Form 1: Basic String Reversal

```python
def reverse_basic(s):
    chars = list(s)
    left, right = 0, len(chars) - 1
    
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
    
    return ''.join(chars)
```

---

### Form 2: Reverse Only Vowels

```python
def reverse_vowels(s):
    vowels = set('aeiouAEIOU')
    chars = list(s)
    left, right = 0, len(chars) - 1
    
    while left < right:
        while left < right and chars[left] not in vowels:
            left += 1
        while left < right and chars[right] not in vowels:
            right -= 1
        
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
    
    return ''.join(chars)
```

---

### Form 3: Reverse Words Only

```python
def reverse_each_word(s):
    """Reverse each word, keep word order."""
    chars = list(s)
    n = len(chars)
    start = 0
    
    for i in range(n + 1):
        if i == n or chars[i] == ' ':
            # Reverse word from start to i-1
            left, right = start, i - 1
            while left < right:
                chars[left], chars[right] = chars[right], chars[left]
                left += 1
                right -= 1
            start = i + 1
    
    return ''.join(chars)
```

---

### Form 4: Reverse Word Order

```python
def reverse_word_order(s):
    """Reverse order of words, words themselves not reversed."""
    words = s.split()
    left, right = 0, len(words) - 1
    
    while left < right:
        words[left], words[right] = words[right], words[left]
        left += 1
        right -= 1
    
    return ' '.join(words)
```

---

### Form 5: Left Rotate Array

```python
def left_rotate(nums, k):
    """Rotate array left by k."""
    n = len(nums)
    k = k % n
    
    # Reverse first k
    _reverse(nums, 0, k - 1)
    # Reverse remaining
    _reverse(nums, k, n - 1)
    # Reverse all
    _reverse(nums, 0, n - 1)
```

---

### Form Comparison

| Form | Reverses | Complexity | Notes |
|------|----------|------------|-------|
| Basic | Entire string | O(n) | In-place |
| Only Vowels | Selective chars | O(n) | Skip consonants |
| Each Word | Words individually | O(n) | Keep order |
| Word Order | Words as units | O(n) | Split/join |
| Rotate | Parts then whole | O(n) | Three reverses |

<!-- back -->
