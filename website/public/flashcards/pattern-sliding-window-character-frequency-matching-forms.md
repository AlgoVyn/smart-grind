## Sliding Window - Character Frequency Matching: Forms

What are the different variations of character frequency matching problems?

<!-- front -->

---

### Form 1: Fixed-Length Window - Basic Permutation Check

**Problem:** Check if any window in s is a permutation of t.

```python
from collections import Counter

def check_permutation(t: str, s: str) -> bool:
    """
    LeetCode 567: Permutation in String
    Time: O(m + n), Space: O(Σ)
    """
    if len(t) > len(s):
        return False
    
    t_count = Counter(t)
    window = Counter()
    
    # Build initial window
    for i in range(len(t)):
        window[s[i]] += 1
    
    if window == t_count:
        return True
    
    # Slide
    for i in range(len(t), len(s)):
        window[s[i]] += 1
        window[s[i - len(t)]] -= 1
        
        if window[s[i - len(t)]] == 0:
            del window[s[i - len(t)]]
        
        if window == t_count:
            return True
    
    return False
```

**Use for:** Permutation in String, checking anagram existence

---

### Form 2: Fixed-Length Window - All Anagram Indices

**Problem:** Return all starting indices of anagrams of t in s.

```python
from collections import Counter
from typing import List

def find_anagrams(s: str, t: str) -> List[int]:
    """
    LeetCode 438: Find All Anagrams in a String
    Time: O(m + n), Space: O(Σ)
    """
    if len(t) > len(s):
        return []
    
    result = []
    t_count = Counter(t)
    window = Counter()
    
    # Build initial window
    for i in range(len(t)):
        window[s[i]] += 1
    
    if window == t_count:
        result.append(0)
    
    # Slide
    for i in range(len(t), len(s)):
        window[s[i]] += 1
        window[s[i - len(t)]] -= 1
        
        if window[s[i - len(t)]] == 0:
            del window[s[i - len(t)]]
        
        if window == t_count:
            result.append(i - len(t) + 1)
    
    return result
```

**Use for:** Find All Anagrams, collecting all matching positions

---

### Form 3: Variable-Length Window - Minimum Window Substring

**Problem:** Find the smallest window in s containing all characters of t.

```python
from collections import Counter

def min_window(s: str, t: str) -> str:
    """
    LeetCode 76: Minimum Window Substring
    Time: O(m + n), Space: O(m + n)
    """
    if not t or not s:
        return ""
    
    dict_t = Counter(t)
    required = len(dict_t)
    
    # Optional: Filter s for optimization
    filtered_s = [(i, c) for i, c in enumerate(s) if c in dict_t]
    
    l = r = formed = 0
    window_counts = {}
    ans = float('inf'), None, None
    
    while r < len(filtered_s):
        char = filtered_s[r][1]
        window_counts[char] = window_counts.get(char, 0) + 1
        
        if window_counts[char] == dict_t[char]:
            formed += 1
        
        while l <= r and formed == required:
            char = filtered_s[l][1]
            
            end = filtered_s[r][0]
            start = filtered_s[l][0]
            if end - start + 1 < ans[0]:
                ans = (end - start + 1, start, end)
            
            window_counts[char] -= 1
            if window_counts[char] < dict_t[char]:
                formed -= 1
            l += 1
        
        r += 1
    
    return "" if ans[0] == float('inf') else s[ans[1]:ans[2]+1]
```

**Use for:** Minimum Window Substring, smallest containing window

---

### Form 4: Optimized Match Count (Fixed Window)

**Problem:** Permutation check using match_count instead of full comparison.

```python
def check_permutation_optimized(t: str, s: str) -> bool:
    """
    Optimized with match_count - O(m + n), O(Σ)
    """
    if len(t) > len(s):
        return False
    
    # Array counters for O(1) access
    t_count = [0] * 128
    window_count = [0] * 128
    
    # Count unique characters in t
    unique_chars = 0
    for c in t:
        if t_count[ord(c)] == 0:
            unique_chars += 1
        t_count[ord(c)] += 1
    
    match_count = 0
    
    # Build initial window
    for i in range(len(t)):
        c = ord(s[i])
        window_count[c] += 1
        if window_count[c] == t_count[c]:
            match_count += 1
    
    if match_count == unique_chars:
        return True
    
    # Slide window
    for i in range(len(t), len(s)):
        # Add new char
        new_c = ord(s[i])
        window_count[new_c] += 1
        if window_count[new_c] == t_count[new_c]:
            match_count += 1
        elif window_count[new_c] == t_count[new_c] + 1:
            match_count -= 1
        
        # Remove old char
        old_c = ord(s[i - len(t)])
        window_count[old_c] -= 1
        if window_count[old_c] == t_count[old_c]:
            match_count += 1
        elif window_count[old_c] == t_count[old_c] - 1:
            match_count -= 1
        
        if match_count == unique_chars:
            return True
    
    return False
```

**Use for:** Performance-critical scenarios, large alphabets

---

### Form 5: Multi-Word Anagram (Concatenation of Words)

**Problem:** Find substring that is concatenation of all words.

```python
from collections import Counter
from typing import List

def find_concatenation(s: str, words: List[str]) -> List[int]:
    """
    LeetCode 30: Substring with Concatenation of All Words
    Time: O(n × m × w), Space: O(m × w)
    """
    if not s or not words:
        return []
    
    word_len = len(words[0])
    num_words = len(words)
    total_len = word_len * num_words
    word_count = Counter(words)
    
    result = []
    
    # Try each possible starting offset within word length
    for i in range(word_len):
        left = i
        current_count = Counter()
        words_used = 0
        
        # Process in chunks of word_len
        for right in range(i, len(s) - word_len + 1, word_len):
            word = s[right:right + word_len]
            
            if word in word_count:
                current_count[word] += 1
                words_used += 1
                
                # Shrink if word count exceeded
                while current_count[word] > word_count[word]:
                    left_word = s[left:left + word_len]
                    current_count[left_word] -= 1
                    words_used -= 1
                    left += word_len
                
                # Check if all words matched
                if words_used == num_words:
                    result.append(left)
            else:
                # Invalid word, reset window
                current_count.clear()
                words_used = 0
                left = right + word_len
    
    return result
```

**Use for:** Substring with Concatenation of All Words, multi-pattern matching

---

### Form Comparison Table

| Form | Problem Type | Window Type | Time | Space | Key Feature |
|------|--------------|-------------|------|-------|-------------|
| **Form 1** | Basic permutation | Fixed | O(m+n) | O(Σ) | Boolean result |
| **Form 2** | All indices | Fixed | O(m+n) | O(Σ) | Collects all matches |
| **Form 3** | Minimum window | Variable | O(m+n) | O(m+n) | Expands/contracts |
| **Form 4** | Optimized check | Fixed | O(m+n) | O(Σ) | Match count tracking |
| **Form 5** | Multi-word concat | Fixed-step | O(n×m×w) | O(m×w) | Word-level sliding |

**Legend:**
- m = len(s), n = len(t), w = word length, num_words = number of words

---

### Form Selection Guide

| Problem Characteristic | Use Form |
|------------------------|----------|
| "Is t a permutation of substring in s?" | Form 1 or 4 |
| "Find all starting indices of anagrams" | Form 2 |
| "Find minimum window containing all chars" | Form 3 |
| "Find concatenation of all words" | Form 5 |
| Need best performance | Form 4 (optimized) |
| Unicode/extended chars | Form 3 (hash map based) |

<!-- back -->
