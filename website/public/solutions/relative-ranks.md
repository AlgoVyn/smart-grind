# Relative Ranks

## Problem Description

You are given an integer array `score` of size `n`, where `score[i]` is the score of the ith athlete in a competition. All the scores are guaranteed to be unique.

The athletes are placed based on their scores, where the 1st place athlete has the highest score, the 2nd place athlete has the 2nd highest score, and so on. The placement of each athlete determines their rank:

- The 1st place athlete's rank is **"Gold Medal"**
- The 2nd place athlete's rank is **"Silver Medal"**
- The 3rd place athlete's rank is **"Bronze Medal"**
- For the 4th place to the nth place athlete, their rank is their placement number (i.e., the xth place athlete's rank is "x")

Return an array `answer` of size `n` where `answer[i]` is the rank of the ith athlete.

### Example 1

**Input:**
```python
score = [5,4,3,2,1]
```

**Output:**
```python
["Gold Medal","Silver Medal","Bronze Medal","4","5"]
```

**Explanation:** The placements are [1st, 2nd, 3rd, 4th, 5th].

### Example 2

**Input:**
```python
score = [10,3,8,9,4]
```

**Output:**
```python
["Gold Medal","5","Bronze Medal","Silver Medal","4"]
```

**Explanation:** The placements are [1st, 5th, 3rd, 2nd, 4th].

### Constraints

- `n == score.length`
- `1 <= n <= 10^4`
- `0 <= score[i] <= 10^6`
- All the values in `score` are unique.

## Solution

```python
class Solution:
    def findRelativeRanks(self, score: List[int]) -> List[str]:
        n = len(score)
        athletes = sorted([(score[i], i) for i in range(n)], reverse=True)
        res = ["" for _ in range(n)]
        medals = ["Gold Medal", "Silver Medal", "Bronze Medal"]
        
        for rank, (_, idx) in enumerate(athletes):
            if rank < 3:
                res[idx] = medals[rank]
            else:
                res[idx] = str(rank + 1)
        
        return res
```

## Explanation

1. Create pairs of (score, index) and sort them in descending order by score.
2. Iterate through the sorted list and assign medals for the top 3, and rank numbers for the rest.
3. Place the results back in the original order using the stored indices.

**Time Complexity:** O(n log n)

**Space Complexity:** O(n)
