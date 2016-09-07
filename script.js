$('#typeahead-input').typeahead({
  minLength: 3,
  items: 20,
  source: function (query, process) {
    var githubSearchAPI = "https://api.github.com/search/repositories?q=" + query + "&sort=stars&order=desc";

    console.log(githubSearchAPI);

    return $.ajax({
      url: githubSearchAPI,
      dataType: 'jsonp',

      success: function(results){
        var repo = results.data.items;
        console.log(repo);
        return process(repo);
      }
    });
  }
});