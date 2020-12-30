var x = 0; //指の位置(x座標)
var y = 0; //指の位置(y座標)
var win_width; //ウィンドウの横サイズ
var win_height; //ウィンドウの縦サイズ

var moai; //モアイの情報
var width; //モアイの横サイズ
var height; //モアイの縦サイズ

var gomibako; //ゴミ箱の情報
var g_width; //ゴミ箱の横サイズ
var g_height; //ゴミ箱の縦サイズ
var random_x;
var random_y;
var gmRect;

var count_num; //ゴミ箱に捨てた数(カウント)の情報
var count = 100; //ゴミ箱に捨てた数(カウント)

var supportTouch = 'ontouchend' in document; // タッチイベントが利用可能かの判別

// イベント名
var EVENTNAME_TOUCHSTART = supportTouch ? 'touchstart' : 'mousedown';
var EVENTNAME_TOUCHMOVE = supportTouch ? 'touchmove' : 'mousemove';
var EVENTNAME_TOUCHEND = supportTouch ? 'touchend' : 'mouseup';

// jQueryでHTMLの読み込みが完了してからCSSを読みこむ
$(function(){
  var style = "<link rel='stylesheet' href='animation.css'>";
  $('head:last').after(style);
});

// スクロールを禁止する関数
(function() {
    function noScroll(event) {
      event.preventDefault();
    }
    document.addEventListener('touchmove', noScroll, { passive: false }); // スクロール禁止(SP)
    document.addEventListener('mousewheel', noScroll, { passive: false }); // スクロール禁止(PC)
})();

// 初期設定
function initDefine() {
    win_width = window.innerWidth; //ウィンドウの横サイズ
    win_height = window.innerHeight; //ウィンドウの縦サイズ

    moai = document.getElementById("cha");
    moai.style.position = "fixed";
    width = moai.offsetWidth; //モアイの横サイズ
    height = moai.offsetHeight; //モアイの縦サイズ
    moai.style.top = (win_height*4/5)+"px"; //モアイ位置設定(上)
    moai.style.left = ((win_width/2)-(width/2))+"px"; //モアイ位置設定(左)
    moai.addEventListener(EVENTNAME_TOUCHSTART, touchStatEvent); // モアイに指が触れたときの処理を追加
    moai.addEventListener(EVENTNAME_TOUCHEND, touchEndEvent); // モアイから指が離れたときの処理を追加

    gomibako = document.getElementById("gm");
    gomibako.style.position = "absolute";
    g_width = gomibako.offsetWidth; //ゴミ箱の横サイズ
    g_height = gomibako.offsetHeight; //ゴミ箱の縦サイズ
    random_x = Math.floor( Math.random()*(win_width-g_width));
    random_y = Math.floor( Math.random()*(win_height-height-g_height-(win_height/5)))+height;
    gomibako.style.left = random_x +"px"; //ゴミ箱の位置(左)
    gomibako.style.top = random_y +"px"; //ゴミ箱の位置(上)
    gmRect = gm.getBoundingClientRect();

    count_num = document.getElementById("count_txt");
    count_num.style.position = "absolute";
    count_num.style.left = (gmRect.left+(g_width/2)-(count_num.offsetWidth/2))+"px";
    count_num.style.top = (gmRect.top+(g_height/2)-(count_num.offsetHeight/2))+"px";
}

// window(HTML)の読み込みが完了してから初期設定
window.onload = function(){
    initDefine();
};

// モアイに指が触れたときの処理を定義
function touchStatEvent(e) {
    //スクロール無効化
    e.preventDefault();
    moai.style.position = "absolute";
    document.getElementById("text").innerHTML = "え、";
    moai.addEventListener(EVENTNAME_TOUCHMOVE, touchMoveEvent); // 画面上で指を移動させているきの処理を追加
};

// 画面上で指を移動させているきの処理を定義
function touchMoveEvent(e) {
    // スクロール無効化
    e.preventDefault();
    // 指が触れた位置のx,y座標を記録
    if (!supportTouch){
      x = e.clientX;
      y = e.clientY;
    }else{
      x = e.touches[0].pageX;
      y = e.touches[0].pageY;
    }    

    // 画面外にはみ出た場合の処理
    if (x < (width/2)) x = width/2;
    if (x > (win_width-width/2)) x = win_width-width/2;
    if (y < (height/2)) y = height/2;
    if (y > (win_height-height/2)) y = win_height-height/2;

    // フリック中のアニメーション＋スタイル
    moai.style.left = (x-width/2) +"px";
    moai.style.top = (y-height/2) +"px";
    moai.classList.add('buruburu'); //振動するclassを追加
    document.getElementById("text").innerHTML = "わーはなせー";
};

