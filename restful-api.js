"use strict";

// HELPER FUNCTIONS
// Every time the debounced function is called it resets the timer
function debounce(func, wait=700, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function getFormData(form) {
    return Array.from(form.elements)
        .reduce((result, input) => {
            result[input.name] = input.value
            return result
        }, {})
}

// Custom components
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
// made radio function to generate radio inputs for a given value and input
function Radio(value, input) {
    return $('<input name="rating" type="radio"/>')
        .attr({
            value,
            checked: ''+input === ''+value
        })
}

const URL = "https://spurious-power-march.glitch.me/movies"
let allMovies = []

// wait for document elements to load before running code
$(document).ready(() => {
    const results = $("#results")
// function create movie uses jQuery Post method to add a new movie
    function createMovie(body) {
        return $.post(URL, body).then(loadMovies);
    }
// edit function takes in id and data to add to the data using the jQuery ajax patch
    function edit(id, data) {
        console.log({id, data});
        return $.ajax({
            url: `${URL}/${id}`,
            type: 'PATCH',
            data
        })
    }
    //
    const editMovie = debounce(edit)
// deleteMovie function takes in an ID and uses
    function deleteMovie(id) {
        return $.ajax({
            url: `${URL}/${id}`,
            type: 'DELETE'
        }).then(loadMovies)
    }

    // Movie takes in data that represents a movie json object
    // the parameters are destructured in the when passed to the function
    // returns the data objects inside a form to display the cards for each movie
    function MovieCard({id, poster, title, genre, plot, rating}) {
        const formId = `movie-form-${id}`
        // the function handleInput takes in the data from the form Id
        // calls edit movie with the id of the movie and the data from the form
        function handleInput() {
            const data = getFormData(document.forms[formId])
            // editMovie is debounced so that it is only called once within a set time
            editMovie(id, data)
        }
        return $('<form class="movie"/>').data('title', title).attr({id: formId}).append(
            // the ?? is null coalescing
            // meaning it uses what comes after ?? if no value is present
            $('<img alt="coming soon"/>').attr({src: poster ?? './comingsoon.jpg'}),
            $('<div class="field"/>').append(
                $('<label/>').text('Rating: '),
                Radio(1, rating).click(handleInput),
                Radio(2, rating).click(handleInput),
                Radio(3, rating).click(handleInput),
                Radio(4, rating).click(handleInput),
                Radio(5, rating).click(handleInput),
            ),
            $('<div class="field"/>').append(
                $('<label/>').text('Title: '),
                $('<input name="title"/>').val(title).keyup(handleInput)
            ),
            $('<div class="field"/>').append(
                $('<label/>').text('Genre: '),
                $('<input name="genre"/>').val(genre).keyup(handleInput)
            ),
            $('<label/>').text('Plot: '),
            $('<textarea name="plot"/>').val(plot).keyup(handleInput),
            $('<div class="footer"/>').append(
                $('<i class="fa fa-trash fa-2x"/>').click(() => deleteMovie(id))
            ),
        )
    }

    function showMovies(movies) {
        results.html('')
        results.append(
            movies.map(function(movie) {
                return MovieCard(movie)
            })
        )
    }

    function loadMovies() {
        results.html(Spinner())
        return $.get(URL)
            .then(data => {
                // reverse data so that newest movie is shown first
                const movies = data.reverse()
                allMovies = movies
                showMovies(movies)
                console.log(movies)
            });
    }

    function filterMovies() {
        const input = $(this).val()
        const matching = allMovies.filter(movie => {
            return movie.title.toLowerCase().includes(input.toLowerCase())
        })
        showMovies(matching)
    }

    const searchMovies = debounce(filterMovies)
    loadMovies()
    $("#search").keyup(searchMovies)
    $('#submit').click(() => {
        createMovie(getFormData(document.forms.movieForm))
    })
    $('#add').click(() => {
        createMovie({})
    })
// fetch('https://spurious-power-march.glitch.me/movies/7', deleteOptions).then(getMovies);
});