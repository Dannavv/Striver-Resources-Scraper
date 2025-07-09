import json

with open('striever_sde_sheet.json', 'r') as f:
    data = json.load(f)

print(f"Total number of items: {len(data)}")
for idx, item in enumerate(data, 1):
    print(f"\nItem {idx}:")
    for key, value in item.items():
        print(f"  Field: {key}, Type: {type(value).__name__}")
        if key == "problems":
            print(len(value), "problems found")