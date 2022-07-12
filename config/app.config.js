
export default {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': window.localStorage.getItem('token')
      }
}
