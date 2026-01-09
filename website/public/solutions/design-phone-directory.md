# Design Phone Directory

## Problem Description
Design a phone directory that allows you to allocate phone numbers and release them.

Implement the PhoneDirectory class with the following methods:
- `PhoneDirectory(maxNumbers: int)`: Initialize the directory with numbers from 0 to maxNumbers-1.
- `get() -> int`: Return any available phone number. If no number is available, return -1.
- `check(number: int) -> bool`: Check if a phone number is available.
- `release(number: int) -> None`: Release a phone number back to the directory.

---

## Examples

**Input:**
```python
maxNumbers = 3
```

**Output:**
```
# PhoneDirectory initialized with numbers [0, 1, 2]
```

---

## Constraints

- `1 <= maxNumbers <= 10^3`

---

## Solution

```python
class PhoneDirectory:

    def __init__(self, maxNumbers: int):
        self.available = set(range(maxNumbers))
        self.maxNumbers = maxNumbers

    def get(self) -> int:
        if not self.available:
            return -1
        num = self.available.pop()
        return num

    def check(self, number: int) -> bool:
        return number in self.available

    def release(self, number: int) -> None:
        if number < self.maxNumbers:
            self.available.add(number)
```

---

## Explanation
The PhoneDirectory class uses a set to keep track of available phone numbers. In the `__init__` method, we initialize the set with numbers from 0 to maxNumbers-1.

The `get` method returns the smallest available number by popping from the set, or -1 if none are available.

The `check` method returns True if the number is in the available set.

The `release` method adds the number back to the available set if it's within the range.

Time complexity: O(1) for get, check, and release operations.

Space complexity: O(maxNumbers) for the set.
