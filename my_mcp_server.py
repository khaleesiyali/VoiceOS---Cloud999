from mcp.server.fastmcp import FastMCP

mcp = FastMCP("warehouse-tools")

inventory = {
    "992": {
        "name": "Premium Widgets",
        "quantity": 180,
        "location": "A1, A2",
        "status": "Available",
        "supplier": "Main Supplier"
    },
    "104": {
        "name": "Organic Milk 1L",
        "quantity": 230,
        "location": "B1",
        "status": "Available",
        "supplier": "Fresh Supply Co"
    },
    "551": {
        "name": "Industrial Lubricant",
        "quantity": 400,
        "location": "D4",
        "status": "Available",
        "supplier": "FactoryFlow Ltd"
    },
    "808": {
        "name": "Alkaline Batteries",
        "quantity": 15,
        "location": "C2",
        "status": "Low Stock",
        "supplier": "PowerCell Inc"
    }
}


def refresh_status(item: dict) -> None:
    if item["quantity"] <= 20:
        item["status"] = "Low Stock"
    else:
        item["status"] = "Available"


@mcp.tool()
def check_stock(sku: str) -> str:
    item = inventory.get(sku)
    if not item:
        return f"SKU {sku} not found."

    return (
        f"SKU {sku} ({item['name']}) has {item['quantity']} units in stock "
        f"at location {item['location']}. Status: {item['status']}."
    )


@mcp.tool()
def add_stock(sku: str, amount: int) -> str:
    item = inventory.get(sku)
    if not item:
        return f"SKU {sku} not found."
    if amount <= 0:
        return "Amount must be greater than zero."

    item["quantity"] += amount
    refresh_status(item)

    return (
        f"Added {amount} units to SKU {sku}. "
        f"New stock level is {item['quantity']}."
    )


@mcp.tool()
def mark_spoiled(sku: str, amount: int) -> str:
    item = inventory.get(sku)
    if not item:
        return f"SKU {sku} not found."
    if amount <= 0:
        return "Amount must be greater than zero."

    item["quantity"] = max(0, item["quantity"] - amount)
    refresh_status(item)

    return (
        f"Marked {amount} units of SKU {sku} as spoiled. "
        f"Remaining stock is {item['quantity']}."
    )


@mcp.tool()
def trigger_reorder(sku: str) -> str:
    item = inventory.get(sku)
    if not item:
        return f"SKU {sku} not found."

    return (
        f"Reorder request for SKU {sku} has been triggered "
        f"to {item['supplier']}."
    )


if name == "main":
    mcp.run(transport="stdio")