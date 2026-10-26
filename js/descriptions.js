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
	var written_tweets = tweet_array.filter(function(tweet) {
		return tweet.written;
	});
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	// get the search box
	var searchBox = document.getElementById("textFilter");

	// run the function whenever the input changes
	searchBox.addEventListener("input", function() {
		// get the value of the text that is currently in the search box
		var searchText = searchBox.value;
		console.log(searchText);
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});