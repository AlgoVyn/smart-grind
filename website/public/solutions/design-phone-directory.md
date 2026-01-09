# Design Phone Directory

## Problem Description
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

## Explanation
The PhoneDirectory class uses a set to keep track of available phone numbers. In the `__init__` method, we initialize the set with numbers from 0 to maxNumbers-1.

The `get` method returns the smallest available number by popping from the set, or -1 if none are available.

The `check` method returns True if the number is in the available set.

The `release` method adds the number back to the available set if it's within the range.

Time complexity: O(1) for get, check, and release operations.

Space complexity: O(maxNumbers) for the set.
