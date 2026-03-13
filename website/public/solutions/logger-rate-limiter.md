# Logger Rate Limiter

## Problem Description

Design a logger system that receives a stream of messages along with their timestamps. Each unique message should only be printed at most every 10 seconds (i.e., a message printed at timestamp t will prevent other identical messages from being printed until timestamp t + 10).

All messages will come in chronological order. Several messages may arrive at the same timestamp.

Implement the `Logger` class:

- `Logger()` — Initializes the logger object.
- `bool shouldPrintMessage(int timestamp, string message)` — Returns `true` if the message should be printed in the given timestamp, otherwise returns `false`.

---

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

**Explanation:**
- timestamp 1: "foo" - printed, returns true
- timestamp 2: "bar" - printed, returns true
- timestamp 3: "foo" - 3-1 < 10, not printed, returns false
- timestamp 8: "bar" - 8-2 < 10, not printed, returns false
- timestamp 10: "foo" - 10-1 >= 10, printed, returns true
- timestamp 11: "foo" - 11-10 < 10, not printed, returns false

---

## Constraints

- `1 <= timestamp <= 10^9`
- Every timestamp will be passed in non-decreasing order (chronological order).
- `1 <= message.length <= 30`
- At most `10^4` calls will be made to `shouldPrintMessage`.

---

## Pattern:

This problem follows the **Hash Map + Timestamp Tracking** pattern, commonly used in rate limiting, caching, and time-based deduplication problems.

### Core Concept

- Store **last seen timestamp** for each unique key (message)
- Compare current timestamp with stored timestamp to determine if action is allowed
- Since timestamps are guaranteed to be non-decreasing, simple comparison suffices

### When to Use This Pattern

This pattern is applicable when:
1. Rate limiting based on time intervals
2. Deduplication based on time windows
3. Tracking last occurrence of items
4. Cache invalidation problems
5. Any problem requiring "seen within time X" logic

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Queue-Based Sliding Window | Track all timestamps in a time window |
| Counter-Based Fixed Window | Count requests in fixed time intervals |
| Token Bucket | Allow bursts with rate limiting |

---

## Intuition

The key insight is to track when each message was last printed. For each incoming message:

1. Check if the message has been seen before
2. If not seen or enough time has passed (>= 10 seconds), print it and update the timestamp
3. Otherwise, don't print it

The chronological order of timestamps simplifies the problem - we don't need to worry about out-of-order messages.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Hash Map (Optimal)** - Simple dictionary-based solution
2. **Hash Map with Cleanup** - Remove old entries to save memory
3. **Queue-Based Approach** - Alternative design using queues

---

## Approach 1: Hash Map (Optimal)

Use a dictionary to store the last timestamp each message was printed.

### Algorithm Steps

1. Use a dictionary to store message → last printed timestamp
2. For each `shouldPrintMessage(timestamp, message)`:
   - If message not in dict OR timestamp - last_timestamp >= 10:
     - Update dict with current timestamp
     - Return true
   - Else:
     - Return false

### Why It Works

Since timestamps are in non-decreasing order, we only need to check if the time since the last print is at least 10 seconds. The dictionary provides O(1) lookups.

### Code Implementation

````carousel
```python
class Logger:
    def __init__(self):
        """
        Initialize your data structure here.
        """
        self.message_to_time = {}

    def shouldPrintMessage(self, timestamp: int, message: str) -> bool:
        """
        Returns true if the message should be printed in the given timestamp, otherwise returns false.
        If method is called multiple times with the same message and timestamp, return false.
        
        Args:
            timestamp: Current timestamp
            message: Message to check
            
        Returns:
            True if message should be printed, False otherwise
        """
        # Check if message can be printed
        if message not in self.message_to_time:
            # Never seen before - can print
            self.message_to_time[message] = timestamp
            return True
        
        # Check if enough time has passed
        if timestamp - self.message_to_time[message] >= 10:
            self.message_to_time[message] = timestamp
            return True
        
        return False
```

