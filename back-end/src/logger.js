const logger = (req, res, next) => {
  // console.clear()
  console.log("\n",
    "-----------------------------\n",
    "<//////    Request    //////>\n",
    "-----------------------------\n",
    req.method, req.originalUrl, "\n",
    "-----------------------------\n",
    "req.query: \n", req.query, "\n",
    "req.params: \n", req.params, "\n",
    "req.body: \n", req.body, "\n",
  )
  next()
}

module.exports = logger