def selection_sort(arr):
    arr = arr.copy()
    n = len(arr)

    for i in range(n - 1):
        min_index = i

        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j

        arr[i], arr[min_index] = arr[min_index], arr[i]

    return arr


def selection_sort_steps(arr):
    arr = arr.copy()
    steps = [{"array": arr.copy(), "message": "Initial array"}]
    n = len(arr)

    for i in range(n - 1):
        min_index = i

        for j in range(i + 1, n):
            steps.append({
                "array": arr.copy(),
                "message": f"Comparing positions {min_index} and {j}"
            })

            if arr[j] < arr[min_index]:
                min_index = j

        arr[i], arr[min_index] = arr[min_index], arr[i]

        steps.append({
            "array": arr.copy(),
            "message": f"Placed smallest remaining element at position {i}"
        })

    steps.append({
        "array": arr.copy(),
        "message": "Sorting complete"
    })

    return steps
