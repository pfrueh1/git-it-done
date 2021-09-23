let IssueContainerEl = document.querySelector("#issues-container");
let limitWarningEl = document.querySelector("#limit-warning");
let repoNameEl = document.querySelector("#repo-name");

function displayWarning(repo) {
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    let linkEl = document.createElement("a");
    linkEl.textContent = "See more issues on Github.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
    //append to warning container
    limitWarningEl.appendChild(linkEl);
}

function getRepoName() {
    let queryString = document.location.search;
    //pull user and repo name from querystring
    let repoName = queryString.split("=")[1];
    //if reponame exists, feed name into text box and getrepoissues function
    if(repoName){
        getRepoIssues(repoName);
        repoNameEl.textContent = repoName;
    }else {
        //otherwise, redirect to homepage
        document.location.replace("./index.html");
    }
};

function getRepoIssues(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response) {
        //request was successful
        if (response.ok) {
            response.json().then(function(data){
                displayIssues(data);

                //check if api has paginated issues
                if ( response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        }else {
            document.location.replace("./index.html");
        }
    });
    
};

function displayIssues(issues){

    // if repo has no open issues
    if (issues.length === 0) {
        IssueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    for (var i = 0; i < issues.length; i++) {
        //create link element to take users to the issue on github
        let issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");
        //create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        // append to container
        issueEl.appendChild(titleEl);
        // create a type element
        let typeEl = document.createElement("span");
        //check if issue is an actual issue or pull request
        if (issues[i].pull_request){
            typeEl.textContent = "(Pull request)";
        }else {
            typeEl.textContent = "(Issue)";
        }
        //append to container
        issueEl.appendChild(typeEl);

        //append to page
        IssueContainerEl.appendChild(issueEl);
    }
};

getRepoName();