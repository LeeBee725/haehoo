window.onload = function () {
    const title = document.getElementById("hh-feedback-title")
    const submit = document.getElementById("feedback-submit")
    submit.addEventListener("click", () => {
        const thanks = document.createElement("h5")
        thanks.textContent = "피드백이 잘 전달되었습니다. 감사합니다.\n잠시 후 메인페이지로 이동합니다."
        thanks.style.marginTop = "20px"
        title.parentElement.appendChild(thanks)
    })
}