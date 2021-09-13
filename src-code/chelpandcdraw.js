class MHelp{
    static randOpt(val, val2){
        return arguments[Math.floor(Math.random()*arguments.length)]
    }
    static resultantOf(x, y){
        return Math.sqrt( Math.pow(x, 2)+Math.pow(y, 2) );
    }

}//EO MHelp





class DOMHelp{
    static TAGN(string, index){
        if(typeof index == "number"){
          return  document.getElementsByTagName(string)[index];
        }
    }//EO tagn
}





let CDraw = {
    arc: function(x, y, r, startAngle, endAngle, styling){
        this.x = x; this.y = y, this.radius = r; this.startAngle= startAngle;
        this.endAngle = endAngle; 
        this.styling = styling; this.type = "arc";
        this.center = {};
        this.rotation = {rad: 0, about:this.center}
        this.alpha = 1;
        this.GCParams = {shadow: [0, 0, "transparent", 0]};
        this.indexInScene = null;
        this.updateProps = (B)=>{
            this.center.x = this.x; this.center.y = this.y;
        }
        let autoStyle = new CDraw.autoStyle(this.styling, this);
        
        this.draw = (B)=>{   
            B.beginPath();
            B.arc(this.x, this.y, this.radius, this.startAngle,this.endAngle);
            autoStyle.call(B);
            B.closePath();
            this.updateProps(B);
        }
    }
    ,rect: function( x, lengthX, y, breadthY, styling ){
        this.x = x;   this.lengthX = lengthX;
        this.y = y;   this.breadthY = breadthY;
        this.styling = styling;
        this.center = {};
        this.rotation = {rad: 0, about:this.center};
        this.alpha = 1;
        this.GCParams = {shadow: [0, 0, "transparent", 0]};
        this.updateProps = (B)=>{
            this.center.x=this.x+this.lengthX/2;
            this.center.y=this.y+this.breadthY/2;
        }//EO updateProps
        let autoStyle = new CDraw.autoStyle(this.styling, this);
        
        this.draw = (B)=>{      
            B.beginPath();
            autoStyle.call(B, ()=>{
            B.strokeRect(this.x, this.y, this.lengthX, this.breadthY );
            },
            ()=>{
            B.fillRect(this.x, this.y, this.lengthX, this.breadthY );
            })
            B.closePath();
        this.updateProps(B);
        }//EO draw
    }
    ,autoStyle: function(styling, object){
       var spl;
       if(typeof styling === "string")spl = styling.split("_");
       else spl = styling;
       this.object = object;
       this.color = object.color = spl[1]; 
       this.strokeWidth = object.strokeWidth = Number(spl[0]);
       this.styleType = "FILL";
       if(spl[0] == "") this.styleType = "FILL";    
       if(spl[0] != "") this.styleType = "STROKE";
       this.call = (B, 
        strokeCallback=function(){B.stroke();},
        fillCallback=function(){B.fill();}
        )=>{
           this.color = this.object.color
           this.strokeWidth = this.object.strokeWidth
           if(this.styleType=="FILL"){ 
               B.fillStyle = this.color; fillCallback(); 
           }
           if(this.styleType =="STROKE"){
               B.lineWidth = this.strokeWidth; 
               B.strokeStyle = this.color;
               strokeCallback(); 
           }
       }//EO call
       
    }
    ,rotate: function(child, B){
        if(child.rotation.rad!=0 && child.center!=undefined){
            B.translate(child.rotation.about.x, child.rotation.about.y);
            B.rotate(child.rotation.rad);
            B.translate(-child.rotation.about.x, -child.rotation.about.y);
        }
    }
    ,shadow: function(B, params){
        [B.shadowColor, B.shadowOffsetX, B.shadowOffsetY, B.shadowBlur] =
        [params[2], params[0], params[1], params[3]];
    }
    ,stylesAndComposites: {
        draw: function(child, B){
            B.globalAlpha = child.alpha; 
            CDraw.shadow(B, child.GCParams.shadow);
            B.globalCompositeOperation = (child.GCParams.op!=undefined?child.GCParams.op:"source-over");
        },
        restore: function(B){
            B.globalAlpha = 1;  
            CDraw.shadow(B, [0, 0, "transparent", 0]);
            B.globalCompositeOperation = "source-over";
        }
    }
    ,useScene: function(context){
        ["rect", "arc",].map((object)=>{
            //CDraw[object].prototype.rotation = {rad:0};
            CDraw[object].prototype.shapeName = object;
            /*
            CDraw[object].prototype.GCParams = {
                shadow: [0, 0, "transparent", 0],
            }
            */
        })
        this.B = context;
        this.allChildren = [];
        let animFrame = ()=>{
            CDraw.clearCanvas(this.B); 
            this.allChildren.map((child, childIn) =>{
                child.indexInScene = childIn;
                this.B.save();
                CDraw.stylesAndComposites.draw(child, this.B)
                CDraw.rotate(child, this.B);
                child.draw(this.B);
                CDraw.stylesAndComposites.restore(this.B);
                this.B.restore();
            });
        requestAnimationFrame(animFrame)
        //console.log("all", this.allChildren)
        }
        animFrame();
        this.add = (child)=>{
            child.indexInScene = this.allChildren.length;
            this.allChildren.push(child);
        }
        this.remove = (child)=>{ 
        if(child.indexInScene)this.allChildren.splice(child.indexInScene,1);
        else console.warn("This element is not in scene.");
        }
    }//EO useScene
    ,clearCanvas: function(B){
        B.clearRect(0, 0, B.canvas.width, B.canvas.height)
    }
    

}//EO CDraw
        
        
        
      
