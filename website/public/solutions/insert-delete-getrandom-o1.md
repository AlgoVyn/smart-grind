# Insert Delete GetRandom O(1)

## Problem Description
Implement the `RandomizedSet` class:
- `RandomizedSet()`: Initializes the RandomizedSet object
- `bool insert(int val)`: Inserts an item `val` into the set if not present. Returns `true` if the item was not present, `false` otherwise.
- `bool remove(int val)`: Removes an item `val` from the set if present. Returns `true` if the item was present, `false` otherwise.
- `int getRandom()`: Returns a random element from the current set of elements. Each element must have the **same probability** of being returned.

You must implement the functions of the class such that each function works in **average O(1) time complexity**.

This is **LeetCode Problem #380** and is classified as a Medium difficulty problem. It tests your understanding of data structures and how to combine them for optimal operations.

### Detailed Problem Statement
- The set must support insert, delete, and getRandom operations
- All operations must be average O(1) time complexity
- Each element must have equal probability of being selected in getRandom
- Duplicates are not allowed

## Constraints
| Constraint | Description |
|------------|-------------|
| `-2^31 <= val <= 2^31 - 1` | Value range |
| At most `2 * 10^5` calls will be made to insert, remove, and getRandom | Performance requirements |

---

## Examples

### Example 1:
```python
# Initialize RandomizedSet
rs = RandomizedSet()

rs.insert(1)  # Returns true
rs.remove(2)  # Returns false
rs.insert(2)  # Returns true
rs.getRandom()  # Returns either 1 or 2
rs.remove(1)  # Returns true
rs.insert(2)  # Returns false
rs.getRandom()  # Returns 2
```

### Example 2:
```python
rs = RandomizedSet()

rs.insert(0)  # true
rs.insert(1)  # true
rs.remove(0)  # true
rs.insert(2)  # true
rs.remove(1)  # true
rs.getRandom()  # returns 2
```

---

## Pattern: Hash Map + Dynamic Array (Data Structure Combination)

This problem demonstrates the **Data Structure Combination** pattern. The core idea is to combine two data structures to achieve O(1) time complexity for all required operations.

### Core Concept

- **Hash Map**: For O(1) insertion and deletion by value (value → index mapping)
- **Dynamic Array**: For O(1) random access by index
- **Swap-and-Pop**: Move the element to remove to the end, then pop to avoid shifting elements

### When to Use This Pattern

This pattern applies when:
- Need O(1) insert, delete, and random access operations
- When elements need equal probability of selection
- Data structure design problems requiring multiple operations
- When single data structure cannot achieve all required complexities

### Why It Works

The combination works because:
1. Hash map provides O(1) lookup for existence checks
2. Dynamic array provides O(1) index access for random selection
3. Swap-and-pop technique maintains O(1) deletion without array shifting

### Alternative Patterns

| Alternative Pattern | Use Case |
|---------------------|----------|
| **Set + List** | When order matters |
| **Balanced BST** | When sorted operations needed |
| **Linked List + Hash** | When order of insertion matters |

---

## Intuition
To achieve O(1) average time complexity for all operations, we need to combine two data structures:
1. **Hash Map (Dictionary)**: For O(1) insertions and deletions by value
2. **Dynamic Array (List)**: For O(1) access to random elements by index

Key insight: When removing, swap the element to be removed with the last element in the list, then remove from the end. This avoids shifting elements.

---

## Solution Approaches

## Approach 1: Hash Map + Dynamic Array (Optimal) ✅ Recommended
This approach combines a dictionary for O(1) lookups and a list for O(1) random access.

## Approach 2: Balanced BST
A balanced BST (like TreeSet in Java or ordered map in C++) can also achieve O(log n) for insert and delete, with O(1) for getRandom if combined with an array.

### Algorithm Steps

1. Use a balanced BST (TreeMap in Java, std::map in C++) for ordered operations
2. Maintain a list for random access
3. On insert: Add to both BST and list
4. On remove: Remove from BST (O(log n)) and swap-pop from list (O(1))
5. On getRandom: O(1) from list

### Why It Works

Balanced BSTs maintain elements in sorted order and provide O(log n) operations. Combined with a list for random access, we get O(1) getRandom while maintaining O(log n) insert/delete.

### Code Implementation

