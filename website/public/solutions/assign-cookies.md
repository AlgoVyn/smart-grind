# Assign Cookies

## Problem Description
[Link to problem](https://leetcode.com/problems/assign-cookies/)

Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie.
Each child i has a greed factor g[i], which is the minimum size of a cookie that the child will be content with; and each cookie j has a size s[j]. If s[j] >= g[i], we can assign the cookie j to the child i, and the child i will be content. Your goal is to maximize the number of your content children and output the maximum number.
 
Example 1:

Input: g = [1,2,3], s = [1,1]
Output: 1
Explanation: You have 3 children and 2 cookies. The greed factors of 3 children are 1, 2, 3. 
And even though you have 2 cookies, since their size is both 1, you could only make the child whose greed factor is 1 content.
You need to output 1.

Example 2:

Input: g = [1,2], s = [1,2,3]
Output: 2
Explanation: You have 2 children and 3 cookies. The greed factors of 2 children are 1, 2. 
You have 3 cookies and their sizes are big enough to gratify all of the children, 
You need to output 2.

 
Constraints:

1 <= g.length <= 3 * 104
0 <= s.length <= 3 * 104
1 <= g[i], s[j] <= 231 - 1

 
Note: This question is the same as  2410: Maximum Matching of Players With Trainers.


## Solution

```python
from typing import List

class Solution:
    def findContentChildren(self, g: List[int], s: List[int]) -> int:
        g.sort()
        s.sort()
        i = 0
        j = 0
        count = 0
        while i < len(g) and j < len(s):
            if s[j] >= g[i]:
                count += 1
                i += 1
            j += 1
        return count
```

## Explanation

This problem involves assigning cookies to children based on their greed factors and cookie sizes, maximizing the number of content children.

We sort both the greed array and the cookie sizes array. Then, use two pointers: one for children and one for cookies. For each child, we try to find the smallest cookie that can satisfy their greed (size >= greed). If found, increment the count and move to the next child. Always move to the next cookie.

This greedy approach works because assigning the smallest possible cookie to the smallest greed first leaves larger cookies for greedier children.

Time complexity is O(N log N + M log M) due to sorting, where N and M are the lengths of g and s. Space complexity is O(1) if sorting in place, or O(N + M) for the sort space.

This ensures optimal assignment.
