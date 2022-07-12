import axios from 'axios'
// import notification from 'ant-design-vue/es/notification'
// const POINT_SEARCH_KEYS = [
//   // '8fb635ed-f033-4166-8286-a5388bb7d9a9',
//   'b7811eef-adfc-44ba-a06b-915bd56f37e6',
//   '3e9a1241-7241-4975-b2a1-77203e9c0333',
//   '679a08be-aa49-4a79-ad31-80c65dda374a',
//   // yangi
//   'c8e3f2db-2125-41f0-b64a-c6a8337718cf',
//   'bdc4ef88-3fea-43f2-8f54-9d4018fe15db'
// ]
// const PLACE_SEARCH_KEYS = [
//   // 'a80458a5-709e-453d-831a-ae89e1db36a5',
//   '90019ff7-9264-40fe-9cf3-00c7d41c1b92',
//   '586ceb0e-2504-440d-9972-997af51914d1',
//   // yangi
//   'c91a786a-9864-4735-a18a-a5791969d23d',
//   '644b9512-cf6f-46de-ba11-535c0255b373'
// ]

// 7th May, 2022

const PLACE_SEARCH_KEYS = [
  // '759b84ef-5617-425f-83f7-7c320c1ce27b',
  '0586fcf6-959d-4bcd-a6dc-bb9f3995cfe4',
  'b66c0e00-3436-4862-8dfb-bc0dca69406d',
  'b7f9539a-7343-4070-94ac-d2bc32c48fc1',
  '96b47f6d-1005-4531-9336-93a2a798dd22',
  '4aeda2d1-130c-4f22-9a31-9bba3198264a',
  '0586fcf6-959d-4bcd-a6dc-bb9f3995cfe4',
  '90019ff7-9264-40fe-9cf3-00c7d41c1b92',
  '586ceb0e-2504-440d-9972-997af51914d1',
  'c91a786a-9864-4735-a18a-a5791969d23d',
  '644b9512-cf6f-46de-ba11-535c0255b373'
]
const POINT_SEARCH_KEYS = [
  '44efe0ce-4eeb-4ea3-a425-d9355b61e886',
  '98270eae-5ead-43d3-a2eb-2a0c150d660d',
  '54859190-2d05-4882-b44e-41513d34bf99',
  '650c4be4-ce15-446e-81ef-99525c200558',
  '36338186-4ec8-4bb6-926b-6708908b299e',
  'b240cb9e-32b6-4d51-a448-605900dcadaa',
  '64e73b69-f266-4cc8-bfbc-db7227346eb5',
  'edf2caef-d0b7-42b9-8423-0f9744448da8',
  '44efe0ce-4eeb-4ea3-a425-d9355b61e886',
  '54859190-2d05-4882-b44e-41513d34bf99',
  'c8ca8d47-c03b-48a6-86e6-f8eaa3863e64',
  '98270eae-5ead-43d3-a2eb-2a0c150d660d'
]

let PLACE_SEARCH_INDEX = 0
let POINT_SEARCH_INDEX = 0

function placeSearch (value) {
  return new Promise((resolve, reject) => {
    const key = PLACE_SEARCH_KEYS[PLACE_SEARCH_INDEX]
    if (!key) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({ error: 'Yandex Geo Coder key is expired' })
      return
    }

    // const userId = JSON.parse(localStorage.getItem('user_id'))
    // console.log(userId)

    const currentUser = {
      shipperId: localStorage.getItem('shipper_id')
    }
    const shipperID = JSON.parse(currentUser.shipperId)
    let currendCordinate = '69.241320,41.292906'
    if (shipperID && shipperID == '48dbaa52-cf12-4fad-b258-15f29392aabd') {
      currendCordinate = '41.3833318,60.3666652'
    } else {
      currendCordinate = '69.241320,41.292906'
    }
    console.log('111', currendCordinate)

    if (value) {
      axios({
        method: 'get',
        url: 'https://search-maps.yandex.ru/v1/',
        params: {
          type: 'biz',
          apikey: key,
          text: value,
          lang: 'ru-RU',
          results: 5,
          ll: currendCordinate,
          spn: '1.5,1.5',
          rspn: 1
        }
      })
        .then(res => {
          const members = res.data.features
          if (members.length > 0) {
            const result = members.map(map => {
              return {
                name: map.properties.name,
                description: map.properties.description,
                latlong: {
                  lat: map.geometry.coordinates[1],
                  lon: map.geometry.coordinates[0]
                },
                type: map.geometry.type
              }
            })
            resolve(result)
          } else {
            resolve([])
          }
          console.log(res)
        })
        .catch(err => {
          console.log(err)
          // if (err.response.status === 403) {
          PLACE_SEARCH_INDEX++
          console.log('geocored next key selected')
          placeSearch(value)
            .then(resolve)
            .catch(reject)
          // }
        })
    }
  })
}

