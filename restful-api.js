"use strict";



const getMovies = () => {
    fetch("https://delicate-wood-medusaceratops.glitch.me/movies")
        .then(resp => resp.json())
        .then(movies => {
            let htmlStr = ''
            for(let movie of movies)
                htmlStr += `<p>${movies.title}</p>`
            $('#results').html(htmlStr)
            console.log(movies)
            console.log(movies.title)
    })
}
getMovies();

$('#btn').click(getMovies());