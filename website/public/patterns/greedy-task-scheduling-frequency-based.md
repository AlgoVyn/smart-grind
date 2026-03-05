# Greedy - Task Scheduling (Frequency Based)

## Problem Description

The Frequency Based Task Scheduling pattern is used for problems where tasks need to be scheduled based on their frequencies or priorities, often with constraints like cooldown periods between identical tasks. This pattern prioritizes scheduling the most frequent tasks first to minimize idle time or total completion time.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n log m) where m is number of unique tasks |
| Space Complexity | O(m) for frequency map and heap |
| Input | Tasks list and cooldown constraint |
| Output | Minimum time units to complete all tasks |
| Approach | Max-heap with cooldown queue |

### When to Use

- Tasks with different frequencies need optimal scheduling
- Cooldown constraints between identical tasks
- Minimizing idle time between task executions
- Character/string rearrangement problems
- CPU task scheduling with intervals

## Intuition

The key insight is that the most frequent task determines the minimum schedule length, and we should always execute the most frequent available task.

The "aha!" moments:

1. **Most frequent first**: Schedule highest frequency task first to minimize idle
2. **Cooldown management**: Track when tasks become available again
3. **Greedy choice**: Always pick most frequent available task
4. **Idle slots**: Fill idle time with less frequent tasks
5. **Mathematical bound**: Max(frequency, (max_freq - 1) * (n + 1) + max_count)

## Solution Approaches

### Approach 1: Max Heap with Cooldown Queue ✅ Recommended

#### Algorithm

1. Count frequency of each task
2. Build max-heap (negate for Python) of frequencies
3. Initialize time = 0 and cooldown queue
4. While heap or queue not empty:
   - Time++
   - If heap not empty, pop most frequent task, decrement, add to queue
   - If front of queue is ready (time >= available_time), push back to heap
5. Return time

#### Implementation

