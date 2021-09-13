    function PlayStars(){
try{
    let GAME = {paused: false, over: false, score: 0, scores:[0], };
    let scorebd = DOMHelp.TAGN("sbd",0);
    let time = 0;
    var touched = {active: false}
    var a = document.getElementById("canvas");
    var b = a.getContext("2d");
    var sW = a.width = screen.width;
    var sH = a.height = window.innerHeight;//screen.height; 
    a.style.marginTop = 0; a.style.marginLeft =0;
    
    var CW = sW; 
    var CH = sH;
    let CR = MHelp.resultantOf(CW, CH);
    let scene = new CDraw.useScene(b);
    
    
    let spaceColor = "#000012";
    let spaceColorGrad = b.createLinearGradient(0, 0, 0, CH);
    spaceColorGrad.addColorStop(1, spaceColor);
    spaceColorGrad.addColorStop(0, "black");
    
    let bgRect_1;
    let tStars;
    
    
    let satColor;
    let satWing1;
    let satWing2;
    let satSpine;
    let satArc;
    
    
    
    let sPlanet = function (x,y,r, color){
    let spArc = new CDraw.arc(x,y,r,0,6.28,"_"+color);
    scene.add(spArc);
    //special
    satArc.y = CH/2-r*3;
    let rot = -0.02+Math.random()*0.04;
    let spots = [];
    for(let i=0;20>i;i++){
    let spot=new CDraw.arc(0,0,Math.random()*spArc.radius/6,0,6.3,"_black");
    spot.x=spot.rx=spArc.x- spArc.radius+Math.random()*spArc.radius*2;
    spot.y=spot.ry=spArc.y- spArc.radius+Math.random()*spArc.radius*2;
    var hyp=Math.sqrt(Math.pow(spot.x-spArc.x, 2)+Math.pow(spot.y-spArc.y, 2))
    if(hyp>spArc.radius){i--; continue;}
    scene.add(spot);
    spots.push(spot);
    }
    let rotate= ()=>{
    spots.map((spot)=>{
        spot.rotation.about=spArc.center;spot.rotation.rad+=rot;
    })
    }
    let remove = ()=>{
    scene.remove(spArc);
    //spots.map((spot)=>{scene.remove(spot);});
    }
    let use = ()=>{ rotate();}
    return {arc: spArc, spots: spots, remove: remove, rotate: rotate, rot: rot, use: use}
    }//EO  sPlanet
    
    
    
    let spsCount;
    let spNowObj; 
    let spNow;
    function newSps(){
        let minr = CW/15; let maxr = CW/6
        let r = minr+(maxr-minr)*spsCount/13;
        spNowObj.remove();
        spNowObj = 
        new sPlanet(CW/2,CH/2,r, 
        [
        "#322323","#233223","#232332","#232323","#321212","#123212","#121232","#121212","#431212","#124312","#121243","#434343","#324312",
        ][spsCount]);
        spNow = spNowObj.arc;
        spsCount++;
    }//E0 newSps
    
    
    
    
    
    
    
    let rSp; 
    let satAbout; 
    let satRad; 
    let satBound; 
    
    function Bound(a,b,m,t=true){return( !t?(a>b&&a<m):(a>b-m&&a<b+m) );}
    let shots;
    let shootTime;
    let shoot = (target, frms, rad)=>{ 
        let shot = {rad: rad, tx: CW/2, ty: CH/2, trMin: 0, trMax:0, ltime: 0, trails:[], hit: false, active: true,
        trail: function(){
            this.ltime++;
            let i=this.trails.length; 
            let rad = this.rad%6.28;
            let r = spNow.radius/10*(i/13);
            let satrad = (satArc.rotation.rad%6.28);
            this.hit =
            (this.hit||Bound(rad, satrad, 0.1)
            &&Bound(target.hyp, this.trMin, this.trMax, false)
            );
            if(this.hit){ /*console.log("hit");*/ target.crash = true;}
            if(i<13+1 && this.ltime>frms && !this.hit && this.active){
                this.ltime = 0;
                this.trMax=Math.sqrt(Math.pow(spNow.x-this.tx,2)
                +Math.pow(spNow.y-this.ty,2));
                this.trails
                .push(new CDraw.arc(this.tx,this.ty,r,0,6.25,"_white"));
                let trailNow = this.trails[i];
                trailNow.alpha = 0.45;
                scene.add(trailNow);
                this.tx+= 6*r*Math.cos(rad-6.28/4); 
                this.ty+= 6*r*Math.sin(rad-6.28/4);
            }
            else if(i>0 && this.ltime>frms){
                this.active= false;
                this.ltime = 0;
                this.trMin=Math.sqrt(Math.pow(spNow.x-this.trails[0].x,2)
                +Math.pow(spNow.y-this.trails[0].y,2));
                let trailNow = this.trails[0];
                scene.remove(trailNow);
                this.trails.shift();
            }
        }}
        shots.push(shot);
    }//EI shoot.
    
    
    
function StartGame(){
    scene.allChildren.map((child)=>{
        scene.remove(child);
    })
    GAME.over = false; GAME.score = 0;
    bgRect_1 = new CDraw.rect(0, CW, 0, CH, ["", spaceColorGrad]);
    scene.add(bgRect_1);
    tStars = [];
    for(let i=0; 60>i; i++){
    let tStarColor = MHelp.randOpt("white", "crimson", "goldenrod")
    let tStar = new CDraw.arc(CW/2, CH/2, CW/5, 0, 6.3, "_"+tStarColor);
    tStar.x = Math.random()*CW*2; tStar.y = Math.random()*CH;
    tStar.radius = 0.05+Math.random()*0.2;
    tStar.GCParams.shadow = [0.1, 0.1, "transparent", 0];//tStar.radius*2];
    tStar.alpha = 1;
    tStar.rotationSpeed = 0.0005*Math.random()*MHelp.randOpt(1,-1);
    tStar.speedX = (0.1+Math.random()*0.1)*MHelp.randOpt(-1, 1)
    tStars.push(tStar)
    scene.add(tStar)
    }
    
    satColor = "#bb112b";
    satWing1 = new CDraw.rect(0, 20, 0, 20, "_"+satColor);
    satWing2 = new CDraw.rect(0, 20, 0, 20, "_"+satColor);
    satSpine = new CDraw.rect(0, 20, 0, 20, "_"+satColor);
    satArc = new CDraw.arc(CW/2, CH/3, CW/40, 0, 3.14*2, "_"+satColor);
    
    spsCount = 0;
    spNowObj= new sPlanet(CW/2,CH/2,CW/15, "#232332"),
    spNow= spNowObj.arc;
    newSps();
    
    
    rSp = 0.01;
    satAbout = spNow.center;
    satRad = 0;
    satBound = {};
    satArc.xx = satArc.x;
    satArc.yy = satArc.y;
    scene.add(satSpine); 
    scene.add(satWing1); 
    scene.add(satWing2);
    scene.add(satArc);
    
        
    satArc.crash = false;
    shots = [], shootTime = [];
    for(let i=0; 130>i; i++){ shootTime.push(314*i+Math.random()*314);}
    time = 0;
    satArc.rotation.rad = 0;
}
StartGame();
function ProcessGameOver(){
    GAME.over = true;
    GAME.scores.push(GAME.score);
    console.log(GAME.scores)
}

function animate(){
        time++;
        GAME.score = Math.floor((spsCount*50)+shots.length*5);
        if(satArc.crash&&!GAME.over){ ProcessGameOver();}
        let orbits = Math.floor(satArc.rotation.rad/6.28);
        
        tStars.map((tStar)=>{
            tStar.x -= tStar.speedX;
            if(tStar.x<0 || tStar.x>CW){    
                tStar.speedX *=-1;
                tStar.y = Math.random()*CH;
                tStar.radius = 0.2+Math.random()*0.9; 
                tStar.color = 
                MHelp.randOpt("white", "crimson", "goldenrod");
            }
        })//EO map
        
        
        
        //scorebd.
        //scorebd.innerText = "Orbit: "+5+" | Planet: ory | Years: "+time;
        
        //spNow prop
        spNowObj.use();
        
        //shots.
        shots.map((shot)=>{
            shot.trail();
        })
        shootTime.map((t, tIn)=>{
        if(time==Math.floor(t)&&!satArc.crash){
            shoot(satArc, 6-5*(spsCount+orbits/14)/14,satArc.rotation.rad+rSp*100);
            //console.log("shot");console.log(time, t, shootTime);
        }
        });
        
        
        
        
        
        //sat props.
        satSpine.lengthX = satArc.radius*5;
        satSpine.x = satArc.x- satSpine.lengthX/2;
        satSpine.y = satArc.y- satSpine.breadthY/2;
        satSpine.breadthY = satArc.radius/3;
        
        satWing1.lengthX = satWing1.breadthY = 
        satWing2.lengthX = satWing2.breadthY = satArc.radius*2;
        satWing1.x = satSpine.x- satWing1.lengthX/2 ;
        satWing2.x = satSpine.x+ satSpine.lengthX/1 - satWing2.lengthX/2;
        satWing1.y = satWing2.y = satArc.y- satWing1.breadthY/2;
        
        
        
        let elem = satArc;
        let cx = elem.rotation.about.x, cy = elem.rotation.about.y;
        elem.hyp = 
        Math.sqrt(Math.pow(cx-elem.xx, 2)+Math.pow(cy-elem.yy, 2));
        elem.xxx = cx+elem.hyp*Math.cos(satRad);
        elem.yyy = cy+elem.hyp*Math.sin(satRad);
        
        
        
        
        let satList = [satSpine, satArc, satWing1, satWing2];
        
        if(!touched.active && rSp>0.01) rSp -= 0.001;
        if( touched.active && rSp<0.05) rSp += 0.001;
        if(satArc.crash){   rSp /= 10; }
        satRad+=rSp;
        
        if( Math.floor(satArc.rotation.rad/6.28)>13-1 ){
            newSps();
            console.log(scene.allChildren.length)
            satRad = 0;
        }
        
        
        satList.map((satChild)=>{
            satChild.rotation.rad = satRad;
            satChild.rotation.about = satAbout;
            if(satArc.crash) satChild.alpha = 0.5;
        });
        
        
        
        
        let isHighScore = (GAME.score>=Math.max(...GAME.scores));
        scorebd.innerHTML=
        "Satellite Completed: <b>"+orbits+"/13 orbits</b>"
        +"&nbsp;|&nbsp;About:  <b>"+(spsCount)+"/13 Planets</b><br>"
        +"Survived <b>"+(shots.length)+"/"+shootTime.length+" shots </b><br>"
        +(isHighScore?"***High":"")+"Score: <b>"+GAME.score+"</b> Rank: <b>"+spsCount+"P"+shots.length+"S</b><br>"
        +(satArc.crash?"<b>GAMEOVER</b><br>":"")
        +"TAP TO RESTART";
        //"rad: "+rad+";\n sRad: "+satrad+";\n hit:"+this.hit+"; \n"+
        //"count trails: "+this.trails.length+";\n "+
        //"trMin: "+this.trMin+";\ntrMax: "+this.trMax+";\nhyp:"+target.hyp
        
        
        if(!GAME.paused)requestAnimationFrame(animate)
}
animate();
    
    
    scorebd.onclick = function(){
        //if(GAME.paused){ GAME.paused= false; animate(); }
        //else{GAME.paused= true;}
        StartGame();
    }
    a.ontouchstart = function(e){touched={active:true};};
    a.ontouchend = function(ev){touched.active = false;};
    document.onkeypress=(e)=>{touched={active:true}};
    document.onkeyup = (e)=>{touched.active=false;}
    
    
}catch(e){console.log(e)}
}
/**
 * Remove spots on newSps();
 * Gameover Action
 */