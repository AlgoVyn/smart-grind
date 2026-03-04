# Interval Scheduling

## Category
Greedy

## Description

The **Interval Scheduling** problem (also known as the **Activity Selection Problem**) is a classic greedy algorithm that finds the maximum number of mutually compatible activities (non-overlapping intervals). Given a set of intervals with start and end times, the goal is to select the largest possible subset where no two intervals overlap.

This algorithm exemplifies the power of the **greedy choice property** - making locally optimal choices at each step leads to a globally optimal solution. The key insight is that selecting the interval that finishes earliest leaves the maximum room for future selections.

---

## When to Use

Use the Interval Scheduling algorithm when you need to solve problems involving:

- **Resource allocation**: Assigning limited resources to maximum activities
- **Meeting room scheduling**: Selecting maximum non-conflicting meetings
- **Course scheduling**: Choosing maximum non-conflicting classes
- **Job scheduling on single machine**: Maximizing throughput on one processor
- **TV/program broadcasting**: Selecting maximum non-overlapping shows

### Comparison: Greedy vs Dynamic Programming

| Aspect | Greedy Interval Scheduling | Weighted Interval Scheduling (DP) |
|--------|---------------------------|-----------------------------------|
| **Objective** | Maximize number of intervals | Maximize total weight/profit |
| **Time Complexity** | O(n log n) | O(n log n) or O(n²) |
| **Space Complexity** | O(1) or O(n) | O(n) |
| **Optimality** | Optimal for unweighted | Optimal for weighted |
| **Implementation** | Simple, elegant | More complex |
| **Use When** | All intervals have equal value | Intervals have different values |

### When to Choose Which Approach

**Choose Greedy Approach when:**
- All intervals have equal importance/value
- You only need to maximize the count of selected intervals
- Simple, fast solution is preferred
- Problem constraints are standard

**Choose Dynamic Programming when:**
- Intervals have different weights/profits
- You need to maximize total value, not count
- The greedy choice property doesn't apply
- Example: Some meetings pay more than others

---

## Algorithm Explanation

### Core Concept

The fundamental insight of interval scheduling is the **Earliest Finish Time** greedy strategy:

> **Greedy Choice:** Always select the interval with the earliest finish time that doesn't conflict with previously selected intervals.

### Why This Works

**Proof Sketch (Greedy Exchange Argument):**

1. Let `G` be the greedy solution (earliest finish time strategy)
2. Let `O` be any optimal solution
3. Both select the same number of intervals (or `G` selects more)
4. We can transform `O` into `G` without decreasing its size:
   - At each step where `O` and `G` differ, replace `O`'s choice with `G`'s choice
   - Since `G` always picks the earliest finishing interval, `G`'s choice ends no later than `O`'s choice
   - This leaves at least as much room for remaining intervals

### Visual Representation

Consider intervals: `[(1, 4), (2, 3), (3, 5), (5, 7), (6, 8), (8, 10)]`

```
Time:  1   2   3   4   5   6   7   8   9   10
       |---|---|---|---|---|---|---|---|---|
A: [1      4)                               (ends at 4)
B:     [2 3)                                 (ends at 3) ✓ SELECTED (earliest end)
C:         [3    5)                          (ends at 5)
D:                 [5   7)                   (ends at 7)
E:                   [6 8)                   (ends at 8)
F:                         [8      10]       (ends at 10) ✓ SELECTED

Timeline of selected intervals:
1. Select B (2,3) - ends at 3
2. Skip A (starts at 1 < 3), Skip C (starts at 3 = 3, but we check: 3 >= 3 ✓)
   Actually: C starts at 3, B ends at 3, so 3 >= 3, we can select C!
   
Let me redraw:
```

**Better Visualization:**

```
Intervals sorted by end time:
┌─────────────────────────────────────────────────────────┐
│ Interval │ Start │ End  │ Visual Timeline              │
├─────────────────────────────────────────────────────────┤
│    B     │   2   │  3   │  ···██······················ │ ← SELECTED (earliest end)
│    A     │   1   │  4   │  ██████····················· │   (overlaps with B, skip)
│    C     │   3   │  5   │  ···██████·················· │ ← SELECTED (starts at 3 >= 3)
│    D     │   5   │  7   │  ·······██████·············· │ ← SELECTED (starts at 5 >= 5)
│    E     │   6   │  8   │  ··········██████··········· │   (overlaps with D, skip)
│    F     │   8   │  10  │  ···············████████···· │ ← SELECTED (starts at 8 >= 7)
└─────────────────────────────────────────────────────────┘

Result: 4 intervals selected (B, C, D, F)
```

### Key Properties

1. **Greedy Choice Property**: A globally optimal solution can be achieved by making locally optimal choices
2. **Optimal Substructure**: After selecting an interval, the problem reduces to the same problem on remaining compatible intervals
3. **No Lookahead Needed**: The greedy choice doesn't depend on future choices

### Common Variations

