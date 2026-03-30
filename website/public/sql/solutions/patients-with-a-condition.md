## Problem

Find all patients who have Type I Diabetes. A patient has Type I Diabetes if their `conditions` column contains the code 'DIAB1' as a word (either at the beginning or preceded by a space).

**Table:** `Patients`

| Column Name | Type    |
|-------------|---------|
| patient_id  | int     |
| patient_name| varchar |
| conditions  | varchar |

**Example:**

Input:
| patient_id | patient_name | conditions           |
|------------|--------------|----------------------|
| 1          | Daniel       | YFEV COUGH           |
| 2          | Alice        | DIAB100 MYOP         |
| 3          | Bob          | DIAB201 DIAB1        |
| 4          | George       | ACNE DIAB100         |
| 5          | Alain        | DIAB1                |

Output:
| patient_id | patient_name | conditions   |
|------------|--------------|--------------|
| 2          | Alice        | DIAB100 MYOP |
| 3          | Bob          | DIAB201 DIAB1|
| 5          | Alain        | DIAB1        |

**Explanation:** Alice and Bob have DIAB1 in their conditions. Alain's condition starts with DIAB1.
George has DIAB100, which does NOT contain DIAB1 as a standalone code.

---

## Approaches

### Approach 1: LIKE with Pattern Matching (Standard SQL)

```sql
SELECT patient_id, patient_name, conditions
FROM Patients
WHERE conditions LIKE '% DIAB1%' 
   OR conditions LIKE 'DIAB1%';
```

**Explanation:**
- `conditions LIKE 'DIAB1%'` matches when DIAB1 is at the start of the string
- `conditions LIKE '% DIAB1%'` matches when DIAB1 appears after a space
- This handles both cases: standalone DIAB1 or DIAB1 at the beginning

---

### Approach 2: REGEXP with Word Boundary (MySQL, PostgreSQL)

```sql
SELECT patient_id, patient_name, conditions
FROM Patients
WHERE conditions REGEXP '\bDIAB1';
```

**Explanation:**
- `\b` is a word boundary in REGEXP
- `\bDIAB1` matches DIAB1 only when it starts a word
- MySQL uses `REGEXP`, PostgreSQL uses `~` operator

**PostgreSQL variant:**
```sql
SELECT patient_id, patient_name, conditions
FROM Patients
WHERE conditions ~ '\yDIAB1';
```

---

### Approach 3: String Splitting (Universal but Verbose)

```sql
SELECT patient_id, patient_name, conditions
FROM Patients
WHERE ' ' || conditions LIKE '% DIAB1%';
```

**Explanation:**
- Prepend a space to the conditions string
- Then search for `' DIAB1%'` which will match DIAB1 at the start or after any space
- Works because: `" DIAB100"` won't match, but `" DIAB1"` and `" DIAB201 DIAB1"` will

---

## Solution Analysis

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|-----------------|------------------|------|------|
| LIKE Pattern | O(n * m) | O(1) | Portable, simple | Two conditions needed |
| REGEXP | O(n * m) | O(1) | Single pattern, cleaner | Not portable across all DBs |
| String Split | O(n * m) | O(1) | Single LIKE condition | Slightly less intuitive |

**Where n = number of rows, m = average length of conditions string**

---

## Final Solution

```sql
-- Solution 1: Standard SQL (Recommended for portability)
SELECT patient_id, patient_name, conditions
FROM Patients
WHERE conditions LIKE 'DIAB1%' 
   OR conditions LIKE '% DIAB1%';

-- Solution 2: REGEXP (MySQL)
SELECT patient_id, patient_name, conditions
FROM Patients
WHERE conditions REGEXP '\bDIAB1';

-- Solution 3: Using CONCAT/Prepending space trick
SELECT patient_id, patient_name, conditions
FROM Patients
WHERE CONCAT(' ', conditions) LIKE '% DIAB1%';
```
