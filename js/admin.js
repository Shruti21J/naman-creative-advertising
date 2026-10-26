
const API_BASE_URL = "http://127.0.0.1:8000";

const loginForm = document.getElementById("login-form");
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginError = document.getElementById("login-error");
const productsContainer = document.getElementById("products-container");

const productForm = document.getElementById("product-form");
const addProductButton = document.getElementById("add-product-button");
const cancelProductButton = document.getElementById("cancel-product-button");


loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    loginError.textContent = "Logging in...";

    try {
        const response = await fetch(`${API_BASE_URL}/admin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Login failed. Check your credentials."
            );
        }

        // Keep the token in memory for this page session.
        adminToken = data.access_token;
sessionStorage.setItem("adminToken", adminToken);

        loginSection.hidden = true;
        dashboardSection.hidden = false;

        loginError.textContent = "";

        await loadEnquiries();
        await loadProducts();

    } catch (error) {
        loginError.textContent =
            error.message === "Failed to fetch"
                ? "Cannot reach the backend. Make sure FastAPI is running."
                : error.message;
    }
});

let adminToken = sessionStorage.getItem("adminToken");


async function loadEnquiries() {
    const container = document.getElementById("enquiries-container");
    const message = document.getElementById("dashboard-message");

    message.textContent = "Loading enquiries...";

    try {
        const response = await fetch(`${API_BASE_URL}/admin/enquiries`, {
            headers: {
                "Authorization": `Bearer ${adminToken}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Could not load enquiries.");
        }

        message.textContent = `Total enquiries: ${data.enquiries.length}`;
        container.replaceChildren();

        if (data.enquiries.length === 0) {
            container.textContent = "No enquiries yet.";
            return;
        }

        data.enquiries.forEach((enquiry) => {
            const card = document.createElement("article");
            card.className = "enquiry-card";

            const customer = document.createElement("h2");
            customer.textContent = enquiry.name;

            const product = document.createElement("p");
            product.textContent = `Product: ${enquiry.product}`;

            const phone = document.createElement("p");
            phone.textContent = `Phone: ${enquiry.phone}`;

            const statusLabel = document.createElement("p");
            statusLabel.textContent = `Current status: ${enquiry.status}`;

            const messageText = document.createElement("p");
            messageText.textContent = `Message: ${enquiry.message || "No message"}`;

            const statusSelect = document.createElement("select");
            statusSelect.setAttribute(
                "aria-label",
                `Status for enquiry ${enquiry.id}`
            );

            ["new", "contacted", "completed"].forEach((value) => {
                const option = document.createElement("option");
                option.value = value;
                option.textContent =
                    value.charAt(0).toUpperCase() + value.slice(1);
                option.selected = value === enquiry.status;
                statusSelect.appendChild(option);
            });

            const updateButton = document.createElement("button");
            updateButton.type = "button";
            updateButton.textContent = "Update Status";

            updateButton.addEventListener("click", async () => {
                updateButton.disabled = true;
                updateButton.textContent = "Updating...";

                try {
                    const updateResponse = await fetch(
                        `${API_BASE_URL}/admin/enquiries/${enquiry.id}/status`,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${adminToken}`
                            },
                            body: JSON.stringify({
                                status: statusSelect.value
                            })
                        }
                    );

                    const result = await updateResponse.json();

                    if (!updateResponse.ok) {
                        throw new Error(
                            result.detail || "Could not update status."
                        );
                    }

                    statusLabel.textContent =
                        `Current status: ${result.enquiry.status}`;

                    message.textContent =
                        `Enquiry #${enquiry.id} updated successfully.`;

                } catch (error) {
                    message.textContent = error.message;
                } finally {
                    updateButton.disabled = false;
                    updateButton.textContent = "Update Status";
                }
            });

            card.append(
                customer,
                product,
                phone,
                statusLabel,
                messageText,
                statusSelect,
                updateButton
            );

            container.appendChild(card);
        });

    } catch (error) {
        message.textContent = error.message;
    }
}

