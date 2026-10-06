def bubble_sort_steps(arr):
    """
    Bubble Sort with step-by-step execution states.
    """

    # Create a copy so the original array is not changed
    data = list(arr)

    # Store every state of the algorithm
    steps = []

    # Counters
    comparisons = 0
    swaps = 0

    # Initial state
    steps.append({
        "array": data.copy(),
        "description": "Initial array",
        "compared": [],
        "swapped": False
    })

    n = len(data)

    # Bubble Sort
    for i in range(n):

        swapped_in_pass = False

        for j in range(0, n - i - 1):

            comparisons += 1

            # Record comparison
            steps.append({
                "array": data.copy(),
                "description": f"Comparing {data[j]} and {data[j + 1]}",
                "compared": [j, j + 1],
                "swapped": False
            })

            # Swap if elements are in wrong order
            if data[j] > data[j + 1]:

                data[j], data[j + 1] = data[j + 1], data[j]

                swaps += 1
                swapped_in_pass = True

                # Record swap
                steps.append({
                    "array": data.copy(),
                    "description": f"Swapped elements at positions {j} and {j + 1}",
                    "compared": [j, j + 1],
                    "swapped": True
                })

        # Stop early if no swaps happened
        if not swapped_in_pass:
            break

    # Final state
    steps.append({
        "array": data.copy(),
        "description": "Array is sorted",
        "compared": [],
        "swapped": False
    })

    return {
        "algorithm": "Bubble Sort",
        "input": arr,
        "steps": steps,
        "comparisons": comparisons,
        "swaps": swaps,
        "time_complexity": {
            "best": "O(n)",
            "average": "O(n^2)",
            "worst": "O(n^2)"
        },
        "space_complexity": "O(1)"
    }