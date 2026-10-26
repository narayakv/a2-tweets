function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	// start with the date of the first tweet
	var firstDate = tweet_array[0].time;
	var lastDate = tweet_array[0].time;

	// find the earliest and latest tweet dates
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].time < firstDate) {
			firstDate = tweet_array[i].time;
		}

		if (tweet_array[i].time > lastDate) {
			lastDate = tweet_array[i].time;
		}
	}

	// create an object for formatting
	var dateOptions = {
		// full weekday name
		weekday: "long",
		// full numeric year like 2026
		year: "numeric",
		// full month name
		month: "long",
		// day of the month like 26
		day: "numeric"
	};

	// update the html file with the earliest and latest dates
	document.getElementById("firstDate").innerText =
		firstDate.toLocaleDateString("en-US", dateOptions);

	document.getElementById("lastDate").innerText =
		lastDate.toLocaleDateString("en-US", dateOptions);


	// counters for each tweet category
	var completedEvents = 0;
	var liveEvents = 0;
	var achievements = 0;
	var miscellaneous = 0;

	// loop through all tweets and count each category
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source == "completed_event") {
			completedEvents++;
		}
		else if (tweet_array[i].source == "live_event") {
			liveEvents++;
		}
		else if (tweet_array[i].source == "achievement") {
			achievements++;
		}
		else {
			miscellaneous++;
		}
	}

	// update the html file with the number of tweets in each category
	document.querySelector(".completedEvents").innerText = completedEvents;
	document.querySelector(".liveEvents").innerText = liveEvents;
	document.querySelector(".achievements").innerText = achievements;
	document.querySelector(".miscellaneous").innerText = miscellaneous;


	// calculate and display the percentage of tweets in each category
	document.querySelector(".completedEventsPct").innerText =
		math.format(completedEvents / tweet_array.length * 100, {notation: "fixed", precision: 2}) + "%";

	document.querySelector(".liveEventsPct").innerText =
		math.format(liveEvents / tweet_array.length * 100, {notation: "fixed", precision: 2}) + "%";

	document.querySelector(".achievementsPct").innerText =
		math.format(achievements / tweet_array.length * 100, {notation: "fixed", precision: 2}) + "%";

	document.querySelector(".miscellaneousPct").innerText =
		math.format(miscellaneous / tweet_array.length * 100, {notation: "fixed", precision: 2}) + "%";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});