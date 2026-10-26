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

	// create a graph for activity distances by day of the week
	distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  	"description": "A graph of the distances of the three most popular activities by day of the week.",
	  	"data": {
	    	"values": distanceData
	  	},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
				"sort": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
				"title": "Day of the Week"
			},
			"y": {
				"field": "distance",
				"type": "quantitative",
				"title": "Distance (miles)"
			},
			"color": {
				"field": "activityType",
				"type": "nominal",
				"title": "Activity Type"
			}
		}
	};

	distance_vis_aggregated_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  	"description": "A graph of the distances of the three most popular activities by day of the week.",
	  	"data": {
	    	"values": distanceData
	  	},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
				"sort": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
				"title": "Day of the Week"
			},
			"y": {
				"field": "distance",
				"type": "quantitative",
				"aggregate": "mean",
				"title": "Mean Distance (miles)"
			},
			"color": {
				"field": "activityType",
				"type": "nominal",
				"title": "Activity Type"
			}
		}
	};

	// display the distance graph
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	// display the graph of the aggregate activity distances
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});

	// hide the mean distance graph so we can use the button
	document.getElementById("distanceVisAggregated").style.display = "none";

	// get the button and the two graph containers
	var aggregateButton = document.getElementById("aggregate");
	var distanceGraph = document.getElementById("distanceVis");
	var meanGraph = document.getElementById("distanceVisAggregated");

	// switch between the two graphs
	aggregateButton.addEventListener("click", function() {
		if (meanGraph.style.display == "none") {
			// show the mean graph and hide the individual distnaces graph
			distanceGraph.style.display = "none";
			meanGraph.style.display = "block";
			aggregateButton.innerText = "Show all activities";
		}
		else {
			// show the individual distances graph and hide the mean graph
			meanGraph.style.display = "none";
			distanceGraph.style.display = "block";
			aggregateButton.innerText = "Show means";
		}
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});