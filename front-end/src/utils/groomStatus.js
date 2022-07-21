export default function groomStatus(status) {
  return status && (`${status.slice(0,1).toUpperCase()}${status.slice(1)}`)
}