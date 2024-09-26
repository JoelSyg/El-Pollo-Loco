window.onscroll = function() {
    var scrollToTop = document.getElementById("scrollToTop");
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        scrollToTop.style.display = "block";
    } else {
        scrollToTop.style.display = "none";
    }
};
