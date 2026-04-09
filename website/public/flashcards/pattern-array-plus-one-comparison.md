## Array - Plus One: Comparison

When should you use different approaches for array arithmetic?

<!-- front -->

---

### Array vs String vs Native

| Aspect | Array | String | Native (Python) |
|--------|-------|--------|-----------------|
| **Big numbers** | ✓ Handles | ✓ Handles | ✗ Limited |
| **Speed** | Fast | Slower | Fastest |
| **Readability** | Good | Good | Best |
| **Interviews** | Standard | Common | Not allowed |

**Winner**: Array for interviews, native for production (if allowed)

---

### When to Use Each

**Array-based:**
- Interview problems
- Fixed digit representation
- In-place modification needed

**String-based:**
- Very large numbers
- Input/output as strings
- Decimal operations

**Native int:**
- Normal sized numbers
- Production code
- When allowed

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Interview | Array | Standard solution |
| Very large number | String or array | Avoid overflow |
| Production (normal) | Native int | Fast, clean |
| In-place required | Array | Direct modification |

<!-- back -->
