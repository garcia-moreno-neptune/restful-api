"use strict";
$(document).ready(() => {
    function Spinner(width = '100px') {
        return $('<div/>').css({
            borderTop: '3px solid #0CB1C4',
            borderLeft: '3px solid #0CB1C4',
            borderRadius: '50%',
            width,
            height: width,
            margin: '20px',
            animation: '0.4s ease-in-out 0s infinite normal none running spin'
        })
    }


// const putOptions = {
//     method: 'PUT',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(patchMovie)
// }
// const patchOptions = {
//     method: 'PATCH',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(patchMovie)
// }

    const postOptions = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }
    const deleteOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const URL = "https://delicate-wood-medusaceratops.glitch.me/movies"

    const getMovies = () => {

        $('#results').html('loading...')
        fetch(URL)
            .then(resp => resp.json()) // turns response into javascript object
            .then(movies => {
                setTimeout(() => {
                    $('#results').html('')
                    $('#results').append(movies.map(
                        movie => `<p class="card w-50 m-3 p-2">${movie.title} ${movie.id}</p> `
                        // movie => $('<p/>').text(movie.title)
                    ))
                }, 500)
                console.log(movies)
            })
    }

    function getFormData(form) {
        return Array.from(form.elements)
            .reduce((result, input) => {
                result[input.name] = input.value
                return result
            }, {})
    }


//===Edit movies
    $('#editMovie').click((e) => {
        e.preventDefault();
        let movieEdit = $('#edit-movie').val()
        console.log(movieEdit)
        let patchMovie = {
            title: `${movieEdit}`
        }
        const putOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patchMovie)
        }
        // let movieID = input.name = input.value;

        fetch(`${URL}/4`, putOptions).then(getMovies)

    })
// let newRating = $('#')


// JQuery method for running code after document loads
    $(() => {
        getMovies();
        $('#btn').click(getMovies);
        $('#submit').click(() => {
            const body = getFormData(document.forms.movieForm)
            fetch(
                URL,
                {
                    ...postOptions,
                    body: JSON.stringify(body),
                }
            )
                .then(getMovies)
                .catch(console.error)
        })

    })

//Delete movies
// fetch('https://delicate-wood-medusaceratops.glitch.me/movies/7', deleteOptions).then(getMovies);

});