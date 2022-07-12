//= ======================| App Configuration |========================//
const headers = {
        'Content-Type': 'application/json',
        'Authorization': window.localStorage.getItem('token')
}
const mapBoxAccessToken = 'pk.eyJ1IjoiZGltb2siLCJhIjoiY2s4ZnBwMHZuMDJybjNncDFsamhiYTAzayJ9.3voabxIuUVUMuTXY7PWalQ'
const mapBoxStyle = 'mapbox://styles/dimok/ckaur2cj431mt1iqhm48wed8k'
const mapBoxStyleDark = 'mapbox://styles/dimok/ck9fwkm5u2gjm1imkurpby87g'
export { headers, mapBoxAccessToken, mapBoxStyle, mapBoxStyleDark }
