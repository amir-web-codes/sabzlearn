async function login() {
    fetch("http://localhost:7000/users/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({
            email: "teacher@gmail.com",
            password: "teacher1234"
        })
    })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem("token", `Bearer ${data.accessToken}`)
            console.log(data)
        })
        .catch(err => console.log(`fetch error: ${err}`))
}

async function refreshToken() {
    await fetch("http://localhost:7000/users/refresh-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem("token")
        }
    })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem("token", `Bearer ${data.accessToken}`)
            console.log(data)
        })
        .catch(err => console.log(`fetch error: ${err}`))
}

// login()

fetch("http://localhost:7000/tickets/create", {
    method: "POST",
    headers: {
        "authorization": localStorage.getItem("token"),
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        title: "for react",
        message: "ticket",
        teacherId: "695e3bb93e159fe946b7c45e"
    })
})
    .then(res => res.json())
    .then(async data => {
        console.log(data)

        if (data.message === "invalid or expired token") {
            await refreshToken()
        }
    })
    .catch(err => console.log(`fetch error: ${err}`))