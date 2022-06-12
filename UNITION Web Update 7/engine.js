//@HAXOR's mom
// user code testing: (this is what ppl using the engine would code)
/////////////////////////////////////////////////
var canvas
window.onload=()=>
{
  //when document loads make a canvas
  canvas=document.createElement('canvas')
  document.body.appendChild(canvas)
  //create a canvas the size of the window and add html canvas
  cnv=new Canvas(window.innerWidth,window.innerHeight,canvas)
  //set up input to capture inputs
  input=new Input()
  //basic animation loop
  play=true
  function a()
  {
    cnv.background('#f0f')
    ICON.draw(cnv)
    if(input.key('a'))ICON.x-=0.1
    if(input.key('d'))ICON.x+=0.1
    play?setTimeout(a):null
  }a()
}
//resize canvas to fit window
window.onresize=()=>
{
  cnv.resize(window.innerWidth,window.innerHeight)
}
/////////////////////////////////////////////////

//must stay the same throughout development of games (reccomend 100)
const DEV_WINDOW_HEIGHT=100
//import image from "assets/""
function loadImage(path)
{
  img=new Image()
  img.src='assets/'+path
  return img
}
//image sprite
class Sprite
{
  constructor(path,x,y,w,h,center)
  {
    this.img=loadImage(path)
    this.x=x
    this.y=y
    this.w=w
    this.h=h
    //will decide wether or not to anchor the sprite to its center
    this.center=center
  }
  //get the rectangle from a sprite for collision
  rect()
  {
    r=new Rect(this.x,this.y,this.w,this.h,this.center)
    return r.center?r.get_centered():r
  }
  //render the sprite onto the canvas (center being the anchor to center of sprite)
  draw(canvas)
  {
    canvas.blit(this.img,this.x,this.y,this.w,this.h,this.center)
  }
}
class Rect
{
  constructor(x,y,w,h,center)
  {
    this.center=center
    this.x=x
    this.y=y
    this.w=w
    this.h=h
  }
  //get the rectangle if it was anchored to its center
  get_centered()
  {
    return new Rect(
      this.x-this.w/2,
      this.y-this.h/2,
      this.w,this.h,
      false
      )
  }
  //test if a rect is colliding with another
  collides(rect)
  {
    let a=this.center?this.get_centered():this
    let b=rect.center?rect.get_centered():rect
    //some math I came up with a few years ago through trial and error...
    return (a.x<b.x+b.w
          &&a.y<b.y+b.h
          &&b.x<a.x+a.w
          &&b.y<a.y+a.h)
  }
  //render the rectangle onto a canvas
  draw(canvas)
  {
    let a=this.center?this.get_centered():this
    canvas.rect(a.x,a.y,a.w,a.h,false)
  }
}
//2d point in 2d space...
class Vector2
{
  constructor(x=0,y=0)
  {
    this.x=x
    this.y=y
  }
}
//class for playing sounds
class Sound
{
  constructor(path,volume=1)
  {
    this.audio=new Audio()
    this.audio.src=path
    this.audio.volume=volume
  }
  play(reset=true)
  {
    if(reset)this.audio.currentTime=0
    this.audio.play()
  }
  pause()
  {
    this.audio.pause()
  }
}
//class for music
class Music
{
  constructor(path,volume=1,loop=true,autoplay=false)
  {
    this.audio=new Audio()
    this.audio.src=path
    this.audio.loop=loop
    this.audio.volume=volume
    this.audio.autoplay=autoplay
  }
  play(reset=false)
  {
    if(reset)this.audio.currentTime=
    this.audio.play()
  }
  pause()
  {
    this.audio.pause()
  }
}
//everything gets drawn on this
class Canvas
{
  //basic setup
  constructor(width,height,canvas)
  {
    this.offsetX=0
    this.offsetY=0
    this.width=width
    this.height=height
    this.midX=width/2
    this.midY=height/2
    this.ctx=canvas.getContext('2d')
    canvas.width=this.width
    canvas.height=this.height
    this.elem=canvas
    //this is important, ensures any window size compatibility even live if you use canvas.resize()
    this.zoom=this.height/DEV_WINDOW_HEIGHT
  }
  //use this to clear the screen
  background(c)
  {
    this.ctx.fillStyle=c
    this.ctx.fillRect(0,0,this.width,this.height)
  }
  //set fill color
  color(c)
  {
    this.ctx.fillStyle=c
  }
  //draw an image onto the canvas
  blit(image,x,y,w=0,h=0,center=true)
  {
    this.ctx.drawImage(image,
    (x+this.offsetX-(center?w/2:0))*this.zoom+this.midX,
    (y+this.offsetY-(center?h/2:0))*this.zoom+this.midY,
    w*this.zoom,
    h*this.zoom)
  }
  //fill a rectangle
  rect(x,y,w,h,center=false)
  {
    this.ctx.fillRect(
      (x+this.offsetX)*this.zoom+this.midX-(center?w/2:0),
      (y+this.offsetY)*this.zoom+this.midY-(center?h/2:0),
      w*this.zoom,
      h*this.zoom)
  }
  //change the canvas size (must use this function for best results)
  resize(width,height)
  {
    this.width=width
    this.height=height
    this.midX=width/2
    this.midY=height/2
    this.elem.width=width
    this.elem.height=height
    this.zoom=height/DEV_WINDOW_HEIGHT
  }
}
//capture inputs
class Input
{
  constructor()
  {
    window.addEventListener('keydown',(e)=>{this.keydown(e)})
    window.addEventListener('keyup',(e)=>{this.keyup(e)})
    window.addEventListener('mousemove',(e)=>{
      this.mouseX=e.clientX
      this.mouseY=e.clientY
    })
    window.addEventListener('mousedown',(e)=>{this.click=true})
    window.addEventListener('mouseup',(e)=>{this.click=false})
    this.keys=[]//keys that are pressed appear in this.keys array
    this.mouseX=0
    this.mouseY=0
    this.click=false
  }
  //quick way to check if a key is pressed
  key(x){return this.keys.indexOf(x)!=-1}
  //captures a keypress
  keydown(e)
  {
    let key=e.key
    if(this.keys.indexOf(key)==-1)this.keys.push(key)
  }
  //captures a key release
  keyup(e)
  {
    let key=e.key
    let io=this.keys.indexOf(key)
    if(io!=-1)this.keys.splice(io,1)
    console.log(this.keys,key)
  }
}
//the unition web icon is stored in the ICON variable as a sprite
const ICON = new Sprite('icon.png',0,0,100,100,true)