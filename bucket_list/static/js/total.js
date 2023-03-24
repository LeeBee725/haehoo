function eventUpdate(userNickname, pageNum) {
    $('.hh-bucket').on('click', function() {
        let bucketId = this.getAttribute("value");
        $('#exampleModal .modal-body').load(`${window.origin}/bucketprocess/${bucketId} #hh-popup`, function(){
            $('#exampleModal').modal('show');
            $(`#exampleModal .modal-body #btn-like${bucketId}`).on("click", function(event) {
                clickLike(this.getAttribute("value"), userNickname, likeBtnChange);
                event.stopPropagation();
            });
            $(`#exampleModal .modal-body #btn-scrap${bucketId}`).on("click", function(event) {
                let bucketId = this.getAttribute("value");
                let bucketElem = document.querySelector(`#bucket${bucketId}`);
                let title = bucketElem.querySelector("#bucket-title").textContent;
                let category = bucketElem.querySelector("#bucket-category").getAttribute("value");
                clickScrap(bucketId, title, category, userNickname, scrapBtnChange);
                event.stopPropagation();
            });
        });
    });

    let btnLikes = document.getElementsByClassName("hh-btn-like");
    for (let i = 0; i < btnLikes.length; ++i) {
        btnLikes[i].addEventListener("click", (event) => {
            clickLike(btnLikes[i].getAttribute("value"), userNickname, likeBtnChange);
            event.stopPropagation();
        });
    }
    
    let btnScraps = document.getElementsByClassName("hh-btn-scrap");
    for (let i = 0; i < btnScraps.length; ++i) {
        let bucketId = btnScraps[i].getAttribute("value");
        let bucketElem = document.querySelector(`#bucket${bucketId}`);
        let title = bucketElem.querySelector("#bucket-title").textContent;
        let category = bucketElem.querySelector("#bucket-category").getAttribute("value");
        btnScraps[i].addEventListener("click", (event) => {
            clickScrap(bucketId, title, category, userNickname, scrapBtnChange);
            event.stopPropagation();
        });
    }
    let anchorUserName = document.getElementsByClassName("description-username");
    for (let i = 0; i < anchorUserName.length; ++i) {
        anchorUserName[i].addEventListener("click", (event) => event.stopPropagation());
    }

    // let lastKnownScrollPosition = 0;
    // let threshold = (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 0.9
    // let tickling = false;
    // let start = null;
    // document.addEventListener("scroll", (event) => {
    //     lastKnownScrollPosition = window.scrollY;
    //     let step = (timestamp) => {
    //         if (!start) start = timestamp;
    //         var progress = timestamp - start;
    //         if (progress < 2000) {
    //             window.requestAnimationFrame(step);
    //         }
    //     }
    //     window.requestAnimationFrame(step);
    //     getNextPage(++pageNum);
    // });
    let moreBtn = document.getElementById("hh-more-btn");
    moreBtn.addEventListener("click", (event) => {
        getNextPage(++pageNum);
        event.stopPropagation();
    })
}

window.onload = function() {
    const userNickname = JSON.parse(document.getElementById("user-nickname").textContent);
    let pageNum = 1;

    const queryString = window.location.search;
    const urlParam = new URLSearchParams(queryString);
    var fail = urlParam.get('fail')
    if (fail) {
        alertHaehooAlert("danger", "자신의 버킷은 스크랩 할 수 없습니다.");
    }

    eventUpdate(userNickname, pageNum);
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
        clickLike(this, nickname);
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
    const categories = ["", "하고 싶은 것", "먹고 싶은 것", "갖고 싶은 것", "가고 싶은 곳", "여행", "취미"];
    const description = document.createElement("div");
    description.setAttribute("class", "hh-bucket-description");
    description.innerHTML = ` \
        <p id="bucket-title" class="description-title">${bucketObj.fields.title}</p> \
        <span> \
            <p id="bucket-user" class="description-username">${nickname}</p> \
            <p id="bucket-category" class="description-category" value="${bucketObj.fields.category}">${categories[bucketObj.fields.category]}</p> \
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
                clickLike(this, nickname);
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

const getNextPage = (pageNum) => {
    try {
        fetch(`${window.origin}/bucket-list/?page=${pageNum}`, {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'X-CSRFToken': getCsrfToken()
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message != 'OK') {
                throw new Error("Next bucket Fail");
            }
            let buckets = JSON.parse(data.data)
            for (let i = 0; i < buckets.length; ++i) {
                console.log(i);
                let bucket = createBucketElem(buckets[i]);
                document.getElementById("bucket-container").appendChild(bucket);
            }
        })
    } catch(error) {
        console.error(error);
    }
    return pageNum + 1;
};
