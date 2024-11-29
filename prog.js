require('dotenv').config()
const engine = require('express')
const prog = engine()
const cors = require('cors')
const { connector } = require('./engine/config/connector')

const { LotteryCheckRouter } = require('./engine/route/lottery.route')

prog.use(cors())
prog.use(engine.json({ limit: '50mb' }))
prog.use(engine.urlencoded({ extended: true, limit: '50mb', parameterLimit: 100000 }))

prog.use("/lottery", LotteryCheckRouter)

const startServer = async () => {
    try {
        if (!process.env.PROG_PORT || !process.env.PROG_HOST) {
            throw new Error('Missing required environment variables: PROG_PORT or PROG_HOST')
        }

        await new Promise((resolve, reject) => {
            connector.connect((err) => {
                if (err) {
                    return reject(new Error('MYSQL connection error: ' + err.message))
                }
                resolve()
            })
        })

        prog.listen(process.env.PROG_PORT, () => {
            console.log(`Application started on http://${process.env.PROG_HOST}:${process.env.PROG_PORT}`)
        })

    } catch (error) {
        console.error('Server startup failed: ', error.message)
        process.exit(1)
    }
}

startServer()