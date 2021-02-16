# [rocket.chat-github-webhook-allevents](#)

A script to use GitHub webhook as output and a Rocket.Chat webhook as input to provide GitHub notifications like feature.

> - Creator: Samagra Singh Tomar a.k.a. SST, [Mail](mailto:samagrasinghtomar2010@gmail.com)

## Warning !!

- The script doesn't have any potential damages that I know of at the moment.
- In spite of that, I do not assume any responsibility for damage done if any due to the use of the script.

## What is this ??

Just a few days of using GitHub was enough for me and my team to fall in love with it. Like everything else, it wasn't perfect but it was definitely near perfect.

The problem that my team faced the most was being notified of events on GitHub. Sure, you can watch a repository. But, who has the time to check emails every hour, especially, when you're working in focus mode. Also, opening each email to see what happened only to realise that a lot of the events didn't need any action from you.

My team already uses a private messaging server to collaborate. So, we used webhooks to create a simple feature where messages are created for each GitHub event and sent into relevant chat rooms. Benefits ??
- Receiving push notifications on your work device and/or on your mobile if you wanna catch up on the go.
- Properly drafted message allows you to quickly analyse if action is needed or not.
- Admins can monitor any admin type changes like the addition of teams or members, etc.
- End users can receive a message for new releases.

From notifications to targetted messaging, our team has utilized fully all features created from convenience to efficiency. I hope it helps you and/or your team to do the same.

**A message notifying a new release:**
![New-Release-RocketChat-GitHub.png](https://i.ibb.co/fGjrpLj/New-Release-Rocket-Chat-Git-Hub.png)

## Pending tasks

I have some tasks planned for this project. I will get to them as soon as you can. If you'd like to help contribute by doing some of the tasks, feel free to submit a PR or contact me on my mail.

- Add instructions to set up the webhook.
- Create an alternate generalized script that simply parses GH JSON payload to generate images.
- Add feature to direct events based on repo members and other stakeholders.
- Parse other events' payload that are classified as unknown right now.
- Configure the script to fetch the latest script and style from GH repo and use it with eval.
  - Need to give this some thought as it might be an overkill.

## Farewell

Feel free to reach out to me in case of any queries or suggestions. ( Email provided at the top. )
