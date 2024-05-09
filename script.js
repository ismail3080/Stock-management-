let items = []; // Array to store items

function searchItem() {
    let searchTerm = document.getElementById("searchInput").value.toLowerCase();
    let filteredItems = items.filter(item => {
        return item.name.toLowerCase().includes(searchTerm) ||
               item.reference.toLowerCase().includes(searchTerm) ||
               item.barcode.toLowerCase().includes(searchTerm);
    });
    displayItems(filteredItems);
}

function addItem() {
    let itemName = document.getElementById("itemName").value;
    let quantity = parseInt(document.getElementById("quantity").value);
    let buyingPrice = parseFloat(document.getElementById("addItemBuyingPrice").value);
    let sellingPrice = parseFloat(document.getElementById("addItemSellingPrice").value);
    let priceDifference = parseFloat(document.getElementById("addItemPriceDifference").value);
    let currency = document.getElementById("currency").value;
    let reference = generateReference(); // Generate reference number
    let barcode = generateBarcode(); // Generate barcode

    // Create new item object
    let newItem = {
        reference: reference,
        name: itemName,
        quantity: quantity,
        buyingPrice: buyingPrice,
        sellingPrice: sellingPrice,
        priceDifference: priceDifference,
        currency: currency,
        // image: itemImage,
        barcode: barcode
    };

    items.push(newItem); // Add item to the array
    displayItems(items); // Display updated list of items
}

function generateBarcode() {
    // Generate a random barcode number (for demonstration purposes)
    return 'BARCODE' + Math.floor(Math.random() * 1000);
}

function generateReference() {
    // Generate a random reference number (for demonstration purposes)
    return 'REF' + Math.floor(Math.random() * 1000);
}

function displayItems(itemArray) {
    let itemListDiv = document.getElementById("itemList");
    itemListDiv.innerHTML = ""; // Clear previous items

    itemArray.forEach(item => {
        let itemCard = document.createElement("div");
        itemCard.classList.add("item-card");

        let name = document.createElement("p");
        name.textContent = "Name: " + item.name;

        let reference = document.createElement("p");
        reference.textContent = "Reference: " + item.reference;

        let quantity = document.createElement("p");
        quantity.textContent = "Quantity: " + item.quantity;

        let buyingPrice = document.createElement("p");
        buyingPrice.textContent = "Buying Price: " + item.buyingPrice;

        let sellingPrice = document.createElement("p");
        sellingPrice.textContent = "Selling Price: " + item.sellingPrice;

        let priceDifference = document.createElement("p");
        priceDifference.textContent = "Price Difference: " + item.priceDifference;

        let barcodeImg = document.createElement("img");
        barcodeImg.src = ""; // Set the source initially to avoid broken image icon
        barcodeImg.id = "barcode-" + item.reference; // Use unique ID for each barcode

        itemCard.appendChild(barcodeImg); // Append barcode image to the item card
        itemCard.appendChild(name);
        itemCard.appendChild(reference);
        itemCard.appendChild(quantity);
        itemCard.appendChild(buyingPrice);
        itemCard.appendChild(sellingPrice);
        itemCard.appendChild(priceDifference);

        itemListDiv.appendChild(itemCard);

        // Generate and display barcode
        JsBarcode("#barcode-" + item.reference, item.barcode, {
            format: "CODE128", // Choose the barcode format (CODE128, CODE39, etc.)
            displayValue: false, // Whether to display the value below the barcode
            height: 40 // Height of the barcode
        });
    });
}

function printTickets() {
    window.print();
}

function showEditBlock() {
    document.getElementById("editBlock").style.display = "block";
}
function saveChanges() {
    let reference = document.getElementById("editReference").value;
    let quantity = parseInt(document.getElementById("editQuantity").value);
    let buyingPrice = parseFloat(document.getElementById("editBuyingPrice").value);
    let sellingPrice = parseFloat(document.getElementById("editSellingPrice").value);
    let priceDifference = parseFloat(document.getElementById("editPriceDifference").value);

    // Find the item with the given reference
    let itemIndex = items.findIndex(item => item.reference === reference);
    if (itemIndex !== -1) {
        // Update quantity, buying price, selling price, and price difference
        items[itemIndex].quantity = quantity;
        items[itemIndex].buyingPrice = buyingPrice;
        items[itemIndex].sellingPrice = sellingPrice;
        items[itemIndex].priceDifference = priceDifference;
        // Display updated items
        displayItems(items);

        // Save changes to the database or backend here
        // This could involve making an API call to update the item in the database
        // Example:
        // updateItemInDatabase(items[itemIndex]);
    }

    // Hide the edit block after saving changes
    document.getElementById("editBlock").style.display = "none";
}



function exportToExcel() {
    // Extract necessary fields from items
    let itemsData = items.map(({ name, reference, quantity, buyingPrice, sellingPrice, priceDifference }) => ({ name, reference, quantity, buyingPrice, sellingPrice, priceDifference }));

    // Convert data to worksheet
    let worksheet = XLSX.utils.json_to_sheet(itemsData);

    // Create workbook
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

    // Generate Excel file
    let today = new Date();
    let fileName = "items_" + today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + ".xlsx";
    XLSX.writeFile(workbook, fileName);
}

function exportSearchedItemsToExcel() {
    let searchTerm = document.getElementById("searchInput").value.toLowerCase();
    let filteredItems = items.filter(item => {
        return item.name.toLowerCase().includes(searchTerm) ||
               item.reference.toLowerCase().includes(searchTerm) ||
               item.barcode.toLowerCase().includes(searchTerm);
    });

    // Extract necessary fields from filtered items
    let itemsData = filteredItems.map(({ name, reference, quantity, buyingPrice, sellingPrice, priceDifference }) => ({ name, reference, quantity, buyingPrice, sellingPrice, priceDifference }));

    // Convert data to worksheet
    let worksheet = XLSX.utils.json_to_sheet(itemsData);

    // Create workbook
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

    // Generate Excel file
    let today = new Date();
    let fileName = "items_" + searchTerm + "_" + today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + ".xlsx";
    XLSX.writeFile(workbook, fileName);
}