async function loadProducts() {
    const message = document.getElementById("products-message");

    message.textContent = "Loading products...";
    productsContainer.replaceChildren();

    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Could not load products.");
        }

        // Support either a plain array or an object containing products.
        const products = Array.isArray(data) ? data : data.products;

        if (!Array.isArray(products)) {
            throw new Error("Unexpected product data format.");
        }

        message.textContent = `Total products: ${products.length}`;

        if (products.length === 0) {
            productsContainer.textContent = "No products found.";
            return;
        }

        products.forEach((product) => {
            const card = document.createElement("article");
            card.className = "product-card";

            const name = document.createElement("h2");
            name.textContent = product.name;

            const category = document.createElement("p");
            category.textContent = `Category: ${product.category}`;

            const description = document.createElement("p");
            description.textContent = product.description || "No description";

            const moq = document.createElement("p");
            moq.textContent = `Minimum order: ${product.moq || "Not specified"}`;

            
const image = document.createElement("img");
image.alt = product.name;
image.loading = "lazy";

if (product.image_url) {
    image.src = product.image_url;
} else {
    image.hidden = true;
}

const price = document.createElement("p");
price.textContent = `Price: ${product.price ?? "Not specified"}`;

const editButton = document.createElement("button");
editButton.type = "button";
editButton.textContent = "Edit";
editButton.addEventListener("click", function () { document.getElementById("product-name").value = product.name || "";
    document.getElementById("product-category").value = product.category || "";
    document.getElementById("product-description").value = product.description || "";
    document.getElementById("product-price").value = product.price ?? "";
    document.getElementById("product-image").value = product.image_url || "";
    document.getElementById("product-moq").value = product.moq || "";

    productForm.dataset.productId = product.id;
    productForm.querySelector('h2').textContent = "Edit Product";

    const saveButton = productForm.querySelector('button[type="submit"]');
    saveButton.textContent = "Save Changes";

    productForm.hidden = false;
    addProductButton.hidden = true;
    productForm.scrollIntoView({ behavior: "smooth", block: "start" });
    
});

const deleteButton = document.createElement("button");
deleteButton.type = "button";
deleteButton.textContent = "Delete";

deleteButton.addEventListener("click", async function () {
    const confirmed = window.confirm(
        `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    deleteButton.disabled = true;
    deleteButton.textContent = "Deleting...";

    const message = document.getElementById("products-message");

    try {
        const response = await fetch(
            `${API_BASE_URL}/products/${product.id}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${adminToken}`
                }
            }
        );

        if (!response.ok) {
            const data = await response.json();
            throw new Error(
                data.detail || "Could not delete product."
            );
        }

        message.textContent = "Product deleted successfully!";
        await loadProducts();
    } catch (error) {
        message.textContent = error.message === "Failed to fetch"
            ? "Cannot reach the backend. Make sure FastAPI is running."
            : error.message;

        deleteButton.disabled = false;
        deleteButton.textContent = "Delete";
    }
});


card.append(
    image,
    name,
    category,
    description,
    price,
    moq,
    editButton,
    deleteButton
);

productsContainer.appendChild(card);

        });
    } catch (error) {
        message.textContent = error.message === "Failed to fetch"
            ? "Cannot reach the backend. Make sure FastAPI is running."
            : error.message;
    }
}


document.getElementById("logout-button").addEventListener("click", function () {
    adminToken = null;
sessionStorage.removeItem("adminToken");

    dashboardSection.hidden = true;
    loginSection.hidden = false;

    loginForm.reset();
    loginError.textContent = "";
});

addProductButton.addEventListener("click", function () {
    productForm.hidden = false;
    addProductButton.hidden = true;
});

cancelProductButton.addEventListener("click", function () {
    productForm.reset();
    productForm.hidden = true;
    addProductButton.hidden = false;
});

productForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const saveButton = productForm.querySelector('button[type="submit"]');
    const message = document.getElementById("products-message");

    const product = {
        name: document.getElementById("product-name").value.trim(),
        category: document.getElementById("product-category").value.trim(),
        description: document.getElementById("product-description").value.trim() || null,
        price: document.getElementById("product-price").value === ""
            ? null
            : Number(document.getElementById("product-price").value),
        image_url: document.getElementById("product-image").value.trim() || null,
        moq: document.getElementById("product-moq").value.trim() || null
    };

    saveButton.disabled = true;
    saveButton.textContent = "Saving...";
    message.textContent = "";

    try {
        
const productId = productForm.dataset.productId;
const isEditing = Boolean(productId);

const response = await fetch(
    isEditing
        ? `${API_BASE_URL}/products/${productId}`
        : `${API_BASE_URL}/products`,
    {
        method: isEditing ? "PUT" : "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify(product)
    }
);


        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                typeof data.detail === "string"
                    ? data.detail
                    : "Could not save product. Check the fields and try again."
            );
        }

        
message.textContent = isEditing
? "Product updated successfully!"
: "Product added successfully!";

productForm.reset();
delete productForm.dataset.productId;
productForm.querySelector("h2").textContent = "Add a New Product";

const saveButton = productForm.querySelector('button[type="submit"]');
saveButton.textContent = "Save Product";

productForm.hidden = true;
addProductButton.hidden = false;

await loadProducts();

    } catch (error) {
        message.textContent = error.message === "Failed to fetch"
            ? "Cannot reach the backend. Make sure FastAPI is running."
            : error.message;
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = "Save Product";
    }
});


// Restore the dashboard after a page refresh.
if (adminToken) {
    loginSection.hidden = true;
    dashboardSection.hidden = false;
    loadEnquiries();
    loadProducts();
}
