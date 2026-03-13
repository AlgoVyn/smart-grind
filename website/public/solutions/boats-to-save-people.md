# Boats To Save People

## Problem Description

You are given an array `people` where `people[i]` is the weight of the ith person, and an infinite number of boats where each boat can carry a maximum weight of `limit`. Each boat carries at most two people at the same time, provided the sum of the weight of those people is at most `limit`.

Return the minimum number of boats to carry every given person.

**Link to problem:** [Boats to Save People - LeetCode 881](https://leetcode.com/problems/boats-to-save-people/)

---

## Pattern: Two Pointers - Greedy Pairing

This problem exemplifies the **Two Pointers - Greedy Pairing** pattern. The key insight is to pair the heaviest person with the lightest person possible to minimize the number of boats.

### Core Concept

The greedy strategy is:
1. Sort the people by weight
2. Pair the heaviest person with the lightest person
3. If they can share a boat, great; otherwise, the heaviest goes alone
4. Repeat until all people are assigned

This is optimal because pairing the heaviest with the lightest maximizes the chance of fitting two people together.

---

## Examples

### Example

**Input:**
```
people = [1,2], limit = 3
```

**Output:**
```
1
```

**Explanation:** 1 boat (1, 2) - weights 1 + 2 = 3 ≤ 3 ✓

### Example 2

**Input:**
```
people = [3,2,2,1], limit = 3
```

**Output:**
```
3
```

**Explanation:** 
- Boat 1: (1, 2) - weights 1 + 2 = 3 ≤ 3 ✓
- Boat 2: (2) - alone
- Boat 3: (3) - alone
- Total: 3 boats

### Example 3

**Input:**
```
people = [3,5,3,4], limit = 5
```

**Output:**
```
4
```

**Explanation:** 
- Each person needs their own boat since no two can pair:
- Boat 1: (3), Boat 2: (5), Boat 3: (3), Boat 4: (4)
- Total: 4 boats

---

## Constraints

- `1 <= people.length <= 5 * 10^4`
- `1 <= people[i] <= limit <= 3 * 10^4`

---

## Intuition

The key insight is the greedy pairing:

1. **Why pair heaviest with lightest?**
   - If the heaviest person can't pair with the lightest, they can't pair with ANYONE
   - This is because all other people are heavier than the lightest
   - So we might as well try pairing with the lightest first

2. **Why is this optimal?**
   - Each boat can carry at most 2 people
   - We want to minimize boats, so maximize 2-person boats
   - The heaviest person has the most restrictive weight requirement
   - By trying to pair them with the lightest, we maximize success probability

### Visual Example

For `people = [3,2,2,1]` and `limit = 3`:

```
Sort: [1, 2, 2, 3]

Step 1: left=0, right=3
- heaviest=3, lightest=1
- 3+1=4 > 3, can't pair
- heaviest goes alone
- boats=1, right=2

Step 2: left=0, right=2  
- heaviest=2, lightest=1
- 2+1=3 <= 3, pair!
- boats=2, left=1, right=1

Step 3: left=1, right=1
- heaviest=2, lightest=2
- 2+2=4 > 3, can't pair
- heaviest goes alone
- boats=3, left=1, right=0

Done! Result: 3 boats
```

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Two Pointers Greedy (Optimal)** - O(n log n) time, O(1) space
2. **Counting Sort (Optimized)** - O(n + limit) time, O(limit) space
3. **Binary Search** - O(n log n) time, O(n) space

---

## Approach 1: Two Pointers Greedy (Optimal)

This is the most efficient approach using two pointers with greedy pairing.

### Algorithm Steps

1. Sort the people array
2. Initialize `left = 0` (lightest), `right = len(people) - 1` (heaviest), `boats = 0`
3. While `left <= right`:
   - If `people[left] + people[right] <= limit`:
     - They can share a boat: increment both `left` and `right`
   - Otherwise:
     - Heaviest goes alone: only decrement `right`
   - Always increment `boats`
4. Return `boats`

### Why It Works

The greedy approach works because:
- Heaviest person has the most restrictive requirement
- If heaviest + lightest > limit, heaviest must go alone
- Otherwise, they can share (this is optimal since lightest is the best pairing candidate)

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def numRescueBoats(self, people: List[int], limit: int) -> int:
        """
        Find minimum boats using two pointers greedy approach.
        
        Args:
            people: List of person weights
            limit: Maximum weight capacity of each boat
            
        Returns:
            Minimum number of boats needed
        """
        people.sort()
        left, right = 0, len(people) - 1
        boats = 0
        
        while left <= right:
            # Check if lightest and heaviest can share
            if people[left] + people[right] <= limit:
                left += 1  # Lightest person boards
            
            # Heaviest always boards (alone or with lightest)
            right -= 1
            boats += 1
        
        return boats
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    /**
     * Find minimum boats using two pointers greedy approach.
     * 
     * @param people List of person weights
     * @param limit Maximum weight capacity of each boat
     * @return Minimum number of boats needed
     */
    int numRescueBoats(vector<int>& people, int limit) {
        sort(people.begin(), people.end());
        int left = 0;
        int right = people.size() - 1;
        int boats = 0;
        
        while (left <= right) {
            // Check if lightest and heaviest can share
            if (people[left] + people[right] <= limit) {
                left++;  // Lightest person boards
            }
            // Heaviest always boards (alone or with lightest)
            right--;
            boats++;
        }
        
        return boats;
    }
};
```

<!-- slide -->
```java
import java.util.Arrays;

