document.getElementById('register_btn').addEventListener('click',function(){


  // document.getElementById('register1').style.display = "none";
  // document.getElementById('another1').style.display = "none";
  // document.getElementById('firstContent').style.margin = "0";

  // document.getElementById('register2').style.display = "block";
  // document.getElementById('another2').style.display = "block";

  document.getElementById('register_section').style.display = "block";
  document.getElementById('login_section').style.display = 'none';
})


document.getElementById('sign_in_btn').addEventListener('click',function(){


  // document.getElementById('register1').style.display = "block";
  // document.getElementById('another1').style.display = "block";
  // // document.getElementById('firstContent').style.margin = "80px 80px";

  // document.getElementById('register2').style.display = "none";
  // document.getElementById('another2').style.display = "none";

  document.getElementById('register_section').style.display = "none";
  document.getElementById('login_section').style.display = 'block';
})

document.getElementById("logo_click").addEventListener('click',function(e){

  window.location = "../index.html";
})
