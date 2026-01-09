# Logger Rate Limiter

## Problem Description

Design a logger system that receives a stream of messages along with their timestamps. Each unique message should only be printed at most every 10 seconds (i.e., a message printed at timestamp t will prevent other identical messages from being printed until timestamp t + 10).

All messages will come in chronological order. Several messages may arrive at the same timestamp.

Implement the `Logger` class:

- `Logger()` — Initializes the logger object.
- `bool shouldPrintMessage(int timestamp, string message)` — Returns `true` if the message should be printed in the given timestamp, otherwise returns `false`.

## Examples

**Example 1:**

**Input:**
```python
["Logger", "shouldPrintMessage", "shouldPrintMessage", "shouldPrintMessage", "shouldPrintMessage", "shouldPrintMessage", "shouldPrintMessage"]
[[], [1, "foo"], [2, "bar"], [3, "foo"], [8, "bar"], [10, "foo"], [11, "foo"]]
```

**Output:**
```python
[null, true, true, false, false, false, true]
```

## Constraints

- `1 <= timestamp <= 10^9`
- Every timestamp will be passed in non-decreasing order (chronological order).
- `1 <= message.length <= 30`
- At most `10^4` calls will be made to `shouldPrintMessage`.

## Solution

```python
class Logger:
    def __init__(self):
        self.message_to_time = {}

    def shouldPrintMessage(self, timestamp: int, message: str) -> bool:
        if message not in self.message_to_time or timestamp - self.message_to_time[message] >= 10:
            self.message_to_time[message] = timestamp
            return True
        return False
```

## Explanation

We use a dictionary to store the last timestamp each message was printed.

For each `shouldPrintMessage` call, check if the message is not in the dictionary or the current timestamp is at least 10 seconds after the last print time. If so, update the timestamp and return `true`; otherwise, return `false`.

## Complexity Analysis

- **Time Complexity:** `O(1)` for each call, as dictionary operations are `O(1)`.
- **Space Complexity:** `O(M)`, where `M` is the number of unique messages.
