import dotenv from "dotenv"
import connectDB from "./config/database.js"
import app from "./app.js"

dotenv.config({
    path: "./.env"
})

const startServer = async () => {
    try {
        await connectDB()
        app.on("error", (error) => {
            console.log("error", error)
            throw error;
        });

        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running on port: ${process.env.PORT}`)
        })
    } catch (error) {

        console.log("connection failed", error)
    }
}

// HANDLE UNHANDLE REJECTION
process.on("unhandledRejection", (err) => {
    console.log("Unhandled rejection:", err)
    server.close(async () => {
        await disConnectDB();
        process.exit(1)
    })
})

// HANDLE uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.log("uncaught Exception:", err)
    await disConnectDB();
    process.exit(1)
})

// HANDLE Graceful Shutdown
process.on("SIGTERM", (err) => {
    console.log("SIGTERM received, shutting down gracefully:", err)
    server.close(async () => {
        await disConnectDB();
        process.exit(1)
    })
})
startServer()