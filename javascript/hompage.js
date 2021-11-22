
// for the event slider
let slideIndex = 1;
showEventImage(slideIndex);

function plusDivs(n)
{
  showEventImage(slideIndex +=n);
}

document.getElementById("logo_click").addEventListener('click',function(e){

  window.location = "./index.html";
})





function showEventImage(index)
{
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (index > x.length) {slideIndex = 1};
  if (index < 1) {slideIndex = x.length};

  for(i=0;i<x.length;i++)
  {
    x[i].style.display = "none";
  }

  x[slideIndex - 1].style.display = "block";
}



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