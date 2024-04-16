document.addEventListener('DOMContentLoaded', function() {
    const statuses = ['Ordered', 'Preparing', 'Dispatched', 'In Route', 'Arrived', 'Completed'];

    function checkOrderIDAndRedirect() {
        const queryParams = new URLSearchParams(window.location.search);
        if (!queryParams.has('orderID')) {
            window.location.href = 'form.html';
        }
    }
  
    checkOrderIDAndRedirect();  

    function displaySpinner(show) {
        const spinner = document.getElementById('spinner');
        if (!spinner) {
            console.error('Spinner element not found!');
            return;
        }
        spinner.style.display = show ? 'flex' : 'none';
    }

    function getOrderIDFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const orderID = urlParams.get('orderID');
        console.log('Order ID from URL:', orderID);
        return orderID;
    }

    async function fetchStatus(orderID) {
        displaySpinner(true);
        try {
            const response = await fetch('https://bridge.espco.xyz/bigsave-liquor-get-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: orderID }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const responseData = await response.json();
            console.log('API Response:', responseData);

            // Extract and display the customer name
            const customerNameElement = document.getElementById('customerName');
            if (customerNameElement) {
                customerNameElement.textContent = responseData['customer-name'];
            }

            // Update the order ID in the HTML
            const orderIDElement = document.getElementById('orderID');
            if (orderIDElement) {
                orderIDElement.textContent = orderID;
            }

            if (responseData.cancel) {
                updateStatusText("CANCELLED");
                displayDriverName(""); // Hide driver's name
                updateStatusDatesAndTimes({}, true); // Clear dates and times
                updateStatusImages("CANCELLED", true); // Set all images to w_grey version
            } else {
                updateStatusText(responseData.status);
                updateStatusImages(responseData.status, false);
                updateStatusDatesAndTimes(responseData, false);
                displayDriverName(responseData.driver);
            }

            const resultBox = document.getElementById('resultBox');
            if (resultBox) {
                resultBox.textContent = `Current Status: ${responseData.status}`;
            } 

        } catch (error) {
            console.error('Error:', error);
            const resultBox = document.getElementById('resultBox');
            if (resultBox) {
                resultBox.textContent = 'Failed to fetch status: ' + error.message;
            }
        } finally {
            displaySpinner(false);
        }
    }
    
    function displayDriverName(driver) {
        const driverNameElement = document.getElementById('driverName');
        if (!driverNameElement) {
            console.error('Driver Name element not found!');
            return;
        }
        
        if (driver && driver !== "NaN") {
            driverNameElement.textContent = `Driver: ${driver}`;
            driverNameElement.style.display = 'block'; // Make it visible
        } else {
            driverNameElement.style.display = 'none'; // Hide it if driver's name is not available or is "NaN"
        }
    }

    function updateStatusDatesAndTimes(data, isCancelled) {
        if (isCancelled) {
            clearDateTimeForAllStages();
        } else {
            const dateFormat = { year: 'numeric', month: 'short', day: 'numeric' };
            const timeFormat = { hour: '2-digit', minute: '2-digit', hour12: false };
        
            function updateDateTime(dateTime, dateElementId, timeElementId) {
                if (isNaN(Date.parse(dateTime))) {
                    document.getElementById(dateElementId).textContent = "Stage";
                    document.getElementById(timeElementId).textContent = "Incomplete";
                } else {
                    const dateObj = new Date(dateTime);
                    document.getElementById(dateElementId).textContent = dateObj.toLocaleDateString('en-US', dateFormat);
                    document.getElementById(timeElementId).textContent = dateObj.toLocaleTimeString('en-US', timeFormat);
                }
            }
        
            updateDateTime(data['order-time'], 'orderDate', 'orderTime');
            updateDateTime(data['prepare-time'], 'prepareDate', 'prepareTime');
            updateDateTime(data['dispatch-time'], 'dispatchDate', 'dispatchTime');
            updateDateTime(data['inroute-time'], 'inrouteDate', 'inrouteTime');
            updateDateTime(data['arrive-time'], 'arriveDate', 'arriveTime');
            updateDateTime(data['complete-time'], 'completeDate', 'completeTime');
        }
    }
    
    function clearDateTimeForAllStages() {
        const stages = ['order', 'prepare', 'dispatch', 'inroute', 'arrive', 'complete'];
        stages.forEach(stage => {
            document.getElementById(`${stage}Date`).textContent = "";
            document.getElementById(`${stage}Time`).textContent = "";
        });
    }

    function refreshStatus(event) {
        event.preventDefault();
        const orderID = getOrderIDFromURL();
        if (orderID) {
            fetchStatus(orderID);
        } else {
            console.error('Order ID not found in URL');
        }
    }
    
    const refreshLink = document.getElementById('refreshLink');
    if (refreshLink) {
        refreshLink.addEventListener('click', refreshStatus);
    } else {
        console.error('Refresh link not found');
    }

    const orderID = getOrderIDFromURL();
    if (orderID) {
        fetchStatus(orderID);
    } else {
        console.error('Order ID not found in URL');
    }

    function updateStatusText(newStatus) {
        var statusTextElement = document.getElementById('statusText');
        statusTextElement.textContent = newStatus;
    }

    function updateStatusImages(currentStatus, isCancelled) {
        statuses.forEach((status, index) => {
            const elementId = `status${status.replace(/\s+/g, '')}`;
            const element = document.getElementById(elementId);
            if (!element) {
                console.error(`Element with ID ${elementId} not found.`);
                return;
            }
    
            const image = element.getElementsByTagName('img')[0];
            if (!image) {
                console.error(`Image for ${status} not found.`);
                return;
            }
    
            let imageSuffix = isCancelled ? 'w_grey' : getImageSuffixForStatus(currentStatus, status);
            const imageName = status.replace(/\s/g, '');
            image.src = `liquor-images/${imageName}_${imageSuffix}.png`;
        });
    }
    
    function getImageSuffixForStatus(currentStatus, status) {
        if (status === currentStatus) {
            return 'w_blue'; // Current status
        } else if (statuses.indexOf(status) < statuses.indexOf(currentStatus)) {
            return 'black_w'; // Previous status
        } else {
            return 'w_grey'; // Future status
        }
    }    
});
