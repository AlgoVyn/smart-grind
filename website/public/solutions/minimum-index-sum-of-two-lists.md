# Minimum Index Sum Of Two Lists

## Problem Description

Given two arrays of strings `list1` and `list2`, find the common strings with the least index sum.

A common string is a string that appeared in both `list1` and `list2`. A common string with the least index sum is a common string such that if it appeared at `list1[i]` and `list2[j]`, then `i + j` should be the minimum value among all the other common strings.

Return all the common strings with the least index sum. Return the answer in any order.

**LeetCode Link:** [LeetCode 599 - Minimum Index Sum of Two Lists](https://leetcode.com/problems/minimum-index-sum-of-two-lists/)

---

## Examples

### Example 1

**Input:**
```python
list1 = ["Shogun", "Tapioca Express", "Burger King", "KFC"]
list2 = ["Piatti", "The Grill at Torrey Pines", "Hungry Hunter Steakhouse", "Shogun"]
```

**Output:**
```python
["Shogun"]
```

**Explanation:**
The only common string is "Shogun".

### Example 2

**Input:**
```python
list1 = ["Shogun", "Tapioca Express", "Burger King", "KFC"]
list2 = ["KFC", "Shogun", "Burger King"]
```

**Output:**
```python
["Shogun"]
```

**Explanation:**
The common string with the least index sum is "Shogun" with index sum = (0 + 1) = 1.

### Example 3

**Input:**
```python
list1 = ["happy", "sad", "good"]
list2 = ["sad", "happy", "good"]
```

**Output:**
```python
["sad", "happy"]
```

**Explanation:**
There are three common strings:
- "happy" with index sum = (0 + 1) = 1
- "sad" with index sum = (1 + 0) = 1
- "good" with index sum = (2 + 2) = 4

The strings with the least index sum are "sad" and "happy".

---

## Constraints

- `1 <= list1.length, list2.length <= 1000`
- `1 <= list1[i].length, list2[i].length <= 30`
- `list1[i]` and `list2[i]` consist of spaces ' ' and English letters
- All the strings of `list1` are unique
- All the strings of `list2` are unique
- There is at least a common string between `list1` and `list2`

---

## Pattern: Hash Map

This problem uses a **hash map** for O(1) lookups. Build a dictionary from list1 mapping strings to their indices, then iterate through list2 to find common strings and compute index sums.

---

## Intuition

The key insight for this problem is that we need to find strings that exist in both lists and minimize the sum of their positions (indices) in each list.

### Key Observations

1. **Hash Map for Fast Lookup**: Since we need to find if a string from list2 exists in list1, using a hash map provides O(1) lookup time.

2. **Single Pass Through List2**: Once we have the map of list1, we only need to iterate through list2 once to find common strings and compute their index sums.

3. **Track Minimum Sum**: Keep track of the minimum index sum found so far, and collect all strings that achieve this minimum.

4. **Edge Case - Multiple Results**: There can be multiple strings with the same minimum index sum, so we need to collect all of them.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Hash Map** - Optimal solution (O(m + n))
2. **Nested Loop** - For understanding (O(m × n))

---

## Approach 1: Hash Map (Optimal)

### Algorithm Steps

1. Build a dictionary from list1: map each string to its index
2. Initialize min_sum to infinity and empty result list
3. Iterate through list2:
   - If string exists in list1, calculate index sum
   - If sum < min_sum: update min_sum and reset result
   - If sum == min_sum: add to result
4. Return result

### Why It Works

The hash map provides O(1) lookup, making the overall algorithm O(m + n) where m and n are the lengths of the lists.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findRestaurant(self, list1: List[str], list2: List[str]) -> List[str]:
        """
        Find common strings with minimum index sum using a hash map.
        
        Time: O(m + n), Space: O(m)
        """
        # Build dictionary from list1 strings to their indices
        index1 = {s: i for i, s in enumerate(list1)}
        
        min_sum = float('inf')
        result = []
        
        # Iterate through list2 and find common strings
        for i, s in enumerate(list2):
            if s in index1:
                current_sum = i + index1[s]
                if current_sum < min_sum:
                    min_sum = current_sum
                    result = [s]
                elif current_sum == min_sum:
                    result.append(s)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <string>
#include <climits>
using namespace std;

class Solution {
public:
    vector<string> findRestaurant(vector<string>& list1, vector<string>& list2) {
        unordered_map<string, int> index1;
        
        // Build dictionary from list1
        for (int i = 0; i < list1.size(); i++) {
            index1[list1[i]] = i;
        }
        
        int min_sum = INT_MAX;
        vector<string> result;
        
        // Iterate through list2
        for (int i = 0; i < list2.size(); i++) {
            auto it = index1.find(list2[i]);
            if (it != index1.end()) {
                int current_sum = i + it->second;
                if (current_sum < min_sum) {
                    min_sum = current_sum;
                    result.clear();
                    result.push_back(list2[i]);
                } else if (current_sum == min_sum) {
                    result.push_back(list2[i]);
                }
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public String[] findRestaurant(String[] list1, String[] list2) {
        Map<String, Integer> index1 = new HashMap<>();
        
        // Build dictionary from list1
        for (int i = 0; i < list1.length; i++) {
            index1.put(list1[i], i);
        }
        
        int min_sum = Integer.MAX_VALUE;
        List<String> result = new ArrayList<>();
        
        // Iterate through list2
        for (int i = 0; i < list2.length; i++) {
            if (index1.containsKey(list2[i])) {
                int current_sum = i + index1.get(list2[i]);
                if (current_sum < min_sum) {
                    min_sum = current_sum;
                    result.clear();
                    result.add(list2[i]);
                } else if (current_sum == min_sum) {
                    result.add(list2[i]);
                }
            }
        }
        
        return result.toArray(new String[0]);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string[]} list1
 * @param {string[]} list2
 * @return {string[]}
 */
var findRestaurant = function(list1, list2) {
    // Build dictionary from list1
    const index1 = {};
    for (let i = 0; i < list1.length; i++) {
        index1[list1[i]] = i;
    }
    
    let min_sum = Infinity;
    const result = [];
    
    // Iterate through list2
    for (let i = 0; i < list2.length; i++) {
        if (list2[i] in index1) {
            const current_sum = i + index1[list2[i]];
            if (current_sum < min_sum) {
                min_sum = current_sum;
                result.length = 0;
                result.push(list2[i]);
            } else if (current_sum === min_sum) {
                result.push(list2[i]);
            }
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m + n), building map + iterating through list2 |
| **Space** | O(m), for storing list1 indices in hash map |

---

## Approach 2: Nested Loop (For Understanding)

### Algorithm Steps

1. For each string in list1:
   - Iterate through list2
   - If match found, calculate index sum
   - Track minimum and collect results

### Why It Works

This is the straightforward approach but inefficient. Works for understanding but too slow for large inputs.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findRestaurant(self, list1: List[str], list2: List[str]) -> List[str]:
        """
        Brute force approach - for understanding only.
        
        Time: O(m * n), Space: O(1)
        """
        min_sum = float('inf')
        result = []
        
        for i, s1 in enumerate(list1):
            for j, s2 in enumerate(list2):
                if s1 == s2:
                    current_sum = i + j
                    if current_sum < min_sum:
                        min_sum = current_sum
                        result = [s1]
                    elif current_sum == min_sum:
                        result.append(s1)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <climits>
using namespace std;

class Solution {
public:
    vector<string> findRestaurant(vector<string>& list1, vector<string>& list2) {
        int min_sum = INT_MAX;
        vector<string> result;
        
        for (int i = 0; i < list1.size(); i++) {
            for (int j = 0; j < list2.size(); j++) {
                if (list1[i] == list2[j]) {
                    int current_sum = i + j;
                    if (current_sum < min_sum) {
                        min_sum = current_sum;
                        result.clear();
                        result.push_back(list1[i]);
                    } else if (current_sum == min_sum) {
                        result.push_back(list1[i]);
                    }
                }
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String[] findRestaurant(String[] list1, String[] list2) {
        int min_sum = Integer.MAX_VALUE;
        List<String> result = new ArrayList<>();
        
        for (int i = 0; i < list1.length; i++) {
            for (int j = 0; j < list2.length; j++) {
                if (list1[i].equals(list2[j])) {
                    int current_sum = i + j;
                    if (current_sum < min_sum) {
                        min_sum = current_sum;
                        result.clear();
                        result.add(list1[i]);
                    } else if (current_sum == min_sum) {
                        result.add(list1[i]);
                    }
                }
            }
        }
        
        return result.toArray(new String[0]);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string[]} list1
 * @param {string[]} list2
 * @return {string[]}
 */
var findRestaurant = function(list1, list2) {
    let min_sum = Infinity;
    const result = [];
    
    for (let i = 0; i < list1.length; i++) {
        for (let j = 0; j < list2.length; j++) {
            if (list1[i] === list2[j]) {
                const current_sum = i + j;
                if (current_sum < min_sum) {
                    min_sum = current_sum;
                    result.length = 0;
                    result.push(list1[i]);
                } else if (current_sum === min_sum) {
                    result.push(list1[i]);
                }
            }
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n), nested loop |
| **Space** | O(1), excluding result |

---

## Comparison of Approaches

| Aspect | Hash Map | Nested Loop |
|--------|----------|-------------|
| **Time Complexity** | O(m + n) | O(m × n) |
| **Space Complexity** | O(m) | O(1) |
| **LeetCode Optimal** | ✅ | ❌ (too slow) |

**Best Approach:** Use Approach 1 (Hash Map) for optimal solution.

---

## Common Pitfalls

- **Not handling multiple results**: When multiple strings have the same minimum index sum, add them all to the result, not just one.
- **Initial min_sum value**: Use `float('inf')` to ensure any actual sum is smaller.
- **Order of iteration matters**: Iterate through the smaller list first to potentially reduce lookups, though both work.
- **Edge case: no common strings**: Problem guarantees at least one common string.

---

## Related Problems

Based on similar themes (Hash Map, String Intersection):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Intersection of Two Arrays | [Link](https://leetcode.com/problems/intersection-of-two-arrays/) | Find common elements |
| Intersection of Two Arrays II | [Link](https://leetcode.com/problems/intersection-of-two-arrays-ii/) | Find common with duplicates |
| Find Common Characters | [Link](https://leetcode.com/problems/find-common-characters/) | Similar string problem |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode - Minimum Index Sum of Two Lists](https://www.youtube.com/watch?v=8X4t2_jDTSQ)** - Clear explanation with examples
2. **[LeetCode 599 - Solution Walkthrough](https://www.youtube.com/watch?v=qBczs3fNn9k)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: What if you needed to find the maximum index sum instead of minimum?

**Answer:** Simply change the comparison logic - instead of tracking minimum, track maximum. Initialize min_sum to -1 and use `>` instead of `<`.

---

### Q2: How would you handle it if lists contained duplicates?

**Answer:** The problem states lists have unique strings, but if they didn't, you'd need to track all occurrences of each string and consider each pair's sum.

---

### Q3: What if you needed to return the result sorted by index sum?

**Answer:** Instead of collecting during iteration, store all (string, sum) pairs in a list, sort by sum, and return all with minimum sum.

---

### Q4: How would you optimize if one list is much larger than the other?

**Answer:** Build the hash map from the smaller list to minimize space usage. The algorithm remains O(m + n) time complexity.

---

### Q5: Can you solve this without extra space?

**Answer:** Yes, using nested loops (Approach 2), but it would be O(m × n) time with O(1) space, which is inefficient for large lists.

---

## Summary

The **Minimum Index Sum of Two Lists** problem demonstrates the power of **Hash Maps** for efficient string lookups.

Key takeaways:
1. Build a hash map from one list for O(1) lookups
2. Iterate through the other list to find common strings
3. Track minimum sum and collect all strings achieving it
4. Time complexity O(m + n), space O(m)

This problem is essential for understanding hash map applications in string comparison problems.

### Pattern Summary

This problem exemplifies the **Hash Map** pattern, characterized by:
- Using dictionary/map for O(1) lookups
- Building index mapping from one collection
- Single pass through second collection
- Efficient time with moderate space

For more details on this pattern and its variations, see the **[Hash Map Pattern](/patterns/hash-map)**.
