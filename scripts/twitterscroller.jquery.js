(function($){
	var hash = location.hash.slice(1);
	var since_id;
	var loop = 0;
	var rateLimit = 5000;
	var urlRegexp = new RegExp("http://\\S*","gi");
	
	get_results = function(use_since){
		since_query = '';
		loop++;
		if(use_since){
			since_query = "&since="+since_id;
		}
		$.getJSON("twittersearch.php?s="+hash+since_query, function(data){
			for (var i = 0; i < data.results.length; i++) {
				tweet = data.results[i];
				
				if(i==0){
					since_id = tweet.id;
				}
				
				found_url = urlRegexp.exec(tweet.text);
				if(found_url != null) {
					found_url = found_url.toString();
					tweet.text = tweet.text.replace(found_url,"<a href='"+found_url+"'>"+found_url+"</a>");
				}
				
				temp = $('#jsTweets').prepend(""
					+"<li id='"+tweet.id+"'>"
					+"	<a href='http://twitter.com/"+tweet.from_user+"'><img src='"+tweet.profile_image_url+"' alt='"+tweet.from_user+"' class='avatar' height='48' width='48'></a>"
					+"	<p>"+tweet.text+"</p>"
					+"	<p>Via: <a href='http://twitter.com/"+tweet.from_user+">"+tweet.from_user+"</a>"
					+"</li>");
				
				$('#'+tweet.id).hide().fadeIn();
				
				if(loop > 1) {
					$('#jsTweets li:last-child').remove();
				}
			}
			
			if(data.results.length > 20){
				rateLimit = 5000;
			}else if(data.results.length > 10){
				rateLimit = 10000;
			}else if(data.results.length > 0){
				rateLimit = 30000;
			}else{
				rateLimit  +=1000;
			}
						
			setTimeout("get_results(true)",rateLimit);
		});
	}
	
	check_hash = function(){
		hash=location.hash.slice(1)
		setTimeout("check_hash()",2000)
	}
	
	get_results();
	check_hash();
	
})(jQuery);