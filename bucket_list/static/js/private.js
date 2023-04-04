window.onload = () => {
    const userNickname = JSON.parse(document.getElementById("user-nickname").textContent)
    let btnScraps = document.getElementsByClassName("hh-btn-scrap");
    for (let i = 0; i < btnScraps.length; ++i) {
        let bucketId = btnScraps[i].getAttribute("value");
        let bucketElem = document.querySelector(`#bucket${bucketId}`);
        let title = bucketElem.querySelector("#bucket-title").textContent;
        let category = bucketElem.querySelector("#bucket-category").getAttribute("value");
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