| Variation | Problem Statement | Approach |
|-----------|------------------|----------|
| **Maximum Intervals** | Select max non-overlapping intervals | Greedy (earliest finish) |
| **Minimum Removals** | Remove minimum to make non-overlapping | Greedy (same as above) |
| **Weighted Scheduling** | Maximize total weight | DP + Binary Search |
| **Interval Partitioning** | Minimize resources needed | Greedy (earliest start) |
| **Interval Merging** | Merge overlapping intervals | Sort + Linear scan |

---

## Algorithm Steps

### Standard Greedy Approach (Maximum Non-overlapping Intervals)

1. **Sort Intervals**: Sort all intervals by their end time in ascending order
2. **Initialize**: Select the first interval (earliest end), set `last_end = end_time`
3. **Iterate**: For each remaining interval:
   - If `start_time >= last_end`: Select this interval, update `last_end`
   - Else: Skip this interval (it overlaps)
4. **Return**: Count or list of selected intervals

### Step-by-Step Example

**Input:** `intervals = [(1, 3), (2, 4), (3, 5), (7, 9), (6, 8)]`

```
Step 1: Sort by end time
  Original: [(1,3), (2,4), (3,5), (7,9), (6,8)]
  Sorted:   [(1,3), (2,4), (3,5), (6,8), (7,9)]
               ↑                            ↑
             end=3                       end=9

Step 2: Select first interval
  Selected: [(1,3)]
  last_end = 3
  Count = 1

Step 3: Check (2,4)
  start=2, last_end=3
  2 >= 3? No (overlaps) → Skip

Step 4: Check (3,5)
  start=3, last_end=3
  3 >= 3? Yes → Select!
  Selected: [(1,3), (3,5)]
  last_end = 5
  Count = 2

Step 5: Check (6,8)
  start=6, last_end=5
  6 >= 5? Yes → Select!
  Selected: [(1,3), (3,5), (6,8)]
  last_end = 8
  Count = 3

Step 6: Check (7,9)
  start=7, last_end=8
  7 >= 8? No (overlaps) → Skip

Final Result: 3 intervals
Selected: [(1,3), (3,5), (6,8)]
```

---

## Implementation

### Template Code (Maximum Non-overlapping Intervals)