<!-- slide -->
```cpp
class Logger {
private:
    unordered_map<string, int> msgTime;
    
public:
    /** Initialize your data structure here. */
    Logger() {
        
    }
    
    /** Returns true if the message should be printed in the given timestamp, otherwise returns false.
        If this method returns false, the message will not be printed. */
    bool shouldPrintMessage(int timestamp, string message) {
        if (msgTime.find(message) == msgTime.end() || timestamp - msgTime[message] >= 10) {
            msgTime[message] = timestamp;
            return true;
        }
        return false;
    }
};
```

<!-- slide -->
```java
class Logger {
    private Map<String, Integer> msgTime;
    
    public Logger() {
        msgTime = new HashMap<>();
    }
    
    /** Returns true if the message should be printed in the given timestamp, otherwise returns false.
        If this method returns false, the message will not be printed. */
    public boolean shouldPrintMessage(int timestamp, String message) {
        Integer lastTime = msgTime.get(message);
        if (lastTime == null || timestamp - lastTime >= 10) {
            msgTime.put(message, timestamp);
            return true;
        }
        return false;
    }
}
```

<!-- slide -->
```javascript
/**
 * Initialize your data structure here.
 */
var Logger = function() {
    this.messageToTime = {};
};

/**
 * Returns true if the message should be printed in the given timestamp, otherwise returns false.
 * If this method returns false, the message will not be printed.
 * @param {number} timestamp 
 * @param {string} message
 * @return {boolean}
 */
Logger.prototype.shouldPrintMessage = function(timestamp, message) {
    const lastTime = this.messageToTime[message];
    
    if (lastTime === undefined || timestamp - lastTime >= 10) {
        this.messageToTime[message] = timestamp;
        return true;
    }
    
    return false;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) for each call - dictionary operations |
| **Space** | O(M) - where M is number of unique messages |

---

## Approach 2: Hash Map with Cleanup

Remove old entries to prevent unbounded memory growth.

### Algorithm Steps

1. Same as Approach 1
2. Additionally, clean up old entries when the dictionary gets too large or periodically

### Why It Works

In long-running systems, old messages might never be used again. Cleaning them prevents memory leaks.

### Code Implementation

````carousel
```python
class Logger:
    def __init__(self):
        self.message_to_time = {}
        self.rate_limit = 10

    def shouldPrintMessage(self, timestamp: int, message: str) -> bool:
        # Periodic cleanup: remove entries older than rate_limit
        if len(self.message_to_time) > 100:
            self.message_to_time = {
                msg: t for msg, t in self.message_to_time.items()
                if timestamp - t < self.rate_limit
            }
        
        if message not in self.message_to_time or timestamp - self.message_to_time[message] >= self.rate_limit:
            self.message_to_time[message] = timestamp
            return True
        return False
```

<!-- slide -->
```cpp
class Logger {
private:
    unordered_map<string, int> msgTime;
    const int RATE_LIMIT = 10;
    
public:
    Logger() {}
    
    bool shouldPrintMessage(int timestamp, string message) {
        // Cleanup old entries periodically
        if (msgTime.size() > 100) {
            for (auto it = msgTime.begin(); it != msgTime.end(); ) {
                if (timestamp - it->second >= RATE_LIMIT) {
                    it = msgTime.erase(it);
                } else {
                    ++it;
                }
            }
        }
        
        auto it = msgTime.find(message);
        if (it == msgTime.end() || timestamp - it->second >= RATE_LIMIT) {
            msgTime[message] = timestamp;
            return true;
        }
        return false;
    }
};
```

<!-- slide -->
```java
class Logger {
    private Map<String, Integer> msgTime;
    private static final int RATE_LIMIT = 10;
    
    public Logger() {
        msgTime = new HashMap<>();
    }
    
    public boolean shouldPrintMessage(int timestamp, String message) {
        // Cleanup if map gets too large
        if (msgTime.size() > 100) {
            msgTime.entrySet().removeIf(e -> timestamp - e.getValue() >= RATE_LIMIT);
        }
        
        Integer lastTime = msgTime.get(message);
        if (lastTime == null || timestamp - lastTime >= RATE_LIMIT) {
            msgTime.put(message, timestamp);
            return true;
        }
        return false;
    }
}
```

<!-- slide -->
```javascript
class Logger {
    constructor() {
        this.messageToTime = {};
        this.rateLimit = 10;
    }
    
