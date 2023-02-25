function getCsrfToken() {
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');
    return csrftoken;
}

// let showUpdateForm = (id, comment)=>{
function showUpdateForm(id, comment) {
    let updateform = document.createElement("form")
    updateform.setAttribute("method", "POST")
    updateform.setAttribute("action", `${window.location.origin}/bucketprocess/updatecomment/${id.slice(4)}`)
    updateform.setAttribute("id", "form"+id)

    // let csrfInput = document.createElement('input');
    // csrfInput.type = 'hidden';
    // csrfInput.name = '_csrf';
    // csrfInput.value = csrftoken;

    let inputsection = document.createElement("input")
    inputsection.setAttribute("type", "text")
    inputsection.setAttribute("name", "comment")
    inputsection.setAttribute("value", comment)

    let submit = document.createElement("button")
    submit.setAttribute("type", "submit")
    submit.innerHTML = "submit"

    let cancel = document.createElement("button")
    cancel.setAttribute("type", "none")
    cancel.innerHTML = "cancel"

    // updateform.appendChild(csrfInput)
    updateform.appendChild(inputsection)
    updateform.appendChild(submit)
    updateform.appendChild(cancel)
    
    updateform.onsubmit = event => {
        formdata = new FormData(event.target)

        try{
            response = fetch(updateform.getAttribute('action'), {
                method: updateform.getAttribute('method'),
                headers: {
                    'X-CSRFToken': getCsrfToken()
                  },
                body: formdata
            })
        
            if (response.ok) {
                const data = response.json()
                console.log(data)
            } else{
                console.log("response is not ok")
            }
        }catch(error){
            console.error("network error",error)
        }

        return false
    }
    comment = document.getElementById(id)
    comment.replaceWith(updateform)
}

// function showUpdateForm(id, comment) {
//     console.log(id);
//     console.log(comment);
// }

// var request = new XMLHttpRequest();
// request.setRequestHeader('X-CSRFToken', cookies['csrftoken']);                                           
// request.open("POST", window.location.origin + "");
// var formElement = document.querySelector("#myform");
// request.send(new FormData(formElement));


    // updateform.onsubmit = function(){
    //     console.log("hi")
    //     var xhr = new XMLHttpRequest();
    //     xhr.setRequestHeader("Content-type", "application/json");
    //     xhr.setRequestHeader("X-CSRFToken", csrftoken);
    //     xhr.open("POST", `${window.location.origin}/bucketprocess/updatecomment/${id.slice(4)}`, true);
    //     xhr.send(new FormData(this))
    //     console.log("after send")

    //     xhr.onload = function() {
    //         if (xhr.status == 200) {
    //             console.log("yes 200")

    //             var res = JSON.parse(xhr.response);
    //             updateform.replaceWith(res.comment)
    //         } else {
    //             console.log("not 200")
    //         }
    //     }

            // var xhr = new XMLHttpRequest();
        // xhr.open("POST", `${window.location.origin}/bucketprocess/updatecomment/${id.slice(4)}`, true);
        // xhr.setRequestHeader("Content-type", "application/json");
        // xhr.setRequestHeader("X-CSRFToken", csrftoken);
        // xhr.send()
        
        // xhr.onload = function() {
        //     if (xhr.status == 200) {
        //         console.log("yes 200")

        //         var res = JSON.parse(xhr.response);
        //         updateform.replaceWith(res.comment)
        //     } else {
        //         console.log("not 200")
        //     }
        // }
    
