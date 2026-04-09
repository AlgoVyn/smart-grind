# Pattern: Greedy - Gas Station Circuit (Concepts)

---

## Front
What does **total feasibility** mean in the Gas Station Circuit problem?

## Back
**Total feasibility** checks if completing the circuit is even possible:

```
If sum(gas) < sum(cost):
    → Impossible to complete circuit, return -1
```

This is a **necessary condition** - regardless of starting point, if total gas is less than total cost, no solution exists.

---

## Front
What is the **local deficit** concept in Gas Station Circuit?

## Back
**Local deficit** is the cumulative net fuel balance as we travel:

```python
current_tank += gas[i] - cost[i]  # net at station i
```

- **Positive**: We gained fuel (surplus)
- **Negative**: We lost fuel (deficit)
- **Zero**: Broke even

When `current_tank < 0`, we've hit a local deficit that makes our current starting point invalid.

---

## Front
What is the **greedy choice property** in Gas Station Circuit?

## Back
The **greedy choice property**: When the tank goes negative at station `i`, we can greedily skip all stations from our current start to `i`.

**Why it works**:
- Any station between start and `i` would have started with even less fuel
- Since we couldn't reach `i+1` from start, we can't reach it from any intermediate station either
- Therefore, the next valid candidate MUST be at or after `i + 1`

---

## Front
Explain the concept of **net balance** (gas[i] - cost[i]).

## Back
**Net balance** represents the fuel change when stopping at a station:

```
net_balance[i] = gas[i] - cost[i]

- Positive: Station gives more fuel than needed to leave (surplus station)
- Negative: Station needs more fuel to leave than it provides (deficit station)
- Zero: Station provides exactly enough to leave
```

The circuit is completable if we can arrange the traversal so cumulative net balance never drops below zero.

---

## Front
What is the **reset point** concept?

## Back
The **reset point** is where we abandon our current starting candidate and try the next station.

```python
if current_tank < 0:
    start = i + 1      # reset point: next station
    current_tank = 0   # reset accumulated tank
```

Key insight: We **reset the tank to 0** (not to the deficit value) because we're starting fresh from a new candidate.

---

## Front
Explain the **circular indexing** concept in Gas Station Circuit.

## Back
**Circular indexing** treats the array as a cycle:

```python
# To access station j positions after start in a circuit of n stations:
idx = (start + j) % n
```

The circuit requires visiting stations in order:
`start → (start+1) % n → (start+2) % n → ... → (start+n-1) % n → start`

The modulo operation wraps around to the beginning after the last station.

---

## Front
What is the difference between **cumulative tank** and **total gas/cost**?

## Back
| Variable | Purpose | Reset? |
|----------|---------|--------|
| **current_tank** | Tracks balance from candidate start | Yes, when negative |
| **total_gas** | Sum of all gas in circuit | No |
| **total_cost** | Sum of all costs in circuit | No |

- `current_tank` finds the **valid starting point** (resets on deficits)
- `total_gas/total_cost` verifies **overall feasibility** (never reset)

---
