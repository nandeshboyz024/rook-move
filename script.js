const socket = io();
    let name;
    let timerInterval;
    let timoutseconds=30;
    let pos="";
    let my_id="";
    let current_move="user1";
    let match_id=-1;
    let input = document.getElementById("input");
    let search_btn=document.getElementById("search");
    let search_cls=document.getElementById("search_cls");
    let loading = document.getElementById("loading");
    let i=document.getElementById("i");
    let you=document.getElementById("you");
    let grid = document.getElementById("bigCount");
    let victory=document.getElementById("victory");
    let turn=document.getElementById("turn")
    let timerDisplay=document.getElementById("timer");
    function startTimer(){
        timerInterval=setInterval(()=>{
            timoutseconds--;
            timerDisplay.textContent=`Time left:${timoutseconds}`;
            if(timoutseconds<=0){
                clearInterval(timerInterval);
                timerDisplay.textContent=`Time Out! Game Over.`;
                victory.innerHTML="Game Over!";
            }
        },1000);
    }
    function resetTimer(){
        clearInterval(timerInterval);
        timoutseconds=30;
        timerDisplay.textContent=`Timer`;
    }
    search_btn.addEventListener("click",()=>{
        name=document.getElementById("name").value;
        //console.log(name);
        if(name == null || name == ""){
            alert("Enter Your Name");
        }
        else{
            socket.emit("search",{name:name});
            loading.style.display="block";
            search_btn.disabled=true;
            search_btn.style.background="aliceblue";
            search_btn.style.color="black";
        }
    })
    socket.on("search",(e)=>{
            let playingArray=e.playingArray;
            input.style.display="none";
            search_cls.style.display="none";
            loading.style.display="none";
            grid.style.display="flex";
            //const match=playingArray.find(players=>players.p1.name==name || players.p2.name==name);
            //console.log(playingArray.length);
            //console.log(e.index);
            const match=playingArray[e.index];
            //console.log("match",match.pos);
            match_id=e.index;
            pos=match.pos;
            //console.log("pos",pos);
            if(match.p1.name==name){
                my_id=match.p1.id;
                i.style.display="block";
                you.style.display="block";
                i.innerHTML = `<img src="media/user1.png" alt="player1">`;
                you.innerHTML =  `<img src="media/user2.png" alt="player2">`;
            }
            else{
                my_id=match.p2.id;
                i.style.display="block";
                you.style.display="block";
                i.innerHTML = `<img src="media/user2.png" alt="player2">`;
                you.innerHTML = `<img src="media/user1.png" alt="player1">`;
            }
            if(current_move==my_id){
                turn.innerHTML="Your Turn";
            }
            else{
                turn.innerHTML="Wait for Opponent!";
            }
        })
    document.querySelectorAll(".btn").forEach((e)=>{
        e.addEventListener("click",()=>{
            const idNumber = parseInt(e.id.slice(3));
            //console.log(my_id,current_move);
            //console.log(match_id);
            const pos_num=parseInt(pos.slice(3));
            let row_limit= pos_num;
            let r = pos_num % 8;
            if (r > 0) { row_limit = pos_num + 8 - r;}
            let col_limit = idNumber-pos_num;
            //console.log(pos);
            if((row_limit>=idNumber && idNumber>pos_num)||(col_limit>0 && col_limit%8==0)){
                if(my_id == current_move){
                    document.getElementById(pos).innerHTML=``;
                    document.getElementById(e.id).innerHTML=`<img src="media/player.png" alt="Rook" width="48px" height="48px">`;
                    pos=e.id;
                    if(my_id=="user1") current_move="user2";
                    else current_move="user1";
                    if(pos=="btn64"){
                        victory.innerHTML="You are winner!";
                       
                    }
                    resetTimer();
                    socket.emit("playing",{match_id:match_id,pos:pos,move:current_move});
                    turn.innerHTML="Wait for Opponent";
                }
            }
        })
    })
    socket.on("playing",(e)=>{
        //console.log(e.playingArray[match_id]);
        if(my_id == e.playingArray[match_id].move){
            document.getElementById(pos).innerHTML=``;
            document.getElementById(e.playingArray[match_id].pos).innerHTML=`<img src="media/player.png" alt="Rook" width="48px" height="48px">`;
            pos=e.playingArray[match_id].pos;
            current_move=e.playingArray[match_id].move;
            if(pos=="btn64"){
                victory.innerHTML="You are Looser!";
                pos="btn1";
                resetTimer();
            }
            else{
                startTimer();
            }
            turn.innerHTML="Your Turn";
        }
    })