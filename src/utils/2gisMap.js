import axios from 'axios'
    // street, building,
    function geo2gisSearch (value) {
        return new Promise((resolve, reject) => {
            if (value) {
                axios({
                    url: 'https://catalog.api.2gis.ru/3.0/suggests',
                    method: 'get',
                    params: {
                        q: value,
                        viewpoint1: '69.273248559837,41.35804542799807',
                        viewpoint2: '69.3005431542223,41.3534721537303',
                        fields: 'items.name_ex,items.rubrics,items.org,items.adm_div,items.routes,items.type,items.subtype,items.address,items.search_attributes.personal_priority,items.search_attributes.dgis_source_type,items.segment_id,items.region_id,items.locale,items.group,items.context,search_attributes,items.flags',
                        type: 'adm_div.region,adm_div.district_area,adm_div.city,adm_div.settlement,adm_div.district,adm_div.living_area,adm_div.division,adm_div.place,street,branch,building,road,attraction,crossroad,route,route_type,station,station.metro,user_queries,attribute,rubric,meta_rubric,org,market.category,market.attribute,market.suggestor_category',
                        locale: 'ru_UZ',
                        key: 'rurwqh1414'
                    }
                }).then(response => {
                  console.log(response)
                    const results = response.data.result.items
                    if (results && results.length > 0) {
                        const addresses = results.filter(res => { return res.type !== 'user_query' }).map(res => {
                          var addressName
                          if (res.type === 'building' || res.type === 'street' || res.type === 'district' || res.type === 'address' || res.type === 'adm_div') {
                            addressName = res.adm_div.filter(divs => { return divs.type === 'region' })[0].name
                          } else {
                            addressName = res.address_name
                          }
                          return {
                                name: res.name,
                                id: res.id,
                                type: res.type,
                                address_name: addressName
                            }
                        })
                        resolve(addresses)
                    } else {
                        resolve([])
                    }
                })
            }
        })
    }
    function getById (value) {
        return new Promise((resolve, reject) => {
            if (value) {
                axios({
                    url: 'https://catalog.api.2gis.ru/3.0/items/byid',
                    method: 'get',
                    params: {
                        id: value,
                        viewpoint1: '69.273248559837,41.35804542799807',
                        viewpoint2: '69.3005431542223,41.3534721537303',
                        fields: 'items.locale,items.flags,search_attributes,items.adm_div,items.region_id,items.segment_id,items.reviews,items.point,request_type,context_rubrics,items.links,items.name_ex,items.org,items.group,items.dates,items.external_content,items.contact_groups,items.comment,items.ads.options,items.email_for_sending.allowed,items.stat,items.stop_factors,items.description,items.geometry.centroid,items.geometry.selection,items.geometry.style,items.timezone_offset,items.context,items.level_count,items.address,items.is_paid,items.access,items.access_comment,items.capacity,items.schedule,items.floors,ad,items.rubrics,items.routes,items.platforms,items.directions,items.barrier,items.reply_rate,items.purpose,items.attribute_groups,items.route_logo,items.has_goods,items.has_apartments_info,items.has_pinned_goods,items.has_realty,items.has_payments,items.is_promoted,items.delivery,items.order_with_cart,search_type',
                        locale: 'ru_UZ',
                        key: 'rurwqh1414'
                    }
                }).then(response => {
                    console.log(response)
                    const result = response.data.result.items
                    console.log(result)
                    if (result) {
                        var location = result[0].point
                        resolve(location)
                    } else {
                        resolve({})
                      // eslint-disable-next-line prefer-promise-reject-errors
                      reject()
                    }
                })
            }
        })
    }
    function geoCode2gis (value) {
        return new Promise((resolve, reject) => {
            if (value) {
              axios({
                method: 'get',
                url: 'https://catalog.api.2gis.ru/3.0/items/geocode',
                params: {
                  lat: value[0],
                  lon: value[1],
                  key: 'rurwqh1414',
                  fields: 'items.point',
                }
              }).then(res => {
                const location = res.data.result.items[0].name
                console.log(res)
                resolve(location)
                })
            }
        })
    }
    function geoMapSearch (value) {
        return new Promise((resolve, reject) => {
            if (value) {
                axios({
                    method: 'get',
                    url: 'https://geocode-maps.yandex.ru/1.x/',
                    params: {
                        format: 'json',
                        apikey: '63692694-f926-4124-92cb-8cf1dabbc883',
                        geocode: value,
                        sco: 'latlong',
                        lang: 'ru-RU',
                        results: 5,
                        ll: '69.241320,41.292906',
                        spn: '6.5,6.5',
                        rspn: 1
                    }
                }).then(res => {
                    const members = res.data.response.GeoObjectCollection.featureMember
                    if (members.length > 0) {
                        const result = members.map(map => {
                            return {
                                name: map.GeoObject.name,
                                latlong: map.GeoObject.Point.pos.split(' '),
                                type: map.GeoObject.metaDataProperty.GeocoderMetaData.kind,
                                description: map.GeoObject.description
                            }
                        })
                        resolve(result)
                    } else resolve([])
                    console.log(res)
                })
            }
        })
    }

export { geo2gisSearch, geoMapSearch, geoCode2gis, getById }
