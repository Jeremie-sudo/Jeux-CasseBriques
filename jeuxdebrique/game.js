 /// Selection de éléments du DOM par leur id 
 const regles =document.getElementById('rule');
 const quitter =document.getElementById('close-btn');
 const cadre =document.getElementById('regles');
 const canvas =document.getElementById('canvas');
 const gameover =document.getElementById('gameover');
 const perde =document.getElementById('lose');
 const gagne =document.getElementById('win');
 const rejouer =document.getElementById('rejouer');
 const pause =document.getElementById('pause');
const jouer =document.getElementById('jouer');
const activer=document.getElementById('sounding');
 
 // Les constants  sur la création 
 const LONG_PLANCHE =100;
 const HAUT_PLANCHE =15;
 const MARGIN_DU_BAS_PLANCHE =10;
 const BALL_RAYON =8;
 const SCORE_UNITE =10;
 const VIE_MAX =3;

/// Les variables 
 let left =false;
 let right=false;
 let enPause=false;
 let vie =3
 let score=0;
 let level=1;
 let jeuperdu=false;

// Propriété sur la planche
// ON créer un objet planche
 const planche ={
    
    x:(canvas.width/2)-(LONG_PLANCHE/2),
    y:canvas.height-HAUT_PLANCHE-MARGIN_DU_BAS_PLANCHE,
    w:LONG_PLANCHE,
    h:HAUT_PLANCHE,
    dx:8,
    
 }
 

///Iitialisation de canvas
const ctx =canvas.getContext('2d');
canvas.style.border ='2px greenyellow solid'

// Fonction pour dessinner la planche 
function desseplache() {
    ctx.beginPath();
    ctx.fillStyle='gainsboro';
    ctx.fillRect(planche.x,planche.y,planche.w,planche.h);
    ctx.filsStroke='white';
    ctx.closePath();
}
desseplache(); 
// Création de la balle 
const balle = {
    x: canvas.width/2,
    y:planche.y-BALL_RAYON,
    vitesse:5,
    rayon:BALL_RAYON,
    dx:3*(Math.random()*2 -1),
    dy:-3,
}

function iniPlanche(){
     planche.x=(canvas.width/2)-(LONG_PLANCHE/2);
    planche.y=canvas.height-HAUT_PLANCHE-MARGIN_DU_BAS_PLANCHE;
   

}

// Dessiner la balle

function dessineballe() {
    ctx.beginPath();
     ctx.arc(balle.x,balle.y,balle.rayon,0,Math.PI *2);
    ctx.fillStyle='#fff';
    ctx.fill()
    ctx.strokeStyle='white';
    ctx.stroke();
    ctx.closePath();
}

// Deplacement de la balle
  function deplaceballe(){
       balle.x+=balle.dx;
       balle.y+=balle.dy;

  }
  // Rémettre la balle a sa position initiale après la perte d'une vie 
   function iniBalle(){
    
    balle.x= canvas.width/2;
    balle.y=planche.y-BALL_RAYON;
    balle.dx=3 *(Math.random()*2 -1);
    balle.dy=-3;
   }
/// PROPIETE SUR LA BBRIQUE

const   briquePro={
    row:2,
    column:13,
    w:35,
    h:10,
    padding:3,
    offsetX:55,
    offsetY:40,
    fillColor:'gainsboro',
    visilility:true,
}
// création vituelle des briques
let briques = []
function creeBrique(){
for (let r =0; r< briquePro.row; r++) {
    briques[r] =[];
     for(let c=0; c<briquePro.column;c++){
         briques[r][c] ={

            x:c * (briquePro.w+briquePro.padding)+briquePro.offsetX,
            y:r * (briquePro.h+briquePro.padding)+briquePro.offsetY,
            status:true,
            ...briquePro

          }

     }

}

}
creeBrique();

///Fonction pour dessiner chaque brique

function desBrique(){
    // On parcours chaque colonne où nous avons 13 briques
     briques.forEach(colonne=>{
        // on prends chaque brique de chaque colonne
        colonne.forEach(brique=>{
                if (brique.status) {

                    ctx.beginPath();
                    ctx.rect(brique.x,brique.y,brique.w,brique.h);
                    ctx.fillStyle=brique.fillColor;
                    ctx.fill();
                    ctx.closePath();

                }
        })
     })

}
// gestion de la collision de la balle avec une brique+

function balle_brique() {
     briques.forEach(colonne=>{
        // on prends chaque brique de chaque colonne
        colonne.forEach(brique=>{
            
                 if (brique.status) {
                    if(balle.x + balle.rayon > brique.x
                        && balle.x - balle.rayon < brique.x + brique.w
                        && balle.y + balle.rayon > brique.y
                        && balle.y-balle.rayon < brique.y + brique.h){
                        BRICK_HIT.play();
                     balle.dy *=-1;
                     brique.status=false;
                     score+= SCORE_UNITE;
                    

                }
            }
        })
     })
   
}

//  Gestion des collision de la balle avec les extremité du canvas

function colextrem() {
    //  Avec les extrmites gauche et droites
  if (balle.x+balle.rayon>canvas.width || balle.x+balle.rayon<0) {
     WALL_HIT.play();
    balle.dx*=-1;
  }
   //  Avec le cote superieur
  if (balle.y-balle.rayon<0) {
    WALL_HIT.play();
    balle.dy*=-1;
  }if (balle.y+balle.rayon>canvas.height){
    LIFE_LOST.play();
      vie--;
      iniPlanche();
      iniBalle();
    
  }
}
/// Interraction entre la  alle et la planche 

