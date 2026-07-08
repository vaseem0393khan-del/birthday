/======================================================
PREMIUM BIRTHDAY WEBSITE
SCRIPT.JS
PART 1
======================================================/

"use strict";

/======================================================
ELEMENTS
======================================================/

const loader=document.getElementById("loader");

const beginBtn=document.getElementById("beginBtn");

const birthdayMusic=document.getElementById("birthdayMusic");

const screens=document.querySelectorAll(".screen");

const introScreen=document.getElementById("introSection");

const matchScreen=document.getElementById("matchSection");

const pathScreen=document.getElementById("pathSection");

const giftScreen=document.getElementById("giftSection");

const slideScreen=document.getElementById("slideshowSection");

const messageScreen=document.getElementById("messageSection");

const matchStick=document.getElementById("matchStick");

const matchBox=document.getElementById("matchBox");

const sparkContainer=document.getElementById("sparkContainer");

const smokeContainer=document.getElementById("smokeContainer");

const fireLight=document.getElementById("fireLight");

const fireBall=document.getElementById("fireBall");

const travelPath=document.getElementById("travelPath");

const giftLid=document.querySelector(".giftLid");

const slideElements=document.querySelectorAll(".slide");

const musicBtn=document.getElementById("musicBtn");

const restartBtn=document.getElementById("restartBtn");

const fullscreenBtn=document.getElementById("fullscreenBtn");

const heartLayer=document.getElementById("heartLayer");

const confettiLayer=document.getElementById("confettiLayer");

const goldLayer=document.getElementById("goldLayer");

const magicLayer=document.getElementById("magicLayer");

const fireflyLayer=document.getElementById("fireflyLayer");

/======================================================
STATE
======================================================/

let dragging=false;

let ignited=false;

let pathStarted=false;

let currentSlide=0;

let slideshowTimer=null;

let animationRunning=false;

let musicStarted=false;

let pointerOffsetX=0;

let pointerOffsetY=0;

/======================================================
LOADER
======================================================/

window.addEventListener("load",()=>{

setTimeout(()=>{

loader.style.opacity="0";

setTimeout(()=>{

loader.style.display="none";

},900);

},1800);

});

/======================================================
SCREEN
======================================================/

function showScreen(screen){

screens.forEach(s=>{

s.classList.remove("active");

});

screen.classList.add("active");

}

/======================================================
START
======================================================/

beginBtn.addEventListener("click",()=>{

showScreen(matchScreen);

if(!musicStarted){

birthdayMusic.volume=.9;

birthdayMusic.play();

musicStarted=true;

}

});

/======================================================
MATCH DRAG
======================================================/

matchStick.addEventListener("pointerdown",(e)=>{

dragging=true;

matchStick.setPointerCapture(e.pointerId);

const rect=matchStick.getBoundingClientRect();

pointerOffsetX=e.clientX-rect.left;

pointerOffsetY=e.clientY-rect.top;

});

window.addEventListener("pointermove",(e)=>{

if(!dragging)return;

const area=document.getElementById("matchArea");

const rect=area.getBoundingClientRect();

let x=e.clientX-rect.left-pointerOffsetX;

let y=e.clientY-rect.top-pointerOffsetY;

matchStick.style.left=x+"px";

matchStick.style.top=y+"px";

checkIgnition();

});

window.addEventListener("pointerup",()=>{

dragging=false;

});

/======================================================
CHECK IGNITION
======================================================/

function checkIgnition(){

if(ignited)return;

const a=matchStick.getBoundingClientRect();

const b=matchBox.getBoundingClientRect();

const overlap=

a.right>b.left+20 &&

a.left<b.right-20 &&

a.bottom>b.top+15 &&

a.top<b.bottom-15;

if(overlap){

igniteMatch();

}

}

/======================================================
IGNITE
======================================================/

function igniteMatch(){

ignited=true;

matchStick.classList.add("fireActive");

fireLight.style.opacity="1";

createSparkBurst();

createSmokeBurst();

setTimeout(()=>{

startFirePath();

},1200);

}
/======================================================
SPARK ENGINE
======================================================/

