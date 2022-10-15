const FailureToast = Toastify({
  text: "Sorry! No Article found",
  duration: 2000,
});

// search related functionality
function Clear() {
  document.getElementById("search_text").value = "";
}

// search functionality for date & title
async function Search() {
  const search_text = document.getElementById("search_text").value;

  const selector = document.getElementById("selector");
  const filter_value = selector.options[selector.selectedIndex].value;

  if (search_text) {
    const response = await fetch(
      `/article/article-list/${filter_value}/${search_text}`,
      {
        method: "GET",
      }
    );

    if (response.status === 200) {
      const result = await response.json();

      // first clear the childreen of card-container
      const parent_card_div = document.querySelector(".card-container");

      while (parent_card_div.firstChild) {
        parent_card_div.removeChild(parent_card_div.lastChild);
      }

      for (let index = 0; index < result.data.length; index++) {
        const { articleImage, date, title, content, _id } = result.data[index];

        const BinaryImageData = articleImage.data["data"];
        let bytes = new Uint8Array(BinaryImageData);
        let binary = "";

        for (let index = 0; index < bytes.length; index++) {
          binary += String.fromCharCode(bytes[index]);
        }

        const card = `

      <a href="/article/${_id}">  
      <div class="article-card">
      <div class="article-card-header">
        <img
          src="data:image/${articleImage.contentType};base64,
          ${btoa(binary)}"
          alt="article-cover"
        />
      </div>
      <div class="card-details">
        <h4 class="article-title">${title}</h4>

        <p class="description">
          ${content.substr(0, 80)}
        </p>

        <div class="time">
          <p> ${date.split("/").join("-")}</p>
        </div>
      </div>
    </div>
    </a>

      `;

        parent_card_div.innerHTML += card;
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
