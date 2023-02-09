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
    $('.bucket').on('click', function(){
        console.log("is it execute?\n");
        $('#exampleModal .modal-body').load('http://127.0.0.1:8000/bucketprocess/1', function(){
            $('#exampleModal').modal('show')
        });
    });

    // let newElement = document.createElement("h4");
    // newPara.innerHTML = "This is a new paragraph.";
    // let parentDiv = document.getElementById("myDiv");
    // parentDiv.appendChild(newPara);
    // hide & show div에 보내주고
}

function click_like(bucket_id, nickname) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", window.origin + "/bucket-list/" + nickname + "/like/" + bucket_id, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.send()
    
    xhr.onload = function() {
        if (xhr.status == 200) {
            var res = JSON.parse(xhr.response);
            var like_cnt = document.getElementById("like_cnt" + bucket_id);
            var btn_like = document.getElementById("btn_like" + bucket_id);
            like_cnt.textContent = res.like_cnt;
            if (res.is_contains) {
                btn_like.textContent = "♥";
            } else {
                btn_like.textContent = "♡";
            }
        } else {
            // fail 처리
        }
    }
}

function click_fix(bucket_id, nickname) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", window.origin + "/bucket-list/" + nickname + "/top_fixed/" + bucket_id, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.send()

    let top_fixed = document.createElement("top_fixed")

    xhr.onload = function() {
        if (xhr.status == 200) {
            var res = JSON.parse(xhr.response);
            var btn_fix = document.getElementById("btn_fix" + bucket_id);
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

function click_scrap(bucket_id, nickname) {
    window.location.assign(nickname + "/scrap/" + bucket_id)
}