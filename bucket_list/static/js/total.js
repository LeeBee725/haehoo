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
    const userNickname = JSON.parse(document.getElementById("userNickname").textContent);
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
    for(let i = 0; i < btnLikes.length; ++i) {
        btnLikes[i].addEventListener("click", () => {
            click_like(btnLikes[i], userNickname);
        });
    }

    let btnScraps = document.getElementsByClassName("btn_scrap");
    for(let i = 0; i < btnScraps.length; ++i) {
        btnScraps[i].addEventListener("click", () => {
            click_scrap(btnScraps[i].getAttribute("value"), userNickname);
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
            var res = JSON.parse(xhr.response);
            var like_cnts = document.querySelectorAll("#btn_like" + bucket_id + " + label");
            var btn_likes = document.querySelectorAll("#btn_like" + bucket_id);
            
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

function click_scrap(bucket_id, nickname) {
    if (nickname == "" || nickname == null)
        window.location.assign(window.origin + "/account/login/");
    else
        window.location.assign(nickname + "/scrap/" + bucket_id);
}
