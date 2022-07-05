import { Auth } from "./auth";
import base64 from 'react-native-base64'

var url = "https://api-shorts.herokuapp.com/v1/"

const _getLoggedInUser = async () => {
    try {
        const token = await Auth()
        const payload = token.split(".")[1]
        const user = base64.decode(payload);
        const arr=user.replace("{",'').replace("}",'').split(",")
        
        let _id=arr[0].split('"')[3]
        let image=arr[1].split('"')[3]
        let name=arr[2].split('"')[3]
        let isVarified=arr[3].split(':')[1]

        const res={
            _id,
            image,
            name,
            isVarified:isVarified==="true"
        }
        return res
    } catch (error) {
        return error
    }
}

const common = (data, method, token) => {
    if (method === "GET") {
        return {
            method,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
    }
    if (token) {
        return {
            method,
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        }
    }


    return {
        method,
        body: JSON.stringify(data),
        headers: {
            "content-type": "application/json"
        }
    }
}
const _sendOtp = async (mobile) => {
    try {
        const res = await fetch(url + "auth/send-otp", common({ mobile }, "POST"))
        return res.json()
    } catch (error) {
        return error
    }
}


const _varifyOtp = async (mobile, otp) => {
    try {
        const res = await fetch(url + "auth/varify-otp", common({ mobile, otp }, "POST"))
        return res.json()
    } catch (error) {
        return error
    }
}

const _uploadPost = async (poster, uri, desc) => {
    const obj = { poster, url: uri, desc }
    try {
        const token = await Auth()
        const res = await fetch(url + "post/create", common(obj, "POST", token))
        return res.json()
    } catch (error) {
        return error
    }
}

const _getPosts = async (skip) => {
    try {
        const token = await Auth()
        const res = await fetch(url + "post/all?skip="+skip, common("", "GET", token))
        return res.json()
    } catch (error) {
        return error
    }
}

const _getUser = async (id) => {
    try {
        const token = await Auth()
        const res = await fetch(url + "user?id=" + id, common("", "GET", token))
        return res.json()
    } catch (error) {
        return error
    }
}

const _getMyPost = async (id, skip) => {
    try {
        const token = await Auth()
        const res = await fetch(url + "post/mypost?id=" + id + "&skip=" + skip, common("", "GET", token))
        return res.json()
    } catch (error) {
        return error
    }
}

const _react = async (postid, like) => {
    try {
        const token = await Auth()
        const res = await fetch(url + "post/react", common({ postid, like }, "POST", token))
        return res.json()
    } catch (error) {
        return error
    }
}

const _getComments = async (postid, skip) => {
    try {
        const token = await Auth()
        const res = await fetch(url + "post/comment?postid=" + postid + "&skip=" + skip, common("", "GET", token))
        return res.json()
    } catch (error) {
        return error
    }
}

const _saveComment = async (postid, comm) => {
    try {
        const token = await Auth()
        const res = await fetch(url + "post/comment", common({ postid, comm }, "POST", token))
        return res.json()
    } catch (error) {
        return error
    }
}

const _follow = async (id, action) => {
    try {
        const token = await Auth()
        const res = await fetch(url + "follow", common({ to:id, action }, "POST", token))
        return res.json()
    } catch (error) {
        return error
    }
}

const _searchUser = async (name) => {
    try {
        const token = await Auth()
        const res = await fetch(url + "user/search?name="+name, common("", "GET", token))
        return res.json()
    } catch (error) {
        return error
    }
}

const _updateProfile = async (name,desc) => {
    try {
        const token = await Auth()
        const res = await fetch(url + "user/edit", common({name,desc}, "PATCH", token))
        return res.json()
    } catch (error) {
        return error
    }
}

const _updateProfilePicture = async (path) => {
    try {
        const token = await Auth()
        const res = await fetch(url + "user/updatedp", common({url:path}, "PATCH", token))
        return res.json()
    } catch (error) {
        return error
    }
}

module.exports = {
    _getLoggedInUser,
    _sendOtp,
    _varifyOtp,
    _uploadPost,
    _getPosts,
    _getUser,
    _getMyPost,
    _react,
    _getComments,
    _saveComment,
    _follow,
    _searchUser,
    _updateProfile,
    _updateProfilePicture
}