function event_update(userNickname) {
    $('.hh-bucket').on('click', function() {
        let bucketId = this.getAttribute("value");
        $('#exampleModal .modal-body').load(`${window.origin}/bucketprocess/${bucketId}`, function(){
            $('#exampleModal').modal('show');
            $(`#exampleModal .modal-body #btn-like${bucketId}`).on("click", function(event) {
                click_like(this, userNickname);
                event.stopPropagation();
            });
            $(`#exampleModal .modal-body #btn-scrap${bucketId}`).on("click", function(event) {
                click_scrap(this, userNickname);
                event.stopPropagation();
            });
        });
    });

    let btnLikes = document.getElementsByClassName("hh-btn-like");
    for (let i = 0; i < btnLikes.length; ++i) {
        btnLikes[i].addEventListener("click", (event) => {
            click_like(btnLikes[i], userNickname);
            event.stopPropagation();
        });
    }
    
    let btnScraps = document.getElementsByClassName("hh-btn-scrap");
    for (let i = 0; i < btnScraps.length; ++i) {
        btnScraps[i].addEventListener("click", (event) => {
            click_scrap(btnScraps[i], userNickname);
            event.stopPropagation();
        });
    }
}

window.onload = function() {
    const userNickname = JSON.parse(document.getElementById("user-nickname").textContent);

    const queryString = window.location.search;
    const urlParam = new URLSearchParams(queryString);
    var fail = urlParam.get('fail')
    if (fail) {
        let alertBox
        const alertSpace = document.getElementById("alert-space");
        if (fail == "same_user_scrap") {
            alertBox = createAlertBox(danger, "자신의 버킷을 스크랩 할 수 없습니다.", null);
        }
        alertSpace.appendChild(alertBox);
    }

    event_update(userNickname);
    
    // let newElement = document.createElement("h4");
    // newPara.innerHTML = "This is a new paragraph.";
    // let parentDiv = document.getElementById("myDiv");
    // parentDiv.appendChild(newPara);
    // hide & show div에 보내주고
}

function click_like(btn, nickname) {
    if (nickname == "" || nickname == null)
        window.location.assign(`${window.origin}/account/login/`);
    let xhr = new XMLHttpRequest();
    let bucketId = btn.getAttribute("value");
    let url = `${window.origin}/bucket-list/${nickname}/like/${bucketId}`;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("X-CSRFToken", getCsrfToken());
    xhr.send()

    xhr.onload = function() {
        if (xhr.status == 200) {
            let res = JSON.parse(xhr.response);
            let likeCnts = document.querySelectorAll(`#btn-like${bucketId} + label`);
            let btnLikes = document.querySelectorAll(`#btn-like${bucketId}`);
            
            for (let i = 0; i < likeCnts.length; ++i) {
                likeCnts[i].textContent = res.like_cnt;
            }
            if (res.is_contains) {
                for (let i = 0; i < btnLikes.length; ++i)
                    btnLikes[i].querySelector("img").setAttribute("src", "/static/image/like_fill.svg");
            } else {
                for (let i = 0; i < btnLikes.length; ++i)
                    btnLikes[i].querySelector("img").setAttribute("src", "/static/image/like.svg");
            }
        } else {
            // fail 처리
        }
    }
}


function click_fix(bucketId, nickname) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `${window.origin}/bucket-list/${nickname}/top_fixed/${bucketId}`, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.send()

    let top_fixed = document.createElement("top_fixed")

    xhr.onload = function() {
        if (xhr.status == 200) {
            var res = JSON.parse(xhr.response);
            var btn_fix = document.getElementById("btn_fix" + bucketId);
            if (res.top_fixed == true) {
                btn_fix.textContent = "★";
            } else {
                btn_fix.textContent = "☆";
            }
        } else {
            // fail 처리
        }
    }
}


function createBtnDetail(bucketObj) {
    const btnDetail = document.createElement("button");
    btnDetail.setAttribute("type", "button");
    btnDetail.setAttribute("class", "hh-bucket-btn");
    btnDetail.setAttribute("value", bucketObj.pk);
    btnDetail.setAttribute("data-bs-toggle", "modal");
    btnDetail.setAttribute("data-bs-target", "#exampleModal");
    
    btnDetail.innerHTML += ` \
        <div class="hh-bucket-img-container">
            <img class="hh-bucket-thumbnail" src="${bucketObj.fields.thumbnail_url}" alt="thumbnail">
        </div>
    `;
    return btnDetail;
}

function createBtnLikeSpace(bucketObj, nickname) {
    const btnSpace = document.createElement("div");
    btnSpace.setAttribute("class", "hh-btn-space");

    const btnLike = document.createElement("button");
    btnLike.setAttribute("id", `btn-like${bucketObj.pk}`);
    btnLike.setAttribute("class", "hh-btn-like");
    btnLike.setAttribute("value", bucketObj.pk);
    btnLike.addEventListener("click", function(event) {
        click_like(this, nickname);
        event.stopPropagation();
    });
    
    const imgLike = document.createElement("img");
    imgLike.setAttribute("src", "/static/image/like.svg");
    imgLike.setAttribute("alt", "♡");
    btnLike.appendChild(imgLike);

    const labelLike = document.createElement("label");
    labelLike.setAttribute("for", `btn-like${bucketObj.pk}`);
    labelLike.textContent = "0";

    btnSpace.appendChild(btnLike);
    btnSpace.appendChild(labelLike);
    return btnSpace;
}

