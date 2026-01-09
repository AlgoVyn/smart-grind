# The Number of the Smallest Unoccupied Chair

## Problem Description

There is a party where `n` friends numbered from `0` to `n - 1` are attending. There is an infinite number of chairs in this party that are numbered from `0` to infinity.

When a friend arrives at the party, they sit on the unoccupied chair with the smallest number.

For example, if chairs `0`, `1`, and `5` are occupied when a friend comes, they will sit on chair number `2`.

When a friend leaves the party, their chair becomes unoccupied at the moment they leave. If another friend arrives at that same moment, they can sit in that chair.

You are given a 0-indexed 2D integer array `times` where `times[i] = [arrival_i, leaving_i]`, indicating the arrival and leaving times of the `i`-th friend respectively, and an integer `targetFriend`. All arrival times are distinct.

Return the chair number that the friend numbered `targetFriend` will sit on.

**Example 1:**

Input: `times = [[1,4],[2,3],[4,6]]`, `targetFriend = 1`
Output: `1`

Explanation:
- Friend 0 arrives at time 1 and sits on chair 0.
- Friend 1 arrives at time 2 and sits on chair 1.
- Friend 1 leaves at time 3 and chair 1 becomes empty.
- Friend 0 leaves at time 4 and chair 0 becomes empty.
- Friend 2 arrives at time 4 and sits on chair 0.
Since friend 1 sat on chair 1, we return 1.

**Example 2:**

Input: `times = [[3,10],[1,5],[2,6]]`, `targetFriend = 0`
Output: `2`

Explanation:
- Friend 1 arrives at time 1 and sits on chair 0.
- Friend 2 arrives at time 2 and sits on chair 1.
- Friend 0 arrives at time 3 and sits on chair 2.
- Friend 1 leaves at time 5 and chair 0 becomes empty.
- Friend 2 leaves at time 6 and chair 1 becomes empty.
- Friend 0 leaves at time 10 and chair 2 becomes empty.
Since friend 0 sat on chair 2, we return 2.

## Constraints

- `n == times.length`
- `2 <= n <= 10^4`
- `times[i].length == 2`
- `1 <= arrival_i < leaving_i <= 10^5`
- `0 <= targetFriend <= n - 1`
- Each `arrival_i` time is distinct.

## Solution

```python
import heapq
from typing import List

class Solution:
    def smallestChair(self, times: List[List[int]], targetFriend: int) -> int:
        n = len(times)
        # Add friend index to times
        for i in range(n):
            times[i].append(i)

        # Sort by arrival time
        times.sort()

        # Min-heap for available chairs
        available = list(range(n))
        heapq.heapify(available)

        # Min-heap for leaving times: (leaving_time, chair)
        leaving = []

        for arrival, leave, friend in times:
            # Free chairs that are now available
            while leaving and leaving[0][0] <= arrival:
                _, chair = heapq.heappop(leaving)
                heapq.heappush(available, chair)

            # Assign the smallest available chair
            chair = heapq.heappop(available)
            if friend == targetFriend:
                return chair

            # Schedule leaving
            heapq.heappush(leaving, (leave, chair))

        return -1  # Should not reach here
```

## Explanation

This problem simulates assigning chairs to friends arriving and leaving at different times, finding the chair for the target friend.

### Step-by-Step Approach:

1. **Prepare Data**: Add friend indices to times and sort by arrival time.

2. **Initialize Heaps**: Use a min-heap for available chairs (0 to n-1 initially). Another min-heap for leaving events `(time, chair)`.

3. **Process Arrivals**: For each friend in order of arrival:
   - Free chairs where leaving time <= current arrival.
   - Assign the smallest available chair.
   - If it's the target friend, return the chair.
   - Schedule the leaving event.

4. **Return Result**: The chair assigned to `targetFriend`.

### Time Complexity:

- O(n log n), due to sorting and heap operations (each heap op is log n, and n operations).

### Space Complexity:

- O(n), for the heaps and lists.
