# Parallel Courses Ii

## Problem Description
[Link to problem](https://leetcode.com/problems/parallel-courses-ii/)

You are given an integer n, which indicates that there are n courses labeled from 1 to n. You are also given an array relations where relations[i] = [prevCoursei, nextCoursei], representing a prerequisite relationship between course prevCoursei and course nextCoursei: course prevCoursei has to be taken before course nextCoursei. Also, you are given the integer k.
In one semester, you can take at most k courses as long as you have taken all the prerequisites in the previous semesters for the courses you are taking.
Return the minimum number of semesters needed to take all courses. The testcases will be generated such that it is possible to take every course.
 
Example 1:


Input: n = 4, relations = [[2,1],[3,1],[1,4]], k = 2
Output: 3
Explanation: The figure above represents the given graph.
In the first semester, you can take courses 2 and 3.
In the second semester, you can take course 1.
In the third semester, you can take course 4.

Example 2:


Input: n = 5, relations = [[2,1],[3,1],[4,1],[1,5]], k = 2
Output: 4
Explanation: The figure above represents the given graph.
In the first semester, you can only take courses 2 and 3 since you cannot take more than two per semester.
In the second semester, you can take course 4.
In the third semester, you can take course 1.
In the fourth semester, you can take course 5.

 
Constraints:

1 <= n <= 15
1 <= k <= n
0 <= relations.length <= n * (n-1) / 2
relations[i].length == 2
1 <= prevCoursei, nextCoursei <= n
prevCoursei != nextCoursei
All the pairs [prevCoursei, nextCoursei] are unique.
The given graph is a directed acyclic graph.


## Solution

```python
class Solution:
    def minNumberOfSemesters(self, n: int, relations: List[List[int]], k: int) -> int:
        pre = [0] * n
        for u, v in relations:
            pre[v - 1] |= (1 << (u - 1))
        
        dp = [float('inf')] * (1 << n)
        dp[0] = 0
        
        for mask in range(1 << n):
            if dp[mask] == float('inf'):
                continue
            avail = 0
            for i in range(n):
                if (mask & (1 << i)) == 0 and (pre[i] & mask) == pre[i]:
                    avail |= (1 << i)
            if avail == 0:
                continue
            sub = avail
            while sub > 0:
                if bin(sub).count('1') <= k:
                    dp[mask | sub] = min(dp[mask | sub], dp[mask] + 1)
                sub = (sub - 1) & avail
        return dp[(1 << n) - 1]
```

## Explanation
Since n <= 15, use bitmask DP where dp[mask] is the minimum semesters to complete the courses in mask.

Step-by-step approach:
1. Compute prerequisite masks for each course.
2. Initialize dp[0] = 0, others inf.
3. For each mask, find available courses (not in mask and prereqs satisfied).
4. Enumerate all subsets of available courses with size <= k, update dp[mask | sub] = min(..., dp[mask] + 1).
5. Return dp[(1<<n)-1].

Time Complexity: O(3^n), as for each mask, enumerating subsets is O(2^n) but limited by k.
Space Complexity: O(2^n).
