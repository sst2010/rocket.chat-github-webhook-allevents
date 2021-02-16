/**
 * GH-IW All Events WatchDog
 * - Slug: GHIW-AEW
 * - Webhook integration script: Rocket.Chat <--> GitHub
 *
 * - Rocket.Chat WebHook Configuration:
 *   - Name: GH-IW All Events WatchDog
 *   - Post to Channel: #gh-iw-unknown-events-watchdog
 *   - Post as: gh.watchdog
 *   - Alias: GitHub WatchDog
 *   - Avatar URL: 
 *   - Emoji: :eyes:
 *
 * - Author: Samagra Singh Tomar
 * - Mail: samagrasinghtomar2010@gmail.com
 *
 * All rights reserved. © Copyright since Jan. 2021.
 */

String. prototype. capitalizeFirstLetter = function ()
{
	return this. charAt ( 0 ). toUpperCase () + this . slice ( 1 ) ;
}

var getLabelsField = function ( labels )
{
	let labelsArray = [] ;
	labels. forEach ( function ( label )
	{
		labelsArray. push ( label. name ) ;
	} ) ;
	labelsArray = labelsArray. join (", ") ;
	return {
		title: "Labels",
		value: labelsArray,
		short: labelsArray.length <= 40
	} ;
} ;

var githubEvents =
{
	/**
	 * Ping Event
	 * Target Channel: #gh-iw-unknown-events-watchdog
	 */
	"ping": function ( request )
	{
		var event = request. headers ["x-github-event"] ;
		var deliveryID = request. headers ["x-github-delivery"] ;
		var hookID = request. headers ["x-github-hook-id"] ;
		var action = request. content. action ;
		var payload = JSON. parse ( JSON. stringify ( request. content ) ) ;
		payload ["ghwd-headers"] = JSON. parse ( JSON. stringify ( request. headers || {} ) ) ;

		var zen = request. content. zen ;

		if ( request. content. sender !== undefined )
		{
			var username = request. content. sender. login ;
			var userAvatar = request. content. sender. avatar_url ;
			var userURL = request. content. sender. html_url ;
		}

		if ( request. content. repository !== undefined )
		{
			var repoName = request. content. repository. name ;
			var repoFullName = request. content. repository. full_name ;
			var repoURL = request. content. repository. html_url ;
		}

		var text = "" ;
		var attachmentText = "" ;

		text += "Looks like I'm about to receive an update. Yay !!!! :heart_eyes: :zany_face: Or, you're just messing with me. :face_with_raised_eyebrow: :face_with_symbols_over_mouth:" ;
		text += "\r\nBTW, those asshole bots at GitHub sent some shitty `\"zen\"` as well. Something like `" + zen + "`" ;
		text += "\r\n\r\nAnyways, toodles. Have a great fucking day & bring me that update soon, bitch !!" ;

		if ( repoFullName !== undefined && repoURL !== undefined )
		{
			attachmentText += "###### [**" + repoFullName + "**](" + repoURL + ")" ;
		}
		else if ( repoFullName !== undefined )
		{
			attachmentText += "###### **" + repoFullName + "**" ;
		}
		else if ( repoURL !== undefined )
		{
			attachmentText += "###### [**Unknown Repository**](" + repoURL + ")" ;
		}

		if ( username !== undefined && userURL !== undefined )
		{
			attachmentText += "\r\n[_" + username + "_](" + userURL + ")" ;
		}
		else if ( username !== undefined )
		{
			attachmentText += "\r\n_" + username + "_" ;
		}
		else if ( userURL !== undefined )
		{
			attachmentText += "\r\nAn [_unknown user_](" + userURL + ")" ;
		}
		else
		{
			attachmentText += "An unknown user" ;
		}
		attachmentText += " triggered `" + event + "` event with `" + action + "` action." ;

		attachmentText += "\r\n\r\n**`JSON Payload with headers:`**" ;
		attachmentText += "\r\n```json; " + Script. webhookSlug + "--" + hookID + "---" + deliveryID + ".json; JSON payload received from the GitHub webhook with headers added by the WatchDog;\r\n" + JSON. stringify ( payload, null, 2 ) + "\r\n```" ;

		var message = {
			"content":
			{
				"channel": Script. recipients. unknown,
				"text": text,
				"attachments":
				[
					{
						"text": attachmentText,
						"thumb_url": userAvatar,
						"fields": []
					}
				]
			}
		} ;

		console. log ( Script. webhookSlug + "> Processed message for hook with hookID: " + hookID + ", deliveryID: " + deliveryID + " & event: " + event ) ;
		console. log ( message ) ;
		return  message ;
	},

	/**
	 * Issue Events
	 * Target Channel: #gh-iw-major-events-watchdog
	 */
	/*"issues": function ( request )
	{
		var user = request.content.sender ;

		if (request.content.action == "opened" || request.content.action == "reopened" || request.content.action == "edited")
		{
				var body = request.content.issue.body ;
		} else if (request.content.action == "labeled")
		{
				var body = "Current labels: " + getLabelsField(request.content.issue.labels).value ;
		} else if (request.content.action == "assigned" || request.content.action == "unassigned")
		{
				// Note that the issues API only gives you one assignee.
				var body = "Current assignee: " + request.content.issue.assignee.login ;
		} else if (request.content.action == "closed")
		{
				if (request.content.issue.closed_by)
				{
						var body = "Closed by: " + request.content.issue.closed_by.login ;
				} else
				{
						var body = "Closed." ;
				}
		} else
		{
				return {
					error:
					{
						success: false,
						message: 'Unsupported issue action'
					}
				} ;
		}

		var action = request.content.action.capitalizeFirstLetter() ;

		var text = '_' + request.content.repository.full_name + '_\n' +
								'**[' + action + ' issue ​#' + request.content.issue.number +
								' - ' + request.content.issue.title + '](' +
								request.content.issue.html_url + ')**\n\n' +
								body ;

		return {
			content:
			{
				attachments: [

					 {
								thumb_url: user.avatar_url,
								text: text,
								fields: []
						}
				]
			}
		} ;
	},*/

	/**
	 * Pull Request Events
	 * Target Channel: #gh-iw-major-events-watchdog
	 */
	/*"pull_request": function ( request )
	{
		var user = request.content.sender ;

		if (request.content.action == "opened" || request.content.action == "reopened" || request.content.action == "edited" || request.content.action == "synchronize")
		{
			var body = request.content.pull_request.body ;
		} else if (request.content.action == "labeled")
		{
				var body = "Current labels: " + getLabelsField(request.content.pull_request.labels).value ;
		} else if (request.content.action == "assigned" || request.content.action == "unassigned")
		{
				// Note that the issues API only gives you one assignee.
				var body = "Current assignee: " + request.content.pull_request.assignee.login ;
		} else if (request.content.action == "closed")
		{
				if (request.content.pull_request.merged)
				{
						var body = "Merged by: " + request.content.pull_request.merged_by.login ;
				} else
				{
						var body = "Closed." ;
				}
		} else
		{
				return {
					error:
					{
						success: false,
						message: 'Unsupported pull request action'
					}
				} ;
		}

		var action = request.content.action.capitalizeFirstLetter() ;

		var text = '_' + request.content.repository.full_name + '_\n' +
								'**[' + action + ' pull request ​#' + request.content.pull_request.number +
								' - ' + request.content.pull_request.title + '](' +
								request.content.pull_request.html_url + ')**\n\n' +
								body ;

		return {
			content:
			{
				attachments: [

					 {
								thumb_url: user.avatar_url,
								text: text,
								fields: []
						}
				]
			}
		} ;
	},*/

	/**
	 * Issue Comment Events
	 * Target Channel: #gh-iw-minor-events-watchdog
	 */
	/*issue_comment(request)
	{
		var user = request.content.comment.user ;

		if (request.content.action == "edited")
		{
				var action = "Edited comment " ;
		} else
		{
				var action = "Comment "
		}

		var text = '_' + request.content.repository.full_name + '_\n' +
								'**[' + action + ' on issue ​#' + request.content.issue.number +
								' - ' + request.content.issue.title + '](' +
								request.content.comment.html_url + ')**\n\n' +
								request.content.comment.body ;

		return {
			content:
			{
				attachments: [

					 {
								thumb_url: user.avatar_url,
								text: text,
								fields: []
						}
				]
			}
		} ;
	},*/

	/**
	 * Push Events
	 * Target Channel: #gh-iw-minor-events-watchdog
	 */
	/*push(request)
	{
		var commits = request.content.commits ;
		var multi_commit = ""
		var is_short = true ;
		var changeset = 'Changeset' ;
		if ( commits.length > 1 )
		{
			var multi_commit = " [Multiple Commits]" ;
			var is_short = false ;
			var changeset = changeset + 's' ;
			var output = [] ;
		}
		var user = request.content.sender ;

		var text = '**Pushed to ' + "["+request.content.repository.full_name+"]("+request.content.repository.url+"):"
								+ request.content.ref.split('/').pop() + "**\n\n" ;

		for (var i = 0; i < commits.length; i++)
		{
			var commit = commits[i] ;
			var shortID = commit.id.substring(0,7) ;
			var a = '[' + shortID + '](' + commit.url + ') - ' + commit.message ;
			if ( commits.length > 1 )
			{
				output.push( a ) ;
			} else
			{
				var output = a ;
			}
		}

		if (commits.length > 1)
		{
			text += output.reverse().join('\n') ;
		} else
		{
			text += output ;
		}

		return {
			content:
			{
				attachments: [

					 {
								thumb_url: user.avatar_url,
								text: text,
								fields: []
						}
				]
			}
		} ;
	},*/

	/**
	 * Commit Comment Events
	 * Target Channel: #gh-iw-minor-events-watchdog
	 */
	/*commit_comment(request)
	{
		var user = request.content.comment.user ;

		if (request.content.action == "edited")
		{
				var action = "Edited comment " ;
		} else
		{
				var action = "Comment "
		}

		var text = '_' + request.content.repository.full_name + '_\n' +
								'**[' + action + ' on commit id ' + request.content.comment.commit_id +
								' - ' +  + '](' +
								request.content.comment.html_url + ')**\n\n' +
								request.content.comment.body ;

		return {
			content:
			{
				attachments: [

					 {
								thumb_url: user.avatar_url,
								text: text,
								fields: []
						}
				]
			}
		} ;
	},*/

	/**
	 * Release Events
	 * Target Channel: #gh-iw-releases-watchdog
	 */
	"release": function ( request )
	{
		var event = request. headers ["x-github-event"] ;
		var deliveryID = request. headers ["x-github-delivery"] ;
		var hookID = request. headers ["x-github-hook-id"] ;
		var action = request. content. action ;
		var payload = JSON. parse ( JSON. stringify ( request. content ) ) ;
		payload ["ghwd-headers"] = JSON. parse ( JSON. stringify ( request. headers || {} ) ) ;

		if ( request. content. sender !== undefined )
		{
			var username = request. content. sender. login ;
			var userAvatar = request. content. sender. avatar_url ;
			var userURL = request. content. sender. html_url ;
		}

		if ( request. content. repository !== undefined )
		{
			var repoName = request. content. repository. name ;
			var repoFullName = request. content. repository. full_name ;
			var repoURL = request. content. repository. html_url ;
		}

		if ( request. content. release !== undefined )
		{
			var tagName = request. content. release. tag_name ;
			var tagBranch = request. content. release. target_commitish ;
			var releaseName = request. content. release. name ;
			var releaseDescription = request. content. release. body ;
			var draftStatus = request. content. release. draft ;
			var prereleaseStatus = request. content. release. prerelease ;
			var releaseURL = request. content. release. html_url ;
			var releaseZIPURL = repoURL + "/archive/" + tagName + ".zip" ;
			var releaseAssets = request. content. release. assets || [] ;
				// browser_download_url
				// name
				// label
				// size
				// content_type
				// state
		}

		var text = "" ;
		var attachmentText = "" ;

		if ( ( action === "released" || action === "prereleased" || action === "edited" || action === "deleted" ) && draftStatus === false )
		{
			text += "###" ;
			if ( action === "deleted" )
			{
				text += " Release for"
			}
			text += " `" + tagName + "` was just " + action + " for" ;
			if ( repoName !== undefined && repoURL !== undefined )
			{
				text += " [**" + repoName + "**](" + repoURL + ")" ;
			}
			else if ( repoName !== undefined )
			{
				text += " **" + repoName + "**" ;
			}
			else if ( repoURL !== undefined )
			{
				text += " [**Unknown Repository**](" + repoURL + ")" ;
			}
			else
			{
				text += " an unknown repository" ;
			}

			text += "\r\n- The action was made by" ;
			if ( username !== undefined && userURL !== undefined )
			{
				text += " [_" + username + "_](" + userURL + ")" ;
			}
			else if ( username !== undefined )
			{
				text += " _" + username + "_" ;
			}
			else if ( userURL !== undefined )
			{
				text += " an [_unknown user_](" + userURL + ")" ;
			}
			else
			{
				text += " an unknown user" ;
			}
			text += " on the `" + tagBranch + "` branch." ;
			if ( action === "released" )
			{
				text += "\r\n- You can check out the release & it’s details below along with a couple quick links." ;
			}
			else if ( action === "prereleased" )
			{
				text += "\r\n- This is an internal pre-release. We recommend you to not review it unless explicitly requested by the developers." ;
				text += "\r\n  - This message is merely to keep you posted with internal developments." ;
				text += "\r\n- You can check out the release & it’s details below along with a couple quick links." ;
			}
			else if ( action === "edited" )
			{
				text += "\r\n- The details of this release had to be updated. Please ignore any other messages received previously about this release. Our apologies for any inconveniences caused." ;
				text += "\r\n- You can check out the release & it’s details below along with a couple quick links." ;
			}
			else if ( action === "deleted" )
			{
				text += "\r\n- This release had to be deleted." ;
				text += "\r\n  - Someone from the team will either create another release to replace this one or reach out to you & explain re. the reason for this release not being needed any longer." ;
			}
			text += "\r\n- Feel free to contact the developers in case of any queries. Have a great day !!" ;

			if ( action !== "deleted" )
			{
				if ( releaseName !== undefined && releaseURL !== undefined )
				{
					text += "\r\n\r\n#### [**" + releaseName + "**](" + releaseURL + ")" ;
				}
				else if ( releaseName !== undefined )
				{
					text += "\r\n\r\n#### **" + releaseName + "**" ;
				}
				else if ( releaseURL !== undefined )
				{
					text += "\r\n\r\n#### [**An Unnamed Release**](" + releaseURL + ")" ;
				}
				else
				{
					text += "\r\n\r\n#### An Unnamed Release" ;
				}

				if ( repoFullName !== undefined && repoURL !== undefined )
				{
					text += "\r\n[**" + repoFullName + "**](" + repoURL + ")" ;
				}
				else if ( repoFullName !== undefined )
				{
					text += "\r\n**" + repoFullName + "**" ;
				}
				else if ( repoURL !== undefined )
				{
					text += "\r\n[**Unknown Repository**](" + repoURL + ")" ;
				}
				else
				{
					text += "\r\nAn unknown repository" ;
				}
				text += ", `" + tagName + ":::" + tagBranch + "`" ;

				text += "\r\n\r\n###### **Release description is as below:**" ;
				text += "\r\n\r\n" + releaseDescription ;

				text += "\r\n\r\n###### **Downloadable assets:**" ;
				text += "\r\n- [" + repoName + " `" + tagName + "`](" + ( ( releaseZIPURL === undefined ) ? releaseURL : releaseZIPURL ) + ") ( ZIP of the released source )" ; ;
				for ( var count1 = 0; count1 < releaseAssets. length; count1 += 1 )
				{
					// browser_download_url
					// name
					// label
					// size
					// content_type
					// state
					var size = undefined ;
					if ( releaseAssets [ count1 ]. size < 1024 )
					{
						size = ( releaseAssets [ count1 ]. size ). toFixed ( 3 ) + " B" ;
					}
					else if ( releaseAssets [ count1 ]. size < ( 1024 * 1024 ) )
					{
						size = ( releaseAssets [ count1 ]. size / 1024 ). toFixed ( 3 ) + " KiB" ;
					}
					else if ( releaseAssets [ count1 ]. size < ( 1024 * 1024 * 1024 ) )
					{
						size = ( releaseAssets [ count1 ]. size / ( 1024 * 1024 ) ). toFixed ( 3 ) + " MiB" ;
					}
					else
					{
						size = ( releaseAssets [ count1 ]. size / ( 1024 * 1024 * 1024 ) ). toFixed ( 3 ) + " GiB" ;
					}

					text += "\r\n- [" + releaseAssets [ count1 ]. name + "](" + releaseAssets [ count1 ]. browser_download_url + ")" ;
					if ( size !== undefined )
					{
						text += " ( " + size + " )" ;
					}
				}
			}
		}

		if ( repoFullName !== undefined && repoURL !== undefined )
		{
			attachmentText += "###### [**" + repoFullName + "**](" + repoURL + ")" ;
		}
		else if ( repoFullName !== undefined )
		{
			attachmentText += "###### **" + repoFullName + "**" ;
		}
		else if ( repoURL !== undefined )
		{
			attachmentText += "###### [**Unknown Repository**](" + repoURL + ")" ;
		}

		if ( username !== undefined && userURL !== undefined )
		{
			attachmentText += "\r\n[_" + username + "_](" + userURL + ")" ;
		}
		else if ( username !== undefined )
		{
			attachmentText += "\r\n_" + username + "_" ;
		}
		else if ( userURL !== undefined )
		{
			attachmentText += "\r\nAn [_unknown user_](" + userURL + ")" ;
		}
		else
		{
			attachmentText += "An unknown user" ;
		}
		attachmentText += " triggered `" + event + "` event with `" + action + "` action." ;

		attachmentText += "\r\n\r\n**`JSON Payload with headers:`**" ;
		attachmentText += "\r\n```json; " + Script. webhookSlug + "--" + hookID + "---" + deliveryID + ".json; JSON payload received from the GitHub webhook with headers added by the WatchDog;\r\n" + JSON. stringify ( payload, null, 2 ) + "\r\n```" ;

		var message = {
			"content":
			{
				"channel": ( ( text === "" ) ? Script. recipients. unknown : Script. recipients. releases ),
				"text": text,
				"attachments":
				[
					{
						"text": attachmentText,
						"thumb_url": userAvatar,
						"fields": []
					}
				]
			}
		} ;

		console. log ( Script. webhookSlug + "> Processed message for hook with hookID: " + hookID + ", deliveryID: " + deliveryID + " & event: " + event ) ;
		console. log ( message ) ;
		return  message ;
	},

	/**
	 * Unknown Event
	 * Target Channel: #gh-iw-unknown-events-watchdog
	 */
	"unknown_event": function ( request )
	{
		var event = request. headers ["x-github-event"] ;
		var deliveryID = request. headers ["x-github-delivery"] ;
		var hookID = request. headers ["x-github-hook-id"] ;
		var action = request. content. action ;
		var payload = JSON. parse ( JSON. stringify ( request. content ) ) ;
		payload ["ghwd-headers"] = JSON. parse ( JSON. stringify ( request. headers || {} ) ) ;

		if ( request. content. sender !== undefined )
		{
			var username = request. content. sender. login ;
			var userAvatar = request. content. sender. avatar_url ;
			var userURL = request. content. sender. html_url ;
		}

		if ( request. content. repository !== undefined )
		{
			var repoName = request. content. repository. name ;
			var repoFullName = request. content. repository. full_name ;
			var repoURL = request. content. repository. html_url ;
		}

		var text = "" ;
		var attachmentText = "" ;

		if ( repoFullName !== undefined && repoURL !== undefined )
		{
			attachmentText += "###### [**" + repoFullName + "**](" + repoURL + ")" ;
		}
		else if ( repoFullName !== undefined )
		{
			attachmentText += "###### **" + repoFullName + "**" ;
		}
		else if ( repoURL !== undefined )
		{
			attachmentText += "###### [**Unknown Repository**](" + repoURL + ")" ;
		}

		if ( username !== undefined && userURL !== undefined )
		{
			attachmentText += "\r\n[_" + username + "_](" + userURL + ")" ;
		}
		else if ( username !== undefined )
		{
			attachmentText += "\r\n_" + username + "_" ;
		}
		else if ( userURL !== undefined )
		{
			attachmentText += "\r\nAn [_unknown user_](" + userURL + ")" ;
		}
		else
		{
			attachmentText += "An unknown user" ;
		}
		attachmentText += " triggered `" + event + "` event with `" + action + "` action." ;

		attachmentText += "\r\n\r\n**`JSON Payload with headers:`**" ;
		attachmentText += "\r\n```json; " + Script. webhookSlug + "--" + hookID + "---" + deliveryID + ".json; JSON payload received from the GitHub webhook with headers added by the WatchDog;\r\n" + JSON. stringify ( payload, null, 2 ) + "\r\n```" ;

		var message = {
			"content":
			{
				"channel": Script. recipients. unknown,
				"text": text,
				"attachments":
				[
					{
						"text": attachmentText,
						"thumb_url": userAvatar,
						"fields": []
					}
				]
			}
		} ;

		console. log ( Script. webhookSlug + "> Processed message for hook with hookID: " + hookID + ", deliveryID: " + deliveryID + " & event: " + event ) ;
		console. log ( message ) ;
		return  message ;
	}
} ;

class Script
{
	static webhookName = "GH-IW All Events WatchDog" ;
	static webhookSlug = "GHIW-AEW" ;
	static recipients = {
		"unknown": "#gh-iw-unknown-events-watchdog",
		"releases": "#gh-iw-releases-watchdog"
	} ;

	process_incoming_request ( { request } )
	{
		var event = request. headers ["x-github-event"] ;
		var deliveryID = request. headers ["x-github-delivery"] ;
		var hookID = request. headers ["x-github-hook-id"] ;
		console. log ( Script. webhookSlug + "> Processing webhook request with hookID: " + hookID + ", deliveryID: " + deliveryID + " & event: " + event ) ;
		console. log ( request. headers ) ;
		console. log ( request. content ) ;

		if ( githubEvents [ event ] !== undefined )
		{
			return githubEvents [ event ] ( request ) ;
		}
		else
		{
			return githubEvents ["unknown_event"] ( request ) ;
		}
	}
} ;
