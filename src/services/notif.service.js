import { NotifModel } from 'models/notif.model'
import { UserService } from './user.service'
import { cloneDeep } from 'lodash'

const createNewNotif = async (data) => {
  // data = {
  //   userReceivedId: 'askdjioasjd',
  //   userSentId: 'dsaDSAjdisaji',
//   "userSent" : {
//     _id:
//     avatar:
//     displayName
// },
  //   typeNofif: 'FOLLOW' || 'COMMEMT' || 'INVITE' || 'POST',
  //   desc: {
  //   en: 'She has started following your profile',
  //   vi: 'Cô ấy đã bắt đầu theo dõi trang cá nhân của bạn'
  //  },
  //  content: {
  // 'FOLLOW'
  // listUrlAvatar: ['asd', 'sad', 'asfhjasg'],
  // moreUrlAvatar: 0
  // 'COMMENT'
  // comment: 'asbfjashfklasnkflanskfnksa'
  // 'INVITE'
  // inviteStatus: 'PENDING', 'ACCEPTED', 'REJECTED'
  // 'POST'
  // urlPhotoBlog: 'asknfklasnfkl',
  // moreUrlPhotoBlog: 4,
  // contentBlog
  // }
  // }
  console.log('🚀 ~ file: notif.service.js:4 ~ createNewBoardNotif ~ data:', data)
  try {
    if (data?.typeNofif === 'FOLLOW') {
      // Thêm content cho data
      const listUrlAvatarReturn = await UserService.getListUrlAvatar({
        userReceivedId: data.userReceivedId,
        userSentId: data.userSentId
      })
      console.log('🚀 ~ file: notif.service.js:35 ~ createNewNotif ~ listUrlAvatarReturn:', listUrlAvatarReturn)
      data.content = {
        listUrlAvatar: listUrlAvatarReturn.listUrlAvatar,
        moreUrlAvatar: listUrlAvatarReturn.moreUrlAvatar
      }
    }
    // Tạo thêm thông báo mới
    const createdNotif = await NotifModel.createNewNotif(data)
    const getCreatedNotif = await NotifModel.findOneById(createdNotif.insertedId.toString())
    // Sau khi tạo được rồi thì lấy id đó cho bên user service để:
    // 1. Updated cái thằng followingIds của thằng userSentId
    // 2. Updated cái thằng followedIds của thằng userReceivedId
    // 3. Updated cái thằng notifIds của thằng userReceivedId (nghĩa là thằng nhận có một thông báo mới)
    const dataBothUser = await UserService.update({
      userReceivedId: data.userReceivedId,
      userSentId: data.userSentId,
      notifId: createdNotif.insertedId.toString(),
      typeNofif: data.typeNofif
    })
    // trả về FE
    // FE nhận và emit một sự kiện đến BE => thằng user nhận được và hiện thông báo lên

    const result = {
      notif: getCreatedNotif,
      userReceived: dataBothUser.updateUserFollowing,
      userSent: dataBothUser.updatedUser
    }

    console.log('🚀 ~ file: notif.service.js:31 ~ createNewBoardNotif ~ result:', result)

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getNotifs = async (data) => {
  console.log('🚀 ~ file: notif.service.js:72 ~ getNotifs ~ data:', data)
  try {
    const getNotifs = 'getNotifs'

    return getNotifs
  } catch (error) {
    throw new Error(error)
  }
}

const updateNotif = async (data) => {
  console.log('🚀 ~ file: notif.service.js:89 ~ updateNotif ~ data:', data)
  const notifId = cloneDeep(data.notifId)
  delete data.notifId
  try {
    const getNotifs = NotifModel.updateNotif(notifId, data)
    return getNotifs
  } catch (error) {
    throw new Error(error)
  }
}


const updateManyNotifs = async (data) => {
  console.log('🚀 ~ file: notif.service.js:72 ~ getNotifs ~ data:', data)
  try {
    const getNotifs = NotifModel.updateManyNotifs(data.arrayNotifs)
    return getNotifs
  } catch (error) {
    throw new Error(error)
  }
}

export const NotifService = {
  createNewNotif,
  getNotifs,
  updateNotif,
  updateManyNotifs
}


