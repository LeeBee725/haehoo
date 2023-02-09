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

function event_update(userNickname) {
    $('.bucket').on('click', function() {
        let bucket_id = this.getAttribute("value");
        $('#exampleModal .modal-body').load(window.origin + "/bucketprocess/" + bucket_id, function(){
            $('#exampleModal').modal('show');
            $('#exampleModal .modal-body #btn_like' + bucket_id).on("click", function() {
                click_like(this, userNickname);
            });
        });
    });
}

function click_like(bucket_id, nickname) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", nickname + "/like/" + bucket_id, true);
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
        $(`#alert-box-${type}`).alert('close');
    }, 3000);
    return alertBox
}
