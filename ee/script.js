// 뒤로가기 버튼을 숨기거나 표시하는 함수
function toggleBackButtonVisibility() {
    var backButton = document.querySelector('.back-button');
    if (history.length > 1) {
        backButton.style.display = 'block';
    } else {
        backButton.style.display = 'none';
    }
}

// 페이지 로드 시 실행
window.onload = function() {
    toggleBackButtonVisibility();
};

// 뒤로가기 이벤트 발생 시 실행
window.onpopstate = function() {
    toggleBackButtonVisibility();
};
