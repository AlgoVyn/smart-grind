## Modular Exponentiation: Forms & Variations

What are the different forms and variations of modular exponentiation?

<!-- front -->

---

### Form 1: Standard Modular Power

```python
# Standard form: (base^exp) % mod
answer = pow(base, exp, mod)

# Applications:
# - RSA encryption/decryption
# - Diffie-Hellman key exchange
# - Large number hashing
```

---

### Form 2: Modular Power with Precomputation

```python
class PrecomputedModPow:
    """Precompute powers for repeated queries"""
    
    def __init__(self, base, mod, max_exp):
        self.mod = mod
        self.powers = [1] * (max_exp.bit_length() + 1)
        
        # Precompute base^(2^i) for all i
        self.powers[0] = base % mod
        for i in range(1, len(self.powers)):
            self.powers[i] = (self.powers[i-1] * self.powers[i-1]) % mod
    
    def query(self, exp):
        """O(log exp) using precomputed powers"""
        result = 1
        i = 0
        while exp > 0:
            if exp & 1:
                result = (result * self.powers[i]) % self.mod
            exp >>= 1
            i += 1
        return result
```

---

### Form 3: Matrix Exponentiation

```python
def matrix_mult(A, B, mod):
    """Multiply two matrices with mod"""
    n = len(A)
    result = [[0] * n for _ in range(n)]
    for i in range(n):
        for k in range(n):
            for j in range(n):
                result[i][j] = (result[i][j] + 
                    A[i][k] * B[k][j]) % mod
    return result

def matrix_pow(M, exp, mod):
    """Matrix exponentiation - O(n^3 log exp)"""
    n = len(M)
    # Initialize as identity
    result = [[1 if i == j else 0 for j in range(n)] 
              for i in range(n)]
    
    base = M
    while exp > 0:
        if exp & 1:
            result = matrix_mult(result, base, mod)
        base = matrix_mult(base, base, mod)
        exp >>= 1
    
    return result

# Application: Fast Fibonacci
# [[1,1],[1,0]]^n gives F_{n+1}, F_n
```

---

### Form 4: Modular Exponent in Cryptography

```python
def rsa_encrypt(message, e, n):
    """RSA: ciphertext = message^e mod n"""
    return pow(message, e, n)

def rsa_decrypt(ciphertext, d, n):
    """RSA: message = ciphertext^d mod n"""
    return pow(ciphertext, d, n)

def diffie_hellman(g, a, p):
    """DH: compute g^a mod p"""
    return pow(g, a, p)
```

---

### Form 5: Modular Exponent with Chinese Remainder

```python
def mod_pow_crt(base, exp, p, q):
    """
    Use CRT for faster computation when modulus = p*q.
    Useful in RSA with private key operations.
    """
    # Compute mod p and mod q separately
    exp_mod_p = exp % (p - 1)  # Fermat's little theorem
    exp_mod_q = exp % (q - 1)
    
    result_p = pow(base, exp_mod_p, p)
    result_q = pow(base, exp_mod_q, q)
    
    # Combine with CRT
    return chinese_remainder(result_p, result_q, p, q)
```

<!-- back -->
