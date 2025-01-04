async function signin() {

    const name = document.getElementById("name")
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const city = document.getElementById("city");
    const age = document.getElementById("age");
    const mobilenumber = document.getElementById("mobile");

    if (!email.value || !password.value || !city.value || !age.value || !mobilenumber.value || !name.value) {
        alert("Please fill out all fields.");
        return;
    }
    function IsUpper(char) {
        return char === char.toUpperCase() && char !== char.toLowerCase();
    }
    var domain_found = false;
    if (email.value.length != 0) {
        for (let i = 0; i < email.value.length; i++) {
            if (IsUpper(email.value[i])) {
                window.alert("Enter valid mail id");
                return;
            }
            else if (email.value[i] == "@") {
                domain_found = true;
            }
        }
        if (email.value.slice(email.value.length - 4) != ".com" || domain_found == false) {
            window.alert("Enter valid mail id");
            return;
        }
    }
    else {
        window.alert("Enter valid mail id");
        return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password.value)) {
        alert("enter valid password");
        return;
    }

    const details = {
        email: email.value,
        password: password.value,
        city: city.value,
        age: age.value,
        mobilenumber: mobilenumber.value,
        name: name.value
    };
    const data = await fetch('http://127.0.0.1:3000/user/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(details)
    }).then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

    password.value = ""
    email.value = ""
    age.value = ""
    mobilenumber.value = ""
    city.value = ""
    name.value = ""
    switchlogin();
}

async function login() {
    const email = document.getElementById("login_email");
    const password = document.getElementById("login_password");

    const details = {
        email: email.value,
        password: password.value
    };

    try {
        const response = await fetch('http://127.0.0.1:3000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(details)
        });

        const data = await response.json();

        console.log(data)
        if (data.message == "success") {
            email.value = "";
            password.value = "";
            localStorage.setItem("Atoken", data.Atoken)
            console.log(data)
            window.location.href = "../homepage/homepage.html"
        }
        else {
            return alert(data.message)
        }

    } catch (error) {
        console.error('Error:', error);
        alert("An error occurred. Please try again later.");
    }
}

function switchlogin() {
    const loginform = document.getElementsByClassName("form2")[0];
    const signinform = document.getElementsByClassName("form")[0];

    if (signinform && loginform) {
        signinform.classList.add("hidden");
        setTimeout(() => {
            signinform.style.display = "none";
            loginform.style.display = "block";
            setTimeout(() => loginform.classList.remove("hidden"), 50);
        }, 250); 
    } else {
        console.error("Form elements not found.");
    }
}

function switchsignin() {
    const loginform = document.getElementsByClassName("form2")[0];
    const signinform = document.getElementsByClassName("form")[0];

    if (signinform && loginform) {
        loginform.classList.add("hidden");
        setTimeout(() => {
            loginform.style.display = "none";
            signinform.style.display = "block";
            setTimeout(() => signinform.classList.remove("hidden"), 50); 
        }, 250); 
    } else {
        console.error("Form elements not found.");
    }
}
