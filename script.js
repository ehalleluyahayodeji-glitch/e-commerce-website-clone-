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


// Password Toggle For LOGIN
const eyeIcon = document.querySelector(".password-field i");
const passwordInput = document.querySelector(".password-field input");

eyeIcon.addEventListener("click", () => {
    if(passwordInput.type === "password"){
        passwordInput.type = "text";
        eyeIcon.classList.replace("fa-eye","fa-eye-slash");
    }else{
        passwordInput.type = "password";
        eyeIcon.classList.replace("fa-eye-slash","fa-eye");
    }
});


// LOGIN LOCAL STORAGE
const savedUser = JSON.parse(localStorage.getItem('loginSaved')) || []
const userLogin = document.getElementById('loginAccount')
userLogin.addEventListener('click', () =>{
    const userEmail = document.getElementById('email').value
    const userPassword = document.getElementById('password').value

    if(userEmail.trim() === '' && userPassword.trim() === ''){
        Toastify({
            text: "Please Kindly fill all input",
            className: "info",
            style: {
                background: "linear-gradient(to right, black, red)",
}
}).showToast();
    } else{
        const userObj = {userEmail, userPassword}
        savedUser.push(userObj)
        console.log(savedUser);
        localStorage.setItem('loginSaved', JSON.stringify(savedUser))

        Toastify({
            text: "Login Successful!",
            className: "info",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();

        setTimeout(() => {
            window.location.href = 'index.html'
        }, 3000);
    }
    
    
})