function createSparkBurst(){

for(let i=0;i<35;i++){

const spark=document.createElement("div");

spark.className="spark";

const x=(Math.random()*120)-60;
const y=(Math.random()*80)-40;

spark.style.left=matchStick.offsetLeft+140+"px";
spark.style.top=matchStick.offsetTop+8+"px";

spark.style.setProperty("--x",x+"px");
spark.style.setProperty("--y",y+"px");

spark.style.background=
Math.random()>.5?
"#ffd84f":
"#ff7b22";

sparkContainer.appendChild(spark);

setTimeout(()=>{

spark.remove();

},900);

}

}

/======================================================
SMOKE ENGINE
======================================================/

function createSmokeBurst(){

for(let i=0;i<20;i++){

const smoke=document.createElement("div");

smoke.className="smoke";

smoke.style.left=

matchStick.offsetLeft+140+

(Math.random()*10)+"px";

smoke.style.top=

matchStick.offsetTop+

(Math.random()*10)+"px";

smoke.style.opacity=

.25+

Math.random()*.4;

smoke.style.transform=

"scale("+

(.6+Math.random())+

")";

smokeContainer.appendChild(smoke);

setTimeout(()=>{

smoke.remove();

},2400);

}

}

/======================================================
CONTINUOUS FIRE
======================================================/

let smokeLoop;

function startContinuousSmoke(){

smokeLoop=

setInterval(()=>{

if(!ignited)return;

createSmokeBurst();

},350);

}

/======================================================
FIRE LIGHT
======================================================/

function animateFireLight(){

fireLight.animate([

{

transform:"scale(1)",

opacity:.35

},

{

transform:"scale(1.18)",

opacity:.8

},

{

transform:"scale(.95)",

opacity:.45

}

],{

duration:280,

iterations:Infinity

});

}

/======================================================
SVG PATH
======================================================/

const totalLength=

travelPath.getTotalLength();

function pointAt(progress){

return

travelPath.getPointAtLength(

totalLength*progress

);

}

/======================================================
START FIRE PATH
======================================================/

function startFirePath(){

if(pathStarted)return;

pathStarted=true;

showScreen(pathScreen);

fireBall.style.display="block";

animateFireLight();

startContinuousSmoke();

animateFireAlongPath();

}

/======================================================
MOVE FIRE
======================================================/

function animateFireAlongPath(){

let progress=0;

animationRunning=true;

function step(){

if(!animationRunning)return;

progress+=0.0045;

const p=pointAt(progress);

fireBall.style.left=

p.x-17+"px";

fireBall.style.top=

p.y-17+"px";

fireLight.style.left=

p.x-100+"px";

fireLight.style.top=

p.y-100+"px";

travelPath.style.stroke=

hsl(${35+progress*30},
100%,
${35+progress*30}%);

if(progress>=1){

animationRunning=false;

fireBall.style.display="none";

clearInterval(smokeLoop);

openGiftSequence();

return;

}

requestAnimationFrame(step);

}

requestAnimationFrame(step);

}
/======================================================
SLIDESHOW ENGINE
======================================================/

const currentSlideLabel=document.getElementById("currentSlide");

const totalSlideLabel=document.getElementById("totalSlides");

const slideFlash=document.querySelector(".slideFlash");

const TOTAL_DURATION=28.6;

const FIRST_HALF=14.3;

const SECOND_HALF=14.3;

let slideIndex=0;

let slideLoop;

/======================================================
START SLIDESHOW
======================================================/

function startSlideshow(){

showScreen(slideScreen);

slideIndex=0;

slideElements.forEach((slide,index)=>{

slide.classList.toggle("active",index===0);

});

updateCounter();

runFastSlides();

setTimeout(()=>{

runSlowSlides();

},FIRST_HALF*1000);

setTimeout(()=>{

finishPresentation();

},TOTAL_DURATION*1000);

}

/======================================================
FAST PART
======================================================/

function runFastSlides(){

clearInterval(slideLoop);

slideLoop=setInterval(()=>{

if(slideIndex>=4)return;

nextSlide(true);

},2400);

}

