# GitHub

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A JavaScript library to interact with the GitHub API.

## Features
- Fetch user information
- Fetch repositories by user, organization, or all
- List files in a repository
- Download and upload files to a repository

## Requirements
Requires the [Base64.js](https://code4fukui.github.io/Base64/Base64.js) library.

## Usage
Import the `GitHub` class and create an instance with your GitHub access token:

```javascript
import { GitHub } from "https://code4fukui.github.io/GitHub/GitHub.js";

const gh = new GitHub("your_access_token");
```

Then, you can use the various methods to interact with the GitHub API, such as:

```javascript
const user = await gh.getUser("octocat");
console.log(user);

const repos = await gh.getReposByMe();
console.log(repos);

const file = await gh.pull("octocat/Spoon-Knife", "master", "README.md");
console.log(file.text());
```

## License
MIT License — see [LICENSE](LICENSE).