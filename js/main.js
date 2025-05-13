"use strict";

//　ブラウザの更新時にコンソールクリアされるので
//  ソース上でクリアしても問題ない
//  (ソースからもクリアできる小ネタとして残されている。
// 例…ボタンを押したときにconsole.log()で表記したものを解除する等)
// console.clear();

// 基本仕様なので割り切って書いて覚える
{
    //現在の日付と時刻
    const today = new Date();
    //現在の年を取得するための方法
    let year = today.getFullYear();
    //現在の月を取得するための方法
    let month = today.getMonth();

    // let year = 2020;
    // let month = 4;
    // 5月、Javaでは月表記は0から始まる

    // 先月分のカレンダーの頭の日付を取得する
    function getCalendarHead(){
        const dates = [];
        // 指定された年と月から先月の最終日を取得する
        const d = new Date(year,month,0).getDate();
        // 指定された年と月の1日の曜日を取得する
        const n = new Date(year,month,1).getDay();

        for(let i =0; i < n; i++){
            dates.unshift({
                date: d-i,
                isToday: false,
                isDisabled: true,
            });
        }
        return dates;
    }

    // オリジナル「カレンダー本体」の意味を持つクラス
    function getCalendarBody(){
        const dates = []; // date:日付、day:曜日

        // 1日から末日までの日付を入れればいいが、末日は「翌月1日の1日前」という意味で、
        // 「翌月の0日目」を指定することで今月の末日を取得する
        const lastDate = new Date(year, month + 1, 0).getDate();

        // 1日から末日までとして、「i」を1ずつ増やしながら次の処理をする
        for (let i = 1; i <= lastDate; i++){
            dates.push({
                date: i,
                isToday: false,
                isDisabled: false,            
            }
            );
        }

        if (year === today.getFullYear()  && month === today.getMonth()){
            // 今日の日付だけisTodayをtrueにする(太字表記にする)
            dates[today.getDate() - 1].isToday = true;
        }

        return dates;
    }

    // 翌月分の日付を取得する
    function getCalendarTail(){
        const dates = [];
        const lastDay = new Date(year, month + 1, 0).getDay();

        for (let i = 1; i < 7-lastDay; i++){
            dates.push({
                date: i,
                isToday: false,
                isDisabled: true,  
            });
        }
        return dates;
    }

    function clearCalendar(){
        // ページ移動時にカレンダー重複を直す
        const tbody = document.querySelector('tbody');

        while (tbody.firstChild){
            tbody.removeChild(tbody.firstChild);
        }
    }

    function renderTitle(){
        // カレンダーの月を移動に沿って変更する
        const title = `${year}/${String(month + 1).padStart(2, '0')}`;
        document.getElementById('title').textContent = title;
    }

    function renderWeeks(){
        const dates =[
            //スプレッド構文を使う
            ...getCalendarHead(),
            ...getCalendarBody(),
            ...getCalendarTail(),
        ];

        // 週単位で配列する
        const weeks = [];
        const weeksCount = dates.length / 7;

        for (let i = 0; i < weeksCount; i++){
            weeks.push(dates.splice(0,7));
        }

        weeks.forEach(week =>{
            const tr = document.createElement('tr');
            week.forEach(date =>{
                const td = document.createElement('td');

                td.textContent = date.date;
                if(date.isToday){
                    td.classList.add('today');
                }
                if(date.isDisabled){
                    td.classList.add('disabled');
                }

                tr.appendChild(td);
            });
            document.querySelector('tbody').appendChild(tr);
        });
    }

    // カレンダーの描画
    function createCalendar(){
        clearCalendar();
        renderTitle();
        renderWeeks();
    }

    // クリックイベントの作成

    // 「today」をクリック時、今日の日付に移動する
    document.getElementById('today').addEventListener('click',() => {
        year = today.getFullYear();
        month = today.getMonth();
        createCalendar();
    });

    // 月を切り替える
    // 戻るボタン
    document.getElementById('prev').addEventListener('click',() => {
        month--;
        if(month < 0){
            year--;
            month = 11;
        }
        createCalendar();
    });

    // 戻るボタン
    document.getElementById('next').addEventListener('click',() => {
        month++;
        if(month > 11){
            year++;
            month = 0;
        }
        createCalendar();
    });

    createCalendar();
}
