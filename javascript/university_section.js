

var timecount=0;
let sort = "sort by";
let data2 = document.getElementById('university_list');
let data = document.querySelectorAll('.university');
let dataAll = [...data];
console.log(dataAll)


// let arrCountry = [];




document.getElementById('show_nav').addEventListener('click',function(e){

    timecount +=1;
    if(timecount %2==0)
    {
        document.getElementById('nav_menu_item').style.right ="-100%";
        
    }else{
        document.getElementById('nav_menu_item').style.right ="0";

        
    }
//    console.log(timecount);
    

})

function closeNav(){

    document.getElementById('nav_menu_item').style.right ="-100%";
    timecount =2;

}


function dropfunction(){

    document.getElementById("content").classList.toggle("show");
}


function country_based_filter()
{
    var switching=true,shouldSwitch,child1,child2,i,countryName1,countryName2,parent1,parent2,list,j;
    

    while(switching)
  {
       switching = false;
       list = data2.querySelectorAll('.university_profile');
    //    console.log(list)
       

        for( i=0;i<list.length-1;i++)
        {

           shouldSwitch = false;
            j=i;


            parent1 = list[j].parentNode;
            child1 = list[j].children;
            countryName1 = child1[1].innerHTML.toLowerCase();

            parent2 = list[j+1].parentNode;
            child2 = list[j+1].children;
            countryName2 = child2[1].innerHTML.toLowerCase();

            // console.log(parent1);

            // console.log(countryName1,countryName2)

       

        if(countryName1 > countryName2)
        {
            
            shouldSwitch = true;
            break;

        }
    

    }

    if(shouldSwitch)
    {
        // parent1[i].parentNode.insertBefore(dataAll[i+1],dataAll[i]);
        // switching = true;
       
        // console.log(parent1)
        // console.log(parent2)
       data2.insertBefore(parent2,parent1);
        switching = true;

    }

   
  }
}


function Rank_based_filter()
{
    var switching=true,shouldSwitch,child1,child2,i,parent1,parent2,innerchild1,innerchild2,j,Rankdata;

    while(switching)
    {
        switching = false;
        Rankdata = data2.querySelectorAll('.university_data');

        for(let i=0;i<Rankdata.length-1;i++)
        {
            shouldSwitch = false;
            j=i;


            parent1 = Rankdata[j].parentNode;
            child1 = Rankdata[j].children;
            innerchild1 =parseInt (child1[0].children[1].innerHTML.trim());

            parent2 = Rankdata[j+1].parentNode;
            child2 = Rankdata[j+1].children;
            innerchild2 = parseInt( child2[0].children[1].innerHTML.trim());


            console.log(innerchild1,innerchild2)

            if(innerchild1 > innerchild2)
            {
                shouldSwitch=true;
                break;
            }

        }

        if(shouldSwitch)
        {
            data2.insertBefore(parent2,parent1);
            switching = true;
        }



    }

}


document.getElementById('country').addEventListener('click',function(){

    
    document.getElementById("main").innerHTML = sort+" Country(A-Z)";
    document.getElementById("content").classList.remove("show");
    country_based_filter();
})
    


document.getElementById('rank').addEventListener('click',function(){

    document.getElementById("main").innerHTML = sort+" Rank";

    document.getElementById("content").classList.remove("show");
    Rank_based_filter();
})




// function sort_arr()
// {
//     arrCountry.sort(function(a,b){

//         return a.localeCompare(b);
//     })
    
// }



// sort_arr();
// console.log(arrCountry)

var timecount=0;
var more = document.getElementById('see_more');
function ShowMore()
{
    timecount +=1;

    if(timecount % 2==0)
    {
        more.innerHTML = " See more ";
        window.scrollTo(0,500);
        document.getElementById('num1').style.display = "none";
        document.getElementById('num2').style.display ="none";
        document.getElementById('num3').style.display = "none";

    }else{

        more.innerHTML = " See less ";
        window.scrollTo(300,500);
        document.getElementById('num1').style.display = "block";
        document.getElementById('num2').style.display ="block";
        document.getElementById('num3').style.display = "block";

    }

}

function GoToUniversitySection()
{
    window.scrollTo(500,600);
}

document.getElementById("logo").addEventListener('click',function(e){

    location.href = "../home.html"
})