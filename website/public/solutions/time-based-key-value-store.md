# Time Based Key Value Store

## Problem Description

Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the key's value at a certain timestamp.

This is a classic system design problem that requires implementing a time-series database with efficient lookup operations.

Implement the TimeMap class:

- `TimeMap()` Initializes the object of the data structure.
- `void set(String key, String value, int timestamp)` Stores the key `key` with the value `value` at the given time `timestamp`.
- `String get(String key, int timestamp)` Returns a value such that `set` was called previously, with `timestamp_prev <= timestamp`. If there are multiple such values, it returns the value associated with the largest `timestamp_prev`. If there are no values, it returns `""`.

**Link to problem:** [Time Based Key Value Store - LeetCode 981](https://leetcode.com/problems/time-based-key-value-store/)

## Examples

**Example 1:**

Input:
```python
["TimeMap", "set", "get", "get", "set", "get", "get"]
[[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]
```

Output:
```python
[null, null, "bar", "bar", null, "bar2", "bar2"]
```

Explanation:
```python
TimeMap timeMap = new TimeMap();
timeMap.set("foo", "bar", 1);  // store the key "foo" and value "bar" along with timestamp = 1.
timeMap.get("foo", 1);         // return "bar"
timeMap.get("foo", 3);         // return "bar", since there is no value corresponding to foo at timestamp 3 and timestamp 2, then the only value is at timestamp 1 is "bar".
timeMap.set("foo", "bar2", 4); // store the key "foo" and value "bar2" along with timestamp = 4.
timeMap.get("foo", 4);         // return "bar2"
timeMap.get("foo", 5);         // return "bar2"
```

### Example 2:

Input:
```python
["TimeMap", "set", "set", "get", "get", "get", "get", "get"]
[[], ["love", "high", 10], ["love", "low", 20], ["love", 5], ["love", 10], ["love", 15], ["love", 20], ["love", 100]]
```

Output:
```python
[null, null, null, "", "high", "high", "low", "low"]
```

---

## Constraints

- `1 <= key.length, value.length <= 100`
- `key` and `value` consist of lowercase English letters and digits.
- `1 <= timestamp <= 10^7`
- All the timestamps `timestamp` of `set` are strictly increasing.
- At most `2 * 10^5` calls will be made to `set` and `get`.

---

## Pattern: Binary Search on Sorted Data

This problem is a classic example of the **Binary Search on Sorted Data** pattern. Since timestamps are strictly increasing, we can efficiently search for the largest timestamp less than or equal to the given timestamp.

### Core Concept

The fundamental idea is maintaining sorted data for efficient querying:
- **Sorted Timestamps**: All timestamps for a key are stored in sorted order
- **Binary Search**: Efficiently find the largest timestamp ≤ given timestamp
- **Hash Map**: Store values for different keys

---

## Intuition

The key insight for this problem is understanding the query behavior:

1. **Timestamps are Sorted**: Since timestamps are strictly increasing, each key's timestamps form a sorted array
2. **Binary Search**: We can use binary search to find the largest timestamp ≤ target
3. **Two Data Structures**: HashMap for key lookup + sorted list for timestamp-value pairs
4. **Trade-off**: O(1) set (amortized) vs O(log N) get

### Why Binary Search?

- **Sorted Timestamps**: The constraint "strictly increasing timestamps" guarantees sorted order
- **Efficient Lookup**: Binary search provides O(log N) lookup vs O(N) linear scan
- **Scalability**: Works well with up to 200,000 operations

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **HashMap + Binary Search (Optimal)** - O(1) set, O(log N) get
2. **HashMap + Linear Scan** - O(1) set, O(N) get

---

## Approach 1: HashMap + Binary Search (Optimal)

This is the optimal approach using binary search for efficient lookups.

### Algorithm Steps

1. **Data Structure**: Use a HashMap where each key maps to a list of (timestamp, value) tuples
2. **Set Operation**: Append (timestamp, value) to the list for the key (O(1) amortized)
3. **Get Operation**: Use binary search to find the largest timestamp ≤ given timestamp
4. **Return Result**: Return the value at that index, or "" if not found

### Why It Works

- The timestamps are strictly increasing, so each list is always sorted
- Binary search finds the rightmost timestamp that doesn't exceed the query timestamp
- This gives us the most recent value that was set before or at the query time

### Code Implementation

````carousel
```python
from typing import List
import bisect

class TimeMap:
    def __init__(self):
        """
        Initialize the TimeMap data structure.
        Uses a dictionary to store key -> list of (timestamp, value) pairs.
        """
        self.store = {}  # key -> list of (timestamp, value)

    def set(self, key: str, value: str, timestamp: int) -> None:
        """
        Store a key-value pair with a timestamp.
        
        Args:
            key: The key to store
            value: The value to associate with the key
            timestamp: The timestamp for this entry
        """
        if key not in self.store:
            self.store[key] = []
        self.store[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        """
        Get the value for a key at a specific timestamp.
        
        Args:
            key: The key to look up
            timestamp: The timestamp to query
            
        Returns:
            The value at the largest timestamp <= timestamp, or "" if not found
        """
        if key not in self.store:
            return ""
        
        values = self.store[key]
        
        # Binary search for the largest timestamp <= timestamp
        # bisect_right returns the index where timestamp would be inserted
        # We subtract 1 to get the rightmost timestamp <= timestamp
        idx = bisect.bisect_right(values, (timestamp, chr(255))) - 1
        
        if idx >= 0:
            return values[idx][1]
        return ""
```

<!-- slide -->
```cpp
#include <string>
#include <unordered_map>
#include <vector>
#include <algorithm>
using namespace std;

class TimeMap {
private:
    unordered_map<string, vector<pair<int, string>>> store;
    
public:
    TimeMap() {
        // Initialize the data structure
    }
    
    void set(string key, string value, int timestamp) {
        /**
         * Store a key-value pair with a timestamp.
         * 
         * @param key: The key to store
         * @param value: The value to associate with the key
         * @param timestamp: The timestamp for this entry
         */
        store[key].push_back({timestamp, value});
    }
    
    string get(string key, int timestamp) {
        /**
         * Get the value for a key at a specific timestamp.
         * 
         * @param key: The key to look up
         * @param timestamp: The timestamp to query
         * @return: The value at the largest timestamp <= timestamp, or "" if not found
         */
        if (store.find(key) == store.end()) {
            return "";
        }
        
        const auto& values = store[key];
        
        // Binary search for the largest timestamp <= timestamp
        int left = 0, right = values.size() - 1;
        string result = "";
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (values[mid].first <= timestamp) {
                result = values[mid].second;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class TimeMap {
    private Map<String, List<Pair<Integer, String>>> store;
    
    public TimeMap() {
        store = new HashMap<>();
    }
    
    public void set(String key, String value, int timestamp) {
        /**
         * Store a key-value pair with a timestamp.
         * 
         * @param key: The key to store
         * @param value: The value to associate with the key
         * @param timestamp: The timestamp for this entry
         */
        store.computeIfAbsent(key, k -> new ArrayList<>()).add(new Pair<>(timestamp, value));
    }
    
    public String get(String key, int timestamp) {
        /**
         * Get the value for a key at a specific timestamp.
         * 
         * @param key: The key to look up
         * @param timestamp: The timestamp to query
         * @return: The value at the largest timestamp <= timestamp, or "" if not found
         */
        if (!store.containsKey(key)) {
            return "";
        }
        
        List<Pair<Integer, String>> values = store.get(key);
        
        // Binary search for the largest timestamp <= timestamp
        int left = 0, right = values.size() - 1;
        String result = "";
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (values.get(mid).getKey() <= timestamp) {
                result = values.get(mid).getValue();
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return result;
    }
    
    // Simple Pair class since Java doesn't have built-in Pair in older versions
    private static class Pair<K, V> {
        private K key;
        private V value;
        
        public Pair(K key, V value) {
            this.key = key;
            this.value = value;
        }
        
        public K getKey() { return key; }
        public V getValue() { return value; }
    }
}
```

<!-- slide -->
```javascript
/**
 * TimeMap constructor
 * @constructor
 */
var TimeMap = function() {
    /**
     * Initialize the TimeMap data structure.
     * Uses a Map to store key -> array of {timestamp, value} objects.
     */
    this.store = new Map();
};

/**
 * Store a key-value pair with a timestamp.
 * 
 * @param {string} key - The key to store
 * @param {string} value - The value to associate with the key
 * @param {number} timestamp - The timestamp for this entry
 */
TimeMap.prototype.set = function(key, value, timestamp) {
    if (!this.store.has(key)) {
        this.store.set(key, []);
    }
    this.store.get(key).push({ timestamp, value });
};

/**
 * Get the value for a key at a specific timestamp.
 * 
 * @param {string} key - The key to look up
 * @param {number} timestamp - The timestamp to query
 * @return {string} - The value at the largest timestamp <= timestamp, or "" if not found
 */
TimeMap.prototype.get = function(key, timestamp) {
    if (!this.store.has(key)) {
        return "";
    }
    
    const values = this.store.get(key);
    
    // Binary search for the largest timestamp <= timestamp
    let left = 0;
    let right = values.length - 1;
    let result = "";
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (values[mid].timestamp <= timestamp) {
            result = values[mid].value;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time (set)** | O(1) amortized - appending to a list |
| **Time (get)** | O(log N) - binary search on N timestamps |
| **Space** | O(N) - storing all key-value-timestamp pairs |

---

## Approach 2: HashMap + Linear Scan

This approach uses linear scan instead of binary search for simplicity.

### Algorithm Steps

1. **Data Structure**: Same as Approach 1
2. **Set Operation**: Same as Approach 1
3. **Get Operation**: Linear scan through timestamps to find the largest ≤ target
4. **Return Result**: Return the corresponding value

### Why It Works

Linear scan correctly finds the largest timestamp ≤ target, but is slower for large datasets.

### Code Implementation

````carousel
```python
class TimeMap:
    def __init__(self):
        self.store = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        if key not in self.store:
            self.store[key] = []
        self.store[key].append((timestamp, value))

    def get_linear(self, key: str, timestamp: int) -> str:
        """Linear scan approach - for comparison purposes."""
        if key not in self.store:
            return ""
        
        values = self.store[key]
        result = ""
        
        # Linear scan to find largest timestamp <= timestamp
        for ts, val in values:
            if ts <= timestamp:
                result = val
            else:
                break
        
        return result
```

<!-- slide -->
```cpp
class TimeMapLinear {
private:
    unordered_map<string, vector<pair<int, string>>> store;
    
public:
    string get(string key, int timestamp) {
        if (store.find(key) == store.end()) return "";
        
        const auto& values = store[key];
        string result = "";
        
        for (const auto& [ts, val] : values) {
            if (ts <= timestamp) {
                result = val;
            } else {
                break;
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class TimeMapLinear {
    private Map<String, List<Pair<Integer, String>>> store = new HashMap<>();
    
    public String get(String key, int timestamp) {
        if (!store.containsKey(key)) return "";
        
        List<Pair<Integer, String>> values = store.get(key);
        String result = "";
        
        for (Pair<Integer, String> p : values) {
            if (p.getKey() <= timestamp) {
                result = p.getValue();
            } else {
                break;
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
TimeMapLinear.prototype.get = function(key, timestamp) {
    if (!this.store.has(key)) return "";
    
    const values = this.store.get(key);
    let result = "";
    
    for (const { timestamp: ts, value } of values) {
        if (ts <= timestamp) {
            result = value;
        } else {
            break;
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time (set)** | O(1) amortized |
| **Time (get)** | O(N) - linear scan |
| **Space** | O(N) |

---

## Comparison of Approaches

| Aspect | Binary Search | Linear Scan |
|--------|--------------|-------------|
| **Set Time** | O(1) amortized | O(1) amortized |
| **Get Time** | O(log N) | O(N) |
| **Space** | O(N) | O(N) |
| **Implementation** | Moderate | Simple |
| **Best For** | Large datasets | Small datasets |

**Best Approach:** Binary search is optimal for this problem due to its O(log N) lookup time, which scales well with large datasets.

---

## Why Binary Search is Optimal for This Problem

The binary search approach is optimal because:

1. **Sorted Data Guarantee**: Timestamps are strictly increasing, ensuring sorted order
2. **Efficient Queries**: O(log N) get time vs O(N) for linear scan
3. **Simple Implementation**: Binary search is straightforward with built-in libraries
4. **Scalability**: Works well with up to 200,000 operations

The key insight is that the constraint "strictly increasing timestamps" gives us sorted data for free, enabling efficient binary search.

---

## Related Problems

Based on similar themes (binary search, time-series data, key-value stores):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Range Frequency Queries | [Link](https://leetcode.com/problems/range-frequency-queries/) | Find frequency in a range |
| Find K-th Smallest Pair Distance | [Link](https://leetcode.com/problems/find-k-th-smallest-pair-distance/) | Binary search on pairs |
| Search a 2D Matrix | [Link](https://leetcode.com/problems/search-a-2d-matrix/) | Binary search in 2D |
| Median of Two Sorted Arrays | [Link](https://leetcode.com/problems/median-of-two-sorted-arrays/) | Binary search optimization |

### System Design

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| LRU Cache | [Link](https://leetcode.com/problems/lru-cache/) | Least Recently Used cache |
| Logger Rate Limiter | [Link](https://leetcode.com/problems/logger-rate-limiter/) | Rate limiting with timestamps |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Binary Search Techniques

- [NeetCode - Time Based Key Value Store](https://www.youtube.com/watch?v=duy4zJ1g2b0) - Clear explanation
- [Binary Search Explained](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Complete binary search tutorial
- [Upper Bound / Lower Bound](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Bisect concepts

### System Design

- [Designing a Time Series Database](https://www.youtube.com/watch?v=qZ19postX1vQ) - System design perspective
- [HashMap Deep Dive](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - Understanding HashMap

---

## Follow-up Questions

### Q1: How would you handle non-increasing timestamps?

**Answer:** You would need to sort the timestamps before performing binary search, which would make set O(N log N) instead of O(1). Alternatively, use a balanced BST for O(log N) insertion.

---

### Q2: How would you implement get with a range (between timestamp1 and timestamp2)?

**Answer:** Use binary search twice: once to find the first timestamp >= timestamp1, and once to find the last timestamp <= timestamp2. Then collect all values in that range.

---

### Q3: How would you handle concurrent access (thread safety)?

**Answer:** Use locks (mutex) to synchronize access to the data structure. In Python, use threading.Lock; in Java, use synchronized blocks or ReentrantLock; in C++, use std::mutex.

---

### Q4: What data structure would you use for very high throughput?

**Answer:** Consider using a combination of in-memory structure with periodic persistence to disk. For extreme cases, consider a proper time-series database like InfluxDB or TimescaleDB.

---

### Q5: How would you implement eviction (remove old entries)?

**Answer:** Add a timestamp-based eviction policy. When storing, check if the number of entries exceeds a threshold, or if timestamps are older than a certain age, then remove oldest entries.

---

### Q6: How would you handle memory constraints?

**Answer:** Consider compressing older data, using memory-mapped files, or implementing a tiered storage system where recent data is in memory and older data is on disk.

---

### Q7: What are the trade-offs between binary search and balanced BST?

**Answer:** Binary search offers O(log N) lookup but O(N) insertion (if not sorted). Balanced BST offers O(log N) for both insertion and lookup, but with higher constant factor and more complex implementation.

---

## Common Pitfalls

### 1. Binary Search Implementation
**Issue:** Incorrect binary search logic can return wrong index.

**Solution:** Use the standard template: while left <= right, update mid, and track the best answer.

### 2. Empty Key Handling
**Issue:** Not checking if key exists before accessing.

**Solution:** Always check if key exists in the map before performing operations.

### 3. Timestamp Edge Cases
**Issue:** Query timestamp before any set timestamp.

**Solution:** Binary search correctly handles this by returning -1, then return "".

### 4. Using bisect Correctly
**Issue:** Python's bisect expects sorted list but with tuples, comparison is lexicographic.

**Solution:** Use bisect_right with a tuple (timestamp, high_value) to get the right insertion point.

---

## Summary

The **Time Based Key Value Store** problem demonstrates the combination of hash maps and binary search:

- **HashMap + Binary Search**: O(1) set, O(log N) get
- **Linear Scan**: O(1) set, O(N) get
- **Space**: O(N) for storing all entries

The key insight is leveraging the sorted timestamps constraint to enable efficient binary search. This problem is an excellent demonstration of combining data structures for optimal performance.

### Pattern Summary

This problem exemplifies the **Binary Search on Sorted Data** pattern, which is characterized by:
- Sorted data enabling efficient search
- O(log N) query time
- Trade-off between insertion and query complexity
- Applicable to time-series and versioned data

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/time-based-key-value-store/discuss/) - Community solutions
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Detailed explanation
- [Time Series Databases](https://en.wikipedia.org/wiki/Time_series_database) - Learn about time-series storage
- [Pattern: Binary Search on Sorted Array](/patterns/binary-search-on-sorted-array-list) - Comprehensive pattern guide