````carousel
```python
from typing import List, Tuple

def interval_scheduling_max(intervals: List[Tuple[int, int]]) -> int:
    """
    Find maximum number of non-overlapping intervals.
    Uses greedy algorithm - pick earliest finishing interval.
    
    Args:
        intervals: List of tuples (start, end) where start < end
        
    Returns:
        Maximum number of non-overlapping intervals
        
    Time Complexity: O(n log n) - dominated by sorting
    Space Complexity: O(1) - only using a few variables
        
    Example:
        >>> intervals = [(1, 3), (2, 4), (3, 5), (7, 9)]
        >>> interval_scheduling_max(intervals)
        3  # [(1,3), (3,5), (7,9)]
    """
    if not intervals:
        return 0
    
    # Sort by end time (greedy choice: earliest finishing first)
    intervals.sort(key=lambda x: x[1])
    
    count = 1  # Select first interval (earliest end)
    last_end = intervals[0][1]
    
    # Iterate through remaining intervals
    for start, end in intervals[1:]:
        # Select if it starts after or at the end of last selected
        if start >= last_end:
            count += 1
            last_end = end
    
    return count


def interval_scheduling_select(intervals: List[Tuple[int, int]]) -> List[Tuple[int, int]]:
    """
    Return the actual selected intervals (not just count).
    
    Time Complexity: O(n log n)
    Space Complexity: O(n) - storing selected intervals
    """
    if not intervals:
        return []
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    selected = [intervals[0]]
    last_end = intervals[0][1]
    
    for start, end in intervals[1:]:
        if start >= last_end:
            selected.append((start, end))
            last_end = end
    
    return selected


def min_intervals_to_remove(intervals: List[Tuple[int, int]]) -> int:
    """
    Find minimum number of intervals to remove to make non-overlapping.
    This is equivalent to: total - max_non_overlapping
    
    Problem: LeetCode 435 - Non-overlapping Intervals
    
    Time Complexity: O(n log n)
    Space Complexity: O(1)
    """
    if not intervals:
        return 0
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    count = 1  # Count of kept intervals
    last_end = intervals[0][1]
    
    for start, end in intervals[1:]:
        if start >= last_end:
            # Non-overlapping - keep it
            count += 1
            last_end = end
        # else: overlapping - this interval will be removed
    
    # Minimum to remove = total - kept
    return len(intervals) - count


def weighted_interval_scheduling(intervals: List[Tuple[int, int, int]]) -> int:
    """
    Weighted interval scheduling using dynamic programming.
    Each interval is (start, end, weight).
    Returns maximum total weight of compatible intervals.
    
    Time Complexity: O(n log n) with binary search
    Space Complexity: O(n)
    """
    if not intervals:
        return 0
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    n = len(intervals)
    
    # dp[i] = max weight using intervals[0..i]
    dp = [0] * n
    dp[0] = intervals[0][2]  # Weight of first interval
    
    for i in range(1, n):
        start, end, weight = intervals[i]
        
        # Find the last interval that doesn't overlap with current
        # Binary search for largest j where intervals[j][1] <= start
        lo, hi = 0, i - 1
        best_j = -1
        while lo <= hi:
            mid = (lo + hi) // 2
            if intervals[mid][1] <= start:
                best_j = mid
                lo = mid + 1
            else:
                hi = mid - 1
        
        # Option 1: Include current interval
        include = weight
        if best_j != -1:
            include += dp[best_j]
        
        # Option 2: Exclude current interval
        exclude = dp[i - 1]
        
        dp[i] = max(include, exclude)
    
    return dp[-1]


# Example usage and demonstration
if __name__ == "__main__":
    print("=" * 60)
    print("INTERVAL SCHEDULING DEMONSTRATION")
    print("=" * 60)
    
    # Example 1: Basic interval scheduling
    intervals = [(1, 4), (2, 3), (3, 4), (5, 7), (6, 8), (8, 10)]
    print(f"\nIntervals: {intervals}")
    print(f"Maximum non-overlapping: {interval_scheduling_max(intervals)}")
    print(f"Selected: {interval_scheduling_select(intervals)}")
    print(f"Minimum to remove: {min_intervals_to_remove(intervals)}")
    
    # Example 2: Already sorted scenario
    intervals2 = [(1, 2), (2, 3), (3, 4), (4, 5)]
    print(f"\nIntervals: {intervals2}")
    print(f"Maximum non-overlapping: {interval_scheduling_max(intervals2)}")
    print(f"Selected: {interval_scheduling_select(intervals2)}")
    
    # Example 3: All overlapping
    intervals3 = [(1, 10), (2, 9), (3, 8)]
    print(f"\nIntervals: {intervals3}")
    print(f"Maximum non-overlapping: {interval_scheduling_max(intervals3)}")
    print(f"Selected: {interval_scheduling_select(intervals3)}")
    
    # Example 4: Weighted interval scheduling
    weighted = [(1, 3, 50), (2, 5, 20), (4, 6, 30), (6, 7, 40)]
    print(f"\nWeighted intervals (start, end, weight): {weighted}")
    print(f"Maximum weight: {weighted_interval_scheduling(weighted)}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/**
 * Interval Scheduling - Maximum Non-overlapping Intervals
 * 
 * Time Complexity: O(n log n) - dominated by sorting
 * Space Complexity: O(1) for count, O(n) for selection
 */

// Structure to represent an interval
struct Interval {
    int start;
    int end;
    
    Interval(int s, int e) : start(s), end(e) {}
};

/**
 * Find maximum number of non-overlapping intervals
 */
int intervalSchedulingMax(vector<Interval>& intervals) {
    if (intervals.empty()) {
        return 0;
    }
    
    // Sort by end time (greedy choice)
    sort(intervals.begin(), intervals.end(), 
         [](const Interval& a, const Interval& b) {
             return a.end < b.end;
         });
    
    int count = 1;  // Select first interval
    int lastEnd = intervals[0].end;
    
    for (size_t i = 1; i < intervals.size(); i++) {
        if (intervals[i].start >= lastEnd) {
            count++;
            lastEnd = intervals[i].end;
        }
    }
    
    return count;
}

/**
 * Return the actual selected intervals
 */
vector<Interval> intervalSchedulingSelect(vector<Interval>& intervals) {
    if (intervals.empty()) {
        return {};
    }
    
    sort(intervals.begin(), intervals.end(), 
         [](const Interval& a, const Interval& b) {
             return a.end < b.end;
         });
    
    vector<Interval> selected;
    selected.push_back(intervals[0]);
    int lastEnd = intervals[0].end;
    
    for (size_t i = 1; i < intervals.size(); i++) {
        if (intervals[i].start >= lastEnd) {
            selected.push_back(intervals[i]);
            lastEnd = intervals[i].end;
        }
    }
    
    return selected;
}

/**
 * Minimum intervals to remove to make non-overlapping
 * LeetCode 435 - Non-overlapping Intervals
 */
int minIntervalsToRemove(vector<Interval>& intervals) {
    if (intervals.empty()) {
        return 0;
    }
    
    sort(intervals.begin(), intervals.end(), 
         [](const Interval& a, const Interval& b) {
             return a.end < b.end;
         });
    
    int count = 1;  // Count of kept intervals
    int lastEnd = intervals[0].end;
    
    for (size_t i = 1; i < intervals.size(); i++) {
        if (intervals[i].start >= lastEnd) {
            count++;
            lastEnd = intervals[i].end;
        }
    }
    
    return intervals.size() - count;
}

/**
 * Weighted interval scheduling using dynamic programming
 * Each interval has (start, end, weight)
 */
struct WeightedInterval {
    int start;
    int end;
    int weight;
    
    WeightedInterval(int s, int e, int w) : start(s), end(e), weight(w) {}
};

int weightedIntervalScheduling(vector<WeightedInterval>& intervals) {
    if (intervals.empty()) {
        return 0;
    }
    
    sort(intervals.begin(), intervals.end(), 
         [](const WeightedInterval& a, const WeightedInterval& b) {
             return a.end < b.end;
         });
    
    int n = intervals.size();
    vector<int> dp(n, 0);
    dp[0] = intervals[0].weight;
    
    for (int i = 1; i < n; i++) {
        int include = intervals[i].weight;
        
        // Binary search for last non-overlapping interval
        int lo = 0, hi = i - 1, bestJ = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (intervals[mid].end <= intervals[i].start) {
                bestJ = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        
        if (bestJ != -1) {
            include += dp[bestJ];
        }
        
        dp[i] = max(include, dp[i - 1]);
    }
    
    return dp[n - 1];
}

int main() {
    cout << "=" << string(60, '=') << endl;
    cout << "INTERVAL SCHEDULING DEMONSTRATION" << endl;
    cout << "=" << string(60, '=') << endl;
    
    // Example 1: Basic interval scheduling
    vector<Interval> intervals = {
        {1, 4}, {2, 3}, {3, 4}, {5, 7}, {6, 8}, {8, 10}
    };
    
    cout << "\nExample 1: Basic Interval Scheduling" << endl;
    cout << "Intervals: ";
    for (const auto& iv : intervals) {
        cout << "(" << iv.start << "," << iv.end << ") ";
    }
    cout << endl;
    
    cout << "Maximum non-overlapping: " << intervalSchedulingMax(intervals) << endl;
    
    // Need to copy since sorting modifies original
    vector<Interval> intervalsCopy = intervals;
    auto selected = intervalSchedulingSelect(intervalsCopy);
    cout << "Selected intervals: ";
    for (const auto& iv : selected) {
        cout << "(" << iv.start << "," << iv.end << ") ";
    }
    cout << endl;
    
    intervalsCopy = intervals;
    cout << "Minimum to remove: " << minIntervalsToRemove(intervalsCopy) << endl;
    
    // Example 2: All overlapping
    vector<Interval> intervals2 = {{1, 10}, {2, 9}, {3, 8}};
    cout << "\nExample 2: All Overlapping" << endl;
    cout << "Intervals: (1,10) (2,9) (3,8)" << endl;
    cout << "Maximum non-overlapping: " << intervalSchedulingMax(intervals2) << endl;
    
    // Example 3: Weighted interval scheduling
    vector<WeightedInterval> weighted = {
        {1, 3, 50}, {2, 5, 20}, {4, 6, 30}, {6, 7, 40}
    };
    cout << "\nExample 3: Weighted Interval Scheduling" << endl;
    cout << "Weighted maximum: " << weightedIntervalScheduling(weighted) << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.Arrays;
import java.util.Comparator;
import java.util.ArrayList;
import java.util.List;

/**
 * Interval Scheduling - Maximum Non-overlapping Intervals
 * 
 * Time Complexity: O(n log n) - dominated by sorting
 * Space Complexity: O(1) for count, O(n) for selection
 */

class Interval {
    int start;
    int end;
    
    Interval(int start, int end) {
        this.start = start;
        this.end = end;
    }
    
    @Override
    public String toString() {
        return "(" + start + "," + end + ")";
    }
}

class WeightedInterval extends Interval {
    int weight;
    
    WeightedInterval(int start, int end, int weight) {
        super(start, end);
        this.weight = weight;
    }
}

public class IntervalScheduling {
    
    /**
     * Find maximum number of non-overlapping intervals
     */
    public static int intervalSchedulingMax(Interval[] intervals) {
        if (intervals == null || intervals.length == 0) {
            return 0;
        }
        
        // Sort by end time (greedy choice)
        Arrays.sort(intervals, Comparator.comparingInt(i -> i.end));
        
        int count = 1;
        int lastEnd = intervals[0].end;
        
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i].start >= lastEnd) {
                count++;
                lastEnd = intervals[i].end;
            }
        }
        
        return count;
    }
    
    /**
     * Return the actual selected intervals
     */
    public static List<Interval> intervalSchedulingSelect(Interval[] intervals) {
        if (intervals == null || intervals.length == 0) {
            return new ArrayList<>();
        }
        
        Arrays.sort(intervals, Comparator.comparingInt(i -> i.end));
        
        List<Interval> selected = new ArrayList<>();
        selected.add(intervals[0]);
        int lastEnd = intervals[0].end;
        
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i].start >= lastEnd) {
                selected.add(intervals[i]);
                lastEnd = intervals[i].end;
            }
        }
        
        return selected;
    }
    
    /**
     * Minimum intervals to remove to make non-overlapping
     * LeetCode 435 - Non-overlapping Intervals
     */
    public static int minIntervalsToRemove(Interval[] intervals) {
        if (intervals == null || intervals.length == 0) {
            return 0;
        }
        
        Arrays.sort(intervals, Comparator.comparingInt(i -> i.end));
        
        int count = 1;  // Count of kept intervals
        int lastEnd = intervals[0].end;
        
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i].start >= lastEnd) {
                count++;
                lastEnd = intervals[i].end;
            }
        }
        
        return intervals.length - count;
    }
    
    /**
     * Weighted interval scheduling using dynamic programming
     */
    public static int weightedIntervalScheduling(WeightedInterval[] intervals) {
        if (intervals == null || intervals.length == 0) {
            return 0;
        }
        
        Arrays.sort(intervals, Comparator.comparingInt(i -> i.end));
        
        int n = intervals.length;
        int[] dp = new int[n];
        dp[0] = intervals[0].weight;
        
        for (int i = 1; i < n; i++) {
            int include = intervals[i].weight;
            
            // Binary search for last non-overlapping interval
            int lo = 0, hi = i - 1, bestJ = -1;
            while (lo <= hi) {
                int mid = lo + (hi - lo) / 2;
                if (intervals[mid].end <= intervals[i].start) {
                    bestJ = mid;
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
            
            if (bestJ != -1) {
                include += dp[bestJ];
            }
            
            dp[i] = Math.max(include, dp[i - 1]);
        }
        
        return dp[n - 1];
    }
    
    /**
     * Alternative: Sort by start time (for different problems)
     * Sometimes we need to sort by start time for interval merging
     */
    public static List<Interval> mergeIntervals(Interval[] intervals) {
        if (intervals == null || intervals.length == 0) {
            return new ArrayList<>();
        }
        
        // Sort by start time for merging
        Arrays.sort(intervals, Comparator.comparingInt(i -> i.start));
        
        List<Interval> merged = new ArrayList<>();
        merged.add(intervals[0]);
        
        for (int i = 1; i < intervals.length; i++) {
            Interval last = merged.get(merged.size() - 1);
            Interval current = intervals[i];
            
            if (current.start <= last.end) {
                // Overlapping - merge
                last.end = Math.max(last.end, current.end);
            } else {
                // Non-overlapping - add new
                merged.add(current);
            }
        }
        
        return merged;
    }
    
    public static void main(String[] args) {
        System.out.println("=".repeat(60));
        System.out.println("INTERVAL SCHEDULING DEMONSTRATION");
        System.out.println("=".repeat(60));
        
        // Example 1: Basic interval scheduling
        Interval[] intervals = {
            new Interval(1, 4),
            new Interval(2, 3),
            new Interval(3, 4),
            new Interval(5, 7),
            new Interval(6, 8),
            new Interval(8, 10)
        };
        
        System.out.println("\nExample 1: Basic Interval Scheduling");
        System.out.print("Intervals: ");
        for (Interval iv : intervals) {
            System.out.print(iv + " ");
        }
        System.out.println();
        
        // Need copies since sorting modifies the array
        Interval[] copy1 = Arrays.copyOf(intervals, intervals.length);
        System.out.println("Maximum non-overlapping: " + intervalSchedulingMax(copy1));
        
        Interval[] copy2 = Arrays.copyOf(intervals, intervals.length);
        System.out.println("Selected: " + intervalSchedulingSelect(copy2));
        
        Interval[] copy3 = Arrays.copyOf(intervals, intervals.length);
        System.out.println("Minimum to remove: " + minIntervalsToRemove(copy3));
        
        // Example 2: Weighted
        WeightedInterval[] weighted = {
            new WeightedInterval(1, 3, 50),
            new WeightedInterval(2, 5, 20),
            new WeightedInterval(4, 6, 30),
            new WeightedInterval(6, 7, 40)
        };
        System.out.println("\nExample 2: Weighted Interval Scheduling");
        System.out.println("Maximum weight: " + weightedIntervalScheduling(weighted));
    }
}
```

