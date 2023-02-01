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

    const queryString = window.location.search;
    const urlParam = new URLSearchParams(queryString);
    console.log(urlParam);
    console.log(urlParam.get('fail'));
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
}

function click_like(bucket_id, nickname) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", nickname + "/like/" + bucket_id, true);
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

function click_scrap(bucket_id, nickname) {
    window.location.assign(nickname + "/scrap/" + bucket_id)
}
