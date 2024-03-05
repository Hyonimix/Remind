// main-screen 요소에 드래그로 창 이동 기능 추가
document.querySelector('.main-screen').addEventListener('mousedown', startDrag);

// sub-screen 요소에 드래그로 창 이동 기능 추가
document.querySelector('.sub-screen').addEventListener('mousedown', startDrag);

// 드래그 시작 함수
function startDrag(event) {
    // 마우스 버튼이 눌렸을 때의 좌표 기록
    const offsetX = event.clientX;
    const offsetY = event.clientY;

    // 마우스 이동과 드래그 중에 발생하는 이벤트 처리
    const mouseMoveHandler = (e) => {
        const newX = e.clientX;
        const newY = e.clientY;

        // 창의 위치 이동
        window.moveTo(window.screenX + (newX - offsetX), window.screenY + (newY - offsetY));
    };

    // 마우스 버튼을 놓았을 때 이벤트 처리
    const mouseUpHandler = () => {
        // 이벤트 리스너 제거
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
    };

    // 마우스 이동과 버튼 놓기 이벤트 리스너 등록
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', mouseUpHandler);
}
