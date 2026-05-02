# Date Algorithms

## Category
Miscellaneous

## Description

Algorithms for date calculations including day of week, days between dates, leap year detection, and calendar operations.

---

## Concepts

### 1. Leap Year

```python
is_leap = (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)
```

### 2. Day of Week (Sakamoto's Method)

Returns: 0=Sunday, 1=Monday, ..., 6=Saturday

### 3. Days Since Epoch

Convert dates to day counts for arithmetic operations.

---

## Frameworks

### Framework 1: Day of Week

```
┌─────────────────────────────────────────────────────────────┐
│  DAY OF WEEK (SAKAMOTO'S METHOD)                            │
├─────────────────────────────────────────────────────────────┤
│  1. If month < 3:                                            │
│     month += 12                                              │
│     year -= 1                                                │
│                                                              │
│  2. t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4]               │
│                                                              │
│  3. Return (y + y//4 - y//100 + y//400 + t[m-1] + d) % 7  │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Day of Week

Calculate day of week for a date.

| Output | 0=Sunday, ..., 6=Saturday |
|--------|--------------------------|
| **Time** | O(1) |
| **Method** | Sakamoto's method |

### Form 2: Days Between

Calculate days between two dates.

| Method | Convert to days since epoch |
|--------|----------------------------|
| **Time** | O(1) |

---

## Tactics

### Tactic 1: Day of Week

```python
def day_of_week(y, m, d):
    """Tomohiko Sakamoto's method."""
    if m < 3:
        m += 12
        y -= 1
    t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4]
    return (y + y // 4 - y // 100 + y // 400 + t[m - 1] + d) % 7
```

### Tactic 2: Days Between

```python
def days_between(date1, date2):
    def days_since_epoch(year, month, day):
        y = year - 1
        days = y * 365 + y // 4 - y // 100 + y // 400
        
        month_days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if is_leap_year(year):
            month_days[2] = 29
        
        for m in range(1, month):
            days += month_days[m]
        
        return days + day
    
    return abs(days_since_epoch(*date2) - days_since_epoch(*date1))

def is_leap_year(year):
    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)
```

---

## Python Templates

### Template 1: Day of Week

```python
def day_of_week(y, m, d):
    """
    Calculate day of week using Tomohiko Sakamoto's method.
    Returns: 0=Sunday, 1=Monday, ..., 6=Saturday
    
    Time: O(1)
    Space: O(1)
    """
    if m < 3:
        m += 12
        y -= 1
    t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4]
    return (y + y // 4 - y // 100 + y // 400 + t[m - 1] + d) % 7
```

---

## Practice Problems

### Problem 1: Day of the Week
**Problem:** [LeetCode 1185](https://leetcode.com/problems/day-of-the-week/)

### Problem 2: Number of Days Between Two Dates
**Problem:** [LeetCode 1360](https://leetcode.com/problems/number-of-days-between-two-dates/)

---

## Summary

Date algorithms:
- Sakamoto's method for day of week
- Leap year: divisible by 4, not 100, unless 400
- Days since epoch for comparisons
- O(1) operations
