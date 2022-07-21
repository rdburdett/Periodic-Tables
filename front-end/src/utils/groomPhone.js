export default function groomPhone(phone) {
  const areaCode = phone.slice(0, 3);
  const localNumber = phone.slice(4);
  return (`(${areaCode})${localNumber}`)
}