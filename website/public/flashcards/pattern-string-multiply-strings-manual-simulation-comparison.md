## String - Multiply Strings (Manual Simulation): Comparison

How does manual string multiplication compare to other multiplication algorithms?

<!-- front -->

---

### Algorithm Comparison

| Algorithm | Time Complexity | Space Complexity | Best For |
|-----------|-----------------|------------------|----------|
| **Manual/Grade-school** | O(n × m) | O(n + m) | Standard interview problems, n,m < 10³ |
| **Karatsuba** | O(n^1.585) | O(n) | Large numbers (100+ digits) |
| **Toom-Cook-k** | O(n^1.465) | O(n) | Very large numbers (10⁴+ digits) |
| **FFT/NTT** | O(n log n) | O(n) | Extremely large numbers (10⁵+ digits) |
| **Schönhage-Strassen** | O(n log n log log n) | O(n) | Massive numbers (10⁶+ digits) |
| **Built-in (BigInt)** | O(n log n) to O(n²) | O(n) | Production code (language-dependent) |

**Where n and m are the lengths of the input strings.**

---

### Trade-off Analysis

| Factor | Manual Multiplication | Karatsuba | FFT-based |
|--------|----------------------|-----------|-----------|
| **Implementation** | Simple, intuitive | Moderate complexity | Complex, specialized |
| **Constant factors** | Low | Medium | High setup cost |
| **Memory usage** | Minimal | Moderate (recursion) | Higher (transforms) |
| **Cache efficiency** | Good (sequential) | Fair | Poor (random access) |
| **Interview suitability** | Excellent | Good for follow-up | Rarely needed |

---

### When to Use Each Approach

```
Digits in inputs:

n, m < 50:        Manual multiplication (simplest, fast enough)
50 < n, m < 200:  Manual or Karatsuba (interview context)
200 < n, m < 10⁴: Karatsuba (better asymptotics)
10⁴ < n, m:       FFT-based or specialized libraries
```

---

### Karatsuba vs Manual: Detailed Comparison

| Aspect | Manual O(n²) | Karatsuba O(n^1.585) |
|--------|-------------|----------------------|
| **Multiplications** | 4 (for n/2 digits each) | 3 recursive calls |
| **Additions** | Simple digit adds | More complex additions |
| **Recursion depth** | None | log₂(n) levels |
| **Base case** | Direct | Switch to manual at ~64 digits |
| **Formula** | XY = (a·B+c)(b·B+d) | XY = z₂·B²ᵐ + z₁·Bᵐ + z₀ |

**Karatsuba insight**: For X = x₁·Bᵐ + x₀ and Y = y₁·Bᵐ + y₀:
- z₀ = x₀·y₀
- z₂ = x₁·y₁  
- z₁ = (x₀+x₁)(y₀+y₁) - z₀ - z₂

Only 3 multiplications instead of 4!

---

### Crossover Point Analysis

```
Performance crossover (empirical):

Manual:  ████████████████████ (faster for n < 64)
Karatsuba:                    ████████████████████ (faster for 64 < n < 10⁴)
FFT:                                                  ████████████████████ (n > 10⁴)

Theoretical vs practical:
- Karatsuba becomes faster around 64-128 digits
- Implementation overhead matters for small n
- Memory allocation costs affect real-world performance
```

---

### Interview Context Decision Tree

```
Problem asks for string multiplication?
│
├─ Can use built-in BigInt? → Use it (most practical)
│
├─ Must implement manually?
│  ├─ "Standard" problem → Manual O(n×m) (expected answer)
│  ├─ "Optimize for very large numbers" → Mention Karatsuba
│  └─ "Extreme scale" → Discuss FFT (theoretical)
│
└─ Follow-up questions likely?
   ├─ Negative numbers → Sign handling
   ├─ Decimal numbers → Track decimal positions
   └─ Division → Long division simulation
```

---

### Related Algorithm Problems

| Problem | Primary Approach | Follow-up |
|---------|-----------------|-----------|
| Add Strings | Manual O(n) | Handle negative, decimal |
| Subtract Strings | Manual O(n) | Borrow propagation |
| Multiply Strings | Manual O(n×m) | Karatsuba for optimization |
| Divide Strings | Long division O(n×m) | Binary search approach |
| Power Strings | Fast exponentiation O(log k × n²) | Modular arithmetic |

<!-- back -->
