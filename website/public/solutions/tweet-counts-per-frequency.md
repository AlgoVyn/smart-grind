# Tweet Counts Per Frequency

## Problem Description

A social media company is trying to monitor activity on their site by analyzing the number of tweets that occur in select periods of time. These periods can be partitioned into smaller time chunks based on a certain frequency (every minute, hour, or day).

For example, the period `[10, 10000]` (in seconds) would be partitioned into the following time chunks with these frequencies:

- Every minute (60-second chunks): `[10,69]`, `[70,129]`, `[130,189]`, ..., `[9970,10000]`
- Every hour (3600-second chunks): `[10,3609]`, `[3610,7209]`, `[7210,10000]`
- Every day (86400-second chunks): `[10,10000]`

Notice that the last chunk may be shorter than the specified frequency's chunk size and will always end with the end time of the period (`10000` in the above example).

Design and implement an API to help the company with their analysis.

Implement the TweetCounts class:

- `TweetCounts()` Initializes the TweetCounts object.
- `void recordTweet(String tweetName, int time)` Stores the `tweetName` at the recorded time (in seconds).
- `List<Integer> getTweetCountsPerFrequency(String freq, String tweetName, int startTime, int endTime)` Returns a list of integers representing the number of tweets with `tweetName` in each time chunk for the given period of time `[startTime, endTime]` (in seconds) and frequency `freq`.

`freq` is one of "minute", "hour", or "day" representing a frequency of every minute, hour, or day respectively.

**Example:**

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

## Constraints

- `0 <= time, startTime, endTime <= 10^9`
- `0 <= endTime - startTime <= 10^4`
- There will be at most `10^4` calls in total to `recordTweet` and `getTweetCountsPerFrequency`.

## Solution

```python
from typing import List
from collections import defaultdict
import bisect

class TweetCounts:

    def __init__(self):
        self.tweets = defaultdict(list)

    def recordTweet(self, tweetName: str, time: int) -> None:
        self.tweets[tweetName].append(time)

    def getTweetCountsPerFrequency(self, freq: str, tweetName: str, startTime: int, endTime: int) -> List[int]:
        freq_map = {"minute": 60, "hour": 3600, "day": 86400}
        chunk_size = freq_map[freq]
        times = sorted(self.tweets[tweetName])
        result = []
        current_start = startTime
        while current_start <= endTime:
            chunk_end = min(current_start + chunk_size - 1, endTime)
            left = bisect.bisect_left(times, current_start)
            right = bisect.bisect_right(times, chunk_end)
            result.append(right - left)
            current_start = chunk_end + 1
        return result
```

## Explanation

This problem involves designing a system to record tweets and query the count of tweets for a given name within specified time periods, partitioned by frequency (minute, hour, day).

### Step-by-Step Approach:

1. **Data Structure**: Use a defaultdict of lists to store tweet times for each `tweetName`. This allows efficient appending during `recordTweet`.

2. **recordTweet**: Simply append the time to the list for the given `tweetName`.

3. **getTweetCountsPerFrequency:**
   - Map the frequency string to chunk size (`minute`: 60, `hour`: 3600, `day`: 86400).
   - Sort the times for the `tweetName` to enable binary search.
   - Initialize result list and `current_start` to `startTime`.
   - While `current_start <= endTime`:
     - Calculate `chunk_end` as `min(current_start + chunk_size - 1, endTime)`.
     - Use `bisect_left` to find the first index >= `current_start`.
     - Use `bisect_right` to find the first index > `chunk_end`.
     - Append the count (`right - left`) to result.
     - Update `current_start` to `chunk_end + 1`.

4. **Return Result**: The result list contains counts for each chunk.

### Time Complexity:

- `recordTweet`: O(1)
- `getTweetCountsPerFrequency`: O(T log T + C), where T is the number of tweets for the name (sorting), C is the number of chunks (up to ~10^4 / 60 ~ 166 for minute).

### Space Complexity:

- O(T) for storing all tweet times, where T is total tweets.
