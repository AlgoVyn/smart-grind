# Time Based Key Value Store

## Problem Description

Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the key's value at a certain timestamp.

Implement the TimeMap class:

- `TimeMap()` Initializes the object of the data structure.
- `void set(String key, String value, int timestamp)` Stores the key `key` with the value `value` at the given time `timestamp`.
- `String get(String key, int timestamp)` Returns a value such that `set` was called previously, with `timestamp_prev <= timestamp`. If there are multiple such values, it returns the value associated with the largest `timestamp_prev`. If there are no values, it returns `""`.

**Example 1:**

Input:
```python
["TimeMap", "set", "get", "get", "set", "get", "get"]
[[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]
```python
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

## Constraints

- `1 <= key.length, value.length <= 100`
- `key` and `value` consist of lowercase English letters and digits.
- `1 <= timestamp <= 10^7`
- All the timestamps `timestamp` of `set` are strictly increasing.
- At most `2 * 10^5` calls will be made to `set` and `get`.

## Solution

```python
class TimeMap:

    def __init__(self):
        self.store = {}  # key -> list of (timestamp, value)

    def set(self, key: str, value: str, timestamp: int) -> None:
        if key not in self.store:
            self.store[key] = []
        self.store[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        if key not in self.store:
            return ""
        values = self.store[key]
        # Binary search for the largest timestamp <= timestamp
        left, right = 0, len(values) - 1
        result = ""
        while left <= right:
            mid = (left + right) // 2
            if values[mid][0] <= timestamp:
                result = values[mid][1]
                left = mid + 1
            else:
                right = mid - 1
        return result
```

## Explanation

This problem requires implementing a time-based key-value store that supports setting values at specific timestamps and retrieving the value at or before a given timestamp.

### Approach

We use a hash map (dictionary in Python) where each key maps to a list of tuples, each tuple containing a timestamp and the corresponding value. Since timestamps are strictly increasing, the list remains sorted by timestamp.

- For the `set` operation: We append the `(timestamp, value)` pair to the list associated with the key. If the key doesn't exist, we create a new list.

- For the `get` operation: We perform a binary search on the list of timestamps for the key to find the largest timestamp that is less than or equal to the given timestamp. If found, return the associated value; otherwise, return an empty string.

### Step-by-Step Explanation

1. **Initialization**: Create an empty dictionary to store the key-value pairs.

2. **Set Operation:**
   - If the key is not in the dictionary, initialize an empty list for it.
   - Append the tuple `(timestamp, value)` to the list for the key.

3. **Get Operation:**
   - If the key is not in the dictionary, return `""`.
   - Use binary search to find the rightmost index where the timestamp in the list is <= the given timestamp.
   - If such an index exists, return the value at that index; else, return `""`.

### Time Complexity

- **Set**: O(1) amortized, as appending to a list is O(1).
- **Get**: O(log N) where N is the number of set operations for that key, due to binary search.

### Space Complexity

- O(N) where N is the total number of set operations, as we store all values.
