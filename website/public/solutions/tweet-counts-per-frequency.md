# Tweet Counts Per Frequency

## Problem Description

A social media company is trying to monitor activity on their site by analyzing the number of tweets that occur in select periods of time. These periods can be partitioned into smaller time chunks based on a certain frequency (every minute, hour, or day).

This is a system design and data processing problem that requires efficient storage and querying of time-series data.

For example, the period `[10, 10000]` (in seconds) would be partitioned into the following time chunks with these frequencies:

- Every minute (60-second chunks): `[10,69]`, `[70,129]`, `[130,189]`, ..., `[9970,10000]`
- Every hour (3600-second chunks): `[10,3609]`, `[3610,7209]`, `[7210,10000]`
- Every day (86400-second chunks): `[10,10000]`

Notice that the last chunk may be shorter than the specified frequency's chunk size and will always end with the end time of the period (`10000` in the above example).

**Link to problem:** [Tweet Counts Per Frequency - LeetCode 1348](https://leetcode.com/problems/tweet-counts-per-frequency/)

Implement the TweetCounts class:

- `TweetCounts()` Initializes the TweetCounts object.
- `void recordTweet(String tweetName, int time)` Stores the `tweetName` at the recorded time (in seconds).
- `List<Integer> getTweetCountsPerFrequency(String freq, String tweetName, int startTime, int endTime)` Returns a list of integers representing the number of tweets with `tweetName` in each time chunk for given period and frequency.

`freq` is one of "minute", "hour", or "day" representing a frequency of every minute, hour, or day respectively.

## Examples

### Example

Input:
```python
["TweetCounts","recordTweet","recordTweet","recordTweet","getTweetCountsPerFrequency","getTweetCountsPerFrequency","recordTweet","getTweetCountsPerFrequency"]
[[],["tweet3",0],["tweet3",60],["tweet3",10],["minute","tweet3",0,59],["minute","tweet3",0,60],["tweet3",120],["hour","tweet3",0,210]]
```

Output:
```python
[null,null,null,null,[2],[2,1],null,[4]]
```

Explanation:
```python
TweetCounts tweetCounts = new TweetCounts();
tweetCounts.recordTweet("tweet3", 0);                              // New tweet "tweet3" at time 0
tweetCounts.recordTweet("tweet3", 60);                             // New tweet "tweet3" at time 60
tweetCounts.recordTweet("tweet3", 10);                             // New tweet "tweet3" at time 10
tweetCounts.getTweetCountsPerFrequency("minute", "tweet3", 0, 59); // return [2]; chunk [0,59] had 2 tweets
tweetCounts.getTweetCountsPerFrequency("minute", "tweet3", 0, 60); // return [2,1]; chunk [0,59] had 2 tweets, chunk [60,60] had 1 tweet
tweetCounts.recordTweet("tweet3", 120);                            // New tweet "tweet3" at time 120
tweetCounts.getTweetCountsPerFrequency("hour", "tweet3", 0, 210);  // return [4]; chunk [0,210] had 4 tweets
```

---

## Constraints

- `0 <= time, startTime, endTime <= 10^9`
- `0 <= endTime - startTime <= 10^4`
- There will be at most `10^4` calls in total to `recordTweet` and `getTweetCountsPerFrequency`.
- `freq` is one of "minute", "hour", and "day".

---

## Intuition

This problem is a classic example of the **Binary Search on Sorted Time Data** pattern. Since tweet times can be recorded in any order, we need to sort them for efficient querying.

### Core Concept

The fundamental idea is storing times efficiently and querying them with binary search:
- **Hash Map**: Store tweet times for each tweet name
- **Sorted Lists**: Maintain sorted timestamps for binary search
- **Binary Search**: Efficiently count tweets in each time chunk

---

## Pattern: Binary Search on Sorted Time Data

The key insight for this problem is efficient time-range counting:

1. **Store All Times**: Keep all tweet times for each tweet name in a sorted list
2. **Partition Period**: Divide the query period into fixed-size chunks based on frequency
3. **Count Per Chunk**: Use binary search to count tweets in each chunk
4. **Handle Edge Cases**: The last chunk may be shorter

### Why Binary Search?

- **Sorted Data**: After sorting, we can use binary search to find tweet counts in any range
- **Efficient**: O(log N) per chunk instead of O(N)
- **Scalability**: Works well with up to 10,000 operations

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Binary Search (Optimal)** - O(log N) per query
2. **Direct Counting** - O(N) per query

---

## Approach 1: Binary Search (Optimal)

This is the optimal approach using binary search for efficient range counting.

### Algorithm Steps

1. **Data Structure**: Use defaultdict to store sorted list of tweet times for each tweet name
2. **recordTweet**: Append time to the list for the tweet name
3. **getTweetCountsPerFrequency**:
   - Map frequency to chunk size (minute: 60, hour: 3600, day: 86400)
   - Sort the times list
   - For each chunk, use bisect to count tweets in that range
   - Return counts for all chunks

### Why It Works

- Binary search finds the first and last tweet in each chunk efficiently
- The difference gives us the count in that chunk
- Sorting once enables efficient queries

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict
import bisect

class TweetCounts:
    def __init__(self):
        """
        Initialize the TweetCounts data structure.
        Uses a defaultdict to store tweet times for each tweet name.
        """
        self.tweets = defaultdict(list)

    def recordTweet(self, tweetName: str, time: int) -> None:
        """
        Record a tweet at the given time.
        
        Args:
            tweetName: Name of the tweet
            time: Time of the tweet in seconds
        """
        self.tweets[tweetName].append(time)

    def getTweetCountsPerFrequency(self, freq: str, tweetName: str, startTime: int, endTime: int) -> List[int]:
        """
        Get tweet counts per frequency for a time period.
        
        Args:
            freq: Frequency - "minute", "hour", or "day"
            tweetName: Name of the tweet
            startTime: Start of the time period
            endTime: End of the time period
            
        Returns:
            List of tweet counts for each time chunk
        """
        # Map frequency to chunk size in seconds
        freq_map = {"minute": 60, "hour": 3600, "day": 86400}
        chunk_size = freq_map[freq]
        
        # Get sorted times for the tweet
        times = sorted(self.tweets[tweetName])
        
        result = []
        current_start = startTime
        
        while current_start <= endTime:
            # Calculate chunk end (don't exceed endTime)
            chunk_end = min(current_start + chunk_size - 1, endTime)
            
            # Use bisect to find count in this chunk
            left = bisect.bisect_left(times, current_start)
            right = bisect.bisect_right(times, chunk_end)
            result.append(right - left)
            
            # Move to next chunk
            current_start = chunk_end + 1
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class TweetCounts {
private:
    unordered_map<string, vector<int>> tweets;
    
public:
    TweetCounts() {
        // Initialize the data structure
    }
    
    void recordTweet(string tweetName, int time) {
        /**
         * Record a tweet at the given time.
         * 
         * @param tweetName: Name of the tweet
         * @param time: Time of the tweet in seconds
         */
        tweets[tweetName].push_back(time);
    }
    
    vector<int> getTweetCountsPerFrequency(string freq, string tweetName, 
                                           int startTime, int endTime) {
        /**
         * Get tweet counts per frequency for a time period.
         * 
         * @param freq: Frequency - "minute", "hour", or "day"
         * @param tweetName: Name of the tweet
         * @param startTime: Start of the time period
         * @param endTime: End of the time period
         * @return: Vector of tweet counts for each time chunk
         */
        // Map frequency to chunk size
        unordered_map<string, int> freq_map = {
            {"minute", 60},
            {"hour", 3600},
            {"day", 86400}
        };
        int chunk_size = freq_map[freq];
        
        // Get sorted times
        vector<int>& times = tweets[tweetName];
        sort(times.begin(), times.end());
        
        vector<int> result;
        int current_start = startTime;
        
        while (current_start <= endTime) {
            int chunk_end = min(current_start + chunk_size - 1, endTime);
            
            // Binary search for count in chunk
            auto left_it = lower_bound(times.begin(), times.end(), current_start);
            auto right_it = upper_bound(times.begin(), times.end(), chunk_end);
            result.push_back(right_it - left_it);
            
            current_start = chunk_end + 1;
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class TweetCounts {
    private Map<String, List<Integer>> tweets;
    
    public TweetCounts() {
        tweets = new HashMap<>();
    }
    
    public void recordTweet(String tweetName, int time) {
        /**
         * Record a tweet at the given time.
         * 
         * @param tweetName: Name of the tweet
         * @param time: Time of the tweet in seconds
         */
        tweets.computeIfAbsent(tweetName, k -> new ArrayList<>()).add(time);
    }
    
    public List<Integer> getTweetCountsPerFrequency(String freq, String tweetName, 
                                                      int startTime, int endTime) {
        /**
         * Get tweet counts per frequency for a time period.
         * 
         * @param freq: Frequency - "minute", "hour", or "day"
         * @param tweetName: Name of the tweet
         * @param startTime: Start of the time period
         * @param endTime: End of the time period
         * @return: List of tweet counts for each time chunk
         */
        // Map frequency to chunk size
        Map<String, Integer> freqMap = new HashMap<>();
        freqMap.put("minute", 60);
        freqMap.put("hour", 3600);
        freqMap.put("day", 86400);
        int chunkSize = freqMap.get(freq);
        
        // Get sorted times
        List<Integer> times = tweets.get(tweetName);
        Collections.sort(times);
        
        List<Integer> result = new ArrayList<>();
        int currentStart = startTime;
        
        while (currentStart <= endTime) {
            int chunkEnd = Math.min(currentStart + chunkSize - 1, endTime);
            
            // Binary search for count in chunk
            int left = Collections.binarySearch(times, currentStart);
            if (left < 0) left = -(left + 1);
            
            int right = Collections.binarySearch(times, chunkEnd);
            if (right < 0) right = -(right + 1);
            else right = right + 1;
            
            result.add(right - left);
            currentStart = chunkEnd + 1;
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * TweetCounts constructor
 * @constructor
 */
var TweetCounts = function() {
    /**
     * Initialize the TweetCounts data structure.
     * Uses a Map to store tweet times for each tweet name.
     */
    this.tweets = new Map();
};

/**
 * Record a tweet at the given time.
 * 
 * @param {string} tweetName - Name of the tweet
 * @param {number} time - Time of the tweet in seconds
 */
TweetCounts.prototype.recordTweet = function(tweetName, time) {
    if (!this.tweets.has(tweetName)) {
        this.tweets.set(tweetName, []);
    }
    this.tweets.get(tweetName).push(time);
};

/**
 * Get tweet counts per frequency for a time period.
 * 
 * @param {string} freq - Frequency - "minute", "hour", or "day"
 * @param {string} tweetName - Name of the tweet
 * @param {number} startTime - Start of the time period
 * @param {number} endTime - End of the time period
 * @return {number[]} - Array of tweet counts for each time chunk
 */
TweetCounts.prototype.getTweetCountsPerFrequency = function(freq, tweetName, startTime, endTime) {
    // Map frequency to chunk size
    const freqMap = { "minute": 60, "hour": 3600, "day": 86400 };
    const chunkSize = freqMap[freq];
    
    // Get sorted times
    const times = this.tweets.get(tweetName) || [];
    times.sort((a, b) => a - b);
    
    const result = [];
    let currentStart = startTime;
    
    const bisectLeft = (arr, target) => {
        let left = 0, right = arr.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid] < target) left = mid + 1;
            else right = mid;
        }
        return left;
    };
    
    const bisectRight = (arr, target) => {
        let left = 0, right = arr.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid] <= target) left = mid + 1;
            else right = mid;
        }
        return left;
    };
    
    while (currentStart <= endTime) {
        const chunkEnd = Math.min(currentStart + chunkSize - 1, endTime);
        
        const left = bisectLeft(times, currentStart);
        const right = bisectRight(times, chunkEnd);
        result.push(right - left);
        
        currentStart = chunkEnd + 1;
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time (recordTweet)** | O(1) - appending to list |
| **Time (getTweetCountsPerFrequency)** | O(T log T + C log T) where T = tweet count, C = number of chunks |
| **Space** | O(T) - storing all tweet times |

---

## Approach 2: Direct Counting

This approach uses direct iteration for each chunk without sorting first.

### Algorithm Steps

1. **Data Structure**: Same as Approach 1
2. **recordTweet**: Same as Approach 1
3. **getTweetCountsPerFrequency**:
   - Use a hash map to count tweets per chunk directly
   - No sorting needed - iterate through all tweets

### Why It Works

Direct counting works but is slower for large datasets. It's simpler to implement but doesn't scale as well.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict, Counter

class TweetCounts:
    def __init__(self):
        self.tweets = defaultdict(list)

    def recordTweet(self, tweetName: str, time: int) -> None:
        self.tweets[tweetName].append(time)

    def getTweetCountsPerFrequency_direct(self, freq: str, tweetName: str, 
                                          startTime: int, endTime: int) -> List[int]:
        """Direct counting approach - O(T * C)"""
        freq_map = {"minute": 60, "hour": 3600, "day": 86400}
        chunk_size = freq_map[freq]
        
        times = self.tweets[tweetName]
        
        # Count tweets per chunk
        chunk_counts = Counter()
        for t in times:
            if startTime <= t <= endTime:
                chunk_idx = (t - startTime) // chunk_size
                chunk_counts[chunk_idx] += 1
        
        # Build result
        result = []
        num_chunks = (endTime - startTime) // chunk_size + 1
        for i in range(num_chunks):
            result.append(chunk_counts.get(i, 0))
        
        return result
```

<!-- slide -->
```cpp
class TweetCountsDirect {
public:
    vector<int> getTweetCountsPerFrequency(string freq, string tweetName,
                                           int startTime, int endTime) {
        unordered_map<string, int> freq_map = {
            {"minute", 60}, {"hour", 3600}, {"day", 86400}
        };
        int chunk_size = freq_map[freq];
        
        vector<int>& times = tweets[tweetName];
        
        // Count per chunk
        unordered_map<int, int> chunk_counts;
        for (int t : times) {
            if (startTime <= t && t <= endTime) {
                int chunk_idx = (t - startTime) / chunk_size;
                chunk_counts[chunk_idx]++;
            }
        }
        
        // Build result
        int num_chunks = (endTime - startTime) / chunk_size + 1;
        vector<int> result;
        for (int i = 0; i < num_chunks; i++) {
            result.push_back(chunk_counts.count(i) ? chunk_counts[i] : 0);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class TweetCountsDirect {
    public List<Integer> getTweetCountsPerFrequency(String freq, String tweetName,
                                                    int startTime, int endTime) {
        Map<String, Integer> freqMap = Map.of("minute", 60, "hour", 3600, "day", 86400);
        int chunkSize = freqMap.get(freq);
        
        List<Integer> times = tweets.get(tweetName);
        
        // Count per chunk
        Map<Integer, Integer> chunkCounts = new HashMap<>();
        for (int t : times) {
            if (t >= startTime && t <= endTime) {
                int chunkIdx = (t - startTime) / chunkSize;
                chunkCounts.merge(chunkIdx, 1, Integer::sum);
            }
        }
        
        // Build result
        int numChunks = (endTime - startTime) / chunkSize + 1;
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < numChunks; i++) {
            result.add(chunkCounts.getOrDefault(i, 0));
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
TweetCountsDirect.prototype.getTweetCountsPerFrequency = function(freq, tweetName, startTime, endTime) {
    const freqMap = { "minute": 60, "hour": 3600, "day": 86400 };
    const chunkSize = freqMap[freq];
    
    const times = this.tweets.get(tweetName) || [];
    
    // Count per chunk
    const chunkCounts = new Map();
    for (const t of times) {
        if (t >= startTime && t <= endTime) {
            const chunkIdx = Math.floor((t - startTime) / chunkSize);
            chunkCounts.set(chunkIdx, (chunkCounts.get(chunkIdx) || 0) + 1);
        }
    }
    
    // Build result
    const numChunks = Math.floor((endTime - startTime) / chunkSize) + 1;
    const result = [];
    for (let i = 0; i < numChunks; i++) {
        result.push(chunkCounts.get(i) || 0);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time (recordTweet)** | O(1) |
| **Time (getTweetCountsPerFrequency)** | O(T × C) where T = tweet count, C = chunks |
| **Space** | O(T + C) |

---

## Comparison of Approaches

| Aspect | Binary Search | Direct Counting |
|--------|--------------|-----------------|
| **recordTweet** | O(1) | O(1) |
| **getTweetCountsPerFrequency** | O(T log T + C log T) | O(T × C) |
| **Space** | O(T) | O(T + C) |
| **Best For** | Many queries | Few queries |

**Best Approach:** Binary search is optimal for this problem, especially when there are many queries.

---

## Why Binary Search is Optimal for This Problem

The binary search approach is optimal because:

1. **Efficient Queries**: O(log N) per chunk vs O(N) for direct counting
2. **One-time Sort**: Sorting once enables efficient queries for all chunks
3. **Scalability**: Works well with up to 10,000 operations
4. **Standard Technique**: Binary search on sorted data is a well-established pattern

---

## Related Problems

Based on similar themes (time-series data, frequency counting, range queries):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Time Based Key Value Store | [Link](https://leetcode.com/problems/time-based-key-value-store/) | Time-series key-value store |
| Logger Rate Limiter | [Link](https://leetcode.com/problems/logger-rate-limiter/) | Rate limiting |
| Moving Average from Data Stream | [Link](https://leetcode.com/problems/moving-average-from-data-stream/) | Running average |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Find X Sum of All K Long Subarrays I | [Link](https://leetcode.com/problems/find-x-sum-of-all-k-long-subarrays-i/) | K-long subarray sums |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Binary Search

- [NeetCode - Tweet Counts Per Frequency](https://www.youtube.com/watch?v=qZ19 postX1vQ) - Clear explanation
- [Binary Search Explained](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Complete tutorial
- [Bisect in Python](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Python bisect module

### Range Queries

- [Range Query Techniques](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - Different approaches
- [Fenwick Tree / BIT](https://www.youtube.com/watch?v=qZ19postX1vQ) - Advanced data structure

---

## Follow-up Questions

### Q1: How would you handle unsorted times more efficiently?

**Answer:** Use a balanced BST (like TreeMap in Java) that maintains sorted order automatically. This gives O(log N) insertion and O(log N) range queries.

---

### Q2: How would you implement "get tweet count in the last X minutes/hours"?

**Answer:** Maintain a sliding window of recent tweets. When querying, only consider tweets within the time range. Use a queue data structure for O(1) operations.

---

### Q3: How would you handle concurrent access?

**Answer:** Use thread-safe data structures or add locks. In Python, use threading.Lock; in Java, use ConcurrentHashMap; in C++, use mutexes.

---

### Q4: How would you optimize for memory with many tweets?

**Answer:** Consider compressing old tweets, using sampling, or implementing data tiering where old data is stored on disk.

---

### Q5: How would you implement a "delete tweet" operation?

**Answer:** Use a balanced BST that supports deletion in O(log N). After deletion, maintain sorted order and update counts accordingly.

---

### Q6: What if we need to query multiple tweet names at once?

**Answer:** Process each tweet name separately, or use an inverted index that maps timestamps to tweet names.

---

### Q7: How would you handle time zone differences?

**Answer:** Convert all timestamps to UTC before storage. When querying, convert the user's local time to UTC first.

---

## Common Pitfalls

### 1. Chunk Size Calculation
**Issue:** Incorrect chunk end calculation leads to wrong counts.

**Solution:** Use chunk_end = min(current_start + chunk_size - 1, endTime).

### 2. Sorting Every Query
**Issue:** Sorting the times list for every query is inefficient.

**Solution:** Sort once when first needed, or use a data structure that maintains sorted order.

### 3. Off-by-One Errors
**Issue:** Chunk boundaries are inclusive, easy to make off-by-one mistakes.

**Solution:** Carefully trace through examples with different frequencies.

### 4. Empty Tweet Name
**Issue:** Not handling the case where the tweet name doesn't exist.

**Solution:** Return empty list or handle appropriately.

---

## Summary

The **Tweet Counts Per Frequency** problem demonstrates efficient time-series data processing:

- **Binary Search**: O(T log T + C log T) per query
- **Direct Counting**: O(T × C) per query
- **Space**: O(T)

The key insight is leveraging sorted timestamps for efficient binary search queries. This problem is an excellent demonstration of combining hash maps with sorted data structures.

### Pattern Summary

This problem exemplifies the **Binary Search on Sorted Time Data** pattern, which is characterized by:
- Storing time-series data in sorted order
- Using binary search for range queries
- Efficient chunk-based counting
- Handling different time granularities

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/tweet-counts-per-frequency/discuss/) - Community solutions
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Detailed explanation
- [Time Series Analysis](https://en.wikipedia.org/wiki/Time_series) - Learn about time-series data
- [Pattern: Binary Search](/patterns/binary-search-on-sorted-array-list) - Comprehensive pattern guide
