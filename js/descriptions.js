// store the user-written tweets so both functions can access them
var written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	// convert the data into objects of the Tweet class
	// map creates a new array using the return value of the funtcion
	// for each element
	var tweet_array = runkeeper_tweets.map(function(item) {
		return new Tweet(item.text, item.created_at);
	});
	
	// keep only the tweets that contain user-written text
	written_tweets = tweet_array.filter(function(tweet) {
		return tweet.written;
	});
}

function addEventHandlerForSearch() {
	// get the search box
	var searchBox = document.getElementById("textFilter");

	// run the function whenever the input changes
	searchBox.addEventListener("input", function() {
		// get the value of the text that is currently in the search box
		var searchText = searchBox.value;

		// create an array to store tweets that match the search
		var matchingTweets = [];

		// check each user-written tweet for the search text
		for (var i = 0; i < written_tweets.length; i++) {
			// check searchText == "" because JS considers every string to contain an empty string
			if (searchText !== "" && written_tweets[i].writtenText.toLowerCase().includes(searchText.toLowerCase())) {
				matchingTweets.push(written_tweets[i]);
			}
		}
		// Update the number of matching tweets displayed on the page
		document.getElementById("searchCount").innerText = matchingTweets.length;
		//update the search text displayed as it is typed
		document.getElementById("searchText").innerText = searchText;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});