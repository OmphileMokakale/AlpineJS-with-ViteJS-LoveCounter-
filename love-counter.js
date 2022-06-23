import axios from 'axios';
export default function LoveCounter() {
  return {
    loveCounter: 0,
    show: false,
    isSignedUp: false,
    isLoggedIn: true,
    username: '',
    password: '',
    loggedInUser: '',
    userToken: '',
    user: {},
    async init() {
      const UserToken = JSON.parse(localStorage.getItem("token")) || ""
      console.log(UserToken);
      this.userToken = UserToken;

      const config = {
        headers: { 'Authorization': `bearer:${this.userToken}` }
      }
      await axios.get('/api/v1/auth', config).then(res => {
        console.log(res.data);
        this.user = res.data.user;

      })

      if (UserToken === "") {

        // this.isLoggedIn = true;
      }
      setInterval(() => {
        if (this.loveCounter > 0) {
          this.loveCounter--;
        }
        console.log(this.loveCounter)
      }, 3000)
    },

    async handleCountUp() {

      await axios.post('/api/v1/counter/increament', {
        token: this.userToken,
        counter: 1
      })

    },
    async handleCountDown() {

      await axios.post('/api/v1/counter/decreament', {
        token: this.userToken,
        counter: 1
      })

    },

    async handleLogin() {
      await axios.post('/api/v1/login/user', {
        username: this.username,
        password: this.password
      }).then(res => {
        console.log(res.data);
        if (res.data.isLoggedin) {
          this.isLoggedIn = false;
          this.show = true;
          console.log(res.data);
          this.userData = res.data.user
        }
      })
      console.log(this.userData);

    },

    async handleRegister() {
      console.log(this.username);
      await axios.post('/api/v1/create/user', {
        username: this.username,
        password: this.password
      }).then(res => {
        localStorage.setItem('token', JSON.stringify(res.data.token))
      })
    },

    love() {
      this.loveCounter++
    },

    hearts() {
      if (this.loveCounter <= 0) {
        return "💔"
      }

      if (this.loveCounter > 0 && this.loveCounter <= 5) {
        return "💚"
      } else if (this.loveCounter <= 10) {
        return "💚💚";
      } else {
        return "💚💚💚";
      }
    }
  }
}
