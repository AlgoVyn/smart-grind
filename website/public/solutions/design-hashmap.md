# Design Hashmap

## Problem Description
Design a HashMap without using any built-in hash table libraries.
Implement the MyHashMap class:

- `MyHashMap()` initializes the object with an empty map.
- `void put(int key, int value)` inserts a (key, value) pair into the HashMap. If the key already exists in the map, update the corresponding value.
- `int get(int key)` returns the value to which the specified key is mapped, or -1 if this map contains no mapping for the key.
- `void remove(key)` removes the key and its corresponding value if the map contains the mapping for the key.

## Examples

**Input:**
```python
["MyHashMap", "put", "put", "get", "get", "put", "get", "remove", "get"]
[[], [1, 1], [2, 2], [1], [3], [2, 1], [2], [2], [2]]
```

**Output:**
```python
[null, null, null, 1, -1, null, 1, null, -1]
```

## Constraints

- `0 <= key, value <= 10^6`
- At most `10^4` calls will be made to put, get, and remove.

## Solution

```python
# Python solution
class MyHashMap:

    def __init__(self):
        self.size = 1000001
        self.data = [-1] * self.size

    def put(self, key: int, value: int) -> None:
        self.data[key] = value

    def get(self, key: int) -> int:
        return self.data[key]

    def remove(self, key: int) -> None:
        self.data[key] = -1
```

## Explanation
Since keys are from 0 to 10^6, we use a fixed-size array of size 1000001, initialized to -1 (indicating no mapping).

- `put`: Set the value at index key.
- `get`: Return the value at index key, which is -1 if not present.
- `remove`: Set to -1.

Time complexity: O(1) for all operations.
Space complexity: O(10^6), which is acceptable.
