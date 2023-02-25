var showUpdateForm = (id, comment)=>{
    let cmnt_card = document.getElementById(id)
    
    let updateform = document.createElement("form")
    updateform.setAttribute("method", "POST")
    updateform.setAttribute("action", '#')
    updateform.setAttribute("id", "form"+id)

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

    updateform.appendChild(inputsection)
    updateform.appendChild(submit)
    updateform.appendChild(cancel)
    
    updateform.onsubmit = event => {
        formdata = new FormData(event.target)

        try{
            fetch(`${window.location.origin}/bucketprocess/updatecomment/${id.slice(4)}`, {
                method: updateform.getAttribute('method'),
                headers: {
                    'X-CSRFToken': getCsrfToken()
                  },
                body: formdata
            })
            .then(response => response.json())
            .then(data => {
                if (!data.success){
                    throw new Error("get success:False data from django view...")
                }
                else{
                    updateform.replaceWith(cmnt_card)
                    let cmmnt_text = cmnt_card.querySelector('.cmnttext')
                    cmmnt_text.innerHTML = data.newcomment
                }
            })
        }catch(error){
            console.error(error)
        }

        return false
    }

    cmnt_card.replaceWith(updateform)
}

var deleteComment = (id)=>{
    let cmnt_card = document.getElementById(id)

    try{
        fetch(`${window.location.origin}/bucketprocess/deletecomment/${id.slice(4)}`)
        .then(response => response.json())
        .then(data => {
            if (!data.success){
                throw new Error("get success:False data from django view...")
            }
            else{
                cmnt_card.remove()
            }
        })
    }catch(error){
        console.error(error)
    }
}

bucketid = document.getElementById("bucket-id").innerHTML
userid = document.getElementById("user-id").innerHTML

var form = document.getElementById("createcmnt")
form.onsubmit = (event) =>{
formdata = new FormData(event.target)
    try{
        fetch(`${window.location.origin}/bucketprocess/${bucketid}/createcomment/${userid}`, {
            method: form.getAttribute('method'),
            headers: {
                'X-CSRFToken': getCsrfToken()
                },
            body: formdata
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success){
                throw new Error("get success:False data from django view...")
            }
            else{
                console.log(data.success)
            }
        })
    }catch(error){
        console.error(error)
    }
    return false
}