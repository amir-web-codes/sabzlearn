async function login() {
    fetch("http://localhost:7000/users/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({
            email: "hamid@gmail.com",
            password: "hamid1234"
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

fetch("http://localhost:7000/lessons/696f5c2302c28063d76eb0be", {
    method: "DELETE",
    headers: {
        "authorization": localStorage.getItem("token"),
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        // title: "new lesson",
        description: "hi",
        order: 1,
        duration: 5
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