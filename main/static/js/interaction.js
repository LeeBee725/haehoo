const clickScrap = (id, title, category, loginUser, btnChange) => {
    if (loginUser == "" || loginUser === undefined) {
        window.location.assign(`${window.origin}/account/login/`);
        return ;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    try {
        fetch(`${window.origin}/bucket-list/${loginUser.nickname}/scrap/${id}`, {
            method: "POST",
            headers: {
                'X-CSRFToken': getCsrfToken()
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message != 'OK') {
                throw new Error("Click Scrap Fail.");
            }
            btnChange(id, data);
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

const scrapBtnChange = (id, data) => {
    let scrapCnts = document.querySelectorAll(`#btn-scrap${id} + label`);
    let btnScraps = document.querySelectorAll(`#btn-scrap${id}`);
    
    for (let i = 0; i < scrapCnts.length; ++i)
        scrapCnts[i].textContent = data.scrap_cnt;
    if (data.type == "create") {
        for (let i = 0; i < btnScraps.length; ++i) {
            btnScraps[i].querySelector("img").setAttribute("src", "/static/image/bookmark_fill.svg");
        }
        const newBucketPath = document.createElement("a");
        newBucketPath.setAttribute("style", "margin:0 5px;")
        newBucketPath.setAttribute("href", `${window.origin}/bucketprocess/${JSON.parse(data.new_bucket)[0].pk}`);
        newBucketPath.innerHTML = "<small>바로가기</small>";
        alertHaehooAlert("success", "새 버킷이 생성되었습니다.", newBucketPath);
    } else {
        for (let i = 0; i < btnScraps.length; ++i) {
            btnScraps[i].querySelector("img").setAttribute("src", "/static/image/bookmark.svg");
        }
        alertHaehooAlert("success", "버킷을 삭제하였습니다.");
    }
}

const clickLike = (id, loginUser, btnChange) => {
    if (loginUser == "" || loginUser === undefined) {
        window.location.assign(`${window.origin}/account/login/`);
        return ;
    }
    try {
        fetch(`${window.origin}/bucket-list/${loginUser.nickname}/like/${id}`, {
            method: "POST",
            headers: {
                'X-CSRFToken': getCsrfToken()
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message != 'OK') {
                throw new Error("Click Like Fail.");
            }
            btnChange(id, data);
        })
    } catch(error) {
        console.error(error);
    }
}

const likeBtnChange = (id, data) => {
    let likeCnts = document.querySelectorAll(`#btn-like${id} + label`);
    let btnLikes = document.querySelectorAll(`#btn-like${id}`);
    
    for (let i = 0; i < likeCnts.length; ++i) {
        likeCnts[i].textContent = data.like_cnt;
    }
    if (data.is_contains) {
        for (let i = 0; i < btnLikes.length; ++i)
            btnLikes[i].querySelector("img").setAttribute("src", "/static/image/like_fill.svg");
    } else {
        for (let i = 0; i < btnLikes.length; ++i)
            btnLikes[i].querySelector("img").setAttribute("src", "/static/image/like.svg");
    }
}