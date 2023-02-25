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

let showUpdateForm = (id, comment)=>{
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
                    'X-CSRFToken': csrftoken
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

let updateCmntBtns = document.getElementsByClassName("button.updatecmnt")
for(let i = 0; i<updateCmntBtns.length; i++){
    updateCmntBtns[i].addEventListener('click', showUpdateForm)
}

function newCmntElemnt(text, cmntid){
    cmnt_card = document.createElement("div")
    cmnt_card.className ="card"
}

{/* 
<div class="card" id="cmnt{{comment.id}}">
{{comment.user.nickname}} : {{comment.comment}}
{% if user.id == comment.user.id %}
    <button type="button" class="updatecmnt" onclick="showUpdateForm('cmnt{{comment.id}}', '{{comment.comment}}')">update</button>                    
    <a href = "{% url 'deletecomment' bucketid=bucket.id commentid=comment.id %}">delete</a>
{% endif %}
</div> 
*/}