````carousel
```python
from collections import Counter, deque
import heapq

def least_interval(tasks: list[str], n: int) -> int:
    """
    Schedule tasks with n cooldown between identical tasks.
    LeetCode 621 - Task Scheduler
    Time: O(n log m), Space: O(m) where m is unique tasks
    """
    if n == 0:
        return len(tasks)
    
    # Count frequencies
    freq = Counter(tasks)
    
    # Max heap (negate for Python min-heap)
    max_heap = [-count for count in freq.values()]
    heapq.heapify(max_heap)
    
    time = 0
    # Queue stores (remaining_count, available_time)
    cooldown_queue = deque()
    
    while max_heap or cooldown_queue:
        time += 1
        
        if max_heap:
            count = heapq.heappop(max_heap)
            count += 1  # Decrement (less negative)
            
            if count < 0:  # Still tasks remaining
                cooldown_queue.append((count, time + n))
        
        # Check if any tasks are ready from cooldown
        if cooldown_queue and cooldown_queue[0][1] == time:
            heapq.heappush(max_heap, cooldown_queue.popleft()[0])
    
    return time


# Alternative: Mathematical formula
def least_interval_math(tasks, n):
    """
    Calculate using mathematical approach.
    Time: O(n), Space: O(m)
    """
    freq = Counter(tasks)
    max_freq = max(freq.values())
    max_count = sum(1 for v in freq.values() if v == max_freq)
    
    # Formula: max(total_tasks, (max_freq - 1) * (n + 1) + max_count)
    part_count = max_freq - 1
    part_length = n + 1
    empty_slots = part_count * part_length
    available_tasks = len(tasks) - max_freq * max_count
    idles = max(0, empty_slots - available_tasks)
    
    return len(tasks) + idles
```
<!-- slide -->
```cpp
class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        vector<int> freq(26, 0);
        for (char task : tasks) {
            freq[task - 'A']++;
        }
        
        priority_queue<int> pq;
        for (int f : freq) {
            if (f > 0) pq.push(f);
        }
        
        int time = 0;
        queue<pair<int, int>> cooldown;  // {count, available_time}
        
        while (!pq.empty() || !cooldown.empty()) {
            time++;
            
            if (!pq.empty()) {
                int count = pq.top();
                pq.pop();
                if (count > 1) {
                    cooldown.push({count - 1, time + n});
                }
            }
            
            if (!cooldown.empty() && cooldown.front().second == time) {
                pq.push(cooldown.front().first);
                cooldown.pop();
            }
        }
        
        return time;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int leastInterval(char[] tasks, int n) {
        int[] freq = new int[26];
        for (char task : tasks) {
            freq[task - 'A']++;
        }
        
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        for (int f : freq) {
            if (f > 0) pq.offer(f);
        }
        
        int time = 0;
        Queue<int[]> cooldown = new LinkedList<>();  // [count, available_time]
        
        while (!pq.isEmpty() || !cooldown.isEmpty()) {
            time++;
            
            if (!pq.isEmpty()) {
                int count = pq.poll();
                if (count > 1) {
                    cooldown.offer(new int[]{count - 1, time + n});
                }
            }
            
            if (!cooldown.isEmpty() && cooldown.peek()[1] == time) {
                pq.offer(cooldown.poll()[0]);
            }
        }
        
        return time;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {character[]} tasks
 * @param {number} n
 * @return {number}
 */
function leastInterval(tasks, n) {
    const freq = {};
    for (const task of tasks) {
        freq[task] = (freq[task] || 0) + 1;
    }
    
    const pq = Object.values(freq).sort((a, b) => b - a);
    
    let time = 0;
    const cooldown = [];  // [count, available_time]
    
    while (pq.length > 0 || cooldown.length > 0) {
        time++;
        
        if (pq.length > 0) {
            const count = pq.shift();
            if (count > 1) {
                cooldown.push([count - 1, time + n]);
            }
        }
        
        // Check for ready tasks (simplified - in real implementation use proper queue)
        const ready = cooldown.filter(([_, t]) => t === time);
        for (const [count, _] of ready) {
            pq.push(count);
            pq.sort((a, b) => b - a);
        }
        // Remove processed
        for (let i = cooldown.length - 1; i >= 0; i--) {
            if (cooldown[i][1] === time) {
                cooldown.splice(i, 1);
            }
        }
    }
    
    return time;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log m) - Heap operations for m unique tasks |
| Space | O(m) - Frequency map, heap, and queue |

### Approach 2: Reorganize String (No Adjacent Same Characters)

#### Implementation

````carousel
```python
def reorganize_string(s: str) -> str:
    """
    Reorganize string so no two adjacent characters are same.
    LeetCode 767 - Reorganize String
    Time: O(n log m), Space: O(m)
    """
    freq = Counter(s)
    
    # Check if possible
    max_freq = max(freq.values())
    if max_freq > (len(s) + 1) // 2:
        return ""
    
    # Max heap: (-count, char)
    max_heap = [(-count, char) for char, count in freq.items()]
    heapq.heapify(max_heap)
    
    result = []
    prev_count, prev_char = 0, ''
    
    while max_heap:
        count, char = heapq.heappop(max_heap)
        result.append(char)
        
        # Push previous back if still has count
        if prev_count < 0:
            heapq.heappush(max_heap, (prev_count, prev_char))
        
        prev_count, prev_char = count + 1, char  # Decrement count
    
    return ''.join(result)


def reorganize_string_two_pass(s):
    """
    Alternative: Fill even indices first, then odd.
    """
    freq = Counter(s)
    max_freq = max(freq.values())
    
    if max_freq > (len(s) + 1) // 2:
        return ""
    
    # Sort by frequency descending
    chars = sorted(freq.keys(), key=lambda x: freq[x], reverse=True)
    
    result = [''] * len(s)
    idx = 0
    
    # Fill even indices first with most frequent
    for char in chars:
        for _ in range(freq[char]):
            if idx >= len(s):
                idx = 1  # Switch to odd indices
            result[idx] = char
            idx += 2
    
    return ''.join(result)