<!-- slide -->
```javascript
/**
 * Interval Scheduling - Maximum Non-overlapping Intervals
 * 
 * Time Complexity: O(n log n) - dominated by sorting
 * Space Complexity: O(1) for count, O(n) for selection
 */

/**
 * Find maximum number of non-overlapping intervals
 * @param {number[][]} intervals - Array of [start, end] pairs
 * @returns {number} Maximum count of non-overlapping intervals
 */
function intervalSchedulingMax(intervals) {
    if (!intervals || intervals.length === 0) {
        return 0;
    }
    
    // Sort by end time (greedy choice: earliest finishing first)
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 1;  // Select first interval
    let lastEnd = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        const [start, end] = intervals[i];
        if (start >= lastEnd) {
            count++;
            lastEnd = end;
        }
    }
    
    return count;
}

/**
 * Return the actual selected intervals
 * @param {number[][]} intervals - Array of [start, end] pairs
 * @returns {number[][]} Selected non-overlapping intervals
 */
function intervalSchedulingSelect(intervals) {
    if (!intervals || intervals.length === 0) {
        return [];
    }
    
    // Create a copy to avoid modifying original
    const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
    
    const selected = [sorted[0]];
    let lastEnd = sorted[0][1];
    
    for (let i = 1; i < sorted.length; i++) {
        const [start, end] = sorted[i];
        if (start >= lastEnd) {
            selected.push(sorted[i]);
            lastEnd = end;
        }
    }
    
    return selected;
}

/**
 * Minimum intervals to remove to make non-overlapping
 * LeetCode 435 - Non-overlapping Intervals
 * @param {number[][]} intervals - Array of [start, end] pairs
 * @returns {number} Minimum number of intervals to remove
 */
function minIntervalsToRemove(intervals) {
    if (!intervals || intervals.length === 0) {
        return 0;
    }
    
    const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
    
    let count = 1;  // Count of kept intervals
    let lastEnd = sorted[0][1];
    
    for (let i = 1; i < sorted.length; i++) {
        const [start, end] = sorted[i];
        if (start >= lastEnd) {
            count++;
            lastEnd = end;
        }
    }
    
    return intervals.length - count;
}

/**
 * Weighted interval scheduling using dynamic programming
 * @param {number[][]} intervals - Array of [start, end, weight] triples
 * @returns {number} Maximum total weight
 */
function weightedIntervalScheduling(intervals) {
    if (!intervals || intervals.length === 0) {
        return 0;
    }
    
    // Sort by end time
    const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
    const n = sorted.length;
    
    // dp[i] = max weight using intervals[0..i]
    const dp = new Array(n).fill(0);
    dp[0] = sorted[0][2];
    
    for (let i = 1; i < n; i++) {
        const [start, end, weight] = sorted[i];
        
        // Binary search for last non-overlapping interval
        let lo = 0, hi = i - 1, bestJ = -1;
        while (lo <= hi) {
            const mid = Math.floor((lo + hi) / 2);
            if (sorted[mid][1] <= start) {
                bestJ = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        
        // Option 1: Include current
        let include = weight;
        if (bestJ !== -1) {
            include += dp[bestJ];
        }
        
        // Option 2: Exclude current
        const exclude = dp[i - 1];
        
        dp[i] = Math.max(include, exclude);
    }
    
    return dp[n - 1];
}

/**
 * Merge overlapping intervals
 * @param {number[][]} intervals - Array of [start, end] pairs
 * @returns {number[][]} Merged intervals
 */
function mergeIntervals(intervals) {
    if (!intervals || intervals.length === 0) {
        return [];
    }
    
    // Sort by start time for merging
    const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
    
    const merged = [sorted[0]];
    
    for (let i = 1; i < sorted.length; i++) {
        const last = merged[merged.length - 1];
        const current = sorted[i];
        
        if (current[0] <= last[1]) {
            // Overlapping - merge
            last[1] = Math.max(last[1], current[1]);
        } else {
            // Non-overlapping - add new
            merged.push(current);
        }
    }
    
    return merged;
}

/**
 * Interval partitioning - minimum number of resources needed
 * LeetCode 253 - Meeting Rooms II
 * @param {number[][]} intervals - Array of [start, end] pairs
 * @returns {number} Minimum number of resources needed
 */
function minMeetingRooms(intervals) {
    if (!intervals || intervals.length === 0) {
        return 0;
    }
    
    // Extract start and end times
    const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
    const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
    
    let rooms = 0;
    let endPtr = 0;
    
    for (let i = 0; i < intervals.length; i++) {
        if (starts[i] >= ends[endPtr]) {
            // A meeting has ended, reuse the room
            endPtr++;
        } else {
            // Need a new room
            rooms++;
        }
    }
    
    return rooms;
}

// Example usage and demonstration
console.log("=".repeat(60));
console.log("INTERVAL SCHEDULING DEMONSTRATION");
console.log("=".repeat(60));

// Example 1: Basic interval scheduling
const intervals = [[1, 4], [2, 3], [3, 4], [5, 7], [6, 8], [8, 10]];
console.log("\nExample 1: Basic Interval Scheduling");
console.log("Intervals:", JSON.stringify(intervals));
console.log("Maximum non-overlapping:", intervalSchedulingMax([...intervals]));
console.log("Selected:", JSON.stringify(intervalSchedulingSelect(intervals)));
console.log("Minimum to remove:", minIntervalsToRemove([...intervals]));

// Example 2: Already sorted
const intervals2 = [[1, 2], [2, 3], [3, 4], [4, 5]];
console.log("\nExample 2: Adjacent Intervals");
console.log("Intervals:", JSON.stringify(intervals2));
console.log("Maximum non-overlapping:", intervalSchedulingMax([...intervals2]));

// Example 3: All overlapping
const intervals3 = [[1, 10], [2, 9], [3, 8]];
console.log("\nExample 3: All Overlapping");
console.log("Intervals:", JSON.stringify(intervals3));
console.log("Maximum non-overlapping:", intervalSchedulingMax([...intervals3]));

// Example 4: Weighted
const weighted = [[1, 3, 50], [2, 5, 20], [4, 6, 30], [6, 7, 40]];
console.log("\nExample 4: Weighted Interval Scheduling");
console.log("Weighted intervals (start, end, weight):", JSON.stringify(weighted));
console.log("Maximum weight:", weightedIntervalScheduling(weighted));

// Example 5: Meeting rooms
const meetings = [[0, 30], [5, 10], [15, 20]];
console.log("\nExample 5: Meeting Rooms II");
console.log("Meetings:", JSON.stringify(meetings));
console.log("Minimum rooms needed:", minMeetingRooms(meetings));
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Sorting** | O(n log n) | Dominated by sorting intervals by end time |
| **Greedy Selection** | O(n) | Single pass through sorted intervals |
| **Total** | **O(n log n)** | Overall time complexity |

### Detailed Breakdown

**Greedy Interval Scheduling:**
- **Sorting**: O(n log n) using comparison-based sort (Timsort in Python, Dual-Pivot Quicksort in Java)
- **Selection**: O(n) - single linear scan through intervals
- **Total**: O(n log n) + O(n) = **O(n log n)**

**Weighted Interval Scheduling (with Binary Search):**
- **Sorting**: O(n log n)
- **DP with binary search**: O(n log n) - each of n intervals requires O(log n) binary search
- **Total**: **O(n log n)**

**Weighted Interval Scheduling (without Binary Search):**
- **Sorting**: O(n log n)
- **DP with linear scan**: O(n²) - each interval scans all previous
- **Total**: **O(n²)**

---

## Space Complexity Analysis

| Approach | Space Complexity | Description |
|----------|------------------|-------------|
| **Basic Greedy** | O(1) | Only need count and last_end variables |
| **With Selection** | O(n) | Store selected intervals |
| **Weighted DP** | O(n) | DP array for storing intermediate results |

### Detailed Breakdown

- **Greedy (count only)**: O(1) auxiliary space (in-place sort)
- **Greedy (with selection)**: O(n) for storing selected intervals
- **Weighted DP**: O(n) for DP array + O(n) for sorted intervals = O(n)
- **Interval Partitioning**: O(n) for storing start/end arrays

---

## Common Variations

### 1. Weighted Interval Scheduling

When intervals have different values/profits, use dynamic programming instead of greedy:

```
Problem: Select intervals to maximize total weight (not count)
Approach: DP with binary search for O(n log n)
Recurrence: dp[i] = max(dp[i-1], weight[i] + dp[p[i]])
where p[i] is the last interval that doesn't overlap with i
```

### 2. Interval Partitioning (Meeting Rooms II)

Find minimum number of resources (rooms) needed to schedule all intervals:

```
Problem: LeetCode 253 - Meeting Rooms II
Approach: Sort starts and ends separately, use two-pointer technique
Time: O(n log n), Space: O(n)
```

### 3. Interval Merging

Merge all overlapping intervals into a single interval:

```
Problem: LeetCode 56 - Merge Intervals
Approach: Sort by start time, then merge overlapping
Time: O(n log n), Space: O(n)
```

### 4. Insert Interval

Insert a new interval into existing set, merging if necessary:

```
Problem: LeetCode 57 - Insert Interval
Approach: Find position, insert, then merge adjacent if needed
Time: O(n), Space: O(n)
```

### 5. Find Minimum Arrows to Burst Balloons

```
Problem: LeetCode 452 - Minimum Number of Arrows to Burst Balloons
Approach: Similar to interval scheduling - sort by end, count when new arrow needed
Time: O(n log n), Space: O(1)
```

---

## Practice Problems

### Problem 1: Non-overlapping Intervals

**Problem:** [LeetCode 435 - Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)

**Description:** Given an array of intervals where `intervals[i] = [starti, endi]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

