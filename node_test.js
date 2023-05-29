const axios = require('axios');

getPSNToken("VQ1gbTJhMtFAWTj1wbx6TdDqBOuHeAOIrGiA2xWss1rytE2mM1uuSIV6zacKdOnl");

async function getPSNToken(npsso) {
    const codeRequestURL = new URL("https://ca.account.sony.com/api/authz/v3/oauth/authorize");
    codeRequestURL.searchParams.append("access_type", "offline");
    codeRequestURL.searchParams.append("client_id", "09515159-7237-4370-9b40-3806e67c0891");
    codeRequestURL.searchParams.append("response_type", "code");
    codeRequestURL.searchParams.append("scope", "psn:mobile.v2.core psn:clientapp");
    codeRequestURL.searchParams.append("redirect_uri", "com.scee.psxandroid.scecompcall://redirect");

    let config = {
        headers:{
            Cookie: "npsso=" + npsso,
        }
    };

    let code = "";
    await axios.get(codeRequestURL.href, config)
    .then(response => {
        console.log("Error : Check npsso");
        return;
    })
    .catch(error => {
        const queryResult = error.request._options.query;
        if(!queryResult) {
            console.log("Error : Check npsso");
            return;
        }
        code = new URLSearchParams(queryResult).get("code");
        console.log(code);
    });

    const accessTokenURL = "https://ca.account.sony.com/api/authz/v3/oauth/token";
    let body = {
        "code": code,
        "redirect_uri": "com.scee.psxandroid.scecompcall://redirect",
        "grant_type": "authorization_code",
        "token_format": "jwt"
    };
    config = {
        headers:{
            "Authorization": "Basic MDk1MTUxNTktNzIzNy00MzcwLTliNDAtMzgwNmU2N2MwODkxOnVjUGprYTV0bnRCMktxc1A=",
            "content-type": "application/x-www-form-urlencoded"
        }
    };

    await axios.post(accessTokenURL, body, config)
    .then(response => {
        console.log(response.data.access_token);
    })
    .catch(error => {
        console.log(error);
    });
}
