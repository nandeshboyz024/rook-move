const express = require("express");
const app = express();
const path=require("path");
const http=require("http");
const {Server}=require("socket.io");
const server = http.createServer(app);
const io= new Server(server);
app.use(express.static(path.resolve("")));


let players = [];
let playingArray=[];

io.on("connection",(socket)=>{
    //console.log("A user connected");
    if(playingArray>=1000000){
        playingArray=[];
    }
    socket.on("search",(e)=>{
        //console.log(e);
        
        if(e.name!=null){
            if (!players.includes(e.name)){
                players.push(e.name);
                if(players.length>=2){
                    let player1={
                        name:players[0],
                        id:"user1",
                    }
                    let player2={
                        name:players[1],
                        id:"user2",
                    }
                    let match={
                        p1:player1,
                        p2:player2,
                        move:"user1",
                        pos:"btn1"
                    }
                    playingArray.push(match);
                    players.splice(0,2);
                    //console.log(match.pos);
                    io.emit("search",{playingArray:playingArray,index:playingArray.length-1});
                }
            }
        }
        else{
            socket.emit("error", { message: "Player with this name is already selected." });
        }
    })
    socket.on("playing",(e)=>{
        //console.log(e);
        playingArray[e.match_id].move=e.move;
        playingArray[e.match_id].pos=e.pos;
        //console.log(playingArray[e.match_id]);
        io.emit("playing",{playingArray:playingArray});
    })
})

app.get("/",(req,res)=>{
    return res.sendFile("index.html");
})
server.listen(3000,()=>{
    console.log("port connected to 3000");
})