function pointSearch (value) {
  return new Promise((resolve, reject) => {
    const key = POINT_SEARCH_KEYS[POINT_SEARCH_INDEX]
    if (!key) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({ error: 'Yandex Organization key is expired' })
      return
    }

    const currentUser = {
      shipperId: localStorage.getItem('shipper_id')
    }
    const shipperID = JSON.parse(currentUser.shipperId)
    let currentCity = '69.241320,41.292906'
    if (shipperID && shipperID == '48dbaa52-cf12-4fad-b258-15f29392aabd') {
      currentCity = '60.413404800938814,41.38964116445228'
    } else {
      currentCity = '69.241320,41.292906'
    }
    console.log('1112', currentCity)

    if (value) {
      axios({
        method: 'get',
        url: 'https://geocode-maps.yandex.ru/1.x/',
        params: {
          format: 'json',
          apikey: key,
          geocode: value,
          sco: 'latlong',
          lang: 'ru-RU',
          results: 5,
          ll: currentCity,
          // ll: '60.413404800938814,41.38964116445228', // new state
          spn: '6.5,6.5',
          rspn: 1
        }
      })
        .then(res => {
          const members = res.data.response.GeoObjectCollection.featureMember
          if (members.length > 0) {
            const result = members.map(map => {
              return {
                name: map.GeoObject.name,
                latlong: {
                  lat: map.GeoObject.Point.pos.split(' ')[1],
                  lon: map.GeoObject.Point.pos.split(' ')[0]
                },
                type: map.GeoObject.metaDataProperty.GeocoderMetaData.kind,
                description: map.GeoObject.description
              }
            })
            resolve(result)
          } else {
            resolve([])
          }
          console.log(res)
        })
        .catch(err => {
          console.log(err)
          // if (err.response.status === 403) {
          console.log('next point key selected')
          POINT_SEARCH_INDEX++
          pointSearch(value)
            .then(resolve)
            .catch(reject)
          // }
        })
    }
  })
}

function orginalSearch (value) {
  return new Promise((resolve, reject) => {
    const key = POINT_SEARCH_KEYS[POINT_SEARCH_INDEX]
    if (!key) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({ error: 'Yandex Organization key is expired' })
      return
    }
    axios({
      method: 'get',
      url: 'https://api-maps.yandex.ru/services/search//v2/',
      params: {
        callback: 'id_162062117701229998178',
        format: 'json',
        apikey: key,
        token: 'a92f371bcb4ac5a6f635e909c03a2d50',
        text: value,
        type: 'geo',
        properties: 'addressdetails',
        geocoder_sco: 'latlong',
        origin: 'jsapi2searchcontrol',
        lang: 'ru-RU',
        results: 5,
        rspn: 0
      }
    }).then(result => {
      const points = result.data.features
      if (points.length > 0) {
        const res = points.map(e => {
          return {
            name: e.properties.name,
            description: e.properties.name + ', ' + e.properties.description,
            type: e.geometry.type,
            latlong: {
              lat: e.geometry.coordinates[1],
              long: e.geometry.coordinates[0]
            }
          }
        })
        resolve(res)
      } else resolve([])
    })
  })
}

// login: don10244096
// password: oybek1024_4096 || don1024_4096
//
// geocoder: 8fb635ed-f033-4166-8286-a5388bb7d9a9
// pointsearch: 90019ff7-9264-40fe-9cf3-00c7d41c1b92
//
//
//
// login: oybekmukhiddinov
// password: oybek10244096
//
// geocoder: 3e9a1241-7241-4975-b2a1-77203e9c0333
// pointsearch: a80458a5-709e-453d-831a-ae89e1db36a5

// login: islom0669
// password: islom06_69
// geocoder: 679a08be-aa49-4a79-ad31-80c65dda374a
// pointSearch: 586ceb0e-2504-440d-9972-997af51914d1

export { placeSearch, pointSearch, orginalSearch }