```
<!-- slide -->
```cpp
class Solution {
public:
    string reorganizeString(string s) {
        vector<int> freq(26, 0);
        for (char c : s) freq[c - 'a']++;
        
        int maxFreq = *max_element(freq.begin(), freq.end());
        if (maxFreq > (s.length() + 1) / 2) return "";
        
        priority_queue<pair<int, char>> pq;
        for (int i = 0; i < 26; i++) {
            if (freq[i] > 0) {
                pq.push({freq[i], 'a' + i});
            }
        }
        
        string result;
        pair<int, char> prev = {0, 0};
        
        while (!pq.empty()) {
            auto curr = pq.top();
            pq.pop();
            
            result += curr.second;
            
            if (prev.first > 0) {
                pq.push(prev);
            }
            
            prev = {curr.first - 1, curr.second};
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
class Solution {
    public String reorganizeString(String s) {
        int[] freq = new int[26];
        for (char c : s.toCharArray()) {
            freq[c - 'a']++;
        }
        
        int maxFreq = Arrays.stream(freq).max().getAsInt();
        if (maxFreq > (s.length() + 1) / 2) return "";
        
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[1] - a[1]);
        for (int i = 0; i < 26; i++) {
            if (freq[i] > 0) {
                pq.offer(new int[]{i, freq[i]});
            }
        }
        
        StringBuilder result = new StringBuilder();
        int[] prev = null;
        
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            result.append((char)('a' + curr[0]));
            
            if (prev != null && prev[1] > 0) {
                pq.offer(prev);
            }
            
            prev = new int[]{curr[0], curr[1] - 1};
        }
        
        return result.toString();
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {string}
 */
function reorganizeString(s) {
    const freq = {};
    for (const c of s) {
        freq[c] = (freq[c] || 0) + 1;
    }
    
    const maxFreq = Math.max(...Object.values(freq));
    if (maxFreq > (s.length + 1) / 2) return "";
    
    const pq = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    
    let result = '';
    let prev = null;
    
    while (pq.length > 0) {
        const [char, count] = pq.shift();
        result += char;
        
        if (prev && prev[1] > 0) {
            pq.push(prev);
            pq.sort((a, b) => b[1] - a[1]);
        }
        
        prev = [char, count - 1];
    }
    
    return result;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log m) - Heap operations |
| Space | O(m) - Frequency map and heap |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Max Heap + Queue | O(n log m) | O(m) | **Recommended** - General solution |
| Mathematical | O(n) | O(m) | When only need time count |
| Greedy Fill | O(n log m) | O(m) | Reorganize string variant |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Task Scheduler](https://leetcode.com/problems/task-scheduler/) | 621 | Medium | Schedule with cooldown |
| [Reorganize String](https://leetcode.com/problems/reorganize-string/) | 767 | Medium | No adjacent same chars |
| [Rearrange String k Distance Apart](https://leetcode.com/problems/rearrange-string-k-distance-apart/) | 358 | Hard | Minimum k distance |
| [Construct String With Repeat Limit](https://leetcode.com/problems/construct-string-with-repeat-limit/) | 2182 | Medium | Character repeat limit |
| [Maximum Number of Weeks](https://leetcode.com/problems/maximum-number-of-weeks/) | 1953 | Medium | Schedule projects |

## Video Tutorial Links

1. **[NeetCode - Task Scheduler](https://www.youtube.com/watch?v=s8p8ukTyA2I)** - Heap approach
2. **[Kevin Naughton Jr. - Task Scheduler](https://www.youtube.com/watch?v=YCD_iYxyXoo)** - Detailed explanation
3. **[Back To Back SWE - Reorganize String](https://www.youtube.com/watch?v=2g_b1aYTHeg)** - Greedy heap

## Summary

### Key Takeaways

- **Most frequent first**: Always execute highest frequency available task
- **Cooldown tracking**: Use queue to track when tasks become available
- **Greedy is optimal**: Scheduling most frequent first minimizes idle
- **Mathematical bound**: Can compute answer without simulation
- **Impossible check**: If max_freq > (n+1)/2, reorganization impossible

### Common Pitfalls

- Forgetting to check if reorganization is possible
- Not handling the cooldown properly
- Using min-heap instead of max-heap
- Off-by-one in cooldown calculation
- Not pushing previous task back to heap
- Confusing task count with unique task types

### Follow-up Questions

1. **Can we solve without heap?**
   - Yes, using mathematical formula for task scheduler

2. **What if cooldown varies by task?**
   - Modify queue to track per-task cooldown

3. **How to reconstruct actual schedule?**
   - Heap approach naturally produces one valid schedule

4. **What's the mathematical formula?**
   - max(len(tasks), (max_freq-1)*(n+1) + max_count)

## Pattern Source

[Greedy - Task Scheduling (Frequency Based)](patterns/greedy-task-scheduling-frequency-based.md)
