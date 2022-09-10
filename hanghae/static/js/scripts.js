$("form[name=signup_form").submit(function(e) {

  var $form = $(this);
  var $error = $form.find(".error");
  var data = $form.serialize();

  $.ajax({
    url: "/user/signup",
    type: "POST",
    data: data,
    dataType: "json",
    success: function(resp) {
      window.location.href = "/dashboard/";
    },
    error: function(resp) {
      $error.text(resp.responseJSON.error).removeClass("error--hidden");
    }
  });

  e.preventDefault();
});

$("form[name=login_form").submit(function(e) {

  var $form = $(this);
  var $error = $form.find(".error");
  var data = $form.serialize();

  $.ajax({
    url: "/user/login",
    type: "POST",
    data: data,
    dataType: "json",
    success: function(resp) {
      window.location.href = "/dashboard/";
    },
    error: function(resp) {
      $error.text(resp.responseJSON.error).removeClass("error--hidden");
    }
  });

  e.preventDefault();
});

       //상단 꿀팁 사이트 공유하기 입력 박스 열기
        function open_box() {
            $('#post-box').show() // id: post-box
        }
        function close_box() {
            $('#post-box').hide()
        }
        $(document).ready(function () {
            listing();
        });
        function listing() {
            $.ajax({
                type: 'GET',
                url: '/pythonthema',
                data: {},
             success: function (response) {
                    let rows = response['pythonthema']
                    for (let i = 0; i < rows.length; i++) {
                        let num = rows[i]['num']
                        let comment = rows[i]['comment']
                        let title = rows[i]['title']
                        let desc = rows[i]['desc']
                        let image = rows[i]['image']
                        let star = rows[i]['star']
                        let star_image = '⭐'.repeat(star)
                        let temp_html = `<div class="col">
                                            <div class="card h-100">
                                                    <img src="${image}"  class="card-img-top">
                                                    <div class="card-body">

                                                        <h5 class="card-title">${title}</h5>
                                                        <p class="card-text">${desc}</p>
                                                        <p>${star_image}</p>
                                                        <p class="mycomment">${comment}</p>
                                                    </div>
                                                    <div class="change">
                                                        <div class="btns">
                                                             <button onclick="open_edit(${num})" type="button" class="btn btn-outline-secondary btn-sm">수정</button>
                                                             <button onclick="delete_edit(${num})" type="button" class="btn btn-outline-secondary btn-sm">삭제</button>
                                                        </div>
                                                    </div>
                                            </div>
                                        </div>`
                        $('#cards-box').append(temp_html)
                    }
                }
            })
        }
        //delete_edit
          function delete_edit(num){
            $('#delete-box').empty() //
            $('#delete-box').show()  //id: delete-box
            let temp_html = `<h3>삭제하시겠습니까?</h3>
                                  <div class="delete_btns">
                                      <button onclick="delete_btn(${num})" type="button" class="btn btn-outline-dark ">삭제</button>
                                      <button onclick="cancel_btn()" type="button" class="btn btn-dark ">취소</button>
                                  </div>`
            $('#delete-box').append(temp_html)
          }
          //delete_btn
          function delete_btn(num){             // delete_ben에 num값 보내기
                     $.ajax({
                        type: "POST",                   // POST 요청
                        url: "/delete",                 // /delete 경로에
                        data: {num_give: num},          // num을 받아서
                        success: function (response) {  // 성공하면, response에 값을 담아서
                            alert(response["msg"])      // msg를 띄운다.

                            window.location.reload()  //새로고침
                        }
                 });
          }
          //cancel_btn
         function cancel_btn() {          // cancel_btn 함수
            $('#delete-box').hide()       // id: delete-box 숨기기
            window.location.reload()      // 새로고침
        }
        // 저장 자바스크립트 함수
        // 사이트 url, 별점, 코멘트 입력 후, 사이트기록하기 버튼을 클릭하면,
        // posting 함수로 이동되어 여기로 도착
        function posting() {
            let url = $('#url').val()          //  input에 입력한 id: url 의 입력된 값을 가져와서 url로 넣는다.
            let star = $('#star').val()        //  input에 입력한 id: star 의 입력된 값을 가져와서 star 로 넣는다.
            let comment = $('#comment').val()  // input에 입력한 id: comment의 입력된 값을 가져와서 comment로 넣는다.
            let num = $('#num').val()          // ★★★num 값을 추가// num값이 pythonthema db에 들어온것 확인 num:12
            $.ajax({                           // ajax POST 방식으로 /pythonthema 경로로 , data{url_give: url, star_give:star, comment_give:comment }를 보낸다.
                type: 'POST',                   // POST 요청
                url: '/pythonthema',            // app.py 파일의 /pythonthema 경로로 'POST' 요청을 보낸다.
                data: {url_give: url, star_give: star, comment_give: comment, num_give: num }, // num 값 전달 추가
                success: function (response) {    // 성공하면 reponse에 url, star, comment의 값을 담아 보낸다.
                    alert(response['msg'])       // 'msg' 를 얼럿으로 띄운다.
                    window.location.reload()     // 페이지 새로고침 한다.
                }
            });
        }
        // 수정 버튼 클릭시 onclick 이벤트를 통해서, open_edit 함수로 이동되어 여기로 온다.
        function open_edit(num){ // num 값을 가져온다
            $('#edit-box').empty() // id: edit-box를 비운다.
            $('#edit-box').show()  // id: edit-box를 보여준다.
            $.ajax({               // ajax GET 방식으로 /edit 경로로 num 값을 보낸다.
                type: 'GET',       // GET 요청
                url: '/open/edit',      // app.py 파일의 /edit 경로로 'GET' 요청을 보낸다.
                data: {num_give: num}, // num 값을 보낸다.
                success: function (response) { // 성공하면 response에 num, url, star, comment 값을 담아 보낸다.
                    let rows = (response['pythonthema']) // pythonthema 테이블의 모든 값을 rows에 담는다.
                     for (let i=0; i<rows.length; i++){
                         let num1 = rows[i]['num'] // num 값을 num1에 담는다.
                         let url = rows[i]['url'] // url 값을 url에 담는다.
                         let star = rows[i]['star'] // star 값을 star에 담는다.
                         let comment = rows[i]['comment'] // comment 값을 comment에 담는다.
                         let temp_html = `` // temp_html에 html 코드를 담는다.

                         if(num === num1) {
                             temp_html = `
                                             <div class="edit-box">
                                                 <div class="edit-box-title">
                                                     <h3>사이트 수정하기</h3>
                                                 </div>
                                                 <div class="edit-box-content">
                                                     <div class="edit-box-content-url">
                                                         <input type="text" id="url_e" value="${url}">
                                                     </div>
                                                     <div class="edit-box-content-star">
                                                         <input type="text" id="star_e" value="${star}">
                                                     </div>
                                                     <div class="edit-box-content-comment">
                                                         <input type="text" id="comment_e" value="${comment}">
                                                     </div>
                                                     <div class="edit-box-content-btn">
                                                         <button class="edit-box-content-btn-save" onclick="edit_order(${num})">수정하기</button>
                                                         <button class="edit-box-content-btn-cancel" onclick="close_edit()">닫기</button>
                                                     </div>
                                                 </div>
                                             </div> `
                         } else {
                             temp_html = ``
                         }
                            $('#edit-box').append(temp_html) // id: edit-box에 temp_html을 추가한다.
                     }
                }
            });
        }
           // 수정입력 박스 닫기, 수정입력박스 id: #edit-box
        function close_edit(){
            $('#edit-box').hide()
            window.location.reload()
        }

        //수정하기 버튼 선택 시, edit_order() 함수실행
        function edit_order(num){
                let url = $('#url_e').val()
                let star = $('#star_e').val()
                let comment = $('#comment_e').val()
                    $.ajax({
                        type: 'POST',
                        url: '/save/edit',
                        data: {url_give: url, star_give: star, comment_give: comment, num_give: num },
                        success: function (response) {
                            alert(response['msg'])
                            window.location.reload()
                        }
                });
        }