function balle_planche() {
    if(balle.x + balle.rayon >planche.x && balle.x-balle.rayon<planche.x+planche.w && balle.y+balle.rayon>planche.y){
           PADDLE_HIT.play();
        // Cette valeur est comprise entre -50 et 50
         let pointChoc = balle.x-(planche.x+planche.w/2);
         //  Normalisons cete valeur pour pour calculer la vitesse en fonction de l'angle trouver au toucher de la planche par la balle
         pointChoc = pointChoc/planche.w;
         let angle = pointChoc * Math.PI/3;
         console.log(pointChoc)
         balle.dx+=balle.vitesse*Math.sin(angle);
         balle.dy-=balle.vitesse*Math.cos(angle);


    }
}
// Fonction pour afficher les statistiques du jeu 

function afficheSta(img, iPosY,iPosX,text='',tposX=null,tposY=null) {
   ctx.fillStyle = 'black';
   ctx.font='20px monospace';
   ctx.fillText(text,tposX,tposY)
   ctx.drawImage(img, iPosY,iPosX,width=20,height=20)
}

// Gestion de la perte de toute ses vie
function gameOver() {
    if (vie<=0) {
        afficheInfo('lose');
        jeuperdu = true;
    }
    
}
// Passsage à un autre niveau
  function nouveauNv() {
     let isLevelUp  =true;
     for (let r=0;r<briquePro.row ;r++) {

        for (let c=0;c<briquePro.column ;c++) {
            isLevelUp = isLevelUp && !briques[r][c].status;
         
           }
         
     }

     if (isLevelUp) {
        WIN.play();
        if (level>=VIE_MAX) {
            afficheInfo();
            jeuperdu =true;
            return;
        }

        briquePro.row+=2;
        creeBrique();
        balle.vitesse+=2;
        iniBalle();
        iniPlanche();
        level++;


     }

  }


//  CONTROLE DU DEPLACMENT DE LA PLANCHE
document.addEventListener('keydown',(e)=>{
       if (e.key=='Left' || e.key=='ArrowLeft' ) {
               left=true;
       }
       else if (e.key=='Right' || e.key=='ArrowRight')
       {
             right = true;
       } 
})

document.addEventListener('keyup',(e)=>{
       if (e.key=='Left' || e.key=='ArrowLeft' ) {
               left=false;
       }
       else if (e.key=='Right' || e.key=='ArrowRight')
       {
             right = false;
       } 
})
  // Fonction dessinatrice
   function dessinatrice(){
     desseplache();
     dessineballe();
     desBrique();
     afficheSta(SCORE_IMG,canvas.width-100,5,score,canvas.width-65,22)
     afficheSta(LEVEL_IMG,canvas.width/2,5,level,canvas.width/2 +20,22)
     afficheSta(LIFE_IMG,55,5,vie,80,22)


   }

  // Fonction de mise ajout de l'écran
  function miseajout(){

     deplace();
     deplaceballe();
     colextrem();
     balle_planche();
     balle_brique();
     gameOver();
      nouveauNv();
  }

// fonction du deplacement de notre planche
  function deplace() {
       if (left && planche.x>0) {
        planche.x-=planche.dx;
       }
        else if(right && planche.x + planche.w<canvas.width){
            planche.x+=planche.dx;
        }
  }

// Fonction d'animation du deplacement

 function animation() {
      ctx.clearRect(0,0,canvas.width,canvas.height);

       if (!enPause) {

         dessinatrice();
         miseajout();
     
       }
    
      if(!jeuperdu){
        requestAnimationFrame(animation);
      }

 }
animation();
function  afficheInfo(){
         gameover.style.visibility='visible';
         gameover.style.opacity='1';
       if (type='win') {
        
           gagne.style.visibility='hidden';
           perde.style.visibility='visible'
           gagne.style.opacity='0'
       }
       else{
            
          gagne.style.visibility='visible';
          perde.style.visibility='hidden'
          perde.style.opacity='0'
       }
}

//  Affichage des regles du jeu
  regles.addEventListener('click',()=>{

      
    cadre.classList.add('affiche')
     enPause =true;
    
  })
  quitter.addEventListener('click',()=>{
    cadre.classList.remove('affiche')
    enPause =false;
    
  })
  // Pour relancer le jeu

  rejouer.addEventListener('click',()=>{
    location.reload();
  })
  // Pour relancer le jeu 
  pause.addEventListener('click',()=>{
      enPause=true;
       
  })
  jouer.addEventListener('click',()=>{
      enPause=false;
       
  })
  ///  Gestion de l'activation et de la desactivation du son du jeu
  console.log(activer);

  activer.addEventListener('click',sonManager);

  function sonManager(){
       let srcImag = activer.getAttribute('src');
       let SON_IMAGE =  srcImag=='img/sound_on.png'? 'img/mute.png':'img/sound_on.png';
       activer.setAttribute('src',SON_IMAGE);

         WALL_HIT.muted=!WALL_HIT.muted;
         PADDLE_HIT.muted=! PADDLE_HIT.muted;
         BRICK_HIT.muted=!BRICK_HIT.muted;
         WIN.muted=!WIN.muted;
         LIFE_LOST.muted=!LIFE_LOST.muted;
  }


