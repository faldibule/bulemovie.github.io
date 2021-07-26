//function pendukung
function getMovies(movies) {
  return `
  <div class="col-md-4 my-5">
    <div class="card" data-aos="fade-right">
      <img class="card-img-top" src="${movies.Poster}" />
      <div class="card-body">
        <h5 class="card-title">${movies.Title}</h5>
        <h6 class="text-muted">${movies.Year}</h6>
        <a href="#" data-toggle="modal" data-target="#exampleModal" class="btn btn-primary see-detail" data-id = "${movies.imdbID}">Show Detail</a>
      </div>
    </div>
  </div>`;
}

function getMoviesById(result) {
  return `
  <div class="container-fluid">
    <div class="row">
        <div class="col-md-4">
            <img class="img-fluid" src="${result.Poster}">
        </div>
        <div class="col-md-8">
        <ul class="list-group">
            <li class="list-group-item"><h3>${result.Title} </h3></li>
            <li class="list-group-item">Released : ${result.Released}</li>
            <li class="list-group-item">Genre : ${result.Genre}</li>
            <li class="list-group-item">Actor : ${result.Actors}</li>
            <li class="list-group-item">Writer : ${result.Writer}</li>
        </ul>
        </div>
    </div>
  </div>
  `;
}

// Menggunakan Fetch
// function searchWithFetch() {
//   const searchKey = document.querySelector("#search-input").value;
//   fetch("http://www.omdbapi.com/?apikey=1200a74c&s=" + searchKey)
//     .then((res) => res.json())
//     .then((result) => {
//       let isi = "";
//       result.Search.forEach((movies) => (isi += getMovies(movies)));
//       const movieList = document.querySelector("#movie-list");
//       movieList.innerHTML = isi;

//       //get show detail
//       const seeDetail = document.querySelectorAll(".see-detail");
//       seeDetail.forEach((movie) => {
//         movie.addEventListener("click", function () {
//           const filmId = this.dataset.id;
//           fetch("http://www.omdbapi.com/?apikey=1200a74c&i=" + filmId)
//             .then((res) => res.json())
//             .then((result) => {
//               const modalBody = document.querySelector(".modal-body");
//               modalBody.innerHTML = getMoviesById(result);
//             });
//         });
//       });
//     });
// }

//refactoring(memperbaiki) menjadi lebih modular
//get movie by Search
function getFetch(keyword) {
  return fetch("https://www.omdbapi.com/?apikey=1200a74c&s=" + keyword)
    .then((res) => {
      //membuat error jika fetchnya gagal
      if (!res.ok) {
        throw new Error(res.statusText);
      } else {
        return res.json();
      }
    })
    .then((result) => {
      //membuat error jika film tidak ditemukan
      //karena respone dari APInya adalah string, maka bisa dikondisikan seperti berikut
      if (result.Response === "False") {
        throw new Error(result.Error);
      } else {
        return result;
      }
    });
}

//mengambil hasil fetch
async function searchWithFetch() {
  try {
    const searchKey = document.querySelector("#search-input").value;
    const isi = await getFetch(searchKey);
    fillMovieList(isi);
  } catch (e) {
    alert(e);
  }
}

// mengisi movie list
function fillMovieList(result) {
  let isi = "";
  result.Search.forEach((movies) => (isi += getMovies(movies)));
  const movieList = document.querySelector("#movie-list");
  movieList.innerHTML = isi;
}

//when button clicked
const searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", function () {
  searchWithFetch();
});

//when enter pressed
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("keyup", function (e) {
  if (e.which === 13) {
    searchWithFetch();
  }
});



//show detail
//show detail
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("see-detail")) {
    const filmId = e.target.dataset.id;
    fillShowDetail(filmId);
  }
});

//get movie by id (untuk show detail)
function getFetchById(filmId) {
  return fetch("https://www.omdbapi.com/?apikey=1200a74c&i=" + filmId)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      } else {
        return res.json();
      }
    })
    .then((result) => {
      if (result.Response === "False") {
        throw new Error(res.statusText);
      } else {
        return result;
      }
    });
}

//mengisi modal body
async function fillShowDetail(filmId) {
  try {
    const result = await getFetchById(filmId);
    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = getMoviesById(result);
  } catch (e) {
    alert(e)
  }
}


//proses yang sama Menggunakan JQUERY
//search
// function search() {
//   $("#movie-list").html("");
//   $.ajax({
//     url: "http://www.omdbapi.com",
//     type: "get",
//     dataType: "json",
//     data: {
//       apikey: "1200a74c",
//       s: $("#search-input").val(),
//     },
//     success: (result) => {
//       if (result.Response == "True") {
//         console.log(result.Search);
//         let isi = "";
//         result.Search.forEach((movies) => {
//           isi += getMovies(movies);
//         });
//         $("#movie-list").append(isi);
//       } else {
//         $("#movie-list").html(`
//         <div class="col">
//             <h1 class="text-center">${result.Error}</h1>
//         </div>`);
//       }
//     },
//     error: (e) => {
//       console.log(e.responseText);
//     },
//   });
// }

// //movie detail
// $("#movie-list").on("click", ".see-detail", function () {
//   $.ajax({
//     url: "http://www.omdbapi.com",
//     type: "get",
//     dataType: "json",
//     data: {
//       apikey: "1200a74c",
//       i: $(this).data("id"),
//     },
//     success: (result) => {
//       if (result.Response == "True") {
//         $(".modal-body").html(getMoviesById(result));
//       } else {
//       }
//     },
//   });
// });

// //search by button click
// $("#search-button").on("click", function () {
//   console.log($("#movie-list").val());
//   search();
// });

// //search by enter press
// $("#search-input").on("keyup", function (e) {
//   if (e.which === 13) {
//     search();
//   }
// });