    shouldPrintMessage(timestamp, message) {
        // Periodic cleanup
        if (Object.keys(this.messageToTime).length > 100) {
            for (const msg in this.messageToTime) {
                if (timestamp - this.messageToTime[msg] >= this.rateLimit) {
                    delete this.messageToTime[msg];
                }
            }
        }
        
        const lastTime = this.messageToTime[message];
        if (lastTime === undefined || timestamp - lastTime >= this.rateLimit) {
            this.messageToTime[message] = timestamp;
            return true;
        }
        return false;
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) amortized for each call |
| **Space** | O(M) - bounded by cleanup |

---

## Approach 3: Queue-Based Approach

Alternative design using queues for each message.

### Algorithm Steps

1. Maintain a queue for each message
2. When a message arrives, add timestamp to queue
3. Remove old timestamps (> 10 seconds old) from front
4. If queue is empty → print message, else skip

### Code Implementation

````carousel
```python
from collections import defaultdict, deque

class Logger:
    def __init__(self):
        self.message_queues = defaultdict(deque)
        self.rate_limit = 10

    def shouldPrintMessage(self, timestamp: int, message: str) -> bool:
        queue = self.message_queues[message]
        
        # Remove old timestamps
        while queue and timestamp - queue[0] >= self.rate_limit:
            queue.popleft()
        
        if not queue:
            queue.append(timestamp)
            return True
        return False
```

<!-- slide -->
```cpp
class Logger {
private:
    unordered_map<string, queue<int>> msgQueues;
    const int RATE_LIMIT = 10;
    
public:
    bool shouldPrintMessage(int timestamp, string message) {
        auto& q = msgQueues[message];
        
        while (!q.empty() && timestamp - q.front() >= RATE_LIMIT) {
            q.pop();
        }
        
        if (q.empty()) {
            q.push(timestamp);
            return true;
        }
        return false;
    }
};
```

<!-- slide -->
```java
class Logger {
    private Map<String, Deque<Integer>> msgQueues;
    private static final int RATE_LIMIT = 10;
    
    public Logger() {
        msgQueues = new HashMap<>();
    }
    
    public boolean shouldPrintMessage(int timestamp, String message) {
        Deque<Integer> queue = msgQueues.computeIfAbsent(message, k -> new LinkedList<>());
        
        while (!queue.isEmpty() && timestamp - queue.peekFirst() >= RATE_LIMIT) {
            queue.pollFirst();
        }
        
        if (queue.isEmpty()) {
            queue.addLast(timestamp);
            return true;
        }
        return false;
    }
}
```

<!-- slide -->
```javascript
class Logger {
    constructor() {
        this.messageQueues = new Map();
        this.rateLimit = 10;
    }
    
    shouldPrintMessage(timestamp, message) {
        let queue = this.messageQueues.get(message);
        if (!queue) {
            queue = [];
            this.messageQueues.set(message, queue);
        }
        
        // Remove old timestamps
        while (queue.length > 0 && timestamp - queue[0] >= this.rateLimit) {
            queue.shift();
        }
        
        if (queue.length === 0) {
            queue.push(timestamp);
            return true;
        }
        return false;
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) amortized - queue operations |
| **Space** | O(M) - one queue per message |

---

## Comparison of Approaches

| Aspect | Hash Map | Hash Map + Cleanup | Queue-Based |
|--------|----------|-------------------|-------------|
| **Time Complexity** | O(1) | O(1) amortized | O(1) amortized |
| **Space Complexity** | O(M) | O(M) bounded | O(M) |
| **Implementation** | Simplest | Moderate | Complex |
| **Memory** | Unbounded | Bounded | Unbounded |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ❌ No |

**Best Approach:** Hash Map approach is optimal for most cases due to its simplicity and efficiency.

---

## Related Problems

Based on similar themes (rate limiting, hash maps, caching):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Design HashMap | [Link](https://leetcode.com/problems/design-hashmap/) | Basic hash map design |
| Design HashSet | [Link](https://leetcode.com/problems/design-hashset/) | Basic hash set design |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| LRU Cache | [Link](https://leetcode.com/problems/lru-cache/) | Least Recently Used cache |
| LFUCache | [Link](https://leetcode.com/problems/lfu-cache/) | Least Frequently Used cache |
| Design Log Storage System | [Link](https://leetcode.com/problems/design-log-storage-system/) | Log storage with queries |

### Design Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Design TinyURL | [Link](https://leetcode.com/problems/design-tinyurl/) | URL shortening service |
| Design Hit Counter | [Link](https://leetcode.com/problems/design-hit-counter/) | Hit counter design |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### NeetCode Solutions

- [Logger Rate Limiter - NeetCode](https://www.youtube.com/watch?v=7Y4WzqGG5Qk) - Clear explanation
- [Hash Map Approach](https://www.youtube.com/watch?v=m0vY2D6EuqU) - Detailed walkthrough

### Other Tutorials

- [Back to Back SWE - Logger Rate Limiter](https://www.youtube.com/watch?v=o-1ehrVJ3hI) - Comprehensive explanation
- [LeetCode Official Solution](https://www.youtube.com/watch?v=N3AkSS5hXMA) - Official problem solution

---

## Follow-up Questions

### Q1: How would you modify for a different rate limit (e.g., 5 seconds)?

**Answer:** Simply change the hardcoded value 10 to a configurable rate_limit parameter in the constructor. Make it a class variable that can be set during initialization.

---

### Q2: What if messages can arrive out of chronological order?

**Answer:** You would need to store all timestamps (not just the last one) and check if ANY of them allows printing. This changes from O(1) to potentially O(n) for each query.

---

### Q3: How would you handle case-insensitive messages?

**Answer:** Convert the message to lowercase before storing/looking up in the dictionary: `message = message.lower()`.

---

### Q4: How would you make the solution thread-safe?

**Answer:** Use synchronization mechanisms:
- Python: threading.Lock()
- Java: synchronized keyword or ReentrantLock
- C++: std::mutex

---

### Q5: What if you need to rate limit by user ID?

**Answer:** Use a nested dictionary: `user_messages[user_id][message] = timestamp`. This allows per-user rate limiting.

---

### Q6: How would you implement a sliding window rate limiter?

**Answer:** Use a queue approach (Approach 3) or maintain counts in a fixed time window. Each incoming request checks the count in the last N seconds.

---

### Q7: What if you need to track rate limit over a moving time window?

**Answer:** Use a queue to store all timestamps within the window. Remove timestamps outside the window, then check queue size against the limit.

---

### Q8: How would you handle very high message volume?

**Answer:**
- Use efficient hash functions
- Consider memory-mapped data structures
- Use cleanup strategies to prevent memory growth
- Consider distributed rate limiting for multiple servers

---

## Common Pitfalls

### 1. Not Handling Same Timestamp
**Issue**: Not handling the case where same message arrives at same timestamp.

**Solution**: The problem guarantees timestamps are non-decreasing; handle duplicates properly.

### 2. Using Wrong Comparison Operator
**Issue**: Using > instead of >= for time check.

**Solution**: Use `timestamp - last_time >= 10` to allow printing at exactly t+10.

### 3. Memory Leak from Unbounded Dictionary
**Issue**: Dictionary grows indefinitely with new messages.

**Solution**: Use cleanup approach to remove old entries periodically.

### 4. Not Checking Message Existence First
**Issue**: Trying to access timestamp of message that doesn't exist.

**Solution**: Check if message exists in dictionary before accessing its timestamp.

### 5. Race Conditions in Multi-threaded Environment
**Issue**: Not handling concurrent access to the logger.

**Solution**: Use thread-safe data structures or add locks.

---

## Summary

The **Logger Rate Limiter** problem demonstrates efficient design using hash maps:

- **Hash Map approach**: O(1) time and space - optimal
- **Hash Map with cleanup**: Bounded memory usage
- **Queue-based approach**: Alternative design pattern

Key insights:
1. Store last printed timestamp per message
2. Simple comparison for rate limiting
3. Chronological timestamps simplify the problem

This problem is excellent for understanding hash map usage, rate limiting, and system design fundamentals.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/logger-rate-limiter/discuss/) - Community solutions
- [Rate Limiting - Wikipedia](https://en.wikipedia.org/wiki/Rate_limiting) - Theoretical background
- [Hash Map Design](/patterns/hash-map-design) - Comprehensive guide