**How to Apply:**
- This is the inverse of interval scheduling
- Find maximum non-overlapping intervals using greedy
- Answer = total intervals - max non-overlapping
- Sort by end time, count compatible intervals

**Key Insight:** `answer = n - interval_scheduling_max(intervals)`

---

### Problem 2: Meeting Rooms II

**Problem:** [LeetCode 253 - Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)

**Description:** Given an array of meeting time intervals consisting of start and end times, find the minimum number of conference rooms required.

**How to Apply:**
- This is the interval partitioning problem
- Sort start times and end times separately
- Use two pointers: when a meeting starts before one ends, need a new room
- Answer is the maximum number of concurrent meetings

**Alternative Approach:** Min-heap to track end times of ongoing meetings

---

### Problem 3: Data Stream as Disjoint Intervals

**Problem:** [LeetCode 352 - Data Stream as Disjoint Intervals](https://leetcode.com/problems/data-stream-as-disjoint-intervals/)

**Description:** Given a data stream input of non-negative integers, summarize the numbers seen so far as a list of disjoint intervals.

**How to Apply:**
- Use TreeMap (Java) or SortedDict (Python) to maintain intervals
- When adding a number, merge with adjacent intervals if they touch
- Keep intervals sorted by start time for O(log n) insertion

**Time Complexity:** O(log n) per addNum, O(n) per getIntervals

---

### Problem 4: Minimum Number of Arrows to Burst Balloons

**Problem:** [LeetCode 452 - Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/)

**Description:** There are some spherical balloons taped onto a flat wall. An arrow shot vertically can burst a balloon if the arrow's position is within the balloon's horizontal diameter. Find the minimum number of arrows that must be shot to burst all balloons.

**How to Apply:**
- Each balloon is an interval [xstart, xend]
- Sort by end coordinate (greedy)
- Shoot arrow at first balloon's end, burst all overlapping
- Move to next non-overlapping balloon
- Same algorithm as interval scheduling!

---

### Problem 5: Maximum Length of Pair Chain

**Problem:** [LeetCode 646 - Maximum Length of Pair Chain](https://leetcode.com/problems/maximum-length-of-pair-chain/)

**Description:** You are given an array of n pairs where `pairs[i] = [lefti, righti]` and `lefti < righti`. A pair `p2 = [c, d]` follows a pair `p1 = [a, b]` if `b < c`. A chain of pairs can be formed in this fashion. Return the length of the longest chain which can be formed.

**How to Apply:**
- This is exactly the interval scheduling problem
- Sort by second element (righti)
- Greedily select pairs that can follow the previous one
- Classic greedy: O(n log n) time, O(1) space

---

## Video Tutorial Links

### Fundamentals

- **[Interval Scheduling - Greedy Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=hVhOeaONg1Y)** - Comprehensive explanation with visualizations
- **[Activity Selection Problem (Abdul Bari)](https://www.youtube.com/watch?v=poWB2UCuozA)** - Step-by-step greedy algorithm explanation
- **[Greedy Algorithm - Interval Scheduling (MIT OpenCourseWare)](https://www.youtube.com/watch?v=HoCGU-wA1w4)** - Academic perspective with proofs
- **[LeetCode 435 - Non-overlapping Intervals (NeetCode)](https://www.youtube.com/watch?v=nONCGxWoUfM)** - Practical interview problem solving

### Advanced Topics

- **[Weighted Interval Scheduling (WilliamFiset)](https://www.youtube.com/watch?v=cr6Ip0J9izc)** - Dynamic programming approach
- **[Interval Partitioning - Meeting Rooms II](https://www.youtube.com/watch?v=NKf1OJkEZ2o)** - Greedy for resource allocation
- **[Interval Problems Pattern (NeetCode)](https://www.youtube.com/watch?v=44H3cEC2fFM)** - Common interval problem patterns

---

## Follow-up Questions

### Q1: Why does sorting by end time work, but sorting by start time doesn't?

**Answer:** 
- **End time sorting**: Selecting the interval that ends earliest leaves maximum room for future intervals. This is provably optimal.
- **Start time sorting**: Selecting by earliest start might pick a very long interval that blocks many shorter ones.

**Counter-example for start-time sorting:**
```
Intervals: [(1, 100), (2, 3), (3, 4), (4, 5)]
By start time: Select (1,100) → blocks all others → result: 1
By end time: Select (2,3), (3,4), (4,5) → result: 3 ✓
```

### Q2: Can we use dynamic programming for the unweighted interval scheduling problem?

**Answer:** Yes, but it's overkill:
- **DP solution**: O(n²) or O(n log n) with binary search
- **Greedy solution**: O(n log n) with simpler code

DP is necessary only for **weighted** interval scheduling where greedy fails.

### Q3: How do we handle intervals that can touch (start == end of previous)?

**Answer:** The condition `start >= last_end` naturally handles this:
- If `start == last_end`, intervals touch but don't overlap
- This is typically allowed in interval scheduling
- If strict non-overlapping required (start > last_end), change the condition

### Q4: What if intervals are given in a streaming fashion (online)?

**Answer:** 
- **Greedy doesn't work online** - you need to see all intervals to sort
- **Online approaches**: 
  - If intervals arrive sorted by end time: greedy works in O(n)
  - Otherwise: need more complex data structures or approximation algorithms
  - Consider using a segment tree or interval tree for dynamic insertion

### Q5: How does interval scheduling relate to other greedy problems?

**Answer:** Many greedy problems use similar strategies:

| Problem | Greedy Strategy |
|---------|----------------|
| Interval Scheduling | Earliest finish time |
| Fractional Knapsack | Highest value/weight ratio |
| Huffman Coding | Lowest frequency first |
| Dijkstra's Algorithm | Shortest distance first |
| Prim's/Kruskal's | Minimum edge weight |

All rely on the **greedy choice property**: local optimal choices lead to global optimum.

---

## Summary

The Interval Scheduling algorithm is a fundamental greedy technique for maximizing the number of non-overlapping activities. Key takeaways:

### Core Strategy
- **Sort by end time**: O(n log n)
- **Greedy selection**: Always pick the interval that ends earliest
- **Proof**: Greedy exchange argument shows this is optimal

### Time & Space Complexity
| Metric | Complexity |
|--------|------------|
| Time | O(n log n) |
| Space | O(1) or O(n) |

### When to Use
- ✅ Maximizing throughput on a single resource
- ✅ All intervals have equal value
- ✅ Need simple, fast solution
- ❌ Intervals have different weights (use DP instead)
- ❌ Need to minimize resources (use interval partitioning)

### Common Variations
1. **Weighted Interval Scheduling** → Use DP (O(n log n))
2. **Interval Partitioning** → Min resources needed (Meeting Rooms II)
3. **Interval Merging** → Combine overlapping intervals
4. **Minimum Removals** → Inverse of max scheduling (LeetCode 435)

### Related Problems
- [435. Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)
- [253. Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)
- [452. Minimum Number of Arrows](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/)
- [646. Maximum Length of Pair Chain](https://leetcode.com/problems/maximum-length-of-pair-chain/)

---

## Related Algorithms

- [Segment Tree](./segment-tree.md) - For dynamic interval queries
- [Fenwick Tree](./fenwick-tree.md) - For prefix sum operations
- [Dynamic Programming](./dynamic-programming.md) - For weighted interval scheduling
- [Merge Intervals](./merge-intervals.md) - For combining overlapping intervals
- [Meeting Rooms](./meeting-rooms.md) - For interval partitioning problems
