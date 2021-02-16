
const initialState = {
    username: '',
    profile_pic: ''
}

const LOGIN_USER = "LOGIN_USER";
const LOGOUT_USER = "LOGOUT_USER"

export function updateUser(user){
    return {
        type: LOGIN_USER,
        payload: user
    }
}

export function logout(){
    return{
        type: LOGOUT_USER,
        payload: ''
    }
}

export default function reducer(state = initialState, action) {
    switch(action.type){
        case LOGIN_USER:
            return {
                ...state, 
                username: action.payload.username, 
                profile_pic: action.payload.profile_pic
            }
        default:
            return state;
    }
}