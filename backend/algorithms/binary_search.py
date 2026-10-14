def binary_search(arr, target):
    left = 0
    right = len(arr) - 1

    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return mid

        elif arr[mid] < target:
            left = mid + 1

        else:
            right = mid - 1

    return -1


if __name__ == "__main__":
    numbers = [10, 20, 30, 40, 50, 60, 70]
    target = 60

    print("Array:", numbers)
    print("Target:", target)

    result = binary_search(numbers, target)

    if result != -1:
        print("Element found at index:", result)
    else:
        print("Element not found")