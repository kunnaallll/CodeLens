def countdown(n):
    # Base case
    if n <= 0:
        print("Done!")
        return

    # Print the current number
    print(n)

    # Recursive call
    countdown(n - 1)


if __name__ == "__main__":
    countdown(5)
def factorial(n):
    if n < 0:
        raise ValueError("Factorial is not defined for negative integers")

    # Base case
    if n == 0 or n == 1:
        return 1

    # Recursive case
    return n * factorial(n - 1)


if __name__ == "__main__":
    countdown(5)

    number = 5
    print("Factorial of", number, "is", factorial(number))    