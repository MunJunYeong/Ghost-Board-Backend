import axios from "axios";

export const getGoogleAcount = async (code: any) => {
    // Google login 성공 Code -> Google token
    const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
    const tokenRes = await axios.post(GOOGLE_TOKEN_URL, {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL,
        grant_type: "authorization_code", // default value
    });

    const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
    const accountRes = await axios.get(GOOGLE_USERINFO_URL, {
        // Request Header에 Authorization 추가
        headers: {
            Authorization: `Bearer ${tokenRes.data.access_token}`,
        },
    });
    return {
        id: accountRes.data.id,
        email: accountRes.data.email,
    };
};
