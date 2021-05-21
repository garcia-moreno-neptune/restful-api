# Movie API
Personal database that houses and allows a user to edit  movies watched, plot, genre, personal rating and more. Utilizes pair programming, HTML, CSS, Javascript, JQuery (Ajax) and JSON databases.
## Features
### Edit function()
````javascript
    function edit(id, data) {
        console.log({id, data});
        return $.ajax({
            url: `${URL}/${id}`,
            type: 'PATCH',
            data
        })
    }
````
- allows the user to edit their favorite movies and add to their list.
### add movies function()
```javascript
 function createMovie(body) {
        return $.post(URL, body).then(loadMovies);
    }
```
### delete function()
```javascript
  function deleteMovie(id) {
    return $.ajax({
        url: `${URL}/${id}`,
        type: 'DELETE'
    }).then(loadMovies)
}
```
### Search 
```javascript
 function filterMovies() {
        const input = $(this).val()
        const matching = allMovies.filter(movie => {
            return movie.title.toLowerCase().includes(input.toLowerCase())
        })
        showMovies(matching)
    }
```
- Filters out movies base on user input
- debounced so that in only runs when the user is finished typing

### Radio Input  
```javascript
 Radio({
     name: 'rating',
     icon: 'fa-star',
     defaultValue: 1,
     length: 5
 })
```

