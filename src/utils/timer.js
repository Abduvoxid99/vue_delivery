import i18n from '@/locales'
export default {
  timer (createdTime, statusNotes) {
    const diff = Math.abs(Date.now() - Date.parse(createdTime))
    return this.statusNotes(statusNotes) !== '' ? this.timeFormat(Math.abs(Date.parse(createdTime) - Date.parse(this.statusNotes(statusNotes)))) : this.timeFormat(diff)
  },
  deadlineTimer (createdTime, statusNotes, finishedTime, deadlineTime) {
    const diff = Math.abs(Date.now() - Date.parse(createdTime))
    return this.statusNotes(statusNotes) !== '' ? this.timeDeadlineFormat((Math.abs(Date.parse(createdTime) - finishedTime === '' ? 0 : Date.parse(finishedTime))), deadlineTime) : this.timeDeadlineFormat(diff, deadlineTime)
  },
  acceptedTimer (acceptedTime, statusNotes, finishedTime) {
    const diff = Math.abs(Date.now() - Date.parse(acceptedTime))
    return this.statusNotes(statusNotes) !== '' ? this.timeFormat(Math.abs(Date.parse(acceptedTime) - Date.parse(finishedTime))) : this.timeFormat(diff)
  },
  timeDeadlineFormat (diff, deadline) {
    if (diff !== 0) {
      let h, m, s
      // const staticTime = 45 * 60 * 1000
      console.log('diff', Math.floor(Math.abs((diff) / 1000)) / 60)
      if (diff >= 1000) s = Math.floor(Math.abs((diff) / 1000))
      else s = 0
      if (s > 0) {
        m = Math.floor(s / 60)
        s = s - m * 60
      } else m = 0
      if (m > 0) {
        h = Math.floor(m / 60)
        m = m - h * 60
      } else h = 0
      return {
        time: (h !== 0 ? h : '0') + ' : ' + (m !== 0 ? ((m < 10) ? ('0' + m) : m) : '0') + ' : ' + ((s < 10) ? ('0' + s) : s),
        isLate: diff,
        color: this.colorDeadlineTime(diff, deadline)
      }
    } else return '0' + ' ' + i18n.t('sec')
  },
  colorDeadlineTime (val, deadline) {
    const t = Math.floor(Math.floor(Math.abs((val) / 1000)) / 60)
    if (t >= (deadline - 5) && t < deadline) {
      return 'orange'
    } else if (t >= deadline) {
      return 'red'
    } else if (t < (deadline - 5)) {
      return 'green'
    }
  },
  timeFormat (value) {
    if (value !== 0) {
      let h, m, s
      // const staticTime = 45 * 60 * 1000
      if (value >= 1000) s = Math.floor(Math.abs((value) / 1000))
      else s = 0
      if (s > 0) {
        m = Math.floor(s / 60)
        s = s - m * 60
      } else m = 0
      if (m > 0) {
        h = Math.floor(m / 60)
        m = m - h * 60
      } else h = 0
      return {
        time: (h !== 0 ? h : '0') + ' : ' + (m !== 0 ? ((m < 10) ? ('0' + m) : m) : '0') + ' : ' + ((s < 10) ? ('0' + s) : s),
        isLate: value,
        color: this.colorTime(value)
      }
    } else return '0' + ' ' + i18n.t('sec')
    // c4227d1b-c317-46f8-b1e3-a48c2496206f branchCancelled
    // 6ba783a3-1c2e-479c-9626-25526b3d9d36 couirerCancelled
    // b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1 operatorCancelled
    // d39cb255-6cf5-4602-896d-9c559d40cbbe serverCancelled
    // e665273d-5415-4243-a329-aee410e39465 finished
  },
  colorTime (val) {
    const t = val / 100000
    if (t > 18 && t < 24) {
      return 'orange'
    } else if (t > 24) return 'red'
    return 'green'
  },
  statusNotes (array) {
    if (array && array.length > 0) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].status_id === 'c4227d1b-c317-46f8-b1e3-a48c2496206f' ||
          array[i].status_id === '6ba783a3-1c2e-479c-9626-25526b3d9d36' ||
          array[i].status_id === 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1' ||
          array[i].status_id === 'd39cb255-6cf5-4602-896d-9c559d40cbbe' ||
          array[i].status_id === 'e665273d-5415-4243-a329-aee410e39465') {
          return array[i].created_at
        }
      }
      return ''
    } else return ''
  }
}