function createBtnScrapSpace(bucketObj) {
    const btnSpace = document.createElement("div");
    btnSpace.setAttribute("class", "hh-btn-space");

    const btnScrap = document.createElement("span");
    btnScrap.setAttribute("id", `btn-scrap${bucketObj.pk}`);
    
    const imgScrap = document.createElement("img");
    imgScrap.setAttribute("src", "/static/image/bookmark_me.svg");
    imgScrap.setAttribute("alt", "나의버킷퍼간수");
    btnScrap.appendChild(imgScrap);

    const labelScrap = document.createElement("label");
    labelScrap.setAttribute("for", `btn-scrap${bucketObj.pk}`);
    labelScrap.textContent = "0";

    btnSpace.appendChild(btnScrap);
    btnSpace.appendChild(labelScrap);
    return btnSpace;
}

function createBucketDescription(bucketObj, nickname) {
    const description = document.createElement("div");
    description.setAttribute("class", "hh-bucket-description");
    description.innerHTML = ` \
        <p id="bucket-title" class="description-title">${bucketObj.fields.title}</p> \
        <span> \
            <p id="bucket-user" class="description-username">${nickname}</p> \
            <p id="bucket-category" class="description-category">${bucketObj.fields.category}</p> \
        </span> \
    `;
    const btns = document.createElement("div");
    const btnLikeSpace = createBtnLikeSpace(bucketObj, nickname);
    const btnScrapSpace = createBtnScrapSpace(bucketObj);
    btns.appendChild(btnLikeSpace);
    btns.appendChild(btnScrapSpace);

    description.appendChild(btns);
    return description;
}

function createBucketElem(bucketObj, nickname) {
    const elem = document.createElement("div");
    elem.setAttribute("id", `bucket${bucketObj.pk}`);
    elem.setAttribute("class", "col");

    const bucket = document.createElement("div");
    bucket.setAttribute("class", "hh-bucket");
    bucket.setAttribute("value", bucketObj.pk);
    bucket.addEventListener("click", function() {
        $('#exampleModal .modal-body').load(`${window.origin}/bucketprocess/${bucketObj.pk}`, function(){
            $('#exampleModal').modal('show');
            $(`#exampleModal .modal-body #btn-like${bucketObj.pk}`).on("click", function() {
                click_like(this, nickname);
            });
        });
    });

    const btnDetail = createBtnDetail(bucketObj);
    const description = createBucketDescription(bucketObj, nickname);
    
    bucket.appendChild(btnDetail);
    bucket.appendChild(description);
    elem.appendChild(bucket);
    return elem;
}

function createAlertBox(type, msg, url) {
    const alertBox = document.createElement("div");
    alertBox.setAttribute("id", `alert-box-${type}`);
    alertBox.setAttribute("class", `hh-alert-box alert alert-${type} alert-dismissible fade show`);
    alertBox.setAttribute("role", "alert");
    alertBox.innerHTML = [
        `<div>${msg}</div>`,
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'
    ].join("");
    if (url) {
        let anchor = document.createElement("a");
        anchor.setAttribute("href", url);
        anchor.innerHTML = "<small>바로가기</small>";
        alertBox.querySelector("div").appendChild(anchor);
    }
    setTimeout(function() {
        if ($(`#alert-box-${type}`))
            $(`#alert-box-${type}`).alert('close');
    }, 3000);
    return alertBox
}

function click_scrap(btn, nickname) {
    if (nickname == "" || nickname == null)
        window.location.assign(`${window.origin}/account/login/`);
    let xhr = new XMLHttpRequest();
    let bucket_id = btn.getAttribute("value");
    let bucketElem = document.querySelector(`#bucket${bucket_id}`);
    let bucket = {
        "title": bucketElem.querySelector("#bucket-title").textContent,
        "user": nickname,
        "category": bucketElem.querySelector("#bucket-category").textContent
    };
    let url = `${window.origin}/bucket-list/${nickname}/scrap/${bucket_id}`;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("X-CSRFToken", getCsrfToken());
    xhr.send(JSON.stringify(bucket));

    xhr.onload = function() {
        if (xhr.status == 200) {
            let res = JSON.parse(xhr.response);
            let scrapCnts = document.querySelectorAll(`#btn-scrap${bucket_id} + label`);
            let btnScraps = document.querySelectorAll(`#btn-scrap${bucket_id}`);

            for (let i = 0; i < scrapCnts.length; ++i)
                scrapCnts[i].textContent = res.scrap_cnt;
            if (res.type == "create") {
                for (let i = 0; i < btnScraps.length; ++i) {
                    btnScraps[i].querySelector("img").setAttribute("src", "/static/image/bookmark_fill.svg");
                }
                let newBucketElem = createBucketElem(JSON.parse(res.new_bucket)[0], nickname);
                let alertBox = createAlertBox("success", "새 버킷이 생성되었습니다.", `${window.origin}/bucket-list/${nickname}`);
                document.querySelector("#bucket-container").appendChild(newBucketElem);
                document.querySelector("#alert-space").appendChild(alertBox);
            } else {
                for (let i = 0; i < btnScraps.length; ++i) {
                    btnScraps[i].querySelector("img").setAttribute("src", "/static/image/bookmark.svg");
                }
                let deletedElem = document.querySelector(`#bucket${res.deleted_bucket_id}`);
                let alertBox = createAlertBox("success", "버킷을 삭제했습니다.", null);
                document.querySelector("#bucket-container").removeChild(deletedElem);
                document.querySelector("#alert-space").appendChild(alertBox);
            }
        } else {
            // fail
        }
    }
}