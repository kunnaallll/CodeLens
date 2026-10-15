
def fibonacci(n):
    """Return the nth Fibonacci number using dynamic programming."""
    if n < 0:
        raise ValueError("n must be non-negative")

    if n <= 1:
        return n

    dp = [0] * (n + 1)
    dp[0], dp[1] = 0, 1

    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]


def climbing_stairs(n):
    """Count ways to climb n stairs using steps of 1 or 2."""
    if n < 0:
        raise ValueError("n must be non-negative")

    if n <= 1:
        return 1

    dp = [0] * (n + 1)
    dp[0], dp[1] = 1, 1

    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]


def knapsack(weights, values, capacity):
    """Return the maximum value for the 0/1 Knapsack problem."""
    if len(weights) != len(values):
        raise ValueError("Weights and values must have equal lengths")
    if capacity < 0 or any(w < 0 for w in weights):
        raise ValueError("Capacity and weights must be non-negative")

    dp = [0] * (capacity + 1)

    for weight, value in zip(weights, values):
        for current_capacity in range(capacity, weight - 1, -1):
            dp[current_capacity] = max(
                dp[current_capacity],
                dp[current_capacity - weight] + value
            )

    return dp[capacity]


if __name__ == "__main__":
    print("Fibonacci(7):", fibonacci(7))
    print("Ways to climb 5 stairs:", climbing_stairs(5))

    weights = [1, 3, 4, 5]
    values = [1, 4, 5, 7]
    capacity = 7

    print("Maximum knapsack value:", knapsack(weights, values, capacity))
