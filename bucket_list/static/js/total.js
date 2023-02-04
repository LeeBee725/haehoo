function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

window.onload = function() {
    const userNickname = JSON.parse(document.getElementById("user-nickname").textContent);
    $('.bucket').on('click', function() {
        let bucket_id = this.getAttribute("value");
        $('#exampleModal .modal-body').load(window.origin + "/bucketprocess/" + bucket_id, function(){
            $('#exampleModal').modal('show');
            $('#exampleModal .modal-body #btn_like' + bucket_id).on("click", function() {
                click_like(this, userNickname);
            });
        });
    });

    const queryString = window.location.search;
    const urlParam = new URLSearchParams(queryString);
    var fail = urlParam.get('fail')
    if (fail)
    {
        var alertBox = document.createElement('div');
        var alertSpace = document.getElementById("alert-space");
        alertBox.setAttribute("id", "fail");
        alertBox.setAttribute("class", "alert alert-danger");
        alertBox.setAttribute("role", "alert");
        if (fail == "same_user_scrap")
            alertBox.textContent = "자신의 버킷을 스크랩 할 수 없습니다."
        alertSpace.appendChild(alertBox);
    }

    let btnLikes = document.getElementsByClassName("btn_like");
    for (let i = 0; i < btnLikes.length; ++i) {
        btnLikes[i].addEventListener("click", () => {
            click_like(btnLikes[i], userNickname);
        });
    }

    let btnScraps = document.getElementsByClassName("btn_scrap");
    for (let i = 0; i < btnScraps.length; ++i) {
        btnScraps[i].addEventListener("click", () => {
            click_scrap(btnScraps[i], userNickname);
        });
    }
}

function click_like(btn, nickname) {
    if (nickname == "" || nickname == null)
        window.location.assign(window.origin + "/account/login/");
    let xhr = new XMLHttpRequest();
    let bucket_id = btn.getAttribute("value");
    let url = window.origin + "/bucket-list/" + nickname + "/like/" + bucket_id
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.send()

    xhr.onload = function() {
        if (xhr.status == 200) {
            let res = JSON.parse(xhr.response);
            let like_cnts = document.querySelectorAll("#btn_like" + bucket_id + " + label");
            let btn_likes = document.querySelectorAll("#btn_like" + bucket_id);
            
            for (let i = 0; i < like_cnts.length; ++i) {
                like_cnts[i].textContent = res.like_cnt;
            }
            if (res.is_contains) {
                for (let i = 0; i < btn_likes.length; ++i)
                    btn_likes[i].textContent = "♥";
            } else {
                for (let i = 0; i < btn_likes.length; ++i)
                    btn_likes[i].textContent = "♡";
            }
        } else {
            // fail 처리
        }
    }
}

function createBucketElem(bucketObj, nickname) {
    let elem = document.createElement("div");
    let btnDetail = document.createElement("button");
    let interactions = document.createElement("div");
    btnDetail.setAttribute("id", "bucket" + bucketObj.pk);
    btnDetail.setAttribute("type", "button");
    btnDetail.setAttribute("class", "bucket");
    btnDetail.setAttribute("value", bucketObj.pk);
    btnDetail.setAttribute("data-bs-toggle", "modal");
    btnDetail.setAttribute("data-bs-target", "#exampleModal");
    btnDetail.innerHTML = ' \
        <div class="img-container"> \
        <img class="thumbnail" src="/static/image/sample.jpg" alt="sample"/> \
        </div> \
        <div class="description"> \
        <h3 id="bucket-title" class="description-title">' + bucketObj.fields.title + '</h3> \
        <p id="bucket-user" class="description-username">' + nickname + '</p> \
        <p id="bucket-category" class="description-username">' + bucketObj.fields.category + '</p> \
        </div> \
    '
    var btnLike = document.createElement("button");
    btnLike.setAttribute("id", "btn_like" + bucketObj.pk);
    btnLike.setAttribute("class", "btn_like");
    btnLike.setAttribute("value", bucketObj.pk);
    btnLike.textContent = "♡";
    btnLike.addEventListener("click", () => {
        console.log("haha");
        // console.log(this);
        // click_like(this, nickname);
    });
    interactions.appendChild(btnLike);
    interactions.innerHTML += ' \
        <label for="btn_like' + bucketObj.pk + '">0</label> \
        <span id="btn_scrap' + bucketObj.pk + '">퍼가기</span> \
        <label for="btn_scrap' + bucketObj.pk + '">0</label> \
    '
    elem.appendChild(btnDetail);
    elem.appendChild(interactions);
    return elem;
}

function click_scrap(btn, nickname) {
    if (nickname == "" || nickname == null)
        window.location.assign(window.origin + "/account/login/");
    let xhr = new XMLHttpRequest();
    let bucket_id = btn.getAttribute("value");
    let bucketElem = document.querySelector("#bucket" + bucket_id);
    let bucketDesc = bucketElem.querySelector(".description");
    let bucket = {
        "title": bucketDesc.querySelector("#bucket-title").textContent,
        "user": nickname,
        "category": bucketDesc.querySelector("#bucket-category").textContent
    };
    let url = window.origin + "/bucket-list/" + nickname + "/scrap/" + bucket_id;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.send(JSON.stringify(bucket));

    xhr.onload = function() {
        if (xhr.status == 200) {
            let res = JSON.parse(xhr.response);
            let scrap_cnts = document.querySelectorAll("#btn_scrap" + bucket_id + " + label");
            let btn_scraps = document.querySelectorAll("#btn_scrap" + bucket_id);

            for (let i = 0; i < scrap_cnts.length; ++i)
                scrap_cnts[i].textContent = res.scrap_cnt;
            if (res.type == "create") {
                for (let i = 0; i < btn_scraps.length; ++i) {
                    btn_scraps[i].textContent = "퍼가기 취소";
                }
                newBucketElem = createBucketElem(JSON.parse(res.new_bucket)[0], nickname);
                document.querySelector(".bucket-container").appendChild(newBucketElem);
            } else {
                for (let i = 0; i < btn_scraps.length; ++i) {
                    btn_scraps[i].textContent = "퍼가기";
                }
                let deletedElem = document.querySelector("#bucket" + res.deleted_bucket_id).parentElement;
                document.querySelector(".bucket-container").removeChild(deletedElem);
            }
        } else {
            // fail
        }
    }
}
