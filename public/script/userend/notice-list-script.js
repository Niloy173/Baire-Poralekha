const maintable = document.getElementById("maintable");
const tablebody = maintable.getElementsByTagName("tbody");

const FailureToast = Toastify({
  text: "Sorry! No notice found",
  duration: 2000,
});

async function GetNotices(pagenumber) {
  // based on page number fetch all notice
  const response = await fetch(`/notice/all-notice-list/${pagenumber}`, {
    method: "POST",
  });

  const result = await response.json();

  if (result.error) {
    FailureToast.showToast();
    // incase any error occured
  } else {
    let { startingIndex, endingIndex, totalPage, data, default_number } =
      result.information;

    const noticeInformation = [];

    const all_page = document.querySelectorAll(".internal");

    for (let index = 0; index < all_page.length; index++) {
      all_page[index].classList.remove("active");
    }

    for (let index = startingIndex; index < endingIndex; index++) {
      const { date, title, _id } = data[index];
      noticeInformation.push({ date, title, _id });
    }

    let counter = 0; // for table
    let counter2 = 0; // for information object

    for (let index = startingIndex; index < endingIndex; index++) {
      tablebody[counter]
        .getElementsByTagName("tr")[0]
        .getElementsByTagName("th")[0].innerHTML = ++startingIndex;

      tablebody[counter]
        .getElementsByTagName("tr")[0]
        .getElementsByTagName("td")[0].innerHTML =
        noticeInformation[counter2].title;

      tablebody[counter]
        .getElementsByTagName("tr")[0]
        .getElementsByTagName("td")[1].innerHTML =
        noticeInformation[counter2].date;

      const url = "/notice/" + noticeInformation[counter2]._id;

      tablebody[counter]
        .getElementsByTagName("tr")[0]
        .getElementsByTagName("td")[2].children[0].href = url;

      tablebody[counter].getElementsByTagName("tr")[0].style.background =
        "none";

      counter++;
      counter2++;
    }

    all_page[default_number - 1].classList.add("active");
  }
}

// search related functionality
function Clear() {
  document.getElementById("search_text").value = "";
}

// search functionality for date & title
async function Search() {
  const search_text = document.getElementById("search_text").value;
  let searchValue = "";
  let count = 0;

  if (search_text.includes("/")) {
    searchValue = search_text.split("/").join("-");
  } else {
    searchValue = search_text;
  }

  const selector = document.getElementById("selector");
  const filter_value = selector.options[selector.selectedIndex].value;

  if (search_text) {
    // create a request
    const response = await fetch(
      `/notice/all-notice-list/filter/${filter_value}/${searchValue}`,
      {
        method: "POST",
      }
    );

    if (response.status === 200) {
      const result = await response.json();

      // clear background for new request
      for (let index = 1; index < maintable.children.length; index++) {
        maintable.children[index].getElementsByTagName(
          "tr"
        )[0].style.background = "none";
      }

      // update the data get from request
      for (let index = 1; index <= result.data.length; index++) {
        // create a table row
        const new_row = `
      
      <tbody>
        <tr>

          <th scope="row"> ${index}  </th>
          <td> ${result.data[index - 1].title} </td>
          <td> ${result.data[index - 1].date}</td>
          <td>
            <a class="view_link" href="/notice/${
              result.data[index - 1]._id
            }"> view </a>
          </td>

        </tr>
      </tbody>
      
      `;

        if (index > tablebody.length) {
          // Because we have found data more then
          // the table row
          break;
        } else {
          maintable.children[index].getElementsByTagName("tr")[0].innerHTML =
            new_row;

          maintable.children[index].getElementsByTagName(
            "tr"
          )[0].style.background = "#e1eefc";
        }
      }
    } else {
      FailureToast.showToast();
      Clear();
    }
  } else {
    alert("please write some text to search");
  }
}

// automatic type writing
document.addEventListener("DOMContentLoaded", function (e) {
  const text_to_type = document.getElementById("title").textContent;

  function typeWriter(text, index) {
    if (index < text.length) {
      document.querySelector("#title").innerHTML =
        text.substring(0, index + 1) +
        '<span class="character" aria-hidden="true"></span>';

      // delay for 200ms for every character
      setTimeout(() => {
        typeWriter(text_to_type, index + 1);
      }, 200);
    } else {
      // remove the fadedown
      document.querySelector("#child").classList.remove("fadedown");
      // add the fade up
      document.querySelector("#child").classList.add("fadeup");
    }
  }

  // start typewritiing
  typeWriter(text_to_type, 0);
});