// モアイから指が離れたときの処理を定義
function touchEndEvent(e) {
    // スクロール無効化
    e.preventDefault();
    moai.classList.remove('buruburu'); //振動するclassを削除
    const messages = ["うわー","あれまー","さよならー","どうして―",];
    const messageNo = Math.floor( Math.random()*messages.length );
    if((x>=gmRect.left && x<=(gmRect.left+g_width)) && (y>=gmRect.top && y<=(gmRect.top+g_height))){
        let promise = new Promise((resolve, reject) => { // #1
            document.getElementById("text").innerHTML = messages[messageNo];
            resolve('1')
          })
          promise.then(() => { // 上記処理後0.1秒後activeclass追加
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                moai.classList.add('active'); //0.1秒後にclass"active"を追加する
                resolve("2")
              }, 50)
            })
          }).then(() => { // 上記処理後にゴミ箱中心へモアイ移動
            let dx = (gmRect.left+g_width/2) - x
            let dy = (gmRect.top+g_height/5) - y
            for (let i = 1; i <= 10; i++) {
                moai.style.left = (x-width/2)+dx*(i/10) +"px";
                moai.style.top = (y-height/2)+dy*(i/10) +"px";
            }
          }).then(() => { //上記処理後1000秒後，以下の関数を実行
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                cha.remove(); //1秒後に削除
                addCharacter(); //1秒後にモアイ再追加
                initDefine(); //1秒後に再設定
//                if (count % 5 == 0) {
                  kusudama(); // くす玉処理 
//                }
                resolve("3")
              }, 1000)
            })
          }).catch(() => { // エラーハンドリング
            console.error('Something wrong!')
          })
    }else{
        document.getElementById("text").innerHTML = "モアイを動かしてください";
    }
    moai.removeEventListener(EVENTNAME_TOUCHMOVE, touchMoveEvent); // 画面上で指を移動させているきの処理を削除
};

// モアイを追加する関数
function addCharacter() {
    var newElement = document.createElement("img"); // p要素作成
    newElement.setAttribute("id","cha"); // img要素にidを設定
    newElement.setAttribute("src","./pictures/moai.png"); // img要素にsrcを設定
    newElement.setAttribute("width","100px"); // img要素にwidthを設定
    newElement.setAttribute("style","z-index:300"); // img要素にstyleを設定
    var parentDiv = document.getElementById("parent-pic"); // 親要素（div）への参照を取得
    var childGm = document.getElementById("gm"); // 子要素gmへの参照を取得
    parentDiv.insertBefore(newElement, childGm); // 追加
    document.getElementById("text").innerHTML = "モアイを動かしてください";
    count++;
    count_num.innerHTML = count;
}




