/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/8.4.3/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.4.3/firebase-messaging.js')

const firebaseConfig = {
  apiKey: 'AIzaSyAOh043tDGUFBbpIuoYvOuQNWGMB5JisxQ',
  authDomain: 'delever-1745c.firebaseapp.com',
  projectId: 'delever-1745c',
  storageBucket: 'delever-1745c.appspot.com',
  messagingSenderId: '733773630256',
  appId: '1:733773630256:web:bdb52ec69e30e2d7bbd6f5',
  measurementId: 'G-H1SNXHT7ST'
}

firebase.initializeApp(firebaseConfig)
firebase.messaging()
const messaging = firebase.messaging()

messaging.onBackgroundMessage((e) => {
    console.log('Public testing sevice worker', e)
    // Customize notification here
    self.registration.showNotification(e.notification.title,
      {
        body: 'У вас новый заказ 🥳',
        icon: payload.notification.image,
        image: payload.notification.image,
        data: { url: e.data.order_id }
      })
})
