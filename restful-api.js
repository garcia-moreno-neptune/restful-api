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
//Array.from turns a list of DOM elements into an array => allows reduce
function getFormData(form) {
    // without reduce
    // const result = {}
    // for(let i = 0; i<form.elements.length; i++) {
    //     const input = form.elements[i]
    //     result[input.name] = input.value
    // }
    // return result
    return Array.from(form.elements)
        // result (what its going to get reduced to) input(item in the array) , {} second parameter is the default value for the result
        //getting input from the form to turn into a JSON object

        // input is a dom element because we are reducing the form elements // to a single object item  with multiple properties
        .reduce((result, input) => {
            // const result = {}
            // const inputName = 'some name'
            // result[inputName] = 5
            // result will now be { 'some name': 5 }
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
// Radio({
//     name: 'rating',
//     icon: 'fa-star',
//     defaultValue: 1,
//     length: 5
// })
function Radio({name, length, icon, defaultValue}) {
    const container = $('<div/>').css({
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between'
    })
    // single value input so that the form only takes in one input
    const hiddenInput = $('<input type="hidden"/>').attr({
        name,
        value: defaultValue
    })

    function updateButtons() {
        // use form input to update all of the icons
        const value = parseInt(hiddenInput.val())
        const children = container.children().not("input");
        for (let i = 0; i < children.length; i++) {
            // eq method gets child element at the index
            const button = children.eq(i);
            const id = i + 1
            if(id <= value) {
                button.addClass('checked');
            } else {
                button.removeClass('checked');
            }
        }
    }

    function RadioButton(id) {
        return $('<i/>').click(() => {
            // setting the value of the id to the radio button
            hiddenInput.val(id)
            updateButtons()
            container.change()
        }).css({cursor: 'pointer'}).addClass('fa ' + icon)
    }
    container.append(hiddenInput)
    for(let i = 1; i<=length; i++) {
        container.append(RadioButton(i))
    }
    updateButtons()
    return container
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

// deleteMovie function takes in an ID
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

        const editMovie = debounce(edit);
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
                Radio({
                    name: 'rating',
                    icon: 'fa-star',
                    defaultValue: rating,
                    length: 5
                }).change(handleInput),
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