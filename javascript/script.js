

document.getElementById('see_more').addEventListener('click',function(){

    document.getElementById('see_more').style.display="none";
    document.getElementById('see_less').style.display="block";

    document.getElementById('university5').style.display="block"
    document.getElementById('university6').style.display="block"
    document.getElementById('university7').style.display="block"
    document.getElementById('university8').style.display="block"


   



})



    window.addEventListener('resize',function(event){

        if(window.screen.width >500)
        {
        

            document.getElementById('university5').style.display="none"
            document.getElementById('university6').style.display="none"
            document.getElementById('university7').style.display="none"
           document.getElementById('university8').style.display="none"

           document.getElementById('see_more').style.display="block";
           document.getElementById('see_less').style.display="none";
        }
       

    })



document.getElementById('see_less').addEventListener('click',function(e){

    document.getElementById('see_more').style.display="block";
    document.getElementById('see_less').style.display="none";


    document.getElementById('university7').style.display="none"
    document.getElementById('university8').style.display="none"
    document.getElementById('university5').style.display="none"
    document.getElementById('university6').style.display="none"

})

window.onscroll = function() {scrollfunction()};

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