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
  },
  afterSelect: function (repo) {
    console.log(repo);
    var repoName = repo.name;
    var userName = repo.owner.login;

    $(".repo").toggleClass("hidden");

    $("#repo-name").text(repoName);

    var date = new Date();
    var formatDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    var githubIssuesAPI = "https://api.github.com/search/issues?q=state:open+repo:" + repoName + "type:issue+user:" + userName + "+created:" + formatDate + "&sort=created&order=asc";

    console.log(githubIssuesAPI);

    $.ajax({
      url: githubIssuesAPI,
      dataType: 'jsonp',

      success: function (results) {
        var issues = results.data.items;
        console.log(issues.length);

        if (issues.length != 0) {
          $("#issues-list").html("");
          for (var i=0; i<issues.length; i++) {
            var issue = issues[i];
            console.log(issue.title);

            $("#issues-list").append("<li>"+issue.title+"</li>");
          }
        } else {
          $("#issues-list").html("").append("<li>No Issues for Today</li>");
        }

        $("#issues-list").on("click", "li", function () {
          var id = $(this).index();
          var issue = issues[id];
          console.log(issue);

          $(".search, .repo, .issue").toggleClass("hidden");

          $("#issue-title").text(issue.title);
          $("#issue-description").text(issue.body);
          if (issue.labels != 0) {
            $("#issue-labels").html("");
            for (var i=0; i<issue.labels.length; i++) {
              var label = issue.labels[i];
              console.log(label.name);

              if(i == issue.labels.length - 1) {
                $("#issue-labels").append(label.name);
              } else {
                $("#issue-labels").append(label.name+", ");
              }
            }
          } else {
            $("#issue-labels").html("").append("No Labels");
          }

          var user = issue.user;
          console.log(user);
          $("#issue-creator").attr("src", user.avatar_url);
        });
      }
    });

  }
});