/======================================================
SLOW PART
======================================================/

function runSlowSlides(){

clearInterval(slideLoop);

slideLoop=setInterval(()=>{

nextSlide(false);

},4700);

}

/======================================================
NEXT
======================================================/

function nextSlide(fast){

slideElements[slideIndex].classList.remove("active");

slideIndex++;

if(slideIndex>=slideElements.length){

slideIndex=0;

}

slideElements[slideIndex].classList.add("active");

updateCounter();

flashTransition();

const img=

slideElements[slideIndex]

.querySelector("img");

if(fast){

img.style.animationDuration="8s";

img.style.transform="scale(1.1)";

}else{

img.style.animationDuration="14s";

img.style.transform="scale(1.2)";

}

}

/======================================================
FLASH
======================================================/

function flashTransition(){

slideFlash.animate([

{

opacity:0

},

{

opacity:.45

},

{

opacity:0

}

],{

duration:350

});

}

/======================================================
COUNTER
======================================================/

function updateCounter(){

if(currentSlideLabel){

currentSlideLabel.textContent=

slideIndex+1;

}

if(totalSlideLabel){

totalSlideLabel.textContent=

slideElements.length;

}

}

/======================================================
ENDING
======================================================/

function finishPresentation(){

clearInterval(slideLoop);

showScreen(messageScreen);

showFinalEffects();

}

/======================================================
FINAL EFFECTS
======================================================/

function showFinalEffects(){

createConfetti(350);

createHearts(140);

createGoldParticles(220);

createMagicParticles(180);

startFireflies();

animateMessage();

}
/======================================================
FIREFLIES
======================================================/

let fireflyInterval;

function startFireflies(){

clearInterval(fireflyInterval);

fireflyInterval=setInterval(()=>{

const fly=document.createElement("div");

fly.className="firefly";

fly.style.left=Math.random()*100+"vw";

fly.style.top=Math.random()*100+"vh";

fly.style.animationDuration=

(4+Math.random()*4)+"s";

fireflyLayer.appendChild(fly);

setTimeout(()=>{

fly.remove();

},9000);

},300);

}

/======================================================
MESSAGE
======================================================/

function animateMessage(){

const card=document.getElementById("messageCard");

card.animate([

{

opacity:0,

transform:"translateY(80px) scale(.8)"

},

{

opacity:1,

transform:"translateY(0) scale(1)"

}

],{

duration:1800,

fill:"forwards",

easing:"cubic-bezier(.2,.8,.2,1)"

});

}

/======================================================
MUSIC
======================================================/

musicBtn.addEventListener("click",()=>{

if(birthdayMusic.paused){

birthdayMusic.play();

musicBtn.textContent="🔊";

}else{

birthdayMusic.pause();

musicBtn.textContent="🔇";

}

});

/======================================================
FULLSCREEN
======================================================/

fullscreenBtn.addEventListener("click",()=>{

if(!document.fullscreenElement){

document.documentElement.requestFullscreen?.();

}else{

document.exitFullscreen?.();

}

});

/======================================================
RESTART
======================================================/

restartBtn.addEventListener("click",()=>{

clearInterval(slideLoop);

clearInterval(smokeLoop);

clearInterval(fireflyInterval);

birthdayMusic.pause();

birthdayMusic.currentTime=0;

location.reload();

});

/======================================================
VISIBILITY
======================================================/

document.addEventListener(

"visibilitychange",

()=>{

if(document.hidden){

birthdayMusic.pause();

}else{

if(musicStarted){

birthdayMusic.play().catch(()=>{});

}

}

});

/======================================================
RESIZE
======================================================/

window.addEventListener("resize",()=>{

fireLight.style.opacity=ignited?"1":"0";

});

/======================================================
INITIALIZE
======================================================/

window.addEventListener("load",()=>{

slideElements.forEach((slide,i)=>{

slide.classList.toggle(

"active",

i===0

);

});

if(totalSlideLabel){

totalSlideLabel.textContent=

slideElements.length;

}

});

/======================================================
END OF SCRIPT
======================================================/
