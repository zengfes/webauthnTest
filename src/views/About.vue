<template>
  <div class="pa4 black-80">
    <div id="errors"></div>
    <form class="measure center" id="form">
      <legend class="f2 f1-l fw2 mb0 lh-title">Register Authentication</legend>
      <div class="mt3">
        <label class="db fw6 lh-copy" for="username">Username:</label>
        <input
          v-model="user"
          class="pa2 input-reset ba bg-transparent hover-bg-hot-pink hover-white w-100"
          type="text"
          name="username"
          id="username"
          required
        />
      </div>
      <div class="mt3">
        <label class="db fw6 lh-copy" for="displayname">Display Name:</label>
        <input
          v-model="user"
          class="pa2 input-reset ba bg-transparent hover-bg-hot-pink hover-white w-100"
          type="text"
          name="display"
          id="display"
          required
        />
      </div>
      <div class="mt3">
        <label class="db fw6 lh-copy" for="pwdname">Password Name:</label>
        <input
          v-model="user"
          class="pa2 input-reset ba bg-transparent hover-bg-hot-pink hover-white w-100"
          type="text"
          name="display"
          id="pwdname"
          required
        />
      </div>
      <div class="mt3">
        <label class="db fw6 lh-copy" for="credentialname"
          >Credential Name:</label
        >
        <input
          v-model="user"
          class="pa2 input-reset ba bg-transparent hover-bg-hot-pink hover-white w-100"
          type="text"
          name="credname"
          id="credname"
          required
        />
      </div>
     </form> 
      <button
        class="ba bw1 mt2 no-underline br-pill ph3 pv2 mb2 dib white b--hot-pink bg-hot-pink"
        type="submit"
        @click="register"
      >
        Submit
      </button>
    <button @click="getuser">getUser</button>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<script setup>
import { ref } from "@vue/reactivity";
import base64js from "base64-js";
import axios from 'axios';
// document.addEventListener("submit", (e) => e.preventDefault();
const user = ref();
// const display = ref();
// const password = ref();
// const credential = ref();
const getuser = ()=>{
  console.log(typeof JSON.stringify('encodedResult'))
}

const register = () => 
 {
 
  // const formData = new FormData(e.target);
  // const userRequest=new UserRequest(
  //     formData.get("username"),
  //     formData.get("display"),
  //     formData.get("pwdname")
  // )
  axios({
  method: 'post',
  url: 'api/register',
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  data: {
    displayName: user.value,
      password: user.value,
      username: user.value,
  },
   withCredentials: true

})
  // axios.post(
 
  //   'api/register',
  //    {
  //     displayName: display.value,
  //     password: password.value,
  //     username: user.value,
    
  // })
  // fetch("", {
  //   method: "POST",
  //   headers: {
  //     "Accept": "application/json",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
     
  //   }),
  // })
    .then((response) => {
      console.log(response.data)
     return  response.data
    })
    .then((credentialCreateJson) => ({
      publicKey: {
        ...credentialCreateJson.publicKey,
        challenge: base64urlToUint8array(
          credentialCreateJson.publicKey.challenge
        ),
        user: {
          ...credentialCreateJson.publicKey.user,
          id: base64urlToUint8array(credentialCreateJson.publicKey.user.id),
        },
        excludeCredentials:
          credentialCreateJson.publicKey.excludeCredentials.map(
            (credential) => ({
              ...credential,
              id: base64urlToUint8array(credential.id),
            })
          ),
        extensions: credentialCreateJson.publicKey.extensions,
      },
    })
   )
    .then((credentialCreateOptions) =>
      navigator.credentials.create(credentialCreateOptions)
    )
    .then((publicKeyCredential) => ({
      type: publicKeyCredential.type,
      id: publicKeyCredential.id,
      response: {
        attestationObject: uint8arrayToBase64url(
          publicKeyCredential.response.attestationObject
        ),
        clientDataJSON: uint8arrayToBase64url(
          publicKeyCredential.response.clientDataJSON
        ),
        transports:
          (publicKeyCredential.response.getTransports &&
            publicKeyCredential.response.getTransports()) ||
          [],
      },
      clientExtensionResults: publicKeyCredential.getClientExtensionResults(),
    }))
    .then((encodedResult) => {
      const form = document.getElementById("form");
      const formData = new FormData(form);
      formData.append("credential", JSON.stringify(encodedResult));
      console.log(encodedResult)
      console.log(typeof JSON.stringify(encodedResult))
      return  axios({
          method: 'post',
          url: 'api/finishauth',
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          data: {
            credential: JSON.stringify(encodedResult),
            username: user.value,
            credname: user.value
          },
          withCredentials: true

        })
      // return axios.post(
      //     'api/finishauth',
      //      {
      //       credential: JSON.stringify(encodedResult),
      //       username: user.value,
      //       credname: credential.value
      //     }  
      // )
      // return fetch("api/finishauth", {
      //   method: "POST",
      //   headers: {
      //     "Accept": "application/json",
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     credential: JSON.stringify(encodedResult),
      //     username: user.value,
      //     credname: credential.value,
      //   }),
      // });
    })
    .then((response) => {
      console.log(response)
      // followRedirect(response);
    })
    .catch((error) => {
      displayError(error);
    });
};
//)
// class UserRequest {
//   constructor(data) {
//     this.username = data.username;
//     this.displayName = data.displayName;
//     this.password = data.password;
//   }
// }
function base64urlToUint8array(base64Bytes) {
  const padding = "====".substring(0, (4 - (base64Bytes.length % 4)) % 4);
  return base64js.toByteArray(
    (base64Bytes + padding).replace(/\//g, "_").replace(/\+/g, "-")
  );
}
function uint8arrayToBase64url(bytes) {
  if (bytes instanceof Uint8Array) {
    return base64js
      .fromByteArray(bytes)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  } else {
    return uint8arrayToBase64url(new Uint8Array(bytes));
  }
}
// class WebAuthServerError extends Error {
//   constructor(foo = "bar", ...params) {
//     super(...params);
//     this.name = "ServerError";
//     this.foo = foo;
//     this.date = new Date();
//   }
// }
// function throwError(response) {
//   throw new WebAuthServerError("Error from client", response.body);
// }
// function checkStatus(response) {
//   if (response.status !== 200) {
//     throwError(response);
//   } else {
//     return response;
//   }
// }
// function initialCheckStatus(response) {
//   console.log("initalcheckStatus: " + response.json());
//   checkStatus(response);
//   return response.json();
// }
// function followRedirect(response) {
//   if (response.status === 200) {
//     window.location.href = response.url;
//   } else {
//     throwError(response);
//   }
// }
function displayError(error) {
  const errorElem = document.getElementById("errors");
  errorElem.innerHTML = error;
  console.error(error);
}
</script>
