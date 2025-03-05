import { deleteLocalUser, getLocalUser, saveLocalUser } from "./secureStore";

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

export const login = async (email, password) => {
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
      return data;
    }
    else
      throw new Error(data.message);

  } catch (error) {
    throw new Error(error.message);
  }
};

export const signup = async (
  email, 
  firstname,
  lastname,
  password,
  passwordConfirm
) => {
  try {
    const response = await fetch(`${baseUrl}signup`, {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        firstname:firstname,
        lastname:lastname,
        password: password,
        password_confirmation:passwordConfirm
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();

    if(response.status === 200){
      saveUser(data)
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
    const user = await getLocalUser();
    const response = await fetch(`${baseUrl}logout`, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    
    const data = await response.json();

    if(response.status === 200){
      deleteLocalUser();
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
    const user = await getLocalUser();
    const response = await fetch(`${baseUrl}refreshToken`, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    
    const data = await response.json();

    if(response.status === 200){
      saveUser(data)
      return data;
    }
    else
      throw new Error(data.message);

  } catch (error) {
    throw new Error(error.message);
  }
}

// export const updateUser = async (
//   email, 
//   firstname,
//   lastname
// ) => {
//   try {
//     const user = await getLocalUser();

//     if(email != user.email || firstname != user.firstname || lastname != user.lastname){
//       const response = await fetch(`${baseUrl}user/update`, {
//         method: 'PUT',
//         body: JSON.stringify({
//           email: email,
//           firstname:firstname,
//           lastname:lastname
//         }),
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`,
//         },
//       });
      
//       const data = await response.json();

//       if(response.status === 200){
//         updateLocalUser(data, user.token)
//         return data;
//       }
//       else
//         throw new Error(data.message);
//     }
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

export const deleteUser = async () => {
  try {
    const user = await getLocalUser();

    const response = await fetch(`${baseUrl}user/delete`, {
      method: 'DELETE',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
      
    const data = await response.json();

    if(response.status === 200){
      deleteLocalUser();
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
    id: data.user.id,
    email: data.user.email,
    firstname: data.user.firstname,
    lastname: data.user.lastname,
  };
  saveLocalUser(user);
}

// const updateLocalUser = (data, token)=>{
//   const user = {
//     token: token,
//     id: data.data.user.id,
//     email: data.data.user.email,
//     firstname: data.data.user.firstname,
//     lastname: data.data.user.lastname,
//   };
//   saveLocalUser(user);
// }