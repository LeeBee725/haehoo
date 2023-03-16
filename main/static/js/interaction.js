const clickScrap = (id, title, category, nickname, btn_change) => {
    if (nickname == "" || nickname == null)
        window.location.assign(`${window.origin}/account/login/`);
    const form_data = new FormData();
    form_data.append("title", title);
    form_data.append("category", category);
    try {
        fetch(`${window.origin}/bucket-list/${nickname}/scrap/${id}`, {
            method: "POST",
            headers: {
                'X-CSRFToken': getCsrfToken()
            },
            body: form_data
        })
        .then(response => response.json())
        .then(data => {
            if (data.message != 'OK') {
                throw new Error("Click Scrap Fail.");
            }
            btn_change(id, data);
        })
    } catch (error) {
        console.error(error);
    }
}

const alertHaehooAlert = (alertType="info", message="Default Message", htmlElement=null) => {
    const alertSpace = document.getElementById("hh-alert-space");

    const alertBox = document.createElement("div");
    alertBox.setAttribute("id", `alert-box-${alertType}`);
    alertBox.setAttribute("class", `hh-alert-box alert alert-${alertType} alert-dismissible fade show`);
    alertBox.setAttribute("role", "alert");

    const messageBox = document.createElement("span");
    messageBox.textContent = message;
    alertBox.appendChild(messageBox);

    if (htmlElement) {
        alertBox.appendChild(htmlElement);
    }

    const dismissButton = document.createElement("button");
    dismissButton.setAttribute("type", "button");
    dismissButton.setAttribute("class", "btn-close");
    dismissButton.setAttribute("data-bs-dismiss", "alert");
    dismissButton.setAttribute("aria-label", "Close");
    alertBox.appendChild(dismissButton);

    alertSpace.appendChild(alertBox);

    setTimeout(function() {
        if ($(`#alert-box-${alertType}`))
            $(`#alert-box-${alertType}`).alert('close');
    }, 3000);
};
