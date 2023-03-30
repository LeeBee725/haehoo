// class Bucket extends HTMLElement {
//     bucketObj;
//     constructor(loginUser, bucketObj) { // HTMLElement는 constructor에 parameter 불가능 
//         super();
        
//         const bucket = createBucketElem(bucketObj, loginUser);
//         this.attachShadow({mode:'closed'}).appendChild(bucket.content.cloneNode(true));
//     }
// }

// window.customElements.define(
//     'hh-bucket', Bucket
// );

function eventUpdate(loginUser, pageNum) {
    $('.hh-bucket').on('click', function() {
        let bucketId = this.getAttribute("value");
        $('#exampleModal .modal-body').load(`${window.origin}/bucketprocess/${bucketId} #hh-popup`, function(){
            $('#exampleModal').modal('show');
            $(`#exampleModal .modal-body #btn-like${bucketId}`).on("click", function(event) {
                clickLike(this.getAttribute("value"), loginUser, likeBtnChange);
                event.stopPropagation();
            });
            $(`#exampleModal .modal-body #btn-scrap${bucketId}`).on("click", function(event) {
                let bucketId = this.getAttribute("value");
                let bucketElem = document.querySelector(`#bucket${bucketId}`);
                let title = bucketElem.querySelector("#bucket-title").textContent;
                let category = bucketElem.querySelector("#bucket-category").getAttribute("value");
                clickScrap(bucketId, title, category, loginUser, scrapBtnChange);
                event.stopPropagation();
            });
        });
    });

    let btnLikes = document.getElementsByClassName("hh-btn-like");
    for (let i = 0; i < btnLikes.length; ++i) {
        btnLikes[i].addEventListener("click", (event) => {
            clickLike(btnLikes[i].getAttribute("value"), loginUser, likeBtnChange);
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
            clickScrap(bucketId, title, category, loginUser, scrapBtnChange);
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
    //     getNextResourcePage(++pageNum);
    // });
    let moreBtn = document.getElementById("hh-more-btn");
    let requestUrl = `${window.origin}/bucket-list/`;
    moreBtn.addEventListener("click", (event) => {
        getNextResourcePage(loginUser, requestUrl, ++pageNum);
        event.stopPropagation();
    })
}

window.onload = function() {
    const loginUser = JSON.parse(document.getElementById("user-nickname").textContent);
    let pageNum = 1;

    const queryString = window.location.search;
    const urlParam = new URLSearchParams(queryString);
    var fail = urlParam.get('fail')
    if (fail) {
        alertHaehooAlert("danger", "자신의 버킷은 스크랩 할 수 없습니다.");
    }

    eventUpdate(loginUser, pageNum);
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
    btnDetail.setAttribute("value", bucketObj.id);
    btnDetail.setAttribute("data-bs-toggle", "modal");
    btnDetail.setAttribute("data-bs-target", "#exampleModal");

    btnDetail.innerHTML += ` \
        <div class="hh-bucket-img-container">
            <img class="hh-bucket-thumbnail" src="${bucketObj.thumbnail_url}" alt="thumbnail">
        </div>
    `;
    return btnDetail;
}

function createBtnLikeSpace(bucketObj, loginUser) {
    const btnSpace = document.createElement("div");
    btnSpace.setAttribute("class", "hh-btn-space");

    const btnLike = document.createElement("button");
    btnLike.setAttribute("id", `btn-like${bucketObj.id}`);
    btnLike.setAttribute("class", "hh-btn-like");
    btnLike.setAttribute("value", bucketObj.id);
    btnLike.addEventListener("click", function(event) {
        clickLike(this.getAttribute("value"), loginUser, likeBtnChange);
        event.stopPropagation();
    });

    const imgLike = document.createElement("img");
    if (bucketObj.liked_users.find(obj => obj.id == loginUser.id)) {
        imgLike.setAttribute("src", "/static/image/like_fill.svg");
        imgLike.setAttribute("alt", "♥");
    } else {
        imgLike.setAttribute("src", "/static/image/like.svg");
        imgLike.setAttribute("alt", "♡");
    }
    btnLike.appendChild(imgLike);

    const labelLike = document.createElement("label");
    labelLike.setAttribute("for", `btn-like${bucketObj.id}`);
    labelLike.textContent = `${bucketObj.liked_users.length}`;

    btnSpace.appendChild(btnLike);
    btnSpace.appendChild(labelLike);
    return btnSpace;
}

function createBtnScrapSpace(bucketObj, loginUser) {
    const btnSpace = document.createElement("div");
    btnSpace.setAttribute("class", "hh-btn-space");

    if (loginUser.nickname != bucketObj.user.nickname) {
        const btnScrap = document.createElement("button");
        btnScrap.setAttribute("id", `btn-scrap${bucketObj.id}`);
        btnScrap.setAttribute("class", "hh-btn-scrap");
        btnScrap.setAttribute("value", `${bucketObj.id}`);
        btnScrap.addEventListener("click", (event) => {
            clickScrap(bucketObj.id, bucketObj.title, bucketObj.category.key, loginUser, scrapBtnChange);
            event.stopPropagation();
        });

        const imgScrap = document.createElement("img");
        if (loginUser && loginUser.user_scraps.find(id => id == bucketObj.id)) {
            imgScrap.setAttribute("src", "/static/image/bookmark_fill.svg");
            imgScrap.setAttribute("alt", "퍼가기 취소");
        } else {
            imgScrap.setAttribute("src", "/static/image/bookmark.svg");
            imgScrap.setAttribute("alt", "퍼가기");
        }
        btnScrap.appendChild(imgScrap);

        btnSpace.appendChild(btnScrap);
    } else {
        const btnScrap = document.createElement("span");
        btnScrap.setAttribute("id", `btn-scrap${bucketObj.id}`);
        const imgScrap = document.createElement("img");
        imgScrap.setAttribute("src", "/static/image/bookmark_me.svg");
        imgScrap.setAttribute("alt", "나의버킷퍼간수");
        btnScrap.appendChild(imgScrap);

        btnSpace.appendChild(btnScrap);
    }

    const labelScrap = document.createElement("label");
    labelScrap.setAttribute("for", `btn-scrap${bucketObj.id}`);
    labelScrap.textContent = `${bucketObj.deriving_bucket.length}`;

    btnSpace.appendChild(labelScrap);
    return btnSpace;
}

function createBucketDescription(bucketObj, loginUser) {
    const description = document.createElement("div");
    description.setAttribute("class", "hh-bucket-description");
    description.innerHTML = ` \
        <p id="bucket-title" class="description-title">${bucketObj.title}</p> \
        <span> \
            <p id="bucket-user" class="description-username">${bucketObj.user.nickname}</p> \
            <p id="bucket-category" class="description-category" value="${bucketObj.category.key}">${bucketObj.category.value}</p> \
        </span> \
    `;
    const btns = document.createElement("div");
    const btnLikeSpace = createBtnLikeSpace(bucketObj, loginUser);
    const btnScrapSpace = createBtnScrapSpace(bucketObj, loginUser);
    btns.appendChild(btnLikeSpace);
    btns.appendChild(btnScrapSpace);

    description.appendChild(btns);
    return description;
}

function createBucketElem(bucketObj, loginUser) {
    const elem = document.createElement("div");
    elem.setAttribute("id", `bucket${bucketObj.id}`);
    elem.setAttribute("class", "col");

    const bucket = document.createElement("div");
    bucket.setAttribute("class", "hh-bucket");
    bucket.setAttribute("value", bucketObj.id);
    bucket.addEventListener("click", function() {
        let bucketId = this.getAttribute("value");
        $('#exampleModal .modal-body').load(`${window.origin}/bucketprocess/${bucketId} #hh-popup`, function(){
            $('#exampleModal').modal('show');
            $(`#exampleModal .modal-body #btn-like${bucketId}`).on("click", function(event) {
                clickLike(this.getAttribute("value"), loginUser, likeBtnChange);
                event.stopPropagation();
            });
            $(`#exampleModal .modal-body #btn-scrap${bucketId}`).on("click", function(event) {
                let bucketId = this.getAttribute("value");
                let bucketElem = document.querySelector(`#bucket${bucketId}`);
                let title = bucketElem.querySelector("#bucket-title").textContent;
                let category = bucketElem.querySelector("#bucket-category").getAttribute("value");
                clickScrap(bucketId, title, category, loginUser, scrapBtnChange);
                event.stopPropagation();
            });
        });
    });

    const btnDetail = createBtnDetail(bucketObj);
    const description = createBucketDescription(bucketObj, loginUser);
    
    bucket.appendChild(btnDetail);
    bucket.appendChild(description);
    elem.appendChild(bucket);
    return elem;
}

const getNextResourcePage = (loginUser, requestUrl, pageNum) => {
    try {
        fetch(`${requestUrl}?page=${pageNum}`, {
            method: "GET",
            headers: {
                'X-CSRFToken': getCsrfToken()
            }
        })
        .then(response => response.json())
        .then(data => {
            try {
                if (data.message != 'OK') {
                    throw (new Error("Next bucket Fail"));
                }
                let buckets = JSON.parse(data.data)
                for (let i = 0; i < buckets.length; ++i) {
                    let bucket = createBucketElem(buckets[i], loginUser);
                    document.getElementById("bucket-container").appendChild(bucket);
                }
            } catch (error) {
                alertHaehooAlert("danger", "다음 버킷이 없습니다.", null);
                console.error(error);
            }
        })
    } catch(error) {
        console.error(error);
    }
    return pageNum + 1;
};