````carousel
```python
# Note: Python doesn't have built-in balanced BST
# Use sortedcontainers library or implement your own
from sortedcontainers import SortedList
import random

class RandomizedSet:
    def __init__(self):
        self.items = SortedList()  # Balanced BST
        self.val_to_index = {}
    
    def insert(self, val: int) -> bool:
        if val in self.val_to_index:
            return False
        idx = len(self.items)
        self.items.add(val)
        self.val_to_index[val] = idx
        return True
    
    def remove(self, val: int) -> bool:
        if val not in self.val_to_index:
            return False
        idx = self.val_to_index[val]
        # Note: This is simplified; actual implementation needs care
        del self.val_to_index[val]
        self.items.discard(val)
        return True
    
    def getRandom(self) -> int:
        return random.choice(self.items)
```

<!-- slide -->
```cpp
// C++ using std::set (balanced BST)
#include <unordered_map>
#include <set>
#include <vector>

class RandomizedSet {
private:
    std::unordered_map<int, int> valToIndex;
    std::vector<int> values;
    std::set<int> ordered;  // For ordered operations if needed
    
public:
    RandomizedSet() {}
    
    bool insert(int val) {
        if (valToIndex.find(val) != valToIndex.end()) {
            return false;
        }
        valToIndex[val] = values.size();
        values.push_back(val);
        ordered.insert(val);
        return true;
    }
    
    bool remove(int val) {
        if (valToIndex.find(val) == valToIndex.end()) {
            return false;
        }
        int index = valToIndex[val];
        int lastVal = values.back();
        
        values[index] = lastVal;
        valToIndex[lastVal] = index;
        
        valToIndex.erase(val);
        values.pop_back();
        ordered.erase(val);
        
        return true;
    }
    
    int getRandom() {
        int randomIndex = rand() % values.size();
        return values[randomIndex];
    }
};
```

<!-- slide -->
```java
// Java using TreeSet (balanced BST)
import java.util.*;

class RandomizedSet {
    private Map<Integer, Integer> valToIndex;
    private List<Integer> values;
    private TreeSet<Integer> ordered;  // Balanced BST
    private Random random;
    
    public RandomizedSet() {
        valToIndex = new HashMap<>();
        values = new ArrayList<>();
        ordered = new TreeSet<>();
        random = new Random();
    }
    
    public boolean insert(int val) {
        if (valToIndex.containsKey(val)) {
            return false;
        }
        valToIndex.put(val, values.size());
        values.add(val);
        ordered.add(val);
        return true;
    }
    
    public boolean remove(int val) {
        if (!valToIndex.containsKey(val)) {
            return false;
        }
        
        int index = valToIndex.get(val);
        int lastVal = values.get(values.size() - 1);
        
        values.set(index, lastVal);
        valToIndex.put(lastVal, index);
        
        valToIndex.remove(val);
        values.remove(values.size() - 1);
        ordered.remove(val);
        
        return true;
    }
    
    public int getRandom() {
        return values.get(random.nextInt(values.size()));
    }
}
```

<!-- slide -->
```javascript
// JavaScript doesn't have built-in balanced BST
// Use Map for O(1) operations
class RandomizedSet {
    constructor() {
        this.valToIndex = new Map();
        this.values = [];
    }
    
    insert(val) {
        if (this.valToIndex.has(val)) {
            return false;
        }
        this.valToIndex.set(val, this.values.length);
        this.values.push(val);
        return true;
    }
    
    remove(val) {
        if (!this.valToIndex.has(val)) {
            return false;
        }
        
        const index = this.valToIndex.get(val);
        const lastVal = this.values[this.values.length - 1];
        
        this.values[index] = lastVal;
        this.valToIndex.set(lastVal, index);
        
        this.valToIndex.delete(val);
        this.values.pop();
        
        return true;
    }
    
    getRandom() {
        const randomIndex = Math.floor(Math.random() * this.values.length);
        return this.values[randomIndex];
    }
}
```
````

````carousel
```python
import random

class RandomizedSet:
    def __init__(self):
        # value -> index mapping
        self.val_to_index = {}
        # list to store values for O(1) random access
        self.values = []

    def insert(self, val: int) -> bool:
        if val in self.val_to_index:
            return False
        
        self.val_to_index[val] = len(self.values)
        self.values.append(val)
        return True

    def remove(self, val: int) -> bool:
        if val not in self.val_to_index:
            return False
        
        # Get index of value to remove
        index = self.val_to_index[val]
        # Get last value in list
        last_val = self.values[-1]
        
        # Move last value to position of value to remove
        self.values[index] = last_val
        self.val_to_index[last_val] = index
        
        # Remove from both data structures
        del self.val_to_index[val]
        self.values.pop()
        
        return True

    def getRandom(self) -> int:
        return random.choice(self.values)
```

