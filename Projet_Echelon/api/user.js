import { deleteUserInfo, getUserInfo, saveUserInfo, saveUserToken, getUserToken, deleteUserToken } from "./secureStore";

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

export const login = async (email, password, session) => {
  try {
    const response = await fetch(`${baseUrl}login`, {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    
    if(response.status === 200){
      saveUser(data)

      if (session) 
        saveUserToken(data.token)
      else 
        saveUserToken("")

      return data;
    }
    else {
      throw new Error(JSON.stringify(data));
    }

  } catch (error) {
    throw new Error(error.message);
  }
};

export const signup = async (email, firstname, lastname, password, session) => {
  try {
    const response = await fetch(`${baseUrl}signup`, {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        firstname: firstname,
        lastname: lastname,
        password: password
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();

    if(response.status === 200){
      return data;
    }
    else
      throw new Error(data.message);

  } catch (error) {
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    const user = await getUserInfo()
    const token = await getUserToken()
    
    const response = await fetch(`${baseUrl}logout`, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user !== undefined ? user.token : token}`,
      },
    });
    
    const data = await response.json();

    if(response.status === 200){
      if (user === undefined) {
        await deleteUserToken();
      } else {
        await deleteUserInfo();
      }
      return data;
    }
    else
      throw new Error(data.message);

  } catch (error) {
    throw new Error(error.message);
  }
}

export const refreshToken = async () => {
  try {
    const user = await getUserInfo();
    console.log(user)
    if (!user || !user.token) {
      return null;
    }
    else{
      console.log("There is a user")
      console.log(baseUrl)
      const response = await fetch(`${baseUrl}refreshToken`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log("There is a user after response")
      console.log(response.status)
      const data = await response.json();
      if(response.status === 200){
        console.log("Response 200")
        saveUser(data)
        return data;
      }
      else
        throw new Error(data.message);
    }
  } catch (error) {
    throw new Error("In refresh token" + error.message);
  }
}

export const update = async ( id, lastname, firstname, email) => {
  try {
    const user = await getUserInfo();

    const response = await fetch(`${baseUrl}updateUser`, {
      method: 'POST',
      body: JSON.stringify({
        id:id,
        firstname:firstname,
        lastname:lastname,
        email: email
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
      
      const data = await response.json();

      if(response.status === 200){
        console.log(data.user)
        updateUserInfo(data, user.token)
        return data;
      }
      else
        throw new Error(data.message);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteUser = async () => {
  try {
    const user = await getUserInfo();

    const response = await fetch(`${baseUrl}deleteUser`, {
      method: 'DELETE',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
      
    const data = await response.json()
    if(response.status === 200){
      deleteUserInfo();
      return data;
    }
    else
      throw new Error(data.message);
  } catch (error) {
    throw new Error(error.message);
  }
}

const saveUser = (data)=>{
  const user = {
    token: data.token,
    id: data.user.id.toString(),
    email: data.user.email,
    firstname: data.user.firstname,
    lastname: data.user.lastname,
  };
  saveUserInfo(user);
}

const updateUserInfo = (data, token)=>{
  const user = {
    token: token,
    id: data.user.id,
    email: data.user.email,
    firstname: data.user.firstname,
    lastname: data.user.lastname,
  };
  console.log("UpdateUserInfo", user)
  saveUserInfo(user);
}

export const updatePassword = async (old_p, new_p, new_c) => {
  try {
    const user = await getUserInfo();

    const response = await fetch(`${baseUrl}updatePassword`, {
      method: 'POST',
      body: JSON.stringify({
        old_p: old_p,
        new_p: new_p,
        new_c: new_c
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    
    const data = await response.json();

    if(response.status === 200){
      return data;
    }
    else
      throw new Error(data.message);
  } catch (error) {
    throw new Error(error.message);
  }
};