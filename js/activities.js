function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	// keep only tweets about completed activities
	var completed_tweets = tweet_array.filter(function(tweet) {
		return tweet.source == "completed_event";
	});

	// store the number of tweets for each activity type
	var activityCounts = {};

	// count how many times each activity appears
	for (var i = 0; i < completed_tweets.length; i++) {
		// get the type of activity of this completed tweet
		var activity = completed_tweets[i].activityType;
		
		// if it's the activity has not appeared yet, initialize the count to 1
		if (activityCounts[activity] == undefined) {
			activityCounts[activity] = 1;
		}
		// otherwise increment the count
		else {
			activityCounts[activity]++;
		}
	}

	// get the activity names and sort them by frequency
	var sortedActivities = Object.keys(activityCounts).sort(function(a, b) {
		return activityCounts[b] - activityCounts[a];
	});

	// create an array containing the activity types and their counts for the graph
	var activityData = [];

	for (var i = 0; i < sortedActivities.length; i++) {
		// get the name of the current activity
		var activity = sortedActivities[i];

		// add an object containing the activity name and its count to the array
		activityData.push({
			activityType: activity,
			count: activityCounts[activity]
		});
	}

	// display the total number of different activity types
	document.getElementById("numberActivities").innerText = sortedActivities.length;

	// display the three most popular activity types
	document.getElementById("firstMost").innerText = sortedActivities[0];
	document.getElementById("secondMost").innerText = sortedActivities[1];
	document.getElementById("thirdMost").innerText = sortedActivities[2];

	for (var i = 0; i < completed_tweets.length; i++) {
		if (completed_tweets[i].activityType == "in 31:00") {
			console.log(completed_tweets[i].text);
		}
	}

	console.log(sortedActivities);

	console.log(activityCounts);

	console.log(completed_tweets.length);

	for (var i = 0; i < 10; i++) {
		console.log(completed_tweets[i].activityType);
	} 

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityData
	  },
	  "mark": "bar",
	  "encoding": {
		"x": {
			"field": "activityType",
			"type": "nominal",
			// sort in descending order so it's easier to read
			"sort": "-y",
			"title": "Activity Type"
		},
		"y": {
			"field": "count",
			"type": "quantitative",
			"title": "Number of Tweets"
		}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	// keep only the completed tweets for the three most popular activities
	var topThreeTweets = completed_tweets.filter(function(tweet) {
				// run
		return (tweet.activityType == sortedActivities[0] ||
			   // walk
			   tweet.activityType == sortedActivities[1] ||
			   // bike
			   tweet.activityType == sortedActivities[2]) &&
			   // exclude distances of 0	  
			   tweet.distance > 0;
	});

	// create an array to store the data for the distance graphs
	var distanceData = [];

	for (var i = 0; i < topThreeTweets.length; i++) {
		// get the current tweet
		var tweet = topThreeTweets[i];

		// get the day of the week when that activity was done
		var day = tweet.time.toLocaleDateString("en-US", {
			weekday: "long"
		});

		// add an object containig the activity type, distance, and day to the array
		distanceData.push({
			activityType: tweet.activityType,
			distance: tweet.distance,
			day: day
		});
	}
	console.log(distanceData.slice(0, 10));
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});