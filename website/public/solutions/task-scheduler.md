# Task Scheduler

## Problem Description

You are given an array of CPU tasks, each labeled with a letter from A to Z, and a number `n`. Each CPU interval can be idle or allow the completion of one task. Tasks can be completed in any order, but there's a constraint: there has to be a gap of at least `n` intervals between two tasks with the same label.

Return the minimum number of CPU intervals required to complete all tasks.

**Example 1:**

Input: `tasks = ["A","A","A","B","B","B"]`, `n = 2`
Output: `8`

Explanation: A possible sequence is: `A -> B -> idle -> A -> B -> idle -> A -> B`.
After completing task A, you must wait two intervals before doing A again. The same applies to task B. In the 3rd interval, neither A nor B can be done, so you idle. By the 4th interval, you can do A again as 2 intervals have passed.

**Example 2:**

Input: `tasks = ["A","C","A","B","D","B"]`, `n = 1`
Output: `6`

Explanation: A possible sequence is: `A -> B -> C -> D -> A -> B`.
With a cooling interval of 1, you can repeat a task after just one other task.

**Example 3:**

Input: `tasks = ["A","A","A","B","B","B"]`, `n = 3`
Output: `10`

Explanation: A possible sequence is: `A -> B -> idle -> idle -> A -> B -> idle -> idle -> A -> B`.
There are only two types of tasks, A and B, which need to be separated by 3 intervals. This leads to idling twice between repetitions of these tasks.

## Constraints

- `1 <= tasks.length <= 10^4`
- `tasks[i]` is an uppercase English letter.
- `0 <= n <= 100`

## Solution

```python
from typing import List
import collections

def leastInterval(tasks: List[str], n: int) -> int:
    if not tasks:
        return 0

    # Count frequency of each task
    freq = collections.Counter(tasks)
    max_freq = max(freq.values())

    # Count how many tasks have the maximum frequency
    max_count = sum(1 for count in freq.values() if count == max_freq)

    # The formula: (max_freq - 1) * (n + 1) + max_count
    # This accounts for the gaps and the last set of tasks
    return max((max_freq - 1) * (n + 1) + max_count, len(tasks))
```

## Explanation

To solve the Task Scheduler problem, we need to find the minimum number of CPU intervals required to complete all tasks with a cooling period of `n` between identical tasks.

The optimal solution uses a mathematical formula based on the frequency of tasks. First, we count the frequency of each task using a Counter. Let `max_freq` be the highest frequency, and `max_count` be the number of tasks that have this frequency.

The minimum intervals are calculated as `(max_freq - 1) * (n + 1) + max_count`. This formula accounts for the gaps created by the cooling period: for each of the `max_freq - 1` cycles, we have `n + 1` slots (one for the task and n for cooling), and in the last cycle, we place all tasks with `max_freq` occurrences.

If this calculated value is less than the total number of tasks (which can happen when `n` is small), we return the total number of tasks instead, as we can't have fewer intervals than tasks.

**Time Complexity:** O(N), where N is the number of tasks, due to counting frequencies.

**Space Complexity:** O(1), since there are only 26 possible task types (A-Z).
