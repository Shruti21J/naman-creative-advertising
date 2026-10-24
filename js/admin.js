
const API_BASE_URL = "http://127.0.0.1:8000";

const loginForm = document.getElementById("login-form");
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginError = document.getElementById("login-error");

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

document.getElementById("logout-button").addEventListener("click", function () {
    adminToken = null;
sessionStorage.removeItem("adminToken");

    dashboardSection.hidden = true;
    loginSection.hidden = false;

    loginForm.reset();
    loginError.textContent = "";
});

// Restore the dashboard after a page refresh.
if (adminToken) {
    loginSection.hidden = true;
    dashboardSection.hidden = false;
    loadEnquiries();
}
