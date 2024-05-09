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
    let price = parseFloat(document.getElementById("price").value);
    let currency = document.getElementById("currency").value;
    // let itemImage = document.getElementById("itemImage").files[0];
    let reference = generateReference(); // Generate reference number
    let barcode = generateBarcode(); // Generate barcode

    // Create new item object
    let newItem = {
        reference: reference,
        name: itemName,
        quantity: quantity,
        price: price,
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

        // let image = document.createElement("img");
        // image.src = URL.createObjectURL(item.image);
        // image.alt = item.name;

        let name = document.createElement("p");
        name.textContent = item.name;

        let reference = document.createElement("p");
        reference.textContent = "Reference: " + item.reference;

        let quantity = document.createElement("p");
        quantity.textContent = "Quantity: " + item.quantity;

        let price = document.createElement("p");
        price.textContent = "Price: " + item.currency + " " + item.price.toFixed(2);

        let barcodeImg = document.createElement("img");
        barcodeImg.id = "barcode-" + item.reference; // Use unique ID for each barcode
        itemCard.appendChild(barcodeImg);

        itemCard.appendChild(image);
        itemCard.appendChild(name);
        itemCard.appendChild(reference);
        itemCard.appendChild(quantity);
        itemCard.appendChild(price);

        itemListDiv.appendChild(itemCard);

        // Generate and display barcode
        JsBarcode("#barcode-" + item.reference, item.barcode, {
            format: "CODE128", // Choose the barcode format (CODE128, CODE39, etc.)
            displayValue: false, // Whether to display the value below the barcode
            height: 40 // Height of the barcode
        });
    });
}
function exportToExcel() {
    // Exclude barcode from items data
    // let itemsWithoutBarcode = items.map(({ barcode, ...rest }) => rest);

    // // Log items without barcode to verify
    // console.log("Items without barcode:", itemsWithoutBarcode);

    // // Convert items array to worksheet
    // let worksheet = XLSX.utils.json_to_sheet(itemsWithoutBarcode);

    // Create workbook
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

    // Generate Excel file
    let today = new Date();
    let fileName = "items_" + today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + ".xlsx";

    // Convert workbook to binary string
    let excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Create blob object from binary string
    let blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    // Create download link and trigger click
    let downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    downloadLink.click();
}
function exportSearchedItemsToExcel() {
    let searchTerm = document.getElementById("searchInput").value.toLowerCase();
    let filteredItems = items.filter(item => {
        return item.name.toLowerCase().includes(searchTerm) ||
               item.reference.toLowerCase().includes(searchTerm) ||
               item.barcode.toLowerCase().includes(searchTerm);
    });

    // Convert filtered items array to worksheet
    let worksheet = XLSX.utils.json_to_sheet(filteredItems);

    // Create workbook
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

    // Generate Excel file
    let today = new Date();
    let fileName = "items_" + searchTerm + "_" + today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + ".xlsx";

    // Convert workbook to binary string
    let excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Create blob object from binary string
    let blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    // Create download link and trigger click
    let downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    downloadLink.click();
}
// Function to handle barcode scanning
function scanBarcode() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#barcodeScanner') // Or '#yourElement' (optional)
        },
        decoder: {
            readers: ["ean_reader"] // Change to match the type of barcode you want to scan
        }
    }, function (err) {
        if (err) {
            console.error("Failed to initialize Quagga: " + err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function (result) {
        let scannedBarcode = result.codeResult.code;
        console.log("Scanned Barcode:", scannedBarcode);
        document.getElementById("searchInput").value = scannedBarcode;
        Quagga.stop();
        searchItem(); // Trigger search with the scanned barcode
    });
}
// function exportToExcel() {
//     // Convert items array to worksheet
//     let worksheet = XLSX.utils.json_to_sheet(items);

//     // Convert images to base64 and add them to the worksheet
//     items.forEach(item => {
//         let image = item.image;
//         if (image) {
//             let reader = new FileReader();
//             reader.readAsDataURL(image);
//             reader.onloadend = function() {
//                 let base64Data = reader.result.split(",")[1];
//                 XLSX.utils.sheet_add_image(worksheet, "C" + (items.indexOf(item) + 2), base64Data, { 
//                     /* Specify image properties such as width, height, etc. if needed */ 
//                 });
//                 if (items.indexOf(item) === items.length - 1) {
//                     // Generate Excel file when all images are added
//                     generateExcelFile(worksheet);
//                 }
//             }
//         }
//     });

}