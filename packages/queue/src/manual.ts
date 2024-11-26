import { QueueName, getQueue } from './utils'
import { handler } from './handler'

const run = async () => {
  const queue = getQueue(QueueName.Default)
  const job = await queue.getJob(process.argv[2])
  if (job) {
    const result = await handler(job.data)
    console.log(JSON.stringify(result, null, 2))
  }
}

run().catch((e) => {
  console.error(e)
})
