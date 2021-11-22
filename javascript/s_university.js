// window.onscroll = function() {scrollfunction()};

var timecount=0;
// function scrollfunction()
// {
//     if (document.body.scrollTop >= 20 || document.documentElement.scrollTop >=20)
//     {
        
//         document.getElementById('nav_menu_item').style.display ="none";
         
         
//     }else
//     {
//         // document.getElementById("content-section-id").style.display="block";
//         document.getElementById('nav_menu_item').style.display ="block";
//         // document.getElementById('nav_menu_item').style.right ="-100%";
        

//     }
// }



document.getElementById('see_more').addEventListener('click',function(){

    document.getElementById('see_more').style.display="none";
    document.getElementById('see_less').style.display="block";


    

    
        document.getElementById('history').style.display="block"
        document.getElementById('Law').style.display="block"
        document.getElementById('socio').style.display="block"
        document.getElementById('music').style.display="block"

        
        

        
    


   



})

document.getElementById('see_less').addEventListener('click',function(e){

    document.getElementById('see_more').style.display="block";
    document.getElementById('see_less').style.display="none";


    document.getElementById('history').style.display="none"
    document.getElementById('Law').style.display="none"
    document.getElementById('music').style.display="none"
    document.getElementById('socio').style.display="none"

})
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

window.addEventListener('resize',function(){

    if(this.window.screen.width < 500)
    {
        document.getElementById('history').style.display="none"
        document.getElementById('Law').style.display="none"
        document.getElementById('music').style.display="none"
        document.getElementById('socio').style.display="none"
       
    }
})

  