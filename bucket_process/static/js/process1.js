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
    submit.className = "btn btn-link text-dark"
    submit.setAttribute("type", "submit")
    submit.innerHTML = "수정"

    let cancel = document.createElement("button")
    cancel.className = "btn btn-link text-dark"
    cancel.setAttribute("type", "none")
    cancel.innerHTML = "취소"

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
                let card = document.createElement("div")
                card.className = "card mb-2"
                card.id = `cmnt${data.id}`

                let cardbody = document.createElement("div")
                cardbody.className = "card-body row"

                let nickname = document.createElement("div")
                nickname.className = "card-text user-nickname col my-auto fw-bold"
                nickname.innerHTML = data.nickname
                cardbody.appendChild(nickname)

                if (Number(userid) === data.userid) {
                    let btnDiv = document.createElement("div")
                    btnDiv.className = "col"

                    let updatebutton = document.createElement("button")
                    updatebutton.className = "updatecmnt col btn btn-link text-dark"
                    updatebutton.setAttribute("type", "button")
                    updatebutton.setAttribute("onclick", `showUpdateForm('cmnt${data.id}', '${data.newcomment}')`)
                    updatebutton.innerHTML = "수정"
        
                    let deletebutton = document.createElement("button")
                    deletebutton.className = "deletecmnt col btn btn-link text-dark"
                    deletebutton.setAttribute("type", "button")
                    deletebutton.setAttribute("onclick", `deleteComment('cmnt${data.id}')`)
                    deletebutton.innerHTML = "삭제"
                    btnDiv.appendChild(updatebutton)
                    btnDiv.appendChild(deletebutton)
                    cardbody.appendChild(btnDiv)
                }
                let newcmnt = document.createElement("div")
                newcmnt.className = "cmnttext"
                newcmnt.innerHTML = data.newcomment

                cardbody.appendChild(newcmnt)
                card.appendChild(cardbody)

                let comentsection = document.getElementById("cmntsection")
                comentsection.appendChild(card)
                let inputcomment = document.getElementById("id_comment")
                inputcomment.value = null
                console.log("finish")
            }
        })
    }catch(error){
        console.error(error)
    }
    return false
}

var processform = document.getElementById("createprcs")
processform.onsubmit = (event) =>{
    formdata = new FormData(event.target)
    try{
        fetch(`${window.location.origin}/bucketprocess/${bucketid}/create`, {
            method: form.getAttribute('method'),
            headers: {
                'X-CSRFToken': getCsrfToken()
                },
            body: formdata
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success){
                throw new Error("get success:False data from django view... \nrequest method may not be POST")
            }
            else{
                console.log(data.image)
                card = document.createElement("div") 
                card.className = 'card mt-4 p'
                card.setAttribute('id', "prcs{{process.id}")
                if (data.image != ''){
                    card.innerHTML = `
                        <div class='card-body row'>
                            <h4 class='card-title col'>${data.title}</h4>
                            <a class='card-text col' href = "{% url 'processedit' process.id %}">수정하기</a>
                            <button type="button" class="card-text col btn btn-link text-dark" onclick = "deleteProcess('prcs{{process.id}}')">삭제하기</button>
                            <image src="${data.image}">
                            <p class='card-text'>${data.text}</p>
                            <p class='card-text'>${data.createdat}</p>
                        </div>`
                }
                else{
                    console.log('here')
                    card.innerHTML = `
                    <div class='card-body row'>
                        <h4 class='card-title col'>${data.title}</h4>
                        <a class='card-text col' href = "{% url 'processedit' process.id %}">수정하기</a>
                        <a class='card-text col' href = "{% url 'processdelete' process.id %}">삭제하기</a>
                        <p class='card-text'>${data.text}</p>
                        <p class='card-text'>${data.createdat}</p>
                    </div>`
                }
               document.getElementById('prcs_list').appendChild(card)
            }
        })
    }catch(error){
        console.error(error)
    }
    return false
}

var deleteProcess = (id)=>{
    let prcs_card = document.getElementById(id)

    try{
        fetch(`${window.location.origin}/bucketprocess/${id.slice(4)}/delete`)
        .then(response => response.json())
        .then(data => {
            if (!data.success){
                throw new Error("get success:False data from django view...")
            }
            else{
                prcs_card.remove()
            }
        })
    }catch(error){
        console.error(error)
    }
}


window.onload = () => {
    const userNickname = JSON.parse(document.getElementById("user-nickname").textContent)
    let btnScraps = document.getElementsByClassName("hh-btn-scrap");
    for (let i = 0; i < btnScraps.length; ++i) {
        let bucketId = btnScraps[i].getAttribute("value");
        let title = document.getElementById("bucket-title").textContent;
        let category = document.getElementById("bucket-category").getAttribute("value");
        btnScraps[i].addEventListener("click", (event) => {
            clickScrap(bucketId, title, category, userNickname, scrapBtnChange);
            event.stopPropagation();
        });
    }

    let btnLikes = document.getElementsByClassName("hh-btn-like");
    for (let i = 0; i < btnLikes.length; ++i) {
        btnLikes[i].addEventListener("click", (event) => {
            clickLike(btnLikes[i].getAttribute("value"), userNickname, likeBtnChange);
            event.stopPropagation();
        });
    }
}