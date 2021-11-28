



//for the navbar
var timecount=0;
document.getElementById('show_nav').addEventListener('click',function(e){

  timecount +=1;
  if(timecount %2==0)
  {
      document.getElementById('nav_menu_item').style.right ="-100%";
      
  }else{
      document.getElementById('nav_menu_item').style.right ="0";

      
  }
 console.log(timecount);
  

})

//closing the nav
function closeNav(){

  document.getElementById('nav_menu_item').style.right ="-100%";
  timecount =2;

}


// document.getElementById("name").addEventListener('click',function(){

//   window.open("http://www.google.com");
// })

document.getElementById("australia").addEventListener('click',function(e){

   location.href = "./country.html";

})

// image slider in every 2 seconds 

var SLideInd = 0;
showSlide();

function showSlide()
{
  var i;
  var slides_img = document.getElementsByClassName("singleSlide");
  var dot_img = document.getElementsByClassName("dot");

  for(i=0;i<slides_img.length;i++)
  {
    slides_img[i].style.display = "none";
  }
  SLideInd +=1;
  if (SLideInd > slides_img.length) SLideInd = 1;

  for(i=0;i<dot_img.length;i++)
  {
    dot_img[i].className = dot_img[i].className.replace("active","");
  }

  slides_img[SLideInd-1].style.display = "block";
  dot_img[SLideInd-1].className += " active";
  setTimeout(showSlide,3000);
}