<!-- slide -->
```cpp
#include <unordered_map>
#include <vector>
#include <cstdlib>
#include <ctime>

class RandomizedSet {
private:
    std::unordered_map<int, int> val_to_index;
    std::vector<int> values;
    
public:
    RandomizedSet() {
        srand(time(0));
    }
    
    bool insert(int val) {
        if (val_to_index.find(val) != val_to_index.end()) {
            return false;
        }
        val_to_index[val] = values.size();
        values.push_back(val);
        return true;
    }
    
    bool remove(int val) {
        if (val_to_index.find(val) == val_to_index.end()) {
            return false;
        }
        
        int index = val_to_index[val];
        int last_val = values.back();
        
        // Move last value to position of value to remove
        values[index] = last_val;
        val_to_index[last_val] = index;
        
        // Remove from both data structures
        val_to_index.erase(val);
        values.pop_back();
        
        return true;
    }
    
    int getRandom() {
        int random_index = rand() % values.size();
        return values[random_index];
    }
};
```

<!-- slide -->
```java
import java.util.*;

class RandomizedSet {
    private Map<Integer, Integer> valToIndex;
    private List<Integer> values;
    private Random random;
    
    public RandomizedSet() {
        valToIndex = new HashMap<>();
        values = new ArrayList<>();
        random = new Random();
    }
    
    public boolean insert(int val) {
        if (valToIndex.containsKey(val)) {
            return false;
        }
        valToIndex.put(val, values.size());
        values.add(val);
        return true;
    }
    
    public boolean remove(int val) {
        if (!valToIndex.containsKey(val)) {
            return false;
        }
        
        int index = valToIndex.get(val);
        int lastVal = values.get(values.size() - 1);
        
        // Move last value to position of value to remove
        values.set(index, lastVal);
        valToIndex.put(lastVal, index);
        
        // Remove from both data structures
        valToIndex.remove(val);
        values.remove(values.size() - 1);
        
        return true;
    }
    
    public int getRandom() {
        return values.get(random.nextInt(values.size()));
    }
}
```

<!-- slide -->
```javascript
class RandomizedSet {
    constructor() {
        this.valToIndex = new Map();
        this.values = [];
    }
    
    /**
     * Inserts a value to the set. Returns true if the set did not already contain the element.
     * @param {number} val
     * @return {boolean}
     */
    insert(val) {
        if (this.valToIndex.has(val)) {
            return false;
        }
        this.valToIndex.set(val, this.values.length);
        this.values.push(val);
        return true;
    }
    
    /**
     * Removes a value from the set. Returns true if the set contained the element.
     * @param {number} val
     * @return {boolean}
     */
    remove(val) {
        if (!this.valToIndex.has(val)) {
            return false;
        }
        
        const index = this.valToIndex.get(val);
        const lastVal = this.values[this.values.length - 1];
        
        // Move last value to position of value to remove
        this.values[index] = lastVal;
        this.valToIndex.set(lastVal, index);
        
        // Remove from both data structures
        this.valToIndex.delete(val);
        this.values.pop();
        
        return true;
    }
    
    /**
     * Get a random element from the set.
     * @return {number}
     */
    getRandom() {
        const randomIndex = Math.floor(Math.random() * this.values.length);
        return this.values[randomIndex];
    }
}
```
````

#### How It Works
1. **Initialization**: Create a dictionary for value-to-index mapping and a list for values
2. **Insert**: Check if value exists, then add to dictionary and list
3. **Remove**: If exists, swap with last element, update mapping, then remove from end
4. **Get Random**: Use random.choice for O(1) random access with equal probability

---

## Complexity Analysis

### Time Complexity
| Operation | Time Complexity |
|-----------|-----------------|
| `insert` | O(1) average |
| `remove` | O(1) average |
| `getRandom` | O(1) |

### Space Complexity
- O(n) where n is the number of elements in the set

### Why It's Average O(1)
- Hash map operations are average O(1)
- List append and pop from end are O(1)
- List index access is O(1)

---

## Common Pitfalls

### Edge Cases
1. **Inserting existing value**: Should return false
2. **Removing non-existing value**: Should return false
3. **Single element operations**: Insert, remove, and getRandom on single element
4. **Consecutive operations**: Insert followed by remove, or vice versa
5. **Large number of operations**: Up to 2 * 10^5 calls

### Common Mistakes
1. **Not handling duplicate insertions**
2. **Forgetting to update the hash map when swapping elements**
3. **Not removing the element from both data structures**
4. **Using inefficient removal methods that cause O(n) time**

