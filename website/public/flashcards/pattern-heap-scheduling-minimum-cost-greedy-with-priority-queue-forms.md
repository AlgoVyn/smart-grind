# Flashcards: Heap - Scheduling / Minimum Cost (Greedy with Priority Queue) - Forms

## Card 1: Minimum Cost to Hire K Workers

**Front:**
What is the classic form of the "Minimum Cost to Hire K Workers" problem (LeetCode 857)?

**Back:**
**Problem**: Hire exactly K workers minimizing total cost where each worker must be paid proportionally to their quality.

**Input**: `quality[]`, `wage[]`, `k`

**Form**:
```python
def mincost_to_hire_workers(quality, wage, k):
    workers = sorted([(w/q, q) for w, q in zip(wage, quality)])
    max_heap = []
    quality_sum = 0
    min_cost = inf
    
    for ratio, q in workers:
        heapq.heappush(max_heap, -q)
        quality_sum += q
        if len(max_heap) > k:
            quality_sum += heapq.heappop(max_heap)
        if len(max_heap) == k:
            min_cost = min(min_cost, quality_sum * ratio)
    
    return min_cost
```

**Pattern**: Sort by ratio + max heap for K smallest qualities

**Tags:** form-857, worker-hiring, classic

---

## Card 2: IPO / Capital Maximization

**Front:**
What is the "IPO" (Capital Maximization) problem form (LeetCode 502)?

**Back:**
**Problem**: Complete at most K projects to maximize capital. Each project has capital requirement and profit.

**Input**: `k` (max projects), `w` (initial capital), `profits[]`, `capital[]`

**Form**:
```python
def find_maximized_capital(k, w, profits, capital):
    projects = sorted(zip(capital, profits))
    available = []  # Max heap for profits
    idx = 0
    
    for _ in range(k):
        while idx < n and projects[idx][0] <= w:
            heapq.heappush(available, -projects[idx][1])
            idx += 1
        if available:
            w += -heapq.heappop(available)
        else:
            break
    return w
```

**Pattern**: Two-heap (min for projects, max for available) with pointer

**Tags:** form-502, ipo, capital

---

## Card 3: Course Schedule III (Deadline Scheduling)

**Front:**
What is the "Course Schedule III" form (LeetCode 630)?

**Back:**
**Problem**: Take maximum number of courses given duration and lastDay for each.

**Key Insight**: 
- Sort by deadline (lastDay)
- Use max heap to track durations
- If total duration exceeds deadline, drop longest course

**Form**:
```python
def schedule_course(courses):
    courses.sort(key=lambda x: x[1])  # Sort by lastDay
    max_heap = []
    total_time = 0
    
    for duration, lastDay in courses:
        heapq.heappush(max_heap, -duration)
        total_time += duration
        
        if total_time > lastDay:
            total_time += heapq.heappop(max_heap)  # Drop longest
    
    return len(max_heap)
```

**Pattern**: Sort by constraint, max heap for removal

**Tags:** form-630, scheduling, deadline

---

## Card 4: Maximum Performance of a Team

**Front:**
What is the "Maximum Performance of a Team" form (LeetCode 1383)?

**Back:**
**Problem**: Select at most K engineers to maximize team performance = sum(speed) × min(efficiency).

**Key Insight**:
- Sort by efficiency descending
- Use min heap to track K highest speeds at each efficiency level
- Each efficiency becomes the bottleneck for its group

**Form**:
```python
def max_performance(n, speed, efficiency, k):
    engineers = sorted(zip(efficiency, speed), reverse=True)
    min_heap = []
    speed_sum = 0
    max_perf = 0
    
    for eff, spd in engineers:
        heapq.heappush(min_heap, spd)
        speed_sum += spd
        if len(min_heap) > k:
            speed_sum -= heapq.heappop(min_heap)
        max_perf = max(max_perf, speed_sum * eff)
    
    return max_perf % MOD
```

**Pattern**: Sort by one metric, min heap for other metric

**Tags:** form-1383, performance, team-selection

---

## Card 5: Generic Template Recognition

**Front:**
What are the telltale signs that a problem fits the "Greedy + Priority Queue" pattern?

**Back:**
**Problem Statements Containing**:
- "minimum cost to hire/select K..."
- "maximize capital/profit with at most K..."
- "schedule maximum courses/events with deadlines..."
- "select K items minimizing/maximizing..."
- "ratio of cost to benefit..."

**Key Phrases**:
- "paid proportional to..." (ratio constraint)
- "at most K" or "exactly K" selections
- "deadline" or "last day" constraints
- "efficiency" × "speed/productivity" type metrics

**Tags:** recognition, template, identification