// くす玉関数
function kusudama() {
  win_width = window.innerWidth; //ウィンドウの横サイズ
  win_height = window.innerHeight; //ウィンドウの縦サイズ

  // 幕作成
  let newDiv = document.createElement('div');
  newDiv.setAttribute("id", "flag")
  newDiv.setAttribute("class", "flag")
  newDiv.setAttribute("width","100px"); // img要素にwidthを設定
  newDiv.setAttribute("style", "font-size: 500%; position: absolute; left: "+(win_width/2-60)+"px;")
  let parentDiv = document.getElementById("parent-maku"); // 親要素（div）への参照を取得
  parentDiv.appendChild(newDiv)

  parentDiv = document.getElementById("flag"); // 親要素（div）への参照を取得

  let newSpan1 = document.createElement('span');
  newSpan1.setAttribute("class", "redfont");
  let newContent1 = document.createTextNode("祝 ")
  newSpan1.appendChild(newContent1)
  parentDiv.appendChild(newSpan1);

  let newSpan2 = document.createElement('span');
  newSpan2.setAttribute("class", "text-combine");
  let newContent2 = document.createTextNode(count)
  newSpan2.appendChild(newContent2)
  parentDiv.appendChild(newSpan2);

  let newContent3 = document.createTextNode("回")
  parentDiv.appendChild(newContent3);



  // 左くす玉作成
  let newElementL = document.createElement("img"); // p要素作成
  newElementL.setAttribute("id","kusudamaLeft"); // img要素にidを設定
  newElementL.setAttribute("class","rotLeft"); // img要素にclassを設定
  newElementL.setAttribute("src","./pictures/kusudama_left.png"); // img要素にsrcを設定
  newElementL.setAttribute("width","100px"); // img要素にwidthを設定
  newElementL.setAttribute("style","position: absolute; left: "+(win_width/2-100)+"px; top: 0px;"); // img要素にstyleを設定

  // 右くす玉作成
  let newElementR = document.createElement("img"); // p要素作成
  newElementR.setAttribute("id","kusudamaRight"); // img要素にidを設定
  newElementR.setAttribute("class","rotRight"); // img要素にclassを設定
  newElementR.setAttribute("src","./pictures/kusudama_right.png"); // img要素にsrcを設定
  newElementR.setAttribute("width","100px"); // img要素にwidthを設定
  newElementR.setAttribute("style","position: absolute; left: "+(win_width/2)+"px; top: 0px;"); // img要素にstyleを設定

  parentDiv = document.getElementById("parent-kusudama"); // 親要素（div）への参照を取得
  parentDiv.appendChild(newElementL); // 左くす玉追加
  parentDiv.appendChild(newElementR); // 右くす玉追加



  class Paper{
    constructor(num, width, G, color, startX, finishX) {
      this.num = num; //ナンバー idが"paper(num)"となる
      this.width = width; // 大きさ
      this.G = G; // 初速度
      this.D = 5; //遅延度
      this.startX = startX // 初期位置(x座標)
      this.finishX = finishX // 最終位置(x座標)
      this.newElement = document.createElement("img"); // img要素作成
      this.newElement.setAttribute("id","paper"+num); // img要素にidを設定
      this.newElement.setAttribute("class",color); // img要素にclassを設定
      this.newElement.setAttribute("src","./pictures/moai.png"); // img要素にsrcを設定
      this.newElement.setAttribute("width",this.width+"px"); // img要素にwidthを設定
      this.newElement.setAttribute("style","position: absolute; left: "+(this.startX)+"px; top: 30px;"); // img要素にstyleを設定
      let parentDiv = document.getElementById("parent-papers"); // 親要素（div）への参照を取得
      parentDiv.appendChild(this.newElement); // 追加
    }
  }

  let papers = []; // 各紙吹雪の格納場所
  let colors = ["red", "blue", "green", "yellow", "orange", "aqua", "purple"];
  let rand_width = 0;
  let rand_G = 0;
  for (let i = 0; i < 60; i++) {
    rand_width = 20 + Math.floor( Math.random()*10 - 5 );
    rand_G = 7 + Math.random()*6 - 3;
    rand_color = colors[Math.floor( Math.random()*colors.length )];
    rand_X = Math.floor( Math.random()*30 - 15 );
    rand_startX = win_width/2 + rand_X;
    rand_finishX = win_width/2 + rand_X*4;
	  papers.push( new Paper(i, rand_width, rand_G, rand_color, rand_startX, rand_finishX) );
  }
  console.log(papers[0].num)

  movepaper(papers, papers.length); // 紙吹雪を動かす
};


// 紙吹雪を動かす関数
function movepaper(papers, length){
  let promise = new Promise((resolve, reject) => { // #1
    resolve('1')
  })
  promise.then(() => { // 上記処理後0.1秒後class追加
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        for (let paper of papers) {
          document.getElementById("paper"+paper.num).classList.add('slowly'); //0.1秒後にclass"slowly"を追加する 
        }
        resolve("2")
      }, 50)
    })
  }).then(() => { // 上記処理後に紙吹雪を動かすs
    let t = 0, // 時間
        X = 0, // X座標
        Y = 0; // Y座標

    function draw_pa(){
      t += 1;
      let icount = 0; //カウント
      let rmCount = 0; //削除する要素のカウント
      for (let paper of papers) {
        X = paper.startX + (paper.finishX - paper.startX)*(t/20)
        Y = 30+ 0.5*paper.G*t^2
        $('#paper'+paper.num).animate({
          'left': (X+'px'),
          'top': (Y+'px')
        }, paper.D, 'linear');
        if (Y > win_height+50){ // 画面外(横)に出たら
          tmp = papers.splice(icount, 1);
          papers.unshift(tmp[0]);
          rmCount++;
        }
        icount++
      }
      for (let i = 0; i < rmCount; i++) {
        papers.splice(0, 1)
      }
      if (papers.length != 0){ // 一つが画面外(横)に出たら終了
        draw_pa();
      }
    };

    draw_pa(); // 描画
  }).then(() => { //上記処理後1000秒後，以下の関数を実行
    function removeKusudama(){ // くす玉の要素を消す処理
      $('#kusudamaLeft').remove(); //くす玉削除
      $('#kusudamaRight').remove(); //くす玉削除
      $('#flag').remove(); // 幕削除
      for (let i = 0; i < length; i++) {
        $('#paper'+i).remove(); //紙吹雪削除
      }
      moai.removeEventListener(EVENTNAME_TOUCHSTART, removeKusudama); // くす玉の要素を削除する処理を削除
    }
    moai.addEventListener(EVENTNAME_TOUCHSTART, removeKusudama);
  }).catch(() => { // エラーハンドリング
    console.error('Something wrong!')
  })
}