class Solution {
    /**
     * Find minimum boats using two pointers greedy approach.
     * 
     * @param people List of person weights
     * @param limit Maximum weight capacity of each boat
     * @return Minimum number of boats needed
     */
    public int numRescueBoats(int[] people, int limit) {
        Arrays.sort(people);
        int left = 0;
        int right = people.length - 1;
        int boats = 0;
        
        while (left <= right) {
            // Check if lightest and heaviest can share
            if (people[left] + people[right] <= limit) {
                left++;  // Lightest person boards
            }
            // Heaviest always boards (alone or with lightest)
            right--;
            boats++;
        }
        
        return boats;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} people
 * @param {number} limit
 * @return {number}
 */
var numRescueBoats = function(people, limit) {
    people.sort((a, b) => a - b);
    let left = 0;
    let right = people.length - 1;
    let boats = 0;
    
    while (left <= right) {
        // Check if lightest and heaviest can share
        if (people[left] + people[right] <= limit) {
            left++;  // Lightest person boards
        }
        // Heaviest always boards (alone or with lightest)
        right--;
        boats++;
    }
    
    return boats;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - Sorting dominates, two pointers is O(n) |
| **Space** | O(1) - Only a few variables used |

---

## Approach 2: Counting Sort (Optimized)

This approach uses counting sort when the limit is relatively small, achieving O(n + limit) time.

### Algorithm Steps

1. Create a count array of size `limit + 1`
2. Count occurrences of each weight
3. Process from lightest to heaviest, greedily pairing

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def numRescueBoats_counting(self, people: List[int], limit: int) -> int:
        """
        Find minimum boats using counting sort optimization.
        """
        if not people:
            return 0
        
        # Counting sort - O(n + limit)
        count = [0] * (limit + 1)
        for weight in people:
            count[weight] += 1
        
        boats = 0
        lightest = 0
        heaviest = limit
        
        while lightest <= heaviest:
            # Move heaviest to next person with weight
            while lightest <= heaviest and count[heaviest] == 0:
                heaviest -= 1
            
            if lightest > heaviest:
                break
            
            count[heaviest] -= 1
            boats += 1
            
            # Try to pair with lightest
            if lightest <= heaviest and lightest + heaviest <= limit:
                while lightest <= heaviest and count[lightest] == 0:
                    lightest += 1
                if lightest <= heaviest:
                    count[lightest] -= 1
        
        return boats
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int numRescueBoats(vector<int>& people, int limit) {
        vector<int> count(limit + 1, 0);
        for (int w : people) count[w]++;
        
        int boats = 0;
        int lightest = 0, heaviest = limit;
        
        while (lightest <= heaviest) {
            while (lightest <= heaviest && count[heaviest] == 0) heaviest--;
            if (lightest > heaviest) break;
            
            count[heaviest]--;
            boats++;
            
            if (lightest <= heaviest && lightest + heaviest <= limit) {
                while (lightest <= heaviest && count[lightest] == 0) lightest++;
                if (lightest <= heaviest) count[lightest]--;
            }
        }
        
        return boats;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int numRescueBoats(int[] people, int limit) {
        int[] count = new int[limit + 1];
        for (int w : people) count[w]++;
        
        int boats = 0;
        int lightest = 0;
        int heaviest = limit;
        
        while (lightest <= heaviest) {
            while (lightest <= heaviest && count[heaviest] == 0) heaviest--;
            if (lightest > heaviest) break;
            
            count[heaviest]--;
            boats++;
            
            if (lightest <= heaviest && lightest + heaviest <= limit) {
                while (lightest <= heaviest && count[lightest] == 0) lightest++;
                if (lightest <= heaviest) count[lightest]--;
            }
        }
        
        return boats;
    }
}
```

<!-- slide -->
```javascript
var numRescueBoats = function(people, limit) {
    const count = new Array(limit + 1).fill(0);
    for (const w of people) count[w]++;
    
    let boats = 0;
    let lightest = 0;
    let heaviest = limit;
    
    while (lightest <= heaviest) {
        while (lightest <= heaviest && count[heaviest] === 0) heaviest--;
        if (lightest > heaviest) break;
        
        count[heaviest]--;
        boats++;
        
        if (lightest <= heaviest && lightest + heaviest <= limit) {
            while (lightest <= heaviest && count[lightest] === 0) lightest++;
            if (lightest <= heaviest) count[lightest]--;
        }
    }
    
    return boats;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + limit) - Counting and processing |
| **Space** | O(limit) - Count array |

---

## Approach 3: Binary Search for Pairing

This approach uses binary search to find the optimal pairing partner.

### Code Implementation

````carousel
```python
from typing import List
import bisect

class Solution:
    def numRescueBoats_binary(self, people: List[int], limit: int) -> int:
        """
        Find minimum boats using binary search.
        """
        people.sort()
        boats = 0
        n = len(people)
        
        # Process heaviest first
        while people and people[-1] > 0:
            boats += 1
            heaviest = people.pop()
            
            # Binary search for lightest that can pair
            remaining_limit = limit - heaviest
            if remaining_limit >= 0 and people:
                idx = bisect.bisect_right(people, remaining_limit)
                if idx > 0:
                    people.pop(idx - 1)
        
        return boats
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int numRescueBoats(vector<int>& people, int limit) {
        sort(people.begin(), people.end());
        int boats = 0;
        
        while (!people.empty()) {
            boats++;
            int heaviest = people.back();
            people.pop_back();
            
            int remaining = limit - heaviest;
            if (!people.empty() && remaining >= 0) {
                auto it = upper_bound(people.begin(), people.end(), remaining);
                if (it != people.begin()) {
                    people.erase(it - 1);
                }
            }
        }
        
        return boats;
    }
};
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.Collections;

class Solution {
    public int numRescueBoats(int[] people, int limit) {
        Arrays.sort(people);
        List<Integer> list = new ArrayList<>();
        for (int p : people) list.add(p);
        
        int boats = 0;
        
        while (!list.isEmpty()) {
            boats++;
            int heaviest = list.remove(list.size() - 1);
            int remaining = limit - heaviest;
            
            if (!list.isEmpty() && remaining >= 0) {
                int idx = Collections.binarySearch(list, remaining);
                if (idx < 0) idx = -(idx + 1);
                if (idx > 0) list.remove(idx - 1);
            }
        }
        
        return boats;
    }
}
```

<!-- slide -->
```javascript
var numRescueBoats = function(people, limit) {
    people.sort((a, b) => a - b);
    let boats = 0;
    
    while (people.length > 0) {
        boats++;
        const heaviest = people.pop();
        const remaining = limit - heaviest;
        
        if (people.length > 0 && remaining >= 0) {
            const idx = people.findIndex(w => w > remaining);
            if (idx > 0) people.splice(idx - 1, 1);
        }
    }
    
    return boats;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - Sorting + binary search for each boat |
| **Space** | O(n) - Need to store array for removal |

---

## Comparison of Approaches

| Aspect | Two Pointers | Counting Sort | Binary Search |
|--------|-------------|---------------|---------------|
| **Time Complexity** | O(n log n) | O(n + limit) | O(n log n) |
| **Space Complexity** | O(1) | O(limit) | O(n) |
| **Implementation** | Simplest | Complex | Moderate |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Best For** | Most cases | Small limit | Variation |

**Best Approach:** The two pointers approach (Approach 1) is optimal with the simplest implementation.

---

## Why Greedy Works

The greedy approach is optimal because:

1. **Heaviest person constraint**: If heaviest + lightest > limit, heaviest MUST go alone
2. **Lightest best partner**: If heaviest can pair with anyone, pairing with lightest maximizes remaining capacity for others
3. **No backtracking needed**: Local optimal leads to global optimal

---

## Related Problems

### Same Pattern (Two Pointers Pairing)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Container With Most Water | [Link](https://leetcode.com/problems/container-with-most-water/) | Medium | Two pointers pairing |
| Pair Sum | [Link](https://leetcode.com/problems/pair-with-target-sum/) | Easy | Two pointers/Hash |
| Sort Colors | [Link](https://leetcode.com/problems/sort-colors/) | Medium | Dutch national flag |

### Similar Greedy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Two City Scheduling | [Link](https://leetcode.com/problems/two-city-scheduling/) | Greedy selection |
| Meeting Rooms II | [Link](https://leetcode.com/problems/meeting-rooms-ii/) | Interval scheduling |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Boats to Save People](https://www.youtube.com/watch?v=8hQPLSSjkMY)** - Clear explanation with visual examples

2. **[Back to Back SWE - Boats Problem](https://www.youtube.com/watch?v=8Q1nQkVGYQ8)** - Detailed walkthrough

3. **[Two Pointers Pattern](https://www.youtube.com/watch?v=0jN2cIoXK7Q)** - Understanding two pointers

4. **[Greedy Algorithms Explained](https://www.youtube.com/watch?v=1L2OiLDbJ6E)** - Greedy pattern

---

## Follow-up Questions

### Q1: What if each boat can carry at most 3 people?

**Answer:** The problem becomes more complex. You would need a different approach, possibly using a multiset or hash map to track available weights. The greedy pairing still works but with 3 people, you'd try to form groups of 3 first.

---

### Q2: How would you track which people are on each boat?

**Answer:** Maintain indices or IDs along with weights. When pairing, record the indices of paired individuals. Use a data structure to track assigned people.

---

### Q3: What if some people refuse to share a boat?

**Answer:** This becomes a graph coloring or matching problem. You would need to model refusals as edges and find a valid assignment using maximum matching algorithms.

---

### Q4: Can you do it in O(n) time without sorting?

**Answer:** Yes, using counting sort (Approach 2) achieves O(n + limit) time, which is effectively O(n) if limit is not too large.

---

### Q5: How would you handle this for multiple trips (same people, multiple days)?

**Answer:** This becomes an optimization problem. You would need to consider which people go on which day to minimize total boats used across all days.

---

### Q6: What edge cases should be tested?

**Answer:**
- Single person (return 1)
- All people can pair (return n/2)
- No one can pair (return n)
- All weights equal (can pair if 2*weight <= limit)
- Limit equals max weight (each person needs own boat)

---

### Q7: How would you modify for weighted boats (different limits)?

**Answer:** Sort boats by limit as well. Use a greedy assignment where you try to assign the heaviest person to the boat with most remaining capacity.

---

### Q8: What if there are life jackets with different capacities?

**Answer:** This is the "Life Boat" variation. The approach remains similar - pair heaviest with lightest possible jacket that fits, using a greedy strategy.

---

## Common Pitfalls

### 1. Forgetting to Sort
**Issue**: Not sorting the array before two pointers.

**Solution**: Always sort first. The algorithm depends on sorted order.

### 2. Wrong Pointer Movement
**Issue**: Moving wrong pointer in wrong condition.

**Solution**: Remember: heaviest always moves, lightest only moves when paired.

### 3. Off-by-One
**Issue**: Using `<` instead of `<=` in the while condition.

**Solution**: Use `<=` to handle the last person case correctly.

### 4. Not Handling All Same Weights
**Issue**: Edge case where all weights are the same.

**Solution**: Algorithm handles this correctly - pairs if 2*weight <= limit.

---

## Summary

The **Boats to Save People** problem demonstrates the power of greedy two-pointers:

- **Greedy pairing**: Heaviest with lightest
- **Optimal**: Maximizes 2-person boats
- **Simple**: O(n log n) with sorting

Key takeaways:
- **Two pointers**: Efficient for sorted arrays
- **Greedy**: Local optimal leads to global optimal
- **Optimal pairing**: Heaviest constraint is key

This problem is an excellent example of how understanding the constraints leads to elegant solutions.

### Pattern Summary

This problem exemplifies the **Two Pointers - Greedy Pairing** pattern, characterized by:
- Sorting before processing
- Pairing extremes (lightest and heaviest)
- Greedy local decisions

For more details on two pointers, see the **[Two Pointers](/algorithms/two-pointers)** section.
