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

### Key Constraints
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

## Intuition
To achieve O(1) average time complexity for all operations, we need to combine two data structures:
1. **Hash Map (Dictionary)**: For O(1) insertions and deletions by value
2. **Dynamic Array (List)**: For O(1) access to random elements by index

Key insight: When removing, swap the element to be removed with the last element in the list, then remove from the end. This avoids shifting elements.

---

## Solution Approaches

### Approach 1: Hash Map + Dynamic Array (Optimal) ✅ Recommended
This approach combines a dictionary for O(1) lookups and a list for O(1) random access.

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

## Edge Cases and Common Pitfalls

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
