export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const FILE_URL_RULE = /((http|https):\/\/[\w\d_\-.]+\.[\w\d]{2,}([:\d]+)?(\/[\w\d\-._?,'/\\+&%$#=~]*)?)/