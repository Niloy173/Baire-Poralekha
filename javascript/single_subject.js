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

function closeNav(){

  document.getElementById('nav_menu_item').style.right ="-100%";
  timecount =2;

}