---

## Why This Problem is Important

### Interview Relevance
- **Frequency**: Commonly asked in system design and data structure interviews
- **Companies**: Amazon, Microsoft, Google, Facebook, Uber
- **Difficulty**: Medium, tests data structure combination
- **Variations**: Leads to problems like "Insert Delete GetRandom O(1) - Duplicates allowed"

### Learning Outcomes
1. **Data Structure Combination**: Learn to combine hash maps and dynamic arrays
2. **Algorithm Design**: Design O(1) operations with swap-and-pop technique
3. **Randomization**: Understand equal probability random selection
4. **Performance Analysis**: Analyze average vs worst-case time complexity

---

## Related Problems

### Same Pattern (Data Structure Combination)
| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Insert Delete GetRandom O(1) - Duplicates allowed](/solutions/insert-delete-getrandom-o1-duplicates.md) | 381 | Hard | Allow duplicates |
| [Design Hashmap](/solutions/design-hashmap.md) | 706 | Easy | Implement hash map |
| [Design HashSet](/solutions/design-hashset.md) | 705 | Easy | Implement hash set |

### Similar Concepts
| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Random Pick with Weight](/solutions/random-pick-with-weight.md) | 528 | Medium | Weighted random selection |
| [Shuffle an Array](/solutions/shuffle-an-array.md) | 384 | Medium | Fisher-Yates shuffle |
| [Design Skiplist](/solutions/design-skiplist.md) | 1206 | Hard | Advanced data structure |

---

## Video Tutorial Links

### Recommended Tutorials
1. **[Insert Delete GetRandom O(1) - NeetCode](https://www.youtube.com/watch?v=j4KwhBziOpg)**
   - Clear explanation of data structure combination
   - Step-by-step walkthrough
   - Edge case coverage

2. **[LeetCode 380 - RandomizedSet](https://www.youtube.com/watch?v=UqrcuLv3BnA)**
   - Implementation details in Python
   - Time and space complexity analysis
   - Common mistakes to avoid

3. **[Data Structures Explained - Hash Map + Array](https://www.youtube.com/watch?v=jZOou55kI7E)**
   - Visual explanation of the combination approach
   - Why this works for all operations

### Additional Resources
- **[Hash Map (Dictionary) in Python](https://docs.python.org/3/tutorial/datastructures.html#dictionaries)** - Official Python documentation
- **[Random Module in Python](https://docs.python.org/3/library/random.html)** - Random number generation
- **[LeetCode Discuss](https://leetcode.com/problems/insert-delete-getrandom-o1/discuss/)** - Community solutions and tips

---

## Follow-up Questions

### Basic Level
1. **What data structures are used and why?**
   - Hash map for O(1) lookups, list for O(1) random access

2. **Why do we swap with the last element when removing?**
   - To avoid shifting all elements, maintaining O(1) time

3. **How does getRandom ensure equal probability?**
   - Uses random.choice which gives each element equal probability

### Intermediate Level
4. **What if we need to allow duplicates?**
   - Modify the value in the dictionary to store a list of indices

5. **How would you handle very large values?**
   - The current implementation handles large values fine

6. **What's the worst-case time complexity?**
   - In Python, dictionary operations can be O(n) in worst case due to hash collisions

### Advanced Level
7. **How would you implement this in a language without built-in hash maps?**
   - Implement a hash map with linked lists or other collision resolution

8. **What if you need to support more operations like getMin or getMax?**
   - You might need to add additional data structures like heaps or balanced BSTs

9. **How does this compare to using a built-in set?**
   - Built-in sets don't support O(1) random access

### Practical Implementation Questions
10. **How would you test this implementation?**
    - Test all edge cases, randomness properties, and performance

11. **What if the random number generator is not reliable?**
    - Use a secure random number generator if needed

12. **How would you handle concurrent access?**
    - Use locks or other synchronization mechanisms

---

## Summary
The **Insert Delete GetRandom O(1)** problem demonstrates the power of combining data structures to achieve optimal operations:

1. **Hash Map for Lookups**: O(1) time for insert and delete operations
2. **Dynamic Array for Random Access**: O(1) time for getRandom with equal probability
3. **Swap-and-Pop Technique**: Efficient removal without shifting elements
4. **Average O(1) Time**: All operations are average O(1) time complexity

This approach is commonly used in various applications that require fast insertions, deletions, and random access to elements, such as in game development, caching systems, and randomized algorithms.
