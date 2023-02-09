// let updateCmntBtns = document.getElementsByClassName("button.updatecmnt")
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

let showUpdateForm = (id, comment)=>{
    
    let updateform = document.createElement("form")
    updateform.setAttribute("method", "POST")
    // updateform.setAttribute("action", `${window.location.origin}/bucketprocess/updatecomment/${id.slice(4)}`)
    updateform.setAttribute("id", "form"+id)
    updateform.onsubmit = function(){
        console.log("hi")
        var xhr = new XMLHttpRequest();
        xhr.open("POST", `${window.location.origin}/bucketprocess/updatecomment/${id.slice(4)}`, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.send(new FormData(this))
        
        xhr.onload = function() {
            if (xhr.status == 200) {
                console.log("yes 200")

                var res = JSON.parse(xhr.response);
                updateform.replaceWith(res.comment)
            } else {
                console.log("not 200")
            }
        }
    }

    let inputsection = document.createElement("input")
    inputsection.setAttribute("type", "text")
    inputsection.setAttribute("value", comment)

    let submit = document.createElement("button")
    submit.setAttribute("type", "submit")
    submit.innerHTML = "submit"

    let cancel = document.createElement("button")
    cancel.setAttribute("type", "none")
    cancel.innerHTML = "cancel"

    updateform.appendChild(inputsection)
    updateform.appendChild(submit)
    updateform.appendChild(cancel)
    
    // updateform.addEventListener("submit", function(event){
    //     var data = this;
    //     fetch(data.getAttribute('action'), {
    //         method: data.getAttribute('method'),
    //         body: new FormData(data)
    //     }).then((response) => console.log(response.json))
    //     .then(function (data) {
    //         console.log("data is ",data)
    //     })
    //     event.preventDefault()

    //     var xhr = new XMLHttpRequest();
    //     xhr.open("POST", `${window.location.origin}/bucketprocess/updatecomment/${id.slice(4)}`, true);
    //     xhr.setRequestHeader("Content-type", "application/json");
    //     xhr.setRequestHeader("X-CSRFToken", csrftoken);
    //     xhr.send()
        
    //     xhr.onload = function() {
    //         if (xhr.status == 200) {
    //             console.log("yes 200")

    //             var res = JSON.parse(xhr.response);
    //             updateform.replaceWith(res.comment)
    //         } else {
    //             console.log("not 200")
    //         }
    //     }
    
    // })  
    comment = document.getElementById(id)
    comment.replaceWith(updateform)
}

// var request = new XMLHttpRequest();
// request.setRequestHeader('X-CSRFToken', cookies['csrftoken']);                                           
// request.open("POST", window.location.origin + "");
// var formElement = document.querySelector("#myform");
// request.send(new FormData(formElement));

// updateCmntBtns.forEach(btn => {
//     btn.addEventListener('click', showUpdateForm)
// });