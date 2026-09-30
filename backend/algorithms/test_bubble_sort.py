from bubble_sort import bubble_sort_steps


numbers = [5, 3, 8, 1]

result = bubble_sort_steps(numbers)

print("Algorithm:", result["algorithm"])
print("Input:", result["input"])

print("\nSteps:")

for index, step in enumerate(result["steps"]):
    print(f"Step {index}: {step['array']}")
    print(f"Description: {step['description']}")

print("\nComparisons:", result["comparisons"])
print("Swaps:", result["swaps"])

print("\nTime Complexity:")
print("Best:", result["time_complexity"]["best"])
print("Average:", result["time_complexity"]["average"])
print("Worst:", result["time_complexity"]["worst"])

print("\nSpace Complexity:")
print(result["space_complexity"])