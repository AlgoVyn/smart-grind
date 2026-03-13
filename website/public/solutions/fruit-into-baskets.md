# Fruit Into Baskets

## Problem Description

You are visiting a farm that has a single row of fruit trees arranged from left to right. The trees are represented by an integer array `fruits` where `fruits[i]` is the type of fruit the ith tree produces.

You want to collect as much fruit as possible. However, the owner has some strict rules that you must follow:
- You only have two baskets, and each basket can only hold a single type of fruit. There is no limit on the amount of fruit each basket can hold.
- Starting from any tree of your choice, you must pick exactly one fruit from every tree (including the start tree) while moving to the right. The picked fruits must fit in one of your baskets.
- Once you reach a tree with fruit that cannot fit in your baskets, you must stop.

Return the maximum number of fruits you can pick.

**Link to problem:** [Fruit Into Baskets - LeetCode 904](https://leetcode.com/problems/fruit-into-baskets/)

---

## Pattern: Sliding Window - Longest Subarray with K Distinct

This problem is a classic example of the **Sliding Window** pattern with exactly k distinct elements (k=2).

### Core Concept

The fundamental idea is maintaining a sliding window with at most 2 distinct fruit types:
- Use two pointers (left and right) to define the window
- Use a hashmap to count frequency of each fruit type
- Expand right pointer, add fruits to basket
- When more than 2 types, shrink from left
- Track maximum window size

---

## Examples

### Example

**Input:**
```
fruits = [1,2,1]
```

**Output:**
```
3
```

**Explanation:** We can pick from all 3 trees. The fruits are [1,2,1] and both baskets can hold type 1 and type 2.

### Example 2

**Input:**
```
fruits = [0,1,2,2]
```

**Output:**
```
3
```

**Explanation:** We can pick from trees [1,2,2] = 3 fruits. The two types are 1 and 2.

### Example 3

**Input:**
```
fruits = [1,2,3,2,2]
```

**Output:**
```
4
```

**Explanation:** We can pick from trees [2,3,2,2] = 4 fruits. Types 2 and 3.

### Example 4

**Input:**
```
fruits = [3,3,3,1,2,1,1,3,3,3]
```

**Output:**
```
4
```

**Explanation:** One optimal solution is from index 4 to 7: [1,2,1,1] = 4 fruits with types 1 and 2.

---

## Constraints

- `1 <= fruits.length <= 10^5`
- `0 <= fruits[i] < fruits.length`

---

## Intuition

The key insight is that we need to find the longest contiguous subarray with at most 2 distinct elements. This is exactly what the sliding window technique does efficiently.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Sliding Window with HashMap** - O(n) time, O(1) space (at most 2 keys)
2. **Sliding Window with Array** - O(n) time, O(1) space (if fruits are bounded)

---

## Approach 1: Sliding Window with HashMap (Optimal)

### Algorithm Steps

1. Initialize left = 0, max_len = 0, and an empty hashmap
2. For each right pointer position:
   - Add fruits[right] to hashmap (increment count)
   - While hashmap has more than 2 distinct types:
     - Decrement fruits[left] count
     - If count becomes 0, remove from hashmap
     - Increment left
   - Update max_len = max(max_len, right - left + 1)
3. Return max_len

### Why It Works

The sliding window always maintains the longest subarray ending at right that has at most 2 distinct elements. When we encounter a 3rd type, we shrink from left until we have at most 2 types again.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def totalFruit(self, fruits: List[int]) -> int:
        """
        Find maximum fruits that can be collected with 2 basket types.
        
        Args:
            fruits: Array representing fruit types at each tree
            
        Returns:
            Maximum number of fruits that can be collected
        """
        count = defaultdict(int)
        left = 0
        max_len = 0
        
        for right, fruit in enumerate(fruits):
            count[fruit] += 1
            
            # Shrink window until we have at most 2 types
            while len(count) > 2:
                left_fruit = fruits[left]
                count[left_fruit] -= 1
                if count[left_fruit] == 0:
                    del count[left_fruit]
                left += 1
            
            # Update maximum length
            max_len = max(max_len, right - left + 1)
        
        return max_len
```

<!-- slide -->
```cpp
class Solution {
public:
    int totalFruit(vector<int>& fruits) {
        /**
         * Find maximum fruits that can be collected with 2 basket types.
         * 
         * Args:
         *     fruits: Array representing fruit types at each tree
         * 
         * Returns:
         *     Maximum number of fruits that can be collected
         */
        unordered_map<int, int> count;
        int left = 0;
        int max_len = 0;
        
        for (int right = 0; right < fruits.size(); right++) {
            count[fruits[right]]++;
            
            while (count.size() > 2) {
                int left_fruit = fruits[left];
                count[left_fruit]--;
                if (count[left_fruit] == 0) {
                    count.erase(left_fruit);
                }
                left++;
            }
            
            max_len = max(max_len, right - left + 1);
        }
        
        return max_len;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int totalFruit(int[] fruits) {
        /**
         * Find maximum fruits that can be collected with 2 basket types.
         * 
         * Args:
         *     fruits: Array representing fruit types at each tree
         * 
         * Returns:
         *     Maximum number of fruits that can be collected
         */
        Map<Integer, Integer> count = new HashMap<>();
        int left = 0;
        int max_len = 0;
        
        for (int right = 0; right < fruits.length; right++) {
            count.put(fruits[right], count.getOrDefault(fruits[right], 0) + 1);
            
            while (count.size() > 2) {
                int left_fruit = fruits[left];
                int new_count = count.get(left_fruit) - 1;
                if (new_count == 0) {
                    count.remove(left_fruit);
                } else {
                    count.put(left_fruit, new_count);
                }
                left++;
            }
            
            max_len = Math.max(max_len, right - left + 1);
        }
        
        return max_len;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find maximum fruits that can be collected with 2 basket types.
 * 
 * @param {number[]} fruits - Array representing fruit types at each tree
 * @return {number} - Maximum number of fruits that can be collected
 */
var totalFruit = function(fruits) {
    const count = new Map();
    let left = 0;
    let max_len = 0;
    
    for (let right = 0; right < fruits.length; right++) {
        count.set(fruits[right], (count.get(fruits[right]) || 0) + 1);
        
        while (count.size() > 2) {
            const leftFruit = fruits[left];
            const newCount = count.get(leftFruit) - 1;
            if (newCount === 0) {
                count.delete(leftFruit);
            } else {
                count.set(leftFruit, newCount);
            }
            left++;
        }
        
        max_len = Math.max(max_len, right - left + 1);
    }
    
    return max_len;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each fruit is added and removed at most once |
| **Space** | O(1) - At most 2 keys in hashmap |

---

## Approach 2: Optimized Sliding Window

### Algorithm Steps

Since we only need 2 types, we can optimize by tracking the last two types and their positions.

### Code Implementation

````carousel
```python
class Solution:
    def totalFruit_optimized(self, fruits: List[int]) -> int:
        """
        Optimized sliding window without hashmap.
        """
        if len(fruits) <= 2:
            return len(fruits)
        
        max_len = 2
        left = 0
        
        # Track the two types and their counts
        type1, type2 = -1, -1
        count1, count2 = 0, 0
        
        for right, fruit in enumerate(fruits):
            if type1 == -1:
                type1 = fruit
                count1 = 1
            elif type2 == -1 and fruit != type1:
                type2 = fruit
                count2 = 1
            elif fruit == type1:
                count1 += 1
            elif fruit == type2:
                count2 += 1
            else:
                # Three types - need to shrink
                # Move left to remove oldest type
                while left < right and count1 > 0 and count2 > 0:
                    if fruits[left] == type1:
                        count1 -= 1
                    elif fruits[left] == type2:
                        count2 -= 1
                    left += 1
                
                # Now we have only one type in window
                if count1 == 0:
                    type1 = fruit
                    count1 = 1
                else:
                    type2 = fruit
                    count2 = 1
            
            max_len = max(max_len, right - left + 1)
        
        return max_len
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(1) - Only tracking 2 types |

---

## Comparison of Approaches

| Aspect | HashMap Approach | Optimized Approach |
|--------|-----------------|-------------------|
| **Time** | O(n) | O(n) |
| **Space** | O(1) | O(1) |
| **Implementation** | Simpler | More complex |
| **Readability** | Better | Requires thought |

**Best Approach:** The hashmap approach is recommended for clarity and maintainability.

---

## Related Problems

Based on similar themes (sliding window, longest subarray with k distinct):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Longest Substring Without Repeating Characters | [Link](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | K=1 |
| Longest Substring with At Most Two Distinct Characters | [Link](https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/) | Same as this |
| Fruit Into Baskets | [Link](https://leetcode.com/problems/fruit-into-baskets/) | This problem |
| Max Consecutive Ones III | [Link](https://leetcode.com/problems/max-consecutive-ones-iii/) | Sliding window |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Sliding Window Technique

- [NeetCode - Fruit Into Baskets](https://www.youtube.com/watch?v=6U-ysC4h2V8) - Clear explanation with visual examples
- [Sliding Window Pattern](https://www.youtube.com/watch?v=7C_f7fD2p14) - Understanding sliding window
- [Two Pointers + HashMap](https://www.youtube.com/watch?v=wyZ74raEwPE) - Combining techniques

---

## Follow-up Questions

### Q1: What if we had 3 baskets instead of 2?

**Answer:** Simply change the condition from `len(count) > 2` to `len(count) > 3`. The algorithm remains exactly the same.

---

### Q2: How does this relate to the "Longest Substring with At Most K Distinct Characters" problem?

**Answer:** This problem is exactly that problem with k=2. The sliding window solution generalizes to any k.

---

### Q3: Can we solve it without sliding window?

**Answer:** Yes, we could use nested loops O(n²) to check all subarrays, but that's much less efficient. The sliding window is optimal.

---

### Q4: Why is the space O(1) and not O(n)?

**Answer:** Even though we use a hashmap, it only ever contains at most 2 keys (the two fruit types), so the space is bounded by a constant.

---

### Q5: What if we need to track which basket gets which fruit?

**Answer:** The problem doesn't ask for that, but we could track which fruit types correspond to each basket by maintaining two separate counters.

---

### Q6: How would you handle the case where we want to minimize the number of baskets used?

**Answer:** We could first find the minimum number of distinct fruits needed to cover the entire array, but that's a different problem.

---

### Q7: What edge cases should be tested?

**Answer:**
- All same fruits (answer = n)
- Two different fruits (answer = n)
- Alternating fruits (answer = 2)
- Fruits at extremes (0 to n-1)
- Single element (answer = 1)

---

### Q8: How would you modify to find the starting index of the max length subarray?

**Answer:** Track the left pointer when you update max_len: when max_len is updated, store current left as the answer starting position.

---

## Common Pitfalls

### 1. Not Removing Keys with Zero Count
**Issue:** Leaving zero-count keys in the hashmap.

**Solution:** Delete the key when count reaches 0.

### 2. Incorrect Window Size Calculation
**Issue:** Using wrong formula for window size.

**Solution:** Window size = right - left + 1.

### 3. Not Updating Max at Each Step
**Issue:** Only updating max at the end.

**Solution:** Update max_len at each iteration after adjusting the window.

---

## Summary

The **Fruit Into Baskets** problem demonstrates the sliding window technique:

- **Sliding Window**: Maintain longest subarray with ≤ 2 distinct elements
- **HashMap**: Track frequency of each fruit type
- **Time Complexity**: O(n) - each element added and removed at most once
- **Space Complexity**: O(1) - at most 2 keys in map

This problem is an excellent example of how sliding window can efficiently solve problems about finding longest subarrays with certain properties.

For more details on this pattern, see the **[Sliding Window](/algorithms/two-pointers/sliding-window)**.
