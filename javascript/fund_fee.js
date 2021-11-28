// toggle the fund and ee information

var scholar = document.querySelector(".first_topic");


var scholar_child = scholar.children;




  scholar_child[0].addEventListener('click',function(e){

    document.getElementById("fee").classList.toggle('active');
    document.getElementById("fund").classList.remove('active');


    document.getElementById("fee_info").style.display="block";
    document.getElementById("fund_info").style.display="none";
  })

  scholar_child[1].addEventListener('click',function(e){

    

    document.getElementById("fee").classList.remove('active');
    document.getElementById("fund").classList.toggle('active');

    
    document.getElementById("fee_info").style.display="none";
    document.getElementById("fund_info").style.display="block";
  })
