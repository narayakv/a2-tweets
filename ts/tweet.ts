class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        }
        else if (this.text.startsWith("Watch my")) {
            return "live_event";
        }
        else if (this.text.startsWith("Achieved")) {
            return "achievement";
        }
        else {
            return "miscellaneous";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        // Noticed that if it is written, there is personal context after a -
        if (this.source != "completed_event") {
            return false;
        }
        
        return this.text.includes(" - ");
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        // get everything after the -
        let comment = this.text.split(" - ")[1];

        // remove the url and everything after it
        comment = comment.split("https://")[0];

        // remove extra spaces
        return comment.trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        
        // split tweet into individual words
        let words = this.text.split(" ");

        // check if the tweet includes a distance
        if (words[4] == "km" || words[4] == "mi") {
            // extract eveything after the distance which always starts at index 5
            // join combines them back into a single string
            let activity = words.slice(5).join(" ");

            // remove everything after the activity name
            activity = activity.split(" with ")[0];
            activity = activity.split(" - ")[0];

            // remove extra spaces before returning the activity
            return activity.trim();
        }

        // for tweets that don't have a distance
        let activity = words.slice(4).join(" ");

        // remove the duration, Runkeeper message, or personal comment
        activity = activity.split(" in ")[0];
        activity = activity.split(" with ")[0];
        activity = activity.split(" - ")[0];

        return activity.trim();    
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        
        // Split the tweet into individual words
        let words = this.text.split(" ");

        // extract the distance and conver to number
        let distance = parseFloat(words[3]);

        // convert km to mi
        if (words[4] == "km") {
            return distance * 0.621371;
        }
        else if (words[4] == "mi") {
            return distance;
        }

        // return 0 if the activity doesn't have a distance
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        // Extract the URL from the tweet
        let url = this.text.split("https://")[1];
        url = "https://" + url.split(" ")[0]

        // crete a table row containing the information
        let row = `
        <tr>
            <td>${rowNumber}</td>
            <td>${this.activityType}</td>
            <td><a href="${url}">${this.writtenText}</a></td>
        </tr>
        `;
        
        return row;
    }
}