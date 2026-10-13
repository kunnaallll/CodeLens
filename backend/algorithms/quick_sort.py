
def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1

    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]

    return i + 1


def quick_sort(arr, low, high):
    if low < high:
        pivot_index = partition(arr, low, high)

        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)

    return arr


if __name__ == "__main__":
    numbers = [7, 2, 1, 6, 8, 5, 3, 4]

    print("Original array:", numbers)

    quick_sort(numbers, 0, len(numbers) - 1)

    print("Sorted array:", numbers)
