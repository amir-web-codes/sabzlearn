async function login() {
    fetch("http://localhost:7000/users/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({
            email: "reza@gmail.com",
            password: "reza1234"
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

fetch("http://localhost:7000/tickets/get-all", {
    method: "GET",
    headers: {
        "authorization": localStorage.getItem("token"),
        "Content-Type": "application/json"
    },
    // body: JSON.stringify({
    //     title: "test",
    //     message: "this is a reply2",
    //     teacherId: "695d4f4fbe701395a73f0401"
    // })
})
    .then(res => res.json())
    .then(async data => {
        console.log(data)

        if (data.message === "invalid or expired token") {
            await refreshToken()
        }
    })
    .catch(err => console.log(`fetch error: ${err}`))