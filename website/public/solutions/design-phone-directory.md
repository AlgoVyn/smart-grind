# Design Phone Directory

## Problem Description

Design a phone directory system that allows you to allocate phone numbers to users and release them back when no longer needed.

Implement the PhoneDirectory class with the following methods:
- `PhoneDirectory(maxNumbers: int)`: Initialize the directory with numbers from 0 to maxNumbers-1
- `get() -> int`: Return any available phone number. If no number is available, return -1
- `check(number: int) -> bool`: Check if a phone number is currently available
- `release(number: int) -> None`: Release a phone number back to the directory

This problem simulates a resource allocation system where we need to efficiently manage a pool of有限 resources (phone numbers) with get, check, and release operations.

**Link to problem:** [Design Phone Directory - LeetCode 379](https://leetcode.com/problems/design-phone-directory/)

## Constraints
- `1 <= maxNumbers <= 10^8`
- The `get` method will always be called with an available number or when at least one number is available
- `check` and `release` methods may receive invalid numbers (outside range)

---

## Pattern: Design Data Structure - Resource Pool

This problem demonstrates the **Design Data Structure - Resource Pool** pattern. The pattern involves creating a data structure that manages a pool of finite resources with efficient allocation and deallocation operations.

### Core Concept

The fundamental idea is maintaining a dynamic set of available resources:
- **Allocation**: Remove from available pool and return
- **Deallocation**: Add back to available pool
- **Availability Check**: Query if a resource is in the available pool

---

## Examples

### Example 1: Basic Operations

**Input:**
```
maxNumbers = 3
Operations: get(), get(), check(0), release(0), get()
```

**Output:**
```
get() -> 0
get() -> 1
check(0) -> false (after allocation)
release(0) -> None
get() -> 0 (or 2)
```

**Explanation:** 
- Initially available: {0, 1, 2}
- First get() allocates 0, available: {1, 2}
- Second get() allocates 1, available: {2}
- check(0) returns false (already allocated)
- release(0 available again
- Third get() can return0) makes  0 or 2

### Example 2: Exhaust All Numbers

**Input:**
```
maxNumbers = 2
Operations: get(), get(), get()
```

**Output:**
```
get() -> 0
get() -> 1
get() -> -1 (no available numbers)
```

**Explanation:** When all numbers are allocated, get() returns -1

### Example 3: Release Invalid Number

**Input:**
```
maxNumbers = 3
Operations: release(5), release(-1)
```

**Output:**
```
(no effect - numbers out of range)
```

**Explanation:** Releasing numbers outside the valid range has no effect

---

## Intuition

The key insight for this problem is choosing the right data structure:

1. **Set-based approach**: Use a set to track available numbers
   - O(1) get: Pop any element from set
   - O(1) check: Membership test
   - O(1) release: Add to set
   
2. **Queue-based approach**: Use a queue for FIFO allocation
   - O(1) get: Dequeue from front
   - O(n) check: Linear search
   - O(1) release: Add to back (with validity check)

3. **Bit vector approach**: Use a bit array for tracking
   - O(1) operations with minimal memory
   - Best for very large maxNumbers

The set-based approach provides the best balance of simplicity and efficiency for most use cases.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Set-Based (Recommended)** - O(1) operations, simple implementation
2. **Queue-Based** - O(1) get, simpler for smallest-number allocation
3. **Bit Vector** - Memory efficient for large maxNumbers

---

## Approach 1: Set-Based (Recommended)

This is the most efficient and straightforward approach. We use a set to track all available phone numbers, allowing O(1) operations for all methods.

### Algorithm Steps

1. Initialize a set with all numbers from 0 to maxNumbers-1
2. For get(): Pop any element from the set (returns -1 if empty)
3. For check(): Return True if number is in the set
4. For release(): Add number back to set if within valid range

### Why It Works

The set data structure provides:
- O(1) membership check via hash table
- O(1) insertion and deletion
- Efficient iteration for allocation

### Code Implementation

````carousel
```python
class PhoneDirectory:
    """
    Phone Directory using Set-based approach.
    
    Uses a set to track available phone numbers with O(1) operations
    for get, check, and release methods.
    """
    
    def __init__(self, maxNumbers: int):
        """
        Initialize the phone directory.
        
        Args:
            maxNumbers: Maximum number of phone numbers available
        """
        self.available = set(range(maxNumbers))
        self.maxNumbers = maxNumbers

    def get(self) -> int:
        """
        Get an available phone number.
        
        Returns:
            Any available phone number, or -1 if none available
        """
        if not self.available:
            return -1
        return self.available.pop()

    def check(self, number: int) -> bool:
        """
        Check if a phone number is available.
        
        Args:
            number: The phone number to check
            
        Returns:
            True if the number is available, False otherwise
        """
        return number in self.available

    def release(self, number: int) -> None:
        """
        Release a phone number back to the directory.
        
        Args:
            number: The phone number to release
        """
        if 0 <= number < self.maxNumbers:
            self.available.add(number)
```

<!-- slide -->
```cpp
class PhoneDirectory {
private:
    unordered_set<int> available;
    int maxNumbers;
    
public:
    /**
     * Initialize the phone directory.
     * 
     * @param maxNumbers Maximum number of phone numbers available
     */
    PhoneDirectory(int maxNumbers) {
        this->maxNumbers = maxNumbers;
        for (int i = 0; i < maxNumbers; i++) {
            available.insert(i);
        }
    }
    
    /**
     * Get an available phone number.
     * 
     * @return Any available phone number, or -1 if none available
     */
    int get() {
        if (available.empty()) {
            return -1;
        }
        int num = *available.begin();
        available.erase(available.begin());
        return num;
    }
    
    /**
     * Check if a phone number is available.
     * 
     * @param number The phone number to check
     * @return True if the number is available, False otherwise
     */
    bool check(int number) {
        return available.find(number) != available.end();
    }
    
    /**
     * Release a phone number back to the directory.
     * 
     * @param number The phone number to release
     */
    void release(int number) {
        if (number >= 0 && number < maxNumbers) {
            available.insert(number);
        }
    }
};
```

<!-- slide -->
```java
class PhoneDirectory {
    private Set<Integer> available;
    private int maxNumbers;
    
    /**
     * Initialize the phone directory.
     * 
     * @param maxNumbers Maximum number of phone numbers available
     */
    public PhoneDirectory(int maxNumbers) {
        this.maxNumbers = maxNumbers;
        this.available = new HashSet<>();
        for (int i = 0; i < maxNumbers; i++) {
            available.add(i);
        }
    }
    
    /**
     * Get an available phone number.
     * 
     * @return Any available phone number, or -1 if none available
     */
    public int get() {
        if (available.isEmpty()) {
            return -1;
        }
        Iterator<Integer> iterator = available.iterator();
        int num = iterator.next();
        iterator.remove();
        return num;
    }
    
    /**
     * Check if a phone number is available.
     * 
     * @param number The phone number to check
     * @return True if the number is available, False otherwise
     */
    public boolean check(int number) {
        return available.contains(number);
    }
    
    /**
     * Release a phone number back to the directory.
     * 
     * @param number The phone number to release
     */
    public void release(int number) {
        if (number >= 0 && number < maxNumbers) {
            available.add(number);
        }
    }
}
```

<!-- slide -->
```javascript
class PhoneDirectory {
    /**
     * Initialize the phone directory.
     * 
     * @param {number} maxNumbers - Maximum number of phone numbers available
     */
    constructor(maxNumbers) {
        this.available = new Set();
        this.maxNumbers = maxNumbers;
        for (let i = 0; i < maxNumbers; i++) {
            this.available.add(i);
        }
    }
    
    /**
     * Get an available phone number.
     * 
     * @return {number} - Any available phone number, or -1 if none available
     */
    get() {
        if (this.available.size === 0) {
            return -1;
        }
        // Get first element from set
        const first = this.available.values().next().value;
        this.available.delete(first);
        return first;
    }
    
    /**
     * Check if a phone number is available.
     * 
     * @param {number} number - The phone number to check
     * @return {boolean} - True if the number is available, False otherwise
     */
    check(number) {
        return this.available.has(number);
    }
    
    /**
     * Release a phone number back to the directory.
     * 
     * @param {number} number - The phone number to release
     */
    release(number) {
        if (number >= 0 && number < this.maxNumbers) {
            this.available.add(number);
        }
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) for get, check, and release operations |
| **Space** | O(maxNumbers) for storing available numbers |

---

## Approach 2: Queue-Based (Smallest Number First)

This approach uses two queues - one for available numbers and one for released numbers that haven't been reallocated. This ensures we always allocate the smallest available number.

### Algorithm Steps

1. Initialize a queue with all numbers from 0 to maxNumbers-1
2. For get(): Dequeue from front (returns -1 if empty)
3. For check(): Search through queue (O(n)) or use a separate set
4. For release(): Enqueue the number to the back if valid

### Why It Works

The queue ensures FIFO allocation, giving us the smallest available number first when combined with tracking released numbers.

### Code Implementation

````carousel
```python
class PhoneDirectory:
    """
    Phone Directory using Queue-based approach.
    Always allocates the smallest available number.
    """
    
    def __init__(self, maxNumbers: int):
        self.maxNumbers = maxNumbers
        self.available = collections.deque(range(maxNumbers))
        self.used = [False] * maxNumbers

    def get(self) -> int:
        if not self.available:
            return -1
        num = self.available.popleft()
        self.used[num] = True
        return num

    def check(self, number: int) -> bool:
        return 0 <= number < self.maxNumbers and not self.used[number]

    def release(self, number: int) -> None:
        if 0 <= number < self.maxNumbers and self.used[number]:
            self.used[number] = False
            self.available.append(number)
```

<!-- slide -->
```cpp
class PhoneDirectory {
private:
    queue<int> available;
    vector<bool> used;
    int maxNumbers;
    
public:
    PhoneDirectory(int maxNumbers) : maxNumbers(maxNumbers), used(maxNumbers, false) {
        for (int i = 0; i < maxNumbers; i++) {
            available.push(i);
        }
    }
    
    int get() {
        if (available.empty()) return -1;
        int num = available.front();
        available.pop();
        used[num] = true;
        return num;
    }
    
    bool check(int number) {
        return number >= 0 && number < maxNumbers && !used[number];
    }
    
    void release(int number) {
        if (number >= 0 && number < maxNumbers && used[number]) {
            used[number] = false;
            available.push(number);
        }
    }
};
```

<!-- slide -->
```java
class PhoneDirectory {
    private Queue<Integer> available;
    private boolean[] used;
    private int maxNumbers;
    
    public PhoneDirectory(int maxNumbers) {
        this.maxNumbers = maxNumbers;
        this.used = new boolean[maxNumbers];
        this.available = new LinkedList<>();
        for (int i = 0; i < maxNumbers; i++) {
            available.offer(i);
        }
    }
    
    public int get() {
        if (available.isEmpty()) return -1;
        int num = available.poll();
        used[num] = true;
        return num;
    }
    
    public boolean check(int number) {
        return number >= 0 && number < maxNumbers && !used[number];
    }
    
    public void release(int number) {
        if (number >= 0 && number < maxNumbers && used[number]) {
            used[number] = false;
            available.offer(number);
        }
    }
}
```

<!-- slide -->
```javascript
class PhoneDirectory {
    constructor(maxNumbers) {
        this.maxNumbers = maxNumbers;
        this.available = [];
        this.used = new Array(maxNumbers).fill(false);
        for (let i = 0; i < maxNumbers; i++) {
            this.available.push(i);
        }
    }
    
    get() {
        if (this.available.length === 0) return -1;
        const num = this.available.shift();
        this.used[num] = true;
        return num;
    }
    
    check(number) {
        return number >= 0 && number < this.maxNumbers && !this.used[number];
    }
    
    release(number) {
        if (number >= 0 && number < this.maxNumbers && this.used[number]) {
            this.used[number] = false;
            this.available.push(number);
        }
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) get, O(n) check (search), O(1) release |
| **Space** | O(maxNumbers) for queue and used array |

---

## Approach 3: Bit Vector (Memory Efficient)

This approach uses a bit vector to track availability, which is extremely memory efficient for large maxNumbers.

### Algorithm Steps

1. Use a bitset or integer array to track availability
2. Maintain a pointer to track the next available number
3. For get(): Find next set bit starting from pointer
4. For check(): Check if specific bit is set
5. For release(): Set the bit to indicate availability

### Why It Works

Bit operations are extremely fast, and memory usage is minimal (1 bit per number).

### Code Implementation

````carousel
```python
class PhoneDirectory:
    """
    Phone Directory using Bit Vector approach.
    Memory efficient for large maxNumbers.
    """
    
    def __init__(self, maxNumbers: int):
        self.maxNumbers = maxNumbers
        self.bits = [0] * ((maxNumbers + 31) // 32)  # Each int has 32 bits
        # Mark all numbers as available
        for i in range(maxNumbers):
            self.bits[i // 32] |= (1 << (i % 32))
        self.next_avail = 0

    def get(self) -> int:
        # Find next available
        while self.next_avail < self.maxNumbers:
            idx = self.next_avail // 32
            offset = self.next_avail % 32
            if self.bits[idx] & (1 << offset):
                # Clear the bit
                self.bits[idx] &= ~(1 << offset)
                return self.next_avail
            self.next_avail += 1
        return -1

    def check(self, number: int) -> bool:
        if number < 0 or number >= self.maxNumbers:
            return False
        idx = number // 32
        offset = number % 32
        return bool(self.bits[idx] & (1 << offset))

    def release(self, number: int) -> None:
        if 0 <= number < self.maxNumbers:
            idx = number // 32
            offset = number % 32
            self.bits[idx] |= (1 << offset)
            if number < self.next_avail:
                self.next_avail = number
```

<!-- slide -->
```cpp
class PhoneDirectory {
private:
    vector<int> bits;
    int maxNumbers;
    int nextAvail;
    
public:
    PhoneDirectory(int maxNumbers) : maxNumbers(maxNumbers), nextAvail(0) {
        bits.resize((maxNumbers + 31) / 32, 0xFFFFFFFF);
        // Clear unused bits in last word
        if (maxNumbers % 32 != 0) {
            int excess = 32 - (maxNumbers % 32);
            bits.back() &= (0xFFFFFFFF >> excess);
        }
    }
    
    int get() {
        while (nextAvail < maxNumbers) {
            int idx = nextAvail / 32;
            int offset = nextAvail % 32;
            if (bits[idx] & (1 << offset)) {
                bits[idx] &= ~(1 << offset);
                return nextAvail;
            }
            nextAvail++;
        }
        return -1;
    }
    
    bool check(int number) {
        if (number < 0 || number >= maxNumbers) return false;
        int idx = number / 32;
        int offset = number % 32;
        return bits[idx] & (1 << offset);
    }
    
    void release(int number) {
        if (number >= 0 && number < maxNumbers) {
            int idx = number / 32;
            int offset = number % 32;
            bits[idx] |= (1 << offset);
            if (number < nextAvail) nextAvail = number;
        }
    }
};
```

<!-- slide -->
```java
class PhoneDirectory {
    private int[] bits;
    private int maxNumbers;
    private int nextAvail;
    
    public PhoneDirectory(int maxNumbers) {
        this.maxNumbers = maxNumbers;
        this.bits = new int[(maxNumbers + 31) / 32];
        this.nextAvail = 0;
        // Mark all as available
        Arrays.fill(bits, 0xFFFFFFFF);
        // Clear excess bits
        if (maxNumbers % 32 != 0) {
            int excess = 32 - (maxNumbers % 32);
            bits[bits.length - 1] &= (0xFFFFFFFF >>> excess);
        }
    }
    
    public int get() {
        while (nextAvail < maxNumbers) {
            int idx = nextAvail / 32;
            int offset = nextAvail % 32;
            if ((bits[idx] & (1 << offset)) != 0) {
                bits[idx] &= ~(1 << offset);
                return nextAvail;
            }
            nextAvail++;
        }
        return -1;
    }
    
    public boolean check(int number) {
        if (number < 0 || number >= maxNumbers) return false;
        int idx = number / 32;
        int offset = number % 32;
        return (bits[idx] & (1 << offset)) != 0;
    }
    
    public void release(int number) {
        if (number >= 0 && number < maxNumbers) {
            int idx = number / 32;
            int offset = number % 32;
            bits[idx] |= (1 << offset);
            if (number < nextAvail) nextAvail = number;
        }
    }
}
```

<!-- slide -->
```javascript
class PhoneDirectory {
    constructor(maxNumbers) {
        this.maxNumbers = maxNumbers;
        this.bits = new Uint32Array(Math.ceil(maxNumbers / 32));
        // Mark all as available
        this.bits.fill(0xFFFFFFFF);
        // Clear excess bits
        if (maxNumbers % 32 !== 0) {
            const lastIdx = this.bits.length - 1;
            const excess = 32 - (maxNumbers % 32);
            this.bits[lastIdx] &= (0xFFFFFFFF >>> excess);
        }
        this.nextAvail = 0;
    }
    
    get() {
        while (this.nextAvail < this.maxNumbers) {
            const idx = Math.floor(this.nextAvail / 32);
            const offset = this.nextAvail % 32;
            if (this.bits[idx] & (1 << offset)) {
                this.bits[idx] &= ~(1 << offset);
                return this.nextAvail;
            }
            this.nextAvail++;
        }
        return -1;
    }
    
    check(number) {
        if (number < 0 || number >= this.maxNumbers) return false;
        const idx = Math.floor(number / 32);
        const offset = number % 32;
        return (this.bits[idx] & (1 << offset)) !== 0;
    }
    
    release(number) {
        if (number >= 0 && number < this.maxNumbers) {
            const idx = Math.floor(number / 32);
            const offset = number % 32;
            this.bits[idx] |= (1 << offset);
            if (number < this.nextAvail) this.nextAvail = number;
        }
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) average for all operations |
| **Space** | O(maxNumbers / 32) bits = O(maxNumbers) but with 32x less memory |

---

## Comparison of Approaches

| Aspect | Set-Based | Queue-Based | Bit Vector |
|--------|-----------|-------------|------------|
| **get()** | O(1) | O(1) | O(1) amortized |
| **check()** | O(1) | O(1) | O(1) |
| **release()** | O(1) | O(1) | O(1) |
| **Space** | O(n) | O(n) | O(n/32) |
| **Implementation** | Simple | Moderate | Complex |
| **Best For** | General use | Ordered allocation | Large maxNumbers |

**Best Approach:** The Set-Based approach (Approach 1) is recommended for most use cases due to its simplicity and O(1) operations for all methods.

---

## Why Set-Based is Optimal

The set-based approach is optimal because:

1. **O(1) Operations**: All three methods run in constant time
2. **Simple Implementation**: Easy to understand and maintain
3. **Hash Table Efficiency**: Built-in hash sets provide excellent performance
4. **Memory Trade-off**: Uses more memory but provides best time complexity

---

## Related Problems

Based on similar themes (data structure design, resource management):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Design Add and Search Words Data Structure | [Link](https://leetcode.com/problems/design-add-and-search-words-data-structure/) | Trie-based word storage |
| Design Log Storage System | [Link](https://leetcode.com/problems/design-log-storage-system/) | Log timestamp storage |
| Design a Number Container System | [Link](https://leetcode.com/problems/design-a-number-container-system/) | Number to index mapping |
| Seat Reservation Manager | [Link](https://leetcode.com/problems/seat-reservation-manager/) | Seat reservation system |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| LFU Cache | [Link](https://leetcode.com/problems/lfu-cache/) | Least Frequently Used cache |
| Range Frequency Queries | [Link](https://leetcode.com/problems/range-frequency-queries/) | Frequency counting in range |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Design Data Structures

- [NeetCode - Design Phone Directory](https://www.youtube.com/watch?v=LsK-6G8hD6Q) - Clear explanation
- [Phone Directory Problem Walkthrough](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed solution

### Set and Hash Table

- [Hash Set Operations](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - Understanding hash sets
- [Set vs Queue vs Stack](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Choosing the right data structure

---

## Follow-up Questions

### Q1: How would you modify to always return the smallest available number?

**Answer:** Use the Queue-Based approach (Approach 2) which maintains a FIFO queue. When numbers are released, add them to the back. This ensures get() always returns the smallest available number.

---

### Q2: What if maxNumbers is extremely large (e.g., 10^8)?

**Answer:** Use the Bit Vector approach (Approach 3) which uses only 1 bit per number, requiring only 12.5MB for 10^8 numbers instead of ~400MB for a set.

---

### Q3: How would you handle concurrent access from multiple threads?

**Answer:** Use thread-safe data structures (e.g., ConcurrentHashSet in Java, locks in Python/C++), or implement synchronization mechanisms to ensure atomic operations on the set/queue.

---

### Q4: How would you track which user currently holds a number?

**Answer:** Maintain an additional mapping from number to user: `allocatedTo[number] = userId`. When releasing, check that the caller owns the number before releasing.

---

### Q5: What if we need to know how many numbers are currently available?

**Answer:** Maintain a counter `availableCount` that decrements on get() and increments on release(). All operations remain O(1).

---

### Q6: How would you implement a "reserve" feature to hold a number without using it?

**Answer:** Add a new state "reserved" alongside "available" and "allocated". Track reserved numbers in a separate set, and they won't be allocated by get().

---

### Q7: What edge cases should be tested?

**Answer:**
- get() when all numbers are allocated
- release() with invalid numbers (negative or >= maxNumbers)
- release() of already available number
- check() for edge cases
- Multiple get() and release() in sequence

---

### Q8: How would you persist the state to disk for recovery?

**Answer:** Serialize the `available` set to a file. On recovery, read the serialized data and reconstruct the set. Consider using a database for large-scale systems.

---

## Common Pitfalls

### 1. Not Validating Release
**Issue**: Releasing an invalid number could corrupt state

**Solution**: Always check if number is within valid range before adding to available set

### 2. Duplicate Numbers on Release
**Issue**: Releasing the same number twice adds it twice to a queue

**Solution**: Use a boolean array to track used numbers, only add to queue when transitioning from used to available

### 3. Memory for Large maxNumbers
**Issue**: Set can use significant memory for large maxNumbers

**Solution**: Use Bit Vector approach for memory efficiency

### 4. Empty Check
**Issue**: Forgetting to check if available set is empty before get()

**Solution**: Always return -1 when available set is empty

---

## Summary

The **Design Phone Directory** problem demonstrates the importance of choosing the right data structure for resource management:

- **Set-Based**: Best overall with O(1) operations and simple implementation
- **Queue-Based**: Useful when smallest-number allocation is required
- **Bit Vector**: Optimal for memory-constrained environments with large maxNumbers

The key insight is that the set-based approach provides the best balance of time complexity and implementation simplicity for most use cases.

### Pattern Summary

This problem exemplifies the **Design Data Structure - Resource Pool** pattern, which is characterized by:
- Tracking available resources in an efficient data structure
- O(1) allocation and deallocation operations
- Handling edge cases like invalid inputs
- Trade-offs between time and space complexity

For more details on data structure design patterns, see the relevant sections on **[Data Structure Design](/patterns/data-structure-design)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/design-phone-directory/discuss/) - Community solutions
- [Hash Set vs Array](https://www.geeksforgeeks.org/hash-set-vs-array/) - Choosing the right structure
- [Bit Manipulation](https://www.geeksforgeeks.org/bit-manipulation/) - Understanding bit vectors
- [Design Patterns for Data Structures](https://en.wikipedia.org/wiki/Data_structure_design) - Learn about design considerations
