## Hash Map: Collision Handling

**Question:** How does hash map handle collisions and what are the implications?

<!-- front -->

---

## Answer: Chaining vs Open Addressing

### Hash Map Basics
```python
# What happens under the hood
hash("apple")  # → some integer index
dict["apple"]  # → stores at that index
```

### Two Collision Strategies

#### 1. Chaining (Most Common)
```
Index:  0    1    2    3    4    5    6
       ┌────┬────┬────┬────┬────┬────┬────┐
       │    │→A→B│    │→C  │    │    │→D  │
       └────┴────┴────┴────┴────┴────┴────┘
        Collision! A and B both hash to index 1
        Collision! C and D both hash to index 3
```

#### 2. Open Addressing (Linear/Quadratic Probing)
```
Index:  0    1    2    3    4    5    6
       ┌────┬────┬────┬────┬────┬────┬────┐
       │ A  │ B  │    │ C  │    │    │ D  │
       └────┴────┴────┴────┴────┴────┴────┘
        B collides with A at 1, goes to 2
        D collides with C at 3, goes to 6
```

### Python Implementation (Chaining)
```python
# Python dict uses open addressing internally
# But conceptually similar to chaining

d = {}
d["key1"] = "value1"
d["key2"] = "value2"

# Fast: O(1) average, O(n) worst case
```

### ⚠️ Tricky Parts

#### 1. Hash Collisions in LeetCode
```python
# When custom hash function is needed
# Example: Custom class as dictionary key

class Node:
    def __init__(self, x, next=None, random=None):
        self.val = x
        self.next = next
        self.random = random

# For tracking visited in deep copy:
visited = {}
visited[id(original_node)] = new_node  # Use id(), not object!
```

#### 2. Custom Hash Function
```python
# When default hash causes too many collisions
# Use tuple of values instead of single value

# WRONG - may collide
key = str(x) + "," + str(y)

# BETTER - tuple is hashable
key = (x, y)
```

#### 3. Load Factor
```python
# Python auto-resizes when load factor > 2/3
# This causes rehash - all keys re-indexed

# Java: default load factor 0.75
# When size/capacity > 0.75, resize
```

### Time Complexity

| Operation | Average | Worst Case |
|-----------|---------|------------|
| Insert | O(1) | O(n) |
| Lookup | O(1) | O(n) |
| Delete | O(1) | O(n) |

### What Causes Worst Case?
- Many hash collisions (malicious input)
- Poor hash function
- High load factor

### Common Mistakes

#### 1. Using Mutable Keys
```python
# WRONG - lists are not hashable!
d[[1,2]] = "value"  # TypeError!

# CORRECT - use tuple
d[(1,2)] = "value"

# For list, convert to tuple
key = tuple(my_list)
```

#### 2. Forgetting to Check Existence
```python
# WRONG - may overwrite or error
d[key] += 1  # KeyError if not exists!

# CORRECT
if key in d:
    d[key] += 1
else:
    d[key] = 1

# Or use get with default
d[key] = d.get(key, 0) + 1
```

#### 3. Hashing Wrong Type
```python
# Strings vs Integers
# "123" != 123 in hash

d["123"] = "string"
d[123] = "int"
# These are different keys!
```

### When to Use Hash Map

| Use Case | Solution |
|----------|----------|
| Frequency counting | dict or Counter |
| Looking up by key | dict |
| Detecting duplicates | set |
| Caching/memoization | dict |

### Defaultdict
```python
from collections import defaultdict

# Auto-initializes missing keys
d = defaultdict(list)
d["key"].append(1)  # No error, auto-creates []

d = defaultdict(int)
d["key"] += 1  # No error, starts at 0
```

### Counter
```python
from collections import Counter

# Perfect for frequency counting
nums = [1, 2, 1, 3, 2]
c = Counter(nums)
# Counter({1: 2, 2: 2, 3: 1})

c.most_common(2)  # [(1, 2), (2, 2)]
```

### ⚠️ Performance Gotchas

| Issue | Problem | Solution |
|-------|---------|----------|
| Too many collisions | O(n) performance | Use better hash function |
| Mutable keys | TypeError | Convert to immutable |
| Not checking existence | KeyError | Use .get() |
| Integer vs string | Wrong key | Be consistent with types |
| Rehash during iteration | Unpredictable | Don't modify while iterating |

<!-- back -->
