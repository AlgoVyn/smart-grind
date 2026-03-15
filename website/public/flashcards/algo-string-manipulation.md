## String Manipulation: Common Pitfalls

**Question:** What are the common mistakes when working with strings?

<!-- front -->

---

## Answer: Know String Immutability

### Key Concept: Strings are Immutable
```python
# WRONG - strings can't be modified in place!
s = "hello"
s[0] = "H"  # TypeError!

# CORRECT - create new string
s = "hello"
s = "H" + s[1:]  # "Hello"

# Or use list for in-place
s_list = list("hello")
s_list[0] = "H"
s = "".join(s_list)
```

### ⚠️ Tricky Parts

#### 1. String Concatenation in Loop
```python
# WRONG - O(n²) time!
result = ""
for c in chars:
    result += c  # Creates new string each time!

# CORRECT - O(n)
result = "".join(chars)

# Or use list
chars = []
for c in something:
    chars.append(c)
result = "".join(chars)
```

#### 2. Slicing Creates New String
```python
# Each slice creates new string - expensive!
s = "hello world"
sub = s[0:5]  # "hello" - new string
sub = s[6:]   # "world" - new string

# Be careful with repeated slicing
```

#### 3. String vs List Operations
```python
# String 'in' is O(n)
if "sub" in "long string":  # Linear search

# List 'in' is O(1) with set
if "sub" in {"sub1", "sub2"}:  # Hash lookup

# For multiple lookups, convert to set
```

### Common Operations

| Operation | Time | Notes |
|-----------|------|-------|
| len(s) | O(1) | Cached |
| s[i] | O(1) | Direct access |
| s[i:j] | O(j-i) | Creates new string |
| "sub" in s | O(n) | Linear search |
| s.find("sub") | O(n) | Linear search |
| s.split() | O(n) | Creates list |
| "".join(list) | O(n) | Concatenation |

### String Formatting
```python
# f-strings (Python 3.6+)
name = "Alice"
age = 30
print(f"{name} is {age}")  # "Alice is 30"

# Format specifiers
pi = 3.14159
print(f"{pi:.2f}")  # "3.14"

# Alignment
print(f"{name:>10}")  # "     Alice"
print(f"{name:<10}")  # "Alice     "
print(f"{name:^10}")  # "  Alice   "
```

### Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| String mutation | TypeError | Create new string |
| Loop concat | O(n²) | Use join() |
| Slicing too much | Memory waste | Use indices |
| Case sensitivity | Wrong comparison | Use lower()/upper() |
| Whitespace | Wrong results | Use strip() |

### Case Handling
```python
# Case-insensitive comparison
s1 = "Hello"
s2 = "hello"

# Option 1
s1.lower() == s2.lower()

# Option 2
s1.upper() == s2.upper()

# Option 3 (for sorting)
sorted("Hello", key=str.lower)
```

### Whitespace Handling
```python
# Strip leading/trailing
"  hello  ".strip()  # "hello"

# Strip left/right
"  hello  ".lstrip()  # "hello  "
"  hello  ".rstrip()  # "  hello"

# Replace multiple spaces
"hello   world".split()  # ['hello', 'world']
"hello   world".replace("  ", " ")  # Not recursive!
```

### Reversing Strings
```python
# WRONG - can't reverse in place
s = "hello"
s.reverse()  # AttributeError!

# CORRECT
s[::-1]  # "olleh"

# Or
"".join(reversed(s))
```

### Unicode and Encoding
```python
# Python 3 strings are Unicode
s = "Hello 🌍"
len(s)  # 7 (includes emoji!)

# Encode for bytes
s.encode('utf-8')

# Decode from bytes
b'hello'.decode('utf-8')
```

### StringBuilder Equivalent
```python
# Java has StringBuilder, Python has list
parts = []
for item in items:
    parts.append(str(item))
result = "".join(parts)

# Or use io.StringIO
import io
sb = io.StringIO()
sb.write("hello")
sb.write(" world")
print(sb.getvalue())  # "hello world"
```

### When to Use What

| Need | Solution |
|------|----------|
| Build string in loop | list + join() |
| Replace in place | Convert to list |
| Many comparisons | set() for O(1) lookup |
| Case insensitive | lower()/upper() |
| Split/join | split()/join() |

### Performance Example
```python
import time

# Bad: O(n²)
start = time.time()
s = ""
for i in range(10000):
    s += str(i)
print(f"Concatenation: {time.time() - start:.3f}s")

# Good: O(n)
start = time.time()
parts = []
for i in range(10000):
    parts.append(str(i))
s = "".join(parts)
print(f"Join: {time.time() - start:.3f}s")
```

<!-- back -->
