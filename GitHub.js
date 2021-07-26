import { Base64 } from "https://code4fukui.github.io/Base64/Base64.js";

const fetchWithToken = async (accessToken, method, url, json) => {
  const headers = {
    "Accept": "application/vnd.github.v3+json", // "application/json",
    "Authorization": "token " + accessToken,
  };
  if (!json) {
    return await (await fetch(url, { headers })).json();
  }
  if (method == "GET") {
    const url2 = url + "?" + Object.keys(json).map((s) => s + "=" + encodeURIComponent(json[s])).join("&");
    return await (await fetch(url2, { headers })).json();
  }
  if (json.accept) {
    json.accept = "application/vnd.github.v3+json";
  }
  headers["Content-Type"] = "application/json";
  const body = JSON.stringify(json);
  return await (await fetch(url, { method, headers, body })).json();
};

class GitHub {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }
  // use accessToken
  async fetchGET(url, json) {
    if (!this.accessToken) {
      throw new Error("please setAccessToken");
    }
    return await fetchWithToken(this.accessToken, "GET", url, json);
  }
  async fetchPUT(url, json) {
    if (!this.accessToken) {
      throw new Error("please setAccessToken");
    }
    return await fetchWithToken(this.accessToken, "PUT", url, json);
  }
  // api
  async getUser(user = null) {
    const url = "https://api.github.com/user" + (user ? "s/" + user : "");
    return await this.fetchGET(url);
  }
  //
  async repos() { // from all repogitories
    const url = "https://api.github.com/repositories";
    return await this.fetchGET(url);
  }
  /*
  sort	string	query	Can be one of created, updated, pushed, full_name. Default: created
  direction	string	query	Can be one of asc or desc. Default: when using full_name: asc, otherwise desc
  per_page	integer	query	Results per page (max 100) Default: 30
  page	integer	query	Page number of the results to fetch.  Default: 1
  */
  async getReposByMe(page = 1) {
    const url = "https://api.github.com/user/repos";
    return await this.fetchGET(url, { sort: "created", direction: "desc", per_page: 100, page });
  }
  async getReposByUser(user) {
    const url = "https://api.github.com/users/" + user + "/repos";
    return await this.fetchGET(url);
  }
  async getReposByOrg(org) {
    const url = "https://api.github.com/orgs/" + org + "/repos";
    return await this.fetchGET(url);
  }
  async list(repo, branch, path) {
    const url = "https://api.github.com/repos/" + repo + "/contents/" + path + "?ref=" + branch;
    return await this.fetchGET(url);
  }
  // download
  async pull(repo, branch, filename) { // file (repo, branch, filename)
    const file = { repo, branch, filename };
    const url = "https://api.github.com/repos/" + file.repo + "/contents/" + file.filename + "?ref=" + file.branch;
    file.data = await this.fetchGET(url);
    if (!file.data.content) {
      return null;
    }
    file.bin = () => {
      return Base64.decode(file.data.content);
    };
    file.text = () => {
      return new TextDecoder().decode(file.bin());
    };
    console.log(file.data);
    return file;
  }
  // upload
  async push(file, bin, commitMessage = "update") {
    const url = "https://api.github.com/repos/" + file.repo + "/contents/" + file.filename;
    const content = Base64.encode(bin);
    /*
    const data = await this.fetchGET(url + "?ref=" + branch);
    console.log(data);
    //console.log("ref_x", data.content.length, content.length);
    if (data.content) {
      const bin2 = Base64.decode(data.content);
      if (bin.length == bin2.length) {
        A: for (;;) {
          for (let i = 0; i < bin.length; i++) {
            if (bin[i] != bin2[i]) {
              break A;
            }
          }
          //console.log("nothing to update");
          return data;
        }
      }
    }
    */
    const pushdata = {
      message: commitMessage,
      branch: file.branch,
      content,
      sha: file.data.sha,
    };
    console.log(pushdata);
    const res = await this.fetchPUT(url, pushdata);
    file.data = res.content;
    return res;
  }
  async pushText(file, text, commitMessage = "update") {
    await this.push(file, new TextEncoder().encode(text), commitMessage);
  }
}

export { GitHub };
