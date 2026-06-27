// toggle navbar
const bar = document.getElementById('bar');
const close = document.getElementById('close')
const nav = document.getElementById('navbar');
if (bar){
    bar.addEventListener('click', () =>{
        nav.classList.add('active')
    }) 
}
if (close){
    close.addEventListener('click', () =>{
        nav.classList.remove('active')
    })
}


// Password Toggle For LOGIN (only on Login page)
const eyeIcon = document.querySelector(".password-field i");
const passwordInput = document.querySelector(".password-field input");

if (eyeIcon && passwordInput) {
    eyeIcon.addEventListener("click", () => {
        if(passwordInput.type === "password"){
            passwordInput.type = "text";
            eyeIcon.classList.replace("fa-eye","fa-eye-slash");
        }else{
            passwordInput.type = "password";
            eyeIcon.classList.replace("fa-eye-slash","fa-eye");
        }
    });
}


// LOGIN LOCAL STORAGE (only on Login page)
const savedUser = JSON.parse(localStorage.getItem('keyDetails')) || []
const userLogin = document.getElementById('loginAccount')
if (userLogin) {
    userLogin.addEventListener('click', () =>{
        const userEmail = document.getElementById('email').value
        const userPassword = document.getElementById('password').value

        if(userEmail.trim() === '' && userPassword.trim() === ''){
            Toastify({
                text: "Please Kindly fill all input",
                className: "info",
                duration: "6000",
                style: {
                    background: "linear-gradient(to right, black, red)",
                    maxWidth: "100%"
            }
        }).showToast();
        } else if (savedUser.find(user => user.email === userEmail && user.password === userPassword)){

             loginAccount.innerHTML  = `
         <div class="d-flex align-items-center   justify-content-center  gap-2">
  <div class="spinner-border text-success" role="status"></div>
  <span>Creating account...</span>
</div>`

            Toastify({
                text: "Login Successful!",
                className: "info",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();

            setTimeout(() => {
                window.location.href = 'dashboard.html'
            }, 3000);
        } else{
            Toastify({
                text: "Invalid credentials!",
                className: "info",
                duration: "6000",
                style: {
                    background: "linear-gradient(to right, black, red)",
                    maxWidth: "100%"
            }
        }).showToast();
        }
    })
}
