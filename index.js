const app = require("./server")
const port = process.env.PORT || 7000

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})