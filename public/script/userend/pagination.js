// for the pagination part
const rightbtn = document.getElementById("right");
const main_content = document.getElementById("content");
const leftbtn = document.getElementById("left");

rightbtn.addEventListener("click", function (e) {
  main_content.scrollLeft += 100;
});

leftbtn.addEventListener("click", function (e) {
  main_content.scrollLeft -= 100;
});
