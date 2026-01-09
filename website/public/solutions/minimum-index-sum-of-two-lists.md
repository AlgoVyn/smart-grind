# Minimum Index Sum Of Two Lists

## Problem Description

Given two arrays of strings `list1` and `list2`, find the common strings with the least index sum.

A common string is a string that appeared in both `list1` and `list2`. A common string with the least index sum is a common string such that if it appeared at `list1[i]` and `list2[j]`, then `i + j` should be the minimum value among all the other common strings.

Return all the common strings with the least index sum. Return the answer in any order.

## Examples

### Example 1

**Input:**
```
list1 = ["Shogun", "Tapioca Express", "Burger King", "KFC"]
list2 = ["Piatti", "The Grill at Torrey Pines", "Hungry Hunter Steakhouse", "Shogun"]
```

**Output:**
```
["Shogun"]
```

**Explanation:**
The only common string is "Shogun".

### Example 2

**Input:**
```
list1 = ["Shogun", "Tapioca Express", "Burger King", "KFC"]
list2 = ["KFC", "Shogun", "Burger King"]
```

**Output:**
```
["Shogun"]
```

**Explanation:**
The common string with the least index sum is "Shogun" with index sum = (0 + 1) = 1.

### Example 3

**Input:**
```
list1 = ["happy", "sad", "good"]
list2 = ["sad", "happy", "good"]
```

**Output:**
```
["sad", "happy"]
```

**Explanation:**
There are three common strings:
- "happy" with index sum = (0 + 1) = 1
- "sad" with index sum = (1 + 0) = 1
- "good" with index sum = (2 + 2) = 4

The strings with the least index sum are "sad" and "happy".

## Constraints

- `1 <= list1.length, list2.length <= 1000`
- `1 <= list1[i].length, list2[i].length <= 30`
- `list1[i]` and `list2[i]` consist of spaces ' ' and English letters
- All the strings of `list1` are unique
- All the strings of `list2` are unique
- There is at least a common string between `list1` and `list2`

## Solution

```python
from typing import List

class Solution:
    def findRestaurant(self, list1: List[str], list2: List[str]) -> List[str]:
        """
        Find common strings with minimum index sum using a hash map.
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

## Explanation

To find common strings with the minimum index sum, use a hash map for quick lookup of indices in list1.

1. **Build dictionary**: Create a mapping from strings in list1 to their indices.

2. **Iterate through list2**: For each string in list2:
   - Check if it exists in list1
   - Calculate the index sum
   - Track the minimum sum and collect strings that achieve it

## Complexity Analysis

- **Time Complexity:** O(m + n), where m and n are the lengths of list1 and list2
- **Space Complexity:** O(m), for storing the indices of list1
