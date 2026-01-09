# Fruit Into Baskets

## Problem Description
You are visiting a farm that has a single row of fruit trees arranged from left to right. The trees are represented by an integer array fruits where fruits[i] is the type of fruit the ith tree produces.
You want to collect as much fruit as possible. However, the owner has some strict rules that you must follow:

You only have two baskets, and each basket can only hold a single type of fruit. There is no limit on the amount of fruit each basket can hold.
Starting from any tree of your choice, you must pick exactly one fruit from every tree (including the start tree) while moving to the right. The picked fruits must fit in one of your baskets.
Once you reach a tree with fruit that cannot fit in your baskets, you must stop.

Given the integer array fruits, return the maximum number of fruits you can pick.
 
Example 1:

Input: fruits = [1,2,1]
Output: 3
Explanation: We can pick from all 3 trees.

Example 2:

Input: fruits = [0,1,2,2]
Output: 3
Explanation: We can pick from trees [1,2,2].
If we had started at the first tree, we would only pick from trees [0,1].

Example 3:

Input: fruits = [1,2,3,2,2]
Output: 4
Explanation: We can pick from trees [2,3,2,2].
If we had started at the first tree, we would only pick from trees [1,2].

 
Constraints:

1 <= fruits.length <= 105
0 <= fruits[i] < fruits.length
## Solution

```python
from typing import List

class Solution:
    def totalFruit(self, fruits: List[int]) -> int:
        count = {}
        left = 0
        max_len = 0
        for right in range(len(fruits)):
            count[fruits[right]] = count.get(fruits[right], 0) + 1
            while len(count) > 2:
                count[fruits[left]] -= 1
                if count[fruits[left]] == 0:
                    del count[fruits[left]]
                left += 1
            max_len = max(max_len, right - left + 1)
        return max_len
```

## Explanation
This problem can be solved using the sliding window technique to find the longest subarray with at most two distinct fruit types.

We initialize two pointers, `left` and `right`, both starting at 0. We use a dictionary `count` to keep track of the frequency of each fruit type in the current window, and a variable `max_len` to store the maximum length found.

We iterate `right` from 0 to the end of the array. For each `right`, we add `fruits[right]` to the `count` dictionary, incrementing its count.

If the number of keys in `count` exceeds 2, we need to shrink the window from the left. While the number of distinct fruits > 2, we decrement the count of `fruits[left]`, and if it becomes 0, we remove it from the dictionary, then increment `left`.

After adjusting the window, we update `max_len` with the current window size `right - left + 1`.

At the end, return `max_len`.

Time complexity: O(n), where n is the length of the fruits array, as each element is added and removed at most once.

Space complexity: O(min(n, k)), where k is the number of distinct fruits, but since fruit types range from 0 to n-1, in the worst case, it could be O(n) for the dictionary.
